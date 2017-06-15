var __s__ = require('../../utils/js-helpers.js'),
    __d__ = require('../../utils/dom-utilities.js'),
    creatSpanMode = require('./createSpan.js'),
    configConsts = require('../../mgmt/config.const');

"use strict";


export class htmlEditorPopup {

    constructor(app3d, viewsNav) {

		this._app3d = app3d;        
		this._viewsNav = viewsNav;  

		this._isVisible = false;      

        this._nodes = { holder: null };
        this._createSpan = null;

        this._buildUI();

    }

    get visible() { return this._isVisible; }
    set visible(v) {
        if (this._isVisible === !!v || !this._nodes.holder ) { return; }
        v ? this.show() : this.hide();
    }   
   

    // Private methods ---------------------------------------------------------
    _buildUI() {
        if (this._nodes.holder) { return; }

        let domHolder = document.createElement("DIV");
        domHolder.id = "html-editor-modal-layer";
        domHolder.className = "html-editor-modal-layer";
        this._nodes.holder = domHolder;

        let domContent = document.createElement("DIV");
        domContent.id = "editor-content";
        domContent.className = "editor-content";
        this._nodes.holder.appendChild(domContent);
        this._nodes.content = domContent;

        let domEditor = document.createElement("DIV");
        domEditor.id = "html-content";
        domEditor.className = "html-content";
        this._nodes.content.appendChild(domEditor);
        this._nodes.editor = domEditor;

        let btnClose = document.createElement("BUTTON");
        btnClose.id = "btn-close";
        btnClose.className = "btn-close";
        btnClose.innerHTML = "Close";
        this._nodes.content.appendChild(btnClose);
        this._nodes.btnClose = btnClose;

        let btnSave = document.createElement("BUTTON");
        btnSave.id = "btn-save";
        btnSave.className = "btn-save";
        btnSave.innerHTML = "Save";
        this._nodes.content.appendChild(btnSave);
        this._nodes.btnSave = btnSave;

        this._attachListeners();
        this._initTinyMce();
        this._createSpan = new creatSpanMode.createSpan(this._viewsNav.infoWinsTreeById);

        document.body.appendChild(domHolder);
        
    }

    _initTinyMce() {
        if (!window.tinymce || !this._nodes.holder) { return; }

        let me = this;

        tinymce.init({
            target: this._nodes.editor,
            theme: 'modern',
            plugins: [
                'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                'searchreplace wordcount visualblocks visualchars code fullscreen',
                'insertdatetime media nonbreaking save table contextmenu directionality',
                'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc'
            ],
            toolbar1: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
            toolbar2: 'print preview media | forecolor backcolor emoticons | codesample | createspan removespan',
            menubar: 'edit insert view format table tools',
            image_advtab: true,
            extended_valid_elements: "span[class]",
            setup: function(editor) {
                editor.addButton('createspan', {
                    text: "Create Span Link",
                    icon: false,
                    onclick: function() {
                        if (editor.selection.getContent({format: 'text'}) === "") return;
                        me._createSpan.show(editor);
                    }
                });
                editor.addButton('removespan', {
                    text: "Remove Span Link",
                    icon: false,
                    onclick: function() {
                        var txt = "";
                        if (editor.selection.getNode().nodeName === "SPAN") {
                            txt = editor.selection.getNode().textContent;
                            editor.dom.remove(editor.selection.getNode());
                        }
                        editor.selection.setContent(txt);
                    }
                });
            },
            content_style: "span {color: blue}"
        });
    }    

    _btnSaveEditorClick(e) {
        let content = tinymce.get(this._nodes.editor.id).getContent(),
            newInfowin = this._viewsNav.currentInfoWindow,
            saveInfowin = { _id: newInfowin._id, html: content };

        axios({
            method: 'put',
            data: { infowin: saveInfowin },
            url: `${configConsts.ROOT_URL}/infowins`
        });

        newInfowin.html = content;
        this._viewsNav._init();         
        this.hide();
    }

    _btnCloseEditorClick(e) {
        tinymce.get(this._nodes.editor.id).setContent("");
        this.hide();
    }    

    _attachListeners() {
        __d__.addEventLnr(this._nodes.btnSave , "click", this._btnSaveEditorClick.bind(this));
        __d__.addEventLnr(this._nodes.btnClose, "click", this._btnCloseEditorClick.bind(this));
    } 

    show(content = "") {
        tinymce.get(this._nodes.editor.id).setContent(content);
		this._isVisible = true;
        this._nodes.holder.style.display = "block";
    }

    hide() {
		this._isVisible = false;
        this._nodes.holder.style.display = "none";
    }

}


