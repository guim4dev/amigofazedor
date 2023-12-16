<template>
  <div class="card-container">
    <SongCard
      v-for="song in songsDuplicatedAndScrambled"
      :key="song.uniqueId"
      :song="song"
      @song-click="handleSongClick"
      :is-selected="isSongSelected(song.uniqueId)"
      :matched="isSongAlreadyMatched(song.id)"
      :just-matched="justMatched === song.uniqueId"
    />
  </div>
</template>

<script lang="ts" setup>
const { data: songs } = await useFetch("/api/v1/songs");
export type Song = NonNullable<typeof songs.value>[0];
export type SongWithUniqueId = Song & { uniqueId: Number };

const selectedSongs = ref<{ songId: Number; uniqueId: Number }[]>([]);
const pairsMade = ref<Number[]>([]);
const justMatched = ref<Number | null>(null);

console.log("songs", songs.value);

if (!songs.value) {
  // redirect to http cat 404
  console.log("redirecting to http cat 404");
  navigateTo("https://http.cat/404", { external: true });
}

const songsArray = songs?.value ?? [];
const songsDuplicatedAndScrambled = songsArray
  .concat(songsArray)
  .sort(() => Math.random() - 0.5)
  .map((song, index) => ({
    ...song,
    uniqueId: index,
  }));
const isSongSelected = (songUniqueId: Number) =>
  Boolean(
    selectedSongs.value.find(({ uniqueId }) => uniqueId === songUniqueId)
  );

const addOrRemoveSong = (songId: Number, songUniqueId: Number) => {
  if (selectedSongs.value.find(({ uniqueId }) => uniqueId === songUniqueId)) {
    selectedSongs.value = selectedSongs.value.filter(
      ({ uniqueId }) => uniqueId !== songUniqueId
    );
    return;
  }
  selectedSongs.value.push({ songId, uniqueId: songUniqueId });
};

const isSongAlreadyMatched = (songId: Number) =>
  pairsMade.value.find((currentSongId) => currentSongId === songId);

const handleSongClick = (songId: Number, songUniqueId: Number) => {
  console.log("songId", songId);
  console.log("songUniqueId", songUniqueId);
  const previouslySelectedSong = selectedSongs.value.find(
    ({ uniqueId }) => uniqueId === songUniqueId
  );
  const alreadyMatched = isSongAlreadyMatched(songId);
  if (previouslySelectedSong && !alreadyMatched) {
    // same song and not already matched - remove it
    addOrRemoveSong(songId, songUniqueId);
    return;
  }

  // already selected 2 songs ands its not clicking in a already selected song
  if (selectedSongs.value.length === 2) {
    return;
  }

  // selected 2 songs and its not clicking in a already selected song
  const posibleMatch = selectedSongs.value.find(
    ({ songId: currentSongId, uniqueId }) =>
      currentSongId === songId && uniqueId !== songUniqueId
  );
  if (posibleMatch) {
    // songs matched
    addOrRemoveSong(songId, songUniqueId);
    justMatched.value = posibleMatch.uniqueId;
    setTimeout(() => {
      justMatched.value = null;
    }, 5000);
    selectedSongs.value = [];
    pairsMade.value.push(songId);
    return;
  }

  if (!alreadyMatched) {
    addOrRemoveSong(songId, songUniqueId);
    if (selectedSongs.value.length === 2) {
      const selectedUniqueIds = selectedSongs.value.map(
        ({ uniqueId }) => uniqueId
      );
      setTimeout(() => {
        if (
          selectedSongs.value.length === 2 &&
          selectedUniqueIds.every((uniqueId) => isSongSelected(uniqueId))
        ) {
          selectedSongs.value = [];
        }
      }, 10000);
    }
    // not already matched
    return;
  }
};
</script>

<style scoped>
.card-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(100px, 1fr));
  gap: 1rem;
  place-items: center;
  padding: 2rem;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

@media (min-width: 768px) {
  .card-container {
    grid-template-columns: repeat(4, minmax(100px, 1fr));
  }
}
</style>
