var __s__ = require('../../utils/js-helpers.js'),
    __d__ = require('../../utils/dom-utilities.js'),
    htmlEditorMod = require('./htmlEditor.js'),
    markersNavMod = require('../ui/markersNav.js'),
    configConsts = require('../../mgmt/config.const');

"use strict";

let actionHelpers;

export class RightClick {
    constructor(app3d, viewsNav, winInfo, mgmInfo, reactApp) {
        let me = this;

        this._isVisible = false;
        this._dialogIsVisible = false;
        this._nodes = { holder: null };
        this._context = "";
        this._hoveredObj = "";
        this._contextMenuTarget = null;
        
        this._reactApp = reactApp; //Ref to React App
        this._viewsNav = viewsNav; //Ref to Views Navigator
        this._app3d = app3d; //Ref to parent app3d
        this._winInfo = winInfo; //Ref to Info Window
        this._mgmInfo = mgmInfo; //Ref to Mgmt Info Window

        this._htmlEditor = null;

        this._buildUI();
        this._buildDeleteDialog();
        
    }

    get visible() { return this._isVisible; }
    set visible(v) {
        if (this._isVisible === !!v || !this._nodes.holder ) { return; }
        this._nodes.holder.style.display = v ? "block" : "none";
        this._isVisible = !!v;
    }   

    get enabled() { return this._isEnabled; }
    set enabled(v) {
        if (this._isEnabled === !!v || !this._nodes.holder ) { return; }
        this._isEnabled = !!v;
    }  

    // Private methods ---------------------------------------------------------
    _buildUI() {
        this._nodes.holder = document.getElementById("right-click-holder");
        this._nodes.options = document.getElementById("right-click-options");
        if (!this._nodes.holder || this._nodes.options) { return; }

        let domTitle = document.createElement("DIV");
        domTitle.className = "right-click-title";
        this._nodes.holder.appendChild(domTitle);
        this._nodes.title = domTitle;

        let domOptions = document.createElement("UL");
        domOptions.className = "right-click-options";
        this._nodes.holder.appendChild(domOptions);
        this._nodes.options = domOptions;

        let domLayov = document.createElement("DIV");
        domLayov.className = "right-click-dialog-layover";
        document.body.appendChild(domLayov);
        this._nodes.layover = domLayov;

        let domDialog = document.createElement("DIV");
        domDialog.className = "right-click-dialog-holder";
        this._nodes.layover.appendChild(domDialog);
        this._nodes.dialog = domDialog;

        let domForm = document.createElement("FORM");
        domForm.className = "right-click-dialog-form";
        this._nodes.dialog.appendChild(domForm);
        this._nodes.form = domForm;

        let domBtnDiv = document.createElement("DIV");
        domBtnDiv.className = "right-click-dialog-button-div";
        this._nodes.dialog.appendChild(domBtnDiv);

        let domBtnOk = document.createElement("BUTTON");
        domBtnOk.className = "right-click-dialog-ok";
        domBtnOk.innerHTML = "Proceed";
        domBtnDiv.appendChild(domBtnOk);
        this._nodes.btnOk = domBtnOk;

        let domBtnCancel = document.createElement("BUTTON");
        domBtnCancel.className = "right-click-dialog-cancel";
        domBtnCancel.innerHTML = "Cancel";
        domBtnDiv.appendChild(domBtnCancel);
        this._nodes.btnCancel = domBtnCancel;        

        this._attachListeners();
        this.__actionHelpers = actionHelpers;
        this.__actionCallback = null;

        this._htmlEditor = new htmlEditorMod.htmlEditorPopup(this._app3d, this._viewsNav);

    }

    _attachOnContextMenu(ev) {
        if (!this._isEnabled) { return; }
        ev.preventDefault();
        this._toggle(ev);
        return false;
    }
    
