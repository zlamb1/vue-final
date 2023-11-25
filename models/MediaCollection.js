export default function MediaCollection(collection) {
    collection = collection ?? [];
    
    collection.delete = function(arr) {
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            const index = this.indexOf(item);
            if (index > -1) {
                this.splice(index, 1);
            } else {
                console.warn(`MediaCollection: Couldn't find array item to delete => {${item}}`);
            }
        }
        for (const item in arr) {
        
        }
    };
    
    collection.swapItems = function(item1, item2) {
        const index1 = this.indexOf(item1);
        const index2 = this.indexOf(item2);
        
        if (index1 < 0) {
            console.warn(`MediaCollection: Couldn't find array item to swap => {${item1}}`);
            return;
        }
        
        if (index2 < 0) {
            console.warn(`MediaCollection: Couldn't find array item to swap => {${item2}}`);
            return;
        }
        
        // perform the swap
        this[index1] = item2;
        this[index2] = item1;
    };
    
    return collection;
}