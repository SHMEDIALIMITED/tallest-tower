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
		'model/GameData',
		'preload',
		'SignalMap',
		'model/AssetPool'], 
	function(Backbone, $, E, Stick, _, Point, Bolt, Rod, World, RodLengthIndicator, GameData, Loader, SignalMap, AssetPool) {

	return Backbone.View.extend({
		tagName: 'canvas',
		stage : null,
		scaffold : null,
		bg : null,
		selectedPoint : null,
		scaffoldHeight : 0.0,
		objects: [],

		lift :0,
		delta: 0 ,
		initialize: function() {
			
				
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
			this.stage.addChild(this.world.container)
			this.scaffold.addChild(this.scaffold.rods)
			this.scaffold.addChild(this.scaffold.bolts);
			this.scaffold.y = 0;
			this.stage.addChild(this.scaffold);


			this.indicator = new RodLengthIndicator({model:this.selectedPoint});
			
			
			E.Ticker.useRAF = true;
			E.Ticker.setFPS(30);

			
			this.stage.width =  1000;
			$(window).resize(this.resize);

			//debugger;
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
			this.bg.graphics.beginFill('#efefef')
				.drawRect(0,0,this.el.width, this.el.height)
				.beginFill(null);	
		},

		resize : function() {
			if(window.innerWidth > 500) {
				this.scaffold.scaleX = this.scaffold.scaleY = 1;
			}else {
				this.scaffold.scaleX = this.scaffold.scaleY = 0.7;
			}
			this.stage.canvas.width = window.innerWidth;
       		this.stage.canvas.height = window.innerHeight-32;      
			this.scaffold.x = this.world.container.x = window.innerWidth * .58;
			this.scaffold.y = window.innerHeight - 232;
			this.world.container.y = 200;
			this.delta = 0;

			//this.world.container.x +=450;;
			
			this.drawBG();
			this.world.resize();
		},

		up : function() {
			if(this.lift <= 0) this.lift = 0;
			this.lift += 6 + this.lift;
			console.log(this.lift)
		},

		down : function() {
			if(this.lift >= 0) this.lift = 0;
			this.lift -= 6 - this.lift;
		},

		start:function() {
			_.each(this.objects, function(obj){
				obj.release();
			})

			this.objects.length = 0;
				this.model.get('points').on('add', this.addBolt);
				this.model.off('sticks').on('add', this.addRod);
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

			console.log('======= =GameEngine:render', this.model.toJSON());
			this.stop();
			this.scaffoldHeight = 0.0;



			
				if(!AssetPool.loaded()) {
					AssetPool.add('img/bolt.png');
					AssetPool.add('img/game/fixed_bolt.png');
					AssetPool.add('img/metal_rod.png');
					AssetPool.add('img/bamboo_rod.png');
					AssetPool.add('img/copper_rod.png');
					AssetPool.add('img/worlds/basic.png');
					AssetPool.add('img/worlds/basic.json');
				}

				AssetPool.on('complete', function() {
					this.world.model = this.model;
					this.world.load(AssetPool.get('img/worlds/basic.json'), AssetPool.get('img/worlds/basic.png'));

						SignalMap.engineReady.dispatch(this);
				}, this);

				AssetPool.load();

			
			
			return this;
		},
		
		addRod : function(stick) {
			var rod = new Rod({model:stick, assets:AssetPool});
			this.scaffold.rods.addChild(rod.container);
			this.objects.push(rod);
		},

		addBolt : function(point){
			var bolt = new Bolt({model:point, assets:AssetPool});
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
			this.model.dirty = true;
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
			this.scaffoldHeight = 0.0;
			while( --i > -1 ) {
				point = points[i];
				point.set({y: point.get('y') + 1});
				point.update();
				if(point.get('y') < this.scaffoldHeight) this.scaffoldHeight = point.get('y');

			}
			this.model.set('height', Math.round(0.1*this.scaffoldHeight) / -10);
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
				this.lift *= 0.88;
				this.scaffold.y += 3 * this.lift;
				this.scaffold.y = Math.max(this.scaffold.y ,window.innerHeight  -500)
				this.delta = this.scaffold.y;
				this.world.render(this.scaffold.y);
			var pX = this.scaffold.localToGlobal(0, this.scaffoldHeight);
			if(pX.y < 150) {
				
				//this.drawBG();
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
		},

	});
});