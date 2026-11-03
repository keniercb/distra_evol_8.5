Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('indicadores', cargarInterfaz);

//BOTONES
var btnAdicionarIT, btnModificarIT, btnEliminarIT, btnAyudaIT, btnAyudaII, btnCancelarIT, btnAplicarIT,
btnAceptarIT, btnCancelarDominio, btnAceptarDominio;
//STORES, CM, ARRAY, FIELDS
var expanderIndicadorT, storeIndicadorT, cmIndicadorT, storeRecurso, cmRecurso, smRecurso;
//TOOLS y PAGGINGS BARS
var pagingIndicadorT, tbIndicadorT, tbBuscarIndicadorT, pagingRecurso;
//CONTENEDORES
var gpIndicadorT, gpRecurso, viewport;
//TEXT, COMBOS, AREAS, OTROS
var tfcodIndicadorT, tfdenomIndicadorT, tfdomIndicadorT, dfFIIndicadorT, dfFFIndicadorT, heDescripcionIndicadorT,
cargadorDominio, tpDominio, raizDominio, tfDenomIT;
//VENTANAS y FORMULARIOS
var fpIndicadorT, winIndicadorT, winDominio;
//FECHA
var fecha = new Date();
//GENERAL
var SelectorImagen;
var idimagen, record;
var accionIT, accionII;
var idDominio = -1;
var accion, boton, nombretemp, extension = '.jpg';
var plantillaTemp = new Ext.XTemplate(
    '<div class="details">',
    '<tpl for=".">',
    '<img src="{imagen}" height=100 width=120 /><div class="details-info">',
    '</tpl>',
    '</div>'
    );
plantillaTemp.compile();


//***********************************************************************************************************************************

