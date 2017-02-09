var max =16;
var min = 15;
var leftNow = 15;
dir = 1;
var dirLen = 12;
var dirC = 0;
var colorTarget = 'b';
var pentatonic_scale = getScaleIntervals(12/5);
dirLen = pentatonic_scale.length
var curveLength = 1;
var dist = 1.61803398875;
var lightScale = [0,12];
var lightScaleCount = 0;
var sIRate = 1;
function startStrobe(){
  if(typeof bb != "undefined" && typeof app.osciFreq != "undefined"){
  var sI = setInterval(function(){
    
      var inter = dirC < dirLen ? pentatonic_scale[dirC]/(dist*500) : pentatonic_scale[0];
      dirC = dirC < dirLen ? dirC+1 : 0;

      bb.right_osci.frequency.value = leftNow+dist;
      bb.left_osci.frequency.value = leftNow;
      dir = leftNow > max ? -1 : leftNow < min ? 1 : dir;
      var randSel = Math.floor(Math.random() * 3);
      if(leftNow > max){
        var a = ['r','g','b'];
        colorTarget = a[randSel];
      }
      leftNow += inter*dir;
      $('#log').html(leftNow)
      if(typeof bb.material.isWhite == "undefined") bb.material.isWhite = 0;
      bb.material.isWhite += 1;
      if(bb.material.isWhite % 2 == 0){
        bb.material.color = new THREE.Color(0x111111);
        
      }
      else{
        bb.material.color = new THREE.Color(0xffffff);
      }
      
      bb.material.color[colorTarget] = bb.map(leftNow,min,max,0.9,1);
      
      bb.directionalLight.intensity = bb.map(lightScale[lightScaleCount],lightScale.min(),lightScale.max(),0.8,0.2);
      
      lightScaleCount = lightScaleCount >= lightScale.length ? 0 : lightScaleCount+1;
  //}
  },(1/40)*1000);
  }
  
}


function getScaleIntervals(c) {
  var tot = 0;
  var scale = [];

  while(tot <= 12){
    scale.push(Math.round(tot));
    tot += c;
  }
  return scale;
}

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};