Ext.ns('Ext.erp.valordepositos');
Ext.erp.valordepositos = Ext.extend(LOG.util.UITemplate, {
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        var _this = this;
        config.dirController = '/logistica/inventario/recuperaciones/index.php/valordepositos';
        config.urlBusquedaGridPrincipal = 'cargarDepositos';
        config.modoSeleccion = 1;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.idioma = {};
        Ext.erp.valordepositos.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.inv.valordepositos.Idioma);
        _this.concepto = this.idioma.depositos;
        _this.textBusquedaSimple = this.idioma.txtBusquedaSimple;
        _this.criterio = null;
    },
    initDefaultColumns: function () {
        this.addGridColumn({dataIndex: 'iddeposito'});
        this.addGridColumn({
            header: this.idioma.cgDepositos,
            dataIndex: 'deposito',
            width: 220,     
            //autoExpand: true,
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgInicial + (alternativa ? ' ' + codigoContable : ''),
            dataIndex: 'apertura',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgInicial + ' ' + codigoAlternativa,
            hidden: !alternativa,
            dataIndex: 'aperturaalt',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgCompras + (alternativa ? ' ' + codigoContable : ''),
            dataIndex: 'compras',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgCompras + ' ' + codigoAlternativa,
            hidden: !alternativa,
            dataIndex: 'comprasalt',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgVentas + (alternativa ? ' ' + codigoContable : ''),
            dataIndex: 'ventas',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgVentas + ' ' + codigoAlternativa,
            dataIndex: 'ventasalt',
            hidden: !alternativa,
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgGastos + (alternativa ? ' ' + codigoContable : ''),
            dataIndex: 'gastos',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgGastos + ' ' + codigoAlternativa,
            hidden: !alternativa,
            dataIndex: 'gastosalt',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgAjustes + (alternativa ? ' ' + codigoContable : ''),
            dataIndex: 'ajustes',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: this.idioma.cgAjustes + ' ' + codigoAlternativa,
            hidden: !alternativa,
            dataIndex: 'ajustesalt',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgReevaluacion,
            dataIndex: 'reevaluacion',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgImporte + (alternativa ? ' ' + codigoContable : ''),
            dataIndex: 'importe',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgImporte + ' ' + codigoAlternativa,
            hidden: !alternativa,
            dataIndex: 'importealternativo',
            align: 'right',
            default: true
        }));
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton('Fecha:');
        this.addToolbarButton(new Ext.form.DateField({
            width: 160,
            maxValue: fechaContableINV,
            listeners: {
                select: function (df, v) {
                    _this.getStorePrincipal().initBaseParams.fecha = v;
                    _this.criterio = v;
                    _this.getStorePrincipal().reload();
                }
            }
        }));
        this.addToolbarButton('-');
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
        this.comboDepositos = new LOG.util.LovCombo({
            mode: 'remote',
            url: '/logistica/inventario/recuperaciones/index.php/lentos/cargardepositos',
            displayField: 'deposito',
            valueField: 'iddeposito',
            autoLoad: false,
            listeners:{
                blur: function (cb) {
                    if(cb.getValue() != ''){
                        _this.getStorePrincipal().initBaseParams.iddepositos = cb.getValue();
                        _this.getStorePrincipal().reload();
                    }else{
                        _this.getStorePrincipal().initBaseParams.iddepositos = '';
                        _this.getStorePrincipal().reload();
                    }
                }
            }
        });
        this.lbDeposito = new Ext.form.Label({
            text: this.idioma.cgDepositos
        });
        this.addToolbarButton("->");
        this.addToolbarButton(this.lbDeposito);
        this.addToolbarButton(" ");
        this.addToolbarButton(this.comboDepositos);
        this.addToolbarButton("-");
        //this.addToolbarButton("->");
        this.addToolbarButton(new LOG.util.Prototipos.botonAyuda({id: 'idValorDepositos'}));
        _this.btnGraficar = new Ax.Charts.Views.ChartButton({
            cls: 'tbar',
            chartType: 'column',
            hidden:true,
            updateSourceStores: function () {
                _this.btnGraficar.addSerieStore("Valor de los depósitos", _this.getStorePrincipal(), {
                    x: {
                        source: "deposito",
                        label: "Depósito"
                    },
                    y: {
                        source: "apertura",
                        label: "Valor inicial"
                    }
                }, [{
                    name: 'Valor inicial',
                    source: 'apertura'
                }, {
                    name: 'Compras',
                    source: 'compras'
                }, {
                    name: 'Ventas',
                    source: 'ventas'
                }, {
                    name: 'Gastos',
                    source: 'gastos'
                }, {
                    name: 'Ajustes',
                    source: 'ajustes'
                }, {
                    name: 'Importe',
                    source: 'importe'
                }]);

                return true;
            }
        });

        this.insertToolbarButton(_this.btnGraficar, 4);
    },
    getReportes: function (data) {
        var _this = this;
        this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/inventario/recuperaciones/ValorDepositos' + ((alternativa) ? 'Dual' : ''),
                    name: 'ValorDepositos',
                    isList: true,
                    params: {
                        fechafin: _this.criterio != null ? _this.criterio.format('d/m/Y') : null,
                        idsubsistema: _this.storePrincipal.reader.jsonData.idsubsistema,
                        iddocs: _this.storePrincipal.reader.jsonData.iddocs,
                        iddepositos: _this.storePrincipal.reader.jsonData.iddepositos,
                        idestructura: idEntidad,
                        monedaalternativa: monedaalternativa ? monedaalternativa : null,
                        monedacontable: monedacontable ? monedacontable : null
                    }
                }
            ]
        });
        this.tipoReportes.view();
    }
});

