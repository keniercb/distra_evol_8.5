Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.GanttExport = ExtExtend.Class({
    $extend: Ext.Window,
    height: 150,
    width: 335,
    modal: true,
    resizable: false,
    layout: 'fit',
    initComponent: function() {
        var _this = this;

        _this.title = _this.etiquetas.titleGuardar;

        _this.fieldNombre = new Ext.form.TextField({
            fieldLabel: _this.etiquetas.fieldLabelNombreArchivo,
            name: 'nombre',
            allowBlank: false,
            anchor: '100%',
            vtype: 'vtalfanumericos'
        });

        _this.storeFormato = new Ext.data.SimpleStore({
            fields: ['id', 'denominacion', 'formato'],
            data: [[1, 'Portable Document Format(.pdf)', 'pdf'], [2, 'Portable Network Graphics(.png)', 'png']]
        });

        _this.comboFormato = new Ext.form.ComboBox({
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            store: _this.storeFormato,
            fieldLabel: _this.etiquetas.fieldLabelFormatoArchivo,
            valueField: 'formato',
            displayField: 'denominacion',
            name: 'formato',
            hiddenName: 'formato',
            anchor: '100%',
            allowBlank: false,
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true
        });

        _this.formPanel = new Ext.form.FormPanel({
            frame: true,
            items: [{
                    layout: 'column',
                    items: [
                        {
                            layout: 'form',
                            columnWidth: 1,
                            labelAlign: 'left',
                            items: [_this.fieldNombre]
                        }
                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {
                            layout: 'form',
                            columnWidth: 1,
                            labelAlign: 'left',
                            items: [_this.comboFormato]
                        }
                    ]
                }
            ]
        });

        _this.items = [_this.formPanel];

        _this.btnAceptar = new _this.extendCmp.buttons.btnAceptar({
            handler: function() {
                if (_this.formPanel.getForm().isValid()) {
                    var name = _this.fieldNombre.getValue();
                    var format = _this.comboFormato.getValue();
                    var id = 'gantt-' + _this.idGanttDiagram;
                    var element = document.getElementById(id);
                    html2canvas(element, {
                        onrendered: function(canvas) {
                            var base64 = canvas.toDataURL('data:image/png;base64;');                            
                            switch (format) {
                                case 'png':
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
                                        pdf.text(10, 10, 'Diagrama de Gantt');
                                        pdf.addImage(base64, 'PNG', 5, 20, 200, 150);
                                        setTimeout(function() {
                                            pdf.save(name + '.pdf');
                                        }, 10);
                                        break;
                                    }
                            }
                        }
                    });
                    _this.close();
                }
            }
        });

        _this.btnCancelar = new _this.extendCmp.buttons.btnCancelar({
            handler: function() {
                _this.close();
            }
        });

        _this.buttons = [_this.btnCancelar, _this.btnAceptar];

        Planificacion.Integracion.GanttExport.superclass.initComponent.call(_this);
    }
});
Ext.reg('Planificacion.Integracion.GanttExport', Planificacion.Integracion.GanttExport);



