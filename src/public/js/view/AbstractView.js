define(

	['backbone'], 

	function(Backbone) {

	return Backbone.View.extend({


		initialize : function() {
			this.children = [];
		},


		release : function() {
			_.each(this.children, function(child){
				child.release();
			});
			this.remove();
			this.unbind();
			this.children.length = 0;
			this.children = null;
			return this;
		}

	});
});