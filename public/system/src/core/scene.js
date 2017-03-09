var __s__ = require('../utils/js-helpers.js'),
    __d__ = require('../utils/dom-utilities.js'),
    Preloader = require('../utils/preloader.js'),
    RColor = require('../utils/random-color.js'),
    Renderer = require('./renderer.js'),
    datalayer = require('./datalayer.js');

//Class Scene
export class Scene {

    constructor (node, opts, callbackMouseover = null) {

        let me = this;
        const version = 0.1;

        this.options = __s__.extend({
            loaderColor: "#dddddd",
            loaderColorSucess: "#bbbbbb",
            colors: { background: 0xa0cadb, sunlight: 0xe2e2ee },
            dampingFactor: 0.2,
            models: [],
            baseDir: "/3DObjects/",
            initialCameraPosition: {x: 0, y:30, z: 100},
            screenshots : { width: 600, height: 400, format: "png", transparent: true }
        }, opts);

        let ic = this.options.initialCameraPosition;
        this._cameraPosition = new THREE.Vector3(ic.x, ic.y, ic.z);
        
        this.width = 0;
        this.height = 0;
        this._callbackMouseover = callbackMouseover;

        this._baseNode = node;
        this._node = (function createDomElements() {
            let divMainC, divRenderC, divLloadingC, divLoadingText,
                baseId = "app3d-container-" + Math.round(Math.random() * 100000);
            
            //Main DOM element
            divMainC = document.createElement("div");
            divMainC.className = "app3d-container";
            divMainC.id = baseId;
            
            //Renderer container
            divRenderC = document.createElement("div");
            divRenderC.className = "app3d-render-container";
            divRenderC.id = baseId + "-render";
            divMainC.appendChild(divRenderC);
            divMainC.divRenderC = divRenderC;
            
            //Loading div
            divLloadingC = document.getElementById("app-3d-loading-div");
            if (!divLloadingC) {
                divLloadingC = document.createElement("div");
                divLloadingC.className = "app3d-loading-div";
                divLloadingC.id = baseId + "-loading-div";
                divMainC.appendChild(divLloadingC);
            }
            
            //Loading text inside loading div
            divLoadingText = document.getElementById("app-3d-loading-div-text");
            if (!divLoadingText) {
                divLoadingText = document.createElement("div");
                divLoadingText.className = "app3d-loading-div-text";
                divLoadingText.id = baseId + "-loading-text";
                divLloadingC.appendChild(divLoadingText);
            }
            
            //initialize loader functions
            divMainC.loadingDiv = new Preloader.Preloader(divLloadingC, divLoadingText, 100, me.options, "img-loader-logo");
            
            //Append to DOM element
            node.appendChild(divMainC);
            
            return divMainC;
  
        }());  

        this.renderer3d = null;
        this._datalayer = datalayer;

        this.__currentHighlights = { ___num___: 0 };
        this.__hiddenMappedObjects = {};

        this.init();
        
    }//constructor

    //  .intersectOthers
    // Set to true to use the objects that aren't in the JSON maps. For normal behaviour, se to false.
    get intersectOthers() { return this.renderer3d._intersectGroup === this.renderer3d.meshesHolder.children[1]; }
    set intersectOthers(v) { 
        this.renderer3d._intersectGroup = !!v ? this.renderer3d.meshesHolder.children[1] : this.renderer3d.meshesRelevant;
        this.renderer3d._intersectBehind = !v;
    }

    init() {
        let me = this,
            node = this._node,
            ev,
            hasWebGL = Detector.canvas && Detector.webgl;

        if (!hasWebGL) {
            node.loadingDiv.show();
            node.loadingDiv.setMessage(node.parentNode.getAttribute(!window.WebGLRenderingContext ? "data-gpu" : "data-webgl"));
            return;
        }

        this.updateSize();
        this.renderer3d = new Renderer.Renderer3D(this, this.width, this.height);

        __d__.addEventLnr(window, "resize", function() { 
            me.updateSize(); 
        } );

        this.renderer3d.init();
        this.renderer3d.animate();
        this.loadInitialModels();

        setTimeout(function() {
            ev = __d__.addEventDsptchr("initialized");
            me._baseNode.dispatchEvent(ev);    
        }, 500);    
    }

