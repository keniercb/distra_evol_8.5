Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('recomendaciones', cargarInterfaz);
//Botones
var btnAdicionarTR, btnModificarTR, btnAyudaTR, btnEliminarTR, btnBuscarTR, btnAdicionarR, btnEliminarR, btnModificarR, btnBuscarR;
var btnCancelarTR, btnAplicarTR, btnAceptarTR, btnCancelarR, btnAplicarR, btnAceptarR;
//Tool bar, Rtores, plugin expander, y columnModel
var tbTR, st_TR,expanderR,expanderTR,colummodel, ptTR, st_R, colummodelR,tbR,ptR;
//Grids y el viewPort
var gpTR,gpR, vpTR;
//Formularios
var formTR, formModTR, formCrearR, formR;
//Windows
var winModTR, winTR, winModR, winR;
//Combos
var tfDenominacionTR,dfFechaInicioTR, dfFechaFinTR, heDescripcionTR, tfDenominacionT, dfFechaInicioT, dfFechaFinT, heDescripcionT;
//FECHA
var fecha = new Date();
//GENERAL
var accion = 'ADD',sist = 'TR';
var mascaraTR, mascaraR;
var fecha = new Date();
var cambio = 0;


//**************************************Principal function**********************************************************************
function cargarInterfaz(){
    perfil = arguments[0];
    labels = arguments[1];

    var btnAyudaTP = new Ext.Button({
        id: 'btnAyudaRecomendaciones',
        text:labels.lbBtnAyuda,
        tooltip:labels.lbToolTipBtnAyuda,
        iconCls:'ayuda',
        nextTab:'inputNombreTR',
        prevTab:'eliminarTR'

    });

    var btnLimpiarTR = new Ext.Button({
        id: 'btnLimpiarTR',
        text:labels.lbBtnLimpiar,
        tooltip: labels.ttpBtnLimpiar,
        iconCls: 'limpiar',
        handler: function(){
            Ext.getCmp('inputNombreTR').reset();
            st_TR.load({
                params:{
                    limit:15,
                    start:0
                },
                callback:function(){
                    gpTR.getSelectionModel().selectFirstRow();
                }
            });
        },
        nextTab:'adicionarTR',
        prevTab:'buscarTR'
    });

    var btnLimpiarR = new Ext.Button({
        id: 'btnLimpiarR',
        disabled:true,
        text:labels.lbBtnLimpiar,
        tooltip: labels.ttpBtnLimpiar,
        iconCls: 'limpiar',
        handler: function(){
            Ext.getCmp('inputNombreR').reset();
            st_R.load({
                params:{
                    idtiporecomendacion: gpTR.getSelectionModel().getSelected().get('idtiporecomendacion'),
                    limit:15,
                    start:0
                },
                callback:function(){
                    btnAdicionarR.focus();
                }
            });
        },
        nextTab:'adicionarR',
        prevTab:'buscarR'
    });

    btnAdicionarTR = new Ext.Button({
        id: 'adicionarTR',
        text:labels.lbBtnAdicionar,
        tooltip:labels.lbToolTipAdicionarTR,
        iconCls:'adicionar',
        handler : function(){
            accion = 'ADD';
            sist = 'TR';
            VentanaTR(accion);
        },
        prevTab:'btnLimpiarTR'
    });

    btnModificarTR = new Ext.Button({
        id: 'modificarTR',
        text:labels.lbBtnModificar,
        tooltip:labels.lbToolTipModificarTR,
        disabled: true,
        iconCls: 'modificar',
        handler : function(){
            accion = 'MOD';
            sist = 'TR';
            VentanaTR(accion);
        }
    });

    btnEliminarTR = new Ext.Button({
        id: 'eliminarTR',
        text:labels.lbBtnEliminar,
        tooltip:labels.lbToolTipEliminarTR,
        disabled: true,
        iconCls: 'eliminar',
        handler : function(){
            mostrarMensaje(2,labels.lbBtnMsgEliminarTR,function(btn){
                if(btn == "ok"){
                    PVD.mostrarMascara('idmskeliminartr', labels.lbMsgWait, labels.lbMaskElimTR);
                    Ext.Ajax.request({
                        url: 'eliminartiporecomendacion',
                        method:'POST',
                        params: {
                            idtiporecomendacion: gpTR.getSelectionModel().getSelected().get('idtiporecomendacion')
                        },
                        callback: function (options,success,response){
                            PVD.ocultarMascara('idmskeliminartr');
                            responseData = Ext.decode(response.responseText);
                             if (responseData.exception == 1) {
							  mostrarMensaje(1,labels.lbTipoConceptoEnUso);
                                btnAdicionarTR.focus();
                            } else {
                            mostrarMensaje(1,responseData.mensaje);
                                st_TR.load({
                                    params:{
                                        limit:15,
                                        start:0
                                    },
                                    callback:function(){
                                        gpTR.getSelectionModel().selectFirstRow();
                                    }
                                });
                        }
                      }
                    });
                }
            });
        }
    });

    btnBuscarTR = new Ext.Button({
        id:'buscarTR',
        iconCls:'buscar',
        text: labels.lbBtnBuscarTR,
        tooltip: labels.lbToolTipBuscarTR,
        handler: function(){
            st_TR.load({
                params:{
                    filtro:Ext.getCmp('inputNombreTR').getValue(),
                    limit:15,
                    start:0
                },
                callback:function(){
                    gpTR.getSelectionModel().selectFirstRow();
                }
            });
        }
    });

    btnAdicionarR = new Ext.Button({
        id: 'adicionarR',
        text:labels.lbBtnAdicionar,
        tooltip:labels.lbToolTipAdicionarR,
        iconCls:'adicionar',
        disabled: true,
        handler : function(){
            accion = 'ADD';
            sist = 'R';
            VentanaTR(accion);
        },
        prevTab:'btnLimpiarR'
    });

    btnModificarR = new Ext.Button({
        id:'modificarR',
        text:labels.lbBtnModificar,
        tooltip:labels.lbToolTipModificarR,
        disabled: true,
        iconCls:'modificar',
        handler : function(){
            accion = 'MOD';
            sist = 'R';
            VentanaTR(accion);
        }
    });


    btnEliminarR = new Ext.Button({
        id:'eliminarR',
        text:labels.lbBtnEliminar,
        tooltip:labels.lbToolTipEliminarR,
        disabled: true,
        iconCls:'eliminar',
        handler : function(){
            mostrarMensaje(2,labels.lbBtnMsgEliminarD,function(btn){
                if(btn == "ok"){
                    PVD.mostrarMascara('idmskeliminarr', labels.lbMsgWait, labels.lbMaskElimR);
                    Ext.Ajax.request({
                        url: 'eliminarrecomendacion',
                        method:'POST',
                        params: {
                            idrecomendacion: gpR.getSelectionModel().getSelected().get('idrecomendacion')
                        },
                        callback: function (options,success,response){
                            PVD.ocultarMascara('idmskeliminarr');
                            responseData = Ext.decode(response.responseText);
                             if (responseData.exception == 1) {
                                Ext.MessageBox.show({
                                    title: 'Información',
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.INFO,
                                    msg: labels.lbConceptoEnUso,
                                    fn: function() {
                                        btnAdicionar.focus();
                                    }
                                });
                            } else {
                            mostrarMensaje(responseData.codResult,responseData.mensaje, function(btn){
                                st_R.load({
                                    params:{
                                        idtiporecomendacion: gpTR.getSelectionModel().getSelected().get('idtiporecomendacion'),
                                        limit:15,
                                        start:0
                                    },
                                    callback:function(){
                                        gpR.getSelectionModel().selectFirstRow();
                                    }
                                });
                            });
                        }
                      }
                    });
                }
            });
        }
    });


    btnBuscarR= new Ext.Button({
        iconCls:'buscar',
        id: 'buscarR',
        disabled: true,
        text: labels.lbBtnBuscarR,
        tooltip: labels.lbToolTipBuscarR,
        handler: function(){
            st_R.load({
                params:{
                    filtro:Ext.getCmp('inputNombreR').getValue(),
                    idtiporecomendacion: gpTR.getSelectionModel().getSelected().get('idtiporecomendacion'),
                    limit:15,
                    start:0
                },
                callback:function(){
                    btnAdicionarR.focus();
                }
            });
        },
        nextTab:'btnLimpiarR',
        prevTab:'inputNombreR'
    });

    expanderTR = new Ext.grid.RowExpander({
        tpl : new Ext.Template(
        '<p><b>Descripci&oacute;n:</b> {descripcion}</p>'
    )
    });

    expanderR = new Ext.grid.RowExpander({
        tpl : new Ext.Template(
        '<p><b>Descripci&oacute;n:</b>  {descripcion}</p>'
    )
    });

    st_TR = new Ext.data.Store({
        url: 'todostiporecomendaciones',
        reader:new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "idtiporecomendacion"
        }, [{
                name: 'idtiporecomendacion'
            },

            {
                name: 'denom'
            },

            {
                name: 'descripcion'
            },

            {
                name: 'fechainicio'
            },

            {
                name: 'fechafin'
            }
        ])
    });

    colummodel = [expanderTR,{
            id:'expandir',
            header: labels.lbDenominacion ,
            sortable: true,
            width: 150,
            dataIndex: 'denom'
        }
    ];
    ptTR = new Ext.PagingToolbar({
        pageSize: 15,
        store: st_TR,
        displayInfo: true
    });

    tbTR = new Ext.Toolbar({
        id: 'tbTR',
        items:[btnAdicionarTR, btnModificarTR, btnEliminarTR]
    });

    tfDenominacionTR = new Ext.form.TextField({
        fieldLabel: labels.lbDenominacion,
        name: 		'denominacion',
        id: 		'denominacion',
        anchor:		'98%',
        allowBlank:	false,
		maxLength : 255,
        blankText:	labels.lbCampoVacio,
        regexText:	labels.lbDenominacionError,
        regex: 		/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ]*)+([a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]*)+$/,
        listeners: {
            change: function(){
                cambio = 1;
                self.btnAdicionar.focus();
            }
        },
        prevTab: 'btnAceptarTR'
    });

    dfFechaInicioTR = new Ext.form.DateField({
        fieldLabel: labels.lbFechaInicio,
        name: 'fechainicio',
        id: 'fechainicio',
        width: 176,
        value: fecha.format('d/m/Y'),
        format:'d/m/Y',
        allowBlank: false,
        vtype: 'daterange',
        endDateField: 'fechafin',
        invalidText: labels.lbToolTipFecha,
        listeners: {
            change: function(){
                cambio = 1;
            }
        }
    });

    dfFechaFinTR = new Ext.form.DateField({
        fieldLabel: labels.lbFechaFin,
        name: 'fechafin',
        id: 'fechafin',
        width: 176,
        format:'d/m/Y',
        vtype: 'daterange',
        startDateField: 'fechainicio',
        invalidText: labels.lbToolTipFecha,
        listeners: {
            change: function(){
                cambio = 1;
            }
        }
    });

    heDescripcionTR = new Ext.form.TextArea({
        anchor:'98%',
        id:'descripcion',
        fieldLabel: labels.lbDescripcion,
        name:'descripcion',
        height:120,
        maxLength:255,
        listeners: {
            change: function(){
                cambio = 1;
            }
        }
    });

    formTR = new Ext.FormPanel({
        labelAlign: 'top',
        frame:true,
        //region:'center',
        baseParams:{
            idtiporecomendacion : -1
        },
        autoHeight:true,
        autoRhow:true,
        items: [tfDenominacionTR,{
                layout:'column',
                items:[{
                        columnWidth:.5,
                        layout: 'form',
                        items: [dfFechaInicioTR]
                    },{
                        columnWidth:.5,
                        layout: 'form',
                        items: [dfFechaFinTR]
                    }]
            },heDescripcionTR]
    });

    btnCancelarTR = new Ext.Button({
        iconCls:'cancelar',
        text:labels.lbtnCancelarR,
		tooltip:labels.lbToolTipCancelar,
        handler: function(){
            winTR.hide();
            LimpiarFormTR();
            cambio = 0;
        }
    });

    btnAplicarTR = new Ext.Button({
        id: 'btnAplicarTR',
        iconCls:'aplicar',
        text:labels.lbtnAplicarR,
		tooltip:labels.lbToolTipAplicar,
        handler: function(){
            RealizarAccion( accion, 'APLI');
        }
    });

    btnAceptarTR = new Ext.Button({
        iconCls:'aceptar',
        id: 'btnAceptarTR',
        text:labels.lbtnAceptarR,
		tooltip:labels.lbToolTipAceptar,
        handler: function(){
            RealizarAccion( accion, 'ACEP');
        },
        nextTab: 'denominacion',
        prevTab: 'btnAplicarTR'
    });

    btnCancelarR = new Ext.Button({
        iconCls:'cancelar',
        text:labels.lbtnCancelarR,
		tooltip:labels.lbToolTipCancelar,
        handler: function(){
            winR.hide();
            LimpiarFormR();
            cambio = 0;
        }
    });

    btnAplicarR = new Ext.Button({
        id: 'btnAplicarR',
        iconCls:'aplicar',
        text:labels.lbtnAplicarR,
		tooltip:labels.lbToolTipAplicar,
        handler: function(){
            RealizarAccion(accion, 'APLIC');
        }
    });

    btnAceptarR = new Ext.Button({
        id:'btnAceptarR',
        iconCls:'aceptar',
        text:labels.lbtnAceptarR,
		tooltip:labels.lbToolTipAceptar,
        handler: function(){
            RealizarAccion(accion, 'ACEP');
        },
        nextTab: 'denom',
        prevTab: 'btnAplicarR'
    });

    var keysTR= [{
        key: 'x',
        alt: true,
        fn: function() {
            if (!btnCancelarTR.hidden) {
                btnCancelarTR.handler();
            }
        }
    }, {
        key: 'p',
        ctrl: true,
        alt: true,
        fn: function() {
            if (!btnAplicarTR.hidden) {
                btnAplicarTR.handler();
            }
        }
    }, {
        key: Ext.EventObject.ENTER,
        fn: function() {
            if (!btnAceptarTR.hidden) {
                btnAceptarTR.handler();
            }
        }
    }
    ];

    var keysR= [{
        key: 'x',
        alt: true,
        fn: function() {
            if (!btnCancelarR.hidden) {
                btnCancelarR.handler();
            }
        }
    }, {
        key: 'p',
        ctrl: true,
        alt: true,
        fn: function() {
            if (!btnAplicarR.hidden) {
                btnAplicarR.handler();
            }
        }
    }, {
        key: Ext.EventObject.ENTER,
        fn: function() {
            if (!btnAceptarR.hidden) {
                btnAceptarR.handler();
            }
        }
    }
    ];
    tfDenominacionR = new Ext.form.TextField({
        fieldLabel: labels.lbDenominacionR,
        name: 		'denom',
        id: 		'denom',
        anchor:		'98%',
        allowBlank:	false,
		maxLength : 255,
        blankText:	labels.lbCampoVacio,
        regexText:	labels.lbDenominacionError,
        regex: 		/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ]*)+([a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]*)+$/,
        listeners: {
            change: function(){
                cambio = 1;
            }
        },
        prevTab: 'btnAceptarR'
    });

    dfFechaInicioR = new Ext.form.DateField({
        fieldLabel: labels.lbFechaInicio,
        name: 'fechainicio',
        id: 'fechainicioR',
        value: fecha.format('d/m/Y'),
        format:'d/m/Y',
        allowBlank: false,
        width: 176,
        vtype: 'daterange',
        endDateField: 'fechafinR',
        invalidText: labels.lbToolTipFecha,
        listeners: {
            change: function(){
                cambio = 1;
            }
        }
    });

    dfFechaFinR = new Ext.form.DateField({
        fieldLabel: labels.lbFechaFin,
        name: 'fechafin',
        id: 'fechafinR',
        format:'d/m/Y',
        width: 176,
        vtype: 'daterange',
        startDateField: 'fechainicioR',
        invalidText: labels.lbToolTipFecha,
        listeners: {
            change: function(){
                cambio = 1;
            }
        }
    });

    heDescripcionR = new Ext.form.TextArea({
        anchor:'98%',
        fieldLabel:labels.lbDescripcionR,
        name:'descripcion',
        height:120,
        maxLength:255,
        listeners: {
            change: function(){
                cambio = 1;
            }
        }
    });

    st_R = new Ext.data.Store({
        url: 'todosrecomendacionesportipo',
        reader:new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "idrecomendacion"
        },[
            {
                name: 'idrecomendacion'
            },

            {
                name: 'idtiporecomendacion'
            },

            {
                name: 'denom',
                type: 'string'
            },

            {
                name: 'fechainicio'
            },

            {
                name: 'fechafin'
            },

            {
                name: 'descripcion',
                type: 'string'
            }
        ])
    });

    colummodelR = [expanderR,{
            id:'expandirR',
            header: labels.lbDenominacionR,
            sortable: true,
            width: 150,
            dataIndex: 'denom'
        }];

    ptR= new Ext.PagingToolbar({
        pageSize: 15,
        store: st_R,
        displayInfo: true
    });

    tbR = 	new Ext.Toolbar({
        id:'tbR',
        items:[btnAdicionarR,btnModificarR,btnEliminarR,'->',btnAyudaTP]
    });

    formR = new Ext.FormPanel({
        labelAlign: 'top',
        frame:true,
        id:'formR',
        autoHeight:true,
        baseParams:{
            idrecomendacion : -1,
            idtiporecomendacion : -1
        },
        items: [tfDenominacionR,{
                layout:'column',
                items:[{
                        columnWidth:.5,
                        layout: 'form',
                        items: [dfFechaInicioR]
                    },{
                        columnWidth:.5,
                        layout: 'form',
                        items: [dfFechaFinR]
                    }]
            },heDescripcionR]
    });

    function LimpiarFormTR(){
        formTR.getForm().reset();
    }

    function LimpiarFormR(){
        formR.getForm().reset();
    }

    function VentanaTR(accion){

        var record;
        if(accion == 'ADD' && sist == 'TR'){
            LimpiarFormTR();
            winTR.setTitle(labels.lbAdicionarTR);
            dfFechaInicioTR.setValue(fecha.format('d/m/Y'));
            Ext.getCmp('btnAplicarTR').show();
            winTR.show();
        }
        else if(accion == 'ADD' && sist == 'R'){
            LimpiarFormR();
            winR.setTitle(labels.lbAdicionarR);
            dfFechaInicioR.setValue(fecha.format('d/m/Y'));
            Ext.getCmp('btnAplicarR').show();
            winR.show();
        }
        else{
            if(accion == 'MOD' && sist == 'TR'){
                record = gpTR.getSelectionModel().getSelected();
                tfDenominacionTR.setValue(record.get('denom'));
                heDescripcionTR.setValue(record.get('descripcion'));
                dfFechaInicioTR.setValue(record.get('fechainicio'));
                dfFechaFinTR.setValue(record.get('fechafin'));
                winTR.setTitle(labels.lbModificarTR);
                Ext.getCmp('btnAplicarTR').hide();
                winTR.show();
            }else{
                record = gpR.getSelectionModel().getSelected();
                tfDenominacionR.setValue(record.get('denom'));
                heDescripcionR.setValue(record.get('descripcion'));
                dfFechaInicioR.setValue(record.get('fechainicio'));
                dfFechaFinR.setValue(record.get('fechafin'));
                winR.setTitle(labels.lbModificarR);
                Ext.getCmp('btnAplicarR').hide();
                winR.show();
            }
        }
    }

    winTR = new Ext.Window({
        title:labels.lbCrearTR,
        layout:'fit',
        keys:keysTR,
        modal: true,
        closable:true,
        resizable:false,
        closeAction: 'hide',
        width:400,
        autoHeight: true,
        items:[formTR],
        buttons: [btnCancelarTR, btnAplicarTR,btnAceptarTR]
    });
    winTR.on('show', function(cmp){
        tfDenominacionTR.focus(true, 300);
    });
    winTR.on('hide', function(cmp){
        btnAdicionarTR.focus();
    });


    winR = new Ext.Window({
        title:labels.lbCrearR,
        layout:'fit',
        modal: true,
        closable:true,
        resizable:false,
        keys:keysR,
        closeAction: 'hide',
        width:400,
        autoHeight: true,
        items:[formR],
        buttons: [btnCancelarR, btnAplicarR,btnAceptarR]
    });
    winR.on('show', function(cmp){
        tfDenominacionR.focus(true, 300);
    });


    var kmRecomendacionTR = [{
            key: 'i',
            alt:true,
            fn: function(){
                btnAdicionarTR.handler();
            }
        },{
            key: 'm',
            alt:true,
            fn: function(){
                if(!btnModificarTR.disabled ){
                    btnModificarTR.handler();
                }
            }
        },{
            key: 46,
            fn: function(){
                if(!btnEliminarTR.disabled ){
                    btnEliminarTR.handler();
                }
            }
        },{
            key: 'l',
            alt:true,
            fn: function(){
                btnLimpiarTR.handler();
            }
        },{
            key: 'h',
            alt:true,
            fn: function(){
                btnAyudaTP.handler();
            }
        },{
            key: 'b',
            alt:true,
            fn: btnBuscarTR.handler
        }
    ];

    var kmRecomendacionR = [{
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
            key: 'l',
            alt:true,
            fn: function(){
                btnLimpiarR.handler();
            }
        },{
            key: 46,
            fn: function(){
                if(!btnEliminarR.disabled ){
                    btnEliminarR.handler();
                }
            }
        },{
            key: 'b',
            alt:true,
            fn: btnBuscarR.handler
        }
    ];

    gpTR = new Ext.grid.GridPanel({
        id:'idTR',
        title: labels.lbgpTR,
        columns: colummodel,
        stripeRows: true,
        autoRcroll:true,
        store: st_TR,
        plugins: expanderTR,
        autoExpandColumn:'expandir',
        loadMask:{
            msg :labels.lbGridLoadMask
        },
        minSize: 75,
        region:'center',
        padding:'0 0 0 0',
        margins: '0 5 5 5',
        width: '50%',
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function(sm, row, rec){
                    st_R.load({
                        params:{
                            idtiporecomendacion: rec.data.idtiporecomendacion,
                            limit:15,
                            start:0
                        },
                        callback:function(){
                            gpR.getSelectionModel().selectFirstRow();
                        }
                    });
                    Ext.getCmp('adicionarR').enable();
                    Ext.getCmp('eliminarTR').enable();
                    Ext.getCmp('modificarTR').enable();
                    Ext.getCmp('inputNombreR').enable();
                    Ext.getCmp('buscarR').enable();
                    btnLimpiarR.enable();
                    Ext.getCmp('modificarR').disable();
                    Ext.getCmp('eliminarR').disable();
                }
            }
        }),
        bbar: ptTR
    });
    gpTR.on('render', function(p){
        btnAdicionarTR.focus();
    });
    gpR = new Ext.grid.GridPanel({
        title: labels.lbgpR,
        columns: colummodelR,
        stripeRows: true,
        autoRcroll:true,
        plugins: expanderR,
        store: st_R,
        autoExpandColumn:'expandirR',
        loadMask:{
            msg :labels.lbGridLoadMask
        },
        minRize: 75,
        region:'center',
        margins: '0 5 5 5',
        width:'50%',
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function(sm, row, rec) {
                    Ext.getCmp('modificarR').enable();
                    Ext.getCmp('eliminarR').enable();

                }
            }
        }),
        bbar:ptR
    });
    gpR.on('render', function(p){
        btnAdicionarR.focus();
    });

    function RealizarAccion(accion, boton){

        var url = 'adicionartiporecomendacion', msgForm = labels.lbWaitMsgAddTR;
        var idtiporecomendacion = -1, idrecomendacion = -1;

        if(accion == 'ADD' && sist == 'TR'){
            url = 'adicionartiporecomendacion';
            msgForm = labels.lbWaitMsgAddTR;
        }
        else if(accion == 'MOD' && sist == 'TR'){
            msgForm = labels.lbWaitMsgModTR;
            idtiporecomendacion = gpTR.getSelectionModel().getSelected().get('idtiporecomendacion');
            url = 'modificartiporecomendacion';
        }
        else if(accion == 'ADD' && sist == 'R'){
            msgForm = labels.lbWaitMsgAddR;
            url = 'adicionarrecomendacion';
            idtiporecomendacion = gpTR.getSelectionModel().getSelected().get('idtiporecomendacion');
        }
        else {
            msgForm = labels.lbWaitMsgModR;
            idtiporecomendacion = gpTR.getSelectionModel().getSelected().get('idtiporecomendacion');
            idrecomendacion = gpR.getSelectionModel().getSelected().get('idrecomendacion');
            url = 'modificarrecomendacion';
        }

        if(cambio == 0) {
            if(accion == 'MOD' && sist == 'TR')
                winTR.hide();
            else if (accion == 'MOD' && sist != 'TR')
                winR.hide();
            else {
                tfDenominacionTR.markInvalid(labels.lbCampoVacio);
                tfDenominacionR.markInvalid(labels.lbCampoVacio);
            }
        }
        else{
            if(sist == 'TR'){
                formTR.baseParams.idtiporecomendacion = idtiporecomendacion;
                if(dfFechaInicioTR.getRawValue() != dfFechaFinTR.getRawValue()){
                    if(formTR.getForm().isValid()){
                        PVD.mostrarMascara('idmskguardartr', labels.lbMsgWait, labels.lbMsgSave);
                        formTR.getForm().submit({
                            url:url,
                            baseParams:{
                                denom : tfDenominacionTR.getValue(),
                                descripcion: heDescripcionTR.getValue(),
                                fechainicio:dfFechaInicioTR.getRawValue(),
                                fechafin:dfFechaFinTR.getRawValue()
                            },
                            failure: function(form, action)
                            {
                                PVD.ocultarMascara('idmskguardartr');
                                if(action.result.codResult == 1){
                                    mostrarMensaje(action.result.codResult,action.result.mensaje);
                                        if(boton == 'ACEP'){
                                            winTR.hide();
                                        }
                                        if(sist == 'TR'){
                                            gpTR.getSelectionModel().clearSelections();
                                            st_TR.removeAll();
                                            st_TR.load({
                                                params:{
                                                    limit:15,
                                                    start:0
                                                },
                                                callback:function(){
                                                    gpTR.getSelectionModel().selectFirstRow();
                                                }
                                            });
                                        }
                                        if(accion == 'ADD'){
                                            LimpiarFormTR();
                                        }
                                }else if(action.result.codResult == 3) 
									mostrarMensaje(action.result.codResult,'El tipo de recomendación que quiere adicionar ya existe');
                            }
                        });
                    }//isValid()
                }else {
                    mostrarMensaje(3,labels.lbFechasiguales);
                }
            }else{
                formR.baseParams.idrecomendacion = idrecomendacion;
                formR.baseParams.idtiporecomendacion = idtiporecomendacion;
                if(dfFechaInicioR.getRawValue() != dfFechaFinR.getRawValue()){
                    if(formR.getForm().isValid()){
                        PVD.mostrarMascara('idmskguardartr', labels.lbMsgWait, labels.lbMsgSave);
                        formR.getForm().submit({
                            url:url,
                            baseParams:{
                                denom : tfDenominacionR.getValue(),
                                descripcion: heDescripcionR.getValue(),
                                fechainicio:dfFechaInicioR.getRawValue(),
                                fechafin:dfFechaFinR.getRawValue()
                            },
                            failure: function(form, action)
                            {
                                PVD.ocultarMascara('idmskguardartr');
                                if(action.result.codResult == 1){
                                    mostrarMensaje(action.result.codResult,action.result.mensaje);

                                        if(boton == 'APLIC'){
                                            LimpiarFormR();
                                        }
                                        if(boton == 'ACEP'){
                                            winR.hide();
                                        }
                                        if(sist == 'R'){
                                            gpR.getSelectionModel().clearSelections();
                                            st_R.removeAll();
                                            st_R.load({
                                                params:{
                                                    idtiporecomendacion : gpTR.getSelectionModel().getSelected().get('idtiporecomendacion') ,
                                                    limit:15,
                                                    start:0
                                                },
                                                callback:function(){
                                                    gpR.getSelectionModel().selectFirstRow();
                                                }
                                            });
                                        }
                                        if(boton == 'ACEP'){

                                        }

                                        if(accion == 'ADD' || accion == 'MOD'){
                                            LimpiarFormR();
                                        }
                                }else if(action.result.codResult == 3) mostrarMensaje(action.result.codResult,'El tipo de recomendación que quiere adicionar ya existe');

                            }
                        });
                    }
                }else {
                    mostrarMensaje(3,labels.lbFechasiguales);
                }
            }
        }
        cambio = 0;
    };

    var pFiltrosTR = new Ext.Panel({
        cls: 'x-toolbar',
        layout: 'column',
        margins: '5 5 5 5',
        frame:true,
        defaults:{
            layout:'form',
            border:false,
            labelAlign:'top',
            buttonAlign:'right'
        },
        height:64,
        autoScroll:true,
        autoShow:true,
        region:'north',
        items: [{
                columnWidth:.42,
                layout: 'form',
                items:[{
                        xtype: 'textfield',
                        id: 'inputNombreTR',
                        minLength: 3,
                        maxLength: 100,
                        anchor: '95%',
                        fieldLabel: labels.lbDenominacionTR,
                        emptyText: labels.lbEmptyTextBuscar,
                        listeners: {
                            specialkey: function(field, e){
                                if (e.getKey() == e.ENTER) {
                                    if(!Ext.isEmpty(this.getValue())){
                                        btnBuscarTR.handler();
                                    }
                                }
                            }
                        }
                    }]
            },{
                layout:'form',
                bodyStyle:'padding:20px 0 0 0;',
                columnWidth:'30px',
                items:[btnBuscarTR]
            },{
                layout:'form',
                bodyStyle:'padding:19px 0 0 0;',
                columnWidth:'29px',
                items:[btnLimpiarTR]
            }]
    });

    var pContenedorTR= new Ext.Panel({
        tbar: tbTR,
        region:'west',
        width:'50%',
        layout:'border',
        items: [pFiltrosTR, gpTR],
        keys:kmRecomendacionTR
    });

    var pFiltrosR = new Ext.Panel({
        cls: 'x-toolbar',
        layout: 'column',
        margins: '5 5 5 5',
        frame:true,
        defaults:{
            layout:'form',
            border:false,
            labelAlign:'top',
            buttonAlign:'right'
        },
        height:64,
        autoScroll:true,
        autoShow:true,
        region:'north',
        items: [{
                columnWidth:.4,
                layout: 'form',
                items:[{
                        xtype: 'textfield',
                        id: 'inputNombreR',
                        disabled:true,
                        anchor: '95%',
                        minLength: 3,
                        maxLength: 100,
                        fieldLabel: labels.lbDenomBuscarR,
                        emptyText: labels.lbEmptyTextBuscar,
                        listeners: {
                            specialkey: function(field, e){
                                if (e.getKey() == e.ENTER) {
                                    if(!Ext.isEmpty(this.getValue())){
                                        btnBuscarR.handler();
                                    }
                                }
                            }
                        }
                    }]
            },{
                layout:'form',
                bodyStyle:'padding:19px 0 0 0;',
                columnWidth:'35px',
                items:[btnBuscarR]
            },{
                layout:'form',
                bodyStyle:'padding:19px 0 0 0;',
                columnWidth:'30px',
                items:[btnLimpiarR]
            }]
    });

    var pContenedorR= new Ext.Panel({
        tbar: tbR,
        width:'50%',
        region:'center',
        layout:'border',
        items: [pFiltrosR, gpR],
        keys:kmRecomendacionR
    });

    vpTR = new Ext.Viewport({
        layout:'border',
        defaults: {
            split: true
        },
        items:[pContenedorTR,pContenedorR]
    });


    st_TR.load({
        params:{
            limit:15,
            start:0
        },
        callback:function(){
            btnAdicionarTR.focus();
        }
    });

}
