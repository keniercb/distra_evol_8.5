perfil.etiquetas = Object();
urlLoaderTree = '../gestplanes/listarPlanModelo';
cargarEntidades = '../gestplanes/cargarEntidades';
var contextMenuBase, loaderTree, upMenuDerTree, winEntidades, pbLoad, wnLoad;
var winAsociar;
var winDesAsociar;
var accion, acc;
var control2 = 0, importeIn = 0, importAju = 0, importeFi = 0;
var rectora, bandera = 0, maskPlanTree;

configuraTreePanel = function() {

    pbLoad = new Ext.ProgressBar({
        text: perfil.etiquetas.lbEspere,
        id: 'pbar2',
        cls: 'custom'
    });
    wnLoad = new Ext.Window({
        title: perfil.etiquetas.lbEspere,
        layout: 'fit',
        width: 320,
        height: 50,
        constrain: true,
        closable: false,
        resizable: false,
        plain: true,
        modal: true,
        items: [pbLoad],
        closeAction: 'hide',
        listeners: {
            show: function() {
                pbLoad.text = perfil.etiquetas.lbCargandoD;
                pbLoad.wait({
                    interval: 200,
                    increment: 25,
                    fn: function() {
                    }
                });
            },
            hide: function() {
                pbLoad.reset();
            }
        }
    });

    var porcientotext = {
        xtype: 'tbtext',
        id: 'porcientotex',
        width: 50,
        height: 35,
        text: 'Porciento a ajustar:'
    };

    var espacio = {
        xtype: 'panel',
        id: 'idespacio',
        frame: false,
        border: false,
        width: 500,
        height: 30
    };

    var porciento = {
        xtype: 'numberfield',
        id: 'porciento',
        maskRe: /^([0-9-]+ ?[0-9-]*)+$/,
        maskReregex: /^([0-9-]+ ?[0-9-]*)+$/,
        maxValue: 100,
        minValue: -100,
        maxText: 'Solo admite números enteros entre 0 y 100.',
        minText: 'Solo admite números enteros entre 0 y 100.',
        allowBlank: false,
        width: 100,
        height: 25,
        enableKeyEvents: true,
        editable: false,
        fieldLabel: 'Porciento a ajustar',
        listeners: {
            keyup: function(btn, e) {
                if (Ext.getCmp('porciento').getValue() != '' && Ext.getCmp('porciento').getValue() != ' ' || Ext.getCmp('porciento').getValue() == 0) {
                    Ext.getCmp('btnCalcular').enable();


                } else {
                    Ext.getCmp('btnCalcular').disable();

                }

            }
        }
    };
    var pPorciento = new Ext.Panel({
        frame: false,
        border: false,
        width: 150,
        height: 25,
        items: [porciento]
    });
    btnCalcular = new Ext.Button({
        text: 'Calcular',
        id: 'btnCalcular',
        disabled: true,
        height: 15,
        //icon: perfil.dirImg + 'buscar.png',
        iconCls: 'calcular',
        handler: function() {
            Ext.getCmp('idajustar').enable();
            CalcularAjuste();
        }
    });
    var espacio = {
        xtype: 'panel',
        id: 'idespacio',
        frame: false,
        border: false,
        width: 500,
        height: 30
    };
    var importInicial = {
        xtype: 'textfield',
        id: 'importInicial',
        width: 100,
        height: 25,
        fieldLabel: 'Importe Inicial',
        editable: false,
        disabled: true
    };
    var importFinal = {
        xtype: 'textfield',
        id: 'importFinal',
        width: 100,
        height: 25,
        fieldLabel: 'Importe Final',
        editable: false,
        disabled: true
    };
    var importAjustado = {
        xtype: 'textfield',
        id: 'importAjustado',
        width: 100,
        height: 25,
        fieldLabel: 'Importe Ajustado',
        editable: false,
        disabled: true
    };
    fpAjustar = new Ext.FormPanel({
        id: 'fpAjustar',
        autoHeight: true,
        width: 400,
        height: 2000,
        frame: true,
        labelAlign: 'top',
        items: [{
                layout: 'column',
                items: [{
                        columnWidth: .33,
                        layout: 'form',
                        bodyStyle: "padding:30px 0px 0px 20px",
                        items: [porcientotext]
                    }, {
                        columnWidth: .33,
                        layout: 'form',
                        bodyStyle: "padding:25px 0px 0px",
                        items: [pPorciento]
                    }
                    , {
                        columnWidth: .33,
                        layout: 'form',
                        frame: false,
                        align: 'left',
                        bodyStyle: "padding:25px 0px 0px",
                        items: [btnCalcular]
                    }
                ]
            }
            , {
                layout: 'column',
                items: [{
                        columnWidth: .33,
                        layout: 'form',
                        items: [espacio]
                    },
                    {
                        columnWidth: .33,
                        layout: 'form',
                        items: [espacio]
                    },
                    {
                        columnWidth: .33,
                        layout: 'form',
                        items: [espacio]
                    }
                ]
            }
            , {
                layout: 'column',
                bodyStyle: "padding:0px 0px 0px 20px",
                columnWidth: .33,
                items: [{
                        columnWidth: .33,
                        layout: 'form',
                        items: [importInicial]
                    }, {
                        columnWidth: .33,
                        layout: 'form',
                        items: [importAjustado]
                    }, {
                        columnWidth: .33,
                        layout: 'form',
                        items: [importFinal]
                    }]
            }

        ]
    });
    winRealizarAjuste = new Ext.Window({
        modal: true,
        closeAction: 'hide',
        width: 400,
        constrain: true,
        height: 2000,
        title: 'Realizar ajuste',
        autoHeight: true,
        items: fpAjustar,
        buttons: [{
                // icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'cancelar',
                tooltip: 'Cerrar ventana sin guardar los datos',
                tabIndex: 33,
                text: 'Cancelar',
                handler: function() {

                    winRealizarAjuste.hide();
                    Ext.getCmp('btnCalcular').disable();
                    Ext.getCmp('idajustar').disable();
                    Ext.getCmp('porciento').reset();
                    Ext.getCmp('importInicial').setValue('');
                    Ext.getCmp('importFinal').setValue('');
                    Ext.getCmp('importAjustado').setValue('');
                }
            }, {
                //  icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'aceptar',
                disabled: true,
                tooltip: 'Guardar datos y cerrar ventana',
                tabIndex: 31,
                id: 'idajustar',
                text: 'Aceptar',
                handler: function() {
                    winRealizarAjuste.hide();
                    Ext.getCmp('btnCalcular').disable();
                    Ext.getCmp('idajustar').disable();
                    insertarAjuste();
                    LimpiarValores();
                    stGpGestModelo.reload();

                }
            }]
    });

    configuraModelo();

    contextMenuBase = new Ext.menu.Menu({// 000000
        id: 'trMenuD',
        items: [
            {
                text: perfil.etiquetas.lbAdicionarIndicador,
                itemCls: 'x-menu-item icondistra-adicionar',
                iconCls: 'imagen-none',
                id: 'addVarios',
                handler: function() {
                    importarJS('../../views/js/comun/indicadorespornivel.js');
                }
            },
            {
                text: perfil.etiquetas.lbAdicionarP,
                itemCls: 'x-menu-item icondistra-adicionar',
                iconCls: 'imagen-none',
                id: 'addplan',
                handler: function() {
                    control2 = 1;
                    if (!winAddPlan)
                        crearIUAddModPlan(control2);
                    fpPlan.getForm().reset();
                    winAddPlan.show(Ext.getBody());
                    Ext.getCmp('codigoplan').enable();
                    winAddPlan.setTitle(perfil.etiquetas.lbAdicionarP);
                    Ext.getCmp('node').setValue(tpBasePlan.getSelectionModel().getSelectedNode().attributes.id);
                }
            }, {
                text: perfil.etiquetas.lbTtbtnModelo,
                itemCls: 'x-menu-item icondistra-adicionar',
                iconCls: 'imagen-none',
                id: 'addmodelo',
                handler: function() {
                    acc = 'Adicionar';
                    accion = 2;
                    if (!winAddModelo)
                        crearIUAddModModelo();

                    Ext.getCmp('idaplicarplan').show();
                    fpModelo.getForm().reset();
                    winAddModelo.show(Ext.getBody());
                    winAddModelo.setTitle(perfil.etiquetas.lbAdicionarM);
                    Ext.getCmp('idplanm').setValue(treesel);
                }
            }/*, {
             text: perfil.etiquetas.lbTtbtnComen,
             itemCls: 'x-menu-item icondistra-adicionar',
             iconCls: 'imagen-none',
             id: 'addcoment',
             handler: function () {
             fpComent.getForm().reset();
             winAddComent.show(Ext.getBody());
             winAddComent.setTitle(perfil.etiquetas.lbAdicionarC);
             Ext.getCmp('idelemcoment').setValue(treesel);
             }
             }*/, {
                text: perfil.etiquetas.titModPlan,
                itemCls: 'x-menu-item icondistra-modificar',
                iconCls: 'imagen-none',
                id: 'modplan',
                handler: function() {
                    control2 = 2;
                    if (!winAddPlan)
                        crearIUAddModPlan(control2);
                    winAddPlan.show(Ext.getBody());
                    Ext.getCmp('codigoplan').disable();
                    winAddPlan.setTitle(perfil.etiquetas.lbModificarP);
                    Ext.getCmp('codigoplan').setValue(tpBasePlan.getSelectionModel().getSelectedNode().attributes.codigo);
                    Ext.getCmp('denominacionp').setValue(tpBasePlan.getSelectionModel().getSelectedNode().attributes.denominacion);
                    Ext.getCmp('descripcionp').setValue(tpBasePlan.getSelectionModel().getSelectedNode().attributes.descripcion);
                    Ext.getCmp('idplanm').setValue(tpBasePlan.getSelectionModel().getSelectedNode().attributes.idplan);
                }
            }, {
                text: perfil.etiquetas.lbTtbtnMod,
                itemCls: 'x-menu-item icondistra-modificar',
                iconCls: 'imagen-none',
                id: 'modmodelo',
                handler: function() {

                    if (!winAddModelo)
                        accion = 1;
                    acc = 'Modificar';
                    crearIUAddModModelo();
                    Ext.getCmp('idaplicarplan').hide();
                    winAddModelo.show(Ext.getBody());
                    winAddModelo.setTitle(perfil.etiquetas.lbModificarM);
                    Ext.getCmp('idplanm').setValue(treesel);
                    Ext.getCmp('denominacion').setValue(tpBasePlan.getSelectionModel().getSelectedNode().attributes.denominacion);
                    Ext.getCmp('descripcion').setValue(tpBasePlan.getSelectionModel().getSelectedNode().attributes.descripcion);
                    Ext.getCmp('idmodelo').setValue(tpBasePlan.getSelectionModel().getSelectedNode().attributes.idmodelo);
                    Ext.getCmp('idcmbtipomodelo').setValue(tpBasePlan.getSelectionModel().getSelectedNode().attributes.idtipomodelo);
                    Ext.getCmp('idcmbtipomodelo').setRawValue(tpBasePlan.getSelectionModel().getSelectedNode().attributes.tipomodelo);
                    Ext.getCmp('idcmbtipoplan').setValue(tpBasePlan.getSelectionModel().getSelectedNode().attributes.tipoplan);
                    Ext.getCmp('tfclasificacion').setValue(tpBasePlan.getSelectionModel().getSelectedNode().attributes.ruta);
                    Ext.getCmp('idmodelo').disable();

                }
            }, {
                text: perfil.etiquetas.lbTtbtnDelPlan,
                itemCls: 'x-menu-item icondistra-eliminar',
                iconCls: 'imagen-none',
                id: 'delplan',
                handler: function() {
                    eliminarPlan();
                }
            }, {
                text: perfil.etiquetas.lbTtbtnDel,
                itemCls: 'x-menu-item icondistra-eliminar',
                iconCls: 'imagen-none',
                id: 'delmodelo',
                handler: function() {
                    eliminarModelo();
                }
            }/*, {
             text: perfil.etiquetas.lbTtbtnVer,
             itemCls: 'x-menu-item icondistra-ver',
             iconCls: 'imagen-none',
             id: 'vercomentario',
             handler: function () {
             mostrarComentarios();
             }
             }*/, {
                text: perfil.etiquetas.lbTtbtnVerInd,
                itemCls: 'x-menu-item icondistra-ver sisplanico-rojo',
                iconCls: 'imagen-none',
                id: 'verplan',
                handler: function() {
                    if (consolidado == 1) {
                        consolidado = 0;
                        stGpGestModelo.reload();
                        if (objci.acciones.rector) {
                            Ext.getCmp('btnAdicionarInds').hide();
                            Ext.getCmp('btnEliminarInds').hide();
                            Ext.getCmp('btnGuardar').hide();
                            Ext.getCmp('btnAprob').show();
                            Ext.getCmp('btnDes').show();
                            Ext.getCmp('btnAprobTodos').show();
                            Ext.getCmp('btnDesTodos').show();

                        } else {
                            if (puedeadicionar == 1) {
                                Ext.getCmp('btnAdicionarInds').show();
                            } else {

                                Ext.getCmp('btnAdicionarInds').hide();
                            }
                            if (puedeeliminar == 1) {
                                Ext.getCmp('btnEliminarInds').show();
                            } else {

                                Ext.getCmp('btnEliminarInds').hide();
                            }
                            Ext.getCmp('btnAprob').show();
                            Ext.getCmp('btnDes').show();
                            Ext.getCmp('btnAprobTodos').show();
                            Ext.getCmp('btnDesTodos').show();
                            if (puedeguardar == 1) {
                                Ext.getCmp('btnGuardar').show();
                            } else if (puedeguardar == 0) {

                                Ext.getCmp('btnGuardar').hide();
                            }

                        }

                    }

                    pcm.layout.setActiveItem('pModelo');

                }
            },
            {
                text: perfil.etiquetas.lbTtbtnAsociar,
                itemCls: 'x-menu-item icondistra-asociar',
                iconCls: 'imagen-none',
                id: 'menuAsociar',
                handler: function() {
                    if (!winAsociar)
                        funWinAsociar();
                    else {
                        stGpAsociar.reload();
                    }
                    winAsociar.show();
                }
            }, {
                text: 'Desasociar planes',
                itemCls: 'x-menu-item icondistra-asociar',
                iconCls: 'imagen-none',
                id: 'menuDesasociar',
                handler: function() {
                    if (!winDesAsociar)
                        funDesAsociar();
                    else {
                        stGpDesAsociar.reload();
                    }
                    winDesAsociar.show();
                }
            },
            {
                text: 'Ver presupuesto',
                itemCls: 'x-menu-item icondistra-ver sisplanico-verde',
                iconCls: 'imagen-none',
                id: 'verpresupuesto',
                handler: function() {
                    mostrarPresupuesto();
                }
            }, {
                text: 'Ajustar',
                itemCls: 'x-menu-item icondistra-ajustar',
                iconCls: 'imagen-none',
                id: 'ajustar',
                handler: function() {
                    CargarImporteinicialAjuste();

                }
            }
        ]
    });


    loaderTreeBase = new Ext.tree.TreeLoader({
        dataUrl: urlLoaderTree,
        listeners: {
            scope: this,
            beforeload: function(loader, treeNode) {

                loader.baseParams = {
                    tipo: treeNode.attributes.tipo,
                    ban: bandera,
                    identidad: identidadselected,
                    erectora: rectora,
                    idejercicio: cbEjercicio.getValue()
                };
                if (!maskPlanTree) {
                    maskPlanTree = new Ext.LoadMask(treeNode.getOwnerTree().getEl(), {
                        msg: 'Cargando'
                    });
                }
                maskPlanTree.show();
            },
            load: function(loader, nodo, respuesta) {
                if (nodo.id == 0) {
                    nodo.expandChildNodes();
                }
                if (maskPlanTree)
                    maskPlanTree.hide();
            }
        }
    })


    loaderTreeBaseEstructura = new Ext.tree.TreeLoader({
        dataUrl: cargarEntidades,
        listeners: {
            beforeload: function(tl, n) {
                this.baseParams = {
                    idEstructuraPadre: n.attributes.idEstructuraPadre
                };
            }
        }
    })


    upMenuDerTree = function(n) {
        /* console.log(n);
         console.log(puedeadicionar);*/
        if ((idtipodoc == 0) && (objci.acciones.rector)) {
            if (n.attributes.hijos > 1) {
                if (n.attributes.hijos == 2) {
                    if (puedeadicionar == 1) {
                        Ext.getCmp('addmodelo').show();

                    }

                } else {
                    Ext.getCmp('addmodelo').hide();

                }
            } else
            {
                if (n.attributes.hijos == 0) {
                    if (puedeadicionar == 1) {
                        Ext.getCmp('addmodelo').show();

                    }

                } else {
                    Ext.getCmp('addmodelo').hide();
                }

            }
            if (puedeadicionar == 1) {
                Ext.getCmp('addplan').show();
            }
            Ext.getCmp('verplan').hide();
            Ext.getCmp('modplan').hide();
            Ext.getCmp('delplan').hide();
//            Ext.getCmp('addcoment').hide();
            Ext.getCmp('modmodelo').hide();
            Ext.getCmp('delmodelo').hide();
            Ext.getCmp('menuAsociar').hide();
            Ext.getCmp('menuDesasociar').hide();
            Ext.getCmp('addVarios').hide();
            Ext.getCmp('btnAdicionarInds').hide();
            Ext.getCmp('ajustar').hide();
            //  Ext.getCmp('vercomentario').hide();
            Ext.getCmp('verpresupuesto').hide();
        } else {
            Ext.getCmp('verplan').hide();
            Ext.getCmp('addplan').hide();
            Ext.getCmp('addmodelo').hide();
            Ext.getCmp('modplan').hide();
            Ext.getCmp('delplan').hide();
            //Ext.getCmp('addcoment').hide();
            Ext.getCmp('modmodelo').hide();
            Ext.getCmp('delmodelo').hide();
            Ext.getCmp('addVarios').hide();
            Ext.getCmp('btnAdicionarInds').hide();
            Ext.getCmp('ajustar').hide();
            Ext.getCmp('menuDesasociar').hide();
            //Ext.getCmp('vercomentario').hide();
            Ext.getCmp('menuAsociar').hide();

        }
        if (idtipodoc == 1) {
            if ((objci.acciones.rector)) {
                if (puedeadicionar == 1) {
                    Ext.getCmp('addmodelo').show();
                }
                if (puedemodificar == 1) {
                    Ext.getCmp('modplan').show();
                }
                if (puedeeliminar == 1) {
                    Ext.getCmp('delplan').show();
                }

               // Ext.getCmp('addcoment').show();

                if (n.attributes.hijos > 1) {
                    if (n.attributes.hijos == 2) {
                        if (puedeadicionar == 1) {
                            Ext.getCmp('addmodelo').show();
                        }

                    } else
                        Ext.getCmp('addmodelo').hide();
                }

                Ext.getCmp('verpresupuesto').hide();
            } else {
                //Ext.getCmp('addcoment').show();
               // Ext.getCmp('vercomentario').show();
                Ext.getCmp('modplan').hide();
                Ext.getCmp('delplan').hide();
                Ext.getCmp('addmodelo').hide();
                Ext.getCmp('ajustar').show();
                if (puedeadicionar == 1) {
                    Ext.getCmp('addVarios').show();
                    Ext.getCmp('btnAdicionarInds').show();
                } else {

                    Ext.getCmp('btnAdicionarInds').hide();
                }

            }
            Ext.getCmp('verplan').hide();
            Ext.getCmp('modmodelo').hide();
            Ext.getCmp('delmodelo').hide();
            Ext.getCmp('addVarios').hide();
            Ext.getCmp('menuAsociar').hide();
            Ext.getCmp('ajustar').hide();
            Ext.getCmp('menuDesasociar').hide();
            Ext.getCmp('verpresupuesto').hide();
        } else
        if (idtipodoc == 2) {

            Ext.getCmp('verpresupuesto').show();
            if (objci.acciones.rector) {
                Ext.getCmp('menuAsociar').show();
                Ext.getCmp('menuDesasociar').show();
                Ext.getCmp('addVarios').hide();
                Ext.getCmp('ajustar').hide();
                if (puedeeliminar == 1) {
                    Ext.getCmp('delmodelo').show();
                }
                if (puedemodificar == 1) {
                    Ext.getCmp('modmodelo').show();
                }


            } else
            {
                Ext.getCmp('modmodelo').hide();
                Ext.getCmp('delmodelo').hide();
            }
            if (Ext.getCmp('chkglobalP').getValue() == false && identidadEsOD == 1)
            {
                if (!objci.acciones.rector) {
                    Ext.getCmp('ajustar').show();
                    if (puedeadicionar == 1) {
                        Ext.getCmp('addVarios').show();
                        Ext.getCmp('btnAdicionarInds').show();

                    } else {
                        Ext.getCmp('btnAdicionarInds').hide();
                    }
                }

            } else {
                Ext.getCmp('addVarios').hide();
                Ext.getCmp('btnAdicionarInds').hide();
                Ext.getCmp('ajustar').hide();

            }
            Ext.getCmp('verplan').show();
//            Ext.getCmp('addcoment').show();
            //Ext.getCmp('vercomentario').show();
            Ext.getCmp('addmodelo').hide();
            Ext.getCmp('modplan').hide();
            Ext.getCmp('delplan').hide();
        }
    }
    if ((idtipodoc == 0) && (!objci.acciones.rector))
    {
        Ext.getCmp('verpresupuesto').hide();
        Ext.getCmp('ajustar').hide();
    }
    iniciaTreePanel();
}


