;(function(){
var is = utils.is, 
	copy = utils.copy,
	mod = utils.mod,
	sfn = utils.sfn,
	log = true;

log && console.group('item.js');

upgradeFn = function(fn){
	
};

item = View({
	type: "item",
	init: function(){
		this.set.apply(this, arguments);
		// this.upgradeFn('render');
		return this;
	},
	upgradeFn: function(fnName){
		var fn = this[fnName], item = this;
		if (this[fnName].upgraded){
			this[fnName].$p = this;
		} else {
			this[fnName] = sfn(function(){
				var ret = this.fn.apply(this.$p, arguments), self = this;
				if (!this.then.$cbs) this.then.init(); // why isn't it already initialized?!
				if (!this.after.$cbs) this.after.init(); // why isn't it already initialized?!
				setTimeout(function(){
					// console.log('attempting delayed .then');
					log && console.log('method.after');
					console.dir(self.$p);
					self.after.exec.call(self.after, ret);
				}, 0);
				self.then.exec.call(self.then, ret);
				return ret;
			}, {
				then: Q.clone(),
				after: Q.clone(),
				$p: this,
				upgraded: true,
				fn: fn
			});
		}
		this[fnName].then.$ctx = this;
		this[fnName].then.init();
		// console.log('upgrade finished');
		return this;
	}
}).addClass('item');

// this file
         // turn to false to exclude this piece
                  // turn to true to turn on this piece, despite the file flag
((log && true) || false) && console.log('Creating item2');
item2 = item.factory({});
item2.init = function(){
	console.log('item2.init.. _name: ', this._name);
	this.set.apply(this, arguments);
	this.upgradeFn('render');
	this.render.then(function(){
		expandable(this);
		console.log('Finished adding expandable');
	})
	return this;
};

// console.dir(item);

icon = View({
	type: "icon",
	tag: "i",
	classes: ['icon', 'fa', 'fa-fw'],
	set: function(icon){
		if (icon !== this.icon){
			this.removeClass('fa-' + this.icon).addClass('fa-'+ icon);
			this.icon = icon;
		}
		return this;
	}
});

value = View({
	type: "value",
	classes: ['value'],
	set: function(value){
		this.value = value;
		return this;
	},
	renderChildren: function(){
		this.$el.html(this.value);
	}
});

preview = View({
	type: "preview",
	classes: ["preview"],
	// wrapper functionality:  add to parent
	addChild: function(view){
		this[view.type] = view;
		if (!view.$p)
			view.$p = this;
		if (this.$p && !this.$p[view.type])
			this.$p[view.type] = view;
		this.children.push(view);
	}
});

contents = View({
	type: "contents",
	classes: ["contents"],
	hide: function(){
		this.$el.hide();
		return this;
	}
});
expandable = function(view){
	console.log('expandable!!!')
	console.dir(view);
	view.addClass('collapsed').addClass('expandable start-collapsed');

	view.toggleExpand = function(){
		if (this.$el.hasClass('collapsed') || this.$el.hasClass('collapsing'))
			this.expand();
		else
			this.collapse();
		return this;
	};

	view.expand = function(){
		this.$el.addClass('expanding').removeClass('collapsed collapsing');
		this.$contents.$el.slideDown(function(){
			view.$el.removeClass('expanding').addClass('expanded');
		});
		return this;
	};

	view.collapse = function(){
		this.$el.addClass('collapsing').removeClass('expanded expanding');
		this.$contents.$el.slideUp(function(){
			view.$el.removeClass('collapsing').addClass('collapsed');
		});
		return this;
	};

	view.$preview.$el.click(function(){
		view.toggleExpand();
	});
};
log && console.groupEnd();
})();