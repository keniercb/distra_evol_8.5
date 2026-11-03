/**
 * Created by Roberto Yasel on 20/07/15.
 */
Planificacion.Integracion.MatrizdofaComponent = ExtExtend.Class({
    $extend: Ext.Panel,
    layout: 'border',
    cls: 'x-toolbar',
    region: 'center',
    autoScroll: false,
    border: false,
    initComponent: function () {
        var me = this;
        var idCmp = this.id;
        var comps = ExtExtend.Components;
        me.flag = true;
        me.flagPanelPrincipal = true;

        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.MatrizdofaController();
        me.etiquetas = me.controller._getLabel('Matrizdofa');
        me.directorioImagenes = me.controller._getGlobals('dirImg');

        //Implementar los componentes de la vista
        me.btnAnalista = new comps.Button({
            text: me.etiquetas.analista,
            enableToggle: true,
            toggleGroup: 'button',
            icon: perfil.dirImg + 'area.png',
            tooltip: 'Vista de analista',
            iconCls: 'btn',
            handler: function () {
                me.flag = true;
                me.treeAmbitos.enable();
                me.btnExportar.setVisible(false);
                me.btnImportar.setVisible(false);
                me.panelInferior.analista = me.flag;
                var select = me.treeAmbitos.getSelectionModel().getSelectedNode();
                if (select) {
                    me.stFactores.baseParams = {
                        idambitodofa: select.attributes.idambitodofa,
                        idestudiomatriz: me.concepto.idestudiomatriz,
                        analista: me.flag,
                        denominacion: me.fieldDenom.getValue(),
                        factor: me.cbFaseclaveFiltro.getValue()
                    };
                    me.stFactores.reload({
                        params: {
                            start: 0,
                            limit: 20
                        }
                    });
                }
            }
        });
        me.btnExperto = new comps.Button({
            text: me.etiquetas.experto,
            enableToggle: true,
            toggleGroup: 'button',
            icon: perfil.dirImg + 'entidad.png',
            iconCls: 'btn',
            tooltip: 'Vista de expertos',
            handler: function () {
                me.flag = false;
                me.treeAmbitos.enable();
                me.btnExportar.setVisible(true);
                me.btnImportar.setVisible(true);
                me.panelInferior.analista = me.flag;
                var select = me.treeAmbitos.getSelectionModel().getSelectedNode();
                if (select) {
                    me.stFactores.baseParams = {
                        idambitodofa: select.attributes.idambitodofa,
                        idestudiomatriz: me.concepto.idestudiomatriz,
                        analista: me.flag,
                        denominacion: me.fieldDenom.getValue(),
                        factor: me.cbFaseclaveFiltro.getValue()
                    };

                    me.stFactores.reload({
                        params: {
                            start: 0,
                            limit: 20
                        }
                    });
                }
            }
        });
        me.btnConfrontacion = new comps.Button({
            icon: perfil.dirImg + 'generadorreportes.png',
            iconCls: 'btn',
            disabled: true,
            text: me.etiquetas.confrontacion,
            tooltip: 'Realizar confrontación',
            handler: function () {
                if (this.text == me.etiquetas.confrontacion) {
                    this.setText(me.etiquetas.resultadosConf);
                    var barra = me.getTopToolbar();
                    barra.disable();
                    me.flagPanelPrincipal = false;
                    me.panelMatrices.setTitle(me.etiquetas.confrontacion);
                    me.tab.add(me.panelMatrices).show();

                }
                else {
                    me.panelInferior.gpAmenazasDebilidades.enable();
                    me.panelInferior.gpAmenazasFortalezas.enable();
                    me.panelInferior.gpOportunidadesDebilidades.enable();
                    me.panelInferior.gpOportunidadesFortalezas.enable();

                    me.winBuscarCriterios = new Planificacion.Integracion.WinBuscarCriterios({idmatrizdofa: me.concepto.idestudiomatriz});
                    me.winBuscarCriterios.show();
                    me.winBuscarCriterios.on('dameseleccion', function (p, arreglo) {
                        me.winResultadosConfrontacion = new Planificacion.Integracion.winResultadosConfrontacion({
                            idmatrizdofa: me.concepto.idestudiomatriz,
                            arreglo: arreglo
                        });
                        me.winResultadosConfrontacion.show();
                    });
                }

            }
        });

        me.btnExportar = new comps.buttons.btnExportar({

            handler: function () {
                params = {
                    idestudiomatriz: me.concepto.idestudiomatriz,
                    denominacion: me.objproyecto.get('denominacion')
                }
                me.controller.obtenerReporte(params);
            }
        });


        me.tbar = [me.btnAnalista, '-', me.btnExperto, '-', me.btnExportar];
        //////////////componente arbol///////////////
        me.treeLoaderAmbitos = new Ext.tree.TreeLoader({
            dataUrl: Planificacion.Integracion.UrlModulo + 'matrizdofa/gettreeambito'
        });
        me.treeAmbitos = new Ext.tree.TreePanel({
            title: me.etiquetas.ambitos,
            anchor: '100%',
            border: false,
            region: 'west',
            border: false,
            disabled: true,
            split: true,
            width: 250,
            rootVisible: true,
            autoScroll: true,
            collapsible: true,
            collapsed: false,
            animate: true,
            useArrows: true,
            root: new Ext.tree.AsyncTreeNode({
                text: me.etiquetas.ambitos,
                autoScroll: true,
                draggable: false,
                expanded: true,
                identityNode: 'rootAmbitos',
                id: 'root'
            }),
            loader: me.treeLoaderAmbitos,
            listeners: {
                click: function (node, e) {
                    //todo cuando sea el root hay que deshabilitar tanto el panel de factores como en confrontacion
                    if (node) {
                        if (node.attributes.leaf) {
                            if (me.flagPanelPrincipal) {
                                me.btnAdicionar.enable();
                                me.btnConfrontacion.enable();
                                me.panelGestion.enable();
                                if (!me.panelGestion.disabled) {
                                    me.stFactores.baseParams = {
                                        idambitodofa: node.attributes.idambitodofa,
                                        idestudiomatriz: me.concepto.idestudiomatriz,
                                        analista: me.flag,
                                        denominacion: me.fieldDenom.getValue(),
                                        factor: me.cbFaseclaveFiltro.getValue()
                                    };

                                    me.stFactores.reload(
                                        {
                                            params: {
                                                start: 0,
                                                limit: 20
                                            }
                                        });
                                }
                            }
                            else {
                                me.panelAnalista.stAnalistaNorte.baseParams = {
                                    idestudiomatriz: me.concepto.idestudiomatriz,
                                    idambitodofa: node.attributes.idambitodofa,
                                    analista: true,
                                    parametro1: 'fortalezas',
                                    parametro2: 'debilidades'
                                };
                                me.panelAnalista.stAnalistaNorte.reload();
                                me.panelExperto.stExpertoNorte.baseParams = {
                                    idestudiomatriz: me.concepto.idestudiomatriz,
                                    idambitodofa: node.attributes.idambitodofa,
                                    analista: false,
                                    parametro1: 'fortalezas',
                                    parametro2: 'debilidades'
                                };
                                me.panelExperto.stExpertoNorte.reload();
                                //fortalezas y debilidades///

                                //amenazas y oportunidades///
                                me.panelAnalista.stAnalistaSur.baseParams = {
                                    idestudiomatriz: me.concepto.idestudiomatriz,
                                    idambitodofa: node.attributes.idambitodofa,
                                    analista: true,
                                    parametro1: 'amenazas',
                                    parametro2: 'oportunidades'
                                };
                                me.panelAnalista.stAnalistaSur.reload();
                                me.panelExperto.stExpertoSur.baseParams = {
                                    idestudiomatriz: me.concepto.idestudiomatriz,
                                    idambitodofa: node.attributes.idambitodofa,
                                    analista: false,
                                    parametro1: 'amenazas',
                                    parametro2: 'oportunidades'
                                };
                                me.panelExperto.stExpertoSur.reload();
                                //amenazas y oportunidades///


                                //grid estrategias A-D///
                                me.panelInferior.stAmenazasDebilidades.baseParams = {
                                    idestudiomatriz: me.concepto.idestudiomatriz,
                                    idambitodofa: node.attributes.idambitodofa,
                                    factorclave1: 4,
                                    analista: me.flag,
                                    factorclave2: 1
                                };
                                me.panelInferior.stAmenazasDebilidades.reload({
                                    params: {
                                        start: 0,
                                        limit: 5
                                    }
                                });
                                //grid estrategias A-F///
                                me.panelInferior.stAmenazasFortalezas.baseParams = {
                                    idestudiomatriz: me.concepto.idestudiomatriz,
                                    idambitodofa: node.attributes.idambitodofa,
                                    factorclave1: 4,
                                    analista: me.flag,
                                    factorclave2: 3
                                };
                                me.panelInferior.stAmenazasFortalezas.reload({
                                    params: {
                                        start: 0,
                                        limit: 5
                                    }
                                });

                                //grid estrategias O-D///
                                me.panelInferior.stOportunidadesDebilidades.baseParams = {
                                    idestudiomatriz: me.concepto.idestudiomatriz,
                                    idambitodofa: node.attributes.idambitodofa,
                                    factorclave1: 2,
                                    analista: me.flag,
                                    factorclave2: 1
                                };
                                me.panelInferior.stOportunidadesDebilidades.reload({
                                    params: {
                                        start: 0,
                                        limit: 5
                                    }
                                });
                                //grid estrategias O-F///
                                me.panelInferior.stOportunidadesFortalezas.baseParams = {
                                    idestudiomatriz: me.concepto.idestudiomatriz,
                                    idambitodofa: node.attributes.idambitodofa,
                                    analista: me.flag,
                                    factorclave1: 2,
                                    factorclave2: 3
                                };
                                me.panelInferior.stOportunidadesFortalezas.reload({
                                    params: {
                                        start: 0,
                                        limit: 5
                                    }
                                });

                                me.panelInferior.gpAmenazasDebilidades.enable();
                                me.panelInferior.gpAmenazasFortalezas.enable();
                                me.panelInferior.gpOportunidadesDebilidades.enable();
                                me.panelInferior.gpOportunidadesFortalezas.enable();
                            }
                        }
                    }

                },
                expand: function (panel) {
                    me.tab.doLayout();
                },
                collapse: function (panel) {
                    me.tab.doLayout();
                    me.panelExperto.stExpertoNorte.reload();
                    me.panelExperto.stExpertoSur.reload();
                    me.panelAnalista.stAnalistaNorte.reload();
                    me.panelAnalista.stAnalistaSur.reload();
                }


            }
        });
        //////////////componente arbol fin ///////////////

        ////////////////componente panel/////////////////
        me.btnAdicionar = new comps.buttons.btnAdicionar({
            tooltip: 'Adicionar factor',
            disabled: true,
            handler: function () {
                var rec = new me.recFactores({
                    idfactorclave: '',
                    denominacion: '',
                    idfactor: '',
                    idmatrizdofa: '',
                    denomNomFactor: ''
                });
                me.stFactores.insert(0, rec);
            }

        });
        me.btnEliminar = new comps.buttons.btnEliminar({
            tooltip: 'Eliminar factor',
            disabled: true,
            handler: function () {
                me.controller._insertItem('gpFactores', me.gpFactores);
                me.controller.eliminarFactor();

            }
        });

        me.btnExportar = new comps.buttons.btnExportar({
            hidden: true,
            handler: function () {
                //Planificacion.Integracion.exportarMatriz();
                me.WinGeorreferenciar = new Planificacion.Integracion.exportarMatriz({
                    idestudiomatriz: me.concepto.idestudiomatriz,
                    idproyecto: me.objproyecto.get('idproyecto')
                });
                me.WinGeorreferenciar.show();
            }
        });
        me.btnImportar = new Ext.ux.FileUploadButton({
            id: 'import',
            text: me.etiquetas.importar,
            icon: perfil.dirImg + 'importar.png',
            iconCls: 'btn',
            hidden: true,
            disableValidators: true,
            handler: function () {

            }
        });


        me.btnAyuda = new comps.buttons.btnAyuda({
            tooltip: 'Mostrar ayuda de la funcionalidad',
            handler: function () {
                me.controller.mostrarAyuda('dofa');
            }

        });

        me.fieldDenom = new comps.fields.fieldDenom({
            fieldLabel: me.etiquetas.denomFactor,
            colWidth: '.20',
            anchor: '95%',
            allowBlank: true
        });
        me.stFactorclave = new Ext.data.Store({
            autoLoad: true,
            url: '/planificacion/herramientasintegracion/index.php/matrizdofa/getfactoresclaves',
            reader: new Ext.data.JsonReader({
                root: 'root',
                totalProperty: 'cantidad_filas'
            }, [
                {name: 'idfactorclave'},
                {name: 'denominacion'},
                {name: 'descripcion'}
            ])
        });


        me.cbFaseclaveFiltro = new comps.fields.simpleComboBox({
            fieldLabel: me.etiquetas.factorClave,
            store: me.stFactorclave,
            //id: 'cbFaseclaveFiltro',
            triggerAction: 'all',
            editable: false,
            emptyText: me.etiquetas.emptyText,
            displayField: 'denominacion',
            valueField: 'idfactorclave',
            extendField: 'descripcion',
            allowBlank: true,
            enableQtip: true,
            disableBanned: true,
            mode: 'local',
            width: 177,
            colWidth: '.20',
            anchor: '95%'
        });
        me.cbFaseclave = new comps.fields.simpleComboBox({
            store: me.stFactorclave,
            triggerAction: 'all',
            editable: false,
            //emptyText: me.etiquetas.emptyText,
            displayField: 'denominacion',
            valueField: 'denominacion',
            extendField: 'descripcion',
            allowBlank: false,
            enableQtip: true,
            disableBanned: true,
            mode: 'local',
            listeners: {
                select: function (cb, rec, ind) {
                    var gpFactores = me.gpFactores;
                    var itemselect = gpFactores.getSelectionModel().getSelections()[(gpFactores.getSelectionModel().getSelections().length - 1)];
                    itemselect.data.idfactorclave = rec.data.idfactorclave;
                }.createDelegate(this)
            }
        });

        me.filtrofactores = new Ext.ToolBar.searchToolBar({
            elementos: [me.fieldDenom, me.cbFaseclaveFiltro],
            height: 64,
            border: true,
            btns: {
                search: {
                    id: 'btnBuscarmatrizdofafiltro',
                    next: 'btnLimpiarmatrizdofafiltro',
                    text: '<u>L</u>impiar',
                    fn: function () {
                        var select = me.treeAmbitos.getSelectionModel().getSelectedNode();
                        me.stFactores.baseParams = {
                            idambitodofa: select.attributes.idambitodofa,
                            idestudiomatriz: me.concepto.idestudiomatriz,
                            analista: me.flag,
                            denominacion: me.fieldDenom.getValue(),
                            factor: me.cbFaseclaveFiltro.getValue()
                        };
                        me.stFactores.reload({
                            params: {
                                start: 0,
                                limit: 20
                            }
                        });
                    }
                }, clear: {
                    id: 'btnLimpiarmatrizdofafiltro',
                    prev: 'btnBuscarmatrizdofafiltro',
                    text: '<u>B</u>uscar',
                    fn: function () {
                        var select = me.treeAmbitos.getSelectionModel().getSelectedNode();
                        me.cbFaseclaveFiltro.reset();
                        me.fieldDenom.reset();
                        me.stFactores.baseParams = {
                            idambitodofa: select.attributes.idambitodofa,
                            idestudiomatriz: me.concepto.idestudiomatriz,
                            analista: me.flag,
                            denominacion: me.fieldDenom.getValue(),
                            factor: me.cbFaseclaveFiltro.getValue()
                        };
                        me.stFactores.reload({
                            params: {
                                start: 0,
                                limit: 20
                            }
                        });
                    }
                }
            }
        });

        me.recFactores = Ext.data.Record.create([
            {
                name: 'idfactor'
            },
            {
                name: 'idmatrizdofa'
            },
            {
                name: 'idfactorclave'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'denomNomFactor'
            }


        ]);
        me.stFactores = new Ext.data.Store({
            url: 'getlistadosbyambito',
            reader: new Ext.data.JsonReader({
                root: 'root',
                id: 'stFactores',
                totalProperty: 'cantidad_filas'
            }, me.recFactores), listeners: {
                load: function (th) {
                    if (th.getCount() == 0) {
                        if ((((me.fieldDenom.getValue() != "" && me.fieldDenom.getValue() != undefined) || (me.cbFaseclaveFiltro.getRawValue() != '' && me.cbFaseclaveFiltro.getValue() != undefined)))) {
                            mostrarMensaje(1, "No existen datos que se correspondan con los criterios de búsqueda especificados.");
                        } else {
                            mostrarMensaje(1, 'No existen datos que mostrar.');
                        }
                    }

                }
            }


        });
        me.smFactores = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (sm, rowNumber, rec) {
                    me.btnEliminar.enable();
                },
                rowdeselect: function (sm, rowNumber, rec) {
                    if (!sm.hasSelection()) {
                        me.btnEliminar.disable();

                    }
                }
            }

        });
        me.gpFactores = new Ext.grid.EditorGridPanel({
            title: me.etiquetas.gpFactores,
            height: 693,
            width: '100%',
            autoScroll: true,
            clicksToEdit: 2,
            store: me.stFactores,
            sm: me.smFactores,
            loadMask: {msg: 'Cargando...'},
            cm: new Ext.grid.ColumnModel([
                {hidden: true, dataIndex: 'idfactor'},
                {hidden: true, dataIndex: 'idmatrizdofa'},
                {hidden: true, dataIndex: 'idfactorclave'},
                {
                    header: "Denominación del factor",
                    dataIndex: 'denominacion',
                    width: 450,
                    editor: new comps.fields.fieldDenom
                },
                {header: "Factor clave", dataIndex: 'denomNomFactor', width: 450, editor: me.cbFaseclave}
            ]),
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: me.stFactores,
                displayInfo: true,
                displayMsg: 'Mostrando de {0} - {1} de {2}',
                emptyMsg: "No hay resultados para mostrar."
            }),
            listeners: {
                afteredit: function (e) {
                    if (e.record.data.denominacion != '' && e.record.data.idfactorclave != '') {
                        me.controller._insertItem('gpFactores', me.gpFactores);
                        me.controller.guardarDatosFactores(me);
                    }
                }
            }
        });

        me.panelGestion = new Ext.Panel({
            region: 'center',
            id: 'primero',
            disabled: true,
            frame: false,
            border: false,
            tbar: [me.btnAdicionar, '-', me.btnEliminar, '-', me.btnExportar, me.btnImportar, '->', me.btnAyuda],
            items: [me.filtrofactores, me.gpFactores]


        });

        ///componente realizar confrontacion//////////
        me.panelAnalista = new Planificacion.Integracion.MatrizAnalista();
        me.panelExperto = new Planificacion.Integracion.MatrizExperto();
        me.fsPruebaN = new Ext.form.FieldSet({
            anchor: '100%',
            border: false,
            autoHeight: true,
            items: [me.panelAnalista
            ]
        });
        me.fsPruebaS = new Ext.form.FieldSet({
            anchor: '100%',
            border: false,
            autoHeight: true,
            items: [me.panelExperto
            ]
        });

        me.fsPrueba = new Ext.Panel({
            anchor: '100%',
            region: 'center',
            border: false,
            layout: 'column',
            split: true,
            autoHeight: true,
            items: [{columnWidth: .5, layout: 'form', labelAlign: 'top', items: [me.fsPruebaN]},
                {columnWidth: .5, layout: 'form', labelAlign: 'top', items: [me.fsPruebaS]}
            ]

        });


        var variables = {arbol: me.treeAmbitos, concepto: me.concepto};

        me.panelInferior = new Planificacion.Integracion.panelInferiorConfrontacion({
            variables: variables,
            analista: me.flag
        });

        me.panelMV = new Ext.Panel({
            region: 'center',
            layout: 'border',
            items: [me.fsPrueba]

        });
        me.panelGF = new Ext.Panel({
            region: 'east',
            width: 450,
            layout: 'border',
            border: false,
            items: [me.panelInferior]
        });

        me.panelMatrices = new Ext.Panel({
            region: 'center',
            id: 'segundo',
            layout: 'border',
            frame: true,
            border: false,
            items: [me.panelMV, me.panelGF]
        });
        //////componente realizar confrontacio fin///////////////

        ///////////////////componente panel fin////////////////
        me.bbar = ['->', me.btnConfrontacion];

        me.tab = new Ext.TabPanel({
            frame: true,
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            plain: false,
            items: [
                {
                    title: me.etiquetas.principal,
                    items: me.panelGestion
                }
            ],
            listeners: {
                tabchange: function (pTabP, pTab) {
                    pTab.doLayout();
                    if (pTab.title == me.etiquetas.principal) {
                        var barra = me.getTopToolbar();
                        barra.enable();
                        me.flagPanelPrincipal = true;
                        me.btnConfrontacion.setText(me.etiquetas.confrontacion);
                    } else {
                        var barra = me.getTopToolbar();
                        barra.disable();
                        me.flagPanelPrincipal = false;
                        me.btnConfrontacion.setText(me.etiquetas.resultados);
                    }
                    var select = me.treeAmbitos.getSelectionModel().getSelectedNode();
                    me.treeAmbitos.fireEvent('click', select);

                }
            }
        });

        me.panelTemas = new Ext.Panel({
            region: 'center',
            layout: 'border',
            autoScroll: false,
            items: [me.treeAmbitos, me.tab]
        });

        me.items = [me.panelTemas];

        me.keys = [
            {
                key: 'i',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function () {
                    me.btnAdicionar.handler.call();
                }
            },
            {
                key: 'b',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function () {
                    me.filtrofactores.btns.search.fn.call();
                }
            },
            {
                key: 'l',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function () {
                    (me.filtrofactores.btns.clear).fn.call();
                }
            },
            {
                key: 'h',
                alt: true,
                scope: me,
                stopEvent: true,
                fn: function () {
                    me.btnAyuda.handler.call();
                }
            },
            {
                key: Ext.EventObject.DELETE,
                scope: me,
                stopEvent: true,
                fn: function () {
                    if (!me.btnEliminar.disabled) {
                        me.btnEliminar.handler.call();
                    }
                }
            }
        ];


        Planificacion.Integracion.MatrizdofaComponent.superclass.initComponent.call(me);
    }

});
Ext.reg('Planificacion.Integracion.MatrizdofaComponent', Planificacion.Integracion.MatrizdofaComponent);

