

function App(n, appDef, el) {
  var elMetaData = n.metaData(el);
  if (
    elMetaData &&
    typeof elMetaData == 'object' &&
    elMetaData.appInstance &&
    typeof elMetaData.appInstance == 'object' &&
    elMetaData.appInstance.appDef === appDef
  ) {
    return elMetaData.appInstance;
  }

  this.n = n;
  this.appDef = appDef;
  this.el = el;

  // set new meta data
  n.metaData(el, { appInstance: this });

  // create elements within the app
  this._createElements();
}

App.prototype._createElements = function() {
  var elements = this.appDef.elements;
  for (var name in elements) {
    elements[name]._create(this.el);
  }
};


module.exports = App;
