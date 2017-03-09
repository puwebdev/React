/* +++++ *
/* The purpose of this file is to add new logic to the app 
/*
/* References:  window.app3dViewer (main app)
/*              window.app3dInfowWindow (info-window)
/*              window.app3dViewsNav (views-navigator)
/*
/* This will be available in window.app3dExtras
/* +++++ */

var app3dExtras = (function(){

    var node = document.getElementById("app-3d"),
        app3d = window.app3dViewer, //(main app)
		viewsNav = window.app3dViewsNav, //(info-window)
        winInfo = window.app3dInfowWindow; //(views-navigator)

	window.opxl = window.opxl || {};
	opxl.authoringMode = true;

	$.noConflict();
	
	opxl.guiReady = jQuery.Deferred();

	jQuery( document ).ready(function( $ ) {
		// Code that uses jQuery's $ can follow here.
		opxl.gloss = {};
		$.each(window.config.gearList, function(index, gear) { opxl.gloss[gear.title] = gear; });
        //opxl.createObjectPicker();
        opxl.loadFirstView();
		jQuery.when(opxl.guiReady).done(function(){
			console.log('interface is ready');
		});
	});


    opxl.createObjectPicker = function(){
    	/*
    	var count = jQuery.map(app3dViewer.renderer3d.objectsByName, function(n, i) { return i; }).length;
    	//console.log(count);
    	if (count<1) {
			setTimeout(function(){opxl.createObjectPicker()},500);
			return;
		}
		opxl.objectPicker = jQuery('<ul id="ObjectPicker" style="height: 200px; overflow: scroll;"></ul>');
		var counter = -1;
		jQuery.each(app3dViewer.renderer3d.objectsByName,function(key,obj){
		  //console.log(key,obj);
		  counter++;
		  var title = key.replace('baseSceneobj--','');
		  var item = jQuery('<li class="objectID" data-key="'+key+'" data-objglow="'+counter+'">'+title+'</li>');
		  item.data({
		  		"obj":obj,
		  		"key":key
		  });
		  item.appendTo(opxl.objectPicker);
		  app3dViewer.createGlowSibling(app3dViewer.renderer3d.objectsByName[key]);
		});

		jQuery(opxl.objectPicker).insertBefore('#viewer-nav-thumbs');
		jQuery('#viewer-nav')
			.on('mouseover','#ObjectPicker li.objectID', function(){
				var childrenIndex = Number(jQuery(this).data('objglow'));
				console.log(childrenIndex);
				app3dViewer.renderer3d.objsGlow.children[childrenIndex].visible = true;
			})
			.on('mouseout','#ObjectPicker li.objectID', function(){
				var childrenIndex = Number(jQuery(this).data('objglow'));
				app3dViewer.renderer3d.objsGlow.children[childrenIndex].visible = false;
			});
		*/
	}

	opxl.getCurrentView = function() {
		var currentPosition = app3dViewer.viewPosition();
		var viewCoords = {
			"cameraPosition" : {
				"x" : currentPosition[0].x,
				"y" : currentPosition[0].y,
				"z" : currentPosition[0].z
			},			
			"targetPosition" : {
				"x" : currentPosition[1].x,
				"y" : currentPosition[1].y,
				"z" : currentPosition[1].z
			}
		}
		return JSON.stringify(viewCoords, null, '\t');
	}

	//Not used anymore
	opxl.flyToViewId = function(viewId) {
		if (!viewId) {return;}
		viewsNav.goToViewId(viewId);
	}

	opxl.loadFirstView = function() {
		setTimeout( function () {
			viewsNav.open();
			jQuery('#viewer-nav-thumbs li:visible').first().trigger('click');
			opxl.guiReady.resolve();
		}, 5000);
	}

	/*
	Not used anymore
	opxl.onClickGloss = function(gloss){
		var $ = jQuery;		
		if (gloss && $(gloss).is('[data-viewid]')) {
			opxl.flyToViewId($(gloss).attr('data-viewid'));
		}
	}*/

	opxl.onHideIframe = function(){
		var $ = jQuery;
		//console.log('onHideIframe');	
	}
	
	opxl.onHideInfoWindow = function(force){
		var $ = jQuery;
		//console.log('onHideInfoWindow');	
	}

    opxl.onObjectClick = function (ev) {
        if (!ev || !ev.intersected) {
            return;
        }
        var intersected = ev.intersected,
			objectName = intersected.name || null,
			objectId = window.config.gearMap[objectName] || null,
			objectGear = window.config.gearList[objectId] || null,
			objectTitle = (objectGear && objectGear.title) ? objectGear.title : null,
			objectDescription = (objectGear && objectGear.description) ? objectGear.description : null,
			objectHtml = (objectGear && objectGear.html) ? objectGear.html : null,

        	position = app3dViewer.viewPosition(),
			cameraPosition = position[0],
			targetPosition = position[1],

			currentView = {
				"title": objectTitle,
				"description": objectDescription,
				"html": objectHtml,
				"selected": objectName,
				"key": "",
				"doubleclick": objectName,
				"cameraPosition" : { "x": cameraPosition.x, "y": cameraPosition.y, "z": cameraPosition.z },
				"targetPosition" : { "x": targetPosition.x, "y": targetPosition.y, "z": targetPosition.z },
				"screenshot": null
			} 

        console.log(JSON.stringify(currentView, null,'\t'));

    }

    opxl.onObjectDoubleClick = function (ev) {

        var intersected = ev.intersected || null,
			objectName = (intersected) ? intersected.name : null,
			objectId = window.config.gearMap[objectName] || null,
			matchedView;

        console.log(objectName, objectId);

		if (!objectName || !viewsNav.viewsBySelected[objectName]) { return; }
		
		//Exists a view with Selected = objectName
		matchedView = viewsNav.viewsBySelected[objectName];
		//Move camera to View
		viewsNav.goToViewId(matchedView._id);
		//Log to window
		console.log('View "' + matchedView.title + '" matches object ' + objectName + ' ('+objectId+')', matchedView);
	
    }

	opxl.onObjectHover = function(ev){
		var intersected = ev.intersected;
		if (intersected) {
        	console.log(intersected);
		}
	}

	opxl.onShowIframe = function(src, title, w, h){
		var $ = jQuery;
		//console.log('onShowIframe');	
	}

	opxl.onShowInfoWindow = function(info,persist){
		var $ = jQuery;
		//console.log('onShowInfoWindow');	
	}

	opxl.onViewChanged = function(ev) {
		//console.log('viewChanged',ev);
	}

	opxl.onViewChanging = function(ev) {
		//console.log('viewChanging',ev);
	}

	opxl.receiveMessage = function(message) {
		console.log('receiveMessage',message);
	}
	window.receiveMessage = opxl.receiveMessage;

    node.addEventListener("clicked", opxl.onObjectClick, false);
    node.addEventListener("doubleclicked", opxl.onObjectDoubleClick, false);
    node.addEventListener("pointerchanged", opxl.onObjectHover, false);
    node.addEventListener("viewChanging", opxl.onViewChanging, false);
    node.addEventListener("viewChanged", opxl.onViewChanged, false);


    //Use this to return public variables
    return {
        node: node,
        opxl: opxl
    };

}());
