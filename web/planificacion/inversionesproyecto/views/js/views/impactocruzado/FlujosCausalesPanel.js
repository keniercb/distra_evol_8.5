/**
 * Created by Rubier on 03/08/2015.
 */
Planificacion.Integracion.FlujosCausalesPanel = ExtExtend.Class({
    $extend: Ext.Panel,
    layout: 'border',
    idestudio: this.idestudio ? this.idestudio : false,
    initComponent: function() {
        var idCmp = this.id;
        var me = this;
        me.comps = ExtExtend.Components;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.ImpactocruzadoController();
        me.etiquetas = me.controller._getLabel('Impactocruzado');

        me.panel = new Ext.Panel({
            id: 'panelgraficaflujo',
            region: 'center',
            html: '<div class="flujoscausales" id="myflujo"></div>'
        });

        me.btnAyuda = new me.comps.buttons.btnAyuda({
            tooltip: 'Mostrar ayuda de la funcionalidad',
            handler: function() {
                me.controller.mostrarAyuda('diagrama_flujos_causales');
            }
        });

        me.westpanel = new Planificacion.Integracion.FlujosCausalesVariablesPanel({
            controller: me.controller,
            objproyecto: me.objproyecto,
            idestudio: me.idestudio,
            title: me.etiquetas.lblvariables,
            region: 'west',
            width: 220,
            split: true,
            collapsible: true
        });

        this.items = [me.panel, me.westpanel];

        me.tbar = ['->', me.btnAyuda];
        me.controller._insertItem('objeto', me);
        Planificacion.Integracion.FlujosCausalesPanel.superclass.initComponent.call(me);
    },
    mostrarGrafico: function(data, simplificado, idTag) {
        var me    = this,
            edges = data.edges,
            nodes = data.nodes;

        Ext.each(nodes, function (node, k) {
            if (simplificado) {
                var label = nodes[k].label;
                nodes[k].label = node.title;
                nodes[k].title = label;
            }
        }, me);

        var data = {
            nodes: nodes,
            edges: edges
        };

        var options = {
            nodes: {
                shape: 'box',
                size: 30
            },
            physics: {
                forceAtlas2Based: {
                    gravitationalConstant: -26,
                    centralGravity: 0.005,
                    springLength: 230,
                    springConstant: 0.18
                },
                maxVelocity: 146,
                solver: 'forceAtlas2Based',
                timestep: 0.35,
                stabilization: {iterations: 300}
            }
        };

        var container = document.getElementById(idTag ? idTag : 'myflujo');
        me.network = new vis.Network(container, data, options);

    }
});
Ext.reg('Planificacion.Integracion.FlujosCausalesPanel', Planificacion.Integracion.FlujosCausalesPanel);

Planificacion.Integracion.FlujosCausalesVariablesPanel = ExtExtend.Class({
    $extend: Ext.Panel,
    layout: 'border',
    idestudio: this.idestudio ? this.idestudio : false,
    initComponent: function() {
        var idCmp = this.id;
        var me = this;
        me.comps = ExtExtend.Components;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.ImpactocruzadoController();
        me.etiquetas = me.controller._getLabel('Impactocruzado');
        me.controller._insertItem('flujocausalvariables', me);

        me.btnGrafica = new comps.buttons.btnGraficar({
            text: me.etiquetas.lbgraficar,
            disabled: true,
            handler: function() {
                var selection = me.smVariables.getSelections();
                var ids = [];
                Ext.each(selection, function(item) {
                    ids.push(item.id);
                }, me);
                var estudio = me.idestudio ? me.idestudio : me.objproyecto.get('idestudiomatrizimpactocruzado');
                me.controller.obtenerDatosGraficoFlujo(estudio, ids, me.simplificado.getValue());
            }
        });

        me.btnActualizar = new me.comps.buttons.btnActualizar({
            tooltip: 'Actualizar listado de variables',
            text: '',
            handler: function() {
                me.stVariables.reload();
            }
        });

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
                beforeload: function(th) {
                    Secodena.mostrarMascara('variables', 'Cargando');
                    th.baseParams = {
                        idestudio: me.idestudio ? me.idestudio : me.objproyecto.get('idestudiomatrizimpactocruzado')
                    };
                },
                load: function() {
                    Secodena.ocultarMascara('variables');
                }
            }
        });
        me.stVariables.load();

        /**
         * RowSelectionModel del grid
         * @type {Ext.grid.RowSelectionModel}
         */
        me.smVariables = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                selectionchange: function(sm) {
                    if (sm.getSelections().length > 0) {
                        me.btnGrafica.enable();
                    } else {
                        me.btnGrafica.disable();
                    }
                }
            }
        });

        /**
         * ColumnModel del grid
         * @type {Ext.grid.ColumnModel}
         */
        me.cmVariables = new Ext.grid.ColumnModel([
            //new Ext.grid.RowNumberer(),
            me.smVariables,
            {
                header: me.etiquetas.lbAbbr,
                width: 100,
                sortable: false,
                id: 'denominacion' + idCmp,
                dataIndex: 'denominacion',
                editor: new comps.fields.fieldDenom({
                    maxLength: 100
                })
            }, {
                header: me.etiquetas.lbdenominacion,
                width: 100,
                sortable: false,
                id: 'abbr' + idCmp,
                dataIndex: 'descripcion'
            }
        ]);
        me.cmVariables.defaultSortable = true;

        /**
         * GRID PANEL
         * @type {Ext.grid.GridPanel}
         */
        me.gpVariables = new Ext.grid.GridPanel({
            store: me.stVariables,
            cm: me.cmVariables,
            sm: me.smVariables,
            border: false,
            autoExpandColumn: 'denominacion' + idCmp,
            region: 'center',
            anchor: '100%',
            defaults: {autoScroll: true},
            loadMask: me.etiquetas.loadMaskGrid,
            tbarButtons: ['->', me.btnAyuda],
            listeners: {
                mouseover: function(e) {
                    //Obtengo el item al que se le aplicara el tooltip
                    var t = e.getTarget();
                    //Obtengo la vista del gridpanel
                    var v = this.getView();
                    //Obtengo la posicion de la fila
                    var rowIndex = v.findRowIndex(t);
                    //Obtener la posicion de la columna
                    var cellColumn = v.findCellIndex(t);
                    //Para que distinga bien entre 0 y false
                    if (rowIndex !== false && cellColumn === 2) {
                        //Obtengo el record de la fila
                        var rec = this.getStore().getAt(rowIndex);
                        //Creo el contenido del tooltip
                        var html = rec.get('descripcion');
                        //Creo el tooltip
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
            }
        });

        me.simplificado = new Ext.form.Checkbox({
            boxLabel: 'Simplificado'
        });

        me.items = [me.gpVariables];

        me.bbar = [me.simplificado, '->', me.btnActualizar, '-', me.btnGrafica];

        Planificacion.Integracion.FlujosCausalesVariablesPanel.superclass.initComponent.call(me);
    }
});
Ext.reg('Planificacion.Integracion.FlujosCausalesVariablesPanel', Planificacion.Integracion.FlujosCausalesVariablesPanel);

