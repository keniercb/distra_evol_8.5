Ext.namespace('Caja.GestFondo');

//--Componente Panel Fondo
Caja.GestFondo.PanelFondo = Ext.extend(Ext.Panel, {
    constructor: function (params) {
        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'border',
            region: 'center',
            border: false,
            split: true,
            frame: false,
            //height: Ext.lib.Dom.getViewHeight() * 0.4,
            //height: 420,
            arrayPaginSelect: new Array(),
            idioma: params.idioma,
            perfil: params.perfil,
            id: 'panelFondo',
            firstload: true
        });
        this.addEvents('showWinFondo');
        this.createGridPanel();
        this.createButtonPanel();
        this.initEventos();
        this.initFunctions();

        Caja.GestFondo.PanelFondo.superclass.constructor.call(this);
    },
    createButtonPanel: function () {
        this.tbar = [
            this.btnAddFondo = new Ext.Button({
                id: 'btnAddFondo',
                //icon: this.perfil.dirImg + 'adicionar.png',
                iconCls: 'adicionar',
                hidden: true,
                text: this.idioma.lbAdicionar,
                tooltip: this.idioma.lbToolAddFondo,
                handler: function () {
                    //-----
                }
            }),
            this.btnModFondo = new Ext.Button({
                disabled: true,
                id: 'btnModFondo',
                //icon: this.perfil.dirImg + 'modificar.png',
                iconCls: 'modificar',
                hidden: true,
                text: this.idioma.lbModificar,
                tooltip: this.idioma.lbToolModFondo,
                handler: function () {
                    //-----------
                }
            }),
            this.btnDelFondo = new Ext.Button({
                disabled: true,
                id: 'btnDelFondo',
                //icon: this.perfil.dirImg + 'eliminar.png',
                iconCls: 'eliminar',
                hidden: true,
                text: this.idioma.lbEliminar,
                tooltip: this.idioma.lbToolDelFondo,
                handler: function () {
                    //-------
                }
            }),
            this.btnAsocDes = new Ext.Button({
                disabled: true,
                id: 'btnAsocDes',
                //icon: this.perfil.dirImg + 'asociar.png',
                iconCls: 'asociar',
                text: this.idioma.lbAsocDes,
                tooltip: this.idioma.lbToolAsocDes
            }),
            /*this.btnOperaciones = new Ext.Button({
             disabled: true,
             id: 'btnOperaciones',
             icon: this.perfil.dirImg + 'comprobante.png',
             iconCls: 'btn',
             text: this.idioma.lbBtnOperaciones,
             tooltip: this.idioma.lbToolOperaciones
             }),*/
            this.btnAperturar = new Ext.Button({
                disabled: true,
                id: 'btnAsociar',
                //icon: this.perfil.dirImg + 'facturar.png',
                iconCls: 'apertura',
                text: this.idioma.lbApertura,
                tooltip: this.idioma.lbToolApertura
            })
        ];
    },
    initEventos: function () {
        var me = this;
        this.btnAddFondo.on({
            scope: this,
            click: function (button, event) {
                this.fireEvent('showWinFondo', false);
            }
        });
        this.btnModFondo.on({
            scope: this,
            click: function (button, event) {
                this.fireEvent('showWinFondo', true);
            }
        });
        this.btnDelFondo.on({
            scope: this,
            click: function (button, event) {
                this.scope.keyMapa.disable();
                var me = this;
                var cantSelections = this.smFondo.getSelections().length;
                var pregEliminarFondo = (cantSelections > 1) ? this.idioma.lbPregEliminarFondos : this.idioma.lbPregEliminarFondo;
                mostrarMensaje(2, pregEliminarFondo, function (btnPress) {
                    if (btnPress === 'ok') {
                        me.deleteFondo();
                    }
                    me.scope.keyMapa.enable();
                });
            }
        });
        this.btnAsocDes.on({
            scope: this,
            click: function (button, event) {
                this.scope.keyMapa.disable();
                var me = this;
                var cantSelections = this.smFondo.getSelections().length;
                var pregEliminarFondo = (cantSelections > 1) ? this.idioma.lbPregAsocDesFondos : this.idioma.lbPregAsocDesFondo;
                mostrarMensaje(2, pregEliminarFondo, function (btnPress) {
                    if (btnPress === 'ok') {
                        me.asocDesFondosCaja();
                    }
                    me.scope.keyMapa.enable();
                });
            }
        });
        /*this.btnOperaciones.on({
         scope: this,
         click: function (button, event) {
         var title = 'Operaciones de ' + this.scope.panelCaja.smCaja.getSelected().data.denominacion + ' en ' + this.smFondo.getSelected().data.denominacion;
         this.scope.panelOperaciones2.setTitle(title);

         this.scope.panelOperaciones.stOperaciones.load({
         params: {
         idcajafondo: this.smFondo.getSelected().data.idcajafondo ? this.smFondo.getSelected().data.idcajafondo : 0,
         ingreso: this.smFondo.getSelected().data.ingreso
         }
         }
         );

         this.scope.panelOperaciones.enable();
         if (this.scope.panelOperaciones2.collapsed)
         this.scope.panelOperaciones2.expand(true);
         else
         this.scope.panelOperaciones2.collapse(true);
         },
         disable: function (component) {
         this.scope.panelOperaciones2.setTitle(this.idioma.lbOperaciones);
         this.scope.panelOperaciones.stOperaciones.removeAll();
         this.scope.panelOperaciones.disable();
         this.scope.panelOperaciones2.collapse(true);
         }
         });*/
        this.btnAperturar.on({
            scope: this,
            click: function (button, event) {
                this.windowApertura = new Caja.GestFondo.WindowApertura({
                    idioma: this.idioma,
                    perfil: this.perfil,
                    scope: this,
                    autoValidate: true,
                    idcajafondo: this.smFondo.getSelected().data.idcajafondo
                });
                var title = this.idioma.lbTitleApertura;
                this.windowApertura.setTitle(title.replace("{0}", this.scope.panelFondo.smFondo.getSelected().data.denominacion.toLowerCase()));
                this.windowApertura.show();
                this.windowApertura.lMaskCargando();
                //Si tiene operaciones no puede cambiar la cuenta
                if (this.scope.panelFondo.smFondo.getSelected().data.enuso) {
                    this.windowApertura.cbxCuenta.disable();
                }
                //Solo habilita el saldo aprobado a los fondodos fijos
                var arrayTipoFondo = ['1', '4'];//1-Pagos menores, 4-Fondo para cambio
                if (arrayTipoFondo.indexOf(this.scope.panelFondo.smFondo.getSelected().data.tipofondo) >= 0) {
                    this.windowApertura.tfSaldoAprobado.enable();
                    //Si es un fondo de pago menores o de cambio es obligatorio ponerle el limite
                    this.windowApertura.tfSaldoAprobado.allowBlank = false;
                    this.windowApertura.tfSaldoAprobado.markInvalid();
                } else {
                    this.windowApertura.tfSaldoAprobado.disable();
                    this.windowApertura.tfSaldoAprobado.allowBlank = true;
                }
            }
        });

        this.gpFondo.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.json.desactivado == 1) { //Unificado
                return 'FilaRoja';
            }
        };

        this.stFondo.on({
            scope: this,
            beforeload: function (s, options) {
                this.stFondo.clearFilter(true);
                if (this.scope.panelCaja.smCaja.getSelections().length == 1)
                    this.stFondo.baseParams.idcaja = this.scope.panelCaja.smCaja.getSelected().data.idcaja;
                else this.stFondo.baseParams.idcaja = '';

                this.btnModFondo.disable();
                this.btnDelFondo.disable();
                this.btnAsocDes.disable();
                this.btnAperturar.disable();
                //this.btnOperaciones.disable();

                if (this.scope.lMask) {
                    if (this.scope.lMask.removeMask) {
                        this.lMaskCargando();
                    }
                } else this.lMaskCargando();
            },
            load: function (st) {
                if (st.reader.jsonData.gestFondo) {
                    this.btnAddFondo.setVisible(true);
                    this.btnModFondo.setVisible(true);
                    this.btnDelFondo.setVisible(true);
                } else {
                    this.btnAddFondo.setVisible(false);
                    this.btnModFondo.setVisible(false);
                    this.btnDelFondo.setVisible(false);
                }
                if (this.lMask)
                    this.lMask.hide();
                //Seleccionar automaticamente la primera caja
                // this.scope.panelCaja.smCaja.selectRow(0);
                if (this.firstload) {
                    this.scope.panelCaja.smCaja.selectFirstRow();
                    this.scope.panelCaja.gpCaja.fireEvent('rowclick', this.scope.panelCaja.gpCaja, 0);
                    this.firstload = false;
                }

            }
        });

        this.smFondo.on({
            scope: this,
            rowselect: function (smodel, rowIndex, record) {
                this.gpFondo.getView().addRowClass(rowIndex, "negrita");
                if (smodel.selections.length == 1) {
                    this.btnModFondo.enable();

                    if (this.scope.panelCaja.smCaja.getSelections().length == 1 && record.data.idcaja) {
                        this.btnDelFondo.disable();
                    } else {
                        this.btnDelFondo.enable();
                    }
                    if (this.scope.panelCaja.smCaja.getSelections().length == 1 && record.data.idcaja) {
                        this.btnAperturar.enable();
                    }
                } else {
                    this.btnModFondo.disable();
                    this.btnAperturar.disable();
                }

                if (this.scope.panelCaja.smCaja.getSelections().length == 1) {
                    this.btnAsocDes.enable();
                    //-------------------------------
                    this.scope.panelTalonario2.setTitle(this.idioma.lbConsecutivos);
                    if (this.smFondo.getSelections().length == 1 && this.smFondo.getSelected().data.idcajafondo && this.smFondo.getSelected().data.tipofondo == 2) {//2-(Ingreso)Recibo de efectivo
                        this.scope.panelTalonario2.setTitle(String.format(this.idioma.lbConsecutivoFondo, this.smFondo.getSelected().data.denominacion.toLowerCase()));
                        this.scope.panelTalonario.stTalonario.load({
                            params: {
                                idcajafondo: this.smFondo.getSelected().data.idcajafondo
                            }
                        });
                        //Ext.getCmp('btnAddConsecutivo').enable();
                    } else {
                        this.scope.panelTalonario.stTalonario.removeAll();
                        //Ext.getCmp('btnAddConsecutivo').disable();
                    }
                }
                //Si esta (Descactivado) unificado
                if (this.smFondo.getSelected().data.desactivado == 1) {
                    this.btnModFondo.disable();
                    this.btnDelFondo.disable();
                    this.btnAsocDes.disable();
                    this.btnAperturar.disable();
                }
            },
            rowdeselect: function (smodel, rowIndex, record) {
                this.gpFondo.getView().removeRowClass(rowIndex, "negrita");
                this.scope.panelTalonario2.setTitle(this.idioma.lbConsecutivos);
                if (smodel.selections.length == 1) {
                    this.btnModFondo.enable();
                    if (this.scope.panelCaja.smCaja.getSelections().length == 1 && this.smFondo.getSelected().data.idcaja) {
                        this.btnAperturar.enable();
                    }
                } else {
                    this.btnModFondo.disable();
                    this.btnAperturar.disable();
                }
                if (smodel.selections.length == 0) {
                    this.btnDelFondo.disable();
                    this.btnAsocDes.disable();
                    //Ext.getCmp('btnAddConsecutivo').disable();
                }

            }
        });
        this.pagToolFondo.on({
            'beforechange': function () {
                instance = new PagingToolbarSelections({
                    'selections': me.smFondo.getSelections(),
                    'activePage': this.getPageData().activePage
                });
                instance.saveSelectionsOnPage(me.arrayPaginSelect);
            },
            'change': function () {
                instance = new PagingToolbarSelections({
                    'activePage': this.getPageData().activePage
                });
                //instance.setSelectionsOnPage(me.arrayPaginSelect, me.gpFondo);
                var arrayPos = new Array();
                me.smFondo.clearSelections();
                for (var i = 0; i < me.arrayPaginSelect.length; i++) {
                    for (var j = 0; j < me.arrayPaginSelect[i].selections.length; j++) {
                        if ((me.stFondo.find('idfondo', me.arrayPaginSelect[i].selections[j].data.idfondo)) >= 0) {
                            arrayPos.push(j);
                        }
                    }
                }
            }
        });
    },
    initFunctions: function () {
        var me = this;

        this.lMaskCargando = function () {
            this.lMask = new Ext.LoadMask(me.body, {//body de la ventana
                msg: this.idioma.lbCargando
            });
            this.lMask.show();
        };

        this.searchFondo = function (filter) {
            this.stFondo.baseParams.filter = filter;
            this.stFondo.load();
            this.stFondo.on({
                scope: this,
                load: function (store, records, options) {
                    if (!records.length && filter)
                        mostrarMensaje(1, 'No existen datos que se correspondan con el criterio de búsqueda especificado.')
                }
            });
        };

        this.deleteFondo = function () {

            Ext.Msg.wait(this.idioma.lbEliminado, this.idioma.lbEspere);

            var arrayIdFondo = new Array();
            var arrayFondoSelection = this.selectionsOnPaging();

            for (i = 0; i < arrayFondoSelection.length; i++) {
                arrayIdFondo.push(arrayFondoSelection[i].idfondo);
            }

            var msgSuccess = (arrayIdFondo.length > 1) ? this.idioma.lbDelSatisfatFondos : this.idioma.lbDelSatisfatFondo;

            Ext.Msg.wait(this.idioma.lbEliminado, this.idioma.lbEspere);

            Ext.Ajax.request({
                url: 'deletefondo',
                scope: this,
                params: {
                    arrayidfondo: Ext.encode(arrayIdFondo)
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);

                    if (respuesta.codM == '1')//Se elimino satisfactoriamnete
                        mostrarMensaje(1, msgSuccess);
                    else if (respuesta.codM == '2')//Hubieron fondos que no se pudieron eliminar
                        mostrarMensaje(1, this.idioma.lbDelNoFondosHubieron);
                    else if (respuesta.codM == '-1' && arrayIdFondo.length > 1)//No se pudieron eliminar
                        mostrarMensaje(1, this.idioma.lbDelNoFondos);
                    else mostrarMensaje(1, this.idioma.lbDelNoFondo);

                    Ext.MessageBox.hide();
                    me.stFondo.reload();
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
        this.asocDesFondosCaja = function () {

            var arrayIdFondo = new Array();
            var arrayFondoSelection = this.selectionsOnPaging();

            for (i = 0; i < arrayFondoSelection.length; i++) {
                arrayIdFondo.push(
                    arrayFondoSelection[i].idfondo
                );
            }

            Ext.Msg.wait(this.idioma.lbAsocDes, this.idioma.lbEspere);

            Ext.Ajax.request({
                url: 'asocdesfondo',
                params: {
                    idcaja: me.scope.panelCaja.smCaja.getSelected().data.idcaja,
                    arrayidfondo: Ext.encode(arrayIdFondo)
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.codM == '-2') {
                        mostrarMensaje(1, me.idioma.lbAsocDesFondoNo);
                    } else if (respuesta.codM == '1' && arrayIdFondo.length > 1) {
                        mostrarMensaje(1, me.idioma.lbAsocDesFondos);
                    } else {
                        mostrarMensaje(1, me.idioma.lbAsocDesFondo);
                        me.scope.panelTalonario.stTalonario.removeAll();
                        //Ext.getCmp('btnAddConsecutivo').disable();
                    }
                    Ext.MessageBox.hide();
                    me.stFondo.reload();
                    me.scope.panelCaja.stCaja.reload();
                }
            });
        };
    },
    createGridPanel: function () {
        var me = this;

        this.searchField = new Ext.Cont.SearchField({
            width: (Ext.lib.Dom.getViewWidth() - 10) * 0.1,
            maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda ]*$/,
            scope: this,
            fnOnSearch: function () {
                me.searchFondo(me.searchField.getRawValue());
            },
            fnOnClear: function () {
                me.searchFondo('');
            }
        });

        this.stFormaPago = new Ext.data.Store({
            url: 'loadFormaPago',
            sortInfo: {
                field: 'denominacion',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{
                name: 'idformapago'
            }, {
                name: 'denominacion'
            }
            ]),
            autoLoad: true
        });

        this.rdfondo = new Ext.data.JsonReader({
            root: 'datos',
            totalProperty: 'cant'
        }, [{
            name: 'denominacion'
        }, {
            name: 'codigo'
        }, {
            name: 'idfondo'
        }, {
            name: 'idcaja'
        }, {
            name: 'idcajafondo'
        }, {
            name: 'idaperturafondo'
        }, {
            name: 'descripcion'
        }, {
            name: 'fechaaprueba'
        }, {
            name: 'docaprueba'
        }, {
            name: 'nommoneda'
        }, {
            name: 'saldoaprobadomo'
        }, {
            name: 'saldoactualmo'
        }, {
            name: 'saldocuenta'
        }, {
            name: 'nomcuenta'
        }, {
            name: 'tipofondo'
        }, {
            name: 'idformapago'
        }, {
            name: 'aperturafondo'
        }, {
            name: 'asociado'
        }, {
            name: 'enuso'//Si tiene operaciones
        }, {
            name: 'desactivado'//Si esta desactivado(para la Unificacion)
        }]);

        this.stFondo = new Ext.data.Store({
            url: 'cargarfondos',
            reader: this.rdfondo,
            scope: this,
            baseParams: {
                limit: 15,
                filter: ''
            },
            autoLoad: true
        });

        this.gpFondo = new Ext.grid.GridPanel({
                border: false,
                id: 'gpFondo',
                stripeRows: true,
                frame: false,
                //loadMask: true,
                region: 'center',
                autoExpandColumn: 'descripcion',
                store: this.stFondo,
                sm: this.smFondo = new Ext.grid.CheckboxSelectionModel({
                    singleSelect: false
                }),
                columns: [
                    this.smFondo,
                    {
                        hidden: true,
                        hideable: false,
                        id: 'idfondo',
                        dataIndex: 'idfondo'
                    }, {
                        sortable: true,
                        width: 70,//(Ext.lib.Dom.getViewWidth() - 10) * 0.1,
                        header: this.idioma.lbCodigo,
                        hideable: true,
                        dataIndex: 'codigo'
                    }, {
                        header: this.idioma.lbDenominacion,
                        sortable: true,
                        hideable: true,
                        width: 200,//(Ext.lib.Dom.getViewWidth() - 10) * 0.3,
                        id: 'denominacion',
                        dataIndex: 'denominacion'
                    }, {
                        header: this.idioma.lbDescripcion,
                        sortable: true,
                        width: 100,//(Ext.lib.Dom.getViewWidth() - 10) * 0.6,
                        hideable: true,
                        id: 'descripcion',
                        dataIndex: 'descripcion'
                    }, {
                        header: this.idioma.lbAsociado,
                        dataIndex: 'idcajafondo',
                        width: 70,
                        //sortable: false,
                        resizable: false,
                        align: 'center',
                        //hideable: false,
                        menuDisabled: true,
                        renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                            var urlImg = me.perfil.dirImg + 'asociar.png';
                            if (value > 1) {
                                var caja = me.scope.panelCaja.smCaja.getSelected().data.denominacion;
                                metadata.css = 'icondistra-asociar azul';
                                metadata.attr = "ext:qtip='<b>" + me.idioma.lbAsociadoA + caja + "</b>'";
                            }
                        }
                    }, {
                        header: this.idioma.lbAperturado,
                        dataIndex: 'idaperturafondo',
                        width: 70,
                        //sortable: false,
                        resizable: false,
                        align: 'center',
                        //hideable: false,
                        menuDisabled: true,
                        renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                            if (value > 1) {
                                var caja = me.scope.panelCaja.smCaja.getSelected().data.denominacion;
                                metadata.css = 'icondistra-facturar rojo';
                                metadata.attr = "ext:qtip='<b>" + me.idioma.lbAperturadoEn + caja + "</b>'";
                            }
                        }
                    }, {
                        header: this.idioma.lbMoneda,
                        sortable: true,
                        width: 50,
                        hideable: true,
                        dataIndex: 'nommoneda'
                    }, {
                        header: this.idioma.lbSaldoFondo,
                        dataIndex: 'saldoactualmo',
                        width: 100,
                        sortable: false,
                        resizable: false,
                        align: 'right',
                        //hideable: false,
                        menuDisabled: true,
                        renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                            if (value < 0) {
                                return '(' + formatoMonedaABS(value) + ')';
                            } else return formatoMoneda(value);
                        }
                    }, {
                        header: this.idioma.lbSaldoCuenta,
                        dataIndex: 'saldocuenta',
                        width: 100,
                        sortable: false,
                        resizable: false,
                        align: 'right',
                        //hideable: false,
                        menuDisabled: true,
                        renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                            if (value < 0) {
                                return '(' + formatoMonedaABS(value) + ')';
                            } else return formatoMoneda(value);
                        }
                    }, {
                        header: this.idioma.lbCuenta,
                        dataIndex: 'nomcuenta',
                        width: 250,
                        sortable: false,
                        resizable: false,
                        align: 'left',
                        //hideable: false,
                        menuDisabled: true
                    }],
                /* viewConfig: {
                 forceFit: true
                 },*/
                forceFit: true,
                tbar: [this.searchField],
                bbar: this.pagToolFondo = new Ext.Cont.PagingToolbar({
                    pageSize: 15,
                    store: this.stFondo,
                    displayInfo: true,
                    displayMsg: this.idioma.lbDisplayMsg,
                    emptyMsg: this.idioma.lbEmptyMsg,
                    firstText: this.idioma.lbPrimeraPagina,
                    lastText: this.idioma.lbUltimaPagina
                })
            }
        );
        //Para pintar la fila de verde cuando este en uso el fondo
        /*this.gpFondo.getView().getRowClass = function (record, index, rowParams, store) {
         if (record.json.idcaja) {//Asociado a la caja seleccionada
         return 'FilaVerde';
         }
         };*/
        this.items = [this.gpFondo];
    }
});

