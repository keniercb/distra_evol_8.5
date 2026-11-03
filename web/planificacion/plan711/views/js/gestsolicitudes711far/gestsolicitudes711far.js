var perfil = window.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('gestsolicitudes711far', cargarAccionesPlanes);
var objciPlanes = {};
objciPlanes.acciones = [];

var hojaPlanes, denom_ent, rectoraPlanes = false, identidadEsODPlanes = 0, contJRGrid = 0, gestionSegunEstEjercicioPlan = true, gpProductosSel
    ,contembarques=0;

//variables auxialiares
var plan, empimp, cc, ff, inn, monto = 0, codigoreup, codigocc, empdestino, direct, directecon, direccdest;
var productossel =[], rolepersona, fuentes = [], cubicaje =[];
var embarque = [], formapagolista=[], cubicajelista = [], ft = [], identidadselectedPlanes;
var empdestino, especialista, listasersol = [], idsolp, textorchazo, idplan711, solconsolidar = [], escon, nosol, filasel, pacon=0;
var tipoplan = 1255, offset =0, desaprueba=0;
var prodindmaestros = [],contind=1, msgmotivo="";
var servsol = [], rec = null;
var prod = [];

function cargarAccionesPlanes() {
    var temp = window.location.pathname;
    var url = temp.substr(1);
    UCID.portal.cargarAccionesXUri(url);
        cargarInterfazSolicitud();
}

