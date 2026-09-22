import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data');
const roadmapsDir = path.join(dataDir, 'roadmaps');
if (!fs.existsSync(roadmapsDir)) {
  fs.mkdirSync(roadmapsDir, { recursive: true });
}

// 1. JEE Main & Advanced
const existingJeePath = path.join(dataDir, 'goals', 'jee-mains-advanced.json');
const rawJee = JSON.parse(fs.readFileSync(existingJeePath, 'utf8'));

const jeeRoadmapData = {
  goal: {
    ...rawJee.goal,
    title: 'JEE Main & Advanced',
    slug: 'jee-main-advanced',
    shortDescription: 'Rigorous 2-year PCM curriculum aligned with official NTA & IIT JEE Advanced syllabus',
    active: true,
    order: 1
  },
  roadmap: {
    title: 'JEE Main & Advanced Complete PCM Roadmap',
    totalEstimatedHours: rawJee.roadmap?.totalEstimatedHours || 650,
    version: 1,
    stages: (rawJee.roadmap?.stages || []).map((stage, idx) => ({
      stageNumber: stage.stageNumber || (idx + 1),
      title: stage.title,
      description: stage.shortSummary || stage.title,
      subject: stage.subject || 'PCM',
      order: idx + 1,
      estimatedHours: stage.estimatedHours || 30,
      difficulty: stage.stageNumber <= 3 ? 'beginner' : stage.stageNumber <= 7 ? 'intermediate' : 'advanced',
      learningObjectives: [
        `Master fundamental theory and principles for ${stage.title}`,
        'Solve standard NCERT exercises and exemplar problems',
        'Analyze previous 10 years JEE Main and Advanced questions'
      ],
      practiceRequirements: [
        'Complete 30-50 practice problems with speed drills',
        'Review and log negative marks in error notebook'
      ],
      skippableIfExperienced: false,
      topics: (stage.topics || []).map((t, tIdx) => ({
        title: t.title,
        description: t.description || `Core concepts and problem solving for ${t.title}`,
        order: tIdx + 1,
        estimatedHours: t.estimatedHours || 10,
        difficulty: t.importance === 'high' ? 'intermediate' : 'beginner',
        skills: t.skills || [stage.subject || 'PCM', 'Problem Solving'],
        subtopics: t.subtopics || [],
        subject: stage.subject || 'PCM',
        resources: (t.resources || []).map(r => ({
          name: r.name || r.title || 'Recommended Resource',
          title: r.title || r.name || 'Recommended Resource',
          provider: r.provider || 'NTA / Official',
          type: r.resourceType?.includes('video') ? 'video' : r.resourceType === 'doc' ? 'documentation' : 'practice',
          url: r.url?.startsWith('http') ? r.url : 'https://nta.ac.in/Downloads',
          description: r.description || '',
          free: r.isFree !== undefined ? r.isFree : true,
          language: 'English & Hindi'
        }))
      }))
    }))
  },
  resources: (rawJee.resources || []).map(r => ({
    title: r.title,
    provider: r.provider || 'JEE Preparation Portal',
    type: r.type === 'youtube_playlist' ? 'playlist' : r.type === 'youtube_video' ? 'video' : r.type === 'doc' ? 'documentation' : 'practice',
    url: r.url?.startsWith('http') ? r.url : 'https://nta.ac.in/Downloads',
    description: r.description || '',
    stageNumber: r.stageNumber || 1,
    topicTitle: r.topicTitle || '',
    free: r.free !== undefined ? r.free : true,
    language: 'English & Hindi',
    verified: true
  }))
};

fs.writeFileSync(path.join(roadmapsDir, 'jee-main-advanced.json'), JSON.stringify(jeeRoadmapData, null, 2));
console.log('Generated jee-main-advanced.json');

// 2. Full Stack Development
const existingFsPath = path.join(dataDir, 'goals', 'full-stack-development.json');
const rawFs = JSON.parse(fs.readFileSync(existingFsPath, 'utf8'));

const fsRoadmapData = {
  goal: {
    ...rawFs.goal,
    title: 'Full Stack Development',
    slug: 'full-stack-development',
    shortDescription: 'Modern MERN architecture, responsive UI, RESTful microservices, and cloud deployment',
    active: true,
    order: 2
  },
  roadmap: {
    title: 'Full Stack Web Engineering (MERN & Cloud)',
    totalEstimatedHours: rawFs.roadmap?.totalEstimatedHours || 320,
    version: 1,
    stages: (rawFs.roadmap?.stages || []).map((stage, idx) => ({
      stageNumber: stage.stageNumber || (idx + 1),
      title: stage.title,
      description: stage.shortSummary || stage.title,
      subject: 'Web Development',
      order: idx + 1,
      estimatedHours: stage.estimatedHours || 35,
      difficulty: stage.stageNumber <= 2 ? 'beginner' : stage.stageNumber <= 4 ? 'intermediate' : 'advanced',
      learningObjectives: [
        `Understand architectural foundations of ${stage.title}`,
        'Build and test production-grade components and services',
        'Implement clean code practices, security, and error handling'
      ],
      practiceRequirements: [
        'Build at least 1 working code project or service',
        'Deploy running code with automated tests'
      ],
      skippableIfExperienced: idx === 0,
      topics: (stage.topics || []).map((t, tIdx) => ({
        title: t.title,
        description: t.description || `Core implementation for ${t.title}`,
        order: tIdx + 1,
        estimatedHours: t.estimatedHours || 8,
        difficulty: 'intermediate',
        skills: t.skills || ['JavaScript', 'Web Architecture'],
        subtopics: t.subtopics || [],
        subject: 'Web Development',
        resources: (t.resources || []).map(r => ({
          name: r.name || r.title || 'Resource',
          title: r.title || r.name || 'Resource',
          provider: r.provider || 'MDN / Official Documentation',
          type: r.resourceType?.includes('video') ? 'video' : 'documentation',
          url: r.url?.startsWith('http') ? r.url : 'https://developer.mozilla.org',
          description: r.description || '',
          free: true,
          language: 'English'
        }))
      }))
    }))
  },
  resources: (rawFs.resources || []).map(r => ({
    title: r.title,
    provider: r.provider || 'Official Documentation',
    type: r.type === 'youtube_playlist' ? 'playlist' : r.type === 'youtube_video' ? 'video' : r.type === 'doc' ? 'documentation' : 'course',
    url: r.url?.startsWith('http') ? r.url : 'https://developer.mozilla.org',
    description: r.description || '',
    stageNumber: r.stageNumber || 1,
    topicTitle: r.topicTitle || '',
    free: true,
    language: 'English',
    verified: true
  }))
};

