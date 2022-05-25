// SHADERS

// Vertex shader program
var VSHADER_SOURCE =
`
	precision mediump float;

	attribute vec4 a_Position;
	uniform mat4 u_ModelMatrix;
	uniform mat4 u_GlobalRotateMatrix;

	attribute vec2 a_UV;
	varying vec2 v_UV;

	uniform mat4 u_ViewMatrix;
	uniform mat4 u_ProjectionMatrix;

	void main() {
		gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
		v_UV = a_UV;
	}
 `

// Fragment shader program
var FSHADER_SOURCE =
`
	precision mediump float;

	uniform vec4 u_FragColor;
	varying vec2 v_UV;
	uniform sampler2D u_Sampler0;
	uniform sampler2D u_Sampler1;
	uniform sampler2D u_Sampler2;
	uniform int u_WhichTexture;

	void main() {
		if(u_WhichTexture == -2) {
			// Use color
			gl_FragColor = u_FragColor;
		}
		else if(u_WhichTexture == -1) {
			// Use UV debug color
			gl_FragColor = vec4(v_UV, 1, 1);
		}
		else if(u_WhichTexture == 0) {
			// Use texture0
			gl_FragColor = texture2D(u_Sampler0, v_UV);
		}
		else if(u_WhichTexture == 1) {
			// Use texture1
			gl_FragColor = texture2D(u_Sampler1, v_UV);
		}
		else if(u_WhichTexture == 2) {
			// Use texture2
			gl_FragColor = texture2D(u_Sampler2, v_UV);
		}
		else {
			// Error put reddish
			gl_FragColor = vec4(1, 0.2, 0.2, 1);
		}
	}
`