    loadInitialModels() {
        let me = this,
            j, lenJ, mod, mesh,
            models = [], toLoad = {},
            baseScene, extraModels, clones,
            lights, light, lightData,
            dir = this.options.baseDir;

        if (!window.config || !window.config.mainScene || !window.config.mainScene.baseScene) { return; }

        //Add main scene model
        baseScene = window.config.mainScene.baseScene;
        this.prefix = baseScene.prefix || "baseSceneobj--";

        this.renderer3d.loadModel(dir + baseScene.texturesPath, dir + baseScene.mtl, dir + baseScene.obj, true, true)
            .then(function(fileObj) {
                let objectsByName = me.renderer3d.objectsByName, 
                    materialsByName = me.renderer3d.materialsByName, mat, matFix, materialsFix, matClone, matCloneObj, matCloneData,
                    key, mappedKey;
                let prefix = me.prefix;

                me.renderer3d.createMeshesOfModel(fileObj, [
                    {
                        obj: fileObj,
                        position: { x:0, y:0, z:0 },
                        rotation: { x:0, y:0, z:0 },
                        scale: { x:1, y:1, z:1 }
                    }
                ]);

                //Clone objects
                clones = window.config.mainScene.clones;
                if (clones && clones.length > 0) {
                    for (j = 0, lenJ = clones.length; j < lenJ; j += 1) {
                        mod = clones[j];
                        if (mod.disabled) { continue; }
                        if (!me.renderer3d.objectsByName[mod.cloneOf]) { console.warn("404: " + mod.cloneOf); continue; }

                        mesh = me.renderer3d.objectsByName[mod.cloneOf].clone();
                        mesh.position.x = mod.position.x;
                        mesh.position.y = mod.position.y;
                        mesh.position.z = mod.position.z;
                        mesh.rotation.x = mod.rotation.x / 180 * Math.PI;
                        mesh.rotation.y = mod.rotation.y / 180 * Math.PI;
                        mesh.rotation.z = mod.rotation.z / 180 * Math.PI;
                        mesh.scale.x = mod.scale.x;
                        mesh.scale.y = mod.scale.y;
                        mesh.scale.z = mod.scale.z;
                        mesh.name = mod.name;

                        me.renderer3d.objectsByName[mod.name] = mesh;
                        me.renderer3d.meshesHolder.add(mesh);
                    }
                }

                //Create infoMap
                window.config.infoMap = {};
                me._populateInfomap(window.config.infoMap, window.config.gearList, window.config.gearMap);
                   
                //Fix materials
                materialsFix  = window.config.materialsFix;


                if (materialsFix && materialsFix.clones) {
                    for (j = 0, lenJ = materialsFix.clones.length; j < lenJ; j += 1) {
                        matCloneData = materialsFix.clones[j];
                        matCloneObj = objectsByName[prefix + matCloneData.objectName];
                        if (!matCloneObj || !matCloneObj.material) { continue; }

                        if (!matCloneData.overwriteIfExists && materialsByName[matCloneData.newMaterialName]) { 
                            matClone = materialsByName[matCloneData.newMaterialName];
                        } else {
                            matClone = matCloneObj.material.clone();
                            matClone.name = matCloneData.newMaterialName;
                            materialsByName[matCloneData.newMaterialName] = matClone;
                        }                        
                        matCloneObj.material = matClone;
                    }
                }  


                if (materialsFix && materialsFix.fixes) {
                    for (j = 0, lenJ = materialsFix.fixes.length; j < lenJ; j += 1) {
                        matFix = materialsFix.fixes[j];
                        mat = materialsByName[matFix.materialName];
                        if (!mat) { continue; }
                        if (matFix.color) {
                            mat.color.r = matFix.color.r;
                            mat.color.g = matFix.color.g;
                            mat.color.b = matFix.color.b;
                        }
                        if (matFix.specular) {
                            mat.specular.r = matFix.specular.r;
                            mat.specular.g = matFix.specular.g;
                            mat.specular.b = matFix.specular.b;
                        }                        
                        if (matFix.aoMapIntensity)      { mat.aoMapIntensity = matFix.aoMapIntensity; }
                        if (matFix.bumpScale)           { mat.bumpScale = matFix.bumpScale; }
                        if (matFix.displacementScale)   { mat.displacementScale = matFix.displacementScale; }
                        if (matFix.emissiveIntensity)   { mat.emissiveIntensity = matFix.emissiveIntensity; }
                        if (matFix.lightMapIntensity)   { mat.lightMapIntensity = matFix.lightMapIntensity; }
                        if (matFix.shininess)           { mat.shininess = matFix.shininess; }
                        if (matFix.transparent)         { mat.transparent = matFix.transparent; }
                        if (matFix.opacity)             { mat.opacity = matFix.opacity; }
                        if (matFix.wireframe)           { mat.wireframe = matFix.wireframe; }
                        if (matFix.alphaTest)           { mat.alphaTest = matFix.alphaTest; }
                    }
                }             

            });

        //Add extra models (load)
        extraModels = window.config.mainScene.load;

        if (extraModels && extraModels.length > 0) {
            for (j = 0, lenJ = extraModels.length; j < lenJ; j += 1) {
                mod = extraModels[j];
                if (toLoad[mod.obj]) { continue; }
                
                toLoad[mod.obj] = true;

                this.renderer3d.loadModel(dir + mod.texturesPath, dir + mod.mtl, dir + mod.obj, true, false)
                    .then(function(fileObj) {
                        me.renderer3d.createMeshesOfModel(fileObj);
                    });
            }
        }

        //Add views
        //Views are handled in app/ui/viewsNav.js

        //Add lights
        lights = window.config.lights;
        if (lights && lights.length > 0) {
            for (j = 0, lenJ = lights.length; j < lenJ; j += 1) {
                lightData = lights[j];
                this.renderer3d.addLight(lightData, j);                
            }
        }
    }

