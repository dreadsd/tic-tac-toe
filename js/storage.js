"use strict"

const storage = (function(doc) {
  const storePref = (attr, val) => {
    localStorage.setItem(attr, val);
  };
  const retPref = () => {
    let pref = [];
    let keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (localStorage.getItem(key) == "true") pref.push(key);
    });
    return pref;
  };

  return {
    storePref,
    retPref
  };
})(document);
