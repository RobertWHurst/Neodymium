
var ElementContext = require('./element-context');


function Element(n, elDef, el) {
  var elMetaData = n.metaData(el);
  if (
    elMetaData &&
    typeof elMetaData == 'object' &&
    elMetaData.elementInstance &&
    typeof elMetaData.elementInstance == 'object' &&
    elMetaData.elementInstance.appDef === appDef
  ) {
    return elMetaData.elementInstance;
  }

  this.n = n;
  this.elDef = elDef;
  this.el = el;
  this.innerHTML = this._getInnerHTML();
  this.childNodes = this._getChildNodes();
  var ctx = new ElementContext(n, this.el, this.childNodes, this.innerHTML);
  this.ctx = n.extend(ctx, this.elDef.opts);

  // set new meta data
  n.metaData(el, { elementInstance: this });

  // initialize and render
  this.ctx.initialize();
  process.nextTick(this.ctx.render.bind(this.ctx));
}

Element.prototype._getInnerHTML = function() {
  return this.el.innerHTML;
};

Element.prototype._getChildNodes = function() {
  var childNodes = [];
  if (this.el.hasChildNodes()) {
    for (var i = 0; i < this.el.childNodes.length; i += 1) {
      childNodes.push(this.el.childNodes.item(i));
    }
  }
  return childNodes;
};


module.exports = Element;
