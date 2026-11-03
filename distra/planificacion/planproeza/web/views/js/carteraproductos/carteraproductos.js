//var perfil = eval(uneval(window.parent.UCID.portal.perfil));
var perfil = window.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('carteraproductos', cargarInterfaz);
//variable generales
var offsetCarteraP = 0, nodoEst, stum;
function cargarInterfaz() {
    btnAyudaCarteraP = new Ext.Button({
        id: 'idbtnAyudaCarteraP',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbBtnAyuda
    });
    //mascara de cargando
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbCargando

    });

    //stores
    stum = new Ext.data.Store({
        autoLoad: true,
        url: 'cargarUnidadMedida',
        id: 'stum',
        listeners: {
            beforeload: function () {
                mymask.show();
            }, load: function () {
                mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idunidadmedida'
        }, [{
                name: 'idunidadmedida'
            }, {
                name: 'denominacionunidadmedida'
            }, {
                name: 'abreviaturaunidadmedida'
            }])
    });

    //colum model del grid
    cmCarteraP = new Ext.grid.ColumnModel([{
            header: perfil.etiquetas.lbCodigo,
            tooltip: perfil.etiquetas.lbCodigo,
            width: 80,
            dataIndex: 'codigo',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbDenominacion,
            width: 200,
            tooltip: perfil.etiquetas.lbDenominacion,
            dataIndex: 'denominacion',
            renderer: crearToolTip
        }, {
            header: perfil.etiquetas.lbUM,
            tooltip: perfil.etiquetas.lbUnidadMedida,
            width: 80,
            dataIndex: 'idunidadmedida',
            renderer: renderUM
        }, {
            header: perfil.etiquetas.lbPrecio,
            tooltip: perfil.etiquetas.lbPrecio,
            width: 100,
            dataIndex: 'precio',
            align: 'right',
            renderer: renderPrecio
        }, {
            header: perfil.etiquetas.lbPrecioCUC,
            tooltip: perfil.etiquetas.lbPrecioCUC,
            width: 100,
            dataIndex: 'preciodivisa',
            align: 'right',
            renderer: renderPrecio
        }
        , {
            header: perfil.etiquetas.lbAprobado,
            tooltip: perfil.etiquetas.lbAprobado,
            width: 80,
            dataIndex: 'idaprobacion',
            renderer: renderAprobacion
        }
        , {
            header: perfil.etiquetas.lbActivado,
            tooltip: perfil.etiquetas.lbActivado,
            width: 80,
            dataIndex: 'estado',
            renderer: renderActivado
        }
        , {
            header: perfil.etiquetas.lbNivelPlanif,
            tooltip: perfil.etiquetas.lbNivelPlanif,
            width: 80,
            dataIndex: 'nivel',
            renderer: renderActivado
        }
    ]);

    //store de las entidades del grid
    stEntidad = new Ext.data.Store({
        url: 'obtenerEntidadesHijas',
        listeners: {
            beforeload: function (st, opt) {
                mymask.show();
                this.baseParams.identidad = nodoEst.attributes.id;
                this.baseParams.denomentidad = nodoEst.attributes.denominacion;
            },
            load: function () {
                mymask.hide();
                stCarteraP.reload();

            }
        },
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'identidad'
            }, {
                name: 'denominacion'
            }])
    });

    //filtros del grid Cartera de Productos
    filtrosCarteraP = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false,
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/,
                strEmptyText: ''
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'listado',
                dataIndex: 'idunidadmedida',
                idcombo: 'idunidadmedida',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'numeric',
                dataIndex: 'preciodivisa'
            }, {
                type: 'list',
                dataIndex: 'idaprobacion',
                options: [[1, perfil.etiquetas.lbDesaprobado], [3, perfil.etiquetas.lbAprobadoEspecialista], [4, perfil.etiquetas.lbAprobadoRector]]
            }, {
                type: 'list',
                dataIndex: 'estado',
                options: [[1, perfil.etiquetas.lbSi], [0, perfil.etiquetas.lbNo]]
            }, {
                type: 'list',
                dataIndex: 'nivel',
                options: [[1, perfil.etiquetas.lbSi], [0, perfil.etiquetas.lbNo]]
            }

        ]
    });

    // ********** SelectionModel del Grid Cartera de Productos ***************
    smCarteraP = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        id: 'smCarteraP',
        listeners: {
            rowdeselect: function (sm, rowIndex, record) {


            },
            rowselect: function (sm, rowIndex, record) {
                if (record.data.rector === false)
                {

                }
            }
        }
    });

    //store del grid de la Cartera de Productos
    stCarteraP = new Ext.data.Store({
        url: 'listarCarteraProductos',
        method: 'POST',
        listeners: {
            beforeload: function (st, opt) {
                mymask.show();
                this.baseParams.identidad = nodoEst.attributes.id;
                this.baseParams.start = offsetCarteraP;
            },
            load: function (t) {
                if (stCarteraP.getCount() == 0) {
                    if (nodoEst.id != 'Estructuras') {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                }
                mymask.hide();
                cambiarTituloFiltrar(gpCarteraP, filtrosCarteraP, perfil.etiquetas.lbCarteraP);
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'idindicador',
            root: 'data',
            totalProperty: 'total'
        }, [{
                name: 'codigo'
            }, {
                name: 'denominacion'
            }, {
                name: 'idunidadmedida'
            }, {
                name: 'precio'
            }, {
                name: 'preciodivisa'
            }, {
                name: 'idaprobacion'
            }, {
                name: 'estado'
            }, {
                name: 'nivel'
            }
        ])

    });
    //btn LimpiarFiltros
    btnLimpiarFiltros = new Ext.Button({
        id: 'btnLimpiarFiltros',
        iconCls: 'limpiar',
        tooltip: perfil.etiquetas.lbLimpiar,
        handler: function () {
            filtrosCarteraP.clearFilters();
        }
    });
    btnExportar = new Ext.Button({
        id: 'btnExportar',
        disabled: true,
        iconCls: 'exportar',
        tooltip: perfil.etiquetas.lbExportar,
        handler: function () {
            window.open('exportarCarteraProductos?identidad=' + nodoEst.attributes.id +
                     '&denoentidad=' + nodoEst.attributes.text +
                    '&filtros=' + Ext.encode(filtrosCarteraP.getFilterData()));
        }
    });

    //Panel de las entidades
    tpEstructura = new Ext.estructura.panel.PanelEstructura(
            {
                cargos: false,
                menu: false
            });
    tpEstructura.btnBuscar.setText("");
    tpEstructura.btnLimpiar.setText("");
    tpEstructura = tpEstructura.items.items[0];
    tpEstructura.getRootNode().expand();
    tpEstructura.region = 'west';
    tpEstructura.width = 300;
    tpEstructura.split = true;
    tpEstructura.collapsible = true;
    tpEstructura.addListener('click', function (n) {
        nodoEst = n;
        if (n.leaf) {
            is_leaf = true;
        } else {
            is_leaf = false;
        }
        if (n.id != 'Estructuras') {

            stEntidad.reload();
            gpCarteraP.enable();
            btnExportar.enable();
        } else {
            gpCarteraP.disable();
            if (stCarteraP)
                stCarteraP.loadData({"data": [], "total": 0});
        }
    });
    //panel de las estructuras
    pEstructuras = new Ext.Panel({
        title: 'Entidades',
        layout: 'fit',
        region: 'west',
        width: 300,
        collapsible: true,
        split: true,
        items: [tpEstructura]
    });
    //Grid panel de la cartera de productos
    gpCarteraP = new Ext.grid.GridPanel({
        title: perfil.etiquetas.lbCarteraP,
        region: 'center',
        //autoExpandColumn: 'Entidad',
        autoScroll: true,
        enableKeyEvents: true,
        id: 'gpCarteraP',
        disabled: true,
        //clicksToEdit: 2,
        //stripeRows: true,
        store: stCarteraP,
        sm: smCarteraP,
        plugins: [filtrosCarteraP],
        cm: cmCarteraP,
        tbar: [btnExportar],
//        listeners: {
//            checkcolumn: function () {
//                btnGuardar.enable();
//            }},
        bbar: new Ext.PagingToolbar({
            store: stCarteraP,
            displayInfo: true,
            listeners: {
                beforechange: function (p, e) {
                    offsetCarteraP = e.start;
                }
            },
            items: ['-', btnLimpiarFiltros]
        })
    });
    //panel General contiene el tree de las entidades y el grid de la cartera
    panelGeneral = new Ext.Panel({
        id: 'panelGeneral',
        //disabled: false,
        region: 'center',
        // split: true,
        layout: 'border',
        items: [pEstructuras, gpCarteraP]
    });
    //panel del componente
    panelGen = new Ext.Panel({
        id: 'panelGen',
        tbar: ['->', btnAyudaCarteraP],
        layout: 'fit',
        items: [panelGeneral]
    });
    // viewport de la plantilla
    vpCarteraP = new Ext.Viewport({
        layout: 'fit',
        id: 'vpCarteraP',
        items: [panelGen]
    });
}



