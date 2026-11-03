Ext.ns('Maestro.ConfigurarReporte.controller');

Maestro.ConfigurarReporte.controller.ListFilter = Ext.extend( Maestro.ConfigurarReporte.base.Controller,{
    isWinStateInsert: true,
    filterTypeInsertUpdate: 0,
    init: function(){

        this.registerEvents({
            'crudfilter': {
                resetWinElements: this.initCrudFilters,
            },
             'crudfilter btnClose': {
                click: this.hideWinCrud,
            },
            'tbarfilter menuTypes':{
                 itemclick : this.showWinInsert
            },
            'tbarfilter btnUpdate':{
                 click : this.showWinUpdate
            },
            'tbarfilter btnDelete':{
                 click : this.showWinDelete
            },
            'editfilter btnAccept':{
                click: this.onClickBtnAccept
            },
            'editfilter btnApply':{
                click: this.onClickBtnApply
            },
            'editfilter btnCancel':{
                click: this.hideWinEdit
            },
            'listfilter': {
                rowdblclick: this.showWinUpdate 
            },
            'listfilter selModel': {
                selectionchange: this.onSelectionChange,
            },
            'editfilter rbSql': {
                 check : this.onCheckFieldFuenteDatosSql,
            },
            'editfilter rbService': {
                 check : this.onCheckFieldFuenteDatosService,
            },
        }, this);

    },
    hideWinCrud: function(){
        this.getView('crudfilter').hide();
    },
    initCrudFilters: function(idreporte){
        var me = this,
            filterstore = me.getStore('filter');

        if(filterstore.baseParams.idreporte != idreporte){
            filterstore.baseParams.idreporte = idreporte;
            me.getView('tbarfilter').setEnableBtn(true, false, false);
        }
        filterstore.removeAll();
        filterstore.load();
    },
    onSelectionChange: function(sm){
        var me  = this, 
            tbarfilter = me.getView('tbarfilter');

        switch(sm.getCount()){
            case 0 :
                tbarfilter.setEnableBtn(true, false, false);
                break;
            case 1 :
                tbarfilter.setEnableBtn(true, true, true);
                break;
            default :
                tbarfilter.setEnableBtn(true, false, true);
        }
    },
    showWinInsert: function(itemclick){
        var me = this;

        me.isWinStateInsert = true;
        me.initActionWinEdit(itemclick.filterType);
    },
    showWinUpdate: function(){
        var smListFilter = this.getView('listfilter').getSelectionModel(),
            selected = smListFilter.getSelected();

        if(smListFilter.getCount() == 1){
            this.isWinStateInsert = false;
            this.initActionWinEdit(parseInt(selected.get('tipo')), selected); 
        }
    },
    showWinDelete: function(){
        var smListFilter = this.getView('listfilter').getSelectionModel();

        if(smListFilter.hasSelection()){

            this.getResource('filter').deleteSelection({
                records: smListFilter.getSelections(),
                msgPlural: smListFilter.getCount()>1,
                fn: function(){ this.getStore('filter').load(); },
                scope: this
            });
        }
    },
    initActionWinEdit: function(filtertype, record){
        var winedit = this.getView('editfilter'),
            formEdit = winedit.form.getForm();

        this.filterTypeInsertUpdate = filtertype;
        winedit.updateFieldsByFilterType(filtertype);
        winedit.setTitle(Maestro.ConfigurarReporte.idiom[(this.isWinStateInsert)?'titleWinInsertFilter':'titleWinUpdateFilter']);
        winedit.btnApply[(this.isWinStateInsert)?'show':'hide']();
        formEdit.reset();
        winedit.taService.disable();
        winedit.tfDenominacion.focus(false, 500);

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
            store = me.getStore('filter')
            winedit = me.getView('editfilter'),
            formEdit = winedit.form.getForm();

        me.getResource('filter')[(me.isWinStateInsert)?'insertFilter':'updateFilter']({
            params: Ext.apply(formEdit.getValues(),{
                idreporte : store.baseParams.idreporte,
                tipo: me.filterTypeInsertUpdate 
            }),
            success: function(){
                if(btnAccept)
                    winedit.hide();
                else{
                    winedit.tfDenominacion.focus(false, 500);
                    formEdit.reset();
                }
                store.load(); 
            },
            scope: me
        });
    },
    hideWinEdit: function(){
        this.getView('editfilter').hide();
    },
    onCheckFieldFuenteDatosSql: function(comp, checked){
        var winedit = this.getView('editfilter');
        
        if(checked && comp.isVisible()){
            winedit.taSql.enable();
            winedit.taService.reset();
            winedit.taService.disable();
        }

    },
    onCheckFieldFuenteDatosService: function(comp, checked){
        var winedit = this.getView('editfilter');
        
        if(checked && comp.isVisible()){
            winedit.taService.enable();
            winedit.taSql.reset();
            winedit.taSql.disable();
        }
    },
});