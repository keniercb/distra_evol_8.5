/**
 * Created by Yudier on 05/08/2015.
 */
Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.ExportarWindowRelaciones = ExtExtend.Class({
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
        me.storeimpacto = (me.storeimpacto) ? me.storeimpacto : false;
        me.denominacion = (me.denominacion) ? me.denominacion : false;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.MatrizrelacionesController();
        me.etiquetas = me.controller._getLabel('Impactocruzado');
        me.title = me.etiquetas.titleGuardar;

        me.btnAceptar = new Ext.Button({
            text: 'Aceptar',
            icon: perfil.dirImg + 'aceptar.png',
            tooltip: 'Exportar datos y cerrar ventana',
            iconCls: 'btn',
            handler: function() {
                if (me.fpanel.getForm().isValid()) {
                    var a = me.fpanel.getForm().getValues();
                    if (a['farchivo'] == 'rtf') {
                        me.export('doc');
                    }
                    if (a['farchivo'] == 'pdf') {
                        me.export('pdf');
                    }
                    me.close();
                }
            }
        });

        me.btnCancelar = new Ext.Button({
            text: 'Cerrar',
            icon: perfil.dirImg + 'cerrar.png',
            tooltip: 'Cerrar ventana sin exportar datos',
            iconCls: 'btn',
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
            data: [[1, 'Format pdf(.pdf)', 'pdf'], [2, 'Format Microsoft Word(.rtf)', 'rtf']]
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

        Planificacion.Integracion.ExportarWindowRelaciones.superclass.initComponent.call(me);
    },
    export: function(type) {

        var me = this, thead = "<thead class='x-grid3-summary-row x-grid3-header'>", tbody = "<tbody>", tr, td;

        for (var key in me.colModel.config) {
            if (me.colModel.config[key].hidden !== true && typeof me.colModel.config[key] !== "function") {
                thead += "<th width=" + me.colModel.config[key].width + ">" + me.colModel.config[key].header + "</th>";
            }
        }

        me.store.data.each(function(row) {
            tr = "<tr>";
            for (var key in me.colModel.config) {
                if (me.colModel.config[key].hidden !== true && typeof me.colModel.config[key] !== "function" && me.colModel.config.hasOwnProperty(key) && row.data.hasOwnProperty(me.colModel.config[key].dataIndex)) {

                    if (me.colModel.config[key].dataIndex === "denominacion") {
                        tr += "<td class='x-grid3-colname'>" + me.datarender(row.data[me.colModel.config[key].dataIndex]) + "</td>";
                    } else {
                        tr += "<td>" + me.datarender(row.data[me.colModel.config[key].dataIndex]) + "</td>";
                    }
                }
            }
            tbody += tr + "</tr>"
        });
        var exporthtml = "<div class='portlet-body'><table id='tableid'>" + thead + "</thead>" + tbody + "</tbody></table></div>";
//        var windtab = new Ext.Window({
//            id: this.id + me.id,
//            html: exporthtml
//        });
//        windtab.show();


        var filename = "newfile";
        me.controller._insertItem('matrizrelaciones', me);
        me.controller.export(type, filename, exporthtml);
//        $("#tableid").tableExport({type: type, escape: 'false'});
    }
});
Ext.reg('Planificacion.Integracion.ExportarWindowRelaciones', Planificacion.Integracion.ExportarWindowRelaciones);
