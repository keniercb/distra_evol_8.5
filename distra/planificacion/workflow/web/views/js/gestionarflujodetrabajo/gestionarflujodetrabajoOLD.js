var perfil = window.parent.UCID.portal.perfil
Ext.QuickTips.init();
Ext.Ajax.timeout = 6000000;
var validar = 0;
var arreglodetransicionesasociadas = [0], arreglodetransicionesdesasociadas = [0], idtransicionparacancelar = '';
var btnAddTrans, btnEliTrans, btnModTrans, btnPanelBusqueda, btnBusquedaSimple, btnLimpiarBS, btnAyuda;
var stGTransiciones, smGTransiciones, GTransiciones, pfiltroAutorTransc;
var pPirncipal, vpTransiciones;
var prevrow = -1, contador = 0;
var start = 0;
var limit = 15;
var winCrudTransiciones, chplan, chobjetivo, chactividad;
var chcuserasociado, stGUsuariosAsociados, smGUsuariosAsociados, GUsuariosAsociados;
var fpTransiciones, stcbestados, stcbestadoinicial, stcbestadofinal;
var estamodificando = 0, idtransicion, pususariosasociados, stGUsuariosSinAsociar,
    btnAsociarEstado, btnDesAsociarEstado, pasociar;
var arrayidusuariosparadesasoc = [], arraytipoidparaasociar = [], arrayidusuariosparaasoc = [], arrayidusuariosasociados = [];
var arraytransicionesseleccionadas = [];
var arraytipodocseleccionado = [], arraytipodocseleccionadoBus = [];
var stcbestadoinicialBus, stcbestadofinalBus, chplanBus, chobjetivoBus, chactividadBus;
var smGListadoPre, stGListadoPre, GListadoPre, arrayidprecondiciones = [], checkColumnModificar, checkColumnEliminar;
var stcbestadosinicial, stcbestadosfinal, pusuarios = 0, ppost = 0, ppre = 0, checkColumnMod, checkColumnElim,
    checkColumnInvol, checkColumnIncluirPre, pclasificadorinvolprecond;
var smGListadoPost, stGListadoPost, stGPost, smGPost;
//validar modificar
var modCheckPlan = false;
var modCheckObj = false;
var modCheckAct = false;
var modEstInicial = false;
var modEstFinal = false;
var valorIniEstInicial = '';
var valorIniEstFinal = '';
var modAsociados = false;

// componente "barra de progreso"
var BarraProgresoFT = new BarraEstado();

//objeto del componente "clasificador de involucrados"
var objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

