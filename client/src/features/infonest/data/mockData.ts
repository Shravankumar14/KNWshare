import {
  Creator,
  Post,
  Story,
  Course,
  RoadmapData,
  UserGoal,
  NotificationItem,
  ContentItem,
  AnalyticsData,
  KnowledgeTrail,
  LearningMission,
  OrbitRoom,
  KnowledgeChallenge,
  KnowledgeProof,
  LearningDNATopic,
  KnowledgeWeatherItem
} from '../types';

export const CURRENT_USER = {
  id: 'usr_me',
  username: 'bhargav_code',
  name: 'Bhargav Sai',
  handle: '@bhargav_code',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
  role: 'AI & Systems Fellow',
  bio: 'Building the knowledge cosmos on InfoNest. Exploring autonomous reasoning agents, distributed event meshes, and GPU shaders.',
  knowledgeTokens: 4250,
  knowledgeScore: 842,
  streakDays: 14,
  enrolledCoursesCount: 4,
  activeRoadmapsCount: 2,
  completedCertificatesCount: 3,
  skills: [
    'PyTorch', 'Distributed Systems', 'Three.js', 'TypeScript', 'eBPF',
    'Kafka', 'RAG Pipelines', 'Docker', 'WebGPU', 'System Design'
  ]
};

export const MOCK_CREATORS: Creator[] = [
  {
    id: 'cr_1',
    username: 'elena_ai',
    name: 'Dr. Elena Rostova',
    handle: '@elena_ai',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80',
    role: 'Frontier AI Research Scientist',
    specialty: 'Reasoning Models & Agentic AI',
    bio: 'Ex-DeepMind Fellow. Crafting deep-dive masterclasses on autonomous reasoning architectures, tree-of-thought planning, and verifiable reward models.',
    followersCount: 142500,
    followingCount: 384,
    studentCount: 28400,
    totalLectures: 38,
    rating: 4.96,
    isFollowed: true,
    verified: true,
    knowledgeTokens: 89200,
    knowledgeScore: 985,
    expertiseTags: ['Generative AI', 'Reasoning LLMs', 'MCTS', 'PyTorch', 'Agent Swarms']
  },
  {
    id: 'cr_2',
    username: 'marcus_distrib',
    name: 'Marcus Vance',
    handle: '@marcus_distrib',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
    role: 'Principal Distributed Architect',
    specialty: 'High-Throughput Systems & Kafka',
    bio: 'Scaled systems from zero to 15 million QPS. Sharing real-world distributed post-mortems, kernel bypass networking, and battle-tested roadmaps.',
    followersCount: 98300,
    followingCount: 210,
    studentCount: 19800,
    totalLectures: 26,
    rating: 4.92,
    isFollowed: false,
    verified: true,
    knowledgeTokens: 64100,
    knowledgeScore: 940,
    expertiseTags: ['Distributed Systems', 'Kafka', 'eBPF', 'Raft Consensus', 'Go']
  },
  {
    id: 'cr_3',
    username: 'sarah_design',
    name: 'Sarah Chen',
    handle: '@sarah_design',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1600&q=80',
    role: 'VP Design & Spatial Technologist',
    specialty: '3D Web Interfaces & Micro-interactions',
    bio: 'Pushing boundaries of WebGPU, Three.js shaders, and spatial design systems for next-gen consumer software.',
    followersCount: 112000,
    followingCount: 412,
    studentCount: 14200,
    totalLectures: 31,
    rating: 4.98,
    isFollowed: true,
    verified: true,
    knowledgeTokens: 78500,
    knowledgeScore: 968,
    expertiseTags: ['Three.js', 'WebGPU', 'GLSL', 'UI/UX', 'Micro-interactions']
  },
  {
    id: 'cr_4',
    username: 'devansh_sec',
    name: 'Devansh Rao',
    handle: '@devansh_sec',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1600&q=80',
    role: 'Zero-Knowledge Cryptographer',
    specialty: 'ZK-SNARKs & Cryptography',
    bio: 'Demystifying elliptic curves, polynomial commitments, and cryptographic privacy primitives for developers.',
    followersCount: 65400,
    followingCount: 195,
    studentCount: 8900,
    totalLectures: 19,
    rating: 4.88,
    isFollowed: false,
    verified: true,
    knowledgeTokens: 41800,
    knowledgeScore: 890,
    expertiseTags: ['Zero-Knowledge', 'ZK-SNARKs', 'Rust', 'Applied Cryptography', 'Privacy']
  },
  {
    id: 'cr_5',
    username: 'maya_data',
    name: 'Maya Patel',
    handle: '@maya_data',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    role: 'Lead ML Engineer & Data Architect',
    specialty: 'Vector Databases & RAG at Scale',
    bio: 'Engineering billion-vector similarity search pipelines and hybrid retrieval for multi-tenant enterprise intelligence.',
    followersCount: 78200,
    followingCount: 310,
    studentCount: 11400,
    totalLectures: 22,
    rating: 4.91,
    isFollowed: false,
    verified: true,
    knowledgeTokens: 53200,
    knowledgeScore: 915,
    expertiseTags: ['Vector Search', 'RAG', 'Milvus', 'Embeddings', 'Python']
  },
  {
    id: 'cr_6',
    username: 'alex_frontend',
    name: 'Alex Morgan',
    handle: '@alex_frontend',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80',
    role: 'Senior Staff Frontend Architect',
    specialty: 'React 19 & Compiler Optimization',
    bio: 'Deconstructing modern browser rendering pipelines, zero-bundle RSCs, and high-performance client state.',
    followersCount: 89400,
    followingCount: 275,
    studentCount: 16700,
    totalLectures: 29,
    rating: 4.94,
    isFollowed: true,
    verified: true,
    knowledgeTokens: 62000,
    knowledgeScore: 932,
    expertiseTags: ['React 19', 'Next.js', 'Web Performance', 'TypeScript', 'Compiler']
  }
];

