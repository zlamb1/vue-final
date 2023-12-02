import {QueryDocumentSnapshot} from "firebase/firestore";
import type {SnapshotOptions} from 'firebase/firestore';
import {collection, doc, onSnapshot} from "firebase/firestore";
import {Media, MediaType} from "~/models/Media";
import Book from "~/models/Book";
import Movie from "~/models/Movie";
import MediaCollection from "~/models/MediaCollection";

const mediaConverter = {
    toFirestore(collection: Media[]) : Object {
        const list: Object[] = [];
        for (const mediaItem of collection) {
            list.push(mediaItem.media);
        }
        return list;
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions) : Media[]
    {
        const data = snapshot.data(options);
        const list = data.list;
        if (list) {
            const array = [];
            for (const mediaObject of list) {
                let media: any = {type: MediaType.Default};
                switch (mediaObject.type) {
                    case MediaType.Book:
                        media = Object.assign(new Book(), mediaObject);
                        break;
                    case MediaType.Movie:
                        media = Object.assign(new Movie(), mediaObject);
                        break;
                }
                array.push(new Media(media));
            }
            return MediaCollection(array);
        }
        return MediaCollection([]);
    }
}

export default function useMediaList() {
    const mediaCollection = reactive(MediaCollection([]));
    
    const db = useFirestore();
    let unsubscribe = () => {}

    useUser((user) => {
        unsubscribe();
        mediaCollection.length = 0;
        if (user.uid) {
            const docRef = doc(collection(db, 'lists'), user.uid).withConverter(mediaConverter);
            unsubscribe = onSnapshot(docRef, (doc) => {
                const collection = doc.data();
                if (collection) {
                    for (const media of collection) {
                        mediaCollection.push(media);
                    }
                }
            });
        }
    });
    
    return {mediaCollection};
}