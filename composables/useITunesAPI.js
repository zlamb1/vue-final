export default function useITunesAPI() {
    const limit = 200;
    async function queryApi(searchTerm, maxResults) {
        maxResults = maxResults ?? 10
        const apiUrl = 'https://itunes.apple.com/search';
        const response = await fetch(apiUrl + `?term=${searchTerm}&limit=${maxResults}&media=music`);
        const data = await response?.json();
        if (data) {
            const count = data.resultCount;
            const totalCount = data.resultCount;
            const items = data.results;
            return {items, count, totalCount}
        }
    }
    return {queryApi, limit}
}