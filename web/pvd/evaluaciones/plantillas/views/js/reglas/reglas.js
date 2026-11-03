Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('reglas', cargarInterfaz);

var btnLimpiarCelda,btnValidarFormula,btnBajarfila,btnSubirfila,btnAyuda,btnAdicionarRegla,btnModificarDatosRegla,btnEliminarRegla,btnBuscarPlanilla,btnFiltrar,btnModificarExpRegla,btnCancelarR,btnAceptarR,btnAddFilaFormula,btnDelFilaFormula,btnGuardarFormula,btnLimpiarFormula;
var stReglas,stPlanillas,stcbEstado,tlarbolDominios,stEscala;
var tfDenominacion,heDescripcion,cbEstado;
var vpReglas,numero,operador,funciones,winFormRegla,winIndImagen;
var smgpFormula, cmgpFormula;
var pformula,pPreview,tpFormula,stgpFormula,gpFormula,pcontenedor,gpEscala,gpReglas,pOperaciones,gpPlanillas,winFiltrarPlanillas,pIzquierdo;
var fpRegla,fpModRegla,winIndicadoresChk;
var pformulaDDTarget,treeIndicadores,myRecordFormula;
var mskValidarExpresion,ptEscala,cmEscala,tlIndicdorChk,tpIndicadoresChk,rootIndicadorChk;
var cargadorDominio,tpDominio,raizDominio,recurso = -1, cargadorIndicadores,raizIndicador;
var iddominioevaluativo,textoBuscar,idPlanillaSeleccionada,tipoIndicadorSeleccionado;
var banderaModExpresion, idReglaAModificar;
function cargarInterfaz(){
    perfil = arguments[0];
    labels = arguments[1];

//Botones
var btnAyudaTP = new Ext.Button({
    id: 'ayudaTP',
    text:'Ayuda',
    tooltip:'Ayuda',
    iconCls:'ayuda',
    handler : function(){
        //Para ejecutar ayuda
        var urlayuda = "../../../../template/evaluaciones/plantillas/reglas.html";
        window.open(urlayuda,"Ayuda","width=650,height=400,menubar=yes,scrollbars=yes,resizable=yes");
    }
});
btnAdicionarRegla = new Ext.Button({id:'btnAddRegla', iconCls:'adicionar', text:labels.lbtnAdicionar, tooltip:labels.ttpAdicionarRegla, /*handler:function(){winForm('Ins');} */ });
btnEliminarRegla = new Ext.Button({disabled:true,id:'btnDelRegla', iconCls:'eliminar', text:labels.lbtnEliminar, tooltip:labels.ttpEliminarRegla, handler:function(){eliminarRegla(); }});
btnBuscarPlanilla = new Ext.Button({id:'btnBuscarPlanilla', text:labels.lbtnBuscar, iconCls:'buscar', tooltip:labels.ttpBuscarPlanilla, handler: function(){buscarPlanillas();} });
btnFiltrar = new Ext.Button({id:'btnFiltrar', iconCls:'filtrar', text:labels.lbtnFiltrar, tooltip:labels.ttpFiltrar, handler: function(){filtrarPlanillas()} });
btnModificarDatosRegla = new Ext.Action({id:'btnModDatRegla', iconCls:'modificar', text:labels.lbtnModificarDatosRegla, handler:function(){showWinFormRegla('Mod');} });
btnModificarExpRegla = new Ext.Action({id:'btnModExpRegla', iconCls:'modificar', text:labels.lbtnModificarExpresionRegla, handler:function(){modificarExpRegla();} });
btnAddFilaFormula = new Ext.Button({id:'btnAddFilaFormula', iconCls:'adicionar', text:labels.lbtnAdicionar, tooltip:labels.ttpAddFilaFormula, handler: adicionarFilaFormula });
btnDelFilaFormula = new Ext.Button({disabled:true,id:'btnDelFilaFormula', iconCls:'eliminar', text:labels.lbtnEliminar, tooltip:labels.ttpDelFilaFormula, handler: eliminarFilaFormula });
btnGuardarFormula = new Ext.Button({disabled:true,id:'btnGuardarFormula', iconCls:'guardar', text:labels.lbtnGuardar, tooltip:labels.ttpGuardarFormula, handler: guardarRegla });
btnLimpiarFormula = new Ext.Button({disabled:true,id:'btnLimpiarFormula', iconCls:'limpiar', text:labels.lbtnLimpiar, tooltip:labels.ttpLimpiarFormula, handler:limpiarFormula});
btnValidarFormula = new Ext.Button({id:'validarFormula',disabled:true,iconCls:'validar',text:labels.lbtnValidarFormula, tooltip:labels.ttpValidarFormula, handler: validarExpresion });
btnLimpiarCelda = new Ext.Button({id:'btnLimpiarCelda',disabled:true,iconCls:'limpiar', tooltip:labels.ttpLimpiarCelda, handler: limpiarCelda });
btnSubirfila = new Ext.Button({
    id:'subirfila',disabled:true,iconCls:'arriba',tooltip:labels.ttpMoverArriba, handler: moverFilaArriba
});
btnBajarfila = new Ext.Button({
    id:'bajarfila',disabled:true,iconCls:'abajo',tooltip:labels.ttpMoverAbajo, handler:moverFilaAbajo
});
btnCancelarR = new Ext.Button({
    id:'idbtnCancelarR',iconCls:'cancelar',text:labels.lbtnCancelar, handler: function(){winFormRegla.hide();}
});
btnAceptarR = new Ext.Button({
    id:'idbtnAceptarR',iconCls:'aceptar',text:labels.lbtnAceptar,handler: function(){AddModRegla(varAccion);}
});
idPlanillaSeleccionada = -1,varAccion="",banderaModExpresion=false, idReglaAModificar=-1;

tfFiltro = new Ext.form.TextField({
    //fieldLabel : 'C&oacute;digo',
    id: 'idtffiltro',
    name : 'tffiltro',
    emptyText: labels.lbEmptyTextBuscar,
    width : 135,
    listeners: {
        specialkey: function(field, e){
            if (e.getKey() == e.ENTER) {
                buscarPlanillas();//LLamo a la funcion que busca las planillas por denominación.
            }
        }
    }
});

tfDenominacion = new Ext.form.TextField({
    tabIndex : 1,
    fieldLabel: labels.lbDenominacion,
    id: 'denom',
    msgTarget: 'qtip',
    maskRe: /^([a-zA-Z0-9???????? ]+ ?[a-zA-Z0-9_???????? ]*)+$/,
    allowBlank: false,
    anchor: '90%'
});

heDescripcion = new Ext.form.HtmlEditor({
    id:'descripcion',
    fieldLabel:labels.lbDescripcion,
    enableSourceEdit: false,
    enableLinks: false,
    enableLists: false,
    allowBlank:false,
    height:120,
    anchor:'98%'
});

stcbEstado = new Ext.data.Store({
    url: 'cargarEstados',
    reader:new Ext.data.JsonReader({
        root: "datos",
        totalProperty: "cantidad",
        id: "idestado"
    },[
        {name: 'idestado'},
        {name: 'denom'}
    ])
});
stcbEstado.load();

cbEstado = new Ext.form.ComboBox({
    fieldLabel: labels.lbcbEstado,
    id : 'idcbEstado',
    name:'cbEstado',
    store : stcbEstado,
    triggerAction : 'all',
    mode : 'local',
    displayField : 'denom',
    valueField : 'idestado',
    hiddenName : 'idestado',
    editable:false,
    allowBlank:false,
    emptyText: labels.cbEstadoEmptyText,
    anchor:'90%'
});

fpRegla = new Ext.FormPanel({
    id:'idfpRegla',
    labelAlign : 'top',
    frame : true,
    border : true,
    height : 220,
    bodyStyle : 'padding:10px 5px 5px 10px',
    items: [{
            layout:'column',
            items:[{
                    columnWidth:.5,
                    layout: 'form',
                    items: [tfDenominacion]
		},{
                    columnWidth:.5,
                    layout: 'form',
                    items: [cbEstado]
		}]
	},heDescripcion]
});

winFormRegla = new Ext.Window({
    title:'',
    id:'idwinFormRegla',
    modal: true,
    closeAction:'hide',
    layout:'fit',
    width:450,
    height:300,
    closable:true,
    resizable:false,
    autoHeight: true,
    items:[fpRegla],
    buttons: [btnCancelarR,btnAceptarR]
});

numero = new Ext.form.FieldSet({
    id:'idfsNumero',
    title: 'N&uacute;meros',
    collapsible: false,
    autoHeight:true,
    autoWidth:true,
    //autoWidth: true,
    layout: 'table',
    layoutConfig: {
        columns: 4
    },
    defaults: {
        xtype:'button',
        width:35,
        height:30,
        margins:'5 5 5 5',
    },
    items: [
        {id: 'btn0', text: '<b>0</b>', handler:adicionarNumero.createCallback(0)},
        {id: 'btn1', text: '<b>1</b>', handler:adicionarNumero.createCallback(1)},
        {id: 'btn2', text: '<b>2</b>', handler:adicionarNumero.createCallback(2)},
        {id: 'btn3', text: '<b>3</b>', handler:adicionarNumero.createCallback(3)},
        {id: 'btn4', text: '<b>4</b>', handler:adicionarNumero.createCallback(4)},
        {id: 'btn5', text: '<b>5</b>', handler:adicionarNumero.createCallback(5)},
        {id: 'btn6', text: '<b>6</b>', handler:adicionarNumero.createCallback(6)},
        {id: 'btn7', text: '<b>7</b>', handler:adicionarNumero.createCallback(7)},
        {id: 'btn8', text: '<b>8</b>', handler:adicionarNumero.createCallback(8)},
        {id: 'btn9', text: '<b>9</b>', handler:adicionarNumero.createCallback(9)},
        {id: 'btnComa', text: '<b>.</b>', handler:adicionarNumero.createCallback('.')},
        btnLimpiarCelda
    ]
});
operador = new Ext.form.FieldSet({
    title: 'Operadores',
    collapsible: false,
    autoHeight:true,
    autoWidth:true,
    //autoWidth: true,
    layout: 'table',
    layoutConfig: {
        columns: 5
    },
    defaults: {
        xtype:'button',
        width:45,
        height:30,
        margins:'5 5 5 5',
    },
    items: [
        {id: 'btnSuma', text: '<b>+</b>', handler:adicionarOperador.createCallback('+')},
        {id: 'btnMult', text: '<b>*</b>', handler:adicionarOperador.createCallback('*')},
        {id: 'btnMayorq', text: '<b>></b>', handler:adicionarOperador.createCallback('>')},
        {id: 'btnMayorIgual', text: '<b>>=</b>', handler:adicionarOperador.createCallback('>=')},
        {id: 'btnAnd', text: '<b>Y</b>', handler:adicionarAndOr.createCallback('and')},
        //Segunda fila
        {id: 'btnResta', text: '<b>-</b>', handler:adicionarOperador.createCallback('-')},
        {id: 'btnDiv', text: '<b>/</b>', handler:adicionarOperador.createCallback('/')},
        {id: 'btnMenorq', text: '<b><</b>', handler:adicionarOperador.createCallback('<')},
        {id: 'btnMenorIgual', text: '<b><=</b>', handler:adicionarOperador.createCallback('<=')},
        {id: 'btnOr', text: '<b>O</b>', handler:adicionarAndOr.createCallback('or')},
        //Tercera fila
        {id: 'btnPabierto', text: '<b>(</b>', handler:function (){adicionarParentesis('PA');}},
        {id: 'btnPcerrado', text: '<b>)</b>', handler:function (){adicionarParentesis('PC');}},
        {id: 'btnIgual', text: '<b>=</b>', handler:adicionarOperador.createCallback('=')},
        {id: 'btnDistinto', text: '<b><></b>', handler:adicionarOperador.createCallback('<>')},
    ]
});
funciones = new Ext.form.FieldSet({
    title: 'Funciones',
    collapsible: false,
    autoHeight:true,
    autoWidth:true,
    layout: 'table',
    layoutConfig: {
        columns: 1
    },
    defaults: {
        xtype:'button',
        width:90,
        height:30,
        margins:'5 5 5 5',
    },
    items: [{id: 'btnSumatoria', text: '<b>Sumatoria</b>', handler: function(){getIndicadoresChk('_SUMA')}},
        {id: 'btnPromedio', text: '<b>Promedio</b>', handler: function(){getIndicadoresChk('_PROMEDIO')}}
    ]
});

//---------------------------------- Arbol Indicadores-------------------------------
cargadorIndicadores = new Ext.tree.TreeLoader({
    dataUrl: 'cargarIndicadores',
    preloadChildren :true,
    baseParams:{idplanilla:idPlanillaSeleccionada,idnodo:-1},
    listeners:{
        beforeload:function(cargadorIndicadores, node, response ){
            if(node.id == 'raizIndicador'){
                cargadorIndicadores.baseParams.idplanilla = idPlanillaSeleccionada;
                cargadorIndicadores.baseParams.idnodo = -1;
            }else{
                cargadorIndicadores.baseParams.idplanilla = idPlanillaSeleccionada;
                cargadorIndicadores.baseParams.idnodo = node.id;
            }
        },
        load:function(cargadorIndicadores, node, response ){node.expand(false,true);}
    }
});

treeIndicadores = new Ext.tree.TreePanel({
    id: 'idtreeIndicadores',
    title: labels.tptIndicadores,
    region:'center',
    split:true,
    height:350,
    rootVisible: false,
    autoScroll:true,
    minSize: 150,
    maxSize: 300,
    width: 250,
    layout:'fit',
    loader : cargadorIndicadores,
    listeners:{
        click:function(node, event){
            if(node.attributes.idescala != null){
                tipoIndicadorSeleccionado = node.attributes.tipo;
                //Mandar a cargar el store del grid escalas con las escalas asociadas al indicador seleccionado
                stEscala.removeAll();
                stEscala.load({params:{idindicador:node.id}});
                //-------------------------------
                if(smgpFormula.hasSelection()){
                    var selCel = smgpFormula.getSelectedCell();
                    var record = stgpFormula.getAt(selCel[0]);
                    var abrv = node.attributes.abreviatura;
                    if(selCel[1] == 2){
                        record.set('mizq',abrv);
                        record.set('tiporeferenciaMizq','1');
                        record.set('idMizq',node.attributes.idindicador);
                        record.set('valorMizq', "[i"+node.attributes.idindicador+"]");
                    }
                    else if(selCel[1] == 4){
                        record.set('mder',abrv);
                        record.set('tiporeferenciaMder','1');
                        record.set('idMder',node.attributes.idindicador);
                        record.set('valorMder', "[i"+node.attributes.idindicador+"]");
                    }
                }
            }
            else{ stEscala.removeAll(); }
        },
        dblclick: function(node, event){
            if(node.attributes.tipo == false){//verifico que sea un indicador de imagen
                SincronizarImagen(node.attributes.idindicador, node.text);//Verifico que exista la imagen como fichero para poder cargarla
            }

        },
    }
});
raizIndicador = new Ext.tree.AsyncTreeNode({
    text : 'raizIndicador',
    animate : false,
    draggable : false,
    expanded : true,
    id : 'raizIndicador'
});
treeIndicadores.setRootNode(raizIndicador);

//---- Arbol de indicadores con checkbox en cada nodo -----------
tlIndicdorChk = new Ext.tree.TreeLoader({
    dataUrl: 'cargarIndicadoresChk',
    preloadChildren :true,
    baseParams:{idplanilla:idPlanillaSeleccionada,idnodo:-1},
    listeners:{
        beforeload:function(cargadorIndicadores, node, response ){
            if(node.id == 'raizIndicador'){
                cargadorIndicadores.baseParams.idplanilla = idPlanillaSeleccionada;
                cargadorIndicadores.baseParams.idnodo = -1;
            }else{
                cargadorIndicadores.baseParams.idplanilla = idPlanillaSeleccionada;
                cargadorIndicadores.baseParams.idnodo = node.id;
            }
        },
        load:function(cargadorIndicadores, node, response ){node.expand(false,true);}
    }
});

tpIndicadoresChk = new Ext.tree.TreePanel({
    id: 'idtpIndicadoresChk',
    region:'center',
    split:true,
    height:390,
    rootVisible: true,
    autoScroll:true,
    minSize: 150,
    maxSize: 300,
    width: 380,
    layout:'fit',
    loader : tlIndicdorChk,
    listeners:{
        click:function(node, event){

        }
    }
});
rootIndicadorChk = new Ext.tree.AsyncTreeNode({
    text : 'Indicadores de rango numérico',
    animate : false,
    draggable : false,
    expanded : true,
    id : 'raizIndicador'
});
tpIndicadoresChk.setRootNode(rootIndicadorChk);

//-------------------------------------------------Arbol de Dominios--------------------------------------------------//

cargadorDominio = new Ext.tree.TreeLoader({
    dataUrl:'cargardominioEval',
    preloadChildren :true,
    baseParams:{iddominio:-1, idrecurso:-1},
    listeners:{
        beforeload:function(cargadorDominio, node, response ){
            if(node.id == 'raizDominio'){
                cargadorDominio.baseParams.iddominio = -1;
                cargadorDominio.baseParams.idrecurso = -1;
            }else{
                if(node.parentNode.id == 'raizDominio'){
                    cargadorDominio.baseParams.iddominio = -1;
                    cargadorDominio.baseParams.idrecurso = node.id;
                    recurso = node.id;
                }else{
                    cargadorDominio.baseParams.iddominio = node.id;
                    cargadorDominio.baseParams.idrecurso = recurso;
                }
            }
        },
        load:function(cargadorDominio, node, response ){node.expand(false,false);}
    }
});

tpDominio = new Ext.tree.TreePanel({
    id:'tpDominio',
    title: labels.lbgpDominios,
    //tbar: tbDominio,
    disabled:false,
    minSize: 400,
    region:'center',
    margins: '5 5 5 0',
    animate:true,
    border:true,
    containerScroll: true,
    rootVisible:false,
    width: 390,
    height: 400,
    layout:'fit',
    selModel: new Ext.tree.DefaultSelectionModel(),
    loader:cargadorDominio,
    autoScroll:true,
    listeners:{
        click:function(nodo, event){

        }
    }
});
raizDominio = new Ext.tree.TreeNode({
    text: 'Dominio',
    id:'raizDominio',
    allowDrag:false,
    allowDrop:false
});
tpDominio.setRootNode(raizDominio);
//---------------------------------------------------Fin del arbol--------------------------------------------------------//

//--------------------------------Grid de las reglas-----------------------
var expander = new Ext.grid.RowExpander({
    tpl : new Ext.Template(
    '<p><b>Descripci&oacute;n:</b> {descripcion}</p>',
    '<p><b>Expresi&oacute;n natural:</b> {expnatural}</p>'
)
});

stReglas = new Ext.data.Store({
    url: 'cargarReglas',
    listeners:{
        'beforeload':function(thisstore,objeto){
            objeto.params.idplanilla=idPlanillaSeleccionada
	}},
    reader:new Ext.data.JsonReader({
        totalProperty: "cantidad",
        root: "datos",
        id: "idregla"
    }, [
        {name: 'idregla', type: 'int'},
        {name: 'denom', type: 'string'},
        {name: 'descripcion', type: 'string'},
        {name: 'expnatural', type: 'string'},
        {name: 'estado'},
        {name: 'idplanilla'},
        {name: 'idestado'}
    ])
});

ptbReglas = new Ext.PagingToolbar({
    pageSize: 25,
    store: stReglas,
    displayInfo: true,
    displayMsg: labels.lDisplayMsg,
    emptyMsg: labels.lemptyMsg,
    items:[
        '-', {
            //pressed: true,
            //enableToggle:true,
            //text: 'Show Preview',
            //cls: 'x-btn-text-icon details',
            //toggleHandler: toggleDetails
	}]
});

// create the Grid
gpReglas = new Ext.grid.GridPanel({
    id:'idgpreglas',
    store: stReglas,
    columns: [expander,
        {id:'denominacion',header: 'Denominaci&oacute;n', width: 160, sortable: true, dataIndex: 'denom'},
        {header: 'Estado', width: 75, sortable: true, renderer: mostrarEstado, dataIndex: 'estado'},
    ],
    loadMask:{msg :labels.lbGridLoadMask},
    plugins: expander,
    stripeRows: true,
    autoExpandColumn: 'denominacion',
    split:true,
    height: 230,
    region:'north',
    title:'Listado de reglas',
    tbar:[{id:'idmenuModificarRegla', text: 'Modificar',iconCls:'modificar',tooltip:labels.ttpModificarRegla,disabled:true,
            text:labels.lbtnModificar, menu:[btnModificarDatosRegla,btnModificarExpRegla]},'-',btnEliminarRegla,'-',btnAyudaTP],
    bbar:ptbReglas,
    sm: new Ext.grid.RowSelectionModel({
        singleSelect:true,
        listeners: {
            rowselect : function (selectionModel,rowIndex, selectedRecord){
                Ext.getCmp('idmenuModificarRegla').enable();
                btnEliminarRegla.enable();
            }
        }
    }),
    listeners: {
        rowclick : function (grid, rowIndex, event){
            if(smgpFormula.hasSelection()){
                var selCel = smgpFormula.getSelectedCell();
                var record = stgpFormula.getAt(selCel[0]);
                var recordRegla = stReglas.getAt(rowIndex);
                if(selCel[1] == 2){
                    record.set('mizq',recordRegla.get('denom'));
                    record.set('valorMizq', "[r"+recordRegla.get('idregla')+"]");
                }
                else if(selCel[1] == 4){
                    record.set('mder',recordRegla.get('denom'));
                    record.set('valorMder', "[r"+recordRegla.get('idregla')+"]");
                }
            }
        }
    }
});
//--------------------------------Fin del grid de las reglas---------------

myRecordFormula = new Ext.data.Record.create({name: 'funcion'},{name: 'pa'},{name: 'mizq'},{name: 'operador'},{name: 'mder'},{name: 'pc'});
// create the data store
stgpFormula = new Ext.data.SimpleStore({
    fields: [
        {name: 'tiporeferenciafuncion'},
        {name: 'funcion'},// 'AND' - 'OR';
        {name: 'tiporeferenciaPA'},
        {name: 'pa'},
        {name: 'tiporeferenciaMizq'},
        {name: 'idMizq'},
        {name: 'valorMizq'},
        {name: 'mizq'},
        {name: 'tiporeferenciaOperador'},
        {name: 'operador'},
        {name: 'tiporeferenciaMder'},
        {name: 'idMder'},
        {name: 'valorMder'},
        {name: 'mder'},
        {name: 'tiporeferenciaPC'},
        {name: 'pc'}
    ]
});
smgpFormula = new Ext.grid.CellSelectionModel({
    id:'idsmgpFormula',
    singleSelect : true,
    listeners: {
        cellselect : function (selModel, rowIndex, colIndex ){
            btnDelFilaFormula.enable();
            btnLimpiarFormula.enable();
            btnGuardarFormula.enable();
            btnValidarFormula.enable();
            btnSubirfila.enable();
            btnBajarfila.enable();
            if(rowIndex == 0){
                btnSubirfila.disable();
            }
            else if(rowIndex+1 == stgpFormula.getCount()){
                btnBajarfila.setDisabled(true);
            }
            if(stgpFormula.getCount() == 1){
                btnBajarfila.setDisabled(true);
            }
        },
    }
});
cmgpFormula = new Ext.grid.ColumnModel({
    columns: [
        {id:'funcion',header: "", width: 85, dataIndex: 'funcion',menuDisabled:true},
        {header: "PA", width: 45, dataIndex: 'pa',menuDisabled:true,	},
        {header: "Operando", width: 115, dataIndex: 'mizq',menuDisabled:true,	},
        {header: "Operador", width: 60, dataIndex: 'operador',menuDisabled:true,	},
        {header: "Operando", width: 115, dataIndex: 'mder',menuDisabled:true,	},
        {header: "PC", width: 45, dataIndex: 'pc',menuDisabled:true,	}
    ],
    defaults: {
        sortable: false,
    }
});
// create the Grid
gpFormula = new Ext.grid.GridPanel({
    title:labels.lbtitgpFormula,
    store: stgpFormula,
    tbar: [btnAddFilaFormula,'-',btnDelFilaFormula,'-',btnLimpiarFormula,'-',btnValidarFormula,'-',btnGuardarFormula,'->',btnSubirfila,btnBajarfila,'-'],
    cm: cmgpFormula,
    sm: smgpFormula,
    stripeRows: true,
    split:true,
    listeners: {
        celldblclick : function(grid, rowIndex, columnIndex, event){
            var record = stgpFormula.getAt(rowIndex);
            if(columnIndex == 1){
                if(record.get('pa') == ""){ record.set('pa', '('); record.set('tiporeferenciaPA', '4');}
                else { record.set('pa', ''); record.set('tiporeferenciaPA', ''); }
            }
            else if(columnIndex == 5){
                if(record.get('pc') == ""){ record.set('pc', ')'); record.set('tiporeferenciaPC', '4');}
                else{ record.set('pc', ''); record.set('tiporeferenciaPC', ''); }
            }
        }
    }
});

pPreview = new Ext.Panel({
    id:'idpVistaPrevia',
    title: labels.lbtitpVistaPrevia,
    layout:'fit',
    disabled:true,
    listeners:{
        activate : function ( panel ){
            vistaPrevia();
        }
    }
});

tpFormula = new Ext.TabPanel({
    id:'idtpformula',
    region:'center',
    activeTab: 0,
    frame:true,
    items:[gpFormula,pPreview],
});

//--------------------------------Panel de Operaciones-----------------------------------
pOperaciones = new Ext.Panel({
    title: 'Operaciones',
    margins:'5 0 0 0',
    //height: 180,
    split:false,
    disabled:true,
    region: 'center',
    layout: 'table',
    frame:true,
    items: [{
            layout:'column',
            items:[{
                    items: [numero]
                },{
                    items: [{
                            xtype:'',
                            width:5,
                            height:63
                        }]
                },{
                    items: [operador]
                },{
                    items: [{
                            xtype:'',
                            width:5,
                            height:63
                        }]
                },{
                    items: [funciones]
                }]
	}]
});
//--------------------------------Fin del panel de Operaciones-----------------------------------
pcontenedor = new Ext.Panel({
    id:'pcontenedor',
    region: 'east',
    margins:'5 5 5 0',
    disabled:true,
    border:false,
    width: 500,
    layout:'border',
    defaults: {
        collapsible: false,
    },
    items:[{
            region:'center',
            border:false,
            layout:'border',
            defaults: {
                collapsible: false,
            },
            items:[gpReglas,tpFormula,/*pformula*/
		{
                    region:'south',
                    border:false,
                    layout:'border',
                    height:140,
                    items:[pOperaciones]
		}]
        }]
});

//-----------------------Grid de planillas---------------------//
stPlanillas = new Ext.data.Store({
    url: 'cargarPlanillas',
    listeners:{'beforeload':function(thisstore,objeto){
            objeto.params.iddominioevaluativo=iddominioevaluativo,
            objeto.params.texto=textoBuscar
	}},
    reader:new Ext.data.JsonReader({
        totalProperty: "cantidad",
        root: "datos",
        id: "idplanilla"
    }, [{name: 'idplanilla'},
        {name: 'codigo'},
        {name: 'denom'},
        {name: 'descripcion'},
        {name: 'iddominioevaluativo'},
        {name: 'idestado'},
    ])
});
stPlanillas.load({params:{limit:15, start:0}});

ptbPlanillas = new Ext.PagingToolbar({
    pageSize: 15,
    store: stPlanillas,
    displayMsg: labels.lDisplayMsg,
    emptyMsg: labels.lemptyMsg,
});

gpPlanillas = new Ext.grid.GridPanel({
    id:'idecuaciones',
    tbar:[tfFiltro,btnBuscarPlanilla,'-',btnFiltrar],
    store: stPlanillas,
    columns: [
        {header: "C&oacute;digo", width: 60, sortable: true, dataIndex: 'codigo'},
        {id:'expandir',header: "Denominaci&oacute;n", sortable: true, dataIndex: 'denom'},
    ],
    loadMask:{msg :labels.lbGridLoadMask},
    stripeRows: true,
    autoExpandColumn: 'expandir',
    autoHeight: 260,
    border:false,
    region:'center',
    sm: new Ext.grid.RowSelectionModel({singleSelect : true}),
    listeners: {
        rowclick: function(grid, rowIndex, event) {
            if(pcontenedor.disabled)
                pcontenedor.setDisabled(false);
            if(Ext.getCmp('idpcentral').disabled)
                Ext.getCmp('idpcentral').setDisabled(false);
            stReglas.removeAll();
            idPlanillaSeleccionada = grid.getSelectionModel().getSelected().get('idplanilla');
            stReglas.load({params:{start:0,limit:15}});
            stgpFormula.removeAll();
            stEscala.removeAll();
            treeIndicadores.getRootNode().reload();
            Ext.getCmp('idmenuModificarRegla').disable();
            btnEliminarRegla.disable();
        }
    }
});
//-----------------------Fin del grid de planillas--------------//
//----------------------  Grid Escalas -----------------------//
stEscala = new Ext.data.Store({
    url: 'cargarEscala',
    reader:new Ext.data.JsonReader({
        totalProperty: "cantidad",
        root: "datos",
        id: "idregla"
    }, [
        {name: 'idescala', type: 'string'},
        {name: 'denom', type: 'string'},
        {name: 'descripcion', type: 'string'},
        {name: 'tipoescala', type: 'string'}
    ])
});

gpEscala = new Ext.grid.GridPanel({
    id:'idgpescala',
    store: stEscala,
    title:labels.lbtitgpEscala,
    columns: [
        {id:'denominacion',header: "Denominaci&oacute;n",renderer: representarImagen, sortable:false, width: 220, menuDisabled:true, dataIndex: 'denom'},
    ],
    loadMask:{msg :labels.lbGridLoadMask},
    stripeRows: true,
    height: 240,
    split:true,
    region:'south',
    sm: new Ext.grid.RowSelectionModel({
        singleSelect : true,
    }),
    listeners: {
        rowclick : function (grid, rowIndex, event){
            if(smgpFormula.hasSelection()){
                var selCel = smgpFormula.getSelectedCell();
                var record = stgpFormula.getAt(selCel[0]);
                var recordEscala = stEscala.getAt(rowIndex);
                if(selCel[1] == 2){
                    record.set('mizq',recordEscala.get('denom'));
                    record.set('tiporeferenciaMizq', '3');
                    record.set('idMizq', recordEscala.get('idescala'));
                    record.set('valorMizq', "[e"+recordEscala.get('tipoescala')+"-"+recordEscala.get('idescala')+"]");
                }
                else if(selCel[1] == 4){
                    record.set('mder',recordEscala.get('denom'));
                    record.set('tiporeferenciaMder', '3');
                    record.set('idMder', recordEscala.get('idescala'));
                    record.set('valorMder', "[e"+recordEscala.get('tipoescala')+"-"+recordEscala.get('idescala')+"]");
                }
            }
        }
    }
});
//----- Fin del grid panel escala ---//

pIzquierdo = new Ext.Panel({
    region:'west',
    id:'west-panel',
    title: labels.lbPlanillas,
    split:true,
    width: 270,
    minSize: 185,
    maxSize: 285,
    collapsible: true,
    margins:'5 0 5 5',
    cmargins: '5 5 5 5',
    layout:'fit',
    layoutConfig:{
        animate:true
    },
    items:[gpPlanillas],
    bbar: ptbPlanillas,
});

vpReglas = new Ext.Viewport({
    layout:'border',
    items:[pIzquierdo,{
            region:'center', margins:'5 5 5 0', id:'idpcentral',
            layout:'border', border:false,
            items:[treeIndicadores,gpEscala]
        },
        pcontenedor]
});

function AddModRegla(accion){
    if(fpRegla.getForm().isValid()){
        if(accion == 'Add'){
            var mskAux = new Ext.LoadMask(Ext.getBody(), {msg:labels.lbMsgWaitSend});
            mskAux.show();
            Ext.Ajax.request({
                url: 'adicionarRegla',
                method:'POST',
                params: {
                    denom : tfDenominacion.getValue(),
                    descripcion: heDescripcion.getValue(),
                    infija: getExpInFija(),
                    idestado: cbEstado.getValue(),
                    idplanilla: idPlanillaSeleccionada,
                    expEnArreglo: Ext.encode(getExpresionEnArreglo()),
                    arrPropElemt: Ext.encode(getPropiedadesElementosExpresion())
                },
                failure: function (){
                    mskAux.hide();
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: "No hay conexi&oacute;n al servidor",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                },
                callback: function (options, success, response)
                {
                    if(success){
                        mskAux.hide();
                        var datos = Ext.util.JSON.decode(response.responseText);
                        if(datos.codMsg != 3){ //caso en el que halla habido un error de sintaxis en la expresión.
                            stgpFormula.removeAll();
                            btnDelFilaFormula.setDisabled(true);btnLimpiarFormula.setDisabled(true);btnGuardarFormula.setDisabled(true);btnValidarFormula.setDisabled(true);
                            btnSubirfila.setDisabled(true);btnBajarfila.setDisabled(true);btnLimpiarCelda.setDisabled(true);
                            pOperaciones.setDisabled(true);	pPreview.setDisabled(true);
                            stReglas.reload({params:{start:0,limit:15}});
                        }
                        winFormRegla.hide();
                    }
                    else{
                        mskAux.hide();
                        Ext.MessageBox.show({
                            title:'Error',
                            msg: 'Error al recibir los datos del servidor.',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            });
        }else{
            var recordRegla = gpReglas.getSelectionModel().getSelected();
            var mskAux = new Ext.LoadMask(Ext.getBody(), {msg:labels.lbMsgWaitSend});
            mskAux.show();
            Ext.Ajax.request({
                url: 'actualizarRegla',
                method:'POST',
                params: {
                    denom : tfDenominacion.getValue(),
                    descripcion: heDescripcion.getValue(),
                    idestado: cbEstado.getValue(),
                    idregla: recordRegla.get('idregla'),
                    idplanilla: idPlanillaSeleccionada
                },
                failure: function (){
                    mskAux.hide();
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: "No hay conexi&oacute;n al servidor",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                },
                callback: function (options, success, response)
                {
                    if(success){
                        mskAux.hide();
                        var datos = Ext.util.JSON.decode(response.responseText);
                        winFormRegla.hide();
                        stgpFormula.removeAll();
                        stReglas.reload({params:{start:0,limit:15}});
                    }
                    else{
                        mskAux.hide();
                        Ext.MessageBox.show({
                            title:'Error',
                            msg: 'Error al recibir los datos del servidor.',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            });
        }
    }//fin de isValid()
}

}//Fin función cargarInterfaz()

function showWinFormRegla(option){
fpRegla.getForm().reset();
if(option == 'Ins'){
    winFormRegla.setTitle(labels.lbTitWinAddRegla);
    varAccion = "Add";
}
else if("Mod"){
    varAccion = "Mod";
    winFormRegla.setTitle(labels.lbTitWinModRegla);
    tfDenominacion.setValue(gpReglas.getSelectionModel().getSelected().get('denom'));
    heDescripcion.setValue(gpReglas.getSelectionModel().getSelected().get('descripcion'));
    cbEstado.setValue(gpReglas.getSelectionModel().getSelected().get('idestado'));
}
winFormRegla.show();
}

//Función para mostrar los mensajes de error o de  en el panel de información
function mostrarMsg(mensaje, tipo){
if(tipo == "error"){
    //el.body.update(msg);
    Ext.MessageBox.show({
        title: 'Error',
        msg: mensaje,
        buttons: Ext.MessageBox.OK,
        icon: Ext.MessageBox.ERROR
    });
}

}

//Función para mostrar el estado en diferentes colores
function mostrarEstado(val){
if(val == "Inactivo"){
    return '<span style="color:red;">' + val + '</span>';
}else if(val == "Activo"){
    return '<span style="color:green;">' + val + '</span>';
}
else if(val == "Elaboración"){
    return '<span style="color:blue;">' + val + '</span>';
}
return val;
}

function eliminarRegla(){
Ext.MessageBox.confirm(labels.lbTitConfirm, labels.lbMsgConfirm, function(btn){
    if (btn == 'yes'){
        var mskAux = new Ext.LoadMask(Ext.getBody(), {msg:labels.lbMsgWaitSend});
        mskAux.show();
        Ext.Ajax.request({
            url: 'eliminarRegla',
            method:'POST',
            params: {idregla: gpReglas.getSelectionModel().getSelected().get('idregla')},
            callback: function (options,success,response){
                mskAux.hide();
                var datos = Ext.util.JSON.decode(response.responseText);
                stReglas.reload({params:{start:0,limit:15}});
                gpReglas.getSelectionModel().selectFirstRow();
            }
        });//ajax
    }
});
}

function filtrarPlanillas(){
pcontenedor.setDisabled(false);
pOperaciones.setDisabled(false);
if (!winFiltrarPlanillas){
    winFiltrarPlanillas = new Ext.Window({
        title:labels.wtFiltrarPlanillas,
        layout:'fit',
        modal:true,
        closable:true,
        resizable:false,
        closeAction: 'hide',
        modal: true,
        autoHeight: true,
        items:[tpDominio],
        listeners:{show: function(panel){recurso = -1; cargadorDominio.load(raizDominio);}},
        buttons: [{
                id:'idbtncancelarfiltro',
                iconCls:'cancelar',
                text:labels.lbtnCancelar,
                handler: function(){
                    winFiltrarPlanillas.hide();
                    pcontenedor.setDisabled(true);
                    pOperaciones.setDisabled(true);
                }
            },{
                id:'idbtnfiltrarplanillas',
                iconCls:'aceptar',
                text:labels.lbtnAceptar,
                handler: function(){
                    pcontenedor.setDisabled(true);
                    pOperaciones.setDisabled(true);
                    var node = tpDominio.getSelectionModel().getSelectedNode();
                    stPlanillas.removeAll();
                    iddominioevaluativo = node.id;
                    textoBuscar = null;
                    stPlanillas.load({params:{start:0,limit:15}});
                    winFiltrarPlanillas.hide();
                }
            }]
    });
}
winFiltrarPlanillas.show();
}

function getIndicadoresChk(tipoAccion){
//if (!winIndicadoresChk){
winIndicadoresChk = new Ext.Window({
    title:labels.wtSelect,
    layout:'fit',
    modal:true,
    closable:true,
    resizable:false,
    closeAction: 'hide',
    modal: true,
    autoHeight: true,
    items:[tpIndicadoresChk],
    //listeners:{show: function(panel){recurso = -1; cargadorDominio.load(raizDominio);}},
    buttons: [{
            id:'idbtncancelar',
            iconCls:'cancelar',
            text:labels.lbtnCancelar,
            handler: function(){
                winIndicadoresChk.hide();
            }
        },{
            id:'idbtnaceptar',
            iconCls:'aceptar',
            text:labels.lbtnAceptar,
            handler: function(){ agregarFuncion(tipoAccion) }
        }]
});
//}
winIndicadoresChk.show();
}

function agregarFuncion(tipoAccion){
var arrNodos = tpIndicadoresChk.getChecked();
if(arrNodos.length < 2){ alert("Debe seleccionar más de un elemento."); return false; }
var selCel = smgpFormula.getSelectedCell();
var record = stgpFormula.getAt(selCel[0]);
var bandera = true;
if(record.get('funcion') != "" || record.get('pa') != "" || record.get('mizq') != "" || record.get('operador') != "" || record.get('mder') != "" || record.get('pc') != ""){
    bandera = false;
}
if(!bandera){ //Adiciono una nueva fila en caso de que la fila seleccionada este en uso.
    adicionarFilaFormula();
    selCel = smgpFormula.getSelectedCell();
    record = stgpFormula.getAt(selCel[0]);
}
record.set('funcion', tipoAccion);
record.set('pa', '(');
for(var i=0; i<arrNodos.length; i++){
    if(i%2 == 0){
        record.set('mizq', arrNodos[i].attributes.abreviatura);
        record.set('tiporeferenciaMizq','1');
        record.set('idMizq',arrNodos[i].attributes.idindicador);
        record.set('valorMizq', "[i"+arrNodos[i].attributes.idindicador+"]");
    }
    else{
        record.set('operador', ',');//REVISAR LA COMA !!!!!!
        record.set('mder', arrNodos[i].attributes.abreviatura);
        record.set('tiporeferenciaMder','1');
        record.set('idMder',arrNodos[i].attributes.idindicador);
        record.set('valorMder', "[i"+arrNodos[i].attributes.idindicador+"]");
    }
    if(i%2 ==1 && i+1<arrNodos.length){
        record.set('pc', ','); //Pongo una coma de mas en el campo del parentesis cerrado para cuando sean mas de dos elementos.
        adicionarFilaFormula();
    }
    selCel = smgpFormula.getSelectedCell();
    record = stgpFormula.getAt(selCel[0]);
}
record.set('pc', ')');
winIndicadoresChk.hide();
}

function eliminarFilaFormula(){
if(smgpFormula.hasSelection()){
    var selCel = smgpFormula.getSelectedCell();
    stgpFormula.remove(stgpFormula.getAt(selCel[0]));
    btnSubirfila.setDisabled(true);
    btnBajarfila.setDisabled(true);
    gpFormula.doLayout();
}else{
    Ext.MessageBox.show({
        title: 'Alerta', msg: 'Debe seleccionar una fila',
        buttons: Ext.MessageBox.OK,icon: Ext.MessageBox.INFO
    });
}
if(stgpFormula.getCount() == 0){
    btnDelFilaFormula.setDisabled(true);
    btnLimpiarFormula.setDisabled(true);
    btnGuardarFormula.setDisabled(true);
    btnValidarFormula.setDisabled(true);
    pOperaciones.setDisabled(true);
    pPreview.setDisabled(true);
    btnLimpiarCelda.setDisabled(true);
}
}

function adicionarFilaFormula(){
var newRecord = new myRecordFormula({
    tiporeferenciafuncion: '',
    funcion: '',
    tiporeferenciaPA: '',
    pa: '',
    tiporeferenciaMizq: '',
    idMizq: '',
    mizq: '',
    tiporeferenciaOperador: '',
    operador: '',
    tiporeferenciaMder: '',
    idMder: '',
    mder: '',
    tiporeferenciaPC: '',
    pc: '',
});
pOperaciones.setDisabled(false);
pPreview.setDisabled(false);
btnLimpiarCelda.setDisabled(false);
stgpFormula.add(newRecord);
gpFormula.doLayout();
smgpFormula.select(stgpFormula.getCount()-1, 0);//Para seleccionar la primera celda de  la fila que se adicionó
}

function buscarPlanillas(){
stPlanillas.removeAll();
textoBuscar = tfFiltro.getValue();
iddominioevaluativo = null;
stPlanillas.load({params:{start:0,limit:15}});
}

function modificarExpRegla(){
var mskCargarExpresion = new Ext.LoadMask(Ext.getBody(), {msg:labels.lbmskCargarExpresion});
mskCargarExpresion.show();
Ext.Ajax.request({
    url: 'cargarExpresionRegla',
    method:'POST',
    params: {
        idregla: gpReglas.getSelectionModel().getSelected().get('idregla')
    },
    failure: function (){
        Ext.MessageBox.show({
            title: 'Error',	msg: "No hay conexi&oacute;n al servidor",
            buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.ERROR
        });
    },
    callback: function (options, success, response)
    {
        if(success){
            mskCargarExpresion.hide();
            stgpFormula.removeAll();
            var datos = Ext.decode(response.responseText);
            for(var i=0; i < datos.propiedades.length; i++){
                var newRecord = new myRecordFormula({
                    tiporeferenciafuncion: datos.propiedades[i][0][0],
                    funcion: datos.propiedades[i][0][2],
                    tiporeferenciaPA: datos.propiedades[i][1][0],
                    pa: datos.propiedades[i][1][2],
                    tiporeferenciaMizq: datos.propiedades[i][2][0],
                    idMizq: datos.propiedades[i][2][1],
                    valorMizq: datos.exparreglo[i][2],
                    mizq: datos.propiedades[i][2][2],
                    tiporeferenciaOperador: datos.propiedades[i][3][0],
                    operador: datos.propiedades[i][3][2],
                    tiporeferenciaMder: datos.propiedades[i][4][0],
                    idMder: datos.propiedades[i][4][1],
                    valorMder: datos.exparreglo[i][4],
                    mder: datos.propiedades[i][4][2],
                    tiporeferenciaPC: datos.propiedades[i][5][0],
                    pc: datos.propiedades[i][5][2],
                });
                stgpFormula.add(newRecord);
            }
            pOperaciones.setDisabled(false);
            pPreview.setDisabled(false);
            btnLimpiarCelda.setDisabled(false);
            smgpFormula.select(stgpFormula.getCount()-1, 0);//Para seleccionar la primera celda de  la fila que se adicionó.
            banderaModExpresion = true; //Variable para saber si lo que quiero es modificar una expresión o adicionar una nueva regla.
            var recordRegla = gpReglas.getSelectionModel().getSelected();
            idReglaAModificar = recordRegla.get('idregla');
        }
        else{
            Ext.MessageBox.show({
                title:'Error',msg: 'Error al recibir los datos del servidor.',
                buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.ERROR
            });
        }
    }
});
}

function limpiarFormula(){
stgpFormula.removeAll();
btnDelFilaFormula.setDisabled(true);btnLimpiarFormula.setDisabled(true);btnGuardarFormula.setDisabled(true);btnValidarFormula.setDisabled(true);
btnSubirfila.setDisabled(true);btnBajarfila.setDisabled(true);btnLimpiarCelda.setDisabled(true);
pOperaciones.setDisabled(true);	pPreview.setDisabled(true);
}

function limpiarCelda(){
var selCel = smgpFormula.getSelectedCell();
var record = stgpFormula.getAt(selCel[0]);
switch (selCel[1]){
    case 0:{
            record.set('funcion', ''); break;
        }
    case 1:{
            record.set('pa', '');
            record.set('tiporeferenciaPA', ''); break;
        }
    case 2:{
            record.set('mizq', '');
            record.set('tiporeferenciaMizq', '');
            record.set('idMizq', ''); break;
            record.set('valorMizq', ''); break;
        }
    case 3:{
            record.set('operador', '');
            record.set('tiporeferenciaOperador', ''); break;
        }
    case 4:{
            record.set('mder', '');
            record.set('tiporeferenciaMder', '');
            record.set('idMder', ''); break;
            record.set('valorMder', ''); break;
        }
    case 5:{
            record.set('pc', '');
            record.set('tiporeferenciaPC', ''); break;
        }
}
record.set(selCel[1], '');
}

function adicionarParentesis(tipo){
var selCel = smgpFormula.getSelectedCell();
var record = stgpFormula.getAt(selCel[0]);
if(selCel[1]==1 && tipo == "PA"){ //Para saber si selecciono la celda de parentesis abierto
    record.set('pa', '(');
    record.set('tiporeferenciaPA', '4');
}
else if(selCel[1]==5 && tipo == "PC"){ //Para saber si selecciono la celda de parentesis cerrado
    record.set('pc', ')');
    record.set('tiporeferenciaPC', '4');
}
}

function adicionarAndOr(oper){
var selCel = smgpFormula.getSelectedCell();
var record = stgpFormula.getAt(selCel[0]);
if(selCel[1]==0 && selCel[0]!=0){ //Para saber si selecciono la celda de parentesis abierto
    record.set('funcion', oper);
    record.set('tiporeferenciafuncion', '4');
}
}

function adicionarNumero(varNumero){
var selCel = smgpFormula.getSelectedCell();
var record = stgpFormula.getAt(selCel[0]);
var valor = null;
if(selCel[1]==2){ //para el miembro izquierdo
    valor = record.get('mizq');
    if(isNaN(valor)){
        Ext.MessageBox.show({
            title: 'Alerta', msg: 'No es un número.',
            buttons: Ext.MessageBox.OK,icon: Ext.MessageBox.INFO
        });
    }else{
        var aux = valor+""+varNumero;
        if(isNaN(aux)){
            Ext.MessageBox.show({
                title: 'Alerta', msg: 'No es un número.',
                buttons: Ext.MessageBox.OK,icon: Ext.MessageBox.INFO
            });
        }
        else{
            record.set('mizq', aux);
            record.set('valorMizq', aux);
            record.set('tiporeferenciaMizq','5');
        }
    }
}
else if(selCel[1]==4){ //para el miembro izquierdo
    valor = record.get('mder');
    if(isNaN(valor)){
        alert("No es un número");
    }else{
        var aux = valor+""+varNumero;
        if(isNaN(aux)){
            Ext.MessageBox.show({
                title: 'Alerta', msg: 'No es un número.',
                buttons: Ext.MessageBox.OK,icon: Ext.MessageBox.INFO
            });
        }
        else{
            record.set('mder', aux);
            record.set('valorMder', aux);
            record.set('tiporeferenciaMder','5');
        }
    }
}
}

function adicionarOperador(oper){
var selCel = smgpFormula.getSelectedCell();
var record = stgpFormula.getAt(selCel[0]);
if(selCel[1] == 3){ //Verifico que se halla seleccionado la celda de los operadores
    record.set('operador',oper);
    record.set('tiporeferenciaOperador','4');
}
}

function vistaPrevia(){
var record = null;
var expInFija = getExpInFija();
pPreview.body.update(expInFija);
pPreview.body.highlight();
}

function getExpInFija(){
var expInFija = "";
for(var i=0; i< stgpFormula.getCount(); i++){
    record = stgpFormula.getAt(i);
    expInFija += record.get('funcion')+" "+record.get('pa')+""+record.get('mizq')+record.get('operador')+record.get('mder')+record.get('pc')+" ";
}
return expInFija;
}

function getExpresionEnArreglo(){
var arrExpresion = new Array();
for(var i=0; i<stgpFormula.getCount(); i++){
    record = stgpFormula.getAt(i);
    arrExpresion[i] = new Array(record.get('funcion'), record.get('pa'), record.get('valorMizq'), record.get('operador'), record.get('valorMder'), record.get('pc'));
}
return arrExpresion;
}

function getPropiedadesElementosExpresion(){
var arrPropiedadesExp = new Array();
for(var i=0; i<stgpFormula.getCount(); i++){
    record = stgpFormula.getAt(i);
    var propiedadesFuncion = new Array(record.get('tiporeferenciafuncion'), -1, record.get('funcion'));
    var propiedadesPA = new Array(record.get('tiporeferenciaPA'), -1, record.get('pa'));
    var propiedadesMizq = new Array(record.get('tiporeferenciaMizq'), record.get('idMizq'), record.get('mizq'));
    var propiedadesOperador = new Array(record.get('tiporeferenciaOperador'), -1, record.get('operador'));
    var propiedadesMder = new Array(record.get('tiporeferenciaMder'), record.get('idMder'), record.get('mder'));
    var propiedadesPC = new Array(record.get('tiporeferenciaPC'), -1, record.get('pc'));
    arrPropiedadesExp[i] = new Array(propiedadesFuncion,propiedadesPA, propiedadesMizq, propiedadesOperador, propiedadesMder, propiedadesPC);
}
return arrPropiedadesExp;
}

function moverFilaArriba(){
var selCel = smgpFormula.getSelectedCell();
var recordSeleccionado = stgpFormula.getAt(selCel[0]);
var recordAux = recordSeleccionado;
stgpFormula.remove(recordSeleccionado);
stgpFormula.insert(selCel[0]-1, recordAux);
smgpFormula.select(selCel[0]-1, selCel[1]);//Seleciono la primera celda de la fila que moví
}

function moverFilaAbajo(){
var selCel = smgpFormula.getSelectedCell();
var recordSeleccionado = stgpFormula.getAt(selCel[0]);
var recordAux = recordSeleccionado;
stgpFormula.remove(recordSeleccionado);
stgpFormula.insert(selCel[0]+1, recordAux);
smgpFormula.select(selCel[0]+1, selCel[1]);//Mantengo la misma celda seleccionada
}

function representarImagen(nombreArchivo){
if(tipoIndicadorSeleccionado == false){ //caso en que el indicador sea de tipo imagen
    return "<img src=../../nomvalimgs/"+nombreArchivo+" width='60' height='60' />";
}else{
    return nombreArchivo
}
}

function SincronizarImagen(idIndicadorImg, nombreImagen){
Ext.Ajax.request({
    url: 'sincronizarImagen',
    method:'POST',
    params: {
        idIndicadorImagen: idIndicadorImg,
    },
    failure: function (){
        Ext.MessageBox.show({
            title: 'Error',
            msg: "No hay conexi&oacute;n al servidor",
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    },
    callback: function (options, success, response)
    {
        if(success){
            var nombreArchivo = Ext.util.JSON.decode(response.responseText);
            if (winIndImagen){	winIndImagen.close(); }
            winIndImagen = new Ext.Window({
                title: nombreImagen,
                layout:'fit',
                //modal:true,
                closable:true,
                resizable:false,
                closeAction: 'hide',
                html: "<img src= '../../nomvalindimgs/"+nombreArchivo+"' />",
                autoHeight: true,
            });
            winIndImagen.show();
        }
        else{
            Ext.MessageBox.show({
                title:'Error',
                msg: 'Ocurrió un error inesperado.',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    }
});
}

function validarExpresion(){
var primerRecord = stgpFormula.getAt(0);
if(primerRecord.get('mizq') == "" || primerRecord.get('operador') == "" || primerRecord.get('mder') == ""){
    Ext.MessageBox.show({
        title:'Alerta', msg: 'Debe elaborar una ecuación válida.',
        buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.WARNING
    });
}
else{
    var mskValidarExpresion = new Ext.LoadMask(Ext.getBody(), {msg:labels.lbPanelLoadMask});
    mskValidarExpresion.show();
    Ext.Ajax.request({
        url: 'validarExpresion',
        method:'POST',
        params: {
            expInFija: getExpInFija(),
            expEnArreglo: Ext.encode(getExpresionEnArreglo()),
            arrPropElemt: Ext.encode(getPropiedadesElementosExpresion())
        },
        failure: function (){
            Ext.MessageBox.show({
                title: 'Error',	msg: "No hay conexi&oacute;n al servidor",
                buttons: Ext.MessageBox.OK,	icon: Ext.MessageBox.ERROR
            });
        },
        callback: function (options, success, response)
        {
            if(success){
                mskValidarExpresion.hide();
                var datos = Ext.util.JSON.decode(response.responseText);
            }
            else{
                Ext.MessageBox.show({
                    title:'Error', msg: 'Error al recibir los datos del servidor.',
                    buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.ERROR
                });
            }
        }
    });
}
}

function guardarRegla(){
var primerRecord = stgpFormula.getAt(0);
if(primerRecord.get('mizq') == "" || primerRecord.get('operador') == "" || primerRecord.get('mder') == ""){
    Ext.MessageBox.show({
        title:'Alerta', msg: 'Debe elaborar una ecuación válida.',
        buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.WARNING
    });
}
else{
    if(banderaModExpresion == false){ //pregunto por la variable 'banderaModExpresion' para saber si deseo insertar o modificar una regla.
        showWinFormRegla('Ins');
    }
    else{
        banderaModExpresion = false;
        var mskAux = new Ext.LoadMask(Ext.getBody(), {msg:labels.lbMsgWaitSend});
        mskAux.show();
        Ext.Ajax.request({
            url: 'modificarExpresionRegla',
            method:'POST',
            params: {
                infija: getExpInFija(),
                idregla: idReglaAModificar,
                idplanilla: idPlanillaSeleccionada,
                expEnArreglo: Ext.encode(getExpresionEnArreglo()),
                arrPropElemt: Ext.encode(getPropiedadesElementosExpresion())
            },
            failure: function (){
                mskAux.hide();
                Ext.MessageBox.show({
                    title: 'Error',
                    msg: "No hay conexi&oacute;n al servidor",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            },
            callback: function (options, success, response)
            {
                if(success){
                    mskAux.hide();
                    var datos = Ext.util.JSON.decode(response.responseText);
                    if(datos.codMsg != 3){ //caso en el que halla habido un error de sintaxis en la expresión.
                        stgpFormula.removeAll();
                        btnDelFilaFormula.setDisabled(true);btnLimpiarFormula.setDisabled(true);btnGuardarFormula.setDisabled(true);btnValidarFormula.setDisabled(true);
                        btnSubirfila.setDisabled(true);btnBajarfila.setDisabled(true);btnLimpiarCelda.setDisabled(true);
                        pOperaciones.setDisabled(true);	pPreview.setDisabled(true);
                    }
                    stReglas.reload({params:{start:0,limit:15}});
                    gpReglas.doLayout();
                }
                else{
                    mskAux.hide();
                    Ext.MessageBox.show({
                        title:'Error',msg: 'Error al recibir los datos del servidor.',
                        buttons: Ext.MessageBox.OK,icon: Ext.MessageBox.ERROR
                    });
                }
            }
        });
    }
}
}


