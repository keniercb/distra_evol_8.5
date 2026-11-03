var denominacionn;
var keysR;
function adicionarValorcualitativo(titulo, descripcion, finicio, ffin){
    // Ext.getBody().mask(labels.lbmaskadd);
    PVD.mostrarMascara('idmskguardar', labels.lbMsgWait, "Guardando datos ...");
    Ext.Ajax.request({
        url: 'adicionarvalorescualitativos',
        method:'POST',
        params:{
            denom: titulo,
            descripcion: descripcion,
            desde: finicio,
            hasta: ffin
        },
        callback: function (options,success,response){
            responseData = Ext.decode(response.responseText);            
            PVD.ocultarMascara('idmskguardar');
            // Ext.getBody().unmask();
            if(responseData.codMsg == 1){
                storevCualitativo.reload();
                mostrarMensaje(responseData.codMsg,responseData.mensaje);
            }else {
                mostrarMensaje(responseData.codMsg,responseData.mensaje);
            }
        }
    });

}
var denom;
function ModificarValorcualitativo(titulo, descripcion, desde, hasta){
    //Ext.getBody().mask(labels.lbmaskmod);
	PVD.mostrarMascara('idmskmodify', labels.lbMsgWait, "Guardando datos ...");
	// mostrarMascara.show();
    Ext.Ajax.request({
        url: 'modificarvalorescualitativos',
        method:'POST',
        params:{
            idvalorescualitativos:smValores.getSelected().data.idvalorescualitativos,
            denom: titulo,
            descripcion: descripcion,
            desde: desde,
            hasta: hasta
        },
        callback: function (options,success,response){
		    PVD.ocultarMascara('idmskmodify');
            //Ext.getBody().unmask();
            responseData = Ext.decode(response.responseText);            
            if(responseData.codMsg == 1){
                storevCualitativo.reload();
                mostrarMensaje(responseData.codMsg,responseData.mensaje);
            }else
                mostrarMensaje(responseData.codMsg,responseData.mensaje);
        }
    });
}

