/*

Ok, so this is a temporary workaround to 
the cyclic object problem which prevents graphs
to be stringified and saved to backend. 

*/
var collapsedChildren = {}
var originalEnds = {}
var removedNodes = cy.collection();

// Function which REMOVES the originalEnds property 
// of edges after storing the data
// as a regular object in variable originalEnds
function removeOE() {
  cy.edges().forEach(function(item, index, array) {
    let oE = item.data().originalEnds;
    if ( oE ) {
      let id = item.id();
      let src = oE.source.id();
      let dst = oE.target.id();
      originalEnds[id] = { source: src,
                          target: dst};
      delete item.data().originalEnds;
    };
  });
};
// Function that RESTORES the originalEnds property 
// to the edges. Be aware that the source and target
// objects cannot be in removed() state
function restoreOE() {
    for ( let edgeId in originalEnds ) {
        let edge = originalEnds[edgeId]
        cy.$id(edgeId).data().originalEnds = {
            source: cy.$id(edge.source),
            target: cy.$id(edge.target)
        }
    };
};
// Function which REMOVES the collapsedChildren property 
// of nodes after storing the data as a regular obect in the 
// variable collapsedChildren. 
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
  	removeOE();
};
// Function that RESTORES the collapsedChildren property to the edges
// This function creates new objects. The trick here is that the removed nodes
// need to be restored for each iteration for correct handling
function restoreCC() {
    for (let parentId in collapsedChildren) {
        let arr = collapsedChildren[parentId].data;
        cy.$id(parentId).data().collapsedChildren = cy.add(arr);
        removedNodes.restore();
        restoreOE();
        arr.forEach(function(item, index, array) {
            removedNode = cy.$id(item.data.id);
            removedNodes = removedNodes.union(removedNode);
            removedNodes.remove();
        });
    };
};
// this function is for sample only to illustrate and test that
// data can be stringified and saved to backend
function save() {
	console.log(JSON.stringify(originalEnds));
	console.log(JSON.stringify(collapsedChildren));
	console.log(JSON.stringify(cy.json()));
};
// So this is it. First remove the cyclic objects, then save to backend.
// Restore after to continue business as usual.
removeCC();
save();
restoreCC();
