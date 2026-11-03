Ext.namespace('Caja.Tarjetas');

//--Componete Panel Tarjetas
Caja.Tarjetas.PanelTarjeta = Ext.extend(Ext.Panel, {
    constructor: function (params) {
        Ext.apply(this, params);
        this.idTarjeta = null;
        Ext.apply(this, {
            layout: 'fit',
            labelAlign: 'top',
            buttonAlign: 'right',
            idioma: params.idioma,
            perfil: params.perfil
        });
        this.createButtonPanel();
        this.createGridPanel();
        this.initEventos();
        this.initFunctions();
        Caja.Tarjetas.PanelTarjeta.superclass.constructor.call(this);
    },
    createGridPanel: function () {
        var me = this;
        this.searchField = new Ext.Cont.SearchField({
            width: (Ext.lib.Dom.getViewWidth() - 10) * 0.1,
            maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda ]*$/,
            scope: this,
            fnOnSearch: function () {
                me.searchTarjeta(me.searchField.getRawValue());
            },
            fnOnClear: function () {
                me.searchTarjeta('');
            }
        });

        this.cbEstado = new Ext.form.ComboBox({
            store: new Ext.data.SimpleStore({
                fields: ['id', 'estado', 'srcImg'],
                data: [
                    [1, 'Activas', '/contabilidad/comun/images/checkgreen.png'],
                    [2, 'Inactivas', '/contabilidad/comun/images/cierreno.png'],
                    [3, 'Todas', '/contabilidad/comun/images/seleccion.png']
                ]
            }),
            width: 110,
            style: 'margin:0 0 0 0',
            tpl: '<tpl for="."><div ext:qtip="{estado}" class="x-combo-list-item"><img style="margin-right:5px;" src= {srcImg}>{estado}</div></tpl>',
            emptyText: 'Seleccionar...',
            displayField: 'estado',
            triggerAction: 'all',
            value: 1,
            valueField: 'id',
            hiddenName: 'id',
            mode: 'local',
            typeAhead: true,
            editable: false,
            resizable: true,
            forceSelection: true,
            selectOnFocus: true
        });

        this.cbTipoTarjeta = new Ext.form.ComboBox({
            store: new Ext.data.SimpleStore({
                fields: ['id', 'tipo'],
                data: [
                    [1, 'Combustible'],
                    [2, 'Peaje'],
                    [3, 'Todas']
                ]
            }),
            width: 110,
            style: 'margin:0 0 0 0',
            emptyText: 'Seleccionar...',
            displayField: 'tipo',
            triggerAction: 'all',
            value: 3,
            valueField: 'id',
            hiddenName: 'id',
            mode: 'local',
            typeAhead: true,
            editable: false,
            resizable: true,
            forceSelection: true,
            selectOnFocus: true
        });

        this.rdTarjeta = new Ext.data.JsonReader(
            {
                root: 'datos',
                totalProperty: 'total'
            }, [{
                name: 'idtarjeta'
            }, {
                name: 'numero'
            }, {
                name: 'saldomo'
            }, {
                name: 'saldocontable'
            }, {
                name: 'matricula'
            }, {
                name: 'idvehiculo'
            }, {
                name: 'idvehiculocaja'
            }, {
                name: 'vehiculo'
            }, {
                name: 'idcombustible'
            }, {
                name: 'nomcombustible'
            }, {
                name: 'preciocombustible'
            }, {
                name: 'idpersona'
            }, {
                name: 'nompersona'
            }, {
                name: 'idcuenta'
            }, {
                name: 'nomcuenta'
            }, {
                name: 'idmoneda'
            }, {
                name: 'nommoneda'
            }, {
                name: 'litros'
            }, {
                name: 'enuso'
            }, {
                name: 'activo'
            }, {
                name: 'tipo'
            }, {
                name: 'fechavence', dateFormat: 'd/m/Y'
            }]);

        this.stTarjeta = new Ext.data.Store({
            url: 'cargartarjetas',
            reader: this.rdTarjeta,
            scope: this,
            baseParams: {
                limit: 15,
                filter: ''
            },
            autoLoad: false
        });
        //------------------------------
        this.gpTarjeta = new Ext.grid.GridPanel({
            store: this.stTarjeta,
            loadMask: true,
            border: false,
            frame: false,
            viewConfig: {
                forceFit: true
            },
            sm: this.smTarjeta = new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            columns: [
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idtarjeta'
                }, {
                    header: this.idioma.lbTarjeta,
                    sortable: true,
                    hideable: true,
                    width: 15,
                    dataIndex: 'numero'
                }, {
                    sortable: true,
                    header: this.idioma.lbResponsable,
                    hideable: true,
                    dataIndex: 'nompersona',
                    editor: this.cbPersona,
                    width: 15,
                    scope: this
                }, {
                    sortable: true,
                    width: 10,
                    header: this.idioma.lbVehiculo,
                    hideable: true,
                    dataIndex: 'vehiculo',
                }, {
                    sortable: true,
                    width: 5,
                    header: this.idioma.lbEstado,
                    hideable: true,
                    dataIndex: 'activo',
                    align: 'center',
                    renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                        if (value == 1) {
                            metaData.attr = 'ext:qtip="' + '<b>Activa</b>"';
                            metaData.css = 'icondistra-true verde';
                        } else {
                            metaData.attr = 'ext:qtip="' + '<b>Inactiva</b>"';
                            metaData.css = 'icondistra-false rojo';
                        }
                    }
                }, {
                    sortable: true,
                    width: 10,
                    header: this.idioma.lbMatricula,
                    hideable: true,
                    dataIndex: 'matricula',
                }, {
                    sortable: true,
                    width: 10,
                    header: this.idioma.lbCombustible,
                    hideable: true,
                    dataIndex: 'nomcombustible'
                }, {
                    sortable: true,
                    width: 10,
                    header: this.idioma.lbPrecioComb,
                    hideable: true,
                    dataIndex: 'preciocombustible',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        return formatoMoneda(value);
                    }
                }, {
                    sortable: true,
                    width: 10,
                    header: this.idioma.lbFechaVence,
                    hideable: true,
                    dataIndex: 'fechavence'
                }, {
                    sortable: true,
                    width: 5,
                    header: this.idioma.lbMoneda,
                    hideable: true,
                    dataIndex: 'nommoneda'
                }, {
                    id: 'idColumCuenta',
                    sortable: true,
                    width: 15,
                    header: this.idioma.lbCuenta,
                    hideable: true,
                    dataIndex: 'nomcuenta'
                }, {
                    id: 'idColumSaldoContab',
                    sortable: true,
                    width: 10,
                    header: this.idioma.lbSaldoContab,
                    hideable: true,
                    dataIndex: 'saldocontable',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        return formatoMoneda(value);
                    }
                }, {
                    sortable: true,
                    width: 10,
                    header: this.idioma.lbSaldoTarjeta,
                    hideable: true,
                    dataIndex: 'saldomo',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        return formatoMoneda(value);
                    }
                }, {
                    sortable: true,
                    width: 10,
                    header: this.idioma.lbLitros,
                    hideable: true,
                    dataIndex: 'litros',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        if (record.data.idcombustible) {
                            return parseFloat(record.data.saldomo / record.data.preciocombustible).toFixed(2);
                        } else {
                            return '';
                        }
                    }
                }/*, this.rowaction*/
            ],
            tbar: [this.searchField, '-', this.cbEstado, '-', this.cbTipoTarjeta, '->', Caja.Componentes.cbEjercicio, '-', Caja.Componentes.cbPeriodo],
            bbar: this.pagToolTarjeta = new Ext.Cont.PagingToolbar({
                pageSize: 15,
                store: this.stTarjeta,
                displayInfo: true
            })
        });

        this.gpTarjeta.getView().getRowClass = function (record, index, rowParams, store) {
            var arrFechaVence = record.get('fechavence').split('/');
            var fechavence = new Date(arrFechaVence[2], arrFechaVence[1] - 1, arrFechaVence[0]);
            if ((fechavence - fechaContableDate)/(1000 * 3600 * 24) <= 15) {
                rowParams.tstyle += "background-color: #eddd8a;";
            } else {
                var style = rowParams.tstyle.split(';');
                if (style[0]) {
                    rowParams.tstyle = style[0] + ';';
                }
            }
        };
        this.items = [this.gpTarjeta];
    }
    ,
    createButtonPanel: function () {

        this.tbar = [
            this.btnAdicionar = new Ext.Button({
                iconCls: 'adicionar',
                text: this.idioma.lbAdicionar,
                tooltip: this.idioma.lbToolAdd
            }),
            this.btnModificar = new Ext.Button({
                iconCls: 'modificar',
                text: this.idioma.lbModificar,
                tooltip: this.idioma.lbToolMod,
                disabled: true,
            }),
            this.btnEliminar = new Ext.Button({
                iconCls: 'eliminar',
                text: this.idioma.lbEliminar,
                tooltip: this.idioma.lbToolDel,
                disabled: true,
                hidden: aperturadoCaja == 1
            }),
            this.btnCancelar = new Ext.Button({
                disabled: true,
                iconCls: 'activar',
                text: this.idioma.lbActInactivar,
                tooltip: this.idioma.lbToolActInact
            }),
            this.btnVistaReporte = new Ext.Button({
                disabled: true,
                iconCls: 'submayor',
                text: this.idioma.lbReporte,
                tooltip: this.idioma.lbToolReporte
            }),
            this.btnInventario = new Ext.Button({
                // disabled: true,
                iconCls: 'inventario',
                text: this.idioma.lbInventario,
                tooltip: this.idioma.lbToolInventario
            }),
            this.btnBalance = new Ext.Button({
                // disabled: true,
                iconCls: 'acumular',
                text: 'Balance',
                tooltip: 'Balance de combustible'
            }),
            this.btnImportar = new Ext.Button({
                id:'btnImportar',
                text:'Importar',
                tooltip: 'Importar tarjetas prepagadas de combustible',
                hidden: true,
                tabIndex: 314,
                iconCls: 'importar'
            }),
            '->',
            this.lfProveedor = new Ext.form.Label({
                id: 'lfdPeriodo',
                text: "Proveedor de tarjeta:\u00A0",
                style: 'font-weight:bold;'
            }),
            this.scope.cbProveedor,
            '-',
            this.cbxCuentaProevedor = new Ext.contabilidad.util.linkedCombo({
                store: this.stCuentaa = new Ext.data.Store({
                    url: 'cargarcuentas',
                    autoLoad: false,
                    reader: new Ext.data.JsonReader({
                        root: 'datos'
                    }, [
                        {name: 'idcuenta'},
                        {name: 'text'},
                        {name: 'idmoneda'},
                        {name: 'codigo'}
                    ])
                }),
                fieldLabel: 'Cuenta',
                loaded: true,
                allowBlank: true,
                singleSelection: false,
                leafSelect: false,
                qtip: 'text',
                displayField: 'text',
                valueField: 'idcuenta',
                selectField: 'codigo',
                listHeight: 300,
                anchor: '98%'
            }),
            '-',
            this.lfdPeriodo = new Ext.form.Label({
                id: 'lfdPeriodo',
                text: ' ',
                style: 'font-weight:bold;'
            }), '-',
            //Para el componente wincaja
            this.btnCaja = new Ext.Button({
                text: this.idioma.lbBtnCaja,
                tooltip: this.idioma.lbToolCaja,
                iconCls: 'caja'
            }),
            this.tfCaja = new Ext.form.TextField({
                name: 'tfCaja',
                disabledClass: 'disabled-component',
                readOnly: true,
                width: 130,
                enableKeyEvents: true
            }),
            this.btnAyuda = new Ext.Button({
                id: 'btnAyudaTarjetaRecarga',
                text: this.idioma.lbBtnAyuda,
                tooltip: this.idioma.lbToolAyuda,
                iconCls: 'ayuda'
            })
        ];
    }

    ,
    initEventos: function () {
        var me = this;

        // this.gpTarjeta.getView().getRowClass = function (record, index, rowParams, store) {
        //     if (record.json.enuso) {//Con operaciones
        //         return 'FilaVerde';
        //     }
        // };

        this.cbxCuentaProevedor.on({
            scope: this,
            blur: function (store, record, options) {
                Ext.Msg.wait('Guardando...', 'Por favor espere...');
                Ext.Ajax.request({
                    url: 'saveProveedor',
                    method: 'POST',
                    scope: this,
                    params: {
                        idProveedor: me.scope.cbProveedor.getValue(),
                        arrCuentas: Ext.encode(me.cbxCuentaProevedor.getValue())
                    },
                    callback: function (options, success, response) {
                        if (success) {
                            response = Ext.decode(response.responseText);
                            Ext.Msg.hide();
                        }
                    }
                });
            }
        });

        this.cbEstado.on({
            scope: this,
            select: function (cb, rc, idx) {
                var cbValue = parseInt(cb.getValue());
                switch (cbValue) {
                    case 1:
                        me.stTarjeta.baseParams.activo = 1;
                        break;
                    case 2:
                        me.stTarjeta.baseParams.activo = 0;
                        break;
                    default:
                        me.stTarjeta.baseParams.activo = null;
                }
                this.gpTarjeta.getBottomToolbar().changePage(0);
            }
        });

        this.cbTipoTarjeta.on({
            scope: this,
            select: function (cb, rc, idx) {
                var cbValue = parseInt(cb.getValue());
                switch (cbValue) {
                    case 1:
                        me.stTarjeta.baseParams.tipo = 1;
                        break;
                    case 2:
                        me.stTarjeta.baseParams.tipo = 2;
                        break;
                    default:
                        me.stTarjeta.baseParams.tipo = null;
                }
                this.gpTarjeta.getBottomToolbar().changePage(0);
            }
        });

        this.btnCaja.on({
            scope: this,
            click: function () {
                this.scope.loadWindowCaja(true);
            }
        });
        this.btnImportar.on({
            click: function fConfigurarImportar () {
            var self = this;
            //self.map.disable();
            this.winImportCmp = new SCFPrintData(new Object(), "/contabilidad/comun/SCFPrintView/", {
                reportType: "DISTRA_TARJETAS_COMBUSTIBLE",
                typeAction: 'import',
                idcaja:me.scope.idCaja
            });
            this.winImportCmp.show();
            this.winImportCmp.doLayout();
            this.winImportCmp.on({
                'show': function() {
                    self.map.disable();
                },
                'close': function() {
                    //self.map.enable();
                    // this.stRegistroComprobantes.load();
                }
            });
          }
        });
        this.btnAdicionar.on({
            scope: this,
            click: function (button, event) {
                this.winTarjeta = new Caja.Tarjetas.WindowTarjeta({
                    idioma: this.idioma,
                    scope: this,
                    action: 'add'
                });
                this.winTarjeta.show();
                this.winTarjeta.nfNumero.focus(true, true);

                var formArray = new Array();
                formArray.push(this.winTarjeta.formTarjeta);
                var arrbotones = new Array();
                arrbotones.push(this.winTarjeta.btnAplicar);
                arrbotones.push(this.winTarjeta.btnAceptar);
                this.scope.TaskFormValidation.startTaskValidation(this.action, formArray, arrbotones);
            }
        });

        this.btnModificar.on({
            scope: this,
            click: function (button, event) {
                var winTarjeta = new Caja.Tarjetas.WindowTarjeta({
                    idioma: this.idioma,
                    scope: this,
                    action: 'mod'
                });
                winTarjeta.show();
                winTarjeta.loadModData(me.smTarjeta.getSelected());
                winTarjeta.ckActivo.setVisible(false);
            }
        });

        this.btnEliminar.on({
            scope: this,
            click: function (button, event) {
                this.scope.keyMapa.disable();
                var me = this;
                var selections = this.smTarjeta.getSelections();
                var pregEliminar = (selections.length == 1) ? this.idioma.lbDelTarjetaConfir : this.idioma.lbDelTarjetasConfir;
                mostrarMensaje(2, pregEliminar, function (btnPress) {
                    if (btnPress === 'ok') {
                        me.deleteTarjeta(selections);
                    }
                    me.scope.keyMapa.enable();
                });
            }
        });

        this.btnCancelar.on({
            scope: this,
            click: function (button, event) {
                this.scope.keyMapa.disable();
                var me = this;
                var selected = this.smTarjeta.getSelected();
                //Activar
                if (selected.data.activo == 0) {
                    Ext.Msg.wait(this.idioma.lbActivando, this.idioma.lbEspere);
                    Ext.Ajax.request({
                        url: 'savetarjeta',
                        params: {
                            idtarjeta: selected.data.idtarjeta,
                            activar: true
                        },
                        callback: function (options, success, response) {
                            var respuesta = Ext.decode(response.responseText);

                            if (respuesta.codMg == '1') {
                                mostrarMensaje(1, me.idioma.lbActiSatisfact);
                                me.stTarjeta.reload();
                            }
                            Ext.MessageBox.hide();
                        }
                    });
                    return;
                }
                if (selected.data.saldomo > 0) {
                    return;
                }
                //Inactivar
                var pregCancelar = this.idioma.lbCancelTarjetaConfir;
                mostrarMensaje(2, pregCancelar, function (btnPress) {
                    if (btnPress === 'ok') {
                        var params = {
                            // idmotivo: objWinCancelar.cbmotivo.getValue(),
                            // fecha: objWinCancelar.dffechacancelacion.getRawValue(),
                            tipoContabilizacion: 2,//2-Cancelar
                            descripcion: 'Cancelando recarga: ',
                            selected: selected
                        };
                        me.cancelarTarjeta(params)
                    }
                    me.scope.keyMapa.enable();
                });
            }
        });

        this.btnVistaReporte.on({
            scope: this,
            click: function () {
                this.getDataReporte();
            }
        });

        this.btnInventario.on({
            scope: this,
            click: function () {
                this.getInventarioTarjeta(false);
            }
        });

        this.btnBalance.on({
            scope: this,
            click: function () {
                this.getInventarioTarjeta(true);
            }
        });
        //--------------------------------------------
        this.smTarjeta.on({
            scope: this,
            rowselect: function (smodel, rowIndex, record) {
                this.gpTarjeta.getView().addRowClass(rowIndex, "negrita");
                if (smodel.selections.length == 1) {
                    this.btnModificar.enable();
                    this.btnVistaReporte.enable();
                    this.btnCancelar.enable();
                    if (record.data.activo == 1) {
                        this.btnCancelar.setIconClass('icondistra-activar rojo');
                        this.btnCancelar.setText(this.idioma.lbInactivar);
                        this.scope.panelRecarga.btnAdicionar.enable();
                    } else {
                        this.btnCancelar.setIconClass('icondistra-activar');
                        this.btnCancelar.setText(this.idioma.lbActivar);
                        this.scope.panelRecarga.btnAdicionar.disable();
                    }
                    if (record.data.saldomo > 0)//Si tiene saldo no puedo desactivar la tarjeta
                        this.btnCancelar.disable();
                    else this.btnCancelar.enable();

                    if (aperturadoCaja == 0) {
                        this.btnEliminar.enable();
                    }
                }
            },
            rowdeselect: function (smodel, rowIndex, record) {
                this.gpTarjeta.getView().removeRowClass(rowIndex, "negrita");
                if (smodel.selections.length == 1) {
                    this.btnModificar.enable();
                    this.btnVistaReporte.enable();
                    this.btnCancelar.enable();
                    if (record.data.activo == 1) {
                        this.scope.panelRecarga.btnAdicionar.enable();
                    } else {
                        this.scope.panelRecarga.btnAdicionar.disable();
                    }
                    if (aperturadoCaja == 0) {
                        this.btnEliminar.enable();
                    }
                }
                if (smodel.selections.length == 0) {
                    this.btnCancelar.setIconClass('icondistra-activar');
                    this.btnCancelar.setText(this.idioma.lbActInactivar);
                    this.btnModificar.disable();
                    this.btnEliminar.disable();
                    this.btnCancelar.disable();
                    this.btnVistaReporte.disable();
                    if (aperturadoCaja == 1) {
                        this.scope.panelRecarga.smRecarga.clearSelections();
                    }
                }
            },
            selectionchange: function () {
                this.scope.panelRecarga.setTitle(this.idioma.lbTitleRecargas);
                this.scope.panelRecarga.stRecarga.removeAll();
                this.scope.panelRecarga.btnAdicionar.disable();
            }
        });
        this.gpTarjeta.on({
            scope: this,
            rowclick: function (grid, rowIndex, e) {
                if (aperturadoCaja == 1) {
                    if (this.smTarjeta.getSelections().length == 1 && !Ext.isEmpty(this.smTarjeta.getSelected().data.nomcuenta) && this.smTarjeta.getSelected().data.activo == 1) {
                        this.scope.panelRecarga.setTitle(String.format(this.idioma.lbTitleRecargaTar, this.smTarjeta.getSelected().data.numero));
                        if (aperturadoCaja == 1) {//Solo puse adicionar recarga si esta en el flujo normal
                            this.scope.panelRecarga.btnAdicionar.enable();
                            this.scope.panelRecarga.stRecarga.reload();
                        }
                    } else {
                        this.scope.panelRecarga.setTitle(this.idioma.lbTitleRecargas);
                        this.scope.panelRecarga.stRecarga.removeAll();
                        this.scope.panelRecarga.btnAdicionar.disable();
                    }
                }
            }
        });

        Caja.Componentes.cbPeriodo.on({
            scope: this,
            select: function (cb, record) {
                this.scope.panelRecarga.gpRecarga.getBottomToolbar().changePage(0);
            }
        });

        this.stTarjeta.on({
            beforeload: function () {
                me.btnModificar.disable();
                me.btnCancelar.disable();
                me.btnVistaReporte.disable();
                me.scope.panelRecarga.btnAdicionar.disable();
                me.scope.panelRecarga.stRecarga.removeAll();
                if (me.smTarjeta.hasSelection())
                    me.idTarjeta = me.smTarjeta.getSelected().data.idtarjeta;
                else me.idTarjeta = null;
            },
            load: function (st, recors) {
                if (me.idTarjeta) {
                    var index = me.stTarjeta.find('idtarjeta', me.idTarjeta);
                    me.smTarjeta.selectRow(index);
                    me.gpTarjeta.fireEvent('rowclick', me.gpTarjeta, 0);
                } else {
                    me.smTarjeta.selectFirstRow();
                    me.gpTarjeta.fireEvent('rowclick', me.gpTarjeta, 0);
                }
            }
        });

    }
    ,
    initFunctions: function () {
        var me = this;
        this.searchTarjeta = function (filter) {
            this.stTarjeta.baseParams.filter = filter;
            this.gpTarjeta.getBottomToolbar().changePage(0);
            this.stTarjeta.on({
                scope: this,
                load: function (store, records, options) {
                    if (!records.length && filter)
                        mostrarMensaje(1, me.idioma.lbNoDatosPorCriterios);
                    else if (!records.length) {
                        mostrarMensaje(1, me.idioma.lbNoDatos);
                    }
                }
            });
        };

        this.deleteTarjeta = function (selections) {

            Ext.Msg.wait(this.idioma.lbEliminado, this.idioma.lbEspere);
            var arrayIdTarjeta = new Array();
            for (var i = 0; i < selections.length; i++) {
                arrayIdTarjeta.push(selections[i].data.idtarjeta);
            }
            var msgSuccess = (arrayIdTarjeta.length == 1) ? this.idioma.lbDelTarjetaSatisfact : this.idioma.lbDelTarjetasSatisfact;

            Ext.Ajax.request({
                scope: this,
                url: 'deletetarjeta',
                params: {
                    arrayIdTarjeta: Ext.encode(arrayIdTarjeta)
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.codMg == '1') {//Elimino
                        mostrarMensaje(1, msgSuccess);
                        this.stTarjeta.reload();
                    } else {
                        mostrarMensaje(1, 'No se pudo eliminar la tarjeta.');
                    }
                    Ext.MessageBox.hide();
                }
            });
        };

        //Cancelar tarjeta-----------------------------------------------------
        //Metodos de para el proceso de POSTEAR----------------------------------------------
        this.fLoadDataComprobante = function (params) {
            Ext.Msg.wait(this.idioma.lbLoadDataComprobante, this.idioma.lbEspere);
            Ext.Ajax.request({
                url: 'loadDataCompCancelarTarjeta',
                method: 'POST',
                scope: this,
                params: {
                    idTarjeta: me.smTarjeta.getSelected().data.idtarjeta,
                    tipoContabilizacion: params.tipoContabilizacion,//Cancelando
                    idProveedor: me.scope.cbProveedor.getValue(),
                    idMoneda: me.scope.panelTarjeta.smTarjeta.getSelected().data.idmoneda
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData == '-1') {
                        mostrarMensaje(1, this.idioma.lbNoCancelTarjeta);
                        Ext.MessageBox.hide();
                    } else if (responseData == '-2') {
                        mostrarMensaje(1, this.idioma.lbNoCtaPagoAntcipado);
                        Ext.MessageBox.hide();
                    } else {
                        me.fShowComprobante(responseData, params);
                    }
                }.bind(this)
            });
        };

        //Construir y mostrar el comprobante
        this.fShowComprobante = function (respData, params) {
            var idSubsistema = 14;//Caja
            var idTipoComprobante = 3;//comprobante tipo operaciones
            var descripcion = params.descripcion + respData.descripcion;
            var detalle = params.descripcion + respData.detalle;

            // Ext.MessageBox.hide();
            Ext.Cont.Comprobante.init(idSubsistema, detalle, descripcion, respData.fechaCont, respData.dataComprobante, idTipoComprobante, 1, 1).onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                Ext.Msg.wait(this.idioma.lbGuardandoComprobante, this.idioma.lbEspere);
                me.cancelarTarjeta(params);
            }.bind(this)).onClose(function () {
                me.scope.keyMapa.enable();
            });
        };
