import Link from 'next/link';
import { getDashboardStats } from '@/content';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    { label: '연구', total: stats.research, published: stats.publishedResearch, href: '/admin/research' },
    { label: '저서·논문', total: stats.publications, published: stats.publishedPublications, href: '/admin/publications' },
    { label: '교육', total: stats.teaching, published: stats.publishedTeaching, href: '/admin/teaching' },
    { label: '활동', total: stats.activities, published: stats.publishedActivities, href: '/admin/activities' },
  ];

  const quickLinks = [
    { label: '프로필 수정', href: '/admin/profile', desc: '교수 프로필 정보를 수정합니다' },
    { label: '새 연구 추가', href: '/admin/research', desc: '새로운 연구 항목을 등록합니다' },
    { label: '새 논문 추가', href: '/admin/publications', desc: '새로운 저서·논문을 등록합니다' },
    { label: '미디어 관리', href: '/admin/media', desc: '이미지, PDF 등 파일을 관리합니다' },
    { label: '챗봇 소스 관리', href: '/admin/chatbot', desc: 'AI 챗봇 소스 문서를 관리합니다' },
    { label: '사이트 설정', href: '/admin/settings', desc: '사이트 기본 설정을 변경합니다' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="mono-xs text-muted-foreground mb-2">// DASHBOARD</p>
        <h1 className="heading-lg">대시보드</h1>
        <p className="text-muted-foreground text-sm mt-1">사이트 콘텐츠 현황을 한눈에 확인합니다</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {statCards.map((stat) => (
          <Link key={stat.href} href={stat.href} className="card hover:border-foreground group">
            <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
            <p className="text-3xl font-bold mb-1">{stat.total}</p>
            <p className="mono-xs text-muted-foreground">게시 {stat.published}건</p>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mb-12">
        <p className="mono-xs text-muted-foreground mb-4">// 빠른 메뉴</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} className="card hover:border-foreground group">
              <h3 className="font-semibold text-sm mb-1 group-hover:underline underline-offset-4">
                {link.label}
              </h3>
              <p className="text-sm text-muted-foreground">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="card bg-muted/30">
        <p className="mono-xs text-muted-foreground mb-2">// 시스템 정보</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">플랫폼</p>
            <p className="font-medium">Next.js</p>
          </div>
          <div>
            <p className="text-muted-foreground">언어</p>
            <p className="font-medium">한국어 / English</p>
          </div>
          <div>
            <p className="text-muted-foreground">상태</p>
            <p className="font-medium text-success">정상 운영</p>
          </div>
          <div>
            <p className="text-muted-foreground">마지막 업데이트</p>
            <p className="font-medium">2024.12.01</p>
          </div>
        </div>
      </div>
    </div>
  );
}
