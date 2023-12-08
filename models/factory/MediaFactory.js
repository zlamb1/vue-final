import {Media, MediaType} from "~/models/Media";
import Book from '~/models/Book';
import Movie from '~/models/Movie';

import BookInfo from "~/components/info/BookInfo.vue";
import BookView from "~/components/view/BookView.vue";
import MovieInfo from "~/components/info/MovieInfo.vue";
import MovieView from "~/components/view/MovieView.vue";
import BookForm from "~/components/form/BookForm.vue";
import MovieForm from "~/components/form/MovieForm.vue";

export default class MediaFactory {
    static CreateInstance(type) {
        switch (type) {
            case MediaType.Book:
                return new Media(new Book());
            case MediaType.Movie:
                return new Media(new Movie());
            default:
                return new Media(new Book());
        }
    }
    static CreateInfo(type) {
        type = type ?? MediaType.Default;
        const componentMap = {};
        componentMap[MediaType.Book] = BookInfo;
        componentMap[MediaType.Movie] = MovieInfo;
        return componentMap[type];
    }
    static CreateView(type) {
        type = type ?? MediaType.Default;
        const componentMap = {};
        componentMap[MediaType.Book] = BookView;
        componentMap[MediaType.Movie] = MovieView;
        return componentMap[type];
    }
    static CreateForm(type) {
        type = type ?? MediaType.Default;
        const componentMap = {};
        componentMap[MediaType.Book] = BookForm;
        componentMap[MediaType.Movie] = MovieForm;
        return componentMap[type];
    }
    static CreateIcon(type) {
        type = type ?? MediaType.Default;
        const iconMap = {}
        iconMap[MediaType.Book] = 'menu_book';
        iconMap[MediaType.Movie] = 'movie';
        if (!iconMap.hasOwnProperty(type)) {
            return 'question_mark';
        }
        return iconMap[type];
    }
}