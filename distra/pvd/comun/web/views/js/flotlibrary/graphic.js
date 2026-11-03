/**
 * @class Ext.chartPanel
 */

Ext.namespace("Ext.chartPanel"); 

Ext.chartPanel = Ext.extend(Ext.Panel, {
    seriesStore:[],
    xfield:null,
    yfield:null,
    options:{},
    seriesPerformed:[],
    initComponent : function(){
        var that = this;
        Ext.chartPanel.superclass.initComponent.apply(this, arguments);
        this.addEvents(
            "itemclick",
            "itemselected",
            "itemhover"
            );
        this.cmpId = 'placeholder'+this.id;
        var proxylength=0;
        Ext.each(this.seriesStore,function(el){
            if(el.store.proxy)proxylength++;
            el.store.on('load',function(){
                var serie = that.extractSerie(el);  
                that.seriesPerformed.push(serie);
                if(that.seriesPerformed.length == that.seriesStore.length){
                    if(that.mask)
                        that.mask.hide();
                    that.plot(that.seriesPerformed,that.options);
                }
            })
        })
        this.on('resize',function(){
            var place = $("#"+this.cmpId);
            var legend = $('#yLegend'+this.cmpId);
            if(place && legend){
                var height = Math.round(place.height()/2);
                legend.html("<svg><text x='-"+height+"' y='10' transform='rotate(270)' text-anchor='middle'>"+this.options.yaxis.label+"</text></svg>");
            }
            this.redraw();
        })
    },
    //private
    extractSerie:function(el){
        var records = el.store.getRange();
        var data = [];
        var serie={
            store:null
        };
        var that = this;
        Ext.each(records,function(rec){
            var node=[];
            if(that.xfield && rec.data[that.xfield])
                node.push(rec.data[that.xfield])
            else
                node.push(rec.json[0]*1);
            
            if(that.yfield && rec.data[that.yfield])
                node.push(rec.data[that.yfield])
            else
                node.push(rec.json[1]*1);
            
            for(var attr in rec.data){
                if(!(rec.data[attr] instanceof Function)&&!(attr == that.xfield || attr == that.yfield)){
                    node[attr]=rec.data[attr];
                }
            }
            data.push(node);
        })
        /*if(data.length==0||!(that.xfield&&that.yfield)){
            throw 'Se deben especificar los xfield, yfield'
        }*/
        serie.data = data;
        Ext.applyIf(serie,el);
        delete serie.store;
        return serie;
    },

    redraw:function(data){
        if(this.plotObj){
            if(data)
                this.plotObj.setData(data);
            this.plotObj.resize();
            this.setup();
            this.draw();
        }
    },
    
    onRender : function(){
        Ext.chartPanel.superclass.onRender.apply(this, arguments);
        var height = this.getInnerHeight()-this.getFrameHeight()-2;			
        var place;
        if(!this.width){
            this.width='100%';
        }	
        if(!this.height){
            this.height='100%';
        }
        //height = $("#"+this.cmpId).height();
        var child = {
            children:[{
                style:'float:left;width:4%;height:92%;',
                id:'yLegend'+this.cmpId,
                html:""
            },{
                id: this.cmpId,
                style: 'float:left;width:95%; height:92%;'
            },{
                style: 'clear:both;height:8%',
                html:'<div align="center" style="padding-left:30px;padding-top:5px;">'+this.options.xaxis.label+'</div>'
            }]
        }
        this.body.createChild(child);
        place = $("#"+this.cmpId);
        height = Math.round(place.height()/2);
        $('#yLegend'+this.cmpId).html("<svg><text x='-"+height+"' y='10' transform='rotate(270)' text-anchor='middle'>"+this.options.yaxis.label+"</text></svg>");
      
        //this.refresh(); //Comentariado para que no cargue los datos cuando se renderice
        // tips for hoverable
        var tip = new Ext.ToolTip({
            title: 'Valor',
            html: '',
            dismissDelay:30000,
            minWidth:150,
            autoWidth:true,
            trackMouse:true
        });	
        tip.targetXY = [0, 0];
        // binding flot events to this class 
		
        var fe = this.fireEvent.createDelegate(this);
	    
        $("#"+this.cmpId).unbind();
	    
        $("#"+this.cmpId).bind("plotclick", function (event, pos, item) {
            fe("itemclick", event, pos, item);
        });

        $("#"+this.cmpId).bind("plotselected", function (event, ranges) {			
            fe("itemselected", event, ranges);
        });
		
        $("#"+this.cmpId).bind("plothover", function (event, pos, item) {
            if(item)
                tip.showAt([item.pageX+10, item.pageY+10])
            else
                tip.hide();
            fe("itemhover", event, pos, item, tip);
        });
    },
    
    // wrapping API
    plot: function(data, options){
        var place = $("#"+this.cmpId);
        this.plotObj = $.plot(place, data, options);
    },
	
    clearSelection: function(){
        this.plotObj.clearSelection();	
    },
	
    setSelection: function(ranges, preventEvent){
        this.plotObj.setSelection(ranges, preventEvent);
    },
	
    highlight: function(series, datapoint){
        this.plotObj.highlight(series, datapoint);
    },

    unhighlight: function(series, datapoint){
        this.plotObj.unhighlight(series, datapoint);
    },
	
    setData: function(data){
        this.plotObj.setData(data);	
    },
	
    setup: function(){
        this.plotObj.setupGrid();
    },
	
    draw: function(){
        this.plotObj.draw();
    },
	
    getData: function(){
        this.plotObj.getData();
    },
	
    getAxes: function(){
        this.plotObj.getAxes();
    },
	
    getCanvas: function(){
        this.plotObj.getCanvas();
    },
	
    getPlotOffset: function(){
        this.plotObj.getPlotOffset();
    },
    
    refresh:function(params){
        var args=(params)?{
            params:params
        }:{};
        if(!this.mask){
            this.mask = new Ext.LoadMask(this.ownerCt.id);
        }
        this.mask.show();
        if(this.data){
            this.plot(this.data, this.options);
            if(this.mask)
                this.mask.hide();
        }else{
            this.seriesPerformed=[];
            var that = this;
            Ext.each(this.seriesStore,function(el){
                if(el.store.proxy)
                    el.store.load(args);
                else{
                    var serie = that.extractSerie(el);  
                    that.seriesPerformed.push(serie);
                }
            })
        }
    }
		
});

Ext.reg("chartpanel", Ext.chartPanel);
