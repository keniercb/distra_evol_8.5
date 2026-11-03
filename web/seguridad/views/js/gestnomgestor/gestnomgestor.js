UCID.portal.cargarEtiquetas('gestnomgestor',cargarInterfaz);
////------------- Inicializo el singlenton QuickTips -------------////
Ext.QuickTips.init();
		
////------------- Declarar Variables -------------////
var winIns, winMod;
		
////------------ Area de Validaciones ------------////
var tipos, soloNumeros, busqueda_grid = false;
soloNumeros = /^-?\d*$/;
tipos = /^([a-zA-ZáéíóúñüÑ]+[a-zA-ZáéíóúñüÑ\d\.\-\@\#\_]*)+$/
		
function cargarInterfaz(perfil,etiquetas) {
    ////------------- Botones -------------////
    btnAdicionar = new Ext.Button({
        id:'btnAgrGest',  
        hidden:true, 
        icon:perfil.dirImg+'adicionar.png', 
        iconCls:'btn',
        prevTab 	: 'btnBuscarGrid',
        text:etiquetas.lbBtnAdicionar,
        tooltip		: etiquetas.textToolTipadicionar,
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
		
    btnModificar = new Ext.Button({
        disabled:true,
        id:'btnModGest', 
        hidden:true, 
        icon:perfil.dirImg+'modificar.png', 
        iconCls:'btn', 
        text:etiquetas.lbBtnModificar, 
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
		
    btnEliminar = new Ext.Button({
        disabled:true,
        id:'btnEliGest', 
        hidden:true,
        icon:perfil.dirImg+'eliminar.png',
        iconCls:'btn',
        text:etiquetas.lbBtnEliminar,
        tooltip		: etiquetas.textToolTipDel,
        hotKey		: {
            idGrupo		  : 'grid1',
            config  	  : {
                key			  : Ext.EventObject.DELETE,
                stopEvent 	  : true
            }
        },
        handler:function() {
            if(sm.getCount() >= 1)
                eliminargestor();
        }
    });
    btnAyuda = new Ext.Button({
        id: 'btnAyuGest',
        iconCls: 'btn',
        text: '<b>Ayuda</b>',
        disabled: false,
        nextTab: 'denrol',
        prevTab : 'btnEliGest',
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
                    }, text: 'Ayuda',
                    id: 'btnAyuRel',
                    icon: perfil.dirImg + 'ayuda.png',
                    iconCls: 'btn',
                    tooltip: 'Ayuda del sistema'
                },
                {
                    text: 'Acerca de',
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
        id:'btnAyuGest', 
        icon:perfil.dirImg+'ayuda.png',
        iconCls:'btn',
        text:etiquetas.lbBtnAyuda,
        nextTab: 'denrol',
        prevTab : 'btnEliGest',
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
		
    UCID.portal.cargarAcciones(window.frameElement.id, enfocarElemento);
				
    ////------------- Store del Grid de Gestores -------------////
    stGpGestor =  new Ext.data.Store({
        url: 'cargarnomgestores',
        reader:new Ext.data.JsonReader(
        {
            totalProperty: "cantidad_filas",
            root: "datos",
            id: "id"
        },
        [
        {
            name:'idgestor',
            mapping:'idgestor'
        },

        {
            name:'gestor',
            mapping:'gestor'
        },

        {
            name:'puerto',
            mapping:'puerto'
        },

        {
            name:'descripcion',
            mapping:'descripcion'
        }
        ]
        ),
        listeners : {
            load : function() {
                if(stGpGestor.getCount() == 0 ) {
                    if(gestor.getValue())
                        Ext.Msg.show({
			   title:etiquetas.msgInf,
			   msg: etiquetas.msgInfDatosMostrar,
			   buttons: Ext.Msg.OK,
			   icon: Ext.MessageBox.INFO
			});
                    else if(busqueda_grid) {
                        Ext.Msg.show({
			   title:etiquetas.msgInf,
			   msg: etiquetas.msgInfDatos,
			   buttons: Ext.Msg.OK,
			   icon: Ext.MessageBox.INFO
			});
                        busqueda_grid = false;
                    }
                }
            }
        }
    });
		
    ////------------ Establesco modo de seleccion de grid (single) ---------////
    var sm = new Ext.grid.RowSelectionModel({
        singleSelect:true
    });

    sm.on('beforerowselect', function (smodel, rowIndex, keepExisting, record){
        btnModificar.enable();
        btnEliminar.enable();
    }, this);

    ////---------- Defino el grid de gestores ----------////
    var gpGestor = new Ext.grid.GridPanel({
        title: etiquetas.titleGridRol,
        cls:'x-toolbar',
        border:false,
        frame:false,
        region:'center',
        autoExpandColumn:'expandir',
        store:stGpGestor,
        sm:sm,
        columns: [
        {
            hidden: true, 
            hideable: false,  
            dataIndex: 'idgestor'
        },

        {
            header: etiquetas.lbTitDenominacion, 
            width:200, 
            dataIndex: 'gestor',
            sortable : true
        },

        {
            header: etiquetas.lbTitPuerto, 
            dataIndex: 'puerto',
            sortable : true
        },

        {
            id:'expandir', 
            header: etiquetas.lbTitDescripcion, 
            dataIndex: 'descripcion',
            sortable : true
        }
        ],
        loadMask:{
            store:stGpGestor
        },		
        bbar:new Ext.PagingToolbar({
            pageSize: 15,
            store: stGpGestor,
            id:'ptbaux',
            displayInfo: true,
            displayMsg: etiquetas.lbMsgbbarI,
            emptyMsg: etiquetas.lbMsgbbarII
        })
    });
		
    /////---------------Creando el Tbar del Grid-----------------------/////
    var gestor = new Ext.form.TextField({
        fieldLabel:etiquetas.lbTitDenBuscar,
        anchor:"98%",
        width:150,
        colWidth:.3,
        id: 'denrol',
        prevTab : 'btnAyuGest'
    });
		
    var btnBuscar	= new Ext.Button({
        icon:perfil.dirImg+'buscar.png',
        id: 'btnBuscarGrid', 
        nextTab : 'btnAgrGest',
        prevTab : 'denrol',
        iconCls:'btn',
        text:etiquetas.lbBtnBuscar,
        tooltip		: etiquetas.textToolTipSearch,
        hotKey		: {
            idGrupo		  :'grid1',
            config  	  :{
                key		  : 98,
                alt		  : true
            }
        },
        handler:function(){
            buscargestor(gestor.getValue());
        }
    });
		
    var fpFiltro = new Ext.ToolBar.searchToolBar({
        elementos : [gestor],
        botones:[btnBuscar]
    })
		
    ////------------- Renderiar el arbol -------------////
    var panel = new Ext.Panel({
        layout:'border',
        items:[fpFiltro, gpGestor],
        id			: 'grid1',
        keyMapGroup	: true,
        tbar:[btnAdicionar,btnModificar,btnEliminar,'->',btnAyuda]
    });
		
    ////--------------Funciones usadas en las TC------------////
    panel.on('afterlayout',function() {
        panel.habilitarKeyMap();
    });
		
    function enfocarElemento() {
        panel.getTopToolbar().items.items[0].focus();
    }
		
    stGpGestor.load({
        params:{
            limit:15,
            start:0
        }
    });
		
////------------ ViewPort ------------////
var vpGestGestor = new Ext.Viewport({
    layout:'fit',
    items:panel
})
		
////------------- Formulario -------------////
var regGestor = new Ext.FormPanel({
    labelAlign: 'top',
    frame:true,
    bodyStyle:'padding:5px 5px 0',
    items: [{
        layout:'column',
        items:[{
            columnWidth:.5,
            layout:'form',
            items:[{
                xtype:'textfield',
                fieldLabel:etiquetas.lbFLDenominacion,
                id:'gestor',
                maxLength:40,    
                allowBlank: false,
                blankText:etiquetas.lbMsgBlank,
                vtype:'vtnombre',
                anchor:'95%'
            }]
        },
        {
            columnWidth:.5,
            layout: 'form',
            items: [{
                xtype:'textfield',
                fieldLabel:etiquetas.lbFLPuerto,
                id:'puerto',
                allowBlank: false,
                blankText:etiquetas.lbMsgBlank,
                vtype:'vtnumero4dig',
                maxLength:4,
                anchor:'95%'
            }]
        },
        {
            columnWidth:10,
            layout: 'form',
            items: [{
                xtype:'textarea',
                fieldLabel: etiquetas.lbFLDescripcion,
                id: 'descripcion',
                anchor:'95%'
            }]
        }]
    }]
});

////------------- Cargar la ventana ---------------////
function winForm(opcion){
    switch(opcion){
        case 'Ins':
        {
            if(!winIns)
            {
                winIns = new Ext.Window({
                    modal: true,
                    closeAction:'hide',
                    layout:'fit',
                    title:etiquetas.lbTitVentanaTitI,
                    width:400,
                    height:260,
                    listeners:{
                        hide:function(w){
                            panel.getTopToolbar().items.items[0].focus();
                        }
                    },
                    buttons:[
                    {
                        icon:perfil.dirImg+'cancelar.png',
                        iconCls:'btn',
                        text:etiquetas.lbBtnCancelar,
                        tooltip	: etiquetas.tooltipCancelarVen,
                        handler:function(){
                            winIns.hide();
                        }
                    },
                    {	
                        icon:perfil.dirImg+'aplicar.png',
                        iconCls:'btn',
                        text:etiquetas.lbBtnAplicar,
                        tooltip	: etiquetas.tooltipAplicarVen,
                        handler:function(){
                            adicionargestor('apl');
                        }
                    },
                    {	
                        icon:perfil.dirImg+'aceptar.png',
                        iconCls:'btn',
                        text:etiquetas.lbBtnAceptar,
                        nextTab : 'gestor',
                        tooltip	: etiquetas.tooltipAceptarVen,
                        handler:function(){
                            adicionargestor();
                        }
                    }]
                });
            }		
            regGestor.getForm().reset();	   
            winIns.add(regGestor);
            winIns.doLayout();
            winIns.show();
            Ext.getCmp('gestor').focus(false,200);
        }
        break;
        case 'Mod':{
            if(!winMod)
            {
                winMod= new Ext.Window({
                    modal: true,
                    closeAction:'hide',
                    layout:'fit',
                    title:etiquetas.lbTitVentanaTitII,
                    width:400,
                    height:260,
                    listeners:{
                        hide:function(w){
                            panel.getTopToolbar().items.items[0].focus();
                        }
                    },
                    buttons:[
                    {
                        icon:perfil.dirImg+'cancelar.png',
                        iconCls:'btn',
                        text:etiquetas.lbBtnCancelar,
                        tooltip	: etiquetas.tooltipCancelarVen,
                        handler:function(){
                            winMod.hide();
                        }
                    },
                    {
                        icon:perfil.dirImg+'aceptar.png',
                        iconCls:'btn',
                        nextTab : 'gestor',
                        text:etiquetas.lbBtnAceptar,
                        tooltip	: etiquetas.tooltipAceptarVen,
                        handler:function(){
                            modificargestor();
                        }
                    }]
                });
            }				
            winMod.add(regGestor);
            winMod.doLayout();
            winMod.show();
            regGestor.getForm().loadRecord(sm.getSelected());
            Ext.getCmp('gestor').focus(false,200);
        }
        break;
    }
}

////------------- Adicionar Gestor -------------////
function adicionargestor(apl){
    if (regGestor.getForm().isValid())
    {
        Secodena.mostrarMascara('maskGestor',etiquetas.msgWait,etiquetas.msgAdd);
        regGestor.getForm().submit({
            url:'insertargestor',				
            failure: function(form, action) {
                Secodena.ocultarMascara('maskGestor');
                if(action.result.cod != 3)
                {
                    mostrarMensaje(action.result.cod,action.result.mensaje);
                    regGestor.getForm().reset(); 
                    if(!apl) 
                        winIns.hide();
                    stGpGestor.reload();
                    sm.clearSelections();
                    btnModificar.disable();
                    btnEliminar.disable();
                }
                if(action.result.cod == 3) mostrarMensaje(action.result.cod,action.result.mensaje);
            }	
        });
    }
    else
        mostrarMensaje(3,etiquetas.lbMsgErrorEnCamops);
}
////------------------- Eliminar Gestor ------------------------////
			
function eliminargestor() {
    mostrarMensaje(2,etiquetas.lbMsgFunEliminarMsgI,elimina);
    function elimina(btnPresionado) {				
        if (btnPresionado == 'ok') {
            Secodena.mostrarMascara('maskGestorDel',etiquetas.msgWait,etiquetas.msgDEL);
            Ext.Ajax.request({
                url: 'comprobargestores',
                method:'POST',
                params:{
                    idgestor:sm.getSelected().data.idgestor
                    },
                callback: function (options,success,response){
                    Secodena.ocultarMascara('maskGestorDel');
                    responseData = Ext.decode(response.responseText);
                    if(responseData.tiene == 1)
                        mostrarMensaje(2,etiquetas.lbMsgFunEliminarMsgI,elimina1)
                    if(responseData.cod == 1)
                    {
                        mostrarMensaje(responseData.cod,responseData.mensaje);
                        stGpGestor.reload();
                        sm.clearSelections();
                        btnEliminar.disable();
                    }
                    if(responseData.cod == 3) mostrarMensaje(responseData.cod,responseData.mensaje);
                }
            });
        }
    }
}

////------------- Modificar Gestor -------------////
function modificargestor() {
    if (regGestor.getForm().isValid()) {
        Secodena.mostrarMascara('maskGestorMod',etiquetas.msgWait,etiquetas.msgMod);
        regGestor.getForm().submit({
            url:'modificaromgestor',
            params:{
                idgestor:sm.getSelected().data.idgestor
                },
            failure: function(form, action)
            {
                Secodena.ocultarMascara('maskGestorMod');
                if(action.result.cod != 3)
                {
                    mostrarMensaje(action.result.cod,action.result.mensaje);
                    stGpGestor.reload();
                    winMod.hide();
                }
				
            }
        });
    }
    else
        mostrarMensaje(3,etiquetas.lbMsgErrorEnCamops);        
}
		
////------------ Buscar Gestor ------------////
function buscargestor(gestor) {
    busqueda_grid = true;
    stGpGestor.load({
        params:{
            gestor:gestor,
            start:0,
            limit:15
        }
    });
}
                
    function cargarAyuda(){	
        var title	= 'Ayuda del nomenclador de gestores de base de datos';
        var referencia	= 'seguridad/gestnomgestor';
        help.show(title,referencia);
    }
}


