Ext.namespace('Ext.GestionarAnticipo');
Ext.GestionarAnticipo.View = Ext.extend(Ext.Component, {
    etiquetas: undefined,
    Model: undefined,
    viewport: undefined,
    panelgeneral: undefined,
    tipoDuo: undefined,
    constructor: function(params, Model)
    {
        Ext.apply(this, params);
        this.Model = Model;
        this.initializeView();
        Ext.GestionarAnticipo.View.superclass.constructor.call(this);
    },
    ViewPort: function (items) {
        this.viewport = new Ext.Viewport({
            renderTo: document.body,
            layout: 'fit',
            items: [items]
        });
    },
    PanelGeneral: function (items) {
        return this.panelgeneral = new Ext.Panel({
            layout: 'fit',
            border: false,
            items: items
        });
    },
    initializeView: function () {
        this.initializeFunctions();
        var items = this.initializeItems();
        var panel = this.PanelGeneral(items);
        this.ViewPort(panel);
    },
    initializeItems: function () {
        return [this.getGrid()];
    },
    initializeFunctions: function () {
        this.toolBar = function () {

            this.btnadicionar = new Ext.Button({
                disabled: false,
                id: 'btnA',
                text: 'Ad<U>i</U>cionar',
                tooltip: this.tipoDuo === 3 ? 'Adicionar cobro anticipado <b>(Alt + I)</b>' : 'Adicionar pago anticipado <b>(Alt + I)</b>',
                iconCls: 'adicionar'
            });

            this.btnmodificar = new Ext.Button({
                disabled: true,
                id: 'btnM',
                text: '<U>M</U>odificar',
                tooltip: this.tipoDuo === 3 ? 'Modificar cobro anticipado <b>(Alt + M)</b>' : 'Modificar pago anticipado <b>(Alt + M)</b>',
                iconCls: 'modificar',
                abreviatura: 'add_anticipo',
            });

            this.btneliminar = new Ext.Button({
                disabled: true,
                id: 'btnC',
                text: 'Eliminar',
                tooltip: this.tipoDuo === 3 ? 'Eliminar cobro anticipado <b>(DEL)</b>' : 'Eliminar pago anticipado <b>(DEL)</b>',
                iconCls: 'eliminar',
                abreviatura: 'del_anticipo',
            });

            this.btnConfirmar = new Ext.Button({
                disabled: true,
                id: 'btnConfirmar',
                hidden: true,
                text: 'Con<U>f</U>irmar',
                tooltip: this.tipoDuo === 3 ? 'Confirmar cobro anticipado <b>(Alt + F)</b>' : 'Confirmar pago anticipado <b>(Alt + F)</b>',
                iconCls: 'confirmar',
            });

            this.btnContabilizar = new Ext.Button({
                disabled: true,
                id: 'btnContabilizar',
                hidden: true,
                text: 'Pos<U>t</U>ear',
                tooltip: this.tipoDuo === 3 ? 'Postear cobro anticipado <b>(Alt + T)</b>' : 'Postear pago anticipado <b>(Alt + T)</b>',
                iconCls: 'contabilidad',
            });

            this.btnCancelarContabilizar = new Ext.Button({
                disabled: true,
                id: 'btnCancelarContabilizar',
                hidden: true,
                text: 'Cancelar',
                tooltip: this.tipoDuo === 3 ? 'Cancelar cobro anticipado <b>(Alt + X)</b>' : 'Cancelar pago anticipado <b>(Alt + X)</b>',
                iconCls: 'cancelar',
            });

            this.btnBuscar = new Ext.Button({
                disabled: false,
                hidden: false,
                id: 'btnBuscar',
                text: '<U>B</U>&uacute;squeda avanzada',
                tooltip: this.tipoDuo === 3 ? 'B&uacute;squeda avanzada de cobros anticipados <b>(Alt + B)</b>' : 'B&uacute;squeda avanzada de pagos anticipados <b>(Alt + B)</b>',
                iconCls: 'buscaravanzada',
                abreviatura: 'busca_pagoanticipado',
            });

            this.btnAyuda = new Ext.Button({
                id: (this.tipoDuo === 3) ? 'btnAyudaCobroAnticipado' : 'btnAyudaPagoAnticipado',
                iconCls: 'ayuda',
                text: 'Ayuda'
            });

            this.searchField = new Ext.Cont.SearchField({
                width: 120,
                // maskRe: /^[0-9]*$/,
                emptyText: 'Número a buscar...',
            });

            this.lfdFechaContable = new Ext.form.Label({
                id: 'lfdFechaContable',
                text: ' ',
                style: 'font-weight:bold;'
            });

            this.btnConfiguracion = new Ext.Button({
                disabled: true,
                hidden: true,
                text: 'Configuracion',
                // tooltip: this.tipoDuo === 3 ? 'Postear cobro anticipado <b>(Alt + T)</b>' : 'Postear pago anticipado <b>(Alt + T)</b>',
                iconCls: 'contabilidad',
                abreviatura: 'conftv',
            });

            if (this.tipoDuo === 3) {
                validate.addButton(this.btnConfiguracion);
                validate.checkPermisos(true, false);
            }

            return [this.btnadicionar, this.btnmodificar, this.btneliminar, this.btnConfirmar, this.btnContabilizar, this.btnCancelarContabilizar, this.btnConfiguracion
                , this.btnBuscar, this.searchField, '->', this.lfdFechaContable, this.btnAyuda];
        };

        this.getGrid = function () {

            var compCmp = new Ext.Cmpaction();

            this.pagingBar = new Ext.Cont.PagingToolbar({
                pageSize: 20,
                store: this.Model.stgrid,
                displayInfo: true,
                clearFilter: true,
                tabIndex: 314,
                displayMsg: 'Resultados de {0} - {1} de {2}',
                emptyMsg: "Ning&uacute;n resultado para mostrar.",
            });

            this.gpgrid = new Ext.grid.GridPanel({
                title: '',
                autoExpandColumn: 'expandir',
                store: this.Model.stgrid,
                stripeRows: true,
                id: 'gpgrid',
                loadMask: true,
                region: 'center',
                view: new Ext.grid.GroupingView({
                    groupTextTpl: '{[values.rs[0].data.nomsubsistema]}'
                }),
                sm: this.smgrid = new Ext.grid.RowSelectionModel({}),
                columns: [
                    {
                        id: 'fecha',
                        header: 'Fecha de emisi&oacute;n',
                        dataIndex: 'fecha',
                        renderer: 'erpFecha',
                        width: 100,
                        align: 'center',
                        sortable: true
                    }, {
                        id: 'operacion',
                        header: 'Operaci&oacute;n',
                        dataIndex: 'nomoperacion',
                        width: 200,
                        align: 'left',
                        sortable: true,
                        hidden: true
                    }, {
                        id: 'idcomentario',
                        header: 'Comentario',
                        dataIndex: 'comentario',
                        width: 200,
                        align: 'left',
                        sortable: false,
                    }, {
                        id: 'nomsubsistema',
                        header: 'Subsistema',
                        dataIndex: 'nomsubsistema',
                        width: 50,
                        hidden: true,
                        align: 'left',
                        sortable: true
                    }, {
                        id: 'documento',
                        header: 'Documento',
                        dataIndex: 'tipoinstrumento',
                        width: 120,
                        align: 'left',
                        sortable: true
                    }, {
                        id: 'nInstrumento',
                        header: 'No. instrumento',
                        dataIndex: 'numero',
                        width: 100,
                        align: 'left',
                        sortable: true
                    }, {
                        header: 'Importe',
                        dataIndex: 'importeOriginal',
                        width: 110,
                        sortable: true,
                        renderer: formatoMonedaABS,
                        align: 'right'
                    }, {
                        header: 'Liquidado',
                        dataIndex: 'liquidado',
                        width: 110,
                        sortable: true,
                        renderer: formatoMonedaABS,
                        align: 'right'
                    }, {
                        id: 'importe',
                        header: 'Por liquidar',
                        dataIndex: 'importe',
                        width: 110,
                        sortable: true,
                        renderer: formatoMonedaABS,
                        align: 'right'
                    }, {
                        id: 'moneda',
                        header: 'Moneda ',
                        dataIndex: 'moneda',
                        width: 60,
                        align: 'center',
                        sortable: true
                    }, {
                        id: 'cuenta',
                        header: 'Cuenta ',
                        dataIndex: 'cuenta',
                        width: 140,
                        align: 'left',
                        sortable: true
                    }, {
                        id: 'estado',
                        header: 'Estado',
                        dataIndex: 'estado',
                        width: 80,
                        align: 'left',
                        sortable: true
                    }, {
                        id: 'expandir',
                        header: this.tipoDuo === 3 ? 'Deudor' : 'Acreedor',
                        dataIndex: 'cliente',
                        sortable: true
                    },
                    // rowaction
                    compCmp
                ],
                plugins: compCmp,
                tbar: this.toolBar(),
                bbar: this.pagingBar,
            });

            return this.gpgrid;
        };
    }
});