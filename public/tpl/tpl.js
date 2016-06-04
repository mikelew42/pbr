;(function(){
var is = utils.is, 
	copy = utils.copy,
	mod = utils.mod,
	sfn = utils.sfn;

$div = function(c){
	return $("<div></div>").addClass(c);
};

var $span = function(c){
	return $("<span></span>").addClass(c);
};

var expandable = function(view){

	view.$el.addClass('collapsed');

	view.$preview.click(function(){
		view.toggle();
	});

	view.toggle = function(){
		var view = this;
		if (view.$el.hasClass('collapsed') || view.$el.hasClass('collapsing'))
			this.expand();
		else 
			this.collapse();
	};

	view.expand = function(){
		var view = this;
		this.$el.addClass('expanding').removeClass('collapsed');
		this.$content.slideDown(function(){
			view.$el.removeClass('expanding').addClass('expanded');
		});
	};
	
	view.collapse = function(){
		var view = this;
		this.$el.addClass('collapsing').removeClass('expanded');
		this.$content.slideUp(function(){
			view.$el.removeClass('collapsing').addClass('collapsed');
		});
	};

};

var $expandable = function($el, $preview, $content){
	var api = {};

	$el.addClass('collapsed expandable');
	$content.hide();

	$preview.click(function(){
		api.toggleExpand();
	});

	api.toggleExpand = function(){
		if ($el.hasClass('collapsed') || $el.hasClass('collapsing'))
			api.expand();
		else 
			api.collapse();
	}

	api.expand = function(){
		$el.addClass('expanding').removeClass('collapsed');
		$content.slideDown(function(){
			$el.removeClass('expanding').addClass('expanded');
		});
	};
	
	api.collapse = function(){
		$el.addClass('collapsing').removeClass('expanded');
		$content.slideUp(function(){
			$el.removeClass('collapsing').addClass('collapsed');
		});
	};

	// this can be assigned to the view
	return api;
};

$View = utils.GetSet.clone({
	main: function(){
		this.main = function(){
			if (arguments.length){
				return this.set.apply(this, arguments);
			} else {
				return this.get.call(this);
			}
		};
		return this.clone.apply(this, arguments);
	},
	init: function(){
		// this.set.apply(this, arguments);
		this.render.apply(this, arguments);
	},
	render: function(){},
	get: function(){
		console.log('view get method not set');
	},
	set: function(){
		if (this.append){
			for (var i = 0; i < arguments.length; i++){
				this.append(arguments[i]);
				if (arguments[i].type)
					this["$"+arguments[i].type] = arguments[i];
			}
		}
		return this;
	}
});

var aliasFnToEl = function(fn){
	return function(){
		this.$el[fn].apply(this.$el, arguments);
		return this;
	};
};

[	'append', 'prepend', 'click', 'clickOff', 'show', 'hide', 'appendTo', 'prependTo', 'addClass', 'removeClass', 
	'css', 'attr', 'remove', 'empty', 'hasClass', 'html'].forEach(function(v){
		$View[v] = aliasFnToEl(v);
});


})();