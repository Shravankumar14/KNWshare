import dns from 'dns/promises';
import net from 'net';
import nodemailer from 'nodemailer';

const testTcp = (host, port, timeoutMs = 3500) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isResolved = false;

    const timer = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        socket.destroy();
        resolve({ host, port, status: 'TIMEOUT', message: `Connection timed out after ${timeoutMs}ms` });
      }
    }, timeoutMs);

    socket.connect(port, host, () => {
      if (!isResolved) {
        isResolved = true;
        clearTimeout(timer);
        socket.end();
        resolve({ host, port, status: 'CONNECTED', message: 'Connected successfully' });
      }
    });

    socket.on('error', (err) => {
      if (!isResolved) {
        isResolved = true;
        clearTimeout(timer);
        resolve({ host, port, status: 'ERROR', code: err.code, message: err.message });
      }
    });
  });
};

export const runSmtpDiagnostics = async () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM || user;

  const envCheck = {
    SMTP_HOST: host || null,
    SMTP_PORT: process.env.SMTP_PORT || null,
    SMTP_USER: user ? `${user.substring(0, 3)}***` : null,
    has_SMTP_PASS: !!pass,
    EMAIL_FROM: from || null,
  };

  const results = {
    env: envCheck,
    dns: null,
    tcpPorts: {},
    transporterVerify: null,
  };

  if (!host) {
    results.dns = { error: 'No SMTP_HOST configured' };
    return results;
  }

  // 1. DNS check
  try {
    const dnsRes = await dns.lookup(host);
    results.dns = { address: dnsRes.address, family: dnsRes.family };
  } catch (dnsErr) {
    results.dns = { error: dnsErr.message, code: dnsErr.code };
  }

  // 2. TCP socket tests on various ports
  const portsToTest = Array.from(new Set([port, 587, 465, 2525]));
  for (const p of portsToTest) {
    results.tcpPorts[p] = await testTcp(host, p, 3500);
  }

  // 3. Transporter verify test with timeout
  if (host && user && pass) {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 3500,
      greetingTimeout: 3500,
      socketTimeout: 3500,
    });

    try {
      const verifyPromise = transporter.verify();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('transporter.verify timed out after 4000ms')), 4000)
      );
      await Promise.race([verifyPromise, timeoutPromise]);
      results.transporterVerify = { success: true, message: 'SMTP connection & auth verified successfully' };
    } catch (verifyErr) {
      results.transporterVerify = {
        success: false,
        code: verifyErr.code || 'UNKNOWN',
        command: verifyErr.command,
        response: verifyErr.response,
        responseCode: verifyErr.responseCode,
        message: verifyErr.message,
      };
    }
  } else {
    results.transporterVerify = {
      success: false,
      message: 'Skipped verify: missing host, user, or pass',
    };
  }

  return results;
};