fs.writeFileSync(path.join(roadmapsDir, 'full-stack-development.json'), JSON.stringify(fsRoadmapData, null, 2));
console.log('Generated full-stack-development.json');

// 3. Competitive Programming & DSA
const cpDsaData = {
  goal: {
    title: 'Competitive Programming & DSA',
    slug: 'competitive-programming-dsa',
    shortDescription: 'Algorithmic problem solving, Big Tech interview patterns, and contest ratings',
    category: 'competitive_programming',
    tagline: 'Master algorithms, data structures, dynamic programming, and contest strategy',
    description: 'Systematic curriculum from complexity analysis and STL to advanced graph algorithms, segment trees, and DP optimization. Designed for cracking FAANG/Tier-1 interviews and achieving Codeforces Candidate Master rating.',
    icon: 'Terminal',
    badgeColor: 'amber',
    estimatedMonths: 6,
    active: true,
    order: 3,
    targetRoles: [
      'Software Development Engineer (FAANG / Tier-1)',
      'Algorithms Engineer',
      'ICPC Regional Contestant',
      'Codeforces Candidate Master / Knight'
    ],
    careerPath: [
      {
        stepNumber: 1,
        title: 'Core DSA Foundations & Complexity Analysis',
        subtitle: 'Asymptotics, Arrays, Pointers, and STL Containers',
        description: 'Understand time and space complexity, two pointers, sliding window, and C++ STL / Java Collections efficiency.',
        milestones: ['Solve 50 easy LeetCode problems', 'Comfortable with amortized complexity and memory layout'],
        icon: 'Code'
      },
      {
        stepNumber: 2,
        title: 'Search, Sort & Linear Data Structures',
        subtitle: 'Binary Search, Stacks, Queues, Heaps & Hash Maps',
        description: 'Implement monotonic stacks, priority queues, and binary search on answer spaces.',
        milestones: ['Solve 50 medium problems', 'Master binary search on monotonic predicates'],
        icon: 'Layers'
      },
      {
        stepNumber: 3,
        title: 'Tree & Graph Algorithms',
        subtitle: 'DFS, BFS, Dijkstra, MST, Topological Sort & Disjoint Set Union',
        description: 'Traverse trees, calculate lowest common ancestors, and solve shortest path and connected component problems.',
        milestones: ['Solve 40 tree and graph challenges', 'Implement Union-Find with path compression'],
        icon: 'Compass'
      },
      {
        stepNumber: 4,
        title: 'Dynamic Programming & Advanced Structures',
        subtitle: '1D/2D DP, Knapsack, Digit DP, Segment Trees & Fenwick Trees',
        description: 'Recognize overlapping subproblems, formulate state transitions, and handle range queries with segment trees.',
        milestones: ['Solve 60 DP patterns', 'Build segment tree for point and range updates'],
        icon: 'Flame'
      }
    ]
  },
  roadmap: {
    title: 'Comprehensive Competitive Programming & DSA Roadmap',
    totalEstimatedHours: 280,
    version: 1,
    stages: [
      {
        stageNumber: 1,
        title: 'Language Proficiency, STL & Complexity Analysis',
        description: 'Asymptotic notation, fast I/O, bit manipulation, vectors, sets, maps, and two-pointer techniques.',
        subject: 'Algorithms',
        order: 1,
        estimatedHours: 30,
        difficulty: 'beginner',
        learningObjectives: [
          'Calculate Big-O time and space complexity accurately',
          'Utilize standard template library containers with optimal operations',
          'Apply two pointers and sliding window to solve sub-array problems in O(N)'
        ],
        practiceRequirements: [
          'Solve 25 LeetCode Easy/Medium problems in Arrays and Two Pointers',
          'Implement custom comparator functions in STL sorting'
        ],
        skippableIfExperienced: true,
        topics: [
          {
            title: 'Time & Space Complexity and Asymptotic Analysis',
            description: 'Big-O, Big-Omega, Big-Theta, recurrence relations and Master Theorem.',
            order: 1,
            estimatedHours: 6,
            difficulty: 'beginner',
            skills: ['Asymptotic Analysis', 'Recurrence Relations'],
            subtopics: ['Time complexity bounds', 'Space complexity and call stack', 'Master Theorem'],
            resources: [
              {
                title: 'Time Complexity and Big-O Notation',
                provider: 'GeeksforGeeks',
                type: 'documentation',
                url: 'https://www.geeksforgeeks.org/analysis-of-algorithms-set-1-asymptotic-analysis/',
                description: 'Comprehensive guide to algorithmic complexity analysis.',
                free: true,
                language: 'English'
              },
              {
                title: 'Asymptotic Analysis & Big-O Notes',
                provider: 'Stanford CS Education',
                type: 'documentation',
                url: 'https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1218/lectures/big-o/',
                description: 'Rigorous university notes on algorithmic scaling.',
                free: true,
                language: 'English'
              }
            ]
          },
          {
            title: 'Standard Template Library (STL) & Collections',
            description: 'Vectors, deques, unordered_map, set, multiset, priority_queue, and iterators.',
            order: 2,
            estimatedHours: 8,
            difficulty: 'beginner',
            skills: ['C++ STL', 'Data Structures'],
            subtopics: ['Associative containers', 'Sequence containers', 'Container adapters'],
            resources: [
              {
                title: 'C++ STL Containers and Usage Guide',
                provider: 'CP-Algorithms',
                type: 'documentation',
                url: 'https://cp-algorithms.com/',
                description: 'Algorithms and STL handbook for competitive programmers.',
                free: true,
                language: 'English'
              }
            ]
          },
          {
            title: 'Two Pointers, Sliding Window & Prefix Sums',
            description: 'Linear scan patterns for sub-arrays, intervals, and subarray sums.',
            order: 3,
            estimatedHours: 10,
            difficulty: 'beginner',
            skills: ['Two Pointers', 'Prefix Sums', 'Sliding Window'],
            subtopics: ['Fixed window size', 'Variable window size', '2D prefix sums'],
            resources: [
              {
                title: 'Sliding Window and Two Pointer Techniques',
                provider: 'LeetCode Explore',
                type: 'practice',
                url: 'https://leetcode.com/explore/',
                description: 'Standard two-pointer interview problem sets.',
                free: true,
                language: 'English'
              }
            ]
          }
        ]
      },
      {
        stageNumber: 2,
        title: 'Binary Search, Sorting & Linear Data Structures',
        description: 'Binary search on monotonic spaces, stacks, queues, monotonic stacks, and heaps.',
        subject: 'Algorithms',
        order: 2,
        estimatedHours: 40,
        difficulty: 'intermediate',
        learningObjectives: [
          'Formulate binary search on answer spaces for optimization problems',
          'Solve Next Greater Element problems with monotonic stacks',
          'Apply heaps to streaming median and top-K elements'
        ],
        practiceRequirements: [
          'Solve 30 problems on Binary Search and Monotonic Stacks',
          'Implement heapify and priority queue operations from scratch'
        ],
        skippableIfExperienced: false,
        topics: [
          {
            title: 'Binary Search on Answer Spaces',
            description: 'Predicates, invariant preservation, and searching continuous/discrete domains.',
            order: 1,
            estimatedHours: 12,
            difficulty: 'intermediate',
            skills: ['Binary Search', 'Invariants'],
            subtopics: ['Lower bound / upper bound', 'Monotonic predicate design', 'Floating point binary search'],
            resources: [
              {
                title: 'Binary Search Tutorial & Patterns',
                provider: 'TopCoder / CP-Algorithms',
                type: 'documentation',
                url: 'https://cp-algorithms.com/num_methods/binary_search.html',
                description: 'Precision binary search methods in competitive programming.',
                free: true,
                language: 'English'
              }
            ]
          },
          {
            title: 'Monotonic Stacks & Queues',
            description: 'Daily Temperatures, Largest Rectangle in Histogram, and Sliding Window Maximum.',
            order: 2,
            estimatedHours: 12,
            difficulty: 'intermediate',
            skills: ['Monotonic Stacks', 'DeQueue'],
            subtopics: ['Next greater element', 'Histogram area', 'Window extremum'],
            resources: [
              {
                title: 'Monotonic Stack Problem Patterns',
                provider: 'GeeksforGeeks',
                type: 'documentation',
                url: 'https://www.geeksforgeeks.org/introduction-to-monotonic-stack-data-structure-and-algorithm-tutorials/',
                description: 'Detailed analysis of monotonic stack problems.',
                free: true,
                language: 'English'
              }
            ]
          }
        ]
      },
      {
        stageNumber: 3,
        title: 'Tree & Graph Algorithms',
        description: 'DFS, BFS, tree diameter, Lowest Common Ancestor, Dijkstra, Disjoint Set Union (DSU).',
        subject: 'Algorithms',
        order: 3,
        estimatedHours: 60,
        difficulty: 'intermediate',
        learningObjectives: [
          'Perform graph traversals and cycle detection in directed/undirected graphs',
          'Compute single-source shortest paths using Dijkstra and Priority Queues',
          'Manage dynamically connected components with DSU in near O(1) amortized time'
        ],
        practiceRequirements: [
          'Solve 35 graph problems on LeetCode and Codeforces',
          'Implement DSU with union by rank and path compression'
        ],
        skippableIfExperienced: false,
        topics: [
          {
            title: 'Graph Representation, BFS & DFS',
            description: 'Adjacency list/matrix, connected components, bipartiteness, cycle detection.',
            order: 1,
            estimatedHours: 15,
            difficulty: 'intermediate',
            skills: ['DFS', 'BFS', 'Graph Modeling'],
            subtopics: ['Topological sort', 'Bipartite matching', 'Flood fill'],
            resources: [
              {
                title: 'Breadth First Search & Depth First Search',
                provider: 'CP-Algorithms',
                type: 'documentation',
                url: 'https://cp-algorithms.com/graph/breadth-first-search.html',
                description: 'Classic BFS/DFS implementations and properties.',
                free: true,
                language: 'English'
              }
            ]
          },
          {
            title: 'Shortest Paths & Minimum Spanning Trees',
            description: 'Dijkstra, Bellman-Ford, Kruskal, Prim, and Floyd-Warshall.',
            order: 2,
            estimatedHours: 20,
            difficulty: 'intermediate',
            skills: ['Dijkstra', 'Kruskal', 'MST'],
            subtopics: ['Negative edge weights', 'All pairs shortest paths', 'Greedy spanning trees'],
            resources: [
              {
                title: 'Dijkstra Algorithm Single-Source Shortest Path',
                provider: 'CP-Algorithms',
                type: 'documentation',
                url: 'https://cp-algorithms.com/graph/dijkstra.html',
                description: 'Optimized Dijkstra with priority queue.',
                free: true,
                language: 'English'
              }
            ]
          },
          {
            title: 'Disjoint Set Union (DSU) & Tree LCA',
            description: 'Union-find, path compression, tree diameter, binary lifting for LCA.',
            order: 3,
            estimatedHours: 15,
            difficulty: 'intermediate',
            skills: ['DSU', 'Binary Lifting', 'Trees'],
            subtopics: ['Union by rank/size', 'Binary lifting', 'Euler tour of trees'],
            resources: [
              {
                title: 'Disjoint Set Union with Optimizations',
                provider: 'CP-Algorithms',
                type: 'documentation',
                url: 'https://cp-algorithms.com/data_structures/disjoint_set_union.html',
                description: 'Full derivation of inverse Ackermann complexity DSU.',
                free: true,
                language: 'English'
              }
            ]
          }
        ]
      },
      {
        stageNumber: 4,
        title: 'Dynamic Programming Mastery',
        description: 'Memoization, tabulation, 1D/2D DP, knapsack variations, longest increasing subsequence, digit DP.',
        subject: 'Algorithms',
        order: 4,
        estimatedHours: 70,
        difficulty: 'advanced',
        learningObjectives: [
          'Recognize overlapping subproblems and optimal substructure',
          'Define states and write correct transition equations',
          'Optimize space complexity using state compression'
        ],
        practiceRequirements: [
          'Solve the CSES Dynamic Programming problem set',
          'Solve 40 medium and hard DP problems on LeetCode'
        ],
        skippableIfExperienced: false,
        topics: [
          {
            title: '1D DP & Classic Subsequences',
            description: 'Climbing stairs, coin change, house robber, longest increasing subsequence in O(N log N).',
            order: 1,
            estimatedHours: 20,
            difficulty: 'intermediate',
            skills: ['Dynamic Programming', 'Memoization'],
            subtopics: ['State identification', 'Base cases', 'Patience sorting for LIS'],
            resources: [
              {
                title: 'CSES Dynamic Programming Problem Set',
                provider: 'CSES Finland',
                type: 'practice',
                url: 'https://cses.fi/problemset/list/',
                description: 'Gold-standard benchmark dynamic programming problem set.',
                free: true,
                language: 'English'
              }
            ]
          },
          {
            title: '2D & Knapsack Dynamic Programming',
            description: '0/1 Knapsack, Unbounded Knapsack, Edit Distance, Longest Common Subsequence, Grid DP.',
            order: 2,
            estimatedHours: 25,
            difficulty: 'advanced',
            skills: ['2D DP', 'Knapsack Variations'],
            subtopics: ['Space optimization in 2D grids', 'Subset sum and partition problems'],
            resources: [
              {
                title: 'Knapsack Problem and Dynamic Programming',
                provider: 'GeeksforGeeks',
                type: 'documentation',
                url: 'https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/',
                description: 'Classic 0/1 knapsack tutorial and proof.',
                free: true,
                language: 'English'
              }
            ]
          }
        ]
      },
      {
        stageNumber: 5,
        title: 'Advanced Range Queries & Segment Trees',
        description: 'Segment trees, lazy propagation, Fenwick trees (Binary Indexed Tree), Trie data structure.',
        subject: 'Algorithms',
        order: 5,
        estimatedHours: 50,
        difficulty: 'advanced',
        learningObjectives: [
          'Build segment trees for associative operations (sum, min, max, gcd)',
          'Implement lazy propagation for range updates in O(log N)',
          'Construct prefix trees (Trie) for string matching and bitwise XOR queries'
        ],
        practiceRequirements: [
          'Solve 20 range query problems on CSES and Codeforces',
          'Implement Fenwick tree point update and prefix query'
        ],
        skippableIfExperienced: false,
        topics: [
          {
            title: 'Segment Trees with Point and Range Updates',
            description: 'Tree construction, range queries, lazy propagation, dynamic segment trees.',
            order: 1,
            estimatedHours: 25,
            difficulty: 'advanced',
            skills: ['Segment Trees', 'Range Queries', 'Lazy Propagation'],
            subtopics: ['Build and query recursion', 'Lazy tags propagation'],
            resources: [
              {
                title: 'Segment Tree Comprehensive Tutorial',
                provider: 'CP-Algorithms',
                type: 'documentation',
                url: 'https://cp-algorithms.com/data_structures/segment_tree.html',
                description: 'The definitive segment tree guide with C++ examples.',
                free: true,
                language: 'English'
              }
            ]
          },
          {
            title: 'Binary Indexed Tree (Fenwick) & Trie',
            description: 'Fenwick tree BIT operations with lowbit, Trie string and XOR maximum matching.',
            order: 2,
            estimatedHours: 25,
            difficulty: 'advanced',
            skills: ['Fenwick Tree', 'Trie'],
            subtopics: ['Point update range query', 'Inversion count', 'XOR Trie'],
            resources: [
              {
                title: 'Fenwick Tree (Binary Indexed Tree)',
                provider: 'CP-Algorithms',
                type: 'documentation',
                url: 'https://cp-algorithms.com/data_structures/fenwick.html',
                description: 'Lowbit formula and Fenwick tree operations.',
                free: true,
                language: 'English'
              }
            ]
          }
        ]
      }
    ]
  },
  resources: [
    {
      title: 'CSES Problem Set (Algorithms & Data Structures)',
      provider: 'CSES Finland',
      type: 'practice',
      url: 'https://cses.fi/problemset/list/',
      description: 'Clean, curated collection of standard algorithm problems by Antti Laaksonen.',
      stageNumber: 1,
      topicTitle: 'Time & Space Complexity and Asymptotic Analysis',
      free: true,
      language: 'English',
      verified: true
    },
    {
      title: 'CP-Algorithms Handbook & Reference',
      provider: 'CP-Algorithms',
      type: 'documentation',
      url: 'https://cp-algorithms.com/',
      description: 'English translation of E-Maxx algorithms reference covering graph, math, and structures.',
      stageNumber: 1,
      topicTitle: 'Standard Template Library (STL) & Collections',
      free: true,
      language: 'English',
      verified: true
    },
    {
      title: 'LeetCode Interview Study Plan (Top 150)',
      provider: 'LeetCode',
      type: 'practice',
      url: 'https://leetcode.com/studyplan/top-interview-150/',
      description: 'Curated list of classic coding interview questions for top tech companies.',
      stageNumber: 2,
      topicTitle: 'Binary Search on Answer Spaces',
      free: true,
      language: 'English',
      verified: true
    },
    {
      title: 'Codeforces Problemset & Rated Contests',
      provider: 'Codeforces',
      type: 'practice',
      url: 'https://codeforces.com/problemset',
      description: 'The premier competitive programming portal for rating progression and contest simulation.',
      stageNumber: 3,
      topicTitle: 'Graph Representation, BFS & DFS',
      free: true,
      language: 'English',
      verified: true
    },
    {
      title: 'AtCoder Regular Contests & Educational DP Contest',
      provider: 'AtCoder',
      type: 'practice',
      url: 'https://atcoder.jp/contests/dp',
      description: '26 benchmark dynamic programming problems from A to Z.',
      stageNumber: 4,
      topicTitle: '1D DP & Classic Subsequences',
      free: true,
      language: 'English',
      verified: true
    }
  ]
};

