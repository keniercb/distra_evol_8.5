  /**
   * @description Informacion para la funcionalidad Definir cuenta por entidad al lanzar excepciones controladas del sistema.
   *
   * @author Ing. Miguel Diaz Riveaux.
   * @package ERP Cuba.
   * @subpackage Contabilidad y Finanzas.
   * @namespace Ext.Confin.Configuracion.AsociarCuentaConcepto
   * @copyright XETID.
   * @version 1.0
   */
  Ext.namespace('Ext.Confin.Comun');
  Ext.Confin.Comun.InfoException = Ext.extend(Ext.Component, {
      perfil: window.parent.UCID.portal.perfil,
      respuesta: '',
      constructor: function() {
          Ext.QuickTips.init();
          scopeInfoException = this;
          // Ext.Msg.wait("Cargando...", "Por favor espere");
          this.loadMessageBox();
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
          // if(Ext.Msg.isVisible()){
          //   Ext.Msg.hide();
          // }
          Ext.MessageBox.hide();
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
      },
      loadMessageBox: function (msg = 'Cargando...', title = 'Por favor espere...') {
          Ext.MessageBox.show({
              title: title,
              msg: msg,
              width: 300,
              progress: true,
              closable: false
          });//manera de ocultarlo Ext.MessageBox.hide();
          var f = function (v) {
              return function () {
                  var i = v / 11;
                  Ext.MessageBox.updateProgress(i);
              };
          };
          for (var i = 1; i < 12; i++)
              setTimeout(f(i), i * 500);
      }
  });
  new Ext.Confin.Comun.InfoException();
