Ext.define('ConfPlantilla.controller.Main', {
    extend: 'CRM.core.controller.Base',
    refs: [
        {ref: 'Main', selector: 'gpplantilla'},
        {ref: 'WinEditPlantilla', selector: 'wineditplantilla'},
        {ref: 'WinVistaPrevia', selector: 'winvistaprevia'}
    ],
    init: function () {
        var me = this;

        me.getLang();

        me.listen({
            component: {
                "gpplantilla": {
                    render: this.onRenderGpPlantilla,
                    selectionchange: this.onSelectionChangeGpPlantilla
                },
                "gpplantilla button[action=addplantilla]": {
                    click: Ext.Function.pass(this.showWinEditPlantilla, [true], this)
                },
                "gpplantilla button[action=modplantilla]": {
                    click: Ext.Function.pass(this.showWinEditPlantilla, [false], this)
                },
                "gpplantilla button[action=elimplantilla]": {
                    click: this.eliminarPlantilla
                },
                "gpplantilla button[action=vistaprevia]":{
                    click: this.showWinVistaPrevia
                },
                "wineditplantilla button[action=aceptar]":{
                    click: this.savePlantilla
                },
                "wineditplantilla button[action=aplicar]":{
                    click: this.savePlantilla
                },
                "wineditplantilla button[action=cerrar]":{
                    click: this.closeWinEditPlantilla
                },
                "winvistaprevia button[action=cerrar]":{
                    click: this.closeWinVistaPrevia
                },
                'gpplantilla searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                }
            }
        });
    },
    onRenderGpPlantilla: function(grid){
        this.getMain().getStore().load();
        grid.module = 'ConfPlantilla';
        ModuleMgr.get('BaseModule').getCenterGridController().addToKeyMap(grid, true);
    },
    onSelectionChangeGpPlantilla: function(sm, select){
        this.getMain().down('button[action=modplantilla]').setDisabled( select.length != 1 );
        this.getMain().down('button[action=elimplantilla]').setDisabled( select.length == 0 );
        this.getMain().down('button[action=vistaprevia]').setDisabled( select.length != 1);
    },
    showWinEditPlantilla: function(actionAdd){
        var win = this.getWinEditPlantilla();
        win.setActionInsert(actionAdd);
        win.show();

        if(!actionAdd){
            var recordSelected = this.getMain().getSelectionModel().getSelection()[0];
            win.loadValues(recordSelected);
        }
    },
    getWinEditPlantilla: function(){
        if(!this.wineditplantilla){
            this.wineditplantilla = new Ext.create('ConfPlantilla.view.WinEditPlantilla');
        }
        return this.wineditplantilla;
    },
    savePlantilla: function(btn){
        var me = this,
            win = this.getWinEditPlantilla(),
            store = me.getMain().getStore();

        Ext.MessageBox.show({
            msg: me.etiquetas.msgSaveDataPlantilla,
            title: me.etiquetas.lbTitleWait,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });

        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: (win.getActionInsert())?'insertPlantilla':'updatePlantilla'}, me),
            params: {values: Ext.encode(win.getValues())},
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                var info = Ext.decode(response.responseText);

                if(info.success){

                    mostrarMensaje(1, me.etiquetas[(win.getActionInsert())?'msgSuccessInsertPlantilla':'msgSuccessUpdatePlantilla']);

                    if(btn.action == 'aplicar')
                        win.resetComponents();
                    else
                        win.hide();

                    store.load();
                }else{

                    if(win.getActionInsert())
                        var msg = me.etiquetas.msgInsertExistDenomFiltro;
                    else
                        var msg = me.etiquetas.msgUpdateExistDenomFiltro;

                    mostrarMensaje(6, msg);
                }
            },
            scope: this
        });
    },
    eliminarPlantilla: function(){
        var me = this,
            sm =  me.getMain().getSelectionModel(),
            funtNumero = (sm.getCount()>1)?'getPlural':'getSingular',
            etiqNumero = (sm.getCount()>1)?'lbPlantillaPlural':'lbPlantillaSing';

        mostrarMensaje(2, me.etiquetas.msgDelConfirm[funtNumero]('F').get(me.etiquetas[etiqNumero]), function (response) {
            if (response === 'ok') {

                Ext.MessageBox.show({
                    msg: me.etiquetas.msgDelWait[funtNumero]('F').get(me.etiquetas[etiqNumero]),
                    title: me.etiquetas.lbTitleWait,
                    width: 300,
                    wait: true,
                    waitConfig: {interval: 200}
                });

                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'deletePlantilla'}, me),
                    params: {values: Ext.encode( me.getIdPLantillasSeleccionadas(sm.getSelection()) )},
                    callback: function (options, success, response) {
                        Ext.MessageBox.hide();
                        var info = Ext.decode(response.responseText);

                        if(info.success){
                            mostrarMensaje(1, me.etiquetas.msgDelSuccess[funtNumero]('F').get(me.etiquetas[etiqNumero]));
                            me.getMain().getStore().load();
                        }else
                            mostrarMensaje(6, 'Error incorporar mensaje');

                    },
                    scope: this
                });
            }
        });
    },
    getIdPLantillasSeleccionadas: function(select){
        var me = this,
            ids = new Array();

        select.forEach(function(elem){
            ids.push(elem.get('idplantilla'));
        });

        return ids;
    },
    closeWinEditPlantilla: function(){
        this.getWinEditPlantilla().hide();
    },
    showWinVistaPrevia: function(){
        var win = this.getWinVistaPrevia().show(),
            recordSelected = this.getMain().getSelectionModel().getSelection()[0];
        win.show();
        win.loadValues(recordSelected);
    },
    getWinVistaPrevia: function(){
        if(!this.winvistaprevia){
            this.winvistaprevia = new Ext.create('ConfPlantilla.view.WinVistaPrevia');
        }
        return this.winvistaprevia;
    },
    closeWinVistaPrevia: function(){
        this.getWinVistaPrevia().hide();
    },
    onSearch: function (field, data) {
        var me = this,
            grid = me.getMain(),
            filter = new Array();
        filter.push({
            field: 'denominacion',
            value: field.getValue()
        });
        grid.getStore().proxy.extraParams = {
            'filters': Ext.encode(filter)
        };
        grid.getStore().load();
    },
    onClear: function (field) {

        if (this.getMain().getStore().proxy.extraParams.filters) {
            this.getMain().getStore().proxy.extraParams = {};
            this.getMain().getStore().load();
        }
    }
});