Ext.define('Reportes.controller.Reportes', {
    extend: 'CRM.core.controller.Base',
    refs: [
        {ref: 'GpModulos', selector: 'gpmodulos'},
        {ref: 'TreeReportes', selector: 'treereportes'},
        {ref: 'WinEditReporte', selector: 'wineditreporte'}
    ],
    init: function () {
        var me = this;
        me.getLang();

        me.listen({
            component: {
                "gpmodulos": {
                    selectionchange: this.onSelectionChangeGpModulos
                },
                "treereportes": {
                    render: this.onRenderTreeReportes,
                    selectionchange: this.onSelectionChangeTreeReportes,
                    beforeload: this.beforeloadStoreTree,
                    load: this.loadStoreTree,
                },
                "treereportes button[action=addreporte]": {
                    click: Ext.Function.pass(this.showWinEditReporte, [true], this)
                },
                "treereportes button[action=modreporte]": {
                    click: Ext.Function.pass(this.showWinEditReporte, [false], this)
                },
                "treereportes button[action=elimreporte]": {
                    click: this.eliminarReporte
                },
                "wineditreporte checkbox": {
                    change: this.changeCheckAgrupador
                },
                "wineditreporte combobox": {
                    change: this.changeComboTipoContenido
                },
                "wineditreporte button[action=aceptar]":{
                    click: this.saveReporte
                },
                "wineditreporte button[action=aplicar]":{
                    click: this.saveReporte
                },
                "wineditreporte button[action=cerrar]":{
                    click: this.closeWinEditReporte
                }
            }
        });
    },
    onRenderTreeReportes:function(tree){
        tree.module = 'Reportes';
        ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(tree, true);
    },
    beforeloadStoreTree: function(store, operac){
        operac.params.idmodulo = store.idmodulo;
    },
    loadStoreTree: function(tree, node){
        node.set('leaf', node.childNodes.length==0);
        if(!node.isRoot())
            node.expand();
    },
    onSelectionChangeGpModulos: function(sm){
        var tree =  this.getTreeReportes(),
            treeStore = tree.getStore();

        tree.getSelectionModel().deselectAll();
        tree.getRootNode().removeAll();

        if(sm.getCount() == 1){
            treeStore.idmodulo = sm.getSelection()[0].get('idmodulo');
            treeStore.load();
        }else{
            treeStore.idmodulo = 0;
            tree.down('button[action=addreporte]').setDisabled(true);
            tree.down('button[action=modreporte]').setDisabled(true);
            tree.down('button[action=elimreporte]').setDisabled(true);
            tree.down('button[action=filtrosreporte]').setDisabled(true);
        }
    },
    onSelectionChangeTreeReportes: function(sm, selected){
        var cant = sm.getCount(),
            isRoot = sm.getCount() && selected[0].isRoot(),
            isAgrupador = sm.getCount() && selected[0].get('agrupador') == 1,
            tree = this.getTreeReportes(),
            store = tree.getStore();

        if(cant && store.idmodulo){
            var enableBtnAdd = isRoot || isAgrupador;

            tree.down('button[action=addreporte]').setDisabled(!enableBtnAdd);
            tree.down('button[action=modreporte]').setDisabled(isRoot);
            tree.down('button[action=elimreporte]').setDisabled(isRoot);
            tree.down('button[action=filtrosreporte]').setDisabled(enableBtnAdd);
        }else{
            tree.down('button[action=addreporte]').setDisabled(true);
            tree.down('button[action=modreporte]').setDisabled(true);
            tree.down('button[action=elimreporte]').setDisabled(true);
            tree.down('button[action=filtrosreporte]').setDisabled(true);
        }
    },
    showWinEditReporte: function(actionAdd){
        var win = this.getWinEditReporte();
        win.setActionInsert(actionAdd);
        win.show();

        if(!actionAdd){
            var recordSelected = this.getTreeReportes().getSelectionModel().getSelection()[0];
            win.loadValues(recordSelected);
        }
    },
    getWinEditReporte: function(){
        if(!this.wineditreporte){
            this.wineditreporte = new Ext.create('Reportes.view.WinEditReporte');
        }
        return this.wineditreporte;
    },
    eliminarReporte: function(){
        var me = this;

        mostrarMensaje(2, this.etiquetas.msgElimReporte, function (response) {
            if (response === 'ok') {

                var selection = me.getTreeReportes().getSelectionModel().getSelection()[0];

                Ext.MessageBox.show({
                    msg: me.etiquetas.msgElimDataReporte,
                    title: me.etiquetas.lbTitleWait,
                    width: 300,
                    wait: true,
                    waitConfig: {interval: 200}
                });

                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'deleteReporte'}, me),
                    params: {values: Ext.encode(selection.get('idreporte'))},
                    callback: function (options, success, response) {
                        Ext.MessageBox.hide();
                        var info = Ext.decode(response.responseText);

                        if(info.success){
                            mostrarMensaje(1, me.etiquetas.msgSuccessDeleteReporte);
                            me.getTreeReportes().getStore().load({node:(selection.isRoot())?selection:selection.parentNode});
                        }else
                            mostrarMensaje(3, 'Error incorporar mensaje');

                    },
                    scope: this
                });
            }
        });
    },
    changeCheckAgrupador: function(comp, value){
        var me = this,
            win = me.getWinEditReporte(),
            combo = win.down('combobox'),
            form = win.down('form');
       
        if(value == 1)
            combo.reset();
        combo.setDisabled(value);

        form.fireEvent('validitychange',  form, !form.hasInvalidField());
    },
    changeComboTipoContenido: function(comp, value){
        this.updatePanelTipoContenido(value);
    },
    updatePanelTipoContenido: function(tipo){
        var me = this,
            compContentType = ['url', 'recurso', 'nombrecomponente','identificadorreporte'],
            win = me.getWinEditReporte(),
            comp;

        for (var i = 0; i < compContentType.length; i++) {
            comp = win.down('textfield[name='+compContentType[i]+']');
            if(tipo-1 == i){
                console.log(comp);
                comp.show();
                comp.enable();
            }else{
                comp.hide();
                comp.reset();
                comp.setDisabled(true);
            }
        }
    },
    closeWinEditReporte: function(){
        this.getWinEditReporte().hide();
    },
    saveReporte: function(btn){
        var me = this,
            win = this.getWinEditReporte(),
            store = me.getTreeReportes().getStore(),
            selected = me.getTreeReportes().getSelectionModel().getSelection()[0],
            idparent = (win.getActionInsert())?selected.get('idreporte'): selected.get('idpadre'),
            saveData = Ext.apply(win.formReporte.getForm().getValues(), {
                idmodulo:store.idmodulo,
                idpadre: (selected.isRoot())?0:idparent
            });

        Ext.MessageBox.show({
            msg: me.etiquetas.msgSaveDataReporte,
            title: me.etiquetas.lbTitleWait,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });

        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: (win.getActionInsert())?'insertReporte':'updateReporte'}, me),
            params: {values: Ext.encode(saveData)},
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                var info = Ext.decode(response.responseText);

                if(info.success){

                    mostrarMensaje(1, me.etiquetas[(win.getActionInsert())?'msgSuccessInsertReporte':'msgSuccessUpdateReporte']);

                    if(btn.action == 'aplicar')
                        win.resetComponents();
                    else
                        win.hide();

                    var parentNode = (selected.isRoot())?selected: selected.parentNode;
                    store.load({node:(win.getActionInsert())?selected:parentNode});
                }else{

                    if(win.getActionInsert())
                        var msg = me.etiquetas.msgInsertExistDenomReporte;
                    else
                        var msg = me.etiquetas.msgUpdateExistDenomReporte;

                    mostrarMensaje(6, msg);
                }
            },
            scope: this
        });
    }
});