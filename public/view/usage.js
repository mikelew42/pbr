;(function(){

// text.classes.push('text');

text2 = text.factory({
	classes: ['text', 'text2']
});

label = text.factory({
	classes: ['text', 'label'],
	type: 'label'
});

v1 = view();
v1.classes.push('v1');


v1(text("Yo yo"), text2("Yo yo"), label('this is my label'), text("Yo yo"));
v1.$text('new text');
v1.$label('this is my new label');
/*
What about rerendering upon change?  As long as changes happen before rendering,
we're fine and don't need to worry bout it.  But, if we want to have a more dynamic,
live, changing, environment
*/



v2 = View(text('this is the text for v2'));
// console.dir(v2);

v3 = v2().$text('this is v3!')


$(function(){
	var $body = $("body");
	$body.append(v1.render());

	t2 = text2("Hello");
	t2.render().appendTo($body);

	v3.render().appendTo($body);
});

})();

/*
How about for items?

item = view(text('item text'));
could be converted to
item = view({
	set: function(text){
		this.text = text;
	}
});

item = view();
item.classes.push('item');
or item = view().addClass('item');


view vs View

item = view(); // item is the view, and item('content') === item.set('content')
item = View(); // item is a factory, and item('content') ==> clone and set

you could use Capital to indicate 'template', so you don't accidentally munge your tpl,
alternatively, you could just use generic names like 'view' and 'item' and 'icon' for tpl,
and use specific names like 'beerIcon' or 'myItem' for instances.



iconItem = view(icon('beer'), 'item text?' || text('item text'));

iconValueItem = view(icon('beer'), text('yo'), value(123));
or
iconValueItem = iconItem.clone({})
*/