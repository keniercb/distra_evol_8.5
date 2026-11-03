perfil.etiquetas = Object();


var winAddModelo, fpModelo;
var control1 = 0;
var accion, winClasifPlanes, tfcatregoria, loadertpClasifPlanes, tpClasifPlanes;
var cadenaclasifplan = '';
var ruta = '', nodeIds = '', denominacionclasif = '';

stTipoModel = new Ext.data.Store({
    autoLoad: false,
    url: '../gestmodelo/listarTiposModelosAprobados',
    reader: new Ext.data.JsonReader({
            root: "data",
            id: "idtipomodelo"
        }, [{
            name: 'idtipomodelo'
        }, {
            name: 'denominacion'
        }]
    )
});
sttipoplan = new Ext.data.SimpleStore({
    id: 'stcbActivo',
    fields: ['idaccion', 'nombreaccion'],
    data: [
        [1, 'Ingreso'],
        [0, 'Gasto']
    ]
});


stTipoPlanEconomico = new Ext.data.Store({
    autoLoad: false,
    url: '../gestmodelo/cargarClasifModeloMatPres',
    reader: new Ext.data.JsonReader({
            root: "data",
            id: "idclasf"
        }, [{
            name: 'idclasf'
        }, {
            name: 'denominacion'
        }]
    )
});

/*ChkFBalanceMat = new Ext.form.Checkbox({
 id: 'chkbalancematerial',
 width: 160,
 hideLabel: true,
 boxLabel: 'Balance material',
 disabled: true,
 listeners: {
 render: function(ch, chequeado) {
 }
 }
 });*/

crearIUAddModModelo = function () {
    if (!winAddModelo) {
        fpModelo = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 1,
                    layout: 'form',
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: perfil.etiquetas.lbDenominacion,
                            allowBlank: false,
                            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ, _-]*)+$/,
                            id: 'denominacion',
                            anchor: '100%'
                        }, {
                            xtype: 'hidden',
                            id: 'idmodelo'
                        }, {
                            xtype: 'hidden',
                            id: 'idplanm'
                        }
                    ]
                },
                    {
                        columnWidth: 1,
                        layout: 'form',
                        items: [
                            {
                                displayField: 'denominacion',
                                xtype: 'combo',
                                id: 'idcmbtipomodelo',
                                valueField: 'idtipomodelo',
                                hiddenName: 'idtipomodelo',
                                triggerAction: 'all',
                                typeAhead: true,
                                editable: true,
                                forceSelection: true,
                                validateOnBlur: true,
                                loadingText: 'Cargando...',
                                mode: 'remote',
                                anchor: '100%',
                                fieldLabel: perfil.etiquetas.lbTipodemodelo,
                                allowBlank: false,
                                blankText: perfil.etiquetas.msgErrorCargaNula,
                                emptyText: perfil.etiquetas.lbSeleccione,
                                store: stTipoModel

                            }]
                    },
                    {
                        columnWidth: 1,
                        layout: 'form',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Clasificación del plan',
                                allowBlank: false,
                                editable: false,
                                id: 'tfclasificacion',
                                anchor: '100%',
                                listeners: {
                                    focus: function () {
                                        ConstruirWinArbolClasificacionPlan(acc);
                                    }
                                }
                            }]
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: [{
                            displayField: 'nombreaccion',
                            xtype: 'combo',
                            id: 'idcmbtipoplan',
                            valueField: 'idaccion',
                            hiddenName: 'idaccion',
                            triggerAction: 'all',
                            typeAhead: true,
                            editable: true,
                            forceSelection: true,
                            validateOnBlur: true,
                            mode: 'local',
                            anchor: '100%',
                            fieldLabel: 'Tipo de plan',
                            allowBlank: false,
                            blankText: perfil.etiquetas.msgErrorCargaNula,
                            emptyText: perfil.etiquetas.lbSeleccione,
                            store: sttipoplan,
                            listeners: {
                                select: function (combo, record) {
                                    /*  if(record.data.idaccion == 0){
                                     Ext.getCmp('chkbalancematerial').enable();
                                     }
                                     else{
                                     Ext.getCmp('chkbalancematerial').disable();
                                     Ext.getCmp('chkbalancematerial').setValue(0);
                                     }*/

                                }
                            }
                        }, /*ChkFBalanceMat*/{
                            id: 'chkbalancematerial',
                            xtype: 'checkbox',
                            width: 160,
                            hideLabel: true,
                            boxLabel: 'Balance material',
                            // disabled: true,
                            listeners: {
                                render: function (ch, chequeado) {
                                }
                            }
                        }]
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: [{
                            xtype: 'textarea',
                            id: 'descripcion',
                            anchor: '100%',
                            fieldLabel: perfil.etiquetas.lbDescripcion,
                            editable: false,
                            allowBlank: false
                        }]
                    }]
            }]
        });
        //Ventana para la adición y edición de modelos
        winAddModelo = new Ext.Window({
            modal: true,
            id: 'idwinAddModelo',
            closeAction: 'hide',
            constrain: true,
            layout: 'fit',
            title: perfil.etiquetas.lbTtbtnAdd,
            width: 385,
            height: 410,
            items: fpModelo,
            buttons: [{
                //icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'cancelar',
                text: perfil.etiquetas.lbBtnCancelar,
                disabled: false,
                tooltip: 'Cerrar ventana sin guardar los datos.',
                handler: function () {
                    winAddModelo.hide();

                }
            },
                {
                    //icon: perfil.dirImg + 'aplicar.png',
                    iconCls: 'aplicar',
                    id: 'idaplicarplan',
                    disabled: false,
                    text: perfil.etiquetas.lbBtnAplicar + '<b>',
                    tooltip: 'Guardar datos y limpiar los campos.',
                    handler: function () {
                        adicionarModelo(true);
                    }
                },
                {
                    //icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'aceptar',
                    id: 'btnaceptar',
                    disabled: false,
                    text: perfil.etiquetas.lbBtnAceptar + '<b>',
                    tooltip: 'Guardar datos y cerrar ventana.',
                    handler: function () {
                        adicionarModelo(false);
                    }
                }],
            listeners: {
                beforeshow: function () {
                    Ext.getCmp('idcmbtipoplan').clearValue();
                    stTipoModel.load();
                }
            }
        });

        // Ext.getCmp('idaplicar').setDisabled(false);
    }
}

