Ext.define('ConfContratacion.view.ConfPliegoIndicadores', {
    extend: 'Ext.form.Panel',
    // extend: 'Ext.grid.Panel',
    alias: 'widget.confpliegoindicadores',
    frame: true,
    border: false,
    layout: 'fit',
    selType:'checkboxmodel',
    autoScroll: true,

    requires: [
        'ConfContratacion.view.TrasitionPanel'
    ],

    initComponent: function () {
        var me = this;
        this.getLang();
        // this.title='Configuraci&oacute;n de comit&eacute;';
        this.store=Ext.create('Ext.data.Store',{
            storeId: 'storepliegoindicadores',
            fields:[
                'idindicadorpliego', 'nombre', 'text', 'descripcion',
                {name: 'calcularrelevancia', type: 'boolean'},
                {name: 'mostrargrid', type: 'boolean'},
                {name: 'mostrargrafica', type: 'boolean'},
                'categoria', 'valor', 'categoria_title', 'valor_title',
                'categoria_bar', 'valor_bar', 'categoria_bar_title', 'valor_bar_title',
                'categoria_pie', 'valor_pie', 'categoria_pie_title', 'valor_pie_title',
                'tipografica', 'camposgrid', 'enuso', 'lock',
                'configgrafica', 'configgrid', 'atributo', 'nombrerelevancia'
            ],
            // data:[
            //     {'nombre': 'Mejores precios'},
            //     {'nombre': 'Completamiento'},
            //     {'nombre': 'Origen'},
            //     {'nombre': 'Incoterms'},
            //     {'nombre': 'Tiempo de entrega'},
            //     {'nombre': 'Paquete'},
            // ]
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getIndicadoresPliego'}, ModuleMgr.get('ConfContratacion')),
                actionMethods: {
                    read: 'POST'
                },
                reader: {
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success'
                }
            }
        }).load();

        function mostrarTooltip(value, meta){
            if (value)
                meta.tdAttr = 'data-qtip="' + value + '"';
            return value;
        }

        this.columns=[
            {text:me.etiquetas.lbName, dataIndex:'nombre', flex:1, renderer: mostrarTooltip},
            {xtype: 'checkcolumn', text: 'Relevancia', dataIndex:'calcularrelevancia', width: 80},
            {text: 'Nombre relevancia', dataIndex:'nombrerelevancia', width: 120, renderer: mostrarTooltip},
            {xtype: 'checkcolumn', text: 'Mostrar gráfica', dataIndex:'mostrargrafica', width: 100},
            {text: 'Tipo de gráfica',  dataIndex: 'tipografica', renderer: function(value, meta, record){
                var respuesta='Sin gráfica configurada';
                switch(value) {
                    case 'bar':
                        respuesta= 'Gráfica de barras';
                        break;
                    case 'pie':
                        respuesta= 'Gráfica de pastel';
                        break;
                }
                meta.tdAttr = 'data-qtip="' + respuesta + '"';
                return respuesta;
                }},
            {xtype: 'checkcolumn', text: 'Mostrar grid', dataIndex:'mostrargrid', width: 90},
            {text: 'Campos del grid',  dataIndex: 'configgrid', flex: 0.5,renderer: function(value, meta, record){
                    var configgrid=Ext.decode(value),
                        respuesta='No configurado',
                        aux=[];
                    configgrid['columns'].forEach(function(x){
                        aux.push(x['nombrecolumna']);
                    })
                    if(aux.length>0)
                        respuesta=aux.join(', ');
                    meta.tdAttr = 'data-qtip="' + respuesta + '"';
                    return respuesta;
                }},
            // {xtype: 'checkcolumn', text: 'En uso', dataIndex: 'enuso', width: 60},
        ];

        this.grid = Ext.create('Ext.grid.Panel',{
            // alias:'widget.gridcomitegeneral',
            itemId:'gridindicadores',
            store: this.store,
            columns: this.columns,
            tbar: [
                {
                    text: 'Adicionar',
                    action: 'add',
                    iconCls: 'adicionar'
                },
                {
                    text: 'Modificar',
                    action: 'edit',
                    iconCls: 'modificar'
                },
                {
                    text: 'Eliminar',
                    action: 'del',
                    iconCls: 'eliminar'
                }
            ],
            bbar:
                {
                    xtype: 'pagingtoolbar',
                    store: me.store,
                    dock: 'bottom',
                    pageNumb: true,
                    displayInfo: true
                }
        });

        this.items = [this.grid];

        this.btnSave = Ext.create('Ext.Button',{
            text: this.etiquetas.lbSave,
            tooltip: this.etiquetas.qtipApply,
            iconCls: 'guardar',
            disabled: true,
            action: 'save'
        });

        this.btnCancel = Ext.create('Ext.Button',{
            text: this.etiquetas.lbBtnCancel,
            tooltip: this.etiquetas.qtipCancel,
            iconCls: 'cancelar',
            action: 'cancel'
        });

        // this.buttons = [this.btnCancel,this.btnSave];

        this.callParent();
    }
});
