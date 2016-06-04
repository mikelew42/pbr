;(function(){

var fn1 = function(){
	m1 = mod2.clone();
	m1.prop('yo');
	m1.yo = 5;

	console.log(m1.yo);

	m1.yo = 5;
	m1.yo = 6;

	console.log(m1.yo);

	m1.prop('yo').getter = function(){ return 7; };

	console.log(m1.yo);
};

var fn2 = function(){
	m2 = mod2.clone();
	m2.myRef = { test: 1 };
	m2.props.myRef = "reassign";

	m22 = m2.clone();
	console.log(m22.myRef === m2.myRef);

};

// fn2();

var fn3 = function(){
	m3 = mod2.clone();
	m3.prop('testProp');
	m3.testProp = 5;
console.log(m3.props);
	m32 = m3.copy();
	// console.log(m32.testProp);
	console.dir(m32);
	console.log(m32.props.testProp === m3.props.testProp);
};

// fn3();

var fn4 = function(){
	m4 = mod3.copy({
		test1: 'yo',
		test2: 123,
		myFn: function(){}
	});
};

fn4();
$(function(){

});

})();