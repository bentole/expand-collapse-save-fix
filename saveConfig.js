
/*

Ok, so this is a temporary workaround to 
the cyclic object problem which prevents graphs
to be stringified and saved to backend. 

*/

// Variable to temporarily store re-created node objects
var removedNodes = cy.collection();

// Function that replaces the originalEnds property 
// of edges with non-circular objects
function replaceOE() {
  cy.edges().forEach(function(item, index, array) {
    let oE = item.data().originalEnds;
    if ( oE ) {
      let src = oE.source.id();
      let dst = oE.target.id();
      cy.$id(item.id()).data().originalEnds = {
	      source: src,
	      target: dst
      }
    };
  });
};
// Function that restores the originalEnds property 
// to the edges. It has to test that the source property
// is a string and that the target is defined for 
// restoration to be successful
function restoreOE() {
	cy.edges().forEach(function(item, index, array) {
		var oE = item.data().originalEnds;
		if ( oE && typeof oE.source == 'string'
	  	&& cy.$id(oE.target).length > 0
		&& cy.$id(oE.source).length > 0) {
	      		item.data().originalEnds = {
				source: cy.$id(oE.source),
				target: cy.$id(oE.target)
			}
		};
	});
};
  
// Function that replaces the collapsedChildren property 
// of nodes with non-circular JSON objects.
function replaceCC() {
	cy.nodes().forEach(function(item, index, array) {
		let cC = item.data().collapsedChildren
		if ( cC ) {
			cy.$id(item.id()).data().collapsedChildren = cC.jsons();
		};
	});
	replaceOE();
};
// Function that restores the collapsedChildren property. 
// This performs restoration by recreating the nodes lost in
// the previous removal process. It also needs to remove them after 
// to not mess up the graph view.
function restoreCC() {
	cy.nodes().forEach(function(item, index, array) {
		let cC = item.data().collapsedChildren;
		if ( cC ) {
			item.data().collapsedChildren = cy.add(cC);
			removedNodes.restore();
			restoreOE();
			cC.forEach(function(item, index, array) {
				removedNode = cy.$id(item.data.id);
                		removedNodes = removedNodes.union(removedNode);
				removedNodes.remove();
            		});

      		};
    	});
	//Reset removedNodes
        removedNodes = cy.collection();
};
// this function is for sample only to illustrate and test that
// data can be stringified and saved to backend
function save() {
	console.log(JSON.stringify(cy.json()));
};
// So this is it. First remove the cyclic objects, then save to backend.
// Restore after to continue business as usual.
replaceCC();
save();
restoreCC();
