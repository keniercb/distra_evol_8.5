Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('definirproceso', cargarInterfaz);

//Botones
var btnAdicionarDP, btnModificarDP, btnPlanillas, btnAyudaDP, btnEliminarDP, btnRecomendacionDP, btnSenyalamientoDP;
var btnCancelarDP, btnAplicarDP, btnAceptarDP, btnAceptarPlanilla, btnCancelarPlanilla;
var btnCancelarAsociarR, btnAceptarAsociarR, btnCancelarAsociarS, btnAceptarAsociarS;
//Tool bar, Stores, plugin expander, y columnModel
var tbDP, st_DP, expanderDP, colummodel, ptDP, ptTR, ptR, st_TR, st_R, arrayMedidaTiempo, storeMedidaTiempo, storePeriodo, storeTipoProceso;
var ptRS, ptSS, ptTS, ptS, st_RS, st_SS, st_S, st_TS;
//Grids y el viewPort
var gpDP, vpDP, gpTR, gpR, gpSS, gpRS, gpTS, gpS;
//selectionModel
var smR, smS, smTS, smTR, smSS, smRS, smDP;
//Formularios
var formDP;
//Tree
var cargadorPlanilla, raizPlanilla, tpPlanilla;
//Windows
var winDP, mascaraDP, winAsociarR, winAsociarS, winArbolPlanillas;
//Combos
var tfDenominacionDP, dfFechaInicioDP, dfFechaFinDP, heDescripcionDP;
//FECHA
var fecha = new Date();
//GENERAL
var accion = 'ADD';
var aplicarR = false;
var aplicarS = false;
var leaf = false;
var denomPlanilla;
var idPlanillaEvaluativa = -1;
var sistema = 'RECO';
var idDPE = '';
var arrayIdRec = new Array();
var arrayIdRec = new Array();
var fecha = new Date();
var idmodelo = -1;
//Mas cosas
var smR, smTR, smDP;


