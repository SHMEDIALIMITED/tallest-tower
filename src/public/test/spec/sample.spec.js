describe('Model : Sample', function() {
	
	var model;

	beforeEach(function() {
		var flag = false;
		require(['model'], function(Model) {
			model = new Model({name:'Foo', time: new Date()});
			flag = true;
		});

		waitsFor(function() {
      		return flag;
    	});
	});

	it('Shold have a name vale of Foo', function() {
		expect(model.get('name')).toEqual('Foo');
	});

	it('Should be a number other than 0', function() {
		expect(model.get('time')).toBeGreaterThan(0);
	});
});