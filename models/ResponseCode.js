class ResponseCode {
    static SUCCESS = 0;
    static NO_USER = 1;
    static USER_EXISTS = 2;
    static NO_CHANGE= 3;
    static NO_PERMS = 4;
    
    static UNKNOWN = -1;
    
    static toResponseCode(obj) {
        const num = parseInt(obj);
        for (const prop in this) {
            if (ResponseCode[prop] === num) {
                return num;
            }
        }
        return ResponseCode.UNKNOWN;
    }
}

Object.defineProperty(ResponseCode, 'toErrorCode', {
    enumerable: false,
});

Object.freeze(ResponseCode);

export default ResponseCode;