import Widget from '../Widget';

export default Widget.extend({

  _name: 'Drawer',

  _type: 'tabris.Drawer',

  _supportsChildren: true,

  _properties: {
    win_displayMode: {
      type: ['choice', ['overlay', 'compactOverlay']],
      default: 'overlay'
    },
    win_buttonBackground: {
      type: 'color',
      default: null
    },
    win_buttonTheme: {
      type: ['choice', ['light', 'dark', 'default']],
      default: 'default'
    }
  },

  _events: {
    open: {
      trigger: function() {
        this.trigger('open', this);
      }
    },
    close: {
      trigger: function() {
        this.trigger('close', this);
      }
    }
  },

  open: function() {
    this._nativeCall('open', {});
    return this;
  },

  close: function() {
    this._nativeCall('close', {});
    return this;
  }

});
