;(function(){

var log = true;

log && console.group('item/usage.js');

i1 = item(text('this is my item'), { _name: 'i1' });
i2 = item(icon('beer'), text('beer icon item'), { _name: 'i2' });
i3 = item(icon('beer'), text('my plane icon value item'), value(123), { _name: 'i3' });
i3.$icon('plane'); // this returns the icon for chaining, probably should return the item

i4 = item2(
	preview(
		icon('plane'), text('plane preview expandable?'), value('yay')
	),
	contents(text("this is the contents")), { _name: 'i4' }
);
i4.addClass('expandable');

$(function(){
	log && console.group('item/usage.js doc.ready');
	$body = $("body");
	$light = $("<div>").addClass('light').append("<h3>light</h3>").appendTo($body);
	$outlines = $("<div>").addClass('outlines').append("<h3>outlines</h3>").appendTo($body);
	
	function renderer(){
		var view, light, outlines;
		for (var i = 0; i < arguments.length; i++){
			view = arguments[i];
			light = view.create().render();
			console.log('appending to light');
			light.appendTo($light);
			view.create().render().appendTo($outlines);
		}
	}

	renderer(i1, i2, i3, i4);

	log && console.groupEnd();
});

log && console.groupEnd();

})();