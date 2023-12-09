<script>
import MediaView from "~/components/view/MediaView.vue";
import PopupType from "~/models/PopupType";
import Song from "~/models/Song";

export default {
    name: "SongView",
    extends: MediaView,
    data() {
        return {
            cols: {
                artists: {type: PopupType.Text, label: 'Artists:'},
                album: {type: PopupType.Text, label: 'Album'},
                releaseDate: {type: PopupType.Date, label: 'Release Date:'},
            }
        }
    },
    props: {
        media: {
            type: Song,
            required: true,
        },
        disable: {
            type: Boolean,
            default: false,
        },
    },
}
</script>