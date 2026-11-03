/**
 * Created by jmzaldivar on 15/01/16.
 */
Ext.define('Traces.view.graficasTrazas.line.Subsistemas', {
    extend: 'Ext.chart.Chart',
    alias: 'widget.graficasTrazas.line.Subsistemas',

    id:'subsistema',

    shadow: true,
    animate: true,
    store: Ext.create('Traces.store.storeGraficasTrazas'),
    style: 'background:#fff',
    theme: 'Base:gradients',
    axes: [
        {
            type: 'Numeric',
            minimum: 0,
            position: 'left',
            fields: ['data1'],
            title: ' ',
            minorTickSteps: 1,
            grid: {
                odd: {
                    opacity: 1,
                    fill: '#ddd',
                    stroke: '#bbb',
                    'stroke-width': 0.5
                }
            }
        },
        {
            type: 'Category',
            position: 'bottom',
            fields: ['name'],
            title: ' '
        }
    ],
    series: [
        {
            type: 'line',
            highlight: {
                size: 7,
                radius: 7
            },
            smooth: true,
            fill: true,
            axis: 'left',
            xField: 'name',
            yField: 'data1',
            markerConfig: {
                type: 'circle',
                size: 4,
                radius: 4,
                'stroke-width': 0
            },
            tips: {
                trackMouse: true,
                //width: 140,
                height: 28,
                renderer: function (storeItem, item) {
                    if(storeItem.get('name') == 'Proveedor de identidad'){
                        this.setWidth(165);
                    }
                    else
                        this.setWidth(135);

                    this.setTitle(storeItem.get('name') + ': ' + storeItem.get('data1'));
                    ultimoTips = storeItem.get('name');
                    ultimaGraficaClickeada = 'subsistema';
                }
            }
        }
    ]
});