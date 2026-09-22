import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../data/goals/jee-mains-advanced.json');
const clientDataPath = path.join(__dirname, '../../client/src/data/goals/jee-mains-advanced.json');

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Topic prerequisite map
const prerequisitesMap = {
  'Kinematics (1D & 2D Motion)': ['Mathematical Tools & Vectors', 'Basic Differential & Integral Calculus'],
  'Newton’s Laws of Motion & Friction': ['Kinematics (1D & 2D Motion)', 'Vectors'],
  'Work, Energy & Power': ['Newton’s Laws of Motion & Friction', 'Kinematics (1D & 2D Motion)'],
  'System of Particles & Rotational Dynamics': ['Work, Energy & Power', 'Newton’s Laws of Motion & Friction', 'Center of Mass'],
  'Gravitation, Elasticity & Fluid Mechanics': ['Newton’s Laws of Motion & Friction', 'Work, Energy & Power'],
  'Thermal Properties, Calorimetry & Kinetic Theory': ['Work, Energy & Power', 'Basic Thermodynamics'],
  'Thermodynamics & Heat Transfer': ['Thermal Properties, Calorimetry & Kinetic Theory'],
  'Simple Harmonic Motion & Mechanical Waves': ['Kinematics (1D & 2D Motion)', 'Newton’s Laws of Motion & Friction', 'Work, Energy & Power'],
  'Electrostatics & Gauss’s Law': ['Mathematical Tools & Vectors', 'Coulomb’s Law Basics'],
  'Capacitance & Dielectrics': ['Electrostatics & Gauss’s Law', 'Work & Potential Energy'],
  'Current Electricity & DC Circuits': ['Electrostatics & Gauss’s Law', 'Ohm’s Law & Resistance'],
  'Magnetic Effects of Current & Magnetism': ['Mathematical Tools & Vectors', 'Current Electricity & DC Circuits'],
  'Electromagnetic Induction & Alternating Currents': ['Magnetic Effects of Current & Magnetism', 'Current Electricity & DC Circuits'],
  'Electromagnetic Waves & Wave Optics': ['Oscillations & Waves', 'Maxwell’s Equations'],
  'Ray Optics & Optical Instruments': ['Geometry Basics', 'Reflection & Refraction Laws'],
  'Dual Nature, Atoms, Nuclei & Modern Physics': ['Wave Optics', 'Atomic Structure Basics'],
  'Semiconductors & Electronic Devices': ['Modern Physics Basics', 'Current Electricity'],

  // Chemistry
  'Atomic Structure & Quantum Numbers': ['Some Basic Concepts of Chemistry (Mole Concept)'],
  'Periodic Table & Periodic Properties': ['Atomic Structure & Quantum Numbers'],
  'Chemical Bonding & Molecular Structure': ['Periodic Table & Periodic Properties', 'Atomic Structure & Quantum Numbers'],
  'Chemical Thermodynamics & Thermochemistry': ['Some Basic Concepts of Chemistry (Mole Concept)'],
  'Chemical & Ionic Equilibrium': ['Some Basic Concepts of Chemistry (Mole Concept)', 'Chemical Thermodynamics'],
  'Redox Reactions & Electrochemistry': ['Chemical & Ionic Equilibrium', 'Chemical Bonding'],
  'Chemical Kinetics & Surface Chemistry': ['Chemical & Ionic Equilibrium', 'Chemical Thermodynamics'],
  'Solutions & Colligative Properties': ['Some Basic Concepts of Chemistry (Mole Concept)', 'Thermodynamics'],
  'Coordination Compounds': ['Chemical Bonding & Molecular Structure', 'd-Block Elements'],
  'General Organic Chemistry (GOC) & Reaction Mechanisms': ['Chemical Bonding & Molecular Structure', 'Hybridization'],
  'Hydrocarbons (Alkanes, Alkenes, Alkynes, Aromatic)': ['General Organic Chemistry (GOC) & Reaction Mechanisms'],
  'Haloalkanes, Haloarenes & Alcohols': ['Hydrocarbons', 'General Organic Chemistry (GOC) & Reaction Mechanisms'],
  'Aldehydes, Ketones & Carboxylic Acids': ['Haloalkanes, Haloarenes & Alcohols'],
  'Organic Nitrogen Compounds & Biomolecules': ['Aldehydes, Ketones & Carboxylic Acids'],

  // Mathematics
  'Complex Numbers & Quadratic Equations': ['Basic Algebra & Factorization'],
  'Sequences, Series & Progression': ['Quadratic Equations'],
  'Binomial Theorem, Permutations & Combinations': ['Basic Algebra', 'Factorial Notation'],
  'Matrices & Determinants': ['Linear Equations & Algebra'],
  'Trigonometric Functions, Equations & Identities': ['Geometry & Angle Measures'],
  'Straight Lines & Pairs of Straight Lines': ['Coordinate System Basics', 'Trigonometry Basics'],
  'Circles & System of Circles': ['Straight Lines & Pairs of Straight Lines'],
  'Conic Sections (Parabola, Ellipse, Hyperbola)': ['Circles & System of Circles', 'Straight Lines'],
  'Limits, Continuity & Differentiability': ['Functions & Relations', 'Algebra'],
  'Application of Derivatives (AOD)': ['Limits, Continuity & Differentiability'],
  'Indefinite & Definite Integrals': ['Application of Derivatives (AOD)', 'Limits, Continuity & Differentiability'],
  'Differential Equations': ['Indefinite & Definite Integrals', 'Application of Derivatives'],
  'Vector Algebra & 3D Geometry': ['Straight Lines', 'Trigonometry', 'Vectors Basics'],
  'Probability & Statistics': ['Permutations & Combinations', 'Binomial Theorem']
};