function funWinAsociar()
{

    btnCancelarAsociar = new Ext.Button({
        text: perfil.etiquetas.lbBtnCancelar,
        id: 'btnCancelarAsociar',
        tooltip: perfil.etiquetas.lbTtbtnCancelar,
        //icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'cancelar',
        disabled: false,
        handler: function() {
            checkCAsociar.clearSelections();
            winAsociar.hide();
        }
    });

    btnAceptarAsociar = new Ext.Button({
        text: perfil.etiquetas.lbBtnAceptar,
        id: 'btnAceptarAsociar',
        //icon: perfil.dirImg + 'aceptar.png',
        tooltip: perfil.etiquetas.lbTtbtnAceptar,
        iconCls: 'aceptar',
        disabled: false,
        handler: function() {
            asociarEntidades();
            checkCAsociar.clearSelections();
            winAsociar.hide();
        }
    });

    btnAplicarAsociar = new Ext.Button({
        text: perfil.etiquetas.lbBtnAplicar,
        id: 'btnAplicarAsociar',
        //icon: perfil.dirImg + 'aplicar.png',
        iconCls: 'aplicar',
        tooltip: perfil.etiquetas.lbTtbtnAplicar,
        disabled: false,
        handler: function() {
            asociarEntidades();
            checkCAsociar.clearSelections();
        }
    });
    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';

    filtrosAsociar = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'text'
            }]
    })
    checkCAsociar = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });

    cmGpAsociar = new Ext.grid.ColumnModel([
        checkCAsociar,
        {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            sortable: true,
            dataIndex: 'text'
        }]);

    smGpAsociar = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    stGpAsociar = new Ext.data.Store({
        url: '../gestmodelo/cargarEntidadesCompDemandante',
        listeners: {
            beforeload: function() {
                this.baseParams = {
                    idmodelo: idelemsel
                };
            },
            load: function(t, r, o) {
                Ext.getBody().unmask();
                var array = new Array();
                for (var i = 0; i < r.length; i++) {
                    if (r[i].data.checked == true) {
                        array.push(r[i]);
                    }
                }
                checkCAsociar.selectRecords(array);
                siexisteindFiltradoAsociar();

                if (r.length == 0)
                    mostrarMensaje(1, perfil.etiquetas.msgAsociadasTodas)
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'id'
        }, [{
                name: 'text'
            }, {
                name: 'checked'
            }])
    });

    gpAsociar = new Ext.grid.GridPanel({
        store: stGpAsociar,
        loadMask: {
            msg: 'Cargando...'
        },
        cm: cmGpAsociar,
        height: 200,
        sm: checkCAsociar,
        plugins: filtrosAsociar,
        autoExpandColumn: 'expandir',
        region: 'center',
        id: 'gpAsociar'
    });
    stGpAsociar.load();
    winAsociar = new Ext.Window({
        width: 300,
        constrain: true,
        title: perfil.etiquetas.lbBtnAsociarEntidad,
        autoHeight: true,
        layout: 'fit',
        closeAction: 'hide',
        buttons: [btnCancelarAsociar, btnAplicarAsociar, btnAceptarAsociar],
        items: [gpAsociar]
    })
}

