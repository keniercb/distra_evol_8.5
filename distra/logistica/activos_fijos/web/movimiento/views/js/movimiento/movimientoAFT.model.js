/**
 * Created by yoendy on 11/10/2015.
 */

LOG.aft.movimiento.Model = Ext.extend(LOG.util.Model, {
    constructor: function(config) {
        Ext.apply(this, config);
        LOG.aft.movimiento.Model.superclass.constructor.call(this, config);
    },
    adicionarProductosInventario: function(records) {
        var _this = this.scope;
        //console.info(records);return;
        /*mostrarMensaje(2, _this.idioma.MsgConfirmarEstatus, function (btn) {
         if (btn == 'ok') {
         
         }
         });*/
        //var datStore = _this.stCentral.getRange();
        var arrayDatos = new Array();
        for (var i = 0; i < records.length; i++) {
            var ob = {
                idestructuraop: records[i].data.idestructura,
                idproducto: records[i].data.idproducto,
                cantidad: records[i].data.existencia/*,
                 iddocumento: _this.datos.iddocumento*/
            };

            arrayDatos.push(ob);
        }
        Ext.getBody().mask(_this.idioma.MaskConfHI, 'x-mask-loading');
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/movimiento/index.php/movimiento/salvarproductos',
            params: {
                medios: Ext.encode(arrayDatos),
                iddocumento: _this.datos.iddocumento,
                idareasInventario: _this.datos.idareasInventario,
                mensualInventario: _this.datos.mensualInventario,
                confirmar: (_this.datos.inventarioTotal)?2:null,
                idarearesp: _this.datos.idarearesp,
                inventario: 2
            },
            callback: function(o, s, r) {
                var resp = Ext.decode(r.responseText);
                if (resp.success) {
                    //_this.modificarEstado("Preparado", resp.idestado);
                    Ext.getBody().unmask();
                    if (_this.datos.inventarioTotal){
                        mostrarMensaje(1, _this.idioma.MsgConfHIOk);
                    }else{
                        mostrarMensaje(1, _this.idioma.MsgAddProductoOk);
                    }                    
                    _this.gpPrincipal.getStore().load();

                } else {
                    Ext.getBody().unmask();
                    mostrarMensaje(3, _this.idioma.MsgConfHIError);
                }
            }
        });
    },
    confirmarDocumento: function(mov) {
        
        var _this = this.scope;        
        if (!_this.datos.inventarioTotal && !_this.datos.inventarioParcialMensual) {
            var params = {
                iddocumento: _this.datos.iddocumento,
                scope: _this/*,
                inventario:(_this.datos.inventarioParcial)?2:null*/
            };
            _this._parent.model.confirmarDoc(params, _this.modificarEstado, mov);
        }
        else
        {
            mostrarMensaje(2, _this.idioma.MsgConfirmarEstatus, function(btn) {
                if (btn == 'ok') {
                    var datStore = _this.gpPrincipal.getStore().getRange();
                    var arrayDatos = new Array();
                    for (var i = 0; i < datStore.length; i++) {
                        var ob = {
                            idestructura: datStore[i].data.idestructura,
                            idproducto: datStore[i].data.idproducto,
                            // 0 Porque se piensa quitar la cantidad del cmp movimientos
                            cantidad: datStore[i].data.cantidad,
                            iddocumento: _this.datos.iddocumento
                        };

                        arrayDatos.push(ob);
                    }
                    // Ext.getBody().mask(_this.idioma.MaskConfHI, 'x-mask-loading');
                    Ext.MessageBox.wait(_this.idioma.MaskConfHI, "Por favor espere...");
                    Ext.Ajax.request({
                        url: '/logistica/activos_fijos/movimiento/index.php/movimiento/salvarproductos',
                        params: {
                            medios: Ext.encode(arrayDatos),
                            iddocumento: _this.datos.iddocumento,
                            confirmar: 2,
                            inventario: 2
                        },
                        callback: function(o, s, r) {
                            var resp = Ext.decode(r.responseText);
                            if (resp.success) {
                                _this.modificarEstado("Preparado", resp.idestado);
                                //Ext.getBody().unmask();
                                Ext.MessageBox.hide();
                                mostrarMensaje(1, _this.idioma.MsgConfHIOk);
                                _this.gpPrincipal.getStore().load();

                            } else {
                                // Ext.getBody().unmask();
                                Ext.MessageBox.hide();
                                mostrarMensaje(3, _this.idioma.MsgConfHIError);
                            }
                        }
                    });
                }
            });
        }
        //_this.gestionarBotones();


    },
    adicionarProductos: function(records) {
        var _this = this.scope;

        if (records.length > 0) {
            var datos = new Array();

            Ext.getBody().mask(_this.idioma.MaskAddProducto, 'x-mask-loading');

            for (var i = 0; i < records.length; i++) {
                datos.push(records[i].get('idindicador'));
                _this.indicadoresNoMostrar.push(records[i].get('idindicador'));
            }

            Ext.Ajax.request({
                url: _this.dirController + '/salvarproductos',
                method: 'POST',
                params: {
                    iddocumento: _this.datos.iddocumento,
                    idarearesp: _this.datos.idarearesp,
                    idoperacion: _this.datos.idoperacion,
                    datos: Ext.encode(datos)
                },
                callback: function(options, success, response) {
                    var rd = Ext.decode(response.responseText);
                    if (rd.success == true) {
                        Ext.getBody().unmask();
                        mostrarMensaje(1, _this.idioma.MsgAddProductoOk);
                        _this.gpPrincipal.getStore().reload();

                    } else {
                        Ext.getBody().unmask();
                        mostrarMensaje(3, _this.idioma.MsgAddProductoError);
                    }
                }
            });
        } else {
            mostrarMensaje('3', _this.idioma.lbMsgNoSeleccionaMediosAdd);
        }

    },
    onBtnEliminarProdClick: function() {

        var _this = this.scope;
        if (!_this.bloqueada) {
            mostrarMensaje(2, _this.idioma.lbMsgConfEliminar, function(button) {

                if (button == 'ok') {
                    var recordSelect = new Array();
                    var idprod = new Array();
                    //Ext.getBody().mask(_this.idioma.MaskDelProducto, 'x-mask-loading');
                    Ext.MessageBox.wait(_this.idioma.MaskDelProducto, "Por favor espere...");
                    for (var i = 0; i < _this.getSmPrincipal().getSelections().length; i++) {
                        recordSelect.push(_this.getSmPrincipal().getSelections()[i].data.idmovimiento)
                        idprod.push(_this.getSmPrincipal().getSelections()[i].data.idprod)
                    }
                    // var recordSelect = _this.getSmPrincipal().getSelected();
                    Ext.Ajax.request({
                        url: _this.dirController + '/eliminarproductos',
                        method: 'POST',
                        params: {
                            idmovimiento: Ext.encode(recordSelect)//recordSelect.get('idmovimiento')
                        },
                        callback: function(options, success, response) {
                            var rd = Ext.decode(response.responseText);
                        },
                        success: function() {
                            //Ext.getBody().unmask();
                            Ext.MessageBox.hide();
                            for (var j = 0; j < idprod.length; j++) {
                                var index = _this.indicadoresNoMostrar.indexOf(idprod[j]);
                                if (!_this.inventarioTotal && !_this.inventarioParcial) {
                                    _this.indicadoresNoMostrar.splice(index, 1);
                                }
                            }


                            mostrarMensaje(1, _this.idioma.lbMsgEliminarOK);
                            _this.gpPrincipal.getStore().reload();
                        },
                        failure: function() {
                            // Ext.getBody().unmask();
                            Ext.MessageBox.hide();
                            mostrarMensaje(3, _this.idioma.lbMsgEliminarError);
                        }
                    });
                }
            })
        }
    },
    insertarDatos: function(enviar) {
        var _this = this.scope;
        Ext.Ajax.timeout = 6000000;

        Ext.Ajax.request({
            url: _this.dirController + '/insertarDatos',
            method: 'POST',
            params: {
                datos: Ext.encode(enviar),
                iddocumento: _this.datos.iddocumento,
                idarearesp: _this.datos.idarearesp,
                idcentrocosto: _this.datos.idcentrocosto

            },
            callback: function(options, success, response) {
                Ext.Msg.hide();
                var rd = Ext.decode(response.responseText);
                if (rd.cod == 1) {
                    mostrarMensaje(1, _this.idioma.lbMsgInsertarExcel);
                    _this.winMostrarDatos.close();
                    if (_this.winConfigurarDatos && _this.winConfigurarDatos.isVisible()) {
                        _this.winConfigurarDatos.close();
                    }
                    _this.winImportar.close();
                    _this.gpPrincipal.getStore().reload();

                } else if (rd.cod == 3) {
                    mostrarMensaje(3, _this.idioma.lbMsgInsertarExcelError);
                } else if (rd.cod == 4) {
                    mostrarMensaje(3, _this.idioma.lbMsgInsertarExcelErrorNumeros);
                } else if (rd.cod == 5) {
                    mostrarMensaje(3, _this.idioma.lbMsgInsertarExcelErrorFecha);
                } else if (rd.cod == 6) {
                    mostrarMensaje(3, _this.idioma.lbMsgInsertarExcelErrorDoc);
                } else if (rd.cod == 7) {
                    mostrarMensaje(3, _this.idioma.lbMsgInsertarExcelErrorDuplicados);
                } else if (rd.cod == 8) {
                    var msg = _this.idioma.lbMsgInsertarExcelErrorNumerosExistentes;
                    if (rd.repetidos) {
                        if (rd.repetidos.length > 0) {
                            msg += ":";
                        } else {
                            msg += ".";
                        }
                        var i = 0;
                        while (rd.repetidos.length > i) {
                            msg += ' -' + rd.repetidos[i].nroserie;
                            i += 1;
                        }
                    }
                    mostrarMensaje(3, msg);
                }
            }
        })
    },
    validarCamposIntegracionInv: function(datMovGrid, scope) {
        var _this = this.scope;
        var arrDat = new Array();
        Ext.MessageBox.wait(_this.idioma.MaskConfHIE, _this.idioma.lbEspere);

        for (var i = 0; i < datMovGrid.items.length; i++) {
            arrDat.push(datMovGrid.items[i].data);
        }
        Ext.Ajax.request({
            url: _this.dirController + '/validarCamposIntegracionInv',
            method: 'POST',
            params: {
                arrDatMovGrid: Ext.encode(arrDat),
                idestructurapadre: scope.datos.idestructurapadre,
                tipo_interfaz: scope.datos.tipo_interfaz,
                idoperacion: scope.datos.idoperacion,
            },
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                Ext.MessageBox.hide();

                if (!rd.datos) {
                    mostrarMensaje(2, _this.idioma.msgConfirmarIntegInv);

                } else {
                    var params = {
                        iddocumento: _this.datos.iddocumento,
                        scope: _this
                    };
                    _this._parent.model.confirmarDoc(params, _this.modificarEstado);
                    // Ext.MessageBox.hide();
                }
            }
        });
    },
    contarTotos: function(){
      var _this = this.scope;   
      mostrarMensaje(2, 'Est&aacute; seguro que desea marcar todos los medios como contados?', function(btn) {
        if (btn == 'ok') {
            Ext.MessageBox.wait(_this.idioma.MaskConfHI, "Por favor espere...");
            Ext.Ajax.request({
                url: '/logistica/activos_fijos/movimiento/index.php/movimiento/ContarTodosSinDiferencias',
                params: {
                    iddocumento: _this.datos.iddocumento,
                },
                callback: function(o, s, r) {
                    var resp = Ext.decode(r.responseText);
                    if (resp.success) {
                        Ext.MessageBox.hide();
                        mostrarMensaje(1, 'Los medios han sido marcados');
                    } else {
                        // Ext.getBody().unmask();
                        Ext.MessageBox.hide();
                        mostrarMensaje(3, _this.idioma.MsgConfHIError);
                    }
                }
            });
        }
    });
},
modificarMedios: function (parametros, _fn) {
    var _this = this.scope;   
    var objSubmit = parametros || {};
    Ext.Ajax.request({
        url: _this.dirController + '/modificarProductos',
        method: 'POST',
        params: {
            iddocumento: _this.datos.iddocumento,
            datos: Ext.encode(objSubmit)
        },
        callback: function (o, s, r) {
            Ext.MessageBox.hide();
            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
            if (resp.success) {
                if (typeof _fn == 'function') {
                    _fn.call(this, [resp.datos]);
                }
            }
        }.createDelegate(this)
    });

    }
});
