Ext.namespace('Ext.TarjetaIslaAzul');
Ext.TarjetaIslaAzul.Controller = Ext.extend(Ext.grid.GridPanel, {
    constructor: function (params) {
        Ext.apply(this, params);
        var model = new Ext.TarjetaIslaAzul.Model();
        var view = new Ext.TarjetaIslaAzul.View(model, params);
        this.tmodel = model;
        this.tview = view;
        this.initializeFunctions(model, view);
        this.crearGrid(model, view);
        Ext.TarjetaIslaAzul.Controller.superclass.constructor.call(this);

        this.initializeEvents(model, view);
        this.addEvents({
            'deshabilitar': true,
            'habilitar': true,
        });
    },
    crearGrid: function (model, view) {
        Ext.apply(this, {
            store: model.getStoreTarjeta(),
            loadMask: true,
            border: false,
            frame: false,
            view: new Ext.grid.GridView({
                forceFit: true
            }),
            sm: view.getSmTarjeta(),
            columns: view.getColumns(),
            tbar: view.getToolBar(),
            bbar: view.getPagToolTarjeta()
        });
    },
    initializeFunctions: function (model, view) {
        var me = this;
        this.searchTarjeta = function (filter) {
            model.getStoreTarjeta().baseParams.filter = filter;
            model.getStoreTarjeta().load({
                callback: function (records, opt, success) {
                    if (!records.length && filter)
                        mostrarMensaje(1, me.idioma.lbNoDatosPorCriterios);
                    else if (!records.length) {
                        mostrarMensaje(1, me.idioma.lbNoDatos);
                    }
                }
            });
            // this.stTarjeta.on({
            //     scope: this,
            //     load: function (store, records, options) {
            //         if (!records.length && filter)
            //             mostrarMensaje(1, me.idioma.lbNoDatosPorCriterios);
            //         else if (!records.length) {
            //             mostrarMensaje(1, me.idioma.lbNoDatos);
            //         }
            //     }
            // });
        };

        this.accionAdicionar = function () {

            var winTarjeta = new Ext.AddTarjetaIslaAzul.Controller({
                idioma: this.idioma,
                action: 'add',
                idcaja: this.idcaja
            });
            winTarjeta.show();

            winTarjeta.on({
                scope: this,
                close: function () {
                    model.getStoreTarjeta().reload();
                }
            });

        };

        this.accionModificar = function () {

            var winTarjeta = new Ext.AddTarjetaIslaAzul.Controller({
                idioma: this.idioma,
                action: 'mod',
                idcaja: this.idcaja
            });
            winTarjeta.show();
            winTarjeta.loadModData(view.getSmTarjeta().getSelected());

            winTarjeta.on({
                scope: this,
                close: function () {
                    model.getStoreTarjeta().load();
                }
            });

        };

        this.accionActivarInactivar = function () {
            var me = this;
            var selected = view.getSmTarjeta().getSelected();
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
                            model.getStoreTarjeta().reload();
                        }
                        Ext.MessageBox.hide();
                    }
                });
                return;
            }
            //Inactivar
            var pregCancelar = this.idioma.lbCancelTarjetaConfir;
            mostrarMensaje(2, pregCancelar, function (btnPress) {
                if (btnPress === 'ok') {

                    Ext.Msg.wait(me.idioma.lbCancelando, me.idioma.lbEspere);
                    var msgSuccess = me.idioma.lbCancelTarjetaSatisfact;

                    Ext.Ajax.request({
                        scope: me,
                        url: 'cancelartarjeta',
                        params: {
                            idTarjeta: selected.data.idtarjeta,
                        },
                        callback: function (options, success, response) {
                            var respuesta = Ext.decode(response.responseText);
                            if (respuesta.codMg == '1') {//Cancelado
                                mostrarMensaje(1, msgSuccess);
                                model.getStoreTarjeta().reload();
                                Ext.MessageBox.hide();
                            }
                        }
                    });
                }
            });
        };

        this.accionInventario = function () {
            this.getInventarioTarjeta();
        };

        this.getInventarioTarjeta = function () {
            Ext.Msg.wait(this.idioma.lbCargando, this.idioma.lbEspere);
            Ext.Ajax.request({
                scope: this,
                url: 'getInventarioTarjeta',
                method: 'POST',
                params: {
                    idCaja: this.idcaja,
                    estadoTarjeta: view.getCbEstado().getValue()
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.codMg == -1)
                        mostrarMensaje(1, this.idioma.lbNoOperRegistradas);
                    else
                        this.fOpenWindowReport(responseData.dataSources);
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

        this.estadoDeshabilitado = function () {
            this.fireEvent('deshabilitar');
        };

        this.estadoHabilitado = function (activo) {
            this.fireEvent('habilitar', activo);
        };

    },
    initializeEvents: function (model, view) {
        var me = this;

        // view.getSearchField().on({
        //     fnOnSearch: function () {
        //         me.searchTarjeta(view.getSearchField().getRawValue());
        //     },
        //     fnOnClear: function () {
        //         me.searchTarjeta('');
        //     }
        // });

        view.getSearchField().fnOnSearch = function () {
            me.searchTarjeta(view.getSearchField().getRawValue());
        };

        view.getSearchField().fnOnClear = function () {
            me.searchTarjeta('');
        };

        view.getCbEstado().on({
            scope: this,
            select: function (cb, rc, idx) {
                var cbValue = parseInt(cb.getValue());
                switch (cbValue) {
                    case 1:
                        model.getStoreTarjeta().baseParams.activo = 1;
                        break;
                    case 2:
                        model.getStoreTarjeta().baseParams.activo = 0;
                        break;
                    default:
                        model.getStoreTarjeta().baseParams.activo = null;
                }
                // me.stTarjeta.baseParams.idCaja = me.scope.idCaja;
                model.getStoreTarjeta().reload();
            }
        });

        view.getSmTarjeta().on({
            scope: this,
            rowselect: function (smodel, rowIndex, record) {
                this.getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function (smodel, rowIndex, record) {
                me.getView().removeRowClass(rowIndex, "negrita");
                // if (smodel.selections.length == 1) {
                //     this.btnModificar.enable();
                //     this.btnVistaReporte.enable();
                //     this.btnCancelar.enable();
                //     if (record.data.activo == 1) {
                //         this.scope.panelRecarga.btnAdicionar.enable();
                //     } else {
                //         this.scope.panelRecarga.btnAdicionar.disable();
                //     }
                // }
                // if (smodel.selections.length == 0) {
                //     this.btnCancelar.setIconClass('icondistra-activar');
                //     this.btnCancelar.setText(this.idioma.lbActInactivar);
                //     this.btnModificar.disable();
                //     this.btnEliminar.disable();
                //     this.btnCancelar.disable();
                //     this.btnVistaReporte.disable();
                //     this.scope.panelRecarga.smRecarga.clearSelections();
                // }
            },
            selectionchange: function (sm) {
                if (sm.selections.length == 1) {
                    var record = sm.getSelected();
                    // // this.btnModificar.enable();
                    // // this.btnCancelar.enable();
                    // if (record.data.activo == 1) {
                    //     // this.btnCancelar.setIconClass('icondistra-activar rojo');
                    //     // this.btnCancelar.setText(this.idioma.lbInactivar);
                    //     // this.scope.panelRecarga.btnAdicionar.enable();
                    // } else {
                    //     // this.btnCancelar.setIconClass('icondistra-activar');
                    //     // this.btnCancelar.setText(this.idioma.lbActivar);
                    //     // this.scope.panelRecarga.btnAdicionar.disable();
                    // }
                    // if (record.data.saldomo > 0) {
                    //     // this.btnCancelar.disable();
                    // }
                    this.estadoHabilitado(record.data.activo == 1 ? 1 : 0);
                } else {
                    this.estadoDeshabilitado();
                }
            }
        });

        this.on({
            scope: this,
            rowclick: function (grid, rowIndex, e) {
                me.fireEvent('filaclicleada', grid, rowIndex, e);
                // if (this.smTarjeta.getSelections().length == 1 && !Ext.isEmpty(this.smTarjeta.getSelected().data.nomcuenta)/* && this.smTarjeta.getSelected().data.tipo == 1*/) {
                //     this.scope.panelRecarga.setTitle(String.format(this.idioma.lbTitleRecargaTar, this.smTarjeta.getSelected().data.numero));
                //     /*this.scope.panelRecarga.stRecarga.load({
                //         params: {
                //             idtarjeta: this.smTarjeta.getSelected().data.idtarjeta,
                //             idPeriodo: Caja.Componentes.cbPeriodo.getValue()
                //         }
                //     });*/
                //     this.scope.panelRecarga.stRecarga.reload();
                //     this.scope.panelRecarga.btnAdicionar.enable();
                // } else {
                //     this.scope.panelRecarga.setTitle(this.idioma.lbTitleRecargas);
                //     this.scope.panelRecarga.stRecarga.removeAll();
                //     this.scope.panelRecarga.btnAdicionar.disable();
                // }
            }
        });

        model.getStoreTarjeta().on({
            beforeload: function (st, opt) {
                // me.btnModificar.disable();
                // me.btnCancelar.disable();
                // me.btnVistaReporte.disable();
                // me.scope.panelRecarga.btnAdicionar.disable();
                // me.scope.panelRecarga.stRecarga.removeAll();
                st.baseParams.idCaja = me.idcaja;
                if (view.getSmTarjeta().hasSelection())
                    me.idTarjeta = view.getSmTarjeta().getSelected().data.idtarjeta;
                else me.idTarjeta = null;
                me.fireEvent('antesdecargar', st, opt);
            },
            load: function (st, recors) {
                if (me.idTarjeta) {
                    var index = model.getStoreTarjeta().find('idtarjeta', me.idTarjeta);
                    view.getSmTarjeta().selectRow(index);
                } else {
                    view.getSmTarjeta().selectFirstRow();
                }
            }
        });

    },

});