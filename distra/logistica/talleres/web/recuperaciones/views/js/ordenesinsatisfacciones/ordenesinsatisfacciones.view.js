Ext.ns('Ext.erp.ordenesinsatisfacciones');
Ext.erp.ordenesinsatisfacciones = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        config.dirController = '/logistica/talleres/recuperaciones/index.php/ordenesinsatisfacciones';
        config.urlBusquedaGridPrincipal = 'getOrdenesInsatisfacciones';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.idioma = {};
        Ext.erp.ordenesinsatisfacciones.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.tall.ordenesinsatisfacciones.Idioma);
        this.rowexpander = this.idioma.txtDescReclamaciones + ': ' + '{reclamaciones}';

    },
    render: function(config) {
        var render = Ext.erp.ordenesinsatisfacciones.superclass.render.call(this, config);
        var _this = this;
        _this.textDesde = new Ext.form.DateField({
            width: 100,
            editable: false,
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'desdeOI',
            endDateField: 'hastaOI'
        });

        _this.textHasta = new Ext.form.DateField({
            width: 100,
            editable: false,
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hastaOI',
            endDateField: 'desdeOI'
        });
        _this.textDesde.endDateField = _this.textHasta.id; //-------validacion de fecha
        _this.textHasta.startDateField = _this.textDesde.id;

        _this.btnBuscarOrden = new LOG.util.Prototipos.botonBuscar({
            text: this.idioma.lbBtnBuscar,
            tooltip: this.idioma.ttBtnBuscarR,
            handler: function() {
                _this.btnBuscar();
            }});
        _this.btnLimpiarOrden = new LOG.util.Prototipos.botonLimpiar({text: this.idioma.lbBtnLimpiar, tooltip: this.idioma.ttBtnLimpiar, handler: function() {
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
            _this.btnBuscarOrden,
            '-',
            _this.btnLimpiarOrden
            );
        this.getStorePrincipal().on({
            load:function(){
                if(_this.getStorePrincipal().getCount() == 0 ){
                    if(!_this.getStorePrincipal().filtrado){
                        mostrarMensaje(1, _this.idioma.msgInfDatosB);
                    }
                }
            }
        });

        return render;

    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: this.idioma.cgMedio,
            width: 350,
            align: 'center',
            dataIndex: 'medio',
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
            header: this.idioma.cgIdentificador,
            width: 250,
            dataIndex: 'atributoidentificador',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgNumOrden,
            width: 100,
            align: 'center',
            dataIndex: 'nroorden',
            default: true
        });
        this.addGridColumn({
            width: 100,
            hidden: true,
            align: 'center',
            dataIndex: 'reclamaciones',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCantReclamaciones,
            width: 600,
            align: 'center',
            dataIndex: 'cantidadreclamaciones',
            default: true
        });

    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(new LOG.util.Prototipos.botonImprimir({
            tooltip: _this.idioma.ttImprimir,
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
            //            controlFn: function(b, _caller) {
//                if (_caller.grantedAction('RB')) {
//                    b.setVisible(true);
//                } else {
//                    b.setVisible(false);
//                }
//            }
        }));
        this.addToolbarButton("->");
        this.addToolbarButton(new LOG.util.Prototipos.botonAyuda({
            tooltip: this.idioma.ttAyuda,
            id: 'ayudareclamaciones'
        }));

    },
    getReportes: function(data) {
        var _this = this;
        var desdeOI = (_this.textDesde.getValue()) ? _this.textDesde.getValue().format('d-m-Y') : null;
        var hastaOI = (_this.textHasta.getValue()) ? _this.textHasta.getValue().format('d-m-Y') : null;
        _this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/talleres/recuperaciones/Reclamaciones',
                    name: 'Reclamaciones',
                    isList: true,
                    params: {
                        fechainicio: desdeOI,
                        fechafin: hastaOI,
                        estadodocumento: '{5}',
						idestructura:idEntidad,
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
            _this.storePrincipal.initBaseParams.fechaentrega = (hasta) ? hasta : null;
            _this.storePrincipal.initBaseParams.start = 0;
            _this.storePrincipal.initBaseParams.limit = 30;
            _this.getStorePrincipal().filtrado = true;
            _this.getStorePrincipal().load();

        }
    },
    customTriggerClear: function() {
        var _this = this;
        if(_this.textHasta.getValue() || _this.textDesde.getValue()) {
            _this.textDesde.reset();
            _this.textHasta.reset();
            _this.storePrincipal.initBaseParams.fechainicio = null;
            _this.storePrincipal.baseParams.fechainicio = null;
            _this.storePrincipal.initBaseParams.fechaentrega = null;
            _this.storePrincipal.baseParams.fechaentrega = null;
            _this.getStorePrincipal().filtrado = false;
            _this.getStorePrincipal().load();

        }
    }

});