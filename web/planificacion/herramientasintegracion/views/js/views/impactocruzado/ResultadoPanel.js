/**
 * Created by Rubier on 30/07/2015.
 */

Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.ResultadoPanel = ExtExtend.Class({
    $extend: Ext.Panel,
    border: false,
    frame: false,
    layout: 'border',
    autoScroll: true,
    initComponent: function() {
        var me = this;
        idCmp = this.id;
        comps = ExtExtend.Components;
        me.validatorProyecto = new ExtExtend.FormValidator();

        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.ImpactocruzadoController();
        me.etiquetas = me.controller._getLabel('Impactocruzado');
        me.conceptoproyecto = (me.conceptoproyecto) ? me.conceptoproyecto : null;

        me.title = me.etiquetas.titleResultadoGrid;


        me.btnAyuda = new comps.buttons.btnAyuda({
            tooltip: 'Mostrar ayuda de la funcionalidad',
            handler: function() {
                me.controller.mostrarAyuda('generar_resultado');
            }
        });

        me.stmatrizresultado = new Ext.data.JsonStore({
            url: '/planificacion/herramientasintegracion/index.php/impactocruzado/obtenermatrizimpactocruzadoresultado',
            totalProperty: 'results',
            autoLoad: true,
            root: 'data', fields: [
                {name: 'denominacion'},
                {name: 'suma'},
                {name: 'porciento'},
                {name: 'acumulado'},
                {name: 'descripcion'}
            ],
            listeners: {
                'beforeload': function(th) {
                    th.baseParams = {
                        idestudio: me.objproyecto.get('idestudiomatrizimpactocruzado')
                    };
                }
            }
        });

        me.cmmatrizresultado = new Ext.grid.ColumnModel([
            {id: 'denominacion', header: 'Variable', width: 150, hideable: false, dataIndex: 'denominacion'},
            {header: 'Denominaci&oacute;n', dataIndex: 'descripcion', width: 150},
            {header: 'Suma', width: 80, hideable: false, align: 'center', dataIndex: 'suma'},
            {header: '%', width: 100, hideable: false, align: 'center', dataIndex: 'porciento', renderer: me.formatocelda},
            {header: '% acumulado', width: 120, hideable: false, align: 'center', dataIndex: 'acumulado', renderer: me.formatocelda}
        ]);

        me.gridmatrizresultado = new Ext.grid.GridPanel({
            store: me.stmatrizresultado,
            cm: me.cmmatrizresultado,
            id: 'resultados',
            autoExpandColumn: 'denominacion',
            region: 'center',
            loadMask: true
        });

        me.items = [me.gridmatrizresultado];
        me.tbar = ['->',me.btnAyuda];

        me.controller._insertStore('stmatrizresultado', me.stmatrizresultado);

        Planificacion.Integracion.ResultadoPanel.superclass.initComponent.call(me);
    },
    formatocelda: function(c, metaData, record, rowIndex, colIndex, store) {
        return Math.round(c * 100) / 100;
    }
});
Ext.reg('Planificacion.Integracion.ResultadoPanel', Planificacion.Integracion.ResultadoPanel);