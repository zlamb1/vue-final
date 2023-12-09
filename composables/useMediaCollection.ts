import type {SnapshotOptions} from 'firebase/firestore';
import {collection, doc, onSnapshot, QueryDocumentSnapshot} from "firebase/firestore";
import {Media, MediaType} from "~/models/Media";
import Book from "~/models/Book";
import Movie from "~/models/Movie";
import Song from "~/models/Song";
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
            for (const key in list) {
                const mediaObject = list[key];
                let media: any = {type: MediaType.Default};
                switch (mediaObject.type) {
                    case MediaType.Book:
                        media = Object.assign(new Book(), mediaObject);
                        break;
                    case MediaType.Movie:
                        media = Object.assign(new Movie(), mediaObject);
                        break;
                    case MediaType.Song:
                        media = Object.assign(new Song(), mediaObject);
                        break;
                }
                array.push(new Media(media));
            }
            return MediaCollection(array);
        }
        return MediaCollection([]);
    }
}

export default function useMediaCollection(uid: computed, onError = (err: Error) => {}) {
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

    mediaCollection.dbUpdate = async (media: Media) => {
        const idToken = await useUserToken();
        const response = await useFetch(APIEndpoints.UPDATE_LIST, {
            query: {
                idToken: idToken,
                updateAction: UpdateAction.UPDATE,
                updateObject: JSON.stringify(media.media),
            }
        });

        return response.data.value;
    }

    mediaCollection.dbRemove = async(media: Media) => {
        const idToken = await useUserToken();
        const response = await useFetch(APIEndpoints.UPDATE_LIST, {
            query: {
                idToken: idToken,
                updateAction: UpdateAction.REMOVE,
                updateObject: media.media,
            },
        });

        return response.data.value;
    }

    // @ts-ignore
    const onDocUpdate = (doc) => {
        mediaCollection.length = 0;
        const collection = doc.data();
        if (collection) {
            for (const media of collection) {
                mediaCollection.push(media);
            }
        }
        // @ts-ignore
        mediaCollection.sort((m1, m2) => m1?.media?.title?.localeCompare(m2?.media?.title));
    }

    const createSnapshot = () => {
        if (uid.value) {
            const docRef = doc(collection(db, 'lists'), uid.value).withConverter(mediaConverter);
            unsubscribe = onSnapshot(docRef, onDocUpdate, onError);
        } else {
            useUser(undefined, (user) => {
                unsubscribe();
                if (user.uid) {
                    const docRef = doc(collection(db, 'lists'), user.uid).withConverter(mediaConverter);
                    unsubscribe = onSnapshot(docRef, onDocUpdate, onError);
                }
            });
        }
    }

    createSnapshot();
    watch(uid, () => {
       unsubscribe();
       createSnapshot();
    });
    
    return {mediaCollection};
}