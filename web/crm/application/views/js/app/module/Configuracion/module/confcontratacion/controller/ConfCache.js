Ext.define('ConfContratacion.controller.ConfCache', {
    extend: 'CRM.core.controller.Base',

    refs: [
        {ref: 'mainForm', selector: 'confcache'},
    ],

    init: function () {
        var me = this;
        this.getLang();
        this.activeForm = 0;
        this.listen({
            component: {
                'confcache':{
                    render:this.loadConf,
                    // show: this.startTask,
                    hide: function () {
                        this.activeForm--;
                    }
                },
                'confcache button[action]': {
                    click: this.onClickAction
                }
            }
        });
    },

    onClickAction: function (btn) {
        if (!btn.action) {
            return;
        }
        switch (btn.action) {
            case 'limpiarcache':
                this.limpiarcache();
                break;
            case 'actualizar':
                this.actualizar();
                break;
        }
    },

    actualizar:function(){
        var form = this.getMainForm();
        this.loadConf(form);
    },

    limpiarcache: function(){
        var me=this;
        var mask = new Ext.LoadMask(this.getMainForm(), {msg: this.etiquetas.msgLoading});
        mask.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'limpiarTemporales'}),
            scope: this,
            callback: function (options, success, response) {
                mask.hide()
                var response = Ext.decode(response.responseText);
                // if (response.contractdoc && response.contractdoc[0]) {
                console.log('response:', response)
                me.loadConf();
                // if (response) {
                //     this.setConfiguration(response);
                // }
                // this.startTask(form);
                // mask.hide();
            }
        });
    },

    loadConf: function (form) {
        console.log('loadconf')
        var mask = new Ext.LoadMask(this.getMainForm(), {msg: this.etiquetas.msgLoading});
        mask.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getTamannoArchivosTemporales'}),
            scope: this,
            callback: function (options, success, response) {
                mask.hide();
                var response = Ext.decode(response.responseText);
                console.log('response:', response)
                if (response) {
                    this.setConfiguration(response);
                }
            }
        });
    },

    setConfiguration: function (values) {
        var form = this.getMainForm().getForm();
        // console.log('values:', values['activo'])
        // values['activo'] = values['activo'] == 1 ? 'true' : 'false';
        // console.log('values:', values)
        form.setValues(values);
        // console.log('config:', this.getConfiguration())
        // this.getMainForm().btnSave.setDisabled(true);
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