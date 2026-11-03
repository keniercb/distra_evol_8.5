var adicionar = true;
var winAdd, ctrladd = true, cfgridpanel, fsMod, fsEncabesado;
var tempTipoModeloSeleccionado = 0;
var urlListarConsolidacion = 'listarConsolidacion';
var urlListarIndModelo = '../gestmodelo/listarIndModelo';
var urlListar = '../gestmodelo/listarIndModelo';
var baseUrl = '../gestmodelo/';
var urlCbUM = '../gestmodelo/cargarunidadmedida';
var urlCbVA = '../gestmodelo/cargarviaadquision';
var urlCbOS = '../gestmodelo/cargarorganosatisface';
var urlCbPais = '../gestmodelo/listarPais';
var urlCbCentBalance = '../gestmodelo/listarCentroBalance';
var urlListarVerActXInd = '../gestmodelo/listarVerActXInd';
var cantidad = 0, precio = 0.000000, preciodivisa = 0.000000, fila, columna, jrStGpGestModelo;
var combNomencOld, combNomencNew, combNomenc, btnLimpiarFiltros, nfImporte, col;
var global_tree = 2;
var winAsociar, obj, sel, gpModelo, cmGp, entro, sel_, entro_, antedit, despedit, desaprobar, aprobarajuste;
var importes = [];
var puedeadicionar = 0; //variable para adicionar o no segun la configuracion de los permisos
var puedemodificar = 0; //variable para modificar o no segun la configuracion de los permisos
var puedeeliminar = 0; //variable para eliminar o no segun la configuracion de los permisos
var puedeguardar = 0; //variable para guardar o no segun la configuracion de los permisos
var ocultar = true;
var winImp;
iniciaModelo = function() {
    Ext.Ajax.timeout = 100000000;

    stGpGestModelo = new Ext.data.Store({
        url: urlListar,
        listeners: {
            beforeLoad: function() {
                Ext.Ajax.timeout = 600000; //10min
                stGpGestModelo.removeAll();
                this.baseParams.consolid = consolidado;
                this.baseParams.hoja = eshoja;
                this.baseParams.idmodelo = treesel;
                this.baseParams.identidadmodelo = tpBasePlan.getSelectionModel().getSelectedNode().attributes.DatEntidadmodelo[0].identidadmodelo;
            },
            load: function() {
                smGpGestModelo.selectFirstRow();
                calcularImporteTotal();
                if (puedeadicionar == 1 || puedemodificar == 1 || puedeeliminar == 1 || puedeguardar == 1) {
                    ocultar = false;
                }
                if (alert(objci.acciones.rector)) {
                    Ext.getCmp('btnAdicionarInds').disable();
                }


            }

        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: 'data',
            id: 'idplanificacion'
        }, [{
                name: 'idindicador'
            }, {
                name: 'idplanificacion'
            }, {
                name: 'denominacion'
            }, {
                name: 'codigo'
            }, {
                name: 'idaprobaciondemanda'
            }, {
                name: 'generadobasesplan'
            }, {
                name: 'estado'
            }, {
                name: 'idformato'
            }, {
                name: 'idpais'
            }, {
                name: 'idcentrobalance'
            }, {
                name: 'nivel'
            }, {
                name: 'descripcion'
            }, {
                name: 'naturaleza'
            }, {
                name: 'precio'
            }, {
                name: 'preciodivisa'
            }, {
                name: 'idumedida'
            }, {
                name: 'numeropieza'
            }, {
                name: 'flete'
            }, {
                name: 'contingencia'
            }, {
                name: 'viaadquisicion'
            }, {
                name: 'organosatisface'
            }, {name: 'idunidadmedida'}

        ])
    });
    tfImportePlan = new Ext.form.TextField({
        id: 'idtfImportePlan',
        width: 90,
        align: 'right',
        disabled: false,
        editable: false,
        emptyText: '0.000'
    });
    stCbImportesPlan = new Ext.data.SimpleStore({
        fields: ['idimporte', 'denominacion'],
        data: [
            [1, perfil.etiquetas.lbImporteMNTotal],
            [3, perfil.etiquetas.lbImporteFlete],
            [4, perfil.etiquetas.lbImporteConti],
            [5, perfil.etiquetas.lbImporteAjuste],
            [6, perfil.etiquetas.lbImporteFinal]
        ]
    });
    cbImportesPlan = new Ext.form.ComboBox({
        value: 1,
        id: 'idcbImportesPlan',
        store: stCbImportesPlan,
        displayField: 'denominacion',
        typeAhead: true,
        listWidth: 100,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idimporte',
        valueField: 'idimporte',
        width: 80,
        emptyText: 'Seleccionar',
        listeners: {
            select: function(cb, record, index) {
                tfImportePlan.setValue(importes[record.data.idimporte]);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    btnLimpiarFiltros = new Ext.Button({
        id: 'btntodoslimp',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtros.clearFilters();
            stGpGestModelo.reload();
        }
    });
    btnLimpiarFiltrosDemanda = new Ext.Button({
        id: 'btntodos',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        text: perfil.etiquetas.lbLimpiarFiltros,
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtrosGpdemandacentrobalance.clearFilters();
            stCmbEspecialidad.reload();
        }
    });

    btnLimpiarFiltrosVerAct = new Ext.Button({
        id: 'btnLimpiarFiltrosVerAct',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        text: 'Limpiar',
        tooltip: 'Limpiar filtro(s)',
        handler: function() {
            filtrosGpVerAct.clearFilters();
        }
    });
    if (objci.acciones.rector) {
        pgGestModelo = new Ext.PagingToolbar({
            pageSize: 20,
            id: 'pagGpModelo',
            store: stGpGestModelo,
            displayInfo: true,
            items: [btnLimpiarFiltros, '-', cbImportesPlan, {
                    xtype: 'tbtext',
                    text: '<b>:</b>'
                }, tfImportePlan]
        });
    } else {
        pgGestModelo = new Ext.PagingToolbar({
            pageSize: 20,
            id: 'pagGpModelo',
            store: stGpGestModelo,
            displayInfo: true,
            items: [btnLimpiarFiltros, '-', cbImportesPlan, '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', {
                    xtype: 'tbtext',
                    text: '<b>:</b>'
                }, tfImportePlan]
        });
    }

    Ext.menu.RangeMenu.prototype.icons = {
        gt: perfil.dirImg + 'greater_then.png',
        lt: perfil.dirImg + 'less_then.png',
        eq: perfil.dirImg + 'equals.png'
    };


    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';
    filtros = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'numeropieza'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            },
            {
                type: 'listado',
                dataIndex: 'umedida',
                idcombo: 'idumedidaindicadores',
                urlcb: urlCbUM,
                mode: 'remote',
                idstore: 'idstumedidaindicadores',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                autoload: false

            }, {/*temporal arreglar el listar para que liste centros de balance*/
                type: 'listado',
                dataIndex: 'centrobalance',
                idcombo: 'idcbcentrobalancenorma',
                urlcb: urlCbCentBalance,
                idstore: 'idstcentrobalancenorma',
                valueFieldcb: 'idcentrobalance',
                displayFieldcb: 'centrobalance',
                tpl: '<tpl for="."><div ext:qtip="{centrobalance}" class="x-combo-list-item">{centrobalance}</div></tpl>'
            }
            , {/*temporal arreglar el listar para que liste centros de balance*/
                type: 'listado',
                dataIndex: 'pais',
                idcombo: 'idcbpaisnorma',
                urlcb: urlCbPais,
                idstore: 'idstpais',
                valueFieldcb: 'idpais',
                displayFieldcb: 'nombrepais',
                autoload: false,
                mode: 'remote'
            }, {
                type: 'list',
                dataIndex: 'idaprobaciondemanda',
                options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo, perfil.etiquetas.lbRector, perfil.etiquetas.lbAjuste]
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'numeric',
                dataIndex: 'preciodivisa'
            }, {
                type: 'numeric',
                dataIndex: 'cantidad'
            }, {
                type: 'numeric',
                dataIndex: 'ajuste'
            }, {
                type: 'numeric',
                dataIndex: 'cantidadfinal'
            }, {
                type: 'numeric',
                dataIndex: 'importe'
            }, {
                type: 'numeric',
                dataIndex: 'importeajustado'
            }, {
                type: 'numeric',
                dataIndex: 'importefinal'
            }, {
                type: 'numeric',
                dataIndex: 'importedivisa'
            }, {
                type: 'list',
                dataIndex: 'generadobasesplan',
                options: [perfil.etiquetas.lbSi, perfil.etiquetas.lbNo, perfil.etiquetas.lbAfectada]
            }, {
                type: 'numeric',
                dataIndex: 'flete'
            }, {
                type: 'numeric',
                dataIndex: 'contingencia'
            }, {
                type: 'listado',
                dataIndex: 'viaadquisicion',
                idcombo: 'idviaadquisicionc',
                urlcb: urlCbVA,
                mode: 'remote',
                idstore: 'idstvia',
                valueFieldcb: 'idviaadquisicion',
                displayFieldcb: 'denominacion',
                autoload: false
            }, {
                type: 'string',
                dataIndex: 'organosatisface'
            }
        ]
    });
    cmGpGestMdelo = new Ext.grid.ColumnModel([]);
    smGpGestModelo = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(x, y, w) {
                if (objci.acciones.rector || eshoja == 0 || smGpGestModelo.getSelected().get('idaprobaciondemanda') > 1)
                    gpModelo.getColumnModel().setEditable(8, false);
                else
                    gpModelo.getColumnModel().setEditable(8, true);
                if (objci.acciones.rector || eshoja == 0 || smGpGestModelo.getSelected().get('idaprobaciondemanda') != 4)
                    gpModelo.getColumnModel().setEditable(9, false);
                else
                    gpModelo.getColumnModel().setEditable(9, true);
                if (smGpGestModelo.getSelections().length == 0) {
                    habilitarDesabilitar(false);
                    habilitarDesabilitarAprobacionAjuste(false);
                } else {
                    habilitarDesabilitar(true);
                    habilitarDesabilitarAprobacionAjuste(true);
                }
                if (smGpGestModelo.getSelections().length != 0) {
                    if (smGpGestModelo.getSelected().get('generadobasesplan') != 0) {
                        Ext.getCmp('btnVerAct').enable();
                    } else {
                        Ext.getCmp('btnVerAct').disable();
                    }
                } else {
                    Ext.getCmp('btnVerAct').disable();
                }



            },
            rowdeselect: function(s, n, r) {
                if (smGpGestModelo.getSelections().length == 0) {
                    habilitarDesabilitar(false);
                    habilitarDesabilitarAprobacionAjuste(false);
                } else {
                    habilitarDesabilitar(true);
                    habilitarDesabilitarAprobacionAjuste(true);
                }
                if (smGpGestModelo.getSelections().length != 0) {
                    if (smGpGestModelo.getSelected().get('generadobasesplan') != 0) {
                        Ext.getCmp('btnVerAct').enable();
                    } else {
                        Ext.getCmp('btnVerAct').disable();
                    }
                } else {
                    Ext.getCmp('btnVerAct').disable();
                }
            }
        }
    });
    btnExportar = new Ext.Button({
        disabled: false,
        id: 'btnExportar',
        hidden: false,
        icon: perfil.dirImg + 'exportar.png',
        iconCls: 'btn',
        tooltip: 'Exportar indicadores del plan.(ALt+E)',
        text: 'Exportar',
        handler: function() {
            var selectedEntity = tpBaseEstructura.selModel.getSelectedNode().text;
            var selectedPlan = tpBasePlan.selModel.getSelectedNode().text;
            var win = window.open('exportar?entidad=' + selectedEntity + '&plan=' + selectedPlan + '&idejercicio=' + cbEjercicio.getValue() + '&hoja=' + eshoja + '& idmodelo=' + treesel + '& identidadmodelo=' + tpBasePlan.getSelectionModel().getSelectedNode().attributes.DatEntidadmodelo[0].identidadmodelo + '& identidad=' + identidadselected + '& filtros=' + Ext.encode(filtros.getFilterData()));
        }
    });
    /**************IMPORTAR*************************************/
    btnImportar = new Ext.Button({
        disabled: false,
        id: 'btnImportar',
        icon: perfil.dirImg + 'importar.png',
        iconCls: 'btn',
        tooltip: 'Importar',
        text: 'Importar',
        handler: function() {
            winFp('Imp');
        }
    });

    fpbuscar = new Ext.FormPanel({
        id: 'idFpBuscar',
        labelAlign: 'top',
        region: 'center',
        width: 600,
        frame: true,
        fileUpload: true,
        bodyStyle: 'padding:5px 5px 0',
        items:
                [{
                        xtype: 'fileuploadfield',
                        fieldLabel: 'Cargar documento',
                        name: 'fileUpload',
                        id: 'fileUpload',
                        emptyText: 'Seleccione el archivo ...',
                        allowBlank: false,
                        anchor: '100%',
                        buttonCfg: {
                            text: ':',
                            id: 'idbutton',
                            iconCls: 'btn',
                            icon: perfil.dirImg + 'buscar.png'
                        },
                    }]

    });

    function winFp(opcion) {
        switch (opcion) {
            case 'Imp':
                {
                    if (!winImp) {
                        winImp = new Ext.Window({
                            modal: true,
                            closeAction: 'hide',
                            layout: 'fit',
                            title: 'Importar Excel',
                            width: 400,
                            height: 150,
                            buttons: [{
                                    icon: perfil.dirImg + 'cancelar.png',
                                    iconCls: 'btn',
                                    text: 'Cancelar',
                                    tooltip: 'Cerrar ventana sin guardar los datos',
                                    handler: function() {
                                        winImp.hide();
                                    }
                                }, {
                                    icon: perfil.dirImg + 'aceptar.png',
                                    iconCls: 'btn',
                                    text: 'Aceptar',
                                    tooltip: 'Guardar datos y cerrar ventana',
                                    handler: function() {
                                        importarPlan();
                                    }
                                }]
                        });
                    }
                    Ext.getCmp('idFpBuscar').getForm().reset();
                    winImp.show();
                    winImp.add(fpbuscar);
                    winImp.doLayout();

                }
                break;
        }
    }

    function importarPlan() {

        try {
            if (fpbuscar.getForm().isValid())
            {

                var barra = Ext.MessageBox.show({
                    msg: perfil.etiquetas.lbEspere,
                    width: 270,
                    wait: true,
                    progress: true,
                    closable: false

                });


                btnCerrarWin = new Ext.Button({
                    text: 'Cerrar',
                    disabled: true,
                    id: 'btn',
                    tooltip: 'Cerrar',
                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'btn'
                });

                fpbuscar.getForm().submit(
                        {
                            url: 'importarfichero',
                            timeout: 1800000, //milisegundos = 30 min
                            method: 'POST',
                            params: {
                                idconcepto: 9,
                                idejercicio: cbEjercicio.getValue()

                            },
                            failure: function(form, action) {
                                mostrarMensaje(action.result.tipo, action.result.mensaje);
                                barra.hide();
                                winImp.hide();
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

    /************************FIN IMPORTAR*****************************/

    btnVerDemanda = new Ext.Toolbar.Button({
        id: 'btnVerDemanda',
        icon: perfil.dirImg + 'ver.png',
        iconCls: 'btn',
        tooltip: 'Ver Demanda',
        text: 'Ver Demanda',
        handler: function() {
            windemandacentrobalance.show();
            if (objci.acciones.rector == undefined) {
                cbCtroBalance.setValue(stcbCtroBalance.data.items[0].data.identidad);
                stGpdemandacentrobalance.reload();
                cbCtroBalance.disable();
            }
            if (cbCtroBalance.getValue() != "") {
                stCmbEntidad.load({
                    params: {
                        identiCB: cbCtroBalance.getValue()
                    }
                });
            }
        }
    });
    var btnVer = new Ext.Toolbar.Button({
        id: 'btnVerAct',
        icon: perfil.dirImg + 'ver.png',
        iconCls: 'btn',
        text: 'Ver ',
        disabled: true,
        handler: function() {
            winveractividades.show();
            stGpVerAct.load({
                params: {
                    limit: 20,
                    start: 0
                }
            });
        }
    });

    gpModelo = new Ext.grid.EditorGridPanel({
        store: stGpGestModelo,
        id: 'gpModelo',
        region: 'center',
        sm: smGpGestModelo,
        cm: cmGpGestMdelo,
        frame: true,
        plugins: filtros,
        margins: '2 2 2 -4',
        clicksToEdit: 2,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        tbar: [
            new Ext.Toolbar.MenuButton({
                id: 'menuAprobInd',
                text: perfil.etiquetas.lbBtnAprobacion,
                tooltip: perfil.etiquetas.lbBtnAprobacion,
                icon: perfil.dirImg + 'area.png',
                iconCls: 'blist',
                menu: {
                    items: [{
                            id: 'btnDesTodos',
                            tabIndex: 5,
                            icon: perfil.dirImg + 'desaprobar.png',
                            tooltip: 'Desaprobar todos los indicadores (Ctrl+Alt+W)',
                            iconCls: 'btn',
                            text: perfil.etiquetas.lbBtnDesaprobarTodos,
                            handler: function() {
                                desaprobar = 1;
                                cambiarEstadoTodos(1);
                            }
                        }, {
                            id: 'btnAprobTodos',
                            tabIndex: 4,
                            icon: perfil.dirImg + 'aprobar.png',
                            tooltip: ' Aprobar todos los indicadores (Ctrl+Alt+Q)',
                            iconCls: 'btn',
                            text: perfil.etiquetas.lbBtnAprobarTodos,
                            handler: function() {
                                desaprobar = 0;
                                var rectora = false;
                                if (objci.acciones)
                                    rectora = objci.acciones.rector;
                                if (rectora)
                                    cambiarEstadoTodos(4);
                                else
                                    cambiarEstadoTodos(2);
                            }
                        }, {
                            id: 'btnAprob',
                            disabled: true,
                            tooltip: 'Aprobar el indicador seleccionado (Alt+Q)',
                            tabIndex: 4,
                            icon: perfil.dirImg + 'aprobar.png',
                            iconCls: 'btn',
                            text: perfil.etiquetas.lbBtnAprobar,
                            handler: function() {
                                desaprobar = 0;
                                accionAprobar();
                            }
                        }, {
                            id: 'btnDes',
                            disabled: true,
                            tabIndex: 5,
                            tooltip: 'Desaprobar el indicador seleccionado (Alt+W)',
                            icon: perfil.dirImg + 'desaprobar.png',
                            iconCls: 'btn',
                            text: perfil.etiquetas.lbBtnDesaprobar,
                            handler: function() {
                                desaprobar = 1;
                                cambiarEstado(1);
                            }
                        }]
                }
            }),
            new Ext.Toolbar.MenuButton({
                id: 'menuAprobAjuste',
                //hide: true,
                text: perfil.etiquetas.lbBtnAprobacionAjuste,
                tooltip: perfil.etiquetas.lbBtnAprobacionAjuste,
                icon: perfil.dirImg + 'area.png',
                iconCls: 'blist',
                menu: {
                    items: [{
                            id: 'btnDesTodosAjustes',
                            tabIndex: 5,
                            icon: perfil.dirImg + 'desaprobar.png',
                            tooltip: 'Desaprobar todos los ajustes (Ctrl+Alt+W)',
                            iconCls: 'btn',
                            text: perfil.etiquetas.lbBtnDesaprobarTodos,
                            handler: function() {
                                aprobarajuste = 0;
                                cambiarEstadoAjusteTodos(4);
                            }
                        }, {
                            id: 'btnAprobTodosAjustes',
                            tabIndex: 4,
                            icon: perfil.dirImg + 'aprobar.png',
                            tooltip: ' Aprobar todos los ajustes (Ctrl+Alt+Q)',
                            iconCls: 'btn',
                            text: perfil.etiquetas.lbBtnAprobarTodos,
                            handler: function() {
                                aprobarajuste = 1;
                                cambiarEstadoAjusteTodos(5);
                            }
                        }, {
                            id: 'btnAprobAjuste',
                            disabled: true,
                            tooltip: 'Aprobar el ajuste del indicador seleccionado (Alt+Q)',
                            tabIndex: 4,
                            icon: perfil.dirImg + 'aprobar.png',
                            iconCls: 'btn',
                            text: perfil.etiquetas.lbBtnAprobar,
                            handler: function() {
                                aprobarajuste = 1;
                                cambiarEstadoAjuste(5);
                            }
                        }, {
                            id: 'btnDesAjuste',
                            disabled: true,
                            tabIndex: 5,
                            tooltip: 'Desaprobar el ajuste del indicador seleccionado (Alt+W)',
                            icon: perfil.dirImg + 'desaprobar.png',
                            iconCls: 'btn',
                            text: perfil.etiquetas.lbBtnDesaprobar,
                            handler: function() {
                                aprobarajuste = 0;
                                cambiarEstadoAjuste(4);
                            }
                        }]
                }
            })
                    , {
                xtype: 'tbbutton',
                text: perfil.etiquetas.lbBtnAdicionar,
                tooltip: 'Adicionar indicadores <b>(Alt+I)</b>',
                hidden: ocultar,
                id: 'btnAdicionarInds',
                icon: perfil.dirImg + 'adicionar.png',
                iconCls: 'btn',
                handler: function() {
                    // alert('dsadsa');
                    importarJS('../../views/js/comun/indicadorespornivel.js');
                }
            }, {
                xtype: 'tbbutton',
                disabled: true,
                text: perfil.etiquetas.lbBtnEliminar,
                tooltip: 'Eliminar indicadores(DEL)',
                hidden: ocultar,
                id: 'btnEliminarInds',
                icon: perfil.dirImg + 'eliminar.png',
                iconCls: 'btn',
                handler: function() {
                    eliminarIndModPlan();
                }
            }, {
                xtype: 'tbbutton',
                text: perfil.etiquetas.lbBtnGuardar,
                tooltip: 'Guardar datos de los indicadores (Alt+G)',
                id: 'btnGuardar',
                hidden: ocultar,
                icon: perfil.dirImg + 'guardar.png',
                iconCls: 'btn',
                handler: function() {
                    GuardarTodas();
                }}

            , btnExportar, btnVer, '-'],
        bbar: pgGestModelo,
        md: new Ext.menu.Menu({
            id: 'mdGrid',
            items: [{
                    text: perfil.etiquetas.lbTtbtnComen,
                    icon: perfil.dirImg + 'adicionar.png',
                    iconCls: 'btn',
                    id: 'mdAddcoment',
                    handler: function() {
                        fpComent.getForm().reset();
                        winAddComent.show(Ext.getBody());
                        winAddComent.setTitle(perfil.etiquetas.lbAdicionarC);
                        Ext.getCmp('idelemcoment').setValue(smGpGestModelo.getSelected().get('idplanificacion'));
                    }
                }, {
                    text: perfil.etiquetas.lbVerComent,
                    icon: perfil.dirImg + 'ver.png',
                    iconCls: 'btn',
                    disabled: false,
                    id: 'vercomentario',
                    handler: function() {
                        idelementoComentado = smGpGestModelo.getSelected().get('idplanificacion');
                        mostrarComentarios();
                    }
                }, {
                    text: 'Ajustar',
                    icon: perfil.dirImg + 'balance.png',
                    iconCls: 'btn',
                    id: 'ajustarind',
                    handler: function() {
                        CargarImporteinicialAjuste();
                    }
                }
            ]
        }),
        listeners: {
            beforeedit: function(e) {

//Por ponce para el renderer luego
                gpModelo.getColumnModel().getCellEditor(e.column, e.row).field.renderiza = true;
                fila = e.row;
                columna = e.column;
            },
            afteredit: function(e) {
            },
            validateedit: function(e) {
                if (consolidado == 1)
                    e.cancel = true;
                if (e.originalValue != e.value)
                    gpModelo.getColumnModel().getCellEditor(e.column, e.row).field.renderiza = true;
                else
                    e.cancel = true;
                campo = e.field;
                valor = e.value;
                ValidarOperacion(campo, valor, e);
            },
            rowcontextmenu: function(g, r, e) {

                if (eshoja == 0) {
                    e.stopEvent();
                    gpModelo.getSelectionModel().selectRow(r);
                    ValidateMenu();

                } else {

                    if (!objci.acciones.rector) {
                        if (smGpGestModelo.getSelections().length == 1) {
                            if (smGpGestModelo.getSelected().get('idaprobaciondemanda') == '4') {
                                e.stopEvent();
                                gpModelo.getSelectionModel().selectRow(r);
                                Ext.getCmp('ajustarind').show();
                                ValidateMenu();
                                gpModelo.md.showAt(e.getXY());
                            }
                        }
                        else
                        if (smGpGestModelo.getSelections().length > 1) {
                            e.stopEvent();
                            gpModelo.getSelectionModel().selectRow(r);
                            Ext.getCmp('ajustarind').show();
                            ValidateMenu();
                            gpModelo.md.showAt(e.getXY());
                        }
                    }

                }
            }
        }
    });
    pModelo = new Ext.Panel({
        id: 'pModelo',
        title: perfil.etiquetas.titModelos,
        split: true,
        layout: 'fit',
        items: [gpModelo]
    });
    //Demanda por Entidad a los Centros de balance
    stcbCtroBalance = new Ext.data.Store({
        autoLoad: true,
        url: 'ListarComboCentroBalance',
        listeners: {
            beforeload: function(st) {
                st.baseParams.identidad = identidadselected;
                st.baseParams.rector = objci.acciones.rector;
            },
            load: function() {
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'denominacion'
            }, {
                name: 'identidad'
            }])
    });
    btnExportardemanda = new Ext.Button({
        disabled: false,
        id: 'btnExportardemanda',
        hidden: false,
        icon: perfil.dirImg + 'exportar.png',
        iconCls: 'btn',
        tooltip: 'Exportar demanda <b>(ALt+E)</b>',
        text: 'Exportar',
        handler: function() {
            var win = window.open('exportarDemanda?identiCB=' + cbCtroBalance.getValue() + '&idejercicio=' + cbEjercicio.getValue() + '&idmodelo=' + treesel + '& filtros=' + Ext.encode(filtrosGpdemandacentrobalance.getFilterData()));

        }
    });
    stCbejercicio = new Ext.data.Store({
        url: ' ../gestplanes/getEjercicios',
        autoLoad: true,
        listeners: {
            load: function(t, n, e) {
                cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                Ext.Ajax.request({
                    url: 'gestPermisos',
                    params: {
                        idejercicio: cbEjercicio.getValue()
                    },
                    callback: function(options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData[0]) {
                            if (responseData[0].guardar == 0) {
                                Ext.getCmp('btnGuardar').hide();
                                Ext.getCmp('btnGuardar').hidden = tue;
                                puedeguardar = 0;
                            } else {
                                puedeguardar = 1;
                                Ext.getCmp('btnGuardar').hidden = false;
                            }
                            if (responseData[0].insertar == 0) {
                                Ext.getCmp('addVarios').hide();
                                Ext.getCmp('addplan').hide();
                                Ext.getCmp('addmodelo').hide();
                                Ext.getCmp('btnAdicionarInds').hide();
                                puedeadicionar = 0;
                            } else {
                                puedeadicionar = 1;
                            }
                            if (responseData[0].eliminar == 0) {
                                Ext.getCmp('delplan').hide();
                                Ext.getCmp('delmodelo').hide();
                                puedeeliminar = 0;
                            } else {
                                puedeeliminar = 1;
                            }
                            if (responseData[0].modificar == 0) {
                                Ext.getCmp('modplan').hide();
                                Ext.getCmp('modmodelo').hide();
                                puedemodificar = 0;
                            } else {
                                puedemodificar = 1;
                            }
                        } else {
                            puedeadicionar = 1;
                            puedemodificar = 1;
                            puedeeliminar = 1;
                            puedeguardar = 1;
                        }
                    }

                });
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: 'idejercicio'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'estado'
            }])
    });
    cbEjercicio = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        store: stCbejercicio,
        disabled: true,
        valueField: 'idejercicio',
        hiddenName: 'idejercicio',
        displayField: 'ejercicio',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        enableKeyEvents: true,
        emptyText: 'Seleccione',
        loadingText: 'Cargando...',
        width: 180,
        listeners: {
            select: function(cb, rec, index) {
                tpBasePlan.getRootNode().reload();
                stGpGestModelo.removeAll();
                pModelo.disable();
                Ext.Ajax.request({
                    url: 'gestPermisos',
                    params: {
                        idejercicio: cbEjercicio.getValue()
                    },
                    callback: function(options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData[0]) {
                            if (responseData[0].guardar == 0) {
                                Ext.getCmp('btnGuardar').hide();
                                Ext.getCmp('btnGuardar').hidden = tue;
                                puedeguardar = 0;
                            } else {
                                puedeguardar = 1;
                            }
                            if (responseData[0].insertar == 0) {
                                Ext.getCmp('addplan').hide();
                                Ext.getCmp('addmodelo').hide();
                                Ext.getCmp('btnAdicionarInds').hide();
                                puedeadicionar = 0;
                            } else {
                                puedeadicionar = 1;
                            }
                            if (responseData[0].eliminar == 0) {
                                Ext.getCmp('delplan').hide();
                                Ext.getCmp('delmodelo').hide();
                                Ext.getCmp('btnEliminarInds').hide();
                                puedeeliminar = 0;
                            } else {
                                puedeeliminar = 1;
                            }
                            if (responseData[0].modificar == 0) {
                                Ext.getCmp('modplan').hide();
                                Ext.getCmp('modmodelo').hide();
                                puedemodificar = 0;
                            } else {
                                puedemodificar = 1;
                            }
                        } else {

                            puedeadicionar = 1;
                            puedemodificar = 1;
                            puedeeliminar = 1;
                            puedeguardar = 1;
                        }
                    }

                });

            }
        }
    });
    cbCtroBalance = new Ext.form.ComboBox({
        id: 'cbCtroBalance',
        store: stcbCtroBalance,
        valueField: 'identidad',
        hiddenName: 'identidad',
        displayField: 'denominacion',
        mode: 'local',
        allowBlank: true,
        typeAhead: true,
        editable: true,
        triggerAction: 'all',
        enableKeyEvents: true,
        emptyText: 'Seleccione',
        loadingText: 'Cargando...',
        width: 180,
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        listeners: {
            select: function(cb, rec, index) {
                stGpdemandacentrobalance.reload({
                    params: {
                        start: 0,
                        limit: 20
                    }
                });
            }
        }
    });
    var cmGpdemandacentrobalance = new Ext.grid.ColumnModel([
        {
            id: 'expandir',
            header: 'Especialidad',
            width: 100,
            dataIndex: 'denomentidadpadre',
            tooltip: 'Especialidad',
            renderer: crearToolTip
        },
        {
            header: 'Entidad',
            width: 100,
            dataIndex: 'denominacionenti',
            tooltip: 'Entidad',
            renderer: crearToolTip

        },
        {
            header: 'Plan',
            width: 180,
            dataIndex: 'denominacionmodelo',
            tooltip: 'Plan',
            renderer: crearToolTip

        }, {
            header: 'Código',
            width: 75,
            dataIndex: 'codigo',
            tooltip: 'Código',
            renderer: crearToolTip
        }, {
            header: 'Número de pieza',
            width: 100,
            dataIndex: 'numeropieza',
            tooltip: 'Número de pieza',
            renderer: crearToolTip

        }, {
            header: 'Indicador',
            width: 100,
            dataIndex: 'denominacionind',
            tooltip: 'Indicador',
            renderer: crearToolTip

        }, {
            header: 'Cantidad',
            width: 100,
            dataIndex: 'cantidadreal',
            tooltip: 'Cantidad',
            renderer: crearToolTip


        }, {
            header: 'Ajuste',
            width: 100,
            dataIndex: 'ajuste',
            tooltip: 'Ajuste',
            renderer: crearToolTip


        }, {
            header: 'Cantidad final',
            width: 100,
            dataIndex: 'necesidad',
            tooltip: 'Cantidad final',
            renderer: crearToolTip


        }, {
            header: 'Importe',
            width: 100,
            dataIndex: 'importe',
            tooltip: 'Importe',
            renderer: crearToolTip
        }


    ]);

    cmGpVerAct = new Ext.grid.ColumnModel([
        {
            header: 'C&oacute;digo de la actividad',
            width: 150,
            dataIndex: 'codigo',
            tooltip: 'C&oacute;digo de la actividad',
            renderer: crearToolTip

        }, {
            header: 'Entidad',
            width: 180,
            dataIndex: 'denentidad',
            tooltip: 'Entidad',
            renderer: crearToolTip
        }, {
            header: 'Especialidad',
            width: 180,
            dataIndex: 'denespecialidad',
            tooltip: 'Especialidad',
            renderer: crearToolTip
        }, {
            header: 'Denominaci&oacute;n',
            width: 200,
            dataIndex: 'denominacion',
            tooltip: 'Denominaci&oacute;n',
            renderer: crearToolTip

        },
        {
            header: 'Nivel de actividad',
            width: 1505,
            dataIndex: 'nivel',
            tooltip: 'Nivel de actividad',
            id: 'expandir',
            renderer: crearToolTip

        }


    ]);


    stGpdemandacentrobalance = new Ext.data.Store({
        url: 'listarIndXCentroBalance',
        listeners: {
            load: function() {
                siexistecolumFiltrada();
            },
            beforeload: function() {
                Ext.Ajax.timeout = 600000;
                stGpdemandacentrobalance.baseParams.identiCB = cbCtroBalance.getValue();
                stGpdemandacentrobalance.baseParams.idejercicio = cbEjercicio.getValue();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: "data"
        }, [
            {
                name: 'denomentidadpadre'
            }, {
                name: 'denominacionenti'
            }, {
                name: 'denominacionmodelo'
            }, {
                name: 'codigo'
            }, {
                name: 'numeropieza'
            }, {
                name: 'denominacionind'
            }, {
                name: 'necesidad'
            }, {
                name: 'ajuste'
            }, {
                name: 'cantidadreal'
            }, {
                name: 'importe'
            }]
                )
    });

    stGpVerAct = new Ext.data.Store({
        url: urlListarVerActXInd,
        listeners: {
            load: function() {
                if (stGpVerAct.data.length === 0) {
                    mostrarMensaje(1, perfil.etiquetas.msgNoActXInd);
                }
            },
            beforeload: function() {
                this.baseParams.idejercicio = cbEjercicio.getValue();
                this.baseParams.identidad = identidadselected;
                this.baseParams.idindicador = smGpGestModelo.getSelected().data.idindicador;
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: "data"
        }, [
            {
                name: 'denominacion'
            }, {
                name: 'codigo'
            }, {
                name: 'nivel'
            }, {
                name: 'denespecialidad'
            }, {
                name: 'denentidad'
            }])
    });


    smGpdemandacentrobalance = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });

    var smGpVerAct = new Ext.grid.RowSelectionModel({
        singleSelect: true
    });
    stCmbEspecialidad = new Ext.data.Store({
        url: 'listarHijosRector',
        storeId: 'stCmbEspecialidad',
        listeners: {
            beforeLoad: function() {
                Ext.Ajax.timeout = 120000;
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'identi'
        }, [{
                name: 'identi'
            }, {
                name: 'denominacion'
            }])
    });
    stCmbEntidad = new Ext.data.Store({
        url: 'listarEntidades',
        storeId: 'stCmbEntidad',
        params: {
            identiCB: cbCtroBalance.getValue()
        },
        listeners: {
            beforeLoad: function() {
                Ext.Ajax.timeout = 600000;
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'denominacion'
        }, [{
                name: 'denominacion'
            }, {
                name: 'idden'
            }])
    });
    stCmbDenominacionModelo = new Ext.data.Store({
        url: 'listarModelos',
        storeId: 'stCmbDenominacionModelo',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idmodelo'
        }, [{
                name: 'denominacion'
            }, {
                name: 'idmodelo'
            }])
    });
    stCmbEspecialidad.load();
    cbCtroBalance.on('select', function(cmb, record, index) {
        stCmbEntidad.load({
            params: {
                identiCB: cbCtroBalance.getValue(),
                start: 0,
                limit: 20
            }
        });
    });
    btnVerDemanda.on('click', function(btn, e) {
        if (cbCtroBalance.getValue() != "") {
            stCmbEntidad.load({
                params: {
                    identiCB: cbCtroBalance.getValue()
                }
            });
        }
    });


    filtrosGpdemandacentrobalance = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'listado',
                dataIndex: 'denomentidadpadre',
                idcombo: 'identi',
                valueFieldcb: 'denominacion',
                displayFieldcb: 'denominacion',
                st: stCmbEspecialidad,
                mode: 'local'
            },
            {
                type: 'listado',
                dataIndex: 'denominacionmodelo',
                idcombo: 'cbdenominacionmodelo',
                valueFieldcb: 'idmodelo',
                displayFieldcb: 'denominacion',
                st: stCmbDenominacionModelo,
                mode: 'local'
            },
            {
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false
            },
            {
                type: 'string_adaptado',
                dataIndex: 'numeropieza',
                xtype: 'numberfield',
                idTextField: 'filtropieza',
                anchor: '95%',
                fieldLabel: '',
                disabled: false
            },
            {
                type: 'string_adaptado',
                dataIndex: 'denominacionind',
                xtype: 'numberfield',
                idTextField: 'filtrodenominacionind',
                anchor: '95%',
                fieldLabel: '',
                disabled: false
            },
            {
                type: 'numeric',
                dataIndex: 'necesidad'
            },
            {
                type: 'numeric',
                dataIndex: 'cantidadreal'
            },
            {
                type: 'numeric',
                dataIndex: 'ajuste'
            },
            {
                type: 'numeric',
                dataIndex: 'importe'
            }
        ]
    });

    filtrosGpVerAct = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string_adaptado',
                dataIndex: 'denominacion'
            }, {
                type: 'string_adaptado',
                dataIndex: 'codigo'
            }, {
                type: 'numeric',
                dataIndex: 'nivel'
            }]
    });
    stCbPaginado = new Ext.data.SimpleStore({
        fields: ['idnumpag', 'dennumpag'],
        data: [
            [10, '10'],
            [20, '20'],
            [80, '80'],
            [100, '100'],
            [250, '250'],
            [500, '500'],
            [750, '750'],
            [1000, '1000']
        ]
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
        width: 55,
        emptyText: 'Seleccionar',
        listeners: {
            select: function(cb, record, index) {
                Ext.getCmp('ptGpdemandacentrobalance').pageSize = record.data.idnumpag;
                Ext.getCmp('ptGpdemandacentrobalance').doLoad(Ext.getCmp('ptGpdemandacentrobalance').cursor);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });

    Gpdemandacentrobalance = new Ext.grid.GridPanel({
        frame: true,
        id: 'Gpdemandacentrobalance',
        autoExpandColumn: 'expandir',
        store: stGpdemandacentrobalance,
        margins: '2 2 2 -4',
        region: 'center',
        plugins: filtrosGpdemandacentrobalance,
        sm: smGpdemandacentrobalance,
        cm: cmGpdemandacentrobalance,
        loadMask: {
            msg: 'Cargando...'
        },
        tbar: [{
                xtype: 'tbtext',
                text: 'Centro de Balance:'
            }, cbCtroBalance, '-', btnExportardemanda],
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            id: 'ptGpdemandacentrobalance',
            store: stGpdemandacentrobalance,
            displayInfo: true,
            items: [btnLimpiarFiltrosDemanda, '-', {
                    xtype: 'tbtext',
                    text: 'Resultados por p&aacute;gina : '
                }, cbPaginado]
        })


    });
    stGpdemandacentrobalance.load({
        params: {
            limit: 20,
            start: 0,
            identiCB: -1
        }
    });


    var GpVerAct = new Ext.grid.GridPanel({
        id: 'GpVerAct',
        autoExpandColumn: 'expandir',
        store: stGpVerAct,
        margins: '2 2 2 -4',
        region: 'center',
        plugins: filtrosGpVerAct,
        sm: smGpVerAct,
        cm: cmGpVerAct,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            id: 'ptGpVerAct',
            store: stGpVerAct,
            displayInfo: true,
            items: [btnLimpiarFiltrosVerAct]
        })
    });


    btnCancelarDemanda = new Ext.Toolbar.Button({
        id: 'btnCancelarDemanda',
        icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'btn',
        text: 'Cancelar',
        tooltip: 'Cerrar ventana sin guardar los datos',
        handler: function() {
            windemandacentrobalance.hide();
            cbCtroBalance.clearValue();
            stGpdemandacentrobalance.reload();
        }
    });
    windemandacentrobalance = new Ext.Window({
        title: "Demanda por Entidades a los centros de balance",
        width: 1000,
        layout: 'fit',
        height: 500,
        modal: true,
        closeAction: 'hide',
        buttons: [btnCancelarDemanda],
        items: [Gpdemandacentrobalance]
    });



    btnCancelarAct = new Ext.Toolbar.Button({
        id: 'btnCancelarAct',
        icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'btn',
        text: 'Cancelar',
        tooltip: 'Cerrar ventana sin guardar los datos',
        handler: function() {
            winveractividades.hide();

        }
    });


    var winveractividades = new Ext.Window({
        title: "Ver actividades",
        width: 800,
        layout: 'fit',
        height: 400,
        modal: true,
        closeAction: 'hide',
        buttons: [btnCancelarAct],
        items: [GpVerAct]
    });


    map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'lL',
            alt: true,
            fn: function() {
                if (!btnLimpiarFiltros.hidden) {
                    if (!btnLimpiarFiltros.disabled) {
                        filtros.clearFilters();
                        stGpGestModelo.reload();
                    }
                }
            }
        }, {
            key: 46,
            fn: function() {

                if (smGpGestModelo.getSelections().length >= 1)
                    eliminarIndModPlan();
            }
        }, {
            key: 'qQ',
            alt: true,
            fn: function() {
                if (!btnAprob.hidden) {
                    if (!btnAprob.disabled) {
                        accionAprobar();
                    }
                }


            }
        }, {
            key: 'wW',
            alt: true,
            fn: function() {
                if (!btnDes.hidden) {
                    if (!btnDes.disabled) {
                        cambiarEstado(1);
                    }
                }

            }
        }, {
            key: 'qQ',
            ctrl: true,
            alt: true,
            fn: function() {
                if (!btnAprobTodos.hidden) {
                    if (!btnAprobTodos.disabled) {
                        var rectora = false;
                        if (objci.acciones)
                            rectora = objci.acciones.rector;
                        if (rectora)
                            cambiarEstadoTodos(4);
                        else
                            cambiarEstadoTodos(2);
                    }
                }

            }
        }, {
            key: 'wW',
            ctrl: true,
            alt: true,
            fn: function() {
                if (!btnDesTodos.hidden) {
                    if (!btnDesTodos.disabled) {
                        cambiarEstadoTodos(1);
                    }
                }

            }
        }
        , {
            key: 'iI',
            alt: true,
            fn: function() {
                importarJS('../../views/js/comun/indicadorespornivel.js');
            }
        }
        , {
            key: 'gG',
            alt: true,
            fn: function() {
                GuardarTodas();
            }
        }

    ]);
}


