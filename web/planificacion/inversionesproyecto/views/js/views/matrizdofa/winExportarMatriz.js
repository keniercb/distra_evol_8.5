Planificacion.Integracion.exportarMatriz = ExtExtend.Class({
    $extend: Ext.Window,
    width: 300,
    height: 190,
    modal: true,
    layout: 'fit',
    closeAction: 'destroy',
    resizable: false,
    initComponent: function () {
        var me = this,
            comps = ExtExtend.Components;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.MatrizdofaController();
        me.etiquetas = me.controller._getLabel('Matrizdofa');
        me.directorioImagenes = me.controller._getGlobals('dirImg');
        me.title = me.etiquetas.guardarComo;

        me.btnCancelar = new comps.buttons.btnCancelar({
            handler: function () {
                me.close();
            }
        });
        me.btnAceptar = new comps.buttons.btnAceptar({
            handler: function () {
                me.controller.ExportarDocumento({
                    idestudiomatriz: parseInt(me.idestudiomatriz),
                    idproyecto: parseInt(me.idproyecto),
                    descargar: true
                });
            }
        });

        me.nombreArchivo = new comps.fields.fieldDenom({
            fieldLabel: me.etiquetas.lbNombreArchivo,
            anchor: '100%'
        });
        me.stFormatoArchivo = new Ext.data.SimpleStore({
            fields: ['idformato', 'denominacion'],
            data: [
                [1, 'xls']
            ]
        });
        me.cbFormatoArchivo = new comps.fields.simpleComboBox({
            fieldLabel: me.etiquetas.factorClave,
            store: me.stFormatoArchivo,
            id: 'cbFormatoArchivo',
            triggerAction: 'all',
            editable: false,
            emptyText: me.etiquetas.emptyText,
            displayField: 'denominacion',
            valueField: 'denominacion',
            extendField: 'descripcion',
            allowBlank: false,
            disableBanned: true,
            mode: 'local',
            anchor: '100%'
        });
        me.panel = new Ext.form.FormPanel({
            frame: true,
            labelAlign: 'top',
            items: [me.nombreArchivo, me.cbFormatoArchivo]



        });
        me.buttons = [me.btnCancelar, me.btnAceptar];
        me.items = [
            me.panel
        ];

        me.on('show', function () {
            me.validator = new ExtExtend.FormValidator({
                buttons: [me.btnAceptar],
                fields: [
                    me.nombreArchivo,
                    me.cbFormatoArchivo
                ]
            });
        });


        Planificacion.Integracion.exportarMatriz.superclass.initComponent.call(me);
    }

});
Ext.reg('Planificacion.Integracion.exportarMatriz', Planificacion.Integracion.exportarMatriz);