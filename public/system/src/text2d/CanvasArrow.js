class CanvasArrow {

  constructor (dim = 64, rotation = Math.PI / 4) {
    
    this.dim = dim;
    this.rotation = rotation;

    this.canvas = document.createElement('canvas');
    this.canvas.width = dim;
    this.canvas.height = dim;
    this.ctx = this.canvas.getContext('2d');

  }

  get width () { return this.canvas.width }
  get height () { return this.canvas.height }

  
  drawArrow(fillStyle, letter) {

    var ctx = this.ctx,
        size = Math.floor(this.dim * 0.66),
        pad = Math.ceil(this.dim * 0.17),
        mid = this.dim * 0.5,
        lw = Math.ceil(this.dim / 16),
        mEx = size * 0.1;


    ctx.save();
    ctx.translate(mid, mid);
    ctx.rotate(this.rotation);
    ctx.translate(-mid, -mid);

    ctx.strokeStyle = fillStyle;
    
    ctx.lineCap = "square";

    ctx.beginPath();
    ctx.lineWidth = lw;
    ctx.rect(pad, pad, size, size);
    ctx.fillStyle = "rgba(230,155,24,0.7)";
    ctx.fill();
    ctx.stroke();

    ctx.translate(mEx, -mEx);
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(pad + size * 0.5, pad + 2 * lw);
    ctx.lineTo(pad + size - 2 * lw, pad + 2 * lw);
    ctx.lineTo(pad + size - 2 * lw, pad + size * 0.5);
    ctx.lineTo(pad + size * 0.5, pad + 2 * lw);
    ctx.fill();
    ctx.restore();

    this.ctx.fillStyle = "#000000";

    if (letter) {
        this.ctx.font = "bold 80px Arial"        
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(letter, this.canvas.width / 2, this.canvas.height / 2);
    } else {
        this.ctx.beginPath();
        this.ctx.arc(pad + size / 2, pad + size / 2, this.dim / 10, 0, 2 * Math.PI, false);
        this.ctx.fill();
    }
        
    return this.canvas;
  }

}

module.exports = CanvasArrow