"use strict";

var RColor = require('../../utils/random-color.js'),
    groupsFactory = require('./groupsFactory');

    const blinkCycle = 400, flashNum = 5;

//Class GroupObject
export class GroupObject {
    
    constructor (groupKey, groupData) {
        let me = this,
            rColor = new RColor.RColor(), key, mesh, glowSib,
            gFactory = groupsFactory.GroupsFactory;
        
        this.groupKey = groupKey;
        this.groupData = groupData;
        this.meshes = [];
        this.objsGlows = [];
        this.objsGlowsByKey = {};
        
        this._pivot = new THREE.Object3D();
        this._pivot.name = `pivot-${groupKey}`;
        this._pivot.rotation.set(0,0,0);

        this._glowColor = parseInt((rColor.get(true, 0.95, 0.1)).replace(/^#/, ''), 16);
        this._glowMaterial = new THREE.MeshLambertMaterial({ color: this._glowColor, side: THREE.FrontSide });

        this._isVisible = true;
        this._isHighlighted = false;
        this._isFlashing = false;
        this._isBlinking = false;
        this.__blinked = false;
        this.__interBlinking = null;

        this._position = new THREE.Vector3(0, 0, 0);
        this._rotation = new THREE.Vector3(0, 0, 0);

        //Add references to meshes & create glowing siblings
        for (let i = 0, lenI = groupData.keys.length; i < lenI; i += 1) {
            key = groupData.keys[i];
            mesh = gFactory.objs[key].object3d;

            if (!mesh) { continue; }
            this.meshes.push(mesh);           

            glowSib = gFactory.objGlows[key] || this._createGlowSibling(mesh);
            if (!glowSib) { continue; }

            this.objsGlows.push(glowSib);
            this.objsGlowsByKey[key] = glowSib;
        };

        this._updatePivot();
    }

    get visible() { return this._isVisible; }
    set visible(v) {
        let isv = !!v;
        this.meshes.map((ob, idx) => {
            ob.visible = isv;
        });
        if (!isv && this.highlight) { this.highlight = false; }
        this._isVisible = isv;
    }

    get highlight() { return this._isHighlighted; }
    set highlight(v) {
        let ish = !!v;
        if (!this._isVisible && ish) { return; }

        this.objsGlows.map((ob, idx) => {
            if (ish && ob.material !== this._glowMaterial) { ob.material = this._glowMaterial; }
            ob.visible = ish;
        });
        this._isHighlighted = ish;
    }

    get flash() { return this._isFlashing; }
    set flash(v) {
        let fl = !!v;
        if (!fl || !this._isVisible || this._isFlashing || this._isBlinking) { return; }

        this._isFlashing = fl;
        this._doTheFlash();
    }

    get blink() { return this._isBlinking; }
    set blink(v) {
        let fl = !!v;
        
        if (!fl && this._isBlinking) { 
            this._blink(false); 
            this._isBlinking = false; 
            return;
        }

        if (!this._isVisible || this._isFlashing || this._isBlinking) { return; }

        this._isBlinking = true;
        this._blink(true);
    }    

    get position() { return this._position; }    
    set position(v3) {
        let nv = new THREE.Vector3(v3.x || 0, v3.y || 0, v3.z || 0 );

        this.meshes.map((ob, idx) => {
            ob.position.addVectors(ob.___originalPosition, nv);
        });
        this.objsGlows.map((ob, idx) => {
            ob.position.addVectors(ob.___originalPosition, nv);
        });

        this._position.copy(nv);
    }

    get rotation() { return this._rotation; }    
    set rotation(v3) {
        let nv = new THREE.Vector3((v3.x || 0), (v3.y || 0), (v3.z || 0)),
            nvRad = nv.clone().multiplyScalar(Math.PI / 180),
            me = this, 
            meshesRelevant = groupsFactory.GroupsFactory.parent.renderer3d.meshesRelevant;

        this._updatePivot();

        //Attach to Pivot (expensive)
        this.meshes.map((ob, idx) => {
            THREE.SceneUtils.attach(ob, meshesRelevant, me._pivot);
        });
        this.objsGlows.map((ob, idx) => {
            THREE.SceneUtils.attach(ob, meshesRelevant, me._pivot);
        });

        //Rotate
        this._pivot.rotation.x = nvRad.x;
        this._pivot.rotation.y = nvRad.y;
        this._pivot.rotation.z = nvRad.z;
        this._pivot.updateMatrixWorld();

        //Detach from Pivot (expensive)
        this.meshes.map((ob, idx) => {
            THREE.SceneUtils.detach(ob, me._pivot, meshesRelevant);
        });
        this.objsGlows.map((ob, idx) => {
            THREE.SceneUtils.detach(ob, me._pivot, meshesRelevant);
        });

        this._rotation.copy(nv);
    }

    get isRotated() { return this._rotation.x !== 0 || this._rotation.y !== 0 || this._rotation.z !== 0}
    
    get positionX() { return this._position.x; }    
    set positionX(v) {
        let v3 = this._position; v3.x = v;
        this.position = v3;
    }
    get positionY() { return this._position.y; }    
    set positionY(v) {
        let v3 = this._position; v3.y = v;
        this.position = v3;
    }
    get positionZ() { return this._position.z; }    
    set positionZ(v) {
        let v3 = this._position; v3.z = v;
        this.position = v3;
    }

    get rotationX() { return this._rotation.x; }    
    set rotationX(v) {
        let v3 = this._rotation; v3.x = v;
        this.rotation = v3;
    }
    get rotationY() { return this._rotation.y; }    
    set rotationY(v) {
        let v3 = this._rotation; v3.y = v;
        this.rotation = v3;
    }
    get rotationZ() { return this._rotation.z; }    
    set rotationZ(v) {
        let v3 = this._rotation; v3.z = v;
        this.rotation = v3;
    }

    get proxyVisible() { return this.visible ? 1 : 0; }
    set proxyVisible(v) { this.visible = !!v; }
    get proxyHighlight() { return this.highlight ? 1 : 0; }
    set proxyHighlight(v) { this.highlight = !!v; }
    get proxyFlash() { return this.flash ? 1 : 0; }
    set proxyFlash(v) { this.flash = !!v; }
    get proxyBlink() { return this.blink ? 1 : 0; }
    set proxyBlink(v) { this.blink = !!v; }

    _blinkOnce() {
        let me = this;
        me.__blinked = true;
        me.highlight = true; 
        setTimeout(function() { 
            me.highlight = false; 
            me.__blinked = false;
        }, blinkCycle / 2);
    }

    _doTheFlash() {
        let me = this,
            counter = 0,
            interv;

        clearInterval(interv);
        interv = setInterval(function() {
            me._blinkOnce();
            counter++;
            if (counter > flashNum) { 
                clearInterval(interv);
                me._isFlashing = false;
            }
        }, blinkCycle);        
    }

    _blink(doBlink = true) {
        clearInterval(this.__interBlinking);
        
        if (!doBlink) { return; }

        this.__interBlinking = setInterval(this._blinkOnce.bind(this), blinkCycle);
    }

    _createGlowSibling(mesh) {
        let objGlow, pos;

        if (!mesh || !mesh.geometry) { return null; }

        pos = mesh.position;

        objGlow = new THREE.Mesh( mesh.geometry.clone(), this._glowMaterial);
        objGlow.visible = false;
        objGlow.position.copy(pos);
        objGlow.___originalPosition = pos.clone();

        return objGlow;
    }

    _updatePivot() {
        let posVec = new THREE.Vector3(),
            count = 0;
        
        this.meshes.map((ob, idx) => {
            if (ob.position.x !== 0 && ob.position.y !== 0 && ob.position.z !== 0) {
                posVec.add(ob.position);
                count++;
            }
        });
        
        posVec.divideScalar(count);
        this._pivot.position.x = posVec.x;
        this._pivot.position.y = posVec.y;
        this._pivot.position.z = posVec.z;  

    } 

}
