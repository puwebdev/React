	jQuery( document ).ready(function( $ ) {
		// Code that uses jQuery's $ can follow here.
		
		$("select")
		  .change(function () {alert(11);
		    var str = "";
		    $( "select option:selected" ).each(function() {
		      str += $( this ).text() + " ";
		    });
		    alert(str);
		  })
		  .change();

		$( "input[type='select']" ).change(function() {
			alert(3);
		  // Check input( $( this ).val() ) for validity here
		});		


	    $("#page-changer select").change(function() {
	        alert(2);
	    })	  
	});

function GetQueryStringValue(strElement, strQueryString){
		
	var aryPairs;
	var i;
	var intEqualPos;
	var strArg = "";
	var strValue = "";
	
	strQueryString = strQueryString.substring(1);
	
	aryPairs = strQueryString.split("&");

	strElement = strElement.toLowerCase();
	
	for (i=0; i < aryPairs.length; i++){
		
		intEqualPos = aryPairs[i].indexOf('=');
		
		if (intEqualPos != -1){
		
			strArg = aryPairs[i].substring(0,intEqualPos);
			
			if (EqualsIgnoreCase(strArg, strElement)){
			
				strValue = aryPairs[i].substring(intEqualPos+1);
				
				strValue = new String(strValue)
				
				strValue = strValue.replace(/\+/g, "%20")
				strValue = unescape(strValue);

				return new String(strValue);
			}
		}
	}

	return "";
}

function EqualsIgnoreCase(str1, str2){

	var blnReturn;
	
	str1 = new String(str1);
	str2 = new String(str2);
	
	blnReturn = (str1.toLowerCase() == str2.toLowerCase())
	
	return blnReturn;
}

function doSetValue(element, value) {
  
  DispatchDriver.SCORM_SetValue(element, value);
  DispatchDriver.CommitData();
  DispatchDriver.ConcedeControl();
  $("#status").val($("#status").val() + "\n-- Status : " + value);

}

var REGISTRATION_ID = '15138024';
