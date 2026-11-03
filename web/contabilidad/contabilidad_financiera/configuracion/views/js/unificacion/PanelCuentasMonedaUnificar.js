Ext.namespace('Configuracion.Unificacion');
Configuracion.Unificacion.PanelCuentasMonedaUnificar = Ext.extend(Ext.Panel, {
    constructor: function (params) {
        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            labelAlign: 'top',
            buttonAlign: 'right',
            title: this.idioma.lbTitleCuentaMonedaUnificacion,
            idioma: params.idioma,
            perfil: params.perfil,
        });
        this.createGridPanel();
        this.initEventosCuentas();
        Configuracion.Unificacion.PanelCuentasMonedaUnificar.superclass.constructor.call(this);
    },
    createGridPanel : function () {
        var me = this;

        this.stCuentasMonedaUnificar = new Ext.data.Store({
            url: 'cargarcuentasidmoneda',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'concatcta'},
                {name: 'descripcion'},
                {name: 'idcuenta'},
                {name: 'nombrecuentadestino'},
                {name: 'idcuentadestino'}
            ])
        });

        //-----EditorGridPanel CuentasMonedaUnificar
        this.gpCuentasMonedaUnificar = new Ext.grid.EditorGridPanel({
            scope: me,
            border: false,
            clicksToEdit: 1,
            split: true,
            loadMask: true,
            frame: false,
            arrayPaginSelect: new Array(),
            layout: 'fit',
            autoExpandColumn: 'nombreCuentaUnificar',
            store: this.stCuentasMonedaUnificar,
            sm: this.smCuentasMonedaUnificar = new Ext.grid.RowSelectionModel({
                singleSelect: false
            }),
            columns: [
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'id'
                }, {
                    sortable: true,
                    width: 20,
                    header: this.idioma.lbCuentaUnificar,
                    hideable: true,
                    id: 'concatcta',
                    dataIndex: 'concatcta',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        if (!Ext.isEmpty(value)) {
                            return record.data.concatcta+' '+record.data.descripcion;
                        }
                    }
                }, {
                    header: this.idioma.lbCuentaFinal,
                    id: "idcuentadestino",
                    dataIndex: 'idcuentadestino',
                    width: 20,
                    editor: this.linkCuentaGrid = new Ext.contabilidad.util.linkedCombo({
                        id: 'combocuentas',
                        store: me.scope.PanelConfiguracion.stcuenta,
                        displayField: 'denominacion',
                        valueField: 'idcuenta',
                        allowBlank: true,
                        listHeight: 200,
                        lazyRender: true,
                        fnCreateNew: Ext.emptyFn
                    }),
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        if (!Ext.isEmpty(value)) {
                            var store = me.scope.PanelConfiguracion.stcuenta;
                            if (store) {
                                var index = store.find('idcuenta', value);
                                if (index >= 0) {
                                    var newValue = store.getAt(index).data.denominacion;
                                    return newValue;
                                }
                                else {
                                    return record.data.nombrecuentadestino;
                                }
                            }
                        }
                    }
                }],
                viewConfig: {
                forceFit: true
            },
            forceFit: true
        });
        this.items = [this.gpCuentasMonedaUnificar];
    },

    initEventosCuentas : function () {
        this.stCuentasMonedaUnificar.on({
            scope: this,
            load: function () {
                var records = [];
                for (var j = 0; j < this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.getCount(); j++) {
                        records.push(this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.getAt(j).data.idcuenta);
                }

                var activaTabs = true;
                for (var k = 0; k < this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.getCount(); k++) {
                    if(Ext.isEmpty(this.scope.PanelCuentasMonedaUnificar.stCuentasMonedaUnificar.getAt(k).data.idcuentadestino)) {
                        activaTabs = false;
                        break;
                    }
                }
                // this.scope.PanelInformacion.gpDerechosObigaciones.setDisabled(!activaTabs);
                // this.scope.PanelInformacion.PanelCaja.setDisabled(!activaTabs);
                // this.scope.PanelInformacion.tabPanel.getItem('panelTabContabilidad').setDisabled(!activaTabs);

                this.scope.PanelInformacion.btnUnificarCaja.setDisabled(!activaTabs);
                this.scope.PanelInformacion.panelUnifBanco.btnUnificarBanco.setDisabled(!activaTabs);
                this.scope.PanelInformacion.btnUnificarCobroPago.setDisabled(!activaTabs);
                this.scope.PanelInformacion.btnUnificarContabilidad.setDisabled(!activaTabs);
                console.log(this.scope.PanelInformacion.panelUnifBanco.btnUnificarBanco);

                this.scope.PanelInformacion.panelUnifBanco.unificarBanco(1);
                this.scope.PanelConfiguracion.functionComprobarDatosParaGuardar();
                // this.scope.PanelInformacion.stDerechosObigaciones.baseParams = {'idmonedaUnif' : this.scope.PanelConfiguracion.cbMonedaUnificar.getValue()};
                // this.scope.PanelInformacion.stDerechosObigaciones.baseParams = {'arrayIdCta' : Ext.encode(records), 'idMoneda' : this.scope.PanelConfiguracion.cbMonedaUnificar.getValue()};
                // this.scope.PanelInformacion.stDerechosObigaciones.baseParams = {'arrayIdCta' : Ext.encode(records)};
                this.scope.PanelInformacion.stDerechosObigaciones.baseParams = {
                    idmoneda: this.stCuentasMonedaUnificar.baseParams.idMoneda,
                    idtasa: this.scope.PanelConfiguracion.cbTasaUnificar.getValue()
                };
                this.scope.PanelInformacion.stDerechosObigaciones.load({
                    callback: function (r) {
                        console.log(r[0], r[1], r[2], r[3]);
                    }
                });
                this.scope.PanelInformacion.stContabilidad.load();
                //this.scope.PanelInformacion.stFondosUnificar.baseParams = {'idMoneda' : this.stCuentasMonedaUnificar.baseParams.idMoneda};
                //this.scope.PanelInformacion.stFondosUnificar.load();
                this.scope.PanelInformacion.stUnificarCaja.baseParams = {'idMoneda' : this.stCuentasMonedaUnificar.baseParams.idMoneda};
                this.scope.PanelInformacion.stUnificarCaja.load();
            },
            datachanged: function () {
                this.scope.PanelConfiguracion.functionComprobarDatosParaGuardar();

            },
            update: function () {
                this.scope.PanelConfiguracion.functionComprobarDatosParaGuardar();
            }
        });
        this.scope.PanelConfiguracion.cbMonedaUnificar.on({
            scope: this,
            select: function () {
                var baseparam = {
                    idmoneda: this.scope.PanelConfiguracion.cbMonedaUnificar.getValue()
                };
                this.linkCuentaGrid.setBaseParams(baseparam);
            }
        });
    }
});
