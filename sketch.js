let slider;
let buttonControl;
let buttonRandom;

let amp;
let fft;
let volume;
let spectrum;
let freq;

let marginX = 20;
let marginY = 30;
let charWidth = 0 ;
let totalcharWidth = 10;

let choice = 1;
let font ;
let backColor;
let RbackColor = 116;
let GbackColor = 83;
let BbackColor = 116;
let color1 ;
let color2 ;
let color3 ;
let color4 ;
let choiceC ;

let infoBoxThickness = 80;
let pushText = 1;
let infoFontSize = 15;
let lineJump;
let down;

let energyMatrix = [];
let prevSpectrum = [];

let songsList = [];
let textsList = [];

const songPaths = [
  ['creepy.mp3',         'text1.txt'],
  ['funnysong.mp3',      'text2.txt'],
  ['psychedelic.mp3',    'text3.txt'],
  ['theduel.mp3',        'text4.txt'],
]

let currentSong;
let currentText;


// The rest is for the animation and the song playing
// Upload the songs and the infos here
function preload() {
  songsList = songPaths.map(p => loadSound(p[0]))
  textsList = songPaths.map(p => loadStrings(p[1]))
}


function setup() {
  createCanvas(700, 700);                       //Here, change the size of the window
  smooth();
  font = "carbon";                               // Here, change the font

  amp = new p5.Amplitude();
  fft = new p5.FFT();

  peakDetect = new p5.PeakDetect(0,20, 0.4);    //Here, change between wich and which Bin (0-1024) to get a peak, and the treshold (0-1.0)

  // For the "ColorChanger" changer
  color1 = color(178, 77, 178);                 // Here, change the color the background will have
  color2 = color(141, 84, 141);
  color3 = color(158, 97, 158);
  color4 = color(105, 58, 105);
  backColor = color(116,83,116);

  slider = createSlider(0, 1, 0.5, 0.1);
  // Set the Pause Play button
  buttonControl = createButton("Pause");
  buttonControl.mousePressed(pauseNplay);


  // Set the Songs buttons
  buttonRandom = createButton("random");
  buttonRandom.mousePressed(randomise);
}

//---------------------------------------------------------------------------------------------------------------------------------------------------

function draw() {
  //backColor = color(RbackColor, GbackColor, BbackColor);
  background(backColor);

  if (!currentSong)
    return

  currentSong.setVolume(slider.value())

  // I do not used the volume... but you never know
  volume = amp.getLevel();
  const factor = (volume / slider.value()) * 2
  console.log(slider.value(), volume, factor)
  backColor = getColor(factor)

  spectrum = fft.analyze();
  peakDetect.update(fft);
  fft.smooth(0.8);

  // if (peakDetect.isDetected){
  //   colorChanger2();
  // }

  // Used in the animation functions to have the letters of the song tittle separate
  const title = currentSong.file.replace('.mp3', '')
  freq = int(1024 / (title.length + 1))

  // The animation choice is made when "random button" is clicked
  if (choice == 0) wallPaperLetters(title);
  if (choice == 1) normalText(title);

  //textInfoSlide();                                   //Here, change the way the info text will be displayed
  textInfoAll();
}

