var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('importardocumento', cargarInterfaz);
var winImp;
var objci;
// Etiquetas para copiar para el fichero de lenguaje y temporalmente colocadas

// function CargarInterfaz
function cargarInterfaz() {
    // Botones btnAdicionar btnModificar btnEliminar btnAyuda
    mymask = new Ext.LoadMask(
            Ext.getBody(), {
        msg: 'Eliminando'
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
                /*if (objci.acciones.rector) {//organo rector                
                 btnDel.enable();
                 } else {
                 btnDel.disable();
                 Ext.getCmp('form-importardocumento').disable();
                 }*/
            }
            );
        }
    });
    btnDel = new Ext.Button({
        handler: function() {
            eliminarElemento(gpImportardocumento.getSelectionModel().getSelections());
        },
        id: 'btnDeldocumento',
        iconCls: 'eliminar',
        tooltip: 'Eliminar documento (<b>DEL</b>)'
    });
    btnAyuda = new Ext.Button({
        handler: function() {
            //mostrarAyuda('Importar documento');
        },
        text: 'Ayuda',
        id: 'btnAyudoc',
        iconCls: 'ayuda',
        tooltip: 'Mostrar ayuda (<b>Alt+H</b>)'
    });
    btnLimpiarFiltros = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltros',
        iconCls: 'limpiar',
        tooltip: 'Limpiar' + ' (<b>Alt+L</b>)',
        handler: function() {
            seleccBtnLimpiar();
        }
    });
    stTipoMaterial = new Ext.data.Store({
        url: 'listartipomaterial',
        listeners: {
            load: function() {
                //stGpImportardocumento.reload({params: {start: 0, limit: 20}});
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "idtipomaterial"
        }, [{
                name: 'idtipomaterial'
            }, {
                name: 'denominacion'
            }]
                )
    });
    stTipo = new Ext.data.Store({
        url: 'listartipomaterial',
        autoLoad: true,
        listeners: {
            load: function() {
                stGpImportardocumento.reload({params: {start: 0, limit: 20}});
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "idtipomaterial"
        }, [{
                name: 'idtipomaterial'
            }, {
                name: 'denominacion'
            }]
                )
    });
    // Store grid stGpImportardocumento
    stGpImportardocumento = new Ext.data.Store({
        url: 'listardocumentos',
        listeners: {
            beforeload: function() {
              //  filtrosimportardocumento();
            },
            load: function() {
                if (stGpImportardocumento.getCount() == 0) {
                    mostrarMensaje(1, "No existen datos que mostrar.");
                }
                else
                    smGpImportardocumento.selectFirstRow();

            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'cargo'

        }, [{
                name: 'denominacion'
            }, {
                name: 'tipomaterial'
            }, {
                name: 'cargo'
            }, {
                name: 'fecha'
            }, {
                name: 'hora'
            }]
                )
    });
    stCmbAccion = new Ext.data.Store({
        url: 'listarTipoAccion',
        listeners: {
            beforeload: function(_this, records, options) {
                _this.baseParams = {
                    idconcepto: Ext.getCmp('tbCmbConcepto').getValue()
                };
                filtrosimportardocumento();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "idtipoaccion"
        }, [{
                name: 'idtipoaccion'
            }, {
                name: 'denominacion'
            }]
                )
    });
    function seleccBtnLimpiar() {
        filtrosImportarDocumento.clearFilters();
    }

    filtrosImportarDocumento = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'listado',
                dataIndex: 'tipomaterial',
                idcombo: 'cbtipomaterial',
                valueFieldcb: 'idtipomaterial',
                displayFieldcb: 'denominacion',
                st: stTipo,
                autoload: false,
                mode: 'local'
            }, {
                type: 'date',
                dataIndex: 'fecha'
            }, {
                type: 'numeric',
                dataIndex: 'hora'
            }]
    });
    // Selection Model grid smGpImportardocumento
    smGpImportardocumento = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function(_this, rowindex, record) {
                btnDel.enable();
            },
            rowdeselect: function() {
                /*if (smGpImportardocumento.getSelections().length == 0)
                 btnDel.disable();
                 else
                 btnDel.enable();*/
            }
        }
    });
    /*smGpImportar = new Ext.grid.RowSelectionModel({
     singleSelect: false,
     listeners: {
     rowselect: function (_this, rowindex, record) {
     btnDel.enable();
     },
     rowdeselect: function () {
     if (GpImportardocumento.getSelectionModel().getSelections().length == 0)
     btnDel.disable();
     else
     btnDel.enable();
     }
     }
     });*/

    /**
     * menu del click derecho del grid
     */
    menuImportarDoc = new Ext.menu.Menu({
        id: 'menuDesglose',
        //disabled: true,
        listeners: {},
        items: [{
                text: 'Eliminar',
                iconCls: 'eliminar',
                id: 'mdEliminarDesglose',
                tooltip: 'Eliminar documento',
                handler: function() {

                }
            }]
    });
    //Grid panel
    gpImportardocumento = new Ext.grid.GridPanel({
        id: 'gpImportardocumento',
        title: 'Documentos importados',
        frame: true,
        store: stGpImportardocumento,
        autoExpandColumn: 'expandir',
        sm: smGpImportardocumento,
        //md: menuImportarDoc,
        plugins: filtrosImportarDocumento,
        columns: [{
                id: 'expandir',
                header: "Denominación",
                width: 100,
                dataIndex: 'denominacion',
                tooltip: 'Denominación',
                renderer: function(value, p, record) {
                    p.attr = 'ext:qtip="' + value + '"';
                    return String.format(
                            '<a href="abrirdocumento?iddocumento=' + record.data.cargo + '">{0}</a>',
                            value, record.data.idcargadocumento);
                }
            }, {
                header: "Tipo de material",
                dataIndex: 'tipomaterial',
                tooltip: 'Tipo de material',
                width: 200,
                renderer: renderTipoMaterial
            }, {
                header: "Fecha",
                width: 100,
                dataIndex: 'fecha',
                tooltip: 'Fecha',
                renderer: crearToolTip
            }, {
                header: "Hora",
                width: 100,
                dataIndex: 'hora',
                tooltip: 'Hora',
                renderer: crearToolTip
            }],
        loadMask: {
            store: stGpImportardocumento
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: stGpImportardocumento,
            displayInfo: true,
            items: [btnLimpiarFiltros]
        }),
        listeners: {
            rowdblclick: function(_this, row_index, record) {
            },
            rowcontextmenu: function(g, r, e) {
                e.stopEvent();
                g.getSelectionModel().selectRow(r);
                g.md.showAt(e.getXY());
            }
        },
        reconfigImportacion: function(conc) {
            if (conc) {
                mask = new Ext.LoadMask(gpImportardocumento.getEl(), {
                    msg: 'Cargando...'
                });
                mask.show();
                Ext.Ajax.request({
                    url: 'getConfigGrid',
                    params: {
                        idconcepto: conc
                    },
                    callback: function(op, success, r) {
                        r = Ext.decode(r.responseText);
                        if (r.codMsg == 7) {
                            gpImportardocumento.reconfigure(new Ext.data.Store({
                                url: 'listar',
                                listeners: {
                                    'load': function() {
                                        smGpImportardocumento.selectFirstRow();
                                    }
                                },
                                reader: new Ext.data.JsonReader({
                                    totalProperty: "total",
                                    root: "data",
                                    id: r.rd[0].name
                                }, r.rd
                                        )
                            }), new Ext.grid.ColumnModel(r.cm));
                            gpImportardocumento.getStore().reload({
                                params: {
                                    idconcepto: Ext.getCmp('tbCmbConcepto').getValue(),
                                    start: 0,
                                    limit: 20
                                },
                                callback: function() {
                                    mask.hide();
                                }
                            });
                            //btnDel.disable();
                        }
                    }
                });
            }
        }

    });
    pannel = new Ext.Panel({
        region: 'center',
        layout: 'fit',
        frame: true,
        id: 'content2',
        items: [gpImportardocumento],
        tbar: [{
                xtype: 'form',
                buttonAlign: 'left',
                id: 'form-importardocumento',
                fileUpload: true,
                width: 25,
                bodyStyle: "paddingTop: 7px;",
                items: [{
                        xtype: 'fileuploadfield',
                        tooltip: 'jkjk',
                        id: 'form-file',
                        emptyText: 'Seleccione el archivo ...',
                        hideLabel: true,
                        buttonOnly: true,
                        name: 'file',
                        buttonCfg: {
                            text: ':',
                            id: 'idbutton',
                            iconCls: 'importar',
                            tooltip: "Cargar documento"
                                    //icon: perfil.dirImg + 'importar.png'
                        },
                        listeners: {
                            fileselected: function(_this, file_name) {
                                var array = file_name.split('.');
                                var extencion = array[array.length - 1].toLowerCase();
                                if (extencion == "pdf") {
                                    winTipoMaterial = new Ext.Window({
                                        title: 'Seleccione el tipo de material',
                                        closeAction: 'destroy',
                                        constrain: true,
                                        width: '400',
                                        listeners: {
                                            beforedestroy: function(_this) {
                                            }
                                        },
                                        buttons: [{
                                                text: 'Aceptar',
                                                iconCls: 'aceptar',
                                                handler: function() {
                                                    upFichero(file_name);
                                                    winTipoMaterial.destroy();
                                                }
                                            }, {
                                                text: 'Cancelar',
                                                iconCls: 'cancelar',
                                                handler: function() {
                                                    //upFichero(file_name);
                                                    winTipoMaterial.destroy();
                                                }
                                            }],
                                        items: [{
                                                xtype: 'form',
                                                frame: true,
                                                layout: 'form',
                                                items: [{
                                                        anchor: '100%',
                                                        xtype: 'combo',
                                                        fieldLabel: 'Tipo de material',
                                                        id: 'cmbTipoMaterial',
                                                        emptyText: 'Seleccione tipo de material',
                                                        store: stTipoMaterial,
                                                        displayField: 'denominacion',
                                                        allowBlank: false,
                                                        triggerAction: 'all',
                                                        valueField: 'idtipomaterial',
                                                        mode: 'remote'
                                                    }]
                                            }]
                                    });
                                    winTipoMaterial.show();
                                } else {
                                    mostrarMensaje(1, "S&oacute;lo se permiten ficheros de tipo .PDF");
                                }
                            }
                        }
                    }]
            }, btnDel, '->', btnAyuda]
    });
    // viewport de la plantilla
    vpImportardocumento = new Ext.Viewport({
        layout: 'border',
        items: [pannel]
    });
    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Gg',
            alt: true,
            fn: function() {
            }
        }, {
            key: 'Hh',
            alt: true,
            fn: function() {
                mostrarAyuda('Importar documento');
            }
        }, {
            key: 46,
            alt: true,
            fn: function() {
                eliminarElemento(gpImportardocumento.getSelectionModel().getSelections());
            }
        }, {
            key: 'Hl',
            alt: true,
            fn: function() {
                seleccBtnLimpiar();
            }
        }
    ]);
}

