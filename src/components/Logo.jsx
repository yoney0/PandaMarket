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

function Logo({ variant = 'header' }) {
  const styles = sizeClass[variant];
  const isHeaderLogo = variant === 'header';

  const handleClick = (event) => {
    if (!isHeaderLogo) {
      return;
    }

    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <a href={isHeaderLogo ? '#top' : '#/'} className={styles.wrap} onClick={handleClick} aria-label="판다마켓 홈">
      <img className={styles.image} src="/images/판다 얼굴.png" alt="" />
      <span className={styles.text}>판다마켓</span>
    </a>
  );
}

export default Logo;