function cargarInterfazSolicitud() {
    rolepersona = perfil.idrol;
//mascaras
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });
    //carga de datos por defecto
    agregarmodificarsolicitudes711();
    actualizardatos();
    vermodificaciones();
    agregrarcontrato();
    funciones();
       
    stTipoCC = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stTipoCC.baseParams.uri = 18;
                stTipoCC.baseParams.rolepersona = rolepersona;
            },
            load: function (t) {
                
                if(rolepersona==300000000402||rolepersona==300000000403||rolepersona==300000000404){
                    cbCC.setValue(t.reader.jsonData.data[0].iddatos);
                }
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
                )
    });
    
    stEmpresaImp = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stEmpresaImp.baseParams.uri = 3;
            },
            load: function (t) {
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
                )
    });

    btnAyudaGestSolicitudes = new Ext.Button({
        id: 'btnAyudaGestSolFAR',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbTtBtnAyu,
    });

    stCbejercicioPlanes = new Ext.data.Store({
        url: 'getEjercicios',
        autoLoad: true,
        disabled: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idejercicio'
            },{
                name: 'idplan711'
            }, {
                name: 'ejercicio'
            }, {
                name: 'idestado'
            }, {
                name: 'uridatosnomenclador'
            }]),
        listeners: {
            load: function (t) {
                //cbEjercicioPlanes.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
            }
        }
    });
    
    cbEjercicioPlanes = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        width: 150,
        disabled: false,
        store: stCbejercicioPlanes,
        displayField: 'ejercicio',
        valueField: 'idplan711',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                pEstructuras.enable();
                claseMask();
                idplan711= rec.json.idplan711;
                rec=null;
                ControlarBotones(rec);
            }
        }
    });
    
    cbEmpresasImp = new Ext.form.ComboBox({
        id: 'idcbEmpresasImp',
        emptyText: 'Seleccione',
        width: 150,
        disabled: true,
        store: stEmpresaImp,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                cbCC.enable();
                empimp=rec.data.denominacion;
                pEstructuras.enable();
                listarSolicitudes();
            }
        }
    });
    
    cbCC = new Ext.form.ComboBox({
        id: 'idcbCC',
        emptyText: 'Seleccione',
        width: 150,
        disabled: true,
        store: stTipoCC,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                stIndicador.reload();
                cc=rec.data.denominacion;
                stMontoTotal.reload();
                if(rec.data.iddatos==1247){
                    cbIndicador.enable();
                }else{
                    cbIndicador.disable();
                    if(monto>0){
                        gpSolicitudes711.enable();
                    }else{
                        gpSolicitudes711.disable();
                    }
                }
                listarSolicitudes();
                //ControlarBotones();
                //btnAdicionar711.enable();
            }
        }
    });
    
    stIndicador = new Ext.data.Store({
        url: 'listarProductos',
        //autoLoad: true,
        listeners: {
            beforeload: function () {
                stIndicador.baseParams.idplan711 = idplan711;
                stIndicador.baseParams.tipo = 1;
            },
            load: function (mi, record, obj) {
                if(smSolicitudes711.getSelected()){
                    cbTareas.setValue(smSolicitudes711.getSelected().data.iddatostarea);
                }
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "iddepreciacionequipo"
        }, [{
                name: 'idproducto711'
            }, {
                name: 'codigocup'
            }, {
                name: 'suministro'
            }, {
                name: 'precio'
            }, {
                name: 'unidadmedida'
            }, {
                name: 'numeropieza'
            }])
    });
        
    cbIndicador = new Ext.form.ComboBox({
        id: 'cbIndicador',
        emptyText: 'Seleccione',
        width: 170,
        disabled: true,
        store: stIndicador,
        displayField: 'suministro',
        valueField: 'idproducto711',
        typeAhead: true,
        //anchor: '80%',
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                inn=rec.data.suministro;
                stMontoTotal.reload();
                if(monto>0){
                    gpSolicitudes711.enable();
                }else{
                    gpSolicitudes711.disable();
                }
                listarSolicitudes();
            }
        }
    });
    
    stMontoTotal = new Ext.data.Store({
        autoLoad: false,
        url: 'MontoTotal',
        reader: new Ext.data.JsonReader({
            root: "data"
        }, [{
                name: 'montototal'
            }]
                ),
        listeners: {
            beforeload: function () {
                stMontoTotal.baseParams.idplan711 = idplan711;
                stMontoTotal.baseParams.identidad = identidadselectedPlanes;
                stMontoTotal.baseParams.idempimp = cbEmpresasImp.getValue();
                stMontoTotal.baseParams.idcc = cbCC.getValue();
                stMontoTotal.baseParams.idindicador = cbIndicador.getValue();
                stMontoTotal.baseParams.tipoplan = tipoplan;
                stMontoTotal.baseParams.idejercicio = cbEjercicioPlanes.getValue();
            },
            load: function (str,t, obj) {
                monto = parseFloat(t[0].data.montototal);
                montototal.setText(addCommas(monto));
            }
        }
    });
    
    montototal = new Ext.form.Label({
        id: 'idmontototal',
        text: '0.00'
    });
    totalpresentdo = new Ext.form.Label({
        text: '0.00'
    });
    totalpresentdoimport = new Ext.form.Label({
        text: '0.00'
    });
    totalcontratado = new Ext.form.Label({
        text: '0.00'
    });
    /*textoconsolidado = new Ext.form.Label({
        text: 'Total consolidado: '
    });
    //totalconsolidado = new Ext.form.Label({
        text: '0.00'
    });*/
    
    //****************************entidades********************************
    tpEstructuraPlanes = new Ext.estructura.panel.PanelEstructura({
        cargos: false,
        menu: false,
        width: 500

    });
    tpEstructuraPlanes.btnBuscar.setText("");
    tpEstructuraPlanes.btnLimpiar.setText("");
    tpEstructuraPlanes = tpEstructuraPlanes.items.items[0];
    tpEstructuraPlanes.getRootNode().expand();
    tpEstructuraPlanes.addListener('click', function (n) {
        if (n.text != "Estructuras") {
            if(n.attributes.nivel!=0){
//                if (n.attributes.idorgano == 10016) {
//                    identidadselectedPlanes = 0;
//                    gpSolicitudes711.disable();
//                    stSolicitudes711.removeAll();
//                    mostrarMensaje(1, 'La entidad seleccionada no pertenece al plan Negocio');
//                    claseMask();
//                } else {
                    cbEmpresasImp.enable();
                    tpEstructuraPlanes.getSelectionModel().select(n);
                    cbEjercicioPlanes.enable();
                    identidadselectedPlanes = n.id;
                    hojaPlanes = n.leaf;
                    denom_ent = n.text;
                    codigoreup = n.attributes.codigo;
                    stMontoTotal.reload();
                    if (monto > 0) {
                        gpSolicitudes711.enable();
                    } else {
                        gpSolicitudes711.disable();
                    }
                    //console.log(n.attributes);
                    direccdest = n.attributes.direccion;
                    listarSolicitudes();
                    claseMask();
                //}
            }else{
                if(btnAprobar.hidden == false || btnAprobarAtm.hidden == false || btnAprobarAT.hidden == false
                    || btnAprobarDI.hidden == false ) {
                    identidadselectedPlanes = null;
                    denom_ent = null;
                    listarSolicitudes();
                    claseMask();
                }
            }
        }

    });
    pEstructuras = new Ext.Panel({
        title: 'Entidades',
        layout: 'fit',
        region: 'west',
        width: 250,
        collapsible: true,
        split: true,
        disabled: true,
        items: [tpEstructuraPlanes]
    });
    pEntPlan = new Ext.Panel({
        layout: 'border',
        region: 'west',
        width: 500,
        items: [pEstructuras]
    });
    //**************grid panel solicitudes****************************
    btnLimpiarSol711 = new Ext.Toolbar.Button({
        iconCls: 'limpiar',
        tabIndex: 11,
        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
        id: 'btntodos',
        disabled: false,
        handler: function () {
            filtrosSolicitudes711.clearFilters();
        }
    });
        
    stSolicitudes711 = new Ext.data.Store({
        url: 'listarSolicitudes711',
        listeners: {
            beforeload: function () {
                stSolicitudes711.removeAll();
                stSolicitudes711.baseParams.start = offset;
                stSolicitudes711.baseParams.idejercicio = cbEjercicioPlanes.getValue();
                stSolicitudes711.baseParams.identidad = identidadselectedPlanes;
                stSolicitudes711.baseParams.idempimp = cbEmpresasImp.getValue();
                stSolicitudes711.baseParams.idcc = cbCC.getValue();
                stSolicitudes711.baseParams.idindicador = cbIndicador.getValue();
                stSolicitudes711.baseParams.tipoplan = tipoplan;
            },
            load: function (st, recor, obj) {
                rec = null;
                mymask.hide();
                gpSolicitudes711.loadMask.hide();
                if(recor.length >=0){
                    gpSolicitudes711.enable(true);
                    
                    totalpresentdo.setText('0.00'); 
                    totalcontratado.setText('0.00');
                    totalpresentdoimport.setText('0.00');
                    //totalconsolidado.setText('0.00');
                    if(recor.length >0){
                        if(recor[0].data.totalpresentado)
                           totalpresentdo.setText(addCommas(recor[0].data.totalpresentado));                    
                        
                        if(recor[0].data.totalcontratado)
                           totalcontratado.setText(addCommas(recor[0].data.totalcontratado));
                       
                        if(recor[0].data.totalpresentdoimport)
                           totalpresentdoimport.setText(addCommas(recor[0].data.totalpresentdoimport));
                        
                        /*if(recor[0].data.totalconsolidado)
                           totalconsolidado.setText(addCommas(recor[0].data.totalconsolidado));*/
                    }
                }else{
                    gpSolicitudes711.disable(true);
                }
                gpContrato.disable();
                ControlarBotones();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'idsolicitud711'
            }, {
                name: 'nosolicitud'
            }, {
                name: 'iddatosempimp'
            }, {
                name: 'iddatoscc'
            }, {
                name: 'denominacion'
            }, {
                name: 'iddatosestado'
            }, {
                name: 'descripciongeneral'
            }, {
                name: 'totalgeneral'
            },{
                name: 'flete'
            },{
                name: 'seguro'
            }, {
                name: 'identidadcliente'
            }, {
                name: 'identidaddestino'
            },{
                name: 'situacionpedido'
            },{
                name: 'idsp'
            },{
                name: 'nopedido'
            }, {
                name: 'fechapresped'
            }, {
                name: 'aperturacredito'
            }, {
                name: 'gerente'
            }, {
                name: 'antecedentes'
            }, {
                name: 'lugarentrega'
            }, {
                name: 'suministrototal'
            }, {
                name: 'otrosgastos'
            }, {
                name: 'idespecialista'
            }, {
                name: 'idgerente'
            }, {
                name: 'iddirector'
            }, {
                name: 'idcodigodecc'
            }, {
                name: 'valorreal'
            }, {
                name: 'iddatosff'
            }, {
                name: 'montoff'
            }, {
                name: 'paraconsolidar'
            }, {
                name: 'estaconsolidada'
            }, {
                name: 'esconsolidada'
            }, {
                name: 'iddatostarea'
            }, {
                name: 'iddirectorecon'
            }, {
                name: 'idespecialistacs'
            }, {
                name: 'idcomprador'
            }, {
                name: 'idtiposolicitudplan'
            }, {
                name: 'nombreentidad'
            }, {
                name: 'codigoaprob'
            }, {
                name: 'nombrecliente'
            }, {
                name: 'indicador'
            }, {
                name: 'idproductoindicador'
            }, {
                name: 'iddatosgrupcomercial'
            }, {
                name: 'idcodigocupdunas'
            }, {
                name: 'listaaprobacion'
            }, {
                name: 'fechacreacion'
            }, {
                name: 'totalpresentado'
            }, {
                name: 'totalcontratado'
            }, {
                name: 'totalconsolidado'
            }, {
                name: 'totalpresentdoimport'
            }  
        ]
                )
    });

    cmSolicitudes711 = new Ext.grid.ColumnModel([
        {
            header: "Estado",
            dataIndex: 'denominacion',
            width: 100,
            renderer: crearToolTip,
            sortable: true,
	    hidden: false
        }
		,{
            header: "Aprobado Especialista",
            dataIndex: 'listaaprobacion',
            width: 100,
            renderer: renderAprobadoEsp,
            sortable: true,
			hidden: false
        },{
            header: "Aprobado Dirección",
            dataIndex: 'listaaprobacion',
            width: 100,
            renderer: renderAprobadoOSDEDIRECC,
            sortable: true,
			hidden: true
        },		
		{
            header: "No.Solicitud",
            dataIndex: 'nosolicitud',
            width: 150,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Descripción general",
            dataIndex: 'descripciongeneral',
            width: 180,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Total general",
            dataIndex: 'totalgeneral',
            width: 100,
            renderer: RenderaddCommas,
            align: 'rigtht',
            sortable: true
        },{
            header: "Valor contratado",
            dataIndex: 'valorreal',
            width: 100,
            renderer: RenderaddCommas,
            sortable: true
        },{
            header: "Fecha de presentación",
            tooltip: "Fecha de presentación",
            dataIndex: 'fechapresped',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip
        },{
            header: "No. pedido",
            dataIndex: 'nopedido',
            id: 'expandir',
            width: 50,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Gerente",
            dataIndex: 'gerente',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        }
        ,{
            header: "Situación del pedido",
            dataIndex: 'situacionpedido',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Apertura de crédito",
            dataIndex: 'aperturacredito',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        }/*,{
            header: "Para consolidar",
            dataIndex: 'paraconsolidar',
            width: 100,
            renderer: renderActivado,
            sortable: true
        },{
            header: "Esta consolidada",
            dataIndex: 'estaconsolidada',
            //hidden: true,
            width: 100,
            renderer: renderActivado,
            sortable: true
        },{
            header: "Es consolidada",
            dataIndex: 'esconsolidada',
            //hidden: true,
            width: 100,
            renderer: renderActivado,
            sortable: true
        }*/,{
            header: "Indicador Asociado",
            dataIndex: 'indicador',
            hidden: true,
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Fecha de creacion",
            dataIndex: 'fechacreacion',
            hidden: true,
            width: 100,
            renderer: crearToolTip,
            sortable: true
        }
    ]);
    stSituacionPedido = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stSituacionPedido.baseParams.uri = 4;
            },
            load: function (t) {
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
                )
    });
    filtrosSolicitudes711 = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'nosolicitud'
            }, {
                type: 'string',
                dataIndex: 'nombreentidad'
            }, {
                type: 'string',
                dataIndex: 'descripciongeneral'
            }, {
                type: 'numeric',
                dataIndex: 'totalgeneral'
            },{
                type: 'numeric',
                dataIndex: 'valorreal'
            },{
                type: 'date',
                dataIndex: 'fechapresped'
            }, {
                type: 'string',
                dataIndex: 'nopedido'
            },{
                type: 'string',
                dataIndex: 'gerente'
            }/*,{
                type: 'boolean',
                dataIndex: 'paraconsolidar'
            }*/, {
                type: 'string',
                dataIndex: 'situacionpedido'
            }]
    });

    smSolicitudes711 = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
             rowselect : function (sm, y, record) {
                 //stContrato.reload();
                 rec = record;
                 ControlarBotones();
                 idsolp = rec.data.idsolicitud711;
                 nosol = rec.data.nosolicitud;
                 filasel=y;
                 //btnModificar711.enable();
            }
        }
    });
    
    btnAdicionar711 = new Ext.Toolbar.Button({
        tooltip: 'Adicionar',
        id: 'btnAdicionar711',
        iconCls: 'adicionar',
        hidden: true,
        disabled: true,
        handler: function () {
            plan = cbEjercicioPlanes.getRawValue();
            empimp = cbEmpresasImp.getRawValue();
            cc = cbCC.getRawValue();
            winFp(1);
        }
    });
    btnEliminar711 = new Ext.Toolbar.Button({
        disabled: true,
        tooltip: 'Eliminar',
        id: 'btnEliminar711',
        iconCls: 'eliminar',
        hidden: true,
        handler: function () {
            //eliminarIndModPlanes();
        }
    });
    btnModificar711 = new Ext.Toolbar.Button({
        disabled: true,
        tooltip: 'Modificar',
        id: 'btnModificar711',
        iconCls: 'modificar',
        hidden: true,
        handler: function () {
            winFp(2);
        }
    });
    
    btnAprobar = new Ext.Toolbar.Button({
        tooltip: 'Aprobar dirección',
        id: 'btnAprobar',
        disabled: true,
        iconCls: 'aprobar',
        hidden: true,
        handler: function () {
            textorchazo=null;
            AprobarDesaprobar(1, 5);
        }
    });
    btnAprobarEspF = new Ext.Toolbar.Button({
        tooltip: 'Aprobar especialista ecónomico empresa',
        id: 'btnAprobarEspF',
        disabled: true,
        iconCls: 'aprobar',
        hidden: true,
        handler: function () {
            textorchazo=null;
            AprobarDesaprobar(1,1);
        }
    });
    
    btnAprobarEspEmp = new Ext.Toolbar.Button({
        tooltip: 'Aprobar especialista empresa',
        id: 'btnAprobarEspEmp',
        disabled: true,
        iconCls: 'aprobar',
        hidden: true,
        handler: function () {
            textorchazo=null;
            AprobarDesaprobar(1,7);
        }
    });
    
    btnAprobarAtm = new Ext.Toolbar.Button({
        tooltip: 'Aprobar especialista ATM OSDE',
        id: 'btnAprobarAtm',
        disabled: true,
        iconCls: 'aprobar',
        hidden: true,
        handler: function () {
            textorchazo=null;
            AprobarDesaprobar(1, 2);
        }
    });
    btnAprobarAT = new Ext.Toolbar.Button({
        tooltip: 'Aprobar área técnica OSDE',
        id: 'btnAprobarAT',
        disabled: true,
        iconCls: 'aprobar',
        hidden: true,
        handler: function () {
            textorchazo=null;
            AprobarDesaprobar(1, 2);
        }
    });
    btnAprobarDI = new Ext.Toolbar.Button({
        tooltip: 'Aprobar dirección de inversiones',
        id: 'btnAprobarDI',
        disabled: true,
        iconCls: 'aprobar',
        hidden: true,
        handler: function () {
            textorchazo=null;
            AprobarDesaprobar(1, 2);
        }
    });
    
    btnDesaprobar = new Ext.Toolbar.Button({
        tooltip: 'Rechazar',
        id: 'btnDesaprobar',
        disabled: true,
        iconCls: 'desaprobar',
        hidden: true,
        handler: function () {
            MotivoRechazo(2);
        }
    });
    btnVerJust = new Ext.Toolbar.Button({
        tooltip: 'Ver justificación',
        id: 'btnVerJust',
        disabled: true,
        iconCls: 'ver',
        hidden: true,
        handler: function () {
            winModificaciones();
        }
    });
    btnActualizarFechaP = new Ext.Toolbar.Button({
        disabled: true,
        tooltip: 'Actualizar fecha del pedido',
        id: 'btnActualizarFechaP',
        iconCls: 'actualizar',
        hidden: true,
        handler: function () {
            ActualizarFechaP();
        }
    });
    btnActualizar711 = new Ext.Toolbar.Button({
        disabled: true,
        tooltip: 'Actualizar pedido',
        id: 'btnActualizar711',
        iconCls: 'actualizar',
        hidden: true,
        handler: function () {
            actualizarGerentePedido();
        }
    });
    btnAperturaCred = new Ext.Toolbar.Button({
        disabled: true,
        tooltip: 'Apertura carta crédito',
        id: 'btnAperturaCred',
        iconCls: 'actualizar',
        hidden: true,
        handler: function () {
            ActualizarFechaAperturaCredito();
        }
    });
    btnExportar711 = new Ext.Toolbar.Button({
        disabled: true,
        tooltip: 'Exportar plantilla 711',
        id: 'btnExportar711',
        iconCls: 'exportar',
        hidden: true,
        handler: function () {
            Exportar711();
        }
    });
    menuSituacionPEdido = new Ext.Toolbar.MenuButton({
        id: 'menuSituacionPEdido',
        tooltip: 'Situación de pedido',
        iconCls: 'cambiodestado',
        disabled: true,
        hidden: true,
        menu: {
            items: [{
                text: 'En solicitud de ofertas',
                id: 'Ensolicitud',
                handler: function () {
                        CambiarSituacionPedido(4, 'En solicitud de ofertas');
                }
            },{
                text: 'Ofertas pendientes',
                id: 'OfertaPend',
                handler: function () {
                        CambiarSituacionPedido(5, 'Ofertas pendientes');
                }
            },{
                text: 'Para comité Tecnotex',
                id: 'ParaTec',
                handler: function () {
                        CambiarSituacionPedido(6, 'Para comité Tecnotex');
                }
            },{
                text: 'Para comité GAE',
                id: 'ParaGae',
                handler: function () {
                        CambiarSituacionPedido(7, 'Para comité GAE');
                }
            },{
                text: 'Devuelto',
                id: 'Devuelto',
                handler: function () {
                        CambiarSituacionPedido(2, 'Devuelto');
                }
            },{
                text: 'En proceso de contratación',
                id: 'Enproceso',
                handler: function () {
                        msgmotivo = "";
                        mostrarMensaje(2, '¿Solicitar modificar la solicitud?', function (btnPresionado) {
                            if (btnPresionado == 'ok') {
                                EscribirMotivo(3, 'En proceso de contratación');
                            } else {
                                CambiarSituacionPedido(3, 'En proceso de contratación');
                            }
                        });                        
                }
            },{
                text: 'Contratado',
                id: 'Contratado',
                handler: function () {
//                    if (rec.data.iddatosestado=='5042'){
                        CambiarSituacionPedido(1, 'Contratado');
//                    }else{
//                        mostrarMensaje(1, "La solicitud no se encuentra aceptada por la dirección");
//                    }
                }
            },{
                text: 'Suministrado completamente',
                id: 'Completo',
                handler: function () {
                    if (rec.data.iddatosestado=='5042'){
                        CambiarSituacionPedido(9, 'Suministrado completamente');
                    }else{
                        mostrarMensaje(1, "La solicitud no se encuentra aceptada por la dirección");
                    }
                }
            },{
                text: 'Puesta en marcha',
                id: 'Marcha',
                handler: function () {
                    if (rec.data.iddatosestado=='5042'){
                        CambiarSituacionPedido(10, 'Puesta en marcha');
                    }else{
                        mostrarMensaje(1, "La solicitud no se encuentra aceptada por la dirección");
                    }
                        
                }
                
            },{
                text: 'Cancelado',
                id: 'Cancelado',
                handler: function () {
                        msgmotivo = "";
                        mostrarMensaje(2, '¿Escribir motivo para cancelar solicitud?', function (btnPresionado) {
                            if (btnPresionado == 'ok') {
                                EscribirMotivo(11, 'Cancelado');
                            }
                        });  
                }
                
            },{
                text: 'Reactivar',
                id: 'Reactivar',
                handler: function () {
                        mostrarMensaje(2, '¿Està seguro que desea reactivar la solicitud seleccionada?', function (btnPresionado) {
                            if (btnPresionado == 'ok') {
                                CambiarSituacionPedido(12, 'Reactivar'); 
                            }
                        }); 
                        
                }
                
            }]
        }
    });
    
    btnDistribucionProd = new Ext.Toolbar.Button({
        disabled: false,
        tooltip: 'Distribuir productos suministrados',
        id: 'btnDistribucionProd',
        iconCls: 'distribucion',
        hidden: true,
        handler: function () {
            WpActualizarSuministros();
        }
    });
    btnVerDescripcionSol = new Ext.Toolbar.Button({
        tooltip: 'Ver especificaciones técnicas',
        id: 'btnVerDescripcionSol',
        disabled: true,
        iconCls: 'ver',
        //hidden: true,
        handler: function () {
            winDescripcionTodas();
        }
    });
    
    /*btnVerificarConsolidado = new Ext.Button({
        handler: function () {
            winRevisiones();
        },
        tooltip: 'Revisar solicitudes para consolidar',
        id: 'btnVerificarConsolidado',
        disabled: true,
        iconCls: 'comprobante'
    });*/
    
    gpSolicitudes711 = new Ext.grid.EditorGridPanel({
        frame: true,
        stripeRows: true,
        store: stSolicitudes711,
        sm: smSolicitudes711,
        disabled: true,
        region: 'center',
        layout: 'fit',
        autoExpandColumn: 'expandir',
        cm: cmSolicitudes711,
        tbar: [btnAdicionar711/*,btnEliminar711*/,btnModificar711,
            btnAprobar, btnAprobarEspEmp,btnDesaprobar,btnVerJust,btnVerDescripcionSol,btnActualizar711/*, btnActualizarFechaP*/,menuSituacionPEdido,btnExportar711, /*btnVerificarConsolidado,*/ '-', btnAperturaCred,'-',btnDistribucionProd],
        bbar: new Ext.PagingToolbar({
            pageSize: 50,
            store: stSolicitudes711,
            displayInfo: true,
            items: [btnLimpiarSol711],
            listeners: {
                beforechange: function (p, e) {
                    offset = e.start;
                }
            }
        }),
        plugins: filtrosSolicitudes711,
        loadMask: {
            msg: 'Cargando ...'
        },
        listeners: {
            celldblclick: function (me, row_id, col_id) {
                gpSolicitudes711.getColumnModel().setEditable(col_id, true);
            }
        }
    });

    pSolicitudes = new Ext.Panel({
        id: 'pSolicitudes',
        title: perfil.etiquetas.titModelos,
        split: true,
        disabled: false,
        region: 'center',
        layout: 'border',
        tbar: ['Plan: ', cbEjercicioPlanes, '-','Empresa Importadora: ',cbEmpresasImp,'-','Código de planificación: ',cbCC, '-', 'Indicador:', cbIndicador],
        items: [gpSolicitudes711]
    });
    //****************panel de Contrato*******************
    pCEmbarquesMin= new Ext.Panel({
        region: 'center',
        layout: 'fit',
        split: true,
        items: [gpCtFuentesF]
    });
    
    tabDetallesEmbarques = new Ext.TabPanel({
        activeTab: 0,
//        width:1000,
//        height:450,
        //layout: 'fit',
        plain:true,
        defaults:{autoScroll: true},
        items: [{
                title: 'Cubicajes',
                layout: 'fit',
                html: "<div id = 'cubicajes' ></div>",
                items: [gpListaDetalles]
            }, {
                title: 'Formas de pago',
                layout: 'fit',
                html: "<div id = 'formaspagos' ></div>",
                items: [gpCtFormaPago]
            }
        ],
        listeners: {
             tabchange : function (panel,tab){                 
                 tab.doLayout(true);                 
             }
        }
    });
    
    pDetalleEmbarque= new Ext.Panel({
        region: 'east',
        layout: 'fit',
        collapsible: true,
        collapsed: true,
        width: '70%',
        titleCollapse: true,
        split: true,
        title: "Detalles de por embarque",
        margins:'0 0 0 0',
        items: [tabDetallesEmbarques]
    });
    
    pCEmbarques= new Ext.Panel({
        region: 'east',
        layout: 'border',
        collapsible: true,
        collapsed: true,
        width: '85%',
        titleCollapse: true,
        split: true,
        title: "Embarques de contrato",
        margins:'0 0 0 0',
        items: [pCEmbarquesMin, pDetalleEmbarque]
    });
    pCont= new Ext.Panel({
        region: 'center',
        layout: 'fit',
        //width: '30%',
        items: [gpContrato]
    });
    pContratoyEmbarques= new Ext.Panel({
        region: 'center',
        layout: 'border',
        items: [pCont, pCEmbarques]
    });
    
    pContrato = new Ext.Panel({
        //id: 'pContrato',
        region: 'south',
        layout: 'border',
        collapsible: true,
        collapsed: true,
        disabled: false,
        height: 300,
        //hidden: true,
        titleCollapse: true,
        split: true,
        title: "Contrato",
        items: [pContratoyEmbarques]
    });
    //****************panel de solicitudes*******************
    pSolicitudesTodas = new Ext.Panel({
        region: 'center',
        layout: 'border',
        //tbar: ['MOnto akkaksaka'],
        items: [pSolicitudes, pContrato]
    });
    
    
    //****************panel principal*******************
    pGeneral = new Ext.Panel({
        layout: 'border',
        tbar: ['->','Monto total disponible: ',montototal,'-','Total presentado: ',totalpresentdo,'-','Total presentado a importadora: ',totalpresentdoimport,'-','Total contratado: ',totalcontratado, 
            '-',/*textoconsolidado,totalconsolidado,*/btnAyudaGestSolicitudes],
        items: [pEstructuras, pSolicitudesTodas]
    });
    //******************viewport*****************
    myViewPlanes = new Ext.Viewport({
        layout: 'fit',
        items: [pGeneral],
        listeners: {
            afterlayout: function (e) {
//                var claseMask = document.getElementsByClassName('ext-el-mask');
//                var maskEstructura = claseMask.item(0);
//                var maskDistribucion = claseMask.item(1);
//                (maskEstructura != null) ? maskEstructura.style.zIndex = '0' : null;
//                (maskDistribucion != null) ? maskDistribucion.style.zIndex = '0' : null;
            claseMask();
            }
        }
    });
    
    function claseMask() {
        var claseMask = document.getElementsByClassName('ext-el-mask');
        var maskEstructura = claseMask.item(0);
        var maskDistribucion = claseMask.item(1);
        (maskEstructura != null) ? maskEstructura.style.zIndex = '0' : null;
        (maskDistribucion != null) ? maskDistribucion.style.zIndex = '0' : null;
    }

}

