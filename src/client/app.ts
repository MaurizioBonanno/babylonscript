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
    startGame(){
        this.createScene();
        this.doRender();
    }
    createScene() {
        this.scene = new BABYLON.Scene(this.engine);
 
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
    }

    createGround(){
        var ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("ground","assets/images/hmap1.png",{
            width:200,height:200,subdivisions:20,minHeight:1});
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

