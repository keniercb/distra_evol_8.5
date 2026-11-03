UCID.portal.cargarEtiquetas('gestnomidioma',cargarInterfaz);
////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();
		
////------------ Declarar variables ------------////
var winIns, winMod,winCamb;
		
////------------ Area de Validaciones ------------////
var tipos,abreviatura;
		
function cargarInterfaz(perfil,etiquetas) {
    ////------------ Botones ------------////
    btnAdicionar = new Ext.Button({
        id:'btnAgrIdioma', 
        hidden:true, 
        icon:perfil.dirImg+'adicionar.png',
        iconCls:'btn', 
        text:etiquetas.lbBtnAdicionar,
        tooltip		: etiquetas.textToolTipadicionar,
        prevTab 	: 'btnAyuIdioma',
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
        id:'btnModIdioma', 
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
        id:'btnEliIdioma', 
        hidden:true, 
        icon:perfil.dirImg+'eliminar.png',
        iconCls:'btn', 
        text:etiquetas.lbBtnEliminar,
        tooltip		: etiquetas.textToolTipDel,
        nextTab:'btnAyuIdioma',
        prevTab:'btnModIdioma',
        hotKey		: {
            idGrupo		  : 'grid1',
            config  	  : {
                key			  : Ext.EventObject.DELETE,
                stopEvent 	  : true
            }
        },
        handler:function() {
            if(sm.getCount() >= 1)
                eliminarIdioma();
        }
    });
    btnAyuda = new Ext.Button({
        id: 'btnAyuIdioma',
        iconCls: 'btn',
        text: '<b>Ayuda 1</b>',
        disabled: false,
        prevTab : 'btnEliIdioma',
        nextTab : 'btnAgrIdioma',
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
        id:'btnAyuIdioma', 
        icon:perfil.dirImg+'ayuda.png', 
        iconCls:'btn', 
        text:etiquetas.lbBtnAyuda,
        prevTab : 'btnEliIdioma',
        nextTab : 'btnAgrIdioma',
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
    
    function focusIdioma() {
        btnAdicionar.focus(200);
    }
    ////------------ Store del Grid de Idiomas ------------////
    stgpIdioma =  new Ext.data.Store({
        url: 'cargarnomidioma',
        reader:new Ext.data.JsonReader({
            totalProperty: "cantidad_filas",
            root: "datos",
            id: "ididioma"
        },
        [
        {
            name:'ididioma',
            mapping:'ididioma'
        },

        {
            name:'denominacion',
            mapping:'denominacion'
        },

        {
            name:'abreviatura',
            mapping:'abreviatura'
        }						
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
			
    ////------------ Defino el grid de Idiomas ------------////
    var gpIdioma = new Ext.grid.GridPanel({
        title: etiquetas.titleGridIdiomas,
        cls:'x-toolbar',
        border:false,
        frame:false,
        region:'center',
        autoExpandColumn:'expandir',
        store:stgpIdioma,
        sm:sm,
        columns: [
        {
            hidden: true, 
            hideable: false, 
            dataIndex: 'ididioma'
        },

        {
            header: etiquetas.lbTitDenominacion, 
            width:200, 
            dataIndex: 'denominacion', 
            id:'expandir',
            sortable : true
        },

        {
            header: etiquetas.lbTitAbreviatura, 
            width:300, 
            dataIndex: 'abreviatura',
            sortable : true
        }						
        ],
        loadMask:{
            store:stgpIdioma
        },
        bbar:new Ext.PagingToolbar({
            pageSize: 15,
            id:'ptbaux',
            store: stgpIdioma,
            displayInfo: true,
            displayMsg: etiquetas.lbMsgbbarI,
            emptyMsg: etiquetas.lbMsgbbarII
        })
    });
			
    ////------------ Panel con los componentes ------------////
    var panel = new Ext.Panel({
        layout:'border',
        items:[gpIdioma],
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
			
    ////------------ Formulario ------------////
    var regIdioma = new Ext.FormPanel({
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
                    maxLength:50,    
                    blankText:etiquetas.lbMsgBlank,
                    vtype:'vtletrasycomas',
                    anchor:'80%'
                }]
            },
            {
                columnWidth:.5,
                layout: 'form',
                items: [{
                    xtype:'textfield',
                    fieldLabel: etiquetas.lbFLAbreviatura,
                    id:'abreviatura',	
                    allowBlank:false,
                    maxLength:4,    
                    blankText:etiquetas.lbMsgBlank,
                    vtype:'vtnombre',
                    anchor:'80%'
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
                        width:300,
                        height:150,
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
                                adicionarIdioma('apl');
                            }
                        },
                        {	
                            icon:perfil.dirImg+'aceptar.png',
                            iconCls:'btn',
                            text:etiquetas.lbBtnAceptar,
                            nextTab : 'denominacion',
                            tooltip	: etiquetas.tooltipAceptarVen,
                            handler:function(){
                                adicionarIdioma();
                            }
                        }]
                    });
                }
                regIdioma.getForm().reset(); 
                winIns.add(regIdioma);					
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
                        width:300,
                        height:150,
                        listeners:{
                            hide:function(w){
                                panel.getTopToolbar().items.items[0].focus();
                            }
                        },
                        buttons:[
                        {
                            icon:perfil.dirImg+'cancelar.png',
                            tooltip	: etiquetas.tooltipCancelarVen,
                            iconCls:'btn',
                            text:etiquetas.lbBtnCancelar,
                            handler:function(){
                                winMod.hide();
                            }
                        },
                        {	
                            icon:perfil.dirImg+'aceptar.png',
                            tooltip	: etiquetas.tooltipAceptarVen,
                            iconCls:'btn',
                            nextTab : 'denominacion',
                            text:etiquetas.lbBtnAceptar,
                            handler:function(){
                                modificarIdioma();
                            }
                        }]
                    });
                }
                regIdioma.getForm().reset();
                winMod.add(regIdioma);												
                winMod.doLayout();	
                winMod.show();
                regIdioma.getForm().loadRecord(sm.getSelected());
                Ext.getCmp('denominacion').focus(false,200);
            }
            break;
        }
    }
			
    ////------------ Viewport ------------////
    var vpGestIdioma = new Ext.Viewport({
        layout:'fit',
        items:panel
    })
    stgpIdioma.load({
        params:{
            start:0, 
            limit:15
        }
    });
			
			
