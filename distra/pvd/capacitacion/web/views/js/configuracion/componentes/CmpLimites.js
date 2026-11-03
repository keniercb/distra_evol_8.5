
/*
 * Componente Limites.
 *
 * @author Ing. Yaricel Guerra Velázquez
 * @package Pvd.Capacitacion
 * @uses Pvd.Capacitacion.Configuracion.Configuraciones
 * @copyright XETID
 * @version 1.0
 */ 
 
Ext.ns("Pvd.Capacitacion.Configuracion.Configuraciones");
Pvd.Capacitacion.Configuracion.Configuraciones.Limites = Ext.extend(Ext.Panel,{
    layout: 'fit',
    id: 'limites01',
    title: 'L&iacute;mites',
    region: 'center',
    height: '100%',
    closable: true,
    iconCls: '',
    initComponent: function () {
        //Variables
        var self = this;

        this.btnGuardar = new Ext.Button({
            id: 'btnGuardar',
            text: '<u>G</u>uardar',
            disabled: true,
            tooltip: 'Guardar datos <b>(Alt+G)</b>',
            iconCls: 'guardar',
            handler: function() {
                var datos = new Array();
                if (self.stLimites.modified.length > 0) {
                    Ext.each(self.stLimites.modified, function (recs) {
                        datos.push(recs.data);
                    });

                    PVD.mostrarMascara('mascaraEnviarDatos', 'Información', 'Enviando datos...');
                    Ext.Ajax.request({
                        url: '/pvd/capacitacion/index.php/conflimites/updateLimite',
                        method: 'POST',
                        timeout: 1800000,
                        params: {
                            limites: Ext.encode(datos)
                        },
                        callback: function () {
                            PVD.ocultarMascara('mascaraEnviarDatos');
                        },
                        success: function () {
                            mostrarMensaje(1, 'Los datos han sido guardados satisfactoriamente.');
                            self.stLimites.reload();
                        }
                    });
                } else {
                    mostrarMensaje(1, 'No ha realizado cambios en los valores.');
                }
            }
        });

        //Fuente de datos del listado.
        this.stLimites = new Ext.data.Store({
            url: '/pvd/capacitacion/index.php/conflimites/getLimites',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idlimite"},
                [{name:'idlimite'},{name:'denominacion'}, {name:'valor'}, {name:'descripcion'}]
            ),
            listeners: {
                load: function () {
                    self.btnGuardar.disable();
                }
            }
        });

        this.stLimites.load();

        function mostrartt(val, metaData) {
            if (val) {
                metaData.attr = 'ext:qtip="No gestionable"';
            }
            return val;
        }

        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        this.nfValor = new Ext.form.NumberField({
            allowBlank: false,
            minLength: 1,
            maxLength: 2,
            enableKeyEvents: true,
            allowDecimals: false,
            minValue: 1,
            maxValue: 99
        });

        //Listado de necesidades de capacitacion.
        this.gpLimites = new Ext.grid.EditorGridPanel({
            store: this.stLimites,
            plugins: this.expander,
            clicksToEdit: 1,
            tbar: [this.btnGuardar],
            columns: [this.expander,
                {
                    header: 'Denominaci&oacute;n',
                    width: 450,
                    dataIndex: 'denominacion',
                    renderer: mostrartt
                },
                {
                    header: 'Valor (meses)',
                    width:100,
                    dataIndex: 'valor',
                    editor: this.nfValor
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stLimites,
                displayInfo: true
            }),
            listeners: {
                afteredit : function () {
                    self.btnGuardar.enable();
                }
            }
        });

        this.items = [this.gpLimites];

        self.on('render', function ()
        {
            self.gpLimites.focus();
        });


        this.keys = [
            {
                key: 'g',
                alt: true,
                fn: function () {
                    if (!self.btnGuardar.disabled) {
                        self.btnGuardar.handler();
                    }

                }
            }
        ];

        Pvd.Capacitacion.Configuracion.Configuraciones.Limites.superclass.initComponent.call(this);
    }
});
