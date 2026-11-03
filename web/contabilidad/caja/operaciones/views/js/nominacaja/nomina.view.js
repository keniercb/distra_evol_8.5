/**
 * Created by furet on 13/10/15.
 */
Ext.namespace('Caja.Nomina');

//--Componete Panel Nomina
Caja.Nomina.PanelPeriodo = Ext.extend(Ext.Panel, {
    constructor: function (params) {

        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            labelAlign: 'top',
            buttonAlign: 'right',
            title: this.idioma.lbPeriodosPagos,
            idioma: params.idioma,
            perfil: params.perfil
        });
        this.createGrid();
        this.initEventos();
        this.initFunctions();

        Caja.Nomina.PanelPeriodo.superclass.constructor.call(this);
    },
    createGrid: function () {

        this.rdPeriodo = new Ext.data.JsonReader({
            root: 'datos',
            totalProperty: 'total'
        }, [{
            name: 'numerodoc'
        }, {
            name: 'numcomprobante'
        }, {
            name: 'idnominacaja'
        }, {
            name: 'idmovimiento'
        }, {
            name: 'iddocumento'
        }, {
            name: 'idfechacierrenomina'
        }, {
            name: 'fechacierrenomina'
        }, {
            name: 'fechadocumento'
        }, {
            name: 'personas'
        }, {
            name: 'idestado'
        }, {
            name: 'nomestado'
        }, {
            name: 'monto'
        }, {
            name: 'montopagado'
        }, {
            name: 'pendiente'
        }, {
            name: 'idcuentacontrapartida'
        }, {
            name: 'cod'
        }, {
            name: 'showCmp'
        }, {
            name: 'arrayIdCmp'
        }]);

        this.stPeriodo = new Ext.data.Store({
            url: 'cargarPeriodoPago',
            reader: this.rdPeriodo,
            baseParams: {
                limit: 20,
                filter: '',
            },
            autoLoad: false,
            sortInfo: {
                field: 'pendiente',
                direction: 'DESC'
            }
        });

        var compCmp = new Ext.Cmpaction();

        this.gpPeriodo = new Ext.grid.GridPanel({
                border: false,
                stripeRows: true,
                frame: false,
                loadMask: true,
                autoExpandColumn: 'expandir',
                store: this.stPeriodo,
                forceFit: true,
                plugins: compCmp,
                sm: this.smPeriodo = new Ext.grid.RowSelectionModel({
                    singleSelect: true
                }),
                columns: [{
                    header: this.idioma.lbNumero,
                    dataIndex: 'numerodoc',
                    //hideable: false,
                    width: 80,
                    align: 'left',
                    sortable: false,
                }, {
                    header: 'Fecha documento',
                    dataIndex: 'fechadocumento',
                    //hideable: false,
                    align: 'left',
                    sortable: false,
                }, {
                    header: this.idioma.lbPeriodoPago,
                    id: 'expandir',
                    dataIndex: 'fechacierrenomina',
                    //hideable: false,
                    align: 'left',
                    sortable: false,
                }, {
                    header: this.idioma.lbEstado,
                    dataIndex: 'nomestado',
                    width: 100,
                    align: 'center',
                    sortable: false,
                }, {
                    header: this.idioma.lbTotal,
                    dataIndex: 'monto',
                    sortable: true,
                    renderer: formatoMoneda,
                    width: 100,
                    sortable: false,
                    align: 'right'
                }, {
                    header: this.idioma.lbPagado,
                    dataIndex: 'montopagado',
                    sortable: true,
                    renderer: formatoMoneda,
                    width: 100,
                    sortable: false,
                    align: 'right'
                }, compCmp]
            }
        );
        this.items = [this.gpPeriodo];
    },
    initEventos: function () {
        var scope = this;
        this.gpPeriodo.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.get('idestado') == 6) {
                rowParams.tstyle += "background-color: #dffbda;";
            } else if (record.get('idestado') == 7) {
                rowParams.tstyle += "background-color: #f2e2e2;";
            } else {
                var style = rowParams.tstyle.split(';');
                if (style[0]) {
                    rowParams.tstyle = style[0] + ';';
                }
            }
        };

        // this.gpPeriodo.on({
        //     scope: this,
        //     rowClick: function (grid, rowIndex) {
        //         var data = grid.store.getAt(rowIndex).data;
        //         this.scope.panelPersonas.stPersonas.load({
        //             params: {idfechacierrenomina: data.idfechacierrenomina}
        //         });
        //     }
        // });

        //Revisar esto q no funciona para poner las filas en negrita
        this.smPeriodo.on({
            scope: this,
            rowselect: function (smodel, rowIndex, record) {
                this.gpPeriodo.getView().addRowClass(rowIndex, "negrita");
                this.scope.panelPersonas.stPersonas.load({
                    params: {idfechacierrenomina: record.data.idfechacierrenomina}
                });
                //Validar botones-------------------------
                if (record.data.idestado == -1 && record.data.cod == -1) {
                    mostrarMensaje(1, 'Existe diferencia entre el  monto total del periódo de pago y el desglose de las nóminas por personas.', function () {
                    });
                } else if (record.data.idestado == -1 && record.data.cod == 1) {
                    this.scope.btnSolicitar.enable();
                }
                if (record.data.idestado == 8) {
                    this.scope.btnConfirmar.enable();
                    this.scope.btnCancelar.enable();
                }
                if (record.data.idestado == 5) {
                    this.scope.btnPostear.enable();
                    this.scope.btnCancelar.enable();
                }
                if (record.data.idestado == 6) {
                    this.scope.btnCancelar.enable();
                }
            },
            rowdeselect: function (smodel, rowIndex, record) {
                this.gpPeriodo.getView().removeRowClass(rowIndex, "negrita");
                this.scope.btnSolicitar.disable();
                this.scope.btnConfirmar.disable();
                this.scope.btnPostear.disable();
                this.scope.btnCancelar.disable();
                scope.scope.panelPersonas.stPersonas.removeAll();
                scope.scope.panelNomina.stNomina.removeAll();
            }
        });

        this.stPeriodo.on({
            scope: this,
            beforeload: function () {
                this.scope.btnSolicitar.disable();
                this.scope.btnConfirmar.disable();
                this.scope.btnPostear.disable();
                this.scope.btnGuardar.disable();
                this.scope.btnCancelar.disable();
                //this.scope.loadMask();
                this.stPeriodo.baseParams.idmoneda = this.scope.idMoneda;
                this.stPeriodo.baseParams.idCajaFondo = this.scope.idCajaFondo;
                this.stPeriodo.baseParams.idPeriodo = Caja.Componentes.cbPeriodo.getValue();
                scope.scope.panelPersonas.stPersonas.removeAll();
                scope.scope.panelNomina.stNomina.removeAll();
            },
            load: function (st, records) {
                this.smPeriodo.selectFirstRow();
                // this.smPeriodo.selectRow(0);
                this.scope.lfdSaldo.setText('Saldo: ' + st.reader.jsonData.saldoFondo);
                this.scope.saldoActual = st.reader.jsonData.saldoFondo;
                if (!records.length) {
                    mostrarMensaje(1, 'La nómina no ha generado el período de pago.');
                }
            }
        });

        Caja.Componentes.cbPeriodo.on({
            scope: this,
            select: function (cb, record) {
                if (Caja.Componentes.cbPeriodo.getValue())
                    this.stPeriodo.load();
            }
        });

    },
    initFunctions: function () {

    }
});

