var perfil = window.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.etiquetas = {};
var idtipodoc, idelemsel, expander, idelementoComentado, stGridAux, filtrosComentario;

crearIUComentario = function() {

    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Ll',
            alt: true,
            fn: function() {
                accionLimpiar();

            }
        }

    ]);
// Store grid stGpCom {Este es el store para el grid de los comentarios}
    stGpCom = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: '../gestcomentario/listarComentarios',
        listeners: {
            beforeload: function(st, opt) {
                cambiarTituloFiltrarCometario();
                stGpCom.removeAll();
                if (!idelementoComentado)
                    stGpCom.baseParams.idelemento = idelemsel;
                else
                    stGpCom.baseParams.idelemento = idelementoComentado;
                idelementoComentado = '';
            },
            load: function() {
                siexistecomentarioFiltrado();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "idcomentario"
        }, [{name: 'idcomentario'}, {name: 'idtipocomentario'}, {name: 'idtipodocumento'}, {name: 'tcomentario'},
            {name: 'asunto'}, {name: 'descripcion'}, {name: 'fechacreado'}, {name: 'idusuario'}, {name: 'usuario'}]
                )
    });
//Column model para el grid panel de comentarios
    cmGpCom = new Ext.grid.ColumnModel([//expander,
        {id: 'expandir', header: perfil.etiquetas.lbAsunto, dataIndex: 'asunto', tooltip: 'Asunto'},
        {header: perfil.etiquetas.lbDescripcion, width: 270, dataIndex: 'descripcion', tooltip: 'Descripcion'},
        {header: perfil.etiquetas.lbUser, width: 80, dataIndex: 'usuario', tooltip: 'Usuario'},
        {header: perfil.etiquetas.lbfecha, width: 80, dataIndex: 'fechacreado', tooltip: 'Fecha'}
    ]);
    smGpCom = new Ext.grid.RowSelectionModel({singleSelect: true});

    //Filtros de Comentario
    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
    Ext.grid.filter.String_adaptadoFilter.prototype.icon = perfil.dirImg + 'cross.png';


    filtrosComentario = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'asunto'
            }, {
                type: 'string',
                dataIndex: 'descripcion'
            }, {
                type: 'list',
                options: [perfil.etiquetas.lbCorrectivo, perfil.etiquetas.lbInformativo, perfil.etiquetas.lbError],
                dataIndex: 'tcomentario'
            }, {
                type: 'string',
                dataIndex: 'usuario'

            }, {
                type: 'date',
                dataIndex: 'fechacreado',
                dateFormat: 'd-m-Y',
                beforeText: perfil.etiquetas.lbFiltroFechaAntesDe,
                afterText: perfil.etiquetas.lbFiltroFechaDespuesDe,
                onText: perfil.etiquetas.lbFiltroFechaEn
            }]
    });

    btnLimpiar = new Ext.Toolbar.Button({
        iconCls: 'limpiar',
        tabIndex: 11,
       // icon: perfil.dirImg + 'limpiar.png',
        //text:'Limpiar',
        tooltip: 'Limpiar filtro(s) <b>(Alt+L)</b>',
       // text: '<u>L</u>impiar',
        id: 'btnLimpiar',
        disabled: false,
        handler: function() {
            accionLimpiar();
        }

    });



