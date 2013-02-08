define(['backbone', 
		'jquery', 
		'easel', 
		'model/stick', 
		'underscore', 
		'model/point', 
		'view/bolt', 
		'view/rod',
		'view/World',
		'view/RodLengthIndicator',
		'model/GameData'], 
	function(Backbone, $, E, Stick, _, Point, Bolt, Rod, World, RodLengthIndicator, GameData) {

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

			this.indicator = new RodLengthIndicator({model:this.selectedPoint});
			
			
			E.Ticker.useRAF = true;
			E.Ticker.setFPS(30);

			
			this.stage.width =  1000;
			$(window).resize(this.resize);	
		},

		

		addHud : function() {
			this.indicator.model = this.selectedPoint;
			this.scaffold.addChildAt(this.indicator.container, 1);
			this.renderHud = true;
		},

		removeHud: function() {
			this.renderHud = false;
			this.scaffold.removeChild(this.indicator.container);
		},

		drawBG: function() {
			this.bg.graphics.clear();
			this.bg.graphics.beginFill('#00bfff')
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
       		this.stage.canvas.height = window.innerHeight-32;      
			this.scaffold.x = window.innerWidth * .5;
			this.scaffold.y = window.innerHeight - window.innerHeight / 100 * 28;
			this.drawBG();
		},

		start:function() {
			this.resize();
			E.Ticker.addListener(this);
		},

		stop: function() {
			this.removeHud();
			E.Ticker.removeListener(this);	
		},

		setFeature: function(feature) {
			this.feature = feature;
			

			switch(feature.get('type')){
				case 0 : 
					this.feature.set({maxLength:0});
				break;
				case 1 :
					this.feature.set({maxLength:200});
				break;
				case 2 :
					this.feature.set({maxLength:400});
				break;
				case 3 :
					this.feature.set({maxLength:200});
				break;
				case 4 :
					this.feature.set({maxLength:400});
				break;
				case 5 :
					this.feature.set({maxLength:200});
				break;
				case 6 :
					this.feature.set({maxLength:400});
				break;
			}
			
		},

		render : function() {

			//console.log('======= =GameEngine:render', this.model.get('sticks'));
			this.stop();
			this.scaffoldHeight = 0.0;

			_.each(this.objects, function(obj){
				obj.release();
			})

			this.objects.length = 0;
				this.model.off('points').on('add', this.addBolt);
				this.model.off('sticks').on('add', this.addRod);
			this.model.set('height', 0.0);
			this.selectedPoint = null;

			
			var that = this;
			
				this.second =  true;
				this.model.get('points').on('add', this.addBolt);
				this.model.get('sticks').on('add', this.addRod);
				this.model.get('points').each(function(point){
					//console.log('AddPoint', point)
					this.addBolt(point);
				}, this);
				this.model.get('sticks').each(function(stick){
					//console.log('Addstick', stick)
					this.addRod(stick);
				}, this);
			
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
			if(this.feature.get('type') == 0) {
				bolt.model.set('fixed', true);
				bolt.draw();
				this.feature.set({used: this.feature.get('used')+1})
				if(this.feature.get('amount') == this.feature.get('used')) {
					this.trigger('feature_run_out', this.feature);
				}	
				return;
			}

			if(this.selectedPoint && this.selectedPoint != bolt.model) {
				this.addStick(bolt);
				return;
			}
			this.selectedPoint = bolt.model;
			bolt.setSelected(true);
			this.addHud();
		},


		addPoint : function(e) {
			point = new Point({x: (e.stageX - this.scaffold.x) / this.scaffold.scaleX, y: (e.stageY - this.scaffold.y) / this.scaffold.scaleY});
			var dx = point.get('x') - this.selectedPoint.get('x');
			var dy = point.get('y') - this.selectedPoint.get('y');
			var d = Math.sqrt(dx*dx + dy*dy);

			if(d > this.feature.get('maxLength')) {

				return null
			}
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
			
			if(point instanceof Point) {
				var dx = point.get('x') - this.selectedPoint.get('x');
				var dy = point.get('y') - this.selectedPoint.get('y');
				var d = Math.sqrt(dx*dx + dy*dy);
				if(d > this.feature.get('maxLength')) {

					return null
				}
			}else {
				return null;
			} 


			var s = new Stick({a:point, b:this.selectedPoint, type:this.feature.get('type')});



			
			this.model.get('sticks').add(s);
			var points = this.model.get('points'); 
			points.each(function(point) {				
				if(point.get('y') < this.scaffoldHeight) this.scaffoldHeight = point.get('y');
			}, this);
			this.model.set('height', Math.round(0.1*this.scaffoldHeight) / -10);
			this.selectedPoint = null;
			delete this.bg.onPress;
			var pX = this.scaffold.localToGlobal(0, this.scaffoldHeight);
			this.removeHud();

			this.feature.set({used: this.feature.get('used')+1})
			if(this.feature.get('amount') == this.feature.get('used')) {
				this.trigger('feature_run_out', this.feature);
			}	
		},

		tick: function() {
			//console.log('tick')	
			var points = this.model.get('points').models;
			i = points.length;
			var point;
			while( --i > -1 ) {
				point = points[i];
				point.set({y: point.get('y') + 1});
				point.update();
			}
			var sticks = this.model.get('sticks').models;
			i = sticks.length;
			while( --i > -1 ) {
				sticks[i].update();
			}
			i = sticks.length;
			var stick;
			while( --i > -1 ) {
				stick = sticks[i];
				switch(stick.get('type')) {
					case 3 :
						stick.update();
					break;
					case 4:
						stick.update();
					break;

					case 5 :
						stick.update();
					break;
					case 6:
						stick.update();
					break;
				}
			}

			i = sticks.length;
			while( --i > -1 ) {
				stick = sticks[i];
				switch(stick.get('type')) {

					case 5 :
						stick.update();
					break;
					case 6:
						stick.update();
					break;
				}
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

			if(this.renderHud) {
				var mouse = this.scaffold.globalToLocal(this.stage.mouseX, this.stage.mouseY);
				var dx = mouse.x - this.selectedPoint.get('x');
				var dy = mouse.y - this.selectedPoint.get('y');
				var d = Math.sqrt(dx*dx + dy*dy);
				this.indicator.render(mouse, Math.min(d, this.feature.get('maxLength') ));
			}
						
			this.stage.update();
		}
	});
});