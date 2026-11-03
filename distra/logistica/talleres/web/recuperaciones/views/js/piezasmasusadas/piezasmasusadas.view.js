Ext.ns('Ext.erp.piezasmasusadas');
Ext.erp.piezasmasusadas = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        config.dirController = '/logistica/talleres/recuperaciones/index.php/piezasmasusadas';
        config.urlBusquedaGridPrincipal = 'getPiezasMasUsadas';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.idioma = {};
        Ext.erp.piezasmasusadas.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.tall.piezasmasusadas.Idioma);
    },
    render: function(config) {
        var render = Ext.erp.piezasmasusadas.superclass.render.call(this, config);
        var _this = this;
        _this.textDesde = new Ext.form.DateField({
            width: 100,
            editable: false,
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'desdePM',
            endDateField: 'hastaPM'
        });

        _this.textHasta = new Ext.form.DateField({
            width: 100,
            editable: false,
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hastaPM',
            endDateField: 'desdePM'
        });
        _this.textDesde.endDateField = _this.textHasta.id; //-------validacion de fecha
        _this.textHasta.startDateField = _this.textDesde.id;

        _this.btnBuscarPiezasMas = new LOG.util.Prototipos.botonBuscar({
            text: this.idioma.lbBtnBuscar,
            tooltip: this.idioma.ttBtnBuscarP,
            handler: function() {
                _this.btnBuscar();
            }});
        _this.btnLimpiarPiezasMas = new LOG.util.Prototipos.botonLimpiar({text: this.idioma.lbBtnLimpiar, tooltip: this.idioma.ttBtnLimpiar, handler: function() {
                _this.customTriggerClear();
            }});
        this.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    alt: true,
                    key: 'b',
                    fn: function() {
                        if (render.isVisible())
                            _this.btnBuscar();
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
            new Ext.form.Label({text: _this.idioma.cgDesde}),
            _this.textDesde,
            '-',
            new Ext.form.Label({text: _this.idioma.cgHasta}),
            _this.textHasta,
            '-',
            _this.btnBuscarPiezasMas,
            '-',
            _this.btnLimpiarPiezasMas
            );

        return render;

    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: this.idioma.cgPieza,
            width: 300,
            dataIndex: 'denominacion',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgMarca,
            width: 250,
            dataIndex: 'marca',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgModelo,
            width: 250,
            dataIndex: 'modelo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 150,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCantidad,
            width: 90,
            align: 'center',
            dataIndex: 'cantidad',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUM,
            width: 90,
            align: 'center',
            dataIndex: 'umedida',
            default: true
        });
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(new LOG.util.Prototipos.botonImprimir({
            disabled: true,
            tooltip: this.idioma.ttImprimir,
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
        this.addToolbarButton("->");
        this.addToolbarButton(new LOG.util.Prototipos.botonAyuda({
            tooltip: this.idioma.ttAyuda,
            id: 'ayudapiezas'
        }));

    },
    getReportes: function(data) {
        var _this = this;
        var desdePM = (_this.textDesde.getValue()) ? _this.textDesde.getValue().format('d-m-Y') : null;
        var hastaPM = (_this.textHasta.getValue()) ? _this.textHasta.getValue().format('d-m-Y') : null;
        _this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/talleres/recuperaciones/PiezasMasUsadas',
                    name: 'PiezasMasUsadas',
                    isList: true,
                    params: {
                        fechainicio: desdePM,
                        fechafin: hastaPM,
                        idsubsistema: _this.storePrincipal.reader.jsonData.idsubsistema
                    }
                }
            ]
        }).view();
    },
    getDateDesde: function() {
        return (this.textDesde.getValue()) ? this.textDesde.getValue().format('d-m-Y') : null;
    },
    getDateHasta: function() {
        return (this.textHasta.getValue()) ? this.textHasta.getValue().format('d-m-Y') : null;
    },
    btnBuscar: function() {
        var _this = this;
        var desde = _this.textDesde.getValue();
        var hasta = _this.textHasta.getValue();
        if(desde || hasta) {
            _this.storePrincipal.initBaseParams.fechainicio = (desde) ? desde : null;
            _this.storePrincipal.initBaseParams.fechafin = (hasta) ? hasta : null;
            _this.storePrincipal.initBaseParams.start = 0;
            _this.storePrincipal.initBaseParams.limit = 30;
            _this.getStorePrincipal().load();
            _this.getStorePrincipal().filtrado = true;
        }

    },
    customTriggerClear: function() {
        var _this = this;
        if(_this.textDesde.getValue() || _this.textHasta.getValue()) {
            _this.textDesde.reset();
            _this.textHasta.reset();
            _this.storePrincipal.initBaseParams.fechainicio = null;
            _this.storePrincipal.baseParams.fechainicio = null;
            _this.storePrincipal.initBaseParams.fechafin = null;
            _this.storePrincipal.baseParams.fechafin = null;
            _this.getStorePrincipal().load();
            _this.getStorePrincipal().filtrado = false;
        }

    }

});