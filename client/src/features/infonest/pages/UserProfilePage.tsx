import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { SkillConstellation3D } from '../components/3d/SkillConstellation3D';
import { HolographicCard3D } from '../components/3d/HolographicCard3D';
import { useApp } from '../context/AppContext';
import { sounds } from '../services/soundManager';
import {
  User,
  Flame,
  Award,
  Target,
  BookOpen,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Trophy
} from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { currentUser, courses, roadmaps, goals } = useApp();

  const enrolledCourses = courses.filter(c => c.isEnrolled);

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full space-y-8">
        {/* Profile Card Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 relative overflow-hidden bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-black">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-purple-500/30 shadow-2xl"
                />
                <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full ring-4 ring-[#090B12]" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{currentUser.name}</h1>
                  <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">{currentUser.handle}</p>
                <p className="text-xs text-slate-300 max-w-lg leading-relaxed pt-1">{currentUser.bio}</p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
              <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-2">
                <span className="text-lg">💎</span>
                <div>
                  <span className="text-xs font-mono block">Knowledge Balance</span>
                  <span className="text-base font-bold font-mono text-white">{currentUser.knowledgeTokens.toLocaleString()} KT</span>
                </div>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-300 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
                <div>
                  <span className="text-xs font-mono block">Active Streak</span>
                  <span className="text-base font-bold font-mono text-white">{currentUser.streakDays} Days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Skill Constellation & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Skill Network */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Interactive 3D Skill Cosmos</span>
            </h3>
            <SkillConstellation3D skills={currentUser.skills} height={320} />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentUser.skills.map(s => (
                <span key={s} className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/5">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Enrolled Courses & Verified Certs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Enrolled Courses */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Enrolled Masterclasses ({enrolledCourses.length})</span>
                </h3>
                <Link to="/courses" className="text-xs font-mono text-purple-400 hover:text-purple-300">
                  Course Vault →
                </Link>
              </div>

              <div className="space-y-3">
                {enrolledCourses.map(course => (
                  <div key={course.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={course.coverImage} alt={course.title} className="w-16 h-12 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">{course.title}</h4>
                        <span className="text-[11px] text-slate-400 font-mono block">By {course.creator.name}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono text-emerald-400 font-bold">{course.progressPercent}%</span>
                      <Link
                        to={`/course/${course.id}`}
                        onClick={() => sounds.playClick()}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300"
                      >
                        Resume
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Credentials */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold">
                <Award className="w-4 h-4" />
                <span>VERIFIED CERTIFICATES & CREDENTIALS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <HolographicCard3D glowColor="purple" className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                      Level 3 Credential
                    </span>
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Frontier AI Systems Architect</h4>
                  <p className="text-[11px] text-slate-400 font-mono">ID: INFONEST-CERT-AI-84920</p>
                </HolographicCard3D>

                <HolographicCard3D glowColor="cyan" className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded">
                      Specialist Credential
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Spatial WebGL & Shader Specialist</h4>
                  <p className="text-[11px] text-slate-400 font-mono">ID: INFONEST-CERT-3D-91024</p>
                </HolographicCard3D>
              </div>
            </div>

            {/* SIGNATURE FEATURE: LEARNING DNA */}
            <div className="glass-panel rounded-3xl p-6 border border-purple-500/20 space-y-4 bg-gradient-to-br from-purple-950/20 to-black">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">🧬</span>
                    <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                      Learning DNA Fingerprint
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Personalized visual interest distribution based on completions & saved drops
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Updated Live
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { name: 'Reasoning AI & Agents', percentage: 92, level: 'Frontier Expert', color: 'from-purple-500 to-indigo-500' },
                  { name: 'Distributed Systems & Cloud', percentage: 84, level: 'Advanced Architect', color: 'from-cyan-500 to-blue-500' },
                  { name: 'Data Structures & Algorithms', percentage: 88, level: 'Advanced Problem Solver', color: 'from-emerald-500 to-teal-500' },
                  { name: 'Frontend Architecture & WebGPU', percentage: 78, level: 'Proficient Engineer', color: 'from-pink-500 to-rose-500' },
                  { name: 'System Security & Cryptography', percentage: 65, level: 'Practitioner', color: 'from-amber-500 to-orange-500' }
                ].map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-200 font-semibold">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[11px]">{item.level}</span>
                        <span className="text-white font-bold">{item.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-700`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SIGNATURE FEATURE: KNOWLEDGE PROOFS */}
            <div className="glass-panel rounded-3xl p-6 border border-emerald-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                      Verified Knowledge Proofs
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Cryptographically verifiable proof of completed lectures, projects, and hours
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  3 Proofs Stored
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {[
                  {
                    num: 1024,
                    title: 'Advanced React Architecture & Performance Engineering',
                    date: 'March 14, 2026',
                    lectures: 12,
                    projects: 3,
                    quizzes: 2,
                    hours: 18,
                    hash: '0x7f4e92a...c31b'
                  },
                  {
                    num: 1018,
                    title: 'High-Throughput Distributed Systems & Kafka Mesh',
                    date: 'February 28, 2026',
                    lectures: 8,
                    projects: 2,
                    quizzes: 4,
                    hours: 24,
                    hash: '0x9d21c4b...882a'
                  },
                  {
                    num: 982,
                    title: 'Deep Learning Foundations & Transformer Mechanics',
                    date: 'January 19, 2026',
                    lectures: 14,
                    projects: 4,
                    quizzes: 3,
                    hours: 32,
                    hash: '0x3a82f10...4e69'
                  }
                ].map((proof) => (
                  <div
                    key={proof.num}
                    className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">
                          Proof #{proof.num}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">{proof.date}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {proof.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                        <span>{proof.lectures} lectures</span>
                        <span>·</span>
                        <span>{proof.projects} projects</span>
                        <span>·</span>
                        <span>{proof.quizzes} quizzes</span>
                        <span>·</span>
                        <span className="text-cyan-300">{proof.hours} hours</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-slate-500 block">Verification Hash</span>
                      <code className="text-[11px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        {proof.hash}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