function cambiarTituloFiltrar(gridPanel, filtro, etiqueta) {
    var filtrado_por = "";
    var sep = "/";
    if (filtro.getFiltrosActivos() == undefined || filtro.getFiltrosActivos().length == 0) {

        gridPanel.setTitle(etiqueta);
    } else {
        for (i = 0; i < filtro.getFiltrosActivos().length; i++) {
            var numberCol = gridPanel.getColumnModel().findColumnIndex(filtro.getFiltrosActivos()[i].dataIndex);
            if (i == filtro.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += gridPanel.getColumnModel().getColumnHeader(numberCol) + sep;
        }
        gridPanel.setTitle(etiqueta + " - <i> " + perfil.etiquetas.lbFiltradoPor + filtrado_por + '</i>');
        filtrado_por = "";
    }
}

function crearToolTip(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}

function renderUM(value, m) {

    for (var i = 0; i < stum.getTotalCount(); i++) {
        if (stum.data.items[i].data.idunidadmedida == value) {
            m.attr = 'ext:qtip="' + stum.data.items[i].data.denominacionunidadmedida + '"';
            return stum.data.items[i].data.abreviaturaunidadmedida;
        }
    }
    m.attr = 'ext:qtip="' + value + '"';
    return value;
}

function renderAprobacion(val, m) {
    if (val === '1') {
        m.css = 'icondistra-false rojo';
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
    } else if (val === '3') {
        m.css = 'icondistra-true amarillo';
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbAprobadoEspecialista + '"';
    } else if (val === '4') { //Organo Rector (UIM)
        m.css = 'icondistra-true verde';
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbAprobadoRector + '"';
    }
}

function renderActivado(val, m) {
    if (val === '0') {
        m.css = 'icondistra-false rojo';
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbNo + '"';
    } else if (val === '1') {
        m.css = 'icondistra-true verde';
        m.attr = 'ext:qtip="' + perfil.etiquetas.lbSi + '"';
    }
}

function renderPrecio(val) {
    return parseFloat(val).toFixed(2);
}

