Ext.ns('LOG.lb.ubicacion');
LOG.lb.ubicacion.proceso = Ext.extend(LOG.util.UITemplate, {
    cantidadAlternativa: false,
    constructor: function(config) {
        config.idioma = LOG.util.UIManager.apply(LOG.lb.ubicacion.Idioma, LOG.util.Idioma);
        this.formaVisualizacion = 'ventana';
        this.busquedaBasica = true;
        this.autoSelect = false;
        this.concepto = config.idioma.ttBuscarUbicacion;
        this.modoSeleccion = 1;
        // this.panelBotonesVisible = false;
        this.autoLoad = false;
        this.gridEditable = true;
        this.textBusquedaSimple = config.idioma.lbTxtBuscar;
        this.dirController = '/logistica/utiles/ubicacion/index.php/ubicacion';
        this.urlBusquedaGridPrincipal = 'cargarUbicacionesProducto';
        LOG.lb.ubicacion.proceso.superclass.constructor.call(this, config);
        this.modelo = new LOG.lb.ubicacion.Model({
            idioma: this.idioma,
            urlController: '/logistica/utiles/ubicacion/index.php/ubicacion/'
        });
    },
    init: function() {
        var _this = this;
        LOG.lb.ubicacion.proceso.superclass.init.call(this);
        this.getVistaPrincipal().title = _this.idioma.tvtnDesubicar;
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().setSize(640, 320);
    },
    initDefaultButtons: function() {
        var _this = this;
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.addToolbarButton("->");
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({
            id: 'idDesubicar'
        }));
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
            disabled: true,
            handler: function() {
                var records = _this.storePrincipal.getModifiedRecords();
                var listaU = new Array();
                var cant = 0;
                records.forEach(function(elem, index) {
                    cant += elem.get('cantidada');
                    var data = {
                        cantidad: elem.get('cantidada'),
                        idproducto: _this.record.idproducto,
                        idubicacionproducto: elem.get('idubicacionproducto'),
                        idubicacion: elem.get('idubicacion'),
                        idarea: elem.get('idarea'),
                        idareaproducto: elem.get('idareaproducto'),
                        idmovimiento: _this.record.idmovimiento,
                        iddocumento: _this.record.iddocumento,
                        bandUbicar: false,
                        proceso: true,
                        ubicar: true,
                        idprodtransfinterna: _this.record.idprodtransfinterna,
                    };
                    listaU.push(data);
                });
                _this.getCantidadTotal(cant);
                if (listaU.length > 0) {
                    _this.modelo.desubicarProductos(listaU, function() {
                        _this.getVistaPrincipal().close();
                        _this._postDesubicarFn();
                    });
                } else {
                    mostrarMensaje(2, _this.idioma.msgValoresInconrecto);
                }
            }
        });

    },
    _postDesubicarFn: function() {
        return true;
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: this.idioma.cgArea,
            name: 'area',
            dataIndex: 'area',
            width: 120,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUbicacion,
            name: 'ubicacion',
            dataIndex: 'ubicacion',
            autoExpand: true,
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgCantidad,
            name: 'cantidad',
            dataIndex: 'cantidad',
            align: 'right',
            width: 120,
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgDisponible,
            dataIndex: 'disponible',
            align: 'right',
            width: 120,
            default: true
        }));
        if (this.cantidadAlternativa) {
            var tipo = this.record.decimales == '0' ? 'inputEntero' : 'inputDecimal';
            this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
                header: this.idioma.cgCantidadADesubicar,
                name: 'cantidada',
                width: 130,
                dataIndex: 'cantidada',
                align: 'right',
                editor: LOG.util.Prototipos[tipo]({}),
                renderer: function(_v, _mD, _r) {
                    _r.data.cantidada = _v || 0;
                    return _r.data.cantidada;
                },
                default: true
            }));
        }

        this.addGridColumn({dataIndex: 'idubicacionproducto'});
        this.addGridColumn({dataIndex: 'idarea'});
        this.addGridColumn({dataIndex: 'idareaproducto'});
        this.addGridColumn({dataIndex: 'idubicacion'});
    },
    render: function() {
        var _this = this;
        var vista = LOG.lb.ubicacion.proceso.superclass.render.call(this);
        this.cantidadUbicada = 0;
        this.getStorePrincipal().on({
            beforeload: function() {
                this.rejectChanges();
                Ext.apply(this.initBaseParams, {
                    idproducto: _this.record.idproducto,
                    idmovimiento: _this.record.idmovimiento,
                    idprodtransfinterna: _this.record.idprodtransfinterna,
                    desubicar: _this.desubicar || null
                });
                _this.modelo.habilitarBotones(true);
            },
            load: function(_st, _r) {
                Ext.each(_r, function(item) {
                    _this.cantidadUbicada += parseFloat(item.data.cantidad);
                });
                _this.modelo.habilitarBotones(true);
            }
        });
        this.getStorePrincipal().load();

        this.getGridPrincipal().on({
            beforeedit: function(o) {
                o.record.data.tempcantidada = o.record.data.cantidada;
            },
            afteredit: function(o) {
                if (o.field == 'cantidada') {
                    if (parseFloat(o.value) > parseFloat(o.record.json.cantidada) + parseFloat(o.record.data.disponible)) {
                        o.record.data.cantidada = o.record.data.tempcantidada;
                        mostrarMensaje(2, _this.idioma.msgDesubicarCant);
                    } else {
                        var desubicar = 0, error = false;
                        _this.getStorePrincipal().each(function(item) {
                            desubicar += parseFloat(item.data.cantidada);
                            if (desubicar > _this.record.cantidad) {
                                o.record.data.cantidada = o.record.data.tempcantidada;
                                error = true;
                            }
                        });
                    }
                    if (error) {
                        mostrarMensaje(2, _this.idioma.msgDesubicarCantMov);
                    }
                    _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                    o.grid.view.refresh();
                }
            }
        });
        return vista;
    },
    getCantidadTotal: function(res) {
        return res;
    }
});