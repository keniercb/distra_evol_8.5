var perfil = window.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.etiquetas = {};
UCID.portal.cargarEtiquetas('producciones', cargarAccionesP);

objci = {};
objci.acciones = [];
esrector = false;
offsetProducciones = 0;
offsetCartas = 0;
identidadselected = null;
textEntidadSect = null;

var Cmpcomplementario = new Utilidades.Cmp.CmpBotonesComplementarios({
    elemento: 'Produccion'
});

//inicio de cargar inter faz
//********CARGANDO LAS ACCIONES*************
function cargarAccionesP() {

    UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function() {

        for (i in acciones_reportes) {
            objci.acciones[acciones_reportes[i].abreviatura] = true;
        }
        termine_cargar = true;
        esrector = ((objci.acciones.rector == undefined) ? false : true);

        initViewInterface();
    })

}

/**
 * Interfaz Principal
 */
function initViewInterface() {
    var _this = this;
    _this.idEntidad_Sel = null;
    _this.globalC = false;
    _this.idEjercicio = null;
    _this.banDate = 0;

    /**
     * Arbol de entidades
     * @type {Ext.estructura.panel.PanelEstructura}
     */
    _this.trEntidad = new Ext.estructura.panel.PanelEstructura({
        cargos: false,
        menu: false,
        width: 600

    });

    stagrupacionCT = new Ext.data.Store({
        url: 'cargarAgrupaciones',
        autoLoad: false,
        reader: new Ext.data.JsonReader({
            id: 'idvariablecontrolraiz',
            root: 'data'
        }, [{
                name: 'idvariablecontrolraiz'
            }, {
                name: 'denominacionraiz'
            }]),
        listeners: {
            load: function() {


            }
        }
    });

    stagrupacionCT.reload();

    _this.trEntidad.btnBuscar.setText("");
    _this.trEntidad.btnLimpiar.setText("");
    _this.trEntidad = trEntidad.items.items[0];
    _this.trEntidad.getRootNode().expand();
    _this.trEntidad.region = 'west';
    _this.trEntidad.addListener('click', function(n) {

        if(_this.stProducciones){
            _this.stProducciones.loadData({"data": [], "total": 0});
        }

        if (n.text != "Estructuras") {
            _this.gProduccion.enable();
            _this.cmbEjercicio.enable();
            identidadselected = n.id;
            textEntidadSect = n.text;
            if (n.leaf) {
                _this.chglobal.hide();
            } else {
                if (!_this.chglobal.isVisible()) {
                    _this.chglobal.show();
                }
            }

            _this.idEntidad_Sel = n.id;
            _this.stProducciones.reload();
            btnGraficoPlanif.enable();
            btnGraficas.actualizarParametros(n, 'Produccion');

        } else {
            _this.gProduccion.disable();
            var storeProduccion = _this.gProduccion.getStore();
            storeProduccion.removeAll();
            _this.cmbEjercicio.disable();
            if (_this.chglobal.isVisible()) {
                _this.chglobal.hide();
            }
            btnGraficoPlanif.disable();
        }
    });

    _this.stvariableGP = new Ext.data.Store({
        url: 'cargarVariables',
        autoLoad: false,
        reader: new Ext.data.JsonReader({
            id: 'idvariable',
            root: 'data'
        }, [{
                name: 'idvariable'
            }, {
                name: 'denominacionvariable'
            }]),
        listeners: {
            load: function(Store, records, options) {

            }
        }
    });

    _this.stvariableGP.reload();

    /**
     * Store del ejecicio actual
     * @type {Ext.data.Store}
     */
    _this.stCbejercicio = new Ext.data.Store({
        url: 'getEjercicios',
        autoLoad: true,
        disabled: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idejercicio'
            }, {
                name: 'ejercicio'
            }, {
                name: 'idestado'
            }]),
        listeners: {
            load: function(t) {
                cmbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
            }
        }
    });

    _this.mdProducciones = new Ext.menu.Menu({
        items: [{
                text: "Eliminar producci&oacuten",
                icon: perfil.dirImg + 'eliminar.png',
                iconCls: 'btn',
                handler: function() {
                    validarEliminacion();
                    _this.btnDelete.disable();
                }

            }, {
                text: "Aprobar producci&oacuten",
                icon: perfil.dirImg + 'aprobar.png',
                iconCls: 'btn',
                handler: function() {
                }
            }, {
                text: "Desaprobar producci&oacuten",
                icon: perfil.dirImg + 'desaprobar.png',
                iconCls: 'btn',
                handler: function() {
                }
            }]
    });

    /**
     * chebox para listar todas las producciones
     * @type {Ext.form.Checkbox}
     */
    _this.chglobal = new Ext.form.Checkbox({
        boxLabel: 'Global',
        listeners: {
            check: function(ck, t) {
                _this.globalC = t;
                _this.stProducciones.reload();
            }
        }
    });

    /**
     * Botones del grid de produccion
     * @type {Ext.Button}
     */
    _this.btnAddCartaTecnologica = new Ext.Button({
        iconCls: 'adicionar',
        text: 'Adicionar',
        tooltip: 'Adicionar producciones ',
        handler: function() {
            viewCartaTegnologica(_this.idEntidad_Sel, _this.cmbEjercicio);
        }
    });

    _this.btnGuardar = new Ext.Button({
        handler: function() {
            saveCambios();
            _this.btnGuardar.disable();
        },
        tooltip: 'Guardar datos de la producción <b>(Alt+G)</b>',
        disabled: true,
        text: 'Guardar',
        icon: perfil.dirImg + 'guardar.png',
        iconCls: 'btn'
    });

    _this.btnDelete = new Ext.Button({
        handler: function() {
            validarEliminacion();
            _this.btnDelete.disable();
        },
        tooltip: 'Eliminar las producciones seleccionadas',
        disabled: true,
        text: 'Eliminar',
        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'btn'
    });

    _this.btnExportarProd = new Ext.Button({
        iconCls: 'exportar',
        tooltip: 'Exportar Producciones',
        //disabled: true,
        handler: function() {
            exportarProducciones();
        }
    });

    _this.btnLimpiar = new Ext.Button({
        handler: function() {
            _this.filtrosProducciones.clearFilters();
            //_this.stProducciones.load();
        },
        text: 'Limpiar',
        tooltip: 'Limpiar filtro(s)<b>(Alt+L)</b>',
        id: 'btnLimpi',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn'
    });

    //boton para comp graficas
    btnGraficas = new Utilidades.Cmp.botonGrafica({
        idioma: perfil.etiquetas,
        nodeEntidad: identidadselected,
        componente: 'Produccion'
    });
    btnGraficoPlanif = btnGraficas.botonMenuGrafica();

    /**
     * Combo del Ejercicio actual
     * @type {Ext.form.ComboBox}
     */
    _this.cmbEjercicio = new Ext.form.ComboBox({
        width: 150,
        disabled: true,
        store: _this.stCbejercicio,
        displayField: 'ejercicio',
        valueField: 'idejercicio',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function() {
                _this.stProducciones.reload();
            }
        }
    });

    _this.mbaprob = new Ext.Toolbar.MenuButton({
        text: 'Aprobaci&oacute;n',
        tooltip: {
            text: 'Aprobaci&oacute;n de las Producciones',
            title: 'Aprobaci&oacute;n'
        },
        icon: perfil.dirImg + 'area.png',
        iconCls: 'blist',
        menu: {
            items: [{
                    id: 'btnAprobar',
                    icon: perfil.dirImg + 'aprobar.png',
                    iconCls: 'btn',
                    text: 'Aprobar <b>(Alt+P)</b>',
                    disabled: true,
                    listeners: {
                        click: function(st) {
                            cambiarAprobacion(esrector ? 4 : 3);
                        }
                    }
                }, {
                    id: 'btnDesaprobar',
                    icon: perfil.dirImg + 'desaprobar.png',
                    iconCls: 'btn',
                    text: 'Desaprobar <b>(Alt+O)</b>',
                    disabled: true,
                    listeners: {
                        click: function(st) {
                            cambiarAprobacion(1);
                        }
                    }
                }]
        }
    });

    var listenGridProd = function(grid, rowIndex, e) {
        _this.produccionesSel = [];
        Ext.getCmp('btnAprobar').disable();
        Ext.getCmp('btnDesaprobar').disable();
        _this.produccionesSel = grid.selections.items;
        if (grid.selections.items.length > 0) {
            for (var i = 0; i < grid.selections.items.length; i++) {
                if (parseInt(grid.selections.items[i].data.idaprobacion) == 1) {
                    Ext.getCmp('btnAprobar').enable();
                } else {
                    Ext.getCmp('btnDesaprobar').enable();
                }
            }
            _this.btnDelete.enable(true);
        } else {
            _this.btnDelete.disable(true);
        }
    };

    var smProd = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: listenGridProd,
            rowdeselect: listenGridProd
        }

    });

    var chkAsegurado = new Ext.grid.CheckColumn({
        header: "Asegurado",
        sortable: true,
        dataIndex: 'asegurado',
        tooltip: 'Asegurado',
        editable: true,
        editor: {
            xtype: 'checkbox'/*,
             cls: 'x-grid-checkheader-editor'*/
        },
        width: 35,
        listeners: {
            'checkchange': function() {
                alert('checkchange');
            },
            change: function() {
                alert('change');
            }
        }
    });

    /*chkAsegurado.onclick('click', function(element, evt, record) {
     alert(record.get('select'));
     });*/



    var cmProduccion = new Ext.grid.ColumnModel([smProd,
        {
            header: 'Denominación',
            id: 'expandir',
            tooltip: 'Denominaci&oacute;n de la carta tecnol&oacute;gica',
            dataIndex: 'denominacion',
            renderer: crearToolTip

        }, {
            header: 'Producto',
            tooltip: 'Denominaci&oacute;n del indicador',
            width: 80,
            dataIndex: 'denomindicador',
            renderer: crearToolTip,
            hidden: true

        }, {
            header: 'Valor rendimiento',
            tooltip: 'Valor rendimiento',
            width: 80,
            dataIndex: 'valorrendimiento',
            renderer: crearToolTip,
            hidden: true

        }, /* {
         header: 'UM producci&oacuten',
         width: 80,
         tooltip: 'Unidad de medida de la producci&oacuten',
         dataIndex: 'idumedidarendimiento',
         renderer: crearToolTip,
         hidden: true
         },*/ {
            header: 'Nivel de actividad',
            width: 50,
            tooltip: 'Nivel de actividad',
            align: 'right',
            dataIndex: 'nivelactividad',
            editor: new Ext.form.NumberField({
                allowNegative: false,
                allowBlank: false,
                regex: /^([0-9.]+ ?[0-9.]*)+$/,
                regexText: 'El tamaño máximo requerido es 9 dígitos',
                maxLength: 9,
                maxLengthText: 'El tamaño máximo requerido es 9 dígitos.',
                listeners: {
                    keypress: function() {
                        _this.btnGuardar.enable();
                    },
                    change: function() {
                        _this.btnGuardar.enable();
                    }
                }
            }),
            renderer: crearToolTip
        }, {
            header: 'VPH',
            tooltip: 'Volumen de producción histórico',
            width: 30,
            maxLength: 19,
            allowBlank: false,
            maxLengthText: 'El tamaño máximo requerido es 19 dígitos.',
            align: 'right',
            dataIndex: 'volumenproduccionhistorico',
            editor: new Ext.form.NumberField({
                allowBlank: false,
                regex: /^([0-9.]+ ?[0-9.]*)+$/,
                regexText: 'El tamaño máximo requerido es 9 dígitos',
                maxLength: 9,
                maxLengthText: 'El tamaño máximo requerido es 9 dígitos.',
                allowNegative: true,
                listeners: {
                    keypress: function() {
                        _this.btnGuardar.enable();
                    },
                    change: function() {
                        _this.btnGuardar.enable();
                    }
                }
            }),
            renderer: crearToolTip
        }, {
            header: 'VPC',
            tooltip: 'Volumen de producción por carta tecnológica',
            width: 30,
            maxLength: 19,
            maxLengthText: 'El tamaño máximo requerido es 19 dígitos.',
            align: 'right',
            dataIndex: 'productividadest',
            renderer: crearToolTip
        }, {
            header: 'Fecha inicio',
            width: 40,
            tooltip: 'Fecha inicio',
            align: 'center',
            dataIndex: 'fechainicio',
            renderer: crearToolTip
        }, {
            header: 'Fecha',
            width: 40,
            tooltip: 'Fecha',
            dataIndex: 'fecha',
            align: 'center',
            renderer: crearToolTip,
            editor: new Ext.form.DateField({
                format: 'd/m/Y',
                allowBlank: false,
                invalidText: 'Formato: d/m/a',
                listeners: {
                    select: function() {
                        _this.btnGuardar.enable();
                        _this.banDate = 1;
                    },
                    change: function() {
                        _this.btnGuardar.enable();
                        _this.banDate = 1;
                    }
                }
            })
        }, {
            header: 'Fecha fin',
            width: 40,
            tooltip: 'Fecha fin',
            align: 'center',
            dataIndex: 'fechafin',
            renderer: crearToolTip
        }, {
            header: 'Variable de control',
            width: 50,
            tooltip: 'Variable de control',
            dataIndex: 'idvariablecontrol',
            renderer: crearToolTip
        },
        chkAsegurado,
        {
            header: 'Aprobado',
            width: 50,
            tooltip: 'Aprobado',
            dataIndex: 'idaprobacion',
            align: 'center',
            renderer: modificarAprobado
        },
        /**
         *
         */
        {
            header: "Agrupaci&oacute;n",
            width: 110,
            tooltip: 'Agrupaci&oacute;n',
            sortable: true,
            dataIndex: 'idvariablecontrolraiz',
            hidden: true,
            renderer: function(value, m) {
                m.attr = 'ext:qtip="' + value + '"';
                for (i in stagrupacionCT.data.items) {
                    if (stagrupacionCT.data.items[i].data != undefined) {
                        if (stagrupacionCT.data.items[i].data.idvariablecontrolraiz == value) {
                            m.attr = 'ext:qtip="' + stagrupacionCT.data.items[i].data.denominacionraiz + '"';
                            return stagrupacionCT.data.items[i].data.denominacionraiz;
                            break;
                        }
                    }
                }
            }
        }
    ]);

    _this.filtrosProducciones = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'denomindicador'

            }, {
                type: 'numeric',
                dataIndex: 'valorrendimiento'
            }, {
                type: 'numeric',
                dataIndex: 'nivelactividad'
            }, {
                type: 'numeric',
                dataIndex: 'volumenproduccionhistorico'
            }, {
                type: 'numeric',
                dataIndex: 'productividadest'
            }, {
                type: 'date',
                dataIndex: 'fechainicio'
            }, {
                type: 'date',
                format: 'm/d/Y',
                dataIndex: 'fecha'
            }, {
                type: 'date',
                dataIndex: 'fechafin'
            }, {
                type: 'listado',
                dataIndex: 'idvariablecontrol',
                idcombo: 'idcbvariable',
                valueFieldcb: 'idvariable',
                displayFieldcb: 'denominacionvariable',
                st: _this.stvariableGP,
                autoload: false,
                mode: 'local'

            }, {
                type: 'list',
                dataIndex: 'asegurado',
                options: ['Sí', 'No']
            }, {
                type: 'list',
                dataIndex: 'idaprobacion',
                options: ['Aprobado', 'Desaprobado']
            }, {
                type: 'listado',
                dataIndex: 'idvariablecontrolraiz',
                idcombo: 'idcbagrupacion',
                valueFieldcb: 'idvariablecontrolraiz',
                displayFieldcb: 'denominacionraiz',
                st: stagrupacionCT,
                autoload: false,
                mode: 'local'
            }],
        listeners: {
            befereload: function() {

            }
        }
    });

    /**
     * Store principal de grid de Producciones
     * @type {Ext.data.GroupingStore}
     */
    _this.stProducciones = new Ext.data.GroupingStore({
        url: 'listarProducciones',
        sortInfo: {field: 'denominacion', direction: "DESC"},
        groupField: 'denomindicador',
        listeners: {
            beforeload: function() {
                this.baseParams.identidad = _this.idEntidad_Sel;
                this.baseParams.global = _this.globalC;
                this.baseParams.idejercicio = _this.cmbEjercicio.getValue();
                this.baseParams.start = offsetProducciones;
                this.baseParams.Arrayfiltros = Ext.encode(_this.filtrosProducciones.getFilterData());
                _this.banDate = 0;
            },
            load: function(store, records, options) {
                cambiarTituloFiltrar(_this.gProduccion, _this.filtrosProducciones, "Producciones", _this.gProduccion);
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            root: "data"
        }, [{
                name: 'idaplicacioncartatec'

            }, {
                name: 'idcartatecnologica'
            }, {
                name: 'valorrendimiento'
            }, {
                name: 'denominacion'
            }, {
                name: 'denomindicador'
            }, {
                name: 'fecha'
            }, {
                name: 'fechainicio'
            }, {
                name: 'fechafin'
            }, {
                name: 'productividadest'
            }, {
                name: 'nivelactividad'
            }, {
                name: 'productividadest'
            }, {
                name: 'volumenproduccionhistorico'
            }, {
                name: 'asegurado'
            }, {
                name: 'idaprobacion'
            }, {
                name: 'idumedidarendimiento'
            }, {
                name: 'idvariablecontrol'
            }, {
                name: 'idvariablecontrolraiz'
            }
            , {
                name: 'minActividad'
            }, {
                name: 'maxActividad'
            }

        ])
    });

    /**
     * Grid principal de Producciones
     * @type {Ext.grid.EditorGridPanel}
     */
    _this.gProduccion = new Ext.grid.EditorGridPanel({
        frame: true,
        disabled: true,
        loadMask: {
            msg: 'Cargando...'
        },
        autoScroll: true,
        autoExpandColumn: 'expandir',
        title: 'Producciones',
        store: _this.stProducciones,
        stripeRows: true,
        margins: '2 2 2 -4',
        tbar: [_this.btnAddCartaTecnologica, _this.btnGuardar, _this.btnDelete, _this.mbaprob, '-', _this.chglobal, '-', _this.btnExportarProd, '-', btnGraficoPlanif],
        plugins: [_this.filtrosProducciones, chkAsegurado],
        region: 'center',
        view: new Ext.grid.GroupingView({
            forceFit: true,
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Producciones" : "Producción"]})'
        }),
        cm: cmProduccion,
        sm: smProd,
        md: _this.mdProducciones,
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: _this.stProducciones,
            displayInfo: true,
            items: ['-', _this.btnLimpiar],
            listeners: {
                beforechange: function(p, e) {
                    offsetProducciones = e.start;
                }
            }
        }),
        listeners: {
            rowcontextmenu: function(g, r, e) {
                e.stopEvent();
                g.getSelectionModel().selectRow(r);
                g.md.showAt(e.getXY());
            },
            filterupdate: function(me, filter) {

            },
            beforeedit: function(object) {
                if (object.record.data.idaprobacion === "1") {
                    object.cancel = false;
                } else {
                    object.cancel = true;
                }
            },
            'checkrow': function() {
                alert('checkrow');
            }
        }
    });

    /****************panel  para el grid de planes*****************/
    _this.pgridProduccion = new Ext.Panel({
        region: 'center',
        layout: 'fit',
        items: [_this.gProduccion]
    });
    //******************panel central para los grid  planes y servicios*****************
    _this.pcentral = new Ext.Panel({
        region: 'center',
        layout: 'border',
        items: [_this.pgridProduccion]
    });

    _this.pProducciones = new Ext.Panel({
        layout: 'border',
        tbar: ['Ejercicio:  ', _this.cmbEjercicio],
        items: [_this.trEntidad, _this.pcentral]
    });

    //***************  viewport*************************
    _this.myView = new Ext.Viewport({
        items: [_this.pProducciones],
        layout: 'fit',
        id: 'myView'
    });
}//fin de caragar interfaz

