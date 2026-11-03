Ext.ns('Ext.erp.garantia');

Ext.erp.garantia = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        config.dirController = '/logistica/talleres/recuperaciones/index.php/garantia';
        config.urlBusquedaGridPrincipal = 'getOrdenesGarantia';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        this.idioma = {};
        Ext.erp.garantia.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.tall.garantia.Idioma);
        this.rowexpander = ['<p><b>No. Orden: </b>{nrodoc}</p>', '<p><b>Fallas detectadas: </b><br>{dictamentecnico}</p><br>'];


    },
    render: function(config) {
        var render = Ext.erp.garantia.superclass.render.call(this, config);
        var _this = this;

        _this.textDesde = new Ext.form.DateField({
            width: 150,
            editable: false,
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'desdeG',
            endDateField: 'hastaG'
        });

        _this.textHasta = new Ext.form.DateField({
            width: 150,
            editable: false,
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hastaG',
            endDateField: 'desdeG'
        });
        _this.textDesde.endDateField = _this.textHasta.id; //-------validacion de fecha
        _this.textHasta.startDateField = _this.textDesde.id;
        _this.btnBuscarServ = new LOG.util.Prototipos.botonBuscar({
            text: this.idioma.lbBtnBuscar,
            tooltip: this.idioma.ttBuscar,
            handler: function() {
                _this.btnBuscar();
            }
        });
        _this.btnLimpiarServ = new LOG.util.Prototipos.botonLimpiar({
            text: this.idioma.lbBtnLimpiar,
            tooltip: this.idioma.ttBtnLimpiar,
            handler: function() {
                _this.customTriggerClear();
            }
        });

        render.documentKeyMap = new Ext.KeyMap(document,
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
        this.gpPrincipal.getTopToolbar().add('-', new Ext.form.Label({text: _this.idioma.cgDesde}), _this.textDesde,
            '-', new Ext.form.Label({text: _this.idioma.cgHasta}), _this.textHasta, '-', _this.btnBuscarServ, '-', _this.btnLimpiarServ);
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
            dataIndex: 'nrodoc',
            hidden: true
        });//1

        this.addGridColumn({
            dataIndex: 'descripcionmarcamodelo',
            header: this.idioma.cgMedio,
            width: 350,
            default: true,
            id: 'piezas'
        });//2

        this.addGridColumn({
            dataIndex: 'marca',
            header: this.idioma.cgMarca,
            width: 250,
            default: true,
            renderer: function(val) {
                var resul = (val == null) ? '-' : val;
                return resul;
            }
        });//3

        this.addGridColumn({
            dataIndex: 'modelo',
            header: this.idioma.cgModelo,
            width: 250,
            default: true,
            renderer: function(val) {
                var resul = (val == null) ? '-' : val;
                return resul;
            }
        });//4

        this.addGridColumn({
            dataIndex: 'atributoidentificador',
            header: this.idioma.cgIdentificador,
            width: 250,
            default: true,
            renderer: function(val) {
                var resul = (val == "") ? '-' : val;
                return resul;
            }
        });//5

        this.addGridColumn({
            dataIndex: 'vigenciagarantia',
            header: this.idioma.cgVigencia,
            width: 200,
            default: true,
            renderer: function(val) {
                var resul = (val == null) ? '-' : val;
                return resul;
            }
        });//6

        this.addGridColumn({
            dataIndex: 'iniciogarantia',
            header: this.idioma.cgInicio,
            width: 200,
            default: true,
            renderer: function(val) {
                var resul = (val == null) ? '-' : val;
                return resul;
            }
        });//7

        this.addGridColumn({
            dataIndex: 'fingarantia',
            header: this.idioma.cgFin,
            width: 200,
            default: true,
            renderer: function(val) {
                var resul = (val == null) ? '-' : val;
                return resul;
            }
        });//8

        this.addGridColumn({
            dataIndex: 'dictamentecnico',
            hidden: true
        });//9
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
        this.addToolbarButton("->");
        this.addToolbarButton(new LOG.util.Prototipos.botonAyuda({
            id: 'ayudaGarantia',
            tooltip: this.idioma.ttAyuda
        }));

    },
    getReportes: function(data) {
        var _this = this;
        var desde = this.getDateDesde();
        var hasta = this.getDateHasta();
        _this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/talleres/recuperaciones/GarantiaTaller',
                    isList: true,
                    params: {
                        fechainicio: desde,
                        fechafin: hasta,
                        estado: '{5,6,7,8}',
                        idestructuracomun: idEntidad
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
            _this.getStorePrincipal().filtrado = true;
            _this.getStorePrincipal().load();
        }
    },
    customTriggerClear: function() {
        var _this = this;
        if(_this.textDesde.getValue() || _this.textHasta.getValue() ) {
            _this.textDesde.reset();
            _this.textHasta.reset();
            _this.storePrincipal.initBaseParams.fechainicio = null;
            _this.storePrincipal.baseParams.fechainicio = null;
            _this.storePrincipal.initBaseParams.fechafin = null;
            _this.storePrincipal.baseParams.fechafin = null;
            _this.getStorePrincipal().filtrado = false;
            _this.getStorePrincipal().load();
        }
    }
});

