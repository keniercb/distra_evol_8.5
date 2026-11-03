/**
 * Componente para mostrar la ventana de modificar los actos y fuerzas
 * @copyright XETID Cuba
 * @author Ing Grabiel Montero Coello
 * @type {void|*|Object|Queue}
 */
Planificacion.Integracion.WinGestionarFuerzaacto = Ext.extend(Ext.Window, {
    modal: true,
    resizable: false,
    cmp: this.cmp ? this.cmp : false,
    accion: this.accion ? this.accion : false,
    initComponent: function() {
        var me = this;
        var idCmp = me.id;
        me.comps = ExtExtend.Components;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.MapController();
        me.etiquetas = me.controller._getLabel('Map');
        me.directorioImagenes = me.controller._getGlobals('dirImg');
        me.title = this.title ? this.title : 'Window';
        me.width = (me.cmp == 'acto') ? '70%' : 400;
        me.validatorActos = new ExtExtend.FormValidator();
        me.validadorFuerza = new ExtExtend.FormValidator();

        me.btnCancelar = new me.comps.buttons.btnCerrar({
            text: 'Cancelar',
            handler: function() {
                me.close();
            }
        });
        me.btnCerrar = new me.comps.buttons.btnCerrar({
            handler: function() {
                me.close();
            }
        });

        if (me.cmp == 'acto') {
            me.btnEliminar = new me.comps.buttons.btnEliminar({
                tooltip: 'Eliminar acto',
                disabled: true,
                handler: function() {
                    var mensaje = (me.smRow.getSelections().length > 1) ? me.etiquetas.msgActosConfirmar : me.etiquetas.msgActoConfirmar;
                    mostrarMensaje(2, mensaje, function(b) {
                        if (b == 'ok') {
                            me.controller.gestionarActo({
                                accion: 'del',
                                store: me.store,
                                records: me.smRow.getSelections()
                            });
                        }
                    });
                }
            });
            me.btnGuardar = new me.comps.buttons.btnGuardar({
                tooltip:'Guardar acto',
                handler: function() {
                    me.controller.gestionarActo({
                        accion: 'mod',
                        store: me.store,
                        records: me.grid.getChanges()['mod']
                    });
                }
            });
            me.store = new Ext.data.Store({
                autoLoad: {
                    params: {start: 0, limit: 10}
                },
                url: Planificacion.Integracion.UrlModulo + 'map/obtenermapactos',
                reader: new Ext.data.JsonReader({
                    root: 'root', totalProperty: 'cantidad_filas'
                }, [
                    {name: 'idacto'},
                    {name: 'descripcion'},
                    {name: 'denominacion'},
                    {name: 'valorinteres'},
                    {name: 'factibilidadhecho'},
                    {name: 'estabilidadminima'},
                    {name: 'nivelcompulsionmax'},
                    {name: 'factibilidadinstitucional'}
                ]), listeners: {
                    beforeload: function(s) {
                        s.baseParams = {
                            idestudiomap: me.idestudiomap
                        };
                    },
                    load: function() {
                        me.controller.initValidator(me.validatorActos, {grid: me.grid}, [me.btnGuardar]);
                    }
                }
            });
            me.cmRow = new Ext.grid.ColumnModel([
                {hidden: true, dataIndex: 'idacto'}, {
                    header: me.etiquetas.lbDenominacionacto, dataIndex: 'denominacion',
                    editor: new Ext.form.TextField({
                        anchor: '100%',
                        allowBlank: false,
                        name: 'actoDenominacion'
                    })
                }, {
                    header: me.etiquetas.lbDescripcionacto, dataIndex: 'descripcion',
                    id: 'expandir',
                    editor: new Ext.form.TextField({
                        anchor: '100%',
                        name: 'actoDescripcion'
                    })
                }, {
                    header: me.etiquetas.lbValorinteresacto, dataIndex: 'valorinteres',
                    editor: new Ext.form.NumberField({
                        anchor: '100%',
                        name: 'interes',
                        allowBlank: false,
                        minValue: -1, maxValue: 0,
                        minText: me.etiquetas.textN10,
                        maxText: me.etiquetas.textN10
                    })
                }, {
                    header: me.etiquetas.lbFactibilidadacto, dataIndex: 'factibilidadhecho',
                    editor: new Ext.form.NumberField({
                        name: 'hecho',
                        anchor: '100%',
                        allowBlank: false,
                        minValue: 0, maxValue: 1,
                        minText: me.etiquetas.text01,
                        maxText: me.etiquetas.text01
                    })
                }, {
                    header: me.etiquetas.lbEstbilidadacto, dataIndex: 'estabilidadminima',
                    editor: new Ext.form.NumberField({
                        anchor: '100%',
                        allowBlank: false,
                        name: 'estabilidad',
                        minValue: 0, maxValue: 1,
                        minText: me.etiquetas.text01,
                        maxText: me.etiquetas.text01
                    })
                }, {
                    header: me.etiquetas.lbNivelcompulsionacto, dataIndex: 'nivelcompulsionmax',
                    editor: new Ext.form.NumberField({
                        anchor: '100%',
                        allowBlank: false,
                        name: 'compulsion',
                        minValue: 0, maxValue: 1,
                        minText: me.etiquetas.text01,
                        maxText: me.etiquetas.text01
                    })
                }, {
                    header: me.etiquetas.lbFactibilidadinsacto, dataIndex: 'factibilidadinstitucional',
                    editor: new Ext.form.NumberField({
                        anchor: '100%',
                        allowBlank: false,
                        name: 'institucional',
                        minValue: 0, maxValue: 1,
                        minText: me.etiquetas.text01,
                        maxText: me.etiquetas.text01
                    })
                }
            ]);
            me.cmRow.defaultWidth = 150;
            me.smRow = new Ext.grid.RowSelectionModel({
                singleSelect: false,
                listeners: {
                    selectionchange: function(sm) {
                        if (sm.hasSelection()) {
                            me.btnEliminar.enable();
                        } else {
                            me.btnEliminar.disable();
                        }
                    }
                }
            });
            me.grid = new me.comps.containers.grids.rowEditorGrid({
                striperows: true,
                sm: me.smRow,
                cm: me.cmRow,
                store: me.store,
                height: 400,
                title: me.etiquetas.ttlListadoactos,
                autoExpandColumn: 'expandir',
                loadMask: {
                    msg: me.etiquetas.msgLoad,
                    store: me.store
                },
                bbar: new Ext.PagingToolbar({
                    displayInfo: true,
                    store: me.store,
                    pageSize: 10,
                    items: (me.accion == 'mod') ? ['-', me.btnGuardar] : null
                }),
                listeners: {
                    render: function(g) {
                        g.getTopToolbar().hide();
                    }
                }
            });
        }
        if (me.cmp == 'fza') {
            me.btnAceptar = new me.comps.buttons.btnAceptar({
                handler: function() {
                    me.controller.gestionarFuerza({
                        win: me,
                        close: true,
                        accion: 'mod',
                        form: me.form.getForm()
                    });
                }
            });
            me.tf_Denominacion = new me.comps.fields.fieldDenom({
                fieldLabel: me.etiquetas.lbDenominacionfza,
                maxLength: 250,
                anchor: '100%',
                name: 'fzaDenominacion',
                allowBlank: false
            });
            me.ta_Descripcion = new me.comps.fields.fieldDescripcion({
                fieldLabel: me.etiquetas.lbDescripcionfza,
                anchor: '100%',
                name: 'fzaDescripcion'
            });
            me.nf_Peso = new Ext.form.NumberField({
                fieldLabel: me.etiquetas.lbPeso,
                anchor: '30%',
                name: 'peso',
                allowBlank: false
            });
            me.form = new Ext.form.FormPanel({
                frame: true,
                defaults: {
                    xtype: 'fieldset',
                    border: false,
                    style: 'padding:0',
                    autoHeight: true
                },
                items: [{
                        labelAlign: 'top',
                        items: [me.tf_Denominacion, me.ta_Descripcion]
                    }, {
                        labelWidth: 35,
                        items: [me.nf_Peso, {
                                xtype: 'hidden',
                                value: me.record.get('idfuerza'),
                                name: 'idfuerza'
                            }]
                    }], listeners: {
                    render: function(f) {
                        me.tf_Denominacion.setValue(me.record.get('fza'));
                        me.ta_Descripcion.setValue(me.record.get('desc'));
                        me.nf_Peso.setValue(me.record.get('peso'));
                        me.controller.initValidator(me.validadorFuerza, {
                            denom: me.tf_Denominacion,
                            desc: me.ta_Descripcion,
                            peso: me.nf_Peso
                        }, [me.btnAceptar]);
                    }
                }
            });
        }
        me.items = (me.cmp == 'acto') ? me.grid : me.form;
        me.tbar = (me.accion == 'del') ? [me.btnEliminar] : null;
        me.buttons = (me.cmp == 'fza') ? [me.btnCancelar, me.btnAceptar] : [me.btnCerrar];

        me.keys = [
            {
                key: 'x',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function() {
                    me.btnCerrar.handler.call();
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
            },
            {
                key: Ext.EventObject.DELETE,
                scope: me,
                stopEvent: true,
                fn: function() {
                    me.btnEliminar.handler.call();
                }
            },
            {
                key: 'g',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function() {
                    me.btnGuardar.handler.call();
                }
            }
        ];

        Planificacion.Integracion.WinGestionarFuerzaacto.superclass.initComponent.call(me);
    }
});