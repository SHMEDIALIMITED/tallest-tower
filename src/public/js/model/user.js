define(['backbone', 
		'model/points', 
		'model/point', 
		'model/sticks'], 

function(Backbone, Points, Point, Sticks) {

	return Backbone.Model.extend({
		url : '/api/users',

		defaults : {
			points : new Points([new Point({x: -100, y: 0, fixed:true}), new Point({x:100, y:0, fixed:true})]),
			sticks : new Sticks([])
		},


		

		parse : function(response) {
			console.log('USER:RESPONSE', response)
			
			//
			
			response.points = this.get('points').reset(response.points);
			//
				
			_.each(response.sticks, function(stick) {
				stick.a = getPointByPosition(stick.a.x, stick.a.y);
				
				stick.b = getPointByPosition(stick.b.x, stick.b.y);
				//console.log(stick);
			});

			console.log(response.sticks)

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
            
            console.log('USER:RESPONSE', response)

            
            
		},

		toJSON: function() {
			var json = _.clone(this.attributes);
			json.sticks = this.get('sticks').toJSON(); 
			json.points = this.get('points').toJSON(); 
			return json;
		}
	});


	function nestCollection(model, attributeName, nestedCollection) {
	    //setup nested references
	    for (var i = 0; i < nestedCollection.length; i++) {
	      model.attributes[attributeName][i] = nestedCollection.at(i).attributes;
	    }
	    //create empty arrays if none
	 
	    nestedCollection.bind('add', function (initiative) {
	      if (!model.get(attributeName)) {
	        model.attributes[attributeName] = [];
	      }
	      model.get(attributeName).push(initiative.attributes);
	    });
	 
	    nestedCollection.bind('remove', function (initiative) {
	      var updateObj = {};
	      updateObj[attributeName] = _.without(model.get(attributeName), initiative.attributes);
	      model.set(updateObj);
	    });
	    return nestedCollection;
	}
})