function getColor(volume) {
  colorMode(HSL, 100);

  // hsl(300deg 17% 39%)

  const h = (300 / 360) * 100
  const c = color(
    h,
    17,
    40 + (50 * volume)
  )

  colorMode(RGB, 255);

  return c
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------


//---------------Button Functions----------------

function pauseNplay() {

  if (!currentSong.isPlaying()) {
    currentSong.play();
    buttonControl.html("Pause");
  }
  else{
    currentSong.pause();
    buttonControl.html("Play");
  }
}


function randomise(){

  background(backColor);

  buttonControl.html("Pause");

  if (currentSong)
    currentSong.stop();

  const index = floor(random(0, songsList.length))

  currentText = textsList[index];
  currentSong = songsList[index];
  currentSong.play();

  choice = int(random(0,2));

//Reset the position of the text when the "textInfoSlide" is the function activated
  pushText =0;

}


// ---------------- Animation Function -------------------------
function wallPaperLetters(songName) {
  background(backColor);
  fill(0);
  strokeWeight(1);

  const lineCount = 10

  // Array with numbers from 0-9
  const lines = Array.from({ length: lineCount }, (_, i) => i)
  // Array with letters
  const chars = songName.split('')

  textFont(font);

  lines.forEach(line => {

    chars.forEach((char, i) => {

      // The "i+1" is to cut out the first chunk of freq, because they are too fidgety
      textSize(spectrum[freq*(i+1)]);
      //angleRotation = PI/ i *10;

      push();
      const x = ((width-marginX*2)/chars.length) * i + 2*marginX 
      const y = ((height - infoBoxThickness - marginY)/lineCount)*line + marginY*2 + infoBoxThickness
      translate(x, y);
      // rotate(angleRotation);
      text(char, 0, 0);
      pop();
    })
  })
}

function normalText(songName) {
  background(backColor);
  textFont(font);
  fill(0);
  strokeWeight(1);




  for (let j = 0 ; j < songName.length -4 ; j++){

    charWidth += textWidth(songName[j]*2);

    push();
    translate((width-totalcharWidth)/2, (height-infoBoxThickness)/2 + infoBoxThickness);
    textAlign(CENTER);
    textSize(spectrum[freq*(j+1)]);
    text(songName[j], charWidth, 0);
    charWidth += textWidth(songName[j]);
    pop();

  }

// This is used to recenter the text in the "translate" function
  totalcharWidth = charWidth;
  charWidth = 0;

}




// -------------------------------------- Text Display function --------------------------------------------------

function textInfoSlide(){
    noStroke();
    fill(backColor);
    rect(0, 0 , width, infoBoxThickness);

    textSize(16);
    fill(0);
    color(0);

    if(mouseY < infoBoxThickness){
      if(mouseX > width/2){
        text(currentText, 20-pushText, 50);
      }

      pushText += 1 ;                                        // Change the rate of the moving text here
    }

// if the mouse is not up in the window, the text is stable
    else text(currentText, 20-pushText, 50);

}





function textInfoAll() {

  lineJump =17;                                                     // Change here the space in between each line

  noStroke();
  fill(backColor);
  rect(0, 0 , width, infoBoxThickness);
  textAlign(CENTER)                                                 // Change here the allignment of the text (CENTER) (RIGTH) or (LEFT)
  textSize(infoFontSize);
  fill(0);
  color(0);

  for(let h = 0; h < currentText.length ; h++){

    text(currentText[h], width/2, marginX + lineJump * h);


  // Ajust the height of the info box to the size of the text
    if((marginX + (lineJump + infoFontSize)*h)  >= infoBoxThickness){
      infoBoxThickness += 2;
    }

    if((marginX + (lineJump + infoFontSize)*h)  < infoBoxThickness){
      infoBoxThickness -= 2;
    }
  }
}



  function colorChanger2(){


    choiceC = int(random(0,4));
//These colors are preset in the top of the code
    if(choiceC  == 0) backColor = color1;
    if(choiceC  == 1) backColor = color2;
    if(choiceC  == 2) backColor = color3;
    if(choiceC  == 3) backColor = color4;

  }


function mostEnergyBinFinder(){

  let rate = sampleRate();
  let amountLoops = rate*duration;
  let freqLevel = new Array();
  let energySum = new Array();
  let nbBins = 1024;
  let mostEnergyBin;
  duration = currentSong.duration();


  for(let b = 0 ; b < amountLoops ; b++){
    energyMatrix[b] = new Array(spectrum.length);
    for(let v = 0 ; v < nbBins; v++){

      freqLevel = fft.analyze();

      energyMatrix[b][v] = freqLevel[v];
    }
  }


  for (let v =0; v < nbBins; v ++){
      for(let b = 0 ; b < amountLoops ; b++){

          energySum[v] += energyMatrix[k][v];

        }
    }


    for(let v = 1 ; v < nbBins ; v++){
      if(energySum[v] > energySum[v-1]){
        mostEnergyBin = energySum[v];
      }
    }

    return mostEnergyBin;


}








