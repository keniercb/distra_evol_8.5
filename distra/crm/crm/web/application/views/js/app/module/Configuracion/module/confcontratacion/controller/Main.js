Ext.define('ConfContratacion.controller.Main', {
    extend: 'CRM.core.controller.Base',

    refs: [
        {ref: 'centerPanel', selector: 'confcenterpanel'}
    ],
    requires: [
        'ConfContratacion.view.TabFileConfiguracion'
    ],

    init: function () {
        var me = this;
        this.getLang();
        this.listen({
            component: {
                confwesterntree: {
                    select: this.onNodeSelect,
                    // render: this.disableNode
                }
            }
        });
    },

    onNodeSelect: function (rowmodel, record) {
        if (record.data.id) {
            var panel = this.getCenterPanel(),
                oldform = Ext.ComponentQuery.query('form[hidden=false]'),
                newform = Ext.ComponentQuery.query('[xtype='+record.data.id+']');

            if(oldform[0]){
                oldform[0].hide();
            }
            console.log('record.data.id:',record.data.id,newform[0]);
            if(!newform[0]){
                console.log('no existe');
                var className = Ext.ClassManager.getNameByAlias('widget.' + record.data.id);
                console.log('className', className)
                if (className) {
                    var view = Ext.create(className, {
                        hidden:false
                    });
                    console.log('view:',view)
                    panel.add(view);
                }
            }else{
                console.log('existe');
                newform[0].show();
            }
            panel.doLayout();
        }
    },

    disableNode:function(tree){
        var root = tree.getStore().getRootNode(),
            nodes = root.childNodes,
            modules = this.application.crm.activeModules;
        for (var i = nodes.length - 1; i >= 0; i--) {
            if (modules[nodes[i].data.module] == "false") {
                nodes[i].remove();
            }
        }

    }

});