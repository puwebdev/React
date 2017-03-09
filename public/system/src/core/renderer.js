var __s__ = require('../utils/js-helpers.js');
var __d__ = require('../utils/dom-utilities.js');
"use strict";
//Class Renderer3D
export class Renderer3D {

    constructor(parent, w, h) {
        this.scene = null;
        this.renderer = null;
        this.camera = null; 
        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2();
        this.controls = null;

        this.parent = parent;
        this.container = parent._node;
        this.containerEvents = parent._baseNode;
        this.width = w;
        this.height = h;
        this.frames = 0;

        this.followMouseEvents = false;

        this._INTERSECTED = null;
        this.objsGlow = new THREE.Group();
        this.objsGlow.name = "objsGlow";
        this.objsGlow.visible = false;
        this.objsGlowArray = [];
        this.objsGlowMapped = {};

        this.mouseStart = new THREE.Vector2();
        this.mouseLastClick = new Date();

        this._isTakingScreenshot = false;
        this._floatingCamera = false;
        this._modelsLoaded = {};
        this._modelsMap = [];
        this._modelsMapNames = [];

        this.meshesHolder = new THREE.Group();
        this.meshesHolder.name = "meshesHolder";
        this.meshesRelevant = new THREE.Group();
        this.meshesHolder.add(this.meshesRelevant);
        this._intersectGroup = this.meshesRelevant;
        this._intersectBehind = false;

        this.markersGroup = new THREE.Group();
        this.markersGroup.name = "markersGroup";
        this.meshesRelevant.add(this.markersGroup);

        this.objectsByName = {};
        this.materialsByName = {};

        this._viewTravelling = false;

        this._isRendering = true;
    }

    init() {
        let me = this,
            material,
            light,
            lightsGroup,
            mesh,
            lightPosAn = 4000,
            addLightHelpers = true,
            callbackMouseover,
            options = this.parent.options;

        function prepareDirectionalLight(x, y, z) {
            let ll = new THREE.DirectionalLight(0xffffff, 0.30);
            ll.position.set(x, y, z);
            ll.castShadow = true;
            ll.shadow.camera.left = -lightPosAn;
            ll.shadow.camera.right = lightPosAn;
            ll.shadow.camera.top = lightPosAn;
            ll.shadow.camera.bottom = -lightPosAn;
            ll.shadow.camera.far = 50000;
            ll.shadow.camera.near = 1;

            let directionalLightHelper = new THREE.DirectionalLightHelper(ll, 5000); 
            me.scene.add( directionalLightHelper); 
            
            return ll;
        }
        
        if (this.container === null || this.container === undefined) { console.error("Container is null. Halting."); return; }
        if (!this.width) { console.error("Width is null or zero. Halting."); return; }
        if (!this.height) { console.error("Height is null or zero. Halting."); return; }
        
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMapSoft = true;
        
        this.renderer.setClearColor(options.colors.background, 1);

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
		this.renderer.physicallyCorrectLights = true;
		this.renderer.gammaInput = true;
		this.renderer.gammaOutput = true;
		this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.renderer.toneMappingExposure = Math.pow( 0.7, 5.0 );

        this.container.divRenderC.appendChild(this.renderer.domElement);
        
        this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, 1, 100000);
        this.camera.position.z = options.initialCameraPosition.z;
        this.camera.position.x = options.initialCameraPosition.x;
        this.camera.position.y = options.initialCameraPosition.y;
        
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = options.dampingFactor || 0.3;
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI;
        this.controls.maxDistance = 10000;
        this.controls.minDistance = 0;
        this.controls.mouseButtons = { PAN: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, ORBIT : THREE.MOUSE.RIGHT };
        this.controls.rotateSpeed = 0.1;
        this.controls.panBottomLimit = 40;
        this.controls.panTopLimit = 1000;
        //this.controls.enableKeys = false;
        //this.controls.enablePan = false;
        //this.controls.enabled = this.parent._freeMove;
        
        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2();

        lightsGroup = new THREE.Group();


        lightsGroup.name = "lightsGroup";
        this.lightsGroup = lightsGroup;                                  
        this.scene.add(lightsGroup);

        this.scene.add(this.meshesHolder);
        let bbox = new THREE.BoundingBoxHelper(this.meshesHolder, 0x000000);
        bbox.visible = false;
        bbox.name = "main-bounding-box";
        this.scene.add(bbox);
        this.bbox = bbox;

        this.scene.add(this.objsGlow);        

