var perfil = window.parent.UCID.portal.perfil;
Ext.QuickTips.init();
//UCID.portal.cargarEtiquetas('importardocumento', cargarInterfaz);
perfil.etiquetas = Object();
var winImp;
var objci;
// Etiquetas para copiar para el fichero de lenguaje y temporalmente colocadas

// function CargarInterfaz
function cargarInterfaz(){
    // Botones btnAdicionar btnModificar btnEliminar btnAyuda
    mymask = new Ext.LoadMask( 
        Ext.getBody(),{ 
            msg:'Eliminando' 
        });
      Ext.Ajax.request({
        url: 'cargaInicial',
        callback: function(options, success, response) {
            objci = Ext.decode(response.responseText);
                objci.acciones = [];
                UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function() {
                    for ($i in acciones_reportes) {
                        objci.acciones[acciones_reportes[$i].abreviatura] = true;
                    }
                    if (objci.acciones.rector)//organo rector
                    {
                        btnDel.enable();
                    } else {
                        btnDel.disable();
                    }
                });
            
        }
    });
    btnDel = new Ext.Button({
        handler:function(){
            eliminarElemento(gpImportardocumento.getSelectionModel().getSelections());
        },
        text:'Eliminar',
        disabled:false,
        id:'btnDeldocumento',
        icon:perfil.dirImg+'eliminar.png',
        iconCls:'btn',
        tooltip:'Eliminar (<b>Alt+E</b>)'
    });
    btnAyuda = new Ext.Button({
        handler:function(){
            mostrarAyuda('Importar documento');
        },
        text:'Ayuda',
        id:'btnAyu',
        icon:perfil.dirImg+'ayuda.png',
        iconCls:'btn',
        tooltip:'Ayuda (<b>Alt+H</b>)'
    });
   btnLimpiarFiltros = new Ext.Button({
        disabled : false,
        id : 'btnLimpiarFiltros',
        icon : perfil.dirImg + 'limpiar.png',
        iconCls : 'btn',
        //tooltip : perfil.etiquetas.lbTtbtnLimpiarFiltros,
        text : 'Limpiar',
        handler : function() {
            seleccBtnLimpiar();
        }
    });

    // Store grid stGpImportardocumento
    
    stGpImportardocumento =  new Ext.data.Store({
        url:'listardocumentos',
        //autoLoad:true,
        listeners:{
             beforeload:function(){
               filtrosimportardocumento() ;
            },
           'load':function(){
                smGpImportardocumento.selectFirstRow();

            }
        },
        reader:new Ext.data.JsonReader({
       
            root: 'data',
            totalProperty: 'total',
            id: 'cargo'
            
        },[{
            name:'denominacion'
        },{
            name:'tipomaterial'//, mapping:'NomTipomaterial.denominacion'
        },{
            name:'cargo'
        },{
            name:'fecha'
        },{
            name:'hora'
        }]
        )
    });
    
    stCmbAccion = new Ext.data.Store({
        url:'listarTipoAccion',
        listeners:{
            beforeload:function(_this,records,options){
                _this.baseParams = {
                    idconcepto:Ext.getCmp('tbCmbConcepto').getValue()
                };
                filtrosimportardocumento();////////////////////////////////////////////////////////////////////
            }
        },
        reader:new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "idtipoaccion"
        },[{
            name:'idtipoaccion'
        },{
            name:'denominacion'
        }]
        )
    });
    
    ///////////////////////////////////////////////////////////////////////////////////////////
    cmImportarDocumento = new Ext.grid.ColumnModel( [
    {
        dataIndex: 'denominacion',
        header: 'Denominación',
        sortable: true,
        width: 70
    },
    {
        dataIndex: 'tipomaterial',
        header: 'Tipo de material',
        sortable: true,
        width: 70,       
        tooltip:'Tipo de material'
    },
    {
        dataIndex: 'cargo',
        header: 'Cargó',
        sortable: true,
        width: 70,        
        tooltip:'Cargó'
    },
    {
        dataIndex: 'fecha',
        header: 'Fecha',
        width: 70,        
        sortable : true,
        tooltip:'Fecha'
    },
    {
        dataIndex: 'hora',
        header: 'Hora',
        width: 70,        
        sortable: true,
        tooltip:'Hora'    
    }]);
   
   function seleccBtnLimpiar(){
    filtrosImportarDocumento.clearFilters();  
    }  

    stTipoMaterial  = new Ext.data.Store({
    url:'listartipomaterial',
    reader:new Ext.data.JsonReader({
        root: "data",
        id: "idtipomaterial"
    },[{
        name:'idtipomaterial'
    },{
        name:'denominacion'
    }]
    )
});
    ///////////////////////////////////////////////////////////////////////////////////////
    filtrosImportarDocumento = new Ext.grid.GridFilters({
        filters : [{
            type : 'string',
            dataIndex : 'denominacion'
        },        
        {
            //type: 'string',
            //dataIndex: 'tipomaterial'

            type : 'listado',
            dataIndex : 'tipomaterial',
            idcombo : 'tipomaterial',
            urlcb : ' listartipomaterial',
            idstore : 'tipomaterial',
            valueFieldcb : 'tipomaterial',
            displayFieldcb : 'denominacion',
            numeropeticiones : 5,
            store : stTipoMaterial,
            width:150

        },
        {
            type: 'string',
            dataIndex: 'cargo'
        },
        {
            type: 'date',
            dataIndex: 'fecha'
        },
        {
            type: 'numeric',
            dataIndex: 'hora'
        }]
    });
   
   
    // Selection Model grid smGpImportardocumento
    smGpImportardocumento = new Ext.grid.RowSelectionModel({
        singleSelect:true
    });
    
    smGpImportar = new Ext.grid.RowSelectionModel({
        singleSelect:false,
        listeners:{
            rowselect : function(_this, rowindex, record){
                btnDel.enable();                    
            },
            rowdeselect :function(){
                if(GpImportardocumento.getSelectionModel().getSelections().length == 0)
                    btnDel.disable();
                else
                    btnDel.enable();
            }
        }
    });
    
    
    // Grid gestion Importardocumento
    gpImportardocumento = new Ext.grid.GridPanel({       
        frame:true,
        store:stGpImportardocumento,
       // margins:'2 2 2 -1',
        autoExpandColumn : 'expandir',
        sm:smGpImportardocumento,     
        plugins : filtrosImportarDocumento,
        columns:[{
            id:'expandir',
            header: "Denominación",
            width:100,
            dataIndex: 'denominacion',
            tooltip:'Denominación',
            renderer:function(value, p, record){
                 p.attr = 'ext:qtip="'+ value + '"';
                return String.format(
                    '<a href="abrirdocumento?iddocumento='+record.data.cargo+'">{0}</a>',
                    value,record.data.idcargadocumento);
            }
        },{
            //type: 'string',
            header: "Tipo de material",
            dataIndex: 'tipomaterial',
            tooltip:'Tipo de material',
            width: 100
        },
        {
          
            header: "Cargó",
            width:100,
            dataIndex: 'cargo',
            tooltip:'Cargó'
        },{
           
            header: "Fecha",
            width:100,
            dataIndex: 'fecha',
              tooltip:'Fecha'
        },{
          
            header: "Hora",
            width:100,
            dataIndex: 'hora',
            tooltip:'Hora'
        }],
        loadMask:{
            store: stGpImportardocumento
        },
        
        tbar:[//{
//            xtype:'tbspacer'
//        },{
//            xtype:'tbspacer'
//        },{
//            xtype:'tbspacer'
//        },
         {
            xtype:'tbtext',
            text:'Cargar documento '
        },{
            xtype:'form',
            height :20,
            buttonAlign:'left',
            id:'form-importardocumento',
            fileUpload: true,            
            items:[{
                xtype:'fileuploadfield',
                id: 'form-file',
                emptyText: 'Seleccione el archivo ...',
                hideLabel : true,
                
                buttonOnly:true,
                name: 'file',
                buttonCfg:{
                    text:'',
                    iconCls:'btn',
                    icon :perfil.dirImg+'buscar.png'
                },
                listeners : {
                    fileselected : function (_this,file_name){
                        winTipoMaterial = new Ext.Window({
                            title:'Seleccione el tipo de material',
                            closeAction:'destroy',
                            width:'400',
                            listeners:{
                                beforedestroy :function(_this){
                                    Planificacion.mostrarMascara('idmask_subirdoc', 'Por favor espere...', 'subiendo documento seleccionado');
                                    Ext.getCmp('form-importardocumento').getForm().submit({
                                        url:'subirdocumento',
                                        params:{
                                            file_name:file_name,
                                            idtipomaterial:Ext.getCmp('cmbTipoMaterial').getValue()
                                        },
                                        failure :function(form,action){
                                            Planificacion.ocultarMascara('idmask_subirdoc');
                                            gpImportardocumento.getStore().reload({
                                                callback:function(){
                                                    if(action.result.cod == 1)
                                                        mostrarMensaje(1,'El documento ha sido guardado satisfoactoriamente');
                                                    if(action.result.cod == 3)
                                                        mostrarMensaje(3,'Lo sentimos, ha ocurrido un error');
                                                }
                                            });
                                        }
                                    });
                                }
                            },
                            buttons:[{
                                text:'Aceptar',
                                iconCls:'btn',
                                icon:perfil.dirImg + 'aceptar.png',
                                handler:function(){
                                    winTipoMaterial.destroy();
                                }
                            }],
                            items:[{
                                xtype:'form',
                                frame:true,
                                layout:'form',
                                items:[{
                                    anchor:'100%',
                                    xtype:'combo',
                                    fieldLabel:'Tipo de material',
                                    id:'cmbTipoMaterial',
                                    emptyText:'Seleccione',
                                    store: stTipoMaterial,
                                    displayField:'denominacion',
                                    allowBlank:false,
                                    triggerAction: 'all',
                                    valueField:'idtipomaterial',
                                    mode:'remote'
                                    
                                }]
                            }]
                        });
                        winTipoMaterial.show();                       
                    }
                }
            }]
        },{
            xtype:'tbspacer'
        },{
            xtype:'tbspacer'
        },{
            xtype:'tbspacer'
        }],

        /*{
            xtype:'button',
            icon:perfil.dirImg+'guardar.png',
            iconCls:'btn',
            id:'btnGuardarAccion',
            text:'Guardar',
            tooltip:'Guardar (<b>Alt+G</b>)',
            // disabled:true,
            handler:function(){
                
            }*/
        
        bbar:new Ext.PagingToolbar({
            //id:'paginado1',
            pageSize: 20,
            store: stGpImportardocumento,
            displayInfo: true
        }),
        reconfigImportacion:function(conc){
            if(conc){
                mask = new Ext.LoadMask(gpImportardocumento.getEl(),{
                    msg:'Cargando...'
                });
                mask.show();
                Ext.Ajax.request({
                    url: 'getConfigGrid',
                    params:{
                        idconcepto:conc
                    },
                    callback: function (op,success,r){
                        r = Ext.decode(r.responseText);
                        if(r.codMsg == 7){
                            gpImportardocumento.reconfigure(new Ext.data.Store({
                                url:'listar',
                                listeners:{
                                    'load':function(){
                                        smGpImportardocumento.selectFirstRow();
                                    }
                                },
                                reader:new Ext.data.JsonReader({
                                    totalProperty: "total",
                                    root: "data",
                                    id:r.rd[0].name
                                },r.rd
                                )
                            }),new Ext.grid.ColumnModel(r.cm));
                            gpImportardocumento.getStore().reload({
                                params:{
                                    idconcepto:Ext.getCmp('tbCmbConcepto').getValue(),
                                    start:0,
                                    limit:20
                                },
                                callback:function(){
                                    mask.hide();
                                }
                            });
                            btnDel.disable();
                        }
                    }
                });
            }
        }
    });
