UCID.portal.cargarEtiquetas('gestsistema', cargarInterfaz);

////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();
////------------ Declarar variables ------------////
var winIns, winPass, fpPass, nodeArbolConexSelect, winMod, winImp, btnBuscar, idsistema, fpbuscar, sistemas, panelAdicionar,lastNode,
    arbolSistema, arbolConex, arbolLoaderConex, sistemaseleccionado, idpadre, fpCon, fpRegSistema, nodoSeleccionado, bandera = 0;
var arregloDeschequeados = [], padreConex, padreSistema, vpGestSistema, collapsed = false;
////------------ Area de Expresiones para validaciones ------------////
var cambiar = true, modificar = 0;
tipos = /(^([a-zA-ZáéíóúñÑ])+([a-zA-ZáéíóúñÑ\d\.\-\@\#\_\s]*))$/;
esDirIp =  /(^(2([0-4][0-9])|2(5[0-5]))|^([0-1]?[0-9]?[0-9]))\.(((2([0-4][0-9])|2(5[0-5]))|([0-1]?[0-9]?[0-9]))\.){2}((2([0-4][0-9])|2(5[0-5]))|([0-1]?[0-9]?[0-9]))$/;
var icon_dir = '../../../../lib/ExtJS/temas/default/images/iconos/';

////------------ Funcion para cargar la interfaz ------------////
function cargarInterfaz(perfil,etiquetas) {
    var _this = this;
    
    console.log("Etiquetas",etiquetas);
    ////------------ Botones principales ------------////
    this.btnAdicionar = new Ext.Button({
        disabled:true,
        id:'btnAgrSist',
        tooltip:etiquetas.textToolTipadicionar,
        prevTab:'btnAyuSist',
        hidden:true,
        //icon:perfil.dirImg+'adicionar.png',
        iconCls:'adicionar',
        text:etiquetas.lbBtnAdicionar,
        hotKey		: {
            idGrupo	:'grid1',
            config  	: {
                key	: 105,
                alt	: true,
                ctrl    :false
            }
        },
        handler:function(){
            winForm('Ins');
        }
    });

    this.btnModificar = new Ext.Button({
        disabled:true,
        id:'btnModSist',
        tooltip:etiquetas.textToolTipMod,
        hidden:true,
        //icon:perfil.dirImg+'modificar.png',
        iconCls:'modificar',
        text:etiquetas.lbBtnModificar,
        hotKey		: {
            idGrupo	:'grid1',
            config  	: {
                key	: 109,
                alt	: true,
                ctrl    :false
            }
        },
        handler:function() {
            //tener en cuenta que el root no se modifica
            winForm('Mod');
        }
    });

    this.btnEliminar = new Ext.Button({
        disabled:true,
        id:'btnEliSist',
        tooltip:etiquetas.textToolTipDel,
        hidden:true,
        //icon:perfil.dirImg+'eliminar.png',
        iconCls:'eliminar',
        text:etiquetas.lbBtnEliminar,
        hotKey		: {
            idGrupo	: 'grid1',
            config  	: {
                key	: Ext.EventObject.DELETE,
                stopEvent : true
            }
        },
        handler:function(){
            eliminarSistema();
        }
    });

    this.btnExportar = new Ext.Button({
        disabled:true,
        id:'btnExpSist',
        tooltip:etiquetas.textToolTipExp,
        nextTab:'btnAyuSist',
        prevTab : 'btnImpSist',
        hidden:true,
        //icon:perfil.dirImg+'exportar.png',
        iconCls:'exportar',
        text:etiquetas.lbExportarSistema,
        hotKey		: {
            idGrupo	: 'grid1',
            config  	: {
                key	: 101,
                alt	: true
            }
        },
        handler:function(){
            exportarSistema();
        }
    });

    this.btnImportar = new Ext.Button({
        disabled:true,
        id:'btnImpSist',
        tooltip:etiquetas.textToolTipImp,
        hidden:true,
        //icon:perfil.dirImg+'importar.png',
        iconCls:'importar',
        text:etiquetas.lbImportarSistema,
        hotKey		: {
            idGrupo	: 'grid1',
            config  	: {
                key	: 120,
                alt	: true
            }
        },
        handler:function(){
            winForm('Imp');
        }
    });
    this.btnAyuda = new Ext.Button({
        id: 'btnAyuSist',
        iconCls: 'ayuda',
        text: '<b>'+etiquetas.lbBtnAyuda+'</b>',
        disabled: false,
        toolTip: etiquetas.textToolTipHelp,
        nextTab:'btnAgrSist',
        prevTab : 'btnExpSist',
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 104,
                alt: true
            }
        },
        //icon: perfil.dirImg + 'ayuda.png',
        menu: new Ext.menu.Menu({
            id: 'mainMenu',
            items: [
                {
                    handler: function () {
                        cargarAyuda();
                    }, text: etiquetas.lbBtnAyuda,
                    id: 'btnAyuRel',
                    //icon: perfil.dirImg + 'ayuda.png',
                    iconCls: 'ayuda',
                    tooltip: 'Ayuda del sistema'
                },
                {
                    text: etiquetas.lbBtnAcercaDe,
                    id: 'acercade',
                    //icon: perfil.dirImg + 'info.png',
                    iconCls: 'info',
                    tooltip: "Acerca de <b>(Alt+...s)</b>",
                    handler: function () {

                        var uri = "seguridad";
                        acercaDe.show(uri);
                    }}
            ]
        })

    });
    /**this.btnAyuda = new Ext.Button({
        id:'btnAyuSist',
        nextTab:'btnAgrSist',
        prevTab : 'btnExpSist',
        tooltip:etiquetas.textToolTipHelp,
        icon:perfil.dirImg+'ayuda.png',
        iconCls:'btn',
        text:'Ayuda',
        hotKey          : {
            idGrupo     : 'grid1',
            config  	: {
                key	: 104,
                alt	: true
            }
        },
        handler:function(){
            cargarAyuda();
        }
    });*/
    UCID.portal.cargarAcciones(window.frameElement.id, enfocarElemento);


    ////------------ Arbol de sistemas ------------////
    arbolSistema = new Ext.tree.TreePanel({
        title:etiquetas.titleMsg,
        enableDD:true,
        autoScroll:true,
        border:false,
        frame:false,
        region:'center',
        cls:'x-toolbar',
        width:150,
        margins:'2 2 2 2',
        loader: new Ext.tree.TreeLoader({
            dataUrl:'cargarsistema'
        })
    });

    ////------------ Crear nodo padre del arbol ------------////
    padreSistema = new Ext.tree.AsyncTreeNode({
        text: etiquetas.lbRootNodeArbolSubsist,
        animate:false,
        draggable:false,
        expandable:false,
        expanded:true,
        id:'0'
    });

    ////------------ Crear lista de hijos ------------////
    arbolSistema.setRootNode(padreSistema);

    ////------------ Evento para habilitar botones ------------////
    arbolSistema.on('click', function (node) {
        sistemaseleccionado = node.id;
        idpadre = node.attributes.idpadre;
        sistemas =  node;
        bandera =0;
        if(node.id!=0){
            idsistema = node.id;
            nodoSeleccionado=node;
            _this.btnModificar.enable();
            _this.btnEliminar.enable();
            _this.btnAdicionar.enable();
            _this.btnImportar.enable();
            _this.btnExportar.enable();
        } else {
            _this.btnAdicionar.enable();
            _this.btnModificar.disable();
            _this.btnEliminar.disable();
            _this.btnImportar.enable();
            _this.btnExportar.disable();
        }
    }, this);

    arbolLoaderConex = new Ext.tree.TreeLoader({
        dataUrl:'cargarservidores',
        listeners:{
            'beforeload':function(atreeloader, anode) {
                if(anode.attributes.namebd) {
                    atreeloader.baseParams = {};
                    atreeloader.baseParams.accion = 'cargaresquemas';
                    atreeloader.baseParams.user = anode.attributes.user;
                    atreeloader.baseParams.passw = anode.attributes.passw;
                    atreeloader.baseParams.gestor = anode.attributes.gestor;
                    atreeloader.baseParams.namebd = anode.attributes.namebd;
                    atreeloader.baseParams.idservidor = anode.attributes.idservidor;
                    atreeloader.baseParams.idgestor = anode.attributes.idgestor;
                    atreeloader.baseParams.puerto = anode.attributes.puerto;
                    atreeloader.baseParams.idsistema = sistemaseleccionado;
                    atreeloader.baseParams.ipgestorbd = anode.attributes.ipgestorbd;
                }
                else if(anode.attributes.idgestor) {
                    if (typeof(atreeloader.baseParams) != 'object' || !atreeloader.baseParams.user) {
                        nodeArbolConexSelect = anode;
                        levantarVentana();
                        return false;
                    }
                }
                else if(anode.attributes.idservidor) {
                    atreeloader.baseParams = {};
                    atreeloader.baseParams.idservidor = anode.attributes.idservidor;
                    atreeloader.baseParams.accion = 'cargargestores';
                }
            },
            'load':function(treeLoaderObj, nodeObj, response) {
                respObj = Ext.decode(response.responseText);
                if (!respObj.codMsg) {
                    _this.btnAdicionar.disable();
                    _this.btnModificar.disable();
                    _this.btnEliminar.disable();
                    _this.btnImportar.disable();
                    _this.btnExportar.disable();
                }
                else if	(respObj.codMsg == 2 && nodeObj.attributes.idgestor) {
                    nodeObj.reload();
                }
            }
        }
    });
    ////------------ Arbol de servidores ------------////
    arbolConex = new Ext.tree.TreePanel({
        title:etiquetas.titleServGestBDEsq,
        border:false,
        autoScroll:true,
        region:'center',
        width:320,
        loader: arbolLoaderConex,
        margins:'2 2 2 2'
    });

    arbolConex.on('checkchange', function (node) {
        if(winMod && node.attributes.marcado) {
            var esta = estaEnDeschequeados(arregloDeschequeados, node.attributes.marcado);
            if(node.attributes.checked && esta != -1)
                eliminarEnDeschequeados(arregloDeschequeados, esta);
            else
                adicionarEnDeschequeados(arregloDeschequeados, node.attributes.marcado);
        }

    }, this);

    function eliminarEnDeschequeados(arreglo, pos) {
        arreglo.splice(pos,1);
    }

    function adicionarEnDeschequeados(arreglo, id) {
        if(estaEnDeschequeados(arreglo, id) == -1)
            arreglo.push(id);
    }

    function estaEnDeschequeados(arreglonodos, idnodo) {
        for (p=0; p < arreglonodos.length; p++)
            if(arreglonodos[p] == idnodo)
                return p;
        return -1;
    }

    ////------------ Crear nodo padre del arbol ------------////
    padreConex = new Ext.tree.AsyncTreeNode({
        text: etiquetas.arbolTitleServidores,
        draggable:false,
        expandable:false,
        id:'0'
    });

    ////------------ Crear lista de hijos ------------////
    arbolConex.setRootNode(padreConex);

    var store =  new Ext.data.Store({
        url: 'cargarCmbIconFonts',
        reader:new Ext.data.JsonReader(
            {
                root:'icons',
                id:'idicons'
            },
            [
                {
                    name:'icon',
                    mapping:'icon'
                }
            ])
    });
    store.load();

    var combo = new Ext.form.ComboBox({
        fieldLabel:etiquetas.lbIcono,
        store: store,
        displayField:'icon',
        typeAhead: true,
        mode: 'local',
        id:'icono',
        forceSelection: true,
        triggerAction: 'all',
        emptyText:'Seleccione...',
        selectOnFocus:true,
        //editable : false,
        anchor:'100%',
        tpl :   '<tpl for=".">'+
        '<div class="x-combo-list-item">'+
        '<span class="icondistra-{icon}">{icon}</span>'+
        '</div></tpl>'
    });
    ////------------ Formulario de Datos de Sistema ------------////
    fpRegSistema = new Ext.FormPanel({
        labelAlign: 'top',
        frame:true,
        title:etiquetas.titleFormPanel,
        width:200,
        region:'west',
        bodyStyle:'padding:5px 5px 0',
        items: [{
            layout:'column',
            items:[{
                columnWidth:1,
                layout:'form',
                items:[
                {
                    xtype:'textfield',
                    fieldLabel:etiquetas.lbCampoDenom,
                    id:'denominacion',
                    maxLength:60,
                    allowBlank:false,
                    blankText:etiquetas.lbMsgBlankTextDenom,
                    vtype:'vtalfanumericosguiones',
                    anchor:'100%'
                },
                {
                    xtype:'textfield',
                    fieldLabel:etiquetas.lbCampoAbreviatura,
                    id:'abreviatura',
                    maxLength:10,
                    allowBlank:false,
                    blankText:etiquetas.lbMsgBlankTextDenom,
                    vtype:'vtalfanumericos',
                    anchor:'100%'
                },combo
                /*{
                    xtype:'textfield',
                    fieldLabel:etiquetas.lbIcono,
                    id:'icono',
                    maxLength:30,
                    vtype:'vtalfanumericos',
                    anchor:'100%'
                }*/,{
                    xtype:'fieldset',
                    id:'externo',
                    checkboxToggle:true,
                    title: etiquetas.fsTitle,
                    autoHeight:true,
                    defaultType: 'textfield',
                    collapsed: false,
                    listeners: {
                        collapse: function() {
                            collapsed = true;
                            Ext.getCmp("servidorweb").allowBlank = true
                        },
                        expand: function () {
                            collapsed = false;
                            Ext.getCmp("servidorweb").allowBlank = false
                        }
                    },
                    items :[{
                        fieldLabel: etiquetas.labelFS,
                        name:'servidorweb',
                        id:'servidorweb',
                        maxLength:100,
                        blankText: perfil.etiquetas.lbMsgBlankTextRef,
                        anchor:'100%'
                    }]
                },
                {
                    xtype:'textfield',
                    fieldLabel: etiquetas.index,
                    id: 'index',
                    maxLength:4,  
                    vtype:'vtnumero4dig',
                    anchor:'100%'
                },
                {
                    xtype:'textarea',
                    fieldLabel: etiquetas.lbDescripcion,
                    id: 'descripcion',
                    maxLength:255,
                    height:60,
                    anchor:'100%'
                }
                ]
            }]
        }]
    });
    fpbuscar = new Ext.FormPanel({
        labelAlign: 'top',
        frame:true,
        fileUpload: true,
        bodyStyle:'padding:5px 5px 0',
        items: new Ext.form.FileUploadField({
            fieldLabel:etiquetas.importarMsg,
            name:'fileUpload',
            id:'fileUpload',
            allowBlank:false,
            anchor:'100%'
        })
    });

    ////------------ Panel para auntenticar con el servidor de base de datos ------------////
    fpCon = new Ext.FormPanel({
        labelAlign: 'left',
        frame:true,
        width:100,
        fileUpload: true,
        bodyStyle:'padding:5px 5px 0',
        items:[
        {
            xtype:'textfield',
            fieldLabel:etiquetas.lbUsuario,
            id:'user',
            allowBlank:false,
            blankText:etiquetas.lbMsgExpRegIcon,
            regex:tipos,
            anchor:'100%'
        },
        {
            xtype:'textfield',
            fieldLabel:etiquetas.lbTitMsgContrasena,
            id:'pass',
            inputType:'password',
            allowBlank:false,
            blankText:etiquetas.lbMsgExpRegIcon,
            anchor:'100%'
        }]
    });


    ////------------ Panel ------------////
    panelAdicionar = new Ext.Panel({
        layout:'border',
        border:'false',
        items:[fpRegSistema,arbolConex]
    });

    ////------------ Cargar ventanas ------------////
    function winForm(opcion){
        switch(opcion){
            case 'Ins':{
                if(!winIns) {
                    winIns = new Ext.Window({
                        modal: true,
                        closeAction:'hide',
                        layout:'fit',
                        title:etiquetas.windowIns,
                        width:580,
                        height:450,
                        buttons:[
                        {
                            //icon:perfil.dirImg+'cancelar.png',
                            iconCls:'cancelar',
                            text:etiquetas.lbBtnCancelar,
                            tooltip	: etiquetas.tooltipCancelarVen,
                            handler:function(){
                                winIns.hide();
                            }
                        },
                        {
                            //icon:perfil.dirImg+'aplicar.png',
                            iconCls:'aplicar',
                            text:etiquetas.lbBtnAplicar,
                            tooltip	: etiquetas.tooltipAplicarVen,
                            handler:function(){
                                adicionarSistema('apl');
                            }
                        },
                        {
                            //icon:perfil.dirImg+'aceptar.png',
                            iconCls:'aceptar',
                            text:etiquetas.lbBtnAceptar,
                            nextTab : 'denominacion',
                            tooltip	: etiquetas.tooltipAceptarVen,
                            handler:function(){
                                adicionarSistema();
                            }
                        }
                        ]
                    });
                    winIns.on('hide',function() {
                        fpRegSistema.getForm().reset();
                    },this)
                }
                modificar = 0;
                arbolConex.getRootNode().reload();
                fpRegSistema.getForm().reset();
                winIns.add(panelAdicionar);
                winIns.doLayout();
                Ext.getCmp('externo').show();
                if(arbolSistema.getSelectionModel().getSelectedNode().id != 0)
                    Ext.getCmp('externo').setVisible(false);
                winIns.show();
                Ext.getCmp('denominacion').focus(false,200);
            }
            break;
            case 'Mod':{
                if(!winMod) {
                    winMod= new Ext.Window({
                        modal: true,
                        closeAction:'hide',
                        layout:'fit',
                        title:etiquetas.windowMod,
                        width:580,
                        height:450,
                        buttons:[
                        {
                            //icon:perfil.dirImg+'cancelar.png',
                            iconCls:'cancelar',
                            text:etiquetas.lbBtnCancelar,
                            tooltip	: etiquetas.tooltipCancelarVen,
                            handler:function(){
                                winMod.hide();
                            }
                        },
                        {
                            //icon:perfil.dirImg+'aceptar.png',
                            iconCls:'aceptar',
                            text:etiquetas.lbBtnAceptar,
                            nextTab : 'denominacion',
                            tooltip	: etiquetas.tooltipAceptarVen,
                            handler:function(){
                                modificarSistema();
                            }
                        }
                        ]
                    });

                    winMod.on('hide',function(){
                        fpRegSistema.getForm().reset();
                    },this)
                }
                modificar = 1;
                arbolConex.getRootNode().reload();
                fpRegSistema.getForm().reset();
                arbolConex.getLoader().baseParams = {};
                arbolConex.getLoader().baseParams.idsistema = arbolSistema.getSelectionModel().getSelectedNode().id;
                winMod.add(panelAdicionar);
                winMod.doLayout();

                Ext.getCmp('externo').show();
                if(arbolSistema.getSelectionModel().getSelectedNode().parentNode.id != 0)
                    Ext.getCmp('externo').setVisible(false);
                winMod.show();
                fpRegSistema.getForm().loadRecord(dameNodeInfo());
                Ext.getCmp('denominacion').focus(false,200);
                if(Ext.getCmp('servidorweb').getValue()) {
                    if(bandera == 0) {
                        Ext.getCmp('externo').expand(false);
                        bandera =1;
                    }
                } else {
                    if(bandera == 0) {
                        Ext.getCmp('externo'). collapse(false);
                        bandera =1;
                    }
                }
            }
            break;
            case 'Imp': {
                if(!winImp){
                    winImp = new Ext.Window({
                        modal: false,
                        closeAction:'hide',
                        layout:'fit',
                        title:etiquetas.titleImportarSis,
                        width:400,
                        height:150,
                        items:fpbuscar,
                        buttons:[{
                            //icon:perfil.dirImg+'cancelar.png',
                            tooltip	: etiquetas.tooltipCancelarVen,
                            iconCls:'cancelar',
                            text:etiquetas.lbBtnCancelar,
                            handler:function(){
                                winImp.hide();
                            }
                        },{
                            //icon:perfil.dirImg+'aceptar.png',
                            tooltip	: etiquetas.tooltipAceptarVen,
                            iconCls:'aceptar',
                            text:etiquetas.lbBtnAceptar,
                            handler:function(){
                                importarSistema();
                            }
                        }
                        ]
                    });
                }
                fpbuscar.getForm().reset();
                winImp.show('btnImportar');
            }
            break;
        }
    }

    var panel =  new Ext.Panel({
        layout:'border',
        id	: 'grid1',
        keyMapGroup	: true,
        items:[arbolSistema],
        tbar: [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar, _this.btnImportar, _this.btnExportar, '->', _this.btnAyuda]
    });

    panel.on('afterlayout',function() {
        panel.habilitarKeyMap();
    });

    function enfocarElemento() {
        panel.getTopToolbar().items.items[0].focus();
    }

    vpGestSistema = new Ext.Viewport({
        layout:'fit',
        items:panel
    });

    /////---------------obtener datos del sistema para modificar---------------------------/////
    var dameNodeInfo = function(){
        var record = Ext.data.Record.create([
        {
            name: 'denominacion',
            mapping: 'denominacion'
        }
        ]);
        return new record({
            denominacion: nodoSeleccionado.attributes.text,
            abreviatura: nodoSeleccionado.attributes.abreviatura,
            descripcion: nodoSeleccionado.attributes.descripcion,
            icono: nodoSeleccionado.attributes.icono,
            servidorweb: nodoSeleccionado.attributes.servidorweb,
            index: nodoSeleccionado.attributes.index
        })

    };

    fpPass = new Ext.FormPanel({
        frame:true,
        width:100,
        bodyStyle:'padding:5px 5px 0',
        items: [{
            layout:'column',
            items:[{
                columnWidth:2,
                layout:'form',
                items:[{
                    xtype:'textfield',
                    fieldLabel:perfil.etiquetas.lbUsuario,
                    id:'user',
                    blankText:perfil.etiquetas.lbMsgBlankTextDenom,
                    allowBlank:false,
                    labelStyle:'width:80px',
                    width:130
                },{
                    xtype:'textfield',
                    fieldLabel:perfil.etiquetas.lbTitMsgContrasena,
                    inputType:'password',
                    blankText:perfil.etiquetas.lbMsgBlankTextDenom,
                    id:'passw',
                    labelStyle:'width:80px',
                    allowBlank:false,
                    width:130
                }]
            }]
        }]
    // html: '<div id="divPassIncorrect" style="color: red"></div>'
    });

    function levantarVentana() {
        if (!winPass) {
            winPass = new Ext.Window({
                modal: true,
                closeAction:'hide',
                layout:'fit',
                title:perfil.etiquetas.lbBtnCambiarpass,
                width:290,
                height:150,
                resizable:false,
                buttons:[{
                    //icon:perfil.dirImg+'cancelar.png',
                    iconCls:'cancelar',
                    text:perfil.etiquetas.lbBtnCancelar,
                    handler:function() {
                        winPass.hide();
                        arbolConex.getRootNode().reload();
                    }
                },{
                    //icon:perfil.dirImg+'aceptar.png',
                    iconCls:'aceptar',
                    handler:function() {
                        if(fpPass.getForm().isValid()) {
                            arbolLoaderConex.baseParams = {};
                            arbolLoaderConex.baseParams.accion = 'cargarbd';
                            arbolLoaderConex.baseParams.user = Ext.getCmp('user').getValue();
                            arbolLoaderConex.baseParams.passw = Ext.getCmp('passw').getValue();
                            arbolLoaderConex.baseParams.gestor = nodeArbolConexSelect.attributes.gestor;
                            arbolLoaderConex.baseParams.ipgestorbd = nodeArbolConexSelect.attributes.ipgestorbd;
                            arbolLoaderConex.baseParams.idgestor = nodeArbolConexSelect.attributes.idgestor;
                            arbolLoaderConex.baseParams.idservidor = nodeArbolConexSelect.attributes.idservidor;
                            arbolLoaderConex.baseParams.puerto = nodeArbolConexSelect.attributes.puerto;
                            arbolLoaderConex.baseParams.idsistema = sistemaseleccionado;
                            arbolLoaderConex.load(nodeArbolConexSelect);
                            winPass.hide();
                            arbolLoaderConex.baseParams = {};
                        }
                        else
                            mostrarMensaje(3,perfil.etiquetas.lbMsgErrorEnCamops);
                    },
                    text:perfil.etiquetas.lbBtnAceptar
                }]
            });
            winPass.add(fpPass);
            winPass.doLayout();
        }
        Ext.getCmp('user').reset();
        Ext.getCmp('passw').reset();
        winPass.show();
    }

    ////------------ Adicionar Sistema ------------////
    function adicionarSistema (apl) {
        if (fpRegSistema.getForm().isValid()){
            var arrayNodos = arbolConex.getChecked();
            arrayservidores = [];
            arrayTemp = [];
            arrayRoles = [];
            var band = false;
            var post = 0;
            arrayRoles = getArrayRoles();
            if(arrayNodos.length > 0) {
                if(arrayRoles.length > 0) {
                    for (var i = 0; i < arrayNodos.length; i++) {
                        if (!arrayNodos[i].attributes.marcado) {
                            if(arrayNodos[i].attributes.type == 'schemas') {
                                band = true;
                                arrayTemp.push(arrayNodos[i].getPath('id').split('/'));
                                for(var j = 0; j < arrayRoles.length; j++) {
                                    if(arrayRoles[j][3] == arrayTemp[post][3]) {
                                        arrayTemp[post][arrayTemp[post].length] = arrayRoles[j][4];
                                        arrayservidores.push(arrayTemp[post]);
                                        post++;
                                        break;
                                    }
                                }
                            } else {
                                if(!band) {
                                    mostrarMensaje(3,perfil.etiquetas.MsgErrorConexSchemas);
                                    band = false;
                                    return;
                                }
                            }
                        }
                    }
                } else {
                    mostrarMensaje(3,perfil.etiquetas.MsgErrorConex);
                    return;
                }
            }
            if(arbolSistema.getSelectionModel().getSelectedNode()!=null){
                lastNode=arbolSistema.getSelectionModel().getSelectedNode();
            }
            Secodena.mostrarMascara('maskAddSistema',etiquetas.msgWait,etiquetas.msgAdd);
            fpRegSistema.getForm().submit({
                url:'insertarsistema',
                params:{
                    idpadre:lastNode.id,
                    servidores:Ext.encode(arrayservidores)
                },
                failure: function(form, action) {
                    Secodena.ocultarMascara('maskAddSistema');
                    if(action.result.codMsg != 3) {
                        mostrarMensaje(action.result.codMsg,action.result.mensaje);
                        if(sistemas.parentNode){
                            sistemas.parentNode.reload();                            
                        }
                        else{
                            fpRegSistema.getForm().reset();
                            sistemas.reload();
                        }
                        arbolConex.getRootNode().reload();
                        fpRegSistema.getForm().reset();
                        if(!apl)
                            winIns.hide();
                    }
                    if(action.result.codMsg == 3)
                        mostrarMensaje(action.result.codMsg,action.result.mensaje);
                }
            });          
        }
        else
            mostrarMensaje(3,perfil.etiquetas.lbMsgErrorEnCamops);

    }

    ////------------ Modificar sistema ------------////
    function modificarSistema() {
        if (fpRegSistema.getForm().isValid()) {
            Secodena.mostrarMascara('maskSistemaMod',etiquetas.msgWait,etiquetas.msgMod);
            var arrayNodos = arbolConex.getChecked();
            arrayservidores = [];
            arrayTemp = [];
            arrayRoles = [];
            var band = false;
            var post = 0;
            arrayRoles = getArrayRoles();
            if(arrayNodos.length > 0) {
                if(arrayRoles.length > 0) {
                    for (var i = 0; i < arrayNodos.length; i++) {
                        if (!arrayNodos[i].attributes.marcado) {
                            if(arrayNodos[i].attributes.type == 'schemas') {
                                band = true;
                                arrayTemp.push(arrayNodos[i].getPath('id').split('/'));
                                for(var j = 0; j < arrayRoles.length; j++) {
                                    if(arrayRoles[j][3] == arrayTemp[post][3]) {
                                        arrayTemp[post][arrayTemp[post].length] = arrayRoles[j][4];
                                        arrayservidores.push(arrayTemp[post]);
                                        post++;
                                        break;
                                    }
                                }
                            } else {
                                if(!band) {
                                    mostrarMensaje(3,perfil.etiquetas.MsgErrorConexSchemas);
                                    band = false;
                                    return;
                                }
                            }
                        }
                    }
                } else {
                    mostrarMensaje(3,perfil.etiquetas.MsgErrorConex);
                    return;
                }
            }
            fpRegSistema.getForm().submit({
                url:'modificarsistema',
                params:{
                    idsistema:arbolSistema.getSelectionModel().getSelectedNode().id,
                    servidores:Ext.encode(arrayservidores),
                    esquemasEliminados:Ext.encode(arregloDeschequeados),
                    externo:collapsed,
                    idpadre:idpadre
                },
                failure: function(form, action){
                    Secodena.ocultarMascara('maskSistemaMod');
                    if(action.result.codMsg != 3) {
                        mostrarMensaje(action.result.codMsg,action.result.mensaje);
                        fpRegSistema.getForm().reset();
                        arregloDeschequeados = [];
                        winMod.hide();
                        arbolSistema.getSelectionModel().getSelectedNode().parentNode.reload();
                        _this.btnModificar.disable();
                        _this.btnEliminar.disable();
                        collapsed = false;
                    }
                    if(action.result.codMsg == 3) mostrarMensaje(action.result.codMsg,action.result.mensaje);
                }
            });
        }
        else
            mostrarMensaje(3,perfil.etiquetas.lbMsgErrorEnCamops);
    }

    function arrayConexiones() {
        var arrayNodos = arbolConex.getChecked();
        arrayservidores = [];
        arrayTemp = [];
        arrayRoles = [];
        var band = false;
        var post = 0;
        arrayRoles = getArrayRoles();
        if(arrayNodos.length > 0) {
            if(arrayRoles.length > 0) {
                for (var i = 0; i < arrayNodos.length; i++) {
                    if (!arrayNodos[i].attributes.marcado && arrayNodos[i].attributes.type == 'schemas') {
                        band = true;
                        arrayTemp.push(arrayNodos[i].getPath('id').split('/'));
                        for(var j = 0; j < arrayRoles.length; j++) {
                            if(arrayRoles[j][3] == arrayTemp[post][3] && arrayNodos[i].attributes.type != 'roles') {
                                arrayTemp[post][arrayTemp[post].length] = arrayRoles[j][4];
                                arrayservidores.push(arrayTemp[post]);
                                post++;
                                break;
                            } else {
                                mostrarMensaje(3,perfil.etiquetas.MsgErrorConex);
                                return
                            }
                        }
                    } else {
                        if(!band) {
                            mostrarMensaje(3,perfil.etiquetas.MsgErrorConexSchemas);
                            return
                        }
                    }
                }
            } else {
                mostrarMensaje(3,perfil.etiquetas.MsgErrorConex);
                return;
            }
        }
        return arrayservidores;
    }

    function getArrayRoles() {
        array = arbolConex.getChecked();
        arrayResult = [];
        for(i = 0; i < array.length; i++) {
            if(array[i].attributes.type == 'roles')
                arrayResult.push(array[i].getPath('id').split('/'));
        }
        return arrayResult;
    }

    ////------------------- Eliminar Sistema ------------------------////
    function eliminarSistema(){
        mostrarMensaje(2,etiquetas.lbMsgDeseaEliminar,elimina);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                Secodena.mostrarMascara('maskSistemasDel',etiquetas.msgWait,etiquetas.msgDEL);
                Ext.Ajax.request({
                    url: 'eliminarsistema',
                    method:'POST',
                    params:{
                        idsistema:arbolSistema.getSelectionModel().getSelectedNode().attributes.id
                    },
                    callback: function (options,success,response) {
                        Secodena.ocultarMascara('maskSistemasDel');
                        responseData = Ext.decode(response.responseText);
                        if(responseData.codMsg == 1) {
                            arbolSistema.getSelectionModel().getSelectedNode().parentNode.reload();
                            mostrarMensaje(responseData.codMsg,responseData.mensaje);
                            _this.btnEliminar.disable();
                            sistemas = null;
                            _this.btnModificar.disable();
                            _this.btnAdicionar.disable();
                            _this.btnExportar.disable();
                            _this.btnImportar.disable();
                            _this.btnAdicionar.disable();
                        }
                        if(responseData.codMsg == 3)
                            mostrarMensaje(responseData.codMsg,responseData.mensaje);
                    }
                });
            }
        }
    }

    ////------------------- Exportar Sistema ------------------------////
    function exportarSistema() {
        document.getElementById('idsistema').value = arbolSistema.getSelectionModel().getSelectedNode().attributes.id;
        var formexport = document.getElementById('exportarsistemas');
        formexport.method = 'POST';
        formexport.target = '_blank';
        formexport.action = 'exportarsistema';
        formexport.submit();
    }

    ////------------------- Importar Sistema ------------------------////
    function importarSistema() {
        if(Ext.getCmp('fileUpload').getValue()!=''){
            Secodena.mostrarMascara('maskImportarSistema',etiquetas.msgWait,etiquetas.msgImp);
        }

        fpbuscar.getForm().submit({
            url:'importarXML',
            timeout:3600000,
            params:{
                idsistema:arbolSistema.getSelectionModel().getSelectedNode().attributes.id
            },
            failure: function(form, action) {
                Secodena.ocultarMascara('maskImportarSistema');

                //if(action.result.codMsg == 1) {
                console.log(action);
                    mostrarMensaje(action.result.codMsg,action.result.mensaje);
                    winImp.hide();
                    if(arbolSistema.getSelectionModel().getSelectedNode().attributes.id ==0)
                        arbolSistema.getSelectionModel().getSelectedNode().reload();
                    else
                        arbolSistema.getSelectionModel().getSelectedNode().parentNode.reload();
                //}
            }
        });
    }

    function cargarAyuda(){
        var title	= 'Ayuda de sistemas';
        var referencia	= 'seguridad/sistemas';
        help.show(title,referencia);
    }
}