const MediaType = {
    Book: 'Book',
    Movie: 'Movie',
};

Object.defineProperty(MediaType, 'Default', {
    value: MediaType.Book,
    enumerable: false,
})

Object.freeze(MediaType);

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