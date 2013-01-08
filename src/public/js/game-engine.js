define(['backbone', 'jquery', 'easel', 'bolt', 'stick', 'underscore'], 
	function(Backbone, $, E, Bolt, Stick, _) {
	return Backbone.View.extend({
		el: '#game-engine',
		stage : null,
		points : [],
		sticks : [],
		scaffold : null,
		bg : null,
		selectedPoint : null,
		scaffoldHeight : 0.0,
		initialize: function() {

			 _.bindAll(this, 'onPointSelected');
			 _.bindAll(this, 'createStick');

			this.el.width = 760;
			this.el.height = 500;
			
			this.stage = new E.Stage(this.el);
			this.stage.enableMouseOver(30);

			console.log(this.stage)

			this.bg = new E.Shape();
			this.bg.graphics.beginFill('#999')
				.drawRect(0,0,this.el.width, this.el.height)
				.beginFill(null);
			this.stage.addChild(this.bg);

			this.scaffold = new E.Container();	
			this.scaffold.y = 300;
			this.stage.addChild(this.scaffold);


			var p2 = new Bolt(200,0, true);
			this.points.push(p2);
			p2.onPress = this.onPointSelected;
			
			var p3 = new Bolt(400,0, true);
			this.points.push(p3);
			p3.onPress = this.onPointSelected;

			this.scaffold.addChild(p2, p3);

			E.Ticker.addListener(this);
			E.Ticker.useRAF = true;
			E.Ticker.setFPS(30);

		},

		onPointSelected: function(e) {
			console.log(this.bg)
			this.bg.onPress = this.createStick;
			if(this.selectedPoint && this.selectedPoint != e.target) {
				this.createStick(e.target);
				return;
			}
			this.selectedPoint = e.target;
			this.selectedPoint.setSelected(true);
		},

		createStick: function(e) {
			var point;
			if(e instanceof Bolt) {
				point = e;
			}else {
				point = new Bolt(e.stageX, e.stageY - this.scaffold.y);
				point.onPress = this.onPointSelected;				
				this.scaffold.addChild(point);
			}
			var s = new Stick(point, this.selectedPoint, null, null);
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
			console.log(pX);
		},

		tick: function() {
			
			var i = this.points.length;
			while( --i > -1 ) {
				this.points[i].setY(this.points[i].y + 1);
				this.points[i].update();
			}
			
			var j = 1;
			while( --j > -1) {
				i = this.sticks.length;
				while( --i > -1 ) this.sticks[i].update();			
			}
			
			
			var pX = this.scaffold.localToGlobal(0, this.scaffoldHeight);
			if(pX.y < 150) {
				this.scaffold.y++;
			}
		
			
			this.stage.update();
		}
	});
});