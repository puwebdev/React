var __d__ = require('../../../utils/dom-utilities.js');
    
export const feedbackModal = {

    _nodes: null,
    _callbackFn: null,
    visible: false,

    _init() {
        let me = feedbackModal;

        me._nodes = {
            layv: document.getElementById("marker-feedback-layv"),
            text: document.getElementById("marker-feedback-text"),
            btn: document.getElementById("marker-feedback-dismiss")
        };
        __d__.addEventLnr(me._nodes.btn, "click", me.hide);

    },

    show(text = "", btnText = "Ok", callback = null) {
        let me = feedbackModal;
        
        if (!me._nodes) { me._init(); } //Initialize if necessary
        if (me.visible) { me.hide(); } //Hide if shown

        me._nodes.text.innerHTML = text;
        me._nodes.btn.innerHTML = btnText;
        me._nodes.layv.style.display = "block";
        me._callbackFn = callback;
        me.visible = true;
    },

    hide() {
        let me = feedbackModal;
        if (me._callbackFn) { me._callbackFn(); } //Call callback

        me._callbackFn = null;
        me._nodes.layv.style.display = "none";
        me.visible = false;
    }    
}