var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('concepto', cargarInterfaz);
function cargarInterfaz() {
    var colorMenu = new Ext.menu.ColorMenu({
        listeners: {
            select: function(p, color) {
                Ext.getCmp('color_concepto').setValue(color);
                Ext.get('color_concepto').applyStyles('border:2px solid #' + color);
            }
        }
    });

    /**
     * menu del click derecho del grid
     */
    menuConceptos = new Ext.menu.Menu({
        id: 'menuConceptos',
        //disabled: true,
        listeners: {},
        items: [{
            text: 'Eliminar',
            iconCls: 'eliminar',
            id: 'mdEliminarConceptos',
            tooltip: 'Eliminar concepto',
            handler: function () {

            }
        }]
    });

    var gridconceptos = new Ext.ux.DinamicCrud({
        ayuda: 'Gestionar concepto',
        id: 'crudconceptos',
        showTBarButtons: true,
        form: new Ext.form.FormPanel({
            layout: 'column',
            width: 400,
            name: 'concepto',
            id: 'concepto',
            labelAlign: 'top',
            frame: true,
            items: [
                {
                    layout: 'form',
                    items: {
                        xtype: 'textfield',
                        id: 'denominacion_concepto',
                        allowBlank: false,
                        anchor: '95%',
                        maxLength: 255,
                        regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]*)+$/,
                        regexText: 'Solo admite caracteres alfanuméricos.',
                        fieldLabel: 'Denominación',
                        name: 'denominacion'
                    },
                    columnWidth: .75
                },
                {
                    layout: 'form',
                    items: {
                        xtype: 'textfield',
                        fieldLabel: 'Color',
                        id: 'color_concepto',
                        name: 'color',
                        allowBlank: false,
                        readOnly: true,
                        anchor: '95%'

                    },
                    columnWidth: .15
                },
                {
                    layout: 'form',
                    anchor: '100%',
                    bodyStyle: 'padding-top:18px;',
                    items: new Ext.Button({
                        id: 'btnColor',
                        icon: perfil.dirImg + 'paletacolor.png',
                        iconCls: 'btn',
                        listeners: {
                            click: function(b, event) {
                                event.stopEvent();
                                var xy = event.getXY();
                                colorMenu.showAt(xy);
                            }
                        }
                    }),
                    columnWidth: .1
                },
                {
                    layout: 'form',
                    items: {
                        xtype: 'textarea',
                        id: 'descripcion_concepto',
                        anchor: '97%',
                        maxLength: 255,
                        allowBlank: false,
                        fieldLabel: 'Descripción',
                        name: 'descripcion'
                    },
                    columnWidth: 1
                }
            ]
        }),
        doFilters: true,
        md:menuConceptos,
        store: new Ext.data.Store({
            url: 'cargarconceptos',
            reader: new Ext.data.JsonReader({
                id: 'idconcepto',
                totalProperty: 'total',
                root: 'data'
            }, [
                {
                    name: 'idconcepto'
                },
                {
                    name: 'denominacion',
                    header: 'Denominación',
                    width: 350,
                    sortable: true,
                    filter: true,
                    type: 'string'
                },
                {
                    name: 'descripcion',
                    header: 'Descripción',
                    width: 350,
                    sortable: true,
                    autoExpandColumn: 'expandir',
                    filter: true,
                    type: 'string'
                },
                {
                    name: 'color',
                    header: 'Color',
                    sortable: true,
                    width: 290,
                    renderer: rendercolor
                }
            ]),
            listeners: {
                'load': function(st) {
                    if (st.getCount() == 0) {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsquedas especificados.');
                    }
                }
            }
        }),
         listeners: {
                rowdblclick: function (_this, row_index, record) {
                },
                rowcontextmenu: function (g, r, e) {
                    e.stopEvent();
                    g.getSelectionModel().selectRow(r);
                    g.md.showAt(e.getXY());

                }
            }
    }
    );
    Ext.getCmp('color_concepto').reset = function() {
        Ext.form.TextField.superclass.reset.call(Ext.getCmp('color_concepto'));
        Ext.getCmp('color_concepto').applyEmptyText();
        Ext.get('color_concepto').applyStyles('border:1px solid #C0C0C0');
        colorMenu.palette.value = null;
    }
    Ext.getCmp('color_concepto').setValue = function(v) {
        Ext.getCmp('color_concepto').value = v;
        if (Ext.getCmp('color_concepto').rendered) {
            Ext.getCmp('color_concepto').el.dom.value = (Ext.isEmpty(v) ? '' : v);
            Ext.getCmp('color_concepto').validate();
            Ext.get('color_concepto').applyStyles('border:2px solid #' + v);
        }
        return Ext.getCmp('color_concepto');
    }

    var myViewI2 = new Ext.Viewport({
        layout: 'fit',
        items: gridconceptos
    });
    gridconceptos.getStore().load({
        params: {
            start: 0,
            limit: 20
        }
    });
    function rendercolor(value, metaData, record, rowIndex, colIndex, store) {
        metaData.attr = 'style="background-color:' + value + ';"';
        return '';
    }
}
