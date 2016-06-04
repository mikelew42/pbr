;(function(){
var is = utils.is, 
	copy = utils.copy,
	mod = utils.mod,
	sfn = utils.sfn;

coll = mod2.clone({
	items: [],
	add: function(handle, value){
		this.prop(handle);
		this[handle] = value;
		this.items.push(handle);
		return this;
	},
	each: function(iterator){
		for (var i = 0; i < this.items.length; i++){
			iterator(this[this.items[i]], this.items[i]);
		}
		return this;
	}
});

q = coll.clone({
	exec: function(){
		
	}
});

symstr = coll.clone({

});

var value = Property.clone({
	name: "value",
	getter: function(){
		return "generate symstr here";
	}
});

value.defineOnto(symstr);
/*

Coll are very similar to modules, in that they have props.

When an item is added, let's say it has to have a name, for now:

coll.add('handle', value);
--> create CollItem (which is a PropertyObj)

coll.handle can either return the value, or the CollItem.
Alternatively, the CollItem would be accessed via:
coll.prop('handle') and then can access the .value.





When copying a view, we copy the children array, and also each property.

Configuring each property, so that we can turn off copying, is one approach.
Essentially, you could just set each handle as a reference. 

You could loop through each children item, and create references for them.
Yet, if you're trying to use props meta data for a collection, and create these
references from the meta data, and have their values link back to the
item in the array, that wouldn't be easy.

The only thing that links the handle (prop name) to the item, is the creation
function that links them.

Another recipe for the collection:  use dynamic lookup.  In this case, the 
array can be copied directly, and each prop can be copied as well.
*/

})();