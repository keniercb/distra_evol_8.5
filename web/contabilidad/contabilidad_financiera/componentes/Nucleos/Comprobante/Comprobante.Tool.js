  Ext.ns('Ext.Cont.Comprobante');
  Ext.Cont.Comprobante.Tool = {
      init: function(agIdComprante) {
          Ext.QuickTips.init();
          var scope = this;
          scope.url = '/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/mostrarcomprobante/';
          scope.perfil = window.parent.perfil;
          Ext.CONT.Componentes.MessageBox('msgLoading', 'Cargando datos del comprobante...', 'Por favor espere');
          Ext.Ajax.request({
              method: "POST",
              url: scope.url + "loadComprobanteExterno",
              params: {
                  idcomprobante: agIdComprante
              },
              callback: function(options, success, response) {
                  this.responseData = Ext.decode(response.responseText);
                  if(this.responseData.pases.length > 0) {
                      Ext.Cont.Comprobante.init(this.responseData.idsubsistema, this.responseData.detalle, this.responseData.observacion, this.responseData.fecha, this.responseData.pases, 3, 1, 0, this.responseData.estado, agIdComprante);
                  }
                  Ext.CONT.Componentes.HideBox('msgLoading');
              }
          });

          return this;
      }

  };

  // Ext.Cont.Comprobante.Revert = Ext.extend(Ext.component ,{
  //     constructor: function () {
  //         this.addEvent('');
  //         this.url = '/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/comprobante/';
  //         this.perfil = window.parent.perfil;
  //         Ext.Cont.Comprobante.Revert.superclass.constructor.call(this);
  //     },
  //     init: function(agIdComprante, detalle = '') {
  //         Ext.CONT.Componentes.MessageBox('msgLoadingRevert', 'Cancelando el comprobante...', 'Por favor espere');
  //         Ext.Ajax.request({
  //             method: "POST",
  //             scope: this,
  //             url: this.url + "revertirComprobante",
  //             params: {
  //                 idcomprobante: agIdComprante,
  //                 detalle: detalle,
  //             },
  //             callback: function(options, success, response) {
  //                 this.responseData = Ext.decode(response.responseText);
  //                 if (success && !this.responseData.CodMsg) {
  //                     Ext.CONT.Componentes.HideBox('msgLoadingRevert');
  //                     this.fireEvent('success', this.responseData.idcomprobante, this.responseData.numero, this.responseData.fecha);
  //                 }
  //             }
  //         });
  //     }
  //
  // });