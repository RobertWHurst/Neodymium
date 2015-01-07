

var app = neodymium.app('hello-world');

app.element('well', {
  template: '<div class="well"><div class="well-inner">B{{content}}A</div></div>'
});

app.element('time', {

  initialize: function() {
    this.timeStrTemplate = this.el.getAttribute('format');
    this.h = this.m = this.s = this.a = '';
    this.running = true;
  },

  render: function() {
    if (this.running) {
      this._calcTime();
      this._calcTimeStr();
      setTimeout(this.render.bind(this), 10);
    }
  },

  start: function(el) {
    this.running = true;
    this.render();
  },

  stop: function() {
    this.running = false;
  },

  _calcTime: function(d) {
    var d = new Date();
    var h24 = d.getHours();
    this.a = h24 < 12 ? 'am' : 'pm';
    var h = h24 < 12 ? h24 : h24 - 12;
    this.h = h === 0 ? '12' : h + '';
    var m = d.getMinutes();
    this.m = (m + '').length < 2 ? ('0' + m) : (m + '');
    var s = d.getSeconds();
    this.s = (s + '').length < 2 ? ('0' + s) : (s + '');
  },
  _calcTimeStr: function() {
    this.el.innerHTML = this.timeStrTemplate
      .replace('HH', this.h)
      .replace('MM', this.m)
      .replace('SS', this.s)
      .replace('aa', this.a);
  }
});



