const {dialog} = require('electron').remote;

let canvas = null,
  ctx = null,
  image = null;

const reloadCanvas = () => {
  // clear
  ctx.clearRect(0, 0, 1024, 1024);
  // set background
  let bgColor = document.getElementById("backgroundColor").value;
  if (bgColor) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 1024, 1024);
  }
  
  if (image) {
    
    let dx = 0,
      dy = 0,
      dw = 1024,
      dh = 1024,
      sx = 0,
      sy = 0,
      sw = image.width,
      sh = image.height;
    
    
    // gere le zoom
    
    // gere le left et le top
    
    // dessine l'image (paramètres)
    ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    
  }
  
}

window.addEventListener('DOMContentLoaded', () => {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  
  // Observe add file
  document.getElementById("buttonAddFile") && document.getElementById("buttonAddFile").addEventListener('click', evt => {
    dialog.showOpenDialog({
      title: 'Add file',
      defaultPath: "/home/apprenant",
      filters: [
        {name: 'Images', extensions: ['png', 'jpg']},
      ],
      properties: ['openfile']
    }).then(result => {
      
      if(!result.filePaths || !result.filePaths.length)
        return ;
      
      var img = new Image();
      img.onload = function () {
        image = img;
        reloadCanvas()
      };
      
      // ajoute une valeur à la variable img, ici notre image importée
      img.src = result.filePaths;
      
    }).catch(err => {
      console.log(err)
    })
    
  });
  
  // change form
  
  // Observer background color
  document.getElementById("backgroundColor") && document.getElementById("backgroundColor").addEventListener('input', evt => {
    reloadCanvas();
  })
  
  // Observer left
  
  // Observer top
  
  // Observer zoom
  
  // Observe border
  
  
  // Observe Save
  
  
  
})

