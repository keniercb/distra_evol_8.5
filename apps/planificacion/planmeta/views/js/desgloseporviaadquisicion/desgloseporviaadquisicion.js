
var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
Ext.QuickTips.init();
perfil.etiquetas = {};
//cargarPlanes = '../centrodebalance/listarComboModelos'
var idmodelo, identidadselected;
var rectora = 0;
var centroB = 0;
var bandera = false;
var falta = 0;
var suma = 0;
var chequeado = 0;
var aprobar = false;
var plan_seleccionado = null;
var idorgano, adicionar = 0, storganos, offset = 0, offsetDesg = 0;
var idInd, editado;
var desgloses_realizados, cantdesglozada, editada, stGpDesgloseporvia, datosSt;
initDesgloses();
UCID.portal.cargarEtiquetas('desgloseporviaadquisicion', cargarAccionesP);
objci = {};
objci.acciones = [];
var mymask = new Ext.LoadMask(Ext.getBody(), {
    msg: "Cargando planes..."
});

function cargarAccionesP() {
    UCID.portal.cargarAcciones(window.parent.idFuncionalidad, function() {
        for (i in acciones_reportes) {
            objci.acciones[acciones_reportes[i].abreviatura] = true;
        }
        cargarInterfaz();
    });
}

function cargarInterfaz() {
    Ext.Ajax.request({
        url: 'cargaInicial',
        callback: function(options, success, response) {
            if (objci.entidadCB == true) {
                centroB = 1;
            }
        }
    });

    // Botones btnAprobar btnDesaprobar btnAprobarTodos btnDesaprobarTodos btnAyuda
    btnAprobar = new Ext.Button({
        handler: function() {
            aprobar = true;
            cambiarEstado(aprobar);
        },
        tooltip: 'Aprobar desglose',
        iconCls: 'aprobar',
        disabled: true
    });

    btnDesaprobar = new Ext.Button({
        handler: function() {
            aprobar = false;
            cambiarEstado(aprobar);

        },
        tooltip: 'Desaprobar desglose',
        iconCls: 'desaprobar',
        disabled: true
    });

    btnEliminar = new Ext.Button({
        disabled: true,
        id: 'btnEliminar',
        tabIndex: 3,
        iconCls: 'eliminar',
        tooltip: 'Eliminar' + '(<b>DEL</b>)',
        handler: function() {
            eliminar();
        }
    });

    btnGuardar = new Ext.Button({
        id: 'btnGuardar',
        tooltip: 'Guardar desgloses' + '(<b>Alt+G</b>)',
        iconCls: 'guardar',
        handler: function() {
            desglosar();
        }
    });

    btnExportar = new Ext.Button({
        id: 'btnExportar',
        disabled: true,
        tooltip: perfil.etiquetas.lbttExportar,
        iconCls: 'exportar',
        handler: function() {
            exportar();
        }
    });

    btnAdicionar = new Ext.Button({
        disabled: true,
        id: 'btnAdicionar',
        hidden: false,
        iconCls: 'adicionar',
        tooltip: 'Adicionar',
        handler: function() {
            btnGuardar.enable();

            cbviasadq.reset();
            stviasadq.removeAll();

            cborganosatisf.reset();
            storganosatisf.removeAll();

            var cant_pordesglozar;
            if (Ext.getCmp('GpDesgloseporvia').getStore().getCount() > 0) {
                cant_pordesglozar = Number(Ext.getCmp('GpIndicadores').getSelectionModel().getSelected().data.demanda) - Number(calcularCantidad());

            } else {
                if (editada == 1) {
                    cant_pordesglozar = Number(Ext.getCmp('GpIndicadores').getSelectionModel().getSelected().data.demanda) - Number(cantdesglozada)
                    cantdesglozada = 0;
                } else {
                    cant_pordesglozar = Number(Ext.getCmp('GpIndicadores').getSelectionModel().getSelected().data.demanda);
                }
            }
            if (cant_pordesglozar < 0) {
                cant_pordesglozar = 0;
            }
            stGpDesgloseporvia.add(new Ext.data.Record({
                iddesgviaadquisorgsat: null,
                idaprobacion: 1,
                idindicadorviaadquisicionorganosatisface: null,
                idajusteexistenciacb: Ext.getCmp('GpIndicadores').getSelectionModel().getSelected().data.idajusteexistenciacb, //se toma del ind selecc
                cantidad: cant_pordesglozar,
                idviaadquisicion: null,
                denovia: 'Seleccione ...',
                idorganosatisfaseorg: null,
                denominacionorg: 'Seleccione ...'
            }));
            stviasadq.reload({});
            adicionar = 1;
        }
    });

    btnLimpiarfil = new Ext.Button({
        id: 'btnLimpiarfil',
        tooltip: 'Limpiar filtro(s) ' + '(<b>Alt+L</b>)',
        iconCls: 'limpiar',
        handler: function() {
            filtrosindicadoresDVIA.clearFilters();
        }
    });

    btnLimpiarfilVias = new Ext.Button({
        id: 'btnLimpiarfilVias',
        tooltip: 'Limpiar filtro(s) ' + '(<b>CTRL+ALT+L</b>)',
        iconCls: 'limpiar',
        handler: function() {
            filtrosVias.clearFilters();
        }
    });

    btnAyudaDesglose = new Ext.Button({
        disabled: false,
        id: 'btnAyuDesgloseViaAdquisicion',
        tooltip: 'Mostrar ayuda de la funcionalidad (<b>Alt+H</b>)',
        iconCls: 'ayuda'
    });

    importeTotal = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'importeTotal',
        anchor: '95%',
        align: 'right',
        disabled: false,
        maskRe: /^([.,]+ ?[.,]*)+$/,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        enableKeyEvents: false,
        emptyText: '0.000'
    });

    pordesglosar = new Ext.form.TextField({
        xtype: 'numberfield',
        id: 'pordesglosar',
        anchor: '95%',
        align: 'right',
        disabled: false,
        maskRe: /^([.,]+ ?[.,]*)+$/,
        regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
        enableKeyEvents: false,
        emptyText: '0'
    });

    stum = new Ext.data.Store({
        url: '/planificacion/planmeta/index.php/bpgestactividades/cargarunidadmedida',
        id: 'stum',
        reader: new Ext.data.JsonReader({
            root: 'data',
            id: 'idunidadmedida'
        },
        [{
                name: 'idunidadmedida'
            }, {
                name: 'denominacionunidadmedida'
            }])
    });
    stum.reload();

    //Store del combo cborganosatisf
    storganosatisf = new Ext.data.Store({
        url: 'listarOrgSatisface',
        autoLoad: false,
        reader: new Ext.data.JsonReader({
            id: 'idorganosatisface',
            root: 'data'
        }, [{
                name: 'idorganosatisface'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            load: function(x, y, z) {

            },
            beforeload: function() {
                this.baseParams.idindicador = idInd

            }
        }
    });
    //Store para listar todos los organos
    storganos = new Ext.data.Store({
        url: 'listarTodosOS',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            id: 'idorganosatisface',
            root: 'data'
        }, [{
                name: 'idorganosatisface'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            load: function(x, y, z) {

            },
            beforeload: function() {
            }
        }
    });
    //Store para listar todas las vias
    stvias = new Ext.data.Store({
        url: 'listarTodasVia',
        autoLoad: true,
        reader: new Ext.data.JsonReader({
            id: 'idviaadquisicion',
            root: 'data'
        }, [{
                name: 'idviaadquisicion'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            load: function(x, y, z) {

            },
            beforeload: function() {
                this.baseParams.idindicador = idInd;
            }
        }
    });
    //Store del combo cbviasadq
    stviasadq = new Ext.data.Store({
        url: 'listarViaAdquisicion',
        autoLoad: false,
        reader: new Ext.data.JsonReader({
            id: 'idviaadquisicion',
            root: 'data'
        }, [{
                name: 'idviaadquisicion'
            }, {
                name: 'denominacion'
            }]),
        listeners: {
            load: function(x, y, z) {

            },
            beforeload: function() {
                this.baseParams.idindicador = idInd;
            }
        }
    });

    //Combo para mostrar los organos que satisfacen 
    cborganosatisf = new Ext.form.ComboBox({
        id: 'cborganosatisf',
        store: storganosatisf,
        valueField: 'idorganosatisface',
        displayField: 'denominacion',
        anchor: '100%',
        mode: 'remote',
        listWidth: 250,
        editable: false,
        typeAhead: true,
        allowBlank: false,
        triggerAction: 'all',
        loadingText: 'Cargando',
        enableKeyEvents: true,
        listeners: {
            select: function(combo, record, index) {
                idorgano = record.data.idorganosatisface
            }
        }
    });

    //Combo para mostrar todos los organos que satisfacen para el render
    cborganos = new Ext.form.ComboBox({
        id: 'cborganos',
        store: storganos,
        valueField: 'idorganosatisface',
        displayField: 'denominacion',
        anchor: '100%',
        mode: 'remote',
        listWidth: 250,
        editable: false,
        typeAhead: true,
        allowBlank: false,
        triggerAction: 'all',
        loadingText: 'Cargando',
        enableKeyEvents: true,
        listeners: {
            select: function(combo, record, index) {
            }
        }
    });

    //Combo para mostrar las vias de adquisicion asociadas a un indicador
    cbviasadq = new Ext.form.ComboBox({
        id: 'cbviasadq',
        store: stviasadq,
        valueField: 'idviaadquisicion',
        displayField: 'denominacion',
        anchor: '100%',
        mode: 'remote',
        listWidth: 250,
        editable: false,
        typeAhead: true,
        allowBlank: false,
        triggerAction: 'all',
        loadingText: 'Cargando',
        enableKeyEvents: true,
        listeners: {
            select: function(combo, record, index) {
                cborganosatisf.reset();
                storganosatisf.removeAll();
                storganosatisf.reload();
                var col = GpDesgloseporvia.getColumnModel().findColumnIndex('denominacionorg');
                var editor = GpDesgloseporvia.getColumnModel().getCellEditor(col, rowIndex).field;
            }
        }
    });

    //Combo para mostrar todas las vias de adquisicion para el render
    cbvias = new Ext.form.ComboBox({
        id: 'cbvias',
        store: stvias,
        valueField: 'idviaadquisicion',
        displayField: 'denominacion',
        anchor: '100%',
        mode: 'remote',
        listWidth: 250,
        editable: false,
        typeAhead: true,
        allowBlank: false,
        triggerAction: 'all',
        loadingText: 'Cargando',
        enableKeyEvents: true
    });
    stCmPlanes = new Ext.data.Store({
        url: 'listarComboModelos',
        listeners: {
            beforeload: function() {
                Ext.Ajax.timeout = 6400000;
                this.baseParams.identidad = identidadselected;
                this.baseParams.cb = 1;
                this.baseParams.check = 1;
                this.baseParams.idejercicio = cbEjercicio.getValue();
            },
            load: function() {
                mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'identidad',
            root: 'data'
        },
        [{
                name: 'denominacion'
            }, {
                name: 'idmodelo'
            }])

    });
    // -------------Fin del Store del combo de Centros de Balance

    //Combo para los Centros de Balance
    CmbPlanes = new Ext.form.ComboBox({
        tabIndex: 10,
        allowBlank: false,
        emptyText: "Seleccione...",
        loadingText: 'Cargando...',
        width: 150,
        listWidth: 250,
        store: stCmPlanes,
        valueField: 'idmodelo',
        displayField: 'denominacion',
        id: 'tbcmplanes',
        mode: 'local',
        editable: true,
        triggerAction: 'all',
        disabled: false,
        typeAhead: true,
        selectOnFocus: false,
        listeners: {
            select: function(combo, record, index) {
                plan_seleccionado = record.data.denominacion;
                btnExportar.enable();
                stGpIndicadores.reload();
                Ext.getCmp('chkdesglosevia').enable();
            }
        }
    });

    Ext.menu.RangeMenu.prototype.icons = {
        gt: perfil.dirImg + 'greater_then.png',
        lt: perfil.dirImg + 'less_then.png',
        eq: perfil.dirImg + 'equals.png'
    };

    Ext.grid.filter.StringFilter.prototype.icon = perfil.dirImg + 'find.png';

    filtrosindicadoresDVIA = new Ext.grid.GridFilters({
        filters: [{
                type: 'string_adaptado',
                dataIndex: 'codigo',
                xtype: 'numberfield',
                idTextField: 'filtrocodigo',
                anchor: '95%',
                fieldLabel: '',
                disabled: false,
                maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
            }, {
                type: 'string_adaptado',
                dataIndex: 'numeropieza',
                xtype: 'numberfield',
                idTextField: 'filtropieza',
                anchor: '95%',
                fieldLabel: '',
                disabled: false
            }, {
                type: 'string',
                dataIndex: 'denominacion'
            }, {
                type: 'listado',
                dataIndex: 'idumedida',
                idcombo: 'idcbunidadmedida',
                valueFieldcb: 'idunidadmedida',
                displayFieldcb: 'denominacionunidadmedida',
                st: stum,
                autoload: false,
                mode: 'local'
            }, {
                type: 'numeric',
                dataIndex: 'precio'
            }, {
                type: 'listado',
                dataIndex: 'denominacioncb',
                idcombo: 'filtrocb',
                urlcb: 'listarCentroBalanceVia',
                idstore: 'idstcentrobalancevia',
                valueFieldcb: 'idcentrobalance',
                displayFieldcb: 'centrobalance'

            }, {
                type: 'numeric',
                dataIndex: 'demanda'
            }/*, {
                type: 'list',
                dataIndex: 'desglosado',
                options: ['SI', 'NO', 'PARCIAL']
            }*/, {
                type: 'list',
                dataIndex: 'idaprobacion',
                options: ['SI', 'NO']
            }, {
                type: 'numeric',
                dataIndex: 'importe'
            }]
    });

    // FILTROS DEL GRID VIA DE ADQUISICION
    filtrosVias = new Ext.grid.GridFilters({
        filters: [
            {
                type: 'listado',
                dataIndex: 'denovia',
                idcombo: 'cbvia',
                urlcb: 'listarVias',
                idstore: 'stvia',
                valueFieldcb: 'idvia',
                displayFieldcb: 'denominacion'
            },
            {
                type: 'listado',
                dataIndex: 'denominacionorg',
                idcombo: 'cbidorganosatiseorg',
                urlcb: 'listarOSNivel1',
                idstore: 'stidorganosatisfaceorg',
                valueFieldcb: 'idorganosatisface',
                displayFieldcb: 'denominacion'
            },
            {
                type: 'numeric',
                dataIndex: 'cantidad'
            }, {
                type: 'list',
                dataIndex: 'idaprobacion',
                options: ['SI', 'NO', 'RECTOR']
            }]
    });

    // Store grid stGpIndicadores
    stGpIndicadores = new Ext.data.Store({
        url: 'listarindicadores',
        listeners: {
            beforeload: function() {
                if (CmbPlanes.getValue() != null)
                    this.baseParams.idmodel = CmbPlanes.getValue();
                this.baseParams.idejercicio = cbEjercicio.getValue();
                this.baseParams.identidad = identidadselected;
                this.baseParams.cheq = chequeado;
                this.baseParams.start = offset;

                cambiarTituloFiltrarIndicadores();
            },
            load: function() {
                siexisteindFiltrado();
                GpIndicadores.getSelectionModel().selectFirstRow();
                mymask.hide();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            id: "idindicador"
        }, [{
                name: 'idindicador'
            }, {
                name: 'codigo'
            }, {
                name: 'numeropieza'
            }, {
                name: 'denominacion'
            }, {
                name: 'idumedida'
            }, {
                name: 'precio'
            }, {
                name: 'denominacioncb'
            }, {
                name: 'demanda'
            }, {
                name: 'desglosado'
            }, {
                name: 'idaprobacion'
            }, {
                name: 'importe'
            }]
                )
    });

    smGpIndicadores = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function(sm, row, record) {
                idInd = Ext.getCmp('GpIndicadores').getSelectionModel().getSelected().data.idindicador;
                btnEliminar.disable();
                btnAprobar.disable();
                btnDesaprobar.disable();
                GpDesgloseporvia.expand(true);
                stGpDesgloseporvia.reload();
                GpDesgloseporvia.enable();
            },
            rowdeselect: function() {
                if (!Ext.getCmp('GpIndicadores').getSelectionModel().getSelected())
                    GpDesgloseporvia.disable();
            },
            beforerowselect: function() {
            }
        }
    });

    //********************************************************
    stCbejercicio = new Ext.data.Store({
        url: ' ../gestplanes/getEjercicios',
        listeners: {
            load: function(t, n, e) {
                cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
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
            select: function() {
                loaderTreetpEntidades.load(tpEntidades.getRootNode());
                CmbPlanes.clearValue();
                GpIndicadores.getStore().removeAll();

            }
        }

    });
    stCbejercicio.reload();

    // Grid gestion GpIndicadores
    GpIndicadores = new Ext.grid.GridPanel({
        title: 'Demanda de indicadores',
        id: 'GpIndicadores',
        frame: true,
        height: 200,
        plugins: filtrosindicadoresDVIA,
        autoExpandColumn: 'expandir',
        region: 'center',
        listeners: {
            rowcontextmenu: function() {
            },
            sortchange: function() {
            }
        },
        store: stGpIndicadores,
        sm: smGpIndicadores,
        columns: [
            {
                header: 'Código',
                width: 90,
                sortable: true,
                dataIndex: 'codigo',
                tooltip: 'Código del indicador',
                renderer: crearToolTip
            }, {
                header: 'No pieza',
                width: 60,
                sortable: false,
                dataIndex: 'numeropieza',
                renderer: renderNopieza,
                tooltip: 'Número de pieza'
            },
            {
                id: 'expandir',
                header: 'Denominación',
                sortable: true,
                dataIndex: 'denominacion',
                tooltip: 'Denominación del indicador',
                renderer: crearToolTip
            }, {
                header: 'UM',
                width: 60,
                sortable: false,
                align: 'center',
                dataIndex: 'idumedida',
                tooltip: 'Unidad de medida',
                renderer: renderUM
            }, {
                header: 'Precio',
                width: 60,
                align: 'right',
                sortable: false,
                dataIndex: 'precio',
                renderer: crearToolTip
            }, {
                header: 'Centro de balance',
                sortable: true,
                width: 100,
                dataIndex: 'denominacioncb',
                tooltip: 'Centro de balance del indicador',
                renderer: crearToolTip

            }, {
                header: 'Demanda',
                sortable: true,
                align: 'right',
                width: 90,
                dataIndex: 'demanda',
                tooltip: 'Demanda del indicador',
                renderer: crearToolTip
            },
            {
                header: 'Desglosado',
                width: 80,
                sortable: true,
                dataIndex: 'desglosado',
                tooltip: 'Desglosado o no',
                renderer: Estado
            }, {
                header: 'Aprobado',
                width: 60,
                sortable: true,
                align: 'center',
                dataIndex: 'idaprobacion',
                tooltip: 'Aprobado o no',
                renderer: ColumnaAprobacion
            }, {
                header: 'Importe',
                width: 60,
                align: 'right',
                sortable: true,
                dataIndex: 'importe',
                tooltip: 'Importe del indicador',
                renderer: crearToolTip
            }],
        loadMask: {
            store: stGpIndicadores
        },
        tbar: ['-', {
                xtype: 'tbtext',
                text: "Planes:"
            }, CmbPlanes, '-', {
                xtype: 'checkbox',
                disabled: true,
                boxLabel: 'Mas de una V.Adquisición.',
                id: 'chkdesglosevia',
                listeners: {
                    check: function(ck, t) {
                        if (t) {
                            chequeado = 1;
                            stGpIndicadores.reload();
                        }
                        else
                            chequeado = 0;
                        stGpIndicadores.reload();
                    }
                }
            }, '-', 'Ejercicio:', cbEjercicio],
        bbar:
                new Ext.PagingToolbar({
                    store: stGpIndicadores,
                    displayInfo: true,
                    items: ['-', btnLimpiarfil, '-', {
                            xtype: 'tbtext',
                            text: 'Importe total:'
                        }, importeTotal],
                    listeners: {
                        beforechange: function(p, e) {
                            offset = e.start;
                        }
                    }
                })
    });

    // Store grid stGpDesgloseporvia
    stGpDesgloseporvia = new Ext.data.Store({
        url: 'listarViasOrgano',
        listeners: {
            load: function(st, recordArray, opt) {


                siexisteViasFiltrado();
                GpDesgloseporvia.getSelectionModel().selectFirstRow();
                if (st.getCount() == 0)
                    Ext.getCmp('pordesglosar').setValue(Ext.getCmp('GpIndicadores').getSelectionModel().getSelected().data.demanda);
                else {
                    actualizarPorDesglozar();
                }

                if (Ext.getCmp('pordesglosar').getValue() == 0)
                    Ext.getCmp('btnAdicionar').disable();
                else
                    Ext.getCmp('btnAdicionar').enable();

            },
            beforeload: function(st, opt) {
                btnGuardar.disable();
                adicionar = 0;
                cambiarTituloFiltrarVias();
                this.baseParams.idindicador = Ext.getCmp('GpIndicadores').getSelectionModel().getSelected().data.idindicador;
                this.baseParams.identidad = identidadselected;
                this.baseParams.idejercicio = cbEjercicio.getValue();
                this.baseParams.idmodelo = CmbPlanes.getValue();
                this.baseParams.start = offsetDesg;
                stGpDesgloseporvia.removeAll();
                btnEliminar.disable();
                btnAprobar.disable();
                btnDesaprobar.disable();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data",
            total_desglozado: "total_desglozado",
            id: "iddesgviaadquisorgsat"
        },
        [, {
                name: 'iddesgviaadquisorgsat'
            }, {
                name: 'idviaadquisicion'
            }, {
                name: 'denovia'
            }, {
                name: 'denominacionorg'
            }, {
                name: 'idorganosatisfaceorg'
            }, {
                name: 'idaprobacion'
            }, {
                name: 'cantidad'
            }, {
                name: 'importe'
            },
            {
                name: 'idindicadorviaadquisicionorganosatisface'
            }
        ])
    });

    // Selection Model grid smGpDesgloseporvia
    var rowIndex = 0;
    smGpDesgloseporvia = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(r, rowIndex, record) {
                rowIndex = rowIndex;
                btnEliminar.enable();
                btnAprobar.enable();
                btnDesaprobar.enable();
            },
            rowdeselect: function(a, b, c) {
                btnAdicionar.enable();
                btnEliminar.disable();
                btnAprobar.disable();
                btnDesaprobar.disable();
            }
        }
    });

    // Grid gestion GpDesgloseporvia
    GpDesgloseporvia = new Ext.grid.EditorGridPanel({
        frame: true,
        disabled: true,
        plugins: filtrosVias,
        id: 'GpDesgloseporvia',
        height: 250,
        title: 'Desglose por via de adquisición',
        loadMask: {
            msg: 'Cargando'
        },
        store: stGpDesgloseporvia,
        region: 'south',
        collapsible: true,
        collapsed: true,
        titleCollapse: true,
        split: true,
        sm: smGpDesgloseporvia,
        columns: [{
                header: "Vía de adquisición",
                width: 150,
                dataIndex: 'denovia',
                tooltip: 'Vía de adquisición',
                editor: cbviasadq,
                renderer: function(value, cell, rec, row, col) {
                    if (adicionar == 1) {
                        return cbviasadq.getRawValue();
                    } else {
                        return value;
                    }
                }
            }, {
                header: "Órgano que satisface",
                width: 200,
                dataIndex: 'denominacionorg',
                tooltip: 'Órgano que satisface',
                editor: cborganosatisf,
                renderer: function(value, cell, rec, row, col) {
                    if (adicionar == 1) {
                        return cborganosatisf.getRawValue();
                    } else {
                        return value;
                    }
                }
            }, {
                header: "Cantidad",
                width: 125,
                sortable: true,
                dataIndex: 'cantidad',
                tooltip: 'Cantidad',
                editor: new Ext.form.NumberField({
                    allowNegative: false,
                    allowBlank: false,
                    minValue: 0
                })
            }, {
                header: "Importe",
                width: 125,
                sortable: true,
                dataIndex: 'importe',
                tooltip: 'importe'
            }, {
                header: 'Aprobado',
                width: 60,
                sortable: true,
                dataIndex: 'idaprobacion',
                tooltip: 'Aprobado o no',
                renderer: ColumnaAprobacion
            }
        ],
        listeners: {
            validateedit: function(sm) {

            },
            beforeedit: function(e) {
                if (e.record.get('idaprobacion') > 1)
                    e.cancel = true;
                if (e.column != 5 && e.record.get('iddesgviaadquisorgsat') != null)
                    e.cancel = true;
            },
            afteredit: function(sm) {
                editada = 1;
                btnGuardar.enable();
                var campo = sm.field;
                eval('desgloses_realizados[' + sm.row + '].' + campo + "=" + sm.value + ";");
                eval('desgloses_realizados[' + sm.row + '].iddesgviaadquisorgsat=' + sm.record.data.iddesgviaadquisorgsat + ";");
                eval('desgloses_realizados[' + sm.row + '].cantidad=' + sm.record.data.cantidad + ";");

                desgloses_realizados[sm.row].modif = true;
                actualizarPorDesglozar();

                cantdesglozada = sm.record.data.cantidad;

                if (Ext.getCmp('pordesglosar').getValue() == 0) {
                    Ext.getCmp('btnAdicionar').disable();
                } else
                    Ext.getCmp('btnAdicionar').enable();
            }
        },
        tbar: ['-', btnAdicionar, '-', btnEliminar, '-', btnAprobar, '-', btnDesaprobar, '-', btnGuardar],
        bbar:
                new Ext.PagingToolbar({
                    store: stGpDesgloseporvia,
                    displayInfo: true,
                    items: ['-', btnLimpiarfilVias, '-', {
                            xtype: 'tbtext',
                            text: 'Por desglosar:'
                        }, pordesglosar, ],
                    listeners: {
                        beforechange: function(p, e) {
                            offsetDesg = e.start;
                        }
                    }
                })
    });
    loaderTreetpEntidades = new Ext.tree.TreeLoader({
        dataUrl: 'cargarEntidadesCB',
        listeners: {
            beforeload: function(tl, n) {
                this.baseParams = {
                    rector: objci.acciones.rector,
                    CB: objci.entidadCB,
                    valor: Ext.getCmp('idfiltroentviaad').getValue()
                };
            }

        }
    });

    //************Tree de Entidades ***************
    tpEntidades = new Ext.tree.TreePanel({
        autoScroll: true,
        layout: 'fit',
        height: 200,
        border: false,
        tbar: [{
                iconCls: 'icon-expand-all',
                tooltip: 'Expandir todas las entidades',
                icon: perfil.dirImg + 'expand-all.gif',
                handler: function() {
                    tpEntidades.root.expand(true);
                }
            }, {
                iconCls: 'icon-collapse-all',
                tooltip: 'Colapsar todas las entidades',
                icon: perfil.dirImg + 'collapse-all.gif',
                handler: function() {
                    tpEntidades.root.collapse(true);
                }
            }, {
                iconCls: 'icon-collapse-all',
                tooltip: 'Refrescar todas las entidades',
                icon: perfil.dirImg + 'table_refresh.png',
                handler: function() {
                    actualizararbolDesVia(tpEntidades);
                }
            }, '-', {
                xtype: 'textfield',
                emptyText: 'Filtrar entidad...',
                width: 110,
                id: 'idfiltroentviaad',
                listeners: {
                    specialkey: function(t, e) {
                        if (e.getKey() == '13') {
                            actualizararbolDesVia(tpEntidades);

                        }
                    }
                }
            }],
        listeners: {
            click: function(n, e) {
                tpEntidades.getSelectionModel().select(n);
                identidadselected = n.id;
                stCmPlanes.reload();
                cbEjercicio.enable();
                panelGeneral.enable(true);
                stGpIndicadores.removeAll();
                stGpDesgloseporvia.removeAll();
                mymask.hide();
            }
        },
        loader: loaderTreetpEntidades,
        root: new Ext.tree.AsyncTreeNode({
            text: 'Entidades',
            tipo: 0,
            expanded: true,
            id: '0'
        })
    });

    panelGeneral = new Ext.Panel({
        frame: true,
        disabled: true,
        region: 'center',
        layout: 'border',
        id: 'panelGeneral',
        items: [GpIndicadores, GpDesgloseporvia]
    });

    ptestructuras = new Ext.Panel({
        title: 'Entidades',
        id: 'ptestructuras',
        region: 'west',
        collapsible: true,
        split: true,
        width: 200,
        layout: 'fit',
        items: tpEntidades
    });

    // viewport de la plantilla
    vpTipoModelo = new Ext.Viewport({
        layout: 'fit',
        items: {
            xtype: 'panel',
            layout: 'border',
            tbar: [btnExportar, '->', btnAyudaDesglose],
            items: [ptestructuras, panelGeneral]
        }
    });

    function setValueTfPorDesglosar() {
        var cant_pordesglozar = 0;
        if (GpDesgloseporvia.getStore().reader.jsonData != undefined) {
            cant_pordesglozar = Number(Ext.getCmp('GpIndicadores').getSelectionModel().getSelected().data.demanda) - Number(GpDesgloseporvia.getStore().reader.jsonData.total_desglozado);
        }
        pordesglosar.setValue(cant_pordesglozar);
    }

    function getValueDesglosadoEnBD() {
        return Number(GpDesgloseporvia.getStore().reader.jsonData.total_desglozado);
    }

    function getPorDesglosar() {
        var cant_pordesglozar = 0;
        if (GpDesgloseporvia.getStore().reader.jsonData != undefined) {
            cant_pordesglozar = Number(Ext.getCmp('GpIndicadores').getSelectionModel().getSelected().data.demanda) - Number(GpDesgloseporvia.getStore().reader.jsonData.total_desglozado);
        }
        return cant_pordesglozar;
    }

    function getPorDesglosarIU_YBD() {
        var suma_desglosadaEnIU = 0;
        for (var i = 0; i < desgloses_realizados; i++) {
            if (desgloses_realizados[i].modif) {
                suma_desglosadaEnIU += Number(desgloses_realizados[i].cantidad);
            }
        }
        var cant_pordesglozar = getPorDesglosar();
        return cant_pordesglozar - suma_desglosadaEnIU;
    }

}

