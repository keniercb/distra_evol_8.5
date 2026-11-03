var perfil = window.parent.UCID.portal.perfil;
perfil.etiquetas = Object();
Ext.QuickTips.init();

UCID.portal.cargarEtiquetas('gestvia', cargarInterfaz);
// Etiquetas para copiar para el fichero de lenguaje y temporalmente colocadas

// function CargarInterfaz
function cargarInterfaz() {
    var colorMenu = new Ext.menu.ColorMenu({
        listeners: {
            select: function(p, color) {
                Ext.getCmp('color_viaadquisicion').setValue(color);
                Ext.get('color_viaadquisicion').applyStyles('border:2px solid #' + color);
            }
        }
    });

    var gridviaadquisicions = new Ext.ux.DinamicCrud({
        ayuda: 'Via de adquisicion',
        id: 'crudVIA',
        autoExpandColumn: 'denominacion',
        showTBarButtons: true,
        form: new Ext.form.FormPanel({
            layout: 'column',
            width: 400,
            name: 'viaadquisicion',
            id: 'vía de adquisición',
            labelAlign: 'top',
            frame: true,
            items: [{
                    layout: 'form',
                    items: {
                        xtype: 'textfield',
                        id: 'denominacion_viaadquisicion',
                        allowBlank: false,
                        anchor: '95%',
                        maxLength: 255,
                        maxLengthText: 'El tamañon máximo reuqierido es 255 carácteres',
                        regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-])+$/,
                        maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ_-])$/,
                        regexText: 'Solo admite caracteres alfanuméricos y los caracteres especiales (-),(_).',
                        fieldLabel: 'Denominación',
                        name: 'denominacion'
                    },
                    columnWidth: .75
                }, {
                    layout: 'form',
                    items: {
                        xtype: 'textfield',
                        fieldLabel: 'Color',
                        id: 'color_viaadquisicion',
                        name: 'color',
                        readOnly: true,
                        editable: false,
                        anchor: '95%',
                        allowBlank: false
                    },
                    columnWidth: .15
                }, {
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
                }, {
                    layout: 'form',
                    items: {
                        xtype: 'textarea',
                        id: 'descripcion_viaadquisicion',
                        anchor: '97%',
                        //maxLength: 255,
                        allowBlank: true,
                        fieldLabel: 'Descripción',
                        name: 'descripcion'
                    },
                    columnWidth: 1
                }
            ]
        }),
        doFilters: true,
        store: new Ext.data.Store({
            url: 'cargarviaadquisicion',
            listeners: {
                load: function() {
                    siexisteIndicadorFiltrado();
                }
            },
            reader: new Ext.data.JsonReader({
                id: 'idviaadquisicion',
                totalProperty: 'total',
                root: 'data'
            }, [
                {
                    name: 'idviaadquisicion'
                }, {
                    name: 'denominacion',
                    header: 'Denominación',
                    filter: true,
                    type: 'string',
                    tooltip: 'Denominación',
                    sortable: true,
                    renderer: crearToolTip
                }, {
                    name: 'descripcion',
                    header: 'Descripción',
                    filter: true,
                    type: 'string',
                    tooltip: 'Descripción',
                    sortable: true,
                    renderer: crearToolTip
                }, {
                    name: 'color',
                    header: 'Color',
                    renderer: rendercolor,
                    sortable: false,
                    tooltip: 'Color'
                }
            ])
        })

    }
    );
    Ext.getCmp('color_viaadquisicion').reset = function() {
        Ext.form.TextField.superclass.reset.call(Ext.getCmp('color_viaadquisicion'));
        Ext.getCmp('color_viaadquisicion').applyEmptyText();
        Ext.get('color_viaadquisicion').applyStyles('border:1px solid #C0C0C0');
        colorMenu.palette.value = null;
    };
    Ext.getCmp('color_viaadquisicion').setValue = function(v) {
        Ext.getCmp('color_viaadquisicion').value = v;
        if (Ext.getCmp('color_viaadquisicion').rendered) {
            Ext.getCmp('color_viaadquisicion').el.dom.value = (Ext.isEmpty(v) ? '' : v);
            Ext.getCmp('color_viaadquisicion').validate();
            Ext.get('color_viaadquisicion').applyStyles('border:2px solid #' + v);
        }
        return Ext.getCmp('color_viaadquisicion');
    };

    var myViewI2 = new Ext.Viewport({
        layout: 'fit',
        items: gridviaadquisicions
    });
    gridviaadquisicions.getStore().load({
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
function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}
function siexisteIndicadorFiltrado() {
    if (Ext.getCmp('crudVIA').getStore().getCount() == 0)
        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');

}
