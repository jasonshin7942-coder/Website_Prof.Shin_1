import { getDictionary } from '@/i18n/dictionaries';
import { getTeachingList, getSettings } from '@/content';
import { getLocalizedText } from '@/types/content';
import type { Locale } from '@/i18n/config';
import SectionHeader from '@/components/public/SectionHeader';
import AsciiDecoration from '@/components/public/AsciiDecoration';

export const dynamic = 'force-dynamic';

export default async function TeachingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const allTeaching = await getTeachingList({ published: true });
  const featured = allTeaching.filter(t => t.featured);
  const settings = await getSettings();
  const phil = settings?.teachingPhilosophy;

  return (
    <>
      {/* Hero */}
      <section className="ascii-bg scanline-overlay crt-lines relative py-24 border-b border-border">
        <AsciiDecoration />
        <div className="container-wide">
          <p className="mono-xs text-muted-foreground mb-4">// TEACHING</p>
          <h1 className="heading-xl mb-6">{dict.teaching.title}</h1>
          <p className="body-lg text-muted-foreground max-w-2xl">
            {locale === 'ko'
              ? '기술적 역량과 인문학적 사고력을 동시에 갖춘 창의적 인재를 양성합니다.'
              : locale === 'zh'
              ? '培养同时具备技术能力和人文思维的创造性人才。'
              : 'Nurturing creative talents with both technical competency and humanistic thinking.'}
          </p>
        </div>
      </section>

      {/* Teaching Philosophy */}
      <section className="py-20 border-b border-border">
        <div className="container-wide">
          <SectionHeader
            label="// PHILOSOPHY"
            title={dict.teaching.philosophy}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="body-md text-muted-foreground leading-relaxed whitespace-pre-line">
                {phil ? getLocalizedText(phil.paragraph1, locale) : (locale === 'ko'
                  ? '교육은 단순한 지식 전달이 아닌, 학생들이 스스로 사고하고 창조할 수 있는 역량을 키우는 과정입니다. 기술과 인문학의 경계를 넘나들며, 학생들이 AI 시대에 필요한 융합적 사고력과 창의성을 갖출 수 있도록 안내합니다.'
                  : locale === 'zh'
                  ? '教育不仅仅是知识传授，而是培养学生自主思考和创造能力的过程。跨越技术与人文学的界限，引导学生具备AI时代所需的融合思维和创造力。'
                  : 'Education is not merely knowledge transfer, but a process of cultivating students\' ability to think and create independently. Crossing the boundaries between technology and humanities, we guide students to develop the convergent thinking and creativity needed in the AI era.')}
              </p>
              <p className="body-md text-muted-foreground leading-relaxed whitespace-pre-line">
                {phil ? getLocalizedText(phil.paragraph2, locale) : (locale === 'ko'
                  ? '프로젝트 기반 학습을 통해 이론과 실습을 유기적으로 연결하며, 동료 학습과 멘토링을 통해 협업 능력을 강화합니다.'
                  : locale === 'zh'
                  ? '通过项目式学习，将理论与实践有机结合，并通过同伴学习和指导来强化协作能力。'
                  : 'Through project-based learning, we organically connect theory and practice, while strengthening collaboration skills through peer learning and mentoring.')}
              </p>
            </div>
            <div className="space-y-4">
              {(phil?.principles || [
                { title: { ko: '창의적 사고', en: 'Creative Thinking' }, desc: { ko: '고정관념을 넘어선 새로운 시각', en: 'New perspectives beyond stereotypes' } },
                { title: { ko: '기술적 역량', en: 'Technical Competency' }, desc: { ko: '도구를 다루는 실질적 능력', en: 'Practical ability to handle tools' } },
                { title: { ko: '비판적 분석', en: 'Critical Analysis' }, desc: { ko: '깊이 있는 사고와 평가 능력', en: 'In-depth thinking and evaluation' } },
                { title: { ko: '협업과 소통', en: 'Collaboration' }, desc: { ko: '다양한 배경의 팀원과 함께', en: 'Working with diverse team members' } },
              ]).map((val, i) => (
                <div key={i} className="card flex items-start gap-4">
                  <span className="text-lg mt-0.5">◇</span>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{getLocalizedText(val.title, locale)}</h4>
                    <p className="text-sm text-muted-foreground">{getLocalizedText(val.desc, locale)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 border-b border-border bg-muted/30">
        <div className="container-wide">
          <SectionHeader
            label="// COURSES"
            title={dict.teaching.courses}
          />
          <div className="space-y-6">
            {featured.map((course) => (
              <article key={course.id} className="card card-featured">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-1/3">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="mono-xs border border-border px-2 py-0.5 text-muted-foreground">
                        {course.category}
                      </span>
                      {course.semester && (
                        <span className="mono-xs text-muted-foreground">{course.semester}</span>
                      )}
                    </div>
                    <h3 className="heading-sm">{getLocalizedText(course.title, locale)}</h3>
                    {course.courseType && (
                      <p className="text-sm text-muted-foreground mt-1">{course.courseType}</p>
                    )}
                  </div>
                  <div className="lg:w-2/3">
                    <p className="body-md text-muted-foreground mb-4">
                      {getLocalizedText(course.summary, locale)}
                    </p>
                    <p className="body-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {getLocalizedText(course.description, locale)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* All Courses */}
      <section className="py-20 border-b border-border">
        <div className="container-wide">
          <SectionHeader
            label="// ALL COURSES"
            title={locale === 'ko' ? '전체 강의' : locale === 'zh' ? '全部课程' : 'All Courses'}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allTeaching.map((course) => (
              <article key={course.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <span className="mono-xs border border-border px-2 py-0.5 text-muted-foreground">
                    {course.category}
                  </span>
                  {course.featured && (
                    <span className="mono-xs bg-foreground text-background px-2 py-0.5">
                      FEATURED
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-base mb-2">
                  {getLocalizedText(course.title, locale)}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {getLocalizedText(course.summary, locale)}
                </p>
                <div className="flex items-center gap-3 mono-xs text-muted-foreground">
                  {course.semester && <span>{course.semester}</span>}
                  {course.courseType && <span>· {course.courseType}</span>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AI-Assisted Education */}
      <section className="py-20 ascii-bg">
        <div className="container-wide">
          <SectionHeader
            label="// AI EDUCATION"
            title={dict.teaching.aiEducation}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: locale === 'ko' ? 'AI 기반 창작 도구 활용' : locale === 'zh' ? '利用AI创作工具' : 'AI-Based Creative Tools',
                desc: locale === 'ko'
                  ? '생성형 AI, 이미지 생성, 텍스트 생성 등 최신 AI 도구를 교육 과정에 통합합니다.'
                  : locale === 'zh'
                  ? '将生成式AI、图像生成、文本生成等最新AI工具整合到教育课程中。'
                  : 'Integrating generative AI, image generation, text generation, and other AI tools into the curriculum.',
              },
              {
                title: locale === 'ko' ? '프로젝트 기반 학습' : locale === 'zh' ? '项目式学习' : 'Project-Based Learning',
                desc: locale === 'ko'
                  ? '실제 프로젝트를 통해 이론과 실습을 연결하고, 포트폴리오를 구축합니다.'
                  : locale === 'zh'
                  ? '通过实际项目将理论与实践相连接，并构建作品集。'
                  : 'Connecting theory and practice through real projects and building portfolios.',
              },
              {
                title: locale === 'ko' ? '비판적 AI 리터러시' : locale === 'zh' ? '批判性AI素养' : 'Critical AI Literacy',
                desc: locale === 'ko'
                  ? 'AI의 가능성과 한계를 이해하고, 윤리적 사용에 대해 비판적으로 사고합니다.'
                  : locale === 'zh'
                  ? '理解AI的可能性与局限性，批判性地思考其伦理使用。'
                  : 'Understanding AI\'s possibilities and limitations, and thinking critically about ethical use.',
              },
            ].map((item, i) => (
              <div key={i} className="card">
                <span className="font-mono text-2xl text-muted-foreground/20 block mb-4">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
