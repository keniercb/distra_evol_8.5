Ext.namespace('Caja.Tarjetas');

//--Componete Panel Anticipo
Caja.Tarjetas.PanelAnticipo = Ext.extend(Ext.Panel, {
    constructor: function (params) {
        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            labelAlign: 'top',
            buttonAlign: 'right',
            title: this.idioma.lbTitleAnticipo,
            idioma: params.idioma,
            perfil: params.perfil,
            tipotarjeta: params.tipotarjeta,
        });
        this.createButtonPanel();
        this.createGridPanel();
        this.initEventos();
        this.initFunctions();
        Caja.Tarjetas.PanelAnticipo.superclass.constructor.call(this);
    },
    createButtonPanel: function () {
        if (this.tipotarjeta !== 2) {

            this.tbar = [
                this.btnAdicionar = new Ext.Button({
                    iconCls: 'adicionar',
                    text: this.idioma.lbAdicionar,
                    tooltip: this.idioma.lbToolAddRecarga,
                    disabled: true,
                    cambioEstado: false
                    // listeners: {
                    //     scope: this,
                    //     render: function (tf, e) {
                    //         this.btnAdicionar.focus();
                    //     }
                    // }
                }),
                this.btnModificar = new Ext.Button({
                    iconCls: 'modificar',
                    text: this.idioma.lbModificar,
                    tooltip: this.idioma.lbToolModRecarga,
                    disabled: true
                }),
                this.btnCancelar = new Ext.Button({
                    iconCls: 'cancelar',
                    text: this.idioma.lbCancelar,
                    tooltip: this.idioma.lbToolCancelRecarga,
                    disabled: true
                }),
                this.btnConfirmar = new Ext.Button({
                    iconCls: 'confirmar',
                    text: this.idioma.lbConfirmar,
                    tooltip: this.idioma.lbToolConfRecarga,
                    disabled: true
                }),
                this.btnPostear = new Ext.Button({
                    disabled: true,
                    iconCls: 'contabilidad',
                    text: this.idioma.lbPostear,
                    tooltip: this.idioma.lbToolPostearRecarga,
                }),
                this.btnLiquidar = new Ext.Button({
                    disabled: true,
                    iconCls: 'liquidar',
                    text: this.idioma.lbLiquidar,
                    tooltip: this.idioma.lbToolLiqRecarga,
                }),
                this.btnCancelarLiquidacion = new Ext.Button({
                    disabled: true,
                    iconCls: 'cancelar',
                    text: 'Cancelar liquidación',
                    tooltip: 'Cancelar las liquidaciones del anticipo'
                }),
                this.btnBalance = new Ext.Button({
                    // disabled: true,
                    iconCls: 'acumular',
                    text: 'Anticipos pendientes',
                    tooltip: 'Anticipos de combustible pendientes a liquidar'
                }),
                '->',
                this.lfdPeriodo = new Ext.form.Label({
                    id: 'lfdPeriodo',
                    text: ' ',
                    style: 'font-weight:bold;'
                }), '-',
                this.btnAyuda = new Ext.Button({
                    id: 'btnAyudaTarjetaAnticipo',
                    text: this.idioma.lbBtnAyuda,
                    tooltip: this.idioma.lbToolAyuda,
                    iconCls: 'ayuda'
                })
            ];

        } else {
            this.menuItemAdicionar = new Ext.menu.Menu({
                text: this.idioma.lbAdicionar,
                tooltip: this.idioma.lbToolAdicionar,
                iconCls: 'adicionar',
                items: [
                    this.btnAdicionar = new Ext.menu.Item({
                        iconCls: 'clausulacrm',
                        text: this.idioma.lbAdicionar,
                        tooltip: this.idioma.lbToolAddRecarga,
                        disabled: true,
                        cambioEstado: false
                    }),
                    this.btnAdicionarLiquidacionDirecta = new Ext.menu.Item({
                        iconCls: 'cargadoacuenta',
                        text: this.idioma.lbLiquidar,
                        tooltip: this.idioma.lbToolLiqRecarga,
                        // disabled: true,
                        cambioEstado: false
                    }),
                ]
            });

            this.btnMenuu = new Ext.Button({
                iconCls: 'adicionar',
                text: this.idioma.lbAdicionar,
                tooltip: this.idioma.lbToolAddRecarga,
                menu: this.menuItemAdicionar
            });



            this.tbar = [
                this.btnMenuu,
                this.btnModificar = new Ext.Button({
                    iconCls: 'modificar',
                    text: this.idioma.lbModificar,
                    tooltip: this.idioma.lbToolModRecarga,
                    disabled: true
                }),
                this.btnCancelar = new Ext.Button({
                    iconCls: 'cancelar',
                    text: this.idioma.lbCancelar,
                    tooltip: this.idioma.lbToolCancelRecarga,
                    disabled: true
                }),
                this.btnConfirmar = new Ext.Button({
                    iconCls: 'confirmar',
                    text: this.idioma.lbConfirmar,
                    tooltip: this.idioma.lbToolConfRecarga,
                    disabled: true
                }),
                this.btnPostear = new Ext.Button({
                    disabled: true,
                    iconCls: 'contabilidad',
                    text: this.idioma.lbPostear,
                    tooltip: this.idioma.lbToolPostearRecarga,
                }),
                this.btnLiquidar = new Ext.Button({
                    disabled: true,
                    iconCls: 'liquidar',
                    text: this.idioma.lbLiquidar,
                    tooltip: this.idioma.lbToolLiqRecarga,
                }),
                this.btnCancelarLiquidacion = new Ext.Button({
                    disabled: true,
                    iconCls: 'cancelar',
                    text: 'Cancelar liquidación',
                    tooltip: 'Cancelar las liquidaciones del anticipo'
                }),
                // this.btnVerCom = new Ext.Button({
                //     disabled: true,
                //     iconCls: 'vistareporte',
                //     text: this.idioma.lbVerCom,
                //     tooltip: this.idioma.lbToolVerComp,
                // }),
                '->',
                this.lfdPeriodo = new Ext.form.Label({
                    id: 'lfdPeriodo',
                    text: ' ',
                    style: 'font-weight:bold;'
                }), '-',
                this.btnAyuda = new Ext.Button({
                    id: 'btnAyudaTarjetaAnticipo',
                    text: this.idioma.lbBtnAyuda,
                    tooltip: this.idioma.lbToolAyuda,
                    iconCls: 'ayuda'
                })
            ];
        }
    },
    createGridPanel: function () {
        var me = this;
        this.searchField = new Ext.Cont.SearchField({
            width: (Ext.lib.Dom.getViewWidth() - 10) * 0.1,
            maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda ]*$/,
            scope: this,
            fnOnSearch: function () {
                me.buscarAnticipo(me.searchField.getRawValue());
            },
            fnOnClear: function () {
                me.buscarAnticipo('');
            }
        });

        this.rdAnticipo = new Ext.data.JsonReader(
            {
                root: 'datos',
                totalProperty: 'cant'
            }, [{
                name: 'idmovimiento'
            }, {
                name: 'chip'
            }, {
                name: 'iddocumento'
            }, {
                name: 'numerodocumento'
            }, {
                name: 'idoperacion'
            }, {
                name: 'vehiculo'
            }, {
                name: 'idvehiculo'
            }, {
                name: 'importemo'
            }, {
                name: 'importeliquidadomb'
            }, {
                name: 'importeliquidadomo'
            }, {
                name: 'idrecibe'
            }, {
                name: 'nompersona'
            }, {
                name: 'idestado'
            }, {
                name: 'idtarjeta'
            }, {
                name: 'numcomp'
            }, {
                name: 'nomestado'
            }, {
                name: 'precio'
            }, {
                name: 'fecha'
            }, {
                name: 'liquidaciones', mapping: 'DatLiquidacionCombustible'
            }, {
                name: 'idcuentaelemento'
            }, {
                name: 'nomcuentaelemento'
            }, {
                name: 'showCmp'
            }, {
                name: 'tipo'
            }, {
                name: 'devuelto', type: 'float'
            },

            ]);

        this.stAnticipo = new Ext.data.Store({
            url: 'cargaranticipos',
            reader: this.rdAnticipo,
            scope: this,
            baseParams: {
                limit: 15,
                filter: ''

            },
            autoLoad: false
        });

        this.rowaction = new Ext.grid.RowActions({
            id: 'idRowaction',
            widthSlope: 100,
            header: "No. Comprobanteee",
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
                    textIndex: 'numcomp'
                },
            ]
        });

        this.gpAnticipo = new Ext.grid.GridPanel({
            scope: me,
            border: false,
            split: true,
            loadMask: true,
            frame: false,
            //height: Ext.lib.Dom.getViewHeight() * 0.4,
            // height: 420,
            arrayPaginSelect: new Array(),
            layout: 'fit',
            autoExpandColumn: 'columusuario',
            store: this.stAnticipo,
            // sm: this.smRecarga = new Ext.grid.CheckboxSelectionModel({
            sm: this.smAnticipo = new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            columns: [
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idmovimiento'
                }, {
                    sortable: true,
                    width: 10,
                    header: this.idioma.lbNumeroDocumento,
                    hideable: true,
                    id: 'numerodocumento',
                    dataIndex: 'numerodocumento'
                }, /*{
                    sortable: true,
                    width: 15,
                    header: this.idioma.lbChip,
                    hideable: true,
                    id: 'chip',
                    dataIndex: 'chip'
                },*/ {
                    sortable: true,
                    header: this.idioma.lbResponsable,
                    width: 25,
                    hideable: true,
                    id: 'columusuario',
                    dataIndex: 'nompersona'
                }, {
                    header: this.idioma.lbFecha,
                    sortable: true,
                    hideable: true,
                    width: 10,
                    dataIndex: 'fecha'
                }, {
                    header: this.idioma.lbEstado,
                    sortable: true,
                    hideable: true,
                    width: 10,
                    dataIndex: 'nomestado'
                }, {
                    header: this.idioma.lbImporteAnticipado,
                    sortable: true,
                    width: 10,
                    hideable: true,
                    dataIndex: 'importemo',
                    renderer: formatoMoneda
                }, {
                    header: this.idioma.lbImporteLiquidado,
                    sortable: true,
                    width: 10,
                    hideable: true,
                    dataIndex: 'importeliquidadomo',
                    renderer: formatoMoneda
                }, {
                    header: this.idioma.lbLitrosAnticipados,
                    dataIndex: 'litros',
                    width: 10,
                    hidden: this.tipotarjeta === 2,
                    hideable: this.tipotarjeta !== 2,
                    sortable: true,
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        if (me.scope.gridTarjeta.smTarjeta.getSelected().data.tipo == 1) {
                            return parseFloat(record.data.importemo / record.data.precio).toFixed(2);
                        } else {
                            return '';
                        }
                    }
                }, {
                    header: this.idioma.lbLitrosLiquidados,
                    dataIndex: 'litros',
                    width: 10,
                    hidden: this.tipotarjeta === 2,
                    hideable: this.tipotarjeta !== 2,
                    sortable: true,
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        if (me.scope.gridTarjeta.smTarjeta.getSelected().data.tipo == 1) {
                            return parseFloat(record.data.importeliquidadomo / record.data.precio).toFixed(2);
                        } else {
                            return '';
                        }
                    }
                },
                // {
                //     header: this.idioma.lbNumeroComprobante,
                //     sortable: true,
                //     width: 10,
                //     hideable: true,
                //     dataIndex: 'numcomp'
                // },
                this.rowaction],
            viewConfig: {
                forceFit: true
            },
            forceFit: true,
            tbar: [this.searchField, '->', Caja.Componentes.cbEjercicio, '-', Caja.Componentes.cbPeriodo],
            bbar: this.pagToolAnticipo = new Ext.Cont.PagingToolbar({
                pageSize: 15,
                store: this.stAnticipo,
                displayInfo: true
            }),
            plugins: this.rowaction
        });
        this.items = [this.gpAnticipo];

    },
    initEventos: function () {
        var me = this;

        Caja.Componentes.cbPeriodo.on({
            scope: this,
            select: function (cb, record) {
                this.gpAnticipo.getBottomToolbar().changePage(0);
                //this.stAnticipo.reload();
            }
        });

        this.btnAdicionar.on({
            scope: this,
            click: function (button, event) {
                var tarjetaSelect = me.scope.gridTarjeta.smTarjeta.getSelected().data;
                ///Esto es tremendan cascara tengo que hacerlo por una regex pero no me sale y no tengo doc
                if (this.tipotarjeta !== 2 && parseFloat(tarjetaSelect.saldomo) <= 0 ) {
                    mostrarMensaje(2, this.idioma.lbAdvertenciaSaldoInsuficienteTarjeta);
                } else if (this.tipotarjeta !== 2 && ((me.stAnticipo.find('idestado', '8') > -1) ||
                    (me.stAnticipo.find('idestado', '5') > -1) ||
                    (me.stAnticipo.find('idestado', '6') > -1))) {
                    mostrarMensaje(2, this.idioma.lbAdvertenciaLiquidacion);
                } else {
                    Ext.Msg.wait('Verificando...', 'Espere');
                    Ext.Ajax.request({
                        url: "verificarSiPuedeAdicionar",
                        scope: this,
                        params: {
                            idtarjeta: tarjetaSelect.idtarjeta
                        },
                        callback: function (options, success, response) {
                            var responseData = Ext.decode(response.responseText);
                            Ext.MessageBox.hide();
                            if (responseData.cod == 1) {
                                this.winAnt = new Caja.Tarjetas.WindowAnticipo({
                                    idioma: this.idioma,
                                    perfil: this.perfil,
                                    scope: this,
                                    title: this.tipotarjeta === 2 ? this.idioma.lbTitleAddAntTarjeta : this.idioma.lbTitleAddAnt,
                                    accion: 'add',
                                    tarjetaSelect: tarjetaSelect,
                                    tipotarjeta: this.tipotarjeta,
                                    saldo: tarjetaSelect.saldomo
                                });
                                this.winAnt.show();
                                this.winAnt.nfNumero.focus(true, true);
                                this.winAnt.cargarWinMod(me.scope.gridTarjeta.smTarjeta.getSelected());
                                this.winAnt.nfNumero.setValue(tarjetaSelect.numero);
                                if (this.tipotarjeta !== 2) {//Combustible
                                    this.winAnt.cbPersona.setValue(tarjetaSelect.idpersona);
                                    this.winAnt.cbPersona.setRawValue(tarjetaSelect.nompersona);
                                    this.winAnt.nfImporteAnt.setValue(parseFloat(tarjetaSelect.saldomo));
                                    this.winAnt.nfImporteAnt.setRawValue(formatoMoneda(parseFloat(tarjetaSelect.saldomo)));
                                    this.winAnt.stOperacion.load({
                                        params: {
                                            concepto: '38',//38-Anticipo de combustible
                                            idMoneda: tarjetaSelect.idmoneda,
                                            nomcuenta: tarjetaSelect.nomcuenta
                                        }
                                    });
                                    if (tarjetaSelect.tipo == 1) {
                                        this.winAnt.nfLitrosAnt.setValue(parseFloat(tarjetaSelect.saldomo / tarjetaSelect.preciocombustible).toFixed(2));
                                    }
                                } else {//Otras tarjetas
                                    this.winAnt.cbPersona.setValue(tarjetaSelect.idpersona);
                                    this.winAnt.cbPersona.setRawValue(tarjetaSelect.nompersona);
                                    this.winAnt.nfImporteAnt.setValue(parseFloat(tarjetaSelect.saldomo));
                                    this.winAnt.stOperacion.load({
                                        params: {
                                            concepto: '50',//50-Anticipo de Otras tarjetas
                                            idMoneda: tarjetaSelect.idmoneda,
                                            nomcuenta: tarjetaSelect.nomcuenta
                                        }
                                    });
                                    this.winAnt.nfLitrosAnt.setValue(1);
                                }
                                //this.winAnt.stVehiculo.load();
                            } else {
                                mostrarMensaje(2, this.idioma.lbAdvertenciaLiquidacion);
                            }
                        }
                    });
                }
            }
        });

        if (this.tipotarjeta === 2) {
            this.btnAdicionarLiquidacionDirecta.on({
                scope: this,
                click: function (button, event) {
                    var tarjetaSelect = me.scope.gridTarjeta.smTarjeta.getSelected().data;
                    if (parseFloat(tarjetaSelect.saldomo) <= 0) {
                        mostrarMensaje(2, this.idioma.lbAdvertenciaSaldoInsuficienteTarjeta)
                    } else {
                        this.winAnt = new Caja.Tarjetas.WindowAnticipo({
                            idioma: this.idioma,
                            perfil: this.perfil,
                            scope: this,
                            title: /*this.idioma.lbTitleAddAnt*/'Liquidacion directa',
                            accion: 'liquidacion directa',
                            tarjetaSelect: tarjetaSelect,
                            tipotarjeta: this.tipotarjeta,
                            saldo: tarjetaSelect.saldomo
                        });
                        this.winAnt.show();
                        this.winAnt.btnAddLiq.focus(true);
                        this.winAnt.cargarWinMod(me.scope.gridTarjeta.smTarjeta.getSelected());
                        this.winAnt.nfNumero.setValue(tarjetaSelect.numero);
                        this.winAnt.nfImporteAnt.setValue(parseFloat(tarjetaSelect.saldomo).toFixed(2));
                        this.winAnt.nfImporteAnt.setRawValue(formatoMoneda(tarjetaSelect.saldomo));
                        this.winAnt.nfImporteLiquidado.setValue(0);
                        this.winAnt.cbPersona.setValue(tarjetaSelect.idpersona);
                        this.winAnt.cbPersona.setRawValue(tarjetaSelect.nompersona);
                        // this.winAnt.nfImporteLiquidado.setRawValue(0);
                        // this.winAnt.dfFechaAnt.setValue(AnticipoSelect.fecha);
                        // this.winAnt.dfFechaAnt.disabled = true;
                        //Otras tarjetas
                        this.winAnt.stOperacion.load({
                            scope: this,
                            params: {
                                concepto: '51',//51-Liquidacion de Otras tarjetas
                                idMoneda: tarjetaSelect.idmoneda,
                                nomcuenta: tarjetaSelect.nomcuenta
                            }, callback: function () {
                                //this.winAnt.cbxCuenta.enable();
                            }
                        });
                        this.winAnt.nfLitrosAnt.setValue(1);
                    }
                }
            })
        }

        this.btnModificar.on({
            click: function (button, event) {
                var AnticipoSelect = me.smAnticipo.getSelected().data;
                var tarjetaSelect = me.scope.gridTarjeta.smTarjeta.getSelected().data;
                if (this.tipotarjeta === 2 && me.smAnticipo.getSelected().json.tipo == 2) {
                    this.modLiqDirecta();
                } else {
                    this.winAnt = new Caja.Tarjetas.WindowAnticipo({
                        idioma: this.idioma,
                        perfil: this.perfil,
                        scope: this,
                        title: this.tipotarjeta === 2 ? this.idioma.lbTitleModAntTarjeta : this.idioma.lbTitleModAnt,
                        accion: 'mod',
                        anticipoSelect: AnticipoSelect,
                        tipotarjeta: this.tipotarjeta,
                        // saldo: this.tipotarjeta === 2 ? parseFloat(AnticipoSelect.importemo) + tarjetaSelect.saldomo : tarjetaSelect.saldomo
                        saldo: parseFloat(AnticipoSelect.importemo) + tarjetaSelect.saldomo
                    });
                    this.winAnt.show();
                    this.winAnt.nfNumero.focus(true, true);
                    this.winAnt.cargarWinMod(me.smAnticipo.getSelected());
                    this.winAnt.nfNumero.setValue(tarjetaSelect.numero);
                    this.winAnt.cbPersona.setValue(AnticipoSelect.idrecibe);
                    this.winAnt.cbPersona.setRawValue(AnticipoSelect.nompersona);
                    this.winAnt.nfImporteAnt.setValue(AnticipoSelect.importemo);
                    this.winAnt.nfImporteAnt.setRawValue(formatoMoneda(AnticipoSelect.importemo));
                    this.winAnt.dfFechaAnt.setValue(AnticipoSelect.fecha);
                    this.winAnt.stOperacion.idoperacion = AnticipoSelect.idoperacion;
                    if (this.tipotarjeta !== 2) {//Combustible
                        if (tarjetaSelect.tipo == 1) {
                            this.winAnt.nfLitrosAnt.setValue(parseFloat(AnticipoSelect.importemo / AnticipoSelect.precio).toFixed(2));
                        }
                        this.winAnt.stOperacion.load({
                            params: {
                                concepto: '38',
                                idMoneda: tarjetaSelect.idmoneda,
                                nomcuenta: tarjetaSelect.nomcuenta
                            }
                        });
                    } else {//Otras tarjetas
                        this.winAnt.stOperacion.load({
                            params: {
                                concepto: '50',
                                idMoneda: tarjetaSelect.idmoneda,
                                nomcuenta: tarjetaSelect.nomcuenta
                            }
                        });
                        this.winAnt.nfLitrosAnt.setValue(1);
                    }
                    //this.winAnt.stVehiculo.load();
                }
            },
            scope: this
        });

        this.btnCancelar.on({
            scope: this,
            click: function (button, event) {
                this.scope.keyMapa.disable();
                var me = this;
                var selections = this.smAnticipo.getSelections();
                var pregCancel = (selections.length == 1) ? this.idioma.lbCancelAnticipoConfir : this.idioma.lbCancelAnticiposConfir;
                mostrarMensaje(2, pregCancel, function (btnPress) {
                    if (btnPress === 'ok') {
                        var objWinCancelar = new Caja.WindowCancelar({
                            selections: selections,
                            fecha: me.smAnticipo.getSelected().data.fecha
                        });
                        objWinCancelar.show();
                        objWinCancelar.btnAceptar.on({
                            scope: this,
                            click: function () {
                                if (selections[0].data.idestado == 6 || (me.tipotarjeta === 2 && me.smAnticipo.getSelected().json.tipo == 2 && selections[0].data.idestado == 9)) {
                                    var params = {
                                        idmotivo: objWinCancelar.cbmotivo.getValue(),
                                        fecha: objWinCancelar.dffechacancelacion.getRawValue(),
                                        tipoContabilizacion: 2,//1-contabilizar doc confirmado | 2-revertir comprobnate contabilizado | 3-liquidar anticipo
                                        descripcion: 'Cancelando anticipo de la tarjeta #' + me.scope.gridTarjeta.smTarjeta.getSelected().data.numero + ': '
                                    };
                                    if (me.tipotarjeta === 2 && me.smAnticipo.getSelected().json.tipo == 2) {
                                        me.fLoadDataComprobanteLiqDirecta(params);
                                    } else {
                                        me.fLoadDataComprobante(params);
                                    }
                                } else {
                                    var params = {
                                        idmotivo: objWinCancelar.cbmotivo.getValue(),
                                        fecha: objWinCancelar.dffechacancelacion.getRawValue()
                                    };
                                    me.cancelarAnticipo(params);
                                }
                            }
                        });
                    }
                    me.scope.keyMapa.enable();
                });
            }
        });

        this.btnConfirmar.on({
            scope: this,
            click: function (button, event) {
                this.scope.keyMapa.disable();
                var me = this;
                var selections = this.smAnticipo.getSelections();
                var pregConf = (selections.length == 1) ? this.idioma.lbConfirAnticipoConfir : this.idioma.lbConfirAnticiposConfir;
                mostrarMensaje(2, pregConf, function (btnPress) {
                    if (btnPress === 'ok') {
                        me.confirmarAnticipo(selections);
                    }
                    me.scope.keyMapa.enable();
                });
            }
        });

        this.btnPostear.on({
            scope: this,
            click: function (button, event) {
                this.scope.keyMapa.disable();
                var me = this;
                var selections = this.smAnticipo.getSelections();
                var pregPost = (selections.length == 1) ? this.idioma.lbPostAnticipoConfir : this.idioma.lbPostAnticiposConfir;
                mostrarMensaje(2, pregPost, function (btnPress) {
                    if (btnPress === 'ok') {
                        var descrip = me.tipotarjeta !== 2 ? 'Posteando anticipo de la tarjeta #' : 'Posteando anticipo de tarjeta combustible de la tarjeta #';
                        params = {
                            tipoContabilizacion: 1, //1-contabilizar doc confirmado | 2-revertir comprobnate contabilizado | 3-liquidar anticipo
                            actionContabiliza: 'contabilizar',
                            descripcion: descrip + me.scope.gridTarjeta.smTarjeta.getSelected().data.numero + ': ',
                            fecha: me.smAnticipo.getSelected().json.fecha
                        };
                        if (me.tipotarjeta === 2 && me.smAnticipo.getSelected().json.tipo == 2) {
                            me.fLoadDataComprobanteLiqDirecta(params);
                        } else {
                            me.fLoadDataComprobante(params);
                        }
                    }
                    if (btnPress === 'cancel') {
                        me.scope.keyMapa.enable();
                    }
                });
            }
        });

        this.smAnticipo.on({
            rowselect: function (smodel, rowIndex, record) {
                this.grid.getView().addRowClass(rowIndex, "negrita");
                var tarjetaSelect = me.scope.gridTarjeta.smTarjeta.getSelected().data;
                if (tarjetaSelect.activo == 1) {
                    var anticipoSelect = this.getSelected().data;
                    this.grid.scope.btnModificar.setDisabled(!(anticipoSelect.idestado == 8));
                    this.grid.scope.btnConfirmar.setDisabled(!(anticipoSelect.idestado == 8));
                    this.grid.scope.btnPostear.setDisabled(!(anticipoSelect.idestado == 5));
                    if (me.tipotarjeta === 2 && this.getSelected().json.tipo == 2) {
                        this.grid.scope.btnCancelar.setDisabled(!(anticipoSelect.idestado == 8 || anticipoSelect.idestado == 5 || anticipoSelect.idestado == 9));
                        this.grid.scope.btnLiquidar.setDisabled(true);
                        this.grid.scope.btnCancelarLiquidacion.setDisabled(true);
                    } else {
                        this.grid.scope.btnLiquidar.setDisabled(!(anticipoSelect.idestado == 6 || (anticipoSelect.idestado == 10 && anticipoSelect.importeliquidadomo != anticipoSelect.importemo)));
                        this.grid.scope.btnCancelarLiquidacion.setDisabled(!(anticipoSelect.idestado == 6 || anticipoSelect.idestado == 9 || anticipoSelect.idestado == 10) || anticipoSelect.importeliquidadomo == 0);
                        this.grid.scope.btnCancelar.setDisabled(!(anticipoSelect.idestado == 8 || anticipoSelect.idestado == 5 || anticipoSelect.idestado == 6) || anticipoSelect.importeliquidadomo != 0);
                    }
                }
            },
            rowdeselect: function (smodel, rowIndex, record) {
                this.grid.getView().removeRowClass(rowIndex, "negrita");
                this.grid.scope.btnModificar.setDisabled(true);
                this.grid.scope.btnCancelar.setDisabled(true);
                this.grid.scope.btnConfirmar.setDisabled(true);
                this.grid.scope.btnPostear.setDisabled(true);
                this.grid.scope.btnLiquidar.setDisabled(true);
                this.grid.scope.btnCancelarLiquidacion.setDisabled(true);
            }
        });

        this.btnLiquidar.on({
            scope: this,
            click: function (button, event) {
                var AnticipoSelect = me.smAnticipo.getSelected().data;
                var tarjetaSelect = me.scope.gridTarjeta.smTarjeta.getSelected().data;

                this.winAnt = new Caja.Tarjetas.WindowAnticipo({
                    idioma: this.idioma,
                    perfil: this.perfil,
                    scope: this,
                    title: this.tipotarjeta === 2 ? this.idioma.lbTitleLiqTarjeta : this.idioma.lbTitleLiq,
                    accion: 'liquidar',
                    anticipoSelect: AnticipoSelect,
                    tarjetaSelect: tarjetaSelect,
                    tipotarjeta: this.tipotarjeta,
                });
                this.winAnt.show();
                this.winAnt.btnAddLiq.focus(true);
                this.winAnt.cargarWinMod(me.smAnticipo.getSelected());
                this.winAnt.nfNumero.setValue(tarjetaSelect.numero);
                this.winAnt.cbPersona.setValue(AnticipoSelect.idrecibe);
                this.winAnt.cbPersona.setRawValue(AnticipoSelect.nompersona);
                this.winAnt.nfImporteAnt.setValue(parseFloat(AnticipoSelect.importemo).toFixed(2));
                this.winAnt.nfImporteAnt.setRawValue(formatoMoneda(AnticipoSelect.importemo));
                this.winAnt.nfImporteLiquidado.setValue(parseFloat(AnticipoSelect.importeliquidadomo).toFixed(2));
                this.winAnt.nfImporteLiquidado.setRawValue(formatoMoneda(AnticipoSelect.importeliquidadomo));
                this.winAnt.dfFechaAnt.setValue(AnticipoSelect.fecha);
                this.winAnt.dfFechaAnt.disabled = true;
                if (this.tipotarjeta !== 2) {//Combustible
                    if (tarjetaSelect.tipo == 1) {
                        this.winAnt.nfLitrosAnt.setValue(parseFloat(AnticipoSelect.importemo / AnticipoSelect.precio).toFixed(2));
                    }
                    this.winAnt.stOperacion.load({
                        scope: this,
                        params: {
                            concepto: '39',//39-Liquidacion
                            idMoneda: tarjetaSelect.idmoneda,
                            nomcuenta: tarjetaSelect.nomcuenta
                        }, callback: function () {
                            //this.winAnt.cbxCuenta.enable();
                        }
                    });
                } else {//Otras tarjetas
                    this.winAnt.stOperacion.load({
                        scope: this,
                        params: {
                            concepto: '51',//51-Liquidacion de Otras tarjetas
                            idMoneda: tarjetaSelect.idmoneda,
                            nomcuenta: tarjetaSelect.nomcuenta
                        }, callback: function () {
                            //this.winAnt.cbxCuenta.enable();
                        }
                    });
                    this.winAnt.nfLitrosAnt.setValue(1);
                }
                //this.winAnt.stVehiculo.load();
            }
        });

        this.btnCancelarLiquidacion.on({
            scope: this,
            click: function (button, event) {
                this.scope.keyMapa.disable();
                var me = this;
                var selections = this.smAnticipo.getSelections();
                var pregCancel = "¿Está seguro que quiere cancelar las liquidaciones del anticipo seleccionado?";
                mostrarMensaje(2, pregCancel, function (btnPress) {
                    if (btnPress === 'ok') {
                        var objWinCancelar = new Caja.WindowCancelar({
                            selections: selections,
                            fecha: me.smAnticipo.getSelected().data.fecha
                        });
                        objWinCancelar.show();
                        objWinCancelar.btnAceptar.on({
                            scope: this,
                            click: function () {
                                var descrip = me.tipotarjeta !== 2 ? 'Cancelando liquidación de la tarjeta #' : 'Cancelando liquidación de tarjeta combustible de la tarjeta #';
                                var params = {
                                    idmotivo: objWinCancelar.cbmotivo.getValue(),
                                    fecha: objWinCancelar.dffechacancelacion.getRawValue(),
                                    tipoContabilizacion: 4,//4-Cancelar Liquidacion
                                    descripcion: descrip + me.scope.gridTarjeta.smTarjeta.getSelected().data.numero + ': '
                                };
                                me.fLoadDataComprobante(params);
                            }
                        });
                    }
                    me.scope.keyMapa.enable();
                });
            }
        });

        this.btnBalance.on({
            scope: this,
            click: function () {
                this.getDataReporteAnticipo();
            }
        });

        this.rowaction.on({
            action: function (grid, recordarray, icon, rowindex, colindex) {
                fShowReporteComprobante();
            },
            beforeaction: function (grid, rowIndex) {
            }
        });

        fShowReporteComprobante = function () {
            // Ext.Msg.wait(scope.etiquetas.lbCargando, scope.etiquetas.lbEspere);
            Ext.Msg.wait('Cargando...', 'Espere');
            var arrayIdCmp = me.smAnticipo.getSelected().json.arrayIdCmp;

            Ext.Ajax.request({
                url: "/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/registrodecomprobantes/" + 'obtenerDatosImprimirReporte',
                params: {
                    reporteParams: Ext.encode(arrayIdCmp)
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.dataSources.length > 0) {
                        fOpenWindowReportCmp({
                            datoGeneral: {
                                reporte: '100',
                                titulo: 'Comprobante de operaciones',
                            },
                            datoCuerpo: responseData.dataSources
                        });
                    }
                    Ext.MessageBox.hide();
                }
            });
        };

        fOpenWindowReportCmp = function (datosReporte) {
            defaultComponentsValue = {
                paperSize: "A4",
                orientation: "Horizontal",
                reportType: "HTML"
            };
            var printView = new SCFPrintView(datosReporte, "/contabilidad/comun/SCFPrintView/", defaultComponentsValue);
            printView.show();
        };

        this.getDataReporteAnticipo = function () {
            Ext.Msg.wait(this.idioma.lbCargando, this.idioma.lbEspere);
            Ext.Ajax.request({
                scope: this,
                url: 'balanceCombustibleAnticipo',
                method: 'POST',
                params: {
                    idCaja: this.scope.winCaja.idCaja,
                    idPeriodo: Caja.Componentes.cbPeriodo.getValue(),
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == -1)
                        mostrarMensaje(1, me.idioma.lbNoOperRegistradas);
                    else if (responseData.codMg == -2)
                        mostrarMensaje(1, 'No existen anticipios de combustible pendientes a liquidar.');
                    else
                        me.fOpenWindowReport(responseData.dataSources);
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
            printView.show();
        };

        this.stAnticipo.on({
                scope: this,
                beforeload: function (store, records, options) {
                    this.btnModificar.setDisabled(true);
                    this.btnCancelar.setDisabled(true);
                    this.btnConfirmar.setDisabled(true);
                    this.btnPostear.setDisabled(true);
                    this.btnLiquidar.setDisabled(true);
                    this.btnCancelarLiquidacion.setDisabled(true);

                    if (this.scope.gridTarjeta.smTarjeta.getSelections().length == 1) {
                        this.stAnticipo.baseParams.idtarjeta = this.scope.gridTarjeta.smTarjeta.getSelected().data.idtarjeta;
                        this.stAnticipo.baseParams.idPeriodo = Caja.Componentes.cbPeriodo.getValue();
                        this.btnAdicionar.cambioEstado = true;
                    }
                    if (me.smAnticipo.hasSelection())
                        me.idAnticipo = me.smAnticipo.getSelected().data.idmovimiento;
                    else me.idAnticipo = null;
                },
                load: function (store, records, options) {
                    if (!records.length && store.baseParams.filter != '')
                        mostrarMensaje(1, this.idioma.lbNoResultadosBusqueda)// 'No existen datos que se correspondan con el criterio de búsqueda especificado.')
                    if (this.scope.gridTarjeta.smTarjeta.getSelections().length == 1) {
                        this.btnAdicionar.cambioEstado = false;
                    }
                    if (records.length == 0)
                        mostrarMensaje(1, this.idioma.lbNoHayDatos);
                    if (me.idAnticipo) {
                        var index = me.stAnticipo.find('idmovimiento', me.idAnticipo);
                        me.smAnticipo.selectRow(index);
                    } else {
                        me.smAnticipo.selectFirstRow();
                    }
                }
            }
        );
        this.gpAnticipo.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.data.idestado == '9') { //Cancelado
                return 'FilaVerde';
            } else if (record.data.idestado == '7') { //Posteado
                return 'FilaRoja';
            }
        };

        this.gpAnticipo.on({
            scope: this,
            rowdblclick: function (grid, rowIndex) {
                var selectionData = this.smAnticipo.getSelected().data;
                if (selectionData.idestado == 6 || selectionData.idestado == 9 || selectionData.idestado == 10) {
                    this.btnLiquidar.fireEvent('click');
                }
                if (selectionData.idestado == 5 || selectionData.idestado == 8 || selectionData.idestado == 7) {
                    this.btnModificar.fireEvent('click');
                }
                if (selectionData.idestado != 8 && selectionData.idestado != 6) {//8-Guardado y 6-Posteado
                    this.winAnt.setTitle(this.idioma.lbTitleLiqInfo);
                    this.winAnt.btnAddLiq.setVisible(false);
                    this.winAnt.btnAceptar.setVisible(false);
                    this.winAnt.cbOperacionContable.disable();
                    this.winAnt.cbxCuenta.setValue(selectionData.idcuentaelemento, selectionData.nomcuentaelemento);
                    if (me.tipotarjeta === 1) {
                        this.winAnt.stLiquidacion.loadData(selectionData.liquidaciones);
                    }

                    this.winAnt.cbxCuenta.readOnly = true;
                    this.winAnt.cbxCuenta.disable();
                    this.winAnt.ckTarjeta.setVisible(false);
                    this.winAnt.smLiquidacion.lock();

                }
            }
        });

    },
    initFunctions: function () {
        var me = this;

        this.modLiqDirecta = function () {
            var AnticipoSelect = me.smAnticipo.getSelected().data;
            var tarjetaSelect = me.scope.gridTarjeta.smTarjeta.getSelected().data;

            this.winAnt = new Caja.Tarjetas.WindowAnticipo({
                idioma: this.idioma,
                perfil: this.perfil,
                scope: this,
                title: this.tipotarjeta === 2 ? this.idioma.lbTitleModAntTarjeta : this.idioma.lbTitleModAnt,
                accion: 'liquidacion directa',
                accion1: 'mod',
                anticipoSelect: AnticipoSelect,
                tarjetaSelect: tarjetaSelect,
                tipotarjeta: this.tipotarjeta,
                saldo: AnticipoSelect.importeliquidadomo + tarjetaSelect.saldomo
            });
            this.winAnt.show();
            this.winAnt.nfNumero.focus(true, true);
            this.winAnt.cargarWinMod(me.smAnticipo.getSelected());
            this.winAnt.nfNumero.setValue(tarjetaSelect.numero);
            this.winAnt.cbPersona.setValue(AnticipoSelect.idrecibe);
            this.winAnt.cbPersona.setRawValue(AnticipoSelect.nompersona);
            this.winAnt.nfImporteAnt.setValue(AnticipoSelect.importeliquidadomo);
            this.winAnt.nfImporteAnt.setRawValue(formatoMoneda(AnticipoSelect.importeliquidadomo));
            this.winAnt.nfImporteLiquidado.setValue(0);
            this.winAnt.nfImporteLiquidado.setRawValue(0);
            this.winAnt.dfFechaAnt.setValue(AnticipoSelect.fecha);
            this.winAnt.stOperacion.idoperacion = AnticipoSelect.idoperacion;
            me.winAnt.cbxCuenta.setValue(me.smAnticipo.getSelected().json.idcuentaelemento, me.smAnticipo.getSelected().json.descuentaelemento);

            // this.winAnt.stCuenta.on({
            //     load: function () {
            //
            //         // me.winAnt.cbxCuenta.setRawValue(me.smAnticipo.getSelected().json.descuentaelemento);
            //     }
            // });
            this.winAnt.stLiquidacion.loadData(me.smAnticipo.getSelected().json.DatLiquidacionTarjetaOtros);

            this.winAnt.stOperacion.load({
                params: {
                    concepto: '51',
                    idMoneda: tarjetaSelect.idmoneda,
                    nomcuenta: tarjetaSelect.nomcuenta
                }
            });
            this.winAnt.nfLitrosAnt.setValue(1);
        };

        this.fDeshabilitarTodosBotonesPanelAnticipo = function () {
            this.btnAdicionar.setDisabled(true);
            this.btnModificar.setDisabled(true);
            this.btnCancelar.setDisabled(true);
            this.btnConfirmar.setDisabled(true);
            this.btnPostear.setDisabled(true);
            this.btnLiquidar.setDisabled(true);
            this.btnCancelarLiquidacion.setDisabled(true);
        };
        this.fDeshabilitarTodosBotonesPanelAnticipoMenosAdicionar = function () {
            this.btnModificar.setDisabled(true);
            this.btnCancelar.setDisabled(true);
            this.btnConfirmar.setDisabled(true);
            this.btnPostear.setDisabled(true);
            this.btnLiquidar.setDisabled(true);
            this.btnCancelarLiquidacion.setDisabled(true);
        };
        this.lMaskCargando = function () {
            this.lMask = new Ext.LoadMask(me.body, {//body de la ventana
                msg: this.idioma.lbCargando
            });
            this.lMask.show();
        };
        this.buscarAnticipo = function (filter) {
            this.stAnticipo.baseParams.filter = filter;
            this.stAnticipo.load({
                params: {
                    idtarjeta: me.scope.gridTarjeta.smTarjeta.getSelected().data.idtarjeta
                }
            });


        };
        this.cancelarAnticipo = function (params) {
            Ext.Msg.wait(this.idioma.lbCancelando, this.idioma.lbEspere);
            var selections = me.smAnticipo.getSelections();
            var arrayId = new Array();
            for (var i = 0; i < selections.length; i++) {
                arrayId.push(selections[i].data.iddocumento);
            }

            if (params.tipoContabilizacion == 4) {//Cancelando liquidacion
                var msgSuccess = "La liquidación ha sido cancelada satisfactoriamente.";
            } else {
                var msgSuccess = (arrayId.length == 1) ? this.idioma.lbACancelAnticipoSatisfact : this.idioma.lbACancelAnticiposSatisfact;
            }

            Ext.Ajax.request({
                scope: this,
                url: 'cancelaranticipo',
                params: {
                    arrayId: Ext.encode(arrayId),
                    idmotivo: params.idmotivo,
                    fecha: params.fecha,
                    idComprobante: params.idComprobante,
                    numComprobante: params.numComprobante,
                    fechaComprobante: params.fechaComprobante,
                    idTarjeta: selections[0].data.idtarjeta,
                    importemo: (this.tipotarjeta === 2 && selections[0].json.tipo == 2) ? selections[0].data.importeliquidadomo : selections[0].data.importemo,
                    tipoContabilizacion: params.tipoContabilizacion,
                    idMovimiento: params.idmovimiento,
                    idEstado: selections[0].data.idestado,
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.codMg == '1') {
                        mostrarMensaje(1, msgSuccess);
                        this.stAnticipo.reload();
                        this.scope.gridTarjeta.stTarjeta.reload();
                        Ext.MessageBox.hide();
                        this.smAnticipo.deselectRange(0, this.stAnticipo.data.length);
                    }
                }
            });
        };
        this.confirmarAnticipo = function (selections) {
            Ext.Msg.wait(this.idioma.lbConfirmando, this.idioma.lbEspere);
            var arrayId = new Array();
            for (var i = 0; i < selections.length; i++) {
                arrayId.push(selections[i].data.iddocumento);
            }
            var msgSuccess = (arrayId.length == 1) ? this.idioma.lbAConfirAnticipoSatisfact : this.idioma.lbAConfirAnticiposSatisfact;

            Ext.Ajax.request({
                scope: this,
                url: 'confirmaranticipo',
                params: {
                    arrayId: Ext.encode(arrayId)
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.codMg == '1') {
                        mostrarMensaje(1, msgSuccess);
                        this.stAnticipo.reload();
                        Ext.MessageBox.hide();
                    }
                }
            });
        };
        //Metodos de para el proceso de POSTEAR o LIQUIDAR----------------------------------------------

        this.fLoadDataComprobanteLiqDirecta = function (params) {
            Ext.Msg.wait(this.idioma.lbLoadDataComprobante, this.idioma.lbEspere);
            params.idmovimiento = me.smAnticipo.getSelected().data.idmovimiento;
            params.numDoc = me.smAnticipo.getSelected().data.numerodocumento;
            params.idcuentaGasto = me.smAnticipo.getSelected().data.idcuentaelemento;
            params.descripcion = '';
            Ext.Ajax.request({
                url: 'loadDataComprobanteLiqDirecta',
                method: 'POST',
                scope: this,
                params: {
                    idMovimiento: params.idmovimiento,
                    idDocumento: me.smAnticipo.getSelected().data.iddocumento,
                    tipoContabilizacion: params.tipoContabilizacion,//1-contabilizar doc confirmado | 2-revertir comprobnate contabilizado | 3-liquidar anticipo
                    numDoc: params.numDoc,
                    idcuentaGasto: params.idcuentaGasto,
                    fecha: params.fecha
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == '-1') {
                        if (responseData.arrayChip.length == 1)
                            mostrarMensaje(1, String.format(this.idioma.lbChipExit, '<b>' + responseData.arrayChip.toString() + '</b>'));
                        else mostrarMensaje(1, String.format(this.idioma.lbChipExitVarios, '<b>' + responseData.arrayChip.toString() + '</b>'));
                        Ext.MessageBox.hide();
                    } else if (responseData.codMg == '-2') {
                        mostrarMensaje(1, me.idioma.lbNoExisteOperacionContableConfigurada);
                        Ext.MessageBox.hide();
                    } else if (responseData.codMg == '-3') {
                        mostrarMensaje(1, me.idioma.lbVerifiqueConfModeloContable);
                        Ext.MessageBox.hide();
                    } else {
                        me.fShowComprobante(responseData, params);
                    }
                }
            });

        };

        this.fLoadDataComprobante = function (params) {
            Ext.Msg.wait(this.idioma.lbLoadDataComprobante, this.idioma.lbEspere);
            params.idmovimiento = me.smAnticipo.getSelected().data.idmovimiento;
            Ext.Ajax.request({
                url: 'loadDataComprobante',
                method: 'POST',
                scope: this,
                params: {
                    idMovimiento: params.idmovimiento,
                    idDocumento: me.smAnticipo.getSelected().data.iddocumento,
                    tipoContabilizacion: params.tipoContabilizacion,//1-contabilizar doc confirmado | 2-revertir comprobnate contabilizado | 3-liquidar anticipo
                    numDoc: params.numDoc,
                    idoperacion: params.tipoContabilizacion == 3 ? params.idoperacion : null,
                    importeLiquidado: params.tipoContabilizacion == 3 ? params.importeliquidado : null,
                    idtarjeta: params.tipoContabilizacion == 3 ? params.idtarjeta : null,
                    idcuentaGasto: params.idcuentaGasto,
                    dataLiquidacion: Ext.encode(params.dataLiquidacion),
                    retornarTarjeta: params.retornarTarjeta,
                    fecha: params.fecha
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == '-1') {
                        if (responseData.arrayChip.length == 1)
                            mostrarMensaje(1, String.format(this.idioma.lbChipExit, '<b>' + responseData.arrayChip.toString() + '</b>'));
                        else mostrarMensaje(1, String.format(this.idioma.lbChipExitVarios, '<b>' + responseData.arrayChip.toString() + '</b>'));
                        Ext.MessageBox.hide();
                    } else if (responseData.codMg == '-2') {
                        mostrarMensaje(1, me.idioma.lbNoExisteOperacionContableConfigurada);
                        Ext.MessageBox.hide();
                    } else if (responseData.codMg == '-3') {
                        mostrarMensaje(1, me.idioma.lbVerifiqueConfModeloContable);
                        Ext.MessageBox.hide();
                    } else if (responseData.codMg == '-4') {
                        mostrarMensaje(1, 'Por favor, verifique la apertura del trabajador en la cuenta de anticipos.');
                        Ext.MessageBox.hide();
                    } else {
                        me.fShowComprobante(responseData, params);
                    }
                }
            });
        };
        //Construir y mostrar el comprobante
        this.fShowComprobante = function (respData, params) {
            var idSubsistema = 14;//Caja
            var idTipoComprobante = 3;//comprobante tipo operaciones
            var descripcion = params.descripcion + respData.descripcion;
            var detalle = params.descripcion + respData.detalle;
            // Ext.MessageBox.hide();
            Ext.Cont.Comprobante.init(idSubsistema, detalle, descripcion, respData.fechaCont, respData.dataComprobante, idTipoComprobante, 1, 1)
                .onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                    Ext.Msg.wait(this.idioma.lbGuardandoComprobante, this.idioma.lbEspere);
                    if (params.tipoContabilizacion == 1)//1-contabilizar doc confirmado | 2-revertir comprobnate contabilizado | 3-liquidar anticipo
                        me.fGuardarComprobante(idComprobante, numComprobante, fechaComprobante, params);
                    else if (params.tipoContabilizacion == 3) {
                        me.fLiquidarAnticipo(idComprobante, numComprobante, fechaComprobante, params);
                    } else {
                        params.idComprobante = idComprobante;
                        params.numComprobante = numComprobante;
                        params.fechaComprobante = fechaComprobante;
                        me.cancelarAnticipo(params);
                    }
                }.bind(this)).onClose(function () {
                me.scope.keyMapa.enable();
            });
        };
        this.fGuardarComprobante = function (idComprobante, numeroComprobante, fechaComprobante, params) {
            Ext.Msg.wait(this.idioma.lbPosteando, this.idioma.lbEspere);

            var arrayIdDoc = new Array();
            var selections = this.smAnticipo.getSelections();
            for (var i = 0; i < selections.length; i++) {
                arrayIdDoc.push(selections[i].data.iddocumento);
            }

            Ext.Ajax.request({
                method: "POST",
                url: 'postearanticipo',
                scope: this,
                params: {
                    arrayIdDoc: Ext.encode(arrayIdDoc),
                    idComprobante: idComprobante,
                    numeroComprobante: numeroComprobante,
                    fechaComprobante: fechaComprobante,
                    idTarjeta: selections[0].data.idtarjeta,
                    importemo: selections[0].data.importemo,
                    estado: (me.tipotarjeta === 2 && selections[0].json.tipo == 2) ? 9 : 6
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == '1') {
                        this.stAnticipo.reload();
                        Ext.MessageBox.hide();
                        mostrarMensaje(1, this.idioma.lbMsgPosteo + ' ' + numeroComprobante + '.');
                    }
                }.bind(this)
            });
        };
        this.fLiquidarAnticipo = function (idComprobante, numeroComprobante, fechaComprobante, params) {
            Ext.Msg.wait(this.idioma.lbLiquidando, this.idioma.lbEspere);
            var arrayIdDoc = new Array();
            arrayIdDoc.push(params.iddocumento);

            Ext.Ajax.request({
                method: "POST",
                url: 'liquidaranticipo',
                scope: this,
                params: {
                    arrayIdDoc: Ext.encode(arrayIdDoc),
                    idComprobante: idComprobante,
                    numeroComprobante: numeroComprobante,
                    fechaComprobante: fechaComprobante,
                    idTarjeta: params.idtarjeta,
                    importeliquidadomo: params.importeliquidado,
                    idoperacion: params.idoperacion,
                    fecha: params.fechaliquidado,
                    idmoneda: params.idmoneda,
                    importemo: params.importemo,
                    idcuentaelemento: params.idcuentaGasto,
                    dataLiquidacion: Ext.encode(params.dataLiquidacion),
                    retornarTarjeta: params.retornarTarjeta,
                    idMovimiento: params.idmovimiento
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == '1') {
                        mostrarMensaje(1, this.idioma.lbMsgLiquidacion + ' ' + numeroComprobante + '.');
                        this.scope.gridTarjeta.stTarjeta.reload();
                        this.winAnt.close();
                    }
                    Ext.MessageBox.hide();
                }.bind(this)
            });
        };
    },
});