Ext.grid.CheckColumn = function (config) {
    Ext.apply(this, config);
    if (!this.id) {
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.CheckColumn.prototype = {
    init: function (grid) {
        this.grid = grid;
        this.grid.on('render', function () {
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },
    onMouseDown: function (e, t) {
        if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
            record.set(this.dataIndex, !record.data[this.dataIndex]);
        }
    },
    renderer: function (v, p, record) {
        p.css += ' x-grid3-check-col-td';
        return '<div class="x-grid3-check-col' + (v ? '-on' : '') + ' x-grid3-cc-' + this.id + '">&#160;</div>';
    }
};


// Etiquetas para copiar para el fichero de lenguaje y temporalmente colocadas
// function CargarInterfaz
function cargarInterfaz() {
   Ext.Ajax.timeout = 1000000000;
    // Botones 
    btnAddTrans = new Ext.Button({
        handler: function () {
            estamodificando = 0;
            CrearVentanaCrudTransicion('Adicionar');
        },
        id: 'btnAddTrans',
        iconCls: 'icondistra-adicionar',
        tooltip: 'Adicionar transición',
        key: {
            alt: true,
            key: 'I'
        },
        scope: this

    });
    btnEliTrans = new Ext.Button({
        handler: function () {
            EliminarTransicion();
        },
        disabled: true,
        id: 'btnEliTrans',
        iconCls: 'icondistra-eliminar',
        tooltip: 'Eliminar transición',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });
    btnModTrans = new Ext.Button({
        handler: function () {
            estamodificando = 1;
            CrearVentanaCrudTransicion('Modificar');
        },
        disabled: true,
        id: 'btnModTrans',
        iconCls: 'icondistra-modificar',
        tooltip: 'Modificar transición',
        key: {
            alt: true,
            key: 'M'
        },
        scope: this
    });
    btnPanelBusqueda = new Ext.Button({
        disabled: false,
        id: 'btnPanelBusqueda',
        iconCls: 'icondistra-buscaravanzada',
        tooltip: 'B&uacute;squeda avanzada de transición(es)',
        handler: function () {
            pfiltroAutorTransc.toggleCollapse(true);
        },
        key: {
            alt: true,
            key: 'B'
        },
        scope: this
    });
    btnBusquedaSimple = new Ext.Button({
        handler: function () {
            opcionBusqueda = 1;
            BuscarTransiciones();
        },
        disabled: true,
        id: 'btnBusquedaSimple',
        iconCls: 'icondistra-buscar',
        tooltip: 'Buscar transición(es)',
        text: 'Buscar',
        key: {
            alt: true,
            key: 'B'
        },
        scope: this
    });
    btnLimpiarBS = new Ext.Button({
        handler: function () {
            opcionBusqueda = 2;
            BuscarTransiciones();
        },
        disabled: true,
        tooltip: 'Limpiar filtro(s)',
        iconCls: 'icondistra-limpiar',
        text: 'Limpiar',
        id: 'btnLimpiarBS',
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });
    btnAyuda = new Ext.Button({
        id: 'btnAyudaFlujoTrabajo',
        text: 'Ayuda',
        iconCls: 'ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad',
        key: {
            alt: true,
            key: 'H'
        },
        scope: this
    });
    //store del combo donde muestro los estados
    stcbestados = new Ext.data.Store({
        url: 'cargarcbestados',
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "idestado"
        }, [{
            name: 'idestado'
        }, {
            name: 'denominacion'
        }])
    });

    //combos de estados para la busqueda
    stcbestadoinicialBus = new Ext.form.ComboBox({
        id: 'stcbestadoinicialBus',
        //nextTab: 'stcbestadofinalBus',
        //prevTab: '',
        emptyText: 'Seleccione',
        fieldLabel: 'Estado inicial',
        store: stcbestados,
        hiddenName: 'idestado',
        allowBlank: false,
        valueField: 'idestado',
        displayField: 'denominacion',
        triggerAction: 'all',
        readOnly: false,
        editable: true,
        mode: 'remote',
        anchor: '90%',
        loadingText: 'Cargando datos',
        forceSelection: true,
        listeners: {
            expand: function (combo) {
                stcbestados.reload();
            },
            select: function (combo, record, index) {
                habilitarCriteriosBusqueda()
            }
        }
    });

    stcbestadofinalBus = new Ext.form.ComboBox({
        id: 'stcbestadofinalBus',
        //nextTab: 'btncancelar',
        //prevTab: 'stcbestadoinicialBus',
        emptyText: 'Seleccione',
        fieldLabel: 'Estado final',
        store: stcbestados,
        hiddenName: 'idestado',
        valueField: 'idestado',
        displayField: 'denominacion',
        triggerAction: 'all',
        readOnly: true,
        mode: 'remote',
        anchor: '90%',
        listeners: {
            expand: function (combo) {
                stcbestados.reload();
            },
            select: function (combo, record, index) {
                habilitarCriteriosBusqueda()
            }
        }
    });
    chplanBus = new Ext.form.Checkbox({
        checked: false,
        boxLabel: '<span class="icondistra-folder sipac-azul">' + 'Plan' + '&nbsp;' + '</span>',
        listeners: {
            check: function (chbox, chkeked) {
                if (chkeked)
                    validar++;
                else
                    validar--;
                habilitarCriteriosBusqueda()
            }
        }
    });
    chobjetivoBus = new Ext.form.Checkbox({
        checked: false,
        boxLabel: '<span class="icondistra-archivo sipac-azul">' + 'Objetivo' + '&nbsp;' + '</span>',
        listeners: {
            check: function (chbox, chkeked) {
                if (chkeked)
                    validar++;
                else
                    validar--;
                habilitarCriteriosBusqueda()
            }
        }
    });
    chactividadBus = new Ext.form.Checkbox({
        checked: false,
        boxLabel: '<span class="icondistra-actividades sipac-azul">' + 'Actividad' + '&nbsp;' + '</span>',
        listeners: {
            check: function (chbox, chkeked) {
                if (chkeked)
                    validar++;
                else
                    validar--;
                habilitarCriteriosBusqueda()
            }
        }
    });

    //store del grid donde muestro las transiciones
    stGTransiciones = new Ext.data.Store({
        url: 'cargartransiciones',
        listeners: {
            beforeload: function (st) {
                ActualizarTipoDocBusqueda();
                st.baseParams.idestadoinicial = stcbestadoinicialBus.getValue();
                st.baseParams.idestadofinal = stcbestadofinalBus.getValue();
                st.baseParams.tipodocplan = arraytipodocseleccionadoBus.plan;
                st.baseParams.tipodocobjetivo = arraytipodocseleccionadoBus.objetivo;
                st.baseParams.tipodocactividad = arraytipodocseleccionadoBus.actividad;
            },
            load: function (st) {
                if (smGTransiciones.hasSelection())
                    smGTransiciones.clearSelections();
                ActualizarBarraHerramientas();
            }
        },
        reader: new Ext.data.JsonReader({
            root: "campos",
            totalProperty: "total",
            id: "idtransicion"
        }, [{
            name: 'idtransicion'
        }, {
            name: 'idestadoinicial'
        }, {
            name: 'idestadofinal'
        }, {
            name: 'nombreestadoinicial'
        }, {
            name: 'nombreestadofinal'
        }, {
            name: 'idautor'
        }, {
            name: 'nombreautor'
        }, {
            name: 'superior'
        }, {
            name: 'modificar'
        }, {
            name: 'eliminar'
        }, {
            name: 'plan'
        }, {
            name: 'objetivo'
        }, {
            name: 'actividad'
        }
        ])
    });
    //selection model del grid donde muestro las transiciones
    smGTransiciones = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indice, record) {
                if (prevrow >= 0 && prevrow != indice) {
                    Ext.get(GTransiciones.getView().getRow(prevrow)).removeClass('superior2');
                    Ext.get(GTransiciones.getView().getRow(prevrow)).addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(GTransiciones.getView().getRow(indice)).removeClass('superior');
                    Ext.get(GTransiciones.getView().getRow(indice)).addClass('superior2');
                    prevrow = indice;
                } else
                    prevrow = -1;
                ActualizarBarraHerramientas();
            },
            rowdeselect: function (sm, indice, record) {
                if (prevrow >= 0 && prevrow != indice) {
                    Ext.get(GTransiciones.getView().getRow(prevrow)).removeClass('superior2');
                    Ext.get(GTransiciones.getView().getRow(prevrow)).addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(GTransiciones.getView().getRow(indice)).removeClass('superior');
                    Ext.get(GTransiciones.getView().getRow(indice)).addClass('superior2');
                    prevrow = indice;
                } else
                    prevrow = -1;
                ActualizarBarraHerramientas();
            }
        }
    });
    //grid donde muestro las transiciones
    GTransiciones = new Ext.grid.GridPanel({
        region: 'center',
        autoExpandColumn: 'expandir',
        autoExpandMin: 200,
        store: stGTransiciones,
        sm: smGTransiciones,
        columns: [smGTransiciones,
            {
                hidden: true,
                hideable: false,
                dataIndex: 'idtrans'
            }, {
                header: "Estado inicial",
                dataIndex: 'nombreestadoinicial',
                id: 'expandir'
            }, {
                header: "Estado final",
                width: 330,
                dataIndex: 'nombreestadofinal'
            }, {
                header: '<span class="icondistra-folder sipac-azul"></span>' + ' ' + "Plan",
                width: 100,
                dataIndex: 'plan',
                renderer: MostrarImagenBoleana
            }, {
                header: '<span class="icondistra-archivo sipac-azul"></span>' + ' ' + "Objetivo",
                width: 100,
                dataIndex: 'objetivo',
                renderer: MostrarImagenBoleana
            }, {
                header: '<span class="icondistra-actividades sipac-azul"></span>' + ' ' + "Actividad",
                width: 100,
                dataIndex: 'actividad',
                renderer: MostrarImagenBoleana
            }, {
                header: "Autor",
                width: 110,
                dataIndex: 'nombreautor'
            }
        ],
        loadMask: {
            msg: "Cargando transiciones"
        },
        tbar: [btnAddTrans, ' ', btnModTrans, ' ', btnEliTrans, ' ', btnPanelBusqueda, '->', btnAyuda],
        usarKeymap: true,
        botonesKeymap: [btnAddTrans, btnModTrans, btnEliTrans, btnPanelBusqueda, btnAyuda],
        bbar: new Ext.PagingToolbar({
            pageSize: 1000,
            store: stGTransiciones,
            displayInfo: true,
            listeners: {
                beforechange: function (paginado, evento) {
                    start = evento.start;
                    limit = evento.limit;
                }
            }
        })
    });
    GTransiciones.getView().getRowClass = function (ri, n) {
        if (ri.data.superior)
            return "superior";
        else
            return "";
    };

    //panel para la busqueda de transiciones
    pfiltroAutorTransc = new Ext.Panel({
        title: 'Opciones de b&uacute;squeda',
        id: 'pfiltroAutorTransc',
        layout: 'fit',
        width: 395,
        activeTab: 0,
        collapsible: true,
        collapsed: true,
        margins: '3 3 3 3',
        region: 'east',
        tbar: ['Transiciones asociadas a : ', chplanBus, chobjetivoBus, chactividadBus],
        items: [
            new Ext.form.FormPanel({
                frame: true,
                border: true,
                labelAlign: 'top',
                items: [
                    {
                        layout: 'column',
                        items: [
                            {
                                columnWidth: .5,
                                layout: 'form',
                                width: 180,
                                items: [stcbestadoinicialBus]
                            }, {
                                columnWidth: .5,
                                layout: 'form',
                                width: 180,
                                items: [stcbestadofinalBus]
                            }
                        ]
                    }
                ]
            })
        ],
        buttons: [btnBusquedaSimple, btnLimpiarBS],
        usarKeymap: true,
        botonesKeymap: [btnLimpiarBS, btnBusquedaSimple],
        listeners: {
            expand: function (p) {
                p.doLayout();
                opcionBusqueda = 2;
                //BuscarTransiciones();
            }
        }
    });

    //panel principal de la vista
    pPirncipal = new Ext.Panel({
        layout: 'border',
        region: 'center',
        items: [GTransiciones, pfiltroAutorTransc]
    });
    //viewport de la vista
    vpTransiciones = new Ext.Viewport({
        layout: 'border',
        items: [pPirncipal]
    });

    function ActualizarBarraHerramientas() {
        arraytransicionesseleccionadas = [];
        btnModTrans.disable();
        btnEliTrans.disable();
        var puedemodificar = 1;
        var puedeeliminar = 1;
        if (smGTransiciones.hasSelection()) {
            var recordstransiciones = smGTransiciones.getSelections();
            if (recordstransiciones.length > 0) {
                for (var i = 0; i < recordstransiciones.length; i++) {
                    var transicion = {};
                    transicion = {
                        idtransicion: recordstransiciones[i].data.idtransicion,
                        idestadoinicial: recordstransiciones[i].data.idestadoinicial,
                        idestadofinal: recordstransiciones[i].data.idestadofinal,
                        idautor: recordstransiciones[i].data.idautor
                    };
                    arraytransicionesseleccionadas.push(transicion);
                    if (recordstransiciones[i].data.modificar == 0) {
                        puedemodificar = 0;
                    }
                    if (recordstransiciones[i].data.eliminar == 0) {
                        puedeeliminar = 0;
                    }
                }
                if (puedemodificar == 1 && recordstransiciones.length == 1) {
                    btnModTrans.enable();
                }
                if (puedeeliminar == 1) {
                    btnEliTrans.enable();
                }
            }
        }
    }

    function Cargarprueba(accion) {
        alert(accion);
    }

    function CargarAsociadosModificarTransicion(accion) {
        if (accion == 'Modificar') {
            var arraydetransisionesasociadasultimas = [];

            var arrayinsertar = [];
            var arrayeliminar = [];

            for (var i = 0; i < stGUsuariosAsociados.getCount(); i++) {
                if (stGUsuariosAsociados.getAt(i).data.idusuario) {
                    arraydetransisionesasociadasultimas[i] = stGUsuariosAsociados.getAt(i).data.idusuario;
                } else {
                    arraydetransisionesasociadasultimas[i] = stGUsuariosAsociados.getAt(i).data.idestructura;
                }
            }
            arrayinsertar = buscarcoincidencias(arreglodetransicionesasociadas, arraydetransisionesasociadasultimas);

            arrayeliminar = buscarcoincidencias(arraydetransisionesasociadasultimas, arreglodetransicionesasociadas);
            if (arrayeliminar.length != 0) {
                Ext.Ajax.request({
                    url: 'eliminartransicioncancelar',
                    params: {
                        idtransicion: idtransicionparacancelar,
                        arrayeliminar: Ext.encode(arrayeliminar)
                    },
                    callback: function (options, success, response) {
                    }
                });
            }
            if (arrayinsertar.length != 0) {
                Ext.Ajax.request({
                    url: 'adicionartransicioncancelar',
                    params: {
                        idtransicion: idtransicionparacancelar,
                        arrayinsertar: Ext.encode(arrayinsertar)
                    },
                    callback: function (options, success, response) {
                    }
                });
            }
        }
    }

    function buscarcoincidencias(a, b) {
        var arrayreturn = [];
        cont1 = 0;
        for (var i = 0; i < a.length; i++) {
            var cont = 0;
            for (var y = 0; y < b.length; y++) {
                if (a[i] == b[y]) {
                    cont++;
                    break;
                }
            }
            if (cont == 0) {
                arrayreturn[cont1] = a[i];
                cont1++
            }
        }
        return arrayreturn;
    }

    //funcion donde construyo la ventana para la gestion de transiciones
    function CrearVentanaCrudTransicion(accion) {
        cont = 0;
        pusuarios = 0;
        ppost = 0;
        ppre = 0;
        if (winCrudTransiciones) {
            winCrudTransiciones.destroy();
        }
        estamodificando = 0;
        idautorprecondicion = 0;
        if (accion == 'Modificar') {
            estamodificando = 1;
            idautorprecondicion = arraytransicionesseleccionadas[0].idautor;
            idtransicionparacancelar = arraytransicionesseleccionadas[0].idtransicion;
        }
        chplan = new Ext.form.Checkbox({
            id: 'chplan',
            nextTab: 'chobjetivo',
            prevTab: 'btnaceptar',
            boxLabel: '<span class="icondistra-folder sipac-azul">' + 'Plan' + '&nbsp;' + '</span>',
            checked: true,
            listeners: {
                check: function (h, j) {
                    if (!stcbestadoinicial.getValue() && j) {
                        stcbestadoinicial.enable();
                        stcbestadofinal.enable();
                    }
                    if (!chobjetivo.getValue() && !chactividad.getValue() && !j) {
                        stcbestadofinal.clearValue();
                        stcbestadoinicial.clearValue();
                        stcbestadoinicial.disable();
                        stcbestadofinal.disable();
                    }
                    //Validar modificar
                    if (estamodificando == 1) {
                        if (j) {
                            modCheckPlan = false;
                        } else {
                            modCheckPlan = true;
                        }
                    }
                }
            }
        });
        chobjetivo = new Ext.form.Checkbox({
            id: 'chobjetivo',
            nextTab: 'chactividad',
            boxLabel: '<span class="icondistra-archivo sipac-azul">' + 'Objetivo' + '&nbsp;' + '</span>',
            checked: true,
            listeners: {
                check: function (h, j) {
                    if (!stcbestadoinicial.getValue() && j) {
                        stcbestadoinicial.enable();
                        stcbestadofinal.enable();
                    }
                    if (!chplan.getValue() && !chactividad.getValue() && !j) {
                        stcbestadofinal.clearValue();
                        stcbestadoinicial.clearValue();
                        stcbestadoinicial.disable();
                        stcbestadofinal.disable();
                    }
                    //Validar modificar
                    if (estamodificando == 1) {
                        if (j) {
                            modCheckObj = false;
                        } else {
                            modCheckObj = true;
                        }
                    }
                }
            }
        });
        chactividad = new Ext.form.Checkbox({
            id: 'chactividad',
            nextTab: 'cbestadoinicial',
            checked: true,
            boxLabel: '<span class="icondistra-actividades sipac-azul">' + 'Actividad' + '&nbsp;' + '</span>',
            listeners: {
                check: function (h, j) {
                    if (!stcbestadoinicial.getValue() && j) {
                        stcbestadoinicial.enable();
                        stcbestadofinal.enable();
                    }
                    if (!chplan.getValue() && !chobjetivo.getValue() && !j) {
                        stcbestadofinal.clearValue();
                        stcbestadoinicial.clearValue();
                        stcbestadoinicial.disable();
                        stcbestadofinal.disable();
                    }
                    //Validar modificar
                    if (estamodificando == 1) {
                        if (j) {
                            modCheckAct = false;
                        } else {
                            modCheckAct = true;
                        }
                    }
                }
            }
        });

        //participantes en la transicion
        stGUsuariosAsociados = new Ext.data.Store({
            url: 'cargarusuariosasociados',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.estamodificando = estamodificando;
                    if (estamodificando) {
                        st.baseParams.idtransicion = arraytransicionesseleccionadas[0].idtransicion;
                    }
                },
                load: function (st, records, options) {
                    if (contador < 1) {
                        arrayidusuariosasociados = [];
                        for (i = 0; i < records.length; i++) {
                            if (records[i].data.idusuario) {
                                arrayidusuariosasociados[i] = records[i].data.idusuario;
                                arreglodetransicionesasociadas[i] = records[i].data.idusuario;
                            } else {
                                arrayidusuariosasociados[i] = records[i].data.idestructura;
                                arreglodetransicionesasociadas[i] = records[i].data.idestructura;
                            }
                        }
                        contador++;
                    }
                    ActualizarBotonesDesAsociar();
                }
            },
            reader: new Ext.data.JsonReader({
                root: "campos",
                id: "idusuario",
                totalProperty: 'total'
            }, [{
                name: 'idusuario'
            }, {
                name: 'denominacion'
            }, {
                name: 'tipo'
            }, {
                name: 'idestructura'
            }
            ])
        });
        smGUsuariosAsociados = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function () {
                    ActualizarBotonesDesAsociar();
                },
                rowdeselect: function () {
                    ActualizarBotonesDesAsociar();
                }
            }
        });
        GUsuariosAsociados = new Ext.grid.EditorGridPanel({
            title: 'Usuarios y Estructuras asociadas',
            frame: true,
            width: 290,
            region: 'east',
            autoExpandColumn: 'expandir',
            store: stGUsuariosAsociados,
            margins: '2 2 2 -4',
            sm: smGUsuariosAsociados,
            columns: [
                smGUsuariosAsociados,
                {
                    header: "Denominaci&oacute;n",
                    sortable: true,
                    dataIndex: 'denominacion',
                    id: 'expandir'
                }, {
                    header: "Tipo",
                    sortable: true,
                    dataIndex: 'tipo',
                    renderer: PonerTipo
                }
            ],
            loadMask: {
                msg: "Cargando usuarios..."
            }
        });
        stGUsuariosSinAsociar = new Ext.data.Store({
            url: 'cargarusuariossinasociar',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.estamodificando = estamodificando;
                    if (estamodificando) {
                        st.baseParams.idtransicion = arraytransicionesseleccionadas[0].idtransicion;
                    }
                },
                load: function (st) {
                    ActualizarBotonesAsociar();
                }
            },
            reader: new Ext.data.JsonReader({
                root: "campos",
                totalProperty: 'total'
            }, [{
                name: 'idusuario'
            }, {
                name: 'denominacion'
            }, {
                name: 'tipo'
            }, {
                name: 'marcado'
            }, {
                name: 'esusuarioasociado'
            }, {
                name: 'idestructura'
            }
            ])
        });
        smGUsuariosSinAsociar = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function () {
                    ActualizarBotonesAsociar();
                },
                rowdeselect: function () {
                    ActualizarBotonesAsociar();
                }
            }
        });
        GUsuariosSinAsociar = new Ext.grid.EditorGridPanel({
            frame: true,
            title: 'Usuarios y Estructuras sin asociar',
            region: 'west',
            width: 290,
            autoExpandColumn: 'expandir',
            store: stGUsuariosSinAsociar,
            margins: '2 2 2 -4',
            sm: smGUsuariosSinAsociar,
            columns: [
                smGUsuariosSinAsociar,
                {
                    header: "Denominaci&oacute;n",
                    sortable: true,
                    dataIndex: 'denominacion',
                    id: 'expandir'
                }, {
                    header: "Tipo",
                    sortable: true,
                    dataIndex: 'tipo',
                    renderer: PonerTipo
                }
            ],
            loadMask: {
                msg: "Cargando usuarios sin asociar..."
            }
        });

        btnAsociarEstado = new Ext.Button({
            tooltip: 'Asociar usuario(s)',
            prevTab: 'cbestadofinal',
            nextTab: 'btnDesAsociarEstado',
            id: 'btnAsociarEstado',
            disabled: true,
            iconCls: 'siguiente',
            handler: function () {
                AsociarUsuarios();
            }
        });
        btnDesAsociarEstado = new Ext.Button({
            tooltip: 'Desasociar usuario(s)',
            disabled: true,
            prevTab: 'btnAsociarEstado',
            nextTab: 'btncancelar',
            iconCls: 'anterior',
            id: 'btnDesAsociarEstado',
            handler: function () {
                DesAsociarUsuarios();
            }
        });

        pasociar = new Ext.Panel({
            region: 'center',
            bodyStyle: 'padding:150px 7px',
            items: [btnAsociarEstado, btnDesAsociarEstado]
        });

        stcbestadosinicial = new Ext.data.Store({
            url: 'cargarcbestadosinicial',
            listeners: {
                beforeload: function (st) {
                    if (chplan.getValue()) {
                        st.baseParams.plan = 0
                    }
                    if (chobjetivo.getValue()) {
                        st.baseParams.objetivo = 1
                    }
                    if (chactividad.getValue()) {
                        st.baseParams.actividad = 3
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                root: "data",
                id: "idestado"
            }, [{
                name: 'idestado'
            }, {
                name: 'denominacion'
            }])
        });
        stcbestadoinicial = new Ext.form.ComboBox({
            emptyText: 'Seleccione',
            disabled: false,
            id: 'cbestadoinicial',
            nextTab: 'cbestadofinal',
            prevTab: 'chactividad',
            fieldLabel: 'Estado inicial',
            store: stcbestadosinicial,
            hiddenName: 'idestado',
            allowBlank: false,
            valueField: 'idestado',
            displayField: 'denominacion',
            triggerAction: 'all',
            readOnly: true,
            mode: 'remote',
            anchor: '99%',
            listeners: {
                expand: function (combo) {
                    stcbestadosinicial.reload();
                },
                select: function (combo, record, index) {
                    if (estamodificando == 1) {
                        if (valorIniEstInicial != record.data.denominacion) {
                            modEstInicial = true;
                        } else {
                            modEstInicial = false;
                        }
                    }
                }
            }
        });

        stcbestadosfinal = new Ext.data.Store({
            url: 'cargarcbestadosfinal',
            listeners: {
                beforeload: function (st) {
                    if (chplan.getValue()) {
                        st.baseParams.plan = 0
                    }
                    if (chobjetivo.getValue()) {
                        st.baseParams.objetivo = 1
                    }
                    if (chactividad.getValue()) {
                        st.baseParams.actividad = 3
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                root: "data",
                id: "idestado"
            }, [{
                name: 'idestado'
            }, {
                name: 'denominacion'
            }])
        });
        stcbestadofinal = new Ext.form.ComboBox({
            emptyText: 'Seleccione',
            disabled: false,
            id: 'cbestadofinal',
            nextTab: 'btnAsociarEstado',
            prevTab: 'cbestadoinicial',
            fieldLabel: 'Estado final',
            store: stcbestadosfinal,
            allowBlank: false,
            hiddenName: 'idestado',
            valueField: 'idestado',
            displayField: 'denominacion',
            triggerAction: 'all',
            readOnly: true,
            mode: 'remote',
            anchor: '99%',
            listeners: {
                expand: function (combo) {
                    stcbestadosfinal.reload();
                },
                select: function (combo, record, index) {
                    if (estamodificando == 1) {
                        if (valorIniEstFinal != record.data.denominacion) {
                            modEstFinal = true;
                        } else {
                            modEstFinal = false;
                        }
                    }
                }
            }
        });

        pususariosasociados = new Ext.Panel({
            title: 'Participantes en la transici&oacute;n',
            id: 'pususariosasociados',
            layout: 'border', width: 800,
            listeners: {
                activate: function (p) {
                    if (pusuarios == 0) {
                        stGUsuariosAsociados.load();
                        stGUsuariosSinAsociar.load();
                        pusuarios = 1;
                    }
                }
            },
            items: [GUsuariosAsociados, pasociar, GUsuariosSinAsociar]
        });

        pconfiguracionpre = new Ext.Panel({
            title: 'Configuraci&oacute;n de la pre-condici&oacute;n',
            region: 'south',
            layout: 'fit',
            collapsible: true,
            collapsed: true,
            height: 250
        });

        checkColumnIncluirPre = new Ext.grid.CheckColumn({
            header: "<center>Incluir?</center>",
            dataIndex: 'incluida',
            width: 70
        });
        expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });
        stGListadoPre = new Ext.data.Store({
            url: 'cargarcondiciones',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.estamodificando = estamodificando;
                    st.baseParams.tipocondicion = 1;
                    if (estamodificando) {
                        st.baseParams.idtransicion = arraytransicionesseleccionadas[0].idtransicion;
                    }
                },
                update: function (store, record, operacion) {
                    if (record.data.incluida == true) {
                        pconfiguracionpre.expand();
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                root: "campos",
                id: "idcondicion",
                totalProperty: 'total'
            }, [{
                name: 'idcondicion'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'incluida'
            }, {
                name: 'incluidainicial'
            }
            ])
        });
        smGListadoPre = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function () {
                    ExpandirPanelConfiguracionPre(accion);
                }
            }
        });
        GListadoPre = new Ext.grid.EditorGridPanel({
            title: 'Pre-condiciones existentes',
            frame: true,
            width: 260,
            height: 200,
            clicksToEdit: 1,
            region: 'center',
            autoExpandColumn: 'expandir',
            store: stGListadoPre,
            sm: smGListadoPre,
            plugins: [expander, checkColumnIncluirPre],
            columns: [
                expander,
                {
                    header: "Denominaci&oacute;n",
                    sortable: true,
                    dataIndex: 'denominacion',
                    id: 'expandir'
                },
                checkColumnIncluirPre
            ],
            loadMask: {
                msg: "Cargando pre-condiciones existentes"
            }
        });
        pprecondiciones = new Ext.Panel({
            title: '<center>Pre-condiciones</center>',
            layout: 'border',
            listeners: {
                activate: function (p) {
                    if (ppre == 0) {
                        pprecondiciones.doLayout();
                        stGListadoPre.reload();
                        ppre = 1;
                    }
                }
            },
            items: [GListadoPre, pconfiguracionpre]
        });

        //elementos para la gestion de post-condiciones		
        stGPost = new Ext.data.Store({
            url: 'cargarusuariospost',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.estamodificando = estamodificando;
                    if (estamodificando) {
                        st.baseParams.idtransicion = arraytransicionesseleccionadas[0].idtransicion;
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                root: "campos",
                id: "idusuario",
                totalProperty: 'total'
            }, [
                {
                    name: 'idusuario'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'modificar'
                }, {
                    name: 'modificarinicial'
                }, {
                    name: 'eliminar'
                }, {
                    name: 'eliminarinicial'
                }
            ])
        });

        checkColumnMod = new Ext.grid.CheckColumn({
            header: "Modificar",
            dataIndex: 'modificar',
            width: 80,
            sortable: true,
            align: 'center'
        });

        checkColumnElim = new Ext.grid.CheckColumn({
            header: "Eliminar",
            dataIndex: 'eliminar',
            width: 80
        });

        smGPost = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {}
        });
        GPost = new Ext.grid.EditorGridPanel({
            title: 'Listado de usuarios subordinados',
            frame: true,
            clicksToEdit: 1,
            plugins: [checkColumnMod, checkColumnElim],
            autoExpandColumn: 'expandir',
            store: stGPost,
            sm: smGPost,
            columns: [
                {
                    header: "Denominaci&oacute;n",
                    dataIndex: 'denominacion',
                    id: 'expandir'
                },
                checkColumnMod,
                checkColumnElim
            ],
            loadMask: {
                msg: "Cargando usuarios subordinados"
            }
        });
        pconfiguracionpost = new Ext.Panel({
            title: 'Configuraci&oacute;n de la post-condici&oacute;n',
            region: 'south',
            layout: 'fit',
            collapsible: true,
            collapsed: true,
            height: 250,
            listeners: {
                expand: function (p) {
                    stGPost.reload();
                }
            },
            items: [GPost]
        });

        expanderPost = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });
        stGListadoPost = new Ext.data.Store({
            url: 'cargarcondiciones',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.estamodificando = estamodificando;
                    st.baseParams.tipocondicion = 2;
                    if (estamodificando) {
                        st.baseParams.idtransicion = arraytransicionesseleccionadas[0].idtransicion;
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                root: "campos",
                id: "idcondicion",
                totalProperty: 'total'
            }, [{
                name: 'idcondicion'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'ejecutar'
            }
            ])
        });
        smGListadoPost = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function () {
                    ExpandirPanelConfiguracionPost('exp');
                },
                rowdeselect: function () {
                    ExpandirPanelConfiguracionPost();
                }
            }
        });
        checkcolumnEject = new Ext.grid.CheckColumn({
            header: "Ejecutar",
            dataIndex: 'ejecutar',
            sortable: true,
            width: 70
        });
        GListadoPost = new Ext.grid.EditorGridPanel({
            title: 'Post-condiciones existentes',
            frame: true,
            width: 260,
            height: 200,
            region: 'center',
            autoExpandColumn: 'expandir',
            store: stGListadoPost,
            sm: smGListadoPost,
            clicksToEdit: 1,
            plugins: [expanderPost, checkcolumnEject],
            columns: [
                expander, smGListadoPost,
                {
                    header: "Denominaci&oacute;n",
                    sortable: true,
                    dataIndex: 'denominacion',
                    id: 'expandir'
                },
                checkcolumnEject
            ],
            loadMask: {
                msg: "Cargando post-condiciones existentes..."
            }
        });

        ppostcondiciones = new Ext.Panel({
            title: '<center>Post-condiciones</center>',
            layout: 'border',
            listeners: {
                activate: function (p) {
                    if (ppost == 0) {
                        ppostcondiciones.doLayout();
                        stGListadoPost.reload();
                        ppost = 1;
                    }
                }
            },
            items: [GListadoPost/*,pconfiguracionpost*/]
        });

        tpasociacion = new Ext.TabPanel({
            activeTab: 0,
            width: 620,
            height: 420,
            items: pususariosasociados
        });

        fpTransiciones = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .5,
                    layout: 'form',
                    items: [stcbestadoinicial]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    items: [stcbestadofinal]
                }]
            }, tpasociacion],
            listeners: {
                'clientvalidation': function (fm, valid) {
                    var arrayusuariosasociados = ObtenerUsuariosAsociados();
                    if (estamodificando != 1) {
                        if (valid && arrayusuariosasociados.length != 0) {
                            Ext.getCmp('btnaceptar').setDisabled(false);
                            Ext.getCmp('btnaplicartransc').setDisabled(false);
                        } else {
                            Ext.getCmp('btnaceptar').setDisabled(true);
                            Ext.getCmp('btnaplicartransc').setDisabled(true);
                        }
                    }
                    //Modificar
                    cambioAsociados = ObtenerUsuariosAsociados(1);
                    if (arrayidusuariosasociados.length != cambioAsociados.length) {
                        modAsociados = true;
                    } else {
                        for (i = 0; i < arrayidusuariosasociados.length; i++) {
                            if (arrayidusuariosasociados[i] != cambioAsociados[i]) {
                                modAsociados = true;
                            } else
                                modAsociados = false;
                        }
                    }
                    if (estamodificando == 1) {
                        if (valid && (modEstInicial
                                || modEstFinal
                                || modCheckPlan
                                || modCheckObj
                                || modCheckAct
                                || modAsociados
                            )) {
                            Ext.getCmp('btnaceptar').setDisabled(false);
                        } else {
                            Ext.getCmp('btnaceptar').setDisabled(true);
                        }
                    }
                }
            }
        });

        winCrudTransiciones = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            layout: 'fit',
            title: accion + ' transici&oacute;n de la informaci&oacute;n',
            constrain: true,
            width: 655,
            height: 580,
            defaultButton: chplan,
            tbar: ['-', 'Transici&oacute;n v&aacute;lida para: ', chplan, chobjetivo, chactividad],
            items: [fpTransiciones],
            keys: [{
                key: Ext.EventObject.ENTER,
                fn: function () {
                    CrudTransiciones('acp', accion);
                },
                scope: this
            }], listeners: {
                destroy: function (win) {
                    modCheckPlan = false;
                    modCheckObj = false;
                    modCheckAct = false;
                    modEstInicial = false;
                    modEstFinal = false;
                    modAsociados = false;
                    cambioAsociados = [];
                    contador = 0;
                }
            },
            buttons: [
                {
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    id: 'btncancelar',
                    prevTab: 'btnDesAsociarEstado',
                    nextTab: 'btnaplicartransc',
                    tooltip: 'Cerrar ventana sin guardar los datos',
                    handler: function () {
                        winCrudTransiciones.destroy();
                    }
                }, {
                    iconCls: 'aplicar ',
                    text: 'Aplicar ',
                    tooltip: 'Guardar datos y limpiar los campos',
                    hidden: true,
                    nextTab: 'btnaceptar',
                    prevTab: 'btncancelar',
                    id: 'btnaplicartransc',
                    handler: function () {
                        CrudTransiciones('apl', accion);
                    }
                }, {
                    iconCls: 'aceptar ',
                    text: 'Aceptar ',
                    nextTab: 'chplan',
                    prevTab: 'btnaplicartransc',
                    id: 'btnaceptar',
                    tooltip: 'Guardar datos y cerrar ventana',
                    handler: function () {
                        arreglodetransicionesasociadas = [0];
                        CrudTransiciones('acp', accion);
                    }
                }]
        });
        function PonerTipo(v) {
            if (v == 1)
                return 'Usuario';
            else
                return 'Estructura';
        }

        winCrudTransiciones.show();
        winCrudTransiciones.on('beforeshow', function () {
            chplan.focus(true, 700);
        });
        chplan.focus(false, 1024);
        switch (accion) {
            case 'Adicionar':
                Ext.getCmp('btnaplicartransc').setVisible(true);
                break;
            case 'Modificar':
                BarraProgresoFT.show('Cargando datos');
                Ext.getCmp('btnaplicartransc').setVisible(false);
                Ext.getCmp('btncancelar').nextTab = 'btnaceptar';
                Ext.Ajax.request({
                    url: 'cargartransicionmodificar',
                    params: {
                        idtransicion: arraytransicionesseleccionadas[0].idtransicion
                    },
                    callback: function (options, success, response) {
                        BarraProgresoFT.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 0) {
                            mostrarMensaje(3, 'La transici&oacute;n que usted quiere modificar ya no se encuentra en los registros.', function () {
                                winCrudTransiciones.destroy();
                                stGTransiciones.reload();
                            });
                        } else {
                            stcbestadoinicial.setValue(responseData.data[0].estadoinicial.denominacion);
                            stcbestadofinal.setValue(responseData.data[0].estadofinal.denominacion);
                            stcbestadoinicial.disable();
                            stcbestadofinal.disable();
                            chplan.setValue(responseData.data[0].tipodocplan);
                            chobjetivo.setValue(responseData.data[0].tipodocobjetivo);
                            chactividad.setValue(responseData.data[0].tipodocactividad);
                            //validar modificar
                            valorIniEstInicial = responseData.data[0].estadoinicial.denominacion;
                            valorIniEstFinal = responseData.data[0].estadofinal.denominacion;
                        }
                    }
                });
                break;
        }
    }

    function cambiosModificar(idtransicion, idusuariosarelacionar) {
        var bandera = false;
        if (arrayidusuariosasociados.length == idusuariosarelacionar.length) {
            for (i = 0; i < arrayidusuariosasociados.length; i++) {
                if (arrayidusuariosasociados[i] != idusuariosarelacionar[i])
                    bandera = true;
            }
        }
        var record = stGTransiciones.getById(idtransicion);
        if (Ext.getCmp('chactividad').getValue() == record.get('actividad') && Ext.getCmp('chplan').getValue() == record.get('plan')
            && Ext.getCmp('chobjetivo').getValue() == record.get('objetivo') && bandera) {
            return false;
        } else {
            return true;
        }
    }

    function CrudTransiciones(opcion, accion) {
        if (fpTransiciones.getForm().isValid()) {
            ActualizarTipoDoc();
            if (arraytipodocseleccionado.plan || arraytipodocseleccionado.objetivo
                || arraytipodocseleccionado.actividad) {
                var arrayusuariosasociados = ObtenerUsuariosAsociados();
                if (arrayusuariosasociados.length != 0) {
                    var procede = 1;
                    var url = 'adicionar';
                    var acciongestion = 'Adicionando';
                    var accionejecutada = 'adicionada';

                    if (accion == 'Modificar') {
                        url = 'modificar';
                        acciongestion = 'Modificando';
                        accionejecutada = 'modificada';
                    }
                    if (procede) {
                        var params = {};
                        params.tipodocplan = arraytipodocseleccionado.plan;
                        params.tipodocobjetivo = arraytipodocseleccionado.objetivo;
                        params.tipodocactividad = arraytipodocseleccionado.actividad;
                        params.idestadoinicial = stcbestadoinicial.getValue();
                        params.idestadofinal = stcbestadofinal.getValue();
                        if (estamodificando == 0) {
                            params.idusuariosarelacionar = Ext.encode(arrayusuariosasociados);
                        } else {
                            params.idtransicion = arraytransicionesseleccionadas[0].idtransicion;
                        }
                        var arraysubordinadospost = [];
                        var arrayrecordssubordinadospermisos = stGPost.getModifiedRecords();
                        if (arrayrecordssubordinadospermisos.length > 0) {
                            for (var i = 0; i < arrayrecordssubordinadospermisos.length; i++) {
                                var subordinadopost = {};
                                subordinadopost = {
                                    idusuario: arrayrecordssubordinadospermisos[i].data.idusuario,
                                    modificar: arrayrecordssubordinadospermisos[i].data.modificar,
                                    eliminar: arrayrecordssubordinadospermisos[i].data.eliminar,
                                    idestructura: arrayrecordssubordinadospermisos[i].data.idestructura
                                };
                                arraysubordinadospost.push(subordinadopost);
                            }
                        }
                        params.arraysubordinadospost = Ext.encode(arraysubordinadospost);
                        var procede = 1;
                        var arraypost = [];
                        var arrayrecordspost = stGListadoPost.getModifiedRecords();
                        if (arrayrecordspost.length > 0) {
                            params.idpostcondicion = arrayrecordspost[0].data.idcondicion;
                            params.ejecutarpostcond = arrayrecordspost[0].data.ejecutar;
                        }
                        if ((arrayrecordssubordinadospermisos.length > 0 && arrayrecordspost.length == 0)
                            || (arrayrecordssubordinadospermisos.length == 0 && arrayrecordspost.length > 0)) {
                            procede = 2;
                        }
                        if (accion == 'Modificar' && arrayrecordssubordinadospermisos.length > 0
                            && arrayrecordspost.length == 0) {
                            var rec = stGListadoPost.getRange();
                            if (rec[0].data.ejecutar == 1) {
                                procede = 1;
                                params.ejecutarpostcond = true;
                                params.idpostcondicion = rec[0].data.idcondicion;
                            }
                        }
                        if (procede == 1) {
                            BarraProgresoFT.show(acciongestion + ' transici&oacute;n...');
                            fpTransiciones.getForm().submit({
                                url: url + 'transicion',
                                params: params,
                                waitMsg: acciongestion + ' transici&oacute;n ...',
                                failure: function (form, action) {
                                    BarraProgresoFT.hide();
                                    if (action.result.mensaje == 0) {
                                        mostrarMensaje(3, 'La transici&oacute;n que usted quiere modificar ya no se encuentra en los registros.', function () {
                                            winCrudTransiciones.destroy();
                                            stGTransiciones.reload({});
                                        });
                                    }
                                    if (action.result.mensaje == 1) {
                                        mostrarMensaje(1, 'La transici&oacute;n ha sido ' + accionejecutada + ' satisfactoriamente.');
                                        contador = 0;
                                        LimpiarFormularioCrudTransiciones();
                                        if (smGTransiciones.hasSelection()) {
                                            GTransiciones.getView().refresh(true);
                                        }
                                        if (opcion == 'acp') {
                                            winCrudTransiciones.destroy();
                                        }
                                        stGTransiciones.reload({});
                                    }
                                    if (action.result.mensaje == 2) {
                                        mostrarMensaje(1, 'Algunos tipos de documentos no est&aacute;n asociados a los estados de esta transici&oacute;n. Por favor rectifique estas asociaciones entre estados y tipos de documentos.')
                                    }
                                    if (action.result.mensaje == 3) {
                                        mostrarMensaje(1, 'Ya existe una transici&oacute;n con el estado inicial y final especificado.')
                                    }
                                }
                            });
                        }
                        if (procede == 2) {
                            mostrarMensaje(1, 'Debe de marcar "Ejecutar" en la postcondici&oacute;n si tiene usuarios configurados, o viceversa. De lo contrario desmarque todo. Por favor rectifique.');
                        }
                    }
                }
            }
        }
    }

    function EliminarTransicion() {
        var mensaje = '', mensajemascara = '';
        if (arraytransicionesseleccionadas.length > 1) {
            mensaje = '¿Está seguro que quiere eliminar las transiciones seleccionadas?';
            mensajemascara = 'Eliminando transiciones';
        } else {
            mensaje = '¿Está seguro que quiere eliminar la transición seleccionada?';
            mensajemascara = 'Eliminando transici&oacute;n';
        }
        mostrarMensaje(2, mensaje, function (btnPresionado) {
            if (btnPresionado == 'ok') {
                BarraProgresoFT.show(mensajemascara);
                Ext.Ajax.request({
                    url: 'eliminartransiciones',
                    params: {
                        arraytransicionesseleccionadas: Ext.encode(arraytransicionesseleccionadas)
                    },
                    callback: function (options, success, response) {
                        BarraProgresoFT.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1 || responseData.mensaje == 2) {
                            var mensajeconfirmacion = '';
                            if (arraytransicionesseleccionadas.length > 1) {
                                mensajeconfirmacion = 'Las transiciones han sido eliminadas satisfactoriamente.';
                            } else {
                                mensajeconfirmacion = 'La transición ha sido eliminada satisfactoriamente.';
                            }
                            mostrarMensaje(1, mensajeconfirmacion);
                            stGTransiciones.reload({});
                        }
                        if (responseData.mensaje == 0) {
                            var mensajeconfirmacion2 = '';
                            if (arraytransicionesseleccionadas.length > 1)
                                mensajeconfirmacion2 = 'Las transiciones que usted quiere eliminar ya no se encuentran en los registros.';
                            else
                                mensajeconfirmacion2 = 'La transici&oacute;n que usted quiere eliminar ya no se encuentra en los registros.';
                            mostrarMensaje(3, mensajeconfirmacion2, function () {
                                stGTransiciones.reload({});
                            });
                        }
                    }
                });
            } else {
                if (smGTransiciones.hasSelection()) {
                    smGTransiciones.clearSelections();
                    GTransiciones.getView().refresh(true);
                }
            }
        });
    }

    function ActualizarBotonesDesAsociar() {
        btnDesAsociarEstado.disable();
        arrayidusuariosparadesasoc = [];
        var inicialseleccionado = 0;
        if (smGUsuariosAsociados.hasSelection()) {
            arrayrecords = smGUsuariosAsociados.getSelections();
            totalrecords = arrayrecords.length;
            if (totalrecords > 0) {
                for (var i = 0; i < totalrecords; i++) {
                    if (arrayrecords[i].data.idusuario) {
                        arrayidusuariosparadesasoc[i] = arrayrecords[i].data.idusuario;
                    } else {
                        arrayidusuariosparadesasoc[i] = arrayrecords[i].data.idestructura;
                    }
                }
                btnDesAsociarEstado.enable();
            }
        }
    }

    function ActualizarBotonesAsociar() {
        arrayidusuariosparaasoc = [];
        arraytipoidparaasociar = [];
        btnAsociarEstado.disable();
        if (smGUsuariosSinAsociar.hasSelection()) {
            arrayrecords = smGUsuariosSinAsociar.getSelections();
            totalrecords = arrayrecords.length;
            if (totalrecords > 0) {
                for (var i = 0; i < totalrecords; i++) {
                    if (arrayrecords[i].data.idusuario) {
                        arrayidusuariosparaasoc[i] = arrayrecords[i].data.idusuario;
                        arraytipoidparaasociar[i] = 0;
                    } else {
                        arrayidusuariosparaasoc[i] = arrayrecords[i].data.idestructura;
                        arraytipoidparaasociar[i] = 1;
                    }
                }
                btnAsociarEstado.enable();
            }
        }
    }

    function AsociarUsuarios() {
        if (smGUsuariosSinAsociar.hasSelection()) {
            var arrayusuariosparaasociar = smGUsuariosSinAsociar.getSelections();
            if (arrayusuariosparaasociar.length > 0) {
                BarraProgresoFT.show('Asociando usuarios');
                if (estamodificando == 0) {
                    for (var i = 0; i < arrayusuariosparaasociar.length; i++) {
                        stGUsuariosSinAsociar.remove(arrayusuariosparaasociar[i]);
                    }
                    stGUsuariosAsociados.add(arrayusuariosparaasociar);
                    BarraProgresoFT.hide();
                } else {
                    Ext.Ajax.request({
                        url: 'asociarusuariosatransicion',
                        params: {
                            idtransicion: arraytransicionesseleccionadas[0].idtransicion,
                            arraytipoidparaasociar: Ext.encode(arraytipoidparaasociar),
                            arrayidusuariosparaasoc: Ext.encode(arrayidusuariosparaasoc)
                        },
                        callback: function (options, success, response) {
                            BarraProgresoFT.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 0) {
                                mostrarMensaje(3, 'La transici&oacute;n que usted quiere modificar ya no se encuentra en los registros.', function () {
                                    winCrudTransiciones.destroy();
                                    stGTransiciones.reload();
                                });
                            } else {
                                stGUsuariosAsociados.reload();
                                stGUsuariosSinAsociar.reload();
                            }
                        }
                    });
                }
                GUsuariosAsociados.getView().refresh(true);
                GUsuariosSinAsociar.getView().refresh(true);
            }
        }
        ActualizarBotonesAsociar();
    }

    function DesAsociarUsuarios() {
        if (smGUsuariosAsociados.hasSelection()) {
            var arrayusuariosparadesasociar = smGUsuariosAsociados.getSelections();

            if (arrayusuariosparadesasociar.length > 0) {
                BarraProgresoFT.show('Eliminado asociaci&oacute;n');
                if (estamodificando == 0) {
                    for (var i = 0; i < arrayusuariosparadesasociar.length; i++) {
                        stGUsuariosAsociados.remove(arrayusuariosparadesasociar[i]);
                    }
                    stGUsuariosSinAsociar.add(arrayusuariosparadesasociar);
                    BarraProgresoFT.hide();
                    GUsuariosAsociados.getView().refresh();
                    GUsuariosSinAsociar.getView().refresh();
                } else {
                    Ext.Ajax.request({
                        url: 'desasociarusuariosatransicion',
                        params: {
                            idtransicion: arraytransicionesseleccionadas[0].idtransicion,
                            arrayidusuariosparadesasoc: Ext.encode(arrayidusuariosparadesasoc)
                        },
                        callback: function (options, success, response) {
                            BarraProgresoFT.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 0) {
                                mostrarMensaje(3, 'La transici&oacute;n que usted quiere modificar ya no se encuentra en los registros.', function () {
                                    winCrudTransiciones.destroy();
                                    stGTransiciones.reload();
                                });
                            } else {
                                stGUsuariosAsociados.reload();
                                stGUsuariosSinAsociar.reload();
                            }
                        }
                    });
                }
                GUsuariosAsociados.getView().refresh(true);
                GUsuariosSinAsociar.getView().refresh(true);
            }
        }
        ActualizarBotonesDesAsociar();
    }

    function ObtenerUsuariosAsociados(validarModificar) {
        var arrayidusuariosasociados = [];
        var recordsusuariosasociados = stGUsuariosAsociados.getRange();
        var arrayid = [];
        if (recordsusuariosasociados.length > 0) {
            for (var i = 0; i < recordsusuariosasociados.length; i++) {

                var usuarioasociado = {};
                var ideuserestruc = (recordsusuariosasociados[i].data.tipo == 1) ? recordsusuariosasociados[i].data.idusuario : recordsusuariosasociados[i].data.idestructura;
                arrayid.push(ideuserestruc);
                idusuarioasociado = {
                    idusuario: ideuserestruc,
                    tipo: recordsusuariosasociados[i].data.tipo
                };
                arrayidusuariosasociados.push(idusuarioasociado);
            }
        }
        if (validarModificar == 1) {
            return arrayid;
        } else
            return arrayidusuariosasociados;
    }

    function ActualizarTipoDoc() {
        valorplan = 0;
        valorobjetivo = 0;
        valoractividad = 0;
        arraytipodocseleccionado.plan = valorplan;
        arraytipodocseleccionado.objetivo = valorobjetivo;
        arraytipodocseleccionado.actividad = valoractividad;
        if (chplan.getValue()) {
            valorplan = 1;
        }
        arraytipodocseleccionado.plan = valorplan;
        if (chobjetivo.getValue()) {
            valorobjetivo = 1;
        }
        arraytipodocseleccionado.objetivo = valorobjetivo;
        if (chactividad.getValue()) {
            valoractividad = 1;
        }
        arraytipodocseleccionado.actividad = valoractividad;
    }

    function ActualizarTipoDocBusqueda() {
        valorplan = 0;
        valorobjetivo = 0;
        valoractividad = 0;
        arraytipodocseleccionadoBus.plan = valorplan;
        arraytipodocseleccionadoBus.objetivo = valorobjetivo;
        arraytipodocseleccionadoBus.actividad = valoractividad;
        if (chplanBus.getValue()) {
            valorplan = 1;
        }
        arraytipodocseleccionadoBus.plan = valorplan;
        if (chobjetivoBus.getValue()) {
            valorobjetivo = 1;
        }
        arraytipodocseleccionadoBus.objetivo = valorobjetivo;
        if (chactividadBus.getValue()) {
            valoractividad = 1;
        }
        arraytipodocseleccionadoBus.actividad = valoractividad;
    }

    function MostrarImagenBoleana(valor) {
        if (valor == 0) {
            return ' ';
        }
        if (valor == 1) {
            return '<center><span class="icondistra-validaryaceptar sipac-verde"></span></center>';
        }
    }

    function LimpiarFormularioCrudTransiciones() {
        stcbestadoinicial.clearValue();
        stcbestadofinal.clearValue();
        stGUsuariosAsociados.removeAll();
        stGUsuariosSinAsociar.removeAll();
        stGUsuariosAsociados.reload();
        stGUsuariosSinAsociar.reload();
        chplan.setValue(true);
        chobjetivo.setValue(true);
        chactividad.setValue(true);
    }

    function BuscarTransiciones() {
        if (opcionBusqueda == 1) {
            var idestadoinicial = stcbestadoinicialBus.getValue();
            var idestadofinal = stcbestadofinalBus.getValue();
            var tipodocplan = chplanBus.getValue();
            var tipodocobjetivo = chobjetivoBus.getValue();
            var tipodocactividad = chactividadBus.getValue();
            if (!idestadoinicial && !idestadofinal && tipodocplan == 0 && tipodocobjetivo == 0 && tipodocactividad == 0) {
                mostrarMensaje(1, 'Debe introducir al menos un criterio de búsqueda.');
            } else {
                stGTransiciones.reload({
                    callback: function () {
                        stcbestadoinicialBus.reset();
                        stcbestadofinalBus.reset();
                        chplanBus.setValue(false);
                        chobjetivoBus.setValue(false);
                        chactividadBus.setValue(false);
                        _this.btnBusquedaSimple.disable();
                        if (stGTransiciones.getTotalCount() == 0) {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                            stGTransiciones.reload({
                                params: {
                                    limit: limit,
                                    start: start
                                }
                            });
                        }
                        pfiltroAutorTransc.collapse(true);
                    }
                });
            }
        }
        if (opcionBusqueda == 2) {
            stcbestadoinicialBus.reset();
            stcbestadofinalBus.reset();
            chplanBus.setValue(false);
            chobjetivoBus.setValue(false);
            chactividadBus.setValue(false);
            _this.btnBusquedaSimple.disable();
            _this.btnLimpiarBS.disable();
            stGTransiciones.reload({
                params: {
                    limit: limit,
                    start: start
                }
            });
        }
    }

    function ExpandirPanelConfiguracionPost(accion) {
        arrayidpostcondiciones = [];
        postcondseleccionadas = smGListadoPost.getSelections();
        if (postcondseleccionadas.length > 0) {
            for (var i = 0; i < postcondseleccionadas.length; i++) {
                arrayidpostcondiciones[i] = postcondseleccionadas[i].data.idcondicion;
            }
        }
        if (accion == 'exp') {
            pconfiguracionpost.expand();
        } else {
            pconfiguracionpost.collapse();
        }
    }

    function ObtenerDatosPrecondiciones(estamodificando) {
        if (estamodificando == 0) {
            var records = stGListadoPre.getModifiedRecords();
            if (records[0].data.incluida != records[0].data.incluidainicial) {
                precondicion = {};
                precondicion = {idprecondicion: records[0].data.idcondicion, datos: ObtenerDatosConfigPreCond()};
            }
        }
    }

    function ObtenerDatosConfigPreCond() {
        var recordsusersgrupos = stGPre.getModifiedRecords();
        if (recordsusersgrupos.length > 0) {
            for (var j = 0; j < recordsusersgrupos.length; j++) {
                var usergrupo = {};
                usergrupo = {idelemento: recordsusersgrupos[i].data.idelemento, tipo: recordsusersgrupos[i].data.tipo};
            }
        }
    }

    stGTransiciones.reload({
        params: {
            limit: limit,
            start: start
        }
    });

    function MostrarImagenSiTienePermiso(valor) {
        if (valor == 0) {
            return ' ';
        }
        if (valor == 1) {
            return '<center><span><img src="../../../../../planificacion/pdo/comun/recursos/images/fam/tick.png" ></span></center>';
        }
    }

    function PintarTipo(valor) {
        if (valor == 0) {
            return '<span style="color:blue;"><center>Grupo</center></span>';
        }
        if (valor == 1) {
            return '<span style="color:red;"><center>Usuario</center></span>';
        }
    }

    function afterEdit(e) {
        alert(1);
        if (e.value == 1) {
            pconfiguracionpost.enable();
        } else {
            pconfiguracionpost.disable();
        }
    }

    function habilitarCriteriosBusqueda() {
        if (validar > 0 || stcbestadofinalBus.getValue() != "" || stcbestadoinicialBus.getValue() != "") {
            btnBusquedaSimple.enable();
            btnLimpiarBS.enable();
        } else {
            btnBusquedaSimple.disable();
            //btnLimpiarBS.disable();
        }
    }
}

cargarInterfaz();







