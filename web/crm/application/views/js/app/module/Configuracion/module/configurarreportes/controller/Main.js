Ext.define('Reportes.controller.Main', {
    extend: 'CRM.core.controller.Base',
    refs: [
        {ref: 'GpModulos', selector: 'gpmodulos'},
        {ref: 'WinEditModulo', selector: 'wineditmodulo'}
    ],
    views: ['Main', 'GpFiltros', 'GpModulos', 'TreeReportes', 'WinEditFiltro', 'WinEditModulo', 'WinEditReporte', 'WinFiltros'],
    init: function () {
        var me = this;

        me.getLang();

        me.listen({
            component: {
                "gpmodulos": {
                    render: this.onRenderGpModulos,
                    selectionchange: this.onSelectionChangeGpModulos
                },
                "gpmodulos button[action=addmodulo]": {
                    click: Ext.Function.pass(this.showWinEditModulo, [true], this),
                },
                "gpmodulos button[action=modmodulo]": {
                    click: Ext.Function.pass(this.showWinEditModulo, [false], this),
                },
                "gpmodulos button[action=elimmodulo]": {
                    click: this.eliminarModulo,
                },
                "wineditmodulo button[action=aceptar]":{
                    click: this.saveModulo
                },
                "wineditmodulo button[action=aplicar]":{
                    click: this.saveModulo
                },
                "wineditmodulo button[action=cerrar]":{
                    click: this.closeWinEditModulo
                }
            }
        });
    },
    onRenderGpModulos: function(grid){
        this.getGpModulos().getStore().load();
        grid.module = 'Reportes';
        ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(grid, true);
    },
    onSelectionChangeGpModulos: function(sm, select){
        this.getGpModulos().down('button[action=modmodulo]').setDisabled( select.length == 0 );
        this.getGpModulos().down('button[action=elimmodulo]').setDisabled( select.length == 0);
    },
    showWinEditModulo: function(actionAdd){
        var win = this.getWinEditModulo();
        win.setActionInsert(actionAdd);
        win.show();

        if(!actionAdd){
            var recordSelected = this.getGpModulos().getSelectionModel().getSelection()[0];
            win.loadValues(recordSelected);
        }
    },
    getWinEditModulo: function(){
        if(!this.wineditmodulo){
            this.wineditmodulo = new Ext.create('Reportes.view.WinEditModulo');
        }
        return this.wineditmodulo;
    },
    saveModulo: function(btn){
        var me = this,
            win = this.getWinEditModulo();

        Ext.MessageBox.show({
            msg: me.etiquetas.msgSaveDataModulo,
            title: me.etiquetas.lbTitleWait,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });

        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: (win.getActionInsert())?'insertModule':'updateModule'}, me),
            params: {values: Ext.encode(win.formModulo.getForm().getValues())},
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                var info = Ext.decode(response.responseText);

                if(info.success){

                    mostrarMensaje(1, me.etiquetas[(win.getActionInsert())?'msgSuccessInsertModulo':'msgSuccessUpdateModulo']);

                    if(btn.action == 'aplicar')
                        win.resetComponents();
                    else
                        win.hide();

                    this.getGpModulos().getStore().load();
                }else{

                    if(win.getActionInsert())
                        var msg = me.etiquetas[(info.codigoMsg == 1)?'msgExistIdentif':'msgInsertExistDenom'];
                    else
                        var msg = me.etiquetas[(info.codigoMsg == 1)?'msgExistIdentif':'msgUpdateExistDenom'];

                    mostrarMensaje(6, msg);
                }
            },
            scope: this
        });
    },
    closeWinEditModulo: function(){
        this.getWinEditModulo().hide();
    },
    eliminarModulo: function(){
        var me = this;

        mostrarMensaje(2, this.etiquetas.msgElimModulo, function (response) {
            if (response === 'ok') {

                var idselectedmodule = me.getGpModulos().getSelectionModel().getSelection()[0].get('idmodulo');

                Ext.MessageBox.show({
                    msg: me.etiquetas.msgElimDataModulo,
                    title: me.etiquetas.lbTitleWait,
                    width: 300,
                    wait: true,
                    waitConfig: {interval: 200}
                });

                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'deleteModule'}, me),
                    params: {values: Ext.encode(idselectedmodule)},
                    callback: function (options, success, response) {
                        Ext.MessageBox.hide();
                        var info = Ext.decode(response.responseText);

                        if(info.success){
                            mostrarMensaje(1, me.etiquetas.msgSuccessDeleteModulo);
                            me.getGpModulos().getStore().load();
                        }else
                            mostrarMensaje(3, 'Error incorporar mensaje');

                    },
                    scope: this
                });
            }
        });
    }
});