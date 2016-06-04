;(function(){
var is = utils.is, 
	copy = utils.copy,
	mod = utils.mod,
	sfn = utils.sfn;

Value = sfn(function(){
	if (arguments.length){
		return this.set.apply(this, arguments);
	} else {
		return this.get.call(this);
	}
}, {
	init: function(){
		this.change = EQ.clone({
			ctx: this
		});
	},
	get: function(){
		return this.value;
	},
	set: function(newValue){
		if (this.value !== newValue){
			this.value = newValue;
			this.change();
		}
		return this;
	}
});

})();