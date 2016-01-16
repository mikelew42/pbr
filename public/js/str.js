;(function(){
var is = utils.is, 
	copy = utils.copy,
	mod = utils.mod,
	sfn = utils.sfn;

/* the way in which items could be saved (local, db, files, etc) can vary,
and their IDing, looking/querying would vary also. */
str = mod.clone({
	type: "str",
	children: [],
	init: function(){
		this.render();
	},
	render: function(){
		this.$el = $("<div>").addClass('str').appendTo('body');
		if (this.name)
			this.$label = $("<div>").addClass('label').html(this.name).appendTo(this.$el);
		this.$val = $("<div>").addClass('val').appendTo(this.$el);
		this.$addText = $("<input>").appendTo(this.$el);
		var s = this;
		this.$addBtn = $("<button>").appendTo(this.$el).html('add').click(function(){
			var ss = strings||{};
			if (ss.hasOwnProperty(s.$addText.val())){
				s.realAdd(s.$addText.val(), ss[s.$addText.val()]);
			} else {
				s.add(s.$addText.val());
				
			}
			s.rerenderVal();
			s.$addText.val('');
		});
		this.rerenderVal();
	},
	rerenderVal: function(){
		this.$val.html(this.value());
	},
	add: function(str){

		this[str] = text.clone({ val: str });
		this.children.push(str);
		this.rerenderVal();
	},
	realAdd: function(n, v){
		this[n] = v;
		this.children.push(n);
		// this.rerenderVal();m
	},
	remove: function(n){
		var index = this.children.indexOf(this[n]);
		if (index > -1)
			this.children.splice(index, 1);
		delete this[n];
	},
	data: function(){
		var cdata = {};
		for (var i = 0; i < this.children.length; i++){
			cdata[this.children[i]] = this[this.children[i]].data();
		}
		return {
			type: this.type,
			cdata: cdata
		};
	},
	save: function(){
		if (!this.name){
			throw "Must have a name to be saved!";
		}

		store.set(this.name, this.data());
	},
	value: function(){
		// console.mlog(this);
		var glue = this.glue || " ", ret = "";
		for (var i = 0; i < this.children.length; i++){
			if (i > 0)
				ret += glue;
			ret += this[this.children[i]].value();
		}
		return ret;
	}
});

text = mod.clone({
	type: "text",
	val: "",
	data: function(){
		return {
			type: this.type,
			val: this.val
		}
	},
	value: function(){
		return this.val;
	}
});

})();