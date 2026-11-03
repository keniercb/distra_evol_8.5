Ext.define('ConfContratacion.controller.ConfComiteGeneral', {
    extend: 'CRM.core.controller.Base',

    refs: [
        {ref: 'mainPanel', selector: 'confcomitegeneral'},
        {ref: 'windowAdd', selector: 'windowaddcomite'},
    ],

    init: function () {
        var me = this;
        this.getLang();
        this.activeForm = 0;
        this.listen({
            // store: {
            //     '#stConfTransitions': {
            //         add: function (store, records) {
            //             store.fireEvent('change', store, records, 'add');
            //         },
            //         remove: function (store, record) {
            //             store.fireEvent('change', store, [record], 'remove');
            //         },
            //         change: this.onChangeTransition
            //     }
            // },
            component: {
                'confcomitegeneral button[action]': {
                    click: this.onClickAction
                },
                'confcomitegeneral': {

                    show: function(){
                        console.log('hahahahaha render')
                        this.activeForm++;
                    },
                    hide: function () {
                        console.log('hahahahaha hide')
                        this.activeForm--;
                    },
                    destroy: function () {
                        console.log('hahahahaha destroy')
                        this.activeForm--;
                    }
                },
                'windowaddcomite form':{
                    validitychange: this.changeForm
                },
                'windowaddcomite button[action]':{
                    click: this.onClickWindowAction
                },
                'windowaddcomite combobox[name=proceso]': {
                    select: this.selectComboMulti,
                    change: this.changeComboMulti
                },
                'confcomitegeneral gridpanel[itemId=gridcomitegeneral]':{
                    selectionchange: this.onSelectGrid,
                }
            }
        });
    },

    changeForm: function(form, valid){
        console.log('validity:', valid)
        var me=this, winAdd=me.getWindowAdd();
        // if (this.activeForm != 0) {
            winAdd.btnAceptar.setDisabled(!valid);
        // }else{
        //     return false;
        // }
    },

    onClickAction: function (btn) {
        console.log('kakakak', btn.action)
        if (!btn.action) {
            return;
        }
        switch (btn.action) {
            case 'add':
                this.addComite(btn);
                break;
            case 'edit':
                this.addComite(btn);
                break;
            case 'del':
                this.delComite(btn);
                break;
        }
    },

    onClickWindowAction: function (btn) {
        console.log('dfdfdfdf', btn.action)
        if (!btn.action) {
            return;
        }
        var me=this, winAdd=me.getWindowAdd();
        switch (btn.action) {
            case 'acept':
                this.saveComite(btn);
                break;
            case 'apply':
                this.saveComite(btn);
                break;
            case 'cancel':
                winAdd.close();
                break;
        }
    },

    onSelectGrid: function (sm, records) {
        var grid = sm.view.up('gridpanel'), panel=this.getMainPanel();
        // console.log('SELECT:', grid)
        // console.log('SELECT:', panel)
        panel.btnEdit.setDisabled(records.length!=1);
        panel.btnDel.setDisabled(records.length==0);

    },


    addComite: function (btn) {
        var me=this, win=Ext.create('ConfContratacion.view.WindowAddComite',{
            case: btn.action
        });
        win.show(null, function(){
            win.nombre.focus();
            if(btn.action=='edit'){
                var grid=me.getMainPanel().grid,
                    data=grid.getSelectionModel().getSelection()[0];
                console.log('DATA:', data)
                win.down('form').getForm().loadRecord(data);
                // if(data.get('idproceso')){
                //     win.hfprocesos.setValue(data.get('idproceso'));
                //     win.sfprocesos.setValue(data.get('idproceso'));
                //     // win.sfprocesos.setRawValue(data.get('proceso'));
                // }
            }
        })
    },

    delComite: function (btn) {
        var me =this,
            grid=me.getMainPanel().grid,
            selected=grid.getSelectionModel().getSelection(),
            idcomitegeneral=[];
        var msgEliminar=me.etiquetas.msgEliminarComites,
            msgEliminado=me.etiquetas.msgEliminadosComites;
        if(selected.length==1){
            msgEliminar=me.etiquetas.msgEliminarComite;
            msgEliminado=me.etiquetas.msgEliminadoComite;
        }
        var dialog = Ext.create('Ext.window.MessageBox', {
            buttonAlign: 'center',
            buttons: [
                {
                    text: 'Aceptar',
                    iconCls: 'aceptar',
                    handler: function () {

                        selected.forEach(function(x){
                            idcomitegeneral.push(x.get('idcomitegeneral'));
                        });

                        dialog.close();
                        Ext.MessageBox.show({
                            msg: me.etiquetas.msgEliminando,
                            // width: 300,
                            wait: true,
                            waitConfig: {interval: 200}
                        });
                        Ext.Ajax.request({
                            url: UtilsFn.buildUrl({action: 'eliminarComite'}, me),
                            params: {
                                idcomitegeneral: Ext.encode(idcomitegeneral)
                            },
                            success: function (response) {
                                Ext.MessageBox.hide();
                                var result = Ext.decode(response.responseText);
                                if(result.code==1){
                                    grid.getStore().load();
                                    mostrarMensaje(1, msgEliminado);
                                }
                            },
                            failure:function(response){
                                Ext.MessageBox.hide();
                            }
                        });
                    }
                },
                {
                    text: 'Cancelar',
                    iconCls: 'cancelar',
                    handler: function () {
                        dialog.close();
                    }
                }
            ]
        });
        dialog.show({
            title:me.etiquetas.lbConfirmacion,
            msg: msgEliminar,
            icon: Ext.MessageBox.QUESTION,
        });
    },

    saveComite: function(btn){
        var me = this,
            win = btn.up('window'),
            form = win.down('form').getForm(),
            grid=me.getMainPanel().grid;
        if (form.isValid()) {
            Ext.MessageBox.show({
                msg: me.etiquetas.lbGuardando,
                width: 300,
                wait: true,
                waitConfig: {interval: 200}
            });
            form.submit({
                url: UtilsFn.buildUrl({action: 'guardarComite'}, me),
                // params: form.getValues(),
                success: function (form, action) {
                    Ext.MessageBox.hide();
                    var response = Ext.decode(action.response.responseText);
                    grid.getStore().load();
                    mostrarMensaje(1, me.etiquetas.msgGuardado);
                    if(btn.action=='acept')
                        win.close();
                },
                failure: function (form, action) {
                    Ext.MessageBox.hide();
                }
            });
        } else {
            mostrarMensaje(1, 'no es valido');
        }
    },

    selectComboMulti: function (combo, records) {
        console.info('selectComboMulti:', records)
        var form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localIdMulti), valores = '';
        if (hiddenField) {
            // console.log('antes', hiddenField.getValue());
            // if(valores!='')valores+=',';
            records.forEach(function (x) {
                valores += x.get('idproceso') + ','
            });
            // console.info('selectComboMulti respuesta:', valores.substr(0, valores.length - 1))
            hiddenField.setValue(valores.substr(0, valores.length - 1));
        }
    },
    changeComboMulti: function (combo, value) {
        console.info('changeComboMulti:')
        var form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localIdMulti);
        if (hiddenField && Ext.isEmpty(value)) {
            hiddenField.setValue('');
        }
    },


});