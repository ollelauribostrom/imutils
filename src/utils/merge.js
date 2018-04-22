/**
 * Ported from HAAR.js
 * src: https://github.com/foo123/HAAR.js/
 */

import Feature from './Feature';

// merge the detected features if needed
function merge(rects, min_neighbors, ratio, selection) 
{
    var ref = new Array(rects.length)
    var feats = [];
    var nb_classes = 0;
    var neighbors;
    var r;
    var found = false
    var i;
    var j;
    var n;
    var t;
    var ri;
    
    // original code
    // find number of neighbour classes
    for (let i = 0; i < rects.length; i++) ref[i] = 0;
    for (let i = 0; i < rects.length; i++)
    {
        found = false;
        for (j = 0; j < i; j++)
        {
            if (rects[j].almostEqual(rects[i]))
            {
                found = true;
                ref[i] = ref[j];
            }
        }
        
        if (!found)
        {
            ref[i] = nb_classes;
            nb_classes++;
        }
    }        
    
    // merge neighbor classes
    neighbors = new Array(nb_classes);  r = new Array(nb_classes);
    for (i = 0; i < nb_classes; i++) { neighbors[i] = 0;  r[i] = new Feature(); }
    for (i = 0; i < rects.length; i++) { ri=ref[i]; neighbors[ri]++; r[ri].add(rects[i]); }
    for (i = 0; i < nb_classes; i++) 
    {
        n = neighbors[i];
        if (n >= min_neighbors) 
        {
            t=1/(n + n);
            ri = new Feature(
                t*(r[i].x * 2 + n),  t*(r[i].y * 2 + n),
                t*(r[i].width * 2 + n),  t*(r[i].height * 2 + n)
            );
            
            feats.push(ri);
        }
    }
    
    if (ratio != 1) { ratio=1.0/ratio; }
    
    // filter inside rectangles
    rects.length=feats.length;
    for (i=0; i<rects.length; i++)
    {
        for (j=i+1; j<rects.length; j++)
        {
            if (!feats[i].isInside && feats[i].inside(feats[j])) { feats[i].isInside=true; }
            else if (!feats[j].isInside && feats[j].inside(feats[i])) { feats[j].isInside=true; }
        }
    }
    i=rects.length;
    while (--i >= 0) 
    { 
        if (feats[i].isInside) 
        {
            feats.splice(i, 1); 
        }
        else 
        {
            // scaled down, scale them back up
            if (ratio != 1)  feats[i].scale(ratio); 
            //feats[i].x+=selection.x; feats[i].y+=selection.y;
            feats[i].round().computeArea(); 
        }
    }
    
    return feats;
}

export default merge;
