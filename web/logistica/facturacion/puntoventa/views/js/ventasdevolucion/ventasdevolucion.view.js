Ext.ns('log.fac.ventasdevolucion');

/*LOG.fac.ventasdevolucion.Modopago = {
    1: 'Efectivo',
    2: 'Donaci\xf3n',
    3: 'Gratuidad',
    4: 'Caso Indice'
};

LOG.fac.ventasdevolucion.ModoPoRa = {
    1: 'Fondo',
    2: 'Extracci\xf3n',
    3: 'F\xf3rmula',
    4: 'Usufructo'
};*/

LOG.fac.ventasdevolucion.View = Ext.extend(LOG.util.UITemplate, {
    usuarios: undefined,
    documentos: undefined,

    constructor: function (config) {
        LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma.init());
        this.modelo = new Log.fac.ventasdevolucion.Model({
            idioma: config.idioma
        });
        this.concepto = config.idioma.cpDocumento;
        this.textBusquedaSimple = config.idioma.cgBusqueda;
        LOG.fac.ventasdevolucion.View.superclass.constructor.call(this, config);
        this.dirController = '/logistica/facturacion/puntoventa/index.php/ventasdevolucion';
        this.urlBusquedaGridPrincipal = 'devolverDocumentos';
        this.modoSeleccion = 3;
        this.autoShow = true;
        this.panelBotonesVisible = true;
        this.autoSelect = false;

    },
    init: function () {
        var _this = this;

        LOG.fac.ventasdevolucion.View.superclass.init.call(this);
        this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function () {
            _this.getPanelPrincipal().add(_this.getPanelSur());
            _this.getGridPrincipal().getStore().on('beforeload', function (st, records, op) {
                    if (_this.cmbArea.getValue()) {
                        st.baseParams.idestructura = _this.cmbArea.getValue();
                        st.baseParams.idareaventa = _this.datosConf.idareaventa;
                        st.baseParams.idmonedaventa = _this.datosConf.idmoneda;
                        st.initBaseParams.idestructura = _this.cmbArea.getValue();
                        st.initBaseParams.idareaventa = _this.datosConf.idareaventa;
                        st.initBaseParams.idmonedaventa = _this.datosConf.idmoneda;
                    }
                }
            );
            _this.getGridPrincipal().getStore().on('load', function () {
                if (_this.getGridPrincipal().getStore().getCount() == 0) {
                    _this.panelSur.collapse();
                    _this.storeSur.removeAll();
                } else {
                    _this.documentos = _this.getGridPrincipal().getStore().reader.jsonData.documentos;
                }
            })
            // _this.getGridPrincipal().fireEvent = _this.getGridPrincipal().fireEvent.createSequence(
            //     function (e) {
            //         if (e == 'rowclick') {
            //             if (_this.getSmPrincipal().getSelections().length == 1) {
            //                 _this.panelSur.expand();
            //                 _this.storeSur.load();
            //             } else {
            //                 _this.panelSur.collapse();
            //                 _this.storeSur.removeAll();
            //             }
            //         }
            //     }
            // );
            _this.getSmPrincipal().fireEvent = _this.getSmPrincipal().fireEvent.createSequence(
                function (e) {
                    if (e == 'rowselect') {
                        if (_this.getSmPrincipal().getSelections().length == 1) {
                            _this.panelSur.expand();
                            _this.storeSur.load();
                            _this.storeSurServ.load();
                            _this.storeEste.load();
                        } else {
                            _this.panelSur.collapse();
                            _this.storeSur.removeAll();
                            _this.storeSurServ.removeAll();
                            _this.storeEste.removeAll();
                        }
                    }
                }
            );
            if (typeof _this.btnLote.controlFn == 'function') {
                _this.btnLote.controlFn.createDelegate(this, [_this.btnLote, this]).call();
            }
        });
        this.cmbArea = new LOG.util.ComboBox({
            autoLoad: true,
            name: 'idareaventa',
            url: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/cargarAreas',
            valueField: 'idestructuraop',
            displayField: 'coddenominacion',
            width:350,
            anchor: '90%',
            listWidth:350,
            mode: 'remote',
            //pageSize: 10,
            //mode: 'remote',
            //allowBlank: false,
            baseParams:{
                addAll: true
            },
            editable: false,
            listeners: {
                /*expand: function () {
                    this.store.reload();
                },*/
                select: function (combo,record,index) {
                    /*me.listaBotones.getItem(0).enable();
                    me.listaBotones.getItem(1).enable();
                    me.listaBotones.getItem(2).enable();
                    me.listaBotones.getItem(3).enable();
                    me.listaBotones.getItem(4).enable();*/
                    //_this.getPanelGrid().enable();                    
                    _this.datosConf = record.json;
                    //me.idareaventa = record.json.idareaventa;
                    _this.getStorePrincipal().reload({
                        params: {
                            idestructura: combo.getValue(),
                            idareaventa: record.json.idareaventa,
                            idmonedaventa: record.json.idmoneda
                        }
                    });
                },
                chamge: function (combo,newValue,oldValue) {
                    /*me.listaBotones.getItem(0).enable();
                    me.listaBotones.getItem(1).enable();
                    me.listaBotones.getItem(2).enable();
                    me.listaBotones.getItem(3).enable();
                    me.listaBotones.getItem(4).enable();*/
                    _this.getPanelGrid().enable();
                    _this.getStorePrincipal().reload({
                        params: {
                            idestructura: combo.getValue()
                        }
                    });
                }
            }
        });
        this.getPanelSuperior().add(LOG.util.UIManager.initPanel({
            tbar: ['->', '-', this.idioma.tfArea + ':', this.cmbArea]
        }));
        LOG.util.UIManager.apply(this.getPanelSuperior(), {
            width: 10
        });
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: this.idioma.cgNro,
            width: 90,
            dataIndex: 'nrofactura',
            align: 'right',
            default: true/*,
            filter: {
                type: 'combo',
                //emptyText: 'Dispensaci\xf3n',
                url: '/logistica/facturacion/puntoventa/index.php/ventasdevolucion/devolverDocumentos',
                valueField: 'nrodoc',
                displayField: 'nrodoc',
                dataIndex: 'nrodoc',

            }*/
        });

         this.addGridColumn({
             header: this.idioma.cgNroReferencia,
             width: 90,
             dataIndex: 'nroorden',
             default: true
         });

        this.addGridColumn({
            header: this.idioma.cgCliente,
            width: 270,
            dataIndex: 'clientereal',
            default: true/*,
            filter: {
                type: 'combo',
                //emptyText: 'Dispensaci\xf3n',
                url: '/logistica/facturacion/puntoventa/index.php/ventasdevolucion/devolverDocumentos',
                valueField: 'iddoc',
                displayField: 'iddoc',
                dataIndex: 'iddoc',

            }*/
        });

        this.addGridColumn({
            header: this.idioma.cgModopago,
            width: 100,
            dataIndex: 'modopago',
            default: true/*,
            renderer: function (v, metaData, record, rowIndex, colIndex, store) {
                if (record.json.tipoventa >= 6) {
                    return LOG.fac.ventasdevolucion.ModoPoRa[v];
                }
                //return LOG.fac.ventasdevolucion.Modopago[v];
            }*/
        });
        this.addGridColumn({
            header: this.idioma.cmImporteT,
            dataIndex: 'importe',
            width: 90,
            align: 'right',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.json.importedevuelto > 0) {
                     var v = value - record.json.importedevuelto;
                     return Ext.util.Format.number(v, '0,000.00');
                }
                return Ext.util.Format.number(value, '0,000.00');
            }
        });

        this.addGridColumn({
            header: this.idioma.cmImporteO,
            dataIndex: 'importe',
            width: 90,
            align: 'right',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                return Ext.util.Format.number(value, '0,000.00');
            }
        });

        this.addGridColumn({
            header: 'Rec/Desc',
            dataIndex: 'valorconcepto',
            width: 90,
            align: 'right',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.json.tipoconceptoventa == 1){
                    if (record.json.conceptoventa == '+') {
                        return '<span style="color: red">+' + Ext.util.Format.number(value, '0,000.00') +'%'+ '</span>';
                    } else if (record.json.conceptoventa == '-') {
                        return '<span style="color: green">-' + Ext.util.Format.number(value, '0,000.00') +'%'+ '</span>';
                    }
                    return value;
                } else if (record.json.tipoconceptoventa == 0) {
                    if (record.json.conceptoventa == '+') {
                        return '<span style="color: red">+' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                    } else if (record.json.conceptoventa == '-') {
                        return '<span style="color: green">-' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                    }
                    return value;
                }
                return value;
            }
        });

        this.addGridColumn({
            header: 'Importe venta',
            dataIndex: 'importeventa',
            width: 150,
            align: 'right',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                return Ext.util.Format.number(value, '0,000.00');
            }
        });

        this.addGridColumn({
            header: this.idioma.cmImporteD,
            dataIndex: 'importedevuelto',
            width: 90,
            align: 'right',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                return Ext.util.Format.number(value, '0,000.00');
            }
        });

        /*this.addGridColumn({
            header: this.idioma.cgAno,
            width: 50,
            dataIndex: 'anno',
            default: true
        });*/

        this.addGridColumn({
            header: this.idioma.cgFactEntreg,
            width: 120,
            dataIndex: 'modeloimpresion',
            align: 'center',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgfecha,
            width: 120,
            dataIndex: 'fechacontable',
            align: 'center',
            default: true
        });

        this.addGridColumn({
               header: this.idioma.cgEstado,
               width: 100,
               dataIndex: 'estado',
               default: true,
               renderer: function (v) {
                   return LOG.lb.documento.Estado[v];
               }
        });

        this.addGridColumn({
               header: this.idioma.cgEstadoTienda,
               width: 60,
               dataIndex: 'estadoorden',
               default: true,
               renderer: function (value, metaData) { 
                   metaData.css = (value == 5) ? 'icondistra-true verde' : 'icondistra-false rojo';
                   metaData.attr = (value == 5) ? 'ext:qtip="Si"' : 'ext:qtip=" NO"';;
               }
        });

        this.addGridColumn({
               header: this.idioma.cgModoentrega,
               width: 110,
               dataIndex: 'modoentrega',
               default: true,
               renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    var modoentrega = '-';
                    //if(record.json.nroorden != null){
                        if(record.json.totalenvio > 0){
                            modoentrega = 'Entrega a domicilio';
                        }else{
                            modoentrega = 'Entrega en tienda';
                        }
                    //}
                    return modoentrega;
               }
        });

        this.addGridColumn({
            header: this.idioma.cmTotalEnvio,
            dataIndex: 'totalenvio',
            width: 90,
            align: 'right',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                return Ext.util.Format.number(value, '0,000.00');
            }
        });
        
        this.addGridColumn({
            header: this.idioma.cgCajero,
            width: 190,
            dataIndex: 'vendedor',
            default: true
        });
   
        this.addGridColumn({
            header: this.idioma.cgProductos,
            width: 80,
            dataIndex: 'productos',
            align: 'center',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.json.devueltos > 0) {
                    return value - record.json.devueltos;
                }
                return value;
            }
        });

        this.addGridColumn({
            header: this.idioma.cgfechaC,
            width: 120,
            dataIndex: 'fechacierre',
            align: 'center',
            default: true
        });

        this.addGridColumn({
            header: 'Nro. comprobante',
            width: 120,
            dataIndex: 'nrocomprobante',
            align: 'right',
            default: true
        });

        /* this.addGridColumn({
             header: this.idioma.cgUser,
             width: 100,
             dataIndex: 'idusuario',
             default: true,
             renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                 _this.usuarios = store.reader.jsonData.usuarios;
                 return _this.getUsuarioById(value);
             }
         });*/

        /* this.addGridColumn({
             header: this.idioma.cgAprobado,
             width: 100,
             dataIndex: 'aprobadopor',
             default: true,
             renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                 //_this.usuarios = store.reader.jsonData.usuarios;
                 if (record.data.estado == 3) {
                     return _this.getUsuarioById(value)
                 } else {
                     if (record.data.contabilizadopor != '') {
                         return _this.getUsuarioById(value);
                     } else {
                         return '';
                     }
                 }
             }
         });*/

        /*this.addGridColumn({
            header: this.idioma.cgTipoventa,
            width: 100,
            dataIndex: 'tipoventa',
            default: true,
            renderer: function (v) {
                var pos = parseInt(v) - 1;
                return Ext.farm.conf.datas.dataTipoVenta[pos][1];
            }
        });*/

        this.addGridColumn({
            header: 'Cobrar a',
            width: 270,
            dataIndex: 'cliente',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgDeposito,
            width: 270,
            dataIndex: 'areaventa',
            default: true
        });

        this.addGridColumn({
            dataIndex: 'iddocumento'
        });

        this.addGridColumn({
            dataIndex: 'contabilizadopor'
        });

        this.addGridColumn({
            dataIndex: 'idestructuracomun'
        });

        this.addGridColumn({
            dataIndex: 'observaciones'
        });

        this.addGridColumn({
            dataIndex: 'totalenvio'
        });

        this.addGridColumn({
            dataIndex: 'idmodeloimpresion'
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            tooltip: this.idioma.ttBtnCierre,
            text: this.idioma.lbBtnCierre,
            iconCls: 'cierrediario',
            handler: function () {
                mostrarMensaje(2, "\xbfEst\xe1 seguro que desea realizar el cierre de las ventas\x3f.", function (btn) {
                    if (btn == 'ok') {
                        var winListCierre = new LOG.fac.ventasdevolucion.GridListCierre({
                            idioma: _this.idioma,
                            idestructuraop:_this.cmbArea.getValue()
                        });
                        winListCierre.init();
                        
                        //winListCierre.getGridPrincipal().getStore().initBaseParams.idestructuraop = _this.cmbArea.getValue();
                        winListCierre.getPanelSuperior().onRender = winListCierre.getPanelSuperior().onRender.createSequence(function () {
                            winListCierre.getPanelSuperior().add(winListCierre.createComboCajero());
                            winListCierre.getPanelSuperior().doLayout();
                        });
                        winListCierre.getPanelSuperior().setVisible(true);
                        winListCierre.view();
                        winListCierre.getVistaPrincipal().cerrarAceptar = false;
                        winListCierre.getVistaPrincipal().aceptarFn = function () {
                            var storePago = winListCierre.getGridPrincipal().getStore();
                            var diferencia = 0;
                            if(storePago.data.length > 0){
                                storePago.each(function (rd) {
                                    var diff = parseFloat(rd.get('total')) - parseFloat(rd.get('importe'));
                                    diferencia = diferencia + diff;//parseFloat(rd.get('diferencia'));
                                });
                                if(diferencia != 0){
                                    mostrarMensaje(3, _this.idioma.msgErrorAlCerrar+'<b> '+Ext.util.Format.number(diferencia, '0,000.00')+'</b>.');
                                    return false;
                                }else{
                                    var params =  {idestructuraop:_this.cmbArea.getValue()};
                                    _this.modelo.adicionarCierre(params, function () {
                                        _this.getGridPrincipal().getStore().load();
                                    });
                                    return true;
                                }
                            }else{
                                mostrarMensaje(3,'No se puede realizar el cierre de las ventas.');
                            }
                        }
                    }
                })
            },
            /*controlFn: function (b, _caller) {
                if (_this.grantedAction('CT')) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        console.log(_caller.getSmPrincipal())
                        console.log(e)
                        /!*  if (e == 'selectionchange') {
                              if (this.getCount() == 1) {
                                  b.enable();
                              } else {
                                  b.disable();
                              }
                          }*!/
                    }, 'cierre');
                } else {
                    b.hide();
                }
            }*/
        }));
        
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            tooltip: this.idioma.ttBtnModCL,
            text: this.idioma.lbBtnModCL,
            iconCls: 'clienteproveedor',
            handler: function () {
                var winModificarDatosClientes = new LOG.fac.ventasdevolucion.ModificarDatosClientes({
                    idioma: _this.idioma,
                    title: _this.idioma.ttBtnModCL,
                    //iddeposito: this.idDeposito,
                    _parent: _this
                });
                winModificarDatosClientes.show();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('ModDatosCliente')) {
                    b.show();
                } else {
                    b.hide();
                }
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            tooltip: this.idioma.ttBtnModObs,
            text: this.idioma.lbBtnModObs,
            iconCls: 'modificar',
            handler: function () {
                var winModificarObs = new LOG.fac.ventasdevolucion.ModificarObs({
                    idioma: _this.idioma,
                    title: _this.idioma.ttBtnModObs,
                    //iddeposito: this.idDeposito,
                    _parent: _this
                });
                winModificarObs.show();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('ModificarObs')) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                              if (this.getCount() == 1) {
                                  b.enable();
                              } else {
                                  b.disable();
                              }
                        }
                    }, 'MODIFICAROBS');
                } else {
                    b.hide();
                }
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            tooltip: this.idioma.ttBtnCierreVentas,
            text: this.idioma.lbBtnCierreVentas,
            iconCls: 'cierre',
            disabled: true,
            handler: function () {
                var seleccion = _this.getSmPrincipal().getSelections();
                var importe = importedev = 0;
                var documentos = new Array();
                if (seleccion.length >= 1) {
                    Ext.each(seleccion, function (uno) {
                        documentos.push(uno.data.iddocumento);
                        importe = parseFloat(importe) + parseFloat(uno.data.importe);
                        importedev = parseFloat(importedev) + parseFloat(uno.data.importedevuelto);
                    });
                    importe = importe - importedev;
                    
                    var params = {
                        documentos: Ext.encode(documentos),
                        importe: importe
                    };
                    
                    mostrarMensaje(2, "\xbfEst\xe1 seguro que desea realizar el cierre de la(s) venta(s) seleccionada(s) con un monto total de <b>$ "+Ext.util.Format.number(importe, '0,000.00')+"</b>\x3f.", function (btn) {
                        if (btn == 'ok') {                            
                            _this.modelo.adicionarCierre(params, function () {
                                _this.getGridPrincipal().getStore().load();
                            });
                            return true;
                        }
                    });
                }
            },            
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT')) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        var seleccion = _caller.getSmPrincipal().getSelections();
                        if (e == 'selectionchange') {
                            if (seleccion.length >= 1) {
                                b.enable();
                                Ext.each(seleccion, function (uno) {
                                    if (uno.json.idusuario != idUsuario || uno.json.fechacierre != null) {
                                        b.disable();
                                    }
                                });
                            } else {
                                b.disable();
                            }
                        }
                        
                    }, 'CERRARVENTA');
                } else {
                    b.hide();
                }
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnImportarv,
            disabled: true,
            iconCls: 'importar',
            tooltip: this.idioma.ttBtnImportarV,
            handler: function () {
                var params = {
                    idestructura: _this.cmbArea.getValue(),
                    typesync: 2
                };

                _this.modelo.sincronizarDatos(params, function () {
                    _this.getStorePrincipal().reload();
                });
            },
            controlFn: function (b, _caller) {
                LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function (e) {
                    if (e == 'load') {
                        if (_this.cmbArea.getValue() != '' && _this.datosConf.tiendavirtual == 1) {
                            b.enable();
                        }else{
                            b.disable();
                        }
                    }
                }, 'IMPORTARVENTAS');
            }
        }));

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            tooltip: 'Buscar estado de pedido de tienda virtual',
            text: 'Estado pedido',
            iconCls: 'estado',
            disabled: true,
            handler: function () {
                var estadoEjecucion = new LOG.fac.ventasdevolucion.EstadoEjecucion({
                    formaVisualizacion: 'ventana',
                    idioma: _this.idioma
                });
                estadoEjecucion.init();
                estadoEjecucion.view();
                estadoEjecucion.getVistaPrincipal().setTitle('Estado de ejecuci\xf3n');
                estadoEjecucion.getVistaPrincipal().height = 450;
                estadoEjecucion.getVistaPrincipal().width = 500;
                estadoEjecucion.getVistaPrincipal().listaBotones.getItem(0).hide();
                estadoEjecucion.getVistaPrincipal().listaBotones.getItem(1).hide();
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('ESTADOPEDIDO')) {
                    b.show();
                    b.enable();
                } else {
                    b.hide();
                }
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonConfirmar({
            tooltip: this.idioma.lbTtBtnConfirmar,
            disabled: true,
            handler: function () {
                var seleccion = _this.getSmPrincipal().getSelections();
                var documentos = new Array();
                if (seleccion.length >= 1) {
                    Ext.each(seleccion, function (uno) {
                        documentos.push(uno.data.iddocumento);
                    });
                    var params = {
                        documentos: Ext.encode(documentos),
                        idestructura: _this.cmbArea.getValue(),
                        typesync: 3
                    };
                    _this.modelo.confirmarDocumentos(params, function () {
                        _this.getStorePrincipal().reload();
                    });
                }
            },
            controlFn: function (b, _caller) {
                LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                    var seleccion = _caller.getSmPrincipal().getSelections();
                    if (e == 'selectionchange') {
                        if (seleccion.length >= 1 && _this.cmbArea.getValue() != '' && parseInt(_this.datosConf.tiendavirtual) == 1) {
                            b.enable();
                            Ext.each(seleccion, function (uno) {
                                if (uno.data.estado != "1" || uno.json.cantproductos == "0") {
                                    b.disable();
                                }
                            });
                        } else {
                            b.disable();
                        }
                    }
                }, 'CONFIRMARVENTAS');
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonAnularEstado({
            tooltip: this.idioma.lbTtBtnAnularEstado,
            isContextual: true,
            disabled: true,
            handler: function () {
                var seleccion = _this.getSmPrincipal().getSelections();
                var documentos = new Array();
                if (seleccion.length >= 1) {
                    Ext.each(seleccion, function (uno) {
                        documentos.push(uno.data.iddocumento);
                    });
                    var params = {
                        documentos: Ext.encode(documentos),
                        idestructura: _this.cmbArea.getValue(),
                        typesync: 4
                    };
                    _this.modelo.anularEstado(params, function () {
                        _this.getStorePrincipal().reload();
                    });
                }
            },
            controlFn: function (b, _caller) {
                LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                    var seleccion = _caller.getSmPrincipal().getSelections();
                    if (e == 'selectionchange') {
                        if (seleccion.length >= 1 && _this.cmbArea.getValue() != '' && _this.datosConf.tiendavirtual == 1) {
                            b.enable();
                            Ext.each(seleccion, function (uno) {
                                if (uno.data.estado != "2") {
                                    b.disable();
                                }
                            });
                        } else {
                            b.disable();
                        }
                    }
                }, 'ANULARESTADO');
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonContabilizar({
            tooltip: this.idioma.lbTtBtnContabilizar,
            disabled: true,
            handler: function () {
                var seleccion = _this.getSmPrincipal().getSelections();
                var documentos = new Array();
                if (seleccion.length >= 1) {
                    Ext.each(seleccion, function (uno) {
                        documentos.push(uno.data.iddocumento);
                    });
                    var params = {
                        documentos: Ext.encode(documentos),
                        idestructura: _this.cmbArea.getValue(),
                        typesync: 6
                    };
                    _this.modelo.contabilizarDocumentos(params, function () {
                        _this.getStorePrincipal().reload();
                    });
                }
            },
            controlFn: function (b, _caller) {
                LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                    var seleccion = _caller.getSmPrincipal().getSelections();
                    if (e == 'selectionchange') {
                        if (seleccion.length >= 1 && _this.cmbArea.getValue() != '' && _this.datosConf.tiendavirtual == 1) {
                            b.enable();
                            Ext.each(seleccion, function (uno) {
                                if (uno.data.estado != "2") {
                                    b.disable();
                                }
                            });
                        } else {
                            b.disable();
                        }
                    }
                }, 'CONTABILIZARVENTAS');
            }
        }));

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnEntregado,
            tooltip: this.idioma.ttBtnEntregado,
            disabled: true,
            iconCls: 'true',
            handler: function () {
                var seleccion = _this.getSmPrincipal().getSelections();
                var documentos = new Array();
                if (seleccion.length >= 1) {
                    Ext.each(seleccion, function (uno) {
                        documentos.push(uno.data.iddocumento);
                    });
                    var params = {
                        documentos: Ext.encode(documentos),
                        idestructura: _this.cmbArea.getValue(),
                        typesync: 7
                    };
                    _this.modelo.actualizarVentasEntregadas(params, function () {
                        _this.getStorePrincipal().reload();
                    });
                }
            },
            controlFn: function (b, _caller) {
                LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                    var seleccion = _caller.getSmPrincipal().getSelections();
                    if (e == 'selectionchange') {
                        if (seleccion.length >= 1 && _this.cmbArea.getValue() != '' && _this.datosConf.tiendavirtual == 1) {
                            b.enable();
                            Ext.each(seleccion, function (uno) {
                                if (uno.data.estado != "4") {
                                    b.disable();
                                }
                            });
                        } else {
                            b.disable();
                        }
                    }
                }, 'ACTUALIZARVENTAS');
            }
        }));

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnExpEntregado,
            tooltip: this.idioma.ttBtnExpEntregado,
            disabled: true,
            iconCls: 'exportar',
            handler: function () {
                var params = {
                    idestructura: _this.cmbArea.getValue(),
                    idareaventa: _this.datosConf.idareaventa
                };

                _this.modelo.exportarEntregados(params, function () {
                    _this.getStorePrincipal().reload();
                });
            },
            controlFn: function (b, _caller) {
                LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function (e) {
                    if (_this.cmbArea.getValue() != '' && _this.datosConf.tiendavirtual == 1) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                }, 'ACTUALIZARVENTAS');
            }
        }));

        //boton actualizar estados
        /*this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnRebajarinv,
            disabled: true,
            iconCls: 'actualizar',
            tooltip: this.idioma.ttBtnActualizarinv,
            handler: function () {
            
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(_this.getStorePrincipal(), 'fireEvent', function (e) {
                    if (e == 'load') {
                        if (_this.cmbArea.getValue() != '' && _this.datosConf.tiendavirtual == 1) {
                            b.enable();
                        }else{
                            b.disable();
                        }
                    }
                }, 'REBAJARINVENTARIOS');
            }
        }));*/
        //boton eliminar ventas
        /*this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnEliminarv,
            disabled: true,
            iconCls: 'eliminar',
            tooltip: this.idioma.ttBtnEliminarv,
            handler: function () {
                var params = {
                    idestructura: _this.cmbArea.getValue(),
                    typesync: 3
                };

                _this.modelo.sincronizarDatos(params, function () {
                    _this.getStorePrincipal().reload();
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(_this.getStorePrincipal(), 'fireEvent', function (e) {
                    if (e == 'load') {
                        if (_this.cmbArea.getValue() != '' && _this.datosConf.tiendavirtual == 1) {
                            b.enable();
                        }else{
                            b.disable();
                        }
                    }
                }, 'ELIMINARVENTAS');
            }
        }));*/
        
        //boton sicronizar solo disponible
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnSincronizarDisp,
            disabled: true,
            iconCls: 'sincronizar',
            tooltip: this.idioma.ttBtnSincronizarDisp,
            handler: function () {
                var params = {
                    idestructura: _this.cmbArea.getValue(),
                    typesync: 5
                };

                _this.modelo.sincronizarDatos(params, function () {
                    _this.getStorePrincipal().reload();
                });
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(_this.getStorePrincipal(), 'fireEvent', function (e) {
                    if (e == 'load') {
                        if (_this.cmbArea.getValue() != '' && _this.datosConf.tiendavirtual == 1) {
                            b.enable();
                        }else{
                            b.disable();
                        }
                    }
                }, 'SINCRONIZARDISP');
            }
        }));
        
        this.btnImprimirListado = LOG.util.UIManager.createMenuItem({
            text: this.idioma.lbimprimirListado,
            iconCls: 'imprimir',
            isList: true,
            dirReport: farmacia == 1 ? '/distra/logistica/farmacia/terminalpuntoventa/ListadoVentasModelo' : '/distra/logistica/puntoventa/terminalpuntoventa/ListadoVentasModelo',
            handler: this.onReport.createDelegate(this)
        });

        this.btnImprimirModelo = LOG.util.UIManager.createMenuItem({
            text: this.idioma.lbimprimirModelo,
            iconCls: 'imprimir',
            isList: false,
            name: 'comprobanteventa',
            dirReport: (farmacia != 1) ? '/distra/logistica/puntoventa/terminalpuntoventa/ReciboVentaModelo': '/distra/logistica/farmacia/terminalpuntoventa/ReciboVentaModelo',
            disabled: true,
            handler: _this.onReport.createDelegate(this),
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('IMP')) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'rowselect') {
                            if (this.getCount() == 1) {
                                b.enable();
                            }else{
                                b.disable();
                            }
                        } 
                    }, 'imprimir');
                } else {
                    b.hide();
                } 
            }
        });
        this.btnImprimirModeloOriginal = LOG.util.UIManager.createMenuItem({
            text: this.idioma.lbimprimirModeloOriginal,
            iconCls: 'imprimir',
            isList: false,
            name: 'comprobanteventaoriginal',
            dirReport: (farmacia != 1) ? '/distra/logistica/puntoventa/terminalpuntoventa/ReciboVentaModelo': '/distra/logistica/farmacia/terminalpuntoventa/ReciboVentaModelo',
            disabled: true,
            handler: _this.onReport.createDelegate(this),
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('IMP')) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1 && _caller.getSmPrincipal().getSelected().data.importedevuelto > 0) {
                                b.enable();
                            }else{
                                b.disable();
                            }
                        }
                    }, 'imprimir');
                } else {
                    b.hide();
                }
            }
        });
        this.btnProcesarPedidos = LOG.util.UIManager.createMenuItem({
            text: this.idioma.lbBtnProcesar,
            iconCls: 'imprimir',
            isList: false,
            name: 'procesarpedidos',
            dirReport: '/distra/logistica/puntoventa/terminalpuntoventa/ProcesarPedidosModelo',
            disabled: true,
            handler: _this.onReport.createDelegate(this),
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT')) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function (e) {
                        if (e == 'load') {
                            if (this.getCount() > 0 && _this.cmbArea.getValue() != '' && _this.datosConf.tiendavirtual == 1) {
                                b.enable();
                            }else{
                                b.disable();
                            }
                        }
                    }, 'imprimir');
                } else {
                    b.hide();
                }
            }
        });
        this.btnProcesarPedidosProducto = LOG.util.UIManager.createMenuItem({
            text: this.idioma.lbBtnProcesarP,
            iconCls: 'imprimir',
            isList: false,
            name: 'procesarpedidosp',
            dirReport: '/distra/logistica/puntoventa/terminalpuntoventa/ProcesarPedidosProductosModelo',
            disabled: true,
            handler: _this.onReport.createDelegate(this),
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT')) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function (e) {
                        if (e == 'load') {
                            if (this.getCount() > 0 && _this.cmbArea.getValue() != '' && _this.datosConf.tiendavirtual == 1) {
                                b.enable();
                            }else{
                                b.disable();
                            }
                        }
                    }, 'imprimir');
                } else {
                    b.hide();
                }
            }
        });
        this.btnProcesarPedidosRegion = LOG.util.UIManager.createMenuItem({
            text: this.idioma.lbBtnProcesarR,
            iconCls: 'imprimir',
            isList: false,
            name: 'procesarpedidos',
            dirReport: '/distra/logistica/puntoventa/terminalpuntoventa/ProcesarPedidosRegionModelo',
            disabled: true,
            handler: _this.onReport.createDelegate(this),
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT')) {
                    b.show();
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getStorePrincipal(), 'fireEvent', function (e) {
                        if (e == 'load') {
                            if (this.getCount() > 0 && _this.cmbArea.getValue() != '' && _this.datosConf.tiendavirtual == 1) {
                                b.enable();
                            }else{
                                b.disable();
                            }
                        }
                    }, 'imprimir');
                } else {
                    b.hide();
                }
            }
        });
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            tooltip: this.idioma.lbBtnImprimir,
            text: this.idioma.lbBtnImprimir,
            iconCls: 'imprimir',
            menu: [this.btnImprimirModelo,this.btnImprimirModeloOriginal,this.btnImprimirListado, this.btnProcesarPedidos,this.btnProcesarPedidosProducto,this.btnProcesarPedidosRegion]
        }));


    },
    getPanelSur: function () {
        var _this = this;
        this.btnLote = LOG.util.UIManager.createBtn({
            iconCls: 'lote',
            text: _this.idioma.lbBtnLote,
            tooltip: _this.idioma.ttBtnLote,
            disabled: true,
            handler: function () {
                if (this.winLote == undefined) {
                    LOG.lb.lote.Loader.init(function () {
                        this.winLote = new LOG.lb.lote.View({
                            sm: _this.smGridSur,
                            iddeposito: _this.smGridSur.getSelected().json.idestructura,
                            ubicacion: true,
                            usaMonedas: true,
                            compraVenta: 2,
                            grantedAction: function (_p) {
                                return false;
                            },
                            cerrarFn: function () {

                            }
                        });
                        this.winLote.init();
                        this.winLote.view();
                    });
                } else {
                    this.winLote.view();
                }
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('RB') || _this.grantedAction('CT')) {
                    b.setVisible(true);
                    _this.smGridSur.fireEvent = _this.smGridSur.fireEvent.createSequence(function (e) {
                        b.disable();
                        if (_this.getSmPrincipal().getSelected().json.abreviatura != 'transferenciareaLog' && _this.getSmPrincipal().getSelected().json.abreviatura != 'informediferenciaLog') {
                            if (_this.smGridSur.getSelections().length == 1) {
                                if (_this.smGridSur.getSelected().json.tienelote == 1)
                                    b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        });


        var tbar = ['-', this.btnLote];

        this.panelSur = LOG.util.UIManager.initPanel({
            region: 'south',
            //title: 'Productos/Servicios',
            border: true,
            layout: 'fit',
            collapsible: true,
            collapsed: true,
            split: true,
            //tbar: tbar,
            listeners: {
                expand: function (p) {
                    p.setHeight(_this.getPanelPrincipal().getHeight() / 2.5);
                }
            }
        });
        this.pnGrid = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border',
            tbar: tbar,
            title: 'Productos',
            view: function () {
                return this;
            }
        });

        this.columnasSur = new LOG.util.List();
        this.columnasSur.add({
            dataIndex: 'idmovimiento'
        });
        this.columnasSur.add({
            dataIndex: 'idproducto'
        });
        this.columnasSur.add({
            header: _this.idioma.cmReferencia,
            dataIndex: 'descripcionventa',
            width: 350,
            autoExpand: true,
            default: true
        });
        if (farmacia == 1) {
            this.columnasSur.add({
                header: 'Nº. lote',
                dataIndex: 'numerolote',
                width: 150,
                default: true
            });
            this.columnasSur.add({
                header: 'Vencimiento lote',
                dataIndex: 'fechavencelote',
                width: 150,
                default: true
            });
        }

        /*  this.columnasSur.add({
              header: _this.idioma.cmCategoria,
              dataIndex: 'nomcategoria',
              default: true,
              width: 100
          });*/
        this.columnasSur.add({
            header: _this.idioma.cmUm,
            dataIndex: 'umedida',
            default: true,
            width: 40
        });
        /*this.columnasSur.add({
            header: _this.idioma.cmNacionalidad,
            dataIndex: 'nacionalidad',
            default: true,
            width: 200
        });*/
        this.columnasSur.add(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cmCantidad,
            align: 'right',
            dataIndex: 'cantidad',
            default: true,
            width: 90,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.json.cantidaddev > 0){
                    return value - record.json.cantidaddev;
                }
                return value;
            }
        }));
        this.columnasSur.add(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cmCantidadDev,
            align: 'right',
            dataIndex: 'cantidaddev',
            default: true,
            width: 100,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                return (value)?value:0;
            }
        }));
        /*this.columnasSur.add(LOG.util.Prototipos.columnaPrecio({
            header: _this.idioma.cmPrecio + ' ' + codigoContable,
            align: 'right',
            dataIndex: 'preciocontable',
            default: true,
            width: 100
        }));
        this.columnasSur.add(LOG.util.Prototipos.columnaImporte({
            header: _this.idioma.cmImporte + ' ' + codigoContable,
            align: 'right',
            dataIndex: 'importe',
            default: true,
            width: 100
        }));*/
        //if (alternativa) {
        this.columnasSur.add(LOG.util.Prototipos.columnaPrecio({
            header: _this.idioma.cmPrecio/* + ' ' + codigoAlternativa*/,
            align: 'right',
            dataIndex: 'precioventa',
            default: true,
            width: 100
        }));
        this.columnasSur.add(LOG.util.Prototipos.columnaImporte({
            header: _this.idioma.cmImporte/* + ' ' + codigoAlternativa*/,
            align: 'right',
            dataIndex: 'importeventa',
            default: true,
            width: 100
        }));
        //}

        /*this.columnasSur.add({
            header: 'Registro',
            dataIndex: 'registro',
            default: true,
            width: 100
        });*/


        this.smGridSur = LOG.util.UIManager.initSelectionModel(3, true);

        var cls = LOG.util.UIManager.proccessColumns(this.columnasSur, this.smGridSur);
        this.cmGridSur = new Ext.grid.ColumnModel(cls.columns);
        this.recStGridSur = Ext.data.Record.create(cls.fields);

        this.storeSur = new Ext.data.Store({
            //autoLoad: true,
            url: 'devolverMovimientos',
            reader: new Ext.data.JsonReader({
                id: "idmovimiento",
                root: "datos"
            }, this.recStGridSur),
            listeners: {}
        });

        this.storeSur.on({
            'beforeload': function () {
                _this.storeSur.baseParams.iddocumento = _this.getSmPrincipal().getSelected().data.iddocumento;
                _this.storeSur.initBaseParams.iddocumento = _this.getSmPrincipal().getSelected().data.iddocumento;
            }
        });

        this.gpSur = LOG.util.UIManager.initGrid(this.cmGridSur, this.storeSur, this.smGridSur, {nobbar: false});

        this.pnGrid.add(this.gpSur);

        /*SERVICIOS*/
        this.pnGridServ = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border',
            title: 'Servicios',
            view: function () {
                return this;
            }
        });

        this.columnasSurServ = new LOG.util.List();
        this.columnasSurServ.add({
            dataIndex: 'idindicador'
        });
        this.columnasSurServ.add({
            header: _this.idioma.cmReferencia,
            dataIndex: 'descripcionventa',
            width: 350,
            autoExpand: true,
            default: true
        });
        this.columnasSurServ.add({
            header: _this.idioma.cmUm,
            dataIndex: 'umedida',
            default: true,
            width: 40
        });
        this.columnasSurServ.add(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cmCantidad,
            align: 'right',
            dataIndex: 'cantidad',
            default: true,
            width: 90,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.json.cantidaddev > 0){
                    return value - record.json.cantidaddev;
                }
                return value;
            }
        }));
        this.columnasSurServ.add(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cmCantidadDev,
            align: 'right',
            dataIndex: 'cantidaddev',
            default: true,
            width: 100,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                return (value)?value:0;
            }
        }));
        this.columnasSurServ.add(LOG.util.Prototipos.columnaPrecio({
            header: _this.idioma.cmPrecio/* + ' ' + codigoAlternativa*/,
            align: 'right',
            dataIndex: 'precioventa',
            default: true,
            width: 100
        }));
        this.columnasSurServ.add(LOG.util.Prototipos.columnaImporte({
            header: _this.idioma.cmImporte/* + ' ' + codigoAlternativa*/,
            align: 'right',
            dataIndex: 'importeventa',
            default: true,
            width: 100
        }));
        if (typeof TPV_OPERARIOSERVICE !== 'undefined' && TPV_OPERARIOSERVICE == true){
            this.columnasSurServ.add({
                header: 'Operario',
                dataIndex: 'operario',
                default: true,
                width: 250
            });
        }

        this.smGridSurServ = LOG.util.UIManager.initSelectionModel(3, true);

        var clsServ = LOG.util.UIManager.proccessColumns(this.columnasSurServ, this.smGridSurServ);
        this.cmGridSurServ = new Ext.grid.ColumnModel(clsServ.columns);
        this.recStGridSurServ = Ext.data.Record.create(clsServ.fields);

        this.storeSurServ = new Ext.data.Store({
            //autoLoad: true,
            url: 'devolverMovimientos',
            reader: new Ext.data.JsonReader({
                id: "idmovimiento",
                root: "datos"
            }, this.recStGridSurServ),
            listeners: {}
        });

        this.storeSurServ.on({
            'beforeload': function () {
                _this.storeSurServ.baseParams.iddocumento = _this.getSmPrincipal().getSelected().data.iddocumento;
                _this.storeSurServ.initBaseParams.iddocumento = _this.getSmPrincipal().getSelected().data.iddocumento;

                _this.storeSurServ.baseParams.servicio = 1;
                _this.storeSurServ.initBaseParams.servicio = 1;
            }
        });

        this.gpSurServ = LOG.util.UIManager.initGrid(this.cmGridSurServ, this.storeSurServ, this.smGridSurServ, {nobbar: false});

        this.pnGridServ.add(this.gpSurServ);

        this.tabGeneral = new LOG.util.UITabTemplate({
            idioma: _this.idioma,
            region: 'center',
            formaVisualizacion: 'panel'
        });

        this.tabGeneral.addTabToTemplete(this.pnGrid);
        this.tabGeneral.addTabToTemplete(this.pnGridServ);
        this.tabGeneral.addTabToTemplete(_this.getPanelPagos());

        this.tabGeneral.init();

        this.panelSur.add(this.tabGeneral.view());
        //this.panelSur.add(this.pnGrid);

        return this.panelSur;
    },
    getPanelPagos: function () {
        var _this = this;

        this.panelEste = LOG.util.UIManager.initPanel({
            region: 'center',
            title: 'Informaci\xf3n de pago',
            border: true,
            layout: 'border',
            listeners: {
                /*expand: function (p) {
                    p.setHeight(_this.getPanelPrincipal().getHeight() / 2);
                }*/
            },
            view: function () {
                return this;
            }
        });
        this.pnGridEste = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border',
            view: function () {
                return this;
            }
        });

        this.columnasEste = new LOG.util.List();
        this.columnasEste.add({
            dataIndex: 'idpago'
        });
        this.columnasEste.add({
            dataIndex: 'iddocumento'
        });
        this.columnasEste.add({
            header: 'Modo de pago',
            dataIndex: 'denominacion',
            width: 200,
            default: true,
            renderer: function (v, md, rd) {
                if (rd.data.denominacion == 'Total:') {
                    md.attr = 'style="background-color: rgba(186, 186, 186, 0.6);font-weight:bold;"';
                }
                return v;
            }
        });
        this.columnasEste.add(LOG.util.Prototipos.columnaImporte({
            header: 'Importe',
            align: 'right',
            dataIndex: 'importe',
            default: true,
            width: 90,
            renderer: function (v, md, rd) {
                if (rd.data.denominacion == 'Total:') {
                    md.attr = 'style="background-color: rgba(186, 186, 186, 0.6);font-weight:bold;"';
                }
                return v;
            }
        }));


        this.smGridEste = LOG.util.UIManager.initSelectionModel(3, true);

        var clsEste = LOG.util.UIManager.proccessColumns(this.columnasEste, this.smGridEste);
        this.cmGridEste = new Ext.grid.ColumnModel(clsEste.columns);
        this.recStGridEste = Ext.data.Record.create(clsEste.fields);

        this.storeEste = new Ext.data.Store({
            //autoLoad: true,
            url: 'devolverPagos',
            reader: new Ext.data.JsonReader({
                id: "idpago",
                root: "datos"
            }, this.recStGridEste),
            listeners: {
                load: function(st){
                    let importe = 0;
                    Ext.each(st.reader.jsonData.datos, function (r) {
                        importe += parseFloat(r.importe);
                    })
                    st.add(new Ext.data.Record({
                        importe: importe,
                        denominacion: 'Total:'
                    }));
                }
            }
        });

        this.storeEste.on({
            'beforeload': function () {
                _this.storeEste.baseParams.iddocumento = _this.getSmPrincipal().getSelected().data.iddocumento;
                _this.storeEste.initBaseParams.iddocumento = _this.getSmPrincipal().getSelected().data.iddocumento;

            }
        });

        this.gpEste = LOG.util.UIManager.initEditableGridPanel(this.cmGridEste, this.storeEste, this.smGridEste, {nobbar: false});

        this.pnGridEste.add(this.gpEste);

        this.panelEste.add(this.pnGridEste);

        //this.tabGeneral.view();

        return this.panelEste;
    },
    getUsuarioById: function (id) {
        var _this = this;
        for (var i = 0; i < _this.usuarios.length; i++) {
            if (_this.usuarios[i].idusuario == id) {
                return _this.usuarios[i].nombreusuario;
            }
        }
        return '-';
    },
    getTipoDocById: function (id) {
        var _this = this;
        for (var i = 0; i < _this.documentos.length; i++) {
            if (_this.documentos[i].iddoc == id) {
                return _this.documentos[i].denominacion;
            }
        }
        return '-';
    },
    getDepositoById: function (id) {
        var _this = this;
        /*for (var i = 0; i < _this.depositos.length; i++) {
            if (_this.depositos[i].iddeposito == id) {
                return _this.depositos[i].deposito;
            }
        }*/
        return '-';
    },
    onReport: function (btn) {
        /*var _this = this;
        var deposito = '';
        Ext.each(_this.depositos, function (dep) {
            if (deposito == '') {
                deposito += dep.iddeposito;
            } else {
                deposito += ',' + dep.iddeposito;
            }
        });
        var depositos = (_this.panelBusquedaAvanzada.findByType('combo')[2].getValue())
            ? '{' + _this.panelBusquedaAvanzada.findByType('combo')[2].getValue() + '}'
            : '{' + deposito + '}'
        var has = _this.getGridPrincipal().getSelectionModel().hasSelection();
        if (has) {
            var record = _this.getGridPrincipal().getSelectionModel().getSelected();
            this.control = new LOG.util.Report({
                reports: [
                    {
                        name: this.getTipoDocById(record.data.iddoc),
                        description: this.getTipoDocById(record.data.iddoc),
                        isList: btn.isList,
                        params: {
                            iddocumento: record.get("iddocumento") || null,
                            monedacontable: (monedacontable) ? monedacontable : null,
                            monedaalternativa: (monedaalternativa) ? monedaalternativa : null,
                            iddepositos: depositos,
                            idestado: (_this.panelBusquedaAvanzada.findByType('combo')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[1].getValue() : null,
                            nrodoc: (_this.panelBusquedaAvanzada.findByType('textfield')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('textfield')[0].getValue() : null,
                            fechainicio: (_this.panelBusquedaAvanzada.findByType('datefield')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[0].getValue().format('d-m-Y') : null,
                            fechafin: (_this.panelBusquedaAvanzada.findByType('datefield')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[1].getValue().format('d-m-Y') : null,
                            alias: (_this.panelBusquedaAvanzada.findByType('combo')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[0].getValue() : null,
                            abreviatura: record.json.abreviatura
                        },
                        dirReport: (!btn.isList) ? this.getDirReport(record) : btn.dirReport
                    }
                ]
            });
            this.control.view();
        }*/
        var _this = this;
        if(btn.name == 'comprobanteventa'){
            var has = _this.getGridPrincipal().getSelectionModel().hasSelection();
            if (has){               
                var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                var dirReporte = btn.dirReport;
                if(record.get("nroorden")!=''){
                    if (record.json.tipotienda == 'cx') {
                        dirReporte = '/distra/logistica/puntoventa/terminalpuntoventa/ReciboVentaIntModelo';
                    } else {
                        dirReporte = '/distra/logistica/puntoventa/terminalpuntoventa/ReciboVentaTiendaModelo';
                    }
                }else if(record.get("idmodeloimpresion") == 2){
                    dirReporte = '/distra/logistica/puntoventa/terminalpuntoventa/TicketVentaModelo';
                }else{
                    dirReporte = (farmacia != 1) ? '/distra/logistica/puntoventa/terminalpuntoventa/ReciboVentaModelo': '/distra/logistica/farmacia/terminalpuntoventa/ReciboVentaModelo';
                } 
                btn.dirReport = dirReporte;//(record.get("nroorden")!='')?'/distra/logistica/puntoventa/terminalpuntoventa/ReciboVentaTiendaModelo':btn.dirReport;
                var report = new LOG.util.Report({
                    idioma: _this.idioma,
                    reports: [
                        {
                            name: 'Recibo de venta',
                            isList: false,
                            params: {
                                iddocumento: record.get("iddocumento") ? record.get("iddocumento") : null,
                                idestructura: record.get("idestructuracomun") ? record.get("idestructuracomun") : null,
                                original: 0
                            },
                            dirReport: btn.dirReport
                        }
                    ]
                });
                report.view();
            }
        }else if(btn.name == 'comprobanteventaoriginal'){
            var has = _this.getGridPrincipal().getSelectionModel().hasSelection();
            if (has){               
                var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                btn.dirReport = (record.get("nroorden")!='')?'/distra/logistica/puntoventa/terminalpuntoventa/ReciboVentaTiendaModelo':btn.dirReport;
                var report = new LOG.util.Report({
                    idioma: _this.idioma,
                    reports: [
                        {
                            name: 'Recibo de venta',
                            isList: false,
                            params: {
                                iddocumento: record.get("iddocumento") ? record.get("iddocumento") : null,
                                idestructura: record.get("idestructuracomun") ? record.get("idestructuracomun") : null,
                                original: 1
                            },
                            dirReport: btn.dirReport
                        }
                    ]
                });
                report.view();
            }
        }else if(btn.name == 'procesarpedidos' || btn.name == 'procesarpedidosp' || btn.name == 'procesarpedidosr'){
            var report = new LOG.util.Report({
                idioma: _this.idioma,
                reports: [
                    {
                        name: 'LISTADO DE PEDIDOS A PROCESAR',
                        isList: true,
                        params: {
                            idestructuraop: _this.cmbArea.getValue(),
                            fechainicio: (_this.panelBusquedaAvanzada.findByType('datefield')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[0].getValue().format('d-m-Y') : null,
                            fechafin: (_this.panelBusquedaAvanzada.findByType('datefield')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[1].getValue().format('d-m-Y') : null,
                            idestructura: idEntidad                            
                        },
                        dirReport: btn.dirReport
                    }
                ]
            });
            report.view();
        }else{
            var report = new LOG.util.Report({
                idioma: _this.idioma,
                reports: [
                    {
                        name: 'LISTADO DE DOCUMENTOS DE VENTA',
                        isList: true,
                        params: {
                            idestructuraop: _this.cmbArea.getValue(),
                            //fechainicio: (_this.panelBusquedaAvanzada.findByType('datefield')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[0].getValue().format('d-m-Y') : null,
                            //fechafin: (_this.panelBusquedaAvanzada.findByType('datefield')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[1].getValue().format('d-m-Y') : null,
                            idestructura: idEntidad,

                            //iddeposito: (_this.panelBusquedaAvanzada.findByType('combo')[5].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[5].getValue() : null,
                            fechainicio: (_this.panelBusquedaAvanzada.findByType('datefield')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[0].getValue().format('d-m-Y') : null,
                            //fechafin: (_this.panelBusquedaAvanzada.findByType('datefield')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[1].getValue().format('d-m-Y') : null,
                            idestado: (_this.panelBusquedaAvanzada.findByType('combo')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[0].getValue() : null,
                            //docorigen: (_this.panelBusquedaAvanzada.findByType('combo')[4].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[4].getValue() : null,
                            //anno: (_this.panelBusquedaAvanzada.findByType('textfield')[4].getValue()) ? _this.panelBusquedaAvanzada.findByType('textfield')[4].getValue() : null,
                            entregar: (_this.panelBusquedaAvanzada.findByType('combo')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[1].getValue() : null,
                            //tipodocumento: (_this.panelBusquedaAvanzada.findByType('combo')[0].getValue()) ? "{" + _this.panelBusquedaAvanzada.findByType('combo')[0].getValue()+"}" : null,
                            creadopor: (_this.panelBusquedaAvanzada.findByType('combo')[3].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[3].getValue() : null,
                            idproducto: (_this.panelBusquedaAvanzada.findByType('combo')[6].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[6].getValue() : null,
                            estado: (_this.panelBusquedaAvanzada.findByType('combo')[4].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[4].getValue() : null,
                            modopago: (_this.panelBusquedaAvanzada.findByType('combo')[2].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[2].getValue() : null,
                            busqueda: (_this.gridFilter.tfBusqueda.getValue()) ? _this.gridFilter.tfBusqueda.getValue() : null,                         
                        },
                        dirReport: btn.dirReport
                    }
                ]
            });
            report.view();
        }
    }
});

LOG.fac.ventasdevolucion.GridListCierre = Ext.extend(LOG.util.UITemplate, {
    usuarios: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'ventana',
            this.modelo = new Log.fac.ventasdevolucion.Model({
                idioma: config.idioma
            });
        //this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.panelBotonesVisible = false;
        this.dirController = '/logistica/facturacion/puntoventa/index.php/ventasdevolucion',
        this.urlBusquedaGridPrincipal = 'obtenerDatosCierre',
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.fac.ventasdevolucion.Idioma);
        //this.concepto = this.idioma.lbIndicador;
        this.gridEditable = true;
        this.bbarVisible = false;
        this.cerrarAceptar = false;
        LOG.fac.ventasdevolucion.GridListCierre.superclass.constructor.call(this, config);
        //this.textBusquedaSimple = this.idioma.cgCodigo;
        this.getVistaPrincipal().height = 520;
        this.getVistaPrincipal().width = 600;
        this.getVistaPrincipal().title = this.idioma.Cierre;
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        //this.getVistaPrincipal().listaBotones.getItem(2).disable();
    },
    initDefaultButtons: function () {
        var _this = this;
        _this.btnRefrescar = LOG.util.UIManager.createBtn({
            tooltip: this.idioma.tBtnCalcular,
            iconCls: 'calcular',
            handler: function () {
                /*var record = _this.getStorePrincipal();
                var totalImporte;
                var fondoCaja;
                var ventaTotal;
                var total;
                var efectivoArqueado;
                var datos;
                let TotalimporteNoSuma = 0;
                let importeNoSuma= 0;
                if (record.data.items[0] && _this.fondocaja.getValue()) {
                    _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                    fondoCaja = parseFloat(_this.fondocaja.getValue());
                    totalImporte = parseFloat(record.reader.jsonData.totalImporte[0]['total']);
                    datos = record.reader.jsonData.datos;
                    Ext.each(datos, function (record) {
                        if (record.tipoventa == 4) {
                            importeNoSuma = parseFloat(record.importe);
                            TotalimporteNoSuma = TotalimporteNoSuma + importeNoSuma;
                        }
                    });
                    efectivoArqueado = (totalImporte - TotalimporteNoSuma) + fondoCaja;
                    total = efectivoArqueado - fondoCaja;
                    ventaTotal = totalImporte;
                    efectivoArqueado = Ext.util.Format.number(efectivoArqueado, '0,000.00');
                    total = Ext.util.Format.number(total, '0,000.00');
                    ventaTotal = Ext.util.Format.number(ventaTotal, '0,000.00');
                } else {
                    _this.btnRefrescar.disable();
                }

                _this.lbVentatotal.setText(_this.idioma.cgVentatotal + ' ' + ventaTotal);
                _this.lbEfectivoarqueado.setText(_this.idioma.cgEfectivoArqueado + ' ' + efectivoArqueado);
                _this.lbVenE.setText(_this.idioma.cgVenE + ' ' + total);
                _this.panelImporte.doLayout();*/
            },

        });
    },
    createComboCajero: function () {
        var _this = this;
        /*_this.fechacierre = new Ext.form.DateField({
            //fieldLabel: 'Inicio de ventas',
            name: 'fechacierre',
            vtype: 'daterange',
            disabled: true,
            editable: false,
            //id: 'fechacierre',
            //endDateField: 'hasta',
            //maxValue: fechacontable,
            listeners: {
                render: function(cmp){
                    cmp.setValue(fechacontable); 
                }
            }
            //minValue:
        });*/
        /*_this.cmbCajero = new LOG.util.ComboBox({
            editable: false,
            allowBlank: false,
            url: '/logistica/facturacion/puntoventa/index.php/ventasdevolucion/devolverDocumentos',
            hiddenName: 'cajero',
            valueField: 'cajero',
            displayField: 'cajero',
            listeners: {
                select: function (cmb, rd) {
                    _this.cajero = cmb.getValue();
                    _this.getGridPrincipal().getStore().initBaseParams.cajero = _this.cajero;
                    _this.modelo.CierrePorCajero({
                        record: Ext.encode(_this.cajero),
                    });
                    _this.getGridPrincipal().getStore().load();
                }
            }
        });

        _this.cmbCajero.getStore().on('load', function (st, rd, op) {
                _this.cajero = rd[0].json.cajero;
                _this.getGridPrincipal().getStore().initBaseParams.cajero = _this.cajero;

        })*/

        /*_this.fondocaja = LOG.util.Prototipos.inputDecimal({
            name: 'fondocaja',
            width: 50,
            enableKeyEvents: true,
            allowDecimals: true,
            allowNegative: false,
            allowBlank: false
        });*/  

        this.lbFechaInicio = new Ext.form.Label({
            text: this.idioma.cgInicioFecha,
            style: 'padding-left: 1px;font-weight: bolder;font-size: 12px;',
            tabular: true
        });
        _this.lbFechaInicio.setText(_this.idioma.cgInicioFecha + ' ' + fechacontable);
        
        this.lbEfectivoinicio = new Ext.form.Label({
            text: this.idioma.cgEfectivoInicio,
            style: 'color:green;padding-right: 2px;font-weight: bolder;font-size: 12px;',
            tabular: true
        });
        _this.lbEfectivoinicio.setText(_this.idioma.cgEfectivoInicio + ' 0.00');

        /*_this.getGridPrincipal().getStore().on('beforeload', function (st, records, op) {
                st.baseParams.idestructuraop = _this.idestructuraop;
            }
        );*/
        _this.getGridPrincipal().getStore().on('load', function (st, records, op) {
            var ventatotal = 0;
            if(records.length > 0){
                var hora = (records[0].json.horaapertura)?records[0].json.horaapertura:'';
                _this.lbEfectivoinicio.setText(_this.idioma.cgEfectivoInicio + ' '+Ext.util.Format.number(records[0].json.efectivo, '0,000.00'));
                _this.lbFechaInicio.setText(_this.idioma.cgInicioFecha+' '+records[0].json.fechaapertura+' '+hora);
                for (var i = 0; i < records.length; i++) {
                        ventatotal = ventatotal + parseFloat(records[i].json.importe);
                }
                _this.lbEfectivoarqueado.setText(Ext.util.Format.number(ventatotal, '0,000.00'));
            }
        });
        /*_this.getGridPrincipal().on('afteredit', function (e) {
            if (e.field == 'total'){
                var total = e.record.data.total - e.record.data.importe;
                //console.info(total);
                e.record.data.diferencia = total;
            }
            _this.getGridPrincipal().getView().refresh();
        });*/

        return {
            border: false,
            tbar: [_this.lbFechaInicio, '-','->',_this.lbEfectivoinicio]

        };
    },
    init: function () {
        var _this = this;
        LOG.fac.ventasdevolucion.GridListCierre.superclass.init.call(this);

        this.lbVT = new Ext.form.Label({
            text: this.idioma.cgVT,
            style: 'color:green;padding-left: 1px;font-weight: bolder;font-size: 10px;',
            tabular: true
        });

        this.lbVentatotal = new Ext.form.Label({
            text: this.idioma.cgVentatotal,
            style: 'color:green;padding-left: 1px;font-weight: bolder;font-size: 16px;',
            tabular: true
        });
        //_this.lbVentatotal.setText(_this.idioma.cgVentatotal + ' 10,000,000.00');

        this.lbEfectivoarqueado = new Ext.form.Label({
            //text: this.idioma.cgEfectivoArqueado,
            style: 'color:green;padding-left: 1px;font-weight: bolder;font-size: 16px;',
            tabular: true
        });
        _this.lbEfectivoarqueado.setText('0.00');

        this.lbEfectTotalArqueado = new Ext.form.Label({
            text: this.idioma.cgEfectivoArqueado,
            style: 'color:green;padding-left: 1px;font-weight: bolder;font-size: 16px;',
            tabular: true
        });
        //_this.lbVentatotal.setText(_this.idioma.cgVentatotal + ' 10,000,000.00');

        this.lbValorEfectTotalArqueado = new Ext.form.Label({
            //text: this.idioma.cgEfectivoArqueado,
            style: 'color:green;padding-left: 1px;font-weight: bolder;font-size: 16px;',
            tabular: true
        });
        _this.lbValorEfectTotalArqueado.setText('0.00');

        /*this.lbVenE = new Ext.form.Label({
            text: this.idioma.cgVenE,
            style: 'padding: 10px 10px 0px 0px;font-weight: bolder;font-size: 12px;',
            tabular: true
        });
        _this.lbVenE.setText(_this.idioma.cgVenE + ' ' + 0);*/
        
        this.txtAObservaciones = new Ext.form.TextArea({
            //fieldLabel: this.idioma.nfObservaciones,
            //anchor: '100%',
            enableKeyEvents: true,
            maxLength: '255',
            minLength: '2',
            width: 200,
            height: 70,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'change' : function ( field, newValue, oldValue ){
                    this.originalValue = this.getValue();
                    this.value = newValue;
                }
            }
        });
        
        this.fsOtrosDatos = new Ext.form.FieldSet({
            //title: this.idioma.nfObservaciones,            
            width: 100,
            items: [this.txtAObservaciones]
        });
        /*this.fsTotalV = new Ext.form.FieldSet({
            //title: this.idioma.tlFSOtrosDatos,
            items: [this.lbVentatotal, this.lbEfectivoarqueado]
        });*/
        this.panelImporte = LOG.util.UIManager.initPanel({
            region: 'south',
            border: false,
            layout: 'column',
            //height: '100%',
            //width: 800,
            //align:'rigth',
            tbar: [/*this.fsOtrosDatos,*/'->',{
                xtype: 'buttongroup',
                columns: 1,
                border: false,
                items: [this.lbVentatotal, /*this.lbVT,*/ this.lbEfectivoarqueado/*,this.lbEfectTotalArqueado,this.lbValorEfectTotalArqueado*/]
            }]

        });
        this.getPanelGrid().onRender = this.getPanelGrid().onRender.createSequence(function () {
            this.getPanelGrid().add(this.panelImporte);
        }, this);
    },
    render: function () {
        var _this = this;
        var _res = LOG.fac.ventasdevolucion.GridListCierre.superclass.render.call(this);

        this.getStorePrincipal().load({
            params: {
                idestructuraop: _this.idestructuraop
            }
        });
        return _res;
    },
    getUsuarioById: function (id) {
        var _this = this;
        for (var i = 0; i < _this.usuarios.length; i++) {
            if (_this.usuarios[i].idusuario == id) {
                return _this.usuarios[i].nombreusuario;
            }
        }
        return '-';
    },
    modificarTotal: function(){
        var editorTotal = LOG.util.Prototipos.inputDecimal({
            name: 'total',
            width: 100,
            enableKeyEvents: true,
            allowDecimals: true,
            allowNegative: false,
            allowBlank: false
        });
        return editorTotal;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: this.idioma.cgTipoCaja,
            width: 250,
            dataIndex: 'caja',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgTipoventa,
            width: 80,
            dataIndex: 'modopago',
            default: true,
            renderer: function (v) {
                return v;
            }
        });
        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            /*header: this.idioma.cgImporte,
            width: 90,*/
            dataIndex: 'importe',
            /*default: true,
            align:'right'*/
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            header: this.idioma.cgTotal,
            width: 100,
            dataIndex: 'total',
            default: true,
            editor:_this.modificarTotal(),
            align:'right'
        }));
        this.addGridColumn({
            header: this.idioma.cgDiferencia,
            width: 100,
            dataIndex: 'diferencia',
            default: true,
            align:'right',
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                value = parseFloat(record.data.total) - parseFloat(record.data.importe);
                if (value < 0) {
                    return '<span style="color: red">' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                }else if (value > 0){
                    return '<span style="color: blue">' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                }else{
                    return '<span style="color: black">' + Ext.util.Format.number(value, '0,000.00') + '</span>';
                }
            }
        });
    },
});

