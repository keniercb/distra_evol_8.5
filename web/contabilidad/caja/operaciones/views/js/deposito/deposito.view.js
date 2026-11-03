/**
 * Created by furet on 13/10/15.
 */
Ext.namespace('Caja.Deposito');

//--Componete Panel Deposito
Caja.Deposito.PanelDeposito = Ext.extend(Ext.Panel, {
    idfuncionalidad: window.parent.idFuncionalidad,
    constructor: function (params) {

        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            border: false,
            region: 'center',
            frame: false,
            labelAlign: 'top',
            buttonAlign: 'right',
            title: this.idioma.lbGestCaja,
            idioma: params.idioma,
            perfil: params.perfil
        });
        this.createGrid();
        this.createButton();
        this.initEventos();
        this.initFunctions();

        Caja.Deposito.PanelDeposito.superclass.constructor.call(this);
    },
    createButton: function () {
        this.tbar = [
            this.btnAddDeposito = new Ext.Button({
                id: 'btnAddDeposito',
                selectOnFocus: true,
                iconCls: 'adicionar',
                text: this.idioma.lbAdicionar,
                tooltip: this.idioma.lbToolAdicionar
            }),
            this.btnModDeposito = new Ext.Button({
                id: 'btnModDeposito',
                //icon: this.perfil.dirImg + 'modificar.png',
                iconCls: 'modificar',
                disabled: true,
                text: this.idioma.lbModificar,
                tooltip: this.idioma.lbToolModificar
            }),
            this.btnCancelDeposito = new Ext.Button({
                disabled: true,
                id: 'btnCancelDeposito',
                //icon: this.perfil.dirImg + 'cancelar.png',
                iconCls: 'cancelar',
                text: this.idioma.lbCancelar,
                tooltip: this.idioma.lbToolCancelar
            }),
            this.btnConfDeposito = new Ext.Button({
                disabled: true,
                id: 'btnConfDeposito',
                //icon: this.perfil.dirImg + 'confirmar.png',
                iconCls: 'confirmar',
                text: this.idioma.lbConfirmar,
                tooltip: this.idioma.lbToolConfirmar
            }),
            this.btnContatabDeposito = new Ext.Button({
                disabled: true,
                id: 'btnContatabDeposito',
                //icon: this.perfil.dirImg + 'contabilidad.png',
                iconCls: 'contabilidad',
                text: this.idioma.lbContabilizar,
                tooltip: this.idioma.lbToolContabilizar
            }),
            '->',
            this.lfdPeriodo = new Ext.form.Label({
                id: 'lfdPeriodo',
                text: ' ',
                style: 'font-weight:bold;'
            }),
            '-',
            this.btnFondo = new Ext.Button({
                text: this.idioma.lbFondo,
                tooltip: this.idioma.lbToolFondo,
                //icon: this.perfil.dirImg + 'abrirventana.png',
                iconCls: 'fondo'
            }),
            this.tfFondo = new Ext.form.TextField({
                scope: this,
                disabledClass: 'disabled-component',
                selectOnFocus: true,
                id: 'tfFondo',
                disabled: true,
                width: 150,
                anchor: '100%'
            }),
            this.btnAyuda = new Ext.Button({
                id: 'btnAyudaDepo',
                text: this.idioma.lbBtnAyuda,
                tooltip: this.idioma.lbToolAyuda,
                //icon: this.perfil.dirImg + 'ayuda.png',
                iconCls: 'ayuda'
            })
            //'->', '<b>'+Caja.Deposito.Caja.denominacion, '<b> - Fecha contable: ' + Caja.Deposito.Fecha
        ]
    },
    createGrid: function () {

        this.searchField = new Ext.Cont.SearchField({
            labelField: 'Numero',
            width: (Ext.lib.Dom.getViewWidth() - 10) * 0.1,
            maskRe: /^([0-9])+$/,
            regex: /^([0-9])+$/,
            //maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda ]*$/,
            scope: this,
            fnOnSearch: function () {
                //me.searchCaja(me.searchField.getRawValue());
                this.stDeposito.baseParams.numero = this.searchField.getRawValue();
                this.stDeposito.reload();
            }.bind(this),
            fnOnClear: function () {
                //me.searchCaja('');
            }
        });

        this.tfNumero = new Ext.form.TextField({
            name: 'tfNumero',
            anchor: '100%',
            maskRe: /^([0-9])+$/,
            regex: /^([0-9])+$/,
            allowBlank: true,
            emptyText: 'Criterio a buscar...',
            enableKeyEvents: true,
            width: 110,
        });

        var dataEstados = [[8, 'Guardado'], [5, 'Confirmado'], [6, 'Posteado'], [7, 'Cancelado']];

        this.stEstado = new Ext.data.SimpleStore({
            fields: ['idestado', 'nombre']
        });
        this.stEstado.loadData(dataEstados);

        this.tfEstado = new Ext.form.ComboBox({
            emptyText: 'Seleccione...',
            editable: false,
            allowBlank: true,
            store: this.stEstado,
            valueField: 'idestado',
            displayField: 'nombre',
            hiddenName: 'idestado',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            enableKeyEvents: true,
            width: 110,
        });

        this.btnBuscar = new Ext.Button({
            text: this.idioma.lbBuscar,
            tooltip: this.idioma.tooltipBuscar,
            //icon: perfil.dirImg + 'buscar.png',
            disabled: true,
            iconCls: 'buscar'
        });

        this.rdDeposito = new Ext.data.JsonReader({
            root: 'datos',
            totalProperty: 'cant'
        }, [{
            name: 'numero'
        }, {
            name: 'comentario'
        }, {
            name: 'fecha'
        }, {
            name: 'importemo'
        }, {
            name: 'numcomprobante',
        }, {
            name: 'idestado'
        }, {
            name: 'estado'
        }, {
            name: 'idcuentabancaria'
        }, {
            name: 'idcuentacontable'
        }, {
            name: 'idestadocuenta'
        }, {
            name: 'cajero'
        }, {
            name: 'idmovimientocaja'
        }, {
            name: 'idmovimiento'
        }, {// id moviento Generico
            name: 'iddocumento'
        }, {// id documento Generico
            name: 'idtipodocumento'
        }, {
            name: 'elaboradopor'//Nombre de la persona que recibe
        }, {
            name: 'idelaboradopor'
        }, {
            name: 'showCmp'
        }, {
            name: 'arrayIdCmp'
        },
        ]);

        this.stDeposito = new Ext.data.Store({
            url: 'cargarDepositos',
            reader: this.rdDeposito,
            baseParams: {
                limit: 20,
                filter: '',
                idcajafondo: Caja.Deposito.Fondo.idcajafondo
            },
            autoLoad: false,
            sortInfo: {
                field: 'iddocumento',
                direction: 'DESC'
            }
        });

        this.rowaction = new Ext.grid.RowActions({
            id: 'idRowaction',
            widthSlope: 100,
            header: "No. Comprobante",
            actions: [
                {
                    id: 'vistareporte',
                    // tooltip: this.idioma.lbtpEliminar,
                    tooltip: 'Ver comprobante',
                    iconCls: 'vistareporte',
                    marginLeft: 5,
                    width: 200,
                    height: 16,
                    hideIndex: 'showCmp',
                    textIndex: 'numcomprobante',
                },
            ]
        });

        this.gpDeposito = new Ext.grid.GridPanel({
                border: false,
                id: 'gpDeposito',
                stripeRows: true,
                frame: false,
                loadMask: true,
                autoExpandColumn: 'expandir',
                layout: 'fit',
                store: this.stDeposito,
                sm: this.smDeposito = new Ext.grid.RowSelectionModel({
                    singleSelect: true
                }),
                columns: [{
                    header: this.idioma.lbNumero,
                    sortable: true,
                    dataIndex: 'numero',
                    //hideable: false,
                    width: 15,
                    align: 'left'
                }, {
                    header: this.idioma.lbFecha,
                    sortable: true,
                    dataIndex: 'fecha',
                    //hideable: false,
                    width: 15,
                    align: 'center'
                }, {
                    header: this.idioma.lbElaborado,
                    sortable: true,
                    dataIndex: 'elaboradopor',
                    width: 50,
                    //hideable: false,
                    align: 'left'
                }, {
                    header: this.idioma.lbObservacion,
                    id: 'expandir',
                    sortable: true,
                    dataIndex: 'comentario',
                    //hideable: false,
                    align: 'left'
                }, {
                    header: this.idioma.lbImporte,
                    dataIndex: 'importemo',
                    sortable: true,
                    width: 20,
                    align: 'right',
                    renderer: formatoMoneda
                }, {
                    header: this.idioma.lbEstado,
                    sortable: true,
                    dataIndex: 'estado',
                    //hideable: false,
                    width: 20,
                    align: 'left'
                }, {
                    header: this.idioma.lbEstadoCuenta,
                    sortable: true,
                    dataIndex: 'idestadocuenta',
                    width: 30,
                    //hideable: false,
                    align: 'center',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        if (value) {
                            metadata.attr = 'ext:qtip="' + '<b>' + this.idioma.lbToolEstadoCuenta + '</b>"';
                            metadata.css = 'icondistra-banco';
                        }
                    }.bind(this)
                }
                    //     {
                    //     header: this.idioma.lbNComprobante,
                    //     sortable: true,
                    //     dataIndex: 'numcomprobante',
                    //     width: 20,
                    //     //hideable: false,
                    //     align: 'center'
                    // }
                    , this.rowaction],
                viewConfig: {
                    forceFit: true
                },
                //tbar: [this.searchField],
                tbar: [this.idioma.lbNumeroBusc, this.tfNumero, '-', this.idioma.lbBuscarEstado, this.tfEstado, '-', this.btnBuscar, '->', Caja.Componentes.cbEjercicio, '-', Caja.Componentes.cbPeriodo],
                plugins: this.rowaction,
                bbar: new Ext.Cont.PagingToolbar({
                    pageSize: 20,
                    store: this.stDeposito,
                    displayInfo: true,
                    clearFilter: true,
                    displayMsg: this.idioma.lbDisplayMsg,
                    emptyMsg: this.idioma.lbEmptyMsg,
                    firstText: this.idioma.lbPrimeraPagina,
                    lastText: this.idioma.lbUltimaPagina,
                    listeners: {
                        scope: this,
                        beforechange: function () {
                            this.stDeposito.baseParams.idcajafondo = Caja.Deposito.Fondo.idcajafondo;
                        }
                    }
                })
            }
        );
        this.items = [this.gpDeposito];
    },
    initEventos: function () {
        var scope = this;
        this.gpDeposito.getView().getRowClass = function (record, index, rowParams, store) {
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
            // if (record.get('idestado') == 6)
            //     return 'FilaVerde';
            // if (record.get('idestado') == 7)
            //     return 'FilaRoja';
        };

        this.gpDeposito.on({
            scope: this,
            rowClick: function () {
                var arraySelections = this.selectionsOnPaging();
                this.disableBottons();
                if (arraySelections.length > 0) {
                    if (!this.fDifEstados()) {
                        if (arraySelections[0].idestado != 1 && arraySelections[0].idestado != 7 && arraySelections[0].idestado != 4 /*&& arraySelections[0].idestadocuenta == null*/) {
                            this.btnCancelDeposito.enable();

                            if (arraySelections.length == 1 && arraySelections[0].idestado == 8)
                                this.btnModDeposito.enable();

                            if (arraySelections[0].idestado == 8) {
                                this.btnConfDeposito.enable();
                            }

                            if (arraySelections[0].idestado == 5)
                                this.btnContatabDeposito.enable();
                        }
                    }
                }
                return;
            },
            rowdblclick: function (grid, rowIndex) {
                var arraySelections = this.selectionsOnPaging();
                // if (arraySelections[0].idestado == 7)//Si esta cancelado no puede mostrar informacion en la ventana
                //     return;
                //-------------------
                this.showWindows('mod');
                this.cargarDatosMod();
                //-----------------------------------------
                //Si no esta guardado solo dejar ver la informcacion del deposito
                if (arraySelections[0].idestado != 8) {
                    this.windowDeposito.setTitle(this.idioma.lbInfoDeposito);
                    this.windowDeposito.btnAceptar.setVisible(false);
                    this.windowDeposito.cbCuentaCont.disable();
                    this.windowDeposito.tfDescripcion.disable();
                    this.windowDeposito.dfFecha.disable();
                    this.windowDeposito.dfFecha.clearInvalid();
                    this.windowDeposito.stIntrumentos.on({
                        scope: this,
                        load: function (store, records, options) {
                            this.windowDeposito.smIntrumentos.lock();
                            this.windowDeposito.stIntrumentos.getRange().forEach(function (item, index, AllItems) {
                                //Si no esta depositado(4) lo elimino del store porque solo voy a mostrar los que pertenencen al deposito
                                // if (item.data.idestado != 4) {
                                //     this.windowDeposito.stIntrumentos.remove(item);
                                // }
                            }, this);
                        }
                    });
                }
            }
        });

        //Revisar esto q no funciona para poner las filas en negrita
        this.smDeposito.on({
            scope: this,
            rowselect: function (smodel, rowIndex, record) {
                this.gpDeposito.getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function (smodel, rowIndex, record) {
                this.gpDeposito.getView().removeRowClass(rowIndex, "negrita");
            },
            selectionchange: function (selectionModel) {
                if (!selectionModel.hasSelection()) {
                    this.btnCancelDeposito.disable();
                    this.btnModDeposito.disable();
                    this.btnConfDeposito.disable();
                    this.btnContatabDeposito.disable();
                }
            }
        });

        this.btnFondo.on({
            scope: this,
            click: function () {
                var objCajaFondo = new Caja.CajaFondo.WindowCajaFondo({
                    showCbMov: false,
                    showWinMod: (Caja.Deposito.Fondo.idfondo != "") ? true : false,
                    tipoMov: new Array(1, 2, 3, 4, 5), //1-Pagos menores, 2-Ingreso, 3-Dieta Divisa, 4-Para cambio, 5-Para nominacaja
                });

                if (Caja.Deposito.Fondo.idfondo != "") {
                    this.scope.loadMask();
                }

                objCajaFondo.on({
                    scope: this,
                    loadData: function () {
                        Caja.Deposito.Fondo.idfondo = objCajaFondo.idFondo;
                        Caja.Deposito.Fondo.idcajafondo = objCajaFondo.idCajaFondo;
                        Caja.Deposito.Fondo.denominacion = objCajaFondo.nomFondo;
                        Caja.Deposito.Fondo.idmonedaEntidad = objCajaFondo.idMonedaEntidad;
                        Caja.Deposito.Fondo.idMoneda = objCajaFondo.idMoneda;
                        Caja.Deposito.Caja.idcaja = objCajaFondo.idCaja;
                        Caja.Deposito.Caja.denominacion = objCajaFondo.nomCaja;
                        Caja.Deposito.Caja.tipoFondo = objCajaFondo.tipoFondo;
                        Caja.Deposito.Caja.idFormaPago = objCajaFondo.idFormaPago;
                        Caja.Deposito.Caja.saldoActual = objCajaFondo.saldoActual;
                        this.stDeposito.baseParams.idcajafondo = Caja.Deposito.Fondo.idcajafondo;
                        this.gpDeposito.getBottomToolbar().changePage(0);
                        Ext.getCmp('tfFondo').setValue(objCajaFondo.nomFondo);
                        Ext.MessageBox.hide();
                        //this.stDeposito.load();
                        this.btnAddDeposito.focus(true, true);

                    },
                    show: function () {
                        if (Caja.Deposito.Fondo.idfondo != "")
                            lMask.hide();
                    }
                });

                objCajaFondo.btnCancelar.on('click', function () {
                    if (Caja.Deposito.Fondo.idfondo == "") {
                        window.parent.Ext.getCmp('win' + scope.idfuncionalidad).close();
                    } else
                        objCajaFondo.close();
                });
            }
        });

        this.btnAddDeposito.on({
            scope: this,
            click: function () {
                this.showWindows('add');
            }
        });

        this.btnModDeposito.on({
            scope: this,
            click: function () {
                this.showWindows('mod');
                this.cargarDatosMod();
            }
        });

        this.btnConfDeposito.on({
            scope: this,
            click: function () {
                this.scope.keyMap.disable();
                mostrarMensaje(2, this.idioma.lbConfirmDeposito, function (btnPress) {
                    if (btnPress === 'ok') {
                        this.confirmarDeposito();
                    }
                    if (btnPress === 'cancel') {
                        this.scope.keyMap.enable();
                    }
                }.bind(this));
            }
        });

        this.btnContatabDeposito.on({
            scope: this,
            click: function () {
                this.scope.keyMap.disable();
                mostrarMensaje(2, this.idioma.lbContabDeposito, function (btnPress) {
                    if (btnPress === 'ok') {
                        this.btnContatabDeposito.disable();
                        this.contabilizarDeposito();
                    }
                }.bind(this));
            }
        });

        this.btnCancelDeposito.on({
            scope: this,
            click: function () {
                this.scope.keyMap.disable();
                mostrarMensaje(2, this.idioma.lbCancelDeposito, function (btnPress) {
                    if (btnPress === 'ok') {
                        var windowCancelar = new Caja.Deposito.WindowCancelar(this, this.smDeposito.getSelected().data.fecha);
                        windowCancelar.show();
                        windowCancelar.on({
                            scope: this,
                            close: function () {
                                this.scope.keyMap.enable();
                            }
                        });
                    }
                    if (btnPress === 'cancel') {
                        this.scope.keyMap.enable();
                    }
                }.bind(this));
            }
        });

        this.stDeposito.on({
            scope: this,
            load: function () {
                Ext.Msg.hide();
                //if (lMask)
                //    lMask.hide();
            }
        });

        Caja.Componentes.cbPeriodo.on({
            scope: this,
            select: function (cb, record) {
                if (!Ext.isEmpty(this.stDeposito.baseParams.idcajafondo))
                    this.gpDeposito.getBottomToolbar().changePage(0);
            }
        });

        this.stDeposito.on({
            scope: this,
            beforeload: function () {
                this.btnAddDeposito.disable();
                //this.scope.loadMask();
                this.stDeposito.baseParams.idcajafondo = Caja.Deposito.Fondo.idcajafondo;
                this.stDeposito.baseParams.idPeriodo = Caja.Componentes.cbPeriodo.getValue();
                if (this.smDeposito.hasSelection())
                    this.idSelected = this.smDeposito.getSelected().data.idmovimiento;
                else this.idSelected = null;
            },
            load: function (options, records) {
                if (!options.baseParams.numero)
                    this.tfNumero.reset();
                if (!options.baseParams.idestado)
                    this.tfEstado.reset();
                if (!options.baseParams.idestado && !options.baseParams.numero)
                    this.btnBuscar.disable();
                //Mensaje cuando no encuentra datos al buscar
                if (!records.length) {
                    if (options.baseParams.numero && options.baseParams.idestado)
                        mostrarMensaje(1, this.idioma.lbNoDatosPorCriterios);
                    else if (options.baseParams.numero || options.baseParams.idestado)
                        mostrarMensaje(1, this.idioma.lbNoDatosPorCriterio);
                    else
                        mostrarMensaje(1, this.idioma.lbNoDatos);
                }
                if (this.idSelected) {
                    var index = this.stDeposito.find('idmovimiento', this.idSelected);
                    this.smDeposito.selectRow(index);
                    this.gpDeposito.fireEvent('rowclick', this.gpDeposito, index);
                } else {
                    this.smDeposito.selectFirstRow();
                    this.gpDeposito.fireEvent('rowclick', this.gpDeposito, 0);
                }
                this.btnAddDeposito.enable();
            }
        });

        //Evento para lso filtros de buscar
        this.tfNumero.on({
            scope: this,
            keypress: function (field, e) {
                if (e.getKey() == 13 && field.getValue() != '') {
                    this.btnBuscar.fireEvent('click');
                }
            },
            keyup: function (field, e) {
                if (field.getValue() == '' && !this.tfEstado.getValue()) {
                    this.btnBuscar.disable();
                    /*if ((e.getKey() == 46 || e.getKey() == 8)) {
                     this.stDeposito.baseParams = {};
                     this.stDeposito.load();
                     }*/
                } else this.btnBuscar.enable();
            }
        });

        this.tfEstado.on({
            scope: this,
            select: function () {
                this.btnBuscar.enable()
            },
            keypress: function (field, e) {
                if (e.getKey() == 46 || e.getKey() == 8) {
                    field.clearValue();
                    if (this.tfNumero.getValue() == '') {
                        this.btnBuscar.disable();
                        this.stDeposito.baseParams = {};
                        this.stDeposito.load();
                    }
                }
                if (e.getKey() == 13) {
                    this.btnBuscar.fireEvent('click');
                }
            }
        });

        this.btnBuscar.on({
            scope: this,
            click: function (tf, e) {
                this.stDeposito.baseParams = {
                    numero: this.tfNumero.getValue(),
                    idestado: this.tfEstado.getValue()
                }
                this.stDeposito.reload();
            }
        });
        //------------------
    },
    initFunctions: function () {

        this.selectionsOnPaging = function () {
            var arrayValues = new Array();
            var instance = new PagingToolbarSelections({
                'selections': this.gpDeposito.getSelectionModel().getSelections(),
                'activePage': this.gpDeposito.getBottomToolbar().getPageData().activePage
            });
            return instance.getSelectionsOnArray(arrayValues);
        }

        this.disableBottons = function () {
            this.btnModDeposito.disable();
            this.btnCancelDeposito.disable();
            this.btnConfDeposito.disable();
            this.btnContatabDeposito.disable();
        }

        this.fDifEstados = function () {
            var flagDifEstados = false;
            var arraySelections = this.selectionsOnPaging();
            for (var i = 0; i < arraySelections.length; i++) {
                for (var j = 0; j < arraySelections.length; j++) {
                    if (arraySelections[i].idestado != arraySelections[j].idestado) {
                        flagDifEstados = true;
                        break;
                    }
                }
            }
            return flagDifEstados;
        };

        this.showWindows = function (accion) {
            this.windowDeposito = new Caja.Deposito.WindowDeposito({
                idioma: this.idioma,
                perfil: this.perfil,
                defaultButton: 0,
                tipoAccion: accion,
                scope: this
            });
            this.windowDeposito.on({
                scope: this,
                close: function () {
                    this.scope.keyMap.enable();
                },
                show: function () {
                    this.scope.keyMap.disable();
                }
            });

            this.windowDeposito.show();
            this.windowDeposito.doLayout();
            this.windowDeposito.cbCuentaCont.focus(true, 100);
            this.scope.keyMap.disable();
            if (accion === 'add') {
                this.windowDeposito.createFormSteps(accion);
            }
        };

        this.cargarDatosMod = function () {
            this.windowDeposito.idDocumentoMod = this.smDeposito.getSelected().data.iddocumento;
            this.windowDeposito.idMovimientoMod = this.smDeposito.getSelected().data.idmovimiento;
            this.windowDeposito.idMovCajaMod = this.smDeposito.getSelected().data.idmovimientocaja;
            this.windowDeposito.stDesgloseBilletes.baseParams.idmovimientocaja = this.smDeposito.getSelected().data.idmovimientocaja;
            this.windowDeposito.stDesgloseMonedas.baseParams.idmovimientocaja = this.smDeposito.getSelected().data.idmovimientocaja;

            this.windowDeposito.stIntrumentos.baseParams.idmovimientocaja = this.smDeposito.getSelected().data.idmovimientocaja;
            this.windowDeposito.stIntrumentos.baseParams.idEstadoDep = this.smDeposito.getSelected().data.idestado;
            this.windowDeposito.stIntrumentos.baseParams.idMovimiento = this.smDeposito.getSelected().data.idmovimiento;

            this.windowDeposito.tfDescripcion.setValue(this.smDeposito.getSelected().data.comentario);
            this.windowDeposito.dfFecha.setValue(this.smDeposito.getSelected().data.fecha);
            // this.windowDeposito.tfTotalDeposito.setValue(this.smDeposito.getSelected().data.importemo);

            this.windowDeposito.cbCuentaCont.store.on({
                scope: this,
                load: function () {
                    this.windowDeposito.cbCuentaCont.setValue(this.smDeposito.getSelected().data.idcuentacontable);
                    this.windowDeposito.gridBilletesYMonedasAfterEdit();
                    this.windowDeposito.createFormSteps('mod');
                }
            });
            this.windowDeposito.setTitle(this.idioma.lbModDeposito);
            // this.windowDeposito.stDesgloseMonedas.load({
            //     scope: this,
            //     callback: function () {
            //         this.windowDeposito.stDesgloseBilletes.load({
            //             scope: this,
            //             callback: function () {
            //                 // this.windowDeposito.gridBilletesYMonedasAfterEdit();
            //                 // this.windowDeposito.createFormSteps('mod');
            //             }
            //         });
            //     }
            // });

            this.windowDeposito.stIntrumentos.on({
                scope: this,
                load: function () {
                    this.windowDeposito.gridInstrumentosAfterEdit();
                    this.windowDeposito.createFormSteps('mod');
                }
            });

        };

        this.confirmarDeposito = function (id, fnConfirmar) {
            var arrayIdDoc = new Array();
            if (id) {
                arrayIdDoc.push(id);
            } else {
                var selections = this.selectionsOnPaging();
                for (var i = 0; i < selections.length; i++) {
                    arrayIdDoc.push((selections[i].iddocumento).toString());
                }
            }

            Ext.Msg.wait(this.idioma.lbConfirmandoDeposito, this.idioma.lbEspere);
            Ext.Ajax.request({
                url: 'confirmarDeposito',
                method: 'POST',
                scope: this,
                params: {
                    arrayIdDoc: Ext.encode(arrayIdDoc),
                },
                callback: function (options, success, response) {
                    Ext.Msg.hide();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == 1) {
                        this.disableBottons();
                        this.stDeposito.reload();
                        if (typeof fnConfirmar === 'function') {
                            fnConfirmar();
                        }
                        mostrarMensaje(1, this.idioma.lbDepositadoSat);
                    }
                }.bind(this)
            });
        };

        this.contabilizarDeposito = function (id, fnPostear) {
            var param = {
                tipoContabilizacion: 1, //1 contabilizar doc confirmado | 2 revertir comprobnate contabilizado
                actionContabiliza: 'contabilizar',
                descripcion: 'Posteando depósito: ',
            };
            this.fLoadDataComprobante(param, id, fnPostear);
        };

        this.cancelarDeposito = function (idmotivo, fecha) {
            var params = {
                idmotivo: idmotivo,
                fecha: fecha,
                tipoContabilizacion: 2,
                descripcion: 'Cancelando deposito: ',
            };
            if (!this.fDifEstados() && this.smDeposito.getSelected().data.idestado != 6) {
                params.contabilizado = 0;
                this.guardarCancelacion(null, null, null, params)
            } else {
                params.contabilizado = 1;
                this.fLoadDataComprobante(params);
            }
        };

        this.cancelarInstrumento = function (idDocInst, numeroInst, record/*idmotivo, fecha*/) {
            var params = {
                // idmotivo: idmotivo,
                // fecha: fecha,
                tipoContabilizacion: 2,
                descripcion: 'Cancelando instrumento ' + numeroInst + ' del deposito No. ',
                idDocInst: idDocInst,
                record: record
            };
            if (this.smDeposito.getSelected().data.idestado == 6) {//6-Posteado
                params.contabilizado = 1;
                this.fLoadDataComprobante(params);
            } else {
                params.contabilizado = 0;
                this.guardarCancelacion(null, null, null, params)
            }
        };

        this.guardarCancelacion = function (idComprobante, numComprobante, fechaComprobante, params) {
            Ext.Msg.wait(this.idioma.lbCancelandoDeposito, this.idioma.lbEspere);

            var arrayIdDoc = new Array();
            var selections = this.selectionsOnPaging();
            for (var i = 0; i < selections.length; i++) {
                arrayIdDoc.push((selections[i].iddocumento).toString());
            }

            Ext.Ajax.request({
                method: "POST",
                url: 'cancelarDeposito',
                scope: this,
                params: {
                    arrayIdDoc: Ext.encode(arrayIdDoc),
                    idComprobante: idComprobante,
                    numComprobante: numComprobante,
                    fechaComprobante: fechaComprobante,
                    idCajaFondo: Caja.Deposito.Fondo.idcajafondo,
                    idmotivo: params.idmotivo,
                    fecha: params.fecha,
                    contabilizado: params.contabilizado,
                    //enestadocuenta: selections[0].idestadocuenta ? true : false,
                    idDocInst: params.idDocInst,
                    idmonedaEntidad: Caja.Deposito.Fondo.idmonedaEntidad
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    Ext.Msg.hide();
                    this.disableBottons();
                    this.stDeposito.reload();
                    if (params.contabilizado)
                        mostrarMensaje(1, this.idioma.lbMsgCancelContabilizado + ' ' + numComprobante + '.');
                    else mostrarMensaje(1, this.idioma.lbMsgCancelDeposito);

                    if (params.idDocInst) {//Actualizar estado del instrumento que fue cancelado
                        params.record.set('hideCancel', true);
                        params.record.set('idestado', 7);
                    }
                }.bind(this)
            });
        };

        this.fLoadDataComprobante = function (params, id, fnPostear) {
            var arrayIdDoc = [];
            if (id) {
                arrayIdDoc.push(id);
            } else {
                var arraySelections = this.selectionsOnPaging();
                for (var i = 0; i < arraySelections.length; i++)
                arrayIdDoc.push(arraySelections[i].iddocumento);
            }
            Ext.Msg.wait(this.idioma.lbLoadDataComprobante, this.idioma.lbEspere);
            params.arrayIdDoc = arrayIdDoc;
            Ext.Ajax.request({
                url: 'loadDataComprobante',
                method: 'POST',
                scope: this,
                params: {
                    arrayIdDoc: Ext.encode(arrayIdDoc),
                    idCajaFondo: Caja.Deposito.Fondo.idcajafondo,
                    tipoContabilizacion: params.tipoContabilizacion,
                    idDocInst: params.idDocInst,
                    fecha: params.fecha
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codM) {
                        if (responseData.codM == -2) {
                            mostrarMensaje(1, this.idioma.msgCambioEstado);
                            Ext.MessageBox.hide();
                        }
                    } else
                        this.fShowComprobante(responseData, params, fnPostear);
                }.bind(this)
            });
        };

        //Construir y mostrar el comprobante
        this.fShowComprobante = function (respData, params, fnPostear) {
            var idSubsistema = 14;//Caja
            var idTipoComprobante = 3;//comprobante tipo operaciones
            var descripcion = params.descripcion + respData.descripcion;
            var detalle = params.descripcion + respData.detalle;

            // Ext.MessageBox.hide();
            Ext.Cont.Comprobante.init(idSubsistema, detalle, descripcion, respData.fechaCont, respData.dataComprobante, idTipoComprobante, 1, 1).onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                Ext.Msg.wait(this.idioma.lbGuardandoComprobante, this.idioma.lbEspere);
                if (params.tipoContabilizacion === 1)
                    this.fGuardarComprobante(idComprobante, numComprobante, fechaComprobante, params, fnPostear);
                else
                    this.guardarCancelacion(idComprobante, numComprobante, fechaComprobante, params);
            }.bind(this)).onClose(function () {
                this.scope.keyMap.enable();
                noWindow = true;//para indicar que se cerro la ventana
                this.btnContatabDeposito.enable();
            }.bind(this));
        };

        this.fGuardarComprobante = function (idComprobante, numeroComprobante, fechaComprobante, params, fnPostear) {
            Ext.Ajax.request({
                method: "POST",
                url: 'contabilizarDeposito',
                scope: this,
                params: {
                    arrayIdDoc: Ext.encode(params.arrayIdDoc),
                    idComprobante: idComprobante,
                    numeroComprobante: numeroComprobante,
                    fechaComprobante: fechaComprobante,
                    idCajaFondo: Caja.Deposito.Fondo.idcajafondo,
                },
                callback: function (options, success, response) {
                    // var responseData = Ext.decode(response.responseText);
                    Ext.MessageBox.hide();
                    this.disableBottons();
                    this.stDeposito.reload();
                    mostrarMensaje(1, this.idioma.lbMsgContabilizado + ' ' + numeroComprobante + '.');
                    if (params.idDocInst) {//Actualizar estado del instrumento que fue cancelado
                        params.record.set('hideCancel', true);
                        params.record.set('idestado', 7);
                    }
                    if (typeof fnPostear === 'function') {
                        fnPostear();
                    }
                }.bind(this)
            });
        };
    }
});