/**
 * Interfaz con el listado de cartas tecnologicas disponibles segun la entidad
 * @param idEntidad
 * @param cmbEjercicio
 */
function viewCartaTegnologica(idEntidad, cmbEjercicio) {

    var _this = this;
    _this.arrayVariables = [];

    _this.myMaskCT = new Ext.LoadMask(Ext.getBody(), {msg: "cargando cartas tecnol&oacute;gicas..."});

    _this.btnCancelarAddcarta = new Ext.Button({
        text: 'Cancelar',
        disabled: false,
        iconCls: 'cancelar',
        //tooltip: perfil.etiquetas.msgCerrarSinGuardar,
        handler: function() {
            _this.wAddCarta.destroy();
        }
    });

    _this.btnAceptarAddcarta = new Ext.Button({
        text: 'Aceptar',
        disabled: true,
        iconCls: 'aceptar',
        //tooltip: perfil.etiquetas.msgGuardaryCerrar,
        handler: function() {
            gestionarProduccion(_this.cartasTecn, idEntidad, "add");
            _this.wAddCarta.destroy();
        }
    });

    _this.btnLimpiarCT = new Ext.Button({
        handler: function() {
            _this.filtrosCT.clearFilters();
            _this.stAddCarta.load();
        },
        text: 'Limpiar',
        tooltip: 'Limpiar filtro(s)<b>(Alt+L)</b>',
        id: 'btnLimpi',
        icon: perfil.dirImg + 'limpiar.png',
        iconCls: 'btn'
    });

    /**
     * Variables de control --> Store
     */
    stumCT = new Ext.data.Store({
        url: '/planificacion/planmeta/index.php/bpgestactividades/cargarunidadmedida',
        id: 'stumCT',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idunidadmedida'
        },
        [{
                name: 'idunidadmedida'
            }, {
                name: 'denominacionunidadmedida'
            }]),
        listeners: {
            beforeload: function() {
            },
            load: function() {
                stvariableCT.reload();
            }
        }
    });
    stumCT.reload();
    stvariableCT = new Ext.data.Store({
        url: 'cargarVariables',
        autoLoad: false,
        reader: new Ext.data.JsonReader({
            id: 'idvariable',
            root: 'data'
        }, [{
                name: 'idvariable'
            }, {
                name: 'denominacionvariable'
            }]),
        listeners: {
            load: function(Store, records, options) {
                _this.stAddCarta.reload({
                    params: {
                        start: 0,
                        identidad: idEntidad,
                        limit: 10
                    }
                });
            }
        }
    });

    _this.stAddCarta = new Ext.data.Store({
        url: 'listarCartasProduccion',
        reader: new Ext.data.JsonReader({
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'idcartatecnologicaentidad'
            }, {
                name: 'idcartatecnologica'
            }, {
                name: 'denominacion'
            }, {
                name: 'idumedidarendimiento'
            }, {
                name: 'idvariablecontrol'
            }, {
                name: 'idvariablecontrolraiz'
            }, {
                name: 'valorrendimiento'
            },
            {
                name: 'denoindicador'
            }, {
                name: 'denominacionraiz'
            }, {
                name: 'variablecontrol'
            }, {
                name: 'idumedidarendimiento'
            }]),
        listeners: {
            beforeload: function(me, options) {
                me.baseParams.identidad = idEntidad;
            },
            load: function(record, config) {
                if (record.length == 0) {
                    if (_this.filtrosCT.getFiltrosActivos() == undefined || _this.filtrosCT.getFiltrosActivos().length == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    } else {
                        mostrarMensaje(1, "No existen datos que se correspondan con el criterio de b&uacute;squeda especificado.");
                    }

                } else {
                    _this.myMaskCT.hide();
                    cambiarTituloFiltrar(_this.gpAddCarta, _this.filtrosCT, "Cartas tecnológicas", _this.wAddCarta);
                }

            }
        }
    });

    var listenGrid = function(grid, rowIndex, e) {
        _this.cartasTecn = [];
        _this.cartasTecn = grid.selections.items;
        if (grid.selections.items.length > 0) {
            _this.btnAceptarAddcarta.enable(true);
        } else {
            _this.btnAceptarAddcarta.disable(true);
        }

    };

    var sm2 = new Ext.grid.CheckboxSelectionModel({
        listeners: {
            rowselect: listenGrid,
            rowdeselect: listenGrid
        }

    });

    _this.filtrosCT = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'string',
                dataIndex: 'denoindicador'
            }, {
                type: 'numeric',
                dataIndex: 'valorrendimiento'
            }, {
                type: 'listado',
                dataIndex: 'idumedidarendimiento',
                idcombo: 'idcbumrendimiento',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stumCT,
                autoload: false,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'idvariablecontrol',
                idcombo: 'idcbvariable',
                valueFieldcb: 'idvariable',
                displayFieldcb: 'denominacionvariable',
                st: stvariableCT,
                autoload: false,
                mode: 'local'
            }, {
                type: 'listado',
                dataIndex: 'idvariablecontrolraiz',
                idcombo: 'idcbagrupacion',
                valueFieldcb: 'idvariablecontrolraiz',
                displayFieldcb: 'denominacionraiz',
                st: stagrupacionCT,
                autoload: false,
                mode: 'local'
            }]
    });

    stumCT.reload();

    _this.gpAddCarta = new Ext.grid.GridPanel({
        store: _this.stAddCarta,
        columns: [
            sm2, {
                header: "Denominacion",
                width: 140,
                tooltip: 'Denominaci&oacute;n de la carta',
                sortable: true,
                dataIndex: 'denominacion',
                renderer: crearToolTip
            }, {
                header: "Producto",
                width: 140,
                tooltip: 'Producto de la carta',
                sortable: true,
                dataIndex: 'denoindicador',
                renderer: crearToolTip
            },
            {
                header: "Valor rendimiento",
                width: 140,
                tooltip: 'Rendimiento de la carta',
                sortable: true,
                align: 'right',
                dataIndex: 'valorrendimiento',
                renderer: crearToolTip
            }, {
                header: "UM",
                width: 50,
                tooltip: 'UM del rendimiento',
                sortable: true,
                hidden: true,
                dataIndex: 'idumedidarendimiento',
                renderer: renderUMCT
            },
            {
                header: "Variable",
                width: 110,
                tooltip: 'Variable de control',
                sortable: true,
                dataIndex: 'idvariablecontrol',
                renderer: function(value, m) {
                    var _this = this;
                    m.attr = 'ext:qtip="' + value + '"';
                    for (i in stvariableCT.data.items) {
                        if (stvariableCT.data.items[i].data != undefined) {
                            if (stvariableCT.data.items[i].data.idvariable == value) {
                                m.attr = 'ext:qtip="' + stvariableCT.data.items[i].data.denominacionvariable + '"';
                                return stvariableCT.data.items[i].data.denominacionvariable;
                                break;
                            }
                        }
                    }
                }
            }, {
                header: "Agrupaci&oacute;n",
                width: 110,
                tooltip: 'Agrupaci&oacute;n',
                sortable: true,
                dataIndex: 'idvariablecontrolraiz',
                renderer: function(value, m) {
                    m.attr = 'ext:qtip="' + value + '"';
                    for (i in stagrupacionCT.data.items) {
                        if (stagrupacionCT.data.items[i].data != undefined) {
                            if (stagrupacionCT.data.items[i].data.idvariablecontrolraiz == value) {
                                m.attr = 'ext:qtip="' + stagrupacionCT.data.items[i].data.denominacionraiz + '"';
                                return stagrupacionCT.data.items[i].data.denominacionraiz;
                                break;
                            }
                        }
                    }
                }
            }
        ],
        sm: sm2,
        plugins: [_this.filtrosCT],
        listeners: {
            celldblclick: function() {
                // wAddIndicadorSalida.destroy();
            }
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 10,
            store: _this.stAddCarta,
            items: [_this.btnLimpiarCT],
            displayInfo: true,
            displayMsg: 'Mostrando {0} - {1} de {2}',
            emptyMsg: "No existen datos que mostrar.",
            listerns: {
                beforechange: function(p, e) {
                    offsetCartas = e.start;
                }
            }
        })
    });


    _this.pAddIndicadorSalida = new Ext.Panel({
        frame: true,
        layout: 'fit',
        items: [_this.gpAddCarta]
    });

    /**
     * metodos auxiliares---------------------------------
     */

    function renderVariableCT(value, m) {
        var _this = this;
        m.attr = 'ext:qtip="' + value + '"';
        for (i in _this.stvariableCT.data.items)
            if (_this.stvariableCT.data.items[i].data.idvariable == value) {
                m.attr = 'ext:qtip="' + _this.stvariableCT.data.items[i].data.denominacionvariable + '"';
                return _this.stvariableCT.data.items[i].data.denominacionvariable;
            }
    }

    _this.wAddCarta = new Ext.Window({
        title: 'Cartas tecnol&oacute;gicas',
        modal: true,
        closeAction: 'destroy',
        constrain: true,
        layout: 'fit',
        items: _this.pAddIndicadorSalida,
        resizable: false,
        width: 700,
        height: 400,
        listeners: {
            beforeshow: function() {
                //stAddIndicadorSalida.load();
            }
        },
        buttons: [_this.btnCancelarAddcarta, _this.btnAceptarAddcarta]
    });

    _this.wAddCarta.show();
    _this.myMaskCT.show();
}

