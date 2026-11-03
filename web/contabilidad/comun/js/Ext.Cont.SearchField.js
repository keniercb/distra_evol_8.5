  /* 
   * Campo de texto para realizar b&uacute;squeda simples.
   * Nota importante #1: Es necesario pasarle las dos funciones que realizar&aacute; al buscar y limpiar.
   * Nota importante #2: Para evitar que la tecla escape no cierre una ventana y permita borrar debe pasarle a esa ventana la siguiente propiedad <code>onEsc: Ext.emptyFn</code>
   * 
   * @author Ing. Miguel D&iacute;az Riveaux & Ing. Rodain Terrer Molina & Ing. Alexis Rodr&iacute;guez Reyes.
   * @package ERP Cuba.
   * @subpackage Contabilidad y Finanzas. 
   * @namespace Ext.Cont.SearchField
   * @copyright XETID.
   * @version 1.0-0
   */
  Ext.QuickTips.init();
  if(!Ext.Cont)
      Ext.namespace('Ext.Cont');
  Ext.Cont.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
      validationEvent: false,
      validateOnBlur: false,
      selectOnFocus: true,
      hasSearch: false,
      hideTrigger1: true,
      lbTtlElement:undefined,
      trigger1Class: 'x-form-clear-trigger',
      trigger2Class: 'x-form-search-trigger',
      clearTooltip: 'Limpiar filtros <b>(Esc)</b>',
      searchTooltip: 'Buscar elementos <b>(Enter)</b>',
      emptyText: 'Criterio a buscar...',
      fnOnClear: Ext.emptyFn,
      fnOnSearch: Ext.emptyFn,
      initComponent: function(config) {
          Ext.apply(this, config);
          if(!this.id) { // definiendo un id si no fue definido en la configuracion
              var alreadyExist = Ext.DomQuery.select('span img[class*=x-form-search-trigger]');
              this.id = 'x-form-search' + ( alreadyExist.length + 1 );
          }
          Ext.Cont.SearchField.superclass.initComponent.call(this);
          this.triggerConfig.cn[0].qtip = this.clearTooltip;
          this.triggerConfig.cn[1].qtip = (this.lbTtlElement != undefined) ? String.format('Buscar {0} <b>(Enter)</b>', this.lbTtlElement) : this.searchTooltip;
          this.on({
              specialkey: {
                  fn: function(f, e) {
                      if(e.getKey() == e.ENTER || e.getKey() == 13) {
                          this.onTrigger2Click();
                      }
                      if(e.getKey() == e.ESC || e.getKey() == 27) {
                          e.stopEvent();
                          this.onTrigger1Click();
                          f.triggerBlur();
                      }
                  },
                  scope: this
              }
          });
      },
//    afterRender: function() {
//        /* AQUI SE PUEDEN DEFINIR LOS ENENTOS DEL TAG <img> DE HTML */
////        item.onmouseover = function() {
////        };
//    },
      onTrigger1Click: function() {
          this.el.dom.value = '';
          this.blur();
          this.reset();
          if(this.hasSearch) {
              this.hasSearch = false;
              this.triggers[0].hide();
              if(typeof ( this.fnOnClear ) == 'function') {
                  this.fnOnClear();
              }
          }
      },
      onTrigger2Click: function() {
          var v = this.getRawValue();
          if(v.length < 1) {
              this.onTrigger1Click();
              return;
          }
          this.hasSearch = true;
          this.triggers[0].show();
          if(typeof ( this.fnOnSearch ) == 'function') {
              this.fnOnSearch();
          }
      }
  });
  Ext.reg('searchfield', Ext.Cont.SearchField);