//--Componente Window Fondo
Caja.GestFondo.WindowFondo = Ext.extend(Ext.Window, {
    constructor: function (params) {

        Ext.apply(this, params);
        Ext.apply(this, {
            // width: Ext.lib.Dom.getViewWidth() * 0.40,
            width: 500,
            modal: true,
            autoValidate: true,
            constrain: true,
            resizable: false,
            closeAction: 'close',
            frame: true,
            idioma: params.idioma,
            perfil: params.perfil,
            id: 'windowFondo'
        });
        this.createButtons();
        this.createForm();
        this.initFunctions();
        this.initEventos();

        Caja.GestFondo.WindowFondo.superclass.constructor.call(this);
    },
    initEventos: function () {
        this.btnAceptar.on({
            scope: this,
            click: function () {
                this.saveFondo(false);
            }
        });
        this.btnAplicar.on({
            scope: this,
            click: function () {
                this.saveFondo(true);
            }
        });
        //-------
        this.cbTipoFondo.on({
            scope: this,
            select: function (cb, record) {
                var newValue = cb.getValue();
                if (newValue == 1) {//Pagos menores
                    this.cbFormaPago.setValue(1);
                    this.cbFormaPago.disable();
                }
                if (newValue == 2) {//Ingreso
                    this.cbFormaPago.clearValue();
                    this.cbFormaPago.enable();
                    this.cbFormaPago.allowBlank = false;
                    this.cbFormaPago.markInvalid();
                }
                if (newValue == 3) {//Dieta divisa
                    this.cbFormaPago.setValue(1);
                    this.cbFormaPago.disable();
                }
                if (newValue == 4) {//Para cambio
                    this.cbFormaPago.setValue(1);
                    this.cbFormaPago.disable();
                }
                if (newValue == 5) {//Para nominacaja
                    this.cbFormaPago.setValue(1);
                    this.cbFormaPago.disable();
                }
                if (newValue == 7) {//Sellos de timbre
                    this.cbFormaPago.setValue(3);
                    this.cbFormaPago.disable();
                }
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
            //icon: perfil.dirImg + 'aplicar.png',
            iconCls: 'aplicar',
            text: this.idioma.lbAplicar,
            tooltip: this.idioma.lbToolAplicar,
            handler: function () {

            }
        });
        this.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            //icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            text: this.idioma.lbAceptar,
            tooltip: this.idioma.lbToolAceptar,
            handler: function () {

            }
        });
        this.buttons = [this.btnCancelar, this.btnAplicar, this.btnAceptar];
    },
    createForm: function () {

        this.tfCodigo = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            id: 'tfCodigo',
            name: 'codigo',
            maxLength: 8,
            maxLengthText: "El tamaño máximo requerido es 8 caracteres.",
            enableKeyEvents: true,
            maskRe: /^([0-9\(1)]+ ?[0-9]*)+$/,
            regex: /^([0-9\(1)]+ ?[0-9]*)+$/,
            allowBlank: false,
            allowDecimals: false,
            fieldLabel: this.idioma.lbCodigo,
            anchor: '95%',
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.tfDenominacion.focus();
                }
            }
        });

        this.tfDenominacion = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: this.idioma.lbDenominacion,
            allowBlank: false,
            enableKeyEvents: true,
            maxLength: 50,
            maxLengthText: "El tamaño máximo requerido es 50 caracteres.",
            maskRe: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\/\s\-]+$/,
            regex: /^([0-9a-zA-Z\"\-\_\/\(\)\xf3\xf1\xe1\xe9\xed\xfa\xd1-]+ ?)+$/, //CF
            id: 'tfDenominacion',
            name: 'denominacion',
            anchor: '100%',
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.taDescripcion.focus();
                },
                //invalid: function (cmp, msg) {
                //    if (cmp.getValue().length > 0) {
                //        var vtext = cmp.getValue().trim();
                //        cmp.setValue(vtext);
                //    }
                //},
                blur: function (cmp) {
                    if (cmp.getValue().length > 0) {
                        var vtext = cmp.getValue().trim();
                        cmp.setValue(vtext);
                    }
                }
            }
        });

        // this.taDescripcion = new Ext.form.TextArea({
        this.taDescripcion = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: this.idioma.lbDescripcion,
            id: 'taDescripcion',
            name: 'descripcion',
            allowBlank: false,
            maxLength: 255,
            maxLengthText: "El tamaño máximo requerido es 255 caracteres.",
            maskRe: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xda\xfc\.\#\/\s\,\%\-]+$/,
            regex: /^([0-9a-zA-Z\"\-\_\/\(\)\.\,\xf3\xf1\xe1\xe9\xed\xfa\xda\xd1-]+ ?)+$/,
            enableKeyEvents: true,
            anchor: '100%',
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.tfDocAprueba.focus();
                },
                blur: function (cmp) {
                    if (cmp.getValue().length > 0) {
                        var vtext = cmp.getValue().trim();
                        cmp.setValue(vtext);
                    }
                }
            }
        });

        this.tfDocAprueba = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: this.idioma.lbDocAprueba,
            allowBlank: true,
            maxLength: 50,
            maxLengthText: this.idioma.lbMaxLength50,
            maskRe: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xda\xfc\.\#\/\s\,\%\-]+$/,
            regex: /^([0-9a-zA-Z\"\-\_\/\(\)\.\,\xf3\xf1\xe1\xe9\xed\xfa\xda\xd1-]+ ?)+$/,
            id: 'tfDocAprueba',
            name: 'docaprueba',
            anchor: '95%',
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.dfFechaAprueba.focus();
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

        this.dfFechaAprueba = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            id: 'dfFechaAprueba',
            name: 'fechaaprueba',
            fieldLabel: this.idioma.lbFechaAprobacion,
            allowBlank: true,
            invalidText: this.idioma.lbInvalidFecha,
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            anchor: '100%',
            maxValue: new Date(),
            enableKeyEvents: true,
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.cbTipoFondo.focus();
                }
            }
        });
        //-------------------------------

        this.cbFormaPago = new Ext.form.ComboBox({
            fieldLabel: this.idioma.lbFormaPago,
            store: this.scope.panelFondo.stFormaPago,
            name: 'idformapago',
            valueField: 'idformapago',
            hiddenName: 'idformapago',
            displayField: 'denominacion',
            emptyText: this.idioma.lbSeleccione,
            disabledClass: 'disabled-component',
            editable: false,
            forceSelection: true,
            allowBlank: false,
            blankText: this.idioma.lbBlankText,
            resizable: true,
            triggerAction: 'all',
            anchor: '100%',
            mode: 'local',
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        this.cbTipoFondo = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            fieldLabel: this.idioma.lbTipoFondo,
            emptyText: 'Seleccione...',
            editable: false,
            name: 'tipofondo',
            allowBlank: false,
            store: new Ext.data.SimpleStore({
                fields: ['tipofondo', 'nomfondo'],
                data: [[1, 'Pagos menores'], [2, 'Por depositar'], /*[3, 'Dieta en divisa'],*/ [4, 'Para cambio'], [5, 'Por nómina'], [7, 'Sellos de timbre']/*, [6, 'Limite de caja'], */]
            }),
            valueField: 'tipofondo',
            displayField: 'nomfondo',
            hiddenName: 'tipofondo',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            anchor: '95%',
            enableKeyEvents: true
        });

        this.formFondo = new Ext.FormPanel({
            id: 'formFondo',
            frame: true,
            region: 'north',
            layout: 'fit',
            autoHeight: true,
            labelWidth: 50,
            labelAlign: 'top',
            trackResetOnLoad: true,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .5,
                    layout: 'form',
                    items: [this.tfCodigo]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    items: [this.tfDenominacion]
                }, {
                    layout: 'form',
                    columnWidth: .5,
                    style: 'margin:0 0 0 0',
                    items: [this.cbTipoFondo]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    style: 'margin:0 0 0 0',
                    items: [this.cbFormaPago]
                }, {
                    columnWidth: 1,
                    layout: 'form',
                    items: [this.taDescripcion]
                }]
            }]
        });

        this.items = [this.formFondo];
    },
    initFunctions: function () {
        var me = this;
        this.cargarWinModFondo = function (select) {
            this.formFondo.getForm().loadRecord(select);
            if (select.data.asociado) {
                this.tfCodigo.setDisabled(true);
                this.tfDenominacion.setDisabled(true);
                this.cbTipoFondo.setDisabled(true);
                this.cbFormaPago.setDisabled(true);
                // if (this.tfDocAprueba.getValue() != '')
                //     this.tfDocAprueba.setDisabled(true);
                // if (this.dfFechaAprueba.getValue() != '')
                //     this.dfFechaAprueba.setDisabled(true);
            }
            me.idfondo = select.data.idfondo;
        };

        this.saveFondo = function (aplicar) {

            if (this.formFondo.getForm().isValid()) {

                var msgSuccess = (!me.idfondo) ? this.idioma.lbAddFondoSatisfat : this.idioma.lbModFondoSatisfat;

                Ext.Msg.wait(this.idioma.lbGuardando, this.idioma.lbEspere);
                Ext.Ajax.request({
                    url: 'savefondo',
                    params: {
                        idfondo: me.idfondo,
                        codigo: this.tfCodigo.getValue(),
                        denominacion: this.tfDenominacion.getValue(),
                        descripcion: this.taDescripcion.getValue(),
                        // docaprueba: this.tfDocAprueba.getValue(),
                        // fechaaprueba: this.dfFechaAprueba.getRawValue(),
                        tipofondo: this.cbTipoFondo.getValue(),
                        idformapago: this.cbFormaPago.getValue() > 0 ? this.cbFormaPago.getValue() : null
                    },
                    callback: function (options, success, response) {
                        var respuesta = Ext.decode(response.responseText);

                        if (respuesta.codM == '1') {
                            mostrarMensaje(1, msgSuccess);
                            if (!me.btnAplicar.isVisible() || !aplicar) {
                                me.close();
                            } else if (aplicar) {
                                me.formFondo.getForm().reset();
                            }
                        } else if (respuesta.codM == '2') {
                            mostrarMensaje(1, me.idioma.lbCodFondoExist);
                            me.btnAplicar.disable();
                            me.btnAceptar.disable();
                            me.tfCodigo.reset();
                        }
                        Ext.MessageBox.hide();
                        me.scope.panelFondo.stFondo.reload();
                    }
                });
            }
        };
    }
});

