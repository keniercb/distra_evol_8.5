Ext.ns('Ext.erp.valordepositos');
Ext.erp.valordepositosxfecha = Ext.extend(LOG.util.UITemplate, {
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        var _this = this;
        config.dirController = '/logistica/inventario/recuperaciones/index.php/valordepositosxfecha';
        config.urlBusquedaGridPrincipal = 'cargarDepositosxFecha';
        config.modoSeleccion = 1;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = false;
        config.foreceFitView = false;
        config.idioma = {};
        Ext.erp.valordepositosxfecha.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.inv.valordepositos.Idioma);
        _this.concepto = this.idioma.depositos;
        _this.textBusquedaSimple = this.idioma.txtBusquedaSimple;
        _this.criterio = null;
        _this.valuedetalle = 0;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({dataIndex: 'iddeposito'});
        this.addGridColumn({
            header:this.idioma.cgDepositos,
            dataIndex: 'deposito',
            width: 220,
            agrupador: (_this.valuedetalle != 0) ? true : false,
            hidden: (_this.valuedetalle != 0) ? true : false,
            default: true
        });
        this.addGridColumn({
            header: 'Detalle',
            dataIndex: 'dinamico',
            width: 220,
            agrupador: (_this.valuedetalle == 0) ? true : false,
            hidden: (_this.valuedetalle == 0) ? true : false,
            default: true
        });
        this.addGridColumn({
            header: 'Fecha contable',
            dataIndex: 'fechacontable',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.gcEstadoAlmacen,
            dataIndex: 'estadoalmacen',
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
            header: 'Saldo final' + (alternativa ? ' ' + codigoContable : ''),
            dataIndex: 'saldofinal',
            align: 'right',
            default: true
        }));
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: 'Saldo final' + ' ' + codigoAlternativa,
            hidden: !alternativa,
            dataIndex: 'saldofinalalt',
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
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: 'Diferencia',
            dataIndex: 'diferencia',
            align: 'right',
            default: true
        }));
    },
    initDefaultButtons: function () {
        var _this = this;
        this.detalle = new LOG.util.ComboBox({
            hiddenName: 'iddetalle',
            valueField: 'iddetalle',
            displayField: 'detalle',
            editable: false,
            mode: 'local',
            value: 0,
            store: new Ext.data.SimpleStore({
                fields: ['iddetalle', 'detalle'],
                data: [
                    [0, _this.idioma.cgDepositos],
                    [1, 'Naturalezas'],
                    [2, 'Productos'],
                    [3, 'Clasificaci\xf3n contable']
                ]
            }),
            listeners: {
                'select' : function(cb) {
                    _this.valuedetalle = cb.getValue();
                    //_this.getStorePrincipal().initBaseParams.iddetalle = cb.getValue();
                    //_this.getStorePrincipal().reload();
                    if (cb.getValue() == 2) {
                        _this.chxDiferencias.enable();
                    } else {
                        _this.chxDiferencias.disable();
                    }
                    if (_this.valuedetalle != 0) {
                        _this.getStorePrincipal().groupBy('deposito', true);
                        _this.ocultarColumna('deposito');
                        _this.ocultarColumna('dinamico', false);
                    } else {
                        _this.getStorePrincipal().clearGrouping();
                        _this.ocultarColumna('dinamico');
                        _this.ocultarColumna('deposito', false);
                    }
                }
            }
        });
        this.chxDiferencias = new Ext.form.Checkbox({
            name: 'diferencias',
            style: 'margin-left: 15px; margin-top:-15px',
            boxLabel: 'Con diferencias',
            inputValue: 0,
            checked: true,
            disabled: true,
            listeners: {
                check: function(e, a) {
                    
                }
            }
        });
        this.addToolbarButton(new Ext.form.Label({
            text: 'Detalle:'
        }));

        this.chxAlldepositos = new Ext.form.Checkbox({
            name: 'alldepositos',
            style: 'margin-left: 15px; margin-top:-15px',
            boxLabel: 'Todos los depósitos',
            inputValue: 0,
            checked: false,
            disabled: false,
            listeners: {
                check: function(e, a) {
                    if(_this.chxAlldepositos.checked == true){
                        _this.getStorePrincipal().reload();
                    }else{
                        _this.storePrincipal.removeAll();
                    }
                   
                }
               
            }
        });
       
        this.addToolbarButton(' ');
        this.addToolbarButton(_this.detalle);
        this.addToolbarButton('-');
        this.addToolbarButton(_this.chxDiferencias);
        this.addToolbarButton('-');
     

        

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'registro',
            text: 'Actualizar submayor',
            tooltip: 'Actualizar submayor del almac\xe9n seleccionado',
            handler: function() {
                mostrarMensaje(2, '\xbfEst\xe1 seguro que desea restablecer el submayor del almac\xe9n seleccionado\x3f', function (btn) {
                    if (btn == 'ok') {
                        Ext.MessageBox.wait('Actualizando datos', LOG.util.Idioma.msgEspere || '...');
                        Ext.Ajax.request({
                            url: _this.dirController+'/restablecerSubmayor',
                            method: 'POST',
                            params: {
                                idestructura: _this.comboDepositos.getValue()
                            },
                            callback: function (o, s, r) {
                                Ext.MessageBox.hide();
                                _this.getStorePrincipal().reload({});
                            }
                        });
                    }
                });
            },
            controlFn(b, __caller){
                if (__caller.grantedAction('RRestablecer')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
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
        this.addToolbarButton(LOG.util.Prototipos.botonLimpiar({
            tooltip: _this.idioma.ttBtnLimpiar,
            text: _this.idioma.btnLimpiar,
            handler: function () {
                _this.btnLimpiar();
            }
        }));
        this.addToolbarButton('-');
        //this.addToolbarButton(_this.chxAlldepositos);
        this.comboDepositos = new LOG.util.LovCombo({
            mode: 'local',
            url: '/logistica/inventario/recuperaciones/index.php/lentos/cargardepositos',
            displayField: 'deposito',
            valueField: 'iddeposito',
            autoLoad: true,
            listeners:{
                blur: function (cb) {
                    if(cb.getValue() != ''){
                        _this.getStorePrincipal().initBaseParams.iddepositos = cb.getValue();
                        //_this.getStorePrincipal().reload();
                    }else{
                        _this.getStorePrincipal().initBaseParams.iddepositos = '';
                        //_this.getStorePrincipal().reload();
                    }
                    if (_this.detalle.getValue() != 0) {
                        _this.getStorePrincipal().groupBy('deposito', true);
                        _this.ocultarColumna('deposito');
                        _this.ocultarColumna('dinamico', false);
                    } else {
                        _this.getStorePrincipal().clearGrouping();
                        _this.ocultarColumna('dinamico');
                        _this.ocultarColumna('deposito', false);
                    }
                }
            }
        });
        this.lbDeposito = new Ext.form.Label({
            text: this.idioma.cgDepositos
        });

        this.addToolbarButton("->");
        this.addToolbarButton(this.lbDeposito);
        this.addToolbarButton(": ");
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

        //this.insertToolbarButton(_this.btnGraficar, 4);
    },
    getReportes: function (data) {
        var _this = this;
        this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/inventario/recuperaciones/CuadreAlmacen' ,
                    name: 'CuadreAlmacen',
                    isList: true,
                    params: {
                        fecha: _this.fechainicio.getValue() ? _this.fechainicio.getValue().format('d-m-Y') : (new Date()).format('d-m-Y'),
                        fechafin: _this.fechafin.getValue() ? _this.fechafin.getValue().format('d-m-Y') : (new Date()).format('d-m-Y'),
                        idsubsistema: _this.storePrincipal.reader.jsonData.idsubsistema,
                        detalle: _this.detalle.getValue(),
                        subtitle: _this.detalle.getRawValue().toUpperCase(),
                        iddocs: _this.storePrincipal.reader.jsonData.iddocs,
                        iddepositos: _this.storePrincipal.reader.jsonData.iddepositos,
                        idestructura: idEntidad,
                        monedaalternativa: monedaalternativa ? monedaalternativa : null,
                        monedacontable: monedacontable ? monedacontable : null,
                        diferencias: (_this.chxDiferencias.getValue() == true) ? 1 : 0
                    }
                }
            ]
        });
        this.tipoReportes.view();
    },
    btnLimpiar: function(){
        var _this=this;
        _this.fechainicio.setValue(null);
        _this.fechafin.setValue(null);
        _this.fechainicio.setMaxValue(null);
        _this.fechafin.setMinValue(null);
        _this.comboDepositos.clearValue();
        _this.detalle.clearValue();
        _this.storePrincipal.removeAll();
        _this.chxDiferencias.reset();
       // _this.chxAlldepositos.reset();
    },
    render: function(config) {
        var render = Ext.erp.valordepositosxfecha.superclass.render.call(this, config);
        var _this = this;
        /*_this.textDesde = new Ext.form.DateField({
            name: 'desdeLV',
            width: 100,
            editable: false,
            vtype: 'daterange',
            id: 'desdeLV',
            endDateField: 'hastaLV'
        });
        _this.textHasta = new Ext.form.DateField({
            name: 'hastaLV',
            width: 100,
            editable: false,
            vtype: 'daterange',
            id: 'hastaLV',
            startDateField: 'desdeLV'
        });
        _this.textDesde.endDateField = _this.textHasta.id; //-------validacion de fecha
        _this.textHasta.startDateField = _this.textDesde.id;
        _this.btnBuscar = new Ext.Button({ iconCls: 'buscar', text: this.idioma.lbBtnBuscar, tooltip: this.idioma.tooltipBuscar, disabled: false, handler: function () {
                _this.botonBuscar();
            }});
        _this.btnLimpiar = new LOG.util.Prototipos.botonLimpiar({ text: this.idioma.lbBtnLimpiar, tooltip: this.idioma.tooltipLimpiar, handler: function () {
                _this.customTriggerClear();
            }});
        render.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    alt: true,
                    key: 'b',
                    fn: function () {
                        if (render.isVisible())
                            _this.botonBuscar();
                    }
                },
                {
                    alt: true,
                    key: 'l',
                    fn: function () {
                        if (render.isVisible())
                            _this.customTriggerClear();
                    }
                }
            ]);

*/
        this.getStorePrincipal().on('beforeload', function(st) {
            st.initBaseParams.iddetalle = _this.detalle.getValue() || 0;
            st.initBaseParams.diferencias = (_this.chxDiferencias.getValue() == true) ? 1 : 0;
        });
        this.gpPrincipal.getTopToolbar().add('-',new Ext.form.Label({text: 'Fecha inicio'}), ' :', this.fechainicio = new Ext.form.DateField({
                width: 160,
                maxValue: new Date(),
                listeners: {
                    select: function (df, value) {
                        _this.getStorePrincipal().initBaseParams.fechainicio = value;
                        _this.criterioinicio = value;
                        _this.getStorePrincipal().reload();
                    }
                }
            }),
            '-', new Ext.form.Label({text: 'Fecha fin'}), ' :', this.fechafin = new Ext.form.DateField({
                width: 160,
                maxValue: new Date(),
                listeners: {
                    select: function (df, v) {
                        _this.getStorePrincipal().initBaseParams.fecha = v;
                        _this.criterio = v;
                        _this.getStorePrincipal().reload();
                    }
                }
            })/*,'-', _this.btnBuscar,'-', _this.btnLimpiar*/);
        //_this.detalle.fireEvent('select', _this.detalle,0,0);
        return render;

    }
});

