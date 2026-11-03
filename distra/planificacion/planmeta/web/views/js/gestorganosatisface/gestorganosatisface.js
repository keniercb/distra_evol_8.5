var perfil = window.parent.UCID.portal.perfil;
perfil.etiquetas = Object();
Ext.QuickTips.init();
var sttrGestOrganosatisface, aplicar, ifmod = false;
var accion;
UCID.portal.cargarEtiquetas('gestorganosatisface', cargarInterfaz);
// Etiquetas para copiar para el fichero de lenguaje y temporalmente colocadas

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

    // Botones btnAdd btnMod btnDel btnAyuda
    btnAdd = new Ext.Button({
        handler: function() {
            accionAdicionar();
            accion = 'add'
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
            accionModificar()
            accion = 'mod'
        },
        text: perfil.etiquetas.lbBtnModificar,
        disabled: true,
        id: 'btnMod',
        icon: perfil.dirImg + 'modificar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnMod
    });
    btnDel = new Ext.Button({
        handler: function() {
            accionEliminar();
        },
        text: perfil.etiquetas.lbBtnEliminar,
        disabled: true,
        id: 'btnEli',
        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnDel
    });

    btnAyuda = new Ext.Button({
        text: perfil.etiquetas.lbBtnAyuda,
        id: 'btnAyudaOrganoSatisface',
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnAyu,
    });

    btnLimpiar = new Ext.Button({
        text: perfil.etiquetas.lbLimpiar,
        id: 'btntodos',
        tooltip: perfil.etiquetas.ttBtnLimpiar,
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        handler: function() {
            limpiarfiltrosOS();
        }
    });

    // formulario fpGestNom
    fpGestOrganosatisface = new Ext.FormPanel({
        labelAlign: 'top',
        id: 'fpGestOrganosatisface',
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
                                regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_-])+$/,
                                maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ_-])$/,
                                regexText: perfil.etiquetas.lbMsgSoloALfa,
                                maxLength: 255,
                                maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
                                allowBlank: false
                            },
                        ]

                    }, {
                        columnWidth: .3,
                        layout: 'column',
                        items: [{
                                columnWidth: .7,
                                layout: 'form',
                                items: [{
                                        xtype: 'textfield',
                                        fieldLabel: perfil.etiquetas.lbColor,
                                        id: 'color',
                                        anchor: '95%',
                                        readOnly: true,
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
                                anchor: '100%',
                                allowBlank: true
                            }]
                    }]
            }]
    });


    // Store del treegrid stGpGestOrganosatisface
    sttrGestOrganosatisface = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: 'cargarorganosatisfaces',
        listeners: {
            load: function() {
                upColorCell();
                siexisteIndicadorFiltrado();
            },
            beforeload: function() {
                setTituloFiltrar();
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            totalProperty: 'total',
            id: 'idorganosatisface'
        }, [{
                name: 'idorganosatisface'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'color'
            }, {
                name: '_is_leaf'
            }, {
                name: '_parent'
            }, {
                name: 'idarbol'
            }, {
                name: 'nivelarbol'
            }, {
                name: 'ordender'
            }, {
                name: 'ordenizq'
            }, {
                name: 'idpadre'
            }
        ])
    });


    // Selection Model treegrid GpGestOrganosatisface
    smtrGestOrganosatisface = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function(n, i, r) {
            },
            rowdeselect: function(s, n, r) {
            }
        }


    });
    filtrosOrgSatisface = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'denominacion',
                xtype: 'numberfield',
                idTextField: 'iddenominacion',
                anchor: '95%',
                fieldLabel: ''
            }, {
                type: 'string_adaptado',
                dataIndex: 'descripcion',
                xtype: 'numberfield',
                idTextField: 'iddescripcion',
                anchor: '95%',
                fieldLabel: ''
            }]
    });
    // treeGrid gestion de GestOrganosatisface
    trGestOrganosatisface = new Ext.ux.maximgb.treegrid.GridPanel({
        title: 'Órgano satisface',
        region: 'center',
        plugins: filtrosOrgSatisface,
        frame: true,
        master_column_id: 'expandir',
        stripeRows: true,
        root_title: perfil.etiquetas.lbGpRootTitle,
        autoExpandColumn: 'expandir',
        store: sttrGestOrganosatisface,
        margins: '1 1 1 -4',
        sm: smtrGestOrganosatisface,
        columns: [{
                id: 'expandir',
                header: perfil.etiquetas.lbDenominacion,
                sortable: true,
                dataIndex: 'denominacion',
                tooltip: 'Denominación',
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbDescripcion,
                sortable: true,
                width: 450,
                dataIndex: 'descripcion',
                tooltip: 'Descripción',
                renderer: crearToolTip
            }, {
                header: perfil.etiquetas.lbColor,
                width: 90,
                tooltip: 'Color',
                dataIndex: ''
            }],
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        tbar: [btnAdd, btnMod, btnDel, '->', btnAyuda],
        bbar: new Ext.ux.maximgb.treegrid.PagingToolbar({
            pageSize: 20,
            store: sttrGestOrganosatisface,
            displayInfo: true,
            id: 'pgTreeGridOrganosatisface',
            items: [btnLimpiar]
        }),
        md: new Ext.menu.Menu({
            id: 'md',
            items: [{
                    text: perfil.etiquetas.lbTtbtnAddNomHijo,
                    icon: perfil.dirImg + 'adicionar.png',
                    iconCls: 'btn',
                    id: 'btnaddih',
                    handler: function() {
                        accion = 'add'
                        winAdd.setTitle(perfil.etiquetas.lbWinAdd);
                        winAdd.show();
                        Ext.get('color').applyStyles('border:1px solid #C0C0C0');
                    }
                }]
        }),
        listeners: {
            rowcontextmenu: function(g, r, e) {
                e.stopEvent();
                trGestOrganosatisface.getSelectionModel().selectRow(r);
                trGestOrganosatisface.md.showAt(e.getXY());
            }
        }
    });
    map = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'iI',
            alt: true,
            fn: function() {
                accionAdicionar();
                accion = 'add'
            }
        }, {
            key: 46,
            fn: function() {
                if (!btnDel.hidden && !btnDel.disabled)
                    accionEliminar();
            }
        }, {
            key: 'Mm',
            alt: true,
            fn: function() {
                if (trGestOrganosatisface.getSelectionModel().getSelected() != undefined && !btnMod.hidden && !btnMod.disabled) {
                    accionModificar();
                }
            }
        }, {
            key: 'Ll',
            alt: true,
            fn: function() {
                filtrosOrgSatisface.clearFilters();
            }
        }, {
            key: 'Hh',
            alt: true,
            fn: function() {
              //  mostrarAyuda('Organo que satisface');
            }
        }, {
            key: 'Ee',
            alt: true


        }
    ]);
    // viewport de la plantilla
    vpGestOrganosatisface = new Ext.Viewport({
        layout: 'fit',
        items: [trGestOrganosatisface]
       /* listeners: {
            /*'afterlayout': function() {
                Ext.getCmp('btnAyudaOrganoSatisface').focus();

            }

        }*/
    });
    sttrGestOrganosatisface.reload();
    // Evento Selection Model grid rowselect
    trGestOrganosatisface.getSelectionModel().on('rowselect', function(smodel, rowIndex, record) {
        btnMod.enable();
        btnDel.enable();
    }, this);
    // Ventanas para formulario winFp(opcion)
    winAdd = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        constrain: true,
        layout: 'fit',
        width: 400,
        height: 220,
        items: fpGestOrganosatisface,
        buttons: [{
                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'btn',
                text: perfil.etiquetas.lbBtnCancelar,
                tooltip: perfil.etiquetas.lbTtBtnCancelar,
                handler: function() {
                    fpGestOrganosatisface.getForm().reset();
                    winAdd.hide();
                }
            }, {
                icon: perfil.dirImg + 'aplicar.png',
                iconCls: 'btn',
                id: 'btnaplicar',
                text: perfil.etiquetas.lbBtnAplicar,
                tooltip: perfil.etiquetas.lbTtBtnAplicar,
                handler: function() {
                    aplicar = 1;
                    AdicionarOrganoSatisface();

                }
            }, {
                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'btn',
                text: perfil.etiquetas.lbBtnAceptar,
                tooltip: perfil.etiquetas.lbTTBtnAceptar,
                handler: function() {

                    (!ifmod) ? AdicionarOrganoSatisface() : ModificarOrganoSatisface();
                }
            }]
    });

    //hacer focus en el campo denominacion de la ventana winAdd
    winAdd.on('beforeshow', function() {

        Ext.getCmp('denominacion').focus(true, 700);
    });


    function upColorCell() {
        for (var i = 0; i < sttrGestOrganosatisface.getCount(); i++) {
            Ext.get(trGestOrganosatisface.getView().getCell(i, 2)).applyStyles('background-color:' + sttrGestOrganosatisface.getAt(i).data.color);
        }
    }



    function AdicionarOrganoSatisface() {
        if (fpGestOrganosatisface.getForm().isValid()) {
            if (Ext.getCmp('color').getValue()) {
                fpGestOrganosatisface.getForm().submit({
                    url: 'insertarOS',
                    waitMsg: perfil.etiquetas.msgEspere,
                    params: {
                        accion: accion,
                        color: Ext.getCmp('color').getValue(),
                        idorganosatisface: (trGestOrganosatisface.getSelectionModel().getSelected()) ? trGestOrganosatisface.getSelectionModel().getSelected().json.idorganosatisface : null,
                        idpadre: (trGestOrganosatisface.getSelectionModel().getSelected()) ? trGestOrganosatisface.getSelectionModel().getSelected().data.idpadre : null,
                        idarbol: (trGestOrganosatisface.getSelectionModel().getSelected()) ? trGestOrganosatisface.getSelectionModel().getSelected().data.idarbol : null,
                        nivelarbol: (trGestOrganosatisface.getSelectionModel().getSelected()) ? trGestOrganosatisface.getSelectionModel().getSelected().data.nivelarbol : 0
                    },
                    failure: function(form, action) {
                        if (action.result.cod != -1) {
                            if (aplicar == 1) {
                                aplicar = 0;
                                Ext.getCmp('color').reset();
                                Ext.getCmp('denominacion').reset();
                                Ext.getCmp('descripcion').reset();
                            } else
                                winAdd.hide();
                            mensaje = perfil.etiquetas.msgAdicionado;
                            mostrarMensaje(1, mensaje);
                            trGestOrganosatisface.getStore().reload();
                        } else
                            mostrarMensaje(1, 'El órgano que satisface ya existe.');
                        smtrGestOrganosatisface.clearSelections();
                        fpGestOrganosatisface.getForm().reset();
                        btnMod.disable();
                        btnDel.disable();

                    }
                });

            } else
                mostrarMensaje(1, perfil.etiquetas.msgColor);
        } else {
            if (!Ext.getCmp('color').getValue() || !Ext.getCmp('denominacion').getValue())
                mostrarMensaje(1, perfil.etiquetas.msgColor);
            else
                mostrarMensaje(1, perfil.etiquetas.msgErrorFormulario);

        }


    }
    /**   
     Permite modificar tipos de nomencladores y los datos de estos 	dependiendo 
     del valor de la variable "parent", definida como items del formulario fpGestNom.
     * @author Ariadna Rendón Artola
     **/
    function ModificarOrganoSatisface() {
        var color = trGestOrganosatisface.getSelectionModel().getSelected().json.color;
        var denom = trGestOrganosatisface.getSelectionModel().getSelected().json.denominacion;
        var descrip = trGestOrganosatisface.getSelectionModel().getSelected().json.descripcion;
        if (fpGestOrganosatisface.getForm().isValid()) {
            if (Ext.getCmp('color').getValue() != color || Ext.getCmp('denominacion').getValue() != denom || Ext.getCmp('descripcion').getValue() != descrip) {

                fpGestOrganosatisface.getForm().submit({
                    url: 'insertarOS',
                    waitMsg: perfil.etiquetas.msModificando,
                    params: {
                        accion: accion,
                        color: Ext.getCmp('color').getValue(),
                        idorganosatisface: (trGestOrganosatisface.getSelectionModel().getSelected()) ? trGestOrganosatisface.getSelectionModel().getSelected().json.idorganosatisface : null

                    },
                    failure: function(form, action) {
                        if (action.result.cod != -1) {
                            mensaje = perfil.etiquetas.msgModificado;
                            mostrarMensaje(1, mensaje);
                            trGestOrganosatisface.getStore().reload();
                            winAdd.hide();
                            smtrGestOrganosatisface.clearSelections();
                            fpGestOrganosatisface.getForm().reset();
                            btnMod.disable();
                            btnDel.disable();
                            ifmod = false;
                        }
                        else
                            mostrarMensaje(1, perfil.etiquetas.msgDenominacionR);
                    }
                });
            } else {
                mostrarMensaje(1, 'Debe realizar al menos una modificación.');
            }

        } else {
            if (!Ext.getCmp('color').getValue() || !Ext.getCmp('denominacion').getValue() || !Ext.getCmp('descripcion').getValue())
                mostrarMensaje(1, perfil.etiquetas.msgColor);
            else
                mostrarMensaje(1, perfil.etiquetas.msgErrorFormulario);

        }

    }
    /**   
     Permite eliminar tipos de nomencladores y los datos de estos dependiendo 
     del valor de la variable "parent", definida como items del formulario "fpGestNom".
     * @author Erlien
     **/
    function eliminarNomenclador() {
        rowselected = smtrGestOrganosatisface.getSelected().data;
        mostrarMensaje(2, perfil.etiquetas.msgSegEliminar, elimina);
        function elimina(btnPresionado) {
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
                    url: 'eliminarOS',
                    params: {
                        idorganosatisface: rowselected.idorganosatisface
                    },
                    callback: function(options, success, response) {

                        var responseData = Ext.decode(response.responseText);
                        switch (responseData.cod) {
                            case 1:
                                var icono = 1;
                                mensaje = perfil.etiquetas.msgEliminado;
                                break;
                            case 3:
                                var icono = 1;
                                mensaje = perfil.etiquetas.msgEnuso;
                                break;
                            default:
                                var icono = 3;
                                mensaje = perfil.etiquetas.msgErrorAction;
                                break;
                        }
                        mostrarMensaje(icono, mensaje);
                        trGestOrganosatisface.getStore().reload();
                        Ext.MessageBox.hide();

                        smtrGestOrganosatisface.clearSelections();
                        btnMod.disable();
                        btnDel.disable();
                    }
                });
            }
        }
    }







    function accionAdicionar() {
        winAdd.setTitle(perfil.etiquetas.lbbtnAdd);
        Ext.getCmp('btnaplicar').show();
        fpGestOrganosatisface.getForm().reset();
        winAdd.show('btnAdd');
        smtrGestOrganosatisface.clearSelections();
        Ext.get('color').applyStyles('border:1px solid #C0C0C0');
    }

    function accionModificar() {

        if (trGestOrganosatisface.getSelectionModel().getSelected() != undefined) {
            winAdd.setTitle(perfil.etiquetas.lbSetTwinModificar);
            Ext.getCmp('btnaplicar').hide();
            winAdd.show('btnMod');
            ifmod = true;
            valcolor = trGestOrganosatisface.getSelectionModel().getSelected().data.color;
            Ext.getCmp('color').setValue(valcolor);
            Ext.get('color').applyStyles('border:2px solid #' + valcolor);
            Ext.getCmp('denominacion').setValue(trGestOrganosatisface.getSelectionModel().getSelected().data.denominacion);
            Ext.getCmp('descripcion').setValue(trGestOrganosatisface.getSelectionModel().getSelected().data.descripcion);
        } else {
            mostrarMensaje(1, 'Debe seleccionar al menos un órgano que satisface.');
        }
    }

    function accionEliminar() {
        if (trGestOrganosatisface.getSelectionModel().getSelected() != undefined) {
            eliminarNomenclador();
        } else {
            mostrarMensaje(1, 'Debe seleccionar al menos un órgano que satisface.');
        }
    }
    function limpiarfiltrosOS() {
        if (trGestOrganosatisface.getStore().getCount() >= 0 && (filtrosOrgSatisface.getFiltrosActivos()[0] != undefined
                || filtrosOrgSatisface.getFiltrosActivos().length != 0)) {
            filtrosOrgSatisface.clearFilters();
            trGestOrganosatisface.getStore().load({
                params: {
                    anode: 0
                }
            });
        } else if (filtrosOrgSatisface.getFiltrosActivos()[0] == undefined || filtrosOrgSatisface.getFiltrosActivos().length == 0) {
            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
        }
    }
    function crearToolTip(v, m) {
        m.attr = 'ext:qtip="' + v + '"';
        return v;
    }
    function siexisteIndicadorFiltrado() {
        if (filtrosOrgSatisface.getFiltrosActivos().length > 0 && trGestOrganosatisface.getStore().getCount() == 0)
            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');

    }
    function setTituloFiltrar() {
        var filtrado_por = "";
        var sep = "/";
        if (filtrosOrgSatisface.getFiltrosActivos() == undefined
                || filtrosOrgSatisface.getFiltrosActivos().length == 0) {
            trGestOrganosatisface.setTitle("Órgano que satisface");
        } else {
            for (i = 0; i < filtrosOrgSatisface.getFiltrosActivos().length; i++) {
                var aux = "";
                if (filtrosOrgSatisface.getFiltrosActivos()[i].dataIndex == "denominacion") {//
                    aux = perfil.etiquetas.lbDenominacion;
                } else if (filtrosOrgSatisface.getFiltrosActivos()[i].dataIndex == "descripcion") {
                    aux = perfil.etiquetas.lbDescripcion;
                }
                if (i == filtrosOrgSatisface.getFiltrosActivos().length - 1) {
                    sep = "";
                }
                filtrado_por += aux + sep;
            }
            trGestOrganosatisface.setTitle(perfil.etiquetas.lbFiltradoPor + ': ' + filtrado_por);
            filtrado_por = "";

        }
    }

//    function mostrarAyuda(referencia, title) {
//        var title = perfil.etiquetas.lbTituloAyuda;
//        var referencia = 'Organo que satisface';//esto puede ser el id del boton o cualquier cosa
//        help.show(title, referencia);
//    }

}

