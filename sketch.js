let slider;
let buttonControl;
let buttonRandom;

let numberOfSongs = 3;
let numberOfTexts = 3;
let currentSong;

let amp;
let fft;
let volume;
let spectrum;
let freq;

let marginX = 20;
let marginY = 30;
let charWidth = 0 ;
let totalcharWidth = 10;
let splitString ;

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

let energyMatrix = new Array();
let prevSpectrum = new Array();

let songsList = new Array(numberOfSongs);
let textsList = new Array(numberOfTexts);


// Arrays and variable for advancingLine function
let numberOfLines = 7;
let myLines = new Array(numberOfLines);








// The rest is for the animation and the song playing
// Upload the songs and the infos here
function preload() {
  songsList[0] = loadSound('creepy.mp3');
  songsList[1] = loadSound('funnysong.mp3');
  songsList[2] = loadSound('theduel.mp3');
  textsList[0] = loadStrings("text1.txt");
  textsList[1] = loadStrings("text2.txt");
  textsList[2] = loadStrings("text3.txt");
}


function setup() {
  createCanvas(700, 700);                       //Here, change the size of the window
  smooth();
  font = "carbon";                               // Here, change the font




  amp = new p5.Amplitude();

  fft = new p5.FFT();

  peakDetect = new p5.PeakDetect(0,20, 0.4);    //Here, change between wich and which Bin (0-1024) to get a peak, and the treshold (0-1.0)

//For the "ColorChanger" changer
  color1 = color(178, 77, 178);                 // Here, change the color the background will have
  color2 = color(141, 84, 141);
  color3 = color(158, 97, 158);
  color4 = color(105, 58, 105);
  backColor = color(116,83,116);

  slider = createSlider(0, 1, 0.5, 0.1);
//Set the Pause Play button
  buttonControl = createButton("Pause");
  buttonControl.mousePressed(pauseNplay);


  // Set the Songs buttons
  buttonRandom = createButton("random");
  buttonRandom.mousePressed(randomise);

  currentSong = 2;                              // Here, change the song that will first play
  songsList[currentSong].play();

}




//---------------------------------------------------------------------------------------------------------------------------------------------------


function draw() {


  //backColor = color(RbackColor, GbackColor, BbackColor);
  background(backColor);



  songsList[currentSong].setVolume(slider.value());
//I do not used the volume... but you never know
  volume = amp.getLevel();

  spectrum = fft.analyze();
  peakDetect.update(fft);
  fft.smooth(0.8);

  if(peakDetect.isDetected){
    colorChanger2();
  }

// Used in the animation functions to have the letters of the song tittle separate
  splitString = songsList[currentSong].file.split("");
  freq = int(1024 / (splitString.length+1));

// The animation choice is made when "random button" is clicked
  if( choice == 0)wallPaperLetters();
  if( choice == 1)normalText();

  //textInfoSlide();                                   //Here, change the way the info text will be displayed
  textInfoAll();





}


// ------------------------------------------------------------------------------------------------------------------------------------------------------




//---------------Button Functions----------------

function pauseNplay() {

  if (!songsList[currentSong].isPlaying()) {
    songsList[currentSong].play();
    buttonControl.html("Pause");
  }
  else{
    songsList[currentSong].pause();
    buttonControl.html("Play");
  }
}


function randomise(){

  background(backColor);
  songsList[currentSong].stop();
  buttonControl.html("Pause");
  currentSong = floor(random(0,3));
  songsList[currentSong].play();

  choice = int(random(0,2));

//Reset the position of the text when the "textInfoSlide" is the function activated
  pushText =0;

}







// ---------------- Animation Function -------------------------
function wallPaperLetters(){

  background(backColor);
  fill(0);
  strokeWeight(1);
  let i;
  let nbLetterX = (splitString.length );
  let nbLetterY = 10;

  textFont(font);

  for( let j = 0 ; j < nbLetterY; j ++){
    for(let m = 0 ; m < nbLetterX; m ++){

 // The "i+1" is to cut out the first chunk of freq, because they are too fidgety
      textSize(spectrum[freq*(i+1)]);
      //angleRotation = PI/ i *10;


      push();
      translate(((width-marginX*2)/nbLetterX) * m + 2*marginX , ((height - infoBoxThickness - marginY)/nbLetterY)*j + marginY*2 + infoBoxThickness );
     // rotate(angleRotation);
      text(splitString[i], 0, 0);
      pop();

 // "-5" to erase the ".mp3" letters from the song tittle
      if((i +1) < splitString.length-4) i++;
      else i = 0;    }

  }
}



function normalText(){

  background(backColor);
  textFont(font);
  fill(0);
  strokeWeight(1);




  for (let j = 0 ; j < splitString.length -4 ; j++){

    charWidth += textWidth(splitString[j]*2);

    push();
    translate((width-totalcharWidth)/2, (height-infoBoxThickness)/2 + infoBoxThickness);
    textAlign(CENTER);
    textSize(spectrum[freq*(j+1)]);
    text(splitString[j], charWidth, 0);
    charWidth += textWidth(splitString[j]);
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
        text(textsList[currentSong], 20-pushText, 50);
      }

      pushText += 1 ;                                        // Change the rate of the moving text here
    }

// if the mouse is not up in the window, the text is stable
    else text(textsList[currentSong], 20-pushText, 50);

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

  for(let h = 0; h < textsList[currentSong].length ; h++){

    text(textsList[currentSong][h], width/2, marginX + lineJump * h);


  // Ajust the height of the info box to the size of the text
    if((marginX + (lineJump + infoFontSize)*h)  >= infoBoxThickness){
      infoBoxThickness += 2;
    }

    if((marginX + (lineJump + infoFontSize)*h)  < infoBoxThickness){
      infoBoxThickness -= 2;
    }
  }
}



 function colorChanger1(){

  let spectIndex = 200;
  let spectChange = spectrum[spectIndex]/10;


   if (prevSpectrum[spectIndex] < spectrum[spectIndex]){
      RbackColor -=  spectChange;
      GbackColor -=  spectChange;
      BbackColor -=  spectChange;
   }

   else if (prevSpectrum[spectIndex] > spectrum[spectIndex]){
      RbackColor +=  spectChange;
      GbackColor += spectChange ;
      BbackColor += spectChange ;
    }

    // if(prevSpectrum[spectIndex] == spectrum[spectIndex]){
    //   RbackColor =  116;
    //   GbackColor = 83;
    //   BbackColor = 116;
    // }
    prevSpectrum[spectIndex] = spectrum[spectIndex];

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
  duration = songsList[currentSong].duration();


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








