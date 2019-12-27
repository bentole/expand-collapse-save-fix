/*

Ok, so this is a temporary workaround to 
the cyclic object problem which prevents graphs
to be stringified and saved to backend. 

Optimizing the master coe


*/
//var collapsedChildren = {}
//var originalEnds = {}
var removedNodes = cy.collection();

// Function which REMOVES the originalEnds property 
// of edges after storing the data
// as a regular object in variable originalEnds
function removeOE() {
  cy.edges().forEach(function(item, index, array) {
    let oE = item.data().originalEnds;
    if ( oE ) {
      let src = oE.source.id();
      let dst = oE.target.id();
      cy.$id(item.id()).data().originalEnds = { 
        													 source: src,
                                   target: dst};
    };
  });
};
// Function that RESTORES the originalEnds property 
// to the edges. Be aware that the source and target
// objects cannot be in removed() state
function restoreOE() {
  	cy.edges().forEach(function(item, index, array) {
      var oE = item.data().originalEnds;
      if ( oE && typeof oE.source == 'string'
         			&& cy.$id(oE.target).length > 0 ) {
        	item.data().originalEnds = {
  						source: cy.$id(oE.source),
            	target: cy.$id(oE.target)
        	}
      };
    });
};
  
// Function which REMOVES the collapsedChildren property 
// of nodes after storing the data as a regular obect in the 
// variable collapsedChildren. 
function removeCC() {
	cy.nodes().forEach(function(item, index, array) {
		let cC = item.data().collapsedChildren
		if ( cC ) {
      	    cy.$id(item.id()).data().collapsedChildren = cC.jsons();
	  	};
	});
  	removeOE();
};
// Function that RESTORES the collapsedChildren property to the edges
// This function creates new objects. The trick here is that the removed nodes
// need to be restored for each iteration for correct handling
function restoreCC() {
  	cy.nodes().forEach(function(item, index, array) {
      let cC = item.data().collapsedChildren;
      if ( cC ) {
        		item.data().collapsedChildren = cy.add(cC);
            removedNodes.restore();
            cC.forEach(function(item, index, array) {
                restoreOE();
                removedNode = cy.$id(item.data.id);
                removedNodes = removedNodes.union(removedNode);
                removedNodes.remove();
            });

      };
    });
};
// this function is for sample only to illustrate and test that
// data can be stringified and saved to backend
function save() {
	//console.log(JSON.stringify(originalEnds));
	//console.log(JSON.stringify(collapsedChildren));
	console.log(JSON.stringify(cy.json()));
};
// So this is it. First remove the cyclic objects, then save to backend.
// Restore after to continue business as usual.
removeCC();
save();
restoreCC();
