import { useEffect, useState } from 'react';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import ScrollTopButton from './components/ScrollTopButton.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import MarketPage from './pages/MarketPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import SimplePage from './pages/SimplePage.jsx';

const normalizeRoute = () => {
  const hashRoute = window.location.hash.replace(/^#/, '');
  return hashRoute || '/';
};

function useHashRoute() {
  const [route, setRoute] = useState(normalizeRoute);

  useEffect(() => {
    const handleRouteChange = () => setRoute(normalizeRoute());

    window.addEventListener('hashchange', handleRouteChange);
    return () => window.removeEventListener('hashchange', handleRouteChange);
  }, []);

  const navigate = (nextRoute) => {
    window.location.hash = nextRoute;
  };

  return [route, navigate];
}

function App() {
  const [route, navigate] = useHashRoute();
  const isLandingRoute = route === '/' || route === '/landing';

  if (route === '/market') {
    return <MarketPage />;
  }

  if (route === '/login') {
    return <LoginPage onNavigate={navigate} />;
  }

  if (route === '/signup') {
    return <SignupPage onNavigate={navigate} />;
  }

  const page = {
    '/': <HomePage onNavigate={navigate} />,
    '/landing': <HomePage onNavigate={navigate} />,
    '/items': <ProductsPage />,
    '/policy': <SimplePage title="Privacy Policy" links={[['/faq', 'FAQ'], ['/', '홈으로 돌아가기']]} />,
    '/faq': <SimplePage title="FAQ" links={[['/policy', 'Privacy Policy'], ['/', '홈으로 돌아가기']]} />,
  }[route] ?? <SimplePage title="페이지를 찾을 수 없습니다" links={[[ '/', '홈으로 돌아가기' ]]} />;

  return (
    <div className="page-shell">
      <Header logoMode={isLandingRoute ? 'scrollTop' : 'market'} />
      <main className="pt-[4.375rem]">{page}</main>
      {!isLandingRoute && <ScrollTopButton />}
      {isLandingRoute && <Footer />}
    </div>
  );
}

export default App;
