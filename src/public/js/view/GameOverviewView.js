define(
	['backbone',
	'text!templates/game-end.html',
	'facebook'],
	function(Backbone, template, FB) {
		return Backbone.View.extend({	

			initialize: function() {
				_.bindAll(this, 'postRender')
			},

			render:function () {

				FB.api('/me/friends', this.postRender );
				

				return this;
			},

			postRender:function(response) {
					var friends = new Backbone.Collection(response.data);
					var user = this.model.get('user');
					this.model.get('game').get('data').each(function(data){
						if(data.get('fbID') == user.get('fbID')) {
							data.set({fbName: user.get('facebook').name, mine:true});	
						}else {
							data.set({fbName: 'TESTT' + friends.where({id:data.get('fbID')})});	
						}
						
					}, this);
					
					//this.model.get('game').get('data').sort('height')

					this.$el.empty().append(_.template(template, this.model.get('game').toJSON()));
				}
		});
	});