;(function(){
var is = utils.is, 
	copy = utils.copy,
	mod = utils.mod,
	sfn = utils.sfn,
	log = true;

log && console.group('view.js');

// configure as a FF
// div = View(); // returns a div factory, or
// MyView = View(); // returns your own factory
// div() or MyView() clone, convert to instances, and apply the args (which should then be "set")

/* The main convenience we're looking for is when composing templates:

one(two(), three())

So, if we have to say View.factory() to create a factory, that's fine... No need to jostle them around */

View = sfn({
	children: [],
	classes: [],
	type: "view",
	tag: "div",
	attributes: [],
	init: function(){
		this.set.apply(this, arguments);
		return this;
	},
	set: function(a, b, c){
		var arg;
		for (var i = 0; i < arguments.length; i++){
			arg = arguments[i];
			if (arg && arg.render){
				// treat as view
				this.addChild(arg);
			} else if (is.obj(arg)){
				this.addObj(arg);
			} // else if arg.installable --> this.install(arg) ?
			// that would allow myItem = item(one(), two(), expandable)
		}
		return this;
	},
	addChild: function(view){
		this.addReference(view);
		if (!view.$p)
			view.$p = this;
		this.children.push(view);
	},
	removeChild: function(view){
		var index = this.children.indexOf(view), removed;
		if (index > -1)
			removed = this.children.splice(index, 1)[0];

		// delete the this.type reference
		if (removed && this[removed.type] === removed)
			delete this[removed.type];

		return this;
	},
	deleteProp: function(prop){
		delete this[prop];
	},
	swapChild: function(replaceMe, withMe){
		var index = this.children.indexOf(replaceMe), removed;
		if (index > -1)
			removed = this.children.splice(index, 1, withMe)[0];

		// delete the this.type reference
		if (removed && this[removed.type] === removed)
			delete this[removed.type];

		return this;
	},
	addObj: function(obj){
		this.assign(obj);
		return this;
	},
	addClass: function(c){
		this.classes.push(c);
		if (this.$el)
			this.$el.addClass(c);
		return this;
	},
	removeClass: function(c){
		var index = this.classes.indexOf(c);
		if (index > -1)
			this.classes.splice(index, 1);
		return this;
	},
	render: function(){
			log && console.group( (this._name ? this._name : "") + "{" + this.type + "}" + ".render()");
		this.renderSelf();
		this.renderChildren();
			log && console.log('render complete');
			log && console.dir(this);
			log && this.contents && console.dir(this.contents.$el);
			log && console.groupEnd();
		return this.$el;
	},
	renderSelf: function(){
		this.$el = $("<"+this.tag+">").addClass(this.classes.join(' '));
	},
	renderChildren: function(){
		log && console.groupCollapsed('renderChildren');
		for (var i = 0; i < this.children.length; i++){
			log && console.group('child ', i);
			this.$el.append(this.children[i].render());
			if (this.children[i].type === "contents")
				console.log(this.children[i] === this.contents);
			log && console.dir(this.children[i]);
			log && console.groupEnd();
		}
		log && console.groupEnd();
	},
	factory: function(){
		// do we want to init?
		// we need to be able to set the stuff...
		var f = this.copy();
		// f.set.apply(f, arguments); // if a simple view like text overrides set, then this fails to assign properties
		View.set.apply(f, arguments);
		f.main = f.create;
		return f;
	},
	create: function(a){
		// var instance = this.clone.apply(this, arguments); // clone is copy + assign + init...
		// in this case, let set do the assigning
		var instance = this.copy();
		// init before or after set?  let's try after, so that A) you can override init and it will run B) so assigned props will be available in init
		/* we could conditionally assign init, then check for init and call it, 
		and then let init call set.  this way its completely configurable 

		!important:  init override has to be on first arg a */
		if (a && !a.render && a.init)
			instance.init = a.init;

		// init should call set
		instance.init && instance.init.apply(instance, arguments);

		// this is for later
		instance.main = instance.set;
		return instance;
	},
	copy: function(){
		return copy(this, null, true).addReferencesFromChildren();
	},
	addReferencesFromChildren: function(){
		for (var i = 0; i < this.children.length; i++){
			this.addReference(this.children[i]);
		}
		return this;
	},
	addReference: function(view){
		this["$"+view.type] = view;
		return this;
	}
});

View.main = View.factory;

// generic view factory
// view('class es', {attr?} || attr('name', 'value'), contents)
view = View();

text = View({
	type: "text",
	classes: ['text'],
	set: function(text){
		this.text = text;
		return this;
	},
	renderChildren: function(){
		this.$el.html(this.text); 
	}
});

log && console.groupEnd();

})();