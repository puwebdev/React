var __s__ = require('../utils/js-helpers.js'),
    __d__ = require('../utils/dom-utilities.js'),
    Preloader = require('../utils/preloader.js'),
    RColor = require('../utils/random-color.js'),
    Renderer = require('./renderer.js'),
    groupsFactory = require('./groups/groupsFactory'),
    groupObject = require('./groups/groupObject'),
    datalayer = require('./datalayer.js');

"use strict";

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
        this.groupsFactory = groupsFactory.GroupsFactory; //Singleton
        this.groupsFactory.setParent(this);

        this.__currentHighlights = { ___num___: 0 };
        this.__hiddenMappedObjects = {};

        this.__specificMode = false;
        this.__isReady = false;
        this.__initialInfowin = "";

        this.init();
        
    }//constructor

    //  .intersectOthers
    // Set to true to use the objects that aren't in the JSON maps. For normal behaviour, se to false.
    get intersectOthers() { console.error("Obsolete, in Admin mode all meshes are intersected"); return null; }
    set intersectOthers(v) { 
        console.error("Obsolete, in Admin mode all meshes are intersected");
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
                    key, mappedKey, obj;
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
                window.config.infoMap = me._populateInfomap(window.config.groupsMap);
                   
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

                //Check repeated names
                let repeatedN = {};
                me.renderer3d._modelsMapNames.map((n, i) => {
                    if (!repeatedN[n]) { repeatedN[n] = { name: n, rep: 0}; }
                    repeatedN[n].rep++;
                });
                let onlyRepeatedN = _.pluck(_.filter(repeatedN, (n, o) => { return n.rep > 1 }), "name");
                if (onlyRepeatedN.length) {
                    me.renderer3d._duplicatedModelNames = onlyRepeatedN;
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

    _populateInfomap(groupsMap, callback) {
        let me = this,
            prefix = me.prefix,
            objectsByName = me.renderer3d.objectsByName,
            renderer3d = me.renderer3d;

        me._datalayer.infoGroupsProcess(groupsMap, objectsByName, prefix)
            .then(function(infoMap){
                let key, msh, group;

                //Add groups & objs to GroupsFactory
                me.groupsFactory.addFromData(infoMap.objs, infoMap.groups);

                for (key in infoMap.objs) {
                    //Move mesh to meshesRelevant
                    msh = objectsByName[prefix + key];
                    renderer3d.meshesRelevant.add(msh);
                    renderer3d.meshesHolder.remove(msh);
                }

                //Add Glowsiblings to Scene
                for (key in me.groupsFactory.objGlows) {
                    renderer3d.objsGlow.add(me.groupsFactory.objGlows[key]);
                }

                for (key in infoMap.groups) {
                    group = infoMap.groups[key];
                    //Hide by Default
                    if (group.hiddenByDefault) { me.groupsFactory.groups[key].visible = false; }
                    //Add Pivots
                    renderer3d.pivotsGroup.add(me.groupsFactory.groups[key]._pivot);
                }


                if (callback) { callback(); }

                window.config.infoMap = { objs: infoMap.objs, groups: infoMap.groups };

                //Emit event dataProcessed
                let ev = __d__.addEventDsptchr("dataProcessed");
                me._baseNode.dispatchEvent(ev);

                if (infoMap.logErrors && infoMap.logErrors.length) {
                    renderer3d.__missingObjs = infoMap.logErrors.join("\n");
                }

                return infoMap;
            });
    }

    setObjectVisibility(mappedKey, visibility, lookIn3dObjectsIfNotFound = true) {
        let target, 
            j, lenJ, objj;

        visibility = !!visibility;
        target = this.get3dObject(mappedKey, lookIn3dObjectsIfNotFound);
        
        if (!target) { return; }
        target.visible = visibility;
    }

    get3dObject(name, lookIn3dObjectsIfNotFound = true) {
        let target;
        
        //Try to get it from groups
        target = this.groupsFactory.get(name);
        if (target) {
            return target;
        }

        if (!lookIn3dObjectsIfNotFound) { return null; }

        //Try to get it from non-groups
        return this.renderer3d.objectsByName[this.prefix + name];
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
        if (!camPos || !tarPos) { return [[0,0,0],[0,0,0]]; }
        

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

    viewPositionObjs(trunc = 0) {
        let camPos = this.renderer3d.camera.position,
            tarPos = this.renderer3d.controls.target;

        if (!trunc) { return { cameraPosition: camPos, targetPosition: tarPos }; }

        const truncat = (v) => { return Math.round(v * Math.pow(10, trunc)) / Math.pow(10, trunc); }

        return { 
            cameraPosition: { x: truncat(camPos.x), y: truncat(camPos.y), z: truncat(camPos.z) },
            targetPosition: { x: truncat(tarPos.x), y: truncat(tarPos.y), z: truncat(tarPos.z) }
        };
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

    checkModelObjects() {
        let dn = this.renderer3d._duplicatedModelNames, outp = "";
        if (dn && dn.length) {
            outp += "--- Objects with repeated names: ---\n" + 
                        dn.join(" // ") +
                        "\n------------------------------------\n";
        }
        if (this.renderer3d.__missingObjs) {
            outp += this.renderer3d.__missingObjs;
        }
        return outp;
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