/**
 * funcion parea gestionar las producciones
 * @param params
 * @param idEntidad
 * @param action
 */
function gestionarProduccion(params, idEntidad, action) {
    var _this = this;
    var idEjercicio = _this.cmbEjercicio.getValue();
    var cartas = [];

    _this.myMask = new Ext.LoadMask(Ext.getBody(), {msg: "cargando..."});
    _this.myMask.show();
    for (var i = 0; i < params.length; i++) {
        cartas.push(params[i].data);
    }

    Ext.Ajax.request({
        url: 'gestionarProduccion',
        params: {
            newDate: _this.banDate,
            action: action,
            idEntidad: idEntidad,
            cartaTecnologica: Ext.encode(cartas),
            idejercicio: idEjercicio
        },
        callback: function(options, success, response) {
            var responseData = Ext.decode(response.responseText);
            var textCartas = responseData.cantidad > 1 ? "Las producciones fueron adicionadas" : "La producci&oacute;n fue adicionada";
            if (responseData.codMsg == 1) {

                if (responseData.mensaje == "delete") {
                    var textCartasDel = responseData.cantidad > 1 ? "Las producciones fueron eliminadas" : "La producci&oacute;n fue eliminada";
                    mostrarMensaje(1, textCartasDel + " satisfactoriamente.")
                } else {
                    responseData.mensaje == "add" ? mostrarMensaje(1, textCartas + " satisfactoriamente.") : mostrarMensaje(1, " Los cambios fueron guardados satisfactoriamente.");
                }
                _this.myMask.hide();

                if (responseData.mensaje == "mod") {
                    for (var i = 0; i < params.length; i++) {
                        params[0].commit();
                        i--;
                    }
                }
                _this.stProducciones.reload();

            } else {
                if (responseData.codMsg == 3) {
                    _this.myMask.hide();

                    mostrarMensaje(1, "Ocurrió un error.");
                }
            }

        }
    });
}

