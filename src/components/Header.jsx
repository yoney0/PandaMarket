import Logo from './Logo.jsx';

function Header({ logoMode = 'market', navLinks = [], variant = 'default' }) {
  if (variant === 'market') {
    return (
      <header className="market-header">
        <div className="market-header__inner">
          <nav className="market-header__left" aria-label="주요 메뉴">
            <Logo logoMode={logoMode} />
            {navLinks.map(([href, label]) => (
              <a key={href} className="market-nav-link" href={href}>
                {label}
              </a>
            ))}
          </nav>
          <a className="market-login" href="#/login">로그인</a>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[4.375rem] bg-gray-100">
      <div className="header-content">
        <Logo logoMode={logoMode} />
        <a
          href="#/login"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 font-semibold leading-6 text-gray-100 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-primary/25"
        >
          로그인
        </a>
      </div>
    </header>
  );
}

export default Header;
