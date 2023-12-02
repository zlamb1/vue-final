import type {SnapshotOptions} from 'firebase/firestore';
import {collection, doc, onSnapshot, QueryDocumentSnapshot} from "firebase/firestore";
import {Media, MediaType} from "~/models/Media";
import Book from "~/models/Book";
import Movie from "~/models/Movie";
import MediaCollection from "~/models/MediaCollection";
import APIEndpoints from "~/models/Endpoints";
import UpdateAction from "~/models/UpdateAction";

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

export default function useMediaCollection() {
    const mediaCollection = reactive(MediaCollection([]));
    
    const db = useFirestore();
    let unsubscribe = () => {}

    mediaCollection.dbAdd = async (media: Media) => {
        const idToken = await useUserToken();
        const response = await useFetch(APIEndpoints.UPDATE_LIST, {
            query: {
                idToken: idToken,
                updateAction: UpdateAction.ADD,
                updateObject: JSON.stringify(media.media),
            }
        });

        return response.data.value;
    };

    mediaCollection.dbRemoveByIndex = async(index: number) => {
        if (index < 0 || index >= mediaCollection.length) {
            return;
        }

        const idToken = await useUserToken();
        const response = await useFetch(APIEndpoints.UPDATE_LIST, {
            query: {
                idToken: idToken,
                updateAction: UpdateAction.REMOVE,
                targetIndex: index,
            },
        });

        return response.data.value;
    }

    mediaCollection.dbRemove = async(media: Media) => {
        const index = mediaCollection.indexOf(media);
        return mediaCollection.dbRemoveByIndex(index);
    }

    useUser((user) => {
        unsubscribe();
        if (user.uid) {
            const docRef = doc(collection(db, 'lists'), user.uid).withConverter(mediaConverter);
            unsubscribe = onSnapshot(docRef, (doc) => {
                mediaCollection.length = 0;
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