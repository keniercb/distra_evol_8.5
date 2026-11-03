Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.CausaefectoExport = ExtExtend.Class({
    $extend: Ext.Window,
    height: 150,
    width: 335,
    modal: true,
    resizable: false,
    layout: 'fit',
    initComponent: function() {
        var _this = this;

        _this.title = _this.idioma.titleGuardar;

        _this.fieldNombre = new Ext.form.TextField({
            fieldLabel: _this.idioma.fieldLabelNombreArchivo,
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
            fieldLabel: _this.idioma.fieldLabelFormatoArchivo,
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
                    var format = _this.comboFormato.getValue();
                    var name = _this.fieldNombre.getValue();
                    var id = _this.idDiagram;

                    var svg = d3.select("#" + id).select("svg").attr("version", 1.1).attr("xmlns", "http://www.w3.org/2000/svg").node().outerHTML;
                    var imgsrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
                    var width = d3.select("#" + id).select("svg").node().width.baseVal.value;
                    var height = d3.select("#" + id).select("svg").node().height.baseVal.value;

                    d3.select("#" + id).append("canvas").attr("id", "canvas" + id).attr("width", width).attr("height", height);

                    var image = new Image;
                    image.src = imgsrc;

                    image.onload = function() {
                        var canvas = document.getElementById("canvas" + id);
                        var context = canvas.getContext("2d");
                        context.drawImage(image, 0, 0);
                        var base64 = canvas.toDataURL("image/png");
                        switch (format) {
                            case 'png':
                                {
                                    d3.select("#" + id).append("a")
                                            .attr("id", "a" + id)
                                            .attr("download", name + ".png")
                                            .attr("href", base64);
                                    var a = document.getElementById("a" + id);
                                    a.click();
                                    break;
                                }
                            case 'pdf':
                                {
                                    var pdf = new jsPDF('p', 'mm');
                                    pdf.setFontSize(12);
                                    pdf.text(10, 10, 'Diagrama Causa-Efecto');
                                    pdf.addImage(base64, 'PNG', 0, 20, 200, 150);
                                    setTimeout(function() {
                                        pdf.save(name + '.pdf');
                                    }, 10);
                                    break;
                                }
                        }

                    };
                }
                _this.close();
            }
        });

        _this.btnCancelar = new _this.extendCmp.buttons.btnCancelar({
            handler: function() {
                _this.close();
            }
        });

        _this.buttons = [_this.btnCancelar, _this.btnAceptar];

        Planificacion.Integracion.CausaefectoExport.superclass.initComponent.call(_this);
    }
});
Ext.reg('Planificacion.Integracion.CausaefectoExport', Planificacion.Integracion.CausaefectoExport);






