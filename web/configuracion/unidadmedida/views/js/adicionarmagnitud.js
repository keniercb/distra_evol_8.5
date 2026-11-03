var change = false;
var MagnitudModificada = false;
var buttonAceptar;
var buttonModAceptar;
var isOpenWIMagnitud = false;
var isOpenWMMagnitud = false;
var tfdenominacion;
initMagnitud = function() {
    UCID.VTypes.registrar('vtdenominacionmagnitud', {
        regExp: /^[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc ]+$/,
        mensaje: etiquetasEst.lbmsg22
    });

    tfdenominacion = new Ext.form.TextField({
        fieldLabel: etiquetasEst.lbDenominacionDeLaManitud,
        maxLength: 255,
        vtype: 'vtdenominacionmagnitud',
        maskRe : /^[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc ]+$/,
        id: 'denominacion',
        name: 'denominacionmagnitud',
        maxLengthText: etiquetasEst.lbMaxLengthText,
        anchor: '100%',
        allowBlank: false,
        enableKeyEvents: true,
        listeners: {
            change: function() {
                change = true;
                MagnitudModificada = true;///...Variable para saber si se modifico algun campo...///
            },
            keyup: function(){
                activarBotonesWinMagnitud();
            }

        }
    });
    // formulario fpMagnitud
    fpMagnitud = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        id: 'idfpMagnitud',
        bodyStyle: 'padding:5px 5px 0',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        layout: 'form',
                        items: [tfdenominacion, {
                                xtype: 'hidden',
                                id: 'idmagnitud_n',
                                name: 'idmagnitud'
                            }]
                    }, {
                        columnWidth: .5,
                        layout: 'form',
                        items: [{
                                xtype: 'datefield',
                                fieldLabel: etiquetasEst.lbFefchaI,
                                format: 'd/m/Y',
                                invalidText: etiquetasEst.lbmsg19,
                                maxText: etiquetasEst.lbmsg20,
                                vtype: 'daterange',
                                value: new Date(),
                                endDateField: 'ffin',
                                name: 'fechainicio',
                                id: 'finicio',
                                anchor: '95%',
                                editable: true,
                                allowBlank: false,
                                enableKeyEvents: true,
                                listeners: {
                                    change: function(_this, newvalue, oldvaleu) {
                                        MagnitudModificada = true;///...Variable para saber si se modifico algun campo...///
                                        if (newvalue == '') {
                                            Ext.getCmp('ffin').setMinValue(null);
                                            Ext.getCmp('ffin').validate();

                                        }
                                        activarBotonesWinMagnitud();

                                    },
                                    keyup: function(){
                                        activarBotonesWinMagnitud();
                                    },
                                    select : function(){
                                        activarBotonesWinMagnitud();
                                    }
                                }
                            }]
                    }, {
                        columnWidth: .5,
                        layout: 'form',
                        items: [{
                                xtype: 'datefield',
                                // readOnly : true,
                                fieldLabel: etiquetasEst.lbFefchaF,
                                format: 'd/m/Y',
                                vtype: 'daterange',
                                name: 'fechafin',
                                startDateField: 'finicio',
                                invalidText: etiquetasEst.lbmsg19,
                                minText: etiquetasEst.lbmsg21,
                                id: 'ffin',
                                anchor: '100%',
                                editable: true,
                                enableKeyEvents: true,
                                listeners: {
                                    change: function(_this, newvalue, oldvalue) {
                                        if (newvalue == '') {
                                            Ext.getCmp('finicio').setMaxValue(null);
                                            Ext.getCmp('finicio').validate();

                                        }
                                        MagnitudModificada = true;///...Variable para saber si se modifico algun campo...///
                                        activarBotonesWinMagnitud();
                                    },
                                    keyup: function(){
                                        activarBotonesWinMagnitud();
                                    },
                                    events : function(){
                                        activarBotonesWinMagnitud();
                                    }
                                }
                            }]
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: [{
                                xtype: 'textarea',
                                id: 'descripcionmagnitud',
                                name: 'descripcionmagnitud',
                                anchor: '100%',
                                fieldLabel: etiquetasEst.lbDescripcionDeLaManitud,
                                enableKeyEvents: true,
                                listeners: {
                                    change: function() {
                                        change = true;
                                        MagnitudModificada = true;///...Variable para saber si se modifico algun campo...///

                                    },
                                    keyup: function(){
                                        activarBotonesWinMagnitud();
                                    }
                                }
                            }]
                    }]
            }]
    });


    function activarBotonesWinMagnitud(){
        if (fpMagnitud.getForm().isValid()) {
            if(isOpenWIMagnitud){
                Ext.getCmp('btnAceptar_Mag').enable();
                Ext.getCmp('btnAplicar_Mag').enable();
            }else if(isOpenWMMagnitud){
                if(smGpGestMagnitud.getSelected().data.descripcionmagnitud != fpMagnitud.getForm().getValues().descripcionmagnitud
                    || smGpGestMagnitud.getSelected().data.fechainicio != fpMagnitud.getForm().getValues().fechainicio
                    || smGpGestMagnitud.getSelected().data.denominacionmagnitud.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '') != fpMagnitud.getForm().getValues().denominacionmagnitud){
                        Ext.getCmp('btnModAceptarMagnit').enable();
                }else{
                    if(!smGpGestMagnitud.getSelected().data.fechafin && !fpMagnitud.getForm().getValues().fechafin){
                        Ext.getCmp('btnModAceptarMagnit').disable();
                    }else if(smGpGestMagnitud.getSelected().data.fechafin != fpMagnitud.getForm().getValues().fechafin){
                        Ext.getCmp('btnModAceptarMagnit').enable();
                    }else{
                        Ext.getCmp('btnModAceptarMagnit').disable();
                    }
                }
            }
        }else{
            if(isOpenWIMagnitud){
                Ext.getCmp('btnAceptar_Mag').disable();
                Ext.getCmp('btnAplicar_Mag').disable();
            }else if(isOpenWMMagnitud){
                Ext.getCmp('btnModAceptarMagnit').disable();
            }
        }
    }


    winAddMagnitud = new Ext.Window({
        id: 'winAddMagnitud',
        keyMapGroup: true,
        constrain:true,
        modal: true,
        closeAction: 'hide',
        layout: 'fit',
        listeners: {
            show: function() {
                map_um.disable();
                Ext.getCmp('ffin').setMinValue(Ext.getCmp('finicio').getValue());
                Ext.getCmp('ffin').validate();
                Ext.getCmp('finicio').setMaxValue(null);
                Ext.getCmp('finicio').validate();
                isOpenWIMagnitud = true;
            },
            hide: function() {
                map_um.enable();
                isOpenW = false;
                isOpenWIMagnitud = false;
                btnAdicionarMagnitud.focus();
                Ext.getCmp('btnAceptar_Mag').disable();
                Ext.getCmp('btnAplicar_Mag').disable();
            }

        },
        defaultButton: 'btnCancelar_Mag',
        firstElement:tfdenominacion,
        title: etiquetasEst.titAddMag,
        width: 350,
        items: fpMagnitud,
        height: 270,
        buttons: [{
                iconCls: 'cancelar',
                id: 'btnCancelar_Mag',
                text: etiquetasEst.lbBtnCancelar,
                tooltip: etiquetasEst.tooltipCancelar,
                handler: function() {
                    winAddMagnitud.hide();
                }
            }, {
                iconCls: 'aplicar',
                id: 'btnAplicar_Mag',
                disabled : true,
                text: etiquetasEst.lbBtnAplicar,
                tooltip: etiquetasEst.tooltipAplicar,
                handler: function() {
                    adicionarMagnitud(true);
                }
            },
            buttonAceptar = new Ext.Button({
                iconCls: 'aceptar',
                id: 'btnAceptar_Mag',
                disabled : true,
                text: etiquetasEst.lbBtnAceptar,
                tooltip: etiquetasEst.tooltipAceptar,
                hotKey: {
                    idGrupo: 'winAddMagnitud',
                    config: {
                        key: Ext.EventObject.ENTER,
                        stopEvent: true
                    }
                },
                handler: function() {
                    adicionarMagnitud();
                }
            })
        ]
    });

    winModMagnitud = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        layout: 'fit',
        title: etiquetasEst.titModMagnitud,
        constrain:true,
        width: 350,
        items: fpMagnitud,
        id: 'idWinModMagnitud',
        height: 270,
        defaultButton: 'btnModCancelarMagnit',
        firstElement:tfdenominacion,
        listeners: {
            hide: function() {
                map_um.enable();
                isOpenW = false;
                MagnitudModificada = false;
                isOpenWMMagnitud = false;
                btnAdicionarMagnitud.focus();
                Ext.getCmp('btnModAceptarMagnit').disable();
            },
            show: function() {
                Ext.getCmp('idfpMagnitud').getForm().loadRecord(Ext.getCmp('gpGestMagnitud').getSelectionModel().getSelected());
                map_um.disable();
                Ext.getCmp('ffin').setMinValue(Ext.getCmp('finicio').getValue());
                Ext.getCmp('ffin').validate();
                if (!Ext.getCmp('ffin').getValue()) {
                    Ext.getCmp('finicio').setMaxValue(null);
                    Ext.getCmp('finicio').validate();
                } else {
                    Ext.getCmp('finicio').setMaxValue(Ext.getCmp('ffin').getValue());
                    Ext.getCmp('finicio').validate();
                }
                isOpenWMMagnitud = true;
            }
        },
        buttons: [{
                iconCls: 'cancelar',
                text: etiquetasEst.lbBtnCancelar,
                id: 'btnModCancelarMagnit',
                tooltip: etiquetasEst.tooltipCancelar,
                handler: function() {
                    winModMagnitud.hide();
                }
            },
            buttonModAceptar = new Ext.Button({
                iconCls: 'aceptar',
                text: etiquetasEst.lbBtnAceptar,
                tooltip: etiquetasEst.tooltipAceptar,
                disabled : true,
                id: 'btnModAceptarMagnit',
                handler: function() {
                    fpMagnitud.getForm().setValues({
                        descripcionmagnitud: fpMagnitud.getForm().getValues().descripcionmagnitud.trim(),
                        fechainicio: fpMagnitud.getForm().getValues().fechainicio.trim(),
                        fechafin: fpMagnitud.getForm().getValues().fechafin.trim(),
                        denominacionmagnitud: fpMagnitud.getForm().getValues().denominacionmagnitud.trim()
                    });
                    if(smGpGestMagnitud.getSelected().data.descripcionmagnitud != fpMagnitud.getForm().getValues().descripcionmagnitud
                        || smGpGestMagnitud.getSelected().data.fechainicio != fpMagnitud.getForm().getValues().fechainicio
                        || smGpGestMagnitud.getSelected().data.denominacionmagnitud != fpMagnitud.getForm().getValues().denominacionmagnitud){
                        ModificarMagnitud();
                    }else{
                        if(!smGpGestMagnitud.getSelected().data.fechafin && !fpMagnitud.getForm().getValues().fechafin){
                            Ext.getCmp('btnModAceptarMagnit').disable();
                            mostrarMensaje(1, etiquetasEst.textNoCamposModific);
                        }else if(smGpGestMagnitud.getSelected().data.fechafin != fpMagnitud.getForm().getValues().fechafin){
                            ModificarMagnitud();
                        }else{
                            Ext.getCmp('btnModAceptarMagnit').disable();
                            mostrarMensaje(1, etiquetasEst.textNoCamposModific);
                        }
                    }

                   /* if (fpMagnitud.getForm().isDirty()) {
                        ModificarMagnitud();

                    }
                    else {
                        mostrarMensaje(1, etiquetasEst.textNoCamposModific);
                    }*/
                }})
        ]
    });

};

