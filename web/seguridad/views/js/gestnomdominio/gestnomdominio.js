UCID.portal.cargarEtiquetas('gestnomdominio',cargarInterfaz);
// 3. Inicializo el singlenton QuickTips
Ext.QuickTips.init();


//4 declarar variables
var winIns, winMod,regServ,modificar = 0, arregloDeschequeados = [], arrayPadresEliminar = [], arrayTiene = [];
var busqueda_grid = false;
////------------ Area de Validaciones ------------////

function cargarInterfaz(perfil,etiquetas) {
    //botones
    btnAdicionar 	= new Ext.Button({
        id			: 'btnAgr',
        hidden	: true,
        //icon		: perfil.dirImg+'adicionar.png',
        iconCls		: 'adicionar',
        text		: etiquetas.lbBtnAdicionar,
        tooltip		: etiquetas.textToolTipadicionar,
        prevTab 	: 'btnClearField',
        hotKey		: {
            idGrupo		  :'grid1',
            config  	  : {
                key		  : 105,
                alt		  : true
            }
        },
        handler:function() {
            winForm('Ins');
        }
    });

    btnModificar 	= new Ext.Button({
        disabled	: true,
        id			: 'btnMod',
        hidden	: true,
        //icon		: perfil.dirImg+'modificar.png',
        iconCls		: 'modificar',
        text		: etiquetas.lbBtnModificar,
        tooltip		: etiquetas.textToolTipMod,
        hotKey		: {
            idGrupo		  :'grid1',
            config  	  : {
                key		  : 109,
                alt		  : true
            }
        },
        handler:function() {
            if(sm.getCount() >= 1)
                winForm('Mod');
        }
    });

    btnEliminar 	= new Ext.Button({
        disabled	: true,
        id			: 'btnEli',
        hidden	: true,
        //icon		: perfil.dirImg+'eliminar.png',
        iconCls		: 'eliminar',
        text		: etiquetas.lbBtnEliminar,
        tooltip		: etiquetas.textToolTipDel,
        hotKey		: {
            idGrupo		  : 'grid1',
            config  	  : {
                key       : Ext.EventObject.DELETE,
                stopEvent : true
            }
        },
        handler:function() {
            if(sm.getCount() >= 1)
                eliminardominio();
        }
    });
    btnAyuda = new Ext.Button({
        id: 'btnAyuDesktop',
        iconCls: 'ayuda',
        text: '<b>Ayuda</b>',
        disabled: false,
        nextTab:'dominio',
        toolTip: etiquetas.textToolTipHelp,
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
                    }, text: 'Ayuda',
                    id: 'btnAyuRel',
                    //icon: perfil.dirImg + 'ayuda.png',
                    iconCls: 'ayuda',
                    tooltip: 'Ayuda del sistema'
                },
                {
                    text: 'Acerca de',
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
    /**btnAyuda = new Ext.Button({
        id:'btnAyu',
        icon:perfil.dirImg+'ayuda.png',
        iconCls:'btn',
        nextTab:'dominio',
        text:etiquetas.lbBtnAyuda,
        tooltip		: etiquetas.textToolTipHelp,
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

    UCID.portal.cargarAcciones(window.frameElement.id, enfocarElemento);

    function focusADD() {
        btnAdicionar.focus(200);
    }

    //Store del Grid
    var stGpDominio =  new Ext.data.Store({
        url: 'cargardominios',
        listeners:{
            load : function() {
                if(stGpDominio.getCount() == 0 ) {
                    if(dendominio.getValue())
                        Ext.Msg.show({
			   title:etiquetas.msgInf,
			   msg: etiquetas.msgInfDatosMostrar,
			   buttons: Ext.Msg.OK,
                           fn:focusADD,
			   icon: Ext.MessageBox.INFO
			});
                    else if(busqueda_grid) {
                        Ext.Msg.show({
			   title:etiquetas.msgInf,
			   msg: etiquetas.msgInfDatos,
			   buttons: Ext.Msg.OK,
                           fn:focusADD,
			   icon: Ext.MessageBox.INFO
			});
                        busqueda_grid = false;
                    }
                }
            }

        },
        reader:new Ext.data.JsonReader({
            totalProperty: "cant",
            root: "datos",
            id: "iddominio"
        }, [
        {
            name:'iddominio'
        },

        {
            name:'denominacion'
        },

        {
            name:'descripcion'
        },

        {
            name:'seguridad'
        }
        ] )
    });

    // Establesco modo de seleccion de grid (single)
    sm = new Ext.grid.RowSelectionModel({
        singleSelect:true
    });

    sm.on('beforerowselect', function (smodel, rowIndex, keepExisting, record){
        btnEliminar.disable();
        btnModificar.enable();
        if(!record.data.seguridad == 1)
            btnEliminar.enable();
    }, this);

    // Defino el grid de Dominios
    var GpDominio = new Ext.grid.GridPanel({
        title: etiquetas.MsgGridDominio,
        cls:'x-toolbar',
        border:false,
        frame:false,
        region:'center',
        autoExpandColumn:'expandir',
        store:stGpDominio,
        sm:sm,
        columns: [
        {
            hidden: true,
            hideable: false,
            dataIndex: 'iddominio'
        },

        {
            hidden: true,
            hideable: false,
            dataIndex: 'seguridad'
        },

        {
            header: etiquetas.lbTitDenominacion,
            width:400,
            dataIndex: 'denominacion',
            sortable : true
        },

        {
            id:'expandir',
            header: etiquetas.lbTitDescripcion,
            width:300,
            dataIndex: 'descripcion',
            sortable : true
        }
        ],
        loadMask:{
            store:stGpDominio
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 15,
            id: 'ptbaux',
            store: stGpDominio,
            displayInfo: true,
            displayMsg: etiquetas.lbMsgbbarI,
            emptyMsg: etiquetas.lbMsgbbarII
        })
    });

    var dendominio = new Ext.form.TextField({
        fieldLabel:etiquetas.lbTitDenBuscarDominio,
        anchor:"98%",
        width:150,
        maxLength:40,
        colWidth:.3,
        emptyText: etiquetas.emptytext,
        id: 'dominio'
    });

    var btnBuscar = new Ext.Button({
        //icon	: perfil.dirImg+'buscar.png',
        id		: 'btnBuscarGrid',
        nextTab : 'btnClearField',
        prevTab : 'dominio',
        iconCls	: 'buscar',
        text	: etiquetas.lbBtnBuscarDominio,
        tooltip		: etiquetas.textToolTipSearch,
        hotKey		: {
            idGrupo		  :'grid1',
            config  	  :{
                key		  : 98,
                alt		  : true
            }
        },
        handler	: function(){
            buscarnombredominio(dendominio.getValue());
        }
    });

    var btnClear = new Ext.Button({
       // icon	: perfil.dirImg+'limpiar.png',
        id		: 'btnClearField',
        nextTab : 'btnAgr',
        prevTab : 'btnBuscarGrid',
        iconCls	: 'limpiar',
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
        elementos : [dendominio],
        botones:[btnBuscar, btnClear]
    })

    // Defino el panel de dominios
    var panel = new Ext.Panel({
        layout		:'border',
        id			: 'grid1',
        keyMapGroup	: true,
        items:[fpFiltro, GpDominio],
        tbar:[btnAdicionar,btnModificar,btnEliminar,'->',btnAyuda]
    });

    ////--------------Funciones usadas en las TC------------////
    panel.on('afterlayout',function() {
        panel.habilitarKeyMap();
    });

    function enfocarElemento() {
        panel.getTopToolbar().items.items[0].focus();
    }

    stGpDominio.load({
        params:{
            start:0,
            limit:15
        }
    });

    var vpServidorAut = new Ext.Viewport({
        layout:'fit',
        items:panel
    })

    regDominio = new Ext.FormPanel({
        labelAlign: 'top',
        frame:true,
        region:'west',
        width:200,
        bodyStyle:'padding:5px 5px 0',
        items: [{
            layout:'column',
            items:[{
                columnWidth:1,
                layout:'form',
                items:[{
                    xtype:'textfield',
                    fieldLabel:etiquetas.lbFLDenominacion,
                    id:'denominacion',
                    maxLength:40,
                    allowBlank:false,
                    blankText:etiquetas.lbMsgBlank,
                    vtype:'vtalfanumericos',
                    anchor:'100%'
                }]
            },{
                columnWidth:1,
                layout:'form',
                items:[{
                    xtype:'textarea',
                    fieldLabel:etiquetas.lbFLDescripcion,
                    id:'descripcion',
                    maxLength:255,
                    nextTab : 'btnCancelar',
                    prevTab : 'denominacion',
                    height:200,
                    anchor:'100%'
                }]
            }]
        }]
    });

    ////------------ Arbol para cargar las estructuras del Dominio ------------////
    arbolEntidades = new Ext.tree.TreePanel({
        autoScroll:true,
        region:'center',
        split:true,
        width:'37%',
        loader:new Ext.tree.TreeLoader({
            dataUrl:'cargarestructuras',
            listeners:{
                'beforeload':function(atreeloader, anode)
                {
                    atreeloader.baseParams = {};
                    if(modificar > 0) {
                        atreeloader.baseParams.accion = 'modificar';
                        if(sm.getSelected().data.seguridad)
                            atreeloader.baseParams.idseguridad = sm.getSelected().data.iddominio ;
                        atreeloader.baseParams.iddominio = sm.getSelected().data.iddominio;
                        if(anode.attributes.idestructuraop)
                            atreeloader.baseParams.idarea = anode.attributes.idestructuraop;
                        if(anode.attributes.checked && anode.attributes.id != 0)
                            atreeloader.baseParams.tcheck = 'marcado';
                        else if(!anode.attributes.checked && anode.attributes.id != 0)
                            atreeloader.baseParams.tcheck = 'desmarcado';
                    } else {
                        atreeloader.baseParams.accion = 'insertar';
                        if(stGpDominio.getCount() > 0)
                            atreeloader.baseParams.forma = 1;
                        if(anode.attributes.checked && anode.attributes.id != 0)
                            atreeloader.baseParams.tcheck = 'marcado';
                        else if(!anode.attributes.checked && anode.attributes.id != 0)
                            atreeloader.baseParams.tcheck = 'desmarcado';
                    }

                },
                'load':function(atreeloader, anode) {
                    hijosNodo = anode.childNodes;
                    if (hijosNodo.length) {
                        for(i=0; i<hijosNodo.length;i++) {
                            nodoHijo = hijosNodo[i];
                            if (nodoHijo.attributes.checked)
                                adicionarEnDeschequeados(arrayTiene, nodoHijo.attributes.id);
                        }
                    }
                    var id;
                    id = anode.attributes.id;
                    var esta1 = estaEnDeschequeados(arrayPadresEliminar, id);
                    if(esta1 != -1) {
                        eliminarEnDeschequeados(arrayPadresEliminar, esta1);
                        if(arbolEntidades.getChecked("id", anode).length == 0) {
                            hijosNodo = anode.childNodes;
                            for(i=0; i<hijosNodo.length;i++) {
                                if(!hijosNodo[i].isLeaf()) {
                                    id = anode.attributes.id;
                                    adicionarEnDeschequeados(arrayPadresEliminar, id);
                                }
                            }
                        }
                    }
                }
            }
        })
    });

    arbolEntidades.on('checkchange', function (node, e) {
        var esta = estaEnDeschequeados(arregloDeschequeados, node.attributes.id);
        var id;
        id = node.attributes.id;
        var esta1 = estaEnDeschequeados(arrayPadresEliminar, id);
        if(node.attributes.checked) {
            marcarHijos(node, true);
            if(esta != -1)
                eliminarEnDeschequeados(arregloDeschequeados, esta);
            if(!node.isLeaf() && esta1 != -1)
                eliminarEnDeschequeados(arrayPadresEliminar, esta1);
        } else {
            var estaT = estaEnDeschequeados(arrayTiene, id);
            if (estaT != -1)
                adicionarEnDeschequeados(arregloDeschequeados, node.attributes.id);
            if(!node.isLeaf() && node.childNodes.length == 0)
                adicionarEnDeschequeados(arrayPadresEliminar, id);
        }
    }, this);

    ////------------ Crear nodo padre del arbol ------------////
    padreArbolEntidades = new Ext.tree.AsyncTreeNode({
        text: etiquetas.lbArbolEstructura,
        expandable:false,
        id:'0'
    });

    arbolEntidades.setRootNode(padreArbolEntidades);

    ////---------- panel adicionar dominio----------////
    var panelAdicionar = new Ext.Panel({
        layout:'border',
        items:[regDominio,arbolEntidades]
    });

    //Cargar la ventana
    function winForm(opcion){
        switch(opcion){
            case 'Ins':{
                limpiarArreglos();
                if(!winIns){
                    winIns = new Ext.Window({
                        modal: true,
                        closeAction:'hide',
                        layout:'fit',
                        resizable: false,
                        title:etiquetas.lbTitVentanaTitI,
                        width:650,
                        height:400,
                        listeners:{
                            hide:function(w){
                                panel.getTopToolbar().items.items[0].focus();
                            }
                        },
                        buttons:[
                        {
                            //icon:perfil.dirImg+'cancelar.png',
                            iconCls:'cancelar',
                            id : 'btnCancelar',
                            prevTab : 'descripcion',
                            tooltip	: etiquetas.tooltipCancelarVen,
                            text:etiquetas.lbBtnCancelar,
                            handler:function(){
                                winIns.hide();
                            }
                        },{
                            //icon:perfil.dirImg+'aplicar.png',
                            iconCls:'aplicar',
                            text:etiquetas.lbBtnAplicar,
                            tooltip	: etiquetas.tooltipAplicarVen,
                            handler:function(){
                                adicionardominio('apl');
                            }
                        },{
                           // icon:perfil.dirImg+'aceptar.png',
                            iconCls:'aceptar',
                            text:etiquetas.lbBtnAceptar,
                            nextTab : 'denominacion',
                            tooltip	: etiquetas.tooltipAceptarVen,
                            handler:function(){
                                adicionardominio();
                            }
                        }]

                    });
                }
                modificar = 0;
                regDominio.getForm().reset();
                winIns.add(panelAdicionar);
                winIns.doLayout();
                winIns.show();
                arbolEntidades.getRootNode().reload();
                arbolEntidades.expandPath(arbolEntidades.getRootNode().getPath());
                Ext.getCmp('denominacion').focus(false,200);
            }
            break;
            case 'Mod':{
                limpiarArreglos();
                if(!winMod){
                    winMod= new Ext.Window({
                        modal: true,
                        closeAction:'hide',
                        layout:'fit',
                        resizable: false,
                        title:etiquetas.lbTitVentanaTitII,
                        width:650,
                        height:400,
                        listeners:{
                            hide:function(w){
                                panel.getTopToolbar().items.items[0].focus();
                            }
                        },
                        buttons:[
                        {
                            //icon:perfil.dirImg+'cancelar.png',
                            iconCls:'cancelar',
                            id : 'btnCancelar',
                            prevTab : 'descripcion',
                            text:etiquetas.lbBtnCancelar,
                            tooltip	: etiquetas.tooltipCancelarVen,
                            handler:function(){
                                winMod.hide();
                            }
                        },{
                           // icon:perfil.dirImg+'aceptar.png',
                            iconCls:'aceptar',
                            nextTab : 'denominacion',
                            text:etiquetas.lbBtnAceptar,
                            tooltip	: etiquetas.tooltipAceptarVen,
                            handler:function(){
                                modificardominio();
                            }
                        }]

                    });
                }
                modificar = 1;
                winMod.add(panelAdicionar);
                winMod.doLayout();
                winMod.show();
                regDominio.getForm().loadRecord(sm.getSelected());
                arbolEntidades.getRootNode().reload();
                arbolEntidades.expandPath(arbolEntidades.getRootNode().getPath());
                Ext.getCmp('denominacion').focus(false,200);
            }
            break;
        }
    }

    function adicionardominio(apl) {
        if (regDominio.getForm().isValid()) {
            var arrayNodos = arbolEntidades.getChecked();
            var arrayEnt = new Array();
            var arrayPadres = new Array();
            if(arrayNodos==0)
                mostrarMensaje(3,etiquetas.lbMsgSelecEntidad, focusADD());
            else {
                for (var i=0; i<arrayNodos.length; i++) {
                    arrayEnt.push(arrayNodos[i].attributes.id);
                    if(!arrayNodos[i].isLeaf() && arrayNodos[i].childNodes.length == 0)
                        arrayPadres.push(arrayNodos[i].attributes.id);
                }
                Secodena.mostrarMascara('maskDominio',etiquetas.msgWait,etiquetas.msgAdd);
                regDominio.getForm().submit({
                    url:'insertarnomdominio',
                    timeout:1800000,
                    params:{
                        arrayEntidades:Ext.encode(arrayEnt),
                        arrayPadres:Ext.encode(arrayPadres)
                    },
                    failure: function(form, action) {
                        Secodena.ocultarMascara('maskDominio');
                        if(action.result.cod != 3) {
                            mostrarMensaje(action.result.cod,action.result.mensaje, focusADD());
                            regDominio.getForm().reset();
                            limpiarArreglos();
                            if(!apl)
                                winIns.hide();
                            arrayNodos = arbolEntidades.getChecked();
                            for (var i=0; i<arrayNodos.length; i++) {
                                cambiarEstadoCheck(arrayNodos[i], false);
                            }
                            stGpDominio.reload();
                            sm.clearSelections();
                            btnModificar.disable();
                            btnEliminar.disable();
                        }
                        if(action.result.cod == 3) mostrarMensaje(action.result.cod,action.result.mensaje, focusADD());
                    }
                });
            }
        }
        else  mostrarMensaje(3,etiquetas.lbMsgErrorEnCamops, focusADD());
    }

    //////////Modififcar campo///////////////
    function modificardominio() {
        if (regDominio.getForm().isValid()) {
            arrayNodos = arbolEntidades.getChecked();
            var arrayEnt = new Array();
            var arrayPadres = new Array();
            buscarNodosTiene(arbolEntidades.getRootNode());
            var ins = 'mod';
            if(arrayNodos.length > 0) {
                for (var i=0; i<arrayNodos.length; i++) {
                    arrayEnt.push(arrayNodos[i].attributes.id);
                    if(!arrayNodos[i].isLeaf() && arrayNodos[i].childNodes.length == 0) {
                        arrayPadres.push(arrayNodos[i].attributes.id);
                    }
                }
            }
            Secodena.mostrarMascara('maskDominioMod',etiquetas.msgWait,etiquetas.msgMod);
            regDominio.getForm().submit ({
                url:'modificarnomdominio',
                timeout:1800000,
                params:{
                    iddominio:sm.getSelected().data.iddominio,
                    arrayEntidades: Ext.encode(arrayEnt),
                    arrayEntidadesEliminar:Ext.encode(arregloDeschequeados),
                    seguridad:sm.getSelected().data.seguridad,
                    arrayPadres:Ext.encode(arrayPadres),
                    arrayPadresEliminar:Ext.encode(arrayPadresEliminar),
                    arrayTiene:Ext.encode(arrayTiene)
                },
                failure: function(form, action) {
                    Secodena.ocultarMascara('maskDominioMod');
                    limpiarArreglos();
                    if(action.result.cod != 3) {
                        mostrarMensaje(action.result.cod,action.result.mensaje, focusADD());
                        stGpDominio.reload();
                        winMod.hide();
                    }
                    if(action.result.cod == 3)
                        mostrarMensaje(action.result.cod,action.result.mensaje, focusADD());
                }
            });
        }
        else
            mostrarMensaje(3,etiquetas.lbMsgErrorEnCamops, focusADD());
    }

    function buscarNodosTiene(nodo) {
        nodo.eachChild(function(anodehijo) {
            if(!anodehijo.attributes.checked && !anodehijo.isLeaf() && anodehijo.attributes.tiene && anodehijo.childNodes.length == 0)
                arrayTiene.push(anodehijo.attributes.id);
            if(anodehijo.childNodes.length > 0)
                buscarNodosTiene(anodehijo);

        },this);
    }

    function eliminardominio(){
        mostrarMensaje(2,etiquetas.lbMsgFunEliminarMsg,elimina);
        function elimina(btnPresionado){
            Secodena.mostrarMascara('maskDominioDel',etiquetas.msgWait,etiquetas.msgDEL);
            if (btnPresionado == 'ok'){
                Ext.Ajax.request({
                    url: 'eliminarnomdominio',
                    method:'POST',
                    params:{
                        iddominio:sm.getSelected().data.iddominio
                    },
                    callback: function (options,success,response) {
                        Secodena.ocultarMascara('maskDominioDel');
                        responseData = Ext.decode(response.responseText);
                        mostrarMensaje(responseData.cod,responseData.mensaje, focusADD());
                        if(responseData.cod == 1) {
                            mostrarMensaje(responseData.cod,responseData.mensaje, focusADD());
                            stGpDominio.reload();
                            sm.clearSelections();
                            btnModificar.disable();
                            btnEliminar.disable();
                        }
                    }
                });
            } else
                Secodena.ocultarMascara('maskDominioDel');
        }
    }

    ////------------ Auxiliar para marcar y desmarcar nodos ------------////
    function cambiarEstadoCheck(anodehijo,check) {
        if(anodehijo.attributes.checked != check) {
            anodehijo.getUI().toggleCheck(check);
        }
    }

    function estaEnDeschequeados(arreglonodos, idnodo) {
        var cantidad = arreglonodos.length;
        for (p=0; p<cantidad; p++) {
            if(arreglonodos[p] == idnodo)

                return p;
        }
        return -1;
    }

    function eliminarEnDeschequeados(arreglo, pos) {
        arreglo.splice(pos,1);
    }

    function adicionarEnDeschequeados(arreglo, id) {
        if(estaEnDeschequeados(arreglo, id) == -1)
            arreglo.push(id);
    }

    function limpiarArreglos() {
        arregloDeschequeados = [];
        arrayPadresEliminar = [];
        arrayTiene = [];
    }

    function marcarHijos(nodo,check) {
        nodo.eachChild(function(anodehijo) {
            if(anodehijo.attributes.checked != check)
                cambiarEstadoCheck(anodehijo,check);
            if(anodehijo.childNodes.length > 0)
                marcarHijos(anodehijo, check);
        },this);
    }

    function buscarnombredominio(dendominio) {
        busqueda_grid = true;
        stGpDominio.baseParams = {};
        stGpDominio.baseParams.dendominio = dendominio;
        stGpDominio.load({
            params:{
                start:0,
                limit:15
            }
        });
    }

    function clearFilters() {
        dendominio.reset();
        stGpDominio.baseParams = {};
        stGpDominio.load({
            params:{
                start:0,
                limit:15
            }
        });
    }

    function cargarAyuda(){
        var title	= 'Ayuda de Seguridad';
        var referencia	= 'seguridad/gestnomdominio';
        help.show(title,referencia);
    }
}
