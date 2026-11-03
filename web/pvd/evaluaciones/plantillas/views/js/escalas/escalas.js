Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('escalas', cargarInterfaz);

//BOTONES
var btnAdicionarE, btnModificarE, btnEliminarE, btnAyuda, btnGuardarTipoE, btnCancelarE, btnAplicarE, btnAceptarE,
        btnGuardarCualitativa, btnGuardarRangoN;
//STORES, CM, ARRAY, FIELDS
var arrayTipoEscala, storeEscala, cmEscala, storeCBTipoEscala, datosGPCualitativaCreada, fieldsCualitativa, cmCualitativaSelec,
        cmImagenExistente, cmImagenSelec, fieldsImagen;
//TOOLS y PAGGINGS BARS
var tbEscala, pagingCualitativaSelec, expanderImagenExistente, pagingImagenExistente, pagingImagenSelec, expanderImagenSelec;
//CONTENEDORES
var gpEscala, vpEscala, pRangoN, fsRangoN, pInfo;
//TEXT, COMBOS, AREAS, OTROS
var tfdenomEscala, dfFIEscala, dfFFEscala, heDescripcion, cbTipoEscala, tfValorI, tfValorF, tfPaso, tfPrecision;
//VENTANAS y FORMULARIOS
var mascaraEscala, winEscala, fpEscala, fpTipoEscala;
//FECHA
var fecha = new Date();
//GENERAL
var accionE = 'ADD';
var cambio = 0; //variable para controlar si se modificó algún componente

//***********************************************************************************************************************************

