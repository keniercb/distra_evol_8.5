Ext.define('GestionContratoImportacion.view.FormaPago.Cronograma.PanelCronograma', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.panelcronogramaimportacion',
    layout: 'border',
    frame: false,
    border: false,
    requires: [
        'GestionContratoImportacion.view.FormaPago.Cronograma.TreeActividades'
    ],
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);
        me.frame = false;
        me.border = false;

        me.title = me.etiquetas.lbCronograma;

        me.stTipoCronograma = this.store = Ext.create('Ext.data.Store', {
            fields: [
                {name: 'idtipo'},
                {name: 'nombre'}
            ],
            data: [{idtipo: 1, nombre: 'Plantilla'}, {idtipo: 2, nombre: 'Proyecto'}]
        });

        me.cmbTipoCronograma = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbTipoCronograma,
            autoExpand: false,
            store: me.stTipoCronograma,
            valueField: 'idtipo',
            displayField: 'nombre',
            mode: 'local',
            typeAhead: true,
            margin: '0 10 0 0',
            labelAlign: 'left',
            labelWidth: 35,
            columnWidth: 0.25,
            value: 1,
            name:'tipocronograma'
        });

        me.stProyectosPlantillas = this.store = Ext.create('Ext.data.Store', {
            storeId: 'proyectoPlantillaStore',
            fields: [
                {name: 'idplantilla'},
                {name: 'denominacion'}
            ],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getPlantillasProyectos'}, ModuleMgr.get('GestionContratoImportacion')),
                actionMethods: {
                    read: 'POST'
                },
                reader: {
                    root: 'data',
                    totalProperty: 'cant',
                    idProperty: 'idplantilla',
                    successProperty: 'success'
                }
            }
        });

        me.cmbProyectosPlantillas = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: me.etiquetas.lbPlantillaProyecto,
            autoExpand: false,
            store: me.stProyectosPlantillas,
            valueField: 'idplantilla',
            displayField: 'denominacion',
            minChars: 0,
            pageSize: 10,
            mode: 'remote',
            queryParam: 'denominacion',
            labelAlign: 'left',
            columnWidth: 0.55,
            name:'proyectoplantilla'
        });

        me.treeActividades = Ext.create('GestionContratoImportacion.view.FormaPago.Cronograma.TreeActividades', {
            region: 'center'
        });

        me.form = Ext.create('Ext.form.Panel', {
            layout: 'column',
            bodyStyle: 'background:#DFE9F6;padding-top:2px;',
            border: false,
            region: 'north',
            height: 30,
            items: [me.cmbTipoCronograma, me.cmbProyectosPlantillas]
        });

        me.items = [me.form, me.treeActividades];

        me.callParent();
    }
});
