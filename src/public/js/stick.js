define(['easel'], function(E) {
	var Stick = function(pointA, pointB, length, gameOver) {
		this.initialize(pointA, pointB, length, gameOver);
	}
	
	var p = Stick.prototype = new E.Container();
	
	p.shape = null;
	
	p.bitmap = null;
	
	p._pointA = null;
	p._pointB = null;
	
	p._gameOver = null;
	
	p._length = 0.0;
	p._diff = 0.0;
	
	p._x = 0.0;
	p._y = 0.0;
	p._oldX = 0.0;
	p._oldY = 0.0;
	
	p.Container_initialize = p.initialize;
	
	p.initialize = function(pointA, pointB, length, gameOver) {
		
		this.Container_initialize();
		
		
		this._pointA = pointA;
		this._pointB = pointB;
		
		
		var dx = this._pointA.x - this._pointB.x;
      	var dy = this._pointA.y - this._pointB.y;
        this._length = Math.sqrt(dx * dx + dy * dy);
		
		this._gameOver = gameOver;
		
		
		
		
		
		this.shape = new E.Shape();
		
		var g = this.shape.graphics;
		
		g.setStrokeStyle(1);
		g.beginStroke(E.Graphics.getRGB(0,0,0));
		g.drawCircle(0,0,10)
		g.moveTo(-50,0);
		g.lineTo(50,0);
		g.endFill();
				
		this.addChild(this.shape);
		
		this.bitmap = new E.Bitmap('img/stick.png');
		this.addChild(this.bitmap);
		
	
	} 


	p.update = function () {
		  var dx = this._pointB.x - this._pointA.x;
          var dy = this._pointB.y - this._pointA.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          
          var diff = this._length - dist;
          if(diff > 20) this._gameOver.call(this);
          var offsetX = (diff * dx / dist) / 2;
          var offsetY = (diff * dy / dist) / 2;
	  	
	  	this._pointA.setX(this._pointA.x - offsetX);
	  	this._pointA.setY(this._pointA.y - offsetY);
	  	this._pointB.setX(this._pointB.x + offsetX);
	   	this._pointB.setY(this._pointB.y + offsetY);
	        this._diff = diff;
	        
	       // console.log('DIFF : ' + this._diff);
	        
	        var g = this.shape.graphics;
		g.clear();
		g.setStrokeStyle(1);
		g.beginStroke(E.Graphics.getRGB(0,0,0));
		g.moveTo(this._pointA.x,this._pointA.y);
		g.lineTo(this._pointB.x, this._pointB.y);
		g.endFill();
		
		
			
	       this.bitmap.regX = .5;
	       this.bitmap.regY = 10;
	       this.bitmap.scaleX = this._length;
	       this.bitmap.y = (this._pointA.y + this._pointB.y) * 0.5;
	       this.bitmap.x = (this._pointA.x + this._pointB.x) * 0.5;
	       this.bitmap.rotation = (Math.atan2((this._pointB.x -  this._pointA.x) , (this._pointA.y - this._pointB.y) ) )* 180 / Math.PI + 90;
	}
	
	p.getVX = function () {
		return this._x - this._oldX;
	}
	
	p.setVX = function (value) {
		this._oldX = this._x - value;
	}
	
	p.getVY = function () {
		return this._y - this._oldY;
	}
	
	p.setVY = function (value) {
		this._oldY = this._y - value;
	}
	return Stick
}) 