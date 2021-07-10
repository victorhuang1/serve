const valueEquals = (a, b) => {
    // see: https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
    if (a === b) return true;
    if (!(a instanceof Array)) return false;
    if (!(b instanceof Array)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i !== a.length; ++i) {
        if (a[i] !== b[i]){
            return false;
        }
    }
    return true;
};

/**
 *  比较字符串是否一样
 * @param a
 * @param b
 * @returns {boolean}
 */
const strEquals = (a,b)=>{
    if (a.length !== b.length) return false;
    if (a.toString() !== b.toString()) return false;
    return true;
};




module.exports ={
    valueEquals,
    strEquals
};