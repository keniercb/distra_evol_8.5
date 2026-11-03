Ext.define('BaseModule.controller.GlobalPanel', {
    extend: 'Ext.app.Controller',
    alias: 'controller.globalpanel',

    refs: [{
        ref: 'westernTree',
        selector: 'westerntree'
    }, {
        ref: 'globalPanel',
        selector: 'globalpanel'
    }],

    init: function () {
        this.listen({
            component: {
                'globalpanel tabpanel': {
                    add: this.onAddTabItem,
                    remove: this.onCloseItem
                },
                'tabpanel > panel[mirror]': {
                    activate: this.onActivateItem,
                    close: this.onCloseItem,
                    deactivate: this.onDeActivateItem
                },
                'globalpanel': {
                    beforerender: this.onBeforerender,
                    render: this.onRender
                }
            }
        });


    },
    addTabPanel: function (idNode, record) {
        var _this = this,
            data = record.data,
            idpanel = this.getActiveModuleTab().id,
            id = idpanel + 'tab' + record.id;

        if (!Ext.getCmp(id)) {
            this.getGlobalPanel().tabPanel.add({
                id: id,
                title: data.text,
                closable: true,
                layout: 'fit',
                iconCls: record.data.iconCls,
                mirror: true,
                border: false,
                items: Ext.create('BaseModule.view.CenterGrid', {
                    modelName: data.clase,
                    //border: true,
                    gen: data.gen
                })
            });
        } else {
            Ext.getCmp(id).show();
        }
    },
    onAddTabItem: function (tabpanel, component) {
        component.show();
        var grid = component.down('centergrid'),
            globalpanel = grid.up('globalpanel');

        if (grid) {
            var module = globalpanel ? globalpanel.module : this.application.getGlobalPanelController().getGlobalPanel().module;
            grid.module = module;
            grid.fireEvent('onadded', grid);
        }
    },
    onActivateItem: function (item) {
        var cmps = Ext.ComponentQuery.query('panel[id=' + item.id + '] button[keyMap],panel[id=' + item.id + '] searchfield[keyMap]');

        for (k in cmps) {
            if(Ext.isBoolean(cmps[k].currentstate)){
                var disable = cmps[k].allwaysEnabled ? !cmps[k].allwaysEnabled : cmps[k].currentstate;
                cmps[k].setDisabled(disable);
            }
        }
        //this.application.getWesternTreeController().selectNode(item.id);
    },
    onDeActivateItem: function (item) {
        var cmps = Ext.ComponentQuery.query('panel[id=' + item.id + '] button[keyMap],panel[id=' + item.id + '] searchfield[keyMap]');

        for (k in cmps) {
            cmps[k].currentstate = !cmps[k].disabled ? false : true;
            cmps[k].disable();
        }
    },
    onCloseItem: function () {
        if (this.getGlobalPanel().tabPanel.items.length == 0) {
            this.getWesternTree().getSelectionModel().deselectAll();
        }
    },
    onBeforerender: function (panel) {
        if (!panel.module) {
            alert('configure la propiedad module de la clase ' + panel.$className);
            return false;
        }
    },
    onRender: function (panel) {
        if (panel.modelName) {
            var grid = Ext.create('BaseModule.view.CenterGrid', {
                    modelName: panel.modelName,
                    etiquetas: panel.etiquetas
                }),
                module = grid.up('globalpanel') ? grid.up('globalpanel').module : this.application.getGlobalPanelController().getGlobalPanel().module;

            panel.add(grid);

            grid.module = module;
            grid.fireEvent('onadded', grid);
        }
    },
    getGlobalPanel: function () {
        var p = Ext.ComponentQuery.query('globalpanel'),
            a = this.getActiveModuleTab();
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