/**
 * modificar los cambios realizados en las producciones listadas
 */
function saveCambios() {
    var _this = this;
    var modified = [];
    var modified = _this.gProduccion.getStore().getModifiedRecords();

    gestionarProduccion(modified, _this.idEntidad_Sel, "mod");

}

/**
 * validar la eliminacion de la(s) produccion(es)
 */
function validarEliminacion() {
    var _this = this;
    var eliminar = [];
    var eliminar = _this.produccionesSel;

    var cant = eliminar.length > 1 ? " las producciones seleccionadas?" : " la producci&oacute;n seleccionada?";

    mostrarMensaje(2, "¿Est&aacute; seguro que quiere eliminar" + cant, eliminarProducciones);

}

/**
 * funcion para eliminar produccion(es)
 * @param btnPresionado
 */
function eliminarProducciones(btnPresionado) {
    var _this = this;
    var aprobado = false;
    var eliminar = [];
    var eliminar = _this.produccionesSel;

    if (btnPresionado == 'ok') {
        for (var i = 0; i < eliminar.length; i++) {
            if (parseInt(eliminar[i].data.idaprobacion) != 1) {
                aprobado = true;
            }
        }
        if (aprobado) {
            var textP = eliminar.length > 1 ? " Las producciones no pueden ser eliminadas" : " La producci&oacute;n no puede ser eliminada";
            mostrarMensaje(1, textP);
        } else {
            gestionarProduccion(eliminar, _this.idEntidad_Sel, "delete");
        }
    }
}

