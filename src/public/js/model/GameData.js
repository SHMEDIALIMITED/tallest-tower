define(	['backbone',
		'model/points',
		'model/point',
		'model/sticks'],

	function(	Backbone, 
				Points, 
				Point, 
				Sticks) {

		return Backbone.Model.extend({


			defaults : {
				points : new Points([new Point({x: -100, y: 0, fixed:true}), new Point({x:100, y:0, fixed:true})]),
				sticks : new Sticks([]),
				height : 0
			},

			parse : function(response) {
		
				response.points = this.get('points').reset(response.points)
					
				_.each(response.sticks, function(stick) {
					stick.a = getPointByPosition(stick.a.x, stick.a.y);
					stick.b = getPointByPosition(stick.b.x, stick.b.y);
				});

				function getPointByPosition(x, y) {
					var i = response.points.length,
						point;
					while(--i > -1 ) {
						point = response.points.at(i);
						if(point.get('x') == x && point.get('y') == y) {
							return point;
						}
					}
					
				}
				
				response.sticks = this.get('sticks').reset(response.sticks); 
			},

			toJSON: function() {
				var json = _.clone(this.attributes);
				json.sticks = this.get('sticks').toJSON(); 
				json.points = this.get('points').toJSON(); 
				return json;
			}

		});
	});