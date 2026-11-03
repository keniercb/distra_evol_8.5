Ext.namespace('Ext.GestionarTarjetaOtros');
Ext.GestionarTarjetaOtros.View = Ext.extend(Ext.Component, {
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
        Ext.GestionarTarjetaOtros.View.superclass.constructor.call(this);
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
    PanelGeneral: function (items, tbar) {
        return this.panelgeneral = new Ext.Panel({
            layout: 'fit',
            region: 'center',
            border: false,
            items: items,
            tbar: tbar
        });
    },
    initializeView: function () {
        this.initializeFunctions();
        this.initializeGets();
        var items = this.initializeItems();
        var tbar = this.toolBarPanelGeneral(this.getModel());
        var panel = this.PanelGeneral(items, tbar);
        this.ViewPort(panel);
    },
    initializeItems: function () {
        var model = this.getModel();
        // var gridRecarga = new Ext.grid.GridPanel(
        //     this.prepararGridRecarga(
        //         model.getStoreRecarga(),
        //         this.getGridRecargaColumns(),
        //         new Ext.grid.RowSelectionModel(),
        //         this.toolBarGridRecarga(model),
        //         {
        //             region: 'center',
        //             width: Ext.lib.Dom.getViewWidth(),
        //             autoExpandColumn: 'comentarioRe'
        //         }
        //     )
        // );
        // this.setGridRecarga(gridRecarga);
        return {
            region: 'center',
            layout: 'border',
            frame: false,
            border: true,
            items: [this.TabTarjetaOtros = new Ext.Caja.TabTarjetaOtros({
                idioma: this.getEtiquetas(),
            })]
        };

    },
    initializeFunctions: function () {
        this.toolBarPanelGeneral = function (model) {

            this.btnAdicionar = new Ext.Button({
                iconCls: 'adicionar',
                text: this.getEtiquetas().lbAdicionar,
                tooltip: this.getEtiquetas().lbToolAdd
            });

            this.btnModificar = new Ext.Button({
                iconCls: 'modificar',
                text: this.getEtiquetas().lbModificar,
                tooltip: this.getEtiquetas().lbToolMod,
                disabled: true,
            });

            this.btnEliminar = new Ext.Button({
                iconCls: 'eliminar',
                text: this.getEtiquetas().lbEliminar,
                tooltip: this.getEtiquetas().lbToolDel,
                disabled: true,
                hidden: true
            });

            this.btnCancelar = new Ext.Button({
                disabled: true,
                iconCls: 'activar',
                text: this.getEtiquetas().lbActInactivar,
                tooltip: this.getEtiquetas().lbToolActInact
            });

            this.btnVistaReporte = new Ext.Button({
                disabled: true,
                iconCls: 'submayor',
                text: this.getEtiquetas().lbReporte,
                tooltip: this.getEtiquetas().lbToolReporte,
                hidden: true
            });

            this.btnInventario = new Ext.Button({
                disabled: false,
                iconCls: 'inventario',
                text: this.getEtiquetas().lbInventario,
                tooltip: this.getEtiquetas().lbToolInventario
            });

            this.stProveedor = new Ext.data.Store({//PASARLE EL BEFORELOAD DEL ORIGINAL
                url: 'getProveedores',
                reader: new Ext.data.JsonReader({
                    totalProperty: 'total',
                    root: 'data'
                }, [{
                    name: 'nombre'
                }, {
                    name: 'idclientesproveedores'
                }
                ]),
                autoLoad: true
            });

            this.cbProveedor = new Ext.form.ComboBox({
                emptyText: 'Seleccione...',
                allowBlank: false,
                store: this.stProveedor,
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

            this.cbxCuentaProveedor = new Ext.contabilidad.util.linkedCombo({
                // disabledClass: 'disabled-component',
                // disabled: true,
                // proxy: new Ext.data.HttpProxy(new Ext.data.Connection({url: 'obtenerCtaPorNivel'})),
                store: this.stCuenta = new Ext.data.Store({
                    // url: 'obtenerCtaPorNivel',
                    // autoLoad: true,
                    // baseParams: {
                    //     'arrayIdCuenta': Ext.encode(scope.cbxEntidad.fSelect.values)
                    // },
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
                selectField:'codigo',
                listHeight: 300,
                anchor: '98%'
            });

            this.btnCaja = new Ext.Button({
                text: this.getEtiquetas().lbBtnCaja,
                tooltip: this.getEtiquetas().lbToolCaja,
                iconCls: 'caja'
            });

            this.tfCaja = new Ext.form.TextField({
                name: 'tfCaja',
                disabledClass: 'disabled-component',
                readOnly: true,
                width: 100,
                enableKeyEvents: true
            });

            this.btnAyuda = new Ext.Button({
                id: 'btnAyudaTarjetaRecarga',
                text: this.getEtiquetas().lbBtnAyuda,
                tooltip: this.getEtiquetas().lbToolAyuda,
                iconCls: 'ayuda'
            });

            this.ldPeriodo = new Ext.form.Label({
                id: 'lfdPeriodo',
                text: ' ',
                style: 'font-weight:bold;'
            });

            this.lfProveedor = new Ext.form.Label({
                id: 'lfdPeriodo',
                text: "Proveedor de tarjeta:\u00A0",
                style: 'font-weight:bold;'
            });

            // this.tbar = [
            //     '->',
            //     this.lfProveedor = new Ext.form.Label({
            //         id: 'lfdPeriodo',
            //         text: "Proveedor de tarjeta:\u00A0",
            //         style: 'font-weight:bold;'
            //     }),
            //     ,
            //     '-',
            //     ,
            //     '-',
            //     this.lfdPeriodo = new Ext.form.Label({
            //         id: 'lfdPeriodo',
            //         text: ' ',
            //         style: 'font-weight:bold;'
            //     }), '-',
            //     //Para el componente wincaja
            //
            // ];

            return [
                this.btnAdicionar,
                this.btnModificar,
                this.btnEliminar,
                this.btnCancelar,
                // this.btnVistaReporte,
                // this.btnInventario,
                '->',
                this.lfProveedor,
                this.cbProveedor,
                // '-',
                // this.cbxCuentaProveedor,
                '-',
                this.ldPeriodo, '-',
                //Para el componente wincaja
                this.btnCaja,
                this.tfCaja
            ];

        };

    },
    initializeGets: function () {
        //panel
        this.getCbProveedor = function () {
            return this.cbProveedor;
        };
        this.getCbxCuentaProveedor = function () {
            return this.cbxCuentaProveedor;
        };
        this.getLabelFechaContable = function () {
            return this.ldPeriodo;
        };
        this.getBtnCaja = function () {
            return this.btnCaja;
        };
        this.getTfCaja = function () {
            return this.tfCaja;
        };

        this.getBtnAdd = function () {
            return this.btnAdicionar;
        };

        this.getBtnMod = function () {
            return this.btnModificar;
        };

        this.getBtnEliminar = function () {
            return this.btnEliminar;
        };

        this.getBtnActivarInactivar = function () {
            return this.btnCancelar;
        };

        this.getBtnInventario = function () {
            return this.btnInventario;
        };

        this.getTabTarjetaOtros = function () {
            return this.TabTarjetaOtros;
        };
    }
});
