Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('plantillas', cargarInterfaz);
//BOTONES
var btnAdicionarPlanilla, btnEliminarPlanilla, btnModificarPlanilla, btnAyuda, btnCancelarDominio, btnAplicarDominio,
    btnBuscarPlanilla, btnGestionarIndicador, btnVer, btnGuardarDP, btnLimpiarDP, btnCancelarDP, btnAdicionarIP,
    btnEliminarIP, btnCerrar;
//STORES, CM, ARRAY, EXPANDER
var smPlanilla, expanderPlanilla, storePlanilla, cmPlanilla, storeRecurso, cmRecurso, storeEstado, storeEscala,
    storeIndicadorAgrupacion, expanderIndAgrupacion, cmIndicadorAgrupacion, storeValoresEscala, cmValoresEscala, smIndicadorAgrupacion;
//TOOLS y PAGGINGS BARS
var tbPlanilla, pagingPlanilla, pagingDominio, toolbIndicadorPlanilla;
//CONTENEDORES
var pFiltros, gpPlanilla, gpRecurso, vpPlanilla, gpIndicadorAgrupacion, gpValoresEscala;
//TEXT, COMBOS, AREAS,  COMBO, OTROS
var tfdenomPlanilla, tfcodigoPlanilla, tfversionPlanilla, heDescripcionPlanilla, dfFIPlanilla, dfFFPlanilla, tfdominioPlanilla,
    cbestadoPlanilla, tfBuscarDenomPlanilla, chbEscalaIP, chbComplementoTextIP,chbComplementoObligatorio, cbEscala, heDescripcionIndicador,
    tabpIndicadorPlanilla, menuTreePanelIP;
//VENTANAS , FORMULARIOS Y PANELES
var fpPlanilla, winPlanilla, winDominio, winIndImagen, fpIndicadorPlanilla, winDisenarPlanilla, winValoresEscala;
//FECHA
var fecha = new Date();
//GENERAL
var accion = 'ADD';
var accionI = 'ADD';
var idPlanillaSeleccionada, nodoSeleccionado, menuSeleccionado;
var idDominio = -1;
var denomDominio, cargadorDominio, tpDominio, raizDominio;
var cargadorIndicadores, treepIndicadorPlanilla, raizIndicadorPlanilla;
var datosIP = new Array();
var indicadorSelectgpIA, datosIndicadorEvaluar;
var cambio = 0; //variable para controlar si se modificó algún componente

