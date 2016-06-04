;(function(){

var eq = EQ.clone();
eq(function(){
	console.log('first callback');
});
console.log('Nothing logged, yet');
eq.appended(function(){
	console.log('called when something was added');
	console.log(this);
	console.log(this.cbs);
	console.log(this.cbs.length);
});
eq(function(){
	console.log('second callback');
});
console.log('Something was just added?');
eq();
console.log('terminus');


$(function(){

});

})();