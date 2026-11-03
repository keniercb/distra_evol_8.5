/**
 * Created by Yudier on 05/08/2015.
 */
Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.ExportarWindowFmpeir = ExtExtend.Class({
    $extend: Ext.Window,
    height: 150,
    width: 315,
    modal: true,
    id: 'exportarfmpeir',
    resizable: false,
    closeAction: 'destroy',
    constrain: true,
    layout: 'border',
    initComponent: function() {
        var me = this;
        me.idCmp = this.id;
        comps = ExtExtend.Components;
        me.storematriz = (me.storematriz) ? me.storematriz : false;
        me.denominacion = (me.denominacion) ? me.denominacion : false;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.FmpeirmatrizController();
        me.etiquetas = me.controller._getLabel('Impactocruzado');
        me.title = me.etiquetas.titleGuardar;

        me.btnAceptar = new comps.buttons.btnAceptar({
            tooltip: 'Exportar datos y cerrar ventana',
            handler: function() {

                if (me.fpanel.getForm().isValid()) {
                    me.controller.exportarResultadoMatriz(me.denominacion, me.fpanel.getForm().getValues(), me.storematriz, me.idproyecto);
                }
                me.close();
            }
        });

        me.btnCancelar = new comps.buttons.btnCancelar({
            tooltip: 'Cerrar ventana sin exportar datos',
            handler: function() {
                me.close();
            }
        });

        me.narchivo = new Ext.form.TextField({
            fieldLabel: me.etiquetas.lbNombreArchivo,
            name: 'narchivo',
            id: 'narchivo' + me.idCmp,
            allowBlank: false,
            width: 170,
            vtype: 'vtalfanumericos'
        });

        me.storeformato = new Ext.data.SimpleStore({
            fields: ['id', 'denominacion', 'formato'],
            data: [[1, 'Portable Document Format(.pdf)', 'pdf'], [2, 'Microsoft Word(.rtf)', 'rtf']]
        });

        me.comboformato = new Ext.form.ComboBox({
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            store: me.storeformato,
            fieldLabel: me.etiquetas.lbFormatoArchivo,
            valueField: 'formato',
            displayField: 'denominacion',
            id: 'farchivo' + me.idCmp,
            name: 'farchivo',
            hiddenName: 'farchivo',
            width: 170,
            allowBlank: false,
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            listeners: {
                select: function(combo, rec, index) {
                    combo.valueField = 'formato';
                }
            }
        });


        me.fpanel = new Ext.form.FormPanel({
            region: 'center',
            id: 'fpanelexportar',
            labelAlign: 'left',
            labelWidth: 110,
            frame: true,
            items: [me.narchivo, me.comboformato]
        });

        me.items = [me.fpanel];

        me.buttons = [me.btnCancelar, me.btnAceptar];

        me.keys = [
            {
                key: 'x',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function() {
                    me.btnCancelar.handler.call();
                }
            },
            {
                key: Ext.EventObject.ENTER,
                scope: me,
                stopEvent: true,
                fn: function() {
                    me.btnAceptar.handler.call();
                }
            }
        ];

        Planificacion.Integracion.ExportarWindowFmpeir.superclass.initComponent.call(me);
    }
});
Ext.reg('Planificacion.Integracion.ExportarWindowFmpeir', Planificacion.Integracion.ExportarWindowFmpeir);
