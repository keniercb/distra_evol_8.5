Planificacion.Integracion.WinExportarResultados = ExtExtend.Class({
    $extend: Ext.Window,
    height: 150,
    width: 340,
    modal: true,
    id: 'WinExportarResultados',
    resizable: false,
    closeAction: 'destroy',
    constrain: true,
    layout: 'border',
    title: 'Guardar como',
    initComponent: function() {
        var me = this;
        me.idCmp = this.id;
        comps = ExtExtend.Components;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.MapController();
        me.etiquetas = me.controller._getLabel('Map');
        me.directorioImagenes = me.controller._getGlobals('dirImg');
        me.idestudiomap = (me.idestudiomap) ? me.idestudiomap : 0;

        me.btnAceptar = new comps.buttons.btnAceptar({
            disabled: true,
            tooltip: 'Exportar datos y cerrar ventana',
            handler: function() {
                me.controller.exportarResultados(me.idestudiomap, me.fpanel.getForm().getValues(), me);    
                me.close();
            }
        });

        me.btnCancelar = new comps.buttons.btnCancelar({
            tooltip: 'Cerrar ventana sin exportar datos',
            handler: function() {
                me.close();
            }
        });

        me.narchivo = new comps.fields.simpleField({
            fieldLabel: me.etiquetas.lbNombreArchivo,
            name: 'narchivo',
            id: 'narchivo' + me.idCmp,
            allowBlank: false,
            width: 195,
            vtype: 'vtalfanumericos'
        });

        me.storeformato = new Ext.data.SimpleStore({
            fields: ['id', 'denominacion', 'formato'],
            data: [[1, 'Portable Document Format(.pdf)', 'pdf'], [2, 'Microsoft Word(.rtf)', 'rtf']]
        });

        me.comboformato = new comps.fields.simpleComboBox({
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            store: me.storeformato,
            fieldLabel: me.etiquetas.lbFormatoArchivo,
            valueField: 'formato',
            displayField: 'denominacion',
            id: 'farchivo' + me.idCmp,
            name: 'farchivo',
            hiddenName: 'farchivo',
            width: 195,
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

        Planificacion.Integracion.WinExportarResultados.superclass.initComponent.call(me);

        me.on('show', function() {
            var me = this;
            me.validator = new ExtExtend.FormValidator({
                checkDirty: true,
                buttons: [me.btnAceptar],
                fields: [
                    me.narchivo,
                    me.comboformato
                ]
            });
        });
    }
});
Ext.reg('Planificacion.Integracion.WinExportarResultados', Planificacion.Integracion.WinExportarResultados);

