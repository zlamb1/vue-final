export default function useGoogleBookApi() {
    const limit = 40;
    async function queryApi(searchTerm, maxResults, startIndex) {
        maxResults = maxResults ?? 10;
        startIndex = startIndex ?? 0;
        const apiUrl = 'https://www.googleapis.com/books/v1/volumes';
        const response = await useFetch(apiUrl, {
            query: {q: searchTerm, maxResults: maxResults, startIndex: startIndex}
        });
        const items = response?.data?.value?.items;
        if (items) {
            const count = items.length;
            const totalCount = response?.data?.value?.totalItems;
            return {items, count, totalCount}
        }
    }
    return {queryApi, limit}
}