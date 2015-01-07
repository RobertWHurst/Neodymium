
var Binding = require('./binding');


function ElementContext(n, el, childNodes, innerHTML) {
  this.n = n;
  this.el = el;
  this.childNodes = childNodes;
  this.innerHTML = innerHTML;
  this._binding = null;
}

ElementContext.prototype.initialize = function() {};

ElementContext.prototype.render = function() {
  this.renderWithTemplate();
};

ElementContext.prototype.renderWithTemplate = function(data) {
  if (!this.template) { return; }
  this.el.innerHTML = this.template;
  this.content || (this.content = this.childNodes);
  this._binding = new Binding(this.n, this.el, data || this);
};


module.exports = ElementContext;