    _attachListeners() {
        let me = this;
        this._isEnabled = true;

        function resolveCallback() {
            if (!me.__actionCallback) { return; }
            
            let inpsDom = me._nodes.form.querySelectorAll('input,textarea,select'),
                j, lenJ,
                values = {}, errors = [];
            
            for (j = 0, lenJ = inpsDom.length; j < lenJ; j += 1) {
                let obj = inpsDom[j],
                    name = obj.name.replace("drc_", ""),
                    isReq = obj.getAttribute("isreq");

                if (isReq && isReq==="true" && !obj.value) { errors.push(name); }
                values[name] = obj.type && obj.type==="checkbox" ? obj.checked 
                            : obj.getAttribute('semantic-ui-type') === "dropdown" ? jQuery(`#${obj.name}`).dropdown('get value')
                            : obj.value;
            }

            if (errors.length) {
                alert("Please fill in all the required fields: \n\n" + errors.join("\n"));
                return;
            }

            let cbRes = me.__actionCallback(values);
            if (cbRes) { me.hideDialog(); }
        }

        __d__.addEventLnr(document, "contextmenu", this._attachOnContextMenu.bind(this));      
        __d__.addEventLnr(this._nodes.options, "click", this._clickAction.bind(this));
        __d__.addEventLnr(this._nodes.btnOk, "click", resolveCallback);
        __d__.addEventLnr(this._nodes.btnCancel, "click", this.hideDialog.bind(this));
    }

    _toggle(ev) {
        let v = !this.visible ? true : false;
        if (!v) { this.visible = false; return; }

        if ((!this._context || this._context === "markers")  && !ev.altKey) { return; }

        this.visible = true;
        this._contextMenuTarget = ev.target;

        let infowinRef = this._findInfowinParent(this._contextMenuTarget), target = null;
        if (infowinRef) { target = this._viewsNav.infoWinsTreeById[infowinRef.getAttribute("data-id")]; }
        
        //Show the options
        let contextHelpers = helpers.options[this._context] || helpers.options["world"],
            htmlOptions = [];
        
        contextHelpers.map((ob, idx) => {
            htmlOptions.push("<li id='" + ob.action + "'><i class='" + (ob.icon || "") + "'></i> " + ob.label + "</li>");
        });

        //Get 
        this._nodes.title.innerHTML = !this._context && this._hoveredObj ? 
            this._hoveredObj 
            : (target ? target.title : this._viewsNav.currentInfoWindow.title);
        
        this._nodes.options.innerHTML = htmlOptions.join("");

        //Set position in window (close to mouse)
        let holderWidth = this._nodes.holder.offsetWidth,
            holderHeight = this._nodes.holder.offsetHeight;
                
        this._nodes.holder.style.top =  ((ev.clientY + holderHeight) > document.body.offsetHeight ? (ev.clientY - holderHeight) : ev.clientY) + "px";
        this._nodes.holder.style.left = ((ev.clientX + holderWidth) > document.body.offsetWidth ? (ev.clientX - holderWidth) : ev.clientX) + "px";
    }

    _findInfowinParent(t) {
        while (t && t.tagName !== "H3") {
            if (!t.parentNode || t.tagName === "HTML") { return null; }
            t = t.parentNode;
        }
        return t;
    }

    _clickAction(ev) {

        let infowinRef = this._findInfowinParent(this._contextMenuTarget), target = null;
        if (infowinRef) { target = this._viewsNav.infoWinsTreeById[infowinRef.getAttribute("data-id")]; }
        
        this.visible = false;
        if (!this.__actionHelpers[ev.target.id]) { return; }

        (this.__actionHelpers[ev.target.id])(ev, target, this);
    }
    
    setContext(context, overwrite = true) {
        if (!overwrite && this._context !== "") { return; }
        this._context = context;
    }

