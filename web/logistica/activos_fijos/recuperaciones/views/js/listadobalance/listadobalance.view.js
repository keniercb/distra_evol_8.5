Ext.ns('LOG.aft.listadobalance');
LOG.aft.listadobalance.view = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        var _this = this;
        config.dirController = '/logistica/activos_fijos/recuperaciones/index.php/listadobalance';
        config.urlBusquedaGridPrincipal = 'cargarDatos';
        config.modoSeleccion = 1;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = true;
        config.idioma = {};

        LOG.aft.listadobalance.view.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, LOG.aft.listadobalance.Idioma);
        _this.concepto = '';
        _this.textBusquedaSimple = ''/*this.idioma.txtBusquedaSimple*/;
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: this.idioma.cgCuenta,
            width: 350,
            dataIndex: 'concatcta',
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgValotContable,
            width: 250,
            dataIndex: 'saldo',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgValorInventario,
            align: 'right',
            width: 250,
            dataIndex: 'valor',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: 'Diferencia',
            align: 'right',
            width: 250,
            dataIndex: 'valor',
            renderer :function(r, c,d){
                return d.json.saldo - d.json.valor;
            },
            default: true
        }));
    },
    initDefaultButtons: function () {
        var _this = this;  
        this.addToolbarButton(new LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            disabled: true,
            handler: function () {
                _this.getReportes(_this);
            },
            controlFn: function (b, _caller) {
                _caller.getGridPrincipal().store.fireEvent = _caller.getGridPrincipal().store.fireEvent.createSequence(function (e) {
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
        /*this.comboDepositos = new LOG.util.LovCombo({
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
        this.addToolbarButton(this.comboDepositos);*/
        this.addToolbarButton("->");
        this.addToolbarButton("-");
        this.addToolbarButton(new LOG.util.Prototipos.botonAyuda({id: 'idbalancecontable'}));


    },
	init: function() {
        var _this = this;
        LOG.aft.listadobalance.view.superclass.init.call(this);

        this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function() {

            /*
			_this.gridMovimietos = new Log.aft.submayor.ViewGridMovRegNumActivos({
                idioma: _this.idioma
            });
            _this.gridMovimietos.init();

			
            _this.panelSur = new LOG.util.UIManager.initPanel({
                animCollapse: false,
                collapsible: true,
                collapsed: false,
                region: 'south',
                layout: 'fit',
                height: 500,
                split: true,
                frame: true,
                title: _this.idioma.lbTitleRnMovimientos,
                titleCollapse: true,
                collapseMode: 'mini'
            });

            _this.panelSur.add(_this.gridMovimietos.view());
            _this.getPanelPrincipal().add(_this.panelSur);
			*/
            Ext.apply(_this.gpPrincipal, {
                viewConfig: {
                    getRowClass: function(rec, index, rowParams, store) {
						console.info(rec.data);
						if (rec.data.saldo !==  rec.data.valor)
                            return 'redrow-text';
						else if(rec.data.saldo == rec.data.valor && rec.data.saldo != 0)
							return 'greenrow-text';
                    }
                }
            });

        });
    },
    getReportes: function (data) {
        var _this = this;

        Ext.Ajax.request({
            url: '/logistica/activos_fijos/recuperaciones/index.php/listadobalance/cargarEjercicioContabilidad',
            method: 'POST',
            callback: function (opt, scs, resp) {
                Ext.getBody().unmask();
                data = Ext.decode(resp.responseText);
                console.info(data);
                if (data.idejerciciocontabilidad) {
                    var tipoReportes = new LOG.util.Report({
                        reports: [{
                            dirReport: '/distra/logistica/activofijo/Recuperaciones/BalanceContableListado',
                            name: 'BalanceContableListado',
                            isList: true,
                            params: {
                                idestructura: idEntidad,
                                idejerciciocontabilidad: +data.idejerciciocontabilidad
                            }
                        }]
                    });
                    tipoReportes.view();
                }
            }
        });
    },
    getDepositos: function () {
        var _this = this;
        _this.entidades = [];
        _this.entidadesCheck = _this.comboDepositos.getCheckedValue();
        for (var i = 0; i < _this.comboDepositos.store.data.items.length; i++) {
            _this.entidades.push(_this.comboDepositos.store.data.items[i].data.iddeposito);
        }
        var value = _this.entidadesCheck ? '{' + _this.entidadesCheck + '}' : '{' + _this.entidades + '}';
        return "'" + value + "'";
    },
    getCriterio: function () {
        return this.denominacion.getValue() || null;
    },
    botonBuscar: function () {
        if (this.denominacion.isDirty() || this.dias.isDirty()) {
            var _this = this;
            _this.getStorePrincipal().filtrado = true;
            _this.getStorePrincipal().load({
                params: {
                    valor: _this.dias.getValue(),
                    denominacion: _this.denominacion.getValue()
                }
            });
        }
    },
    customTriggerClear: function () {
        if (this.denominacion.isDirty() || this.dias.isDirty()) {
            var _this = this;
            _this.dias.reset();
            _this.denominacion.reset();

            _this.storePrincipal.on('beforeload', function (store) {
                store.baseParams = {
                    idestructura: idEntidad,
                    valor: 0,
                    denominacion: null,
                    start: 0,
                    limit: null
                };
            });
            _this.getStorePrincipal().load();
        }
    }

});