function listarSolicitudes(){
    stSolicitudes711.reload();
    cbEmpresasImp.enable();
    stMontoTotal.reload();
    rec=null;
    ControlarBotones(rec);
}

function AprobarDesaprobar(accion, aprobacion) {
    text = (accion == 1) ? 'aprobar' : 'desaprobar';
    mostrarMensaje(2, '¿Está seguro que desea ' + text + ' el pedido ?', function (btnPresionado) {
        if (btnPresionado == 'ok') {
            mymask.show();
            Ext.Ajax.request({
                url: 'AprobarDesaprobar',
                params: {
                    aprobacion: aprobacion,
                    accion: accion,
                    idsolicitud711: smSolicitudes711.getSelected().data.idsolicitud711,
                    textorchazo: textorchazo
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData) {
                        if (responseData.msg == 1) {
                            listarSolicitudes();
                            mostrarMensaje(2, 'La solicitud ha sido aprobada correctamente'); 
                            if(responseData.usuarios.length>0){
                                setTimeout(function(){
                                    mostrarMensaje(2, 'Se ha detectado una configuración de notificaciones');
                                    ListaUsuariosNotificar(responseData.usuarios,1);
                                }, 4000);                                
                            }
                        } else if (responseData.msg == 2) {
                            mostrarMensaje(1, responseData.msg);
                            gpSolicitudes711.disable(true);
                        }
                    }
                    mymask.hide();
                }
            });
        }
    });
}

