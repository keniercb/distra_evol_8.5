var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
perfil.etiquetas = Object();
Ext.QuickTips.init();
var treesel, mensaje;
var controlaccion = 0;
UCID.portal.cargarEtiquetas('gestnomencladores', cargarInterfaz);
// Etiquetas para copiar para el fichero de lenguaje y temporalmente colocadas
var aplicar;
// function CargarInterfaz
function cargarInterfaz() {
    colorMenu = new Ext.menu.ColorMenu({
        listeners: {
            select: function(p, c) {

                Ext.getCmp('color').setValue(c);
                Ext.get('color').applyStyles('border:2px solid #' + c);
            }
        }
    });

    btcolorcat = new Ext.Button({
        id: 'btcolorcat',
        hidden: true,
        icon: perfil.dirImg + 'paletacolor.png',
        iconCls: 'btn',
        listeners: {
            click: function(b, e) {
                e.stopEvent();
                var xy = e.getXY();
                colorMenu.showAt(xy);
            }
        }
    });

    btnLimpiar = new Ext.Toolbar.Button({
        iconCls: 'btn',
        tabIndex: 11,
        icon: perfil.dirImg + 'limpiar.png',
        text: perfil.etiquetas.lbBtnLimpiar,
        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
        id: 'btntodos',
        disabled: false,
        handler: function() {

            filtrosnomencladores.clearFilters();

        }

    });

    //***************************Filtros*********************************

    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';

    filtrosnomencladores = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }
        ]
    });

    /** **************** Fin de filtros por columna ************************ */

    // Botones btnAdd btnMod btnDel btnAyuda
    btnAdd = new Ext.Button({
        handler: function() {
            adicionarPrincipal();

        },
        text: perfil.etiquetas.lbBtnAdicionar,
        disabled: false,
        id: 'btnAdd',
        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnAdd
    });
    btnMod = new Ext.Button({
        handler: function() {
            modificarPrincipal();
        },
        text: perfil.etiquetas.lbBtnModificar,
        id: 'btnMod',
        icon: perfil.dirImg + 'modificar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnMod
    });
    btnDel = new Ext.Button({
        handler: function() {
            eliminarNomenclador();
        },
        text: perfil.etiquetas.lbBtnEliminar,
        disabled: true,
        id: 'btnEli',
        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnDel
    });
    btnAyuda = new Ext.Button({
        handler: function() {
        },
        text: perfil.etiquetas.lbBtnAyuda,
        id: 'btnAyu',
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnAyu
    });
    // formulario fpGestNom
    fpGestNom = new Ext.FormPanel({
        labelAlign: 'top',
        id: 'fpGestNom',
        frame: true,
        bodyStyle: 'padding:5px 5px 0',
        listeners: {
            render: function(f) {
                btcolorcat.show();
            }
        },
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: .7,
                        layout: 'form',
                        items: [{
                                xtype: 'textfield',
                                fieldLabel: perfil.etiquetas.lbDenominacion,
                                id: 'denominacion',
                                anchor: '95%',
                                maxLength: 255,
                                regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]*)+$/,
                                regexText: perfil.etiquetas.lbMsgSoloALfa,
                                allowBlank: false
                            }, {
                                xtype: 'hidden',
                                id: 'id'
                            }, {
                                xtype: 'hidden',
                                id: 'aformnode'
                            }]
                    }, {
                        columnWidth: .3,
                        layout: 'column',
                        items: [{
                                columnWidth: .7,
                                layout: 'form',
                                items: [{
                                        xtype: 'textfield',
                                        fieldLabel: perfil.etiquetas.lbcolor,
                                        id: 'color',
                                        anchor: '95%',
                                        disabled: true,
                                        allowBlank: false
                                    }]
                            }, {
                                columnWidth: .3,
                                layout: 'form',
                                bodyStyle: 'padding-top:18px;',
                                items: [btcolorcat]
                            }]
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: [{
                                xtype: 'textarea',
                                fieldLabel: perfil.etiquetas.lbDescripcion,
                                id: 'descripcion',
                                anchor: '100%'
                            }]
                    }]
            }]
    });
    // Store grid stGpGestNom
    stGpGestNom = new Ext.data.Store({
        url: 'listarDatosNomenclador',
        listeners: {
            beforeload: function() {

                stGpGestNom.baseParams.node = treesel;
                setTituloFiltrarNomencladores();
            },
            load: function() {
                smGpGestNom.selectFirstRow();
                upColorCell();
                (trGestNom.getSelectionModel().getSelectedNode().attributes.add) ? btnAdd.enable() : btnAdd.disable();

                siexisteNomencladores();
            }

        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "id"
        }, [{
                name: 'id'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'color'
            }]
                )
    });
    // Selection Model grid smGpGestNom
    smGpGestNom = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function() {
                btnDel.enable();
                if (smGpGestNom.getSelections().length > 1) {
                    btnAdd.disable();
                    btnMod.disable();
                }
                else {
                    btnAdd.enable();
                    btnMod.enable();
                }

            }

        }
    });
    // Grid gestion gpGestNom
    gpGestNom = new Ext.grid.GridPanel({
        region: 'center',
        title: perfil.etiquetas.lbDatosNomenclador,
        frame: true,
        plugins: filtrosnomencladores,
        disabled: true,
        autoExpandColumn: 'expandir',
        store: stGpGestNom,
        margins: '2 2 2 -4',
        sm: smGpGestNom,
        columns: [
            {
                header: perfil.etiquetas.lbDenominacion,
                width: 180,
                dataIndex: 'denominacion',
                sortable: true
            },
            {
                id: 'expandir',
                header: perfil.etiquetas.lbDescripcion,
                dataIndex: 'descripcion',
                sortable: true
            },
            {
                header: perfil.etiquetas.lbcolor,
                width: 90,
                dataIndex: ''
            }],
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        tbar: [btnAdd, btnMod, btnDel, '->', btnLimpiar, '', btnAyuda]
    });
    /***	TreePanel	***/
    trGestNom = new Ext.tree.TreePanel({
        autoScroll: true,
        region: 'west',
        title: perfil.etiquetas.lbNomencladores,
        width: 200,
        collapsible: true,
        listeners: {
            click: function(n, e) {
                treesel = n.id;
                Ext.getCmp('aformnode').setValue(treesel);
                gpGestNom.enable();
                stGpGestNom.load();
            }
        },
        split: true,
        rootVisible: false,
        root: new Ext.tree.AsyncTreeNode({
            text: perfil.etiquetas.lbPlanes,
            tipo: 0,
            expanded: true,
            id: '0'
        }),
        loader: new Ext.tree.TreeLoader({
            dataUrl: 'listarNomencladoresTree',
            listeners: {
                beforeload: function(tl, n) {
                    this.baseParams = {
                        domain: n.attributes.domain
                    };
                }
            }
        })

    });

    // viewport de la plantilla
    vpGestNom = new Ext.Viewport({
        layout: 'fit',
        items: [{
                layout: 'border',
                items: [trGestNom, gpGestNom]
            }]


    })

    winAdd = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        constrain: true,
        layout: 'fit',
        width: 400,
        height: 220,
        items: fpGestNom,
        buttons: [{
                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'btn',
                text: perfil.etiquetas.lbBtnCancelar,
                tooltip: perfil.etiquetas.lbTtBtnCancelar,
                handler: function() {
                    fpGestNom.getForm().reset();
                    winAdd.hide();
                }
            }, {
                icon: perfil.dirImg + 'aplicar.png',
                iconCls: 'btn',
                id: 'aplicar',
                text: perfil.etiquetas.lbBtnAplicar,
                tooltip: perfil.etiquetas.lbTtBtnAplicar,
                handler: function() {
                    aplicar = 1;
                    adicionarNomenclador();

                }
            },
            {
                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'btn',
                text: perfil.etiquetas.lbBtnAceptar,
                tooltip: perfil.etiquetas.lbTTBtnAceptar,
                handler: function() {
                    adicionarNomenclador();
                }
            }
        ]
    });
    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Ii',
            alt: true,
            fn: function() {
                if (!btnAdd.hidden) {
                    if (!btnAdd.disabled)
                        adicionarPrincipal();

                }
            }
        },
        {
            key: 'Mm',
            alt: true,
            fn: function() {
                if (!btnMod.hidden) {
                    if (!btnMod.disabled)
                        modificarPrincipal();

                }
            }
        }
        ,
        {
            key: 46,
            fn: function() {
                if (!btnDel.hidden) {
                    if (!btnDel.disabled)
                        eliminarNomenclador();

                }
            }
        }
        ,
        {
            key: 'Ll',
            alt: true,
            fn: function() {
                if (!btnLimpiar.hidden) {
                    if (!btnLimpiar.disabled)
                        filtrosnomencladores.clearFilters();

                }

            }
        }
        ,
        {
            key: 'Hh',
            alt: true,
            fn: function() {
                if (!btnAyuda.hidden) {
                    if (!btnAyuda.disabled)
                }
            }
        }
    ]);
    //funcion ayuda
    function mostrarAyuda(opcion) {
        var urlayuda = "../../../comun/templates/Ayuda/nomencladores/" + opcion + ".html";
        window.open(urlayuda, "Ayuda", "width=650,height=400,menubar=yes,scrollbars=yes,resizable=yes");
    }
}// Endof cargarInterfaz
function adicionarPrincipal() {
    controlaccion = 1;
    Ext.getCmp('aplicar').show();
    winAdd.setTitle(perfil.etiquetas.lbBtnAdicionar1 + ' ' + trGestNom.getSelectionModel().getSelectedNode().attributes.text.toLowerCase());
    fpGestNom.getForm().reset();
    Ext.getCmp('aformnode').setValue(treesel);
    winAdd.show('btnAdd');

}
function modificarPrincipal() {
    controlaccion = 2;

    winAdd.show('btnMod');

    winAdd.setTitle(perfil.etiquetas.lbBtnModificar1 + ' ' + trGestNom.getSelectionModel().getSelectedNode().attributes.text.toLowerCase());
    Ext.getCmp('aplicar').hide();
    Ext.getCmp('aformnode').setValue(treesel);
    Ext.getCmp('id').setValue(gpGestNom.getSelectionModel().getSelected().data.id);
    Ext.getCmp('denominacion').setValue(gpGestNom.getSelectionModel().getSelected().data.denominacion);
    Ext.getCmp('descripcion').setValue(gpGestNom.getSelectionModel().getSelected().data.descripcion);
    Ext.getCmp('color').setValue(gpGestNom.getSelectionModel().getSelected().data.color);

}