    _populateInfomap(infoMap, gearList, gearMap, callback) {
        let me = this,
            prefix = me.prefix,
            objectsByName = me.renderer3d.objectsByName,
            renderer3d = me.renderer3d,
            gearMapReversed, gm;

        me._datalayer.infoMapAndHtml(infoMap, gearList, gearMap, objectsByName, prefix)
            .then(function(infoMap){
                let key, imgLoad, msh, mappedKey;

                for (key in infoMap) {
                    //SKIP !!!! for-loop if exists
                    if (infoMap[key].obj !== null) { continue; }

                    //Move mesh to meshesRelevant & create glowSibling
                    mappedKey = infoMap[key].mappedKey;
                    msh = objectsByName[prefix + key]
                    renderer3d.meshesRelevant.add(msh);
                    renderer3d.meshesHolder.remove(msh);

                    infoMap[key].obj = msh;
                    infoMap[key].glowSibling = me.createGlowSibling(msh, infoMap[key].gearColor, mappedKey);

                    //Pre-load its image
                    if (gearList[mappedKey].thumbnail_src) {
                        imgLoad = new Image();
                        imgLoad.src = gearList[mappedKey].thumbnail_src;
                    }

                    //Improve the 3D Model
                    if (infoMap[key].obj.material) {
                        infoMap[key].obj.material.shininess = 100;
                        infoMap[key].obj.material.needsUpdate  = true;
                    }
                    infoMap[key].obj.traverse(function (child) {
                        child.material.shininess = 100;
                        child.material.needsUpdate  = true;
                    });            
                }
                if (callback) { callback(); }
            });

            //Reverse gearMap => gearMapReversed
            gearMapReversed = {};
            for (gm in gearMap) {
                if (!gearMapReversed[gearMap[gm]]) {
                   gearMapReversed[gearMap[gm]] = []; 
                }
                gearMapReversed[gearMap[gm]].push(gm);
            }
            window.config.gearMapReversed = gearMapReversed;
    }

    createGlowSibling (mesh, color = 0xff0000, mappedKey = "") {
        let glowMaterial,
            objGlow, pos;

        if (!mesh || !mesh.geometry) { return null; }

        glowMaterial = new THREE.MeshLambertMaterial({ color: color, side: THREE.FrontSide });

        pos = mesh.position;
        objGlow = new THREE.Mesh( mesh.geometry.clone(), glowMaterial);
        objGlow.visible = false;
        objGlow.position.copy(pos);

        this.renderer3d.objsGlow.add(objGlow);
        this.renderer3d.objsGlowArray.push(objGlow);

        //Add a reference to mappedKey group
        if (mappedKey) {
            if (!this.renderer3d.objsGlowMapped[mappedKey]) {
                this.renderer3d.objsGlowMapped[mappedKey] = [];
            }
            this.renderer3d.objsGlowMapped[mappedKey].push(objGlow);
        }

        return objGlow;
    }

    glowSiblingShow(mappedKey) {
        let j, lenJ, 
            mappedGroup = mappedKey ? this.renderer3d.objsGlowMapped[mappedKey] : this.renderer3d.objsGlowArray,
            isHidden = this.__hiddenMappedObjects[mappedKey];

        if (!mappedGroup || isHidden) { return; }

        for (j = 0, lenJ = mappedGroup.length; j < lenJ; j += 1) {
            mappedGroup[j].visible = true;
        }
        
        this.renderer3d.objsGlow.visible = true; 
    }

