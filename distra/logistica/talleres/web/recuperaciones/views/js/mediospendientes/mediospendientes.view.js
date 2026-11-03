Ext.ns('Ext.erp.mediospendientes');
Ext.erp.mediospendientes = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        config.dirController = '/logistica/talleres/recuperaciones/index.php/mediospendientes';
        config.urlBusquedaGridPrincipal = 'getMediosPendientes';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.idioma = {};
        Ext.erp.mediospendientes.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.tall.mediospendientes.Idioma);
        this.rowexpander = this.idioma.txtPiezas + ': ' + '{piezas}';
    },
    render: function(config) {
        var render = Ext.erp.mediospendientes.superclass.render.call(this, config);
        var _this = this;

        _this.textDesde = new Ext.form.DateField({
            width: 100,
            editable: false,
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'desdeMP',
            endDateField: 'hastaMP'
        });

        _this.textHasta = new Ext.form.DateField({
            width: 100,
            editable: false,
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hastaMP',
            endDateField: 'desdeMP'
        });
        _this.textDesde.endDateField = _this.textHasta.id; //-------validacion de fecha
        _this.textHasta.startDateField = _this.textDesde.id;

        _this.btnBuscarMedio = new LOG.util.Prototipos.botonBuscar({
            text: this.idioma.lbBtnBuscar,
            tooltip: this.idioma.ttBtnBuscarM,
            handler: function() {
                _this.btnBuscar();
            }
        });
        _this.btnLimpiarMedio = new LOG.util.Prototipos.botonLimpiar({
            text: this.idioma.lbBtnLimpiar,
            tooltip: this.idioma.ttBtnLimpiar,
            handler: function() {
                _this.customTriggerClear();
            }
        });
        render.documentKeyMap = new Ext.KeyMap(document,
            [{
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
                }]);
        this.gpPrincipal.getTopToolbar().add('-', new Ext.form.Label({text: _this.idioma.cgDesde}), _this.textDesde,
            '-', new Ext.form.Label({text: _this.idioma.cgHasta}), _this.textHasta, '-', _this.btnBuscarMedio, '-', _this.btnLimpiarMedio);
        this.getStorePrincipal().on({
            load:function(){
                if(_this.getStorePrincipal().getCount() == 0 ){
                    if(!_this.getStorePrincipal().filtrado){
                        mostrarMensaje(1, _this.idioma.msgInfDatosB);
                    }
                }
            }
        })
        return render;

    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: this.idioma.cgNumOrden,
            width: 120,
            dataIndex: 'nrodoc',
            default: true
        });
        this.addGridColumn({
            header: 'piezas',
            hidden: true,
            width: 120,
            dataIndex: 'piezas',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgMedio,
            width: 250,
            dataIndex: 'producto',
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
            dataIndex: 'atributoidentificador',
            header: this.idioma.cgIdentificador,
            width: 250,
            default: true,
            renderer: function(val) {
                var resul = (val == "") ? '-' : val;
                return resul;
            }
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
        this.addToolbarButton("->");
        this.addToolbarButton(new LOG.util.Prototipos.botonAyuda({
            tooltip: this.idioma.ttAyuda,
            id: 'ayudamediospendientes'
        }));

    },
    getReportes: function(data) {
        var _this = this;

        var desdeMP = (_this.textDesde.getValue()) ? _this.textDesde.getValue().format('d-m-Y') : null;
        var hastaMP = (_this.textHasta.getValue()) ? _this.textHasta.getValue().format('d-m-Y') : null;
        this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/talleres/recuperaciones/MediosPendientes',
                    name: 'MediosPendientes',
                    isList: true,
                    params: {
                        idestructuracomun: idEntidad,
                        fechainicio: desdeMP,
                        fechafin: hastaMP,
                        estadodocumento: '{' + LOG.lb.documento.Estado.ELAB + ',' + LOG.lb.documento.Estado.PREP + '}',
                        estadoorden: 1,
                        estadomedio: 1,
                        idsubsistema: _this.storePrincipal.reader.jsonData.idsubsistema
                    }
                }
            ]
        });
        this.tipoReportes.view();
    },
    btnBuscar: function() {
        var _this = this;
        var fechainicio = _this.textDesde.getValue();
        var fechaentrega = _this.textHasta.getValue();
        if(fechainicio || fechaentrega) {
            _this.storePrincipal.initBaseParams.fechainicio = (fechainicio) ? fechainicio : null;
            _this.storePrincipal.initBaseParams.fechaentrega = (fechaentrega) ? fechaentrega : null;
            _this.storePrincipal.initBaseParams.start = 0;
            _this.storePrincipal.initBaseParams.limit = 30;
            _this.getStorePrincipal().filtrado = true;
            _this.getStorePrincipal().load();

        }
    },
    customTriggerClear: function() {
        var _this = this;
        if(_this.textDesde.getValue() || _this.textHasta.getValue()) {
            _this.textDesde.reset();
            _this.textHasta.reset();
            _this.storePrincipal.initBaseParams.fechainicio = null;
            _this.storePrincipal.baseParams.fechainicio = null;
            _this.storePrincipal.initBaseParams.fechaentrega = null;
            _this.storePrincipal.baseParams.fechaentrega = null;
            _this.getStorePrincipal().filtrado = false;
            _this.storePrincipal.load();

        }
    }

});