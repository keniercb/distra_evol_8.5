Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil;
UCID.portal.cargarEtiquetas('gestionaresp', cargarInterfaz);
var win2, win3;
var lMask;
var flag_spacio = false;
var idcriterio = 0;
var stformato;
var nodoactual = null;
var nivel = null;
var oldvalue = null;
var windowopen = false;
var busquedaFormato = false;
var nodeSelected = new Object();
var elim = false;
var isWinOpenMod = false;
var isWinOpenIns = false;
function cargarInterfaz(perfil, etiquetas) {
    this.TaskFormValidation = TaskFormValidation;

    //Botones btnAdicionar,btnModificar,btnEliminar,btnVistaPrevia modificados para gestionar recursos de seguridad
    // hidden:true, ---- abreviatura: ....
    var btnAdicionar = new Ext.Button({
        id: 'add_especialidad',
        //hidden:true,
        iconCls: 'adicionar',
        text: etiquetas.btnAdicionar,
        tooltip: etiquetas.btnTooAdicionar,
        disabled: false,
        handler: function() {
            GestionarEsp('add');
        },
        abreviatura: 'add_especialidad'

    });
    validate.addButton(btnAdicionar);
    var btnModificar = new Ext.Button({
        id: 'especialidad_Adicionar',
        //hidden:true,
        iconCls: 'modificar',
        text: etiquetas.btnModificar,
        tooltip: etiquetas.btnTooModificar,
        disabled: true,
        handler: function() {
            elim = false;
            GestionarEsp('mod');
        },
        abreviatura: 'add_especialidad'

    });
    validate.addButton(btnModificar);
    var btnEliminar = new Ext.Button({
        id: 'del_especialidad',
        iconCls: 'eliminar',
        text: etiquetas.btnEliminar,
        tooltip: etiquetas.bTtEliminar,
        disabled: true,
        handler: function() {
            elim = true;
            mostrarMensaje(2, etiquetas.lbTEliminar, OnbtnAceptarEliminar);
        },
        abreviatura: 'del_especialidad'

    });
    validate.addButton(btnEliminar);
    var btnVistaPrevia = new Ext.Button({
        id: 'vReporte_especialidad',
        iconCls: 'vistareporte',
        tooltip: etiquetas.tooltipVistaReporte,
        text: etiquetas.lbVistaReporte,
        handler: function() {
            elim = false;
            fObtenerDatosImprimirReporte();
        },
        abreviatura: 'vReporte_especialidad'

    });
    validate.addButton(btnVistaPrevia);
    //Ocultando primero todos los botones
    //Validando permisos de acceso a los recurdos en los botones
    validate.checkPermisos();
    var btnAyuda = new Ext.Button({
        iconCls: 'ayuda',
        id: 'bntHelpEspecialidadcont',
        text: etiquetas.lbBtnAyuda,
        tooltip: etiquetas.lntooltipWindAyuda/*,
        handler: function() {
            elim = false;
            help.show(etiquetas.lbBtnAyuda, 'CG/NG/Especialidad');
        }*/
    });

    Ext.apply(Ext.form.VTypes, {
        daterange: function(val, field) {
            var date = field.parseDate(val);
            var dispUpd = function(picker) {
                var ad = picker.activeDate;
                picker.activeDate = null;
                picker.update(ad);
            };
            if (field.startDateField) {
                var sd = Ext.getCmp(field.startDateField);
                sd.maxValue = date;
                if (sd.menu && sd.menu.picker) {
                    sd.menu.picker.maxDate = date;
                    dispUpd(sd.menu.picker);
                }
            } else if (field.endDateField) {
                var ed = Ext.getCmp(field.endDateField);
                ed.minValue = date;
                if (ed.menu && ed.menu.picker) {
                    ed.menu.picker.minDate = date;
                    dispUpd(ed.menu.picker);
                }
            }
            return true;
        }
    });

    var lcodigo = new Ext.form.Label({
        id: 'lcodigo',
        width: '100%',
        html: etiquetas.lCodigo
    });

    var ldesnominacion = new Ext.form.Label({
        id: 'ldesnominacion',
        width: '100%',
        html: etiquetas.lDnominacion
    });

    var labreviatura = new Ext.form.Label({
        id: 'labreviatura',
        width: '100%',
        html: etiquetas.lAbreviatura
    });

    var lfinocio = new Ext.form.Label({
        id: 'lfinocio',
        width: '100%',
        html: etiquetas.lFinicio
    });

    var lffin = new Ext.form.Label({
        id: 'lffin',
        width: '100%',
        html: etiquetas.lFfin
    });

    var panelDetalles = new Ext.Panel({
        title: etiquetas.lbDetalles,
        id: 'detalles',
        collapsed: true,
        collapsible: true,
        frame: 'true',
        margins: '0 3 3 3',
        region: 'south',
        height: 130,
        items: [{
                xtype: 'fieldset',
                height: 130,
                width: '98%',
                autoScroll: true,
                autoHeight: true,
                items: [
                    {
                        style: 'font-size:12px',
                        items: lcodigo
                    },
                    {
                        style: 'margin 20 0 20 0;font-size:12px',
                        items: labreviatura
                    },
                    {
                        style: 'margin 0 0 20 0;font-size:12px',
                        items: ldesnominacion
                    },
                    {
                        style: 'margin 0 0 20 0;font-size:12px',
                        items: lfinocio
                    },
                    {
                        style: 'margin 0 0 20 0;font-size:12px',
                        items: lffin
                    }]
            }]
    });

    var denom = new Ext.form.TextField({
        tabIndex: 3,
        blankText: etiquetas.textCampoObligado,
        allowBlank: false,
        maxLengthText: String.format(etiquetas.textMaxLength,255),
        name: 'denespecialidad',
        fieldLabel: etiquetas.lbDenominacion,
        enableKeyEvents: true,
        listeners:{
            keyup: function(){
                activarBotonesWin();
        }
        },
        regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\-\,]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\-\,]*)+$/,
        maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\-\,]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\-\,]*)+$/,
        //maskRe: /^([a-zA-Z0-9 \xC1\xC9\xD3\xDA\xCD\xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\/\-\_\+\(\)\#\"\,\:\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]*)+$/, // xf3-�, �, �, �, �, �, �, xfc-�   Espacios y caracteres especiales
        //regex: /^([a-zA-Z0-9 \xC1\xC9\xD3\xDA\xCD\xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\/\-\_\+\(\)\#\"\,\:\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]*)+$/, // xf3-�, �, �, �, �, �, �, xfc-�  Espacios y caracteres especiales
        regexText: etiquetas.textValorIncorrectoAlfanum,
        anchor: '100%',
        maxLength: 255,
        tabIndex: 3
    });

    var codigo = new Ext.form.TextField({
        id: 'codespecialidad',
        tabIndex: 1,
        blankText: etiquetas.textCampoObligado,
        allowBlank: false,
        maxLength: 3,
        maxLengthText: etiquetas.textTamanno,
        name: 'codespecialidad',
        fieldLabel: etiquetas.lbCodigo,
        regex: /^[0-9]+$/,
        maskRe: /^[0-9]+$/,
        enableKeyEvents: true,
        regexText: etiquetas.textValorIncorrectoCod,
        anchor: '100%',
        listeners:{
            keyup: function(){
                activarBotonesWin();
        }
        },
        tabIndex: 1
    });

    codigo.maxLengthText = etiquetas.textTamanno;

    codigo.on('change', function(tf, nv, vv) {
        oldvalue = vv;
    });

    var abreviatura = new Ext.form.TextField({
        tabIndex: 2,
        name: 'abrevespecialidad',
        blankText: etiquetas.textCampoObligado,
        maxLength: 20,
        enableKeyEvents: true,
        maxLengthText: etiquetas.textTamannoAbrev,
        allowBlank: true,
        listeners:{
            keyup: function(){
                activarBotonesWin();
        }
        },
        hiddenName: 'abrevespecialidad',
        fieldLabel: etiquetas.lbAbreviatura,
        regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\-\_\"\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]*)+$/,
        maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\-\_\"\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]*)+$/,
        // maskRe: /^([a-zA-Z0-9 \xC1\xC9\xD3\xDA\xCD\xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\-\_\"\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]*)+$/, // xf3-�, �, �, �, �, �, �, xfc-�   Espacios y caracteres especiales
        //regex: /^([a-zA-Z0-9 \xC1\xC9\xD3\xDA\xCD\xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\/\-\_\+\(\)\#\"\,\:\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]*)+$/, // xf3-�, �, �, �, �, �, �, xfc-�  Espacios y caracteres especiales
        anchor: '100%',
        tabIndex: 2,
        regexText: etiquetas.textValorIncorrectoAlfanum
    });

    var fechaini = new Ext.form.DateField({
        fieldLabel: etiquetas.lbFechaini,
        enableKeyEvents: true,
        tabIndex: 4,
        allowBlank: false,
        //value: new Date(),
        name: 'fechaini',
        id: 'pformini',
        vtype: 'daterange',
        minText: etiquetas.lbmsgMinDate,
        maxText: etiquetas.lbmsgMaxDate,
        endDateField: 'pformfin',
        format: 'd/m/Y',
        //maskRe: /^()+$/,
        listeners: {
            keyup: function () {
                activarBotonesWin();
            },
            change: function(){
                activarBotonesWin();
            }
        },
        invalidText: etiquetas.invalidTextFecha,
        emptyText: etiquetas.etSelect,
        editable: true,
        anchor: '100%'
    });

    var fechafin = new Ext.form.DateField({
        disabled: true,
        fieldLabel: etiquetas.lbFechafin,
        enableKeyEvents: true,
        tabIndex: 5,
        editable: true,
        name: 'fechafin',
        id: 'pformfin',
        vtype: 'daterange',
        startDateField: 'pformini',
        minText: etiquetas.lbmsgMinDate,
        maxText: etiquetas.lbmsgMaxDate,
        format: 'd/m/Y',
        //maskRe: /^()+$/,
        listeners: {
            keyup: function () {
                activarBotonesWin();
            },
            change: function(){
                activarBotonesWin();
            }
        },
        invalidText: etiquetas.invalidTextFecha,
        anchor: '100%'
    });

    var especialidad = new Ext.form.Hidden({
        name: 'idespecialidad'
    });

    var pform = new Ext.FormPanel({
        layout: 'form',
        frame: true,
        region: 'center',
        labelAlign: 'top',
        //trackResetOnLoad: true,
        items: [
            especialidad, {
                layout: 'column',
                items: [{
                        style: 'margin:0 0 0 10',
                        columnWidth: .5,
                        layout: 'form',
                        items: [codigo]
                    }, {
                        style: 'margin:0 0 0 10',
                        columnWidth: .5,
                        layout: 'form',
                        items: [abreviatura]
                    }]
            }, {
                layout: 'column',
                items: [{
                        style: 'margin:0 0 0 10',
                        columnWidth: 1,
                        layout: 'form',
                        items: [denom]
                    }]
            }, {
                layout: 'column',
                items: [{
                        style: 'margin:0 0 0 10',
                        columnWidth: .5,
                        layout: 'form',
                        items: [fechaini]
                    }, {
                        style: 'margin:0 0 0 10',
                        columnWidth: .5,
                        layout: 'form',
                        items: [fechafin]
                    }]
            }]
    });

    fechaini.on('valid', function() {
        if (fechaini.getRawValue() != '') {
            fechafin.enable();
            fechafin.setMinValue(fechaini.getRawValue());
        }
    });

    /*fechaini.on('invalid', function() {
        if (fechaini.getRawValue() != '') {
            fechafin.disable();
            fechafin.setRawValue('');
        }
    }); */
    fechaini.on('change', function() {
        fechafin.setMinValue(fechaini.getRawValue());
        fechafin.enable();
    });

    function crearVentana(level) {
        if (!win2) {
            win2 = new Ext.Window({
                id: 'win2',
                layout: 'fit',
                /*width: Ext.lib.Dom.getViewWidth() * 0.5,
                height: 240,*/
                width: 350,
                height: 230,
                resizable: false,
                constrain:true,
                modal: true,
                autoValidate: false,
                closeAction: 'hide',
                defaultButton: 'idbtnAceptarAdd',
                buttons: [{
                        iconCls: 'cancelar',
                        tabIndex: 7,
                        text: etiquetas.btnCancelar,
                        tooltip: etiquetas.btnTooCancelar,
                        handler: function() {
                            win2.hide();
                            pform.getForm().reset();
                        }
                    }, {
                        iconCls: 'aplicar',
                        text: etiquetas.btnAplicar,
                        tabIndex: 8,
                        id: 'idbtnAplicarAdd',
                        disabled: true,
                        tooltip: etiquetas.btnTooAplicar,
                        handler: function() {
                            aceptar('apl');

                        }
                    }, {
                        iconCls: 'aceptar',
                        id: 'idbtnAceptarAdd',
                        tabIndex: 9,
                        text: etiquetas.btnAceptar,
                        disabled: true,
                        tooltip: etiquetas.btnTooAceptar,
                        handler: function() {
                            aceptar();
                        }
                    }
                ],
                keys: ({
                    key: Ext.EventObject.ENTER,
                    handler: function() {
                        aceptar();
                    }
                }),
                listeners: {
                    hide: function() {//evento al ocultarse
                        windowopen = false; // no  esta abierta la ventana
                        btnAdicionar.focus();
                        isWinOpenIns = false;
                        Ext.getCmp('idbtnAceptarAdd').disable();
                        Ext.getCmp('idbtnAplicarAdd').disable();
                    },
                    show: function() { //evento al mostrarse
                        windowopen = true;
                        isWinOpenIns = true;
                        validatorFechas();
                    },
                    render: function() {
                        win2.focus();
                    }
                }
            });

        }
        level = parseFloat(level) + 1;
        win2.setTitle(etiquetas.lbTAdicionar + level);
        win2.on('beforeshow', function() {
            Ext.getCmp('idbtnAceptarAdd').getEl().addKeyMap([
                {
                    key: Ext.EventObject.TAB,
                    stopEvent: true,
                    fn: function() {
                        codigo.focus(true, true);
                    }
                }
            ]);

            /*codigo.getEl().addKeyMap({
                key: Ext.EventObject.TAB,
                shift: true,
                stopEvent: true,
                fn: function() {
                    Ext.getCmp('idbtnAceptarAdd').getEl().focus();
                }
            });*/
        });

    }

    function activarBotonesWin() {
        if (pform.getForm().isValid()) {
            if (isWinOpenIns) {
                Ext.getCmp('idbtnAceptarAdd').enable();
                Ext.getCmp('idbtnAplicarAdd').enable();
            } else if (isWinOpenMod) {
                if (trEE.getSelectionModel().getSelectedNode().attributes.codespecialidad != pform.getForm().getValues().codespecialidad
                    || trEE.getSelectionModel().getSelectedNode().attributes.denespecialidad != pform.getForm().getValues().denespecialidad
                    || trEE.getSelectionModel().getSelectedNode().attributes.abrevespecialidad != pform.getForm().getValues().abrevespecialidad
                    || trEE.getSelectionModel().getSelectedNode().attributes.fechaini != pform.getForm().getValues().fechaini
                    || trEE.getSelectionModel().getSelectedNode().attributes.fechafin != pform.getForm().getValues().fechafin) {
                    Ext.getCmp('idbtnAceptarMod').enable();
                } else {
                    Ext.getCmp('idbtnAceptarMod').disable();
                }
            }
        } else {
            if (isWinOpenIns) {
                Ext.getCmp('idbtnAceptarAdd').disable();
                Ext.getCmp('idbtnAplicarAdd').disable();
            } else if (isWinOpenMod) {
                Ext.getCmp('idbtnAceptarMod').disable();
            }
        }
    }
    function modificarVentana(level) {
        if (!win3) {
            win3 = new Ext.Window({
                id: 'win3',
                layout: 'fit',
                /*width: Ext.lib.Dom.getViewWidth() * 0.5,
                height: 240,*/
                width: 350,
                constrain:true,
                autoValidate: false,
                height: 230,
                resizable: false,
                modal: true,
                closeAction: 'hide',
                defaultButton: 'idbtnAceptarMod',
                buttons: [{
                        iconCls: 'cancelar',
                        tabIndex: 6,
                        text: etiquetas.btnCancelar,
                        tooltip: etiquetas.btnTooCancelar,
                        handler: function() {
                            pform.getForm().reset();
                            win3.hide();
                        }
                    },
                    {
                        iconCls: 'aceptar',
                        id: 'idbtnAceptarMod',
                        disabled: true,
                        text: etiquetas.btnAceptar,
                        tooltip: etiquetas.btnTooAceptar,
                        handler: function() {
                            modificar(oldvalue);
                        }
                    }
                ],
                keys: ({
                    key: Ext.EventObject.ENTER,
                    handler: function () {
                        modificar(oldvalue);
                    }
                }),
                listeners: {
                    hide: function() {//evento al ocultarse
                        windowopen = false; // no  esta abierta la ventana
                        btnAdicionar.focus();
                        Ext.getCmp('idbtnAceptarMod').disable();
                        isWinOpenMod = false;
                    },
                    show: function() { //evento al mostrarse
                        windowopen = true;
                        isWinOpenMod = true;
                        validatorFechas();
                    }, render: function() {
                        win3.focus();
                    }

                }
            });
        }
        win3.setTitle(etiquetas.lbTModificar + level);
    }
    //**********  Funcion Aceptar para formulario Adicionar  ***********
    function aceptar(apl) {
        if (pform.getForm().isValid()) {
            abreviatura.setValue(abreviatura.getValue().trim());
            denom.setValue(denom.getValue().trim());
            codigo.setValue(codigo.getValue().trim());
            if(codigo.getValue() != '' && denom.getValue() != '') {
                Ext.Msg.wait(etiquetas.lbWaitReg, etiquetas.lbEsperando);
                Ext.Ajax.request({
                    url: 'insertar',
                    method: 'POST',
                    params: {
                        fechaini: fechaini.getRawValue(),
                        abrevespecialidad: abreviatura.getValue(),
                        denespecialidad: denom.getValue(),
                        codespecialidad: codigo.getValue(),
                        fechafin: fechafin.getRawValue(),
                        idpadre: trEE.getSelectionModel().getSelectedNode().attributes.id,
                        nivel: nivel + 1
                    },
                    callback: function (options, success, response) {
                        Ext.Msg.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgg == -1) {
                            mostrarMensaje(1, etiquetas.lbTAdicionado);
                            pform.getForm().reset();
                            fechaini.setValue(new Date());
                            var expPath = trEE.getSelectionModel().getSelectedNode().getPath();
                            trEE.getRootNode().reload();
                            trEE.expandPath(expPath);
                            if (!apl) {
                                win2.hide();
                            }

                            btnEliminar.disable();
                            btnModificar.disable();
                            nodeSelected.nodoSeleccionado.leaf = false;

                        }
                        else if (responseData.codMsgg == -2) {
                            Ext.getCmp('idbtnAceptarAdd').disable();
                            Ext.getCmp('idbtnAplicarAdd').disable();
                            mostrarMensaje(1, etiquetas.lbMsgYaexisteEspByCodig);
                        }
                        else if (responseData.codMsgg == -3) {
                            Ext.getCmp('idbtnAceptarAdd').disable();
                            Ext.getCmp('idbtnAplicarAdd').disable();
                            mostrarMensaje(1, etiquetas.lbMsgYaexisteEspByNombre);
                        }
                    }
                });
            }else{
                Ext.getCmp('idbtnAceptarAdd').disable();
                Ext.getCmp('idbtnAplicarAdd').disable();
            }
        } else {
            mostrarMensaje(1, etiquetas.textVerifiqueNuevamente);
        }
    }
    //*************  Funcion Modificar  ***************
    function modificar() {
        if (pform.getForm().isDirty()) {
            abreviatura.setValue(abreviatura.getValue().trim());
            denom.setValue(denom.getValue().trim());
            codigo.setValue(codigo.getValue().trim());
            if (pform.getForm().isValid()) {
                if(codigo.getValue() != '' && denom.getValue() != '') {
                    Ext.Ajax.request({
                        url: 'verificar',
                        method: 'POST',
                        params: {
                            fechaini: fechaini.getRawValue(),
                            idespecialidad: trEE.getSelectionModel().getSelectedNode().attributes.id,
                            abrevespecialidad: abreviatura.getValue(),
                            denespecialidad: denom.getValue(),
                            codespecialidad: codigo.getValue(),
                            fechafin: fechafin.getRawValue(),
                            ordenizq: trEE.getSelectionModel().getSelectedNode().attributes.ordenizq,
                            ordender: trEE.getSelectionModel().getSelectedNode().attributes.ordender
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            if(responseData.modifico == 'fechainicio'){
                                mostrarMensaje(responseData.codMsgg, etiquetas.lbFechaInicioRango);
                            }else if(responseData.modifico == 'fechafin'){
                                mostrarMensaje(responseData.codMsgg, etiquetas.lbFechaFinRango);
                            }else if (responseData.modifico == 'nomodifico') {
                                mostrarMensaje(responseData.codMsgg, etiquetas.lbTNoModificado);
                            }else {
                                var nodeSelect = trEE.getSelectionModel().getSelectedNode();
                                var parentNode = nodeSelect.parentNode;


                                pform.getForm().submit({
                                    url: 'modificar',
                                    waitMsg: etiquetas.lbWaitReg,
                                    params: {
                                        ov: oldvalue,
                                        nivel: nivel,
                                        idpadre: parentNode.id
                                    },
                                    failure: function (form, action) {
                                        oldvalue = null;
                                        if (action.result.codMsgg == -1) {
                                            mostrarMensaje(1, etiquetas.lbTModificado);
                                            pform.getForm().reset();
                                            win3.hide();
                                            var padre = nodeSelected.nodoSeleccionado.parentNode;
                                            trEE.getLoader().load(nodeSelected.nodoSeleccionado.parentNode, function () {
                                                padre.expand();
                                                nodoactual = parentNode.id;
                                                nivel = parentNode.getDepth();
                                            });
                                            btnEliminar.disable();
                                            btnModificar.disable();
                                            Ext.ComponentMgr.get('detalles').collapse();
                                        }
                                        else if (action.result.codMsgg == -2) {
                                            mostrarMensaje(1, etiquetas.lbMsgYaexisteEspByCodig);
                                        }
                                        else if (action.result.codMsgg == -3) {
                                            mostrarMensaje(1, etiquetas.lbMsgYaexisteEspByNombre);
                                        }
                                    }
                                });
                            }
                        }
                    });
                }else{
                    Ext.getCmp('idbtnAceptarMod').disable();
                }
            }
            else
                mostrarMensaje(1, etiquetas.textVerifiqueNuevamente);
                Ext.getCmp('idbtnAceptarMod').disable();
        }
        else {
            mostrarMensaje(1, etiquetas.msgNoValorModif);
            Ext.getCmp('idbtnAceptarMod').disable();
        }
    }
    function validatorFechas() {
        var nodosel = trEE.getSelectionModel().getSelectedNode();
        if (isWinOpenMod) {
            nodosel = nodosel.parentNode;
        }
        if(nodosel == trEE.getRootNode()){
            fechaini.reset();
            fechafin.reset();
            fechaini.setMinValue(0);
            fechafin.setMinValue(0);
            fechafin.setMaxValue(null);
            fechaini.setMaxValue(null);
            fechafin.clearInvalid();
            fechaini.clearInvalid();
            return;
        }
        fechaini.reset();
        fechafin.reset();
        if (nodosel.attributes.fechaini && nodosel != trEE.getRootNode()) {
            fechaini.setMinValue(nodosel.attributes.fechaini);
            fechafin.setMinValue(nodosel.attributes.fechaini);
        }
        while(nodosel != trEE.getRootNode()){
            if (nodosel.attributes.fechafin) {
                fechafin.setMaxValue(nodosel.attributes.fechafin);
                fechaini.setMaxValue(nodosel.attributes.fechafin);
                fechafin.clearInvalid();
                fechaini.clearInvalid();
                return;
            }
            nodosel = nodosel.parentNode;
        }
    }

    var sfEspecialidad = new Ext.Cont.SearchField({
        id: 'sfEspecialidad',
        width: 250,
        emptyText: etiquetas.lbCriterioBuscar,
        searchTooltip: etiquetas.lbsearchTooltip,
        regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]*)+$/,
        maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]*)+$/,
        fnOnSearch: function() {
            busquedaFormato = true;
            filterEspecialidad();

        },
        fnOnClear: function() {
            busquedaFormato = false;
            filterEspecialidad();
        }
    });

    var treeLoader = new Ext.tree.TreeLoader({
        dataUrl: 'cargararbol',
        baseParams: {
            opcion: 1,
            filter: ''
        }
    });

    treeLoader.on({
        load: function(This, node, response) {
            node.select();
            if (trEE.root.childNodes.length == 0 && busquedaFormato == true) {
                mostrarMensaje(1, etiquetas.messNoResult);
                busquedaFormato = false;
            }
            if (trEE.root.childNodes.length == 0 && busquedaFormato == false && elim == false) {
                mostrarMensaje(1, etiquetas.messNoResult1);
            }
            if (busquedaFormato = true)
                busquedaFormato = false;

            if (node.attributes.id != 0) {
                var nodes = node.childNodes;
                for (var i in nodes) {
                    var nodo = nodes[i];
                    var codespecialidad = ''; //almacena el codigo de la especialidad padre
                    while (nodo.id > 0 && nodo.parentNode.id != 0) {
                        if (codespecialidad == '')
                            codespecialidad = nodo.parentNode.attributes.codespecialidad + codespecialidad + '.';
                        else
                            codespecialidad = nodo.parentNode.attributes.codespecialidad + '.' + codespecialidad;
                        nodo = nodo.parentNode;
                    }
                    if (codespecialidad != '')
                        nodes[i].setText(codespecialidad + nodes[i].attributes.text);
                }
            }
        },
        beforeload: function(treeLoader, node) {
            if (busquedaFormato) {
                treeLoader.baseParams.filter = sfEspecialidad.getRawValue();
                treeLoader.baseParams.opcion = 2;
            }
            else {
                treeLoader.baseParams.filter = '';
                treeLoader.baseParams.opcion = 1;
            }
        }
    });

    var trEE = new Ext.tree.TreePanel({
        width: Ext.lib.Dom.getViewWidth() * 1 / 2,
        autoScroll: true,
        split: true,
        id: 'idTreeEspecialidad',
        region: 'center',
        loader: treeLoader,
        selModel: new Ext.tree.DefaultSelectionModel(),
        tbar: [sfEspecialidad],
        layoutConfig: {
            animate: true
        }, loadMask: function(msg) {
            this.mask = new Ext.LoadMask(this.body, {
                msg: msg
            });
            this.mask.show();
        }
    });

    var nodoPadre = new Ext.tree.AsyncTreeNode({
        text: etiquetas.lbRootArbol,
        id: '0',
        expanded: true
    });

    trEE.setRootNode(nodoPadre);
    trEE.show();
    trEE.on('resize', function(cmp, adjWidth, adjHeight, rawWidth, rawHeight) {
        //sfEspecialidad.setWidth(adjWidth);
        cmp.doLayout();
    });

    var nodo, collapse = true;
    //**********  Evento click en el arbol ***********
    trEE.on('click', function(node, e) {
        nodeSelected.nodoSeleccionado = node;
        nodoactual = node.attributes.id;
        nivel = node.getDepth();
        if (node.attributes.id != 0) {
            btnModificar.enable();
            mostrarDetalles(dameNodeInfo(node).data);
            btnEliminar.enable();
        }
        else {
            clearDetalles();
            btnModificar.disable();
            btnEliminar.disable();
        }
    }, this);

    function filterEspecialidad() {
        treeLoader.baseParams = {
            opcion: (busquedaFormato == true) ? 2 : 1,
            filter: (busquedaFormato == true) ? sfEspecialidad.getRawValue() : ''
        };

        treeLoader.load(trEE.getRootNode(), function() {
            trEE.getRootNode().expand();
        });
    }

    var dameNodeInfo = function(node) {
        var record = Ext.data.Record.create(
                [{
                        name: 'abrevespecialidad1'
                    },
                    {
                        name: 'denespecialidad1'
                    },
                    {
                        name: 'codespecialidad1'
                    },
                    {
                        name: 'orden1'
                    },
                    {
                        name: 'fechaini1'
                    },
                    {
                        name: 'fechafin1'
                    }]
                );
        return new record(
                {
                    abrevespecialidad1: node.attributes.abrevespecialidad,
                    denespecialidad1: node.attributes.denespecialidad,
                    codespecialidad1: node.attributes.codespecialidad,
                    orden1: node.attributes.orden,
                    fechaini1: node.attributes.fechaini,
                    fechafin1: node.attributes.fechafin
                });
    };

    var dameNodeInfoModificar = function(node) {
        var record = Ext.data.Record.create(
                [{
                        name: 'idespecialidad'
                    },
                    {
                        name: 'abrevespecialidad'
                    },
                    {
                        name: 'denespecialidad'
                    },
                    {
                        name: 'codespecialidad'
                    },
                    {
                        name: 'orden'
                    },
                    {
                        name: 'fechaini'
                    },
                    {
                        name: 'fechafin'
                    }]
                );
        return new record(
                {
                    idespecialidad: node.attributes.id,
                    abrevespecialidad: node.attributes.abrevespecialidad,
                    denespecialidad: node.attributes.denespecialidad,
                    codespecialidad: node.attributes.codespecialidad,
                    orden: node.attributes.orden,
                    fechaini: node.attributes.fechaini,
                    fechafin: node.attributes.fechafin
                });
    };

    var pfondo = new Ext.Panel({
        id: 'id',
        border: false,
        layout: 'border',
        listeners: {render: function() {
                btnAdicionar.focus();
            }},
        items: [
            trEE, panelDetalles],
        tbar: [btnAdicionar, btnModificar, btnEliminar, btnVistaPrevia, '->', btnAyuda]
    });

    new Ext.Viewport({layout: 'fit', id: 'id', items: [pfondo]});
    hotKeys = new Ext.KeyMap(Ext.getBody(), [
        {//adicionar
            key: 'i',
            alt: true,
            fn: function() {
                if (!windowopen && !btnAdicionar.disabled) {
                    GestionarEsp('add');
                }
            }
        }, {//modificar
            key: 'm',
            alt: true,
            fn: function() {
                if (!windowopen && !btnModificar.disabled) {
                    GestionarEsp('mod');
                }
            }
        }, {//eliminar
            key: Ext.EventObject.DELETE,
            fn: function() {
                if (!windowopen && !btnEliminar.disabled) {
                    mostrarMensaje(2, etiquetas.lbTEliminar, OnbtnAceptarEliminar);
                }
            }
        }, {
            key: 'b',
            alt: true,
            fn: function() {
                if(Ext.getCmp('sfEspecialidad').getRawValue().length > 0){
                    Ext.getCmp('sfEspecialidad').onTrigger2Click();
                }else{
                    Ext.getCmp('sfEspecialidad').focus();
                }
            }
        }, {
            key: 'l',
            alt: true,
            fn: function() {
                if(Ext.getCmp('sfEspecialidad').getRawValue().length > 0) {
                    Ext.EventObject.stopEvent();
                    Ext.getCmp('sfEspecialidad').onTrigger1Click();
                }
            }
        },
        {//Vista reporte
            key: 'r',
            alt: true,
            fn: function() {
                if (!windowopen && !btnVistaPrevia.disabled) {
                    btnVistaPrevia.handler.call();
                }

            }
        }/*, {//Ayuda
            key: 'h',
            alt: true,
            fn: function() {
                elim = false;
                help.show(etiquetas.lbBtnAyuda, 'CG/NG/Especialidad');
            }
        }*/
    ]);

    function GestionarEsp(opn) {
        switch (opn)
        {
            case 'add':
                if (!trEE.getSelectionModel().getSelectedNode()) {
                    mostrarMensaje(1, etiquetas.msgSelNoOneMonedaAdd);
                } else {
                    pform.getForm().reset();
                    level = (parseFloat(trEE.getSelectionModel().getSelectedNode().attributes.id) == 0) ? 0 : trEE.getSelectionModel().getSelectedNode().attributes.nivel;
                    crearVentana(level);
                    win2.show();
                    win2.add(pform);
                    win2.doLayout();
                    fechaini.setValue(new Date());
                    pform.getForm().isValid();
                }
                break;
            case 'mod':
                if (!trEE.getSelectionModel().getSelectedNode()) {
                    mostrarMensaje(1, etiquetas.msgSelNoOneMonedaAdd);
                } else {
                    modificarVentana(trEE.getSelectionModel().getSelectedNode().attributes.nivel);
                    win3.show();
                    win3.add(pform);
                    win3.doLayout();
                    pform.getForm().loadRecord(dameNodeInfoModificar(trEE.getSelectionModel().getSelectedNode()));
                    var arrbotones = new Array();
                     arrbotones.push(win3.buttons[1]);
                     var fieldArray = new Array();
                     fieldArray.push(codigo);
                     fieldArray.push(abreviatura);
                     fieldArray.push(denom);
                     fieldArray.push(fechaini);
                     fieldArray.push(fechafin);
                     this.TaskFormValidation.stopTaskValidation();
                     this.TaskFormValidation.startTaskValidation('mod', null, arrbotones,null,fieldArray);
                }
                break;
        }
    }

    function OnbtnAceptarEliminar(btnPresionado) {
        var nodeSelect = trEE.getSelectionModel().getSelectedNode();
        var padre = nodeSelect.parentNode;
        if (btnPresionado == 'ok') {
            Ext.Msg.wait(etiquetas.lbMsgCargando, etiquetas.lbWaitDel);
            Ext.Ajax.request({
                url: 'eliminar',
                method: 'POST',
                params: {
                    idespecialidad: nodeSelect.attributes.id
                },
                callback: function(options, success, response) {
                    Ext.Msg.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgg == -1) {
                        mostrarMensaje(1, etiquetas.lbTEliminado);
                        Ext.getCmp('idTreeEspecialidad').getLoader().load(padre, function() {
                            var path = padre.getPath();
                            trEE.expandPath(path);
                        });
                        btnEliminar.disable();
                        btnModificar.disable();
                        Ext.ComponentMgr.get('detalles').collapse();
                    } else if (responseData.codMsgg == -4) {
                        mostrarMensaje(1, etiquetas.lbEsdeUso);
                    }
                }
            });

        } else {
            btnAdicionar.focus();
        }
    }

    function fObtenerDatosImprimirReporte() {
        loadMessageBox(etiquetas.msgLoading);
        Ext.Ajax.request({
            url: 'obtenerDatosImprimirReporte',
            method: 'POST',
            callback: function(options, success, response) {
                Ext.MessageBox.hide();
                var responseData = Ext.decode(response.responseText);
                if (responseData.datoCuerpo.length > 0)
                    fOpenWindowReport(responseData);
                else
                    mostrarMensaje(1, etiquetas.msgNoDatosReporte);
            }
        });
    }

    function fOpenWindowReport(requestDataSources) {
        printView = new SCFPrintView(requestDataSources, "/contabilidad/comun/SCFPrintView/", {
            paperSize: "FOLIO",
            orientation: "Horizontal",
            reportType: "HTML"
        });
        printView.show();
    }

    function clearDetalles() {
        Ext.ComponentMgr.get('lcodigo').setText(etiquetas.lCodigo, false);
        Ext.ComponentMgr.get('labreviatura').setText(etiquetas.lAbreviatura, false);
        Ext.ComponentMgr.get('ldesnominacion').setText(etiquetas.lDnominacion, false);
        Ext.ComponentMgr.get('lfinocio').setText(etiquetas.lFinicio, false);
        Ext.ComponentMgr.get('lffin').setText(etiquetas.lFfin, false);
        Ext.ComponentMgr.get('detalles').collapse();
    }

    function mostrarDetalles(objeto) {
        Ext.ComponentMgr.get('lcodigo').setText(etiquetas.lCodigo + " " + objeto.codespecialidad1, false);
        Ext.ComponentMgr.get('labreviatura').setText(etiquetas.lAbreviatura + " " + objeto.abrevespecialidad1, false);
        Ext.ComponentMgr.get('ldesnominacion').setText(etiquetas.lDnominacion + " " + objeto.denespecialidad1, false);
        Ext.ComponentMgr.get('lfinocio').setText(etiquetas.lFinicio + " " + objeto.fechaini1, false);
        if (objeto.fechafin1 != null)
            Ext.ComponentMgr.get('lffin').setText(etiquetas.lFfin + " " + objeto.fechafin1, false);
        Ext.ComponentMgr.get('detalles').expand();
    }

    function loadMessageBox(msg) {
        Ext.MessageBox.show({
            title: etiquetas.lbEsperando,
            msg: msg,
            width: 300,
            progress: true,
            closable: false
        });
        var f = function(v) {
            return function() {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i);
            };
        };
        for (var i = 1; i < 12; i++)
            setTimeout(f(i), i * 500);
    }

}
