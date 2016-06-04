;(function(){
var is = utils.is, 
	copy = utils.copy,
	mod = utils.mod,
	sfn = utils.sfn;

EQ = Q.clone({
	init: function(){
		this.appended = Q.clone({
			ctx: this
		});
	},
	append: function(cb){
		this.cbs.push(cb);
		this.appended.exec(cb);
		return this;
	}
});

})();