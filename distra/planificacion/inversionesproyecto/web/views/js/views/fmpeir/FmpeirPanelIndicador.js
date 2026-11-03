Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.FmpeirPanelIndicador = ExtExtend.Class({
    $extend: Ext.Panel,
    region: 'center',
    frame: false,
    layout: 'border',
    border: false,
    initComponent: function() {
        var me = this;
        var bandera = true;
        me.idfuente = false;
        me.fuente = '';
        var comps = ExtExtend.Components;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.FmpeirController();
        me.etiquetas = me.controller._getLabel('Fmpeir');
        me.directorioImagenes = me.controller._getGlobals('dirImg');


        me.btnAyuda = new comps.buttons.btnAyuda({
            icon: perfil.dirImg + 'ayuda.png',
            text: me.etiquetas.btnAyuda,
            tooltip: me.etiquetas.ttpAyuda,
            iconCls: 'btn',
            handler: function() {
                me.controller.mostrarAyuda('matriz_fmpeir');
            }
        });


        me.btnBuscar = new comps.buttons.btnBuscar({
            text: me.etiquetas.btnBuscar,
            tooltip: me.etiquetas.ttpBuscard,
            disabled: true,
            handler: function() {
                if (me.btnBuscar.disabled === false) {
                    me.stIndicador.reload();
                    bandera = false;
                }
            }
        });
        me.btnLimpiar = new comps.buttons.btnLimpiar({
            text: "<u>L</u>impiar",
            tooltip: "Limpiar filtros", disabled: true,
            handler: function() {
                if (me.btnLimpiar.disabled === false) {
                    me.tfDenominacion.reset();
                    me.tfFiltroFuente.reset();
                    me.fuente = '';
                    me.stIndicador.reload();
                    bandera = true;
                    me.filtros();
                }

            }
        });


        me.btnRecargarIndicadores = new comps.buttons.btnActualizar({
            tooltip: 'Actualizar indicadores',
            enabled: true,
            handler: function() {
                me.stIndicador.reload();
            }
        });


        me.btnGuardarIndicadores = new comps.buttons.btnGuardar({
            tooltip: 'Guardar indicador',
            disabled: true,
            handler: function() {
                me.controller._insertItem('indicadores', me);
                me.controller.adicionarIndicador({
                    elementopeir: me.elementopeir,
                    idfuerzamotriz: me.idfuerzamotriz
                });
            }
        });
        me.tfFuente = new Ext.form.TextField({
            fieldLabel: 'Fuente',
            name: 'tfFuente',
            clicksToEdit: 1,
            allowBlank: false,
            anchor: '98%',
            listeners: {
                focus: function(tf) {
                    var winBuscarFuentes = new Ext.actores.comun.window.WinBuscarActorIncidencia({
                        title: 'Buscar fuentes',
                        constrain: true,
                        height: 520,
                        id: 'winBuscarFuentes',
                        verpersona: false
                    });
                    winBuscarFuentes.show();
                    winBuscarFuentes.on('actorseleccionado', function(th, objActor, obj) {
                        if (objActor.getName() === 'DatActor') {
                            me.denominacion = objActor.get('DatEstructura').get('rutaDenom');
                            ;
                        } else if (objActor.getName() === 'DatActorpersona') {
                            var name = objActor.get('DatActor').get('DatEstructura')
                                    .get('denominacion') + ': ' + objActor.get('DatPersona').get('pnombre') + ' ';
                            name += (objActor.get('DatPersona').get('snombre')) ? objActor
                                    .get('DatPersona').get('snombre')
                                    + ' ' : '';
                            name += (objActor.get('DatPersona').get('papellido')) ? objActor.get('DatPersona').get('papellido')
                                    + ' ' : '';
                            name += (objActor.get('DatPersona').get('sapellido')) ? objActor.get('DatPersona').get('sapellido') : '';
                            me.denominacion = name;
                        }
                        me.smIndicador.getSelected().data.idfuente = obj.idactor;
                        tf.setValue(me.denominacion);
                        var record = me.smIndicador.getSelected();
                        record.set('fuente', me.denominacion);
                        record.set('idfuente', obj.idactor);
                    });
                },
                specialkey: function(tf, evt) {
                    if (evt.getKey() == 13) {
                        me.stIndicador.reload();
                        bandera = false
                    }
                }
            }
        });
        me.tfDescripcion = new Ext.form.TextArea({
            fieldLabel: 'Descripción del indicador',
            name: 'tfDescripcion',
            anchor: '98%',
            change: function(tf, nv, ov) {
                if (nv != ov && nv != '')
                    me.editor.setCellValue('descripcion', nv);
            }
        });
        me.tfDenominacion = new Ext.form.TextField({
            fieldLabel: 'Denominación del indicador',
            name: 'tfDenominacion',
            anchor: '98%',
            enableKeyEvents: true,
            listeners: {
                specialkey: function(tf, evt) {
                    if (evt.getKey() == 13) {
                        me.stIndicador.reload();
                        bandera = false
                    }
                },
                keyUp: function(tx, ev) {
                    me.filtros();
                }
            }
        });
        me.tfIndicador = new Ext.form.TextField({
            fieldLabel: 'Indicador',
            name: 'tfIndicador',
            anchor: '98%',
            allowBlank: false,
            maxLength: 100
        });

        me.tfFiltroFuente = new Ext.form.TextField({
            name: 'tfFiltroFuente',
            anchor: '98%',
            readOnly: true,
            enableKeyEvents: true,
            listeners: {
                focus: function(tf) {
                    var winBuscarFuentes = new Ext.actores.comun.window.WinBuscarActorIncidencia({
                        title: 'Buscar fuentes',
                        constrain: true,
                        height: 520,
                        id: 'winBuscarFuentesFiltro',
                        verpersona: false
                    });
                    winBuscarFuentes.show();
                    winBuscarFuentes.on('actorseleccionado', function(th, objActor, obj) {
                        if (objActor.getName() === 'DatActor') {
                            //  me.smIndicador.getSelected().data.
                            me.denominacion = objActor.get('DatEstructura').get('rutaDenom');
                            ;
                        } else if (objActor.getName() === 'DatActorpersona') {
                            var name = objActor.get('DatActor').get('DatEstructura')
                                    .get('denominacion') + ': ' + objActor.get('DatPersona').get('pnombre') + ' ';
                            name += (objActor.get('DatPersona').get('snombre')) ? objActor
                                    .get('DatPersona').get('snombre')
                                    + ' ' : '';
                            name += (objActor.get('DatPersona').get('papellido')) ? objActor.get('DatPersona').get('papellido')
                                    + ' ' : '';
                            name += (objActor.get('DatPersona').get('sapellido')) ? objActor.get('DatPersona').get('sapellido') : '';
                            me.denominacion = name;


                        }
                        me.fuente = obj.idactor;
                        tf.setValue(me.denominacion);
                    });
                },
                change: function(tf, nv, ov) {
                    if (nv != ov && nv != '')
                        me.editor.setCellValue('fuente', nv);
                },
                specialkey: function(tf, evt) {
                    if (evt.getKey() == 13) {
                        me.stIndicador.reload();
                    }
                },
                valid: function(tx) {
                    if (!tx) {
                        me.btnBuscar.disable();
                        me.btnLimpiar.disable();
                    }
                    else {
                        me.btnBuscar.enable();
                        me.btnLimpiar.enable();
                    }
                }
            }
        });



        me.smIndicador = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        /**
         * ColumnModel del grid Indicadores
         * @type {Ext.grid.ColumnModel}
         */
        me.cmIndicadores = new Ext.grid.ColumnModel([
            {hidden: true, dataIndex: 'idindicador', hideable :false},
            {
                header: 'Denominación del indicador',
                dataIndex: 'denominacion',
                width: 400,
                editor: me.tfIndicador

            }, {
                header: 'Fuente',
                dataIndex: 'fuente',
                width: 400,
                editor: me.tfFuente

            }, {
                header: 'Descripción del indicador',
                dataIndex: 'descripcion',
                id: 'autoExpand' + me.idCmp,
                width: 600,
                editor: me.tfDescripcion

            }
        ]);
        /**
         * Record del grid de Miembros
         * @type {Object.create}
         */
        me.recIndicador = new Ext.data.Record.create([
            {name: 'idindicadorfmpeir'},
            {name: 'idfuente'},
            {name: 'idfuerzamotriz'},
            {name: 'denominacion'},
            {name: 'fuente'},
            {name: 'descripcionind'},
            {name: 'idelementopeir'},
            {name: 'descripcion'}

        ]);
        //------------------------------------------------------------------------------------------------------------------------
        me.expand = function(hijo) {
            hijo.expand();
            /*Expande recursivamente todos los hijos*/
            if (hijo.childNodes) {
                Ext.each(hijo.childNodes, function(node) {
                    me.expand(node);
                })
            }
        };

        //Creando el nodo raíz del árbol 
        me.tnRoot = new Ext.tree.AsyncTreeNode({
            expanded: true,
            id: 'root'
        });
        me.smTree = new Ext.tree.DefaultSelectionModel({
            singleSelect: true,
            listeners: {
                selectionchange: function(sm, n) {
                    //Cuando se halla seleccionado un nodo en el árbol 
                    if (sm.getSelectedNode() != "") {
                        //Registro el nodo seleccionado en el controlador 
                        me.controller._insertItem('nodoSeleccionado', sm.getSelectedNode());
                        me.panel.focus();
                    }
                }
            }
        });
        me.treepanel = new Ext.tree.TreePanel({
            autoScroll: true,
            split: true,
            checked: true, useArrows: true,
            frame: false,
            region: 'west',
            rootVisible: false,
            expand: true,
            width: 300,
            atoShow: true,
            title: 'PEIR - Elementos',
            autoscroll: true,
            border: true,
            margins: '0 0 5 5',
            cmargins: '0 0 0 0',
            lines: false,
            animCollapse: false, animate: false,
            selModel: me.smTree,
            root: me.tnRoot,
            loader: new Ext.tree.TreeLoader({
                dataUrl: Planificacion.Integracion.UrlModulo + 'fmpeir/obtenerElementopeir',
                listeners: {
                    'beforeload': function(atreeloader, anode) {
                        atreeloader.baseParams.id = anode.attributes.id;
                    },
                    load: function(atreeloader, anode) {
                        if (anode.id === 'root') {
                            me.expand(anode);
                        }
                    }
                }
            })
        });


        me.treepanel.on('click', function(nodo) {
            if (nodo.id !== 'root') {
                me.elementopeir = nodo.attributes.idelementopeir;
                me.idfuerzamotriz = nodo.attributes.idfuerzamotriz;
                if (me.elementopeir) {
                    me.panel.enable();
                    me.panel1.enable();
                    me.btnRecargarIndicadores.enable();
                    me.stIndicador.load({
                        params: {
                            idelementopeir: me.elementopeir,
                            idfuerzamotriz: me.idfuerzamotriz,
                            limit: 20,
                            start: 0
                        }
                    });
                }
            }
            else
                me.panel.disable();
        });
        //---------------------------------------------------------------------------
        /**
         * Store del grid Indicador
         * @type {Std.Base.Componentes.Svn.Views.Data.Store}
         */
        me.stIndicador = new Ext.data.Store({
            url: Planificacion.Integracion.UrlModulo + 'fmpeir/obtenerIndicador',
            reader: new Ext.data.JsonReader({
                root: 'data', id: 'idindicadorfmpeir',
                totalProperty: 'cantidad'
            }, me.recIndicador),
            listeners: {
                beforeload: function(thisst, obj) {
                    thisst.baseParams = {
                        denominacion: me.tfDenominacion.getValue(),
                        fuente: me.fuente,
                        idelementopeir: me.elementopeir,
                        idfuerzamotriz: me.idfuerzamotriz

                    };
                },
                load: function() {
                    if (!me.smIndicador.hasSelection()) {
                        if (me.stIndicador.getCount() == 0) {
                            if (((me.tfDenominacion.getValue != "" && me.tfDenominacion.getValue != undefined) || me.tfFiltroFuente.getValue() != "") && !bandera) {
                                mostrarMensaje(1, "No existen datos que se correspondan con los criterios de búsqueda especificados.", function() {
                                });
                            } else {
                                mostrarMensaje(1, 'No existen datos que mostrar.', function() {
                                });
                            }
                        }
                    }
                    me.initValidatorIndicadores();

                }
            }
        });



        me.gridIndicadores = new comps.containers.grids.rowEditorGrid({
            region: 'center',
            autoScroll: true, collapsible: false,
            stripeRows: true,
            store: me.stIndicador, addButtonTTip: 'indicador',
            delButtonTTip: 'indicador',
            delButtonMsg: '¿Está seguro que desea eliminar el indicador seleccionada?',
            clicksToEdit: 2,
            //ctCls: 'x-grid3-row-selected',
            editable: true,
            //overCls: 'x-grid3-row-over',
            defaults: {autoScroll: true},
            plugins: [new comps.plugins.grid.changesValidator],
            cls: 'MseceezsRowWrap',
            viewConfig: {
                getRowClass: function (rec, idx, p, store) {
                    return 'MseceezsRowWrap';
                }
            },
            sm: me.smIndicador, autoExpandColumn: 'autoExpand' + me.idCmp,
            loadMask: new Ext.LoadMask(Ext.getBody(),
                    {msg: 'Cargando...'}),
            cm: me.cmIndicadores,
            tbarButtons: ['->', me.btnAyuda],
            bbar: ['->', me.btnRecargarIndicadores, me.btnGuardarIndicadores]

        });


        me.panel1 = new Ext.Panel({
            id: 'panel1', disabled: true,
            region: 'north',
            height: 20,
            tbar: ['Denominación del indicador:', me.tfDenominacion, '', 'Fuente: ', me.tfFiltroFuente, '-', me.btnBuscar, me.btnLimpiar]
        });

        me.panel = new Ext.Panel({
            id: 'panel',
            layout: 'border',
            disabled: true,
            region: 'center',
            width: '40%',
            height: 150,
            tbar: me.gridIndicadores.getTopToolbar(),
            items: [me.gridIndicadores, me.panel1]
        });



        me.items = [me.treepanel, me.panel];

        me.keys = [
            {
                key: 'i',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function() {
                    me.gridIndicadores.onAdd();
                }
            },
            {
                key: Ext.EventObject.DELETE,
                scope: me,
                stopEvent: true,
                fn: function() {
                    me.gridIndicadores.onDel();
                }
            },
            {
                key: 'h',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function() {
                    me.btnAyuda.handler.call();
                }
            },
            {
                key: 'g',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function() {
                    me.btnGuardarIndicadores.handler.call();
                }
            },
            {
                key: 'z',
                ctrl: true,
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function() {
                    me.btnRecargarIndicadores.handler.call();
                }
            },
            {
                key: 'b',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function() {
                    me.btnBuscar.handler.call();
                }
            },
            {
                key: 'l',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function() {
                    me.btnLimpiar.handler.call();
                }
            }
        ];

        me.initValidatorIndicadores();
        me.controller._insertItem('indicador', me);
        me.controller._insertItem('smIndicador', me.smIndicador);
        me.controller._insertStore('stIndicador', me.stIndicador);
        Planificacion.Integracion.FmpeirPanelIndicador.superclass.initComponent.call(me);


    },
    initValidatorIndicadores: function() {
        var me = this;
        var fields = {grid: me.gridIndicadores};
        var botones = [me.btnRecargarIndicadores, me.btnGuardarIndicadores];
        me.initValidator(me.validatorProyecto, fields, botones);
    },
    initValidator: function(validator, fields, buttons) {
        var res = [];
        ExtExtend.Utils.each(fields, function(i, v) {
            res.push(v);
        });
        validator = new ExtExtend.FormValidator({
            buttons: buttons,
            fields: res
        });
    }, filtros: function() {
        if (((this.tfDenominacion.getValue() != '') || (this.tfFiltroFuente.getRawValue() != '')) && (this.tfFiltroFuente.isValid() && this.tfDenominacion.isValid())) {
            this.btnBuscar.enable();
        } else {
            this.btnBuscar.disable();
        }
        if (((this.tfDenominacion.getValue() === '') && (this.tfFiltroFuente.getRawValue() === '') && !this.search)) {
            this.btnLimpiar.disable();
        } else {
            this.btnLimpiar.enable();
        }

    },
});
Ext.reg('Planificacion.Integracion.FmpeirPanelIndicador', Planificacion.Integracion.FmpeirPanelIndicador);