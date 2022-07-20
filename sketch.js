// ABSTRACTED TONAL PENDULUMS (v2)

// Programed by Marlon Barrios Solano

// p5.js, tonal.js, tone.js

//  I generated a musical composition based on a series of oscillating pendulums. This work is inspired by Memo Akten's Simple Harmonic Motion series (https://lnkd.in/eseZ8GzX. It demonstrates how the interactions between simple objects (the pendulums) can produce complex behaviors. 

// Pendulums are driven using low frequency oscillators  with a random noise offset from the CENTER. The waves  go in and out of phase  creating complex patterns.  When the pendulum hits the  0 point or the center of the x axis it plucks a note from concatenated musical scales.

// When the app is started it randomly selects from these 7 scale types: 'major', 'minor', 'major pentatonic', 'minor pentatonic', 'egyptian', 'malkos raga', 'ritusen'.

// The number of pendulums is based in number of the selected scale type times 3; a min of 15 and a max of 21 pendulums and notes.

// A white circles  flashes every-time a note is plucked.

// The respective notes played are written in the pendulum rows left and right creating a visusl reprsentation of the scale.

// The app is responsive  to the browser size.

// Thanks to   David Bouchard's amazing Pendulum series.

// Live App here:

// https://lnkd.in/emPnMp8N

// #p5 #generativeart #generativesound #tonejs #tonaljs

let masterVolume = -9; // in decibel.
let ready = false;
let pendulums = [];//to make many pendulums
let mixer;
let scale;
let flavor;

let settings = {
  shuffleNotes: false,
}

let flavors = ['major', 'minor', 'major pentatonic', 'minor pentatonic', 'egyptian', 'malkos raga', 'ritusen'];


//------------------------------------------------------------
// Create a new canvas to match the browser size
function setup() {
  createCanvas(windowWidth, windowHeight);



}

//------------------------------------------------------------
// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//------------------------------------------------------------
// Main render loop
function draw() {
  background(64, 78, 92);





  if (ready) {
   
   // let pos = 0.5 - this.meter.getValue(0); //
fill(255)

  
text([flavor], width/2-300, height  - 20);


      for (let p of pendulums) {
      p.run();
      translate(0, height / (pendulums.length+1));
      
    }
  } else {
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    text("CLICK TO START", width / 2, height / 2);
    text("Headphones are Suggested", width / 2, height / 2 +20);
  }
}

//------------------------------------------------------------
function mousePressed() {
  if (!ready) {
    initializeAudio();
    ready = true;
 

    
  }  else
if (ready) {
    initializeAudio();
    ready = false;
    settings.shuffle = false;

  }
    
  }


//------------------------------------------------------------
function initializeAudio() {
  Tone.Master.volume.value = masterVolume;

  mixer = new Tone.Gain();

  let reverb = new Tone.Reverb({
    wet: 0.6, // half dry, half wet mix
    decay: 30 // decay time in seconds
  });

  // setup the audio chain:
  // mixer -> reverb -> Tone.Master
  // note that the synth object inside each pendulum get
  // connected to the mixer, so our final chain will look like:
  // synth(s) -> mixer -> reverb -> Tone.Master
  mixer.connect(reverb);
  reverb.toDestination();

  // quick way to get more notes: just glue 3 scales together
  // other 'flavours' to try:
  // major
  // minor
  // major pentatonic
  // the modes (eg: dorian, phrygian, etc..)
  // look at Tonal.ScaleType.names() to see a list of all supported
  // names

  let flavor = random(flavors);
  console.log([flavor]);
 
  scale = Tonal.Scale.get("C3 " + flavor).notes;
  scale = scale.concat(Tonal.Scale.get("C4 " + flavor).notes);
  scale = scale.concat(Tonal.Scale.get("C5 " + flavor).notes);

  // optional but fun: shuffle the scale array to mixup the notes

  Tonal.Collection.shuffle(scale);
 
  // create as many pendulums as we have notes in the scale[] array
  for (let i = 0; i < scale.length; i++) {
    pendulums[i] = new Pendulum(noise(100 + frameCount) + i * (1 / 60), scale[i]);
  }

}






//------------------------------------------------------------
class Pendulum {

  // runs when we call "= new Pendulum()"
  constructor(freq, note) {
    let pendulumOffset= noise(100 + frameCount);
    this.freq = freq * pendulumOffset;
    this.note = note;

    this.lfo = new Tone.LFO(this.freq);
    this.lfo.start(1); // creating a delayed start time by 1
    this.meter = new Tone.Meter();
    this.meter.normalRange = true; // 0-1
    this.lfo.connect(this.meter);

    this.synth = new Tone.Synth();
    this.synth.connect(mixer);

    this.prevPos = 0;
  }

  // Arbitrary name here. We could have called this function 'update'
  // or 'swing' or whatever.
  run() {
    let pos = 0.5 - this.meter.getValue(0); // -> -0.5 ~ 0.5
    
    let border = max(100, width/3 * 0.5);
    console.log(border); 
    let x = map(pos, -0.5, 0.5, border, width - border);

    let left = pos > 0 && this.prevPos < 0; // && --> AND
    let right = pos < 0 && this.prevPos > 0;
    if (right) {
    
    }
    if (left || right) {
      // || ---> OR
      // trigger a note
      this.synth.triggerAttackRelease(this.note, "8n");
  
    
     
    //  fill("white")
    fill('white')
  
     strokeWeight(3);
     stroke('white')
    ellipseMode(CENTER)
    ellipse(width/2, 50, 50, 50 )

    textSize(20)
    textAlign(CENTER, CENTER);
    fill('white');
    text(this.note, width/15, 50)

noFill();
    stroke('white');
    strokeWeight(3);
   ellipseMode(CENTER)
   ellipse(width/2, 50, 90, 90 )

    }
    this.prevPos = pos;

    // drawing code --> this could go in a separate function if we
    // wanted to, but I didn't bother in this case.

    // fill(255);

    textSize(15)
    textAlign(CENTER, CENTER);
    fill(217, 202, 179);
    text(this.note, width/15, 50)
    text(this.note, 14/15 * width, 50)
  
    fill(207, 18, 89);
    noStroke();
    line(width/2, 0, x, 50)
    ellipse(x, 50, 25, 25);
    

  }
  }