//--Componete Window Deposito
Caja.Deposito.WindowDeposito = Ext.extend(Ext.Window, {
    constructor: function (params) {
        Ext.apply(this, params);
        Ext.apply(this, {
            width: 1000,
            //height: 500,
            autoValidate: false,
            height: Ext.lib.Dom.getViewHeight() * 0.9,
            modal: true,
            constrain: true,
            layout: 'fit',
            closeAction: 'close',
            frame: true,
            resizable: false,
            idioma: params.idioma,
            perfil: params.perfil,
            id: 'windowDeposito',
            title: params.idioma.lbAddDeposito,
            totalBilletes: 0,
            totalMonedas: 0,
            totalIntrumentos: 0,
            totalEfectivo: 0,
            totalCheque: 0,
            totalInst: 0,
            totalDeposito: 0,
            arrayEliminarDesglose: [],
            arrayIdDocCambiarEstado: []
        });
        this.createButtons();
        this.createForm();
        this.initFunctions();
        this.initEventos(this);

        Caja.Deposito.WindowDeposito.superclass.constructor.call(this);
    },
    createButtons: function () {
        this.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            //icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            selectOnFocus: true,
            //disabled: true,
            text: this.idioma.lbCancelar,
            tooltip: this.idioma.lbToolCerrar,
            scope: this,
            handler: function () {
                this.close();
                this.scope.btnAddDeposito.focus();
            }
        });
        this.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            //icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            disabled: true,
            text: this.idioma.lbAceptar,
            tooltip: this.idioma.lbToolGuardar
        });

        this.btnNuevo = new Ext.Button({
            text: 'Nuevo',
            tooltip: 'Limpiar los campos',
            iconCls: 'nuevo'
        });

        this.btnConfirmar = new Ext.Button({
            iconCls: 'confirmar',
            text: 'Confirmar',
            disabled: true,
            // hidden: (this.flujoNormal == 0)
            // tooltip: 'Limpiar los campos',
        });

        this.btnPostear = new Ext.Button({
            iconCls: 'contabilidad',
            text: 'Postear',
            disabled: true,
            // hidden: (this.flujoNormal == 0)
            // tooltip: 'Limpiar los campos',
        });
        if (this.tipoAccion === 'add') {
            this.buttons = [this.btnCancelar, this.btnNuevo, this.btnAceptar, this.btnConfirmar, this.btnPostear];
        } else {
            this.buttons = [this.btnCancelar, this.btnAceptar, this.btnConfirmar, this.btnPostear];
        }
    },
    createForm: function () {
        this.stCuentaCont = new Ext.data.Store({
            url: 'loadDataCuentaOperacion',
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
            }
            ]),
            baseParams: {
                idmoneda: Caja.Deposito.Fondo.idMoneda,
                idCajaFondo: Caja.Deposito.Fondo.idcajafondo
            },
            autoLoad: true
        });

        this.firstElement = this.cbCuentaCont = new Ext.form.ComboBox({
            fieldLabel: this.idioma.lbCuentaCont,
            store: this.stCuentaCont,
            name: 'cbAddInstFormaPago',
            valueField: 'idcuenta',
            hiddenName: 'idcuenta',
            displayField: 'nomcuenta',
            emptyText: this.idioma.lbSeleccione,
            disabledClass: 'disabled-component',
            editable: false,
            forceSelection: true,
            allowBlank: false,
            blankText: this.idioma.lbBlankText,
            resizable: true,
            triggerAction: 'all',
            anchor: '100%',
            mode: 'local'
        });

        this.dfFecha = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: this.idioma.lbFecha,
            name: 'fecha',
            id: 'fechaAdd',
            anchor: '100%',
            allowBlank: false,
            minValue: fechaInicio,
            maxValue: fechaFin,
            //maxValue: new Date(),
            value: fechaContable,
            blankText: 'Este campo es obligatorio.',
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            readOnly: false
        });

        this.tfDescripcion = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            id: 'tfDescripcion',
            name: 'tfDescripcion',
            maxLength: 100,
            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\[\]\.\:\, [a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\.\:\,]*)+$/,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\[\]\.\:\, [a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\.\:\,]*)+$/,
            enableKeyEvents: true,
            allowBlank: false,
            fieldLabel: this.idioma.lbObservacion,
            maxLengthText: this.idioma.lbMaximo100Caracteres,
            anchor: '100%',
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.btnAceptar.focus();
                },
                invalid: function (cmp, msg) {
                    if (cmp.getValue().length > 0) {
                        var vtext = cmp.getValue().trim();
                        cmp.setValue(vtext);
                    }
                },
                blur: function (cmp) {
                    if (cmp.getValue().length > 0) {
                        var vtext = cmp.getValue().trim();
                        cmp.setValue(vtext);
                    }
                }
            }
        });

        this.tfTotalDeposito = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            anchor: '100%',
            fieldLabel: this.idioma.lbTotal,
            name: 'tfTotalDeposito',
            id: 'tfTotalDeposito',
            value: '0.00',
            disabled: false,
            readOnly: true,
            allowBlank: false,
            style: 'text-align: right',
            validator: function (value) {
                if (value !== '0.00') {
                    return true;
                } else {
                    return false;
                }
            }
        });

        this.nfBillete = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            //width: 70,
            name: 'nfBillete',
            value: 0.00,
            maxLength: 24,
            maskRe: /^\d*$/,
            maxLengthText: this.idioma.LbCampomaxLengthText24,
            allowDecimals: false,
            allowNegative: false,
            allowBlank: false,
            id: 'nfBillete'
        });

        this.stDesgloseBilletes = new Ext.data.Store({
            url: 'obtenerDesgloseBilletes',
            reader: new Ext.data.JsonReader({
                root: 'billetes'
            }, [{
                name: 'cantidad',
                type: 'int'
            }, {
                name: 'iddesglosemoneda',
                mapping: 'iddezglozemoneda'
            }, {
                name: 'denominacion',
                mapping: 'denominacion'
            }, {
                name: 'valor',
                type: 'float',
                mapping: 'valor'
            }, {
                name: 'importe'
            }, {
                name: 'idcantidaddenominacion'//id de la tabla DatCantidaddenominacion de caja
            }
            ]),
            baseParams: {
                idmonedaEntidad: Caja.Deposito.Fondo.idmonedaEntidad
            },
            autoLoad: true
        });

        this.gpDesgloseBilletes = new Ext.grid.EditorGridPanel({
            frame: true,
            clicksToEdit: 1,
            height: Ext.lib.Dom.getViewHeight() * 0.65,
            // width: 499,
            // region: 'center',
            // layout: 'fit',
            disabled: Caja.Deposito.Caja.idFormaPago == '2' ? true : false,
            border: true,
            layout: 'form',
            anchor: '100%',
            autoScroll: false,
            loadMask: true,
            autoExpandColumn: 'expandir',
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            forceFit: true,
            store: this.stDesgloseBilletes,
            columns: [{
                header: this.idioma.lbCantidad,
                width: 70,
                sortable: true,
                dataIndex: 'cantidad',
                editor: this.nfBillete,
                renderer: function (value, metaData, record, rowIndex, colIndex) {
                    if (value == 0)
                        return "";
                    else return value;
                }
            }, {
                id: 'expandir',
                header: this.idioma.lbDenominacion,
                sortable: true,
                dataIndex: 'denominacion'
            }, {
                header: this.idioma.lbValor,
                sortable: true,
                dataIndex: 'valor',
                hidden: 'true',
                width: 100
            }, {
                header: this.idioma.lbImporte,
                width: 70,
                align: 'right',
                sortable: true,
                dataIndex: 'importe',
                renderer: function (value, metaData, record, rowIndex, colIndex) {
                    if (!this.nfBillete.startValue) {
                        this.nfBillete.startValue = 0;
                    }
                    return this.calcImporteBilletes(record.data.cantidad, record.data.valor);
                }.bind(this)
            }],
            tbar: [new Ext.Toolbar.TextItem(this.idioma.lbBilletes)],
            bbar: ['->', new Ext.Toolbar.TextItem(this.idioma.lbTotalBilletes), this.labelBilletes = new Ext.form.Label({
                name: 'labelBilletes',
                text: '0.00',
                id: 'labelBilletes'
            })]
        });

        this.gpDesgloseBilletes.on({
            scope: this,
            afteredit: function (obj) {
                // this.stDesgloseBilletes.commitChanges();
                this.gridBilletesYMonedasAfterEdit();
            }
        });

        this.stDesgloseMonedas = new Ext.data.Store({
            url: 'obtenerDesgloseMonedas',
            reader: new Ext.data.JsonReader({
                root: 'monedas'
            }, [{
                name: 'cantidad',
                type: 'int'
            }, {
                name: 'iddesglosemoneda',
                mapping: 'iddezglozemoneda'
            }, {
                name: 'denominacion',
                mapping: 'denominacion'
            }, {
                name: 'valor',
                type: 'float',
                mapping: 'valor'
            }, {
                name: 'importe'
            }, {
                name: 'idcantidaddenominacion'//id de la tabla DatCantidaddenominacion de caja
            }
            ]),
            baseParams: {
                idmonedaEntidad: Caja.Deposito.Fondo.idmonedaEntidad
            },
            autoLoad: true
        });

        this.nfMoneda = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            width: 70,
            name: 'nfMoneda',
            value: 0.00,
            maxLength: 24,
            maskRe: /^\d*$/,
            maxLengthText: this.idioma.LbCampomaxLengthText24,
            allowDecimals: false,
            allowNegative: false,
            allowBlank: false,
            id: 'nfMoneda'
        });

        this.checkGpInstrumentos = new Ext.form.TextField({
            name: 'checkGpInstrumentos',
            allowBlank: false,
            anchor: '100%',
            hidden: true,
            disabled: Caja.Deposito.Caja.tipoFondo != '2' ? true : false
        });

        this.checkGpBilletesYMonedas = new Ext.form.TextField({
            name: 'GpBilletesYMonedas',
            allowBlank: false,
            anchor: '100%',
            hidden: true,
            disabled: Caja.Deposito.Caja.idFormaPago == '2' ? true : false
        });

        this.rowaction = new Ext.grid.RowActions({
            id: 'idRowaction',
            actions: [
                {
                    id: 'cancelar',
                    tooltip: this.idioma.lbRowActionCancelar,
                    iconCls: 'cancelar',
                    marginLeft: 5,
                    width: 20,
                    height: 16,
                    hideIndex: 'hideCancel'
                }
            ]
        });

        this.gpDesgloseMonedas = new Ext.grid.EditorGridPanel({
            frame: true,
            border: true,
            layout: 'form',
            clicksToEdit: 1,
            loadMask: true,
            height: Ext.lib.Dom.getViewHeight() * 0.65,
            // width: 499,
            // region: 'east',
            // layout: 'fit',
            disabled: Caja.Deposito.Caja.idFormaPago == '2' ? true : false,
            anchor: '100%',
            autoExpandColumn: 'expandir',
            autoScroll: false,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            scope: this,
            forceFit: true,
            store: this.stDesgloseMonedas,
            columns: [{
                header: this.idioma.lbCantidad,
                width: 70,
                sortable: true,
                dataIndex: 'cantidad',
                editor: this.nfMoneda,
                renderer: function (value, metaData, record, rowIndex, colIndex) {
                    if (value == 0)
                        return "";
                    else return value;
                }
            }, {
                id: 'expandir',
                header: this.idioma.lbDenominacion,
                sortable: true,
                dataIndex: 'denominacion',
                width: 100,
            }, {
                header: this.idioma.lbValor,
                sortable: true,
                dataIndex: 'valor',
                hidden: 'false'
            }, {
                header: this.idioma.lbImporte,
                width: 70,
                align: 'right',
                sortable: true,
                dataIndex: 'importe',
                renderer: function (value, metaData, record, rowIndex, colIndex) {
                    if (!this.nfMoneda.startValue) {
                        this.nfMoneda.startValue = 0;
                    }
                    return this.calcImporteMonedas(record.data.cantidad, record.data.valor);
                }.bind(this)
            }
            ],
            tbar: [new Ext.Toolbar.TextItem(this.idioma.lbMonedas)],
            bbar: ['->', new Ext.Toolbar.TextItem(this.idioma.lbTotalMonedas), this.labelMonedas = new Ext.form.Label({
                name: 'labelMonedas',
                text: '0.00',
                id: 'labelMonedas'
            })]
        });

        this.gpDesgloseMonedas.on({
            scope: this,
            afteredit: function (obj) {
                // this.stDesgloseMonedas.commitChanges();
                this.gridBilletesYMonedasAfterEdit();
            }
        });

        this.stIntrumentos = new Ext.data.GroupingStore({
            url: 'cargarInstrumentos',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: "cant",
            }, [{
                name: 'importe',
                mapping: 'importemo',
                type: 'float'
            }, {
                name: 'numero'
            }, {
                name: 'iddocumento'
            }, {
                name: 'idmovimiento'
            }, {
                name: 'idformapago'
            }, {
                name: 'formapago'
            }, {
                name: 'idestado'
            }, {
                name: 'fecha'
            }, {
                name: 'nomtipodocumento'
            }, {
                name: 'comentario'
            }, {
                name: 'numDocMov',
                type: 'int'
            }, {
                name: 'hideCancel'
            }, {
                name: 'checked'
            }, {
                name: 'clienteproveedor'
            }
            ]),
            groupField: 'numDocMov',
            // groupField: 'idformapago',
            //sortInfo: {field: 'idformapago', direction: "ASC"},
            sortInfo: {field: 'importe', direction: "DESC"},
            baseParams: {
                idcajafondo: Caja.Deposito.Fondo.idcajafondo
            },
            autoLoad: Caja.Deposito.Caja.tipoFondo == 2 ? true : false//2-Entrada
        });

        this.filters = new Ext.grid.GridFilters({
            filtersText: 'Búsqueda',
            local: true,
            filters: [
                {type: 'string', dataIndex: 'clienteproveedor'}
            ]
        });

        this.gpIntrumentos = new Ext.grid.GridPanel({
            frame: true,
            anchor: '100%',
            height: Ext.lib.Dom.getViewHeight() * 0.65,
            disabled: Caja.Deposito.Caja.tipoFondo != '2' ? true : false,
            layout: 'form',
            loadMask: true,
            border: true,
            // region: 'center',
            autoExpandColumn: 'expandir',
            autoScroll: false,
            recordGroup: null,
            forceFit: true,
            store: this.stIntrumentos,
            scope: this,
            sm: this.smIntrumentos = new Ext.grid.CheckboxSelectionModel({
                scope: this,
                //hidden: Caja.Deposito.Caja.idFormaPago == 1,
                listeners: {
                    'selectionchange': function (sm) {
                        var hd = Ext.fly(this.gpIntrumentos.getView().innerHd).child('div.x-grid3-hd-checker');
                        if (this.smIntrumentos.getCount() < this.gpIntrumentos.getStore().getCount()) {
                            hd.removeClass('x-grid3-hd-checker-on');
                        } else {
                            hd.addClass('x-grid3-hd-checker-on');
                        }
                        var selections = this.gpIntrumentos.getSelectionModel().getSelections();
                        this.calcImporteInstrumentos(selections);
                        this.gridInstrumentosAfterEdit();
                    }.bind(this)
                }
            }),
            view: new Ext.grid.GroupingView({
                hideGroupedColumn: true,
                // groupTextTpl: "{[values.rs[0].data.formapago]}"
                groupTextTpl: "Recibo de efectivo No. {[values.rs[0].data.numDocMov]}"
            }),
            columns: [this.smIntrumentos,
                {
                    header: this.idioma.lbNumero,
                    width: 100,
                    sortable: false,
                    dataIndex: 'numero'
                }, /*{
                    header: this.idioma.lbTipoDoc,
                    width: 150,
                    sortable: true,
                    dataIndex: 'nomtipodocumento'
                },*/ {
                    id: 'expandir',
                    header: this.idioma.lbObservacion,
                    sortable: false,
                    dataIndex: 'comentario'
                }, {
                    header: 'Acreedor/Deudor',
                    dataIndex: 'clienteproveedor',
                    width: 250,
                    hidden: true,
                }, {
                    // header: this.idioma.lbTipoIntrumento,
                    // dataIndex: 'idformapago',
                    dataIndex: 'numDocMov',
                    hideable: false
                }, {
                    header: this.idioma.lbFecha,
                    align: 'left',
                    width: 80,
                    sortable: false,
                    dataIndex: 'fecha'
                }, {
                    header: this.idioma.lbImporte,
                    align: 'right',
                    width: 80,
                    sortable: false,
                    dataIndex: 'importe',
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        if (record.data.checked/*record.data.idestado == '4' || record.data.idformapago == 1*/) {
                            this.smIntrumentos.selectRow(rowIndex, true);
                        }
                        return formatoMoneda(value);
                    }.bind(this)
                },
                this.rowaction],
            plugins: [this.rowaction, this.filters],
            tbar: [new Ext.Toolbar.TextItem(this.idioma.lbInstrumentos)],
            bbar: [/*this.idioma.lbTotalEfectivo, this.labelEfectivo = new Ext.form.Label({
             name: 'labelEfectivo',
             id: 'labelEfectivo',
             text: '0.00'
             }),*/
                '->', new Ext.Toolbar.TextItem(this.idioma.lbTotal), this.labelInst = new Ext.form.Label({
                    name: 'labelInst',
                    id: 'labelInst',
                    text: '0.00'
                })]
        });

        this.gpIntrumentos.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.get('idestado') == 4)
                return 'FilaVerde';
            if (record.get('idestado') == 7)
                return 'FilaRoja';
        };

        /*this.gpIntrumentos.contextmenu = new Ext.menu.Menu({
            id: 'contextMenuNomCta',
            items: [
                {
                    id: 'selectGroup',
                    //iconCls: 'x-menu-item-icon',
                    iconCls: 'aceptar',
                    //icon: 'aceptar',
                    hidden: true,
                    scope: this,
                    handler: function () {
                        this.gpIntrumentos.getSelectionModel().selectRecords(this.gpIntrumentos.recordGroup, true);
                    }
                }, {
                    id: 'deselectGroup',
                    //iconCls: 'x-menu-item-icon',
                    iconCls: 'cancelar',
                    //icon: self.perfil.dirImg + 'cancelar.png',
                    hidden: true,
                    scope: this,
                    handler: function () {
                        for (var i = 0; i < this.gpIntrumentos.recordGroup.length; i++) {
                            var row = this.stIntrumentos.find('iddocumento', this.gpIntrumentos.recordGroup[i].data.iddocumento);
                            this.gpIntrumentos.getSelectionModel().deselectRow(row);
                        }
                    }
                }, {
                    id: 'selectAll',
                    //iconCls: 'x-menu-item-icon',
                    iconCls: 'aceptar',
                    //icon: self.perfil.dirImg + 'aceptar.png',
                    text: this.idioma.lbMenuSelectAll,
                    hidden: true,
                    scope: this,
                    handler: function () {
                        this.gpIntrumentos.getSelectionModel().selectAll();
                    }
                }, {
                    id: 'deselectAll',
                    //iconCls: 'x-menu-item-icon',
                    //icon: self.perfil.dirImg + 'cancelar.png',
                    iconCls: 'cancelar',
                    text: this.idioma.lbMenuDeselectAll,
                    hidden: true,
                    scope: this,
                    handler: function () {
                        this.gpIntrumentos.getSelectionModel().clearSelections();
                    }
                }
            ]
        });

        this.gpIntrumentos.on({
            scope: this,
            rowcontextmenu: function (grid, rowIndex, eventObject) {
                eventObject.stopEvent();
                var record = this.stIntrumentos.getAt(rowIndex);
                Ext.getCmp('selectGroup').setText(this.idioma.lbMenuSelect + '<b>' + record.data.formapago + '<b>');
                Ext.getCmp('deselectGroup').setText(this.idioma.lbMenuDeselect + '<b>' + record.data.formapago + '<b>');
                var recordGroup = this.stIntrumentos.query('idformapago', record.data.idformapago).items;
                this.gpIntrumentos.recordGroup = recordGroup;

                var selections = this.gpIntrumentos.getSelectionModel().getSelections();

                if (selections.length == this.stIntrumentos.getCount()) {
                    Ext.getCmp('deselectAll').show();
                    Ext.getCmp('selectAll').hide();
                } else if (selections.length == 0) {
                    Ext.getCmp('selectAll').show();
                    Ext.getCmp('deselectAll').hide();
                } else if (selections.length < this.stIntrumentos.getCount()) {
                    Ext.getCmp('selectAll').show();
                    Ext.getCmp('deselectAll').show();
                }

                var cantSelectGroup = 0;
                for (var i = 0; i < recordGroup.length; i++) {
                    for (var j = 0; j < selections.length; j++) {
                        if (recordGroup[i].data.idformapago === selections[j].data.idformapago && recordGroup[i].data.iddocumento === selections[j].data.iddocumento) {
                            cantSelectGroup++;
                        }
                    }
                }

                if (cantSelectGroup == recordGroup.length && selections.length == cantSelectGroup) {
                    Ext.getCmp('selectGroup').hide();
                    Ext.getCmp('deselectGroup').show();
                    Ext.getCmp('deselectAll').hide();
                } else if (cantSelectGroup == 0) {
                    Ext.getCmp('selectGroup').show();
                    Ext.getCmp('deselectGroup').hide();
                } else if (cantSelectGroup < selections.length && recordGroup.length == cantSelectGroup) {
                    Ext.getCmp('deselectAll').show();
                    Ext.getCmp('selectGroup').hide();
                    Ext.getCmp('deselectGroup').show();
                } else if (recordGroup.length < cantSelectGroup) {
                    Ext.getCmp('deselectAll').show();
                    Ext.getCmp('selectGroup').show();
                    Ext.getCmp('deselectAll').show();
                } else {
                    Ext.getCmp('selectGroup').show();
                    Ext.getCmp('deselectGroup').show();
                    Ext.getCmp('deselectAll').show();
                }
                this.gpIntrumentos.contextmenu.showAt(eventObject.getXY());
            }
        });
        */

        this.formDeposito = new Ext.FormPanel({
            id: 'formDeposito',
            frame: true,
            // layout: 'fit',
            autoHeight: true,
            //labelWidth: 50,
            // region: 'south',
            region: 'center',
            labelAlign: 'top',
            layout: 'column',
            items: [{
                columnWidth: Caja.Deposito.Caja.tipoFondo != '2' ? .5 : .3,
                border: false,
                layout: 'form',
                hidden: Caja.Deposito.Caja.idFormaPago == '2' ? true : false,//1-Efectivo, 2-Cheque
                items: this.gpDesgloseBilletes
            }, {
                columnWidth: Caja.Deposito.Caja.tipoFondo != '2' ? .5 : .3,
                border: false,
                layout: 'form',
                hidden: Caja.Deposito.Caja.idFormaPago == '2' ? true : false,//1-Efectivo, 2-Cheque
                items: this.gpDesgloseMonedas
            }, {
                columnWidth: Caja.Deposito.Caja.idFormaPago == '2' ? 1 : .40,
                layout: 'form',
                items: this.gpIntrumentos,
                hidden: Caja.Deposito.Caja.tipoFondo != '2' ? true : false,//1-Efectivo, 2-Cheque
            }, {
                columnWidth: .25,
                layout: 'form',
                border: false,
                style: 'margin: 5 0 0 5',
                items: this.cbCuentaCont
            }, {
                columnWidth: .10,
                layout: 'form',
                border: false,
                style: 'margin: 5 0 0 5',
                items: this.dfFecha
            }, {
                columnWidth: .55,
                layout: 'form',
                border: false,
                style: 'margin: 5 0 0 5',
                items: this.tfDescripcion
            }, {
                columnWidth: .10,
                layout: 'form',
                border: false,
                style: 'margin: 5 0 0 5',
                items: this.tfTotalDeposito
            }, {
                hidden: true,
                layout: 'form',
                items: this.checkGpInstrumentos
            }, {
                hidden: true,
                layout: 'form',
                items: this.checkGpBilletesYMonedas
            }]
        });

        this.items = {
            region: 'center',
            layout: 'border',
            frame: true,
            border: true,
            items: [this.formDeposito]
        };

    },
    initEventos: function () {
        this.btnAceptar.on({
            scope: this,
            click: function () {
                // if (this.totalDeposito == 0) {
                //     mostrarMensaje(1, this.idioma.lbImporteCero);
                //     return;
                // }
                // if (Caja.Deposito.Caja.tipoFondo == 2) {//2-Entrada
                //     if (Caja.Deposito.Caja.idFormaPago == 2) {//2-Cheque
                //         if (this.stIntrumentos.getCount() == 0) {
                //             mostrarMensaje(1, this.idioma.lbNoInstrumentos);
                //             return;
                //         }
                //     } else if (Caja.Deposito.Caja.idFormaPago == 1 && parseFloat(this.totalInst) == 0) {//1-Efectivo y no tiene instrumento a depositar
                //         if ((parseFloat(this.totalBilletes) + parseFloat(this.totalMonedas)).toFixed(2) != parseFloat(this.totalInst).toFixed(2)) {
                //             mostrarMensaje(1, this.idioma.lbNoInstrumentos);
                //             return;
                //         }
                //     } else if ((parseFloat(this.totalBilletes) + parseFloat(this.totalMonedas)).toFixed(2) != parseFloat(this.totalInst).toFixed(2)) {
                //         mostrarMensaje(1, this.idioma.lbDepositoMonto + parseFloat(this.totalInst).toFixed(2));
                //         return;
                //     }
                // } else {//Salida
                //     if (Caja.Deposito.Caja.saldoActual == 0) {//Si no tiene saldo
                //         mostrarMensaje(1, this.idioma.lbNoSaldoDeposito);
                //         return;
                //     }
                //     if (this.totalDeposito > Caja.Deposito.Caja.saldoActual) {//El saldo debe ser mayor igual al deposito
                //         mostrarMensaje(1, this.idioma.lbMaxDeposito + parseFloat(Caja.Deposito.Caja.saldoActual).toFixed(2));
                //         return;
                //     }
                //     //Si es el fondo de pago de nomina (debe depocitar lo que tenga en efectovo)
                //     if (Caja.Deposito.Caja.tipoFondo == 5 && this.totalDeposito != Caja.Deposito.Caja.saldoActual) {
                //         mostrarMensaje(1, this.idioma.lbDepositoMonto + parseFloat(Caja.Deposito.Caja.saldoActual).toFixed(2));
                //         return;
                //     }
                // }
                // if (this.formDeposito.getForm().isValid())
                //     this.guardarDeposito();
            }
        });

        this.stIntrumentos.on({
            scope: this,
            load: function (store, records, options) {
                if (records.length == 0) {
                    mostrarMensaje(1, this.idioma.lbNoInstrumentos);
                }
                // if (Caja.Deposito.Caja.idFormaPago == 1)
                //     this.smIntrumentos.lock();
            }
        });

        this.rowaction.on('action', function (grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'cancelar':
                    var numInst = record.data.numero;
                    var lbPregCancelarInst = String.format(this.idioma.lbPregCancelarInst, numInst);
                    mostrarMensaje(2, lbPregCancelarInst, function (btnPress) {
                        if (btnPress === 'ok') {
                            this.scope.cancelarInstrumento(record.data.iddocumento, numInst, record);
                        }
                    }.bind(this));
                    break;
            }
        }.bind(this));
    },
    initFunctions: function () {

        this.stCuentaCont.on({
            scope: this,
            load: function (st, records) {
                if (records.length == 1) {
                    this.cbCuentaCont.setValue(records[0].data.idcuenta);
                }
                if (records.length == 0) {
                    mostrarMensaje(1, this.idioma.lbMensageNoCuentasOper);
                }
                Caja.Deposito.Caja.saldoActual = st.reader.jsonData.saldoFondo;
            }
        });

        this.calcImporteBilletes = function (cant, valor) {
            if (this.nfBillete.startValue >= 0) {
                var totalImporte = (cant - this.nfBillete.startValue) * valor;
                this.totalBilletes += totalImporte;
                // this.labelBilletes.setText(parseFloat(this.totalBilletes).toFixed(2));
                this.labelBilletes.setText(formatoMoneda(this.totalBilletes));
                this.totalDeposito += totalImporte;
                this.tfTotalDeposito.setValue(parseFloat(this.totalDeposito).toFixed(2));
                var importe = cant * valor;
                return parseFloat(importe).toFixed(2);
            } else {
                return parseFloat(0).toFixed(2);
            }
        };

        this.calcImporteMonedas = function (cant, valor) {
            if (this.nfMoneda.startValue >= 0) {
                var totalImporte = (cant - this.nfMoneda.startValue) * valor;
                this.totalMonedas += totalImporte;
                // this.labelMonedas.setText(parseFloat(this.totalMonedas).toFixed(2));
                this.labelMonedas.setText(formatoMoneda(this.totalMonedas));
                this.totalDeposito += totalImporte;
                this.tfTotalDeposito.setValue(parseFloat(this.totalDeposito).toFixed(2));
                var importe = cant * valor;
                return parseFloat(importe).toFixed(2);
            } else {
                return parseFloat(0).toFixed(2);
            }
        };

        this.calcImporteInstrumentos = function (instrumentos) {
            var totalCheque = 0;
            var totalEfectivo = 0;
            var totalInst = 0;
            for (var i = 0; i < instrumentos.length; i++) {
                if (Caja.Deposito.Caja.idFormaPago == '1') {//1-Forma de pago Efectivo
                    totalEfectivo += parseFloat(Math.abs(instrumentos[i].data.importe));
                    totalInst += parseFloat(Math.abs(instrumentos[i].data.importe));
                } else {
                    totalCheque += parseFloat(Math.abs(instrumentos[i].data.importe));
                    totalInst += parseFloat(Math.abs(instrumentos[i].data.importe));
                }
            }
            this.totalDeposito += totalCheque - this.totalCheque;
            this.totalCheque = totalCheque;
            this.totalEfectivo = totalEfectivo;
            this.totalInst = totalInst;
            this.tfTotalDeposito.setValue(parseFloat(this.totalDeposito).toFixed(2));
            // this.labelInst.setText(parseFloat(totalInst).toFixed(2));
            this.labelInst.setText(formatoMoneda(totalInst));
        };

        this.arrayDesgloseMonedas = function () {
            var arr_monedas = new Array();
            var j = 0;
            for (var i = 0; i < this.stDesgloseMonedas.getCount(); i++) {
                if (this.stDesgloseMonedas.getAt(i).data.cantidad > 0) {
                    arr_monedas[j] = this.stDesgloseMonedas.getAt(i).data;
                    j++;
                } else {
                    if (this.stDesgloseMonedas.getAt(i).data.idcantidaddenominacion > 0)
                        this.arrayEliminarDesglose.push(this.stDesgloseMonedas.getAt(i).data.idcantidaddenominacion);
                }
            }
            return arr_monedas;
        };

        this.arrayDesgloseBilletes = function () {
            var arr_billetes = new Array();
            var j = 0;
            for (var i = 0; i < this.stDesgloseBilletes.getCount(); i++) {
                if (this.stDesgloseBilletes.getAt(i).data.cantidad > 0) {
                    arr_billetes[j] = this.stDesgloseBilletes.getAt(i).data;
                    j++;
                } else {
                    if (this.stDesgloseBilletes.getAt(i).data.idcantidaddenominacion > 0)
                        this.arrayEliminarDesglose.push(this.stDesgloseBilletes.getAt(i).data.idcantidaddenominacion);
                }
            }
            return arr_billetes;
        };

        this.arrayInstrumentos = function () {
            var arr_cheques = new Array();

            for (var i = 0; i < this.stIntrumentos.getCount(); i++) {
                if (this.smIntrumentos.isSelected(i)) {
                    arr_cheques.push(this.stIntrumentos.getAt(i).data);
                } else {
                    //Si estaba cargado en el deposito y se desmarca
                    if (!this.smIntrumentos.isSelected(i) && this.stIntrumentos.getAt(i).data.idestado == 4) {//4-Depositado
                        this.arrayIdDocCambiarEstado.push(this.stIntrumentos.getAt(i).data.iddocumento);
                    }
                }
            }
            return arr_cheques;
        };

        this.guardarDeposito = function (cerrarVentana, fn) {
            var me = this;
            Ext.Msg.wait(this.idioma.lbGuardandoDeposito, this.idioma.lbEspere);
            Ext.Ajax.request({
                url: 'guardarDeposito',
                method: 'POST',
                scope: this,
                params: {
                    monedas: Ext.encode(this.arrayDesgloseMonedas()),
                    billetes: Ext.encode(this.arrayDesgloseBilletes()),
                    instrumentos: Ext.encode(this.arrayInstrumentos()),
                    descripcion: this.tfDescripcion.getValue(),
                    //cartaporte: nfCartaporte.getValue(),
                    //planilla: nfPlanilla.getValue(),
                    idmonedaentidad: Caja.Deposito.Fondo.idmonedaEntidad,
                    importetotal: this.totalDeposito,
                    idcajafondo: Caja.Deposito.Fondo.idcajafondo,
                    idcaja: Caja.Deposito.Caja.idcaja,
                    arrayEliminarDesglose: Ext.encode(this.arrayEliminarDesglose),
                    arrayIdDocCambiarEstado: Ext.encode(this.arrayIdDocCambiarEstado),
                    //Para modificar
                    idDocumentoMod: this.idDocumentoMod,
                    idMovimientoMod: this.idMovimientoMod,
                    idMovCajaMod: this.idMovCajaMod,
                    idCuentaContable: this.cbCuentaCont.getValue(),
                    fecha: this.dfFecha.getRawValue()
                },
                callback: function (options, success, response) {
                    Ext.Msg.hide();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMs == 1) {
                        //lMask.hide();
                        if (cerrarVentana) {
                            this.scope.windowDeposito.close();
                        }
                        if (typeof fn === 'function') {
                            fn(responseData.idDoc);
                        }
                        this.scope.disableBottons();
                        this.scope.stDeposito.reload();
                        if (this.idDocumentoMod)
                            mostrarMensaje(1, this.idioma.lbMensageModificado);
                        else mostrarMensaje(1, this.idioma.lbMensageAdicionado);
                    } else if (responseData.codMs == -1) {
                        mostrarMensaje(1, this.idioma.lbMensageNoTalonario);
                    } else if (responseData.codMs == -2) {
                        mostrarMensaje(1, this.idioma.lbMensageNoOperaciones);
                    }
                }
            });
        };

        this.gridInstrumentosAfterEdit = function () {
            var recordscheck = [];
            var records = this.gpIntrumentos.getSelectionModel().getSelections();
            //si esta desordenado puede causar que falle lo que intento hacer mas abajo en el otro comentario
            records.sort(function (a, b) {
                return a.data.iddocumento - b.data.iddocumento;
            });
            records.forEach(function (item, i) {
                //esto es pa poder saber si han sido modificados
                recordscheck.push(
                    '' + item.get('iddocumento') + '@' + item.get('importe')
                );
            });
            this.checkGpInstrumentos.setValue(recordscheck.toString());
        };

        this.gridBilletesYMonedasAfterEdit = function () {
            var recordscheckmon = [];
            var recordscheckbill = [];
            var recordsMon = this.gpDesgloseMonedas.getStore().getRange();
            var recordsBill = this.gpDesgloseBilletes.getStore().getRange();

            var recordsMonConCantidad = [];
            var recordsBillConCantidad = [];
            recordsMon.forEach(function (item, i) {
                if (item.get('cantidad') > 0) {
                    recordsMonConCantidad.push(item);
                }
            });
            recordsBill.forEach(function (item, i) {
                if (item.get('cantidad') > 0) {
                    recordsBillConCantidad.push(item);
                }
            });

            //si esta desordenado puede causar que falle lo que intento hacer mas abajo en el otro comentario
            recordsMonConCantidad.sort(function (a, b) {
                return a.data.iddesglosemoneda - b.data.iddesglosemoneda;
            });
            recordsBillConCantidad.sort(function (a, b) {
                return a.data.iddesglosemoneda - b.data.iddesglosemoneda;
            });
            recordsMonConCantidad.forEach(function (item, i) {
                recordscheckmon.push(
                    '' + item.get('iddesglosemoneda') + '@' + item.get('cantidad')
                );
            });
            recordsBillConCantidad.forEach(function (item, i) {
                recordscheckbill.push(
                    '' + item.get('iddesglosemoneda') + '@' + item.get('cantidad')
                );
            });
            if (recordscheckmon.length > 0 || recordscheckbill.length > 0) {
                this.checkGpBilletesYMonedas.setValue(recordscheckmon.toString() + '@' + recordscheckbill.toString());
            } else {
                this.checkGpBilletesYMonedas.setValue('');
            }
        };

        this.desabilitarCamposForm = function (flag) {
            if (flag) {
                this.formDeposito.disable();
                this.gpIntrumentos.disable();
                this.gpDesgloseMonedas.disable();
                this.gpDesgloseBilletes.disable();
            } else {
                this.formDeposito.enable();
                this.gpIntrumentos.enable();
                this.gpDesgloseMonedas.enable();
                this.gpDesgloseBilletes.enable();
            }
        };

        this.limpiarCampos = function () {
            this.formDeposito.getForm().reset();
        };

        this.createFormSteps = function (tipoAccion) {
            this.formSteps = new Ext.FormSteps(this.formDeposito, this.buttons);
            this.formSteps.on({
                scope: this,
                Nuevo: function (fnNuevo) {
                    this.desabilitarCamposForm(false);
                    this.limpiarCampos();
                    fnNuevo.call();
                },
                Crear: function (fnCrear, cerrarVentana) {
                    // if (tipoAccion === 'add') {
                    //     var fn = function (id) {
                    //         this.desabilitarCamposForm(true);
                    //         fnCrear.call(undefined, id);
                    //     }.bind(this);
                    //     this.adicionarAnt(cerrarVentana, fn);
                    // } else if (tipoAccion === 'mod') {
                    //     var fn = function () {
                    //         this.desabilitarCamposForm(true);
                    //         fnCrear.call(undefined, this.getAnticipo());
                    //     }.bind(this);
                    //     this.modificarAnt(cerrarVentana, fn);
                    // }


                    if (this.totalDeposito == 0) {
                        mostrarMensaje(1, this.idioma.lbImporteCero);
                        return;
                    }
                    if (Caja.Deposito.Caja.tipoFondo == 2) {//2-Entrada
                        if (Caja.Deposito.Caja.idFormaPago == 2) {//2-Cheque
                            if (this.stIntrumentos.getCount() == 0) {
                                mostrarMensaje(1, this.idioma.lbNoInstrumentos);
                                return;
                            }
                        } else if (Caja.Deposito.Caja.idFormaPago == 1 && parseFloat(this.totalInst) == 0) {//1-Efectivo y no tiene instrumento a depositar
                            if ((parseFloat(this.totalBilletes) + parseFloat(this.totalMonedas)).toFixed(2) != parseFloat(this.totalInst).toFixed(2)) {
                                mostrarMensaje(1, this.idioma.lbNoInstrumentos);
                                return;
                            }
                        } else if ((parseFloat(this.totalBilletes) + parseFloat(this.totalMonedas)).toFixed(2) != parseFloat(this.totalInst).toFixed(2)) {
                            mostrarMensaje(1, this.idioma.lbDepositoMonto + parseFloat(this.totalInst).toFixed(2));
                            return;
                        }
                    } else {//Salida
                        if (Caja.Deposito.Caja.saldoActual == 0) {//Si no tiene saldo
                            mostrarMensaje(1, this.idioma.lbNoSaldoDeposito);
                            return;
                        }
                        if (parseFloat(this.totalDeposito).toFixed(2) * 1 > parseFloat(Caja.Deposito.Caja.saldoActual).toFixed(2) * 1) {//El saldo debe ser mayor igual al deposito
                            mostrarMensaje(1, this.idioma.lbMaxDeposito + parseFloat(Caja.Deposito.Caja.saldoActual).toFixed(2));
                            return;
                        }
                        //Si es el fondo de pago de nomina (debe depositar lo que tenga en efectovo)
                        if (Caja.Deposito.Caja.tipoFondo == 5 && parseFloat(this.totalDeposito).toFixed(2) != parseFloat(Caja.Deposito.Caja.saldoActual).toFixed(2)) {
                            mostrarMensaje(1, this.idioma.lbDepositoMonto + parseFloat(Caja.Deposito.Caja.saldoActual).toFixed(2));
                            return;
                        }
                    }

                    var fn = function (id) {
                        this.desabilitarCamposForm(true);
                        fnCrear.call(undefined, id);
                    }.bind(this);

                    this.guardarDeposito(cerrarVentana, fn);

                },
                Confirmar: function (fnConfirmar, id) {
                    this.scope.scope.keyMap.disable();
                    mostrarMensaje(2, this.scope.idioma.lbConfirmDeposito, function (btnPress) {
                        if (btnPress === 'ok') {
                            this.scope.confirmarDeposito(id, fnConfirmar);
                        }
                        if (btnPress === 'cancel') {
                            this.scope.scope.keyMap.enable();
                        }
                    }.bind(this));
                },
                Postear: function (fnPostear, id) {
                    var fn = fnPostear;
                    if (tipoAccion == 'mod') {
                        fn = fnPostear.createSequence(function () {
                            this.close();
                        }, this);
                    }

                    this.scope.scope.keyMap.disable();
                    mostrarMensaje(2, this.scope.idioma.lbContabDeposito, function (btnPress) {
                        if (btnPress === 'ok') {
                            this.scope.contabilizarDeposito(id, fn);
                        }
                    }.bind(this));
                },
            });
        };

    }
});

