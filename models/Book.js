import {MediaType} from "./Media";

export default class Book {
    static CoverType = {
        Paperback: 'Paperback',
        Hardcover: 'Hardcover',
        Kindle: 'Kindle',
        asArray: function() {
            const list = [];
            for (const type in this) {
                list.push(type);
            }
            
            return list;
        },
    };
    constructor(title, author, pagesRead, numberOfPages, rating, coverType, imageUrl, favorite) {
        this.type = MediaType.Book;
        this.title = title;
        this.author = author;
        this.pagesRead = pagesRead;
        this.numberOfPages = numberOfPages;
        this.rating = rating;
        this.coverType = coverType;
        this.imageUrl = imageUrl;
        this.favorite = favorite;
    }
    
    get completionPercentage() {
        const percentage = this.pagesRead / this.numberOfPages * 100;
        if (isNaN(percentage)) {
            return 0;
        }
        
        return percentage;
    }
    
    set completionPercentage(value) {
        let newPagesRead = Math.floor((value / 100) * this.numberOfPages);
        if (isNaN(newPagesRead)) {
            this.pagesRead = 0;
        } else {
            this.pagesRead = newPagesRead;
        }
    }
    
    clone() {
        return Object.assign(new Book(), this);
    }
}

// make function non-enumerable so it isn't returned by itself
Object.defineProperty(Book.CoverType, 'asArray', { enumerable: false });

// freeze type enum
Object.freeze(Book.CoverType);