// function para cargar la configuracion del grid
function cargarconfgrid() {
    if (objci.acciones.rector)
    {
        Ext.getCmp('btnAdicionarInds').hide();
        Ext.getCmp('btnEliminarInds').hide();
        Ext.getCmp('btnGuardar').show();
        Ext.getCmp('btnAprobTodos').show();
        Ext.getCmp('btnDesTodos').show();
        Ext.getCmp('btnAprobTodos').show();
        Ext.getCmp('btnDesTodos').show();
    } else if ((Ext.getCmp('tpestructura').selModel.getSelectedNode().isLeaf())) {
        if (puedeadicionar == 1) {
            Ext.getCmp('btnAdicionarInds').show();
        }
        if (puedeeliminar == 1) {
            Ext.getCmp('btnEliminarInds').show();
        }
        if (puedeguardar == 1) {
            Ext.getCmp('btnGuardar').show();
        }

        Ext.getCmp('btnAprob').show();
        Ext.getCmp('btnDes').show();
        Ext.getCmp('btnAprobTodos').show();
        Ext.getCmp('btnDesTodos').show();
    } else
    {
        Ext.getCmp('btnAdicionarInds').hide();
        Ext.getCmp('btnEliminarInds').hide();
        Ext.getCmp('btnGuardar').hide();
        Ext.getCmp('btnAprob').hide();
        Ext.getCmp('btnDes').hide();
        Ext.getCmp('btnAprobTodos').show();
        Ext.getCmp('btnDesTodos').show();
    }
    global_tree = 0;
    Ext.Ajax.request({
        url: 'getgridinterfaces',
        params: {
            idmodelo: treesel
        },
        callback: function(options, success, response) {
            var responseData = Ext.decode(response.responseText);
            if (responseData.cm) {
                console.log(responseData.cm.length);
                for (var index = 0; index < responseData.cm.length; index++) {
                    if (responseData.cm[index].header == 'Formato') {
                        responseData.cm[index].header = 'UM';
                        responseData.cm[index].hidden = true;
                    }
                }
                reconfgrid(responseData);

            }
            else {
                reconfgrid();
            }
            global_tree++;
        }
    });
}