function adicionarModelo(aply) {
    if (accion == 1)
        var mensa = perfil.etiquetas.lbModificarPP;
    else if (accion == 2)
        mensa = perfil.etiquetas.lbAdicionarPP;
    var chequeado;
    if (Ext.getCmp('chkbalancematerial').getValue()) {
        chequeado = 1;
    } else {
        chequeado = 0;
    }
    if (fpModelo.getForm().isValid()) {
        fpModelo.getForm().submit({
            url: '../gestmodelo/adicionarModelo',
            params: {
                identidad: identidadselected,
                idejercicio: cbEjercicio.getValue(),
                tipoplan: Ext.getCmp('idcmbtipoplan').getValue(),
                rectora: rectora,
                idclasif: nodeIds,
                idplan: tpBasePlan.getSelectionModel().getSelectedNode().id,
                balancematerial: chequeado
            },
            waitMsg: mensa,
            failure: function (form, action) {
                if (action.result.codMsgA == 1) {
                    if (action.result.mensaje == 'Add')
                        mostrarMensaje(1, perfil.etiquetas.msgAddModelo);
                    else
                        mostrarMensaje(1, perfil.etiquetas.msgModModelo)
                    if (!aply) {
                        winAddModelo.hide();
                    }
                }
                else {
                    mostrarMensaje(3, perfil.etiquetas.msgErrorAction)
                }
                fpModelo.getForm().reset();
                Ext.getCmp('idcmbtipoplan').clearValue();
                if (!aply)
                    tpBasePlan.getSelectionModel().getSelectedNode().parentNode.reload();


            }
        });

    } else {
        control1 = 2;
        mostrarMensaje(1, perfil.etiquetas.msgEstadoCampo);
    }
}