Caja.Nomina.PanelPersonas = Ext.extend(Ext.Panel, {
    constructor: function (params) {

        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            labelAlign: 'top',
            buttonAlign: 'right',
            title: this.idioma.lbPersona,
            idioma: params.idioma,
            perfil: params.perfil,
            isSavePersona: true,
        });
        this.createGrid();
        this.initEventos();
        this.initFunctions();

        Caja.Nomina.PanelPersonas.superclass.constructor.call(this);
    },
    createGrid: function () {
        this.searchField = new Ext.Cont.SearchField({
            labelField: 'Numero',
            hideTrigger1: false,
            width: (Ext.lib.Dom.getViewWidth() - 10) * 0.15,
            // maskRe: /^([0-9])+$/,
            // regex: /^([0-9])+$/,
            //maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda ]*$/,
            scope: this,
            fnOnSearch: function () {
                if (this.isSavePersona) {
                    this.stPersonas.baseParams.filter = this.searchField.getRawValue();
                    this.stPersonas.reload();
                    this.scope.panelNomina.stNomina.removeAll();
                } else {
                    mostrarMensaje(1, this.idioma.lbGuardarCambios);
                }
            }.bind(this),
            fnOnClear: function () {
                this.stPersonas.baseParams.filter = '';
                this.stPersonas.reload();
                this.scope.panelNomina.stNomina.removeAll();
            }.bind(this),
        });

        this.btnMarcar = new Ext.Button({
            hidden: true,
            iconCls: 'true',
            text: 'Marcar todos',
            tooltip: 'Marcar todo como cobrado',
            listeners: {
                scope: this,
                click: function () {
                    this.marcarTodos(true);
                    this.btnMarcar.setVisible(false);
                    this.btnDesMarcar.setVisible(true);
                }
            }
        });

        this.btnDesMarcar = new Ext.Button({
            hidden: true,
            iconCls: 'false',
            text: 'Desmarcar todos',
            tooltip: 'Desmarcar todo como cobrado',
            listeners: {
                scope: this,
                click: function () {
                    this.marcarTodos(false);
                    this.btnMarcar.setVisible(true);
                    this.btnDesMarcar.setVisible(false);
                }
            }
        });

        this.rdPersonas = new Ext.data.JsonReader({
            root: 'datos',
            totalProperty: 'total'
        }, [{
            name: 'idpersona'
        }, {
            name: 'ci'
        }, {
            name: 'nombreyapellidos'
        }, {
            name: 'idplantillanominal'
        }, {
            name: 'plantillanominal'
        }, {
            name: 'importe'
        }, {
            name: 'importeactualizar', type: 'float'
        }, {
            name: 'pagos'
        }, {
            name: 'cobro'
        }]);

        this.stPersonas = new Ext.data.GroupingStore({
            groupField: 'plantillanominal',
            url: 'cargarPersonas',
            reader: this.rdPersonas,
            baseParams: {
                limit: 20,
                filter: '',
            },
            autoLoad: false,
            sortInfo: {
                field: 'nombreyapellidos',
                direction: 'ASC'
            }
        });

        this.gpPersonas = new Ext.grid.EditorGridPanel({
                border: false,
                stripeRows: true,
                frame: false,
                loadMask: true,
                autoExpandColumn: 'expandir',
                clicksToEdit: 1,
                store: this.stPersonas,
                sm: this.smPersonas = new Ext.grid.RowSelectionModel({
                    singleSelect: true
                }),
                columns: [{
                    header: this.idioma.lbCI,
                    sortable: true,
                    dataIndex: 'ci',
                    //hideable: false,
                    width: 30,
                    align: 'left'
                }, {
                    header: this.idioma.lbNombreApell,
                    id: 'expandir',
                    sortable: true,
                    dataIndex: 'nombreyapellidos',
                    //hideable: false,
                    align: 'left'
                }, {
                    header: this.idioma.lbImporte,
                    dataIndex: 'importe',
                    sortable: true,
                    renderer: formatoMoneda,
                    width: 20,
                    align: 'right'
                }, {
                    hidden: true,
                    header: this.idioma.lbArea,
                    hideable: false,
                    dataIndex: 'plantillanominal'
                }],
                view: new Ext.grid.GroupingView({
                    forceFit: true,
                    groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
                }),
                tbar: [this.searchField, '-', this.btnMarcar, this.btnDesMarcar, '->', Caja.Componentes.cbEjercicio, '-', Caja.Componentes.cbPeriodo]
            }
        );
        this.items = [this.gpPersonas];
    },
    initEventos: function () {
        var scope = this;
        this.gpPersonas.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.get('cobro') == 1) {
                rowParams.tstyle += "background-color: #dffbda;";
            } else if (record.get('idestado') == 7) {
                rowParams.tstyle += "background-color: #f2e2e2;";
            } else {
                var style = rowParams.tstyle.split(';');
                if (style[0]) {
                    rowParams.tstyle = style[0] + ';';
                }
            }
        };

        //Revisar esto q no funciona para poner las filas en negrita
        this.smPersonas.on({
            scope: this,
            rowselect: function (smodel, rowIndex, record) {
                this.gpPersonas.getView().addRowClass(rowIndex, "negrita");
                this.scope.panelNomina.stNomina.loadData({'data': record.data.pagos});
                if (this.scope.panelPeriodo.smPeriodo.getSelected().data.idestado == 8) {
                    this.scope.btnGuardar.enable();
                }
                this.scope.panelNomina2.expand();
            },
            rowdeselect: function (smodel, rowIndex, record) {
                this.gpPersonas.getView().removeRowClass(rowIndex, "negrita");
                //this.scope.btnGuardar.disable();
                this.scope.panelNomina.stNomina.removeAll();
            }
        });

        this.stPersonas.on({
            scope: this,
            beforeload: function () {
                //this.scope.loadMask();
                this.stPersonas.baseParams.idCajaFondo = this.scope.idCajaFondo;
                this.stPersonas.baseParams.idmoneda = this.scope.idMoneda;
                var idNominaCaja = this.scope.panelPeriodo.smPeriodo.getSelected().data.idnominacaja;
                this.stPersonas.baseParams.idNominaCaja = idNominaCaja ? idNominaCaja : -1;
                this.scope.btnGuardar.disable();
                this.scope.panelNomina2.collapse();
            },
            load: function (st, records) {
                //Mensaje cuando no encuentra datos al buscar
                if (!records.length) {
                    if (st.baseParams.filter)
                        mostrarMensaje(1, this.idioma.lbNoDatosPorCriterios);
                    else
                        mostrarMensaje(1, this.idioma.lbNoDatos);
                    this.btnMarcar.setVisible(false);
                    this.btnDesMarcar.setVisible(false);
                }
                this.scope.lfdSaldo.setText('Saldo: ' + st.reader.jsonData.saldoFondo);
                this.scope.saldoActual = st.reader.jsonData.saldoFondo;
                if (!st.reader.jsonData.todoCobrado) {
                    this.btnMarcar.setVisible(true);
                    this.btnDesMarcar.setVisible(false);
                } else {
                    this.btnMarcar.setVisible(false);
                    this.btnDesMarcar.setVisible(true);
                }
                this.scope.lfdTotalPagar.setText('Total a pagar: ' + st.reader.jsonData.totalPagar);
            }
        });
    },
    initFunctions: function () {
        var me = this;
        this.marcarTodos = function (marcarAll) {
            if (me.scope.panelPeriodo.smPeriodo.getSelected().data.idestado == 8) {//Si esta en estado guardado
                me.scope.panelPersonas.stPersonas.getRange().forEach(function (item, index, AllItems) {
                    item.data.pagos.forEach(function (item2, index2, AllItems2) {
                        if (item.data.pagos[index2].cobro == false && marcarAll) {
                            item.data.pagos[index2].cobro = true;
                            item.data.cobro = true;
                            item.data.importeactualizar = parseFloat(item.data.importeactualizar) + parseFloat(item.data.pagos[index2].monto);
                        } else if (item.data.pagos[index2].cobro == true && !marcarAll) {
                            item.data.pagos[index2].cobro = false;
                            item.data.cobro = false;
                            item.data.importeactualizar = parseFloat(item.data.importeactualizar) - parseFloat(item.data.pagos[index2].monto);
                        }
                    });
                });
                me.scope.btnGuardar.enable();
                me.scope.panelPersonas.isSavePersona = false;
                me.scope.panelPersonas.gpPersonas.getView().refresh();
            } else {
                mostrarMensaje(1, 'El período de pago debe estar en estado guardado para poder realizar esta acción.')
            }
        };
    }
});