//**************************************Principal function**********************************************************************
function cargarInterfaz() {
    perfil = arguments[0];
    labels = arguments[1];

    var btnAyudaTP = new Ext.Button({
        id: 'ayudaTP',
        text: labels.lbBtnAyudaTP,
        tooltip: labels.lbToolTipAyudaTP,
        iconCls: 'ayuda',
       /* handler: function () {
            var title = 'Ayuda del sistema de evaluaciones';
            var referencia = 'evaluaciones/defprocesoevaluativo';
            help.show(title, referencia);
        },*/
        nextTab: 'inputNombreDP',
        prevTab: 'notificacion' + self.id
    });

    var btnNotificacion = new Ext.Button({
        id: 'notificacion' + self.id,
        text: labels.lbBtnNotificacion,
        tooltip: labels.lbToolTipNotificacion,
        iconCls: 'comprobante',
        handler: function () {
            var winNotificacion = new Ext.components.Evaluaciones.WinNotificacion({
                title: labels.lbBtnNotificacion,
                idevaldefprosesoevaluativo:smDP.getSelected().get('iddefprocesoevaluativo'),
                parent:self,
                labels:labels
            });
            winNotificacion.formDefProcEval.getForm().loadRecord(gpDP.getSelectionModel().getSelected());
            winNotificacion.on('show',function(){
                if(gpDP.getSelectionModel().getSelected().get('idprocesonotif')){
                    winNotificacion.asunto.setValue(gpDP.getSelectionModel().getSelected().get('asunto'));
                    winNotificacion.mensaje.setValue(gpDP.getSelectionModel().getSelected().get('mensaje'));
                    winNotificacion.idprocesonotif.setValue(gpDP.getSelectionModel().getSelected().get('idprocesonotif'));
                    winNotificacion.remitente.setValue(gpDP.getSelectionModel().getSelected().get('remitente'));
                }
            },this);
            winNotificacion.show();

        },
        nextTab: 'ayudaTP',
        prevTab: 'senyalamientoDP',
    });

    btnAdicionarDP = new Ext.Button({
        id: 'adicionarDP',
        text: labels.lbBtnAdicionar,
        tooltip: labels.lbToolTipAdicionarDP,
        iconCls: 'adicionar',
        handler: function () {
            var objWinDefProcesoEvaluativo = new Ext.components.Evaluaciones.WinDefProcesoEvaluativo({
                title: 'Adicionar proceso evaluativo',
                labels: labels
            });
            objWinDefProcesoEvaluativo.show();
            objWinDefProcesoEvaluativo.on('close', function (cmp) {
                btnAdicionarDP.focus();
            });
            objWinDefProcesoEvaluativo.on('dataSaved', function () {
                st_DP.load({
                    params: {
                        limit: 15,
                        start: 0
                    },
                    callback: function () {
                        gpDP.getSelectionModel().selectFirstRow();
                    }
                });
            });
        },
        nextTab: 'modificarDP',
        prevTab: 'btnLimpiar',
    });

    btnRecomendacionDP = new Ext.Button({
        id: 'recomendacionDP',
        iconCls: 'recomendaciones',
        text: labels.lbRecomendaciones,
        tooltip: labels.lbttRecomendaciones,
        handler: function () {
            sistema = 'RECO';
            VentanaAsociar(sistema);
        }
    });

    btnSenyalamientoDP = new Ext.Button({//Etiquetas en el JSON y declarar la variable
        id: 'senyalamientoDP',
        iconCls: 'rosette',
        text: labels.lbSenyalamientos,
        tooltip: labels.lbttSenyalamientos,
        handler: function () {
            sistema = 'SENYA';
            VentanaAsociar(sistema);
        }
    });

    btnModificarDP = new Ext.Button({
        id: 'modificarDP',
        text: labels.lbBtnModificar,
        tooltip: labels.lbToolTipModificarDP,
        disabled: true,
        iconCls: 'modificar',
        handler: function () {
            var objWinDefProcesoEvaluativo = new Ext.components.Evaluaciones.WinDefProcesoEvaluativo({
                labels: labels,
                title: 'Modificar proceso evaluativo',
                iddefprocesoevaluativo: smDP.getSelected().get('iddefprocesoevaluativo'),
                denom: smDP.getSelected().get('denom'),
                descripcion: smDP.getSelected().get('descripcion'),
                fechacomienzo: smDP.getSelected().get('fechacomienzo'),
                idperiodoevaluativo: smDP.getSelected().get('idperiodoevaluativo'),
                idtipoprocesoevaluativo: smDP.getSelected().get('idtipoprocesoevaluativo'),
                puedereclamar: smDP.getSelected().get('puedereclamar'),
                opinionevaluado: smDP.getSelected().get('opinionevaluado'),
            });
            objWinDefProcesoEvaluativo.trigger.setValue(smDP.getSelected().get('denomescala'));
            objWinDefProcesoEvaluativo.hfIdEscala.setValue(smDP.getSelected().get('idescala'));
            objWinDefProcesoEvaluativo.show();
            objWinDefProcesoEvaluativo.on('close', function (cmp) {
                btnAdicionarDP.focus();
            });
            objWinDefProcesoEvaluativo.on('dataSaved', function () {
                st_DP.load({
                    params: {
                        limit: 15,
                        start: 0
                    },
                    callback: function () {
                        gpDP.getSelectionModel().selectFirstRow();
                    }
                });
            });
        }
    });

    btnPlanillas = new Ext.Button({
        text: labels.lbBtnPlanilla,
        iconCls: 'report_edit',
        tooltip: labels.ttpBtnPlanilla,
        handler: function () {
            var winAsocPlan = new Ext.components.Evaluaciones.WinAsociarPlanilla({
                title: labels.lbWinAsociarPlanilla,
                parent: gpDP,
                labels: labels,
                iddefprocesoevaluativo: gpDP.getSelectionModel().getSelected().get('iddefprocesoevaluativo')
            });
            winAsocPlan.show();
            winAsocPlan.on('hide', function (cmp) {
                st_DP.load({
                    params: {
                        limit: 15,
                        start: 0
                    },
                    callback: function () {
                        gpDP.getSelectionModel().selectFirstRow(), btnAdicionarDP.focus();
                    }
                });
            });
        }
    });

    btnEliminarDP = new Ext.Button({
        id: 'eliminarDP',
        text: labels.lbBtnEliminar,
        tooltip: labels.lbToolTipEliminarDP,
        disabled: true,
        iconCls: 'eliminar',
        handler: function () {
            mostrarMensaje(2, labels.lbBtnMsgEliminarD, function (btn) {
                if (btn == "ok") {
                    mascaraDP.show();
                    Ext.Ajax.request({
                        url: 'eliminardefinirproceso',
                        method: 'POST',
                        params: {
                            iddefprocesoevaluativo: smDP.selections.items[0].data.iddefprocesoevaluativo
                        },
                        callback: function (options, success, response) {
                            mascaraDP.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.exception == 1) {
                                mostrarMensaje(1, labels.lbConceptoEnUso);
                                btnAdicionarDP.focus();
                            } else {
                                mostrarMensaje(1, responseData.mensaje);
                                st_DP.load({
                                    params: {
                                        limit: 15,
                                        start: 0
                                    },
                                    callback: function () {
                                        gpDP.getSelectionModel().selectFirstRow();
                                    }
                                });
                            }
                        }
                    });
                } else {
                    btnEliminarDP.focus();
                }
            });
        }
    });

    btnAceptarAsociarR = new Ext.Button({
        iconCls: 'cerrar',
        text: labels.lbBtnCerrar,
        tooltip: labels.ttpBtnCerrar,
        handler: function () {
            winAsociarR.hide();
        }
    });

    btnAceptarAsociarS = new Ext.Button({
        iconCls: 'cerrar',
        text: labels.lbBtnCerrar,
        tooltip: labels.ttpBtnCerrar,
        handler: function () {
            winAsociarS.hide();
        }
    });

    expanderDP = new Ext.grid.RowExpander({
        tpl: new Ext.Template('<p><b>&nbsp;Descripci&oacute;n:</b> {descripcion}</p>')
    });

    st_DP = new Ext.data.Store({
        url: 'todosdefinirprocesosevaluativos',
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "iddefprocesoevaluativo"
        }, [
            {
                name: 'iddefprocesoevaluativo'
            },
            {
                name: 'denom'
            },
            {
                name: 'descripcion'
            },
            {
                name: 'fechacomienzo'
            },
            {
                name: 'idtipoprocesoevaluativo'
            },
            {
                name: 'idperiodoevaluativo'
            },
            {
                name: 'idescala'
            },
            {
                name: 'denomescala'
            },
            {
                name: 'puedereclamar'
            },
            {
                name: 'opinionevaluado'
            },
            {
                name: 'periodo'
            },
            {
                name: 'medidatiempo'
            },
            {
                name: 'tipoproceso'
            },
            {
                name: 'denomescala'
            },
            {
                name: 'asunto'
            },
            {
                name: 'mensaje'
            },
            {
                name: 'idprocesonotif'
            },
            {
                name: 'remitente'
            }
        ])
    });
    st_DP.on('load', function (st, records, options) {
        if (st.getCount() == 0) {
            mostrarMensaje(1, (Ext.getCmp('inputNombreDP').getValue() != '') ? labels.msgEmptySearch : labels.msgEmptyLoad);
            btnAdicionarDP.focus();
        }
    });

    storePeriodo = new Ext.data.Store({
        url: 'cargarcomboperiodo',
        reader: new Ext.data.JsonReader({
                id: 'idperiodoevaluativo',
                root: 'datos'
            },
            [
                {
                    name: 'idperiodoevaluativo'
                },
                {
                    name: 'periodo'
                },
                {
                    name: 'medidatiempo'
                }
            ])
    });

    storeTipoProceso = new Ext.data.Store({
        url: 'cargarcombotipoproceso',
        //autoLoad:true,
        reader: new Ext.data.JsonReader({
                id: 'idtipoprocesoevaluativo',
                root: 'datos'
            },
            [
                {
                    name: 'idtipoprocesoevaluativo'
                },
                {
                    name: 'denom'
                }
            ])
    });

    colummodel = [expanderDP,
        {
            id: 'expandir',
            header: labels.lbDenominacion,
            sortable: true,
            dataIndex: 'denom'
        },
        {
            header: labels.lbTipoProceso,
            sortable: true,
            width: 185,
            dataIndex: 'tipoproceso'
        },
        {
            header: labels.lbPeriodo,
            sortable: true,
            width: 75,
            dataIndex: 'periodo',
            renderer: MapearPeriodo()
        },
        {
            header: labels.flEscalaDesarrollo,
            sortable: true,
            width: 210,
            dataIndex: 'denomescala'
        },
        {
            header: labels.lbFechaInicio,
            sortable: true,
            width: 105,
            dataIndex: 'fechacomienzo'
        },
    ];

    function MapearPeriodo(params) {
        return function (value, metadata, record, rowIndex, colIndex, store) {
            var medidatiempo = record.get('medidatiempo');
            var periodo = record.get('periodo');
            switch (medidatiempo) {
                case '0' :
                    periodo == 1 ? medidatiempo = 'D&iacute;a' : medidatiempo = 'D&iacute;as';
                    break;
                case '1' :
                    periodo == 1 ? medidatiempo = 'Mes' : medidatiempo = 'Meses';
                    break;
                case '2' :
                    periodo == 1 ? medidatiempo = 'A&ntilde;o' : medidatiempo = 'A&ntilde;os';
                    break;
            }
            return periodo + " " + medidatiempo;
        };
    }

    function mostrarEstado(value) {
        if (value == false) { //caso en que el indicador sea de tipo imagen
            return "<img src=../../../procesoevaluativo/views/images/false.gif width='16' height='16' />";
        } else {
            return "<img src=../../../procesoevaluativo/views/images/true.png width='16' height='16' />";
        }
    }

    cargadorPlanilla = new Ext.tree.TreeLoader({
        dataUrl: 'cargarplanillasactivas',
        preloadChildren: true,
        baseParams: {
            idPlanilla: -1
        },
        listeners: {
            beforeload: function (cargadorPlanilla, node, response) {
                cargadorPlanilla.baseParams.idPlanilla = node.id;
            },
            load: function (cargadorPlanilla, node, response) {
                node.expand(false, false);
            }
        }
    });



    tpPlanilla = new Ext.tree.TreePanel({
        id: 'tpPlanilla',
        margins: '5 5 5 0',
        animate: true,
        border: true,
        containerScroll: true,
        rootVisible: true,
        layout: 'fit',
        selModel: new Ext.tree.DefaultSelectionModel(),
        loader: cargadorPlanilla,
        autoScroll: true,
        listeners: {
            click: function (nodo, event) {
                leaf = nodo.isLeaf();
                denomPlanilla = nodo.parentNode.text;
                idPlanillaEvaluativa = nodo.parentNode.id;
                idmodelo = nodo.id;
            }
        }
    });



    raizPlanilla = new Ext.tree.AsyncTreeNode({
        text: labels.lbttPE,
        expanded: true,
        id: 'raizPlanilla',
        allowDrag: false,
        allowDrop: false
    });


    ptDP = new Ext.PagingToolbar({
        pageSize: 15,
        store: st_DP,
        displayInfo: true,
        displayMsg: labels.lbPaginToolBar

    });

    tbDP = new Ext.Toolbar({
        id: 'tbDP',
        items: [btnAdicionarDP, btnModificarDP, btnEliminarDP, '-', btnPlanillas, btnRecomendacionDP, btnSenyalamientoDP, btnNotificacion, '->', btnAyudaTP]
    });

    tfDenominacionDP = new Ext.form.TextField({
        fieldLabel: labels.lbDenominacion,
        name: 'denom',
        id: 'denom',
        anchor: '98%',
        allowBlank: false,
        blankText: labels.lbCampoVacio,
        prevTab: 'aceptarDB'
    });

    tfPlanillaDP = new Ext.form.TextField({
        fieldLabel: labels.lbPlanilla,
        name: 'planilla',
        id: 'planilla',
        anchor: '95%',
        allowBlank: false,
        listeners: {
            focus: function (combo) {
                winArbolPlanillas.show();
            }
        },
        blankText: labels.lbCampoVacio
    });

    dfFechaInicioDP = new Ext.form.DateField({
        id: 'fechainicio',
        name: 'fechainicio',
        fieldLabel: labels.lbFechaInicio,
        value: fecha.format('d/m/Y'),
        format: 'd/m/Y',
        vtype: 'daterange',
        anchor: '95%',
        allowBlank: false,
        readOnly: true,
        blankText: labels.lbCampoVacio
    });

    chbPuedeReclamar = new Ext.form.Checkbox({
        boxLabel: labels.lbPuedeReclamar,
        name: 'chbPuedeReclamar',
        inputValue: 'true'
    });

    chbOpinionEvaluado = new Ext.form.Checkbox({
        boxLabel: labels.lbOpinionEvaluado,
        name: 'chbOpinionEvaluado',
        inputValue: 'true'
    });

    cbPeriodo = new Ext.form.ComboBox({
        name: 'cbPeriodo',
        typeAhead: true,
        triggerAction: 'all',
        valueField: 'idperiodoevaluativo',
        hiddenName: 'idperiodoevaluativo',
        forceSelection: true,
        anchor: '95%',
        displayField: 'periodo',
        store: storePeriodo,
        mode: 'local',
        allowBlank: false,
        blankText: labels.lbCampoVacio,
        //listeners  : { beforerender: function(combo){ combo.setValue(0); } },
        fieldLabel: labels.lbPeriodo

    });

    cbTipoProceso = new Ext.form.ComboBox({
        name: 'cbTipoProceso',
        typeAhead: true,
        triggerAction: 'all',
        valueField: 'idtipoprocesoevaluativo',
        hiddenName: 'idtipoprocesoevaluativo',
        forceSelection: true,
        anchor: '95%',
        displayField: 'denom',
        store: storeTipoProceso,
        mode: 'local',
        //listeners : { beforerender: function(combo){ combo.setValue(0); } },
        allowBlank: false,
        blankText: labels.lbCampoVacio,
        fieldLabel: labels.lbTipoProceso
    });

    heDescripcionDP = new Ext.form.TextArea({
        height: 115,
        anchor: '98%',
        id: 'descripcion',
        fieldLabel: labels.lbDescripcion
    });

    formDP = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        baseParams: {
            iddefinirprocesoevaluativo: -1,
            idPlanillaEvaluativa: -1,
            idmodelo: -1
        },
        autoHeight: true,
        autoRhow: true,
        items: [tfDenominacionDP, {
            layout: 'column',
            items: [
                {
                    columnWidth: .5,
                    layout: 'form',
                    items: [tfPlanillaDP, dfFechaInicioDP]
                },
                {
                    columnWidth: .5,
                    layout: 'form',
                    items: [cbPeriodo, cbTipoProceso]
                }
            ]
        }, {
            xtype: 'fieldset',
            title: 'Opciones',
            anchor: '98%',
            autoHeight: true,
            items: [
                {
                    xtype: 'checkboxgroup',
                    labelSeparator: '',
                    columns: 2,
                    vertical: true,
                    items: [chbPuedeReclamar, chbOpinionEvaluado]
                }
            ]
        }, heDescripcionDP]
    });

    btnCancelarDP = new Ext.Button({
        iconCls: 'cancelar',
        text: labels.lbtnCancelarDP,
        handler: function () {
            winDP.hide();
            LimpiarFormDP();

        }

    });

    btnCancelarPlanilla = new Ext.Button({
        iconCls: 'cancelar',
        text: labels.lbtnCancelarDP,
        handler: function () {
            winArbolPlanillas.hide();
        }

    });

    btnAceptarPlanilla = new Ext.Button({
        iconCls: 'aceptar',
        text: labels.lbtnAceptarDP,
        handler: function () {
            if (leaf) {
                winArbolPlanillas.hide();
                tfPlanillaDP.setValue(denomPlanilla);
                leaf = false;
            } else {
                mostrarMensaje(1, labels.lbMskModeloMatematico);
            }
        }
    });


    btnAplicarDP = new Ext.Button({
        id: 'btnAplicarDP',
        iconCls: 'aplicar',
        text: labels.lbtnAplicarDP,
        handler: function () {
            RealizarAccion(accion, 'APLI');
        }
    });

    btnAceptarDP = new Ext.Button({
        iconCls: 'aceptar',
        id: 'aceptarDB',
        text: labels.lbtnAceptarDP,
        tooltip: labels.lbToolTipAceptarDP,
        handler: function () {
            RealizarAccion(accion, 'ACEP');
        },
        nextTab: 'denom'

    });

    function LimpiarFormDP() {
        formDP.getForm().reset();
        //tfDenominacionDP.setValue('');
        //heDescripcionDP.setValue('');
        //dfFechaInicioDP.setValue('');
        //dfFechaFinDP.setValue('');
    }

    function VentanaDP(accion) {
        var record;
        storePeriodo.load();
        storeTipoProceso.load();
        if (accion == 'ADD') {
            LimpiarFormDP();
            winDP.setTitle(labels.lbCrearDP);
            dfFechaInicioDP.setValue(fecha.format('d/m/Y'));
            Ext.getCmp('btnAplicarDP').show();
            winDP.show();
        } else {
            Ext.Ajax.request({
                url: 'obteneridmodelomodificar',
                method: 'POST',
                params: {
                    iddefinirprocesoevaluativo: smDP.selections.items[0].data.iddefprocesoevaluativo
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    idmodelo = responseData.idmodeloamodificar;
                    //mostrarMensaje(1,responseData.idmodeloamodificar, function(btn){st_DP.load({params:{limit:15, start:0}, callback:function(){gpDP.getSelectionModel().selectFirstRow();}});});
                }
            });
            record = gpDP.getSelectionModel().getSelected();
            tfDenominacionDP.setValue(record.get('denom'));
            heDescripcionDP.setValue(record.get('descripcion'));
            dfFechaInicioDP.setValue(record.get('fechacomienzo'));
            cbTipoProceso.setValue(record.get('idtipoprocesoevaluativo'));
            cbPeriodo.setValue(record.get('idperiodoevaluativo'));
            tfPlanillaDP.setValue(record.get('planilla'));
            winDP.setTitle(labels.lbToolTipModificarDP);
            Ext.getCmp('btnAplicarDP').hide();
            winDP.show();
            chbPuedeReclamar.setValue(record.get('puedereclamar'));
            chbOpinionEvaluado.setValue(record.get('opinionevaluado'));
        }
    }

    function VentanaAsociar() {
        var record = gpDP.getSelectionModel().getSelected();
        if (sistema == 'RECO') {
            winAsociarR.setTitle(labels.titleAsociarReco);
            winAsociarR.show();
            st_TR.load({
                params: {
                    limit: 5,
                    start: 0
                },
                callback: function () {
                    gpTR.getSelectionModel().selectFirstRow();
                }
            });
            st_RS.load({
                params: {
                    iddefprocesoevaluativo: gpDP.getSelectionModel().getSelected().get('iddefprocesoevaluativo'),
                    limit: 5,
                    start: 0
                }
            });

        } else {
            winAsociarS.setTitle(labels.titleAsociarSenna);
            winAsociarS.show();
            st_TS.load({
                params: {
                    limit: 5,
                    start: 0
                },
                callback: function () {
                    gpTS.getSelectionModel().selectFirstRow();
                }
            });
            st_SS.load({
                params: {
                    iddefprocesoevaluativo: gpDP.getSelectionModel().getSelected().get('iddefprocesoevaluativo'),
                    limit: 5,
                    start: 0
                }
            });
        }
    }
    var keysAdd = [
        {
            key: Ext.EventObject.ENTER,
            fn: function () {
                btnAceptarDP.handler();
            }
        },
        {
            key: 'p',
            alt: true,
            ctrl: true,
            fn: function () {
                btnAplicarDP.handler();
            }
        },
        {
            key: 'x',
            alt: true,
            fn: function () {
                btnCancelarDP.handler();
            }
        }
    ];
    winDP = new Ext.Window({
        layout: 'fit',
        modal: true,
        closable: true,
        resizable: false,
        keys:keysAdd,
        closeAction: 'hide',
        width: 400,
        autoHeight: true,
        items: [formDP],
        buttons: [btnCancelarDP, btnAplicarDP, btnAceptarDP]
    });
    winDP.on('hide', function (cmp) {
        btnAdicionarDP.focus();
    });

    winArbolPlanillas = new Ext.Window({
        title: labels.lbttPEMM,
        layout: 'fit',
        modal: true,
        closable: true,
        resizable: false,
        closeAction: 'hide',
        width: 300,
        height: 450,
        items: [tpPlanilla],
        buttons: [btnCancelarPlanilla, btnAceptarPlanilla]
    });

    winArbolPlanillas.on('hide', function (cmp) {
        btnAdicionarDP.focus();
    });

    /*store del tipo de recomendacion*/
    st_TR = new Ext.data.Store({
        url: 'cargartiposrecomendaciones',
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "idtiporecomendacion"
        }, [
            {
                name: 'idtiporecomendacion'
            },
            {
                name: 'denom'
            },
            {
                name: 'descripcion'
            },
            {
                name: 'fechainicio'
            },
            {
                name: 'fechafin'
            }
        ])
    });

    st_TR.on('load', function (st, records, options) {
        btnAceptarAsociarR.focus();
    });

    /*store del tipo de señalamiento*/
    st_TS = new Ext.data.Store({
        url: 'cargartipossenyalamientos',
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "idtiposenyalamiento"
        }, [
            {
                name: 'idtiposenyalamiento'
            },
            {
                name: 'denom'
            },
            {
                name: 'descripcion'
            },
            {
                name: 'fechainicio'
            },
            {
                name: 'fechafin'
            }
        ])
    });
    st_TS.on('load', function (st, records, options) {
        btnAceptarAsociarS.focus();
    });

    /*store  de recomendacion*/
    st_R = new Ext.data.Store({
        url: 'cargarrecomendaciones',
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "idrecomendacion"
        }, [
            {
                name: 'idrecomendacion'
            },
            {
                name: 'idtiporecomendacion'
            },
            {
                name: 'denom',
                type: 'string'
            }
        ])
    });

    st_R.on('beforeload', function (store, pobject) {
        if (gpTR.getSelectionModel().hasSelection()) {
            pobject.params.iddefprocesoevaluativo = gpDP.getSelectionModel().getSelected().get('iddefprocesoevaluativo');
            pobject.params.idtiporecomendacion = gpTR.getSelectionModel().getSelected().get('idtiporecomendacion');
        }
    });

    /*store  de recomendacion asociadas*/
    st_RS = new Ext.data.Store({//Arreglar
        url: 'cargarrecomendacionesasociadas',
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "idprocesorecomendaciones"
        }, [
            {
                name: 'idprocesorecomendaciones'
            },
            {
                name: 'denom'
            }
        ])
    });
    st_RS.on('beforeload', function (store, pobject) {
        pobject.params.iddefprocesoevaluativo = gpDP.getSelectionModel().getSelected().get('iddefprocesoevaluativo');
    });

    /*store  de señalamiento*/
    st_S = new Ext.data.Store({
        url: 'cargarsenyalamientos',
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "idsenyalamiento"
        }, [
            {
                name: 'idsenyalamiento'
            },
            {
                name: 'idtiposenyalamiento'
            },
            {
                name: 'denom',
                type: 'string'
            },
            {
                name: 'fechainicio'
            },
            {
                name: 'fechafin'
            },
            {
                name: 'descripcion',
                type: 'string'
            }
        ])
    });
    st_S.on('beforeload', function (store, pobject) {
        if (gpTS.getSelectionModel().hasSelection()) {
            pobject.params.iddefprocesoevaluativo = gpDP.getSelectionModel().getSelected().get('iddefprocesoevaluativo');
            pobject.params.idtiposenyalamiento = gpTS.getSelectionModel().getSelected().get('idtiposenyalamiento');
        }
    });

    /*store de señalamiento asociasdos*/
    st_SS = new Ext.data.Store({//Arreglar
        url: 'cargarsenyalamientosasociados',
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "idprocesoresenyalamiento"
        }, [
            {
                name: 'idprocesoresenyalamiento'
            },
            {
                name: 'denom'
            }
        ])
    });
    st_SS.on('beforeload', function (store, pobject) {
        pobject.params.iddefprocesoevaluativo = gpDP.getSelectionModel().getSelected().get('iddefprocesoevaluativo');
    });

    ptTR = new Ext.PagingToolbar({
        pageSize: 5,
        store: st_TR,
        displayMsg: labels.lbPaginToolBar
    });

    ptTS = new Ext.PagingToolbar({
        pageSize: 5,
        store: st_TS,
        displayMsg: labels.lbPaginToolBar
    });

    ptR = new Ext.PagingToolbar({
        pageSize: 5,
        store: st_R,
        displayMsg: labels.lbPaginToolBar
    });

    ptS = new Ext.PagingToolbar({
        pageSize: 5,
        store: st_S,
        displayMsg: labels.lbPaginToolBar
    });

    ptSS = new Ext.PagingToolbar({
        pageSize: 5,
        store: st_SS,
        displayMsg: labels.lbPaginToolBar
    });

    ptRS = new Ext.PagingToolbar({
        pageSize: 5,
        store: st_RS,
        displayMsg: labels.lbPaginToolBar
    });

    smDP = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (sm, row, rec) {
                Ext.getCmp('eliminarDP').enable();
                Ext.getCmp('modificarDP').enable();
            }
        }
    });

    gpDP = new Ext.grid.GridPanel({
        id: 'idDP',
        title: labels.lbgpDP,
        columns: colummodel,
        stripeRows: true,
        autoScroll: true,
        store: st_DP,
        plugins: expanderDP,
        autoExpandColumn: 'expandir',
        loadMask: {
            msg: labels.lbGridLoadMask
        },
        minSize: 75,
        region: 'center',
        padding: '0 0 0 0',
        margins: '0 5 5 5',
        sm: smDP,
        bbar: ptDP
    });

    smR = new Ext.grid.CheckboxSelectionModel({
        checkOnly: true,
        listeners: {
            rowselect: function (sm, row, rec) {
            }
        }
    });

    smTR = new Ext.grid.RowSelectionModel({
        listeners: {
            rowselect: function (sm, row, rec) {
                st_R.load({
                    params: {
                        idtiporecomendacion: rec.data.idtiporecomendacion,
                        iddefprocesoevaluativo: gpDP.getSelectionModel().getSelected().get('iddefprocesoevaluativo'),
                        limit: 5,
                        start: 0
                    }
                });
            },
            selectionchange: function (sm) {
                st_R.removeAll();
            }
        }
    });

    smS = new Ext.grid.CheckboxSelectionModel();

    smTS = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: function (sm, row, rec) {
                st_S.load({
                    params: {
                        idtiposenyalamiento: rec.data.idtiposenyalamiento,
                        iddefprocesoevaluativo: gpDP.getSelectionModel().getSelected().get('iddefprocesoevaluativo'),
                        limit: 5,
                        start: 0
                    }
                });
            },
            selectionchange: function (sm) {
                st_S.removeAll();
            }
        }
    });

    smSS = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: function (sm, row, rec) {

            }
        }
    });

    smRS = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: function (sm, row, rec) {

            }
        }
    });

    gpTR = new Ext.grid.GridPanel({
        id: 'idTR',
        title: labels.lbgpTR,
        columns: [
            {
                id: 'expandir',
                header: labels.lbTipoRec,
                sortable: true,
                width: 75,
                dataIndex: 'denom'
            }
        ],
        stripeRows: true,
        store: st_TR,
        autoExpandColumn: 'expandir',
        loadMask: {
            msg: labels.lbGridLoadMask
        },
        minRize: 75,
        region: 'west',
        padding: '0 0 0 0',
        margins: '5 0 0 5',
        width: '50%',
        sm: smTR,
        bbar: ptTR
    });

    gpTS = new Ext.grid.GridPanel({
        id: 'idTS',
        columns: [
            {
                id: 'expandir',
                header: labels.lbTipoSen,
                sortable: true,
                width: 75,
                dataIndex: 'denom'
            }
        ],
        stripeRows: true,
        store: st_TS,
        autoExpandColumn: 'expandir',
        loadMask: {
            msg: labels.lbGridLoadMask
        },
        minSize: 75,
        region: 'west',
        padding: '0 0 0 0',
        margins: '5 0 0 5',
        width: '50%',
        sm: smTS,
        bbar: ptTS
    });

    gpR = new Ext.grid.GridPanel({
        id: 'gpR',
        title: labels.lbgpR,
        columns: [smR, {
            id: 'expandirR',
            header: labels.lbRecomendaciones,
            sortable: true,
            width: 75,
            dataIndex: 'denom'
        }],
        stripeRows: true,
        store: st_R,
        autoExpandColumn: 'expandirR',
        loadMask: {
            msg: labels.lbGridLoadMask
        },
        minRize: 75,
        region: 'center',
        margins: '5 5 0 0',
        width: '50%',
        sm: smR,
        bbar: ptR
    });

    gpS = new Ext.grid.GridPanel({
        id: 'gpS',
        columns: [smS, {
            id: 'expandirS',
            header: labels.lbSenyalamientos,
            sortable: true,
            width: 75,
            dataIndex: 'denom'
        }],
        stripeRows: true,
        autoScroll: true,
        store: st_S,
        autoExpandColumn: 'expandirS',
        loadMask: {
            msg: labels.lbGridLoadMask
        },
        minSize: 75,
        region: 'center',
        margins: '5 5 0 0',
        width: '50%',
        sm: smS,
        bbar: ptS
    });

    btnSubirfilaR = new Ext.Button({
        id: 'subirfilaR',
        iconCls: 'arriba',
        tooltip: labels.lbBtnSubirRecomendacion,
        handler: function () {
            if (smRS.selections.length > 0) {
                var misSelecciones = new Array();
                for (var i = 0; i < smRS.selections.length; i++) {
                    misSelecciones[i] = smRS.selections.items[i].data.idprocesorecomendaciones;
                }
                Ext.Ajax.request({
                    url: 'restaurarasociaciones',
                    method: 'POST',
                    params: {
                        recomendacionesAsociadas: Ext.encode(misSelecciones)
                    },
                    callback: function (options, success, response) {
                        st_RS.load({
                            params: {
                                iddefprocesoevaluativo: gpDP.getSelectionModel().getSelected().get('iddefprocesoevaluativo'),
                                limit: 5,
                                start: 0
                            }
                        });
                        st_R.load({
                            params: {
                                idtiporecomendacion: smTR.getSelected().get('idtiporecomendacion'),
                                iddefprocesoevaluativo: gpDP.getSelectionModel().getSelected().get('iddefprocesoevaluativo'),
                                limit: 5,
                                start: 0
                            }
                        });
                    }
                });
            } else {
                mostrarMensaje('1', 'Debe seleccionar al menos una recomendación.');
            }

        }
    });

    btnBajarfilaR = new Ext.Button({
        id: 'bajarfilaR',
        iconCls: 'abajo',
        tooltip: labels.lbBtnBajarRecomendacion,
        handler: function () {
            if (smR.selections.length > 0) {
                var misSelecciones = new Array();
                for (var i = 0; i < smR.selections.length; i++) {
                    misSelecciones[i] = smR.selections.items[i].data.idrecomendacion;
                }
                Ext.Ajax.request({
                    url: 'asociarrecomendaciones',
                    method: 'POST',
                    params: {
                        recomendaciones: Ext.encode(misSelecciones),
                        iddefinirprocesoevaluativo: smDP.selections.items[0].data.iddefprocesoevaluativo
                    },
                    callback: function (options, success, response) {
                        st_RS.load({
                            params: {
                                iddefprocesoevaluativo: gpDP.getSelectionModel().getSelected().get('iddefprocesoevaluativo'),
                                limit: 5,
                                start: 0
                            }
                        });
                        st_R.load({
                            params: {
                                idtiporecomendacion: smTR.getSelected().get('idtiporecomendacion'),
                                iddefprocesoevaluativo: gpDP.getSelectionModel().getSelected().get('iddefprocesoevaluativo'),
                                limit: 5,
                                start: 0
                            }
                        });
                    }
                });
            } else {
                mostrarMensaje('1', 'Debe seleccionar al menos una recomendación.');
            }
        }
    });

    btnSubirfilaS = new Ext.Button({
        id: 'subirfilaS',
        iconCls: 'arriba',
        tooltip: labels.lbBtnSubirSennalamiento,
        handler: function () {
            if (smSS.selections.length > 0) {
                var misSelecciones = new Array();
                for (var i = 0; i < smSS.selections.length; i++) {
                    misSelecciones[i] = smSS.selections.items[i].data.idprocesoresenyalamiento;
                }
                Ext.Ajax.request({
                    url: 'restaurarasociacionesS',
                    method: 'POST',
                    params: {
                        senyalamientosAsociadas: Ext.encode(misSelecciones)
                    },
                    callback: function (options, success, response) {
                        st_SS.load({
                            params: {
                                iddefprocesoevaluativo: gpDP.getSelectionModel().getSelected().get('iddefprocesoevaluativo'),
                                limit: 5,
                                start: 0
                            }
                        });
                        st_S.load({
                            params: {
                                idtiposenyalamiento: gpTS.getSelectionModel().getSelected().get('idtiposenyalamiento'),
                                iddefprocesoevaluativo: gpDP.getSelectionModel().getSelected().get('iddefprocesoevaluativo'),
                                limit: 5,
                                start: 0
                            }
                        });
                    }
                });
            } else {
                mostrarMensaje('1', 'Debe seleccionar al menos una recomendación.');
            }
        }
    });

    btnBajarfilaS = new Ext.Button({
        id: 'bajarfilaS',
        iconCls: 'abajo',
        tooltip: labels.lbBtnBajarSennalamiento,
        handler: function () {
            if (smS.selections.length > 0) {
                var misSelecciones = new Array();
                for (var i = 0; i < smS.selections.length; i++) {
                    misSelecciones[i] = smS.selections.items[i].data.idsenyalamiento;
                }
                Ext.Ajax.request({
                    url: 'asociarsenyalamientos',
                    method: 'POST',
                    params: {
                        senyalamientos: Ext.encode(misSelecciones),
                        iddefinirprocesoevaluativo: smDP.selections.items[0].data.iddefprocesoevaluativo
                    },
                    callback: function (options, success, response) {
                        st_S.load({
                            params: {
                                idtiposenyalamiento: gpTS.getSelectionModel().getSelected().get('idtiposenyalamiento'),
                                iddefprocesoevaluativo: gpDP.getSelectionModel().getSelected().get('iddefprocesoevaluativo'),
                                limit: 5,
                                start: 0
                            }
                        });
                        st_SS.load({
                            params: {
                                iddefprocesoevaluativo: gpDP.getSelectionModel().getSelected().get('iddefprocesoevaluativo'),
                                limit: 5,
                                start: 0
                            }
                        });
                    }
                });
            } else {
                mostrarMensaje('1', 'Debe seleccionar al menos una recomendación.');
            }
        }
    });

    ttbRecAsociadas = new Ext.Toolbar({
        id: 'ttbRecAsociadas',
        items: ['->', btnSubirfilaR, ' ', ' ', ' ', btnBajarfilaR, '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;']
    });

    ttbSenAsociadas = new Ext.Toolbar({
        id: 'ttbSenAsociadas',
        items: ['->', btnSubirfilaS, ' ', ' ', ' ', btnBajarfilaS, '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;']
    });

    gpRS = new Ext.grid.GridPanel({
        id: 'gpRS',
        title: labels.lbgpR,
        columns: [smRS, {
            id: 'expandirRS',
            header: labels.cMRecAsociada,
            sortable: true,
            dataIndex: 'denom'
        }],
        tbar: ttbRecAsociadas,
        stripeRows: true,
        store: st_RS,
        autoExpandColumn: 'expandirRS',
        loadMask: {
            msg: labels.lbGridLoadMask
        },
        minRize: 75,
        layout: 'fit',
        region: 'south',
        height: 230,
        margins: '0 5 5 5',
        width: '50%',
        sm: smRS,
        bbar: ptRS
    });

    gpSS = new Ext.grid.GridPanel({
        id: 'gpSS',
        title: labels.lbgpS,
        columns: [smSS, {
            id: 'expandirSS',
            header: labels.cMSennaAsociado,
            sortable: true,
            dataIndex: 'denom'
        }],
        stripeRows: true,
        tbar: ttbSenAsociadas,
        store: st_SS,
        autoExpandColumn: 'expandirSS',
        loadMask: {
            msg: labels.lbGridLoadMask
        },
        minRize: 75,
        layout: 'fit',
        height: 230,
        region: 'south',
        margins: '5 5 5 5',
        width: '50%',
        sm: smSS,
        bbar: ptSS
    });

    var keysR = [

        {
            key: 'x',
            alt: true,
            fn: function () {
                btnAceptarAsociarR.handler();
            }
        }
    ];

    winAsociarR = new Ext.Window({
        id: 'winAsociarR',
        region: 'south',
        modal: true,
        closable: true,
        resizable: false,
        closeAction: 'hide',
        width: 550,
        keys:keysR,
        height: 500,
        layout: 'border',
        defaults: {
            split: true
        },
        items: [gpTR, gpR, gpRS],
        buttons: [btnAceptarAsociarR]
    });

    winAsociarR.on('hide', function (cmp) {
        btnAdicionarDP.focus();
    });
    var keysS = [

        {
            key: 'x',
            alt: true,
            fn: function () {
                btnAceptarAsociarS.handler();
            }
        }
    ];
    winAsociarS = new Ext.Window({
        id: 'winAsociarS',
        modal: true,
        closable: true,
        resizable: false,
        closeAction: 'hide',
        width: 550,
        keys:keysS,
        height: 500,
        layout: 'border',
        defaults: {
            split: true
        },
        items: [gpTS, gpS, gpSS],
        buttons: [btnAceptarAsociarS]
    });

    winAsociarS.on('hide', function (cmp) {
        btnAdicionarDP.focus();
    });


    function RealizarAccion(accion, boton) {

        var url = 'adicionardefinirproceso', msgForm = labels.lbWaitMsgAddDP;
        var iddefinirprocesoevaluativo = -1;
        if (accion == 'ADD') {
            url = 'adicionardefinirproceso';
            msgForm = labels.lbWaitMsgAddDP;
        }
        else {
            msgForm = labels.lbWaitMsgModDP;
            if (idPlanillaEvaluativa == -1) {
                idPlanillaEvaluativa = gpDP.getSelectionModel().getSelected().get('idplanilla');
            }
            idptipoprocesoevaluativo = gpDP.getSelectionModel().getSelected().get('idtipoprocesoevaluativo');
            iddefinirprocesoevaluativo = gpDP.getSelectionModel().getSelected().get('iddefprocesoevaluativo');
            url = 'modificardefinirproceso';

        }
        formDP.baseParams.iddefinirprocesoevaluativo = iddefinirprocesoevaluativo;
        formDP.baseParams.idPlanillaEvaluativa = idPlanillaEvaluativa;
        formDP.baseParams.idmodelo = idmodelo;
        if (formDP.getForm().isValid()) {
            formDP.getForm().submit({
                url: url,
                waitMsg: msgForm,
                failure: function (form, action) {
                    if (action.result.codResult == 1) {
                        if (accion == 'ADD') {
                            mostrarMensaje(1, action.result.mensaje);
                        }
                        else
                        {
                            mostrarMensaje(1, 'El proceso evaluativo ha sido modificado satisfactoriamente.');
                        }

                        if (boton == 'ACEP') {
                            winDP.hide();
                        }
                        gpDP.getSelectionModel().clearSelections();
                        st_DP.removeAll();
                        st_DP.load({
                            params: {
                                limit: 15,
                                start: 0
                            },
                            callback: function () {
                                gpDP.getSelectionModel().selectFirstRow();
                            }
                        });
                        if (accion == 'ADD' || accion == 'MOD') {
                            LimpiarFormDP();
                        }
                    } else if (action.result.codResult == 3)
                        mostrarMensaje(1, action.result.mensaje);

                }
            });
        }
        idPlanillaEvaluativa = -1;
        idmodelo = -1;
    }

    var btnBuscar = new Ext.Button({
        iconCls: 'buscar',
        id: "btn_Buscar",
        tooltip: labels.lbToolTipBuscarDP,
        text: labels.lbBtnBuscar,
        handler: function () {
            st_DP.load({
                params: {
                    filtro: Ext.getCmp('inputNombreDP').getValue(),
                    limit: 15,
                    start: 0
                },
                callback: function () {
                    gpDP.getSelectionModel().selectFirstRow();
                }
            });
        },
        nextTab: 'btnLimpiar',
        prevTab: 'inputNombreDP',
    });

    var btnLimpiar = new Ext.Button({
        id: 'btnLimpiar',
        tooltip: labels.lbToolTipLimpiar,
        text: labels.lbBtnLimpiar,
        iconCls: 'limpiar',
        handler: function () {
            Ext.getCmp('inputNombreDP').reset();
            st_DP.load({
                params: {
                    filtro: Ext.getCmp('inputNombreDP').getValue(),
                    limit: 15,
                    start: 0
                },
                callback: function () {
                    gpDP.getSelectionModel().selectFirstRow();
                }
            });
        },
        nextTab: 'adicionarDP',
        prevTab: 'btn_Buscar',
    });

    var pFiltros = new Ext.Panel({
        cls: 'x-toolbar',
        layout: 'column',
        margins: '5 5 5 5',
        frame: true,
        defaults: {
            layout: 'form',
            border: false,
            labelAlign: 'top',
            buttonAlign: 'right'
        },
        height: 64,
        autoScroll: true,
        autoShow: true,
        region: 'north',
        items: [
            {
                columnWidth: .3,
                layout: 'form',
                items: [
                    {
                        xtype: 'textfield',
                        id: 'inputNombreDP',
                        anchor: '95%',
                        minLength: 3,
                        maxLength: 100,
                        fieldLabel: labels.lbDenominacion,
                        emptyText: labels.lbEmptyTextBuscar,
                        listeners: {
                            specialkey: function (field, e) {
                                if (e.getKey() == e.ENTER) {
                                    if (!Ext.isEmpty(this.getValue())) {
                                        st_DP.load({
                                            params: {
                                                filtro: Ext.getCmp('inputNombreDP').getValue(),
                                                limit: 15,
                                                start: 0
                                            },
                                            callback: function () {
                                                gpanel.getSelectionModel().selectFirstRow();
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                ]
            },
            {
                layout: 'form',
                bodyStyle: 'padding:19px 0 0 0;',
                columnWidth: '35px',
                items: [btnBuscar]
            },
            {
                layout: 'form',
                bodyStyle: 'padding:19px 0 0 0;',
                columnWidth: '35px',
                items: [btnLimpiar]
            }
        ]
    });

    var kmDefinirPE = [
        {
            key: 'i',
            alt: true,
            fn: function () {
                btnAdicionarDP.handler();
            }
        },
        {
            key: 'm',
            alt: true,
            fn: function () {
                if (!btnModificarDP.disabled) {
                    btnModificarDP.handler();
                }
            }
        },
        {
            key: 46,
            fn: function () {
                if (!btnEliminarDP.disabled) {
                    btnEliminarDP.handler();
                }
            }
        },
        {
            key: 'h',
            alt: true,
            fn: function () {
                btnAyudaTP.handler();
            }
        },
        {
            key: 'b',
            alt: true,
            fn: btnBuscar.handler
        },
        {
            key: 'l',
            alt: true,
            fn: btnLimpiar.handler
        },
        {
            key: 'p',
            ctrl: true,
            alt: true,
            fn: btnPlanillas.handler
        },
        {
            key: 'r',
            ctrl: true,
            alt: true,
            fn: btnRecomendacionDP.handler
        },
        {
            key: 's',
            ctrl: true,
            alt: true,
            fn: btnSenyalamientoDP.handler
        }
    ];

    var pContenedor = new Ext.Panel({
        bodyBorder: false,
        tbar: tbDP,
        region: 'center',
        layout: 'border',
        items: [pFiltros, gpDP],
        keys: kmDefinirPE,
        listeners: {
            render: function (cmp) {
                btnAdicionarDP.focus();
            }
        }
    });

    vpDP = new Ext.Viewport({
        layout: 'border',
        items: [pContenedor]
    });


    tpPlanilla.setRootNode(raizPlanilla);

    st_DP.load({
        params: {
            limit: 15,
            start: 0
        },
        callback: function () {
            gpDP.getSelectionModel().selectFirstRow();
        }
    });
    mascaraDP = new Ext.LoadMask(gpDP.getEl(), {
        msg: labels.lbMaskElimDP
    });
    mascaraDP.enable();
}
