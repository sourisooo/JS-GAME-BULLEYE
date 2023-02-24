window.addEventListener('load', function()
{
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 1280;
canvas.height = 720;

ctx.fillStyle='red';
ctx.lineWidth=3;
ctx.strokeStyle='white';
ctx.font='40px Bangers';
ctx.textAlign = 'center';


class Player {

    constructor(game){
        this.game = game;
        this.collisionX = this.game.width*0.5;
        this.collisionY = this.game.width*0.5;
        this.collisionRadius=30;
        this.speedX=0;
        this.speedY=0;
        this.dx=0;
        this.dy=0;
        this.speedModifier=3;
        this.spriteWidth=255;
        this.spriteHeight=255;
        this.width=this.spriteWidth;
        this.height=this.spriteHeight;
        this.spriteX;
        this.spriteY;
        this.frameX=0;
        this.frameY=5;
        this.image=document.getElementById('bull');

    }
    draw(context){
        context.drawImage(this.image,this.frameX*this.spriteWidth,this.frameY*this.spriteHeight,this.spriteWidth,this.spriteHeight,this.spriteX,this.spriteY,this.width,this.height)
        context.beginPath();
        context.arc(this.collisionX,this.collisionY,this.collisionRadius,0,Math.PI*2);
        context.save();
        context.globalAlpha=0.5;
        context.fill();
        context.restore();
        context.stroke();

        if (this.game.debug)
        {
        context.beginPath();
        context.moveTo(this.collisionX, this.collisionY);
        context.lineTo(this.game.mouse.x, this.game.mouse.y);
        context.stroke();
        }
    }

    update(){

       
        this.dx=this.game.mouse.x-this.collisionX;
        this.dy=this.game.mouse.y-this.collisionY;

        const angle = Math.atan2(this.dy,this.dx);
        if (angle<-2.74|| angle>2.74) this.frameY=6;
        else  if (angle<-1.96) this.frameY=7;
        else  if (angle<-1.17) this.frameY=0;
        else  if (angle<-0.39) this.frameY=1;
        else  if (angle<0.39) this.frameY=2;
        else  if (angle<1.17) this.frameY=3;
        else  if (angle<1.96) this.frameY=4;
        else  if (angle<2.74) this.frameY=5;
       


        const distance = Math.hypot(this.dy, this.dx);
        if (distance > this.speedModifier)
        {
            this.speedX=this.dx/distance || 0;
            this.speedY=this.dy/distance || 0;
        }
            else

        {
            this.speedX=0;
            this.speedY=0;

        }

        // this.collisionX = this.game.mouse.x;
        // this.collisionY = this.game.mouse.y;

        this.collisionX += this.speedX*this.speedModifier;
        this.collisionY += this.speedY*this.speedModifier;
        this.spriteX=this.collisionX-this.width*0.5;
        this.spriteY=this.collisionY-this.height*0.5-100;

        if (this.collisionX<0+this.collisionRadius)
        this.collisionX=0+this.collisionRadius;

        else if (this.collisionX>this.game.width-this.collisionRadius)
        this.collisionX=this.game.width-this.collisionRadius;

        if(this.collisionY<0+this.game.topMargin+this.collisionRadius)
        this.collisionY=0+this.game.topMargin+this.collisionRadius;

        else if (this.collisionY > this.game.height-this.collisionRadius)
        this.collisionY=this.game.height-this.collisionRadius;
    
        this.game.obstacles.forEach(obstacle =>{
            // this.game.checkCollision(this, obstacle);

            let [collision,distance,sumofRadii,dx,dy] = 
            this.game.checkCollision(this, obstacle);

            if (collision){
                const unit_x =dx/distance;
                const unit_y =dy/distance;
                this.collisionX=obstacle.collisionX+(sumofRadii+1)*unit_x;
                this.collisionY=obstacle.collisionY+(sumofRadii+1)*unit_y;



            }

        });
    }

    restart(){

        this.collisionX = this.game.width*0.5;
        this.collisionY = this.game.width*0.5;
        this.spriteX=this.collisionX-this.width*0.5;
        this.spriteY=this.collisionY-this.height*0.5;

    }


}


class Obstacle {
    constructor(game){
    this.game=game;
    this.collisionX =Math.random() * this.game.width;
    this.collisionY =Math.random() * this.game.height;
     this.collisionRadius=40;
    this.image = document.getElementById('obstacles');
    this.spriteWidth=250;
    this.spriteHeight=250;
    this.width=this.spriteWidth;
    this.height=this.spriteHeight;
    this.spriteX=this.collisionX-this.width*0.5;
    this.spriteY=this.collisionY-this.height*0.5;
    this.frameX=Math.floor(Math.random()*4);
    this.frameY=Math.floor(Math.random()*3);

    }
    
    draw(context) {
        context.drawImage(this.image,this.frameX*this.spriteWidth,this.frameY*this.spriteHeight,this.spriteWidth,this.spriteHeight, this.spriteX, this.spriteY,this.width,this.height);
        
        if (this.game.debug)
        {

        context.beginPath();
        context.arc(this.collisionX,this.collisionY,this.collisionRadius,0,Math.PI*2);
        context.save();
        context.globalAlpha=0.5;
        context.fill();
        context.restore();
        context.stroke();

         }
    }
    
    update(){

    }


    }


    class Egg{

        constructor(game){
            this.game=game;
            this.collisionRadius=40;
            this.margin=this.collisionRadius*2;
            this.collisionX=this.margin+Math.random()*(this.game.width-this.margin*2);
            this.collisionY=this.game.topMargin+Math.random()*(this.game.height-this.game.topMargin-this.margin);
            this.image=document.getElementById('egg');
            this.spriteWidth=110;
            this.spriteHeight=135;
            this.width=this.spriteWidth;
            this.height=this.spriteHeight;
            this.spriteX;
            this.spriteY;
            this.hatchTimer=0;
            this.hatchInterval=6000;
            this.markedForDeletion=false;

            
        }

        draw(context){
            context.drawImage(this.image,this.spriteX,this.spriteY);

            if (this.game.debug)
            {
    
            context.beginPath();
            context.arc(this.collisionX,this.collisionY,this.collisionRadius,0,Math.PI*2);
            context.save();
            context.globalAlpha=0.5;
            context.fill();
            context.restore();
            context.stroke();
            const displayTimer = (this.hatchTimer*0.001).toFixed(0);
            context.fillText(displayTimer,this.collisionX,this.collisionY-this.collisionRadius*2.5);
    
             }
            
        }

        update(deltaTime){

            this.spriteX=this.collisionX-this.width*0.5;
            this.spriteY=this.collisionY-this.height*0.5-30;

            let collisionObjets = [this.game.player,...this.game.obstacles,...this.game.enemies];
            collisionObjets.forEach(object => {

                let [collision, distance, sumofRadii, dx, dy] =this.game.checkCollision(this,object);

                if (collision){
                    const unit_x = dx/distance;
                    const unit_y = dy/distance;
                    this.collisionX=object.collisionX+(sumofRadii+1)*unit_x;
                    this.collisionY=object.collisionY+(sumofRadii+1)*unit_y;

                }

            });

            if (this.hatchTimer>this.hatchInterval || this.collisionY<this.game.topMargin) 
            {
                this.game.hatchlings.push(new Larva(this.game, this.collisionX, this.collisionY));
                this.markedForDeletion=true;
                this.game.removeGameObjects();
                // console.log(this.game.eggs);
               
            } 
            else {this.hatchTimer += deltaTime;}

        }

    }

class Larva{
    constructor(game,x,y){
        this.game=game;
        this.collisionX=x;
        this.collisionY=y;
        this.collisionRadius=30;
        this.image=document.getElementById('larva');
        this.spriteWidth=150;
        this.spriteHeight=150;
        this.width=this.spriteWidth;
        this.height=this.spriteHeight;
        this.spriteX;
        this.spriteY;
        this.speedY=2+Math.random();
        this.frameY=Math.floor(Math.random()*2);
        this.frameX=0;

}

    draw(context){

        context.drawImage(this.image,this.frameX*this.spriteWidth,this.frameY*this.spriteHeight,this.spriteWidth,this.spriteHeight ,this.spriteX,this.spriteY,this.width,this.height);


        if (this.game.debug)
        {

        context.beginPath();
        context.arc(this.collisionX,this.collisionY,this.collisionRadius,0,Math.PI*2);
        context.save();
        context.globalAlpha=0.5;
        context.fill();
        context.restore();
        context.stroke();

         }

    }


    update(){

        this.collisionY -= this.speedY;
        this.spriteX=this.collisionX-this.width*0.5;
        this.spriteY=this.collisionY-this.height*0.5-50;

        if (this.collisionY<this.game.topMargin)
        {
            this.markedForDeletion=true;
            this.game.removeGameObjects();
            if(!this.game.gameOver)this.game.score++;

            this.game.score++;
            for (let i=0; i<3;i++)
            {
            this.game.particles.push(new Firefly(this.game, this.collisionX, this.collisionY,'red'));
            }
       
        }


        let collisionObjets = [this.game.player,...this.game.obstacles,...this.game.eggs];
        collisionObjets.forEach(object => {

            let [collision, distance, sumofRadii, dx, dy] =this.game.checkCollision(this,object);

            if (collision)
            
            {
                const unit_x = dx/distance;
                const unit_y = dy/distance;
                this.collisionX=object.collisionX+(sumofRadii+1)*unit_x;
                this.collisionY=object.collisionY+(sumofRadii+1)*unit_y;

                for (let i=0; i<3;i++)
                {
                this.game.particles.push(new Spark(this.game, this.collisionX, this.collisionY,'blue'));
                }

            }

        });

        this.game.enemies.forEach(enemy => 
            
            {

                if(this.game.checkCollision(this,enemy)[0])

                {
                    this.markedForDeletion=true;
                    this.game.removeGameObjects();
                    this.game.lostHatchling++;

                    for (let i=0; i<3;i++)
                    {
                    this.game.particles.push(new Spark(this.game, this.collisionX, this.collisionY,'green'));
                    }

                }

            }
            
            );


    }



}



class Enemy {
    constructor(game){
        this.game=game;
        this.collisionRadius=30;
        this.speedX=Math.random()*3+5;
        this.image=document.getElementById('toad');
        // this.image=document.getElementById('toads');
        this.spriteWidth=140;
        this.spriteHeight=260;
        this.width=this.spriteWidth;
        this.Height=this.spriteHeight;
        this.collisionX=this.game.width+this.width+Math.random()*this.game.width*0.5;
        this.collisionY=this.game.topMargin+Math.random()*(this.game.height-this.game.topMargin);
        this.spriteX;
        this.spriteY;
        this.frameX=0;
        this.frameY=Math.floor(Math.random()*4);

    }

    draw(context){
        context.drawImage(this.image,this.spriteX,this.spriteY);
        // context.drawImage(this.image,0,this.frameY,this.spriteWidth,this.spriteHeight,this.spriteX,this.spriteY,this.width,this.height);

        if (this.game.debug)
        {

        context.beginPath();
        context.arc(this.collisionX,this.collisionY,this.collisionRadius,0,Math.PI*2);
        context.save();
        context.globalAlpha=0.5;
        context.fill();
        context.restore();
        context.stroke();

         }

    }

    update(){

        this.spriteX=this.collisionX-this.width*0.5;
        this.spriteY=this.collisionY-this.Height*0.5+40;

    this.collisionX -=this.speedX;
    if(this.spriteX+this.width<0 && !this.game.gameOver)
    {
        this.collisionX=this.game.width+this.width+Math.random()*this.game.width*0.5;
        this.collisionY=this.game.topMargin+Math.random()*(this.game.height-this.game.topMargin);
        // this.frameY=Math.floor(Math.random()*4);
    }

    let collisionObjets = [this.game.player,...this.game.obstacles];
    collisionObjets.forEach(object => {

        let [collision, distance, sumofRadii, dx, dy] =this.game.checkCollision(this,object);

        if (collision){
            const unit_x = dx/distance;
            const unit_y = dy/distance;
            this.collisionX=object.collisionX+(sumofRadii+1)*unit_x;
            this.collisionY=object.collisionY+(sumofRadii+1)*unit_y;

        }

    });
    


    }

}



class Particle {
constructor(game,x,y,color){
    this.game=game;
    this.collisionX=x;
    this.collisionY=y;
    this.color=color;
    this.radius=Math.floor(Math.random()*10+5);
    this.speedX=Math.random()*6-3;
    this.speedY=Math.random()*2+0.5;
    this.angle=0;
    this.va=Math.random()*0.1+0.01;
    this.markedForDeletion=false;
    
}

    draw(context){

        context.save();
        context.fillStyle=this.color;
        context.beginPath();
        context.arc(this.collisionX,this.collisionY,this.radius,0,Math.PI*2);
        context.fill();
        context.stroke();
        context.restore();
       

    }

}

class Firefly extends Particle {
    update(){
        this.angle += this.va;
        this.collisionX += Math.cos(this.angle)*this.speedX;
        this.collisionY -= this.speedY;
        if(this.collisionY<0-this.radius)
        {
            this.markedForDeletion=true;
            this.game.removeGameObjects();

        }

    }

}

class Spark extends Particle {
    update(){
        this.angle += this.va*0.5;
        this.collisionX -= Math.cos(this.angle)*this.speedX;
        this.collisionY -= Math.sin(this.angle)*this.speedY;
        if(this.radius>0.1)this.radius-=0.05;
        if(this.radius<0.2)
        {
            this.markedForDeletion=true;
            this.game.removeGameObjects();
        }
    }

    

}


class Game {

    constructor(canvas){
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.player = new Player(this);
        this.mouse = {

            x: this.width*0.5,
            y: this.height*0.5,
            pressed: false,

        };

        this.obstacles= [];
        this.numberofObstacles=5;
        this.topMargin=260;
        this.debug=true;
        this.fps=120;
        this.timer=0;
        this.interval=1000/this.fps;
        this.eggs=[];
        this.maxEggs=4;
        this.eggTimer=0;
        this.eggInterval=1000;
        this.gameObjects = [];
        this.enemies = [];
        this.hatchlings = [];
        this.score=0;
        this.lostHatchling=0;
        this.particles= [];
        this.winningCondition=30;
        this.gameOver=false;
        

        canvas.addEventListener('mousedown', (e) => {
            this.mouse.x=(e.offsetX);
            this.mouse.y=(e.offsetY);
            this.mouse.pressed = true;

        });


        canvas.addEventListener('mouseup', (e) => {
            this.mouse.x=(e.offsetX);
            this.mouse.y=(e.offsetY);
            this.mouse.pressed = false;

        });

        canvas.addEventListener('mousemove', (e) => {
            this.mouse.x=(e.offsetX);
            this.mouse.y=(e.offsetY);
            

        });
    
        window.addEventListener('keydown', (e) => {
            if (e.key == "d") this.debug = !this.debug;

            if (e.key == "r" && this.gameOver) this.restart();

        });


    }

    render(context, deltaTime){
        if (this.timer > this.interval)
            {
                context.clearRect(0,0,this.width, this.height);
          

                this.gameObjects = [this.player,...this.eggs,...this.obstacles,...this.enemies,...this.hatchlings,...this.particles];

                    this.gameObjects.sort((a,b) => 
                    
                    {
                        return a.collisionY - b.collisionY;


                    });

                    this.gameObjects.forEach(object => 
                    
                        {
    
                            object.draw(context)
                            object.update(deltaTime);
                            this.timer=0;
                        })

                // this.eggs.forEach(egg => 
                    
                //     {

                //         egg.draw(context)
                //         egg.update();

                //     })


                // this.obstacles.forEach(obstacle => obstacle.draw(context))
                
                // this.player.draw(context);
                // this.player.update();

             

            }
                this.timer += deltaTime;

                if(this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs && !this.gameOver)
                {
                    this.addEgg();
                     this.eggTimer=0;
                     console.log(this.eggs);

                 } else {

                    this.eggTimer += deltaTime;

                 }



                 context.save();
                 context.testAlign='left';
                 context.fillText('Score: '+this.score,75,50);

                 if(this.debug)
                 {context.fillText('Lost: '+this.lostHatchling,75,100);}

                 context.restore();

                 if(this.score>=this.winningCondition)
                 {
                    this.gameOver = true;
                    context.save();
                    context.fillStyle='rgba(0,0,0,0.5)';
                    context.fillRect(0,0,this.width,this.height);
                    context.fillStyle='white';
                    context.textAlign='center';
                    context.shadowOffsetX=4;
                    context.shadowOffsetY=4;
                    context.shadowColor='black';

                    let message1;
                    let message2;
                    if(this.lostHatchling<=5)
                    {
                    message1="Bulleye"
                     message2="You bullied the bullies";
                    }
                    else
                    {
                    message1="Bullocks"
                     message2="You lost"+this.lostHatchling+"hatchlings, dont be a pushover!";
                    }
                    context.font = '130px Bangers';
                    context.fillText(message1, this.width*0.5,this.height*0.5-20);
                    context.font='40px Bangers';
                    context.fillText(message2, this.width*0.5,this.height*0.5+30);
                    context.fillText("Final score"+this.score+"Press 'R' to butt heads again",this.width*0.5,this.width*0.5+80);
                    context.restore();
             
        
                 }


    }

    

    checkCollision(a,b){

        const dx = a.collisionX-b.collisionX;
        const dy = a.collisionY-b.collisionY;
        const distance = Math.hypot(dy, dx);
        const sumofRadii= a.collisionRadius+b.collisionRadius;
        return [(distance < sumofRadii), distance,sumofRadii, dx, dy];
    }

    addEgg(){
        this.eggs.push(new Egg(this));

    }

    addEnemy(){
        this.enemies.push(new Enemy(this));

    }

    removeGameObjects(){

        this.eggs=this.eggs.filter(object => !object.markedForDeletion);

        this.hatchlings=this.hatchlings.filter(object => !object.markedForDeletion);

        this.particles=this.particles.filter(object => !object.markedForDeletion);

    }

    restart(){
        this.player.restart();
        this.obstacles= [];
        this.timer=0;
        this.eggs=[];
        this.eggTimer=0;
        this.gameObjects = [];
        this.enemies = [];
        this.hatchlings = [];
        this.score=0;
        this.lostHatchling=0;
        this.particles= [];
        this.gameOver=false;
        this.init();

    }


    init(){
        // for (let i =0; i< this.numberofObstacles; i++)
        // {
        //         this.obstacles.push(new Obstacle(this)); 

        // }


        for (let i=0;i<3;i++)
        {this.addEnemy();}

        let attempts = 0;
        while(this.obstacles.length < this.numberofObstacles && attempts <500)
        {   
            let testObstacle = new Obstacle(this);
            let overlap = false;
            this.obstacles.forEach(obstacle =>{

                const dx = testObstacle.collisionX - obstacle.collisionX;
                const dy = testObstacle.collisionY - obstacle.collisionY;
                const distance = Math.hypot(dx, dy);
                const distanceBuffer = 150;
                const sumOfdRadii = testObstacle.collisionRadius + obstacle.collisionRadius+distanceBuffer;
                if(distance<sumOfdRadii){overlap=true;}

            });

            const margin = testObstacle.collisionRadius*3;
            if (!overlap && testObstacle.spriteX>0 && testObstacle.spriteX<this.width-testObstacle.width&&testObstacle.collisionY>this.topMargin+margin&&testObstacle.collisionY<this.height-margin)
            {this.obstacles.push(testObstacle);}

            attempts++;

        }


    }

}


    const game = new Game(canvas);
    game.init();
 
        let lastTime = 0;

       function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime=timeStamp;
        // ctx.clearRect(0,0,canvas.width, canvas.height);
        game.render(ctx, deltaTime);
        requestAnimationFrame(animate);
       } 

    animate(0);


});











