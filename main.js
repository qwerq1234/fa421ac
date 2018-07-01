w = window;
d = document;
T3 = THREE;

function onWindowResize() {
    w.camera.aspect = w.innerWidth / w.innerHeight;
    w.camera.updateProjectionMatrix();
    w.renderer.setSize(w.innerWidth, w.innerHeight);
}

function initScene() {
    w.scene = new THREE.Scene();
    w.camera = new THREE.PerspectiveCamera(45, w.innerWidth/w.innerHeight, 0.1, 16*4);

    w.renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    w.controls = new THREE.OrbitControls(w.camera, w.renderer.domElement);
    w.controls.minDistance= 20;
    w.controls.maxDistance = 50;
    w.controls.maxPolarAngle = Math.PI;

    // Init stats
    w.stats = new Stats();
    //document.body.appendChild(stats.dom);

    w.rStats = new THREEx.RendererStats()
    w.rStats.domElement.style.position = 'absolute'
    w.rStats.domElement.style.left = '0px'
    w.rStats.domElement.style.bottom = '0px'
    //d.body.appendChild(rStats.domElement);

    w.addEventListener('resize', onWindowResize, false);
    //w.addEventListener('mousemove', onMouseMove, false);

    camera.position.y = 2;
    camera.position.z = 25;
    //camera.lookAt(new T3.Vector3(0,0,0))

    //let grid = new T3.GridHelper(100, 100, 0xff0000, 0x400011);
    //grid.position.y = 0;
    //scene.add(grid);

    w.cubes = []
    let cube = new T3.CubeGeometry(1,1,1);
    let mat = new T3.MeshBasicMaterial({color:0xff0000});
    let cm = new T3.Mesh(cube, mat);
    //scene.add(cm);

     
    /* sky plane */
    w.skyTex = new T3.TextureLoader().load("w.jpg");
    scene.background = w.skyTex;

    /* heart */
    var heartShape = new THREE.Shape(); // From http://blog.burlock.org/html5/130-paths
    var x = 0;
    var y = 0;
    heartShape.moveTo( x + 25, y + 25 );
    heartShape.bezierCurveTo( x + 25, y + 25, x + 20, y, x, y );
    heartShape.bezierCurveTo( x - 30, y, x - 30, y + 35, x - 30, y + 35 );
    heartShape.bezierCurveTo( x - 30, y + 55, x - 10, y + 77, x + 25, y + 95 );
    heartShape.bezierCurveTo( x + 60, y + 77, x + 80, y + 55, x + 80, y + 35 );
    heartShape.bezierCurveTo( x + 80, y + 35, x + 80, y, x + 50, y );
    heartShape.bezierCurveTo( x + 35, y, x + 25, y + 25, x + 25, y + 25 );

    var pts = heartShape.getPoints();
    var spaced = heartShape.getSpacedPoints(50);

    var hrtG = new T3.BufferGeometry().setFromPoints(spaced);

    w.lstn = new T3.AudioListener();
    camera.add(lstn);

    function addHeart(sx, sy, t) {

        let h =undefined;
        if(t==0)
        h = new T3.Line(hrtG, 

                new T3.MeshBasicMaterial({color:0xff0000}));
        else
        h = new T3.Points(hrtG, new T3.PointsMaterial({size:0.15, color:0x00ff00}));

        h.scale.y *= -sy;
        h.scale.x *= sx;
        return h;
    }

    w.snd = new T3.Audio(w.lstn);
    w.aL = new T3.AudioLoader();
    w.aL.load('2t.mp3', function(buffer) {
        console.log("Loaded");
        snd.setBuffer(buffer);
        snd.setLoop(false);
        snd.setVolume(1.0);
        snd.play();
       // w.timer.start();
       //
        w.h0 = addHeart(0.05, 0.05, 0);
        scene.add(w.h0);


    setInterval(function() {
        w.sTex = new T3.DataTexture(anal.getFrequencyData(), 512, 1, THREE.LuminanceFormat);
        w.sTex.needsUpdate = true;
        w.pgrid.updateSound(w.sTex);
        //console.log(anal.getFrequencyData());

    }, 10); 

    });

    w.anal = new T3.AudioAnalyser(snd, 1024);
  
    w.pgrid = new PlaneGrid();

    scene.add(w.pgrid);

}


function initCanvas(_w, _h, name) {
    let canvas = document.createElement("canvas");
    canvas.width = _w;
    canvas.height = _h;
    return canvas;
}

function run() {
    w.timer = new T3.Clock();
    //w.timer.stop();

    initScene();

    
    animate();
}

function animate() {

    renderer.render(scene, camera);
     
    stats.update();
    w.rStats.update(renderer);

    let t = timer.getElapsedTime();
    let n = Math.random() * 0.0015;

    skyTex.offset.x = Math.sin(t) * 0.025 + Math.sin(2*t) * 0.010;
    skyTex.offset.y = Math.cos(t) * 0.025 + Math.cos(0.25*t) * 0.01;
    if(w.h0) {
 
        w.h0.position.x = Math.sin(t)*5.0 + 3.0*Math.cos(t*1.25);
        w.h0.position.y = Math.cos(t)*5.0 + 2.0*Math.sin(t*0.9);
        w.h0.rotation.x = Math.sin(t);
        w.h0.rotation.y = Math.cos(t);

    }

/*
    camera.position.x = 10 + Math.sin(t) * 2.0;
    camera.position.y = 2 + Math.cos(t) * 2.0;
    camera.lookAt(new T3.Vector3(0,0,0));
*/
    pgrid.updateUniforms(t, t);

    requestAnimationFrame( animate );
}

