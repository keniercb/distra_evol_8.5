Ext.ns('Maestro.ConfigurarReporte.controller');

Maestro.ConfigurarReporte.controller.ListModule = Ext.extend( Maestro.ConfigurarReporte.base.Controller,{
    isWinStateInsert: true,
    init: function(){

        this.registerEvents({
            'listmodule': {
                render: this.onRenderList,
                rowdblclick: this.showWinUpdate 
            },
            'listmodule selModel': {
                selectionchange: this.onSelectionChange 
            },
            'tbarmodule btnInsert':{
                click: this.showWinInsert
            },
            'tbarmodule btnUpdate':{
                click: this.showWinUpdate
            },
            'tbarmodule btnDelete':{
                click: this.showWinDelete
            },
            'editmodule': {
                render: this.initEditModuleKeyMap,
                hide: this.onHideWinEdit
            },
            'editmodule btnAccept':{
                click: this.onClickBtnAccept
            },
            'editmodule btnApply':{
                click: this.onClickBtnApply
            },
            'editmodule btnCancel':{
                click: this.hideWinEdit
            }
        }, this);

    },
    onRenderList : function(list){
        var me = this,
            tbarmodule = me.getView('tbarmodule');

        tbarmodule.setEnableBtn(true, false, false);

        setTimeout(function(){  
            me.getStore('module').load();
            tbarmodule.btnInsert.focus(false, 100);
        }, 10);

        me.initListModuleKeyMap(list);
    },
    initListModuleKeyMap: function(listmodule){
        
        var keymap = new Ext.KeyMap(listmodule.getEl(), [{
                key: Ext.EventObject.I,
                alt: true,
                fn: this.showWinInsert,
                scope: this
            },{
                key: Ext.EventObject.M,
                alt: true,
                fn: function(k, e){
                    if(!this.getView('tbarmodule').btnUpdate.disabled)
                        this.showWinUpdate();
                },
                scope: this
            },{
                key: Ext.EventObject.DELETE,
                fn: function(k, e){
                    if(!this.getView('tbarmodule').btnDelete.disabled)
                        this.showWinDelete();
                },
                scope: this
        }]);
    },
    initEditModuleKeyMap: function(editmodule){

        var keymap = new Ext.KeyMap(editmodule.getEl(), [{
                key: Ext.EventObject.X,
                alt: true,
                fn: this.hideWinEdit,
                scope: this
            },{
                key: Ext.EventObject.P,
                alt: true,
                ctrl: true,
                fn: function(k, e){
                    var btnApply = this.getView('editmodule').btnApply;

                    if(!btnApply.disabled && btnApply.isVisible())
                        this.onClickBtnApply();
                },
                scope: this
            },{
                key: Ext.EventObject.ENTER,
                fn: function(k, e){
                    if(!this.getView('editmodule').btnAccept.disabled)
                        this.onClickBtnAccept();
                },
                scope: this
        }]);
    },
    onSelectionChange: function(sm){
        var me  = this, 
            tbarmodule = me.getView('tbarmodule');

        switch(sm.getCount()){
            case 0 :
                tbarmodule.setEnableBtn(true, false, false);
                break;
            case 1 :
                tbarmodule.setEnableBtn(true, true, true);
                break;
            default :
                tbarmodule.setEnableBtn(true, false, true);
        }
    },
    showWinInsert: function(){
        this.isWinStateInsert = true;
        this.initActionWinEdit(); 
    },
    showWinUpdate: function(){
        var smListModule = this.getView('listmodule').getSelectionModel();

        if(smListModule.getCount() == 1){
            this.isWinStateInsert = false;
            this.initActionWinEdit(smListModule.getSelected()); 
        }
    },
    showWinDelete: function(){
        var smListModule = this.getView('listmodule').getSelectionModel();

        if(smListModule.hasSelection()){

            this.getResource('module').deleteSelection({
                records: smListModule.getSelections(),
                msgPlural: smListModule.getCount()>1,
                fn: function(){ this.getStore('module').load(); },
                scope: this
            });
        }
    },
    initActionWinEdit: function(record){
        var winedit = this.getView('editmodule'),
            formEdit = winedit.form.getForm();

        winedit.setTitle(Maestro.ConfigurarReporte.idiom[(this.isWinStateInsert)?'titleWinInsert':'titleWinUpdate']);
        winedit.btnApply[(this.isWinStateInsert)?'show':'hide']();
        formEdit.reset();
        winedit.tfIdentificador.focus(false, 500);

        winedit.show();

        if(!this.isWinStateInsert)
            formEdit.loadRecord(record);
    },
    onClickBtnAccept: function(){
        this.executeActionInsertUpdate(true);
    },
    onClickBtnApply: function(){
        this.executeActionInsertUpdate(false);
    },
    executeActionInsertUpdate: function(btnAccept){
        var me = this,
            winedit = me.getView('editmodule'),
            formEdit = winedit.form.getForm();

        me.getResource('module')[(me.isWinStateInsert)?'insertModule':'updateModule']({
            params: formEdit.getValues(),
            success: function(){
                if(btnAccept)
                    winedit.hide();
                else{
                    winedit.tfIdentificador.focus(false, 500);
                    formEdit.reset();
                }
                me.getStore('module').load(); 
            },
            scope: me
        }); 
    },
    hideWinEdit: function(){
        this.getView('editmodule').hide();
    },
    onHideWinEdit: function(win){
        this.getView('tbarmodule').btnInsert.focus(false, 100);
    }
});