function cargarInterfaz(){
    perfil = arguments[0];
    labels = arguments[1];
    
     var btnExportar = new Ext.Button({
            id: this.id + 'btnExportar',
            text: 'Exportar',
            tooltip: 'Exportar indicador de texto (<b>Alt+E</b>)',
            iconCls: 'exportar',
            handler: function() {				
                var win = new Ext.components.winReporte({                   
                    params: {
                        url: 'obtenerreporte',
						tiporeporte:'listnomenclador',
                        columns:getHeader(),
                        params:{							
							limit:15,
							start:0
						}
                    }
                });
                win.show();
            }		
        });


    var btnBuscar = new Ext.Button({
        iconCls: 'buscar',
        id: "btn_Buscar",
        tooltip: 'Buscar indicador de texto (<b>Alt+B</b>)',
        text: labels.lbBtnBuscar,
        handler:function(){
            BuscarIndicadorTPorDenom(tfDenomIT.getValue())
        }
    });

    var btnLimpiar= new Ext.Button({
        tooltip: 'Limpiar filtros (<b>Alt+L</b>)',
        id: 'btnLimpiar',
        iconCls: 'limpiar',
        text: labels.lbBtnLimpiar,
        handler: function(){
            tfDenomIT.reset();
            BuscarIndicadorTPorDenom(tfDenomIT.getValue())
        },
        nextTab:'btnAdicionarIT',
        prevTab:'btn_Buscar'
    });
    //--------------------------------------------------------------------------  GRID INDICADORES TEXTO  ----------------------------------------------------------------------------------------------

    expanderIndicadorT = new Ext.grid.RowExpander({
        tpl : new Ext.Template(
            '<p><b>Descripci&oacute;n:</b> {descripcion}</p>'
            )
    });

    storeIndicadorT = new Ext.data.Store({
        url: 'todosindicadorestexto',
        reader:new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "idindicadortexto"
        }, [{
            name: 'idindicadortexto'
        }
        ,{
            name: 'codigo'
        }
        ,{
            name: 'denom'
        }
        ,{
            name: 'descripcion'
        }
        ,{
            name: 'fechainicio'
        }
        ,{
            name: 'fechafin'
        }
        ,{
            name: 'iddominioevaluativo'
        }
        ])
    });

    cmIndicadorT = [expanderIndicadorT
    ,{
        id:'denom',
        header: labels.lbDenominacion,
        sortable: true,
        dataIndex: 'denom',
        maxLength: 255

    },{
        id:'cod',
        header: labels.lbCodigo,
        sortable: true,
        dataIndex: 'codigo'
    },{
        id:'descrip',
        hidden: true,
        width: 150,
        dataIndex: 'descripcion'
    }
    ,{
        id:'fi',
        header: 'Fecha inicio',
        width: 90,
        dataIndex: 'fechainicio'
    }
    ,{
        id:'ff',
        header: 'Fecha fin',
        width: 90,
        dataIndex: 'fechafin'
    }
    ];

    pagingIndicadorT = new Ext.PagingToolbar({
        pageSize: 15,
        store: storeIndicadorT,
        displayInfo: true,
        items:['-']
    });

    var btnAyudaTP = new Ext.Button({
        id: 'btnAyudaIndicadores',
        text:labels.btnAyuda,
        tooltip:labels.lbToolTipBtnAyuda,
        iconCls:'ayuda'
    });

    btnAdicionarIT = new Ext.Button({
        id: 'btnAdicionarIT',
        text:labels.btnAdicionar,
        tooltip:labels.lbToolTipBtnAdicionarIT,
        iconCls:'adicionar',
        handler : function(){
            accionIT = 'ADD';
            VentanaIndicadorT(accionIT);
        },
        prevTab:'btnLimpiar',
    });

    btnModificarIT = new Ext.Button({
        id: 'btnModificarIT',
        text:labels.btnModificar,
        tooltip:labels.lbToolTipBtnModificarIT,
        iconCls: 'modificar',
        disabled:true,
        handler : function(){
            accionIT = 'MOD';
            VentanaIndicadorT(accionIT);
        }
    });

    btnEliminarIT = new Ext.Button({
        id: 'btnEliminarIT',
        text:labels.btnEliminar,
        tooltip:labels.lbToolTipBtnEliminarIT,
        iconCls: 'eliminar',
        disabled:true,
        handler : function(){
            mostrarMensaje(2,labels.mensajeEliminar,function(btn){
                if(btn == "ok"){
                    PVD.mostrarMascara('idmskeliminarr', labels.lbMsgWait, labels.lbMaskElimI);
                    Ext.Ajax.request({
                        url: 'eliminarindicadortexto',
                        method:'POST',
                        params: {
                            idindicadortexto:gpIndicadorT.getSelectionModel().getSelected().get('idindicadortexto')
                        },
                        callback: function (options,success,response){
                            responseData = Ext.decode(response.responseText);
                            PVD.ocultarMascara('idmskeliminarr');                            
                            if (responseData.exception) {

                                mostrarMensaje(1,'El indicador de texto ha sido eliminado satisfactoriamente.');
                            storeIndicadorT.load({
                                    params:{
                                        limit:15,
                                        start:0
                                    },
                                    callback:function(){
                                        gpIndicadorT.getSelectionModel().selectFirstRow();
                                       }
                                    });
                            } else{
                                storeIndicadorT.load({
                                    params:{
                                        limit:15,
                                        start:0
                                    },
                                    callback:function(){
                                        gpIndicadorT.getSelectionModel().selectFirstRow();
                                       }
                                    });
                            }
                        }
                    });
                }
            });
        }
    });


    tfDenomIT = new Ext.form.TextField({
        id: 'tfDenomIT',
        fieldLabel: labels.lbDenominacion,
        name: 'denom',
        anchor:'95%',
        maxLength: 255,
		//maskRe : /^([a-zA-ZáéíóúñüÑ\d\s]?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
		//regex : /^([a-zA-ZáéíóúñüÑ\d\s]?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,

		regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ]*)+([a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]*)+$/,
        emptyText: 'Criterio a buscar...',//labels.emptyTextBuscar,
        listeners: {
            specialkey: function(field, e){
                if (e.getKey() == e.ENTER) {
                    btnBuscar.handler();//LLamar al boton
                }
            }
        }

    });

    tbIndicadorT = new Ext.Toolbar({
        id: 'tbIndicadorT',
        items:[btnAdicionarIT, btnModificarIT, btnEliminarIT,btnExportar, '->', btnAyudaTP]
    });

    gpIndicadorT = new Ext.grid.GridPanel({
        title: 'Listado de indicadores de texto',
        id:'gpIndicadorT',
        region: 'center',
        columns: cmIndicadorT,
        stripeRows: true,
        autoScroll:true,
        border: true,
        store: storeIndicadorT,
        plugins: expanderIndicadorT,
        autoExpandColumn:'denom',
        loadMask:{
            msg :labels.cargando
        },
        minSize: '50%',
        maxSize: '50%',
        padding:'0 0 0 0',
        margins: '0 5 5 5',
        width: '50%',
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function(sm, row, rec) {
                    btnModificarIT.enable();
                    btnEliminarIT.enable();
                }
            }
        }),
        bbar: pagingIndicadorT
    });

    //-----------------------------------------------------------------------  VENTANA RECURSOS y DOMINIOS ----------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------  RECURSOS ----------------------------------------------------------------------------------------------
    storeRecurso= new Ext.data.Store({
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
            name: 'fechainicio'
        },

        {
            name: 'fechafin'
        }
        ])
    });
    storeRecurso.on('load', function(st, records, options){
        btnCancelarDominio.focus();
    });

    cmRecurso = [{
        id:'denom',
        header: labels.lbDenomRecurso,
        width: 150,
        sortable: true,
        dataIndex: 'denom'
    }
    ,{
        id:'descrip',
        hidden: true,
        width: 150,
        dataIndex: 'descripcion'
    }
    ,{
        id:'fi',
        header: 'fecha inicio',
        hidden: true,
        width: 150,
        dataIndex: 'fechainicio'
    }
    ,{
        id:'ff',
        header: 'fecha fin',
        hidden: true,
        width: 150,
        dataIndex: 'fechafin'
    }
    ];

    pagingRecurso = new Ext.PagingToolbar({
        pageSize: 10,
        store: storeRecurso,
        displayInfo: true,
        items:['-']
    });


    smRecurso = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function(sm, row, rec) {
                cargadorDominio.baseParams.idrecurso = rec.get('idrecursoevaluativo');
                cargadorDominio.baseParams.iddominio = -1;
                raizDominio.setText(rec.get('denom'));
                cargadorDominio.load(raizDominio);
                tpDominio.enable();
            }
        }
    });

    gpRecurso = new Ext.grid.GridPanel({
        id:'gpRecurso',
        title: labels.titlegpRecurso,
        region: 'center',
        columns: cmRecurso,
        stripeRows: true,
        autoScroll:true,
        border: true,
        store: storeRecurso,
        autoExpandColumn:'denom',
        loadMask:{
            msg :labels.cargando
        },
        minSize: '50%',
        maxSize: '50%',
        padding:'0 0 0 0',
        margins: '5 0 5 5',
        width: '50%',
        sm: smRecurso,
        bbar: pagingRecurso
    });

    //------------------------------------------------------------------------------------  DOMINIOS ----------------------------------------------------------------------------------------------

    cargadorDominio = new Ext.tree.TreeLoader({
        dataUrl:'cargardominio',
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
        id:'tpDominio',
        title: labels.titletpDominio,
        disabled:true,
        minSize: '50%',
        maxSize: '50%',
        region:'east',
        margins: '5 5 5 0',
        width:'50%',
        animate:true,
        border:true,
        containerScroll: true,
        rootVisible:true,
        layout:'fit',
        selModel: new Ext.tree.DefaultSelectionModel(),
        loader:cargadorDominio,
        autoScroll:true,
        listeners:{
            click:function(nodo,event){
                if(nodo.id != 'raizDominio'){
                    denomDominio = nodo.text;
                    idDominio = nodo.id;
                    btnAceptarDominio.enable();
                }else{
                    btnAceptarDominio.disable();
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

    //------------------------------------------------------------------------------------  VENTANA ----------------------------------------------------------------------------------------------

    btnCancelarDominio= new Ext.Button({
        id:'btnCancelarDominio',
        iconCls:'cancelar',
        text:labels.btnCancelar,
        //tooltip:labels.lbToolTipCancelar,
        tooltip:'Cerrar ventana sin guardar los datos (<b>Alt+X</b>)',
        handler: function(){
            winDominio.hide();
        },
        nextTab:'btnAceptarDominio'

    });
    btnAceptarDominio= new Ext.Button({
        id:'btnAceptarDominio',
        iconCls:'aceptar',
        text:labels.btnAceptar,
        //tooltip:labels.lbToolTipAceptar,
        tooltip:'Guardar datos y cerrar ventana (<b>Enter</b>)',
        disabled: true,
        handler:function (){
            tfdomIndicadorT.setValue(denomDominio);
            tfdominioIndicadorI.setValue(denomDominio);
            winDominio.hide();
        },
        prevTab:'btnCancelarDominio'

    });

    var keysIT = [{
        key: 'x',
        alt: true,
        fn: function() {
            if (!btnCancelarDominio.hidden) {
                btnCancelarDominio.handler();
            }
        }
    }, {
        key: Ext.EventObject.ENTER,
        fn: function() {
            if (!btnAceptarDominio.hidden) {
                btnAceptarDominio.handler();
            }
        }
    }
    ];

    winDominio = new Ext.Window({
        layout:'border',
        keys:keysIT,
        title: labels.titlewinDominio,
        width:900,
        height:400,
        closable:true,
        resizable:false,
        closeAction: 'hide',
        items:[gpRecurso, tpDominio],
        modal: true,
        buttons: [btnCancelarDominio, btnAceptarDominio]
    /*listeners: {
		show: function(cmp){
			alert('asd');
		},
	}*/
    });
    winDominio.on('hide', function(cmp){
        dfFIIndicadorT.focus(300, false);
    });
    winDominio.on('close', function(cmp){
        dfFIIndicadorT.focus(300, false);
    });

    //-----------------------------------------------------------------------  VENTANA ADD MOD ----------------------------------------------------------------------------------------------

    btnCancelarIT = new Ext.Button({
        id:'btnCancelarIT',
        iconCls:'cancelar',
        //tooltip:labels.lbToolTipCancelar,
        tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt+X</b>)',
        text:labels.btnCancelar,
        handler: function(){
            winIndicadorT.hide();
        }
    });
    btnAplicarIT = new Ext.Button({
        id:'btnAplicarIT',
        iconCls:'aplicar',
        hidden: true,
        text:labels.btnAplicar,
        //tooltip:labels.lbToolTipAplicar,
        tooltip: 'Guardar datos y limpiar los campos (<b>Ctrl+Alt+P</b>)',
        handler: function(){
            AddModIndicadorT(accionIT, 'APLI');
        }
    });

    btnAceptarIT = new Ext.Button({
        id:'btnAceptarIT',
        iconCls:'aceptar',
        text:labels.btnAceptar,
        tooltip: 'Guardar datos y cerrar ventana (<b>Enter</b>)',
        handler: function(){
            AddModIndicadorT(accionIT, 'ACEP');
        },
        prevTab: 'btnAplicarIT',
        nextTab:'tfdenomIndicadorT'
    });

    tfcodIndicadorT = new Ext.form.TextField({
        id: 'tfcodIndicadorT',
        fieldLabel: labels.lbCodigo,
        maxValue: 20,
        maskRe: /[0-9a-zA-Z]/,
        regex: /[0-9a-zA-Z]/,
        regexText: 'Solo admite caracteres alfanuméricos y el tamaño máximo requerido es 20 caracteres.',
        name: 'codigo',
        width: 176,
        allowBlank:false,
        maxLength: 20,
        blankText:labels.blankText,
        prevTab:'tfdenomIndicadorT'
    });

    tfdenomIndicadorT = new Ext.form.TextField({
        id: 'tfdenomIndicadorT',
        fieldLabel: labels.lbDenominacion,
        name: 'denom',
        width: 360,
        //maxLength: 255,
        allowBlank:false,
        blankText:labels.blankText,
		prevTab:'btnAceptarIT',
        //regex: /^([a-zA-ZáéíóúÁÉÍÓÚñÑ0-9_/]+ ?[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9_/]*)+$/,
        //regexText: 'Solo se admite caracteres alfanuméricos'
    });

    tfdomIndicadorT = new Ext.form.TextField({
        id: 'tfdomIndicadorT',
        fieldLabel: labels.lbDominio,
        name: 'iddominio',
        width: 176,
        allowBlank:false,
        blankText:labels.blankText,
        listeners:{
            focus: function(thisTextfield){
                winDominio.show();
                storeRecurso.load({
                    params:{
                        limit:10,
                        start:0
                    },
                    callback:function(){
                        gpRecurso.getSelectionModel().selectFirstRow();
                    }
                });
            }
        },
        nextTab:'tfdenomIndicadorT',
        prevTab:'tfcodIndicadorT'
    });

    dfFIIndicadorT = new Ext.form.DateField({
        id: 'dfFIIndicadorT',
        fieldLabel: labels.lbFI,
        name: 'fechainicio',
        width: 176,
        value: fecha.format('d/m/Y'),
        format:'d/m/Y',
        allowBlank:false,
        invalidText: labels.invalidTextFecha,
        blankText:labels.blankText,
        vtype:'daterange',
        endDateField: 'dfFFIndicadorT'
    });

    dfFFIndicadorT = new Ext.form.DateField({
        id: 'dfFFIndicadorT',
        fieldLabel: labels.lbFF,
        name: 'fechafin',
        width: 176,
        format:'d/m/Y',
        invalidText: labels.invalidTextFecha,
        vtype:'daterange',
        startDateField: 'dfFIIndicadorT'
    });

    heDescripcionIndicadorT = new Ext.form.TextArea({
        height: 90,
        width: 358,
        id:'heDescripcionT',
        name:'descripcion',
        maxLength: 255,
        fieldLabel:labels.lbDescripcionIT
    });

    fpIndicadorT = new Ext.FormPanel({
        labelAlign: 'top',
        frame:true,
        region:'center',
        width: 375,
        autoHeight:true,
        autoShow:true,
        items:[tfdenomIndicadorT,{//  tfdenomIndicadorT
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                anchor:'50%',
                items: [tfcodIndicadorT]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [tfdomIndicadorT]
            }]
        },
        {
            layout:'column',
            items:[{
                columnWidth:.5,
                layout: 'form',
                anchor:'50%',
                items: [dfFIIndicadorT]
            },{
                columnWidth:.5,
                layout: 'form',
                items: [dfFFIndicadorT]
            }]
        }, heDescripcionIndicadorT]
    });

   var keysIT = [{
        key: 'x',
        alt: true,
        fn: function() {
            if (!btnCancelarIT.hidden) {
                btnCancelarIT.handler();
            }
        }
    }, {
        key: 'p',
        ctrl: true,
        alt: true,
        fn: function() {
            if (!btnAplicarIT.hidden) {
                btnAplicarIT.handler();
            }
        }
    }, {
        key: Ext.EventObject.ENTER,
        fn: function() {
            if (!btnAceptarIT.hidden) {
                btnAceptarIT.handler();
            }
        }
    }
    ];

    winIndicadorT = new Ext.Window({
        title:'Provisional',
        layout:'fit',
        keys:keysIT,
        autoHeight: true,
        closable:true,
        resizable:false,
        closeAction: 'hide',        
        items:[fpIndicadorT],
        modal: true,
        buttons: [btnCancelarIT, btnAplicarIT, btnAceptarIT]
    });
    winIndicadorT.on('show', function(cmp){
        tfdenomIndicadorT.focus(false, 300);
    });
    winIndicadorT.on('hide', function(cmp){
        btnAdicionarIT.focus();
    });

    //---------------------------------------------------------------------------------------  GRID INDICADORES IMAGEN  -----------------------------------------------------------------------------------------
    var btnSubirImagen = new Ext.Button({
        id: 'btnSubirImagen',
        text:labels.lbBtnSubirImagen,
        tooltip:labels.lbToolTipEnv,
        iconCls:'incluir',
        disabled: false,
        handler : function(){
            if(fpImagen.getForm().isValid()){
                var valor = Ext.getCmp('tfimagen').getValue();
                extension = valor.substr(valor.lastIndexOf('.'));
                fpImagen.getForm().submit({
                    url: 'temporalimagen',
                    params: {
                        extension:extension
                    },
                    waitMsg: labels.lbEnviandoImagen,
                    success: function(formPwindow, o){
                        //Ext.getCmp('tfimagen').reset();
                        Ext.getCmp('tfimagen').setValue(valor);
                        var detalleElTemp = Ext.getCmp('img-detalle-temp-panel').body;
                        if(o.result.codigo == 1){
                            fpdatosImagen.enable();
                            nombretemp = o.result.nombretemp;
                            plantillaTemp.overwrite(detalleElTemp, o.result);
                            detalleElTemp.slideIn('l', {
                                stopFx:true,
                                duration:.5
                            });
                        }else {
                            mostrarMensaje(3, labels.ErrorDimensionImagen);
                            detalleElTemp.update('');
                        }
                    },
                    callback: function (options,success,response){
                        fpdatosImagen.enable();
                        Ext.getCmp('tfimagen').reset();
                    }
                });

            }
        }
    });

    var dfFIImagen = new Ext.form.DateField({
        id: 'dfFIImagen',
        fieldLabel: labels.lbFI,
        name: 'fechainicio',
        anchor:'90%',
        value: fecha.format('d/m/Y'),
        format:'d/m/Y',
        allowBlank:false,
        vtype:'daterange',
        invalidText: labels.invalidTextFecha,
        blankText:labels.blankText,
        endDateField: 'dfFFImagen'
    });

    var dfFFImagen = new Ext.form.DateField({
        id: 'dfFFImagen',
        invalidText: labels.invalidTextFecha,
        fieldLabel: labels.lbFF,
        name: 'fechafin',
        anchor:'90%',
        format:'d/m/Y',
        vtype:'daterange',
        startDateField: 'dfFIImagen'
    });

    var heDescripcion = new Ext.form.TextArea({
        id:'heDescripcion',
        height: 90,
        anchor:'95%',        
        maxLength:255,
        fieldLabel:labels.lbDescripcionII
    });

    var tfcodIndicadorI = new Ext.form.TextField({
        id: 'tfcodIndicadorI',
        fieldLabel: labels.lbCodigo,
        maskRe:/[0-9a-zA-Z]/,
        name: 'codigo',
        anchor:'90%',
        allowBlank:false,
        blankText:labels.blankText
    });

    var tfnombreIndicadorI = new Ext.form.TextField({
        id: 'tfnombreIndicadorI',
		regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ]*)+([a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]*)+$/,
        fieldLabel: labels.lbNombre,
        name: 'nombre',
        anchor:'95%',
        maxLength: 255,
        allowBlank:false,
        blankText:labels.blankText
    });

    var tfdominioIndicadorI = new Ext.form.TextField({
        id: 'tfdominioIndicadorI',
        fieldLabel: labels.lbDominio,
        name: 'dominioevaluativo',
        anchor:'90%',
        allowBlank:false,
        blankText:labels.blankText,
        listeners:{
            focus: function(thisTextfield){
                winDominio.show();
                storeRecurso.load({
                    params:{
                        limit:10,
                        start:0
                    },
                    callback:function(){
                        gpRecurso.getSelectionModel().selectFirstRow();
                    }
                });
            }
        }
    });

    var fpImagen = new Ext.FormPanel({
        fileUpload : true,
        frame:true,
        border : false,
        bodyBorder: false,
        id : 'fpImagen',
        labelAlign : 'top',
        labelWidth : 100,
        height: 130,
        region: 'north',
        margins: '5 5 0 5',
        bodyStyle : 'padding: 10px',
        items : [{
            layout:'column',
            items:[{
                bodyBorder : true,
                border : false,
                columnWidth:.55,
                layout: 'form',
                items: [{
                    xtype : 'fileuploadfield',
                    anchor : '100%',
                    id : 'tfimagen',
                    tooltip:labels.lbToolTipBusqImg,
                    padding:'0 0 0 0',
                    margins: '5 0 5 5',
                    emptyText : 'Seleccione...',
                    fieldLabel : labels.lbBtnImagen,
                    regex : /^.+\.(jpg|png|jpeg|gif|bmp)$/i,
                    regexText : labels.fileUploadRegexText,
                    name : 'nombreimagen',
					prevTab:'btnAceptarII',
                    buttonCfg : {
                        iconCls : 'buscar',
                        text: ''
                    }
                },btnSubirImagen]
            },{
                bodyBorder : false,
                border : false,
                columnWidth:.15,
                layout: 'form',
                items:[{
                    id: 'id-temp-panel',
                    height: 100,
                    anchor: '100%',
                    border: false
                }]
            },{
                bodyBorder : false,
                border : false,
                columnWidth:.30,
                layout: 'form',
                items:[{
                    id: 'img-detalle-temp-panel',
                    height: 100,
                    anchor: '100%',
                    border: false
                }]
            }]
        }]
    });

        
     var fpdatosImagen = new Ext.FormPanel({
        title:'Detalles',
        id : 'fpdatosImagen',
        frame:true,
        region: 'center',
        disabled:true,
        labelAlign : 'top',
        baseParams:{
            extension:extension
        },
        labelWidth : 100,
        height: 225,
        margins: '5 5 5 5',
        bodyStyle: 'padding: 10px',
                items:[tfnombreIndicadorI,{//  tfdenomIndicadorT
                    layout:'column',
                    maxLength: 255,                    
                    items:[{
                        columnWidth:.5,
                        layout: 'form',
                        anchor:'50%',
                        items: [tfcodIndicadorI]
                    },{
                        columnWidth:.5,
                        layout: 'form',
                        items: [tfdominioIndicadorI]
                    }]
                },
                {
                    layout:'column',
                    items:[{
                        columnWidth:.5,
                        layout: 'form',
                        anchor:'50%',
                        items: [dfFIImagen]
                    },{
                        columnWidth:.5,
                        layout: 'form',
                        items: [dfFFImagen]
                    }]
                }, heDescripcion]
    });



    function LimpiarForm(){
        fpImagen.getForm().reset();
        fpdatosImagen.getForm().reset();
        fpdatosImagen.disable();
        Ext.getCmp('tfimagen').setValue('');
        tfcodIndicadorI.setValue('');
        tfnombreIndicadorI.setValue('');
        tfdominioIndicadorI.setValue('');
        heDescripcion.setValue('');
        dfFIImagen.setValue('');
        dfFFImagen.setValue('');
        dfFIImagen.setValue(fecha.format('d/m/Y'));
    }

    function mostrarVentanaIndicadorImagen(accion){
        LimpiarForm();        
        if(accion == 'ADD'){
            Ext.getCmp('tfimagen').enable();
            btnSubirImagen.enable();
            fpdatosImagen.disable();
            Ext.getCmp('btnAplicarII').show();
            winImagen.setTitle(labels.lbwinAddImagen);
        }
        else{
            fpdatosImagen.enable();
            Ext.getCmp('btnAplicarII').hide();
            tfcodIndicadorI.setValue(record.codigo);
            tfnombreIndicadorI.setValue(record.nombre);
            tfdominioIndicadorI.setValue(record.dominio);
            heDescripcion.setValue(record.descripcion);
            dfFIImagen.setValue(record.fechainicio);
            dfFFImagen.setValue(record.fechafin);
            idDominio = record.iddominioevaluativo;
            //Ext.getCmp('tfimagen').setValue(record.imagen);
            Ext.getCmp('tfimagen').disable();
            btnSubirImagen.disable();

            Ext.Ajax.request({
                url: 'mostrarimagen',
                method:'POST',
                params: {
                    idimagen: idimagen,
                    extension:record.extension
                },
                callback: function (options,success,response){
                    responseData = Ext.decode(response.responseText);
                    var detalleElTemp = Ext.getCmp('img-detalle-temp-panel').body;
                    nombretemp = responseData.nombretemp;
                    plantillaTemp.overwrite(detalleElTemp, responseData);
                    detalleElTemp.slideIn('l', {
                        stopFx:true,
                        duration:.5
                    });

                }
            });
            winImagen.setTitle(labels.lbwinModImagen);
        }
        winImagen.show();
    }

    var btnCancelarII = new Ext.Button({
        id: 'btnCancelarII',
        text : labels.btnCancelar,
        iconCls : 'cancelar',
        //tooltip:labels.lbToolTipCancelar,
        tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt+X</b>)',
        handler : function() {
            winImagen.hide();
            var detalleElTemp = Ext.getCmp('img-detalle-temp-panel').body;
            detalleElTemp.update('');
        }

    });

    var btnAplicarII = new Ext.Button({
        id: 'btnAplicarII',
        text : labels.btnAplicar,
        iconCls : 'aplicar',
        //tooltip:labels.lbToolTipAplicar,
        tooltip: 'Guardar datos y limpiar los campos (<b>Ctrl+Alt+P</b>)',
        handler : function() {
            boton = 'APLI';
            AddModDatosImagen(boton);
            var detalleElTemp = Ext.getCmp('img-detalle-temp-panel').body;
            detalleElTemp.update('');
        }

    });

    var btnAceptarII = new Ext.Button({
        id: 'btnAceptarII',
        text : labels.btnAceptar,
        iconCls : 'aceptar',
        tooltip: 'Guardar datos y cerrar ventana (<b>Enter</b>)',
        nextTab:'tfimagen',
        prevTab:'btnAplicarII',
        handler : function() {
            boton = 'ACEP';
            AddModDatosImagen(boton);
            var detalleElTemp = Ext.getCmp('img-detalle-temp-panel').body;
            detalleElTemp.update('');
        }

    });

    var keysIM = [{
        key: 'x',
        alt: true,
        fn: function() {
            if (!btnCancelarII.hidden) {
                btnCancelarII.handler();
            }
        }
    }, {
        key: 'p',
        ctrl: true,
        alt: true,
        fn: function() {
            if (!btnAplicarII.hidden) {
                btnAplicarII.handler();
            }
        }
    }, {
        key: Ext.EventObject.ENTER,
        fn: function() {
            if (!btnAceptarII.hidden) {
                btnAceptarII.handler();
            }
        }
    }
    ];
    
    var winImagen = new Ext.Window({
        title : labels.lbwinAddImagen,
        bodyBorder: true,
        closeAction: 'hide',
        modal: true,
        keys:keysIM,
        hideBorders: true,
        width: 440,
        height: 520,
        layout: 'border',
        bodyStyle: 'padding: 10px',
        resizable: false,
        items : [fpImagen, fpdatosImagen],
        buttons : [btnCancelarII,btnAplicarII,btnAceptarII]
    });
	winImagen.on('show', function(cmp){
        tfimagen.focus(false, 300);
    });
    winImagen.on('close', function(cmp){
        self.btnAdicionar.focus();
    });
	
    function AddModDatosImagen(boton){
        var valor = Ext.getCmp('tfimagen').getValue();
        extension = valor.substr(valor.lastIndexOf('.'));
        var iddominioevaluativo = idDominio;
        var url = 'adicionarimagen';
        if(accion == 'ADD')
            url = 'adicionarimagen';
        else
            url = 'modificarimagen';
        if(fpdatosImagen.getForm().isValid()){
            fpdatosImagen.getForm().submit({
                url: url,
                waitMsg: labels.lbEnviandodatosImagen,
                params: {
                    iddominioevaluativo: iddominioevaluativo,
                    extension: extension,
                    idimagen: idimagen,
                    nombretemp:nombretemp
                },
                failure: function(form, action){
                    if(action.result.codMsg != 3){                        
                        var msg = '';
                        if(accion == 'ADD'){
                            mostrarMensaje(1,'El indicador de imagen ha sido adicionado satisfactoriamente.');
                            fpdatosImagen.getForm().reset();                        
                        }else{
                            mostrarMensaje(1,'El indicador de imagen ha sido modificado satisfactoriamente.');
                        }if(boton == 'ACEP'){
                            winImagen.hide();
                        }
                    }

                        objSelectorImg.cargarImagenes(30, 0);                    
                }
            });
        }

    }


    SelectorImagen = function(objconfig){
        this.objconfig = objconfig;
    }

    SelectorImagen.prototype = {
        imgs : {},
        renderizar : function(contenedor){
            this.initPlantillas();
            this.stSelector = new Ext.data.Store({
                url: this.objconfig.url,
                reader:new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    root: "datos",
                    id: "idindicadorimagen"
                }, [{
                    name: 'idindicadorimagen'
                },

                {
                    name: 'imagen'
                },

                {
                    name: 'codigo'
                },

                {
                    name: 'nombre'
                },

                {
                    name: 'dominio'
                },

                {
                    name: 'descripcion'
                },

                {
                    name: 'iddominioevaluativo'
                },

                {
                    name: 'fechainicio'
                },

                {
                    name: 'fechafin'
                },

                {
                    name: 'extension'
                }
                ])
            });

            this.ptb = new Ext.PagingToolbar({
                pageSize: 30,
                store: this.stSelector,
                displayInfo: true,
                items:['-']
            });
            var self = this;
            this.btnAdicionar = new Ext.Button({
                id: 'btnAdicionar',
                text:labels.btnAdicionar,
                tooltip:labels.lbToolTipBtnAdicionar,
                iconCls:'adicionar',
                disabled: false,
                handler : function(){
                    accion = 'ADD';
                    mostrarVentanaIndicadorImagen(accion);
                },
                prevTab:'btnEliminar',
            });

            this.btnModificar = new Ext.Button({
                id:'btnModificar',
                text:labels.btnModificar,
                tooltip:labels.lbToolTipBtnModificar,
                disabled: true,
                iconCls:'modificar',
                handler : function(){
                    accion = 'MOD';
                    mostrarVentanaIndicadorImagen(accion);
                }

            });
            this.btnEliminar = new Ext.Button({
                id:'btnEliminar',
                text:labels.btnEliminar,
                tooltip:labels.lbToolTipBtnEliminar,
                disabled: true,
                iconCls:'eliminar',
                handler : function(){
                    mostrarMensaje(2,labels.lbBtnMsgEliminar,function(btn){
                        if(btn == "ok"){
                            PVD.mostrarMascara('idmskeliminarr', labels.lbMsgWait, labels.lbMaskElimI);
                            Ext.Ajax.request({
                                url: 'eliminarimagen',
                                method:'POST',
                                params: {
                                    idimagen: idimagen
                                },
                                callback: function (options,success,response){
                                    responseData = Ext.decode(response.responseText);
                                    PVD.ocultarMascara('idmskeliminarr');
                                    if (responseData.eliminado) {
                                        mostrarMensaje(1,'El indicador de imagen ha sido eliminado satisfactoriamente.');
                                        self.btnAdicionar.focus();
                            }                      
                             objSelectorImg.cargarImagenes(30, 0);                                
                            }
                        });
                    }
                });
            },
                nextTab:'btnAdicionar',
                prevTab:'btnModificar'
            });
            
            this.btnAyudaTP = new Ext.Button({
                id: 'ayudaTP',
                text:labels.btnAyuda,
                tooltip:labels.lbToolTipBtnAyuda,
                iconCls:'ayuda',
                handler : function(){
                    var title   = 'Ayuda del sistema de evaluaciones';
                    var referencia  = 'evaluaciones/indicadores';
                    help.show(title,referencia);
                }
            });            

            var formatData = function(data){
                data.idindicadorimagen = data.idindicadorimagen;
                data.imagen = data.imagen;
                data.codigo = data.codigo;
                data.nombre = data.nombre;
                data.dominio = data.dominio;
                data.iddominioevaluativo = data.iddominioevaluativo;
                data.descripcion = data.descripcion;
                data.fechainicio = data.fechainicio;
                data.fechafin = data.fechafin;
                this.imgs[data.idindicadorimagen] = data;
                return data;
            };

            this.visor = new Ext.DataView({
                tpl: this.thumbPlantilla,
                singleSelect: true,
                anchor:'100%',
                overClass:'x-view-over',
                itemSelector: 'div.thumb-wrap',
                loadingText: labels.lbGridLoading,
                emptyText : '<div style="padding:10px;">' + labels.emptyTextDataView + '</div>',
                store: this.stSelector,
                listeners: {
                    'selectionchange': {
                        fn:this.MostrarImagen,
                        scope:this,
                        buffer:100
                    },
                    'loadexception'  : {
                        fn:this.onLoadException,
                        scope:this
                    },
                    'beforeselect'   : {
                        fn:function(view){
                            return view.store.getRange().length > 0;
                        }
                    }
                },
                prepareData: formatData.createDelegate(this)
            });
            this.visor.on('click',function(d,i,n,e){
                idimagen = d.getRecord(n).data.idindicadorimagen;
                record = d.getRecord(n).data;
            })

            this.kmIndicadorImagen = [{
                key: 'i',
                alt:true,
                fn: function(){
                    self.btnAdicionar.handler();
                }
            },{
                key: 'm',
                alt:true,
                fn: function(){
                    if(!btnModificar.disabled){
                        self.btnModificar.handler();
                    }
                }
            },{
                key: 46,
                fn: function(){
                    if(!btnEliminar.disabled){
                        self.btnEliminar.handler();
                    }
                }
            }];

            var cfg = {
                id:'idgpImagen',
                title: 'Indicadores de imagen',
                tbar:[this.btnAdicionar, this.btnModificar, this.btnEliminar,'->',this.btnAyudaTP],
                sm: this.Selector,
                columns: this.cmSelector,
                stripeRows: true,
                autoScroll:true,
                store: this.stSelector,
                loadMask:{
                    msg : labels.lbGridLoading
                },
                padding:'0 0 0 0',
                margins: '5 5 5 5',
                width: '100%',
                layout:'border',
                items:[{
                    id: 'img-panel-view',
                    region: 'center',
                    autoScroll: true,
                    items: this.visor,
                    layout:'fit',
                    title: this.objconfig.titulo,
                    margins: '5 0 5 5'
                },{
                    id: 'img-detalle-panel',
                    region: 'east',
                    split: true,
                    height: 300,
                    width: 400,
                    margins: '5 5 5 0',
                    minWidth: 200,
                    maxWidth: 400
                }],
                bbar:this.ptb,
                keys: self.kmIndicadorImagen
            };

            Ext.apply(cfg, this.objconfig);
            this.pImagen = new Ext.Panel(cfg);
            this.pImagen.on('activate', function(panel){
                self.btnAdicionar.focus();
            });
            contenedor.add(this.pImagen);
            contenedor.doLayout();
        },

        cargarImagenes : function(limite, inicio){
            this.stSelector.load({
                params:{
                    limit:limite,
                    start:inicio
                },
                load:function(){
                    this.visor.select(0);
                }
            });
        },

        initPlantillas : function(){
            this.thumbPlantilla = new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="thumb-wrap" id="{idindicadorimagen}">',
                '<div class="thumb"><img src="{imagen}" width="50" height="50" /></div>',
                '</div>',
                '</tpl>'
                );
            this.thumbPlantilla.compile();

            this.detailsPlantilla = new Ext.XTemplate(
                '<div class="details">',
                '<tpl for=".">',
                '<img src="{imagen}" /><div class="details-info">',
                '<b>'+labels.lbDescripcion+':</b>',
                '<span>{descripcion}</span>',
                '</tpl>',
                '</div>'
                );
            this.detailsPlantilla.compile();
        },

        MostrarImagen : function(){
            this.btnAdicionar.enable();
            this.btnModificar.enable();
            this.btnEliminar.enable();
            var nodo = this.visor.getSelectedNodes();
            var detalleElement = Ext.getCmp('img-detalle-panel').body;
            if(nodo && nodo.length > 0){
                nodo = nodo[0];
                var data = this.imgs[nodo.id];
                detalleElement.hide();
                this.detailsPlantilla.overwrite(detalleElement, data);
                detalleElement.slideIn('l', {
                    stopFx:true,
                    duration:.2
                });
            }else{
                detalleElement.update('');
            }
        },

        MostrarImagenTemp : function(source){
            var detalleElement = Ext.getCmp('img-detalle-panel').body;
            var data = {
                idindicadorimagen : -1,
                imagen: source,
                descripcion: ''
            };
            detalleElement.hide();
            this.detailsPlantilla.overwrite(detalleElement, data);
            detalleElement.slideIn('l', {
                stopFx:true,
                duration:.2
            });
        },

        onLoadException : function(v,o){
            this.visor.getEl().update('<div style="padding:10px;">Error al cargar las imagenes.</div>');
        }

    };

    var objSelectorImg = new SelectorImagen({
        titulo: labels.lbGridTitulo,
        url: 'todasimagenes'
    });

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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

    var kmIindicadorTexto = [{
        key: 'i',
        alt:true,
        fn: function(){
            btnAdicionarIT.handler();
        }
    },{
        key: 'm',
        alt:true,
        fn: function(){
            if(!btnModificarIT.disabled ){
                btnModificarIT.handler();
            }
        }
    },{
        key: 46,
        fn: function(){
            if(!btnEliminarIT.disabled ){
                btnEliminarIT.handler();
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
        title: labels.gpIndicadorTTitle,
        bodyBorder:false,
        tbar: tbIndicadorT,
        region:'center',
        layout:'border',
        keys:kmIindicadorTexto,
        items: [pFiltros, gpIndicadorT]
    });
    pContenedor.on('activate', function(p){
        btnAdicionarIT.focus();
    });
    tabPanel = new Ext.TabPanel({
        //renderTo: Ext.getBody(),
        id: 'tabPanel',
        region: 'center',
        //autoHeight: true,
        //autoWidth: true,
        height: 578,
        width: 600,
        activeTab: 0,
        border:false,
        items: [pContenedor]
    /*
		listeners: {
            'tabchange': function(tabPanel, tab){
                if(tab.id != 'tab1'){
                    Ext.History.add(tabPanel.id + tokenDelimiter + tab.id);
                }
            }
        }*/
    });

    viewport = new Ext.Viewport({
        layout:'border',
        id:'layout',
        items:[tabPanel]
    });
    //-------------------------------------------------------------------------------------------------------
    objSelectorImg.renderizar(tabPanel);
    objSelectorImg.cargarImagenes(30, 0);

    //-------------------------------------------------------------------------------------------------------

    //viewport.doLayout();
    storeIndicadorT.load({
        params:{
            start:0,
            limit:15
        }
    });
    mascaraIndicadorT = new Ext.LoadMask(gpIndicadorT.getEl(), {
        msg:labels.mensajeEliminarIndicadorLoadMask
    });
    mascaraIndicadorT.enable();
    mascaraEnviarDatos = new Ext.LoadMask(Ext.getBody(), {
        msg:labels.mensajeEnviandoDatos
    });
    mascaraEnviarDatos.enable();

    //----------------------------------------------------------------------------  FUNCTION VENTANA INDICADOR TEXTO  -------------------------------------------------------------------------------------------
    //Muestra ventana de adicionar o modificar indicadores de texto
    function VentanaIndicadorT(accion){
        fpIndicadorT.getForm().reset();
        if(accion == 'ADD'){
            winIndicadorT.setTitle(labels.addIndicadorT);
            btnAplicarIT.show();
            winIndicadorT.show();
            btnAceptarIT.setPreviousElement('btnAplicarIT');
        }else{
            var record = gpIndicadorT.getSelectionModel().getSelected();
            winIndicadorT.setTitle(labels.modIndicadorT);
            btnAplicarIT.hide();
            winIndicadorT.show();
            btnAceptarIT.setPreviousElement('btnCancelarIT');
            fpIndicadorT.getForm().loadRecord(record);
            var idDominioIndicadorT = gpIndicadorT.getSelectionModel().getSelected().get('iddominioevaluativo');
            BuscarDominio(idDominioIndicadorT);
        }
    }

    //-------------------------------------------------------------------------------------   ADD MOD PLANILLA  ----------------------------------------------------------------------------------------------------------------

    function AddModIndicadorT(accion, boton){
        var url = 'adicionarindicadortexto';
        var idindicadortexto = -1;
        var iddominioevaluativo = idDominio;
        if(accion == 'ADD')
        {
            idindicadortexto = -1;
            iddominioevaluativo = idDominio;
            url = 'adicionarindicadortexto';
        }
        else
        {
            idindicadortexto = gpIndicadorT.getSelectionModel().getSelected().get('idindicadortexto');
            if(idDominio == -1)
                iddominioevaluativo = gpIndicadorT.getSelectionModel().getSelected().get('iddominioevaluativo');
            else
                iddominioevaluativo = idDominio;
            url = 'modificarindicadortexto';
        }
        var bandera=false;        
        for(var i=0;i<gpIndicadorT.store.getCount();i++)
        {
			if(tfcodIndicadorT.getValue()== gpIndicadorT.store.data.items[i].data.codigo)
			{
				bandera=true;
			}
					
		}
		
		
        if(fpIndicadorT.getForm().isValid() ){
			if(!bandera){
            PVD.mostrarMascara('idmskguardartr', labels.lbMsgWait, labels.lbMsgSave);            
            Ext.Ajax.request({
                url: url,
                method:'POST',
                params:{
                    idindicadortexto:idindicadortexto,
                    cod:tfcodIndicadorT.getValue(),
                    denom:tfdenomIndicadorT.getValue(),
                    descrip:heDescripcionIndicadorT.getValue(),
                    fi:dfFIIndicadorT.getRawValue(),
                    ff:dfFFIndicadorT.getRawValue(),
                    iddominio:iddominioevaluativo
                },
                callback: function (options,success,response){
                    responseData = Ext.decode(response.responseText);
                    PVD.ocultarMascara('idmskguardartr');                   
                    if(responseData.success){
                        var msg = '';
                        if(accion == 'ADD'){
                            mostrarMensaje(1,'El indicador de texto ha sido adicionado satisfactoriamente.');
                            fpIndicadorT.getForm().reset();
                        }else{
                            mostrarMensaje(1,'El indicador de texto ha sido modificado satisfactoriamente.');
                        }
                        if(boton == 'ACEP'){
                            winIndicadorT.hide();
                        }

                        btnModificarIT.disable();
                        btnEliminarIT.disable();
                        storeIndicadorT.removeAll();
                        storeIndicadorT.load({
                            params:{
                                limit:15,
                                start:0
                            },
                            callback:function(){
                                gpIndicadorT.getSelectionModel().selectFirstRow();
                            }
                        });
                        idDominio = -1;

                    }else if(responseData.codMsg == 3){
                        mostrarMensaje(3,'No se pudo adicionar el indicador correctamente');

                    }
                }
            });
		}
		else
		if(accion=='MOD'){
            PVD.mostrarMascara('idmskguardartr', labels.lbMsgWait, labels.lbMsgSave);            
            Ext.Ajax.request({
                url: url,
                method:'POST',
                params:{
                    idindicadortexto:idindicadortexto,
                    cod:tfcodIndicadorT.getValue(),
                    denom:tfdenomIndicadorT.getValue(),
                    descrip:heDescripcionIndicadorT.getValue(),
                    fi:dfFIIndicadorT.getRawValue(),
                    ff:dfFFIndicadorT.getRawValue(),
                    iddominio:iddominioevaluativo
                },
                callback: function (options,success,response){
                    responseData = Ext.decode(response.responseText);
                    PVD.ocultarMascara('idmskguardartr');                   
                    if(responseData.success){
                        var msg = '';
                        if(accion == 'ADD'){
                            msg = '';
                            mostrarMensaje(1,'El indicador de texto ha sido adicionado satisfactoriamente.');
                            fpIndicadorT.getForm().reset();
                        }else{
                            mostrarMensaje(1,'El indicador de texto ha sido modificado satisfactoriamente.');
                        }
                        if(boton == 'ACEP'){
                            winIndicadorT.hide();
                        }

                        btnModificarIT.disable();
                        btnEliminarIT.disable();
                        storeIndicadorT.removeAll();
                        storeIndicadorT.load({
                            params:{
                                limit:15,
                                start:0
                            },
                            callback:function(){
                                gpIndicadorT.getSelectionModel().selectFirstRow();
                            }
                        });
                        idDominio = -1;

                    }else if(responseData.codMsg == 3){
                        mostrarMensaje(3,'No se pudo adicionar el indicador correctamente');
                    }
                }
            });
		}
		else
		if(accion=='ADD' && bandera)
		{
            mostrarMensaje(3,'El c&oacute;digo que quiere adicionar ya existe.');
		}
        }

    }

    //--------------------------------------------------------------------------------------  BUSCAR DOMINIO  ---------------------------------------------------------------------------------------------------------------

    function BuscarDominio(valor){
        var denom;
        var url = 'buscardominio';
        Ext.Ajax.request({
            url: url,
            method:'POST',
            params:{
                iddominio: valor
            },
            callback: function (options,success,response){
                responseData = Ext.decode(response.responseText);
                denom = responseData;
                tfdomIndicadorT.setValue(denom);
            }

        });
    }

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    function BuscarIndicadorTPorDenom(denomIndicadorT)
    {
        storeIndicadorT.baseParams.denomIndicadorT = denomIndicadorT;
        //storeIndicadorT.baseParams.recurso = recurso;
        storeIndicadorT.load({
            params:{
                start:0,
                limit:15
            }
        });
    }

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function ventanaReporte(formato){
         formDatoReporte.getForm().reset();
       if (formato == 'XLS') {
            winReporte.setTitle('Exportar a formato XLS');          
            winReporte.show();
          
        }else if (formato == 'PDF') {
            winReporte.setTitle('Exportar a formato PDF');           
            winReporte.show();          
        }else if (formato == 'DOC') {
            winReporte.setTitle('Exportar a formato DOC');       
            winReporte.show();          
        }else if (formato == 'HTML'){
            winReporte.setTitle('Exportar a formato HTML');       
            winReporte.show();    
        }
    }
	  function getHeader() {
        var arrHeader = new Array();
        var cant = gpIndicadorT.getColumnModel().getColumnCount();		
        for (var i = 0; i < cant; i++) {           
			arrHeader[i]=gpIndicadorT.getColumnModel().getColumnHeader(i);
		}
        return arrHeader;
    }
}
