Ext.define('GestionCampanna.view.ClienteGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gc_clientegrid',
    border : false,
    stateful: true,
    collapsible: false,
    multiSelect: true,
    selType: 'checkboxmodel',
    autoLoad: false,
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },

    initComponent: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);
        me.store = Ext.create('GestionCampanna.store.ClienteActividad');
        this.selModel = {mode: 'MULTI'};
        this.frame = false;
        this.margin = false;

        //COLUMNAS
        this.columns = [
            {
                text: this.etiquetas.lbNombre,
                sortable: false,
                dataIndex: 'nombre',
                flex: 1
            }, {
                text: this.etiquetas.lbTipo,
                sortable: false,
                dataIndex: 'idclasificacion',
                width: 80,
                align: 'center',
                renderer: me.rendererClasificacion
            }
        ];

        this.searchfield = Ext.create('Ext.ux.SearchField', {
            flex: 1,
            maxWidth: 250,
            minWidth: 150,
            context: 'campanna'
            //searchTooltip: this.etiquetas.qtipSearch.get(lbCampanna.toLowerCase())
            //concept: 'cliente' //Para diferenciar las grid de la ventana campanna
        });

        this.btnAdd = Ext.create('Ext.Button', {
            action: 'add',
            iconCls: 'adicionar',
            text: this.etiquetas.lbBtnAdd,
            concept: 'cliente',
            context: 'campanna',
            tooltip: this.etiquetas.lbAdicionarCliente,
        });


        this.btnDel = Ext.create('Ext.Button', {
            iconCls: 'eliminar',
            action: 'del',
            disabled: true,
            text: this.etiquetas.lbEliminar,
            concept: 'cliente',
            context: 'campanna',
            nombre: 'clientegrid',
            tooltip: this.etiquetas.lbEliminarCliente,
        });



        this.tbar =  [
            this.btnAdd,
            this.btnDel,
            '->',
            this.searchfield
        ];

        this.callParent();
    },
    rendererClasificacion: function (value, metadata) {
        var icono = 'icondistra-',
            tipo = 'Entidad';
        if (value == 1) {
            icono += 'buscarcliententidad';
        } else {
            icono += 'buscarclitepersona';
            tipo = 'Persona';
        }
        metadata.innerCls = icono;
        metadata.tdAttr = 'data-qtip="' + tipo + '"';
    }
});

