var blnCalledFinish = false;
var blnLoaded = false;
var dtmStart = null;
var dtmEnd = null;
var intAccumulatedMS = 0;
var blnOverrodeTime = false;

//public
function Start(){

	var strStandAlone;
	var strShowInteractiveDebug;
	var objTempAPI = null;
	var strTemp = "";

	var success = pipwerks.SCORM.init();

	if (success)
		InitializeExecuted(success, "");

	return;
}

function InitializeExecuted(blnSuccess, strErrorMessage){
	
	if (!blnSuccess){
		return;
	}

	blnLoaded = true;
	dtmStart = new Date();
		
	setTimeout(LoadContent, 0);
	
	return;
}


function ExecFinish(ExitType){

	var blnResult = true;

	if (blnLoaded && ! blnCalledFinish ){
		
		blnCalledFinish = true;

		dtmEnd = new Date();
		AccumulateTime();
		pipwerks.SCORM.save('cmi.core.session_time', intAccumulatedMS);
		
		blnLoaded = false;
		
		blnResult = pipwerks.SCORM.set("cmi.core.lesson_status", "completed") && blnResult;
		blnResult = pipwerks.SCORM.set("cmi.core.exit", ExitType) && blnResult;
		blnResult = pipwerks.SCORM.save() && blnResult;
		blnResult = pipwerks.SCORM.quit() && blnResult;

		return blnResult;
		
	}
	
	return true;
}

function CommitData() {
	
    if (!blnOverrodeTime) {
        dtmEnd = new Date(); AccumulateTime();
        dtmStart = new Date();
        pipwerks.SCORM.set("cmi.core.session_time", intAccumulatedMS);
    }
    return pipwerks.SCORM.save();
}

//Finish functions

//public
function Suspend(){
	return ExecFinish(EXIT_TYPE_SUSPEND);
}

//public
function Finish(){
	return ExecFinish(EXIT_TYPE_FINISH);
}

//public
function TimeOut(){
	return ExecFinish(EXIT_TYPE_TIMEOUT);
}

//public
function Unload(){
	return ExecFinish(DEFAULT_EXIT_TYPE);
}

function GetContentRootUrlBase(contentRoot){
    
    var urlParts = contentRoot.location.href.split("/");
    delete urlParts[urlParts.length - 1];
    contentRoot = urlParts.join("/");
    return contentRoot;
}

function SearchParentsForContentRoot(){

	var contentRoot = null;
	var wnd = window;
	var i=0;	//safety guard to prevent infinite loop
	
	if (wnd.scormdriver_content){
		contentRoot = wnd.parent;
		console.log(contentRoot);
		return contentRoot;
	}
	
	while (contentRoot == null && wnd != window.top && (i++ < 100)){
		if (wnd.scormdriver_content){
			contentRoot = wnd;
			return contentRoot;
		}
		else{
			wnd = wnd.parent;
		}
	}
	return null;
}


//Storing and retrieving data

//public
function GetStudentID(){
	return pipwerks.SCORM.get("cmi.core.student_id");
}

//public
function GetStudentName(){	
	return pipwerks.SCORM.get("cmi.core.student_name");
}

//public
function GetBookmark(){
	return pipwerks.SCORM.get("cmi.core.lesson_location");
}

//public
function SetBookmark(strBookmark){
	return pipwerks.SCORM.set("cmi.core.lesson_location", strBookmark);
}

//public
function GetDataChunk(){		
	return pipwerks.SCORM.get("cmi.suspend_data");
}

//public
function SetDataChunk(strData){
	return pipwerks.SCORM.set("cmi.suspend_data", strData);
}

//public
function GetScore(){
	return pipwerks.SCORM.get("cmi.core.score.raw");
}

//public
function SetScore(intScore, intMaxScore, intMinScore){	
		
	var blnResult;

	if (! IsValidDecimal(intScore)){
		return false;
	}

	if (! IsValidDecimal(intMaxScore)){
		return false;
	}
	
	if (! IsValidDecimal(intMinScore)){
		return false;
	}
	
	intScore = parseFloat(intScore);
	intMaxScore = parseFloat(intMaxScore);
	intMinScore = parseFloat(intMinScore);

	if (intScore < 0 || intScore > 100){
		return false;
	}

	if (intMaxScore < 0 || intMaxScore > 100){
		return false;
	}

	if (intMinScore < 0 || intMinScore > 100){
		return false;
	}	
	
	if (SCORE_CAN_ONLY_IMPROVE === true){
		
		var previousScore = GetScore();
		
		if (previousScore != null && previousScore != "" && previousScore > intScore){
			return true;
		}
	}
	
	blnResult = pipwerks.SCORM.set("cmi.core.score.raw", intScore);
	blnResult = pipwerks.SCORM.set("cmi.core.score.max", intMaxScore) && blnResult;
	blnResult = pipwerks.SCORM.set("cmi.core.score.min", intMinScore) && blnResult;

	return blnResult;	
}

function Trim(str){
	str = str.replace(/^\s*/, "");
	str = str.replace(/\s*$/, "");
	return str;
}