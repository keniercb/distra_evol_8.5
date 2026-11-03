/**
 * Created by Ernesto Camilo on 24/07/15.
 */
Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.MatrizExperto = ExtExtend.Class({
    $extend: Ext.Panel,
    frame: false,
    baseCls: 'header-blue',
    initComponent: function () {
        var me = this;
        var comps = ExtExtend.Components;

        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.MatrizdofaController();
        me.etiquetas = me.controller._getLabel('Matrizdofa');
        me.directorioImagenes = me.controller._getGlobals('dirImg');

        me.title = me.etiquetas.experto;

        me.recExpertoNorte = Ext.data.Record.create([
            {
                name: 'fortalezas'
            },
            {
                name: 'debilidades'
            }
        ]);
        me.stExpertoNorte = new Ext.data.Store({
            url: '/planificacion/herramientasintegracion/index.php/matrizdofa/getfortalezasdebilidades',
            reader: new Ext.data.JsonReader({
                root: 'root',
                id: 'stExpertoNorte',
                totalProperty: 'cantidad_filas'
            }, me.recExpertoNorte)
        });
        me.gpExpertoNorte = new Ext.grid.GridPanel({
            autoExpandColumn: 'idexpandir',
            height: 260,
            autoScroll: true,
            store: me.stExpertoNorte,
            loadMask: {msg: 'Cargando...'},
            cm: new Ext.grid.ColumnModel([
                {header: me.etiquetas.fortalezas, dataIndex: 'fortalezas', width: 200, id: 'idexpandir',css:'title-h1-blue'},
                {header: me.etiquetas.debilidades, dataIndex: 'debilidades', width: 200}
            ])

        });


        me.recExpertoSur = Ext.data.Record.create([
            {
                name: 'amenazas'
            },
            {
                name: 'oportunidades'
            }
        ]);
        me.stExpertoSur = new Ext.data.Store({
            url: '/planificacion/herramientasintegracion/index.php/matrizdofa/getfortalezasdebilidades',
            reader: new Ext.data.JsonReader({
                root: 'root',
                id: 'stExpertoSur',
                totalProperty: 'cantidad_filas'
            }, me.recExpertoSur)
        });
        me.gpExpertoSur = new Ext.grid.GridPanel({
            autoExpandColumn: 'idexpandir',
            anchor: '100%',
            height: 260,
            autoScroll: true,
            store: me.stExpertoSur,
            loadMask: {msg: 'Cargando...'},
            cm: new Ext.grid.ColumnModel([
                {header: me.etiquetas.amenazas, dataIndex: 'amenazas', width: 200, id: 'idexpandir'},
                {header: me.etiquetas.oportunidades, dataIndex: 'oportunidades', width: 200}
            ])

        });
        me.fsPruebaN = new Ext.form.FieldSet({
            anchor: '100%',
            autoHeight: true,
            items: [me.gpExpertoNorte
            ]
        });
        me.fsPruebaS = new Ext.form.FieldSet({
            anchor: '100%',
            autoHeight: true,
            items: [me.gpExpertoSur
            ]
        });

        me.items = [me.gpExpertoNorte, me.gpExpertoSur];

        Planificacion.Integracion.MatrizExperto.superclass.initComponent.call(me);
    }
});
Ext.reg('Planificacion.Integracion.MatrizExperto', Planificacion.Integracion.MatrizExperto);