function cargarInterfaz() {
    perfil = arguments[0];
    labels = arguments[1];

    mascaraEscala = new Ext.LoadMask(Ext.getBody(), labels.cargando);

    gpEscala = new Ext.PVD.Evaluaciones.gpEscalas({
        region: 'center',
        width: '40%',
        gestionar: true
    });
    gpEscala.grid.getSelectionModel().on('selectionchange', function(sm) {
        if (sm.hasSelection()) {
            var selectedRecord = sm.getSelected();
            tabPanel.enable();
            if (selectedRecord.get('tipoescala') == 0) {
                CargarFormRangoN(selectedRecord.get('idescala'));
                tabPanel.setActiveTab('0');
                pAsociarEscalaCualitativa.disable();
                pAsociarEscalaImagen.disable();
                fpRangoN.enable();
                storeVRango.load({
                    params: {
                        idescala: selectedRecord.get('idescala')
                    }
                });
            } else if (selectedRecord.get('tipoescala') == 1) {
                tabPanel.setActiveTab('1');
                fpRangoN.disable();
                pAsociarEscalaCualitativa.enable();
                pAsociarEscalaImagen.disable();
                pAsociarEscalaCualitativa.loadStores(selectedRecord.get('idescala'));
            } else {
                tabPanel.setActiveTab('2');
                pAsociarEscalaCualitativa.disable();
                pAsociarEscalaImagen.enable();
                fpRangoN.disable();
                pAsociarEscalaImagen.loadStores(selectedRecord.get('idescala'));
            }
        }

    });

    btnGuardarRangoN = new Ext.Button({
        id: 'btnGuardarRangoN',
        text: labels.btnGuardar,
        tooltip: labels.ttpBtnGuardar,
        iconCls: 'guardar',
        handler: function() {
            GuardarRangoN(gpEscala.grid.getSelectionModel().getSelected().get('idescala'));
        }
    });

    var btnEliminarVN = new Ext.Button({
        id: 'btnGuardarRangoN',
        text: labels.btnEliminar,
        tooltip: labels.ttpBtnEliminarVN,
        iconCls: 'eliminar',
        handler: function() {
		mostrarMensaje(2, '¿Está seguro que quiere eliminar el(los) valor(es) del rango seleccionado(s)?', function(btn) {
			if (btn == "ok") {
				var arrRecord = smGpRango.getSelections();
            var arrid = new Array();
            Ext.each(arrRecord, function(record) {
                arrid.push(record.get('idvaloresnumericos'));
            });
            PVD.mostrarMascara('mskdelnumericval', labels.lbMsgWait, labels.lbMskDelNumericVal);
            Ext.Ajax.request({
                url: 'eliminarvalornumerico',
                method: 'POST',
                params: {
                    arrid: Ext.encode(arrid)
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    PVD.ocultarMascara('mskdelnumericval');
                    if (responseData.exception) {
                        Ext.MessageBox.show({
                            title: labels.lbInfo,
                            msg: labels.lbMsgValorEnUso,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR,
                            fn: function() {
                                btnGuardarRangoN.focus();
                            }
                        });
                    } else {
                        Ext.MessageBox.show({
                            title: labels.lbInfo,
                            msg: labels.lbMsgDelNumericValOK,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO,
                            fn: function() {
                                btnGuardarRangoN.focus();
                            }
                        });
                        storeVRango.reload();
                    }
                }
            });
			}
		});
        }
    });

    tfValorI = new Ext.form.NumberField({
        fieldLabel: labels.valorI,
        id: 'tfValorI',
        name: 'valorinicial',
        allowBlank: false,
        allowNegative: false,
        minValue: 0,
        maxValue: 999,
        maxText: labels.valorMaxIText,
        minText: labels.valorMinText,
        anchor: '100%'
    });

    tfValorF = new Ext.form.NumberField({
        fieldLabel: labels.valorF,
        id: 'tfValorF',
        name: 'valorfinal',
        allowBlank: false,
        allowNegative: false,
        minValue: 0.01,
        maxValue: 900000000,
        maxText: labels.valorMaxFText,
        minText: labels.valorMinText,
        anchor: '100%'
    });

    tfPaso = new Ext.form.NumberField({
        fieldLabel: labels.paso,
        id: 'tfPaso',
        name: 'paso',
        allowBlank: false,
        allowNegative: false,
        value: 1,
        minValue: 0,
        minText: labels.valorMinText,
        maxText: labels.valorMaxIText,
        maxValue: 999,
        anchor: '100%'
    });

    tfPrecision = new Ext.form.NumberField({
        fieldLabel: 'Precisi&oacute;n',
        id: 'tfPrecision',
        name: 'precision',
        allowNegative: false,
        value: 0,
        maxValue: 5,
        anchor: '100%'
    });

    var cbRepresentacion = new Ext.form.ComboBox({
        fieldLabel: 'Representación',
        name: 'representacion',
        store: new Ext.data.SimpleStore({
            fields: ['valor', 'denom'],
            data : [[0, 'Listado de elemento'], [1, 'Campo de texto']]
        }),
        displayField:'denom',
        valueField:'valor',
        hiddenName:'representacion',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        allowBlank: false,
        emptyText:'Seleccione...',
        value: 0,
        selectOnFocus:true,
        readOnly: true,
        anchor: '100%',
        listeners: {
            select: function(cb, record) {
                if(record.get('valor') == 1){
                    tfPrecision.enable();
                    tfPaso.reset();
                    tfPaso.disable();
                } else {
                    tfPrecision.setValue(0);
                    tfPaso.setValue(1);
                    tfPrecision.disable();
                    tfPaso.enable();
                }
            }
        }
    });

    var keyRango = [{
            key: 'g',
            alt: true,
            fn: function() {
                btnGuardarRangoN.handler();
            }
        }
    ];
    pRangoN = new Ext.form.FormPanel({
    //pRangoN = new Ext.Panel({
        id: 'pRangoN',
        title: labels.rangoN,
        frame: true,
        width: '50%',
        keys: keyRango,
        height: 525,
        region: 'center',
        margins: '5 5 5 5',
        buttonAlign: 'center',
        buttons: [btnGuardarRangoN],
        items: [cbRepresentacion, tfValorI, tfValorF, tfPaso, tfPrecision]
    });

    //------------------------------------------------------------------------------------------------  GRID DE LA DERECHA --------------------------------------------------------------------------------------------
    var storeVRango = new Ext.data.Store({
        url: 'valoresRNSeleccionado',
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos"
        }, [{
                name: 'idvaloresnumericos'
            },
            {
                name: 'denom',
                type: 'float'
            }
        ]
                ),
        sortInfo: {
            field: 'denom',
            direction: 'ASC'
        }
    });
    var smGpRango = new Ext.grid.CheckboxSelectionModel();
    var cmVRango = [smGpRango,
        {
            id: 'idValoresNumericos',
            header: 'idValoresNumericos',
            hidden: true,
            width: 50,
            dataIndex: 'idvaloresnumericos'
        }
        , {
            id: 'denom',
            header: labels.lbDenominacionRango,
            sortable: true,
            width: 150,
            dataIndex: 'denom'
        }
    ];

    //Grid que muestra los valores numéricos que corresponden con el rango establecido.
    var gpVRango = new Ext.grid.GridPanel({
        id: 'gpVRango',
        tbar: [btnEliminarVN],
        sm: smGpRango,
        layout: 'fit',
        region: 'east',
        store: storeVRango,
        columns: cmVRango,
        stripeRows: true,
        loadMask: {
            msg: labels.cargando
        },
        margins: '5 5 5 0',
        autoScroll: true,
        border: true,
        autoExpandColumn: 'denom',
        height: 525,
        width: '50%',
        title: labels.gpVRangoTitle
    });
    //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //FormPanel que contiene el panel de rango numérico y el grid con los valores que corresponden a dicho rango.
    var fpRangoN = new Ext.Panel({
        id: 'fpRangoN',
        title: labels.fpRangoNTitle,
        layout: 'border',
        items: [pRangoN, gpVRango]
    });

    var pAsociarEscalaCualitativa = new Ext.PVD.Evaluaciones.Plantilla.AsociarEscalaCualitativa({
        labels: labels
    });
    var pAsociarEscalaImagen = new Ext.PVD.Evaluaciones.Plantilla.AsociarEscalaImagen({
        labels: labels
    });
    //---------------------------------------------------------------------------------------  VIEWPORT Y FPRMULARIO DERECHA  --------------------------------------------------------------------------------------------

    var tabPanel = new Ext.TabPanel({
        id: 'tabPanel',
        region: 'east',
        height: 578,
        width: '60%',
        //border: false,
        margins: '2 2 2 2',
        bodyBorder: false,
        hideBorders: true,
        //activeTab: 0,
        disabled: true,
        items: [fpRangoN, pAsociarEscalaCualitativa, pAsociarEscalaImagen],
        listeners: {
            'tabchange': function(tabPanel, tab) {
                if (tab.id == 'fpRangoN') {
                    fpRangoN.doLayout();
                }
                pAsociarEscalaCualitativa.doLayout();
                pAsociarEscalaImagen.doLayout();
            }
        }
    });

    vpEscala = new Ext.Viewport({
        layout: 'border',
        items: [gpEscala, tabPanel]
    });

    mascaraTE = new Ext.LoadMask(tabPanel.getEl(), {
        msg: labels.cargando
    });
    mascaraTE.enable();
    mascaraEnviarDatos = new Ext.LoadMask(Ext.getBody(), {
        msg: labels.mensajeEnviandoDatos
    });
    mascaraEnviarDatos.enable();

    //--------------------  FUNCTION TIPO ESCALA  ------------------
    //Muestra datos de tipo de escala según escala seleccionada
    function TipoEscala()
    {
        mascaraTE.show();
        var url = 'existenEscalas';
        Ext.Ajax.request({
            url: url,
            method: 'POST',
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData == 1)
                {
                    Ext.getCmp('tabPanel').disable();
                }
                else
                {
                    var aux = Ext.getCmp('gpEscala').getSelectionModel().getSelected().get('tipoescala');
                    var idEscala = Ext.getCmp('gpEscala').getSelectionModel().getSelected().get('idescala');
                    if (aux == 0)
                    {


                    }
                    else if (aux == 1)
                    {

                    }
                    else
                    {

                    }
                }
                mascaraTE.hide();
            }
        });
    }

    //---------------------------------------------------------------------------------------  FUNCTION FORM RANGO NUMERICO  -------------------------------------------------------------------------
    //Muestra los valores del rango numerico segun escala seleccionada
    function CargarFormRangoN(valor)
    {
        var responseData = Array();
        var url = 'buscarrangonumerico';
        Ext.Ajax.request({
            url: url,
            method: 'POST',
            params: {
                idescala: valor
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData[0]) {
                    pRangoN.getForm().setValues({
                        valorinicial: responseData[0]['valorinicial'],
                        valorfinal: responseData[0]['valorfinal'],
                        paso: responseData[0]['paso'],
                        precision: responseData[0]['precision'],
                        representacion: responseData[0]['representacion']
                    });

                    if(responseData[0]['representacion'] == 1){
                        tfPrecision.enable();
                        tfPaso.disable();
                    } else {
                        tfPrecision.disable();
                        tfPaso.enable();
                    }
                }
                else
                {
                    pRangoN.getForm().reset();
                }
            }
        });
    }

    //Guarda o modifica  el rango numérico para una escala dado su id
    function GuardarRangoN(idescala)
    {
        if (pRangoN.getForm().isValid()) {
        //if (tfValorI.isValid() && tfValorF.isValid() && tfPaso.isValid() && tfPrecision.isValid()) {
            var valorI = tfValorI.getValue();
            var valorF = tfValorF.getValue();
            var paso = tfPaso.getValue();

            var values = pRangoN.getForm().getValues();
            values.idescala = idescala;
            if (valorI < valorF) {
                if (paso <= valorF - valorI) {
                    mascaraEnviarDatos.show();
                    var url = 'guardarrangonumerico';
                    Ext.Ajax.request({
                        url: url,
                        method: 'POST',
                        params: values,
                        callback: function(options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            mascaraEnviarDatos.hide();
                            storeVRango.load({
                                params: {
                                    idescala: gpEscala.grid.getSelectionModel().getSelected().get('idescala')
                                }
                            });
							Ext.MessageBox.show({
                                title: labels.lbInfo,
                                msg: 'Los valores de escala de rango numérico han sido adicionados satisfactoriamente.',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.INFO
                            });
                        }
                    });
                } else {
                    Ext.MessageBox.show({
                        title: labels.lbInfo,
                        msg: labels.msgPasoNoRango,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR,
                        fn: function() {
                            btnGuardarRangoN.focus();
                        }
                    });
                }
            }
            else {
                Ext.getCmp('tfValorI').markInvalid('El valor inicial debe ser menor que el valor final.');
                Ext.getCmp('tfValorF').markInvalid('El valor final debe ser mayor que el valor inicial.');
            }
        }
    }
    //-------------- MOSTRAR IMAGEN EN EL GRID ------------------------

    function representarImagen(dirImagen) {
        if (dirImagen != "") {
            return "<img src=" + dirImagen + " width='60' height='60' />";
        }
    }

    function representarImagenSel(dirImagen) {
        if (dirImagen != "") {
            return "<img src=" + dirImagen + " width='60' height='60' />";
        }
    }


}//Fin Ext



