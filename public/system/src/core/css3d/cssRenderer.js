module.exports = class CssRenderer{
//--------------------------------------------------------------------------------------
  constructor(width, height){
    if (!THREE.CSS3DRenderer) { return; }
    // all CSS objects are added to a different scene and rendered separately
    this.scene = new THREE.Scene();
    this.renderer = new THREE.CSS3DRenderer();
    // should be as large as the webGL renderer
    this.renderer.setSize(width, height);
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = 0;
    this.renderer.domElement.style.zIndex = 0;
    // all css objects stored here
    this.objects = {};
    // anything further than this
    this.visibleDistance = 20;
    this._isActive = false;
    this._isRunning = false;
    this._width = width;
    this._height = height;
  }
//--------------------------------------------------------------------------------------
    get isRunning() { return this._isRunning; }
    get isActive() { return this._isActive; }
    set isActive(v) {
      let isA = !!v,
          cameraElement = this.renderer.cameraElement;

      if (isA) { 
        cameraElement.style.width = this._width + "px";
        cameraElement.style.height = this._height + "px";
        cameraElement.style.WebkitTransformStyle = 'preserve-3d';
        cameraElement.style.MozTransformStyle = 'preserve-3d';
        cameraElement.style.oTransformStyle = 'preserve-3d';
        cameraElement.style.transformStyle = 'preserve-3d';
        cameraElement.style.display = "block"; 
      } else {
        cameraElement.style = "display:none";  //This is needed to improve performance. Clear styles.
      }

      this._isActive = isA;
    }
//--------------------------------------------------------------------------------------
  start(){
    if (!window.config.deviceScreens) { return; }
    this._isRunning = true;
  }
//--------------------------------------------------------------------------------------
  load(css3Keys, infowinId){
    let device = window.config.deviceScreens[css3Keys.key],
        deviceIn, loc, key;

    if (!device || !device[css3Keys.subkey] || !device[css3Keys.subkey].locations[css3Keys.location]) { 
      console.error(JSON.stringify(css3Keys) + " is not a css3DObject!"); return;
    }

    deviceIn = device[css3Keys.subkey];
    loc = deviceIn.locations[css3Keys.location];

    key = `${css3Keys.key}_____${css3Keys.subkey}_____${css3Keys.location}`;
    
    this.isActive = true;
    return this._addElement(key, deviceIn, loc, infowinId);
  }
//--------------------------------------------------------------------------------------
  clear(){
    let me = this;
    _.each(this.objects, (o) => {
      if (o.iframe && o.iframe.contentWindow) {
      o.iframe.contentWindow.postMessage({
            command: "unload",
          }, window.location.origin);        
      }
      me.scene.remove(o.css3dObject);
    });
    this.objects = {};
    this.isActive = false;
  }
//--------------------------------------------------------------------------------------
/**
 * Used to add css elements to the scene
 *
 *  @param {key} key
 *  @param {settings} object
 *    url: string the url to the iframe destination
 *    width: number the width of the iframe in pixels
 *    height: number the height of the iframe in pixels
 *    position: THREE.Vector3 the world position of the cssObject
 *    rotation: THREE.Vector3 the rotation of the cssObject
 */
  _addElement(key, deviceIn, loc, infowinId){
    loc.rotation = new THREE.Euler(loc.rotation.x, loc.rotation.y, loc.rotation.z);
    var element = document.createElement('iframe');
    element.id = "css3dIframe_" + key;
    element.src = deviceIn.url + (deviceIn.url.indexOf("?") >= 0 ? "&" : "?") 
      + "infowinId=" + infowinId 
      + "&data=" + deviceIn.data 
      + "&width=" + deviceIn.width 
      + "&height=" + deviceIn.height;
    element.className = 'css3diframe';
    element.style.width = `${deviceIn.width}px`;
    element.style.height = `${deviceIn.height}px`;
    element.style.border = '0px';

    var object = new THREE.CSS3DObject( element );
    object.position.copy(loc.position);
    object.rotation.copy(loc.rotation);
    object.scale.setScalar(0.01);
    this.objects[key] = { key: key, settings: deviceIn, location:loc, css3dObject: object, iframe: element };
    this.scene.add(object);
    return this.objects[key];
  }
//--------------------------------------------------------------------------------------
  render(camera){
    this._checkDistance(camera);
    this.renderer.render(this.scene, camera);
  }
//--------------------------------------------------------------------------------------
  _checkDistance(camera){
    let me = this;
    _.each(this.objects, (o) => { 
      me._toggleElement(o.css3dObject, o.css3dObject.position.distanceTo(camera.position) < (o.location.visibleDistance || 20));
    });
  }
//--------------------------------------------------------------------------------------
  _toggleElement(obj, bool){
    obj.visible = bool;
    obj.element.style.display = bool ? "block" : "none";
  }
//--------------------------------------------------------------------------------------
  _updateSize(width, height) {
    this._width = width;
    this._height = height;
    this.renderer.setSize(width, height);    
  }
}
