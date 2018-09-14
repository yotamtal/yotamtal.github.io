// var path = document.querySelector(".st3");
// var total_length = path.getTotalLength();
// console.log(total_length); 

// ANIMATIONS
// ===========================================================================
var nodes  = document.querySelectorAll(".item");
var total  = nodes.length;
var dirty  = true;
var time   = 0.9;
var omega  = 12;
var zeta   = 0.9;
var boxes  = [];
 
for (var i = 0; i < total; i++) {
    
  var node   = nodes[i];  
  var width  = node.getBoundingClientRect().width;
  var height = node.getBoundingClientRect().height;    
  var color  = "transparent";    

  // Need another element to animate width & height... use clone instead of editing HTML
  var content = node.cloneNode(true);
  content.classList.add("item-content");
  
  TweenLite.set(node, { x: "+=0" });
  TweenLite.set(content, { width, height });  
  TweenLite.set([node, node.children], { backgroundColor: color, color });
  
  node.appendChild(content);
    
  var transform = node._gsTransform;
  var x = node.getBoundingClientRect().x;
  var y = node.getBoundingClientRect().y;
  
  boxes[i] = { content, height, node, transform, width, x, y };
} 

window.addEventListener("resize", () => { dirty = true; });

TweenLite.ticker.addEventListener("tick", () => dirty && layout());

layout();

function layout() {
  
  dirty = false;
  
  for (var i = 0; i < total; i++) {
    
    var box = boxes[i];
        
    var lastX = box.x;
    var lastY = box.y;   
       
    var lastW = box.width;
    var lastH = box.height;     
    
    var width  = box.width  = box.node.getBoundingClientRect().width;
    var height = box.height = box.node.getBoundingClientRect().height;
    
    box.x = box.node.getBoundingClientRect().x;
    box.y = box.node.getBoundingClientRect().y;      
        
    if (lastX !== box.x || lastY !== box.y) {
      
      var x = box.transform.x + lastX - box.x;
      var y = box.transform.y + lastY - box.y;  
      
      // Tween to 0 to remove the transforms
      TweenLite.set(box.node, { x, y });
      TweenLite.to(box.node, time, { x: 0, y: 0, ease });
    }
          
    if (lastW !== box.width || lastH !== box.height) {      
      
      TweenLite.to(box.content, time, { autoRound: false, width, height, ease });      
    }
  }  
} 

function ease(progress) {
  var beta  = Math.sqrt(1.0 - zeta * zeta);
  progress = 1 - Math.cos(progress * Math.PI / 2);   
  progress = 1 / beta * 
    Math.exp(-zeta * omega * progress) * 
    Math.sin( beta * omega * progress + Math.atan(beta / zeta));

  return 1 - progress;
}

setTimeout(function(){
  let logo = document.querySelector(".flex-container");
  logo.classList.remove('justify-center');
  logo.classList.add('justify-start');
  logo.classList.remove('align-items-center');
  logo.classList.remove('align-items-start');
  layout();
},5000)