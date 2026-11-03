// Ext.override(cein.views.GestorreportesView, { //aqui es donde da el error que no levanta la ventana en el portal
//     initComponent: function () {
//         //TODO: Pre-initialization
//         me = this;
//
//         cein.views.GestorreportesView.superclass.initComponent.call(this);
//         //TODO: Pos-initialization
//
//     },
//
//     //@EVENT_HANDLERS    - ATTENTION: Don't remove this tag.
//
//     //@COMPONENT_SERVICE - ATTENTION: Don't remove this tag.
//
//     beforerender: function () {
//         if (Ext.getCmp('winInser').btnAplicar) {
//
//         }
//     },
//     onRender: function () {
//         //TODO: Pre-render
//         cein.views.GestorreportesView.superclass.onRender.apply(this, arguments);
//         //TODO: Pos-render
//         // Ext.getCmp('soporte').hide();
//
//         if (!this.btnsubsistema) {
//             Ext.getCmp('winInser').setSize(480, 337);
//         }
//     },
//
//     onDestroy: function () {
//         //TODO: Pre-destroy
//         cein.views.GestorreportesView.superclass.onDestroy.call(this);
//     },
//     /*on_window_render:function(){
//      pathname = location.pathname;
//      subsistema= pathname.split('/');
//      if(subsistema[1]!= 'portal'){
//      // this.cbplusTree.setValue(subsistema[subsistema.length-1]);
//      //  this.cbplusTree.setValue(subsistema[1]);
//      this.cbplusTree.setValue(pathname);
//      this.cbplusTree.disable();
//      }
//      },*/
//
//     //    on_btnAceptarGest_click: function () {
//     //     if (tieneModuloCEIN) {
//     //         var archivo = Ext.getCmp('fileUploadArchivo').value;
//     //     } else {
//     //         var archivo = Ext.getCmp('fileUploadArchivoCliente').value;
//     //     }
//     //     if (archivo) {
//     //         var arre = new Array();
//     //         var arre = archivo.split('.');
//     //
//     //         var extension = archivo.split('.')[archivo.split('.').length - 1];
//     //         if (extension == 'jpeg' || extension == 'gif' || extension == 'jpg' || extension == 'png' || extension == 'JPEG' || extension == 'GIF' || extension == 'JPG' || extension == 'PNG') {
//     //             if (this.textareaDescripcionPortal.getValue() != "Sugerencias: \n 1.¿Qué ocurrió? (Mensaje exacto del error). \n 2. Secuencia de acciones que precedieron al error. \n 3.Si ocurrió en un formulario: ¿Cuál fue el juego de datos introducido? \n 4. Opinión personal acerca de las causas que generaron la incidencia.") {
//     //                 this.crearNC('aceptar');
//     //             }
//     //             else {
//     //                 mostrarMensaje(6, 'Debe llenar el campo descripción.');
//     //             }
//     //         }
//     //         else {
//     //             mostrarMensaje(6, 'La imagen introducida no es válida.');
//     //         }
//     //     }
//     //     else {
//     //         if (this.textareaDescripcionPortal.getValue() != "Sugerencias: \n 1.¿Qué ocurrió? (Mensaje exacto del error). \n 2. Secuencia de acciones que precedieron al error. \n 3.Si ocurrió en un formulario: ¿Cuál fue el juego de datos introducido? \n 4. Opinión personal acerca de las causas que generaron la incidencia.") {
//     //             this.crearNC('aceptar');
//     //         }
//     //         else {
//     //
//     //             mostrarMensaje(6, 'Debe llenar el campo descripción.');
//     //         }
//     //     }
//     //
//     // },
//     //
//     // on_btnAplicar_click: function () {
//     //     if (tieneModuloCEIN) {
//     //         var archivo = Ext.getCmp('fileUploadArchivo').value;
//     //     } else {
//     //         var archivo = Ext.getCmp('fileUploadArchivoCliente').value;
//     //     }
//     //     if (archivo) {
//     //         var arre = new Array();
//     //         arre = archivo.split('.');
//     //         var extension = arre[arre.length - 1];
//     //
//     //         if (extension == 'jpeg' || extension == 'gif' || extension == 'jpg' || extension == 'png' || extension == 'JPEG' || extension == 'GIF' || extension == 'JPG' || extension == 'PNG') {
//     //             if (this.textareaDescripcionPortal.getValue() != "Sugerencias: \n 1.¿Qué ocurrió? (Mensaje exacto del error). \n 2. Secuencia de acciones que precedieron al error. \n 3.Si ocurrió en un formulario: ¿Cuál fue el juego de datos introducido? \n 4. Opinión personal acerca de las causas que generaron la incidencia.") {
//     //
//     //                 this.crearNC('aplicar');
//     //             }
//     //             else {
//     //                 mostrarMensaje(6, 'Debe llenar el campo descripción ');
//     //             }
//     //         }
//     //         else {
//     //
//     //             mostrarMensaje(6, 'La imagen introducida no es válida.');
//     //         }
//     //     }
//     //     else {
//     //         if (this.textareaDescripcionPortal.getValue() != "Sugerencias: \n 1.¿Qué ocurrió? (Mensaje exacto del error). \n 2. Secuencia de acciones que precedieron al error. \n 3.Si ocurrió en un formulario: ¿Cuál fue el juego de datos introducido? \n 4. Opinión personal acerca de las causas que generaron la incidencia.") {
//     //
//     //             this.crearNC('aplicar');
//     //         }
//     //         else {
//     //
//     //             mostrarMensaje(6, 'Debe llenar el campo descripción.');
//     //         }
//     //     }
//     // }, crearNC: function (tipo) {
//     //     var func = "";
//     //     var subsist = "";
//     //
//     //     if (Ext.getCmp('fieldSubsistema').getValue() != "") {
//     //         func = Ext.getCmp('fieldSubsistema').getValue();
//     //     }
//     //     else {
//     //         subsist = Ext.getCmp('tfsubsistema').getValue();
//     //         func = Ext.getCmp('tffuncionalidad').getValue();
//     //     }
//     //     if (Ext.getCmp('cbvias').getValue()) {
//     //         via = Ext.getCmp('cbvias').getValue();
//     //     } else {
//     //         via = 1;
//     //     }
//     //     if (tipo == 'aplicar') {
//     //         Ext.getCmp('formpanelGestor').getForm().submit({
//     //             url: urlcrearnc,
//     //             params: {
//     //                 descripcion: this.textareaDescripcionPortal.getValue(),
//     //                 funcionalidad: func,
//     //                 pathname: location.pathname,
//     //                 via: via,
//     //                 idcliente: Ext.getCmp('cbcliente').getValue(),
//     //                 idproducto: Ext.getCmp('cbproducto').getValue(),
//     //                 desdeportal: 1,
//     //                 nivel: Ext.getCmp('cbnivel').getValue(),
//     //                 subsistema: subsist
//     //             },
//     //             success: crearNCAplicarSuccess(),
//     //             failure: crearNCFailure (options, resp)
//     //         });
//     //     }
//     //     else {
//     //         this.cbplusTree.setValue('');
//     //         var ventana = this;
//     //         Ext.getCmp('formpanelGestor').getForm().submit({
//     //             url: urlcrearnc,
//     //             params: {
//     //                 descripcion: this.textareaDescripcionPortal.getValue(),
//     //                 funcionalidad: func,
//     //                 pathname: location.pathname,
//     //                 via: via,
//     //                 idcliente: Ext.getCmp('cbcliente').getValue(),
//     //                 idproducto: Ext.getCmp('cbproducto').getValue(),
//     //                 desdeportal: 1,
//     //                 nivel: Ext.getCmp('cbnivel').getValue(),
//     //                 subsistema: subsist
//     //             },
//     //             success: crearNCAceptarSuccess(),
//     //             failure: crearNCFailure (options, resp)
//     //         });
//     //     }
//     //
//     //
//     // },
//     //
//     //
//     //
//     // on_btnCancelar_click: function () {
//     //     this.destroy();
//     // },
//
//     on_combosubsistema_select: function (combo, record, index) {
//         //TODO: Pre-destroy
//
//         Ext.Ajax.request({
//             url: '/herramientas/cein/index.php/gestorreportes/funcionalidades',
//             params: {
//                 id: record.json.id
//             },
//             callback: function (options, success, response) {
//                 responseData = Ext.decode(response.responseText);
//             }
//         });
//
//     }
// });