function exportar() {
    id_entidad_selecionada = tpEntidades.selModel.getSelectedNode().id;
    entidad_selecionada = tpEntidades.selModel.getSelectedNode().text;
    plan = plan_seleccionado;
    id_plan = CmbPlanes.getValue();
    var win = window.open('exportar?id_entidad=' + id_entidad_selecionada + '&entidad=' + entidad_selecionada + '&plan=' + plan + '&id_plan=' + id_plan + '&cheq='
            + chequeado + '&idejercicio=' + cbEjercicio.getValue() + '&filtros=' + Ext.encode(filtrosindicadoresDVIA.getFilterData()));
}

function renderNopieza(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    if (value == "" || value == null)
        return '-';
    else
        return value;
}

function modificarEstado1(val) {
    if (val == null)
        return 0;
    else
        return val;
}

function desglosar() {
    var suma = 0;
    var cant = 0;
    for (var i = 0; i < Ext.getCmp('GpDesgloseporvia').getStore().getCount(); i++) {
        if (Ext.getCmp('GpDesgloseporvia').getStore().getAt(i).data.cantidad == null)
            cant = 0
        else
            cant = Ext.getCmp('GpDesgloseporvia').getStore().getAt(i).data.cantidad
        suma += parseFloat(cant);
    }
    if (parseFloat(Ext.getCmp('GpIndicadores').getSelectionModel().getSelected().data.demanda) - parseInt(suma) < 0)
        mostrarMensaje(1, 'No se puede desglosar porque se ha alcanzado el límite máximo.');
    else if (parseFloat(Ext.getCmp('GpIndicadores').getSelectionModel().getSelected().data.demanda) > parseInt(suma))
        mostrarMensaje(1, 'Existen vías de adquisiciones por desglosar.');
    else
        mostrarMensaje(2, '&iquest;Est&aacute seguro que quiere guardar el desglose seleccionado?', guardardesgloses);


    if (parseFloat(Ext.getCmp('GpIndicadores').getSelectionModel().getSelected().data.demanda > 0) && (parseInt(suma) == 0))
        mostrarMensaje(1, 'Por favor, verifique que no ha desglosado.');
    btnGuardar.disable();
}

