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
				height : 100
			},

			parse : function(response) {

				console.log('GameData::parse', response);


				response.points = new Points(response.points, {parse:true})
					
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
				response.sticks = new Points(response.sticks, {parse:true});

				return response;
			},

			toJSON: function() {
				var json = _.clone(this.attributes);
				json.sticks = this.get('sticks').toJSON(); 
				json.points = this.get('points').toJSON(); 
				return json;
			}

		});
	});