//        panel = new Ext.Panel({
//            id: 'panel',
//            title:'Importar documento',
//              
//           // layout:'fit',
//            //autoHeight:true,
//            //autoWidth:true,
//              items: gpImportardocumento,
//            tbar:[btnDel,'->',btnLimpiarFiltros, btnAyuda],
//          
//        });
    // viewport de la plantilla
    vpImportardocumento = new Ext.Viewport({
        layout:'fit',
		tbar:[btnDel,'->',btnLimpiarFiltros, btnAyuda],
        items:[gpImportardocumento]
			/*new Ext.Panel({
				title:'Importar documento',
				layout:'fit',
				id:'content2',
				frame:true,
				tbar:[btnDel,'->',btnLimpiarFiltros, btnAyuda],
				border:true
			})
			
		]*/
			
            /*title:'Importar documento',
            xtype:'panel',
            layout:'fit',
            autoHeight:true,
            autoWidth:true,
			id:'content2',
            tbar:[btnDel,'->',btnLimpiarFiltros, btnAyuda],
            items:gpImportardocumento*/ 
    });
    map = new Ext.KeyMap(Ext.getDoc(), [

    {
            key: 'Gg',
            alt : true,
            fn: function(){
                alert('Guardar');            
            }
    
        }, {
            key: 'Hh',
            alt : true,
            fn: function(){
                alert('Ayuda');
             
            }
    
        },{
            key: 'Ee',
            alt : true,
            fn: function(){
                alert('Eliminar');
             
            }
    
        }       
    
        ]);
        
 stGpImportardocumento.reload({params:{start:0,limit:20}});  

