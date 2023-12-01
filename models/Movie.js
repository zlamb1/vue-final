import {MediaType} from "./Media";

export default class Movie {
    constructor(title, directors, releaseDate, runTime, imageUrl, favorite) {
        this.type = MediaType.Movie;
        this.title = title ?? '';
        this.directors = directors ?? [];
        this.releaseDate = releaseDate ?? Date.now();
        this.runTime = runTime ?? '0:00';
        this.imageUrl = imageUrl ?? '';
        this.favorite = favorite ?? false;
    }
    
    get dateFormatOptions() {
        return { month: 'long', day: '2-digit', year: 'numeric' };
    }
    
    clone() {
        return Object.assign(new Movie(), this);
    }
}