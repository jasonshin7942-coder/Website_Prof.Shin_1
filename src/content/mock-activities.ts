import { Activity } from '@/types/content';

export const mockActivities: Activity[] = [
  {
    id: 'act-1',
    title: {
      ko: 'SIGGRAPH Asia 2024 발표',
      en: 'SIGGRAPH Asia 2024 Presentation',
    },
    type: 'conference',
    date: '2024-12-03',
    location: {
      ko: '도쿄, 일본',
      en: 'Tokyo, Japan',
    },
    summary: {
      ko: 'AI 기반 인터랙티브 미디어 아트에 관한 연구 논문을 SIGGRAPH Asia 2024에서 발표했습니다.',
      en: 'Presented a research paper on AI-based interactive media art at SIGGRAPH Asia 2024.',
    },
    description: {
      ko: 'SIGGRAPH Asia 2024의 Art Papers 세션에서 "AI와 인터랙티브 미디어 아트: 관객 참여형 생성 예술의 새로운 패러다임"이라는 제목의 논문을 발표했습니다. 실시간 AI 생성과 관객 인터랙션을 결합한 실험적 작품의 설계와 구현 과정을 공유했습니다.',
      en: 'Presented a paper titled "AI and Interactive Media Art: A New Paradigm of Participatory Generative Art" at the Art Papers session of SIGGRAPH Asia 2024. Shared the design and implementation process of experimental works combining real-time AI generation with audience interaction.',
    },
    featured: true,
    published: true,
    createdAt: '2024-12-03',
    updatedAt: '2024-12-03',
  },
  {
    id: 'act-2',
    title: {
      ko: '서울 미디어 아트 비엔날레 참여',
      en: 'Seoul Media Art Biennale Participation',
    },
    type: 'exhibition',
    date: '2024-09-15',
    location: {
      ko: '서울시립미술관, 서울',
      en: 'Seoul Museum of Art, Seoul',
    },
    summary: {
      ko: '서울 미디어 아트 비엔날레에 AI 생성 인터랙티브 설치 작품을 출품했습니다.',
      en: 'Exhibited an AI-generated interactive installation at the Seoul Media Art Biennale.',
    },
    description: {
      ko: '"디지털 의식(Digital Consciousness)"이라는 제목의 인터랙티브 설치 작품을 출품했습니다. 관객의 움직임과 음성을 실시간으로 분석하여 AI가 시각적 반응을 생성하는 몰입형 공간을 구성했습니다. 약 3,000명의 관객이 참여했습니다.',
      en: 'Exhibited an interactive installation work titled "Digital Consciousness." Created an immersive space where AI generates visual responses by analyzing audience movement and voice in real-time. Approximately 3,000 visitors participated.',
    },
    featured: true,
    published: true,
    createdAt: '2024-09-15',
    updatedAt: '2024-09-15',
  },
  {
    id: 'act-3',
    title: {
      ko: 'AI와 예술의 미래 초청 강연',
      en: 'Invited Lecture: Future of AI and Art',
    },
    type: 'talk',
    date: '2024-06-20',
    location: {
      ko: '국립현대미술관, 서울',
      en: 'National Museum of Modern and Contemporary Art, Seoul',
    },
    summary: {
      ko: '국립현대미술관에서 AI 기술이 예술 창작에 미치는 영향에 대한 초청 강연을 진행했습니다.',
      en: 'Delivered an invited lecture at MMCA on the impact of AI technology on artistic creation.',
    },
    description: {
      ko: '국립현대미술관의 "기술과 예술" 시리즈 강연에 초청되어 "AI 시대의 예술가: 도구에서 파트너로"라는 주제로 강연했습니다. AI가 예술 창작의 도구를 넘어 협업 파트너로서 어떤 역할을 할 수 있는지를 사례와 함께 논의했습니다.',
      en: 'Invited to the "Technology and Art" lecture series at MMCA, delivered a lecture titled "Artists in the AI Era: From Tool to Partner." Discussed with examples how AI can serve as a collaborative partner beyond being a tool for artistic creation.',
    },
    featured: true,
    published: true,
    createdAt: '2024-06-20',
    updatedAt: '2024-06-20',
  },
  {
    id: 'act-4',
    title: {
      ko: '한일 디지털 아트 교류 워크숍',
      en: 'Korea-Japan Digital Art Exchange Workshop',
    },
    type: 'workshop',
    date: '2024-04-10',
    location: {
      ko: '오사카 예술대학, 오사카',
      en: 'Osaka University of Arts, Osaka',
    },
    summary: {
      ko: '한일 대학 간 디지털 아트 교류 워크숍을 공동 기획하고 진행했습니다.',
      en: 'Co-organized and conducted a digital art exchange workshop between Korean and Japanese universities.',
    },
    description: {
      ko: '조선대학교와 오사카 예술대학 학생들이 참여하는 3일간의 디지털 아트 교류 워크숍을 기획·진행했습니다. 양국 학생들이 팀을 구성하여 AI 도구를 활용한 공동 창작 프로젝트를 수행했으며, 문화적 차이와 공통점을 예술적으로 탐구하는 작품을 완성했습니다.',
      en: 'Organized and conducted a 3-day digital art exchange workshop with students from Chosun University and Osaka University of Arts. Students from both countries formed teams to collaborate on creative projects using AI tools, completing works that artistically explored cultural differences and commonalities.',
    },
    featured: false,
    published: true,
    createdAt: '2024-04-10',
    updatedAt: '2024-04-10',
  },
  {
    id: 'act-5',
    title: {
      ko: '광주 AI 아트 페스티벌 심사위원',
      en: 'Gwangju AI Art Festival Jury Member',
    },
    type: 'collaboration',
    date: '2024-11-01',
    location: {
      ko: '광주 문화예술회관',
      en: 'Gwangju Culture & Art Center',
    },
    summary: {
      ko: '제3회 광주 AI 아트 페스티벌에서 심사위원으로 참여했습니다.',
      en: 'Served as a jury member at the 3rd Gwangju AI Art Festival.',
    },
    description: {
      ko: '광주광역시가 주최하는 제3회 AI 아트 페스티벌에 심사위원으로 참여했습니다. 전국에서 출품된 AI 기반 예술 작품을 평가하고, "AI 예술의 현재와 미래" 주제의 패널 토론에도 참여했습니다.',
      en: 'Participated as a jury member at the 3rd AI Art Festival hosted by Gwangju Metropolitan City. Evaluated AI-based artworks submitted from across the country and participated in a panel discussion on "The Present and Future of AI Art."',
    },
    featured: false,
    published: true,
    createdAt: '2024-11-01',
    updatedAt: '2024-11-01',
  },
  {
    id: 'act-6',
    title: {
      ko: '유럽 디지털 문화 연구 네트워크 참여',
      en: 'European Digital Culture Research Network Participation',
    },
    type: 'exchange',
    date: '2024-07-15',
    location: {
      ko: '베를린, 독일',
      en: 'Berlin, Germany',
    },
    summary: {
      ko: '유럽 디지털 문화 연구 네트워크에 아시아 대표 연구자로 참여했습니다.',
      en: 'Participated as an Asian representative researcher in the European Digital Culture Research Network.',
    },
    description: {
      ko: '유럽연합 지원 디지털 문화 연구 네트워크의 연례 회의에 아시아 지역 대표 연구자로 초청되어 참석했습니다. "동아시아의 AI와 문화콘텐츠" 주제의 기조 발표를 진행하고, 국제 공동 연구 프로젝트의 가능성을 논의했습니다.',
      en: 'Invited as an Asian regional representative researcher to the annual meeting of the EU-funded Digital Culture Research Network. Delivered a keynote presentation on "AI and Cultural Content in East Asia" and discussed possibilities for international collaborative research projects.',
    },
    featured: false,
    published: true,
    createdAt: '2024-07-15',
    updatedAt: '2024-07-15',
  },
];
