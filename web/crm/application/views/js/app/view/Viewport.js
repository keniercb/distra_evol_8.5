Ext.define('CRM.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'border',
    alias: 'widget.shell',
    itemId:'crm_viewport',

    initComponent: function () {
        this.etiquetas = LangMgr.getLang();

        if(!this.items) {
            //this.html = '<div id="loading-mask" class="loading-mask"><div id="loading-container">' +
            //'<div id="loading-animator">' +
            //'<div class="loader" id="loader">Loading...</div> </div>' +
            //'<div id="loading"><h1 class="title">' + this.etiquetas.nameApp + '</h1>' +
            //    '<hr class="title-separator"><hr class="title-separator-dark">' +
            //    '<div class="subtitle">' + this.etiquetas.lbLoadingModules + '</div>' +
            //    '</div></div>' +
            //    '<div class="copyrigth-footer" >'+ this.etiquetas.lbCopyrigth +
            //    '</div>';
        }

        this.callParent();
        this.doLayout();
    }

});
