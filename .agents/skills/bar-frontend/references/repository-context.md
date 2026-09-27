# 저장소 맥락

## 기술과 명령

- Nuxt 4, Vue 3, TypeScript, Vue Router를 사용한다.
- 패키지 매니저는 현재 lockfile과 `package.json`에 맞춰 `npm`을 사용한다.
- 개발: `npm run dev`
- 프로덕션 빌드: `npm run build`
- 정적 생성: `npm run generate`
- 프로덕션 미리보기: `npm run preview`
- 별도 test, lint, typecheck 스크립트는 현재 없다.

## 주요 경로

- `app/pages`: 파일 기반 화면 라우트
- `app/components`: 공통 또는 반복 UI
- `app/layout`: 현재 header/footer 컴포넌트
- `app/composables`: 화면에서 사용하는 데이터 접근과 재사용 상태
- `app/sheets`: 번들에 포함되는 클라이언트 정적 데이터
- `server/api`: Nuxt/Nitro 내부 API와 외부 제공자 경계
- `server/data`: 서버 전용 로컬 데이터
- `server/sheets/utils/whiskeyProject.ts`: WhiskeyProject JSON의 API 응답 변환

Nuxt 자동 import를 사용할 수 있어도, 대상 파일 주변의 명시적 import 관례를 불필요하게 일괄 변경하지 않는다.

## 현재 데이터 경계

- 칵테일 목록은 `app/sheets/cocktailSheet.ts`를 `useCocktailApi`가 변환해 사용한다.
- 로컬 위스키 목록은 `server/data/*.json`을 서버 유틸과 `/api/whisky/whiskey-project` 경로가 제공한다.
- DeepL과 Whisky Hunter 같은 외부 제공자는 `server/api`에서만 호출한다.
- Whisky Hunter는 사용 권한 확인 전까지 기본 비활성 상태를 유지한다.
