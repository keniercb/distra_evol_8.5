Ext.define('GestionContrato.controller.MainWindowContratacion', {
    extend: 'CRM.core.controller.Base',

    refs: [
        {ref: 'MainContratacion', selector: 'co_gcmainContratacion'},
        {ref: 'MainGridContratacion', selector: 'co_contratosgridContratacion'},
        {ref: 'co_mainwindowContratacion', selector: 'co_mainwindowContratacion'},
        {ref: 'hitoPago', selector: 'GridHitoPago'},
        {ref: 'producto', selector: 'gridproducto'},
        {ref: 'vehiculo', selector: 'gridvehiculos'},
        //{ref: 'GpAreaConPermiso', selector: 'gpareaconpermiso'},
        {ref: 'anexos', selector: 'fpdocumentosadicionales'},
        {ref: 'gridMora', selector: 'gridmora'},
        {ref: 'gridClientesAsociados', selector: 'gridclientesasociados'},
        {ref: 'TabHitosAdicional', selector: 'tabhitosadicional'},
    ],

    requires: [
        'Ext.ux.CmbSelectField',
        'GestionContrato.view.FormaPago.FormaPago',
        'Ext.ux.ComboFieldSet',
        'Ext.ux.CustomForm'
    ],

    init: function () {
        var me = this;
        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            component: {
                "co_mainwindowContratacion": {
                    beforeshow: this.beforeShowWin,
                    show: this.winShow,
                    hide: this.hideWin
                },
                'co_mainwindowContratacion button': {
                    click: this.clickButtonWin
                },
                'co_mainwindowContratacion cmbselectfield': {
                    change: this.changeSelectField
                },
                'co_mainwindowContratacion combobox[localId],co_mainwindowContratacion pickerfield[localId]': {
                    select: this.selectCombo,
                    change: this.changeCombo
                },
                'configpordefectowindow combobox[localId],configpordefectowindow pickerfield[localId]': {
                    select: this.selectCombo,
                    change: this.changeCombo
                },
                // 'co_mainwindowContratacion combobox[name=mediopago]': {
                'co_mainwindowContratacion combobox[localIdMulti]': {
                    select: this.selectComboMulti,
                    change: this.changeComboMulti
                },
                'co_mainwindowContratacion cmbselectfield[name=denominacioncontratomarco]': {
                    select: this.selectContratoMarco,
                    change: this.changeContratoMarco
                },
                'co_mainwindowContratacion numberfield[name=vigencia],co_mainwindowContratacion datefield[name=fechafirma],signwindow datefield[name=fechafirma]': {
                    change: this.setEndDate
                },
                'co_mainwindowContratacion datefield[name=fechafirma]': {
                    change: this.calcularFechaHitos
                },
                'co_mainwindowContratacion datefield[name=fechafin]': {
                    change: this.cambioFechaManual
                },
                'co_mainwindowContratacion combobox[name=unidadtiempo]': {
                    select: this.setEndDate,
                    change: function (cmb, value) {
                        var pos = cmb.store.find('idunidadtiempo', value);
                        if (pos != -1) {
                            var record = cmb.store.getAt(pos);
                            cmb.select(record);
                        }
                    },
                    render: function (cmb) {
                        var action = this.getCo_mainwindowContratacion().action;
                        if (action == 'add') {
                            cmb.setValue(3);
                        }
                    }
                },
                'co_mainwindowContratacion checkbox[name=cumplimientoobligaciones]': {
                    change: this.checkCumplimientoObligaciones
                },
                /*'co_mainwindowContratacion hidden[name=idsector]': {
                 change: this.generateNumber
                 },*/
                'co_mainwindowContratacion hidden': {
                    change: this.changeValueSelect
                },
                'selectwindow[controller=gestioncontratomainwindow]': {
                    addselected: this.selectValueWindow
                },
                'co_mainwindowContratacion cmbselectfield[controller=gestioncontratomainwindow]': {
                    addselected: this.selectValueWindow
                },
                'clausulaswindow[fieldSetClausula]': {
                    addclausula: this.addClausula
                },
                'co_mainwindowContratacion fileuploadfield': {
                    seturl: function (field, url) {
                        field.urlfile = url;
                        me.getCo_mainwindowContratacion().btnShowFile.show();
                        me.getCo_mainwindowContratacion().btnDelFile.show();
                        me.delfile = false;
                    },
                    change: function (field, value) {
                        me.getCo_mainwindowContratacion().btnShowFile.hide();
                        if (value) {
                            me.getCo_mainwindowContratacion().btnDelFile.show();
                            me.delfile = false;
                        } else {
                            me.getCo_mainwindowContratacion().btnDelFile.hide();
                        }
                    },
                    reset: function () {
                        me.getCo_mainwindowContratacion().btnDelFile.hide();
                        me.getCo_mainwindowContratacion().btnShowFile.hide();
                    }
                },
                "fpdocumentosadicionales fileuploadfield": {
                    change: this.changeFileUploadDocumento,
                    reset: this.resetFileUploadDocumento
                },
                "fpdocumentosadicionales button[action=delfile]": {
                    click: this.deleteDocumento
                },
                'co_selectwindowclienteproveedor': {
                    show: this.onShowSelectClienteProveedor,
                    close: function (window) {
                        window.isClosed = true;
                    }
                },
                'co_selectwindowclienteproveedor button[action=acept]': {
                    click: this.onSelectClienteProveedor
                },
                'co_mainwindowContratacion textfield[name=nombre]': {
                    keydown: function (yo) {
                        yo.modNombre = true;
                    }
                 },
                'co_mainwindowContratacion combobox[name=nombreoferta]': {
                    select: me.selectOferta
                },
//                 'co_mainwindowContratacion hiddenfield[name=idarea]':{
//                 'co_mainwindowContratacion cmbarea':{
//                     change: me.changecmbarea
//                 },
                'co_mainwindowContratacion combobox[name=clienteproveedor]':{
                    select: this.selectClienteProveedor
                },
                'gridclientesasociados':{
                    selectionchange: this.selectionChangeClientesAsociados
                },
                'gridclientesasociados button[action]':{
                    click: this.onActionClientesAsociados
                },
                'co_mainwindowContratacion combobox[name=cumplimientoobligaciones]':{
                    change: this.onSelectTipoVigencia
                }
            }
        });
        this.dataDynamicElement = new Object();
      },

    selectClienteProveedor: function(combo, record){
        var me =this, win = this.getCo_mainwindowContratacion(),
            cargandoDatosW=true, vehiculo=me.getVehiculo();
        if(vehiculo && vehiculo.isVisible()) {
            vehiculo.on('render', function (yo) {
                // console.log('TTTTTTTTTTTT')
                if (cargandoDatosW) {
                    vehiculo.maskLW = new Ext.LoadMask(
                        vehiculo, {msg: this.etiquetas.msgLoading});
                    vehiculo.maskLW.show();
                }
            });
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'getVehiculos'}, this),
                params: {
                    idclienteproveedor: parseInt(record[0].get('idclientesproveedores'))
                },
                success: function (response) {
                    // console.log('getvehiculossssssssss 5678')
                    cargandoDatosW = false;
                    if (vehiculo.maskLW) vehiculo.maskLW.hide();
                    var response = Ext.decode(response.responseText);
                    vehiculo.store.loadData(response);
                    vehiculo.datosLoad = response;
                }
            });
        }
        if(this.application.contabilidad){
            // me.cargarDatosDeudaClienteProveedor();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'comprobarDeudaClienteProveedor'}, this),
                params: {
                    idclienteproveedor: Ext.encode([parseInt(record[0].get('idclientesproveedores'))])
                },
                success: function (response) {
                    // console.log('getvehiculossssssssss 5678')
                    var response = Ext.decode(response.responseText);
                    // console.log('response:', response)
                    // console.log('response.length:', response.length)
                    win.buscadaDeudaClienteProveedor=true;
                    win.deudaClienteProveedor=response.length;
                }
            });
        }
    },

    cambioFechaManual: function (yo) {
        var me = this,
            win = this.getCo_mainwindowContratacion();
        if (!win.vigencia.getValue()) {
            win.vigencia.setDisabled(yo.getValue() != null)
            win.unidadTiempo.setDisabled(yo.getValue() != null)
        }

    },

    calcularFechaHitos: function () {
        var me = this,
            win = this.getCo_mainwindowContratacion(),
            hitos = win.formaPago.hitopago.getStore().getRange();

        // function calcular_fecha_estimada(vigencia, unidadTiempo, fechafirma) {
        //     fecha_inicial = Ext.clone(fechafirma);
        //     console.log('parametros:', vigencia, unidadTiempo, fechafirma)
        //     if (unidadTiempo == 1) {
        //         fecha_inicial.setDate(fecha_inicial.getDate() + vigencia);
        //     } else if (unidadTiempo == 2) {
        //         // fecha_inicial.setMonth(fecha_inicial.getMonth() + vigencia);
        //         fecha_inicial.setDate(fecha_inicial.getDate() + vigencia * 7);
        //     } else if (unidadTiempo == 3) {
        //         fecha_inicial.setMonth(fecha_inicial.getMonth() + vigencia);
        //         // fecha_inicial.setFullYear(fecha_inicial.getFullYear()+me.vigencia.getValue());
        //     }
        //     console.log('result:', Ext.Date.format(fecha_inicial, 'd/m/Y'))
        //     return Ext.Date.format(fecha_inicial, 'd/m/Y');

        win.fechaFin.setReadOnly(win.fechafirma.getValue() == null);

        if (win.fechafirma.getValue()) {
            win.fechaFin.validate();
            Ext.each(hitos, function (value, index) {
                // console.log(value, index)
                if (!value.get('fechafin') && value.get('vigencia'))
                    value.set('fechafin', me.calcular_fecha_estimada(
                        parseInt(value.get('vigencia')), parseInt(value.get('unidadtiempo')), win.fechafirma.getValue()))
            });
        }
    },

    calcular_fecha_estimada: function (vigencia, unidadTiempo, fechafirma) {
        var fecha_inicial = Ext.clone(fechafirma);
        if (unidadTiempo == 1) {
            fecha_inicial.setDate(fecha_inicial.getDate() + vigencia);
        } else if (unidadTiempo == 2) {
            // fecha_inicial.setMonth(fecha_inicial.getMonth() + vigencia);
            fecha_inicial.setDate(fecha_inicial.getDate() + vigencia * 7);
        } else if (unidadTiempo == 3) {
            fecha_inicial.setMonth(fecha_inicial.getMonth() + vigencia);
            // fecha_inicial.setFullYear(fecha_inicial.getFullYear()+me.vigencia.getValue());
        }
        return Ext.Date.format(fecha_inicial, 'd/m/Y');
    },

    selectComboMulti: function (combo, records) {
        var form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localIdMulti), valores = '';
        if (hiddenField) {
            // if(valores!='')valores+=',';
            records.forEach(function (x) {
                valores += x.get(combo.localIdMulti) + ','
            });
            // console.info('selectComboMulti respuesta:', valores.substr(0, valores.length - 1))
            hiddenField.setValue(valores.substr(0, valores.length - 1));
        }
    },

    changeComboMulti: function (combo, value) {
        // console.info('changeComboMulti n:', combo.localIdMulti)
        var form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localIdMulti);
        if (hiddenField && Ext.isEmpty(value)) {
            hiddenField.setValue('');
        }
    },

    addClausula: function (win, values) {
        var me = this,
            fieldSetClausula = win.fieldSetClausula,
            newFieldSet = Ext.create('Ext.ux.ComboFieldSet', {
                //xtype: itemsCmp[k].xtype,
                title: values.denominacion,
                htmlvalue: '',
                collapsible: true,
                collapsed: false,
                labelAlign: 'top',
                layout: 'column',
                columnWidth: 1,
                border: true,
                xtypejojo: 'toolbar',
                otherjojo: true,
                cfgjojo: {
                    bodyStyle: 'background:#DFE9F6;',
                    border: false,
                    margin: 0,
                    style: "background-color: transparent; background-image: none;",
                    defaults: {
                        width: 19,
                        height: 19
                    },
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'icondistra-vistaprevia icon-small',
                            action: 'vistaprevia',
                            tooltip: me.etiquetas.lbVistaPrevia + " " + values.denominacion.toLowerCase()
                        }, {
                            xtype: 'button',
                            iconCls: 'icondistra-modificar icon-small',
                            action: 'modificar',
                            tooltip: me.etiquetas.lbModificarElemento + " " + values.denominacion.toLowerCase()
                        }, {
                            xtype: 'button',
                            iconCls: 'icondistra-eliminar icon-small',
                            action: 'eliminar',
                            tooltip: me.etiquetas.lbEliminarElemento + " " + values.denominacion.toLowerCase()
                        }
                    ]
                },
                defaults: {
                    bodyStyle: 'background:#DFE9F6;',
                    margin: '0 5 5 5',
                    columnWidth: 0.5,
                    layout: 'hbox',
                    border: false
                },
                items: []
            });
        me.createElement(newFieldSet, values.contenido);
        fieldSetClausula.add(newFieldSet);
    },

    comprobarDeudaClienteProveedor: function (myButton) {
        var me = this, win = me.getCo_mainwindowContratacion();
        // console.log('comprobarDeudaClienteProveedor', win.deudaClienteProveedor)
        if (win.deudaClienteProveedor > 0) {
            var dialog = Ext.create('Ext.window.MessageBox', {
                buttonAlign: 'center',
                buttons: [
                    {
                        text: 'Aceptar',
                        iconCls: 'aceptar',
                        handler: function () {
                            me.saveData(myButton);
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
                title: me.etiquetas.lbConfirmacion,
                msg: me.etiquetas.msgClienteConDeudas,
                icon: Ext.MessageBox.QUESTION,
            });
        } else {
            me.saveData(myButton);
        }
    },

    clickButtonWin: function (myButton, e, eOpts) {
        var me = this, win = me.getCo_mainwindowContratacion();
        if (myButton.action == 'acept' || myButton.action == 'apply') {
            if (this.application.contabilidad) {
                if (win.buscadaDeudaClienteProveedor) {
                    me.comprobarDeudaClienteProveedor(myButton);
                } else {
                    Ext.MessageBox.show({
                        msg: me.etiquetas.msgComprobandoDatosClientes,
                        width: 300,
                        wait: true,
                        waitConfig: {interval: 200}
                    });
                    Ext.Ajax.request({
                        url: UtilsFn.buildUrl({action: 'comprobarDeudaClienteProveedor'}, this),
                        params: {
                            idclienteproveedor: Ext.encode([parseInt(win.hfclienteproveedor.getValue())])
                        },
                        success: function (response) {
                            Ext.MessageBox.hide();
                            var response = Ext.decode(response.responseText);
                            win.buscadaDeudaClienteProveedor = true;
                            win.deudaClienteProveedor = response.length;
                            me.comprobarDeudaClienteProveedor(myButton);
                        }
                    });
                }
            } else {
                me.saveData(myButton);
            }
        } else if (myButton.action == 'vistaprevia') {
            var fieldset = myButton.up().up().up(),
                transformHtml = this.getElements(fieldset.items.items, fieldset.htmlvalue);
            Ext.create('Ext.window.Window', {
                title: fieldset.title,
                layout: 'fit',
                maskOnDisable: false,
                constrain: true,
                modal: true,
                frame: false,
                border: false,
                width: 730,
                minWidth: 580,
                height: 300,
                minHeight: 120,
                maximizable: true,
                items: {
                    xtype: 'tinyhtmleditor',
                    enableVar: false,
                    enableSourceEdit: false,
                    readOnly: true,
                    height: 300,
                    value: transformHtml
                }
            }).show();
        } else if (myButton.action == 'modificar') {
            me.modSection(myButton, me);
        } else if (myButton.action == 'eliminar') {
            mostrarMensaje(2, me.etiquetas.msgEliminar + me.etiquetas.lbSeleccionado, function (response) {
                if (response === 'ok') {
                    myButton.up().up().up().destroy();
                }
            });
        } else if (myButton.action == 'add') {
            ModuleMgr.get('Proformas').getClausulasWindowController().showWindow(myButton, parseInt(me.getCo_mainwindowContratacion().hftipocontrato.getValue()), {fieldSetClausula: myButton.up().up().up()});
        } else if (myButton.action == 'addSection') {
            me.addSection(me);
        } else if (myButton.action == 'showfile') {
            me.showFile(myButton);
        }
    },

    addSection: function (me) {
        var winAddSection = Ext.create('Ext.ux.CustomWindow', {
                title: me.etiquetas.lbAddSeccion,
                layout: 'column',
                action: 'addSection',
                maskOnDisable: false,
                constrain: true,
                modal: true,
                frame: false,
                border: false,
                width: 250,
                minWidth: 250,
                height: 100,
                minHeight: 100,
                maximizable: false,
                defaultFocus: 'namefield',
                items: {
                    xtype: 'textfield',
                    fieldLabel: me.etiquetas.lbName,
                    name: 'namefield',
                    autoScroll: true,
                    columnWidth: 1,
                    labelAlign: 'top',
                    allowBlank: false
                }
            }),
            checkDirty = true;
        winAddSection.on('show', function (win) {
            Ext.TaskManager.start({
                run: function () {
                    if (checkDirty) {
                        if (winAddSection.down('textfield').isDirty()) {
                            winAddSection.disableButtons(false);
                        } else {
                            winAddSection.disableButtons(true);
                        }
                    } else {
                        return false;
                    }

                },
                interval: 100,
                scope: me
            });
            win.items.items[0].focus();
        });
        winAddSection.on('hide', function () {
            checkDirty = false;
        });
        winAddSection.btnAceptar.on('click', function () {
            var value = winAddSection.down('textfield').getValue(),
                newFieldSet = Ext.create('Ext.ux.ComboFieldSet', {
                    //xtype: itemsCmp[k].xtype,
                    title: value,
                    htmlvalue: '',
                    collapsible: true,
                    collapsed: false,
                    labelAlign: 'top',
                    layout: 'column',
                    columnWidth: 1,
                    border: true,
                    xtypejojo: 'toolbar',
                    otherjojo: true,
                    cfgjojo: {
                        bodyStyle: 'background:#DFE9F6;',
                        border: false,
                        margin: 0,
                        style: "background-color: transparent; background-image: none;",
                        defaults: {
                            width: 19,
                            height: 19
                        },
                        items: [
                            {
                                xtype: 'button',
                                iconCls: 'icondistra-vistaprevia icon-small',
                                action: 'vistaprevia',
                                tooltip: me.etiquetas.lbVistaPrevia + " " + value.toLowerCase()
                            }, {
                                xtype: 'button',
                                iconCls: 'icondistra-modificar icon-small',
                                action: 'modificar',
                                tooltip: me.etiquetas.lbModificarElemento + " " + value.toLowerCase()
                            }, {
                                xtype: 'button',
                                iconCls: 'icondistra-eliminar icon-small',
                                action: 'eliminar',
                                tooltip: me.etiquetas.lbEliminarElemento + " " + value.toLowerCase()
                            }
                        ]
                    },
                    defaults: {
                        bodyStyle: 'background:#DFE9F6;',
                        margin: '0 5 5 5',
                        columnWidth: 0.5,
                        layout: 'hbox',
                        border: false
                    },
                    items: []
                });
            if (me.getCo_mainwindowContratacion().formDynamic.getComponent(1)) {
                me.getCo_mainwindowContratacion().formDynamic.getComponent(1).add(newFieldSet);

            } else {
                me.getCo_mainwindowContratacion().formDynamic.add({
                    xtype: 'panel',
                    labelAlign: 'top',
                    bodyStyle: 'background:#DFE9F6;',
                    layout: 'column',
                    columnWidth: 1,
                    border: false,
                    id: 'paneldel',
                    flex: 1,
                    items: newFieldSet
                })
            }

            winAddSection.destroy();
        });
        winAddSection.show();
    },

    modSection: function (myButton, me) {
        var winDynamicCmp = Ext.create('Ext.ux.CustomWindow', {
            title: myButton.up().up().up().title,
            layout: 'fit',
            action: 'edit',
            maskOnDisable: false,
            constrain: true,
            modal: true,
            frame: false,
            border: false,
            width: 730,
            minWidth: 580,
            minHeight: 150,
            maximizable: true,
            items: {
                xtype: 'tinyhtmleditor',
                autoScroll: true,
                height: 300,
                value: myButton.up().up().up().htmlvalue,
                tipocontrato: me.getCo_mainwindowContratacion().hftipocontrato.getValue()
            }
        });
        var checkDirty = true;
        winDynamicCmp.on('show', function () {
            Ext.TaskManager.start({
                run: function () {
                    if (checkDirty) {
                        if (winDynamicCmp.down('tinyhtmleditor').isDirty()) {
                            winDynamicCmp.disableButtons(false);
                        } else {
                            winDynamicCmp.disableButtons(true);
                        }
                    } else {
                        return false;
                    }

                },
                interval: 100,
                scope: me
            });
        });
        winDynamicCmp.on('hide', function () {
            checkDirty = false;
        });
        winDynamicCmp.btnAceptar.on('click', function () {
            me.createElement(myButton.up().up().up(), winDynamicCmp.down('tinyhtmleditor').getValue());
            winDynamicCmp.destroy();
        });
        winDynamicCmp.show();
    },

    saveData: function (myButton) {
        var me = this,
            win = me.getCo_mainwindowContratacion(),
            dataForm = win.customForm,
            formDynamic = win.formDynamic,
            docForm = win.docForm,
            pagoForm = win.formaPago,
            arrayComponent = formDynamic.getComponent(1) ? formDynamic.getComponent(1).items.items : new Array(),
            dataDynamic = new Array(),
            hitos = me.getHitos(),
            productos = me.getProductos(),
            vehiculos = me.getVehiculos(),
            implicadas = me.getImplicadas(),
            clientesAsociados=me.getClientesAsociados(),
            objetosuplemento = win.objetosuplemento.getValue(),
            notificarinicial=this.application.notificarinicial;
            // hitosadicionales = me.getHitosDatosAdicionales();
        // if(win.down('#tabhitosadicional')){
        //     hitos=
        // }
        if (win.suplemento || win.action == 'edit') {
            var data = win.grid.getSelectionModel().getLastSelected().data;
        }

        for (var i in arrayComponent) {
            var cmp = arrayComponent[i],
                itemsCmp = cmp.items.items,
                dataItemsCmp = new Array();
            for (var k in itemsCmp) {
                if (itemsCmp[k].items) {
                    var items = itemsCmp[k].items.items,
                        array = new Array();
                    for (var j in items) {
                        array.push({
                            denominacion: items[j].denominacion,
                            xtype: items[j].xtype,
                            obligatorio: items[j].obligatorio,
                            tipo: items[j].tipo,
                            value: items[j].getValue(),
                            rawValue: items[j].getRawValue(),
                            idelemento: items[j].idelemento,
                            fuente: items[j].fuente,
                            compartimentacion: items[j].compartimentacion,
                            cfg: items[j].cfg,
                            event: items[j].event
                        })
                    }
                    dataItemsCmp.push({
                        title: itemsCmp[k].title,
                        xtype: itemsCmp[k].xtype,
                        items: array,
                        tipo: cmp.tipo,
                        htmlvalue: itemsCmp[k].htmlvalue
                    })
                } else {
                    dataItemsCmp.push({
                        denominacion: itemsCmp[k].denominacion,
                        xtype: itemsCmp[k].xtype,
                        obligatorio: itemsCmp[k].obligatorio,
                        tipo: itemsCmp[k].tipo,
                        value: itemsCmp[k].getValue(),
                        rawValue: itemsCmp[k].getRawValue(),
                        idelemento: itemsCmp[k].idelemento,
                        fuente: itemsCmp[k].fuente,
                        compartimentacion: itemsCmp[k].compartimentacion,
                        cfg: itemsCmp[k].cfg,
                        event: itemsCmp[k].event
                    });
                }
            }
            dataDynamic.push({
                title: cmp.title,
                xtype: cmp.xtype,
                clausula: cmp.clausula,
                tipo: cmp.tipo,
                items: dataItemsCmp,
                htmlvalue: cmp.htmlvalue
            })
        }
        var params = dataForm.getForm().getValues();
        params.idproforma = win.hfproforma.getValue();
        params.proforma = win.sfproforma.getValue();
        Ext.merge(params, pagoForm.getForm().getValues());
        if (win.action == 'add' || (win.suplemento && win.addsuplemento)) {
            Ext.merge(params, {
                formDynamic: dataDynamic ? Ext.encode(dataDynamic) : dataDynamic,
                contratomarco: win.tipocontrato == 'contratoMarco' ? 1 : 0,
                cliente: win.context == 'cliente' ? 1 : 0,
                suplemento: win.suplemento,
                addsuplemento: win.addsuplemento,
                productos: Ext.encode(productos),
                hitos: Ext.encode(hitos),
                numerojson: Ext.encode(win.numerojson),
                implicadas: Ext.encode(implicadas),
                objetosuplemento: objetosuplemento,
                numeroparametros: Ext.encode(win.numeroparametros),
                contratodestino: win.context=='cliente'?2:3,
                vehiculos: Ext.encode(vehiculos),
                clientesasociados: Ext.encode(clientesAsociados),
                html: win.down('#tinyproformacontrato').getValue()
                // hitosadicionales: Ext.encode(hitosadicionales)
            });
            if (win.suplemento) {
                params['idpadre'] = data.idcontrato;
            }
            Ext.MessageBox.show({
                msg: me.etiquetas.lbGuardando,
                width: 300,
                wait: true,
                waitConfig: {interval: 200}
            });
            docForm.submit({
                url: UtilsFn.buildUrl({action: 'addcontrato'}, this),
                params: params,
                submitEmptyText: false,
                // waitMsg: me.etiquetas.lbGuardando,
                success: function (form, action) {
                    Ext.MessageBox.hide();
                    var response = Ext.decode(action.response.responseText);
                    if (response.suplementoEx) {
                        mostrarMensaje(8, me.etiquetas.msgSuplementoEx);
                        if (win.grid) win.grid.getStore().load();
                        win.destroy();
                    } else if (response.identificadorNodoPadre == 0) {
                        mostrarMensaje(1, me.etiquetas.msgErrorExisteDocumento);
                    } else if (response.code == -3) {
                        mostrarMensaje(1, me.etiquetas.msgErrorConnectionAlfresco);
                    } else {
                        mostrarMensaje(1, (win.suplemento ? me.etiquetas.msgSuplementoAdd : me.etiquetas.msgContratoAdd));
                        if(!win.suplemento)
                            var actual=notificarinicial[params['cliente']==1?'mdContrato':'mdcontratoproveedor'];
                            if(actual && actual['notificar']=='1')
                                me.enviarCorreo({
                                    destinatarios: actual['notificaciones'],
                                    cuerpo: 'Ha sido insertado un nuevo '+actual['denominacion'].toLowerCase()+' con el número <b style="color:#3158a0">'
                                        +params['numero']+'</b> y nombre <b style="color:#3158a0">'+params['nombre']+'</b>.'
                                });
                        if (win.grid) win.grid.getStore().load();
                        if (myButton.action == 'acept') {
                            win.destroy();
                        } else {
                            dataForm.getForm().reset();
                            pagoForm.getForm().reset();
                            docForm.getForm().reset();
                            dataForm.getForm().setValues({fechainicio: new Date()});
                            if (win.formDynamic.items.items[1]) {
                                //win.formDynamic.hide();
                                win.formDynamic.items.items[1].destroy();
                            }
                            pagoForm.hitopago.getStore().removeAll();
                            pagoForm.indicadores.getStore().removeAll();
                            pagoForm.hitopago.setDisabled(false);
                            pagoForm.indicadores.setDisabled(false);
                            win.nombre.focus();
                        }
                    }
                },
                failure: function (form, action) {
                    Ext.MessageBox.hide();
                    var response = Ext.decode(action.response.responseText);
                    // console.log('FAILURE:',response)
                    if(response.code==23505){
                        mostrarMensaje(8, 'Ya existe el número de contrato.<br>' +
                            'Se recalculará el número de contrato e intente guardar de nuevo.');
                        if(win)me.generateNumber();
                    }
                }
            });
        }
        else {
            Ext.merge(params, {
                formDynamic: dataDynamic ? Ext.encode(dataDynamic) : dataDynamic,
                contratomarco: win.tipocontrato == 'contratoMarco' ? 1 : 0,
                cliente: win.context == 'cliente' ? 1 : 0,
                idcontrato: data.idcontrato,
                suplemento: win.suplemento,
                addsuplemento: win.addsuplemento,
                implicadas: Ext.encode(implicadas),
                version: data.version,
                productos: Ext.encode(productos),
                hitos: Ext.encode(hitos),
                numerojson: Ext.encode(win.numerojson),
                documentojson: Ext.encode(win.documentojson),
                delfile: Ext.encode(docForm.getRemovedRecords()),
                editfile: Ext.encode(docForm.getModifiedRecords()),
                objetosuplemento: objetosuplemento,
                vehiculos: Ext.encode(vehiculos),
                clientesasociados: Ext.encode(clientesAsociados),
                html: win.down('#tinyproformacontrato').getValue()
                // hitosadicionales: Ext.encode(hitosadicionales)
            });
            Ext.MessageBox.show({
                msg: me.etiquetas.lbGuardando,
                width: 300,
                wait: true,
                waitConfig: {interval: 200}
            });
            docForm.submit({
                url: UtilsFn.buildUrl({action: 'updatecontrato'}, this),
                params: params,
                submitEmptyText: false,
                // waitMsg: me.etiquetas.lbGuardando,
                success: function (form, action) {
                    Ext.MessageBox.hide();
                    var response = Ext.decode(action.response.responseText);
                    if (response.code == -3) {
                        mostrarMensaje(1, me.etiquetas.msgErrorConnectionAlfresco);
                        return;
                    } else if (response.identificadorNodoPadre == 0) {
                        mostrarMensaje(1, me.etiquetas.msgErrorExisteDocumento);
                        return;
                    }

                    if (response.modificadoEx) {
                        mostrarMensaje(1, (win.suplemento ? me.etiquetas.msgSuplementoEditEx : me.etiquetas.msgContratoEditEx));
                    } else if (response.noexiste) {
                        mostrarMensaje(1, (win.suplemento ? me.etiquetas.msgSuplementoBorradoEx : me.etiquetas.msgContratoBorradoEx));//todo preguntar si desea conservar el contrato borrado
                    } else {
                        mostrarMensaje(1, (win.suplemento ? me.etiquetas.msgSuplementoEdit : me.etiquetas.msgContratoEdit));
                    }
                    if (win.grid) win.grid.getStore().load();
                    // grid.getStore().load();
                    win.destroy();
                },
                failure: function () {
                    Ext.MessageBox.hide();
                }
            });
        }
    },

    createElement: function (fieldSet, value) {
        var me = this,
            win = me.getCo_mainwindowContratacion(),
            form = win.customForm,
            expression = new RegExp("idelemento\=\"\\d+\"", "gi"),
            expression2 = new RegExp("\\d+", "gi"),
            ids = value.match(expression),
            mask = new Ext.LoadMask(win.el, {
                msg: me.etiquetas.msgLoading
            });
        fieldSet.htmlvalue = value;
        mask.show();
        for (var i in ids) {
            ids[i] = ids[i].match(expression2)[0];
        }
        Ext.Ajax.request({
            params: {
                idtipocontrato: parseInt(win.hftipocontrato.getValue())
            },
            url: UtilsFn.buildUrl({action: 'getElementoContrato'}, me),
            callback: function (options, success, response) {
                var config = Ext.decode(response.responseText).data;
                mask.hide();
                fieldSet.removeAll();
                var xtype = 'textfield';
                for (var i in ids) {
                    for (var k in config) {
                        var cmp = config[k];
                        if (ids[i] == cmp.idelemento) {
                            xtype = cmp.mextype || xtype;
                            cmp.xtype = xtype;
                            if (cmp.tipo == 'container') {
                                cmp.title = cmp.denominacion;
                            } else {
                                cmp.fieldLabel = cmp.denominacion;
                                cmp.name = cmp.denominacion;
                                cmp.allowBlank = cmp.obligatorio == "true" ? false : cmp.obligatorio == "false" ? true : !cmp.obligatorio;
                            }
                            if (xtype == 'htmleditor') {
                                cmp.enableVar = false;
                                cmp.enableSourceEdit = false;
                            }
                            fieldSet.add(form.createCmp(cmp));
                        }
                    }
                }
                me.setValueByClass();
            }
        });
        if (ids && ids.length > 0) {
            fieldSet.expand();
        } else {
            fieldSet.collapse();
        }
    },

    getElements: function (items, htmlvalue) {
        for (var k in items) {
            if (items[k].getValue()) {
                var element = items[k],
                    //expression = new RegExp("\<span\\s+class\=\"editor\-element\"\\s+idelemento\=\"" + element.idelemento + "\"\>(?:\\w|\\s)+\<\/span\>", "gi");
                    expression = new RegExp("\<span(class\=\"editor\-element\"|\\s|contenteditable=\"false\")*idelemento\=\"" + element.idelemento + "\"(class\=\"editor\-element\"|\\s|contenteditable=\"false\")*\>(?:\\w|\\s)+\<\/span\>", "gi");
                htmlvalue = htmlvalue.replace(expression, element.getValue());
            }
        }
        return htmlvalue;
    },

    beforeShowWin: function (win, eOpts) {
        var me=this;
        if (!win.suplemento) {
            if (win.tipocontrato == 'contratoMarco') {
                win.title = win.title + win.etiquetas.lbmarco;
            }
        } else {
            win.title = win.addsuplemento ? win.etiquetas.lbCreateSuplement : win.etiquetas.lbModSuplemento
        }
        win.title = win.title + ' (' + (win.context == 'cliente' ? win.etiquetas.lbCliente : win.etiquetas.lbProveedor) + ')';
        me.busquedas=[];
    },

    winShow: function (win, eOpts) {
        var self = this;
        var form = win.down('customform'),
            FormaPagoform = win.formaPago,
            formDynamic = win.formDynamic;
        this.activeWindows = true;

        form.on('validitychange', function (yo, valid) {
            self.checkWindow(win);
        });
        FormaPagoform.on('validitychange', function (yo, valid) {
            self.checkWindow(win);
        });
        formDynamic.on('validitychange', function (yo, valid) {
            self.checkWindow(win);
        });
        win.objetosuplemento.on('validitychange', function (yo, valid) {
            self.checkWindow(win);
        });
        win.docForm.on('validitychange', function (yo, valid) {
            self.checkWindow(win);
        });
        form.on('dirtychange', function (yo, valid) {
            self.checkWindow(win);
        });
        FormaPagoform.on('dirtychange', function (yo, valid) {
            self.checkWindow(win);
        });
        formDynamic.on('dirtychange', function (yo, valid) {
            self.checkWindow(win);
        });
        win.objetosuplemento.on('dirtychange', function (yo, valid) {
            self.checkWindow(win);
        });
        win.docForm.on('dirtychange', function (yo, valid) {
            self.checkWindow(win);
        });
        if(!win.numero_manual)
            this.getParamsFormatNumber((win.action=='add'/* || win.suplemento*/)?this.generateNumber:null);
        // this.getParamsFormatNumber(this.generateNumber);
    },

    hideWin: function (win, eOpts) {
        var me=this;
        this.activeWindows = false;
        me.busquedas=[];
    },

    checkWindow: function (win) {
        if (this.activeWindows) {
            var bForm = win.down('customform').getForm(),
                invalid = bForm.hasInvalidField(),
                change = bForm.isDirty(),
                FormaPagoform = win.formaPago.getForm(),
                invalidFormaPago = FormaPagoform.hasInvalidField(),
                changeFormaPago = FormaPagoform.isDirty(),
                invalidDynamic = win.formDynamic.getForm().hasInvalidField(),
                changeDynamic = win.formDynamic.getForm().isDirty(),
                stHito = this.getHitoPago().getStore(),
                changeAnexos = this.getAnexos().isDirty(),
                invalidAnexos = this.getAnexos().hasInvalidField(),
                invalidobjetosuplemento = !win.objetosuplemento.isValid();

            if (win.action == 'edit') {
                invalid = win.formDynamic.items.items[1] ?
                    ((invalid || invalidDynamic || invalidAnexos || invalidFormaPago || invalidobjetosuplemento) ||
                        (!change && !changeDynamic && !changeFormaPago/* && !changeAnexos*/)) :
                    (invalid || invalidAnexos || invalidFormaPago || invalidobjetosuplemento) || (!change && !changeFormaPago/* && !changeAnexos*/);
                win.disableButtons(invalid);
            } else {
                win.disableButtons(win.formDynamic.items.items[1] ? (invalid || invalidDynamic || invalidFormaPago || invalidobjetosuplemento) :
                    (invalid || invalidobjetosuplemento));
            }
        } else {
            return false;
        }
    },

    changeSelectField: function (selectField, newValue, oldValue, eOpts) {
        var me = this;

        if (!newValue) {
            switch (selectField.context) {
                case 'gestioncontratomainwindowcontrato':
                    me.getCo_mainwindowContratacion().hftipocontrato.reset();
                    break;
                case 'gestioncontratomainwindowproforma':
                    var win = me.getCo_mainwindowContratacion(),
                        form = win.formDynamic;
                    console.log(newValue)
                    if(!newValue || newValue==''){
                        console.log('entra', win.down('#tinyproformacontrato'))
                      //  win.down('#tinyproformacontrato').activeEditor.setDisabled(true);
                        win.down('#tinyproformacontrato').setValue('');
                        win.down('#contenidoproforma').setDisabled(true);
                     //   win.down('#tinyproformacontrato').container.setDisabled(true);
                     //   win.down('#tinyproformacontrato').setReadOnly(true);
                    }
                    break;
                case 'gestioncontratomainwindowclienteproveedor':
                    me.getCo_mainwindowContratacion().hfclienteproveedor.reset();
                    break;
            }
        }
    },

    changeValueSelect: function (hiddenField, newValue, oldValue, eOpts) {
        // console.log('changeValueSelect:', hiddenField.name, newValue)
        var win = this.getCo_mainwindowContratacion();
        switch (hiddenField.context) {
            case 'gestioncontratomainwindowcontrato'://todo arreglar la forma de todo el bloque

                if (!newValue || (newValue && oldValue && (newValue != oldValue))) {
                    win.hfproforma.reset();
                    win.sfproforma.reset();
                    win.sfproforma.filters = {
                        idtipocontrato: parseInt(win.hftipocontrato.getValue()),
                        marco: win.tipocontrato == 'contratoMarco'
                    };
                    win.sfproforma.defaultValues = [
                        {
                            field: 'idtipocontrato',
                            value: parseInt(win.hftipocontrato.getValue()),
                            disabled: false
                        }, {
                            field: 'DatTipoContrato.denominacion',
                            value: win.sftipocontrato.getValue(),
                            disabled: true
                        },
                        {
                            field: 'marco',
                            value: win.tipocontrato == 'contratoMarco',
                            disabled: win.tipocontrato == 'contratoMarco'
                        }
                    ];
                    win.sfproforma.setDisabled(!newValue);
                    //win.sfproforma.reset();
                    try {
                        // win.hfcontratomarco.reset();
                        // win.sfcontratomarco.reset();
                        // win.sfcontratomarco.filters = {
                        //     'c.idtipocontrato': parseInt(win.hftipocontrato.getValue()),
                        //     'contratomarco': true
                        // };
                        // win.sfcontratomarco.setDisabled(!newValue);
                        if (newValue) {
                            // if (!win.sfcontratomarco.hidden) {
                            //     win.sfcontratomarco.getStore().load();
                            // }
                            if (!win.sfproforma.hidden) {
                                win.sfproforma.getStore().load();
                            }
                        }
                        //win.sfcontratomarco.reset();
                    } catch (e) {

                    }
                    var form = win.formDynamic;
                    if (form.items.items[1]) {
                        //form.hide();
                        form.items.items[1].destroy();
                        /* if (!win.maximized) {
                         win.setHeight(475);
                         }
                         win.center();*/
                    }
                } else {
                    win.hfproforma.reset();
                    win.sfproforma.reset();
                    win.sfproforma.filters = {
                        idtipocontrato: parseInt(win.hftipocontrato.getValue()),
                        marco: win.tipocontrato == 'contratoMarco'
                    };
                    win.sfproforma.defaultValues = [
                        {
                            field: 'idtipocontrato',
                            value: parseInt(win.hftipocontrato.getValue()),
                            disabled: false
                        }, {
                            field: 'DatTipoContrato.denominacion',
                            value: win.sftipocontrato.getValue(),
                            disabled: true
                        },
                        {
                            field: 'marco',
                            value: win.tipocontrato == 'contratoMarco',
                            disabled: win.tipocontrato == 'contratoMarco'
                        }
                    ];
                    win.sfproforma.setDisabled(false);
                    if (!win.sfproforma.hidden) {
                        win.sfproforma.getStore().load();
                    }
                    // try {
                    // win.hfcontratomarco.reset();
                    // win.sfcontratomarco.reset();
                    // win.sfcontratomarco.filters = {
                    //     'c.idtipocontrato': parseInt(win.hftipocontrato.getValue()),
                    //     'contratomarco': true,
                    //     'cliente': win.context == 'cliente'
                    // };
                    // win.sfcontratomarco.setDisabled(false);
                    // if (!win.sfcontratomarco.hidden) {
                    //     win.sfcontratomarco.getStore().load();
                    // }
                    // } catch (e) {
                    //
                    // }
                }
                break;
            case 'changeclienteproveedor':
                 //console.log(win.sfclienteproveedor.getValue());
                // if (!newValue || (newValue && oldValue && (newValue != oldValue))) {
				//alert('yismellllllllllllllllll');
				//win.sfsector.setValue(win.sfclienteproveedor.getValue());
                win.hfcontratomarco.reset();
                win.sfcontratomarco.reset();
                win.sfcontratomarco.filters = {
                    'c.idclienteproveedor': parseInt(newValue),
                    'contratomarco': true,
                    'cliente': win.context == 'cliente'
                };
				
				/*win.sfsector.filters = {
                    'idclienteproveedor': parseInt(newValue)
                };*/
				
                win.sfcontratomarco.setDisabled(!newValue);
                if (newValue && !win.sfcontratomarco.hidden) {
                    win.sfcontratomarco.getStore().load();
                }
                if (!win.nombre.modNombre) {
                    win.nombre.setValue(win.sfclienteproveedor.getValue());
                }
                if (this.application.contabilidad && newValue) {
                    // me.cargarDatosDeudaClienteProveedor();
                    Ext.Ajax.request({
                        url: UtilsFn.buildUrl({action: 'comprobarDeudaClienteProveedor'}, this),
                        params: {
                            idclienteproveedor: Ext.encode([parseInt(newValue)])
                        },
                        success: function (response) {
                            var response = Ext.decode(response.responseText);
                            win.buscadaDeudaClienteProveedor = true;
                            win.deudaClienteProveedor = response.length;
                        }
                    });
                }
                // }
                break;
        }
    },

    cargarDatosParametros: function(idsvariables){
        var me=this;
        var html = me.getCo_mainwindowContratacion().down('#tinyproformacontrato').getValue(),
            aux=html.split('<span idelemento="'),
            idelementos=[];
        aux.forEach(function(part){
            aux2=part.split('" class="editor-element"');
            if(aux2.length>1){
                idelementos.push(aux2[0]);
            }
        })
        var cargandoDatos=true, conproforma=me.getCo_mainwindowContratacion().down('#contenidoproforma');
        // conproforma.on('render', function(){
        //     if(cargandoDatos){
        //         if(me.getCo_mainwindowContratacion().down('#tinyproformacontrato').initialValue)
        //             me.getCo_mainwindowContratacion().down('#tinyproformacontrato').setValue(me.getCo_mainwindowContratacion().down('#tinyproformacontrato').initialValue);
        //         conproforma.maskL = new Ext.LoadMask(conproforma,
        //             {msg: 'Cargando datos'});
        //         conproforma.maskL.show();
        //     }
        // })
        conproforma.maskL = new Ext.LoadMask(conproforma,
            {msg: 'Cargando datos'});
        conproforma.maskL.show();



        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'obtenerParametrosClases'}, me),
            params: {
                idelementos: Ext.encode(idelementos),
                idsvariables: Ext.encode(idsvariables),
                values: Ext.encode(me.getCo_mainwindowContratacion().down('form').getValues())
            },
            callback: function (options, success, response) {
                if(conproforma.maskL)conproforma.maskL.hide();
                cargandoDatos=false;
                var resultado = Ext.decode(response.responseText),
                    params = response.request.options.params;
                if (resultado['success']) {

                    Ext.Object.each(resultado['data'],function(key, valor){
                        var index = html.indexOf('<span idelemento="' + key + '" class="editor-element" contenteditable="false">');
                        if (index) {
                            var regex = new RegExp('<span idelemento="' + key + '" class="editor-element" contenteditable="false">[\\w\\s\'\"\(\).,-;]+<\/span>', 'g');
                            console.log('resultado', resultado)
                            // console.log('inicial', html)
                            console.log('regex', regex)
                            html = html.replace(regex,
                                '<span idelemento="' + key + '" class="editor-element" contenteditable="false">' + valor + '</span>');
                            // console.log('final:', html)

                        }
                    })
                    me.getCo_mainwindowContratacion().down('#tinyproformacontrato').setValue(html);


                }
            },
            failure: function (response, opts) {
//                                     mask.hide();
            },
        })
    },

    selectValueWindow: function (win, grid, field, arrayRecord) {
        console.log([win, grid, field, arrayRecord]);
        if (field.context == 'gestioncontratomainwindowproforma') {
            var me = this,
                mask = new Ext.LoadMask(me.getCo_mainwindowContratacion().el, {
                    msg: me.etiquetas.msgLoading
                });
            console.log('html')
            me.getCo_mainwindowContratacion().down('#tinyproformacontrato').setValue(arrayRecord[0].get('html'));
            me.getCo_mainwindowContratacion().down('#tinyproformacontrato').initialValue=arrayRecord[0].get('html');
            me.getCo_mainwindowContratacion().down('#contenidoproforma').setDisabled(false);

            // getElementoContrato   obtenerParametrosClases

            Ext.Ajax.request({
                params: {
                    idtipocontrato: arrayRecord[0].data.idtipocontrato,
                },
                url: UtilsFn.buildUrl({action: 'getElementoContrato'}, this),
                callback: function (options, success, response) {
                    var result = Ext.decode(response.responseText);
                    mask.hide();
                    console.log('result>',result)
                    //obtenerParametrosClase
                    // idsvariables=[];
                    //
                    // result.data.forEach(function(x) {
                    //     idsvariables.push({'id':x['idvariable'], 'sql': x['sql']});
                    // })
                    me.getCo_mainwindowContratacion().variables=result.data;
                    me.cargarDatosParametros(result.data);

                }
         //   });


                    // me.addConfig(me.getCo_mainwindowContratacion(), result.data, arrayRecord[0].data);

            });
        } else if (field.context == 'gestioncontratomainwindowclienteproveedor') {
            this.getCo_mainwindowContratacion().hfclienteproveedor.setValue(arrayRecord[0].data.idclientesproveedores);
            this.cliente = arrayRecord[0].data;
 	        this.getCo_mainwindowContratacion().hfsector.setValue(arrayRecord[0].data.idsector);
			this.getCo_mainwindowContratacion().sfsector.setValue(arrayRecord[0].data.sector);
            this.setValueByClass();
            this.getCo_mainwindowContratacion().tabClientesAsociados.getStore().getRange().forEach(function(x){
                var recordToDelete=null;
                if(arrayRecord[0].data.idclientesproveedores==x.get('idclienteproveedor')){
                    recordToDelete=x;
                    mostrarMensaje(8, 'Se ha eliminado '+arrayRecord[0].data.nombre+' de los clientes asociados.');
                }
                if(recordToDelete)me.getCo_mainwindowContratacion().tabClientesAsociados.getStore().remove(recordToDelete);
            })
        }
    },



    selectCombo: function (combo, records) {
        var form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localId);
        console.log('selectCombo:', combo.localId, records[0].data[combo.localId], hiddenField)
        if (hiddenField && records[0].data[combo.localId]) {
            console.log('selectComboChange')
            hiddenField.setValue(records[0].data[combo.localId]);
        }
        if (combo.name == 'nombrearea' && form.getForm().findField('nombrepersona')) {
            // form.getForm().findField('nombrepersona').getStore().clearFilter();
            // form.getForm().findField('nombrepersona').getStore().filter({property:'idarea', 'value':records[0].data[combo.localId]});
            if(Ext.isFunction(form.getForm().findField('nombrepersona').getStore)){
                form.getForm().findField('nombrepersona').getStore().proxy.extraParams = {'idarea': records[0].data[combo.localId]}
                form.getForm().findField('nombrepersona').getStore().load();
            }
        }
    },

    changeCombo: function (combo, value) {
        var form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localId);

        if (hiddenField && Ext.isEmpty(value)) {
            console.log('changeCombo:', combo.localId, hiddenField)
            hiddenField.setValue('');
            if (combo.name == 'nombrearea' && form.getForm().findField('nombrepersona')) {
                // form.getForm().findField('nombrepersona').getStore().clearFilter();
                form.getForm().findField('nombrepersona').getStore().proxy.extraParams = {}
                // form.getForm().findField('nombrepersona').getStore().baseParams='';
                form.getForm().findField('nombrepersona').getStore().load();
            }
        }
    },

    setEndDate: function (yo) {
        var window = yo.up('window'),
            field = window.vigencia,
            cant = field.getValue(),
            ut = window.unidadTiempo.getValue(),
            fecha = window.suplemento?window.fechaFin.originalValue:window.fechafirma.getValue();
        // console.log(window.suplemento, yo.name, cant, ut, fecha, Ext.Date.format(window.fechaFin.getValue(), 'd/m/Y'), Ext.Date.format(window.fechaFin.originalValue, 'd/m/Y'))
        if (yo.name == 'vigencia') {
            window.fechaFin.setReadOnly(cant != null);
            if (cant == null) window.fechaFin.reset();
        }

        // fecha=window.suplemento?window.fechafirma:window.fechafirma;

        if (!fecha || typeof fecha != 'object') {
            // console.log('No hay fecha')
            return;
        }

        if(!window.suplemento || (window.suplemento && (yo.name=='vigencia') || yo.name=='unidadtiempo')){
            // console.log('No es suplemento')
            fecha = [
                fecha.getDate(),
                fecha.getMonth() + 1,
                fecha.getFullYear()
            ];

            if (ut && cant && field.isValid()) {
                if (ut == 3) {
                    fecha[2] += cant;
                } else if (ut == 2) {
                    fecha[1] += cant;
                    if (fecha[1] > 12) {
                        fecha[2] += parseInt(fecha[1] / 12);
                        fecha[1] = fecha[1] % 12;
                    }
                } else {
                    var fecha1 = window.suplemento?window.fechaFin.originalValue:window.fechafirma.getValue();
                    // console.log(Ext.Date.format(fecha1, 'd/m/Y'))
                    fecha1.setDate(fecha1.getDate() + cant);
                    fecha = [
                        fecha1.getDate(),
                        fecha1.getMonth() + 1,
                        fecha1.getFullYear()];
                }
                if (fecha[2] > 9999) {
                    fecha[2] = 9999;
                }
            } else {
                return;
            }
            window.fechaFin.setValue(new Date(fecha[2], fecha[1] - 1, fecha[0]));
        }
    },

    addConfig: function (win, config, recordProforma) {
        var me = this,
            form = win.formDynamic,
            deUnaParte = recordProforma['vendedor_elements'] ? recordProforma['vendedor_elements'] : new Array(),
            deOtraParte = recordProforma['comprador_elements'] ? recordProforma['comprador_elements'] : new Array(),
            ambasPartes = recordProforma['ambos_elements'] ? recordProforma['ambos_elements'] : new Array(),
            anexos = recordProforma['anexos_elements'] ? recordProforma['anexos_elements'] : new Array(),
            clausula = recordProforma['clausulas'] ? recordProforma['clausulas'] : new Array(),
            itemsPanel = new Array();
        try {
            if (form.items.items[1]) {
                //form.hide();
                form.items.items[1].destroy();
            }
        } catch (e) {
            // console.log('no se encontro el paneldel')
        }
        if (recordProforma['vendedor']) {
            itemsPanel = this.searchComponent(itemsPanel, config, deUnaParte, me.etiquetas.titleDeUnaParte, form, recordProforma['vendedor'], 'deUnaParte');
        }
        if (recordProforma['comprador']) {
            itemsPanel = this.searchComponent(itemsPanel, config, deOtraParte, me.etiquetas.titleDeOtraParte, form, recordProforma['comprador'], 'deOtraParte');
        }
        if (recordProforma['ambos']) {
            itemsPanel = this.searchComponent(itemsPanel, config, ambasPartes, me.etiquetas.titleAmbasPartes, form, recordProforma['ambos'], 'ambasPartes');
        }
        if (clausula.length > 0) {
            var itemsFieldSet = new Array();
            for (var i in clausula) {
                itemsFieldSet = this.searchComponent(itemsFieldSet, config, clausula[i].contenido_elements, clausula[i].denominacion, form, clausula[i].contenido, 'clausula')
            }
            if (itemsFieldSet.length > 0) {
                var fieldSet = Ext.create('Ext.ux.ComboFieldSet', {
                    //xtype: 'fieldset',
                    title: me.etiquetas.titleClausulaS,
                    collapsible: true,
                    labelAlign: 'top',
                    layout: 'column',
                    clausula: true,
                    columnWidth: 1,
                    xtypejojo: 'toolbar',
                    otherjojo: true,
                    cfgjojo: {
                        bodyStyle: 'background:#DFE9F6;',
                        border: false,
                        margin: 0,
                        style: "background-color: transparent; background-image: none;",
                        defaults: {
                            width: 19,
                            height: 19
                        },
                        items: [{
                            xtype: 'button',
                            iconCls: 'icondistra-adicionar icon-small',
                            action: 'add',
                            tooltip: this.etiquetas.lbAdd + " " + me.etiquetas.titleClausulaS.toLowerCase()
                        }, {
                            xtype: 'button',
                            iconCls: 'icondistra-eliminar icon-small',
                            action: 'eliminar',
                            tooltip: this.etiquetas.lbEliminarElemento + " " + me.etiquetas.titleClausulaP.toLowerCase()
                        }]
                    },
                    defaults: {
                        bodyStyle: 'background:#DFE9F6;',
                        margin: '0 5 5 5',
                        columnWidth: 1,
                        layout: 'vbox'
                    },
                    items: itemsFieldSet
                });
                itemsPanel.push(fieldSet);
            }
        }
        if (recordProforma['anexos']) {
            itemsPanel = this.searchComponent(itemsPanel, config, anexos, me.etiquetas.titleAnexos, form, recordProforma['anexos'], 'anexos');
        }

        //if (/!*window.parent.UCID.portal.perfil.idreol*!/ "100000000001" == JSON.parse(config[k].compartimentacion)[0]['idrol'] && JSON.parse(config[k].compartimentacion)[0]['visibilidad']) {

        if (itemsPanel.length > 0) {
            var panel = {
                xtype: 'panel',
                labelAlign: 'top',
                bodyStyle: 'background:#DFE9F6;',
                layout: 'column',
                columnWidth: 1,
                border: false,
                id: 'paneldel',
                flex: 1,
                items: itemsPanel
            }, height = 0;
            form.add(panel);

            /*if (!win.maximized) {
             win.setHeight(540);
             }
             win.center();*/
        } else {
            /* if (!win.maximized) {
             win.setHeight(475);
             }
             win.center();*/
            mostrarMensaje(1, me.etiquetas.msgElementosNoExiste);
        }
        win.setAutoScroll(true);
    },

    searchComponent: function (itemsPanel, config, arrayId, myTitle, form, htmlvalue, tipo) {
        var me = this,
            items = new Array();
        for (var i in arrayId) {
            for (var k in config) {
                var cmp = config[k];
                if (arrayId[i] == cmp.idelemento) {
                    items.push(me.getCmp(cmp, form));
                }
            }
        }
        //if (items.length > 0) {
        var fieldSet = Ext.create('Ext.ux.ComboFieldSet', {
            //xtype: 'fieldset',
            title: myTitle,
            collapsible: /*items.length > 0*/true,
            collapsed: items.length == 0,
            labelAlign: 'top',
            layout: 'column',
            columnWidth: 1,
            htmlvalue: htmlvalue,
            tipo: tipo,
            xtypejojo: 'toolbar',
            otherjojo: true,
            cfgjojo: {
                bodyStyle: 'background:#DFE9F6;',
                border: false,
                margin: 0,
                style: "background-color: transparent; background-image: none;",
                defaults: {
                    width: 19,
                    height: 19
                },
                items: [
                    {
                        xtype: 'button',
                        iconCls: 'icondistra-vistaprevia icon-small',
                        action: 'vistaprevia',
                        tooltip: this.etiquetas.lbVistaPrevia + " " + myTitle.toLowerCase()
                    }, {
                        xtype: 'button',
                        iconCls: 'icondistra-modificar icon-small',
                        action: 'modificar',
                        tooltip: this.etiquetas.lbModificarElemento + " " + myTitle.toLowerCase()
                    }, {
                        xtype: 'button',
                        iconCls: 'icondistra-eliminar icon-small',
                        action: 'eliminar',
                        tooltip: this.etiquetas.lbEliminarElemento + " " + myTitle.toLowerCase()
                    }
                ]
            },
            defaults: {
                bodyStyle: 'background:#DFE9F6;',
                margin: '0 5 5 5',
                columnWidth: 0.5,
                layout: 'hbox',
                border: false
            },
            items: items
        });
        itemsPanel.push(fieldSet);
        me.setValueByClass();
        //}
        return itemsPanel;
    },

    getCmp: function (cmp, form) {
        var xtype = cmp.mextype || 'textfield',
            me=this,
            idclienteproveedor=me.getCo_mainwindowContratacion().down('form').getForm().findField('idclienteproveedor').getValue();
        cmp.xtype = xtype;
        if (cmp.tipo == 'container') {
            cmp.title = cmp.denominacion;
        } else {
            cmp.fieldLabel = cmp.denominacion;
            cmp.name = cmp.denominacion;
            cmp.originalValue = cmp.value;
            cmp.allowBlank = cmp.obligatorio == "true" ? false : cmp.obligatorio == "false" ? true : !cmp.obligatorio;
        }
        if (xtype == 'htmleditor') {
            cmp.enableVar = false;
            cmp.enableSourceEdit = false;
        }
        if (cmp.cfg && !Ext.Object.isEmpty(Ext.isObject(cmp.cfg) ? cmp.cfg : Ext.decode(cmp.cfg))) {
            var cfg = Ext.isObject(cmp.cfg) ? cmp.cfg : Ext.decode(cmp.cfg);
            for (var i in cfg) {
                if (i == 'maskRe' || i == 'regex') {
                    cmp[i] = new RegExp(cfg[i]);
                } else {
                    cmp[i] = cfg[i] == 'true' ? true : cfg[i] == 'false' ? false : cfg[i];
                }
            }
        }
        if (cmp.event && !Ext.Object.isEmpty(Ext.isObject(cmp.event) ? cmp.event : Ext.decode(cmp.event))) {
            var event = Ext.isObject(cmp.event) ? cmp.event : Ext.decode(cmp.event),
                object = new Object();
            for (var i in event) {
                object[i] = Ext.decode(event[i]);
            }
            cmp['listeners'] = object;
        }
        cmp = form.createCmp(cmp)
        if (cmp.fuente) {
//             console.log(cmp.fuente)
            if (this.dataDynamicElement[cmp.fuente.clase +'-'+ cmp.fuente.campo +'-'+ idclienteproveedor]) {
                var result = this.dataDynamicElement[cmp.fuente.clase +'-'+ cmp.fuente.campo +'-'+ idclienteproveedor];
                if (result && result.length) {
                    if (cmp.store) {
                        cmp.store = Ext.create('Ext.data.Store', {
                            fields: ['text'],
                            data: result
                        });
                        cmp.initComponent();
                    }
                    cmp.setValue(result[0]['text']);
                }
            } else {
                var me = this;
                cmp.fuente = Ext.isObject(cmp.fuente) ? cmp.fuente : Ext.decode(cmp.fuente);

                if (cmp.fuente.idsselection || cmp.store) {
                    Ext.Ajax.request({
                        url: UtilsFn.buildUrl({action: 'cargardatoselemento'}, me),
                        params: {
                            clase: cmp.fuente.clase,
                            campo: cmp.fuente.campo,
                            tablename: cmp.fuente.tablename,
                            ruta: cmp.fuente.ruta,
                            campowhere: cmp.fuente.campowhere,
                            idsselection: Ext.encode(cmp.fuente.idsselection),
                            idcliente: idclienteproveedor
                        },
                        success: function (response, opts) {
                            var result = Ext.decode(response.responseText),
                                params=response.request.options.params;
                            me.dataDynamicElement[params['clase'] +'-'+ params['campo'] +'-'+ params['idcliente']] = result;
                            if (result && result.length) {
                                if (cmp.store) {
                                    cmp.store = Ext.create('Ext.data.Store', {
                                        fields: ['text'],
                                        data: result
                                    });
                                    cmp.initComponent();
                                }
                                cmp.setValue(result[0]['text']);
                            }
                        },
                        failure: function (response, opts) {

                        }
                    });
                }
            }
        }
        return cmp;
    },

    getElParent: function (id) {
        return Ext.ComponentQuery.query('[idelemento=' + id + ']')[0];
    },

    getHitos: function () {
        var grid = this.getHitoPago(),
            store = this.getHitoPago().getStore(),
            cant = store.getCount(),
            records = this.getHitoPago().getStore().getRange(0, cant - 1),
            modificados = [],
            eliminados = [];
        Ext.each(store.getNewRecords(), function (valor) {
            //valor.data.indicadores = null;
            modificados.push(valor.data);
        });
        Ext.each(store.getModifiedRecords(), function (valor) {
           // valor.data.indicadores = null;
            if (modificados.indexOf(valor.data) == -1)
                modificados.push(valor.data);
        });
        Ext.each(store.removedRecords, function (valor) {
            eliminados.push(valor.get('idhito'));
        });

        return {
            modificados: modificados,
            eliminados: eliminados
        }
    },

    getHitosDatosAdicionales: function () {
        var modificados = [];
        if(this.getTabHitosAdicional()){
            var grid = this.getTabHitosAdicional().down('#gridhitosadicional'),
                store = grid.getStore(),
                cant = store.getCount(),
                records = store.getRange(0, cant - 1);

            Ext.each(store.getNewRecords(), function (valor) {
                //valor.data.indicadores = null;
                modificados.push(valor.data);
            });
            // console.log('modified:', store.getModifiedRecords())
            Ext.each(store.getModifiedRecords(), function (valor) {
                // valor.data.indicadores = null;
                if (modificados.indexOf(valor.data) == -1)
                    modificados.push(valor.data);
            });
        }
        return modificados;
    },

    getProductos: function () {
        var grid = this.getProducto(),
            store = this.getProducto().getStore(),
            cant = store.getCount(),
            records = store.getRange(),
            modificados = new Array(),
            eliminados = new Array();
        Ext.each(store.getNewRecords(), function (valor) {
            modificados.push(valor.data);
        })
        Ext.each(store.getModifiedRecords(), function (valor) {
            if (modificados.indexOf(valor.data) == -1) {
                var cloneRecord = valor.copy();
                Ext.data.Model.id(cloneRecord);
                cloneRecord.data.datos_json = Ext.decode(cloneRecord.data.datos_json);
                modificados.push(cloneRecord.data);
            }

        })
        Ext.each(store.getRemovedRecords(), function (valor) {
            eliminados.push(valor.get('idindicadorcontrato'));
        })
        if (grid.datosLoad.length != cant) {
            Ext.each(grid.datosLoad, function (valor) {
                var exist = false;
                Ext.each(store.getRange(), function (valor2) {
                    // console.log('aoaoo', valor.idindicadorcontrato, '-', valor2.data.idindicadorcontrato, '=', valor2)
                    if (valor.idindicadorcontrato == valor2.data.idindicadorcontrato) {
                        exist = true;
                    }
                })
                if (!exist) eliminados.push(valor.idindicadorcontrato);
            })
        }
        // console.log('proddd', eliminados)
        // Ext.each(records, function (item) {
        //     if (item.dirty) {
        //         productos.push(item.data);
        //     }
        // }, this);
        return {
            eliminados: eliminados,
            guardados: modificados
        };
    },

    getVehiculos: function () {
        var grid = this.getVehiculo(),
            store = this.getVehiculo().getStore(),
            nuevos=[], eliminados=[];
        // console.log('store:', store.getRemovedRecords())
        // store.data.items.forEach(function(x){
        //     vehiculos+=x.get('idvehiculocontrato')+','
        // });
        // return vehiculos.substring(0, vehiculos.length-1)
        Ext.each(store.getRange(), function (valor) {
            if(!valor.get('idvehiculocontrato'))
                nuevos.push({'idindicador': valor.get('idindicador')});
        });
        // Ext.each(store.getRemovedRecords(), function (valor) {
        //     if(valor.get('idvehiculocontrato'))
        //         eliminados.push(valor.get('idvehiculocontrato'));
        // });
        // console.log(nuevos, store.idEliminados)
        // console.log({nuevos: nuevos, eliminados: store.idEliminados})
        return {nuevos: nuevos, eliminados: store.idEliminados};
    },
    getImplicadas: function () {
       var grid = this.getCo_mainwindowContratacion().down('#gridareasimplicadas'),
            store = grid.getStore(),
            cant = store.getCount(),
            records = store.getRange(),
            modificados = new Array();

        Ext.each(store.getNewRecords(), function (valor) {
            modificados.push(valor.data);
        })
        
         return modificados;
     },
     getClientesAsociados: function () {
        var grid = this.getCo_mainwindowContratacion().down('#gridclientesasociados'),
            store = grid.getStore(),
            cant = store.getCount(),
            records = store.getRange(),
            modificados = new Array(),
            eliminados = new Array();
        //console.log('grid:', grid)
        //console.log('a:', store.getRange())
        //console.log('n:', store.getNewRecords())
        //console.log('m:', store.getModifiedRecords())
        //console.log('r:', store.getRemovedRecords())
        Ext.each(store.getRange(), function (valor) {
            modificados.push(valor.data);
        })
        // Ext.each(store.getRemovedRecords(), function (valor) {
        //     eliminados.push(valor.get('idcontratoclienteasociado'));
        // })
        // return {
        //     modificados: modificados,
        //     eliminados: eliminados
        // }
        return modificados;
    },

    getMoras: function () {
        var grid = this.getGridMora(),
            store = this.getGridMora().getStore(),
            cant = store.getCount(),
            records = this.getGridMora().getStore().getRange(0, cant - 1),
            modificados = [],
            eliminados = [];
        Ext.each(store.getNewRecords(), function (valor) {
            modificados.push(valor.data);
        });
        Ext.each(store.getModifiedRecords(), function (valor) {
            if (modificados.indexOf(valor.data) == -1)
                modificados.push(valor.data);
        })
        Ext.each(store.getRemovedRecords(), function (valor) {
            eliminados.push(valor.get('idmora'));
        })
        if (grid.datosLoad.length != cant) {
            Ext.each(grid.datosLoad, function (valor) {
                var exist = false;
                Ext.each(store.getRange(), function (valor2) {
                    // console.log('aoaoo', valor.idhito, '-', valor2.data.idhito, '=', valor2)
                    if (valor.idmora == valor2.data.idmora) {
                        exist = true;
                    }
                });
                if (!exist) eliminados.push(valor.idmora);
            })
        }

        return {
            // nuevos: store.getNewRecords(),
            modificados: modificados,
            eliminados: eliminados
        }
    },

    generateNumber: function (field, value, event) {
        console.info('Listener', field, value, event)
        var me = this,
            window = me.getCo_mainwindowContratacion(),
            params = {},
            action = 'generarNumero';

        this.setNumeroParametro(field, value);

        // if (!window.numeroparametros) {
        //     window.numeroparametros = {};
        //     window.numeroparametros.cliente = window.context == 'cliente' ? 1 : 2;
        // }
        // if (window.tipocontrato == 'contratoMarco') {
        //     window.numeroparametros.marco = 0;
        // }
        // if (window.tipocontrato == 'contrato') {
        //     window.numeroparametros.marco = window.hfcontratomarco.getValue() || null;
        //     window.numeroparametros.especifico = 0;
        // }
        // if (window.suplemento) {
        //     if (window.tipocontrato == 'contratoMarco') {
        //         window.numeroparametros.marco = record.data.idcontratooriginal || record.data.idcontrato || null;
        //     } else {
        //         window.numeroparametros.marco = window.hfcontratomarco.getValue() || null;
        //         window.numeroparametros.especifico = record.data.idcontratooriginal || record.data.idcontrato || null;
        //     }
        //     window.numeroparametros.suplemento = 0;
        // }
        //
        // if (field) {
        //     if (field.valuetosearch && Ext.isArray(value)) {
        //         var record = value[0],
        //             value = record.data[field.valuetosearch];
        //         if (value) {
        //             window.numeroparametros[field.name + '.' + field.valuetosearch] = value;
        //         }
        //     } else {
        //         window.numeroparametros[field.name] = field.getValue();
        //     }
        // }

        params.numeroparametros = Ext.encode(window.numeroparametros);
        params.contratodestino = window.context == 'cliente' ? 2 : 3;
        if (window.action != 'add' || window.addsuplemento) {
            if (!window.numerojson) {
                return;
            }
            action = 'modificarNumero';
            params.numero = Ext.encode(window.numerojson.numero)
        }

        // var maskButton = new Ext.LoadMask(window.btnAceptar,
        //     {msg: this.etiquetas.lbBtnAccept});
        // maskButton.show();
        // if(window.action!='edit') {
            var mask = new Ext.LoadMask(window.numero.el,
                {msg: this.etiquetas.msgGenerandoNumero});
            mask.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: action}, this),
                params: params,
                success: function (response) {
                    // mask.hide();
                    // if(window.action=='edit')maskButton.hide();
                    var response = Ext.decode(response.responseText);

                    if (window.action == 'add') {
                        window.numerojson = {
                            numero: response,
                            suplemento: 0
                        };
                        window.numero.setValue(response.join(''));
                        window.numero.resetOriginalValue();
                    } else {
                        window.numerojson.numero = response;
                        var suplemento = window.numerojson.suplemento,
                            suplemento = suplemento ? '/' + suplemento : '';

                        window.numero.setValue(response.join('') + suplemento);
                        window.numero.resetOriginalValue();
                    }
                },
                // failure:function(){
                //     mask.hide();
                //     maskButton.hide();
                // },
                callback: function () {
                    mask.hide();
                    // maskButton.hide();
                }
            });
        // }
    },

    setNumeroParametro: function (field, value) {
        console.log('setNumeroParametro:', value, field)
        var me = this,
            window = me.getCo_mainwindowContratacion(),
            grid = window.grid,
            record = grid.getSelectionModel().getSelection()[0];
        console.log('window.numeroparametros:', window.numeroparametros)
        console.log('window.tipocontrato:', window.tipocontrato)
        console.log('window.suplemento:', window.suplemento)
        if (!window.numeroparametros) {
            window.numeroparametros = {};
            window.numeroparametros.cliente = window.context == 'cliente' ? 1 : 2;
        }
        if (window.tipocontrato == 'contratoMarco') {
            window.numeroparametros.marco = 0;
        }

        if (window.tipocontrato == 'contrato') {
            window.numeroparametros.marco = window.hfcontratomarco.getValue() || null;
            window.numeroparametros.especifico = 0;
        }

        if (window.suplemento) {
            if (window.tipocontrato == 'contratoMarco') {
                window.numeroparametros.marco = record.data.idcontratooriginal || record.data.idcontrato || null;
            } else {
                window.numeroparametros.marco = window.hfcontratomarco.getValue() || null;
                window.numeroparametros.especifico = record.data.idcontratooriginal || record.data.idcontrato || null;
            }
            window.numeroparametros.suplemento = 0;
        }

        if (me.cmpsnumerocontrato && me.cmpsnumerocontrato.length!=0) {
            for(k in me.cmpsnumerocontrato){
                var field = me.cmpsnumerocontrato[k];
                console.log('->', field.name, window.numeroparametros[field.name], field.getValue())
                if (field.valuetosearch) {
                    var record = Ext.isArray(value) ? value[0]:null,
                        name = field.name + '.' + field.valuetosearch;
                    if (record) {
                        window.numeroparametros[name] = record.data[field.valuetosearch];
                    }else{
                        var oldvalue = window.numeroparametros[name],
                            value1 = me.findValuePartNumber(name);
                        window.numeroparametros[name] = value1 ? value1 : oldvalue;
                    }
                } else {
                    var value1 = field.getValue();
                    window.numeroparametros[field.name] = field.getValue();
                }
            }
        }
        console.log('window.numeroparametros:', window.numeroparametros)

        /*if (field) {
            if (field.valuetosearch && Ext.isArray(value)) {
                var record = value[0],
                    value = record.data[field.valuetosearch];
                if (value) {
                    window.numeroparametros[field.name + '.' + field.valuetosearch] = value;
                }
            } else {
                window.numeroparametros[field.name] = field.getValue();
            }
        }*/
    },

    findValuePartNumber:function(name){
        var me = this,
            window = me.getCo_mainwindowContratacion();
        if (window.elementosnumcont && window.numerojson && window.numerojson.numero && (window.elementosnumcont.length == window.numerojson.numero.length)) {
            for(var k in window.elementosnumcont) {
                var element = window.elementosnumcont[k],
                    tempname = element['nombreparametro'];
                if(tempname == name){
                    return window.numerojson.numero[k];
                }
            }
        }
    },

    getParamsFormatNumber: function (fn) {
        var me = this,
            window = me.getCo_mainwindowContratacion(),
            action = 'getElementosNumeroContrato';
        // var mask = new Ext.LoadMask(window.numero.el,
        //     {msg: this.etiquetas.msgGenerandoNumero});
        // mask.show();
        // if (window.action == 'edit') {
        //     var maskButton = new Ext.LoadMask(window.btnAceptar,
        //         {msg: this.etiquetas.lbBtnAccept});
        //     maskButton.show();
        // }
        Ext.Ajax.request({
            params: {
                contratodestino: window.context == 'cliente' ? 2 : 3
            },
            url: UtilsFn.buildUrl({action: action}, this),
            success: function (response) {
                // mask.hide();
                // if(window.action=='edit')maskButton.hide();
                var response = window.elementosnumcont = Ext.decode(response.responseText);
                if (response) {
                    me.createListener(response);
                }
                if (fn && typeof fn == 'function') {
                    fn.call(me);
                }
            },
            // failure:function(){
            //     mask.hide();
            //     maskButton.hide();
            // },
            callback: function () {
                // mask.hide();
                // if (window.action == 'edit') maskButton.hide();
            }
        });
    },

    createListener: function (params) {
        var me = this,
            combostype = ['combo', 'combobox', 'cmbselectfield'];

        me.cmpsnumerocontrato = new Array();
        console.log('cliente:', params)
        if (params.length != 0) {
            for (k in params) {
                if (params[k]['nombreparametro']) {
                    var split = params[k]['nombreparametro'].split('.'),
                        name = split[0],
                        value = split[1];

                    if (name) {
                        var cmp = Ext.ComponentQuery.query('co_mainwindowContratacion [name=' + name + ']')[0];
                        if (cmp) {
                            console.log(cmp.xtype, combostype)
                            var event = combostype.indexOf(cmp.xtype) != -1 ? 'select' : 'change';
                            cmp.valuetosearch = value;
                            console.log('creado listener:', event, name, cmp)
                            cmp.addListener(event, function(field,valor){console.log('event '+event, field, valor);me.generateNumber(field,valor)}, me);
                            me.cmpsnumerocontrato.push(cmp);
                        }
                    }
                }
            }
        }
        console.log('me.cmpsnumerocontrato:', me.cmpsnumerocontrato)
    },

    showFile: function (btn) {
        var me = this,
            idfile = btn.up('panel[rowDocument=true]').down('fileuploadfield').idfile;
        urlfile = btn.up('panel[rowDocument=true]').down('fileuploadfield').urlfile;
        nombre = btn.up('panel[rowDocument=true]').down('fileuploadfield').nombre;
        //console.log('urlfile2:', urlfile)
        if (urlfile) {
            // window.open(urlfile);
            window.open('/crm/contratacion/index.php/gestioncontrato/getDocumentos?idnodo='+idfile);
            /*Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'getArchivo'}, me),
                params: {
                    // path: url,
                    idnodo: idfile,
                    nombre: nombre
                },
                success: function (response) {
                    console.info('funciono');
                },
                failure: function (response) {
                    console.info('pos no');
                },
            });*/
        } else {
            mostrarMensaje(1, this.etiquetas.msgErrorNoFile);
        }
    },

    getHitosCurrentValue: function () {
        return Ext.encode(this.getHitos());
    },

    setValueByClass: function () {
        var me=this, idclienteproveedor=me.getCo_mainwindowContratacion().down('form').getForm().findField('idclienteproveedor').getValue();
        var cmps = Ext.ComponentQuery.query('[fuente]');
        if (cmps.length == 0) {
            return;
        }

        cont=0
        for (k in cmps) {
            cont++;
            if (!cmps[k].fuente.idsselection && !cmps[k].store) {
                var fuente = cmps[k].fuente;
                if (typeof fuente != 'object') {
                    fuente = Ext.decode(fuente);
                }
                if (fuente.clase == 'DatEstructura') {
                    cmps[k].setValue(this.application.estructura[fuente.campo])
                } else if (this.cliente && fuente.clase == 'NomClienteproveedor') {
                    cmps[k].setValue(this.cliente[fuente.campo])
                }else{
                    if(me.dataDynamicElement[cmps[k].fuente.clase +'-'+ cmps[k].fuente.campo +'-'+ idclienteproveedor]){
                        cmps[k].setValue(me.dataDynamicElement[cmps[k].fuente.clase +'-'+ cmps[k].fuente.campo +'-'+ idclienteproveedor]);
                    }else{
                        if(me.busquedas.indexOf(cmps[k].fuente.clase +'-'+ cmps[k].fuente.campo +'-'+ idclienteproveedor)==-1 && idclienteproveedor && !cmps[k].fuente.idsselection){
                            
                            me.busquedas.push(cmps[k].fuente.clase +'-'+ cmps[k].fuente.campo +'-'+ idclienteproveedor);
//                             var mask = new Ext.LoadMask(cmps[k], {msg: 'me.etiquetas.msgLoading'});
//                             mask.show();
                            Ext.Ajax.request({
                                url: UtilsFn.buildUrl({action: 'obtenerParametrosClases'}, me),
                                params: {
                                    clase: cmps[k].fuente.clase,
                                    campo: cmps[k].fuente.campo,
                                    tablename: cmps[k].fuente.tablename,
                                    ruta: cmps[k].fuente.ruta,
                                    campowhere: cmps[k].fuente.campowhere,
                                    idclienteproveedor: idclienteproveedor,
                                    idcampotexto: cmps[k].id
        //                             idsselection: Ext.encode(cmps[k].fuente.idsselection)
                                },
                                success: function (response, opts) {
//                                     mask.hide();
                                    var result = Ext.decode(response.responseText),
                                        params=response.request.options.params;
                                    if(result['success']){
                                        me.dataDynamicElement[params['clase'] + params['campo'] + params['idclienteproveedor']]=result['valor'];
                                        if(Ext.getCmp(params['idcampotexto']))
                                            Ext.getCmp(params['idcampotexto']).setValue(result['valor']);
                                    }else{
//                                         me.dataDynamicElement[params['clase'] + params['campo'] + params['idclienteproveedor']]='';
                                        // mostrarMensaje(7, result['msg']);
                                    }
                                },
                                failure: function (response, opts) {
//                                     mask.hide();
                                },
                            });
                        }
                    }
                }
            }
        }
    },

    changeFileUploadDocumento: function (field, value) {
        var me = this,
            row = field.up('panel[rowDocument=true]'),
            btnDelete = row.down('button[action=delfile]'),
            textfield = row.down('textfield');

        btnDelete[(value) ? 'show' : 'hide']();
        textfield.allowBlank = false;
        if (!textfield.getValue()) {
            textfield.markInvalid(textfield.blankText);
        }

        if (value)
            field.up('form').insertRow();
    },

    resetFileUploadDocumento: function (field) {
        var me = this,
            row = field.up('panel[rowDocument=true]');

        row.down('button[action=showfile]').hide();
        row.down('button[action=delfile]').hide();
    },

    deleteDocumento: function (btn) {
        var me = this,
            row = btn.up('panel[rowDocument=true]'),
            file = row.down('fileuploadfield');

        mostrarMensaje(2, this.etiquetas.msgConfirmDelFile, function (response) {
            if (response === 'ok') {
                file.reset();
                btn.up('form').deleteRow(row.itemId)
            }
        });
    },

    onShowSelectClienteProveedor: function (window) {
        window.isClosed = false;
        Ext.TaskManager.start({
            run: this.checkRecordSelected.bind(this, window),
            interval: 100,
            scope: this
        });
    },

    checkRecordSelected: function (win) {
        if (win.isClosed) {
            return false;
        }
        var iframe = window.document.getElementsByTagName('iframe').item(0),
            childwindow = iframe.contentWindow,
            condition = childwindow && childwindow.recordselected && childwindow.recordselected.length == 1;
        if (condition) {
            win.recordselected = childwindow.recordselected;
        }
        win.btnAceptar.setDisabled(!condition);
    },

    onSelectClienteProveedor: function (btn) {
        var windowselectcliente = btn.up('window'),
            records = windowselectcliente.recordselected,
            selectfield = windowselectcliente.selectfield,
            windowcontrato = selectfield.up('window'),
            formcontrato = windowcontrato.customForm,
            hiddenfield = formcontrato.getForm().findField(selectfield.localId);

        selectfield.setValue(records[0].data.nombre);
        if (hiddenfield) {
            hiddenfield.multiSelect = selectfield.multiSelect;
            hiddenfield.setValue(records[0].data.idclientesproveedores);
        }
        selectfield.fireEvent('addselected', false, false, selectfield, records);
        windowselectcliente.close();
    },

    checkCumplimientoObligaciones: function (check, value) {
        var me = this, win = me.getCo_mainwindowContratacion(),
            required = '<span style="color:red;font-weight:bold">*</span>';
        win.vigencia.allowBlank = value;
        value ? win.vigencia.setFieldLabel(me.etiquetas.lbVigencia) :
            win.vigencia.labelEl.dom.innerHTML = me.etiquetas.lbVigencia + ':' + required;
        win.vigencia.validate();
  },

    changecmbarea:function (cmb) {
        var me = this, win = me.getCo_mainwindowContratacion();
        console.log('area', win.cmbarea.getValue())
        console.log('idarea', win.hfarea.getValue())
        win.formAreasImplicadas.setDisabled(!win.hfarea.getValue());
        if(win.hfarea.getValue()){
            if(win.formAreasImplicadas.areaRoot['id']!=win.hfarea.getValue()){
                if(win.formAreasImplicadas.getStore().getCount()>0){
                    win.formAreasImplicadas.getStore().removeAll();
                    mostrarMensaje(1, 'Las áreas implicadas seleccionadas han sido eliminadas.')
                }                
            }
            win.formAreasImplicadas.areaRoot={
                text: win.cmbarea.getValue(),
                id: win.hfarea.getValue(), 
                expanded: true
            };
        }else{
            win.formAreasImplicadas.areaRoot={
                text: 'Xetid',
                id: 0,
                expanded: true
            };
        }
    },

    selectionChangeClientesAsociados: function(sm, records){
        var me=this, grid=me.getGridClientesAsociados();
        grid.down('#delClienteAsociado').setDisabled(records.length==0);
    },

    onActionClientesAsociados: function(btn){
        var me=this;
        console.log('onActionClientesAsociados', btn.action)
        switch(btn.action){
            case 'addClienteAsociado':
                me.addClienteAsociado(btn);break;
            case 'delClienteAsociado':
                me.delClienteAsociado(btn);break;
        }
    },
    addClienteAsociado: function(btn){
        var me=this, grid=btn.up('grid');
        var store=Ext.create('Ext.data.Store',{
            autoLoad: true,
            fields: ['idclientesproveedores', 'nombre'],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getModel'}, ModuleMgr.get('TipoContrato')),
                extraParams: {
                    modelName: 'NomClienteproveedor',
                    'filter[0][field]': 'nombre',
                    'filter[0][data][type]': 'string',
                    'filter[1][field]': 'idtipo',
                    'filter[1][data][type]': 'numeric',
                    'filter[1][data][value]': grid.context=='cliente'?1:2,
                    'filter[2][field]': 'idestructuracomun',
                    'filter[2][data][type]': 'string',
                    'filter[2][data][value]': window.parent.UCID.portal.perfil.idestructuracomun,
                },
                responseCfg: {
                    action: 'load',
                    gen: '',
                    concept: '',
                    count: 0
                },
                reader: {
                    idProperty: 'idclientesproveedores',
                    type: 'json',
                    root: 'data',
                    totalProperty: 'count'
                }
            }
        });
        var win=Ext.create('Ext.ux.CustomWindow',{
            action:'add',
            title: btn.tooltip,
            width: 700,
            height: window.innerHeight *0.92,
            layout: 'fit',
            items: Ext.create('Ext.grid.Panel',{
                store: store,
                columns:[
                    {
                        text: grid.context == 'cliente' ? me.etiquetas.lbCliente : me.etiquetas.lbProveedor,
                        dataIndex: 'nombre',
                        flex: 1
                    }
                ],
                selModel: Ext.create('Ext.selection.CheckboxModel',{
                    listeners:{
                        selectionchange: function(sm, records){
                            win.btnAceptar.setDisabled(records.length==0);
                            win.btnAplicar.setDisabled(records.length==0);
                        }
                    }
                }),
                dockedItems:[
                    {
                        xtype: 'toolbar',
                        dock: 'top',
                        items:[
                            '->',
                            Ext.create('Ext.ux.SearchField', {
                                itemId: 'searchfield',
                                flex: 1,
                                maxWidth: 200,
                                minWidth: 150,
                                searchTooltip: me.etiquetas.qtipSearch.get(me.etiquetas.lbContract.getSingular().get().toLowerCase()),
                                emptyText: 'Introduzca el nombre',
                                listeners:{
                                    search: function(field){
                                        store.proxy.extraParams['filter[0][data][value]']=field.getValue();
                                        store.load();
                                    },
                                    clear: function(){
                                        delete store.proxy.extraParams['filter[0][data][value]'];
                                        store.load();
                                    }
                                },
                            })
                        ]
                    },
                    {
                        xtype: 'pagingtoolbar',
                        store: store,
                        dock: 'bottom',
                        pageNumb: true,
                        displayInfo: true,
                        comboEntradas: 8
                    }
                ]
            })
        });
        function agregarClienteProveedor(){
            var seleccionados=win.items.first().getSelectionModel().getSelection();
            console.log('seleccionados:', seleccionados)
            var existen=[];
            seleccionados.forEach(function(x) {
                if(x.get('idclientesproveedores')==grid.up('window').hfclienteproveedor.getValue()){
                    existen.splice(0, 0, x.get('nombre')+' <b>(Titular del contrato)</b>');
                }else{
                    var noesta=grid.getStore().getRange().every(function(y){
                        return y.get('idclienteproveedor')!=x.get('idclientesproveedores');
                    })
                    if(noesta){
                        grid.getStore().add({'idclienteproveedor': x.get('idclientesproveedores'), 'nombre': x.get('nombre')});
                    }else{
                        existen.push(x.get('nombre'));
                    }
                }
            })
            if(existen.length>0)
                mostrarMensaje(8, 'Ya se encuentran adicionados los siguientes: <br>-' + existen.join('<br>-') + '.');
        }
        win.show(null, function(){
            win.btnAceptar.on('click', function(){
                agregarClienteProveedor();
                win.close();
            })
            win.btnAplicar.on('click', function(){
                agregarClienteProveedor();
                win.items.first().getSelectionModel().deselectAll();
            })
        });
    },
    delClienteAsociado: function(btn){
        var me=this, grid=btn.up('grid');
        var dialog = Ext.create('Ext.window.MessageBox', {
            buttonAlign: 'center',
            buttons: [
                {
                    text: 'Aceptar',
                    iconCls: 'aceptar',
                    handler: function () {
                        grid.getStore().remove(grid.getSelectionModel().getSelection());
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
            title: me.etiquetas.lbConfirmacion,
            msg: me.etiquetas.msgEliminarClientesAsociados,
            icon: Ext.MessageBox.QUESTION,
        });
    },
    selectOferta: function (combo, records) {
        console.log('select oferta')
        var me = this, win = me.getCo_mainwindowContratacion(),
            form = combo.up('form'),
            select = records[0],
            cloneRecord = select.copy();
        console.log('select', select)
        if (combo.getValue()) {
            // Ext.Object.each(records[0].data, function (key, value) {
            //     if (['idsolicitud', 'numero'].indexOf(key) == -1 && form.getForm().findField(key) && value) {
            //         form.getForm().findField(key).setValue(value);
            //     }
            // })
            console.log('cloneRecord', cloneRecord)
            Ext.data.Model.id(cloneRecord);
            cloneRecord.set('nombrearea', cloneRecord.get('arearesponsable'))
            cloneRecord.set('nombrepersona', cloneRecord.get('nombreresponsable'))
            cloneRecord.set('numero', '')
            cloneRecord.set('fechafirma', '')
            cloneRecord.set('vigencia', '')
            var dataForm = win.customForm,
                pagoForm = win.formaPago,
                docForm = win.docForm;
            console.log('cloneRecord2', cloneRecord)
            win.nombre.modNombre = true;
            dataForm.loadRecord(cloneRecord);
            dataForm.getForm().findField('idoferta').setValue(cloneRecord.get('idoferta'));
            dataForm.getForm().findField('idarea').setValue(cloneRecord.get('idarea'));
            dataForm.getForm().findField('idsector').setValue(cloneRecord.get('idsector'));
            pagoForm.loadRecord(cloneRecord);
            docForm.loadRecord(cloneRecord);
            if (select.data.idlinea) win.sftipolinea.setDisabled(false);
            if (select.data.idlinea) win.sfclienteproveedor.setDisabled(false);
            var cargandoDatosAdicionales = true;
            win.formaPago.on('render', function (yo) {
                if (cargandoDatosAdicionales) {
                    win.formaPago.maskL = new Ext.LoadMask(
                        win.formaPago.down('tabpanel'), {msg: this.etiquetas.msgLoading});
                    win.formaPago.maskL.show();
                }
            });
            // var maskWin = new Ext.LoadMask(
            //     win.el, {msg: this.etiquetas.msgCargandoDatosOferta});
            // maskWin.show();
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'getDatosAdicionales'}, ModuleMgr.get('OfertaNegocioImportacion')),
                params: {idoferta: select.get('idoferta')},
                callback: function (options, success, response) {
                    var info = Ext.decode(response.responseText);
                    cargandoDatosAdicionales = false;
                    if (win.formaPago.maskL) win.formaPago.maskL.hide();
                    // maskWin.hide();

                    if (info) {
                        if (info.hitos.length > 0 || info.indicadores.length > 0) {
                            if (info.hitos.length > 0) {
                                info.hitos.forEach(function (x) {
                                    x['idhito'] = '';
                                    for (var i = 0; i < x.pago.length; i++) {
                                        x.pago[i]['idmonedahito'] = ''
                                    }
                                    for (var j = 0; j < x.indicadores.length; j++) {
                                        x.indicadores[j]['idindicadorcontrato'] = ''
                                    }
                                });
                                pagoForm.hitopago.datosLoad = info.hitos;
                                pagoForm.hitopago.getStore().loadData(info.hitos);
                                pagoForm.hitopago.getStore().fireEvent('loaddata', pagoForm.hitopago.getStore());
                                pagoForm.indicadores.setDisabled(true);
                            } else {
                                info.indicadores.forEach(function (x) {
                                    x['idindicadorcontrato'] = '';
                                });
                                pagoForm.indicadores.datosLoad = info.indicadores;
                                pagoForm.indicadores.getStore().loadData(info.indicadores);
                                pagoForm.indicadores.getStore().fireEvent('loaddata', pagoForm.indicadores.getStore());
                                pagoForm.indicadores.up('tabpanel').setActiveTab(pagoForm.indicadores);
                                pagoForm.hitopago.setDisabled(true);
                            }
                        }
                        if (info.anexos && info.anexos.length != 0)
                            docForm.loadDocuments(info.anexos);
                    }
                }
            });
        }
    },
    onSelectTipoVigencia: function(combo){
        var me=this,
            win = combo.up('window'),
            required = '<span style="color:red;font-weight:bold data-qtip="Obligatorio"">*</span>';
        win.vigencia.allowBlank = combo.getValue()!=0;
        combo.getValue()!=0 ? win.vigencia.setFieldLabel(me.etiquetas.lbVigencia) :
            win.vigencia.labelEl.dom.innerHTML = me.etiquetas.lbVigencia + ':' + required;
        win.vigencia.setReadOnly(combo.getValue()!=0);
        win.unidadTiempo.setReadOnly(combo.getValue()!=0);
        win.vigencia.setDisabled(combo.getValue()!=0);
        win.unidadTiempo.setDisabled(combo.getValue()!=0);
        win.vigencia.validate();

    },
    selectContratoMarco: function(yo, records){
        var me = this;
        if(yo.getValue()){
            Ext.Ajax.request({
                url: UtilsFn.buildUrl({action: 'cargarcontrato'}, me),
                params: {
                    idcontratomarco: records[0].get('idcontrato'),
                    'filter[0][field]': 'idcontrato',
                    'filter[0][data][type]': 'int',
                    'filter[0][data][value]': records[0].get('idcontrato'),
                },
                callback: function (options, success, response) {
                    var result = Ext.decode(response.responseText);
                    if(result && result.data && result.data.length>0){
                        let totalesMarcos = {};
                        result.data[0]['monedas'].forEach(function(x){
                            totalesMarcos[x.codigoiso] = parseFloat(x.monto);
                        })
                        yo.up('window').totalesMarcos = totalesMarcos;
                    }
                    Ext.Ajax.request({
                        url: UtilsFn.buildUrl({action: 'cargarcontrato'}, me),
                        params: {
                            idcontratomarco: records[0].get('idcontrato'),
                            'filter[0][field]': 'idcontratomarco',
                            'filter[0][data][type]': 'int',
                            'filter[0][data][value]': records[0].get('idcontrato'),
                        },
                        callback: function (options, success, response) {
                            var result = Ext.decode(response.responseText);
                            let totalesHijosMarcos = {};
                            if(result && result.data && result.data.length>0) {
                                for (var i = 0; i < result.data.length; i++) {
                                    result.data[i]['monedas'].forEach(function (x) {
                                        totalesHijosMarcos[x.codigoiso] = (totalesHijosMarcos[x.codigoiso] || 0) + (parseFloat(x.monto) || 0);
                                    })
                                }
                            }else{
                                Object.keys(yo.up('window').totalesMarcos).forEach(function(x){
                                    totalesHijosMarcos[x] = 0;
                                })
                            }
                            yo.up('window').totalesHijosMarcos = totalesHijosMarcos;
                            me.changeLimitMax();
                        }
                    })
                }
            })
        }
    },
    changeContratoMarco: function(yo){
        var me = this;
        if(yo.getValue()==''){
            yo.up('window').totalesMarco = null;
            yo.up('window').totalesHijosMarcos = null;
        }
        me.changeLimitMax();
    },
    changeLimitMax: function(){
        var me = this, win = me.getCo_mainwindowContratacion();
        if(win.totalesMarcos && win.totalesHijosMarcos){
            Object.entries(win.totalesMarcos).forEach(([key, value]) => {
                if(win.down('#montomoneda_' + key.toLowerCase())) {
                    win.down('#montomoneda_' + key.toLowerCase()).setMaxValue((parseFloat(value) - parseFloat(win.totalesHijosMarcos[key])).toFixed(2))
                }
            })
        }
    }
});