Caja.Nomina.PanelNomina = Ext.extend(Ext.Panel, {
    idfuncionalidad: window.parent.idFuncionalidad,
    constructor: function (params) {

        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            labelAlign: 'top',
            buttonAlign: 'right',
            // title: this.idioma.lbNominas,
            idioma: params.idioma,
            perfil: params.perfil
        });
        this.createGrid();
        this.initEventos();

        Caja.Nomina.PanelNomina.superclass.constructor.call(this);
    },
    createGrid: function () {

        this.rdNomina = new Ext.data.JsonReader({
            root: 'data',
            // totalProperty: 'cant'
        }, [{
            name: 'idelaborarpagos'
        }, {
            name: 'idtiponomina'
        }, {
            name: 'tipopago'
        }, {
            name: 'operacion'
        }, {
            name: 'monto'
        }, {
            name: 'cobro',
            type: 'bool'
        }, {
            name: 'idpersona'
        }]);

        this.stNomina = new Ext.data.Store({
            url: 'cargarNominas',
            reader: this.rdNomina,
            baseParams: {
                limit: 20,
                filter: '',
            },
            //autoLoad: true,
            sortInfo: {
                field: 'tipopago',
                direction: 'DESC'
            }
        });

        this.checkColumn = new Ext.grid.CheckColumn({
            header: "Cobrado",
            dataIndex: 'cobro',
            width: 20,
            disabled: true,
            align: 'center',
            scope: this
        });

        this.gpNomina = new Ext.grid.GridPanel({
                border: false,
                stripeRows: true,
                frame: false,
                loadMask: true,
                autoExpandColumn: 'expandir',
                plugins: this.checkColumn,
                store: this.stNomina,
                sm: this.smNomina = new Ext.grid.RowSelectionModel({
                    singleSelect: true
                }),
                columns: [{
                    header: this.idioma.lbNomina,
                    sortable: true,
                    dataIndex: 'tipopago',
                    id: 'expandir',
                    align: 'left'
                }, {
                    header: this.idioma.lbImporte,
                    dataIndex: 'monto',
                    renderer: formatoMoneda,
                    sortable: true,
                    width: 20,
                    align: 'right'
                }, this.checkColumn],
                viewConfig: {
                    forceFit: true
                },
                forceFit: true
            }
        );
        this.items = [this.gpNomina];
    },
    initEventos: function () {
        var scope = this;
        this.gpNomina.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.get('cobro') == 1) {
                rowParams.tstyle = "background-color: #dffbda;";
            } else rowParams.tstyle = "";
        };

        this.smNomina.on({
            scope: this,
            rowselect: function (smodel, rowIndex, record) {
                this.gpNomina.getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function (smodel, rowIndex, record) {
                this.gpNomina.getView().removeRowClass(rowIndex, "negrita");
            }
        });
    }
});

