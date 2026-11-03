UCID.portal.cargarEtiquetas('gestroldominio', cargarInterfaz);

////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();

////------------ Declarar variables ------------////
var nodo,sm, aBandera = false, arrayPadresEliminar = [], arregloDeschequeados = [], arrayTiene = [], panelUsuariosDominios, btnguardarcambios, auxRecord, idrol = 0;

////------------ Funcion Cargar Interfaz ------------////
function cargarInterfaz(perfil,etiquetas) {
    ////------------ Botones ------------////
    btnguardarcambios = new Ext.Button({
        disabled:true,
        //icon:perfil.dirImg+'aceptar.png',
        iconCls:'aceptar',
        text:etiquetas.lbBtnAceptar,
        tooltip	: etiquetas.tooltipAceptarVen
    })
    btnAyuda = new Ext.Button({
        id: 'btnAyuTema',
        iconCls: 'ayuda',
        text: '<b>'+etiquetas.lbBtnAyuda+'</b>',
        disabled: false,
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
                    }, text: etiquetas.lbBtnAyuda,
                    id: 'btnAyuRel',
                    //icon: perfil.dirImg + 'ayuda.png',
                    iconCls: 'ayuda',
                    tooltip: etiquetas.tooltipAyuda
                },
                {
                    text: etiquetas.lbBtnAcercaDe,
                    id: 'acercade',
                   // icon: perfil.dirImg + 'info.png',
                    iconCls: 'info',
                    tooltip: etiquetas.lbBtnAcercaDe+" <b>(Alt+...s)</b>",
                    handler: function () {

                        var uri = "seguridad";
                        acercaDe.show(uri);
                    }}
            ]
        })

    });
    /**btnAyuda = new Ext.Button({
        id:'btnAyuTema',
        icon:perfil.dirImg+'ayuda.png',
        iconCls:'btn',
        text:etiquetas.lbBtnAyuda,
        tooltip		: etiquetas.textToolTipHelp,
        hotKey		: {
            idGrupo		  :'grid1',
            config  	  :{
                key		  : 104,
                alt		  : true
            }
        },
        handler:function() {
            cargarAyuda();
        }
    });*/
    ////------------ Modo de seleccion del grid de usuarios ------------////
    sm = new Ext.grid.RowSelectionModel({
        singleSelect:true
    });
    ////------------ Eventos ------------////
    sm.on('rowselect', function (smodel, rowIndex, record) {
        idrol = record.data.idrol;
        arbolDominios.enable();
        btnguardarcambios.enable();
        arbolDominios.getRootNode().reload();
        auxRecord = record;
    }, this);
    sm.on('rowdeselect', function (SelectionModel, rowIndex, record) {
        asignarUsuarioDominio(null, record);
    }, this);

    ////------------Store para cargar el grid de roles---------------////
    storeGridRoles =  new Ext.data.Store({
        url: 'cargarRolDominio',
        listeners: {
            load : function() {
                if(storeGridRoles.getCount() == 0 ) {
                    if(Ext.getCmp('denrolbuscado').getValue())
                        /**Ext.Msg.show({
                            title:etiquetas.msgInf,
                            msg: etiquetas.msgInfDatosMostrar,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.INFO
                        })*/
                        mostrarMensaje(1, perfil.etiquetas.msgInfDatosMostrar);
                }
            }
        },
        reader:new Ext.data.JsonReader({
            totalProperty: "cantidad_filas",
            root: "datos",
            id: "idrol"
        },
        [
        {
            name:'idrol',
            mapping:'idrol'
        },

        {
            name:'denominacion',
            mapping:'denominacion'
        }
        ])
    });
    ////------------ Creando el Grid de roles ------------////
    gridRoles = new Ext.grid.GridPanel({
        region:'west',
        frame:false,
        border:false,
        width:470,
        iconCls:'icon-grid',
        autoExpandColumn:'expandir',
        margins:'2 2 2 -4',
        store:storeGridRoles,
        sm:sm,
        columns: [
        {
            header: etiquetas.lbRol,
            width:150,
            dataIndex: 'denominacion',
            id:'expandir',
            sortable : true
        },

        {
            hidden: true,
            hideable: false,
            dataIndex: 'idrol'
        }
        ],

        loadMask:{
            store:storeGridRoles
        },

        tbar:[
        new Ext.Toolbar.TextItem({
            text:etiquetas.lbTitDenRolBuscar
        }),
        denrolbuscado = new Ext.form.TextField({
            width:150,
            id: 'denrolbuscado',
	        vtype: 'vtalfanumericosguiones',
	        maxLength: 60,
            emptyText: etiquetas.emptytext
        }),
        new Ext.menu.Separator(),
        new Ext.Button({
            //icon:perfil.dirImg+'buscar.png',
            id:'brnBuscarRolDominio',
            iconCls:'buscar',
            text:etiquetas.lbBtnBuscar,
            tooltip: etiquetas.textToolTipSearch,
            hotKey		: {
                idGrupo		  :'grid1',
                config  	  :{
                    key		  : 98,
                    alt		  : true
                }
            },
            handler:function(){
                buscarnombrerol(denrolbuscado.getValue());
            }
        }),
        new Ext.Button({
           // icon:perfil.dirImg+'limpiar.png',
            iconCls:'limpiar',
            id : 'cleaneap',
            text:etiquetas.denomLimpiar,
            tooltip:etiquetas.cleanFilter,
            hotKey		: {
                idGrupo		  :'grid1',
                config  	  :{
                    key		  : 108,
                    alt		  : true
                }
            },
            handler:function(){
                limpiarFiltro();
            }
        })
        ],
        bbar:new Ext.PagingToolbar({
            pageSize: 15,
            beforePageText:etiquetas.textPagina,
            afterPageText:etiquetas.textDe,
            store: storeGridRoles,
            displayInfo: true,
            displayMsg: etiquetas.lbTitMsgResultados,
            emptyMsg: etiquetas.lbTitMsgNingunresultadoparamostrar
        })
    });

    /////------------ Arbol de entidades que estan en mi dominio ------------////
    arbolDominios = new Ext.tree.TreePanel({
        autoScroll:true,
        region:'center',
        split:true,
        disabled:true,
        disabledClass:'panel-disabled-class-without-zindex',
        width:'37%',
        loader:new Ext.tree.TreeLoader({
            dataUrl:'cargarArbolDominios',
            listeners:{
                'beforeload':function(atreeloader, anode){
                    atreeloader.baseParams = {};
                    atreeloader.baseParams.idrol = sm.getSelected().data.idrol;

                }
            }
        })
    });
    ////------------ Crear nodo padre del arbol ------------////
    padreArbolDominios= new Ext.tree.AsyncTreeNode({
        text: etiquetas.lbDominio,
        expandable:false,
        id:'0'
    });

    arbolDominios.setRootNode(padreArbolDominios);

    btnguardarcambios.on('click',function(){
        asignarUsuarioDominio(null, 0)
        arbolDominios.disable();
        arbolDominios.getRootNode().reload();
        sm.clearSelections();
        btnguardarcambios.disable();
    })
    arbolDominios.on('checkchange', function (node, e)
    {
        var esta = estaEnDeschequeados(arregloDeschequeados, node.attributes.id);
        var id = node.attributes.id;
        var esta1 = estaEnDeschequeados(arrayPadresEliminar, id);

        if(node.attributes.checked)
        {
            marcarHijos(node, true);
            if(esta != -1)
                eliminarEnDeschequeados(arregloDeschequeados, esta);
            if(!node.isLeaf() && esta1 != -1)
                eliminarEnDeschequeados(arrayPadresEliminar, esta1);
        }
        else
        {
            aBandera = false;
            adicionarEnDeschequeados(arregloDeschequeados, node.attributes.id);
            if(!node.isLeaf() && node.childNodes.length == 0)
                adicionarEnDeschequeados(arrayPadresEliminar, id);
        }
    }, this);
    ////------------ Panel con los componentes de roles y entidades ------------////
    panelUsuariosDominios = new Ext.Panel({
        layout:'border',
        region:'center',
        id			: 'grid1',
        keyMapGroup	: true,
        tbar:['->',btnAyuda],
        items:[gridRoles,arbolDominios],
        buttons:[btnguardarcambios]
    });

    panelUsuariosDominios.on('afterlayout',function() {
        panelUsuariosDominios.habilitarKeyMap();
    });

    function enfocarElemento() {
        Ext.getCmp('brnBuscarRolDominio').focus();
    }
    ////------------ Viewport ------------////
    viewport = new Ext.Viewport({
        layout:'border',
        items:[panelUsuariosDominios]
    })
    storeGridRoles.load({
        params:{
            start:0,
            limit:15
        }
    });

    enfocarElemento();

    ////------------- Funciones -------------////
    function asignarUsuarioDominio(apl, record) {
        if (!idrol)
            return;
        var arrayNodos = arbolDominios.getChecked();
        var arrayEnt = new Array();
        var arrayPadres = new Array();
        var arrayarbol = new Array();
        buscarNodosTiene(arbolDominios.getRootNode());
        if(arrayNodos.length > 0) {
            for (var i=0; i<arrayNodos.length; i++) {
                arrayEnt.push(arrayNodos[i].attributes.id);
                if(!arrayNodos[i].isLeaf() && arrayNodos[i].childNodes.length == 0) {
                    arrayPadres.push(arrayNodos[i].attributes.id);
                }
            }
        }
        Ext.getBody().mask('Por favor espere....');
        Ext.Ajax.request({
            url: 'insertarRolesDominios',
            method:'POST',
            params:{
                arrayDominios: Ext.encode(arrayEnt),
                arrayDominiosEliminar:Ext.encode(arregloDeschequeados),
                arrayPadres:Ext.encode(arrayPadres),
                arrayPadresEliminar:Ext.encode(arrayPadresEliminar),
                idrol:idrol
            },
            callback: function (options,success,response) {
                Ext.getBody().unmask();
                arrayPadresEliminar = [];
                arregloDeschequeados = [];
                arrayTiene = [];
                responseData = Ext.decode(response.responseText);
            }
        });
    }
    ////------------ Funciones Auxiliares ------------////
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

    ////------------ Auxiliar para marcar y desmarcar nodos ------------////
    function cambiarEstadoCheck(anodehijo,check) {
        if(anodehijo.attributes.checked != check) {
            anodehijo.getUI().toggleCheck(check);
            anodehijo.attributes.checked = check;
            banderaClick = false;
            anodehijo.fireEvent('checkchange',anodehijo,check);
        }
    }

    function buscarNodosTiene(nodo) {
        nodo.eachChild(function(anodehijo) {
            if(!anodehijo.attributes.checked && !anodehijo.isLeaf() && anodehijo.attributes.tiene && anodehijo.childNodes.length == 0)
                arrayTiene.push(anodehijo.attributes.id);
            if(anodehijo.childNodes.length > 0)
                buscarNodosTiene(anodehijo);

        },this);
    }

    function marcarArriba(nodo) {
        if(nodo.attributes.id != 0) {
            if(estadoTodosHijos(nodo.parentNode, true))
                cambiarEstadoCheck(nodo.parentNode,true);
            marcarArriba(nodo.parentNode);
        }
    }

    function desmarcarArriba(nodo) {
        aBandera = true;
        if(nodo.attributes.id != 0) {
            cambiarEstadoCheck(nodo.parentNode,false);
            if(nodo.parentNode.attributes.id >= 0) {
                desmarcarArriba(nodo.parentNode);
            }
        }
    }

    function marcarHijos(nodo,check) {
        nodo.eachChild(function(anodehijo) {
            if(anodehijo.attributes.checked != check)
                cambiarEstadoCheck(anodehijo,check);
            if(anodehijo.childNodes.length > 0)
                marcarHijos(anodehijo, check);
        },this);
    }
    ////------------ Buscar Usuarios ------------////
    function buscarnombrerol(denrol) {
	    if(Ext.getCmp('denrolbuscado').validate()==true){
		    storeGridRoles.baseParams.denrolbuscado = denrol;
		    storeGridRoles.load({
			    params:{
				    start:0,
				    limit:15
			    }
		    });
	    }   else
		    mostrarMensaje(3,etiquetas.lbMsgErrorEnCamops);
    }

    function limpiarFiltro() {
        Ext.getCmp('denrolbuscado').reset();
        storeGridRoles.baseParams = {};
        storeGridRoles.load({
            params:{
                start:0,
                limit:15
            }
        });
	    enfocarElemento();
    }

    function cargarAyuda() {
        var title	= 'Ayuda de compartimentaci&oacute; de roles';
        var referencia	= 'seguridad/compartimentacionRoles';
        help.show(title,referencia);
    }
}