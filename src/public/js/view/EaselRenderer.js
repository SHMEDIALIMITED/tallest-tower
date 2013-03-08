define(
        [   'backbone',
            'view/Bolt'],

    function(Backbone, Bolt) {


         return function(assets) {

             var _objects = [];

             var Renderer = _.extend({


                 addBolt : function(point) {
                     var bolt = new Bolt({model:point, assets:assets});
                     bolt.on('selected', this.onBoltSelected)
                     this.scaffold.bolts.addChild(bolt.container);
                     this._objects.push(bolt);
                 },

                 onBoltSelected : function(point) {
                    this.trigger('bolt_selected', point);
                 },

                 addRod : function(stick) {

                 },

                 render : function() {

                 }
             }, Backbone.Events);

             return new Renderer();
         }
 });
