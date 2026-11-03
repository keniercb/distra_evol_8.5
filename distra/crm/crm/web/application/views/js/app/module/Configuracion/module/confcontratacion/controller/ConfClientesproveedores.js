Ext.define('ConfContratacion.controller.ConfClientesproveedores', {
    extend: 'CRM.core.controller.Base',
    refs: [
        {ref: 'mainForm', selector: 'confclientesproveedores'},
        {ref: 'mainWindow', selector: 'windowspace'}
    ],
    init: function () {
        var me = this;
        this.getLang();

        this.activeForm = 0;
        this.listen({
            component: {
                'confclientesproveedores':{
                    render:this.loadConf,
                    show: this.startTask,
                    hide: function () {
                        this.activeForm--;
                    }
                },
                'confclientesproveedores button[action=save]': {
                    click: this.saveConfiguracion
                },
                'confclientesproveedores toggleslidefield': {
                    change: this.onChange
                },
                'confclientesproveedores button[action=cancel]': {
                    click: this.cancelConfig
                },
               /* 'confclientesproveedores selectfield': {
                    select: this.showWinSelectEspacioTrabajo,
                    clear: this.onClearValueEspacioTrabajo
                },*/
              /*  'windowspace[context=confclientesproveedores] treepanel': {
                    selectionchange: this.onSelectNodeEspacioTrabajo,
                    afterrender: this.onRenderEspacioTrabajo
                },*/
             /*   'windowspace[context=confclientesproveedores] button[action=acept]': {
                    click: this.selectEspacioTrabajo
                },*/
            }
        });
    },
    onChange: function (toogleslide, newValue) {
        var query = Ext.ComponentQuery.query('panel[name=toggleslidefield]'),
          // console.log(query);
                       panel = query[0];
        // if (newValue == 'true') {
        //     panel.setDisabled(false);
        // } else {
        //     panel.setDisabled(true);
        // }
    },
    loadConf: function (form) {
        Ext.Function.defer(function(){
        var mask = new Ext.LoadMask(this.getMainForm(), {msg: this.etiquetas.msgLoading});
            mask.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'loadConfClientesproveedores'}, this),
                scope: this,
                callback: function (options, success, response) {
                    var response = Ext.decode(response.responseText);
                    if (response.config && response.config['idconfclientesproveedores']) {
                        var formG = this.getMainForm().getForm();
                        // response.config['activo']=response.config['activo']=="1";
                        var datos = response.config['config']?Ext.decode(response.config['config']):{};
                        datos['activo'] = response.config['activo']=="1";
                        formG.setValues(datos);
                    }
                    this.startTask(form);
                    mask.hide();
                }
               /* callback: function (options, success, response) {
                    var response = Ext.decode(response.responseText);

                    if(response.config && response.config['idconfsolicitud']){
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
            url: UtilsFn.buildUrl({action: 'saveConfClientesproveedores'}, this),
            params: {
                clientesproveedores: Ext.encode(conf),
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
        var formValues = this.getMainForm().getForm().getValues();
        console.log('formValues:', formValues)
        return {
            activo: formValues.activo=='true'?'true':'false',
            config: formValues
        }
    },
    cancelConfig: function () {
        this.loadConf(this.getMainForm());
    },
    showWinSelectEspacioTrabajo: function(){
        Ext.create('ConfContratacion.view.WindowSpace',{
            context:'confclientesproveedores'
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
});
