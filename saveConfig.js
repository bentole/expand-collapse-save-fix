var collapsedChildren = {}

function removeCC() {
	cy.nodes().forEach(function(item, index, array) {
    	  let cC = item.data().collapsedChildren
	  if ( cC ) {
	        let id = item.id();
	        let parentId = item.id();
	        collapsedChildren[id] = {}
	    	collapsedChildren[id]['data']  = cC.jsons();
	    	delete cy.$id(id).data().collapsedChildren;
	  };
	});
};
function restoreCC() {
  for (let parentId in collapsedChildren) {
    	let arr = collapsedChildren[parentId].data;
    	cy.$id(parentId).data().collapsedChildren = cy.add(arr);
    	arr.forEach(function(item, index, array) {
		cy.$id(item.data.id).remove();
	});
  };
};
removeCC();
$.post(".", { 'save_config': JSON.stringify(cy.json()) }, null, 'json');
//console.log(JSON.stringify(collapsedChildren));
restoreCC();
