export class GroundWorld{
    constructor(private scene: BABYLON.Scene){
        var ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap("ground","assets/images/hmap1.png",{
            width:2000,height:2000,subdivisions:20,minHeight:0,maxHeight: 5000});
            ground.checkCollisions = true;
        var groundMaterial = new BABYLON.StandardMaterial("groundMaterial",this.scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("assets/images/grass.jpg",this.scene);
        ground.material = groundMaterial;
    }
}