    _showDialog(title = "", dialogMeta = null, callbackOk = null) {
        if (!dialogMeta || dialogMeta.length === 0) { return; }

        var form = [], defaultValues = [];

        if (title) { form.push(`<h3>${title}</h3>`)}
        dialogMeta.map((obj, idx) => {
            form.push(`<div class="rc-${obj.type}">`);
            if (obj.type !== "hidden") { form.push(`<label for='drc_${obj.name}'>${obj.label}</label>`); }
            switch(obj.type) {
                case "text":
                    form.push(`<input type='text' id='drc_${obj.name}' name='drc_${obj.name}' isreq='${obj.required}' value='${obj.defaultValue?obj.defaultValue:""}' />`)
                    defaultValues.push({ name:`drc_${obj.name}`, value: obj.defaultValue });
                    break;
                case "checkbox":
                    form.push(`<input type='checkbox' id='drc_${obj.name}' name='drc_${obj.name}' isreq='false' />`)
                    break;
                case "select":
                    form.push(`<select id='drc_${obj.name}' name='drc_${obj.name}' isreq='false' value='${obj.defaultValue?obj.defaultValue:""}'>`);
                    form.push(`<option value="">-- select --</option>`);
                    obj.options.map((ob, idx) => {
                        form.push(`<option value="${ob}">${ob}</option>`);
                    });
                    form.push(`</select>`);
                    defaultValues.push({ name:`drc_${obj.name}`, value: obj.defaultValue });
                    break;
                case "selectValueLabel":
                    form.push(`<select id='drc_${obj.name}' name='drc_${obj.name}' isreq='false' value='${obj.defaultValue?obj.defaultValue:""}'>`);
                    form.push(`<option value="">-- select --</option>`);
                    obj.options.map((ob, idx) => {
                        form.push(`<option value="${ob.value}">${ob.label}</option>`);
                    });
                    form.push(`</select>`);
                    defaultValues.push({ name:`drc_${obj.name}`, value: obj.defaultValue });
                    break;
                case "hidden":
                    form.push(`<input type='hidden' id='drc_${obj.name}' name='drc_${obj.name}' isreq='false'/>`)
                    defaultValues.push({ name:`drc_${obj.name}`, value: obj.defaultValue });
                    break;
                case "multipleSelect":
                    form.push(`<select semantic-ui-type="dropdown" multiple="" class='ui selection dropdown multiple search' id='drc_${obj.name}' name='drc_${obj.name}' isreq='false' value='${obj.defaultValue?obj.defaultValue:""}'>`);
                    form.push(`<option value="">-- select --</option>`);
                    obj.options.map((ob, idx) => {
                        form.push(`<option value="${ob}">${ob}</option>`);
                    });
                    form.push(`</select>`);
                    defaultValues.push({ name:`drc_${obj.name}`, setter: (f) => { jQuery(f).dropdown('set exactly', obj.defaultValue )}});
                    break;
            }
            form.push("</div>")  
        });

        this.__actionCallback = callbackOk;
        this._nodes.form.innerHTML = form.join("");
        this._nodes.btnOk.style.display = !!callbackOk ? "inline-block" : "none";
        this._nodes.layover.style.display = "block";
        this._dialogIsVisible = true;

        defaultValues.map((obj, idx) => {
            let inp = document.getElementById(obj.name)
            if(obj.setter) {
                obj.setter(inp);
            } else {
                inp.value = obj.value;
            }
        });
        
    }

    hideDialog() {
        this._nodes.dialog.className = this._nodes.dialog.className.includes('object-info') ? this._nodes.dialog.className.replace(" object-info","") : this._nodes.dialog.className;

        this.__actionCallback = null;
        this._nodes.layover.style.display = "none";        
        this._dialogIsVisible = false;
    }

    ////---------   delete infowindow confirmation dialog part      ------//////////

    _buildDeleteDialog() {
        var diagHTML = `
            <div class="delete-confirm-dialog">
              <div class="modal">
                <div class="warning">
                  <span class="warning-message">WARNING</span>
                </div>

                <div class="delete-infowins">
                  <span class="following-message">THE FOLLOWING <span id="del-infowins-count"></span> WILL BE DELETED IF YOU PROCEED</span>
                  <div class="deleting-infowins-list">
                    <div id="delte-infowins-list-div"></div>
                  </div>
                </div>

                <div class="buttons">
                  <button class="btn-ok" id="delete-confirm-ok">
                    OK - Delete {delInfowins.length + 1} Info Windows
                  </button>
                  <button class="btn-close" id="delete-confirm-cancel">
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
        `;

        let transLayer = document.createElement("DIV");
        transLayer.className = "transparent-layer";
        document.body.appendChild(transLayer);
        this._nodes.deleteModal = transLayer;
        this._nodes.deleteModal.innerHTML = diagHTML;
        this._nodes.deleteModal.style.display = "none";

        let btnOk = document.getElementById('delete-confirm-ok'),
            btnClose = document.getElementById('delete-confirm-cancel');

        __d__.addEventLnr(btnOk, 'click', this.deleteConfirmed.bind(this));
        __d__.addEventLnr(btnClose, 'click', this.hideDeleteConfirmDialog.bind(this));
    }

