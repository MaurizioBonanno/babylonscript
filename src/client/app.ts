import * as BABYLON from "babylonjs";
class Dude{
    speed: any = 1;
    scaling = .085;
    hero: BABYLON.AbstractMesh;
    constructor(private scena: BABYLON.Scene){
    this.loadDudle();   
    }
    loadDudle() {
        BABYLON.SceneLoader.ImportMeshAsync("him", "assets/models/Dude/", "Dude.babylon", this.scena)
        .then((result)=>{
            this.hero = result.meshes[0];
            result.meshes[0].name = "Hero";
            this.hero.scaling = new BABYLON.Vector3(this.scaling,this.scaling,this.scaling);
            this.scena.beginAnimation(result.skeletons[0],0,120,true,1.0);
        })
    }

    move(){
        var hero = this.hero;
        var tank = this.scena.getMeshByName("HeroTank");
        if(hero){
            if(tank){
                var direction = tank.position.subtract(hero.position);
                var distance = direction.length();
                var dir = direction.normalize();
                if(distance > 10){
                    hero.moveWithCollisions(dir.multiplyByFloats(this.speed,this.speed,this.speed));
                }
                var alpha = Math.atan2(-1*dir.x, -1*dir.z);
                hero.rotation.y = alpha;            }
        }else{
            console.log("tank non trovato");
        }
    }
}
class Game {
    canvas: any;
    engine: BABYLON.Engine;
    scene: any;
    camera: BABYLON.FreeCamera;
    followCamera: BABYLON.FollowCamera;
    tank: any;
    tankSpeed: number = 1;
    isWPressed = false;
    isSPressed = false;
    isAPressed = false;
    isDPressed = false;
    bounder: BABYLON.Mesh;
    tankFrontVector = new BABYLON.Vector3(0,0,1);

    hero: any;

    constructor(){
        this.canvas = document.getElementById("renderCanvas");

        this.engine = new BABYLON.Engine(this.canvas,true);

     }
    setCanvasOnPointerLock(){
        this.canvas.requestPointerLock();
    }
    startGame(){
        this.createScene();
        this.modifySetting();
        this.addKeyEvent();
        this.doRender();
    }


    modifySetting(){
        if(!this.scene.alreadyLocked){
           // console.log("Requesting pointer Lock");
            this.scene.onPointerDown=this.setCanvasOnPointerLock();
        }else{
           // console.log("Not requesting pointer Lock");
        }
        
        document.addEventListener("pointerlockchange", ()=>{
            var element = document.pointerLockElement || null;
            if(element){
                this.scene.alreadyLocked = true;
            }else{
                this.scene.alreadyLocked = false;
            }
        })
    }

    createTank(){
        var tank = BABYLON.MeshBuilder.CreateBox("HeroTank",{height: 1,depth: 3,width: 3}, this.scene);
        var tankMaterial = new BABYLON.StandardMaterial("tankMaterial",this.scene);
        tankMaterial.diffuseColor = BABYLON.Color3.Red();
        tankMaterial.emissiveColor = BABYLON.Color3.Blue();
        tank.material = tankMaterial;
        tank.position.y += 0.1;
        tank.isVisible = false;
        return tank;
    }

    createScene() {
        this.scene = new BABYLON.Scene(this.engine);
      //creo la camera 
      this.createFreeCamera();
      
      this.tank = this.createTank();
      this.followCamera = this.createFollowCamera(this.tank);
      this.scene.activeCamera = this.followCamera;
      // carico il dude
      this.hero = new Dude(this.scene);
      //dude caricato
      this.createLight();
      this.createGround();
    }

    createLight() {
        var light = new BABYLON.PointLight("mainLight",new BABYLON.Vector3(0,10,0),this.scene);
        var light1 = new BABYLON.PointLight("mainLight",new BABYLON.Vector3(0,10,0),this.scene);
        light.intensity = .7;
    }

    createFreeCamera(){
        this.camera = new BABYLON.FreeCamera(
            "camera1",
            new BABYLON.Vector3(0, 5, -10),
            this.scene
        );
        this.camera.checkCollisions = true;
        this.camera.applyGravity = true;

        this.camera.attachControl(this.canvas);

        this.camera.keysUp.push("w".charCodeAt(0));
        this.camera.keysUp.push("W".charCodeAt(0));
        this.camera.keysDown.push("s".charCodeAt(0));
        this.camera.keysDown.push("S".charCodeAt(0));
        this.camera.keysRight.push("d".charCodeAt(0));
        this.camera.keysRight.push("D".charCodeAt(0));
        this.camera.keysLeft.push("a".charCodeAt(0));
        this.camera.keysLeft.push("A".charCodeAt(0));

    }

    createGround(){
        var ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("ground","assets/images/hmap1.png",{
            width:2000,height:2000,subdivisions:20,minHeight:0,maxHeight: 5000});
            ground.checkCollisions = true;
        var groundMaterial = new BABYLON.StandardMaterial("groundMaterial",this.scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("assets/images/grass.jpg",this.scene);
        ground.material = groundMaterial;
            
    }

    createFollowCamera(target: BABYLON.Mesh){
        var camera = new BABYLON.FollowCamera("tankFollowCamera",target.position, this.scene, target);
        camera.radius = 20;
        camera.heightOffset = 4;
        camera.rotationOffset = 180;
        camera.cameraAcceleration = 0.5;
        camera.maxCameraSpeed = 50;

        return camera;
    }
    tankMove(){
        var yTankMovement = 0;

        if(this.tank.position.y > 1){
            yTankMovement = -6;
        }

        if(this.isWPressed){
            this.tank.moveWithCollisions(this.tankFrontVector.multiplyByFloats(this.tankSpeed,this.tankSpeed,this.tankSpeed));
        }
        if(this.isSPressed){
            this.tank.moveWithCollisions(this.tankFrontVector.multiplyByFloats(-1*this.tankSpeed,-1*this.tankSpeed,-1*this.tankSpeed));
        }
        if(this.isAPressed){
            this.tank.rotation.y -=.1;
            this.tankFrontVector = new BABYLON.Vector3(Math.sin(this.tank.rotation.y),0,Math.cos(this.tank.rotation.y))
        }
        if(this.isDPressed){
            this.tank.rotation.y += .1;
            this.tankFrontVector = new BABYLON.Vector3(Math.sin(this.tank.rotation.y),0,Math.cos(this.tank.rotation.y))
        }
        
    }
    addKeyEvent(){

        document.addEventListener("keydown",(evt)=>{
    
            if(evt.key == 'w'){
                this.isWPressed = true;
            }
            if(evt.key == 'a'){
                this.isAPressed = true;
            }
            if(evt.key == 'd'){
                this.isDPressed = true;
            }
            if(evt.key == 's'){
                this.isSPressed = true;
            }
            
        })

        document.addEventListener("keyup",(evt)=>{
            if(evt.key == 'w'){
                this.isWPressed = false;
            }
            if(evt.key == 'a'){
                this.isAPressed = false;
            }
            if(evt.key == 'd'){
                this.isDPressed = false;
            }
            if(evt.key == 's'){
                this.isSPressed = false;
            }
        })
        

    }
    doRender(){
        this.engine.runRenderLoop(()=>{ //loop game
            
            this.tankMove();
            this.hero.move();
            this.scene.render();
        });
        window.addEventListener("resize", ()=>{
            game.engine.resize();
        })
    }
}

var game = new Game();
game.startGame();




