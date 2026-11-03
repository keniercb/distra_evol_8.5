Ext.namespace('Caja.Tarjetas');

//--Componete Grid Tarjetas
Caja.Tarjetas.GridTarjeta = Ext.extend(Ext.grid.GridPanel, {
    layout: 'fit',
    border: false,
    frame: false,
    labelAlign: 'top',
    buttonAlign: 'right',
    constructor: function (params) {
        Ext.apply(this, params);
        var column = [];
        var me = this;
        //---------------------------------
        this.searchField = new Ext.Cont.SearchField({
            width: (Ext.lib.Dom.getViewWidth() - 10) * 0.1,
            maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda ]*$/,
            scope: this,
            fnOnSearch: function () {
                this.scope.buscarTarjeta(this.scope.searchField.getRawValue());
            },
            fnOnClear: function () {
                this.scope.buscarTarjeta('');
            }
        });
        //
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
                me.stTarjeta.reload();
            }
        });
        //Para el componente caja
        this.btnCaja = new Ext.Button({
            text: this.idioma.lbBtnCaja,
            tooltip: this.idioma.lbToolCaja,
            iconCls: 'caja'
        });
        this.tfCaja = new Ext.form.TextField({
            name: 'tfCaja',
            disabledClass: 'disabled-component',
            readOnly: true,
            width: 100,
            enableKeyEvents: true
        });

        if (this.tipotarjeta === 2) {

            this.jrTarjeta = new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'total'
            }, [{
                name: 'idtarjeta'
            }, {
                name: 'idpersona'
            }, {
                name: 'activo'
            }, {
                name: 'nomcuenta'
            }, {
                name: 'idmoneda'
            }, {
                name: 'idcaja'
            }, {
                name: 'nompersona'
            }, {
                name: 'numero'
            }, {
                name: 'saldomo', type: 'float'
            }
            ]);

            column = [
                {
                    header: this.idioma.lbTarjeta,
                    sortable: true,
                    hideable: true,
                    width: 80,
                    dataIndex: 'numero',
                    editor: this.nfNumero = new Ext.form.NumberField({
                        allowBlank: false,
                        maxLength: 16,
                        maxLengthText: this.idioma.lbMaxLengthText16,
                        listeners: {
                            scope: this,
                            specialkey: function (tf, e) {
                                if (e.getCharCode() == Ext.EventObject.ENTER)
                                    this.nfNumFin.focus();
                            }
                        }
                    })
                }, {
                    sortable: true,
                    header: this.idioma.lbResponsable,
                    hideable: true,
                    id: 'columnauario',
                    dataIndex: 'nompersona',
                    scope: this,
                }, {
                    sortable: true,
                    width: 40,
                    allowDecimals: true,
                    header: this.idioma.lbSaldo,
                    hideable: true,
                    dataIndex: 'saldomo',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        return formatoMoneda(value);
                    }
                }
            ];

        } else {
            this.jrTarjeta = new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'total'
            }, [{
                name: 'idtarjeta'
            }, {
                name: 'idpersona'
            }, {
                name: 'activo'
            }, {
                name: 'nomcuenta'
            }, {
                name: 'idmoneda'
            }, {
                name: 'idcaja'
            }, {
                name: 'nompersona'
            }, {
                name: 'numero'
            }, {
                name: 'idvehiculo'
            }, {
                name: 'vehiculo'
            }, {
                name: 'matricula'
            }, {
                name: 'nomcombustible'
            }, {
                name: 'preciocombustible', type: 'float'
            }, {
                name: 'saldomo', type: 'float'
            }, {
                name: 'tipo'
            }
            ]);

            column = [
                {
                    header: this.idioma.lbTarjeta,
                    sortable: true,
                    hideable: true,
                    width: 80,
                    dataIndex: 'numero',
                    editor: this.nfNumero = new Ext.form.NumberField({
                        allowBlank: false,
                        maxLength: 16,
                        maxLengthText: this.idioma.lbMaxLengthText16,
                        listeners: {
                            scope: this,
                            specialkey: function (tf, e) {
                                if (e.getCharCode() == Ext.EventObject.ENTER)
                                    this.nfNumFin.focus();
                            }
                        }
                    })
                }, {
                    sortable: true,
                    header: this.idioma.lbResponsable,
                    hideable: true,
                    id: 'columnauario',
                    dataIndex: 'nompersona',
                    scope: this,
                }, {
                    sortable: true,
                    width: 50,
                    header: this.idioma.lbVehiculo,
                    hideable: true,
                    dataIndex: 'vehiculo',
                    editor: this.tfVehiculo = new Ext.form.TextField({
                        xtype: 'textfield',
                        allowBlank: false,
                        maxLength: 20,
                        maxLengthText: this.idioma.lbMaxLengthText20
                    })
                }, {
                    sortable: true,
                    width: 40,
                    allowDecimals: true,
                    header: this.idioma.lbSaldo,
                    hideable: true,
                    dataIndex: 'saldomo',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        return formatoMoneda(value);
                    }
                }
            ];
        }

        this.stTarjeta = new Ext.data.Store({
            scope: this,
            url: 'cargartarjetas',
            reader: this.jrTarjeta,
            baseParams: {
                limit: 100,
                filter: '',
                start: 0
            },
            autoLoad: false
        });

