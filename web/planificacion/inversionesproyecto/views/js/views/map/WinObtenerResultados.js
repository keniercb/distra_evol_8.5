Planificacion.Integracion.WinObtenerResultados = Ext.extend(Ext.Window, {
    modal: true,
    resizable: false,
    layout: 'border',
    frame: true,
    initComponent: function() {
        var me = this;
        me.comps = ExtExtend.Components;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.MapController();
        me.etiquetas = me.controller._getLabel('Map');
        me.directorioImagenes = me.controller._getGlobals('dirImg');
        
        me.objetos = (me.objetos) ? me.objetos : new Array();
        me.idestudiomap = (me.idestudiomap) ? me.idestudiomap : 0;
        me.title = this.title ? this.title : 'Resumen de los resultados';
        me.width = (this.ancho) ? this.ancho : 1000;
        me.height = (this.altura) ? this.altura : 500;
        
        me.btnCerrar = new me.comps.buttons.btnCerrar({
            handler: function() {
                me.close();
            }
        });

        me.btnGuardar = new me.comps.buttons.btnGuardar({
            tooltip: 'Guardar la valoración de los resultados',
            handler: function () {
                me.controller._insertItem('objresultado', me);
                me.controller.guardarValoracion();
            }
        });
        
        me.btnExportar = new me.comps.buttons.btnExportar({
            handler: function() {
                var win = new Planificacion.Integracion.WinExportarResultados({
                   idestudiomap: me.idestudiomap
                });
                win.show();
            }
        });
        
        
        me.recResultados = Ext.data.Record.create([
            {
                name: 'idacto'
            }, {
                name: 'denominacion'
            }, {
                name: 'factibilidadinstitucional'
            }, {
                name: 'factibilidadhecho'
            }, {
                name: 'estabilidadacto'
            }, {
                name: 'solidezacto'
            }
        ]);
        
        me.stResultados = new Ext.data.Store({
            url: 'getresultadosmap',
            reader: new Ext.data.JsonReader({
                root: 'root',
                id: 'stResultados',
                totalProperty: 'cantidad_filas'
            }, me.recResultados),
            listeners: {
                load: function(th) {
                }
            }
        });
        
        me.cmResultados = [
            {hidden: true, hideable: false, dataIndex: 'idacto'},
            {header: "Actos / Resultados", dataIndex: 'denominacion', id: 'idexpandir', width: 150},
            {header: "Factibilidad institucional", dataIndex: 'factibilidadinstitucional', width: 220},
            {header: "Factibilidad de hecho", dataIndex: 'factibilidadhecho', width: 220},
            {header: "Estabilidad del acto", dataIndex: 'estabilidadacto', width: 200},
            {header: "Solidez del acto", dataIndex: 'solidezacto', width: 120}
        ];
        
        me.smResultados = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        me.gpResultados = new Ext.grid.GridPanel({
            region: 'center',
            frame: true,
            autoExpandColumn: 'idexpandir',
            autoScroll: true,
            store: me.stResultados,
            sm: me.smResultados,
            loadMask: {msg: me.etiquetas.lblLoad},
            columns: me.cmResultados,
            tbar: ['->', me.btnExportar]
        });



        me.taResultados = new me.comps.fields.fieldDescripcion({
            fieldLabel: 'Resultados',
            //allowBlank: true,
            anchor: '100%',
            height: 115,
            value: me.objproyecto.get('resultado'),
            listeners: {
                valid: function (tf) {
                    me.objproyecto.set('resultado', tf.getValue());
                },
                invalid: function (tf) {
                    me.objproyecto.set('resultado', null);
                },
                empty: function (tf) {
                    me.objproyecto.set('resultado', null);
                }
            }
        });

        me.panelRes = new Ext.Panel({
            layout: 'form',
            labelAlign: 'top',
            frame: true,
            region: 'south',
            anchor: '100%',
            height: 150,
            items: [me.taResultados]
        });
        
        me.items = [me.gpResultados, me.panelRes];
        me.buttons = [me.btnCerrar, me.btnGuardar];

        me.keys = [
            {
                key: 'x',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function() {
                    me.btnCerrar.handler.call();
                }
            }
        ];

        Planificacion.Integracion.WinObtenerResultados.superclass.initComponent.call(me);
        me.on('show', function() {
            me.stResultados.load({params: {objetos: Ext.encode(me.objetos), idestudiomap: me.idestudiomap}})
        });
    }
});