// function adicionarNomenclador
function adicionarNomenclador(apl) {
    if (fpGestNom.getForm().isValid()) {
        if (controlaccion == 1)
            var algo = perfil.etiquetas.lbAdicionandoNomenclador
        else if (controlaccion == 2)
            var algo = perfil.etiquetas.lbModificandoNomenclador
        if (Ext.getCmp('color').getValue()) {
            var mod = 0;
            fpGestNom.getForm().submit({
                url: 'adicionar',
                waitMsg: algo,
                params: {
                    color: Ext.getCmp('color').getValue()
                },
                failure: function(form, action) {

                    if (action.result.mensaje == 'add') {

                        if (aplicar == 1) {
                            aplicar = 0;
                            Ext.getCmp('denominacion').reset();
                            Ext.getCmp('descripcion').reset();

                        } else
                            winAdd.hide();
                        mensaje = perfil.etiquetas.msgAdicionado;

                    }

                    else if (action.result.mensaje == 'mod') {

                        if (aplicar == 1) {
                            aplicar = 0;
                        }
                        else
                            winAdd.hide();
                        mensaje = perfil.etiquetas.msgModificado;


                    }

                    else
                        mensaje = perfil.etiquetas.msgErrorAction;
                    if (action.result.codMsg == 1) {
                        mostrarMensaje(action.result.codMsg, mensaje, function() {
                            gpGestNom.getStore().reload({
                                callback: function() {

                                    Ext.getCmp('color').setValue(null);
                                    Ext.get('color').applyStyles('border:1px solid grey');
                                }
                            });

                        })

                        btnMod.disable();
                        btnDel.disable();
                    } else
                        mensaje = perfil.etiquetas.msgExiste;
                    if (action.result.codMsg == 3) {
                        mostrarMensaje(action.result.codMsg, mensaje)
                        btnMod.disable();
                        btnDel.disable();
                    }
                }
            });
        } else
            mostrarMensaje(1, perfil.etiquetas.msgColor);

    } else {
        if (!Ext.getCmp('denominacion').getRawValue())
            mostrarMensaje(1, perfil.etiquetas.msgColor);
        else
            mostrarMensaje(1, perfil.etiquetas.msgErrorFormulario);
    }

}
// function eliminarNomenclador
function eliminarNomenclador() {
    mostrarMensaje(2, perfil.etiquetas.msgSegEliminar, elimina);
    function elimina(btnPresionado) {
        var aux = gpGestNom.getSelectionModel().getSelections();
        var arreglo = [];
        for (pos in aux) {
            if (aux[pos].id)
                arreglo.push(aux[pos].data.id);
        }
        if (btnPresionado == 'ok') {
            Ext.MessageBox.show({
                title: perfil.etiquetas.lbEspere,
                msg: perfil.etiquetas.msgEliminando,
                width: 250,
                wait: true,
                progress: true,
                closable: false

            });


            Ext.Ajax.request({
                url: 'eliminar',
                params: {
                    idnom: Ext.encode(arreglo),
                    node: treesel
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 1 || responseData.codMsg == 3) {
                        mostrarMensaje(responseData.codMsg, responseData.mensaje, function() {
                            gpGestNom.getStore().reload();
                        });
                        btnMod.disable();
                        btnDel.disable();
                    }

                }
            });
        }
    }
}


