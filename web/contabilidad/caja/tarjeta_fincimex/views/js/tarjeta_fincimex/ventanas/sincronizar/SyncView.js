Ext.namespace('Ext.GestionarTarjetaOperSync');
Ext.GestionarTarjetaOperSync.View = Ext.extend(Ext.Window, {
    lmask: undefined,
    etiquetas: undefined,
    constructor: function (model, params) {
        this.setModel(model);
        this.etiquetas = params.etiquetas;
        Ext.apply(this, {
            autoValidate: false,
            modal: true,
            constrain: true,
            monitorResize: false,
            layout: 'fit',
            width: Ext.lib.Dom.getViewWidth() * 0.80,
            height: Ext.lib.Dom.getViewHeight() * 0.80,
            closeAction: 'destroy',
            frame: true,
            resizable: false,
            title: 'Configuracion',
            listeners: {
                scope: this,
                show: function () {

                },
                close: function () {
                }
            }
        });
        this.initializeClass();
        Ext.GestionarTarjetaOperSync.View.superclass.constructor.call(this);
    },
    loadMask: function (message = 'Cargando...') {
        this.lmask = new Ext.LoadMask(this.body, {
            msg: message
        });
        this.lmask.show();
    },
    crearFormSteps: function()
    {
        return this.formSteps = new Ext.FormSteps(this.getForm(), this.buttons);
    },
    crearPanelGeneral: function (items, tbar) {
        return this.panelGeneral = new Ext.Panel({
            layout: 'fit',
            region: 'center',
            border: false,
            items: items,
            tbar: tbar
        });
    },
    initializeClass: function () {
        this.createButtons();
        this.createFunctions();
        this.setWindowItems();
    },
    setModel: function (model) {
        this.model = model;
    },
    getModel: function () {
        return this.model;
    },
    setForm: function (form) {
        this.formSync = form;
    },
    getForm: function () {
        return this.formSync;
    },
    getBtnAceptar: function () {
        return this.btnAceptar;
    },
    getGridSync: function () {
        return this.gridSync;
    },
    getGridTarjSistema: function () {
        return this.gridTS;
    },
    getGridTarjFincimex: function () {
        return this.gridTF;
    },
    createButtons: function () {
        this.btnCancelar = new Ext.Button({
            // tooltip: scope.etiquetas.lbToolCancelar,
            text: 'Cerrar',
            iconCls: 'cancelar',
            scope: this,
            handler: function (btn) {
                this.close();
            }
        });

        // this.btnAceptar = new Ext.Button({
        //     id:'Aceptar',
        //     // tooltip: scope.etiquetas.lbToolAceptar,
        //     text: 'Aceptar',
        //     iconCls: 'Aceptar',
        //     disabled: true
        // });

        this.buttons = [this.btnCancelar];
    },
    createGridSincronizar: function (model, adicional) {
        return new Ext.grid.GridPanel(
            this.prepararGridSincronizar(
                model.getStSync(),
                this.getColumnsGridSincronizar(),
                new Ext.grid.CheckboxSelectionModel({
                    width: 25,
                    align: 'right'
                }),
                this.getToolBarGridSincronizar(),
                adicional
            )
        );
    },
    createGridTarjetasEnSistema: function (model, adicional) {
        return new Ext.grid.GridPanel(
            this.prepararGridTarjetasEnSistema(
                model.getStSistema(),
                this.getColumnsGridTarjetasEnSistema(),
                new Ext.grid.RowSelectionModel(),
                undefined,
                adicional
            )
        );
    },
    createGridTarjetasEnFincimex: function (model, adicional) {
        return new Ext.grid.GridPanel(
            this.prepararGridTarjetasEnFincimex(
                model.getStFincimex(),
                this.getColumnsGridTarjetasEnFincimex(),
                new Ext.grid.RowSelectionModel(),
                this.getToolBarGridTarjetasEnFincimex(),
                adicional
            )
        );
    },
    crearItemsPanel: function () {
        var model = this.getModel();
        this.gridSync = this.createGridSincronizar(model,
            {
                region: 'north',
                layout: 'fit',
                // height: Ext.lib.Dom.getViewHeight() * 0.45
                height: Ext.lib.Dom.getViewHeight() * 0.35
            }
        );
        this.gridTS = this.createGridTarjetasEnSistema(model,
            {
                region: 'center',
                // width: Ext.lib.Dom.getViewWidth() * 0.50,
                width: Ext.lib.Dom.getViewWidth() * 0.40,
                // height: Ext.lib.Dom.getViewHeight() * 0.50
                // height: Ext.lib.Dom.getViewHeight() * 0.40
            }
        );
        this.gridTF = this.createGridTarjetasEnFincimex(model,
            {
                region: 'east',
                // width: Ext.lib.Dom.getViewWidth() * 0.50,
                width: Ext.lib.Dom.getViewWidth() * 0.40,
                // height: Ext.lib.Dom.getViewHeight() * 0.50
                // height: Ext.lib.Dom.getViewHeight() * 0.40
            }
        );
        return {
            region: 'center',
            layout: 'border',
            frame: false,
            border: true,
            items: [this.gridSync, this.gridTS, this.gridTF]
        };
    },
    setWindowItems: function () {
        var items = this.crearItemsPanel();
        var panel = this.crearPanelGeneral(items);
        this.items = [panel];
    },
    createFunctions: function () {

        this.prepararGridSincronizar = function (store, columns, selModel, tbar, adicionalParams) {

            // if (selModel instanceof Ext.CheckboxSelectionModel) {
                columns.unshift(selModel);
            // }

            var config = {
                title: 'Tarjetas Sincro',
                store: store,
                stripeRows: true,
                loadMask: true,
                sm: selModel,
                columns: columns,
                tbar: tbar
                // bbar: pagingBar,
            };

            if (typeof adicionalParams === 'object') {
                Ext.applyIf(config, adicionalParams);
            }

            return config;
        };

        this.getToolBarGridSincronizar = function () {
            this.btnSincronizar = new Ext.Button({
                iconCls: 'adicionar',
                text: 'Sincronizar',
                // text: this.idioma.lbAdicionar,
                // tooltip: this.idioma.lbToolAddRecarga,
                disabled: true
            });
            this.btnActFechaCad = new Ext.Button({
                iconCls: 'modificar',
                text: 'Actualizar Fecha Cad.',
                // text: this.idioma.lbModificar,
                // tooltip: this.idioma.lbToolModRecarga,
                disabled: true,
            });

            return [
                this.btnSincronizar,
                this.btnActFechaCad
            ];
        };

        this.getColumnsGridSincronizar = function () {
            return [
                {
                    header: 'Numero tarjeta sistema',
                    dataIndex: 'numtarjetasistema',
                    // width: 200,
                    width: Ext.lib.Dom.getViewWidth() * 0.19,
                    align: 'center',
                    sortable: true
                }, {
                    header: 'Fecha caducidad sistema',
                    dataIndex: 'fechacaducidadsistema',
                    renderer: 'erpFecha',
                    // width: 180,
                    width: Ext.lib.Dom.getViewWidth() * 0.19,
                    align: 'center',
                    sortable: true
                }, {
                    header: 'Numero tarjeta fincimex',
                    dataIndex: 'numtarjetafincimex',
                    // width: 200,
                    width: Ext.lib.Dom.getViewWidth() * 0.19,
                    sortable: true,
                    align: 'center'
                }, {
                    header: 'Fecha caducidad fincimex',
                    dataIndex: 'fechacaducidadfincimex',
                    renderer: 'erpFecha',
                    // width: 180,
                    width: Ext.lib.Dom.getViewWidth() * 0.19,
                    align: 'center',
                    sortable: true
                }
            ];
        };

        this.prepararGridTarjetasEnSistema = function (store, columns, selModel, tbar, adicionalParams) {

            var config = {
                title: 'Tarjetas Sistema',
                store: store,
                stripeRows: true,
                loadMask: true,
                sm: selModel,
                columns: columns,
                tbar: tbar,
                autoExpandColumn: 'expandir'
                // bbar: pagingBar,
            };

            if (typeof adicionalParams === 'object') {
                Ext.applyIf(config, adicionalParams);
            }

            return config;
        };

        this.getToolBarGridTarjetasEnSistema = function () {
            var btnAdicionar = new Ext.Button({
                iconCls: 'adicionar',
                text: 'Adicionar',
                // text: this.idioma.lbAdicionar,
                // tooltip: this.idioma.lbToolAddRecarga,
                disabled: true
            });
            var btnModificar = new Ext.Button({
                iconCls: 'modificar',
                text: 'Modificar',
                // text: this.idioma.lbModificar,
                // tooltip: this.idioma.lbToolModRecarga,
                disabled: true,
            });
            var btnCancelar = new Ext.Button({
                iconCls: 'cancelar',
                text: 'Cancelar',
                // text: this.idioma.lbCancelar,
                // tooltip: this.idioma.lbToolCancelRecarga,
                disabled: true,
            });
            var btnConfirmar = new Ext.Button({
                iconCls: 'confirmar',
                text: 'Confirmar',
                // text: this.idioma.lbConfirmar,
                // tooltip: this.idioma.lbToolConfRecarga,
                disabled: true,
            });
            var btnPostear = new Ext.Button({
                disabled: true,
                iconCls: 'contabilidad',
                text: 'Postear',
                // text: this.idioma.lbPostear,
                // tooltip: this.idioma.lbToolPostearRecarga,
            });

            return [
                btnAdicionar,
                btnModificar,
                btnCancelar,
                btnConfirmar,
                btnPostear
            ];
        };

        this.getColumnsGridTarjetasEnSistema = function () {
            return [
                {
                    header: 'Numero tarjeta',
                    dataIndex: 'numtarjetasistema',
                    // width: 200,
                    width: Ext.lib.Dom.getViewWidth() * 0.18,
                    align: 'center',
                    id: 'expandir',
                    sortable: true
                }, {
                    header: 'Fecha caducidad',
                    dataIndex: 'fechacaducidadsistema',
                    renderer: 'erpFecha',
                    // width: 180,
                    width: Ext.lib.Dom.getViewWidth() * 0.18,
                    align: 'center',
                    sortable: true
                }
            ];
        };

        this.prepararGridTarjetasEnFincimex = function (store, columns, selModel, tbar, adicionalParams) {

            var config = {
                title: 'Tarjetas Fincimex',
                store: store,
                stripeRows: true,
                loadMask: true,
                sm: selModel,
                columns: columns,
                tbar: tbar,
                autoExpandColumn: 'expandir'
                // bbar: pagingBar,
            };

            if (typeof adicionalParams === 'object') {
                Ext.applyIf(config, adicionalParams);
            }

            return config;
        };

        this.getToolBarGridTarjetasEnFincimex = function () {
            this.btnAddTarjetaSistema = new Ext.Button({
                iconCls: 'adicionar',
                text: 'Adicionar',
                tooltip: 'Adicionar Tarjeta al sistema',
                disabled: true
            });

            return [
                this.btnAddTarjetaSistema
            ];
        };

        this.getColumnsGridTarjetasEnFincimex = function () {
            return [
                {
                    header: 'Numero tarjeta',
                    dataIndex: 'numtarjetafincimex',
                    // width: 200,
                    width: Ext.lib.Dom.getViewWidth() * 0.18,
                    sortable: true,
                    id: 'expandir',
                    align: 'center'
                }, {
                    header: 'Fecha caducidad',
                    dataIndex: 'fechacaducidadfincimex',
                    renderer: 'erpFecha',
                    // width: 180,
                    width: Ext.lib.Dom.getViewWidth() * 0.18,
                    align: 'center',
                    sortable: true
                }
            ];
        };

    }
});