function asociarEntidades() {
    Ext.getBody().mask(perfil.etiquetas.lbEspere);
    var entidades = new Array();
    if (checkCAsociar.hasSelection())
        for (p in checkCAsociar.getSelections())
        {
            if (checkCAsociar.getSelections()[p].id)
                entidades.push(checkCAsociar.getSelections()[p].id);
        }
    Ext.Ajax.request({
        url: '../gestmodelo/asociarModelo',
        params: {
            idmodelo: idelemsel,
            entidades: Ext.encode(entidades)
        },
        callback: function(options, success, response) {
            Ext.getBody().unmask();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsgAs == 1) {
                mostrarMensaje(1, perfil.etiquetas.msgAsociarEntidad);
                stGpAsociar.reload();
            } else
                mostrarMensaje(3, perfil.etiquetas.msgErrorAction);
        }
    });
}


function funDesAsociar()
{
    btnCancelarDesAsociar = new Ext.Button({
        text: perfil.etiquetas.lbBtnCancelar,
        id: 'btnCancelarDesAsociar',
        tooltip: perfil.etiquetas.lbTtbtnCancelar,
        //icon: perfil.dirImg + 'cancelar.png',
        iconCls: 'cancelar',
        disabled: false,
        handler: function() {
            checkCDesAsociar.clearSelections();
            winDesAsociar.hide();
        }
    });

    btnAceptarDesAsociar = new Ext.Button({
        text: perfil.etiquetas.lbBtnAceptar,
        id: 'btnAceptarDesAsociar',
        //icon: perfil.dirImg + 'aceptar.png',
        tooltip: perfil.etiquetas.lbTtbtnAceptar,
        iconCls: 'aceptar',
        disabled: false,
        handler: function() {
            desasociarEntidades();
            checkCDesAsociar.clearSelections();
            winDesAsociar.hide();
        }
    });

    btnAplicarDesAsociar = new Ext.Button({
        text: perfil.etiquetas.lbBtnAplicar,
        id: 'btnAplicarDesAsociar',
        //icon: perfil.dirImg + 'aplicar.png',
        iconCls: 'aplicar',
        tooltip: perfil.etiquetas.lbTtbtnAplicar,
        disabled: false,
        handler: function() {
            desasociarEntidades();
            checkCDesAsociar.clearSelections();

        }
    });
    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';

    filtrosDesAsociar = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'text'
            }]
    })
    checkCDesAsociar = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false
    });

    cmGpDesAsociar = new Ext.grid.ColumnModel([
        checkCDesAsociar,
        {
            id: 'expandir',
            header: perfil.etiquetas.lbDenominacion,
            renderer: crearToolTip,
            sortable: true,
            dataIndex: 'text'
        }]);

    smGpDesAsociar = new Ext.grid.RowSelectionModel({
        singleSelect: false
    });

    stGpDesAsociar = new Ext.data.Store({
        url: 'cargarEntidadesDesasociar',
        listeners: {
            beforeload: function() {
                this.baseParams = {
                    idmodelo: idelemsel
                };
            },
            load: function(t, r, o) {
                var array = new Array();
                for (var i = 0; i < r.length; i++) {
                    if (r[i].data.checked == true) {
                        array.push(r[i]);
                    }
                }
                checkCDesAsociar.selectRecords(array);
                siexisteindFiltradoDesAsociar();

                if (r.length == 0)
                    mostrarMensaje(1, perfil.etiquetas.msgDessociadasTodas)
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'id'
        }, [{
                name: 'text'
            }, {
                name: 'checked'
            }])
    });

    gpDesAsociar = new Ext.grid.GridPanel({
        store: stGpDesAsociar,
        loadMask: {
            msg: 'Cargando...'
        },
        cm: cmGpDesAsociar,
        height: 200,
        sm: checkCDesAsociar,
        plugins: filtrosDesAsociar,
        autoExpandColumn: 'expandir',
        region: 'center',
        id: 'gpDesAsociar'
    });
    stGpDesAsociar.load();
    winDesAsociar = new Ext.Window({
        width: 300,
        constrain: true,
        title: 'Desasociar planes',
        autoHeight: true,
        layout: 'fit',
        closeAction: 'hide',
        buttons: [btnCancelarDesAsociar, btnAplicarDesAsociar, btnAceptarDesAsociar],
        items: [gpDesAsociar]
    })
}


