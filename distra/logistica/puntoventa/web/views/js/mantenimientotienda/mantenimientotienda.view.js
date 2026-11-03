Ext.ns('LOG.fac.mantenimientotienda');

LOG.fac.mantenimientotienda.Productos = Ext.extend(LOG.util.UITemplate, {
    seleccion: undefined,
    constructor: function(config) {
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.fac.mantenimientotienda.Idioma);
        this.formaVisualizacion = 'panel';
        this.dirController = '/logistica/facturacion/puntoventa/index.php/mantenimientotienda';
        this.urlBusquedaGridPrincipal = 'cargarPedidos';
        this.modoSeleccion = 3;
        this.busquedaBasica = true;
        this.busquedaAvanzada = true;
        this.autoLoad = false;
        this.autoSelect = false;
        this.seleccionAnterior = new Array();
        //this.gridEditable = true;
        this.modelo = new LOG.fac.mantenimientotienda.Modelo({
            idioma: config.idioma
        });
        LOG.fac.mantenimientotienda.Productos.superclass.constructor.call(this, config);
    },
    init: function() {
        var _this = this;
        LOG.fac.mantenimientotienda.Productos.superclass.init.call(this);

        LOG.util.UIManager.apply(this.getPanelSuperior(), {
            width: 10
        });

        _this.disponib = new Ext.form.Checkbox({
            boxLabel: 'Disponibilidad',
            name: 'condisponible',
            listeners: {
                'check': function(cmp, checked) {
                    if (checked) {
                        cmp.checked = true;
                        _this.panelBusquedaAvanzada.parametros.condisponible = 1;
                    } else {
                        cmp.checked = false;
                        _this.panelBusquedaAvanzada.parametros.condisponible = 0;
                    }
                }
            }
        });
        _this.exist = new Ext.form.Checkbox({
            boxLabel: 'Existencia',
            name: 'conexistencia',
            listeners: {
                'check': function(cmp, checked) {
                    if (checked) {
                        cmp.checked = true;
                        _this.panelBusquedaAvanzada.parametros.conexistencia = 1;
                    } else {
                        _this.panelBusquedaAvanzada.parametros.conexistencia = 0;
                    }
                }
            }
        });

        _this.tipoDif = new LOG.util.ComboBox({
            fieldLabel: 'Criterio',
            valueField: 'tipocriterio',
            displayField: 'denominacion',
            hiddenName: 'tipocriterio',
            editable: false,
            triggerAction: 'all',
            mode: 'local',
            store: new Ext.data.SimpleStore({
                fields: ['tipocriterio', 'denominacion'],
                data: [
                    [1, 'Cant. tienda > Cant. tienda (DISTRA)'],
                    [2, 'En proceso > Existencia']
                ]
            })
        });

        _this.getPanelBusqueda().setColumns(1)
        _this.frmCantidades = new LOG.util.ColumnForm(2);
        _this.frmCantidadesDiv = new LOG.util.ColumnForm(2);
        _this.frmCantidadesDiv.addComponent(_this.disponib);
        _this.frmCantidadesDiv.addComponent(_this.exist);
        _this.frmCantidades.addComponent(new Ext.form.FieldSet({
            title: 'Productos',
            anchor: '100%',
            items: [_this.frmCantidadesDiv]
        }));
        _this.frmCantidades.getColumn(0).columnWidth = 1;
        _this.frmCantidades.getColumn(0).getComponent(0).anchor = '99%';

        _this.addFilterComponent(_this.frmCantidades);
        _this.addFilterComponent(_this.tipoDif);

        this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function () {

        });
    },
    render: function() {
        var _this = this;
        var vis = LOG.fac.mantenimientotienda.Productos.superclass.render.call(this);
        _this.getStorePrincipal().on({
            'beforeload': function (st) {
                st.baseParams.idareaventa = _this.idareaventa || -1;
                st.initBaseParams.idareaventa = _this.idareaventa || -1;

                st.baseParams.iddeposito = _this.iddeposito || -1;
                st.initBaseParams.iddeposito = _this.iddeposito || -1;
            }
        });
        _this.getGridPrincipal().on({
            'celldblclick': function ( gp, rowIndex, columnIndex, e ) {
                if (columnIndex == 2) {
                    const copyToClipboard = async str => {
                        try {
                            await navigator.clipboard.writeText(str);
                            mostrarMensaje(1, 'C\xf3digo <b>'+str+'</b> copiado al portapapeles');
                        } catch (error) {
                            console.log(error);
                        }
                    };
                    copyToClipboard(e.target.outerText)
                }
            }
        });
        return vis;
    },
    setIdAreaVenta: function(id) {
        this.idareaventa = id;
    },
    setIdDeposito: function(id) {
        this.iddeposito = id;
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idproducto',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idareaventa',
            hidden: true
        });
        this.addGridColumn({
            header: 'C\xf3digo',
            width: 200,
            dataIndex: 'numeropieza',
            filter : {
                type : 'string',
                emptyText : 'C\xf3digo',
                dataIndex : 'numeropieza'
            }
            //default: true
        });
        this.addGridColumn({
            header: 'Denominaci\xf3n',
            width: 300,
            dataIndex: 'denominacion',
            //default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: 'Cantidad tienda',
            width: 120,
            dataIndex: 'canttienda',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: 'Cantidad tienda (DISTRA)',
            width: 200,
            dataIndex: 'canttiendadistra',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: 'En proceso',
            width: 120,
            dataIndex: 'enproceso',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: 'Disponible',
            width: 120,
            dataIndex: 'disponible',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: 'Existencia',
            width: 120,
            dataIndex: 'existenciadistra',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: 'Diferencia tienda',
            width: 120,
            dataIndex: 'diftienda',
            align: 'right',
            default: true
        }));

    },
    initDefaultButtons: function() {
        var _this = this;

        let btnImportarProductos = LOG.util.UIManager.createBtn({
            iconCls: 'importar',
            text: 'Importar productos',
            tooltip: 'Importar productos desde un fichero excel',
            disabled: true,
            handler: function () {
                var win = new LOG.lb.importar.View({
                    class: 'MantenimientotiendaModel',
                    params: {
                        idareaventa: _this.idareaventa,
                        formato: 'csv', delimiter: ';'
                    },
                    fn: function (r) {
                        _this.getStorePrincipal().load()
                    }
                });
                win.show();
            },
            fnEspecialCondition: function () {
                return true;
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
                _this._cmbArea.fireEvent = _this._cmbArea.fireEvent.createSequence(function (e) {
                    if (_this.idareaventa != undefined && _this.idareaventa != -1) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                });
            }
        });

        this.addToolbarButton(btnImportarProductos);

        let btnProductos = LOG.util.UIManager.createBtn({
            iconCls: 'descargar',
            text: 'Descargar productos',
            tooltip: 'Importar productos desde tienda',
            disabled: true,
            handler: function () {
                _this.descargarProductos();
            },
            fnEspecialCondition: function () {
                return true;
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
                _this._cmbArea.fireEvent = _this._cmbArea.fireEvent.createSequence(function (e) {
                    if (_this.idareaventa != undefined && _this.idareaventa != -1) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                });
            }
        });

        this.addToolbarButton(btnProductos);

        let btnAjustarTienda = LOG.util.UIManager.createBtn({
            iconCls: 'ajustar',
            text: 'Ajustar tienda',
            tooltip: 'Ajustar valores en la tienda virtual',
            disabled: true,
            handler: function () {
                _this.ajustarTienda();
            },
            fnEspecialCondition: function () {
                return true;
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
                _this._cmbArea.fireEvent = _this._cmbArea.fireEvent.createSequence(function (e) {
                    if (_this.idareaventa != undefined && _this.idareaventa != -1 && _this.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                });
                _this.getGridPrincipal().getSelectionModel().fireEvent = _this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (_this.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                });
            }
        });

        this.addToolbarButton(btnAjustarTienda);

        let btnAjustarDistra = LOG.util.UIManager.createBtn({
            iconCls: 'configuracion',
            text: 'Ajustar DISTRA',
            tooltip: 'Ajustar valores en el sistema',
            disabled: true,
            handler: function () {
                _this.ajustarDistra();
            },
            fnEspecialCondition: function () {
                return true;
            },
            controlFn: function (b) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
                _this._cmbArea.fireEvent = _this._cmbArea.fireEvent.createSequence(function (e) {
                    if (_this.idareaventa != undefined && _this.idareaventa != -1 && _this.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                });
                _this.getGridPrincipal().getSelectionModel().fireEvent = _this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (_this.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                        b.enable();
                    } else {
                        b.disable();
                    }
                });
            }
        });

        this.addToolbarButton(btnAjustarDistra);

    },
    descargarProductos: function() {
        var _this = this;
        var objSubmit = {idareaventa: _this.idareaventa, idestructuraop: _this.iddeposito};//descargar por tienda
        Ext.MessageBox.wait('Descargando productos de la tienda virtual', _this.idioma.msgEspere);
        Ext.Ajax.request({
            url: 'descargarProductos',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success && resp.codigoMsg == 1) {
                    mostrarMensaje(resp.codigoMsg, 'Los productos han sido descargados satisfactoriamente');
                    _this.getStorePrincipal().load()
                }
            }.createDelegate(this)
        });
    },
    ajustarTienda: function () {
        var _this = this;
        let references = [];
        let seleccion = _this.getSmPrincipal().getSelections();
        Ext.each(seleccion, function(s) {
            references.push(s.data);
        })
        var objSubmit = {idareaventa: _this.idareaventa, references: Ext.encode(references)};//descargar por tienda
        Ext.MessageBox.wait('Ajustando productos en tienda', _this.idioma.msgEspere);
        Ext.Ajax.request({
            url: 'ajustarTienda',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success && resp.codigoMsg == 1) {
                    mostrarMensaje(resp.codigoMsg, 'Los productos han sido ajustados satisfactoriamente');
                    _this.getGridPrincipal().getStore().reload();
                }
            }.createDelegate(this)
        });
    },
    ajustarDistra: function () {
        var _this = this;
        let references = [];
        let seleccion = _this.getSmPrincipal().getSelections();
        Ext.each(seleccion, function(s) {
            references.push(s.data);
        })
        var objSubmit = {idareaventa: _this.idareaventa, iddeposito: _this.iddeposito, references: Ext.encode(references),
            disponible: _this.disponib.getValue() || null, existencia: _this.exist.getValue() || null,
            tipocriterio: _this.tipoDif.getValue() || null};//descargar por tienda
        Ext.MessageBox.wait('Ajustando productos en DISTRA', _this.idioma.msgEspere);
        Ext.Ajax.request({
            url: 'ajustarDistra',
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success && resp.codigoMsg == 1) {
                    mostrarMensaje(resp.codigoMsg, 'Los productos han sido ajustados satisfactoriamente');
                    _this.getGridPrincipal().getStore().reload();
                }
            }.createDelegate(this)
        });
    }
}
);

