// var perfil = eval(uneval(window.parent.UCID.portal.perfil));
var perfil = window.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.etiquetas = Object(); 
UCID.portal.cargarEtiquetas('importar', cargarInterfaz);
var winImp, rectora;
var objci = {
    acciones: []
};
var gpImportar, gfFiltros, stCmbConcepto;
var dataIndexSelecc = null;
var columns_selecc = [];
var tieneAccionActualizar = false;

function cargarInterfaz() {
    // Botones btnAdicionar btnModificar btnEliminar btnAyuda

    UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function() {
        objci.acciones = [];
        for (i in acciones_reportes) {
            objci.acciones[acciones_reportes[i].abreviatura] = true;

        }
        if (objci.acciones.rector == true) {
            rectora = 1;
        }
        else {
            rectora = 0;
        }
    });

    /*********TECLAS CALIENTES**********/

    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'Hh',
            alt: true,
            fn: function() {
                mostrarAyuda('Importar');
            }
        }, {
            key: 46,
            fn: function() {
                eliminarElemento(gpImportar.getSelectionModel().getSelections());
            }
        },
        {
            key: 'Ll',
            fn: function() {
                seleccBtnLimpiar();
            }
        },
        {
            key: 'Ii',
            ctrl: true,
            alt: true,
            fn: function() {
                winFp('Imp');
            }
        }

    ]);

    btnImp = new Ext.Button({
        handler: function() {
            winFp('Imp');
        },
        text: perfil.etiquetas.lbImportar,
        disabled: true,
        tooltip: perfil.etiquetas.lbTtImportar,
        id: 'btnImp',
        icon: perfil.dirImg + 'importar.png',
        iconCls: 'btn'
    });
    btnDel = new Ext.Button({
        handler: function() {
            eliminarElemento(gpImportar.getSelectionModel().getSelections());
        },
        text: 'Eliminar',
        disabled: true,
        id: 'btnDel',
        tooltip: 'Eliminar (<b>DEL</b>)',
        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'btn'
    });
    btnDelAll = new Ext.Button({
        handler: function() {
            eliminarTodos();
        },
        text: 'Eliminar todos',
        disabled: true,
        id: 'btnDelAll',
        tooltip: 'Eliminar todos',
        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'btn'
    });
    btnAyuda = new Ext.Button({
//        handler: function() {
//            mostrarAyuda('Importar');
//        },
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbTtBtnAyuda,
        id: 'btnAyuim',
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn'
    });

    // ********* Limpiar ****************
    btnLimpiarFiltros = new Ext.Button({
        disabled: false,
        id: 'btnLimpiarFiltros',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbTtbtnLimpiarFiltros,
        text: perfil.etiquetas.lbBtnLimpiar,
        handler: function() {
            seleccBtnLimpiar();
        }
    });

    reader = new Ext.data.JsonReader({
        totalProperty: "total",
        root: "data",
        id: 'id'
    }, [{
            name: 'iddatosnomenclador'
        }]
            );

    stCbPaginado = new Ext.data.SimpleStore({
        fields: ['idnumpag', 'dennumpag'],
        data: [
            [20, '20'],
            [100, '100'],
            [500, '500'],
            [1000, '1000'],
            [1500, '1500'],
            [2000, '2000'],
            [2500, '2500'],
            [3000, '3000']]
    });

    //combo del modo donde muestro la cantidad de elementos por paginas del grid
    cbPaginado = new Ext.form.ComboBox({
        value: 20,
        store: stCbPaginado,
        displayField: 'dennumpag',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpag',
        valueField: 'idnumpag',
        width: 60,
        emptyText: 'Seleccionar',
        listeners: {
            select: function(cb, record, index) {
                Ext.getCmp('pagtollbar').pageSize = record.data.idnumpag;
                Ext.getCmp('pagtollbar').doLoad(Ext.getCmp('pagtollbar').cursor);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    })

    // Store grid stGpImportar
    stGpImportar = new Ext.data.GroupingStore({
        url: 'listar',
        listeners: {
            beforeload: function() {
                cambiarTituloFiltrarImportarElem();
                this.baseParams.idconcepto = Ext.getCmp('tbCmbConcepto').getValue();
            },
            'load': function() {
                smGpImportar.selectFirstRow();
                if (stGpImportar.getCount() == 0) {
                    mostrarMensaje(1, perfil.etiquetas.msgBuscar);

                }
            }
        },
        reader: reader,
        groupField: 'iddatosnomenclador'
    });
    stCmbConcepto = new Ext.data.Store({
        url: 'listarConceptos',
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "idconcepto"
        }, [{
                name: 'idconcepto'
            }, {
                name: 'denominacion'
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
            },
            load: function(_this, records, options) {
                tieneAccionActualizar = false;
                Ext.each(records, function(item, index) {
                    if (item.data.idtipoaccion == 2) {
                        tieneAccionActualizar = true;
                        return;
                    }
                });
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "idtipoaccion"
        }, [{
                name: 'idconfiguracion'
            }, {
                name: 'idtipoaccion'
            }, {
                name: 'denominacion'
            }]
                )
    });
    stCmbFormato = new Ext.data.Store({
        url: 'listarFormatos',
        listeners: {
            beforeload: function(_this, records, options) {

            },
            load: function(_this, records, options) {

            }
        },
        reader: new Ext.data.JsonReader({
            //totalProperty: "total",
            root: "data",
            id: "idformato"
        }, [{
                name: 'idformato'
            }, {
                name: 'nombre'
            }]
                )
    });
    // formulario fpImportar

    stEstadosColumnas = new Ext.data.Store({
        url: 'listarEstadosColumna',
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "iddatosnomenclador"
        }, [{
                name: 'iddatosnomenclador'
            }, {
                name: 'denominacion'
            }, {
                name: 'uridatosnomenclador'
            }]),
        listeners: {
            load: function() {
                this.getAt(this.find('iddatosnomenclador', '-1')).data.denominacion = "Vacio";
                this.getAt(this.find('iddatosnomenclador', '-1')).commit();
            }
        }
    });
    stEstadosColumnas.load();

    fpImportar = new Ext.FormPanel({
        labelAlign: 'top',
        fileUpload: true,
        frame: true,
        bodyStyle: 'padding:5px 5px 0',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: .5,
                        layout: 'form',
                        items: [new Ext.form.ComboBox({
                                emptyText: perfil.etiquetas.lbSeleccione,
                                id: 'cmbConcepto',
                                fieldLabel: perfil.etiquetas.lbConceptoImportar,
                                store: stCmbConcepto,
                                displayField: 'denominacion',
                                allowBlank: false,
                                triggerAction: 'all',
                                readOnly: true,
                                valueField: 'idconcepto',
                                mode: 'local',
                                anchor: '95%'
                            })]
                    }, {
                        columnWidth: .5,
                        layout: 'form',
                        items: [new Ext.form.ComboBox({
                                emptyText: perfil.etiquetas.lbSeleccione,
                                fieldLabel: perfil.etiquetas.lbTipoDocumento,
                                store: new Ext.data.Store({
                                    url: 'listarTipoDocumentos',
                                    autoLoad: 'true',
                                    reader: new Ext.data.JsonReader({
                                        totalProperty: "total",
                                        root: "data",
                                        id: "idtipodocumento"
                                    }, [{
                                            name: 'idtipodocumento'
                                        }, {
                                            name: 'denominacion'
                                        }]
                                            )
                                }),
                                displayField: 'denominacion',
                                allowBlank: false,
                                triggerAction: 'all',
                                readOnly: true,
                                valueField: 'idtipodocumento',
                                mode: 'local',
                                anchor: '100%'
                            })]
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: [{
                                xtype: 'fileuploadfield',
                                fieldLabel: perfil.etiquetas.lbDocumentoImportar,
                                id: 'form-file',
                                emptyText: perfil.etiquetas.lbSeleccioneFich,
                                name: 'file',
                                anchor: '100%',
                                width: 500,
                                buttonCfg: {
                                    text: '',
                                    iconCls: 'btn',
                                    icon: perfil.dirImg + 'buscar.png'
                                },
                                allowBlank: false
                            }]
                    }]
            }]
    });
    // Selection Model grid smGpImportar
    smGpImportar = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(_this, rowindex, record) {
                btnDel.enable();
            },
            rowdeselect: function() {
                if (gpImportar.getSelectionModel().getSelections().length == 0)
                    btnDel.disable();
                else
                    btnDel.enable();
            }
        }
    });
    // Grid gestion gpImportar

    gfFiltros = new Ext.grid.GridFilters({
        filters: [{
                type: 'listado',
                dataIndex: 'iddatosnomenclador',
                idcombo: 'iddatosnomenclador',
                urlcb: ' listarEstadosColumna',
                idstore: 'iddatosnomenclador',
                valueFieldcb: 'iddatosnomenclador',
                displayFieldcb: 'denominacion',
                numeropeticiones: 5,
                store: stEstadosColumnas,
                width: 150
            }
        ]
    });

    gpImportar = new Ext.grid.GridPanel({
        id: 'gpImportar',
        frame: true,
        region: 'center',
        store: stGpImportar,
        margins: '2 2 2 -4',
        sm: smGpImportar,
        autoScroll: true,
        autoWidth: true,
        autoExpandColumn: 'expand',
        plugins: [gfFiltros],
        view: new Ext.grid.GroupingView({
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Estados" : "Estado"]})'
        }),
        columns: [{
                // width:100,
                id: 'expand'
            }],
        loadMask: {
            store: stGpImportar
        },
        tbar: [{
                xtype: 'tbtext',
                text: perfil.etiquetas.lbConcepto
            }, new Ext.form.ComboBox({
                emptyText: perfil.etiquetas.lbSeleccione,
                id: 'tbCmbConcepto',
                store: stCmbConcepto,
                displayField: 'denominacion',
                allowBlank: false,
                triggerAction: 'all',
                readOnly: true,
                valueField: 'idconcepto',
                mode: 'remote',
                listeners: {
                    valid: function() {
                        btnDelAll.enable();
                    },
                    select: function(c, rc, rn) {
                        cbPaginado.setValue(20);
                        Ext.getCmp('btnImp').enable();
                        if (rc) {
                            var barra = Ext.MessageBox.show({
                                msg: perfil.etiquetas.lbCargando,
                                width: 270,
                                wait: true,
                                progress: true,
                                closable: false

                            });
                            Ext.getCmp('formato').enable();
                            stCmbFormato.load()

                            stCmbAccion.reload({
                                callback: function() {

                                    barra.hide();
                                    Ext.getCmp('tbCmbAccion').enable();

                                    Ext.getCmp('btnAceptarAccion').disable();
                                    Ext.getCmp('tbCmbAccion').reset();
                                    gpImportar.reconfigImportacion(rc.data.idconcepto);
                                }
                            });
                        } else {
                            Ext.getCmp('tbCmbAccion').disable();

                        }
                    }
                }
            }), {
                xtype: 'tbspacer'
            }, {
                xtype: 'tbspacer'
            }, {
                xtype: 'tbspacer'
            }, {
                xtype: 'tbtext',
                text: 'Formatos: '
            }, new Ext.form.ComboBox({
                emptyText: perfil.etiquetas.lbSeleccione,
                fieldLabel: perfil.etiquetas.lbTipoAccion,
                id: 'formato',
                disabled: false,
                store: stCmbFormato,
                displayField: 'nombre',
                allowBlank: false,
                triggerAction: 'all',
                readOnly: true,
                valueField: 'idformato',
                mode: 'local',
                listeners: {
                    select: function(c, rc, rn) {
                        if (rc) {
                            Ext.getCmp('btnAceptarAccion').enable();
                        } else {
                            Ext.getCmp('btnAceptarAccion').disable();
                        }
                    }
                }
            }), {
                xtype: 'tbspacer'
            }, {
                xtype: 'tbspacer'
            }, {
                xtype: 'tbspacer'
            }, {
                xtype: 'tbtext',
                text: 'Acción: '
            }, new Ext.form.ComboBox({
                emptyText: perfil.etiquetas.lbSeleccione,
                fieldLabel: perfil.etiquetas.lbTipoAccion,
                id: 'tbCmbAccion',
                disabled: true,
                store: stCmbAccion,
                displayField: 'denominacion',
                allowBlank: false,
                triggerAction: 'all',
                readOnly: true,
                valueField: 'idtipoaccion',
                mode: 'local',
                listeners: {
                    select: function(c, rc, rn) {
                        if (rc) {
                            Ext.getCmp('btnAceptarAccion').enable();
                        } else {
                            Ext.getCmp('btnAceptarAccion').disable();
                        }
                    }
                }
            }), {
                xtype: 'tbspacer'
            }, {
                xtype: 'tbspacer'
            }, {
                xtype: 'tbspacer'
            }, {
                xtype: 'button',
                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'btn',
                id: 'btnAceptarAccion',
                tooltip: perfil.etiquetas.lbAceptar,
                text: perfil.etiquetas.lbAceptar,
                disabled: true,
                search: function(array, id) {
                    var indice = -1;
                    Ext.each(array, function(item, index) {
                        if (item.id === id) {
                            indice = index;
                            return;
                        }
                    });
                    return indice;
                },
                handler: function() {
                    Ext.Msg.wait('Aplicando cambios', 'Por favor espere...');
                    Ext.Ajax.request({
                        url: 'realizaracciondatosimportados',
                        timeout: 7200000, //milisegundos = 120 min 2hrs
                        params: {
                            idaccion: Ext.getCmp('tbCmbAccion').getValue(),
                            idconfiguracion: stCmbAccion.getAt(0).data.idconfiguracion,
                            idconcepto: Ext.getCmp('tbCmbConcepto').getValue(),
                            rectora: rectora,
                            filtros: Ext.encode(getDataFiltrosActivos()),
                            cols_checked: Ext.encode(getColumnCheckeds())
                        },
                        callback: function(opcions, success, response) {
                            response = Ext.decode(response.responseText);
                            Ext.Msg.hide();
                            if (response.cod == 1) {
                                gpImportar.getStore().reload({
                                    callback: function() {
                                        if (response.idtipoaccion == 1)
                                            mostrarMensaje(1, perfil.etiquetas.lbDatosAdicionadosOk);
                                        else if (response.idtipoaccion == 2)
                                            mostrarMensaje(1, perfil.etiquetas.lbDatosActualizadosOk);
                                        else if (response.idtipoaccion == 3)
                                            mostrarMensaje(1, perfil.etiquetas.lbDatosAdicionadosActualizadosOk);
                                        else { //es 4
                                            mostrarMensaje(1, perfil.etiquetas.lbDatosValidadosOk);
                                        }
                                    }
                                });
                            }
                            else if (response.cod == 2) {
                                gpImportar.getStore().reload({
                                    callback: function() {
                                        if (response.idtipoaccion == 1)
                                            mostrarMensaje(1, perfil.etiquetas.lbDatosAdicionadosNoOk);
                                        else if (response.idtipoaccion == 2)
                                            mostrarMensaje(1, perfil.etiquetas.lbDatosActualizadosNoOk);
                                        else if (response.idtipoaccion == 3)
                                            mostrarMensaje(1, perfil.etiquetas.lbDatosAdicionadosActualizadosNoOk);
                                        else { //es 4
                                            mostrarMensaje(1, perfil.etiquetas.lbDatosValidadosNoOk);
                                        }
                                    }

                                })
                            }
                            else if (response.cod == 'vacio') {
                                gpImportar.getStore().reload({
                                    callback: function() {
                                        mostrarMensaje(1, perfil.etiquetas.lbDatosVacios);
                                    }

                                })
                            }
                            else if (response.cod == 3) {
                                gpImportar.getStore().reload({
                                    callback: function() {
                                        mostrarMensaje(3, perfil.etiquetas.lbErrorElementosExistentes);
                                    }

                                })
                            }

                        }
                    });
                }
            }],
        bbar: new Ext.PagingToolbar({
            id: 'pagtollbar',
            pageSize: 20,
            store: stGpImportar,
            displayInfo: true,
            items: ['-', btnLimpiarFiltros, '-', {
                    xtype: 'tbtext',
                    text: 'Resultados por p&aacute;gina : '
                }, cbPaginado]
        }),
        reconfigImportacion: function(conc) {
            var barra = Ext.MessageBox.show({
                msg: perfil.etiquetas.lbCargando,
                width: 270,
                wait: true,
                progress: true,
                closable: false

            });
            if (conc) {
                Ext.Ajax.request({
                    url: 'getConfigGrid',
                    params: {
                        idconcepto: conc
                    },
                    callback: function(op, success, r) {
                        r = Ext.decode(r.responseText);
                        if (r.codMsg == 7) {
                            reader = new Ext.data.JsonReader({
                                totalProperty: "total",
                                root: "data",
                                id: r.rd[0].name
                            }, r.rd);
                            stGpImportar.reader = reader;
                            stGpImportar.groupField = 'iddatosnomenclador';
                            stGpImportar.sortInfo = {
                                field: 'iddatosnomenclador',
                                direction: "ASC"
                            };
                            var exist_deno = false;
                            columns_selecc = [];
                            for (var i = 0; i < r.cm.length; i++) {
                                r.cm[i].checked_column = true;
                                if (r.cm[i].dataIndex == 'iddatosnomenclador') {
                                    r.cm[i].checked_column = undefined;
                                    r.cm[i].renderer = function(val) {
                                        if (stEstadosColumnas.getById(val) == undefined)
                                            return '-';
                                        var estcol = stEstadosColumnas.getById(val).data.denominacion;
                                        if (estcol != null)
                                            return estcol;
                                        return '-';
                                    }
                                    break;
                                } else if (r.cm[i] == 'denominacion' && !exist_deno) {
                                    exist_deno = true;
                                    r.cm[i].id = 'expand';
                                }
                                addFilter(r.cm[i].dataIndex, r.cm[i].datatype);
                            }
                            if (!exist_deno && r.cm[0] != null) {
                                r.cm[1].id = 'expand';
                            }

                            cm = new Ext.grid.ColumnModel(r.cm);
                            gpImportar.reconfigure(stGpImportar, cm);
                            stGpImportar.on('beforeload', function() {
                                Planificacion.ocultarMascara('idmask');
                                cambiarTituloFiltrarImportarElem();
                            });
                            gpImportar.getStore().reload({
                                params: {
                                    idconcepto: Ext.getCmp('tbCmbConcepto').getValue(),
                                    start: 0,
                                    limit: 20
                                },
                                callback: function() {
                                    barra.hide();
                                }
                            });
                            btnDel.disable();
                        }
                    }
                });
                barra.hide();
            }
        }
    });


    // viewport de la plantilla
    vpImportar = new Ext.Viewport({
        layout: 'border',
        items: {
            title: perfil.etiquetas.lbImportarElementos,
            id: "pcontenedor1",
            xtype: 'panel',
            region: 'center',
            layout: 'fit',
            tbar: [btnImp, btnDel, btnDelAll, '->', btnAyuda],
            items: [gpImportar]
        }
    });
    builReplaceValueInColumn(gpImportar);
    builSeleccInColumn(gpImportar);
    // Ventanas para formulario winFp(opcion)
    function winFp(opcion) {
        switch (opcion) {
            case 'Imp':
                {
                    if (!winImp) {
                        winImp = new Ext.Window({
                            modal: true,
                            closeAction: 'hide',
                            layout: 'fit',
                            title: perfil.etiquetas.lbImportarElemento,
                            width: 420,
                            height: 180,
                            buttons: [{
                                    icon: perfil.dirImg + 'cancelar.png',
                                    iconCls: 'btn',
                                    text: perfil.etiquetas.lbCancelar,
                                    tooltip: 'Cerrar ventana sin guardar los datos',
                                    handler: function() {
                                        winImp.hide();
                                    }
                                }, {
                                    icon: perfil.dirImg + 'aceptar.png',
                                    iconCls: 'btn',
                                    text: perfil.etiquetas.lbAceptar,
                                    tooltip: 'Guardar datos y cerrar ventana',
                                    handler: function() {
                                        adicionarElemento();
                                    }
                                }]
                        });
                    }
                    fpImportar.getForm().reset();
                    winImp.show();
                    winImp.add(fpImportar);
                    winImp.doLayout();
                    Ext.getCmp("cmbConcepto").setValue(Ext.getCmp("tbCmbConcepto").getValue());
                    Ext.getCmp("cmbConcepto").disabled = true;
                }
                break;
        }
    }

    function addFilter(dataIndex, type) {
        if (gfFiltros.getFilter(dataIndex) == undefined) {
            if (type == 'numeric')
                gfFiltros.addFilter({
                    type: 'numeric',
                    dataIndex: dataIndex
                });
            else {
                gfFiltros.addFilter({
                    type: 'string',
                    dataIndex: dataIndex
                });
            }
        }
    }

}

