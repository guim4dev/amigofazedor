<template>
  <!-- Card -->
  <article
    @click="handleClick"
    :class="{
      'base-card': true,
      'open-card': (isSelected || justMatched) && !matched,
      'matched-card': matched,
      'close-card': !matched && !(isSelected || justMatched),
    }"
  >
    <div class="card-inner">
      <!-- Parte da trás -->
      <div class="card-back">
        <span class="debug" v-if="debug"
          >{{ song.id }}#{{ song.uniqueId }}</span
        >
        <figure class="card-back-inner">
          <NuxtImg src="/images/disco-de-vinil.png" class="disc" />
        </figure>
      </div>

      <!-- Parte da frente -->
      <div class="card-front">
        <span class="debug" v-if="debug"
          >{{ song.id }}#{{ song.uniqueId }}</span
        >
        <audio ref="audio" preload loop controls>
          <source :src="song.previewUrl" type="audio/mp3" />
        </audio>
      </div>
    </div>
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
  width: 200px;
  aspect-ratio: 1;
  perspective: 1000px; /* Remove this if you don't want the 3D effect */
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
  -webkit-backface-visibility: hidden; /* Safari */
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

/* audio::-webkit-media-controls-mute-button {
  display: none;
} */
</style>