// function crearNCFailure(options, resp){
//     var msgId = resp.result.msgId;
//     if(msgId.substring(0, 3) == "Exc")
//         mostrarMensaje(6,'Ha ocurrido un error inesperado al intentar reportar la incidencia');
//     else
//         switch (msgId) {
//             case "ErrProductoNoExiste":
//                 mostrarMensaje(6, 'Ha ocurrido un error. Su producto no se encuentra registrado en el CEIN.');
//                 break;
//             case "ErrLicenciaNoExiste":
//                 mostrarMensaje(6, 'Ha ocurrido un error. El CEIN no posee licencia.');
//                 break;
//             case "ErrDatosInsuficientes":
//                 mostrarMensaje(6, 'Ha ocurrido un error. Su producto no posee licencia ni datos en el "Acerca de".');
//                 break;
//             default:
//                 mostrarMensaje(6, 'Ha ocurrido un error inesperado al intentar reportar la incidencia');
//         }
// }
//
// function crearNCAplicarSuccess(){
//     var msg1 = "La incidencia ha sido adicionada satisfactoriamente.";
//     mostrarMensaje(1, msg1.toString());
//     Ext.getCmp('cb').clear();
//     Ext.getCmp('formpanelGestor').getForm().reset();
//     Ext.getCmp('fileUploadArchivo').getEl().up('.x-form-field-wrap');
//
//     Ext.getCmp('fileUploadArchivo').value = '';
//     Ext.getCmp('btnAceptar').setDisabled(true);
//     Ext.getCmp('btnAplicar').setDisabled(true);
//
//     if (tieneModuloCEIN) {
//         Ext.getCmp('tfsubsistema').show();
//         Ext.getCmp('tfsubsistema').enable();
//         Ext.getCmp('tffuncionalidad').show();
//         Ext.getCmp('tffuncionalidad').enable();
//         //region fssubsistema
//         Ext.getCmp('fssubsistema').show();
//         Ext.getCmp('fssubsistema').enable();
//         //endregion
//
//         //region myfieldset
//         Ext.getCmp('myfieldset').enable();
//         Ext.getCmp('myfieldset').show();
//         //endregion
//         Ext.getCmp('cbcliente').show();
//         Ext.getCmp('cbcliente').enable();
//         Ext.getCmp('cbproducto').show();
//         // Ext.getCmp('cborigen').show();
//
//         Ext.getCmp('cbvias').setValue(4);
//
//         cbNivel = Ext.getCmp('cbnivel');
//         // cbNivel.setValue(cbNivel.store.getAt(0).json.default)
//         cbNivel.disable();
//
//         //region fssubsistema2
//         Ext.getCmp('fssubsistema2').hide();
//         //endregion
//         Ext.getCmp('btnFuncionalidad').hide();
//         Ext.getCmp('fieldSubsistema').hide();
//         Ext.getCmp('fieldSubsistema').disable();
//         Ext.getCmp('winInser').setHeight(558);
//     } else {
//         Ext.getCmp('cbproducto').reset();
//         Ext.getCmp('cbproducto').hide();
//         Ext.getCmp('cbproducto').disable();
//
//         Ext.getCmp('cbcliente').reset();
//         Ext.getCmp('cbcliente').hide();
//         Ext.getCmp('cbcliente').disable();
//
//         // Ext.getCmp('cborigen').reset();
//         // Ext.getCmp('cborigen').hide();
//         // Ext.getCmp('cborigen').disable();
//
//         //region myfieldset
//         Ext.getCmp('myfieldset').disable();
//         Ext.getCmp('myfieldset').hide();
//         //endregion
//
//         Ext.getCmp('tfsubsistema').hide();
//         Ext.getCmp('tfsubsistema').disable();
//         Ext.getCmp('tffuncionalidad').hide();
//         Ext.getCmp('tffuncionalidad').disable();
//         //region fssubsistema
//         Ext.getCmp('fssubsistema').hide();
//         Ext.getCmp('fssubsistema').disable();
//         //endregion
//         Ext.getCmp('cbcliente').hide();
//         Ext.getCmp('cbcliente').disable();
//         Ext.getCmp('cbproducto').hide();
//         Ext.getCmp('cbproducto').disable();
//         // Ext.getCmp('cborigen').hide();
//         // Ext.getCmp('cborigen').disable();
//
//         //region fssubsistema2
//         Ext.getCmp('fssubsistema2').enable();
//         Ext.getCmp('fssubsistema2').show();
//         //endregion
//         Ext.getCmp('btnFuncionalidad').show();
//         Ext.getCmp('winInser').setHeight(278);
//     }
// }
//
// function crearNCAceptarSuccess(){
//     var msg1 = "La incidencia ha sido adicionada satisfactoriamente.";
//     this.mostrarMensaje(1, msg1.toString());
//     ventana.destroy();
// }