//function mostrarAyuda(referencia, title) {
//    var title = perfil.etiquetas.lbTituloAyuda;
//    var referencia = 'importar';
//    help.show(title, referencia);
//}

function eliminarElemento(elementos) {
    mostrarMensaje(2, perfil.etiquetas.lbConfirmacionEliminarElem, eliminar);
    function eliminar(keypressed) {
        if (keypressed == 'ok') {
            var els = new Array();
            for (var i = 0; i < elementos.length; i++) {
                els.push(elementos[i].id);
            }
            Planificacion.mostrarMascara('elim_mask', perfil.etiquetas.lbEspere, perfil.etiquetas.lbEliminandoDatos);
            Ext.Ajax.request({
                url: 'eliminarelementostemptable',
                params: {
                    idtempelements: Ext.encode(els),
                    idconcepto: Ext.getCmp('tbCmbConcepto').getValue()
                },
                callback: function(opcions, success, response) {
                    Planificacion.ocultarMascara('elim_mask');
                    response = Ext.decode(response.responseText);
                    if (response.cod == 1) {
                        response = Ext.decode(response.responseText);
                        gpImportar.getStore().reload({
                            callback: function() {
                                mostrarMensaje(1,
                                        perfil.etiquetas.lbEliminadoOk);
                            }
                        });
                    } else if (response.cod == 3) {
                        mostrarMensaje(3, perfil.etiquetas.lbOcurrioError);
                    }
                }
            });
        }
    }
}