function desasociarEntidades() {
    Ext.MessageBox.show({
        title: 'Por favor espere...',
        width: 300,
        wait: true,
        progress: true,
        closable: false,
        animEl: 'mb6',
        msg: 'Desasociando las entidades'
    });
    var entidades = new Array();
    if (checkCDesAsociar.hasSelection())
        for (p in checkCDesAsociar.getSelections())
        {
            if (checkCDesAsociar.getSelections()[p].id)
                entidades.push(
                        [checkCDesAsociar.getSelections()[p].id,
                            checkCDesAsociar.getSelections()[p].json.identidadmodelo]
                        )

        }
    Ext.Ajax.request({
        url: 'desasociarModelo',
        params: {
            idmodelo: idelemsel,
            entidades: Ext.encode(entidades)
        },
        callback: function(options, success, response) {
            Ext.getBody().unmask();
            responseData = Ext.decode(response.responseText);
            if (responseData.codMsg == 21) {
                mostrarMensaje(1, 'El plan ha sido desasociado satisfactoriamente.', function() {
                    stGpDesAsociar.reload();
                });
            } else if (responseData.codMsg == 22) {
                mostrarMensaje(1, 'EL plan no ha sido desasociado, hubo un error a la hora de desasociar.');
            } else if (responseData.codMsg == 24) {
                mostrarMensaje(1, 'No existe plan asociado a la entidad seleccionada.');
            }

        }
    });
}

