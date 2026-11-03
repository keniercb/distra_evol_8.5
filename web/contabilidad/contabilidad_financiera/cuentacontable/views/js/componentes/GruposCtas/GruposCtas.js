Ext.QuickTips.init();
  objTree = new Ext.Cont.Class.GruposCtas();
objTree.on('initialize', function(component){
    new Ext.Viewport({
        items: component,
        listeners : {
            resize : function(){
                component.setHeight(this.getSize().height);
            }
        }
    });
});


