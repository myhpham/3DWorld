//Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let a_UV;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_WhichTexture;
let u_ViewMatrix;
let u_ProjectionMatrix;

// Set up contexts
function setUpWebGL() {
	// Retrieve canvas context
	canvas = document.getElementById('webgl', { alpha:false });
	
	// Retrieve WebGL rendering context
	// Enhance performance of graphics
	gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
	if(!gl) {
		console.log("Failed to get rendering context");
		return;
	}

	// Turn on depth
	gl.enable(gl.DEPTH_TEST);
}

// Connect variables to GLSL
function connectVariableToGLSL() {
	// Initialize shaders (compiles and installs)
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log('Failed to intialize shaders.');
		return;
	}

	// // Get the storage location of a_Position
	a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return;
	}

	// Get the storage location of u_FragColor
	u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
	if (!u_FragColor) {
		console.log('Failed to get the storage location of u_FragColor');
		return;
	}

	u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
	if (!u_ModelMatrix) {
		console.log('Failed to get the storage location of u_ModelMatrix');
		return;
	}

	u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
	if(!u_GlobalRotateMatrix) {
		console.log('Failed to get the storage location of u_GlobalRotateMatrix');
		return;
	}

	// ------------------------ A3 ------------------------

	a_UV = gl.getAttribLocation(gl.program, 'a_UV');
	if(a_UV < 0) {
		console.log('Failed to get the storage location of a_UV');
		return;
	}

	u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
	if(!u_Sampler0) {
		console.log('Failed to get the storage location of u_Sampler0');
		return;
	}

	u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
	if(!u_Sampler1) {
		console.log('Failed to get the storage location of u_Sampler1');
		return;
	}

	u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
	if(!u_Sampler2) {
		console.log('Failed to get the storage location of u_Sampler2');
		return;
	}

	u_WhichTexture = gl.getUniformLocation(gl.program, 'u_WhichTexture');
	if(!u_WhichTexture) {
		console.log('Failed to get the storage location of u_WhichTexture');
		return;
	}

	u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
	if(!u_ViewMatrix) {
		console.log('Failed to get the storage location of u_ViewMatrix');
		return;
	}

	u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
	if(!u_ProjectionMatrix) {
		console.log('Failed to get the storage location of u_ProjectionMatrix');
		return;
	}

	// Set up initial value for matrix
	var identityM = new Matrix4();
	gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Global UI elements
let g_globalAngle = 0;
let g_neckAngle = 0;
let g_headAngle = 0;
let g_tailAngle = 0;
let g_skySetting = 0;
let g_Animation = false;

// Initialize HTML UI actions
function addActionsforHTMLUI() {
	// Buttons
	document.getElementById('a_Day').onclick = function() {g_skySetting=0};
	document.getElementById('a_Night').onclick = function() {g_skySetting=1};
}

function initTextures() {
	
	// image 1

	var image0 = new Image();  // Create the image object
	var image1 = new Image();
	var image2 = new Image();

	if (!image0 || !image1 || !image2) {
		console.log('Failed to create the image object');
		return false;
	}
	// Register the event handler to be called on loading an image
	image0.onload = function(){ sendImageToTexture0(image0); };
	image1.onload = function() { sendImageToTexture1(image1); };
	image2.onload = function() { sendImageToTexture2(image2); };
	
	// Tell the browser to load an image
	image0.src = 'sky.jpg';
	image1.src = 'night_sky.jpg';
	image2.src = 'grass.jpg';

	return true;
}

function sendImageToTexture0(image) {
	var texture = gl.createTexture();   // Create a texture object
	if (!texture) {
		console.log('Failed to create the texture object');
		return false;
	}

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
	// Enable texture unit0
	gl.activeTexture(gl.TEXTURE0);
	// Bind the texture object to the target
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Set the texture parameters
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	// Set the texture image
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

	// Set the texture unit 0 to the sampler
	gl.uniform1i(u_Sampler0, 0);

	console.log('finished loadTexture (0)');
}