function actualizarBalance(ppaso) {

    Ext.MessageBox.show({
        title: 'Por favor espere...',
        width: 325,
        wait: true,
        progress: true,
        closable: false,
        animEl: 'mb6',
        msg: '(' + ppaso + ' de 3) Actualizando los datos del Balance Material'
    });
    Ext.Ajax.request({
        url: 'actualizarBalance',
        timeout: 7200000, //max 2horas
        params: {
            paso: ppaso,
            idmodelo: idelemsel,
            identidad: identidadselected,
            identidadmodelo: identidadmodelo
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData.cod == 3) {
                mostrarMensaje(3, 'Ocurrió un error al actualizar los datos del balance.');
            } else if (ppaso == 1) {
                actualizarBalance(2);
            } else if (ppaso == 2) {
                actualizarBalance(3);
            } else if (responseData.cod == 10) {
                mostrarMensaje(1, 'Se han actualizado satisfactoriamente los datos del balance.');
            }
        }
    });

}



function siexisteindFiltradoAsociar() {
    if (filtrosAsociar.getFiltrosActivos().length > 0 && stGpAsociar.getCount() == 0)
        mostrarMensaje(1, perfil.etiquetas.msgBuscar);
}
function siexisteindFiltradoDesAsociar() {
    if (filtrosDesAsociar.getFiltrosActivos().length > 0 && stGpDesAsociar.getCount() == 0)
        mostrarMensaje(1, perfil.etiquetas.msgBuscar);
}
function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}
function CargarImporteinicialAjuste() {

    mymask.show();
    arrayidplanificacion = [];

    if (smGpGestModelo.getSelections().length > 0) {
        for (i = 0; i < smGpGestModelo.getSelections().length; i++) {
            if (smGpGestModelo.getSelections()[i].data.idaprobaciondemanda == '4') {
                arrayidplanificacion.push(smGpGestModelo.getSelections()[i].data.idplanificacion);
            }
        }
    }

    Ext.Ajax.request({
        url: 'cargarImporteInicial',
        params: {
            arrayidplanificacion: Ext.encode(arrayidplanificacion),
            identidadmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.identidadmodelo,
            idejercicio: cbEjercicio.getValue()
        },
        callback: function(options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData == 23) {
                mostrarMensaje(1, perfil.etiquetas.lbNoajuste);
            } else {
                importeIn = responseData.importe;
                Ext.getCmp('importInicial').setValue(responseData.importeformato);
                winRealizarAjuste.show();
                Ext.getCmp('btnCalcular').disable();
                Ext.getCmp('idajustar').disable();


            }



        }

    });
}

