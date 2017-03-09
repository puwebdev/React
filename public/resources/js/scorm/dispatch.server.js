
var win = null;
var DISPATCH_PIPE_URL = "";

if (window != null) {
    
    win = parent.window;
    DISPATCH_PIPE_URL = win.dispatchApiPath;

    DispatchDriver = {

        frmPipeFrame: win.frames["pipeFrame"],
        sendPipeMessageToLMS: function (strMessage) {

            strMessage += ":" + Math.floor(Math.random() * 1000);

            if (typeof this.frmPipeFrame !== "undefined") {

                var posted = false;
                if (typeof this.frmPipeFrame.postMessage !== "undefined") {
                    try {
                        this.frmPipeFrame.postMessage(strMessage, DISPATCH_PIPE_URL);
                        posted = true;
                    } catch (error) {
                        posted = false;
                    }
                }

                if (!posted) {
                    this.frmPipeFrame.location = DISPATCH_PIPE_URL + strMessage;
                }

            } else {
                console.log("The communication link for dispatch has been broken, this may result in a loss of data.");
            }
        },

        ShowContent: function () {   
            this.sendPipeMessageToLMS("#pipeMessage_ShowContent:" + ((typeof RegistrationToDeliver === "undefined") ? REGISTRATION_ID : RegistrationToDeliver.Id));
            if (typeof DISPATCH_IS_TINCAN !== "undefined") {
                this.sendPipeMessageToLMS("#pipeMessage_IsTinCan");
            }
        },
        SetSummary: function(completion, success, score, totalTime){
            this.sendPipeMessageToLMS("#pipeMessage_SetSummary:"+completion+":"+success+":"+score+":"+totalTime);
        },        
        SCORM_SetValue: function (elementname, elementvalue) {
            $("#status").val($("#status").val() + "\n-- Call - SCORM_SetValue()");
            $("#status").val($("#status").val() + "\n-- SCORM_SetValue('" +  elementname + "', '" + elementvalue + "')");
            this.sendPipeMessageToLMS("#pipeMessage_SCORMSetValue:" + elementname + ":" + elementvalue);
        },
        ConcedeControl: function () {
            this.sendPipeMessageToLMS("#pipeMessage_ConcedeControl");
        },
        SetScore: function(intScore, intMaxScore, intMinScore){
            this.sendPipeMessageToLMS("#pipeMessage_SetScore:"+intScore+":"+intMaxScore+":"+intMinScore);
        },                
        CommitData: function () {
            $("#status").val($("#status").val() + "\n-- Call - CommitData()");
            this.sendPipeMessageToLMS("#pipeMessage_CommitData:");
        },

        numberPipeMessages: 0,
        lastId: "",

    }// end class
} else {
    DispatchDriver = {}
}

if (win != null)
    DispatchDriver.ShowContent();