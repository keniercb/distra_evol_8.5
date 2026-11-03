  /** 
   * @description Informacion para la excepciones.
   * 
   * @author Ing. Miguel Diaz Riveaux.
   * @package ERP Cuba.
   * @subpackage Datos Maestros. 
   * @namespace Ext.ConfGnral.Comun
   * @copyright XETID.
   * @version 1.0
   */
  Ext.namespace('Ext.ConfGnral.Comun');
  Ext.ConfGnral.Comun.InfoException = Ext.extend(Ext.Component, {
      perfil: window.parent.UCID.portal.perfil,
      respuesta: '',
      constructor: function() {
          Ext.QuickTips.init();
          scopeInfoException = this;
          Ext.Msg.wait("Cargando...", "Por favor espere");
          Ext.Ajax.request({
              method: "POST",
              url: "getexcepcioncontrolada",
              callback: function(options, success, response) {
                  scopeInfoException.respuesta = Ext.decode(response.responseText);
                  scopeInfoException.cargarInterfaz();
              }
          });
      },
      cargarInterfaz: function() {
          if(Ext.Msg.isVisible()){
            Ext.Msg.hide();
          }
          scopeInfoException.vpInfo = new Ext.Viewport({
              id: 'vpInfo',
              layout: 'fit',
              items: [
                  new Ext.Panel({
                      id: 'pInfo',
                      frame: false,
                      border: false,
                      layout: 'fit'
                  })
              ]
          });
          mostrarMensaje(1, scopeInfoException.respuesta.detalles, scopeInfoException.closeWindow);

      },
      closeWindow: function(btn) {
          if(btn == 'ok'){
              window.parent.Ext.getCmp('win' + window.parent.idFuncionalidad).close();
          }
      }
  });
  new Ext.ConfGnral.Comun.InfoException();

