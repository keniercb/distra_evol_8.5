Ext.define('ConfContratacion.controller.ConfContratoContabilidad', {
    extend: 'CRM.core.controller.Base',

    refs: [
        {ref: 'mainForm', selector: 'confcontratocontabilidad'},
        {ref: 'mainWindow', selector: 'windowspace'}
    ],

    init: function () {
        var me = this;
        this.getLang();
        this.activeForm = 0;
        this.listen({
            component: {
                'confcontratocontabilidad':{
                    render:this.loadConf,
                    show: this.startTask,
                    hide: function () {
                        this.activeForm--;
                    }
                },
                'confcontratocontabilidad toggleslidefield': {
                    change: this.onChange
                },
                'confcontratocontabilidad button[action]': {
                    click: this.onClickAction
                }
            }
        });
    },

    onChange: function (toogleslide, newValue) {
        // console.info('aaaa', toogleslide.isDirty());
        this.getMainForm().btnSave.setDisabled(!toogleslide.isDirty());
    },

    onClear: function (field) {
        var form = this.getMainForm().getForm(),
            hidden = form.findField(field.localId);

        if (hidden) {
            hidden.setValue('');
        }
    },

    onSelectNode: function (sm, records) {
        var window = this.getMainWindow(),
            btn = window.btnAceptar;

        btn.setDisabled(records.length != 1);
    },

    onRender: function (tree) {
        tree.getRootNode().expand();
    },

    onClickAction: function (btn) {
        if (!btn.action) {
            return;
        }
        switch (btn.action) {
            case 'save':
                this.save();
                break;
            case 'cancel':
                this.cancel();
                break;
        }
    },
    showWindow: function () {
        Ext.create('ConfContratacion.view.WindowSpace',{
            context:'confcontrato'
        }).show();
    },

    selectWorkSpace: function () {
        var form = this.getMainForm(),
            window = this.getMainWindow(),
            field = form.sfspace,
            hidden = form.hdspace,
            record = window.tree.getSelectionModel().getSelection()[0];

        field.setValue(record.data.text);
        hidden.setValue(record.data.id);

        window.destroy();
    },

    save: function () {
        var msg = this.etiquetas.msgWait,
            gen = 'f',
            concept = 'planificaci&oacute;n',
            conf = this.getMainForm().getForm().getValues();

        Ext.MessageBox.show({
            title: this.etiquetas.lbTitleWait,
            msg: msg.getSingular(gen).get(concept),
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });

        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'saveConfContabilidad'}, this),
            params: {
                contractdoc: Ext.encode(conf),
                responseCfg: {
                    action: 'save',
                    gen: gen,
                    concept: concept,
                    count: 1
                }
            },
            scope: this,
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                this.loadConf();
            }
        });
    },

    cancel:function(){
        var form = this.getMainForm();
        this.loadConf(form);
    },

    loadConf: function (form) {
        var mask = new Ext.LoadMask(this.getMainForm(), {msg: this.etiquetas.msgLoading});
        mask.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'loadConfContratoContabilidad'}, this),
            scope: this,
            callback: function (options, success, response) {
                var response = Ext.decode(response.responseText);
                // if (response.contractdoc && response.contractdoc[0]) {
                if (response && response[0]) {
                    this.setConfiguration(response[0]);
                }
                // this.startTask(form);
                mask.hide();
            }
        });
    },

    setConfiguration: function (values) {
        var form = this.getMainForm().getForm();
        // console.log('values:', values['activo'])
        values['activo'] = values['activo'] == 1 ? 'true' : 'false';
        console.log('values:', values)
        form.setValues(values);
        console.log('config:', this.getConfiguration())
        this.getMainForm().btnSave.setDisabled(true);
    },

    getConfiguration: function () {
        var form = this.getMainForm().getForm(),
            values = form.getValues();

        return values;
    },

    startTask: function (form) {
        // console.info('startTask');
        var self=this;
        this.activeForm++;
        // form.on('validitychange', function(yo, valid){
        //     console.info('validitychange');
        //     self.checkForm(form);
        // })
        // Ext.TaskManager.start({
        //     run: this.checkForm.bind(this, form),
        //     interval: 100,
        //     scope: this
        // });
    },

    checkForm: function (form) {
        // console.info('check', this.activeForm, form.hasInvalidField(), form.isDirty());
        if (this.activeForm != 0) {
            var invalid = form.hasInvalidField() || !form.isDirty();
            form.btnSave.setDisabled(invalid);

        } else {
            return false;
        }
    }

});