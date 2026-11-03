/**
 * Created by jmzaldivar on 15/01/16.
 */
Ext.define('Traces.view.graficasTrazas.bar.Usuario', {
    extend: 'Ext.chart.Chart',
    alias: 'widget.graficasTrazas.bar.Usuario',

    id:'usuario',

    animate: true,
    store: Ext.create('Traces.store.storeGraficasTrazas'),
    shadow: true,
    axes: [
        {
            type: 'Numeric',
            position: 'left',
            fields: ['data1'],
            title: ' ',
            grid: true,
            minimum: 0
        },
        {
            type: 'Category',
            position: 'bottom',
            fields: ['name'],
            title: ' ',
            label: {
                rotate: {
                    degrees: 270
                }
            }
        }
    ],
    series: [
        {
            type: 'column',
            axis: 'left',
            gutter: 80,
            xField: 'name',
            yField: ['data1'],
            tips: {
                trackMouse: true,
                width: 150,
                height: 28,
                renderer: function (storeItem, item) {
                    this.setTitle(storeItem.get('name') + ': ' + storeItem.get('data1'));
                    ultimoTips = storeItem.get('name');
                    ultimaGraficaClickeada = 'usuario';
                }
            },
            style: {
                fill: '#38B8BF'
            }
        }
    ]
});