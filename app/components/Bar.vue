<template>
  <div class="cards">
    <article v-for="(bar, idx) in bars" :key="bar.id" class="card">
      <div class="card_top">
        <span class="card_rank-badge">#{{ idx + 1 }}</span>
        <div class="card_img" :style="{ background: bar.color }">
          <span class="card_emoji">{{ bar.emoji }}</span>
        </div>
      </div>
      <div class="card_body">
        <h3 class="card_name">{{ bar.name }}</h3>
        <p class="card_location">📍 {{ bar.location }}</p>
        <p class="card_sub">{{ bar.desc }}</p>
        <div class="card_score">
          <span class="star" v-for="s in 5" :key="s" :class="{ active: s <= bar.stars }">★</span>
          <span v-if="bar.score" class="card_score-num">{{ bar.score }}</span>
        </div>
        <div class="card_tags">
          <span v-for="t in bar.tags" :key="t" class="chip">{{ t }}</span>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
interface Bar {
  id: number
  name: string
  location: string
  desc: string
  emoji: string
  color: string
  stars: number
  score?: string
  tags: string[]
}

defineProps<{
  bars: Bar[]
}>()
</script>

<style scoped>
/* ─── Cards Grid ────────────────────────── */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

/* ─── Card Base ─────────────────────────── */
.card {
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

/* ─── Card Top ───────────────────────────── */
.card_top {
  position: relative;
}

.card_img {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card_emoji {
  font-size: 48px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.card_rank-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  color: #ff5500;
}

/* ─── Card Body ──────────────────────────── */
.card_body {
  padding: 16px 18px 18px;
}

.card_name {
  font-size: 16px;
  font-weight: 700;
  color: #0d0d0d;
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.card_location {
  font-size: 12px;
  color: #aaa;
  margin-bottom: 8px;
}

.card_sub {
  font-size: 12px;
  color: #888;
  line-height: 1.6;
  margin-bottom: 12px;
}

.card_score {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 10px;
}

.star {
  font-size: 13px;
  color: #e0e0e0;
}

.star.active {
  color: #ffb800;
}

.card_score-num {
  font-size: 12px;
  font-weight: 700;
  color: #0d0d0d;
  margin-left: 6px;
}

.card_tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* ─── Chip ───────────────────────────────── */
.chip {
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 999px;
  background: #fff4f0;
  border: 1px solid #ffe0d6;
  color: #ff5500;
}

/* ─── Responsive ────────────────────────── */
@media (max-width: 1024px) {
  .cards {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

@media (max-width: 768px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .cards {
    grid-template-columns: 1fr;
  }

  .card_name {
    font-size: 15px;
  }
}
</style>