// URL TO Content DOMAIN
var urlToPipeXD = "";

function sendPipeMessageToContent(strMessage){
    parent.location = urlToPipeXD + strMessage;
}


var SD = window.parent.parent; // dispatchapi.html (SCTE LMS) -> DispatchHost.html (XpertWorld) -> dispatch.html (SCTE LMS)

function processHtmlMessageEvent(evt) {
    location.hash = evt.data;
    checkForMessages();
}
if(typeof window.addEventListener != "undefined"){
    window.addEventListener("message", processHtmlMessageEvent, false);
} else if (typeof window.attachEvent != "undefined"){
    window.attachEvent("onmessage", processHtmlMessageEvent);
}


var lastId = "";
numberUiMessages = 0;

function checkForMessages(){
    if(location.hash != lastId){
        lastId = location.hash;
        numberUiMessages++;
        var strReturn = '';
        if(lastId){
            var cmdSD = lastId.substring(lastId.indexOf("_") + 1, lastId.length);
            switch(cmdSD){
                case "ConcedeControl":
                    SD.ConcedeControl();
                    break;               
                default:
                    //Setters
                    try{                        
                        var arrSetParams = cmdSD.split(":");                        
                        switch(arrSetParams[0]){
                            case "CommitData":                                
                                SD.CommitSCORMData();                                
                                break;
                            case "SCORMSetValue":
                                var element = arrSetParams[1];
                                var value = arrSetParams[2];                               
                                SD.pipwerks.SCORM.set(element, value);
                                break;
                            case "ShowContent":
                                var dispatch_main = window.parent.parent.document;
                                SD.SetDataChunk(arrSetParams[1]);
                                dispatch_main.getElementById('dispatch_frameset').rows = "*,0";
                                break;
                            case "SetSummary":    
                                break;                            
                        }

                    }
                    catch(e){
                    }
            }
        }
    }
}

setInterval(checkForMessages, 200);