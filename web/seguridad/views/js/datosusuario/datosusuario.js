UCID.portal.cargarEtiquetas('datosusuario', cargarInterfaz);

////------------ Inicializo el singlenton QuickTips ----------------////
Ext.QuickTips.init();


function cargarInterfaz(perfil,etiquetas){

    var dataVis = [
    ['true', 'True'],
    ['false', 'False']
    ];
    var storeDataVis = new Ext.data.SimpleStore({
        fields: ['idvis','vis'],
        data : dataVis

    });

    var dataTipoData= [
    ['boolean', 'boolean'],
    ['date', 'date'],
    ['int', 'int'],
    ['time', 'time'],
    ['varchar','varchar']
    ];

    var storeDataTipoData = new Ext.data.SimpleStore({
        fields: ['data','iddata'],
        data : dataTipoData
    });

    var dataTipoCamp= [
    ['textfield', 'textfield'],
    ['datafield', 'datafield']
    ];

    var storeDataTipoCamp = new Ext.data.SimpleStore({
        fields: ['idcamp','camp'],
        data : dataTipoCamp
    });

    ////------------ Declaracion de variables ------------////
    var winIns, winMod;

    ////------------ Botones ------------////
    btnAdicionar = new Ext.Button({
        id			: 'btnAgrCampPerf',
        //hidden		: true,
        icon		: perfil.dirImg+'adicionar.png',
        iconCls		: 'btn',
        prevTab 	: 'btnAyuCampPerf',
        text		: etiquetas.lbBtnAdicionar,
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

    btnModificar 	= new Ext.Button({
        disabled	: true,
        id			: 'btnModCampPerf',
        //hidden		: true,
        icon		: perfil.dirImg+'modificar.png',
        iconCls		: 'btn',
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
        id			: 'btnEliCampPerf',
        //hidden		: true,
        icon		: perfil.dirImg+'eliminar.png',
        iconCls		: 'btn',
        nextTab		: 'btnAyuCampPerf',
        prevTab : 'btnModCampPerf',
        text		: etiquetas.lbBtnEliminar,
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
                eliminarCampo();
        }
    });

    btnAyuda = new Ext.Button({
        id: 'btnAyuCampPerf',
        iconCls: 'ayuda',
        text: '<b>'+etiquetas.lbBtnAyuda+'</b>',
        nextTab		: 'btnAgrCampPerf',
        prevTab : 'btnEliCampPerf',
        disabled: false,
        toolTip: etiquetas.textToolTipHelp,
        icon: perfil.dirImg + 'ayuda.png',
        hotKey: {
            idGrupo: 'grid1',
            config: {
                key: 104,
                alt: true
            }
        },
        menu:
            new Ext.menu.Menu({
                id: 'mainMenu',
                items: [
                    {
                        handler: function() {							
                            cargarAyuda();
                        }, text: etiquetas.lbBtnAyuda,
                        id: 'btnAyuDesktop',
                        icon: perfil.dirImg + 'ayuda.png',
                        iconCls: 'btn',
                        tooltip:'Ayuda del sistema'
                    },
                    {
                        //text: etiquetas.lbBtnAcercaDe,
                        text:'Acerca de',
                        id: 'acercade',
                        icon: perfil.dirImg  + 'info.png',
                        iconCls: 'btn',
                        tooltip: "Acerca de <b>(Alt+...s)</b>",
                        handler: function() {

                            var uri = "seguridad";
                            acercaDe.show(uri);
                        }}
                ]
            })

    });
    /**btnAyuda 	= new Ext.Button({
        id			: 'btnAyuCampPerf',
        icon		: perfil.dirImg+'ayuda.png',
        iconCls		: 'btn',
        text		: etiquetas.lbBtnAyuda,
        tooltip		: etiquetas.textToolTipHelp,
        nextTab		: 'btnAgrCampPerf',
        prevTab : 'btnEliCampPerf',
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

    function focusCampo() {
        btnAdicionar.focus(200);
    }

    ////------------ Store del Grid de Perfiles ------------////
    stGpPerfiles =  new Ext.data.Store({
        url: 'cargarcampos',
        reader:new Ext.data.JsonReader({
            totalProperty: "cantidad_filas",
            root: "datos",
            id: "id"
        },
        [{
            name:'idcampo',
            mapping:'idcampo'
        },

        {
            name:'nombre',
            mapping:'nombre'
        },

        {
            name:'tipo',
            mapping:'tipo'
        },

        {
            name:'alias',
            mapping:'nombreamostrar'
        },

        {
            name:'visible',
            mapping:'visible'
        },

        {
            name:'longitud',
            mapping:'longitud'
        },

        {
            name:'tipocampo',
            mapping:'tipocampo'
        },

        {
            name:'descripcion',
            mapping:'descripcion'
        },

        {
            name: 'idexpresiones',
            mapping:'idexpresiones'
        },

        {
            name:'denominacion',
            mapping:'denominacion'
        }]
        )
    });


    sm = new Ext.grid.RowSelectionModel({
        singleSelect:true
    });

    sm.on('beforerowselect', function (smodel, rowIndex, keepExisting, record){
        btnModificar.enable();
        btnEliminar.enable();
    }, this);

    ////------------ Defino el grid ------------////
    var gpPErfiles = new Ext.grid.GridPanel({
        title: etiquetas.titleGridDatos,
        cls:'x-toolbar',
        border:false,
        frame:false,
        region:'center',
        autoExpandColumn:'expandir',
        store:stGpPerfiles,
        sm:sm,
        columns: [
        {
            hidden: true,
            hideable: false,
            dataIndex: 'idcampo'
        },

        {
            id:'expandir',
            header: etiquetas.lbDenominacion,
            width:100,
            dataIndex: 'nombre',
            sortable : true
        },

        {
            header: etiquetas.lbNombreamostrar,
            width:150,
            dataIndex: 'alias',
            sortable : true
        },

        {
            header: etiquetas.lbTipodeDato,
            dataIndex: 'tipo',
            sortable : true
        },

        {
            header: etiquetas.lbVisible,
            width:50,
            dataIndex: 'visible',
            sortable : true
        },

        {
            header: etiquetas.lbLongitud,
            width:50,
            dataIndex: 'longitud',
            sortable : true
        },

        {
            header: etiquetas.lbExpresion,
            width:150,
            dataIndex: 'denominacion',
            sortable : true
        },

        {
            header: etiquetas.lbTipodeCampo,
            width:150,
            dataIndex: 'tipocampo',
            sortable : true
        }
        ],
        loadMask:{
            store:stGpPerfiles
        },
        bbar:new Ext.PagingToolbar({
            pageSize: 15,
            beforePageText: etiquetas.textPagina,
            afterPageText:etiquetas.textDe,
            id:'ptbaux',
            store: stGpPerfiles,
            displayInfo: true,
             displayMsg: etiquetas.lbTitMsgResultados,
            emptyMsg: ''
        })
    });

    ////------------ Renderiar el arbol ------------////
    var panel = new Ext.Panel({
        layout		: 'border',
        id			: 'grid1',
        keyMapGroup	: true,
        items		: [gpPErfiles],
        tbar		: [btnAdicionar,btnModificar,btnEliminar,'->',btnAyuda]
    });

    ////--------------Funciones usadas en las TC------------////
    panel.on('afterlayout',function() {
        panel.habilitarKeyMap();
    });

    function enfocarElemento() {
        panel.getTopToolbar().items.items[0].focus();
    }

    ////---------------------------Store del combobox de expresiones-----------------///
    var storeExp =  new Ext.data.Store({
        url: '../gestexpresiones/cargarexpresiones',
        reader:new Ext.data.JsonReader(
        {
            root:'datos',
            id:'idgrupos'
        },
        [
        {
            name: 'idexpresiones',
            mapping:'idexpresiones'
        },

        {
            name:'denominacion',
            mapping:'denominacion'
        }
        ])
    });

    var vpGestPerfil = new Ext.Viewport({
        layout:'fit',
        items:panel
    })

    stGpPerfiles.load({
        params:{
            start:0,
            limit:15
        }
    });

    storeExp.load({
        params:{
            start:0,
            limit:15
        }
    });

    ////------------ Formulario de perfil ------------////
    var regPerfil = new Ext.FormPanel({
        labelAlign: 'top',
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        items: [{
            layout:'column',
            items:[{
                columnWidth:.33,
                layout:'form',
                items:[{
                    xtype:'textfield',
                    fieldLabel:etiquetas.lbDenominacion,
                    id:'nombre',
	                maxLength:60,
                    allowBlank:false,
                    blankText:etiquetas.lbMsgEstecampoesrequerido,
                    vtype:'vtletrasguion',
                    anchor:'95%'
                },
                {
                    xtype:'combo',
                    fieldLabel:etiquetas.lbTipodeDato,
                    enableQtip : true,
                    id:'tipo',
                    displayField:'iddata',
                    valueField:'data',
                    store:storeDataTipoData,
                    triggerAction: 'all',
                    typeAhead: true,
                    allowBlank:false,
                    mode: 'local',
                    editable:false,
                    emptyText:etiquetas.lbMsgSeleccionetipodedato,
                    anchor:'95%'


                }]
            },{
                columnWidth:.33,
                layout: 'form',
                items: [{
                    xtype:'textfield',
                    fieldLabel: etiquetas.lbNombreamostrar,
                    id:'alias',
	                maxLength:255,
                    allowBlank:false,
                    blankText:etiquetas.lbMsgEstecampoesrequerido,
                    vtype:'vtcampo',
                    anchor:'95%'
                },{
                    xtype:'combo',
                    fieldLabel: etiquetas.lbTipodeCampo,
                    enableQtip : true,
                    id:'tipocampo',
                    displayField:'camp',
                    valueField:'idcamp',
                    store:storeDataTipoCamp,
                    triggerAction: 'all',
                    typeAhead: true,
                    allowBlank:false,
                    mode: 'local',
                    editable:false,
                    emptyText:etiquetas.lbMsgSeleccionetipodecampo,
                    anchor:'95%'
                }]
            },{
                columnWidth:.33,
                layout:'form',
                items:[{
                    xtype:'textfield',
                    fieldLabel:etiquetas.lbLongitud,
                    id:'longitud',
	                maxLength:6,
                    allowBlank:false,
                    regexText:etiquetas.lbMsgSolopuedeentrarvaloresnumericos,
                    regex:/^\d*$/,
                    anchor:'95%'
                },
                {
                    xtype:'combo',
                    fieldLabel:etiquetas.lbVisible,
                    id:'visible',
                    enableQtip : true,
                    displayField:'vis',
                    valueField:'idvis',
                    triggerAction: 'all',
                    typeAhead: true,
                    store:storeDataVis,
                    mode: 'local',
                    allowBlank:false,
                    editable:false,
                    forceSelection:true,
                    selectOnFocus:true,
                    emptyText:etiquetas.lbMsgSeleccioneunaopcion,
                    anchor:'95%'
                }]
            },{
                columnWidth:.5,
                layout:'form',
                items:[new Ext.form.ComboBox({
                    emptyText:etiquetas.lbMsgSeleccionarexpresion,
                    editable:false,
                    enableQtip : true,
                    fieldLabel:etiquetas.lbMsgExpresionesregular,
                    store:storeExp,
                    valueField:'idexpresiones',
                    displayField:'denominacion',
                    hiddenName:'idexpresiones',
                    forceSelection:true,
                    typeAhead: true,
                    mode: 'local',
                    allowBlank:false,
                    triggerAction: 'all',
                    selectOnFocus:true,
                    anchor:'95%'
                })]
            },{
                columnWidth:.5,
                layout:'form',
                items:[{
                    xtype:'textarea',
	                maxLength:255,
                    fieldLabel:etiquetas.lbDescripcion,
                    id:'descripcion',
                    maxLength:255,
                    anchor:'100%'
                }]
            }]
        }]
    });

    ////------------ Cargar la ventana ------------////
    function winForm(opcion){

        switch(opcion){
            case 'Ins':{
                if(!winIns){
                    winIns = new Ext.Window({
                        modal: true,
                        closeAction:'hide',
                        layout:'fit',
                        title:etiquetas.lbTitAdicionarcamposalperfil,
                        width:530,
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
                        },{
                            icon:perfil.dirImg+'aplicar.png',
                            iconCls:'btn',
                            text:etiquetas.lbBtnAplicar,
                            tooltip	: etiquetas.tooltipAplicarVen,
                            handler:function(){
                                adicionarCampos('apl');
                            }
                        },{
                            icon:perfil.dirImg+'aceptar.png',
                            iconCls:'btn',
                            nextTab : 'nombre',
                            text:etiquetas.lbBtnAceptar,
                            tooltip	: etiquetas.tooltipAceptarVen,
                            handler:function(){
                                adicionarCampos();
                            }
                        }]
                    });
                }
                regPerfil.getForm().reset();
                winIns.add(regPerfil);
                winIns.doLayout();
                winIns.show();
                Ext.getCmp('nombre').focus(false,200);
            }
            break;
            case 'Mod':{
                if(!winMod){
                    winMod= new Ext.Window({
                        modal: true,
                        closeAction:'hide',
                        layout:'fit',
                        title:etiquetas.lbTitModificarcamposdelperfil,
                        width:530,
                        height:260,
                        listeners:{
                            hide:function(w){
                                panel.getTopToolbar().items.items[0].focus();
                            }
                        },
                        buttons:[{
                            icon:perfil.dirImg+'cancelar.png',
                            iconCls:'btn',
                            text:etiquetas.lbBtnCancelar,
                            tooltip	: etiquetas.tooltipCancelarVen,
                            handler:function(){
                                winMod.hide();
                            }

                        },{
                            icon:perfil.dirImg+'aceptar.png',
                            iconCls:'btn',
                            nextTab : 'nombre',
                            text:etiquetas.lbBtnAceptar,
                            tooltip	: etiquetas.tooltipAceptarVen,
                            handler:function(){
                                modificarCampo();
                            }
                        }]
                    });
                }
                regPerfil.getForm().reset();
                winMod.add(regPerfil);
                winMod.doLayout();
                winMod.show();
                regPerfil.getForm().loadRecord(sm.getSelected());
                Ext.getCmp('nombre').focus(false,200);
            }
            break;
        }
    }

    function adicionarCampos(apl){

        if (regPerfil.getForm().isValid()){
            Secodena.mostrarMascara('maskConexion',etiquetas.msgWait,etiquetas.msgAdd);
            regPerfil.getForm().submit({
                url:'insertarcampo',
                failure: function(form, action){
                    Secodena.ocultarMascara('maskConexion');
                    if(action.result.codMsg != 3){
                        //mostrarMensaje(action.result.codMsg,action.result.mensaje, focusCampo);
                        regPerfil.getForm().reset();
                        if(!apl)
                            winIns.hide();
                        stGpPerfiles.reload();
                        sm.clearSelections();
                        btnModificar.disable();
                        btnEliminar.disable();
                    }
                    if(action.result.codMsg == 3) mostrarMensaje(action.result.codMsg,action.result.mensaje, focusCampo);

                }
            });
        }
        else
            mostrarMensaje(3,etiquetas.lbMsgErrorEnCamops, focusCampo);
    }

    function modificarCampo(){
        if (regPerfil.getForm().isValid()){
            Secodena.mostrarMascara('maskCamposMod',etiquetas.msgWait,etiquetas.msgMod);
            regPerfil.getForm().submit({
                url:'modificarcampo',
                params:{
                    idcampo:sm.getSelected().data.idcampo
                },
                failure: function(form, action){
                    Secodena.ocultarMascara('maskCamposMod');
                    if(action.result.codMsg != 3){
                        //mostrarMensaje(action.result.codMsg,action.result.mensaje, focusCampo);
                        stGpPerfiles.reload();
                        winMod.hide();
	                    sm.clearSelections();
	                    btnModificar.disable();
	                    btnEliminar.disable();
                    }
                    if(action.result.codMsg == 3) mostrarMensaje(action.result.codMsg,action.result.mensaje, focusCampo);

                }
            });
        }
        else
            mostrarMensaje(3,etiquetas.lbMsgErrorEnCamops, focusCampo);
    }

    function eliminarCampo(){
        mostrarMensaje(2,etiquetas.msgEliminarCampos,elimina);
        function elimina(btnPresionado){
            if (btnPresionado == 'ok'){
                Secodena.mostrarMascara('maskCamposDel',etiquetas.msgWait,etiquetas.msgDEL);
                Ext.Ajax.request({
                    url: 'eliminarcampo',
                    method:'POST',
                    params:{
                        idcampo:sm.getSelected().data.idcampo
                    },
                    callback: function (options,success,response){
                        Secodena.ocultarMascara('maskCamposDel');
                        responseData = Ext.decode(response.responseText);
                        if(responseData.codMsg == 1){
                            //mostrarMensaje(responseData.codMsg,responseData.mensaje, focusCampo);
                            stGpPerfiles.reload();
                            sm.clearSelections();
                            btnModificar.disable();
                            btnEliminar.disable();
                        }
                        if(responseData.codMsg == 3) mostrarMensaje(responseData.codMsg,responseData.mensaje, focusCampo);
                    }
                });
            }
        }
    }

    function cargarAyuda(){
        var title	= 'Ayuda de campos din&aacute;micos';
        var referencia	= 'seguridad/gestcampos';
        help.show(title,referencia);
    }

}