Planificacion.Integracion.WinBuscarCriterios = Ext.extend(Ext.Window, {
    layout: 'border',
    title: 'Seleccionar criterios de estrategias',
    initComponent: function () {
        var idCmp = this.id;
        var me = this;
        var dirImg = perfil.dirImg;
        me.id = 'WinBuscarCriterios&' + idCmp;
        me.comps = ExtExtend.Components;
        me.modal = true;
        me.closeAction = 'destroy';
        me.resizable = false;
        me.maximizable = true;
        me.width = (this.width) ? this.width : 420;
        me.height = (this.height) ? this.height : 400;

        me.btnAceptar = new me.comps.buttons.btnAceptar({
            disabled: true,
            handler: function () {
                var arreglo = [];
                Ext.each(me.smCriterios.getSelections(), function (item) {
                    arreglo.push(item.data);
                });
                this.fireEvent('dameseleccion', me, arreglo);
                me.destroy();
            }.createDelegate(this)
        });

        me.btnCancelar = new me.comps.buttons.btnCancelar({
            handler: function () {
                me.close();
            }.createDelegate(this)
        });

        /**
         byCargo) ? 2 : 0;
         Usser) ? 1 : 0;
         */
        me.recordCriterios = Ext.data.Record.create([
            {name: 'idcriterio'},
            {name: 'idestrategia'},
            {name: 'denominacion'},
            {name: 'descripcion'}
        ]);

        me.smCriterios = new Ext.grid.CheckboxSelectionModel({
            listeners: {
                singleSelect: false,
                selectionchange: function () {
                    if (me.smCriterios.hasSelection()) {
                        me.btnAceptar.enable();
                    } else {
                        me.btnAceptar.disable();
                    }
                }
            },
            rowselect: function (th, num, record) {
                me.btnAceptar.enable();
            }.createDelegate(this),
            rowdeselect: function (th, num, record) {
                me.btnAceptar.disable();
            }.createDelegate(this)
        });

        me.stCriterios = new Ext.data.Store({
            url: Planificacion.Integracion.UrlModulo + 'matrizdofa/getCriterios',
            reader: new Ext.data.JsonReader({
                root: 'root',
                id: 'idcriterio',
                totalProperty: 'cantidad_filas'
            }, me.recordCriterios),
            listeners: {
                beforeload: function () {

                }, load: function (th, records, opt) {
                }
            }
        });
        me.stCriterios.load();

        me.cmCriterios = [me.smCriterios,
            {hidden: true, hideable: false, dataIndex: 'idcriterio'},
            {header: "Denominación", id: 'expandirSeg&', dataIndex: 'denominacion', width: 150},
            {header: "Descripción", dataIndex: 'descripcion', width: 200}
        ];
        me.gpCriterios = new Ext.grid.GridPanel({
            frame: true,
            region: 'center',
            split: true,
            title: 'Listado de criterios',
            autoExpandColumn: 'expandirSeg&',
            store: me.stCriterios,
            sm: me.smCriterios,
            loadMask: {msg: 'Cargando criterios...'},
            columns: me.cmCriterios,
            listeners: {},
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: me.stCriterios,
                displayInfo: true,
                displayMsg: 'Resultados de {0} - {1} de {2}',
                emptyMsg: "No hay resultados para mostrar."
            })
        });

        me.buttons = [me.btnCancelar, me.btnAceptar];
        me.items = [me.gpCriterios];
        me.keys = [{
            key: 'x',
            alt: true,
            scope: me,
            stopEvent: true,
            fn: function () {
                me.btnCancelar.focus();
                me.btnCancelar.handler.call();
            }
        }, {
            key: Ext.EventObject.ENTER,
            scope: me.panelbuscaractorespersona,
            stopEvent: true,
            fn: function () {
                if (!me.btnAceptar.disabled) {
                    me.btnAceptar.handler.call();
                }
            }
        }];
        Planificacion.Integracion.WinBuscarCriterios.superclass.initComponent.call(this);

    }
});
Ext.reg('Planificacion.Integracion.WinBuscarCriterios', Planificacion.Integracion.WinBuscarCriterios);