<script>
import MediaView from "~/components/view/MediaView.vue";
import Movie from "~/models/Movie";
import PopupType from "~/models/PopupType";
import {mapArray} from "~/models/Book";

export default {
    name: "MovieView",
    extends: MediaView,
    data() {
        return {
            cols: {
                directors: {type: PopupType.Array, label: 'Directors:', options: 'Director', formatter: mapArray},
                releaseDate: {type: PopupType.Date, label: 'Release Date:', dateFormat: this.media.dateFormatOptions },
                runTime: {type: PopupType.Text, label: 'Runtime:'},
            }
        }
    },
    props: {
        media: {
            type: Movie,
            required: true,
        },
        disable: {
            type: Boolean,
            default: false,
        },
    },
}
</script>