//--Componete Panel Operaciones
Caja.GestFondo.PanelOperaciones = Ext.extend(Ext.Panel, {
    constructor: function (params) {
        Ext.apply(this, params);
        Ext.apply(this, {
            region: 'center',
            layout: 'border',
            border: false,
            frame: false,
            idioma: params.idioma,
            perfil: params.perfil,
            id: 'PanelOperaciones'
        });
        this.createGrid();
        this.initEventos();
        this.initFunctions();

        Caja.GestFondo.PanelOperaciones.superclass.constructor.call(this);
    },
    initEventos: function () {
        this.stOperaciones.on({
            scope: this,
            load: function () {
                for (var i = 0; i < this.stOperaciones.getCount(); i++) {
                    if (this.stOperaciones.getAt(i).data.check == true)
                        this.smOperaciones.selectRow(i, true);
                }
            }
        });
        this.btnGuardar.on({
            scope: this,
            click: function () {
                if (this.scope.id == 'windowTalonario')
                    this.scope.asocDesOperacionTalonario();
                else
                    this.saveOperacionCajaFondo();
            }
        });
    },
    createGrid: function () {

        this.rdOperaciones = new Ext.data.JsonReader({
            root: 'datos',
            totalProperty: 'cant'
        }, [{
            name: 'denominacion'
        }, {
            name: 'codigooperacion'
        }, {
            name: 'idnomoperaciones'
        }, {
            name: 'idcajafondooperacion'
        }, {
            name: 'idtalonariooperacion'
        }, {
            name: 'idmodelo'
        }, {
            name: 'check'
        }]);

        this.stOperaciones = new Ext.data.Store({
            url: 'cargaroperaciones',
            reader: this.rdOperaciones,
            scope: this
        });

        this.gpOperaciones = new Ext.grid.GridPanel({
                id: 'gpOperaciones',
                stripeRows: true,
                border: false,
                frame: true,
                loadMask: true,
                layout: 'fit',
                region: 'center',
                autoExpandColumn: 'denominacion',
                store: this.stOperaciones,
                sm: this.smOperaciones = new Ext.grid.CheckboxSelectionModel({
                    singleSelect: false
                }),
                columns: [
                    this.smOperaciones,
                    {
                        hidden: true,
                        hideable: false,
                        id: 'idnomoperaciones',
                        dataIndex: 'idnomoperaciones'
                    }, {
                        header: this.idioma.lbDenominacion,
                        sortable: true,
                        hideable: true,
                        width: 200,
                        id: 'denominacion',
                        dataIndex: 'denominacion',
                        renderer: function (v, m, r) {
                            m.attr = ' ext:qtip="';
                            m.attr += '<b>' + r.data.denominacion + '</br>';
                            m.attr += '"';
                            return v;
                        }
                    }
                ],
                viewConfig: {
                    forceFit: true
                },
                bbar: ['->',
                    this.btnGuardar = new Ext.Button({
                        disabled: false,
                        id: 'btnGuardar',
                        iconCls: 'guardar',
                        text: this.idioma.lbGuardar,
                        tooltip: this.idioma.lbToolGuardar
                    })]
            }
        );
        this.items = this.gpOperaciones;
    },
    initFunctions: function () {
        this.saveOperacionCajaFondo = function () {

            var arrayOperaciones = new Array();
            var arrayOperacionesSelection = this.smOperaciones.getSelections();
            var arrayOperacionesStore = this.stOperaciones;

            for (var i = 0; i < arrayOperacionesStore.getCount(); i++) {
                var encontrado = false;
                for (j = 0; j < arrayOperacionesSelection.length; j++) {
                    if (arrayOperacionesStore.getAt(i).data.idnomoperaciones == arrayOperacionesSelection[j].data.idnomoperaciones) {
                        if (!arrayOperacionesStore.getAt(i).data.check) {
                            arrayOperaciones.push({//Para marcar
                                idoperacion: arrayOperacionesSelection[j].data.idnomoperaciones,
                                check: true
                            });
                        }
                        encontrado = true;
                    }
                }
                if (arrayOperacionesStore.getAt(i).data.check && !encontrado) {
                    arrayOperaciones.push({//Para desmarcar
                            idoperacion: arrayOperacionesStore.getAt(i).data.idnomoperaciones,
                            idcajafondooperacion: arrayOperacionesStore.getAt(i).data.idcajafondooperacion,
                            check: false
                        }
                    );
                }
            }

            if (arrayOperaciones.length)
                var msgSuccess = this.idioma.lbGuardSatisfat;
            else {
                var msgSuccess = this.idioma.lbGuardNo;
                mostrarMensaje(1, msgSuccess);
                return;
            }

            Ext.Ajax.request({
                url: 'saveoperacionescajafondo',
                scope: this,
                params: {
                    idcajafondo: this.scope.panelFondo.smFondo.getSelected().data.idcajafondo,
                    arrayoperaciones: Ext.encode(arrayOperaciones)
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);

                    if (respuesta.codM == '1') {
                        mostrarMensaje(1, msgSuccess);
                    } else if (respuesta.codM == '2') {
                        // most  rarMensaje(1, me.idioma.lbCodFondoExist);
                    }
                    this.stOperaciones.reload();
                    Ext.MessageBox.hide();
                }
            });
        };
    }
});