//-------------------------------------------------------------------

        this.cancelarTarjeta = function (params) {

            Ext.Msg.wait(this.idioma.lbCancelando, this.idioma.lbEspere);
            var msgSuccess = this.idioma.lbCancelTarjetaSatisfact;

            Ext.Ajax.request({
                scope: this,
                url: 'cancelartarjeta',
                params: {
                    idTarjeta: params.selected.data.idtarjeta,
                    idmotivo: params.idmotivo,
                    fecha: params.fecha
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.codMg == '1') {//Cancelado
                        mostrarMensaje(1, msgSuccess);
                        this.stTarjeta.reload();
                        this.scope.panelRecarga.btnAdicionar.disable();
                        Ext.MessageBox.hide();
                    }
                }
            });
        };
        //---------------------------------------------------------------------------
        this.selectionsOnPaging = function () {
            var arrayValues = new Array();
            var instance = new PagingToolbarSelections({
                'selections': this.gpCaja.getSelectionModel().getSelections(),
                'activePage': this.gpCaja.getBottomToolbar().getPageData().activePage
            });
            return instance.getSelectionsOnArray(arrayValues);
        };

        this.getDataReporte = function () {
            this.scope.keyMapa.disable();
            Ext.Msg.wait(this.idioma.lbCargando, this.idioma.lbEspere);
            var selectData = this.smTarjeta.getSelected().data;
            Ext.Ajax.request({
                scope: this,
                url: 'getDataReporte',
                method: 'POST',
                params: {
                    idTarjeta: selectData.idtarjeta,
                    idPeriodo: Caja.Componentes.cbPeriodo.getValue()
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == -1) {
                        this.scope.keyMapa.enable();
                        mostrarMensaje(1, me.idioma.lbNoOperRegistradas);
                    }
                    else {
                        me.fOpenWindowReport(responseData.dataSources);
                    }
                    Ext.MessageBox.hide();
                }
            });
        };

        this.fOpenWindowReport = function (dataSources) {
            defaultComponentsValue = {
                paperSize: "A4",
                orientation: "Horizontal",
                reportType: "HTML"
            };
            var printView = new SCFPrintView(dataSources, "/contabilidad/comun/SCFPrintView/", defaultComponentsValue);
            printView.on({
                scope: this,
                close: function () {
                    this.scope.keyMapa.enable();
                }
            });
            printView.show();
        };

        this.getInventarioTarjeta = function (balance) {
            this.scope.keyMapa.disable();
            Ext.Msg.wait(this.idioma.lbCargando, this.idioma.lbEspere);
            Ext.Ajax.request({
                scope: this,
                url: 'getInventarioTarjeta',
                method: 'POST',
                params: {
                    idCaja: me.scope.idCaja,
                    estadoTarjeta: me.cbEstado.getValue(),
                    tipoTarjeta: me.cbTipoTarjeta.getValue(),
                    idPeriodo: Caja.Componentes.cbPeriodo.getValue(),
                    balance: balance
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == -1) {
                        this.scope.keyMapa.enable();
                        mostrarMensaje(1, me.idioma.lbNoOperRegistradas);
                    } else {
                        me.fOpenWindowReport(responseData.dataSources);
                    }
                    Ext.MessageBox.hide();
                }
            });
        };

    }
});

