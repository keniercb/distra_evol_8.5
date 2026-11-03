Ext.namespace('Caja.Tarjetas');

//--Componete Panel Recarga
Caja.Tarjetas.PanelRecarga = Ext.extend(Ext.Panel, {
    constructor: function (params) {
        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            border: false,
            frame: false,
            labelAlign: 'top',
            buttonAlign: 'right',
            title: this.idioma.lbTitleRecargas,
            idioma: params.idioma,
            perfil: params.perfil
        });
        this.createButtonPanel();
        this.createGridPanel();
        this.initEventos();
        this.initFunctions();
        Caja.Tarjetas.PanelRecarga.superclass.constructor.call(this);
    },
    createButtonPanel: function () {
        this.tbar = [
            this.btnAdicionar = new Ext.Button({
                iconCls: 'adicionar',
                text: this.idioma.lbAdicionar,
                tooltip: this.idioma.lbToolAddRecarga,
                disabled: true
            }),
            this.btnModificar = new Ext.Button({
                iconCls: 'modificar',
                text: this.idioma.lbModificar,
                tooltip: this.idioma.lbToolModRecarga,
                disabled: true,
            }),
            this.btnCancelar = new Ext.Button({
                iconCls: 'cancelar',
                text: this.idioma.lbCancelar,
                tooltip: this.idioma.lbToolCancelRecarga,
                disabled: true,
            }),
            this.btnConfirmar = new Ext.Button({
                iconCls: 'confirmar',
                text: this.idioma.lbConfirmar,
                tooltip: this.idioma.lbToolConfRecarga,
                disabled: true,
            }),
            this.btnPostear = new Ext.Button({
                disabled: true,
                iconCls: 'contabilidad',
                text: this.idioma.lbPostear,
                tooltip: this.idioma.lbToolPostearRecarga,
            }),
            // this.btnVerCom = new Ext.Button({
            //     // disabled: true,
            //     iconCls: 'vistareporte',
            //     text: this.idioma.lbVerCom,
            //     tooltip: this.idioma.lbToolVerCom,
            // })
        ];
    },
    createGridPanel: function () {
        var me = this;
        this.searchField = new Ext.Cont.SearchField({
            width: (Ext.lib.Dom.getViewWidth() - 10) * 0.1,
            maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda ]*$/,
            scope: this,
            fnOnSearch: function () {
                me.searchRecarga(me.searchField.getRawValue());
            },
            fnOnClear: function () {
                me.searchRecarga('');
            }
        });

        this.rdRecarga = new Ext.data.JsonReader(
            {
                root: 'datos',
                totalProperty: 'cant'
            }, [{
                name: 'idmovimiento'
            }, {
                name: 'idtarjeta'
            }, {
                name: 'iddocumento'
            }, {
                name: 'chip'
            }, {
                name: 'importemo'
            }, {
                name: 'idrecibe'
            }, {
                name: 'nompersona'
            }, {
                name: 'idoperacion'
            }, {
                name: 'nomoperacion'
            }, {
                name: 'precio'
            }, {
                name: 'idestado'
            }, {
                name: 'nomestado'
            }, {
                name: 'numcomp'
            }, {
                name: 'fecha'
            }, {
                name: 'showCmp'
            }, {
                name: 'idanticipo'
            }, {
                name: 'idCtaAnticipo'
            }
            ]);

        this.stRecarga = new Ext.data.Store({
            url: 'getrecargas',
            reader: this.rdRecarga,
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
                    textIndex: 'numcomp'
                },
            ]
        });
        //------------------------------
        this.gpRecarga = new Ext.grid.GridPanel({
            border: false,
            split: true,
            frame: false,
            loadMask: true,
            //height: Ext.lib.Dom.getViewHeight() * 0.4,
            // height: 420,
            arrayPaginSelect: new Array(),
            layout: 'fit',
            autoExpandColumn: 'columusuario',
            store: this.stRecarga,
            // sm: this.smRecarga = new Ext.grid.CheckboxSelectionModel({
            sm: this.smRecarga = new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            columns: [
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idmovimiento'
                }, {
                    sortable: true,
                    width: 20,
                    header: this.idioma.lbChip,
                    hideable: true,
                    id: 'chip',
                    dataIndex: 'chip'
                }, {
                    sortable: true,
                    header: this.idioma.lbResponsable,
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
                    header: this.idioma.lbImporte,
                    sortable: true,
                    width: 10,
                    hideable: true,
                    dataIndex: 'importemo'
                }, {
                    header: this.idioma.lbLitros,
                    dataIndex: 'litros',
                    width: 10,
                    sortable: true,
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        if (record.data.precio && record.data.precio != '0.00') {
                            return parseFloat(record.data.importemo / record.data.precio).toFixed(2);
                        } else {
                            return '';
                        }
                    }
                }, {
                    header: 'Tipo recarga',
                    dataIndex: 'idanticipo',
                    width: 50,
                    sortable: true,
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        return value ? 'Recarga anticipo' : 'Recarga obligacion';
                    }
                },
                // {
                //     sortable: true,
                //     width: 7,
                //     header: this.idioma.lbNroComprobante,
                //     hideable: true,
                //     dataIndex: 'numcomp'
                // },
                this.rowaction],
            viewConfig: {
                forceFit: true
            },
            forceFit: true,
            tbar: [this.searchField],
            bbar: this.pagToolRecarga = new Ext.Cont.PagingToolbar({
                pageSize: 15,
                store: this.stRecarga,
                displayInfo: true
            }),
            plugins: this.rowaction
        });
        this.items = [this.gpRecarga];
    },
    initEventos: function () {
        var me = this;

        this.btnAdicionar.on({
            scope: this,
            click: function (button, event) {

                if (this.scope.cbProveedor.getValue() == '') {
                    this.scope.cbProveedor.isValid();
                    mostrarMensaje(1, this.idioma.lbSelectProveedor);
                    return;
                }

                var winAnt = new Caja.Tarjetas.WindowRecarga({
                    idioma: this.idioma,
                    perfil: this.perfil,
                    scope: this,
                    autoValidate: false,
                    action: 'add',
                    title: this.idioma.lbTitleAddAnt
                });

                winAnt.show();
                winAnt.createFormSteps();
                winAnt.nfChip.focus(true, true);
                winAnt.dfFecha.setValue(fechaContable);
            }
        });
        this.btnModificar.on({
            scope: this,
            click: function (button, event) {
                var winAnt = new Caja.Tarjetas.WindowRecarga({
                    idioma: this.idioma,
                    perfil: this.perfil,
                    scope: this,
                    action: 'mod',
                    autoValidate: false,
                    title: this.idioma.lbTitleModAnt
                });
                winAnt.show();
                winAnt.loadModData(me.smRecarga.getSelected());
            }
        });

        this.btnConfirmar.on({
            scope: this,
            click: function (button, event) {
                this.scope.keyMapa.disable();
                var me = this;
                var selections = this.smRecarga.getSelections();
                var pregConf = (selections.length == 1) ? this.idioma.lbConfirRecargaConfir : this.idioma.lbConfirRecargasConfir;
                mostrarMensaje(2, pregConf, function (btnPress) {
                    if (btnPress === 'ok') {
                        me.confirmarRecarga(selections);
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
                var selections = this.smRecarga.getSelections();
                var pregCancel = (selections.length == 1) ? this.idioma.lbCancelRecargaConfir : this.idioma.lbCancelRecargasConfir;
                mostrarMensaje(2, pregCancel, function (btnPress) {
                    if (btnPress === 'ok') {
                        var objWinCancelar = new Caja.WindowCancelar({
                            selections: selections,
                            fecha: me.smRecarga.getSelected().data.fecha
                        });
                        objWinCancelar.show();
                        objWinCancelar.btnAceptar.on({
                            scope: this,
                            click: function () {
                                if (selections[0].data.idestado == 6) {
                                    Ext.Msg.wait(me.idioma.lbLoadDataComprobante, me.idioma.lbEspere);
                                    var selection = me.smRecarga.getSelected();
                                    var params = {
                                        idmotivo: objWinCancelar.cbmotivo.getValue(),
                                        fecha: objWinCancelar.dffechacancelacion.getRawValue(),
                                        tipoContabilizacion: 2,//2-Cancelar
                                        idmovimiento: selection.data.idmovimiento,
                                        iddocumento: selection.data.iddocumento,
                                        chip: selection.data.chip,
                                        idCtaAnticipo: selection.data.idCtaAnticipo,
                                        idtarjeta: selection.data.idtarjeta,
                                        importemo: selection.data.importemo,
                                        descripcion: 'Cancelando recarga de la tarjeta #' + me.scope.panelTarjeta.smTarjeta.getSelected().get('numero') + ' : '
                                    }
                                    me.fLoadDataComprobante(params);
                                } else {
                                    var params = {
                                        idmotivo: objWinCancelar.cbmotivo.getValue(),
                                        fecha: objWinCancelar.dffechacancelacion.getRawValue()
                                    }
                                    me.cancelarRecarga(params);
                                }
                            }
                        });
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
                var selections = this.smRecarga.getSelections();
                var pregPost = (selections.length == 1) ? this.idioma.lbPostRecargaConfir : this.idioma.lbPostRecargasConfir;
                mostrarMensaje(2, pregPost, function (btnPress) {
                    if (btnPress === 'ok') {
                        Ext.Msg.wait(me.idioma.lbLoadDataComprobante, me.idioma.lbEspere);
                        var selection = me.smRecarga.getSelected();
                        params = {
                            tipoContabilizacion: 1, //1 contabilizar doc confirmado | 2 revertir comprobnate contabilizado
                            actionContabiliza: 'contabilizar',
                            idmovimiento: selection.data.idmovimiento,
                            iddocumento: selection.data.iddocumento,
                            chip: selection.data.chip,
                            idCtaAnticipo: selection.data.idCtaAnticipo,
                            idtarjeta: selection.data.idtarjeta,
                            importemo: selection.data.importemo,
                            descripcion: 'Posteando recarga de la tarjeta #' + me.scope.panelTarjeta.smTarjeta.getSelected().get('numero') + ' : '
                        }
                        me.fLoadDataComprobante(params);
                    }
                    if (btnPress === 'cancel') {
                        me.scope.keyMapa.enable();
                    }
                });
            }
        });

        fShowReporteComprobante = function () {
            // Ext.Msg.wait(scope.etiquetas.lbCargando, scope.etiquetas.lbEspere);
            Ext.Msg.wait('Cargando...', 'Espere');
            var arrayIdCmp = me.smRecarga.getSelected().json.arrayIdCmp;

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

        this.rowaction.on({
            action: function (grid, recordarray, icon, rowindex, colindex) {
                fShowReporteComprobante();
            },
            beforeaction: function (grid, rowIndex) {
            }
        });

        fOpenWindowReportCmp = function (datosReporte) {
            defaultComponentsValue = {
                paperSize: "A4",
                orientation: "Horizontal",
                reportType: "HTML"
            };
            var printView = new SCFPrintView(datosReporte, "/contabilidad/comun/SCFPrintView/", defaultComponentsValue);
            printView.show();
        };


        this.gpRecarga.on({
            scope: this,
            rowclick: function (grid, rowIndex, e) {
                if (this.smRecarga.getSelections().length == 1 && !this.scope.panelTarjeta.smTarjeta.getSelected().data.cancelada && this.smRecarga.getSelected().data.idanticipo) {//Si es uno y no estan cancelada la tarjeta
                    this.btnCancelar.setDisabled((this.smRecarga.getSelected().data.idestado == '7') || (parseFloat(this.smRecarga.getSelected().data.importemo) > parseFloat(this.scope.panelTarjeta.smTarjeta.getSelected().data.saldomo) && this.smRecarga.getSelected().data.idestado == '6'));//7-Cancelado o el saldo de la tarjeta sea menor al de la recargar no se puede cancelar
                    this.btnModificar.setDisabled(!(this.smRecarga.getSelected().data.idestado == '8'));//8-Guardado
                    this.btnConfirmar.setDisabled(!(this.smRecarga.getSelected().data.idestado == '8'));//8-Guardado
                    this.btnPostear.setDisabled(!(this.smRecarga.getSelected().data.idestado === '5'));//5-Confirmado
                } else {
                    this.btnCancelar.disable();
                    this.btnModificar.disable();
                    this.btnConfirmar.disable();
                    this.btnPostear.disable();
                }
            }
        });

        this.smRecarga.on({
            scope: this,
            rowselect: function (smodel, rowIndex, record) {
                this.gpRecarga.getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function (smodel, rowIndex, record) {
                this.gpRecarga.getView().removeRowClass(rowIndex, "negrita");
            },
            selectionchange: function () {
                this.btnCancelar.disable();
                this.btnModificar.disable();
                this.btnConfirmar.disable();
                this.btnPostear.disable();
            }
        });

        this.stRecarga.on({
            scope: this,
            beforeload: function (s, options) {
                this.btnCancelar.disable();
                this.btnModificar.disable();
                this.btnConfirmar.disable();
                this.btnPostear.disable();
                if (this.scope.panelTarjeta.smTarjeta.getSelections().length == 1) {
                    this.stRecarga.baseParams.idtarjeta = this.scope.panelTarjeta.smTarjeta.getSelected().data.idtarjeta;
                    this.stRecarga.baseParams.idPeriodo = Caja.Componentes.cbPeriodo.getValue();
                }
                if (this.smRecarga.hasSelection())
                    this.idRecarga = this.smRecarga.getSelected().data.idmovimiento;
                else this.idRecarga = null;
            },
            load: function (st, recors) {
                if (this.idRecarga) {
                    var index = me.stRecarga.find('idmovimiento', this.idRecarga);
                    me.smRecarga.selectRow(index);
                    this.gpRecarga.fireEvent('rowclick', this.gpRecarga, index);
                } else {
                    this.smRecarga.selectFirstRow();
                    this.gpRecarga.fireEvent('rowclick', this.gpRecarga, 0);
                }
            }
        });

        this.gpRecarga.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.data.idestado == '7') { //Cancelado
                return 'FilaRoja';
            } else if (record.data.idestado == '6') { //Posteado
                return 'FilaVerde';
            }
        };

    },
    initFunctions: function () {

        var me = this;

        this.confirmarRecarga = function (selections) {
            Ext.Msg.wait(this.idioma.lbConfirmando, this.idioma.lbEspere);
            var arrayId = new Array();
            for (var i = 0; i < selections.length; i++) {
                arrayId.push(selections[i].data.idmovimiento);
            }
            var msgSuccess = (arrayId.length == 1) ? this.idioma.lbAConfirRecargaSatisfact : this.idioma.lbAConfirRecargasSatisfact;
            this.ajaxConfirmarRecarga(arrayId, msgSuccess);
        };

        this.ajaxConfirmarRecarga = function (arrayId, msgSuccess, reloadRecarga = true, funcionCallBack = undefined) {
            if (!Ext.MessageBox.isVisible()) {
                Ext.Msg.wait('Confirmando...', 'Espere...');
            }
            Ext.Ajax.request({
                scope: this,
                url: 'confirmarrecarga',
                params: {
                    arrayId: Ext.encode(arrayId)
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.codMg == '1') {
                        mostrarMensaje(1, msgSuccess);
                        if (reloadRecarga) {
                            this.stRecarga.reload();
                        }
                        if (typeof funcionCallBack === 'function') {
                            funcionCallBack.call();
                        }
                        Ext.MessageBox.hide();
                    }
                }
            });
        };

        this.cancelarRecarga = function (params) {
            Ext.Msg.wait(this.idioma.lbCancelando, this.idioma.lbEspere);
            var selections = me.smRecarga.getSelections();
            var arrayId = new Array();
            for (var i = 0; i < selections.length; i++) {
                arrayId.push(selections[i].data.iddocumento);
            }
            var msgSuccess = (arrayId.length == 1) ? this.idioma.lbACancelRecargaSatisfact : this.idioma.lbACancelRecargasSatisfact;
            if (params.idComprobante) {
                msgSuccess = this.idioma.lbMsgCancelContabilizado + ' ' + params.numComprobante + '.';
            }

            Ext.Ajax.request({
                scope: this,
                url: 'cancelarrecarga',
                params: {
                    arrayId: Ext.encode(arrayId),
                    idmotivo: params.idmotivo,
                    fecha: params.fecha,
                    idComprobante: params.idComprobante,
                    numComprobante: params.numComprobante,
                    fechaComprobante: params.fechaComprobante,
                    idTarjeta: selections[0].data.idtarjeta,
                    importemo: selections[0].data.importemo,
                    idmovimiento: selections[0].data.idmovimiento
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.codMg == '1') {
                        mostrarMensaje(1, msgSuccess);
                        this.stRecarga.reload();
                        this.btnCancelar.disable();
                        if (selections[0].data.idestado == 6) {
                            var targetaRecord = this.scope.panelTarjeta.gpTarjeta.getSelectionModel().getSelected();
                            var saldo = targetaRecord.get('saldomo');
                            targetaRecord.set('saldomo', Number(saldo) - Number(selections[0].data.importemo));
                            targetaRecord.commit();
                            // this.scope.panelTarjeta.gpTarjeta.getView().refresh();
                        }
                        Ext.MessageBox.hide();
                    }
                }
            });
        };

        //Metodos de para el proceso de POSTEAR----------------------------------------------
        this.fLoadDataComprobante = function (params, recargar = true, funcionCallBAck = undefined) {
            if (!Ext.Msg.isVisible()) {
                Ext.Msg.wait(this.idioma.lbLoadDataComprobante, this.idioma.lbEspere);
            }
            Ext.Ajax.request({
                url: 'loadDataComprobante',
                method: 'POST',
                scope: this,
                params: {
                    idMovimiento: params.idmovimiento,
                    tipoContabilizacion: params.tipoContabilizacion,
                    idProveedor: me.scope.cbProveedor.getValue(),
                    fecha: params.fecha
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData == '-1') {
                        mostrarMensaje(1, this.idioma.lbNoOperacionRecarga);
                        Ext.MessageBox.hide();
                    } else if (responseData == '-2') {
                        mostrarMensaje(1, this.idioma.lbNoCtaPagoAntcipado);
                        Ext.MessageBox.hide();
                    } else
                        me.fShowComprobante(responseData, params, recargar, funcionCallBAck);
                }.bind(this)
            });
        };

        //Construir y mostrar el comprobante
        this.fShowComprobante = function (respData, params, recargar, funcionCallBAck) {
            var idSubsistema = 14;//Caja
            var idTipoComprobante = 3;//comprobante tipo operaciones
            var descripcion = params.descripcion + respData.descripcion;
            var detalle = params.descripcion + respData.detalle;

            // Ext.MessageBox.hide();
            Ext.Cont.Comprobante.init(idSubsistema, detalle, descripcion, respData.fechaCont, respData.dataComprobante, idTipoComprobante, 1, 1).onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                Ext.Msg.wait(this.idioma.lbGuardandoComprobante, this.idioma.lbEspere);
                if (params.tipoContabilizacion === 1)//Si esta Posteando
                    me.fGuardarComprobante(idComprobante, numComprobante, fechaComprobante, params, recargar, funcionCallBAck);
                else {
                    params.idComprobante = idComprobante;
                    params.numComprobante = numComprobante;
                    params.fechaComprobante = fechaComprobante;
                    me.cancelarRecarga(params);
                }
            }.bind(this)).onClose(function () {
                me.scope.keyMapa.enable();
            });
        };

        this.fGuardarComprobante = function (idComprobante, numeroComprobante, fechaComprobante, params, recargar, funcionCallBAck) {
            Ext.Msg.wait(this.idioma.lbPosteando, this.idioma.lbEspere);

            var arrayId = [params.idmovimiento];

            Ext.Ajax.request({
                method: "POST",
                url: 'postearrecarga',
                scope: this,
                params: {
                    arrayId: Ext.encode(arrayId),
                    idComprobante: idComprobante,
                    numeroComprobante: numeroComprobante,
                    fechaComprobante: fechaComprobante,
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == '1') {
                        if (recargar) {
                            this.stRecarga.reload();
                        }
                        if (typeof funcionCallBAck === 'function') {
                            funcionCallBAck.call();
                        }
                        this.btnPostear.disable();
                        var targetaRecord = this.scope.panelTarjeta.gpTarjeta.getSelectionModel().getSelected();
                        var saldo = targetaRecord.get('saldomo');
                        targetaRecord.set('saldomo', Number(saldo) + Number(responseData.importemo));
                        targetaRecord.commit();
                        // this.scope.panelTarjeta.gpTarjeta.getView().refresh();
                        Ext.MessageBox.hide();
                        mostrarMensaje(1, this.idioma.lbMsgPosteo + ' ' + numeroComprobante + '.');
                    }
                }.bind(this)
            });
        };
//-------------------------------------------------------------------
        this.searchRecarga = function (filter) {
            this.stRecarga.baseParams.filter = filter;
            this.stRecarga.load();
            this.stRecarga.on({
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

        this.selectionsOnPaging = function () {
            var instance = new PagingToolbarSelections({
                'selections': me.gpFondo.getSelectionModel().getSelections(),
                'activePage': me.gpFondo.getBottomToolbar().getPageData().activePage
            });
            return instance.getSelectionsOnArray(me.arrayPaginSelect);
        };
    }
});

//--Componente Window Anticipo
Caja.Tarjetas.WindowRecarga = Ext.extend(Ext.Window, {
    constructor: function (params) {
        Ext.apply(this, params);
        Ext.apply(this, {
            //height: Ext.lib.Dom.getViewHeight() * 0.45,
            // width: Ext.lib.Dom.getViewWidth() * 0.45,
            // height: 380,
            width: 500,
            //layout: 'border',
            modal: true,
            autoValidate: false,
            constrain: true,
            resizable: false,
            closeAction: 'close',
            frame: true,
            border: false,
            idioma: params.idioma,
            perfil: params.perfil,
            title: this.action == 'add' ? this.idioma.lbTitleAddRecarga : this.idioma.lbTitleModRecarga,
            listeners: {
                scope: this,
                show: function () {
                    this.scope.scope.keyMapa.disable();
                },
                close: function () {
                    this.scope.stRecarga.reload();
                    this.scope.scope.keyMapa.enable();
                    // this.scope.scope.TaskFormValidation.stopTaskValidation();
                }
            }
        });
        this.createButtons();
        this.createForm();
        this.initFunctions();
        this.initEventos();
        Caja.Tarjetas.WindowRecarga.superclass.constructor.call(this);
    },
    initEventos: function () {
        var me = this;
        // this.btnAceptar.on({
        //     scope: this,
        //     click: function () {
        //         this.saveRecarga();
        //     }
        // });

        this.cbOperacion.on({
            select: function (cb, record) {
                me.stAnticipo.loadData(record.json.data_anticipo);
                // me.idCuentaProveedor = record.data.idCuentaProveedor;

                /* var totalDisponible = 0;
                if (me.action == 'add')
                    totalDisponible = parseFloat(record.data.saldodisponible);
                else
                    totalDisponible = parseFloat(record.data.saldodisponible) + parseFloat(me.scope.smRecarga.getSelected().data.importemo);

                me.nfSaldoDisponible.setValue(totalDisponible);
                me.nfSaldoDisponible.setRawValue(formatoMoneda(totalDisponible));*/

                // if (record.data.saldodisponible == 0) {
                if (record.json.data_anticipo.length == 0) {
                    mostrarMensaje(1, me.idioma.lbNoSaldoDisp);
                    me.nfImporte.reset();
                    me.nfImporte.isValid();
                }
            }
        });

        this.stOperacion.on({
            load: function (st, records) {
                if (records.length == 1) {
                    me.cbOperacion.setValue(records[0].data.idnomoperaciones);
                    me.cbOperacion.fireEvent('select', me.cbOperacion, records[0]);
                }
                me.lMask.hide();
            },
            beforeload: function (st) {
                if (st.getTotalCount() == 0)
                    me.lMaskCargando();
            },
            loadexception: function (st) {
                var respuesta = Ext.decode(me.stOperacion.reader.jsonData);
                if (respuesta.codMg == -1) {
                    mostrarMensaje(1, me.idioma.lbNoCtaPagoAntcipado);
                }
                if (respuesta.codMg == -2) {
                    mostrarMensaje(1, me.idioma.lbNoOperacionRecarga);
                }
                me.lMask.hide();
                me.close();
            }
        });

    },
    createButtons: function () {
        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            disabled: true,
            text: this.idioma.lbAceptar,
            tooltip: this.idioma.lbToolAceptar2
        });

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

        // this.btnAplicar = new Ext.Button({
        //     id: 'btnAplicar',
        //     disabled: true,
        //     iconCls: 'aplicar',
        //     tabIndex: 11,
        //     text: 'Aplicar',
        //     tooltip: 'Guardar los datos',
        // });

        this.btnNuevo = new Ext.Button({
            iconCls: 'nuevo',
            text: 'Nuevo',
            tooltip: 'Limpiar los campos',
        });

        this.btnConfirmar = new Ext.Button({
            iconCls: 'confirmar',
            text: 'Confirmar',
            disabled: true,
            tooltip: 'Confirmar recarga de tarjeta',
        });

        this.btnPostear = new Ext.Button({
            iconCls: 'contabilidad',
            text: 'Postear',
            disabled: true,
            tooltip: 'Postear recarga de tarjeta',
        });

        this.buttons = [this.btnCancelar, this.btnNuevo, this.btnAceptar, this.btnConfirmar, this.btnPostear];
    },
    createFormSteps: function (arrBtn = undefined) {
        if (arrBtn) {
            this.formSteps = new Ext.FormSteps(this.formRecarga, arrBtn);
        } else {
            this.formSteps = new Ext.FormSteps(this.formRecarga, [this.btnNuevo, this.btnAceptar, this.btnConfirmar, this.btnPostear]);
        }
        this.formSteps.on({
            scope: this,
            Nuevo: function (fnNuevo) {
                this.limpiarCamposForm();
                this.habilitarDesabilitarCampos(1);
                fnNuevo.call();
            },
            Crear: function (fnCrear, cerrarVentana) {
                this.saveRecarga(cerrarVentana, fnCrear);
            },
            Confirmar: function (fnConfirmar, idMovimiento) {
                this.scope.ajaxConfirmarRecarga([idMovimiento], this.scope.idioma.lbAConfirRecargaSatisfact, false, fnConfirmar);
            },
            Postear: function (fnPostear, idMovimiento) {
                var fn = fnPostear;
                var params = {
                    tipoContabilizacion: 1, //1 contabilizar doc confirmado | 2 revertir comprobnate contabilizado
                    idmovimiento: idMovimiento,
                    descripcion: 'Posteando recarga de la tarjeta #' + this.scope.scope.panelTarjeta.smTarjeta.getSelected().get('numero') + ' : '
                }
                if (this.action == 'mod') {
                    fn = fnPostear.createSequence(function () {
                        this.close();
                    }, this);
                }
                this.scope.fLoadDataComprobante(params , false, fn);
            },
        });
    },
    createForm: function () {
        var me = this;
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
            }])
        });

        this.cbPersona = new Ext.form.ComboBox({
            fieldLabel: this.idioma.lbResponsable,
            store: this.stPersona,
            valueField: 'idpersona',
            hiddenName: 'idpersona',
            displayField: 'nombre',
            emptyText: this.idioma.lbSeleccione, //'Seleccione...',
            disabledClass: 'disabled-component',
            forceSelection: true,
            allowBlank: true,
            resizable: true,
            //readOnly: true,
            triggerAction: 'all',
            anchor: '100%',
            minChars: 0, //Para la nueva busqueda poner contraria esta linea
            pageSize: 10, //Para la nueva busqueda poner contraria esta linea
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{numid} {nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            selectOnFocus: true,
            enableKeyEvents: true,
        });

        this.stOperacion = new Ext.data.Store({
            url: 'cargarOperaciones',
            method: 'POST',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total'
            }, [{
                name: 'idnomoperaciones'
            }, {
                name: 'denominacion'
            }, /*{
                name: 'saldodisponible'
            }, */{
                name: 'idCuentaProveedor'
            }
            ]),
            baseParams: {
                idProveedor: this.scope.scope.cbProveedor.getValue(),
                idMoneda: this.scope.scope.panelTarjeta.smTarjeta.getSelected().data.idmoneda,
                nomcuenta: this.scope.scope.panelTarjeta.smTarjeta.getSelected().data.nomcuenta,
                idAnticipo: me.action == 'mod' ? this.scope.smRecarga.getSelected().data.idanticipo : -1
            },
            autoLoad: true,
        });

        this.cbOperacion = new Ext.form.ComboBox({
            fieldLabel: this.idioma.lbOperacion,
            store: this.stOperacion,
            name: 'idoperacion',
            valueField: 'idnomoperaciones',
            hiddenName: 'idnomoperaciones',
            displayField: 'denominacion',
            emptyText: this.idioma.lbSeleccione, //'Seleccione...',
            disabledClass: 'disabled-component',
            editable: false,
            mode: 'local',
            forceSelection: true,
            allowBlank: false,
            resizable: true,
            //readOnly: true,
            triggerAction: 'all',
            anchor: '100%',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            // selectOnFocus: true,
            // enableKeyEvents: true,
        });

        //Grid Anticipo renderizado en el combox----------------------------------
        this.stAnticipo = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                // root: 'data',
                // totalProperty: 'total'
            }, [{
                name: 'idanticipo'
            }, {
                name: 'numerodocumento'
            }, {
                name: 'fechacreacion'
            }, {
                name: 'importemo'
            }, {
                name: 'pendiente'
            }, {
                name: 'idcuenta'
            }])
        });

        this.gpAnticipo = new Ext.grid.GridPanel({
            border: false,
            height: 200,
            split: true,
            autoExpanColunm: 'numerodocumento',
            frame: false,
            loadMask: true,
            viewConfig: {
                forceFit: true
            },
            store: this.stAnticipo,
            sm: this.smGpAnticipo = new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            columns: [
                {
                    sortable: true,
                    header: 'No. Instrumento',
                    hideable: true,
                    id: 'numerodocumento',
                    dataIndex: 'numerodocumento'
                }, {
                    sortable: true,
                    width: 50,
                    header: 'Fecha',
                    hideable: true,
                    dataIndex: 'fechacreacion'
                }, {
                    header: this.idioma.lbPendiente,
                    sortable: true,
                    hideable: true,
                    width: 50,
                    dataIndex: 'pendiente',
                    renderer: formatoMoneda
                }
            ]
        });

        this.smGpAnticipo.on('rowselect', function (sm, index, record) {
            me.idCuentaProveedor = record.data.idcuenta;
            me.cbAnticipo.setValue(record.data.idanticipo);
            me.cbAnticipo.setRawValue(record.data.numerodocumento);
            if (me.action == 'mod' && record.data.idanticipo == me.scope.smRecarga.getSelected().data.idanticipo)
                var totalPendiente = parseFloat(record.data.pendiente) + parseFloat(me.scope.smRecarga.getSelected().data.importemo);
            else totalPendiente = record.data.pendiente;
            // me.nfImportePendiente.setRawValue(formatoMoneda(totalPendiente));
            me.nfImportePendiente.setValue(parseFloat(totalPendiente).toFixed(2));
            me.nfImporte.enable();
            me.nfImporte.focus();
            me.cbAnticipo.collapse();
        });

        this.cbAnticipo = new Ext.form.ComboBox({
            fieldLabel: 'No. Instrumento',
            store: this.stCbAnticipo = new Ext.data.SimpleStore({
                fields: [{name: 'idanticipo'}, {name: 'numerodocumento'}],
                data: [[]]
            }),
            valueField: 'idanticipo',
            hiddenName: 'idanticipo',
            mode: 'local',
            displayField: 'numerodocumento',
            disabledClass: 'disabled-component',
            // forceSelection: true,
            allowBlank: false,
            resizable: false,
            // readOnly: true,
            editable: false,
            triggerAction: 'all',
            anchor: '98%',
            tpl: '<div id = \"cmbanticipo\" style = \"height:200px; !important;\"></div>',
            selectOnFocus: true,
            enableKeyEvents: true,
            listeners: {
                scope: this,
                expand: function (combo) {
                    if (!this.gpAnticipo.rendered) {
                        this.gpAnticipo.render('cmbanticipo');
                    }
                }
            }

        });
        //---------------------------------------
        this.firstElement = this.nfChip = new Ext.form.NumberField({
            allowBlank: false,
            anchor: '95%',
            name: 'chip',
            fieldLabel: this.idioma.lbChip,
            maxLength: 8,
            maxLengthText: this.idioma.lbMaxLengthText8,
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.nfNumFin.focus();
                }
            }
        });

        this.nfImporte = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            fieldLabel: this.idioma.lbImporte,
            maxLength: 19,
            name: 'importemo',
            style: 'text-align: right',
            maxLengthText: this.idioma.lbMaxLengthImporte19,
            allowBlank: false,
            anchor: '100%',
            disabled: true,
            validator: function (value) {
                //---Validar importe pendiente
                if (value > me.nfImportePendiente.getValue())
                    return 'El importe no puede ser mayor que ' + me.nfImportePendiente.getRawValue();
                else if (value == 0)
                    return 'El importe no puede ser 0.';
                else return true;
            },
            /*listeners: {
                scope: this,
                blur: function (cb) {
                    cb.setRawValue(formatoMoneda(cb.getValue()));
                }
            }*/
        });

        this.nfImportePendiente = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            fieldLabel: this.idioma.lbPendiente,
            maxLength: 19,
            disabled: true,
            style: 'text-align: right',
            name: 'importePendiente',
            maxLengthText: this.idioma.lbMaxLengthImporte19,
            allowBlank: false,
            allowNegative: false,
            anchor: '95%'
        });

        /*this.nfSaldoDisponible = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            fieldLabel: this.idioma.lbImporteDisp,
            maxLength: 19,
            disabled: true,
            style: 'text-align: right',
            name: 'saldodisponible',
            maxLengthText: this.idioma.lbMaxLengthImporte19,
            allowBlank: false,
            allowNegative: false,
            anchor: '95%'
        });*/

        this.dfFecha = new Ext.form.DateField({
            fieldLabel: this.idioma.lbFechaRecarga,
            allowBlank: false,
            name: 'fecha',
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            anchor: '95%',
            minValue: fechaInicio,
            maxValue: new Date()
        });
        //-----------------------------------------------
        this.formRecarga = new Ext.FormPanel({
            frame: true,
            layout: 'form',
            autoHeight: true,
            labelWidth: 50,
            labelAlign: 'top',
            trackResetOnLoad: true,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .25,
                    layout: 'form',
                    items: [this.nfChip]
                }, {
                    columnWidth: .75,
                    layout: 'form',
                    items: [this.cbOperacion]
                }/*, {
                    columnWidth: .25,
                    layout: 'form',
                    items: [this.nfSaldoDisponible]
                }*/]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: .25,
                    layout: 'form',
                    items: [this.dfFecha]
                }, {
                    columnWidth: .75,
                    layout: 'form',
                    items: [this.cbPersona]
                }]
            }, {
                layout: 'column',
                items: [{
                    columnWidth: .60,
                    layout: 'form',
                    items: [this.cbAnticipo]
                }, {
                    columnWidth: .20,
                    layout: 'form',
                    items: [this.nfImportePendiente]
                }, {
                    columnWidth: .20,
                    layout: 'form',
                    items: [this.nfImporte]
                }]
            }]
        });

        this.items = [this.formRecarga];
    },
    initFunctions: function () {
        var me = this;

        this.loadModData = function (select) {
            this.lMaskCargando();
            this.btnNuevo.hide();
            // this.btnConfirmar.hide();
            // this.btnPostear.hide();
            var recordPersona = {data: [{idpersona: select.data.idrecibe, nombre: select.data.nompersona}]};
            this.stPersona.loadData(recordPersona);
            this.formRecarga.getForm().loadRecord(select);
            this.cbPersona.setValue(select.data.idrecibe);
            // this.nfImporte.setRawValue(formatoMoneda(select.data.importemo));
            this.nfImporte.setValue(select.data.importemo);

            this.stOperacion.on({
                scope: this,
                load: function () {
                    this.cbOperacion.setValue(select.data.idoperacion);
                    //Seleccionar el anticipo
                    var indexAnticipo = this.stAnticipo.find('idanticipo', this.cbAnticipo.getValue());
                    var dataAnticipo = this.stAnticipo.getAt(indexAnticipo);
                    this.smGpAnticipo.fireEvent('rowselect', this.smGpAnticipo, indexAnticipo, dataAnticipo);

                    this.lMask.hide();
                    // var formArray = new Array();
                    // formArray.push(this.formRecarga);
                    // var arrbotones = new Array();
                    // arrbotones.push(this.btnAceptar);
                    // this.scope.scope.TaskFormValidation.startTaskValidation(this.accion, formArray, arrbotones);
                    this.createFormSteps([this.btnAceptar, this.btnConfirmar, this.btnPostear]);
                }
            });
            me.btnCancelar.focus();
        };

        this.saveRecarga = function (cerrarVentana = true, funcionCallBack = undefined) {
            var me = this;
            var idTarjeta = this.scope.scope.panelTarjeta.smTarjeta.getSelected().data.idtarjeta;
            if (this.formRecarga.getForm().isValid()) {

                //Validar Importe de recargar
                // if (this.nfImporte.getValue() > cleanComa(this.nfSaldoDisponible.getRawValue())) {
                //     mostrarMensaje(1, me.idioma.lbImportInvalid);
                //     return;
                // }

                var msgSuccess = me.action == 'add' ? this.idioma.lbAddRecargaSatisfact : this.idioma.lbModRecargaSatisfact;
                Ext.Msg.wait(this.idioma.lbGuardando, this.idioma.lbEspere);

                Ext.Msg.wait(this.idioma.lbGuardando, this.idioma.lbEspere);
                Ext.Ajax.request({
                    url: 'saverecarga',
                    params: {
                        idmovimiento: me.action == 'mod' ? me.scope.smRecarga.getSelected().data.idmovimiento : -1,
                        idtarjeta: idTarjeta,
                        precio: me.scope.scope.panelTarjeta.smTarjeta.getSelected().data.preciocombustible,
                        chip: this.nfChip.getValue(),
                        importe: this.nfImporte.getValue(),
                        fecha: this.dfFecha.getRawValue(),
                        idrecibe: this.cbPersona.getValue(),//Responsable
                        idoperacion: this.cbOperacion.getValue(),//Operacion contable
                        idCuentaProveedor: me.idCuentaProveedor,//Cuenta del proveedor de la Operacion contable
                        idProveedor: this.scope.scope.cbProveedor.getValue(),
                        idAnticipo: this.cbAnticipo.getValue()
                    },
                    callback: function (options, success, response) {
                        var respuesta = Ext.decode(response.responseText);
                        if (respuesta.codMg == '-1') {
                            mostrarMensaje(1, me.idioma.lbChipExit);
                        } else if (respuesta == '-2') {
                            mostrarMensaje(1, this.me.lbNoOperacionRecarga);
                            Ext.MessageBox.hide();
                        } else if (respuesta.codMg == '1') {
                            mostrarMensaje(1, msgSuccess);
                            if (cerrarVentana) {
                                me.close();
                            } else {
                                me.habilitarDesabilitarCampos(0);
                            }
                            if (typeof funcionCallBack === 'function') {
                                funcionCallBack.call(undefined, respuesta.idMov);
                            }
                            // me.scope.stRecarga.reload();
                            // me.scope.scope.panelTarjeta.stTarjeta.reload();
                        }
                        Ext.MessageBox.hide();
                    }
                });
            }
        };

        this.lMaskCargando = function () {
            this.lMask = new Ext.LoadMask(me.body, {//body de la ventana
                msg: this.idioma.lbCargando
            });
            this.lMask.show();
        };

        this.limpiarCamposForm = function () {
            this.nfChip.reset();
            this.cbOperacion.reset();
            this.stOperacion.removeAll();
            this.lMaskCargando();
            this.stOperacion.reload();
            this.dfFecha.setValue(fechaFin);
            this.cbPersona.reset();
            this.cbAnticipo.reset();
            this.nfImportePendiente.reset();
            this.nfImporte.reset();
            this.nfImporte.disable();
        };

        this.habilitarDesabilitarCampos = function (flag) {
            this.nfChip.setDisabled(!flag);
            this.cbOperacion.setDisabled(!flag);
            this.dfFecha.setDisabled(!flag);
            this.cbPersona.setDisabled(!flag);
            this.cbAnticipo.setDisabled(!flag);
            this.nfImporte.setDisabled(!flag);
        };

    }
});
