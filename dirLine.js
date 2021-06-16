class dirLine{

    

    
    constructor(index){
        

        this.direction = int(random(0,3));
        this.index = index;
        this.x = 0;
        this.y =0 ;


 
    }

    initialize(){

        if (this.direction == 0){
            this.x = -2;                                        //ouest
            this.y = random(0, height);
        }
    
        if (this.direction == 1){
            this.x = width+2;                                  
            this.y = random(0, height);                          //est
        }
    
        if (this.direction == 2){
            this.x = random(0, width);                                  
            this.y = -2;                                         //south
        }
    
        if (this.direction == 3){
    
            this.x = random(0,width);                                  
            this.y = height + 2;                            //north
        }
        print('here 1');
    }

 
  

 update(spectrum, freq){

    frameRate(10);
    stroke(1);
    strokeWeight(1);

    print('here 2');

   let goToPoint = createVector(this.x, this.y);

    if (this.direction == 0){
        goToPoint.x += spectrum[freq*this.index]/20;
        goToPoint.y += random(-4,4)*spectrum[freq*this.index]/20;
    }

    if (this.direction == 1){
        goToPoint.x -= spectrum[freq*this.index]/20;
        goToPoint.y += random(-4,4)*spectrum[freq*this.index]/20;

        
    }

    if (this.direction == 2){
        goToPoint.x += random(-4,4)*spectrum[freq*this.index]/20;
        goToPoint.y += spectrum[freq*this.index]/20;

        
    }

    if (this.direction == 3){
        goToPoint.x += random(-4,4)*spectrum[freq*this.index]/20;
        goToPoint.y -= spectrum[freq*this.index]/20;
        
    }

    //line(this.x, this.y, goToPoint.x, goToPoint.y);
    text(" creepy  ", this.x , this.y);

    this.x = goToPoint.x;
    this.y = goToPoint.y;

    //Make borders. Recreate the Line if it go out borders
    if(this.x > width +3 || this.x < -3 || this.y > height + 3 || this.y < -3){
        this.initialize();
    }
    



}



}



