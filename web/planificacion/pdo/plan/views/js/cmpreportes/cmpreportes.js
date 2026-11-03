Utilidades.Cmp.Cmpreportes = function (opcionesConfig) {
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.prevrow = -1;
    this.idtipodocumento = 0;
    this.idaprobdiferentes = 0;
    this.eshija = 0;
    this.tipoactivado = 0;
    this.tipofipactivado = 0;
    this.categactivado = 0;
    this.idtiporeporteseleccionado = 0;
    this.idversionreporte = null;
    this.versionadoSelecionado = null;
    this.arrayitemspComp = [];
    this.versionReporte = null;
    var pagstar = 0;
    var prevrow = -1;
    var prevrow2 = -1;
    var fechaactual = new Date();
    var annoactual = fechaactual.getFullYear();
    this.arrayobjreporte = [];
    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    this.mod = ({
        cargoAprob: false,
        gradoAprob: false,
        nombreAprob: false,
        cargoElab: false,
        gradoElab: false,
        nombreElab: false
    });
    this.valoresIniciales = ({
        cargoAprob: '',
        gradoAprob: '',
        nombreAprob: '',
        cargoElab: '',
        gradoElab: '',
        nombreElab: ''
    });

    Ext.apply(Ext.form.VTypes, {
        rangodefechas: function (val, field) {
            var date = field.parseDate(val);
            if (!date) {
                return;
            }
            if (field.endDateField) {
                var end = Ext.getCmp(field.endDateField);
                end.setMinValue(date);
                end.validate();
            }
            return true;
        }
    });

    //objeto CRUD-PLAN inicializado
    this.objCrudPlan = new Utilidades.Cmp.Cmpcrudplan();

    //objeto del componente observaciones inicializado
    this.objCmpObservaciones = new Utilidades.Cmp.Cmpgestionarobservaciones();

    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    //inicializando el objeto menu dinamico 
    this.objcmpmenurelacionesdin = new Utilidades.Cmp.CmpMenuRelacionesDinamicas();

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    if (!opcionesConfig.excluirPlan) {
        //objeto del componente observaciones inicializado
        this.objCmpPlan = new Utilidades.Cmp.Cmpgestionarplan(
            {
                noUsarAdicionar: true,
                noUsarModificar: true,
                noUsarEliminar: true,
                noUsarActivar: true,
                noUsarDesactivar: true,
                noUsarCerrarWinP: true,
                noUsarSeleccionarWinP: true,
                maxWinPrincipal: true,
                noUsarCbAprob: false,
                noUsarGestObser: true,
                noMostrarColumObser: false,
                singlemodoSeleccionGridPlanes: true,
                noUsarMenuGrid: true,
                noUsarAyuda: true,
                tipoComponente: 'panel'
            });
    }

    this.btnConfigFirma = new Ext.Button({
        iconCls: 'configuracion',
        id: "btnConfigFirma",
        tooltip: 'Configurar encabezado y pie de firma del reporte',
        disabled: false,
        handler: function () {
            _this.CrearVentanaConfiguracion();
        },
        key: {
            ctrl: true,
            alt: true,
            key: 'F'
        },
        scope: this

    });
    this.btnLimpiarFiltro = new Ext.Button({
        iconCls: 'limpiar',
        id: "limpiarFiltro",
        tooltip: 'Limpiar filtro(s)',
        disabled: false,
        handler: function () {
            _this.LimpiarFiltros();
        },
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });
    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaReportes',
        text: 'Ayuda',
        disabled: false,
        iconCls: 'ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad',
        key: {
            alt: true,
            key: 'H'
        }
    });

    this.btnExportar = new Ext.Button({
        iconCls: 'crearreporte',
        disabled: false,
        id: "btnImprimir",
        tooltip: 'Crear reporte',
        handler: function () {
            _this.GenerarReporte('vp', {reporte: 1});
        },
        key: {
            alt: true,
            key: 'R'
        },
        scope: this
    });
    this.btnAddVersion = new Ext.Button({
        handler: function () {
            _this.CrearWinCrudVersiones('Adicionar');
        },
        disabled: false,
        hidden: true,
        iconCls: 'adicionar',
        tooltip: 'Adicionar versi&oacute;n',
        key: {
            alt: true,
            key: 'I'
        },
        scope: this
    });
    this.btnModVersion = new Ext.Button({
        handler: function () {
            _this.CrearWinCrudVersiones('Modificar', _this.idversionreporte)
        },
        disabled: true,
        hidden: true,
        iconCls: 'modificar',
        tooltip: 'Modificar versi&oacute;n',
        key: {
            alt: true,
            key: 'M'
        },
        scope: this,
        stopEvent: true
    });
    this.btnElimVersion = new Ext.Button({
        handler: function () {
            _this.EliminarVersiones(_this.idversionreporte)
        },
        disabled: true,
        hidden: true,
        iconCls: 'eliminar',
        tooltip: 'Eliminar versi&oacute;n',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });

    //store del grid donde cargo los reportes existentes
    this.stGReportesExistentes = new Ext.data.Store({
        autoLoad: true,
        url: '/planificacion/pdo/plan/index.php/cmpreportes/cargarreportesexistentes',
        reader: new Ext.data.JsonReader(
            {
                totalProperty: "total",
                root: "campos",
                id: "idreporte"
            },
            [{
                name: 'idreporte'
            }, {
                name: 'denreporte'
            }, {
                name: 'descreporte'
            }, {
                name: 'icon'
            }, {
                name: 'modovisual'
            }]
        )
    });//ss
    //modo de seleccion del grid donde cargo los reportes existentes
    this.smGReportes = new Ext.grid.RowSelectionModel({
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                _this.On_RowClickReportesExistentes(sm, indiceFila, record);
            }
        }
    });
    //grid donde cargo los reportes existentes
    this.GReportes = new Ext.grid.GridPanel({
        margins: '3 3 3 3',
        width: 270,
        sm: _this.smGReportes,
        region: 'west',
        title: 'Reportes existentes',
        autoScroll: true,
        collapsible: true,
        columns: [{
            dataIndex: 'denreporte',
            width: 265,
            header: '',
            renderer: Cent
        }],
        store: _this.stGReportesExistentes,
        loadMask: {
            msg: 'Cargando reportes'
        },
        listeners: {},
        viewConfig: {
            tpl: new Ext.XTemplate(
                '<tpl>' +
                '<div class="mouseover">' +
                '<img class="mouseover" style="width:35%;float:left" src="../../../comun/recursos/images/fam/{icon}"/ ><div class="mouseover" style="width:60%;float:left">{descreporte}</div>' +
                '</div>' +
                '</tpl>'
            ),
            enableRowBody: true,
            getRowClass: function (rec, idx, p, store) {
                p.body = this.tpl.apply(rec.data);
            }
        }
    });

    this.tfclasiificacion = new Ext.form.TextField({
        regex: /^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/,
        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ ])$/,
        regexText: 'Solo admite caracteres alfanuméricos.',
        witdh: 100,
        maxLength: 50,
        maxLengthText: 'El tamaño máximo requerido es 50 caracteres.',
        value: 'Ordinario',
        id: 'clasifreporte'
    });

    //campo de texto donde pongo el titulo del reporte
    this.tftituloreporte = new Ext.form.TextField({
        maxLength: 255,
        maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
        regex: _this.ObjValidaciones.expresionRegular('denominacion'),
        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
        regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
        vtype: 'validarEspaciosEnBlanco',
        allowBlank: false,
        fieldLabel: 'T&iacute;tulo del reporte',
        width: 600
    });
    //formulario para el campo de texto donde pongo el titulo del reporte
    this.ftituloreporte = new Ext.FormPanel({
        frame: true,
        labelalign: 'left',
        items: [_this.tftituloreporte]
    });
    //formulario para el titulo del reporte
    this.ptituloreporte = new Ext.Panel({
        region: 'north',
        layout: 'fit',
        height: 50,
        items: [_this.ftituloreporte]
    });

		// _this.btnAddVersion.setVisible(false);
		// _this.btnElimVersion.setVisible(false);
		// _this.btnModVersion.setVisible(false);

    //arbol con las versiones del reporte
    this.tpversreporte = new Ext.tree.TreePanel({
        title: 'Versionado y campos del reporte',
        usarKeymap: true,
        botonesKeymap: [_this.btnAddVersion, ' ', _this.btnModVersion, _this.btnElimVersion],
        tbar: [_this.btnAddVersion, ' ', _this.btnModVersion, _this.btnElimVersion, '->',
            '-',
            {
                iconCls: 'expandir',
                tooltip: 'Expandir agrupaci&oacute;n',
                handler: function () {
                    _this.tpversreporte.root.expand(true);
                }
            }, {
                iconCls: 'contraer',
                tooltip: 'Contraer agrupaci&oacute;n',
                handler: function () {
                    _this.tpversreporte.root.collapse(true);
                }
            }, {
                iconCls: 'actualizar',
                tooltip: 'Refrescar agrupaci&oacute;n',
                handler: function () {
                    _this.LimpiarDisenoReporte();
                    _this.tpversreporte.root.reload();
                }
            }, '-'
        ],
        region: 'west',
        collapsible: true,
        width: 240,
        margins: '3 3 3 3',
        autoScroll: true,
        border: false,
        root: {
            text: 'Versiones del reporte seleccionado',
            expanded: false,
            id: 'nodoraiz',
            idtipo: 'nodoraiz',
            draggable: false
        },
        listeners: {
            'click': function (nodo, e) {
                _this.idversionreporte = nodo.id;
                _this.versionadoSelecionado = nodo.id;
                _this.ConformarComposicionDelReporte(nodo);
                _this.HabilitarBotonesGestionarVersiones(nodo);
            }
        },
        loader: new Ext.tree.TreeLoader({
            singleClickExpand: true,
            dataUrl: '/planificacion/pdo/plan/index.php/cmpreportes/cargarversionesreporte',
            listeners: {
                'beforeload': function (atreeloader, anode) {
                    atreeloader.baseParams = {
                        idreporte: anode.id,
                        idtiporeporte: _this.idtiporeporteseleccionado,
                        idtipo: anode.attributes.idtipo
                    };
                    _this.btnModVersion.disable();
                    _this.btnElimVersion.disable();
                },
                'load': function (atreeloader, anode) {
                    _this.tpversreporte.getRootNode().firstChild.select();
                    var nodoselect = _this.tpversreporte.getRootNode().firstChild;
                    _this.versionadoSelecionado = nodoselect.id;
                    _this.idversionreporte = nodoselect.id;
                    _this.ConformarComposicionDelReporte(nodoselect);
                    _this.HabilitarBotonesGestionarVersiones(nodoselect);
                }
            }
        })
    });

    //panel 
    this.pcomposicreporte = new Ext.Panel({
        title: 'Composici&oacute;n del reporte',
        autoScroll: true,
        region: 'center'
    });

    //panel donde muestro los campos del reporte que deseo mostrar
    this.pcuerporeporte = new Ext.Panel({
        title: 'Cuerpo del reporte',
        layout: 'border',
        usarKeymap: true,
        botonesKeymap: [_this.btnAddVersion, _this.btnModVersion, _this.btnElimVersion],
        items: [_this.tpversreporte, _this.pcomposicreporte],
    });

    this.sttgcategact = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/listarNomencladores',
        reader: new Ext.data.JsonReader(
            {
                id: 'idnom',
                root: 'data',
                totalProperty: 'total'
            },
            [{
                name: 'idnom'
            }, {
                name: 'denom'
            }, {
                name: '_parent'
            }, {
                name: '_is_leaf'
            }, {
                name: 'superior'
            }]
        ),
        listeners: {
            beforeload: function (st) {
                _this.sttgcategact.removeAll();
                st.baseParams.start = pagstar;
                st.baseParams.limit = _this.pgcategact.pageSize;
                st.baseParams.tiponom = 2;

            }
        }
    });

    this.pgcategact = new Ext.PagingToolbar({
        pageSize: 1000,
        store: _this.sttgcategact,
        displayInfo: true,
        id: 'pgcategact',
        listeners: {
            beforechange: function (paginado, evento) {
                pagstar = evento.start;
            }
        }
    });

    this.smtgcategact = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indice, record) {
                if (prevrow >= 0 && prevrow != indice) {
                    Ext.get(_this.tgcategact.getView().getRow(prevrow)).removeClass('superior2');
                    Ext.get(_this.tgcategact.getView().getRow(prevrow)).addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(_this.tgcategact.getView().getRow(indice)).removeClass('superior');
                    Ext.get(_this.tgcategact.getView().getRow(indice)).addClass('superior2');
                    prevrow = indice;
                } else
                    prevrow = -1;
            },
            rowdeselect: function (sm, indice, record) {
                if (prevrow >= 0 && prevrow != indice) {
                    Ext.get(_this.tgcategact.getView().getRow(prevrow)).removeClass('superior2');
                    Ext.get(_this.tgcategact.getView().getRow(prevrow)).addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(_this.tgcategact.getView().getRow(indice)).removeClass('superior');
                    Ext.get(_this.tgcategact.getView().getRow(indice)).addClass('superior2');
                    prevrow = indice;
                } else
                    prevrow = -1;
            }
        }
    });
    this.tgcategact = new Ext.ux.maximgb.treegrid.GridPanel({
        store: _this.sttgcategact,
        title: 'Categoría de actividad',
        id: 'tgcategact',
        master_column_id: 'expandir',
        autoExpandColumn: 'expandir',
        stripeRows: true,
        sm: _this.smtgcategact,
        root_title: ' ',
        loadMask: {
            msg: 'Cargando categorías de actividad'
        },
        bbar: _this.pgcategact,
        columns: [
            _this.smtgcategact,
            {
                hidden: true,
                dataIndex: 'idnom'
            }, {
                hidden: true,
                dataIndex: 'superior'
            }, {
                id: 'expandir',
                header: 'Denominación',
                dataIndex: 'denom'
            }
        ],
        listeners: {
            activate: function (p) {
                if (_this.categactivado == 0) {
                    _this.categactivado = 1;
                    _this.sttgcategact.removeAll();
                    _this.sttgcategact.load({
                        params: {
                            tiponom: 2
                        }
                    });
                }
            }
        }
    });
    _this.tgcategact.getView().getRowClass = function (ri, n) {
        if (ri.data.superior == 1)
            return "superior";
        else
            return "";
    };
    //Panel de las opciones de busqueda de tareas por tipo
    this.smtgtipoact = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indice, record) {
                if (prevrow2 >= 0 && prevrow2 != indice) {
                    Ext.get(_this.tgtipoact.getView().getRow(prevrow2)).removeClass('superior2');
                    Ext.get(_this.tgtipoact.getView().getRow(prevrow2)).addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(_this.tgtipoact.getView().getRow(indice)).removeClass('superior');
                    Ext.get(_this.tgtipoact.getView().getRow(indice)).addClass('superior2');
                    prevrow2 = indice;
                } else
                    prevrow2 = -1;
            },
            rowdeselect: function (sm, indice, record) {
                if (prevrow2 >= 0 && prevrow2 != indice) {
                    Ext.get(_this.tgtipoact.getView().getRow(prevrow2)).removeClass('superior2');
                    Ext.get(_this.tgtipoact.getView().getRow(prevrow2)).addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(_this.tgtipoact.getView().getRow(indice)).removeClass('superior');
                    Ext.get(_this.tgtipoact.getView().getRow(indice)).addClass('superior2');
                    prevrow2 = indice;
                } else
                    prevrow2 = -1;
            }
        }
    });
    this.sttgtipoact = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/listarNomencladores',
        reader: new Ext.data.JsonReader(
            {
                id: 'idnom',
                root: 'data',
                totalProperty: 'total'
            },
            [{
                name: 'idnom'
            }, {
                name: 'denom'
            }, {
                name: '_parent'
            }, {
                name: '_is_leaf'
            }, {
                name: 'superior'
            }]
        ),
        listeners: {
            beforeload: function (st) {
                _this.sttgtipoact.removeAll();
                st.baseParams.start = pagstar;
                st.baseParams.limit = _this.pgtipoact.pageSize;
                st.baseParams.tiponom = 3;

            }
        }
    });

    this.pgtipoact = new Ext.PagingToolbar({
        pageSize: 1000,
        store: _this.sttgtipoact,
        displayInfo: true,
        id: 'pgtipoact',
        listeners: {
            beforechange: function (paginado, evento) {
                pagstar = evento.start;
            }
        }
    });

    this.tgtipoact = new Ext.ux.maximgb.treegrid.GridPanel({
        store: _this.sttgtipoact,
        title: 'Tipo de actividad',
        id: 'tgtipoact',
        master_column_id: 'expandir',
        autoExpandColumn: 'expandir',
        stripeRows: true,
        sm: _this.smtgtipoact,
        root_title: ' ',
        loadMask: {
            msg: 'Cargando tipos de actividad'
        },
        bbar: _this.pgtipoact,
        columns: [
            _this.smtgtipoact,
            {
                hidden: true,
                dataIndex: 'idnom'
            }, {
                hidden: true,
                dataIndex: 'superior'
            }, {
                id: 'expandir',
                header: 'Denominación',
                dataIndex: 'denom'
            }
        ],
        listeners: {
            activate: function (p) {
                if (_this.tipoactivado == 0) {
                    _this.tipoactivado = 1;
                    _this.sttgtipoact.removeAll();
                    _this.sttgtipoact.load({
                        params: {
                            tiponom: 3
                        }
                    });
                }
            }
        }
    });
    _this.tgtipoact.getView().getRowClass = function (ri, n) {
        if (ri.data.superior == 1)
            return "superior";
        else
            return "";
    };


		//Panel de las opciones de busqueda de tareas por tipo
		this.smtgtipofip = new Ext.grid.CheckboxSelectionModel({
				singleSelect: false,
				listeners: {
						rowselect: function (sm, indice, record) {
								if (prevrow2 >= 0 && prevrow2 != indice) {
										Ext.get(_this.tgtipofip.getView().getRow(prevrow2)).removeClass('superior2');
										Ext.get(_this.tgtipofip.getView().getRow(prevrow2)).addClass('superior');
								}
								if (record.data.superior == 1) {
										Ext.get(_this.tgtipofip.getView().getRow(indice)).removeClass('superior');
										Ext.get(_this.tgtipofip.getView().getRow(indice)).addClass('superior2');
										prevrow2 = indice;
								} else
										prevrow2 = -1;
						},
						rowdeselect: function (sm, indice, record) {
								if (prevrow2 >= 0 && prevrow2 != indice) {
										Ext.get(_this.tgtipofip.getView().getRow(prevrow2)).removeClass('superior2');
										Ext.get(_this.tgtipofip.getView().getRow(prevrow2)).addClass('superior');
								}
								if (record.data.superior == 1) {
										Ext.get(_this.tgtipofip.getView().getRow(indice)).removeClass('superior');
										Ext.get(_this.tgtipofip.getView().getRow(indice)).addClass('superior2');
										prevrow2 = indice;
								} else
										prevrow2 = -1;
						}
				}
		});


		this.sttgtipofip = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
				url: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/listarNomencladores',
				reader: new Ext.data.JsonReader(
						{
								id: 'idnom',
								root: 'data',
								totalProperty: 'total'
						},
						[{
								name: 'idnom'
						}, {
								name: 'denom'
						}, {
								name: '_parent'
						}, {
								name: '_is_leaf'
						}, {
								name: 'superior'
						}]
				),
				listeners: {
						beforeload: function (st) {
								_this.sttgtipofip.removeAll();
								st.baseParams.start = pagstar;
								st.baseParams.limit = _this.pgtipofip.pageSize;
								st.baseParams.tiponom = 4;

						}
				}
		});


		this.pgtipofip = new Ext.PagingToolbar({
				pageSize: 1000,
				store: _this.sttgtipofip,
				displayInfo: true,
				id: 'pgtipofip',
				listeners: {
						beforechange: function (paginado, evento) {
								pagstar = evento.start;
						}
				}
		});


		this.tgtipofip = new Ext.ux.maximgb.treegrid.GridPanel({
				store: _this.sttgtipofip,
				title: 'Tipo de FIP',
				id: 'tgtipofip',
				master_column_id: 'expandir',
				autoExpandColumn: 'expandir',
				stripeRows: true,
				sm: _this.smtgtipofip,
				root_title: ' ',
				loadMask: {
						msg: 'Cargando tipos de FIP'
				},
				bbar: _this.pgtipofip,
				columns: [
						_this.smtgtipofip,
						{
								hidden: true,
								dataIndex: 'idnom'
						}, {
								hidden: true,
								dataIndex: 'superior'
						}, {
								id: 'expandir',
								header: 'Denominación',
								dataIndex: 'denom'
						}
				],
				listeners: {
						activate: function (p) {
								if (_this.tipofipactivado == 0) {
										_this.tipofipactivado = 1;
										_this.sttgtipofip.removeAll();
										_this.sttgtipofip.load({
												params: {
														tiponom: 4
												}
										});
								}
						}
				}
		});
		_this.tgtipofip.getView().getRowClass = function (ri, n) {
				if (ri.data.superior == 1)
						return "superior";
				else
						return "";
		};

    //treegrid con los planes existentes
    if (!opcionesConfig.excluirPlan) {
        _this.pplanes = this.objCmpPlan.CargarCmpPlan(idelemento = null, tipoelemento = null, parentelemento = null, PostAccionesRelacionar = null);
        _this.pplanes.setTitle('Planes');

    } else {
        _this.pplanes = new Ext.Panel({});
    }

    this.tpAutoresInvolucrados = _this.objclasificadorinvol.CrearClasificadorInvolBusqueda(tipoelemento = 3, 2);
    this.pAutoresInvolucrados = new Ext.Panel({
        title: 'Autores / Involucrados',
        layout: 'fit',
        items: [_this.tpAutoresInvolucrados]
    });

    //panel donde cargo condiciones y opciones de filtrado
    this.pconopciones = new Ext.TabPanel({
        activeTab: 2,
        region: 'center',
        items: [_this.tgcategact, _this.tgtipoact, _this.pplanes, _this.pAutoresInvolucrados, _this.tgtipofip]
    });

    setTimeout(function () {
        //_this.pplanes.focus();
    }, 500);

    //store para el combo de meses
    this.storeMeses = new Ext.data.SimpleStore({
        fields: ['idmes', 'mes'],
        data: [
            ["01", "Enero"],
            ["02", "Febrero"],
            ["03", "Marzo"],
            ["04", "Abril"],
            ["05", "Mayo"],
            ["06", "Junio"],
            ["07", "Julio"],
            ["08", "Agosto"],
            ["09", "Septiembre"],
            ["10", "Octubre"],
            ["11", "Noviembre"],
            ["12", "Diciembre"]
        ]
    });

    //combo de mese
    this.cbmeses = new Ext.form.ComboBox({
        id: 'cbmeses',
        name: 'cbmeses',
        fieldLabel: 'Mes',
        //allowBlank: false,
        store: _this.storeMeses,
        displayField: 'mes',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        hiddenName: 'idmes',
        valueField: 'idmes',
        width: 150,
        emptyText: 'Seleccione',
        disabled: false,
        enableKeyEvents: true,
        listeners: {
            select: function (combo, record, index) {
                if (_this.tfanno.getValue() == '') {
                    _this.tfanno.setValue(annoactual);
                }
                //btnImprimir.enable();		   
            }
        }
    });


    //campo numerico para poner el anno
    this.tfanno = new Ext.form.NumberField({
        allowDecimals: false,
        allowNegative: false,
        //allowBlank: false,
        maxLength: 4,
        minLength: 1,
        fieldLabel: 'Año',
        name: 'tfanno',
        width: 150,
        enableKeyEvents: true,
        listeners: {
            focus: function (tf) {
                if (_this.tfanno.getValue() == '') {
                    _this.tfanno.setValue(annoactual);
                    _this.cbmeses.setValue('01');
                }
            }
        }
    });

    //campo numerico para poner el anno
    this.tfAno = new Ext.form.NumberField({
        allowDecimals: false,
        allowNegative: false,
        allowBlank: false,
        maxLength: 4,
        minLength: 1,
        fieldLabel: 'Año',
        name: 'tfAno',
        width: 150,
        enableKeyEvents: true,
        listeners: {
            focus: function (tf) {
                if (_this.tfAno.getValue() == '') {
                    _this.tfAno.setValue(annoactual);
                }
            }
        }
    });

    //campo para la fexha inicial de la busqueda
    this.fechafinal = new Ext.form.DateField({
        fieldLabel: 'Fecha fin',
        width: 150,
        name: 'fechafinal',
        minText: 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
        id: 'fechafinal',
        vtype: 'daterange',
        invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha'),
        format: 'd/m/Y',
        enableKeyEvents: true
    });

    //campo para la fexha final de la busqueda
    this.fechainicial = new Ext.form.DateField({
        fieldLabel: 'Fecha de inicio',
        width: 150,
        name: 'fechainicial',
        id: 'fechainicial',
        vtype: 'daterange',
        maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
        endDateField: 'fechafinal',
        invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha'),
        format: 'd/m/Y'
    });

    this.fsrangofechas = new Ext.form.FieldSet({
        checkboxToggle: true,
        id: 'fiff',
        title: 'Por rango de fechas',
        height: 140,
        width: 180,
        listeners: {
            beforeexpand: function (p) {
                if (_this.tfanno.rendered && _this.cbmeses.rendered) {
                    _this.tfanno.reset();
                    _this.cbmeses.clearValue();
                }
                _this.fsanomes.collapse();
            },
		        beforecollapse: function (p) {
                if(_this.fechainicial.rendered && _this.fechafinal.rendered){
		                _this.fechainicial.reset();
		                _this.fechafinal.reset();
                }
		        }
        },
        collapsed: true,
        items: [
            {
                layout: 'column',
                border: false,
                items: [
                    {
                        columnWidth: 1,
                        border: false,
                        layout: 'form',
                        labelAlign: 'top',
                        items: [_this.fechainicial, _this.fechafinal]
                    }
                ]
            }
        ]
    });

    //fieldset para mostrar opcion de filtrado por anno y mes
    this.fsanomes = new Ext.form.FieldSet({
        checkboxToggle: true,
        id: 'anomes',
        title: 'Por año y mes',
        height: 140,
        width: 180,
        listeners: {
            beforeexpand: function (p) {
                _this.fechainicial.reset();
                _this.fechafinal.reset();
                _this.fsrangofechas.collapse();
            },
		        beforecollapse: function (p) {
				        if (_this.tfanno.rendered && _this.cbmeses.rendered) {
						        _this.tfanno.reset();
						        _this.cbmeses.clearValue();
				        }
		        }
        },
        collapsed: true,
        items: [
            {
                layout: 'column',
                border: false,
                items: [
                    {
                        columnWidth: 1,
                        border: false,
                        layout: 'form',
                        labelAlign: 'top',
                        items: [_this.tfanno, _this.cbmeses]
                    }
                ]
            }
        ]
    });

    this.rbFipCump = new Ext.form.Radio({
        hideLabel: true,
        id: 'rbFipCump',
        boxLabel: 'Cumplido',
        name: 'fipcumplimiento',
        // readOnly: readonlyAct,
        inputValue: '1',
        checked: true,
        listeners: {
            check: function (check, val) {
                // Ext.getCmp('porcientocumpact').enable();
            },
            focus: function (el) {
                // Ext.getCmp('porcientocumpact').enable();
            }
        }
    });

    this.rbFipImcump = new Ext.form.Radio({
        hideLabel: true,
        id: 'rbFipImcump',
        boxLabel: 'Imcumplido',
        name: 'fipcumplimiento',
        // readOnly: readonlyAct,
        inputValue: '0',
        checked: false,
        listeners: {
            check: function (check, val) {
                // Ext.getCmp('porcientocumpact').enable();
            },
            focus: function (el) {
                // Ext.getCmp('porcientocumpact').enable();
            }
        }
    });

    this.fsFIP = new Ext.form.FieldSet({
        checkboxToggle: true,
        id: 'fsFIP',
        title: 'FIP',
        height: 120,
        width: 180,
        listeners: {
            beforeexpand: function (p) {

            }
        },
        collapsed: true,
        items: [
            {
                layout: 'column',
                border: false,
                items: [
                    {
                        columnWidth: 1,
                        border: false,
                        layout: 'form',
                        labelAlign: 'top',
                        items: [_this.rbFipCump, _this.rbFipImcump]
                    }
                ]
            }
        ]
    });

    //store para el combo para la busqueda de fips por tipo
    this.stCmbTipo = new Ext.data.Store({
        autoLoad: true,
        url: '/planificacion/pdo/plan/index.php/cmpgestionarfip/cargartiposfip',
        reader: new Ext.data.JsonReader({
            id: 'idtipo',
            root: "data"
        }, [{
            name: 'idtipo'
        }, {
            name: 'denominacion'
        }])
    });
    //combo para la busqueda de fips por tipo
    this.cbbtipo = new Ext.form.ComboBox({
        emptyText: 'Seleccione',
        hideLabel: true,
        autoScroll: true,
        fieldLabel: 'Tipo de FIP',
        store: this.stCmbTipo,
        hiddenName: 'idtipo',
        valueField: 'idtipo',
        displayField: 'denominacion',
        triggerAction: 'all',
        editable: true,
        loadingText: 'Cargando datos',
        forceSelection: true,
        mode: 'local',
        anchor: '95%',
        listeners: {
            expand: function(combo) {
                this.stCmbTipo.reload();
            },
            select: function(combo, record, index) {
                // if (_this.estamodificando == 1) {
                //     if (_this.valoresiniform.tipofip != record.data.idtipo) {
                //         _this.mod.tipofip = true;
                //     } else {
                //         _this.mod.tipofip = false;
                //     }
                // }
            },
            'render': function(c) {
                if (_this.estamodificando == 1) {
                    c.getEl().on('keyup', function() {
                        // if (_this.valoresiniform.tipofip != c.getValue()) {
                        //     _this.mod.tipofip = true;
                        // } else {
                        //     _this.mod.tipofip = false;
                        // }
                    }, c);
                }
            }
        }
    });

    this.fsTipoFIP = new Ext.form.FieldSet({
        checkboxToggle: true,
        id: 'fsTipoFIP',
        title: 'Tipo FIP',
        height: 120,
        width: 180,
        listeners: {
            beforeexpand: function (p) {

            }
        },
        collapsed: true,
        items: [_this.cbbtipo]
    });


    //fieldset para mostrar opcion de filtrado por anno y mes
    this.fsano = new Ext.form.FieldSet({
        checkboxToggle: true,
        id: 'fsano',
        title: 'Por año',
        height: 90,
        width: 180,
        listeners: {
            beforeexpand: function (p) {

            }
        },
        collapsed: true,
        items: [
            {
                layout: 'column',
                border: false,
                items: [
                    {
                        columnWidth: 1,
                        border: false,
                        layout: 'form',
                        labelAlign: 'top',
                        items: [_this.tfAno]
                    }
                ]
            }
        ]
    });

    //panel donde muestro las condiciones para la busqueda
    this.pcondiciones = new Ext.Panel({
        title: 'Condiciones para la b&uacute;squeda',
        width: 250,
        collapsible: true,
        margins: '3 3 3 3',
        bodyStyle: 'padding:10px 5px 0',
        layout: 'form',
        labelAlign: 'top',
        items: [_this.fsanomes, _this.fsrangofechas, _this.fsano, _this.fsFIP, _this.fsTipoFIP],
        region: 'west'
    });

    //panel donde muestro las opciones para filtrar las actividades
    this.pfiltroactivades = new Ext.Panel({
        title: 'Filtrar los elementos por:',
        layout: 'border',
        listeners: {
            activate: function (p) {
                _this.HabilitarCampos(_this.idtiporeporteseleccionado);
            }
        },
        items: [_this.pcondiciones, _this.pconopciones]
    });

    //tabpanel donde muestro las pestañas con las opciones de filtrado
    this.tpcondicionales = new Ext.TabPanel({
        activeTab: 0,
        region: 'center',
        margins: '3 3 3 3',
        items: [_this.pcuerporeporte, _this.pfiltroactivades]
    });

    //panel donde muestro las opciones de filtrado del reporte
    this.pFiltros = new Ext.Panel({
        id: 'pFiltros',
        title: 'Opciones de filtrado',
        margins: '3 3 3 3',
        layout: 'border',
        frame: false,
        region: 'center',
        disabled: true,
        tbar: [_this.btnConfigFirma, ' ', _this.btnExportar, ' ', _this.btnLimpiarFiltro, '->', 'Clasificaci&oacute;n: ', ' ', _this.tfclasiificacion, '-', _this.btnAyuda],
        usarKeymap: true,
        botonesKeymap: [_this.btnConfigFirma, _this.btnExportar, _this.btnLimpiarFiltro, _this.btnAyuda],
        items: [_this.ptituloreporte, _this.tpcondicionales]
    });

    //panel principal de la vista
    this.PanPrincipal = new Ext.Panel({
        layout: 'border',
        items: [_this.GReportes, _this.pFiltros]
    });

    //ventana principal de la vista
    this.WinPrincipal = new Ext.Window({
        layout: 'fit',
        title: opcionesConfig.titleWinPrincipal,
        closable: opcionesConfig.closableWinPrincipal,
        constrain: true,
        maximized: opcionesConfig.maxWinPrincipal,
        noTitle: opcionesConfig.maxWinPrincipal,
        modal: true,
        width: 1000,
        height: 510,
        items: _this.PanPrincipal,
        buttons: [
            {
                text: 'Cerrar',
                tooltip: 'Cerrar ventana',
                hidden: opcionesConfig.noUsarCerrarWinP,
                iconCls: 'cerrar',
                handler: function () {
                    _this.WinPrincipal.hide();
                }
            }
        ]
    });

    //funcion donde se procede a cargar la plantilla
    this.CargarCmpReportes = function (idelemento, tipoelemento, parentelemento, AccionesAlRelacionar) {
        _this.AccionesAlRelacionar = AccionesAlRelacionar;
        _this.idelementohijo = idelemento;
        _this.tipoelementohijo = tipoelemento;
        if (parentelemento == 'padre') {
            _this.idelementopadre = idelemento;
            _this.tipoelementopadre = tipoelemento;
        }
        _this.WinPrincipal.show();
    };

    //funcion para habilitar la barra de herramientas para gestionar versiones del reporte
    this.HabilitarBotonesGestionarVersiones = function (nodo) {
        if (nodo.id == 'nodoraiz' || nodo.attributes.estandar == 1) {
            _this.btnElimVersion.disable();
            _this.btnModVersion.disable();
        } else {
            _this.btnElimVersion.enable();
            _this.btnModVersion.enable();
            _this.idversionreporte = nodo.id;
        }
    };

    //funcion que se ejecuta al seleccionar uno de los reportes existentes
    this.On_RowClickReportesExistentes = function (sm, indiceFila, record) {
        _this.tituloreporteseleccionado = record.data.denreporte;
        _this.tftituloreporte.setValue(_this.tituloreporteseleccionado.toUpperCase());
        _this.idtiporeporteseleccionado = record.data.idreporte;
        _this.pFiltros.enable();
        _this.recordreporteseleccionado = record;
        _this.tpversreporte.root.reload();

		    _this.fsanomes.show();
		    _this.pcondiciones.enable();
		    _this.fsrangofechas.show();
		    _this.fsanomes.collapse();
		    _this.fsrangofechas.collapse();
		    _this.fsano.hide();

        _this.LimpiarDisenoReporte();
        if (_this.idtiporeporteseleccionado == '5' || _this.idtiporeporteseleccionado == '10'  || _this.idtiporeporteseleccionado == '11') {//Plan mensual, Plan mensual v2, y Reporte resumen mensual
            _this.fsrangofechas.hide();
            _this.fsano.hide();
            _this.fsanomes.show();
            _this.fsanomes.expand();
        }

        if (_this.idtiporeporteseleccionado == '8') {//Diagrama de coordinacion
            _this.fsrangofechas.hide();
            _this.fsanomes.hide();
            _this.fsano.show();
            _this.fsano.expand();
        }
        // if (_this.idtiporeporteseleccionado != '5' && _this.idtiporeporteseleccionado != '11') {
        //     _this.btnAddVersion.setVisible(false);
        //     _this.btnElimVersion.setVisible(false);
        //     _this.btnModVersion.setVisible(false);
        // } else {
        //     _this.btnAddVersion.setVisible(true);
        //     _this.btnElimVersion.setVisible(true);
        //     _this.btnModVersion.setVisible(true);
        // }

        // Grafico de coordinacion

		    if (_this.idtiporeporteseleccionado == '17') {//Diagrama de coordinacion
				    _this.fsrangofechas.hide();
				    _this.fsanomes.hide();
				    _this.fsano.show();
				    _this.fsano.expand();
		    }

        _this.validarCamposFechas(_this.idtiporeporteseleccionado);
    };

    //funcion para limpiar el visor con la composicion del reporte(cuando se cargan las versiones de los reportes)
    this.LimpiarDisenoReporte = function () {
        //FIXME limpiar el visor del reporte
        //_this.tpversreporte.root.reload();
        if (_this.arrayitemspComp.length > 0) {
            for (var i = 0; i < _this.arrayitemspComp.length; i++) {
                _this.pcomposicreporte.remove(_this.arrayitemspComp[i]);
            }
        }
        _this.arrayitemspComp = [];
    };

    //funcion para conformar la composicion del reporte a mostrar en el visor de reportes
    this.ConformarComposicionDelReporte = function (nodo) {
        //console.log('camina', nodo);
        if (nodo.id != 'nodoraiz') {
            if (_this.arrayitemspComp.length > 0) {
                for (var i = 0; i < _this.arrayitemspComp.length; i++) {
                    _this.pcomposicreporte.remove(_this.arrayitemspComp[i]);
                }
            }
            _this.arrayitemspComp = [];
            var arraypartesreporte = nodo.attributes.partesreportes;
            if (arraypartesreporte.length > 0) {
                for (var i = 0; i < arraypartesreporte.length; i++) {
                    var parte = _this.ObtenerPartesDeReportePorId(arraypartesreporte[i].idpartereporte, nodo);
                    if (parte) {
                        _this.arrayitemspComp.push(parte);
                        _this.pcomposicreporte.add(parte);
                    }
                }
            }
            _this.pcomposicreporte.doLayout();
        }
    };

    //funcion para obtener las partes del reporte dado el id de la parte
    this.ObtenerPartesDeReportePorId = function (idpartereporte, nodo) {
        switch (idpartereporte) {
            case '7':
                //console.log('aquiii',_this.recordreporteseleccionado.data);
                switch (_this.recordreporteseleccionado.data.modovisual) {
                    case 'agrupacion_arc':
                        html = "<img style='' src='../../../comun/recursos/images/reporte_por_arc.png'></img>";
                        break;
                    case 'agrupacion_obj':
                        html = "<img src='../../../comun/recursos/images/reporte_por_objetivos.png'></img>";
                        break;
                    case 'lista':
                        html = "<img src='../../../comun/recursos/images/reporte_actividades.png'></img>";
                        break;
                    case 'calendario':
                        html = "<img src='../../../comun/recursos/images/reporte_mensual.png'></img>";
                        break;
                    case 'lista_encabezado_objetivos':
                        html = "<img src='../../../comun/recursos/images/listado_objetivos1.png'></img>";
                        break;
                    case 'agrupacion_paoa':
                        html = "<img src='../../../comun/recursos/images/reporte_arc_obj_act.png'></img>";
                        break;
                    case 'objetivo_cm':
                        html = "<img src='../../../comun/recursos/images/reporte_arc_obj_act.png'></img>";
                        break;
                    case 'coordinacion':
                        html = "<img src='../../../comun/recursos/images/reporte_mensual.png'></img>";
                        break;
                }
                switch (nodo.id) {
                    case '3':
                        _this.tftituloreporte.setValue('LISTADO DE ACTIVIDADES');
                        break;
                    case '5':
                        html = "<img src='../../../comun/recursos/images/reporte_mensual_estandar.png'></img>";
                        break;
                    case '6':
                        _this.tftituloreporte.setValue('LISTADO DE ACTIVIDADES');
                        html = "<img src='../../../comun/recursos/images/reporte_actividades_invol.png'></img>";
                        break;

                    case '34':
                        html = "<img src='../../../comun/recursos/images/reporte_por_objetivos.png'></img>";
                        break;
                    case '35':
                        html = "<img src='../../../comun/recursos/images/reporte_por_objetivos_invol.png'></img>";
                        break;
                    case '36':
                            _this.tftituloreporte.setValue('PLAN DE TRABAJO ANUAL PARA EL AÑO');
                            html = "<img src='../../../comun/recursos/images/reporte_por_arc.png'></img>";
                            break;
                    case '37':
                        html = "<img src='../../../comun/recursos/images/reporte_por_arc_invol.png'></img>";
                        break;
                    case '38':
                            html = "<img src='../../../comun/recursos/images/reporte_arc_obj_act.png'></img>";
                            break;
                    case '39':
                        html = "<img src='../../../comun/recursos/images/reporte_arc_obj_act_invol.png'></img>";
                        break;
                    /*case '13':
                        html = "<img src='../../../comun/recursos/images/reporte_cualitativo_cuantitativo_periodo.png'></img>";
                        break;
                     case '14':
                         html = "<img src='../../../comun/recursos/images/reporte_resumen_planificacion_periodo.png'></img>";
                         break;*/
                    case '14':
                        html = "<img src='../../../comun/recursos/images/objetivos_trabajo.png'></img>";
                        break;
                    case '15':
                        html = "<img src='../../../comun/recursos/images/objetivo_trabajo_todos_campos.png'></img>";
                        break;
                    case '16':
                        html = "<img src='../../../comun/recursos/images/eval_objetivos_criterio_medida.png'></img>";
                        break;
                    case '17':
                        html = "<img src='../../../comun/recursos/images/objetivos_trabajo_act_obj_aseguran.png'></img>";
                        break;
                    case '18':
                        html = "<img src='../../../comun/recursos/images/objetivos_trabajo_firma.png'></img>";
                        break;
                    case '19':
                        html = "<img src='../../../comun/recursos/images/reporte_plan_anual.png'></img>";
                        break;
                    case '20':
                        html = "<img src='../../../comun/recursos/images/reporte_plan_anual_firma.png'></img>";
                        break;
                    case '21':
                        html = "<img src='../../../comun/recursos/images/reporte_puntualizaciones.png'></img>";
                        break;
                    case '22':
                        html = "<img src='../../../comun/recursos/images/reporte_puntualizaciones_telefonema.png'></img>";
                        break;
                    case '23':
                        html = "<img src='../../../comun/recursos/images/reporte_puntualizaciones_gobierno.png'></img>";
                        break;
                    case '24':
                        _this.tftituloreporte.setValue('FACTORES QUE INFLUYEN EN EL PLAN');
                        html = "<img src='../../../comun/recursos/images/reporte_fip_periodo.png'></img>";
                        break;
                    case '25':
                        _this.tftituloreporte.setValue('ACTIVIDADES QUE ASEGURAN LOS FACTORES QUE INFLUYEN EN EL PLAN');
                        html = "<img src='../../../comun/recursos/images/reporte_fip_actividades_aseguran.png'></img>";
                        break;
                    case '26':
                        html = "<img src='../../../comun/recursos/images/reporte_caracterizacion_plan_rango.png'></img>";
                        break;
                    case '27':
                        html = "<img src='../../../comun/recursos/images/reporte_caracterizacion_plan_resumen_cumplimiento.png'></img>";
                        break;
                    case '28':
                        html = "<img src='../../../comun/recursos/images/reporte_caracterizacion_plan_resumen_puntualizaciones.png'></img>";
                        break;
                    case '29':
                        html = "<img src='../../../comun/recursos/images/reporte_grafico_coordinacion_modelo.png'></img>";
                        break;
                    case '30':
                        _this.tftituloreporte.setValue('PLAN DE TRABAJO MENSUAL PARA EL MES DE');
                        html = "<img src='../../../comun/recursos/images/reporte_actividades_plan_mensual.png'></img>";
                        break;
                    case '40':
                        _this.tftituloreporte.setValue('PLAN DE TRABAJO MENSUAL PARA EL MES');
                        html = "<img src='../../../comun/recursos/images/reporte_actividades_firma_MP.png'></img>";
                        break;
                    /*case '41':
                        html = "<img src='../../../comun/recursos/images/objetivos_trabajo_firma_MP.png'></img>";
                        break;*/
                    case '31':
                            _this.tftituloreporte.setValue('LISTADO DE ACTIVIDADES');
                        html = "<img src='../../../comun/recursos/images/reporte_actividades_detallado.png'></img>";
                        break;
                    case '32':
                            html = "<img src='../../../comun/recursos/images/grafico_coordinacion_total_actividades.png'></img>";
                        break;
                    case '52':
                            _this.tftituloreporte.setValue('RESUMEN DE CUMPLIMIENTO');
                            html = "<img src='../../../comun/recursos/images/reporte_caracterizacion_plan_resumen_de_cumplimiento.png'></img>";
                            break;
                    case '53':
                            _this.tftituloreporte.setValue('INFORME RESUMEN DE PLAN DE TRABAJO');
                            html = "<img src='../../../comun/recursos/images/reporte_caracterizacion_informe_resumenplantrabajo.png'></img>";
                        break;
                    case '54':
                        _this.tftituloreporte.setValue('CONTROL DE ACUERDOS');
                        html = "<img src='../../../comun/recursos/images/reporte_fip_control_acuerdos.png'></img>";
                        break;
                    case '55':
                            _this.tftituloreporte.setValue('CONTROL DE ACUERDOS DETALLADO');
                            html = "<img src='../../../comun/recursos/images/reporte_fip_control_acuerdos.png'></img>";
                        break;
                }
                var parte = new Ext.Panel({
                    html: html,
                    autoHeight: true,
                    autoWidht: true,
                    autoScroll: true,
                    border: false
                });
                break
        }
        return parte;
    };

    //funcion donde procedo a crear la ventana para adicionar versiones del reporte
    this.CrearWinCrudVersiones = function (accion, idversionreporte) {
        if (_this.winCrudVersiones) {
            _this.winCrudVersiones.destroy();
        }
        _this.btnSubirOrden = new Ext.Button({
            iconCls: 'arriba',
            tooltip: 'Subir un nivel',
            disabled: true,
            handler: function () {/*_this.ActualizarOrdenCampos('subir');*/
            }
        });
        _this.btnBajarOrden = new Ext.Button({
            iconCls: 'abajo',
            tooltip: 'Bajar un nivel',
            disabled: true,
            handler: function () {/*_this.ActualizarOrdenCampos('bajar');*/
            }
        });

        //campo para la denominacion de la version
        _this.tfdenomversion = new Ext.form.TextField({
            id: 'tfdenomversion',
            fieldLabel: 'Denominación',
            maxLength: 100,
            maxLengthText: 'El tamaño máximo requerido es 100 caracteres.',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            allowBlank: false,
            anchor: '100%'
        });

        //campo para la descripcion de la version del reporte
        _this.hedescversion = new Ext.form.HtmlEditor({
            id: 'hedescversion',
            buttonTips: {
                bold: {
                    title: 'Negrita (Ctrl+B)',
                    text: 'Aplica el formato de negrita al texto seleccionado.',
                    cls: 'x-html-editor-tip'
                },
                italic: {
                    title: 'Cursiva (Ctrl+I)',
                    text: 'Aplica el formato de cursiva al texto seleccionado.',
                    cls: 'x-html-editor-tip'
                },
                underline: {
                    title: 'Subrayado (Ctrl+U)',
                    text: 'Subraya el texto seleccionado.',
                    cls: 'x-html-editor-tip'
                },
                increasefontsize: {
                    title: 'Agrandar fuente',
                    text: 'Aumenta el tamaño de la fuente.',
                    cls: 'x-html-editor-tip'
                },
                decreasefontsize: {
                    title: 'Encoger fuente',
                    text: 'Reduce el tamaño de la fuente.',
                    cls: 'x-html-editor-tip'
                },
                backcolor: {
                    title: 'Color de resaltado del texto',
                    text: 'Cambia el aspecto del texto como si estuviera marcado con un marcador.',
                    cls: 'x-html-editor-tip'
                },
                forecolor: {
                    title: 'Color de fuente',
                    text: 'Cambia el color del texto.',
                    cls: 'x-html-editor-tip'
                },
                justifyleft: {
                    title: 'Alinear texto a la izquierda',
                    text: 'Alinea el texto a la izquierda.',
                    cls: 'x-html-editor-tip'
                },
                justifycenter: {
                    title: 'Centrar',
                    text: 'Centrar el texto.',
                    cls: 'x-html-editor-tip'
                },
                justifyright: {
                    title: 'Alinear texto a la derecha',
                    text: 'Alinea el texto a la derecha.',
                    cls: 'x-html-editor-tip'
                },
                insertunorderedlist: {
                    title: 'Viñetas',
                    text: 'Inicia una lista con viñetas.',
                    cls: 'x-html-editor-tip'
                },
                insertorderedlist: {
                    title: 'Numeración',
                    text: 'Inicia una lista numerada.',
                    cls: 'x-html-editor-tip'
                },
                createlink: {
                    title: 'Hipervínculo',
                    text: 'Hace del texto seleccionado un hipervínculo.',
                    cls: 'x-html-editor-tip'
                },
                sourceedit: {
                    title: 'Edición de código',
                    text: 'Cambia al modo de edición de código.',
                    cls: 'x-html-editor-tip'
                }
            }
        });

        //Arbol donde muestro los campos que pueden componer el reporte
        _this.tpcamposreportes = new Ext.tree.TreePanel(
            {
                autoScroll: true,
                height: 200,
                disabled: true,
                region: 'north',
                border: false,
                tbar: ['->',
                    {
                        iconCls: 'expandir',
                        tooltip: 'Expandir agrupaci&oacute;n',
                        handler: function () {
                            _this.tpcamposreportes.root.expand(true);
                        }
                    }, {
                        iconCls: 'contraer',
                        tooltip: 'Contraer agrupaci&oacute;n',
                        handler: function () {
                            _this.tpcamposreportes.root.collapse(true);
                        }
                    }, {
                        iconCls: 'actualizar',
                        tooltip: 'Refrescar agrupaci&oacute;n',
                        handler: function () {
                            _this.tpcamposreportes.root.reload();
                        }
                    }, '-'
                ],
                root: {
                    text: 'Datos a mostrar en la versi&oacute;n del reporte',
                    expanded: false,
                    id: 'nodoraiz',
                    leaf: false,
                    draggable: false,
                    listeners: {
                        beforeexpand: function (nodo, deep, anim) {
                        }
                    }
                },
                listeners: {
                    checkchange: function (nodo, check) {
                        _this.nodocampo = nodo;
                        _this.accionnodo = check;
                        _this.MostrarCamposReporte(nodo, check);
                    }
                },
                loader: new Ext.tree.TreeLoader({
                    singleClickExpand: true,
                    dataUrl: '/planificacion/pdo/plan/index.php/cmpreportes/cargarcamposconfeccionversion',
                    listeners: {
                        'beforeload': function (atreeloader, anode) {
                            atreeloader.baseParams = {
                                idnodo: anode.id,
                                idtiporeporte: _this.idtiporeporteseleccionado,
                                modovisualreporte: _this.recordreporteseleccionado.data.modovisual,
                                idversionreporte: _this.versionReporte
                            };
                        },
                        'load': function (atreeloader, anode) {
                            _this.MostrarCamposReporte(_this.tpcamposreportes.getChecked()[0], true);
                        }
                    }
                })
            });

        //store del grid donde muestro el orden de los campos
        _this.stgOrdencampos = new Ext.data.Store({
            url: '',
            reader: new Ext.data.JsonReader(
                {
                    id: "idcampo"
                },
                [{
                    name: 'idcampo'
                }, {
                    name: 'dencampo'
                }, {
                    name: 'orden'
                }, {
                    name: 'posicion'
                }])
        });
        //modo de seleccion del grid donde muestro el orden de los campos
        _this.smgOrdencampos = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (sm, indiceFila, record) {/*_this.On_RowClickOrdenCampos(sm, indiceFila, record);*/
                }
            }
        });
        //grid donde muestro el orden de los campos
        _this.gOrdencampos = new Ext.grid.EditorGridPanel({
            store: _this.stgOrdencampos,
            //tbar:['-',_this.btnSubirOrden,_this.btnBajarOrden,'-'],
            disabled: true,
            sm: _this.smgOrdencampos,
            columns: [
                _this.smgOrdencampos,
                {
                    header: "Nombre del campo",
                    dataIndex: 'dencampo',
                    width: 200
                }, {
                    header: "Orden",
                    dataIndex: 'orden',
                    width: 50
                }
            ],
            region: 'center',
            title: 'Orden de los campos',
            frame: true,
            clicksToEdit: 1
        });

        //Arbol donde muestro las partes que pueden componer el reporte
        _this.tppartesreportes = new Ext.tree.TreePanel(
            {
                autoScroll: true,
                height: 200,
                region: 'north',
                border: false,
                tbar: ['->',
                    {
                        iconCls: 'expandir',
                        tooltip: 'Expandir agrupaci&oacute;n',
                        handler: function () {
                            _this.tppartesreportes.root.expand(true);
                        }
                    }, {
                        iconCls: 'contraer',
                        tooltip: 'Contraer agrupaci&oacute;n',
                        handler: function () {
                            _this.tppartesreportes.root.collapse(true);
                        }
                    }, {
                        iconCls: 'actualizar',
                        tooltip: 'Refrescar agrupaci&oacute;n',
                        handler: function () {
                            _this.tppartesreportes.root.reload();
                        }
                    }, '-'
                ],
                root: {
                    text: 'Partes a mostrar en la versi&oacute;n del reporte',
                    expanded: false,
                    id: 'nodoraiz',
                    leaf: false,
                    draggable: false
                },
                listeners: {
                    checkchange: function (nodo, check) {
                        if (nodo.id == 7) {
                            if (check) {
                                _this.tpcamposreportes.enable();
                                _this.gOrdencampos.enable();
                            } else {
                                _this.tpcamposreportes.disable();
                                _this.gOrdencampos.disable();
                                _this.tpcamposreportes.root.collapse(true);
                                _this.tpcamposreportes.root.eachChild(function (nodohijo) {
                                    nodohijo.getUI().toggleCheck(false);
                                });
                            }
                        }
                        _this.nodoparte = nodo;
                        _this.accionnodoparte = check;
                        _this.ListarPartes(nodo, check, color = 0);
                    }
                },
                loader: new Ext.tree.TreeLoader({
                    singleClickExpand: true,
                    dataUrl: '/planificacion/pdo/plan/index.php/cmpreportes/cargarpartesconfeccionversion',
                    listeners: {
                        'beforeload': function (atreeloader, anode) {
                            atreeloader.baseParams = {
                                idnodo: anode.id,
                                idtiporeporte: _this.idtiporeporteseleccionado,
                                idversionreporte: _this.versionReporte
                            };
                        },
                        'load': function (atreeloader, anode) {
                            for (var i = 0; i < _this.tppartesreportes.getChecked().length; i++) {
                                var ch = _this.tppartesreportes.getChecked()[i].attributes.checked;
                                var no = _this.tppartesreportes.getChecked()[i];
                                _this.ListarPartes(no, ch, color = 0);
                                if (no.id == 7) {
                                    if (ch) {
                                        _this.tpcamposreportes.enable();
                                        _this.gOrdencampos.enable();
                                    } else {
                                        _this.tpcamposreportes.disable();
                                        _this.gOrdencampos.disable();
                                        _this.tpcamposreportes.root.collapse(true);
                                        _this.tpcamposreportes.root.eachChild(function (nodohijo) {
                                            nodohijo.getUI().toggleCheck(false);
                                        });
                                    }
                                }
                            }
                        }
                    }
                })
            });

        //store del grid donde muestro las partes del reporte
        _this.stgPartescampos = new Ext.data.Store({
            url: '',
            reader: new Ext.data.JsonReader(
                {
                    id: "idparte"
                },
                [{
                    name: 'idparte'
                }, {
                    name: 'denparte'
                }, {
                    name: 'orden'
                }])
        });
        //modo de seleccion del grid donde muestro las partes del reporte
        _this.smgPartescampos = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                }
            }
        });
        //grid donde muestro las partes del reporte
        _this.gPartescampos = new Ext.grid.EditorGridPanel({
            store: _this.stgPartescampos,
            //tbar:['-',_this.btnSubirOrden,_this.btnBajarOrden,'-'],
            sm: _this.smgPartescampos,
            columns: [
                _this.smgPartescampos,
                {
                    header: "Nombre de la parte",
                    dataIndex: 'denparte',
                    width: 200
                }, {
                    header: "Orden",
                    dataIndex: 'orden',
                    width: 50
                }
            ],
            region: 'center',
            title: 'Partes del reporte',
            frame: true,
            clicksToEdit: 1
        });

        //tabpanel donde muestro las partes de los reportes
        this.tpPartes = new Ext.TabPanel({
            activeTab: 0,
            frame: true,
            height: 445,
            items: [
                {
                    xtype: 'panel',
                    id: 'panelDescrip',
                    title: 'Descripci&oacute;n',
                    layout: 'fit',
                    items: [_this.hedescversion]
                }, {
                    xtype: 'panel',
                    id: 'panelPartes',
                    title: 'Partes del reporte',
                    layout: 'border',
                    items: [_this.tppartesreportes, _this.gPartescampos]
                }, {
                    xtype: 'panel',
                    id: 'panelCampos',
                    title: 'Datos del reporte',
                    layout: 'border',
                    items: [_this.tpcamposreportes, _this.gOrdencampos]
                }
            ],
            listeners: {
                tabchange: function (tabpanel, tabseleccionado) {
                    if (tabseleccionado.id == 'panelPartes') {
                        _this.tppartesreportes.root.expand(true);
                    } else if (tabseleccionado.id == 'panelCampos') {
                        if (_this.tpcamposreportes.disabled == false) {
                            _this.tpcamposreportes.root.expand(true);
                        }
                    }
                }
            }
        });

        //formulario para gestionar las versiones del reporte
        _this.fpversionreportes = new Ext.FormPanel(
            {
                labelAlign: 'top',
                frame: true,
                region: 'center',
                rezasible: false,
                items: [_this.tfdenomversion, _this.tpPartes]
            });

        //arreglo de partes del reporte
        _this.arraypartesreporte = [];

        //panel donde muestro vista de la confeccion de la version del reporte
        _this.pvisor = new Ext.Panel({
            title: 'Vista del reporte',
            collapsible: true,
            autoScroll: true,
            width: 540,
            region: 'east'
        });
        _this.pvisor.doLayout();

        this.btnAplicar = new Ext.Button({
            iconCls: 'aplicar',
            id: 'aplicar',
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos',
            handler: function () {
                _this.CrudVersiones(accion, 1);
            }
        });
        //ventana para gestionar las versiones del reporte
        _this.winCrudVersiones = new Ext.Window(
            {
                modal: true,
                closeAction: 'destroy',
                title: accion + ' versi&oacute;n del reporte : ' + _this.tituloreporteseleccionado,
                layout: 'border',
                constrain: true,
                width: 900,
                height: 580,
                keys: [{
                    key: Ext.EventObject.ENTER,
                    fn: function () {
                        _this.CrudVersiones();
                    },
                    scope: this
                }],
                items: [_this.fpversionreportes, _this.pvisor],
                listeners: {
                    destroy: function (win) {
                        _this.versionReporte = null;
                    }
                },
                buttons: [
                    {
                        iconCls: 'cancelar',
                        text: 'Cancelar',
                        tooltip: 'Cerrar ventana sin guardar los datos',
                        handler: function () {
                            _this.winCrudVersiones.destroy();
                        }
                    }, _this.btnAplicar, {
                        iconCls: 'aceptar',
                        id: 'aceptar',
                        text: 'Aceptar',
                        tooltip: 'Guardar datos y cerrar ventana',
                        nextTab: 'tfdenomversion',
                        cls: 'btn-wrap x-btn x-btn-text-icon  x-btn-focus',
                        handler: function () {
                            _this.CrudVersiones(accion);
                        }
                    }
                ]
            });

        _this.winCrudVersiones.show();
        _this.tfdenomversion.focus(false, 1024);
        switch (accion) {
            case 'Adicionar':
                break;
            case 'Modificar':
                _this.btnAplicar.setVisible(false);
                _this.BarraProgreso.show('Cargando datos');
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpreportes/cargarFormVersion',
                    params: {
                        idversionreporte: idversionreporte
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        _this.BarraProgreso.hide();
                        _this.tfdenomversion.setValue(responseData[0].denversion);
                        _this.hedescversion.setValue(responseData[0].descversion);
                        _this.versionReporte = responseData[0].idversionreporte;
                        _this.tpPartes.activate('panelPartes');
                    }
                });
                break;
        }
    };

    this.resetearPartesReportes = function () {
        _this.tppartesreportes.root.reload();
        _this.stgPartescampos.removeAll();
    };
    this.resetearCamposReportes = function () {
        _this.tpcamposreportes.root.reload();
        _this.stgOrdencampos.removeAll();
    };
    this.resetearVistaReporte = function () {
        if (_this.clasificacion)
            _this.pvisor.remove(_this.clasificacion);
        if (_this.aprobadopor)
            _this.pvisor.remove(_this.aprobadopor);
        if (_this.titulo)
            _this.pvisor.remove(_this.titulo);
        if (_this.elaboradopor)
            _this.pvisor.remove(_this.elaboradopor);
        if (_this.actprincipales)
            _this.pvisor.remove(_this.actprincipales);
        if (_this.fiff)
            _this.pvisor.remove(_this.fiff);
        if (_this.tabladedatos)
            _this.pvisor.remove(_this.tabladedatos);
        _this.pvisor.doLayout();
    };

    //funcion donde se procede a obtener y mostrar las partes que conformaran la version del reporte
    this.ListarPartes = function (nodo, check, color) {
        _this.existeparte = 0;
        var parte = {};
        var idparte = nodo.id;
        var arraypartesexistentes = _this.stgPartescampos.getRange();

        if (check == true) {
            switch (nodo.id) {
                case '1':
                    if (_this.clasificacion)
                        _this.clasificacion.destroy();
                    //panel donde muestro la clasificacion del reporte
                    _this.alineacionclasif = 'right';
                    _this.clasificacion = new Ext.Panel({
                        html: '<p align="right">Clasificaci&oacute;n&nbsp;&nbsp;&nbsp;&nbsp;</p>',
                        id: 'parte1',
                        border: false
                    });
                    _this.pvisor.add(_this.clasificacion);
                    break;
                case '2':
                    if (_this.aprobadopor)
                        _this.aprobadopor.destroy();
                    //panel donde muestro el aprobado del reporte
                    _this.aprobadopor = new Ext.Panel({
                        html: '<p align="left">&nbsp;&nbsp;&nbsp;&nbsp;Aprobado por</p>',
                        height: 40,
                        id: 'parte2',
                        border: false
                    });
                    _this.pvisor.add(_this.aprobadopor);
                    break;
                case '3':
                    if (_this.titulo)
                        _this.titulo.destroy();
                    //panel donde muestro el titulo del reporte
                    _this.titulo = new Ext.Panel({
                        html: '<p align="center">T&iacute;tulo</p>',
                        height: 40,
                        id: 'parte3',
                        border: false
                    });
                    _this.pvisor.add(_this.titulo);
                    break;
                case '4':
                    if (_this.elaboradopor)
                        _this.elaboradopor.destroy();
                    //panel donde muestro el elaborado del reporte
                    _this.elaboradopor = new Ext.Panel({
                        html: '<p align="right">Elaborado por&nbsp;&nbsp;&nbsp;&nbsp;</p>',
                        height: 40,
                        id: 'parte4',
                        border: false
                    });
                    _this.pvisor.add(_this.elaboradopor);
                    break;
                case '5':
                    if (_this.actprincipales)
                        _this.actprincipales.destroy();
                    //panel donde muestro las actividades principales del reporte
                    _this.actprincipales = new Ext.Panel({
                        html: '<p align="left">&nbsp;&nbsp;&nbsp;&nbsp;Actividades principales</p>',
                        height: 40,
                        id: 'parte5',
                        border: false
                    });
                    _this.pvisor.add(_this.actprincipales);
                    break;
                case '6':
                    if (_this.fiff)
                        _this.fiff.destroy();
                    //panel donde muestro la fecha del reporte del reporte
                    _this.fiff = new Ext.Panel({
                        html: '<p align="right">Fecha de inicio:    Fecha fin: &nbsp;&nbsp;&nbsp;&nbsp;</p>',
                        height: 20,
                        id: 'parte6',
                        border: false
                    });
                    _this.pvisor.add(_this.fiff);
                    break;
                case '7':
                    if (_this.tabladedatos)
                        _this.tabladedatos.destroy();
                    //grid donde muestro las columnas de datos del reporte
                    _this.tabladedatos = _this.GenerarTabladeDatos('parte7', color);
                    _this.pvisor.add(_this.tabladedatos);
                    break;
            }
            if (arraypartesexistentes.length > 0) {
                for (var i = 0; i < arraypartesexistentes.length; i++) {
                    if (arraypartesexistentes[i].data.idparte == idparte) {
                        _this.existeparte = 1;
                    }
                }
            }
            if (_this.existeparte == 0) {
                parte = {
                    idparte: idparte,
                    denparte: nodo.text
                };
                _this.CargarGridPartesReporte(parte, arraypartesexistentes.length);
            }
        } else {
            var item = Ext.getCmp('parte' + nodo.id);
            _this.pvisor.remove(item);
            for (var i = 0; i < arraypartesexistentes.length; i++) {
                if (arraypartesexistentes[i].data.idparte == idparte) {
                    _this.stgPartescampos.remove(arraypartesexistentes[i]);
                }
            }
            var arraypartesexistentes = _this.stgPartescampos.getRange();
            _this.stgPartescampos.removeAll();
            if (arraypartesexistentes.length > 0) {
                for (var i = 0; i < arraypartesexistentes.length; i++) {
                    var nodo = {};
                    nodo = {
                        id: arraypartesexistentes[i].data.idparte,
                        text: arraypartesexistentes[i].data.denparte
                    };
                    _this.ListarPartes(nodo, true, color);
                }
            }
        }
        _this.pvisor.doLayout();
    };

    //funcion para cargar el grid con las partes seleccionadas que conformaran la version del reporte
    this.CargarGridPartesReporte = function (parte, totalpartes) {
        //conformo el record para el grid
        var TopicRecord = Ext.data.Record.create([
            {
                name: 'idparte'
            }, {
                name: 'denparte'
            }, {
                name: 'orden'
            }
        ]);
        var myNewRecord = new TopicRecord(
            {
                idparte: parte.idparte,
                denparte: parte.denparte,
                orden: totalpartes + 1
            });
        _this.stgPartescampos.add(myNewRecord);
    };

    //funcion para generar la tabla que contiene los campos a mostrar en la version del reporte
    this.GenerarTabladeDatos = function (id, color) {
        if (_this.recordreporteseleccionado.data.modovisual == 'calendario') {
            var arraycolores = ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'];
            if (color == 1) {
                arraycolores = ['#0099FF', '#FF3300', '#FF3300', '#FFCC33', '#0099FF'];
            }
            var html = "<table width='865' height='595' border='1' bordercolor='#000000 align='center'>" +
                " <tr>" +
                "<td width='99' height='30' bgcolor='#CCCCCC'><div align='center'><span class='Estilo2'>Domingo </span></div></td>" +
                "<td width='122' bgcolor='#CCCCCC'><div align='center'><span class='Estilo2'>Lunes</span></div></td>" +
                "<td width='127' bgcolor='#CCCCCC'><div align='center'><span class='Estilo2'>Martes</span></div></td>" +
                "<td width='116' bgcolor='#CCCCCC'><div align='center'><span class='Estilo2'>Mi&eacute;rcoles</span></div></td>" +
                "<td width='116' bgcolor='#CCCCCC'><div align='center'><span class='Estilo2'>Jueves</span></div></td>" +
                "<td width='116' bgcolor='#CCCCCC'><div align='center'><span class='Estilo2'>Viernes</span></div></td>" +
                "<td width='123' bgcolor='#CCCCCC'><div align='center'><span class='Estilo2'>S&aacute;bado</span></div></td>" +
                "</tr>" +
                "<tr>" +
                "<td height='23' bgcolor='#CCCCCC'><div align='right'>1</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>2</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>3</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>4</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>5</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>6</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>7</div></td>" +
                "</tr>" +
                "<tr>" +
                "<td height='73'><div style='background-color:" + arraycolores[0] + "'>Actividad 1 </div>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td><div style='background-color:" + arraycolores[1] + "'>Actividad 2 </div>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "</tr>" +
                "<tr>" +
                "<td height='23' bgcolor='#CCCCCC'><div align='right'>8</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>9</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>10</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>11</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>12</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>13</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>14</div></td>" +
                "</tr>" +
                "<tr>" +
                "<td height='76'>&nbsp;</td>" +
                "<td><div style='background-color:" + arraycolores[2] + "'>Actividad 3 </div><div style='background-color:" + arraycolores[3] + "'>Actividad 4 </div>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td><div style='background-color:" + arraycolores[4] + "'>Actividad 5 </div>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "</tr>" +
                "<tr>" +
                "<td height='23' bgcolor='#CCCCCC'><div align='right'>15</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>16</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>17</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>18</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>19</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>20</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>21</div></td>" +
                "</tr>" +
                "<tr>" +
                "<td height='72'>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "</tr>" +
                "<tr>" +
                "<td height='23' bgcolor='#CCCCCC'><div align='right'>22</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>23</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>24</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>25</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>26</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>27</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>28</div></td>" +
                "</tr>" +
                "<tr>" +
                "<td height='72'>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "</tr>" +
                "<tr>" +
                "<td height='23' bgcolor='#CCCCCC'><div align='right'>29</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>30</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'>31</div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'></div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'></div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'></div></td>" +
                "<td bgcolor='#CCCCCC'><div align='right'></div></td>" +
                "</tr>" +
                "<tr>" +
                "<td height='72'>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "</tr>" +
                "<tr>" +
                "<td height='23' bgcolor='#CCCCCC'>&nbsp;</td>" +
                "<td bgcolor='#CCCCCC'>&nbsp;</td>" +
                "<td bgcolor='#CCCCCC'>&nbsp;</td>" +
                "<td bgcolor='#CCCCCC'>&nbsp;</td>" +
                "<td bgcolor='#CCCCCC'>&nbsp;</td>" +
                "<td bgcolor='#CCCCCC'>&nbsp;</td>" +
                "<td bgcolor='#CCCCCC'>&nbsp;</td>" +
                "</tr>" +
                "<tr>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "<td>&nbsp;</td>" +
                "</tr>" +
                "</table>";

            var tabladatos = new Ext.Panel({
                html: html,
                id: id,
                autoHeight: true,
                autoWidht: true,
                autoScroll: true,
                border: false
            });
        }
        return tabladatos;
    };

    //funcion para actualizar los campos que se desean visualizar en la tabla de datos a mostrar en la version del reporte
    this.MostrarCamposReporte = function (nodo, check) {
        var color1 = 0;
        var color2 = 1;
        _this.existecampo = 0;
        var campo = {};
        var idcampo = nodo.id;
        var arraycamposexistentes = _this.stgOrdencampos.getRange();
        if (check == true) {
            if (arraycamposexistentes.length > 0) {
                for (var i = 0; i < arraycamposexistentes.length; i++) {
                    if (arraycamposexistentes[i].data.idcampo == idcampo) {
                        _this.existecampo = 1;
                    }
                }
            }
            if (_this.existecampo == 0) {
                campo = {
                    idcampo: idcampo,
                    dencampo: nodo.text/*,posicion:nodo.attributes.posicion*/
                };
                _this.CargarGridCamposReporte(campo, arraycamposexistentes.length);
            }
        } else {
            color1 = 1;
            color2 = 0;
            for (var i = 0; i < arraycamposexistentes.length; i++) {
                if (arraycamposexistentes[i].data.idcampo == idcampo) {
                    _this.stgOrdencampos.remove(arraycamposexistentes[i]);
                }
            }
            var arraycamposexistentes = _this.stgOrdencampos.getRange();
            _this.stgOrdencampos.removeAll();
            if (arraycamposexistentes.length > 0) {
                for (var i = 0; i < arraycamposexistentes.length; i++) {
                    var nodo = {};
                    nodo = {
                        id: arraycamposexistentes[i].data.idcampo,
                        text: arraycamposexistentes[i].data.dencampo
                    };
                    _this.MostrarCamposReporte(nodo, true);
                }
            }
        }
        if (_this.recordreporteseleccionado.data.modovisual == 'calendario') {
            var arrayparteschekeadas = _this.stgPartescampos.getRange();
            if (arrayparteschekeadas.length > 0) {
                for (var i = 0; i < arrayparteschekeadas.length; i++) {
                    var idparte = arrayparteschekeadas[i].data.idparte;
                    var nodo = {};
                    nodo = {
                        id: idparte,
                        text: arrayparteschekeadas[i].data.denparte
                    };
                    _this.ListarPartes(nodo, check = false, color1);
                }
                for (var i = 0; i < arrayparteschekeadas.length; i++) {
                    var idparte = arrayparteschekeadas[i].data.idparte;
                    var nodo = {};
                    nodo = {
                        id: idparte,
                        text: arrayparteschekeadas[i].data.denparte
                    };
                    _this.ListarPartes(nodo, check = true, color2);
                }
            }
        }
    };

    //funcion para cargar el grid con los campos o datos que deseo mostrar en la tabla de datos de la version del reporte
    this.CargarGridCamposReporte = function (campo, totalcampos) {
        //conformo el record para el grid
        var TopicRecord = Ext.data.Record.create([
            {
                name: 'idcampo'
            }, {
                name: 'dencampo'
            }, {
                name: 'orden'
            }, {
                name: 'posicion'
            }
        ]);
        var myNewRecord = new TopicRecord(
            {
                idcampo: campo.idcampo,
                dencampo: campo.dencampo,
                orden: totalcampos + 1,
                posicion: campo.posicion
            });
        _this.stgOrdencampos.add(myNewRecord);
    };

    //funcion donde procedo a adicionar las versiones del reporte
    this.CrudVersiones = function (accion, apl) {
        url = 'adicionarversion';
        waitMsg = 'Adicionando versi&oacute;n del reporte';
        postaccion = 'adicionada';
        if (accion == 'Modificar') {
            waitMsg = 'Modificando versi&oacute;n del reporte';
            postaccion = 'modificada';
        }
        if (_this.fpversionreportes.getForm().isValid()) {
            var procede = 0;
            var patron = /[a-zA-Z0-9áéíóúñüÑ]/;
            if (_this.tfdenomversion.getValue().match(patron)) {
                procede = 1;
            }
            if (procede == 1) {
                var arraypartesreporte = _this.ObtenerPartesDelReporte();
                if (arraypartesreporte.length > 0) {
                    _this.BarraProgreso.show(waitMsg);
                    var arraydatosreporte = _this.ObtenerDatosDelReporte();
                    _this.fpversionreportes.getForm().submit({
                        url: '/planificacion/pdo/plan/index.php/cmpreportes/' + url,
                        params: {
                            arraypartesreporte: Ext.encode(arraypartesreporte),
                            arraydatosreporte: Ext.encode(arraydatosreporte),
                            idtiporeporte: _this.idtiporeporteseleccionado,
                            versionReporte: _this.versionReporte
                        },
                        failure: function (form, action) {
                            _this.BarraProgreso.hide();
                            if (action.result.mensaje == 1) {
                                mostrarMensaje(1, 'La versi&oacute;n del reporte ha sido ' + postaccion + ' satisfactoriamente.');
                                if (apl == 1) {
                                    _this.fpversionreportes.getForm().reset();
                                    _this.resetearPartesReportes();
                                    _this.resetearCamposReportes();
                                    _this.resetearVistaReporte();
                                    _this.tpversreporte.root.reload(true);
                                } else {
                                    _this.winCrudVersiones.destroy();
                                    _this.tpversreporte.root.reload(true);
                                }
                            }
                            if (action.result.mensaje == 3) {
                                mostrarMensaje(1, 'La versi&oacute;n del reporte que usted quiere modificar ya no se encuentra en los registros.', function () {
                                    _this.winCrudVersiones.destroy();
                                    _this.tpversreporte.root.reload(true);
                                });
                            }
                        }
                    });
                } else
                    mostrarMensaje(1, 'Para conformar la versi&oacute;n es necesario al menos seleccionar una parte del reporte.');
            } else
                mostrarMensaje(1, 'Por favor verifique que la denominaci&oacute;n no tenga valores incorrectos.');
        } else
            mostrarMensaje(1, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
    };

    //funcion para obtener las partes del reporte
    this.ObtenerPartesDelReporte = function () {
        var arraypartesreporte = [];
        var partesreporteexistentes = _this.stgPartescampos.getRange();
        if (partesreporteexistentes.length > 0) {
            for (var i = 0; i < partesreporteexistentes.length; i++) {
                var parte = {};
                parte = {
                    idparte: partesreporteexistentes[i].data.idparte,
                    orden: partesreporteexistentes[i].data.orden
                };
                arraypartesreporte.push(parte);
            }
        }
        return arraypartesreporte;
    };

    //funcion para obtener los datos del reporte
    this.ObtenerDatosDelReporte = function () {
        var arraydatosreporte = [];
        var datosreporteexistentes = _this.stgOrdencampos.getRange();
        if (datosreporteexistentes.length > 0) {
            for (var i = 0; i < datosreporteexistentes.length; i++) {
                var campo = {};
                campo = {
                    idcampo: datosreporteexistentes[i].data.idcampo,
                    orden: datosreporteexistentes[i].data.orden
                };
                arraydatosreporte.push(campo);
            }
        }
        return arraydatosreporte;
    };



    //funcion para habilitar las condiciones de busqueda
    this.HabilitarCampos = function (id) {
		    _this.fsanomes.show();
		    _this.pcondiciones.enable();
		    _this.fsrangofechas.show();
		    _this.fsanomes.collapse();
		    _this.fsrangofechas.collapse();

        var idreporte = id;

        if (idreporte == '11') {
            _this.fsanomes.expand();
            _this.fsrangofechas.collapse();
            _this.tfanno.reset();
            _this.fechainicial.reset();
            _this.fechafinal.reset();
            _this.cbmeses.clearValue();
        }

        if (idreporte == '15') { //FIP fsera
            _this.fsFIP.show();
            _this.fsTipoFIP.show();
            // _this.fsano.show();
        }

        if (idreporte == '5') {//PLan mensual
            _this.fsrangofechas.hide();
            _this.fsano.hide();
            _this.fsanomes.show();
            _this.fsanomes.getForm().reset();
            _this.fsanomes.expand();
        }

        // else{
		     //    _this.fsanomes.show();
		     //    _this.pcondiciones.enable();
		     //    _this.fsrangofechas.show();
		     //    _this.fsanomes.collapse();
		     //    _this.fsrangofechas.collapse();
        // }

		    if (idreporte == '8') {//Diagrama de coordinacion
				    _this.fsrangofechas.hide();
				    _this.fsanomes.hide();
				    _this.fsano.show();
				    _this.fsano.expand();
		    }

		    if (idreporte == '17') {//Grafico de coordinacion
				    _this.fsrangofechas.hide();
				    _this.fsanomes.hide();
				    _this.fsano.show();
				    _this.fsano.expand();
		    }

		    if (idreporte == '3') { //Listado de actividades
                _this.fsFIP.hide();
                _this.fsTipoFIP.hide();
                _this.fsano.show();
        }



        _this.fechainicial.enable();
        _this.fechafinal.enable();
        _this.cbmeses.enable();
        _this.tfanno.enable();
    };

    //funcion para generar el reporte
    this.GenerarReporte = function (idopcion, opcionesConfigReporte) {
        var idplan = _this.ObtenerFiltroPlan();
        //Cuando se llama desde calendario
        if (opcionesConfigReporte.calendario) {
            _this.versionadoSelecionado = 5;
            _this.idversionreporte = 5;
            _this.tftituloreporte.setValue('Plan mensual');
            _this.idtiporeporteseleccionado = 5;
            _this.tfanno.setValue(opcionesConfigReporte.valueanno);
            _this.cbmeses.setRawValue(opcionesConfigReporte.textomes);
            _this.cbmeses.setValue(opcionesConfigReporte.valuenummeses);
        }
        if (opcionesConfigReporte.reporte) {
            _this.idversionreporte = _this.idtiporeporteseleccionado;
        }
        if (opcionesConfigReporte.planObjetivos == 1) {
            _this.idversionreporte = 3;
            _this.tfclasiificacion.setValue('Limitado');
            _this.tftituloreporte.setValue('Listado de actividades por objetivos por "M&Eacute;TODO DE REDES" ');
            _this.idtiporeporteseleccionado = 3;
            idplan = opcionesConfigReporte.idplan;
        }
        _this.idplan = idplan;

        //primero verifico que se haya seleccionado alguna version del reporte
        if (_this.idversionreporte != 0) {
            var procede = 1;
            switch (_this.idtiporeporteseleccionado) {
                case '1'://Plan de Actividades agrupadas en ARC
                    if (!idplan) {
                        procede = 0;
                        mostrarMensaje(1, 'Debe seleccionar un plan.');
                        _this.mostrarTabPlanes();
                    }
                    break;
                case '2'://Plan de Actividades agrupadas por Objetivos
                    if (!idplan) {
                        procede = 0;
                        mostrarMensaje(1, 'Debe seleccionar un plan.');
                        _this.mostrarTabPlanes();
                    }
                    break;
                case '3'://Listado de Actividades detallado
		                if(_this.versionadoSelecionado==31 || _this.versionadoSelecionado==30 || _this.versionadoSelecionado==40){
				                procede = this.validarReportes(_this.idtiporeporteseleccionado, _this.versionadoSelecionado);
                    }
                    break;
                case '5'://Plan Mensual
                    _this.tfanno.allowBlank = false;
                    _this.cbmeses.allowBlank = false;
                    if (!_this.tfanno.validate() || !_this.cbmeses.validate()) {
                        procede = 0;
                        mostrarMensaje(1, 'Debe seleccionar el año y el mes.');
                        _this.mostrarTabCondicionesBusqueda();
                    }
                    break;
                case '11'://Plan Mensual v2
                    _this.tfanno.allowBlank = false;
                    _this.cbmeses.allowBlank = false;
                    if (!_this.tfanno.validate() || !_this.cbmeses.validate()) {
                        procede = 0;
                        mostrarMensaje(1, 'Debe seleccionar el año y el mes.');
                        _this.mostrarTabCondicionesBusqueda();
                    }
                    break;
                case '6'://Plan-ARC-Objetivos-Actividades
                    if (!idplan) {
                        procede = 0;
                        mostrarMensaje(1, 'Debe seleccionar un plan.');
                        _this.mostrarTabPlanes();
                    }
                    break;
                case '8'://Diagrma de coordinacion
                    if (!_this.tfAno.validate()) {
                        procede = 0;
                        mostrarMensaje(1, 'Debe seleccionar el año.');
                        _this.mostrarTabCondicionesBusqueda();
                    }
                    break;
                case '9'://Reporte cualitativo-cuantitativo
                    var collapseannomes = _this.fsanomes.collapsed;
                    var collapserangofecha = _this.fsrangofechas.collapsed;
                    if (collapseannomes && collapserangofecha) {
                        procede = 0;
                        mostrarMensaje(1, 'Debe seleccionar un año y un mes o un rango de fechas.');
                        _this.mostrarTabCondicionesBusqueda();
                    }
                    if (!collapseannomes) {
                        _this.tfanno.allowBlank = false;
                        _this.cbmeses.allowBlank = false;
                        if (!_this.tfanno.validate() || !_this.cbmeses.validate()) {
                            procede = 0;
                            mostrarMensaje(1, 'Debe seleccionar un año y un mes.');
                            _this.mostrarTabCondicionesBusqueda();
                        }
                    }
                    if (!collapserangofecha) {
                        _this.fechainicial.allowBlank = false;
                        _this.fechafinal.allowBlank = false;
                        if (!_this.fechainicial.validate() || !_this.fechafinal.validate()) {
                            procede = 0;
                            mostrarMensaje(1, 'Debe seleccionar un rango de fechas.');
                            _this.mostrarTabCondicionesBusqueda();
                        }

                    }
                    break;
                case '10'://Reporte resumen de la planificacion
                    _this.tfanno.allowBlank = false;
                    _this.cbmeses.allowBlank = false;
                    if (!_this.tfanno.validate() || !_this.cbmeses.validate()) {
                        procede = 0;
                        mostrarMensaje(1, 'Debe seleccionar el año y el mes.');
                        _this.mostrarTabCondicionesBusqueda();
                    } else {
                        if (!idplan) {
                            procede = 0;
                            mostrarMensaje(1, 'Debe seleccionar un plan.');
                            _this.mostrarTabPlanes();
                        }
                    }

                    break;
		            case '13':
		                if (!idplan) {
				                procede = 0;
				                mostrarMensaje(1, 'Debe seleccionar un plan.');
				                _this.mostrarTabPlanes();
		                }
				        break;
		            case '17'://Grafico de coordinacion
				            if (!_this.tfAno.validate() || _this.tfAno.getValue()=="") {
						            procede = 0;
						            mostrarMensaje(1, 'Debe seleccionar el año.');
						            _this.mostrarTabCondicionesBusqueda();
				            }
				            break;
				        case '16'://caracterizacion del plan
						        if (!idplan && _this.versionadoSelecionado!=52 && _this.versionadoSelecionado!=53) {
								        procede = 0;
								        mostrarMensaje(1, 'Debe seleccionar un plan.');
								        _this.mostrarTabPlanes();
						        }
						        else if(_this.versionadoSelecionado==52 || _this.versionadoSelecionado==53){
								        var collapseannomes = _this.fsanomes.collapsed;
								        var collapserangofecha = _this.fsrangofechas.collapsed;
								        if (collapseannomes && collapserangofecha) {
										        procede = 0;
										        mostrarMensaje(1, 'Debe seleccionar un año y un mes o un rango de fechas.');
										        _this.mostrarTabCondicionesBusqueda();
								        }
								        if (!collapseannomes) {
										        _this.tfanno.allowBlank = false;
										        _this.cbmeses.allowBlank = false;
										        if (!_this.tfanno.validate() || !_this.cbmeses.validate()) {
												        procede = 0;
												        mostrarMensaje(1, 'Debe seleccionar un año y un mes.');
												        _this.mostrarTabCondicionesBusqueda();
										        }
								        }
								        if (!collapserangofecha) {
										        _this.fechainicial.allowBlank = false;
										        _this.fechafinal.allowBlank = false;
										        if (!_this.fechainicial.validate() || !_this.fechafinal.validate()) {
												        procede = 0;
												        mostrarMensaje(1, 'Debe seleccionar un rango de fechas.');
												        _this.mostrarTabCondicionesBusqueda();
										        }

								        }
                    }
				        break;

            }

		        if (_this.tftituloreporte.getValue().trim()=="") {
				        procede = 0;
				        mostrarMensaje(1, 'Debe escribir el t&iacute;tulo del reporte.');
		        }

            if (procede == 1) {
                if (_this.winConfigReporte)
                    _this.winConfigReporte.destroy();

                //store para el combo del formato de los reportes
                _this.scbformatreporte = new Ext.data.SimpleStore({
                    fields: ['idformato', 'nombre'],
                    data: [
                        ["vp", "Vista Previa"],
                        [".doc", "Documento Word"],
                        [".xls", "Documento Excel"]//,
                        //[".pdf", "Documento PDF"]
                    ]
                });
                //combo de formato de los reportes
                _this.cbformatreporte = new Ext.form.ComboBox({
                    id: 'cbformatreporte',
                    name: 'cbformatreporte',
                    value: 'vp',
                    prevTab: 'btnaceptarreporte',
                    fieldLabel: 'Formato del reporte',
                    store: _this.scbformatreporte,
                    displayField: 'nombre',
                    typeAhead: true,
                    allowBlank: false,
                    mode: 'local',
                    forceSelection: true,
                    triggerAction: 'all',
                    hiddenName: 'idformato',
                    valueField: 'idformato',
                    anchor: '90%',
                    emptyText: 'Seleccione',
                    disabled: false,
                    enableKeyEvents: true
                });

                _this.stcbtipoformatoletra = new Ext.data.SimpleStore({
                    fields: ['idtipo', 'nombre'],
                    data: [
                        [1, "Arial"]
                    ]
                });

                _this.cbtipoformatoletra = new Ext.form.ComboBox({
                    id: 'cbtipoformatoletra',
                    name: 'cbtipoformatoletra',
                    value: 'Arial',
                    fieldLabel: 'Tipo de letra del reporte',
                    store: _this.stcbtipoformatoletra,
                    displayField: 'nombre',
                    typeAhead: true,
                    allowBlank: false,
                    mode: 'local',
                    forceSelection: true,
                    triggerAction: 'all',
                    hiddenName: 'idtipo',
                    valueField: 'nombre',
                    anchor: '90%',
                    emptyText: 'Seleccione',
                    disabled: false,
                    enableKeyEvents: true
                });

                _this.stcbtamanoformatoletra = new Ext.data.SimpleStore({
                    fields: ['idotamano', 'nombre'],
                    data: [
                        [1, "8px"],
                        [2, "9px"],
                        [3, "10px"],
                        [4, "11px"],
                        [5, "12px"],
                        [6, "13px"],
                        [7, "14px"],
                        [8, "15px"]
                    ]
                });

                _this.cbtamanoformatoletra = new Ext.form.ComboBox({
                    id: 'cbtamanoformatoletra',
                    name: 'cbtamanoformatoletra',
                    value: '12px',
                    fieldLabel: 'Tamaño de letra del reporte',
                    store: _this.stcbtamanoformatoletra,
                    displayField: 'nombre',
                    typeAhead: true,
                    allowBlank: false,
                    mode: 'local',
                    forceSelection: true,
                    triggerAction: 'all',
                    hiddenName: 'idotamano',
                    valueField: 'nombre',
                    anchor: '90%',
                    emptyText: 'Seleccione',
                    disabled: false,
                    enableKeyEvents: true
                });

                //store para el combo de la orientacion del reporte
                _this.scborientacionh = new Ext.data.SimpleStore({
                    fields: ['idorientacion', 'nombre'],
                    data: [
                        [1, "Vertical"],
                        [2, "Horizontal"]
                    ]
                });
                //combo de la orientacion del reporte
                _this.cborientacionh = new Ext.form.ComboBox({
                    id: 'cborientacionh',
                    name: 'cborientacionh',
                    value: 2,
                    fieldLabel: 'Orientación de la hoja',
                    store: _this.scborientacionh,
                    displayField: 'nombre',
                    typeAhead: true,
                    mode: 'local',
                    forceSelection: true,
                    allowBlank: false,
                    triggerAction: 'all',
                    hiddenName: 'idorientacion',
                    valueField: 'idorientacion',
                    anchor: '90%',
                    emptyText: 'Seleccione',
                    disabled: false,
                    enableKeyEvents: true,
                    listeners: {
                        select: function (combo, record, index) {
                            Ext.getCmp('fsvistadoc').remove(_this.arrayobjreporte[0]);
                            _this.arrayobjreporte = [];
                            var formato = _this.cbformatreporte.getValue();
                            _this.orientacion = _this.cborientacionh.getValue();
                            _this.anchohoja = '';
                            if (_this.cbtipohoja.getValue()) {
                                var valor = _this.cbtipohoja.getValue();
                                _this.anchohoja = _this.stcbtipohoja.getById(valor).data.ancho;
                            }
                            _this.altohoja = '';
                            if (_this.cbtipohoja.getValue()) {
                                var valor = _this.cbtipohoja.getValue();
                                _this.altohoja = _this.stcbtipohoja.getById(valor).data.alto;
                            }
                            var htmlvistadoc = _this.ObtenerImgVistaDoc(formato, _this.orientacion, _this.anchohoja, _this.altohoja);
                            var pvistapreviadoc = new Ext.Panel({
                                id: 'pvistadoc',
                                frame: false,
                                layout: 'fit',
                                width: 218,
                                html: htmlvistadoc,
                                height: 245
                            });
                            Ext.getCmp('fsvistadoc').add(pvistapreviadoc);
                            Ext.getCmp('fsvistadoc').doLayout();
                        }
                    }
                });

                //store del combo tipo de hojas
                _this.stcbtipohoja = new Ext.data.Store({
                    url: '/planificacion/pdo/plan/index.php/cmpreportes/cargartipohojas',
                    listeners: {
                        load: function (store, records, options) {
                            _this.cbtipohoja.setValue(records[0].id);
                        }
                    },
                    reader: new Ext.data.JsonReader({
                        id: 'idtipohoja',
                        root: "data"
                    }, [{
                        name: 'idtipohoja'
                    }, {
                        name: 'denominacion'
                    }, {
                        name: 'ancho'
                    }, {
                        name: 'alto'
                    }])
                });
                //combo tipo de hojas
                _this.cbtipohoja = new Ext.form.ComboBox({
                    id: 'cbtipohoja',
                    emptyText: 'Seleccione',
                    fieldLabel: 'Tipo de hoja a imprimir',
                    store: _this.stcbtipohoja,
                    hiddenName: 'idtipohoja',
                    valueField: 'idtipohoja',
                    displayField: 'denominacion',
                    triggerAction: 'all',
                    allowBlank: true,
                    editable: true,
                    loadingText: 'Cargando datos',
                    forceSelection: true,
                    mode: 'local',
                    anchor: '90%',
                    listeners: {
                        expand: function (combo) {
                            _this.stcbtipohoja.reload();
                        },
                        select: function (combo, record, index) {
                            Ext.getCmp('fsvistadoc').remove(_this.arrayobjreporte[0]);
                            _this.arrayobjreporte = [];
                            var formato = _this.cbformatreporte.getValue();
                            _this.orientacion = _this.cborientacionh.getValue();
                            _this.anchohoja = '';
                            if (_this.cbtipohoja.getValue()) {
                                var valor = _this.cbtipohoja.getValue();
                                _this.anchohoja = _this.stcbtipohoja.getById(valor).data.ancho;
                            }
                            _this.altohoja = '';
                            if (_this.cbtipohoja.getValue()) {
                                var valor = _this.cbtipohoja.getValue();
                                _this.altohoja = _this.stcbtipohoja.getById(valor).data.alto;
                            }
                            var htmlvistadoc = _this.ObtenerImgVistaDoc(formato, _this.orientacion, _this.anchohoja, _this.altohoja);
                            var pvistapreviadoc = new Ext.Panel({
                                id: 'pvistadoc',
                                frame: false,
                                layout: 'fit',
                                width: 218,
                                html: htmlvistadoc,
                                height: 245
                            });
                            Ext.getCmp('fsvistadoc').add(pvistapreviadoc);
                            Ext.getCmp('fsvistadoc').doLayout();
                        }
                    }
                });

                _this.fpConfigReporte = new Ext.FormPanel({
                    id: 'fpConfigReporte',
                    frame: false,
                    border: false,
                    rezisable: false,
                    region: "center",
                    labelAlign: 'top',
                    width: 500,
                    height: 360,
                    items: [
                        {
                            layout: 'column',
                            border: false,
                            items: [
                                {
                                    columnWidth: 0.5,
                                    border: false,
                                    layout: 'form',
                                    labelAlign: 'top',
                                    items: [
                                        {
                                            xtype: 'fieldset',
                                            title: 'Configuración del reporte',
                                            frame: false,
                                            layout: 'form',
                                            width: 240,
                                            height: 290,
                                            items: [_this.cbformatreporte, _this.cbtipohoja, _this.cborientacionh,
                                                _this.cbtipoformatoletra, _this.cbtamanoformatoletra]
                                        }
                                    ]
                                }, {
                                    columnWidth: 0.5,
                                    border: false,
                                    layout: 'form',
                                    labelAlign: 'top',
                                    items: [
                                        {
                                            xtype: 'fieldset',
                                            id: 'fsvistadoc',
                                            title: 'Vista',
                                            frame: false,
                                            layout: 'form',
                                            width: 240,
                                            height: 290
                                        }
                                    ]
                                }
                            ]
                        }]
                });

                //construyo la imagen por defecto del reporte
                var formato = _this.cbformatreporte.getValue();
                _this.orientacion = _this.cborientacionh.getValue();
                _this.anchohoja = '';
                _this.altohoja = '';
                var htmlvistadoc = _this.ObtenerImgVistaDoc(formato, _this.orientacion, _this.anchohoja, _this.altohoja);
                var pvistapreviadoc = new Ext.Panel({
                    id: 'pvistadoc',
                    frame: false,
                    layout: 'fit',
                    width: 218,
                    html: htmlvistadoc,
                    height: 190
                });
                _this.arrayobjreporte.push(pvistapreviadoc);
                Ext.getCmp('fsvistadoc').add(pvistapreviadoc);

                _this.winConfigReporte = new Ext.Window({
                    id: 'winConfigReporte',
                    title: "Generar reporte",
                    width: 500,
                    height: 360,
                    draggable: true,
                    resizable: false,
                    modal: true,
                    constrain: true,
                    layout: 'border',
                    closeAction: 'destroy',
                    items: [_this.fpConfigReporte],
                    buttons: [
                        new Ext.Button({
                            text: 'Cancelar',
                            tooltip: 'Cerrar ventana sin guardar los datos',
                            iconCls: 'cancelar',
                            handler: function () {
                                _this.winConfigReporte.destroy();
                            }
                        }),
                        new Ext.Button({
                            id: 'btnaceptarreporte',
                            nextTab: 'cbformatreporte',
                            text: 'Aceptar',
                            tooltip: 'Guardar datos y  cerrar ventana',
                            iconCls: 'aceptar',
                            handler: function () {
                                formato = _this.cbformatreporte.getValue();
                                _this.VisualizarReporte(formato);
                                _this.winConfigReporte.destroy();
                            }
                        })
                    ]
                });
                _this.stcbtipohoja.reload();
                _this.winConfigReporte.show();
                _this.cbformatreporte.focus(false, 1024)
            }
        } else {
            mostrarMensaje(1, 'Debe seleccionar una versi&oacute;n del reporte.');
        }
    };

    //funcion para visualizar el reporte
    this.VisualizarReporte = function (formato) {
        if (_this.fpConfigReporte.getForm().isValid()) {
            switch (formato) {
                case 'vp':
                    var mensaje = 'Generando vista previa';
                    break;
                default:
                    var mensaje = 'Generando documento';
            }
            _this.BarraProgreso.show(mensaje);
            var anno = _this.tfanno.getValue();
            var ano = _this.tfAno.getValue();
            if(ano!="")
                anno=ano;

            var nummes = _this.cbmeses.getValue();
            var textomes = _this.cbmeses.getRawValue();
            var fechainicio = _this.fechainicial.getValue();
            var fechafin = _this.fechafinal.getValue();
            _this.arrayidnomencladores = [];
            _this.ObtenerFiltroCategorias();
            _this.ObtenerFiltroTipos();
            _this.ObtenerFiltroTipoFIP();
            var idplan = _this.idplan;//_this.ObtenerFiltroPlan();
            var arrayautores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
            var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
            var confidencialidad = '"'+_this.tfclasiificacion.getValue()+'"';
            var tituloreporte = _this.tftituloreporte.getValue();
            var tipoletra = _this.cbtipoformatoletra.getValue();
            var tamanoletra = _this.cbtamanoformatoletra.getValue();
            Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmpreportes/obtenerreporte',
                params: {
                    anchohoja: _this.anchohoja,
                    altohoja: _this.altohoja,
                    orientacionhoja: _this.orientacion,
                    valueanno: anno,
                    ano: ano,
                    valuenummeses: nummes,
                    valuetextomeses: textomes,
                    valuefi: Ext.encode(fechainicio),
                    valueff: Ext.encode(fechafin),
                    idplan: idplan,
                    idtiporeporte: _this.idtiporeporteseleccionado,
                    idversionreporte: _this.idversionreporte,
                    versionadoSelecionado: _this.versionadoSelecionado,
                    confidencialidad: confidencialidad,
                    tituloreporte: tituloreporte,
                    arrayautores: Ext.encode(arrayautores),
                    arrayinvol: Ext.encode(arrayinvolucrados),
                    arrayidnom: Ext.encode(_this.arrayidnomencladores),
                    idopcion: formato, //idopcion
                    tipoletra: tipoletra,
                    tamanoletra: tamanoletra,
                    fipcumplido: Ext.getCmp('rbFipCump').getValue(),
                    idtipofip: _this.cbbtipo.getValue(),
                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    if (formato == 'vp') {
                        var cuerporeporte = Ext.decode(response.responseText);
                        var winreporte = window.open('', '', 'scrollbars = yes,toolbar = yes,location = yes,resizable = yes, menubar = yes, status = yes');
                        winreporte.document.write("<HTML><HEAD><TITLE>Vista previa del reporte</TITLE></HEAD><BODY>" + cuerporeporte + "</BODY></HTML>");
                        winreporte.document.close();
                    } else {
                        var tituloarchivo = Ext.decode(response.responseText);
                        window.open('../../resources/descargas/' + tituloarchivo);
                    }
                }
            });
        } else {
            mostrarMensaje(1, 'Por favor verifique que hay campo(s) vac&iacute;o(s).');
        }
    };

    this.DeshabilitarMenuPagReporte = function (e) {
        e.stopEvent();
    };


    //funcion para obtener las categorias seleccionadas
    this.ObtenerFiltroCategorias = function () {
        var arraycategact = _this.smtgcategact.getSelections();
        var totalreccategact = arraycategact.length;
        for (var i = 0; i < totalreccategact; i++) {
            var nodo = {
                idnom: arraycategact[i].data.idnom
            };
            _this.arrayidnomencladores.push(nodo);
            if (arraycategact[i].data._is_leaf == false) {
                _this.sttgcategact.each(function (record) {
                    if (record.data._parent == arraycategact[i].data.idnom) {
                        nodo = {
                            idnom: record.data.idnom
                        };
                        _this.arrayidnomencladores.push(nodo);
                    }
                });
            }
        }
    };

    //funcion para obtener los tipos seleccionados
    this.ObtenerFiltroTipos = function () {
        var arraytipoact = _this.smtgtipoact.getSelections();
        var totalrectipoact = arraytipoact.length;
        for (var i = 0; i < totalrectipoact; i++) {
            var nodo = {
                idnom: arraytipoact[i].data.idnom
            };
            _this.arrayidnomencladores.push(nodo);
            if (arraytipoact[i].data._is_leaf == false) {
                _this.sttgtipoact.each(function (record) {
                    if (record.data._parent == arraytipoact[i].data.idnom) {
                        nodo = {
                            idnom: record.data.idnom
                        };
                        _this.arrayidnomencladores.push(nodo);
                    }
                });
            }
        }
    };

		//funcion para obtener los tipos FIP
		this.ObtenerFiltroTipoFIP = function () {
				var arraytipofip = _this.smtgtipofip.getSelections();
				var totalrectipofip = arraytipofip.length;
				for (var i = 0; i < totalrectipofip; i++) {
						var nodo = {
								idnom: arraytipofip[i].data.idnom
						};
						_this.arrayidnomencladores.push(nodo);
						if (arraytipofip[i].data._is_leaf == false) {
								_this.sttgtipofip.each(function (record) {
										if (record.data._parent == arraytipofip[i].data.idnom) {
												nodo = {
														idnom: record.data.idnom
												};
												_this.arrayidnomencladores.push(nodo);
										}
								});
						}
				}
		};

    //funcion para obtener el plan seleccionado
    this.ObtenerFiltroPlan = function () {

        var arrayplanesseleccionados = [];
        if (!opcionesConfig.excluirPlan) {
            arrayplanesseleccionados = _this.objCmpPlan.smTGCmpPlan.getSelections();
        }

        if (arrayplanesseleccionados.length > 0) {
            var idplan = arrayplanesseleccionados[0].data.idelemento;
            return idplan;
        }
    };

    //funcion donde se crea la ventana con el formulario con la configuracion del encabezado y pie de firma
    this.CrearVentanaConfiguracion = function () {
        if (_this.winConfiguracion)
            _this.winConfiguracion.destroy();

        _this.tfcargoapro = new Ext.form.TextField({
            id: 'cargoaprueba',
            fieldLabel: 'Cargo',
            // regex: /^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/,
            // maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ ])$/,
            regexText: 'Solo admite caracteres alfanuméricos.',
            maxLength: 100,
            vtype: 'validarEspaciosEnBlanco',
            prevTab: 'acepConf',
            maxLengthText: 'El tamaño máximo requerido es 50 caracteres.',
            name: 'cargoaprueba',
            width: 200,
            listeners: {
                'render': function (c) {
                    c.getEl().on('keyup', function () {
                        if (_this.valoresIniciales.cargoAprob !== c.getValue().toString()) {
                            _this.mod.cargoAprob = true;
                        } else {
                            _this.mod.cargoAprob = false;
                        }
                    }, c);
                }
            }
        });

        _this.tfgradoapro = new Ext.form.TextField({
            id: 'gradoaprueba',
            // regex: /^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/,
            // maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ ])$/,
            // regexText: 'Solo admite caracteres alfanuméricos.',
            maxLength: 100,
            vtype: 'validarEspaciosEnBlanco',
            maxLengthText: 'El tamaño máximo requerido es 50 caracteres.',
            fieldLabel: 'Grado',
            name: 'gradoaprueba',
            width: 200,
            listeners: {
                'render': function (c) {
                    c.getEl().on('keyup', function () {
                        if (_this.valoresIniciales.gradoAprob !== c.getValue().toString()) {
                            _this.mod.gradoAprob = true;
                        } else {
                            _this.mod.gradoAprob = false;
                        }
                    }, c);
                }
            }
        });

        _this.tfnombreapro = new Ext.form.TextField({
            id: 'nombreaprueba',
            fieldLabel: 'Nombre',
            // regex: /^([a-zA-ZáéíóúñüÑ ]+ ?[a-zA-ZáéíóúñüÑ ]*)+$/,
            // maskRe: /^([a-zA-ZáéíóúüÁÉÍÓÚñÑÜ ])$/,
            // regexText: 'Solo admite letras.',
            maxLength: 100,
            allowBlank: false,
            vtype: 'validarEspaciosEnBlanco',
            maxLengthText: 'El tamaño máximo requerido es 50 caracteres.',
            name: 'nombreaprueba',
            width: 200,
            listeners: {
                'render': function (c) {
                    c.getEl().on('keyup', function () {
                        if (_this.valoresIniciales.nombreAprob !== c.getValue().toString()) {
                            _this.mod.nombreAprob = true;
                        } else {
                            _this.mod.nombreAprob = false;
                        }
                    }, c);
                }
            }
        });

        _this.tfcargoelab = new Ext.form.TextField({
            id: 'cargoelabora',
            fieldLabel: 'Cargo',
            // regex: /^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/,
            // maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ ])$/,
            // regexText: 'Solo admite caracteres alfanuméricos.',
            maxLength: 100,
            vtype: 'validarEspaciosEnBlanco',
            maxLengthText: 'El tamaño máximo requerido es 50 caracteres.',
            name: 'cargoelabora',
            width: 200,
            listeners: {
                'render': function (c) {
                    c.getEl().on('keyup', function () {
                        if (_this.valoresIniciales.cargoElab !== c.getValue().toString()) {
                            _this.mod.cargoElab = true;
                        } else {
                            _this.mod.cargoElab = false;
                        }
                    }, c);
                }
            }
        });

        _this.tfgradoelab = new Ext.form.TextField({
            id: 'gradoelabora',
            fieldLabel: 'Grado',
            regex: /^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/,
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ ])$/,
            regexText: 'Solo admite caracteres alfanuméricos.',
            maxLength: 50,
            vtype: 'validarEspaciosEnBlanco',
            maxLengthText: 'El tamaño máximo requerido es 50 caracteres.',
            name: 'gradoelabora',
            width: 200,
            listeners: {
                'render': function (c) {
                    c.getEl().on('keyup', function () {
                        if (_this.valoresIniciales.gradoElab !== c.getValue().toString()) {
                            _this.mod.gradoElab = true;
                        } else {
                            _this.mod.gradoElab = false;
                        }
                    }, c);
                }
            }
        });

        _this.tfnombreelab = new Ext.form.TextField({
            id: 'nombrelabora',
            fieldLabel: 'Nombre',
            // regex: /^([a-zA-ZáéíóúñüÑ ]+ ?[a-zA-ZáéíóúñüÑ ]*)+$/,
            // maskRe: /^([a-zA-ZáéíóúüÁÉÍÓÚñÑÜ ])$/,
            // regexText: 'Solo admite letras.',
            maxLength: 100,
            //allowBlank: false,
            vtype: 'validarEspaciosEnBlanco',
            maxLengthText: 'El tamaño máximo requerido es 50 caracteres.',
            name: 'nombrelabora',
            width: 200,
            listeners: {
                'render': function (c) {
                    c.getEl().on('keyup', function () {
                        if (_this.valoresIniciales.nombreElab !== c.getValue().toString()) {
                            _this.mod.nombreElab = true;
                        } else {
                            _this.mod.nombreElab = false;
                        }
                    }, c);
                }
            }
        });


        _this.fpConfiguracion = new Ext.FormPanel({
            id: 'fpConfiguracion',
            frame: true,
            border: false,
            rezisable: false,
            labelAlign: 'top',
            width: 500,
            height: 300,
            items: [
                {
                    layout: 'column',
                    border: false,
                    items: [
                        {
                            columnWidth: .5,
                            border: false,
                            layout: 'form',
                            labelAlign: 'top',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    title: 'Aprobado por:',
                                    frame: false,
                                    layout: 'form',
                                    width: 230,
                                    height: 180,
                                    items: [_this.tfcargoapro, _this.tfgradoapro, _this.tfnombreapro]
                                }
                            ]
                        }, {
                            columnWidth: .5,
                            border: false,
                            layout: 'form',
                            labelAlign: 'top',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    title: 'Elaborado por:',
                                    frame: false,
                                    layout: 'form',
                                    width: 230,
                                    height: 180,
                                    items: [_this.tfcargoelab, _this.tfgradoelab, _this.tfnombreelab]
                                }
                            ]
                        }
                    ]
                }
            ],
            listeners: {
                'clientvalidation': function (fm, valid) {
                    if (_this.mod.cargoAprob
                        || _this.mod.gradoAprob
                        || _this.mod.nombreAprob
                        || _this.mod.cargoElab
                        || _this.mod.gradoElab
                        || _this.mod.nombreElab) {
                        Ext.getCmp('acepConf').enable();

                    } else {
                        Ext.getCmp('acepConf').disable();
                    }
                }
            }
        });

        _this.winConfiguracion = new Ext.Window({
            id: 'winConfiguracion',
            title: 'Datos de encabezado/pie de firma',
            width: 500,
            height: 260,
            resizable: false,
            constrain: true,
            closeAction: 'hide',
            modal: true,
            items: _this.fpConfiguracion,
            buttons: [
                new Ext.Button({
                    text: 'Cancelar',
                    tooltip: 'Cerrar ventana sin guardar los datos',
                    id: 'cancelConf',
                    nextTab: 'acepConf',
                    iconCls: 'cancelar',
                    handler: function () {
                        _this.winConfiguracion.destroy();
                    }
                }),
                new Ext.Button({
                    text: 'Aceptar ',
                    tooltip: 'Guardar datos y  cerrar ventana',
                    id: 'acepConf',
                    nextTab: 'cargoaprueba',
                    prevTab: 'cancelConf',
                    disabled: true,
                    cls: 'btn-wrap x-btn x-btn-text-icon  x-btn-focus',
                    iconCls: 'aceptar ',
                    handler: function () {
                        _this.CrearConfiguracion();
                    }
                })
            ]
        });
		    _this.getDatosEncabezadoPieFirma();
        _this.winConfiguracion.show();
        _this.tfcargoapro.focus(false, 1024);
        /*_this.fpConfiguracion.getForm().load({
         success: function () {
         },
         waitMsg: 'Cargando configuraci&oacute;n',
         url: '/planificacion/pdo/plan/index.php/cmpreportes/cargarconfiguracion'
         });*/
    };

    this.getDatosEncabezadoPieFirma = function () {
		    _this.BarraProgreso.show('Cargando configuraci&oacute;n');
		    Ext.Ajax.request({
				    url: '/planificacion/pdo/plan/index.php/cmpreportes/cargarconfiguracion',
				    callback: function (options, success, response) {
						    _this.BarraProgreso.hide();
						    var responseData = Ext.decode(response.responseText);
						    var informacion= Ext.decode(responseData.data);
						    _this.tfcargoapro.setValue(informacion.cargoaprueba);
						    _this.tfgradoapro.setValue(informacion.gradoaprueba);
						    _this.tfnombreapro.setValue(informacion.nombreaprueba);
						    _this.tfcargoelab.setValue(informacion.cargoelabora);
						    _this.tfgradoelab.setValue(informacion.gradoelabora);
						    _this.tfnombreelab.setValue(informacion.nombrelabora);

						    _this.valoresIniciales.cargoAprob = informacion.cargoaprueba;
						    _this.valoresIniciales.gradoAprob = informacion.gradoaprueba;
						    _this.valoresIniciales.nombreAprob = informacion.nombreaprueba;
						    _this.valoresIniciales.cargoElab = informacion.cargoelabora;
						    _this.valoresIniciales.gradoElab = informacion.gradoelabora;
						    _this.valoresIniciales.nombreElab = informacion.nombrelabora;
				    }
		    });
    };

    //funcion para adicionar la configuracion del encabezado y pie de pagina
    this.CrearConfiguracion = function () {
        var cargoaprueba = _this.tfcargoapro.getValue();
        var gradoaprueba = _this.tfgradoapro.getValue();
        var nombreaprueba = _this.tfnombreapro.getValue();

        var cargoelabora = _this.tfcargoelab.getValue();
        var gradoelabora = _this.tfgradoelab.getValue();
        var nombreelabora = _this.tfnombreelab.getValue();

        _this.BarraProgreso.show('Configurando encabezado y pie de p&aacute;gina');
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpreportes/configurarfirma',
            method: 'POST',
            params: {
                cargoaprueba: cargoaprueba,
                gradoaprueba: gradoaprueba,
                nombreaprueba: nombreaprueba,
                cargoelabora: cargoelabora,
                gradoelabora: gradoelabora,
                nombreelabora: nombreelabora
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                mostrarMensaje(1, 'La configuraci&oacute;n ha sido guardada satisfactoriamente.');
                _this.winConfiguracion.destroy();
            }
        });
    };

    //funcion donde procedo a adicionar las versiones del reporte
    this.EliminarVersiones = function (idversion) {
        mostrarMensaje(2, '¿Est&aacute; seguro que quiere eliminar la versi&oacute;n seleccionada?', function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show('Eliminando versi&oacute;n');
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpreportes/eliminarversion',
                    params: {
                        idversion: idversion
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 0) {
                            mostrarMensaje(1, 'La versi&oacute;n que usted quiere eliminar ya no se encuentra en los registros.', function () {
                                _this.tpversreporte.root.reload(true);
                                if (_this.arrayitemspComp.length > 0) {
                                    for (var i = 0; i < _this.arrayitemspComp.length; i++) {
                                        _this.pcomposicreporte.remove(_this.arrayitemspComp[i]);
                                    }
                                }
                            });
                        }
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, 'La versi&oacute;n ha sido eliminada satisfactoriamente.');
                            _this.tpversreporte.root.reload(true);
                            if (_this.arrayitemspComp.length > 0) {
                                for (var i = 0; i < _this.arrayitemspComp.length; i++) {
                                    _this.pcomposicreporte.remove(_this.arrayitemspComp[i]);
                                }
                            }
                        }
                    }
                });
            }
        });
    };

    //funcion para limpiar los filtros
    this.LimpiarFiltros = function () {


        //this.tpAutoresInvolucrados = _this.objclasificadorinvol.CrearClasificadorInvolBusqueda(tipoelemento = 3, 2);
        //_this.tpAutoresInvolucrados.limpiarFiltro()
        //_this.tpAutoresInvolucrados.tfbuscarInvBusqueda.reset();

        if (_this.cbmeses.rendered)
            _this.cbmeses.clearValue();
        if (_this.tfanno.rendered)
            _this.tfanno.reset();
		    if (_this.tfAno.rendered)
				    _this.tfAno.reset();
        if (_this.fechainicial.rendered)
            _this.fechainicial.reset();
        if (_this.fechafinal.rendered)
            _this.fechafinal.reset();
        if (_this.smtgcategact.hasSelection())
            _this.smtgcategact.clearSelections();
        if (_this.smtgtipoact.hasSelection())
            _this.smtgtipoact.clearSelections();
        if (_this.objCmpPlan.smTGCmpPlan.hasSelection())
            _this.objCmpPlan.smTGCmpPlan.clearSelections();
        //Autores invol
        _this.objclasificadorinvol.limpiarParaReportes();
    };

    function Cent(val) {
        if (val) {
            return '<b>' + val + '</b>';
        }
    }

    this.ObtenerImgVistaDoc = function (formato, orientacion, ancho, alto) {
        var imgname = "img_doc_previa";
        if (orientacion == '2') {
            var temp = ancho;
            _this.anchohoja = alto;
            _this.altohoja = temp;
            imgname = "img_doc_previa_horizontal";
        }
        var html = "<center><div style='width:auto;height:auto;position:relative;float:center'>" +
            "<div style='width:18px;height:160px;position:relative;float:left;margin-top:70px;margin-left:5px;'><b>" + _this.altohoja + "</b></div>" +
            "<div style='width:190px;height:160px;position:relative;float:left'><img src='../../../comun/recursos/images/" + imgname + ".png'></img></div>" +
            "<div style='width:150px;height:20px;position:relative;float:left;margin-left:5px;'><b>" + _this.anchohoja + "</b></div>" +
            "</div></center>";
        return html;
    };

    this.mostrarTabPlanes = function () {
        _this.tpcondicionales.setActiveTab(_this.pfiltroactivades);
        _this.pfiltroactivades.activeItem = 1;
        _this.pconopciones.setActiveTab(_this.pplanes);
    };

    this.mostrarTabCondicionesBusqueda = function () {
        _this.tpcondicionales.setActiveTab(_this.pfiltroactivades);
        _this.pfiltroactivades.activeItem = 0;
        _this.pcondiciones.activeItem = 0;
    };

		this.validarReportes = function (idreporte, idversion) {
		    var procede=1;
				_this.versionadoSelecionado = idversion;
				_this.idversionreporte = idversion;
				_this.idtiporeporteseleccionado = idreporte;

				_this.tpcondicionales.setActiveTab(_this.pfiltroactivades);
				_this.pfiltroactivades.activeItem = 0;
				_this.pcondiciones.activeItem = 0;

		    if(idreporte=='3' && idversion==31){
				    _this.tftituloreporte.setValue('Listado de actividades con todos los campos');
				    _this.fechainicial.allowBlank = false;
				    _this.fechafinal.allowBlank = false;
				    if (!_this.fechainicial.validate() || !_this.fechafinal.validate()) {
						    procede = 0;
						    mostrarMensaje(1, 'Debe seleccionar un rango de fechas.');

						    _this.fechainicial.reset();
						    _this.fechafinal.reset();

						    _this.fechainicial.markInvalid('Este campo es obligatorio.');
						    _this.fechafinal.markInvalid('Este campo es obligatorio.');

						    _this.fsanomes.hide();
						    _this.pcondiciones.enable();
						    _this.fsrangofechas.show();
						    _this.fsrangofechas.expand();

				    }else{
						    _this.fsanomes.hide();
						    _this.pcondiciones.enable();
						    _this.fsrangofechas.show();
						    _this.fsrangofechas.expand();
            }
        }
				if(idreporte=='3' && (idversion==30 || idversion==40)){
						//_this.tftituloreporte.setValue('PLAN DE TRABAJO MENSUAL PARA EL MES DE');
						_this.tfanno.allowBlank = false;
						_this.cbmeses.allowBlank = false;
						if (!_this.tfanno.validate() || !_this.cbmeses.validate()) {
								procede = 0;
								mostrarMensaje(1, 'Debe seleccionar un año y un mes.');

								_this.fsrangofechas.hide();
								_this.fsanomes.show();
								_this.fsanomes.expand();

								_this.tfanno.markInvalid('Este campo es obligatorio.');
								_this.cbmeses.markInvalid('Este campo es obligatorio.');

								_this.tfanno.reset();
								_this.cbmeses.clearValue();

						}
						else{
								_this.fsrangofechas.hide();
								_this.pcondiciones.enable();
								_this.fsanomes.show();
								_this.fsanomes.expand();
						}
				}
        return procede;
		};

    this.validarCamposFechas = function (idreporte) {
        if (idreporte == 5 || idreporte == 9 || idreporte == 10 || idreporte == 11) {
            _this.tfanno.allowBlank = false;
            _this.cbmeses.allowBlank = false;
            if (idreporte == 9) {
                _this.fechainicial.allowBlank = false;
                _this.fechafinal.allowBlank = false;
            }
        } else if (idreporte == 8) {
            _this.tfAno.allowBlank = false;
        }else if (idreporte == 17) {
		        _this.tfAno.allowBlank = false;
        }
        else {
            _this.tfanno.allowBlank = true;
            _this.cbmeses.allowBlank = true;
            _this.fechainicial.allowBlank = true;
            _this.fechafinal.allowBlank = true;
            _this.tfAno.allowBlank = true;
        }
        _this.tfanno.validate();
        _this.cbmeses.validate();
        _this.fechainicial.validate();
        _this.fechafinal.validate();
        _this.tfAno.validate();
    };
};
