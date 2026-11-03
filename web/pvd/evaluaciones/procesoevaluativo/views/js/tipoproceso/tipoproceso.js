Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('tipoproceso', cargarInterfaz);
//Botones
var btnAdicionarTP, btnModificarTP, btnAyudaTP, btnEliminarTP;
var btnCancelarTP, btnAplicarTP, btnAceptarTP;
//Tool bar, Rtores, plugin expander, y columnModel
var tbTP, st_TP,expanderTP,colummodel, ptTP, arrayMedidaTiempo, storeMedidaTiempo;
//Grids y el viewPort
var gpTP, vpTP;
//Formularios
var formTP;
//Windows
var winTP;
//Combos
var tfDenominacionTP, dfFechaInicioTP, dfFechaFinTP, heDescripcionTP;
var chbOrden, chbComision, chbAutoevaluacion, chbEvaluadorEvaluado;
//FECHA
var fecha = new Date();
//GENERAL
var accion = 'ADD';
var mascaraTP;
var fecha = new Date();
var cambio = 0;

//**************************************Principal function**********************************************************************
function cargarInterfaz(){
    perfil = arguments[0];
    labels = arguments[1];

    var btnAyudaTP = new Ext.Button({
        id: 'btnAyudaTipodeproceso',
        text:labels.lbBtnAyuda,
        tooltip:labels.lbToolTipAyudaTP,
        iconCls:'ayuda',
        /*handler : function(){
            var title	= 'Ayuda del sistema de evaluaciones';
            var referencia	= 'evaluaciones/tipoproceso';
            help.show(title,referencia);

        },*/
        nextTab: 'inputNombreTP',
        prevTab:'eliminarTP'
    });

    btnAdicionarTP = new Ext.Button({
        id: 'adicionarTP',
        text:labels.lbBtnAdicionar,
        tooltip:labels.lbToolTipAdicionarTP,
        iconCls:'adicionar',
        handler : function(){
            accion = 'ADD';
            VentanaTP(accion);
        },
        prevTab:'btnLimpiar'
    });

    btnModificarTP = new Ext.Button({
        id: 'modificarTP',
        text:labels.lbBtnModificar,
        tooltip:labels.lbToolTipModificarTP,
        disabled: true,
        iconCls: 'modificar',
        handler : function(){
            LimpiarFormTP();
            accion = 'MOD';
            VentanaTP(accion);
        }
    });

    btnEliminarTP = new Ext.Button({
        id: 'eliminarTP',
        text:labels.lbBtnEliminar,
        tooltip:labels.lbToolTipEliminarTP,
        disabled: true,
        iconCls: 'eliminar',
        handler : function(){
            mostrarMensaje(2,labels.lbBtnMsgEliminarD,function(btn){
                if(btn == "ok"){
                    PVD.mostrarMascara('idmskeliminartr', labels.lbMsgWait, labels.lbMaskElimTP);
                    //mascaraTP.show();
                    Ext.Ajax.request({
                        url: 'eliminartipoproceso',
                        method:'POST',
                        params: {
                            idtipoprocesoevaluativo: gpTP.getSelectionModel().getSelected().get('idtipoprocesoevaluativo')
                        },
                        callback: function (options,success,response){
                            PVD.ocultarMascara('idmskeliminartr');
                            //mascaraTP.hide();
                            responseData = Ext.decode(response.responseText);
                             if (responseData.exception == 1) {
                                 mostrarMensaje(3,labels.lbConceptoEnUso);
                            } else {
                            mostrarMensaje(1,responseData.mensaje);
                                st_TP.load({
                                    params:{
                                        limit:15,
                                        start:0
                                    },
                                    callback:function(){
                                        gpTP.getSelectionModel().selectFirstRow();
                                    }
                                });

                        }
                      }
                    });
                }
            });
        }
    });

    expanderTP = new Ext.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Descripci&oacute;n:</b> {descripcion}</p>'
            )
    });

    st_TP = new Ext.data.Store({
        url: 'todostipoprocesos',
        reader:new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "idtipoprocesoevaluativo"
        }, [{
            name: 'idtipoprocesoevaluativo'
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
        },

        {
            name: 'orden'
        },

        {
            name: 'comisionevaluacion'
        },

        {
            name: 'evaluadoresevaluados'
        },

        {
            name: 'autoevaluacion'
        }
        ])
    });

    colummodel = [expanderTP,
    {
        id:'expandir',
        header: labels.lbDenominacion ,
        sortable: true,
        dataIndex: 'denom'
    },
    {
        header: labels.lbOrden ,
        sortable: true,
        width: 150,
        dataIndex: 'orden',
        renderer: mostrarEstado
    },
    {
        header: labels.lbComision ,
        sortable: true,
        width: 150,
        dataIndex: 'comisionevaluacion',
        renderer: mostrarEstado
    },
    {
        header: labels.lbEvaluadoresEvaluados ,
        sortable: true,
        width: 150,
        dataIndex: 'evaluadoresevaluados',
        renderer: mostrarEstado
    },
    {
        header: labels.lbAutoevaluacion,
        sortable: true,
        width: 150,
        dataIndex: 'autoevaluacion',
        renderer: mostrarEstado
    }
    ];

    function mostrarEstado(value){
        if(value == false){ //caso en que el indicador sea de tipo imagen
            return "<img src=../../../procesoevaluativo/views/images/false.gif width='16' height='16' />";
        }else{
            return "<img src=../../../procesoevaluativo/views/images/true.png width='16' height='16' />";
        }
    }

    ptTP = new Ext.PagingToolbar({
        pageSize: 15,
        store: st_TP,
        displayInfo: true,
        displayMsg: labels.lbPaginToolBar

    });

    tfDenominacionTP = new Ext.form.TextField({
        fieldLabel: labels.lbDenominacion,
        name: 		'denom',
        id: 		'tfDenominacionTP',
        anchor:		'98%',
        allowBlank:	false,
        maxLength:  255,
        regexText:	labels.lbDenominacionError,
        regex: 		/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ]*)+([a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]*)+$/,
        maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,
        blankText:	labels.lbCampoVacio,
        nextTab     :'fechainicio',
        prevTab:    'btnAceptarTP',
        listeners: {
            change: function(){
                cambio = 1;
            }
        },


    });

    dfFechaInicioTP = new Ext.form.DateField({
        fieldLabel: labels.lbFechaInicio,
        name: 'fechainicio',
        id: 'fechainicio',
        width: 176,
        value: fecha.format('d/m/Y'),
        format:'d/m/Y',
        vtype: 'daterange',
        endDateField: 'fechafin',
        allowBlank:false,
        readOnly:true,
        invalidText:labels.lbBtnFecha,
        blankText: labels.lbCampoVacio,
        prevTab     :'tfDenominacionTP',
        nextTab     :'fechafin',
        listeners: {
            change: function(){
                cambio = 1;
            }
        }
    });

    chbOrden = new Ext.form.Checkbox({
        id          :'chborden',
        boxLabel 	:labels.lbOrden,
        hideLabel: true,
        name  		:'orden',
        inputValue 	:'true',
        nextTab     :'chbevaluadorevaluado',
        prevtTab    :'descripcion',
        listeners: {
            check: function(){
                cambio = 1;
            }
        }
    });

    chbEvaluadorEvaluado = new Ext.form.Checkbox({
        id          :'chbevaluadorevaluado',
        boxLabel 	: labels.lbEvaluadoresEvaluados,
        name  		: 'evaluadorEvaluado',
        inputValue 	: 'true',
        prevTab     :'chborden',
        nextTab     :'chbcomision',
        hideLabel: true,
        listeners: {
            check: function(chkbox, checked){
                cambio = 1;
                if(checked){
                    chbAutoevaluacion.setValue(false);
                }else{
                    chbComision.setValue(false);
                }
            }
        }
    });

    chbComision = new Ext.form.Checkbox({
        id          :'chbcomision',
        boxLabel 	: labels.lbComision,
        name  		: 'comision',
        inputValue 	: 'true',
        prevTab     :'chbevaluadorevaluado',
        nextTab     :'chbautoevaluacion',
        hideLabel: true,
        listeners: {
            check: function(chkbox, checked){
                cambio = 1;
                if(checked){
                    chbEvaluadorEvaluado.setValue(true);
                    chbAutoevaluacion.setValue(false);
                }
            }
        }
    });

    chbAutoevaluacion = new Ext.form.Checkbox({
        id          :'chbautoevaluacion',
        boxLabel 	: 'Autoevaluación',//labels.lbAutoevaluacion,
        name  		: 'autoevaluacion',
        inputValue 	: 'true',
        prevTab     :'chbcomision',
        nextTab     :'btnCancelarTP',
        hideLabel: true,
        listeners: {
            check: function(chkbox, checked){
                cambio = 1;
                if(checked){
                    chbComision.setValue(false);
                    chbEvaluadorEvaluado.setValue(false);
                }
            }
        }
    });

    dfFechaFinTP = new Ext.form.DateField({
        fieldLabel: labels.lbFechaFin,
        name: 'fechafin',
        id: 'fechafin',
        format:'d/m/Y',
        width: 176,
        vtype: 'daterange',
        readOnly:true,
        invalidText:labels.lbBtnFecha,
        startDateField: 'fechainicio',
        prevTab     :'fechainicio',
        nextTab     :'descripcion',
        listeners: {
            change: function(){
                cambio = 1;
            }
        }
    });

    heDescripcionTP = new Ext.form.TextArea({
        anchor:'98%',
        id:'descripcion',
        fieldLabel: labels.lbDescripcion,
        name:'descripcion',
        height: 120,
        maxLength:255,
        prevTab     :'fechafin',
        nextTab     :'chborden',
        listeners: {
            change: function(){
                cambio = 1;
            }
        }
    });

    formTP = new Ext.FormPanel({
        labelAlign: 'top',
        frame:true,
        //region:'center',
        baseParams:{
            idtipoprocesoevaluativo : -1
        },
        autoHeight:true,
        items: [tfDenominacionTP,{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [dfFechaInicioTP]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [dfFechaFinTP]
            }]
        }, heDescripcionTP
        ,{
            xtype:'fieldset',
            title: 'Opciones',
            anchor:'98%',
            autoHeight: true,
            items:[{
                xtype: 'checkboxgroup',
                labelSeparator: '',
                id: 'chbgp',
                hideLabel: true,
                columns: 2,
                vertical: true,
                items: [chbOrden, chbComision, chbEvaluadorEvaluado, chbAutoevaluacion]
            }]
        }]
    });

    btnCancelarTP = new Ext.Button({
        id:'btnCancelarTP',
        iconCls:'cancelar',
        text:labels.lbtnCancelarTP,
        tooltip:labels.lbToolTipCancelar,
        prevTab     :'chbautoevaluacion',
        nextTab     :((accion == 'MOD')?'btnAceptarTP':'btnAplicarTP'),
        handler: function(){
            winTP.hide();
            LimpiarFormTP();
            cambio = 0;
        }

    });

    btnAplicarTP = new Ext.Button({
        id: 'btnAplicarTP',
        iconCls:'aplicar',
        text:labels.lbtnAplicarTP,
        tooltip:labels.lbToolTipAplicar,
        prevTab     :'btnCancelarTP',
        nextTab     :'btnAceptarTP',
        handler: function(){
            RealizarAccion( accion, 'APLI');
        }
    });

    btnAceptarTP = new Ext.Button({
        id: 'btnAceptarTP',
        iconCls:'aceptar',
        text:labels.lbtnAceptarTP,
        tooltip:labels.lbToolTipAceptar,
        handler: function(){
            RealizarAccion( accion, 'ACEP');
        },
        prevTab     :((accion == 'MOD')?'btnCancelarTP':'btnAplicarTP'),
        nextTab     :'tfDenominacionTP',
    });

    var keysTP= [{
        key: 'x',
        alt: true,
        fn: function() {
            if (!btnCancelarTP.hidden) {
                btnCancelarTP.handler();
            }
        }
    }, {
        key: 'p',
        ctrl: true,
        alt: true,
        fn: function() {
            if (!btnAplicarTP.hidden) {
                btnAplicarTP.handler();
            }
        }
    }, {
        key: Ext.EventObject.ENTER,
        fn: function() {
            if (!btnAceptarTP.hidden) {
                btnAceptarTP.handler();
            }
        }
    }
    ];

    function LimpiarFormTP(){
        formTP.getForm().reset();
    }

    function VentanaTP(accion){
        var record;
        if(accion == 'ADD'){
            LimpiarFormTP();
            winTP.setTitle(labels.lbCrearTP);
            dfFechaInicioTP.setValue(fecha.format('d/m/Y'));
            Ext.getCmp('btnAplicarTP').show();
            winTP.show();
        }else{
            record = gpTP.getSelectionModel().getSelected();
            tfDenominacionTP.setValue(record.get('denom'));
            heDescripcionTP.setValue(record.get('descripcion'));
            dfFechaInicioTP.setValue(record.get('fechainicio'));
            dfFechaFinTP.setValue(record.get('fechafin'));

            winTP.setTitle(labels.lbModificarTP);
            Ext.getCmp('btnAplicarTP').hide();
            winTP.show();

            chbOrden.setValue(record.get('orden'));
            chbComision.setValue(record.get('comisionevaluacion'));
            chbEvaluadorEvaluado.setValue(record.get('evaluadoresevaluados'));
            chbAutoevaluacion.setValue(record.get('autoevaluacion'));
        }
    }


    winTP = new Ext.Window({
        title:'',
        layout:'fit',
        modal: true,
        closable:true,
        resizable:false,
        keys:keysTP,
        closeAction: 'hide',
        width:400,
        autoHeight:true,
        items:[formTP],
        buttons: [btnCancelarTP, btnAplicarTP,btnAceptarTP]
    });
    winTP.on('show', function(cmp){
        tfDenominacionTP.focus(false, 300);
    });
    winTP.on('hide', function(cmp){
        btnAdicionarTP.focus();
    });
    var btnBuscar = new Ext.Button({
        iconCls: 'buscar',
        id: 'btn_Buscar',
        text:labels.lbBtnBuscar,
        tooltip:labels.lbToolTipBtnBuscar,
        handler: function(){
            st_TP.load({
                params:{
                    filtro: Ext.getCmp('inputNombreTP').getValue(),
                    limit:15,
                    start:0
                },
                callback:function(){
                    gpTP.getSelectionModel().selectFirstRow();
                }
            });
        }
    });

    var btnLimpiar= new Ext.Button({
        tooltip: labels.ttpBtnLimpiar,
        id: 'btnLimpiar',
        iconCls: 'limpiar',
        text:labels.lbBtnLimpiar,
        tooltip:labels.lbToolTipBtnLimpiar,
        handler: function(){
            Ext.getCmp('inputNombreTP').reset();
        },
        nextTab: 'adicionarTP',
        prevTab:'btn_Buscar'
    });

    var pFiltros = new Ext.Panel({
        layout: 'column',
        cls: 'x-toolbar',
        margins: '5 5 0 5',
        frame:true,
        defaults:{
            layout:'form',
            border:false,
            labelAlign:'top',
            buttonAlign:'right'
        },
        height:63,
        autoShow:true,
        region:'north',
        items: [{
            columnWidth:.3,
            layout: 'form',
            items:[{
                xtype: 'textfield',
                id: 'inputNombreTP',
                prevTab:'ayudaTP',
                anchor: '95%',
                minLength: 3,
                maxLength: 100,
                fieldLabel: labels.lbDenominacion,
                emptyText: labels.lbEmptyTextBuscar,
                listeners: {
                    specialkey: function(field, e){
                        if (e.getKey() == e.ENTER) {
                            btnBuscar.handler();//LLamar al boton
                        }
                    }
                }
            }]
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

    gpTP = new Ext.grid.GridPanel({
        id:'idTP',
        title: labels.lbgpTP,
        columns: colummodel,
        stripeRows: true,
        autoRcroll:true,
        store: st_TP,
        plugins: expanderTP,
        autoExpandColumn:'expandir',
        loadMask:{
            msg :labels.lbGridLoadMask
        },
        minSize: 75,
        region:'center',
        padding:'0 0 0 0',
        margins: '5 5 5 5',
        width: '50%',
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function(sm, row, rec){
                    //st_R.load({params:{idperiodo: rec.data.idperiodo, limit:15, start:0}, callback:function(){gpR.getSelectionModel().selectFirstRow();}});
                    Ext.getCmp('eliminarTP').enable();
                    Ext.getCmp('modificarTP').enable();
                }
            }
        }),
        bbar: ptTP
    });

    function RealizarAccion(accion, boton){

        var url = 'adicionartipoproceso', msgForm = labels.lbWaitMsgAddTP;
        var idtipoprocesoevaluativo = -1;

        if(accion == 'ADD'){
            url = 'adicionartipoproceso';
            msgForm = labels.lbWaitMsgAddTP;
        }
        else{
            msgForm = labels.lbWaitMsgModTP;
            idtipoprocesoevaluativo = gpTP.getSelectionModel().getSelected().get('idtipoprocesoevaluativo');
            url = 'modificartipoproceso';
        }

        if(cambio == 0) {
            if(accion == 'MOD')
                winTP.hide();
            else {
                tfDenominacionTP.markInvalid(labels.lbCampoVacio);
            }
        }else{
            formTP.baseParams.idtipoprocesoevaluativo = idtipoprocesoevaluativo;
            if(dfFechaInicioTP.getRawValue() != dfFechaFinTP.getRawValue()){
                if(formTP.getForm().isValid()){
                    PVD.mostrarMascara('idmskguardartr', labels.lbMsgWait, labels.lbMsgSave);
                    formTP.getForm().submit({
                        url:url,
                        // waitMsg:msgForm,
                        failure: function(form, action)
                        {
                            PVD.ocultarMascara('idmskguardartr');
                            if(action.result.rcodMsg == 1){

                                mostrarMensaje(1,action.result.mensaje);

                                    if(boton == 'ACEP'){
                                        winTP.hide();
                                    }
                                    gpTP.getSelectionModel().clearSelections();
                                    st_TP.removeAll();
                                    st_TP.load({
                                        params:{
                                            limit:15,
                                            start:0
                                        },
                                        callback:function(){
                                            gpTP.getSelectionModel().selectFirstRow();
                                        }
                                    });
                                    if(accion == 'ADD' || accion == 'MOD'){
                                        LimpiarFormTP();
                                    }

                            }else if(action.result.rcodMsg == 3) mostrarMensaje(3,'Ya existe un proceso evaluativo con esa denominación');

                        }
                    });
                }//isValid()
            }else {
                mostrarMensaje(3,labels.lbFechasiguales);
            }
        }
        cambio = 0;
    }
    var kmIindicadorTexto = [{
        key: 'i',
        alt:true,
        fn: function(){
            btnAdicionarTP.handler();
        }
    },{
        key: 'm',
        alt:true,
        fn: function(){
            if(!btnModificarTP.disabled ){
                btnModificarTP.handler();
            }
        }
    },{
        key: 46,
        fn: function(){
            if(!btnEliminarTP.disabled ){
                btnEliminarTP.handler();
            }
        }
    },{
        key: 'b',
        alt:true,
        fn: function(){
            if(!btnBuscar.disabled ){
                btnBuscar.handler();
            }
        }
    },{
        key: 'l',
        alt:true,
        fn: function(){
            if(!btnLimpiar.disabled ){
                btnLimpiar.handler();
            }
        }
    },{
        key: 'h',
        alt:true,
        fn: function(){
            btnAyudaTP.handler();
        }
    }
    ];

    var pContenedor = new Ext.Panel({
        tbar: [btnAdicionarTP, btnModificarTP, btnEliminarTP, '->', btnAyudaTP],
        layout:'border',
        region:'center',
        keys: kmIindicadorTexto,
        items: [gpTP, pFiltros]
    });
    pContenedor.on('render', function(cmp){
        btnAdicionarTP.focus();
    });

    vpTP = new Ext.Viewport({
        layout:'border',
        items:[pContenedor]
    });

    st_TP.load({
        params:{
            limit:15,
            start:0
        },
        callback:function(){
            gpTP.getSelectionModel().selectFirstRow();
        }
    });

    mascaraTP = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Enviando datos al servidor'
    });	//lbMaskElimTP
    mascaraTP.enable();
}