var tplExpMat = new Ext.Template(
    '<div style="margin:5px; font-size:12px;">',
    '<p><b>Denominación:</b> {denom}</p>',
    '<p><b>Expresión:</b> {expmat}</p></div>'
);
tplExpMat.compile();
//************** VTYPE DATERANGE  ***************
Ext.apply(Ext.form.VTypes, {
    daterange: function (val, field) {
        var date = field.parseDate(val);
        if (!date) {
            return;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = Ext.getCmp(field.startDateField);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;
        }
        else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = Ext.getCmp(field.endDateField);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }
        return true;
    }

});
function cargarInterfaz() {
    perfil = arguments[0];
    labels = arguments[1];

    btnGuardarDP = new Ext.Button({
        id: 'btnGuardarDP',
        iconCls: 'guardar',
        text: labels.lbBtnGuardar,
        tooltip: labels.lbToolTipGuardar,
        disabled: true,
        nextTab: 'chbEscalaIP',
        prevTab: 'btnLimpiarDP',
        handler: function () {
            if (nodoSeleccionado.isLeaf()) {
                GuardarDatosIP(nodoSeleccionado.id);
            } else if (gpIndicadorAgrupacion.getSelectionModel().hasSelection()) {
                GuardarDatosIP(gpIndicadorAgrupacion.getSelectionModel().getSelected().get('id'));
            }
            else {
                alert('Debe seleccionar un indicador');
            }
        }
    });
    btnLimpiarDP = new Ext.Button({
        id: 'btnLimpiarDP',
        iconCls: 'limpiar',
        text: labels.lbBtnLimpiar,
        tooltip:'Limpiar filtro(s)', //labels.lbToolTipLimpiar,
        disabled: true,
        handler: function () {
            Limpiar();
        }
    });
    expanderPlanilla = new Ext.grid.RowExpander({
        tpl: new Ext.Template('<div style="word-wrap:break-word;margin:5px;"><p><b>Descripci&oacute;n:</b> {descripcion}</p></div>')
    });
    storePlanilla = new Ext.data.Store({
        url: 'todasplanillas',
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "idplanilla"
        }, [
            {
                name: 'idplanilla'
            },
            {
                name: 'codigo'
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
            },
            {
                name: 'iddominioevaluativo'
            },
            {
                name: 'dominioevaluativo'
            },
            {
                name: 'idestado'
            },
            {
                name: 'estado'
            }

        ])
    });
    storePlanilla.on('load', function (st, records, options) {
        btnAdicionarPlanilla.focus();
    });
    cmPlanilla = [expanderPlanilla
        , {
            id: 'denom',
            header: labels.lbDenominacion,
            sortable: true,
            dataIndex: 'denom'
        }
        , {
            header: labels.lbdfFIPlanilla,
            width: 85,
            dataIndex: 'fechainicio'
        }
        , {
            header: labels.lbdfFFPlanilla,
            width: 85,
            dataIndex: 'fechafin'
        }
        //,{	header: 'Dominio', width: 180, dataIndex: 'dominioevaluativo'}
        , {
            header: labels.lbestadoPlanilla,
            width: 90,
            dataIndex: 'estado'/*, renderer: MostrarEstado*/
        }
    ];
    pagingPlanilla = new Ext.PagingToolbar({
        pageSize: 15,
        store: storePlanilla,
        displayInfo: true,
        items: ['-']
    });
    var btnAyudaTP = new Ext.Button({
        id: 'btnAyudaPlanillaevaluativa',
        text: labels.lbBtnAyudaTP,
        tooltip: labels.lbToolTipAyudaTP,
        iconCls: 'ayuda',
        nextTab: 'tfbusqueda',
        prevTab: 'btnGestionarIndicador'
       /* handler: function () {
            //Para ejecutar ayuda
            var title = 'Ayuda de la planilla';
            var referencia = 'evaluaciones/planilla';
            help.show(title, referencia);
        }*/
    });
    btnAdicionarPlanilla = new Ext.Button({
        id: 'btnAdicionarPlanilla',
        text: labels.lbBtnAdicionarPlanilla,
        tooltip: labels.lbToolTipBtnAdicionarPlanilla,
        iconCls: 'adicionar',
        nextTab: 'btnDuplicarPlanilla',
        prevTab: 'btnLimpiar',
        handler: function () {
            accion = 'ADD';
            VentanaPlanilla(accion);
        }
    });
    var btnDuplicarPlanilla = new Ext.Button({
        id: 'btnDuplicarPlanilla',
        text: labels.lbBtnDuplicarPlanilla,
        tooltip: labels.ttpBtnDuplicarPlanilla,
        iconCls: 'duplicar',
        nextTab: 'btnModificarPlanilla',
        disabled: true,
        handler: function () {
            if (gpPlanilla.getSelectionModel().hasSelection()) {
                accion = 'DUP';
                VentanaPlanilla(accion);
            }
        }
    });

    btnModificarPlanilla = new Ext.Button({
        id: 'btnModificarPlanilla',
        text: labels.lbBtnModificarPlanilla,
        tooltip: labels.lbToolTipBtnModificarPlanilla,
        iconCls: 'modificar',
        disabled: true,
        handler: function () {
            if (gpPlanilla.getSelectionModel().hasSelection()) {
                accion = 'MOD';
                VentanaPlanilla(accion);
            }
        }
    });
    btnEliminarPlanilla = new Ext.Button({
        id: 'btnEliminarPlanilla',
        text: labels.lbBtnEliminarPlanilla,
        tooltip: labels.lbToolTipBtnEliminarPlanilla,
        iconCls: 'eliminar',
        disabled: true,
        handler: function () {
            if (gpPlanilla.getSelectionModel().hasSelection()) {
                mostrarMensaje(2, labels.mensajeEliminarPlanilla, function (btn) {
                    if (btn == "ok") {
                        mascaraPlanilla.show();
                        Ext.Ajax.request({
                            url: 'eliminarplanilla',
                            method: 'POST',
                            params: {
                                idPlanilla: gpPlanilla.getSelectionModel().getSelected().get('idplanilla')
                            },
                            callback: function (options, success, response) {
                                mascaraPlanilla.hide();
                                responseData = Ext.decode(response.responseText);

                                if(responseData == 4){
                                    mostrarMensaje(3, 'No se puede eliminar la planilla evaluativa porque se encuentra en uso.')
                                }
                                else{
                                    mostrarMensaje(1, labels.msgPlanillaEliminada);
                                    storePlanilla.reload();
                                }


                            }
                        });
                    }
                });
            }
        }
    });
    btnGestionarIndicador = new Ext.Button({
        id: 'btnGestionarIndicador',
        text: labels.lbbtnGestionarIndicador,
        tooltip: labels.lbToolTipbtnGestionarIndicador,
        iconCls: 'agrupacion',
        disabled: true,
        nextTab: 'ayudaTP',
        prevTab: 'btnEliminarPlanilla',
        handler: function () {
            VentanaGestionarIndicador();
        }
    });
    var btnGestionarRegla = new Ext.Button({
        text: labels.lbBtnGestionarRegla,
        tooltip: labels.ttpBtnGestionarRegla,
        iconCls: 'agrupacion',
        handler: function () {
            var arrIndicadores = new Array();
            var arrRecord = storeIndicadorAgrupacion.getRange();
            Ext.each(arrRecord, function (record) {
                arrIndicadores.push([record.get('idindicador'), record.get('text')]);
            });
            var objExp = new Ext.pvd.persona.formula.winEditorExpresiones({
                indicadores: arrIndicadores,
                idexpresionmatematica: -1
            });
            objExp.show();
            objExp.on('expresionsalvada', function (data) {
                PVD.mostrarMascara('mskaddexpmatematica', labels.lbMsgWait, labels.lbMaskSavingExpMat);
                objExp.close();
                var node = treepIndicadorPlanilla.getSelectionModel().getSelectedNode();
                node.attributes.idexpresionmatematica = data.idexpresionmatematica;
                Ext.Ajax.request({
                    url: 'addExpMatematicaInd',
                    method: 'POST',
                    params: {
                        idindicadorplanilla: node.id,
                        idexpresionmatematica: data.idexpresionmatematica
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara('mskaddexpmatematica');
                        node.attributes.idexpresionmatematica = data.idexpresionmatematica;
                        node.attributes.idindicadorcalculado = responseData.idindicadorcalculado;
                        tplExpMat.overwrite(pExpresMat.body, {
                            denom: data.denom,
                            expmat: data.elementosMostrarFormato
                        });
                        pExpresMat.expand(true);
                    }
                });
            });
        }
    });
    var btnEliminarRegla = new Ext.Button({
        text: labels.lbBtnEliminarRegla,
        tooltip: labels.ttpBtnEliminarRegla,
        iconCls: 'eliminar',
        handler: function () {
            Ext.Msg.show({
                title: 'Confirmaci&oacute;n',
                msg: '¿Está seguro que quiere eliminar la expresión matemática seleccionada?' ,
                icon: Ext.Msg.QUESTION,
                buttons: Ext.Msg.OKCANCEL,
                fn: function (btn) {
                    if (btn == 'ok') {
                        PVD.mostrarMascara('mskDelExpMat', labels.lbMsgWait, labels.msgDeletingExpMat);
                        var node = treepIndicadorPlanilla.getSelectionModel().getSelectedNode();
                        Ext.Ajax.request({
                            url: 'elimExpMatmaticaInd',
                            method: 'POST',
                            params: {
                                idindicadorcalculado: node.attributes.idindicadorcalculado,
                                idexpresionmatematica: node.attributes.idexpresionmatematica
                            },
                            callback: function (options, success, response) {
                                var responseData = Ext.decode(response.responseText);
                                pExpresMat.body.update('');
                                pExpresMat.collapse(true);
                                node.attributes.idindicadorcalculado = null;
                                node.attributes.idexpresionmatematica = null;
                                PVD.ocultarMascara('mskDelExpMat');
                                mostrarMensaje(1, labels.msgExprmatDeleted);
                            }
                        });
                    }
                }
            });
        }
    });
    var btnBuscar = new Ext.Button({
        iconCls: 'buscar',
        id: 'btn_Buscar',
        text: labels.btnBuscar,
        tooltip: labels.lbToolTipBuscarDP,
        handler: function () {
            BuscarPlanillaPorDenom(tfbusqueda.getValue());
        }
    });
    var btnLimpiar = new Ext.Button({
        id: 'btnLimpiar',
        text: labels.lbBtnLimpiar,
        tooltip: 'Limpiar filtro(s)',
        iconCls: 'limpiar',
        nextTab: 'btnAdicionarPlanilla',
        prevTab: 'btn_Buscar',
        handler: function () {
            tfbusqueda.reset();
        }
    });
    var tfbusqueda = new Ext.form.TextField({
        id: 'tfbusqueda',
        //width:150,
        anchor: '95%',
        fieldLabel: labels.lbDenominacion,
        maxLength: 250,
        emptyText: labels.emptyTextBuscar,
        maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]*)+$/,
        mode: 'local',
        enableKeyEvents: true,
        nextTab: 'btn_Buscar',
        prevTab: 'ayudaTP',
        listeners: {
            'keyup': function (textField, eventoObject) {
                if (eventoObject.getCharCode() == 13) {
                    BuscarPlanillaPorDenom(tfbusqueda.getValue());
                }
            }
        }
    });
    tbPlanilla = new Ext.Toolbar({
        id: 'tbPlanilla',
        items: [btnAdicionarPlanilla, btnDuplicarPlanilla, btnModificarPlanilla, btnEliminarPlanilla, btnGestionarIndicador, '->', btnAyudaTP]
    });
    smPlanilla = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            selectionchange: function (sm) {
                if (sm.hasSelection()) {
                    var rec = sm.getSelected();
                    idPlanillaSeleccionada = rec.get('idplanilla');
                    btnEliminarPlanilla.enable();
                    btnDuplicarPlanilla.enable();
                    btnGestionarIndicador.enable();
                    if (rec.get('idestado') == 0) {
                        btnModificarPlanilla.enable();
                    } else {
                        btnModificarPlanilla.disable();
                    }
                } else {
                    btnEliminarPlanilla.disable();
                    btnDuplicarPlanilla.disable();
                    btnModificarPlanilla.disable();
                    btnGestionarIndicador.disable();
                }
            }
        }
    });
    gpPlanilla = new Ext.grid.GridPanel({
        id: 'gpPlanilla',
        title: labels.gpPlanillaTitle,
        region: 'center',
        columns: cmPlanilla,
        stripeRows: true,
        autoScroll: true,
        border: true,
        store: storePlanilla,
        plugins: expanderPlanilla,
        autoExpandColumn: 'denom',
        loadMask: {
            msg: labels.cargando
        },
        minSize: '50%',
        maxSize: '50%',
        padding: '0 0 0 0',
        margins: '0 5 5 5',
        width: '50%',
        sm: smPlanilla,
        bbar: pagingPlanilla
    });
    //-----------------------------------------------------------------------  VENTANA RECURSOS y DOMINIOS ----------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------  RECURSOS ----------------------------------------------------------------------------------------------
    storeRecurso = new Ext.data.Store({
        url: 'todosrecursos',
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "idrecursoevaluativo"
        }, [
            {
                name: 'idrecursoevaluativo'
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
    storeRecurso.on('load', function (st, records, options) {
        btnCancelarDominio.focus();
    });
    cmRecurso = [
        {
            id: 'idRecurso',
            header: 'idRecurso',
            hidden: true,
            width: 50,
            dataIndex: 'idrecursoevaluativo'
        }
        ,
        {
            id: 'denom',
            header: labels.lbDenominacionRecurso,
            width: 150,
            sortable: true,
            dataIndex: 'denom'
        }
        ,
        {
            id: 'descrip',
            header: 'descripcion',
            hidden: true,
            width: 150,
            dataIndex: 'descripcion'
        }
        ,
        {
            id: 'fi',
            header: 'fecha inicio',
            hidden: true,
            width: 150,
            dataIndex: 'fechainicio'
        }
        ,
        {
            id: 'ff',
            header: 'fecha fin',
            hidden: true,
            width: 150,
            dataIndex: 'fechafin'
        }
    ];
    pagingRecurso = new Ext.PagingToolbar({
        pageSize: 10,
        store: storeRecurso,
        displayInfo: true,
        items: ['-']
    });
    smRecurso = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (sm, row, rec) {
                cargadorDominio.baseParams.idrecurso = rec.get('idrecursoevaluativo');
                cargadorDominio.baseParams.iddominio = -1;
                raizDominio.setText(rec.get('denom'));
                cargadorDominio.load(raizDominio);
                tpDominio.enable();
            }
        }
    });
    gpRecurso = new Ext.grid.GridPanel({
        id: 'gpRecurso',
        title: labels.gpRecursoPlanilla,
        region: 'center',
        columns: cmRecurso,
        stripeRows: true,
        autoScroll: true,
        border: true,
        store: storeRecurso,
        split: true,
        autoExpandColumn: 'denom',
        loadMask: {
            msg: labels.cargando
        },
        minSize: '40%',
        maxSize: '80%',
        margins: '5 5 5 5',
        width: '50%',
        sm: smRecurso,
        bbar: pagingRecurso
    });
    //------------------------------------------------------------------------------------  DOMINIOS ----------------------------------------------------------------------------------------------

    cargadorDominio = new Ext.tree.TreeLoader({
        dataUrl: 'cargardominio',
        preloadChildren: true,
        baseParams: {
            idrecurso: -1,
            iddominio: -1
        },
        listeners: {
            beforeload: function (cargadorDominio, node, response) {
                cargadorDominio.baseParams.iddominio = node.id;
                var n = gpRecurso.getSelectionModel().getSelected();
                if (n)
                    cargadorDominio.baseParams.idrecurso = n.get('idrecursoevaluativo');
                else
                    cargadorDominio.baseParams.idrecurso = -1;
            },
            load: function (cargadorDominio, node, response) {
                node.expand(false, false);
            }
        }
    });
    tpDominio = new Ext.tree.TreePanel({
        id: 'tpDominio',
        title: labels.tpDominioPlanilla,
        disabled: true,
        minSize: '50%',
        maxSize: '50%',
        region: 'east',
        margins: '5 5 5 0',
        width: '50%',
        animate: true,
        border: true,
        containerScroll: true,
        rootVisible: true,
        layout: 'fit',
        selModel: new Ext.tree.DefaultSelectionModel(),
        loader: cargadorDominio,
        autoScroll: true,
        listeners: {
            click: function (nodo, event) {
                if (nodo.id != 'raizDominio') {
                    denomDominio = nodo.text;
                    idDominio = nodo.id;
                    btnAceptarDominio.enable();
                } else {
                    btnAceptarDominio.disable();
                }
            }
        }
    });
    raizDominio = new Ext.tree.TreeNode({
        text: labels.lbDominioPlanilla,
        id: 'raizDominio',
        allowDrag: false,
        allowDrop: false
    });
    tpDominio.setRootNode(raizDominio);
    //------------------------------------------------------------------------------------  VENTANA ----------------------------------------------------------------------------------------------

    btnCancelarDominio = new Ext.Button({
        id: 'btnCancelarDominio',
        iconCls: 'cancelar',
        text: labels.btnCancelar,
        tooltip: labels.lbToolTipCerrar,
        nextTab: 'btnAceptarDominio',
        prevTab: 'btnAceptarDominio',
        handler: function () {
            winDominio.hide();
        }
    });
    btnAceptarDominio = new Ext.Button({
        id: 'btnAceptarDominio',
        iconCls: 'aceptar',
        text: labels.btnAceptar,
        tooltip: labels.lbToolTipAceptar,
        disabled: true,
        nextTab: 'btnCancelarDominio',
        prevTab: 'btnCancelarDominio',
        handler: function () {
            tfdominioPlanilla.setValue(denomDominio);
            winDominio.hide();
        }
    });
    winDominio = new Ext.Window({
        title: labels.twinDominio,
        layout: 'border',
        width: 800,
        height: 360,
        closable: true,
        resizable: false,
        closeAction: 'hide',
        items: [gpRecurso, tpDominio],
        modal: true,
        buttons: [btnCancelarDominio, btnAceptarDominio]
    });
    //---------------  VENTANA ADD-MOD ----------------

    btnCancelarPlanilla = new Ext.Button({
        id: 'btnCancelarPlanilla',
        iconCls: 'cancelar',
        text: labels.btnCancelar,
        tooltip: labels.lbToolTipCerrar,
        prevTab: 'heDescripcionPlanilla',
        handler: function () {
            winPlanilla.hide();
        }
    });
    btnAplicarPlanilla = new Ext.Button({
        id: 'btnAplicarPlanilla',
        iconCls: 'aplicar',
        hidden: true,
        text: labels.btnAplicar,
        tooltip: labels.lbToolTipAplicar,
        handler: function () {
            AddModPlanilla('ADD', 'APLI');
        }
    });
    btnAceptarPlanilla = new Ext.Button({
        id: 'btnAceptarPlanilla',
        iconCls: 'aceptar',
        text: labels.btnAceptar,
        tooltip: labels.lbToolTipAceptar,
        nextTab: 'tfcodigoPlanilla',
        handler: function () {
            AddModPlanilla(accion, 'ACEP');
        }
    });
    tfcodigoPlanilla = new Ext.form.TextField({
        id: 'tfcodigoPlanilla',
        fieldLabel: labels.lbCodigo,
        maxLength: 20,
        name: 'codigo',
        maskRe: /[0-9a-zA-Z]/,
        anchor: '90%',
        listeners: {
            change: function (tf, n, o) {
                cambio = 1;
            }
        },
        blankText: labels.blankText,
        nextTab: 'tfdenomPlanilla',
        prevTab: 'btnAceptarPlanilla'
    });
    tfdenomPlanilla = new Ext.form.TextField({
        id: 'tfdenomPlanilla',
        fieldLabel: labels.lbDenominacion,
        name: 'denom',
        maxLength: 250,
        regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ]*)+([a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]*)+$/,
        anchor: '90%',
        allowBlank: false,
        listeners: {
            change: function (tf, n, o) {
                cambio = 1;
            }
        },
        blankText: labels.blankText,
        nextTab: 'tfdominioPlanilla',
        prevTab: 'tfcodigoPlanilla'

    });
    storeEstado = new Ext.data.Store({
        url: 'cargarEstados',
        reader: new Ext.data.JsonReader({
            root: "datos",
            totalProperty: "cantidad",
            id: "idestado"
        }, [
            {
                name: 'idestado'
            },
            {
                name: 'denom'
            }
        ])
    });
    storeEstado.load();
    cbestadoPlanilla = new Ext.form.ComboBox({
        fieldLabel: labels.lbestadoPlanilla,
        id: 'cbestadoPlanilla',
        name: 'cbestado',
        store: storeEstado,
        triggerAction: 'all',
        forceSelection: true,
        mode: 'local',
        displayField: 'denom',
        valueField: 'idestado',
        hiddenName: 'idestado',
        typeAhead: true,
        editable: false,
        allowBlank: false,
        blankText: labels.blankText,
        listeners: {
            change: function (tf, n, o) {
                cambio = 1;
            }
        },
        anchor: '90%',
        nextTab: 'dfFIPlanilla',
        prevTab: 'tfdominioPlanilla'

    });
    tfdominioPlanilla = new Ext.form.TextField({
        id: 'tfdominioPlanilla',
        fieldLabel: labels.lbDominioPlanilla,
        name: 'dominioevaluativo',
        anchor: '90%',
        allowBlank: false,
        blankText: labels.blankText,
        nextTab: 'cbestadoPlanilla',
        prevTab: 'tfdenomPlanilla',
        listeners: {
            change: function (tf, n, o) {
                cambio = 1;
            },
            focus: function (thisTextfield) {
                winDominio.show();
                storeRecurso.load({
                    params: {
                        limit: 10,
                        start: 0
                    },
                    callback: function () {
                        gpRecurso.getSelectionModel().selectFirstRow();
                    }
                });
            }
        }
    });
    dfFIPlanilla = new Ext.form.DateField({
        id: 'dfFIPlanilla',
        fieldLabel: labels.lbdfFIPlanilla,
        name: 'fechainicio',
        anchor: '90%',
        value: fecha.format('d/m/Y'),
        format: 'd/m/Y',
        allowBlank: false,
        invalidText: labels.invalidTextFecha,
        blankText: labels.blankText,
        vtype: 'daterange',
        listeners: {
            change: function (tf, n, o) {
                cambio = 1;
            }
        },
        readOnly: true,
        endDateField: 'dfFFPlanilla',
        nextTab: 'dfFFPlanilla',
        prevTab: 'cbestadoPlanilla'
    });
    dfFFPlanilla = new Ext.form.DateField({
        id: 'dfFFPlanilla',
        fieldLabel: labels.lbdfFFPlanilla,
        name: 'fechafin',
        anchor: '90%',
        format: 'd/m/Y',
        invalidText: labels.invalidTextFecha,
        vtype: 'daterange',
        listeners: {
            change: function (tf, n, o) {
                cambio = 1;
            }
        },
        readOnly: true,
        startDateField: 'dfFIPlanilla',
        nextTab: 'heDescripcionPlanilla',
        prevTab: 'dfFIPlanilla'
    });
    heDescripcionPlanilla = new Ext.form.TextArea({
        height: 100,
        anchor: '98%',
        id: 'heDescripcionPlanilla',
        fieldLabel: labels.lbDescripPlanilla,
        name: 'descripcion',
        nextTab: 'btnCancelarPlanilla',
        prevTab: 'dfFFPlanilla',
        listeners: {
            change: function (tf, n, o) {
                cambio = 1;
            }
        }
    });
    fpPlanilla = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        region: 'center',
        width: 450,
        autoHeight: true,
        autoShow: true,
        items: [
            {
                layout: 'column',
                items: [
                    {
                        columnWidth: .5,
                        layout: 'form',
                        anchor: '50%',
                        items: [tfcodigoPlanilla, tfdominioPlanilla, dfFIPlanilla, ]
                    },
                    {
                        columnWidth: .5,
                        layout: 'form',
                        items: [tfdenomPlanilla, cbestadoPlanilla, dfFFPlanilla]
                    }
                ]
            },
            heDescripcionPlanilla
        ]
    });

    var mapeo = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: Ext.EventObject.ENTER,
            fn: function () {
                btnAceptarPlanilla.handler();
            }
        },
        {
            key: 'p',
            alt: true,
            ctrl: true,
            fn: function () {
                btnAplicarPlanilla.handler();
            }
        },
        {
            key: 'x',
            alt: true,
            fn: function () {
                btnCancelarPlanilla.handler();
                btnAdicionarPlanilla.focus();
            }
        }
    ]);

    winPlanilla = new Ext.Window({
        title: labels.lbProvicional,
        layout: 'fit',
        autoHeight: true,
        closable: true,
        resizable: false,
        closeAction: 'hide',
        items: [fpPlanilla],
        modal: true,
        buttons: [btnCancelarPlanilla, btnAplicarPlanilla, btnAceptarPlanilla],
        keys: mapeo
    });

    winPlanilla.on('show', function (cmp) {
        tfcodigoPlanilla.focus(true, 300);
    });
    winPlanilla.on('hide', function (cmp) {
        btnAdicionarPlanilla.focus();
    });
    ////////////////////////////////////////////////////////   DISEñAR PLANILLA   /////////////////////////////////////////////////
    //**************************************************   ARBOL INDICADOR PLANILLA   ********************************************
    cargadorIndicadores = new Ext.tree.TreeLoader({
        dataUrl: 'cargarindicadores',
        preloadChildren: true,
        baseParams: {
            idplanilla: idPlanillaSeleccionada,
            idnodo: -1
        },
        listeners: {
            beforeload: function (cargadorIndicadores, node, response) {
                if (node.id == 'raizIndicadorPlanilla') {
                    cargadorIndicadores.baseParams.idplanilla = idPlanillaSeleccionada;
                    cargadorIndicadores.baseParams.idnodo = -1;
                }
                else {
                    cargadorIndicadores.baseParams.idplanilla = idPlanillaSeleccionada;
                    cargadorIndicadores.baseParams.idnodo = node.id;
                }
            },
            load: function (cargadorIndicadores, node, response) {
                node.expand();
            }
        }
    });
    var menuTreePanelIPEliminar = new Ext.menu.Menu({
        items: [
            {
                text: labels.lbBtnEliminarPlanilla,
                handler: function () {
                    EliminarIP();
                }
            }
        ]
    });
    var btnActionEliminarInd = new Ext.Action({
        disabled: true,
        text: labels.lbBtnEliminarPlanilla,
        handler: function () {
            EliminarIP();
        }
    });
    //Prueba de menuu
    var ItemMenuAgrupacion = new Ext.menu.Item({
        text: labels.lbAgrupacion,
        iconCls: 'contenedor',
        handler: function () {
            AddIndicadorPlanilla('Ag');
        }
    });
    var ItemMenuTexto = new Ext.menu.Item({
        text: labels.lbTexto,
        iconCls: 'indicadorTexto',
        handler: function () {
            AddIndicadorPlanilla('Text');
        }
    });
    var ItemMenuImagen = new Ext.menu.Item({
        text: labels.lbImagen,
        iconCls: 'indicadorImagen',
        handler: function () {
            AddIndicadorPlanilla('Img');
        }
    });
    var ItemMenuEliminarPlanilla = new Ext.menu.Item({
        text: labels.lbBtnEliminarPlanilla,
        handler: function () {
            EliminarIP();
        }
    });
    var menuItemAdicionarPlanilla = new Ext.menu.Item({
        text: labels.lbBtnAdicionarPlanilla,
        menu: {// SUBMENU
            items: [ItemMenuAgrupacion, ItemMenuTexto, ItemMenuImagen]
        }

    });
