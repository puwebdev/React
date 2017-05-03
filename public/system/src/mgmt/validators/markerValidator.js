export const validateMarker = (values, dispatch) => {
    const errors = { position: {}};
    if (!values) { return errors; }

    if (!values.title || values.title.trim() === '') {
        errors.title = 'Enter a Title';
    }

    return errors;
}

//For instant async server validation
export const asyncValidate = (values, dispatch) => {

    return new Promise((resolve, reject) => {

    dispatch(validateInfowinFields(values))
        .then((response) => {
        let data = response.payload.data;
        //if status is not 200 or any one of the fields exist, then there is a field error
        if (response.payload.status != 200 || data.title || data.description) {
            //let other components know of error by updating the redux` state
            dispatch(validateInfowinFieldsFailure(response.payload));
            reject(data); //this is for redux-form itself
        } else {
            //let other components know that everything is fine by updating the redux` state
            dispatch(validateInfowinFieldsSuccess(response.payload)); //ps: this is same as dispatching RESET_POST_FIELDS
            resolve(); //this is for redux-form itself
        }
        });
    });
};

export const markersSizes = [
      { value: 4, label: "Extra Small"}, { value: 8, label: "Small"}, { value: 16, label: "Medium"},
      { value: 32, label: "Large"}, { value: 64, label: "Extra Large"}
    ]
