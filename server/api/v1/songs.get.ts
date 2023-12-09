import spotifyService from "~/server/services/spotify";

export default defineEventHandler(async () => {
  const songs = await spotifyService.getArtistSongs();
  const songsWithId = songs.map((song, index) => ({
    ...song,
    id: index + 1,
  }));
  return songsWithId;
});