function sendImageToTexture1(image) {
	var texture1 = gl.createTexture();   // Create a texture object
	if (!texture1) {
		console.log('Failed to create the texture object');
		return false;
	}

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
	// Enable texture unit0
	gl.activeTexture(gl.TEXTURE1);
	// Bind the texture object to the target
	gl.bindTexture(gl.TEXTURE_2D, texture1);

	// Set the texture parameters
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	// Set the texture image
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

	// Set the texture unit 0 to the sampler
	gl.uniform1i(u_Sampler1, 1);

	console.log('finished loadTexture (1)');
}

function sendImageToTexture2(image) {
	var texture2 = gl.createTexture();   // Create a texture object
	if (!texture2) {
		console.log('Failed to create the texture object');
		return false;
	}

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
	// Enable texture unit0
	gl.activeTexture(gl.TEXTURE2);
	// Bind the texture object to the target
	gl.bindTexture(gl.TEXTURE_2D, texture2);

	// Set the texture parameters
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	// Set the texture image
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

	// Set the texture unit 0 to the sampler
	gl.uniform1i(u_Sampler2, 2);

	console.log('finished loadTexture (2)');
}

function main() {

	setUpWebGL();
	connectVariableToGLSL();
	addActionsforHTMLUI();

	// Register keys
	document.onkeydown = keydown;

	initTextures();

	// Specify the color for clearing <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	requestAnimationFrame(tick);
}

// Tick global variables
// Div by 1000 because performance.now return ms
var g_startTime = performance.now()/1000;
var g_seconds = performance.now()/1000 - g_startTime;

// Set  up for tick animation
function tick() {
	// Save current time
	g_seconds = performance.now()/1000 - g_startTime;

	//updateAnimationAngles();

	// Draw everything
	renderAllShapes();

	// Tell browser to update again
	requestAnimationFrame(tick);
}

let t_neckTranslate = 0;

function updateAnimationAngles() {
	if(g_Animation) {
		g_neckAngle = (25*Math.sin(g_seconds));
		if(g_neckAngle <= 0){
			g_neckAngle = -1 * g_neckAngle;
		}
		//console.log(g_neckAngle);
		//t_neckTranslate = g_neckAngle/145;
		g_headAngle = (-10*Math.sin(g_seconds));
		if(g_headAngle > 0) {
			g_headAngle = -1 * g_headAngle;
		}
		g_tailAngle = (-45*Math.sin(g_seconds));
	}
}

var g_camera = new Camera();

// W = 87, A = 65, S = 83, D = 68, Q = 81, E = 69
function keydown(ev) {
	if(ev.keyCode == 87){
		// W = forward
		g_camera.forward();
	}
	else if(ev.keyCode == 83) {
		// S = back
		g_camera.back();
	}
	else if(ev.keyCode == 68) {
		// D = right
		g_camera.right();
	}
	else if (ev.keyCode ==  65) {
		// A = left
		g_camera.left();
	}
	else if(ev.keyCode == 81) {
		// Q = rotate left
		g_camera.rotLeft();
	}
	else if(ev.keyCode == 69) {
		// E = rotate right
		g_camera.rotRight();
	}

	renderAllShapes();
}

