Ext.ns('Ext.actor.graphic');
Ext.actor.graphic = function(params){
    var that = params;
    that.params = that.params||{};
    that.axis = that.axis||[];
    if(that.idsituacion){
        that.params.idsituacion = that.idsituacion;
    }
    var store = new Ext.data.SimpleStore({
        url: that.url || '/actoresfuentes/index.php/actoresgrafico/getserie',
        baseParams: that.params,
        fields:that.fields ? that.fields : ['idactor','denominacion','x','y','valorx','valory']
    })
    var panel = new Ext.chartPanel({
        options:{
            selection: {
                mode: "xy"
            },
            grid: {
                hoverable: true,
                clickable: true,
                borderColor:'#aaaaaa'
            },
            zoom: {
                interactive: true
            },
            pan: {
                interactive: true
            },
            series: {
                grow: {
                    active: true
                }
            },
            xaxis:{
                label:Ext.actor.graphic.labels.importance,
                zoomRange:[0.001,1000],
                panRange:[-1000,1000]
            },
            yaxis:{
                label:Ext.actor.graphic.labels.influence,
                zoomRange:[0.001,1000],
                panRange:[-1000,1000]
            },
            reference:{
                x:(that.reference)?that.reference.x:0,
                y:(that.reference)?that.reference.y:0,
                color:(that.reference)?that.reference.color:'rgba(60,0,0,0.6)'
            }
        },
        seriesStore:[{
            store:store,
            label:(Ext.actor.graphic.labels.legendLabel),
            color:that.color?that.color:'rgba(255,0,0,0.8)',
            points: {
                symbol:(that.symbol)?that.symbol:'circle',
                show: true
            },
            grow: {
                stepMode: (that.stepMode == 'maximum')?'maximum':'linear',
                steps: 75
            }
        }],
        xfield:that.axis['x']||that.axis[0]||'x',
        yfield:that.axis['y']||that.axis[1]||'y'
    });
    panel.on('itemhover', function (event, pos, item, tip) {
        if (item) {
            /*var x = item.datapoint[0].toFixed(2);
            var y = item.datapoint[1].toFixed(2);*/
            var x = item.series.data[item.dataIndex].valorx;
            var y = item.series.data[item.dataIndex].valory;
            var html='<div style="float:left;color:green;">'+Ext.actor.graphic.labels.importance+'</div><div>'+x+'</div><div style="float:clear;">';
            html += '<div style="float:left;color:green;">'+Ext.actor.graphic.labels.influence+'</div><div>'+y+'</div><div style="float:clear;">';
            tip.setTitle(item.series.data[item.dataIndex].denominacion + ' Que pasa');
            tip.body.update(html);
        }
    });
    panel.toPDF = function(url){
        url = url || 'actoresfuentes/index.php/actoresgrafico/exportpdfgrafico?idsituacion='+that.idsituacion;
        var iframe = document.createElement("iframe");
        iframe.src = document.location.protocol+'//'+document.location.host+'/'+url;
        iframe.style.display = 'none';
        iframe.onload = function(){
            Secodena.ocultarMascara('actor-mask');
        }
        Secodena.mostrarMascara('actor-mask','',Ext.actor.graphic.labels.exportPDF);
        document.body.appendChild(iframe);
    }
    return panel;
}