Ext.define('GestionOportunidad.view.ClienteGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.clientgrid',
    border: true,
    stateful: true,
    collapsible: false,
    multiSelect: true,
    selType: 'checkboxmodel',
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },

    initComponent: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);
        me.store = Ext.create('GestionOportunidad.store.ClienteOportunidad');
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
            minWidth: 150
        });

        this.btnAdd = Ext.create('Ext.Button', {
            action: 'add',
            iconCls: 'adicionar',
            text: this.etiquetas.lbBtnAdd,
            concept: 'cliente',
            tooltip: this.etiquetas.lbAdicionarCliente
        });


        this.btnDel = Ext.create('Ext.Button', {
            iconCls: 'eliminar',
            action: 'del',
            disabled: true,
            text: this.etiquetas.lbEliminar,
            concept: 'cliente',
            tooltip: this.etiquetas.lbAdicionarCliente
        });


        this.tbar = [
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