Ext.apply(Ext.form.VTypes, {
    daterange: function(val, field) {
        var date = field.parseDate(val);

        if (!date) {
            return;
        }
        if (field.startDateField
                && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax
                .getTime()))) {
            var start = Ext.getCmp(field.startDateField);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;
        } else if (field.endDateField
                && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin
                .getTime()))) {
            var end = Ext.getCmp(field.endDateField);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }
        return true;
    }
});

function adicionarMagnitud(apl) {
    /*
     * if ((Ext.getCmp('ffin').getValue() && (Ext.getCmp('ffin').getValue() >=
     * Ext .getCmp('finicio').getValue())) || !Ext.getCmp('ffin').getValue()) {
     */
    function p() {
        if (!apl) {
            if (opcion == 'add')
                winAddMagnitud.hide();
            if (opcion == 'mod')
                winModMagnitud.hide();
        }
    }

    if (fpMagnitud.getForm().isValid()) {
        fpMagnitud.getForm().setValues({
            descripcionmagnitud: fpMagnitud.getForm().getValues().descripcionmagnitud.trim(),
            fechainicio: fpMagnitud.getForm().getValues().fechainicio.trim(),
            fechafin: fpMagnitud.getForm().getValues().fechafin.trim(),
            denominacionmagnitud: fpMagnitud.getForm().getValues().denominacionmagnitud.trim()
        });
        if(fpMagnitud.getForm().getValues().denominacionmagnitud != '') {
            fpMagnitud.getForm().submit({
                url: 'adicionarmagnitud',
                waitMsg: etiquetasEst.msgGuardandodatosdelamagnitud,
                failure: function (form, action) {
                    if (action.result.codMsgg != 3 && action.result.codMsgg != 42 && action.result.codMsgg != 43) {
                        if (action.result.codMsgg == -1) {
                            mostrarMensaje(1, etiquetasEst.msgAdicionado);
                            btnAdicionarMagnitud.focus();
                            fpMagnitud.getForm().reset();
                            gpGestMagnitud.getStore().reload();
                            p();
                        }
                        if (action.result.codMsgg == -2) {
                            mostrarMensaje(1, etiquetasEst.msgModificado);
                            btnAdicionarMagnitud.focus();
                            fpMagnitud.getForm().reset();
                            btnModificarMagnitud.disable();
                            btnEliminarMagnitud.disable();
                            gpGestMagnitud.getStore().reload();
                            p();
                        }
                        Ext.getCmp('ffin').setMinValue(Ext.getCmp('finicio').getValue());
                        Ext.getCmp('finicio').setMaxValue(null);
                        Ext.getCmp('finicio').validate();
                        Ext.getCmp('ffin').validate();

                        smGpGestMagnitud.clearSelections();
                    } else {
                        if (action.result.codMsgg == 42) {
                            mostrarMensaje(1, etiquetasEst.msgExiteMagnitud);
                            btnAdicionarMagnitud.focus();
                            p();
                        }
                        if (action.result.codMsgg == 43) {
                            mostrarMensaje(1, etiquetasEst.msgModExiteMagnitud);
                            p();
                        }
                        if (action.result.codMsgg == 3) {
                            mostrarMensaje(1, etiquetasEst.lbmsgError);
                            btnAdicionarMagnitud.focus();
                            p();
                        }
                    }
                    btnModificarMagnitud.disable();
                    btnEliminarMagnitud.disable();
                    btnAdicionarUM.disable();
                    stGpGestUM.removeAll();

                }
            });
        }else{
            Ext.getCmp('btnAceptar_Mag').disable();
            Ext.getCmp('btnAplicar_Mag').disable();
        }
    }
    else {
        mostrarMensaje(1, etiquetasEst.CamposVacios);
    }
}

