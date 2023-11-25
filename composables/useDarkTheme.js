const dark = ref(Boolean(localStorage.getItem('useDarkTheme')));

watch(dark, () => {
    localStorage.setItem('useDarkTheme', JSON.stringify(dark.value));
});

export default function useDarkTheme() {
    const $q = useQuasar();
    const qDark = computed(() => {
        return $q.dark.isActive;
    });
    function setDarkTheme(newValue) {
        dark.value = Boolean(newValue);
        $q.dark.set(dark.value);
    }
    function useDarkThemeTransition(x, y) {
        x = x ?? 0;
        y = y ?? 0;
        
        const endRadius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y),
        );
        
        const transitionDarkMode = () => {
            document.documentElement.classList.toggle('dark', dark.value);
            $q.dark.set(dark.value);
        };
        
        if (!document.startViewTransition) {
            // fallback in case browser doesn't support view transitions
            transitionDarkMode();
            return;
        }
        
        const transition = document.startViewTransition(() => transitionDarkMode());
        
        const clipPath =  dark.value ? [
            `circle(${endRadius}px at ${x}px ${y}px)`,
            `circle(0px at ${x}px ${y}px)`,
        ] : [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
        ];
        
        transition.ready.then(() => {
            // Animate the root’s new view
            document.documentElement.animate(
                {
                    clipPath: clipPath
                },
                {
                    duration: 500,
                    easing: 'ease-in-out',
                    pseudoElement: dark.value ? '::view-transition-old(root)' : '::view-transition-new(root)',
                },
            );
        });
    }
    return {qDark, dark, setDarkTheme, useDarkThemeTransition};
}