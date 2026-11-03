Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('valorescualitativos', cargarInterfaz);	

//BOTONES
var btnAdicionarVCualitativo, btnEliminarVCualitativo, btnModificarVCualitativo, btnAyuda
//STORES, CM, ARRAY, FIELDS
var smValores;
var expandervCualitativo, storevCualitativo, cmvCualitativo, pagingvCualitativo
//TOOLS y PAGGINGS BARS
var tbvCualitativo, gpvCualitativo
//CONTENEDORES
//TEXT, COMBOS, AREAS, OTROS
var tfvalor, tfdescripc, tfbusqueda;
//VENTANAS y FORMULARIOS
var winInsValorC, winModValorC;
//FECHA


//*************************************************  VTYPE DATERANGE  *****************************************************************************

Ext.apply(Ext.form.VTypes, {
    daterange : function(val, field) {
        var date = field.parseDate(val);
        if(!date){
            return;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = Ext.getCmp(field.startDateField);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;
        } 
        else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = Ext.getCmp(field.endDateField);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }
        return true;
    }
});


function cargarInterfaz(){
    perfil = arguments[0];
    labels = arguments[1];
    //----------------------------------------------------------------------------------------  GRID PRINCIPAL  ----------------------------------------------------------------------------------------------
    var btnBuscar = new Ext.Button({
        iconCls: 'buscar',
        id: "btn_Buscar",    
        text:labels.lbBtnBuscar,
        tooltip:labels.ttipbtn_Buscar,
        handler: function(){
            buscarValores(Ext.getCmp('tfbusqueda').getValue());
        }
    });

    var btnLimpiar= new Ext.Button({
        id: 'btnLimpiar',
        iconCls: 'limpiar',
        text: labels.lbBtnLimpiar,
        tooltip:labels.ttipbtn_Limpiar,
        handler: function(){
            Ext.getCmp('tfbusqueda').reset();
        }
    });

    tfbusqueda = new Ext.form.TextField({
        id:'tfbusqueda',
        name: 'tfbusqueda',
        width:150,
        minLength: 3,
        maxLength: 100,
        anchor: '95%',
        fieldLabel: labels.lbDenominacion,
        emptyText: labels.lbEmptyTextBuscar,
        maskRe:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]*)+$/,				
        mode:'local',
        enableKeyEvents:true,
        listeners:{
            'keyup':function(textField, eventoObject){
                if(eventoObject.getCharCode() == 13){
                    buscarValores(Ext.getCmp('tfbusqueda').getValue());
                } 
            }
        }
    });


    storevCualitativo = new Ext.data.Store({
        url: 'devolvervalorescualitativos',
        reader:new Ext.data.JsonReader({
            totalProperty: "cant",
            root: "datos",
            id: "idvalorescualitativos" 
        }, [{
            name: 'idvalorescualitativos'
        },

        {
            name: 'denom'
        },

        {
            name: 'descripcion'
        },	

        {
            name: 'desde'
        },

        {
            name: 'hasta'
        }
        ])
    });

    expandervCualitativo = new Ext.grid.RowExpander({
        tpl : new Ext.Template(		
            '<p><b>Descripci&oacute;n:</b> {descripcion}</p>'
            )
    });

    cmvCualitativo = [expandervCualitativo
    ,{
        id:'denom', 
        header: labels.lbDenomVCualitativo,	
        width: 250, 
        sortable: true,	
        dataIndex: 'denom'
    }
    ,{
        header: labels.lbdfFIVCualitativo,	
        sortable: true,	
        dataIndex: 'desde'
    }
    ,{
        header: labels.lbdfFFVCualitativo,	
        sortable: true,	
        dataIndex: 'hasta'
    }						
    ];

    pagingvCualitativo = new Ext.PagingToolbar({
        pageSize: 10,
        store: storevCualitativo,
        displayInfo: true,
        items:['-']
    });

    var btnAyudaTP = new Ext.Button({
        id: 'btnAyudaValorescualitativos',
        text:labels.lbBtnAyuda,
        tooltip:labels.lbToolTipBtnAyuda,
        iconCls:'ayuda'
       /* handler : function(){
            var title	= 'Ayuda del sistema de evaluaciones';
            var referencia	= 'evaluaciones/valcualitativos';
            help.show(title,referencia);
        }*/
    });			

    btnAdicionarVCualitativo = new Ext.Button({
        id: 'btnAdicionarVCualitativo',
        text:labels.lbBtnAdicionarVCualitativo,
        tooltip:labels.ttBtnAdicionarVCualitativo,
        iconCls:'adicionar',
        handler : function(){
            gestionarValoresCualitativos('AD');
        }
		
    });
  
    btnModificarVCualitativo = new Ext.Button({
        id: 'btnModificarVCualitativo',
        text:labels.lbBtnModificarVCualitativo,
        tooltip:labels.ttBtnModificarVCualitativo,
        iconCls: 'modificar',
        disabled:true,
        handler : function(){
            gestionarValoresCualitativos('MOD');
        }
    });
	
    btnEliminarVCualitativo = new Ext.Button({
        id: 'btnEliminarVCualitativo',
        text:labels.lbBtnEliminarVCualitativo,
        tooltip:labels.ttBtnEliminarVCualitativo,
        iconCls: 'eliminar',
        disabled:true,
        handler : function(){
            eliminarvalorCualitativo();
        }
    });   

 
    tbvCualitativo = new Ext.Toolbar({
        id: 'tbvCualitativo', 
        items:[btnAdicionarVCualitativo, btnModificarVCualitativo, btnEliminarVCualitativo, '->', btnAyudaTP]
    });
    smValores = new Ext.grid.RowSelectionModel({  
        singleSelect: true,  
        listeners: {  
            rowselect: function(sm, row, rec) {
                btnModificarVCualitativo.enable();
                btnEliminarVCualitativo.enable();
            }
        }  
    });
					 
    gpvCualitativo = new Ext.grid.GridPanel({
        id:'gpvCualitativo',
        title: labels.gpvCualitativoTitle,
        region: 'center',	
        columns: cmvCualitativo,
        stripeRows: true,
        autoScroll:true,
        border: true,
        store: storevCualitativo,
        plugins: expandervCualitativo,
        autoExpandColumn:'denom',
        loadMask:{
            msg :labels.cargando
        },
        margins: '0 5 5 5',
        sm: smValores,
        bbar: pagingvCualitativo
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
            columnWidth:.3,
            layout: 'form',
            items:[tfbusqueda]
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
            btnAdicionarVCualitativo.handler();
        }
    },{
        key: 'm', 
        alt:true,
        fn: function(){
            if(!btnModificarVCualitativo.disabled ){
                btnModificarVCualitativo.handler();
            }
        }
    },{
        key: 46,
        fn: function(){
            if(!btnEliminarVCualitativo.disabled ){
                btnEliminarVCualitativo.handler();
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
        tbar: tbvCualitativo,
        region:'center',
        layout:'border',
        keys:kmIindicadorTexto,
        items: [pFiltros, gpvCualitativo]
    });
    pContenedor.on('render', function(p){
        btnAdicionarVCualitativo.focus();
    });

    vpvCualitativo = new Ext.Viewport({
        layout:'border',
        items:[pContenedor]			
    });

    storevCualitativo.load({
        params:{
            limit:10, 
            start:0
        }
    });	
//, callback:function(){gpvCualitativo.getSelectionModel().selectFirstRow();}
}


