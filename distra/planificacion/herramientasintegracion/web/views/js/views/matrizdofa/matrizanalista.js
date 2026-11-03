/**
 * Created by Ernesto Camilo on 24/07/15.
 */
Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.MatrizAnalista = ExtExtend.Class({
    $extend: Ext.Panel,
    frame: false,
    baseCls:'header-blue',
    initComponent: function () {
        var me = this;
        var comps = ExtExtend.Components;

        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.MatrizdofaController();
        me.etiquetas = me.controller._getLabel('Matrizdofa');
        me.directorioImagenes = me.controller._getGlobals('dirImg');

        me.title = me.etiquetas.analista;

        me.recAnalistaNorte = Ext.data.Record.create([
            {
                name: 'fortalezas'
            },
            {
                name: 'debilidades'
            }
        ]);
        me.stAnalistaNorte = new Ext.data.Store({
            url: '/planificacion/herramientasintegracion/index.php/matrizdofa/getfortalezasdebilidades',
            reader: new Ext.data.JsonReader({
                root: 'root',
                id: 'stAnalistaNorte',
                totalProperty: 'cantidad_filas'
            }, me.recAnalistaNorte)
        });
        me.gpAnalistaNorte = new Ext.grid.GridPanel({
            autoExpandColumn: 'idexpandir',
            anchor: '100%',
            height: 260,
            autoScroll: true,
            store: me.stAnalistaNorte,
            loadMask: {msg: 'Cargando...'},
            cm: new Ext.grid.ColumnModel([
                {header: me.etiquetas.fortalezas, dataIndex: 'fortalezas', width: 200, id: 'idexpandir'},
                {header: me.etiquetas.debilidades, dataIndex: 'debilidades', width: 200}
            ])

        });


        me.recAnalistaSur = Ext.data.Record.create([
            {
                name: 'amenazas'
            },
            {
                name: 'oportunidades'
            }
        ]);
        me.stAnalistaSur = new Ext.data.Store({
            url: '/planificacion/herramientasintegracion/index.php/matrizdofa/getfortalezasdebilidades',
            reader: new Ext.data.JsonReader({
                root: 'root',
                id: 'stAnalistaSur',
                totalProperty: 'cantidad_filas'
            }, me.recAnalistaSur)
        });
        me.gpAnalistaSur = new Ext.grid.GridPanel({
            autoExpandColumn: 'idexpandir',
            anchor: '100%',
            height: 260,
            autoScroll: true,
            store: me.stAnalistaSur,
            //  sm: me.smFactores,
            loadMask: {msg: 'Cargando...'},
            cm: new Ext.grid.ColumnModel([
                {header: me.etiquetas.amenazas, dataIndex: 'amenazas', width: 200, id: 'idexpandir'},
                {header: me.etiquetas.oportunidades, dataIndex: 'oportunidades', width: 200}
            ])

        });

        me.items = [me.gpAnalistaNorte, me.gpAnalistaSur];


        Planificacion.Integracion.MatrizAnalista.superclass.initComponent.call(me);
    }
});
Ext.reg('Planificacion.Integracion.MatrizAnalista', Planificacion.Integracion.MatrizAnalista);