LOG.fac.mantenimientotienda.Devoluciones = Ext.extend(LOG.util.UITemplate, {
        seleccion: undefined,
        constructor: function(config) {
            this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.fac.mantenimientotienda.Idioma);
            this.formaVisualizacion = 'panel';
            this.dirController = '/logistica/facturacion/puntoventa/index.php/mantenimientotienda';
            this.urlBusquedaGridPrincipal = 'cargarDevoluciones';
            this.modoSeleccion = 1;
            this.busquedaBasica = true;
            this.autoLoad = false;
            this.autoSelect = false;
            this.seleccionAnterior = new Array();
            //this.gridEditable = true;
            this.modelo = new LOG.fac.mantenimientotienda.Modelo({
                idioma: config.idioma
            });
            LOG.fac.mantenimientotienda.Devoluciones.superclass.constructor.call(this, config);
        },
        init: function() {
            var _this = this;
            LOG.fac.mantenimientotienda.Devoluciones.superclass.init.call(this);

            LOG.util.UIManager.apply(this.getPanelSuperior(), {
                width: 10
            });

            this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function () {

            });
        },
        render: function() {
            var _this = this;
            var vis = LOG.fac.mantenimientotienda.Devoluciones.superclass.render.call(this);
            _this.getStorePrincipal().on({
                'beforeload': function (st) {
                    st.baseParams.idareaventa = _this.idareaventa || -1;
                    st.initBaseParams.idareaventa = _this.idareaventa || -1;
                }
            });
            _this.getGridPrincipal().on({
                'celldblclick': function ( gp, rowIndex, columnIndex, e ) {
                    if (columnIndex == 1) {
                        const copyToClipboard = async str => {
                            try {
                                await navigator.clipboard.writeText(str);
                                mostrarMensaje(1, 'No. Pedido <b>'+str+'</b> copiado al portapapeles');
                            } catch (error) {
                                console.log(error);
                            }
                        };
                        copyToClipboard(e.target.outerText)
                    }
                }
            });
            return vis;
        },
        setIdAreaVenta: function(id) {
            this.idareaventa = id;
        },
        setIdDeposito: function(id) {
            this.iddeposito = id;
        },
        initDefaultColumns: function() {
            var _this = this;
            this.addGridColumn({
                dataIndex: 'idpedidotienda',
                hidden: true
            });
            this.addGridColumn({
                dataIndex: 'idpedidodevolucion',
                hidden: true
            });
            this.addGridColumn({
                header: 'No. Pedido',
                width: 200,
                dataIndex: 'nropedido',
                filter : {
                    type : 'string',
                    emptyText : 'No. Pedido',
                    dataIndex : 'nropedido'
                }
                //default: true
            });
            this.addGridColumn({
                header: 'Fecha',
                width: 120,
                dataIndex: 'fechapedido'
            });
            this.addGridColumn({
                header: 'Beneficiario',
                width: 300,
                dataIndex: 'beneficiario',
                //default: true
            });
            this.addGridColumn(LOG.util.Prototipos.columnaImporte({
                header: 'Importe',
                width: 120,
                dataIndex: 'importe',
                align: 'right',
                default: true
            }));
            this.addGridColumn({
                header: 'Respuesta',
                width: 400,
                dataIndex: 'refund_response',
                //default: true
            });

        },
        initDefaultButtons: function() {
            var _this = this;

            let btnDevuelto = LOG.util.UIManager.createBtn({
                iconCls: 'aprobar',
                text: 'Devuelto en tienda',
                tooltip: 'Marcar pedido como devuelto por tienda virtual',
                disabled: true,
                handler: function () {
                    _this.setDevuelto()
                },
                fnEspecialCondition: function () {
                    return true;
                },
                controlFn: function (b) {
                    if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                        b.setVisible(true);
                    } else {
                        b.setVisible(false);
                    }
                    _this._cmbArea.fireEvent = _this._cmbArea.fireEvent.createSequence(function (e) {
                        if (_this.idareaventa != undefined && _this.idareaventa != -1) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    });
                }
            });

            this.addToolbarButton(btnDevuelto);

            let btnDevolver = LOG.util.UIManager.createBtn({
                iconCls: 'topizquierda',
                text: 'Devolver importe',
                tooltip: 'Devuelve el importe no devuelto de la operaci\xf3n fallida',
                disabled: true,
                handler: function () {
                    _this.devolverPedido()
                },
                fnEspecialCondition: function () {
                    return true;
                },
                controlFn: function (b) {
                    if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                        b.setVisible(true);
                    } else {
                        b.setVisible(false);
                    }
                    _this._cmbArea.fireEvent = _this._cmbArea.fireEvent.createSequence(function (e) {
                        if (_this.idareaventa != undefined && _this.idareaventa != -1) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    });
                }
            });

            this.addToolbarButton(btnDevolver);

        },
        devolverPedido: function() {
            var _this = this;
            let seleccion = _this.getSmPrincipal().getSelected()
            var objSubmit = {idareaventa: _this.idareaventa, idpedidodevolucion: seleccion.data.idpedidodevolucion};//descargar por tienda
            Ext.MessageBox.wait('Devolviendo importe', _this.idioma.msgEspere);
            Ext.Ajax.request({
                url: 'devolverPedido',
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    if (resp.success && resp.codigoMsg == 1) {
                        mostrarMensaje(resp.codigoMsg, 'El importe ha sido devuelto satisfactoriamente');
                        _this.getStorePrincipal().load()
                    }
                }.createDelegate(this)
            });
        },
        setDevuelto: function() {
            var _this = this;
            let seleccion = _this.getSmPrincipal().getSelected()
            var objSubmit = {idareaventa: _this.idareaventa, idpedidodevolucion: seleccion.data.idpedidodevolucion};//descargar por tienda
            Ext.MessageBox.wait('Marcando pedido devuelto', _this.idioma.msgEspere);
            Ext.Ajax.request({
                url: 'setDevuelto',
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    if (resp.success && resp.codigoMsg == 1) {
                        mostrarMensaje(resp.codigoMsg, 'El pedido ha sido marcado como devuelto satisfactoriamente');
                        _this.getStorePrincipal().load()
                    }
                }.createDelegate(this)
            });
        }
    }
);

