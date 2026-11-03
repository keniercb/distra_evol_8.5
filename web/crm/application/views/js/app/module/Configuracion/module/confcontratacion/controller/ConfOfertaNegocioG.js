Ext.define('ConfContratacion.controller.ConfOfertaNegocioG', {
    extend: 'CRM.core.controller.Base',
    refs: [
        {ref: 'mainForm', selector: 'confofertanegociog'},
        {ref: 'mainWindow', selector: 'windowspace'}
    ],
    init: function () {
        var me = this;
        this.getLang();

        this.activeForm = 0;

        this.listen({
            component: {
                'confofertanegociog':{
                    render:this.loadConf,
                    show: this.startTask,
                    hide: function () {
                        this.activeForm--;
                    }
                },
                'confofertanegociog toggleslidefield': {
                    change: this.onChange
                },
                'confofertanegociog button[action=save]': {
                    click: this.saveConfiguracion
                },
                'confofertanegociog button[action=cancel]': {
                    click: this.cancelConfig
                },
                'confofertanegociog selectfield': {
                    select: this.showWinSelectEspacioTrabajo,
                    clear: this.onClearValueEspacioTrabajo
                },
                'windowspace[context=confofertanegocio] treepanel': {
                    selectionchange: this.onSelectNodeEspacioTrabajo,
                    afterrender: this.onRenderEspacioTrabajo
                },
                'windowspace[context=confofertanegocio] button[action=acept]': {
                    click: this.selectEspacioTrabajo
                },
            }
        });
    },
    loadConf: function (form) {
        var me = this;
        setTimeout(function(){
           var mask = new Ext.LoadMask(form, {msg: me.etiquetas.msgLoading});
           mask.show();
                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'loadConfOfertaNegocio'}, me),
                    scope: me,
                    callback: function (options, success, response) {
                        var response = Ext.decode(response.responseText);

                        me.loadStoreEstados(response.estados, response.estadosoferta);

                        if(response.config && response.config['idconfoferta']){
                            var form = me.getMainForm().getForm();
                            response.config['idestado'] = response.config['idestadosolicitudinsertar'];
                            response.config['idestadooferta'] = response.config['idestadosolicitudofertainsertar'];
                            response.config['activo'] = response.config['activo'] == '1';
                            form.setValues( response.config );
                        }
                       
                        me.startTask(form);
                        mask.hide();
                    }
                });
       }, 100);
    },

    onChange: function (toogleslide, newValue) {
        var query = Ext.ComponentQuery.query('panel[name=confofertanegociog]'),
            panel = query[0];

        if (newValue == 'true') {
            panel.setDisabled(false);
        } else {
            panel.setDisabled(true);
        }
    },

    loadStoreEstados: function(estados, estadosoferta){
        var me = this,
            storeEstado = me.getMainForm().cbEstadoSolicitudInsert.getStore(),
            storeEstado2 = me.getMainForm().cbEstadoSolicitudOfertaInsert.getStore();

        storeEstado.removeAll();
        storeEstado2.removeAll();

        for(var i in estados){
            storeEstado.add({
                'idestado' : estados[i]['idestado'],
                'denominacion' : estados[i]['nombre']
            });
        }
        for(var i in estadosoferta){
            storeEstado2.add({
                'idestado' : estadosoferta[i]['idestado'],
                'denominacion' : estadosoferta[i]['nombre']
            });
        }
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
            url: UtilsFn.buildUrl({action: 'saveConfOfertaNegocio'}, this),
            params: {
                ofertanegocio: Ext.encode(conf),
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