// {Este es el grid panel del modelo en si, donde se cargan los datos del modelo}
    gpComent = new Ext.grid.GridPanel({
        frame: true,
        title: perfil.etiquetas.lbComentarios,
        autoExpandColumn: 'expandir',
        store: stGpCom,
        plugins: filtrosComentario,
        margins: '2 2 2 -4',
        sm: smGpCom,
        cm: cmGpCom,
        loadMask: {msg: perfil.etiquetas.lbCargando},
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stGpCom,
            displayInfo: true,
            items: [btnLimpiar]
        }),
        md: new Ext.menu.Menu({
            id: 'mdgpcom',
            items: [{
                    text: perfil.etiquetas.lbModificarC,
                    icon: perfil.dirImg + 'modificar.png',
                    iconCls: 'btn',
                    id: 'modcoment',
                    handler: function() {
                        fpComent.getForm().reset();
                        winAddComent.show(Ext.getBody());
                        winAddComent.setTitle(perfil.etiquetas.lbModificarC);
                        Ext.getCmp('idcomentario').setValue(gpComent.getSelectionModel().getSelected().data.idcomentario);
                        Ext.getCmp('asunto').setValue(gpComent.getSelectionModel().getSelected().data.asunto);
                        Ext.getCmp('descripcioncoment').setValue(gpComent.getSelectionModel().getSelected().data.descripcion);
                    }
                }, {
                    text: perfil.etiquetas.lbEliminarC,
                    icon: perfil.dirImg + 'eliminar.png',
                    iconCls: 'btn',
                    id: 'delcoment',
                    handler: function() {
                        eliminarComentario();
                    }
                }]
        }),
        listeners: {
            rowcontextmenu: function(g, r, e) {
                e.stopEvent();
                gpComent.getSelectionModel().selectRow(r);
                gpComent.md.showAt(e.getXY());
            }
        }
    });


    // formulario fpGestNom
    fpComent = new Ext.FormPanel({
        labelAlign: 'top',
        id: 'fpComent',
        frame: true,
        bodyStyle: 'padding:5px 5px 0',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: .6,
                        layout: 'form',
                        items: [{
                                xtype: 'textfield',
                                fieldLabel: perfil.etiquetas.lbAsunto,
                                id: 'asunto',
                                regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _-]*)+$/,
                                anchor: '95%',
                                allowBlank: false
                            }, {
                                xtype: 'hidden',
                                id: 'idcomentario'
                            }, {
                                xtype: 'hidden',
                                id: 'idelemcoment'
                            }]
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: [{
                                xtype: 'textarea',
                                fieldLabel: perfil.etiquetas.lbDescripcionC,
                                id: 'descripcioncoment',
                                anchor: '100%',
                                allowBlank: false
                            }]
                    }]
            }]
    });

    // Ventana para formulario de adicion y modificacion de comentarios
    winAddComent = new Ext.Window({modal: true, closeAction: 'hide', layout: 'fit',
        text: perfil.etiquetas.lbModificarC,
        constrain: true,
        width: 480, height: 210, items: fpComent,
        buttons: [{icon: perfil.dirImg + 'cancelar.png', iconCls: 'btn',
                text: perfil.etiquetas.lbBtnCancelar,
                handler: function() {
                    fpComent.getForm().reset();
                    winAddComent.hide();
                }
            }, {icon: perfil.dirImg + 'aceptar.png', iconCls: 'btn',
                text: perfil.etiquetas.lbBtnAceptar,
                handler: function() {
                    adicionarComentario();
                }}
        ]
    });

    function adicionarComentario(apl) {
        if (fpComent.getForm().isValid()) {
            fpComent.getForm().submit({
                url: '../gestcomentario/adicionarComentario',
                waitMsg: perfil.etiquetas.lbAdicionarCC,
                params: {idtipodocumento: idtipodoc, idelemento: Ext.getCmp('idelemcoment').getValue()},
                failure: function(form, action) {
                    if (action.result.codMsg == 1 || action.result.codMsg == 3) {
                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                        gpComent.getStore().reload();
                        fpComent.getForm().reset();
                        winAddComent.hide();
                    }
                }
            });
        } else
            mostrarMensaje(1, perfil.etiquetas.msgEstadoCampo);
    }

// function eliminarNomenclador
    function eliminarComentario() {
        mostrarMensaje(2, perfil.etiquetas.msgE1, elimina);
        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                Ext.getBody().mask(perfil.etiquetas.lbEspere);
                Ext.Ajax.request({
                    url: '../gestcomentario/eliminarComentario',
                    params: {idcomentario: gpComent.getSelectionModel().getSelected().data.idcomentario},
                    callback: function(options, success, response) {
                        Ext.getBody().unmask();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1 || responseData.codMsg == 3) {
                            mostrarMensaje(responseData.codMsg, responseData.mensaje, function() {
                                gpComent.getStore().reload();
                            });
                        }
                    }
                });
            }
        }
    }

    function cambiarTituloFiltrarCometario() {
        var filtrado_por = "";
        var sep = "/";
        if (filtrosComentario.getFiltrosActivos() == undefined || filtrosComentario.getFiltrosActivos().length == 0)
        {
            gpComent.setTitle(perfil.etiquetas.lbComentarios);
        } else {
            for (i = 0; i < filtrosComentario.getFiltrosActivos().length; i++) {
                var aux = "";
                if (filtrosComentario.getFiltrosActivos()[i].dataIndex == "asunto") {
                    aux = perfil.etiquetas.lbAsunto;
                } else if (filtrosComentario.getFiltrosActivos()[i].dataIndex == "descripcion") {
                    aux = perfil.etiquetas.lbDescripcion;
                } else if (filtrosComentario.getFiltrosActivos()[i].dataIndex == "tcomentario") {
                    aux = perfil.etiquetas.lbComentarios;
                } else if (filtrosComentario.getFiltrosActivos()[i].dataIndex == "usuario") {
                    aux = perfil.etiquetas.lbUser;
                } else if (filtrosComentario.getFiltrosActivos()[i].dataIndex == "fechacreado") {
                    aux = perfil.etiquetas.lbfecha;
                }

                if (i == filtrosComentario.getFiltrosActivos().length - 1) {
                    sep = "";
                }
                filtrado_por += aux + sep;
            }

            gpComent.setTitle(perfil.etiquetas.lbFiltradoPor + filtrado_por + '</i>');

            filtrado_por = "";
        }
    }

    function accionLimpiar() {
        filtrosComentario.clearFilters();

    }
    function siexistecomentarioFiltrado() {

        if (filtrosComentario.getFiltrosActivos().length > 0 && stGpCom.getCount() == 0)
            mostrarMensaje(1, perfil.etiquetas.msgBuscar);
    }










}

