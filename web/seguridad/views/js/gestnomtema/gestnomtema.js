UCID.portal.cargarEtiquetas('gestnomtema', cargarInterfaz);
		
////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();
				
////------------ Declarar Variables ------------////
var winIns, winMod,regTema;
		
////------------ Area de Validaciones ------------////
var tipos, abreviatura;
tipos = /(^([a-zA-ZáéíóúñüÑ])+([a-zA-ZáéíóúñüÑ\d\.\-\@\#\_ ]*))$/;
abreviatura = /^([a-zA-ZáéíóúñüÑ]+[a-zA-ZáéíóúñüÑ\d\.\-\@\#\_]*)+$/;
		
function cargarInterfaz(perfil,etiquetas) {
    ////------------ Botones ------------////
    btnAdicionar = new Ext.Button({
        id:'btnAgrTema', 
        hidden:true, 
        icon:perfil.dirImg+'adicionar.png', 
        iconCls:'btn', 
        text:etiquetas.lbBtnAdicionar,
        tooltip		: etiquetas.textToolTipadicionar,
        prevTab 	: 'btnAyuTema',
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
        id:'btnModTema', 
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
        id:'btnEliTema', 
        hidden:true, 
        icon:perfil.dirImg+'eliminar.png', 
        iconCls:'btn', 
        text:etiquetas.lbBtnEliminar,
        nextTab 	: 'btnAyuTema',
        prevTab : 'btnModTema',
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
                eliminarTema();
        }  
    });
    btnAyuda = new Ext.Button({
        id: 'btnAyuTema',
        iconCls: 'btn',
        text: '<b>Ayuda</b>',
        disabled: false,
        nextTab 	: 'btnAgrTema',
        prevTab : 'btnEliTema',
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
        id:'btnAyuTema',
        nextTab 	: 'btnAgrTema',
        prevTab : 'btnEliTema',
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
			
    UCID.portal.cargarAcciones(window.frameElement.id, enfocarElemento);
    
    function focusTema() {
        btnAdicionar.focus(200);
    }
    
    ////------------ Store del Grid de Temas ------------//// 
    var stGpTema =  new Ext.data.Store({
        url: 'cargarnomtema',
        reader:new Ext.data.JsonReader({
            totalProperty: "cantidad_filas",
            root: "datos",
            id: "idtema"
        },
        [
        {
            name:'idtema'
        },

        {
            name:'denominacion'
        },

        {
            name:'descripcion'
        },

        {
            name:'abreviatura'
        },
        ])	
    });
			
    ////------------ Establesco modo de seleccion de grid (single) ------------////
    sm = new Ext.grid.RowSelectionModel({
        singleSelect:true
    });
    sm.on('beforerowselect', function (smodel, rowIndex, keepExisting, record){
        btnModificar.enable();
        btnEliminar.enable();
    }, this);
			
    ////------------ Defino el grid de Temas ------------////
    var gpTema= new Ext.grid.GridPanel({
        title: etiquetas.titleGridTemas,
        cls:'x-toolbar',
        border:false,
        frame:false,
        region:'center',
        autoExpandColumn:'expandir',
        store:stGpTema,
        sm:sm,
        columns: [
        {
            hidden: true, 
            hideable: false,  
            dataIndex: 'idtema'
        },

        {
            header: etiquetas.lbTitDenominacion,
            width:200,  
            dataIndex: 'denominacion',
            sortable : true
        },

        {
            header: etiquetas.lbTitAbreviatura,
            width:200, 
            dataIndex: 'abreviatura',
            sortable : true
        },	

        {
            id:'expandir',
            header: etiquetas.lbTitDescripcion, 
            width:200, 
            dataIndex: 'descripcion',
            sortable : true
        }
		
        ],
        loadMask:{
            store:stGpTema
        },			
        bbar:new Ext.PagingToolbar({
            pageSize: 15,
            id:'ptbaux',
            store: stGpTema,
            displayInfo: true,
            displayMsg: etiquetas.lbMsgbbarI,
            emptyMsg: etiquetas.lbMsgbbarII
        })
    });
			
    ////------------ Renderiar el arbol ------------////
    var panel = new Ext.Panel({
        layout:'border',
        items:[gpTema],
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
			
    ////------------ ViewPort ------------////
    var vpTema = new Ext.Viewport({
        layout:'fit',
        items:panel
    })
    stGpTema.load({
        params:{
            start:0, 
            limit:15
        }
    });
			
////------------ Formulario ------------////
regTema = new Ext.FormPanel({
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
                id:'denominacion',
                allowBlank:false,
                maxLength:60,    
                maskRe:/(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*))$/,
                regex:/(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*))$/,
                regexText:etiquetas.lbMsgregexI,
                anchor:'95%'
            }]
        },
        {
            columnWidth:.5,
            layout:'form',
            items:[{
                xtype:'textfield',
                fieldLabel:etiquetas.lbFLAbreviatura,
                id:'abreviatura',
                maxLength:10,
                allowBlank:false,
                blankText:etiquetas.lbMsgBlank,
                vtype:'vtalfanumericosguiones',
                anchor:'95%'
            }]
        },
        {
            columnWidth:1,
            layout:'form',
            items:[{
                xtype:'textarea',
                maxLength:255,
                fieldLabel:etiquetas.lbFLDescripcion,
                id:'descripcion',
                anchor:'100%'
            }]
        }]
    }]
});	
			
////------------ Cargar la ventana ------------////
function winForm(opcion){
    switch(opcion){
        case 'Ins':{
            if(!winIns)
            {
                winIns = new Ext.Window({
                    modal: true,
                    closeAction:'hide',
                    layout:'fit',
                    resizable: false,
                    title:etiquetas.lbTitVentanaTitI,
                    width:350,
                    height:220,
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
                            adicionarTema('apl');
                        }
                    },
                    {
                        icon:perfil.dirImg+'aceptar.png',
                        iconCls:'btn',
                        text:etiquetas.lbBtnAceptar,
                        nextTab : 'denominacion',
                        tooltip	: etiquetas.tooltipAceptarVen,
                        handler:function(){
                            adicionarTema();
                        }
                    }]
                });
            }
            regTema.getForm().reset(); 
            winIns.add(regTema);
            winIns.doLayout();
            winIns.show();
            Ext.getCmp('denominacion').focus(false,200);
        }
        break;
        case 'Mod':{
            if(!winMod)
            {
                winMod= new Ext.Window({
                    modal: true,
                    closeAction:'hide',
                    layout:'fit',
                    resizable: false,
                    title:etiquetas.lbTitVentanaTitII,
                    width:350,
                    height:220,
                    listeners:{
                        hide:function(w){
                            panel.getTopToolbar().items.items[0].focus();
                        }
                    },
                    buttons:[
                    {
                        icon:perfil.dirImg+'cancelar.png',
                        iconCls:'btn',
                        tooltip	: etiquetas.tooltipCancelarVen,
                        text:etiquetas.lbBtnCancelar,
                        handler:function(){
                            winMod.hide();
                        }
                    },
                    {	
                        icon:perfil.dirImg+'aceptar.png',
                        iconCls:'btn',
                        text:etiquetas.lbBtnAceptar,
                        nextTab : 'denominacion',
                        tooltip	: etiquetas.tooltipAceptarVen,
                        handler:function(){
                            modificarTema();
                        }
                    }]
                });
            }
            winMod.add(regTema);						
            winMod.doLayout();
            winMod.show();
            regTema.getForm().loadRecord(sm.getSelected());
            Ext.getCmp('denominacion').focus(false,200);
        }
        break;
    }
}
			
