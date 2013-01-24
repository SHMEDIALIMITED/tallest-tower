define(['backbone', 
		'jquery', 
		'easel', 
		'bolt', 
		'model/stick', 
		'underscore', 
		'model/point', 
		'view/bolt', 
		'view/rod'], 
	function(Backbone, $, E, Bolt, Stick, _, Point, Bolt, Rod) {

	return Backbone.View.extend({
		tagName: 'canvas',
		stage : null,
		scaffold : null,
		bg : null,
		selectedPoint : null,
		scaffoldHeight : 0.0,
		objects: [],
		initialize: function() {


			
			console.log('ENGINE', this.model)
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


			this.scaffold = new E.Container();	
			this.scaffold.y = 300;
			this.stage.addChild(this.scaffold);

			$(window).resize(this.resize);
			
			

			


			E.Ticker.useRAF = true;
			E.Ticker.setFPS(30);

			this.stage.width =  1000;	
				


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
       		this.stage.canvas.height = window.innerHeight-72;      

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

			//console.log(this.model)



			
			var that = this;
			
			this.model.get('points').on('add', this.addBolt);
			this.model.get('sticks').on('add', this.addRod);
			//this.model.get('sticks').on('add', this.addRod);


			this.model.get('points').each(function(point){
				that.addBolt(point);
			});

			this.model.get('sticks').each(function(stick){
				that.addRod(stick);
			});


			this.model.once('change', this.render);

			this.start();
		},
		
		addRod : function(stick) {
			var rod = new Rod({model:stick});
			this.scaffold.addChildAt(rod.container, 0);
			this.objects.push(rod);
		},

		addBolt : function(point){
			var bolt = new Bolt({model:point});
			bolt.on('selected', this.selectBolt)
			this.scaffold.addChild(bolt.container);
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

			console.log('AddStickk:', point, this.selectedPoint)

			

			var s = new Stick({a:point, b:this.selectedPoint});
			

			this.model.get('sticks').add(s);


			 
			
			// var i = this.points.length;
			// var insert = true;
			// while( --i > -1 ) {
			// 	if(this.points[i] === point) {
			// 		insert = false;
			// 	}
			// 	this.points[i].setSelected(false);
			// 	if(this.points[i].y < this.scaffoldHeight) this.scaffoldHeight = this.points[i].y;
			// }
			// if(insert) this.points.push(point);
			// this.sticks.push(s);
			//this.selectedPoint.setSelected(false);
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