Caja.Nomina.WindowCancelar = Ext.extend(Ext.Window, {
    constructor: function (scope) {
        Ext.applyIf(this, {
            layout: 'fit',
            border: false,
            scope: scope,
            autoValidate: true,
            title: scope.idioma.lbTitleCancelar,
            modal: true,
            resizable: false,
            layout: 'fit',
            closeAction: 'close',
            id: 'windowCancelar',
            autoHeight: true,
            border: false,
            width: 300,
            height: 200,
            items: [this.fPanelCancelar = this.fPanelCancelar(scope)],
        });
        this.createButtons();
        return Caja.Nomina.WindowCancelar.superclass.constructor.call(this);
    },
    fPanelCancelar: function (scope) {
        //ComboBox Motivo de wincajacancelar
        this.stMotivo = new Ext.data.Store({
            url: 'cargarmotivocancelacion',
            reader: new Ext.data.JsonReader({
                root: 'datos',
            }, [{
                name: 'idmotivocancelacion',
                mapping: 'idmotivocancelacion',
                type: 'string'
            }, {
                name: 'motivo',
                mapping: 'descripcion'
            }
            ]),
            sortInfo: {
                field: 'motivo',
                direction: 'ASC'
            },
            autoLoad: true,
            listeners: {
                beforeload: function (s, options) {
                    this.stMotivo.clearFilter(true);
                    this.stMotivo.removeAll();
                }.bind(this)
            }
        });
        this.cbMotivo = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: scope.idioma.lbMotivoCancel,
            mode: 'local',
            name: 'cbxmotivo',
            id: 'cbxmotivo',
            tpl: '<tpl for="."><div ext:qtip="{motivo}" class="x-combo-list-item">{motivo}</div></tpl>',
            resizable: true,
            emptyText: 'Seleccione...',
            store: this.stMotivo,
            hiddenName: 'idmotivocancelacion',
            valueField: 'idmotivocancelacion',
            displayField: 'motivo',
            editable: false,
            typeAhead: true,
            msgTarget: 'qtip',
            maskRe: /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, n?meros y espacios
            regex: /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
            regexText: 'Este campo solo permite letras y n&uacute;meros.',
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            anchor: '95%',
            triggerAction: 'all'
        });

        //Fecha wincajacancelar
        this.dfCancelacion = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: scope.idioma.lbFecha,
            //readOnly : true,
            msgTarget: 'qtip',
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            editable: false,
            anchor: '95%',
            name: 'dfCancelacion',
            id: 'dfCancelacion',
            minValue: fechaInicio,
            maxValue: fechaFin,
            value: fechaContable,
            enableKeyEvents: true
        });
        this.fpCancelacion = new Ext.FormPanel({
            id: 'fpcancelacion',
            region: 'north',
            labelAlign: 'top',
            frame: true,
            border: true,
            layout: 'form',
            autoHeight: true,
            modal: true,
            plain: true,
            trackResetOnLoad: true,
            bodyStyle: 'padding:10px 0 0 10px',
            items: [this.cbMotivo, this.dfCancelacion]
        });
        return this.fpCancelacion
    },
    createButtons: function () {
        this.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            iconCls: 'cancelar',
            selectOnFocus: true,
            text: this.scope.idioma.lbBtnCancelar,
            tooltip: this.scope.idioma.tooltipCloseAdd,
            scope: this,
            handler: function () {
                this.close();
            }.bind(this)
        });

        this.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            iconCls: 'aceptar',
            text: this.scope.idioma.lbBtnAceptar,
            tooltip: this.scope.idioma.tooltipAcept,
            scope: this,
            handler: function () {
                if (this.fpCancelacion.getForm().isValid()) {
                    this.scope.cancelarNomina(this.cbMotivo.getValue(), this.dfCancelacion.getRawValue());
                    this.close();
                }
            }.bind(this)
        });
        this.buttons = [this.btnCancelar, this.btnAceptar];
    }
});

