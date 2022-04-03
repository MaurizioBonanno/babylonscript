export class Dude{
    speed: any = 1;
    scaling = .085;
    hero: any;
    boundingBoxParameters: any;
    bounder: BABYLON.Mesh;
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
            //this.createBoundigBox();
        })
    }

    createBoundigBox(){
        if(this.boundingBoxParameters == undefined){
            this.calculateBoundingBoxParameters();
        }
        let lengthX = this.boundingBoxParameters.lenghtX;
        let lengthY = this.boundingBoxParameters.lenghtY;
        let lengthZ = this.boundingBoxParameters.lenghtZ;

        this.bounder= BABYLON.MeshBuilder.CreateBox("bounder",{height: 1,depth: 1,width: 1}, this.scena);
        this.bounder.scaling.x = lengthX * this.scaling;
        this.bounder.scaling.y = lengthY * this.scaling;
        this.bounder.scaling.z = lengthZ * this.scaling;
    }

    calculateBoundingBoxParameters(){
        var minX = 999999;
        var minY = 999999;
        var minZ = 999999;

        var maxX = -999999;
        var maxY = -999999;
        var maxZ = -999999;

        var children = this.hero.getChildren();

        for (let i = 0; i < children.length; i++) {
            let positions = BABYLON.VertexData.ExtractFromGeometry(children[i]).positions;
            if(!positions) continue;
           // console.log(`Posizione mesh Children :${positions}`);

            let index = 0;
            for (let j = index; j < positions.length; j+=3) {
                if(positions[j] < minX){
                    minX = positions[j];
                }
                if(positions[j] > maxX){
                    maxX = positions[j];
                }
                console.log(`posizione maxX = ${maxX},minX=${minX}`);
            }


            index = 1;
            for (let j = index; j < positions.length; j+=3) {
                if(positions[j] < minY){
                    minY = positions[j];
                }
                if(positions[j] > maxY){
                    maxY = positions[j];
                }
                console.log(`posizione maxY = ${maxY},minY=${minY}`);
            }

            index = 2;
            for (let j = index; j < positions.length; j+=3) {
                if(positions[j] < minZ){
                    minZ = positions[j];
                }
                if(positions[j] > maxZ){
                    maxZ = positions[j];
                }
                console.log(`posizione maxZ = ${maxZ},minZ=${minZ}`);
            }

            let _lengthX = maxX - minX;
            let _lengthY = maxY - minY;
            let _lengthZ = maxZ - minZ;

            console.log(`lenghtX = ${_lengthX},lenghtY =${_lengthY}, lengthZ = ${_lengthZ}`);
            
            this.boundingBoxParameters = { lenghtX: _lengthX, lenghtY: _lengthY, lenghtZ: _lengthZ };
        }
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