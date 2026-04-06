import { Profile } from '@/types/content';

export const mockProfile: Profile = {
  id: 'prof-shin',
  name: {
    ko: '신종천',
    en: 'Jongcheon Shin',
  },
  title: {
    ko: '교수',
    en: 'Professor',
  },
  affiliation: {
    ko: '상지대학교 문화콘텐츠학과',
    en: 'Department of Cultural Content, Sangji University',
  },
  shortIntro: {
    ko: '인공지능, 예술, 문화의 교차점에서 기술과 인문학의 창조적 융합을 연구합니다. 디지털 미디어 아트, AI 기반 창작, 문화콘텐츠 기획 분야에서 학제적 연구와 교육을 수행하고 있습니다.',
    en: 'Researching the creative convergence of technology and humanities at the intersection of AI, art, and culture. Conducting interdisciplinary research and education in digital media art, AI-based creation, and cultural content planning.',
  },
  biography: {
    ko: '신종천 교수는 상지대학교 문화콘텐츠학과에서 뉴미디어아트, 인공지능 기반 창작, 문화콘텐츠 기획을 연구하고 가르치고 있습니다. 기술과 인문학의 경계를 넘나들며 AI와 예술의 창조적 융합 가능성을 탐구하는 것이 주요 연구 관심사입니다.\n\n예술적 실천과 학술적 연구를 병행하며, 국내외 학술대회와 전시에서 활발히 활동하고 있습니다. 특히 AI 기술을 활용한 새로운 형태의 예술 창작과 교육 방법론 개발에 주력하고 있으며, 학생들이 기술적 역량과 인문학적 사고력을 동시에 갖출 수 있도록 융합 교육 프로그램을 운영하고 있습니다.',
    en: 'Professor Jongcheon Shin researches and teaches digital media art, AI-based creation, and cultural content planning at the Department of Cultural Content, Sangji University. His primary research interest lies in exploring the creative convergence possibilities of AI and art, transcending the boundaries between technology and humanities.\n\nCombining artistic practice with academic research, he is actively engaged in domestic and international academic conferences and exhibitions. He particularly focuses on developing new forms of artistic creation and educational methodologies utilizing AI technology, and operates convergence education programs that enable students to simultaneously develop technical competency and humanistic thinking.',
  },
  keywords: {
    ko: '뉴미디어아트, 인공지능, 한류콘텐츠, 밈현상',
    en: 'Artificial Intelligence, New Media Art, Hallyu Content, Meme Phenomena',
  },
  email: 'shin7942@sangji.ac.kr',
  phone: '+82-33-738-7618',
  office: '상지대학교 다산관 407호',
  website: 'https://prof-shin.ac.kr',
  profileImage: '/images/profile-placeholder.jpg',
  socialLinks: {
    scholar: 'https://scholar.google.com/',
    researchGate: 'https://www.researchgate.net/',
    orcid: 'https://orcid.org/',
  },
};