function calcularImporte(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    if (value)
        return parseFloat(value).toFixed(3);
    return (precio * cantidad).toFixed(3);
}



function Precio(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    if (value)
        return value;
    else
        return 0;
}

function Aprobacion(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    if (value == 1)
        return 'No';
    else if (value == 2)
        return 'Si';
    else
        return 'Rector';
}

function Cantidad(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    if (value)
        return value;
    else
        return 0;
}
// function para reconfigurar el grid de modelo
function reconfgrid(cf) {

    rec = [];
    rec.push({
        name: '_is_leaf'
    });
    rec.push({
        name: 'idaprobaciondemanda'
    });
    rec.push({
        name: 'generadobasesplan'
    });
    rec.push({
        name: '_parent'
    });
    rec.push({
        name: 'idplanificacion'
    });
    rec.push({
        name: 'codigo'
    });
    rec.push({
        name: 'denominacion'
    });
    rec.push({
        name: 'descripcion'
    });
    rec.push({
        name: 'precio'
    });
    rec.push({
        name: 'preciodivisa'
    });
    rec.push({
        name: 'cantidad'
    });
    rec.push({
        name: 'ajuste'
    });
    rec.push({
        name: 'cantidadfinal'
    });
    rec.push({
        name: 'centrobalance'
    });
    rec.push({
        name: 'pais'
    });
    rec.push({
        name: 'umedida'
    });
    rec.push({
        name: 'numeropieza'
    });
    rec.push({
        name: 'importe'
    });
    rec.push({
        name: 'importeajustado'
    });
    rec.push({
        name: 'importefinal'
    });
    rec.push({
        name: 'comentario'
    });
    rec.push({
        name: 'idindicador'
    });
    rec.push({
        name: 'flete'
    });
    rec.push({
        name: 'contingencia'
    });
    rec.push({
        name: 'viaadquisicion'
    });
    rec.push({
        name: 'organosatisface'
    });
    cmGp = [];
    cmGp.push({
        header: 'Código',
        width: 50,
        sortable: true,
        dataIndex: 'codigo',
        tooltip: perfil.etiquetas.lbCodigo,
        renderer: crearToolTip
    });
    cmGp.push({
        header: 'Número de pieza',
        width: 30,
        sortable: true,
        dataIndex: 'numeropieza',
        tooltip: perfil.etiquetas.lbNumPieza,
        renderer: crearToolTip
    });
    cmGp.push({
        header: 'Denominación',
        id: 'expandir',
        width: 80,
        sortable: true,
        dataIndex: 'denominacion',
        tooltip: perfil.etiquetas.lbDenominacion,
        renderer: crearToolTip
    });
    cmGp.push({
        header: 'UM',
        width: 35,
        sortable: true,
        dataIndex: 'umedida',
        tooltip: perfil.etiquetas.lbUM,
        renderer: crearToolTip
    });
    cmGp.push({
        header: 'Precio',
        width: 50,
        sortable: true,
        dataIndex: 'precio',
        tooltip: perfil.etiquetas.lbPrecio,
        renderer: Precio
    });
    if (cf) {
        for (var index = 0; index < cf.cm.length; index++)
        {
            if (cf.cm[index].edit.xtype) {
                switch (cf.cm[index].edit.xtype) {
                    case 'numberfield':
                        {
                            cf.cm[index].editor = new Ext.form.NumberField(cf.cm[index].edit);
                            cf.cm[index].editor.on('focus', function(f) {
                                f.selectText();
                            });
                        }
                        break;
                    case 'datefield':
                        {
                            cf.cm[index].editor = new Ext.form.DateField(cf.cm[index].edit);
                            cf.cm[index].editor.format = 'd/m/Y';
                            cf.cm[index].renderer = function(v, m, r, ri, ci, st) {
                                if (v) {
                                    if (typeof (v) == 'string') {
                                        var arreg = v.split('-');
                                        v = arreg[2] + '/' + arreg[1] + '/' + arreg[0];
                                        return v;
                                    }
                                    else {
                                        return v.format('d/m/Y');
                                    }
                                }
                                return '';
                            }
                        }
                        break;
                    case 'combo':
                        {

                            var item = cf.cm[index].edit;
                            var items = cf.cm;
                            var almacen = new Ext.data.SimpleStore({
                                fields: ['iddatosnomenclador', item.displayField]
                            });

                            var valores = [];

                            for (pos in cf.cm[index].edit.store)
                            {
                                valores.push(new Ext.data.Record(cf.cm[index].edit.store[pos]));
                            }

                            valores.pop();
                            almacen.add(valores);
                            cf.cm[index] = {
                                id: items[index].edit.id,
                                header: items[index].header,
                                dataIndex: items[index].dataIndex,
                                sortable: true,
                                width: 80,
                                tooltip: items[index].header,
                                renderer: function(value, cell, rec, row, col) {
                                    var col = col;
                                    if (!objci.acciones.rector && eshoja) {
                                        gpModelo.getColumnModel().setEditable(col, true);
                                    } else {
                                        gpModelo.getColumnModel().setEditable(col, false);
                                    }
                                    return getRawValue(value, gpModelo.getColumnModel().getCellEditor(col, row).field, gpModelo.getColumnModel(), col);

                                },
                                editor: new Ext.form.ComboBox({
                                    id: item.id,
                                    hiddenName: item.hiddenName,
                                    name: item.hiddenName,
                                    mode: 'local',
                                    triggerAction: 'all',
                                    allowBlank: item.allowBlank,
                                    emptyText: item.emptyText,
                                    width: 80,
                                    typeAhead: item.typeAhead,
                                    valueField: item.valueField,
                                    displayField: item.displayField,
                                    renderer: crearToolTip,
                                    store: almacen,
                                    listeners: {
                                        select: function(a, b, c) {
                                            for (var i = 0; i < smGpGestModelo.getSelections().length; i++) {
                                                //si se le adiciona otra columna estatica antes de las columnas dinamicas debe adiconarle 1 a la suma de la columna
                                                stGpGestModelo.getById(smGpGestModelo.getSelections()[i].id).set(stGpGestModelo.getById(smGpGestModelo.getSelections()[i].id).fields.items[columna + 22].name, a.getValue());
                                            }
                                        },
                                        focus: function()
                                        {

                                        }
                                    }

                                })
                            };
                        }
                        break;
                    default:
                        {
                            cf.cm[index].editor = new Ext.form.TextField(cf.cm[index].edit);
                            cf.cm[index].editor.on('focus', function(f) {
                                f.selectText();
                            });
                        }
                        break;
                }
                cmGp.push(cf.cm[index]);
            }
        }

        for (var index = 0; index < cf.rd.length; index++) {
            rec.push(cf.rd[index]);

        }
    }
    cmGp.push({
        header: 'Precio MLC',
        width: 75,
        sortable: true,
        hidden: false,
        dataIndex: 'preciodivisa',
        tooltip: perfil.etiquetas.lbPrecioMLC,
        renderer: crearToolTip
    });

    cmGp.push({
        header: 'Cantidad',
        width: 70,
        sortable: true,
        dataIndex: 'cantidad',
        tooltip: perfil.etiquetas.lbCant,
        renderer: Cantidad,
        editor: new Ext.form.NumberField({
            name: 'cantidad',
            allowBlank: false,
            decimalPrecision: 6,
            minValue: 0,
            listeners: {
                focus: function(f) {
                    f.selectText();
                }
            }
        })
    });
    cmGp.push({
        header: 'Ajuste',
        width: 70,
        sortable: true,
        dataIndex: 'ajuste',
        tooltip: perfil.etiquetas.lbAjuste,
        renderer: Cantidad,
        editor: new Ext.form.NumberField({
            name: 'ajuste',
            allowBlank: false,
            decimalPrecision: 6,
            listeners: {
                focus: function(f) {
                    f.selectText();
                }
            }
        })
    });
    cmGp.push({
        header: 'Cantidad final',
        width: 85,
        sortable: true,
        dataIndex: 'cantidadfinal',
        tooltip: perfil.etiquetas.lbCantidadFinal,
        renderer: function(v, params, record) {
            params.attr = 'ext:qtip="' + v + '"';
            return Number(record.data.cantidad) + Number(record.data.ajuste);
        }
    });
    cmGp.push({
        header: 'Centro de balance',
        width: 100,
        sortable: true,
        dataIndex: 'centrobalance',
        tooltip: perfil.etiquetas.lbCentroBalance,
        hidden: true,
        renderer: crearToolTip
    });
    cmGp.push({
        header: 'País',
        width: 80,
        sortable: true,
        dataIndex: 'pais',
        tooltip: perfil.etiquetas.lbPais,
        hidden: true,
        renderer: crearToolTip
    });
    cmGp.push({
        header: 'Descripción',
        width: 300,
        sortable: true,
        dataIndex: 'descripcion',
        tooltip: perfil.etiquetas.lbDescrip,
        hidden: true,
        renderer: crearToolTip
    });


    cmGp.push({
        header: 'Importe inicial',
        width: 45,
        sortable: true,
        dataIndex: 'importe',
        tooltip: 'Importe Inicial',
        minValue: 0,
        renderer: crearToolTip
    });
    cmGp.push({
        header: 'Importe ajustado',
        width: 45,
        sortable: true,
        dataIndex: 'importeajustado',
        tooltip: perfil.etiquetas.lbImporteAjustado,
        minValue: 0,
        renderer: crearToolTip
    });
    cmGp.push({
        header: 'Importe final',
        width: 45,
        sortable: true,
        dataIndex: 'importefinal',
        tooltip: perfil.etiquetas.lbImporteFinal,
        minValue: 0,
        renderer: crearToolTip
    });

    cmGp.push({
        header: 'Importe flete y seguro',
        width: 40,
        sortable: true,
        dataIndex: 'flete',
        tooltip: perfil.etiquetas.lbImporteFS,
        minValue: 0,
        hidden: true,
        renderer: crearToolTip
    });
    cmGp.push({
        header: 'Importe contingencia',
        width: 45,
        sortable: true,
        dataIndex: 'contingencia',
        tooltip: perfil.etiquetas.lbImporteConting,
        minValue: 0,
        hidden: true,
        renderer: crearToolTip
    });
    cmGp.push({
        header: 'Base plan',
        width: 30,
        sortable: true,
        dataIndex: 'generadobasesplan',
        tooltip: perfil.etiquetas.lbBasePlan,
        renderer: EsdeBasePlanP
    });
    cmGp.push({
        header: 'Aprobado',
        width: 35,
        sortable: true,
        dataIndex: 'idaprobaciondemanda',
        tooltip: perfil.etiquetas.lbAprobado,
        renderer: ColumnaAprobacion
    });
    cmGp.push({
        header: 'Vía de adquisición',
        width: 50,
        sortable: true,
        hidden: false,
        dataIndex: 'viaadquisicion',
        tooltip: perfil.etiquetas.lbViaAdquisicion

    });
    cmGp.push({
        header: 'Órgano satisface',
        width: 55,
        sortable: true,
        hidden: false,
        dataIndex: 'organosatisface',
        tooltip: perfil.etiquetas.lbOrganoSatis

    });
    jrStGpGestModelo = new Ext.data.JsonReader({
        totalProperty: 'total',
        importetotal: 'importetotal',
        importedivisatotal: 'importedivisatotal',
        importeflete: 'importeflete',
        importecontingencia: 'importecontingencia',
        llave: 'llave',
        root: 'data',
        id: 'jrStGpGestModelo',
        fields: rec
    });
    stGpGestModelo = new Ext.data.Store({
        url: urlListar,
        listeners: {
            beforeLoad: function() {
                Ext.Ajax.timeout = 600000; //10min
                stGpGestModelo.removeAll();
                this.baseParams.idejercicio = cbEjercicio.getValue();
                this.baseParams.hoja = eshoja;
                this.baseParams.idmodelo = treesel;
                this.baseParams.identidadmodelo = tpBasePlan.getSelectionModel().getSelectedNode().attributes.DatEntidadmodelo[0].identidadmodelo;
                this.baseParams.identidad = identidadselected;
                this.baseParams.filtros = Ext.encode(filtros.getFilterData());
                cambiarTituloFiltrar();
            },
            load: function() {
                calcularImporteTotal();
                siexisteIndEnModeloFiltrado();
                global_tree++;
            },
            loadexception: function() {
                mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
            }
        },
        reader: jrStGpGestModelo
    });
    gpModelo.reconfigure(stGpGestModelo, new Ext.grid.ColumnModel(cmGp));
    pgGestModelo.bind(stGpGestModelo);
    if (urlListar == urlListarConsolidacion)
    {
        gpModelo.getStore().baseParams.idmodelo = treesel;
        gpModelo.getStore().baseParams.calcular = calcular;
        gpModelo.getStore().baseParams.modelos = Ext.encode(tpBasePlan.getChecked("idmodelo", nodo));
    }
    gpModelo.getStore().load({
        params: {
            start: 0,
            limit: 20
        }
    });
}