/**
 * Metodos auxiliares-------------------------------------------------------------
 * @param v
 * @param m
 * @returns {*}
 */

function modificarAprobado(val, m) {

    if (val == 3) {
        m.attr = 'ext:qtip="' + "Especialista" + '"';
        m.css = 'icondistra-true amarillo';
    } else if (val == 4) {
        m.attr = 'ext:qtip="' + "Rector" + '"';
        m.css = 'icondistra-true verde';
    } else {
        m.attr = 'ext:qtip="' + "No" + '"';
        m.css = 'icondistra-false rojo';
    }
}

function cambiarAprobacion(aprobacion) {
    var _this = this;
    var recordsSel = _this.gProduccion.getSelectionModel().getSelections();
    _this.producciones = [];
    _this.aprobacionServer = aprobacion;
    var aprobRector = false;
    var permitido = true;

    for (var i = 0; i < recordsSel.length; i++) {
        _this.producciones.push(parseInt(recordsSel[i].data.idaplicacioncartatec));
        if (parseInt(recordsSel[i].data.idaprobacion) == 4) {
            aprobRector = true;
        }
        if (recordsSel[i].data.nivelactividad == "" || recordsSel[i].data.fecha == null) {
            permitido = false;
        }
    }
    if (!esrector && aprobRector) {
        var text = recordsSel.length > 1 ? 'existen producciones aprobadas' : 'la producci&oacute;n est&aacute; aprobada';
        mostrarMensaje(1, 'No puede realizar la acción, ' + text + '  a nivel rector.');
    } else {
        var textAprobar = aprobacion == 3 || aprobacion == 4 ? ' aprobar ' : ' desaprobar ';
        var textCant = recordsSel.length > 1 ? 'las producciones seleccionadas' : 'la producci&oacute;n seleccionada';

        if (!permitido) {

            var textFinal = recordsSel.length > 1 ? ' no pueden ser aprobadas.' : ' no puede ser aprobada.';
            mostrarMensaje(1, textCant + textFinal);
        } else {
            mostrarMensaje(2, '¿Está seguro que quiere ' + textAprobar + textCant + '?', aprobardesaprobar)
        }
    }
}