LOG.fac.ventasdevolucion.ModificarObs = Ext.extend(LOG.util.Window, {
    constructor: function (config) {
        var me = this;
        LOG.util.UIManager.apply(this, config);
        this.width = 450;
        this.height = 250;
        this.resizable = false;
        this.usarAplicar = false;
        //this.idComponent = 'wAddConex';
        this.modelo = new Log.fac.ventasdevolucion.Model({
            idioma: this.idioma,
            urlController: '/logistica/facturacion/puntoventa/index.php/ventasdevolucion'
        });
        LOG.fac.ventasdevolucion.ModificarObs.superclass.constructor.call(this, config);
        this.ventanaAdicionar();
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            //disabled: true,
            handler: function () {
                var params = me.getParams(true);
                me.modelo.guardarObservacion(params, function () {
                    me.close();
                    me._parent.getStorePrincipal().reload();
                });
            }
        });
    },
    ventanaAdicionar: function () {
        var me = this;
        var selected = me._parent.getSmPrincipal().getSelected();
        this.txtAObservaciones = new Ext.form.TextArea({
            //fieldLabel: this.idioma.nfObservaciones,
            //anchor: '100%',
            enableKeyEvents: true,
            maxLength: '255',
            minLength: '2',
            width: 398,
            height: 100,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'render': function (field) {
                    field.setValue(selected.data.observaciones);
                }
            }
        });

        /*this.clsSuperior = LOG.util.UIManager.initColumnForm({
            columnas: 1,
        });
        this.clsSuperior.addComponent(this.txtAObservaciones);*/
        
        this.fsDatosObs = new Ext.form.FieldSet({
            items: [this.txtAObservaciones]
        });
        this.pMain = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'center',
            items: [this.fsDatosObs]
        });
        this.add(this.pMain);
    },
    getParams: function (test) {
        var params = {};
        var me = this;          
        var selected = me._parent.getSmPrincipal().getSelected();
        //params.action = 'mod';
        params.observaciones = me.txtAObservaciones.getValue();
        params.iddocumento = selected.data.iddocumento;
        return params;
    }
});

