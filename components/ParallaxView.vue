<template>
  <div
    class="parallax-view"
    @click="didClick()"
    @mousedown="clicking = true"
    @mouseleave="clearTransform()"
    @mousemove="($event) => mousemove($event)"
  >
    <div class="parallax-container" :style="containerStyle">
      <div v-if="gradientStyle" class="layer" :style="gradientStyle" />
      <div v-if="backgroundStyle" class="layer" :style="backgroundStyle" />
      <div v-if="foregroundStyle" class="layer" :style="foregroundStyle" />
      <div class="layer reflex" :style="reflexStyle" />
    </div>

    <slot></slot>

    <div
      v-if="!!$slots['3d']"
      class="parallax-follower"
      :style="containerStyle"
    >
      <slot name="3d"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  width: {
    tyoe: Number,
    default: 100,
  },
  height: {
    tyoe: Number,
    default: 100,
  },
  popScale: {
    type: Number,
    default: 0.0,
  },
  safeArea: {
    type: Number,
    default: 15,
  },
  bumpArea: {
    type: Number,
    default: 6,
  },
  color: {
    type: String,
    default: null,
  },
  background: {
    type: String,
    default: null,
  },
  foreground: {
    type: String,
    required: true,
  },
  gradientStyle: {
    type: Object,
  },
  maxAngle: {
    type: Number,
    default: 6,
  },
});

const emits = defineEmits<{
  (event: "click"): void;
}>();

const active = ref(false);
const clicking = ref(false);
const cursorX = ref(0);
const cursorY = ref(0);
const lastCursorX = ref(0);
const lastCursorY = ref(0);

const viewStyle = computed(() => {});
const isSvg = computed(() => props.background?.includes("svg"));
const containerStyle = computed(() => {
  let transform = "perspective(500px)";

  if (active.value) {
    if (props.popScale) transform += ` scale(${props.popScale})`;

    if (clicking.value) {
      const extraScale = props.bumpArea / props.width + 1;
      transform += ` scale(${extraScale})`;
    }

    transform += ` rotateX(${cursorY.value * props.maxAngle}deg) rotateY(${
      -cursorX * props.maxAngle
    }deg)`;
  }

  return {
    width: props.width + "px",
    height: props.height + "px",
    transform,
  };
});
const backgroundStyle = computed(() => {
  let scale = 1.0 + props.safeArea / Math.min(props.width, props.height);
  if (clicking.value) {
    scale /= props.bumpArea / props.width / 2 + 1;
  }
  const size = isSvg.value ? "20%" : "cover";
  const repeat = isSvg.value ? "repeat" : "no-repeat";

  return {
    "background-size": size,
    "background-repeat": repeat,
    "background-image": `url("${props.background}")`,
    transform: `scale(${scale}) translate(${
      (cursorX.value * props.safeArea) / 3
    }px, ${(cursorY.value * props.safeArea) / 3}px)`,
  };
});
const foregroundStyle = computed(() => {
  const scale = 1.0 + props.safeArea / Math.min(props.width, props.height);

  return {
    "background-size": "contain",
    "background-image": `url("${props.foreground}")`,
    transform: `scale(${scale}) translate(${
      (-cursorX.value * props.safeArea) / 2.4
    }px, ${(-cursorY.value * props.safeArea) / 2.4}px)`,
  };
});
const reflexStyle = computed(() => {
  const x = ((lastCursorX.value * 1.4 + 1) / 2) * 100;
  const y = ((lastCursorY.value * 1.4 + 1) / 2) * 100;

  const white = "rgba(255,255,255,0.2)";
  const transparent = "rgba(255,255,255,0.0)";
  const background = `radial-gradient(circle at ${x}% ${y}%, ${white} 0%, ${white} 23%, ${transparent} 100%)`;

  return {
    background,
    opacity: active.value ? "1.0" : "0.0",
  };
});

function clearTransform() {
  active.value = false;
  clicking.value = false;
  cursorX.value = 0.0;
  cursorY.value = 0.0;
}

function mousemove(event: MouseEvent) {
  const target = event.target as HTMLElement;

  const rect = target.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;

  // Normalize offset from 0 ... width to a number from -1.0 to 1.0
  const cursorXCalc = Math.min(
    Math.max(((offsetX - rect.width / 2) / rect.width) * 2, -1.0),
    1.0
  );
  const cursorYCalc = Math.min(
    Math.max(((offsetY - rect.height / 2) / rect.height) * 2, -1.0),
    1.0
  );

  // Set currently active and save cursor position
  active.value = true;
  cursorY.value = lastCursorY.value = cursorYCalc;
  cursorX.value = lastCursorX.value = cursorXCalc;
}

function didClick() {
  clicking.value = true;

  setTimeout(() => {
    clicking.value = false;
    active.value = false;
    emits("click");
  }, 60);
}
</script>

<style scoped>
.parallax-view {
  position: relative;
  display: inline-block;
  flex-grow: 0;
  flex-shrink: 0;
}

.parallax-follower,
.parallax-container {
  transform-origin: 50%;

  will-change: transform, box-shadow;
  transition: transform 0.1s linear, box-shadow 0.2s ease-in-out;
}

.parallax-follower {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  pointer-events: none;
}

.parallax-container {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
}

.parallax-container:hover {
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.15);
}

.layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  /*background-size: contain;*/
  background-position: 50% 50%;
  will-change: transform, opacity;
  transition: transform 0.1s linear, opacity 0.3s ease-in-out;
}
</style>
