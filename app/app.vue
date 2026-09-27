<template>
  <div class="app">
    <Header />
    <NuxtPage />
    <Footer />
  </div>
</template>
<script setup lang="ts">
import Header from './layout/header.vue';
import Footer from './layout/footer.vue';

</script>
<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css');

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont,
    system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo',
    'Noto Sans KR', 'Malgun Gothic', sans-serif;
  background: #ffffff;
  color: #0d0d0d;
  min-height: 100vh;
  line-height: 1.5;
}

.app {
  min-height: 100vh;
}
</style>
