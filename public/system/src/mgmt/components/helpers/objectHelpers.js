export const orderLowercase = (a, b) => { 
    return String(a).toLowerCase() > String(b).toLowerCase() ? 1 : -1;
}


export const populateObjectsLeft = (ls) => {
    let ob, key, output = [], uniqueList = {};
    if (ls) {
        for(key in ls) {
            if (key && !uniqueList[key]) {
                output.push(key);
                uniqueList[key] = true;
            }
        }
    }
    return output.sort(orderLowercase);
}

export const populateObjectsRight = (ls, mappedKey) => {
    let ob, key, output = [], uniqueList = {};
    if (ls && mappedKey) {
        for(key in ls) {
            if (key && ls[key] && ls[key][mappedKey] && !uniqueList[ls[key][mappedKey]]) {
                output.push(ls[key][mappedKey]);
                uniqueList[ls[key][mappedKey]] = true;
            }
        }
    }
    return output.sort(orderLowercase);
}