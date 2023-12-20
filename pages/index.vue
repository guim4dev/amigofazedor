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
  <transition name="fade">
    <div v-if="won" class="won">
      <NuxtImg src="/images/ivanCantas.jpg" class="the-man" />
      <h2>{{ randomCoolPhrase }}</h2>
      <div
        style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        "
      >
        <button @click="reset" class="play-again">Jogue novamente 🎮</button>
        <span style="font-size: 1.5rem; font-weight: bold">ou</span>
        <NuxtLink
          href="https://open.spotify.com/artist/4E37X56JiC33i2FWVXYzpk?si=rkhcbyboQYCNs8fX_zQA9w"
          external
          target="_blank"
          style="display: flex; align-items: center; gap: 1rem; cursor: pointer"
          ><NuxtImg src="/images/spotify.png" width="50" height="50" /><span
            style="font-size: 1.5rem; font-weight: bold"
            >Acompanhe no Spotify</span
          ></NuxtLink
        >
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
const { data: songs } = await useFetch("/api/v1/songs");
export type Song = NonNullable<typeof songs.value>[0];
export type SongWithUniqueId = Song & { uniqueId: Number };
import party from "party-js";

const selectedSongs = ref<{ songId: Number; uniqueId: Number }[]>([]);
const pairsMade = ref<Number[]>([]);
const justMatched = ref<Number | null>(null);

console.log("songs", songs.value);

const reset = () => {
  // TODO: reset normally
  window.location.reload();
};

const coolPhrases = [
  "Você é praticamente um mestre jedi da música de Ivan Seidel!",
  "🧑‍🎓 Você treinou antes? Ivan Seidel ficaria orgulhoso!",
  "♻️ Você é o Ivan Seidel da música de Ivan Seidel!",
  "🤔 Você é o Ivan Seidel ?",
  "👂 Você só ouve Ivan Seidel?",
  "🎹 Beethoven, Mozart, Ivan Seidel, qual a diferença?",
];

const randomCoolPhrase =
  coolPhrases[Math.floor(Math.random() * coolPhrases.length)];

if (!songs.value) {
  // redirect to http cat 404
  console.log("redirecting to http cat 404");
  navigateTo("https://http.cat/404", { external: true });
}

const songsArray = songs?.value ?? [];
const won = computed(
  () =>
    pairsMade.value.length === songsArray.length && pairsMade.value.length > 0
);
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

function doConfetti() {
  party.confetti(party.Rect.fromScreen(), {
    count: 400,
    spread: 20,
    size: party.random.randomRange(0.6, 1.5),
  });
}

const handleSongClick = (songId: Number, songUniqueId: Number) => {
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
    if (pairsMade.value.length === songsArray.length) {
      doConfetti();
    }
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
.play-again {
  background-color: var(--color-ivan-purple);
  color: var(--color-text-primary);
  border: none;
  border-radius: 0.5rem;
  padding: 1rem;
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0rem 0.5rem 1rem rgba(0, 0, 0, 0.8);
}

.play-again:hover {
  background-color: var(--color-ivan-purple-dark);
}

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

.won {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  width: 100dvw;
  height: 100%;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.7);
}

.the-man {
  border-radius: 50%;
  width: 200px;
  aspect-ratio: 1;
  border: 5px solid var(--color-ivan-purple);
}

@media (min-width: 768px) {
  .card-container {
    grid-template-columns: repeat(4, minmax(100px, 1fr));
  }
}
</style>