// function para eliminar un modelo de un plan
function eliminarModelo() {

    mostrarMensaje(2, perfil.etiquetas.msgEP, elimina);
    function elimina(btnPresionado) {
        if (btnPresionado == 'ok') {
            Ext.MessageBox.show({
                title: perfil.etiquetas.lbEspere,
                msg: 'Eliminando el plan seleccionado.',
                width: 350,
                wait: true,
                progress: true,
                closable: false
            });
            Ext.Ajax.request({
                url: '../gestmodelo/eliminar',
                params: {
                    identidad: identidadselected,
                    idmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.idmodelo,
                    identidadmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.DatEntidadmodelo[0].identidadmodelo
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 1) {
                        tpBasePlan.selectPath(tpBasePlan.getSelectionModel().getSelectedNode().parentNode.getPath());
                        idelemsel = tpBasePlan.getSelectionModel().getSelectedNode().id;
                        pcm.layout.setActiveItem('pComentario');
                        gpComent.getStore().load({
                            params: {
                                start: 0,
                                limit: 20
                            }
                        });
                        mostrarMensaje(responseData.codMsg, perfil.etiquetas.msgPlanEliminado, function() {
                            tpBasePlan.getSelectionModel().getSelectedNode().parentNode.reload();
                        });
                    }
                    else if (responseData.codMsg == 21)
                    {
                        mostrarMensaje(3, perfil.etiquetas.msgErrorElimMode);
                    }
                }
            });
        }
    }
}

