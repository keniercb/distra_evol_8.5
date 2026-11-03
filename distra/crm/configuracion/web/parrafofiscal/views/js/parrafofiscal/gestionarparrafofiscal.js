Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil;
UCID.portal.cargarEtiquetas('gestionarparrafofiscal', function() {
    var etiquetas = perfil.etiquetas;
    cargarInterfaz(perfil, etiquetas);
});
var win2, win3;
var lMask;
var flag_spacio = false;
var idcriterio = 0;
var stformato;
var nodoactual = null;
var idpa = null;
var denom, referencia, fechaini, fechafin, parrafo, pform, fpDetalles, oldvalue, olddenom;
var windowopen = false;
var windowopen1 = false;
var isOpenWI = false;
var isOpenWM = false;
var formato;
var busquedaParrafo = false;
var NodoActualV1 = new Object();
var justDel = false;
function cargarInterfaz(perfil, etiquetas) {
    /** ***********************Formulario*************************************** */
    var btnAdicionar = new Ext.Button({
        id: 'btnAddCI',
        tooltip: etiquetas.lbToolTipAdParrafoF,
        disabled: true,
        iconCls: 'adicionar',
        hidden: true,
        text: etiquetas.btnAdicionar,
        handler: function() {
            GestionarParr('add');
            justDel = false;
        }
    });
    var btnModificar = new Ext.Button({
        id: 'btnModCI',
        iconCls: 'modificar',
        tooltip: etiquetas.lbToolTipModParrafoF,
        text: etiquetas.btnModificar,
        disabled: true,
        hidden: true,
        handler: function() {
            GestionarParr('mod');
            justDel = false;
        }
    });
    var btnEliminar = new Ext.Button({
        id: 'btnDelCI',
        iconCls: 'eliminar',
        disabled: true,
        hidden: true,
        tooltip: etiquetas.lbToolTipElParrrafoF,
        text: etiquetas.btnEliminar,
        handler: function() {
            justDel = true;
            mostrarMensaje(2, etiquetas.lbTEliminar, OnbtnAceptarEliminar);
        }
    });
    var btnVistaPrevia = new Ext.Button({
        id: 'btnVistaReporteCI',
        iconCls: 'vistareporte',
        hidden: true,
        tooltip: etiquetas.tooltipVistaReporte,
        text: etiquetas.lbVistaReporte,
        handler: function() {
            fObtenerDatosImprimirReporte();
        }
    });
    var btnAyuda = new Ext.Button({
        iconCls: 'ayuda',
        tooltip: etiquetas.lbtooltipWindAyuda,
        text: etiquetas.lbBtnAyuda,
        id: 'btnAyudaClasificadorDeIngresos'/*,
        handler: function() {
            help.show(etiquetas.lnTitleWindAyuda, 'CG/NG/parrafo_fiscal');
        }*/
    });
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad);

    function fObtenerDatosImprimirReporte() {
        loadMessageBox(etiquetas.lbMsgCargando);
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
        printView = new SCFPrintView(requestDataSources, "/configuracion/reportes/", {
            paperSize: "FOLIO",
            orientation: "Horizontal",
            reportType: "HTML"
        });
        printView.show();
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


    var fpDetalles = new Ext.FormPanel({
        title: etiquetas.lbDetalles,
        frame: true,
        layout: 'form',
        labelAlign: 'top',
        region: 'center',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: .5,
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        items: [{
                                xtype: 'textfield',
                                name: 'codespecialidad1',
                                fieldLabel: etiquetas.lbCodigo,
                                readOnly: true,
                                anchor: '100%'
                            }]
                    }, {
                        columnWidth: .25,
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        items: [{
                                xtype: 'textfield',
                                name: 'orden1',
                                fieldLabel: etiquetas.lbOrden,
                                readOnly: true,
                                anchor: '100%'
                            }]
                    }, {
                        columnWidth: .25,
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        items: [{
                                xtype: 'textfield',
                                name: 'abrevespecialidad1',
                                fieldLabel: etiquetas.lbAbreviatura,
                                readOnly: true,
                                anchor: '100%'
                            }]
                    }
                ]
            }, {
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        items: [{
                                xtype: 'textfield',
                                name: 'denespecialidad1',
                                fieldLabel: etiquetas.lbDenominacion,
                                readOnly: true,
                                anchor: '100%'
                            }]
                    }]
            }, {
                layout: 'column',
                items: [{
                        columnWidth: .5,
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        items: [{
                                xtype: 'textfield',
                                name: 'FechaInicio',
                                fieldLabel: etiquetas.lbFechaini,
                                readOnly: true,
                                anchor: '100%'
                            }]
                    }, {
                        columnWidth: .5,
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        items: [{
                                xtype: 'textfield',
                                name: 'FechaFin',
                                fieldLabel: etiquetas.lbFechafin,
                                readOnly: true,
                                anchor: '100%'

                            }]
                    }]
            }],
        listeners: {
            resize: function() {
                this.doLayout();
            }
        }
    });

    var lcodigo = new Ext.form.Label({
        id: 'lcodigo',
        width: '100%',
        html: etiquetas.lCodigo
    });
    var ldescripcion = new Ext.form.Label({
        id: 'ldescripcion',
        width: '100%',
        html: etiquetas.lDescripcion
    });

    var lreferencia = new Ext.form.Label({
        id: 'lreferencia',
        width: '100%',
        html: etiquetas.lReferencia
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
                        items: ldescripcion
                    },
                    {
                        style: 'margin 0 0 20 0;font-size:12px',
                        items: lreferencia
                    },
                    {
                        style: 'margin 0 0 20 0;font-size:12px',
                        items: lfinocio
                    },
                    {
                        style: 'margin 0 0 20 0;font-size:12px',
                        items: lffin
                    }]
            }],
        listeners: {
            resize: function() {//evento al ocultarse
                this.doLayout();
            }
        }
    });

    function clearDetalles() {
        Ext.ComponentMgr.get('lcodigo').setText(etiquetas.lCodigo, false);
        Ext.ComponentMgr.get('ldescripcion').setText(etiquetas.lDescripcion, false);
        Ext.ComponentMgr.get('lreferencia').setText(etiquetas.lReferencia, false);
        Ext.ComponentMgr.get('lfinocio').setText(etiquetas.lFinicio, false);
        Ext.ComponentMgr.get('lffin').setText(etiquetas.lFfin, false);
        Ext.ComponentMgr.get('detalles').collapse();
    }

    function mostrarDetalles(objeto) {
        Ext.ComponentMgr.get('lcodigo').setText(etiquetas.lCodigo + " " + objeto.codespecialidad1, false);
        Ext.ComponentMgr.get('ldescripcion').setText(etiquetas.lDescripcion + " " + objeto.denespecialidad1, false);
        Ext.ComponentMgr.get('lreferencia').setText(etiquetas.lReferencia + " " + objeto.abrevespecialidad1, false);
        Ext.ComponentMgr.get('lfinocio').setText(etiquetas.lFinicio + " " + objeto.FechaInicio, false);
        if (objeto.FechaFin != null)
            Ext.ComponentMgr.get('lffin').setText(etiquetas.lFfin + " " + objeto.FechaFin, false);
        Ext.ComponentMgr.get('detalles').expand();
    }

    parrafo = new Ext.form.Hidden({
        name: 'idparrafofiscal'
    });

    denom = new Ext.form.TextField({
        blankText: etiquetas.lbtextCampOblig,
        allowBlank: false,
        name: 'descripcion',
        maxLength: 250,
        id: 'pformdesc',
        maxLengthText: etiquetas.lbMaxTamanno,
        fieldLabel: etiquetas.lbDenominacion,
        enableKeyEvents: true,
        anchor: '100%',
        listeners:{
            keyup: function(){
                activarBotonesWin();
            }
        }
    });

    denom.on('change', function(tf, nv, vv) {
        olddenom = vv;
    });

    codigo = new Ext.form.TextField({
        blankText: etiquetas.lbtextCampOblig,
        allowBlank: false,
        maxLength: 20,
        regex: /^([a-zA-Z0-9 \xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]*)+$/,
        maskRe: /^([a-zA-Z0-9 \xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]*)+$/,
        regexText: etiquetas.lbregexText,
        maxLengthText: etiquetas.lbMaxTam6,
        name: 'codigo',
        id: 'pformcod',
        fieldLabel: etiquetas.lbCodigo,
        enableKeyEvents: true,
        anchor: '100%',
        listeners:{
            keyup: function(){
                activarBotonesWin();
            }
        }
    });

    codigo.on('change', function(tf, nv, vv) {
        oldvalue = vv;
    });

    referencia = new Ext.form.TextField({
        name: 'referencia',
        maxLength: 255,
        maxLengthText: etiquetas.lbMaxRef,
        blankText: etiquetas.lbtextCampOblig,
        allowBlank: true,
        regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z\s]*)+$/,
        maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z\s]*)+$/,
        regexText: etiquetas.lbregexText,
        id: 'pformref',
        hiddenName: 'referencia',
        enableKeyEvents: true,
        fieldLabel: etiquetas.lbAbreviatura,
        anchor: '100%',
        listeners:{
            keyup: function(){
                activarBotonesWin();
            }
        }
    });

    fechaini = new Ext.form.DateField({
        fieldLabel: etiquetas.lbFechaini,
        enableKeyEvents: true,
        allowBlank: false,
        //readOnly: true,
        name: 'fechaStart',
        id: 'pformini',
        vtype: 'daterange',
        endDateField: 'pformfin',
        format: 'd/m/Y',
        //maskRe: /^()+$/,
        invalidText: 'Formato: dd/mm/aaaa.',
        maxText: etiquetas.lbmsgMaxDate,
        emptyText: etiquetas.etSelect,
        anchor: '100%',
        editable: true,
        listeners:{
            keyup: function(){
                activarBotonesWin();
            }
        }
    });

    fechafin = new Ext.form.DateField({
        fieldLabel: etiquetas.lbFechafin,
        enableKeyEvents: true,
        //readOnly: true,
        name: 'pformfin',
        id: 'pformfin',
        vtype: 'daterange',
        startDateField: 'pformini',
        format: 'd/m/Y',
        //maskRe: /^()+$/,
        minText: etiquetas.lbmsgMinDate,
        invalidText: 'Formato: dd/mm/aaaa.',
        editable: true,
        anchor: '100%',
        listeners:{
            keyup: function(){
                activarBotonesWin();
            }
        }
    });

    fechaini.on('change', function() {
        //fechafin.setMinValue(fechaini.getRawValue());
        activarBotonesWin();
    });

    /*fechaini.on('valid', function() {
        fechafin.setMinValue(fechaini.getRawValue());
        if (fechaini.getRawValue() != '') {
            fechafin.enable();
        }
    });*/

    fechafin.on('change', function() {
        //fechaini.setMaxValue(fechafin.getRawValue());
        activarBotonesWin();
    });


    pform = new Ext.FormPanel({
        frame: true,
        layout: 'form',
        labelAlign: 'top',
        region: 'center',
        items: [parrafo, {
                layout: 'column',
                items: [{
                        columnWidth: .5,
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        items: [codigo]
                    }, {
                        columnWidth: .5,
                        style: 'margin:0 10 0 10',
                        layout: 'form',
                        items: [referencia]
                    }
                ]
            }, {
                layout: 'column',
                items: [{
                        columnWidth: 1,
                        style: 'margin:0 10 0 10',
                        layout: 'form',
                        items: [denom]
                    }]
            }, {
                layout: 'column',
                items: [{
                        columnWidth: .5,
                        style: 'margin:0 0 0 10',
                        layout: 'form',
                        items: [fechaini]
                    }, {
                        columnWidth: .5,
                        style: 'margin:0 10 0 10',
                        layout: 'form',
                        items: [fechafin]
                    }]
            }]
    });

    function validatorFechas() {
        var nodosel = trEE.getSelectionModel().getSelectedNode();
        if (isOpenWM) {
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
        if (nodosel.attributes.fechainicio && nodosel != trEE.getRootNode()) {
            fechaini.setMinValue(nodosel.attributes.fechainicio);
            fechafin.setMinValue(nodosel.attributes.fechainicio);
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

    function crearVentana() {
        if (!win2) {

            //Función necesaria para validar las fechas

            justDel = false;
            win2 = new Ext.Window({
                title: etiquetas.lbTAdicionar,
                id: 'win2',
                layout: 'fit',
                constrain:true,
                width: 350,
                height: 230,
                resizable: false,
                modal: true,
                closeAction: 'hide',
                defaultButton: 'idbtnCancelarW2',
                firstElement:codigo,
                buttons: [{
                        iconCls: 'cancelar',
                        id: 'idbtnCancelarW2',
                        text: etiquetas.btnCancelar,
                        tooltip: etiquetas.lbBtnTooltipCancelar,
                        handler: function() {
                            win2.hide();
                            pform.getForm().reset();
                        }
                    }, {
                        iconCls: 'aplicar',
                        id : 'idbtnAplrW2',
                        disabled : true,
                        text: etiquetas.btnAplicar,
                        tooltip: etiquetas.lbBtnTooltipAplicar,
                        handler: function() {
                            aceptar('apl');
                        }
                    }, {
                        iconCls: 'aceptar',
                        disabled : true,
                        id: 'idbtnAceptarW2',
                        text: etiquetas.btnAceptar,
                        tooltip: etiquetas.lbBtnTooltipAceptar,
                        handler: function() {
                            aceptar();
                        }
                    }],
                items: [pform],
                listeners: {
                    hide: function() {
                        windowopen = false;
                        btnAdicionar.focus();
                        isOpenWI = false;
                        Ext.getCmp('idbtnAceptarW2').disable();
                        Ext.getCmp('idbtnAplrW2').disable();
                    },
                    show: function() {
                        windowopen = true;
                        isOpenWI = true;
                        validatorFechas();
                        //win2.addEvents(Ext.EventObject.ENTER, aceptar());
                    }, render: function() {
                        win2.focus();
                    }
                }
            });
        }
    }

    function modificarVentana() {
        if (!win3) {
            justDel = false;
            win3 = new Ext.Window({
                title: etiquetas.lbTModificar,
                id: 'win3',
                layout: 'fit',
                width: 350,
                height: 230,
                constrain:true,
                resizable: false,
                modal: true,
                closeAction: 'hide',
                defaultButton: 'idbtnCancelarMod',
                firstElement:codigo,
                listeners: {
                    hide: function() {
                        windowopen1 = false;
                        isOpenWM = false;
                        Ext.getCmp('idbtnAceptarMod').disable();
                        btnAdicionar.focus();
                    }, render: function() {
                        win3.focus();
                    },
                    show: function() {
                        windowopen1 = true;
                        isOpenWM = true;
                        //Función necesaria para validar las fechas
                        validatorFechas();
                    }
                },
                buttons: [{
                        iconCls: 'cancelar',
                        text: etiquetas.btnCancelar,
                        id: 'idbtnCancelarMod',
                        tooltip: etiquetas.lbBtnTooltipCancelar,
                        handler: function() {
                            win3.hide();
                            pform.getForm().reset();
                        }
                    }, {
                        iconCls: 'aceptar',
                        id: 'idbtnAceptarMod',
                        disabled : true,
                        text: etiquetas.btnAceptar,
                        tooltip: etiquetas.lbBtnTooltipAceptar,
                        handler: function() {
                            pform.getForm().setValues({
                                descripcion : pform.getForm().getValues().descripcion.trim(),
                                codigo : pform.getForm().getValues().codigo.trim(),
                                referencia : pform.getForm().getValues().referencia.trim()
                            });
                            if(trEE.getSelectionModel().getSelectedNode().attributes.descripcion != pform.getForm().getValues().descripcion
                                || trEE.getSelectionModel().getSelectedNode().attributes.codigo != pform.getForm().getValues().codigo
                                || trEE.getSelectionModel().getSelectedNode().attributes.referencia != pform.getForm().getValues().referencia
                                || trEE.getSelectionModel().getSelectedNode().attributes.fechainicio != pform.getForm().getValues().fechaStart
                                || trEE.getSelectionModel().getSelectedNode().attributes.fechafin != pform.getForm().getValues().pformfin){
                                    modificar();
                            }else{
                                Ext.getCmp('idbtnAceptarMod').disable();
                                mostrarMensaje(1, etiquetas.lbTNoModificado);
                            }

                        }
                    }],
                items: [pform]
            });
        }
    }

    function aceptar(apl) {
        if (pform.getForm().isValid()) {
            pform.getForm().setValues({
                descripcion : pform.getForm().getValues().descripcion.trim(),
                codigo : pform.getForm().getValues().codigo.trim(),
                referencia : pform.getForm().getValues().referencia.trim()
            });
            if(pform.getForm().getValues().codigo != '' && pform.getForm().getValues().descripcion != '') {
                Ext.Ajax.request({
                    url: 'validar',
                    method: 'POST',
                    params: {
                        nivel: trEE.getSelectionModel().getSelectedNode().getDepth()+1,
                        idpadre: NodoActualV1.nodeSelected.attributes.id + '-p',
                        descripcion: denom.getValue(),
                        idparrafofiscal: -1,
                        codigo: codigo.getValue(),
                        formato: formato
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.modifico == 'codigoEx') {
                            mostrarMensaje(1, etiquetas.lbTExiste);
                        }else if(responseData.modifico == 'descripcionEX') {
                            mostrarMensaje(1, etiquetas.lbTExisteDescrip);
                        } else if (responseData.modifico == 'noformato')
                            mostrarMensaje(1, etiquetas.lbTFormato);
                        else {
                            //Ext.Msg.wait("Eliminando datos de la(s) sucursal(es)...", "Por favor espere...");
                            pform.getForm().submit({
                                url: 'insertar',
                                waitMsg: etiquetas.lbTAdicionando,
                                params: {
                                    idpadre: NodoActualV1.nodeSelected.attributes.id,
                                    formato: formato,
                                    nivel : trEE.getSelectionModel().getSelectedNode().getDepth()+1
                                    //fechaEnd: fechafin.getRawValue();
                                    //fechaStart: fechaini.getRawValue();

                                },
                                failure: function (form, action) {
                                    if (action.result.codMsgg == -1) {
                                        mostrarMensaje(action.result.codMsg, etiquetas.lbTAdicionado);
                                        pform.getForm().reset();
                                        //fpDetalles.getForm().reset();
                                        if (!apl)
                                            win2.hide();
                                        if (trEE.getSelectionModel().getSelectedNode().attributes.padre) {
                                            var expPath = trEE.getSelectionModel().getSelectedNode().getPath();
                                            trEE.getRootNode().reload();
                                            trEE.expandPath(expPath);
                                            /*var nodepath = NodoActualV1.nodeSelected.getPath();
                                             var temp = trEE.getSelectionModel().getSelectedNode().attributes.padre.split('-');
                                             if (temp[0] == '0') {
                                             var nodopadre = trEE.getSelectionModel().getSelectedNode().attributes.id;
                                             //var padre = trEE.getNodeById(nodopadre);
                                             treeLoader.load(padre, function() {
                                             //padre.expand();
                                             trEE.expandPath(nodepath);
                                             });
                                             } else {
                                             NodoActualV1.nodeSelected.leaf = false;
                                             trEE.getLoader().load(NodoActualV1.nodeSelected, function() {
                                             trEE.expandPath(NodoActualV1.nodeSelected.getPath());
                                             });
                                             }*/
                                        } else {
                                            //trEE.getSelectionModel().select(nodoSelect);
                                            NodoActualV1.nodeSelected.leaf = false;
                                            trEE.getLoader().load(NodoActualV1.nodeSelected, function () {
                                                trEE.expandPath(NodoActualV1.nodeSelected.getPath());
                                            });
                                        }
                                        //btnEliminar.disable();
                                        btnEliminar.enable;
                                        btnModificar.enable;
                                        btnAdicionar.focus();
                                    } else if (action.result.codMsgg == -3) {
                                        mostrarMensaje(1, etiquetas.lbNpfYaCodigo);
                                    }
                                }
                            });
                        }
                    }
                });
            }else{
                Ext.getCmp('idbtnAceptarW2').disable();
                Ext.getCmp('idbtnAplrW2').disable();
            }
        } else
            mostrarMensaje(1, etiquetas.lbMsgValorInc);
    }
    function eachChild(nodo, fechaFueraRango){
        nodo.eachChild(function(hijo){
            if(hijo.isLeaf()){
                if(nodo.attributes.fechainicio.getValue() > hijo.attributes.fechainicio.getValue()
                    || nodo.attributes.fechafin.getValue() < hijo.attributes.fechafin.getValue()){
                    fechaFueraRango = true;
                    return false;
                }
            }else{
                if(nodo.attributes.fechainicio.getValue() > hijo.attributes.fechainicio.getValue()
                    || nodo.attributes.fechafin.getValue() < hijo.attributes.fechafin.getValue()){
                    fechaFueraRango = true;
                    return false;
                }
                eachChild(hijo, fechaFueraRango);
            }

        });
        return fechaFueraRango;
    }
    function modificar() {
        formato = trEE.getRootNode().firstChild.attributes.idformato;
        var nodeSelect = trEE.getSelectionModel().getSelectedNode();
        var tmp = NodoActualV1.nodeSelected.parentNode.id.split('-');
        if (tmp[0] == '0')
            var nodopadre = '0';
        else
            var nodopadre = NodoActualV1.nodeSelected.parentNode.id;
        var padre = trEE.getNodeById(nodopadre);
        if (pform.getForm().isValid()) {
            pform.getForm().setValues({
                descripcion : pform.getForm().getValues().descripcion.trim(),
                codigo : pform.getForm().getValues().codigo.trim(),
                referencia : pform.getForm().getValues().referencia.trim()
            });
            if(pform.getForm().getValues().codigo != '' && pform.getForm().getValues().descripcion != '') {
                Ext.Ajax.request({
                    url: 'validar',
                    method: 'POST',
                    params: {
                        nivel: trEE.getSelectionModel().getSelectedNode().getDepth(),
                        idpadre: NodoActualV1.nodeSelected.parentNode.id + '-p',
                        descripcion: denom.getValue(),
                        codigo: codigo.getValue(),
                        idparrafofiscal: trEE.getSelectionModel().getSelectedNode().attributes.id,
                        formato: formato
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.modifico == 'codigoEx') {
                            mostrarMensaje(1, etiquetas.lbTExiste);
                        } else if (responseData.modifico == 'descripcionEX') {
                            mostrarMensaje(1, etiquetas.lbTExisteDescrip);
                        } else if (responseData.modifico == 'noformato')
                            mostrarMensaje(1, etiquetas.lbTFormato);
                        else {
                            Ext.Ajax.request({
                                url: 'verificar',
                                method: 'POST',
                                params: {
                                    fechaini: fechaini.getRawValue(),
                                    idparrafofiscal: trEE.getSelectionModel().getSelectedNode().attributes.id,
                                    referencia: referencia.getValue(),
                                    descripcion: denom.getValue(),
                                    codigo: codigo.getValue(),
                                    fechafin: fechafin.getRawValue(),
                                    formato: formato,
                                    ordenizq: trEE.getSelectionModel().getSelectedNode().attributes.ordenizq,
                                    ordender: trEE.getSelectionModel().getSelectedNode().attributes.ordender
                                },
                                callback: function (options, success, response) {
                                    responseData = Ext.decode(response.responseText);
                                    if (responseData.modifico == 'fechainicio') {
                                        mostrarMensaje(1, etiquetas.lbFechaInicioRango);
                                    } else if (responseData.modifico == 'fechafin') {
                                        mostrarMensaje(1, etiquetas.lbFechaFinRango);
                                    } else if (responseData.modifico == 'nomodifico')
                                        mostrarMensaje(1, etiquetas.lbTNoModificado);
                                    else {
                                        var nodeSelect = NodoActualV1.nodeSelected;
                                        var parentNode = NodoActualV1.nodeSelected.parentNode;
                                        pform.getForm().submit({
                                            url: 'modificar',
                                            method: 'POST',
                                            params: {
                                                ov: oldvalue,
                                                olddenom: olddenom,
                                                idpadre: idpa,
                                                nivel: trEE.getSelectionModel().getSelectedNode().getDepth()
                                            },
                                            waitMsg: etiquetas.lbTModificando,
                                            failure: function (form, action) {
                                                oldvalue = null;
                                                olddenom = null;
                                                if (action.result.codMsgg == "1") {
                                                    mostrarMensaje(1, etiquetas.lbTModificado);
                                                    pform.getForm().reset();
                                                    //fpDetalles.getForm().reset();
                                                    win3.hide();
                                                    var expPath = trEE.getSelectionModel().getSelectedNode().getPath();
                                                    trEE.getRootNode().reload();
                                                    trEE.expandPath(expPath);
                                                    /*treeLoader.load(padre, function () {
                                                     padre.expand();
                                                     });*/
                                                    btnEliminar.disable();
                                                    btnModificar.disable();
                                                    Ext.ComponentMgr.get('detalles').collapse();
                                                } else if (action.result.codMsgg == "-4") {
                                                    mostrarMensaje(1, etiquetas.lbLTasaNEx);
                                                } else if (action.result.codMsgg == "-6") {
                                                    mostrarMensaje(1, etiquetas.lbmsgYaexiste);
                                                }

                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }else{
                Ext.getCmp('idbtnAceptarMod').disable();
        }
        } else {
            mostrarMensaje(1, etiquetas.lbMsgValorInc);
            Ext.getCmp('idbtnAceptarMod').disable();
        }
    }

    var treeLoader = new Ext.tree.TreeLoader({
        dataUrl: 'cargararbol',
        baseParams: {
            opcion: 1,
            filter: ''
        }
    });

    sfParrafoFiscal = new Ext.Cont.SearchField({
        id: 'sfParrafoFiscal',
        width: 250,
        maxLength: 70,
        regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]*)+$/,
        maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]*)+$/,
        emptyText: etiquetas.lbCriterioBuscar,
        //clearTooltip: etiquetas.lbclearTooltip,
        searchTooltip: etiquetas.lbsearchTooltip,
        fnOnSearch: function() {
            busquedaParrafo = true;
            buscarParrafo();

        },
        fnOnClear: function() {
            busquedaParrafo = false;
            buscarParrafo();
        }
    });

    treeLoader.on('load', function(This, node, response) {
        if (trEE.root.childNodes.length == 0 && busquedaParrafo == true) {
            mostrarMensaje(1, etiquetas.messNoResult);
            busquedaParrafo = false;
        }
        if (trEE.root.childNodes.length == 0 && busquedaParrafo == false && justDel == false) {
            mostrarMensaje(1, etiquetas.messNoResult1);
        }
        if (busquedaParrafo = true)
            busquedaParrafo = false;
    }, this);
    treeLoader.on("beforeload", function(treeLoader, node) {

        if (busquedaParrafo) {
            treeLoader.baseParams.filter = sfParrafoFiscal.getRawValue();
            treeLoader.baseParams.opcion = 2;


        }
        else {
            treeLoader.baseParams.filter = '';
            treeLoader.baseParams.opcion = 1;


        }
        if(!isOpenWI){
            trEE.getSelectionModel().select(trEE.getRootNode());
        }else{
            trEE.getSelectionModel().select(node);
        }


    }, this);

    var trEE = new Ext.tree.TreePanel({
        width: Ext.lib.Dom.getViewWidth() * 1 / 2,
        autoScroll: true,
        split: true,
        id: 'idTreeparafo',
        region: 'center',
        loader: treeLoader,
        selModel: new Ext.tree.DefaultSelectionModel(),
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
        draggable: false,
        id: '0',
        expanded: true
    });
    trEE.setRootNode(nodoPadre);
    trEE.show();

    trEE.on('resize', function(cmp, adjWidth, adjHeight, rawWidth, rawHeight) {
        //sfParrafoFiscal.setWidth(adjWidth);
        cmp.doLayout();
    });
    var nodo, collapse = true;

    trEE.getSelectionModel().on('beforeselect', function(sm, node, oldnode) {
        nodoactual = (node.attributes.idpadre) ? node.attributes.idpadre : node.attributes.id;
        NodoActualV1.nodeSelected = node;
        idpa = node.attributes.idpadre;
        btnAdicionar.enable();
        codigo.reset();
        denom.reset();
        fechaini.reset();
        referencia.reset();
        fechafin.reset();
        if (node.attributes.id != 0) {
            btnModificar.enable();
            btnEliminar.enable();
            mostrarDetalles(dameNodeInfo(node).data);
            //fpDetalles.getForm().loadRecord(dameNodeInfo(node));
            var id = node.attributes.id.split('-');
            /*if (node.leaf == true) {
             btnEliminar.enable();
             }
             else {
             btnEliminar.disable();
             }*/
            if (id[1] == 'e') {
                codigo.disable();
            } else {
                codigo.enable();
                denom.enable();
                fechaini.enable();
                referencia.enable();
                fechafin.enable();
            }
        } else {
            clearDetalles();
            btnEliminar.disable();
            btnModificar.disable();
        }
    }, this);


    var dameNodeInfo = function(node) {
        var record = Ext.data.Record.create([{
                name: 'abrevespecialidad1'
            }, {
                name: 'denespecialidad1'
            }, {
                name: 'codespecialidad1'
            }, {
                name: 'orden1'
            }, {
                name: 'fechainicio',
                mapping: 'FechaInicio'
            }, {
                name: 'fechafin',
                mapping: 'FechaFin'
            }]);
        return new record({
            abrevespecialidad1: node.attributes.referencia,
            denespecialidad1: node.attributes.descripcion,
            codespecialidad1: node.attributes.codigo,
            FechaInicio: node.attributes.fechainicio,
            FechaFin: node.attributes.fechafin
        });
    };

    var dameNodeInfoModificar = function(node) {
        var record = Ext.data.Record.create([{
                name: 'idparrafofiscal'
            }, {
                name: 'referencia'
            }, {
                name: 'descripcion'
            }, {
                name: 'codigo'
            }, {
                name: 'fechainicio',
                mapping: 'fechaStart'
            }, {
                name: 'fechafin',
                mapping: 'pformfin'
            }]);
        return new record({
            idparrafofiscal: node.attributes.id,
            referencia: node.attributes.referencia,
            descripcion: node.attributes.descripcion,
            codigo: node.attributes.codigo,
            fechaStart: node.attributes.fechainicio,
            pformfin: node.attributes.fechafin
        });
    };

    var dameNodeInfoAdicionar = function(node) {
        var record = Ext.data.Record.create([{
                name: 'fechainicio'
            }, {
                name: 'fechafin'
            }]);
        return new record({
            fechaini: node.attributes.fechaini,
            fechafin: node.attributes.fechafin
        });
    };

    var pArbol = new Ext.Panel({
        id: 'pArbol',
        layout : 'border',
        width: Ext.lib.Dom.getViewWidth() * 1 / 2,
        tbar: [sfParrafoFiscal],
        items: [trEE, panelDetalles]
    });


    var pfondo = new Ext.Panel({
        id: 'pfondo',
        border: false,
        listeners: {
            render: function() {
                btnAdicionar.focus();
            }
        },
        items: [pArbol, fpDetalles],
        tbar: [btnAdicionar, btnModificar, btnEliminar, btnVistaPrevia, '->', btnAyuda],
        layout: 'fit'
    });

    var vpPrinc = new Ext.Viewport({
        layout: 'fit',
        id: 'id',
        items: [pfondo],
        autoScroll: true
    });
    hotKeys = new Ext.KeyMap(Ext.getBody(), [{
            key: 'i',
            alt: true,
            fn: function() {
                if (btnAdicionar.isVisible() && !windowopen && !windowopen1 && !btnAdicionar.disabled) {
                    GestionarParr('add');
                }
            }
        }, {
            key: 'm',
            alt: true,
            fn: function() {
                if (btnModificar.isVisible() && !windowopen && !windowopen1 && !btnModificar.disabled) {
                    GestionarParr('mod');
                }
            }
        }, {
            key: Ext.EventObject.DELETE,
            fn: function() {
                if (btnEliminar.isVisible() && !windowopen && !windowopen1 && !btnEliminar.disabled) {
                    mostrarMensaje(2, etiquetas.lbTEliminar, OnbtnAceptarEliminar);
                }
            }
        }, {
        key: 'b',
        alt: true,
        fn: function() {
            if(Ext.getCmp('sfParrafoFiscal').getRawValue().length > 0){
                Ext.getCmp('sfParrafoFiscal').onTrigger2Click();
            }else{
                Ext.getCmp('sfParrafoFiscal').focus();
            }
        }
        }, {
        key: 'l',
        alt: true,
        fn: function() {
            if(Ext.getCmp('sfParrafoFiscal').getRawValue().length > 0) {
                Ext.EventObject.stopEvent();
                Ext.getCmp('sfParrafoFiscal').onTrigger1Click();
            }
        }
        }, {//Vista reporte
            key: 'r',
            alt: true,
            fn: function() {
                if (btnVistaPrevia.isVisible() && !windowopen && !windowopen1 && !btnVistaPrevia.disabled) {
                    btnVistaPrevia.handler.call();
                }

            }
        }, /*{
            key: 'l',
            alt: true,
            fn: function() {
                Ext.getCmp('sfParrafoFiscal').fnOnClear.call();
            }
        }, {
            key: 'h',
            alt: true,
            fn: function() {
                help.show(etiquetas.lnTitleWindAyuda, 'CG/NG/parrafo_fiscal');
            }
        }*/
    ]);

    function actualizarTree(node, verificaHoja) {
        var nodeLoad;
        (verificaHoja && node.isLeaf()) ? nodeLoad = nodoPadre : nodeLoad = node;
        treeLoader.load(nodeLoad, function() {
            nodeLoad.expand();
        });
    }

    function buscarParrafo() {
        treeLoader.baseParams = {
            opcion: (busquedaParrafo == true) ? 2 : 1,
            filter: (busquedaParrafo == true) ? sfParrafoFiscal.getRawValue() : ''

        };
        treeLoader.load(trEE.getRootNode(), function() {
            trEE.getRootNode().expand();
        });
//        treeLoader.load(nodoPadre, function() {
//            pArbol.mask.hide();
//            
//            if (trEE.root.childNodes.length == 0 && busquedaParrafo == true) {
////                notifyEvent(trEE.el.dom, etiquetas.titleInfo, etiquetas.messNoResult);
//                mostrarMensaje(1,etiquetas.messNoResult);
//                busquedaParrafo = false;
//            }
//            else {
//                if (trEE.root.childNodes.length == 0 && !busquedaParrafo) {
////                    notifyEvent(trEE.el.dom, etiquetas.titleInfo, etiquetas.NoExisDQM);
//                    mostrarMensaje(1,etiquetas.NoExisDQM);
//                }
//                nodoPadre.expand();
//                sfParrafoFiscal.focus(true);
//            }
//        });

    }

    function activarBotonesWin(){
        if (pform.getForm().isValid()) {
            if(isOpenWI){
                Ext.getCmp('idbtnAceptarW2').enable();
                Ext.getCmp('idbtnAplrW2').enable();
            }else if(isOpenWM){
                if(trEE.getSelectionModel().getSelectedNode().attributes.descripcion != pform.getForm().getValues().descripcion
                    || trEE.getSelectionModel().getSelectedNode().attributes.codigo != pform.getForm().getValues().codigo
                    || trEE.getSelectionModel().getSelectedNode().attributes.referencia != pform.getForm().getValues().referencia
                    || trEE.getSelectionModel().getSelectedNode().attributes.fechainicio != pform.getForm().getValues().fechaStart
                    || trEE.getSelectionModel().getSelectedNode().attributes.fechafin != pform.getForm().getValues().pformfin){
                    Ext.getCmp('idbtnAceptarMod').enable();
                }else{
                    Ext.getCmp('idbtnAceptarMod').disable();
                }
            }
        }else{
            if(isOpenWI){
                Ext.getCmp('idbtnAceptarW2').disable();
                Ext.getCmp('idbtnAplrW2').disable();
            }else if(isOpenWM){
                Ext.getCmp('idbtnAceptarMod').disable();
            }
        }
    }

    function GestionarParr(opn) {
        switch (opn) {
            case 'add':
                ns = trEE.getSelectionModel().getSelectedNode();
                if (ns.attributes.id == 0 && !ns.hasChildNodes()) {
                    var formatoStore = new Ext.data.Store({
                        reader: new Ext.data.JsonReader({
                            fields: ['idformato', 'nombre'],
                            root: 'root'
                        }),
                        proxy: new Ext.data.HttpProxy({
                            url: 'obtenerformatos',
                            method: 'POST'
                        })
                    });
                    var formatos = new Ext.form.ComboBox({
                        fieldLabel: 'Formato',
                        name: 'formato_sel',
                        typeAhead: true,
                        readOnly: true,
                        allowBlank: false,
                        triggerAction: 'all',
                        displayField: 'nombre',
                        valueField: 'idformato',
                        hiddenName: 'formato_sel',
                        mode: 'local',
                        store: formatoStore
                    });
                    var winFormato = new Ext.Window({
                        title: etiquetas.lbWinSelecF,
                        height: 110,
                        width: 340,
                        modal: true,
                        resizable: false,
                        defaultButton: 'idbtnAceptarAdd',
                        listeners: {
                            beforeshow: function() {
                                formatoStore.load();
                            }, close: function() {
                                btnAdicionar.focus();
                            }, render: function() {
                                winFormato.focus();
                            }
                        },
                        constrain: true,
                        layout: 'fit',
                        items: [{
                                xtype: 'form',
                                name: 'formFormato',
                                frame: true,
                                labelWidth: 80,
                                defaults: {
                                    anchor: '90%'
                                },
                                items: [formatos]
                            }],
                        buttons: [{
                                text: etiquetas.btnCancelar,
                                iconCls: 'cancelar',
                                tooltip: etiquetas.lbBtnTooltipCancelar,
                                handler: function() {
                                    winFormato.close();
                                    return;
                                }
                            }, {
                                text: etiquetas.btnAceptar,
                                iconCls: 'aceptar',
                                id: 'idbtnAceptarAdd',
                                tooltip: etiquetas.lbBtnTooltipAceptar,
                                handler: function() {
                                    if (formatos.isValid()) {
                                        formato = formatos.getValue();
                                        var nivel = trEE.getSelectionModel().getSelectedNode().getDepth();
                                        Ext.Ajax.request({
                                            url: 'getformato',
                                            method: 'POST',
                                            params: {
                                                accion: 'add',
                                                nivel: nivel + 1,
                                                formato: formato
                                            },
                                            callback: function(options, success, response) {
                                                responseData = Ext.decode(response.responseText);
                                                if (responseData.maxl) {
                                                    Ext.getCmp('pformcod').maxLength = parseInt(responseData.maxl);
                                                    Ext.getCmp('pformcod').maxLengthText = etiquetas.lbMsgNivelReqCant.replace('<cantidad>', parseInt(responseData.maxl));
                                                    pform.getForm().reset();
                                                    Ext.getCmp('pformini').value = new Date();
                                                    crearVentana();
                                                    win2.show();
                                                    win2.add(pform);
                                                    win2.doLayout();
                                                } else {
                                                    if (responseData.nivel == 0) {
                                                        mostrarMensaje(1, etiquetas.lbMsgNNivelConfigurado);
                                                        window.parent.Ext.getCmp('win' + window.parent.idFuncionalidad).close();
                                                    } else {
                                                        if (responseData.nivel == 1)
                                                            mostrarMensaje(1, etiquetas.lbMsgNivelReqSingle.replace('<cant>', responseData.nivel));
                                                        else
                                                            mostrarMensaje(1, etiquetas.lbMsgNivelReq.replace('<cant>', responseData.nivel));
                                                    }
                                                }
                                            }
                                        });
                                        winFormato.close();
                                    }
                                }
                            }]
                    });
                    winFormato.show();
                } else {
                    formato = trEE.getRootNode().firstChild.attributes.idformato;
                    var nivel = trEE.getSelectionModel().getSelectedNode().getDepth();
                    Ext.Ajax.request({
                        url: 'getformato',
                        method: 'POST',
                        params: {
                            accion: 'add',
                            nivel: nivel + 1,
                            formato: formato
                        },
                        callback: function(options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            if (responseData.maxl) {
                                Ext.getCmp('pformcod').maxLength = parseInt(responseData.maxl);
                                Ext.getCmp('pformcod').maxLengthText = etiquetas.lbMsgNivelReqCant.replace('<cantidad>', parseInt(responseData.maxl));
                                Ext.getCmp('pformini').value = new Date();
                                crearVentana();
                                pform.getForm().reset();
                                win2.show();
                                win2.add(pform);
                                win2.doLayout();
                            } else {
                                if (responseData.nivel == 1)
                                    mostrarMensaje(1, etiquetas.lbMsgNivelReqSingle.replace('<cant>', responseData.nivel));
                                else
                                    mostrarMensaje(1, etiquetas.lbMsgNivelReq.replace('<cant>', responseData.nivel));
                            }
                        }
                    });
                }
                break;
            case 'mod':
                formato = trEE.getRootNode().firstChild.attributes.idformato;
                var nivel = trEE.getSelectionModel().getSelectedNode().getDepth();
                Ext.Ajax.request({
                    url: 'getformato',
                    method: 'POST',
                    params: {
                        accion: 'add',
                        nivel: nivel,
                        formato: formato
                    },
                    callback: function(options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.maxl) {
                            Ext.getCmp('pformcod').maxLength = parseInt(responseData.maxl);
                            Ext.getCmp('pformcod').maxLengthText = etiquetas.lbMsgNivelReqCant.replace('<cantidad>', parseInt(parseInt(responseData.maxl)));
                            pform.getForm().reset();
                            Ext.getCmp('pformini').value = new Date();
                            modificarVentana();
                            win3.show();
                            win3.add(pform);
                            win3.doLayout();
                            pform.getForm().loadRecord(dameNodeInfoModificar(trEE.getSelectionModel().getSelectedNode()));
                        } else {
                            if (responseData.nivel == 1)
                                mostrarMensaje(1, etiquetas.lbMsgNivelReqSingle.replace('<cant>', responseData.nivel));
                            else
                                mostrarMensaje(1, etiquetas.lbMsgNivelReq.replace('<cant>', responseData.nivel));
                        }
                    }
                });
                break;
        }
    }

    function loadMask(message) {
        lMask = new Ext.LoadMask(Ext.getBody(), {
            msg: message
        });
        lMask.show();
    }

    function OnbtnAceptarEliminar(btnPresionado) {
        var nodeSelect = trEE.getSelectionModel().getSelectedNode();
        //if (nodeSelect.hasChildNodes() == true)
        //    return;
        var tmp = nodeSelect.attributes.idpadre.split('-');
        if (tmp[0] == '0')
            var nodopadre = '0';
        else
            var nodopadre = nodeSelect.attributes.idpadre;
        var padre = trEE.getNodeById(nodopadre);
        if (btnPresionado == 'ok') {
            justDel = true;
            loadMask(etiquetas.lbTEliminando);
            Ext.Ajax.request({
                url: 'eliminar',
                method: 'POST',
                params: {
                    idparrafofiscal: nodeSelect.attributes.id
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgg == "1") {
                        mostrarMensaje(1, etiquetas.lbTEliminado);
                        var padreV1 = NodoActualV1.nodeSelected.parentNode;
                        treeLoader.load(padreV1, function() {
                            padreV1.expand();
                        });
                        btnEliminar.disable();
                        lMask.hide();
                        trEE.getSelectionModel().select(padreV1);
                        Ext.ComponentMgr.get('detalles').collapse();
                    }
//                    else if (responseData.codMsg == 3) {
//                        mostrarMensaje(1, responseData.mensaje, responseData.detalles);
//                    }
                }
            });
        } else {
            btnAdicionar.focus();
        }
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
            }
        }
        for (var i = 1; i < 12; i++)
            setTimeout(f(i), i * 500);
    }


    function notifyEvent(animateTarget, title, msg, icon, time, callback) {
        var notification = new Ext.Cont.Notification({
            animateTarget: animateTarget,
            fnc: (callback) ? callback : Ext.emptyFn,
            iconbox: icon,
            iconCls: "icon-waiting",
            title: title,
            html: msg,
            hideDelay: (time) ? time : 5000
        });
        notification.box();
    }
}