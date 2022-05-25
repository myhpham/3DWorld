class Camera {
	constructor() {
		this.eye = new Vector3([0,0,13]);
		this.at = new Vector3([0,0,-100]);
		this.up = new Vector3([0,1,0]);
	}

	forward() {
		var d = new Vector3();
		var a = new Vector3(this.at.elements);
		d = a.sub(this.eye);
		d = d.normalize();
		this.at = this.at.add(d);
		this.eye = this.eye.add(d);
	}
	back() {
		var d = new Vector3();
		var a = new Vector3(this.at.elements);
		d = a.sub(this.eye);
		d = d.normalize();
		this.at = this.at.sub(d);
		this.eye = this.eye.sub(d);
	}
	left() {
		var d = new Vector3();
		var a = new Vector3(this.at.elements);
		d = a.sub(this.eye);
		var n = Vector3.cross(this.up, d);
		n = n.normalize();
		this.at = this.at.add(n);
		this.eye = this.eye.add(n);
	}
	right() {
		var d = new Vector3();
		var a = new Vector3(this.at.elements);
		d = a.sub(this.eye);
		var n = Vector3.cross(this.up, d);
		n = n.normalize();
		n = n.mul(-1);
		this.at = this.at.add(n);
		this.eye = this.eye.add(n);
	}
	rotRight() {
		var d = new Vector3();
		var r = new Matrix4();
		var e = new Vector3(this.eye.elements);
		var a = new Vector3(this.at.elements);
		d = a.sub(this.eye);
		//var theta = Math.atan(d.elements[1]/r, d.elements[0]/r);
		//theta = theta - 0.0872665;
		r = r.setRotate(-5, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
		//d.elements[0] = r * (Math.cos(theta));
		//d.elements[1] = r * (Math.sin(theta));
		var newd = r.multiplyVector3(a);
		this.at = e.add(newd);
	}
	rotLeft() {
		var d = new Vector3();
		var r = new Matrix4();
		var e = new Vector3(this.eye.elements);
		var a = new Vector3(this.at.elements);
		d = a.sub(this.eye);
		//var theta = Math.atan(d.elements[1]/r, d.elements[0]/r);
		//theta = theta - 0.0872665;
		r = r.setRotate(5, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
		//d.elements[0] = r * (Math.cos(theta));
		//d.elements[1] = r * (Math.sin(theta));
		var newd = r.multiplyVector3(a);
		this.at = e.add(newd);
	}
}