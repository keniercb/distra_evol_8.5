Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('recursos', cargarInterfaz);

//BOTONES
var btnAdicionarR, btnModificarR, btnEliminarR, btnAdicionarD, btnEliminarD, btnModificarD,
btnCancelar,btnAplicar,btnAplicarDom,btnAceptar,btnCancelarDom,btnAceptarDom;
//TOOLS y PAGGINGS BARS
var tbRecurso, stRecurso,expander,ptRecurso,tbDominio;
//CONTENEDORES
var gpRecurso,pDominio, vpRecursoDominio;
//TEXT, COMBOS, AREAS, OTROS
var tfdenomRecurso,dfFIRecurso,dfFFRecurso,dfFIDominio,dfFFDominio, heDescripcion, heDescripcionDom;
//VENTANAS y FORMULARIOS
var winRecurso, fpRecurso;
//FECHA
var fecha = new Date();
//GENERAL
var accion = 'ADD',sist = 'R';
var record;
var cargadorDominio, tpDominio, raizDominio;

var mascaraD, mascaraR;

function cargarInterfaz(){
    perfil = arguments[0];
    labels = arguments[1];


    btnAdicionarD = new Ext.Button({
        id: 'btnAdicionarD',
        text:labels.lbBtnAdicionarD,
        tooltip:labels.lbToolTipBtnAdicionarD,
        iconCls:'adicionar',
        disabled: true,
        handler : function(){
            accion = 'ADD';
            sist = 'D';
            VentanaDominios(accion);
        },
        prevTab:'ayudaR',
        nextTab:'btnModificarD',

    });

    btnModificarD = new Ext.Button({
        id:'btnModificarD',
        text:labels.lbBtnModificarD,
        tooltip:labels.lbToolTipBtnModificarD,
        disabled: true,
        iconCls:'modificar',
        handler : function(){
            accion = 'MOD';
            sist = 'D';
            VentanaDominios(accion);
        }

    });

    btnEliminarD = new Ext.Button({
        id:'btnEliminarD',
        text:labels.lbBtnEliminarD,
        tooltip:labels.lbToolTipBtnEliminarD,
        disabled: true,
        iconCls:'eliminar',
        handler : function(){
            mostrarMensaje(2,labels.lbBtnMsgEliminarD,function(btn){
                if(btn == "ok"){
                    //console.info('lalala');
                    mascaraD.show();
                    gpRecurso.disable();
                    Ext.Ajax.request({
                        url: 'eliminardominio',
                        method:'POST',
                        params: {
                            iddominio: tpDominio.getSelectionModel().getSelectedNode().id
                        },
                        callback: function (options, success,response){
                            mascaraD.hide();
                            gpRecurso.enable();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.exception == 1) {
                                Ext.MessageBox.show({
                                    title: 'Información',
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.INFO,
                                    msg: labels.lbConceptoDomEnUso,
                                    fn: function() {
                                        btnAdicionarD.focus();
                                    }
                                });
                            }else {
                            if (responseData.codMsg != 3) {
                                mostrarMensaje(responseData.codMsg,responseData.mensaje, function(btn){
                                cargadorDominio.load(raizDominio)});
                            }else {
                                mostrarMensaje(responseData.codMsg,responseData.mensaje);
                            }
                           }
                        }
                    });//ajax
                }//if(btn == "ok")
            });
        }
    });
    var btnAyudaR = new Ext.Button({
        id: 'btnAyudaRecursos',
        text:labels.lbBtnAyudaR,
        tooltip:labels.lbToolTipBtnAyudaR,
        iconCls:'ayuda',
        nextTab:'btnAdicionarD',
        prevTab:'btnEliminarD'
    });

    expander = new Ext.grid.RowExpander({
        tpl : new Ext.Template(
            '<div style="word-wrap:break-word;margin: 5px;"><p><b>Descripci&oacute;n:</b>&nbsp;{descripcion}</p><br/></div>'
        )
    });


    var stRecurso = new Ext.data.Store({
        url: 'todosrecursos',
        reader:new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "idrecursoevaluativo"
        }, [{
            name: 'idrecursoevaluativo'
        },

        {
            name: 'denom'
        },

        {
            name: 'descripcion'
        },

        {
            name: 'fechafin'
        },

        {
            name: 'fechainicio'
        }
        ])
    });
    cmRecurso = [expander
    ,{
        id:'idrecurso',
        header: 'idrecurso',
        hidden: true,
        width: 50,
        dataIndex: 'idrecursoevaluativo'
    }
    ,{
        id:'denominacion',
        header: labels.lbDenomRecurso,
        sortable: true,
        width: 150,
        dataIndex: 'denom'
    }
    ,{
        id:'descripcion',
        header: 'descripcion',
        hidden: true,
        width: 150,
        dataIndex: 'descripcion'
    }
    ,{
        id:'fechainicio',
        header: 'fechainicio',
        hidden: true,
        width: 150,
        dataIndex: 'fechainicio'
    }
    ,{
        id:'fechafin',
        header: 'fechafin',
        hidden: true,
        width: 150,
        dataIndex: 'fechafin'
    }
    ];

    ptRecurso = new Ext.PagingToolbar({
        pageSize: 15,
        store: stRecurso,
        displayInfo: true,
        items:['-']
    });


    tbDominio = new Ext.Toolbar({
        id: 'tbDominio',
        items:[btnAdicionarD, btnModificarD, btnEliminarD,'->',btnAyudaR]
    });



    tfdenomRecurso = new Ext.form.TextField({
        id: 'tfdenomRecurso',
        fieldLabel: labels.lbtfdenomRecurso,
        name: 'denom',
        anchor:'98%',
        msgTarget: 'qtip',
		maxLength: 255,
        //maskRe: /^([a-zA-Z0-9???????? ]+ ?[a-zA-Z0-9_???????? ]*)+$/,
        regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ]*)+([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ]*)+$/,
        allowBlank: false,
        blankText:labels.lbbtdentfdenomRecurso,
        nextTab:'dfFIRecurso',
        prevTab:'btnAceptarR'
    });

    tfdenomDominio = new Ext.form.TextField({
        id: 'tfdenomDominio',
        fieldLabel: labels.lbtfdenomDominio,
        name: 'denom',
        anchor:'98%',
        msgTarget: 'qtip',
        maxLength: 255,
        regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ]*)+([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ]*)+$/,
        allowBlank: false,
        blankText:labels.lbbtdentfdenomRecurso,
        nextTab:'dfFIDominio',
        prevTab:'btnAceptarDom'
    });

    dfFIRecurso = new Ext.form.DateField({
        id: 'dfFIRecurso',
        fieldLabel: labels.lbdfFIRecurso,
        name: 'fechainicio',
        width: 176,
        value: fecha.format('d/m/Y'),
        format:'d/m/Y',
        allowBlank:false,
        invalidText: labels.invalidTextFecha,
        blankText:labels.blankText,
        vtype:'daterange',
        endDateField: 'dfFFRecurso'
    });

    dfFFRecurso = new Ext.form.DateField({
        id: 'dfFFRecurso',
        fieldLabel: labels.lbdfFFRecurso,
        name: 'fechafin',
        width: 176,
        format:'d/m/Y',
        invalidText: labels.invalidTextFecha,
        vtype:'daterange',
        startDateField: 'dfFIRecurso'
    });

    dfFIDominio = new Ext.form.DateField({
        id: 'dfFIDominio',
        fieldLabel: labels.lbdfFIRecurso,
        name: 'fechainicio',
        width: 176,
        value: fecha.format('d/m/Y'),
        format:'d/m/Y',
        allowBlank:false,
        invalidText: labels.invalidTextFecha,
        blankText:labels.blankText,
        vtype:'daterange',
        endDateField: 'dfFFDominio'
    });

    dfFFDominio = new Ext.form.DateField({
        id: 'dfFFDominio',
        fieldLabel: labels.lbdfFFRecurso,
        name: 'fechafin',
        width: 176,
        format:'d/m/Y',
        invalidText: labels.invalidTextFecha,
        vtype:'daterange',
        startDateField: 'dfFIDominio'
    });


    heDescripcion = new Ext.form.TextArea({
        height: 100,
        anchor:'98%',
        id:'heDescripcion',
        maxLength:255,
        fieldLabel:labels.lbheDescripcion
    });

     heDescripcionDom = new Ext.form.TextArea({
        height: 100,
        anchor:'98%',
        id:'heDescripcionDom',
        maxLength:255,
        fieldLabel:labels.lbheDescripcionDom
    });

    fpRecurso = new Ext.FormPanel({

        labelAlign: 'top',
        frame:true,
        baseParams:{
            idrecurso:-1,
            idpadre:-1
        },
        region:'center',
        bodyStyle: 'padding: 10px',
        autoHeight:true,
        autoShow:true,
        items:[tfdenomRecurso,{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: dfFIRecurso
            },{
                columnWidth:.5,
                layout: 'form',
                items: dfFFRecurso
            }]
        },heDescripcion]
    });

    fpDominio = new Ext.FormPanel({
        labelAlign: 'top',
        frame:true,
        baseParams:{
            idrecurso:-1,
            idpadre:-1
        },
        region:'center',
        bodyStyle: 'padding: 10px',
        autoHeight:true,
        autoShow:true,
        items:[tfdenomDominio,{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: dfFIDominio
            },{
                columnWidth:.5,
                layout: 'form',
                items: dfFFDominio
            }]
        },heDescripcionDom]
    });

    btnCancelar = new Ext.Button({
        id:'btnCancelarR',
        iconCls:'cancelar',
        text:labels.lbbtnCancelarR,
		tooltip:labels.lbToolTipCancelar,
        handler: function(){
            winRecurso.hide();
        }
    });

     btnCancelarDom = new Ext.Button({
        id:'btnCancelarDom',
        iconCls:'cancelar',
        text:labels.lbbtnCancelarR,
        tooltip:labels.lbToolTipCancelar,
        handler: function(){
            winDominio.hide();
        }
    });

    btnAplicar = new Ext.Button({
        id:'btnAplicarR',
        iconCls:'aplicar',
        text:labels.lbbtnAplicarR,
		tooltip:labels.lbToolTipAplicar,
        handler: function(){
            AddModRecursos(accion, 'APLI');
        }
    });

      btnAplicarDom = new Ext.Button({
        id:'btnAplicarDom',
        iconCls:'aplicar',
        text:labels.lbbtnAplicarR,
		tooltip:labels.lbToolTipAplicar,
        handler: function(){
            AddModDominios(accion, 'APLI');
        }
    });

    btnAceptar = new Ext.Button({
        id:'btnAceptarR',
        iconCls:'aceptar',
        text:labels.lbbtnAceptarR,
		tooltip:labels.lbToolTipAceptar,
		nextTab:'tfdenomRecurso',
		prevTab:'btnAplicarR',
        handler: function(){
            AddModRecursos(accion, 'ACEP');
        }
    });

    btnAceptarDom = new Ext.Button({
        id:'btnAceptarDom',
        iconCls:'aceptar',
        text:labels.lbbtnAceptarR,
		tooltip:labels.lbToolTipAceptar,
		nextTab:'tfdenomDominio',
		prevTab:'btnAplicarDom',
        handler: function(){
            AddModDominios(accion, 'ACEP');
        }
    });

    var keysRE= [{
        key: 'x',
        alt: true,
        fn: function() {
            if (!btnCancelar.hidden) {
                btnCancelar.handler();
            }
        }
    }, {
        key: 'p',
        ctrl: true,
        alt: true,
        fn: function() {
            if (!btnAplicar.hidden) {
                btnAplicar.handler();
            }
        }
    }, {
        key: Ext.EventObject.ENTER,
        fn: function() {
            if (!btnAceptar.hidden) {
                btnAceptar.handler();
            }
        }
    }
    ];

    var keysD= [{
        key: 'x',
        alt: true,
        fn: function() {
            if (!btnCancelarDom.hidden) {
                btnCancelarDom.handler();
            }
        }
    }, {
        key: 'p',
        ctrl: true,
        alt: true,
        fn: function() {
            if (!btnAplicarDom.hidden) {
                btnAplicarDom.handler();
            }
        }
    }, {
        key: Ext.EventObject.ENTER,
        fn: function() {
            if (!btnAceptarDom.hidden) {
                btnAceptarDom.handler();
            }
        }
    }
    ];

    btnAdicionarR = new Ext.Button({
        id: 'btnAdicionarR',
        text:labels.lbBtnAdicionarR,
        tooltip:labels.lbToolTipBtnAdicionarR,
        iconCls:'adicionar',
        handler : function(){
            accion = 'ADD';
            sist = 'R';
            VentanaRecursos(accion);
        },
        prevTab:'btnEliminarR',
        nextTab:'btnModificarR'
    });

    btnModificarR = new Ext.Button({
        id: 'btnModificarR',
        text:labels.lbBtnModificarR,
        tooltip:labels.lbToolTipBtnModificarR,
        iconCls: 'modificar',
        disabled:true,
        handler : function(){
            accion = 'MOD';
            sist = 'R';
            VentanaRecursos(accion);
        },
        prevTab:'btnAdicionarR',
        nextTab:'btnEliminarR',
    });

    btnEliminarR = new Ext.Button({
        id: 'btnEliminarR',
        text:labels.lbBtnEliminarR,
        tooltip:labels.lbToolTipBtnEliminarR,
        iconCls: 'eliminar',
        disabled:true,
        handler : function(){
            mostrarMensaje(2,labels.lbBtnMsgEliminarR,function(btn){
                if(btn == "ok"){
                    mascaraR.show();
                    tpDominio.disable();
                    Ext.Ajax.request({
                        url: 'eliminarrecurso',
                        method:'POST',
                        params: {
                            idrecurso:  gpRecurso.getSelectionModel().getSelected().get('idrecursoevaluativo')
                        },
                        callback: function (options,success,response){
                            mascaraR.hide();
                            tpDominio.enable();
                            responseData = Ext.decode(response.responseText);
                              if (responseData.exception == 1) {
                                Ext.MessageBox.show({
                                    title: 'Información',
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.INFO,
                                    msg: labels.f,
                                    fn: function() {
                                        btnAdicionarR.focus();
                                    }
                                });
                            }else {
                            mostrarMensaje(responseData.rcodMsg,responseData.mensaje, function(btn){
                                var root = tpDominio.getRootNode();
                                root.eachChild(function(child){
                                    child.remove();
                                });
                                tpDominio.disable();
                                stRecurso.load({
                                    params:{
                                        limit:15,
                                        start:0
                                    },
                                    callback:function() {
                                        gpRecurso.getSelectionModel().selectFirstRow();
                                    }
                                });
                            });
                            }
                        }
                    });//ajax
                }//if(btn == "ok")
            });
        },
        prevTab:'btnModificarR',
        nextTab:'btnAdicionarR',
    });


    tbRecurso = new Ext.Toolbar({
        id: 'tbRecurso',
        items:[btnAdicionarR, btnModificarR, btnEliminarR]
    });

    function LimpiarFormRecursos(){
        fpRecurso.getForm().reset();
    }

    function VentanaRecursos(accion){
        LimpiarFormRecursos();
        dfFIRecurso.enable();
        dfFFRecurso.enable();
        if(accion == 'ADD' && sist == 'R'){
            winRecurso.setTitle(labels.lbwinAddRecurso);
            btnAplicar.show();

        }else{
            if(accion == 'MOD' && sist == 'R'){
                var record = gpRecurso.getSelectionModel().getSelected();
                tfdenomRecurso.setValue(record.get('denom'));
                heDescripcion.setValue(record.get('descripcion'));
                dfFIRecurso.setValue(record.get('fechainicio'));
                dfFFRecurso.setValue(record.get('fechafin'));
                winRecurso.setTitle(labels.lbwinModRecurso);
                winRecurso.show();
                btnAplicar.hide();
            }
        }
      winRecurso.show();
    }//funcion  VentanaRecursos()

    function LimpiarFormDominios(){
        fpDominio.getForm().reset();
    }

    function VentanaDominios(accion){
        LimpiarFormDominios();
        dfFIDominio.enable();
        dfFFDominio.enable();
        if(accion == 'ADD' && sist == 'D'){
            winDominio.setTitle(labels.lbwinAddDominio);
            btnAplicarDom.show();
        }else{
            if(accion == 'MOD' && sist == 'D'){
                var record = tpDominio.getSelectionModel().getSelectedNode();
                tfdenomDominio.setValue(record.text);
                heDescripcionDom.setValue(record.attributes.descripcion);
                winDominio.setTitle(labels.lbwinModDominio);
                btnAplicarDom.hide();
            }
        }
    winDominio.show();
    }

    winRecurso = new Ext.Window({
        title:labels.lbwinRecurso,
        layout:'fit',
        width:420,
        height:310,
        keys:keysRE,
        modal: true,
        closable:true,
        resizable:false,
        closeAction:'hide',
        items:[fpRecurso],
        buttons: [btnCancelar,btnAplicar,btnAceptar]
    });
    winRecurso.on('show', function(cmp){
        tfdenomRecurso.focus(false, 300);
    });
    winRecurso.on('hide', function(cmp){
        btnAdicionarR.focus();
    });

