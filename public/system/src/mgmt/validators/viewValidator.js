export const validateView = (values, dispatch) => {
    const errors = { cameraPosition: {}, targetPosition: {}};
    if (!values) { return errors; }

    if (!values.title || values.title.trim() === '') {
        errors.title = 'Enter a Title';
    }

    if (values.cameraPosition) {
        if (values.cameraPosition.x !== undefined && (!values.cameraPosition.x || isNaN(values.cameraPosition.x))) {
            errors.cameraPosition.x = 'Enter some value';
        }
        if (values.cameraPosition.y !== undefined && (!values.cameraPosition.y || isNaN(values.cameraPosition.y))) {
            errors.cameraPosition.y = 'Enter some value';
        }
        if (values.cameraPosition.z !== undefined && (!values.cameraPosition.z || isNaN(values.cameraPosition.z))) {
            errors.cameraPosition.z = 'Enter some value';
        }
    }

    if (values.targetPosition) {
        if (values.targetPosition.x !== undefined && (!values.targetPosition.x || isNaN(values.targetPosition.x))) {
            errors.targetPosition.x = 'Enter some value';
        }
        if (values.targetPosition.y !== undefined && (!values.targetPosition.y || isNaN(values.targetPosition.y))) {
            errors.targetPosition.y = 'Enter some value';
        }
        if (values.targetPosition.z !== undefined && (!values.targetPosition.z || isNaN(values.targetPosition.z))) {
            errors.targetPosition.z = 'Enter some value';
        }
    }
    return errors;
}

//For instant async server validation
export const asyncValidate = (values, dispatch) => {

    return new Promise((resolve, reject) => {

    dispatch(validateViewFields(values))
        .then((response) => {
        let data = response.payload.data;
        //if status is not 200 or any one of the fields exist, then there is a field error
        if (response.payload.status != 200 || data.title || data.description) {
            //let other components know of error by updating the redux` state
            dispatch(validateViewFieldsFailure(response.payload));
            reject(data); //this is for redux-form itself
        } else {
            //let other components know that everything is fine by updating the redux` state
            dispatch(validateViewFieldsSuccess(response.payload)); //ps: this is same as dispatching RESET_POST_FIELDS
            resolve(); //this is for redux-form itself
        }
        });
    });
};

export const populateObjectsLeft = (gearMap) => {
    let ls = gearMap, ob, key, gearMapped = [], uniqueList = {};
    if (ls) {
        for(key in ls) {
            if (key && !uniqueList[key]) {
                gearMapped.push(key);
                uniqueList[key] = true;
            }
        }
    }
    return gearMapped.sort();
}

export const populateObjectsRight = (gearMap) => {
    let ls = gearMap, ob, key, gearMapped = [], uniqueList = {};
    if (ls) {
        for(key in ls) {
            if (key && ls[key] && !uniqueList[ls[key]]) {
                gearMapped.push(ls[key]);
                uniqueList[ls[key]] = true;
            }
        }
    }
    return gearMapped.sort();
}