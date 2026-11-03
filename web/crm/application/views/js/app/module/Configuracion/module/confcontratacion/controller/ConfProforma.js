Ext.define('ConfContratacion.controller.ConfProforma', {
    extend: 'CRM.core.controller.Base',
    refs: [
        {ref: 'mainForm', selector: 'confproforma'},
        {ref: 'mainWindow', selector: 'windowspace'},
        {ref: 'variableForm', selector: 'confproformavariables'},
        {ref: 'windowAddVariable', selector: 'windowaddvariable'},
    ],
    init: function () {
        var me = this;
        this.getLang();

        console.log('estoy aqui confproforma');

        this.activeForm = 0;

        this.listen({
            component: {
                'confproforma':{
                    render:this.loadConf,
                    show: this.startTask,
                    hide: function () {
                        this.activeForm--;
                    }
                },
                'confproforma button[action=save]': {
                    click: this.saveConfiguracion
                },
                'confproforma toggleslidefield': {
                    change: this.onChange
                },
                'confproforma button[action=cancel]': {
                    click: this.cancelConfig
                },
                'confproforma selectfield': {
                    select: this.showWinSelectEspacioTrabajo,
                    clear: this.onClearValueEspacioTrabajo
                },
                'windowspace[context=confproforma] treepanel': {
                    selectionchange: this.onSelectNodeEspacioTrabajo,
                    afterrender: this.onRenderEspacioTrabajo
                },
                'windowspace[context=confproforma] button[action=acept]': {
                    click: this.selectEspacioTrabajo
                },
                'confproformavariables grid':{
                    selectionchange: me.onSelectionChange
                },
                'confproformavariables button[action]':{
                    click: me.onClickVariables
                },
                'windowaddvariable form':{
                    validitychange: me.onValidityChange
                },
                'windowaddvariable button[action=acept]':{
                    click: me.guardarVariable
                },
            }
        });
    },
    onChange: function (toogleslide, newValue) {
        var query = Ext.ComponentQuery.query('panel[name=fpcontractspaces]'),
            panel = query[0];
        if (newValue == 'true') {
            panel.setDisabled(false);
        } else {
            panel.setDisabled(true);
        }
    },
    loadConf: function (form) {
        Ext.Function.defer(function(){
        var mask = new Ext.LoadMask(this.getMainForm(), {msg: this.etiquetas.msgLoading});
            mask.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'loadConfProforma'}, this),
                scope: this,
                callback: function (options, success, response) {
                    var response = Ext.decode(response.responseText);
                    console.log('response:', response, response.length)
                    if (response.length) {
                        var formG = this.getMainForm().getForm();
                        response[0]['activo']=response[0]['activo']==1;
                        console.log(response[0]);
                        formG.setValues(response[0]);
                    }
                    this.startTask(form);
                    mask.hide();
                }
               /* callback: function (options, success, response) {
                    var response = Ext.decode(response.responseText);

                    if(response.config && response.config['idconfproforma']){
                        var formG = this.getMainForm().getForm();
                        formG.setValues( response.config );
                    }
                    
                    this.startTask(form);
                    mask.hide();
                }*/
            });
        }, 100, this);
    },
    startTask: function (form) {
        this.activeForm++;
        Ext.TaskManager.start({
            run: this.checkForm.bind(this, form),
            interval: 100,
            scope: this
        });
    },
    checkForm: function (form) {
        if (this.activeForm != 0) {
            var invalid = form.hasInvalidField() || !form.isDirty();
            form.btnSave.setDisabled(invalid);
        } else {
            return false;
        }
    },
    saveConfiguracion: function () {
        var me = this,
            msg = this.etiquetas.msgWait,
            gen = 'f',
            concept = 'configuraci&oacute;n',
            conf = this.getConfiguration();

        Ext.MessageBox.show({
            title: this.etiquetas.lbTitleWait,
            msg: msg.getSingular(gen).get(concept),
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });

        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'saveConfProforma'}, this),
            params: {
                confproforma: Ext.encode(conf),
                responseCfg: {
                    action: 'save',
                    gen: gen,
                    concept: concept,
                    count: 1
                }
            },
            scope: me,
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                this.loadConf(me.getMainForm());
            }
        });
    },
    getConfiguration: function () {
        return this.getMainForm().getForm().getValues();
    },
    cancelConfig: function () {
        this.loadConf(this.getMainForm());
    },
    showWinSelectEspacioTrabajo: function(){
        Ext.create('ConfContratacion.view.WindowSpace',{
            context:'confproforma'
        }).show();
    },
    onClearValueEspacioTrabajo: function(field){
        var form = this.getMainForm().getForm(),
            hidden = form.findField(field.localId);

        if (hidden) {
            hidden.setValue('');
        }
    },
    onSelectNodeEspacioTrabajo: function (sm, records) {
        var win = this.getMainWindow(),
            btn = win.btnAceptar;

        btn.setDisabled(records.length != 1);
    },
    onRenderEspacioTrabajo: function (tree) {
        tree.getRootNode().expand();
    },
    selectEspacioTrabajo: function () {
        var form = this.getMainForm(),
            window = this.getMainWindow(),
            field = form.sfspace,
            hidden = form.hdspace,
            record = window.tree.getSelectionModel().getSelection()[0];

        field.setValue(record.data.text);
        hidden.setValue(record.data.id);

        window.destroy();
    },

    onValidityChange: function(form, valid) {
        var me = this;
        me.getWindowAddVariable().btnAceptar.setDisabled(!valid);
    },

    onClickVariables: function(button){
        var me=this;
        switch(button.action){
            case 'adicionarvariable':
                me.WindowAdicionar(button);
                break;
            case 'modificarvariable':
                me.WindowAdicionar(button);
                break;
            case 'eliminarvariable':
                me.EliminarVariable(button);
                break;
        }
    },

    EliminarVariable: function (button) {
        var me = this,
            grid=me.getVariableForm().down('grid'),
            records = grid.getSelectionModel().getSelection(),
            msg = me.etiquetas.msgDelConfirm,
            gen = 'f';
        var ids=[];
        records.forEach(function(x){ids.push(x.get('idvariable'))})

        if (ids.length != 0) {
            var concept = ids.length == 1 ? me.etiquetas.lbCompartimentacion : me.etiquetas.lbCompartimentacionPlural,
                concept = concept.toLowerCase(),
                msg = ids.length == 1 ? msg.getSingular(gen).get(concept) : msg.getPlural(gen).get(concept);

            Ext.Msg.show({
                title: this.etiquetas.titleConfirm,
                msg: msg,
                buttons: Ext.Msg.OKCANCEL,
                icon: Ext.MessageBox.QUESTION,
                scope: this,
                fn: function (btn) {
                    if (btn === 'ok') {
                        me.deleteElements(ids);
                    }
                }
            });
        }
    },

    deleteElements: function (ids) {
        console.log('delete:', ids)
        var me=this,
            concept = ids.length == 1 ? this.etiquetas.lbCompartimentacion : this.etiquetas.lbCompartimentacionPlural,
            concept = concept.toLowerCase(),
            msg = this.etiquetas.msgDelWait,
            gen = 'f',
            msg = ids.length == 1 ? msg.getSingular(gen).get(concept) : msg.getPlural(gen).get(concept),
            params = {
                ids: Ext.encode(ids),
                responseCfg: {
                    action: 'del',
                    gen: gen,
                    concept: concept,
                    count: ids.length
                }
            };

        Ext.MessageBox.show({
            title: this.etiquetas.lbTitleWait,
            msg: msg,
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });


       Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'eliminarVariable'}, this),
            params: params,
            scope: this,
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                me.getVariableForm().down('grid').getStore().reload();

            }
        });
    },

    WindowAdicionar:function(button){
        var me=this,
            grid=me.getVariableForm().down('grid'),
            win=Ext.create('ConfContratacion.view.WindowAddVariable',{
           title: (button.action=='adicionarvariable'?'Adicionar':'Modificar')+' variable'

        })
        win.show(null, function(){
            if(button.action=='modificarvariable') {
                var select = grid.getSelectionModel().getLastSelected();
                win.down('form').loadRecord(select);
            }
        });
    },

    guardarVariable: function(button){
        var me=this,
            conf=me.getWindowAddVariable().down('form').getValues();
        // Ext.MessageBox.show({
        //     title: this.etiquetas.lbTitleWait,
        //     msg: 'Guardando variable...',
        //     width: 300,
        //     wait: true,
        //     waitConfig: {interval: 200}
        // });

        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'guardarVariable'}, this),
            params: conf,
            // params: {
            //     data: Ext.encode(conf),
            // },
            success: function(response, opts) {
                // Ext.MessageBox.hide();
                var result = Ext.decode(response.responseText);
                if(result.success){
                    button.up('window').close();
                    me.getVariableForm().down('grid').getSelectionModel().deselectAll();
                    me.getVariableForm().down('grid').getStore().load();
                }
            },
            failure: function(response, opts) {
                // Ext.MessageBox.hide();
                console.log('server-side failure with status code ' + response.status);
            }
        });
    },

    onSelectionChange: function(sm, records){
        var me=this;
        me.getVariableForm().down('grid').down('#modificarvariable').setDisabled(records.length!=1);
        me.getVariableForm().down('grid').down('#eliminarvariable').setDisabled(records.length==0);
    }
});
