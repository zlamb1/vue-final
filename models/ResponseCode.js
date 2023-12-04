export default Object.freeze(Object.defineProperty(class ResponseCode {
    static SUCCESS = 0;
    static NO_USER = 1;
    static USER_EXISTS = 2;
    static NO_CHANGE= 3;
    static NO_PERMS = 4;
    static RESOURCE_NOT_FOUND = 5;
    static UNKNOWN_UPDATE_ACTION = 6;
    static INVALID_OBJECT = 7;
    
    static UNKNOWN = -1;
    
    static toResponseCode(obj) {
        const num = parseInt(obj);
        for (const prop in this) {
            if (this[prop] === num) {
                return num;
            }
        }
        return ResponseCode.UNKNOWN;
    }
}, 'toErrorCode', {
    enumerable: false,
}));