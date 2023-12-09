import spotifyService from "~/server/services/spotify";

export default defineEventHandler(async () => {
  const songs = await spotifyService.getArtistSongs();
  return songs;
});
