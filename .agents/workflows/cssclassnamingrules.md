---
description: CSS 클래스 네이밍 규칙 - 언더스코어(_) 단일 사용
---

# CSS Class Naming Rules

When writing CSS class names in Vue (.vue) files, follow these rules:

## ✅ 기본 규칙

- 단어 구분에는 **하이픈(`-`)** 을 사용한다.
- 블록과 요소 구분에는 **언더스코어(`_`) 1개**만 사용한다.
- 언더스코어를 **2개(`__`) 연속으로 사용하지 않는다.**
- 상태 변형(modifier)에는 기존 클래스에 **단일 하이픈(`-`)** 접미사를 붙인다.

## ✅ 올바른 예시

```css
/* 블록 */
.card {}
.page-header {}
.category-bar {}

/* 블록_요소 (언더스코어 1개) */
.card_img {}
.card_img-wrap {}
.page-header_text {}
.category-bar_inner {}
.gnb_nav-item {}
.hero_card-info {}

/* 상태 변형 (하이픈 1개) */
.card-active {}
.state-loading {}
.state-error {}
.state-empty {}
.category-tab-active {}
.hero_title-accent {}
```

## ❌ 잘못된 예시

```css
/* 언더스코어 2개 사용 금지 */
.card__img {}        /* ❌ */
.page-header__text {}  /* ❌ */
.gnb__nav-item {}    /* ❌ */

/* 하이픈 2개 사용 금지 */
.card--active {}     /* ❌ */
.state--loading {}   /* ❌ */
.category-tab--active {}  /* ❌ */
```

## 적용 대상

- 모든 `.vue` 파일의 `<template>`, `<style>` 블록
- 컴포넌트, 페이지, 레이아웃 파일 모두 해당