Caja.Nomina.WindowSolicitar = Ext.extend(Ext.Window, {
    constructor: function (scope) {
        Ext.applyIf(this, {
            layout: 'fit',
            border: false,
            scope: scope,
            autoValidate: true,
            title: 'Solicitar extracción de efectivo',
            modal: true,
            resizable: false,
            layout: 'fit',
            closeAction: 'close',
            autoHeight: true,
            border: false,
            width: 550,
            // height: 200,
            items: [this.fpSolicitar = this.fpSolicitar(scope)],
        });
        this.createButtons();
        return Caja.Nomina.WindowSolicitar.superclass.constructor.call(this);
    },
    fpSolicitar: function (scope) {
        this.stOperacion = new Ext.data.Store({
            // url: this.url + 'loadDataOperacion',
            reader: new Ext.data.JsonReader({}, [{
                name: 'idoperacion',
                mapping: 'idnomoperaciones'
            }, {
                name: 'denominacion',
                mapping: 'denominacion'
            }, {
                name: 'idcuenta',
                mapping: 'idcuenta'
            }, {
                name: 'nombrecuenta',
                mapping: 'nombrecuenta'
            }])
        });

        this.cbOperacion = new Ext.form.ComboBox({
            fieldLabel: 'Operación contable',
            emptyText: 'Seleccione...',
            mode: 'local',
            allowBlank: false,
            store: this.stOperacion,
            hiddenName: 'idoperacion',
            valueField: 'idoperacion',
            displayField: 'denominacion',
            forceSelection: true,
            triggerAction: 'all',
            anchor: '100%',
            resizable: true,
            editable: false,
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });
// ---------------------------------------------
        if (Caja.Nomina.contabilizaSolicitud) {
            this.stCuentaCont = new Ext.data.Store({
                // url: 'loadDataCuentaOperacion',
                sortInfo: {
                    field: 'nomcuenta',
                    direction: "ASC"
                },
                reader: new Ext.data.JsonReader({
                    root: 'datos'
                }, [{
                    name: 'idcuenta'
                }, {
                    name: 'nomcuenta'
                }]),
                /*baseParams: {
                    idmoneda: scope.idmonedaEntidad,
                },
                autoLoad: true*/
            });

            this.cbCuentaCont = new Ext.form.ComboBox({
                fieldLabel: 'Cuenta',
                store: this.stCuentaCont,
                name: 'cbAddInstFormaPago',
                valueField: 'idcuenta',
                hiddenName: 'idcuenta',
                displayField: 'nomcuenta',
                emptyText: 'Seleccione...',
                disabledClass: 'disabled-component',
                editable: false,
                forceSelection: true,
                allowBlank: false,
                // blankText: this.idioma.lbBlankText,
                resizable: true,
                triggerAction: 'all',
                anchor: '100%',
                mode: 'local'
            });
//----------------------------------------------------------------
            this.cbOperacion.on('select', function (cb, record) {
                this.stCuentaCont.loadData({'datos': record.json.arrayCuenta});
            }, this);
            this.stCuentaCont.on('load', function (st, records) {
                if (records.length == 1) {
                    this.cbCuentaCont.setValue(records[0].data.idcuenta);
                }
            }, this);
        }
        //------Cargar datos operacion----------
        this.stOperacion.loadData(Caja.Nomina.arrayOperacion);
        if (Caja.Nomina.arrayOperacion.length == 1) {
            var record = this.stOperacion.getAt(0);
            this.cbOperacion.setValue(record.data.idoperacion);
            this.cbOperacion.fireEvent('select', this.cbOperacion, record);
        }
// ---------------------------------------------
        //Fecha wincajacancelar
        this.dfSolicitar = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: scope.idioma.lbFecha,
            //readOnly : true,
            msgTarget: 'qtip',
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            editable: false,
            anchor: '95%',
            name: 'dfSolicitar',
            minValue: fechaInicio,
            maxValue: fechaFin,
            value: fechaContable,
            enableKeyEvents: true
        });
        this.panelSolicitar = new Ext.FormPanel({
            id: 'fpcancelacion',
            region: 'north',
            labelAlign: 'top',
            frame: true,
            border: true,
            layout: 'form',
            autoHeight: true,
            modal: true,
            plain: true,
            trackResetOnLoad: true,
            bodyStyle: 'padding:10px 0 0 10px',
            items: Caja.Nomina.contabilizaSolicitud ? [{
                layout: 'column',
                items: [{
                    columnWidth: .20,
                    layout: 'form',
                    items: [this.dfSolicitar]
                }, {
                    columnWidth: .80,
                    layout: 'form',
                    items: [this.cbOperacion]
                }, {
                    columnWidth: 1,
                    layout: 'form',
                    items: [this.cbCuentaCont]
                }]
            }] : [{
                layout: 'column',
                items: [{
                    columnWidth: .20,
                    layout: 'form',
                    items: [this.dfSolicitar]
                }, {
                    columnWidth: .80,
                    layout: 'form',
                    items: [this.cbOperacion]
                }]
            }]
        });
        return this.panelSolicitar
    },
    createButtons: function () {
        this.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            iconCls: 'cancelar',
            selectOnFocus: true,
            text: this.scope.idioma.lbBtnCancelar,
            tooltip: this.scope.idioma.tooltipCloseAdd,
            scope: this,
            handler: function () {
                this.close();
            }.bind(this)
        });

        this.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            iconCls: 'aceptar',
            text: this.scope.idioma.lbBtnAceptar,
            tooltip: this.scope.idioma.tooltipAcept,
            scope: this,
            handler: function () {
                if (this.panelSolicitar.getForm().isValid()) {
                    Caja.Nomina.winSolicitar = this;
                    var idCtaContrapartida = null;
                    if (Caja.Nomina.contabilizaSolicitud)
                        idCtaContrapartida = this.cbCuentaCont.getValue();
                    this.scope.solicitarEfectivo(this.dfSolicitar.getRawValue(), this.cbOperacion.getValue(), idCtaContrapartida);
                    this.close();
                }
            }.bind(this)
        });
        this.buttons = [this.btnCancelar, this.btnAceptar];
    }
});
