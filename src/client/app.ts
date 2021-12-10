import * as BABYLON from "babylonjs";
class Game {
    canvas: any;
    engine: BABYLON.Engine;
    scene: any;
    camera: BABYLON.FreeCamera;
    constructor(){
        this.canvas = document.getElementById("renderCanvas");

        this.engine = new BABYLON.Engine(this.canvas,true);

     }
    setCanvasOnPointerLock(){
        this.canvas.requestPointerLock();
    }
    startGame(){
        this.createScene();
        this.doRender();
    }


    modifySetting(){
        if(!this.scene.alreadyLocked){
            console.log("Requesting pointer Lock");
            this.scene.onPointerDown=this.setCanvasOnPointerLock();
        }else{
            console.log("Not requesting pointer Lock");
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

    
    createScene() {
        this.scene = new BABYLON.Scene(this.engine);
        this.modifySetting();
      //creo la camera 
      this.createFreeCamera();


        var light = new BABYLON.PointLight("mainLight",new BABYLON.Vector3(0,10,0),this.scene);
        light.intensity = .7;

        this.createGround();
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
            width:2000,height:2000,subdivisions:20,minHeight:0,maxHeight: 100});
            ground.checkCollisions = true;
        var groundMaterial = new BABYLON.StandardMaterial("groundMaterial",this.scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("assets/images/grass.jpg",this.scene);
        ground.material = groundMaterial;
            
    }

    doRender(){
        this.engine.runRenderLoop(()=>{
            this.scene.render();
        });
        window.addEventListener("resize", ()=>{
            game.engine.resize();
        })
    }
}

var game = new Game();
game.startGame();

