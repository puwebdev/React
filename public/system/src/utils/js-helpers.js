export let isArray = (c) => {
    return Array.isArray ? Array.isArray(c) : c instanceof Array;
}

export let extend = (base, newObj) => {
    let key,
        obj = JSON.parse(JSON.stringify(base));
    
    if (newObj) { 
        for(key in newObj) {
            if (Object.prototype.hasOwnProperty.call(newObj, key) && 
                Object.prototype.hasOwnProperty.call(obj, key)) {
                    obj[key] = newObj[key];
            }
        }
    }
    return obj;
};

export let  sortNumber = (a, b) => { return a - b; }

export let trimString = (s, start = true, end = true) => {
    let sTrimmed = s;
    if (start) { sTrimmed = sTrimmed.replace(/^\s\s*/, ''); }
    if (end) { sTrimmed = sTrimmed.replace(/\s\s*$/, ''); }
    return sTrimmed;
}

export let arrayToSet = (arr) => {
    let j, lenJ, outputSet = new Set();
    for (j = 0, lenJ = arr.length; j < lenJ; j += 1) {
        let clazzName = trimString(arr[j]);
        if (!outputSet.has(clazzName)) {
            outputSet.add(clazzName);
        }
    }
    return ouputSet;
}
