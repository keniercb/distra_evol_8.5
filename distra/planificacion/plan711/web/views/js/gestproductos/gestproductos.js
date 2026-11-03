var perfil = window.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.etiquetas = {};
UCID.portal.cargarEtiquetas('gestproductos', cargarInterfaz);
var btnAdicionar, btnModificar, btnEliminar, btnAyuda;
var stGpProductos, smGpProductos, gpGpProductos, idplan711, offset = 0;
function cargarInterfaz() {
    
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });
    
    btnAdicionar = new Ext.Button({
        handler: function () {
            accionventana = 1;
            winFp(accionventana);
        },
        tooltip: 'Adicionar producto',
        disabled: false,
        hidden : true,
        id: 'btnAdicionar',
        iconCls: 'adicionar'
    });
    
    btnAdicionarInd = new Ext.Button({
        handler: function () {
            accionventana = 1;
            winAddInd(accionventana);
        },
        tooltip: 'Adicionar indicador',
        disabled: false,
        hidden : true,
        id: 'btnAdicionarInd',
        iconCls: 'adicionar'
    });
    
    btnAdicionarTarea = new Ext.Button({
        handler: function () {
            accionventana = 1;
            winAddTarea(accionventana);
        },
        tooltip: 'Adicionar tarea',
        disabled: false,
        hidden : true,
        id: 'btnAdicionarTarea',
        iconCls: 'adicionar'
    });
    
    btnAprobarIndicadores = new Ext.Button({
        handler: function () {
            AprobarIndicadores();
        },
        tooltip: 'Aprobar todos los indicadores del maestro',
        id: 'btnAprobarIndicadores',
        iconCls: 'aprobar'
    });
    
    btnModificar = new Ext.Button({
        handler: function () {
            accionventana = 2;
            winFp(accionventana);
        },
        tooltip: perfil.etiquetas.lbTtbtnMod,
        disabled: true,
        hidden : true,
        id: 'btnMod',
        iconCls: 'modificar'
    });
    btnEliminar = new Ext.Button({
        handler: function () {
            EliminarProducto();
        },
        tooltip: perfil.etiquetas.lbTtbtnDel,
        disabled: true,
        id: 'btnEli',
        iconCls: 'eliminar'
    });
    btnAyuda = new Ext.Button({
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbTtBtnAyu,
        id: 'btnAyudaProdIndTareas',
        iconCls: 'ayuda'
    });    

    btnLimpiar = new Ext.Toolbar.Button({
        iconCls: 'limpiar',
        tabIndex: 11,
        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
        id: 'btntodos',
        disabled: false,
        handler: function () {
            filtrospersonas711.clearFilters();
        }
    });
    
    stTipos = new Ext.data.SimpleStore({
        fields: ['Tipo', 'id'],
        data : [['Indicador', 1],['Tarea', 2]]
        });
        
    cbTiposProducto = new Ext.form.ComboBox({
        id: 'idcbConsolidada',
        emptyText: 'Seleccione',
        width: 200,
        disabled: false,
        store: stTipos,
        fieldLabel: 'Tipo',
        displayField: 'Tipo',
        valueField: 'id',
        typeAhead: true,
        anchor: '80%',
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                if(rec.data.id==0){
                    btnAdicionar.show();
                    btnModificar.show();
                    btnAdicionarInd.hide();
                    btnAdicionarTarea.hide();
                    gpGpProductos.reconfigure(stGpProductos, cmProductos);
                }
                if(rec.data.id==1){
                    btnAdicionarInd.show();
                    btnAdicionar.hide();
                    btnModificar.hide();
                    btnAdicionarTarea.hide();
                    gpGpProductos.reconfigure(stGpProductos, cmIndicadores);
                }
                if(rec.data.id==2){
                    btnAdicionarTarea.show()
                    btnAdicionar.hide();
                    btnModificar.hide();
                    btnAdicionarInd.hide();
                    gpGpProductos.reconfigure(stGpProductos, cmTareas);
                }
                
                stGpProductos.reload();
            }
        }
    });
    
    agregarmodificarproducto();

    aux = new Ext.data.Store({
        //autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                aux.baseParams.uri = 4;
            },
            load: function (t) {
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
                )
    });
    
    // Store grid stGpProductos
    stGpProductos = new Ext.data.Store({
        url: 'listarProductos711',
        listeners: {
            beforeload: function () {
                stGpProductos.removeAll();
                stGpProductos.baseParams.start = offset;
                stGpProductos.baseParams.tipo = cbTiposProducto.getValue();
                //cambiarTituloFiltrar(gpGpProductos, filtrospersonas711, perfil.etiquetas.lbFiltradoPor);
            },
            load: function(){
                btnModificar.disable();
                btnEliminar.disable();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'idproducto711'
            }, {
                name: 'denominacion'
            }, {
                name: 'precio'
            }, {
                name: 'codigocup'
            }, {
                name: 'iddatosunidadmedida'
            }, {
                name: 'um'
            }, {
                name: 'iddatosempimp'
            }, {
                name: 'importadora'
            }, {
                name: 'numeropieza'
            }, {
                name: 'tipo'
            }, {
                name: 'plan'
            }
            
        ]
                )
    });

    // Selection Model grid smGpProductos
    smGpProductos = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            beforerowselect: function (sm, y, z, record) {
                btnModificar.enable();
                btnEliminar.enable();
            }
        }
    });

    // Filtros para cada columna de tipo de modelo
    filtrosproductos = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            },{
                type: 'string',
                dataIndex: 'codigocup'
            },{
                type: 'string',
                dataIndex: 'numeropieza'
            },{
                type: 'string',
                dataIndex: 'importadora'
            },{
                type: 'string',
                dataIndex: 'plan'
            }]
    });
    
    cmProductos = new Ext.grid.ColumnModel([
        {
                hidden: true,
                hideable: false,
                dataIndex: 'idproducto711'
            }, {
                id: 'expandir',
                header: 'Denominación',
                tooltip: 'Denominación',
                sortable: true,
                dataIndex: 'denominacion',
                renderer: crearToolTip
            }, {
                header: 'Precio',
                tooltip: 'Precio',
                width: 200,
                align: 'rigth',
                sortable: true,
                dataIndex: 'precio',
                renderer: crearToolTip
            }, {
                header: 'Codigo CUP',
                tooltip: 'Codigo CUP',
                width: 200,
                align: 'center',
                sortable: true,
                dataIndex: 'codigocup',
                renderer: crearToolTip
            }, {
                header: 'Código de pieza',
                tooltip: 'Código de pieza',
                width: 200,
                align: 'center',
                sortable: true,
                dataIndex: 'numeropieza',
                renderer: crearToolTip
            }, {
                header: 'Empresa importadora',
                tooltip: 'Empresa importadora',
                width: 200,
                align: 'center',
                sortable: true,
                dataIndex: 'importadora',
                renderer: crearToolTip
            }, {
                header: 'Unidad de medida',
                tooltip: 'Unidad de medida',
                width: 200,
                align: 'center',
                sortable: true,
                dataIndex: 'um',
                renderer: crearToolTip
            }
    ]);
    
    cmIndicadores = new Ext.grid.ColumnModel([
        {
                hidden: true,
                hideable: false,
                dataIndex: 'idproducto711'
            }, {
                id: 'expandir',
                header: 'Denominación',
                tooltip: 'Denominación',
                sortable: true,
                dataIndex: 'denominacion',
                renderer: crearToolTip
            }
    ]);
    
    cmTareas = new Ext.grid.ColumnModel([
        {
                hidden: true,
                hideable: false,
                dataIndex: 'idproducto711'
            }, {
                id: 'expandir',
                header: 'Denominación',
                tooltip: 'Denominación',
                sortable: true,
                dataIndex: 'denominacion',
                renderer: crearToolTip
            }, {
                header: 'Plan',
                tooltip: 'Plan',
                width: 200,
                align: 'center',
                sortable: true,
                dataIndex: 'plan',
                renderer: crearToolTip
            }
    ]);

    //Grid gestion gpGpProductos
    gpGpProductos = new Ext.grid.GridPanel({
        frame: true,
        autoExpandColumn: 'expandir',
        region: 'center',
        layout: 'fit',
        store: stGpProductos,
        sm: smGpProductos,
        cm: cmProductos,
        //md: menuConfigAtributo,
        loadMask: {
            store: stGpProductos
        },
        bbar: new Ext.PagingToolbar({
            store: stGpProductos,
            displayInfo: true,
            items: [btnLimpiar],
            listeners: {
                beforechange: function (p, e) {
                    offset = e.start;
                }
            }
        }),
        plugins: filtrosproductos
    });

   panelGeneral = new Ext.Panel({
        frame: true,
        region: 'center',
        layout: 'border',
        id: 'panelGeneral',
        autoWidth: true,
        height: 50,
        items: [gpGpProductos],
        tbar: [cbTiposProducto, btnAdicionar, btnAdicionarInd, btnAdicionarTarea, btnModificar, btnEliminar, '->', btnAprobarIndicadores, btnAyuda]
    });

    // viewport de la plantilla
    vpPlanes711 = new Ext.Viewport({
        layout: 'fit',
        id: 'idvpPlanes711',
        items: [panelGeneral]
    });

    //panelGeneral.focus(true, 500);

    //stGpProductos.reload();

}// Endof cargarInterfaz

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function renderEstActual(value) {
    if (value == 1)
        return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';

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
        gridPanel.setTitle(etiqueta + ' - <i>' + perfil.etiquetas.lbFiltradoPor + filtrado_por + '</i>');
        filtrado_por = "";
    }
}

function EliminarProducto(accion) {
    id = smGpProductos.getSelected().data.idproducto711;
    //si los conceptos de compra son iguales
    //mymask.show();
    Ext.Ajax.request({
        url: 'EliminarProductos',
        params: {
            idproducto711: id,
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.mensaje == 1) {
                mostrarMensaje(1, 'La accion de eliminar se ha realizado satisfactoriamente');
                stGpProductos.reload();  
            }
              
        }
    });

}

function AprobarIndicadores() {
    mymask.show();
    Ext.Ajax.request({
        url: 'EliminarProductos',
        timeout : 640000000,
        params: {
            idproducto711: 'aprobar'
        },
        callback: function (options, success, response) {
            mymask.hide();
            responseData = Ext.decode(response.responseText);
            if (responseData.mensaje == 1) {
                mostrarMensaje(1, 'Se han activado y aprobado todos los indicadores del maestro');
            }
              
        }
    });

}