function MostrarBarraProgreso(msg) {
    Ext.MessageBox.show({
        title: 'Por favor espere...',
        width: 300,
        wait: true,
        progress: true,
        closable: false,
        animEl: 'mb6',
        msg: msg
    });
}

function guardardesgloses(btn) {
    if (btn == 'ok') {
        var recordsEnviar = [];
        for (var i = 0; i < desgloses_realizados.length; i++) {
            if (desgloses_realizados[i].modif)
                recordsEnviar.push(desgloses_realizados[i]);
        }
        cantidadnull = false;
        if (recordsEnviar.length > 0) {
            Ext.getCmp('GpDesgloseporvia').stopEditing();
            Ext.Ajax.request({
                url: 'desglosarDemanda',
                params: {
                    demanda: Ext.getCmp('GpIndicadores').getSelectionModel().getSelected().data.demanda,
                    desglose: Ext.encode(recordsEnviar),
                    idindicador: Ext.getCmp('GpIndicadores').getSelectionModel().getSelected().data.idindicador,
                    identidad: identidadselected,
                    idejercicio: cbEjercicio.getValue(),
                    idmodelo: CmbPlanes.getValue()
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 20) {
                        mostrarMensaje(1, 'El(los) desglose(s) ha(n) sido guardado(s) satisfactoriamente.');
                        for (i = 0; i < Ext.getCmp('GpDesgloseporvia').getStore().getCount(); i++) {
                            Ext.getCmp('GpDesgloseporvia').getStore().getAt(i).commit();
                        }
                        Ext.getCmp('GpDesgloseporvia').getStore().reload();
                        initDesgloses();
                    } else if (responseData.codMsg == 26) {
                        mostrarMensaje(1, 'Algún(os) desgloses no han sido guardados.');
                        Ext.getCmp('GpDesgloseporvia').getStore().reload();
                    }
                }
            });

        }

    }
}

