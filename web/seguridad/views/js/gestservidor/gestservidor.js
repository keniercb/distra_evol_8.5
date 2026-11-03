UCID.portal.cargarEtiquetas('gestservidor',cargarInterfaz);
////------------ Inicializo el singlenton QuickTips ------------////
Ext.QuickTips.init();
////------------ Declarar Variables ------------////
var winIns = null, winMod = null, regServ, tipoServidor, openldap, ldap, probarConForm;
var auxauth = 2; //Cuando el valor que adopta es 1 todo esta bien, cuando es 3 quiere decir que se probo la conexion pero que sigue dando errores. 2 es su valor por defecto.
var ventanaadicionar=false;
var tfpuerto;

function cargarInterfaz(perfil,etiquetas) {
    ////------------ Botones ------------////
    btnAdicionar = new Ext.Button ({
        id:'btnAgrServ',
        hidden:true,
        tooltip:etiquetas.textToolTipadicionar,
        icon:perfil.dirImg+'adicionar.png',
        prevTab : 'btnAyuServ',
        iconCls:'btn',
        text:etiquetas.lbBtnAdd,
        hotKey	: {
            idGrupo		  :'grid1',
            config  	  : {
                key		  : 105,
                alt		  : true
            }
        },
        handler:function() {
            winForm('Ins');
            tfpassword.allowBlank = true;
        }
    });

    btnModificar = new Ext.Button ({
        disabled:true,
        id:'btnModServ',
        tooltip:etiquetas.textToolTipMod,
        hidden:true,
        icon:perfil.dirImg+'modificar.png',
        iconCls:'btn',
        text:etiquetas.lbBtnModificar,
        hotKey	: {
            idGrupo		  :'grid1',
            config  	  : {
                key		  : 109,
                alt		  : true
            }
        },
        handler:function() {
            if(sm.getCount() >= 1) {
                winForm('Mod');
                tfpassword.allowBlank = true;
            }
        }
    });

    btnEliminar 		= new Ext.Button ({
        disabled:true,
        id:'btnEliServ',
        tooltip:etiquetas.textToolTipDel,
        hidden:true,
        icon:perfil.dirImg+'eliminar.png',
        iconCls:'btn',
        text:etiquetas.lbBtnEliminar,
        hotKey	: {
            idGrupo	: 'grid1',
            config  	: {
                key	: Ext.EventObject.DELETE,
                stopEvent : true
            }
        },
        handler:function() {
            if(sm.getCount() >= 1)
                eliminarservidor();
        }
    });

    btnProbarConexAdd 	= new Ext.Button ({
        icon:perfil.dirImg+'probar.png',
        tooltip	: etiquetas.TooltipProbarConex,
        iconCls:'btn',
        text:'Probar',
        hidden: true,
        id: 'probarConAdd',
        handler:function(){
            winProbarCon.show();
        }
    });

    btnProbarConexMod 	= new Ext.Button ({
        icon:perfil.dirImg+'probar.png',
        tooltip	: etiquetas.TooltipProbarConex,
        iconCls:'btn',
        text:'Probar',
        disabled:true,
        id: 'probarConMod',
        handler:function(){
            winProbarCon.show();
        }
    });
    btnAyuda = new Ext.Button({
        id: 'btnAyuServ',
        iconCls: 'btn',
        text: '<b>Ayuda</b>',
        disabled: false,
        toolTip: etiquetas.textToolTipHelp,
        nextTab : 'btnAgrServ',
        prevTab : 'btnEliServ',
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
    /**btnAyuda = new Ext.Button ({
        id:'btnAyuServ',
        tooltip:etiquetas.textToolTipHelp,
        nextTab : 'btnAgrServ',
        prevTab : 'btnEliServ',
        icon:perfil.dirImg+'ayuda.png',
        iconCls:'btn',
        text:etiquetas.lbBtnAyuda,
        hotKey	: {
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

    ////------------ Combo Box ------------////
    var dataTmp = [
    ['bd', 'Servidor de base datos'],
    ['autenticaci&oacute;n', 'Servidor de autenticaci\xf3n']
    ];

    var storeDataTmp = new Ext.data.SimpleStore({
        fields: ['tiposervidor','denominacion'],
        data : dataTmp
    });

    ////------------ Store del Grid de Servidores ------------////
    var stGpServ =  new Ext.data.Store({
        url: 'cargarservidores',
        reader:new Ext.data.JsonReader({
            totalProperty: "cantidad_filas",
            root: "datos",
            id: "id"
        }, [
        {
            name:'idservidor',
            mapping:'id'
        },

        {
            name:'denominacion',
            mapping:'text'
        },

        {
            name:'tiposervidor',
            mapping:'tiposervidor'
        },

        {
            name:'descripcion',
            mapping:'descripcion'
        },

        {
            name:'ip',
            mapping:'ip'
        },

        {
            name:'type',
            mapping:'type'
        },

        {
            name:'user',
            mapping:'user'
        },

        {
            name:'baseDN',
            mapping:'cadconexion'
        },

        {
            name:'puerto',
            mapping:'puerto'
        },

        {
            name:'chekssl',
            mapping:'ssl'
        },

        {
            name:'chektsl',
            mapping:'tsl'
        }
        ])
    });

    ////------------ Establesco modo de seleccion de grid (single)------------////
    sm = new Ext.grid.RowSelectionModel({
        singleSelect:false
    });

    sm.on('beforerowselect', function (smodel, rowIndex, keepExisting, record){
        btnModificar.enable();
        btnEliminar.enable();
    }, this);

    sm.on('rowselect', function (smodel, rowIndex, keepExisting, record){
        authaux = sm.getSelected().data.tiposervidor;
        if(sm.getSelected().data.type == 'openldap') {
            openldap = sm.getSelected().data.type;
            ldap = '';
            flagaux = sm.getSelected().data.type;
        }
        if(sm.getSelected().data.type == 'ldap') {
            ldap = sm.getSelected().data.type;
            openldap = '';
            flagaux = sm.getSelected().data.type
        }
        if(sm.getCount() != 1)
            btnModificar.disable();
        else
            btnModificar.enable();
    }, this);

    sm.on('rowdeselect', function (smodel, rowIndex, keepExisting, record) {
        if(sm.getCount()!=1)
            btnModificar.disable();
        else
            btnModificar.enable();
    }, this);

    ////------------ Defino el grid de Servidores ------------////
    var gpServ = new Ext.grid.GridPanel({
        title: etiquetas.titleGridServidores,
        cls:'x-toolbar',
        border:false,
        frame:false,
        region:'center',
        autoExpandColumn:'expandir',
        store:stGpServ,
        sm:sm,
        columns:[
        {
            hidden: true,
            hideable: false,
            dataIndex: 'idservidor'
        },

        {
            header:etiquetas.lbServidor,
            width:150,
            dataIndex: 'denominacion',
            sortable : true
        },

        {
            header: etiquetas.lbIP,
            dataIndex: 'ip',
            sortable : true
        },

        {
            header: etiquetas.lbTipo,
            dataIndex: 'tiposervidor',
            sortable : true
        },

        {
            id:'expandir',
            header: etiquetas.lbDes,
            width:350,
            dataIndex: 'descripcion',
            sortable : true
        }
        ],
        loadMask:{
            store:stGpServ
        },
        bbar:new Ext.PagingToolbar({
            pageSize: 15,
            id:'ptbaux',
            store: stGpServ,
            displayInfo: true,
            displayMsg: etiquetas.lbMsgbbarI,
            emptyMsg: etiquetas.lbMsgbbarII
        })
    });

    ////------------ Renderiar el arbol ------------////
    var panel = new Ext.Panel({
        layout:'border',
        items:[gpServ],
        id:'grid1',
        keyMapGroup: true,
        tbar:[btnAdicionar,btnModificar,btnEliminar,'->',btnAyuda]
    });

    ////--------------Funciones usadas en las TC------------////
    panel.on('afterlayout',function() {
        panel.habilitarKeyMap();
    });

    function enfocarElemento() {
        panel.getTopToolbar().items.items[0].focus();
    }

    ////------------ Viewport ------------////
    var vpServidorAut = new Ext.Viewport({
        layout:'fit',
        items:panel
    })

    stGpServ.load({
        params:{
            start:0,
            limit:15
        }
    });

    ////************ ITEMS DEL FORMULARIO ************////

    ////------------ Combo servidores del formulario ------------////
    var cbservidores = new Ext.form.ComboBox ({
        emptyText:etiquetas.lbMsgSelect,
        editable:false,
        fieldLabel:etiquetas.lbTiipoBD,
        store:storeDataTmp,
        tabIndex:3,
        enableQtip : true,
        id:'cbservidores',
        prevTab : 'ip',
        valueField:'tiposervidor',
        displayField:'denominacion',
        hiddenName:'tiposervidor',
        typeAhead: true,
        mode: 'local',
        width: 150,
        allowBlank:false,
        triggerAction: 'all',
        selectOnFocus:true,
        anchor:'90%'
    })

    ////------------ Textfield usuario del formulario ------------////
    var tfusuario = new Ext.form.TextField ({
        fieldLabel: etiquetas.lbTitUsuario,
        tabIndex:6,
        allowBlank:false,
        maxLength:50,
        width:335,
        id:'user'
    })

    var tfpassword = new Ext.form.TextField ({
        fieldLabel : etiquetas.lbContrasena,
        inputType : 'password',
        allowBlank:false,
        tabIndex:7,
        maxLength:30,
        width:335,
        id:'passw'
    })

    tfpuerto = new Ext.form.NumberField ({
        tabIndex:11,
        maxLength:4,
        anchor:'90%',
        fieldLabel:etiquetas.lbPuerto,
        value: 389,
        allowBlank:true,
        id:'puerto'
    })

    var panelpuerto = new Ext.Panel ({
        hidden:'true',
        autoHeight:true,
        labelAlign:'top',
        layout:'form',
        items:[tfpuerto]
    })

    var chbssl = new Ext.form.Checkbox ({
        boxLabel 	:  etiquetas.lbSSL,
        name  		: 'chekssl',
        id		: 'chekssl',
        padding		: '0 0 10 0',
        margins		: '0 0 0 0',
        inputValue 	: true
    });

    var chbtsl = new Ext.form.Checkbox ({
        boxLabel 	: etiquetas.lbTSL,
        name  		: 'chektsl',
        id		: 'chektsl',
        style : 'padding: 10px',
        inputValue 	: true
    });

    var baseDN = new Ext.form.TextField ({
        id:'baseDN',
        tabIndex:2,
        maxLength:100,
        fieldLabel:etiquetas.lbBaseDN,
        allowBlank: false
    })

    var chbAgrupador = new Ext.form.CheckboxGroup ({
        xtype: 'checkboxgroup',
        labelSeparator: '',
        id: 'chbgp',
        style : 'margins: 20px',
        columns: 2,
        vertical: true,
        items: [chbssl, chbtsl]
    });

    var panel3= new Ext.Panel({
        hidden:'true',
        autoHeight:true,
        labelAlign:'top',
        layout:'form',
        autoWidth:true,
        items:[baseDN]
    });

    ////------------ Fieldset usuario del formulario ------------////
    var fsusuario = new Ext.form.FieldSet({
        title: etiquetas.lbTitConexion,
        autoHeight:true,
        hidden:'true',
        anchor:'100%',
        items:[tfusuario, tfpassword]
    })

    ////------------ RadioButton LDAP y OpenLDAP ------------////
    var chbldap = new Ext.form.Radio ({
        hideLabel:'true',
        tabIndex:5,
        name:'ldap',
        boxLabel:etiquetas.lbTitLDAP,
        id:'ldap'
    })

    var chbopenldap = new Ext.form.Radio ({
        hideLabel:'true',
        tabIndex:5,
        name:'openldap',
        boxLabel:etiquetas.lbTitOpenLDAP,
        id:'openldap',
        nextTab : 'puerto'
    })

    ////------------ Fieldset tipos de autenticaci n del formulario ------------////
    var fstiposaut = new Ext.form.FieldSet ({
        title: etiquetas.lbTitTipoAuth,
        autoHeight:true,
        collapsed:false,
        hidden:'true',
        anchor:'90%',
        id:'fstiposaut',
        items:[chbldap,chbopenldap]
    })
    ////************ FIN ITEMS DEL FORMULARIO ************////

    ////------------ Formulario ------------////
    regServ = new Ext.FormPanel ({
        labelAlign: 'top',
        autoHeight:true,
        autoWidth:true,
        monitorValid:true,
        id:1,
        enableKeyEvents: true,
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        items: [{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout:'form',
                items:[{
                    xtype:'textfield',
                    fieldLabel:etiquetas.lbNombreS,
                    id:'denominacion',
                    nextTab : 'ip',
                    tabIndex:1,
                    enableKeyEvents: true,
                    allowBlank: false,
                    vtype:'vtalfanumericos',
                    anchor:'90%'
                },
                cbservidores,panelpuerto,chbAgrupador
                ]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [{
                    xtype:'textfield',
                    fieldLabel: etiquetas.lbIPLab,
                    id:'ip',
                    nextTab : 'cbservidores',
                    prevTab : 'denominacion',
                    tabIndex:2,
                    allowBlank: false,
                    blankText:etiquetas.lbMsgCReq,
                    vtype:'vtdirip',
                    enableKeyEvents: true,
                    anchor:'90%'
                },fstiposaut,panel3]
            },{
                columnWidth:.99,
                layout: 'form',
                items: [fsusuario]
            },{
                columnWidth:.99,
                layout: 'form',
                items: [{
                    xtype:'textarea',
                    autoHeight:true,
                    tabIndex:8,
                    fieldLabel: etiquetas.lbText,
                    id: 'descripcion',
                    nextTab : 'btnCancelar',
                    maxLength:255,
                    anchor:'100%'
                }]
            }]
        }]
    });

    regServ.on("clientvalidation",function(f,v) {
        if(v) {
            (ventanaadicionar) ? Ext.getCmp('probarConAdd').enable():Ext.getCmp('probarConMod').enable();
        }
        else
            (ventanaadicionar) ? Ext.getCmp('probarConAdd').disable():Ext.getCmp('probarConMod').disable();
    });

    function validar() {
        if(regServ.getForm().isValid())
            (ventanaadicionar) ? Ext.getCmp('probarConAdd').enable():Ext.getCmp('probarConMod').enable();
    }

    ////------------ Formulario para probar conexion ------------////
    probarConForm = new Ext.FormPanel ({
        labelAlign: 'left',
        autoHeight:true,
        autoWidth:true,
        id:'probarConForm',
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        items: [{
            xtype:'textfield',
            fieldLabel:etiquetas.lbUsuario,
            id:'usuario',
            width: 120,
            name: 'usuario',
            allowBlank: false,
            maxLength:50,
            anchor:'90%'
        }, {
            xtype:'textfield',
            fieldLabel:etiquetas.lbContrasena,
            id:'password',
            width: 120,
            inputType : 'password',
            name: 'password',
            maxLength:30,
            allowBlank: false,
            anchor:'90%'
        }]
    });

    var	winProbarCon = new Ext.Window ({
        modal: true,
        closeAction:'hide',
        layout:'fit',
        title: etiquetas.titleConnexion,
        width:300,
        height:250,
        resizable:false,
        autoHeight:true,
        shadow:false,
        items:[probarConForm],
        buttons:[ {
            icon:perfil.dirImg+'cancelar.png',
            iconCls:'btn',
            text:etiquetas.lbBtnCancelar,
            tooltip	: etiquetas.tooltipCancelarVen,
            handler:function(){
                winProbarCon.hide();                
                Ext.getCmp('usuario').reset();
                Ext.getCmp('password').reset();
            }
        },{
            icon:perfil.dirImg+'probar.png',
            iconCls:'btn',
            text:'Probar',
            handler:function() {
                if(probarConForm.getForm().isValid()) {
                    Secodena.mostrarMascara('maskConexion',etiquetas.msgWait,etiquetas.msgProbarConex);
                    regServ.getForm().submit ({
                        url:'probarConexion',
                        waitMsg:etiquetas.lbMsgProbandoS,
                        params:{
                            usuario:Ext.getCmp('usuario').getValue(),
                            password: Ext.getCmp('password').getValue()
                        },
                        failure: function(form, action) {
                            Secodena.ocultarMascara('maskConexion');
                            if(action.result.codMsg != 3) {
                                if(winIns != null) {
                                    if(winIns.isVisible()) {
                                        Ext.getCmp('btnInsServAut').enable();
                                        Ext.getCmp('btnInsServAutApli').enable();
                                    }
                                } else if(winMod != null) {
                                    if(winMod.isVisible())
                                        Ext.getCmp('btnAceptarMod').enable();
                                }
                                mostrarMensaje(action.result.codMsg,action.result.mensaje, function (btnPresionado) {
                                    if (btnPresionado == 'ok') {
                                        winProbarCon.hide();
                                        Ext.getCmp('usuario').reset();
                                        Ext.getCmp('password').reset();
                                    }
                                });
                            }
                            if(action.result.codMsg == 3) {
                                mostrarMensaje(action.result.codMsg,action.result.mensaje, function (btnPresionado) {
                                    if (btnPresionado == 'ok') {
                                        winProbarCon.hide();
                                        Ext.getCmp('usuario').reset();
                                        Ext.getCmp('password').reset();
                                        if(winIns != null) {
                                            if(winIns.isVisible()) {
                                                Ext.getCmp('btnInsServAut').disable();
                                                Ext.getCmp('btnInsServAutApli').disable();
                                            }
                                        } else if(winMod != null) {
                                            if(winMod.isVisible())
                                                Ext.getCmp('btnAceptarMod').disable();
                                        }
                                    }
                                });
                            }
                        }
                    });
                } else
                    mostrarMensaje(3,etiquetas.lbMsgErrorEnCamops);
            }
        }]
    });

    ////------------ Evento para activar o desactivar fieldset tipos de autenticacion ------------////
    cbservidores.on('select',function() {
        tipoAutenticacion((cbservidores.getValue() == 'autenticaci&oacute;n'));
        if(tfpuerto.getValue()=='')
            tfpuerto.setValue(389);
        if(cbservidores.getValue() == 'autenticaci&oacute;n')
            baseDN.allowBlank = false;
        else
            baseDN.allowBlank = true;
        if(cbservidores.getValue() == 'autenticaci&oacute;n') {
            Ext.getCmp('probarConAdd').enable();
            if(winIns != null) {
                if(winIns.isVisible()) {
                    Ext.getCmp('btnInsServAutApli').disable();
                    Ext.getCmp('btnInsServAut').disable();
                }
                if(winMod != null) {
                    if(winMod.isVisible()) {
                        Ext.getCmp('btnAceptarMod').disable();
                    }
                }
            } else if(winMod != null) {
                if(winIns != null) {
                    if(winIns.isVisible()) {
                        Ext.getCmp('btnInsServAutApli').enable();
                        Ext.getCmp('btnInsServAut').enable();
                    }
                } else if(winMod.isVisible()) {
                    Ext.getCmp('btnAceptarMod').enable();
                }
            }
        }
    })

    cbservidores.on('change',function() {
        if(cbservidores.getValue() == 'autenticaci&oacute;n')
            baseDN.allowBlank = false;
        else
            baseDN.allowBlank = true;
    })

    ////------------ Evento para activar o desactivar fieldset usuario a travez del radio Openldap ------------////
    chbldap.on('check',function(value) {
        if(chbldap.getValue() == true) {
            chbopenldap.setValue(!chbldap.getValue());
            ldap = 'ldap';
            openldap = '';
        }
    })

    chbopenldap.on('check',function(value) {
        if(chbopenldap.getValue() == true) {
            chbldap.setValue(!chbopenldap.getValue());
            openldap = 'openldap';
            ldap = '';
        }
    })

    chbssl.on('check',function(checked) {
        if(tfpuerto.getValue() != '636')
            tfpuerto.setValue('636');
        else
            tfpuerto.setValue('389');
    })

    function closeWindow(valor) {
        panelpuerto.hide();
        chbAgrupador.hide();
        panel3.hide();
        (ventanaadicionar) ? Ext.getCmp('probarConAdd').hide():Ext.getCmp('probarConMod').hide();
        (ventanaadicionar) ? Ext.getCmp('probarConAdd').disable():Ext.getCmp('probarConMod').disable();
        if(valor == 1) {
            winIns.hide();
            Ext.getCmp('btnInsServAut').enable();
            Ext.getCmp('btnInsServAutApli').enable();
        } else {
            winMod.hide();
            Ext.getCmp('btnAceptarMod').enable();
        }
    }

    ////------------ Cargar la ventana ------------////
    function winForm(opcion){
        switch(opcion){
            case 'Ins':{
                ventanaadicionar=true;
                if(!winIns) {
                    winIns = new Ext.Window({
                        modal: true,
                        closeAction:'hide',
                        layout:'fit',
                        title:etiquetas.lbTitAdicionarV,
                        width:400,
                        height:400,
                        resizable:false,
                        x:312,
                        y:50,
                        autoHeight:true,
                        shadow:false,
                        listeners:{
                            hide:function(w){
                                panel.getTopToolbar().items.items[0].focus();
                            }
                        },
                        buttons:[
                        btnProbarConexAdd,
                        {
                            icon:perfil.dirImg+'cancelar.png',
                            iconCls:'btn',
                            id : 'btnCancelar',
                            text:etiquetas.lbBtnCancelar,
                            tooltip	: etiquetas.tooltipCancelarVen,
                            handler:function(){
                                closeWindow(1);
                            }
                        },{
                            icon:perfil.dirImg+'aplicar.png',
                            id:'btnInsServAutApli',
                            iconCls:'btn',
                            text:etiquetas.lbBtnAplicar,
                            tooltip: etiquetas.tooltipAplicarVen,
                            handler:function() {
                                adicionarservidor('apl');
                            }
                        },{
                            icon:perfil.dirImg+'aceptar.png',
                            iconCls:'btn',
                            nextTab : 'denominacion',
                            id:'btnInsServAut',
                            text:etiquetas.lbBtnAceptar,
                            tooltip	: etiquetas.tooltipAceptarVen,
                            handler:function(){
                                adicionarservidor();
                            }
                        }]
                    });
                }
                panelpuerto.hide();
                chbAgrupador.hide();
                panel3.hide();
                Ext.getCmp('probarConAdd').hide();
                Ext.getCmp('probarConAdd').disable();
                fsusuario.hide();
                if(regServ)
                    regServ.getForm().reset();
                fstiposaut.hide();
                winIns.add(regServ);
                winIns.doLayout();
                winIns.show();
                Ext.getCmp('denominacion').focus(false,200);
            }
            break;
            case 'Mod': {
                ventanaadicionar=false;
                if(!winMod) {
                    winMod = new Ext.Window({
                        modal: true,
                        closeAction:'hide',
                        layout:'fit',
                        title:etiquetas.lbTitModificalo,
                        width:400,
                        height:400,
                        x:312,
                        y:50,
                        resizable:false,
                        autoHeight:true,
                        shadow:false,
                        listeners:{
                            hide:function(w){
                                panel.getTopToolbar().items.items[0].focus();
                            }
                        },
                        buttons:[
                        btnProbarConexMod,
                        {
                            icon:perfil.dirImg+'cancelar.png',
                            tooltip	: etiquetas.tooltipCancelarVen,
                            iconCls:'btn',
                            id : 'btnCancelar',
                            text:etiquetas.lbBtnCancelar,
                            handler:function() {
                                closeWindow(0);
                            }
                        },{
                            icon:perfil.dirImg+'aceptar.png',
                            iconCls:'btn',
                            id: 'btnAceptarMod',
                            nextTab : 'denominacion',
                            text:etiquetas.lbBtnAceptar,
                            tooltip	: etiquetas.tooltipAceptarVen,
                            handler:function(){
                                modificarservidor();
                            }
                        }]
                    });
                }

                regServ.getForm().reset();
                winMod.add(regServ);
                winMod.doLayout();
                Ext.getCmp('btnAceptarMod').disable();
                winMod.show();
                Ext.getCmp('denominacion').focus(false,200);
                if(sm.getSelected().data.tiposervidor == 'autenticaci&oacute;n') {
                    if(sm.getSelected().data.chekssl==true)
                        chbssl.setValue(true);
                    if(sm.getSelected().data.chektsl==true)
                        chbtsl.setValue(true);
                    tipoAutenticacion(true);
                    baseDN.allowBlank = false;
                } else {
                    tipoAutenticacion(false);
                    baseDN.allowBlank=true;
                }
                regServ.getForm().loadRecord(sm.getSelected());
            }
            break;
        }
    }

    ////-------------Función -----------------------////
    function tipoAutenticacion(ldap) {
        if(ldap) {
            if(!chbldap.getValue() && !chbopenldap.getValue())
                chbldap.setValue(true);
            tfpassword.show();
            fstiposaut.show();
            fsusuario.show();
            tfusuario.show();
            panelpuerto.show();
            chbAgrupador.show();
            panel3.show();
            (ventanaadicionar) ? Ext.getCmp('probarConAdd').show():Ext.getCmp('probarConMod').show();
            fsusuario.enable();
            fstiposaut.enable();
            tfusuario.enable();
            tfpuerto.allowBlank = false;
        } else {
            chbldap.setValue(false);
            chbopenldap.setValue(false);
            fsusuario.hide();
            panelpuerto.hide();
            fstiposaut.hide();
            tfusuario.hide();
            chbAgrupador.hide();
            panel3.hide();
            (ventanaadicionar) ? Ext.getCmp('probarConAdd').hide():Ext.getCmp('probarConMod').hide();
            fsusuario.disable();
            fstiposaut.disable();
            tfusuario.disable();
            tfpuerto.allowBlank = true;
            tfusuario.allowBlank = true;
        }
    }

    ////------------ Adicionar Servidor ------------////
    function adicionarservidor(apl) {
        if (regServ.getForm().isValid()) {
            Secodena.mostrarMascara('maskServidor',etiquetas.msgWait,etiquetas.msgAdd);
            if(cbservidores.getValue() == 'bd') {
                regServ.getForm().submit({
                    url:'insertarserv',
                    failure: function(form, action) {
                        Secodena.ocultarMascara('maskServidor');
                        if(action.result.codMsg != 3) {
                            mostrarMensaje(action.result.codMsg,action.result.mensaje);
                            if(!apl)
                                winIns.hide();
                            regServ.getForm().reset();
                            stGpServ.reload();
                            sm.clearSelections();
                            btnModificar.disable();
                            btnEliminar.disable();
                        }
                        if(action.result.codMsg == 3)
                            mostrarMensaje(action.result.codMsg,action.result.mensaje);
                    }
                });
            } else if (chbopenldap.checked) {
                enviarFormularioAdd(apl);
            } else if (chbldap.checked) {
                enviarFormularioAdd(apl);
            }
            else
                mostrarMensaje(3,etiquetas.msgInformacionServidor);
        }
        else
            mostrarMensaje(3,etiquetas.lbMsgErrorEnCamops);
    }

    function enviarFormularioAdd(apl) {
        regServ.getForm().submit ({
            params:{
                ldap:ldap
            },
            url:'insertarserv',
            failure: function(form, action) {
                Secodena.ocultarMascara('maskServidor');
                if(action.result.codMsg != 3) {
                    mostrarMensaje(action.result.codMsg,action.result.mensaje);
                    if(!apl)
                        winIns.hide();
                    regServ.getForm().reset();
                    stGpServ.reload();
                    sm.clearSelections();
                    btnModificar.disable();
                    btnEliminar.disable();
                    chbldap.setValue(true);
                    btnProbarConexAdd.disable();
                }
                if(action.result.codMsg == 3)
                    mostrarMensaje(action.result.codMsg,action.result.mensaje);
            }
        });
    }

    ////------------ Modififcar Servidor ------------////
    function modificarservidor() {
        if (regServ.getForm().isValid()) {
            Secodena.mostrarMascara('maskservidorMod',etiquetas.msgWait,etiquetas.msgMod);
            if(cbservidores.getValue() == 'bd') {
                regServ.getForm().submit({
                    url:'modificarserv',
                    params:{
                        idservidor:sm.getSelected().data.idservidor
                    },
                    failure: function(form, action) {
                        Secodena.ocultarMascara('maskservidorMod');
                        if(action.result.codMsg != 3) {
                            mostrarMensaje(action.result.codMsg,action.result.mensaje);
                            stGpServ.reload();
                            winMod.hide();
                            regServ.getForm().reset();
                        }
                        if(action.result.codMsg == 3)
                            mostrarMensaje(action.result.codMsg,action.result.mensaje);
                    }
                });
            } else if(chbldap.checked) {
                regServ.getForm().submit({
                    url:'modificarserv',
                    params:{
                        idservidor:sm.getSelected().data.idservidor
                    },
                    failure: function(form, action) {
                        Secodena.ocultarMascara('maskservidorMod');
                        if(action.result.codMsg != 3) {
                            mostrarMensaje(action.result.codMsg,action.result.mensaje);
                            stGpServ.reload();
                            winMod.hide();
                            regServ.getForm().reset();
                        }
                        if(action.result.codMsg == 3)
                            mostrarMensaje(action.result.codMsg,action.result.mensaje);
                    }
                });
            } else if(chbopenldap.checked) {
                regServ.getForm().submit({
                    url:'modificarserv',
                    params:{
                        idservidor:sm.getSelected().data.idservidor
                    },
                    failure: function(form, action) {
                        Secodena.ocultarMascara('maskservidorMod');
                        if(action.result.codMsg != 3) {
                            mostrarMensaje(action.result.codMsg,action.result.mensaje);
                            stGpServ.reload();
                            regServ.getForm().reset();
                            winMod.hide();
                        }
                        if(action.result.codMsg == 3)
                            mostrarMensaje(action.result.codMsg,action.result.mensaje);
                    }
                });
            }
        }
        else
            mostrarMensaje(3,etiquetas.lbMsgErrorEnCamops);
    }

    ////------------------- Eliminar Servidor ------------------------////
    function eliminarservidor() {
        var arrServElim = sm.getSelections();
        var arrayServElim = [];
        for (var i=0;i<arrServElim.length;i++)
            arrayServElim.push(arrServElim[i].data.idservidor);
        mostrarMensaje(2,etiquetas.lbMsgprueba,elimina);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                Secodena.mostrarMascara('maskservidorDel',etiquetas.msgWait,etiquetas.msgDEL);
                Ext.Ajax.request({
                    url: 'comprobarservidor',
                    method:'POST',
                    params:{
                        arrayServ:Ext.encode(arrayServElim)
                    },
                    callback: function (options,success,response){
                        Secodena.ocultarMascara('maskservidorDel');
                        responseData = Ext.decode(response.responseText);
                        if(responseData.tiene == 1)
                            mostrarMensaje(2,etiquetas.lbMsgEliminarGA,elimina1)
                        if(responseData.codMsg == 1) {
                            mostrarMensaje(responseData.codMsg,responseData.mensaje);
                            stGpServ.reload();
                            sm.clearSelections();
                            btnModificar.disable();
                            btnEliminar.disable();
                        }
                        if(responseData.codMsg == 3)
                            mostrarMensaje(responseData.codMsg,responseData.mensaje);
                    }
                });
            }
        }
    }

    function cargarAyuda(){
        var title	= 'Ayuda de servidores';
        var referencia	= 'seguridad/gestservidor';
        help.show(title,referencia);
    }
}