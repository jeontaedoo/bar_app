---
trigger: always_on
---

# Bar App 기본 규칙

1. 작업을 시작할 때 루트 `AGENTS.md`의 Context Routing으로 필요한 스킬과 문서만 선택한다.
2. 프런트엔드 화면·컴포넌트·composable 작업에는 `.agents/skills/bar-frontend/SKILL.md`를 적용한다.
3. 외부 제공자 연동에는 `bar-provider-api`, 로컬 위스키 데이터 변경에는 `bar-whisky-catalog`, 로컬 칵테일 레시피 변경에는 `bar-cocktail-catalog` 스킬을 함께 적용한다.
4. 프로젝트 명령은 `package.json`을 기준으로 `npm`을 사용한다. 존재하지 않는 lint·test 명령을 실행했다고 보고하지 않는다.
5. 비밀값과 외부 HTTP 요청은 서버에만 두고, 클라이언트는 앱 내부 `/api`만 호출한다.
6. 요청과 무관한 작업 트리 변경은 보존한다.
