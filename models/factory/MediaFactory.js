import {Media, MediaType} from "~/models/Media";
import Book from '~/models/Book';
import Movie from '~/models/Movie';
import Song from "~/models/Song";

import BookInfo from "~/components/info/BookInfo.vue";
import BookView from "~/components/view/BookView.vue";
import MovieInfo from "~/components/info/MovieInfo.vue";
import MovieView from "~/components/view/MovieView.vue";
import BookForm from "~/components/form/BookForm.vue";
import MovieForm from "~/components/form/MovieForm.vue";
import SongInfo from "~/components/info/SongInfo.vue";
import SongView from "~/components/view/SongView.vue";
import SongForm from "~/components/form/SongForm.vue";

export default class MediaFactory {
    static CreateInstance(type) {
        return new Media(this.CreateMediaInstance(type));
    }
    static CreateMediaInstance(type) {
        switch (type) {
            case MediaType.Book:
                return new Book();
            case MediaType.Movie:
                return new Movie();
            case MediaType.Song:
                return new Song();
            default:
                return new Book();
        }
    }
    static CreateInfo(type) {
        type = type ?? MediaType.Default;
        const componentMap = {};
        componentMap[MediaType.Book] = BookInfo;
        componentMap[MediaType.Movie] = MovieInfo;
        componentMap[MediaType.Song] = SongInfo;
        return componentMap[type];
    }
    static CreateView(type) {
        type = type ?? MediaType.Default;
        const componentMap = {};
        componentMap[MediaType.Book] = BookView;
        componentMap[MediaType.Movie] = MovieView;
        componentMap[MediaType.Song] = SongView;
        return componentMap[type];
    }
    static CreateForm(type) {
        type = type ?? MediaType.Default;
        const componentMap = {};
        componentMap[MediaType.Book] = BookForm;
        componentMap[MediaType.Movie] = MovieForm;
        componentMap[MediaType.Song] = SongForm;
        return componentMap[type];
    }
    static CreateIcon(type) {
        type = type ?? MediaType.Default;
        const iconMap = {}
        iconMap[MediaType.Book] = 'menu_book';
        iconMap[MediaType.Movie] = 'movie';
        iconMap[MediaType.Song] = 'music_note';
        if (!iconMap.hasOwnProperty(type)) {
            return 'question_mark';
        }
        return iconMap[type];
    }
}