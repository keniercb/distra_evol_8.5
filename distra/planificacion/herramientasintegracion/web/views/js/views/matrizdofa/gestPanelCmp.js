Ext.QuickTips.init();
Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.PanelCriterios = ExtExtend.Class({
    $extend: Ext.Panel,
    region: 'center',
    frame: false,
    layout: 'border',
    border: false,
    initComponent: function () {
        var me = this;
        var bandera = true;
        me.idfuente = false;
        me.fuente = '';
        var comps = ExtExtend.Components;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.MatrizdofaController();
        me.etiquetas = me.controller._getLabel('Fmpeir');
        me.directorioImagenes = me.controller._getGlobals('dirImg');
        me.dfFechaInicio = new comps.fields.dateField({
            fieldLabel: 'Fecha de inicio',
            anchor: "100%",
            name: 'fechaini',
            vtype: 'daterange',
            format: 'd/m/Y',
            emptyText: 'Seleccione...',
            allowBlank: true,listeners:{
                keyUp: function (tx, ev) {
                    me.filtros();
                },
                select:function(tx,ev){
                    me.filtros();
                }
            }
        });

        me.dfFechaFin = new comps.fields.dateField({
            fieldLabel: 'Fecha de fin',
            anchor: "100%",
            name: 'fechafin',
            format: 'd/m/Y',
            emptyText: 'Seleccione...',
            allowBlank: true
            ,listeners:{
            keyUp: function (tx, ev) {
                me.filtros();
            },
            select:function(tx,ev){
                me.filtros();
            }
        }
        });


        me.btnAyuda = new comps.buttons.btnAyuda({
            icon: perfil.dirImg + 'ayuda.png',
            text: me.etiquetas.btnAyuda,
            tooltip: me.etiquetas.ttpAyuda,
            iconCls: 'btn',
            handler: function () {
                me.controller.mostrarAyuda('matriz_fmpeir');
            }
        });


        me.btnBuscar = new comps.buttons.btnBuscar({
            text: me.etiquetas.btnBuscar,
            tooltip: me.etiquetas.ttpBuscard,
            disabled: true,
            handler: function () {
                if (me.btnBuscar.disabled === false) {
                    me.stIndicador.reload();
                    bandera = false;
                }
            }
        });
        me.btnLimpiar = new comps.buttons.btnLimpiar({
            text: "<u>L</u>impiar",
            tooltip: "Limpiar filtros", disabled: true,
            handler: function () {
                if (me.btnLimpiar.disabled === false) {
                    me.tfDenominacion.reset();
                    me.dfFechaInicio.reset();
                    me.dfFechaFin.reset();
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
            handler: function () {
                me.stIndicador.reload();
            }
        });


        me.btnGuardarIndicadores = new comps.buttons.btnGuardar({
            tooltip: 'Guardar indicador',
            disabled: true,
            handler: function () {
                me.controller._insertItem('indicadores', me);
                me.controller.adicionarIndicador({
                    elementopeir: me.elementopeir,
                    idfuerzamotriz: me.idfuerzamotriz
                });
            }
        });
        me.tfDescripcion = new Ext.form.TextField({
            fieldLabel: 'Descripción del indicador',
            name: 'tfDescripcion',
            anchor: '98%',
            maxLength: 255,
            change: function (tf, nv, ov) {
                if (nv != ov && nv != '')
                    me.editor.setCellValue('descripcion', nv);
            }
        });
        me.tfDenominacion = new Ext.form.TextField({
            fieldLabel: 'Denominación del criterio',
            name: 'tfDenominacion',
            anchor: '98%',
            enableKeyEvents: true,
            listeners: {
                specialkey: function (tf, evt) {
                    if (evt.getKey() == 13) {
                        me.stIndicador.reload();
                        bandera = false
                    }
                },
                keyUp: function (tx, ev) {
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


        me.smIndicador = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });


        /**
         * ColumnModel del grid Indicadores
         * @type {Ext.grid.ColumnModel}
         */
        me.cmIndicadores = new Ext.grid.ColumnModel([
            {hidden: true, dataIndex: 'idindicador', hideable: false},
            {
                header: 'Denominación',
                dataIndex: 'denominacion',
                width: 400,
                editor: me.tfIndicador

            }, {
                header: 'Descripción',
                dataIndex: 'descripcion',
                id: 'autoExpand' + me.idCmp,
                width: 400,
                editor: me.tfDescripcion

            }, {header: 'Fecha de inicio', dataIndex: 'fechaini', width: 200, align: 'center'},
            {
                header: 'Fecha de fin',
                dataIndex: 'fechafin',
                width: 200,
                align: 'center',
                editor: new comps.fields.dateField({allowBlank: true, format: 'd/m/Y'})
            }
        ]);
        /**
         * Record del grid de Miembros
         * @type {Object.create}
         */
        me.recIndicador = new Ext.data.Record.create([
            {name: 'idcriterio'},
            {name: 'idestrategia'},
            {name: 'denominacion'},
            {name: 'descripcion'},
            {name: 'fechaini'},
            {name: 'fechafin'},

        ]);
        //------------------------------------------------------------------------------------------------------------------------
        me.expand = function (hijo) {
            hijo.expand();
            /*Expande recursivamente todos los hijos*/
            if (hijo.childNodes) {
                Ext.each(hijo.childNodes, function (node) {
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
                selectionchange: function (sm, n) {
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
                    'beforeload': function (atreeloader, anode) {
                        atreeloader.baseParams.id = anode.attributes.id;
                    },
                    load: function (atreeloader, anode) {
                        if (anode.id === 'root') {
                            me.expand(anode);
                        }
                    }
                }
            })
        });


        me.treepanel.on('click', function (nodo) {
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
            url: Planificacion.Integracion.UrlModulo + 'matrizdofa/getCriterios',
            reader: new Ext.data.JsonReader({
                root: 'root',
                id: 'idcriterio',
                totalProperty: 'cantidad_filas'
            }, me.recIndicador),
            listeners: {
                beforeload: function (thisst, obj) {
                    thisst.baseParams = {
                        denominacion: me.tfDenominacion.getRawValue(),
                        fechaini: me.dfFechaInicio.getRawValue(),
                        fechafin: me.dfFechaFin.getRawValue()
                    };
                },
                load: function () {
                    if (!me.smIndicador.hasSelection()) {
                        if (me.stIndicador.getCount() == 0) {
                            if (((me.tfDenominacion.getValue != "" && me.tfDenominacion.getValue != undefined)) && !bandera) {
                                mostrarMensaje(1, "No existen datos que se correspondan con los criterios de búsqueda especificados.");
                            } else {
                                mostrarMensaje(1, 'No existen datos que mostrar.');
                            }
                        }
                    }
                    me.initValidatorIndicadores();

                }
            }
        });
        me.stIndicador.load();


        me.gridIndicadores = new comps.containers.grids.rowEditorGrid({
            region: 'center',
            title: 'Listado de criterios',
            autoScroll: true, collapsible: false,
            cls: 'x-toolbar', stripeRows: true,
            store: me.stIndicador, addButtonTTip: 'criterio',
            delButtonTTip: 'criterio',
            delButtonMsg: '¿Está seguro que desea eliminar el criterio seleccionada?',
            clicksToEdit: 2,
            ctCls: 'x-grid3-row-selected',
            editable: true,
            overCls: 'x-grid3-row-over',
            defaults: {autoScroll: true},
            plugins: [new comps.plugins.grid.changesValidator],
            sm: me.smIndicador, autoExpandColumn: 'autoExpand' + me.idCmp,
            loadMask: new Ext.LoadMask(Ext.getBody(),
                {msg: 'Cargando...'}),
            cm: me.cmIndicadores,
            tbarButtons: ['->', me.btnAyuda],
            bbar: ['->', me.btnRecargarIndicadores, me.btnGuardarIndicadores], listeners: {
                validateedit: function (e) {
                    if (e.field == 'fechafin' && e.value != '') {
                        e.value = e.value.format('d/m/Y');
                    }
                }
            }

        });

        me.gridIndicadores.on('deleterecord', function () {
            me.controller.adicionarIndicador();
        });
        me.panel1 = new Ext.Panel({
            region: 'north',
            cls: 'x-toolbar',
            height: 60,
            frame: true,
            items: [{
                layout: 'column',
                defaults: {layout: 'form', border: false, autoHeight: true, labelAlign: 'top'},
                items: [
                    {
                        columnWidth: '45%',
                        bodyStyle: 'padding:0 0 0 7px;',
                        items: [me.tfDenominacion]
                    },
                    {
                        columnWidth: '35%',
                        bodyStyle: 'padding:0 0 0 7px;',
                        items: [me.dfFechaInicio]
                    },
                    {
                        columnWidth: '35%',
                        bodyStyle: 'padding:0 0 0 7px;',
                        items: [me.dfFechaFin]
                    },
                    {
                        columnWidth: '7%',
                        bodyStyle: 'padding:17px 0 0 7px;',
                        items: [me.btnBuscar]
                    },
                    {
                        columnWidth: '7%',
                        bodyStyle: 'padding:17px 0 0 7px;',
                        items: [me.btnLimpiar]
                    }
                ]
            }]
        });

        me.panel = new Ext.Panel({
            id: 'panel',
            layout: 'border',
            region: 'center',
            width: '40%',
            height: 150,
            tbar: me.gridIndicadores.getTopToolbar(),
            items: [me.gridIndicadores, me.panel1]
        });


        me.items = [me.panel];

        me.keys = [
            {
                key: 'i',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function () {
                    me.gridIndicadores.onAdd();
                }
            },
            {
                key: Ext.EventObject.DELETE,
                scope: me,
                stopEvent: true,
                fn: function () {
                    me.gridIndicadores.onDel();
                }
            },
            {
                key: 'h',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function () {
                    me.btnAyuda.handler.call();
                }
            },
            {
                key: 'g',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function () {
                    me.btnGuardarIndicadores.handler.call();
                }
            },
            {
                key: 'z',
                ctrl: true,
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function () {
                    me.btnRecargarIndicadores.handler.call();
                }
            },
            {
                key: 'b',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function () {
                    me.btnBuscar.handler.call();
                }
            },
            {
                key: 'l',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function () {
                    me.btnLimpiar.handler.call();
                }
            }
        ];

        me.initValidatorIndicadores();
        me.controller._insertItem('indicador', me);
        me.controller._insertItem('stIndicador', me.stIndicador);
        Planificacion.Integracion.PanelCriterios.superclass.initComponent.call(me);


    },
    initValidatorIndicadores: function () {
        var me = this;
        var fields = {grid: me.gridIndicadores};
        var botones = [me.btnRecargarIndicadores, me.btnGuardarIndicadores];
        me.initValidator(me.validatorProyecto, fields, botones);
    },
    initValidator: function (validator, fields, buttons) {
        var res = [];
        ExtExtend.Utils.each(fields, function (i, v) {
            res.push(v);
        });
        validator = new ExtExtend.FormValidator({
            buttons: buttons,
            fields: res
        });
    }, filtros: function () {
        if (((this.tfDenominacion.getValue() != '') || (this.dfFechaInicio.getRawValue() != '')|| (this.dfFechaFin.getRawValue() != '')) && (this.dfFechaInicio.isValid() && this.dfFechaFin.isValid() && this.tfDenominacion.isValid())) {
            this.btnBuscar.enable();
        } else {
            this.btnBuscar.disable();
        }
        if (((this.tfDenominacion.getValue() === '') && ((this.dfFechaInicio.getRawValue() == '')&& (this.dfFechaFin.getRawValue() == '')) && !this.search)) {
            this.btnLimpiar.disable();
        } else {
            this.btnLimpiar.enable();
        }

    }
});
Ext.reg('Planificacion.Integracion.PanelCriterios', Planificacion.Integracion.PanelCriterios);

Planificacion.Integracion.mostrarInterfaz = function () {
    var pComponente = new Planificacion.Integracion.PanelCriterios();

    var vpPrincipal = new Ext.Viewport({
        layout: 'border',
        items: [pComponente]
    });

}
Ext.onReady(function () {
    Planificacion.Integracion.mostrarInterfaz();
});