eliminarIndModPlan = function() {
    mostrarMensaje(2, "¿Está seguro que quiere eliminar el(los) indicador(es) seleccionado(s)?", elimina);
    function elimina(btn) {
        if (btn == 'ok') {
            var aux = gpModelo.getSelectionModel().getSelections();
            var arreglo = [];
            var arrayInd = [];
            for (pos in aux) {
                if (aux[pos].id) {
                    arreglo.push(aux[pos].data.idplanificacion);
                    arrayInd.push(aux[pos].data.idindicador);
                }
            }
            var maskElim = Ext.MessageBox.show({
                title: perfil.etiquetas.lbEspere,
                msg: 'Eliminando el(los) indicador(es) seleccionado(s).',
                width: 350,
                wait: true,
                progress: true,
                closable: false
            });
            Ext.Ajax.request({
                url: '../gestmodelo/eliminarIndmodPlan',
                params: {
                    idplanificacion: Ext.encode(arreglo),
                    identidadmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.DatEntidadmodelo[0].identidadmodelo,
                    idindicador: Ext.encode(arrayInd),
                    idejercicio: cbEjercicio.getValue()
                },
                callback: function(options, success, response) {

                    responseData = Ext.decode(response.responseText);
                    if (responseData) {
                        if (responseData.codMsgD == 1) {

                            mostrarMensaje(1, perfil.etiquetas.msgEliminado);
                            funcionAceptar();
                        }
                        else if (responseData.codMsgD == 21) {

                            mostrarMensaje(3, perfil.etiquetas.msgErrorEliminarDemanda);
                        }
                    }
                    else
                        mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
                    maskElim.hide();
                }
            });
        }

    }
}
function funcionAceptar() {
    stGpGestModelo.reload();
}

function GuardarTodas() {
    var editadas = stGpGestModelo.getModifiedRecords();
    var count = 0;
    var obj = {};
    var arreglo = [];
    var llave = jrStGpGestModelo.jsonData.llave;
    while (editadas.length > 0) {
        var record = editadas.pop();
        var rec = record.getChanges();
        for (k in rec) {
            if (typeof (rec[k]) == 'object') {
                if (rec[k]) {
                    rec[k] = rec[k].format('d/m/Y');
                }
            }
        }

        if (((Object.keys(rec).length > 0 && !rec['cantidad'] && rec['cantidad'] != 0 && !rec['importe']) ||
                (Object.keys(rec).length > 2 && rec['cantidad'] && rec['importe']) ||
                (Object.keys(rec).length > 1 && rec['cantidad'] && !rec['importe'])) && !rec['ajuste'] && rec['ajuste'] != 0) {
            rec[llave] = record.data[llave];
            rec['insertarenmeta'] = true;
        }


        rec['idplanificacion'] = record.data['idplanificacion'];
        count++;
        arreglo.push(rec);
    }
    obj['idmodelo'] = tpBasePlan.getSelectionModel().getSelectedNode().attributes.idmodelo;
    obj['identidadmodelo'] = tpBasePlan.getSelectionModel().getSelectedNode().attributes.DatEntidadmodelo[0].identidadmodelo;
    obj.filas = Ext.encode(arreglo);
    Ext.Ajax.request({
        url: '../gestmodelo/adicionarIndicador',
        params: obj,
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgM) {
                if (responseData.codMsgM == 20) {
                    mostrarMensaje(1, perfil.etiquetas.msgGuardados);
                    stGpGestModelo.reload();
                }
                else {
                    editadas.push(record);
                    if (responseData.codMsgM == 3) {
                        mostrarMensaje(3, perfil.etiquetas.msgErrorAction)
                    }
                }
            }
            else {
                editadas.push(record);
                mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
            }
        }
    });
}
function cambiarEstadoAjuste(valor)
{
    if (aprobarajuste == 0) {

        var mensaje;
        mensaje = 'Desaprobando el(los) ajustes de el(los) indicador(es) seleccionado(s).'
    } else {
        mensaje = 'Aprobando el(los) ajustes de el(los) indicador(es) seleccionado(s).'
    }
    if (smGpGestModelo.getSelections().length >= 1) {

        var aux = gpModelo.getSelectionModel().getSelections();
        var arreglo = [];
        for (pos in aux) {
            if (aux[pos].id) {
                arreglo.push(aux[pos].data.idplanificacion);
            }
        }
        var rectora;
        if (objci.acciones)
            rectora = objci.acciones.rector;
        var mens;
        if (valor == 5)
            mens = perfil.etiquetas.msgComprobarAjusteAprobar;
        else
            mens = perfil.etiquetas.msgComprobarAjusteDesaprobar;
        mostrarMensaje(2, mens, function(btn) {
            if (btn == 'ok') {
                Ext.MessageBox.show({
                    title: perfil.etiquetas.lbEspere,
                    msg: mensaje,
                    width: 350,
                    wait: true,
                    progress: true,
                    closable: false
                });
                Ext.Ajax.request({
                    url: '../gestmodelo/aprobarDesaprobarAjuste',
                    params: {
                        idplanificacion: Ext.encode(arreglo),
                        aprobado: valor
                    },
                    callback: function(options, success, response) {
                        Ext.getBody().unmask();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {

                            if (valor == 5) {
                                mostrarMensaje(1, perfil.etiquetas.msgAprobadoAjuste, function() {
                                    stGpGestModelo.reload();
                                });
                            }
                            else {
                                mostrarMensaje(1, perfil.etiquetas.msgDesaprobadoAjuste, function() {
                                    stGpGestModelo.reload();
                                });
                            }
                        }
                    }

                });
            }
        }

        );
    } else
        mostrarMensaje(1, perfil.etiquetas.msgSeleccionparaAprobar)
}
function cambiarEstadoAjusteTodos(valor)
{
    if (aprobarajuste == 0) {
        var mensaje;
        mensaje = 'Desaprobando todos los indicadores.'
    } else {
        mensaje = 'Aprobando todos los indicadores.'
    }

    var rectora;
    if (objci.acciones)
        rectora = objci.acciones.rector;
    var mens;
    if (valor == 5)
        mens = perfil.etiquetas.msgComprobarAjusteAprobarTodos;
    else
        mens = perfil.etiquetas.msgComprobarAjusteDesaprobarTodos;
    mostrarMensaje(2, mens, function(btn) {
        if (btn == 'ok') {

            Ext.MessageBox.show({
                title: perfil.etiquetas.lbEspere,
                msg: mensaje,
                width: 300,
                wait: true,
                progress: true,
                closable: false
            });
            Ext.Ajax.request({
                url: '../gestmodelo/aprobarDesaprobarAjusteTodos',
                params: {
                    identidadmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.DatEntidadmodelo[0].identidadmodelo,
                    idmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.idmodelo,
                    aprobado: valor,
                    idejercicio: cbEjercicio.getValue(),
                    hoja: tpBaseEstructura.getSelectionModel().getSelectedNode().leaf,
                    identidad: tpBaseEstructura.getSelectionModel().getSelectedNode().attributes.id,
                    rectora: rectora
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 1) {
                        if (valor == 4) {
                            mostrarMensaje(1, perfil.etiquetas.msgDesaprobadoAjuste, function() {
                                stGpGestModelo.reload();
                            });
                        }
                        else {
                            mostrarMensaje(1, perfil.etiquetas.msgAprobadoAjuste, function() {
                                stGpGestModelo.reload();
                            });
                        }

                    }

                }
            });
        }
    }
    );
}
function cambiarEstado(valor)
{
    if (desaprobar == 1) {

        var mensaje;
        mensaje = 'Desaprobando el(los) indicador(es) seleccionado(s).'
    } else {
        mensaje = 'Aprobando el(los) indicador(es) seleccionado(s).'
    }
    if (smGpGestModelo.getSelections().length >= 1) {
        var aux = gpModelo.getSelectionModel().getSelections();
        var arreglo = [];
        for (pos in aux) {
            if (aux[pos].id) {
                arreglo.push(aux[pos].data.idplanificacion);
            }
        }


        var rectora;
        if (objci.acciones)
            rectora = objci.acciones.rector;
        mostrarMensaje(2, perfil.etiquetas.msgComprobar, function(btn) {
            if (btn == 'ok') {
                Ext.Ajax.request({
                    url: '../gestmodelo/aprobarDesaprobar',
                    params: {
                        arrayidplanificacion: Ext.encode(arreglo),
                        aprobado: valor,
                        rectora: rectora
                    },
                    callback: function(options, success, response) {
                        Ext.getBody().unmask();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgAD == 1) {

                            if (valor == 1) {
                                mostrarMensaje(1, perfil.etiquetas.msgDesaprobado);
                                stGpGestModelo.reload();
                            }
                            else {
                                mostrarMensaje(1, perfil.etiquetas.msgAprobado);
                                stGpGestModelo.reload();
                            }
                        }
                        else {
                            if (responseData.codMsgAD == 3) {
                                mostrarMensaje(3, perfil.etiquetas.msgErrorAction)
                            }
                            if (responseData.codMsgAD == 21) {
                                mostrarMensaje(3, perfil.etiquetas.msgErrorAprobarNecesidad)
                            }
                            if (responseData.codMsgAD == 22) {
                                mostrarMensaje(3, perfil.etiquetas.msgErrorDesaprobar)
                            }
                        }
                        mymask.hide();
                    }

                });
            }
        }

        );
    } else
        mostrarMensaje(1, perfil.etiquetas.msgSeleccionparaAprobar)
}

function FuncionSegu() {
    mostrarMensaje(1, perfil.etiquetas.msgDesaprobado);
}
function FuncionSegu2() {
    mostrarMensaje(1, perfil.etiquetas.msgAprobado);
}

function cambiarEstadoTodos(valor)
{
    if (desaprobar == 1) {
        var mensaje;
        mensaje = 'Desaprobando todos los indicadores.'
    } else {
        mensaje = 'Aprobando todos los indicadores.'
    }

    var rectora;
    if (objci.acciones)
        rectora = objci.acciones.rector;
    var arrayidindicadores = [];
    if (gpModelo.getStore().getCount() >= 1) {
        for (var i = 0; i < gpModelo.getStore().getCount(); i++) {
            arrayidindicadores.push(gpModelo.getStore().getAt(i).get('idindicador'));
        }
    }
    if (desaprobar == 1) {
        var mensaje1;
        mensaje1 = perfil.etiquetas.msgComprobarDesTodos;
    } else {
        mensaje1 = perfil.etiquetas.msgComprobarTodos;
    }
    mostrarMensaje(2, mensaje1, function(btn) {
        if (btn == 'ok') {
            Ext.Ajax.request({
                url: '../gestmodelo/aprobarTodos',
                params: {
                    //idindicadores: Ext.encode(arrayidindicadores),
                    identidadmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.DatEntidadmodelo[0].identidadmodelo,
                    idmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.idmodelo,
                    aprobado: valor,
                    idejercicio: cbEjercicio.getValue(),
                    rectora: rectora

                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsgM == 1) {
                        if (valor == 1) {
                            mostrarMensaje(1, perfil.etiquetas.msgDesaprobadoTodo);
                            stGpGestModelo.reload();
                        }
                        else {
                            mostrarMensaje(1, perfil.etiquetas.msgAprobadoTodo);
                            stGpGestModelo.reload();
                        }

                    }
                    else {
                        if (responseData.codMsgM == 3) {
                            mostrarMensaje(3, perfil.etiquetas.msgErrorAction)
                        }
                        if (responseData.codMsgM == 21) {
                            mostrarMensaje(3, perfil.etiquetas.msgErrorAprobarNecesidad)
                        }
                        if (responseData.codMsgM == 22) {
                            mostrarMensaje(3, perfil.etiquetas.msgErrorDesaprobar)
                        }
                    }


                }
            });
        }
    }
    );
}