function eliminarTodos() {
    mostrarMensaje(2,
            perfil.etiquetas.lbConfirmacionElimTodosElems, eliminar);
    function eliminar(keypressed) {
        if (keypressed == 'ok') {
            Planificacion.mostrarMascara('elim_mask', perfil.etiquetas.lbEspere, perfil.etiquetas.lbEliminandoDatos);
            Ext.Ajax.request({
                url: 'eliminartodoselementos',
                params: {
                    idconcepto: Ext.getCmp('tbCmbConcepto').getValue()
                },
                callback: function(opcions, success, response) {
                    Planificacion.ocultarMascara('elim_mask');
                    response = Ext.decode(response.responseText);
                    if (response.cod == 1) {
                        gpImportar.getStore().reload({
                            callback: function() {
                                mostrarMensaje(1,
                                        perfil.etiquetas.lbEliminadoTodosOk);
                            }
                        });
                    } else if (response.cod == 3) {
                        mostrarMensaje(3, perfil.etiquetas.lbOcurrioError);
                    }
                }
            });
        }
    }
}

function adicionarElemento(apl) {

    try {
        if (fpImportar.getForm().isValid())
        {
            var barra = Ext.MessageBox.show({
                msg: perfil.etiquetas.lbEspere,
                width: 270,
                wait: true,
                progress: true,
                closable: false

            });
            fpImportar.getForm().submit(
                    {
                        url: 'importarfichero',
                        timeout: 1800000, //milisegundos = 30 min
                        method: 'POST',
                        params: {
                            idconcepto: Ext.getCmp('cmbConcepto').getValue()
                        },
                        failure: function(form, action) {
                            barra.hide();
                            if (action.result.cod != 42 && action.result.cod != 53)
                            {
                                if (!apl)
                                    winImp.hide();
                                gpImportar.getStore().reload(
                                        {
                                            callback: function() {
                                                if (action.result.cod == 1)
                                                {
                                                    mostrarMensaje(1,
                                                            perfil.etiquetas.lbImportadosOk);
                                                }
                                                barra.hide();
                                            }
                                        });
                            } else {
                                if (action.result.cod == 42)
                                    mostrarMensaje(3, perfil.etiquetas.lbDocConFormatoIncorrecto);
                                if (action.result.cod == 53)
                                    mostrarMensaje(3,
                                            perfil.etiquetas.lbSoloDocConExtenXsl);
                            }
                        }

                    }

            );
        } else
            mostrarMensaje(1,
                    perfil.etiquetas.lbCamposIncorrectos);

    } catch (e) {
    }
}
;