Caja.Deposito.WindowCancelar = Ext.extend(Ext.Window, {
    constructor: function (scope, fecha) {
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
            items: [this.fPanelCancelar = this.fPanelCancelar(scope, fecha)],
        });
        this.createButtons();
        return Caja.Deposito.WindowCancelar.superclass.constructor.call(this);
    },
    fPanelCancelar: function (scope, fecha) {
        this.obtenerFechaInicio = function (fechaInicio, fechaDocumento) {
            var arrFI = fechaInicio.split('/');
            var arrDO = fechaDocumento.split('/');
            var fechafi = new Date(+arrFI[2], arrFI[1] - 1, +arrFI[0]).setUTCHours(0, 0, 0, 0);
            var fechado = new Date(+arrDO[2], arrDO[1] - 1, +arrDO[0]).setUTCHours(0, 0, 0, 0);
            if (fechafi > fechado) {
                return fechaInicio;
            } else {
                return fechaDocumento;
            }
        };
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
        this.firstElement = this.cbMotivo = new Ext.form.ComboBox({
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
            format: 'd/m/Y',
            editable: false,
            anchor: '95%',
            name: 'dfCancelacion',
            id: 'dfCancelacion',
            // minValue: fecha,
            // maxValue: new Date(),
            value: fechaContable,
            minValue: this.obtenerFechaInicio(fechaInicio, fecha),
            maxValue: fechaFin,
            invalidText: 'El formato establecido: dd/mm/aaaa.',
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
            //icon: perfil.dirImg + 'cancelar.png',
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
            //icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            text: this.scope.idioma.lbBtnAceptar,
            tooltip: this.scope.idioma.tooltipAcept,
            scope: this,
            handler: function () {
                if (this.fpCancelacion.getForm().isValid()) {
                    this.scope.cancelarDeposito(this.cbMotivo.getValue(), this.dfCancelacion.getRawValue());
                    this.close();
                }
            }.bind(this)
        });
        this.buttons = [this.btnCancelar, this.btnAceptar];
    }
});
