
var Element = require('./element');
var ElementContext = require('./element-context');


function ElementDefinition(n, appDef, name, opts) {
  this.n = n;
  this.appDef = appDef;
  this.name = name;
  this.opts = n.extend({}, ElementDefinition.defaults, opts);
  this.selector = this._createSelector();
}

ElementDefinition.defaults = {
  selector: '{{name}}',
  template: null,
  attributes: []
};

ElementDefinition.prototype.getInstances = function(app) {
  var DOMContext = null;
  var els = this._getEls(app && app.el);
  var instances = [];
  for (var i = 0; i < els.length; i += 1) {
    var metaData = this.n.metaData(els[i]);
    if (
      metaData &&
      typeof metaData == 'object' &&
      metaData.elementInstance &&
      typeof metaData.elementInstance == 'object' &&
      metaData.elementInstance.elDef === this
    ) { instances.push(metaData.elementInstance); }
  }
  return instances;
};

ElementDefinition.prototype._create = function(DOMContext) {
  var els = this._getEls(DOMContext);
  for (var i = 0; i < els.length; i += 1) {
    new Element(this.n, this, els[i]);
  }
};

ElementDefinition.prototype._createSelector = function() {
  return this.opts.selector.replace('{{name}}', this.name);
}

ElementDefinition.prototype._getEls = function(DOMContext) {
  if (DOMContext) {
    return this.n.findAllWithin(DOMContext, this.selector);
  } else {
    var els = [];
    var appInstances = this.appDef.getInstances();
    for (var i = 0; i < appInstances.length; i += 1) {
      var elEls = this.n.findAllWithin(appInstances[i].el, this.selector);
      for (var j = 0; j < elEls.length; j += 1) {
        els.push(elEls[j]);
      }
    }
    return els;
  }
}


module.exports = ElementDefinition;
