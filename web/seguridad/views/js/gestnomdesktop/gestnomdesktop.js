UCID.portal.cargarEtiquetas('gestnomdesktop', cargarInterfaz);
////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();

////------------ Declarar variables ------------////
var winIns, winMod,winCamb;

////------------ Area de Validaciones ------------////
var tipos, abreviatura;
tipos = /(^([a-zA-ZáéíóúñüÑ])+([a-zA-ZáéíóúñüÑ\d\.\-\@\#\_\s]*))$/;
abreviatura = /(^([a-zA-ZáéíóúñüÑ])+([a-zA-ZáéíóúñüÑ\d\.\-\@\#\_\s]*))$/;

function cargarInterfaz(perfil,etiquetas) {
    ////------------ Botones ------------////
    btnAdicionar = new Ext.Button({
        id:'btnAgrDesktop',
        hidden:true,
        icon:perfil.dirImg+'adicionar.png',
        iconCls:'btn',
        prevTab 	: 'btnAyuDesktop',
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
        id:'btnModDesktop',
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
        id:'btnEliDesktop',
        hidden:true,
        icon:perfil.dirImg+'eliminar.png',
        iconCls:'btn',
        text:etiquetas.lbBtnEliminar,
        tooltip		: etiquetas.textToolTipDel,
        hotKey			: {
            idGrupo		  : 'grid1',
            config  	  : {
                key			  : Ext.EventObject.DELETE,
                stopEvent 	  : true
            }
        },
        handler:function() {
            if(sm.getCount() >= 1)
                eliminarDesktop();
        }
    });
    btnAyuda = new Ext.Button({
        id: 'btnAyuDesktop',
        iconCls: 'btn',
        text: '<b>Ayuda</b>',
        disabled: false,
        nextTab:'btnAgrDesktop',
        prevTab : 'btnEliDesktop',
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
        id:'btnAyuDesktop',
        icon:perfil.dirImg+'ayuda.png',
        iconCls:'btn',
        text:etiquetas.lbBtnAyuda,
        nextTab:'btnAgrDesktop',
        prevTab : 'btnEliDesktop',
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

    ////------------ Store del Grid de Funcionalidades ------------////
    stUsuario =  new Ext.data.Store({
        url: 'cargarnomdesktop',
        reader:new Ext.data.JsonReader({
            totalProperty: "cantidad_filas",
            root: "datos",
            id: "iddesktop"
        },
        [
        {
            name:'iddesktop',
            mapping:'iddesktop'
        },

        {
            name:'descripcion',
            mapping:'descripcion'
        },

        {
            name:'denominacion',
            mapping:'denominacion'
        },

        {
            name:'abreviatura',
            mapping:'abreviatura'
        }
        ]),
        listeners : {
            load : function() {
                if(stUsuario.getCount() == 0 )
                    Ext.Msg.show({
                        title:etiquetas.msgInf,
                        msg: etiquetas.msgInfDatos,
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.INFO
                    });
            }
        }
    });
    ////------------ Establesco modo de seleccion de grid (single) ------------////
    sm = new Ext.grid.RowSelectionModel({
        singleSelect:true
    });
    sm.on('beforerowselect', function (smodel, rowIndex, keepExisting, record){
        btnModificar.enable();
        btnEliminar.enable();
    }, this);

    ////------------ Defino el grid de Funcionalidades ------------////
    var gpDesktop = new Ext.grid.GridPanel({
        title: etiquetas.titleGridDesktop,
        cls:'x-toolbar',
        border:false,
        frame:false,
        region:'center',
        autoExpandColumn:'expandir',
        store:stUsuario,
        sm:sm,
        columns: [
        {
            hidden: true,
            hideable: false,
            dataIndex: 'iddesktop'
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
            header: etiquetas.lbTitDescripcion,
            width:200,
            dataIndex: 'descripcion',
            id:'expandir',
            sortable : true
        }
        ],

        loadMask:{
            store:stUsuario
        },
        bbar:new Ext.PagingToolbar({
            pageSize: 15,
            id:'ptbaux',
            store: stUsuario,
            displayInfo: true,
            displayMsg: etiquetas.lbMsgbbarI,
            emptyMsg: etiquetas.lbMsgbbarII
        })
    });

    ////------------ Panel con los componentes ------------////
    var panel = new Ext.Panel({
        layout:'border',
        items:[gpDesktop],
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
    var regDesktop = new Ext.FormPanel({
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
                    blankText:etiquetas.lbMsgBlank,
                    vtype:'vtalfanumericos',
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
                    maxLength:40,
                    allowBlank:false,
                    blankText:etiquetas.lbMsgBlank,
                    vtype:'vtabrev',
                    anchor:'95%'
                }]
            },
            {
                columnWidth:1,
                layout:'form',
                items:[{
                    xtype:'textarea',
                    fieldLabel:etiquetas.lbFLDescripcion,
                    id:'descripcion',
                    maxLength:255,
                    anchor:'98%'
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
                        width:500,
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
                                adicionarDesktop('apl');
                            }
                        },
                        {
                            icon:perfil.dirImg+'aceptar.png',
                            iconCls:'btn',
                            text:etiquetas.lbBtnAceptar,
                            nextTab : 'denominacion',
                            tooltip	: etiquetas.tooltipAceptarVen,
                            handler:function(){
                                adicionarDesktop();
                            }
                        }]
                    });
                }
                regDesktop.getForm().reset();
                winIns.add(regDesktop);
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
                        width:500,
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
                                modificarDesktop();
                            }
                        }]
                    });
                }
                regDesktop.getForm().reset();
                winMod.add(regDesktop);
                winMod.doLayout();
                winMod.show();
                regDesktop.getForm().loadRecord(sm.getSelected());
                Ext.getCmp('denominacion').focus(false,200);
            }
            break;
        }
    }

    ////------------ Viewport ------------////
    var vpGestDesktop = new Ext.Viewport({
        layout:'fit',
        items:panel
    })
    stUsuario.load({
        params:{
            start:0,
            limit:15
        }
    });

    ////------------ Adicionar Desktop ------------////
    function adicionarDesktop(apl){
        if (regDesktop.getForm().isValid()) {
            Secodena.mostrarMascara('maskDesktop',etiquetas.msgWait,etiquetas.msgAdd);
            regDesktop.getForm().submit({
                url:'insertarnomdesktop',
                failure: function(form, action){
                    Secodena.ocultarMascara('maskDesktop');
                    if(action.result.cod != 3)
                    {
                        mostrarMensaje(action.result.cod,action.result.mensaje);
                        regDesktop.getForm().reset();
                        stUsuario.reload();
                        if(!apl)
                            winIns.hide();

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

    ////------------ Modififcar Desktop ------------////
    function modificarDesktop() {
        if (regDesktop.getForm().isValid()){
            Secodena.mostrarMascara('maskDesktopMod',etiquetas.msgWait,etiquetas.msgMod);
            regDesktop.getForm().submit({
                url:'modificarnomdesktop',
                params:{
                    iddesktop:sm.getSelected().data.iddesktop
                },
                failure: function(form, action){
                    Secodena.ocultarMascara('maskDesktopMod');
                    if(action.result.cod != 3){
                        mostrarMensaje(action.result.cod,action.result.mensaje);
                        winMod.hide();
                        stUsuario.reload();
                    }
                    if(action.result.cod == 3) mostrarMensaje(action.result.cod,action.result.mensaje);
                }
            });
        }
        else
            mostrarMensaje(3,etiquetas.lbMsgErrorEnCamops);
    }

    ////------------ Eliminar Desktop ------------////
    function eliminarDesktop(){
        mostrarMensaje(2,etiquetas.lbMsgFunEliminarMsgI,elimina);
        function elimina(btnPresionado){
            if (btnPresionado == 'ok') {
                Secodena.mostrarMascara('maskDesktopDel',etiquetas.msgWait,etiquetas.msgDEL);
                Ext.Ajax.request({
                    url: 'eliminarnomdesktop',
                    method:'POST',
                    params:{
                        iddesktop:sm.getSelected().data.iddesktop
                    },
                    callback: function (options,success,response) {
                        Secodena.ocultarMascara('maskDesktopDel');
                        responseData = Ext.decode(response.responseText);
                        if(responseData.cod == 1)
                        {
                            mostrarMensaje(responseData.cod,responseData.mensaje);
                            stUsuario.reload();
                            sm.clearSelections();
                            btnModificar.disable();
                            btnEliminar.disable();
                        }
                        if(responseData.cod == 3) mostrarMensaje(responseData.cod,responseData.mensaje);
                    }
                });
            }
        }
    }

    ////------------ Buscar Desktop ------------////
    function buscarfuncionalidad(funcionalidad){
        stgpCampos.load({
            params:{
                denominacion:funcionalidad,
                idsistema:arbolFunc.getSelectionModel().getSelectedNode().attributes.id,
                start:0,
                limit:20
            }
        });
    }

    function cargarAyuda(){
        var title	= 'Ayuda del nomenclador de tipos de escritorios';
        var referencia	= 'seguridad/gestnomdesktop';
        help.show(title,referencia);
    }
}