    glowSiblingHide(mappedKey) {
        let j, lenJ,
            mappedGroup = mappedKey ? this.renderer3d.objsGlowMapped[mappedKey] : this.renderer3d.objsGlowArray;
        
        if (!mappedGroup) { return; }

        if (!mappedKey) { this.renderer3d.objsGlow.visible = false; }

        for (j = 0, lenJ = mappedGroup.length; j < lenJ; j += 1) {
            mappedGroup[j].visible = false;
        }
    }

    highlightGlowSibling(mappedKey) {
        console.warn("highlightGlowSibling is obsolete, please use flashGlowSibling");
        this.flashGlowSibling(mappedKey);
    }

    flashGlowSibling(mappedKey) {
        const onOffInts = [400, 800, 1200], tOff = 200;
        let me = this,
            isHidden = this.__hiddenMappedObjects[mappedKey];

        //Function that iterates group of glowSiblings to make them (in)visible
        function turnThemOn(mg, doOn) {
            for (var j = 0, lenJ = mg.length; j < lenJ; j += 1) {
                mg[j].visible = doOn;
            }
        }

        if (!mappedKey || isHidden || !this.renderer3d.objsGlowMapped[mappedKey]) { return; }

        //Do not start a highlight if the object is highlighting
        if (this.__currentHighlights[mappedKey]) { return; }
        //Add it to a temporary store
        this.__currentHighlights[mappedKey] = true;
        this.__currentHighlights.___num___++;
        
        //Get group
        let mappedGroup = this.renderer3d.objsGlowMapped[mappedKey];

        me.renderer3d.objsGlow.visible = true;
        setTimeout(function() { turnThemOn(mappedGroup, true); }, onOffInts[0]); //1 On
        setTimeout(function() { turnThemOn(mappedGroup, false); }, onOffInts[0] + tOff); //1 Off
        setTimeout(function() { turnThemOn(mappedGroup, true); }, onOffInts[1]); //2 On
        setTimeout(function() { turnThemOn(mappedGroup, false); }, onOffInts[1] + tOff); //2 Off
        setTimeout(function() { turnThemOn(mappedGroup, true); }, onOffInts[2]); //3 On
        setTimeout(function() { //3 Off.
            turnThemOn(mappedGroup, false);
            //Clean-up
            me.__currentHighlights[mappedKey] = false;
            me.__currentHighlights.___num___--;
            if (me.__currentHighlights.___num___ === 0) {
                me.renderer3d.objsGlow.visible = false;
            }
        }, onOffInts[2] + tOff);

    }

    setObjectVisibility(mappedKey, visibility, lookIn3dObjectsIfNotFound = true) {
        let target, 
            arrayOfMapped, 
            isMapped = true, 
            isRelevant = true,
            j, lenJ, objj;
        
        //Get correspondent array of Objects' names
        arrayOfMapped = window.config.gearMapReversed[mappedKey];

        //Check it is mapped & belongs to relevant meshes
        target = this.renderer3d.objsGlowMapped[mappedKey];

        if (!arrayOfMapped) { isMapped = false; }
        if (!target) { isRelevant = false; }
                    
        if (isMapped) {
            this.__hiddenMappedObjects[mappedKey] = !visibility;
            
        } else if (lookIn3dObjectsIfNotFound) { //Not mapped, look in all the 3d objects
            target = this.renderer3d.objectsByName[this.prefix + mappedKey];
            if (target) { arrayOfMapped = [mappedKey]; }
        }

        if (!arrayOfMapped || arrayOfMapped.length === 0) { console.warn(mappedKey + " not found"); return; }

        //Iterate to show/hide
        for (j = 0, lenJ = arrayOfMapped.length; j < lenJ; j += 1) {
            target = this.renderer3d.objectsByName[this.prefix + arrayOfMapped[j]];
            if (target) { target.visible = !!visibility; }
        }      

    }

    getDimensions() {
        return { width: this.width, height: this.height };  
    }

    setDimensions(w, h) {
        this.width = w;
        this.height = h;
    }

    updateSize() {
        let  divMainC, par, ev,
            dim, w, h;

        divMainC = this._node;
        par = divMainC.parentNode;

        if (par === null || par === undefined) { return; }
        
        dim = this.getDimensions();
        w = par.offsetWidth;
        h = par.offsetHeight;
        
        if (dim.width !== w || dim.height !== h) {
            divMainC.style.width = w + "px";
            divMainC.style.height = h + "px";
            if (this.renderer3d) { this.renderer3d.resize3DViewer(w, h); }
            this.setDimensions(w, h);

            ev = __d__.addEventDsptchr("resize");
            this._baseNode.dispatchEvent(ev);                
        }      
    }

