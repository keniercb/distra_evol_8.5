Ext.define('ConfContratacion.controller.ConfPenalizaciones', {
    extend: 'CRM.core.controller.Base',
    refs: [
        {ref: 'mainForm', selector: 'confpenalizaciones'},
        {ref: 'mainWindow', selector: 'windowspace'}
    ],
    init: function () {
        var me = this;
        this.getLang();


        this.activeForm = 0;

        this.listen({
            component: {
                'confpenalizaciones': {
                    render: this.loadConf,
                    show: this.startTask,
                    hide: function () {
                        this.activeForm--;
                    }
                },
                'confpenalizaciones button[action=save]': {
                    click: this.saveConfiguracion
                },
                'confpenalizaciones toggleslidefield': {
                    change: this.onChange
                },
                'confpenalizaciones button[action=cancel]': {
                    click: this.cancelConfig
                },
                'confpenalizaciones selectfield': {
                    select: this.showWinSelectEspacioTrabajo,
                    clear: this.onClearValueEspacioTrabajo
                },
                'windowspace[context=confpenalidad] treepanel': {
                    selectionchange: this.onSelectNodeEspacioTrabajo,
                    afterrender: this.onRenderEspacioTrabajo
                },
                'windowspace[context=confpenalidad] button[action=acept]': {
                    click: this.selectEspacioTrabajo
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
        var me = this;
        Ext.Function.defer(function () {
            var mask = new Ext.LoadMask(this.getMainForm(), {msg: this.etiquetas.msgLoading});
            mask.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'loadconfpenalizaciones'}, this),
                scope: this,
                callback: function (options, success, response) {
                    var response = Ext.decode(response.responseText);

                    // me.loadStoreEstados(response.estados);

                    if (response.config && response.config['idconfpenalizacion']) {
                        var formG = this.getMainForm().getForm();
                        response.config['idestado'] = response.config['penalizacionlista'];
                        response.config['activo'] = response.config['activo'] == 1;
                        console.log(response.config);
                        formG.setValues(response.config);
                    }
                    this.startTask(form);
                    mask.hide();
                }
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
            url: UtilsFn.buildUrl({action: 'saveconfpenalizaciones'}, this),
            params: {
                penalizaciones: Ext.encode(conf),
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
    showWinSelectEspacioTrabajo: function () {
        Ext.create('ConfContratacion.view.WindowSpace', {
            context: 'confpenalizacion'
        }).show();
    },
    onClearValueEspacioTrabajo: function (field) {
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