var g_map1 = [
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];
var g_map2 = [
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

var f_map1 =[
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

function drawMap() {
	for(x = 0; x < 32; x++) {
		for(y = 0; y < 32; y++) {
			//console.log(x,y);
			if(g_map1[x][y] == 1) {
				var box1 = new Cube();
				box1.color = [0.19,0.15,0.12,1];
				box1.textureNum = -2;
				box1.matrix.translate(x-4, -1.95, y-4);
				box1.matrix.scale(0.5, 0.5, 0.5);
				box1.renderFast();
			}
			if(g_map1[x][y] == 1) {
				var box2 = new Cube();
				box2.color = [0.19,0.15,0.12,1];
				box2.textureNum = -2;
				box2.matrix.translate(x-4, -1.5, y-4);
				box2.matrix.scale(0.5, 0.5, 0.5);
				box2.renderFast();
			}
			if(g_map1[x][y] == 1) {
				var box3 = new Cube();
				box3.color = [0.19,0.15,0.12,1];
				box3.textureNum = -2;
				box3.matrix.translate(x-4, -1, y-4);
				box3.matrix.scale(0.5, 0.5, 0.5);
				box3.renderFast();
			}
			if(g_map1[x][y] == 1) {
				var box4 = new Cube();
				box4.color = [0.19,0.15,0.12,1];
				box4.textureNum = -2;
				box4.matrix.translate(x-4, -0.5, y-4);
				box4.matrix.scale(0.5, 0.5, 0.5);
				box4.renderFast();
			}
			if(g_map1[x][y] == 1) {
				var box5 = new Cube();
				box5.color = [0.19,0.15,0.12,1];
				box5.textureNum = -2;
				box5.matrix.translate(x-4, 0, y-4);
				box5.matrix.scale(0.5, 0.5, 0.5);
				box5.renderFast();
			}
			if(g_map1[x][y] == 1) {
				var box6 = new Cube();
				box6.color = [0.19,0.15,0.12,1];
				box6.textureNum = -2;
				box6.matrix.translate(x-4, 0.5, y-4);
				box6.matrix.scale(0.5, 0.5, 0.5);
				box6.renderFast();
			}
			if(g_map2[x][y] == 1) {
				var box7 = new Cube();
				box7.color = [0,0.18,0.11,1];
				box7.textureNum = -2;
				box7.matrix.translate(x-4.7, 1, y-4.7);
				box7.matrix.scale(2, 1.5, 2);
				box7.renderFast();
			}
			if(f_map1[x][y] == 1) {
				var box8 = new Cube();
				box8.color = [0.26,0.78,0.43,1];
				box8.textureNum = -2;
				box8.matrix.translate(x-4, -1.95, y-4);
				box8.matrix.scale(0.1, 0.3, 0.1);
				box8.renderFast();
			}
			if(f_map1[x][y] == 1) {
				var box9 = new Cube();
				box9.color = [0.26,0.78,0.43,1];
				box9.textureNum = -2;
				box9.matrix.translate(x-4, -1.65, y-4);
				box9.matrix.scale(0.1, 0.3, 0.1);
				box9.renderFast();
			}
			if(f_map1[x][y] == 1) {
				var box10 = new Cube();
				box10.color = [0.9,0.13,0.18,1];
				box10.textureNum = -2;
				box10.matrix.translate(x-4.1, -1.35, y-4.1);
				box10.matrix.scale(0.3, 0.3, 0.3);
				box10.renderFast();
			}
		}
	}
}

// Render shapes
function renderAllShapes() {

	// Check time at start of function
	var startTime = performance.now();

	// Pass the projection matrix
	var projMat = new Matrix4();
	projMat.setPerspective(30, canvas.width/canvas.height, 0.1, 100);
	gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

	// Pass the view matrix
	var viewMat = new Matrix4();
	//viewMat.setLookAt(g_eye[0],g_eye[1],g_eye[2], g_at[0],g_at[1],g_at[2], g_up[0],g_up[1],g_up[2]);
	viewMat.setLookAt(
		g_camera.eye.elements[0], g_camera.eye.elements[1], g_camera.eye.elements[2],
		g_camera.at.elements[0], g_camera.at.elements[1], g_camera.at.elements[2],
		g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]
		);
	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

	// Pass matrix to global matrix
	var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
	gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements)

	// Clear <canvas> 
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	drawMap();

	// Floor
	var floor = new Cube();
	floor.color = [0.4, 1, 0, 1];
	floor.textureNum = 2;
	floor.matrix.translate(0, -2, 0);
	floor.matrix.scale(50, 0.01, 50);
	floor.matrix.translate(-0.5, 0, -0.5);
	floor.renderFast();

	// Sky
	var sky = new Cube();
	sky.color = [1, 0, 0, 1];
	sky.textureNum = g_skySetting;
	sky.matrix.scale(50, 50, 50);
	sky.matrix.translate(-0.5, -0.5, -0.5);
	sky.render();

	// Body
	/*
	var body = new Cube();
	//body.color = [0.933, 0.909, 0.909, 1];
	body.textureNum = 1;
	body.matrix.translate(-0.05, -0.3, 0);
	body.matrix.rotate(14, 1, 0, 0);
	body.matrix.scale(0.5, 0.5, 0.5);
	body.renderFast();
	*/
}


