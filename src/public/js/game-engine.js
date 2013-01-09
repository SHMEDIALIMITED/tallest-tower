define(['backbone', 'jquery', 'easel', 'bolt', 'stick', 'underscore', 'model/point', 'view/bolt'], 
	function(Backbone, $, E, Bolt, Stick, _, Point, Bolt) {
	return Backbone.View.extend({
		el: '#game-engine',
		stage : null,
		points : null,
		sticks : null,
		scaffold : null,
		bg : null,
		selectedPoint : null,
		scaffoldHeight : 0.0,
		objects: [],
		initialize: function() {

			
			
			
			 _.bindAll(this, 'render');	
			 _.bindAll(this, 'selectBolt');
			 _.bindAll(this, 'addStick');
			  _.bindAll(this, 'resize');

			 this.model.on('change', this.render);
			 
			
			
			this.stage = new E.Stage(this.el);
			this.stage.enableMouseOver(30);

			

			this.bg = new E.Shape();
			this.stage.addChild(this.bg);


			this.scaffold = new E.Container();	
			this.scaffold.y = 300;
			this.stage.addChild(this.scaffold);

			$(window).resize(this.resize);
			
			console.log(this.trigger)
			

			


			E.Ticker.useRAF = true;
			E.Ticker.setFPS(30);

			
				


		},

		drawBG: function() {
			this.bg.graphics.clear();
			this.bg.graphics.beginFill('#999')
				.drawRect(0,0,this.el.width, this.el.height)
				.beginFill(null);
			
		},

		resize : function() {
			this.stage.canvas.width = window.innerWidth;
       		this.stage.canvas.height = window.innerHeight;      

			this.scaffold.x = window.innerWidth * .5;
			this.scaffold.y = window.innerHeight - window.innerHeight / 100 * 28;
		
			this.drawBG();
		},

		start:function() {
			this.resize();
			E.Ticker.addListener(this);
		},

		stop: function() {
			E.Ticker.removeListener(this);	
		},

		render : function() {
			this.stop();
			this.points = this.model.get('points').models;
			this.sticks = this.model.get('sticks').models;
			var that = this;
			this.model.get('points').each(function(point){
				that.addBolt(point);
			});

			this.start();
		},

		addBolt : function(point){
			var bolt = new Bolt({model:point});
			bolt.on('selected', this.selectBolt)
			this.scaffold.addChild(bolt.container);
			this.objects.push(bolt);
		},

		selectBolt: function(bolt) {
			console.log(bolt)
			this.bg.onPress = this.addStick;
			if(this.selectedPoint && this.selectedPoint != bolt.model) {
				this.addStick(bolt);
				return;
			}
			this.selectedPoint = bolt.model;
			bolt.setSelected(true);
		},

		addStick: function(e) {
			var point;
			if(e instanceof Bolt) {
				point = e;
			}else {
				point = new Point({x: e.stageX, y: e.stageY - this.scaffold.y});		
				this.addBolt();
			}
			var s = new Stick(point, this.selectedPoint);
			this.model.sticks.add(s);
			this.scaffold.addChildAt(s,0); 
			
			var i = this.points.length;
			var insert = true;
			while( --i > -1 ) {
				if(this.points[i] === point) {
					insert = false;
				}
				this.points[i].setSelected(false);
				if(this.points[i].y < this.scaffoldHeight) this.scaffoldHeight = this.points[i].y;
			}
			if(insert) this.points.push(point);
			this.sticks.push(s);
			this.selectedPoint = null;
			delete this.bg.onPress;
			
			console.log("SCAFFOLD HEIGHT " + this.scaffoldHeight);
			var pX = this.scaffold.localToGlobal(0, this.scaffoldHeight);
			
		},

		tick: function() {
			
			var i = this.points.length;
			while( --i > -1 ) {
				//this.points[i].set({y: this.points[i].get('y') + 1});
				this.points[i].update();
			}
			
			var j = 1;
			while( --j > -1) {
				i = this.sticks.length;
				while( --i > -1 ) this.sticks[i].update();			
			}
			
			
			var pX = this.scaffold.localToGlobal(0, this.scaffoldHeight);
			if(pX.y < 150) {
				//this.scaffold.y++;
			}

			var gameObjects = this.objects;
			var i = gameObjects.length;
			while( --i > -1 ) {
				gameObjects[i].render();
			} 
			
			
			this.stage.update();
		}
	});
});