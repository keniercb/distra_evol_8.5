/**
 * User: adrian
 * Date: 7/10/13
 * Time: 12:47
 * To change this template use File | Settings | File Templates.
 */
Ext.ns('Ext.aft');

if (!Ext.aft.regNumerico) {
    Ext.ns('Ext.aft.regNumerico');
}

Ext.aft.regNumerico.fn = {
    getBotonesNorte: function (grid) {
        var botones = new Array();
        botones.push(grid.btnAdicionar);
        botones.push(grid.btnEliminar);
        botones.push(grid.btnGuardar);
		botones.push(grid.btnReplicar);
        botones.push(grid.btnMonedas);
        botones.push('->');
        botones.push(grid.btnAyuda);
        return botones;
    },
    getBotonesSur: function (grid) {
        var botones = new Array();
        botones.push(grid.btnAdicionar);
        botones.push(grid.btnEliminar);
        botones.push(grid.btnGuardar);
        botones.push(grid.btnMonedas);
        return botones;
    },
    gestionarBotones: function (Component) {

        if (Component.datos.tipo_interfaz == 'no_entrada') {
            Component.gridSur.btnMonedas.setVisible(Component.gridSur.monedasVisibles);
            if (Component.gridSur.editable) {
                if (Component.gridNorte.getSelectionModel().hasSelection() /*&& Component.gridSur.getStore().getCount() < Component.gridNorte.getSelectionModel().getSelected().data.cantidad*/) {
                    Component.gridSur.btnAdicionar.enable();
                } else {
                    Component.gridSur.btnAdicionar.disable();
                }
                if (Component.gridSur.getSelectionModel().hasSelection()) {
                    Component.gridSur.btnEliminar.enable();
					Component.gridSur.btnMonedas.enable();
                    if (Component.gridSur.getSelectionModel().getSelected().dirty) {
                        Component.gridSur.btnGuardar.enable();
                    } else {
                        Component.gridSur.btnGuardar.disable();
                    }
                } else {
                    Component.gridSur.btnEliminar.disable();
                    Component.gridSur.btnMonedas.disable();
                    Component.gridSur.btnGuardar.disable();
                }
            } else {
                Component.gridSur.btnAdicionar.disable();
                Component.gridSur.btnGuardar.disable();
                Component.gridSur.btnGuardar.disable();
            }
        } else {
            if (Component.gridNorte.editable) {
                Component.gridNorte.btnMonedas.setVisible(Component.gridNorte.monedasVisibles);
                if (Component.gridNorte.datos.iddocinventario != false) {
                    Component.gridNorte.btnEliminar.disable();
					Component.gridNorte.btnReplicar.disable();
                    Component.gridNorte.btnMonedas.disable();
                    Component.gridNorte.btnAdicionar.disable();
                } else {
                    if (!Component.gridNorte.datos.isOperacionRecep) {
                        Component.gridNorte.btnAdicionar.enable();
                    }
                }
                if (Component.gridNorte.getSelectionModel().hasSelection()) {

                    if (Component.gridNorte.datos.iddocinventario != false) {
                        Component.gridNorte.btnEliminar.disable();
						Component.gridNorte.btnReplicar.disable();
                        Component.gridNorte.btnMonedas.disable();
                        Component.gridNorte.btnAdicionar.disable();
                    } else {
                        if (!Component.gridNorte.datos.isOperacionRecep) {
                            Component.gridNorte.btnEliminar.enable();
							Component.gridNorte.btnReplicar.enable();
                        }
                        Component.gridNorte.btnMonedas.enable();
                        Component.gridNorte.btnEliminar.enable();
						Component.gridNorte.btnReplicar.enable();
                    }

                    if (Component.gridNorte.getSelectionModel().getSelected().dirty) {
                        Component.gridNorte.btnGuardar.enable();
                    } else {
                        if (Component.gridNorte.datos.iddocinventario != false){
                            Component.gridNorte.btnEliminar.disable();
                            Component.gridNorte.btnReplicar.enable();
                        }else{  
                            Component.gridNorte.btnEliminar.enable();
                            Component.gridNorte.btnReplicar.enable();
                          /*  for (var i = 0; i < Component.gridNorte.getStore().data.items.length; i++) {
                                if (!r.data.idregnumerico) {
                                    Component.gridNorte.btnGuardar.enable();
                                    break;
                                } else {
                                    Component.gridNorte.btnGuardar.disable();
                                    break;
                                }
                            }*/
                            Component.gridNorte.btnGuardar.disable();
                        }
                      
                    }
                } else {


                    Component.gridNorte.btnEliminar.disable();
                    Component.gridNorte.btnMonedas.disable();
					Component.gridNorte.btnReplicar.disable();

                   /* for (var i = 0; i < Component.gridNorte.getStore().data.items.length; i++) {
                        if (!r.data.idregnumerico) {
                            Component.gridNorte.btnGuardar.enable();
                            continue;
                        } else {
                            Component.gridNorte.btnGuardar.disable();
                            continue;
                        }
                    }*/
                     Component.gridNorte.btnGuardar.disable();

                }
            } else {
                Component.gridNorte.btnAdicionar.disable();
                Component.gridNorte.btnGuardar.disable();
                Component.gridNorte.btnEliminar.disable();
				Component.gridNorte.btnReplicar.disable();
            }

            if (Component.gridNorte.datos.inventario) {
                if (Component.gridNorte.datos.idestado == "2") {
                    Component.gridNorte.btnAdicionar.enable();
                    Component.gridNorte.btnGuardar.enable();
                } else {
                    Component.gridNorte.btnAdicionar.disable();
                    Component.gridNorte.btnGuardar.disable();
                }

            } else if (Component.gridNorte.datos.operacionAjuste) {
                Component.gridNorte.btnAdicionar.disable();
                Component.gridNorte.btnGuardar.disable();
                Component.gridNorte.btnEliminar.disable();
				Component.gridNorte.btnReplicar.disable();
            }
        }
    },

    adicionarMovRegNumSur: function (Component) {
        var _this = this;
        //  if (Component.datos.cantidad > Component.gridSur.getStore().reader.jsonData.total) {
        // Ext.getBody().mask(Component.idioma.lbMaskG, 'x-mask-loading');
        Ext.MessageBox.wait("Adicionando datos", "Por favor espere...");
        if (Component.gridNorte.getSelectionModel().getCount() > 0) {

            var parametros = new Array();
            var records = Component.gridNorte.getSelectionModel().getSelections();

            for (var i = 0; i < records.length; i++) {
                var params = records[i].data;
                params.idproducto = Component.datos.idproducto;
                params.idmovimiento = Component.datos.idmovimiento;
                params.idarearesp = Component.datos.idarearesp;
                parametros.push(params);
            }
            Ext.Ajax.request({
                url: Component.datos.urlControladora + 'adicionarseriesnoentrada',
                method: 'POST',
                params: {
                    parametros: Ext.encode(parametros),
                    idoperacion: Component.datos.idoperacion,
                    idestructura: Component.datos.idestructurapadre
                },
                callback: function (options, success, response) {
                    Ext.MessageBox.hide();
                    // Ext.getBody().unmask();
                    var rd = Ext.decode(response.responseText);

                    if (rd.idregNum) {
                        _this.winInmueblesModulo = new Ext.LOG.winRegNumInmueble.winInscripcionModulo({
                            idioma: Component.idioma,
                            idregNum: rd.idregNum,
                            idregnuminicial: rd.idregnuminicial,
                            Component: Component.datos,
                            url: Component.datos.urlControladora,
                            component: Component
                        })
                        _this.winInmueblesModulo.show();
                    }
                    else {
                        if (rd.failure) {
                            if (rd.codigo == '001') {
                                mostrarMensaje(3, Component.idioma.lbMsgGuardarErrorEstadoNoConfigurado);
                            } else {
                                mostrarMensaje(3, Component.idioma.lbMsgGuardarError)
                            }
                        } else {
                            for (var i = 0; i < rd.datos.length; i++) {
                                var obj = rd.datos[i];
                                Component.gridNorte.llavesForaneas = new Array();

                                Component.gridNorte.llavesForaneas[0] = {
                                    key: 'idregnumerico',
                                    value: obj.idregnumerico
                                };
                                Component.gridNorte.llavesForaneas[1] = {
                                    key: 'idmovregnumerico',
                                    value: obj.idmovregnumerico
                                };
                                Component.gridNorte.ar_where = 'idregnumerico = ' + obj.idregnumerico + ' and idmovregnumerico = ' + obj.idmovregnumerico;
                                Component.gridNorte.propertyGridAtribDinamicos.btnGuardar.handler();
                            }
                            mostrarMensaje(1, Component.idioma.lbMsgGuardarOk);
                            Component.gridSur.getStore().load();
                        }
                    }
                }
            });
        } else {
            Ext.getBody().unmask();
            mostrarMensaje(3, Component.idioma.lbDebeSelecionarFila);
        }
        /*} else {// se cambio el negocio de la cantidad
         mostrarMensaje(1, Component.idioma.lbCantidadLimite);
         }*/
    },
    adicionarMovRegNumSurNoDepreciar: function (Component) {
        var _this = this;
        // if (Component.datos.cantidad > Component.gridSur.getStore().reader.jsonData.total) {
        Ext.getBody().mask(Component.idioma.lbMaskG, 'x-mask-loading');
        if (Component.gridNorte.getSelectionModel().getCount() > 0) {

            var parametros = new Array();
            var records = Component.gridNorte.getSelectionModel().getSelections();

            for (var i = 0; i < records.length; i++) {
                var params = records[i].data;
                params.idproducto = Component.datos.idproducto;
                params.idmovimiento = Component.datos.idmovimiento;
                params.idarearesp = Component.datos.idarearesp;
                parametros.push(params);
            }
            Ext.Ajax.request({
                url: Component.datos.urlControladora + 'adicionarseriesnoentrada',
                method: 'POST',
                params: {
                    parametros: Ext.encode(parametros),
                    idoperacion: Component.datos.idoperacion,
                    idestructura: Component.datos.idestructurapadre/*,
                     accion: 'nodepreciar'*/
                },
                callback: function (options, success, response) {
                    Ext.getBody().unmask();
                    var rd = Ext.decode(response.responseText);
                    if (rd.failure) {
                        if (rd.codigo == 001) {
                            mostrarMensaje(3, Component.idioma.lbMsgGuardarErrorEstadoNoConfigurado);
                        } else {
                            mostrarMensaje(3, Component.idioma.lbMsgGuardarError)
                        }
                    } else {
                        for (var i = 0; i < rd.length; i++) {
                            var obj = rd[i];
                            Component.gridNorte.llavesForaneas = new Array();

                            Component.gridNorte.llavesForaneas[0] = {
                                key: 'idregnumerico',
                                value: obj.idregnumerico
                            };
                            Component.gridNorte.llavesForaneas[1] = {
                                key: 'idmovregnumerico',
                                value: obj.idmovregnumerico
                            };
                            Component.gridNorte.ar_where = 'idregnumerico = ' + obj.idregnumerico + ' and idmovregnumerico = ' + obj.idmovregnumerico;
                            Component.gridNorte.propertyGridAtribDinamicos.btnGuardar.handler();
                        }
                        mostrarMensaje(1, Component.idioma.lbMsgGuardarOk);
                        Component.gridSur.getStore().load();
                    }
                    //}
                }
            });
        } else {
            Ext.getBody().unmask();
            mostrarMensaje(3, Component.idioma.lbDebeSelecionarFila);
        }
        /*} else {//se cambio
         mostrarMensaje(1, Component.idioma.lbCantidadLimite);
         }*/
    },
    eliminarMovimiento: function (Component) {
        var _this = null;
        var param = {};
        var parametros = new Array();
        var records;
        if (Component.datos.tipo_interfaz == 'no_entrada') {
            _this = Component.gridSur;
            records = _this.getSelectionModel().getSelections();
            for (var i = 0; i < records.length; i++) {
                if (records[i].data.idregnumerico) {
                    param = {
                        idregnumerico: records[i].data.idregnumerico,
                        idmovregnumerico: records[i].data.idmovregnumerico
                    };
                    parametros.push(param);
                }
            }

        } else {
            _this = Component.gridNorte;
            records = _this.getSelectionModel().getSelections();
            for (var i = 0; i < records.length; i++) {
                if (records[i].data.idregnumerico) {
                    param = {
                        idregnumerico: records[i].data.idregnumerico,
                        idmovregnumerico: records[i].data.idmovregnumerico
                    };
                    parametros.push(param);
                }

            }
        }
        mostrarMensaje(2, Component.idioma.lbMsgConfirmarEliminar, function (btn) {

            if (btn == 'ok') {
                // var mask = new Ext.LoadMask(Component.getEl(), {msg: Component.idioma.lbMaskEliminando});
                // mask.show();
                Ext.MessageBox.wait('Eliminando datos', "Por favor espere...");
                Ext.Ajax.request({
                    url: Component.datos.urlControladora + 'eliminarserieentrada',
                    method: 'POST',
                    params: {
                        movimientos: Ext.encode(parametros),
                        modificadisponibilidad: (Component.datos.tipo_interfaz == 'no_entrada') ? true : false,
                        idmovimiento: Component.gridNorte.datos.idmovimiento,
                        idoperacion: Component.datos.idoperacion,
                        idproducto: Component.datos.idproducto,
                        inventario: (Component.gridNorte.datos.inventario) ? 2 : 0
                    },
                    success: function () {
                        // mask.hide();
                        Ext.MessageBox.hide();
                        mostrarMensaje(1, Component.idioma.lbMsgEliminarOk);
                        _this.getStore().load();
                    },
                    failure: function () {
                        Ext.getBody().unmask();
                        Ext.MessageBox.hide();
                        mostrarMensaje(3, Component.idioma.lbMsgEliminarError);
                    }
                });
            }
        });
    },
    definirComportamientoBotonesNorte: function (Component) {
        Component.gridNorte.btnAdicionar.tooltip = Component.idioma.lbTtBtnAdicionar;
        Component.gridNorte.btnAdicionar.on('click', function () {
            Component.gridNorte.adicionarFila();
        });

        Component.gridNorte.btnEliminar.tooltip = Component.idioma.lbTtBtnEliminar;
        Component.gridNorte.btnEliminar.on('click', function () {
            Ext.aft.regNumerico.fn.eliminarMovimiento(Component);
        });

        Component.gridNorte.btnGuardar.tooltip = Component.idioma.lbTtBtnGuardar;
        Component.gridNorte.btnGuardar.on('click', function () {
            Component.gridNorte.guardarFila();
        });
		
		Component.gridNorte.btnReplicar.tooltip = "Replica los datos del registro seleccionado";
		Component.gridNorte.btnReplicar.on('click', function () {
            Component.gridNorte.replicarDatos();
        });

        Component.gridNorte.btnMonedas.tooltip = Component.idioma.lbTtBtnMonedas;
        Component.gridNorte.btnMonedas.on('click', function () {
            Component.gridNorte.getPMonedas().show();
            Component.gridNorte.getPMonedas().expand();
            Component.doLayout();
        });
        if (Component.gridNorte.limpiarBtn)
            Component.gridNorte.limpiarBtn.tooltip = (Component.datos.tipo_interfaz == 'no_entrada') ? Component.idioma.lbTtBtnLimpiarS : Component.idioma.lbTtBtnLimpiarS;
        if (Component.gridNorte.buscarBtn)
            Component.gridNorte.buscarBtn.tooltip = (Component.datos.tipo_interfaz == 'no_entrada') ? Component.idioma.lbTtBtnbuscarS : Component.idioma.lbTtBtnbuscarE;

        Component.gridNorte.btnAyuda.on('click', function () {
            if (Component.datos.tipo_interfaz == 'entrada') {
                if (!Ext.Msg.isVisible()) {
                    var title = 'Ayuda de Registro numerico de entrada';
                    var referencia = 'Logística/Gestión del transporte/Gestión de documentos/Medios en uso/Registro numerico de entrada';
                    help.show(title, referencia);
                }
            } else if (Component.datos.tipo_interfaz == 'no_entrada') {
                if (!Ext.Msg.isVisible()) {
                    var title = 'Ayuda de Registro numerico de no entrada';
                    var referencia = 'Logística/Gestión del transporte/Gestión de documentos/Medios en uso/Registro numerico de no entrada';
                    help.show(title, referencia);
                }
            }

        });
    },
    definirComportamientoBotonesSur: function (Component) {
        Component.gridSur.btnAdicionar.tooltip = Component.idioma.lbTtBtnAdicionar;
        Component.gridSur.btnAdicionar.on('click', function () {
            Ext.aft.regNumerico.fn.adicionarMovRegNumSur(Component);
        });

        Component.gridSur.btnEliminar.tooltip = Component.idioma.lbTtBtnEliminar;
        Component.gridSur.btnEliminar.on('click', function () {
            Ext.aft.regNumerico.fn.eliminarMovimiento(Component);
        });

        Component.gridSur.btnGuardar.tooltip = Component.idioma.lbTtBtnGuardar;
        Component.gridSur.btnGuardar.on('click', function () {
            Component.gridSur.guardarFila();
        });

        Component.gridSur.btnMonedas.tooltip = Component.idioma.lbTtBtnMonedas;
        Component.gridSur.btnMonedas.on('click', function () {
            Component.gridSur.getPMonedas().show();
            Component.gridSur.getPMonedas().expand();
            Component.doLayout();
        });
        if (Component.gridSur.limpiarBtn)
            Component.gridSur.limpiarBtn.tooltip = (Component.datos.tipo_interfaz == 'no_entrada') ? Component.idioma.lbTtBtnLimpiarF : Component.idioma.lbTtBtnLimpiarS;
        if (Component.gridSur.buscarBtn)
            Component.gridSur.buscarBtn.tooltip = (Component.datos.tipo_interfaz == 'no_entrada') ? Component.idioma.lbTtBtnbuscarE : Component.idioma.lbTtBtnbuscarS;


        /* Component.gridSur.limpiarBtn.on('click', function () {

         });*/
    }
};
