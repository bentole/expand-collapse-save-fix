# expand-collapse-save-fix

FIX to cytoscape.js expand-collapse which allows the graphs to be saved in collapsed state

The IDEA behind this fix is as follows:

1. Replace circular objects in originalEnds and CollapsedChildren properties with regular JSON. Data loss is to be expected
2. POST cy.jsons() as you would in any case.
3. Restore the actual objects from the property information mentioned in step 1.
4. Naturally, the restoration also needs to be executed, if necessary, in a graph load event.

* Beware this is work in progress *
