/**
 * Componente Curva de conflicto
 *
 * @copyright XETID Cuba
 * @author Ing. Frank David Corona Prendes
 * @version 1.0
 */
Planificacion.Integracion.MapComponent = ExtExtend.Class({
    $extend: Ext.Panel,
    border: false,
    layout: 'fit',
    region: 'center',
    initComponent: function() {
        var me = this;
        var idCmp = this.id;
        me.comps = ExtExtend.Components;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.MapController();
        me.etiquetas = me.controller._getLabel('Map');
        me.directorioImagenes = me.controller._getGlobals('dirImg');
        me.objproyecto = this.objproyecto ? this.objproyecto : new DatMap();
        me.conceptoproyecto = me.conceptoproyecto ? me.conceptoproyecto : null;

        me.btnAdicionar = new me.comps.buttons.btnAdicionar({
            tooltip: 'Adicionar fuerza o acto',
            handler: function() {
                me.controller.mostrarVentanaAdicionar({
                    accion: 'ins',
                    controller: me.controller
                });
            }
        });
        me.btnModificar = new Ext.SplitButton({
            text: 'Modificar',
            disabled: true,
            iconCls: 'extExtend_modificar',
            tooltip: 'Modificar fuerza o actos',
            menu: new Ext.menu.Menu({
                items: [{
                        text: 'Modificar actos',
                        handler: function() {
                            me.controller.mostrarWinGestion({
                                cmp: 'acto',
                                accion: 'mod',
                                controller: me.controller,
                                idestudiomap: me.idestudiomap,
                                title: me.etiquetas.ttlModActo
                            });
                        }
                    }, {
                        text: 'Modificar fuerza',
                        handler: function() {
                            me.controller.mostrarWinGestion({
                                cmp: 'fza',
                                accion: 'mod',
                                controller: me.controller,
                                record: smMatriz.getSelected(),
                                title: me.etiquetas.ttlModFuerza
                            });
                        }
                    }]
            })
        });
        me.btnEliminar = new Ext.SplitButton({
            iconCls: 'extExtend_eliminar',
            text: 'Eliminar',
            disabled: true,
            tooltip: 'Eliminar fuerza o actos',
            menu: new Ext.menu.Menu({
                items: [{
                        text: 'Eliminar actos',
                        handler: function() {
                            me.controller.mostrarWinGestion({
                                cmp: 'acto',
                                accion: 'del',
                                controller: me.controller,
                                idestudiomap: me.idestudiomap,
                                title: me.etiquetas.ttlDelActo
                            })
                        }
                    }, {
                        text: 'Eliminar fuerza',
                        handler: function() {
                            mostrarMensaje(2, me.etiquetas.msgFzaConfirmar, function(b) {
                                if (b == 'ok') {
                                    me.controller.gestionarFuerza({
                                        accion: 'del',
                                        record: smMatriz.getSelected()
                                    });
                                }
                            });
                        }
                    }]
            })
        });
        me.btnGuardar = new me.comps.buttons.btnGuardar({
            tooltip: 'Guardar datos de la matriz',
            disabled: true,
            handler: function() {
                me.controller._insertItem('objeto', me);
                me.controller.guardarDatosMatriz({
                    records: me.gpMatriz.getStore().getModifiedRecords()
                });
            }
        });
        me.btnObtenerresultado = new me.comps.Button({
            disabled: true,
            text: me.etiquetas.btnObtenerresultado,
            tooltip: 'Obtener resumen del análisis político',
            icon: perfil.dirImg + 'ver.png',
            iconCls: 'btn',
            handler: function() {
                me.controller.obtenerResultado({
                    records: me.gpMatriz.getStore().getModifiedRecords(), objproyecto: me.objproyecto, altura: me.altura + 25, ancho: me.ancho
                });
            }
        });
        me.btnGenerarresultado = new me.comps.Button({
            disabled: true,
            text: me.etiquetas.btnGenerarresultado,
            tooltip: 'Generar resultado del análisis político',
            icon: perfil.dirImg + 'generadorreportes.png',
            iconCls: 'btn',
            handler: function() {
                me.controller.generarResultado({
                    records: me.gpMatriz.getStore().getModifiedRecords(), altura: me.altura
                });
            }
        });
		
		 me.btnExportar = new me.comps.buttons.btnExportar({
                handler: function() {
                     params = {
                         idestudiomap: me.idestudiomap ? me.idestudiomap : me.objproyecto.get('idestudiomap'),
                         denominacion: me.objproyecto.get('denominacion')
                     }
                    me.controller.obtenerReporte(params);
                }
            });
		
        me.btnAyuda = new me.comps.buttons.btnAyuda({
            tooltip: 'Mostrar ayuda de la funcionalidad',
            id: 'btnAyuda',
            handler: function() {
                me.controller.mostrarAyuda('analisis_politico');
            }
        });

        var smMatriz = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                selectionchange: function(sm) {
                    if (sm.hasSelection()) {
                        me.btnModificar.enable();
                        me.btnEliminar.enable();
                    } else {
                        me.btnModificar.disable();
                        me.btnEliminar.disable();
                    }
                }
            }
        });
        var cmMatriz = new Ext.grid.ColumnModel([]);
        cmMatriz.headers = [[], []];

        me.validado = false;
        me.gpMatriz = new Ext.grid.EditorGridPanel({
            region: 'center',
            stripeRows: true,
            title: me.etiquetas.ttlMatriz,
            cm: cmMatriz,
            sm: smMatriz,
            frame: true,
            autoScroll: true,
            plugins: [new Ext.ux.plugins.XGrid()],
            store: new Ext.data.SimpleStore({
                fields: []
            }), 
            bbar: ['->',me.btnGuardar],
            listeners: {
                afteredit: function(e) {
                    me.controller._insertItem('objeto', me);
                    me.controller.validarMatriz(me.gpMatriz.getStore());
                    me.controller.habilitarGuardar(me.gpMatriz.getStore(), me.btnGuardar, me.btnGenerarresultado, me.btnObtenerresultado);
                },
                validateedit: function(e) {
                    //
                }
            }
        });
        me.items = [me.gpMatriz];
        me.tbar = [me.btnAdicionar, '-', me.btnModificar, '-', me.btnEliminar, '-', me.btnGenerarresultado, me.btnObtenerresultado, me.btnExportar, '->', me.btnAyuda];        

        me.controller._insertItem('mapPanel', me);
        me.controller._insertItem('smMatriz', smMatriz);
        me.controller._insertItem('gridMatriz', me.gpMatriz);
        me.controller._insertItem('componentes', me.comps);
        me.controller._insertItem('btnEliminar', me.btnEliminar);
        me.controller._insertItem('btnModificar', me.btnModificar);
        me.controller._insertItem('btnGuardar', me.btnGuardar);
        me.controller._insertItem('idestudiomap', me.idestudiomap);

        me.keys = [{
                key: 'i',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function() {
                    me.btnAdicionar.handler.call();
                }
            },{
                key: 'h',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function() {
                    me.btnAyuda.handler.call();
                }
            }
        ];
        me.altura = 0;

        this.on('resize', function (obj, adjWidth, adjHeight, rawWidth, rawHeight) {
            me.altura = adjHeight;
            me.ancho = adjWidth;
        });

        Planificacion.Integracion.MapComponent.superclass.initComponent.call(me);
    },
    listeners: {
        show: function() {
            var me = this;
            me.controller.construirMatriz(me.btnGenerarresultado, me.btnObtenerresultado);
        }
    }
});
Ext.reg('Planificacion.Integracion.MapComponent', Planificacion.Integracion.MapComponent);