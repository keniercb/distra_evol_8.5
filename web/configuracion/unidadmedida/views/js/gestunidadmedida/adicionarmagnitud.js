var change = false;
var MagnitudModificada = false;
var buttonAceptar;
var buttonModAceptar;
initMagnitud = function() {

    UCID.VTypes.registrar('vtdenominacionmagnitud', {
        regExp: /^([a-zA-ZáéíóúÁÉÍÓÚñÑ ])+$/,
        mensaje: etiquetasEst.lbmsg22
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
                        items: [{
                                xtype: 'textfield',
                                fieldLabel: etiquetasEst.lbDenominacionDeLaManitud,
                                maxLength: 255,
                                vtype: 'vtdenominacionmagnitud',
                                id: 'denominacion',
                                name: 'denominacionmagnitud',
                                prevTab: 'btnModAceptarMagnit',
                                maxLengthText: etiquetasEst.lbMaxLengthText,
                                anchor: '100%',
                                allowBlank: false,
                                listeners: {
                                    change: function() {
                                        change = true;
                                        MagnitudModificada = true;///...Variable para saber si se modifico algun campo...///
                                    }

                                }
                            }, {
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
                                listeners: {
                                    change: function(_this, newvalue, oldvaleu) {
                                        MagnitudModificada = true;///...Variable para saber si se modifico algun campo...///
                                        if (newvalue == '') {
                                            Ext.getCmp('ffin').setMinValue(null);
                                            Ext.getCmp('ffin').validate();

                                        }

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
                                editable: true
                                        ,
                                listeners: {
                                    change: function(_this, newvalue, oldvalue) {
                                        if (newvalue == '') {
                                            Ext.getCmp('finicio').setMaxValue(null);
                                            Ext.getCmp('finicio').validate();

                                        }
                                        MagnitudModificada = true;///...Variable para saber si se modifico algun campo...///
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
                                listeners: {
                                    change: function() {
                                        change = true;
                                        MagnitudModificada = true;///...Variable para saber si se modifico algun campo...///
                                    }
                                }
                            }]
                    }]
            }]
    });









    winAddMagnitud = new Ext.Window({
        id: 'winAddMagnitud',
        keyMapGroup: true,
        modal: true,
        constrain:true,
        closeAction: 'hide',
        layout: 'fit',
        listeners: {
            show: function() {
                map_um.disable();
//                fpMagnitud.findById('denominacion').focus(false, 200);
                Ext.getCmp('ffin').setMinValue(Ext.getCmp('finicio').getValue());
                Ext.getCmp('ffin').validate();
                Ext.getCmp('finicio').setMaxValue(null);
                Ext.getCmp('finicio').validate();

            },
            hide: function() {
                map_um.enable();
                isOpenW = false;
                btnAdicionarMagnitud.focus();
            }, render: function() {
                winAddMagnitud.focus();
            }

        },
        defaultButton: 'btnAceptar_Mag',
        title: etiquetasEst.titAddMag,
        width: 350,
        items: fpMagnitud,
        height: 270,
        buttons: [{
                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'btn',
                id: 'btnCancelar_Mag',
                // nextTab : 'btnAplicar_Mag',
                // prevTab : 'descripcionmagnitud',
                text: etiquetasEst.lbBtnCancelar,
                tooltip: etiquetasEst.tooltipCancelar,
                handler: function() {
                    winAddMagnitud.hide();
                }
            }, {
                icon: perfil.dirImg + 'aplicar.png',
                iconCls: 'btn',
                id: 'btnAplicar_Mag',
                // nextTab : 'btnAceptar_Mag',
                // prevTab : 'btnCancelar_Mag',
                text: etiquetasEst.lbBtnAplicar,
                tooltip: etiquetasEst.tooltipAplicar,
                handler: function() {
                    adicionarMagnitud(true);
                }
            },
            buttonAceptar = new Ext.Button({
                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'btn',
                id: 'btnAceptar_Mag',
                nextTab: 'denominacion',
                // prevTab : 'btnAplicar_Mag',
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
        defaultButton: 'btnModAceptarMagnit',
        listeners: {
            hide: function() {
                map_um.enable();
                isOpenW = false;
                MagnitudModificada = false;
                btnAdicionarMagnitud.focus();
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
            }, render: function() {
                winModMagnitud.focus();
            }
        },
        buttons: [{
                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'btn',
                text: etiquetasEst.lbBtnCancelar,
                id: 'btnModCancelarMagnit',
                tooltip: etiquetasEst.tooltipCancelar,
                handler: function() {
                    winModMagnitud.hide();
                }
            },
            buttonModAceptar = new Ext.Button({icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'btn',
                text: etiquetasEst.lbBtnAceptar,
                tooltip: etiquetasEst.tooltipAceptar,
                nextTab: 'denominacion',
                id: 'btnModAceptarMagnit',
                handler: function() {
                    if (fpMagnitud.getForm().isDirty()) {
                        ModificarMagnitud();

                    }
                    else {
                        mostrarMensaje(1, etiquetasEst.textNoCamposModific);
                    }
                }})
        ]
    });

}

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
        fpMagnitud.getForm().submit({
            url: 'adicionarmagnitud',
            waitMsg: etiquetasEst.msgGuardandodatosdelamagnitud,
            failure: function(form, action) {
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
    }
    else {
        mostrarMensaje(1, etiquetasEst.CamposVacios);
    }




}

function ModificarMagnitud() {
    if (MagnitudModificada == true) {
        if (fpMagnitud.getForm().isValid()) {
            fpMagnitud.getForm().submit({
                url: 'modificarMagnitud',
                waitMsg: etiquetasEst.msgGuardandodatosdelamagnitud,
                params: {
                    denominacionmagnitud: Ext.getCmp('denominacion').getValue(),
                    descripcionmagnitud: Ext.getCmp('descripcionmagnitud').getValue(),
                    fechafin: Ext.getCmp('ffin').getValue(),
                    fechainicio: Ext.getCmp('finicio').getValue(),
                    idmagnitud_n: Ext.getCmp('idmagnitud_n').getValue()},
                failure: function(form, action) {
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
        }
        else {
            mostrarMensaje(1, etiquetasEst.CamposVacios);
        }
    } else {
        mostrarMensaje(1, etiquetasEst.NoCamposModificados);
    }

}