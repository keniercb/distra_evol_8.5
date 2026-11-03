  /** 
   * @description Plugin para filtrar por rango los datos con valores numericos en una columna dada del grid.
   * 
   * @author Ing. Miguel Diaz Riveaux.
   * @package ERP Cuba.
   * @subpackage Contabilidad y Finanzas. 
   * @namespace Ext.menu.RangeMenu
   * @copyright XETID.
   * @version 1.0-1
   * @since 1.0
   * 
   */
  Ext.menu.RangeMenu = function(config) {
      Ext.menu.RangeMenu.superclass.constructor.call(this, config);

      this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);

      var cfg = this.fieldCfg;
      var cls = this.fieldCls;
      var fields = this.fields = Ext.applyIf(this.fields || {}, {
          'gt': new Ext.menu.EditableItem({
              icon: this.icons.gt,
              editor: new cls(typeof cfg == "object" ? cfg.gt || '' : cfg)
          }),
          'lt': new Ext.menu.EditableItem({
              icon: this.icons.lt,
              editor: new cls(typeof cfg == "object" ? cfg.lt || '' : cfg)
          }),
          'eq': new Ext.menu.EditableItem({
              icon: this.icons.eq,
              editor: new cls(typeof cfg == "object" ? cfg.gt || '' : cfg)
          })
      });
      this.add(fields.gt, fields.lt, '-', fields.eq);

      for(var key in fields) {
          fields[key].on('keyup', this.onKeyUp.createDelegate(this, [fields[key]], true), this);
      }

      this.addEvents('update');
  };

  Ext.extend(Ext.menu.RangeMenu, Ext.menu.Menu, {
      fieldCls: Ext.form.NumberField,
      fieldCfg: '',
      updateBuffer: 500,
      icons: {
          gt: '/contabilidad/comun/images/mayor.png',
          lt: '/contabilidad/comun/images/menor.png',
          eq: '/contabilidad/comun/images/igual.png'
      },
      fireUpdate: function() {
          this.fireEvent("update", this);
      },
      setValue: function(data) {
          for(var key in this.fields) {
              this.fields[key].setValue(data[key] !== undefined ? data[key] : '');
          }
          this.fireEvent("update", this);
      },
      getValue: function() {
          var result = {};
          for(var key in this.fields) {
              var field = this.fields[key];
              if(field.isValid() && String(field.getValue()).length > 0) {
                  result[key] = field.getValue();
              }
          }

          return result;
      },
      onKeyUp: function(event, input, notSure, field) {
          if(event.getKey() == event.ENTER && field.isValid()) {
              this.hide(true);
              return;
          }

          if(field == this.fields.eq) {
              this.fields.gt.setValue(null);
              this.fields.lt.setValue(null);
          } else {
              this.fields.eq.setValue(null);
          }

          this.updateTask.delay(this.updateBuffer);
      }
  });