import { Research } from '@/types/content';

export const mockResearch: Research[] = [
  {
    id: 'res-1',
    title: {
      ko: 'AI 기반 디지털 미디어 아트 창작 연구',
      en: 'AI-Based Digital Media Art Creation Research',
    },
    theme: {
      ko: '인공지능과 예술',
      en: 'Artificial Intelligence and Art',
    },
    summary: {
      ko: '생성형 AI 기술을 활용한 새로운 형태의 디지털 미디어 아트 창작 방법론을 연구합니다. 기계 학습 알고리즘과 예술적 감성의 융합을 통해 인간-AI 협업 창작의 가능성을 탐구합니다.',
      en: 'Researching new methodologies for digital media art creation utilizing generative AI technology. Exploring the possibilities of human-AI collaborative creation through the convergence of machine learning algorithms and artistic sensibility.',
    },
    description: {
      ko: '본 연구는 생성형 AI 모델(GAN, Diffusion Models, Transformer 기반 모델 등)을 활용하여 디지털 미디어 아트의 새로운 창작 패러다임을 제시합니다. 전통적인 예술 창작 과정에서 AI가 어떤 역할을 할 수 있는지, 그리고 AI와의 협업이 예술적 표현의 범위를 어떻게 확장할 수 있는지를 탐구합니다.\n\n연구의 핵심은 기술적 도구로서의 AI를 넘어, 창작 파트너로서의 AI의 가능성을 실험하는 것입니다. 이를 통해 예술가-AI 협업의 새로운 워크플로우를 제안하고, 이러한 협업이 만들어내는 예술적 결과물의 미학적 가치를 분석합니다.',
      en: 'This research presents a new creative paradigm for digital media art utilizing generative AI models (GANs, Diffusion Models, Transformer-based models, etc.). It explores what role AI can play in traditional art creation processes and how collaboration with AI can expand the scope of artistic expression.\n\nThe core of the research goes beyond AI as a technical tool to experiment with the possibilities of AI as a creative partner. Through this, we propose new workflows for artist-AI collaboration and analyze the aesthetic value of artistic outcomes produced by such collaboration.',
    },
    year: 2024,
    keywords: {
      ko: '생성형 AI, 디지털 미디어 아트, 인간-AI 협업, 창작 방법론',
      en: 'Generative AI, Digital Media Art, Human-AI Collaboration, Creative Methodology',
    },
    featured: true,
    published: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-06-20',
    category: 'ai-art',
  },
  {
    id: 'res-2',
    title: {
      ko: '문화콘텐츠와 AI 내러티브 생성 연구',
      en: 'Cultural Content and AI Narrative Generation Research',
    },
    theme: {
      ko: '문화콘텐츠와 기술',
      en: 'Cultural Content and Technology',
    },
    summary: {
      ko: 'AI 기술을 활용한 문화콘텐츠 내러티브 자동 생성 및 스토리텔링 시스템을 연구합니다. 한국 문화 요소를 반영한 AI 기반 스토리 생성의 가능성을 탐구합니다.',
      en: 'Researching AI-based automatic narrative generation and storytelling systems for cultural content. Exploring the potential of AI-based story generation reflecting Korean cultural elements.',
    },
    description: {
      ko: '대규모 언어 모델과 문화 데이터를 결합하여 한국적 서사 구조와 문화 요소를 반영한 스토리텔링 시스템을 개발합니다. 만화, 애니메이션, 게임 등 다양한 문화콘텐츠 장르에 적용 가능한 AI 내러티브 생성 프레임워크를 제안합니다.',
      en: 'Developing storytelling systems that reflect Korean narrative structures and cultural elements by combining large language models with cultural data. Proposing an AI narrative generation framework applicable to various cultural content genres such as comics, animation, and games.',
    },
    year: 2023,
    keywords: {
      ko: 'AI 내러티브, 문화콘텐츠, 스토리텔링, 대규모 언어 모델',
      en: 'AI Narrative, Cultural Content, Storytelling, Large Language Models',
    },
    featured: true,
    published: true,
    createdAt: '2023-03-10',
    updatedAt: '2024-02-15',
    category: 'cultural-content',
  },
  {
    id: 'res-3',
    title: {
      ko: '융합 예술 교육과 디지털 리터러시',
      en: 'Convergence Art Education and Digital Literacy',
    },
    theme: {
      ko: '교육과 기술 융합',
      en: 'Education and Technology Convergence',
    },
    summary: {
      ko: '디지털 시대의 예술 교육 방법론과 디지털 리터러시 함양을 위한 교육 프레임워크를 연구합니다. AI 기술을 교육 현장에 효과적으로 통합하는 방안을 모색합니다.',
      en: 'Researching art education methodologies for the digital age and educational frameworks for cultivating digital literacy. Seeking ways to effectively integrate AI technology into educational settings.',
    },
    description: {
      ko: '기술의 급속한 발전에 따른 예술 교육의 변화 방향을 탐색하고, 학생들이 디지털 도구와 AI 기술을 창의적으로 활용할 수 있는 교육 커리큘럼을 설계합니다. 실습 중심의 프로젝트 기반 학습과 이론적 사고력 배양을 균형 있게 결합한 융합 교육 모델을 제시합니다.',
      en: 'Exploring the direction of change in art education following the rapid development of technology, and designing educational curricula that enable students to creatively utilize digital tools and AI technology. Presenting a convergence education model that balances practice-centered project-based learning with the cultivation of theoretical thinking.',
    },
    year: 2024,
    keywords: {
      ko: '융합 교육, 디지털 리터러시, 프로젝트 기반 학습, AI 교육',
      en: 'Convergence Education, Digital Literacy, Project-Based Learning, AI Education',
    },
    featured: false,
    published: true,
    createdAt: '2024-02-01',
    updatedAt: '2024-05-10',
    category: 'education',
  },
  {
    id: 'res-4',
    title: {
      ko: '인터랙티브 미디어와 관객 참여형 예술',
      en: 'Interactive Media and Participatory Art',
    },
    theme: {
      ko: '인터랙티브 미디어',
      en: 'Interactive Media',
    },
    summary: {
      ko: '관객의 참여와 상호작용을 핵심으로 하는 인터랙티브 미디어 아트의 설계와 구현을 연구합니다. 센서, 데이터, AI를 활용한 몰입형 경험 설계를 탐구합니다.',
      en: 'Researching the design and implementation of interactive media art centered on audience participation and interaction. Exploring immersive experience design utilizing sensors, data, and AI.',
    },
    description: {
      ko: '관객이 수동적 감상자에서 능동적 참여자로 전환되는 인터랙티브 미디어 아트의 설계 원리와 기술적 구현 방법을 연구합니다. 실시간 데이터, 센서 기술, AI 알고리즘을 통합하여 관객의 행동과 반응에 따라 변화하는 동적 예술 작품을 만들어냅니다.',
      en: 'Researching the design principles and technical implementation methods of interactive media art where the audience transitions from passive spectators to active participants. Creating dynamic artworks that change according to audience behavior and reactions by integrating real-time data, sensor technology, and AI algorithms.',
    },
    year: 2023,
    keywords: {
      ko: '인터랙티브 미디어, 참여형 예술, 몰입형 경험, 센서 기술',
      en: 'Interactive Media, Participatory Art, Immersive Experience, Sensor Technology',
    },
    featured: true,
    published: true,
    createdAt: '2023-06-01',
    updatedAt: '2024-01-20',
    category: 'interactive-media',
  },
];
