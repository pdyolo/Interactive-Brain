// Get the canvas element from the HTML
var canvas = document.getElementById("renderCanvas");

// Create a Babylon.js engine with the canvas element
var engine = new BABYLON.Engine(canvas, true);

// Define a function that creates the scene
var createScene = function () {
  // Create a new Babylon.js scene
  var scene = new BABYLON.Scene(engine);

  // Create a new camera and position it
  var camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), scene);

  // Attach the camera controls to the canvas
  camera.attachControl(canvas, true);

  // Enable collisions for the camera
  camera.checkCollisions = true;

  // Create a new light and position it
  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // Load the 3D model using the GLTF file format
  BABYLON.SceneLoader.ImportMesh("", "models/", "Brain.glb", scene, function (newMeshes) {
      // Get the first mesh from the imported meshes
      console.log("Meshes loaded");
      var mesh = newMeshes[0];

      // Enable collisions for the mesh
      mesh.checkCollisions = true;

      // Create a material for the mesh that will be used when it is not highlighted
      var originalMaterial = mesh.material;

      // Create a material for the mesh that will be used when it is highlighted
      var highlightMaterial = new BABYLON.StandardMaterial("highlightMaterial", scene);
      highlightMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0); // Yellow

      // Create a pointer move event that will be triggered when the mouse is moved over the mesh
      scene.onPointerMove = function (event) {
        var pickResult = scene.pick(scene.pointerX, scene.pointerY);
        if (pickResult.hit && pickResult.pickedMesh === mesh) {
            console.log("Mouse over mesh");
            mesh.material = highlightMaterial;
        } else {
            console.log("Mouse out of mesh");
            mesh.material = originalMaterial;
        }
      };

      // Create a box that will be used as a ground
      var ground = BABYLON.MeshBuilder.CreateBox("ground", {height: 0.1, width: 10, depth: 10}, scene);

      // Position the ground below the mesh
      ground.position = new BABYLON.Vector3(0, -0.5, 0);

      // Make the ground invisible
      ground.isVisible = false;

      // Make the ground a physics impostor
      ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0.9}, scene);

      // Add a collision event to the mesh that will be triggered when it collides with the ground
      mesh.onCollide = function(collidedMesh) {
        console.log("Mesh collided with ground");
      };
  });

  // Set gravity for the scene
  scene.gravity = new BABYLON.Vector3(0, -9.81, 0);

  // Enable physics in the scene
  scene.enablePhysics();

  // Return the created scene
  return scene;
};

// Call the createScene function to create the scene
var scene = createScene();

// Render the scene on every frame
engine.runRenderLoop(function () {
    scene.render();
});

// Resize the canvas when the window is resized
window.addEventListener("resize", function () {
    engine.resize();
});
