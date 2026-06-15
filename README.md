# Sprint Mission 04

PandaMarket 정적 HTML/CSS/JS 프로젝트를 Vite, React, Tailwind CSS 기반으로 재구성한 버전입니다.

## 실행

```bash
npm install
npm run dev
```

개발 서버 기본 주소는 `http://127.0.0.1:5173/`입니다. 포트를 지정하려면 아래처럼 실행합니다.

```bash
npm run dev -- --port 8765
```

## 빌드

```bash
npm run build
```

## 구조

- `src/pages`: 홈, 로그인, 회원가입, 상품, 단순 안내 페이지
- `src/components`: Header, Footer, Logo, 폼 공통 컴포넌트, 모달
- `src/utils/auth.js`: 로그인/회원가입 검증 규칙
- `src/services/pandaApi.js`: PandaMarket API 요청 함수
- `public/images`, `public/fonts`: 정적 이미지와 폰트 에셋
