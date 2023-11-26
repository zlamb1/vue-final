export default function useBookApi() {
    async function queryApi(searchTerm) {
        const apiUrl = 'https://www.googleapis.com/books/v1/volumes';
        return useFetch(apiUrl, {
            query: {q: searchTerm}
        })
    }
    
    return {queryApi}
}