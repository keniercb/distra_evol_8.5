/**
 * Created by Rubier on 22/07/2015.
 */
Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.VariablesPanel = ExtExtend.Class({
    minWidth: 300,
    maxWidth: 500,
    keyMapGroup: true,
    $extend: Ext.Panel,
    width: this.width ? this.width : 370,
    layout: this.layout ? this.layout : 'fit',
    region: this.region ? this.region : 'west',
    idestudio: this.idestudio ? this.idestudio : false,
    initComponent: function () {
        var me = this;
        idCmp = this.id;
        me.comps = ExtExtend.Components;
        me.validatorProyecto = new ExtExtend.FormValidator();
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.ImpactocruzadoController();
        me.etiquetas = me.controller._getLabel('Impactocruzado');
        me.conceptoproyecto = (me.conceptoproyecto) ? me.conceptoproyecto : null;

        //Variables de interactuan en el ancho de la fina

        me.celdas = [];
        me.celdasDescartes = [];
        me.celdasDescartesVer = [];
        me.altoMayor = 0;
        me.descarte = false;
        me.escenario = true;
        me.tienePreferencia = false;

        me.title = me.etiquetas.titleVariables;

        me.btnGuardar = new me.comps.buttons.btnGuardar({
            tooltip: 'Guardar variable',
            disabled: true,
            hotKey: {
                idGrupo: idCmp,
                config: {
                    key: 103,
                    alt: true
                }
            },
            handler: function () {
                //me.controller._insertItem('variables', me);
                me.controller.guardarVariables({
                    objproyecto: me.objproyecto,
                    idestudio: me.idestudio,
                    datosVariables: me.gpVariables.getChanges(),
                    store: me.stVariables
                });
            }
        });

        me.btnActualizar = new me.comps.buttons.btnActualizar({
            tooltip: 'Actualizar listado de variable',
            key: {},
            handler: function () {
                me.stVariables.reload();
            }
        });
        me.btnAyuda = new me.comps.buttons.btnAyuda({
            tooltip: 'Mostrar ayuda de la funcionalidad ',
            handler: function () {
                me.controller.mostrarAyuda('impacto_cruzado');
            }
        });

        // record de grid de variables
        me.recordVariables = Ext.data.Record.create([
            {name: 'idvariable', type: 'int'},
            {name: 'idestudiomatrizimpactocruzado', type: 'int'},
            {name: 'denominacion'},
            {name: 'descripcion'}
        ]);

        /**
         * Store del grid de configuraciones
         * @type {Ext.data.Store}
         */
        me.stVariables = new Ext.data.Store({
            url: Planificacion.Integracion.UrlModulo + "impactocruzado/getVariables",
            reader: new Ext.data.JsonReader({
                root: 'data',
                id: 'idvariable',
                totalProperty: 'cantidad_filas'
            }, me.recordVariables),
            listeners: {
                beforeload: function (th) {
                    Secodena.mostrarMascara('variables', 'Cargando');
                    th.baseParams = {
                        idestudio: me.idestudio ? me.idestudio : me.objproyecto.get('idestudiomatrizimpactocruzado')
                    };
                },
                load: function () {
                    Secodena.ocultarMascara('variables');
                    me.initValidatorVariables();
                }
            }
        });
        me.stVariables.load();

        /**
         * RowSelectionModel del grid
         * @type {Ext.grid.RowSelectionModel}
         */
        me.smVariables = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                selectionchange: function () {
                    //me.dibujarEscenario();
                }
            }
        });

        /**
         * ColumnModel del grid
         * @type {Ext.grid.ColumnModel}
         */
        me.cmVariables = new Ext.grid.ColumnModel([
            {
                header:me.etiquetas.lbAbbr,
                width: 150,
                sortable: true,
                dataIndex: 'denominacion',
                editor: new me.comps.fields.fieldDenom({
                }),
                renderer: me.colorfn1
            },
            {
                header:  me.etiquetas.lbdenominacion,
                width: 200,
                id: 'denominacion' + idCmp,
                dataIndex: 'descripcion',
                editor: new me.comps.fields.fieldDenom({
                }),
                renderer: me.colorfn
            }
        ]);
        me.cmVariables.defaultSortable = true;

        /**
         * GRID PANEL
         * @type {Ext.grid.GridPanel}
         */
        me.gpVariables = new me.comps.containers.grids.rowEditorGrid({
            store: me.stVariables,
            cm: me.cmVariables,
            sm: me.smVariables,
            stripeRows: true,
            clicksToEdit: 2,
            editable: true,
            border: false,
            addButtonTTip: 'variable',
            delButtonTTip: 'variable',
            delButtonMsg: '¿Está seguro que desea eliminar la variable seleccionada?',
            autoExpandColumn: 'denominacion' + idCmp,
            region: 'center',
            iconCls: 'icon-grid',
            overCls: 'x-grid3-row-over',
            ctCls: 'x-grid3-row-selected',
            anchor: '100%',
            defaults: {autoScroll: true},
            loadMask: me.etiquetas.loadMaskGrid,
            plugins: [new me.comps.plugins.grid.changesValidator],
            tbarButtons: ['->', me.btnAyuda],
            viewConfig: {
                getRowClass: function (rec, idx, p, store) {
                    return 'anchoFilas';
                }
            },
            bbar: ['->', me.btnActualizar, '->', me.btnGuardar],
            listeners: {
                mouseover: function (e) {
                    //Obtengo el item al que se le aplicara el tooltip
                    var t = e.getTarget();
                    //Obtengo la vista del gridpanel
                    var v = this.getView();
                    //Obtengo la posicion de la fila
                    var rowIndex = v.findRowIndex(t);
                    //Obtener la posicion de la columna
                    var cellColumn = v.findCellIndex(t);
                    //Para que distinga bien entre 0 y false
                    if (rowIndex !== false && cellColumn === 0) {
                        //Obtengo el record de la fila
                        var rec = this.getStore().getAt(rowIndex);
                        //Creo el contenido del tooltip
                        var html = rec.get('denominacion');
                        //Creo el tooltip
                        new Ext.ToolTip({
                            target: t,
                            Width: 250,
                            html: html,
                            trackMouse: true,
                            frame: true,
                            bodyStyle: 'padding: 2.5px'
                        });
                    } else if (rowIndex !== false && cellColumn === 1) {
                        //Obtengo el record de la fila
                        var rec = this.getStore().getAt(rowIndex);
                        //Creo el contenido del tooltip
                        var html = rec.get('descripcion');
                        //Creo el tooltip
                        if (html != '')
                            new Ext.ToolTip({
                                target: t,
                                Width: 250,
                                html: html,
                                trackMouse: true,
                                frame: true,
                                bodyStyle: 'padding: 2.5px'
                            });
                    }
                }
                /*render:function(comp){
                 comp.addButton.setToolTip('asdfadasdasdasd');
                 }*/

            }
        });

        // items del panel de configuracion
        me.items = [me.gpVariables];
        me.on('afterlayout', function (obj) {
            obj.habilitarKeyMap();
        });

        me.keys = [
            {
                key: 'i',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function () {
                    me.gpVariables.onAdd();
                }
            },
            {
                key: Ext.EventObject.DELETE,
                scope: me,
                stopEvent: true,
                fn: function () {
                    me.gpVariables.onDel();
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
            }
        ];
        me.focus();
        Planificacion.Integracion.VariablesPanel.superclass.initComponent.call(me);
    },
    initValidatorVariables: function () {
        var me = this;
        var fields = {grid: me.gpVariables};
        var botones = [me.btnGuardar];
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
        })
    },
    colorfn: function (c, metaData, record, rowIndex, colIndex, store) {
        var me = this;
        return '<div style=" border-style: none; padding: 0px 2px 0px 3px;"><i>' + c + '</i></div>';
    },
    colorfn1: function (c, metaData, record, rowIndex, colIndex, store) {
        var me = this;
        return '<div style=" border-style: none; padding: 0px 2px 0px 3px; min-height: 15px "><b><i>' + c + '</i></b></div>';
    }
});
Ext.reg('Planificacion.Integracion.VariablesPanel', Planificacion.Integracion.VariablesPanel);