//    menuTreePanelIP = new Ext.menu.Menu({
//        id: 'menuTreePanelIP',
//        items: [
//            menuItemAdicionarPlanilla, ItemMenuEliminarPlanilla, btnActionEliminarInd
//        ]
//
//    });

    menuTreePanelIP = new Ext.menu.Menu({
        id: 'menuTreePanelIP',
        items: [
            {
                text: labels.lbBtnAdicionarPlanilla,
                //handler: onItemClick
                menu: {// SUBMENU
                    items: [
                        {
                            text: labels.lbAgrupacion,
                            iconCls: 'contenedor',
                            handler: function () {
                                AddIndicadorPlanilla('Ag');
                            }
                        },
                        {
                            text: labels.lbTexto,
                            iconCls: 'indicadorTexto',
                            handler: function () {
                                AddIndicadorPlanilla('Text');
                            }
                        },
                        {
                            text: labels.lbImagen,
                            iconCls: 'indicadorImagen',
                            handler: function () {
                                AddIndicadorPlanilla('Img');
                            }
                        }
                    ]
                }
            },
            btnActionEliminarInd
        ]
    });
    btnAdicionarIP = new Ext.Button({
        id: 'btnAdicionarIP',
        text: labels.lbBtnGestionarIND,
        iconCls: 'agrupacion',
        tooltip: labels.lbToolTipBtnAdicionarIP,
        disabled: true,
        menu: menuTreePanelIP,
        nextTab: 'btnEliminarIP',
        prevTab: 'btnCancelarDP'
    });

    btnEliminarIP = new Ext.Button({
        id: 'btnEliminarIP',
        text: labels.lbBtnEliminarPlanilla,
        iconCls: 'eliminar',
        tooltip: labels.lbToolTipBtnEliminarIP,
        disabled: true,
        nextTab: 'btnCancelarDP',
        prevTab: 'btnAdicionarIP',
        handler: function () {
            EliminarIP();
        }
    });
    toolbIndicadorPlanilla = new Ext.Toolbar({
        id: 'toolbIndicadorPlanilla',
        items: [btnAdicionarIP, btnEliminarIP]
    });

    treepIndicadorPlanilla = new Ext.tree.TreePanel({
        id: 'treepIndicadorPlanilla',
        region: 'west',
        animate: true,
        enableDD: false,
        containerScroll: true,
        autoScroll: true,
        rootVisible: true,
        margins: '5 5 5 5',
        width: '40%',
        height: 480,
        useArrows: true,
        layout: 'fit',
        selModel: new Ext.tree.DefaultSelectionModel(),
        loader: cargadorIndicadores,
        tbar: toolbIndicadorPlanilla,
        listeners: {
            click: function (nodo, event) {
                btnAdicionarIP.enable();
                btnEliminarIP.enable();
                btnActionEliminarInd.enable()
                nodoSeleccionado = nodo;
                if (nodoSeleccionado.id != 'raizIndicadorPlanilla' && nodoSeleccionado.isLeaf()) {
                    btnAdicionarIP.disable();
                    gpIndicadorAgrupacion.setDisabled(true);
                    fpIndicadorPlanilla.setDisabled(false);
                    tabpIndicadorPlanilla.setActiveTab('1');
                    tabpIndicadorPlanilla.enable();
                    datosIP[0] = nodoSeleccionado.id;
                    datosIP[1] = nodoSeleccionado.text;
                    datosIP[2] = nodoSeleccionado.attributes.abreviatura;
                    datosIP[3] = nodoSeleccionado.attributes.ayuda;
                    CargarDatosIP(datosIP);
                }
                else if (nodoSeleccionado.id != 'raizIndicadorPlanilla' && !nodoSeleccionado.isLeaf()) {
                    btnAdicionarIP.enable();
                    fpIndicadorPlanilla.setDisabled(true);
                    gpIndicadorAgrupacion.setDisabled(false);
                    tabpIndicadorPlanilla.setActiveTab('0');
                    tabpIndicadorPlanilla.enable();
                    storeIndicadorAgrupacion.removeAll();
                    storeIndicadorAgrupacion.load({
                        params: {
                            idplanilla: idPlanillaSeleccionada,
                            idnodo: nodo.id
                        }
                    });
                    if (nodoSeleccionado.attributes.idexpresionmatematica != null) {
                        btnGestionarRegla.disable();
                        btnEliminarRegla.enable();
                        Ext.Ajax.request({
                            url: 'getExpresionMatematica',
                            method: 'POST',
                            params: {
                                idexpresionmatematica: nodoSeleccionado.attributes.idexpresionmatematica
                            },
                            callback: function (options, success, response) {
                                var responseData = Ext.decode(response.responseText);
                                tplExpMat.overwrite(pExpresMat.body, {
                                    denom: responseData[0].denominacion,
                                    expmat: responseData[0].expresionamostrar
                                });
                                pExpresMat.expand(true);
                            }
                        });
                    } else {
                        btnGestionarRegla.enable();
                        btnEliminarRegla.disable();
                        pExpresMat.body.update('');
                        pExpresMat.collapse(true);
                    }
                }
                else {
                    btnAdicionarIP.enable();
                    tabpIndicadorPlanilla.disable();
                    btnEliminarIP.disable();
                    btnActionEliminarInd.disable();
                    storeIndicadorAgrupacion.removeAll();
                    tabpIndicadorPlanilla.setActiveTab('0');
                }
            },
            dblclick: function (node, event) {
                if (node.attributes.tipo == false) {//verifico que sea un indicador de imagen
                    SincronizarImagen(node.attributes.idindicador, node.text, event.getXY()); //Verifico que exista la imagen como fichero para poder cargarla
                }
            },
            contextmenu: function (n, e) {
                nodoSeleccionado = n;
                if (!nodoSeleccionado.attributes.calculado) {
                    btnEliminarIP.disable();
                    btnActionEliminarInd.disable();
                    btnAdicionarIP.enable();
                    menuTreePanelIP.showAt(e.getXY());
                }
                else if (nodoSeleccionado.id != 'raizIndicadorPlanilla' && nodoSeleccionado.isLeaf()) {
                    btnAdicionarIP.disable();
                    menuTreePanelIPEliminar.showAt(e.getXY());
                }
                else {
                    btnAdicionarIP.disable();
                    btnEliminarIP.enable();
                    btnActionEliminarInd.enable();
                    menuTreePanelIP.showAt(e.getXY());

                }
            }
        }
    });
    treepIndicadorPlanilla.on('load', function (node) {
        btnCancelarDP.focus();
    });
    //treepIndicadorPlanilla.addListener('contextmenu',function(n,e){menuTreePanelIP.showAt(e.getXY());});

    raizIndicadorPlanilla = new Ext.tree.AsyncTreeNode({
        text: labels.lbraizIndicadorPlanilla,
        id: 'raizIndicadorPlanilla',
        allowDrag: false,
        allowDrop: false
    });
    treepIndicadorPlanilla.setRootNode(raizIndicadorPlanilla);
    //****************************************   FORM PANEL INDICADOR PLANILLA   *********************************************
    var lbindicadorDenom = new Ext.form.Label({
        style: "font-family:arial,serif; font-size:16px; text-align:center; color:#15428B;"
    });
    chbEscalaIP = new Ext.form.Checkbox({
        id: 'chbEscalaIP',
        checked: false,
        hideLabel: true,
        boxLabel: labels.lbEscala,
        nextTab: 'chbComplementoTextIP',
        prevTab: 'btnGuardarDP',
        listeners: {
            check: function (checkbox, checked) {
                if (checked) {
                    cbEscala.enable();
                    if (cbEscala.getValue() != '')
                        btnVer.enable();
                    else
                        treepIndicadorPlanilla.disable();
                }
                else {
                    cbEscala.disable();
                    btnVer.disable();
                    cbEscala.reset();
                    treepIndicadorPlanilla.enable();
                }
            }
        }
    });
    chbComplementoTextIP = new Ext.form.Checkbox({
        id: 'chbComplementoTextIP',
        hideLabel: true,
        boxLabel: labels.lbComplementoTextual,
        listeners: {
            check: function (checkbox, checked) {
                if (checked) {
                    chbComplementoObligatorio.enable();
                }
                else {
                    chbComplementoObligatorio.disable();
                }
            }
        }
    });

    chbComplementoObligatorio = new Ext.form.Checkbox({
        id: 'chbComplementoObligatorio',
        hideLabel: true,
        disabled:true,
        boxLabel: 'Complemento obligatorio'
    });
    storeEscala = new Ext.data.Store({
        url: 'todasescalas',
        reader: new Ext.data.JsonReader({
            root: "datos",
            totalProperty: "cantidad",
            id: "idescala"
        }, [
            {
                name: 'idescala'
            },
            {
                name: 'denom'
            }
        ])
    });
    storeEscala.on('load', function (st, records, options) {
        chbEscalaIP.focus();
    });
    cbEscala = new Ext.form.ComboBox({
        id: 'cbEscala',
        name: 'cbescala',
        store: storeEscala,
        triggerAction: 'all',
        forceSelection: true,
        mode: 'local',
        displayField: 'denom',
        valueField: 'idescala',
        hiddenName: 'idescala',
        typeAhead: true,
        editable: false,
        hideLabel: true,
        emptyText: labels.emptyTextcbEscala,
        anchor: '95%',
        disabled: true,
        listeners: {
            select: function (combo, rec, index) {
                chbEscalaIP.setValue(true);
                btnVer.enable();
                treepIndicadorPlanilla.enable();
            }
        }
    });
    btnVer = new Ext.Button({
        id: 'btnVer',
        disabled: true,
        iconCls: 'ver',
        text: labels.lbBtnVer,
        tooltip: labels.lbToolTipVer,
        handler: function () {
            VerValoresEscala(cbEscala.getValue());
        }
    });
    heDescripcionIndicador = new Ext.form.TextArea({
        height: 120,
        anchor: '100%',
        id: 'heDescripcionIndicador',
        fieldLabel: labels.lbBtnAyuda,
        name: 'descripcion'
    });
    var kmDatosInd = [
        {
            key: 'l',
            alt: true,
            fn: btnLimpiarDP.handler
        },
        {
            key: 'g',
            alt: true,
            fn: btnGuardarDP.handler
        },
        {
            key: 'v',
            alt: true,
            ctrl: true,
            fn: btnVer.handler
        }
    ];
    var formDatosIndicador = new Ext.form.FormPanel({
        cls: 'x-toolbar',
        region: 'center',
        labelAlign: 'top',
        frame: true,
        border: false,
        //layout:'form',
        margins: '5 5 5 5',
        bodyStyle: 'padding: 5px',
        items: [lbindicadorDenom,
            {
                bodyStyle: 'padding-top: 10px',
                layout: 'column',
                items: [
                    {
                        columnWidth: .3,
                        layout: 'form',
                        items: chbEscalaIP
                    },
                    {
                        columnWidth: .3,
                        layout: 'form',
                        items: chbComplementoTextIP
                    }
                    ,
                    {
                        columnWidth: .4,
                        layout: 'form',
                        items: chbComplementoObligatorio
                    }
                ]
            }, {
                //bodyStyle:'padding-top: 10px',
                layout: 'column',
                items: [
                    {
                        columnWidth: .9,
                        layout: 'form',
                        items: cbEscala
                    },
                    {
                        columnWidth: '30px',
                        bodyStyle: 'padding-top: 4px',
                        layout: 'form',
                        items: btnVer
                    }
                ]
            }, heDescripcionIndicador],
        buttons: [btnGuardarDP, btnLimpiarDP],
        keys: kmDatosInd
    });
    var fpIndicadorPlanilla = new Ext.Panel({
        id: 'fpIndicadorPlanilla',
        title: labels.fpIndicadorPlanillaTitle,
        autoShow: true,
        layout: 'border',
        items: [formDatosIndicador]
    });
    //**********************************************   GRID VALORES ESCALA   *******************************************************
    storeValoresEscala = new Ext.data.Store({
        url: 'cargarvaloresescala',
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "idescala"
        }, [
            {
                name: 'idescala'
            }
            ,
            {
                name: 'denom'
            }
            ,
            {
                name: 'descripcion'
            }
            ,
            {
                name: 'tipoescala'
            }
        ])
    });
    cmValoresEscala = [
        {
            id: 'idEscala',
            header: 'idEscala',
            hidden: true,
            width: 50,
            dataIndex: 'idescala'
        }
        ,
        {
            id: 'denominacion',
            header: labels.lbDenominacion,
            renderer: representarImagen(),
            sortable: false,
            width: 220,
            menuDisabled: true,
            dataIndex: 'denom'
        }
        ,
        {
            id: 'descripcion',
            header: 'Descripcion',
            hidden: true,
            width: 50,
            dataIndex: 'descripcion'
        }
        ,
        {
            id: 'tipoEscala',
            header: 'tipoEscala',
            hidden: true,
            width: 50,
            dataIndex: 'tipoescala'
        }
    ];
    gpValoresEscala = new Ext.grid.GridPanel({
        id: 'gpValoresEscala',
        columns: cmValoresEscala,
        border: false,
        loadMask: {
            msg: labels.cargando
        },
        stripeRows: true,
        split: true,
        autoScroll: true,
        store: storeValoresEscala,
        padding: '0 0 0 0',
        margins: '5 0 5 5'
    });
    btnCerrar = new Ext.Button({
        id: 'btnCerrar',
        iconCls: 'cerrar',
        text: labels.lbBtnCerrar,
        tooltip: labels.lbToolTipCerrar,
        handler: function () {
            winValoresEscala.hide();
        }
    });
    winValoresEscala = new Ext.Window({
        title: labels.gpValoresEscalaTitle,
        layout: 'fit',
        width: 250,
        height: 300,
        closable: true,
        resizable: false,
        closeAction: 'hide',
        modal: true,
        buttons: [btnCerrar],
        items: [gpValoresEscala]
    });
    winValoresEscala.on('show', function (cmp) {
        btnCerrar.focus();
    });
    winValoresEscala.on('hide', function (cmp) {
        chbEscalaIP.focus();
    });
    //**********************************************  GRID INDICADOR AGRUPACION   ***********************************
    storeIndicadorAgrupacion = new Ext.data.Store({
        url: 'cargarindicadores',
        reader: new Ext.data.JsonReader({
            id: "id"
        }, [
            {
                name: 'id'
            },
            {
                name: 'idindicador'
            }
            ,
            {
                name: 'abreviatura'
            }
            ,
            {
                name: 'text'
            }
            ,
            {
                name: 'ayuda'
            }
            ,
            {
                name: 'calculado'
            }
            ,
            {
                name: 'descripcion'
            }
        ])
    });
    storeIndicadorAgrupacion.on('load', function (st, records, options) {
        btnAdicionarIP.focus();
    });
    expanderIndAgrupacion = new Ext.grid.RowExpander({
        tpl: new Ext.Template(
            '<p><b>Descripci&oacute;n:</b> {descripcion}</p>'
        )
    });
    cmIndicadorAgrupacion = [expanderIndAgrupacion
        , {
            id: 'denom',
            header: labels.lbDenominacion,
            sortable: true,
            dataIndex: 'text'
        }
        , {
            id: 'ayuda',
            header: 'ayuda',
            hidden: true,
            width: 150,
            dataIndex: 'ayuda'
        }
        //,{	id:'calculado', header: 'calculado', width: 150, dataIndex: 'calculado'}
    ];
    smIndicadorAgrupacion = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (sm, row, rec) {
                indicadorSelectgpIA = rec;
            }
        }
    });
    gpIndicadorAgrupacion = new Ext.grid.GridPanel({
        id: 'gpIndicadorAgrupacion',
        title: labels.lbgpIndAgrup,
        margins: '5 5 5 5',
        tbar: [btnGestionarRegla, btnEliminarRegla],
        plugins: expanderIndAgrupacion,
        columns: cmIndicadorAgrupacion,
        stripeRows: true,
        autoScroll: true,
        store: storeIndicadorAgrupacion,
        autoExpandColumn: 'denom',
        loadMask: {
            msg: labels.cargando
        },
        listeners: {
            rowdblclick: function (grid, rowIndex, event) {
                if (grid.getSelectionModel().getSelected().get('calculado') == 1) {
                    //grid.setDisabled(true);
                    fpIndicadorPlanilla.setDisabled(false);
                    tabpIndicadorPlanilla.setActiveTab('1');
                    tabpIndicadorPlanilla.enable();
                    btnGuardarDP.setDisabled(false);
                    btnLimpiarDP.setDisabled(false);
                    datosIP[0] = indicadorSelectgpIA.get('id');
                    datosIP[1] = indicadorSelectgpIA.get('text');
                    datosIP[2] = indicadorSelectgpIA.get('abreviatura');
                    datosIP[3] = indicadorSelectgpIA.get('ayuda');
                    CargarDatosIP(datosIP);
                }
            }
        },
        sm: smIndicadorAgrupacion,
        region: 'center'
    });
    var pExpresMat = new Ext.Panel({
        title: labels.lbExpmatematica,
        region: 'south',
        margins: '0 5 5 5',
        animCollapse: true,
        collapsible: true,
        collapsed: true,
        layout: 'fit',
        height: 100,
    });
    var pContainerIndicadores = new Ext.Panel({
        title: labels.gpIndicadorAgrupacionTitle,
        layout: 'border',
        items: [gpIndicadorAgrupacion, pExpresMat]
    });
    //***************************************************   TAB PANEL   ***********************************************************
    tabpIndicadorPlanilla = new Ext.TabPanel({
        id: 'tabpIndicadorPlanilla',
        region: 'center',
        margins: '5 5 5 0',
        width: '60%',
        height: 480,
        activeTab: 0,
        disabled: true,
        items: [pContainerIndicadores, fpIndicadorPlanilla],
        listeners: {
            'tabchange': function (tabPanel, tab) {
                if (tab.id == 'fpIndicadorPlanilla') {
                    fpIndicadorPlanilla.doLayout();
                    btnGuardarDP.setDisabled(false);
                    btnLimpiarDP.setDisabled(false);
                }
                else {
                    fpIndicadorPlanilla.disable();
                    btnGuardarDP.setDisabled(true);
                    btnLimpiarDP.setDisabled(true);
                }
            }
        }
    });
    //****************************************************   VENTANA  *************************************************************
    btnCancelarDP = new Ext.Button({
        id: 'btnCancelarDP',
        iconCls: 'cerrar',
        text: labels.lbBtnCerrar,
        tooltip: labels.ttpBtnCerrar,
        nextTab: 'btnAdicionarIP',
        prevTab: 'btnEliminarIP',
        handler: function () {
            winDisenarPlanilla.hide();
        }
    });
    var kmDiseñarPlanilla = [
        {
            key: 46,
            fn: function () {
                if (!btnEliminarIP.disabled) {
                    btnEliminarIP.handler();
                }
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
    winDisenarPlanilla = new Ext.Window({
        title: labels.lbToolTipBtnAdicionarIP,
        width: 870,
        height: 490,
        maximizable: true,
        closable: true,
        resizable: false,
        closeAction: 'hide',
        modal: true,
        buttons: [btnCancelarDP],
        layout: 'border',
        items: [treepIndicadorPlanilla, tabpIndicadorPlanilla],
        keys: kmDiseñarPlanilla,
        listeners: {
            hide: function (win) {
                tabpIndicadorPlanilla.disable();
                storeIndicadorAgrupacion.removeAll();
                tabpIndicadorPlanilla.setActiveTab('0');
            }
        }
    });
    winDisenarPlanilla.on('show', function (cmp) {
        btnCancelarDP.focus();
        winDisenarPlanilla.maximize();
    });
    pFiltros = new Ext.Panel({
        layout: 'column',
        margins: '5 5 5 5',
        frame: true,
        defaults: {
            layout: 'form',
            border: false,
            labelAlign: 'top',
            buttonAlign: 'right'
        },
        cls: 'x-toolbar',
        height: 65,
        autoScroll: true,
        autoShow: true,
        region: 'north',
        items: [
            {
                columnWidth: .3,
                layout: 'form',
                items: [tfbusqueda]
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
    var KmPlanilla = [
        {
            key: 'i',
            alt: true,
            fn: function () {
                btnAdicionarPlanilla.handler();
            }
        },
        {
            key: 'm',
            alt: true,
            fn: function () {
                if (!btnModificarPlanilla.disabled) {
                    btnModificarPlanilla.handler();
                }
            }
        },
        {
            key: 46,
            fn: function () {
                if (!btnEliminarPlanilla.disabled) {
                    btnEliminarPlanilla.handler();
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
            key: 'g',
            ctrl: true,
            alt: true,
            fn: btnGestionarIndicador.handler
        }
    ];
    var pContenedor = new Ext.Panel({
        bodyBorder: false,
        tbar: tbPlanilla,
        region: 'center',
        layout: 'border',
        items: [pFiltros, gpPlanilla],
        keys: KmPlanilla
    });
    vpPlanilla = new Ext.Viewport({
        layout: 'border',
        items: [pContenedor]
    });
    storePlanilla.load({
        params: {
            limit: 15,
            start: 0
        },
        callback: function () {
            gpPlanilla.getSelectionModel().selectFirstRow();
        }
    });
    mascaraPlanilla = new Ext.LoadMask(gpPlanilla.getEl(), {
        msg: labels.mensajeEliminarPlanillaLoadMask
    });
    mascaraPlanilla.enable();
    mascaraEnviarDatos = new Ext.LoadMask(Ext.getBody(), {
        msg: labels.mensajeEnviandoDatos
    });
    mascaraEnviarDatos.enable();
    mascaraEliminando = new Ext.LoadMask(Ext.getBody(), {
        msg: labels.mensajeEliminando
    });
    mascaraEliminando.enable();
    mascaraCargando = new Ext.LoadMask(Ext.getBody(), {
        msg: labels.cargando
    });
    mascaraCargando.enable();
    ////////////////////////////////////////////////////////////////////  FUNCIONES  ///////////////////////////////////////////////////////////////////////////////////////
    /*
     function MostrarEstado(valor)
     {
     if(valor == 1) valor = 'Elaboracion';
     else if(valor == 2) valor = 'Activo';
     else valor = 'Inactivo';
     return valor;
     }
     */
    //----------------------------------------------------------------------------   VENTANA PLANILLA  -------------------------------------------------------------------------------------------

    function VentanaPlanilla(accion) {
        fpPlanilla.getForm().reset();
        if (accion == 'ADD') {
            winPlanilla.setTitle(labels.addPlanilla);
            btnAceptarPlanilla.prevTab = 'btnAplicarPlanilla';
            cbestadoPlanilla.setValue(0);
            cbestadoPlanilla.disable();
            btnAplicarPlanilla.show();
            winPlanilla.show();
            winDominio.on('hide', function (cmp) {
                dfFIPlanilla.focus(true, 300);
            });
        } else if (accion == 'DUP') {
            btnAceptarPlanilla.prevTab = 'btnCancelarPlanilla';
            var record = gpPlanilla.getSelectionModel().getSelected();
            winPlanilla.setTitle(labels.dupPlanilla);
            cbestadoPlanilla.enable();
            btnAplicarPlanilla.hide();
            winPlanilla.show();
            fpPlanilla.getForm().loadRecord(record);
            tfdenomPlanilla.reset();
            tfcodigoPlanilla.reset();
            winDominio.on('hide', function (cmp) {
                cbestadoPlanilla.focus(true, 300);
            });
        } else {
            btnAceptarPlanilla.prevTab = 'btnCancelarPlanilla';
            var record = gpPlanilla.getSelectionModel().getSelected();
            winPlanilla.setTitle(labels.modPlanilla);
            cbestadoPlanilla.enable();
            btnAplicarPlanilla.hide();
            winPlanilla.show();
            fpPlanilla.getForm().loadRecord(record);
            winDominio.on('hide', function (cmp) {
                cbestadoPlanilla.focus(true, 300);
            });
        }
    }

    //----------------------------------------------------------------------------   VENTANA DISEñAR PLANILLA  -------------------------------------------------------------------------------------------

    function VentanaGestionarIndicador() {
        raizIndicadorPlanilla.setText(gpPlanilla.getSelectionModel().getSelected().get('denom'));
        cargadorIndicadores.load(raizIndicadorPlanilla);
        storeEscala.load();
        winDisenarPlanilla.show();
    }

    //-------------------------------------------------------------------------------------   ADD MOD PLANILLA  ----------------------------------------------------------------------------------------------------------------

    function AddModPlanilla(accion, boton) {
        if (fpPlanilla.getForm().isValid()) {
            var url = 'adicionarplanilla';
            var idplanilla = -1;
            var iddominioevaluativo;
            if (accion == 'ADD') {
                idplanilla = -1;
                iddominioevaluativo = idDominio;
                url = 'adicionarplanilla';
            }
            else {
                idplanilla = gpPlanilla.getSelectionModel().getSelected().get('idplanilla');
                if (idDominio == -1) {
                    iddominioevaluativo = gpPlanilla.getSelectionModel().getSelected().get('iddominioevaluativo');
                } else {
                    iddominioevaluativo = idDominio;
                }
                if (accion == 'DUP') {
                    url = 'duplicarPlanilla';
                } else {
                    url = 'modificarplanilla';
                }
            }
            if (cambio == 0) {
                if (accion == 'MOD' || accion == 'DUP')
                    winPlanilla.hide();
                else {
                    tfdenomPlanilla.markInvalid(labels.blankText);
                }
            }
            else {
                if (dfFIPlanilla.getRawValue() != dfFFPlanilla.getRawValue()) {
                    mascaraEnviarDatos.show();
                    Ext.Ajax.request({
                        url: url,
                        method: 'POST',
                        params: {
                            idplanilla: idplanilla,
                            cod: tfcodigoPlanilla.getValue(),
                            denom: tfdenomPlanilla.getValue(),
                            descrip: heDescripcionPlanilla.getValue(),
                            fi: dfFIPlanilla.getRawValue(),
                            ff: dfFFPlanilla.getRawValue(),
                            iddominio: iddominioevaluativo,
                            idestado: cbestadoPlanilla.getValue()
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            mascaraEnviarDatos.hide();
                            if (responseData.result == 1) {
                                if (accion == 'ADD') {
                                    mostrarMensaje(responseData.result, labels.MsgAddPlanillaOK);
                                }
                                else {
                                    mostrarMensaje(responseData.result, labels.MsgModPlanillaOK);
                                }
                                if (accion == 'ADD') {
                                    fpPlanilla.getForm().reset();
                                }
                                if (boton == 'ACEP') {
                                    winPlanilla.hide();
                                }
                                btnModificarPlanilla.disable();
                                btnEliminarPlanilla.disable();
                                storePlanilla.removeAll();
                                storePlanilla.load({
                                    params: {
                                        limit: 15,
                                        start: 0
                                    },
                                    callback: function () {
                                        gpPlanilla.getSelectionModel().selectFirstRow();
                                    }
                                });
                                idDominio = -1;

                            } else if (responseData.result == 3)
                                mostrarMensaje(responseData.result, 'La planilla evaluativa no se ha podido adicionar.');
                        }
                    });
                }
                else {
                    mostrarMensaje(1, labels.msgFechasIguales);
                }
            }
        }

    }

    function SincronizarImagen(idIndicadorImg, nombreImagen, coordinates) {
        Ext.Ajax.request({
            url: 'sincronizarImagen',
            method: 'POST',
            params: {
                idIndicadorImagen: idIndicadorImg
            },
            failure: function () {
                mostrarMensaje(1, labels.lbSinCOnnexion);
            },
            callback: function (options, success, response) {
                if (success) {
                    var nombreArchivo = Ext.util.JSON.decode(response.responseText);
                    if (winIndImagen) {
                        winIndImagen.close();
                    }
                    winIndImagen = new Ext.Window({
                        title: nombreImagen,
                        layout: 'fit',
                        x: coordinates[0],
                        y: coordinates[1],
                        closable: true,
                        resizable: false,
                        closeAction: 'hide',
                        html: "<img src= '../../nomvalindimgs/" + nombreArchivo + "' />",
                        autoHeight: true
                    });
                    winIndImagen.show();
                }
                else {
                    mostrarMensaje(1, labels.lbErrorInesperado);
                }
            }
        });
    }

    //----------------------------------------------------------------------------------------------------------------------------------------------------
    function CargarDatosIP(datosIP) {
        //mascaraCargando.show();
        lbindicadorDenom.setText(datosIP[1], true);
        heDescripcionIndicador.setValue(datosIP[3]);
        var url = 'getindicadorevaluar';
        Ext.Ajax.request({
            url: url,
            method: 'POST',
            params: {
                idindicadorplanilla: datosIP[0]
            },
            callback: function (options, success, response) {
                //responseData = Ext.decode(response.responseText);
                datosIndicadorEvaluar = Ext.util.JSON.decode(response.responseText);
                if (datosIndicadorEvaluar.length == 0) {
                    chbComplementoTextIP.setValue(false);
                    chbComplementoObligatorio.setValue(false);
                    chbEscalaIP.setValue(false);
                    cbEscala.setDisabled(true);
                }
                else if (datosIndicadorEvaluar[0].idescala) {
                    cbEscala.setValue(datosIndicadorEvaluar[0].idescala);
                    chbEscalaIP.setValue(true);
                    chbComplementoTextIP.setValue(datosIndicadorEvaluar[0].complementotextual);
                    chbComplementoObligatorio.setValue(datosIndicadorEvaluar[0].obligatorio);
                }
                else {
                    chbEscalaIP.setValue(false);
                    chbComplementoTextIP.setValue(datosIndicadorEvaluar[0].complementotextual);
                    chbComplementoObligatorio.setValue(datosIndicadorEvaluar[0].obligatorio);
                }
                //mascaraCargando.hide();
            }
        });
    }

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    function BuscarPlanillaPorDenom(denomPlanilla) {
        storePlanilla.baseParams.denomPlanilla = denomPlanilla;
        //storeIndicadorT.baseParams.recurso = recurso;
        storePlanilla.load({
            params: {
                start: 0,
                limit: 15
            }
        });
    }

    function VerValoresEscala(idescala) {
        storeValoresEscala.removeAll();
        storeValoresEscala.load({
            params: {
                idescala: idescala
            }
        });
        winValoresEscala.show();
        winValoresEscala.on('show', function (cmp) {
            btnCerrar.focus();
        });
    }

    function Limpiar() {
        heDescripcionIndicador.setValue('');
        chbEscalaIP.setValue(false);
        chbComplementoTextIP.setValue(false);
        chbComplementoObligatorio.setValue(false);
    }

    function AddIndicadorPlanilla(tipoI) {
        var idpadre;
        if (nodoSeleccionado != raizIndicadorPlanilla) {
            idpadre = nodoSeleccionado.id;
        }
        var win = new Ext.Component.Seleccion.WinListadoIndicadores({
            labels: labels,
            tipo: tipoI,
            idplanilla: idPlanillaSeleccionada,
            idpadre: idpadre,
            listeners: {
                dataSaved: function () {
                    if (idpadre != null) {
                        var padre = treepIndicadorPlanilla.getNodeById(idpadre);
                        cargadorIndicadores.load(padre);
                        storeIndicadorAgrupacion.reload({
                            params: {
                                idplanilla: idPlanillaSeleccionada,
                                idnodo: idpadre
                            }
                        });
                    } else {
                        cargadorIndicadores.load(raizIndicadorPlanilla);
                    }
                }
            }
        });
        win.show();
    }

    function GuardarDatosIP(idindicadorplanilla) {
        var url = 'guardarDatosIP';
        var idescala = -1;
        var complementotextual;
        var obligatorio;
        var ayuda = heDescripcionIndicador.getValue();
        if (chbEscalaIP.getValue()) {
            if (cbEscala.getValue() == '') {
                mostrarMensaje(3, labels.ErrorGuardarDatosIP);
                return;
            }
            else
                idescala = cbEscala.getValue();
        }
        if (chbComplementoTextIP.getValue()) {
            complementotextual = 'true';
            if(chbComplementoObligatorio.getValue()){
                obligatorio = 'true';
            }else{
                obligatorio = 'false';
            }
        }
        else {
            complementotextual = 'false';
            obligatorio = 'false';
        }
        PVD.mostrarMascara('msksavedataind', '', labels.msgSavingDataInd);
        Ext.Ajax.request({
            url: url,
            method: 'POST',
            params: {
                idindicadorplanilla: idindicadorplanilla,
                idescala: idescala,
                complementotextual: complementotextual,
                obligatorio: obligatorio,
                ayuda: ayuda
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                treepIndicadorPlanilla.getNodeById(idindicadorplanilla).attributes.ayuda = ayuda;
                PVD.ocultarMascara('msksavedataind');
                mostrarMensaje(1, labels.msgDataIndSaved);
                btnGuardarDP.focus();
            }
        });
    }

    function EliminarIP() {
        if (nodoSeleccionado.id != 'raizIndicadorPlanilla') {
            mostrarMensaje(2, labels.mensajeEliminarIP,
                function (btn) {
                    if (btn == "ok") {
                        PVD.mostrarMascara('msksaveind', '', labels.msgDeletingInd);
                        Ext.Ajax.request({
                            url: 'eliminarindicadorplanilla',
                            method: 'POST',
                            params: {
                                idplanilla: idPlanillaSeleccionada,
                                idindicadorplanilla: nodoSeleccionado.id,
                                calculado: nodoSeleccionado.attributes.calculado
                            },
                            callback: function (options, success, response) {
                                var responseData = Ext.decode(response.responseText);
                                PVD.ocultarMascara('msksaveind');
                                if (responseData.success == false) {
                                    mostrarMensaje(1, responseData.mensaje);
                                } else
                                    mostrarMensaje(1, labels.msgIndicadorEliminado);
                                tabpIndicadorPlanilla.disable();
                                storeIndicadorAgrupacion.removeAll();
                                tabpIndicadorPlanilla.setActiveTab('0');
                                cargadorIndicadores.load(raizIndicadorPlanilla);
                            }
                        });
                    }
                });
        }
        else
            mostrarMensaje(3, labels.mensajeErrorEliminarIP, function () {
            });
        /*'No se puede eliminar el nombre de la planilla'*/
    }

    function representarImagen() {
        return function (value, metadata, record, rowIndex, colIndex, store) {
            var tipoEscala = record.get('tipoescala');
            var denom = record.get('denom');
            if (tipoEscala == 2) { //caso en que el indicador sea de tipo imagen
                return "<img src=../../../plantillas/nomvalimgs/" + denom + " width='60' height='60' />";
            } else {
                return denom
            }
        };
    }

}
