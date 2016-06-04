;(function(){
	
var q1 = Q.clone();
q1(function(){
	console.log('hey, Im the first');
});
q1(function(){
	console.log('hey, im the second');
});

console.log('This should be the first log statement.');
q1();
console.log('This should be the fourth and last');

$(function(){

});

})();