function eliminar() {
    mostrarMensaje(2, '&iquest;Est&aacute seguro que quiere eliminar el desglose seleccionado?', eliminardesgloses);
}

function eliminardesgloses(btn) {
    if (btn == 'ok') {
        var flag = false;
        if (Ext.getCmp('GpDesgloseporvia').getSelectionModel().getSelections()) {
            var recordsSel = Ext.getCmp('GpDesgloseporvia').getSelectionModel().getSelections();
            var desgloses = [];
            if (recordsSel.length > 0) {
                for (var i = 0; i < recordsSel.length; i++) {
                    if (recordsSel[i].data.iddesgviaadquisorgsat != null) {
                        if (recordsSel[i].data.idaprobacion == 1)
                            desgloses.push(recordsSel[i].data.iddesgviaadquisorgsat);
                        else {
                            flag = true;
                        }
                    } else {
                        stGpDesgloseporvia.remove(recordsSel[i]);
                    }
                }

            }

            if (desgloses.length > 0) {
                Ext.Ajax.request({
                    url: 'eliminarDesglosesVia',
                    params: {
                        desgloses: Ext.encode(desgloses),
                        idindicador: Ext.getCmp('GpIndicadores').getSelectionModel().getSelected().data.idindicador,
                        identidad: identidadselected,
                        idejercicio: cbEjercicio.getValue(),
                        idmodelo: CmbPlanes.getValue()
                    },
                    callback: function(options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 20) {
                            if (flag == true) {
                                mostrarMensaje(1, 'Algún(os) desglose(s) no se eliminaron porque está(n) aprobados.', function() {
                                    Ext.getCmp('GpDesgloseporvia').getStore().reload();
                                });
                            } else {
                                mostrarMensaje(1, 'El(los) desglose(s) ha(n) sido eliminado(s) satisfactoriamente.');//, function() {
                                Ext.getCmp('GpDesgloseporvia').getStore().reload();
                            }


                        } else {
                            mostrarMensaje(responseData.codMsg, responseData.mensaje);
                        }
                        initDesgloses();
                    }
                });
            }
        }
    }
}

