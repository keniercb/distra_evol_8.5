/**
 * Created by lrvargas on 15/01/16.
 */
Ext.define('Traces.view.graficasTrazas.ReporteTrazas', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.graficasTrazas.ReporteTrazas',
    requires: [
        'Traces.view.graficasTrazas.pie.Subsistemas',
        'Traces.view.graficasTrazas.pie.Usuario',
        'Traces.view.graficasTrazas.pie.Fechas',
        'Traces.view.graficasTrazas.pie.Tipo',

        'Traces.view.graficasTrazas.bar.Subsistemas',
        'Traces.view.graficasTrazas.bar.Usuario',
        'Traces.view.graficasTrazas.bar.Fechas',
        'Traces.view.graficasTrazas.bar.Tipo',

        'Traces.view.graficasTrazas.line.Subsistemas',
        'Traces.view.graficasTrazas.line.Usuario',
        'Traces.view.graficasTrazas.line.Fechas',
        'Traces.view.graficasTrazas.line.Tipo',
    ],
    autoScroll: true,
    border: false,
    id:'reporteTrazas',
    defaults: {
        margin: '3% 3% 3% 3%',
        minHeight: 450,
        maxHeight: 450,
        minWidth: 943,
        maxWidth: 943
    },

    items: [
        {
            xtype: 'container',
            layout: 'column',
            items:[
                {
                    columnWidth:.5,
                    title: 'Subsistema',
                    layout: 'fit',
                    margin: '0 5% 0 0',
                    height: 400,
                    id: 'trazasSubsistemas',
                    border: false,
                    items: {xtype: 'graficasTrazas.pie.Subsistemas'}
                },
                {
                    columnWidth:.5,
                    title: 'Fecha',
                    layout: 'fit',
                    height: 400,
                    id: 'trazasFechas',
                    border: false,
                    items: {xtype: 'graficasTrazas.pie.Fechas'}
                }
            ]


        },
        {
            xtype: 'container',
            layout: 'column',
            items:[
                {
                    columnWidth:.5,
                    title: 'Usuario',
                    layout: 'fit',
                    margin: '0 5% 0 0',
                    height: 400,
                    id: 'trazasUsuario',
                    border: false,
                    items: {xtype: 'graficasTrazas.pie.Usuario'}
                },
                {
                    columnWidth:.5,
                    title: 'Tipo',
                    layout: 'fit',
                    height: 400,
                    id: 'trazasTipo',
                    border: false,
                    items: {xtype: 'graficasTrazas.pie.Tipo'}
                }
            ]
        }
    ]
});

