BinauralBeat = function(leftear, rightear) {

  this.leapMotion = false; //is leap motion
  //this.isRift = true;//true;//is oculus rift?|
  this.isRift = false;
  this.playing = false;
  window.AudioContext = window.AudioContext||window.webkitAudioContext
  this.audioContext = new AudioContext();
  
  this.gainNodeL = this.audioContext.createGain();
  this.gainNodeR = this.audioContext.createGain();
  this.analyserL = this.audioContext.createAnalyser();
  this.analyserR = this.audioContext.createAnalyser();
  this.analyserL.connect(this.gainNodeL);
  this.analyserR.connect(this.gainNodeR);
  this.audioContext.listener.setPosition(0, 0, 0);
  this.audioContext.listener.setOrientation(0, 1, 0, 0, 0, 1);
  if(typeof this.audioContext.setVelocity != "undefined"){
    this.audioContext.listener.setVelocity(0,0,0);
  }
  this.droneFilter = this.audioContext.createBiquadFilter();
  this.droneFilter.connect(this.audioContext.destination);
  this.droneFilter.frequency.value = 22;
  

  this.leftDrone = this.audioContext.createOscillator();
  this.leftDrone.type ='sine';
  this.leftDrone.frequency.value = 20;
  this.leftDrone.connect(this.droneFilter);
  this.rightDrone = this.audioContext.createOscillator();
  this.rightDrone.frequency.value = 20.10;
  this.rightDrone.type ='sine';
  this.rightDrone.connect(this.droneFilter)
  this.left_panner = this.audioContext.createPanner();
  this.left_panner.setPosition(-1, 0, 0);
  this.left_panner.setOrientation(1, 0, 0);

  this.left_osci = this.audioContext.createOscillator();
  this.left_osci.type = 'sine';
  this.left_osci.frequency.value = leftear;
  this.left_osci.connect(this.gainNodeL);
  this.gainNodeL.gain.value = 1.0;
  this.gainNodeR.gain.value = 1.0;
  this.gainNodeL.connect(this.audioContext.destination);
  this.gainNodeR.connect(this.audioContext.destination);
  this.right_panner = this.audioContext.createPanner();
  this.right_panner.setPosition(1, 0, 0);
  this.right_panner.setOrientation(-1, 0, 0);
  
  this.right_osci = this.audioContext.createOscillator();
  this.right_osci.type = 'sine';
  this.right_osci.frequency.value = rightear;
  this.right_osci.connect(this.gainNodeR);
  
  // Create the filter
  this.right_filter = this.audioContext.createBiquadFilter();
  // Create the audio graph.
  this.right_osci.connect(this.right_filter);
  this.right_filter.connect(/*this.audioContext.destination*/this.right_panner);
  // Create and specify parameters for the low-pass filter.
  this.right_filter.type = 'bandpass'; // Low-pass filter. See BiquadFilterNode docs
  this.right_filter.frequency.value = 40; // Set cutoff to 440 HZ
  // Playback the sound.
  // Create the filter
  this.left_filter = this.audioContext.createBiquadFilter();
  // Create the audio graph.
  this.left_osci.connect(this.left_filter);
  this.left_filter.connect(/*this.audioContext.destination*/this.left_panner);
  // Create and specify parameters for the low-pass filter.
  this.left_filter.type = 'bandpass'; // Low-pass filter. See BiquadFilterNode docs
  this.left_filter.frequency.value = 43.5; // Set cutoff to 440 HZ
  
  var curveLength = 10;
  var curve1 = new Float32Array(curveLength);
  var curve2 = new Float32Array(curveLength);
  for (var i = 0; i < curveLength; i++)
      curve1[i] = Math.sin(Math.PI * i / curveLength);
   
  for (var i = 0; i < curveLength; i++)
      curve2[i] = Math.cos(Math.PI * i / curveLength);
  
  this.left_osci.connect(this.left_panner);
  this.right_osci.connect(this.right_panner);
  this.left_panner.connect(this.audioContext.destination);
  this.right_panner.connect(this.audioContext.destination);
  this.playpause();
  var that = this;
  setTimeout(function(){
    that.initThree();
  },100)
  
};
BinauralBeat.prototype.map = function(value, istart, istop, ostart, ostop) {
          return ostart + (ostop - ostart) * ((value - istart) / (istop - istart))
        };
BinauralBeat.prototype.playpause = function() {
  if(!this.playing) {
    //this.left_osci.noteOn(0);
    this.left_osci.start();
    //this.rightDrone.noteOn(0);
    this.rightDrone.start();
    //this.leftDrone.noteOn(0);
    this.leftDrone.start();
    //this.right_osci.noteOn(0);
    this.right_osci.start();
  } else {
    //this.left_osci.noteOff(0);
    this.left_osci.stop();
    //this.right_osci.noteOff(0);
    this.right_osci.stop();
  }
  this.playing = !this.playing;
};
BinauralBeat.prototype.initThree = function(){
  console.log('initing three')


    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1,1000 );
      this.camera.position =  new THREE.Vector3(0,0,0);

      this.scene = new THREE.Scene();

      this.geometry = new THREE.SphereGeometry( 20,20,20 );
      this.material = new THREE.MeshLambertMaterial( { shininess: 0.5,side: THREE.DoubleSide,color: 0xff0000 } );
      this.directionalLight = new THREE.DirectionalLight( 0xffffff, 0.55 ); this.directionalLight.position.set( 0,0,10 ); 
      this.scene.add( this.directionalLight );
      var dl2 = new THREE.DirectionalLight(0xffffff,0.25);
      dl2.position.set(0,0,-10);
      this.scene.add(dl2);
      this.mesh = new THREE.Mesh( this.geometry, this.material );
      this.mesh.scale = new THREE.Vector3(50,50,50);
      this.scene.add( this.mesh );
    // container
      this.container = document.createElement('div');
      document.body.appendChild(this.container);

      // renderer
      this.renderer = new THREE.WebGLRenderer(this.scene,this.camera);
      this.renderer.autoClear = false;
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.container.appendChild(this.renderer.domElement);
      this.effect = new THREE.StereoEffect( this.renderer );
      this.effect.setSize( window.innerWidth, window.innerHeight );
    
    if(this.leapMotion){
        this.leapControls = new LeapControls;
        this.leapControls.initController(this.controls);
    }
    this.initRiftCam();
    

    
    this.animate();
}
BinauralBeat.prototype.initRiftCam = function(){
  var _this = this;
  this.oculusWindowListener = window.addEventListener('resize', onResize, false);

  function onResize() {
    windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);
    aspectRatio = window.innerWidth / window.innerHeight;
   
    _this.camera.aspect = aspectRatio;
    _this.camera.updateProjectionMatrix();
   
    _this.renderer.setSize(window.innerWidth, window.innerHeight);
    _this.effect.setSize( window.innerWidth, window.innerHeight );
  }

  this.time          = Date.now();
  this.bodyAngle     = 0;
  this.bodyAxis      = new THREE.Vector3(0, 1, 0);
  this.bodyPosition  = new THREE.Vector3(0, 15, 0);
  this.velocity      = new THREE.Vector3();

  onResize();
}
BinauralBeat.prototype.resetView = function(){
    var _this = this;
    
}
BinauralBeat.prototype.animate = function(){
  var _this = this;
  this.mesh.rotation.x += 0.0001;
  this.mesh.rotation.y += 0.0001;
  requestAnimationFrame(function(){_this.animate();})
  this.effect.render(this.scene,this.camera)
        
}