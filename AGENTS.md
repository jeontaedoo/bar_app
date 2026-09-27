# Bar App 프로젝트 작업 지침

이 문서는 이 저장소에서 작업하는 AI 코딩 에이전트의 진입점이다. 모든 파일은 UTF-8 without BOM으로 유지한다.

## 작업 전 Context Routing

항상 `.agents/rules/bar.md`를 읽고, 아래에서 현재 작업과 일치하는 문서만 추가로 읽는다. 여러 유형에 해당하면 규칙을 합쳐 적용한다.

| 작업 유형 | 추가로 읽을 문서 |
| --- | --- |
| Vue 페이지·컴포넌트·클라이언트 상태·composable | `.agents/skills/bar-frontend/SKILL.md` |
| 새 Vue 파일 또는 SFC 구조 변경 | `.agents/workflows/vuefileaddsettingrules.md` |
| template 또는 scoped style의 클래스 추가·변경 | `.agents/workflows/cssclassnamingrules.md` |
| 외부 주류·칵테일·위스키·번역 제공자 연동/진단 | `.agents/skills/bar-provider-api/SKILL.md` |
| 로컬 위스키·태그·카테고리·검색 별칭 추가·수정·분류 | `.agents/skills/bar-whisky-catalog/SKILL.md`; 서버 JSON이면 `server/data/README.md`도 확인 |
| 로컬 칵테일 레시피 추가·수정·가져오기 | `.agents/skills/bar-cocktail-catalog/SKILL.md` |

문서의 예시와 실제 코드가 다르면 요청 대상 주변 코드의 현재 관례를 우선하되, 데이터 권리·비밀값·참조 무결성 규칙은 완화하지 않는다.

## 프로젝트 구조

- 이 프로젝트는 Nuxt 4 / Vue 3 / TypeScript 앱이다. 화면 경로는 `app/pages`, 공통 UI는 `app/components`, 클라이언트 요청 함수는 `app/composables`, 서버 API는 `server/api`에 둔다.
- 로컬 위스키 목록 데이터는 `server/data/whiskies.json`과 `server/data/tags.json`에 있다. 서버 API 응답으로 변환하는 코드는 `server/sheets/utils/whiskeyProject.ts`에 있다. `app/sheets`는 화면에서 사용하는 정적 시트용이며 서버 전용 데이터를 직접 가져오지 않는다.
- `.agents/workflows`에는 Vue SFC 구조와 CSS 클래스 이름 규칙이 있다. 주변 컴포넌트의 관례를 따르고, 클래스 이름에 언더스코어 두 개(`__`)를 연속해서 쓰지 않는다.
- 일반 프런트엔드 구현 절차와 책임 경계는 `.agents/skills/bar-frontend/SKILL.md`를 따른다. 자세한 저장소 맥락과 코딩 규칙은 해당 스킬이 연결한 reference에서 필요한 것만 읽는다.

## 데이터와 외부 제공자

- 외부 HTTP 요청과 인증 정보는 서버에서만 다룬다. 페이지와 composable은 외부 제공자 주소를 직접 호출하지 말고 앱 내부의 `/api` 경로를 호출한다.
- 로컬 위스키 데이터 구조를 유지한다. `pk`는 각 파일 안에서 위스키 또는 태그를 식별하며, `whiskies[].tags`는 태그의 `pk`, `comparable`은 위스키의 `pk`를 참조한다. 데이터를 수정할 때 이 참조가 유효한지 확인한다.
- 로컬 WhiskeyProject 데이터는 테스트용이다. 데이터와 외부 병 이미지 URL을 공개 배포에 사용할 권한이 확보된 것으로 간주하지 말고, 배포 전에 사용 권한을 확인한다.
- `region`만 보고 싱글몰트, 싱글그레인 등의 세부 종류를 추정하지 않는다. 확인되지 않은 세부 종류는 미분류로 둔다.
- 사용자가 요청하지 않는 한 제거된 `price`, `created_at`, 태그 빈도 `count`, 저장된 태그 검색 기록을 다시 추가하지 않는다.
- Whisky Hunter 연동은 기본적으로 비활성화되어 있다. 앱에서 데이터를 사용할 권한이 확인될 때까지 활성화하지 않는다.

## 변경과 검증

- 요청과 무관한 작업 트리 변경 사항은 보존한다. 요청을 충족하는 데 필요한 범위만 수정한다.
- Vue 파일을 새로 만들 때는 `<template>`, `<script setup lang="ts">`, 필요한 경우 범위가 지정된 스타일을 사용한다.
- TypeScript, Vue 또는 서버 코드를 수정한 뒤에는 `npm run build`를 실행한다. 목록 데이터를 수정했다면 ID, 참조 관계, 제거된 키도 확인한다. 가능하면 영향을 받은 API 경로를 직접 호출해 확인한다.
- 현재 `package.json`에는 별도의 테스트·린트 스크립트가 없다. 스크립트를 추가하고 실행하지 않았다면 해당 검사를 통과했다고 말하지 않는다.

## Source of Truth

- 에이전트 시작 규칙: `.agents/rules/bar.md`
- 프런트엔드 작업: `.agents/skills/bar-frontend/SKILL.md`
- 외부 제공자: `.agents/skills/bar-provider-api/SKILL.md`
- 로컬 위스키 카탈로그: `.agents/skills/bar-whisky-catalog/SKILL.md`
- 로컬 칵테일 카탈로그: `.agents/skills/bar-cocktail-catalog/SKILL.md`
- 데이터 출처·변환 내역: `server/data/README.md`
- 실행 가능한 명령과 의존성: `package.json`
