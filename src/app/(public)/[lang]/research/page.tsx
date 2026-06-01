import { getDictionary } from '@/i18n/dictionaries';
import { getResearchList, getSettings } from '@/content';
import { getLocalizedText } from '@/types/content';
import type { Locale } from '@/i18n/config';
import SectionHeader from '@/components/public/SectionHeader';
import AsciiDecoration from '@/components/public/AsciiDecoration';

export const dynamic = 'force-dynamic';

export default async function ResearchPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const allResearch = await getResearchList({ published: true });
  const featured = allResearch.filter(r => r.featured);
  const settings = await getSettings();

  const savedTopics = settings?.researchKeyTopics
    ?.map(t => getLocalizedText(t.title, locale))
    .filter(t => t.trim()) || [];
  const themes = savedTopics.length > 0
    ? savedTopics
    : [...new Set(allResearch.map(r => getLocalizedText(r.theme, locale)))];

  return (
    <>
      {/* Hero */}
      <section className="ascii-bg scanline-overlay crt-lines relative py-24 border-b border-border">
        <AsciiDecoration />
        <div className="container-wide">
          <p className="mono-xs text-muted-foreground mb-4">// RESEARCH</p>
          <h1 className="heading-xl mb-6">{dict.research.title}</h1>
          <p className="body-lg text-muted-foreground max-w-2xl">
            {locale === 'ko'
              ? '인공지능, 예술, 문화의 교차점에서 기술과 인문학의 창조적 융합을 연구합니다.'
              : locale === 'zh'
              ? '在人工智能、艺术与文化的交汇处，研究技术与人文学的创造性融合。'
              : 'Exploring the creative convergence of technology and humanities at the intersection of AI, art, and culture.'}
          </p>
        </div>
      </section>

      {/* Key Themes */}
      <section className="py-20 border-b border-border">
        <div className="container-wide">
          <SectionHeader
            label={`// ${dict.research.keyThemes.toUpperCase()}`}
            title={dict.research.keyThemes}
          />
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${themes.length <= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4`}>
            {themes.map((theme, i) => (
              <div key={i} className="card text-center py-8">
                <span className="font-mono text-3xl text-muted-foreground/20 block mb-3">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="font-semibold text-sm">{theme}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 border-b border-border">
        <div className="container-wide">
          <SectionHeader
            label={`// ${dict.research.featuredProjects.toUpperCase()}`}
            title={dict.research.featuredProjects}
          />
          <div className="space-y-8">
            {featured.map((item, i) => (
              <article key={item.id} className="card card-featured">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-1/3">
                    <span className="mono-xs text-muted-foreground">{item.year} · {item.category}</span>
                    <h3 className="heading-sm mt-2">{getLocalizedText(item.title, locale)}</h3>
                  </div>
                  <div className="lg:w-2/3">
                    <p className="body-md text-muted-foreground mb-4">
                      {getLocalizedText(item.summary, locale)}
                    </p>
                    <p className="body-sm text-muted-foreground leading-relaxed">
                      {getLocalizedText(item.description, locale)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {getLocalizedText(item.keywords, locale).split(', ').map((kw) => (
                        <span key={kw} className="mono-xs border border-border px-2 py-1 text-muted-foreground">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* All Research */}
      <section className="py-20 border-b border-border bg-muted/30">
        <div className="container-wide">
          <SectionHeader
            label="// ALL RESEARCH"
            title={dict.research.overview}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allResearch.map((item) => (
              <article key={item.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <span className="mono-xs text-muted-foreground">{item.year}</span>
                  {item.featured && (
                    <span className="mono-xs bg-foreground text-background px-2 py-0.5">
                      FEATURED
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-base mb-2">
                  {getLocalizedText(item.title, locale)}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {getLocalizedText(item.summary, locale)}
                </p>
                <p className="mono-xs text-muted-foreground">
                  {getLocalizedText(item.theme, locale)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Methods */}
      <section className="py-20 border-b border-border">
        <div className="container-wide">
          <SectionHeader
            label="// METHODOLOGY"
            title={dict.research.methods}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: locale === 'ko' ? '실험적 창작 연구' : locale === 'zh' ? '实验性创作研究' : 'Experimental Creative Research',
                desc: locale === 'ko'
                  ? 'AI 도구와 알고리즘을 활용한 실험적 예술 작품 제작을 통해 연구 가설을 검증합니다.'
                  : locale === 'zh'
                  ? '通过利用AI工具和算法制作实验性艺术作品来验证研究假设。'
                  : 'Verifying research hypotheses through experimental artwork production using AI tools and algorithms.',
              },
              {
                title: locale === 'ko' ? '학제간 융합 연구' : locale === 'zh' ? '跨学科融合研究' : 'Interdisciplinary Research',
                desc: locale === 'ko'
                  ? '컴퓨터 과학, 예술학, 문화학, 교육학 등 다양한 분야의 방법론을 통합합니다.'
                  : locale === 'zh'
                  ? '整合计算机科学、艺术学、文化学、教育学等多个领域的方法论。'
                  : 'Integrating methodologies from computer science, art studies, cultural studies, and education.',
              },
              {
                title: locale === 'ko' ? '질적·양적 혼합 연구' : locale === 'zh' ? '质性与量化混合研究' : 'Mixed Methods Research',
                desc: locale === 'ko'
                  ? '작품 분석, 설문 조사, 인터뷰, 데이터 분석 등 질적·양적 방법을 결합합니다.'
                  : locale === 'zh'
                  ? '结合作品分析、问卷调查、访谈、数据分析等质性与量化方法。'
                  : 'Combining qualitative and quantitative methods including work analysis, surveys, interviews, and data analysis.',
              },
            ].map((method, i) => (
              <div key={i} className="card">
                <span className="font-mono text-2xl text-muted-foreground/20 block mb-4">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-semibold text-base mb-2">{method.title}</h3>
                <p className="text-sm text-muted-foreground">{method.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Directions */}
      <section className="py-20 ascii-bg">
        <div className="container-wide">
          <SectionHeader
            label="// FUTURE"
            title={dict.research.futureDirections}
          />
          <div className="max-w-2xl space-y-6">
            {[
              locale === 'ko'
                ? 'AI와 인간의 공동 창작을 위한 새로운 프레임워크 개발'
                : locale === 'zh' ? '开发人工智能与人类共同创作的新框架'
                : 'Development of new frameworks for AI-human co-creation',
              locale === 'ko'
                ? '한국 문화 요소를 반영한 AI 콘텐츠 생성 시스템 연구'
                : locale === 'zh' ? '研究融合韩国文化元素的AI内容生成系统'
                : 'Research on AI content generation systems reflecting Korean cultural elements',
              locale === 'ko'
                ? '메타버스 및 XR 환경에서의 AI 예술 경험 설계'
                : locale === 'zh' ? '设计元宇宙及XR环境中的AI艺术体验'
                : 'Design of AI art experiences in metaverse and XR environments',
              locale === 'ko'
                ? 'AI 윤리와 예술적 자율성에 관한 철학적 탐구'
                : locale === 'zh' ? '关于AI伦理与艺术自主性的哲学探索'
                : 'Philosophical exploration of AI ethics and artistic autonomy',
            ].map((dir, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="mono-xs text-muted-foreground mt-1 shrink-0">→</span>
                <p className="body-md">{dir}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
