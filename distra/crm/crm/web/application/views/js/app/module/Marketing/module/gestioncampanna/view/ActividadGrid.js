Ext.define('GestionCampanna.view.ActividadGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.actividadgrid',
    region: 'center',
    border: false,
    stateful: true,
    collapsible: false,
    multiSelect: true,
    autoScroll: true,
    autoLoad: false,
    //stateId: 'stateGrid',
    selType: 'checkboxmodel',
    viewConfig: {
        stripeRows: true,
        enableTextSelection: true
    },

    initComponent: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);
        //this.title = me.etiquetas.titleMainGrid || 'Listado de contratos';
        me.store = Ext.create('GestionCampanna.store.Actividad');
        this.selModel = {mode: 'MULTI'};
        this.frame = false;
        this.margin = false;

        var producto = this.etiquetas.clActividad;

        //COLUMNAS
        this.columns = [
            {
                text: this.etiquetas.lbNombre,
                sortable: false,
                dataIndex: 'denominacion',
                flex: 1
            }, {
                text: this.etiquetas.clCostoVariable,
                sortable: false,
                dataIndex: 'presupuesto',
                flex: 1
            }, {
                text: this.etiquetas.clCanal,
                sortable: true,
                dataIndex: 'denomcanal',
                flex: 1
            },
            {
                text: this.etiquetas.lbprioridad,
                sortable: true,
                dataIndex: 'denomprioridad',
                flex: 1
            },{
                text: this.etiquetas.clFechaInicio,
                sortable: false,
                dataIndex: 'fechainicio',
                flex: 1
            }, {
                text: this.etiquetas.clFechaFin,
                sortable: false,
                dataIndex: 'fechafin',
                flex: 1
            }
        ];

        this.searchfield = Ext.create('Ext.ux.SearchField', {
            flex: 1,
            maxWidth: 250,
            minWidth: 150,
            concept: 'actividad',
            context: 'campanna' //Para diferenciar las grid de la ventana campanna
        });

        this.btnAdd = Ext.create('Ext.Button', {
            //iconCls: 'adicionar',
            action: 'add',
            iconCls: 'icondistra-adicionar',
            text: this.etiquetas.lbBtnAdd,
            // tooltip: this.etiquetas.qtipAdd.get(lbCampanna),
            concept: 'actividad',
            tooltip: this.etiquetas.lbAdicionarActividad,
            context: 'campanna' //Para diferenciar las grid de la ventana campanna
        });

        this.btnEdit = Ext.create('Ext.Button', {
            //iconCls: 'adicionar',
            action: 'edit',
            iconCls: 'icondistra-modificar',
            disabled: true,
            text: this.etiquetas.lbModificar,
            // tooltip: this.etiquetas.qtipAdd.get(lbCampanna),
            concept: 'actividad',
            tooltip: this.etiquetas.lbModificarActividad,
            context: 'campanna' //Para diferenciar las grid de la ventana campanna
        });

        this.btnDel = Ext.create('Ext.Button', {
            iconCls: 'icondistra-eliminar',
            action: 'del',
            disabled: true,
            text: this.etiquetas.lbEliminar,
            //tooltip: this.etiquetas.qtipMod.get(lbCampanna)
            concept: 'actividad',
            context: 'campanna',
            tooltip: this.etiquetas.lbEliminarActividad,
            nombre: 'actividadgrid'//Para diferenciar las grid de la ventana campannaarp: 'loco'
        });

        this.tbar = [
            this.btnAdd,
            this.btnEdit,
            this.btnDel,
            '->',
            this.searchfield
        ];

        this.callParent();
    }
});