function CalcularAjuste() {

    if (Ext.getCmp('porciento').getValue() || Ext.getCmp('porciento').getValue() == 0) {
        arrayidplanificacion = [];

        if (smGpGestModelo.getSelections().length > 0) {
            for (i = 0; i < smGpGestModelo.getSelections().length; i++) {
                if (smGpGestModelo.getSelections()[i].data.idaprobaciondemanda == '4') {
                    arrayidplanificacion.push(smGpGestModelo.getSelections()[i].data.idplanificacion);
                }
            }
        }
        Ext.Ajax.request({
            url: 'calcularAjuste',
            params: {
                arrayidplanificacion: Ext.encode(arrayidplanificacion),
                identidadmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.identidadmodelo,
                idejercicio: cbEjercicio.getValue(),
                porciento: Ext.getCmp('porciento').getValue()

            }
            ,
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (response.responseText != 23) {
                    Ext.getCmp('importAjustado').setValue(responseData.importeformato);
                    importAju = responseData.importe;
                    importeFi = parseFloat(importeIn) + parseFloat(importAju);
                    Ext.getCmp('importFinal').setValue(parseFloat(importeFi).toFixed(3));
                }

            }

        });
    } else {
        mostrarMensaje(1, perfil.etiquetas.msgErrorPorciento);
    }


}

