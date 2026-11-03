/**
 * Created by jmzaldivar on 15/01/16.
 */
Ext.define('Traces.view.graficasTrazas.pie.Tipo', {
    extend: 'Ext.chart.Chart',
    alias: 'widget.graficasTrazas.pie.Tipo',

    id:'tipo',



    animate: true,
    store: Ext.create('Traces.store.storeGraficasTrazas'),
    shadow: true,
    legend: {
        position: 'right'
    },
    insetPadding: 60,
    theme: 'Base:gradients',
    series: [
        {
            type: 'pie',
            angleField: 'data1',
            showInLegend: true,
            donut: false,
            radius: 200,
            tips: {
                trackMouse: true,
                width: 140,
                height: 45,
                renderer: function (storeItem, item) {
                    var total = 0;
                    Ext.getCmp('tipo').store.each(function(rec) {
                        total += rec.get('data1');
                    });
                    this.setTitle(storeItem.get('name') + '</br>' + 'Porcentaje: '+ Math.round(storeItem.get('data1') / total * 100) + '%' +'</br>'+'Cantidad: '+ storeItem.get('data1'));
                    //this.setTitle(storeItem.get('name') + ': ' + storeItem.get('data1'));
                    ultimoTips = storeItem.get('name');
                    ultimaGraficaClickeada = 'tipo';
                }
            },
            highlight: {
                segment: {
                    margin: 20
                }
            },
            label: {
                field: 'name',
                //display: 'rotate',
                contrast: true,
                font: '12px Arial'
            }
        }
    ]
});