//----------------------------------
        Ext.apply(this, {
            title: this.idioma.lbTarjetaComb,
            autoExpandColumn: 'columnauario',
            store: this.stTarjeta,
            loadMask: true,
            sm: this.smTarjeta = new Ext.grid.RowSelectionModel({
                singleSelect: true,
            }),
            columns: column,
            viewConfig: {
                forceFit: true
            },
            tbar: [this.searchField, this.cbTipoTarjeta, '->', this.btnCaja, this.tfCaja],
            bbar: [
                '->', this.btnActualizar = new Ext.Button({
                    iconCls: 'actualizar',
                    text: this.idioma.lbActualizar,
                    tooltip: this.idioma.lbActualizarTarj,
                    listeners: {
                        scope: this,
                        click: function (tf, e) {
                            this.stTarjeta.reload();
                        }
                    }
                })
            ]
            /*  bbar: new Ext.Cont.PagingToolbar({
                  pageSize: 15,
                  store: this.stTarjeta,
              //    displayInfo: true
              })*/
        });
        //---------------------------
        this.initEventos();
        this.initFunctions();

        Caja.Tarjetas.GridTarjeta.superclass.constructor.call(this);
    },
    initEventos: function () {
        var me = this;
        this.btnCaja.on({
            scope: this,
            click: function () {
                this.scope.loadWindowCaja(true);
            }
        });
        this.smTarjeta.on({
            scope: this,
            rowselect: function (smodel, rowIndex, record) {
                me.getView().addRowClass(rowIndex, "negrita");
                if (me.smTarjeta.getSelections().length == 1) {
                    if (me.smTarjeta.getSelected().data.activo == 1)
                        this.scope.panelAnticipo.btnAdicionar.enable();
                    else
                        this.scope.panelAnticipo.btnAdicionar.disable();
                    me.scope.panelAnticipo.setTitle(String.format(me.idioma.lbTitleAnticipo, me.smTarjeta.getSelected().data.numero));
                    /*me.scope.panelAnticipo.stAnticipo.load({
                        params: {
                            idtarjeta: me.smTarjeta.getSelected().data.idtarjeta,
                            filter: ''
                        }
                    });*/
                    me.scope.panelAnticipo.stAnticipo.load();
                    //this.grid.scope.panelAnticipo.gpAnticipo.show();
                } else {
                    //me.scope.panelAnticipo.setTitle(me.idioma.lbTitleRecargas);
                    me.scope.panelAnticipo.stAnticipo.removeAll();
                }
                me.scope.panelAnticipo.searchField.reset();
            },
            rowdeselect: function (smodel, rowIndex, record) {
                me.getView().removeRowClass(rowIndex, "negrita");
                me.scope.panelAnticipo.stAnticipo.removeAll();
                me.scope.panelAnticipo.fDeshabilitarTodosBotonesPanelAnticipo();
            }
        });
        this.stTarjeta.on({
            scope: this,
            load: function (store, records, options) {
                if (!records.length && store.baseParams.filter != '')
                    mostrarMensaje(1, this.scope.idioma.lbNoResultadosBusqueda)
                if (me.idTarjeta) {
                    var index = me.stTarjeta.find('idtarjeta', me.idTarjeta);
                    me.smTarjeta.selectRow(index);
                }/* else {
                    me.smTarjeta.selectFirstRow();
                }*/
            },
            beforeload: function () {
                if (this.smTarjeta.hasSelection())
                    me.idTarjeta = this.smTarjeta.getSelected().data.idtarjeta;
                else me.idTarjeta = null;
                this.scope.panelAnticipo.fDeshabilitarTodosBotonesPanelAnticipo();
            }
        });
        this.getView().getRowClass = function (record, index, rowParams, store) {
            if (record.data.activo == 0) { //Inactivo
                return 'FilaRoja';
                /*} else if (record.data.idestado == '6') { //Posteado
                     return 'FilaVerde';*/
            }
        };

    },
    initFunctions: function () {

        var me = this;


        this.lMaskCargando = function () {
            this.lMask = new Ext.LoadMask(me.body, {//body de la ventana
                msg: this.idioma.lbCargando
            });
            this.lMask.show();
        };

        this.buscarTarjeta = function (filter) {
            this.stTarjeta.baseParams.filter = filter;
            this.stTarjeta.baseParams.idcaja = this.scope.winCaja.idCaja;

            this.stTarjeta.load();

        };


        this.selectionsOnPaging = function () {
            var arrayValues = new Array();
            var instance = new PagingToolbarSelections({
                'selections': this.gpCaja.getSelectionModel().getSelections(),
                'activePage': this.gpCaja.getBottomToolbar().getPageData().activePage
            });
            return instance.getSelectionsOnArray(arrayValues);
        };
    }
});



