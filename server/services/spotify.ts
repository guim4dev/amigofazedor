const { spotify: spotifyConfig } = useRuntimeConfig();

const tokenCache: {
  value?: string;
  expiresAt?: Date;
} = {};

const encodedGetAccessTokenParams = new URLSearchParams();
encodedGetAccessTokenParams.set("grant_type", "client_credentials");
encodedGetAccessTokenParams.set("client_id", spotifyConfig.clientId || "");
encodedGetAccessTokenParams.set(
  "client_secret",
  spotifyConfig.clientSecret || ""
);

interface GetAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface ExternalUrls {
  spotify: string;
}

interface Image {
  height: number;
  url: string;
  width: number;
}

interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

interface Album {
  album_type: string;
  artists: Artist[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  is_playable: boolean;
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

interface ExternalIds {
  isrc: string;
}

interface ExternalUrls {
  spotify: string;
}

interface Track {
  album: Album;
  artists: Artist[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  is_playable: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
}

const getAccessToken = async () => {
  if (
    tokenCache?.value &&
    tokenCache?.expiresAt &&
    tokenCache.expiresAt > new Date()
  ) {
    return tokenCache.value;
  }

  const now = Date.now();
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: encodedGetAccessTokenParams,
  });

  const data = (await response.json()) as GetAccessTokenResponse;
  tokenCache.value = data.access_token;
  tokenCache.expiresAt = new Date(now + data.expires_in * 1000);

  return data.access_token;
};

const getArtistTopTracks = async () => {
  const token = await getAccessToken();
  const response = await fetch(
    `${spotifyConfig.apiUrl}/v1/artists/${spotifyConfig.artistId}/top-tracks?market=BR`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const tracks = (await response.json())["tracks"] as Track[];
  console.log({
    tracks,
  });
  return tracks;
};

const getArtistSongs = async () => {
  const tracks = await getArtistTopTracks();
  const onlyTracksWithPreview = tracks.filter((track) => track.preview_url);
  return onlyTracksWithPreview.map((track) => ({
    title: track.name,
    artist: track.artists[0].name,
    album: track.album.name,
    duration: track.duration_ms,
    previewUrl: track.preview_url,
    imageUrl: track.album.images[0].url,
  }));
};

const spotifyService = {
  getArtistSongs,
};

export default spotifyService;