export const MOCK_STORIES: Story[] = [
  {
    id: 'spk_1',
    creatorId: 'cr_1',
    creator: MOCK_CREATORS[0],
    title: 'AI Flashcard',
    category: 'Flashcard',
    categoryColor: '#8B5CF6',
    previewImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    hasUnseen: true,
    slides: [
      {
        id: 'sl_1',
        type: 'insight',
        title: 'Why Attention Scales Quadratically O(N²)',
        content: 'Standard self-attention computes query-key dot products across all token pairs. When context doubles from 4k to 8k tokens, compute quadruples. FlashAttention-2 overcomes memory IO limits via GPU SRAM tiling.',
        bgGradient: 'from-purple-900 via-indigo-950 to-black'
      },
      {
        id: 'sl_2',
        type: 'code',
        title: 'KV Cache Memory Footprint',
        content: 'Formula for KV Cache memory per token:\nMemory = 2 * layers * heads * head_dim * bytes_per_elem',
        codeSnippet: `# 70B model with 80 layers, 64 heads, dim 128 (FP16):\n# KV Cache = 2 * 80 * 64 * 128 * 2 = 2.62 MB per token!`,
        language: 'python',
        bgGradient: 'from-violet-950 via-slate-900 to-black'
      }
    ]
  },
  {
    id: 'spk_2',
    creatorId: 'cr_2',
    creator: MOCK_CREATORS[1],
    title: 'Kafka Tip',
    category: 'Quick Tip',
    categoryColor: '#00F0FF',
    previewImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    hasUnseen: true,
    slides: [
      {
        id: 'sl_3',
        type: 'tip',
        title: 'Avoid Hot Partitioning',
        content: 'Never use low-cardinality keys like "status: active" as your partition key! It concentrates 90% of traffic onto a single partition while other partition consumer threads sit idle.',
        bgGradient: 'from-cyan-950 via-blue-950 to-black'
      }
    ]
  },
  {
    id: 'spk_3',
    creatorId: 'cr_3',
    creator: MOCK_CREATORS[2],
    title: '3D Systems',
    category: 'Mini Lecture',
    categoryColor: '#EC4899',
    previewImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80',
    hasUnseen: false,
    slides: [
      {
        id: 'sl_4',
        type: 'code',
        title: 'Fresnel Rim Glow in GLSL',
        content: 'To achieve high-aesthetic cyber glass surfaces, compute the angle between the surface normal and the camera view vector:',
        codeSnippet: `float fresnel = 1.0 - max(0.0, dot(vNormal, vViewPosition));\nvec3 rimColor = vec3(0.0, 0.94, 1.0) * pow(fresnel, 3.0);`,
        language: 'glsl',
        bgGradient: 'from-pink-950 via-purple-950 to-black'
      }
    ]
  },
  {
    id: 'spk_4',
    creatorId: 'cr_4',
    creator: MOCK_CREATORS[3],
    title: 'DSA Trick',
    category: 'Challenge',
    categoryColor: '#10B981',
    previewImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80',
    hasUnseen: true,
    slides: [
      {
        id: 'sl_5',
        type: 'tip',
        title: 'Dijkstra Priority Queue Trap',
        content: 'In Python heapq or C++ std::priority_queue, if you don\'t check if curr_dist > dist[u] upon popping, you will process stale vertices and degrade complexity from O(E log V) to O(E²)!',
        bgGradient: 'from-emerald-950 via-teal-950 to-black'
      }
    ]
  },
  {
    id: 'spk_5',
    creatorId: 'cr_5',
    creator: MOCK_CREATORS[4],
    title: 'UX Principle',
    category: 'Thought',
    categoryColor: '#F59E0B',
    previewImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
    hasUnseen: true,
    slides: [
      {
        id: 'sl_6',
        type: 'insight',
        title: 'Cognitive Load in Learning UIs',
        content: 'Doherty Threshold states productivity increases when computer and user interact at a pace (<400ms) that ensures neither has to wait. Instant feedback turns friction into flow.',
        bgGradient: 'from-amber-950 via-slate-900 to-black'
      }
    ]
  },
  {
    id: 'spk_6',
    creatorId: 'cr_6',
    creator: MOCK_CREATORS[5],
    title: 'Cloud Byte',
    category: 'Research',
    categoryColor: '#3B82F6',
    previewImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    hasUnseen: true,
    slides: [
      {
        id: 'sl_7',
        type: 'tip',
        title: 'Zero-Copy Networking in Linux',
        content: 'Using splice() and vmsplice() system calls moves buffers between pipes and sockets without copying memory into user-space RAM, cutting network pipeline CPU time by 60%.',
        bgGradient: 'from-blue-950 via-indigo-950 to-black'
      }
    ]
  }
];

export const MOCK_ROADMAP: RoadmapData = {
  id: 'rd_ai_architect',
  title: 'Full-Stack Generative AI Architect (2025 - 2026)',
  category: 'Artificial Intelligence & Systems',
  level: 'Advanced',
  description: 'An industry-standard curriculum breaking down modern AI engineering into 5 interactive, self-paced milestones from Transformer mechanics to vLLM cluster serving.',
  totalMilestones: 5,
  completedMilestones: 2,
  estimatedWeeks: 16,
  clonesCount: 14820,
  skillsCovered: ['Self-Attention', 'KV Cache', 'FlashAttention-2', 'LoRA', 'QLoRA', 'MCTS', 'vLLM', 'Ray Serve', 'Ragas'],
  certificatePath: 'InfoNest Verified AI Systems Architect Certification',
  milestones: [
    {
      id: 'ms_1',
      order: 1,
      title: 'Foundation & Transformer Mechanics',
      description: 'Attention mechanisms, KV-cache optimization, FlashAttention-2 internals, and tokenization dynamics.',
      status: 'completed',
      estimatedHours: 24,
      skills: ['Self-Attention', 'KV Cache', 'Positional Embeddings', 'RoPE'],
      recommendedLectures: ['Attention is All You Need Deconstructed', 'Memory Profiling on CUDA'],
      projectIdea: 'Implement Multi-Head Latent Attention from scratch with PyTorch.'
    },
    {
      id: 'ms_2',
      order: 2,
      title: 'Fine-Tuning & Parameter Efficient Adaptation',
      description: 'LoRA, QLoRA, direct preference optimization (DPO), and continuous pre-training on domain corpora.',
      status: 'completed',
      estimatedHours: 30,
      skills: ['LoRA', 'QLoRA 4-bit', 'DPO', 'Reward Modeling'],
      recommendedLectures: ['Mastering DPO over RLHF', 'Synthetic Data Pipelines'],
      projectIdea: 'Fine-tune a 7B model using QLoRA to output structured JSON tool calls.'
    },
    {
      id: 'ms_3',
      order: 3,
      title: 'Autonomous Agentic Architectures & MCTS',
      description: 'Building multi-agent swarms, self-reflective loops, tool calling protocols, and tree-of-thought planners.',
      status: 'in-progress',
      estimatedHours: 36,
      skills: ['Function Calling', 'MCP Protocol', 'Tree-of-Thoughts', 'Guardrails'],
      recommendedLectures: ['Subagent Orchestration', 'Handling State Drift in Agent Swarms'],
      projectIdea: 'Build an autonomous agent with Monte Carlo Tree Search trajectory rollback.'
    },
    {
      id: 'ms_4',
      order: 4,
      title: 'Ultra-Low Latency Inference & vLLM Serving',
      description: 'PagedAttention, continuous batching, speculative decoding, TensorRT-LLM, and multi-GPU cluster routing.',
      status: 'locked',
      estimatedHours: 32,
      skills: ['PagedAttention', 'Speculative Decoding', 'vLLM', 'Ray Serve'],
      recommendedLectures: ['Achieving 120 Tokens/sec at Scale', 'GPU Memory Defrag'],
      projectIdea: 'Deploy a high-concurrency vLLM cluster with speculative drafting.'
    },
    {
      id: 'ms_5',
      order: 5,
      title: 'Production Evaluation, Red Teaming & Observability',
      description: 'Ragas evaluation metrics, prompt injection mitigation, latency tracing with OpenTelemetry, and live eval pipelines.',
      status: 'locked',
      estimatedHours: 20,
      skills: ['Ragas', 'Red Teaming', 'OTel LLM Tracing', 'Cost Optimization'],
      recommendedLectures: ['Automated Red Teaming Harness', 'Continuous Evaluation CI/CD'],
      projectIdea: 'Construct an automated CI/CD hallucination benchmark.'
    }
  ]
};