    flattenInfoWins(infowin) {
        var infoWinsTreeArray = [];

        function recursiveIter(w) {
            var j, lenJ;
            function recurseInfowins(parent) {
                var g;
                if (!parent || !parent.infowins) return;

                for (var k = 0, lenK = parent.infowins.length; k < lenK; k += 1) {
                    g = parent.infowins[k];
                    infoWinsTreeArray.push(g);
                    recurseInfowins(g);
                }
            }
            recurseInfowins(w);
        }

        recursiveIter(infowin);
        return infoWinsTreeArray;
    }

    openDeleteConfirmDialog(t) {
        let delInfowins = this.flattenInfoWins(t),
            countNode = document.getElementById('del-infowins-count'),
            btnOk = document.getElementById('delete-confirm-ok'),
            listNode = document.getElementById('delte-infowins-list-div');

        countNode.innerHTML = `${delInfowins.length + 1} INFO WINDOWS`;
        listNode.innerHTML = `1. ${t.title}`;
        delInfowins.map(function(infowin, idx) { listNode.innerHTML +=  `<span>${idx+2}. ${infowin.title}</span>`; });
        btnOk.innerHTML = `OK - Delete ${delInfowins.length + 1} Info Windows`;

        this._currentDelInfo = t;

        this._nodes.deleteModal.style.display = "block";
    }

    hideDeleteConfirmDialog() {
        this._nodes.deleteModal.style.display = "none";
    }

    deleteConfirmed() {
        let me = this;
        
        if (!me._currentDelInfo) { return; }

        axios({
            method: 'delete',
            data: {infowinId: me._currentDelInfo._id, parentType: 'infowin', parentId: me._currentDelInfo.parentId},
            url: `${configConsts.ROOT_URL}/infowins`
        }).then(function (response) {
            me._mgmInfo._updateWorldData();
        })
        .catch(function (error) {
            console.error(error);
        });

        this.hideDeleteConfirmDialog();
    }
}