function ActualizarIU(id)
{
    stGpGestModelo.getById(id).commit();
    if (fila <= stGpGestModelo.getCount() - 1) {
        gpModelo.startEditing(fila, columna);
    }
}
function habilitarDesabilitarAprobacionAjuste(bandera)
{

    if (!objci.acciones.rector) {
        Ext.getCmp('menuAprobAjuste').hide();
    }
    else {
        if (bandera) {
            if (smGpGestModelo.getSelections().length == 1) {

                if (smGpGestModelo.getSelected().get('idaprobaciondemanda') == '5' && smGpGestModelo.getSelected().data.ajuste != '0.0000') {
                    Ext.getCmp('btnAprobAjuste').disable();
                    if (eshoja == 1)
                        Ext.getCmp('btnDesAjuste').enable();
                }
                else
                if (smGpGestModelo.getSelected().get('idaprobaciondemanda') == '4' && smGpGestModelo.getSelected().data.ajuste != '0.0000') {
                    if (eshoja == 1)
                        Ext.getCmp('btnAprobAjuste').enable();
                    Ext.getCmp('btnDesAjuste').disable();
                }

            }
            else {
                if (eshoja == 1) {
                    Ext.getCmp('btnAprobAjuste').enable();
                    Ext.getCmp('btnDesAjuste').enable();
                }
                else
                {
                    Ext.getCmp('btnAprobAjuste').disable();
                    Ext.getCmp('btnDesAjuste').disable();
                }

            }
        }
        else {
            Ext.getCmp('btnAprobAjuste').disable();
            Ext.getCmp('btnDesAjuste').disable();
        }
    }
}

function habilitarDesabilitar(bandera)
{
    if (bandera) {
        if (smGpGestModelo.getSelections().length == 1) {
            aprobarDesaprobar(false);
            Ext.getCmp('mdAddcoment').show();
        }
        else {
            aprobarDesaprobar(true);
            Ext.getCmp('mdAddcoment').hide();
        }
    }
    else {
        Ext.getCmp('mdAddcoment').hide();
        Ext.getCmp('btnAprob').disable();
        Ext.getCmp('btnDes').disable();
        Ext.getCmp('btnEliminarInds').disable();
    }
}

function aprobarDesaprobar(multi) {
    if (multi) {
        Ext.getCmp('btnAprob').enable();
        Ext.getCmp('btnDes').enable();
        Ext.getCmp('btnEliminarInds').enable();
    }
    else {
        var rectora = false;
        if (objci.acciones)
            rectora = objci.acciones.rector;
        if (smGpGestModelo.getSelected().get('idaprobaciondemanda') == '1') {
            if (smGpGestModelo.getSelected().get('cantidad') > 0) {
                Ext.getCmp('btnAprob').enable();
            } else {
                Ext.getCmp('btnAprob').disable();
            }
            Ext.getCmp('btnDes').disable();
            Ext.getCmp('btnEliminarInds').enable();
        }
        else {
            if (smGpGestModelo.getSelected().get('idaprobaciondemanda') == '2') {
                if (rectora) {
                    if (smGpGestModelo.getSelected().get('cantidad') > 0) {
                        Ext.getCmp('btnAprob').enable();
                    } else {
                        Ext.getCmp('btnAprob').disable();
                    }
                    Ext.getCmp('btnDes').enable();
                    Ext.getCmp('btnEliminarInds').disable();
                } else {
                    Ext.getCmp('btnAprob').disable();
                    Ext.getCmp('btnDes').enable();
                    Ext.getCmp('btnEliminarInds').disable();
                }
            }
            else {
                if (smGpGestModelo.getSelected().get('idaprobaciondemanda') == '4') {
                    if (rectora) {
                        Ext.getCmp('btnAprob').disable();
                        Ext.getCmp('btnDes').enable();
                        Ext.getCmp('btnEliminarInds').disable();
                    }
                    else {
                        Ext.getCmp('btnAprob').disable();
                        Ext.getCmp('btnDes').disable();
                        Ext.getCmp('btnEliminarInds').disable();
                    }
                }
                else {
                    if (smGpGestModelo.getSelected().get('idaprobaciondemanda') == '5') {
                        Ext.getCmp('btnAprob').disable();
                        Ext.getCmp('btnDes').disable();
                    }
                }
            }
        }
    }

}

function ColumnaAprobacion(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    if (val == 1)
        return '<span><img src=' + perfil.dirImg + 'no.png' + '>';
    else if (val == 2)
        return '<span><img src=' + perfil.dirImg + 'yes.png' + '>';
    else if (val == 5)
        return '<span><img src=' + perfil.dirImg + 'yes(azul).png' + '>';
    else
        return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
}

//CON ESTA FUNCION SE PUEDEN PINTAR LAS CELDAS DE UN GRID
function configurarColoresCeldas() {
    for (var i = 0; i < gpModelo.getStore().getCount(); i++) {
        Ext.get(gpModelo.getView().getRow(i)).removeClass('fila-aprobada2');
        Ext.get(gpModelo.getView().getRow(i)).removeClass('fila-aprobada3');
        if (gpModelo.getStore().getAt(i).get('idaprobaciondemanda') > 1) {
            if (gpModelo.getStore().getAt(i).get('idaprobaciondemanda') > 2)
                Ext.get(gpModelo.getView().getRow(i)).addClass('fila-aprobada3');
            else
                Ext.get(gpModelo.getView().getRow(i)).addClass('fila-aprobada2');
        }
        Ext.get(gpModelo.getView().getRow(i)).removeClass('fila-comentada');
        if (gpModelo.getStore().getAt(i).get('comentario')) {
            Ext.get(gpModelo.getView().getRow(i)).addClass('fila-comentada');
        }
    }
}

function cambiarTituloFiltrar() {
    var filtrado_por = "";
    var sep = "/";
    if (filtros.getFiltrosActivos() == undefined || filtros.getFiltrosActivos().length == 0) {
        pModelo.setTitle(perfil.etiquetas.titModelos);
    } else {
        for (i = 0; i < filtros.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtros.getFiltrosActivos()[i].dataIndex == "denominacion") {
                aux = perfil.etiquetas.lbDenominacion;
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "codigo") {
                aux = perfil.etiquetas.lbCodigo;
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "precio") {
                aux = perfil.etiquetas.lbPrecio;
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "preciodivisa") {
                aux = perfil.etiquetas.lbPrecioMLC;
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "umedida") {
                aux = perfil.etiquetas.lbUnidadMedida;
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "numeropieza") {
                aux = perfil.etiquetas.lbNumPieza;
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "cantidad") {
                aux = "Cantidad";
            }
            else if (filtros.getFiltrosActivos()[i].dataIndex == "ajuste") {
                aux = "Ajuste";
            }
            else if (filtros.getFiltrosActivos()[i].dataIndex == "idaprobaciondemanda") {
                aux = "Aprobación";
            }
            else if (filtros.getFiltrosActivos()[i].dataIndex == "cantidadfinal") {
                aux = "Cantidad Final";
            }
            else if (filtros.getFiltrosActivos()[i].dataIndex == "importeajustado") {
                aux = "Importe Ajustado";
            }
            if (filtros.getFiltrosActivos()[i].dataIndex == "importefinal") {
                aux = "Importe Final";
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "centrobalance") {
                aux = perfil.etiquetas.lbCentroBalance;
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "importe") {
                aux = "Importe Inicial";
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "importedivisa") {
                aux = "Importe en MLC";
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "flete") {
                aux = perfil.etiquetas.lbImporteFS;
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "contingencia") {
                aux = perfil.etiquetas.lbImporteConting;
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "viaadquisicion") {
                aux = "Vía de adquisición";
            } else if (filtros.getFiltrosActivos()[i].dataIndex == "organosatisface") {
                aux = "Órgano que satisface";
            }
            if (i == filtros.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }
        pModelo.setTitle(perfil.etiquetas.titModelos + perfil.etiquetas.lbFiltradoPor + filtrado_por);
        filtrado_por = "";
    }
}
function siexisteIndEnModeloFiltrado() {
    if ((filtros.getFiltrosActivos().length > 0) && (stGpGestModelo.getCount() == 0))
        mostrarMensaje(1, perfil.etiquetas.msgBuscar);
}

function ValidateMenu() {
    if (smGpGestModelo.getSelections().length == 1) {
        Ext.getCmp('mdAddcoment').setVisible(true);
        if (smGpGestModelo.getSelected().data.comentario) {
            Ext.getCmp('vercomentario').setVisible(true);
        }
        else {
            Ext.getCmp('vercomentario').setVisible(false);
        }
    }
    else {
        Ext.getCmp('vercomentario').setVisible(false);
        Ext.getCmp('mdAddcoment').setVisible(false);
    }

}

function EsdeBasePlanP(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    if (val == 1)
        return 'Si';
    else if (val == 0)
        return 'No';
    else if (val == 2)
        return 'Afectada';
}

function accionAprobar() {
    var rectora = false;
    if (objci.acciones)
        rectora = objci.acciones.rector;
    if (rectora)
        cambiarEstado(4);
    else
        cambiarEstado(2);
}


