Ext.define('Seguimiento.view.Main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.s_main',
    frame: false,
    margin: false,
    border: false,

    initComponent: function () {
        var me=this;
        this.etiquetas = LangMgr.getLang(this);
        this.title = this.etiquetas.moduleName;
        this.layout = 'border';
        // this.layout = 'hbox';
        this.closable = true;

        this.hitogrid = Ext.create('Seguimiento.view.GridSeguimiento',{
            region:'center',
            // region: 'east',
            split:true,
            flex:1
        });

        // this.contratogrid = Ext.create('Seguimiento.view.ContratosGrid', {
        //     title:me.etiquetas.lbTitleContrato,
        //     region: 'west',
        //     // region:'center',
        //     split:true,
        //     flex:1,
        //     // width: 300
        // });

        this.contratogrid = Ext.create('GestionContratoImportacion.view.gridContratos', {
            storeId: 's_stContratos',
            frame: false,
            margin: false,
            border: false,
            split: true,
            title: this.etiquetas.lbTitleContrato,
            region: 'west',
            collapsible: true,
            resizable: true,
            minWidth: window.innerWidth*0.3,
            maxWidth: window.innerWidth*0.6,
            // width: window.innerWidth*0.4,
            flex:1,
            selType: 'rowmodel',
            lokedColumns: false,
            columnasVisibles: [
                'numero', 'clienteproveedor', 'montototal', 'fechafirma',
                'estadoinicial', 'vigente'
                // 'nombrearea', 'sector', 'tipocontrato','fechainicio',
                // 'vigente', 'contratomarco', 'cliente', 'fechafin', 'numero',
            ],
            filtrosFijos: {
                // 'cliente': {'type': 'list', 'value': '[1]'},
                // 'vigente': {'type': 'list', 'value': '[1]'},
                // 'contratomarco': {'type': 'list', 'value': '[0]'},
                'cliente': {'type': 'list', 'value': [2]},
                'vigente': {'type': 'boolean', 'value': true},
                'contratomarco': {'type': 'boolean', 'value': false},
                'accion_estado': {'type': 'other', 'value': 'endedwork'}
                // 'filtrodetrabajoterminado': {'type': 'other', 'value': true},
//                 'montototal':{'type': 'numeric', 'value': 0, 'comparison': 'gt'}
            }
            // width: 300
        });

        this.items = [
            this.contratogrid,
            this.hitogrid
        ];

        this.callParent();
    }
});