//--Componete Window Tarjetas
Caja.Tarjetas.WindowTarjeta = Ext.extend(Ext.Window, {
    constructor: function (params) {
        Ext.apply(this, params);
        Ext.apply(this, {
            autoValidate: false,
            modal: true,
            constrain: true,
            width: Ext.lib.Dom.getViewWidth() * 0.40,
            closeAction: 'close',
            frame: true,
            resizable: false,
            idioma: params.idioma,
            title: this.action == 'add' ? this.idioma.lbTitleAddTarjeta : this.idioma.lbTitleModTarjeta,
            listeners: {
                scope: this,
                show: function () {
                    this.scope.scope.keyMapa.disable();
                },
                close: function () {
                    this.scope.scope.keyMapa.enable();
                    this.scope.scope.TaskFormValidation.stopTaskValidation();
                }
            }
        });
        this.createButtons();
        this.createForm();
        this.initFunctions();
        this.initEventos();
        Caja.Tarjetas.WindowTarjeta.superclass.constructor.call(this);
    },
    initEventos: function () {
        this.btnAceptar.on({
            scope: this,
            click: function () {
                this.saveTarjeta(false);
            }
        });
        this.btnAplicar.on({
            scope: this,
            click: function () {
                this.saveTarjeta(true);
            }
        });
        this.btnCancelar.on({
            scope: this,
            click: function () {
                this.close();
            }
        });

        this.cbVehiculo.on({
            scope: this,
            select: function (cb, record) {
                this.tfMatricula.setValue(record.data.matricula);
                if (record.data.idcombustible) {//Si viene idcombustible es porque esta usando los vehiculso de caja
                    this.cbCombustible.setValue(record.data.idcombustible);
                    this.cbCombustible.disable();
                    this.nfPrecio.setValue(record.data.preciocombustible);
                    this.nfPrecio.setRawValue(formatoMoneda(record.data.preciocombustible));
                } else {//Si ni lo habilito
                    this.cbCombustible.enable();
                }
                //Setear el responsable del vehiculo
                var recordPersona = {data: [{idpersona: record.data.idpersona, nombre: record.data.nompersona}]};
                this.stPersona.loadData(recordPersona);
                this.cbPersona.setValue(record.data.idpersona);
            }
        });

        this.cbxCuenta.on({
            scope: this,
            select: function (cb, record) {
                this.cbMoneda.setValue(record.data.idmoneda);
                if (this.scope.scope.aperturaTarjeta) {
                    this.lMaskCargando();
                    this.buscarSaldoCuenta(this.cbxCuenta.getValue());//Verifica que la cuenta no esté en uso por otra tarjeta
                }
            }
        });

        this.cbTipoTarjetaa.on({
            scope: this,
            select: function (cb, record) {
                var identificador = record.get('id');
                this.validacionDeTipoTarjeta(identificador);
            }
        });
    },
    createButtons: function () {
        this.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            //icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            selectOnFocus: true,
            //disabled: true,
            text: this.idioma.lbCancelar,
            tooltip: this.idioma.lbToolCancelar,
            scope: this,
            handler: function () {
                this.close();
            }
        });
        this.btnAplicar = new Ext.Button({
            id: 'btnAplicar',
            // icon: perfil.dirImg + 'aplicar.png',
            iconCls: 'aplicar',
            //disabled: true,
            hidden: this.action == 'add' ? false : true,
            text: this.idioma.lbAplicar,
            tooltip: this.idioma.lbToolAplicar
        });
        this.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            //icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            //disabled: true,
            text: this.idioma.lbAceptar,
            tooltip: this.idioma.lbToolAceptar
        });
        this.buttons = [this.btnCancelar, this.btnAplicar, this.btnAceptar];
    },
    createForm: function () {

        //Combo Moneda
        this.rdMoneda = new Ext.data.JsonReader({
            root: 'datos'
        }, [{
            name: 'nombremoneda'
        }, {
            name: 'codigoiso'
        }, {
            name: 'idmoneda'
        }, {
            name: 'idmonedaentidad'
        }
        ]);
        this.stMoneda = new Ext.data.Store({
            url: 'cargarmonedas',
            reader: this.rdMoneda,
            autoLoad: true
        });

        this.cbMoneda = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            name: 'idmoneda',
            selectOnFocus: true,
            editable: true,
            disabled: true,
            emptyText: this.idioma.lbSeleccione,
            // width: 50,
            allowBlank: true,
            tabIndex: 3,
            store: this.stMoneda,
            valueField: 'idmoneda',
            displayField: 'codigoiso',
            hiddenName: 'idmoneda',
            enableKeyEvents: true,
            typeAhead: true,
            readOnly: true,
            mode: 'local',
            triggerAction: 'all',
            fieldLabel: this.idioma.lbMoneda,
            anchor: '95%',
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.btnAceptar.focus();
                }
            }
        });

        this.stPersona = new Ext.data.Store({
            url: 'cargarpersonas',
            sortInfo: {
                field: 'nombre',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total'
            }, [{
                name: 'idpersona'
            }, {
                name: 'nombre'
            }, {
                name: 'numid'
            }, {
                name: 'cargo'
            }
            ])
        });

        this.cbPersona = new Ext.form.ComboBox({
            fieldLabel: this.idioma.lbResponsable,
            store: this.stPersona,
            valueField: 'idpersona',
            hiddenName: 'idpersona',
            displayField: 'nombre',
            emptyText: this.idioma.lbSeleccione, //'Seleccione...',
            disabledClass: 'disabled-component',
            //editable: true,
            forceSelection: true,
            allowBlank: true,
            resizable: true,
            //readOnly: true,
            triggerAction: 'all',
            anchor: '97%',
            minChars: 1, //Para la nueva busqueda poner contraria esta linea
            pageSize: 10, //Para la nueva busqueda poner contraria esta linea
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{numid} {nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            selectOnFocus: true,
            enableKeyEvents: true,
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.cbCombustible.focus();
                },
                keydown: function (tf, e) {
                    if (e.getCharCode() === 46) {//delete
                        e.preventDefault();
                        tf.clearValue();
                    }
                }
            }
        });

        this.stCuenta = new Ext.data.Store({
            url: 'cargarcuentas',
            // autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idcuenta'},
                {name: 'text'},
                {name: 'idmoneda'},
                {name: 'codigoiso'}
            ])
        });

        this.cbxCuenta = new Ext.contabilidad.util.linkedCombo({
            disabledClass: 'disabled-component',
            store: this.stCuenta,
            fieldLabel: this.idioma.lbCuenta,
            displayField: 'text',
            valueField: 'idcuenta',
            allowBlank: true,
            listHeight: 200,
            tabIndex: 4,
            anchor: '97%',
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.nfSaldo.focus();
                }
            }
        });

        this.stVehiculo = new Ext.data.Store({
            url: 'obtenervehiculos',
            method: 'POST',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total'
            }, [{
                name: 'denominacion'
            }, {
                name: 'nomdenominacion'
            }, {
                name: 'matricula'
            }, {
                name: 'idcombustible'
            }, {
                name: 'combustible'
            }, {
                name: 'arearesp'
            }, {
                name: 'denommarca'
            }, {
                name: 'idarearesp'
            }, {
                name: 'denommodelo'
            }, {
                name: 'idcentrocosto'
            }, {
                name: 'idpersona'
            }, {
                name: 'nompersona'
            }, {
                name: 'preciocombustible'
            }, {
                name: 'idvehiculocaja'
            }, {
                name: 'idvehiculo',
                // mapping: 'idregnumerico'
            }
            ]),
            sortInfo: {
                field: 'denominacion',
                direction: "ASC"
            },
            autoLoad: true
        });

        this.cbVehiculo = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            fieldLabel: this.idioma.lbVehiculo,
            store: this.stVehiculo,
            name: 'vehiculo',
            valueField: 'idvehiculo',
            // hiddenName: 'idvehiculo',
            displayField: 'denominacion',
            emptyText: this.idioma.lbSeleccione, //'Seleccione...',
            forceSelection: true,
            allowBlank: true,
            resizable: true,
            readOnly: true,
            triggerAction: 'all',
            anchor: '95%',
            lazyRender: true,
            mode: 'local',
            tpl: '<tpl for="."><div ext:qtip="{nomdenominacion}" class="x-combo-list-item">{nomdenominacion}</div></tpl>',
            selectOnFocus: true,
            enableKeyEvents: true,
        });
