Ext.QuickTips.init();
objTree = new Ext.Cont.ClassconceptosFormulas();
objTree.on('initialize', function(component) {
    new Ext.Viewport({
        items: component,
        listeners: {
            resize: function() {
                component.setHeight(this.getSize().height);
            }
        }
    });
});