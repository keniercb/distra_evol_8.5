Ext.define('Reportes.controller.Filtros', {
    extend: 'CRM.core.controller.Base',
    refs: [
        {ref: 'GpFiltros', selector: 'gpfiltros'},
        {ref: 'TreeReportes', selector: 'treereportes'},
        {ref: 'WinFiltros', selector: 'winfiltros'},
        {ref: 'WinEditFiltro', selector: 'wineditfiltro'}
    ],
    init: function () {
        var me = this;

        me.getLang();

        me.listen({
            store: {
                '#stFiltros': {
                    beforeload: this.beforeloadStoreFiltros,
                }
            },
            component: {
                "treereportes button[action=filtrosreporte]": {
                    click: this.showWinFiltros
                },
                "winfiltros button[action=cerrar]": {
                    click: this.hideWinFiltros
                },
                "gpfiltros": {
                    selectionchange: this.onSelectionChangeFiltros,
                },
                "gpfiltros button[action=addfiltro] menu": {
                    click: Ext.Function.pass(this.showWinEditFiltro, [true], this)
                },
                "gpfiltros button[action=modfiltro]": {
                    click: Ext.Function.pass(this.showWinEditFiltro, [false], this)
                },
                "gpfiltros button[action=elimfiltro]": {
                    click: this.eliminarFiltro
                },
                "wineditfiltro button[action=aceptar]":{
                    click: this.saveFiltro
                },
                "wineditfiltro button[action=aplicar]":{
                    click: this.saveFiltro
                },
                "wineditfiltro button[action=cerrar]":{
                    click: this.closeWinEditFiltro
                },
                "wineditfiltro form field[action=rdsql]":{
                    change: this.changeCheckSql
                },
                "wineditfiltro form field[action=rdservicio]":{
                    change: this.changeCheckServicio
                },
                "wineditfiltro form field[action=setestructurapropia]":{
                    change: this.changeCheckEstructuraPropia
                }
            }
        });
    },
    showWinFiltros: function(){
        this.getWinFiltros().show();

        var store = this.getGpFiltros().getStore();
        store.idreporte = this.getTreeReportes().getSelectionModel().getSelection()[0].get('idreporte');
        store.load();
    },
    getWinFiltros: function(){
        if(!this.winfiltros){
            this.winfiltros = new Ext.create('Reportes.view.WinFiltros');
        }
        return this.winfiltros;
    },
    getWinEditFiltro: function(){
        if(!this.wineditfiltro){
            this.wineditfiltro = new Ext.create('Reportes.view.WinEditFiltro');
        }
        return this.wineditfiltro;
    },
    hideWinFiltros: function(){
        this.getWinFiltros().hide();
    },
    beforeloadStoreFiltros: function(store, operac){
        store.removeAll();

        if(!operac.params)
            operac.params = {};
        operac.params.idreporte = store.idreporte;
    },
    onSelectionChangeFiltros: function(sm, select){
        this.getGpFiltros().down('button[action=modfiltro]').setDisabled( select.length == 0 );
        this.getGpFiltros().down('button[action=elimfiltro]').setDisabled( select.length == 0);
    },
    showWinEditFiltro: function(btnAdd, menu, item){
        var win = this.getWinEditFiltro(),
            recordSelected = this.getGpFiltros().getSelectionModel().getSelection()[0];
        win.setActionInsert(btnAdd);
        win.show((btnAdd)? item.filterType : recordSelected.get('tipo'));
        // console.log('recordSelected', recordSelected)
        if(!btnAdd)
            win.loadValues(recordSelected);
    },
    eliminarFiltro: function(){
        var me = this;

        mostrarMensaje(2, this.etiquetas.msgElimFiltro, function (response) {
            if (response === 'ok') {

                var selection = me.getGpFiltros().getSelectionModel().getSelection()[0];

                Ext.MessageBox.show({
                    msg: me.etiquetas.msgElimDataFiltro,
                    title: me.etiquetas.lbTitleWait,
                    width: 300,
                    wait: true,
                    waitConfig: {interval: 200}
                });

                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'deleteFiltro'}, me),
                    params: {values: Ext.encode(selection.get('idfiltro'))},
                    callback: function (options, success, response) {
                        Ext.MessageBox.hide();
                        var info = Ext.decode(response.responseText);

                        if(info.success){
                            mostrarMensaje(1, me.etiquetas.msgSuccessDeleteFiltro);
                            me.getGpFiltros().getStore().load();
                        }else
                            mostrarMensaje(3, 'Error incorporar mensaje');

                    },
                    scope: this
                });
            }
        });
    },
    closeWinEditFiltro: function(){
        this.getWinEditFiltro().hide();
    },
    saveFiltro: function(btn){
        var me = this,
            win = this.getWinEditFiltro(),
            store = me.getGpFiltros().getStore(),
            saveData = Ext.apply(win.formFiltro.getForm().getValues(), {
                idreporte: store.idreporte,
                tipo: win.filtertype
            });
        // if(!win.formFiltro.down('field[name=estructuras]').isDisabled()){
        //     saveData['idestructuras']= win.formFiltro.down('field[name=estructuras]').idValue.toString();
        //     saveData['arrayidestructuras']= win.formFiltro.down('field[name=estructuras]').idValue;
        //     saveData['estructuras']= win.formFiltro.down('field[name=estructuras]').getValue();
        // }
        console.log('saveData:', saveData)
        
        Ext.MessageBox.show({
            msg: me.etiquetas.msgSaveDataFiltro,
            title: me.etiquetas.lbTitleWait,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });

        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: (win.getActionInsert())?'insertFiltro':'updateFiltro'}, me),
            params: {values: Ext.encode(saveData)},
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                var info = Ext.decode(response.responseText);

                if(info.success){

                    mostrarMensaje(1, me.etiquetas[(win.getActionInsert())?'msgSuccessInsertFiltro':'msgSuccessUpdateFiltro']);

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
    changeCheckSql: function(comp, value){
        var form = this.getWinEditFiltro().formFiltro;
        if(value && comp.isVisible()){
            form.down('field[name=sentenciasql]').enable();
            form.down('field[name=nomservicio]').reset();
            form.down('field[name=nomservicio]').disable();
        }
    },
    changeCheckServicio: function(comp, value){
        var form = this.getWinEditFiltro().formFiltro;
        if(value && comp.isVisible()){
            form.down('field[name=nomservicio]').enable();
            form.down('field[name=sentenciasql]').reset();
            form.down('field[name=sentenciasql]').disable();
        }
    },
    changeCheckEstructuraPropia: function(field){
        var form = this.getWinEditFiltro().formFiltro;
        if(field.isVisible()){
            form.down('field[name=estructuras]').setDisabled(field.getValue());
        }
    }
});