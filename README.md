# expand-collapse-save-fix

FIX to cytoscape.js expand-collapse which allows the graphs to be saved in collapsed state

The IDEA behind this fix is as follows:

1. Execute replaceCC which replaces circular objects in originalEnds and collapsedChildren properties with regular JSON. Data loss is to be expected
2. POST cy.json() as you would in any case.
3. Restore the original properties and objects by executing restoreCC.
4. Make sure restoreCC is executed every time the graph loads by putting it in the cy.ready() event. 

__Sample__ 

I've just tested the implementation on my project and so far it seems to be working well. MY implementation looks like this in all simplicity. There are most certainly more efficient ways to do this


'''
var cy = cytoscape({
  ...
});

var api = cy.expandCollapse({
  ...
});

var removedNodes = cy.collection();

function replaceOE() {
  ...
};
function restoreOE() {
  ...
};
function replaceCC() {
  ...
};
function restoreCC() {
  ...
};
cy.ready(function(e) {
  restoreCC();
});
$(document).ready(function() {
  $("#lagre").click(function() {
    replaceCC();
    $.post(".", { 'save_config': JSON.stringify(cy.json()) }, null, 'json' );
    restoreCC();
  });
});
'''




