var CanvasArrow = require('./CanvasArrow.js')

class SpriteArrow2D extends THREE.Object3D {

  constructor(size, rotation = Math.PI / 4, letter, options = {}) {
    super();

    this._fillStyle = options.fillStyle || "#e69b18";
    this._size = size;
    this._letter = letter;

    this.canvas = new CanvasArrow(size, rotation);
    this.createArrow();
  }

  get width () { return this.canvas.textWidth }
  get height () { return this.canvas.textHeight }

  get fillStyle() {
    return this._fillStyle;
  }

  set fillStyle(value) {
    if (this._fillStyle !== value) {
      this._fillStyle = value;
      this.createArrow();
    }
  }

  createArrow() {
    this.canvas.drawArrow(this._fillStyle, this._letter);

    // cleanup previous texture
    this.cleanUp()

    this.texture = new THREE.Texture(this.canvas.canvas);
    this.texture.needsUpdate = true;
    this.applyAntiAlias()

    if (!this.material) {
      this.material = new THREE.SpriteMaterial({ map: this.texture });

    } else {
      this.material.map = this.texture
    }

    if (!this.sprite) {
      this.sprite = new THREE.Sprite(this.material);
      this.geometry = this.sprite.geometry;
      this.add(this.sprite);
    }
  }

  cleanUp () {
    if (this.texture) {
      this.texture.dispose()
    }
  }

  applyAntiAlias () {
    if (this.antialias === false) {
      this.texture.magFilter = THREE.NearestFilter
      this.texture.minFilter = THREE.LinearMipMapLinearFilter
    }
  }

  raycast( raycaster, intersects ) {

    var matrixPosition = new THREE.Vector3();
    matrixPosition.setFromMatrixPosition( this.matrixWorld );

    var distanceSq = raycaster.ray.distanceSqToPoint( matrixPosition );
    var guessSizeSq = this.scale.x * this.scale.y / 2;

    if ( distanceSq > guessSizeSq ) {

      return;

    }


    intersects.push( {

      distance: Math.sqrt( distanceSq ),
      point: this.position,
      face: null,
      object: this

    } );

  }

}

module.exports = SpriteArrow2D