Ext.namespace('Ext.GestionarTarjetaObligacion');
Ext.GestionarTarjetaObligacion.View = Ext.extend(Ext.Component, {
    etiquetas: undefined,
    Model: undefined,
    viewport: undefined,
    panelgeneral: undefined,
    idCaja: undefined,
    nombreCaja: undefined,
    constructor: function(model, params)
    {
        this.setModel(model);
        this.setEtiquetas(params.etiquetas);
        // this.setIdCaja(params.idCaja);
        // this.setNombreCaja(params.nombreCaja);
        this.initializeView();
        Ext.GestionarTarjetaObligacion.View.superclass.constructor.call(this);
    },
    ViewPort: function (items) {
        this.viewport = new Ext.Viewport({
            renderTo: document.body,
            layout: 'fit',
            items: [items]
        });
    },
    setModel: function (model) {
        this.Model = model;
    },
    getModel: function () {
        return this.Model;
    },
    setEtiquetas: function (etiquetas) {
        this.etiquetas = etiquetas;
    },
    getEtiquetas: function () {
        return this.etiquetas;
    },
    setIdCaja: function (idCaja) {
        this.idCaja = idCaja;
    },
    getIdCaja: function (idCaja) {
        return this.idCaja;
    },
    setNombreCaja: function (nombreCaja) {
        this.nombreCaja = nombreCaja;
    },
    getNombreCaja: function () {
        return this.nombreCaja;
    },
    PanelGeneral: function (items) {
        return this.panelgeneral = new Ext.Panel({
            layout: 'fit',
            region: 'center',
            border: false,
            items: items,
            // tbar: tbar
        });
    },
    initializeView: function () {
        this.initializeFunctions();
        this.initializeGets();
        var items = this.initializeItems();
        // var tbar = this.toolBarPanelGeneral(this.getModel());
        var panel = this.PanelGeneral(items);
        this.ViewPort(panel);
    },
    initializeItems: function () {
        var model = this.getModel();
        var gridRecarga = new Ext.grid.GridPanel(
            this.prepararGridRecarga(
                model.getStoreRecarga(),
                this.getGridRecargaColumns(),
                new Ext.grid.RowSelectionModel(),
                this.toolBarGridRecarga(model),
                {
                    region: 'center',
                    width: Ext.lib.Dom.getViewWidth(),
                    autoExpandColumn: 'comentarioRe'
                }
            )
        );
        this.setGridRecarga(gridRecarga);
        return {
            region: 'center',
            layout: 'border',
            frame: false,
            border: true,
            items: [gridRecarga]
        };
    },
    initializeFunctions: function () {
        this.toolBarPanelGeneral = function (model) {
            // this.lfProveedor = new Ext.form.Label({
            //     id: 'lfdPeriodo',
            //     text: "Proveedor de tarjeta:\u00A0",
            //     style: 'font-weight:bold;'
            // });

            // this.stProveedor = new Ext.data.Store({//PASARLE EL BEFORELOAD DEL ORIGINAL
            //     url: 'getProveedores',
            //     reader: new Ext.data.JsonReader({
            //         totalProperty: 'total',
            //         root: 'data'
            //     }, [{
            //         name: 'nombre'
            //     }, {
            //         name: 'idclientesproveedores'
            //     }
            //     ]),
            //     autoLoad: true
            // });
            this.cbProveedor = new Ext.form.ComboBox({
                emptyText: 'Seleccione...',
                allowBlank: false,
                store: model.getStoreProveedor(),
                valueField: 'idclientesproveedores',
                displayField: 'nombre',
                hiddenName: 'idclientesproveedores',
                typeAhead: true,
                anchor: '100%',
                mode: 'remote',
                pageSize: 20,
                minChars: 3,
                resizable: true,
                triggerAction: 'all',
                enableKeyEvents: true,
            });
            //
            // this.cbxCuentaProveedor = new Ext.contabilidad.util.linkedCombo({
            //     store: model.getStoreCuentaProveedor(),
            //     fieldLabel: 'Cuenta',
            //     loaded: true,
            //     allowBlank: true,
            //     singleSelection: false,
            //     leafSelect: false,
            //     qtip: 'text',
            //     displayField: 'text',
            //     valueField: 'idcuenta',
            //     selectField: 'codigo',
            //     listHeight: 300,
            //     anchor: '98%'
            // });

            this.ldPeriodo = new Ext.form.Label({
                id: 'lfdPeriodo',
                text: 'Fecha contable: ??/??/????',
                style: 'font-weight:bold;'
            });

            this.btnCaja = new Ext.Button({
                text: 'caja',
                // text: this.idioma.lbBtnCaja,
                // tooltip: this.idioma.lbToolCaja,
                iconCls: 'caja'
            });

            this.tfCaja = new Ext.form.TextField({
                name: 'tfCaja',
                disabledClass: 'disabled-component',
                readOnly: true,
                width: 130,
                enableKeyEvents: true
            });

            return [
                '->',
                // this.lfProveedor,
                // this.cbProveedor,
                // '-',
                // this.cbxCuentaProveedor,
                '-',
                this.ldPeriodo, '-',
                //Para el componente wincaja
                this.btnCaja,
                this.tfCaja
            ];

        };
        this.toolBarGridRecarga = function (model) {
            this.GridRecargaBtnAdicionar = new Ext.Button({
                iconCls: 'adicionar',
                text: 'Adicionar',
                tooltip: 'Adicionar recarga de tarjetas ' + '<b>(Ctrl+I)</b>',
                disabled: false
            });
            this.GridRecargaBtnModificar = new Ext.Button({
                iconCls: 'modificar',
                text: 'Modificar',
                tooltip: 'Modificar recarga de tarjetas ' + '<b>(Ctrl+M)</b>',
                disabled: true,
            });
            this.GridRecargaBtnCancelar = new Ext.Button({
                iconCls: 'cancelar',
                text: 'Cancelar',
                tooltip: 'Cancelar recarga de tarjetas ' + '<b>(Ctrl+X)</b>',
                disabled: true,
            });
            this.GridRecargaBtnConfirmar = new Ext.Button({
                iconCls: 'confirmar',
                text: 'Confirmar',
                tooltip: 'Confirmar recarga de tarjetas ' + '<b>(Ctrl+F)</b>',
                disabled: true,
            });
            this.GridRecargaBtnPostear = new Ext.Button({
                iconCls: 'contabilidad',
                text: 'Postear',
                tooltip: 'Postear recarga de tarjetas ' + '<b>(Ctrl+T)</b>',
                disabled: true
            });

            this.GridRecargaBtnVer = new Ext.Button({
                iconCls: 'ver',
                text: 'Ver',
                tooltip: 'Ver recarga de tarjetas ' + '<b>(Ctrl+V)</b>',
                disabled: true
            });

            this.cbProveedor = new Ext.form.ComboBox({
                emptyText: 'Seleccione...',
                allowBlank: false,
                store: model.getStoreProveedor(),
                valueField: 'idclientesproveedores',
                displayField: 'nombre',
                hiddenName: 'idclientesproveedores',
                typeAhead: true,
                anchor: '100%',
                mode: 'remote',
                pageSize: 20,
                minChars: 3,
                resizable: true,
                triggerAction: 'all',
                enableKeyEvents: true,
            });

            this.ldPeriodo = new Ext.form.Label({
                id: 'lfdPeriodo',
                text: 'Fecha contable: ??/??/????',
                style: 'font-weight:bold;'
            });

            this.btnCaja = new Ext.Button({
                text: 'caja',
                // text: this.idioma.lbBtnCaja,
                // tooltip: this.idioma.lbToolCaja,
                iconCls: 'caja'
            });

            this.tfCaja = new Ext.form.TextField({
                name: 'tfCaja',
                disabledClass: 'disabled-component',
                readOnly: true,
                width: 130,
                enableKeyEvents: true
            });

            return [
                this.GridRecargaBtnAdicionar,
                this.GridRecargaBtnModificar,
                this.GridRecargaBtnCancelar,
                this.GridRecargaBtnConfirmar,
                this.GridRecargaBtnPostear,
                this.GridRecargaBtnVer,
                '->',
                '-',
                this.ldPeriodo, '-',
                //Para el componente wincaja
                this.btnCaja,
                this.tfCaja
            ];
        };
        this.getGridRecargaColumns = function () {
            return [
                {
                    id: 'fecha',
                    header: 'Fecha Contable',
                    dataIndex: 'fechacontable',
                    renderer: 'erpFecha',
                    width: 100,
                    align: 'center',
                    sortable: true
                }, {
                    id: 'comentarioRe',
                    header: 'Comentario',
                    dataIndex: 'comentario',
                    width: 110,
                    sortable: true,
                    align: 'left'
                }, {
                    header: 'Importe total',
                    dataIndex: 'importet',
                    width: 110,
                    sortable: true,
                    align: 'center'
                }, {
                    id: 'responsableRe',
                    header: 'Responsable',
                    dataIndex: 'nombrecompleto',
                    width: 150,
                    sortable: true,
                    align: 'center'
                }, {
                    header: 'Estado',
                    dataIndex: 'estado',
                    width: 110,
                    sortable: true,
                    align: 'center',
                    renderer: function (val, metadata, record) {
                        if (val == 0) {
                            return 'Guardado';
                        } else if (val == 1) {
                            return 'Confirmado';
                        } else if (val == 2) {
                            return 'Posteado';
                        } else if (val == 3) {
                            return 'Cancelado';
                        } else {
                            return 'Desconocido';
                        }
                    }
                }
            ];
        };

        this.prepararGridRecarga = function (store, columns, selModel, tbar, adicionalParams) {

            var compCmp = new Ext.Cmpaction();

            columns.push(compCmp);

            var gridRecargaPagingBar = new Ext.Cont.PagingToolbar({
                pageSize: 20,
                store: store,
                displayInfo: true,
                clearFilter: true,
                displayMsg: 'Resultados de {0} - {1} de {2}',
                emptyMsg: "Ning&uacute;n resultado para mostrar.",
            });

            var config = {
                // title: 'Recargas',
                store: store,
                stripeRows: true,
                loadMask: true,
                sm: selModel,
                columns: columns,
                plugins: compCmp,
                tbar: tbar,
                bbar: gridRecargaPagingBar,
            };

            if (typeof adicionalParams === 'object') {
                Ext.applyIf(config, adicionalParams);
            }

            return config;
        };

    },
    initializeGets: function () {
        //panel
        this.getCbProveedor = function () {
            return this.cbProveedor;
        };
        // this.getCbxCuentaProveedor = function () {
        //     return this.cbxCuentaProveedor;
        // };
        this.getLabelFechaContable = function () {
            return this.ldPeriodo;
        };
        this.getBtnCaja = function () {
            return this.btnCaja;
        };
        this.getTfCaja = function () {
            return this.tfCaja;
        };
        //grid recarga
        this.setGridRecarga = function (gridRecarga) {
            this.gridRecarga = gridRecarga;
        };
        this.getGridRecarga = function () {
            return this.gridRecarga;
        };

        this.getGridRecargaBtnAdicionar = function () {
            return this.GridRecargaBtnAdicionar;
        };
        this.getGridRecargaBtnModificar = function () {
            return this.GridRecargaBtnModificar;
        };
        this.getGridRecargaBtnCancelar = function () {
            return this.GridRecargaBtnCancelar;
        };
        this.getGridRecargaBtnConfirmar = function () {
            return this.GridRecargaBtnConfirmar;
        };
        this.getGridRecargaBtnPostear = function () {
            return this.GridRecargaBtnPostear;
        };
        this.getGridRecargaBtnVer = function () {
            return this.GridRecargaBtnVer;
        };
        //grid ant liq
    }
});
