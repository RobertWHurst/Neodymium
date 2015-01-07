
// modules
var extend = require('extend-object');
var domReady = require('domready');

// libs
var AppDefinition = require('./app-definition');


/**
 * The Neodymium class is responsible for retaining all registered applications,
 * elements, controllers, and filters.
 */
function Neodymium(opts) {
  this.opts = extend({}, Neodymium.defaults, opts);
  this.win = this._getWin();
  this.doc = this._getDoc();
  this.support = this._getSupport();
  this.apps = {};
  this._metaVals = [];
  this._metaData = [];
}

Neodymium.defaults = {
  document: null,
  window: null,
  use: {
    tagNames: true
  }
};

/**
 * Creates a neodymium app under an element
 */
Neodymium.prototype.app = function(name, opts) {
  if (opts || !this.apps[name]) {
    this.apps[name] = new AppDefinition(this, name, opts);
  }
  return this.apps[name];
};

/**
 * ready executes a callback upon the dom ready event.
 * See https://www.npmjs.com/package/domready for details.
 */
Neodymium.prototype.ready = domReady;

/**
 * Extends an object. useful from setting defaults.
 */
Neodymium.prototype.extend = extend;

/**
 * find is used by neodymium to query the dom. It uses the same signature as
 * document.querySelector.
 */
Neodymium.prototype.find = function() {
  if (!this.support.querySelector) {
    throw new Error('browser does not support document.querySelector');
  };
  var nl = this.doc.querySelector.apply(this.doc, arguments);
  var nodes = [];
  for (var i = 0; i < nl.length; i += 1) {
    nodes.push(nl.item(i));
  }
  return nodes;
};

/**
 * findAll is used by neodymium to query the dom. It uses the same signature as
 * document.querySelectorAll.
 */
Neodymium.prototype.findAll = function() {
  if (!this.support.querySelector) {
    throw new Error('browser does not support document.querySelectorAll');
  };
  var nl = this.doc.querySelectorAll.apply(this.doc, arguments);
  var nodes = [];
  for (i = 0; i < nl.length; i += 1) {
    nodes.push(nl.item(i));
  }
  return nodes;
};

/**
 * findWithin is used by neodymium to query the dom. The first argument is the
 * context element, everything after is the same as element.querySelector.
 */
Neodymium.prototype.findWithin = function(el) {
  if (!this.support.elementQuerySelector) {
    throw new Error('browser does not support element.querySelector');
  };
  var args = Array.prototype.slice.call(arguments, 1);
  var nl = el.querySelector.apply(el, args);
  var nodes = [];
  for (var i = 0; i < nl.length; i += 1) {
    nodes.push(nl.item(i));
  }
  return nodes;
};

/**
 * findAllWithin is used by neodymium to query the dom. The first argument is
 * the context element, everything after is the same as
 * element.querySelectorAll.
 */
Neodymium.prototype.findAllWithin = function(el) {
  if (!this.support.elementQuerySelector) {
    throw new Error('browser does not support element.querySelectorAll');
  };
  var args = Array.prototype.slice.call(arguments, 1);
  var nl = el.querySelectorAll.apply(el, args);
  var nodes = [];
  for (var i = 0; i < nl.length; i += 1) {
    nodes.push(nl.item(i));
  }
  return nodes;
};

Neodymium.prototype.metaData = function(subject, val) {
  var i = this._metaVals.indexOf(subject);
  if (i == -1) {
    if (val !== null && val !== undefined) {
      this._metaData.push(val);
      this._metaVals.push(subject);
    }
    return val || null;
  } else {
    if (val === null) {
      this._metaVals.splice(i, 1);
      this._metaData.splice(i, 1);
      return null;
    } else if (val !== undefined) {
      this._metaData[i] = val;
    }
    return this._metaData[i];
  }
};

Neodymium.prototype._getSupport = function() {
  var divEl = this.doc.createElement('div');
  return {
    querySelector: typeof this.doc.querySelector == 'function',
    querySelectorAll: typeof this.doc.querySelectorAll == 'function',
    elementQuerySelector: typeof divEl.querySelector == 'function',
    elementQuerySelector: typeof divEl.querySelectorAll == 'function'
  };
};

Neodymium.prototype._getWin = function() {
  var win = this.opts.window || window || global;
  if (!win || typeof win !== 'object') {
    throw new Error(
      'Global namespace does not contain a reference to itself named window ' +
      'or global'
    );
  }
  return win;
};

Neodymium.prototype._getDoc = function() {
  var doc = this.opts.document || this.win.document || document;
  if (!doc || typeof doc !== 'object') {
    throw new Error('Global namespace does not contain a document object');
  }
  return doc;
};


module.exports = Neodymium;
