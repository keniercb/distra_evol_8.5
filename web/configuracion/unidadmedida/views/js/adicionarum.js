var change_um = false;
var buttonModUm;
var buttonAddUm;
var TFdenom;
var isOpenWIUM = false;
var isOpenWMUM = false;

initUM = function() {
    UCID.VTypes.registrar('vtdenominacionunidadmedida', {
        regExp: /^([a-zA-ZáéíóúÁÉÍÓÚñÑ ])+$/,
        mensaje: etiquetasEst.lbmsg22
    });
    UCID.VTypes.registrar('vtabreviaturaunidadmedida', {
        regExp: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\/ ])+$/,
        mensaje: etiquetasEst.lbmsg23
    });
    stConversiones = new Ext.data.Store({
        url: 'listarconversionesUM',
        listeners: {
            'load': function(st, recordArray, opt) {

            },
            beforeload: function(st, opt) {

            }
        },
        reader: new Ext.data.JsonReader({
            // totalProperty : "total",
            root: "data",
            id: "idunidadmedida"
        }, [{
            name: 'idunidadmedida'
        }, {
            name: 'denominacionunidadmedida'
        }, {
            name: 'factorconversion'
        }])
    });

    var checkdecimales = new Ext.form.Checkbox({
        labelSeparator:'',
        boxLabel: etiquetasEst.lbDecimales,
        name:'decimales',
        id:'checkdecimales',
        listeners: {
            check: function () {
                change_um = true;
                activarBotonesWinUM();
            }
        }
    });
    // formulario fpUM
    fpUM = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        // trackResetOnLoad : true,
        bodyStyle: 'padding:5px 5px 0',
        items: [{
            layout: 'column',
            items: [{
                columnWidth: 1,
                layout: 'form',
                items: [
                     TFdenom = new Ext.form.TextField({
                            fieldLabel: etiquetasEst.lbDenominacionUnidadMedida,
                            maxLength: 20,
                            maxLengthText: etiquetasEst.lbMaxLengthTextUm,
//                                vtype: 'vtdenominacionunidadmedida',
                        // regexText : 'Solo admite letras.',
                            id: 'denominacionum',
                            vtype: 'vtdenominacionmagnitud',
                            maskRe: /^[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc ]+$/,
                            name: 'denominacionum',
                            anchor: '100%',
                            allowBlank: false,
                            enableKeyEvents: true,
                            listeners: {
                                change: function () {
                                    change_um = true;
                                    activarBotonesWinUM();
                                },
                                keyup: function () {
                                    activarBotonesWinUM();
                                }
                            }
                        })

                    , {
                        xtype: 'hidden',
                        id: 'idunidadmedida'
                    }, {
                        xtype: 'hidden',
                        id: 'idmagnitud'
                    }]
            }, {
                columnWidth: 1,
                layout: 'form',
                items: new Ext.TabPanel({
                    activeTab: 0,
                    id: 'tpAddUM',
                    height: 205,
                    items: [{
                        title: etiquetasEst.lbDatosGenerales,
                        layout: 'column',
                        frame: true,
                        id: 'tapdatosgenerales',
                        bodyStyle: 'padding:10px 10px 10px 10px',
                        items: [{
                            columnWidth:.8,
                            layout: 'form',
                            items: [{
                                xtype: 'textfield',
                                fieldLabel: etiquetasEst.lbAbreviatura,
                                //vtype: 'vtabreviaturaunidadmedida',
                                // regexText : 'Solo admite caracteres
                                // alfanuméricos y los caracteres
                                // especiales (/).',
                                //maskRe: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\/ ])+$/,
                                id: 'abreviaturaum',
                                name: 'abreviaturaum',
                                allowBlank: false,
                                maxLength: 10,
                                maxLengthText: etiquetasEst.lbMaxLengthTextUmTp,
                                anchor: '97%',
                                enableKeyEvents: true,
                                listeners: {
                                    change: function () {
                                        change_um = true;
                                        activarBotonesWinUM();
                                    },
                                    keyup: function () {
                                        activarBotonesWinUM();
                                    }
                                }
                            }]
                        },{
                            layout: 'form',
                            columnWidth: .2,
                            items: checkdecimales
                        }, {
                            columnWidth: .5,
                            layout: 'form',
                            items: [{
                                xtype: 'datefield',
                                fieldLabel: etiquetasEst.lbFefchaI,
//                                                    value: new Date(),
                                id: 'finicioum',
                                name: 'finicioum',
                                invalidText: etiquetasEst.lbmsg19,
                                maxText: etiquetasEst.lbmsg20,
                                format: 'd/m/Y',
                                vtype: 'daterange',
                                endDateField: 'ffinum',
                                anchor: '95%',
                                editable: true,
                                allowBlank: false,
                                enableKeyEvents: true,
                                listeners: {
                                    'change': function() {
                                        change_um = true;
                                        activarBotonesWinUM();
                                    },
                                    keyup: function(){
                                        activarBotonesWinUM();
                                    }
                                }

                            }]
                        }, {
                            columnWidth: .5,
                            layout: 'form',
                            items: [{
                                xtype: 'datefield',
                                format: 'd/m/Y',
                                invalidText: etiquetasEst.lbmsg19,
                                minText: etiquetasEst.lbmsg21,
                                fieldLabel: etiquetasEst.lbFefchaF,
                                id: 'ffinum',
                                name: 'ffinum',
                                vtype: 'daterange',
                                startDateField: 'finicioum',
                                anchor: '100%',
                                enableKeyEvents: true,
                                listeners: {
                                    'change': function() {
                                        change_um = true;
                                        activarBotonesWinUM();
                                    },
                                    keyup: function(){
                                        activarBotonesWinUM();
                                    }
                                }

                            }]
                        }, {
                            columnWidth: 1,
                            layout: 'form',
                            items: [{
                                xtype: 'textarea',
                                id: 'descripcionum',
                                name: 'descripcionum',
                                maxLength: 255,
                                maxLengthText: etiquetasEst.lbMaxLengthTextUmTp,
                                anchor: '100%',
                                fieldLabel: etiquetasEst.lbDescripcionUnidadMedida,
                                enableKeyEvents: true,
                                listeners: {
                                    change: function() {
                                        change_um = true;
                                        activarBotonesWinUM();
                                    },
                                    keyup: function(){
                                        activarBotonesWinUM();
                                    }
                                }
                            }]
                        }]
                    }, {
                        title: etiquetasEst.lbConversiones,
                        layout: 'column',
                        frame: true,
                        id: 'tab_convesiones',
                        bodyStyle: 'padding:10px 10px 10px 10px',
                        items: [{
                            columnWidth: 1,
                            layout: 'form',
                            allowBlank: false,
                            items: grigfactorconversion = new Ext.grid.EditorGridPanel({
                                frame: true,
                                id: 'grig',
                                clicksToEdit: 1,
                                viewConfig: {forceFit:true},
                                autoExpandColumn: 'expandir',
                                titleCollapse: false,
                                loadMask: {
                                    msg: etiquetasEst.lbCargando
                                },
                                store: stConversiones,
                                region: 'center',
                                height: 175,
                                split: true,
                                sm: new Ext.grid.RowSelectionModel({
                                    singleSelect: true

                                }),
                                columns: [{
                                    id: 'expandir',
                                    header: etiquetasEst.lbUnidadMedida,
                                    width: 100,
                                    dataIndex: 'denominacionunidadmedida',
                                    allowBlank: false
                                }, {
                                    header: etiquetasEst.lbFactor,
                                    width: 120,
                                    dataIndex: 'factorconversion',
                                    editor: new Ext.form.NumberField({
                                        regex: /^-?[0-9]+([.][0-9]+)?$/,
                                        regexText: etiquetasEst.lbmsg24,
                                        maxLength: 19,
                                        id: 'factorconversionUM',
                                        name: 'factorconversionUM',
                                        maxLengthText: etiquetasEst.lbmsg26,
                                        enableKeyEvents: true,
                                        listeners: {
                                            change: function() {
                                                change_um = true;
                                                activarBotonesWinUM();
                                            },
                                            keyup: function(){
                                                activarBotonesWinUM();
                                            }
                                        }
                                    })

                                }]
                            })
                        }]
                    }]
                })
            }]
        }]
    });

    winAddUM = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        layout: 'fit',
        constrain:true,
        title: etiquetasEst.titAddunidaddemedida,
        width: 500,
        items: fpUM,
        defaultButton: 'btnCancelar_UM',
        firstElement: TFdenom,
        height: 375,
        buttons: [{
            iconCls: 'cancelar',
            id: 'btnCancelar_UM',
            text: etiquetasEst.lbBtnCancelar,
            tooltip: etiquetasEst.tooltipCancelar,
            handler: function() {
                winAddUM.hide();

            }
        }, {
            iconCls: 'aplicar',
            text: etiquetasEst.lbBtnAplicar,
            tooltip: etiquetasEst.tooltipAplicar,
            disabled: true,
            id: 'btnAplicar_UM',
            handler: function() {
                adicionarUM(true);
            }
        },
            buttonAddUm = new Ext.Button({
                iconCls: 'aceptar',
                text: etiquetasEst.lbBtnAceptar,
                tooltip: etiquetasEst.tooltipAceptar,
                id: 'idbtnAceptar_UM',
                disabled: true,
                handler: function() {
                    adicionarUM();
                }})
        ],
        listeners: {
            show: function(_this) {
                map_um.disable();
                fpUM.getForm().reset();
                Ext.getCmp('finicioum').setValue(Ext.getCmp('gpGestMagnitud').getSelectionModel().getSelected().data.fechainicio);
                Ext.getCmp('ffinum').setValue(Ext.getCmp('gpGestMagnitud').getSelectionModel().getSelected().data.fechafin);
                fpUM.focus();
//                fpUM.findById('denominacionum').focus(false, 200);
                isOpenWIUM =true;
                posicionarFechas();
            },
            hide: function() {
                map_um.enable();
                isOpenW = false;
                change_um = false;
                btnAdicionarUM.focus();
                isOpenWIUM = false;
            },
            render: function() {
                winAddUM.focus();
            }
        }
    });

    function posicionarFechas(){
        Ext.getCmp('ffinum').setMinValue(Ext.getCmp('gpGestMagnitud').getSelectionModel().getSelected().data.fechainicio);
        Ext.getCmp('ffinum').setMaxValue(Ext.getCmp('gpGestMagnitud').getSelectionModel().getSelected().data.fechafin);
        Ext.getCmp('ffinum').validate();
        Ext.getCmp('finicioum').setMaxValue(Ext.getCmp('gpGestMagnitud').getSelectionModel().getSelected().data.fechafin);
        Ext.getCmp('finicioum').setMinValue(Ext.getCmp('gpGestMagnitud').getSelectionModel().getSelected().data.fechainicio);
        Ext.getCmp('finicioum').validate();
    }

    function activarBotonesWinUM(){
        if (fpUM.getForm().isValid()) {
            if(isOpenWIUM){
                Ext.getCmp('idbtnAceptar_UM').enable();
                Ext.getCmp('btnAplicar_UM').enable();
            }else if(isOpenWMUM){
                var recordData = smGpGestUM.getSelected().data,
                    formData = fpUM.getForm().getValues();
                formData.decimales = formData.decimales ? 1 : 0;

                if ((!grigfactorconversion.getSelectionModel().getSelected()
                        ? false : grigfactorconversion.getSelectionModel().getSelected().data.factorconversion != fpUM.getForm().getValues().factorconversionUM)
                    || recordData.descripcionunidadmedida != formData.descripcionum
                    || recordData.fechainicio != formData.finicioum
                    || recordData.abreviaturaunidadmedida != formData.abreviaturaum
                    || recordData.denominacionunidadmedida != formData.denominacionum
                    || recordData.decimales != formData.decimales) {
                    Ext.getCmp('idbuttonModUm').enable();
                }else{
                    if(!smGpGestUM.getSelected().data.fechafin && !fpUM.getForm().getValues().ffinum){
                        Ext.getCmp('idbuttonModUm').disable();
                    }else if(smGpGestUM.getSelected().data.fechafin != fpUM.getForm().getValues().ffinum){
                        Ext.getCmp('idbuttonModUm').enable();
                    }else{
                        Ext.getCmp('idbuttonModUm').disable();
                    }
                }
            }
        }else{
            if(isOpenWIUM){
                Ext.getCmp('idbtnAceptar_UM').disable();
                Ext.getCmp('btnAplicar_UM').disable();
            }else if(isOpenWMUM){
                Ext.getCmp('idbuttonModUm').disable();
            }
        }
    }

    winModUM = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        layout: 'fit',
        title: etiquetasEst.titModunidaddemedida,
        constrain:true,
        width: 500,
        items: fpUM,
        height: 375,
        firstElement:TFdenom,
        defaultButton: 'idCancelarModUm',
        listeners: {
            show: function() {
                map_um.disable();
                Ext.getCmp('ffinum').setMinValue(Ext.getCmp('finicioum').getValue());
                Ext.getCmp('ffinum').validate();
                if (!Ext.getCmp('ffinum').getValue()) {
                    Ext.getCmp('finicioum').setMaxValue(null);
                    Ext.getCmp('finicioum').validate();
                } else {
                    Ext.getCmp('finicioum').setMaxValue(Ext.getCmp('ffinum').getValue());
                    Ext.getCmp('finicioum').validate();
                }
//                fpUM.findById('denominacionum').focus(false, 200);
                isOpenWMUM = true;
                posicionarFechas();
            },
            hide: function() {
                map_um.enable();
                isOpenW = false;
                change_um = false;
                btnAdicionarUM.focus();
                isOpenWMUM = false;
                Ext.getCmp('idbuttonModUm').disable();
            },
            render: function() {
                winModUM.focus();
            }
        },
        buttons: [{
            iconCls: 'cancelar',
            id: 'idCancelarModUm',
            text: etiquetasEst.lbBtnCancelar,
            tooltip: etiquetasEst.tooltipCancelar,
            handler: function() {
                winModUM.hide();
            }
        },
            buttonModUm = new Ext.Button({
                iconCls: 'aceptar',
                id: 'idbuttonModUm',
                disabled: true,
                text: etiquetasEst.lbBtnAceptar,
                tooltip: etiquetasEst.tooltipAceptar,
                handler: function() {
                    fpUM.getForm().setValues({
                        //factorconversionUM : Ext.getCmp('factorconversionUM').getValue(),
                        descripcionum : fpUM.getForm().getValues().descripcionum.trim(),
                        finicioum : fpUM.getForm().getValues().finicioum.trim(),
                        ffinum : fpUM.getForm().getValues().ffinum.trim(),
                        abreviaturaum : fpUM.getForm().getValues().abreviaturaum.trim(),
                        denominacionum : fpUM.getForm().getValues().denominacionum.trim()
                    });
                    adicionarUM();
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

function adicionarUM(apl) {
    if (opciones == 'mod' && change_um == false) {
        mostrarMensaje(1, etiquetasEst.textNoCamposModific);
    }
    else {
        conversiones = [];
        for (var i = 0; i < Ext.getCmp('grig').getStore().getRange().length; i++) {
            if (Ext.getCmp('grig').getStore().getRange()[i].data.factorconversion != '') {
                conversiones[i] = new Object();
                conversiones[i].idunidadmedida = Ext.getCmp('grig').getStore()
                    .getRange()[i].data.idunidadmedida;

                conversiones[i].factorconversion = Ext.getCmp('grig').getStore()
                    .getRange()[i].data.factorconversion;
            }
        }
        if (fpUM.getForm().isValid()) {
            fpUM.getForm().setValues({
                //factorconversionUM : Ext.getCmp('factorconversionUM').getValue().trim(),
                descripcionum : fpUM.getForm().getValues().descripcionum.trim(),
                finicioum : fpUM.getForm().getValues().finicioum.trim(),
                ffinum : fpUM.getForm().getValues().ffinum.trim(),
                abreviaturaum : fpUM.getForm().getValues().abreviaturaum.trim(),
                denominacionum : fpUM.getForm().getValues().denominacionum.trim()
            });
            if(fpUM.getForm().getValues().denominacionum != '') {
                if(Ext.getCmp('denominacionum').getValue().toString().length < Ext.getCmp('abreviaturaum').getValue().toString().length){
                    //mostrarMensaje(1, etiquetasEst.msgAbrvMayorDenominacion);
                    if(isOpenWIUM){
                        Ext.getCmp('idbtnAceptar_UM').disable();
                        Ext.getCmp('btnAplicar_UM').disable();
                    }else if(isOpenWMUM){
                        Ext.getCmp('idbuttonModUm').disable();
                    }
                    Ext.getCmp('abreviaturaum').focus();
                    Ext.getCmp('abreviaturaum').selectText();
                    Ext.getCmp('abreviaturaum').markInvalid(etiquetasEst.msgAbrvMayorDenominacion);
                    return;
                }
                fpUM.getForm().submit({
                    url: 'adicionarum',
                    params: {
                        idmagnitudO: Ext.getCmp('gpGestMagnitud').getSelectionModel().getSelected().data.idmagnitud,
                        conversiones: Ext.encode(conversiones)
                    },
                    waitMsg: etiquetasEst.msgLoadMaskUM,
                    failure: function (form, action) {
                        if (action.result.codMsgg != -3 && action.result.codMsgg != -42
                            && action.result.codMsgg != -43) {
                            if (!apl) {
                                if (opciones == 'add')
                                    winAddUM.hide();
                                if (opciones == 'mod')
                                    winModUM.hide();
                            }
                            gpGestUM.getStore().reload({
                                params: {
                                    start: 0,
                                    limit: 20
                                },
                                callback: function () {
                                    if (action.result.codMsgg == -1) {
                                        mostrarMensaje(1, etiquetasEst.lbmsgAdicionadoo);
                                        fpUM.getForm().reset();
                                        Ext.getCmp('grig').getStore().reload();
                                        btnAdicionarUM.focus();
                                        Ext.getCmp('ffinum').setMinValue(Ext.getCmp('finicioum').getValue());
                                        Ext.getCmp('finicioum').setMaxValue(null);
                                        Ext.getCmp('finicioum').validate();
                                        Ext.getCmp('ffinum').validate();


                                    }
                                    if (action.result.codMsgg == -2) {
                                        mostrarMensaje(1, etiquetasEst.msgModificadoo)
                                        fpUM.getForm().reset();
                                        btnAdicionarUM.focus();
                                        Ext.getCmp('ffinum').setMinValue(Ext.getCmp('finicioum').getValue());
                                        Ext.getCmp('finicioum').setMaxValue(null);
                                        Ext.getCmp('finicioum').validate();
                                        Ext.getCmp('ffinum').validate();


                                    }

                                }
                            });
                        } else {
                            if (action.result.codMsgg == -42) {
                                mostrarMensaje(1, etiquetasEst.msgExiteUM);
                                btnAdicionarUM.focus();
                                smGpGestUM.clearSelections();
                                btnModificarUM.disable();
                                btnEliminarUM.disable();
                                isOpenW = false;

                            }
                            if (action.result.codMsgg == -43) {
                                mostrarMensaje(1, etiquetasEst.msgModExiteUM);
                                btnAdicionarUM.focus();
                                smGpGestUM.clearSelections();
                                btnModificarUM.disable();
                                btnEliminarUM.disable();
                                isOpenW = false;

                            }
                            if (action.result.codMsgg == -3) {
                                mostrarMensaje(1, etiquetasEst.lbmsgError);

                                btnAdicionarUM.focus();
                                smGpGestUM.clearSelections();
                                btnModificarUM.disable();
                                btnEliminarUM.disable();
                                isOpenW = false;
                            }

                        }


                    }
                });
            }else{
                if(isOpenWIUM){
                    Ext.getCmp('idbtnAceptar_UM').disable();
                    Ext.getCmp('btnAplicar_UM').disable();
                }else if(isOpenWMUM){
                    Ext.getCmp('idbuttonModUm').disable();
                }
            }
        }
        else {
            mostrarMensaje(1, etiquetasEst.CamposVacios);
        }
    }

}