function ConstruirWinArbolClasificacionPlan(accion) {
    if (winClasifPlanes)
        winClasifPlanes.destroy();

    var htmlruta = '<spam style="margin-left:1em;">Trazabilidad:</spam><spam style="margin-left:1em;"></spam>' + ruta;
    if (denominacionclasif == '') {
        htmlruta = '<spam style="font-size:11px;color:red;margin-top:2em;margin-left:1em;margin-bottom:2em;">Seleccione la clasificaci&oacute;n deseada...</spam>';
    }

    //label donde se almacena la trazabilidad de la clasificacion
    tfdenominacioncaract = new Ext.form.Label({
        html: htmlruta,
        style: 'font-size:11px;color:red;margin-top:2em;margin-left:1em;margin-bottom:2em;',
        listeners: {
            render: function (field) {
                if (tpBasePlan.getSelectionModel().getSelectedNode()) {
                    if (tpBasePlan.getSelectionModel().getSelectedNode().attributes.ruta != null)
                        field.setText('Trazabilidad: ' + tpBasePlan.getSelectionModel().getSelectedNode().attributes.ruta);
                }

            }
        }
    });


    //loader del arbol donde se muestran las clasificaciones anidadas
    loadertpClasifPlanes = new Ext.tree.TreeLoader({
        dataUrl: 'cargarClasifPlanes',
        listeners: {
            beforeload: function (tl, n) {
                var uri = 'tipodeplan';
                var ruta = '';
                if (tpBasePlan.getSelectionModel().getSelectedNode()) {
                    ruta = tpBasePlan.getSelectionModel().getSelectedNode().attributes.rutaids;
                }
                this.baseParams = {
                    uri: uri,
                    ruta: ruta,
                    iddatosnomenclador: n.attributes.iddatosnomenclador

                };

            }
        }
    });

    //arbol donde se muestran las clasificaciones anidadas
    tpClasifPlanes = new Ext.tree.TreePanel({
        autoScroll: true,
        layout: 'fit',
        border: false,
        region: 'center',
        id: 'tpClasifPlanes',
        height: 310,
        listeners: {
            click: function (node, e) {
                ruta = '';
                denominacionclasif = '';
                nodeIds = '';
                while (node.parentNode) {
                    if (ruta == '') {
                        ruta = '<spam style="font-size:11px;color:red;margin-top:2em;margin-bottom:2em;"><strong>' + node.text + '</strong></spam>';
                        denominacionclasif = node.text;
                    }
                    else {
                        ruta = '<spam style="font-size:11px;color:red;margin-top:2em;margin-bottom:2em;"><strong>' + node.text + '</strong></spam>' + " ->" + ruta;
                        denominacionclasif = node.text + " -> " + denominacionclasif;
                    }
                    nodeIds = node.id + "+" + nodeIds;
                    node = node.parentNode;
                }

                if (ruta != '') {
                    Ext.getCmp('ptext').remove(tfdenominacioncaract);
                    tfdenominacioncaract = new Ext.form.Label({
                        id: 'tfdenominacioncaract',
                        html: '<spam style="margin-left:1em;">Trazabilidad:</spam><spam style="margin-left:1em;"></spam>' + ruta
                    });
                    Ext.getCmp('ptext').add(tfdenominacioncaract);
                    Ext.getCmp('ptext').doLayout();
                }

            }

        },
        loader: loadertpClasifPlanes,
        root: new Ext.tree.AsyncTreeNode({
            text: 'Clasificaciones',
            tipo: 0,
            expanded: true,
            id: '0'
        })

    });


    //ventana donde se muestran las opciones para escoger la clasificacion del plan
    winClasifPlanes = new Ext.Window({
        title: accion + ' clasificaci&oacute;n del plan',
        modal: true,
        constrain: true,
        height: 400,
        width: 450,
        layout: 'border',
        resizable: false,
        items: [
            new Ext.Panel({
                region: 'north',
                id: 'ptext',
                layout: 'form',
                height: 20,
                border: false,
                items: tfdenominacioncaract
            }),
            tpClasifPlanes],
        buttons: [
            new Ext.Button({
                // icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'cancelar',
                tooltip: 'Cerrar ventana sin guardar los datos.',
                text: perfil.etiquetas.lbBtnCancelar,
                handler: function () {
                    winClasifPlanes.destroy();
                }
            }),
            new Ext.Button({
                //icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'aceptar',
                id: 'btnaceptar1',
                tooltip: 'Guardar datos y cerrar ventana.',
                text: perfil.etiquetas.lbBtnAceptar,
                handler: function () {

                    Ext.getCmp('tfclasificacion').setRawValue(denominacionclasif);
                    Ext.getCmp('tfclasificacion').clearInvalid();
                    winClasifPlanes.destroy();
                }
            }),
        ]

    });


    winClasifPlanes.show();
    if (accion == 'Modificar') {


    }
}

