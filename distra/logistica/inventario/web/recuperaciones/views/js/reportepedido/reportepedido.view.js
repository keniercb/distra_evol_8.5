Ext.ns('Ext.erp.reportepedido');
Ext.erp.reportepedido = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config)
    {
        var _this = this;
        config.dirController = '/logistica/inventario/recuperaciones/index.php/lentos';
        config.urlBusquedaGridPrincipal = 'cargarPedidos';
        config.modoSeleccion = 1;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = false;
        config.idioma = {};

        Ext.erp.reportepedido.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.inv.reportepedido.Idioma);
        _this.concepto = this.idioma.productos;
        _this.textBusquedaSimple = this.idioma.txtBusquedaSimple;
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 110,
            dataIndex: 'codigoproducto',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 250,
            dataIndex: 'denomproducto',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgOperacion,
            width: 120,
            dataIndex: 'operacion',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgExistencia,
            width: 120,
            dataIndex: 'existencia',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDisponible,
            width: 100,
            dataIndex: 'disponible',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFechaUltimoMov,
            width: 150,
            dataIndex: 'fechamov',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgCantidad,
            width: 250,
            dataIndex: 'cantidad',
            default: true
        });
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(new LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            disabled: true,
            handler: function() {
                _this.getReportes(_this);
            },
            controlFn: function(b, _caller) {
                _caller.getGridPrincipal().store.fireEvent = _caller.getGridPrincipal().store.fireEvent.createSequence(function(e) {
                    if (e == 'load') {
                        if (_caller.getStorePrincipal().getCount() != 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }));
        this.addToolbarButton(new Ax.Charts.Views.ChartButton({
            waitFn: function(btn) {
                Ext.Ajax.request({
                    url: '/logistica/inventario/recuperaciones/index.php/lentos/getFecha',
                    params: {
                        dias: (_this.getGridPrincipal().toolbars[0].items.items[1].getValue()) ? _this.getGridPrincipal().toolbars[0].items.items[1].getValue() : 0
                    },
                    method: 'POST',
                    success: function(r) {
                        btn.updateQuery = function() {
                            return 'select * from mod_loginventario.f_productoslentomovimiento(' + _this.getDepositos() + ',' + null + ',' + null + ', '
                                + null + ', ' + null + ', ' + _this.getCriterio() + ', ' + idEntidad + ', ' + _this.comboDepositos.store.reader.jsonData.idsubsistema + ')';
                        }
                        btn.run();
                    }
                });
            }
        }));
        this.comboDepositos = new LOG.util.LovCombo({
            mode: 'remote',
            url: _this.dirController + '/cargardepositos',
            displayField: 'deposito',
            valueField: 'iddeposito',
            autoLoad: false
        });
        this.lbDeposito = new Ext.form.Label({
            text: _this.idioma.lbDeposito
        });
        this.addToolbarButton("->");
        this.addToolbarButton(this.lbDeposito);
        this.addToolbarButton(" ");
        this.addToolbarButton(this.comboDepositos);
        this.addToolbarButton("-");
        this.addToolbarButton(new LOG.util.Prototipos.botonAyuda({id: 'idLentoMovimiento'}));


    },
    init: function() {
        var _this = this;
        Ext.erp.reportepedido.superclass.init.call(this);
        _this.entidades = [];
        //  _this.entidadesCheck = _this.listaBotones.getItem(4).getCheckedValue();
        console.info(_this.listaBotones)
        this.comboDepositos.store.load({
            callback: function() {
                for (var i = 0; i < _this.listaBotones.getItem(5).store.data.items.length; i++) {
                    _this.entidades.push(_this.listaBotones.getItem(5).store.data.items[i].data.iddeposito);
                }
                var ents = _this.entidadesCheck ? '{' + _this.entidadesCheck + '}' : '{' + _this.entidades.join() + '}';
                _this.storePrincipal.on('beforeload', function(store) {
                    store.initBaseParams = {
                        idestructura: ents,
                        start: 0,
                        limit: null,
                        valor: 0
                    };
                });

                _this.getStorePrincipal().load()
            }

        });
        this.comboDepositos.on({
            'select': function(cb) {
                _this.entidades = [];
                _this.entidadesCheck = cb.getCheckedValue();
                for (var i = 0; i < cb.store.data.items.length; i++) {
                    _this.entidades.push(cb.store.data.items[i].data.iddeposito);
                }
                var ents = _this.entidadesCheck ? '{' + _this.entidadesCheck + '}' : '{' + _this.entidades.join() + '}';
                _this.storePrincipal.on('beforeload', function(store) {
                    store.initBaseParams = {
                        idestructura: ents,
                        start: 0,
                        limit: null,
                        valor: 0
                    };
                });
                _this.getStorePrincipal().load()
            }
        })


    },
    render: function(config) {
        var render = Ext.erp.reportepedido.superclass.render.call(this, config);
        var _this = this;


        _this.dias = new LOG.util.Prototipos.inputTexto({
            name: 'dias',
            emptyText: _this.idioma.lbDias,
            width: 100,
            maskRe: /^[0-9]+$/,
            regex: /^[0-9]+$/,
            invalidText: _this.idioma.tooltipValDiasEnt,
            enableKeyEvents: true,
            listeners: {
                'keyup': function(i, e) {
                    if (e.getKey() == 13) {
                        _this.botonBuscar();
                    }
                }
            }


        });

        _this.denominacion = new LOG.util.Prototipos.inputTexto({
            emptyText: _this.idioma.cgDenominacion,
            name: 'denominacion',
            maxLength: 255,
            minLength: 2,
            enableKeyEvents: true,
            listeners: {
                'keyup': function(i, e) {
                    if (e.getKey() == 13) {
                        _this.botonBuscar();
                    }
                }
            }

        });
        _this.btnBuscar = new Ext.Button({iconCls: 'buscar', text: this.idioma.lbBtnBuscar, tooltip: this.idioma.tooltipBuscar, disabled: false, handler: function() {
                _this.botonBuscar();
            }});
        _this.btnLimpiar = new LOG.util.Prototipos.botonLimpiar({text: this.idioma.lbBtnLimpiar, tooltip: this.idioma.tooltipLimpiar, handler: function() {
                _this.customTriggerClear();
            }});
        render.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    alt: true,
                    key: 'b',
                    fn: function() {
                        if (render.isVisible())
                            _this.botonBuscar();
                    }
                },
                {
                    alt: true,
                    key: 'l',
                    fn: function() {
                        if (render.isVisible())
                            _this.customTriggerClear();
                    }
                }
            ]);

        this.gpPrincipal.getTopToolbar().add(
            '-',
            _this.dias,
            '-',
            _this.denominacion,
            '-',
            _this.btnBuscar,
            '-',
            _this.btnLimpiar
            );
        return render;

    },
    getReportes: function(data) {
        var _this = this;
        _this.entidades = [];
        _this.entidadesCheck = _this.comboDepositos.getCheckedValue();
        for (var i = 0; i < _this.comboDepositos.store.data.items.length; i++) {
            _this.entidades.push(_this.comboDepositos.store.data.items[i].data.iddeposito);
        }
        var ents = _this.entidadesCheck ? '{' + _this.entidadesCheck + '}' : '{' + _this.entidades + '}';

        var criterioBusqueda = (this.getGridPrincipal().toolbars[0].items.items[3].getValue()) ? this.getGridPrincipal().toolbars[0].items.items[3].getValue() : null;
        Ext.Ajax.request({
            url: '/logistica/inventario/recuperaciones/index.php/lentos/getFecha',
            params: {
                dias: (_this.getGridPrincipal().toolbars[0].items.items[1].getValue()) ? _this.getGridPrincipal().toolbars[0].items.items[1].getValue() : 0
            },
            method: 'POST',
            success: function(r) {
                var result = Ext.decode(r.responseText);
                var tipoReportes = new LOG.util.Report({
                    reports: [
                        {
                            dirReport: '/distra/logistica/inventario/recuperaciones/LentosMovimientos',
                            name: 'LentosMovimientos',
                            isList: true,
                            params: {
                                arraydeposito: ents,
                                criterio: criterioBusqueda,
                                fechainicio: (result['fechainicio']) ? result['fechainicio'] : null,
                                fechafin: (result['fechafin']) ? result['fechafin'] : null,
                                idestructura: idEntidad,
                                idsubsistema: _this.comboDepositos.store.reader.jsonData.idsubsistema,
                                start: 0,
                                limit: null
                            }
                        }
                    ]
                });
                tipoReportes.view();
            }
        });



    },
    getDepositos: function() {
        var _this = this;
        _this.entidades = [];
        _this.entidadesCheck = _this.comboDepositos.getCheckedValue();
        for (var i = 0; i < _this.comboDepositos.store.data.items.length; i++) {
            _this.entidades.push(_this.comboDepositos.store.data.items[i].data.iddeposito);
        }
        return _this.entidadesCheck ? '{' + _this.entidadesCheck + '}' : '{' + _this.entidades + '}';
    },
    getCriterio: function() {
        return (this.getGridPrincipal().toolbars[0].items.items[3].getValue()) ? this.getGridPrincipal().toolbars[0].items.items[3].getValue() : null;
    },
    botonBuscar: function() {
        var _this = this;
        _this.getStorePrincipal().filtrado = true;
        if (_this.dias.isValid()) {
            if (_this.getGridPrincipal().toolbars[0].items.items[1].getValue() == 0 && _this.getGridPrincipal().toolbars[0].items.items[3].getValue() == 0) {
                mostrarMensaje(1, _this.idioma.msgInfDatosE);
            }
            else {
                _this.getStorePrincipal().load();
            }

        } else {
            mostrarMensaje(1, _this.idioma.msgInfDatosH);
        }


    },
    customTriggerClear: function() {
        var _this = this;
        _this.getGridPrincipal().toolbars[0].items.items[1].reset();
        _this.getGridPrincipal().toolbars[0].items.items[3].reset();

        _this.storePrincipal.on('beforeload', function(store) {
            store.baseParams = {
                idestructura: idEntidad,
                dias: null,
                denominacion: null,
                start: 0,
                limit: null
            };
        });
        _this.getStorePrincipal().load();
    }

});