//--Componente Window Anticipo
Caja.Tarjetas.WindowAnticipo = Ext.extend(Ext.Window, {
    constructor: function (params) {

        Ext.apply(this, params);
        Ext.apply(this, {
            //height: Ext.lib.Dom.getViewHeight() * 0.45,
            // width: Ext.lib.Dom.getViewWidth() * 0.45,
            // height: 380,
            width: 600,
            //layout: 'border',
            modal: true,
            constrain: true,
            resizable: false,
            closeAction: 'close',
            frame: true,
            listeners: {
                scope: this,
                show: function () {
                    this.scope.scope.keyMapa.disable();
                },
                close: function () {
                    this.scope.scope.keyMapa.enable();
                    this.scope.scope.TaskFormValidation.stopTaskValidation();
                }
            },
            border: false,
            autoValidate: false,
            idioma: params.idioma,
            perfil: params.perfil,
            accion: params.accion,
            totalLiquidacion: 0,
            preciocombustible: 0
        });
        this.createButtons();
        this.createForm();
        this.initFunctions();
        this.initEventos();

        Caja.Tarjetas.WindowAnticipo.superclass.constructor.call(this);
    },
    initEventos: function () {

        this.btnAceptar.on({
            scope: this,
            click: function () {
                this.scope.scope.TaskFormValidation.stopTaskValidation();
                this.scope.winAnt.btnAceptar.disable();
                this.accion == 'liquidacion directa' ? this.liquidarDirecta() : (this.accion != 'liquidar' ? this.saveAnt() : this.liquidarAnticipo());
            }
        });

        this.stVehiculo.on({
            scope: this,
            load: function () {
                if (this.isLoaded == 1) this.isLoaded--;
                else {
                    if (this.cargandoStOperacionesStVehiculo == 1) this.cargandoStOperacionesStVehiculo--;
                    else {
                        this.lMask.hide();
                        var formArray = new Array();
                        formArray.push(this.formAnt);
                        var arrbotones = new Array();
                        arrbotones.push(this.btnAceptar);
                        this.scope.scope.TaskFormValidation.startTaskValidation(this.accion, formArray, arrbotones);
                    }
                    if (this.accion == 'add') {
                        this.cbVehiculo.setValue(this.tarjetaSelect.idvehiculo);
                        this.cbVehiculo.originalValue = this.tarjetaSelect.idvehiculo;

                    } else {
                        this.cbVehiculo.setValue(this.anticipoSelect.idvehiculo);
                        this.cbVehiculo.originalValue = this.anticipoSelect.idvehiculo;
                    }
                }
            }
        });
        this.stOperacion.on({
            scope: this,
            load: function (st, records) {
                if (this.stOperacion.idoperacion > 0) {
                    this.cbOperacionContable.setValue(this.stOperacion.idoperacion);

                }
                if (records.length == 1 && this.accion != 'mod') {
                    this.cbOperacionContable.setValue(this.stOperacion.data.items[0].data.idnomoperaciones);
                    if (this.accion == 'liquidar' || this.accion == 'liquidacion directa') {
                        if (Ext.isEmpty(records[0].data.cuentagasto[0])) {
                            mostrarMensaje(1, 'El modelo de la operación seleccionada está mal configurado.');
                            this.cbxCuenta.disable();
                        } else {
                            this.stCuenta.baseParams.arrayIdCuenta = Ext.encode(records[0].data.cuentagasto);
                            this.stCuenta.load();
                            this.cbxCuenta.enable();
                        }
                    }
                }
                /*if (this.cargandoStOperacionesStVehiculo == 1)
                    this.cargandoStOperacionesStVehiculo--;
                else {*/
                var formArray = new Array();
                formArray.push(this.formAnt);
                var arrbotones = new Array();
                arrbotones.push(this.btnAceptar);
                this.scope.scope.TaskFormValidation.startTaskValidation(this.accion, formArray, arrbotones);
                //}
                this.lMask.hide();
            }
        });

        this.stCuenta.on({
            scope: this,
            load: function (st, records) {
                if (records.length == 1) {
                    this.cbxCuenta.setValue(records[0].data.idcuentagasto);
                    this.cbxCuenta.enable();
                }
            }
        });

        this.cbPersona.on({
            scope:this,
            select: function (cb, record) {
                if (this.tipotarjeta === 2) {
                    this.lMaskCargando();
                    this.verificarPersona(record.get('idpersona'));
                }
            }
        });

        this.roweditor.on({
            scope: this,
            oninitsetvalue: function (roweditor, field, record) {
                // if (field.id == 'cbxCuenta') {
                //     field.setValue(record.data.idcuentaelemento, record.data.textcuentaelemento);
                //     return false;
                // }
            },
            afteredit: function (editor, grid, changes, record, rowIndex) {
                record.data.fecha = record.data.fecha.format('d/m/Y');
                this.stLiquidacion.commitChanges();
            },
            beforeedit: function (roweditor, grid, record, rowIndex) {

            },
            canceledit: function (roweditor, rowIndex, record) {
                this.btnAddLiq.enable();
            },
            validateedit: function (roweditor, grid, changes, record, rowIndex) {
                var totalAnticipo = parseFloat(this.nfImporteAnt.getValue()) - parseFloat(this.nfImporteLiquidado.getValue());
                var totalLiq = parseFloat(this.nfImporteLiq.getValue());
                var chips = [];
                this.stLiquidacion.getRange().forEach(function (item, index, AllItems) {
                    if (index != rowIndex) {
                        totalLiq += parseFloat(item.data.importemo);
                        chips.push(item.data.chip);
                    }
                });
                if (parseFloat(totalLiq.toFixed(2)) > parseFloat(totalAnticipo.toFixed(2))) {
                    this.btnAddLiq.disable();
                    if (parseFloat(Math.abs(totalAnticipo - (totalLiq - parseFloat(this.nfImporteLiq.getValue().toFixed(2))))) == 0)
                        this.nfImporteLiq.markInvalid('No puede registrar más liquidaciones para este anticipo.');
                    else
                        this.nfImporteLiq.markInvalid(String.format(this.idioma.lbImporteLiqIncorrecto, parseFloat(Math.abs(totalAnticipo - (totalLiq - parseFloat(this.nfImporteLiq.getValue().toFixed(2)))))));
                    return false;
                } else {
                    // this.btnAddLiq.enable();
                    if (this.tarjetaSelect.tipo == 1) {
                        this.nfLitrosLiq.setValue(parseFloat(this.nfImporteLiq.getValue() / this.tarjetaSelect.preciocombustible).toFixed(2));
                    }
                }
                if (chips.includes(changes.chip) && validate.checkByAbreviatura('trans')) {
                    // this.btnAddLiq.disable();
                    mostrarMensaje(1, 'El numero de chip ' + changes.chip + ' esta repetido.');
                    // return false;
                }
                this.btnAddLiq.enable();
            }
        });

        this.rowaction.on('action', function (grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'eliminar':
                    mostrarMensaje(2, this.idioma.lbPregEliminarLiq, function (btnPress) {
                        if (btnPress === 'ok') {
                            // var seleccionado = this.gpLiquidacion.getSelectionModel().getSelected();
                            if (!this.gpLiquidacion.getSelectionModel().isLocked()) {
                                this.gpLiquidacion.getStore().remove(record);
                                this.calcularTotal();
                            } else {
                                if (this.gpLiquidacion.getStore().getCount() > 1 && this.scope.smAnticipo.getSelected().data.devuelto === 0) {
                                    this.cancelarLiquidacionParcial(record.json.idliquidacioncombustible);
                                }
                            }
                        }
                    }.bind(this));
                    break;
            }
        }.bind(this));

        this.ckTarjeta.on('check', function (checkbox, checked) {
            if (this.totalLiquidacion == 0) {
                this.cbxCuenta.setDisabled(checked);
            } else {
                this.cbxCuenta.enable();
            }
        }, this);

    },
    createButtons: function () {
        this.btnCancelar = new Ext.Button({
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

        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            disabled: true,
            text: this.idioma.lbAceptar,
            tooltip: this.idioma.lbToolAceptar,

        });
        this.buttons = [this.btnCancelar, this.btnAceptar];
    },
    createForm: function () {
        var me = this;
        this.cargandoStOperacionesStVehiculo = 0;
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
            allowBlank: false,
            resizable: true,
            //readOnly: true,
            triggerAction: 'all',
            anchor: '98%',
            minChars: 0, //Para la nueva busqueda poner contraria esta linea
            pageSize: 10, //Para la nueva busqueda poner contraria esta linea
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{numid} {nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            selectOnFocus: true,
            enableKeyEvents: true,
            name: 'idrecibe'
        });

        this.stOperacion = new Ext.data.Store({
            url: 'cargarOperaciones',
            reader: new Ext.data.JsonReader({
                root: 'data'
            }, [
                {
                    name: 'idnomoperaciones'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'cuentagasto'
                }
            ]),
            autoLoad: false,
            idoperacion: -1
        });

        this.cbOperacionContable = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            fieldLabel: this.idioma.lbOperacionContable,
            store: this.stOperacion,
            valueField: 'idnomoperaciones',
            hiddenName: 'idnomoperaciones',
            displayField: 'denominacion',
            emptyText: this.idioma.lbSeleccione, //'Seleccione...',
            editable: false,
            forceSelection: true,
            allowBlank: false,
            mode: 'local',
            resizable: true,
            //readOnly: true,
            triggerAction: 'all',
            anchor: '100%',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{numid} {denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            selectOnFocus: true,
            name: 'idoperacion',
            enableKeyEvents: true,
            listeners: {
                scope: this,
                select: function (cb, record) {
                    if (this.accion === 'liquidar' || this.accion == 'liquidacion directa') {
                        if (Ext.isEmpty(record.data.cuentagasto[0])) {
                            mostrarMensaje(1, 'El modelo de la operación seleccionada está mal configurado.');
                            this.cbxCuenta.disable();
                        } else {
                            this.stCuenta.baseParams.arrayIdCuenta = Ext.encode(record.data.cuentagasto);
                            this.cbxCuenta.load();
                            this.cbxCuenta.enable();
                        }
                    }
                },
                change: function () {
                    this.cbxCuenta.clearValue();
                }
            }
        });

        this.stVehiculo = new Ext.data.Store({
            url: 'obtenervehiculos',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total'
            }, [{
                name: 'denominacion'
            }, {
                name: 'idvehiculo'
            }
            ])
        });

        this.cbVehiculo = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            fieldLabel: this.idioma.lbVehiculo,
            store: this.stVehiculo,
            name: 'idvehiculo',
            valueField: 'idvehiculo',
            hiddenName: 'idvehiculo',
            displayField: 'denominacion',
            emptyText: this.idioma.lbSeleccione, //'Seleccione...',
            forceSelection: true,
            allowBlank: false,
            resizable: true,
            readOnly: true,
            mode: 'local',
            triggerAction: 'all',
            anchor: '95%',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        this.tfCombustible = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            fieldLabel: this.idioma.lbCombustible,
            anchor: '98%',
            readOnly: true
        });

        //--Cargar las cuentas de gastos
        this.stCuenta = new Ext.data.Store({
            url: 'cargarCuentaGasto',
            autoLoad: false,
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
            fieldLabel: this.idioma.lbCuentaGasto,
            displayField: 'text',
            valueField: 'idcuenta',
            mode: 'local',
            hideTbar: false,
            listHeight: 200,
            tabIndex: 4,
            // anchor: '97%',
            disabled: true,
            listeners: {
                scope: this,
                /*specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.tfAddImporteAnt.focus();
                },
                select: function (cb) {
                    var index = scope.stAddGridOtrasOper.find('idcuenta', cb.getValue());
                    if (index != -1) {
                        cb.reset();
                        mostrarMensaje(1, this.idioma.lbExistCuenta);
                    }
                }*/
            }
        });

        this.firstElement = this.nfNumero = new Ext.form.TextField({
            allowBlank: false,
            anchor: '98%',
            readOnly: true,
            fieldLabel: this.idioma.lbTarjeta,
            maxLength: 16,
            maxLengthText: this.idioma.lbMaxLengthText16,
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.nfNumFin.focus();
                }
            },
            name: 'numero'
        });
        this.nfImporteAnt = new Ext.form.NumberField({
            fieldLabel: this.idioma.lbImporte,
            maxLength: 19,
            // readOnly: ((this.tipotarjeta === 2 && this.accion == 'liquidar') || this.tipotarjeta !== 2 || this.accion == 'liquidacion directa'),
            readOnly: ((this.tipotarjeta === 2 && this.accion == 'liquidar') || this.accion == 'liquidacion directa'),
            style: 'text-align: right',
            maxLengthText: this.idioma.lbMaxLengthImporte19,
            // maxValue: this.tipotarjeta === 2 ? this.saldo : undefined,
            maxValue: this.saldo,
            minValue: 0.01,
            allowBlank: false,
            allowDecimals: true,
            anchor: '98%',
            name: 'importemo',
            enableKeyEvents: true,
            listeners: {
                scope: this,
                // blur: function (cb) {
                //     cb.setRawValue(formatoMoneda(cb.getValue()));
                // },
                keyup: function (nf, eventObj) {
                    if (this.tipotarjeta === 1) {
                        this.nfLitrosAnt.setValue(parseFloat((nf.getValue()/this.preciocombustible).toFixed(2)));
                    }
                }
            }
        });

        this.nfLitrosAnt = new Ext.form.NumberField({
            fieldLabel: this.idioma.lbLitros,
            readOnly: true,
            maxLength: 8,
            maxLengthText: this.idioma.lbMaxLengthImporte8,
            allowBlank: true,
            anchor: '98%'
        });

        this.nfImporteLiquidado = new Ext.form.NumberField({
            fieldLabel: 'Importe liquidado',
            maxLength: 19,
            readOnly: true,
            style: 'text-align: right',
            maxLengthText: this.idioma.lbMaxLengthImporte19,
            allowBlank: false,
            allowDecimals: true,
            anchor: '98%',
            name: 'importeliquidadomb',
            value: 0,
            listeners: {
                blur: function (cb) {
                    cb.setRawValue(formatoMoneda(cb.getValue()));
                }
            }
        });

        this.dfFechaAnt = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            fieldLabel: this.idioma.lbFechaAnt,
            disabled: this.accion == 'liquidar' ? true : false,
            hideTrigger: this.accion == 'liquidar' ? true : false,
            allowBlank: false,
            anchor: '98%',
            name: 'fecha',
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            value: fechaContable,
            minValue: fechaInicio,
            maxValue: fechaFin,
            // maxValue: new Date()
        });

        this.dfFechaLiq = new Ext.form.DateField({
            fieldLabel: this.idioma.lbFechaLiq,
            allowBlank: false,
            anchor: '98%',
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            value: fechaContable,
            minValue: fechaInicio,
            maxValue: fechaFin,
            // maxValue: new Date()
        });

        this.nfImporteLiq = new Ext.form.NumberField({
            fieldLabel: this.idioma.lbImporte,
            maxLength: 16,
            style: 'text-align: right',
            maxLengthText: this.idioma.lbMaxLengthImporte19,
            allowBlank: false,
            maskRe: /^([0-9.\,]+ ?[0-9.]*)+$/,
            anchor: '93%',
            enableKeyEvents: true,
            listeners: {
                scope: this,
                blur: function (cb) {
                    cb.setRawValue(formatoMoneda(cb.getValue()));
                    // this.nfLitrosLiq.setValue(parseFloat(cb.getValue() / this.tarjetaSelect.preciocombustible).toFixed(2));
                }
            },
            validator: function (value) {
                if (value == 0) {
                    return 'El importe no puede ser 0.';
                } else return true;
            }.bind(this)
        });

        this.nfLitrosLiq = new Ext.form.NumberField({
            readOnly: true,
            fieldLabel: this.idioma.lbLitrosLiq,
            maxLength: 8,
            maxLengthText: this.idioma.lbMaxLengthText8,
            anchor: '93%'
        });

        this.nfChip = new Ext.form.NumberField({
            fieldLabel: this.idioma.lbChip,
            maxLength: 8,
            maxLengthText: this.idioma.lbMaxLengthText8,
            allowBlank: false,
            anchor: '93%',
            // validator: function (value) {
            //     var index = this.stLiquidacion.find('chip', value);
            //     if (index != -1 && this.smLiquidacion.getSelected().data.chip != value) {
            //         return 'Número de chip repetido.';
            //     } else return true;
            // }.bind(this)
        });
        this.tfHruta = new Ext.form.TextField({
            // allowBlank: false,
            anchor: '98%',
            // readOnly: true,
            fieldLabel: 'Hoja de ruta',
            maxLength: 16,
            maxLengthText: this.idioma.lbMaxLengthText16,
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.nfNumFin.focus();
                }
            },
            name: 'numero'
        });
        this.tfIndicativo = new Ext.form.TextField({
            // allowBlank: false,
            anchor: '98%',
            // readOnly: true,
            fieldLabel: 'Indicativo',
            maxLength: 16,
            maxLengthText: this.idioma.lbMaxLengthText16,
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    // if (e.getCharCode() == Ext.EventObject.ENTER)
                    //     this.nfNumFin.focus();
                }
            },
            name: 'numero'
        });
        //-------------------------------------
        this.fieldSetAnt = {
            labelAlign: 'top',
            title: this.accion != 'liquidacion directa' ? 'Anticipo' : '',
            xtype: 'fieldset',
            // height: '150',
            autoHeight: true,
            layout: 'form',
            anchor: '100%',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: this.accion == 'liquidacion directa' ? .5 : (this.tipotarjeta === 2 ? .4 : .3),
                    layout: 'form',
                    items: [this.nfImporteAnt]
                }, {
                    columnWidth: .3,
                    layout: 'form',
                    hidden: this.tipotarjeta === 2,
                    items: [this.nfLitrosAnt]
                }, {
                    columnWidth: this.tipotarjeta === 2 ? .3 : .2,
                    layout: 'form',
                    hidden: this.accion == 'liquidacion directa',
                    items: [this.nfImporteLiquidado]
                }, {
                    columnWidth: this.accion == 'liquidacion directa' ? .5 : (this.tipotarjeta === 2 ? .3 : .2),
                    layout: 'form',
                    items: [this.dfFechaAnt]
                }]
            }]
        };
        //Grid Liquidaciones-------------------------------------
        this.roweditor = new Ext.Cont.RowEditor({
            id: 'idRoweditor',
            clicksToEdit: 2,
            iconClsSave: 'aceptar',
            iconClsCancel: 'cancelar'
        });

        this.rowaction = new Ext.grid.RowActions({
            id: 'idRowaction',
            actions: [
                {
                    id: 'eliminar',
                    tooltip: this.idioma.lbToolDel,
                    iconCls: 'eliminar',
                    marginLeft: 5,
                    width: 20,
                    height: 16
                }
            ]
        });

        this.stLiquidacion = new Ext.data.Store({
            //url: 'cargarAnexoGasto',
            scope: this,
            reader: new Ext.data.JsonReader({
                // root: 'datos'
            }, this.recordLiquidacion = Ext.data.Record.create([
                {name: 'chip', type: 'string'},
                {name: 'litros', type: 'float'},
                {name: 'fecha'},
                {name: 'importemo', type: 'float'},
                {name: 'hruta', type: 'string'},
                {name: 'indicativo', type: 'float'}
            ])),
            sortInfo: {field: 'fecha', direction: 'ASC'}
        });

        this.ckTarjeta = new Ext.form.Checkbox({
            hideLabel: true,
            boxLabel: 'Retornar saldo a caja',
            labelAlign: 'right',
            value: 0,
            checked: this.tipotarjeta === 2,
        });

        this.gpLiquidacion = new Ext.grid.EditorGridPanel({
            disabledClass: 'disabled-component',
            title: this.idioma.lbLiquidaciones,
            region: 'center',
            layout: 'fit',
            loadMask: true,
            // width: 600,
            height: 240,
            stripeRows: true,
            border: false,
            frame: false,
            clicksToEdit: 2,
            store: this.stLiquidacion,
            autoExpandColumn: 'idExpandir',
            columns: [{
                header: this.idioma.lbChip,
                id: 'idExpandir',
                dataIndex: 'chip',
                width: 120,
                align: 'right',
                editor: this.nfChip
            }, {
                header: this.idioma.lbFecha,
                dataIndex: 'fecha',
                width: 100,
                align: 'right',
                format: 'd/m/Y',
                editor: this.dfFechaLiq
            }, {
                header: this.idioma.lbImporte,
                dataIndex: 'importemo',
                width: 100,
                align: 'right',
                editor: this.nfImporteLiq,
                renderer: formatoMonedaABS
            }, {
                header: this.idioma.lbLitrosLiq,
                dataIndex: 'litros',
                width: 90,
                align: 'right',
                hidden: this.tipotarjeta === 2,
                hideable: this.tipotarjeta !== 2,
                editor: this.nfLitrosLiq,
                renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                    this.calcularTotal();
                    if (this.tarjetaSelect.tipo == 1) {
                        return parseFloat(record.data.importemo / this.tarjetaSelect.preciocombustible).toFixed(2);
                    } else {
                        return '';
                    }
                }.bind(this)
            }, {
                header: 'Hoja de ruta',
                dataIndex: 'hruta',
                width: 80,
                // align: 'right',
                hidden: !validate.checkByAbreviatura('trans'),
                hideable: !validate.checkByAbreviatura('trans'),
                editor: this.tfHruta,
            }, {
                header: 'Indicativo',
                dataIndex: 'indicativo',
                width: 100,
                // align: 'right',
                hidden: !validate.checkByAbreviatura('trans'),
                hideable: !validate.checkByAbreviatura('trans'),
                editor: this.tfIndicativo
            },
                this.rowaction
            ],
            plugins: [this.roweditor, this.rowaction],
            sm: this.smLiquidacion = new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            forceFit: true,
            tbar: [this.btnAddLiq = new Ext.Button({
                scope: this,
                text: this.idioma.lbAdicionar,
                iconCls: 'adicionar',
                tooltip: this.idioma.lbToolAddLiq,
                handler: function () {
                    var record = new this.recordLiquidacion({
                        fecha: '',
                        chip: '',
                        litros: '',
                        importemo: '',
                    });
                    this.roweditor.stopEditing();
                    var total = this.stLiquidacion.getCount();
                    this.stLiquidacion.insert(total, record);
                    this.gpLiquidacion.getSelectionModel().selectRow(total);
                    this.roweditor.startEditing(total);
                }
            })],
            bbar: ['->', new Ext.Toolbar.TextItem('Total:'), this.labelTotal = new Ext.form.Label({
                text: '0.00'
            })]
        });
        //-------------------------------------
        this.fieldSetLiq = {
            hidden: this.accion != 'liquidar' ? true : false,
            labelAlign: 'top',
            title: 'Liquidación',
            xtype: 'fieldset',
            // height: '150',
            autoHeight: true,
            anchor: '100%',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .23,
                    layout: 'form',
                    items: [this.nfChip]
                }, {
                    columnWidth: .23,
                    layout: 'form',
                    items: [this.nfImporteLiq]
                }, {
                    columnWidth: .23,
                    layout: 'form',
                    items: [this.nfLitrosLiq]
                }, {
                    columnWidth: .3,
                    layout: 'form',
                    items: [this.dfFechaLiq]
                }]
            }]
        };

        this.SetfieldSetLiq = (this.accion == 'liquidar' || this.accion == 'liquidacion directa') ? this.gpLiquidacion : {};
