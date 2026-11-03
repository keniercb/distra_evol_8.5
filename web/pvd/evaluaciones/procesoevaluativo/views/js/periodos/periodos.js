Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('periodos', cargarInterfaz);
//Botones
var btnAdicionarPeriodo, btnModificarPeriodo, btnAyudaPeriodo, btnEliminarPeriodo;
var btnCancelarPeriodo, btnAplicarPeriodo, btnAceptarPeriodo;
//Tool bar, Rtores, plugin expander, y columnModel
var tbPeriodo, st_Periodo,expanderPeriodo,colummodel, ptPeriodo, arrayMedidaTiempo, storeMedidaTiempo;
//Grids y el viewPort
var gpPeriodo, vpPeriodo;
//Formularios
var formPeriodo;
//Windows
var winPeriodo;
//Combos
var tfDenominacionPeriodo, dfFechaInicioPeriodo, dfFechaFinPeriodo, heDescripcionPeriodo;
//FECHA
var fecha = new Date();
//GENERAL
var accion = 'ADD';
var mascaraPeriodo;
var fecha = new Date();
var cambio = 0;

//**************************************************Validar rango fechas*****************************************
Ext.apply(Ext.form.VTypes, {
    daterange : function(val, field) {
        var date = field.parseDate(val);

        if(!date){
            return;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = Ext.getCmp(field.startDateField);
            start.setMaxValue(date);            
            this.dateRangeMax = date;
            start.validate();
        }
        else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = Ext.getCmp(field.endDateField);
            end.setMinValue(date);
            this.dateRangeMin = date;
            end.validate();
            
        }
        return true;
    }	
});
//**************************************Principal function**********************************************************************
function cargarInterfaz(){
    perfil = arguments[0];
    labels = arguments[1];
    
    var btnBuscar = new Ext.Button({
        iconCls: 'buscar',
        id: 'btn_Buscar',
        tooltip: labels.tpBtnBuscar,
        text: labels.lbBtnBuscar,
        handler: function(){
            st_Periodo.load({
                params:{
                    filtro: Ext.getCmp('inputNombrePeriodo').getValue(),
                    limit:15, 
                    start:0
                }, 
                callback:function(){
                    gpPeriodo.getSelectionModel().selectFirstRow();
                }
            });
        }
    });

    var btnLimpiar= new Ext.Button({
        tooltip: labels.ttpBtnLimpiar,
        id: 'btnLimpiar',
        iconCls: 'limpiar',
        tooltip: labels.tpBtnLimpiar,
        text: labels.lbBtnLimpiar,
        handler: function(){
            Ext.getCmp('inputNombrePeriodo').reset();
            st_Periodo.load({
                    params: {
                        limit: 15,
                        start: 0
                    }
                });

        },
        nextTab:'adicionarPeriodo',
        prevTab:'btn_Buscar'
    });

    var btnAyudaTP = new Ext.Button({
        id: 'btnAyudaPeriodos',
        text:labels.lbBtnAyuda,
        tooltip:labels.tpBtnAyuda,
        iconCls:'ayuda',
        /*handler : function(){
            var title	= 'Ayuda del sistema de evaluaciones';
            var referencia	= 'evaluaciones/periodos';
            help.show(title,referencia);
        },*/
        nextTab:'inputNombrePeriodo',
        prevTab:'eliminarPeriodo'
    });

    btnAdicionarPeriodo = new Ext.Button({
        id: 'adicionarPeriodo',
        text:labels.lbBtnAdicionar,
        tooltip:labels.lbToolTipAdicionarPeriodo,
        iconCls:'adicionar',
        handler : function(){
            accion = 'ADD';

            VentanaPeriodo(accion);
        },
        prevTab:'btnLimpiar',
    });
  
    btnModificarPeriodo = new Ext.Button({
        id: 'modificarPeriodo',
        text:labels.lbBtnModificar,
        tooltip:labels.lbToolTipModificarPeriodo,
        disabled: true,
        iconCls: 'modificar',
        handler : function(){
            accion = 'MOD';
            VentanaPeriodo(accion);
        }
    });
	
    btnEliminarPeriodo = new Ext.Button({
        id: 'eliminarPeriodo',
        text:labels.lbBtnEliminar,
        tooltip:labels.lbToolTipEliminarPeriodo,
        disabled: true,
        iconCls: 'eliminar',
        handler : function(){
            mostrarMensaje(2,labels.lbBtnMsgEliminarD,function(btn){				
                if(btn == "ok"){					
                    PVD.mostrarMascara('idmskeliminar', labels.lbMsgWait, labels.lbMaskElimPeriodo); 
                    var idperiodo=gpPeriodo.getSelectionModel().getSelected().get('idperiodoevaluativo');                                                  				  
                    Ext.Ajax.request({
                        url: 'eliminarperiodo',
                        method:'POST',
                        params: {
                            idperiodo: idperiodo
                        },
                        callback: function (options,success,response){
                                responseData = Ext.decode(response.responseText);
                                PVD.ocultarMascara('idmskeliminar');
                             if (responseData.exception == 1) {
                                Ext.MessageBox.show({
                                    title: 'Información',
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.INFO,
                                    msg: labels.lbConceptoEnUso,
                                    fn: function() {
                                        btnAdicionarPeriodo.focus();
                                    }
                                });
                            } 
                            else {
                            mostrarMensaje(responseData.rcodMsg,responseData.mensaje, function(btn){
                                st_Periodo.load({
                                    params:{
                                        limit:15, 
                                        start:0
                                    }, 
                                    callback:function(){
                                        gpPeriodo.getSelectionModel().selectFirstRow();
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


    expanderPeriodo = new Ext.grid.RowExpander({
        tpl : new Ext.Template(	
            '<p><b>Fecha inicio: </b> {fechainicio} <br> <b>Fecha fin:</b>  {fechafin}</p>'		
            )
    });

    st_Periodo = new Ext.data.Store({
        url: 'todosperiodos',
        reader:new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "idperiodoevaluativo"
        }, [{
            name: 'idperiodoevaluativo'
        },

        {
            name: 'periodo'
        },

        {
            name: 'medidatiempo'
        },

        {
            name: 'fechainicio'
        },

        {
            name: 'fechafin'
        }
        ])
    });  

    colummodel = [{
        id:'expandir', 
        header: labels.lbPeriodo , 
        sortable: true, 
        width: 250, 
        dataIndex: 'periodo'
    },
    {
        header: labels.lbMedidaTiempo, 
        width: 120, 
        sortable: true, 
        dataIndex: 'medidatiempo', 
        renderer: MostrarMedidasTiempo
    },
    {
        header: 'Fecha inicio' , 
        sortable: true, 
        width: 90, 
        dataIndex: 'fechainicio'
    },
    {
        header: 'Fecha fin' , 
        sortable: true, 
        width: 90, 
        dataIndex: 'fechafin'
    },
			
    ];
		
    ptPeriodo = new Ext.PagingToolbar({
        pageSize: 15,
        store: st_Periodo,
        displayInfo: true,
        displayMsg: labels.lbPaginToolBar                  
    });

    tbPeriodo = new Ext.Toolbar({
        id: 'tbPeriodo', 
        items:[btnAdicionarPeriodo, btnModificarPeriodo, btnEliminarPeriodo, '->', btnAyudaTP]
    });	

    tfDenominacionPeriodo = new Ext.form.NumberField({
        fieldLabel: labels.lbPeriodo,
        name: 		'periodo',
        id: 		'periodo',
        anchor:		'95%',  
        allowNegative:	false,
        allowDecimals:	false,
        allowBlank:	false,	
        maxValue : 100000,
        blankText:	labels.lbCampoVacio,
        listeners: {  
            change: function(){
                cambio = 1;
            }	
        },
        prevTab:'btnAceptarPeriodo',
		nextTab:'medidatiempo',
    });

    dfFechaInicioPeriodo = new Ext.form.DateField({
        fieldLabel: labels.lbFechaInicio,
        name: 'fechainicio',
        id: 'fechainicio',
        value: fecha.format('d/m/Y'),
        format:'d/m/Y',
        width: 176,
        vtype: 'daterange',
        endDateField: 'fechafin',	
        allowBlank:false,
        invalidText: labels.lbToolTipFecha,
		prevTab:'medidatiempo',
		nextTab:'fechafin',
        listeners: {  
            change: function(){ 	
                cambio = 1;								 
            }  
        } 
    });

    dfFechaFinPeriodo = new Ext.form.DateField({
        fieldLabel: labels.lbFechaFin,
        name: 'fechafin',
        id: 'fechafin',
        format:'d/m/Y',
        editable: false,	
        width: 176,
        vtype: 'daterange',
        startDateField: 'fechainicio',
        invalidText: labels.lbToolTipFecha,
		prevTab:'fechainicio',
		nextTab:'cancelarperiodo',
        listeners: {  
            change: function(){ 	
                cambio = 1;								 
            }  
        }   
    });

    arrayMedidaTiempo = [['0','Día'], ['1','Mes'], ['2','Año']];
    storeMedidaTiempo = new Ext.data.SimpleStore({
        fields: [{
            name: 'valor'
        },{
            name: 'tipo'
        }]
    });
    storeMedidaTiempo.loadData(arrayMedidaTiempo);

    heDescripcionPeriodo = new Ext.form.ComboBox({
        //name:'medidatiempo',
        id:'medidatiempo',
        hiddenName : 'tipo',
        typeAhead: true,
        triggerAction: 'all',
        displayField: 'tipo',
        valueField: 'valor',
        forceSelection: true,
        azyRender:true,
        anchor:'95%',
        store: storeMedidaTiempo,
        editable: false,
        mode: 'local',
        //emptyText: 'Seleccione...',
        allowBlank:false,
        blankText: labels.lbCampoVacio,
        fieldLabel: labels.lbMedidaTiempo,
		prevTab:'periodo',
		nextTab:'fechainicio',
        listeners: {
            change: function(){ 	
                cambio = 1;								 
            }  
        }
    });

    formPeriodo = new Ext.form.FormPanel({
        labelAlign: 'top',
        frame:true,	
        baseParams:{
            idperiodo: -1
        },
        autoHeight:true,
        autoShow:true,
        items: [{
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                items: [tfDenominacionPeriodo, dfFechaInicioPeriodo]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [heDescripcionPeriodo, dfFechaFinPeriodo]
            }]
        }]
    });

    btnCancelarPeriodo = new Ext.Button({
	    id:'cancelarperiodo',
        iconCls:'cancelar',
        text:labels.lbtnCancelarR,
        tooltip:labels.lbToolTipCancelar,
        handler: function(){
            winPeriodo.hide();
            LimpiarFormPeriodo();			
            cambio = 0;
        }		
        		
    });

    btnAplicarPeriodo = new Ext.Button({
        id: 'btnAplicarPeriodo',
        iconCls:'aplicar',
        text:labels.lbtnAplicarR, 
        tooltip:labels.lbToolTipAplicar,
        handler: function(){
            RealizarAccion( accion, 'APLI');
        }			
    });

    btnAceptarPeriodo = new Ext.Button({
        id:'btnAceptarPeriodo',
        iconCls:'aceptar',
        text:labels.lbtnAceptarR,  
        tooltip:labels.lbToolTipAceptar,		
        handler: function(){
            RealizarAccion( accion, 'ACEP');
        },
        nextTab:'periodo',
        prevTab:'btnAplicarPeriodo'
    });

    var keysP= [{
        key: 'x',
        alt: true,
        fn: function() {
            if (!btnCancelarPeriodo.hidden) {
                btnCancelarPeriodo.handler();
            }
        }
    }, {
        key: 'p',
        ctrl: true,
        alt: true,
        fn: function() {
            if (!btnAplicarPeriodo.hidden) {
                btnAplicarPeriodo.handler();
            }
        }
    }, {
        key: Ext.EventObject.ENTER,
        fn: function() {
            if (!btnAceptarPeriodo.hidden) {
                btnAceptarPeriodo.handler();
            }
        }
    }
    ];

    function LimpiarFormPeriodo(){
        formPeriodo.getForm().reset();
        tfDenominacionPeriodo.setValue('');
        heDescripcionPeriodo.setValue('');
        //dfFechaInicioPeriodo.setValue('');
        dfFechaFinPeriodo.setValue('');
    }

    function VentanaPeriodo(accion){
        var record;
        if(accion == 'ADD'){
            // LimpiarFormPeriodo(); 
            formPeriodo.getForm().reset();           
            winPeriodo.setTitle(labels.lbAdicionarPeriodo);
            dfFechaInicioPeriodo.setValue(fecha.format('d/m/Y'));
            Ext.getCmp('btnAplicarPeriodo').show();
            winPeriodo.show(this);		
        }else{
            record = gpPeriodo.getSelectionModel().getSelected();
            tfDenominacionPeriodo.setValue(record.get('periodo'));
            heDescripcionPeriodo.setValue(record.get('medidatiempo'));
            dfFechaInicioPeriodo.setValue(record.get('fechainicio'));
            dfFechaFinPeriodo.setValue(record.get('fechafin'));
            winPeriodo.setTitle(labels.lbModificarPeriodo);
            Ext.getCmp('btnAplicarPeriodo').hide();
            winPeriodo.show();
        }
    }		


    winPeriodo = new Ext.Window({
        title:labels.lbCrearPeriodo,    
        layout:'fit',	
        modal: true,
        keys:keysP,
        closable:true,	
        resizable:false, 
        closeAction: 'hide',
        width:400,
        autoHeight:true,    
        items:[formPeriodo],
        buttons: [btnCancelarPeriodo, btnAplicarPeriodo,btnAceptarPeriodo]
    });

    winPeriodo.on('show', function(cmp){
        tfDenominacionPeriodo.focus(true, 300);
    });
    winPeriodo.on('hide', function(cmp){
        btnAdicionarPeriodo.focus();
    });

    gpPeriodo = new Ext.grid.GridPanel({
        id:'idPeriodo',
        title: labels.lbgpPeriodo,	
        columns: colummodel,
        stripeRows: true,
        autoRcroll:true,
        plugins: expanderPeriodo,
        store: st_Periodo,
        autoExpandColumn:'expandir',
        loadMask:{
            msg :labels.lbGridLoadMask
        },
        region:'center',
        padding:'0 0 0 0',
        margins: '0 5 5 5',
        width: '50%', 
        sm: new Ext.grid.RowSelectionModel({  
            singleSelect: true,  
            listeners: {  
                rowselect: function(sm, row, rec){ 	
                    //st_R.load({params:{idperiodo: rec.data.idperiodo, limit:15, start:0}, callback:function(){gpR.getSelectionModel().selectFirstRow();}});
                    Ext.getCmp('eliminarPeriodo').enable();
                    Ext.getCmp('modificarPeriodo').enable();
								 
                }  
            }  
        }),      
        bbar: ptPeriodo
    });

    gpPeriodo.on('render', function(cmp){
        btnAdicionarPeriodo.focus();
    });

    function RealizarAccion(accion, boton){

        var url = 'adicionarperiodo', msgForm = labels.lbWaitMsgAddPeriodo; 
        var idperiodo = -1;
  
        if(accion == 'ADD'){
            url = 'adicionarperiodo';
            msgForm = labels.lbWaitMsgAddPeriodo;
        }
        else{
            msgForm = labels.lbWaitMsgModPeriodo;
            idperiodo = gpPeriodo.getSelectionModel().getSelected().get('idperiodoevaluativo');	
            url = 'modificarperiodo';
        }
        if(cambio == 0) {	
            if(accion == 'MOD') 
                winPeriodo.hide(); 
            else {
                tfDenominacionPeriodo.markInvalid(labels.lbCampoVacio); 
            }
        }else{
            formPeriodo.baseParams.idperiodo = idperiodo;	
            formPeriodo.baseParams.medidatiempo = heDescripcionPeriodo.getValue();
            if(dfFechaInicioPeriodo.getRawValue() != dfFechaFinPeriodo.getRawValue()){ 
                if(formPeriodo.getForm().isValid()){
                    PVD.mostrarMascara('idmskguardar', labels.lbMsgWait, labels.lbMsgSave);
                    formPeriodo.getForm().submit({
                        url:url,			
                        failure: function(form, action)
                        {
                            PVD.ocultarMascara('idmskguardar');
                            if(action.result.rcodMsg == 1){
                                mostrarMensaje(action.result.rcodMsg,action.result.mensaje,function(){
						
                                    if(boton == 'ACEP'){
                                        winPeriodo.hide();
                                    }
													
                                    gpPeriodo.getSelectionModel().clearSelections();
                                    st_Periodo.removeAll();
                                    st_Periodo.load({
                                        params:{
                                            limit:15, 
                                            start:0
                                        }, 
                                        callback:function(){
                                            gpPeriodo.getSelectionModel().selectFirstRow();
                                        }
                                    });					
						   	
                                    if(accion == 'ADD'){
                                        LimpiarFormPeriodo();
                                    }
                                });
                            }else if(action.result.rcodMsg == 3) mostrarMensaje(action.result.rcodMsg,action.result.mensaje);
                            else if(action.result.codMsg == 4)
                                mostrarMensaje(4,'El per&iacute;odo que quiere adicionar ya existe')
                        }
                    });
                }
            }else{
                mostrarMensaje(3,labels.lbFechasiguales);
            }
        }
        cambio = 0;	
    }

    function MostrarMedidasTiempo(medidatiempo){
	
        switch(medidatiempo){
            case '0' :
                medidatiempo = 'D&iacute;a';
                break;
            case '1' :
                medidatiempo = 'Mes';
                break;
            case '2' :
                medidatiempo = 'A&ntilde;o';
                break;
        }
        return medidatiempo;
    }

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
        height:63,
        autoScroll:true,
        autoShow:true,
        region:'north',
        items: [{
            columnWidth:.3,
            layout: 'form',
            items:[{
                xtype: 'numberfield',
                id: 'inputNombrePeriodo',
                allowNegative: false,
                allowDecimals: false,
                maxValue : 100000,
                anchor: '95%',
                fieldLabel: labels.lbPeriodo,
                emptyText: labels.lbEmptyTextBuscar,
                listeners: {
                    specialkey: function(field, e){			
                        if (e.getKey() == e.ENTER) {
                            btnBuscar.handler();
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
    var kmIindicadorTexto = [{
        key: 'i', 
        alt:true,
        fn: function(){
            btnAdicionarPeriodo.handler();
        }
    },{
        key: 'm', 
        alt:true,
        fn: function(){
            if(!btnModificarPeriodo.disabled ){
                btnModificarPeriodo.handler();
            }
        }
    },{
        key: 46,
        fn: function(){
            if(!btnEliminarPeriodo.disabled ){
                btnEliminarPeriodo.handler();
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
        bodyBorder:false,
        cls: 'x-toolbar',
        tbar: tbPeriodo,
        region:'center',
        layout:'border',
        keys:kmIindicadorTexto,
        items: [pFiltros, gpPeriodo]
    });


    vpPeriodo = new Ext.Viewport({
        layout:'border',
        defaults: {
            split: true    
        },
        items:[pContenedor]
    });

    st_Periodo.load({
        params:{
            limit:15, 
            start:0
        }, 
        callback:function(){
            gpPeriodo.getSelectionModel().selectFirstRow();
        }
    });

}
