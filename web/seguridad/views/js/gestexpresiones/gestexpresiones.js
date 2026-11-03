UCID.portal.cargarEtiquetas('gestexpresiones', cargarInterfaz);

////------------- Inicializo el singlenton QuickTips -------------////
Ext.QuickTips.init();

////------------ Area de Validaciones ------------////
var letras,tipos,expre, busqueda_grid = false;
tipos = /^([a-zA-ZáéíóúñüÑ ]+[a-zA-ZáéíóúñüÑ\d\.\-\@\#\_]*)+$/;
expre = /^(\/{1}).+(\/{1})$/;

////------------- Declarar Variables -------------////
var winIns, winMod,regServ;

function cargarInterfaz(perfil,etiquetas)
{
    ////------------- Botones -------------////
    btnAdicionar = new Ext.Button({
        id:'btnAgrExpre',
        hidden:true,
        icon:perfil.dirImg+'adicionar.png',
        iconCls:'btn',
        text:etiquetas.lbBtnAdicionar,
        tooltip		: etiquetas.textToolTipadicionar,
        prevTab 	: 'btnClearField',
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
        id:'btnModExpre',
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
        id:'btnEliExpre',
        hidden:true,
        icon:perfil.dirImg+'eliminar.png',
        iconCls:'btn',
        nextTab 	: 'btnAyuExpre',
        prevTab : 'btnModExpre',
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
                eliminarExpresion();
        }
    });
    btnAyuda = new Ext.Button({
        id: 'gestdatfunciones.json',
        iconCls: 'btn',
        text: '<b>Ayuda</b>',
        disabled: false,
        toolTip: 'Ayuda de Metadata',
        hotKey		: {
            idGrupo		  :'grid1',
            config  	  :{
                key		  : 104,
                alt		  : true
            }
        },
        icon: perfil.dirImg + 'ayuda.png',
        menu:
            new Ext.menu.Menu({
                id: 'mainMenu',
                items: [
                    {
                        handler: function() {
                            cargarAyuda();
                        }, text: 'Ayuda',
                        id: 'btnAyuRel',
                        icon: perfil.dirImg + 'ayuda.png',
                        iconCls: 'btn',
                        tooltip:'Ayuda del sistema'
                    },
                    {
                        text: 'Acerca de',
                        id: 'acercade',
                        icon: perfil.dirImg  + 'info.png',
                        iconCls: 'btn',
                        tooltip:"Acerca de <b>(Alt+...s)</b>",
                        handler: function() {

                            var uri = "seguridad";
                            acercaDe.show(uri);
                        }}
                ]
            })

    });
    /**btnAyuda = new Ext.Button({
        id:'btnAyuExpre',
        nextTab: 'denomExp',
        prevTab : 'btnEliExpre',
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
    ////------------- Store del Grid -------------////
    var stGpExp =  new Ext.data.Store({
        url: 'cargarexpresiones',
        reader:new Ext.data.JsonReader({
            totalProperty: "cantidad_filas",
            root: "datos",
            id: "idfuncionalidad"
        },
        [
        {
            name:'idfuncionalidad'
        },

        {
            name:'idmodulo'
        },

        {
            name:'idexpresiones'
        },

        {
            name:'denominacion'
        },

        {
            name:'descripcion'
        },

        {
            name:'expresion'
        }
        ]),
        listeners : {
            load : function() {
                if(stGpExp.getCount() == 0 ) {
                    if(denomExp.getValue())
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

    ////------------- Establesco modo de seleccion de grid (single) -------------////
    sm = new Ext.grid.RowSelectionModel({
        singleSelect:false
    });
    sm.on('beforerowselect', function (smodel, rowIndex, keepExisting, record){
        btnModificar.enable();
        btnEliminar.enable();
    }, this);

    sm.on('rowselect', function (smodel, rowIndex, keepExisting, record){
        if(sm.getCount()!=1)
            btnModificar.disable();
        else
            btnModificar.enable();
    }, this);

    sm.on('rowdeselect', function (smodel, rowIndex, keepExisting, record){
        if(sm.getCount()!=1)
            btnModificar.disable();
        else
            btnModificar.enable();
    }, this);

    ////------------- Defino el grid de Expresiones -------------////
    var gpExp= new Ext.grid.GridPanel({
        title: etiquetas.titleGridExpr,
        cls:'x-toolbar',
        border:false,
        frame:false,
        region:'center',
        autoExpandColumn:'expandir',
        store:stGpExp,
        sm:sm,
        columns: [
        {
            hidden: true,
            hideable: false,
            dataIndex: 'idexpresiones'
        },

        {
            header: etiquetas.lbTitDenominacion,
            width:300,
            dataIndex: 'denominacion',
            sortable : true
        },

        {
            header:etiquetas.lbTitExpresion,
            width:300,
            dataIndex: 'expresion',
            sortable : true
        },

        {
            id:'expandir',
            header:etiquetas.lbTitDescripcion,
            width:210,
            dataIndex: 'descripcion',
            sortable : true
        }
        ],
        loadMask:{
            store:stGpExp
        },
        bbar:new Ext.PagingToolbar({
            pageSize: 15,
            id:'ptbaux',
            store: stGpExp,
            displayInfo: true,
            displayMsg: etiquetas.lbMsgbbarI,
            emptyMsg: etiquetas.lbMsgbbarII
        })
    });

    var denomExp = new Ext.form.TextField({
        fieldLabel:etiquetas.lbTitDenBuscar,
        emptyText: etiquetas.emptytext,
        anchor:"98%",
        width:150,
        maxLength:60,
        colWidth:.3,
        id: 'denomExp',
        prevTab : 'btnAyuExpre'
    });

    var btnBuscar	= new Ext.Button({
        icon:perfil.dirImg+'buscar.png',
        id: 'btnBuscarGrid',
        nextTab : 'btnClearField',
        prevTab : 'denomExp',
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
            buscarExpresiones(denomExp.getValue());
        }
    });

    var btnClear = new Ext.Button({
        icon	: perfil.dirImg+'limpiar.png',
        id		: 'btnClearField',
        nextTab : 'btnAgrExpre',
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
        elementos : [denomExp],
        botones:[btnBuscar, btnClear]
    })

    ////------------- Renderiar el arbol -------------////
    var panel = new Ext.Panel({
        layout:'border',
        items:[fpFiltro,gpExp],
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

    ////------------- Viewport -------------////
    var vpServidorAut = new Ext.Viewport({
        layout:'fit',
        items:panel
    })
    stGpExp.load({
        params:{
            start:0,
            limit:15
        }
    });

    ////------------- Formulario -------------////
    regExp = new Ext.FormPanel({
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
                    maxLength:60,
                    allowBlank:false,
                    blankText:etiquetas.lbMsgBlank,
                    vtype:'vtalfanumericos',
                    anchor:'95%'
                }]
            },
            {
                columnWidth:.5,
                layout: 'form',
                items: [{
                    xtype:'textfield',
                    fieldLabel: etiquetas.lbFLExpresion,
                    id:'expresion',
                    maxLength:255,
                    allowBlank:false,
                    blankText:etiquetas.lbMsgBlank,
                    regexText:etiquetas.lbMsgregexII,
                    regex:expre,
                    anchor:'95%'
                }]
            },
            {
                columnWidth:1,
                layout: 'form',
                items: [{
                    xtype:'textarea',
                    fieldLabel:etiquetas.lbFLDescripcion,
                    id: 'descripcion',
                    maxLength:255,
                    anchor:'100%'
                }]
            }]
        }]
    });

    ////------------- Cargar la ventana -------------////
    function winForm(opcion){
        switch(opcion){
            case 'Ins':{
                if(!winIns)
                {
                    winIns = new Ext.Window({
                        modal: true,
                        closeAction:'hide',
                        layout:'fit',
                        title:etiquetas.lbTitVentanaTitI,
                        width:400,
                        height:230,
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
                                adicionarExpresiones('apl');
                            }
                        },
                        {
                            icon:perfil.dirImg+'aceptar.png',
                            iconCls:'btn',
                            text:etiquetas.lbBtnAceptar,
                            nextTab : 'denominacion',
                            tooltip	: etiquetas.tooltipAceptarVen,
                            handler:function(){
                                adicionarExpresiones();
                            }
                        }]
                    });
                }
                regExp .getForm().reset();
                winIns.add(regExp);
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
                        title:etiquetas.lbTitVentanaTitII,
                        width:400,
                        height:230,
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
                                modificarExpresion();
                            }
                        }]
                    });
                }
                winMod.add(regExp);
                winMod.doLayout();
                winMod.show();
                regExp.getForm().loadRecord(sm.getSelected());
                Ext.getCmp('denominacion').focus(false,200);
            }
            break;
        }
    }

    function buscarExpresiones(denomExp){
        busqueda_grid = true;
        stGpExp.baseParams = {};
        stGpExp.baseParams.buscar = denomExp;
        stGpExp.load({
            params:{
                start:0,
                limit:15
            }
        });
    }

    function clearFilters() {
        denomExp.reset();
        stGpExp.baseParams = {};
        stGpExp.load({
            params:{
                start:0,
                limit:15
            }
        });
    }

    ////------------- Adicionar Expresiones -------------////
    function adicionarExpresiones(apl){
        if (regExp .getForm().isValid()) {
            Secodena.mostrarMascara('maskExpresion',etiquetas.msgWait,etiquetas.msgAdd);
            regExp .getForm().submit({
                url:'insertarexpresion',
                failure: function(form, action){
                    Secodena.ocultarMascara('maskExpresion');
                    if(action.result.codMsg != 3)
                    {
                        mostrarMensaje(action.result.codMsg,action.result.mensaje);
                        regExp .getForm().reset();
                        if(!apl)
                            winIns.hide();
                        stGpExp.reload();
                        sm.clearSelections();
                        btnModificar.disable();
                        btnEliminar.disable();
                    }
                    if(action.result.codMsg == 3) mostrarMensaje(action.result.codMsg,action.result.mensaje);
                }
            });
        }
        else
            mostrarMensaje(3,etiquetas.lbMsgErrorEnCamops);
    }

    ////------------- Modififcar Expresion -------------////
    function modificarExpresion(){
        if (regExp .getForm().isValid()) {
            Secodena.mostrarMascara('maskExpresionMod',etiquetas.msgWait,etiquetas.msgMod);
            regExp .getForm().submit({
                url:'modificarexpresion',
                params:{
                    idexpresiones:sm.getSelected().data.idexpresiones
                },
                failure: function(form, action){
                    Secodena.ocultarMascara('maskExpresionMod');
                    if(action.result.codMsg != 3)
                    {
                        mostrarMensaje(action.result.codMsg,action.result.mensaje);
                        stGpExp.reload();
                        winMod.hide();
                    }
                    if(action.result.codMsg == 3) mostrarMensaje(action.result.codMsg,action.result.mensaje);
                }
            });
        }
        else
            mostrarMensaje(3,etiquetas.lbMsgErrorEnCamops);
    }

    ////------------- Eliminar  Expresion -------------////
    function eliminarExpresion(){
        var arrExpElim = sm.getSelections();
        var arrayExpElim = [];
        for (var i=0;i<arrExpElim.length;i++)
            arrayExpElim.push(arrExpElim[i].data.idexpresiones);

        mostrarMensaje(2,etiquetas.lbMsgFunEliminarMsgI,elimina);
        function elimina(btnPresionado){
            if (btnPresionado == 'ok')
            {
                Secodena.mostrarMascara('maskExpresionDel',etiquetas.msgWait,etiquetas.msgDEL);
                Ext.Ajax.request({
                    url: 'eliminarexpresion',
                    method:'POST',
                    params:{
                        expresionesElim:Ext.encode(arrayExpElim)
                    },
                    callback: function (options,success,response){
                        Secodena.ocultarMascara('maskExpresionDel');
                        responseData = Ext.decode(response.responseText);
                        if(responseData.codMsg == 1)
                        {
                            mostrarMensaje(responseData.codMsg,responseData.mensaje);
                            stGpExp.reload();
                            sm.clearSelections();
                            btnModificar.disable();
                            btnEliminar.disable();
                        }
                        if(responseData.codMsg == 3) mostrarMensaje(responseData.codMsg,responseData.mensaje);
                    }
                });
            }
        }
    }

    function cargarAyuda(){
        var title	= 'Ayuda del nomenclador de expresiones regulares';
        var referencia	= 'seguridad/gestnomexpresiones';
        help.show(title,referencia);
    }
}
