---
name: bar-cocktail-catalog
description: 이 Bar App의 `app/sheets/cocktailSheet.ts` 로컬 칵테일 레시피를 추가, 수정, 가져오기 또는 정리할 때 사용한다. 칵테일 UI만 변경하거나 외부 제공자 API를 연동하는 작업에는 사용하지 않는다.
---

# 로컬 칵테일 카탈로그 관리

`app/sheets/cocktailSheet.ts`의 `CocktailSheetData` 계약과 이를 변환하는 `app/composables/useCocktailApi.ts`를 함께 확인한 뒤 데이터를 변경한다.

- `metadata.total_cocktails`는 실제 `cocktails` 배열 길이와 일치시킨다. 출처, 수집 시각과 수집기 버전을 확인 없이 새 값으로 만들지 않는다.
- 각 항목에는 비어 있지 않은 `name`, `category`, `method`, `ingredients`가 있어야 한다. 각 재료는 `name`과 `amount`의 의미를 뒤바꾸지 않는다.
- 이름은 `useCocktailApi.ts`의 slug 변환을 거쳐 ID가 되므로, 정규화 후 충돌하는 이름이 없는지 검사한다.
- `garnish`, `views`, `url`, `video_url`, `image_url`은 선택 필드로 유지한다. 원본에 없는 내용을 추정해서 채우거나 `N/A`를 실제 설명처럼 변환하지 않는다.
- 데이터 구조를 바꾸면 `SheetCocktailItem`, `Cocktail`, `parseSheetCocktail`과 이를 사용하는 페이지를 같은 변경에서 갱신한다.
- 현재 레시피와 이미지·영상 URL은 외부 출처에서 수집된 데이터다. 공개 배포와 재배포 권한이 확보된 것으로 간주하지 말고, 새 출처를 가져오기 전에 이용 조건을 확인한다.
- 단순 데이터 수정에 번역 결과를 저장해 넣지 않는다. 번역은 기존 `useCocktailTranslator`와 내부 번역 API의 책임을 유지한다.

수정 후 배열 길이와 metadata 수, slug 중복, 필수 필드와 외부 URL 형식을 검사한다. `npm run build`를 실행하고 출처 또는 권한을 확인하지 못한 항목을 보고한다.
