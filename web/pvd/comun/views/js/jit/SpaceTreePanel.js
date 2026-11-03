/**
 *@Author: Ing. Javier Rodriguez Lopez
 *@Name: Ext.jit.SpaceTreePanel
 *@Tipo: Clase
 *@Extend: Ext.Panel
 *@Description: Para mostrar datos de forma gerárquica.
 **/
Ext.ns('Ext.jit');
Ext.jit.SpaceTreePanel = Ext.extend(Ext.Panel, {
    options:{},
    
    initComponent : function(){
        var self = this;
        Ext.jit.SpaceTreePanel.superclass.initComponent.apply(this, arguments);
        this.addEvents(
            "onBeforeCompute",
            "onAfterCompute"
            );
        this.cmpId = 'infovis'+this.id;
        
    },
    onRender : function(){
        Ext.jit.SpaceTreePanel.superclass.onRender.apply(this, arguments);
        var height = this.getInnerHeight()-this.getFrameHeight()-2;			
        var place;
        if(!this.width){
            this.width='100%';
        }	
        if(!this.height){
            this.height='100%';
        }
        var child = {
            children:[{
                id: this.cmpId,
                style: 'float:left;width:95%; height:92%;'
            }]
        }
        this.body.createChild(child);
        //place = $("#"+this.cmpId);
        //this.refresh();
        //binding flot events to this class 
        var fe = this.fireEvent.createDelegate(this);
        
        $("#"+this.cmpId).unbind();
	    
        $("#"+this.cmpId).bind("onBeforeCompute", function (node) {
            fe("onBeforeCompute", node);
        });
        $("#"+this.cmpId).bind("onAfterCompute", function () {
            fe("onAfterCompute");
        });
        
        //place = $("#"+this.cmpId);
        this.options.injectInto = this.cmpId;
        this.jitObj = $jit.ST(this.options);
        
    },
    onCreateLabel: function(label, node){
        label.id = node.id;            
        label.innerHTML = node.name;
        label.onclick = function(){
            st.onClick(node.id);
        };
        //set label styles
        var style = label.style;
        style.width = 60 + 'px';
        style.height = 17 + 'px';            
        style.cursor = 'pointer';
        style.color = '#333';
        style.fontSize = '0.8em';
        style.textAlign= 'center';
        style.paddingTop = '3px';
    }
    
});
Ext.reg("spacetreepanel", Ext.jit.SpaceTreePanel);