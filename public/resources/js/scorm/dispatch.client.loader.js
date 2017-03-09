function ShowContent(){
    document.getElementById('dispatch_frameset').rows = "*,0";
}

function LoadContent(){
    window.scormdriver_content = window.dispatch_content_frame;

    //Fix links to be SSL when launching in SSL
    if(window.location.protocol == "https:"){
        ContentAPI = ContentAPI.replace('http:','https:');
        ContentURL = ContentURL.replace('http:','https:');
        if(typeof DefaultCssUrl != "undefined"){
            DefaultCssUrl = DefaultCssUrl.replace('http:','https:');
        }
    }

    if (ContentAPI == ""){
        alert("ERROR - no ContentAPI specified");
        return false;
    }

    if (ContentURL == ""){
        alert("ERROR - no ContentURL specified");
        return false;
    }
   
    //Replace the STUDENTIDFROMLMS here for the registration launch

    var DISPATCH_LEARNER_ID = pipwerks.SCORM.get("cmi.core.student_id");
    if(DISPATCH_LEARNER_ID === null || DISPATCH_LEARNER_ID.length == 0){
        return false;
    }
    DISPATCH_LEARNER_ID = DISPATCH_LEARNER_ID.replace(/[\\\/]/g,"_");
    ContentURL = ContentURL.replace("LEARNER_ID",encodeURIComponent(DISPATCH_LEARNER_ID));

    var nameParts = getLearnerNameParts(pipwerks.SCORM.get("cmi.core.student_name"));
    ContentURL = ContentURL.replace("LEARNER_LNAME", encodeURIComponent(nameParts[0]));
    ContentURL = ContentURL.replace("LEARNER_FNAME", encodeURIComponent(nameParts[1]));

    ContentURL = ContentURL.replace("REFERRING_URL", encodeURIComponent(document.location));

    var pipeUrl = document.location.href.replace('dispatch.html', 'dispatchapi.html');
    ContentURL = ContentURL.replace("PIPE_URL", encodeURIComponent(pipeUrl));

    var exitUrl = document.location.href.replace('dispatch.html', 'ConcedeControl.html');
    ContentURL = ContentURL.replace("REDIRECT_URL", encodeURIComponent(exitUrl));

    if(typeof DefaultCssUrl != "undefined"){
        ContentURL = ContentURL.replace("CSS_URL", encodeURIComponent(DefaultCssUrl));
    }

    if (pipwerks.SCORM.get("cmi.core.entry")==ENTRY_FIRST_TIME){
        ContentURL = ContentURL.replace("_REGISTRATION_ARGUMENT", "&regid=_new_");
    } else {
        if (pipwerks.SCORM.get("cmi.suspend_data") != ""){
            ContentURL = ContentURL.replace("_REGISTRATION_ARGUMENT", "&regid=" + encodeURIComponent(pipwerks.SCORM.get("cmi.suspend_data")));
        } else {

            if (typeof DispatchVersion != "undefined"){
                //separate test statements because IE8 is finicky
                if (DispatchVersion > 0){
                    //there should be reg info, but there isn't
                    ContentURL = ContentURL.replace("_REGISTRATION_ARGUMENT", "&regid=_none_");
                } else {
                    ContentURL = ContentURL.replace("_REGISTRATION_ARGUMENT", "");
                }
            } else {
                ContentURL = ContentURL.replace("_REGISTRATION_ARGUMENT", "");
            }
        }
    }

	// Navigate to the proper place...
    window.dispatch_loading_frame.document.location.href = "loading.html";
    window.dispatch_content_frame.document.location.href = ContentAPI + '?URL=' + encodeURIComponent(ContentURL) + "#" + pipeUrl;
    //console.log(ContentAPI + '?URL=' + encodeURIComponent(ContentURL) + "#" + pipeUrl);
    setTimeout("ShowContent()", 30000);
}

function getLearnerNameParts(learnerName){
    var nameParts = learnerName.split(",");
    if(nameParts.length == 1){
        if (nameParts[0].length < 1){
            return ["Unknown", "Learner"];
        } else {
            return [nameParts[0].replace(/\s+/g,""), nameParts[0].replace(/\s+/g,"")];
        }
    } else if(nameParts.length == 0){
        return ["Unknown", "Learner"];
    }

    //Get rid of whitespace
    nameParts[0] = nameParts[0].replace(/\s+/g,"");
    nameParts[1] = nameParts[1].replace(/\s+/g,"");

    if (nameParts[0] == ""){
        nameParts[0] = "Unknown";
    }
    if (nameParts[1] == ""){
        nameParts[1] = "Learner";
    }

    return nameParts;
}