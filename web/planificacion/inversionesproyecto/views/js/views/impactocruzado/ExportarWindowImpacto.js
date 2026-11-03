/**
 * Created by Yudier on 05/08/2015.
 */
Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.ExportarWindowImpacto = ExtExtend.Class({
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
        me.flujo = (me.flujo) ? me.flujo : false
        me.storeimpacto = (me.store) ? me.store : false;
        me.denominacion = (me.denominacion) ? me.denominacion : false;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.ImpactocruzadoController();
        me.etiquetas = me.controller._getLabel('Impactocruzado');
        me.title = me.etiquetas.titleGuardar;

        me.btnAceptar = new comps.buttons.btnAceptar({
            tooltip: 'Exportar datos y cerrar ventana',
            handler: function() {
                if (me.fpanel.getForm().isValid()) {
                    if (me.flujo) {
                        var name = me.narchivo.getValue();
                        var format = me.comboformato.getValue();
                        var id = 'panelgraficaflujo';
                        var element = document.getElementById(id);
                        html2canvas(element, {
                            onrendered: function(canvas) {
                                var base64 = canvas.toDataURL('data:image/png;base64;');
                                switch (format) {
                                    case 'PNG':
                                        {
                                            var a = document.createElement("a");
                                            a.setAttribute("id", "a" + id);
                                            a.setAttribute("download", name + ".png");
                                            a.setAttribute("href", base64);
                                            element.appendChild(a);
                                            a.click();
                                            break;
                                        }
                                    case 'pdf':
                                        {
                                            var pdf = new jsPDF('p', 'mm');
                                            pdf.setFontSize(12);
                                            pdf.text(10, 10, 'Diagrama de flujos causales');
                                            pdf.addImage(base64, 'PNG', 5, 20, 200, 150);
                                            setTimeout(function() {
                                                pdf.save(name + '.pdf');
                                            }, 10);
                                            break;
                                        }
                                }
                            }
                        });
//                        $("#myflujo").tableExport({type: 'png', escape: 'false'});
                    } else
                        me.controller.exportarResultadoImpacto(me.denominacion, me.fpanel.getForm().getValues(), me.storeimpacto);
                    me.close();
                }
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
        var array = [];
        (me.flujo) ? array = [[1, 'Format png(.PNG)', 'PNG']] : array = [[1, 'Format pdf(.pdf)', 'pdf'], [2, 'Format Microsoft Word(.rtf)', 'rtf'], [3, 'Format png(.PNG)', 'PNG']];
        me.storeformato = new Ext.data.SimpleStore({
            fields: ['id', 'denominacion', 'formato'],
            data: array
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

        Planificacion.Integracion.ExportarWindowImpacto.superclass.initComponent.call(me);
    }
});
Ext.reg('Planificacion.Integracion.ExportarWindowImpacto', Planificacion.Integracion.ExportarWindowImpacto);


