define(['easel'], function(E) {
	var Bolt = function(x,y,fixed) {
		this.initialize(x,y,fixed);
	}
	
	var p = Bolt.prototype = new E.Container();
	
	p.shape = null;
	
	p.bitmap = null;
	
	p.fixed = false;
	
	p.selected = false;
	
	p._oldX = 0.0;
	p._oldY = 0.0;
	
	p.Container_initialize = p.initialize;
	
	p.initialize = function(x,y,fixed) {
		
		this.fixed = fixed;
		
		this.x = this._oldX = x;
		this.y = this._oldY = y;
		
		this.Container_initialize();
		
		
		
		this.shape = new E.Shape();
		
		var g = this.shape.graphics;
		
		g.beginFill('#990000');
		g.drawCircle(0,0,10);
		g.endFill();
				
		this.addChild(this.shape);
		
		
		this.bitmap = new E.Bitmap('img/bolt.png');
		this.bitmap.regX = 25;
		this.bitmap.regY = 25;
		this.addChild(this.bitmap);

	} 


	p.update = function () {
		
		 var tempX = this.x;
       	 var tempY = this.y;
       	 this.setX(this.x + this.getVX());
         this.setY(this.y + this.getVY());
         this._oldX = tempX;
         this._oldY = tempY;


	}
	
	p.setSelected = function(val) {
		this.selected = val;
		if(val) 
			this.shape.graphics.clear().beginFill('rgba(0,255,0,0.5)').drawCircle(0,0,35).endFill();
		else 
			this.shape.graphics.clear();
	}
	
	p.onMouseOver = function(e) {
		if(!this.selected)this.shape.graphics.clear().beginFill('rgba(255,0,255,0.5)').drawCircle(0,0,35).endFill();
	}
	
	p.onMouseOut = function(e) {
		if(!this.selected) this.shape.graphics.clear();
	}
	
	p.getVX = function () {
		return this.x - this._oldX;
	}
	
	p.setVX = function (value) {
		
		this._oldX = this.x - value;
	}
	
	p.getVY = function () {
		return this.y - this._oldY;
	}
	
	p.setVY = function (value) {
		this._oldY = this.y - value;
	}
	
	
	p.setX = function(value) {
		if(this.fixed) return;
		this.x = value;
	}
	
	p.getX = function() {
		return this.x;
	}
	
	
	p.setY = function(value) {
		if(this.fixed) return;
		this.y = value;
	}
	
	p.getY = function() {
		return this.y;
	}
	return Bolt
})