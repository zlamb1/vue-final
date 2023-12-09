import {MediaType} from "~/models/Media";

export default class Song {
    static ConvertFromITunesAPI(song) {
        const newSong = new Song(song?.trackName, song?.artistName, song?.collectionName, song?.releaseDate, song?.artworkUrl100, false);
        newSong.trackId = song.trackId;
        return newSong;
    }
    constructor(title, artists, album, releaseDate, imageUrl, favorite) {
        this.type = MediaType.Song;
        this.title = title;
        this.artists = artists;
        this.album = album;
        this.releaseDate = releaseDate;
        this.imageUrl = imageUrl;
        this.favorite = favorite;
    }
}