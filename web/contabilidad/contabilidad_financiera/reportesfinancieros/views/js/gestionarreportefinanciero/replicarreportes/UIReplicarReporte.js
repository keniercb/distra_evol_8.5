Ext.namespace('Ext.UIReplicarReporte');
Ext.UIReplicarReporte= Ext.extend(Ext.Window, {
    lmask: undefined,
    url: '',
    etiquetas: undefined,
    constructor: function (params) {
        // this.url = params.url;
        // this.etiquetas = params.etiquetas;
        Ext.apply(this, {
            autoValidate: false,
            modal: true,
            constrain: true,
            layout: 'fit',
            // width: Ext.lib.Dom.getViewWidth() * 0.40,
            // height: Ext.lib.Dom.getViewHeight() * 0.70,
            closeAction: 'destroy',
            frame: true,
            resizable: false,
            title: 'Replicar reporte',
            listeners: {
                scope: this,
                show: function () {
                },
                close: function () {
                }
            }
        });
        this.initializeStore();
        this.loadDataComponent();
        this.initializeClass();
        Ext.UIReplicarReporte.superclass.constructor.call(this);
    },
    loadMask: function (message) {
        if (!(this.lmask instanceof Ext.LoadMask && message === undefined)) {
            this.lmask = new Ext.LoadMask(this.body, {
                msg: message ? message : 'Cargando...'
            });
        }
        this.lmask.show();
    },
    hideMask: function () {
        if (this.lmask instanceof Ext.LoadMask) {
            this.lmask.hide();
        }
    },
    initializeStore: function ()
    {

    },
    loadDataComponent: function()
    {

    },
    initializeClass: function () {
        this.createButtons();
        this.createPanel();
        this.initFunctions();
        this.initEventos();
    },
    createButtons: function () {
        this.btnCancelar = new Ext.Button({
            // tooltip: this.etiquetas.lbToolCancelar,
            text: 'Cancelar',
            iconCls: 'cancelar',
        });

        this.btnAceptar = new Ext.Button({
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            disabled: true,
            iconCls: 'aceptar',
        });

        this.buttons = [this.btnCancelar, this.btnAceptar];
    },
    createPanel: function () {

        this.items = [this.createGridEntidad()];
    },
    createGridEntidad: function () {

        this.smTreeEntidad = new Ext.grid.RowSelectionModel({
            /*listeners: {
             scope: this,
             rowselect: function (sm, index, record) {
             this.cmbEntidad.setValue(record.data.id);
             this.cmbEntidad.setRawValue(record.data.text);
             this.cmbEntidad.fireEvent('select', this.cmbEntidad, record);
             this.cmbEntidad.collapse();
             }
             }*/
        });

        this.stTreeEntidad = new Ext.Cont.TreeGrid.AdjacencyListStore({
            autoLoad: true,
            url: 'cargarEntidadesEconomicas',
            baseParams: {
                replicar: true
            },
            reader: new Ext.data.JsonReader({
                id: '_id',
                root: 'datos',
                successProperty: 'success'
            }, [
                {name: 'id'},
                {name: '_id'},
                {name: 'idestructurae'},
                {name: 'descripcion'},
                {name: 'text'},
                {name: 'codigo'},
                {name: 'leaf'},
                {name: '_is_leaf'},
                {name: '_parent'}
            ])
        });

        this.treeEntidad = new Ext.Cont.TreeGrid.GridPanel({
            autoScroll: true,
            stripeRows: true,
            border: false,
            frame: false,
            loadMask: true,
            sm: this.smTreeEntidad,
            store: this.stTreeEntidad,
            enableColumnMove: false,
            hideHeaders: true,
            width: Ext.lib.Dom.getViewWidth() * 0.40,
            height: Ext.lib.Dom.getViewHeight() * 0.60,
            // autoExpanColunm: 'expandir',
            columns: [
                {
                    dataIndex: 'text',
                    sortable: true,
                    // id: 'expandir',
                    width: Ext.lib.Dom.getViewWidth() * 0.37,
                    header: 'Denominacion',
                    renderer: function (value, metaData, record) {
                        metaData.attr = 'ext:qtip="<b>' + value + '</b>"';
                        return value;
                    }
                }
            ]
        });

        return this.treeEntidad;
    },
    initFunctions: function () {

    },
    initEventos: function () {
        this.btnCancelar.setHandler(function () {
            this.close();
        }, this);
    },
});