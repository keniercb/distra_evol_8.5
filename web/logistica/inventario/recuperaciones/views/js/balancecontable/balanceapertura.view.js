Ext.ns('Ext.erp.balanceapertura');
Ext.erp.balanceapertura = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        var _this = this;
        config.dirController = '/logistica/inventario/recuperaciones/index.php/balancecontable';
        config.urlBusquedaGridPrincipal = 'cargarBalanceApertura';
        config.modoSeleccion = 1;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = true;
        config.idioma = {};

        Ext.erp.balanceapertura.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.inv.balancecontable.Idioma);
        _this.concepto = '';
        _this.textBusquedaSimple = '';
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            header: this.idioma.cgCuenta,
            width: 350,
            dataIndex: 'cuenta',
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
            header: this.idioma.cgValorInventario + ' ' +codigoContable,
            align: 'right',
            width: 250,
            dataIndex: 'saldoinvcup',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgValorInventario + ' ' +codigoAlternativa ,
            align: 'right',
            width: 250,
            dataIndex: 'saldoinvcuc',
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
        this.addToolbarButton("->");
        this.addToolbarButton("-");
        this.addToolbarButton(new LOG.util.Prototipos.botonAyuda({id: 'idbalancecontable1'}));
    },
   
    getReportes: function (data) {
        var _this = this;
        console.log(_this.getStorePrincipal());
        var uiReport = new LOG.util.Report({
            reports: [{
                  dirReport: '/distra/logistica/inventario/recuperaciones/BalanceContableAperturaListado',
                  name: 'BalanceContableAperturaListado',
                  isList: true,
                  params: {
                        idestructura: idEntidad,
                        iddoc: _this.getStorePrincipal().reader.jsonData.iddoc
                  }
            }]
        });
        uiReport.view();
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