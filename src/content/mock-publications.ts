import { Publication } from '@/types/content';

export const mockPublications: Publication[] = [
  {
    id: 'pub-1',
    title: {
      ko: '생성형 AI를 활용한 디지털 미디어 아트 창작 방법론 연구',
      en: 'A Study on Digital Media Art Creation Methodology Using Generative AI',
    },
    abstract: {
      ko: '본 연구는 생성형 AI 기술, 특히 GAN과 Diffusion Model을 활용한 디지털 미디어 아트의 새로운 창작 방법론을 제안한다. 예술가와 AI의 협업 과정에서 발생하는 미학적, 기술적 쟁점을 분석하고, 실험적 작품 제작을 통해 인간-AI 공동 창작의 가능성을 탐구한다.',
      en: 'This study proposes a new creative methodology for digital media art utilizing generative AI technology, particularly GANs and Diffusion Models. It analyzes aesthetic and technical issues arising from the collaboration between artists and AI, and explores the possibilities of human-AI co-creation through experimental artwork production.',
    },
    year: 2024,
    category: 'journal',
    venue: {
      ko: '한국디자인학회 논문집',
      en: 'Journal of Korean Society of Design Science',
    },
    keywords: {
      ko: '생성형 AI, 디지털 미디어 아트, 인간-AI 협업',
      en: 'Generative AI, Digital Media Art, Human-AI Collaboration',
    },
    authors: 'Jongcheon Shin',
    featured: true,
    published: true,
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15',
  },
  {
    id: 'pub-2',
    title: {
      ko: 'AI 기반 문화콘텐츠 내러티브 자동 생성 시스템 설계',
      en: 'Design of AI-Based Automatic Narrative Generation System for Cultural Content',
    },
    abstract: {
      ko: '대규모 언어 모델을 활용하여 한국 문화 요소를 반영한 내러티브 자동 생성 시스템을 설계하고 구현한다. 만화, 애니메이션, 웹툰 등 다양한 문화콘텐츠 장르에 적용 가능한 스토리텔링 프레임워크를 제안하고, 프로토타입 시스템의 성능을 평가한다.',
      en: 'Designing and implementing an automatic narrative generation system reflecting Korean cultural elements using large language models. Proposing a storytelling framework applicable to various cultural content genres such as comics, animation, and webtoons, and evaluating the performance of a prototype system.',
    },
    year: 2024,
    category: 'conference',
    venue: {
      ko: '한국콘텐츠학회 추계학술대회',
      en: 'Korean Society of Content Conference',
    },
    keywords: {
      ko: 'AI 내러티브, 문화콘텐츠, LLM, 스토리텔링',
      en: 'AI Narrative, Cultural Content, LLM, Storytelling',
    },
    authors: 'Jongcheon Shin, Minjae Kim',
    featured: true,
    published: true,
    createdAt: '2024-05-20',
    updatedAt: '2024-05-20',
  },
  {
    id: 'pub-3',
    title: {
      ko: '디지털 시대의 융합 예술 교육 프레임워크',
      en: 'A Framework for Convergence Art Education in the Digital Age',
    },
    abstract: {
      ko: '디지털 기술의 발전에 따른 예술 교육의 변화를 분석하고, AI 기술을 통합한 융합 예술 교육 프레임워크를 제안한다. 프로젝트 기반 학습과 디지털 리터러시 함양을 중심으로 한 교육 모델의 설계와 적용 사례를 논의한다.',
      en: 'Analyzing changes in art education following the development of digital technology and proposing a convergence art education framework integrating AI technology. Discussing the design and application cases of an educational model centered on project-based learning and digital literacy cultivation.',
    },
    year: 2023,
    category: 'journal',
    venue: {
      ko: '예술교육연구',
      en: 'Journal of Art Education Research',
    },
    keywords: {
      ko: '융합 교육, 디지털 리터러시, AI 교육, 프로젝트 기반 학습',
      en: 'Convergence Education, Digital Literacy, AI Education, Project-Based Learning',
    },
    authors: 'Jongcheon Shin',
    featured: false,
    published: true,
    createdAt: '2023-09-10',
    updatedAt: '2023-09-10',
  },
  {
    id: 'pub-4',
    title: {
      ko: '인터랙티브 미디어 아트에서의 관객 경험 설계 연구',
      en: 'A Study on Audience Experience Design in Interactive Media Art',
    },
    abstract: {
      ko: '인터랙티브 미디어 아트에서 관객의 참여와 경험을 중심으로 한 설계 방법론을 연구한다. 센서 기술과 AI 알고리즘을 활용한 반응형 작품의 설계 원리와 관객 경험 평가 기준을 제시한다.',
      en: 'Researching design methodologies centered on audience participation and experience in interactive media art. Presenting design principles for responsive works utilizing sensor technology and AI algorithms, along with audience experience evaluation criteria.',
    },
    year: 2023,
    category: 'conference',
    venue: {
      ko: '한국HCI학회 학술대회',
      en: 'HCI Korea Conference',
    },
    keywords: {
      ko: '인터랙티브 미디어, 관객 경험, UX 디자인, 센서 기술',
      en: 'Interactive Media, Audience Experience, UX Design, Sensor Technology',
    },
    authors: 'Jongcheon Shin, Suyeon Park',
    featured: false,
    published: true,
    createdAt: '2023-02-15',
    updatedAt: '2023-02-15',
  },
  {
    id: 'pub-5',
    title: {
      ko: '만화·애니메이션 콘텐츠의 AI 활용 제작 파이프라인 연구',
      en: 'Research on AI-Utilized Production Pipeline for Comics and Animation Content',
    },
    abstract: {
      ko: '만화와 애니메이션 콘텐츠 제작 과정에서 AI 기술을 효과적으로 활용하는 제작 파이프라인을 연구한다. 캐릭터 디자인, 배경 생성, 컬러링, 인비트윈 등 핵심 제작 단계에서의 AI 도구 활용 방안과 워크플로우 최적화를 제안한다.',
      en: 'Researching production pipelines that effectively utilize AI technology in comics and animation content production. Proposing AI tool utilization methods and workflow optimization for key production stages including character design, background generation, coloring, and inbetweening.',
    },
    year: 2024,
    category: 'journal',
    venue: {
      ko: '만화애니메이션연구',
      en: 'Journal of Cartoon & Animation Studies',
    },
    keywords: {
      ko: 'AI 제작 파이프라인, 만화, 애니메이션, 자동화',
      en: 'AI Production Pipeline, Comics, Animation, Automation',
    },
    authors: 'Jongcheon Shin, Hyunwoo Lee',
    featured: true,
    published: true,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
  {
    id: 'pub-6',
    title: {
      ko: '디지털 문화유산의 AI 기반 복원과 재해석',
      en: 'AI-Based Restoration and Reinterpretation of Digital Cultural Heritage',
    },
    abstract: {
      ko: 'AI 기술을 활용한 문화유산의 디지털 복원과 현대적 재해석 방법론을 제안한다. 전통 예술 작품의 스타일 분석, 결손 부분 복원, 현대적 변환을 위한 딥러닝 모델의 설계와 적용을 논의한다.',
      en: 'Proposing methodologies for digital restoration and modern reinterpretation of cultural heritage using AI technology. Discussing the design and application of deep learning models for style analysis, damage restoration, and modern transformation of traditional artworks.',
    },
    year: 2022,
    category: 'book',
    venue: {
      ko: '디지털 문화와 기술 (공저)',
      en: 'Digital Culture and Technology (Co-authored)',
    },
    keywords: {
      ko: '문화유산, AI 복원, 딥러닝, 디지털 문화',
      en: 'Cultural Heritage, AI Restoration, Deep Learning, Digital Culture',
    },
    authors: 'Jongcheon Shin, Youngho Cho, Minji Kang',
    featured: false,
    published: true,
    createdAt: '2022-11-01',
    updatedAt: '2022-11-01',
  },
];
