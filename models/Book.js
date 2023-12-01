import {MediaType} from "./Media";

function mapArray(array) {
    const getSuffix = (length, index) => {
        let suffix = '';
        if (index === length - 2) {
            suffix += ' and '
        } else if (index !== length - 1) {
            suffix += ', '
        }
        return suffix;
    }
    if (array?.length > 1) {
        return array.map((str, index) => str + getSuffix(array.length, index)).join('');
    } else if (array?.length > 0) {
        return array[0];
    }
    return '';
}

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
    
    static ConvertFromGoogleBookAPI(book) {
        const volumeInfo = book?.volumeInfo;
        const newBook = new Book(volumeInfo?.title, volumeInfo?.authors, 1, volumeInfo?.pageCount, 3, this.CoverType.Paperback,
            volumeInfo?.imageLinks?.thumbnail, false);
        if (volumeInfo?.industryIdentifiers) {
            newBook.isbn = volumeInfo?.industryIdentifiers;
        }
        return newBook;
    }
    
    constructor(title, authors, pagesRead, pageCount, rating, coverType, imageUrl, favorite) {
        this.type = MediaType.Book;
        this.title = title ?? '';
        this.authors = authors ?? [];
        this.pagesRead = pagesRead ?? 0;
        this.pageCount = pageCount ?? 0;
        this.rating = rating ?? 1;
        this.coverType = coverType ?? Book.CoverType.Paperback;
        this.imageUrl = imageUrl ?? '';
        this.favorite = favorite ?? false;
    }
    
    get completionPercentage() {
        const percentage = this.pagesRead / this.pageCount * 100;
        if (isNaN(percentage)) {
            return 0;
        }
        
        return percentage;
    }
    
    set completionPercentage(value) {
        const newPagesRead = Math.floor((value / 100) * this.pageCount);
        if (isNaN(newPagesRead)) {
            this.pagesRead = 1;
        } else {
            this.pagesRead = Math.max(newPagesRead, 1);
        }
    }
    
    getAuthorsAsString() {
        return mapArray(this.authors ?? []);
    }
    
    clone() {
        return Object.assign(new Book(), this);
    }
}

// make function non-enumerable so it isn't returned by itself
Object.defineProperty(Book.CoverType, 'asArray', { enumerable: false });

// freeze type enum
Object.freeze(Book.CoverType);

export {mapArray}