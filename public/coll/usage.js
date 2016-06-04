;(function(){
	
c1 = coll.clone();
c1.add('test1', 1);
c1.add('test2', 'two');
c1.each(function(v, n){
	console.log(n, v);
});

function symstrTest1(){
	ss = symstr.clone();
	console.log(ss.value);
}

symstrTest1();

$(function(){

});

})();