function cambiarEstado(aprobar) {
    mostrarMensaje(2, "¿Esta seguro que quiere " + ((aprobar) ? 'aprobar' : 'desaprobar') + " el (los) desglose(s) seleccionado(s)?", aprobar_desaprobar);
    function aprobar_desaprobar(btn) {
        if (btn == 'ok') {
            var valor = 1;
            if (objci.acciones)
                rector = objci.acciones.rector;
            var msg_aprobando = 'Desaprobando el(los) desgloses seleccionados.';
            var msgComprobar = '¿Esta seguro que quiere desaprobar el(los) desglose(s) selecionado(s)?'
            var aprobadoOk = 'El(los) desglose(s) ha(n) sido aprobado(s) satisfactoriamente.';
            var desaprobadoOk = 'El(los) desglose(s) ha(n) sido desaprobado(s) satisfactoriamente.';
            var recordsSel = Ext.getCmp('GpDesgloseporvia').getSelectionModel().getSelections();

            var desgloses = [];
            for (var i = 0; i < recordsSel.length; i++) {
                if (recordsSel[i].data.idaprobacion == 3 && !rector) {
                    mostrarMensaje(1, "No se puedo realizar la operaci&oacute;n, a seleccionado al menos un desglose ya aprobado por el rector ");
                    return;
                }
                desgloses.push(recordsSel[i].data.iddesgviaadquisorgsat);
            }

            if (aprobar) {
                if (rector) {
                    valor = 3;
                } else {
                    valor = 2;
                }
                msg_aprobando = 'Aprobando el(los) desglose(s) seleccionados.';
                desaprobadoOk = 'Desaprobando el(los) desglose(s) seleccionados.';
                msgComprobar = '¿Esta seguro que quiere aprobar el(los) desglose(s) selecionado(s)?'
                aprobadoOk = 'El(los) desglose(s) ha(n) sido aprobado(s) satisfactoriamente.';
            }
            Ext.Msg.wait((aprobar) ? msg_aprobando : desaprobadoOk, perfil.etiquetas.lbEspere);
            Ext.Ajax.request({
                url: 'aprobarDesaprobar',
                params: {
                    idaprobacion: valor,
                    desgloses: Ext.encode(desgloses),
                    idindicador: Ext.getCmp('GpIndicadores').getSelectionModel().getSelected().data.idindicador,
                    identidad: identidadselected,
                    idejercicio: cbEjercicio.getValue(),
                    idmodelo: CmbPlanes.getValue()
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 20) {
                        mostrarMensaje(1, (aprobar) ? aprobadoOk : desaprobadoOk);
                        Ext.getCmp('GpDesgloseporvia').getStore().reload();
                    } else
                        mostrarMensaje(responseData.codMsg, responseData.mensaje);
                    Ext.Msg.hide();
                }
            });
        }
    }
}

