var xg = Ext.grid;
var camposGridDinamico;
var storegrid;
var idusuario; 
var newcm;
var datos =[[]];
var criterioSel;
var fila;
var col;
var responseData;
		
////------------ Declarar variables ------------//// 
var winIns, winMod, winCamb;
		
////------------ Area de Validaciones ------------////
         
var today = new Date();
var day   = today.getDate();
var month = today.getMonth();
var year  = today.getFullYear();
if(day < 10)
    day = '0'+day;
month+=1;
if(month < 10)
    month = '0'+month;
var fechaactual = day+'/'+month+'/'+year;
            
////------------ Botones ------------////
btnAdicionar = new Ext.Button({
    id:'btnAgrBd', 
    hidden:true, 
    icon:perfil.dirImg+'adicionar.png', 
    iconCls:'btn', 
    text:'<b>'+perfil.etiquetas.lbBtnAdicionar+'</b>', 
    handler:function(){
        winForm('Ins');
    }
});
btnModificar = new Ext.Button({
    disabled:true,
    id:'btnModBd', 
    hidden:true, 
    icon:perfil.dirImg+'modificar.png', 
    iconCls:'btn', 
    text:'<b>'+perfil.etiquetas.lbBtnModificar+'</b>', 
    handler:function(){
        winForm('Mod');
    }
});
btnEliminar = new Ext.Button({
    disabled:true,
    id:'btnEliBd', 
    hidden:true, 
    icon:perfil.dirImg+'eliminar.png', 
    iconCls:'btn', 
    text:'<b>'+perfil.etiquetas.lbBtnEliminar+'</b>',
    handler:function(){
        eliminarbd();
    }
});
btnAyuda = new Ext.Button({
    id: 'btnAyuBd',
    iconCls: 'btn',
    text: '<b>Ayuda</b>',
    disabled: false,
    toolTip: etiquetas.textToolTipHelp,
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
/**btnAyuda = new Ext.Button({
    id:'btnAyuBd', 
    hidden:true, 
    icon:perfil.dirImg+'ayuda.png', 
    iconCls:'btn', 
    text:'<b>'+perfil.etiquetas.lbBtnAyuda+'</b>'
});*/
UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
////------------ Store del Grid de bases de datos ------------////
stGpBd =  new Ext.data.Store({
    url: 'cargarRolesBD',
    reader:new Ext.data.JsonReader({
        totalProperty: "cantidad_filas",
        root: "datos",
        id: "rolname"
    },
    [
    {
        name:'oid' ,
        mapping:'oid'
    },

    {
        name:'rolname' ,
        mapping:'rolname'
    },

    {
        name:'rolsuper',
        mapping:'rolsuper'
    },

    {
        name:'rolinherit',
        mapping:'rolinherit'
    },

    {
        name:'rolcreaterole' ,
        mapping:'rolcreaterole'
    },

    {
        name:'rolcreatedb',
        mapping:'rolcreatedb'
    },

    {
        name:'rolcatupdate',
        mapping:'rolcatupdate'
    },

    {
        name:'rolpassword',
        mapping:'rolpassword'
    },

    {
        name:'rolcanlogin',
        mapping:'rolcanlogin'
    },
    ])
});
///--------------------------
var stcombo =   new Ext.data.Store({
    url: 'getcriterios',
    autoLoad:true,
    reader:new Ext.data.JsonReader({ 
        id:"criterio"
    },
    [
    {
        name: 'criterio',
        mapping:'criterio'
    }
    ])
}); 
var combocriterios = new Ext.form.ComboBox({
    fieldLabel:'Buscar',
    xtype:'combo',
    store:stcombo,
    disabled:true,
    valueField:'criterio',
    displayField:'criterio',
    triggerAction: 'all',
    editable: false,
    mode: 'local',
    emptyText: '[-Seleccione-]',
    anchor:'50%',
    width:100,                
    listeners:{
        select:onclickcombo
    }
})    
/////-------------function onclickcombo---------------////////////   
function onclickcombo(){
    smgestion = new Ext.grid.RowSelectionModel({
        singleSelect : true, 
        listeners : {
            'rowselect' : function(smodel, rowIndex, keepExisting, record) {                
            }
        }
    })
    
    /////-------------Store del grid dinamico---------------////////////
    storegrid = new Ext.data.Store({
        url : '',
        listeners:{
            'beforeload':function(thisstore,objeto){
                objeto.params.esqSelected =  Ext.getCmp('esquemas').getValue();
            }
        },
    reader : new Ext.data.JsonReader({
        totalProperty : "totalProperty",
        root : "root"
    }, [{
        name : 'vacio'
    }])
    });
    			
cmGestionhist = new Ext.grid.ColumnModel([{
    id : 'expandir',
    autoExpandColumn : 'expandir'
}]);
           
		  			
gdGestionHis = new xg.EditorGridPanel({
    frame : true,   
    sm : smgestion,
    clicksToEdit:1,
    store : storegrid,
    autowidth:true,  
    visible: true,	
    title:'Asignar permisos',
    listeners:{
        'cellclick': function (_this,rowIndex,columnIndex,e){
            if (columnIndex == 1 && _this.getStore().getAt(rowIndex).get('OWN') == true){
                _this.getColumnModel().setEditor(columnIndex, Ext.form.Checkbox({
                    disabled: true, 
                    listeners:{
                        check:function(){}
                    }
                }));
    }	
}
}, 
				
				
loadMask : {
    store : storegrid
},
cm : cmGestionhist,
tbar : [ new Ext.Toolbar.TextItem({
    text:perfil.etiquetas.lbTitDenBuscar
    }),
esquemaSelect = new Ext.form.TextField({
    width:80, 
    id: 'esquemas'
}),
new Ext.menu.Separator(),            
new Ext.Button({
    icon:perfil.dirImg+'buscar.png',
    iconCls:'btn',
    text:perfil.etiquetas.lbBtnBuscar, 
    handler:function(){
        buscarEsquemas(esquemaSelect.getValue());
    }            
})
],
bbar : new Ext.PagingToolbar({
    store : storegrid,
    displayInfo : true,
    pageSize : 20
            
})
});
	
winCrt = new Ext.Window({
    modal: true,
    closeAction:'hide',
    layout:'fit',
    width:700,
    height:500,
    resizable:false,
    closable:false,
    draggable:false,
    region: 'center',
    buttons:[                             
    {
        icon:perfil.dirImg+'cancelar.png',
        iconCls:'btn',
        handler:function(){
            winCrt.close();
        },
        text:perfil.etiquetas.lbBtnCancelar
    },{
        icon:perfil.dirImg+'aceptar.png',
        iconCls:'btn',
        handler:function(){
            asignar();
        },
        text:perfil.etiquetas.lbBtnAceptar
    }]
})
criterioSel = combocriterios.getValue();
Ext.getBody().mask('Cargando configuración y datos...');
Ext.Ajax.request({ 
    url: 'configrid',
    method:'POST',
    params:{
        criterio: criterioSel
    },
    callback: function (options,success,response){                        
        responseData = Ext.decode(response.responseText);
        camposGridDinamico = responseData.grid.campos; 
			               
        for(var i = 1; i < responseData.grid.columns.length; i++){  
            var aux = responseData.grid.columns[i];
            responseData.grid.columns[i].editor = new Ext.form.Checkbox({
                checked:false, 
                listeners:{
                    check:function(_this, checked){
                    }
                }
            });			   	
        aux.renderer = function (data,cell, record, rowIndex, columnIndex,store){
            if (data){
                return "<img src='../../../../images/icons/validado.png' />";
            }
            else{
                return "<img src='../../../../images/icons/no_validado.png' />";
            }
        }
		
    }             
var newcm = Ext.UCID.generaDinamico('cm', responseData.grid.columns);
		        
    storegrid = new Ext.data.Store({
        url : 'cargargriddatos',
        listeners : {
            'load' : function() {
                gdGestionHis.getSelectionModel().selectFirstRow()
                }
        },
        reader : new Ext.data.JsonReader({
            totalProperty: 'cantidad',
            root : 'datos',
            id : 'iddatos'
        },Ext.UCID.generaDinamico('rdcampos', responseData.grid.campos))
    });
            
    var menu = new Ext.menu.Menu({
        id:'submenu',
        items:[{
            text:'Marcar toda la fila',
            scope: this,
            icon: "../../../../images/icons/añadir.png",
            handler:function(){
                if (newcm.getColumnHeader(1) == "OWN"){
                    for(var i = 2; i < newcm.getColumnCount(); i++){
                        storegrid.getAt(fila).set(newcm.getColumnHeader(i),true);
                    }
                    }else{
                for(var i = 1; i < newcm.getColumnCount(); i++){
                    storegrid.getAt(fila).set(newcm.getColumnHeader(i),true);
                }
            }
        }
    },
{
    text:'Marcar toda la columna',
    scope: this,
    icon: "../../../../images/icons/añadir.png",
    handler:function(){
        for(var i = 0; i < storegrid.getCount(); i++){
            storegrid.getAt(i).set(newcm.getColumnHeader(col),true);
        }							
    }
},
{
    text:'Desmarcar toda la fila',
    scope: this,
    icon: "../../../../images/icons/eliminar.png",
    handler:function(){
        if (newcm.getColumnHeader(1) == "OWN"){
            for(var i = 2; i < newcm.getColumnCount(); i++){
                storegrid.getAt(fila).set(newcm.getColumnHeader(i),false);
            }
            }else{
        for(var i = 1; i < newcm.getColumnCount(); i++){
            storegrid.getAt(fila).set(newcm.getColumnHeader(i),false);
        }
        }
}
},
{
    text:'Desmarcar toda la columna',
    scope: this,
    icon: "../../../../images/icons/eliminar.png",
    handler:function(){
        for(var i = 0; i < storegrid.getCount(); i++){
            storegrid.getAt(i).set(newcm.getColumnHeader(col),false);
        }
    }
}]
});
	                             
gdGestionHis.on('cellcontextmenu', function( _this, rowIndex, cellIndex, e){
    fila = rowIndex; 
    col = cellIndex;
    smgestion.selectRow(fila);
    e.stopEvent();
    menu.showAt(e.getXY());
},this);

		
if (newcm && storegrid){                
    gdGestionHis.reconfigure(storegrid, newcm);
    gdGestionHis.getBottomToolbar().bind(storegrid);
    storegrid.baseParams = {
        rolbd:sm.getSelected().data.rolname,
        idrolselec:sm.getSelected().data.oid,
        user:usuario, 
        ip:ipservidor, 
        gestor:gestorBD, 
        passw:password, 
        bd:baseDato,
        criterio:combocriterios.getValue()
        };
    storegrid.load({
        params : {
            start : 0,
            limit : 20 ,
            rolbd:sm.getSelected().data.rolname,
            idrolselec:sm.getSelected().data.oid,
            user:usuario, 
            ip:ipservidor, 
            gestor:gestorBD, 
            passw:password, 
            bd:baseDato,
            criterio:combocriterios.getValue()
            }
        });
}
combocriterios.clearValue();
}
})
winCrt.add(gdGestionHis);                
winCrt.doLayout();    
winCrt.show();
Ext.getBody().unmask();      
}
            
////------------ Establesco modo de seleccion de grid (single) ------------////
sm = new Ext.grid.RowSelectionModel({
    singleSelect:true
});
            
sm.on('beforerowselect', function (smodel, rowIndex, keepExisting, record){
    btnModificar.enable();
    btnEliminar.enable();
    combocriterios.enable();
    oid = record.data.oid;
                            
}, this);
        
////------------ Defino el grid de bases de datos ------------////
var GpBd = new Ext.grid.EditorGridPanel({
    frame:true,
    height:520,
    iconCls:'icon-grid',                        
    autoExpandColumn:'expandir',
    store : stGpBd,
    sm:sm,
    columns: [
    {
        id:'expandir',
        header: perfil.etiquetas.lbTitNombreRol, 
        dataIndex: 'rolname'
    },

    {
        header: perfil.etiquetas.lbTitSR,
        dataIndex: 'rolsuper', 
        renderer: function (data,cell, record, rowIndex, columnIndex,store){
            if (data) return "<img src='../../../../images/icons/validado.png' />"; else return "<img src='../../../../images/icons/no_validado.png' />";
        }
    },
{
    header: perfil.etiquetas.lbTitHP,
    dataIndex: 'rolinherit', 
    renderer: function (data,cell, record, rowIndex, columnIndex,store){
        if (data) return "<img src='../../../../images/icons/validado.png' />"; else return "<img src='../../../../images/icons/no_validado.png' />";
    }
},
{
    header: perfil.etiquetas.lbTitCR,
    dataIndex: 'rolcreaterole', 
    renderer: function (data,cell, record, rowIndex, columnIndex,store){
        if (data) return "<img src='../../../../images/icons/validado.png' />"; else return "<img src='../../../../images/icons/no_validado.png' />";
    }
},
{
    header: perfil.etiquetas.lbTitCBD,
    dataIndex: 'rolcreatedb', 
    renderer: function (data,cell, record, rowIndex, columnIndex,store){
        if (data) return "<img src='../../../../images/icons/validado.png' />"; else return "<img src='../../../../images/icons/no_validado.png' />";
    }
},
{
    header: perfil.etiquetas.lbTitCU, 
    width:110, 
    dataIndex: 'rolcatupdate', 
    renderer: function (data,cell, record, rowIndex, columnIndex,store){
        if (data) return "<img src='../../../../images/icons/validado.png' />"; else return "<img src='../../../../images/icons/no_validado.png' />";
    }
},
{
    header: perfil.etiquetas.lbTitCL,
    dataIndex: 'rolcanlogin', 
    renderer: function (data,cell, record, rowIndex, columnIndex,store){
        if (data) return "<img src='../../../../images/icons/validado.png' />"; else return "<img src='../../../../images/icons/no_validado.png' />";
    }
},
{
    hidden:true,
    dataIndex: 'rolpassword'
},
],
                                  
loadMask:{
    store:stGpBd
},
                                 
tbar:     [ new Ext.Toolbar.TextItem({
    text:perfil.etiquetas.lbTitDenBuscar
    }),
rol = new Ext.form.TextField({
    width:80, 
    id: 'nombrerol'
}),
new Ext.menu.Separator(),            
new Ext.Button({
    icon:perfil.dirImg+'buscar.png',
    iconCls:'btn',
    text:perfil.etiquetas.lbBtnBuscar, 
    handler:function(){
        buscarrol(rol.getValue());
    }            
})
],
                            
bbar:new Ext.PagingToolbar({
    pageSize: 15,
    store: stGpBd,
    displayInfo: true,
    displayMsg:perfil.etiquetas.lbMsgbbarI,
    emptyMsg:perfil.etiquetas.lbMsgbbarII 
})
});
                
///   
////------------ Renderiar el panel ------------////
var panelConexiones = new Ext.Panel({
    id:'pgsql',	
    title:perfil.etiquetas.lbTitRender,
    items:[GpBd],
    tbar:[btnAdicionar,btnModificar,btnEliminar,btnAyuda,"Criterio: ",combocriterios]
});
            
panelAdicionar.add(panelConexiones);
panelAdicionar.doLayout();
//panelConexiones.render('conexiones');
stGpBd.baseParams={
    user:usuario, 
    ip:ipservidor, 
    gestor:gestorBD, 
    passw:password, 
    bd:baseDato
};
stGpBd.load({
    params:{
        limit:15,
        start:0
    }
});
            
////------------ Formulario ------------////
var regBd = new Ext.FormPanel({
    frame:true,
    width:200,
    bodyStyle:'padding:5px 5px 0',
    items: [{
        layout:'form',
        items:[{
            xtype:'textfield',
            fieldLabel:perfil.etiquetas.lbTitNombreRol,                                   
            id:'rolname',
            blankText:perfil.etiquetas.lbMsgBlank,
            allowBlank:false,     
            labelStyle:'width:120px',
            width:200
        },{
            xtype:'textfield',
            fieldLabel:perfil.etiquetas.lbContrasena,
            inputType:'password',                                   
            id:'contrasena',
            blankText:perfil.etiquetas.lbMsgBlank,     
            labelStyle:'width:120px',
            width:200
        },{
            xtype:'textfield',
            fieldLabel:perfil.etiquetas.lbNewContrasena,
            inputType:'password',
            blankText:perfil.etiquetas.lbMsgBlank,                                
            id:'newcontrasena',
            labelStyle:'width:120px',
            width:200   
        },{
            columnWidth:.5,
            layout:'column',
            items:[{
                columnWidth:.7,
                layout:'form',
                items:[{
                    xtype:'datefield',
                    tabIndex:18,
                    labelStyle:'width:120px',
                    fieldLabel:perfil.etiquetas.fecha,
                    readOnly:true,
                    id:'fechainicio',
                    width:88,
                    minValue:fechaactual,
                    format:'d/m/Y',
                    listeners:{
                        change:function(){
                            Ext.getCmp('horaaa').enable();
                        }
                    }
                }]
            },{
                columnWidth:.3,
                layout:'form',
                items:[{
                    xtype:'timefield',
                    id:'horaaa',
                    readOnly:true,
                    hideLabel:true,
                    disabled:true,                                    
                    format:'H:i',
                    width:75
                }]                                                                                                          
            }]
        },{
            columnWidth:.5,
            layout:'form',
            items: [{
                xtype:'fieldset',
                title: perfil.etiquetas.privilegios,
                autoHeight: 'auto',
                defaultType: 'checkbox',
                width:324,
                items: [{
                    hideLabel:true,
                    boxLabel: perfil.etiquetas.Hpermisos,
                    name: 'permisos',
                    id:'rolinherit'
                },{ 
                    hideLabel:true,
                    boxLabel: perfil.etiquetas.lbTitSR,
                    id:'rolsuper',
                    listeners:{
                        check :function(){
                            if(Ext.getCmp('rolsuper').getValue())
                            {
                                Ext.getCmp('rolcatupdate').enable();
                            }
                            else
                                Ext.getCmp('rolcatupdate').disable();
                        }
                    }
                },{ 
                    hideLabel:true,
                    boxLabel: perfil.etiquetas.lbTiOBD,
                    id:'rolcreatedb'
                },{ 
                    hideLabel:true,
                    boxLabel: perfil.etiquetas.lbTiCR,
                    id:'rolcreaterole'
                },{ 
                    hideLabel:true,
                    boxLabel: perfil.etiquetas.lbTiMCD,
                    disabled: true,
                    id:'rolcatupdate'
                }]
            }]
        }]
    }]  
});
    
////------------ Cargar la ventana ------------////
function winForm(opcion){
    switch(opcion){
        case 'Ins':{
            if(!winIns)
            {
                winIns = new Ext.Window({
                    modal: true,
                    closeAction:'hide',
                    layout:'fit',
                    resizable: false,
                    title:perfil.etiquetas.lbTitVentanaAddTit,
                    width:390,
                    height:380,
                    buttons:[
                    {
                        icon:perfil.dirImg+'cancel.png',
                        iconCls:'btn',
                        text:perfil.etiquetas.lbBtnCancelar,
                        handler:function(){
                            restaurarvalores();
                        }
                    },
                    {    
                        icon:perfil.dirImg+'aplicar.png',
                        iconCls:'btn',
                        text:perfil.etiquetas.lbBtnAplicar,
                        handler:function(){
                            adicionarrolbasedatos('apl');
                        }
                    },
                    {    
                        icon:perfil.dirImg+'aceptar.png',
                        iconCls:'btn',
                        text:perfil.etiquetas.lbBtnAceptar,
                        handler:function(){
                            adicionarrolbasedatos();
                        }
                    }]
                });
            }            
            regBd.getForm().reset();         
            winIns.add(regBd);
            winIns.doLayout();
            winIns.show();
        }
        break;
        case 'Mod':{
            if(!winMod)
            {
                winMod= new Ext.Window({
                    modal: true,
                    closeAction:'hide',
                    layout:'fit',
                    resizable: false,
                    title:perfil.etiquetas.lbTitVentanaDelTit,
                    width:390,
                    height:380,
                    buttons:[
                    {
                        icon:perfil.dirImg+'cancelar.png',
                        iconCls:'btn',
                        text:perfil.etiquetas.lbBtnCancelar,
                        handler:function(){
                            winMod.hide();
                        }
                    },
                    {        
                        icon:perfil.dirImg+'aceptar.png',
                        iconCls:'btn',
                        text:perfil.etiquetas.lbBtnAceptar,
                        handler:function(){
                            modificarbd();
                        }
                    }]
                });
            }                    
            winMod.add(regBd);
            winMod.doLayout();
            winMod.show();
            regBd.getForm().loadRecord(sm.getSelected());
        }
        break;
    }
}
////-----------Restaurar valores-------------////
function restaurarvalores()
{		 
    Ext.getCmp('rolcatupdate').disable();
    Ext.getCmp('horaaa').disable();
    winIns.hide();             
}
////------------ Adicionar Base de Datos ------------////    
function adicionarrolbasedatos(apl)
{
    if (regBd.getForm().isValid())
    {
        if(Ext.getCmp('contrasena').getValue() ==  Ext.getCmp('newcontrasena').getValue())
        {
            regBd.getForm().submit({
                url:'insertarRolBaseDato',
                waitMsg:perfil.etiquetas.lbMsgAdicionarMsg,
                params:{
                    user:usuario, 
                    ip:ipservidor, 
                    gestor:gestorBD, 
                    passw:password, 
                    bd:baseDato,
                    idservidor: idservidor,
                    idgestor: idgestor
                },
                failure: function(form, action){
                    if(action.result.codMsg != 3)
                    {
                        mostrarMensaje(action.result.codMsg,action.result.mensaje); 
                        regBd.getForm().reset(); 
                        if(!apl) 
                            winIns.hide();
                        stGpBd.reload();
                        sm.clearSelections();
                        btnModificar.disable();
                        btnEliminar.disable();
                    }
                    if(action.result.codMsg == 3) mostrarMensaje(action.result.codMsg,action.result.mensaje);
                }    
            });
        }
        else
            mostrarMensaje(3,perfil.etiquetas.lbTitMsgContrasenaIncorrecta);
    }
    else
        mostrarMensaje(3,perfil.etiquetas.lbMsgErrorEnCamops);                
}
    
////------------ Modificar Base de Datos ------------////
function modificarbd(){
    if (regBd.getForm().isValid()) {
        if (Ext.getCmp('contrasena').getValue() == Ext.getCmp('newcontrasena').getValue()) {
            regBd.getForm().submit({
                url: 'modificarRolBaseDato',
                waitMsg: perfil.etiquetas.lbMsgModificarMsg,
                params: {
                    user: usuario,
                    ip: ipservidor,
                    gestor: gestorBD,
                    passw: password,
                    bd: baseDato,
                    oid: sm.getSelected().data.oid,
                    idservidor: idservidor,
                    idgestor: idgestor
                },//// tengo ke kargar los datos a la ventana importante
                failure: function(form, action){
                    if (action.result.codMsg != 3) {
                        mostrarMensaje(action.result.codMsg,action.result.mensaje);
                        stGpBd.reload();
                        winMod.hide();
                    }
								
                }
            });
        }
        else 
            mostrarMensaje(3, perfil.etiquetas.lbTitMsgContrasenaIncorrecta);
    }
    else 
        mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops);
}
////------------ Eliminar Base de Datos ------------////
                
function eliminarbd(){
    mostrarMensaje(2,perfil.etiquetas.lbMsgFunEliminar,elimina);
    function elimina(btnPresionado)
    {
        if (btnPresionado == 'ok')
        {
            Ext.Ajax.request({
                url: 'eliminarRolesDB',
                method:'POST',
                params:{
                    user: usuario,
                    ip: ipservidor,
                    gestor: gestorBD,
                    passw: password,
                    bd: baseDato,
                    oid: sm.getSelected().data.oid,
                    rolname: sm.getSelected().data.rolname,
                    idservidor: idservidor,
                    idgestor: idgestor
                },
                callback: function (options,success,response){
                    responseData = Ext.decode(response.responseText);                        
                    if(responseData.codMsg == 1)
                    {
                        mostrarMensaje(responseData.codMsg,responseData.mensaje);
                        stGpBd.reload();
                        sm.clearSelections();
                        btnEliminar.disable();
                    }
                }
            });
        }
    }
}
////------------ Buscar Base de Datos ------------////
function buscarrol(rol){  
    stGpBd.load({
        params:{
            nombreRol:rol, 
            user:usuario, 
            ip:ipservidor, 
            gestor:gestorBD, 
            passw:password, 
            bd:baseDato, 
            start:0, 
            limit:15
        }
    });
}
        
function buscarEsquemas(esqSelected){  
    storegrid.load({
        params:{
            esqSelected:esqSelected, 
            nombreRol:rol, 
            user:usuario, 
            ip:ipservidor, 
            gestor:gestorBD, 
            passw:password, 
            bd:baseDato, 
            start:0, 
            limit:15
        }
    });
}
        
////---------------Asignar los permisos para la base de datos-----------------------////
function asignar() {
    var filasModifcadas = storegrid.getModifiedRecords();
    var cantFilas = filasModifcadas.length;
    var cmHis = gdGestionHis.getColumnModel();
    var cantCol = cmHis.getColumnCount();
    var arrayAcceso = [];
    var arrayDenegado = [];
		
    for (var i = 0; i < cantFilas; i++) {
        var nameFila = filasModifcadas[i].data.name;
        var colsFila = filasModifcadas[i].getChanges();
        var arrayColAut = [];
        var arrayColDen = [];
        for (var j = 1; j <= cantCol; j++) {
            nameCampo = camposGridDinamico[j];
            var cadEval = 'colsFila.' + nameCampo;
            var valCol = eval(cadEval);
            if (valCol == true)
                arrayColAut.push(nameCampo);
            else if (valCol == false)
                arrayColDen.push(nameCampo);
        }
        if (arrayColAut.length)
            arrayAcceso.push([nameFila, arrayColAut]);
        if (arrayColDen.length)
            arrayDenegado.push([nameFila, arrayColDen]);
    }
    jsonAcceso = Ext.encode(arrayAcceso);
    jsonDenegado = Ext.encode(arrayDenegado);
		
	
    Ext.Ajax.request({
        url: 'modificarPermisos',
        method: 'POST',
        params: {
            acceso: jsonAcceso,
            denegado: jsonDenegado,
            nombreRol: rol,
            user: usuario,
            ip: ipservidor,
            gestor: gestorBD,
            passw: password,
            bd: baseDato,
            criterio: criterioSel,
            usuariobd: sm.getSelected().data.rolname
        },
        callback: function(options, success, response){
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsg == 1) {
                mostrarMensaje(responseData.cod, responseData.mensaje);
                winCrt.close();
            }
            if (responseData.codMsg == 3) 
                mostrarMensaje(responseData.cod, responseData.mensaje);
        }
    });
}   