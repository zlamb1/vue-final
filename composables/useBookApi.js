export default function useBookApi() {
    const limit = 40;
    async function queryApi(searchTerm, maxResults) {
        maxResults = maxResults ?? 10;
        const apiUrl = 'https://www.googleapis.com/books/v1/volumes';
        return useFetch(apiUrl, {
            query: {q: searchTerm, maxResults: maxResults}
        })
    }
    return {queryApi, limit}
}