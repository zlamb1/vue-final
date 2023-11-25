import {MediaType} from "./Media";

export default class Movie {
    constructor(title, director, releaseDate, runTime, imageUrl) {
        this.type = MediaType.Movie;
        this.title = title;
        this.director = director;
        this.releaseDate = releaseDate;
        this.runTime = runTime;
        this.imageUrl = imageUrl;
    }
    
    get dateFormatOptions() {
        return { month: 'long', day: '2-digit', year: 'numeric' };
    }
    
    clone() {
        return Object.assign(new Movie(), this);
    }
}