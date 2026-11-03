  /** 
   * @description Plugin para filtrar datos de valor numerico en una columna dada del grid.
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
  Ext.grid.filter.NumericFilter = Ext.extend(Ext.grid.filter.Filter, {
      init: function() {
          this.menu = new Ext.menu.RangeMenu();

          this.menu.on("update", this.fireUpdate, this);
      },
      fireUpdate: function() {
          this.setActive(this.isActivatable());
          this.fireEvent("update", this);
      },
      isActivatable: function() {
          var value = this.menu.getValue();
          return value.eq !== undefined || value.gt !== undefined || value.lt !== undefined;
      },
      setValue: function(value) {
          this.menu.setValue(value);
      },
      getValue: function() {
          return this.menu.getValue();
      },
      serialize: function() {
          var args = [];
          var values = this.menu.getValue();
          for(var key in values) {
              args.push({type: 'numeric', comparison: key, value: values[key]});
          }
          this.fireEvent('serialize', args, this);
          return args;
      },
      validateRecord: function(record) {
          var val = record.get(this.dataIndex),
                  values = this.menu.getValue();

          if(values.eq != undefined && val != values.eq) {
              return false;
          }
          if(values.lt != undefined && val >= values.lt) {
              return false;
          }
          if(values.gt != undefined && val <= values.gt) {
              return false;
          }
          return true;
      }
  });