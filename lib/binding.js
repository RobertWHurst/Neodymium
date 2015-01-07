

function Binding(n, DOMContext, data) {
  this.n = n;
  this.DOMContext = DOMContext;
  this.data = {};
  this.bindingNodes = {};
  this._bindTextNodes(this._findTextNodes());
  for (var propName in data) {
    this.set(propName, data[propName]);
  }
}

Binding.varRegExp = /\{\{(.+)\}\}/g;

Binding.prototype.set = function(varName, val) {
  var prevVal = this.data[varName];

  // fetch the binding node
  var bindingNode = this.bindingNodes[varName];
  if (!bindingNode) { return null; }

  // get value types
  var isNode = this._isNode(val);
  var isNodeList = this._isNodeList(val);
  var prevIsNode = this._isNode(prevVal);
  var prevIsNodeList = this._isNodeList(prevVal);

  // if the prev value was a node then remove it from the DOM
  if (prevIsNode) {
    prevVal.parent.removeChild(prevVal);
  } else if (prevIsNodeList) {
    for (var i = 0; i < prevVal.length; i += 1) {
      prevVal[i].parent.removeChild(prevVal[i]);
    }
  } else {
    bindingNode.textContent = '';
  }

  // set the new value
  this.data[varName] = val;

  // if the new value is a node then append it
  if (isNode) {
    bindingNode.parentNode.insertBefore(val, bindingNode);
  } else if (isNodeList) {
    for (var i = 0; i < val.length; i += 1) {
      bindingNode.parentNode.insertBefore(val[i], bindingNode);
    }
  } else {
    bindingNode.textContent = val;
  }
};

Binding.prototype.get = function(varName) {
  return data[varName] || null;
};

Binding.prototype._findTextNodes = function() {
  var childTextNodes = [];
  (function rec(childTextNodes, childNodes) {
    for (var i = 0; i < childNodes.length; i += 1) {
      var node = childNodes[i];
      if (node.nodeType == 1) { rec(childTextNodes, node.childNodes); }
      if (node.nodeType == 3) { childTextNodes.push(node); }
    }
  })(childTextNodes, this.DOMContext.childNodes);
  return childTextNodes;
};

Binding.prototype._bindTextNodes = function(textNodes) {
  for (var i = 0; i < textNodes.length; i += 1) {
    var node = textNodes[i];
    var str = node.textContent;
    var regExp = Binding.varRegExp;
    var match = null;
    while (match = regExp.exec(str)) {
      var matchStr = match[0];
      var varName = match[1];
      var endI = regExp.lastIndex;
      var startI = endI - matchStr.length;

      node.textContent = str.slice(0, startI);
      var bindingNode = this.n.doc.createTextNode('');
      var nextNode = this.n.doc.createTextNode(str.slice(endI));

      if (node.nextSibling) {
        node.parentNode.insertBefore(node.nextSibling, bindingNode);
        node.parentNode.insertBefore(node.nextSibling, nextNode);
      } else {
        node.parentNode.appendChild(bindingNode);
        node.parentNode.appendChild(nextNode);
      }
      node = nextNode;
      str = node.textContent;
      this.bindingNodes[varName] = bindingNode;
    };
  }
};

Binding.prototype._isNode = function(node) {
  return node && typeof node === 'object' && typeof node.nodeType === 'number';
};

Binding.prototype._isNodeList = function(nodeList) {
  return nodeList &&
    typeof nodeList == 'object' &&
    typeof nodeList.length == 'number' &&
    (
      nodeList.length == 0 ||
      this._isNode(nodeList[0])
    );
};


module.exports = Binding;