function insertarAjuste() {

    if (Ext.getCmp('porciento').getValue() || Ext.getCmp('porciento').getValue() == 0) {
        arrayidplanificacion = [];

        if (smGpGestModelo.getSelections().length > 0) {
            for (i = 0; i < smGpGestModelo.getSelections().length; i++) {
                if (smGpGestModelo.getSelections()[i].data.idaprobaciondemanda == '4') {
                    arrayidplanificacion.push(smGpGestModelo.getSelections()[i].data.idplanificacion);
                }
            }
        }

        Ext.Ajax.request({
            url: 'insertarAjuste',
            params: {
                arrayidplanificacion: Ext.encode(arrayidplanificacion),
                identidadmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.identidadmodelo,
                idejercicio: cbEjercicio.getValue(),
                porciento: Ext.getCmp('porciento').getValue()

            }
            ,
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (response.responseText == 1) {
                    mostrarMensaje(1, perfil.etiquetas.msgAjustadoSatisf);
                } else
                    mostrarMensaje(1, perfil.etiquetas.msgAjustadoInsatisf);
            }

        });
    } else {
        mostrarMensaje(1, perfil.etiquetas.msgErrorPorciento);
    }

}

function LimpiarValores() {
    Ext.getCmp('porciento').reset();
    Ext.getCmp('importInicial').setValue('');
    Ext.getCmp('importFinal').setValue('');
    Ext.getCmp('importAjustado').setValue('');
}
