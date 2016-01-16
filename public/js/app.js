;(function(){
	
	strings = {};


$(function(){
	var $controls = $("<div>").addClass('controls').appendTo('body');
	var $label = $("<input>").appendTo($controls);
	var $create = $("<button>").html('add').appendTo($controls).click(function(){
		var newStr = str.clone({ name: $label.val() });
		strings[$label.val()] = newStr;
		$label.val('');
	});

	myStr = str.clone({
		name: 'myStr'
	});
	myStr.add('one', 'one');
	myStr.add('two', '2');
	myStr.save();
});

	// Test1 = HTMLElement.clone({
	// 	name: "Test1"
	// });

	// Test1.addClass('test1');
})();