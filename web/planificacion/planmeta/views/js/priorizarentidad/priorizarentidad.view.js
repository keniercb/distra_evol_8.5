//Namespace del componente Priorizar entidad asociadas a Balance Material
Ext.ns('Planificacion.BalanceMaterial.Priorizarentidad')

//Vista del componente Priorizarentidad asociadas a Balance Material
Planificacion.BalanceMaterial.Priorizarentidad.Vista = {
    /*Componente que inicializa la vista
     *@param: idioma Objeto que contiene el idioma de la aplicacion (type:Object)
     *@param: modelo Objeto que contiene los modelos para cargar los datos(type:Priorizarentidad asociadas a Balance Material)
     */

    identidadselected: null,
    iplanselected: null,
    flagobj: 0,
    modelo: null,
    valor: 0,
    prioini: 1,
    init: function (idioma, modelo) {
        _this = this;

        this.mymaskAsigPrioridad = new Ext.LoadMask(Ext.getBody(), {
            msg: perfil.etiquetas.msgAsignandoPrioridad
        });
        this.mymaskGuarPrioridad = new Ext.LoadMask(Ext.getBody(), {
            msg: perfil.etiquetas.msgGuardandoPrioridad
        });
        //botones
        this.btnAyudaPrioEnt = new Ext.Button({
            id: 'btnAyudaPrioEnt',
            // icon: perfil.dirImg + 'ayuda.png',
            tooltip: perfil.etiquetas.lbBtnMostrarAyuda + ' (<b>Alt+H</b>)',
            iconCls: 'ayuda',
            text: perfil.etiquetas.lbAyuda

        });
        this.btnSubir = new Ext.Button({
            disabled: true,
            id: 'btnsubir',
            tooltip: perfil.etiquetas.lbTtIncrementarPrioridad,
            // icon: perfil.dirImg + 'arriba.png',
            iconCls: 'arriba'
        });
        this.btnBajar = new Ext.Button({
            disabled: true,
            id: 'btnbajar',
            tooltip: perfil.etiquetas.lbTtDecrementarPrioridad,
            // icon: perfil.dirImg + 'abajo.png',
            iconCls: 'abajo'
        });
        this.btnGuardar = new Ext.Button({
            id: 'btnGuardar',
            // icon: perfil.dirImg + 'guardar.png',
            tooltip: perfil.etiquetas.lbTtGuardarPriorización + ' (<b>Alt+G</b>)',
            iconCls: 'guardar'//,
                    // text: 'Guardar'
        });
        this.btnLimpiarFiltrosCB = new Ext.Button({
            id: 'btnLimpiarFiltrosCB',
            // icon: perfil.dirImg + 'limpiar.png',
            tooltip: perfil.etiquetas.lbTtLimpiarFiltros + ' (<b>Alt+L</b>)',
            iconCls: 'limpiar'//,
                    // text: '<u>L</u>impiar'
        });

        /******TECLAS CALIENTES**********/
        this.globalKeyMap = new Ext.KeyMap(document);
        this.globalKeyMap.accessKey = function (key, handler, scope) {
            var h = function (n, e) {
                e.preventDefault();
                handler.call(scope || this, n, e);
            };
            this.on(key, h, scope);
        };
        /************* FIN TECLAS CALIENTES*************/
        stCbejercicio = new Ext.data.Store({
            url: ' ../gestplanes/getEjercicios',
            autoLoad: true,
            listeners: {
                load: function (t, n, e) {
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
            //enableKeyEvents: true,
            emptyText: perfil.etiquetas.lbSeleccione,
            loadingText: perfil.etiquetas.lbCargando,
            width: 180,
            listeners: {
                select: function (cb, rec, index) {
                    mymask.show();
                    stCmbModelo.reload();
                }
            }
        });

        this.smGpCB = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (sm, row, record) {
                    if (record.data.total != record.data.totalesp) {
                        _this.mymaskAsigPrioridad.show();
                        Ext.Ajax.request({
                            url: 'asignarPrioridadPorDefecto',
                            params: {
                                idcb: record.data.identidaddatosnomenclador
                            },
                            callback: function (options, success, response) {
                                _this.mymaskAsigPrioridad.hide();
                                _this.gridEspecialidad.getStore().reload({
                                    params: {
                                        idcb: record.data.identidaddatosnomenclador,
                                        start: 0,
                                        limit: 20
                                    }
                                });
                            }
                        });
                    } else {
                        _this.gridEspecialidad.getStore().reload({
                            params: {
                                idcb: record.data.identidaddatosnomenclador,
                                start: 0,
                                limit: 20
                            }
                        });
                    }
                    Ext.getCmp('cbPaginado').setValue(20);
                },
                rowdeselect: function () {
                },
                beforerowselect: function () {
                }
            }
        });
        //Grid Centros de Balance

        this.filtroscentrobalance = new Ext.grid.GridFilters({
            filters: [
                {
                    type: 'string',
                    dataIndex: 'denominacion'
                }]
        });

        this.filtrosespecialidades = new Ext.grid.GridFilters({
            filters: [
                {
                    type: 'string',
                    dataIndex: 'denespecialidad'
                }, {
                    type: 'numeric',
                    dataIndex: 'prioridad'
                }]
        });
        this.filtrocbpriori = {
            xtype: 'textfield',
            emptyText: perfil.etiquetas.lbFiltrarCB,
            width: 110,
            id: 'idfiltrocbpriori',
            listeners: {
                specialkey: function (t, e) {
                    if (e.getKey() == '13') {
                        actualizargridPrioridad(_this.gridCentrosbalance, Ext.getCmp('idfiltrocbpriori').getValue());

                    }
                }
            }
        };

        this.gridCentrosbalance = new Ext.grid.GridPanel({
            title: perfil.etiquetas.lbCentrosDeBalance,
            region: 'west',
            width: 320,
            autoExpandColumn: 'denominacion',
            store: modelo.stgpCentrosbalance,
            sm: this.smGpCB,
            plugins: this.filtroscentrobalance,
            loadMask: {
                msg: perfil.etiquetas.lbCargando
            },
            columns: [{
                    header: perfil.etiquetas.lbDenominacion,
                    width: 250,
                    id: 'denominacion',
                    height: 600,
                    dataIndex: 'denominacion',
                    tooltip: 'Centros Balance',
                    renderer: crearToolTip
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: modelo.stgpCentrosbalance,
                displayInfo: false,
                id: 'idpaginadocb',
                items: ['-', this.btnLimpiarFiltrosCB]
            }),
            tbar: [this.filtrocbpriori]
        });

        // Selection Model grid smGpGestTipoModelo
        this.smGpEsp = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (sm, row, record) {
                    _this.btnSubir.enable();
                    _this.btnBajar.enable();
                    if (row == 0)
                        _this.btnSubir.disable();
                    if (row == modelo.stgpEspecialidad.getCount() - 1)
                        _this.btnBajar.disable();
                },
                rowdeselect: function () {
                },
                beforerowselect: function () {
                }
            }
        });

        this.cbPaginado = new Ext.form.ComboBox({
            value: 20,
            store: modelo.stCbPaginado,
            id: 'cbPaginado',
            displayField: 'dennumpag',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            hiddenName: 'idnumpag',
            valueField: 'idnumpag',
            width: 55,
            emptyText: perfil.etiquetas.lbSeleccione,
            listeners: {
                select: function (cb, record, index) {
                    Ext.getCmp('idpaginaesp').pageSize = record.data.idnumpag;
                    Ext.getCmp('idpaginaesp').doLoad(Ext.getCmp('idpaginaesp').cursor);
                }
            },
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            maskReregex: /^([0-9]+ ?[0-9]*)+$/
        });



        //*************************************
        stCbejercicio = new Ext.data.Store({
            url: ' ../gestplanes/getEjercicios',
            autoLoad: true,
            listeners: {
                load: function (t, n, e) {
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
            emptyText: perfil.etiquetas.lbSeleccione,
            loadingText: perfil.etiquetas.lbCargando,
            width: 180,
            listeners: {
                select: function (cb, rec, index) {
                    stCalculoCobertura.reload({
                        params: {
                            idejercicio: cbEjercicio.getValue(),
                            limit: 20,
                            start: 0
                        }
                    });
                }
            }
        });

        //Grid de Especialidad
        this.gridEspecialidad = new Ext.grid.EditorGridPanel({
            title: perfil.etiquetas.lbPriorizarEspecialidades,
            autoExpandColumn: 'denespecialidad',
            store: modelo.stgpEspecialidad,
            sm: this.smGpEsp,
            region: 'center',
            width: 400,
            plugins: this.filtrosespecialidades,
            loadMask: {
                msg: perfil.etiquetas.lbCargando
            },
            columns: [{
                    header: perfil.etiquetas.lbEspecialidad,
                    width: 200,
                    id: 'denespecialidad',
                    dataIndex: 'denespecialidad',
                    tooltip: perfil.etiquetas.lbEspecialidad,
                    renderer: crearToolTip
                }, {
                    header: perfil.etiquetas.lbPrioridad,
                    width: 70,
                    align: 'right',
                    dataIndex: 'prioridad',
                    tooltip: perfil.etiquetas.lbPrioridad,
                    renderer: function (v, m) {
                        if (v == null)
                            return 0;
                        return v;
                    }
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                id: 'idpaginaesp',
                store: modelo.stgpEspecialidad,
                displayInfo: true,
                items: ['-', {
                        xtype: 'tbtext',
                        text: perfil.etiquetas.lbResultadosPorPagina + ":"
                    }, this.cbPaginado, '->']
            }),
            tbar: [this.btnGuardar, '-', this.btnSubir, '-', this.btnBajar]
        });

        this.panelEntprio = new Ext.Panel({
            layout: 'border',
            border: true,
            width: 1000,
            items: [this.gridEspecialidad, this.gridCentrosbalance],
            tbar: ['->', this.btnAyudaPrioEnt]
        });
        this.viewprioent = new Ext.Viewport({
            layout: 'fit',
            id: 'viewredt',
            items: [this.panelEntprio],
            listeners:
                    {
                        'afterlayout': function () {
                            Ext.getCmp('btnAyudaPrioEnt').focus();
                        }
                    }
        });

        function actualizargridPrioridad(grid, valor) {
            grid.getStore().reload({
                params: {
                    start: 0,
                    limit: 20,
                    valor: valor
                }
            });
        }
        ;
    }
};

function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}

//Inicializando la vista.
//variable que guarda los datos del perfil
var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
perfil.etiquetas = {};
Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('priorizarentidad', function (idioma) {
    //Escogiendo la configuracion del idioma segun la version del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Planificacion.BalanceMaterial.Priorizarentidad.Modelo;
    modelo.init();
    //Inicializando la vista.
    var vista = Planificacion.BalanceMaterial.Priorizarentidad.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Planificacion.BalanceMaterial.Priorizarentidad.Controlador.init(idioma, vista, modelo);
});