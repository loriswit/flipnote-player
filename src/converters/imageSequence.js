import { gifEncoder as GifEncoder, player as FlipnotePlayer } from 'flipnote.js';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export default class ImageSequenceConverter {

  constructor() {
    this.zip = null;
    this.format = null;
  }

  init({ format }) {
    this.zip = new JSZip();
    this.format = format;
    return this;
  }

  convert(flipnote) {
    if (this.format === 'gif') {
      for (let frameIndex = 0; frameIndex < flipnote.frameCount; frameIndex++) {
        const gif = GifEncoder.fromFlipnoteFrame(flipnote, frameIndex);
        const blob = gif.getBlob();
        this.zip.file(`${ frameIndex.toString().padStart(3, '0') }.gif`, blob);
      }
    }
    else if (this.format === 'png' || this.format === 'jpeg') {
      const canvas = document.createElement('canvas');
      const player = new FlipnotePlayer(canvas, flipnote.width, flipnote.height);
      player.load(flipnote);
      for (let frameIndex = 0; frameIndex < flipnote.frameCount; frameIndex++) {
        player.setFrame(frameIndex);
        const dataUri = canvas.toDataURL(`image/${ this.format }`).split(',')[1];
        this.zip.file(`${ frameIndex.toString().padStart(3, '0') }.${ this.format }`, dataUri, { base64:true });
      }
    }
    return this;
  }

  saveAs(filename) {
    this.zip.generateAsync({ type: 'blob' })
    .then(blob => {
      saveAs(blob, filename);
    });
  }

}