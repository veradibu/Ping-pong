# Dibujando formas con canvas

```js

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


/* Dibujando otras formas con canvas */

ctx.fillStyle = "red";
ctx.beginPath();
ctx.moveTo(100,100);
ctx.lineTo(100,100);
ctx.lineTo(200,100);
ctx.lineTo(150,15);
ctx.fill();


ctx.fillStyle = "blue";
ctx.beginPath();
//       x   y   R  0°    360°      
ctx.arc(150,200,50,0, Math.PI * 2,false)
ctx.fill()


```


```js
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
canvas.style.backgroundColor = '#1c1c1c'



// funciones
function drawCircle(x,y){
  ctx.fillStyle = 'rgba(0, 255, 0, 1)';
  ctx.beginPath();
  ctx.arc(x,y,30,0, Math.PI*2,false);
  ctx.fill();
}

canvas.addEventListener('click', function(event){
   drawCircle(event.offsetX, event.offsetY);
})

```