function filtrosimportardocumento() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosImportarDocumento.getFiltrosActivos() == undefined || filtrosImportarDocumento.getFiltrosActivos().length == 0) {
       // Ext.getCmp('content2').setTitle("Importar  documento");
    }
     else {
        for (i = 0; i < filtrosImportarDocumento.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtrosImportarDocumento.getFiltrosActivos()[i].dataIndex == "denominacion") {//
                aux = 'Denominacion';
            } else if (filtrosImportarDocumento.getFiltrosActivos()[i].dataIndex == "tipomaterial") {//
                aux = 'Tipo de Material';
            } else if (filtrosImportarDocumento.getFiltrosActivos()[i].dataIndex == "cargo") {//
                aux = 'Cargo';
            } else if (filtrosImportarDocumento.getFiltrosActivos()[i].dataIndex == "fecha") {
                aux = 'Fecha';
            } else if (filtrosImportarDocumento.getFiltrosActivos()[i].dataIndex == "hora") {
                aux = 'Hora';
            }           
            if (i == filtrosImportarDocumento.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }
        Ext.getCmp('content2').setTitle("Importar  documento" +' filtrados por  : ' + filtrado_por);
        filtrado_por = "";
    }
}

    
}// Endof cargarInterfaz
cargarInterfaz();


function adicionarElemento(apl){
    if (fpImportardocumento.getForm().isValid()){
        fpImportardocumento.getForm().submit({
            url:'Importardocumentofichero',
            waitMsg:'Adicionando elemento ...',
            failure: function(form, action){
                if(action.result.cod != 42){
                    if(!apl) winImp.hide();
                    gpImportardocumento.getStore().reload({
                        callback:function(){
                            if(action.result.cod == 1){
                                mostrarMensaje(1,'Se importaron los datos satisfactoriamente');
                            }
                        }
                    });
                    btnModificar.disable();
                    btnEliminar.disable();
                }else{
                    mostrarMensaje(3,'El formato del documento no es correcto');
                }
            }
        });
    } else mostrarMensaje(1,'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s)');
}
function crearToolTip(v, m){
    m.attr = 'ext:qtip="'+ v + '"';
    return v;
}
function mostrarAyuda(opcion){
    var urlayuda = "../../../comun/templates/Ayuda/Importar/" + opcion + ".html";
    window.open(urlayuda, "Ayuda", "width=650,height=400,menubar=yes,scrollbars=yes,resizable=yes");
}
function eliminarElemento(elementos){
    mostrarMensaje(2,'¿Est&aacute; seguro que quiere eliminar el(los) elmento(s) seleccionado(s)?',eliminar);
    function eliminar(keypressed){
        if(keypressed == 'ok'){
           
            var els = new Array();
            for(var i = 0;i<elementos.length;i++){
                els.push(elementos[i].id);
            }
            //console.log(gpImportardocumento.getSelectionModel().getSelected().data.denominacion);
           mymask.show();
            Ext.Ajax.request({
                url:'eliminardocumento',
                params:{
                    file_name:gpImportardocumento.getSelectionModel().getSelected().data.denominacion
                },
                callback:function(opcions,success,response){
                    mymask.hide();
                    response = Ext.decode(response.responseText);
                    if(response.cod == 1){
                        gpImportardocumento.getStore().reload({
                            callback:function(){
                                mostrarMensaje(1,'El documento ha sido eliminado satisfactoriamente');
                            }
                        });
                    }else if(response.cod == 3){
                        mostrarMensaje(3,perfil.etiquetas.lbOcurrioError);
                    }
                }
            });   
        }
    }
}

