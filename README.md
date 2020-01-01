# expand-collapse-save-fix

FIX to cytoscape.js expand-collapse which allows the graphs to be saved in collapsed state

The IDEA behind this fix is as follows:

1. Execute replaceCC which replaces circular objects in originalEnds and collapsedChildren properties with regular JSON. Data loss is to be expected
2. POST cy.json() as you would in any case.
3. Restore the original properties and objects by executing restoreCC.
4. Make sure restoreCC is executed every time the graph loads by putting it in the cy.ready() event. 

__Beware this is work in progress__ 

I'm noticing this fix is gaining popularity. Apologies for the prematurity of the work. I'm planning on providing a fully working sample in jan 2020, but right now I'm too busy enjoying the holidays to be bothered :)