////------------ Adicionar Idiomas ------------////
function adicionarIdioma(apl) {
    if (regIdioma.getForm().isValid()) {
        Secodena.mostrarMascara('maskIdioma',etiquetas.msgWait,etiquetas.msgAdd);
        regIdioma.getForm().submit({
            url:'insertarnomidioma',
            failure: function(form, action) {
                Secodena.ocultarMascara('maskIdioma');
                if(action.result.cod != 3)
                {
                    mostrarMensaje(action.result.cod,action.result.mensaje, focusIdioma());
                    regIdioma.getForm().reset(); 
                    stgpIdioma.reload();
                    if(!apl) 
                        winIns.hide();
								
                    sm.clearSelections();
                    btnModificar.disable();
                    btnEliminar.disable();
                }
                if(action.result.cod == 3) mostrarMensaje(action.result.cod,action.result.mensaje, focusIdioma());
            }
        });
    }
    else
        mostrarMensaje(3,etiquetas.lbMsgErrorEnCamops, focusIdioma());                
}
			
////------------ Modififcar Idioma ------------////
function modificarIdioma(){
    if (regIdioma.getForm().isValid()){
        Secodena.mostrarMascara('maskIdiomaMod',etiquetas.msgWait,etiquetas.msgMod);
        regIdioma.getForm().submit({
            url:'modificarnomidioma',
            params:{
                ididioma:sm.getSelected().data.ididioma
                },
            failure: function(form, action){
                Secodena.ocultarMascara('maskIdiomaMod');
                if(action.result.cod != 3){
                    mostrarMensaje(action.result.cod,action.result.mensaje, focusIdioma());
                    winMod.hide();
                    stgpIdioma.reload();
                }
                if(action.result.cod == 3) mostrarMensaje(action.result.cod,action.result.mensaje, focusIdioma());
							
            }
        });
    }
    else
        mostrarMensaje(3,etiquetas.lbMsgErrorEnCamops, focusIdioma());                
}
			
////------------ Eliminar Idioma ------------////
function eliminarIdioma(){
    mostrarMensaje(2,etiquetas.lbMsgFunEliminarMsgI,elimina);
    function elimina(btnPresionado){
        if (btnPresionado == 'ok') {
            Secodena.mostrarMascara('maskIdiomaDel',etiquetas.msgWait,etiquetas.msgDEL);
            Ext.Ajax.request({
                url: 'eliminarnomidioma',
                method:'POST',
                params:{
                    ididioma:sm.getSelected().data.ididioma
                    },
                callback: function (options,success,response){
                    Secodena.ocultarMascara('maskIdiomaDel');
                    responseData = Ext.decode(response.responseText);
                    if(responseData.cod == 1)
                    {
                        mostrarMensaje(responseData.cod,responseData.mensaje, focusIdioma());
                        stgpIdioma.reload();
                        sm.clearSelections();
                        btnModificar.disable();
                        btnEliminar.disable();
                    }
                    if(responseData.cod == 3) mostrarMensaje(responseData.cod,responseData.mensaje, focusIdioma());
                }
            });
        }
    }
}
                        
function cargarAyuda(){	
    var title	= 'Ayuda del nomenclador de idiomas';
    var referencia	= 'seguridad/gestnomidioma';
    help.show(title,referencia);
}
}