//--Componente Window Apertura
Caja.GestFondo.WindowApertura = Ext.extend(Ext.Window, {
    constructor: function (params) {

        Ext.apply(this, params);
        Ext.apply(this, {
            //height: Ext.lib.Dom.getViewHeight() * 0.25,
            //width: Ext.lib.Dom.getViewWidth() * 0.30,
            //height: 230,
            width: 500,
            constrain: true,
            title: params.idioma.lbTitleApertura,
            modal: true,
            resizable: false,
            closeAction: 'close',
            frame: true,
            idioma: params.idioma,
            perfil: params.perfil,
            id: 'windowApertura',
            contTemp: 0,
            listeners: {
                show: function () {
                    this.scope.scope.keyMapa.disable();
                    this.btnAceptar.getEl().addKeyMap([
                        {
                            key: Ext.EventObject.TAB,
                            stopEvent: true,
                            scope: this,
                            fn: function () {
                                this.tfDocAprueba.focus(true, true);
                            }
                        }
                    ]);
                    //Agregando un keymap al tfcodigo
                    this.tfDocAprueba.getEl().addKeyMap({
                        key: Ext.EventObject.TAB,
                        shift: true,
                        stopEvent: true,
                        scope: this,
                        fn: function () {
                            this.btnAceptar.focus();
                        }
                    });
                    this.formApertura.getForm().isValid();
                },
                close: function () {
                    this.scope.scope.stopTaskValidForm();
                    this.scope.scope.keyMapa.enable();
                }
            }
        });
        this.createButtons();
        this.createForm();
        this.initFunctions();
        this.initEventos();

        Caja.GestFondo.WindowApertura.superclass.constructor.call(this);
    },
    initEventos: function () {
        var me = this;

        this.btnAceptar.on({
            scope: this,
            click: function () {
                //Verifica si se a modificado el saldo aprobado
                if (me.scope.smFondo.getSelected().data.idaperturafondo) {
                    var diferenciaAprobado = parseFloat(this.tfSaldoAprobado.getValue()) - parseFloat(this.tfSaldoAprobado.originalValue);
                    if (diferenciaAprobado > 0) {
                        mostrarMensaje(2, 'Se ha aumentado el saldo aprobado en ' + formatoMoneda(diferenciaAprobado) + '. ¿Está seguro que quiere continuar?', function (btnPress) {
                            if (btnPress === 'ok') {
                                me.aperturarFondo(diferenciaAprobado);
                            }
                        });
                    } else if (diferenciaAprobado < 0) {
                        mostrarMensaje(2, 'Se ha disminuido el saldo aprobado en ' + formatoMoneda(Math.abs(diferenciaAprobado)) + '. ¿Está seguro que quiere continuar?', function (btnPress) {
                            if (btnPress === 'ok') {
                                me.aperturarFondo(diferenciaAprobado);
                            }
                        });
                    } else {
                        me.aperturarFondo(0);
                    }
                } else {
                    me.aperturarFondo(0);
                }
            }
        });
        this.stMoneda.on({
            scope: this,
            load: function () {
                if (this.contTemp == 1) {
                    if (this.scope.smFondo.getSelected().data.idaperturafondo) {
                        this.cargarDatosApertura(this.scope.smFondo.getSelected().data.aperturafondo);
                    }
                    me.lMask.hide();
                } else
                    this.contTemp++;
            }
        });
        this.stCuenta.on({
            scope: this,
            load: function () {
                if (this.contTemp == 1) {
                    if (this.scope.smFondo.getSelected().data.idaperturafondo && !this.cbxCuenta.getValue()) {
                        this.cargarDatosApertura(this.scope.smFondo.getSelected().data.aperturafondo);
                    }
                    me.lMask.hide();
                } else
                    this.contTemp++;
            }
        });
        this.cbxCuenta.on({
            scope: this,
            select: function (cb, record) {
                this.lMaskCargando();
                // var index = this.scope.stFondo.find('nomcuenta', record.data.text);
                this.buscarSaldoCuenta(this.cbxCuenta.getValue());
                this.cbMoneda.setValue(record.data.idmoneda);

            }
        });

        this.tfSaldoAprobado.on({
            blur: function (nf) {
                if (me.tfSaldoAprobado.getValue() > 0)
                    me.tfSaldoAprobado.setRawValue(parseFloat(me.tfSaldoAprobado.getValue()).toFixed(2));
            },
            specialkey: function (tf, e) {
                if (e.getCharCode() == Ext.EventObject.ENTER)
                    this.btnAceptar.focus();
            }
        });
    },
    createButtons: function () {
        this.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            //icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            //disabled: true,
            text: this.idioma.lbCancelar,
            tooltip: this.idioma.lbToolCancelar,
            scope: this,
            tabIndex: 6,
            handler: function () {
                this.close();
            }
        });
        this.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            //icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            text: this.idioma.lbAceptar,
            tabIndex: 7,
            tooltip: this.idioma.lbToolAceptar
        });
        this.buttons = [this.btnCancelar, this.btnAceptar];
    },
    createForm: function () {
        var me = this;
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
            disabled: true,
            name: 'moneda',
            id: 'cbMoneda',
            selectOnFocus: true,
            editable: true,
            emptyText: this.idioma.lbSeleccione,
            width: 50,
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
            anchor: '100%',
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.cbxCuenta.focus();
                }
            }
        });

        this.stCuenta = new Ext.data.Store({
            url: 'cargarcuentas',
            autoLoad: true,
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
            listHeight: 200,
            tabIndex: 4,
            anchor: '98%',
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.tfSaldoAprobado.focus();
                }
            }
        });
