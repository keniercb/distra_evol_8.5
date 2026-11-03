/**
 * Created by jmzaldivar on 15/01/16.
 */
Ext.define('Traces.view.graficasTrazas.bar.Subsistemas', {
    extend: 'Ext.chart.Chart',
    alias: 'widget.graficasTrazas.bar.Subsistemas',

    id:'subsistema',

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
                //width: 150,
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
            },
            style: {
                fill: '#38B8BF'
            }
        }
    ]
});