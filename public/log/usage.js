;(function(){
	

$(function(){
	v1 = View2.clone({

	});

	v1.appendTo($('body'));

	log('you', 'are', 'awesome');
	console.dir(log);
	log.view().appendTo($('body'));
	console.log('huh?');
});

})();