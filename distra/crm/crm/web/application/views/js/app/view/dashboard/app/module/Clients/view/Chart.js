Ext.define('Clients.view.Chart', {
    extend: 'Ext.panel.Panel',
    requires:['Clients.store.ClientProviderState'],
    alias: 'widget.clients-main-chart',
    margins: '0',
    frame:false,
    layout:'fit',
    border:false,
    categoriesId:'',
    categoriesTpl:[
        '<fieldset id={4} style="border-radius: 8px; color: rgb(85, 85, 85);border: 1px solid rgb(204, 204, 204); margin: 0px 5%; padding: 5px;">',
        '<div style="margin: 0px 15%">',
        '<div style="float: left;"><input id="{0}" name="_option_" type="radio" checked value="1">',
        '<label for="{0}" style="position: relative; top: -2px; padding: 2px;">{1}</label></div>',
        '<div style="float: right;"><input id="{2}" name="_option_" type="radio" value="0">',
        '<label for="{2}" style="position: relative; top: -2px; padding: 2px;">{3}</label></div>',
        '<div style="clear: both;"></div></div>',
        '</fieldset>'
    ],
    getCategoriesCmp:function(){
        return this.categoriesTpl;
    },
    getCategoriesRef:function() {
        return this.categoriesId;
    },
    initComponent: function () {
        var labels = this.isContained.$lang;
        this.categoriesId = this.id + '-fieldset';
        var tpl = new Ext.Template(this.categoriesTpl);
        tpl = this.categoriesTpl = tpl.apply([
            this.id + this.getCategoriesRef()[0], labels.firstCategories,
            this.id + this.getCategoriesRef()[1], labels.secondCategories,
            this.categoriesId
        ]);
        this.callParent(arguments);
    }
});