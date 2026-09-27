<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <span class="footer__logo">🍸 Fine Drinks</span>
        <p class="footer__tagline">세계 최고의 바와 칵테일을 한곳에서</p>
      </div>
      <div class="footer__links">
        <div class="footer__group">
          <p class="footer__group-title">서비스</p>
          <NuxtLink to="/cocktailRecipes" class="footer__link">칵테일 레시피</NuxtLink>
          <NuxtLink to="/worldBestBars" class="footer__link">월드 베스트 바</NuxtLink>
          <NuxtLink to="/asiaBestBars" class="footer__link">아시아 베스트 바</NuxtLink>
        </div>
        <div class="footer__group">
          <p class="footer__group-title">회사</p>
          <a href="#" class="footer__link">소개</a>
          <a href="#" class="footer__link">문의하기</a>
        </div>
      </div>
    </div>
    <div class="footer__bottom">
      <p>© 2025 Fine Drinks. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
/* ─── Footer ────────────────────────────── */
.footer {
  background: #fafafa;
  border-top: 1px solid #f0f0f0;
}

.footer__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px 40px;
  display: flex;
  justify-content: space-between;
  gap: 48px;
}

.footer__brand {
  flex-shrink: 0;
}

.footer__logo {
  font-size: 18px;
  font-weight: 800;
  color: #0d0d0d;
  display: block;
  margin-bottom: 10px;
}

.footer__tagline {
  font-size: 13px;
  color: #aaa;
  line-height: 1.6;
}

.footer__links {
  display: flex;
  gap: 60px;
}

.footer__group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer__group-title {
  font-size: 13px;
  font-weight: 700;
  color: #0d0d0d;
}

.footer__link {
  font-size: 13px;
  color: #aaa;
  text-decoration: none;
  transition: color 0.15s;
}

.footer__link:hover {
  color: #ff5500;
}

.footer__bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px;
  border-top: 1px solid #efefef;
  font-size: 12px;
  color: #ccc;
}

@media (max-width: 900px) {
  .footer__inner {
    flex-direction: column;
    gap: 32px;
  }
  .footer__links {
    gap: 32px;
  }
}
</style>