//------------------------------------
        this.tfDocAprueba = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: this.idioma.lbDocAprueba,
            allowBlank: false,
            maxLength: 50,
            tabIndex: 1,
            maskRe: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xda\xfc\#\/\s\,\-]+$/,
            regex: /^([0-9a-zA-Z\"\-\_\/\(\)\,\xf3\xf1\xe1\xe9\xed\xfa\xda\xd1-]+ ?)+$/,
            maxLengthText: this.idioma.lbMaxLength50,
            id: 'tfDocAprueba',
            name: 'docaprueba',
            anchor: '98%',
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.dfFechaAprueba.focus();
                },
                beforerender: function (tf, e) {
                    this.tfDocAprueba.focus(true, 100);
                }
            }
        });

        this.dfFechaAprueba = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            id: 'dfFechaAprueba',
            name: 'fechaaprueba',
            tabIndex: 2,
            fieldLabel: this.idioma.lbFechaAprobacion,
            allowBlank: false,
            invalidText: this.idioma.lbInvalidFecha,
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            anchor: '100%',
            maxValue: new Date(),
            enableKeyEvents: true,
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.cbMoneda.focus();
                }
            }
        });

        this.tfSaldoAprobado = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: this.idioma.lbSaldoAprobado,
            allowBlank: true,
            maxLength: 19,
            emptyText: '0.00',
            decimalPrecision: 2,
            tabIndex: 5,
            allowDecimals: true,
            style: 'text-align: right',
            maskRe: /^[0-9.\,]+$/,
            regex: /^\d+(\.\d{1,2})?$/,
            //maxLengthText: this.idioma.lbMaxLength50,
            id: 'tfSaldoAprobado',
            name: 'saldoaprobadomo',
            anchor: '95%'
        });

        this.tfSaldoCuenta = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: this.idioma.lbSaldoCuenta,
            readOnly: true,
            disabled: true,
            allowDecimals: true,
            decimalPrecision: 2,
            emptyText: '0.00',
            style: 'text-align: right',
            //maxLengthText: this.idioma.lbMaxLength50,
            id: 'tfSaldoCuenta',
            name: 'saldocuenta',
            anchor: '100%',
            listeners: {
                scope: this,
                blur: function (nf) {
                    me.tfSaldoCuenta.setRawValue(me.redondearValor(me.tfSaldoCuenta.getValue()));
                }
            }
        });

        this.formApertura = new Ext.FormPanel({
            id: 'formApertura',
            frame: true,
            region: 'north',
            layout: 'fit',
            autoHeight: true,
            labelWidth: 50,
            labelAlign: 'top',
            trackResetOnLoad: true,
            items: [{
                layout: 'form',
                items: [{
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .75,
                            layout: 'form',
                            items: [this.tfDocAprueba]
                        }, {
                            columnWidth: .25,
                            layout: 'form',
                            items: [this.dfFechaAprueba]
                        }]
                }, {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .75,
                            layout: 'form',
                            items: [this.cbxCuenta]
                        }, {
                            columnWidth: .25,
                            layout: 'form',
                            items: [this.cbMoneda]
                        }]
                }, {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.tfSaldoAprobado]
                        }, {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.tfSaldoCuenta]
                        }]
                }]
            }]
        });

        this.items = [this.formApertura];
    },
    initFunctions: function () {
        var me = this;

        this.lMaskCargando = function () {
            this.lMask = new Ext.LoadMask(this.body, {//body de la ventana
                msg: this.idioma.lbCargando
            });
            this.lMask.show();
        };

        this.cargarDatosApertura = function (apertura) {
            this.formApertura.getForm().setValues(apertura);
            this.tfSaldoAprobado.fireEvent('blur');
            this.tfSaldoCuenta.fireEvent('blur');
            this.cbMoneda.setValue(apertura.idmoneda);
            this.cbxCuenta.setValue(apertura.idcuenta, apertura.nomcuenta);
            this.cbxCuenta.originalValue = apertura.idcuenta;
            this.autoValidate = false;
            this.btnAceptar.setDisabled(true);
            me.scope.scope.startTaskValidForm(this.formApertura.getForm(), 'mod', [this.btnAceptar]);
        };
        this.aperturarFondo = function (diferenciaAprobado) {
            //-----------------------------------------
            if (this.formApertura.getForm().isValid()) {
                var msgSuccess = (me.scope.smFondo.getSelected().data.idaperturafondo) ? this.idioma.lbModAperturaSatisfac : this.idioma.lbAddAperturaSatisfac;
                Ext.Msg.wait(this.idioma.lbGuardando, this.idioma.lbEspere);
                Ext.Ajax.request({
                    url: 'aperturarfondo',
                    params: {
                        idaperturafondo: (me.scope.smFondo.getSelected().data.idaperturafondo) ? me.scope.smFondo.getSelected().data.idaperturafondo : 0,
                        idcajafondo: this.idcajafondo,
                        idmoneda: this.cbMoneda.getValue(),
                        idmonedaentidad: this.stMoneda.getAt(this.stMoneda.find('idmoneda', this.cbMoneda.getValue())).data.idmonedaentidad,
                        idcuenta: this.cbxCuenta.getValue(),
                        docaprueba: this.tfDocAprueba.getValue(),
                        fechaaprueba: this.dfFechaAprueba.getRawValue(),
                        saldoaprobado: this.tfSaldoAprobado.getValue() > 0 ? this.tfSaldoAprobado.getValue() : 0,
                        diferenciaAprobado: diferenciaAprobado
                    },
                    callback: function (options, success, response) {
                        var respuesta = Ext.decode(response.responseText);

                        if (respuesta.codM == '1') {
                            mostrarMensaje(1, msgSuccess);
                            me.scope.stFondo.reload();
                            me.close();
                        } else if (respuesta.codM == '-1') {
                            mostrarMensaje(1, me.idioma.lbAperturaTasa);
                        } else if (respuesta.codM == '-2') {
                            mostrarMensaje(1, me.idioma.lbAperturaOperAsoc);
                        }
                        Ext.MessageBox.hide();
                    }
                });
            }
        };

        this.buscarSaldoCuenta = function (idCuenta) {
            Ext.Ajax.request({
                url: 'buscarsaldocuenta',
                scope: this,
                params: {
                    idcuenta: idCuenta,
                    idCajaFondo: this.idcajafondo,
                    verificar: true
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.codM == '-1') {
                        mostrarMensaje(1, me.idioma.lbCtaEnUso);
                        me.cbxCuenta.reset();
                    } else
                        this.tfSaldoCuenta.setRawValue(this.redondearValor(respuesta.saldocuenta));
                    this.lMask.hide();
                }
            });
        };

        this.redondearValor = function (v) {
            var expo = (Math.pow(10, v))
            v = (Math.round((v - 0) * 100)) / 100;
            v = (v < 0) ? v * (-1) : v;

            if (isNaN(v))
                return '0.00';
            return v.toFixed(2);
        };
    }
});