function upColorCell() {
    for (var i = 0; i < stGpGestNom.getCount(); i++) {
        Ext.get(gpGestNom.getView().getCell(i, 2)).applyStyles('background-color:' + stGpGestNom.getAt(i).data.color);
    }
}

function setTituloFiltrarNomencladores() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosnomencladores.getFiltrosActivos() == undefined || filtrosnomencladores.getFiltrosActivos().length == 0) {
        gpGestNom.setTitle(perfil.etiquetas.lbDatosNomenclador);
    } else {
        for (i = 0; i < filtrosnomencladores.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtrosnomencladores.getFiltrosActivos()[i].dataIndex == "denominacion") {//
                aux = perfil.etiquetas.lbDenominacion;
            } else if (filtrosnomencladores.getFiltrosActivos()[i].dataIndex == "descripcion") {//
                aux = perfil.etiquetas.lbDescripcion;
            }
            if (i == filtrosnomencladores.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }
        gpGestNom.setTitle(perfil.etiquetas.lbFiltradoPorTip + filtrado_por);
        filtrado_por = "";
    }
}
;

function siexisteNomencladores() {
    if (filtrosnomencladores.getFiltrosActivos().length > 0 && stGpGestNom.getCount() == 0)
        mostrarMensaje(1, perfil.etiquetas.msgBuscar);

}