function ControlarBotones(){
    btnEliminar711.disable();
    //btnVerificarConsolidado.enable();
    btnVerJust.disable();
    btnExportar711.disable();
    btnAprobar.disable();
    //btnAprobarEspF.disable();
    btnAprobarAtm.disable();
    btnAprobarAT.disable();
    btnAprobarDI.disable();
    btnAprobarEspEmp.disable();
    btnDesaprobar.disable();
    btnVerJust.disable();
    btnVerDescripcionSol.disable();
    menuSituacionPEdido.disable();
    Ext.getCmp('Reactivar').disable(); 
    btnActualizarFechaP.disable();
    gpContrato.disable();
    gpCtFuentesF.disable();
    //***************************stContrato.reload();
    btnModificar711.disable();
    btnActualizar711.disable();
    btnAperturaCred.disable();
    btnAdicionar711.disable();
    btnDistribucionProd.disable();

    if(identidadselectedPlanes != null && denom_ent != null){
        if(cbIndicador.getValue()!="" || cbCC.getValue()!=1247){
            btnAdicionar711.enable();
            if(gpSolicitudes711.getSelectionModel().getCount()>0){
                btnModificar711.enable();
                if (rec != null) {
                    if (rec.data.estaconsolidada == true) {
                        btnModificar711.disable();
                    }
                }
            }

        }
    }
    if(identidadselectedPlanes == null && denom_ent == null){
        btnModificar711.disable();
        btnAdicionar711.disable();
    }
    if (rec != null) {

        btnExportar711.enable();
        idsolp = rec.data.idsolicitud711;
        btnVerDescripcionSol.enable();
        //btnModificar711.enable();
        if (rec.data.nopedido != null || rec.data.idsp != null) {
            switch (rec.data.idsp) {
                case null:
                    //btnExportar711.enable();
                    btnAprobar.enable();
                    //btnAprobarEspF.enable();
                    btnAprobarAtm.enable();
                    btnAprobarAT.enable();
                    btnAprobarDI.enable();
                    btnDesaprobar.enable();
                    btnVerJust.enable();
                    menuSituacionPEdido.enable();
                    btnActualizarFechaP.enable();
                    gpContrato.disable();
                    gpCtFuentesF.disable();
                    btnActualizar711.enable();
                    btnAperturaCred.enable();
                    break;
                case '5026':
                    btnEliminar711.disable();
                    //btnExportar711.disable();
                    btnAprobar.disable();
                    //btnAprobarEspF.disable();
                    btnAprobarAtm.disable();
                    btnAprobarAT.disable();
                    btnAprobarDI.disable();
                    btnDesaprobar.disable();
                    btnVerJust.enable();
                    menuSituacionPEdido.disable();
                    btnActualizarFechaP.disable();
                    gpContrato.enable();
                    gpCtFuentesF.enable();
                    btnActualizar711.disable();
                    btnAperturaCred.disable();
                    stContrato.reload();
                    break;
                case '1245':
                    //btnEliminar711.enable();
                    menuSituacionPEdido.disable();
                    gpContrato.disable();
                    btnAprobar.disable();
                    //btnAprobarEspF.disable();
                    btnAprobarAtm.disable();
                    btnAprobarAT.disable();
                    btnAprobarDI.disable();
                    btnActualizarFechaP.disable();
                    //btnAprobarF.disable();
                    btnVerJust.enable();
                    btnVerDescripcionSol.enable();
                    btnDesaprobar.disable();
                    gpContrato.disable();
                    btnDistribucionProd.disable();
                    break;
                case '5023':
                            menuSituacionPEdido.enable();
                            Ext.getCmp('Ensolicitud').disable(); 
                            Ext.getCmp('OfertaPend').disable(); 
                            Ext.getCmp('ParaTec').disable(); 
                            Ext.getCmp('ParaGae').disable(); 
                            Ext.getCmp('Devuelto').disable(); 
                            Ext.getCmp('Enproceso').enable(); 
                            Ext.getCmp('Contratado').enable(); 
                            //Ext.getCmp('Parcial').enable(); 
                            Ext.getCmp('Completo').enable(); 
                            Ext.getCmp('Marcha').enable(); 
                            Ext.getCmp('Cancelado').enable();
                            btnActualizar711.disable();
                            btnAprobar.enable();
                            //btnAprobarEspF.disable();
                            btnAprobarAtm.enable();
                            btnAprobarAT.enable();
                            btnAprobarDI.enable();
                            btnAprobarEspEmp.enable();
                            //btnAprobarF.disable();
                            btnVerJust.enable();
                            btnDesaprobar.enable();
                            gpContrato.disable();
                            btnDistribucionProd.disable();
                            gpCtFuentesF.disable();
                    break;    
                case '5024':
                    btnVerJust.enable();
                    //btnExportar711.enable();
                    Ext.getCmp('Ensolicitud').disable();
                    Ext.getCmp('OfertaPend').disable();
                    Ext.getCmp('ParaTec').disable();
                    Ext.getCmp('ParaGae').disable();
                    Ext.getCmp('Devuelto').disable();
                    Ext.getCmp('Enproceso').enable();
                    Ext.getCmp('Contratado').enable();
                    //Ext.getCmp('Parcial').enable(); 
                    Ext.getCmp('Completo').enable();
                    Ext.getCmp('Marcha').enable();
                    Ext.getCmp('Cancelado').disable();
                    btnDistribucionProd.enable();
                    btnActualizar711.disable();
                    btnAprobar.disable();
                    //btnAprobarEspF.disable();
                    btnAprobarAtm.disable();
                    btnAprobarAT.disable();
                    btnAprobarDI.disable();
                    btnDesaprobar.disable();
                    gpContrato.enable();
                    gpCtFuentesF.enable();
                    stContrato.reload();
                    menuSituacionPEdido.enable();
                    break;
                case '5025':
                    btnVerJust.enable();
                    btnExportar711.enable();
                    Ext.getCmp('Ensolicitud').disable();
                    Ext.getCmp('OfertaPend').disable();
                    Ext.getCmp('ParaTec').disable();
                    Ext.getCmp('ParaGae').disable();
                    Ext.getCmp('Devuelto').disable();
                    Ext.getCmp('Enproceso').disable();
                    Ext.getCmp('Contratado').enable();
                    //Ext.getCmp('Parcial').enable(); 
                    Ext.getCmp('Completo').enable();
                    Ext.getCmp('Marcha').enable();
                    Ext.getCmp('Cancelado').disable();
                    btnActualizar711.disable();
                    btnDistribucionProd.enable();
                    gpContrato.enable();
                    gpCtFuentesF.enable();
                    stContrato.reload();
                    btnAprobar.disable();
                    //btnAprobarEspF.disable();
                    btnAprobarAtm.disable();
                    btnAprobarAT.disable();
                    btnAprobarDI.disable();
                    btnDesaprobar.disable();
                    menuSituacionPEdido.enable();
                    break;
                case '5086':
                    btnVerJust.enable();
                    //btnExportar711.enable();
                    Ext.getCmp('Ensolicitud').disable();
                    Ext.getCmp('OfertaPend').disable();
                    Ext.getCmp('ParaTec').disable();
                    Ext.getCmp('ParaGae').disable();
                    Ext.getCmp('Devuelto').disable();
                    Ext.getCmp('Enproceso').disable();
                    Ext.getCmp('Contratado').enable();
                    //Ext.getCmp('Parcial').enable(); 
                    Ext.getCmp('Completo').enable();
                    Ext.getCmp('Marcha').enable();
                    Ext.getCmp('Cancelado').disable();
                    btnActualizar711.disable();
                    btnDistribucionProd.enable();
                    gpContrato.enable();
                    gpCtFuentesF.enable();
                    stContrato.reload();
                    btnAprobar.disable();
                    //btnAprobarEspF.disable();
                    btnAprobarAtm.disable();
                    btnAprobarAT.disable();
                    btnAprobarDI.disable();
                    btnDesaprobar.disable();
                    menuSituacionPEdido.enable();
                    break;
            }
            if (rec.data.idsp == "5020" || rec.data.idsp == "5018" || rec.data.idsp == "5019" || rec.data.idsp == "5021" || rec.data.idsp == "5022" || rec.data.idsp == null) {
                btnVerJust.enable();
                //btnExportar711.enable();
                Ext.getCmp('Ensolicitud').enable();
                Ext.getCmp('OfertaPend').enable();
                Ext.getCmp('ParaTec').enable();
                Ext.getCmp('ParaGae').enable();
                Ext.getCmp('Devuelto').enable();
                Ext.getCmp('Enproceso').enable();
                Ext.getCmp('Contratado').disable();
                //Ext.getCmp('Parcial').enable(); 
                Ext.getCmp('Completo').disable();
                Ext.getCmp('Marcha').disable();
                Ext.getCmp('Cancelado').enable();
//                btnDistribucionProd.disable();
                gpContrato.disable();
                gpCtFuentesF.disable();
                //stContrato.reload();
                btnAprobar.enable();
                //btnAprobarEspF.enable();
                btnAprobarAtm.enable();
                btnAprobarAT.enable();
                btnAprobarDI.enable();
                btnDesaprobar.enable();
                menuSituacionPEdido.enable();
                btnActualizarFechaP.enable();
                btnActualizar711.enable();
                btnAperturaCred.enable();
                btnModificar711.enable();
            }

        } else {
            menuSituacionPEdido.enable();
                Ext.getCmp('Ensolicitud').disable();
                Ext.getCmp('OfertaPend').disable();
                Ext.getCmp('ParaTec').disable();
                Ext.getCmp('ParaGae').disable();
                Ext.getCmp('Devuelto').disable();
                Ext.getCmp('Enproceso').disable();
                Ext.getCmp('Contratado').disable();
                //Ext.getCmp('Parcial').enable(); 
                Ext.getCmp('Completo').disable();
                Ext.getCmp('Marcha').disable();
                Ext.getCmp('Cancelado').enable();
            btnAprobar.enable();
            //btnAprobarEspF.enable();
            btnAprobarAtm.enable();
            btnAprobarAT.enable();
            btnAprobarDI.enable();
            btnDesaprobar.enable();
            btnActualizar711.disable();
            gpContrato.disable();
            gpCtFuentesF.disable();
            btnVerJust.enable();
            //btnExportar711.enable();
        }
        if (rec.data.estaconsolidada == true) {
            btnAprobar.disable();
            //btnAprobarEspF.disable();
            btnAprobarAtm.disable();
            btnAprobarAT.disable();
            btnAprobarDI.disable();
            btnDesaprobar.disable();
            menuSituacionPEdido.disable();
            btnActualizarFechaP.disable();
            btnActualizar711.disable();
            btnAperturaCred.disable();
            gpContrato.disable();
        }
//        if (rec.data.esconsolidada == true) {
//            btnDistribucionProd.enable();
//        }
        if (rec.data.iddatosestado != null) {
            
            lista=rec.data.listaaprobacion;
            if((lista.includes('2') && lista.includes('3') && lista.includes('6') && btnDesaprobar.hidden == true)|| lista.includes('5') ){
                btnExportar711.enable();
                if ((rec.data.idsp == "5020" || rec.data.idsp == "5018" || rec.data.idsp == "5019" || rec.data.idsp == "5021" || rec.data.idsp == "5022" 
                        || rec.data.idsp == null) && rec.data.estaconsolidada == false) {
                    btnActualizar711.enable();
                }
            }
            else{
                btnExportar711.disable();
                btnActualizar711.disable();
            }
            if(lista=='0'|| rec.data.idsp == "5023" ){
                btnModificar711.enable();
                btnAprobarEspEmp.enable();
            }else{
                btnAprobarEspEmp.disable();
                btnModificar711.disable();
            }
        }
        if(btnAprobar.hidden == false || btnAprobarAtm.hidden == false || btnAprobarAT.hidden == false
                 || btnAprobarDI.hidden == false ) {
             btnExportar711.enable();
             if (rec.data.idsp == '1245'){
                menuSituacionPEdido.enable();
                Ext.getCmp('Ensolicitud').disable();
                Ext.getCmp('OfertaPend').disable();
                Ext.getCmp('ParaTec').disable();
                Ext.getCmp('ParaGae').disable();
                Ext.getCmp('Devuelto').disable();
                Ext.getCmp('Enproceso').disable();
                Ext.getCmp('Contratado').disable();
                //Ext.getCmp('Parcial').enable(); 
                Ext.getCmp('Completo').disable();
                Ext.getCmp('Marcha').disable();
                Ext.getCmp('Cancelado').disable();
                Ext.getCmp('Reactivar').enable(); 
            }
         }else{
             Ext.getCmp('Reactivar').hide(); 
             if(lista.includes('2')||lista.includes('6')||lista.includes('4')||lista.includes('3')){
                btnDesaprobar.disable();
             }
         }
        if (rec.data.paraconsolidar == true) {
            menuSituacionPEdido.disable();
            btnActualizarFechaP.disable();
            btnActualizar711.disable();
        }
        if(cbCC.getValue()=="" || cbEmpresasImp.getValue()==""){
            btnModificar711.disable();
        }
        if (rec.data.idsp == '1245') {
            btnModificar711.disable();
        }
    }
    if(identidadselectedPlanes==null){
        btnAdicionar711.disable();
        btnModificar711.disable();
    }
    if(btnAprobar.hidden == true){
       //textoconsolidado.hide();
       //totalconsolidado.hide();
       //btnVerificarConsolidado.hide();
    }

}