function aprobardesaprobar(btnPresionado) {
    var _this = this;
    if (btnPresionado == 'ok') {

        Ext.Ajax.request({
            url: 'aprobarProducciones',
            params: {
                producciones: Ext.encode(_this.producciones),
                aprobacion: _this.aprobacionServer
            },
            callback: function(options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == "desaprobar") {
                    var textAprobacion = responseData.cantidad > 1 ? "desaprobadas" : "desaprobada";
                } else {
                    var textAprobacion = responseData.cantidad > 1 ? "aprobadas" : "aprobada";
                }

                var textCartas = responseData.cantidad > 1 ? "Las producciones seleccionadas fueron " : "La producci&oacute;n seleccionada fue ";
                if (responseData.codMsg == 1) {
                    mostrarMensaje(1, textCartas + textAprobacion + " satisfactoriamente.");

                    _this.stProducciones.reload();

                } else {
                    if (responseData.codMsg == 3) {
                        mostrarMensaje(1, "Ocurri&oacute; un error.");
                    }
                }
            }
        });

    }
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function renderAsegurado(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    m.css += ' x-grid3-check-col-td';
    return '<div class="x-grid3-check-col' + (v ? '-on' : '') + ' x-grid3-cc-' + this.id + '">&#160;</div>';
}

function renderUMCT(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    //for (i = 0; i < filtro.getFiltrosActivos().length; i++) {
    for (i in stumCT.data.items)
        if (stumCT.data.items[i].data.idunidadmedida == value) {
            m.attr = 'ext:qtip="' + stumCT.data.items[i].data.denominacionunidadmedida + '"';
            return stumCT.data.items[i].data.denominacionunidadmedida;
        }
}

