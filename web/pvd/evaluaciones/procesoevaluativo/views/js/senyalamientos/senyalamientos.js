Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('senyalamientos', cargarInterfaz);
//Botones
var btnAdicionarTS, btnModificarTS, btnEliminarTS, btnAdicionarS, btnEliminarS, btnModificarS;
var btnCancelarTS, btnAplicarTS, btnAceptarTS, btnCancelarS, btnAplicarS, btnAceptarS;
//Tool bar, Stores, plugin expander, y columnModel
var tbTS, st_TS,expanderS,expanderTS,colummodel, ptTS, st_S, colummodelS,tbS,ptS;
//Grids y el viewPort
var gpTS,gpS, vpTS;
//Formularios
var formTS, formS;
//Windows
var winModTS, winTS, winModS, winS;
//Combos
var tfDenominacionTS, dfFechaInicioTS, dfFechaFinTS, heDescripcionTS, tfDenominacionT, dfFechaInicioT, dfFechaFinT, heDescripcionT;
//FECHA
var fecha = new Date();
//GENERAL
var accion = 'ADD',sist = 'TS';
var mascaraTS, mascaraS;
var fecha = new Date();
var cambio = 0;

//**************************************************Validar rango fechas*****************************************
Ext.apply(Ext.form.VTypes, {
    daterange : function(val, field) {
        var date = field.parseDate(val);

        if(!date){
            return;
        }
        if (field.startDateField && (!this.dateSangeMax || (date.getTime() != this.dateSangeMax.getTime()))) {
            var start = Ext.getCmp(field.startDateField);
            start.setMaxValue(date);
            this.dateSangeMax = date;
            start.validate();

        }
        else if (field.endDateField && (!this.dateSangeMin || (date.getTime() != this.dateSangeMin.getTime()))) {
            var end = Ext.getCmp(field.endDateField);
            end.setMinValue(date);
            this.dateSangeMin = date;
            end.validate();

        }
        return true;
    }

});
//**************************************Principal function**********************************************************************
function cargarInterfaz(){
    perfil = arguments[0];
    labels = arguments[1];

    var btnAyudaTP = new Ext.Button({
        id: 'btnAyudaSeyalamientos',
        text:labels.lbBtnAyuda,
        tooltip:labels.lbToolTipBtnAyuda,
        iconCls:'ayuda',
        /*handler : function(){
            var title	= 'Ayuda del sistema de evaluaciones';
            var referencia	= 'evaluaciones/senalamientos';
            help.show(title,referencia);
        },*/
        nextTab:'adicionarTS',
        prevTab:'btnLimpiarTS'

    });


    btnAdicionarTS = new Ext.Button({
        id: 'adicionarTS',
        text:labels.lbBtnAdicionarTS,
        tooltip:labels.lbToolTipAdicionarTS,
        iconCls:'adicionar',
        handler : function(){
            accion = 'ADD';
            sist = 'TS';
            VentanaTS(accion);
        },
        nextTab:'modificarTS',
        prevTab:'btnLimpiarTS',
    });

    btnModificarTS = new Ext.Button({
        id: 'modificarTS',
        text:labels.lbBtnModificarTS,
        tooltip:labels.lbToolTipModificarTS,
        disabled: true,
        iconCls: 'modificar',
        handler : function(){
            accion = 'MOD';
            sist = 'TS';
            VentanaTS(accion);
        },
        nextTab:'eliminarTS',
        prevTab:'adicionarTS',
    });

    btnEliminarTS = new Ext.Button({
        id: 'eliminarTS',
        text:labels.lbBtnEliminarTS,
        tooltip:labels.lbToolTipEliminarTS,
        disabled: true,
        iconCls: 'eliminar',
        handler : function(){
            mostrarMensaje(2,labels.lbBtnMsgEliminarTS,function(btn){
                if(btn == "ok"){
                    PVD.mostrarMascara('idmskeliminarts', labels.lbMsgWait, labels.lbMaskElimTS);
                    Ext.Ajax.request({
                        url: 'eliminartiposenyalamientos',
                        method:'POST',
                        params: {
                            idtiposenyalamiento: gpTS.getSelectionModel().getSelected().get('idtiposenyalamiento')
                        },
                        callback: function (options,success,response){
                            PVD.ocultarMascara('idmskeliminarts');
                            responseData = Ext.decode(response.responseText);
                             if (responseData.exception == 1) {
                                Ext.MessageBox.show({
                                    title: 'Información',
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.INFO,
                                    msg: labels.lbTipoConceptoEnUso,
                                    fn: function() {
                                        btnAdicionarTS.focus();
                                    }
                                });
                            } else {
                            mostrarMensaje(responseData.codMsg,responseData.mensaje, function(btn){
                                st_TS.load({
                                    params:{
                                        limit:15,
                                        start:0
                                    },
                                    callback:function(){
                                        gpTS.getSelectionModel().selectFirstRow();
                                    }
                                });
                            });
                        }
                       }
                    });
                }
            });
        },
        nextTab:'inputNombreTS',
        prevTab:'modificarTS',
    });

    btnBuscarTS = new Ext.Button({
        id:'buscarTS',
        text: labels.lbBtnBuscarTS,
        tooltip: labels.lbToolTipBuscarTS,
        iconCls:'buscar',
        handler: function(){
            st_TS.load({
                params:{
                    filtro:Ext.getCmp('inputNombreTS').getValue(),
                    limit:15,
                    start:0
                },
                callback:function(){
                    gpTS.getSelectionModel().selectFirstRow();
                }
            });
        },
        nextTab:'btnLimpiarTS',
        prevTab:'inputNombreTS'
    });

    var btnLimpiarTS = new Ext.Button({
        id: 'btnLimpiarTS',
        text:labels.lbBtnLimpiarTS,
        tooltip: labels.ttpBtnLimpiarTS,
        iconCls: 'limpiar',
        handler: function(){
            Ext.getCmp('inputNombreTS').reset();
        },
        nextTab:'adicionarTS',
        prevTab:'buscarTS'
    });

    btnAdicionarS = new Ext.Button({
        id: 'adicionarS',
        text:labels.lbBtnAdicionarS,
        tooltip:labels.lbToolTipAdicionarS,
        iconCls:'adicionar',
        disabled: true,
        handler : function(){
            accion = 'ADD';
            sist = 'S';
            VentanaTS(accion);
        },
        prevTab:'buscarS'
    });

    btnModificarS = new Ext.Button({
        id:'modificarS',
        text:labels.lbBtnModificarS,
        tooltip:labels.lbToolTipModificarS,
        disabled: true,
        iconCls:'modificar',
        handler : function(){
            accion = 'MOD';
            sist = 'S';
            VentanaTS(accion);
        }
    });

    btnEliminarS = new Ext.Button({
        id:'eliminarS',
        text:labels.lbBtnEliminarS,
        tooltip:labels.lbToolTipEliminarS,
        disabled: true,
        iconCls:'eliminar',
        handler : function(){
            mostrarMensaje(2,labels.lbBtnMsgEliminarD,function(btn){
                if(btn == "ok"){
                    PVD.mostrarMascara('idmskeliminars', labels.lbMsgWait, labels.lbMaskElimS);
                    Ext.Ajax.request({
                        url: 'eliminarsenyalamientos',
                        method:'POST',
                        params: {
                            idsenyalamiento: gpS.getSelectionModel().getSelected().get('idsenyalamiento')
                        },
                        callback: function (options,success,response){
                            PVD.ocultarMascara('idmskeliminars');
                            responseData = Ext.decode(response.responseText);
                             if (responseData.exception == 1) {
                                Ext.MessageBox.show({
                                    title: 'Información',
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.INFO,
                                    msg: labels.lbConceptoEnUso,
                                    fn: function() {
                                        btnAdicionarS.focus();
                                    }
                                });
                            } else {
                            mostrarMensaje(responseData.codMsg,responseData.mensaje, function(btn){
                                st_S.load({
                                    params:{
                                        idtiposenyalamiento: gpTS.getSelectionModel().getSelected().get('idtiposenyalamiento'),
                                        limit:15,
                                        start:0
                                    },
                                    callback:function(){
                                        gpS.getSelectionModel().selectFirstRow();
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

    btnBuscarS = new Ext.Button({
        id:'buscarS',
        text: labels.lbBtnBuscarS,
        tooltip: labels.lbToolTipBuscarS,

        iconCls:'buscar',
        disabled: true,
        handler: function(){
            st_S.load({
                params:{
                    filtro: Ext.getCmp('inputNombreS').getValue(),
                    idtiposenyalamiento : gpTS.getSelectionModel().getSelected().get('idtiposenyalamiento') ,
                    limit:15,
                    start:0
                },
                callback:function(){
                    gpS.getSelectionModel().selectFirstRow();
                }
            });
        },
        nextTab:'btnLimpiarS',
        prevTab:'inputNombreS',
    });

    var btnLimpiarS = new Ext.Button({
        id: 'btnLimpiarS',
        text:labels.lbBtnLimpiarS,
        tooltip: labels.ttpBtnLimpiarS,
        iconCls: 'limpiar',
        handler: function(){
            Ext.getCmp('inputNombreS').reset();
        },
        nextTab:'adicionarS',
        prevTab:'buscarS'
    });

    expanderTS = new Ext.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Descripci&oacute;n:</b> {descripcion}</p>'
            )
    });

    expanderS = new Ext.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Descripci&oacute;n:</b> {descripcion}</p>'
            )
    });

    st_TS = new Ext.data.Store({
        url: 'todostiposenyalamientos',
        reader:new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "idtiposenyalamiento"
        }, [{
            name: 'idtiposenyalamiento'
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

    colummodel = [expanderTS,{
        id:'expandir',
        header: labels.lbDenominacion ,
        sortable: true,
        width: 150,
        dataIndex: 'denom'
    }
    ];
    ptTS = new Ext.PagingToolbar({
        pageSize: 15,
        store: st_TS,
        displayInfo: true,
        displayMsg: labels.lbPaginToolBar

    });

    tbTS = new Ext.Toolbar({
        id: 'tbTS',
        items:[btnAdicionarTS, btnModificarTS, btnEliminarTS]
    });

    tfDenominacionTS = new Ext.form.TextField({
        fieldLabel: labels.lbDenominacion,
        name: 		'denominacion',
        id: 		'denominacion',
        anchor:		'98%',
		maxLength   :255,
        allowBlank:	false,
        blankText:	labels.lbCampoVacio,
        regexText:	labels.lbDenominacionError,
        regex: 		/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ]*)+([a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]*)+$/,
        listeners: {
            change: function(){
                cambio = 1;
            }
        },
        prevTab: 'btnAceptarTS'
    });

    dfFechaInicioTS = new Ext.form.DateField({
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

    dfFechaFinTS = new Ext.form.DateField({
        fieldLabel: labels.lbFechaFin,
        name: 'fechafin',
        id: 'fechafin',
        format:'d/m/Y',
        width: 176,
        vtype: 'daterange',
        startDateField: 'fechainicio',
        invalidText: labels.lbToolTipFecha,
        listeners: {
            change: function(){
                cambio = 1;
            }
        }
    });

    heDescripcionTS = new Ext.form.TextArea({
        anchor:'98%',
        id:'descripcion',
        fieldLabel:labels.lbDescripcion,
        name:'descripcion',
        height: 120,
        maxLength:255,
        listeners: {
            change: function(){
                cambio = 1;
            }
        }
    });

    formTS = new Ext.FormPanel({
        labelAlign: 'top',
        frame:true,
        baseParams:{
            idtiposenyalamiento : -1
        },
        autoHeight:true,
        autoShow:true,
        items: [tfDenominacionTS,{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [dfFechaInicioTS]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [dfFechaFinTS]
            }]
        },heDescripcionTS]
    });

    btnCancelarTS = new Ext.Button({
        iconCls:'cancelar',
        text:labels.lbtnCancelarS,
        tooltip:labels.lbToolTipCancelar,
        handler: function(){
            winTS.hide();
            LimpiarFormTS();
            cambio = 0;
        }

    });

    btnAplicarTS = new Ext.Button({
        id: 'btnAplicarTS',
        iconCls:'aplicar',
        text:labels.lbtnAplicarS,
        tooltip:labels.lbToolTipAplicar,
        handler: function(){
            RealizarAccion( accion, 'APLI');
        }
    });

    btnAceptarTS = new Ext.Button({
        id:'btnAceptarTS',
        iconCls:'aceptar',
        text:labels.lbtnAceptarS,
        tooltip:labels.lbToolTipAceptar,
        handler: function(){
            RealizarAccion( accion, 'ACEP');
        },
        nextTab: 'denominacion',
        prevTab: 'btnAplicarTS'
    });

    btnCancelarS = new Ext.Button({
        iconCls:'cancelar',
        text:labels.lbtnCancelarS,
        tooltip:labels.lbToolTipCancelar,
        handler: function(){
            winS.hide();
            LimpiarFormS();
            cambio = 0;
        }

    });

    btnAplicarS = new Ext.Button({
        id: 'btnAplicarS',
        iconCls:'aplicar',
        text:labels.lbtnAplicarS,
        tooltip:labels.lbToolTipAplicar
    });

    btnAceptarS = new Ext.Button({
        id:'btnAceptarS',
        iconCls:'aceptar',
        text:labels.lbtnAceptarS,
        tooltip:labels.lbToolTipAceptar,
        handler: function(){
            RealizarAccion(accion, 'ACEP');
        },
        nextTab: 'denom',
        prevTab: 'btnAplicarS'
    });

    var keysTS= [{
        key: 'x',
        alt: true,
        fn: function() {
            if (!btnCancelarTS.hidden) {
                btnCancelarTS.handler();
            }
        }
    }, {
        key: 'p',
        ctrl: true,
        alt: true,
        fn: function() {
            if (!btnAplicarTS.hidden) {
                btnAplicarTS.handler();
            }
        }
    }, {
        key: Ext.EventObject.ENTER,
        fn: function() {
            if (!btnAceptarTS.hidden) {
                btnAceptarTS.handler();
            }
        }
    }
    ];

    var keysS= [{
        key: 'x',
        alt: true,
        fn: function() {
            if (!btnCancelarS.hidden) {
                btnCancelarS.handler();
            }
        }
    }, {
        key: 'p',
        ctrl: true,
        alt: true,
        fn: function() {
            if (!btnAplicarS.hidden) {
                btnAplicarS.handler();
            }
        }
    }, {
        key: Ext.EventObject.ENTER,
        fn: function() {
            if (!btnAceptarS.hidden) {
                btnAceptarS.handler();
            }
        }
    }
    ];

    tfDenominacionS = new Ext.form.TextField({
        fieldLabel: labels.lbDenominacionS,
        name: 		'denom',
        id: 		'denom',
        anchor:		'98%',
        allowBlank:	false,
        blankText:	labels.lbCampoVacio,
        regexText:	labels.lbDenominacionError,
        regex: 		/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ]*)+([a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]*)+$/,
        listeners: {
            change: function(){
                cambio = 1;
            }
        },
        prevTab: 'btnAceptarS'
    });

    dfFechaInicioS = new Ext.form.DateField({
        fieldLabel: labels.lbFechaInicio,
        name: 'fechainicio',
        id: 'fechainicioS',
        value: fecha.format('d/m/Y'),
        format:'d/m/Y',
        allowBlank: false,
        anchor:'95%',
        vtype: 'daterange',
        endDateField: 'fechafinS',
        invalidText: labels.lbToolTipFecha,
        listeners: {
            change: function(){
                cambio = 1;
            }
        }
    });

    dfFechaFinS = new Ext.form.DateField({
        fieldLabel: labels.lbFechaFin,
        name: 'fechafin',
        id: 'fechafinS',
        format:'d/m/Y',
        anchor:'95%',
        vtype: 'daterange',
        startDateField: 'fechainicioS',
        invalidText: labels.lbToolTipFecha,
        listeners: {
            change: function(){
                cambio = 1;
            }
        }
    });

    heDescripcionS = new Ext.form.TextArea({
        anchor:'98%',
        fieldLabel:labels.lbDescripcionS,
        name:'descripcion',
        height: 120,
        maxLength:255,
        listeners: {
            change: function(){
                cambio = 1;
            }
        }
    });

    st_S = new Ext.data.Store({
        url: 'todossenyalamientosportipo',
        reader:new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "idsenyalamiento"
        },[
        {
            name: 'idsenyalamiento'
        },

        {
            name: 'idtiposenyalamiento'
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

    colummodelS = [expanderS,{
        id:'expandirS',
        header: labels.lbDenominacionS,
        sortable: true,
        width: 150,
        dataIndex: 'denom'
    }];

    ptS= new Ext.PagingToolbar({
        pageSize: 15,
        store: st_S,
        displayInfo: true,
        displayMsg: labels.lbPaginToolBar
    });

    tbS = 	new Ext.Toolbar({
        id:'tbS',
        items:[btnAdicionarS,btnModificarS,btnEliminarS,'->',btnAyudaTP]

    });

    formS = new Ext.FormPanel({
        labelAlign: 'top',
        frame:true,
        id:'formS',
        autoHeight:true,
        baseParams:{
            idsenyalamiento : -1,
            idtiposenyalamiento : -1
        },
        items: [tfDenominacionS,{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [dfFechaInicioS]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [dfFechaFinS]
            }]
        },heDescripcionS]
    });

    function LimpiarFormTS(){
        formTS.getForm().reset();
    }

    function LimpiarFormS(){
        formS.getForm().reset();
    }

    function VentanaTS(accion){
        if(accion == 'ADD' && sist == 'TS'){
            LimpiarFormTS();
            winTS.setTitle(labels.lbAdicionarTS);
            dfFechaInicioTS.setValue(fecha.format('d/m/Y'));
            btnAplicarTS.show();
            winTS.show();

        }
        else if(accion == 'ADD' && sist == 'S'){
            LimpiarFormS();
            winS.setTitle(labels.lbAdicionarS);
            dfFechaInicioS.setValue(fecha.format('d/m/Y'));
            btnAplicarS.show();
            winS.show();
        }
        else{
            if(accion == 'MOD' && sist == 'TS'){
                var record = gpTS.getSelectionModel().getSelected();
                tfDenominacionTS.setValue(record.get('denom'));
                heDescripcionTS.setValue(record.get('descripcion'));
                dfFechaInicioTS.setValue(record.get('fechainicio'));
                dfFechaFinTS.setValue(record.get('fechafin'));
                winTS.setTitle(labels.lbModificarTS);
                Ext.getCmp('btnAplicarTS').hide();
                winTS.show();
            }else{
                var record = gpS.getSelectionModel().getSelected();
                tfDenominacionS.setValue(record.get('denom'));
                heDescripcionS.setValue(record.get('descripcion'));
                dfFechaInicioS.setValue(record.get('fechainicio'));
                dfFechaFinS.setValue(record.get('fechafin'));
                winS.setTitle(labels.lbModificarS);
                Ext.getCmp('btnAplicarS').hide();
                winS.show();
            }
        }
    }

    winTS = new Ext.Window({
        title:labels.lbCrearTS,
        layout:'fit',
        modal: true,
        closable:true,
        resizable:false,
        keys:keysTS,
        closeAction: 'hide',
        width:400,
        autoHeight: true,
        items:[formTS],
        buttons: [btnCancelarTS, btnAplicarTS,btnAceptarTS]
    });

    winTS.on('show', function(cmp){
        tfDenominacionTS.focus(true, 300);
    });
    winTS.on('hide', function(cmp){
        btnAdicionarTS.focus();
    });

    winS = new Ext.Window({
        title:labels.lbCrearTS,
        layout:'fit',
        modal: true,
        closable:true,
        keys:keysS,
        resizable:false,
        closeAction: 'hide',
        width:400,
        autoHeight: true,
        items:[formS],
        buttons: [btnCancelarS, btnAplicarS,btnAceptarS]
    });

    winS.on('show', function(cmp){
        tfDenominacionS.focus(true, 300);
    });

    winS.on('hide', function(cmp){
        btnAdicionarS.focus();
    });

    var kmSeñalamientoTS = [{
        key: 'i',
        alt:true,
        fn: function(){
            btnAdicionarTS.handler();
        }
    },{
        key: 'm',
        alt:true,
        fn: function(){
            if(!btnModificarTS.disabled ){
                btnModificarTS.handler();
            }
        }
    },{
        key: 46,
        fn: function(){
            if(!btnEliminarTS.disabled ){
                btnEliminarTS.handler();
            }
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
        fn: btnBuscarTS.handler
    },{
        key: 'l',
        alt:true,
        fn: btnLimpiarTS.handler
    }
    ];

    var kmSeñalamientoS = [{
        key: 'i',
        alt:true,
        fn: function(){
            btnAdicionarS.handler();
        }
    },{
        key: 'm',
        alt:true,
        fn: function(){
            if(!btnModificarS.disabled ){
                btnModificarS.handler();
            }
        }
    },{
        key: 46,
        fn: function(){
            if(!btnEliminarS.disabled ){
                btnEliminarS.handler();
            }
        }
    },{
        key: 'b',
        alt:true,
        fn: btnBuscarS.handler
    },{
        key: 'l',
        alt:true,
        fn: btnLimpiarS.handler
    }
    ];
    gpTS = new Ext.grid.GridPanel({
        id:'idTS',
        title: labels.lbgpTS,
        columns: colummodel,
        stripeRows: true,
        autoScroll:true,
        store: st_TS,
        plugins: expanderTS,
        autoExpandColumn:'expandir',
        loadMask:{
            msg :labels.lbGridLoadMask
        },
        minRize: 75,
        region:'center',
        padding:'0 0 0 0',
        margins: '5 5 5 5',
        width: '50%',
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function(sm, row, rec){
                    st_S.load({
                        params:{
                            idtiposenyalamiento: rec.data.idtiposenyalamiento,
                            limit:15,
                            start:0
                        },
                        callback:function(){
                            gpS.getSelectionModel().selectFirstRow();
                        }
                    });
                    Ext.getCmp('adicionarS').enable();
                    Ext.getCmp('eliminarTS').enable();
                    Ext.getCmp('modificarTS').enable();
                    Ext.getCmp('buscarS').enable();
                    Ext.getCmp('modificarS').disable();
                    Ext.getCmp('eliminarS').disable();
                }
            }
        }),
        bbar: ptTS
    });

    gpTS.on('render', function(p){
        btnAdicionarTS.focus();
    });

    gpS = new Ext.grid.GridPanel({
        id:'gpS',
        title: labels.lbgpS,
        columns: colummodelS,
        stripeRows: true,
        autoScroll:true,
        plugins: expanderS,
        store: st_S,
        autoExpandColumn:'expandirS',
        loadMask:{
            msg :labels.lbGridLoadMask
        },
        minRize: 75,
        region:'center',
        margins: '5 5 5 5',
        width:'50%',
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function(sm, row, rec) {
                    Ext.getCmp('modificarS').enable();
                    Ext.getCmp('eliminarS').enable();

                }
            }
        }),
        bbar:ptS
    });


    function RealizarAccion(accion, boton){

        var url = 'adicionartiposenyalamientos', msgForm = labels.lbWaitMsgAddTS;
        var idtiposenyalamiento = -1, idsenyalamiento = -1;

        if(accion == 'ADD' && sist == 'TS'){
            url = 'adicionartiposenyalamientos';
            msgForm = labels.lbWaitMsgAddTS;
        }
        else if(accion == 'MOD' && sist == 'TS'){
            msgForm = labels.lbWaitMsgModTS;
            idtiposenyalamiento = gpTS.getSelectionModel().getSelected().get('idtiposenyalamiento');
            url = 'modificartiposenyalamientos';
        }
        else if(accion == 'ADD' && sist == 'S'){
            msgForm = labels.lbWaitMsgAddS;
            url = 'adicionarsenyalamientos';
            idtiposenyalamiento = gpTS.getSelectionModel().getSelected().get('idtiposenyalamiento');
        }
        else {
            msgForm = labels.lbWaitMsgModS;
            idtiposenyalamiento = gpTS.getSelectionModel().getSelected().get('idtiposenyalamiento');
            idsenyalamiento = gpS.getSelectionModel().getSelected().get('idsenyalamiento');
            url = 'modificarsenyalamientos';
        }

        if(cambio == 0) {
            if(accion == 'MOD' && sist == 'TS')
                winTS.hide();
            else if(accion == 'MOD' && sist != 'TS')
                winS.hide();
            else {
                tfDenominacionTS.markInvalid(labels.lbCampoVacio);
                tfDenominacionS.markInvalid(labels.lbCampoVacio);
            }
        }
        else{
            if(sist == 'TS'){
                formTS.baseParams.idtiposenyalamiento = idtiposenyalamiento;
                if(dfFechaInicioTS.getRawValue() != dfFechaFinTS.getRawValue()){
                    if(formTS.getForm().isValid()){
                        PVD.mostrarMascara('idmskguardarts', labels.lbMsgWait, labels.lbMsgSave);
                        formTS.getForm().submit({
                            url:url,
                            baseParams:{
                                denom : tfDenominacionTS.getValue(),
                                descripcion: heDescripcionTS.getValue(),
                                fechainicio:dfFechaInicioTS.getRawValue(),
                                fechafin:dfFechaFinTS.getRawValue()
                            },
                            failure: function(form, action)
                            {
                                PVD.ocultarMascara('idmskguardarts');
                                if(action.result.codMsg == 1){
                                    mostrarMensaje(action.result.codMsg,action.result.mensaje,function(){

                                        if(boton == 'ACEP'){
                                            winTS.hide();
                                        }
                                        if(sist == 'TS'){
                                            gpTS.getSelectionModel().clearSelections();
                                            st_TS.removeAll();
                                            st_TS.load({
                                                params:{
                                                    limit:15,
                                                    start:0
                                                },
                                                callback:function(){
                                                    gpTS.getSelectionModel().selectFirstRow();
                                                }
                                            });
                                        }
                                        if(boton == 'ACEP'){

                                        }

                                        if(accion == 'ADD' || accion == 'MOD'){
                                            LimpiarFormTS();
                                        }
                                    });
                                }else if(action.result.codMsg == 3) mostrarMensaje(action.result.codMsg,action.result.mensaje);

                            }
                        });
                    }//isValid()
                }else {
                    mostrarMensaje(3,labels.lbFechasiguales);
                }
            }else{
                formS.baseParams.idsenyalamiento = idsenyalamiento;
                formS.baseParams.idtiposenyalamiento = idtiposenyalamiento;
                if(dfFechaInicioS.getRawValue() != dfFechaFinS.getRawValue()){
                    if(formS.getForm().isValid()){
                        PVD.mostrarMascara('idmskguardarts', labels.lbMsgWait, labels.lbMsgSave);
                        formS.getForm().submit({
                            url:url,
                            baseParams:{
                                denom : tfDenominacionS.getValue(),
                                descripcion: heDescripcionS.getValue(),
                                fechainicio:dfFechaInicioS.getRawValue(),
                                fechafin:dfFechaFinS.getRawValue()
                            },
                            failure: function(form, action)
                            {
                                PVD.ocultarMascara('idmskguardarts');
                                if(action.result.codMsg == 1){
                                    mostrarMensaje(action.result.codMsg,action.result.mensaje,function(){

                                        if(boton == 'ACEP'){
                                            winS.hide();
                                        }
                                        if(sist == 'S'){
                                            gpS.getSelectionModel().clearSelections();
                                            st_S.removeAll();
                                            st_S.load({
                                                params:{
                                                    idtiposenyalamiento : gpTS.getSelectionModel().getSelected().get('idtiposenyalamiento') ,
                                                    limit:15,
                                                    start:0
                                                },
                                                callback:function(){
                                                    gpS.getSelectionModel().selectFirstRow();
                                                }
                                            });
                                        }
                                        if(boton == 'ACEP'){

                                        }

                                        if(accion == 'ADD' || accion == 'MOD'){
                                            LimpiarFormS();
                                        }
                                    });
                                }else if(action.result.codMsg == 3) mostrarMensaje(action.result.codMsg,action.result.mensaje);

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

    var pFiltrosTS = new Ext.Panel({
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
                        id: 'inputNombreTS',
                        anchor: '95%',
                        minLength: 3,
                        maxLength: 100,
                        fieldLabel: labels.lbDenominacion,
                        emptyText: labels.lbEmptyTextBuscar,
                        listeners: {
                            specialkey: function(field, e){
                                if (e.getKey() == e.ENTER) {
                                    if(!Ext.isEmpty(this.getValue())){
                                        btnBuscarTS.handler();
                                    }
                                }
                            }
                        },
                        prevTab:'eliminarTS',
                        nextTab:'buscarTS'
                    }]
            },{
                layout:'form',
                bodyStyle:'padding:20px 0 0 0;',
                columnWidth:'30px',
                items:[btnBuscarTS]
            },{
                layout:'form',
                bodyStyle:'padding:19px 0 0 0;',
                columnWidth:'29px',
                items:[btnLimpiarTS]
            }]
    });

    var pFiltrosS = new Ext.Panel({
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
                        id: 'inputNombreS',
                        anchor: '95%',
                        minLength: 3,
                        maxLength: 100,
                        fieldLabel: labels.lbDenominacionS,
                        emptyText: labels.lbEmptyTextBuscar,
                        nextTab:'btnEliminarS',
                        prevTab:'btnBuscarS',
                        listeners: {
                            specialkey: function(field, e){
                                if (e.getKey() == e.ENTER) {
                                    if(!Ext.isEmpty(this.getValue())){
                                        btnBuscarS.handler();
                                    }
                                }
                            }
                        }
                    }]
            },{
                layout:'form',
                bodyStyle:'padding:20px 0 0 0;',
                columnWidth:'30px',
                items:[btnBuscarS]
            },{
                layout:'form',
                bodyStyle:'padding:19px 0 0 0;',
                columnWidth:'29px',
                items:[btnLimpiarS]
            }]
    });

    var pContenedorTS= new Ext.Panel({
        tbar: tbTS,
        region:'west',
        width:'50%',
        layout:'border',
        items: [gpTS,pFiltrosTS],
        keys:kmSeñalamientoTS
    });

    var pContenedorS= new Ext.Panel({
        tbar: tbS,
        region:'center',
        width:'50%',
        layout:'border',
        items: [gpS, pFiltrosS],
        keys:kmSeñalamientoS
    });

    vpTS = new Ext.Viewport({
        layout:'border',
        defaults: {
            split: true,
        },
        items:[pContenedorTS,pContenedorS]
    });

    st_TS.load({
        params:{
            limit:15,
            start:0
        },
        callback:function(){
            gpTS.getSelectionModel().selectFirstRow();
        }
    });


}
