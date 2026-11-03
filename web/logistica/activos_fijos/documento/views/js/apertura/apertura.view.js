/**
 *Created by Daniel on 15/11/2016
 */
Ext.ns('LOG.aft.apertura');
LOG.aft.apertura.View = Ext.extend(LOG.util.UITemplate, {
    tapSuperior: undefined,
    idayuda:undefined,
    tipo:0,
    listaEstructuras:undefined,
    constructor: function(config) {
        this.busquedaBasica = true;
        this.busquedaAvanzada = true;
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.modoSeleccion = 2;
        this.dirController = '/logistica/activos_fijos/documento/index.php/aperturaaft';
        config.urlBusquedaGridPrincipal = 'cargarDocumentos';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.aft.apertura.Idioma);
        this.concepto = this.idioma.tlBtnBuscar;
        this.textBusquedaSimple = this.idioma.cgNumeroOrden;
        LOG.aft.apertura.View.superclass.constructor.call(this, config);
        this.modelo = new LOG.aft.apertura.Model({
            idioma: config.idioma
        });
        this.modelo.cargarEstructuras();
        this.modelo.cargarEstructurasHijas();
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'iddocapertura',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'nroapertura',
            header: this.idioma.cgNro,
            width: 120
        });
        this.addGridColumn({
            dataIndex: 'estadoemisor',
            header: this.idioma.cgEstadoEmisor,
            width: 120,
            renderer: function(v) {
                return LOG.lb.documento.Estado[v];
            }
        });
        this.addGridColumn({
            dataIndex: 'estadoreceptor',
            header: this.idioma.cgEstadoReceptor,
            width: 120,
            renderer: function(v) {
                return LOG.lb.documento.Estado[v];
            }
        });
        this.addGridColumn({
            dataIndex: 'estructuraorigen',
            header: this.idioma.cgOrigen,
            width: 220,
            renderer:function(val,d,rec){
                if(rec.json.denomestructuraorigen)
                    return rec.json.denomestructuraorigen;
                else return val;
            },
            hidden:(_this.tipo == 0)?true:false
        });
        this.addGridColumn({
            dataIndex: 'destino',
            header: this.idioma.cgDestino,
            width: 250,
            renderer:function(val,d,rec){
                if(rec.json.denomdestino)
                 return rec.json.denomdestino;
                else return val;
            },
            hidden:(_this.tipo == 1)?true:false
        });
        this.addGridColumn({
            dataIndex: 'cantmedios',
            header: this.idioma.cgCantMedios,
            width: 250
        });
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonNuevo({
            text: this.idioma.lbBtnNuevo,
            tooltip: this.idioma.ttBtnAdicionar,
            handler: function() {
                var ventanaAdd =  new LOG.aft.apertura.VentanaAdd({
                    idioma:_this.idioma,
                    modelo:_this.modelo,
                    title:_this.idioma.tlAdicionarApertura,
                    acciones:_this.acciones,
                    tipo:_this.tipo,
                    usarAplicar:false
                });
                ventanaAdd.show();
                ventanaAdd.maximize();
            },
            controlFn: function(b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.hide();
                    if(_this.tipo == 0){
                        b.show();
                    }
                } else {
                    b.hide();
                }
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonAbrir({
            tooltip: this.idioma.ttBtnAbrir,
            isContextual: true,
            handler: function() {
                var recSelect = _this.getSmPrincipal().getSelected();
                var ventanaAdd =  new LOG.aft.apertura.VentanaAdd({
                    idioma:_this.idioma,
                    modelo:_this.modelo,
                    title:_this.idioma.tlAdicionarVer,
                    acciones:_this.acciones,
                    iddocapertura:recSelect.json.iddocapertura,
                    tipo:_this.tipo,
                    usarAplicar:false,
                    estado:(_this.tipo==0)?recSelect.data.estadoemisor:recSelect.data.estadoreceptor
                });
                ventanaAdd.datosModificar(recSelect);
                ventanaAdd.show();
                ventanaAdd.maximize();
            },
            controlFn: function(b, _caller) {
                b.disable();
                LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }

                }, 'ver');
            }
        }));
        this.onGridDobleClick = function() {
            var b = _this.listaBotones.getItem(1);
            b.handler.call(b, b);
        };
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            text: this.idioma.lbBtnEliminar,
            tooltip: this.idioma.ttBtnEliminar,
            isContextual: true,
            handler: function() {
                var selections = _this.getSmPrincipal().getSelections();
                var ids = new Array();
                Ext.each(selections, function(rec){
                    ids.push(rec.json.iddocapertura);
                });
                _this.modelo.eliminar({'id':ids});
            },
            controlFn: function(b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    b.hide();
                    if(_this.tipo == 0) {
                        b.show();
                        b.disable();
                        LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                b.disable();
                                if (this.getCount() > 0) {
                                    var recsSelected = _this.getSmPrincipal().getSelections();
                                    var ok = true;
                                    Ext.each(recsSelected, function (rec) {
                                        if (rec.data.estadoemisor != 1 || rec.data.estadoreceptor != 1) {
                                            ok = false;
                                            return;
                                        }
                                    });
                                    if (ok) {
                                        b.enable();
                                    }
                                } else {
                                    b.disable();
                                }
                            }
                        }, 'eliminar');
                    }
                } else {
                    b.hide();
                }
            }
        }));
        this.addToolbarButton(new LOG.util.Prototipos.botonConfirmar({
            tooltip: this.idioma.ttBtnConfirmar,
            isContextual: true,
            handler: function() {
                var iddocapertura = _this.getSmPrincipal().getSelected().data.iddocapertura;
                _this.modelo.confirmar({id: iddocapertura, tipo:_this.tipo});
            },
            controlFn: function(b, _caller) {
                if( _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')|| _caller.grantedAction('RConfirmar')){
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                    if (e == 'rowselect') {
                        if (this.getCount()==1) {
                            var dataActual = _caller.getGridPrincipal().getSelectionModel().getSelected().data;
                            if ( (dataActual.estadoemisor == 1 && _this.tipo == 0) || (dataActual.estadoreceptor == 1 && _this.tipo == 1) ) {
                                b.enable();
                            }
                            else
                                b.disable();
                        }
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                    if (e == 'selectionchange') {
                        if (this.getCount()==1) {
                            var dataActual = _caller.getGridPrincipal().getSelectionModel().getSelected().data;
                            if ( (dataActual.estadoemisor == 1 && _this.tipo == 0) || (dataActual.estadoreceptor == 1 && _this.tipo == 1) ) {
                                b.enable();
                            }
                            else
                                b.disable();
                        }
                    }
                });
            }
        }));
        this.addToolbarButton(new LOG.util.Prototipos.botonAnularEstado({
            tooltip: this.idioma.ttBtnAnularEstado,
            isContextual: true,
            handler: function() {
                var iddocapertura = _this.getSmPrincipal().getSelected().data.iddocapertura;
                _this.modelo.anularestado({id: iddocapertura, tipo:_this.tipo});
            },
            controlFn: function(b, _caller) {
                if( _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')|| _caller.grantedAction('RAnularestado')){
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                    if (e == 'rowselect') {
                        b.disable();
                        var recSelected =_caller.getGridPrincipal().getSelectionModel().getSelected();
                        if (this.getCount()==1) {
                            if (
                                (recSelected.data.estadoemisor == 2 && _this.tipo ==0 && recSelected.data.estadoreceptor == 1)
                                || (recSelected.data.estadoreceptor == 2 && _this.tipo ==1 && recSelected.data.estadoemisor != 3)) {
                                b.enable();
                            }
                            else
                                b.disable();
                        }
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                    if (e == 'selectionchange') {
                        b.disable();
                        var recSelected =_caller.getGridPrincipal().getSelectionModel().getSelected();
                        if (this.getCount()==1) {
                            if ( (recSelected.data.estadoemisor == 2 && _this.tipo ==0 && recSelected.data.estadoreceptor == 1)
                                || (recSelected.data.estadoreceptor == 2 && _this.tipo ==1 && recSelected.data.estadoemisor != 3)) {
                                b.enable();
                            }
                            else
                                b.disable();
                        }
                    }
                });
            }
        }));
        this.addToolbarButton(new LOG.util.Prototipos.botonAprobar({
            tooltip: this.idioma.ttBtnAprobar,
            isContextual: true,
            handler: function() {
                var iddocapertura = _this.getSmPrincipal().getSelected().data.iddocapertura;
                _this.modelo.aprobar({id: iddocapertura, tipo:_this.tipo});
            },
            controlFn: function(b, _caller) {
                if( _caller.grantedAction('CT') || _caller.grantedAction('RAprobar')){
                    b.hide();
                    if(_this.tipo == 0){
                        b.show();
                        b.disable();
                        _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                            if (e == 'rowselect') {
                                var recSelected =_caller.getGridPrincipal().getSelectionModel().getSelected();
                                if (this.getCount()==1) {
                                    if ( recSelected.data.estadoemisor == 2 && recSelected.data.estadoreceptor == 2
                                        && _this.tipo == 0  && recSelected.json.sinubicar == 0 ) {
                                        b.enable();
                                    }
                                    else
                                        b.disable();
                                }
                            }
                            if (e == 'rowdeselect') {
                                b.disable();
                            }
                            if (e == 'selectionchange') {
                                var recSelected =_caller.getGridPrincipal().getSelectionModel().getSelected();
                                if (this.getCount()==1) {
                                    if ( recSelected.data.estadoemisor == 2 && recSelected.data.estadoreceptor == 2
                                        && _this.tipo == 0  && recSelected.json.sinubicar == 0 ) {
                                        b.enable();
                                    }
                                    else
                                        b.disable();
                                }
                            }
                        });
                    }
                }
                else  b.setVisible(false);

            }
        }));
        this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({
            id: this.idayuda//'ayudaapertura'
        }));
    },
   /* view: function(config)  {
        var _this = this;
        _this.getPanelBusqueda().setColumns(1);
        var cls = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.comboEstadoEmisorBA = new LOG.util.ComboBox({
            fieldLabel: this.idioma.cgEstado,
            hiddenName: 'estadoemisor',
            valueField: 'idestado',
            displayField: 'estadoemisor',
            editable: false,
            mode: 'local',
            minChars:1,
            store: new Ext.data.SimpleStore({
                fields: ['idestado', 'estadoemisor'],
                data: [
                    [1, LOG.lb.documento.Estado[1]],
                    [2, LOG.lb.documento.Estado[2]],
                    [9, LOG.lb.documento.Estado[9]]
                ]
            })
        });
        cls.addComponent(this.comboEstadoEmisorBA);
        this.comboEstadoReceptorBA = new LOG.util.ComboBox({
            fieldLabel: this.idioma.cgEstado,
            hiddenName: 'estadoreceptor',
            valueField: 'idestado',
            displayField: 'estadoreceptor',
            editable: false,
            mode: 'local',
            minChars:1,
            store: new Ext.data.SimpleStore({
                fields: ['idestado', 'estadoreceptor'],
                data: [
                    [1, LOG.lb.documento.Estado[1]],
                    [2, LOG.lb.documento.Estado[2]],
                    [9, LOG.lb.documento.Estado[9]]
                ]
            })
        });
        cls.addComponent(this.comboEstadoReceptorBA);
        _this.addFilterComponent(cls);

        return LOG.aft.apertura.View.superclass.view.call(this, config);
    },*/
    setPersonas: function(arr) {
        this.arrPersonas = arr;
    },
    setEntidad: function(arr) {
        this.idEntidad = arr['identidad'];
        this.winGestionarDocumento.setEntidad(arr);
    },
    setClientes: function(clientes) {
        this.arrClientes = clientes;
    },
    render:function(conf){
        var _this = this;
        var vista = LOG.aft.apertura.View.superclass.render.call(this,conf);
        this.getStorePrincipal().on({
            beforeload:function(st,obj){
                _this.getStorePrincipal().initBaseParams.tipo = _this.tipo;
            }
        });
        return vista;
    }
});