//-------------------
        this.formAnt = new Ext.FormPanel({
            id: 'formAnt',
            frame: true,
            layout: 'form',
            disabledClass: ' ',
            autoHeight: true,
            labelWidth: 50,
            labelAlign: 'top',
            trackResetOnLoad: true,
            items: [{
                layout: 'column',
                disabledClass: 'disabled-component',
                items: [{
                    columnWidth: this.tipotarjeta === 2 ? .45 : .35,
                    layout: 'form',
                    items: [this.nfNumero]
                }, {
                    columnWidth: .25,
                    layout: 'form',
                    hidden: this.tipotarjeta === 2,
                    // items: [this.cbVehiculo]
                    items: [this.tfCombustible]
                }, {
                    columnWidth: this.tipotarjeta === 2 ? .55 : .40,
                    layout: 'form',
                    items: [this.cbPersona]
                }]
            }, this.fieldSetAnt , this.SetfieldSetLiq, this.cbOperacionContable, (this.accion == 'liquidar' || this.accion == 'liquidacion directa') ?
                {
                    layout: 'column',
                    items: [{
                        columnWidth: .7,
                        layout: 'form',
                        items: [this.cbxCuenta]
                    }, {
                        columnWidth: .3,
                        layout: 'form',
                        style: 'margin:12 0 0 10',
                        items: [this.ckTarjeta],
                        hidden: this.tipotarjeta === 2
                    }]
                } : {}
            ]
        });

        this.items = [this.formAnt];
    },
    initFunctions: function () {
        var me = this;
        this.cargandoStOperacionesStVehiculo = 1;
        this.isLoaded = 0;
        this.cargarWinMod = function (select) {
            var tarjetaSelect = this.scope.scope.gridTarjeta.smTarjeta.getSelected().data;
            this.lMaskCargando();
            var recordPersona = {data: [{idpersona: select.data.idpersona, nombre: select.data.nompersona}]};
            this.cbPersona.store.loadData(recordPersona);

            /*this.stVehiculo.on({
                scope: this,
                load: function () {
                    me.lMask.hide();
                }
            });

            var recordVehiculo = {
                data: [{
                    idvehiculo: tarjetaSelect.idvehiculo,
                    denominacion: tarjetaSelect.vehiculo
                }]
            };
            this.cbVehiculo.store.loadData(recordVehiculo);
            this.cbVehiculo.setValue(tarjetaSelect.idvehiculo);
            this.cbVehiculo.setRawValue(tarjetaSelect.vehiculo);*/
            this.preciocombustible = tarjetaSelect.preciocombustible;
            this.tfCombustible.setValue(tarjetaSelect.nomcombustible);
        };

        this.saveAnt = function () {
            if (this.formAnt.getForm().isValid()) {
                var msgSuccess = this.accion == 'add' ? this.idioma.lbAddAnticipoSatisfact : this.idioma.lbModAnticipoSatisfact;
                Ext.Msg.wait(this.idioma.lbGuardando, this.idioma.lbEspere);
                Ext.Ajax.request({
                    url: 'saveanticipo',
                    params: {
                        idmovimiento: this.accion == 'add' ? -1 : this.scope.smAnticipo.getSelected().data.idmovimiento,
                        importe: this.nfImporteAnt.getValue(),
                        idvehiculo: this.scope.scope.gridTarjeta.smTarjeta.getSelected().data.idvehiculo,
                        idpersona: this.cbPersona.getValue(),
                        litros: this.nfLitrosAnt.getRawValue(),
                        fecha: this.dfFechaAnt.getRawValue(),
                        idoperacion: this.cbOperacionContable.getValue(),
                        idtarjeta: this.scope.scope.gridTarjeta.smTarjeta.getSelected().data.idtarjeta,
                        precio: this.scope.scope.gridTarjeta.smTarjeta.getSelected().data.preciocombustible,
                        idcaja: this.scope.scope.gridTarjeta.smTarjeta.getSelected().data.idcaja,
                        idmoneda: this.scope.scope.gridTarjeta.smTarjeta.getSelected().data.idmoneda
                    },
                    callback: function (options, success, response) {
                        var respuesta = Ext.decode(response.responseText);

                        if (respuesta.codMg == '1') {
                            mostrarMensaje(1, msgSuccess);
                        }
                        if (respuesta.codMg == '-2') {
                            mostrarMensaje(1, this.idioma.lbNoExistenConsecutivosConfigurados);
                        }
                        if (respuesta.codMg == '-3') {
                            mostrarMensaje(1, this.idioma.lbNoExisteOperacionContableConfiguradaAccion);
                        }
                        if (respuesta.codMg == '-1') {
                            mostrarMensaje(1, this.idioma.lbNoExisteOperacionContableConfigurada);
                        }
                        Ext.MessageBox.hide();
                        me.close();
                        me.scope.scope.gridTarjeta.stTarjeta.reload();
                    }
                });
            }
        };

        this.liquidarAnticipo = function () {
            var importeAnticipo = this.scope.smAnticipo.getSelected().data.importemo;
            if (this.totalLiquidacion == 0 && !this.ckTarjeta.getValue()) {
                mostrarMensaje(1, this.idioma.lbImporteLiqCero);
                this.scope.winAnt.btnAceptar.enable();
                return;
            }
            if (parseFloat(this.totalLiquidacion) > parseFloat(importeAnticipo)) {
                mostrarMensaje(1, this.idioma.lbImporteMayorAnt);
                this.scope.winAnt.btnAceptar.enable();
                return;
            }
            //---------
            if (this.formAnt.getForm().isValid()) {
                var msgSuccess = this.idioma.lbLiquidarAnticipoSatisfact;
                //Creando el concta a partir de la operacion contable, centro de costo y elemento del gasto

                var arrayLiquidaciones = [];
                this.stLiquidacion.getRange().forEach(function (item, index, AllItems) {
                    arrayLiquidaciones.push(
                        {
                            fecha: item.data.fecha,
                            chip: item.data.chip,
                            importemo: item.data.importemo,
                            hruta: item.data.hruta,
                            indicativo: item.data.indicativo
                        });
                }, this);

                var params = {
                    idmovimiento: this.scope.smAnticipo.getSelected().data.idmovimiento,
                    iddocumento: this.scope.smAnticipo.getSelected().data.iddocumento,
                    importemo: importeAnticipo,
                    idpersona: this.cbPersona.getValue(),
                    //fecha: this.dfFechaAnt.getRawValue(),
                    idoperacion: this.cbOperacionContable.getValue(),
                    idtarjeta: this.scope.scope.gridTarjeta.smTarjeta.getSelected().data.idtarjeta,
                    precio: this.scope.scope.gridTarjeta.smTarjeta.getSelected().data.preciocombustible,
                    idcaja: this.scope.scope.gridTarjeta.smTarjeta.getSelected().data.idcaja,
                    idmoneda: this.scope.scope.gridTarjeta.smTarjeta.getSelected().data.idmoneda,
                    importeliquidado: this.totalLiquidacion,
                    fechaliquidado: this.dfFechaLiq.getRawValue(),
                    numDoc: this.scope.smAnticipo.getSelected().data.numerodocumento,
                    tipoContabilizacion: 3, //1-contabilizar doc confirmado | 2-revertir comprobnate contabilizado | 3-liquidar anticipo
                    descripcion: 'Liquidando anticipo de la tarjeta #' + this.scope.scope.gridTarjeta.smTarjeta.getSelected().data.numero + ': ',
                    idcuentaGasto: this.cbxCuenta.getValue(),
                    dataLiquidacion: arrayLiquidaciones,
                    retornarTarjeta: this.ckTarjeta.getValue()
                };
                this.scope.fLoadDataComprobante(params);
            }
        };

        this.liquidarDirecta = function () {
            if (this.totalLiquidacion == 0) {
                mostrarMensaje(1, this.idioma.lbImporteLiqCero);
                return;
            }
            if (this.formAnt.getForm().isValid()) {
                var msgSuccess = this.accion == 'add' ? this.idioma.lbAddAnticipoSatisfact : this.idioma.lbModAnticipoSatisfact;
                Ext.Msg.wait(this.idioma.lbGuardando, this.idioma.lbEspere);
                var arrayLiquidaciones = [];
                this.stLiquidacion.getRange().forEach(function (item, index, AllItems) {
                    arrayLiquidaciones.push(
                        {
                            fecha: item.data.fecha,
                            chip: item.data.chip,
                            importemo: item.data.importemo
                        });
                }, this);
                Ext.Ajax.request({
                    url: 'saveLiqDirecta',
                    params: {
                        idmovimiento: (this.accion == 'liquidacion directa' && !this.accion1) ? -1 : this.scope.smAnticipo.getSelected().data.idmovimiento,
                        // importe: this.nfImporteAnt.getValue(),
                        importe: this.totalLiquidacion,
                        idpersona: this.cbPersona.getValue(),
                        fecha: this.dfFechaAnt.getRawValue(),
                        idoperacion: this.cbOperacionContable.getValue(),
                        idtarjeta: this.scope.scope.gridTarjeta.smTarjeta.getSelected().data.idtarjeta,
                        idmoneda: this.scope.scope.gridTarjeta.smTarjeta.getSelected().data.idmoneda,
                        dataLiquidacion: Ext.encode(arrayLiquidaciones),
                        idcuentaelemento: this.cbxCuenta.getValue()
                    },
                    callback: function (options, success, response) {
                        var respuesta = Ext.decode(response.responseText);

                        if (respuesta.codMg == '1') {
                            mostrarMensaje(1, msgSuccess);
                        }
                        if (respuesta.codMg == '-2') {
                            mostrarMensaje(1, this.idioma.lbNoExistenConsecutivosConfigurados);
                        }
                        if (respuesta.codMg == '-3') {
                            mostrarMensaje(1, this.idioma.lbNoExisteOperacionContableConfiguradaAccion);
                        }
                        if (respuesta.codMg == '-1') {
                            mostrarMensaje(1, this.idioma.lbNoExisteOperacionContableConfigurada);
                        }
                        Ext.MessageBox.hide();
                        me.close();
                        me.scope.scope.gridTarjeta.stTarjeta.reload();
                    }
                });
            }
        };

        this.lMaskCargando = function () {
            this.lMask = new Ext.LoadMask(this.body, {//body de la ventana
                msg: this.idioma.lbCargando
            });
            this.lMask.show();
        };

        this.calcularTotal = function () {
            var importeTotal = 0;
            for (var i = 0; i < this.gpLiquidacion.getStore().getCount(); i++) {
                importeTotal += parseFloat(Math.abs(this.gpLiquidacion.getStore().getAt(i).data.importemo));
            }
            this.labelTotal.setText(formatoMoneda(importeTotal));
            this.totalLiquidacion = parseFloat(importeTotal.toFixed(2));
            if (this.totalLiquidacion > 0) {
                this.cbxCuenta.enable();
            } else if (this.totalLiquidacion == 0 && this.ckTarjeta.getValue() && this.accion != 'liquidacion directa') {
                this.cbxCuenta.disable();
            }
        };

        this.verificarPersona = function (idpersona) {
            Ext.Ajax.request({
                url: 'verificarPersona',
                scope: this,
                params: {
                    idpersona: idpersona,
                    idTarjeta: this.tarjetaSelect.idtarjeta
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.codMg == '-1') {
                        mostrarMensaje(1, 'La persona tiene anticipos pendientes');
                        this.cbPersona.reset();
                    }
                    this.lMask.hide();
                }
            });
        }
        
        this.cancelarLiquidacionParcial = function (idliquidacioncombustible) {
            Ext.Msg.wait(this.idioma.lbLoadDataComprobante, this.idioma.lbEspere);
            var params = {
                idMovimiento: this.scope.smAnticipo.getSelected().data.idmovimiento,
                idDocumento: this.scope.smAnticipo.getSelected().data.iddocumento,
                idliquidacioncombustible: idliquidacioncombustible
            };
            params.idmovimiento
            Ext.Ajax.request({
                url: 'loadDataComprobanteCancelarLiqParcial',
                method: 'POST',
                scope: this,
                params: {
                    idMovimiento: params.idMovimiento,
                    idDocumento: params.idDocumento,
                    idliquidacioncombustible: idliquidacioncombustible
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    Ext.MessageBox.hide();
                    if (responseData.codMg == '-2') {
                        mostrarMensaje(1, me.idioma.lbNoExisteOperacionContableConfigurada);
                        // Ext.MessageBox.hide();
                    } else if (responseData.codMg == '-3') {
                        mostrarMensaje(1, me.idioma.lbVerifiqueConfModeloContable);
                        // Ext.MessageBox.hide();
                    } else if (responseData.codMg == '-4') {
                        mostrarMensaje(1, 'Por favor, verifique la apertura del trabajador en la cuenta de anticipos.');
                        // Ext.MessageBox.hide();
                    } else {
                        var idSubsistema = 14;//Caja
                        var idTipoComprobante = 3;//comprobante tipo operaciones
                        var descripcion = responseData.descripcion;
                        var detalle = responseData.detalle;
                        // Ext.MessageBox.hide();
                        Ext.Cont.Comprobante.init(idSubsistema, detalle, descripcion, responseData.fechaCont, responseData.dataComprobante, idTipoComprobante, 1, 1)
                            .onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                                params.idComprobante = idComprobante;
                                params.numComprobante = numComprobante;
                                params.fechaComprobante = fechaComprobante;

                                Ext.Msg.wait('Cancelando...', 'Porfavor espere...');
                                var arrayId = [params.idDocumento];

                                var msgSuccess = "La liquidación ha sido cancelada satisfactoriamente.";

                                Ext.Ajax.request({
                                    scope: this,
                                    url: 'cancelarLiqParcial',
                                    params: {
                                        arrayId: Ext.encode(arrayId),
                                        idComprobante: params.idComprobante,
                                        numComprobante: params.numComprobante,
                                        fechaComprobante: params.fechaComprobante,
                                        idliquidacioncombustible: idliquidacioncombustible
                                    },
                                    callback: function (options, success, response) {
                                        Ext.MessageBox.hide();
                                        // var respuesta = Ext.decode(response.responseText);
                                        mostrarMensaje(1, msgSuccess);
                                        me.scope.stAnticipo.reload();
                                        me.close();
                                    }
                                });

                            }.bind(this)).onClose(function () {
                        });
                    }
                }
            });
        }
    }
});
