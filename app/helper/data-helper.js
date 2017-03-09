"use strict";

exports.createGearList = function createGearList(w) {
    var gearList = {};
    
    function recurseInfowins(parent) {
      var g;
      if (!parent || !parent.infowins) return;

      for (var k = 0, lenK = parent.infowins.length; k < lenK; k += 1) {
        g = parent.infowins[k];
        if (g.name) {
          gearList[g.name] = g;
        }
        
        recurseInfowins(g);
      }
    }    
    
    recurseInfowins(w);
    return gearList;    
  }