fs.writeFileSync(path.join(roadmapsDir, 'competitive-programming-dsa.json'), JSON.stringify(cpDsaData, null, 2));
console.log('Generated competitive-programming-dsa.json');

// 4. Machine Learning & AI
const mlAiData = {
  goal: {
    title: 'Machine Learning & AI',
    slug: 'machine-learning-ai',
    shortDescription: 'Mathematical foundations, classical ML, Deep Learning with PyTorch, and Generative AI / LLMs',
    category: 'ai_ml',
    tagline: 'From linear algebra and scikit-learn to deep neural networks, transformers, and LLM engineering',
    description: 'A comprehensive journey covering linear algebra, calculus, statistical modeling, supervised/unsupervised machine learning, deep vision, NLP with Transformers, and production LLM application engineering.',
    icon: 'Brain',
    badgeColor: 'purple',
    estimatedMonths: 8,
    active: true,
    order: 4,
    targetRoles: [
      'Machine Learning Engineer',
      'AI Research Engineer',
      'Data Scientist',
      'LLM / NLP Applications Engineer'
    ],
    careerPath: [
      {
        stepNumber: 1,
        title: 'Mathematical & Python Data Science Core',
        subtitle: 'Linear Algebra, Calculus, Statistics, NumPy & Pandas',
        description: 'Master vectors, matrices, eigenvalues, partial derivatives, gradient descent, and data manipulation.',
        milestones: ['Perform exploratory data analysis on Kaggle', 'Implement gradient descent from scratch with NumPy'],
        icon: 'Calculator'
      },
      {
        stepNumber: 2,
        title: 'Classical Machine Learning with Scikit-Learn',
        subtitle: 'Regression, Classification, SVMs, Trees & Ensemble Methods',
        description: 'Build predictive models, prevent overfitting, cross-validate pipelines, and tune hyperparameters.',
        milestones: ['Train Random Forest & XGBoost classifiers', 'Construct complete preprocessing pipelines with Scikit-Learn'],
        icon: 'Cpu'
      },
      {
        stepNumber: 3,
        title: 'Deep Learning Foundations with PyTorch',
        subtitle: 'Tensors, Autograd, Backpropagation, CNNs & RNNs',
        description: 'Design multi-layer perceptrons, convolutional networks for computer vision, and recurrent architectures.',
        milestones: ['Train ResNet image classifier with GPU acceleration', 'Understand loss functions and Adam optimizer'],
        icon: 'Flame'
      },
      {
        stepNumber: 4,
        title: 'Transformers, Generative AI & LLM Systems',
        subtitle: 'Self-Attention, BERT, GPT, Hugging Face, RAG & Vector DBs',
        description: 'Fine-tune pre-trained language models, build Retrieval-Augmented Generation (RAG) pipelines, and deploy LLM apps.',
        milestones: ['Deploy a production RAG system with LangChain/LlamaIndex', 'Fine-tune an open-source LLM using LoRA/QLoRA'],
        icon: 'Sparkles'
      }
    ]
  },
  roadmap: {
    title: 'Modern Machine Learning & AI Engineering Roadmap',
    totalEstimatedHours: 350,
    version: 1,
    stages: [
      {
        stageNumber: 1,
        title: 'Mathematical Foundations for Machine Learning',
        description: 'Linear Algebra, Vector Spaces, Matrix Decomposition (SVD/PCA), Multivariate Calculus, and Probability.',
        subject: 'Mathematics',
        order: 1,
        estimatedHours: 40,
        difficulty: 'beginner',
        learningObjectives: [
          'Understand dot products, matrix multiplications, norms, and eigenvalues intuitively',
          'Calculate partial derivatives and Jacobians for gradient descent formulation',
          'Master probability distributions, Bayes theorem, expected values, and maximum likelihood'
        ],
        practiceRequirements: [
          'Derive linear regression closed-form normal equations by hand',
          'Implement gradient descent on 2D loss surfaces'
        ],
        skippableIfExperienced: true,
        topics: [
          {
            title: 'Linear Algebra: Vectors, Matrices & Eigenvalues',
            description: 'Vector spaces, matrix transforms, determinants, eigenvalues, eigenvectors, and SVD.',
            order: 1,
            estimatedHours: 15,
            difficulty: 'beginner',
            skills: ['Linear Algebra', 'Matrix Transformations'],
            subtopics: ['Dot products and projections', 'Matrix invertibility', 'Eigendecomposition'],
            resources: [
              {
                title: '3Blue1Brown: Essence of Linear Algebra',
                provider: '3Blue1Brown',
                type: 'playlist',
                url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab',
                description: 'Geometric intuition behind vector spaces and transformations.',
                free: true,
                language: 'English'
              },
              {
                title: 'Mathematics for Machine Learning (Book & Notes)',
                provider: 'Cambridge University Press',
                type: 'book',
                url: 'https://mml-book.github.io/',
                description: 'Free open textbook covering linear algebra and calculus for ML.',
                free: true,
                language: 'English'
              }
            ]
          },
          {
            title: 'Multivariate Calculus & Gradient Descent',
            description: 'Derivatives, chain rule, gradients, directional derivatives, convexity, and learning rate schedules.',
            order: 2,
            estimatedHours: 12,
            difficulty: 'beginner',
            skills: ['Calculus', 'Optimization'],
            subtopics: ['Chain rule in higher dimensions', 'Gradient vector', 'Hessian matrix'],
            resources: [
              {
                title: 'Essence of Calculus',
                provider: '3Blue1Brown',
                type: 'playlist',
                url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr',
                description: 'Visual intuition for derivatives and the chain rule.',
                free: true,
                language: 'English'
              }
            ]
          },
          {
            title: 'Probability, Random Variables & Maximum Likelihood',
            description: 'Discrete/continuous distributions, Gaussian distribution, conditional probability, Bayes rule, MLE and MAP.',
            order: 3,
            estimatedHours: 13,
            difficulty: 'beginner',
            skills: ['Probability', 'Statistics'],
            subtopics: ['Probability density functions', 'Central Limit Theorem', 'Log-likelihood'],
            resources: [
              {
                title: 'Introduction to Probability & Statistics for Data Science',
                provider: 'Khan Academy',
                type: 'course',
                url: 'https://www.khanacademy.org/math/statistics-probability',
                description: 'Core concepts in distributions, variance, and hypothesis testing.',
                free: true,
                language: 'English'
              }
            ]
          }
        ]
      },
      {
        stageNumber: 2,
        title: 'Python Data Science Stack (NumPy, Pandas, Scipy)',
        description: 'Vectorized array computations with NumPy, dataframe manipulations with Pandas, data visualization.',
        subject: 'Data Science',
        order: 2,
        estimatedHours: 35,
        difficulty: 'beginner',
        learningObjectives: [
          'Perform vectorized broadcast operations in NumPy without slow Python loops',
          'Clean, transform, merge, and group datasets using Pandas',
          'Generate publication-quality exploratory data visualizations with Matplotlib & Seaborn'
        ],
        practiceRequirements: [
          'Complete 2 Kaggle exploratory data analysis notebooks',
          'Implement vectorized k-nearest neighbors using only NumPy'
        ],
        skippableIfExperienced: true,
        topics: [
          {
            title: 'NumPy: Vectorization, Broadcasting & Arrays',
            description: 'N-dimensional arrays, indexing, masking, broadcasting rules, and linear algebra routines.',
            order: 1,
            estimatedHours: 15,
            difficulty: 'beginner',
            skills: ['NumPy', 'Vectorization'],
            subtopics: ['Array indexing and slicing', 'Broadcasting mechanisms', 'Linear algebra in numpy.linalg'],
            resources: [
              {
                title: 'Official NumPy User Guide & Tutorials',
                provider: 'NumPy.org',
                type: 'documentation',
                url: 'https://numpy.org/doc/stable/user/index.html',
                description: 'Official comprehensive reference and tutorial for NumPy.',
                free: true,
                language: 'English'
              }
            ]
          },
          {
            title: 'Pandas: DataFrames, Aggregations & Data Cleaning',
            description: 'Series, DataFrames, missing data imputation, groupby aggregations, pivots, and time series.',
            order: 2,
            estimatedHours: 20,
            difficulty: 'beginner',
            skills: ['Pandas', 'Data Cleaning'],
            subtopics: ['Data ingestion and parsing', 'Missing value handling', 'Merge, join and concat'],
            resources: [
              {
                title: 'Pandas Getting Started Tutorials',
                provider: 'Pandas.pydata.org',
                type: 'documentation',
                url: 'https://pandas.pydata.org/docs/getting_started/index.html',
                description: 'Official guides to data wrangling and transformation.',
                free: true,
                language: 'English'
              }
            ]
          }
        ]
      },
      {
        stageNumber: 3,
        title: 'Classical Machine Learning with Scikit-Learn',
        description: 'Supervised learning, classification, regression, decision trees, random forests, boosting, metrics.',
        subject: 'Machine Learning',
        order: 3,
        estimatedHours: 65,
        difficulty: 'intermediate',
        learningObjectives: [
          'Formulate and evaluate regression (Linear, Ridge, Lasso) and classification (Logistic, SVM, Trees)',
          'Diagnose bias vs variance using learning curves and cross-validation',
          'Build leak-free preprocessing pipelines with transformers and feature scalers'
        ],
        practiceRequirements: [
          'Train an ensemble model (XGBoost/LightGBM) achieving top 25% on a Kaggle competition',
          'Calculate ROC-AUC, precision, recall, and F1-score with confusion matrix analysis'
        ],
        skippableIfExperienced: false,
        topics: [
          {
            title: 'Linear & Logistic Regression with Regularization',
            description: 'Cost functions, MSE, cross-entropy loss, L1 (Lasso) / L2 (Ridge) regularization.',
            order: 1,
            estimatedHours: 15,
            difficulty: 'intermediate',
            skills: ['Regression', 'Regularization', 'Cross-Entropy'],
            subtopics: ['Odds ratio and sigmoid function', 'L1 vs L2 feature sparsity', 'Multinomial logistic regression'],
            resources: [
              {
                title: 'Scikit-Learn Generalized Linear Models',
                provider: 'Scikit-Learn.org',
                type: 'documentation',
                url: 'https://scikit-learn.org/stable/modules/linear_model.html',
                description: 'Official API and mathematical formulations for linear models.',
                free: true,
                language: 'English'
              }
            ]
          },
          {
            title: 'Decision Trees, Random Forests & Gradient Boosting',
            description: 'Entropy, Gini impurity, bagging, boosting, XGBoost, and LightGBM.',
            order: 2,
            estimatedHours: 25,
            difficulty: 'intermediate',
            skills: ['Ensemble Methods', 'Random Forests', 'XGBoost'],
            subtopics: ['Tree splitting criteria', 'Bootstrap aggregating', 'Gradient boosted decision trees'],
            resources: [
              {
                title: 'Scikit-Learn Ensemble Methods Documentation',
                provider: 'Scikit-Learn.org',
                type: 'documentation',
                url: 'https://scikit-learn.org/stable/modules/ensemble.html',
                description: 'Bagging, forest, and boosting guide with hyperparameter tuning.',
                free: true,
                language: 'English'
              },
              {
                title: 'XGBoost Documentation & Tutorials',
                provider: 'XGBoost Developers',
                type: 'documentation',
                url: 'https://xgboost.readthedocs.io/en/stable/',
                description: 'Scalable and flexible gradient boosting library manual.',
                free: true,
                language: 'English'
              }
            ]
          }
        ]
      },
      {
        stageNumber: 4,
        title: 'Deep Learning Foundations with PyTorch',
        description: 'Tensors, computational graphs, backpropagation, CNNs, regularization (Dropout, BatchNorm), optimizers.',
        subject: 'Deep Learning',
        order: 4,
        estimatedHours: 90,
        difficulty: 'advanced',
        learningObjectives: [
          'Construct neural network architectures using torch.nn.Module',
          'Implement the training loop with forward pass, loss calculation, backward pass, and optimizer step',
          'Train convolutional neural networks (CNNs) with transfer learning using torchvision'
        ],
        practiceRequirements: [
          'Train a CNN on CIFAR-10 achieving >85% accuracy',
          'Implement custom Dataset and DataLoader with data augmentations'
        ],
        skippableIfExperienced: false,
        topics: [
          {
            title: 'PyTorch Tensors, Autograd & Building Blocks',
            description: 'Tensors on CUDA/GPU, gradient tracking, torch.nn.Linear, activations (ReLU, GELU).',
            order: 1,
            estimatedHours: 25,
            difficulty: 'intermediate',
            skills: ['PyTorch', 'Autograd', 'Tensors'],
            subtopics: ['Automatic differentiation engine', 'Custom nn.Module subclasses', 'Loss functions'],
            resources: [
              {
                title: 'Deep Learning with PyTorch: A 60 Minute Blitz',
                provider: 'PyTorch.org',
                type: 'documentation',
                url: 'https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html',
                description: 'Official foundational PyTorch tutorial for building neural networks.',
                free: true,
                language: 'English'
              }
            ]
          },
          {
            title: 'Convolutional Neural Networks (CNNs) & Computer Vision',
            description: 'Convolutions, kernels, stride, padding, pooling, ResNet residual connections, transfer learning.',
            order: 2,
            estimatedHours: 35,
            difficulty: 'advanced',
            skills: ['CNN', 'Transfer Learning', 'Computer Vision'],
            subtopics: ['Spatial feature maps', 'Residual skip connections', 'Pretrained model fine-tuning'],
            resources: [
              {
                title: 'PyTorch Transfer Learning for Computer Vision',
                provider: 'PyTorch.org',
                type: 'documentation',
                url: 'https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html',
                description: 'Step-by-step transfer learning with ResNet in PyTorch.',
                free: true,
                language: 'English'
              },
              {
                title: 'Stanford CS231n: Deep Learning for Computer Vision',
                provider: 'Stanford University',
                type: 'course',
                url: 'https://cs231n.github.io/',
                description: 'Renowned course notes on CNN architectures, backprop, and optimization.',
                free: true,
                language: 'English'
              }
            ]
          }
        ]
      },
      {
        stageNumber: 5,
        title: 'Transformers, Generative AI & LLM Engineering',
        description: 'Self-attention mechanism, transformer architecture, BERT, GPT, Hugging Face, RAG, and fine-tuning.',
        subject: 'Generative AI',
        order: 5,
        estimatedHours: 120,
        difficulty: 'advanced',
        learningObjectives: [
          'Understand scaled dot-product attention and multi-head attention mechanisms mathematically',
          'Utilize Hugging Face Transformers for tokenization, inference, and task fine-tuning',
          'Architect Retrieval-Augmented Generation (RAG) systems with vector embeddings and similarity search'
        ],
        practiceRequirements: [
          'Build and deploy an end-to-end document QA assistant using vector search and an open-source LLM',
          'Fine-tune an open LLM on custom conversational data using parameter-efficient fine-tuning (PEFT/LoRA)'
        ],
        skippableIfExperienced: false,
        topics: [
          {
            title: 'The Transformer Architecture & Self-Attention',
            description: 'Query, Key, Value matrices, positional encodings, multi-head attention, encoder-decoder.',
            order: 1,
            estimatedHours: 35,
            difficulty: 'advanced',
            skills: ['Transformers', 'Self-Attention', 'NLP'],
            subtopics: ['Scaled dot-product attention', 'Feed-forward sublayers', 'Encoder vs Decoder-only'],
            resources: [
              {
                title: 'The Illustrated Transformer',
                provider: 'Jay Alammar',
                type: 'documentation',
                url: 'https://jalammar.github.io/illustrated-transformer/',
                description: 'Visual step-by-step guide to understanding the Transformer architecture.',
                free: true,
                language: 'English'
              },
              {
                title: 'Hugging Face NLP Course',
                provider: 'Hugging Face',
                type: 'course',
                url: 'https://huggingface.co/learn/nlp-course/',
                description: 'Comprehensive free course on transformers, datasets, tokenizers, and pipelines.',
                free: true,
                language: 'English'
              }
            ]
          },
          {
            title: 'Retrieval-Augmented Generation (RAG) & Vector Databases',
            description: 'Embeddings, cosine similarity, Chroma/Pinecone/FAISS, chunking strategies, prompt engineering.',
            order: 2,
            estimatedHours: 45,
            difficulty: 'advanced',
            skills: ['RAG', 'Vector Embeddings', 'Prompt Engineering'],
            subtopics: ['Text embeddings with Sentence-Transformers', 'Vector indexing and retrieval', 'Hallucination mitigation'],
            resources: [
              {
                title: 'LangChain Documentation & Architecture Guides',
                provider: 'LangChain',
                type: 'documentation',
                url: 'https://python.langchain.com/docs/introduction/',
                description: 'Production frameworks for building context-aware reasoning applications.',
                free: true,
                language: 'English'
              }
            ]
          }
        ]
      }
    ]
  },
  resources: [
    {
      title: 'Hugging Face NLP & Transformers Course',
      provider: 'Hugging Face',
      type: 'course',
      url: 'https://huggingface.co/learn/nlp-course/',
      description: 'Hands-on curriculum from tokenizers to training transformers on Hugging Face Hub.',
      stageNumber: 5,
      topicTitle: 'The Transformer Architecture & Self-Attention',
      free: true,
      language: 'English',
      verified: true
    },
    {
      title: 'PyTorch Official Documentation & Tutorials',
      provider: 'PyTorch.org',
      type: 'documentation',
      url: 'https://pytorch.org/tutorials/',
      description: 'Core tutorials for tensor operations, neural network modules, and GPU acceleration.',
      stageNumber: 4,
      topicTitle: 'PyTorch Tensors, Autograd & Building Blocks',
      free: true,
      language: 'English',
      verified: true
    },
    {
      title: 'Fast.ai: Practical Deep Learning for Coders',
      provider: 'Fast.ai',
      type: 'course',
      url: 'https://course.fast.ai/',
      description: 'Renowned top-down deep learning course with state-of-the-art results using PyTorch.',
      stageNumber: 4,
      topicTitle: 'Convolutional Neural Networks (CNNs) & Computer Vision',
      free: true,
      language: 'English',
      verified: true
    },
    {
      title: 'Scikit-Learn Machine Learning in Python Guide',
      provider: 'Scikit-Learn.org',
      type: 'documentation',
      url: 'https://scikit-learn.org/stable/user_guide.html',
      description: 'The definitive handbook for statistical modeling, regression, classification, and clustering.',
      stageNumber: 3,
      topicTitle: 'Linear & Logistic Regression with Regularization',
      free: true,
      language: 'English',
      verified: true
    },
    {
      title: 'Kaggle Datasets & Machine Learning Competitions',
      provider: 'Kaggle',
      type: 'practice',
      url: 'https://www.kaggle.com/',
      description: 'Global data science competition platform with real-world datasets and community notebooks.',
      stageNumber: 2,
      topicTitle: 'Pandas: DataFrames, Aggregations & Data Cleaning',
      free: true,
      language: 'English',
      verified: true
    }
  ]
};

fs.writeFileSync(path.join(roadmapsDir, 'machine-learning-ai.json'), JSON.stringify(mlAiData, null, 2));
console.log('Generated machine-learning-ai.json');
console.log('All 4 roadmap seed files generated successfully!');
