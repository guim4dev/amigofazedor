<template>
  <div class="card-wrapper">
    <div
      v-for="(song, index) in songsDuplicatedAndScrambled"
      :key="`${song.id}#${index}`"
    >
      <UCard>
        <p>Tomaa</p>
      </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { data: songs } = await useFetch("/api/v1/songs");
const selectedSongs = ref([]);
const pairsMade = ref([]);

console.log("songs", songs);

if (!songs.value) {
  // redirect to http cat 404
  console.log("redirecting to http cat 404");
  navigateTo("https://http.cat/404", { external: true });
}

const songsArray = songs?.value ?? [];
// const handleSongClick = (songId) => {
//   if (selectedSongs.value.length === pairsMade.value.length * 2 + 2) {
//     return;
//   }

//   const song = songsArray.find((song) => song.id === songId);
//   if (selectedSongs.value.find((song) => song.id === songId)) {
//     return;
//   }

//   selectedSongs.value.push(song);
// };

const songsDuplicatedAndScrambled = songsArray
  .concat(songsArray)
  .sort(() => Math.random() - 0.5);
</script>

<style scoped></style>
