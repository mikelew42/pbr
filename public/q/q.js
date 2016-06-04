;(function(){
var is = utils.is, 
	copy = utils.copy,
	mod = utils.mod,
	sfn = utils.sfn;

Q = sfn(function(cb){
	if (is.fn(cb)) return this.append(cb);
	else this.exec.apply(this, arguments);
}, {
	init: function(){
		this.$cbs = [];
	},
	append: function(cb){
		this.$cbs.push(cb);
		return this;
	},
	exec: function(){
		var last;
		for (var i = 0; i < this.$cbs.length; i++){
				// could append last to the args as { last: last }
			last = this.$cbs[i].apply(this.$ctx || this, arguments);
		}
		return last;
	}
});

// console.dir(Q)

})();