function seleccBtnLimpiar() {
    gfFiltros.clearFilters();
}
;

function cambiarTituloFiltrarImportarElem() {
    var filtrado_por = "";
    var sep = "/";
    if (gfFiltros.getFiltrosActivos() == undefined || gfFiltros.getFiltrosActivos().length == 0) {
        Ext.getCmp('pcontenedor1').setTitle(perfil.etiquetas.lbImportarElementos);
    } else {
        for (i = 0; i < gfFiltros.getFiltrosActivos().length; i++) {
            var numberCol = gpImportar.getColumnModel().findColumnIndex(gfFiltros.getFiltrosActivos()[i].dataIndex);
            if (i == gfFiltros.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += gpImportar.getColumnModel().getColumnHeader(numberCol) + sep;
        }
        Ext.getCmp('pcontenedor1').setTitle(perfil.etiquetas.lbImportarElementos + "<i> " + perfil.etiquetas.lbFiltradoPor + filtrado_por + '</i>');
        filtrado_por = "";
    }
    showMenuReplace();
}
;
function getDataFiltrosActivos() {
    return gfFiltros.getFilterData();
}
;

function isActive(dataIndex) {
    var filter_activ = gfFiltros.getFiltrosActivos();
    var exist = false;
    for (var i = 0; i < filter_activ.length; i++) {
        if (filter_activ[i].dataIndex == dataIndex)
            return true;
    }
    return false;
}
;

function isSelected(dataIndex) {
    var cm = gpImportar.getColumnModel();
    var exist = false;
    for (var i = 0; i < cm.config.length; i++) {
        if (cm.config[i].dataIndex != undefined)
            if (cm.config[i].dataIndex == dataIndex)
                return cm.config[i].checked_column;
    }
    return false;
}
;

function setColumnSelected(dataIndex, val) {
    var cm = gpImportar.getColumnModel();
    for (var i = 0; i < cm.config.length; i++) {
        if (cm.config[i].dataIndex != undefined)
            if (cm.config[i].dataIndex == dataIndex) {
                cm.config[i].checked_column = val;
                return;
            }
    }
}
;

function getColumnCheckeds() {
    var cm = gpImportar.getColumnModel();
    var column_checkeds = [];
    for (var i = 0; i < cm.config.length; i++) {
        if (cm.config[i].dataIndex != undefined)
            if (cm.config[i].checked_column == true) {
                column_checkeds.push({
                    column_name: cm.config[i].dataIndex
                });
            }
    }
    return column_checkeds;
}
;

function builReplaceValueInColumn(pgrid) {
    var view = pgrid.getView();
    pgrid.getView().hmenu.addItem(new Ext.menu.Separator({
        id: 'seperadorreemplazar'
    }));
    pgrid.getView().hmenu.add(new Ext.menu.Item({
        text: "Remplazar",
        id: 'mnremplazar',
        icon: perfil.dirImg + 'buscaryremplazar.png',
        menu: new Ext.menu.Menu()
    }));

    //seleccionar columna
    tfreplace = new Ext.menu.TextFieldItem({
        icon: perfil.dirImg + 'pegar.png'
    });
    tfreplace.loadConfig(
            'string_adaptado',
            'tfremplazar',
            '95%',
            '',
            false,
            '',
            '',
            ''
            );
    tfreplace.on('keyup', function(event) {
        if (event.getKey() == event.ENTER) {
            replace(dataIndexSelecc, this.getValue());
            this.setValue('');
            gpImportar.getView().hmenu.hide(false);
            return;
        }
        if (event.getKey() == event.ESC) {
            this.setValue('');
            return;
        }
        if (event.getKey() == event.DELETE) {
            this.setValue('');
        }
    }, null);
    Ext.getCmp('mnremplazar').menu.add(tfreplace);

    pgrid.on('headermousedown', function(grid, colIndex, e) {
        dataIndexSelecc = pgrid.getColumnModel().getDataIndex(colIndex);
    });

    pgrid.getView().hmenu.on('beforeshow', function() {
        showMenuReplace();
    });
}
;

function deleteSeleccInColumn(pgrid) {
    if (Ext.getCmp('checkmnSelecc') != undefined) {
        Ext.getCmp('checkmnSelecc').hide();
        Ext.getCmp('checkmnSelecc').hide();
    }
}

function builSeleccInColumn(pgrid) {
    pgrid.getView().hmenu.addItem(new Ext.menu.Separator({
        id: 'seperadorselcccolumn'
    }));
    pgrid.getView().hmenu.add(new Ext.menu.CheckItem({
        text: "Selccionado",
        id: 'checkmnSelecc'
    }));
    Ext.getCmp('checkmnSelecc').on('checkchange', function(ck, checked) {
        setColumnSelected(dataIndexSelecc, checked);
    });
}
;

function showMenuReplace() {
    if (dataIndexSelecc == 'iddatosnomenclador') {
        Ext.getCmp('seperadorreemplazar').hide();
        Ext.getCmp('mnremplazar').hide();
        Ext.getCmp('seperadorselcccolumn').hide();
        Ext.getCmp('checkmnSelecc').hide();
    } else {
        Ext.getCmp('seperadorreemplazar').show();
        Ext.getCmp('mnremplazar').show();

        if (tieneAccionActualizar) {
            Ext.getCmp('seperadorselcccolumn').show();
            Ext.getCmp('checkmnSelecc').show();
            Ext.getCmp('checkmnSelecc').setChecked(isSelected(dataIndexSelecc));
        } else {
            Ext.getCmp('seperadorselcccolumn').hide();
            Ext.getCmp('checkmnSelecc').hide();
        }
        if (isActive(dataIndexSelecc))
            Ext.getCmp('mnremplazar').enable();
        else
            Ext.getCmp('mnremplazar').disable();
    }
}

function replace(dataIndex, valor) {
    Planificacion.mostrarMascara('replace_mask', perfil.etiquetas.lbEspere, "Reemplazando valores");
    Ext.Ajax.request({
        url: 'remplazarValor',
        timeout: 7200000, //milisegundos = 120 min 2hrs
        params: {
            campo: dataIndex,
            nuevoval: valor,
            filtros: Ext.encode(getDataFiltrosActivos()),
            idconcepto: Ext.getCmp('tbCmbConcepto').getValue()
        },
        callback: function(opcions, success, response) {
            Planificacion.ocultarMascara('replace_mask');
            response = Ext.decode(response.responseText);
            if (response.cod == 1) {
                gpImportar.getStore().reload({
                    callback: function() {
                        mostrarMensaje(1, perfil.etiquetas.lbValoresRemplazadosOk);
                    }
                });
            }
            else if (response.cod == 2) {
                gpImportar.getStore().reload({
                    callback: function() {
                        mostrarMensaje(1, perfil.etiquetas.lbValoresRemplazadosNo);
                    }

                })
            }

        }
    });
}

    