---
name: bar-frontend
description: 이 Bar App에서 Nuxt 4/Vue 3 페이지, 컴포넌트, 레이아웃, 클라이언트 composable과 화면 상태를 만들거나 수정하고 프런트엔드 리뷰를 수행할 때 사용한다. 서버 전용 외부 제공자 연동이나 로컬 위스키 JSON만 수정하는 작업에는 각각 전용 스킬을 사용한다.
---

# Bar App 프런트엔드

현재 저장소의 단순한 구조와 주변 코드 관례를 유지하면서 화면과 클라이언트 로직을 구현한다. 존재하지 않는 디자인 시스템이나 테스트 체계를 가정하지 않는다.

## 시작

1. 사용자 요청, `git status --short`, 대상 페이지와 인접 컴포넌트를 확인한다.
2. 경로·역할·실행 명령이 필요하면 [repository-context.md](references/repository-context.md)를 읽는다.
3. Vue 구조, 상태, 접근성, API 호출 또는 스타일을 바꿀 때 [coding-conventions.md](references/coding-conventions.md)에서 관련 절만 적용한다.
4. 새 Vue 파일이면 `.agents/workflows/vuefileaddsettingrules.md`, CSS 클래스 변경이면 `.agents/workflows/cssclassnamingrules.md`를 읽는다.
5. 외부 제공자를 건드리면 `bar-provider-api`, 로컬 위스키 데이터를 건드리면 `bar-whisky-catalog`, 로컬 칵테일 레시피를 건드리면 `bar-cocktail-catalog` 스킬을 함께 적용한다.

## 구현 경계

- 페이지는 라우트 조합과 화면 상태를 담당하고, 반복되는 UI는 `app/components`, 재사용 가능한 클라이언트 요청·변환·상태는 `app/composables`에 둔다.
- 외부 URL, 인증 헤더와 비밀값은 Vue 파일이나 composable에 넣지 않는다. `server/api`가 외부 제공자를 호출하고 클라이언트는 내부 `/api`를 호출한다.
- `app/sheets`의 정적 화면 데이터와 `server/data`의 서버 전용 데이터를 혼합하지 않는다. 서버 데이터를 클라이언트에서 직접 import하지 않는다.
- 기존 응답·타입 계약을 먼저 확인하고, 제공되지 않은 값을 추정해 확정 사실처럼 표시하지 않는다.
- 현재 화면의 시각 언어를 유지한다. 요청 범위를 넘어 전역 스타일이나 관련 없는 페이지를 함께 재설계하지 않는다.

## 화면 품질

- 비동기 화면에는 필요한 loading, error, empty 상태를 구분한다. 실패를 빈 결과처럼 숨기지 않는다.
- 클릭 가능한 비버튼 요소를 새로 만들기보다 의미에 맞는 `button`, 링크, 입력 요소를 사용하고 키보드 포커스와 레이블을 유지한다.
- 목록 렌더링에는 안정적인 key를 사용하고, route param과 API 응답은 사용 전에 유효성을 확인한다.
- 반응형 동작과 긴 텍스트, 이미지 실패 가능성을 변경 범위에 맞게 확인한다.
- 새 의존성이나 전역 추상화는 현재 구현으로 해결하기 어려운 근거가 있을 때만 추가한다.

## 검증과 보고

수정 후 [validation.md](references/validation.md)에 따라 가장 작은 확인부터 수행한다. TypeScript, Vue 또는 서버 코드가 바뀌면 최종적으로 `npm run build`를 실행한다. 성공 보고에는 변경 내용, 실제 실행한 검증, 실행하지 못한 검증과 남은 위험만 포함한다.
