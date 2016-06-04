;(function(){
	

$(function(){
 $.ajax('dictionary/dictionary.json', {
 	success: function(data){
 		console.log('success', data.HOPE);
 		for (var i in data){
 			console.log(i, data[i]);
 		}
 	}
 })
});

})();