function presupuesto() {
    sm = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function(_this, rowindex, record) {
                storeOG.each(function(rec) {
                    Ext.get('checkgridogog_' + rec.id).dom.checked = false;
                });
                if (!Ext.get('checkgridogog_' + record.id).dom.checked) {
                    Ext.get('checkgridogog_' + record.id).dom.checked = true;
                    sel_.checked = true;
                    entro_ = true;
                }
                naes = smNAE.getSelections();
                for (var i = 0; i < naes.length; i++) {
                    Ext.get('checkgridnaeog_' + naes[i].id).dom.checked = true;
                }
            },
            rowdeselect: function(_this, rowindex, record) {
                if (Ext.get('checkgridogog_' + record.id).dom.checked) {
                    Ext.get('checkgridogog_' + record.id).dom.checked = false;
                    sel_.checked = false;
                    entro_ = true;
                }
                naes = smNAE.getSelections();
                if (!_this.hasSelection()) {
                    naes = storeNAE;
                    naes.each(function(record_) {
                        Ext.get('checkgridnaeog_' + record_.id).dom.checked = false;
                    });
                    var aux = (obj) ? obj[0].DatPlanificacionnae : [];
                    for (var i = 0; i < aux.length; i++) {
                        naes.each(function(record_1) {
                            if (record_1.id == aux[i].idnae) {
                                Ext.get('checkgridnaeog_' + record_1.id).dom.checked = true;
                            }
                        });
                    }
                }
            },
            beforerowselect: function(_this, rowindex, keepExisting, record) {
                sel_ = _this.getSelections();
            }
        }
    });
    smNAE = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(_this, rowindex, record) {
                gpOG.enable();
                var aux = (obj) ? obj[0] : [];
                if (aux.length == 0)
                    aux.DatPlanificacionnae = [];
                var flag = false;
                for (var i = 0; i < aux.DatPlanificacionnae.length; i++) {
                    if (aux.DatPlanificacionnae[i].idnae == record.id) {
                        gpOG.getStore().each(function(r) {
                            if (r.id == aux.DatPlanificacionnae[i].DatPlanificacionnaegeneral.DatPlanificacionnaeobjetogasto.idobjetogasto) {
                                gpOG.getSelectionModel().clearSelections();
                                Ext.get('checkgridogog_' + r.id).dom.checked = true;
                                Ext.get('checkgridnaeog_' + record.id).dom.checked = true;
                            }
                        });
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    gpOG.getStore().each(function(r) {
                        gpOG.getSelectionModel().clearSelections();
                        Ext.get('checkgridogog_' + r.id).dom.checked = false;
                    });
                }
            },
            rowdeselect: function(_this, rowindex, record) {
                if (!_this.hasSelection()) {
                    gpOG.getSelectionModel().selectAll();
                    gpOG.getSelectionModel().clearSelections();
                    gpOG.disable();
                } else {
                    var aux = (obj) ? obj[0] : [];
                    if (aux.length == 0)
                        aux.DatPlanificacionnae = [];
                    var flag = false;
                    for (var i = 0; i < aux.DatPlanificacionnae.length; i++) {
                        if (aux.DatPlanificacionnae[i].idnae == record.id) {
                            gpOG.getStore().each(function(r) {
                                if (r.id == aux.DatPlanificacionnae[i].DatPlanificacionnaegeneral.DatPlanificacionnaeobjetogasto.idobjetogasto) {
                                    gpOG.getSelectionModel().clearSelections();
                                    Ext.get('checkgridogog_' + r.id).dom.checked = false;
                                }
                            });
                            flag = true;
                            break;
                        }
                    }
                    if (!flag)
                        Ext.get('checkgridnaeog_' + record.id).dom.checked = false;
                }
            }
        }
    });
    //creando el repositorio de datos
    storeNAE = new Ext.data.Store({
        url: baseUrl + 'cargarnaes',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'idnae'
        }, [{
                name: 'idnae'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }])
    });
    //Creando el objeto Ext.grid.ColumnModel


    myColumnModel = new Ext.grid.ColumnModel([{
            width: 24,
            fixed: true,
            sortable: true,
            renderer: getCheck_
        },
        {
            header: "Código",
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTip
        },
        {
            id: 'expandir',
            header: "NAE",
            //width: 100,
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }
    ]);
    btnLimpiarFiltrosP = new Ext.Button({
        id: 'btnLimpiarFiltrosP',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtrosNAE.clearFilters();
            storeNAE.reload();
        }
    });
    //Combo para ver  la cantidad

    stCbPaginado1 = new Ext.data.SimpleStore({
        fields: ['idnumpagi', 'dennumpagi'],
        data: [
            [20, '20'],
            [80, '80'],
            [100, '100'],
            [250, '250'],
            [500, '500'],
            [750, '750'],
            [1000, '1000']
        ]
    });
    cbPaginado1 = new Ext.form.ComboBox({
        value: 20,
        store: stCbPaginado1,
        displayField: 'dennumpagi',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpagi',
        valueField: 'idnumpagi',
        width: 60,
        emptyText: 'Seleccionar',
        listeners: {
            select: function(cb, record, index) {
                Ext.getCmp('paginado2').pageSize = record.data.idnumpagi;
                Ext.getCmp('paginado2').doLoad(Ext.getCmp('paginado2').cursor);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    //creamos una variable para referenciar a nuesto objeto
    paginado2 = new Ext.PagingToolbar({
        pageSize: 20,
        store: storeNAE,
        id: 'paginado2',
        displayInfo: true,
        items: [btnLimpiarFiltrosP, cbPaginado1]
    });
    filtrosNAE = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'

            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });
    gpNAE = new Ext.grid.GridPanel({
        title: 'Nivel de Actividad Económica',
        region: 'west',
        store: storeNAE,
        plugins: filtrosNAE,
        cm: myColumnModel,
        sm: smNAE,
        autoExpandColumn: 'expandir',
        height: 250,
        width: 450,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: paginado2,
        contextmenu: new Ext.menu.Menu({
            items: [{
                    icon: perfil.dirImg + 'eliminar.png',
                    iconCls: 'btn',
                    handler: function() {
                        selections = gpNAE.getSelectionModel().getSelections();
                        idnaes = [];
                        idplanificaciones = [];
                        for (var i = 0; i < selections.length; i++) {
                            idnaes.push(selections[i].id);
                        }
                        selections_plan = winAsociar.planificaciones
                        for (var j = 0; j < selections_plan.length; j++) {
                            idplanificaciones.push(selections_plan[j].data.idplanificacion);
                        }
                        Planificacion.mostrarMascara('eliminarasociacionnaeog', 'Eliminando la(s) asociacion(es)', 'Desasociando...');
                        Ext.Ajax.request({
                            url: baseUrl + 'eliminarasociacionesnaeobjetogasto',
                            params: {
                                idnaes: Ext.encode(idnaes),
                                idplanificaciones: Ext.encode(idplanificaciones),
                                idejercicio: cbEjercicio.getValue()
                            },
                            callback: function(options, success, response) {
                                response = Ext.decode(response.responseText);
                                Planificacion.ocultarMascara('eliminarasociacionnaeog');
                                if (response.cod == 1) {
                                    winAsociar.close();
                                    mostrarMensaje(1, 'Se ha(n) eliminado la(s) asociacion(es) correctamente', function() {
                                        storeAsociadoaPresupuesto.reload();
                                    });
                                }

                            }
                        });
                    }
                }]
        }),
        listeners: {
            rowcontextmenu: function(grid_this, row_index, event) {
                event.stopEvent();
                grid_this.getSelectionModel().selectRow(row_index);
                selections = grid_this.getSelectionModel().getSelections();
                if (grid_this.getSelectionModel().hasSelection()) {
                    if (selections.length > 1) {
                        grid_this.contextmenu.items.itemAt(0).setText('Eliminar asociaciones');
                    } else {
                        grid_this.contextmenu.items.itemAt(0).setText('Eliminar asociacion');
                    }
                    grid_this.contextmenu.showAt(event.getXY());
                }

            }
        }
    });
    gpNAE.getStore().reload({
        params: {
            start: 0,
            limit: 20
        }
    });
    //creando el repositorio de datos
    storeOG = new Ext.data.Store({
        url: baseUrl + 'cargarobjetosgasto',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'idobjetogasto'
        }, [{
                name: 'idobjetogasto'
            }, , {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }])
    });
    //******check***********
    checkOG = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });
    //Creando el objeto Ext.grid.ColumnModel
    myColumnModelOG = new Ext.grid.ColumnModel([
        {
            width: 24,
            fixed: true,
            sortable: true,
            renderer: getCheck_OG
        },
        {
            header: "Código",
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTip
        },
        {
            id: 'idcolumnog',
            header: "Denominación",
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }
    ]);
    btnLimpiarFiltrosOG = new Ext.Button({
        id: 'btnLimpiarFiltrosOG',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtrosOG.clearFilters();
            storeOG.reload();
        }
    });
    stCbPaginado3 = new Ext.data.SimpleStore({
        fields: ['idnumpagina', 'dennumpagina'],
        data: [
            [20, '20'],
            [80, '80'],
            [100, '100'],
            [250, '250'],
            [500, '500'],
            [750, '750'],
            [1000, '1000']
        ]
    });
    cbPaginado3 = new Ext.form.ComboBox({
        value: 20,
        store: stCbPaginado3,
        displayField: 'dennumpagina',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpagina',
        valueField: 'idnumpagina',
        width: 60,
        emptyText: 'Seleccionar',
        listeners: {
            select: function(cb, record, index) {
                Ext.getCmp('paginado1').pageSize = record.data.idnumpagina;
                Ext.getCmp('paginado1').doLoad(Ext.getCmp('paginado1').cursor);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    paginado1 = new Ext.PagingToolbar({
        pageSize: 20,
        store: storeOG,
        id: 'paginado1',
        displayInfo: true,
        items: [btnLimpiarFiltrosOG, cbPaginado3]
    });
    filtrosOG = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });
    //creamos una variable para referenciar a nuesto objeto
    gpOG = new Ext.grid.GridPanel({
        title: 'Objeto de Gasto',
        region: 'center',
        id: 'gpOG',
        store: storeOG,
        cm: myColumnModelOG,
        plugins: filtrosOG,
        sm: sm,
        disabled: true,
        autoExpandColumn: 'idcolumnog',
        height: 250,
        width: 200,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: paginado1,
        listeners: {
            start: 0,
            limit: 20
        }
    });
    gpOG.getStore().reload({
        params: {
            start: 0,
            limit: 20
        }
    });
    btnCancelar = new Ext.Toolbar.Button({
        id: 'btncancelar',
        icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'btn',
        text: 'Cancelar',
        handler: function() {

            winAsociar.close()
        }
    });
    btnAsociar = new Ext.Toolbar.Button({
        id: 'btnAsociar',
        icon: perfil.dirImg + 'asociar.png',
        iconCls: 'btn',
        text: 'Asociar',
        handler: function() {
            idnaes = [];
            del = 0;
            idplanificaciones = [];
            selections = gpNAE.getSelectionModel().getSelections();
            for (var i = 0; i < selections.length; i++) {
                idnaes.push(selections[i].id);
            }
            selections_plan = winAsociar.planificaciones
            for (var j = 0; j < selections_plan.length; j++) {
                idplanificaciones.push(selections_plan[j].data.idplanificacion);
            }
            if (idplanificaciones.length > 1)
                del = 1;
            if (gpNAE.getSelectionModel().getSelected() && gpOG.getSelectionModel().getSelected() && selections_plan) {
                Planificacion.mostrarMascara('mascaraAsociarOG', 'Por favor espere...', 'Aplicando cambios');
                Ext.Ajax.request({
                    url: baseUrl + 'asociarmodeloaobjetogasto',
                    params: {
                        idplanificaciones: Ext.encode(idplanificaciones),
                        idnaes: Ext.encode(idnaes),
                        del: del,
                        idobjgasto: gpOG.getSelectionModel().getSelected().id,
                        idejercicio: cbEjercicio.getValue()
                    },
                    callback: function(options, success, response) {
                        respuesta = Ext.decode(response.responseText);
                        Planificacion.ocultarMascara('mascaraAsociarOG');
                        if (respuesta.cod == 3) {
                            mostrarMensaje(3, 'Ha ocurrido un error');
                        } else if (respuesta.cod == 1) {
                            winAsociar.close();
                            mostrarMensaje(1, 'Se han realizado los cambios correctamente', function() {
                                storeAsociadoaPresupuesto.reload();
                            });
                        }
                    }
                });
            } else {
                mostrarMensaje(3, 'Debe seleccionar un NAE y un Objeto de gasto');
            }
        }
    });
    winAsociar = new Ext.Window({
        title: "Asociar a Objeto de Gasto",
        width: 1000,
        layout: 'border',
        height: 300,
        modal: true,
        planificaciones: smGpAsociadoaPresupuesto.getSelections(),
        closeAction: 'destroy',
        buttons: [btnCancelar, btnAsociar],
        items: [gpNAE, gpOG]
    });
    cont = 0;
    Ext.getBody().mask('Cargando...', 'ext-el-mask-msg x-mask-loading');
    storeNAE.reload({
        callback: function() {
            cont++;
            if (cont == 2) {
                Ext.getBody().unmask();
                winAsociar.show();
            }
        }
    });
    storeOG.reload({
        callback: function() {
            cont++;
            if (cont == 2) {
                Ext.getBody().unmask();
                winAsociar.show();
            }

        }
    });
}
function recursofinaciero() {
    sm = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function(_this, rowindex, record) {
                storeRecurso.each(function(rec) {
                    Ext.get('checkgridrfrf_' + rec.id).dom.checked = false;
                });
                if (!Ext.get('checkgridrfrf_' + record.id).dom.checked) {
                    Ext.get('checkgridrfrf_' + record.id).dom.checked = true;
                    sel.checked = true;
                    entro = true;
                }
                naes = smNAE.getSelections();
                for (var i = 0; i < naes.length; i++) {
                    Ext.get('checkgridnaerf_' + naes[i].id).dom.checked = true;
                }
            },
            rowdeselect: function(_this, rowindex, record) {
                if (Ext.get('checkgridrfrf_' + record.id).dom.checked) {
                    Ext.get('checkgridrfrf_' + record.id).dom.checked = false;
                    sel.checked = false;
                    entro = true;
                }
                naes = smNAE.getSelections();
                if (!_this.hasSelection()) {
                    naes = storeNAE;
                    naes.each(function(record_) {
                        Ext.get('checkgridnaerf_' + record_.id).dom.checked = false;
                    });
                    var aux = (obj) ? obj[0].DatPlanificacionnae : [];
                    for (var i = 0; i < aux.length; i++) {
                        naes.each(function(record_1) {
                            if (record_1.id == aux[i].idnae) {
                                Ext.get('checkgridnaerf_' + record_1.id).dom.checked = true;
                            }
                        });
                    }
                }
            },
            beforerowselect: function(_this, rowindex, keepExisting, record) {
                sel = _this.getSelections();
            }
        }
    });
    smNAE = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(_this, rowindex, record) {
                gpRF.enable();
                var aux = (obj) ? obj[0] : [];
                if (aux.length == 0)
                    aux.DatPlanificacionnae = [];
                var flag = false;
                for (var i = 0; i < aux.DatPlanificacionnae.length; i++) {
                    if (aux.DatPlanificacionnae[i].idnae == record.id) {
                        gpRF.getStore().each(function(r) {
                            if (r.id == aux.DatPlanificacionnae[i].DatPlanificacionnaegeneral.DatPlanificacionnaeingreso.idingreso) {
                                gpRF.getSelectionModel().clearSelections();
                                Ext.get('checkgridrfrf_' + r.id).dom.checked = true;
                                Ext.get('checkgridnaerf_' + record.id).dom.checked = true;
                            }
                        });
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    gpRF.getStore().each(function(r) {
                        gpRF.getSelectionModel().clearSelections();
                        Ext.get('checkgridrfrf_' + r.id).dom.checked = false;
                    });
                }
            },
            rowdeselect: function(_this, rowindex, record) {
                if (!_this.hasSelection()) {
                    gpRF.getSelectionModel().selectAll();
                    gpRF.getSelectionModel().clearSelections();
                    gpRF.disable();
                } else {
                    var aux = obj[0];
                    var flag = false;
                    for (var i = 0; i < aux.DatPlanificacionnae.length; i++) {
                        if (aux.DatPlanificacionnae[i].idnae == record.id) {
                            gpRF.getStore().each(function(r) {
                                if (r.id == aux.DatPlanificacionnae[i].DatPlanificacionnaegeneral.DatPlanificacionnaeingreso.idingreso) {
                                    gpRF.getSelectionModel().clearSelections();
                                    Ext.get('checkgridrfrf_' + r.id).dom.checked = false;
                                }
                            });
                            flag = true;
                            break;
                        }
                    }
                    if (!flag)
                        Ext.get('checkgridnaerf_' + record.id).dom.checked = false;
                }
            },
            beforerowselect: function(_this, rowindex, keepExisting, record) {

            }
        }
    });
    //creando el repositorio de datos
    storeNAE = new Ext.data.Store({
        url: baseUrl + 'cargarnaes',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'idnae'
        }, [{
                name: 'idnae'
            }, {
                name: 'codigo'
            }, {
                name: 'denominacion'
            }])
    });
    //Creando el objeto Ext.grid.ColumnModel
    myColumnModel = new Ext.grid.ColumnModel([{
            width: 24,
            fixed: true,
            sortable: true,
            renderer: getCheck
        }, {
            header: "Código",
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTip
        },
        {
            id: 'expandir',
            header: "NAE",
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }
    ]);
    btnLimpiarFiltrosP = new Ext.Button({
        id: 'btnLimpiarFiltrosP',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtrosNAE.clearFilters();
            storeNAE.reload();
        }
    });
    stCbPaginado3 = new Ext.data.SimpleStore({
        fields: ['idnumpagin', 'dennumpagin'],
        data: [
            [20, '20'],
            [80, '80'],
            [100, '100'],
            [250, '250'],
            [500, '500'],
            [750, '750'],
            [1000, '1000']
        ]
    });
    cbPaginado3 = new Ext.form.ComboBox({
        value: 20,
        store: stCbPaginado3,
        displayField: 'dennumpagin',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpagin',
        valueField: 'idnumpagin',
        width: 60,
        emptyText: 'Seleccionar',
        listeners: {
            select: function(cb, record, index) {
                Ext.getCmp('paginado3').pageSize = record.data.idnumpagin;
                Ext.getCmp('paginado3').doLoad(Ext.getCmp('paginado3').cursor);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    //creamos una variable para referenciar a nuesto objeto
    paginado3 = new Ext.PagingToolbar({
        pageSize: 20,
        store: storeNAE,
        id: 'paginado3',
        displayInfo: true,
        items: [btnLimpiarFiltrosP, cbPaginado3]
    });
    filtrosNAE = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'

            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });
    gpNAE = new Ext.grid.GridPanel({
        title: 'Nivel de Actividad Económica',
        region: 'west',
        store: storeNAE,
        cm: myColumnModel,
        sm: smNAE,
        plugins: filtrosNAE,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: paginado3,
        contextmenu: new Ext.menu.Menu({
            items: [{
                    icon: perfil.dirImg + 'eliminar.png',
                    iconCls: 'btn',
                    handler: function() {
                        selections = gpNAE.getSelectionModel().getSelections();
                        idnaes = [];
                        idplanificaciones = [];
                        for (var i = 0; i < selections.length; i++) {
                            idnaes.push(selections[i].id);
                        }
                        selections_plan = winAsociarRF.planificaciones
                        for (var j = 0; j < selections_plan.length; j++) {
                            idplanificaciones.push(selections_plan[j].data.idplanificacion);
                        }
                        Planificacion.mostrarMascara('eliminarasociacionnaerf', 'Eliminando la(s) asociacion(es)', 'Desasociando...');
                        Ext.Ajax.request({
                            url: baseUrl + 'eliminarasociacionesnaerecursos',
                            params: {
                                idnaes: Ext.encode(idnaes),
                                idplanificaciones: Ext.encode(idplanificaciones),
                                idejercicio: cbEjercicio.getValue()

                            },
                            callback: function(options, success, response) {
                                response = Ext.decode(response.responseText);
                                Planificacion.ocultarMascara('eliminarasociacionnaerf');
                                if (response.cod == 1) {
                                    winAsociarRF.close();
                                    mostrarMensaje(1, 'Se ha(n) eliminado la(s) asociacion(es) correctamente', function() {
                                        storeAsociadoaPresupuesto.reload();
                                    });
                                }

                            }
                        });
                    }
                }]
        }),
        autoExpandColumn: 'expandir',
        height: 250,
        width: 480,
        listeners: {
            rowcontextmenu: function(grid_this, row_index, event) {
                event.stopEvent();
                grid_this.getSelectionModel().selectRow(row_index);
                selections = grid_this.getSelectionModel().getSelections();
                if (grid_this.getSelectionModel().hasSelection()) {
                    if (selections.length > 1) {
                        grid_this.contextmenu.items.itemAt(0).setText('Eliminar asociaciones');
                    } else {
                        grid_this.contextmenu.items.itemAt(0).setText('Eliminar asociacion');
                    }
                    grid_this.contextmenu.showAt(event.getXY());
                }

            }
        }
    });
    gpNAE.getStore().reload({
        params: {
            start: 0,
            limit: 20
        }
    });
    //creando el repositorio de datos
    storeRecurso = new Ext.data.Store({
        url: baseUrl + 'cargarnrecursosfinacieros',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total',
            id: 'idrecursofinanciero'
        }, [{
                name: 'idrecursofinanciero'
            }, {
                name: 'codigo'
            }, , {
                name: 'denominacion'
            }])
    });
    stCbPaginado = new Ext.data.SimpleStore({
        fields: ['idnumpag', 'dennumpag'],
        data: [
            [20, '20'],
            [80, '80'],
            [100, '100'],
            [250, '250'],
            [500, '500'],
            [750, '750'],
            [1000, '1000']
        ]
    });
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
                Ext.getCmp('paginadoRF').pageSize = record.data.idnumpag;
                Ext.getCmp('paginadoRF').doLoad(Ext.getCmp('paginadoRF').cursor);
            }
        },
        maskRe: /^([0-9]+ ?[0-9]*)+$/,
        maskReregex: /^([0-9]+ ?[0-9]*)+$/
    });
    btnLimpiarFiltrosRF = new Ext.Button({
        id: 'btnLimpiarFiltrosRF',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function() {
            filtrosRF.clearFilters();
            storeRecurso.reload();
        }
    });
    paginadoRF = new Ext.PagingToolbar({
        pageSize: 20,
        store: storeRecurso,
        id: 'paginadoRF',
        displayInfo: true,
        items: [btnLimpiarFiltrosRF, cbPaginado]
    });
    //Creando el objeto Ext.grid.ColumnModel
    myColumnModelRF = new Ext.grid.ColumnModel([{
            width: 24,
            fixed: true,
            sortable: true,
            renderer: getCheck_RF
        }, {
            header: "Código",
            width: 100,
            sortable: true,
            dataIndex: 'codigo',
            renderer: crearToolTip
        },
        {
            id: 'idcolumrf',
            header: "Recurso financiero",
            sortable: true,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }
    ]);
    filtrosRF = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'codigo'
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }]
    });
    //creamos una variable para referenciar a nuesto objeto

    gpRF = new Ext.grid.GridPanel({
        title: 'Recurso finaciero',
        region: 'center',
        store: storeRecurso,
        plugins: filtrosRF,
        id: 'gpRF',
        cm: myColumnModelRF,
        sm: sm,
        disabled: true,
        autoExpandColumn: 'idcolumrf',
        height: 250,
        width: 200,
        loadMask: {
            msg: perfil.etiquetas.lbCargando
        },
        bbar: paginadoRF,
        listeners: {
            start: 0,
            limit: 20,
            rowclick: function(_this, rowindex, event) {

            }
        }
    });
    gpRF.getStore().reload({
        params: {
            start: 0,
            limit: 20
        }
    });
    btnCancelar = new Ext.Toolbar.Button({
        id: 'btncancelarrf',
        icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'btn',
        text: 'Cancelar',
        handler: function() {
            winAsociarRF.close();
        }
    });
    btnAsociar = new Ext.Toolbar.Button({
        id: 'btnAsociar',
        icon: perfil.dirImg + 'asociar.png',
        iconCls: 'btn',
        text: 'Asociar',
        handler: function() {
            idnaes = [];
            idplanificaciones = [];
            del = 0;
            selections = gpNAE.getSelectionModel().getSelections();
            for (var i = 0; i < selections.length; i++) {
                idnaes.push(selections[i].id);
            }
            selections_plan = winAsociarRF.planificaciones
            for (var j = 0; j < selections_plan.length; j++) {
                idplanificaciones.push(selections_plan[j].data.idplanificacion);
            }
            if (idplanificaciones.length > 1)
                del = true;
            Planificacion.mostrarMascara('mascaraAsociarRF', 'Por favor espere...', 'Aplicando cambios');
            Ext.Ajax.request({
                url: baseUrl + 'asociarmodeloarecursofinaciero',
                params: {
                    idplanificaciones: Ext.encode(idplanificaciones),
                    idnaes: Ext.encode(idnaes),
                    del: del,
                    idingreso: gpRF.getSelectionModel().getSelected().id,
                    idejercicio: cbEjercicio.getValue()
                },
                callback: function(options, success, response) {
                    respuesta = Ext.decode(response.responseText);
                    Planificacion.ocultarMascara('mascaraAsociarRF');
                    if (respuesta.cod == 3) {
                        mostrarMensaje(3, 'Ha ocurrido un error');
                    } else if (respuesta.cod == 1) {
                        winAsociarRF.close();
                        mostrarMensaje(1, 'Se han realizado los cambios correctamente', function() {
                            storeAsociadoaPresupuesto.reload();
                        });
                    }
                }
            });
        }
    });
    winAsociarRF = new Ext.Window({
        title: "Asociar a Recurso financiero",
        width: 1000,
        layout: 'border',
        height: 300,
        planificaciones: smGpAsociadoaPresupuesto.getSelections(),
        modal: true,
        closeAction: 'destroy',
        buttons: [btnCancelar, btnAsociar],
        items: [gpNAE, gpRF]
    })
    var cont = 0;
    Ext.getBody().mask('Cargando...', 'ext-el-mask-msg x-mask-loading');
    storeNAE.reload({
        callback: function() {
            cont++;
            if (cont == 2) {
                Ext.getBody().unmask();
                winAsociarRF.show();
            }
        }
    });
    storeRecurso.reload({
        callback: function() {
            cont++;
            if (cont == 2) {
                Ext.getBody().unmask();
                winAsociarRF.show();
            }
        }
    });
}
//stopEvent
function getCheck(value, metadata, record, rowindex, colindex, store) {
    var aux = (obj) ? obj[0].DatPlanificacionnae : [];
    var check = "<input onclick='stopEvent(this.id)' type='checkbox' id='" + "checkgridnaerf_" + record.id + "'>";
    for (var i = 0; i < aux.length; i++) {
        if (record.id == aux[i].idnae) {
            check = "<input onclick='stopEvent(this.id)'  id='" + "checkgridnaerf_" + record.id + "' type='checkbox' checked='true'>";
        }
    }
    return check;
}
function getCheck_RF(value, metadata, record, rowindex, colindex, store) {
    var check = "<input onclick='selectRow(this.id)' type='checkbox' id='" + "checkgridrfrf_" + record.id + "'>";
    return check;
}
function getCheck_(value, metadata, record, rowindex, colindex, store) {
    var aux = (obj) ? obj[0].DatPlanificacionnae : [];
    var check = "<input onclick='stopEvent(this.id)' type='checkbox' id='" + "checkgridnaeog_" + record.id + "'>";
    for (var i = 0; i < aux.length; i++) {
        if (record.id == aux[i].idnae) {
            check = "<input onclick='stopEvent(this.id)'  id='" + "checkgridnaeog_" + record.id + "' type='checkbox' checked='true'>";
        }
    }
    return check;
}
function getCheck_OG(value, metadata, record, rowindex, colindex, store) {
    var check = "<input onclick='selectRow_(this.id)' type='checkbox' id='" + "checkgridogog_" + record.id + "'>";
    return check;
}
function stopEvent(id) {
    check = Ext.get(id);
    check.dom.checked = !check.dom.checked;
}
function selectRow(id) {
    idrecord = id.substr(14, id.length);
    check = Ext.get(id);
    store = Ext.getCmp('gpRF').getStore();
    if (entro)
        check.dom.checked = sel.checked;
    if (!check.dom.checked) {
        index = store.find('idingreso', idrecord);
        Ext.getCmp('gpRF').getSelectionModel().deselectRow(index);
    }
    entro = false;
}
function selectRow_(id) {
    idrecord = id.substr(14, id.length);
    check = Ext.get(id);
    store = Ext.getCmp('gpOG').getStore();
    if (entro_)
        check.dom.checked = sel_.checked;
    if (!check.dom.checked) {
        index = store.find('idobjetogasto', idrecord);
        Ext.getCmp('gpOG').getSelectionModel().deselectRow(index);
    }
    entro_ = false;
}
function getRawValue(v, cmb, g, c) {
    var arrid = (v != null) ? v.split(",") : '';

    var str = '';
    if (v != '') {
        str += ((cmb.store.find(cmb.valueField, arrid[0]) != -1)
                ? cmb.store.getAt(cmb.store.find(cmb.valueField, arrid[0])).data[cmb.displayField]
                : '');
    }
    return str;
}