LOG.fac.ventasdevolucion.ModificarDatosClientes = Ext.extend(LOG.util.Window, {
    constructor: function (config) {
        var me = this;
        LOG.util.UIManager.apply(this, config);
        this.width = 300;
        this.height = 410;
        this.resizable = false;
        this.usarAplicar = false;
        //this.idComponent = 'wAddConex';
        this.modelo = new Log.fac.ventasdevolucion.Model({
            idioma: this.idioma,
            urlController: '/logistica/facturacion/puntoventa/index.php/ventasdevolucion'
        });
        LOG.fac.ventasdevolucion.ModificarDatosClientes.superclass.constructor.call(this, config);
        this.ventanaAdicionar();
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            //disabled: true,
            handler: function () {
                var params = me.getParams(true);
                me.modelo.guardarDatosClientes(params, function () {
                    me.close();
                    me._parent.getStorePrincipal().reload();
                });
            }
        });
    },
    ventanaAdicionar: function () {
        var me = this;
        var idpersona = null;
        this.comboCliente = new LOG.util.ComboBox({
            fieldLabel: this.idioma.cgCliente,
            emptyText: this.idioma.lbTextCliente,
            anchor: '100%',
            editable: true,
            url: 'obtenerClientes',
            hiddenName: 'idventacliente',
            valueField: 'idventacliente',
            displayField: 'nombre',
            pageSize: 15,
            mode: 'remote',
            minChars: 6,
            autoScroll: true,
            autoLoad: false,
            triggerAction: 'all',
            baseParams:{
                modificar:true
            },
            enableQtip: true,
            listeners: {
                'select': function (campo, value) {
                    campo.setValue(value.json.idventacliente);
                    me.txtfieldCI.setValue(value.json.numeroidentidad);
                    me.txtfieldNombre.setValue(value.json.nombreyap);
                    me.txtfieldTelef.setValue(value.json.telefono);
                    me.txtfieldDir.setValue(value.json.direccion);
                    me.txtfieldCorreo.setValue(value.json.correo);
                    me.txtfieldCI.enable();  
                    me.txtfieldNombre.enable();
                    me.txtfieldTelef.enable();
                    me.txtfieldDir.enable();
                    me.txtfieldCorreo.enable();
                    document.getElementById('idregistradorpor').innerHTML = value.json.vendedor;
                },
                'keydown': function (t, e) {                                 
                    //me.idpersona = null;
                    //if (e.keyCode == 8) {
                        me.comboCliente.reset();
                        me.txtfieldCI.setValue('');  
                        me.txtfieldNombre.setValue('');
                        me.txtfieldTelef.setValue('');
                        me.txtfieldDir.setValue('');
                        me.txtfieldCorreo.setValue('');
                        me.txtfieldCI.disable();  
                        me.txtfieldNombre.disable();
                        me.txtfieldTelef.disable();
                        me.txtfieldDir.disable();
                        me.txtfieldCorreo.disable();
                    //}
                },
                'blur': function (th) {
                    var record = this.getStore().getById(th.value);
                    if (record) {
                        me.txtfieldCI.setValue(value.json.numeroidentidad);
                        me.txtfieldNombre.setValue(value.json.nombreyap);
                        me.txtfieldTelef.setValue(value.json.telefono);
                        me.txtfieldDir.setValue(value.json.direccion);
                        me.txtfieldCorreo.setValue(value.json.correo);
                        me.txtfieldCI.enable();  
                        me.txtfieldNombre.enable();
                        me.txtfieldTelef.enable();
                        me.txtfieldDir.enable();
                        me.txtfieldCorreo.enable();
                        document.getElementById('idregistradorpor').innerHTML = value.json.vendedor;
                    } else{
                        me.txtfieldCI.setValue('');
                        me.txtfieldNombre.setValue('');
                        me.txtfieldTelef.setValue('');
                        me.txtfieldDir.setValue('');
                        me.txtfieldCorreo.setValue('');
                        me.txtfieldCI.disable();  
                        me.txtfieldNombre.disable();
                        me.txtfieldTelef.disable();
                        me.txtfieldDir.disable();
                        me.txtfieldCorreo.disable();
                    }  
                } 
            }
        });

        this.txtfieldCI = new LOG.util.Prototipos.inputEntero({
            maxLength: 11,
            fieldLabel: this.idioma.txfCI,
            emptyText: this.idioma.lbTextCI,
            anchor: '80%',
            allowBlank: false,
            regex: LOG.util.Regex.carnetypasaporte,
            //regexText: _this.idioma.msgRegexText,
            disabled:true,
            //editable: false,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'change' : function ( field, newValue, oldValue ){
                    this.originalValue = this.getValue();
                    this.value = newValue;
                }
            }
        });
        this.txtfieldNombre = new LOG.util.Prototipos.inputTexto({
            maxLength: 200,
            fieldLabel: this.idioma.nfNombre,
            emptyText: this.idioma.lbTextNombre,
            anchor: '100%',
            allowBlank: false,
            regex: LOG.util.Regex.nombre,
            //regexText: _this.idioma.msgRegexText,
            disabled:true,
            //editable: false,            
            enableKeyEvents: true,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                    //me.keyMap.enable();
                },
                'change' : function ( field, newValue, oldValue ){
                    this.originalValue = this.getValue();
                    this.value = newValue;
                }
            }
        });
        this.txtfieldTelef = new LOG.util.Prototipos.inputTexto({
            maxLength: 20,
            fieldLabel: this.idioma.nfTelefono,
            emptyText: this.idioma.lbTextTelefono,
            anchor: '80%',
            //regex: LOG.util.Regex.cadena,
            //regexText: _this.idioma.msgRegexText,
            disabled:true,
            //editable: false,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'change' : function ( field, newValue, oldValue ){
                    this.originalValue = this.getValue();
                    this.value = newValue;
                }
            }
        });
        this.txtfieldDir = new LOG.util.Prototipos.inputTexto({
            maxLength: 100,
            fieldLabel: this.idioma.nfDireccion,
            emptyText: this.idioma.lbTextDireccion,
            anchor: '100%',
            //regex: LOG.util.Regex.cadena,
            //regexText: _this.idioma.msgRegexText,
            disabled:true,
            //editable: false,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'change' : function ( field, newValue, oldValue ){
                    this.originalValue = this.getValue();
                    this.value = newValue;
                }
            }
        });
        this.txtfieldCorreo = new LOG.util.Prototipos.inputTexto({
            //maxLength: 11,
            fieldLabel: this.idioma.nfCorreo,
            emptyText: this.idioma.lbTextCorreo,
            anchor: '80%',
            regex: LOG.util.Regex.email,
            //regexText: _this.idioma.msgRegexText,
            disabled:true,
            //editable: false,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'change' : function ( field, newValue, oldValue ){
                    this.originalValue = this.getValue();
                    this.value = newValue;
                }
            }
        });        
        
        this.lblRegistradoPor = new Ext.form.Label({
            text: this.idioma.lblRegistradoPor,
            style: 'color:blue;font-weight: bolder;font-size: 10px;'
        });

        this.lblValorRegistradoPor = new Ext.form.Label({
            html: '<span id="idregistradorpor"></span>',
            style: 'color:blue;font-weight: bolder;font-size: 10px;'
        });
        
        this.fsDatosObs = new Ext.form.FieldSet({
            title: this.idioma.tlFSDatos,
            items: [this.comboCliente,this.txtfieldCI,this.txtfieldNombre,this.txtfieldTelef,this.txtfieldDir,
                this.txtfieldCorreo,this.lblRegistradoPor,this.lblValorRegistradoPor]
        });
        this.pMain = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'center',
            items: [this.fsDatosObs]
        });
        this.add(this.pMain);
    },
    getParams: function (test) {
        var params = {};
        var me = this;
        params.idventacliente = me.comboCliente.getValue();
        params.numeroidentidad = me.txtfieldCI.getValue();
        params.nombre = me.txtfieldNombre.getValue(); 
        params.telefono = me.txtfieldTelef.getValue();
        params.direccion = me.txtfieldDir.getValue();
        params.correo = me.txtfieldCorreo.getValue();
        /*var me = this;          
        var selected = me._parent.getSmPrincipal().getSelected();
        //params.action = 'mod';
        params.observaciones = me.txtAObservaciones.getValue();
        params.iddocumento = selected.data.iddocumento;*/
        return params;
    }
});

