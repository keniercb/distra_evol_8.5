Ext.define('BaseModule.controller.WesternTree', {
    extend: 'CRM.core.controller.Base',
    // extend: 'Ext.app.Controller',

    refs: [{
        ref: 'westernTree',
        selector: 'westerntree'
    }, {
        ref: 'globalPanel',
        selector: 'globalpanel'
    }],

    init: function () {
        this.listen({
            store: {
                '#WesternTree': {
                    beforeload: this.onBeforeLoad,
                    load: this.onLoadTree
                }
            },
            component: {
                'westerntree': {
                    render: this.onRenderTree,
                    select: this.onNodeSelect
                },
                'westerntree button[action]': {
                    click: this.sortTree
                },
                'westerntree menuitem[action]': {
                    click: this.sortTree
                },
                'westerntree searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                }
            }
        });

    },
    onBeforeLoad: function (store) {
        this.loadMask = new Ext.LoadMask(this.getWesternTree(), {msg: "Cargando..."});
        this.loadMask.show();
    },
    onLoadTree: function (store, records, successful, eOpts) {
        this.loadMask.hide();
        this.getWesternTree().getRootNode().expand();
        if (records.length != 0) {
            //this.selectNode('0');
        }
    },
    onRenderTree: function (tree) {
        var mask = new Ext.LoadMask(tree.up('panel'), {msg: 'Cargando permisos'});
        mask.show();
        var controller=ModuleMgr.get(tree.module || 'Nomencladores');
        // console.log('this.module: ',tree.module)
        // console.log('Controller: ',controller)
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'cargaracciones'}, controller),
            method: 'POST',
            params: {
                idfuncionalidad: controller.securityData.idfuncionalidad
            },
            callback: function (opts, success, response) {
                mask.hide();
                if(success){
                    var respuesta=Ext.decode(response.responseText);
                    // console.log('respuesta:', respuesta)
                    var ver=[];
                    respuesta.forEach(function(x){
                        if(x['abreviatura'].substr(0,3)=='add')ver.push(x['abreviatura']);
                    })
                    // console.log(ver)
                    tree.getStore().load({
                        callback: function(records, operation, success){
                            if(success){
                                var toRemove=[];
                                tree.getRootNode().cascadeBy(function(node){
                                    if(ver.indexOf('add'+node.get('clase'))==-1)toRemove.push(node);
                                })
                                toRemove.forEach(function(y){
                                    if(y)y.remove();
                                })
                            }
                        }
                    });
                    // tree.getRootNode().cascadeBy(function(node){
                    //     var finded=respuesta.some(function(x){return x['abreviatura']=='add'+node.get('clase')});
                    //     if(finded)node.remove();
                    // })
                    // var  cmptes = options.container && options.container.isXType('container') ?
                    //     Ext.ComponentQuery.query('*['+selector+'='+abreviatura+']', options.container) :
                    //     Ext.ComponentQuery.query('*['+selector+'='+abreviatura+']');
                }
            }
        });

    },
    onSearch: function (field) {
        this.getWesternTree().getStore().filter("text", field.getValue());
    },
    onClear: function (field) {
        this.getWesternTree().getStore().clearFilter();
        this.getWesternTree().getRootNode().expand();
    },
    onNodeSelect: function (rowModel, record, index, eOpts) {
        var idNode = rowModel.getLastSelected().id;
        this.application.getGlobalPanelController().addTabPanel(idNode, record);
    },
    selectNode: function (idNode) {
        var rootNode = this.getWesternTree().getRootNode(),
            idNode = idNode.split('tab');
        if (rootNode.childNodes.length > 0) {
            //var child = rootNode.childNodes[idNode];
            var child = this.getWesternTree().getStore().getNodeById(idNode[1]);

            this.getWesternTree().getSelectionModel().select(child);
        }
    },
    sortTree: function (btn) {
        this.getWesternTree().getStore().sort('text', btn.action);
    },
    getWesternTree: function () {
        var p = Ext.ComponentQuery.query('westerntree'),
            a = this.getActiveModuleTab().down('westerntree');
        for (var k in p) {
            if (p[k].id == a.id) {
                return p[k];
            }
        }
    },
    getActiveModuleTab: function () {
        return Ext.ComponentQuery.query('main_tabpanel')[0].getActiveTab();
    }
});
