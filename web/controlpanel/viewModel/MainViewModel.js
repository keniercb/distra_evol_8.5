Ext.override(package.views.MainView, {
    initComponent: function() {
        //TODO: Pre-initialization
        package.views.MainView.superclass.initComponent.call(this);
        //TODO: Pos-initialization
    },

    //@EVENT_HANDLERS    - ATTENTION: Don't remove this tag.

    //@COMPONENT_SERVICE - ATTENTION: Don't remove this tag.

    onRender: function() {
        //TODO: Pre-render
        package.views.MainView.superclass.onRender.apply(this, arguments);
        //TODO: Pos-render
    },

    onDestroy: function() {
        //TODO: Pre-destroy
        package.views.MainView.superclass.onDestroy.call(this);
    },
    onclickNext : function(boton){
        Ext.Ajax.request({
            url: 'empaquetar',
            callback: function(options, success, response) {

            }
        });
    }

});