function siexisteindFiltrado() {
    if (filtrosindicadoresDVIA.getFiltrosActivos().length > 0 && stGpIndicadores.getCount() == 0)
        mostrarMensaje(1, perfil.etiquetas.msgBuscar);
}

function cambiarTituloFiltrarIndicadores() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosindicadoresDVIA.getFiltrosActivos() == undefined || filtrosindicadoresDVIA.getFiltrosActivos().length == 0)
    {
        GpIndicadores.setTitle(perfil.etiquetas.lbDemandaInd);
    } else {
        for (i = 0; i < filtrosindicadoresDVIA.getFiltrosActivos().length; i++) {
            var aux = "";
            if (filtrosindicadoresDVIA.getFiltrosActivos()[i].dataIndex == "codigo") {
                aux = perfil.etiquetas.lbCodigo;
            } else if (filtrosindicadoresDVIA.getFiltrosActivos()[i].dataIndex == "denominacion") {
                aux = perfil.etiquetas.lbDenominacion;
            } else if (filtrosindicadoresDVIA.getFiltrosActivos()[i].dataIndex == "numeropieza") {
                aux = perfil.etiquetas.lbNumeroP;
            } else if (filtrosindicadoresDVIA.getFiltrosActivos()[i].dataIndex == "um") {
                aux = perfil.etiquetas.lbUM;
            } else if (filtrosindicadoresDVIA.getFiltrosActivos()[i].dataIndex == "precio") {
                aux = perfil.etiquetas.lbPrecio;
            } else if (filtrosindicadoresDVIA.getFiltrosActivos()[i].dataIndex == "denominacioncb") {
                aux = perfil.etiquetas.lbDenominacionCB;
            } else if (filtrosindicadoresDVIA.getFiltrosActivos()[i].dataIndex == "demanda") {
                aux = perfil.etiquetas.lbDemanda;
            } else if (filtrosindicadoresDVIA.getFiltrosActivos()[i].dataIndex == "desglosado") {
                aux = perfil.etiquetas.lbDesglosado;
            } else if (filtrosindicadoresDVIA.getFiltrosActivos()[i].dataIndex == "idaprobacion") {
                aux = perfil.etiquetas.lbAprobacion;
            } else if (filtrosindicadoresDVIA.getFiltrosActivos()[i].dataIndex == "importe") {
                aux = perfil.etiquetas.lbImporte;
            }
            if (i == filtrosindicadoresDVIA.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += aux + sep;
        }

        GpIndicadores.setTitle(perfil.etiquetas.lbFiltradoPorInd + filtrado_por + '</i>');

        filtrado_por = "";
    }
}