LOG.fac.ventasdevolucion.EstadoEjecucion = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.viewConfig = {
            usarAplicar: false,
            usarAceptar: false
        };
        this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        //this.dirController = '/logistica/utiles/maestroproductos/index.php/maestroproductos';
        this.urlBusquedaGridPrincipal = 'getDocumentosGenerados';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.fac.ventasdevolucion.Idioma);
        LOG.fac.ventasdevolucion.EstadoEjecucion.superclass.constructor.call(this, config);
        this.getVistaPrincipal().height = 450;
        this.getVistaPrincipal().width = 650;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'iddocumento',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'tipo',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: 'Nro. Pedido',
            width: 120,
            dataIndex: 'nropedido',
            agrupador: true
        });
        this.addGridColumn({
            header: 'Nro. Documento',
            width: 120,
            dataIndex: 'nrodoc',
            //default: true
        });
        this.addGridColumn({
            header: 'Nro. Referencia',
            width: 120,
            dataIndex: 'numeroref',
            //default: true
        });
        this.addGridColumn({
            header: 'Tipo documento',
            width: 120,
            dataIndex: 'tipodoc',
            //default: true
        });
        this.addGridColumn({
            header: 'Entidad',
            width: 120,
            dataIndex: 'entidad',
            //default: true
        });
    },
    render: function () {
        var _this = this;
        var vista = LOG.fac.ventasdevolucion.EstadoEjecucion.superclass.render.call(this);
        return vista;
    }
});