//--Componete Panel Talonario
Caja.GestFondo.PanelTalonario = Ext.extend(Ext.Panel, {
    constructor: function (params) {

        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            border: false,
            frame: false,
            idioma: params.idioma,
            perfil: params.perfil,
            id: 'panelTalonario'
        });
        this.createGrids();
        this.initFunctions();
        this.initEventos();

        Caja.GestFondo.PanelTalonario.superclass.constructor.call(this);
    },
    initEventos: function () {
        var me = this;

        this.rowaction.on('action', function (grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'eliminar':
                    mostrarMensaje(2, me.idioma.lbPregEliminarTal, function (btnPress) {
                        if (btnPress === 'ok') {
                            me.deleteTalonario();
                        }
                        //me.scope.keyMapa.enable();
                    });
                    me.roweditor.stopEditing(true);
            }
        });

        this.cbDocumento.on({
            scope: this,
            select: function (combo, record, index) {
                var index = this.stTalonario.find('iddocumentos', record.data.iddoc);
                if (index >= 0 && record.data.iddoc != '') {
                    // var recTal = new Ext.data.Record({
                    var recTal = new this.recordTalonario({
                        iddocumentos: record.data.iddoc,
                        numinicio: parseInt(this.stTalonario.getAt(index).data.numfin) + 1,
                        numfin: '',
                        disponibles: 0
                    });
                    this.roweditor.stopEditing();
                    this.stTalonario.insert(0, recTal);
                    this.gpTalonario.getView().refresh();
                    this.roweditor.startEditing(0, 2);
                    // this.nfNumInicio.disable();
                    this.nfNumFin.enable();
                } else {
                    this.nfNumInicio.enable();
                    this.nfNumInicio.reset();
                }
            }
        });
    },
    initFunctions: function () {

        var me = this;

        this.lMaskCargando = function () {
            this.lMask = new Ext.LoadMask(this.body, {//body de la ventana
                msg: this.idioma.lbCargando
            });
            this.lMask.show();
        };

        this.roweditor.on({
            scope: this,
            afteredit: function (editor, grid, changes, record, rowIndex) {
                if (parseInt(record.data.numinicio) > parseInt(record.data.numfin)) {
                    mostrarMensaje(1, me.idioma.lbErrorNunFin);
                } else {
                    me.saveTalonario();
                }
            },
            beforeedit: function (editor, grid, record, rowIndex) {
                this.nfNumInicio.enable();
                this.nfNumFin.enable();
                if (this.stTalonario.find('idmodelo', record.data.idmodelo, rowIndex) == -1) {
                    this.nfNumInicio.enable();
                    this.nfNumFin.enable();
                } else if (((parseInt(record.data.numinicio) - parseInt(record.data.numfin)) * (-1) + 1) != parseInt(record.data.disponible)) {
                    this.nfNumInicio.disable();
                    this.nfNumFin.disable();
                } else {
                    if (this.stTalonario.find('idmodelo', record.data.idmodelo) < rowIndex) {
                        this.nfNumFin.disable();
                    }
                    if (this.stTalonario.find('idmodelo', record.data.idmodelo, rowIndex + 1) > 0) {
                        this.nfNumInicio.disable();
                    }
                }
            }
        });

        this.deleteTalonario = function () {
            var id = new Array();
            var seleccionado = this.gpTalonario.getSelectionModel().getSelected();

            var msgSuccess = this.idioma.lbDelCTalSatisfat;
            var lbDelAsocError = this.idioma.lbDelAsocError;


            Ext.Ajax.request({
                method: "POST",
                url: "deletetalonario",
                params: {
                    idtalonario: seleccionado.data.idtalonario
                },
                scope: this,
                callback: function (options, success, response) {

                    var respuesta = Ext.decode(response.responseText);
                    this.gpTalonario.getStore().commitChanges();
                    if (respuesta.codM == '1') {
                        seleccionado.commit();
                        this.gpTalonario.getStore().remove(seleccionado);
                        mostrarMensaje(1, msgSuccess);
                    } else mostrarMensaje(1, lbDelAsocError);
                }
            });

        };

        this.saveTalonario = function () {

            var arrayTalonarios = this.gpTalonario.getStore().getModifiedRecords();
            var newTalonarios = new Array();

            for (i = 0; i < arrayTalonarios.length; i++) {
                newTalonarios.push({
                    idtalonario: arrayTalonarios[i].data.idtalonario,
                    iddocumentos: arrayTalonarios[i].data.iddocumentos,
                    numinicio: arrayTalonarios[i].data.numinicio,
                    numfin: arrayTalonarios[i].data.numfin,
                    idcajafondo: this.scope.panelFondo.smFondo.getSelected().data.idcajafondo
                });
            }

            var msgSuccess = (newTalonarios[0].idtalonario > 1) ? this.idioma.lbModCTalSatisfat : this.idioma.lbAddCTalSatisfat;

            Ext.Ajax.request({
                method: "POST",
                url: "savetalonario",
                params: {
                    arraytalonarios: Ext.encode(newTalonarios)
                },
                scope: this,
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    this.gpTalonario.getStore().commitChanges();
                    mostrarMensaje(respuesta.codMsg, msgSuccess);
                    this.gpTalonario.getStore().reload();
                }
            });
        };
    },
    createGrids: function () {
        var me = this;

        //Combo Modelo
        this.stDocumento = new Ext.data.Store({
            url: 'cargardocumentos',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'iddoc', mapping: 'iddocumentos'},
                {name: 'denominacion'}
            ])
        });

        this.cbDocumento = new Ext.form.ComboBox({
            name: 'cbDocumento',
            id: 'cbDocumento',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            editable: true,
            emptyText: this.idioma.lbSeleccione,
            width: 50,
            allowBlank: false,
            store: this.stDocumento,
            valueField: 'iddoc',
            displayField: 'denominacion',
            enableKeyEvents: true,
            typeAhead: true,
            readOnly: true,
            mode: 'local',
            triggerAction: 'all',
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.nfNumInicio.focus();
                }
            }
        });

        this.recordTalonario = Ext.data.Record.create([
            {name: 'numinicio', type: 'int'},
            {name: 'numfin', type: 'int'},
            {name: 'disponible', type: 'int'},
            {name: 'iddocumentos', type: 'int'}
        ]);

        this.roweditor = new Ext.Cont.RowEditor({
            id: 'idRoweditor',
            cancelText: this.idioma.lbCancelar,
            saveText: this.idioma.lbAceptar,
            iconClsSave: 'aceptar',
            iconClsCancel: 'cancelar',
            saveTooltip: this.idioma.lbToolRowEditorAceptar,
            cancelTooltip: this.idioma.lbToolRowEditorCancelar
        });

        this.rowaction = new Ext.grid.RowActions({
            id: 'idRowaction',
            actions: [
                {
                    id: 'eliminar',
                    tooltip: this.idioma.lbDelTalonario,
                    iconCls: 'eliminar',
                    marginLeft: 5,
                    width: 16,
                    height: 16
                }
            ]
        });

        this.stTalonario = new Ext.data.Store({
            url: 'cargartalonarios',
            scope: this,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idtalonario'},
                {name: 'iddocumentos', mapping: 'idtipodocumento'},
                {name: 'numinicio', mapping: 'numeroinicio'},
                {name: 'numfin', mapping: 'numerofin'},
                {name: 'numerofin'},
                {name: 'disponible'}
            ]),
            sortInfo: {field: 'idtalonario', direction: 'DESC'}
        });

        this.gpTalonario = new Ext.grid.EditorGridPanel({
            idioma: this.idioma,
            perfil: this.perfil,
            //title: this.idioma.lbGetTalonario,
            id: 'gpTalonario',
            stripeRows: true,
            border: false,
            frame: false,
            clicksToEdit: 2,
            loadMask: true,
            store: this.stTalonario,
            autoExpandColumn: 'iddocumento',
            columns: [
                {
                    id: 'iddocumento',
                    header: this.idioma.lbTipoDocumento,
                    dataIndex: 'iddocumentos',
                    //width: 200,
                    align: 'left',
                    editor: this.cbDocumento,
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        if (!Ext.isEmpty(value)) {
                            var store = me.cbDocumento.store;
                            if (store) {
                                var index = store.find('iddoc', value);
                                if (index >= 0) {
                                    var newValue = store.getAt(index).data.denominacion;
                                    return newValue;
                                }
                            }
                        }
                    }
                }, {
                    header: this.idioma.lbNumIni,
                    dataIndex: 'numinicio',
                    align: 'left',
                    width: 25,
                    editor: this.nfNumInicio = new Ext.form.NumberField({
                        allowBlank: false,
                        listeners: {
                            scope: this,
                            specialkey: function (tf, e) {
                                if (e.getCharCode() == Ext.EventObject.ENTER)
                                    this.nfNumFin.focus();
                            }
                        }
                    })
                }, {
                    header: this.idioma.lbNumFin,
                    dataIndex: 'numfin',
                    align: 'left',
                    width: 25,
                    editor: this.nfNumFin = new Ext.form.NumberField({
                        validator: function (value) {
                            if (value >= me.nfNumInicio.getValue())
                                return true;
                            return 'El número fin debe ser mayor o igual que ' + me.nfNumInicio.getValue();
                        },
                        allowBlank: false
                    })
                }, {
                    header: this.idioma.lbDisponibles,
                    dataIndex: 'disponible',
                    width: 25,
                    align: 'left',
                    editable: false,
                    readOnly: true,
                    lazyRender: true,
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        if (parseInt(record.data.numfin) >= parseInt(record.data.numinicio) && !record.data.disponible)
                            return parseInt(record.data.numfin) - parseInt(record.data.numinicio) + 1;
                        else return parseInt(record.data.disponible);
                    }
                },
                this.rowaction
            ],
            plugins: [this.roweditor, this.rowaction],
            sm: this.smTalonario = new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            viewConfig: {
                forceFit: true
            },
            tbar: [{
                scope: this,
                text: this.idioma.lbAdd,
                iconCls: 'adicionar',
                id: 'btnAddConsecutivo',
                disabled: true,
                tooltip: this.idioma.lbToolAddTal,
                //icon: this.perfil.dirImg + 'adicionar.png',
                handler: function () {
                    var recTal = new this.recordTalonario({
                        iddocumentos: '',
                        numinicio: '',
                        numfin: '',
                        disponibles: 0
                    });
                    this.roweditor.stopEditing();
                    this.stTalonario.insert(0, recTal);
                    this.gpTalonario.getView().refresh();
                    this.roweditor.startEditing(0, 0);
                    this.cbDocumento.focus(true, 100);
                }
            }]
        });

        /*this.panelTalonario = new Ext.Panel({
         region: 'center',
         border: false,
         layout: 'fit',
         frame: false,
         items: [this.gpTalonario]
         });
         this.panelOperaciones = new Caja.GestFondo.PanelOperaciones({
         idioma: this.idioma,
         perfil: this.perfil,
         idfondo: 0,
         scope: this
         });

         this.panelOperaciones2 = new Ext.Panel({
         region: 'south',
         layout: 'border',
         height: Ext.lib.Dom.getViewHeight() * 0.4,
         collapsible: true,
         collapsed: true,
         border: false,
         title: this.idioma.lbOperaciones,
         items: [this.panelOperaciones]
         });

         this.panelOperacionTalo = new Ext.Panel({
         layout: 'border',
         items: [this.panelTalonario, this.panelOperaciones2]
         });*/

        this.items = [this.gpTalonario];
    }
});