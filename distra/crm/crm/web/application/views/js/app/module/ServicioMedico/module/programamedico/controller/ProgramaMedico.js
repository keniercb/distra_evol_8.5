Ext.define('ProgramaMedico.controller.ProgramaMedico', {
    extend: 'CRM.core.controller.Base',
    views: [],
    refs: [
        {ref: 'Main', selector: 'programamedicoprincipal'},
        {ref: 'Window', selector: 'windowprogramamedico'},
        {ref: 'WindowServicio', selector: 'windowservicioprogramamedico'},
    ],
    requires: [
    ],
    init: function () {
        var me = this;

        me.getLang();

        this.etiquetas = LangMgr.getLang(this);

        me.listen({
            component: {
                "programamedicoprincipal":{
                    render: this.onRenderPrincipal,
                    afterrender: this.grantActions,
                    selectionchange: this.selectProgramaMedico
                },
                "programamedicoprincipal button[action], programamedicoprincipal menuitem[action], menu[itemId=contextMenuProgramaMedico] menuitem[action]": {
                    click: this.onClickButtonAction,
                },
                "windowprogramamedico":{
                    render: this.renderWindow,
                },
                "windowprogramamedico button[action]":{
                    click: this.onClickWindowButtonAction,
                },
                'windowprogramamedico combobox[localId], windowprogramamedico pickerfield[localId]': {
                    select: this.onSelectCmbSelectField,
                    // blur: this.onBlurCmbSelectField,
                    reset: this.onResetCmbSelect
                },
                "windowservicioprogramamedico gridpanel":{
                    selectionchange: this.selectServicio,
                },
                "windowservicioprogramamedico button[action]":{
                    click: this.onClickWindowServicioButtonAction,
                },
                'windowservicioprogramamedico searchfield': {
                    search: this.onSearch,
                    clear: this.onClear
                },
                'windowservicioprogramamedico combo[name=tipoprecio]': {
                    change: this.onChangeTipoPrecio
                },
                'windowprogramamedico combobox[name=paciente]': {
                    select: this.selectPaciente,
                    // change: this.changePaciente,
                },
            }
        })
    },
    grantActions: function (grid) {
        this.validateGrantedActions({container: grid});
    },

    onRenderPrincipal: function (main) {
        var me = this;
        var mask = new Ext.LoadMask(
            main, {msg: 'Cargando configuración...'});
        mask.show();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getConfiguracion'}, me),
            callback: function (options, success, response) {
                mask.hide();
                if(success) {
                    var info = Ext.decode(response.responseText);
                    me.application.monedas_entidad = info.config.monedas_entidad;
                    main.monedas_entidad = info.config.monedas_entidad;
                    main.estados_programamedico = info.config.estados_programamedico;
                    var fields=main.getStore().model.getFields();
                    Ext.each(me.application.monedas_entidad, function (field, index) {
                        fields.push({name: 'montomoneda_' + field.codigoiso.toLowerCase() + '_' + field.idmoneda, type: 'float', defaultValue: 0});
                    })
                    main.getStore().model.setFields(fields);
                }
            }
        })
    },

    renderWindow: function (win) {
        var me = this;
        if(me.application.monedas_entidad){
            win.monedas_entidad=me.application.monedas_entidad;
            var gridservicios=win.down('#gridservicios'),
                store=gridservicios.getStore(),
                fields = store.model.getFields(),
                columns=gridservicios.columns,
                newcolumns=[],
                pos=-1;
            Ext.each(columns, function (column, index) {
                if (column.dataIndex == 'descuento')pos = index;
                newcolumns.push(column.initialConfig);
            });

            Ext.each(me.application.monedas_entidad, function (field, index) {
                // fields.push('montomoneda_' + field.codigoiso.toLowerCase() + '_' + field.idmoneda);
                fields.push({name: 'montomoneda_' + field.codigoiso.toLowerCase() + '_' + field.idmoneda, type: 'float', defaultValue: 0});
                win.down('#tabCobro').insert(0, me.newCampoMoneda(field, me.application.monedas_entidad.length));
                if (pos != -1) {
                    newcolumns = me.newColumnaMoneda(newcolumns, field, pos); pos++;
                }
            });
            if (pos != -1)gridservicios.reconfigure(null, newcolumns);
            store.model.setFields(fields);
        }
        console.log('newcolumns:', newcolumns)
        console.log('fields:', store.model.getFields())
        // win.btnAceptar.setDisabled(false);
        win.down('customform').on('validitychange', function(yo){
            console.log('validitychange')
            me.checkWindow(win);
        });
        win.down('customform').on('dirtychange', function(yo){
            console.log('dirtychange')
            me.checkWindow(win);
        });
    },

    checkWindow: function(win){
        var form=win.down('customform').getForm(),
            invalid=form.hasInvalidField(),
            dirty=form.isDirty();
        console.log('check:', invalid, dirty, invalid || !dirty)
        win.btnAceptar.setDisabled(invalid|| !dirty);
        win.btnAplicar.setDisabled(invalid || !dirty);
    },

    newCampoMoneda: function (field, total) {
        return Ext.create('Ext.ux.MoneyField', {
            fieldLabel: field.codigoiso.toUpperCase(),
            itemId: 'montomoneda_' + field.codigoiso.toLowerCase(),
            name: 'montomoneda_' + field.codigoiso.toLowerCase() + '_' + field.idmoneda,
            columnWidth: 1/total
        });
    },

    newColumnaMoneda: function (newcolumns, field, pos) {
        newcolumns.splice(pos, 0, {
            dataIndex: 'montomoneda_' + field.codigoiso.toLowerCase() + '_' + field.idmoneda,
            text: field.codigoiso.toUpperCase(),
            width: 80,
            align: 'right',
            filter: {
                type: 'numeric'
            },
            editor:
                Ext.create('Ext.ux.MoneyField',{
                    allowBlank: false,
                    minValue: 0,
                    decimalPrecision: 2,
                    maxLength: 19,
                    decimalSeparator: ',',
                    allowDecimals: true,
                    allowExponential: false,
                }),
            renderer: function (value, meta, record) {
                if (Ext.isEmpty(value))
                    value = 0;
                value = Ext.util.Format.number(value, '0.000,00/i');
                meta.tdAttr = 'data-qtip="' + value  + '"';
                return value;
            },
            // summaryType: function (records, dataindex, b) {
            //     var total = 0;
            //     records.forEach(function (x) {
            //         if (x.get(dataindex))
            //             total += parseFloat(x.get(dataindex));
            //     });
            //     return total;
            // }
        });
        return newcolumns;
    },

    onClickButtonAction: function(item){
        var me = this;
        console.log('ONCLICK:', item.action)
        switch (item.action) {
            case 'addprogramamedico':
                me.showWindowProgramaMedico(item);
                break;
            case 'modprogramamedico':
                me.showWindowProgramaMedico(item);
                break;
            case 'elimprogramamedico':
                me.deleteWindowProgramaMedico(item);
                break;
            case 'exportarprogramamedico':
                me.exportarProgramaMedico(item);
                break;
            case 'facturarprogramamedico':
                me.facturarProgramaMedico(item);
                break;
        }
    },
    onClickWindowButtonAction: function(item){
        var me = this;
        console.log('ONCLICKWINDOW:', item.action)
        switch (item.action) {
            case 'addwindowservicio':
                me.addWindowServicio(item);
                break;
            case 'deleteservicio':
                me.deleteServicio(item);
                break;
            case 'aplicardescuento':
                break;
            case 'acept':
                me.guardarProgramaMedico(item);
                break;
        }
    },
    onClickWindowServicioButtonAction: function(item){
        var me = this;
        console.log('ONCLICK:', item.action)
        switch (item.action) {
            case 'acept':
                me.seleccionarServicios(item);
                break;
            case 'apply':
                me.seleccionarServicios(item);
                break;
        }
    },

    selectProgramaMedico: function(sm, records){
        var me=this, main=me.getMain();
        main.down('#modprogramamedico').setDisabled(records.length!=1);
        main.down('#elimprogramamedico').setDisabled(records.length==0);
        main.down('#exportarprogramamedico').setDisabled(records.length!=1);
        var estados=me.updateEstadosMenu();
        // console.log('readyfact:', this.isActionAccess('readyfact', records, main))
        main.down('#facturarprogramamedico').setDisabled(!this.isActionAccess('readyfact', records, main));

        //readyfact
        main.down('#cambiarestadoprogramamedico').setDisabled(estados==0 ||
            !((this.isActionAccess('readyfact', records, main) &&
                records.every((x)=>x.get('completofacturado'))) || !this.isActionAccess('readyfact', records, main)) );
        // console.log(
        //     estados==0 ||
        //     !((this.isActionAccess('readyfact', records, main) &&
        //         records.every((x)=>x.get('completofacturado'))) || !this.isActionAccess('readyfact', records, main)),
        //     estados==0,
        //     !((this.isActionAccess('readyfact', records, main) &&
        //     records.every((x)=>x.get('completofacturado'))) || !this.isActionAccess('readyfact', records, main)),
        //     (this.isActionAccess('readyfact', records, main) &&
        //         records.every((x)=>x.get('completofacturado'))),
        //     !this.isActionAccess('readyfact', records, main),
        //     this.isActionAccess('readyfact', records, main),
        //     records.every((x)=>x.get('completofacturado')),
        //     estados
        //     )
        // if(records.length>0){
        //     var todos = records.every((x)=>(!this.isActionAccess('readyfact', x, main))||
        //         (this.isActionAccess('readyfact', x, main) && x.get('completofacturado')));
        //     main.down('#cambiarestadoprogramamedico').setDisabled(todos);
        // }
    },
    isActionAccess: function(action, select, grid){
        var me = this, result = true;
        if (Ext.isEmpty(select))
            return false;
        select.forEach(function (x) {
//             console.log(x)
            var estados=grid.estados_programamedico;
            var estadoConfig = estados[x.get('idestado')];
            if (estadoConfig && estadoConfig.acciones.indexOf(action) == -1) {
                result = false;
                return false;
            }
        });
        return result;
    },
    updateEstadosMenu: function(){
        var me=this, main=me.getMain(),
            selected=main.getSelectionModel().getSelection(),
            menu=main.down('#cambiarestadoprogramamedico').menu;
        menu.removeAll();
        if(selected.length==1){
            var estados = this.getNextStates(selected[0], main);
            Ext.each(estados, function (estado) {
                if (this.checkTransition(selected[0].get('idestado'), estado.idestado)) {
                    menu.add({
                        text: estado.nombre,
                        idestado: estado.idestado,
                        idtransicion: estado.idtransicion,
                        notificar: estado.notificar,
                        iconCls: estado.icono,
                        handler: me.onChangeEstado,
                        actions: estado.acciones,
                        scope: me
                    });
                }
            }, this);
        }
        return menu.items.getCount();
    },
    getNextStates: function (record, grid) {
        var me = this,
            estados = [];

        if (!record || !record.data.idestado) {
            return;
        }
        var datos = grid.estados_programamedico;
        if (datos[record.data.idestado]) {
            var transiciones = datos[record.data.idestado]['transiciones'];
            Ext.each(transiciones, function (transicion) {
                var aux = datos[transicion['idestado']];
                aux['notificar'] = transicion['notificar'];
                aux['idtransicion']=transicion['idtransicion'];
                estados.push(aux);
            });
        }
        return estados;
    },

    checkTransition: function (idestadoinicial, idestadofinal) {
        var exist = false,
            comite = this.application.comite,
            activo = this.application.crm.activeModules.Comite;
        if (activo == "true" && comite && comite.transitions) {
            for (k in comite.transitions) {
                var transition = comite.transitions[k];
                if (transition.idestadoinicial == idestadoinicial && transition.idestadofinal == idestadofinal &&
                    (transition.aliasproceso == 'ofertanegocio' || transition.aliasproceso == 'ofertanegocioproveedor')) {
                    exist = true;
                }
            }
        }
        if (!exist) {
            return true;
        }
        return false;
    },
    onChangeEstado: function (btn) {
        var me = this,
            sm = me.getMain().getSelectionModel(),
            values = {
                idprogramamedico: sm.getSelection()[0].get('idprogramamedico'),
                idestado: btn.idestado,
                idtransicion: btn.idtransicion,
            };

        mostrarMensaje(2, '¿Está seguro que desea cambiar el estado el programa médico?', function (response) {
            if (response === 'ok') {
                Ext.MessageBox.show({
                    msg: 'Cambiando estado...',
                    title: 'Espere',
                    width: 300,
                    wait: true,
                    waitConfig: {interval: 200}
                });

                Ext.Ajax.request({
                    url: UtilsFn.buildUrl({action: 'cambiarEstadoProgramaMedico'}, me),
                    params: values,
                    callback: function (options, success, response) {
                        Ext.MessageBox.hide();
                        var info = Ext.decode(response.responseText);
                        if (info.success) {
                            mostrarMensaje(1, info.datos.nuevoestado?'El programa médico ha cambiado de estado satrisfactoriamente.':
                                'Usted ha hecho su voto al cambio de estado. <br>Se han realizado '+
                                info.datos.obligatoriosefectuados+' de '+info.datos.cantidadrolesobligatorios+' votos obligatorios.');
                            if(info.datos.nuevoestado) {
                                me.getMain().getStore().load();
                                if (btn.notificar == 1) {
                                    // values['modelName'] = 'OfertaNegocioEstadoDService';
                                    me.enviarCorreo(values);
                                }
                            }
                        }
                        else
                            mostrarMensaje(6, info.message);

                    },
                    scope: me
                });
            }
        });
    },

    showWindowProgramaMedico: function(item){
        var me=this,
            win=Ext.create('ProgramaMedico.view.WindowProgramaMedico',{
                title: (item.action=='addprogramamedico'?'Adicionar':'Modificar') +' programa médico',
                action: item.action=='addprogramamedico'?'add':'mod'
            });
        win.show(null, function(){
            // win.down('customform').query().forEach(function(x){
            //     // if(Ext.isFunction(x.setReadOnly))x.setReadOnly(true);
            //     if(Ext.isFunction(x.setEditable))x.setEditable(true);
            //     if(Ext.isFunction(x.allowBlank===false))x.allowBlank=true;
            // });
            if(item.action=='modprogramamedico'){
                var selected=me.getMain().getSelectionModel().getSelection()[0];
                console.log('record:', selected)
                win.down('customform').getForm().loadRecord(selected);
                me.getDatosAdicionales(selected.get('idprogramamedico'), win);
            }
        });
    },

    getDatosAdicionales: function(idprogramamedico, win){
        var me=this, cargandoDatosAdicionales=true;
        win.down('#gridservicios').on('render', function (yo) {
            if (cargandoDatosAdicionales) {
                win.down('#gridservicios').maskL = new Ext.LoadMask(
                    win.down('#gridservicios'), {msg: 'Cargando'});
                win.down('#gridservicios').maskL.show();
            }
        });
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getDatosAdicionales'}, me),
            params: {
                idprogramamedico: idprogramamedico
            },
            success: function (response, success) {
                console.log(success, response)
                cargandoDatosAdicionales=false;
                if(win.down('#gridservicios').maskL)win.down('#gridservicios').maskL.hide();
                me.application.keyMap.enable();
                var response = Ext.decode(response.responseText);
                win.down('#gridservicios').getStore().loadData(response['servicios']['data']);
            },
            failure:function(){
                cargandoDatosAdicionales=false;
                me.application.keyMap.enable();
                Ext.MessageBox.hide();
            }
        });
    },

    deleteWindowProgramaMedico: function(item){
        var me =this;
        me.application.keyMap.disable();
        var dialog = Ext.create('Ext.window.MessageBox', {
            buttonAlign: 'center',
            buttons: [
                {
                    text: 'Aceptar',
                    iconCls: 'aceptar',
                    handler: function () {
                        var grid=me.getMain(),
                            selected=grid.getSelectionModel().getSelection(),
                            ids=[];
                        selected.forEach(function(x){
                            ids.push(x.get('idprogramamedico'))
                        });
                        dialog.close();
                        Ext.MessageBox.show({
                            msg: 'Eliminando programas médicos',
                            wait: true,
                            waitConfig: {interval: 200}
                        });
                        Ext.Ajax.request({
                            url: UtilsFn.buildUrl({action: 'eliminarProgramasMedicos'}, me),
                            params: {
                                idprogramamedico: Ext.encode(ids)
                            },
                            success: function (response) {
                                me.application.keyMap.enable();
                                Ext.MessageBox.hide();
                                grid.getStore().load();
                                mostrarMensaje(1, 'Los programas médicos han sido eliminados satisfactoriamente.');
                            },
                            failure:function(response){
                                me.application.keyMap.enable();
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
                        me.application.keyMap.enable();
                    }
                }
            ]
        });
        dialog.show({
            title: 'Confirmación',
            msg: '¿Está seguro que desea eliminar los programas médicos seleccionados?',
            icon: Ext.MessageBox.QUESTION,
        });
    },

    onSelectCmbSelectField: function (field, records) {
        var form = field.up('form'),
            idproperty = field.store.getProxy().reader.idProperty,
            hiddenField = form.getForm().findField(field.localId);
        console.log('combo:', field.localId, idproperty, hiddenField)
        if (hiddenField && records) {
            hiddenField.multiSelect = field.multiSelect;
            hiddenField.setValue(records[0].data[idproperty]);
        }
        field.fireEvent('addselected', false, false, field, records);
    },

    onResetCmbSelect: function (field) {
        var localid = field.localId,
            form = field.up('form').getForm();
        if (localid) {
            var hdfield = form.findField(localid);
            if (!hdfield) return;
            hdfield.setValue('');
        }
        field.trueValue = '';
    },

    selectServicio: function (sm, records) {
        var me=this,
            win=me.getWindowServicio();
        win.btnAceptar.setDisabled(records.length==0);
        win.btnAplicar.setDisabled(records.length==0);
    },

    addWindowServicio: function (item) {
        var me=this;
        console.log('me.winServicio:', me.winServicio)
        console.log('gridpanel:', item.up('gridpanel'))
        if(!me.winServicio)
            me.winServicio=Ext.create('ProgramaMedico.view.WindowServicio', {
                title: me.etiquetas.titleSelecServicio,
                gridproducto: item.up('gridpanel'),
                planificacion: true
                //width: window.innerWidth*0.85
            });
        me.winServicio.gridproducto=item.up('gridpanel');
        me.winServicio.show();
    },
    deleteServicio: function (item) {
        var me=this;
        var dialog = Ext.create('Ext.window.MessageBox', {
            buttonAlign: 'center',
            buttons: [
                {
                    text: 'Aceptar',
                    iconCls: 'aceptar',
                    handler: function () {
                        item.up('gridpanel').getStore().remove(item.up('gridpanel').getSelectionModel().getSelection());
                        dialog.close();
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
            title: 'Confirmación',
            msg: '¿Está seguro que desea eliminar el servicio seleccionado?',
            icon: Ext.MessageBox.QUESTION,
        });

    },
    seleccionarServicios: function(item){
        var me=this,
            gridproducto = item.up('window').gridproducto,
            stproducto = gridproducto.getStore(),
            sm = item.up('window').grid.getSelectionModel(),
            yaExiste=[];
        Ext.each(sm.getSelection(), function (record) {
            var index = stproducto.find('idservicio', record.data.idindicador || record.data.idactividad);
            if (index == -1) {
                let monedaUSD = '';
                me.application.monedas_entidad.forEach(function(field){
                    if(field.codigoiso.toLowerCase() === 'usd')
                        monedaUSD = 'montomoneda_' + field.codigoiso.toLowerCase() + '_' + field.idmoneda;
                })
                stproducto.add({
                    idindicador: record.data.idindicador,
                    idservicio: record.data.idindicador,
                    denominacion: record.data.denominacion,
                    codigo: record.data.codigo,
                    codigoproveedor: record.data.codigoproveedor,
                    cantidad: 1,
                    tipo: record.data.tipo || 2,
                    monto: record.data.precio,
                    [monedaUSD]: record.data.precio,
                    facturado: 0
                });
            }else{
                yaExiste.push(record.get('denominacion'));
            }
        });
        if(yaExiste.length>0)
            mostrarMensaje(8, 'Ya están añadidos los siguientes servicios: <br>-'+yaExiste.join('<br>-'));
        if(item.action=='acept' && sm.getCount()>yaExiste.length)
            item.up('window').close();
        sm.deselectAll();
    },

    onSearch: function (field) {
        var grid = field.up('grid');
        grid.getStore().load({
            params: {
                denominacion: field.getValue()
            }
        });
    },

    onClear: function (field) {
        var grid = field.up('grid');
        grid.getStore().load();
    },

    guardarProgramaMedico: function(item){
        var me=this, win=item.up('window'),
            params=win.down('customform').getForm().getValues(), servicios=[];
        console.log('guardarProgramaMedico')
        win.down('#gridservicios').getStore().getRange().forEach(function(x){
            servicios.push(x.data);
        })
        Ext.MessageBox.show({
            msg: 'Guardando datos del programa médico',
            width: 300,
            wait: true,
            waitConfig: {interval: 200}
        });
        params['servicios']=Ext.encode(servicios);
        console.log('patrams:',params)

        // win.down('customform').submit({
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'guardarProgramaMedico'}, me),
            params: params,
            submitEmptyText: false,
            success: function (response) {
                Ext.MessageBox.hide();
                var response = Ext.decode(response.responseText);
                if(response.success) {
                    me.getMain().getStore().load();
                    if (win.action == 'add')
                        mostrarMensaje(1, 'El programa médico ha sido adicionado satisfactoriamente.');
                    else
                        mostrarMensaje(1, 'El programa médico ha sido modificado satisfactoriamente.');
                    if (item.action == 'apply' && win.action == 'add') win.down('customform').getForm().reset();
                    if(item.action=='acept')win.close();
                    // console.log('success')
                }else{
                    mostrarMensaje(6, response.message);
                }
            },
            failure: function (form, action) {
                // Ext.MessageBox.hide();
                // var response = Ext.decode(action.response.responseText);
                console.log('failure', action)
            }
        })
    },
    selectPaciente: function(combo, records){
        combo.up('form').getForm().findField('fechanacimiento').setValue('');
        if(combo.getValue()){
            var cod=records[0].get('codigo');
            if(cod.length==11){
                combo.up('form').getForm().findField('fechanacimiento').setValue(
                    new Date(parseInt(cod.substring(0,2)), parseInt(cod.substring(2,4))-1, parseInt(cod.substring(4,6))));
            }
        }
    },
    changePaciente: function(combo, value){
        if(!value)
            combo.up('form').getForm().findField('fechanacimiento').setValue('');
    },
    onChangeTipoPrecio: function (combo, value) {
         var grid = combo.up('grid'),
            store = grid.getStore();

        store.proxy.extraParams.idtipoprecio = value ? value : -1;
        store.load();
    },
    exportarProgramaMedico: function(button){
        console.log('exportarProgramaMedico')
        let selected = button.up('grid').getSelectionModel().getSelection();
        if(selected.length===1)
            window.open(window.location.origin + '/crm/serviciomedico/index.php/programamedico/exportarProgramaMedico?idprogramamedico='+selected[0].get('idprogramamedico'));
        else
            mostrarMensaje(6, 'Debe seleccionar un programa médico para exportar.');

    },
    facturarProgramaMedico: function(button){
        console.log('facturarProgramaMedico')
        var me =this;
        me.application.keyMap.disable();
        var dialog = Ext.create('Ext.window.MessageBox', {
            buttonAlign: 'center',
            buttons: [
                {
                    text: 'Aceptar',
                    iconCls: 'aceptar',
                    handler: function () {
                        var grid=me.getMain(),
                            selected=grid.getSelectionModel().getSelection();
                            // ids=[];
                        // selected.forEach(function(x){
                        //     ids.push(x.get('idprogramamedico'))
                        // });
                        dialog.close();
                        // Ext.MessageBox.show({
                        //     msg: 'Facturando programa médico',
                        //     wait: true,
                        //     waitConfig: {interval: 200}
                        // });
                        Ext.Ajax.request({
                            url: UtilsFn.buildUrl({action: 'facturarProgramaMedico'}, me),
                            params: {
                                idprogramamedico: selected[0].get('idprogramamedico')
                            },
                            success: function (response) {
                                me.application.keyMap.enable();
                                var response = Ext.decode(response.responseText);
                                console.log('Response: ', response);
                                // Ext.MessageBox.hide();
                                if(!response['codMsg']){
                                    grid.getStore().load();
                                    mostrarMensaje(1, 'El programa médico ha sido facturado satisfactoriamente.');
                                }
                                
                            },
                            failure:function(response){
                                console.log('Fail: ');
                                me.application.keyMap.enable();
                                // Ext.MessageBox.hide();
                            }
                        });
                    }
                },
                {
                    text: 'Cancelar',
                    iconCls: 'cancelar',
                    handler: function () {
                        dialog.close();
                        me.application.keyMap.enable();
                    }
                }
            ]
        });
        dialog.show({
            title: 'Confirmación',
            msg: '¿Está seguro que desea facturar el programa médico seleccionado?',
            icon: Ext.MessageBox.QUESTION,
        });

    }

    // resetTipoPrecio: function (store) {
    //     var window = this.getWindowProducto();
    //     if(window){
    //         combo = window.cmbTipoPrecio;
    //         value = combo.getValue();
    //         if (!value)
    //             store.proxy.extraParams.idtipoprecio = -1;
    //     }
    // },
})