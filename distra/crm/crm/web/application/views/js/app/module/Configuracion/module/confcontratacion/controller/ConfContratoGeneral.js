Ext.define('ConfContratacion.controller.ConfContratoGeneral', {
    extend: 'CRM.core.controller.Base',
    refs: [
        {ref: 'mainForm', selector: 'confcontratogeneral'}
    ],
    init: function () {
        var me = this;
        this.getLang();

        this.activeForm = 0;

        this.listen({
            component: {
                'confcontratogeneral':{
                    render:this.loadConf,
                    show: this.startTask,
                    // validitychange: me.checkForm,
                    hide: function () {
                        console.log('hide', this.activeForm)
                        this.activeForm=0;
                    }
                },
                
                'confcontratogeneral toggleslidefield[name=activo_correo]': {
                    change: this.onChange
                },
                'confcontratogeneral selectfield': {
                    select: this.showWindow,
                    clear: this.onClear
                },

                // 'windowspace[context=confcontrato] treepanel': {
                //     selectionchange: this.onSelectNode,
                //     afterrender: this.onRender
                // },
                // 'windowspace[context=confcontrato] button[action=acept]': {
                //     click: this.selectWorkSpace
                // },
                



                'confcontratogeneral button[action=save]': {
                    click: this.saveConfiguracion
                },
                'confcontratogeneral button[action=cancel]': {
                    click: this.cancelConfig
                },
                'confcontratogeneral selectfield': {
                    select: this.showWinSelectEspacioTrabajo,
                    clear: this.onClearValueEspacioTrabajo
                },
                // 'windowspace[context=confofertanegocio] treepanel': {
                //     selectionchange: this.onSelectNodeEspacioTrabajo,
                //     afterrender: this.onRenderEspacioTrabajo
                // },
                // 'windowspace[context=confofertanegocio] button[action=acept]': {
                //     click: this.selectEspacioTrabajo
                // }
            }
        });
    },

  
    onChange: function (toogleslide, newValue) {
        var query = Ext.ComponentQuery.query('panel[name=fpcorreo]'),
            panel = query[0];

        if (newValue == 'true') {
            panel.setDisabled(false);
        } else {
            panel.setDisabled(true);
        }
    },



    loadConf: function (form) {
        var me = this;
        setTimeout(function(){
            var mask = new Ext.LoadMask(form, {msg: me.etiquetas.msgLoading});
            mask.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'loadConfContratoGeneral'}, me),
                scope: me,
                callback: function (options, success, response) {
                    var response = Ext.decode(response.responseText);

                    me.loadStoreEstados(response.estados);                   
                   

                    if(response.config && response.config['idcontratogeneral']){
                        var form = me.getMainForm().getForm();
                        response.config['idestadooferta'] = response.config['idestadoofertalisto'];
                        response.config['activopersona'] = response.config['activopersona'] == '1'; 

                        var confcontratoR = Ext.decode(response.config['confgcontrato'])
                       
                        var confgmailR = Ext.decode(response.config['confgmail'])
                        response.config['confgmail'] = confgmailR;
                        me.getMainForm().down('#formemail').getForm().setValues(confgmailR);
                        Object.keys(confcontratoR).forEach((key)=>{
                            if(['false', 'true'].includes(confcontratoR[key])) {
                                confcontratoR[key] = confcontratoR[key] === 'true'
                            }
                        })
                        form.setValues(response.config);
                        form.setValues(confcontratoR);
                    }

                    

                    me.startTask();
                    mask.hide();
                }
            });
       }, 100);
    },

    loadStoreEstados: function(estados){
        var me = this,
            storeEstado = me.getMainForm().cbEstadoOfertaInsert.getStore();
        
        storeEstado.removeAll();

        for(var i in estados){
            storeEstado.add({
                'idestado' : estados[i]['idestado'],
                'denominacion' : estados[i]['nombre'],
                
            });
        }
    },

    


    startTask: function () {
        var me=this, form=me.getMainForm();
        this.activeForm=1;
        Ext.TaskManager.start({
            run: this.checkForm.bind(this, form),
            interval: 100,
            scope: this
        });
    },
    checkForm: function (form) {
        if (this.activeForm != 0) {
            var invalid = form.hasInvalidField() || !form.isDirty();
            // console.log('checkForm', this.activeForm, invalid, form.hasInvalidField(), !form.isDirty(), form.btnSave);
            form.btnSave.setDisabled(invalid);

        } else {
            return false;
        }
    },
   /* setConfiguration: function (values) {
        var form = this.getMainForm().getForm();
        values['activo'] = values['activo'] == '1';
        values['espaciotrabajo'] = values['denominacion'];
        // console.log('values',values)
        form.setValues(values);
    },*/
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
            url: UtilsFn.buildUrl({action: 'saveConfContratoGeneral'}, this),
            params: {
                confcontrato: Ext.encode(conf),
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
        var values=this.getMainForm().getForm().getValues();
        
        copy={...values};
        delete copy['idcontratogeneral'];        
        delete copy['activopersona'];
        delete copy['idestadooferta']; 
        delete copy['active_mail'];             
        values['confgcontrato']=copy;  
        values['confgmail']=this.getMainForm().down('#formemail').getForm().getValues();
        values['confgjasper'] = values['datasource'];
        return values;
    },
    cancelConfig: function () {
        this.loadConf(this.getMainForm());
    },
    showWinSelectEspacioTrabajo: function(){
        Ext.create('ConfContratacion.view.WindowSpace',{
            context:'confofertanegocio'
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
