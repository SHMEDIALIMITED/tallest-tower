define(['backbone', 
		'jquery', 
		'easel', 
		'model/stick', 
		'underscore', 
		'model/point', 
		'view/bolt', 
		'view/rod',
		'view/World'], 
	function(Backbone, $, E, Stick, _, Point, Bolt, Rod, World) {

	return Backbone.View.extend({
		tagName: 'canvas',
		stage : null,
		scaffold : null,
		bg : null,
		selectedPoint : null,
		scaffoldHeight : 0.0,
		objects: [],
		initialize: function() {
			this.model.get('points').models;
			this.model.get('sticks').models;
				
			_.bindAll(this, 'render');	
			_.bindAll(this, 'addRod');	
			_.bindAll(this, 'addBolt');	
			_.bindAll(this, 'selectBolt');
			_.bindAll(this, 'addStick');
			_.bindAll(this, 'resize');

			this.model.on('change', this.render);
			 
			this.stage = new E.Stage(this.el);
			this.stage.enableMouseOver(30);

			this.bg = new E.Shape();
			this.stage.addChild(this.bg);

			this.world = new World();
			this.scaffold = new E.Container();	
			this.scaffold.rods = new E.Container();
			this.scaffold.bolts = new E.Container();
			this.scaffold.addChild(this.world.container)
			this.scaffold.addChild(this.scaffold.rods)
			this.scaffold.addChild(this.scaffold.bolts);
			this.scaffold.y = 300;
			this.stage.addChild(this.scaffold);

			
			E.Ticker.useRAF = true;
			E.Ticker.setFPS(30);

			this.stage.width =  1000;
			$(window).resize(this.resize);	
		},

		drawBG: function() {
			this.bg.graphics.clear();
			this.bg.graphics.beginFill('#999')
				.drawRect(0,0,this.el.width, this.el.height)
				.beginFill(null);	
		},

		resize : function() {
			if(window.innerWidth > 500) {
				this.scaffold.scaleX = this.scaffold.scaleY = 1;
			}else {
				this.scaffold.scaleX = this.scaffold.scaleY = 0.5;
			}
			this.stage.canvas.width = window.innerWidth;
       		this.stage.canvas.height = window.innerHeight-12;      
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

		setFeature: function(feature) {
			this.feature = feature;
		},

		render : function() {
			this.stop();
			var that = this;
			this.model.get('points').on('add', this.addBolt);
			this.model.get('sticks').on('add', this.addRod);
			this.model.get('points').each(function(point){
				this.addBolt(point);
			}, this);
			this.model.get('sticks').each(function(stick){
				this.addRod(stick);
			}, this);
			this.model.once('change', this.render);
			this.start();
			return this;
		},
		
		addRod : function(stick) {
			var rod = new Rod({model:stick});
			this.scaffold.rods.addChild(rod.container);
			this.objects.push(rod);
		},

		addBolt : function(point){
			var bolt = new Bolt({model:point});
			bolt.on('selected', this.selectBolt)
			this.scaffold.bolts.addChild(bolt.container);
			this.objects.push(bolt);
		},

		selectBolt: function(bolt) {
			this.bg.onPress = this.addStick;
			if(this.selectedPoint && this.selectedPoint != bolt.model) {
				this.addStick(bolt);
				return;
			}
			this.selectedPoint = bolt.model;
			bolt.setSelected(true);
		},


		addPoint : function(e) {
			point = new Point({x: (e.stageX - this.scaffold.x) / this.scaffold.scaleX, y: (e.stageY - this.scaffold.y) / this.scaffold.scaleY});
			this.model.get('points').add(point);
			return point
		},

		addStick: function(e) {
			var point;
			if(e instanceof Bolt
				 ) {
				point = e.model;
			}else {
				point = this.addPoint(e);		
				//this.addBolt();
			}
			var s = new Stick({a:point, b:this.selectedPoint});
			this.model.get('sticks').add(s);
			var points = this.model.get('points'); 
			points.each(function(point) {				
				if(point.get('y') < this.scaffoldHeight) this.scaffoldHeight = point.get('y');
			}, this);
			this.selectedPoint = null;
			delete this.bg.onPress;
			var pX = this.scaffold.localToGlobal(0, this.scaffoldHeight);
		},

		tick: function() {
			//console.log('tick')	
			var points = this.model.get('points').models;
			i = points.length;
			while( --i > -1 ) {
				points[i].set({y: points[i].get('y') + 1});
				points[i].update();
			}
			var sticks = this.model.get('sticks').models;
			i = sticks.length;
			while( --i > -1 ) {
				sticks[i].update();
			}

			var pX = this.scaffold.localToGlobal(0, this.scaffoldHeight);
			if(pX.y < 150) {
				this.el.height++;
				this.scaffold.y++;
				this.drawBG();
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