export const MOCK_ROADMAPS: RoadmapData[] = [
  MOCK_ROADMAP,
  {
    id: 'rd_distrib_sys',
    title: 'High-Throughput Distributed Systems Engineer',
    category: 'Cloud & Infrastructure',
    level: 'Advanced',
    description: 'Master fault-tolerant consensus, Raft log replication, zero-copy packet networking, and eBPF socket kernel bypasses.',
    totalMilestones: 4,
    completedMilestones: 1,
    estimatedWeeks: 14,
    clonesCount: 9240,
    skillsCovered: ['Raft Consensus', 'Kafka', 'eBPF', 'Zero-Copy Sockets', 'Consistent Hashing'],
    certificatePath: 'InfoNest Distributed Systems Master Certification',
    milestones: [
      {
        id: 'ms_dist_1',
        order: 1,
        title: 'Consensus Protocols & Fault Tolerance',
        description: 'Deep dive into Raft leader election, heartbeats, log reconciliation, and split-brain resolution.',
        status: 'completed',
        estimatedHours: 28,
        skills: ['Raft', 'Paxos', 'Split-Brain', 'Quorum'],
        recommendedLectures: ['Raft Log Replication in Go']
      },
      {
        id: 'ms_dist_2',
        order: 2,
        title: 'Zero-Copy Streaming & Kernel Bypass',
        description: 'Eliminating memory copy overhead in POSIX network sockets using sendfile() and eBPF socket filters.',
        status: 'in-progress',
        estimatedHours: 32,
        skills: ['eBPF', 'Linux Networking', 'Zero-Copy', 'XDP'],
        recommendedLectures: ['Designing Sub-Millisecond Event Streams']
      },
      {
        id: 'ms_dist_3',
        order: 3,
        title: 'Partitioning & Storage Engines',
        description: 'LSM Trees vs B+ Trees, SSTable compaction, Bloom filters, and WAL persistence mechanics.',
        status: 'locked',
        estimatedHours: 26,
        skills: ['LSM Trees', 'RocksDB', 'WAL', 'Compaction'],
        recommendedLectures: ['Storage Engines from Scratch']
      },
      {
        id: 'ms_dist_4',
        order: 4,
        title: 'Global High-Availability & Disaster Recovery',
        description: 'Multi-region active-active replication, CRDTs, clock synchronization, and chaos engineering.',
        status: 'locked',
        estimatedHours: 24,
        skills: ['CRDTs', 'Chaos Engineering', 'Active-Active', 'Vector Clocks'],
        recommendedLectures: ['Chaos Engineering in Production']
      }
    ]
  },
  {
    id: 'rd_3d_spatial',
    title: 'Creative Technologist: 3D Spatial Web & Shaders',
    category: 'Design & Creative Engineering',
    level: 'Intermediate',
    description: 'Transform flat digital interfaces into physics-grounded, tactile 3D experiences with Three.js, GLSL, and WebGPU.',
    totalMilestones: 4,
    completedMilestones: 3,
    estimatedWeeks: 10,
    clonesCount: 6810,
    skillsCovered: ['Three.js', 'GLSL Shaders', 'WebGPU', 'PBR Materials', 'Spatial Design'],
    certificatePath: 'InfoNest Certified Spatial UI Designer',
    milestones: [
      {
        id: 'ms_3d_1',
        order: 1,
        title: '3D Coordinate Mathematics & Matrix Transforms',
        description: 'Vectors, quaternions, Euler angles, projection matrices, and camera frustum culling.',
        status: 'completed',
        estimatedHours: 16,
        skills: ['Vector Math', 'Quaternions', 'Camera Matrix'],
        recommendedLectures: ['Matrix Maths Demystified']
      },
      {
        id: 'ms_3d_2',
        order: 2,
        title: 'GLSL Fragment & Vertex Shaders',
        description: 'Procedural noise, Fresnel rims, raymarched signed distance fields (SDFs), and chromatic dispersion.',
        status: 'completed',
        estimatedHours: 24,
        skills: ['GLSL', 'Fragment Shaders', 'SDF Raymarching', 'Perlin Noise'],
        recommendedLectures: ['Interactive Holographic Shaders']
      },
      {
        id: 'ms_3d_3',
        order: 3,
        title: 'Fluid Particles & Spring Physics Simulation',
        description: 'GPGPU particle systems, Verlet integration, and mouse magnetic attractors at 120 FPS.',
        status: 'completed',
        estimatedHours: 20,
        skills: ['GPGPU', 'Physics Particles', 'Instanced Mesh'],
        recommendedLectures: ['100,000 Particles at 120 FPS']
      },
      {
        id: 'ms_3d_4',
        order: 4,
        title: 'WebGPU Pipeline Architecture',
        description: 'Compute shaders, render pipelines, bind groups, and WGSL shader authoring.',
        status: 'in-progress',
        estimatedHours: 22,
        skills: ['WebGPU', 'WGSL', 'Compute Shaders'],
        recommendedLectures: ['Transitioning from WebGL to WebGPU']
      }
    ]
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'post_1',
    creatorId: 'cr_1',
    creator: MOCK_CREATORS[0],
    type: 'knowledge',
    dropTypeLabel: 'KNOWLEDGE DROP',
    title: 'Why RAG Systems Fail Silently in Production (And the 5-Layer Defense Topology)',
    caption: 'Most enterprise RAG pipelines fail not with loud crashes, but with quiet semantic drift, hallucinated citations, and context window pollution. Here is our battle-tested 5-layer defensive architecture: dynamic query routing, reranking with Cross-Encoders, chunk boundary pruning, and learned confidence thresholds. Study the failure analysis topology below! 🧠⚡',
    tags: ['#ReasoningAI', '#RAGSystems', '#GenerativeAI', '#SystemArchitecture'],
    createdAt: '2 hours ago',
    likesCount: 3840,
    commentsCount: 242,
    bookmarksCount: 1190,
    sharesCount: 520,
    isLiked: false,
    isBookmarked: true,
    reactions: {
      insightful: 1840,
      useful: 1210,
      mindOpening: 840,
      practical: 680,
      like: 2360
    },
    userReaction: 'insightful',
    diagramUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    carouselImages: [
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 'post_2',
    creatorId: 'cr_2',
    creator: MOCK_CREATORS[1],
    coCreator: MOCK_CREATORS[0], // Collaborative Drop
    type: 'lecture',
    dropTypeLabel: 'LECTURE DROP (CO-CREATED)',
    title: 'Sub-Millisecond Event Streaming with Kafka & eBPF Socket Kernel Bypasses',
    caption: 'Collaborative deep dive with Dr. Elena: Full 42-minute technical lecture on eliminating Linux network stack copying overhead in streaming pipelines. Includes live packet analysis, kernel bypass benchmarks, and downloadable architecture cheatsheets.',
    tags: ['#DistributedSystems', '#Kafka', '#eBPF', '#Performance'],
    createdAt: '5 hours ago',
    likesCount: 2950,
    commentsCount: 184,
    bookmarksCount: 940,
    sharesCount: 340,
    isLiked: true,
    isBookmarked: false,
    reactions: {
      insightful: 1420,
      useful: 1090,
      mindOpening: 730,
      practical: 880,
      like: 1950
    },
    lectureData: {
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: '42:15',
      durationSeconds: 2535,
      level: 'Advanced',
      curriculumCourseId: 'crs_distrib_101',
      chapters: [
        { id: 'ch_1', title: 'The Problem with Standard POSIX Sockets', timestamp: '00:00', durationSeconds: 380, completed: true },
        { id: 'ch_2', title: 'Zero-Copy Transfers & sendfile() Syscall', timestamp: '06:20', durationSeconds: 610, completed: false },
        { id: 'ch_3', title: 'eBPF Filter Attachment on Network NIC', timestamp: '16:30', durationSeconds: 790, completed: false },
        { id: 'ch_4', title: 'Benchmark Results & Live Load Testing', timestamp: '29:40', durationSeconds: 755, completed: false }
      ],
      resources: [
        { id: 'res_1', title: 'eBPF Kernel Socket Bypass Guide.pdf', type: 'pdf', url: '#', size: '4.2 MB' },
        { id: 'res_2', title: 'GitHub: high-throughput-event-mesh', type: 'github', url: 'https://github.com' },
        { id: 'res_3', title: 'Kafka Producer Optimization Cheatsheet', type: 'cheatsheet', url: '#', size: '1.1 MB' }
      ],
      notes: 'Key Takeaway: By bypassing the Linux network stack copying to user-space, memory bandwidth saturation drops from 88% down to 14% at 1.2M packets/sec.',
      quizCheckpoint: {
        question: 'Why does attaching an eBPF program directly to the NIC socket filter reduce latency?',
        options: [
          'It increases CPU clock frequency by 15%',
          'It drops packets before the kernel context switches to user space',
          'It forces all incoming messages into a single mutex lock',
          'It encrypts payload data using SHA-256'
        ],
        correctOptionIndex: 1,
        explanation: 'Correct! By filtering and steering packets in kernel space, costly user-space memory copies and context switches are eliminated.'
      }
    }
  },
  {
    id: 'post_3',
    creatorId: 'cr_1',
    creator: MOCK_CREATORS[0],
    type: 'roadmap',
    dropTypeLabel: 'ROADMAP DROP',
    title: 'Full-Stack Generative AI Architect Roadmap: 5 Interactive Phases (2025 - 2026)',
    caption: 'I organized 18 months of bleeding-edge AI research into a structured, step-by-step master roadmap with verified milestones, prerequisite projects, and code repos. Tap below to clone this roadmap directly to your personal goal tracker! 🚀',
    tags: ['#LearningRoadmap', '#AIPath', '#CareerGrowth', '#MachineLearning'],
    createdAt: '1 day ago',
    likesCount: 6120,
    commentsCount: 430,
    bookmarksCount: 3820,
    sharesCount: 1420,
    isLiked: true,
    isBookmarked: true,
    reactions: {
      insightful: 2450,
      useful: 2180,
      mindOpening: 1390,
      practical: 1150,
      like: 3420
    },
    roadmapData: MOCK_ROADMAP
  },
  {
    id: 'post_4',
    creatorId: 'cr_4',
    creator: MOCK_CREATORS[3],
    type: 'challenge',
    dropTypeLabel: 'CHALLENGE DROP',
    title: 'Knowledge Challenge: Dijkstra vs A* in Frontier Robotics (Can You Reach 1ms?)',
    caption: 'Frontier robots navigating dynamic warehouse grids need pathfinding in under 1.2ms. Given a 1,000 x 1,000 spatial occupancy grid with moving obstacles, write an admissible heuristic A* algorithm with Euclidean tie-breaking that passes our 50 test cases. +80 Knowledge Tokens reward!',
    tags: ['#Algorithms', '#Robotics', '#DataStructures', '#Challenge'],
    createdAt: '1 day ago',
    likesCount: 1680,
    commentsCount: 215,
    bookmarksCount: 890,
    sharesCount: 410,
    isLiked: false,
    isBookmarked: false,
    reactions: {
      insightful: 890,
      useful: 760,
      mindOpening: 540,
      practical: 1120,
      like: 1680
    },
    challengeData: {
      difficulty: 'Hard',
      participantsCount: 428,
      rewardTokens: 80,
      deadline: '3 Days Remaining',
      prompt: 'Implement an A* pathfinder with Euclidean distance heuristic and 8-directional diagonal movement penalty. Must execute in < 1.2ms on WebAssembly runtime.'
    }
  },
  {
    id: 'post_5',
    creatorId: 'cr_3',
    creator: MOCK_CREATORS[2],
    type: 'visual',
    dropTypeLabel: 'VISUAL DROP',
    title: 'Holographic Cyber-Glass Shader Architecture in WebGPU',
    caption: 'Flat UI was built for the 2012 mobile web. Today, consumer graphics cards effortlessly render 120 FPS raymarched volumes directly in the browser viewport. Swipe through for the WGSL compute pipeline breakdown!',
    tags: ['#WebGPU', '#Threejs', '#CyberAesthetic', '#Shaders'],
    createdAt: '2 days ago',
    likesCount: 2810,
    commentsCount: 194,
    bookmarksCount: 1420,
    sharesCount: 680,
    isLiked: false,
    isBookmarked: false,
    reactions: {
      insightful: 1020,
      useful: 680,
      mindOpening: 1530,
      practical: 490,
      like: 2810
    },
    carouselImages: [
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 'post_6',
    creatorId: 'cr_1',
    creator: MOCK_CREATORS[0],
    type: 'research',
    dropTypeLabel: 'RESEARCH DROP',
    title: 'Research Breakdown: Speculative Decoding & Latent KV-Cache Compression in DeepSeek V3',
    caption: 'DeepSeek V3 achieved state-of-the-art token throughput via Multi-Head Latent Attention (MLA) and Dual-Draft Speculative Decoding. Here is our 10-point research breakdown with mathematical formulations and memory footprint comparisons.',
    tags: ['#ResearchDrop', '#DeepSeek', '#Transformers', '#MachineLearning'],
    createdAt: '3 days ago',
    likesCount: 3410,
    commentsCount: 280,
    bookmarksCount: 2150,
    sharesCount: 910,
    isLiked: true,
    isBookmarked: true,
    reactions: {
      insightful: 1720,
      useful: 980,
      mindOpening: 1340,
      practical: 610,
      like: 2150
    },
    researchData: {
      paperTitle: 'Multi-Head Latent Attention & Speculative Verification in Large Language Models',
      venue: 'Frontier AI Research Series 2026',
      keyFindings: [
        'MLA compresses KV cache into low-dimensional latent vectors, reducing memory by 93.3%',
        'Dual draft speculative decoding yields 2.8x higher tokens/sec on 70B models',
        'Continuous batching latency drops from 42ms down to 11ms under concurrent user loads'
      ],
      pdfUrl: '#'
    }
  },
  {
    id: 'post_7',
    creatorId: 'cr_6',
    creator: MOCK_CREATORS[5],
    type: 'code',
    dropTypeLabel: 'CODE DROP',
    title: 'How React 19 Action Optimistic Rollbacks Actually Work Internally',
    caption: 'Tired of showing loading spinners everywhere? Here is how to achieve instant zero-latency optimistic UI updates with automatic server rollback using the native useOptimistic hook.',
    tags: ['#React19', '#FrontendArchitecture', '#WebDev', '#JavaScript'],
    createdAt: '3 days ago',
    likesCount: 2410,
    commentsCount: 156,
    bookmarksCount: 880,
    sharesCount: 310,
    isLiked: true,
    isBookmarked: true,
    reactions: {
      insightful: 1150,
      useful: 1420,
      mindOpening: 720,
      practical: 1380,
      like: 1920
    },
    thoughtData: {
      thought: 'Optimistic UI makes interfaces feel 10x faster because user intent is acknowledged in 0ms while network verification happens asynchronously.',
      language: 'typescript',
      codeSnippet: `const [optimisticLikes, setOptimisticLikes] = useOptimistic(\n  post.likesCount,\n  (state, delta: number) => state + delta\n);\n\nasync function handleLike() {\n  setOptimisticLikes(1);\n  await api.likePost(post.id).catch(() => setOptimisticLikes(-1));\n}`,
      keyTakeaways: [
        'Never block user interactions on network round-trips.',
        'Always provide automatic rollback when the mutation fails.',
        'Pairs naturally with tactile audio pops for haptic feedback.'
      ]
    }
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'crs_ai_agentic',
    title: 'Autonomous Reasoning LLMs & Agent Swarms',
    subtitle: 'Build, evaluate, and scale multi-agent production systems using Tree-of-Thoughts and MCP.',
    description: 'An exhaustive masterclass on modern generative AI architecture. You will explore test-time search, process-supervised reward models, multi-agent coordination protocols, and low-latency inference clusters.',
    creator: MOCK_CREATORS[0],
    level: 'Advanced',
    category: 'Artificial Intelligence',
    rating: 4.97,
    reviewsCount: 3410,
    studentsCount: 28400,
    estimatedHours: 24,
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    tags: ['Agentic Workflows', 'MCTS', 'PyTorch', 'Model Context Protocol', 'Reasoning Models'],
    certificateAvailable: true,
    certificateDetails: {
      title: 'Certified Frontier AI Systems Engineer',
      issuer: 'InfoNest Academy in collaboration with Frontier AI Labs',
      credentialId: 'INFONEST-CERT-AI-84920',
      skillsCertified: ['Tree-of-Thoughts', 'Process Reward Models', 'Agent Swarm Protocol', 'vLLM Optimization']
    },
    isEnrolled: true,
    progressPercent: 45,
    whatYouWillLearn: [
      'Deconstruct Transformer attention mechanisms and optimize KV-cache memory layout',
      'Implement Monte Carlo Tree Search (MCTS) to generate test-time reasoning traces',
      'Train learned process reward models (PRMs) to score intermediate reasoning steps',
      'Orchestrate multi-agent swarms with Model Context Protocol (MCP) and tool guardrails',
      'Deploy low-latency continuous batching inference clusters using vLLM and Ray'
    ],
    requirements: [
      'Proficiency in Python and basic familiarity with PyTorch or JAX',
      'Foundational understanding of machine learning and gradient descent',
      'Comfort with asynchronous programming and API integrations'
    ],
    reviews: [
      {
        id: 'rev_1',
        userName: 'Alexandre Dubois',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Without question the most thorough and up-to-date course on reasoning models available anywhere on the web. Dr. Elena explains mathematical nuances with pristine clarity.'
      },
      {
        id: 'rev_2',
        userName: 'Jessica Liang',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: '1 month ago',
        comment: 'The MCTS implementation module alone was worth 10x the price. I immediately applied the branch verifier logic to our production search pipeline.'
      }
    ],
    modules: [
      {
        id: 'mod_1',
        title: 'Module 1: Test-Time Reasoning Mechanics',
        description: 'How inference-time compute scaling is transforming foundational models.',
        lectures: [
          {
            id: 'lec_1',
            title: 'Inference Scaling vs Pre-training Scaling',
            duration: '28:15',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isFreePreview: true,
            isCompleted: true,
            notes: 'Test-time compute transforms models from intuitive pattern predictors into deliberate planners.'
          },
          {
            id: 'lec_2',
            title: 'Monte Carlo Tree Search in Latent Space',
            duration: '34:40',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isFreePreview: true,
            isCompleted: true,
            notes: 'Exploring tree branches with verifier feedback yields exponential gains in olympiad tasks.'
          },
          {
            id: 'lec_3',
            title: 'Designing Learned Process Verifiers',
            duration: '41:10',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isFreePreview: false,
            isCompleted: false,
            notes: 'Process-supervised reward models (PRMs) outscore outcome-supervised reward models (ORMs).'
          }
        ]
      },
      {
        id: 'mod_2',
        title: 'Module 2: Multi-Agent Coordination Protocols',
        description: 'Implementing Model Context Protocol (MCP) and state synchronization across agent swarms.',
        lectures: [
          {
            id: 'lec_4',
            title: 'Model Context Protocol: Architecture & Primitives',
            duration: '31:20',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isFreePreview: false,
            isCompleted: false,
            notes: 'Standardizing client-host-server interfaces for reliable multi-tool orchestration.'
          },
          {
            id: 'lec_5',
            title: 'Handling State Drift & Tool Hallucination',
            duration: '39:00',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isFreePreview: false,
            isCompleted: false,
            notes: 'Techniques for continuous trajectory checkpoints and fallback recovery.'
          }
        ]
      }
    ]
  },
  {
    id: 'crs_distrib_101',
    title: 'Hyper-Scale Distributed Systems: 0 to 10M QPS',
    subtitle: 'End-to-end design of fault-tolerant, low-latency globally distributed data meshes.',
    description: 'Learn how to architect, benchmark, and deploy systems capable of handling millions of concurrent events per second without data loss or split-brain partitions.',
    creator: MOCK_CREATORS[1],
    level: 'Masterclass',
    category: 'Cloud & Infrastructure',
    rating: 4.93,
    reviewsCount: 2180,
    studentsCount: 19800,
    estimatedHours: 32,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    tags: ['Distributed Systems', 'Kafka', 'Raft Consensus', 'eBPF', 'Go'],
    certificateAvailable: true,
    isEnrolled: false,
    progressPercent: 0,
    whatYouWillLearn: [
      'Implement Raft log replication and election state machines from scratch in Go',
      'Optimize Kafka clusters to eliminate consumer lag and avoid partition hotspots',
      'Write eBPF socket filters to bypass TCP user-space copy bottlenecks',
      'Architect consistent hashing rings resilient to sudden 50% cluster churn'
    ],
    requirements: [
      'Working knowledge of Go, Rust, or C/C++',
      'Understanding of basic computer networking (TCP/IP, sockets)',
      'Familiarity with containerization and Linux terminal'
    ],
    reviews: [
      {
        id: 'rev_dist_1',
        userName: 'Vikram Joshi',
        userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: '3 weeks ago',
        comment: 'Marcus takes you right into production war-rooms. No toy examples. Real kernel flame graphs and zero-copy packet traces.'
      }
    ],
    modules: [
      {
        id: 'mod_dist_1',
        title: 'Module 1: Consensus & Partitioning',
        description: 'Deep-dive into Raft, Paxos, and consistent hashing algorithms.',
        lectures: [
          {
            id: 'lec_dist_1',
            title: 'Consistent Hashing Under Cluster Churn',
            duration: '25:10',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isFreePreview: true,
            isCompleted: false,
            notes: 'Virtual nodes prevent catastrophic load spikes during server additions.'
          },
          {
            id: 'lec_dist_2',
            title: 'Raft Log Replication in Go',
            duration: '44:20',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isFreePreview: false,
            isCompleted: false,
            notes: 'Deterministic state machine guarantees safety across network partitions.'
          }
        ]
      }
    ]
  },
  {
    id: 'crs_three_design',
    title: 'Spatial Web & 3D Shaders with Three.js',
    subtitle: 'Craft lavish visual interfaces, custom GLSL shaders, and interactive 3D digital physics.',
    description: 'Elevate your frontend engineering into creative technology. Learn procedural noise, raymarched holographic volumes, and 120 FPS spring physics.',
    creator: MOCK_CREATORS[2],
    level: 'Intermediate',
    category: 'Design & Creative Engineering',
    rating: 4.98,
    reviewsCount: 1840,
    studentsCount: 14200,
    estimatedHours: 18,
    coverImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    tags: ['Three.js', 'GLSL Shaders', 'WebGPU', 'Creative Tech', 'UI/UX'],
    certificateAvailable: true,
    isEnrolled: true,
    progressPercent: 70,
    whatYouWillLearn: [
      'Write vertex and fragment shaders directly in GLSL and WGSL',
      'Build physics-based holographic tilt cards with specular light reflection',
      'Animate 100,000 particle systems at 120 FPS using GPU instancing',
      'Harmonize 3D micro-interactions with procedural Web Audio tactile feedback'
    ],
    requirements: [
      'Basic familiarity with JavaScript/TypeScript and modern CSS',
      'No previous 3D graphics experience required'
    ],
    reviews: [
      {
        id: 'rev_3d_1',
        userName: 'Carlos Mendes',
        userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: '1 week ago',
        comment: 'Sarah’s explanations of Fresnel glow and shader math transformed the look of my entire portfolio in a single weekend.'
      }
    ],
    modules: [
      {
        id: 'mod_three_1',
        title: 'Module 1: Procedural Geometries & Shaders',
        description: 'Writing fragment and vertex shaders from scratch in GLSL.',
        lectures: [
          {
            id: 'lec_three_1',
            title: 'Lighting Models: Blinn-Phong to PBR',
            duration: '30:15',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isFreePreview: true,
            isCompleted: true,
            notes: 'PBR models conserve energy and deliver photorealistic surface reflections.'
          },
          {
            id: 'lec_three_2',
            title: 'Interactive Holographic Shaders',
            duration: '38:40',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isFreePreview: true,
            isCompleted: true,
            notes: 'Combining view angles with color ramps creates dynamic iridescent sheen.'
          }
        ]
      }
    ]
  },
  {
    id: 'crs_crypto_sec',
    title: 'Zero-Knowledge Cryptography & ZK-SNARKs',
    subtitle: 'Mathematical foundations and developer implementation of non-interactive privacy proofs.',
    description: 'Demystify arithmetic circuits, QAPs, Groth16, and PLONK to construct cryptographic verifiable computing systems.',
    creator: MOCK_CREATORS[3],
    level: 'Masterclass',
    category: 'Cybersecurity',
    rating: 4.88,
    reviewsCount: 920,
    studentsCount: 8900,
    estimatedHours: 26,
    coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
    tags: ['Zero-Knowledge', 'ZK-SNARKs', 'Rust', 'Privacy', 'Cryptography'],
    certificateAvailable: true,
    isEnrolled: false,
    progressPercent: 0,
    whatYouWillLearn: [
      'Construct arithmetic circuits from algebraic constraints',
      'Implement Groth16 and PLONK proving systems in Rust',
      'Verify computational integrity on chain with constant-size proofs'
    ],
    requirements: [
      'Basic modular arithmetic and polynomial algebra',
      'Experience in Rust or Python'
    ],
    reviews: [],
    modules: [
      {
        id: 'mod_zk_1',
        title: 'Module 1: The Cryptographic Foundations',
        description: 'Elliptic curves and pairings.',
        lectures: [
          {
            id: 'lec_zk_1',
            title: 'Elliptic Curve Pairings & Bilinear Maps',
            duration: '36:10',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            isFreePreview: true,
            isCompleted: false
          }
        ]
      }
    ]
  }
];

export const MOCK_GOALS: UserGoal[] = [
  {
    id: 'goal_1',
    roadmapTitle: 'Full-Stack Generative AI Architect (2025 - 2026)',
    roadmapId: 'rd_ai_architect',
    targetHoursPerWeek: 12,
    loggedHoursThisWeek: 9.5,
    targetCompletionDate: 'November 2026',
    streakDays: 14,
    completedTasks: 8,
    totalTasks: 15,
    weeklyHistory: [1.5, 2.0, 1.0, 2.5, 1.5, 1.0, 0] // Mon-Sun
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    category: 'creator',
    title: 'Dr. Elena Rostova published a new lecture',
    description: 'Masterclass: Process Reward Models in Latent Space is now available.',
    timestamp: '25m ago',
    read: false,
    actionUrl: '/lecture/lec_1',
    avatar: MOCK_CREATORS[0].avatar
  },
  {
    id: 'notif_2',
    category: 'learning',
    title: 'Milestone 2 Completed!',
    description: 'You completed Parameter Efficient Adaptation. +250 Knowledge Tokens awarded.',
    timestamp: '2h ago',
    read: false,
    actionUrl: '/goals'
  },
  {
    id: 'notif_3',
    category: 'social',
    title: 'Sarah Chen replied to your comment',
    description: '"The slide on Verifier Rewards illustrates the search tree branching better than anything I have seen."',
    timestamp: '5h ago',
    read: false,
    actionUrl: '/post/post_1',
    avatar: MOCK_CREATORS[2].avatar
  },
  {
    id: 'notif_4',
    category: 'goals',
    title: '14-Day Learning Streak Active! 🔥',
    description: 'You are in the top 3% of consistent learners on InfoNest this week.',
    timestamp: '1d ago',
    read: true,
    actionUrl: '/goals'
  },
  {
    id: 'notif_5',
    category: 'system',
    title: 'Knowledge Token Royalties Distributed',
    description: 'You earned 450 Knowledge Tokens from active study engagement.',
    timestamp: '2d ago',
    read: true,
    actionUrl: '/profile'
  }
];

export const MOCK_CREATOR_CONTENT: ContentItem[] = [
  {
    id: 'cnt_1',
    title: 'The Blueprint of Frontier Reasoning AI',
    type: 'post',
    status: 'published',
    date: 'Sep 18, 2026',
    views: 14200,
    likes: 3840,
    comments: 242
  },
  {
    id: 'cnt_2',
    title: 'Sub-Millisecond Event Streams with Kafka & eBPF',
    type: 'lecture',
    status: 'published',
    date: 'Sep 15, 2026',
    views: 9800,
    likes: 2950,
    comments: 184
  },
  {
    id: 'cnt_3',
    title: 'Autonomous Reasoning LLMs & Agent Swarms',
    type: 'course',
    status: 'published',
    date: 'Aug 28, 2026',
    views: 48900,
    likes: 12400,
    comments: 890
  },
  {
    id: 'cnt_4',
    title: 'Full-Stack Generative AI Architect',
    type: 'roadmap',
    status: 'published',
    date: 'Aug 10, 2026',
    views: 31200,
    likes: 6120,
    comments: 430
  },
  {
    id: 'cnt_5',
    title: 'WebGPU Compute Shaders: Deep Dive Draft',
    type: 'lecture',
    status: 'draft',
    date: 'Sep 20, 2026',
    views: 0,
    likes: 0,
    comments: 0
  }
];

export const MOCK_ANALYTICS: Record<'7d' | '30d' | '90d' | '1y', AnalyticsData> = {
  '7d': {
    followerGrowth: [
      { date: 'Mon', followers: 141200 },
      { date: 'Tue', followers: 141450 },
      { date: 'Wed', followers: 141700 },
      { date: 'Thu', followers: 141950 },
      { date: 'Fri', followers: 142100 },
      { date: 'Sat', followers: 142320 },
      { date: 'Sun', followers: 142500 }
    ],
    watchTime: [
      { date: 'Mon', hours: 420 },
      { date: 'Tue', hours: 560 },
      { date: 'Wed', hours: 610 },
      { date: 'Thu', hours: 590 },
      { date: 'Fri', hours: 720 },
      { date: 'Sat', hours: 840 },
      { date: 'Sun', hours: 910 }
    ],
    enrollments: [
      { date: 'Mon', count: 42 },
      { date: 'Tue', count: 58 },
      { date: 'Wed', count: 64 },
      { date: 'Thu', count: 71 },
      { date: 'Fri', count: 85 },
      { date: 'Sat', count: 110 },
      { date: 'Sun', count: 125 }
    ],
    audienceActivity: [
      { time: '00:00', active: 180 },
      { time: '04:00', active: 90 },
      { time: '08:00', active: 480 },
      { time: '12:00', active: 850 },
      { time: '16:00', active: 1200 },
      { time: '20:00', active: 940 }
    ]
  },
  '30d': {
    followerGrowth: [
      { date: 'Week 1', followers: 136000 },
      { date: 'Week 2', followers: 138200 },
      { date: 'Week 3', followers: 140500 },
      { date: 'Week 4', followers: 142500 }
    ],
    watchTime: [
      { date: 'Week 1', hours: 3200 },
      { date: 'Week 2', hours: 3900 },
      { date: 'Week 3', hours: 4400 },
      { date: 'Week 4', hours: 5200 }
    ],
    enrollments: [
      { date: 'Week 1', count: 320 },
      { date: 'Week 2', count: 410 },
      { date: 'Week 3', count: 480 },
      { date: 'Week 4', count: 590 }
    ],
    audienceActivity: [
      { time: '00:00', active: 310 },
      { time: '04:00', active: 140 },
      { time: '08:00', active: 620 },
      { time: '12:00', active: 1100 },
      { time: '16:00', active: 1540 },
      { time: '20:00', active: 1220 }
    ]
  },
  '90d': {
    followerGrowth: [
      { date: 'Month 1', followers: 124000 },
      { date: 'Month 2', followers: 133000 },
      { date: 'Month 3', followers: 142500 }
    ],
    watchTime: [
      { date: 'Month 1', hours: 9800 },
      { date: 'Month 2', hours: 14200 },
      { date: 'Month 3', hours: 18900 }
    ],
    enrollments: [
      { date: 'Month 1', count: 1100 },
      { date: 'Month 2', count: 1650 },
      { date: 'Month 3', count: 2200 }
    ],
    audienceActivity: [
      { time: '00:00', active: 400 },
      { time: '04:00', active: 200 },
      { time: '08:00', active: 750 },
      { time: '12:00', active: 1300 },
      { time: '16:00', active: 1800 },
      { time: '20:00', active: 1400 }
    ]
  },
  '1y': {
    followerGrowth: [
      { date: 'Q1', followers: 85000 },
      { date: 'Q2', followers: 104000 },
      { date: 'Q3', followers: 123000 },
      { date: 'Q4', followers: 142500 }
    ],
    watchTime: [
      { date: 'Q1', hours: 24000 },
      { date: 'Q2', hours: 38000 },
      { date: 'Q3', hours: 52000 },
      { date: 'Q4', hours: 68000 }
    ],
    enrollments: [
      { date: 'Q1', count: 3200 },
      { date: 'Q2', count: 5400 },
      { date: 'Q3', count: 7800 },
      { date: 'Q4', count: 9600 }
    ],
    audienceActivity: [
      { time: '00:00', active: 500 },
      { time: '04:00', active: 250 },
      { time: '08:00', active: 900 },
      { time: '12:00', active: 1600 },
      { time: '16:00', active: 2100 },
      { time: '20:00', active: 1700 }
    ]
  }
};

// ---------------- SIGNATURE INFONEST DOMAIN MOCK DATA ----------------

export const MOCK_KNOWLEDGE_TRAILS: KnowledgeTrail[] = [
  {
    id: 'trail_1',
    title: 'My Frontier AI & Reasoning Journey',
    category: 'Artificial Intelligence',
    description: 'Sequenced collection from transformer attention fundamentals to tree-of-thought agent swarms.',
    createdAt: '3 days ago',
    items: [
      { id: 'ti_1', title: 'Why Attention Scales Quadratically (Knowledge Spark)', type: 'drop', duration: '3 min', completed: true },
      { id: 'ti_2', title: 'Attention is All You Need Deconstructed', type: 'lecture', duration: '28 min', completed: true },
      { id: 'ti_3', title: 'KV-Cache Memory Layout & CUDA Profiling', type: 'lecture', duration: '35 min', completed: true },
      { id: 'ti_4', title: 'Monte Carlo Tree Search & Process Verifiers', type: 'lecture', duration: '42 min', completed: false },
      { id: 'ti_5', title: 'Multi-Agent MCP Swarm Project', type: 'project', duration: '3 hours', completed: false }
    ]
  },
  {
    id: 'trail_2',
    title: 'Distributed Systems & Cloud Scale Trail',
    category: 'Systems & Cloud',
    description: 'Kernel bypass networking, zero-copy sockets, and event stream architecture.',
    createdAt: '1 week ago',
    items: [
      { id: 'ti_6', title: 'Kafka Partition Gotchas (Spark)', type: 'drop', duration: '2 min', completed: true },
      { id: 'ti_7', title: 'Sub-Millisecond Event Streaming with Kafka & eBPF', type: 'lecture', duration: '42 min', completed: true },
      { id: 'ti_8', title: 'Raft Consensus from Zero to Production', type: 'lecture', duration: '50 min', completed: false },
      { id: 'ti_9', title: 'Kernel Socket Bypass Implementation', type: 'project', duration: '4 hours', completed: false }
    ]
  },
  {
    id: 'trail_3',
    title: 'Modern React Architecture & WebGL',
    category: 'Frontend Engineering',
    description: 'Zero-bundle RSC, optimistic mutations, and Three.js cyber glass shaders.',
    createdAt: '2 weeks ago',
    items: [
      { id: 'ti_10', title: 'React 19 Action Optimistic Rollbacks', type: 'drop', duration: '5 min', completed: true },
      { id: 'ti_11', title: 'WebGPU Pipeline Architecture', type: 'lecture', duration: '38 min', completed: true },
      { id: 'ti_12', title: 'Interactive Holographic Shaders Project', type: 'project', duration: '2 hours', completed: true }
    ]
  }
];

export const MOCK_LEARNING_MISSIONS: LearningMission[] = [
  {
    id: 'mis_daily_1',
    title: "Understand Dijkstra's Algorithm & Graph Shortest Paths",
    type: 'daily',
    description: 'Master Priority Queue optimization and avoid the O(E²) stale vertex trap.',
    rewardTokens: 80,
    progress: 1,
    total: 3,
    completed: false,
    claimed: false,
    tasks: [
      { id: 'tsk_1', title: 'Watch 12 min lecture on Dijkstra Priority Queue', completed: true },
      { id: 'tsk_2', title: 'Complete 5-question checkpoint quiz', completed: false },
      { id: 'tsk_3', title: 'Solve 1 graph traversal challenge', completed: false }
    ]
  },
  {
    id: 'mis_weekly_1',
    title: 'Ship 2 Distributed System Architecture Diagrams',
    type: 'weekly',
    description: 'Design and publish verified topology drops to earn Knowledge Tokens.',
    rewardTokens: 200,
    progress: 2,
    total: 3,
    completed: false,
    claimed: false,
    tasks: [
      { id: 'tsk_4', title: 'Draft Kafka partition balancing topology', completed: true },
      { id: 'tsk_5', title: 'Review peer RAG failure analysis drop', completed: true },
      { id: 'tsk_6', title: 'Benchmark WebGPU compute shader latency', completed: false }
    ]
  },
  {
    id: 'mis_roadmap_1',
    title: 'Complete Autonomous Agentic Architectures Milestone',
    type: 'roadmap',
    description: 'Finish phase 3 of Full-Stack Generative AI Architect roadmap.',
    rewardTokens: 150,
    progress: 3,
    total: 4,
    completed: false,
    claimed: false,
    tasks: [
      { id: 'tsk_7', title: 'Study MCTS trajectory rollback', completed: true },
      { id: 'tsk_8', title: 'Build function calling MCP client', completed: true },
      { id: 'tsk_9', title: 'Pass guardrails unit test suite', completed: true },
      { id: 'tsk_10', title: 'Submit pull request to GitHub repo', completed: false }
    ]
  }
];

export const MOCK_ORBIT_ROOMS: OrbitRoom[] = [
  {
    id: 'room_ai',
    name: 'AI Builders Orbit',
    tag: '#AIBuilders',
    description: 'Focused collaborative community on reasoning models, MCTS, and agent swarms.',
    membersCount: 4820,
    activeNow: 342,
    icon: '🧠',
    gradient: 'from-purple-900/50 to-indigo-950/80',
    topTopics: ['MCTS Planning', 'vLLM Continuous Batching', 'Model Context Protocol', 'PRM Verifiers'],
    recentDropTitle: 'Benchmarking DeepSeek V3 Speculative Drafting on 8x H100s'
  },
  {
    id: 'room_systems',
    name: 'System Design Lab',
    tag: '#SystemDesign',
    description: 'High-throughput event streams, consensus protocols, and kernel bypass networking.',
    membersCount: 6280,
    activeNow: 580,
    icon: '⚡',
    gradient: 'from-cyan-950/50 to-blue-950/80',
    topTopics: ['Kafka Hot Partitions', 'eBPF Socket Filters', 'Raft Consensus', 'Zero-Copy Sockets'],
    recentDropTitle: 'Solving 15M QPS Memory Bottlenecks with io_uring'
  },
  {
    id: 'room_react',
    name: 'React Architects',
    tag: '#ReactArchitects',
    description: 'Exploring React 19 compiler internals, zero-bundle RSCs, and client performance.',
    membersCount: 3940,
    activeNow: 218,
    icon: '⚛️',
    gradient: 'from-indigo-950/50 to-purple-950/80',
    topTopics: ['Action Optimistic Rollbacks', 'Server Actions Security', 'Micro-Frontends', 'Bundle Slicing'],
    recentDropTitle: 'Eliminating Re-renders with Compiler Memoization'
  },
  {
    id: 'room_dsa',
    name: 'DSA Warriors',
    tag: '#DSAWarriors',
    description: 'Competitive programming, graph theory, dynamic programming, and interview challenges.',
    membersCount: 5610,
    activeNow: 412,
    icon: '⚔️',
    gradient: 'from-emerald-950/50 to-teal-950/80',
    topTopics: ['Segment Trees', 'Dijkstra Priority Queues', 'Bitmask DP', 'Fenwick Trees'],
    recentDropTitle: 'Solving Robot Obstacle Avoidance in O(V log V)'
  },
  {
    id: 'room_security',
    name: 'Cybersecurity Hub',
    tag: '#Cybersecurity',
    description: 'Zero-knowledge proofs, memory safety in Rust/Go, and cloud security architecture.',
    membersCount: 2750,
    activeNow: 164,
    icon: '🛡️',
    gradient: 'from-rose-950/50 to-slate-950/80',
    topTopics: ['ZK-SNARKs', 'eBPF Security Auditing', 'Auth0 Token Security', 'Memory Forensics'],
    recentDropTitle: 'Zero-Knowledge Proofs in 3 Minutes: The Ali Baba Analogy'
  }
];

export const MOCK_KNOWLEDGE_CHALLENGES: KnowledgeChallenge[] = [
  {
    id: 'ch_1',
    title: 'Dijkstra vs A* in Frontier Robotics (Reach < 1ms)',
    difficulty: 'Hard',
    category: 'Algorithms',
    participants: 428,
    deadline: '3 Days Remaining',
    rewardTokens: 80,
    description: 'Given a 1,000 x 1,000 spatial occupancy grid with moving obstacles, write an admissible heuristic A* algorithm with Euclidean tie-breaking that passes our 50 test cases within 1.2ms.',
    tags: ['Algorithms', 'A*', 'C++', 'Wasm']
  },
  {
    id: 'ch_2',
    title: 'Design a Distributed Token-Bucket Rate Limiter in Go',
    difficulty: 'Intermediate',
    category: 'System Design',
    participants: 610,
    deadline: '5 Days Remaining',
    rewardTokens: 120,
    description: 'Implement a distributed rate limiter that handles 100k requests/sec using Redis Lua scripts without race conditions or memory leaks.',
    tags: ['Go', 'Redis', 'Concurrency', 'DistributedSystems']
  },
  {
    id: 'ch_3',
    title: 'Author a WebGPU Compute Matrix Multiply (GEMM)',
    difficulty: 'Extreme',
    category: 'Graphics & GPU',
    participants: 185,
    deadline: '1 Week Remaining',
    rewardTokens: 250,
    description: 'Write WGSL compute shader kernel with shared memory workgroup tiling that achieves > 80% theoretical peak TFLOPS on modern browser WebGPU.',
    tags: ['WebGPU', 'WGSL', 'ComputeShaders', 'CUDA']
  }
];

export const MOCK_KNOWLEDGE_PROOFS: KnowledgeProof[] = [
  {
    id: 'prf_1024',
    proofNumber: 1024,
    title: 'Advanced React Architecture & Performance Engineering',
    completedDate: 'March 14, 2026',
    lecturesCount: 12,
    projectsCount: 3,
    quizzesCount: 2,
    totalHours: 18,
    verificationHash: '0x7f4e92a831b092ce41a87d0e',
    badgeColor: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'prf_1018',
    proofNumber: 1018,
    title: 'High-Throughput Distributed Systems & Kafka Mesh',
    completedDate: 'February 28, 2026',
    lecturesCount: 8,
    projectsCount: 2,
    quizzesCount: 4,
    totalHours: 24,
    verificationHash: '0x9d21c4b882a10842ff39ab14',
    badgeColor: 'from-cyan-500 to-blue-500'
  },
  {
    id: 'prf_982',
    proofNumber: 982,
    title: 'Transformer Mechanics & Reasoning LLMs',
    completedDate: 'January 19, 2026',
    lecturesCount: 14,
    projectsCount: 4,
    quizzesCount: 3,
    totalHours: 32,
    verificationHash: '0x3a82f104e69b8214fa77cd90',
    badgeColor: 'from-pink-500 to-purple-500'
  }
];

export const MOCK_LEARNING_DNA: LearningDNATopic[] = [
  { name: 'Reasoning AI & Agents', percentage: 92, level: 'Frontier Expert', color: '#8B5CF6' },
  { name: 'Distributed Systems', percentage: 84, level: 'Advanced Architect', color: '#00F0FF' },
  { name: 'Data Structures & Alg', percentage: 88, level: 'Advanced Problem Solver', color: '#10B981' },
  { name: 'Frontend & WebGPU', percentage: 78, level: 'Proficient Engineer', color: '#EC4899' },
  { name: 'System Security & ZK', percentage: 65, level: 'Practitioner', color: '#F59E0B' }
];

export const MOCK_KNOWLEDGE_WEATHER: KnowledgeWeatherItem[] = [
  { topic: 'AI Research', trend: 'Rising', arrow: '↑', color: 'text-purple-400' },
  { topic: 'System Design', trend: 'Hot', arrow: '↑', color: 'text-rose-400' },
  { topic: 'WebGPU 3D', trend: 'Emerging', arrow: '↗', color: 'text-cyan-400' },
  { topic: 'Blockchain & ZK', trend: 'Stable', arrow: '→', color: 'text-emerald-400' }
];
