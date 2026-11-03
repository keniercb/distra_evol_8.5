UCID.portal.cargarEtiquetas('gestrecursos',cargarInterfaz);

////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();

////------------ Declarar Variables ------------////
var winIns, winMod, idfuncionalidad, btnAdicionar, btnModificar, btnEliminar, opcion = '', busqueda_grid = false;
var allChequed = [], arbolRecursos, arbolRecLoader, arbolAcc;
////------------ Area de Validaciones ------------////
var tipos;
tipos =  /(^([a-zA-ZáéíóúñüÑ])+([a-zA-ZáéíóúñüÑ\d\.\-\@\#\_\s]*))$/;
function cargarInterfaz(perfil,etiquetas){
    ////------------ Botones ------------////
    btnAdicionar = new Ext.Button({
        disabled:true,
        id:'btnAgrRecurso',
        tooltip:etiquetas.textToolTipadicionar,
        prevTab:'btnClearField',
        hidden:true,
        icon:perfil.dirImg+'adicionar.png',
        iconCls:'btn',
        text:etiquetas.lbBtnAdicionar,
        hotKey		: {
            idGrupo		  :'grid1',
            config  	  : {
                key		  : 105,
                alt		  : true
            }
        },
        handler:function(){
            winForm('Ins');
        }
    });

    btnModificar = new Ext.Button({
        disabled:true,
        id:'btnModRecurso',
        tooltip:etiquetas.textToolTipMod,
        hidden:true,
        icon:perfil.dirImg+'modificar.png',
        iconCls:'btn',
        text:etiquetas.lbBtnModificar,
        hotKey		: {
            idGrupo		  :'grid1',
            config  	  : {
                key		  : 109,
                alt		  : true
            }
        },
        handler:function(){
            if(sm.getCount() >= 1)
                winForm('Mod');
        }
    });

    btnEliminar = new Ext.Button({
        disabled:true,
        id:'btnEliRecurso',
        tooltip:etiquetas.textToolTipDel,
        hidden:true,
        icon:perfil.dirImg+'eliminar.png',
        iconCls:'btn',
        text:etiquetas.lbBtnEliminar,
        hotKey		: {
            idGrupo		  : 'grid1',
            config  	  : {
                key       : Ext.EventObject.DELETE,
                stopEvent : true
            }
        },
        handler:function(){
            if(sm.getCount() >= 1)
                eliminarAccion();
        }
    });
    btnAyuda = new Ext.Button({
        id: 'btnAyuAccion',
        iconCls: 'btn',
        text: '<b>'+etiquetas.lbBtnAyuda+'</b>',
        disabled: false,
        nextTab : 'nombreaccion',
        prevTab : 'btnEliRecurso',
        toolTip: etiquetas.textToolTipHelp,
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 104,
                alt: true
            }
        },
        icon: perfil.dirImg + 'ayuda.png',
        menu: new Ext.menu.Menu({
            id: 'mainMenu',
            items: [
                {
                    handler: function () {
                        cargarAyuda();
                    }, text: etiquetas.lbBtnAyuda,
                    id: 'btnAyuRel',
                    icon: perfil.dirImg + 'ayuda.png',
                    iconCls: 'btn',
                    tooltip: 'Ayuda del sistema'
                },
                {
                    text: etiquetas.lbBtnAcercaDe,
                    id: 'acercade',
                    icon: perfil.dirImg + 'info.png',
                    iconCls: 'btn',
                    tooltip: "Acerca de <b>(Alt+...s)</b>",
                    handler: function () {

                        var uri = "seguridad";
                        acercaDe.show(uri);
                    }}
            ]
        })

    });
    /**btnAyuda = new Ext.Button({
        id:'btnAyuAccion',
        tooltip:etiquetas.textToolTipHelp,
        icon:perfil.dirImg+'ayuda.png',
        iconCls:'btn',
        text:etiquetas.lbBtnAyuda,
        nextTab : 'nombreaccion',
        prevTab : 'btnEliRecurso',
        hotKey		: {
            idGrupo		  : 'grid1',
            config  	  : {
                key		  : 104,
                alt		  : true
            }
        },
        handler:function() {
            cargarAyuda();
        }
    });*/

    UCID.portal.cargarAcciones(window.frameElement.id);

    ////------------ Arbol Acciones ------------////
    arbolAcc = new Ext.tree.TreePanel({
        title:etiquetas.lbTitArbolSistemas,
        cls:'x-toolbar',
        frame:false,
        border:false,
        collapsible:true,
        autoScroll:true,
        region:'west',
        split:true,
        width:'30%',
        loader: new Ext.tree.TreeLoader({
            dataUrl:'cargarsistfunc',
            listeners:{
                'beforeload':function(atreeloader, anode){
                    atreeloader.baseParams = {};
                    if(anode.attributes.idsistema)
                        atreeloader.baseParams.idsistema = anode.attributes.idsistema
                }
            }
        })
    });

    /////----------Creando el Arbol del formulario--------------/////
    arbolRecLoader = new Ext.tree.TreeLoader({
        dataUrl:'cargarSistFuncAcc',
        listeners:{
            'beforeload':function(atreeloader, anode) {
                atreeloader.baseParams = {};
                atreeloader.baseParams.opcion = opcion;
                if(opcion == 'mod')
                    atreeloader.baseParams.idrecurso = sm.getSelected().data.idrecurso;
                if (anode.attributes.idfuncionalidad)
                    atreeloader.baseParams.idfuncionalidad = anode.attributes.idfuncionalidad;
                else if(anode.attributes.idsistema)
                    atreeloader.baseParams.idsistema = anode.attributes.idsistema;
            }
        }
    });

    arbolRecursos = new Ext.tree.TreePanel({
        title:etiquetas.lbTitArbolSistemas,
        autoScroll:true,
        region:'center',
        split:true,
        width:'37%',
        listeners:{
            append: function (t, p, n) {
                if(n.attributes.defaultchecked )
                    allChequed.push(n);
            }
        },
        loader: arbolRecLoader
    });

    ////------------ Crear nodo padre del arbol ------------////
    padreArbolRec = new Ext.tree.AsyncTreeNode({
        text:etiquetas.lbRootNodeArbolSubsist,
        expandable:false,
        expanded:true,
        id:'0'
    });

    arbolRecursos.setRootNode(padreArbolRec);

    ////------------ Crear nodo padre del arbol ------------////
    padreArbolAcc = new Ext.tree.AsyncTreeNode({
        text:etiquetas.lbRootNodeArbolSubsist,
        expandable:false,
        expanded:true,
        id:'0'
    });

    arbolAcc.setRootNode(padreArbolAcc);

    btnAdicionar.on('click',function() {
        opcion = 'ins';
    }, this);

    btnModificar.on('click',function(){
        opcion = 'mod';
    }, this);

    ////------------ Evento para habilitar botones ------------////
    arbolAcc.on('click', function (node) {
        btnModificar.disable();
        btnEliminar.disable();
        btnAdicionar.disable();
        btnBuscar.disable();
        storeGrid.removeAll();
        if (node.isLeaf()) {
            idfuncionalidad = node.attributes.idfuncionalidad;
            panelCentral.enable();
            storeGrid.removeAll();
            storeGrid.load({
                params:{
                    start:0,
                    limit:15
                }
            });
            btnAdicionar.enable();
            btnBuscar.enable();
        }
    }, this);

    function focusRecurso() {
        Ext.getCmp('btnAgrRecurso').focus(300);
    }

    ////------------ Store del grid de grupos ------------////
    var storeGrid =  new Ext.data.Store({
        url: 'cargargridgrupos',
        listeners:{
            beforeload:function(thisstore,objeto) {
                objeto.params.idfuncionalidad = idfuncionalidad
            },
            load : function() {
                if(storeGrid.getCount() == 0 ) {
                    if(accion.getValue())
                        /**Ext.Msg.show({
                            title:etiquetas.msgInf,
                            msg: etiquetas.msgInfDatosMostrar,
                            buttons: Ext.Msg.OK,
                            fn:focusRecurso,
                            icon: Ext.MessageBox.INFO
                        })*/
                        mostrarMensaje(1, perfil.etiquetas.msgInfDatosMostrar, focusRecurso());
                    else if(busqueda_grid) {
                        /**Ext.Msg.show({
                            title:etiquetas.msgInf,
                            msg: etiquetas.msgInfDatos,
                            buttons: Ext.Msg.OK,
                            fn:focusRecurso,
                            icon: Ext.MessageBox.INFO
                        })*/
                        mostrarMensaje(1, perfil.etiquetas.msgInfDatos, focusRecurso());
                        busqueda_grid = false;
                    }
                }
            }

        },
        reader:new Ext.data.JsonReader({
            totalProperty: "cantidad_filas",
            root: "datos",
            id: "id"
        },
        [
        {
            name:'idrecurso',
            mapping:'idrecurso'
        },

        {
            name:'abreviatura',
            mapping:'abreviatura'
        },

        {
            name:'denominacion',
            mapping:'denominacion'
        },

        {
            name:'descripcion',
            mapping:'descripcion'
        }
        ])
    });

    ////------------ MODO DE SELECCION; SI singleSelect = true=> INDICA SELECCION SIMPLE ------------////
    var sm = new Ext.grid.RowSelectionModel({
        singleSelect:false
    });

    ////------------ Para habilitar boton de modificar y eliminar ------------////
    sm.on('beforerowselect', function () {
        btnModificar.enable();
        btnEliminar.enable();
    }, this);

    sm.on('rowselect', function () {
        if(sm.getCount()!=1){
            btnModificar.disable();
        }else{
            btnModificar.enable();
        }
    }, this);

    sm.on('rowdeselect', function () {
        if(sm.getCount()!=1){
            btnModificar.disable();
        }else{
            btnModificar.enable();
        }
    }, this);

    ////------------ Grid de Acciones ------------////
    var grid = new Ext.grid.GridPanel({
        title:etiquetas.lbMsgGridAcc,
        cls:'x-toolbar',
        id:'gridRecursos',
        region:'center',
        frame:false,
        bodyBorder:false,
        border:false,
        width:'40%',
        margins:'2 2 2 -4',
        autoExpandColumn:'expandir',
        store:storeGrid,
        sm:sm,
        columns: [
        {
            hidden:true,
            hideable: false,
            dataIndex: 'idrecurso'
        },

        {
            header:etiquetas.lbCampoDenom,
            width:200,
            dataIndex: 'denominacion',
            sortable : true
        },

        {
            header: etiquetas.lbCampoAbreviatura,
            width:150,
            dataIndex: 'abreviatura',
            sortable : true
        },

        {
            id:'expandir',
            header: etiquetas.lbDescripcion,
            width:200,
            dataIndex: 'descripcion',
            sortable : true
        }
        ],
        loadMask:{
            store:storeGrid
        },
        bbar:new Ext.PagingToolbar({
            pageSize: 15,
            id:'ptbaux',
            store: storeGrid,
            displayInfo: true,
            displayMsg:  etiquetas.lbMsgPaginado,
            emptyMsg: etiquetas.lbMsgEmpty
        })
    });

    var accion = new Ext.form.TextField({
        emptyText: etiquetas.emptytext,
        fieldLabel:etiquetas.lbAccion,
        anchor:"98%",
        width:150,
        maxLength:60,
        colWidth:.3,
        id: 'nombreaccion',
	    vtype:'vtalfanumericosguiones',
        nextTab : 'btnBuscarGrid',
        prevTab : 'btnAyuAccion'
    });

    var btnBuscar	= new Ext.Button({
        icon:perfil.dirImg+'buscar.png',
        id: 'btnBuscarGrid',
        nextTab : 'btnClearField',
        prevTab : 'nombreaccion',
        iconCls:'btn',
        text:etiquetas.lbBtnBuscar,
        tooltip:etiquetas.textToolTipSearch,
        hotKey		: {
            idGrupo		  :'grid1',
            config  	  :{
                key	: 98,
                alt	: true
            }
        },
        handler:function(){
            buscaraccion(accion.getValue());
        }
    });

    var btnClear = new Ext.Button({
        icon	: perfil.dirImg+'limpiar.png',
        id		: 'btnClearField',
        nextTab : 'btnAgrRecurso',
        prevTab : 'btnBuscarGrid',
        iconCls	: 'btn',
        text	:  etiquetas.denomLimpiar,
        tooltip		: etiquetas.cleanFilter,
        hotKey		: {
            idGrupo		  :'grid1',
            config  	  :{
                key		  : 108,
                alt		  : true
            }
        },
        handler	: function(){
            clearFilters();
        }
    });

    var fpFiltro = new Ext.ToolBar.searchToolBar({
        elementos : [accion],
        botones:[btnBuscar, btnClear]
    });

    ////------------ Panel del GRID ------------////
    var panelCentral = new Ext.Panel({
        layout:'border',
        region:'center',
        disabled:true,
        id:'grid1',
        keyMapGroup:true,
        items:[fpFiltro, grid],
        tbar:[btnAdicionar,btnModificar,btnEliminar,'->',btnAyuda]
    });

    panelCentral.on('afterlayout',function() {
        panelCentral.habilitarKeyMap();
    });

    ////------------ Panel ------------////
    var panel = new Ext.Panel({
        layout:'border',
        items:[arbolAcc,panelCentral]
    });

    ////------------ ViewPort ------------////
    vpGestSistema = new Ext.Viewport({
        layout:'fit',
        items:panel
    });

    ////------------ Formulario ------------////
    var regRecursos = new Ext.FormPanel({
        labelAlign: 'top',
        collapsible:true,
        width:200,
        region:'west',
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        items: [{
            layout:'column',
            items:[{
                columnWidth:1,
                layout: 'form',
                items: [{
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
                    name: 'abreviatura',
                    maxLength:100,
                    anchor:'100%',
                    allowBlank:false,
                    blankText:etiquetas.lbMsgBlankTextDenom,
                    vtype:'vtalfanumericosguiones'
                },
                {
                    xtype:'textarea',
                    fieldLabel:etiquetas.lbDescripcion,
                    name: 'descripcion',
                    maxLength:255,
                    height:180,
                    anchor:'100%'
                }]
            }]
        }]
    });

    /////--------- Panel de adicionar --------/////
    var panelAdicionar = new Ext.Panel({
        layout:'border',
        items:[regRecursos,arbolRecursos]
    });

    ////------------ Cargar Ventanas ------------////
    function winForm(opcion){
        switch(opcion) {
            case 'Ins':{
                if(!winIns) {
                    winIns = new Ext.Window({
                        modal: true,
                        closeAction:'hide',
                        layout:'fit',
                        title:etiquetas.lbTitAdicionarAcc,
                        width:550,
                        height:390,
                        listeners:{
                            hide: function () {
                                panelCentral.getTopToolbar().items.items[0].focus();
                            }
                        },
                        buttons:[
                        {
                            icon:perfil.dirImg+'cancelar.png',
                            iconCls:'btn',
                            id:'btnCancAdd',
                            text:etiquetas.lbBtnCancelar,
                            tooltip	: etiquetas.tooltipCancelarVen,
                            handler:function(){
                                winIns.hide();
                                allChequed = [];
                            }
                        },
                        {
                            icon:perfil.dirImg+'aceptar.png',
                            iconCls:'btn',
                            nextTab:'denominacion',
                            prevTab:'btnCancAdd',
                            text:etiquetas.lbBtnAceptar,
                            tooltip	: etiquetas.tooltipAceptarVen,
                            handler:function(){
                                adicionarAccion();
                            }
                        }]
                    });
                }
                regRecursos.getForm().reset();
                winIns.add(panelAdicionar);
                winIns.doLayout();
                winIns.show();
                arbolRecursos.getRootNode().reload();
                Ext.getCmp('denominacion').focus(false,200);
            }
            break;
            case 'Mod':{
                if(!winMod) {
                    winMod= new Ext.Window({
                        modal: true,
                        closeAction:'hide',
                        layout:'fit',
                        title:etiquetas.lbTitModificarAcc,
                        width:550,
                        height:390,
                        listeners:{
                            hide: function () {
                                panelCentral.getTopToolbar().items.items[0].focus();
                            }
                        },
                        buttons:[
                        {
                            icon:perfil.dirImg+'cancelar.png',
                            iconCls:'btn',
                            id:'btnCancUpd',
                            text:etiquetas.lbBtnCancelar,
                            tooltip	: etiquetas.tooltipCancelarVen,
                            handler:function(){
                                winMod.hide();
                                allChequed = [];
                            }
                        },
                        {
                            icon:perfil.dirImg+'aceptar.png',
                            iconCls:'btn',
                            text:etiquetas.lbBtnAceptar,
                            nextTab:'denominacion',
                            prevTab:'btnCancUpd',
                            tooltip	: etiquetas.tooltipAceptarVen,
                            handler:function(){
                                modificarAccion();
                            }
                        }]
                    });
                }
                winMod.add(panelAdicionar);
                winMod.doLayout();
                winMod.show();
                arbolRecursos.getRootNode().reload();
                regRecursos.getForm().loadRecord(sm.getSelected());
                Ext.getCmp('denominacion').focus(false,200);
            }
            break;
        }
    }

    ////------------ Función para obtener los nodos marcados ------------////
    function obtenerNodosMarcados() {
        var root =arbolRecursos.getRootNode();
        var array=[];
        root.cascade(function(n) {
            if(n!=root) {
                var checked=false;
                if(!n.isLeaf() && n.attributes.type == 'funcionalidad') {
                    checked=arbolRecursos.getChecked(null,n);
                    if(checked && checked.length > 0) {
                        var aux=[];
                        for(i=0;i<checked.length;i++) {
                            if(checked[i].getUI().isChecked())
                                aux.push(checked[i].attributes.idaccion);
                        }
                        array.push({
                            idfuncionalidadasociada:n.attributes.idfuncionalidad,
                            acciones:aux
                        });
                    }
                }
            }
        });
        return array;
    }

    ////------------ Función para obtener los nodos a eliminar ------------////
    function obtenerNodosElim() {
        var root =arbolRecursos.getRootNode();
        var array=[];
        root.cascade(function(n) {
            if(n!=root) {
                var checked=false;
                if(!n.isLeaf() && n.attributes.type == 'funcionalidad') {
                    checked=arbolRecursos.getChecked(null,n);
                    var eliminados=[];
                    for(j=0;j<allChequed.length;j++) {
                        var esta=false;
                        for(k=0;k<checked.length;k++) {
                            if(allChequed[j]==checked[k]) {
                                esta=true;
                                break;
                            }
                        }
                        if(!esta)
                            eliminados.push(allChequed[j]);

                    }
                    checked=eliminados;
                    if(checked && checked.length > 0) {
                        var aux=[];
                        var pertenece=false;
                        for(i=0;i<checked.length;i++)  {
                            pertenece = checked[i].attributes.idfuncionalidad==n.attributes.idfuncionalidad;
                            aux.push(checked[i].attributes.idaccion);
                        }
                        if(pertenece)
                            array.push({
                                acciones:aux
                            });
                    }
                }
            }
        });
        return array;
    }

    ////------------ Adicionar grupos de recursos ------------////
    function adicionarAccion() {
        if (regRecursos.getForm().isValid()) {
            var arrayNodes = [];
            arrayNodes = obtenerNodosMarcados();
            if(arrayNodes.length == 0) {
                mostrarMensaje(3,etiquetas.errorMsgRecursos, focusRecurso);
                return;
            }
            Secodena.mostrarMascara('maskConexion',etiquetas.msgWait,etiquetas.msgAdd);
            regRecursos.getForm().submit({
                url:'insertarRecursos',
                waitMsg:etiquetas.lbMsgEsperaInsAcc,
                params:{
                    arrayNodesChecked:Ext.encode(arrayNodes),
                    idfuncionalidad:arbolAcc.getSelectionModel().getSelectedNode().attributes.idfuncionalidad
                },
                failure: function(form, action) {
                    Secodena.ocultarMascara('maskConexion');
                    if(action.result.codMsg != 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        regRecursos.getForm().reset();
                        winIns.hide();
                        storeGrid.reload();
                        sm.clearSelections();
                        btnModificar.disable();
                        btnEliminar.disable();
                        arbolRecursos.getRootNode().reload();
                        allChequed = [];
                    }
                    if(action.result.codMsg == 3)
                        mostrarMensaje(action.result.codMsg,action.result.mensaje, focusRecurso);

                }
            });
        }
        else
            mostrarMensaje(3,etiquetas.lbMsgErrorEnCamops, focusRecurso);
    }

    ////------------ Modififcar Accion ------------////
    function modificarAccion() {
        var arrayNodesElim = [];
        arrayNodes 	= obtenerNodosMarcados();
        arrayNodesElim 	= obtenerNodosElim();
        if (regRecursos.getForm().isValid()) {
            Secodena.mostrarMascara('maskRecursoMod',etiquetas.msgWait,etiquetas.msgMod);
            regRecursos.getForm().submit({
                url:'modificarRecursos',
                waitMsg:etiquetas.lbMsgEsperaModAcc,
                params:{
                    arrayNodesChecked:Ext.encode(arrayNodes),
                    idfuncionalidad:arbolAcc.getSelectionModel().getSelectedNode().attributes.idfuncionalidad,
                    idrecurso:sm.getSelected().data.idrecurso,
                    arrayNodesElim:Ext.encode(arrayNodesElim)
                },
                failure: function(form, action) {
                    Secodena.ocultarMascara('maskRecursoMod');
                    if(action.result.codMsg == 1) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        storeGrid.reload();
                        winMod.hide();
                        btnModificar.disable();
                        btnEliminar.disable();
                        arbolRecursos.getRootNode().reload();
                        allChequed = [];
                        arrayNodesElim = [];
                    }
                    if(action.result.codMsg == 2) {
                        mostrarMensaje(2,action.result.mensaje,
                            function elimina(btnPresionado) {
                                if (btnPresionado == 'ok') {
                                    Secodena.ocultarMascara('maskRecursoMod');
                                    var arrayRecursosElim = [];
                                    arrayRecursosElim.push(sm.getSelected().data.idrecurso);
                                    Ext.Ajax.request({
                                        url: 'eliminarRecursos',
                                        method:'POST',
                                        params:{
                                            arrayRecursosElim:Ext.encode(arrayRecursosElim)
                                        },
                                        callback: function (options,success,response){
                                            responseData = Ext.decode(response.responseText);
                                            if(responseData.codMsg == 1) {
                                                winMod.hide();
                                                mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                                storeGrid.reload();
                                                btnModificar.disable();
                                                btnEliminar.disable();
                                                arbolRecursos.getRootNode().reload();
                                                allChequed = [];
                                                arrayNodesElim = [];
                                            }
                                            if(responseData.codMsg == 3)
                                                mostrarMensaje(responseData.codMsg,responseData.mensaje, focusRecurso);
                                        }
                                    });
                                }
                                else
                                    Secodena.ocultarMascara('maskRecursoMod');
                            });
                    }
                    if(action.result.codMsg == 3)
                        mostrarMensaje(action.result.codMsg,action.result.mensaje, focusRecurso);

                }
            });
        }
        else
            mostrarMensaje(3,etiquetas.lbMsgErrorEnCamops, focusRecurso);
    }

    ////------------ Eliminar Accion ------------////
    function eliminarAccion() {
        var arrRecursosElim = sm.getSelections();
        var arrayRecursosElim = [];
        for (var i=0;i<arrRecursosElim.length;i++) {
            arrayRecursosElim.push(arrRecursosElim[i].data.idrecurso);
        }
        if(arrayRecursosElim.length > 1)
            mostrarMensaje(2,etiquetas.lbMsgDeseaEliminar,elimina);
        else
            mostrarMensaje(2,etiquetas.lbMsgDeseaEliminarS,elimina);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                Secodena.mostrarMascara('maskRecursoDel',etiquetas.msgWait,etiquetas.msgDEL);
                Ext.Ajax.request({
                    url: 'eliminarRecursos',
                    method:'POST',
                    params:{
                        arrayRecursosElim:Ext.encode(arrayRecursosElim)
                    },
                    callback: function (options,success,response){
                        Secodena.ocultarMascara('maskRecursoDel');
                        responseData = Ext.decode(response.responseText);
                        if(responseData.codMsg == 1) {
                            mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            storeGrid.reload();
                            sm.clearSelections();
                            btnModificar.disable();
                            btnEliminar.disable();
                        }
                        if(responseData.codMsg == 3)
                            mostrarMensaje(responseData.codMsg,responseData.mensaje, focusRecurso);
                    }
                });
            }
            else
                Secodena.ocultarMascara('maskRecursoDel');
        }
    }

    ////------------ Buscar Accion ------------////
    function buscaraccion(accion) {
	    if(Ext.getCmp('nombreaccion').validate()==true){
		    busqueda_grid = true;
		    storeGrid.load({
			    params:{
				    buscar:accion,
				    idfuncionalidad:arbolAcc.getSelectionModel().getSelectedNode().attributes.idfuncionalidad,
				    start:0,
				    limit:20
			    }
		    });
	    }  else
		    mostrarMensaje(3, etiquetas.lbMsgErrorEnCamops);
    }

    function clearFilters() {
        accion.reset();
        storeGrid.baseParams = {};
        storeGrid.load({
            params:{
                start:0,
                limit:15
            }
        });
	    focusRecurso();
    }

    function cargarAyuda(){
        var title	= 'Ayuda de recursos';
        var referencia	= 'seguridad/gestrecursos';
        help.show(title,referencia);
    }
}