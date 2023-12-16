<template>
  <!-- Card -->
  <article
    @click="handleClick"
    :class="{
      'base-card': true,
      'open-card': isSelected || justMatched || matched,
      'matched-card': matched,
      'close-card': !matched && !(isSelected || justMatched),
    }"
  >
    <div class="card-inner">
      <!-- Parte da trás -->
      <div class="card-back">
        <span class="debug" v-if="debug">
          {{ song.id }}#{{ song.uniqueId }}
        </span>
        <figure v-show="!matched" class="card-back-inner">
          <NuxtImg src="/images/disco-de-vinil.png" class="disc" />
        </figure>
      </div>

      <!-- Parte da frente -->
      <div class="card-front">
        <span class="debug" v-if="debug">
          {{ song.id }}#{{ song.uniqueId }}
        </span>
        <audio ref="audio" preload loop controls :hidden="matched">
          <source :src="song.previewUrl" type="audio/mp3" />
        </audio>
        <NuxtImg v-show="matched" :src="song.imageUrl" class="song-image" />
      </div>
    </div>
    <h1
      style="
        display: inline-block;
        height: 1rem;
        font-size: 1rem;
        transition: opacity 0.8s;
      "
      :class="{ hidden: !matched }"
    >
      {{ song.title }}
    </h1>
  </article>
</template>

<script setup lang="ts">
const route = useRoute();
const { debug } = route.query;
const audio = ref<HTMLAudioElement>();

import type { SongWithUniqueId } from "../pages/index.vue";
const props = defineProps<{
  song: SongWithUniqueId;
  isSelected: Boolean;
  matched: Boolean;
  justMatched: Boolean;
}>();
const emits = defineEmits(["songClick"]);

const handleClick = () => {
  if (props.matched) return;
  emits("songClick", props.song.id, props.song.uniqueId);
};

// watchs for changes in isSelected and matched
// if isSelected is true and matched is false, play the song
// if isSelected is false, pause the song

watch(
  [() => props.isSelected, () => props.matched, () => props.justMatched],
  () => {
    if (props.isSelected || props.justMatched) {
      audio.value?.play();
    } else {
      audio.value?.pause();
    }
  }
);

onMounted(() => {
  if (props.isSelected && !props.matched) {
    audio.value?.play();
  }
});
</script>

<style scoped>
.hidden {
  opacity: 0;
}

.song-image {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.debug {
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  font-size: 1rem;
  padding: 1rem;
  z-index: 1000;
}

.base-card {
  background-color: transparent;
  width: 100%;
  aspect-ratio: 1;
  perspective: 1000px;
  box-sizing: border-box;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  box-sizing: border-box;
}

.open-card .card-inner {
  transform: rotateY(180deg);
}

.base-card.matched-card {
  filter: drop-shadow(0 0 0.5rem var(--color-primary-dark));
  animation: float 2s ease-in-out infinite;
}

.card-back {
  background-color: var(--color-primary-dark);
}

.card-back-inner {
  display: flex;
  border-radius: 8px;
  background: transparent;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 0;
  border: 1px solid white;
  box-sizing: border-box;
}

.card-back,
.card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  /* Safari */
  backface-visibility: hidden;
  border-radius: 16px;
  border: 1px solid white;
  padding: 8px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-front {
  color: white;
  transform: rotateY(180deg);
}

.disc {
  height: 4rem;
  aspect-ratio: auto;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(5px);
  }
}
</style>