//----------------------------------------
        this.stCombustible = new Ext.data.Store({
            // url: 'obtenercombustible',
            method: 'POST',
            reader: new Ext.data.JsonReader({
                // root: 'data',
                totalProperty: 'total'
            }, [{
                name: 'denominacion'
            }, {
                name: 'idcombustible'
            }, {
                name: 'precio'
            }]),
            sortInfo: {
                field: 'denominacion',
                direction: "ASC"
            }
        });
        this.stCombustible.loadData(this.scope.scope.dataCombustible);

        this.cbCombustible = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            fieldLabel: this.idioma.lbCombustible,
            store: this.stCombustible,
            valueField: 'idcombustible',
            // hiddenName: 'idvehiculo',
            displayField: 'denominacion',
            emptyText: this.idioma.lbSeleccione, //'Seleccione...',
            forceSelection: true,
            allowBlank: false,
            resizable: true,
            readOnly: true,
            triggerAction: 'all',
            anchor: '95%',
            lazyRender: true,
            mode: 'local',
            // tpl: '<tpl for="."><div ext:qtip="{numid} {nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            selectOnFocus: true,
            enableKeyEvents: true,
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    console.log('especial', e.getCharCode());
                    if (e.getCharCode() == Ext.EventObject.ENTER) {
                        this.nfPrecio.focus();
                    }
                },
                keydown: function (tf, e) {
                    console.log(e.getCharCode());
                    if (e.getCharCode() == Ext.EventObject.BACKSPACE) {
                        e.preventDefault();
                        tf.clearValue();
                        this.nfPrecio.setValue('');
                    }
                },
                select: function (cb, record) {
                    this.nfPrecio.setValue(record.data.precio);
                    this.nfPrecio.setRawValue(formatoMoneda(record.data.precio));
                }
            }
        });

        this.tfMatricula = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            readOnly: true,
            allowBlank: true,
            fieldLabel: this.idioma.lbMatricula,
            maxLength: 16,
            anchor: '100%',
            name: 'matricula',
            // maskRe: /^([0-9\(1)]+ ?[0-9]*)+$/,
            // regex: /^([0-9\(1)]+ ?[0-9]*)+$/,
            maxLengthText: this.idioma.lbMaxLengthText16,
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.cbPersona.focus();
                }
            }
        });

        // this.nfNumero = new Ext.form.NumberField({
        this.firstElement = this.nfNumero = new Ext.form.TextField({
            allowBlank: false,
            disabledClass: 'disabled-component',
            anchor: '100%',
            fieldLabel: this.idioma.lbTarjeta,
            maxLength: 16,
            name: 'numero',
            // allowDecimals: false,
            // allowNegative: false,
            maskRe: /^([0-9\(1)]+ ?[0-9]*)+$/,
            regex: /^([0-9\(1)]+ ?[0-9]*)+$/,
            maxLengthText: this.idioma.lbMaxLengthText16,
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.cbVehiculo.focus();
                }
            }
        });

        this.nfPrecio = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            allowBlank: false,
            anchor: '95%',
            fieldLabel: this.idioma.lbPrecioComb,
            maxLength: 16,
            readOnly: true,
            name: 'precio',
            style: 'text-align: right',
            maxLengthText: this.idioma.lbMaxLengthText16,
            validator: function (value) {
                if (value > 0)
                    return true;
                return 'El importe no puede ser 0.';
            },
            listeners: {
                scope: this,
                blur: function (cb) {
                    if (cb.getValue()) {
                        cb.setRawValue(formatoMoneda(cb.getValue()));
                    }
                },
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.cbxCuenta.focus();
                }
            }
        });

        this.nfSaldo = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            allowBlank: false,
            anchor: '95%',
            fieldLabel: 'Saldo',
            maxLength: 16,
            disabled: (aperturadoCaja == 0 && !this.scope.scope.aperturaTarjeta) ? false : true,
            name: 'saldomo',
            style: 'text-align: right',
            maxLengthText: this.idioma.lbMaxLengthText16,
            allowNegative: false,
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.dfFechaVence.focus();
                }
            }
        });

        this.dfFechaVence = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            name: 'fechavence',
            fieldLabel: this.idioma.lbFechaVence,
            allowBlank: false,
            // invalidText: this.idioma.lbInvalidFecha,
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            anchor: '100%',
            // maxValue: new Date(),
            enableKeyEvents: true
        });
        //------Activo----
        this.ckActivo = new Ext.form.Checkbox({
            name: 'activo',
            hideLabel: true,
            boxLabel: this.idioma.lbActiva,
            checked: true
        });
        //-------------------------------------

        this.cbTipoTarjetaa = new Ext.form.ComboBox({
            store: new Ext.data.SimpleStore({
                fields: ['id', 'tipo'],
                data: [
                    [1, 'Combustible'],
                    [2, 'Peaje']
                ]
            }),
            // width: 110,
            anchor: '95%',
            style: 'margin:0 0 0 0',
            emptyText: 'Seleccionar...',
            displayField: 'tipo',
            triggerAction: 'all',
            fieldLabel: 'Tipo de tarjeta',
            value: 1,
            valueField: 'id',
            hiddenName: 'id',
            mode: 'local',
            typeAhead: true,
            editable: false,
            resizable: true,
            forceSelection: true,
            selectOnFocus: true
        });

        this.formTarjeta = new Ext.FormPanel({
            frame: true,
            layout: 'form',
            autoHeight: true,
            labelWidth: 50,
            labelAlign: 'top',
            trackResetOnLoad: true,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .5,
                    layout: 'form',
                    items: [this.cbTipoTarjetaa]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    items: [this.nfNumero]
                    // items: [this.tfVehiculo]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: .5,
                    layout: 'form',
                    items: [this.cbVehiculo]
                    // items: [this.tfVehiculo]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    items: [this.tfMatricula]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: .4,
                    layout: 'form',
                    items: [this.cbPersona]
                }, {
                    columnWidth: .3,
                    layout: 'form',
                    items: [this.cbCombustible]
                }, {
                    columnWidth: .3,
                    layout: 'form',
                    items: [this.nfPrecio]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: .4,
                    layout: 'form',
                    items: [this.cbxCuenta]
                }, {
                    columnWidth: .15,
                    layout: 'form',
                    items: [this.cbMoneda]
                }, {
                    columnWidth: .15,
                    layout: 'form',
                    items: [this.nfSaldo]
                }, {
                    columnWidth: this.action == 'add' ? .18 : .28,
                    layout: 'form',
                    items: [this.dfFechaVence]
                }, {
                    style: 'margin: 10 0 0 10',
                    columnWidth: .12,
                    layout: 'form',
                    hidden: this.action == 'mod',
                    items: [this.ckActivo]
                }]
            }]
        });

        this.items = [this.formTarjeta];
    },
    initFunctions: function () {
        var me = this;
        this.todosStoresCargados = 1;
        this.loadModData = function (select) {
            this.lMaskCargando();
            this.cbxCuenta.setValue(select.data.idcuenta, select.data.nomcuenta);
            if (select.data.enuso) {
                this.nfNumero.disable();
                this.cbxCuenta.disable();
                //this.cbCombustible.disable();
            }
            //Permitir seleccionar la cuenta si la tarjeta esta activa y no tiene ninguna cuenta
            if (select.data.nomcuenta == '' && select.data.activo == 1) {
                this.cbxCuenta.enable();
            }
            //Si caja esta en CI y no estan aperturadas las tarjetas en la contabilidad no permitir escribir en el campo saldo
            if (aperturadoCaja == 0 && !this.scope.scope.aperturaTarjeta) {
                this.nfSaldo.enable();
            } else {
                this.nfSaldo.disable();
            }

            var recordPersona = {data: [{idpersona: select.data.idpersona, nombre: select.data.nompersona}]};
            this.stPersona.loadData(recordPersona);
            this.cbPersona.setValue(select.data.idpersona);
            this.cbVehiculo.setValue(select.data.vehiculo);
            this.formTarjeta.getForm().loadRecord(select);
            if (select.data.idcombustible) {
                this.cbCombustible.setValue(select.data.idcombustible);
                this.nfPrecio.setValue(select.data.preciocombustible);
                this.nfPrecio.fireEvent('blur', this.nfPrecio);
            }
            this.cbTipoTarjetaa.setValue(select.data.tipo);
            this.cbTipoTarjetaa.disable();
            this.validacionDeTipoTarjeta(select.data.tipo);
            if (select.data.idvehiculocaja)
                this.cbCombustible.disable();
            this.stMoneda.on({
                scope: this,
                load: function () {
                    this.cbMoneda.setValue(select.data.idmoneda);
                    if (this.todosStoresCargados == 1) this.todosStoresCargados--;
                    else {
                        this.lMask.hide();
                        var formArray = new Array();
                        formArray.push(this.formTarjeta);
                        var arrbotones = new Array();
                        arrbotones.push(this.btnAplicar);
                        arrbotones.push(this.btnAceptar);
                        this.scope.scope.TaskFormValidation.startTaskValidation(this.action, formArray, arrbotones);
                    }
                }
            });
            this.stVehiculo.on({
                scope: this,
                load: function () {
                    this.cbVehiculo.setValue(select.data.idvehiculo);
                    if (this.todosStoresCargados == 1) this.todosStoresCargados--;
                    else {
                        this.lMask.hide();
                        var formArray = new Array();
                        formArray.push(this.formTarjeta);
                        var arrbotones = new Array();
                        arrbotones.push(this.btnAplicar);
                        arrbotones.push(this.btnAceptar);
                        this.scope.scope.TaskFormValidation.startTaskValidation(this.action, formArray, arrbotones);
                    }
                }
            });
            me.btnCancelar.focus();
        };

        this.saveTarjeta = function (aplicar) {
            var me = this;
            if (this.formTarjeta.getForm().isValid()) {
                var msgSuccess = me.action == 'add' ? this.idioma.lbAddTarjetaSatisfact : this.idioma.lbModTarjetaSatisfact;
                Ext.Msg.wait(this.idioma.lbGuardando, this.idioma.lbEspere);

                var vehiculocaja = 0;
                var indexVehiculo = this.cbVehiculo.store.find('idvehiculocaja', this.cbVehiculo.getValue());
                if (indexVehiculo >= 0) {
                    vehiculocaja = 1;
                }

                Ext.Ajax.request({
                    url: 'savetarjeta',
                    params: {
                        idcaja: me.scope.scope.idCaja,
                        idtarjeta: me.action == 'mod' ? me.scope.smTarjeta.getSelected().data.idtarjeta : -1,
                        numero: this.nfNumero.getValue(),
                        idvehiculo: this.cbVehiculo.getValue(),
                        vehiculocaja: vehiculocaja,
                        vehiculo: this.cbVehiculo.getRawValue(),
                        matricula: this.tfMatricula.getValue(),
                        idpersona: this.cbPersona.getValue(),
                        idcuenta: this.cbxCuenta.getValue(),
                        idmoneda: this.cbMoneda.getValue(),
                        idcombustible: this.cbCombustible.getValue(),
                        fechavence: this.dfFechaVence.getRawValue(),
                        saldo: this.nfSaldo.getValue(),
                        activo: this.ckActivo.getValue() ? 1 : 0,
                        tipotarjeta: this.cbTipoTarjetaa.getValue(),
                        enuso: me.action == 'mod' ? (me.scope.smTarjeta.getSelected().data.enuso ? 1 : 0) : 0
                    },
                    callback: function (options, success, response) {
                        var respuesta = Ext.decode(response.responseText);
                        if (respuesta.codMg == '1') {
                            mostrarMensaje(1, msgSuccess);
                            if (aplicar)
                                me.formTarjeta.getForm().reset();
                            else {
                                me.close();
                                me.scope.stTarjeta.reload();
                            }
                        } else if (respuesta.codMg == '-1') {
                            mostrarMensaje(1, me.idioma.lbNumTarjetaExist);
                        }
                        Ext.MessageBox.hide();
                    }
                });
            }
        };

        this.buscarSaldoCuenta = function (idCuenta) {
            Ext.Ajax.request({
                url: 'verificarCuenta',
                scope: this,
                params: {
                    idCuenta: idCuenta,
                    idTarjeta: me.action == 'mod' ? me.scope.smTarjeta.getSelected().data.idtarjeta : -1
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.codMg == '-1') {
                        mostrarMensaje(1, me.idioma.lbCtaEnUso);
                        me.cbxCuenta.reset();
                    } else {
                        me.nfSaldo.setValue(respuesta.saldoCuenta);
                    }
                    this.lMask.hide();
                }
            });
        };

        this.lMaskCargando = function () {
            this.lMask = new Ext.LoadMask(me.body, {//body de la ventana
                msg: this.idioma.lbCargando
            });
            this.lMask.show();
        };

        this.validacionDeTipoTarjeta = function (identificador) {
            if (identificador == 1) {
                this.cbCombustible.allowBlank = false;
                this.nfPrecio.allowBlank = false;
            } else if (identificador == 2) {
                this.cbCombustible.allowBlank = true;
                this.nfPrecio.allowBlank = true;
            }
        };

    }

});