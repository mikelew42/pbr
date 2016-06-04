;(function(){
var is = utils.is, 
	copy = utils.copy,
	mod = utils.mod,
	sfn = utils.sfn,
	log = false;

Property = mod2.clone({
	name: 'UnnamedProperty',
	value: undefined,
	props: {
		mod: "dnc"
	},
	getter: function(){
		return this.value || this;
	},
	setter: function(value){
		if (value.defineOnto)
			value.defineOnto(this.mod); // essentially, replace the whole Property object
		else 
			this.set(value); 
	},
	defineOnto: function(mod){
		log && console.log('defineOnto');
		var prop = this, name = this.name;
		this.mod = mod;
		mod.props = mod.props || {};
		mod.props[name] = this;
		Object.defineProperty(mod, name, {
			get: function(){
				// console.log('mod.' + name + ' get');
				return this.props[name].getter();
			},
			set: function(value){
				return this.props[name].setter(value);
			},
			configurable: true,
			enumerable: true
		});
		return this;
	},
	set: function(value){
		log && console.log('.' + this.name + ' set', value);
		// different for value objects, views, etc.
		if (value !== this.value)
			this.change(value);
		return this;
	},
	change: function(value){
		log && console.log('.' + this.name + ' change', value);
		this.value = value;
		return this; // probably not necessary... when would you chain on the prop obj?
			// also, this should be an auto q, not a normal upgraded fn.
	}
	// or
	// set: function(value){
	// 	if (value !== this.value){
	// 		this.value = value;
	// 		this.change.exec();
	// 	}
	// 	return this;
	// },
	// change: autoQ()
});

/*
Distinction between:
Upgraded Fn with fn.deps, fn.before, fn.fn, fn.then, fn.after...
VS
Auto Q:  mod.autoQ(cb), mod.value.change(cb) instead of mod.value.change.then(cb);

In this case, set can't be a normal upgraded fn, AND an autoQ
Many functions might not need an actual function - such as change, because it can
be performed from within set.  However, the problem here is that if half of them
allow you to just pass the cb directly:  mod.whatever(cb), and half of them require
you to use then:  mod.whatever.then(cb), then we have a little conflict.

The mod.whatever(cb) could be a convenience/shortcut to whatever.then, but this introduces
another issue:  if its a real function, such as the change function above, then when you 
try to set mod.value.change(cb), it will actually execute the function.

Maybe Q's are just noops then?  change: function(){}... auto upgrades it, and allows you
to add change.then(cb).  But, what is "then", then?  

I suppose the confusion is tolerable.  You just have to make sure you know a Q from an upgraded fn.
*/


Reference = Property.clone({
	reference: true,
	props: {
		value: 'reassign'
	}
});


})();