function ModificarMagnitud() {
    if (MagnitudModificada == true) {
        if (fpMagnitud.getForm().isValid()) {
            fpMagnitud.getForm().setValues({
                descripcionmagnitud: fpMagnitud.getForm().getValues().descripcionmagnitud.trim(),
                fechainicio: fpMagnitud.getForm().getValues().fechainicio.trim(),
                fechafin: fpMagnitud.getForm().getValues().fechafin.trim(),
                denominacionmagnitud: fpMagnitud.getForm().getValues().denominacionmagnitud.trim()
            });
            if(fpMagnitud.getForm().getValues().denominacionmagnitud != '') {
                fpMagnitud.getForm().submit({
                    url: 'modificarMagnitud',
                    waitMsg: etiquetasEst.msgGuardandodatosdelamagnitud,
                    params: {
                        denominacionmagnitud: Ext.getCmp('denominacion').getValue().trim(),
                        descripcionmagnitud: Ext.getCmp('descripcionmagnitud').getValue().trim(),
                        fechafin: Ext.getCmp('ffin').getValue(),
                        fechainicio: Ext.getCmp('finicio').getValue(),
                        idmagnitud_n: Ext.getCmp('idmagnitud_n').getValue().trim()
                    },
                    failure: function (form, action) {
                        if (action.result.codMsg == -1) {
                            mostrarMensaje(1, etiquetasEst.MsgInsertadaMagnitud);
                            gpGestMagnitud.getStore().reload();
                            winModMagnitud.hide();
                        }
                        else {
                            if (action.result.codMsg == -2) {
                                mostrarMensaje(1, etiquetasEst.msgModExiteMagnitud);
                            }
                        }


                    }
                });
            }else{
                Ext.getCmp('btnModAceptarMagnit').disable();
            }
        }
        else {
            mostrarMensaje(1, etiquetasEst.CamposVacios);
        }
    } else {
        mostrarMensaje(1, etiquetasEst.NoCamposModificados);
    }

}