LOG.fac.mantenimientotienda.Pedidos = Ext.extend(LOG.util.UITemplate, {
        seleccion: undefined,
        constructor: function(config) {
            this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.fac.mantenimientotienda.Idioma);
            this.formaVisualizacion = 'panel';
            this.dirController = '/logistica/facturacion/puntoventa/index.php/mantenimientotienda';
            this.urlBusquedaGridPrincipal = 'cargarPedidos';
            this.modoSeleccion = 1;
            this.busquedaBasica = true;
            this.autoLoad = false;
            this.autoSelect = false;
            this.seleccionAnterior = new Array();
            //this.gridEditable = true;
            this.modelo = new LOG.fac.mantenimientotienda.Modelo({
                idioma: config.idioma
            });
            LOG.fac.mantenimientotienda.Pedidos.superclass.constructor.call(this, config);
        },
        init: function() {
            var _this = this;
            LOG.fac.mantenimientotienda.Pedidos.superclass.init.call(this);

            LOG.util.UIManager.apply(this.getPanelSuperior(), {
                width: 10
            });

            this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function () {

            });
        },
        render: function() {
            var _this = this;
            var vis = LOG.fac.mantenimientotienda.Pedidos.superclass.render.call(this);
            _this.getStorePrincipal().on({
                'beforeload': function (st) {
                    st.baseParams.idareaventa = _this.idareaventa || -1;
                    st.initBaseParams.idareaventa = _this.idareaventa || -1;
                }
            });
            _this.getGridPrincipal().on({
                'celldblclick': function ( gp, rowIndex, columnIndex, e ) {
                    if (columnIndex == 1) {
                        const copyToClipboard = async str => {
                            try {
                                await navigator.clipboard.writeText(str);
                                mostrarMensaje(1, 'No. Pedido <b>'+str+'</b> copiado al portapapeles');
                            } catch (error) {
                                console.log(error);
                            }
                        };
                        copyToClipboard(e.target.outerText)
                    }
                }
            });
            return vis;
        },
        setIdAreaVenta: function(id) {
            this.idareaventa = id;
        },
        setIdDeposito: function(id) {
            this.iddeposito = id;
        },
        initDefaultColumns: function() {
            var _this = this;
            this.addGridColumn({
                dataIndex: 'idproducto',
                hidden: true
            });
            this.addGridColumn({
                header: 'C\xf3digo',
                width: 200,
                dataIndex: 'codreferencia',
                filter : {
                    type : 'string',
                    emptyText : 'C\xf3digo',
                    dataIndex : 'codreferencia'
                }
                //default: true
            });
            this.addGridColumn({
                header: 'Denominaci\xf3n',
                width: 300,
                dataIndex: 'denominacion'
            });
            this.addGridColumn({
                header: 'No. Pedido',
                width: 200,
                dataIndex: 'nropedido',
                filter : {
                    type : 'string',
                    emptyText : 'No. Pedido',
                    dataIndex : 'nropedido'
                }
                //default: true
            });
            this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
                header: 'Cantidad',
                width: 120,
                dataIndex: 'cantidad',
                align: 'right',
                default: true
            }));
            this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
                header: 'En proceso',
                width: 120,
                dataIndex: 'enproceso',
                align: 'right',
                default: true
            }));
            this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
                header: 'Cantidad pedida',
                width: 120,
                dataIndex: 'cantidadreal',
                align: 'right',
                default: true
            }));
            this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
                header: 'Existencia',
                width: 120,
                dataIndex: 'existencia',
                align: 'right',
                default: true
            }));

        },
        initDefaultButtons: function() {
            var _this = this;

            let btnReprocesar = LOG.util.UIManager.createBtn({
                iconCls: 'configuracion',
                text: 'Reprocesar',
                tooltip: 'Reprocesar pedidos no procesados completamente',
                disabled: true,
                handler: function () {
                    _this.reprocesar()
                },
                fnEspecialCondition: function () {
                    return true;
                },
                controlFn: function (b) {
                    if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                        b.setVisible(true);
                    } else {
                        b.setVisible(false);
                    }
                    _this._cmbArea.fireEvent = _this._cmbArea.fireEvent.createSequence(function (e) {
                        if (_this.idareaventa != undefined && _this.idareaventa != -1) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    });
                }
            });

            this.addToolbarButton(btnReprocesar);
        },
        reprocesar: function() {
            var _this = this;
            let seleccion = _this.getSmPrincipal().getSelected()
            var objSubmit = {idareaventa: _this.idareaventa, idproducto: (_this.getSmPrincipal().hasSelection()) ? seleccion.data.idproducto :null};//descargar por tienda
            Ext.MessageBox.wait('Reprocesando pedidos', _this.idioma.msgEspere);
            Ext.Ajax.request({
                url: 'reprocesar',
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    if (resp.success && resp.codigoMsg == 1) {
                        mostrarMensaje(resp.codigoMsg, 'Los datos han sido reprocesados satisfactoriamente');
                        _this.getStorePrincipal().load()
                    }
                }.createDelegate(this)
            });
        }
    }
);


