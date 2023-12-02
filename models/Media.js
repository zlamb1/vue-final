const MediaType = Object.freeze(Object.defineProperty({
    Book: 'Book',
    Movie: 'Movie',
    Default: 'Book',
}, 'Default', {
    enumerable: false,
}));

class Media {
    constructor(media) {
        this.media = media;
    }
    
    get type() {
        return this.media.type;
    }
    
    set type(val) {}
}

export {Media, MediaType}