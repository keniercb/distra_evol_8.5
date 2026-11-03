Ext.define('ComiteImportacion.controller.Window', {
    extend: 'CRM.core.controller.Base',
    views: ['Main'],

    refs: [
        {ref: 'mainGrid', selector: 'co_comitemaingridimportacion'},
        {ref: 'rolWindow', selector: 'rolopinionwindowimportacion'},
        {ref: 'opinionsWindow', selector: 'opinionswindowimportacion'},
        {ref: 'detailsWindow', selector: 'detailswindowimportacion'},
    ],

    init: function () {
        var me = this;
        this.getLang();

        this.listen({
            component: {
                'rolopinionwindowimportacion': {
                    show: this.onShow
                },
                'rolopinionwindowimportacion button[action]': {
                    click: this.onClickAction
                },
                'opinionswindowimportacion': {
                    show: this.onShowOpinionsWindow
                },
                'opinionswindowimportacion gridpanel': {
                    selectionchange: this.onSelectRol
                },
                'opinionswindowimportacion button[action]': {
                    click: this.onClickAction
                },
                'detailswindowimportacion': {
                    show: this.onShowDetailsWindow
                },
                'detailswindowimportacion fileuploadfield,opinionswindowimportacion fileuploadfield ': {
                    seturl: function (field, url) {
                        var btn = field.up('window').btnShowFile;
                        btn.enable();
                        field.urlfile = url;

                    }
                },
                'detailswindowimportacion button[action=showfile]': {
                    click: function (field, url) {
                        var url = this.getDetailsWindow().fileupload.urlfile;
                        if (url) {
                             window.open('/crm/contratacion/index.php/gestioncontrato/getDocumentos?idnodo='+url);
                            //window.open(url);
                        }
                    }
                }
            }
        });
    },

    onClickAction: function (btn) {
        switch (btn.action) {
            case 'acept':
                this.save();
                break;
            case 'showfile':
                this.showFile(btn);
        }
    },

    onShow: function (window) {

        this.activeWindows++;

        Ext.TaskManager.start({
            run: this.checkWindow.bind(this, window.form),
            interval: 100,
            scope: this
        });

    },

    onShowOpinionsWindow: function (window) {
        window.stRol.load({
            params: window.params
        });
    },

    onShowDetailsWindow: function (window) {
        var me = this,
            record = this.getMainGrid().getSelectionModel().getLastSelected(),
            file = record.data.documentojson ? Ext.decode(record.data.documentojson) : new Array(),
            mask = new Ext.LoadMask(window.body, {msg: this.etiquetas.msgLoading});
        for (k in record.data) {
            var field = Ext.ComponentQuery.query('[name=' + k + ']')[0];
            if (field) {
                var value = record.data[k];
                if (field['setValue']) {
                    field.setValue(value);
                } else {
                    if (k == 'unidadtiempo') {
                        value = value == 2 ? me.etiquetas.lbUTYear : me.etiquetas.lbUTMonth;
                    }
                    field.setText(value);
                }
            }
        }
        window.prodPanel.getStore().load({
            params: {
                idcontrato: record.data.idcontrato
            }
        });
        window.hitosPanel.getStore().load({
            params: {
                idcontrato: record.data.idcontrato
            }
        });
        if (file.id) {
            mask.show();
            this.getFile(window, file, function () {
                mask.hide();
            });
        }
    },

    onSelectRol: function (sm, records) {
        var window = this.getOpinionsWindow(),
            data = window.data,
            editor = window.editor,
            fileupload = window.fileupload,
            record = records[0],
            file = record.raw.documento,
            data = {
                nombre: data.nombre,
                estado: record.data.nombreestado,
                icono: record.data.iconoestado,
                fecha: record.data.fecha
            };
        if (records.length == 1) {
            editor.setValue(record.data.observacion);
            if (file && file.url) {
                fileupload.setRawValue(file.name);
                fileupload.fireEvent('seturl', fileupload, file.url);
            }else{
                fileupload.setRawValue('');
            }
            window.template.overwrite(window.infoForm.body, data);
        } else {
            editor.setValue('');
            fileupload.setRawValue('');
            fileupload.urlfile = '';
            window.template.overwrite(window.infoForm.body, {});
        }
    },

    save: function () {
        var window = this.getRolWindow(),
            form = window.form.getForm(),
            msg = this.etiquetas.msgWait,
            gen = 'm',
            concept = this.etiquetas.lbOpinion.toLowerCase(),
            params = window.params;

        Ext.MessageBox.show({
            title: this.etiquetas.lbTitleWait,
            msg: msg.getSingular(gen).get(concept),
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });

        form.submit({
            url: this.buildUrl('guardarDictamen'),
            scope: this,
            params: params,
            success: function (form, action) {
                var response = Ext.decode(action.response.responseText);
                if (response.code == 1) {
                    mostrarMensaje(1, this.etiquetas.msgDictamenAdd);
                    window.destroy();
                }else if(response.identificadorNodoPadre == 0){
                    mostrarMensaje(1, this.etiquetas.msgErrorExisteDocumento);
                }
            }
        });
    },

    checkWindow: function (form) {
        if (this.activeWindows != 0) {
            var bForm = form.getForm(),
                window = form.up('window'),
                invalid = bForm.hasInvalidField(),
                change = bForm.isDirty();

            if (form.action == 'edit') {
                invalid = invalid || !change;
            }
            window.disableButtons(invalid);
        } else {
            return false;
        }
    },

    getFile: function (window, file, fn) {
        var me = this;
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'obtenerArchivo'}, this),
            params: {
                iddocument: file.id
            },
            callback: function (options, success, response) {
                var response = Ext.decode(response.responseText);
                if (response.url) {
                    window.fileupload.setRawValue(file.name);
                }
                window.fileupload.fireEvent('seturl', window.fileupload, response.url);
                if (fn && typeof fn == 'function') {
                    fn.call();
                }
            }
        });
    },

    showFile: function (btn) {
        var url = btn.up('window').fileupload.urlfile;
        if (url) {
window.open('/crm/contratacion/index.php/gestioncontrato/getDocumentos?idnodo='+url);

            //window.open(url);

        }

    }
});