import { Teaching } from '@/types/content';

export const mockTeaching: Teaching[] = [
  {
    id: 'teach-1',
    title: {
      ko: '디지털 미디어 아트 실습',
      en: 'Digital Media Art Practice',
    },
    category: 'undergraduate',
    summary: {
      ko: '디지털 도구와 AI 기술을 활용한 미디어 아트 창작 실습. 개념 기획부터 최종 작품 제작까지 전 과정을 경험합니다.',
      en: 'Media art creation practice utilizing digital tools and AI technology. Experience the entire process from concept planning to final artwork production.',
    },
    description: {
      ko: '본 과목은 디지털 미디어 아트의 이론적 배경과 실습을 결합한 창작 중심 교과입니다. 학생들은 Processing, TouchDesigner, AI 생성 도구 등을 활용하여 인터랙티브 설치, 데이터 시각화, 생성 예술 등 다양한 형태의 디지털 아트를 제작합니다.\n\n매주 새로운 기술과 개념을 학습하고, 개인 프로젝트와 팀 프로젝트를 통해 실제 작품을 완성합니다. 학기말에는 전시회를 개최하여 작품을 발표합니다.',
      en: 'This course is a creation-centered curriculum combining theoretical background and practice in digital media art. Students create various forms of digital art including interactive installations, data visualization, and generative art using Processing, TouchDesigner, AI generation tools, and more.\n\nStudents learn new techniques and concepts each week and complete actual works through individual and team projects. An exhibition is held at the end of the semester to present works.',
    },
    semester: '2024 Spring',
    courseType: '전공필수',
    keywords: {
      ko: '디지털 아트, 미디어 아트, 인터랙티브, AI 창작',
      en: 'Digital Art, Media Art, Interactive, AI Creation',
    },
    featured: true,
    published: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-03-01',
  },
  {
    id: 'teach-2',
    title: {
      ko: 'AI와 창의적 콘텐츠 기획',
      en: 'AI and Creative Content Planning',
    },
    category: 'graduate',
    summary: {
      ko: 'AI 기술의 이해를 바탕으로 문화콘텐츠 기획 능력을 배양하는 대학원 과목. 이론과 실무를 병행합니다.',
      en: 'A graduate course that cultivates cultural content planning abilities based on understanding AI technology. Combines theory and practice.',
    },
    description: {
      ko: '대학원 수준의 본 과목은 AI 기술의 기본 원리와 문화콘텐츠 기획 방법론을 결합합니다. 생성형 AI, 추천 시스템, 자연어 처리 등 핵심 AI 기술의 작동 원리를 이해하고, 이를 만화, 애니메이션, 게임, 영상 등 다양한 콘텐츠 기획에 적용하는 방법을 학습합니다.\n\n매 학기 실제 산업 프로젝트 또는 연구 프로젝트를 수행하며, 논문 작성과 발표 능력도 함께 배양합니다.',
      en: 'This graduate-level course combines the basic principles of AI technology with cultural content planning methodologies. Students understand the operational principles of core AI technologies such as generative AI, recommendation systems, and natural language processing, and learn how to apply them to planning various content including comics, animation, games, and video.\n\nEach semester, students conduct actual industry or research projects and cultivate paper writing and presentation skills.',
    },
    semester: '2024 Fall',
    courseType: '전공선택',
    keywords: {
      ko: 'AI, 콘텐츠 기획, 생성형 AI, 문화산업',
      en: 'AI, Content Planning, Generative AI, Cultural Industry',
    },
    featured: true,
    published: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-08-01',
  },
  {
    id: 'teach-3',
    title: {
      ko: '만화·웹툰 스토리텔링',
      en: 'Comics & Webtoon Storytelling',
    },
    category: 'undergraduate',
    summary: {
      ko: '만화와 웹툰의 서사 구조와 스토리텔링 기법을 학습하고, AI 도구를 활용한 새로운 내러티브 실험을 합니다.',
      en: 'Learning narrative structure and storytelling techniques of comics and webtoons, with new narrative experiments using AI tools.',
    },
    description: {
      ko: '만화와 웹툰의 서사 구조, 장르별 스토리텔링 기법, 캐릭터 개발, 세계관 구축 등을 체계적으로 학습합니다. 전통적인 스토리텔링 방법론과 함께 AI 기반 내러티브 생성 도구를 활용한 실험적 창작도 진행합니다.\n\n학생들은 개인 작품을 기획하고 완성하며, 동료 리뷰와 크리틱을 통해 창작 역량을 발전시킵니다.',
      en: 'Systematically learning narrative structure of comics and webtoons, genre-specific storytelling techniques, character development, and world-building. Along with traditional storytelling methodologies, students also engage in experimental creation using AI-based narrative generation tools.\n\nStudents plan and complete individual works, developing creative capabilities through peer reviews and critiques.',
    },
    semester: '2024 Spring',
    courseType: '전공필수',
    keywords: {
      ko: '만화, 웹툰, 스토리텔링, 내러티브, AI',
      en: 'Comics, Webtoon, Storytelling, Narrative, AI',
    },
    featured: false,
    published: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-03-01',
  },
  {
    id: 'teach-4',
    title: {
      ko: '문화콘텐츠와 기술 융합 세미나',
      en: 'Cultural Content and Technology Convergence Seminar',
    },
    category: 'seminar',
    summary: {
      ko: '문화콘텐츠 산업에서의 최신 기술 동향과 사례를 분석하고 토론하는 대학원 세미나.',
      en: 'A graduate seminar analyzing and discussing latest technology trends and cases in the cultural content industry.',
    },
    description: {
      ko: '매주 문화콘텐츠와 기술 융합 관련 최신 논문, 산업 사례, 기술 동향을 발표하고 토론합니다. AI, XR, 블록체인, 메타버스 등 신기술이 문화콘텐츠 산업에 미치는 영향을 다각도로 분석합니다.\n\n초청 강연과 현장 방문도 포함되며, 학기말에는 개인 연구 주제에 대한 논문 발표를 진행합니다.',
      en: 'Weekly presentations and discussions on the latest papers, industry cases, and technology trends related to cultural content and technology convergence. Multi-faceted analysis of the impact of new technologies such as AI, XR, blockchain, and metaverse on the cultural content industry.\n\nIncludes invited lectures and field visits, with paper presentations on individual research topics at the end of the semester.',
    },
    semester: '2024 Fall',
    courseType: '전공선택',
    keywords: {
      ko: '세미나, 기술 융합, 문화콘텐츠, 연구 방법론',
      en: 'Seminar, Technology Convergence, Cultural Content, Research Methodology',
    },
    featured: false,
    published: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-08-01',
  },
];