    moveObj(name, x = null, y = null, z = null) {
        let mesh = this.renderer3d.objectsByName[name];
        if (!mesh) { console.error(name + " doesn't exist!"); return false; }
        if (x !== null) { mesh.position.x = x; }
        if (y !== null) { mesh.position.y = y; }
        if (z !== null) { mesh.position.z = z; }
        console.info(name);
        return mesh.position;
    }

    viewPosition(position = [null, null, null], target = [null, null, null]) {
        let msgError = "", 
            camPos = this.renderer3d.camera.position,
            tarPos = this.renderer3d.controls.target,
            toString = (v, t) => {
                return (t ? "\"" + t + "\" : " : "") + "{ \"x\": " + v.x + ", \"y\": " + v.y + ", \"z\": " + v.z + " }";
            };

        

        if (!Array.isArray(position) || position.length !== 3) 
            { msgError = "1st parameter 'position' must be an array of length 3 [x,y,z].\n"; } 
        if (!Array.isArray(target) || target.length !== 3) 
            { msgError += "2nd parameter 'target' must be an array of length 3 [x,y,z].\n"; } 
        if (msgError) { console.error(msgError); return; }
        
        if (position[0]) { camPos.x = position[0]; } 
        if (position[1]) { camPos.y = position[1]; } 
        if (position[2]) { camPos.z = position[2]; }

        if (target[0]) { tarPos.x = target[0]; } 
        if (target[1]) { tarPos.y = target[1]; } 
        if (target[2]) { tarPos.z = target[2]; }

        //console.info(toString(camPos, "cameraPosition"));
        //console.info(toString(tarPos, "targetPosition"));
        return [camPos, tarPos];         
    }

    pauseRendering() {
        if (this.renderer3d) { this.renderer3d._isRendering = false; }
    }

    resumeRendering() {
        if (this.renderer3d) { this.renderer3d._isRendering = true; }
    }

    toggleRendering(doRender = true) {
        if (!this.renderer3d) { return; }
        this.renderer3d._isRendering = !!doRender;
    }

    

    //Generate screenshots
    //Returns an image/data format
    generateScreenshot(
        width = this.options.screenshots.width,
        height = this.options.screenshots.height,
        format = this.options.screenshots.format,
        transparent = this.options.screenshots.transparent,
        message = "Generating screenshot",
        autoLoadingDiv = true) {

        let me = this,
            data,
            renderer,
            prevSize,
            delay = 500,
            imageFormat = "image/png",
            loadDiv = this._node.loadingDiv;

        return new Promise((resolve, reject) => {

            //Too early
            if (!me.renderer3d) { console.warn("Not ready to take screenshots."); reject("Not ready to take screenshots."); }

            me.renderer3d._isTakingScreenshot = true;
            renderer = me.renderer3d.renderer;

            //Default format is PNG
            format = format.toLowerCase();
            if (format === "jpg" || format === "jpeg") { imageFormat = "image/jpeg"; }

            //Put the loading Div
            if (autoLoadingDiv) {
                loadDiv.setMessage(message);
                loadDiv.setPercentage(0);
                loadDiv.show();
                loadDiv.updateLoader(1, delay / 1000);
            }

            //Adjust size & background
            renderer.setSize(width, height);
            me.renderer3d.camera.aspect = width / height;
            me.renderer3d.camera.updateProjectionMatrix();

            if (transparent) { renderer.setClearColor(me.options.colors.background, 0); }     

            setTimeout(function(){ //We set a timeout of 250ms to allow the camera & rendererer to get the expected position

                //Take it
                renderer.render(me.renderer3d.scene, me.renderer3d.camera);
                data = renderer.domElement.toDataURL(imageFormat);

                //Revert size & background
                renderer.setSize(me.width, me.height);
                if (transparent) { renderer.setClearColor(me.options.colors.background, 1); }
                me.renderer3d.camera.aspect = me.width / me.height;
                me.renderer3d.camera.updateProjectionMatrix();

                //Hide loading Div (if any)
                if (autoLoadingDiv) {
                    setTimeout(function(){
                        loadDiv.hide();
                    }, delay);
                }

                me.renderer3d._isTakingScreenshot = false;
                resolve(data);

            }, 250);
            
        });


    }
      
}