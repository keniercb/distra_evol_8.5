  /** 
   * @description Plugin para filtrar cadenas de textos en una columna dada del grid.
   * 
   * @author Ing. Miguel Diaz Riveaux.
   * @package ERP Cuba.
   * @subpackage Contabilidad y Finanzas. 
   * @namespace Ext.grid.filter
   * @copyright XETID.
   * @version 1.0-1
   * @since 1.0
   * 
   */
  Ext.grid.filter.StringFilter = Ext.extend(Ext.grid.filter.Filter, {
      updateBuffer: 500,
      icon: '/contabilidad/comun/plugins/GridFilters/img/buscar.png',
      init: function() {
          var value = this.value = new Ext.menu.EditableItem({iconCls: 'icondistra-buscar'});
//          var value = this.value = new Ext.menu.EditableItem({label: 'Empieza con...', icon: this.icon});
//          var value2 = this.value2 = new Ext.menu.EditableItem({label: 'Termina con...', icon: this.icon});
//          var value3 = this.value3 = new Ext.menu.EditableItem({label: 'Contiene...', icon: this.icon});
          value.on('keyup', this.onKeyUp, this);
//          value2.on('keyup', this.onKeyUp, this);
//          value3.on('keyup', this.onKeyUp, this);
//          this.menu.add(value, value2, value3);
          this.menu.add(value);

          this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);
      },
      onKeyUp: function(event) {
          if(event.getKey() == event.ENTER) {
              this.menu.hide(true);
              return;
          }
          this.updateTask.delay(this.updateBuffer);
      },
      isActivatable: function() {
          return this.value.getValue().length > 0;
      },
      fireUpdate: function() {
          if(this.active) {
              this.fireEvent("update", this);
          }
          this.setActive(this.isActivatable());
      },
      setValue: function(value) {
          this.value.setValue(value);
          this.fireEvent("update", this);
      },
      getValue: function() {
          return this.value.getValue();
      },
      serialize: function() {
          var args = {type: 'string', value: this.getValue()};
          this.fireEvent('serialize', args, this);
          return args;
      },
      validateRecord: function(record) {
          var val = record.get(this.dataIndex);
          if(typeof val != "string") {
              return this.getValue().length == 0;
          }
          return val.toLowerCase().indexOf(this.getValue().toLowerCase()) > -1;
      }
  });