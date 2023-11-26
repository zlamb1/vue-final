export default function useNotify() {
    const $q = useQuasar();
    function notify(options) {
        $q.notify({
            message: options.message ?? 'Notification',
            duration: options.duration ?? 1000,
            position: options.position ?? 'top',
            type: options.type ?? 'info'
        });
    }
    function notifyPositive(message, duration, position) {
        notify({
            message: message ?? 'Saved successfully',
            duration: duration ?? 1000,
            position: position ?? 'top',
            type: 'positive'
        });
    }
    function notifyNegative(message, duration, position) {
        notify({
            message: message ?? 'Error occurred',
            duration: duration ?? 1000,
            position: position ?? 'top',
            type: 'negative'
        });
    }
    
    return {notify, notifyPositive, notifyNegative}
}