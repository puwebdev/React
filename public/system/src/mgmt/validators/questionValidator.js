export const validateQuestion = (values, dispatch) => {
    const errors = { cameraPosition: {}, targetPosition: {}};
    console.log(values);
    if (!values) { return errors; }

    if (!values.title || values.title.trim() === '') {
        errors.title = 'Enter a Title';
    }

    if (!values.description || values.description.trim() === '') {
        errors.description = 'Enter an Description (a description)';
    }

    if (!values.qtype) {
        errors.qtype = 'Select the Question Type (a Question Type)';
    }

    var cnt = 0;
    var sumGrade = 0;

    if ((!values.answer1 || values.answer1.trim() == '')) {
        cnt ++;
        errors.answer1 = 'This type of question requires at least 2 choices (a answer 1)';          
    }

    if ((!values.answer2 || values.answer2.trim() == '')) {
        cnt ++;
        errors.answer2 = 'This type of question requires at least 2 choices (a answer 2)';          
    }

    if ((!values.answer3 || values.answer3.trim() == '')) {
        cnt ++;
        errors.answer3 = 'This type of question requires at least 2 choices (a answer 3)';         
    }

    if ((!values.answer4 || values.answer4.trim() == '')) {
        cnt ++;
        errors.answer4 = 'This type of question requires at least 2 choices (a answer 4)';         
    }

    if ((!values.answer5 || values.answer5.trim() == '') ) {
        cnt ++;
        errors.answer5 = 'This type of question requires at least 2 choices (a answer 5';          
    } 

    if (cnt <= 3) {     
      errors.answer1 = '';
      errors.answer2 = '';
      errors.answer3 = '';
      errors.answer4 = '';
      errors.answer5 = '';
    }    

    if (values.fraction1 && values.fraction1 != '') {
        sumGrade += Number(values.fraction1);
    }

    if (values.fraction2 && values.fraction2 != '') {
        sumGrade += Number(values.fraction2);
    }

    if (values.fraction3 && values.fraction3 != '') {
        sumGrade += Number(values.fraction3);
    }

    if (values.fraction4 && values.fraction4 != '') {
        sumGrade += Number(values.fraction4);
    }

    if (values.fraction5 && values.fraction5 != '') {
        sumGrade += Number(values.fraction5);
    }
    
    if (isNaN(sumGrade)) {
        if (!values.qtype) {
            errors.qtype = 'Select the Question Type (a Question Type)';
        } else {
            if (values.qtype == "multi") {
                errors.fraction1 = 'One of the choices should be 100%, so that it is possible to get a full grade for this question.';
            } else {
                errors.fraction1 = 'One of the choices should be 100%, so that it is possible to get a full grade for this question.';
            }
        }
    } else {        
        var totalGrade = 0;
        totalGrade = sumGrade * 100;

        if (values.qtype == "multi") {            
            if (totalGrade > 100) {
                errors.fraction1 = 'The positive grades you have chosen do not add up to 100% Instead, they add up to ' + sumGrade + '%';
            } else if (totalGrade < 100) {
                errors.fraction1 = 'The positive grades you have chosen do not add up to 100% Instead, they add up to ' + sumGrade + '%';
            } else if (sumGrade == 0) {
                errors.fraction1 = 'One of the choices should be 100%, so that it is possible to get a full grade for this question.';
            } else {
              if ((!values.answer1 || values.answer1.trim() == '') && Number(values.fraction1) > 0) {
                errors.fraction1 = 'Grade set, but the Answer is blank';
              }
              if ((!values.answer2 || values.answer2.trim() == '') && Number(values.fraction2) > 0) {
                errors.fraction2 = 'Grade set, but the Answer is blank';
              }
              if ((!values.answer3 || values.answer3.trim() == '') && Number(values.fraction3) > 0) {
                errors.fraction3 = 'Grade set, but the Answer is blank';
              }
              if ((!values.answer4 || values.answer4.trim() == '') && Number(values.fraction4) > 0) {
                errors.fraction4 = 'Grade set, but the Answer is blank';
              }
              if ((!values.answer5 || values.answer5.trim() == '') && Number(values.fraction5) > 0) {
                errors.fraction5 = 'Grade set, but the Answer is blank';
              }
            }
        } else {         

          if ((values.franction1 && Number(values.fraction1) < 1) && (values.franction2 && Number(values.fraction2) < 1) && 
            (values.franction3 && Number(values.fraction3) < 1) && (values.franction4 && Number(values.fraction4) < 1) && 
            (values.franction5 && Number(values.fraction5) < 1)) {

              errors.fraction1 = 'One of the choices should be 100%, so that it is possible to get a full grade for this question.';

          } else if (!values.fraction1 && !values.fraction2 && !values.fraction3 && !values.fraction4 && !values.fraction5) {
             
              errors.fraction1 = 'One of the choices should be 100%, so that it is possible to get a full grade for this question.';

          } else {                       
             
              if ((!values.answer1 || values.answer1.trim() == '') && (values.fraction1 && Number(values.fraction1) > 0)) {
                errors.fraction1 = 'Grade set, but the Answer is blank';
              }
              if ((!values.answer2 || values.answer2.trim() == '') && (values.fraction2 && Number(values.fraction2) > 0)) {
                errors.fraction2 = 'Grade set, but the Answer is blank';
              }
              if ((!values.answer3 || values.answer3.trim() == '') && (values.fraction3 && Number(values.fraction3) > 0)) {
                errors.fraction3 = 'Grade set, but the Answer is blank';
              }
              if ((!values.answer4 || values.answer4.trim() == '') && (values.fraction4 && Number(values.fraction4) > 0)) {
                errors.fraction4 = 'Grade set, but the Answer is blank';
              }
              if ((!values.answer5 || values.answer5.trim() == '') && (values.fraction5 && Number(values.fraction5) > 0)) {
                errors.fraction5 = 'Grade set, but the Answer is blank';
              }            
          }          
        }

        if ((values.feedback1 && values.feedback1.trim() != '') && (!values.answer1 || values.answer1.trim() == ''))
            values.feedback1 = '';
        if ((values.feedback2 && values.feedback2.trim() != '') && (!values.answer2 || values.answer2.trim() == ''))
            values.feedback2 = '';
        if ((values.feedback3 && values.feedback3.trim() != '') && (!values.answer3 || values.answer3.trim() == ''))
            values.feedback3 = '';
        if ((values.feedback4 && values.feedback4.trim() != '') && (!values.answer4 || values.answer4.trim() == ''))
            values.feedback4 = '';
        if ((values.feedback5 && values.feedback5.trim() != '') && (!values.answer5 || values.answer5.trim() == ''))
            values.feedback5 = ''; 
    }

    return errors;
}

//For instant async server validation
export const asyncValidate = (values, dispatch) => {
    return new Promise((resolve, reject) => {

    dispatch(validateQuestionFields(values))
        .then((response) => {
        let data = response.payload.data;
        //if status is not 200 or any one of the fields exist, then there is a field error
        if (response.payload.status != 200 || data.title || data.description) {
            //let other components know of error by updating the redux` state
            dispatch(validateQuestionFieldsFailure(response.payload));
            reject(data); //this is for redux-form itself
        } else {
            //let other components know that everything is fine by updating the redux` state
            dispatch(validateQuestionFieldsSuccess(response.payload)); //ps: this is same as dispatching RESET_POST_FIELDS
            resolve(); //this is for redux-form itself
        }
        });
    });
};
