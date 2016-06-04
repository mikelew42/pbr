;(function(){
	
var value = Value.clone();
console.log(value());
value(5);
console.log(value());
console.log('wait');
value.change(function(){
	console.log('changed!', this.value);
});
console.log('wait');
value('yo');
console.log(value());
$(function(){

});

})();