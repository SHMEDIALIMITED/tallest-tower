define(
	
		['backbone',
		'view/FeatureListItemView'],

function(Backbone, FeatureListItemView) {
			
	return Backbone.View.extend({

		tagName: 'ol',

		id: 'feature-list',	

		

		initialize : function(options) {
			this.user = options.user; 
			console.log('LIST ', this.collection);
			this.childern = [];
			this.listenTo(this.collection, "reset", this.render);
			this.listenTo(this.user, "change:cash", this.processList);
		},	



		render: function() {
			console.log('feature-list:: render')
			this.$el.empty();
			var child = this.childern.pop();
			while(child) {
				
				child.release();
				child = this.childern.pop();	
			}
			
			var itemView;
			
			this.collection.each(function(item){
				console.log(item)
				itemView = new FeatureListItemView({model:item});
				if(item.get('price') > this.cash) {
					itemView.disable();
				}else {
					itemView.enable();
				}	
				itemView.on('clicked', this.processList, this);
				this.childern.push(itemView);
				this.$el.append(itemView.render().el);
			}, this); 

			this.processList();
		},

		processList : function(model) {
			console.log('------- Process List --------');



			this.total = 0;
			var cash = this.user.get('cash');
			
			_.each(this.childern, function(item) {
				if(item.model.get('price') > cash) {
					item.disable();
				}
			}, this);


			_.each(this.childern, function(item) {
				if(item.getSelected()) {
					this.total += item.model.get('price');
				}
			}, this);


			if(this.cash < this.total) {
				_.last(this.childern, function(item) {
					//item.
				}, this);
			}else {
				var remainder = cash - this.total;
				_.each(this.childern, function(item) {
					if(item.model.get('price') > remainder) item.disable();
					else item.enable();
				}, this);

			}
			this.model.set({value:this.total});
		},	

		getData : function() {
			var data = [];
			_.each(this.childern, function(item) {
				if(item.getSelected()) {
					data.push(item.model.get('_id'));
				}
			});
			return data;
		}



		
	});

});