function adicionarElemento(apl) {
    if (fpImportardocumento.getForm().isValid()) {
        fpImportardocumento.getForm().submit({
            url: 'Importardocumentofichero',
            waitMsg: 'Adicionando elemento ...',
            failure: function(form, action) {
                if (action.result.cod != 42) {
                    if (!apl)
                        winImp.hide();
                    gpImportardocumento.getStore().reload({
                        callback: function() {
                            if (action.result.cod == 1) {
                                mostrarMensaje(1, 'Se importaron los datos satisfactoriamente.');
                            }
                        }
                    });
                    btnModificar.disable();
                    btnEliminar.disable();
                } else {
                    mostrarMensaje(3, 'El formato del documento no es correcto.');
                }
            }
        });
    } else
        mostrarMensaje(1, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function renderTipoMaterial(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    //for (i = 0; i < filtro.getFiltrosActivos().length; i++) {
    for (i in stTipo.data.items)
        if (stTipo.data.items[i].data.idtipomaterial == value) {
            m.attr = 'ext:qtip="' + stTipo.data.items[i].data.denominacion + '"';
            return stTipo.data.items[i].data.denominacion;
        }
}

function eliminarElemento(elementos) {
    if (gpImportardocumento.getSelectionModel().getSelections().length == 1) {
        mostrarMensaje(2, '¿Est&aacute; seguro que quiere eliminar el elmento seleccionado?', eliminar);
    } else {
        mostrarMensaje(2, '¿Est&aacute; seguro que quiere eliminar los elmentos seleccionados?', eliminar);
    }

    function eliminar(keypressed) {
        if (keypressed == 'ok') {
            var els = new Array();
            for (var i = 0; i < elementos.length; i++) {
                els.push(elementos[i].id);
            }
            mymask.show();
            Ext.Ajax.request({
                url: 'eliminardocumento',
                params: {
                    file_name: gpImportardocumento.getSelectionModel().getSelected().data.denominacion
                },
                callback: function(opcions, success, response) {
                    mymask.hide();
                    response = Ext.decode(response.responseText);
                    if (response.cod == 1) {
                        stGpImportardocumento.reload();
                        /*gpImportardocumento.getStore().reload({
                         callback: function () {

                         });*/
                        if (gpImportardocumento.getSelectionModel().getSelections().length == 1) {
                            mostrarMensaje(1, 'Los documentos han sido eliminados satisfactoriamente.');
                        } else {
                            mostrarMensaje(1, 'El documento ha sido eliminado satisfactoriamente.');
                        }

                    } else if (response.cod == 3) {
                        mostrarMensaje(3, perfil.etiquetas.lbOcurrioError);
                    }
                }
            });
        }
    }
}

function filtrosimportardocumento() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosImportarDocumento.getFiltrosActivos() == undefined || filtrosImportarDocumento.getFiltrosActivos().length == 0) {
    } else {
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
        Ext.getCmp('content2').setTitle("Importar  documento" + ' filtrados por  : ' + filtrado_por);
        filtrado_por = "";
    }
}

function upFichero(file_name) {
    Planificacion.mostrarMascara('idmask_subirdoc', 'Por favor espere...', 'subiendo documento seleccionado');
    Ext.getCmp('form-importardocumento').getForm().submit({
        url: 'subirdocumento',
        method: 'POST',
        params: {
            file_name: file_name,
            idtipomaterial: Ext.getCmp('cmbTipoMaterial').getValue()
        },
        failure: function(form, action) {
            Planificacion.ocultarMascara('idmask_subirdoc');
            gpImportardocumento.getStore().reload({
                callback: function() {
                    if (action.result.cod == 1)
                        mostrarMensaje(1, 'El documento ha sido guardado satisfactoriamente.');
                    if (action.result.cod == 3)
                        mostrarMensaje(3, 'Lo sentimos, ha ocurrido un error.');
                }
            });
        }
    });
}