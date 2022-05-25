class Cube {
	constructor() {
		this.type = 'cube';
		this.color = [0.0, 0.0, 0.0, 1.0];
		this.matrix = new Matrix4();
		this.textureNum = -2;
	}

	render() {
		var rgba = this.color;

		// Pass the texture number
		gl.uniform1i(u_WhichTexture, this.textureNum);

		// Pass color
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
		
		// Pass matrix
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

		// Front side of cube
		drawTriangle3DUV([0,0,0,		1,1,0,		1,0,0], [0,0,		1,1,	1,0]);
		drawTriangle3DUV([0,0,0,		0,1,0,		1,1,0], [0,0,		0,1,	1,1]);

		// Left side color
		gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
		// Left side of cube
		drawTriangle3DUV([0,0,1,		0,1,0,		0,0,0], [1,0,	0,1,	0,0]);
		drawTriangle3DUV([0,0,1,		0,1,1,		0,1,0], [1,0,	1,1,	0,1]);

		// Right side color
		gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
		// Right side of cube
		drawTriangle3DUV([1,0,0,		1,0,1,		1,1,0], [1,0,	0,0,	1,1]);
		drawTriangle3DUV([1,0,1,		1,1,1,		1,1,0], [0,0,	0,1,	1,1]);

		// Bottom color
		gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
		// Bottom of cube
		drawTriangle3D([0,0,0,		0,0,1,		1,0,1]);
		drawTriangle3D([0,0,0,		1,0,1,		1,0,0]);

		// Top color
		gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
		// Top of cube
		drawTriangle3DUV([0,1,0,		0,1,1,		1,1,1], [0,1,	1,1,	1,0]);
		drawTriangle3DUV([0,1,0,		1,1,1,		1,1,0], [0,1,	1,0,	0,0]);

		// Back color
		gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
		// Back of cube
		drawTriangle3DUV([0,0,1,		1,1,1,		1,0,1], [1,0,	0,1,	0,0]);
		drawTriangle3DUV([0,0,1,		0,1,1,		1,1,1], [1,0,	1,1,	0,1]);
	}

	renderFast() {
		var rgba = this.color;

		gl.uniform1i(u_WhichTexture, this.textureNum);
		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

		var allverts = [];
		var alluv = [];

		// Front
		allverts = allverts.concat([0,0,0,		1,1,0,		1,0,0]);
		allverts = allverts.concat([0,0,0,		0,1,0,		1,1,0]);
		alluv = alluv.concat([0,0,		1,1,	1,0]);
		alluv = alluv.concat([0,0,		0,1,	1,1]);

		// Top
		allverts = allverts.concat([0,1,0,		0,1,1,		1,1,1]);
		allverts = allverts.concat([0,1,0,		1,1,1,		1,1,0]);
		alluv = alluv.concat([0,1,	1,1,	1,0]);
		alluv = alluv.concat([0,1,	1,0,	0,0]);

		// Right
		allverts = allverts.concat([1,0,0,		1,0,1,		1,1,0]);
		allverts = allverts.concat([1,0,1,		1,1,1,		1,1,0]);
		alluv = alluv.concat([1,0,	0,0,	1,1]);
		alluv = alluv.concat([0,0,	0,1,	1,1]);

		// Left
		allverts = allverts.concat([0,0,1,		0,1,0,		0,0,0]);
		allverts = allverts.concat([0,0,1,		0,1,1,		0,1,0]);
		alluv = alluv.concat([1,0,	0,1,	0,0]);
		alluv = alluv.concat([1,0,	1,1,	0,1]);

		// Bottom
		allverts = allverts.concat([0,0,0,		0,0,1,		1,0,1]);
		allverts = allverts.concat([0,0,0,		1,0,1,		1,0,0]);
		alluv = alluv.concat([1,0,	0,1,	0,0]);
		alluv = alluv.concat([1,0,	1,1,	0,1]);

		//gl.uniform4f(u_FragColor, rgba[0]*0.95, rgba[1]*0.95, rgba[2]*0.95, rgba[3]);
		drawTriangle3DUV(allverts, alluv);
	}
}


