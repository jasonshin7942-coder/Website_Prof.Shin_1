'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { href: '/admin', label: '대시보드', icon: '◈' },
  { href: '/admin/profile', label: '프로필 관리', icon: '◇' },
  { href: '/admin/research', label: '연구 관리', icon: '◇' },
  { href: '/admin/publications', label: '저서·논문 관리', icon: '◇' },
  { href: '/admin/teaching', label: '교육 관리', icon: '◇' },
  { href: '/admin/activities', label: '활동 관리', icon: '◇' },
  { href: '/admin/messages', label: '메시지함', icon: '✉' },
  { href: '/admin/media', label: '미디어 라이브러리', icon: '◇' },
  { href: '/admin/chatbot', label: '챗봇 소스 관리', icon: '◇' },
  { href: '/admin/settings', label: '설정', icon: '◇' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  return (
    <aside className="admin-sidebar w-64 min-h-screen flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <p className="font-mono text-[9px] text-white/30 mb-1">ADMIN SYSTEM</p>
        <p className="font-semibold text-sm text-white">신종천 교수 · 웹사이트</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-2.5 text-[13px] ${
                isActive
                  ? 'active text-white font-medium'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="text-xs">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Link href="/ko" className="block text-[12px] text-white/40 hover:text-white/70 mb-2 px-2">
          ← 사이트 보기
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left text-[12px] text-white/40 hover:text-white/70 px-2"
        >
          로그아웃
        </button>
      </div>
    </aside>
  );
}
