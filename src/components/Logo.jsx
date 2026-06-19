import { goToMarketTop, scrollToPageTop } from '../utils/navigation.js';

const sizeClass = {
  header: {
    wrap: 'logo-link logo-link--header',
    image: 'logo-image',
    text: 'logo-text',
  },
  auth: {
    wrap: 'logo-link logo-link--auth',
    image: 'logo-image',
    text: 'logo-text',
  },
};

const LOGO_IMAGE = '/images/panda-logo.png';

function Logo({ variant = 'header', logoMode = 'market' }) {
  const styles = sizeClass[variant];
  const isHeaderLogo = variant === 'header';
  const href = isHeaderLogo && logoMode === 'scrollTop' ? '#top' : isHeaderLogo ? '#/market' : '#/';

  const handleClick = (event) => {
    if (!isHeaderLogo) {
      return;
    }

    event.preventDefault();
    if (logoMode === 'scrollTop') {
      scrollToPageTop();
      return;
    }

    goToMarketTop();
  };

  return (
    <a href={href} className={styles.wrap} onClick={handleClick} aria-label="판다마켓 홈">
      <img className={styles.image} src={LOGO_IMAGE} alt="" />
      <span className={styles.text}>판다마켓</span>
    </a>
  );
}

export default Logo;
