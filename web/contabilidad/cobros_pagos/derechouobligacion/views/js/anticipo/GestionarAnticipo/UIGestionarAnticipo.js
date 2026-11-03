Ext.namespace('Ext.UIGestionarAnticipo');

Ext.UIGestionarAnticipo.ViewPort = Ext.extend(Ext.Viewport, {
    etiquetas: undefined,
    constructor: function(scope, params)
    {
        return Ext.UIGestionarAnticipo.ViewPort.superclass.constructor.call(this, Ext.apply(params, {
            renderTo: document.body,
            id: 'test',
            layout: 'border'
        }));
    }
});

Ext.UIGestionarAnticipo.loadMask = function(body, msg) {
    return new Ext.LoadMask(body, {
        msg: msg
    });
};

Ext.UIGestionarAnticipo.pnlContenedor = Ext.extend(Ext.Panel, {
    constructor: function(scope, titulo)
    {
        Ext.UIGestionarAnticipo.pnlContenedor.superclass.constructor.call(this, {
            layout: 'border',
            border: false,
            region: 'center',
            id: 'panel',
            items: scope.gpRegistroAnticipo = this.fGetGridAnticipo(scope),
            //tbar: ['Tipo de anticipo: ', scope.cbTipo]
        });
    },
    fGetGridAnticipo: function(scope)
    {
        scope.btnLiquidar = new Ext.Button({
            text: scope.etiquetas.lbBtnLiquidar,
            tooltip: scope.etiquetas.tpLiquidar,
            disabled: true,
            hidden: true,
            tabIndex: 312,
            // icon: perfil.dirImg + 'liquidar.png',
            icon: perfil.dirImg + 'liquidar.png',
            iconCls: 'btn'
        });

		scope.btnContabAnticTraspasado = new Ext.Button({
            text: 'Contabilizar anticipos traspasados',
            tooltip: scope.etiquetas.tpLiquidar,
            disabled: true,
            // hidden: true,
            tabIndex: 312,
            // icon: perfil.dirImg + 'liquidar.png',
            // icon: perfil.dirImg + 'contabilizar.png',
            iconCls: 'liquidar'
        });

        scope.btnVerLiquidaciones = new Ext.Button({
            text: 'Liquidaciones registradas',
            tooltip: 'Mostrar todas las liquidaciones registradas',
            disabled: true,
            tabIndex: 312,
            // icon: perfil.dirImg + 'liquidar.png',
            // icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'ver'
        });

        scope.btnEliminarLiquidaciones = new Ext.Button({
            text: 'Cancelar',
            tooltip: 'Cancelar liquidaciones registradas',
            disabled: true,
            // tabIndex: 312,
            // icon: perfil.dirImg + 'liquidar.png',
            // icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'cancelar'
        });

        scope.btnEliminarMovimientos = new Ext.Button({
            text: 'Cancelar',
            tooltip: 'Cancelar liquidaciones registradas',
            disabled: true,
            // tabIndex: 312,
            // icon: perfil.dirImg + 'liquidar.png',
            // icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'cancelar'
        });

        scope.btnVerMovimiento = new Ext.Button({
            text: 'Liquidaciones registradas',
            tooltip: 'Mostrar todas las liquidaciones registradas',
            disabled: true,
            // tabIndex: 312,
            // icon: perfil.dirImg + 'liquidar.png',
            // icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'ver'
        });

        scope.btnDesactivarAnticipo = new Ext.Button({
            text: scope.etiquetas.lbBtnDesactivar,
            tabIndex: 312,
            disabled: true,
            // icon: perfil.dirImg + 'liquidar.png',
            iconCls: 'motivodesactivacion'
        });

        scope.btnRegistrarLiquidacion = new Ext.Button({
            text: scope.etiquetas.lbBtnLiquidar,
            tooltip: scope.etiquetas.ttLiquidar,
            tabIndex: 312,
            disabled: true,
            //icon: perfil.dirImg + 'facturar.png',
            iconCls: 'liquidar'
        });

        scope.btnLimpiar = new Ext.Button({
            text: scope.etiquetas.lbBtnLimpiar,
            tooltip: scope.etiquetas.ttLimpiar,
            tabIndex: 312,
            disabled: true,
            icon: perfil.dirImg + 'limpiar.png',
            iconCls: 'btn'
        });

        scope.btnLiquidarTodos = new Ext.Button({
            text: scope.etiquetas.lbBtnLiquidarTodos,
            tooltip: scope.etiquetas.tpLiquidarTodos,
            tabIndex: 312,
            disabled: true,
            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'btn'
        });

        scope.btnComprobanteRetencion = new Ext.Button({
            text: scope.etiquetas.lbBtnComprobanteRetencion,
            tooltip: scope.etiquetas.tpComprobanteRetencion,
            tabIndex: 312,
            disabled: true,
            icon: perfil.dirImg + 'comprobante.png',
            iconCls: 'btn'
        });

        scope.btnEliminarRetencion = new Ext.Button({
            text: scope.etiquetas.lbBtnEliminarRetencion,
            tooltip: scope.etiquetas.tpEliminarRetencion,
            tabIndex: 312,
            disabled: true,
            icon: perfil.dirImg + 'comprobante.png',
            iconCls: 'btn'
        });

        scope.btnVerAnticipo = new Ext.Button({
            text: scope.etiquetas.lbBtnVer,
            tooltip: scope.etiquetas.tpVer,
            tabIndex: 312,
            disabled: true,
            icon: perfil.dirImg + 'ver.png',
            iconCls: 'btn'
        });

        scope.btnGraficarAnticipo = new Ext.Button({
            text: scope.etiquetas.lbBtnGraficar,
            tooltip: scope.etiquetas.tpGraficar,
            tabIndex: 313,
            disabled: true,
            icon: perfil.dirImg + 'planificacion.png',
            iconCls: 'btn'
        });

        scope.btnReporte = new Ext.Button({
            id: 'idBtnReporte',
            text: scope.etiquetas.lbReporteAnticipos,
            disabled: true,
            tooltip: scope.etiquetas.ttipReporteAnticipos,
            // icon: perfil.dirImg + 'imprimir.png',
            iconCls: 'imprimir'
        });

        scope.btnAyuda = new Ext.Button({
            id: 'btnAyu',
            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'btn',
            text: scope.etiquetas.lbBtnAyuda,
            tooltip: scope.etiquetas.tpAyuda,
            // handler: function () {
            //     titulo = 'Liquidar cobros anticipados';
            //     direccion = 'cobros_y_pagos/liquidacion/cobro_anticipado';
            //     help.show(titulo, direccion);
            // }
        });

        scope.btnFiltrarLiquidacion = new Ext.Button({
            tooltip: 'Filtrar obligaciones',
            text: 'Filtro',
            iconCls: 'adicionar',
            // disabled: true,
        });

        // Para el menu contextual
        scope.menuItemClientProvee = new Ext.menu.Item({
            text: 'Cargar cuentas por cobrar',
            hidden: true,
            iconCls: 'operaciones'
        });
        scope.menuItemDesgAnticipos = new Ext.menu.Item({
            text: 'Cargar desglose de anticipos', //etiquetas.lbEliminar,
            hidden: true,
            iconCls: 'liquidar'
        });

        scope.menuContextual = new Ext.menu.Menu({
            floating: false,
            shadow: "drop",
            hideBorders: true,
            items: [scope.menuItemClientProvee, scope.menuItemDesgAnticipos]
        });

        scope.cbTipo = new Ext.form.ComboBox({
            fieldLabel: 'Tipo de anticipo',
            mode: 'local',
            hiddenName: 'idtipo',
            allowBlank: false,
            anchor: '100%',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            tabIndex: 1,
            emptyText: 'Seleccione...',
            readOnly: false,
            editable: true,
            //typeAhead : true,
            store: scope.stTipo,
            valueField: 'idtipo',
            displayField: 'descripcion',
            resizable: true,
            tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{descripcion}</div></tpl>',
            forceSelection: true,
            triggerAction: 'all'
        });
        scope.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar',
            icon: perfil.dirImg + 'limpiar.png',
            iconCls: 'btn',
            hidden: true,
            //text: scope.etiquetas.lbBtnAyuda,
            tooltip: 'Limpiar campo'//scope.etiquetas.tpAyuda
        });

        scope.cbclienteprovee = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            //fieldLabel: etiquetas.lbPersona,
            resizable: true,
            pageSize: 10,
            minChars: 3,
            mode: 'remote',
            listWidth: 350,
            emptyText: 'Seleccione...',
            editable: true,
            disabled: true,
            store: scope.stClienteProv,
            valueField: 'idcliente',
            displayField: 'nombre',
            hiddenName: 'idcliente',
            forceSelection: true,
            anchor: '100%',
            enableKeyEvents: true,
            triggerAction: 'all',
            typeAhead: false,
            allowBlank: true,
            readOnly: false
        });

        scope.tfImpLiquidar = new Ext.form.NumberField({
            name: 'ipagar',
            id: 'ipagar',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            allowNegative: false,
            value: '0.00',
            allowDecimals: true,
            forcePrecision: true,
            decimalPrecision: 2,
            enableKeyEvents: true
        });

        scope.tfTotalLiquidar = new Ext.form.NumberField({
            name: 'tfTotalLiquidar',
            id: 'tfTotalLiquidar',
            disabledClass: 'disabled-component',
            allowNegative: false,
            allowDecimals: true,
            value: '0.00',
            disabled: true
        });

		scope.tfPendienteAnt = new Ext.form.NumberField({
            name: 'tfPendienteAnt',
            id: 'tfPendienteAnt',
            disabledClass: 'disabled-component',
            allowNegative: false,
            allowDecimals: true,
            value: '0.00',
            disabled: true
        });

        scope.lfdFechaContable = new Ext.form.Label({
            id: 'lfdFechaContable',
            text: 'Fecha contable: ??/??/????',
            style: 'font-weight:bold;'
        });

        scope.smGestionarAnticipo = new Ext.grid.RowSelectionModel({//PASARLE EL SELECTION MODEL DEL ORIGINAL
            singleSelect: false,
            id: 'smGestionarAnticipo',
            width: 30,
            sortable: true,
            listeners: {
                rowselect: function(smodel, rowIndex, record) {
                    scope.RowClick(smodel, rowIndex, record);
                    Ext.getCmp('gpGestionarAnticipo').getView().addRowClass(rowIndex, "negrita");
					scope.btnVerLiquidaciones.enable();
                    scope.btnVerMovimiento.enable();
                },
                rowdeselect: function(smodel, rowIndex, record) {
                    scope.RowClick(smodel, rowIndex, record);
                    Ext.getCmp('gpGestionarAnticipo').getView().removeRowClass(rowIndex, "negrita");
					scope.btnVerLiquidaciones.disable();
                    scope.btnVerMovimiento.disable();
                }
            }
        });

        scope.gpGestionarAnticipo = new Ext.grid.GridPanel({
            frame: false,
            border: false,
            autoScroll: true,
            anchor: '100%',
            region: 'north',
            stripeRows: true,
            id: 'gpGestionarAnticipo',
            height: 200,
            autoExpandColumn: 'expand',
            sm: scope.smGestionarAnticipo,
            store: scope.stGestionarAnticipo,
            cm: new Ext.grid.ColumnModel([
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'tipo',
                    id: 'tipo'
                }, {
                    header: scope.etiquetas.headerCliente,
                    width: 230,
                    dataIndex: 'nombre',
                    id: 'expand',
                    sortable: true
                }, {
                    header: scope.etiquetas.lbImportePendiente,
                    dataIndex: 'importependiente',
                    align: 'right',
                    width: 130,
                    sortable: true,
                    renderer: formatoMonedaABS,
                    //hidden: true,
                    hideable: false
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idcliente',
                    id: 'idcliente'
                }
            ]),
            tbar: scope.tbGestionarAnticipo = new Ext.Toolbar({
                hidden: false,
                items: ['Tipo de anticipo: ', scope.cbTipo, '->', 'Acreedor/Deudor:', scope.cbclienteprovee, scope.btnLimpiar, scope.btnLiquidar]
            }),
            bbar: scope.ptRegistroAnticipo = new Ext.Cont.PagingToolbar({
                pageSize: 20,
                scope: this,
                clearFilter: false,
                store: scope.stGestionarAnticipo,
                displayInfo: true,
                listeners: {
                    'beforechange': function()
                    {
                        //scope.loadMessageBox(scope.etiquetas.lbMsgLoadData);
                        instance = new PagingToolbarSelections({
                            'selections': Ext.getCmp('gpGestionarAnticipo').getSelectionModel().getSelections(),
                            'activePage': this.getPageData().activePage
                        });
                        instance.saveSelectionsOnPage(scope.arrayValues);
                    },
                    'change': function()
                    {
                        scope.btnLiquidar.disable();
                        //Ext.MessageBox.hide();
                        instance = new PagingToolbarSelections({
                            'activePage': this.getPageData().activePage
                        });
                        instance.setSelectionsOnPage(scope.arrayValues, Ext.getCmp('gpGestionarAnticipo'));
                    }
                }
            })
        });

        scope.smDesgloseAnticipo = new Ext.grid.RowSelectionModel({//PASARLE EL SELECTION MODEL DEL ORIGINAL
            singleSelect: true,
            id: 'smDesgloseAnticipo',
            width: 30,
            sortable: true,
            listeners: {
                rowselect: function(smodel, rowIndex, record) {
                    scope.RowClickDesgloseAnticipo(smodel, rowIndex, record);
                    Ext.getCmp('gpDesgloseAnticipo').getView().addRowClass(rowIndex, "negrita");
                },
                rowdeselect: function(smodel, rowIndex, record) {
                    scope.RowClickDesgloseAnticipo(smodel, rowIndex, record);
                    Ext.getCmp('gpDesgloseAnticipo').getView().removeRowClass(rowIndex, "negrita");
                }
            }
        });

        scope.gpDesgloseAnticipo = new Ext.grid.GridPanel({
            title: 'Desglose de anticipos',
            frame: false,
            border: false,
            autoScroll: true,
            anchor: '100%',
            split: true,
            stripeRows: true,
            region: 'center',
            height: 250,
            id: 'gpDesgloseAnticipo',
            autoExpandColumn: 'cuenta',
            sm: scope.smDesgloseAnticipo,
            store: scope.stDesgloseAnticipo,
			plugins: [scope.rowactionCancelarAnticipo],
            view: new Ext.grid.GroupingView({
                //forceFit: true,
                groupTextTpl: 'Moneda: {[values.rs[0].data.moneda]}'
            }),
            cm: new Ext.grid.ColumnModel([
                {
                    id: 'fecha',
                    header: 'Fecha',
                    dataIndex: 'femision',
                    align: 'left',
                    renderer: 'erpFecha',
                    width: 100,
                    sortable: true
                }, {
                    id: 'numcheque',
                    header: 'No. Cheque',
                    dataIndex: 'nInstrumento',
                    align: 'left',
                    width: 100,
                    sortable: true
                },{
                    id: 'cuenta',
                    header: 'Cuenta',
                    dataIndex: 'concatcta',
                    align: 'left',
                    width: 200,
                    sortable: true
                }, {
                    id: 'importe',
                    header: scope.etiquetas.lbImporteTotal,
                    dataIndex: 'importe',
                    align: 'right',
                    width: 130,
                    sortable: true,
                    renderer: formatoMonedaABS
                }, {
                    id: 'pendiente',
                    header: scope.etiquetas.lbImportePendiente,
                    dataIndex: 'pendiente',
                    align: 'right',
                    width: 130,
                    sortable: true,
                    renderer: formatoMonedaABS
                }, {
                    id: 'tipodocumento',
                    header: 'Tipo de documento ',
                    dataIndex: 'denominaciontipo',
                    align: 'left',
                    width: 200,
                    hidden: true,
                    hideable: false,
                    sortable: true
                }, {
                    id: 'comentario',
                    header: 'Comentario',
                    dataIndex: 'comentario',
                    align: 'left',
                    width: 200,
                    hidden: true,
                    hideable: false,
                    sortable: true
                }, {
                    id: 'idmoneda',
                    dataIndex: 'idmoneda',
                    hidden: true,
                    hideable: false
                }, scope.rowactionCancelarAnticipo

				/*{
                    header: 'Estado',
                    dataIndex: 'estadoliquidacion',
                    align: 'center',
                    width: 150,
                    sortable: false,
                    renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                        if(value == 1) {
                            return '<span style="font-weight: bold;font-style: italic;color: red;">Pendiente a reintegrar</span>';
                        }
                        else if(value == 2) {
                            return '<span style="font-weight: bold;font-style: italic;color: red;">Pendiente a devolver</span>';
                        }
                        else {
                            return '<span style="font-weight: bold;font-style: italic;">Listo para liquidar</span>';
                        }
                    }
                }*/
            ]),
			tbar: scope.tbGestionarAnticipo = new Ext.Toolbar({
                hidden: false,
                items: ['Tipo de anticipo: ', scope.cbTipo, '->', 'Acreedor/Deudor:', scope.cbclienteprovee, scope.btnLimpiar, scope.btnLiquidar]
            }),
            /*tbar: scope.tbDesgloseAnticipo = new Ext.Toolbar({
                items: [scope.btnDesactivarAnticipo, scope.btnReporte]
            }),*/
//             bbar: scope.ptDesgloseAnticipo = new Ext.Cont.PagingToolbar({
//                 pageSize: 20,
//                 scope: this,
//                 store: scope.stDesgloseAnticipo,
//                 displayInfo: true,
//                 listeners: {
//                     'beforechange': function()
//                     {
// //                        scope.loadMessageBox(scope.etiquetas.lbMsgLoadData);
//                         instance = new PagingToolbarSelections({
//                             'selections': Ext.getCmp('gpDesgloseAnticipo').getSelectionModel().getSelections(),
//                             'activePage': this.getPageData().activePage
//                         });
//                         instance.saveSelectionsOnPage(scope.arrayValues);
//                     },
//                     'change': function()
//                     {
//                         scope.btnDesactivarAnticipo.disable();
//                         scope.btnReporte.disable();
// //                        Ext.MessageBox.hide();
//                         instance = new PagingToolbarSelections({
//                             'activePage': this.getPageData().activePage
//                         });
//                         instance.setSelectionsOnPage(scope.arrayValues, Ext.getCmp('gpDesgloseAnticipo'));
//                     }
//                 }
//             })
            bbar:  new Ext.Toolbar({
              items: [scope.btnVerMovimiento, scope.btnEliminarMovimientos]
            })
        });

		scope.smTraspasoAnticipo = new Ext.grid.RowSelectionModel({//PASARLE EL SELECTION MODEL DEL ORIGINAL
            singleSelect: true,
            id: 'smTraspasoAnticipo',
            width: 30,
            sortable: true,
            listeners: {
                rowselect: function(smodel, rowIndex, record) {
                    scope.RowClickTraspasoAnticipo(smodel, rowIndex, record);
                    Ext.getCmp('gpTraspasoAnticipo').getView().addRowClass(rowIndex, "negrita");
                },
                rowdeselect: function(smodel, rowIndex, record) {
                    scope.RowClickTraspasoAnticipo(smodel, rowIndex, record);
                    Ext.getCmp('gpTraspasoAnticipo').getView().removeRowClass(rowIndex, "negrita");
                }
            }
        });

        scope.gpTraspasoAnticipo = new Ext.grid.GridPanel({
            title: 'Anticipos traspasados a la entidad',
            frame: false,
            border: false,
            autoScroll: true,
            anchor: '100%',
            split: true,
            stripeRows: true,
            region: 'south',
            height: 250,
            id: 'gpTraspasoAnticipo',
            autoExpandColumn: 'cuenta',
            sm: scope.smTraspasoAnticipo,
            store: scope.stDesgloseAnticipo,
            view: new Ext.grid.GroupingView({
                //forceFit: true,
                groupTextTpl: 'Moneda: {[values.rs[0].data.moneda]}'
            }),
			plugins: [scope.rowactionContabAnticipo],
            cm: new Ext.grid.ColumnModel([
                {
                    id: 'fecha',
                    header: 'Fecha',
                    dataIndex: 'femision',
                    align: 'left',
                    renderer: 'erpFecha',
                    width: 100,
                    sortable: true
                }, {
                    id: 'numcheque',
                    header: 'No. Cheque',
                    dataIndex: 'nInstrumento',
                    align: 'left',
                    width: 100,
                    sortable: true
                },{
                    id: 'cuenta',
                    header: 'Cuenta',
                    dataIndex: 'concatcta',
                    align: 'left',
                    width: 200,
                    sortable: true
                }, {
                    id: 'importe',
                    header: scope.etiquetas.lbImporteTotal,
                    dataIndex: 'importe',
                    align: 'right',
                    width: 130,
                    sortable: true,
                    renderer: formatoMonedaABS
                }, {
                    id: 'pendiente',
                    header: scope.etiquetas.lbImportePendiente,
                    dataIndex: 'pendiente',
                    align: 'right',
                    width: 130,
                    sortable: true,
                    renderer: formatoMonedaABS
                }, {
                    id: 'tipodocumento',
                    header: 'Tipo de documento ',
                    dataIndex: 'denominaciontipo',
                    align: 'left',
                    width: 200,
                    hidden: true,
                    hideable: false,
                    sortable: true
                }, {
                    id: 'comentario',
                    header: 'Comentario',
                    dataIndex: 'comentario',
                    align: 'left',
                    width: 200,
                    hidden: true,
                    hideable: false,
                    sortable: true
                }, {
                    id: 'identidadorigen',
                    header: 'Entidad origen',
                    dataIndex: 'identidadorigen',
                    align: 'left',
                    width: 200,
                    hideable: false,
                    sortable: true
                }, {
                    id: 'idmoneda',
                    dataIndex: 'idmoneda',
                    hidden: true,
                    hideable: false
                },
                scope.rowactionContabAnticipo
            ]),
            // tbar: scope.tbTraspasoAnticipo = new Ext.Toolbar({
                // items: ['->', scope.btnContabAnticTraspasado]
            // }),
            bbar: scope.ptTraspasoAnticipo = new Ext.Cont.PagingToolbar({
                pageSize: 20,
                scope: this,
                store: scope.stTraspasoAnticipo,
                displayInfo: true,
                listeners: {
                    'beforechange': function()
                    {
//                        scope.loadMessageBox(scope.etiquetas.lbMsgLoadData);
                        instance = new PagingToolbarSelections({
                            'selections': Ext.getCmp('gpTraspasoAnticipo').getSelectionModel().getSelections(),
                            'activePage': this.getPageData().activePage
                        });
                        instance.saveSelectionsOnPage(scope.arrayValues);
                    },
                    'change': function()
                    {
                        // scope.btnDesactivarAnticipo.disable();
                        // scope.btnReporte.disable();
//                        Ext.MessageBox.hide();
                        instance = new PagingToolbarSelections({
                            'activePage': this.getPageData().activePage
                        });
                        instance.setSelectionsOnPage(scope.arrayValues, Ext.getCmp('gpTraspasoAnticipo'));
                    }
                }
            })
        });

        scope.smDesgloseLiquidacion = new Ext.grid.RowSelectionModel({//PASARLE EL SELECTION MODEL DEL ORIGINAL
            singleSelect: false,
            id: 'smDesgloseLiquidacion',
            width: 30,
            sortable: true,
            listeners: {
                rowselect: function(smodel, rowIndex, record) {
                    // scope.RowClickDesgloseAnticipo(smodel, rowIndex, record);
                    Ext.getCmp('gpDesgloseLiquidacion').getView().addRowClass(rowIndex, "negrita");
                    if (smodel.getSelections().length >= 1) {
                        scope.btnEliminarLiquidaciones.enable();
                    }
                },
                rowdeselect: function(smodel, rowIndex, record) {
                    // scope.RowClickDesgloseAnticipo(smodel, rowIndex, record);
                    Ext.getCmp('gpDesgloseLiquidacion').getView().removeRowClass(rowIndex, "negrita");
                    if (smodel.getSelections().length < 1) {
                        scope.btnEliminarLiquidaciones.disable();
                    }
                }
            }
        });

        scope.compCmpDesgloseLiq = new Ext.Cmpaction;
        scope.gpDesgloseLiquidacion = new Ext.grid.GridPanel({
            title: 'Desglose de liquidaci&oacute;n',
            frame: false,
            border: false,
            autoScroll: true,
            anchor: '100%',
            split: true,
            // hidden: true,
            stripeRows: true,
            region: 'south',
            height: 250,
            id: 'gpDesgloseLiquidacion',
            autoExpandColumn: 'cuenta',
            sm: scope.smDesgloseLiquidacion,
            store: scope.stDesgloseLiquidacion,
            // plugins: [rowactionConfirmar],
            plugins: [scope.compCmpDesgloseLiq/*, scope.rowactionConfirmar*/],
            view: new Ext.grid.GroupingView({
                //forceFit: true,
                groupTextTpl: 'N&uacute;mero: {[values.rs[0].data.numerodocumento]}'
            }),
            cm: new Ext.grid.ColumnModel([
                {
                    id: 'fecha',
                    header: 'Fecha',
                    dataIndex: 'fecha',
                    align: 'left',
                    renderer: 'erpFecha',
                    width: 100,
                    sortable: true
                }, {
                    id: 'numerodocumento',
                    header: 'No. documento',
                    dataIndex: 'numerodocumento',
                    align: 'left',
                    width: 100,
                    sortable: true
                },{
                    id: 'cuenta',
                    header: 'Factura liquidada',
                    dataIndex: 'numero',
                    align: 'left',
                    width: 200,
                    sortable: true
                }, {
                    id: 'importe',
                    header: 'Importe liquidado',
                    dataIndex: 'importe',
                    align: 'right',
                    width: 130,
                    sortable: true,
                    renderer: formatoMonedaABS
                },
                scope.compCmpDesgloseLiq
                /*,scope.rowactionConfirmar*/
            ]),
            /*tbar: scope.tbDesgloseAnticipo = new Ext.Toolbar({
             items: [scope.btnDesactivarAnticipo, scope.btnReporte]
             }),*/
            bbar: scope.ptDesgloseLiquidacion = new Ext.Cont.PagingToolbar({
                pageSize: 20,
                scope: this,
                store: scope.stDesgloseLiquidacion,
                displayInfo: true,
                listeners: {
                    'beforechange': function()
                    {
//                        scope.loadMessageBox(scope.etiquetas.lbMsgLoadData);
                        instance = new PagingToolbarSelections({
                            'selections': Ext.getCmp('gpDesgloseLiquidacion').getSelectionModel().getSelections(),
                            'activePage': this.getPageData().activePage
                        });
                        instance.saveSelectionsOnPage(scope.arrayValues);
                    },
                    'change': function()
                    {
                        scope.btnDesactivarAnticipo.disable();
                        scope.btnReporte.disable();
//                        Ext.MessageBox.hide();
                        instance = new PagingToolbarSelections({
                            'activePage': this.getPageData().activePage
                        });
                        instance.setSelectionsOnPage(scope.arrayValues, Ext.getCmp('gpDesgloseLiquidacion'));
                    }
                }
            })
        });

        scope.smLiquidarCxc = new Ext.grid.CheckboxSelectionModel({//PASARLE EL SELECTION MODEL DEL ORIGINAL
            // singleSelect: true,
            id: 'smLiquidarCxc',
            width: 40,
            align: 'right',
            // sortable: true,
            // listeners: {
            //     rowselect: function(smodel, rowIndex, record) {
            //         scope.RowClickLiquidarCxc(smodel, rowIndex, record);
            //         Ext.getCmp('gpLiquidarCxc').getView().addRowClass(rowIndex, "negrita");
            //     },
            //     rowdeselect: function(smodel, rowIndex, record) {
            //         scope.RowClickLiquidarCxc(smodel, rowIndex, record);
            //         Ext.getCmp('gpLiquidarCxc').getView().removeRowClass(rowIndex, "negrita");
            //     }
            // }
        });

        scope.filters = new Ext.grid.GridFilters({
            filtersText: 'Búsqueda',
            local: true,
            filters: [
                {type: 'string', dataIndex: 'ndocumentos'},
                {type: 'date', dataIndex: 'fecha'},
                {type: 'string', dataIndex: 'concatcta'},
                {type: 'string', dataIndex: 'noperacionenzona'}
            ]
        });

        scope.gpLiquidarCxc = new Ext.grid.EditorGridPanel({
            frame: false,
            title: 'Desglose de obligaciones',
            border: false,
            autoScroll: true,
            stripeRows: true,
            region: 'center',
            id: 'gpLiquidarCxc',
            sm: scope.smLiquidarCxc,
            store: scope.stLiquidarCxc,
            plugins: scope.filters,
            autoExpandColumn: 'comentarios',
            cm: new Ext.grid.ColumnModel([
                scope.smLiquidarCxc,
                {
                    header: "Documento",
                    dataIndex: 'tipodoc',
                    id: 'tipodoc',
                    width: 70,
                    align: 'center'
                }, {
                    id: 'ndocumentos',
                    header: 'No. documento',
                    align: 'right',
                    dataIndex: 'ndocumentos',
                    width: 120
                }, {
                    header: 'No. operacion',
                    align: 'left',
                    dataIndex: 'noperacionenzona',
                    width: 80,
                    hidden: true
                }, {
                    id: 'fecha',
                    header: 'Fecha',
                    align: 'left',
                    dataIndex: 'fecha',
                    width: 80
                }, {
                    id: 'ipendientes',
                    header: 'Importe pendiente',
                    dataIndex: 'ipendientes',
                    align: 'right',
                    width: 120,
                    renderer: formatoMonedaABS
                }, {
                    header: "Importe a liquidar",
                    dataIndex: 'ipagar',
                    id: 'ipagar',
                    width: 120,
                    align: 'right',
                    editor: scope.tfImpLiquidar,
                    renderer: formatoMonedaABS
                }, /*{
                 header: "Retenci&oacute;n",
                 dataIndex: 'retencion',
                 id: 'ipagar',
                 width: 120,
                 align: 'right'
                 }, */{
                    id: 'comentarios',
                    header: 'Comentario',
                    dataIndex: 'comentarios',
                    width: 200,
                    hidden: true
                }, {
                    id: 'concatcta',
                    header: 'Cuenta',
                    dataIndex: 'concatcta',
                    width: 200
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idcuenta'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idduo'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'liquidadomb'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idcompretenciones'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idliquidacionfnz'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'numerocomprobante'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'ivaventa'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'impuestomunicipal'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'impuestorenta'
                }, {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'observacionretencion'
                }
            ]),
            tbar: scope.tbLiquidarCxc = new Ext.Toolbar({
                hidden: false,
                // items: [/*scope.btnComprobanteRetencion, scope.btnEliminarRetencion, */'->', scope.btnAyuda]
                items: [scope.btnFiltrarLiquidacion, '->', scope.lfdFechaContable, scope.btnAyuda]
            }),
            // bbar: [scope.etiquetas.lbTotalLiquidar, scope.tfTotalLiquidar, /*scope.etiquetas.lbTotalLiquidar, scope.tfPendienteAnt,*/ '->', scope.btnLimpiar, scope.btnRegistrarLiquidacion]
            bbar: [scope.btnVerLiquidaciones, scope.btnEliminarLiquidaciones, '->', scope.etiquetas.lbTotalLiquidar, scope.tfTotalLiquidar, /*scope.etiquetas.lbTotalLiquidar, scope.tfPendienteAnt,*/ '->', scope.btnLimpiar, scope.btnRegistrarLiquidacion],
            listeners: {
                render: function () {
                    if (scope.gpLiquidarCxc.hasListener('rowmousedown')) {
                        scope.gpLiquidarCxc.events['rowmousedown'].clearListeners();
                    }
                }
            }
        });

        /*scope.fpGestionarAnticipo = new Ext.FormPanel({
            layout: 'border',
            region: 'west',
            width: 600,
            frame: false,
            border: true,
            items: [scope.gpGestionarAnticipo, scope.gpDesgloseAnticipo]
        });*/

        scope.smDesgloseMovimiento = new Ext.grid.RowSelectionModel({//PASARLE EL SELECTION MODEL DEL ORIGINAL
            singleSelect: false,
            id: 'smDesgloseMovimiento',
            width: 30,
            sortable: true,
            listeners: {
                rowselect: function(smodel, rowIndex, record) {
                    // scope.RowClickDesgloseAnticipo(smodel, rowIndex, record);
                    Ext.getCmp('gpDesgloseMovimiento').getView().addRowClass(rowIndex, "negrita");
                    if (smodel.getSelections().length >= 1) {
                        scope.btnEliminarMovimientos.enable();
                    }
                },
                rowdeselect: function(smodel, rowIndex, record) {
                    // scope.RowClickDesgloseAnticipo(smodel, rowIndex, record);
                    Ext.getCmp('gpDesgloseMovimiento').getView().removeRowClass(rowIndex, "negrita");
                    if (smodel.getSelections().length < 1) {
                        scope.btnEliminarMovimientos.disable();
                    }
                }
            }
        });

        scope.compCmpDesgloseMov = new Ext.Cmpaction;
        scope.gpDesgloseMovimiento = new Ext.grid.GridPanel({
            title: 'Desglose de liquidaci&oacute;n',
            frame: false,
            border: false,
            autoScroll: true,
            anchor: '100%',
            split: true,
            loadMask: true,
            // hidden: true,
            stripeRows: true,
            region: 'south',
            height: 250,
            id: 'gpDesgloseMovimiento',
            autoExpandColumn: 'comentario',
            sm: scope.smDesgloseMovimiento,
            store: scope.stDesgloseMovimiento,
            // plugins: [rowactionConfirmar],
            plugins: [scope.compCmpDesgloseMov/*, scope.rowactionConfirmarMov*/],
            cm: new Ext.grid.ColumnModel([
                {
                    // id: 'fecha',
                    header: 'Fecha',
                    dataIndex: 'fecha',
                    align: 'left',
                    renderer: 'erpFecha',
                    width: 100,
                    sortable: true
                }, {
                    id: 'numerodocumento',
                    header: 'No. documento',
                    dataIndex: 'numerodocumento',
                    align: 'left',
                    width: 100,
                    sortable: true
                }, {
                    id: 'importe',
                    header: 'Importe',
                    dataIndex: 'importe',
                    align: 'right',
                    width: 130,
                    sortable: true,
                    renderer: formatoMonedaABS
                }, {
                    id: 'comentario',
                    header: 'Comentario',
                    dataIndex: 'comentario',
                    align: 'left',
                    width: 130,
                    sortable: false,
                },
                scope.compCmpDesgloseMov
                /*,scope.rowactionConfirmarMov*/
            ]),
            /*tbar: scope.tbDesgloseAnticipo = new Ext.Toolbar({
             items: [scope.btnDesactivarAnticipo, scope.btnReporte]
             }),*/
            bbar: scope.ptDesgloseLiquidacion = new Ext.Cont.PagingToolbar({
                pageSize: 20,
                scope: this,
                store: scope.stDesgloseMovimiento,
                displayInfo: true,
//                 listeners: {
//                     'beforechange': function()
//                     {
// //                        scope.loadMessageBox(scope.etiquetas.lbMsgLoadData);
//                         instance = new PagingToolbarSelections({
//                             'selections': Ext.getCmp('gpDesgloseLiquidacion').getSelectionModel().getSelections(),
//                             'activePage': this.getPageData().activePage
//                         });
//                         instance.saveSelectionsOnPage(scope.arrayValues);
//                     },
//                     'change': function()
//                     {
//                         scope.btnDesactivarAnticipo.disable();
//                         scope.btnReporte.disable();
// //                        Ext.MessageBox.hide();
//                         instance = new PagingToolbarSelections({
//                             'activePage': this.getPageData().activePage
//                         });
//                         instance.setSelectionsOnPage(scope.arrayValues, Ext.getCmp('gpDesgloseLiquidacion'));
//                     }
//                 }
            })
        });

        scope.fpGestionarAnticipo = new Ext.FormPanel({
            layout: 'border',
            region: 'west',
            width: Ext.lib.Dom.getViewWidth() * 0.5,
            frame: false,
            border: true,
            split: true,
            items: [scope.gpDesgloseAnticipo, scope.gpDesgloseMovimiento]
            // items: [scope.gpGestionarAnticipo, scope.gpDesgloseAnticipo]
            // items: [scope.gpGestionarAnticipo, scope.gpDesgloseAnticipo, scope.gpTraspasoAnticipo]
        });

        return [scope.fpGestionarAnticipo, {
                region: 'center',
                layout: 'border',
                frame: false,
                border: true,
                // items: [scope.gpLiquidarCxc]
                items: [scope.gpLiquidarCxc, scope.gpDesgloseLiquidacion]
            }];
    }
});