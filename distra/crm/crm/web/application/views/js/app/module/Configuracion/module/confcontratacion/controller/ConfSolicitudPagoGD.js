Ext.define('ConfContratacion.controller.ConfSolicitudPagoGD', {
    extend: 'CRM.core.controller.Base',

    refs: [
        {ref: 'mainForm', selector: 'confsolicitudpagogd'},
        {ref: 'mainWindow', selector: 'windowspace'}
    ],

    init: function () {
        var me = this;
        this.getLang();
        this.activeForm = 0;
        this.listen({
            store: {
                '#stEspacios': {
                    beforeload: function () {
                        me.mask = new Ext.LoadMask(this.getMainWindow().tree, {msg: me.etiquetas.msgLoading});
                        me.mask.show();
                    },
                    load: function () {
                        me.mask.hide();
                    }
                }
            },
            component: {
                'confsolicitudpagogd':{
                    render:this.loadConf,
                    show: this.startTask,
                    hide: function () {
                        this.activeForm--;
                    }
                },
                'confsolicitudpagogd toggleslidefield': {
                    change: this.onChange
                },
                'confsolicitudpagogd selectfield': {
                    select: this.showWindow,
                    clear: this.onClear
                },
                'windowspace[context=confsolicitudpago] treepanel': {
                    selectionchange: this.onSelectNode,
                    afterrender: this.onRender
                },
                'windowspace[context=confsolicitudpago] button[action=acept]': {
                    click: this.selectWorkSpace
                },
                'confsolicitudpagogd button[action]': {
                    click: this.onClickAction
                }
            }
        });
    },

    onChange: function (toogleslide, newValue) {
        var query = Ext.ComponentQuery.query('panel[name=fpsolicitudpagospace]'),
            panel = query[0];

        if (newValue == 'true') {
            panel.setDisabled(false);
        } else {
            panel.setDisabled(true);
        }
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
            context:'confsolicitudpago'
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
            url: UtilsFn.buildUrl({action: 'saveConfSolicitudPago'}, this),
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
            url: UtilsFn.buildUrl({action: 'loadConfSolicitudPago'}, this),
            scope: this,
            callback: function (options, success, response) {
                var response = Ext.decode(response.responseText);
                if(response.length>0)
                    this.setConfiguration(response[0]);
                // if (response.contractdoc && response.contractdoc[0]) {
                //     this.setConfiguration(response.contractdoc[0]);
                // }
                this.startTask(form);
                mask.hide();
            }
        });
    },

    setConfiguration: function (values) {
        var form = this.getMainForm().getForm();
        values['activo'] = values['activo'] == '1';
        values['espaciotrabajo'] = values['denominacion'];
        // console.log('values',values)
        form.setValues(values);
    },

    getConfiguration: function () {
        var form = this.getMainForm().getForm(),
            values = form.getValues();

        return values;
    },

    startTask: function (form) {
        console.log('starttt')
        this.activeForm++;
        Ext.TaskManager.start({
            run: this.checkForm.bind(this, form),
            interval: 100,
            scope: this
        });
    },

    checkForm: function (form) {
        // console.log('checkForm:')
        if (this.activeForm != 0) {
            var invalid = form.hasInvalidField() || !form.isDirty();
            form.btnSave.setDisabled(invalid);

        } else {
            return false;
        }
    }

});