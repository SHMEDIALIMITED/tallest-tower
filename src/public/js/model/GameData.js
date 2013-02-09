define(	['backbone',
		'model/points',
		'model/point',
		'model/sticks'],

	function(	Backbone, 
				Points, 
				Point, 
				Sticks) {

		return Backbone.Model.extend({



			defaults : function() {
				return {
					height : 0,
					features : new Backbone.Collection()
				}
			},


			parse : function(response) {

				
				//console.log('GameData::parse ', response)
				if(!this.get('sticks')) {
					
					this.set('sticks', new Sticks());
				}

				if(!this.get('points')) {
					
					this.set('points', new Points([new Point({x: -100, y: 0, fixed:true}), new Point({x:100, y:0, fixed:true})]));
				}
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

								

				if(!this.get('features')) {
					
					this.set('features', new Backbone.Collection());
				}
				response.features = this.get('features').reset(response.features, {parse:true});
				

				
				response.sticks = new Sticks(response.sticks, {parse:true});
				
				//console.log('GameData::parsed ', response)

				return response;
			},

			toJSON: function() {
				var json = _.clone(this.attributes);

				if(!this.get('sticks')) {
					
					this.set('sticks', new Sticks());
				}

				if(!this.get('points')) {
					
					this.set('points', new Points([new Point({x: -100, y: 0, fixed:true}), new Point({x:100, y:0, fixed:true})]));
				}
				json.sticks = this.get('sticks').toJSON(); 
				json.points = this.get('points').toJSON(); 
				return json;
			}, 

			resetToDefaults : function() {
				this.attributes = this.defaults();
			}

		});
	});