function siexisteViasFiltrado() {
    if (filtrosVias.getFiltrosActivos().length > 0 && stGpDesgloseporvia.getCount() == 0)
        mostrarMensaje(1, perfil.etiquetas.msgBuscar);
}

function cambiarTituloFiltrarVias() {
    var filtrado_por = "";
    var sep = "/";
    if (filtrosVias.getFiltrosActivos() == undefined || filtrosVias.getFiltrosActivos().length == 0) {
        GpDesgloseporvia.setTitle(perfil.etiquetas.lbDesglose);
    } else {
        for (i = 0; i < filtrosVias.getFiltrosActivos().length; i++) {
            var numberCol = GpDesgloseporvia.getColumnModel().findColumnIndex(filtrosVias.getFiltrosActivos()[i].dataIndex);
            if (i == filtrosVias.getFiltrosActivos().length - 1) {
                sep = "";
            }
            filtrado_por += GpDesgloseporvia.getColumnModel().getColumnHeader(numberCol) + sep;
        }
        GpDesgloseporvia.setTitle(perfil.etiquetas.lbFiltradoPorVias + filtrado_por + '</i>');
        filtrado_por = "";
    }
}

function ColumnaAprobacion(val, m) {
    m.attr = 'ext:qtip="' + val + '"';
    if (val == 1)
        return '<span><img src=' + perfil.dirImg + 'cross.png' + '>';
    else if (val == 2)
        return '<span><img src=' + perfil.dirImg + 'tick(amarillo).png' + '>';
    else if (val == 3)
        return '<span><img src=' + perfil.dirImg + 'tick.png' + '>';

}

