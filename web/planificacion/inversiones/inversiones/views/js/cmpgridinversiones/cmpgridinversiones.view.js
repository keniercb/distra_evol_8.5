Ext.QuickTips.init();
Utilidades.Cmp.vistaGridInversiones = function(opciones) {
    var _this = this;
    _this.modelo = opciones.modelo,
    _this.idOrganismo = opciones.idOrganismo,
    _this.comboEjercicio  = this.idEjercicio,
    offset = opciones.offset;


    this.init = function() {

        _this.sm_inversiones = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        _this.colModel_inversiones = new Ext.grid.ColumnModel([
            /*new Ext.grid.RowNumberer(),*/
            {header: 'C\xF3digo'/*idioma.tlcodigo*/, tooltip: 'Código', width: 75, sortable: true, dataIndex: 'codigo', hidden: true},
            {header: 'Denominaci\xF3n'/*idioma.tlDenom*/, tooltip: 'Denominación', width: 260, sortable: true, dataIndex: 'denominacion'},
            {header: 'Clasificaci\xF3n'/*idioma.tlClasif*/, tooltip: 'Clasificación', width: 75, sortable: true, dataIndex: 'clasificacion'},
            {header: 'Nombre estructura', tooltip: 'Nombre estructura', width: 200, sortable: true, hidden: true, dataIndex: 'estructura'},
            {header: /*idioma.tlTipoInv*/'Tipo inversi\xF3n', tooltip: 'Tipo Inversión', width: 140, sortable: true, dataIndex: 'tipoinv'},
            {header: "Programa", tooltip: 'Programa', width: 140, sortable: true, dataIndex: 'programa'},
            {header: /*idioma.tlCaract*/'Caracteri\xED;sticas', tooltip: 'Características', width: 90, sortable: true, hidden: true, dataIndex: 'caracteristicas'},
            {header: /*idioma.tlForma*/'Forma de propiedad', tooltip: 'Forma de propiedad', width: 110, sortable: true, dataIndex: 'forma'},
            {header: /*idioma.tlProv*/'Provincia', tooltip: 'Provincia', width: 65, sortable: true, dataIndex: 'provincia', hidden: true},
            {header: /*idioma.tlFechaIni*/'Fecha de inicio', tooltip: 'Fecha de inicio', width: 75, sortable: true, dataIndex: 'fechainicio'},
            {header: /*idioma.tlFechaFin*/'Fecha fin', tooltip: 'Fecha fin', width: 75, sortable: true, dataIndex: 'fechafin'},
            {header: /*idioma.tlObjetivo*/'Objetivo', tooltip: 'Objetivo', width: 90, sortable: true, dataIndex: 'objetivo', hidden: false},
            {header: /*idioma.tlEfecto*/'Efecto', tooltip: 'Efecto', width: 90, sortable: true, dataIndex: 'efecto', hidden: true},
            {header: 'Desempeño', tooltip: 'Desempeño', width: 110, sortable: true, hidden: true, dataIndex: 'desempenno'},
            {header: 'Grupo de obra', tooltip: 'Grupo de obra', width: 110, sortable: true, hidden: true, dataIndex: 'grupoobra'},
            {header: 'Estado del plan', tooltip: 'Estado del plan', width: 110, sortable: true, hidden: true, dataIndex: 'estadoplan'},
            {header: 'Análisis post-inversión', tooltip: 'Análisis post-inversión', hidden: true, width: 110, sortable: true, dataIndex: 'analpostinversiones'},
            {header: 'Cuadrada', tooltip: 'Cuadrada', width: 60, sortable: true, hidden: false, dataIndex: 'cuadrada', renderer: modificarEstado},
            {header: /*idioma.tlActivado*/'Activado', tooltip: 'Activado', width: 60, sortable: true, dataIndex: 'idestadoinversion', renderer: modificarEstado},
            {header: /*idioma.tlAprobado*/'Aprobado', tooltip: 'Aprobado', width: 60, sortable: true, dataIndex: 'idestadoaprobacion', renderer: modificarEstado},
            {header: 'Sector estrat\xE9gico', tooltip: 'Sector estrat\xE9gico', width: 110, sortable: true, hidden: false, dataIndex: 'sector'},
            {header: 'V&iacute;a r&aacute;pida', tooltip: 'V&iacute;a r&aacute;pida', hidden: true, width: 60, sortable: true, dataIndex: 'fasttrack', renderer: modificarEstado},
            {header: 'Cartera de Inv.', tooltip: 'Cartera de inversiones', width: 100, sortable: true, hidden: true, dataIndex: 'cartera'},
            {header: 'Estudio de Factb.', tooltip: 'Estudio de factibilidad', width: 100, sortable: true, hidden: true, dataIndex: 'factibilidad'},
            {header: 'Medio Ambte.', tooltip: 'Medio ambiente', width: 60, sortable: true, hidden: true, dataIndex: 'medioambiente'},
            {header: 'Preparaci\xF3n', tooltip: 'Inversi\xFen de preparaci\xF3n', width: 100, sortable: true, hidden: true, dataIndex: 'nompreparacion'}

        ]);

        _this.filtrosinv = new Ext.grid.GridFilters({
            filters: [
                {
                    type: 'string',
                    dataIndex: 'codigo',
                    xtype: 'numberfield',
                    idTextField: 'filtrocodigo',
                    anchor: '95%',
                    fieldLabel: '',
                    disabled: false,
                    maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                    maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
                }, {
                    type: 'string',
                    dataIndex: 'denominacion'
                }, {
                    dataIndex: 'tipoinv',
                    mode: 'remote',
                    type: 'listado',
                    idcombo: 'filtrotInv',
                    urlcb: '/planificacion/inversiones/index.php/inversiones/listarComboTipoInversion',
                    idstore: 'idtipoinversion',
                    valueFieldcb: 'idtipoinversionprograma',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'programa',
                    type: 'listado',
                    idcombo: 'filtrotProg',
                    urlcb: '/planificacion/inversiones/index.php/inversiones/listarComboProgramada',
                    idstore: 'idprogramada',
                    valueFieldcb: 'idprogramada',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'clasificacion',
                    type: 'listado',
                    idcombo: 'idclasificacion',
                    urlcb: '/planificacion/inversiones/index.php/inversiones/listarComboClasificacion',
                    idstore: 'stidclasificacion',
                    valueFieldcb: 'idtipoinversion',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'caracteristicas',
                    type: 'listado',
                    idcombo: 'filtrotInv',
                    urlcb: '/planificacion/inversiones/index.php/inversiones/listarComboCaracteristica',
                    idstore: 'idcaracteristica',
                    valueFieldcb: 'idcaracteristica',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'forma',
                    type: 'listado',
                    idcombo: 'idcmpformapropiedad',
                    urlcb: '/planificacion/inversiones/index.php/inversiones/listarComboFormaPropiedad',
                    idstore: 'stidformapropiedad',
                    valueFieldcb: 'idformapropiedad',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'medioambiente',
                    type: 'listado',
                    idcombo: 'cbmedioambiente',
                    urlcb: '/planificacion/inversiones/index.php/inversiones/listarComboMedioAmbiente',
                    idstore: 'stmedioambiente',
                    valueFieldcb: 'idmedioambiente',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'estadoplan',
                    type: 'listado',
                    idcombo: 'cbestadoplan',
                    urlcb: '/planificacion/inversiones/index.php/inversiones/listarEstado',
                    idstore: 'stestadoplan',
                    valueFieldcb: 'idestadoplaninversion',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'sector',
                    type: 'listado',
                    idcombo: 'cbsectorestrategico',
                    urlcb: '/planificacion/inversiones/index.php/inversiones/listarSectorEstrategico',
                    idstore: 'stsectorestrategico',
                    valueFieldcb: 'idsectorestrategico',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'grupoobra',
                    type: 'listado',
                    idcombo: 'cbsectorestrategico',
                    urlcb: '/planificacion/inversiones/index.php/inversiones/listarGrupoObra',
                    idstore: 'stgrupoobra',
                    valueFieldcb: 'idgrupoobra',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'provincia',
                    type: 'listado',
                    idcombo: 'idprovincia',
                    urlcb: '/planificacion/inversiones/index.php/inversiones/listarProvincias',
                    idstore: 'stidprovincia',
                    valueFieldcb: 'idprovincia',
                    displayFieldcb: 'provincia',
                    tpl: '<tpl for="."><div ext:qtip="{provincia}" class="x-combo-list-item">{provincia}</div></tpl>'
                }, {
                    type: 'date',
                    dateFormat: 'Y-m-d',
                    dataIndex: 'fechainicio'
                }, {
                    type: 'date',
                    dateFormat: 'Y-m-d',
                    dataIndex: 'fechafin'
                }, {
                    dataIndex: 'objetivo',
                    type: 'listado',
                    idcombo: 'idobjetivo',
                    urlcb: '/planificacion/inversiones/index.php/inversiones/listarComboObjetivo',
                    idstore: 'stidobjetivo',
                    valueFieldcb: 'idobjetivo',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'efecto',
                    type: 'listado',
                    idcombo: 'filtrotInv',
                    urlcb: '/planificacion/inversiones/index.php/inversiones/listarComboEfecto',
                    idstore: 'stidefectocomercial',
                    valueFieldcb: 'idefectocomercial',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    type: 'list',
                    dataIndex: 'idestadoinversion',
                    options: ['Si', 'No']
                }, {
                    type: 'list',
                    dataIndex: 'idestadoaprobacion',
                    options: ['Si', 'No']
                }, {
                    type: 'list',
                    dataIndex: 'fasttrack',
                    options: ['Si', 'No']
                }, {
                    dataIndex: 'desempenno',
                    type: 'listado',
                    idcombo: 'filtrotInve',
                    urlcb: '/planificacion/inversiones/index.php/inversiones/listarComboDesempenno',
                    idstore: 'iddatdesempenno',
                    valueFieldcb: 'iddatdesempenno',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    type: 'numeric',
                    dataIndex: 'analpostinversiones'
                }, {
                    type: 'list',
                    dataIndex: 'cuadrada',
                    options: ['Si', 'No']
                }, {
                    type: 'list',
                    dataIndex: 'cartera',
                    options: ['Si', 'No']
                }, {
                    type: 'list',
                    dataIndex: 'factibilidad',
                    options: ['Si', 'No']
                }, {
                    type: 'list',
                    dataIndex: 'nompreparacion',
                    options: ['Si', 'No']
                }
            ]
        });

        _this.btn_limpiar_inversiones = new Ext.Button({
            text: 'Limpiar', //dioma.btnLimpiar,
            tooltip: 'Limpiar', //idioma.toolTipAplicarinversiones,
            iconCls: 'limpiar'
        });

        _this.grid_gestionar_inversiones = new Ext.grid.GridPanel({
            frame: true,
            region:'center',
            title: 'Inversiones', //dioma.tlInversiones,
            border: false,
            height: 165,
            autoScroll: true,
            plugins: _this.filtrosinv,
            store: _this.modelo.store_gestionar_inversiones,
            loadMask: {
                store:_this.modelo.store_gestionar_inversiones
            },
            sm: _this.sm_inversiones,
            cm: _this.colModel_inversiones,
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                id: 'ptinversiones',
                store:_this.modelo.store_gestionar_inversiones,
                displayInfo: true,
                items: ['-', _this.btn_limpiar_inversiones],
                /*listeners: {
                    beforechange: function(p, e) {
                        offset = e.start;
                    }
                }*/
            })
        });
        
        function modificarEstado(val, m, record, row, col) {
            var palabra = GetPalabraColumna(val, col);
            m.attr = 'ext:qtip="' + palabra + '"';
            if (val == 1) {
                return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
            }

            return '<span><img src=' + perfil.dirImg + 'no.png' + '>';
        }
        
        function GetPalabraColumna(val, col){
            if (col == 22)
                return (val == 1) ? 'Fasttrack' : 'No Fasttrack';
            if (col == 20)
                return (val == 1) ? 'Aprobado' : 'Desaprobado';
            if (col == 19)
                return (val == 1) ? 'Activado' : 'Desactivado';
            if (col == 18)
                return (val == 1) ? 'Cuadrada' : 'Descuadrada';
        }


    };



};