Ext.namespace('Ext.GestionarAnticipo');
Ext.GestionarAnticipo.Model = Ext.extend(Ext.Component, {
    tipoDuo: undefined,
    constructor: function(params)
    {
        Ext.apply(this, params);
        this.initializeModel();
        return Ext.GestionarAnticipo.Model.superclass.constructor.call(this);
    },
    initializeModel: function () {
        this.initializeRecords();
        this.initializeReaders();
        this.initializeStores();
    },
    initializeRecords: function () {

        this.recordGrid = new Ext.data.Record.create(
            [{name: 'iddocanticipado'},
                {name: 'idanticipo'},
                {name: 'comentario'},
                {name: 'numero'},
                {name: 'cliente'},
                {name: 'idoperacion'},
                {name: 'fecha'},
                {name: 'fecharecepcion'},
                {name: 'importe'},
                {name: 'importeOriginal'},
                {name: 'idestado'},
                {name: 'estado'},
                {name: 'cuenta'},
                {name: 'idcuenta'},
                {name: 'moneda'},
                {name: 'idmoneda'},
                {name: 'text'},
                {name: 'nomoperacion'},
                {name: 'tipoinstrumento'},
                {name: 'numcomprobante'},
                {name: 'showCmp'},
                {name: 'idsubsistema', type: 'int'},
                {name: 'nomsubsistema'},
                {name: 'liquidadomb', type: 'float'},
                {name: 'liquidado'},
                {name: 'cargainicial', type: 'int'},
                {name: 'idcuentaoperacion'},
            ]
        );

    },
    initializeReaders: function () {

        this.rdgrid = new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad_filas'
            },
            this.recordGrid
        );

    },
    initializeStores: function () {

        this.stgrid = new Ext.data.GroupingStore({
            url: 'cargaranticipos',
            groupField: 'nomsubsistema',
            reader: this.rdgrid,
            timeout: 99999999,
            baseParams: {tipoDuo: this.tipoDuo},
            sortInfo: {
                field: 'idsubsistema',
                direction: "ASC"
            }
        });

    }
});