function Estado(val, m) {
    m.attr = 'ext:qtip="' + val + '"';

    if (val == 1)
        return 'Si';
    else if (val == 2)
        return 'Parcial';
    else
        return 'No';
}

function renderUM(value, m) {
    m.attr = 'ext:qtip="' + value + '"';
    for (var i = 0; i < stum.data.items.length; i++) {
        if (stum.data.items[i].data.idunidadmedida == value) {
            m.attr = 'ext:qtip="' + stum.data.items[i].data.denominacionunidadmedida + '"';
            return stum.data.items[i].data.denominacionunidadmedida;
        }
    }
}

function importeTotal() {
    var importe = 0;
    var cant = 0;
    for (var i = 0; i < Ext.getCmp('GpIndicadores').getStore().getCount(); i++) {

        if (Ext.getCmp('GpIndicadores').getStore().data.items[1].data.importe == null)
            cant = 0
        else
            cant = Ext.getCmp('GpIndicadores').getStore().data.items[1].data.importe
        importe += parseFloat(cant);
    }
}

function initDesgloses() {
    desgloses_realizados = [];
    for (var i = 0; i < 20; i++)
        desgloses_realizados.push({
            id: i,
            modif: false
        });
}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

function actualizarPorDesglozar() {
    var falta = 0;
    var suma = 0;
    for (var i = 0; i < Ext.getCmp('GpDesgloseporvia').getStore().getCount(); i++) {
        if (Ext.getCmp('GpDesgloseporvia').getStore().getAt(i).data.cantidad == null)
            cant = 0
        else
            cant = Ext.getCmp('GpDesgloseporvia').getStore().getAt(i).data.cantidad
        suma += parseFloat(cant);
    }
    falta = parseFloat(Ext.getCmp('GpIndicadores').getSelectionModel().getSelected().data.demanda) - parseInt(suma);
    Ext.getCmp('pordesglosar').setValue(falta);
}

function gestPermisos() {
    Ext.Ajax.request({
        url: 'gestPermisos',
        params: {
            idejercicio: cbEjercicio.getValue()
        },
        callback: function(options, success, response) {
            responseData = Ext.decode(response.responseText);
            if (responseData[0]) {
                if (responseData[0].guardar == 0) {
                    btnGuardar.hide();

                } else {
                    btnGuardar.show();
                }
                if (responseData[0].insertar == 0) {
                    btnAdicionar.hide();
                } else {
                    btnAdicionar.show();
                }
                if (responseData[0].eliminar == 0) {
                    btnEliminar.hide();

                } else {
                    btnEliminar.show();
                }
                if (responseData[0].modificar == 0) {

                }
            } else {
                btnAdicionar.hide();
                btnEliminar.hide();
                btnGuardar.hide();

            }
        }
    });

}

function calcularCantidad() {
    var falta = 0;
    var suma = 0;
    for (var i = 0; i < Ext.getCmp('GpDesgloseporvia').getStore().getCount(); i++) {
        if (Ext.getCmp('GpDesgloseporvia').getStore().getAt(i).data.cantidad == null)
            cant = 0
        else
            cant = Ext.getCmp('GpDesgloseporvia').getStore().getAt(i).data.cantidad
        suma += parseFloat(cant);
    }
    return suma;


}

/******* Teclas calientes ***************/
map = new Ext.KeyMap(Ext.getDoc(), [
    {
        key: 'Hh',
        alt: true,
        fn: function() {
            mostrarAyuda('Desglose por vía de adquisición');
        }
    }, {
        key: 'Ee',
        alt: true,
        fn: function() {
            exportar();
        }
    }, {
        key: 'Ll',
        alt: true,
        fn: function() {
            filtrosindicadoresDVIA.clearFilters();
            filtrosVias.clearFilters();
        }
    }

]);
/******* Fin teclas calientes ***************/
