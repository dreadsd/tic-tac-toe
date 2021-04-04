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
    pubSub.publish("get preferences", pref);
  };

  // Events
  pubSub.subscribe("set dark mode", val => storePref("dark", val));
  pubSub.subscribe("set auto mode", val => storePref("auto", val));
  pubSub.subscribe("request pref keys", retPref);
})(document);