function eliminarvalorCualitativo(){
    mostrarMensaje(2,labels.lbBtnMsgEliminarD,elimina);
    function elimina(btnPresionado){
        if (btnPresionado == 'ok'){          
            PVD.mostrarMascara('idmskelim', labels.lbMsgWait, "Eliminando datos ...");
            Ext.Ajax.request({
                url: 'eliminarvalorescualitativos',
                method:'POST',
                params:{
                    idvc: smValores.getSelected().data.idvalorescualitativos

                },
                callback: function (options,success,response)
                {                 
                    PVD.ocultarMascara('idmskelim');
                    responseData = Ext.decode(response.responseText);
                     if (responseData.exception == 1) {
                                Ext.MessageBox.show({
                                    title: 'Información',
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.INFO,
                                    msg: labels.lbConceptoEnUso,
                                    fn: function() {
                                        btnAdicionarVCualitativo.focus();
                                    }
                                });
                            } else{
                        mostrarMensaje(responseData.codMsg,responseData.mensaje);
                              storevCualitativo.load({
                                    params:{
                                        limit:15,
                                        start:0
                                    },
                                callback:function(){
                                    gpvCualitativo.getSelectionModel().selectFirstRow();
                                }
                        });
                    }                   
                }
            });

        }

    }
}
var fecha = new Date();
function gestionarValoresCualitativos(opcion){
    tfvalor = new Ext.form.TextField({
        id:'tftitulo',
        name: 'tftitulo',
        width:10,
        anchor:'100%',
        maskRe:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]*)+$/,
        allowBlank:false,
		maxLength:255,
        textBlank: 'Este campo es obligatorio',
        mode:'local',
        fieldLabel: labels.lbDenomVCualitativo,
        enableKeyEvents:true,
		prevTab:'bt3',
    });

    tfdescripc = new Ext.form.TextArea({
        id:'descripc',
        name: 'descripc',
        width:10,
        anchor:'100%',
        maskRe:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]*)+$/,
        allowBlank:true,
        mode:'local',
        fieldLabel: labels.lbDescripVCualitativo,
        maxLength:255,
        enableKeyEvents:true
    });

    var gestionardatos = new Ext.FormPanel({
        layout : 'form',
        labelAlign:'top',
        bodyStyle : 'padding: 10px',
        frame :true,
        items : [{
            layout : 'form',
            border : false,
            anchor : '100%',
            items : [{
                columnWidth : .95,
                anchor : '100%',
                layout : 'form',
                border : false,
                items : [tfvalor]
            }]
        },{
            anchor : '100%',
            layout: 'column',
            items: [{
                columnWidth:.50,
                layout: 'form',
                items: [{
                    fieldLabel:"Fecha de inicio",
                    xtype:'datefield',
                    vtype: 'daterange',
                    name: 'desde',
                    id:'desde',
                    value: fecha.format('d/m/Y'),
                    endDateField: 'hasta',
                    allowBlank: false,
                    textBlank: labels.lbtflblank,
                    maskRe:/^[0-9]/,
                    format:'d/m/Y',
                    width: 176
                }]
            },{
                columnWidth:.50,
                layout: 'form',
                items: [{
                    fieldLabel:"Fecha de fin",
                    xtype:'datefield',
                    vtype: 'daterange',
                    name: 'hasta',
                    id:'hasta',
                    startDateField: 'desde',
                    maskRe:/^[0-9]/,
                    format:'d/m/Y',
                    width: 176
                }]
            }
            ]
        },{
            layout : 'form',
            border : false,
            anchor : '100%',
            items : [{
                columnWidth : .95,
                anchor : '100%',
                layout : 'form',
                border : false,
                items : [tfdescripc]
            }]
        }]
    });


    if (opcion == 'AD')
    {
        var btnAceptarTR = new Ext.Button({
            iconCls:'aceptar',
            text: labels.lbbtnAceptarR,
            id : 'bt3',
            tooltip:labels.lbToolTipAceptar,
            handler:function(){
                if(gestionardatos.getForm().isValid()){
                    adicionarValorcualitativo(tfvalor.getValue(), Ext.getCmp('descripc').getValue(), Ext.getCmp('desde').getRawValue(), Ext.getCmp('hasta').getRawValue());
                    winInsValorC.destroy();
                }
            },
            prevTab:'bt1',
            nextTab:'tftitulo'
        });

        var btnCancelarR = new Ext.Button({
            iconCls:'cancelar',
                text: labels.lbbtnCancelarR,
            id : 'bt2',
            tooltip:labels.lbToolTipCancelar,
            handler:function(){
            winInsValorC.close();
        }
        });

        var btnAplicarR = new Ext.Button({
            iconCls:'aplicar',
            text: labels.lbbtnAplicarR,
            id : 'bt1',
            tooltip:labels.lbToolTipAplicar,
            handler:function(){
                if(gestionardatos.getForm().isValid()){
                    adicionarValorcualitativo(tfvalor.getValue(), Ext.getCmp('descripc').getValue(), Ext.getCmp('desde').getRawValue(), Ext.getCmp('hasta').getRawValue());
                    limpiartext();
                }
            }
        });
        keysR= [{
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
                if (!btnAceptarTR.hidden) {
                    btnAceptarTR.handler();
                }
            }
        }
        ];
        var winInsValorC = new Ext.Window({
            closeAction:'close',
            layout:'fit',
            id:"add",
            modal:true,
            title: labels.lbwinInsTitulo,
            width:410,
            keys: keysR,
            height:280,
            buttons:[btnCancelarR,btnAplicarR,btnAceptarTR
            ],
            items: [gestionardatos]
        });


        winInsValorC.on('show', function(abc){
            tfvalor.focus(false, 500);
        });
        winInsValorC.on('hide', function(abc){
            Ext.getCmp('btnAdicionarVCualitativo').focus();
        });
        winInsValorC.on('beforeclose', function(abc){
            Ext.getCmp('btnAdicionarVCualitativo').focus();
        });
        winInsValorC.show();
    }


    if (opcion == 'MOD')
    {
        var btnAceptarR = new Ext.Button({
            iconCls:'aceptar',
            text: labels.lbbtnAceptarR,
            id : 'bt3',
            prevTab:'bt2',
            tooltip:labels.lbToolTipAceptar,
            handler:function(){
                if(gestionardatos.getForm().isValid()){
                    ModificarValorcualitativo(tfvalor.getValue(),Ext.getCmp('descripc').getValue(), Ext.getCmp('desde').getRawValue(), Ext.getCmp('hasta').getRawValue());
                    winModValorC.destroy();
                }
            },
            nextTab:'tftitulo'
        });

        var btnCancelarR = new Ext.Button({
            iconCls:'cancelar',
            text: labels.lbbtnCancelarR,
            id : 'bt2',
            tooltip:labels.lbToolTipCancelar,
            handler:function(){
                winModValorC.close();
            }
        });


        var keystR= [{
            key: 'x',
            alt: true,
            fn: function() {
                if (!btnCancelarR.hidden) {
                    btnCancelarR.handler();
                }
            }
        },  {
            key: Ext.EventObject.ENTER,
            fn: function() {
                if (!btnAceptarR.hidden) {
                    btnAceptarR.handler();
                }
            }
        }
        ];
        winModValorC = new Ext.Window({
            closeAction:'close',
            layout:'fit',
            id:"add",
            modal:true,
            title: labels.lbwinModTitulo,
            width:410,
            keys:keystR,
            height:280,
            buttons:[btnCancelarR,btnAceptarR


            ],
            items: [gestionardatos]
        });


        tfvalor.setValue(smValores.getSelected().data.denom);
        tfdescripc.setValue(smValores.getSelected().data.descripcion);
        Ext.getCmp('desde').setValue(smValores.getSelected().data.desde);
        Ext.getCmp('hasta').setValue(smValores.getSelected().data.hasta);

        winModValorC.on('show', function(abc){
            tfvalor.focus(false, 500);
        });
        winModValorC.on('hide', function(abc){
            Ext.getCmp('btnAdicionarVCualitativo').focus();
        });
        winModValorC.on('beforeclose', function(abc){
            Ext.getCmp('btnAdicionarVCualitativo').focus();
        });
        winModValorC.show();
    }
}


function limpiartext()
{
    tfvalor.reset();
    tfdescripc.reset();
    Ext.getCmp('desde').reset();
    Ext.getCmp('hasta').reset();
}


function dameValueField(store, value, campoValueF, campoDispField){
    for (var i = 0; i < store.getCount(); i++)
        if (eval('store.getRange(0,store.getCount()-1)[i].data.' + campoDispField) == value)
            return eval('store.getRange(0,store.getCount()-1)[i].data.' + campoValueF);
}

function buscarValores(denom){
    storevCualitativo.removeAll();
    storevCualitativo.baseParams.denom = denom;
    storevCualitativo.reload();
    Ext.getCmp('tfbusqueda').reset();
}


