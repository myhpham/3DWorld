class Triangle {
	constructor() {
		this.type = 'triangle';
		this.position = [0.0, 0.0, 0.0];
		this.color = [0.0, 1.0, 0.0, 1.0];
		this.size = 5.0;
		//this.segments = 10.0;
	}

	render() {
		var xy = this.position;
		var rgba = this.color;
		var size = this.size;

		// Pass the color of a point to u_FragColor variable
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

		// Pass size to u_Size variable
		gl.uniform1f(u_Size, size);

		// Draw
		var d = this.size/200.0;
		drawTriangle3D([xy[0], xy[1]+d,   xy[0]-d, xy[1],    xy[0]+d, xy[1]]);
	}
}

function drawTriangle(vertices) {
	// The number of vertices
	var n = 3;

	// Create a buffer object
	var vertexBuffer = gl.createBuffer();
	
	if (!vertexBuffer) {
		console.log('Failed to create the buffer object');
		return -1;
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	// Write date into the buffer object
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

	// Assign the buffer object to a_Position variable
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

	// Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_Position);

	gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3D(vertices) {
	// The number of vertices
	var n = vertices.length/3;

	// Create a buffer object
	var vertexBuffer = gl.createBuffer();
	
	if (!vertexBuffer) {
		console.log('Failed to create the buffer object');
		return -1;
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	// Write date into the buffer object
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

	// Assign the buffer object to a_Position variable
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

	// Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_Position);

	gl.disableVertexAttribArray(a_UV);

	gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangle3DUV(vertices, uv) {
	// VERTICES

	// The number of vertices
	var n = vertices.length/3;

	// Create a buffer object
	var vertexBuffer = gl.createBuffer();
	
	if (!vertexBuffer) {
		console.log('Failed to create the buffer object');
		return -1;
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	// Write date into the buffer object
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

	// Assign the buffer object to a_Position variable
	gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

	// Enable the assignment to a_Position variable
	gl.enableVertexAttribArray(a_Position);

	// UV
	var uvBuffer = gl.createBuffer();
	if(!uvBuffer) {
		console.log('Failed to create uv buffer object');
		return -1;
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
	gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(a_UV);

	// Draw the triangle
	gl.drawArrays(gl.TRIANGLES, 0, n);
}