function cambiarTituloFiltrar(gridPanel, filtro, etiqueta, panel) {
    var filtrado_por = "";
    var sep = "/";
    if (filtro.getFiltrosActivos() == undefined || filtro.getFiltrosActivos().length == 0) {
        panel.setTitle(etiqueta);
    } else {
        for (i = 0; i < filtro.getFiltrosActivos().length; i++) {
            var numberCol = gridPanel.getColumnModel().findColumnIndex(filtro.getFiltrosActivos()[i].dataIndex);
            if (i == filtro.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += gridPanel.getColumnModel().getColumnHeader(numberCol) + sep;
        }
        panel.setTitle(etiqueta + ' <i>' + 'Filtrado por: ' + filtrado_por + '</i>');
        filtrado_por = "";
    }
}

/**
 * funcion para exportar los datos
 */
function exportarProducciones() {
    var _this = this;
    var idEntidad = identidadselected;
    var textEntidad = textEntidadSect;
    var idEjercicio = _this.cmbEjercicio.getValue();
    var textEjercicio = _this.cmbEjercicio.lastSelectionText;
    var checkGlobal = _this.chglobal.getValue();
    Ext.encode(_this.filtrosProducciones.getFilterData());
    var win = window.open('exportar?identidad=' + idEntidad + '&idejercicio=' + idEjercicio + '&global=' + checkGlobal + '&textEjercicio=' + textEjercicio +
            '& filtros=' + Ext.encode(_this.filtrosProducciones.getFilterData()) + '&textEntidad=' + textEntidad);
}