const defaultLearningCycle = [
  { id: 'learn', label: '1. Concept Learning', desc: 'Watch lecture / core concept derivation' },
  { id: 'understand', label: '2. Detailed Derivations & Notes', desc: 'Create formula summary sheets & theory notes' },
  { id: 'practice', label: '3. Basic & Standard Practice', desc: 'Solve 20-30 foundational illustrations' },
  { id: 'main_pyq', label: '4. JEE Main PYQs', desc: 'Practice last 5 years chapter-wise NTA questions' },
  { id: 'adv_problem', label: '5. JEE Advanced Multi-Concept', desc: 'Solve multi-chapter subjective & multi-correct questions' },
  { id: 'revision', label: '6. Spaced Revision & Mistakes', desc: 'Audit error notebook and revise formula traps' },
  { id: 'test', label: '7. Timed Topic Mock Test', desc: 'Test speed and accuracy in 45-min test' }
];

// Enrich each stage and topic
data.roadmap.stages.forEach(stage => {
  stage.topics.forEach(topic => {
    // 1. Prerequisites
    if (!topic.prerequisites || topic.prerequisites.length === 0) {
      topic.prerequisites = prerequisitesMap[topic.title] || ['Foundational PCM Class 10/11'];
    }

    // 2. Learning Cycle Steps
    topic.learningSteps = defaultLearningCycle.map(step => ({
      ...step,
      completed: false
    }));

    // 3. JEE Main Layer
    if (!topic.jeeMainLayer || topic.jeeMainLayer.length === 0) {
      topic.jeeMainLayer = [
        'Master standard formulas and definitions without missing any edge cases',
        'Solve 40-50 single-concept numerical value and MCQ questions',
        'Practice 5 years of JEE Main chapter-wise PYQs under 1.5 min per question timing',
        'Target 100% accuracy on standard direct-application questions'
      ];
    }

    // 4. JEE Advanced Layer
    if (!topic.jeeAdvancedLayer || topic.jeeAdvancedLayer.length === 0) {
      topic.jeeAdvancedLayer = [
        'Analyze multi-concept synthesis with calculus, vectors, and cross-topic coupling',
        'Solve Physics Galaxy Advanced Illustrations and multi-correct assertion-reason problems',
        'Practice subjective derivations and matrix-match questions from 15-year Advanced archives',
        'Condition analytical problem-solving resilience for high-difficulty questions'
      ];
    }

    // 5. Dedicated Topic Resources
    if (!topic.resources || topic.resources.length === 0) {
      const topicResources = [];

      if (stage.subject === 'Physics') {
        topicResources.push({
          name: `Physics Galaxy: ${topic.title} Video Masterclass & Booster`,
          provider: 'Physics Galaxy / Ashish Arora',
          subject: 'Physics',
          topic: topic.title,
          resourceType: 'concept_video',
          url: 'https://www.physicsgalaxy.com/',
          isFree: true,
          examLevel: 'Both Main & Advanced',
          description: `Exhaustive visual concept explanations, derivations, and Advanced Illustrations by Ashish Arora for ${topic.title}.`
        });
        topicResources.push({
          name: `MathonGo / NTA: ${topic.title} JEE Main & Advanced PYQs`,
          provider: 'MathonGo & Official NTA Archives',
          subject: 'Physics',
          topic: topic.title,
          resourceType: 'practice_platform',
          url: 'https://www.mathongo.com/jee-main/pyq',
          isFree: true,
          examLevel: 'Both Main & Advanced',
          description: `Chapter-wise solved previous year questions with step-by-step analysis for ${topic.title}.`
        });
      } else if (stage.subject === 'Chemistry') {
        topicResources.push({
          name: `Official NCERT e-Textbook: ${topic.title}`,
          provider: 'NCERT Official Portal (ncert.nic.in)',
          subject: 'Chemistry',
          topic: topic.title,
          resourceType: 'doc',
          url: 'https://ncert.nic.in/textbook.php',
          isFree: true,
          examLevel: 'JEE Main',
          description: `Line-by-line official NCERT textbook reading, in-text examples, and exemplar exercises for ${topic.title}.`
        });
        topicResources.push({
          name: `MathonGo Chemistry: ${topic.title} PYQ Bank`,
          provider: 'MathonGo',
          subject: 'Chemistry',
          topic: topic.title,
          resourceType: 'practice_platform',
          url: 'https://www.mathongo.com/jee-main/pyq',
          isFree: true,
          examLevel: 'Both Main & Advanced',
          description: `Categorized Main and Advanced questions for ${topic.title} with numerical answer solutions.`
        });
      } else if (stage.subject === 'Mathematics') {
        topicResources.push({
          name: `MathonGo Mathematics: ${topic.title} PYQ & Concept Drill`,
          provider: 'MathonGo / Anup Gupta',
          subject: 'Mathematics',
          topic: topic.title,
          resourceType: 'practice_platform',
          url: 'https://www.mathongo.com/jee-main/pyq',
          isFree: true,
          examLevel: 'Both Main & Advanced',
          description: `High-yield problem solving, shortcuts, and 10-year question breakdown for ${topic.title}.`
        });
        topicResources.push({
          name: `Official JEE Advanced Archive: ${topic.title} Challenging Problems`,
          provider: 'IIT JEE Official Archives',
          subject: 'Mathematics',
          topic: topic.title,
          resourceType: 'doc',
          url: 'https://jeeadv.ac.in/',
          isFree: true,
          examLevel: 'JEE Advanced',
          description: `Official past year subjective and comprehensive multi-concept problems for ${topic.title}.`
        });
      } else {
        topicResources.push({
          name: 'NTA Official National Mock Exam Portal',
          provider: 'National Testing Agency (NTA)',
          subject: 'PCM Integrated',
          topic: topic.title,
          resourceType: 'mock_test',
          url: 'https://nta.ac.in/Quiz',
          isFree: true,
          examLevel: 'Both Main & Advanced',
          description: 'Official online 3-hour Computer Based Test (CBT) interface simulation with real exam scoring.'
        });
      }

      topic.resources = topicResources;
    }
  });
});

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(clientDataPath, JSON.stringify(data, null, 2), 'utf8');

console.log('Successfully enriched JEE Main + Advanced data on server and client!');