//...................Ventana para los dominios...................

    winDominio = new Ext.Window({
        title:labels.lbwinDominio,
        layout:'fit',
        width:420,
        height:310,
        modal: true,
        keys:keysD,
        closable:true,
        resizable:false,
        closeAction:'hide',
        items:[fpDominio],
        buttons: [btnCancelarDom,btnAplicarDom,btnAceptarDom]
    });

    winDominio.on('show', function(cmp){
        tfdenomDominio.focus(false, 300);
    });
    winDominio.on('hide', function(cmp){
        btnAdicionarD.focus();
    });


    function AddModRecursos(accion, boton){
        var url = 'adicionarrecurso', msgForm = labels.lbMsgEsperaRecurso;
        var idrecurso = -1, iddominio = -1;
        if(accion == 'ADD' && sist == 'R'){
            idrecurso = -1;
            url = 'adicionarrecurso';
        }
        else if(accion == 'MOD' && sist == 'R'){
            idrecurso = gpRecurso.getSelectionModel().getSelected().get('idrecursoevaluativo');
            url = 'modificarrecurso';
        }
        fpRecurso.baseParams.idrecurso = idrecurso;
        fpRecurso.baseParams.idpadre = iddominio;
        if(fpRecurso.getForm().isValid()){
            fpRecurso.getForm().submit({
                url:url,
                baseParams:{
                    idrecurso:idrecurso,
                    iddominio:iddominio ,
                    idpadre:iddominio,
                    denom : tfdenomRecurso.getValue(),
                    descripcion: heDescripcion.getValue(),
                    fechainicio:dfFIRecurso.getRawValue(),
                    fechafin:dfFFRecurso.getRawValue()
                },
                waitMsg:msgForm,
                failure: function(form, action)
                {
                    if(action.result.rcodMsg == 1){
                        mostrarMensaje(action.result.rcodMsg,action.result.mensaje,function(){
                            stRecurso.reload();
                            if(sist == 'TS'){
                                btnModificarR.disable();
                                btnEliminarR.disable();
                                gpRecurso.getSelectionModel().clearSelections();
                                stRecurso.removeAll();
                                stRecurso.load({
                                    params:{
                                        limit:15,
                                        start:0
                                    }
                                });
                                cargadorDominio.baseParams.idrecurso = -1;
                                cargadorDominio.baseParams.iddominio = -1;
                                raizDominio.setText('Dominio');
                                cargadorDominio.load(raizDominio);
                                tpDominio.disable();
                                btnAdicionarD.disable();
                                btnModificarD.disable();
                                btnEliminarD.disable();
                            }else{
                                if(boton == 'ACEP'){
                                    btnAdicionarD.disable();
                                    btnModificarD.disable();
                                    btnEliminarD.disable();
                                }
                            }
                            if(accion == 'ADD'){
                                LimpiarFormRecursos();
                            }
                            if(boton == 'APLI'){
                                LimpiarFormRecursos();
                            }
                            else {
                                winRecurso.hide();
                            }
                            if(sist == 'R'){
                                gpRecurso.getSelectionModel().selectLastRow();
                            }
                        });
                    }
                    else if(action.result.rcodMsg == 3)
                      mostrarMensaje(action.result.rcodMsg,action.result.mensaje);
                    else
                     if(action.result.codMsg == 4)
                         mostrarMensaje(4, 'El (La) recurso que quiere adicionar ya existe');
                }
            });
        }//isValid()
    }

   function AddModDominios(accion, boton){
       var idrecurso = -1, iddominio = -1;
        if(accion == 'ADD' && sist == 'D'){
            msgForm = labels.lbMsgEsperaDominio;
            idrecurso = gpRecurso.getSelectionModel().getSelected().get('idrecursoevaluativo');
            iddominio = tpDominio.getSelectionModel().getSelectedNode().id;
            url = 'adicionardominio';
        }else {
            msgForm = labels.lbMsgEsperaDominio;
            idrecurso = gpRecurso.getSelectionModel().getSelected().get('idrecursoevaluativo');
            iddominio = tpDominio.getSelectionModel().getSelectedNode().id;
            url = 'modificardominio';
        }

        fpDominio.baseParams.idrecurso = idrecurso;
        fpDominio.baseParams.idpadre = iddominio;
        if(fpDominio.getForm().isValid()){
            fpDominio.getForm().submit({
                url:url,
                baseParams:{
                    idrecurso:idrecurso,
                    iddominio:iddominio ,
                    idpadre:iddominio,
                    denom : tfdenomDominio.getValue(),
                    descripcion: heDescripcionDom.getValue(),
                    fechainicio:dfFIDominio.getRawValue(),
                    fechafin:dfFFDominio.getRawValue()
                },
                waitMsg:msgForm,
                failure: function(form, action)
                {
                    if(action.result.codMsg == 1){
                        mostrarMensaje(action.result.codMsg,action.result.mensaje,function(){
                            stRecurso.reload();
                            if(sist == 'TS'){
                                btnModificarR.disable();
                                btnEliminarR.disable();
                                gpRecurso.getSelectionModel().clearSelections();
                                stRecurso.removeAll();
                                stRecurso.load({
                                    params:{
                                        limit:15,
                                        start:0
                                    }
                                });
                                cargadorDominio.baseParams.idrecurso = -1;
                                cargadorDominio.baseParams.iddominio = -1;
                                raizDominio.setText('Dominio');
                                cargadorDominio.load(raizDominio);
                                tpDominio.disable();
                                btnAdicionarD.disable();
                                btnModificarD.disable();
                                btnEliminarD.disable();
                            }else{
                                /* if(accion == 'MOD') tpDominio.getSelectionModel().getSelectedNode().setText(tfdenomRecurso.getValue());
						      cargadorDominio.load(tpDominio.getSelectionModel().getSelectedNode());*/
                                if(boton == 'ACEP'){
                                    btnAdicionarD.disable();
                                    btnModificarD.disable();
                                    btnEliminarD.disable();
                                }
                            }
                            if(accion == 'ADD'){
                                LimpiarFormDominios();
                            }
                            if(boton == 'APLI'){
                                LimpiarFormDominios();
                            }
                            else {
                                winDominio.hide();
                            }
                            if(sist == 'D'){
                                tpDominio.getSelectionModel().selectLastRow();
                            }
                        });
                    }else if(action.result.codMsg == 3) mostrarMensaje(action.result.codMsg,action.result.mensaje);
                }
            });
        }//isValid()
    }

    var kmRecursos = [{
        key: 'i',
        alt:true,
        fn: function(){
            btnAdicionarR.handler();
        }
    },{
        key: 'm',
        alt:true,
        fn: function(){
            if(!btnModificarR.disabled ){
                btnModificarR.handler();
            }
        }
    },{
        key: 46,
        fn: function(){
            if(!btnEliminarR.disabled ){
                btnEliminarR.handler();
            }
        }
    },{
        key: 'h',
        alt:true,
        fn: function(){
            btnAyudaR.handler();
        }
    },{
        key: 'b',
        alt:true,
        fn: function(){
            btnBuscarR.handler();
        }
    },{
        key: 'l',
        alt:true,
        fn: function(){
            btnLimpiarR.handler();
        }
    }];

    var kmDominios = [{
        key: 'i',
        alt:true,
        fn: function(){
            btnAdicionarD.handler();
        }
    },{
        key: 'm',
        alt:true,
        fn: function(){
            if(!btnModificarD.disabled ){
                btnModificarD.handler();
            }
        }
    },{
        key: 46,
        fn: function(){
            if(!btnEliminarD.disabled ){
                btnEliminarD.handler();
            }
        }
    },{
        key: 'h',
        alt:true,
        fn: function(){
            btnAyudaR.handler();
        }
    },{
        key: 'b',
        alt:true,
        fn: function(){
            btnBuscar.handler();
        }
    },{
        key: 'l',
        alt:true,
        fn: function(){
            btnLimpiar.handler();
        }
    }];



    gpRecurso = new Ext.grid.GridPanel({
        title: labels.lbgpRecurso,
        columns: cmRecurso,
        stripeRows: true,
        region:'center',
        width:'100%',
        autoScroll:true,
        border:false,
        store: stRecurso,
        plugins: expander,
        autoExpandColumn:'denominacion',
        loadMask:{
            msg :labels.lbGridLoadMaskRecurso
        },
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function(sm, row, rec) {
                    record = rec;
                    iddominioactual = -1;
                    btnModificarR.enable();
                    btnEliminarR.enable();
                    cargadorDominio.baseParams.denom = '';
                    cargadorDominio.baseParams.idrecurso = rec.get('idrecursoevaluativo');
                    cargadorDominio.baseParams.iddominio = -1;
                    cargadorDominio.baseParams.descripcion = '';
                    raizDominio.setText(rec.get('denom'));
                    cargadorDominio.load(raizDominio);
                    tpDominio.enable();
                }
            }
        }),
        bbar: ptRecurso
    });
    gpRecurso.on('render', function(p){
        btnAdicionarR.focus();
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    cargadorDominio = new Ext.tree.TreeLoader({
        dataUrl:'cargardominioE',
        preloadChildren :true,
        baseParams:{
            idrecurso:-1,
            iddominio:-1
        },
        listeners:{
            beforeload:function(cargadorDominio, node, response ){
                cargadorDominio.baseParams.iddominio = node.id;
                var n = gpRecurso.getSelectionModel().getSelected();
                if(n) cargadorDominio.baseParams.idrecurso = n.get('idrecursoevaluativo');
                else cargadorDominio.baseParams.idrecurso = -1;
            },
            load:function(cargadorDominio, node, response ){
                node.expand(false,false);
            }
        }
    });

    tpDominio = new Ext.tree.TreePanel({
        title: labels.lbgpDominios,
        disabled:true,
        border:false,
        hideBorders:true,
        region:'center',
        animate:true,
        containerScroll: true,
        rootVisible:true,
        selModel: new Ext.tree.DefaultSelectionModel(),
        loader:cargadorDominio,
        autoScroll:true,
        listeners:{
            click:function(nodo,event){
                btnAdicionarD.enable();
                if(nodo.id != 'raizDominio'){
                    btnModificarD.enable();
                    btnEliminarD.enable();
                }else{
                    btnModificarD.disable();
                    btnEliminarD.disable();
                }
            }
        }
    });
    raizDominio = new Ext.tree.TreeNode({
        text: 'Dominio',
        id:'raizDominio',
        allowDrag:false,
        allowDrop:false
    });
    tpDominio.setRootNode(raizDominio);

    //--------------------campos del filtro recursos evaluativos--------------//
    var btnBuscarR = new Ext.Button({
        iconCls: 'buscar',
        id: "btn_BuscarR",
        tooltip: labels.ttpBtnBuscar,
        text: labels.lbBtnBuscar,
        handler:function(){
            buscarDenominacion(tfDenomITR.getValue(),'Rec');
        }
    });

    var btnLimpiarR = new Ext.Button({
        tooltip: labels.ttpBtnLimpiar,
        id: 'btnLimpiarR',
        iconCls: 'limpiar',
        text: labels.lbBtnLimpiar,
        handler: function(){
            tfDenomITR.reset();
        },
        nextTab:'btnAdicionarIT',
        prevTab:'btn_Buscar'
    });

    var tfDenomITR = new Ext.form.TextField({
        id: 'tfDenomITR',
        fieldLabel: labels.lbDenominacion,
        name: 'denom',
        anchor:'95%',
        maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,
        emptyText:labels.emptyTextBuscar,
        listeners: {
            specialkey: function(field, e){
                if (e.getKey() == e.ENTER) {
                    btnBuscarR.handler();//LLamar al boton
                }
            }
        }

    });
    var pFiltrosR = new Ext.Panel({
        layout: 'column',
        margins: '5 5 5 5',
        frame:true,
        defaults:{
            layout:'form',
            border:false,
            labelAlign:'top',
            buttonAlign:'right'
        },
        cls: 'x-toolbar',
        height:65,
        autoScroll:true,
        autoShow:true,
        region:'north',
        items: [{
            columnWidth:.5,
            layout: 'form',
            items:[tfDenomITR]
        },{
            layout:'form',
            bodyStyle:'padding:19px 0 0 0;',
            columnWidth:'35px',
            items:[btnBuscarR]
        },{
            layout:'form',
            bodyStyle:'padding:19px 0 0 0;',
            columnWidth:'35px',
            items:[btnLimpiarR]
        }]
    });

    //-------campos del filtro de dominios------------------------------------//
    var btnBuscar = new Ext.Button({
        iconCls: 'buscar',
        id: "btn_Buscar",
        tooltip: labels.ttpBtnBuscarDom,
        text: labels.lbBtnBuscarDom,
        handler:function(){
            buscarDenominacion(tfDenomIT.getValue(),'Dom');
        }
    });

    var btnLimpiar= new Ext.Button({
        tooltip: labels.ttpBtnLimpiarDom,
        id: 'btnLimpiar',
        iconCls: 'limpiar',
        text: labels.lbBtnLimpiarDom,
        handler: function(){
            tfDenomIT.reset();
        },
        nextTab:'btnAdicionarIT',
        prevTab:'btn_Buscar'
    });

    var tfDenomIT = new Ext.form.TextField({
        id: 'tfDenomIT',
        fieldLabel: labels.lbDenominacionDom,
        name: 'denom',
        maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,
        anchor:'95%',
        emptyText:labels.emptyTextBuscar,
        listeners: {
            specialkey: function(field, e){
                if (e.getKey() == e.ENTER) {
                    btnBuscar.handler();//LLamar al boton
                }
            }
        }

    });
    var pFiltros = new Ext.Panel({
        layout: 'column',
        margins: '5 5 5 5',
        frame:true,
        defaults:{
            layout:'form',
            border:false,
            labelAlign:'top',
            buttonAlign:'right'
        },
        cls: 'x-toolbar',
        height:65,
        autoScroll:true,
        autoShow:true,
        region:'north',
        items: [{
            columnWidth:.5,
            layout: 'form',
            items:[tfDenomIT]
        },{
            layout:'form',
            bodyStyle:'padding:19px 0 0 0;',
            columnWidth:'35px',
            items:[btnBuscar]
        },{
            layout:'form',
            bodyStyle:'padding:19px 0 0 0;',
            columnWidth:'35px',
            items:[btnLimpiar]
        }]
    });

    var pContDominio= new Ext.Panel({
        tbar: tbDominio,
        region:'east',
        layout:'border',
        width: '50%',
        items: [tpDominio,pFiltros],
        keys:kmDominios,
    });

    var pContRecurso= new Ext.Panel({
        tbar: tbRecurso,
        region:'center',
        layout:'border',
        width: '50%',
        items: [gpRecurso,pFiltrosR],
        keys:kmRecursos
    });

    var pGeneral = new Ext.Panel({
        layout:'border',
        border:false,
        height: 578,
        width: 600,
        defaults: {
                split:true,
        },
        items:[pContRecurso , pContDominio]
    });

    function buscarDenominacion(denom,panel){
        if(panel == 'Rec'){
            stRecurso.baseParams.denom = denom;
            stRecurso.load({
                params:{
                    limit:15,
                    start:0
            }});

            if(stRecurso.data.length ==1){
                Ext.MessageBox.show({
                    title: labels.lbInfo,
                    msg: 'No existen datos que se correspondan con los criterios de búsqueda especificados',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO,
                    fn: function() {
                        btnBuscarR.focus();
                    }
                });
            }
           }else if(panel == 'Dom') {
            cargadorDominio.baseParams.denom = denom;
            cargadorDominio.baseParams.idrecurso = record.get('idrecursoevaluativo');
            raizDominio.setText(record.get('denom'));
            cargadorDominio.load(raizDominio);
            cargadorDominio.baseParams.denom = '';
        }
    }

    vpRecursoDominio = new Ext.Viewport({
        id:'layout',
        layout:'fit',
        items:[pGeneral]
    });

    stRecurso.load({
        params:{
            limit:15,
            start:0
        },
        callback:function(){
            gpRecurso.getSelectionModel().selectFirstRow();
        }
    });

    mascaraD = new Ext.LoadMask(tpDominio.getEl(), {
        msg:labels.lbEliminarDLoadMask
    });
    mascaraD.enable();
    mascaraR = new Ext.LoadMask(gpRecurso.getEl(), {
        msg:labels.lbEliminarRLoadMask
    });
    mascaraR.enable();

}




