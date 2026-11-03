//perfil.etiquetas = Object();

//var fpPlan,winAddPlan; //stEj
var control = 0;
crearIUAddModPlan = function() {
    // formulario fpTipoModelo
    fpPlan = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        bodyStyle: 'padding:5px 5px 0',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: .25,
                        layout: 'form',
                        items: [{
                                xtype: 'textfield',
                                fieldLabel: perfil.etiquetas.lbCodigo,
                                allowBlank: false,
                                regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]*)+$/,
                                id: 'codigoplan',
                                anchor: '95%'
                            }, {
                                xtype: 'hidden',
                                id: 'idplanm'
                            }, {
                                xtype: 'hidden',
                                id: 'node'
                            }]
                    }, {
                        columnWidth: .75,
                        layout: 'form',
                        items: [{
                                xtype: 'textfield',
                                fieldLabel: perfil.etiquetas.lbDenominacion,
                                allowBlank: false,
                                regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]*)+$/,
                                id: 'denominacionp',
                                anchor: '100%'
                            }]
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: [{
                                xtype: 'textarea',
                                id: 'descripcionp',
                                anchor: '100%',
                                fieldLabel: perfil.etiquetas.lbDescripcion,
                                editable: false
                            }]
                    }]
            }]
    });


    winAddPlan = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        constrain: true,
        layout: 'fit',
        title: perfil.etiquetas.lbTtbtnAddi,
        width: 380,
		cls: 'ventanaAdelante',
        height: 220,
        items: fpPlan,
        buttons: [{
               // icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'cancelar',
                text: perfil.etiquetas.lbBtnCancelar,
                tooltip: 'Cerrar ventana sin guardar los datos.',
                handler: function() {
                    winAddPlan.hide()
                }
            },
            {
                //icon: perfil.dirImg + 'aplicar.png',
                iconCls: 'aplicar',
                tooltip: 'Guardar datos y limpiar los campos.',
                text: perfil.etiquetas.lbBtnAplicar,
                disabled:false,
                handler: function() {
                    adicionarPlan();
                    control = 2;
                }
            },
            {
               // icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'aceptar',
                text: perfil.etiquetas.lbBtnAceptar,
                tooltip: 'Guardar datos y cerrar ventana.',
                disabled:false,
                handler: function() {
                    adicionarPlan();
                    control = 1;
                }
            }
        ]
    });
}

function adicionarPlan() {
    if (fpPlan.getForm().isValid()) {
        fpPlan.getForm().submit({
            params: {
                identidad: identidadselected,
                rect: objci.acciones.rector,
                idejercicio: cbEjercicio.getValue()

            },
            url: 'adicionarPlan',
            waitMsg: perfil.etiquetas.lbAdicionarAA,
            failure: function(form, action) {
                if (action.result.codMsgA == 1) {
                    if (control == 1)
                        winAddPlan.hide();
                    fpPlan.getForm().reset();
                    tpBasePlan.getRootNode().reload();
                    if (action.result.mensaje == 'Add')
                        mostrarMensaje(1, perfil.etiquetas.msgAddPlan);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgModPlan);
                }
                else if (action.result.codMsg == 21) {
                    mostrarMensaje(3, perfil.etiquetas.msgCodExistente)
                }
                else
                    mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
            }
        });
    } else {
        mostrarMensaje(1, perfil.etiquetas.msgEstadoCampo);
    }
}