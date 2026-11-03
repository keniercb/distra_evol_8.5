Ext.define('ConfContratacion.controller.ConfPliegoIndicadores', {
    extend: 'CRM.core.controller.Base',

    refs: [
        {ref: 'Main', selector: 'confpliegoindicadores'},
        {ref: 'Window', selector: 'windowindicadorpliego'},
    ],

    init: function () {
        var me = this;
        console.log('Controller ConfPliegoIndicadores')
        this.getLang();
        this.activeForm = 0;
        this.listen({
            store: {
                '#storepliegoindicadores': {
                    // metachange: me.metaDataChange,
                    datachanged: me.dataChanged,
                    load: function(){console.log('load')}
                },
                '#storecolumnsgrid': {
                    datachanged: me.dataChangedGridVariables
                },
                '#storegridvariables': {
                    load: me.loadNewData
                }
            },
            component: {
                'confpliegoindicadores button[action]': {
                    click: this.onClickAction
                },
                'confpliegoindicadores': {

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
                'windowindicadorpliego form':{
                    validitychange: this.changeForm,
                    dirtychange: this.changeForm,
                },
                'windowindicadorpliego button[action]':{
                    click: this.onClickWindowAction
                },
                'windowindicadorpliego checkbox[itemId=calcularrelevancia]':{
                    change: this.changeCheckboxRelevancia
                },
                'windowindicadorpliego combobox[itemId=tipografica]':{
                    select: this.selectTipoGrafica,
                    change: this.changeTipoGrafica
                },
                'windowindicadorpliego fieldset[itemId=configgrafica]': {
                    beforecollapse: this.beforecollapsegrafica,
                    beforeexpand: this.beforeexpandgrafica
                },
                'windowindicadorpliego fieldset[itemId=configgrid]': {
                    beforecollapse: this.beforecollapsegrid,
                    beforeexpand: this.beforeexpandgrid
                },
                'windowindicadorpliego combovariables': {
                    select: this.selectComboVariables,
                },
            }
        });
    },
    metaDataChange: function(store, meta){
        var me=this,
            grid=me.getMain().down('grid'),
            store=grid.getStore(),
            columns=grid.columns,
            fields=store.model.getFields(),
            newcolumns=[columns[0].initialConfig];
        console.log('meta', meta)
        Ext.Object.each(meta['columnas'], function(key, value){
            fields.push({name: key, type: 'boolean'})
            newcolumns.push({
                xtype: 'checkcolumn', text: value, dataIndex: key
            })
        })
        console.log('columns',newcolumns)
        console.log(fields)
        store.model.setFields(fields);
        me.getMain().down('grid').reconfigure(null, newcolumns);
    },

    dataChanged: function(store){
        var me=this,
            main=me.getMain();
        main.btnSave.setDisabled(false);
        console.log('datchanged', store)
        console.log('datchanged', store.modified)
        console.log('datchanged', store.model)
    },

    dataChangedGridVariables: function(store) {
        var me = this,
            win = me.getWindow();
        // console.log('gridcolumnas:'+store.getCount())
        // console.log('gridcolumnas:',win,'  ', win.down('#validogridvariables')  )
        if(win && win.down('#validogridvariables')) {
            win.down('#validogridvariables').setValue(store.getCount() > 0 ? 'valido' : '');
            // console.log(win.down('#validogridvariables').getValue())
            win.down('form').fireEvent('validitychange', win.down('form'));
        }
    },

    loadNewData: function(store){
        console.log('loadNewData:', store)
        var me=this, win=me.getWindow();
        setTimeout(function(){
            store.remove(win.down('#columnsgrid').getStore().getRange());
        }, 500)

    },

    changeForm: function(form){
        var me=this, win=me.getWindow(),
            valid=!form.hasInvalidField(),
            dirty=form.isDirty();
        console.log('validity:', valid, dirty)
        win.btnAceptar.setDisabled(!valid || !dirty)
    },

    beforecollapsegrafica: function(yo){
        var me=this, win=yo.up('window');
        win.down('#tipografica').setDisabled(true);
        console.log(yo.query('fieldset'))
        yo.query('fieldset').forEach(function(x){
            console.log('fieldset', x)
            x.setDisabled(true);
        })
        setTimeout(function(){
            win.down('form').fireEvent('validitychange', win.down('form'));
        }, 500)
        return false;
    },

    beforeexpandgrafica: function(yo){
        var me=this, win=yo.up('window');
        win.down('#tipografica').setDisabled(false);
        console.log(yo.query('fieldset'))
        yo.query('fieldset[hidden=false]').forEach(function(x){
            console.log('fieldset hidden', x)
            x.setDisabled(false);
        })
        setTimeout(function(){
            win.down('form').fireEvent('validitychange', win.down('form'));
        }, 500)
        return false;
    },

    beforecollapsegrid: function(yo){
        var me=this, win=yo.up('window');
        win.down('#gridvariables').setDisabled(true);
        win.down('#columnsgrid').setDisabled(true);
        win.down('#validogridvariables').setDisabled(true);
        win.down('form').fireEvent('validitychange', win.down('form'));
        // me.down('form').fireEvent()
        return false;
    },

    beforeexpandgrid: function(yo){
        var me=this, win=yo.up('window');
        win.down('#gridvariables').setDisabled(false);
        win.down('#columnsgrid').setDisabled(false);
        win.down('#validogridvariables').setDisabled(false);
        win.down('form').fireEvent('validitychange', win.down('form'));
        return false;
    },

    onClickAction: function (btn) {
        console.log('kakakak', btn.action)
        if (!btn.action) {
            return;
        }
        switch (btn.action) {
            case 'add':
                this.addIndicador(btn);
                break;
            case 'edit':
                this.addIndicador(btn);
                break;
            case 'del':
                this.delIndicador(btn);
                break;
        }
    },

    onClickWindowAction: function (btn) {
        console.log('dfdfdfdf', btn.action)
        if (!btn.action) {
            return;
        }
        var me=this;
        switch (btn.action) {
            case 'acept':
                this.saveIndicadorPliego(btn);
                break;
            case 'apply':
                this.saveIndicadorPliego(btn);
                break;
            case 'cancel':
                btn.up('window').close();
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

    addIndicador: function (btn) {
        var me=this, win=Ext.create('ConfContratacion.view.WindowIndicadorPliego',{
            title: (btn.action=='add'?'Adicionar':'Modificar')+' indicador',
            minWidth: 500, maxWidth: 1000, width: window.innerWidth*0.8,
            // minHeight: 300, maxHeight: 2000,// height: window.innerHeight*0.9,
            case: btn.action
        });
        win.show(null, function(){
            if(btn.action=='edit'){
                var grid=me.getMain().down('grid'),
                    data=grid.getSelectionModel().getSelection()[0];
                console.log('DATA:', data)

                var configgrafica=me.loadConfigGrafica(Ext.decode(data.get('configgrafica')));
                Ext.Object.each(configgrafica, function(key, value){
                    data.set(key, value);
                })
                // var configgrid=me.loadConfigGrid(Ext.decode(data.get('configgrid')));
                var configgrid=Ext.decode(data.get('configgrid'));
                win.down('#columnsgrid').getStore().loadData(configgrid['columns']);
                // win.down('#columnsgrid').getStore().fireEvent('loadNewData', win.down('#columnsgrid').getStore());
                console.log(data)
                console.log(configgrafica)
                console.log(configgrid, configgrid['columns'])

                win.down('form').getForm().loadRecord(data);
                win.down('#tipografica').fireEvent('select', win.down('#tipografica'));
            }
        })
    },

    delIndicador: function (btn) {
        var me =this,
            grid=me.getMain().down('grid'),
            selected=grid.getSelectionModel().getSelection(),
            idindicadorespliego=[];
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
                            idindicadorespliego.push(x.get('idindicadorpliego'));
                        });

                        dialog.close();
                        Ext.MessageBox.show({
                            msg: 'Eliminando...',
                            // width: 300,
                            wait: true,
                            waitConfig: {interval: 200}
                        });
                        Ext.Ajax.request({
                            url: UtilsFn.buildUrl({action: 'eliminarIndicadoresPliego'}, me),
                            params: {
                                idindicadorespliego: Ext.encode(idindicadorespliego)
                            },
                            success: function (response) {
                                Ext.MessageBox.hide();
                                var result = Ext.decode(response.responseText);
                                if(result.success){
                                    grid.getStore().load();
                                    mostrarMensaje(1, (selected.length>1?
                                        'Los indicadores han sido eliminados satisfactoriamente.':
                                        'El indicador ha sido eliminado satisfactoriamente.'));
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
            msg: (selected.length>1?
                '¿Está seguro que desea eliminar los indicadores seleccionados?':
                '¿Está seguro que desea eliminar el indicador seleccionado?'),
            icon: Ext.MessageBox.QUESTION,
        });
    },

    saveIndicadorPliego: function(btn){
        var me = this,
            win = btn.up('window'),
            form = win.down('form').getForm();
        if (form.isValid()) {
            var values = form.getValues(),
                grid=me.getMain().down('grid'),
                configgrid=me.getConfigGrid(win),
                configgrafica=me.getConfigGrafica(win);
            Ext.MessageBox.show({
                msg: 'Guardando indicador...',
                width: 300,
                wait: true,
                waitConfig: {interval: 200}
            });
            console.log('values:', values)
            console.log('configgrafica:', configgrafica)
            console.log('configgrid:', configgrid)
            // form.submit({
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'guardarIndicadoresPliego'}, me),
                params: {
                    values: Ext.encode(values),
                    configgrid: Ext.encode(configgrid),
                    configgrafica: Ext.encode(configgrafica)
                },
                success: function (response) {
                    Ext.MessageBox.hide();
                    var response = Ext.decode(response.responseText);
                    if(response.success){
                        grid.getStore().load();
                        mostrarMensaje(1, 'El indicador ha sido guardado satisfactoriamente.');
                        if(btn.action=='acept')
                            win.close();
                    }

                },
                failure: function (form, action) {
                    Ext.MessageBox.hide();
                }
            });
        } else {
            mostrarMensaje(7, 'El formulario no es valido.');
        }
    },

    loadConfigGrid: function(datos) {
        var me = this, result={};

    },

    getConfigGrid: function(win){
        var me=this, columns=[],
            values=win.down('form').getForm().getValues();
        win.down('#columnsgrid').getStore().getRange().forEach(function(x){
            columns.push(x.data);
        })
        return {'activo': values['mostrargrid']=='on', 'columns': columns};
    },

    loadConfigGrafica: function(datos) {
        var me = this,
            win=me.getWindow(),
            categoria=[],
            valor=[],
            result={};
        console.log(datos)
        if(datos && datos['tipografica']) {
            result['categoria_' + datos['tipografica'] + '_title'] = datos['categoria_' + datos['tipografica'] + '_title'];
            result['valor_' + datos['tipografica'] + '_title'] = datos['valor_' + datos['tipografica'] + '_title'];

            datos['categoria_' + datos['tipografica']].forEach(function (x) {
                categoria.push(x['id']);
            });
            datos['valor_' + datos['tipografica']].forEach(function (x) {
                valor.push(x['id']);
            });
            if (win.down('#categoria_'+datos['tipografica']) && win.down('#categoria_'+datos['tipografica']).multiSelect==false) {
                categoria = categoria.length > 0 ? categoria[0] : null;
            }
            if (win.down('#valor_'+datos['tipografica']) && win.down('#valor_'+datos['tipografica']).multiSelect==false) {
                valor = valor.length > 0 ? valor[0] : null;
            }
            result['categoria_' + datos['tipografica']] = categoria;
            result['valor_' + datos['tipografica']] = valor;
        }
        return result;
    },

    getConfigGrafica: function(win){
        var me=this,
            tipo=win.down('#tipografica').getValue(),
            fieldset=win.down('#configgrafica_'+tipo),
            values=win.down('form').getForm().getValues(),
            result= {'activo': values['mostrargrafica']=='on'};
        if(tipo) {
            result['tipografica']= tipo;
            if(win.down('#categoria_'+tipo+'_title'))
                result['categoria_'+tipo+'_title'] = win.down('#categoria_'+tipo+'_title').getValue();
            if(win.down('#valor_'+tipo+'_title'))
                result['valor_'+tipo+'_title'] = win.down('#valor_'+tipo+'_title').getValue();
            if (fieldset) {
                fieldset.query('combovariables').forEach(function (x) {
                    if (x.name) {
                        var datos=[];
                        if(typeof x.getValue()=='string'){
                            var record = x.getStore().findRecord('id', x.getValue(), 0, false, true, true);
                            if (record)
                                datos.push(record.data);
                            result[x.name] = datos;
                        }else {
                            x.getValue().forEach(function (y) {
                                var record = x.getStore().findRecord('id', y, 0, false, true, true);
                                if (record)
                                    datos.push(record.data);
                            })
                            result[x.name] = datos;
                        }
                    }
                })
            }
        }
        return result;
    },
    changeCheckboxRelevancia: function(yo, value){
        var me=this,
            win=me.getWindow();
        console.log(value, yo.getValue())
        win.down('#atributo_title').setDisabled(!value)
        win.down('form').fireEvent('validitychange', win.down('form'));
    },
    selectTipoGrafica: function(yo){
        var me=this,
            win=me.getWindow();
        win.down('#configgrafica').query('fieldset').forEach(function(x){
            x.setDisabled(true);
            x.setVisible(false);
        })
        if(yo.getValue() && win.down('#configgrafica_'+yo.getValue())) {
            win.down('#configgrafica_' + yo.getValue()).setDisabled(false);
            win.down('#configgrafica_' + yo.getValue()).setVisible(true);
        }
    },
    changeTipoGrafica: function(yo){
        var me=this,
            win=me.getWindow();
        if(!yo.getValue())
            win.down('#configgrafica').query('fieldset').forEach(function(x){
                x.setDisabled(true);
                x.setVisible(false);
            })
    },
    selectComboVariables: function(yo, records) {
        var me = this,
            win = me.getWindow();
        console.log('selectComboVariables:', win.down('#'+yo.name+'_title'))
        if(yo.getValue() && win.down('#'+yo.name+'_title')){
            win.down('#'+yo.name+'_title').setValue(records[0].get('nombrecolumna'));
        }
    }


});