        callbackMouseover = me.parent._callbackMouseover;
        __d__.addEventLnr(this.parent._node.divRenderC, "mousemove", function(e) {
            me.mouseVector.x = (e.clientX / me.width) * 2 - 1;
            me.mouseVector.y = -(e.clientY / me.height) * 2 + 1;
            if(callbackMouseover) {
                callbackMouseover(me._INTERSECTED);
            }
        });

        __d__.addEventLnr(me.parent._node.divRenderC, "mousedown", function(e) {
            me.mouseStart = new THREE.Vector2(e.clientX, e.clientY);
        }); 

        __d__.addEventLnr(me.parent._node.divRenderC, "mouseup", function(e) {

            let mouseEnd = new THREE.Vector2(e.clientX, e.clientY),
                delta = me.mouseStart.distanceTo(mouseEnd),
                insConnection, ev;
            
            //If the distance isn't small the user is rotating the object, not clicking it.
            if (delta > 15) { return; }

            //Fire click event
            ev = __d__.addEventDsptchr("clicked");
            ev.intersected = me._INTERSECTED;
            me.containerEvents.dispatchEvent(ev);

            //doubleclick event
            if (new Date() - me.mouseLastClick < 350) {
                ev = __d__.addEventDsptchr("doubleclicked");
                ev.intersected = me._INTERSECTED;
                me.containerEvents.dispatchEvent(ev);
            }
            me.mouseLastClick = new Date();

        });             
    }

    resize3DViewer (w, h) {
        if (!this.camera) { return; }
        this.width = w;
        this.height = h; 
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w , h);            
    }

    addLight (lightData, name = "") {
        let light,
            bulbGeometry, bulbMat,
            lightColor, groundColor;
            
        if (lightData.color) { lightColor = parseInt(lightData.color.replace(/^#/, ''), 16); }
        if (lightData.skyColor) { lightColor = parseInt(lightData.skyColor.replace(/^#/, ''), 16); }
        if (lightData.groundColor) { groundColor = parseInt(lightData.groundColor.replace(/^#/, ''), 16); }


        switch (lightData.type) {
            case "pointLight":
                light = new THREE.PointLight(lightColor, lightData.intensity, lightData.distance, lightData.decay );
                light.castShadow = true;
                light.position.set( lightData.position.x, lightData.position.y, lightData.position.z );
                if (lightData.showPoint) {
                    bulbGeometry = new THREE.SphereGeometry( 20, 16, 8 );
                    bulbMat = new THREE.MeshStandardMaterial( {
                        emissive: 0xff0000,
                        emissiveIntensity: 1,
                        color: 0xff0000
                    });
                    light.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
                }
                break;

            case "hemisphereLight":
                light = new THREE.HemisphereLight( lightColor, groundColor || lightColor, lightData.intensity );
                break;

            case "spotLight":
                light = new THREE.SpotLight(lightColor, lightData.intensity, lightData.distance, lightData.angle, lightData.penumbra, lightData.decay );
                light.position.set( lightData.position.x, lightData.position.y, lightData.position.z );
                //light.castShadow = true;
                if (lightData.showPoint) {
                    bulbGeometry = new THREE.SphereGeometry( 20, 16, 8 );
                    bulbMat = new THREE.MeshStandardMaterial( {
                        emissive: 0xffff00,
                        emissiveIntensity: 1,
                        color: 0xffff00
                    });
                    light.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
                }              
                break;

            case "directionalLight":
                light = new THREE.DirectionalLight(lightColor, lightData.intensity);
                light.position.set( lightData.position.x, lightData.position.y, lightData.position.z );
                light.castShadow = true;
                if (lightData.cameraLeft) { light.shadow.camera.left = lightData.cameraLeft; }
                if (lightData.cameraRight) { light.shadow.camera.right = lightData.cameraRight;}
                if (lightData.cameraTop) { light.shadow.camera.top = lightData.cameraTop;}
                if (lightData.cameraBottom) { light.shadow.camera.bottom = lightData.cameraBottom;}
                if (lightData.cameraFar) { light.shadow.camera.far = lightData.cameraFar;}
                if (lightData.cameraNear) { light.shadow.camera.near = lightData.cameraNear;}
                break;

            case "ambienLight": 
                light = new THREE.AmbientLight(lightColor, lightData.intensity);
                break;
        
            default:
                break;
        }

        if (light) {
            light.name = lightData.type + "-" + name;
            if (lightData.disabled) { light.visible = false; }
            this.lightsGroup.add( light );
        }

    }

    loadModel(modelFilesDir, modelFilesMtl, modelFilesObj, putDoubleSide = false, useLoadingDiv = true) {

        let that = this,
            node = this.containerEvents,
            loadDiv = node.loadingDiv,
            options = this.parent.options,
            mats, mesh, rt, cm, loader, mtlLoader, objLoader, 
            
            onProgress = function (xhr) {
                let percentComplete = xhr.loaded / (xhr.total || 3000000);
                loadDiv.updateLoader(percentComplete, 0.3);
            },
            onLoaded = function(fileObj) {
                let ev = __d__.addEventDsptchr("modelLoaded");

                //Dispatch event
                ev.data = { model: fileObj };
                node.dispatchEvent(ev);

                if (useLoadingDiv) {
                    //Finish the loading div
                    loadDiv.updateLoader(1, 0.5);
                    
                    //Hide the loading div
                    setTimeout(function() {
                        loadDiv.hide();
                    }, 500);
                }
                
            };

        return new Promise(
            function(resolve, reject) {
                let modelName = modelFilesObj.replace(".", "");

                if (that._modelsLoaded[modelName]) {
                    resolve(modelName); return;
                }

                if (useLoadingDiv) {
                    loadDiv = that.container.loadingDiv;
                    loadDiv.setPercentage(0);
                    loadDiv.setMessage("Loading model...");
                    loadDiv.show();
                }
                
                mtlLoader = new THREE.MTLLoader();
                mtlLoader.setTexturePath(modelFilesDir);
                mtlLoader.load(modelFilesMtl, function(materials) {
                    let cm, loader, key, myName;

                    materials.preload();

                    if (modelFilesObj.indexOf("/") >= 0) {
                        let arr = modelFilesObj.split("/");
                        myName = arr[arr.length - 1];
                    } else {
                        myName = modelFilesObj;
                    }
                    
                    for (key in materials.materials) {
                        that.materialsByName[myName.replace(/\./,"")  + "--" + materials.materials[key].name] = materials.materials[key];
                    }

                    objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(materials);
                    objLoader.load(modelFilesObj, function (object) {
                        let m, mesh = new THREE.Object3D();

                        //Set name
                        if (modelFilesObj.indexOf("/") > 0) {
                            let arr = modelFilesObj.split("/");
                            myName = arr[arr.length - 1];
                        } else {
                            myName = modelFilesObj;
                        }
                        mesh.name = myName;

                        //Iterate the 3D Model
                        object.traverse(function (child) {

                            if (putDoubleSide && child.material) {
                                child.material.side = THREE.DoubleSide;
                            }

                            m = new THREE.Mesh(child.geometry, child.material);
                            m.name = child.name;
                            m.receiveShadow = true;
                            m.castShadow = true;
                            that.globalToLocal(m);
                            mesh.add(m);

                            if (child.name) {
                                that._modelsMap.push({file: myName, name: child.name });
                                that._modelsMapNames.push(child.name);
                            }
                        });

                        //Add it to a Map of models
                        that._modelsLoaded[modelName] = mesh;
                        onLoaded();
                        resolve(modelFilesObj);
                        return;
                    }, 
                    useLoadingDiv ? onProgress : null, 
                    function (xhr) { 
                        window.alert('An error happened loading assets');
                        console.error(xhr);
                        reject();
                    });         
                });
            }
        );
  
    }

    createMeshesOfModel(fileObj, models = []) {
        let me = this,
            nameModel = fileObj.replace(".", ""),
            j, lenJ, 
            mod;

        //Create Meshes
        for (j = 0, lenJ = models.length; j < lenJ; j += 1) {
            mod = models[j];
            if (mod.obj !== fileObj) { continue; }
            let mesh = this.insertModel(mod.obj, mod.position, mod.rotation, mod.scale, "", lenJ > 1);
            if (mesh) {
                this.meshesHolder.add(mesh);
            }           
        }
    }

    insertModel(modelFileObj,
        p = { x:0, y:0, z:0 },
        r = { x:0, y:0, z:0 },
        s = { x:1, y:1, z:1 }, baseName = "", doClone = false) {

        let me = this,
            position = new THREE.Vector3(p.x, p.y, p.z), 
            rotation = new THREE.Vector3(r.x, r.y, r.z), 
            scale = new THREE.Vector3(s.x, s.y, s.z),
            nameModel = modelFileObj.replace(".", ""),
            obj = this._modelsLoaded[nameModel];

        if (obj) {
            let mesh = doClone ? obj.clone() : obj;
            
            mesh.position.x = position.x;
            mesh.position.y = position.y;
            mesh.position.z = position.z;
            mesh.rotation.x = rotation.x / 180 * Math.PI;
            mesh.rotation.y = rotation.y / 180 * Math.PI;
            mesh.rotation.z = rotation.z / 180 * Math.PI;
            mesh.scale.x = scale.x;
            mesh.scale.y = scale.y;
            mesh.scale.z = scale.z;
            
            mesh.updateMatrix();
            mesh.matrixAutoUpdate = false;

            if (!baseName) {
                if (modelFileObj.indexOf("/") >= 0) {
                    let arr = modelFileObj.split("/");
                    baseName = arr[arr.length - 1];
                } else {
                    baseName = modelFileObj;
                }
                baseName = baseName.replace(/\./,"") + "--";
            }

            mesh.traverse(function (child) {
                if (child.name) {
                    me.objectsByName[baseName + child.name] = child;
                }
            });

            return mesh;
        } else {
            console.error(nameModel + " not found");
            return null;
        }
    }

    globalToLocal (mesh, leaveInZeros = false) {
        let bbox = new THREE.BoundingBoxHelper(mesh, 0x000000), 
            xx, yy, zz;

        bbox.update();

        xx = bbox.position.x;
        yy = bbox.position.y;
        zz = bbox.position.z;

        mesh.geometry.applyMatrix( new THREE.Matrix4().makeTranslation(-xx, -yy, -zz) );

        if (leaveInZeros) { return; } //Don't put it again to its position
        mesh.position.x = xx;
        mesh.position.y = yy;
        mesh.position.z = zz;
    }

    goToView(v, timing = 1.0) {
        console.error("Obsolete, please use app3dViewsNav.goToViewId(id)");
    }

    _moveCamera(vw, timing = 1.0) {
        let me = this;
        const referenceDistance = 150;

        let camPos = this.camera.position,
            tarPos = this.controls.target,
            newCamPos = new THREE.Vector3(vw.cameraPosition.x, vw.cameraPosition.y, vw.cameraPosition.z),
            easeFn = Power2.easeInOut;

        timing = timing + Math.log(Math.max(camPos.distanceTo(newCamPos) / referenceDistance, 1)) * timing * 0.3;
        timing = Math.min(5, Math.max(0.01, timing));
        
        this._viewTravelling = true;
        if (timing > 2) { easeFn = Power3.easeInOut; }

        TweenLite.to(camPos, timing, { 
                x: vw.cameraPosition.x,
                y: vw.cameraPosition.y,
                z: vw.cameraPosition.z,
                ease: easeFn });
        TweenLite.to(tarPos, timing, { 
                x: vw.targetPosition.x,
                y: vw.targetPosition.y,
                z: vw.targetPosition.z,
                ease: easeFn });

        let ev = __d__.addEventDsptchr("viewchanging");
        ev.view = vw;
        me.containerEvents.dispatchEvent(ev);                  

        setTimeout(function() { 
            me._viewTravelling = false;
            let ev = __d__.addEventDsptchr("viewchanged");
            ev.view = vw;
            me.containerEvents.dispatchEvent(ev);            
        }, timing * 1000);             
    }


    animate() {
        var me = this;
        
        function anim() {
            requestAnimationFrame(anim);            
            me.controls.update();
            me.render();
        }
        anim();            
    }

    render() {
        if (this._isTakingScreenshot || !this._isRendering) { return; }
        this.frames += 1;

        if (!(this.frames & 3)) { //this.frames & 3 - every 4 frames
            this.raycaster.setFromCamera(this.mouseVector.clone(), this.camera);

            let intersects = this.raycaster.intersectObjects(this._intersectGroup.children, true),
                lenI = intersects.length;
                              
            if (lenI > 0) {
                let intersect0 = intersects[0].object;

                if (intersect0 !== this._INTERSECTED) {
                    let ev = __d__.addEventDsptchr("pointerchanged");
                    ev.intersected = intersect0;
                    this.containerEvents.dispatchEvent(ev);
                    this._INTERSECTED = intersect0;
                }
            } else {
                if (this._INTERSECTED) {
                    let ev = __d__.addEventDsptchr("pointerchanged");
                    ev.intersected = null;
                    this.containerEvents.dispatchEvent(ev);
                    this._INTERSECTED = null;
                }
            }
        }        

        /*
        this.lightsGroup.rotation.x = this.camera.rotation.x;
        this.lightsGroup.rotation.y = this.camera.rotation.y;
        this.lightsGroup.rotation.z = this.camera.rotation.z;
        */
        this.renderer.render(this.scene, this.camera);
    }

}