function eliminarTodasAsociaciones(idplanificaciones) {
    if (idplanificaciones.length > 0) {
        ids = [];
        for (var j = 0; j < idplanificaciones.length; j++) {
            ids.push(idplanificaciones[j].data.idplanificacion);
        }
        Planificacion.mostrarMascara('eliminarasociaciones', 'Eliminando las asociaciones', 'Desasociando...');
        Ext.Ajax.request({
            url: baseUrl + 'eliminarasociaciones',
            params: {
                idplanificaciones: Ext.encode(ids),
                idejercicio: cbEjercicio.getValue()
            },
            callback: function(options, success, response) {
                response = Ext.decode(response.responseText);
                Planificacion.ocultarMascara('eliminarasociaciones');
                if (response.cod == 1) {
                    mostrarMensaje(1, 'Se han eliminado las asociaciones correctamente', function() {
                        storeAsociadoaPresupuesto.reload();
                    });
                }



            }
        });
    }
}
if (!Object.keys) {
    Object.keys = function(obj) {
        var keys = [];
        for (k in obj)
            if (obj.hasOwnProperty(k))
                keys.push(k);
        return keys;
    };
}

function tresdecimales(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    return parseFloat(val).toFixed(3);
}

function setearImporte() {
    importes = [];
    importes.push('0.000'); //indice 0
    importes.push('0.000'); //indice 1 MN
    importes.push('0.000'); //indice 2 MLC
    importes.push('0.000'); //indice 3 IFlete
    importes.push('0.000'); //indice 4 IContingencia
}

function calcularImporteTotal() {
    setearImporte();
    if (stGpGestModelo.getCount() > 0) {
        importes[1] = jrStGpGestModelo.jsonData.importetotal;
        importes[2] = jrStGpGestModelo.jsonData.importedivisatotal;
        importes[3] = jrStGpGestModelo.jsonData.importeflete;
        importes[4] = jrStGpGestModelo.jsonData.importecontingencia;
        importes[5] = jrStGpGestModelo.jsonData.importeajustado;
        importes[6] = jrStGpGestModelo.jsonData.importefinal;
        tfImportePlan.setValue(importes[cbImportesPlan.getValue()]);
    } else {
        tfImportePlan.setValue(importes[0]);
    }
}
function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}


function siexistecolumFiltrada() {
    if (filtrosGpdemandacentrobalance.getFiltrosActivos().length > 0 && stGpdemandacentrobalance.getCount() == 0)
        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
}
function siexistecolumFiltradaVer() {
    if (filtrosGpVerAct.getFiltrosActivos().length > 0 && stGpVerAct.getCount() == 0)
        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}
function ValidarOperacion(campo, valor, sm) {

    if (campo == 'ajuste' && valor < 0 && (-1 * valor) > sm.record.data.cantidad) {

        Ext.MessageBox.show({
            title: 'Información',
            buttons: Ext.MessageBox.OK,
            msg: perfil.etiquetas.msgAjusteIncorrecto,
            icon: Ext.MessageBox.INFO
        });
        sm.cancel = true;
    }

}
