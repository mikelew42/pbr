;(function(){

var utils = window.utils = window.utils || {};



/*****************
	CLICK OFF
******************/
if (jQuery){
	jQuery.fn.clickOff = function(cb){
		this.each(function(){
			var $self = this;
			jQuery(document).click(function(e){
				if (!jQuery(e.target).closest($self).length)
					cb();
			});
		});
	};
}




/***********
	IS
************/
var is = utils.is = {
	arr: function(value){
		return toString.call(value) === '[object Array]';
	},
	obj: function(value){
		return typeof value === "object" && !is.arr(value);
	},
	val: function(value){
		return ['boolean', 'number', 'string'].indexOf(typeof value) > -1;
	},
	str: function(value){
		return typeof value === "string";
	},
	num: function(value){
		return typeof value === "number";
	},
	bool: function(value){
		return typeof value === 'boolean';
	},
	fn: function(value){
		return typeof value === 'function';
	},
	sfn: function(value){
		return is.fn(value) && value.Base;
	},
	def: function(value){
		return typeof value !== 'undefined';
	},
	undef: function(value){
		return typeof value === 'undefined';
	},
	simple: function(value){ // aka non-referential
		return typeof value !== 'object' && !is.fn(value); // null, NaN, or other non-referential values?
	}
};




/************
	COPY
*************/
var getBase = function(value){
	return (value.Base && value.Base()) || 
			(is.obj(value) && {}) || 
			(is.arr(value) && []);
};

var returnable = function(value){
	return !is.def(value) || is.val(value) || (is.fn(value) && !value.Base);
};

var copy = utils.copy = function(value, base, skip){
								// this is necessary to maintain ctx arg
	if(value && value.copy && !skip)
		return value.copy();

	if (returnable(value))
		return value;
	
	base = base || getBase(value);

	for (var i in value){
		if (i[0] === "$")
			continue;
		base[i] = copy(value[i], null);
	}

	return base;
};

utils.copy.oo = function(){
	return copy(this, null, true);
};

utils.copyTo = function(base){
	return copy(this, base);
};

/* 

With this setup (separating copy and stdCopy), 
we can avoid the "skip" argument.

copy2(mod) will correctly use mod.copy()

mod.copy() will use stdCopy(this), which essentially
is the same thing as skipping the oo.copy check

*/
var copy2 = function(value, base){
	if (value && value.copy)
		return value.copy();
		// add a check for base, and forward to copyTo?
	return stdCopy(value, base);
};

var getBase2 = function(value){
	// return (value.base && value.base.copy && value.base.copy()) ||
		return (is.obj(value) && {}) ||
		(is.arr(value) && []);
};

var stdCopy = function(value, base){
	if (returnable(value))
		return value;

	base = base || getBase(value);

	return copyIterate(value, base);
};

var copyIterate = function(value, base){
	var log = false;
	log && console.groupCollapsed('copyIterate');

	var propsKeys = Object.keys(value.props || {});

	for (var i in value){
		log && console.log(i);
		if (i[0] === "$" || propsKeys.indexOf(i) > -1)
			continue;
		
		base[i] = copy2(value[i]);
	}

	if (base.props){
		for (var i in base.props){
			if (is.str(base.props[i])){
				switch(base.props[i]){
					case 'reassign':
						base[i] = value[i];
						break;
					case 'dnc':
						break;
					case "copy":
					default:
						base[i] = copy2(value[i]);
						break;
				}
			} else if (base.props[i].defineOnto){
				base.props[i].defineOnto(base);
				base.props[i].mod = base;		
			}
		}		
	}

	log && console.groupEnd();
	return base;
};

/* we need more than just value and meta, because we might be redefining
onto the base.. */
var copyWithMeta = function(prop, base, meta){
	value
};

copy2.oo = function(){
	return stdCopy(this); // init? assign?
};

copy2.copyTo = function(base){
	return stdCopy(this, base);
};
/*
REBASING, or TRACING the PoC

b = a.copy() --> b.base = a
c = b.copy(changes) --> getBase --> b.base.copy() --> iterate b --> assign new changes

The problem here is redundancy.  If we iterate b after copying a,
we redefine all the props on b.

This is a major deviation from my original strategy, and could derail the entire day.

Is this a good idea?  Here's maybe why not:  Let's say b modifies a significantly.  You
recreate a, then perform a bunch of modifications, instead of just copying b.  This may be
a longer path to get to b.  But, it might be better..?

When it comes to these Property objects, and defining accessors, how are these handled as
a module is copied and extended?  

A value object:  You can copy the parent, and change the value.  This would probably be the
most common case.  Alternatively, you could modify the actual configuration of the property,
deleting it, or changing it from a value to a reference, or vice versa.

There are ultimately 2 different kinds of extension:  linked and unlinked.  If you copy a module,
should it be standalone?  This could be separate issues, as you could embed the dependent module
in the extension, so they both can be portable.  That would be complicated, because you'd likely have
2 copies of the underlying, and have to keep them syncd.

Anyway, PoC vs iteration..  Can each module have its own properties manifest, and be completely
independent of any base?  I don't see why not.  But, we also might want them to stay linked.

There are 2 very different cases here:  modules created with code, and modules reinstantiated
via storage.  In the second case, there's likely a lot of details I haven't come to yet.  In 
the first case, I think this distinction between retracing the PoC, and just jumping to the final
outcome is less important:  they should both arrive at the same destination.

***

There will definitely be independent copies of each property object.  If we were to copy 
a module a ton of times (b = a.copy(), c = b.copy(), d = c.copy(), e = d.copy()...), then
each module has a complete set of properties/values, and there is no linkage between them.

In this case, the "base" is really just a minimal foundation, rather than the nearest ancestor.

***

When it comes to morphing, changesets, etc, we'll want to take any module and apply sequential
changesets to it.  These interactions might be more linked, where live inheritance is possible,
and uses the .base property.  Also, if we want to be able to morph an instance, to be able to,
for example, convert between similar types (a ValueProperty vs a ReferenceProperty, or a 
Human vs a Goblin, or whatever..), we need these "class" definitions to be in changeset form.

Anyway, changesets are much more PoC-like.  However, maybe the underlying framework should
stick to the iteration technique, and keep all the modules as disconnected as possible.

****

Does it even matter? Let's say you do rebase.  

It would be important to make sure any changes get applied correctly... But I'm sure that
would happen.  The biggest difference is in the repetition.

The only way to avoid the repetition is to diff the base with the module, to see what is 
the same, and what has been overridden.

SO!  That's for phase 2. For now, stick with a simple/minimal base, and just iterate.

Note:  my current "mod" doesn't even have a base, it just uses a blank object.  Only
the sfn was using Base.  

I could create a custom sfn.copy.getBase in order to accommodate the special base..


*/




/************
	MOD
*************/
var mod = utils.mod = { 
	copy: copy.oo,
	copyTo: utils.copyTo,
	assign: function(obj){
		if (is.obj(obj)){
			for (var i in obj)
				this[i] = obj[i];
		}
		return this;
	},
	install: function(m){
		m.copyTo(this);
		return this;
	},
	clone: function(p){
		var c = this.copy().assign(p);
		if (c.init) c.init.apply(c, arguments);
		return c;
	},
	/* note: if assign is put inside init, then you can't add init 
	and have it run immediately.. depends on if you're trying to make
	an instance (might want to add custom init logic), or make a factory
	(might want to wait until next round to init) */
	create: function(p){
		var c = this.copy();
		if (c.init) c.init.apply(c, arguments);
		return c;
	}
};


mod2 = utils.mod.clone({
	copy: copy2.oo,
	copyTo: copy2.copyTo,
	props: {},
	prop: function(name){
		var p, set, val;

		if (this.props[name])
			return this.props[name];

		p = Property.clone({
			name: name
		});

		if (is.def(this[name])){
			set = true;
			val = this[name];
		}

		p.defineOnto(this);

		if (set)
			this[name] = val;

		return p;
	},
	ref: function(name){
		var r;
		if (this.props[name] && this.props[name].reference)
			return this.props[name];

		// only difference is the class used here...
		// morphable classes could be used
		r = Reference.clone({
			name: name
		});

		r.defineOnto(this);
		return r;
	}
});

mod3 = mod2.clone({
	assign: function(obj){
		if (is.obj(obj)){
			for (var i in obj){
				if (is.fn(obj[i])){
					// upgrade as super fn? until then...
					this[i] = obj[i];
				} else {
					this.prop(i);
					this[i] = obj[i];
				}
			}
		}
		return this;
	},
	copy: function(o){
		return stdCopy(this).assign(o);
	}
});


/************
	SFN
*************/
var sfn = utils.sfn = function(){
	var arg, fn = function(){
		return fn.main.apply(fn, arguments);
	};

	copy(mod, fn, true);

	fn.main = function(){};

	// put these before the assign, so you can override bases
	fn.base = sfn;
	fn.Base = sfn;
	
	if(arguments.length){
		for(var i=0; i<arguments.length; i++){
			arg = arguments[i];
			if (typeof arg === "object")
				fn.assign(arg);
			else if (typeof arg === "function")
				fn.main = arg;
		}
	}

	
	// fn.init && fn.init();

	return fn;
};


/*
Objective:  allow sfn constructor to copy a superFn prototype,
so that they both use the same init logic.

This is tricky, because we need to get a new fn base.

So, superFn.copy needs to be custom

How do you bind and apply dynamic args?  
*/
var sfn2 = function(){
	return superFn.copy.apply(superFn, arguments);
};

var sfnBase = function(){
	var fn = function(){
		return fn.main.apply(fn, arguments);
	};

	return fn;
};

var superFn = function(){};
superFn.copy = function(){
	var fn = sfnBase();

}


var sfnCopy = function(){
	return copyIterate(this, sfnBase());
};


/* maybe there's an easier solution: */
var sfn3 = function(){
	var arg, fn = function(){
		return fn.main.apply(fn, arguments);
	};

// these will get copied regardless... but, if we're not "copying" here, on the first
// pass, these won't be present..  I suppose a few fns is ok.  Just doesn't feel right thou

// this could be removed, and 2 shells could be created:  1 that adds these, 1 that does not
// these would be added for the standalone constructor, and not added for the getBase fn
	copy(mod, fn, true);

	fn.main = function(){};

	// put these before the assign, so you can override bases
	fn.base = sfn;
	/*  The bases can change, and will essentially stack to create 
	the PoC.  However, this base needs to have a .copy fn that returns
	this blank fn*/
	
	if(arguments.length){
		for(var i=0; i<arguments.length; i++){
			arg = arguments[i];
			if (typeof arg === "object")
				fn.assign(arg);
			else if (typeof arg === "function")
				fn.main = arg;
		}
	}

	
	// fn.init && fn.init();

	return fn;
};

/***********
	GETSET
	**********/

var GetSet = utils.GetSet = sfn(function(){
	if (arguments.length){
		return this.set.apply(this, arguments);
	} else {
		return this.get.call(this);
	}
}, {
	// get and set fns must be defined!
	get: function(){
		console.log('the get method has not been redefined!');
	},
	set: function(){
		console.log('the set method has not been redefined!');
	}
});


})();