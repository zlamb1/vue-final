<script>
import MediaView from "~/components/view/MediaView.vue";
import Book, {mapArray} from "~/models/Book";
import PopupType from "~/models/PopupType";

export default {
    name: "BookView",
    extends: MediaView,
    data() {
        return {
            cols: {
                authors: {type: PopupType.Array, label: 'Authors:', options: 'Author', formatter: mapArray},
                pagesRead: {type: PopupType.Number, label: 'Pages Read:'},
                pageCount: {type: PopupType.Number, label: 'Page Count:'},
                rating: {type: PopupType.Number, label: 'Rating (/5):'},
                coverType: {type: PopupType.Select, label: 'Cover Type:', options: Book.CoverType.asArray()}
            }
        }
    },
    props: {
        media: {
            type: Book,
            required: true,
        },
        disable: {
            type: Boolean,
            default: false,
        },
    },
}
</script>