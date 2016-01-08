;(function(){
var is = utils.is, 
	copy = utils.copy,
	mod = utils.mod,
	sfn = utils.sfn;

html = HTMLElement = mod.clone({
	type: "HTMLElement",
	name: "HTMLElement",
	tag: "div",
	classes: [],
	attr: [],
	children: [], // strings, HTMLElements
	addClass: function(css){
		this.classes.push(css);
	},
	addAttr: function(attr){
		this.attr.push(attr);
	},
	removeClass: function(css){
		var index = this.classes.indexOf(css);
		if (index > -1)
			this.classes.splice(index, 1);
	},
	removeAttr: function(attr){
		var index = this.attr.indexOf(attr);
		if (index > -1)
			this.attr.splice(index, 1);
	},
	addChild: function(child){
		this.children.push(child);
	}, 
	// what if 2+ of the same child?
	removeChild: function(child){
		var index = this.children.indexOf(child);
		if (index > -1)
			this.children.splice(index, 1);
	},
	data: function(){
		// return JSON
		return {
			type: this.type,
			name: this.name,
			tag: this.tag,
			classes: this.classes,
			// attr: // loop through attributes and get their .data()
			children: this.getChildrenData(),
			clones: this.getClonesData()
		};
	},
	getClonesData: function(){
		
	},
	getChildrenData: function(){
		var childrenData = [], child;
		for (var i = 0; i < this.children.length; i++){
			child = this.children[i];
			if (is.str(child))
				childrenData.push(child);
			else if (child.data)
				childrenData.push(child.data());
		}
		return childrenData;
	},
	save: function(){
		if (this.name == "DefaultTemplate"){
			console.log('Must give the template a name!');
			return false;
		}
		// use this.data() with localStorage, for now.
		// this depends on name/path.  

		// store as Type.Name.Data

		if (!this.name){
			throw "Must have a name to be saved!";
		}

		store.set(this.name, this.data());
	},
	render: function(){
		var child, $el = $("<" + this.tag + ">").addClass(this.classes.join(' '));
		for (var i = 0; i < this.children.length; i++){
			child = this.children[i];
			if (is.str(child))
				$el.append(child);
			else if (child.render)
				$el.append(child.render())
		}
		return $el;
	},
	loadAll: function(){
		var instances = {}, data = store.get(this.type);
		for (var i in data){
			instances[i] = this.clone(data[i]);
		}
		return instances;
	},
	clone: function(p){
		var c = this.copy().assign(p);
		if (c.init) c.init.apply(c, arguments);
		this.addClone(c);
		return c;
	},
	addClone: function(c){
		this.$clones = this.$clones || [];
		this.$clones.push(c);
	}
});

})();