actionHelpers = {

    infowin_new(ev, t, me) {
        if (!t) { alert("Action not allowed in this context. \n Infowin is null."); return; }

        let optionsDialog = [
                {
                    label: "Title",
                    name: "title",
                    type: "text",
                    required: true
                }
            ];

        const createInfowin = (values) => {
            let camData = me._app3d.viewPositionObjs(3),
                newInfowin = {
                    title: values.title,
                    type: t.type,
                    world: window.config.mainScene.worldId,
                    view: {
                        screenshot: "_missing.png",
                        cameraPosition: camData.cameraPosition,
                        targetPosition: camData.targetPosition,
                        onLoadActions: { hide: [], show: [] },
                        mediaAnimatorData: {},
                        mediaAnimatorAutoStart: false                        
                    }
                };

            axios({
                method: 'post',
                data: { infowin: newInfowin, parentType: 'infowin', parentId: t.parentId },
                url: `${configConsts.ROOT_URL}/infowins`
            }).then(function (response) {
                me._mgmInfo._updateWorldData();
            })
            .catch(function (error) {
                console.error(error);
            });
            return true;
        };

        me._showDialog("New infowin below \"" + t.title + "\"", optionsDialog, createInfowin);
        
    },

    infowin_newChild(ev, t, me) {
        if (!t) { alert("Action not allowed in this context. \n Infowin is null."); return; }

        let optionsDialog = [
                {
                    label: "Title",
                    name: "title",
                    type: "text",
                    required: true
                }
            ];        

        const createInfowin = (values) => {
            let camData = me._app3d.viewPositionObjs(3),
                newInfowin = {
                    title: values.title,
                    type: "infowin",
                    world: window.config.mainScene.worldId,
                    view: {
                        screenshot: "_missing.png",
                        cameraPosition: camData.cameraPosition,
                        targetPosition: camData.targetPosition,
                        onLoadActions: { hide: [], show: [] },
                        mediaAnimatorData: {},
                        mediaAnimatorAutoStart: false                        
                    }
                };

            axios({
                method: 'post',
                data: { infowin: newInfowin, parentType: 'infowin', parentId: t._id },
                url: `${configConsts.ROOT_URL}/infowins`
            }).then(function (response) {
                me._mgmInfo._updateWorldData();
            })
            .catch(function (error) {
                console.error(error);
            });
            return true;
        }

        me._showDialog("New child infowin of \"" + t.title + "\"", optionsDialog, createInfowin);
        
    },

    infowin_delete(ev, t, me) {
        if (!t) { alert("Action not allowed in this context. \n Infowin is null."); return; }
        me.openDeleteConfirmDialog(t);
    },

    infowin_edit(ev, target, me) {
        let t = target || me._viewsNav.currentInfoWindow, parentType;

        if (!t) { return; }

        parentType = t.parentType && t.parentType === "world" ? "world" : "infowin";
        document.location.hash = '#/infowins/' + parentType + '/' + t.parentId + '/' + t._id;
        me._mgmInfo.toggle();
    },

    infowin_html_editor(ev, t, me) {
        if (!t) { alert("Action not allowed in this context. \n Infowin is null."); return; }

        me._htmlEditor.show(t.html);

        let editorContent = document.getElementById('editor-content');
        document.getElementById('html-content_ifr').style.height = (editorContent.offsetHeight - 200) + 'px';
    },

    infowin_movetoparent(ev, t, me) {
        if (!t) { alert("Action not allowed in this context. \n Infowin is null."); return; }

        let infowinsList = me._viewsNav.infoWinsTreeArray,
            targetInfowinId = t._id,
            oldParentId = t.parentId,
            oldParentType = t.parentType,
            availableParents = [],
            curItem = me._viewsNav.infoWinsTreeById[targetInfowinId],
            isChildOfRightClickedInfowin = false;

        for (let j = 0, lenJ = infowinsList.length; j < lenJ; j += 1) {
            let obj = infowinsList[j], dashes;

            if (obj._id === targetInfowinId) { isChildOfRightClickedInfowin = true; }
            else if (isChildOfRightClickedInfowin && obj.___level <= curItem.___level) isChildOfRightClickedInfowin = false;

            if (isChildOfRightClickedInfowin) { continue; };
            
            dashes = "-----------".substring(0, obj.___level) + " ",
            availableParents.push({ label: dashes + obj.title, value: obj._id });

        }
        infowinsList.map((obj, idx) => {
        });

        let optionsDialog = [
            {
                label: "Select the new parent:",
                name: "movetarget",
                type: "selectValueLabel",
                options: availableParents,
                defaultValue: oldParentId,
                required: true
            },
            {
                label: "infowinId",
                name: "infowinId",
                type: "hidden",
                defaultValue: targetInfowinId,
                required: true
            }            
        ];   

        const moveInfowin = (values) => {
            let newParentId = values.movetarget,
                moveInfowinId = values.infowinId;
            
            if (!newParentId) { alert("Please select a new Parent"); return; }            
            if (newParentId === oldParentId || newParentId === moveInfowinId) { alert("Cannot move to same infowin"); return; }            

            let newParent = me._viewsNav.infoWinsTreeById[newParentId];

            axios({
                method: 'put',
                data: {
                    infowinId: moveInfowinId, 
                    oldParentId: oldParentId, 
                    oldParentType: oldParentType === "world" ? "world" : "infowin", 
                    newParentId: newParentId,
                    newParentType: newParent.type === "world" ? "world" : "infowin"
                },
                url: `${configConsts.ROOT_URL}/infowinsMoveToParentId`
            }).then(function (response) {
                me._mgmInfo._updateWorldData();
            })
            .catch(function (error) {
                console.error(error);
            });
            return true;
        }

        me._showDialog(`Move To Parent of <br />\"${curItem.title}\"`, optionsDialog, moveInfowin);

    },

    infowin_screenshot(ev, target, me) {
        let t = target || me._viewsNav.currentInfoWindow;

        if (!t) { return; }
        if (!t.view) { alert("This infowin has no default View"); return; }

        window.app3dMediaNav.pause();

        me._app3d.viewPosition(
                [t.view.cameraPosition.x, t.view.cameraPosition.y, t.view.cameraPosition.z],
                [t.view.targetPosition.x, t.view.targetPosition.y, t.view.targetPosition.z]
            );
        me._app3d.generateScreenshot(240, 180, "image/png", false, "Generating screenshot..", true).then((screenshot) => {
            let infowin = {
                _id: t._id,
                view: Object.assign(t.view, { screenshot: screenshot })
            };

            axios({
                method: 'put',
                data: { infowin: infowin },
                url: `${configConsts.ROOT_URL}/infowins`
            }).then(function (response) {
                me._mgmInfo._updateWorldData();
            })
            .catch(function (error) {
                console.error(error);
            });

        });
    },

    object3d_showname(ev, target, me) {
        let intersected = me._app3d.renderer3d._INTERSECTED;
        if (!intersected) { alert("Nothing intersected"); return; }
        if (!intersected.name) { alert("Intersected 3d object has empty name"); return; }

        const orderLowercase = (a, b) => { 
            return String(a).toLowerCase() > String(b).toLowerCase() ? 1 : -1;
        }
        const orderLowercaseLabel = (a, b) => { 
            return String(a.label).toLowerCase() > String(b.label).toLowerCase() ? 1 : -1;
        }
        
        let trunc = 3;
        const truncat = (v) => { return Math.round(v * Math.pow(10, trunc)) / Math.pow(10, trunc); }
        let pos = { x: truncat(intersected.position.x), y: truncat(intersected.position.y), z: truncat(intersected.position.z) },
            rot = { x: truncat(intersected.rotation.x), y: truncat(intersected.rotation.y), z: truncat(intersected.rotation.z) };

        let device_category_id = me._viewsNav.infowinNamesForId['Device Catalog'], 
            deviceCategoryArray = [],
            objectTags = [],
            curObjectMap,
            curGroupsMap;

        deviceCategoryArray = device_category_id ? 
            _.map(me._viewsNav.infoWinsTreeById[device_category_id].infowins, (o) => { return { label: o.title, value: o._id }}) 
            : [];
            
        objectTags = window.config.objectsMap ? _.uniq(_.flatten(_.pluck(window.config.objectsMap, "tags"))) : [];
        curObjectMap = window.config.objectsMap ? window.config.objectsMap[intersected.name] || { tags: [], deviceCategory: "", groups: [] } : { tags: [], deviceCategory: "", groups: [] };
        curGroupsMap = window.config.groupsMap ? window.config.groupsMap[intersected.name] || { keys: [] } : { keys: [] };

        //Get groups from groupsMap.
        curObjectMap.groups = window.config.infoMap.objs[intersected.name] ? window.config.infoMap.objs[intersected.name].onGroups : [];

        let optionsDialog = [
                {
                    label: "Name",
                    name: "obj_name",
                    type: "hidden",
                    defaultValue: intersected.name,
                    required: true
                },
                {
                    label: `Position: ${JSON.stringify(pos)}`,
                    name: "obj_default_coordinates",
                    type: "alert",
                    required: false
                },
                {
                    label: `Rotation: ${JSON.stringify(rot)}`,
                    name: "obj_default_coordinates_rot",
                    type: "alert",
                    required: false
                },
                {
                    label: "Device Category",
                    name: "obj_device_category",
                    type: "selectValueLabel",
                    options: deviceCategoryArray.sort(orderLowercaseLabel),
                    defaultValue: curObjectMap.deviceCategory,
                    required: true  
                },
                {
                    label: "Tags",
                    name: "obj_tags",
                    type: "multipleSelect",
                    options: objectTags.sort(orderLowercase),
                    defaultValue: curObjectMap.tags,
                    required: true  
                },
                {
                    label: "Groups",
                    name: "object_groups",
                    type: "multipleSelect",
                    options: Object.keys(window.config.infoMap.groups).sort(orderLowercase),
                    defaultValue: curObjectMap.groups,
                    required: true  
                }
            ];

        const updateObjectInfo = (values) => {
            let data = {
                worldId: window.config.mainScene.worldId,
                groupsMap: {},
                objDelKeys: {},
                objectsMap: {}
            };  

            data.objectsMap[values.obj_name] = {
                tags: _.reject(values.obj_tags, (o) => { return Array.isArray(o) }),
                deviceCategory: values.obj_device_category,
                groups: _.reject(values.object_groups, (o) => { return Array.isArray(o) })
            };

            values.object_groups.map( (ob, idx) => { data.groupsMap[ob] = {keys: values.obj_name}; });

            data.groupsMap[values.object_groups] = {keys: values.obj_name};

            axios({
                method: 'put',
                data: data,
                url: `${configConsts.ROOT_URL}/objectsMap`
            }).then(function (response) {
                me._mgmInfo._updateWorldData();
            })
            .catch(function (error) {
                console.error(error);
            });

            return true;
        }

        me._showDialog(intersected.name, optionsDialog, updateObjectInfo);
        me._nodes.dialog.className += " object-info";

        // add new option into multiple select when enter pressed
        jQuery('.ui.dropdown.multiple').keydown(function(evt) {
            if (evt.keyCode === 13) {
                let newItem = document.createElement("OPTION");
                newItem.value = evt.target.value;
                newItem.text = evt.target.value;
                evt.currentTarget.firstChild.insertBefore(newItem, evt.currentTarget.firstChild.firstChild);
            }

            return true;
        });
    },

    object3d_settarget(ev, target, me) {
        let intersected = me._app3d.renderer3d._INTERSECTED;
        if (!intersected) { alert("Nothing intersected"); return; }
        me._app3d.renderer3d.controls.target.copy(intersected.position);
    },
    
    object3d_addmarker(ev, target, me) {
        let intersected = me._app3d.renderer3d._INTERSECTED;
        if (!intersected) { alert("Nothing intersected"); return; }
        if (window.app3dMarkersNav._isOpened) { alert("New marker UI already opened"); return; }
        me._app3d.renderer3d.controls.target.copy(intersected.position);
        me._app3d.renderer3d.controls.target.y += 30;
        window.app3dMarkersNav._open();
    },

    object3d_editmarker(ev, target, me) {
        let intersected = me._app3d.renderer3d._INTERSECTED;
        if (!intersected || !intersected.name) { alert("Nothing intersected"); return; }
        if (window.app3dMarkersNav._isOpened) { alert("New marker UI already opened"); return; }

        let markerId = intersected.name.replace(markersNavMod.prefixMarker, ""),
            markerData = window.app3dMarkersNav.__currentMarkersDataById[markerId];
        
        if (!markerData) { alert("Marker data not found"); return; }
        
        me._app3d.renderer3d.controls.target.copy(markerData.position);
        window.app3dMarkersNav._open(markerData);
    },
    
    object3d_addtogroup(ev, target, me) {
        let intersected = me._app3d.renderer3d._INTERSECTED;
        if (!intersected) { alert("Nothing intersected"); return; }
        if (!intersected.name) { alert("Intersected 3d object has empty name"); return; }

        let name = String(intersected.name);
        let objInfoMap = window.config.infoMap.objs[name],
            onGroups = "On groups: " + 
                (objInfoMap && objInfoMap.onGroups && objInfoMap.onGroups.length ? 
                 "<ul>" + objInfoMap.onGroups.map((o, i) => { return "<li>" + o +"</li>"; }).join("") + "</ul>"
                 : "<span>(none)</span>");

        let objOfGroups = window.config.infoMap.groups,
            listOfGroups = [], key;
        
        for (key in objOfGroups) {
            listOfGroups.push(key);
        }

        const orderLowercase = (a, b) => { 
            return String(a).toLowerCase() > String(b).toLowerCase() ? 1 : -1;
        }

        const sanitizeKey = (original) => {
            const _strip_list = [/\s/g,/\./g, /\|/g, /\\/g, /\&/g, /\?/g, /\:/g, /\;/g, /\~/g, /\!/g, /@/g, /#/g, /\//g, /'/g];
            var i, stripC, sanitized = original;
            if (typeof original === 'string') {
                for (i = 0; i < _strip_list.length; i++) {
                    if (original.search((stripC = _strip_list[i])) > -1) {
                        sanitized = sanitized.replace(stripC, '-');  
                    }
                }
            }
            return sanitized;
        }        

        let optionsDialog = [
                {
                    label: "\"" + name + "\"",
                    name: "title",
                    type: "subtitle",
                    required: false
                },
                {
                    label: onGroups,
                    name: "ongroups",
                    type: "alert",
                    required: false
                },
                {
                    label: "Add to existing group",
                    name: "groupSelected",
                    type: "select",
                    required: false,
                    options: listOfGroups.sort(orderLowercase)
                },
                {
                    label: "Or create a new group",
                    name: "newGroup",
                    type: "text",
                    required: false
                }                
            ];

        const saveToGroupsMap = (values) => {

            if (values.newGroup && objOfGroups[values.newGroup] && 
                !confirm(`A group with name "${values.newGroup}" already exists!.\n\nAdd to it?`)) {
                    return false;
            }

            let groupsMapObj = {},
                groupName = sanitizeKey(values.newGroup || values.groupSelected),
                toGroup;

            if (!groupName) {
                alert("Please select a group or create a new one");
                return false;
            } 

            toGroup = objOfGroups[groupName] || { hiddenByDefault: false, keys: [] }
            
            if (!toGroup.keys) { toGroup.keys = []; }

            if (_.contains(toGroup.keys, name)) {
                alert(`Object ${name} is already part of group ${groupName}!`);
                return false;
            } 
            
            toGroup.keys.push(name);
            toGroup.keys = _.uniq(toGroup.keys);

            groupsMapObj[groupName] = toGroup;

            axios({
                method: 'put',
                data: { groupsMap: groupsMapObj, objDelKeys: {}, worldId: window.config.mainScene.worldId },
                url: `${configConsts.ROOT_URL}/groupsMap`
            }).then(function (response) {
                me._mgmInfo._updateWorldData();
                if (window.location.hash === "#/gearmap") { window.location.hash = "#"}
            })
            .catch(function (error) {
                console.error(error);
            });

            return true;
        }

        me._showDialog("Add to Group", optionsDialog, saveToGroupsMap);
    },
}

const helpers = {
    options: {
        mainNavigator: [
            { 
                icon: "fa fa-pencil",
                label: "Edit this infowin",
                action: "infowin_edit"
            },
            { 
                icon: "fa fa-edit",
                label: "Edit with HTML editor",
                action: "infowin_html_editor"
            },
            { 
                icon: "fa fa-plus",
                label: "New infowin below",
                action: "infowin_new"
            },
            { 
                icon: "fa fa-plus-square",
                label: "New infowin as child",
                action: "infowin_newChild"
            },
            { 
                icon: "fa fa-trash-o",
                label: "Delete this infowin",
                action: "infowin_delete"
            },
            { 
                icon: "fa fa-picture-o",
                label: "Update screenshot",
                action: "infowin_screenshot"
            },
            { 
                icon: "fa fa-mail-forward",
                label: "Move to Parent",
                action: "infowin_movetoparent"
            },
        ],
        displayContent: [
            { 
                icon: "fa fa-pencil",
                label: "Edit this infowin",
                action: "infowin_edit"
            }
        ],
        markers: [
            { 
                icon: "fa fa-certificate",
                label: "Edit this marker",
                action: "object3d_editmarker"
            }
        ],        
        world: [
            { 
                icon: "fa fa-thumb-tack",
                label: "Object info",
                action: "object3d_showname"
            },
            { 
                icon: "fa fa-bullseye",
                label: "Obj as camera target",
                action: "object3d_settarget"
            },
            { 
                icon: "fa fa-certificate",
                label: "Add marker to infowin",
                action: "object3d_addmarker"
            },
            { 
                icon: "fa fa-magnet",
                label: "Add object to group",
                action: "object3d_addtogroup"
            },          
        ]
    }
}
