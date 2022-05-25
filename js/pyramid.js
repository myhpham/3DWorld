class Pyramid {
	constructor() {
		this.type = 'pyramid';
		this.color = [1, 0, 0, 1];
		this.matrix = new Matrix4();
	}

	render() {
		var rgba = this.color;

		gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
		gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);


		// Side 1 of pyramid
		drawTriangle3D([0.0, 0.0, 0.0,		0.5, 1.0, 0.5,		1.0, 0.0, 0.0]);

		// Side 2 of pyramid
		// Side 2 color
		gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
		drawTriangle3D([1, 0, 0,		0.5, 1, 0.5,		1,0,1]);

		// Side 3 of pyramid
		gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
		drawTriangle3D([1, 0, 1,		0.5, 1, 0.5,		0, 0, 1]);

		// Side 4 of pyramid
		gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
		drawTriangle3D([0, 0, 1,		0.5, 1, 0.5,		0, 0, 0]);

		// Bottom color
		gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
		// Bottom of pyramid
		drawTriangle3D([0,0,0,		1,0,1,		1,0,0]);
		drawTriangle3D([0,0,0,		0,0,1,		1,0,1]);
	}
}