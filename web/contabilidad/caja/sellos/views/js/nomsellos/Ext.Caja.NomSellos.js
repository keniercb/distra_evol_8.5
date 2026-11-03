Ext.namespace('Ext.Caja.NomSellos');
Ext.Caja.NomSellos = Ext.extend(Ext.Viewport, {

    constructor: function (params) {
        //idioma del sistema
        var idioma = window.parent.perfil.idioma;
        var text = (idioma === 'es') ? 'Cargando...' : 'Loading...';
        var title = (idioma === 'es') ? 'Por favor espere...' : 'Please wait...';
        this.onloadMessageBox(title, text);

        Ext.Ajax.request({
            method: "POST",
            url: "cargaretiquetas",
            scope: this,
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                var idioma = Ext.decode(response.responseText);
                var perfil = window.parent.perfil;

                params.btnAdicionarSell = new Ext.Button({
                    id: 'btnAdicionarSell',
                    text: idioma.lbAdicionar,
                    tooltip: idioma.tooltipAdicionarSell,
                    iconCls: 'adicionar'
                });

                params.btnModificarSell = new Ext.Button({
                    id: 'btnModificarSell',
                    text: idioma.lbModificar,
                    tooltip: idioma.tooltipModificarSell,
                    iconCls: 'modificar',
                    disabled: true
                });


                params.btnEliminarSell = new Ext.Button({
                    id: 'btnEliminarSell',
                    text: idioma.lbEliminar,
                    tooltip: idioma.tooltipEliminarSell,
                    iconCls: 'eliminar',
                    disabled: true
                });

                this.stSellos = new Ext.data.GroupingStore({
                    url: 'loadSellos',
                    reader: new Ext.data.JsonReader({
                        root: 'datos'
                    }, [
                        {name: 'idsellos'},
                        {name: 'denominacion'},
                        {name: 'idmoneda'},
                        {name: 'codigoiso'},
                        {name: 'importe', type: 'int'}
                    ]),
                    groupField: 'codigoiso',
                    sortInfo: {field: 'importe', direction: "DESC"}
                });

                params.gpGestSellos = new Ext.grid.GridPanel({
                    store: this.stSellos,
                    //----Para el agrupador por monedas
                    view: new Ext.grid.GroupingView({
                        hideGroupedColumn: false,
                        groupTextTpl: "Moneda: {[values.rs[0].data.codigoiso]}"
                    }),
                    sm: params.smSellos = new Ext.grid.RowSelectionModel({
                        singleSelect: true
                    }),
                    // viewConfig: {
                    //     forceFit: true
                    // },
                    // forceFit: true,
                    loadMask: true,
                    stripeRows: true,
                    region: 'center',
                    // layout: 'fit',
                    autoExpandColumn: 'idExpandColumn',
                    columns: [
                        {
                            id: 'idExpandColumn',
                            header: idioma.headerDenomSell,
                            sortable: true,
                            dataIndex: 'denominacion'
                        }, {
                            header: idioma.headerPrecio,
                            sortable: true,
                            width: 80,
                            dataIndex: 'importe',
                            align: 'left',
                            renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                                return '<span style="color:green;">' + formatoMonedaABS(value) + '</span>';
                            }
                        }, {
                            header: 'Moneda',
                            sortable: true,
                            width: 80,
                            dataIndex: 'codigoiso'
                        }
                    ],
                    tbar: [params.btnAdicionarSell, params.btnModificarSell, params.btnEliminarSell]
                });

                Ext.apply(this, params);
                Ext.apply(this, {
                    layout: 'fit',
                    items: [{
                        layout: 'border',
                        border: false,
                        items: [params.gpGestSellos]
                    }]
                });

                Ext.Caja.NomSellos.superclass.constructor.call(this);

                //Inicializa todos los eventos del Sellponente
                this.inicializarEventos(perfil, idioma);

                //Mapa de teclas
                this.globalKeyMap = new Ext.KeyMap(Ext.getBody());
                this.globalKeyMap.accessKey = function (key, handler, scope) {
                    var h = function (n, e) {
                        e.preventDefault();
                        handler.call(scope || this, n, e);
                    };
                    this.on(key, h, scope);
                };

                //Mapa de teclas del Sellos
                this.globalKeyMap.accessKey({
                    key: 'i',
                    alt: true
                }, function () {
                    if (!this.btnAdicionarSell.disabled) {
                        this.showWindowSellos(idioma, perfil, 'adicionar');
                    }
                }, this);

                this.globalKeyMap.accessKey({
                    key: 'm',
                    alt: true
                }, function () {
                    if (!this.btnModificarSell.disabled) {
                        this.showWindowSellos(idioma, perfil, 'modificar');
                    }
                }, this);

                this.globalKeyMap.accessKey({
                    key: Ext.EventObject.DELETE,
                    alt: true
                }, function () {
                    if (!this.btnEliminarSell.disabled) {
                        this.deleteSellos(idioma);
                    }
                }, this);

                //Mandar a cargar los stores de los grid
                this.stSellos.load();
                this.btnAdicionarSell.focus(true, 1000);
            }
        });
    },
    onloadMessageBox: function (agTtl, agMsg) {
        Ext.MessageBox.show({
            title: agTtl,
            msg: agMsg,
            width: 300,
            wait: true,
            waitConfig: {interval: 300},
            progress: true,
            closable: false
        });
    },
    inicializarEventos: function (perfil, idioma) {

        this.btnAdicionarSell.on({
            scope: this,
            click: function () {
                this.showWindowSellos(idioma, perfil, 'adicionar');
            }
        });

        this.btnModificarSell.on({
            scope: this,
            click: function () {
                this.showWindowSellos(idioma, perfil, 'modificar');
            }
        });

        this.btnEliminarSell.on({
            scope: this,
            click: function () {
                this.deleteSellos(idioma);
            }
        });

        this.smSellos.on({
            scope: this,
            rowselect: function (selmodel, rowIndex, record) {
                this.btnModificarSell.enable();
                this.btnEliminarSell.enable();
            },
            rowdeselect: function (selmodel, rowIndex, record) {
                this.btnModificarSell.disable();
                this.btnEliminarSell.disable();
            }
        });

        this.gpGestSellos.on({
            scope: this,
            rowdblclick: function (grid, rowIndex, event) {
                this.smSellos.clearSelections();
                this.smSellos.selectRow(rowIndex);
            },
            rowclick: function (grid, rowIndex, event) {
            }
        });

        this.stSellos.on({
            scope: this,
            load: function () {
                this.btnModificarSell.disable();
                this.btnEliminarSell.disable();
            }
        });
    },

    showWindowSellos: function (idioma, perfil, accion) {
        var paramsMod = null;
        if (accion == 'modificar') {
            paramsMod = this.smSellos.getSelected().data;
        }

        new Ext.Caja.WindowNomSellos({
            id: 'winSellos',
            idioma: idioma,
            perfil: perfil,
            accion: accion,
            paramsMod: paramsMod,
            globalKeyMap: this.globalKeyMap,
            stSellos: this.stSellos
        });
    },

    deleteSellos: function (idioma) {
        this.globalKeyMap.disable();
        mostrarMensaje(2, idioma.msgPreguntaEliminarSell, function (btn) {
            if (btn == 'ok') {
                this.onloadMessageBox(idioma.titleEliminando, idioma.msgEspere);

                var seleccionado = this.smSellos.getSelected();

                Ext.Ajax.request({
                    method: "POST",
                    url: "deleteSellos",
                    params: {
                        idsellos: seleccionado.data.idsellos
                    },
                    scope: this,
                    callback: function (options, success, response) {
                        Ext.MessageBox.hide();
                        this.globalKeyMap.enable();
                        var res = Ext.decode(response.responseText);

                        if (res.success) {
                            mostrarMensaje(1, idioma.msgEliminarSuccessOneSell);
                            this.stSellos.reload();
                        } else {
                            mostrarMensaje(1, idioma.msgDelNoSellbusEntidad);
                        }
                    }
                });
            }
            else {
                this.globalKeyMap.enable();
            }
        }.bind(this));
    },
});

// this.globalKeyMap.disable();

//Inicializando la vista.
Ext.QuickTips.init();

new Ext.Caja.NomSellos({});