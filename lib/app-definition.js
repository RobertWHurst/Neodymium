
// libs
var App = require('./app');
var ElementDefinition = require('./element-definition');


function AppDefinition(n, name, opts) {
  this.n = n;
  this.name = name;
  this.opts = this.n.extend({}, AppDefinition.defaults, opts);
  this.elements = {};

  if (this.opts.autoCreate) {
    this.n.ready(this.create.bind(this));
  }
}

AppDefinition.defaults = {
  attrName: 'app',
  autoCreate: true
};

AppDefinition.prototype.element = function(name, opts) {
  if (opts || !this.elements[name]) {
    this.elements[name] = new ElementDefinition(this.n, this, name, opts);
  }
  return this.elements[name];
};

AppDefinition.prototype.getInstances = function() {
  var els = this._getEls();
  var instances = [];
  for (var i = 0; i < els.length; i += 1) {
    var metaData = this.n.metaData(els[i]);
    if (
      metaData &&
      typeof metaData == 'object' &&
      metaData.appInstance &&
      typeof metaData.appInstance == 'object' &&
      metaData.appInstance.appDef === this
    ) {
      instances.push(metaData.appInstance);
    }
  }
  return instances;
};

AppDefinition.prototype.create = function() {
  var els = this._getEls();
  for (var i = 0; i < els.length; i += 1) {
    new App(this.n, this, els[i]);
  }
};

AppDefinition.prototype._getEls = function() {
  return this.n.findAll(
    '[data-' + this.opts.attrName + '="' + this.name + '"]'
  );
};


module.exports = AppDefinition;