////------------ Adicionar Tema ------------////
function adicionarTema(apl){
    if (regTema .getForm().isValid()) {
        Secodena.mostrarMascara('maskTema',etiquetas.msgWait,etiquetas.msgAdd);
        regTema .getForm().submit({
            url:'insertartema',
            failure: function(form, action){
                Secodena.ocultarMascara('maskTema');
                if(action.result.cod != 3) {
                    mostrarMensaje(action.result.cod,action.result.mensaje, focusTema);
                    regTema .getForm().reset(); 
                    stGpTema.reload();					
                    if(!apl) 
                        winIns.hide();
                    sm.clearSelections();
                    btnModificar.disable();
                    btnEliminar.disable();
                }
                if(action.result.cod == 3) mostrarMensaje(action.result.cod,action.result.mensaje, focusTema);
            }
        });
    }
    else
        mostrarMensaje(3,etiquetas.lbMsgErrorEnCamops, focusTema);                
}
			
////------------ Modififcar Tema ------------////
function modificarTema(){
    if (regTema .getForm().isValid()) {
        Secodena.mostrarMascara('maskTemaMod',etiquetas.msgWait,etiquetas.msgMod);
        regTema .getForm().submit({
            url:'modificartema',
            params:{
                idtema:sm.getSelected().data.idtema
                },
            failure: function(form, action){
                Secodena.ocultarMascara('maskTemaMod');
                if(action.result.codMsg != 3)
                {
                    mostrarMensaje(action.result.codMsg,action.result.mensaje, focusTema); 
                    stGpTema.reload();
                    winMod.hide();
                }
                if(action.result.codMsg == 3) mostrarMensaje(action.result.codMsg,action.result.mensaje, focusTema);
            }
        });
    }
    else
        mostrarMensaje(3,etiquetas.lbMsgErrorEnCamops, focusTema);                
}
			
////------------ Eliminar  Tema ------------////
function eliminarTema(){
    mostrarMensaje(2,etiquetas.lbMsgFunEliminarMsgI,elimina);
    function elimina(btnPresionado){
        if (btnPresionado == 'ok')
        {
            Secodena.mostrarMascara('maskTemaDel',etiquetas.msgWait,etiquetas.msgDEL);
            Ext.Ajax.request({
                url: 'eliminarnomtema',
                method:'POST',
                params:{
                    idtema:sm.getSelected().data.idtema
                    },
                callback: function (options,success,response){
                    Secodena.ocultarMascara('maskTemaDel');
                    responseData = Ext.decode(response.responseText);
                    if(responseData.codMsg == 1)
                    {
                        mostrarMensaje(responseData.codMsg,responseData.mensaje, focusTema);
                        stGpTema.reload();
                        sm.clearSelections();
                        btnModificar.disable();
                        btnEliminar.disable();
                    }
                    if(responseData.codMsg == 3) mostrarMensaje(responseData.codMsg,responseData.mensaje, focusTema);
                }
            });
        }
    }
}
                        
function cargarAyuda(){	
    var title	= 'Ayuda del nomenclador de temas';
    var referencia	= 'seguridad/gestnomtema';
    help.show(title,referencia);
}
}
		
		
