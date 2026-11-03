//Namespace del componente RedistribuciÃ³n asociadas a Balance Material
Ext.ns('Planificacion.BalanceMaterial.Redistribucion')

//Vista del componente RedistribuciÃ³n asociadas a Balance Material
Planificacion.BalanceMaterial.Redistribucion.Vista = {
    /*Componente que inicializa la vista
     *@param: idioma Objeto que contiene el idioma de la aplicacion (type:Object)
     *@param: modelo Objeto que contiene los modelos para cargar los datos(type:RedistribuciÃ³n asociadas a Balance Material)
     */

    identidadselected: null,
    hoja: null,
    iplanselected: null,
    flagobj: 0,
    modelo: null,
    init: function(idioma, modelo) {
        Ext.Ajax.timeout = 3600000; //600000 = 10min  3600000=1h
        mymask = new Ext.LoadMask(Ext.getBody(), {
            msg: perfil.etiquetas.lbCargando
        });

        _this = this;
        this.importes = [];
        this.btnProductos = new Ext.Button({
            id: 'btnProductos',
            //icon: perfil.dirImg + 'balance.png',
            tooltip: 'Productos (<b>Alt+L</b>)',
            iconCls: 'ver'//,
                    // text: 'Ver situación de productos'
        });
        //Limpiar del grid para mostrar los indicadores demandados.
        this.btnLimpiarRedt = new Ext.Button({
            id: 'btnLimpiarRedt',
            // icon: perfil.dirImg + 'limpiar.png',
            tooltip: 'Limpiar (<b>Ctrl+Alt+L</b>)',
            iconCls: 'limpiar'//,
                    // text: perfil.etiquetas.lbBtnLimpiar
        });

        this.btnLimpiarFiltrosProdPorEsp = new Ext.Button({
            id: 'btnLimpiarFiltrosProdPorEsp',
            // icon: perfil.dirImg + 'limpiar.png',
            tooltip: 'Limpiar(<b>Alt+L</b>)',
            iconCls: 'limpiar'//,
                    //  text: perfil.etiquetas.lbBtnLimpiarFiltros
        });
        //limpiar de ver situacion de productos
        this.btnLimpiarProductos = new Ext.Button({
            id: 'btnLimpiarFiltrosProdPorEsp',
            //  icon: perfil.dirImg + 'limpiar.png',
            tooltip: 'Limpiar filtro(s)',
            iconCls: 'limpiar'//,
                    // text: perfil.etiquetas.lbBtnLimpiarFiltros
        });
        this.btnAyudaRedist = new Ext.Button({
            id: 'btnAyudaRedist',
            // icon: perfil.dirImg + 'ayuda.png',
            tooltip: 'Mostrar ayuda de la funcionalidad (<b>Alt+H</b>)',
            iconCls: 'ayuda'//,
                    //text: perfil.etiquetas.lbBtnAyuda,
        });

        this.btnRedistribuir = new Ext.Button({
            id: 'btnRedistribuir',
            // icon: perfil.dirImg + 'balance.png',
            tooltip: 'Redistribuir (<b>Alt+R</b>)',
            iconCls: 'balance',
            disabled: true//,
                    //text: 'Redistribuir'
        });

        this.btnExportar = new Ext.Button({
            id: 'btnExportar',
            //icon: perfil.dirImg + 'exportar.png',
            iconCls: 'exportar',
            tooltip: perfil.etiquetas.lbTtBtnExportar//,
                    //text: perfil.etiquetas.lbBtnExportar
        });

        this.btnExportarReportes = new Ext.Button({
            id: 'btnExportar',
            // icon: perfil.dirImg + 'exportar.png',
            iconCls: 'exportar',
            tooltip: perfil.etiquetas.lbTtBtnExportar//,
                    // text: perfil.etiquetas.lbBtnExportar
        });

        this.cbCtroBalance = new Ext.form.ComboBox({
            url: 'listarCentroBalance',
            id: 'cbCtroBalance',
            store: modelo.stcbCtroBalance,
            valueField: 'idcentrobalance',
            hiddenName: 'idcentrobalance',
            displayField: 'centrobalance',
            mode: 'local',
            allowBlank: true,
            typeAhead: true,
            editable: true,
            triggerAction: 'all',
            enableKeyEvents: true,
            emptyText: 'Seleccione...',
            loadingText: 'Cargando...',
            width: 180,
            listeners: {
                select: function(cb, rec, index) {


                }
            }
        });
        this.importeTotal = new Ext.form.TextField({
            xtype: 'numberfield',
            id: 'importeTotal',
            width: 90,
            align: 'right',
            disabled: false,
            maskRe: /^([.,]+ ?[.,]*)+$/,
            regex: /^([0-9.,]+ ?[0-9.,]*)+$/,
            enableKeyEvents: false,
            emptyText: '0.000'
        });
        //combo importe
        this.cbImportes = new Ext.form.ComboBox({
            value: 1,
            id: 'cbImportes',
            store: modelo.stCbImportes,
            displayField: 'denominacion',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            hiddenName: 'idimporte',
            valueField: 'idimporte',
            width: 200,
            emptyText: 'Seleccionar',
            listeners: {
                scope: this,
                select: function(cb, record, index) {

                    this.importeTotal.setValue(this.importes[record.data.idimporte]);

                }
            },
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            maskReregex: /^([0-9]+ ?[0-9]*)+$/
        });
        //Limpiar del grid para mostrar las entidades abastedoras.
        this.btnLimpiarRedtEA = new Ext.Button({
            id: 'btnLimpiarRedtEA',
            // icon: perfil.dirImg + 'limpiar.png',
            tooltip: 'Limpiar (<b>Alt+L</b>)',
            iconCls: 'limpiar',
            text: '<u>L</u>impiar'
        });

        /******TECLAS CALIENTES**********/
        this.globalKeyMap = new Ext.KeyMap(document);
        this.globalKeyMap.accessKey = function(key, handler, scope) {
            var h = function(n, e) {
                e.preventDefault();
                handler.call(scope || this, n, e);
            };
            this.on(key, h, scope);
        };


        this.filtrosindidemandados = new Ext.grid.GridFilters({
            filters: [
                {
                    type: 'string_adaptado',
                    dataIndex: 'codigo',
                    xtype: 'numberfield',
                    idTextField: 'filtrocodigo',
                    anchor: '95%',
                    fieldLabel: '',
                    disabled: false,
                    maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                    maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
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
                    type: 'string',
                    dataIndex: 'denominacion'
                },
                {
                    type: 'listado',
                    dataIndex: 'umedida',
                    idcombo: 'idcbunidadmedidaredist',
                    urlcb: 'cargarUM',
                    idstore: 'idtodasunidadesmedidaredist',
                    valueFieldcb: 'idunidadmedida',
                    displayFieldcb: 'denominacionunidadmedida'
                },
                {
                    type: 'numeric',
                    dataIndex: 'precio'
                }, {
                    type: 'numeric',
                    dataIndex: 'preciomlc'
                }, {
                    type: 'numeric',
                    dataIndex: 'flete'
                }, {
                    type: 'numeric',
                    dataIndex: 'contingencia'
                },
                {
                    type: 'numeric',
                    dataIndex: 'demanda'
                },
                {
                    type: 'numeric',
                    dataIndex: 'satisfecha'
                },
                {
                    type: 'numeric',
                    dataIndex: 'esd'
                }, {
                    type: 'numeric',
                    dataIndex: 'porciento'
                }, {
                    type: 'numeric',
                    dataIndex: 'importe'
                }, {
                    type: 'numeric',
                    dataIndex: 'importesatisfecha'
                }, {
                    type: 'numeric',
                    dataIndex: 'importedns'
                }, {
                    type: 'numeric',
                    dataIndex: 'dns'
                }

            ]
        });

        //*******************************
        this.cbEjercicio = new Ext.form.ComboBox({
            id: 'cbEjercicioRedistribucion',
            store: modelo.stCbejercicio,
            disabled: true,
            valueField: 'idejercicio',
            hiddenName: 'idejercicio',
            displayField: 'ejercicio',
            mode: 'local',
            allowBlank: true,
            typeAhead: true,
            editable: true,
            triggerAction: 'all',
            emptyText: 'Seleccione',
            loadingText: 'Cargando...',
            width: 180

        });




        //Grid para mostrar los indicadores demandados.
        this.smGpIndDemandados = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        this.gridIndDemandados = new Ext.grid.GridPanel({
            title: 'Indicadores Demandados',
            store: modelo.stgpIndDemandados,
            region: 'center',
            sm: this.smGpIndDemandados,
            plugins: this.filtrosindidemandados,
            columns: [
                {
                    header: 'Código',
                    width: 70,
                    dataIndex: 'codigo',
                    tooltip: 'Código',
                    renderer: crearToolTip
                }, {
                    header: 'No. pieza',
                    width: 90,
                    dataIndex: 'numeropieza',
                    id: 'idnopieza',
                    tooltip: 'No pieza',
                    renderer: crearToolTip
                }, {
                    header: 'Denominación',
                    width: 250,
                    dataIndex: 'denominacion',
                    tooltip: 'Denominación',
                    renderer: crearToolTip
                }, {
                    header: 'UM',
                    width: 80,
                    dataIndex: 'umedida',
                    tooltip: 'Unidad de medida',
                    renderer: crearToolTip
                }, {
                    header: 'Precio MN',
                    width: 90,
                    align: 'right',
                    dataIndex: 'precio',
                    tooltip: 'Precio MN',
                    renderer: crearToolTip
                }, {
                    header: 'Precio MLC',
                    width: 90,
                    align: 'right',
                    dataIndex: 'preciomlc',
                    tooltip: 'Precio MLC',
                    renderer: crearToolTip
                }, {
                    header: 'Flete',
                    width: 70,
                    align: 'right',
                    dataIndex: 'flete',
                    tooltip: 'Flete',
                    renderer: crearToolTip
                }, {
                    header: 'Contingencia',
                    width: 90,
                    align: 'right',
                    dataIndex: 'contingencia',
                    tooltip: 'Contingencia',
                    renderer: crearToolTip
                }, {
                    header: 'Demanda',
                    width: 70,
                    align: 'right',
                    id: 'iddemanda',
                    dataIndex: 'demanda',
                    tooltip: 'Demanda',
                    renderer: crearToolTip
                }, {
                    header: 'Importe demanda',
                    width: 120,
                    align: 'right',
                    dataIndex: 'importe',
                    tooltip: 'Importe de la demanda',
                    renderer: crearToolTip
                }, {
                    header: 'Satisfecha',
                    width: 90,
                    align: 'right',
                    dataIndex: 'satisfecha',
                    tooltip: 'Demanda satisfecha',
                    renderer: crearToolTip
                }, {
                    header: 'Importe satisfecha',
                    width: 120,
                    align: 'right',
                    dataIndex: 'importesatisfecha',
                    tooltip: 'Importe de la demanda satisfecha',
                    renderer: crearToolTip
                }, {
                    header: 'DNS',
                    width: 70,
                    align: 'right',
                    dataIndex: 'dns',
                    tooltip: 'Demanda no satisfecha',
                    renderer: crearToolTip
                }, {
                    header: 'Importe DNS',
                    width: 90,
                    align: 'right',
                    dataIndex: 'importedns',
                    tooltip: 'Importe de la demanda no satisfecha',
                    renderer: crearToolTip
                }, {
                    header: 'ESD',
                    width: 70,
                    align: 'right',
                    dataIndex: 'esd',
                    tooltip: 'Existencias sin distribuir',
                    renderer: crearToolTip
                }, {
                    header: 'Porciento',
                    width: 70,
                    align: 'right',
                    dataIndex: 'porciento',
                    tooltip: 'Porciento cubierto',
                    renderer: crearToolTip
                }],
            loadMask: {
                msg: 'Cargando...',
                store: modelo.stgpIndDemandados
            },
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                id: 'idpaginad',
                store: modelo.stgpIndDemandados,
                displayInfo: true,
                items: [this.btnLimpiarRedt, this.cbImportes, '-', this.importeTotal, '-']
            })
        });
        //filtro del grid2
        this.filtrosespecialidades = new Ext.grid.GridFilters({
            filters: [
                {
                    type: 'listado',
                    dataIndex: 'denespecialidad',
                    idcombo: 'idespdist',
                    urlcb: 'listarComboEsp',
                    idstore: 'idtodasespredist',
                    valueFieldcb: 'idespecialidad',
                    displayFieldcb: 'denespecialidad'
                }, {
                    type: 'numeric',
                    dataIndex: 'prioridad'
                },
                {
                    type: 'numeric',
                    dataIndex: 'cantdisponible'
                }, {
                    type: 'numeric',
                    dataIndex: 'cantasignado'
                },
                {
                    type: 'numeric',
                    dataIndex: 'cantsindistribuir'
                }
            ]
        });

        //Grid Entidades Abastacedoras
        this.gridEntAbastecedoras = new Ext.grid.GridPanel({
            title: 'Especialidades Abastacedoras',
            region: 'south',
            height: 270,
            plugins: this.filtrosespecialidades,
            store: modelo.stgpEntidadesAbast,
            columns: [{
                    header: 'Prioridad',
                    width: 90,
                    hidden: true,
                    dataIndex: 'prioridad',
                    align: 'right',
                    tooltip: 'Prioridad de la redistribución del excedente',
                    renderer: crearToolTip
                }, {
                    header: 'Especialidad',
                    width: 200,
                    height: 100,
                    dataIndex: 'denespecialidad',
                    tooltip: 'Especialidad',
                    renderer: crearToolTip
                },
                {
                    header: 'Disponible',
                    width: 80,
                    align: 'right',
                    dataIndex: 'cantdisponible',
                    tooltip: 'Cobertura disponible',
                    renderer: crearToolTip
                },
                {
                    header: 'Asignado',
                    width: 80,
                    align: 'right',
                    dataIndex: 'cantasignado',
                    tooltip: 'Cobertura asignada',
                    renderer: crearToolTip
                },
                {
                    header: 'Sin distribuir',
                    width: 90,
                    align: 'right',
                    dataIndex: 'cantsindistribuir',
                    tooltip: 'Cobertura sin distribuir',
                    renderer: crearToolTip
                }
            ],
            loadMask: {
                msg: 'Cargando...',
                store: modelo.stgpEntidadesAbast
            },
            bbar: new Ext.PagingToolbar({
                pageSize: 10,
                store: modelo.stgpEntidadesAbast,
                displayInfo: true,
                id: 'idpaginadoredist',
                items: ['-', this.btnLimpiarRedtEA]

            }),
            md: new Ext.menu.Menu({
                id: 'menuespabast',
                items: [{
                        text: 'Buscar producto',
                        icon: perfil.dirImg + 'buscar.png',
                        iconCls: 'btn',
                        id: 'btnubicarprod'
                    }]
            }),
            listeners: {
                rowcontextmenu: function(g, r, e) {
                    e.stopEvent();
                    g.getSelectionModel().selectRow(r);
                    g.md.showAt(e.getXY());

                }
            }
        });


        this.filtrosprodporesp = new Ext.grid.GridFilters({
            filters: [
                {
                    type: 'string',
                    dataIndex: 'um'
                },
                {
                    type: 'numeric',
                    dataIndex: 'existencia'
                },
                {
                    type: 'numeric',
                    dataIndex: 'cantidaddisponible'
                }, {
                    type: 'numeric',
                    dataIndex: 'importetotal'
                }, {
                    type: 'string',
                    dataIndex: 'deposito'
                }, {
                    type: 'string',
                    dataIndex: 'lugar'
                }, {
                    type: 'numeric',
                    dataIndex: 'preciopromedio'
                },
                {
                    type: 'numeric',
                    dataIndex: 'preciounitario'
                }
            ]
        });
        //treepanel Entidades        
        this.tpEntidades = new Ext.estructura.panel.PanelEstructura(
                {
                    cargos: false,
                    menu: false
                });
        this.tpEntidades.btnBuscar.setText("");
        this.tpEntidades.btnLimpiar.setText("");
        this.tpEntidades = this.tpEntidades.items.items[0];
        this.tpEntidades.region = 'west';
        this.tpEntidades.width = 200;

        this.gpEnconProd = new Ext.grid.GridPanel({
            id: 'gpEnconProd',
            frame: true,
            store: modelo.stEnconProd,
            region: 'center',
            title: 'Productos',
            plugins: this.filtrosprodporesp,
            autoExpandColumn: 'expandir',
            columns: [{
                    header: 'Especialidad',
                    width: 90,
                    hidden: true,
                    dataIndex: 'especialidad',
                    tooltip: 'Especialidad',
                    renderer: crearToolTip
                }, {
                    header: 'Cod. producto',
                    dataIndex: 'codigoprod',
                    tooltip: 'Codigo producto',
                    renderer: crearToolTip
                },
                {
                    header: 'Categoria',
                    width: 80,
                    dataIndex: 'categoria',
                    tooltip: 'Categoria',
                    renderer: crearToolTip
                },
                {
                    id: 'expandir',
                    header: 'Descripcion',
                    width: 80,
                    dataIndex: 'descripcion',
                    tooltip: 'Descripcion',
                    renderer: crearToolTip
                },
                {
                    header: 'UM',
                    width: 90,
                    dataIndex: 'um',
                    tooltip: 'UM',
                    renderer: crearToolTip
                },
                {
                    header: 'Existencia',
                    width: 90,
                    dataIndex: 'existencia',
                    tooltip: 'Existencia',
                    renderer: crearToolTip
                },
                {
                    header: 'Cant. disponible',
                    width: 90,
                    dataIndex: 'cantidaddisponible',
                    tooltip: 'Cantidad disponible',
                    renderer: crearToolTip
                },
                {
                    header: 'Imp. total',
                    width: 90,
                    dataIndex: 'importetotal',
                    tooltip: 'Importe total',
                    renderer: crearToolTip
                },
                {
                    header: 'Deposito',
                    width: 90,
                    dataIndex: 'deposito',
                    tooltip: 'Deposito',
                    renderer: crearToolTip
                }, {
                    header: 'Lugar',
                    width: 90,
                    dataIndex: 'lugar',
                    tooltip: 'Lugar',
                    renderer: crearToolTip
                },
                {
                    header: 'Precio promedio',
                    width: 90,
                    dataIndex: 'preciopromedio',
                    tooltip: 'Precio promedio',
                    renderer: crearToolTip
                },
                {
                    header: 'Precio unitario',
                    width: 90,
                    dataIndex: 'preciounitario',
                    tooltip: 'Precio unitario',
                    renderer: crearToolTip
                }
            ],
            loadMask: {
                msg: 'Cargando ...'
            },
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.stEnconProd,
                displayInfo: true,
                items: ['-', this.btnLimpiarFiltrosProdPorEsp]
            })

        });

        this.winEnconProd = new Ext.Window({
            id: 'winEnconProd',
            modal: true,
            closeAction: 'hide',
            width: 960,
            layout: 'fit',
            constrain: true,
            items: this.gpEnconProd,
            height: 500,
            title: 'Buscar producto',
            listeners: {
                hide: function() {
                }
            },
            buttons: [{
                    // icon: perfil.dirImg + 'cerrar.png',
                    tooltip: 'Cerrar',
                    iconCls: 'cerrar',
                    text: 'Cerrar',
                    handler: function() {
                        Ext.getCmp('winEnconProd').hide();
                    }
                }]
        });
        //panel SituacionProducts
        this.panelSituacionProducts = new Ext.Panel({
            region: 'center',
            layout: 'fit',
            border: true,
            width: 100,
            items: [this.gridIndDemandados],
            tbar: [, '->', this.btnAyudaRedist]
        });
        //windo situacion del producto
        this.winSituacionProducts = new Ext.Window({
            id: 'winSituacionProducts',
            modal: true,
            closeAction: 'hide',
            constrain: true,
            width: 800,
            layout: 'border',
            items: [this.panelSituacionProducts, this.tpEntidades],
            height: 600,
            title: 'Situación de los Productos',
            listeners: {
                hide: function() {
                }
            },
            buttons: []
        });
        this.tpEntidadesReportes = new Ext.estructura.panel.PanelEstructura(
                {
                    cargos: false,
                    menu: false
                });
        this.tpEntidadesReportes.btnBuscar.setText("");
        this.tpEntidadesReportes.btnLimpiar.setText("");
        this.tpEntidadesReportes = this.tpEntidadesReportes.items.items[0];
        this.tpEntidadesReportes.region = 'west';
        this.tpEntidadesReportes.width = 200;
        this.tpEntidadesReportes.addListener('click', function(n) {
            if (n.text != "Estructuras") {
                if (n.leaf) {
                    hoja = true;
                }
                else {
                    hoja = false;
                }
                identidadselected = n.id;
            }
            modelo.stProductos.reload({
                params: {
                    start: 0,
                    limit: 20,
                    identidad: identidadselected,
                    hoja: hoja,
                    idejercicio: Planificacion.BalanceMaterial.Redistribucion.Vista.cbEjercicio.getValue()
                }
            });
            Planificacion.BalanceMaterial.Redistribucion.Vista.panelProducto.enable();
        });

        this.filtroproductos = new Ext.grid.GridFilters({
            filters: [
                {
                    type: 'string',
                    dataIndex: 'denominacioncb'
                }, {
                    type: 'string',
                    dataIndex: 'unidadmedida'
                },
                {
                    type: 'string',
                    dataIndex: 'disponible'
                }, {
                    type: 'string',
                    dataIndex: 'codigo'
                },
                {
                    type: 'numeric',
                    dataIndex: 'demanda'
                }, {
                    type: 'numeric',
                    dataIndex: 'coberturatotalestimada'
                }, {
                    type: 'string',
                    dataIndex: 'unidadmedida'
                }, {
                    type: 'string',
                    dataIndex: 'denominacion'
                }, {
                    type: 'string',
                    dataIndex: 'numeropieza'
                }, {
                    type: 'string',
                    dataIndex: 'cer'
                }, {
                    type: 'list',
                    dataIndex: 'situacion',
                    tooltip: 'situación',
                    multiple: false,
                    options: ["Ocioso",
                        "Lento movimiento",
                        "Inventario útil"]
                }
            ]
        });

        //Grid de Reportes de redistribución
        this.gpProductos = new Ext.grid.GridPanel({
            id: 'gpProductos',
            frame: true,
            store: modelo.stProductos,
            region: 'center',
            title: 'Disponibilidad',
            plugins: this.filtroproductos,
            autoExpandColumn: 'codigo',
            columns: [{
                    id: 'codigo',
                    header: 'Código',
                    width: 150,
                    dataIndex: 'codigo',
                    tooltip: 'Código',
                    renderer: crearToolTip
                }, {
                    header: 'No. de pieza',
                    width: 150,
                    dataIndex: 'numeropieza',
                    tooltip: 'Número de pieza',
                    renderer: crearToolTip
                },
                {
                    header: 'Denominación',
                    width: 100,
                    dataIndex: 'denominacion',
                    tooltip: 'denominacion',
                    renderer: crearToolTip
                }, {
                    header: 'UM',
                    dataIndex: 'unidadmedida',
                    tooltip: 'Unidad de medida',
                    renderer: crearToolTip
                }, {
                    header: 'Centro de balance',
                    width: 200,
                    dataIndex: 'denominacioncb',
                    tooltip: 'Centro de balance',
                    renderer: crearToolTip
                }, {
                    header: 'Demanda',
                    dataIndex: 'demanda',
                    tooltip: 'Demanda',
                    renderer: crearToolTip
                }, {
                    header: 'CTE',
                    dataIndex: 'coberturatotalestimada',
                    tooltip: 'Cobertura Total Estimada',
                    renderer: crearToolTip
                }, {
                    header: 'CER',
                    dataIndex: 'cer',
                    tooltip: 'CER',
                    renderer: crearToolTip
                }, {
                    header: 'Situación',
                    dataIndex: 'situacion',
                    tooltip: 'situación',
                    renderer: crearToolTip
                }
            ],
            loadMask: {
                msg: 'Cargando ...'
            },
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.stProductos,
                displayInfo: true,
                items: ['-', this.btnLimpiarProductos]
            }),
            tbar: ['->', this.btnExportarReportes]

        });

        //Panel de Reportes de redistribución
        this.panelProducto = new Ext.Panel({
            layout: 'fit',
            region: 'center',
            border: true,
            disabled: true,
            items: [this.gpProductos]
        });
        //ventana de Reportes de redistribución
        this.winproducto = new Ext.Window({
            title: "Clasificación de los productos",
            width: 1000,
            layout: 'border',
            constrain: true,
            height: 500,
            modal: true,
            closeAction: 'hide',
            items: [this.tpEntidadesReportes, this.panelProducto]
        });
        this.panelRedistribucion = new Ext.Panel({
            layout: 'border',
            border: true,
            width: 200,
            items: [this.gridIndDemandados, this.gridEntAbastecedoras],
            tbar: [{
                    text: 'Centro balance:'
                }, this.cbCtroBalance, '-', this.btnRedistribuir, 'Ejercicio:', this.cbEjercicio, this.btnProductos, '->', this.btnAyudaRedist]//this.btnExportar,'-',
        });
        viewredt = new Ext.Viewport({
            layout: 'fit',
            id: 'viewredt',
            items: [this.panelRedistribucion],
            listeners: {
                'afterlayout': function() {
                    Ext.getCmp('btnAyudaRedist').focus(true, 500);

                }

            }
        })
    }
};

function siexisteIndicadorFiltrado() {
    if (filtroproductos.getFiltrosActivos().length > 0 && stProductos.getCount() == 0)
        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de busqueda especificados.');

}

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

//Inicializando la vista.
//variable que guarda los datos del perfil
var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
perfil.etiquetas = {};
Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('redistribucion', function(idioma) {
    //Escogiendo la configuraciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n del idioma segÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âºn la versiÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Planificacion.BalanceMaterial.Redistribucion.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Planificacion.BalanceMaterial.Redistribucion.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Planificacion.BalanceMaterial.Redistribucion.Controlador.init(idioma, vista, modelo);
});