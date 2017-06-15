var __s__ = require('../../utils/js-helpers.js');
var __d__ = require('../../utils/dom-utilities.js');
"use strict";

export class localNavigator {

	constructor(viewsNav, winInfo) {
		this._viewsNav = viewsNav;
		this._winInfo = winInfo; //parent container

		this.btnPrevious = null;
		this.btnNext = null;
		this.previousId = '';
		this.nextId = '';

		this._init();
	}

	_init() {
		this.btnPrevious = document.getElementById("btn-pull-left");
		this.btnNext = document.getElementById("btn-pull-right");

		__d__.addEventLnr(this.btnPrevious, 'click', this.onButtonClicked.bind(this));
        __d__.addEventLnr(this.btnNext, 'click', this.onButtonClicked.bind(this));
	}

	setNextPrev(prevId, nextId) {
		this.previousId = prevId;
		this.nextId = nextId;
		
		this.btnPrevious.setAttribute('data-id', this.previousId);
		this.btnNext.setAttribute('data-id', this.nextId);

		var nextEle = document.getElementById('v' + this.nextId);
		var prevEle = document.getElementById('v' + this.previousId);

		if (prevEle && this.previousId !== "") {
			this.btnPrevious.className = this.btnPrevious.className.replace(/\b disabled\b/, "");
		} else {
			if (!this.btnPrevious.className.includes('disabled')) {
				this.btnPrevious.className += ' disabled';
			}
		}

		if (nextEle && this.nextId !== "") {
			this.btnNext.className = this.btnNext.className.replace(/\b disabled\b/, "");
		} else {
			if (!this.btnNext.className.includes('disabled')) {
				this.btnNext.className += ' disabled';
			}
		}
	}

	onButtonClicked(t) {
        var e = t.target, dataId;
		if (t.preventDefault) { t.preventDefault(); }

		this._winInfo.hide(true);

		dataId = e.getAttribute("data-id");
		if (!dataId) { return; }
		this._viewsNav._setHashWithID(dataId);
	}

	goToNext() {
		this._viewsNav._setHashWithID(this.nextId);
	}

	goToPrevious() {
		this._viewsNav._setHashWithID(this.previousId);
	}
}