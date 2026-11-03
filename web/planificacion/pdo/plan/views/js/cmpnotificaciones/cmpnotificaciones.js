/**IU del CMPNOTIFICACIONES *
 * @author Ariadna Rendón Artola
 * @version 1.0.0
 * @copyright UCID, ERP-CUBA
 */
Utilidades.Cmp.CmpNotificaciones = function (opcionesConfig) {
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.escenarioActivo = '';
    this.arraytipoelem = [];
    this.htmlTPL = '';
    //COMPONENTES AUXILIARES......
    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();
    this.objclasificadorinvolrepeticiones = new Utilidades.Cmp.Cmpclasificadorinvol();

    //objeto del componente "relaciones"
    this.objcmprelaciones = new Utilidades.Cmp.Cmprelaciones();

    //objeto CRUD-ACTIVIDADES inicializado
    this.objCrudActividad = new Utilidades.Cmp.Cmpcrudactividades();

    //objeto CRUD-PLAN inicializado
    this.objCrudPlan = new Utilidades.Cmp.Cmpcrudplan();

    //objeto CRUD-PLAN inicializado
    this.objCrudObjetivo = new Utilidades.Cmp.Cmpcrudobjetivos();

    //BUTTONS.......
    this.btnVer = new Ext.Button({
        handler: function () {
            _this.VerElemento();
        },
        disabled: true,
        id: 'btnVer',
        nextTab: 'btnEliminar',
        prevTab: 'btnCerrarNotificacion',
        iconCls: 'ver',
        cls: 'btn',
        tooltip: 'Ver elemento que generó la notificación <br>seleccionada',
        key: {
            alt: true,
            key: 'D'
        },
        scope: this
    });

    this.btnEliminar = new Ext.Button({
        handler: function () {
            _this.EliminarElemento();
        },
        disabled: true,
        id: 'btnEliminar',
        nextTab: 'btnHistorial',
        prevTab: 'btnVer',
        iconCls: 'eliminar',
        tooltip: 'Eliminar notificación',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });

    this.btnHistorial = new Ext.Button({
        disabled: true,
        id: 'btnHistorial',
        nextTab: 'btnVersionAnterior',
        prevTab: 'btnEliminar',
        iconCls: 'historial',
        tooltip: 'Consultar historial',
        handler: function () {
            var tipo = _this.smNotificaciones.getSelected().data.idtipoelemento;
            this.objHistorial = null;
            if (tipo == 0) {
                this.objHistorial = new Utilidades.Cmp.Cmphistorial({
                    mostrarVentana: false, panel: 'plan',
                    idhistorial: _this.smNotificaciones.getSelected().data.idhistorial
                });
                this.btnVer = _this.objHistorial.btnVerDetallesPlanes;
                _this.objHistorial.filtrosPlanes.clearFilters();
            }
            if (tipo == 1) {
                this.objHistorial = new Utilidades.Cmp.Cmphistorial({
                    mostrarVentana: false, panel: 'obj',
                    idhistorial: _this.smNotificaciones.getSelected().data.idhistorial
                });
                this.btnVer = _this.objHistorial.btnVerDetallesObjetivos;
                _this.objHistorial.filtrosObjetivos.clearFilters();
            }
            if (tipo == 3) {
                this.objHistorial = new Utilidades.Cmp.Cmphistorial({
                    mostrarVentana: false, panel: 'act',
                    idhistorial: _this.smNotificaciones.getSelected().data.idhistorial
                });
                this.btnVer = _this.objHistorial.btnVerDetallesActividades;
                _this.objHistorial.filtrosActividades.clearFilters();
            }
            _this.verHistorial(_this.objHistorial.Inicializar(_this.smNotificaciones.getSelected().data.idelemento),
                _this.btnVer);
        },
        key: {
            ctrl: true,
            alt: true,
            key: 'H'
        },
        scope: this
    });
    this.btnVersionAnterior = new Ext.Button({
        disabled: true,
        id: 'btnVersionAnterior',
        nextTab: 'btnPanelBusqueda',
        prevTab: 'btnHistorial',
        iconCls: 'icondistra-comparar',
        tooltip: 'Comparar con versión anterior',
        handler: function () {
            var tipo = _this.smNotificaciones.getSelected().data.idtipoelemento;
            _this.objHistorial = null;
            if (tipo == 0) {
                _this.objHistorial = new Utilidades.Cmp.Cmphistorial({
                    mostrarVentana: false, panel: 'plan',
                    idhistorial: _this.smNotificaciones.getSelected().data.idhistorial
                });
            }
            if (tipo == 1) {
                _this.objHistorial = new Utilidades.Cmp.Cmphistorial({
                    mostrarVentana: false, panel: 'obj',
                    idhistorial: _this.smNotificaciones.getSelected().data.idhistorial
                });
            }
            if (tipo == 3) {
                _this.objHistorial = new Utilidades.Cmp.Cmphistorial({
                    mostrarVentana: false, panel: 'act',
                    idhistorial: _this.smNotificaciones.getSelected().data.idhistorial
                });
            }
            _this.objHistorial.CompararAnterior(_this.smNotificaciones);
        },
        key: {
            shift: true,
            key: 'C'
        },
        scope: this
    });

    this.btnPanelBusqueda = new Ext.Button({
        id: 'btnPanelBusqueda',
        prevTab: 'btnVersionAnterior',
        nextTab: 'btnCerrarNotificacion',
        iconCls: 'buscaravanzada',
        tooltip: 'B&uacute;squeda avanzada de notificación(es)',
        handler: function () {
            _this.pBuscarNotificaciones.toggleCollapse(true);
        },
        key: {
            alt: true,
            key: 'B'
        },
        scope: this
    });

    this.btnEliminarTodas = new Ext.Button({
        handler: function () {
            _this.EliminarTodasNotificaciones();
        },
        disabled: false,
        id: 'btnEliminarTodas',
        nextTab: 'btnAyudaNotificaciones',
        prevTab: 'btnPanelBusqueda',
        iconCls: 'sipac-roja icondistra-desintalar',
        tooltip: 'Eliminar todas las notificación',
        key: {
            ctrl: true,
            key: 'E'
        },
        scope: this
    });

    this.btnBusquedaSimple = new Ext.Button({
        id: 'btnBusquedaSimple',
        nextTab: 'btnLimpiar',
        text: 'Buscar',
        iconCls: 'buscar',
        disabled: true,
        tooltip: 'Buscar notificaci&oacute;n(es)',
        handler: function () {
            _this.BuscarNotificaciones();
        }
    });

    this.btnLimpiar = new Ext.Button({
        id: 'btnLimpiar',
        nextTab: 'btnVer',
        text: 'Limpiar',
        disabled: true,
        handler: function () {
            _this.LimpiarBusqueda();
        },
        iconCls: 'limpiar',
        tooltip: 'Limpiar filtro',
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });
    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaNotificaciones',
        text: 'Ayuda',
        disabled: false,
        hidden: opcionesConfig.noUsarAyuda,
        iconCls: 'ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad',
        key: {
            alt: true,
            key: 'H'
        },
        scope: this
    });

    //ELEMENTOS DEL PANEL DE BUSQUEDAS....
    this.tfAsunto = new Ext.form.TextField({
        fieldLabel: 'Asunto',
        maskRe: /^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/,
        regex: /^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/,
        anchor: '95%',
        allowBlank: true,
        name: 'asunto'
    });

    this.stcbtipo = new Ext.data.Store({
        url: '/planificacion/pdo/plan/index.php/cmpnotificaciones/cargarTipoNotificaciones',
        reader: new Ext.data.JsonReader({
            id: 'idaccion',
            root: "datos"
        }, [{
            name: 'idaccion'
        }, {
            name: 'denominacion'
        }
        ])
    });

    this.cbTipo = new Ext.form.ComboBox({
        emptyText: 'Seleccione',
        name: 'tiponot',
        fieldLabel: 'Tipo de notificación',
        store: this.stcbtipo,
        hiddenName: 'idaccion',
        valueField: 'idaccion',
        displayField: 'denominacion',
        triggerAction: 'all',
        readOnly: true,
        loadingText: 'Cargando datos...',
        allowBlank: true,
        mode: 'local',
        anchor: '95%',
        listeners: {
            expand: function (combo) {
                _this.stCmbCategorias.reload();
            }
        }
    });

    this.fieldset = new Ext.form.FieldSet({
        title: 'Tipo de elemento',
        collapsible: true,
        autoHeight: true,
        defaults: {
            width: 210
        },
        layout: 'form',
        hidden: opcionesConfig.MostrarFiltroPorTipoElem,
        items: [{
            hideLabel: true,
            xtype: 'checkboxgroup',
            bodyStyle: 'padding: 2px 2px 2px 2px;',
            anchor: '95%',
            columns: 2,
            items: [
                {
                    boxLabel: 'Planes',
                    name: 'chbplan',
                    listeners: {
                        check: function (chb, check) {
                            var esta_en_array = false;
                            if (check) {
                                Ext.each(_this.arraytipoelem, function (val) {
                                    if (val == 0)
                                        esta_en_array = true;
                                });
                                if (!esta_en_array)
                                    _this.arraytipoelem.push(0);
                            } else
                                _this.arraytipoelem.remove(0);
                        }
                    }
                }, {
                    boxLabel: 'Objetivos',
                    name: 'chbobj',
                    listeners: {
                        check: function (chb, check) {
                            var esta_en_array = false;
                            if (check) {
                                Ext.each(_this.arraytipoelem, function (val) {
                                    if (val == 1)
                                        esta_en_array = true;
                                });
                                if (!esta_en_array)
                                    _this.arraytipoelem.push(1);
                            } else
                                _this.arraytipoelem.remove(1);
                        }
                    }
                }, {
                    boxLabel: 'Actividades',
                    name: 'chbact',
                    listeners: {
                        check: function (chb, check) {
                            var esta_en_array = false;
                            if (check) {
                                Ext.each(_this.arraytipoelem, function (val) {
                                    if (val == 3)
                                        esta_en_array = true;
                                });
                                if (!esta_en_array)
                                    _this.arraytipoelem.push(3);
                            } else
                                _this.arraytipoelem.remove(3);
                        }
                    }
                }, {
                    boxLabel: 'Criterio de medida',
                    name: 'chbcrit',
                    listeners: {
                        check: function (chb, check) {
                            var esta_en_array = false;
                            if (check) {
                                Ext.each(_this.arraytipoelem, function (val) {
                                    if (val == 4)
                                        esta_en_array = true;
                                });
                                if (!esta_en_array)
                                    _this.arraytipoelem.push(4);
                            } else
                                _this.arraytipoelem.remove(4);
                        }
                    }
                }]
        }]
    });

    this.fechaocurrencia = new Ext.form.DateField({
        fieldLabel: 'Fecha de ocurrencia',
        format: 'd/m/Y',
        anchor: '95%',
        readOnly: true,
        allowBlank: true,
        name: 'fecha'
    });

    this.tpAutores = _this.objclasificadorinvol.CrearClasificadorInvolBusqueda(tipoelemento = 1, 1);

    this.fpBuscarAutores = new Ext.form.FormPanel({
        frame: true,
        layout: 'fit',
        items: _this.tpAutores,
        buttons: [_this.btnBusquedaSimple, _this.btnLimpiar],
        listeners: {
            'clientvalidation': function (fm, valid) {
                if (_this.objclasificadorinvol.ObtenerAutoresBusqueda().length != '') {
                    _this.btnBusquedaSimple.enable();
                    _this.btnLimpiar.enable();
                } else {
                    _this.btnBusquedaSimple.disable();
                    _this.btnLimpiar.disable();
                }
            }
        }
    });

    this.pBuscarNotificaciones = new Ext.Panel({
        title: 'Opciones de b&uacute;squeda',
        layout: 'fit',
        width: 300,
        collapsible: true,
        collapsed: true,
        margins: '3 3 3 3',
        region: 'east',
        items: [_this.fpBuscarAutores/*_this.tpAutores*/],
        listeners: {
            expand: function (p) {
                p.doLayout();
                _this.stcbtipo.reload();
            }
        }
    });

    //GRIDPANEL  DONDE SE MOSTRARAN LAS NOTIFICACIONES....
    this.reader = new Ext.data.JsonReader({
        root: 'datos',
        totalProperty: 'total',
        id: 'idnotificacion'
    }, [
        {
            name: 'idnotificacion'
        }, {
            name: 'idelemento'
        }, {
            name: 'idhistorial'
        }, {
            name: 'asunto'
        }, {
            name: 'idaccion'
        }, {
            name: 'denaccion'
        }, {
            name: 'idtipoelemento'
        }, {
            name: 'denelemento'
        }, {
            name: 'autor'
        }, {
            name: 'fecha'
        }, {
            name: 'hora'
        }, {
            name: 'notificacionleida'
        }, {
            name: 'clasifTime'
        }, {
            name: 'fechainicio'
        }, {
            name: 'fechainicioanterior'
        }, {
            name: 'fechafin'
        }, {
            name: 'fechafinanterior'
        }, {
            name: 'horainicio'
        }, {
            name: 'horainicioanterior'
        }, {
            name: 'horafin'
        }, {
            name: 'horafinanterior'
        }, {
            name: 'descripcion'
        }
    ]);

    this.expander = new Ext.grid.RowExpander({
        tpl: new Ext.Template([]),
        listeners: {
            beforeExpand: function (re, record, body) {
                this.htmlTPL = '';
                _this.htmlTPL = '<div class="x-grid3-row-over padding-expander">\n\
						<p><b>Fecha de ocurrencia:</b> {fecha}\n\
						<br><b>Hora de ocurrencia:</b> {hora}\n\
						<br><b>Autor:</b> {autor}\n\
						<br><b>Tipo de notificación:</b> {denaccion}';
                if (record.data.idaccion != 3) {
                    _this.htmlTPL += '<br><b>Denominación del elemento:</b> {denelemento}\n\
                                      <br><b>CAR:</b> {idelemento}';
                }
                //_this.htmlTPL += '<br><b>CAR:</b> {idelemento}';

                if (record.data.fechainicioanterior || record.data.fechafinanterior ||
                    record.data.horainicioanterior || record.data.horafinanterior) {
                    _this.htmlTPL += '<br><b><u>Se estableció un nuevo horario:</u></b>';
                    if (record.data.fechainicioanterior)
                        _this.htmlTPL += '<br><b>Fecha de inicio anterior:</b> {fechainicioanterior} &nbsp;&nbsp; <b>Fecha de inicio establecida:</b> {fechainicio}';
                    if (record.data.fechafinanterior)
                        _this.htmlTPL += '<br><b>Fecha de fin anterior:</b> {fechafinanterior}  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   <b>Fecha de fin establecida:</b> {fechafin}';
                    if (record.data.horainicioanterior)
                        _this.htmlTPL += '<br><b>Hora de inicio anterior:</b> {horainicioanterior}    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Hora de inicio establecida:</b> {horainicio}';
                    if (record.data.horafinanterior)
                        _this.htmlTPL += '<br><b>Hora de fin anterior:</b> {horafinanterior} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  <b>Hora de fin establecida:</b> {horafin}';
                }
                _this.htmlTPL += '</p></div>';
                re.tpl.set(_this.htmlTPL);
            },
            expand: function (re, record, css) {
                //console.log(record.data);
                //var asunto = record.data.asunto;
                var asunto = record.data.descripcion;
                if (record.data.notificacionleida == 0) {
                    asunto = _this.CambiarEstiloAsunto(record, asunto);
                }
                var asuntoM = '<b>Asunto:</b>' + asunto;
                record.set('asunto', asuntoM);
                record.commit();
            },
            collapse: function (tpl, record, css) {
                //var asuntoN = record.get('asunto');
                var asuntoN = record.get('descripcion');
                var asunto = asuntoN.replace('<b>Asunto:</b>', '');
                record.set('asunto', asunto);
                record.commit();
            }
        }
    });

    this.stNotificaciones = new Ext.data.GroupingStore({
        url: '/planificacion/pdo/plan/index.php/cmpnotificaciones/cargarNotificaciones',
        reader: _this.reader,
        sortInfo: {
            field: 'idnotificacion',
            direction: "DESC"
        },
        groupField: 'clasifTime',
        listeners: {
            beforeload: function (st, records, opcion) {
                _this.BarraProgreso.show('Cargando notificaciones');
                st.baseParams.asunto = _this.tfAsunto.getValue();
                st.baseParams.idaccion = _this.cbTipo.getValue();
                st.baseParams.arraytipoelem = Ext.encode(_this.arraytipoelem);
                st.baseParams.fecha = Ext.encode(_this.fechaocurrencia.getValue());
                st.baseParams.autores = Ext.encode(_this.objclasificadorinvol.ObtenerAutoresBusqueda())
            },
            load: function (st, records, opcion) {
                _this.BarraProgreso.hide();
                Ext.each(records, function (r) {
                    _this.expander.collapseRow(st.indexOf(r))
                });
                st.sort('idnotificacion', "DESC");
                setTimeout(function () {
                    Ext.getCmp('btnCerrarNotificacion').focus(true);
                }, 100);
            }
        }
    });

    this.smNotificaciones = new Ext.grid.CheckboxSelectionModel({
        moveEditorOnEnter: true,
        // singleSelect:true,**************
        listeners: {
            rowselect: function (sm, index, record) {
                if (sm.getSelections().length > 0) {
                    _this.btnEliminar.enable();
                    if (sm.getSelections().length == 1) {
                        if (record.data.idtipoelemento == 4) {
                            _this.btnHistorial.disable();
                            _this.btnVersionAnterior.disable();
                        } else {
                            _this.btnHistorial.enable();
                            _this.btnVersionAnterior.enable();
                        }
                        if (record.data.idaccion == '3') {
                            _this.btnVer.disable();
                        } else {
                            _this.btnVer.enable();
                        }
                        if (sm.getSelections()[0].data.notificacionleida == 0) {
                            _this.expander.expandRow(index);
                        }
                    }
                } else {
                    _this.btnEliminar.disable();
                    _this.btnVer.disable();
                    _this.btnHistorial.disable();
                    _this.btnVersionAnterior.disable();
                }
            },
            rowdeselect: function (sm, index, record) {
                if (sm.getSelections().length > 0) {
                    _this.btnEliminar.enable();
                    if (sm.getSelections().length == 1) {
                        if (record.data.idtipoelemento == 4) {
                            _this.btnHistorial.disable();
                            _this.btnVersionAnterior.disable();
                        } else {
                            _this.btnHistorial.enable();
                            _this.btnVersionAnterior.enable();
                        }
                        if (record.data.idaccion == '3') {
                            _this.btnVer.disable();
                        } else {
                            _this.btnVer.enable();
                        }
                    }
                } else {
                    _this.btnEliminar.disable();
                    _this.btnVer.disable();
                    _this.btnHistorial.disable();
                    _this.btnVersionAnterior.disable();
                }
            }
        }
    });
    this.ptNotificaciones = new Ext.PagingToolbar({
        pageSize: 20,
        store: _this.stNotificaciones,
        displayInfo: true,
        width: '480px'
    });

    this.gpNotificaciones = new Ext.grid.GridPanel({
        plugins: _this.expander,
        usarKeymap: true,
        botonesKeymap: [this.btnVer, this.btnEliminar, this.btnEliminarTodas, this.btnHistorial, _this.btnVersionAnterior, this.btnPanelBusqueda, this.btnAyuda],
        tbar: [this.btnVer, ' ', this.btnEliminar, ' ', this.btnHistorial, ' ', _this.btnVersionAnterior, ' ', this.btnPanelBusqueda, ' ', this.btnEliminarTodas, '->', this.btnAyuda],
        store: _this.stNotificaciones,
        sm: _this.smNotificaciones,
        loadMask: {
            msg: 'Cargando notificaciones'
        },
        columns: [_this.smNotificaciones,
            {
                id: 'asunto',
                header: "Notificaciones ",
                width: 60,
                sortable: true,
                dataIndex: 'asunto',
                renderer: function (val, p, record) {
                    //se marcar en negrita las notificaciones leidas
                    if (record.data.notificacionleida == 0)
                        val = '<b>' + val + '</b>';
                    return _this.MostrarImagenTipoElemento(val, record);
                }
            }, {
                hidden: true,
                header: "Fecha de la notificación",
                width: 20,
                sortable: true,
                dataIndex: 'clasifTime'
            }, {
                hidden: true,
                header: "Fecha",
                width: 20,
                sortable: true,
                //renderer: Ext.util.Format.dateRenderer('d/m/Y'),
                dataIndex: 'fecha'
            }, _this.expander
        ],
        view: new Ext.grid.GroupingView({
            forceFit: true,
            groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "notificaciones" : "notificación"]})'
        }),
        region: 'center',
        frame: true,
        bbar: [_this.ptNotificaciones, '->', '-', 'Leyenda: ',
            {
                text: 'Nueva',
                iconCls: 'icondistra-bandera sipac-verde',
                disabled: true,
                disabledClass: ''
            }, ' ',
            {
                text: 'Modificada',
                iconCls: 'icondistra-bandera sipac-amarilla',
                disabled: true,
                disabledClass: ''
            }, ' ',
            {
                text: 'Eliminada',
                iconCls: 'icondistra-bandera sipac-roja',
                disabled: true,
                disabledClass: ''
            }, ' ',
            {
                text: 'Suspendida',
                iconCls: 'icondistra-bandera sipac-gris',
                disabled: true,
                disabledClass: ''
            }, ' ',
            {
                text: 'Aviso',
                iconCls: 'icondistra-bandera sipac-azul',
                disabled: true,
                disabledClass: ''
            }, '-'
        ]
    });

    //VENTANA PRINCIPAL....
    this.WinPrincipal = new Ext.Window({
        title: opcionesConfig.Mostrartitle,
        layout: 'border',
        constrain: true,
        border: false,
        closable: opcionesConfig.closeableWinPrincipal,
        maximized: opcionesConfig.maxWinPrincipal,
        noTitle: opcionesConfig.maxWinPrincipal,
        modal: true,
        closeAction: 'hide',
        width: opcionesConfig.widthMy ? opcionesConfig.widthMy : 1000,
        height: opcionesConfig.heightMy ? opcionesConfig.heightMy : 510,
        items: [this.gpNotificaciones, this.pBuscarNotificaciones],
        buttons: [
            {
                id: 'btnCerrarNotificacion',
                text: 'Cerrar',
                nextTab: 'btnVer',
                prevTab: 'btnPanelBusqueda',
                tooltip: 'Cerrar ventana',
                hidden: opcionesConfig.UsarBtnCerrar,
                iconCls: 'cerrar',
                handler: function () {
                    _this.LimpiarBusqueda();
                    _this.pBuscarNotificaciones.collapse();
                    _this.WinPrincipal.doLayout();
                    _this.WinPrincipal.hide();
                }
            }]
    });

    this.MostrarImagenTipoElemento = function (valor, r) {
        var tipoelemento = "";
        var colonotif = "";
        switch (r.data.idtipoelemento) {
            case '0':
                tipoelemento = 'icondistra-folder';
                break;
            case '1':
                tipoelemento = 'icondistra-archivo';
                break;

            case '2':
                tipoelemento = 'icondistra-ficha';
                break;

            case '3':
                tipoelemento = 'icondistra-actividades';
                break;

            case '4':
                tipoelemento = 'icondistra-folder';
                break;

            case '5':
                tipoelemento = 'icondistra-gestionardocumentosporsubsistema';
                break;
            case '7':
                tipoelemento = 'icondistra-actividades';
                break;
            default:
                tipoelemento = 'icondistra-folder';
                break;

        }
        switch (r.data.idaccion) {
            case '2':
                colonotif = 'sipac-amarilla';
                break;
            case '3':
                colonotif = 'sipac-roja';
                break;
            case '1':
                colonotif = 'sipac-verde';
                break;
            case '4':
                //colonotif = 'sipac-gris';
                colonotif = 'sipac-amarilla';
                break;
            case '6':
                colonotif = 'sipac-azul';
                break;
            case '7':
                colonotif = 'sipac-gris';
                break;
        }
        return "<span class='" + tipoelemento + " " + colonotif + "'>" + "&nbsp; " + valor + "</span>";
    };

    this.obtenerTotalNotificaciones = function () {
        _this.stNotificaciones.getCount();
    };
    /**
     * Nombre de la función CargarCmpNotificaciones
     * Descripcion  Mostrar ventana principal del CmpNotificaciones.
     * @author Ariadna Rendón Artola
     */
    this.CargarCmpNotificaciones = function (tipo) {
        if (typeof (tipo) == 'number') {
            _this.escenarioActivo = tipo;
            _this.arraytipoelem = [tipo];
        }
        _this.stNotificaciones.reload();
        _this.WinPrincipal.show();
        setTimeout(function () {
            Ext.getCmp('btnCerrarNotificacion').focus(true);
        }, 500);
    };
    /**
     * Nombre de la función LimpiarBusqueda
     * Descripcion  Permite limpiar el filtro de busqueda de notificaciones.
     * @author Ariadna Rendón Artola
     */
    this.LimpiarBusqueda = function () {
        //var fp = Ext.getCmp('fpbusquedaNot').getForm();
        var autores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
        var asunto = _this.tfAsunto.getValue();
        var accion = _this.cbTipo.getValue();
        var fecha = _this.fechaocurrencia.getValue();
        if (asunto || accion || fecha || _this.arraytipoelem.length > 0 || autores.length > 0) {
            //fp.reset();
            _this.objclasificadorinvol.ResetearArbolesBusqueda();
            if (typeof (_this.escenarioActivo) == 'number')
                _this.arraytipoelem = [_this.escenarioActivo];
            else
                _this.arraytipoelem = [];
            _this.stNotificaciones.reload();
        }
        _this.objclasificadorinvol.ResetearArbolesBusqueda();
    };

    /**
     * Nombre de la función BuscarNotificaciones
     * Descripcion  Permite realizar la búsqueda de las notificaciones atendiendo a determinados criterios.
     * @author Ariadna Rendón Artola
     */
    this.BuscarNotificaciones = function () {
        //var fp = Ext.getCmp('fpbusquedaNot').getForm();
        var autores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
        var asunto = _this.tfAsunto.getValue();
        var accion = _this.cbTipo.getValue();
        var fecha = _this.fechaocurrencia.getValue();
        if (_this.escenarioActivo) {
            if (asunto || accion || fecha || autores.length > 0) {
                _this.stNotificaciones.reload({
                    callback: function () {
                        if (_this.stNotificaciones.getTotalCount() == 0) {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                        }
                    }
                });
            } else {
                mostrarMensaje(1, "Debe seleccionar al menos un criterio de");
            }
        } else {
            if (asunto || accion || fecha || _this.arraytipoelem.length > 0 || autores.length > 0) {
                _this.stNotificaciones.reload({
                    callback: function () {
                        if (_this.stNotificaciones.getTotalCount() == 0) {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');

                        }
                    }
                });
            } else {
                mostrarMensaje(1, "Debe seleccionar al menos un criterio de búsqueda.");
            }
        }
    };
    /**
     * Nombre de la función VerElemento
     * Descripcion  Permite visualizar los datos de la notificacion seleccionada.
     * @author Ariadna Rendón Artola
     */
    this.VerElemento = function () {
        var notifSeleted = _this.smNotificaciones.getSelected();
        var tipoelem = notifSeleted.data.idtipoelemento;
        var idelemento = notifSeleted.data.idelemento;
        switch (tipoelem) {
            case '3': {
                _this.objCrudActividad.CrearWinCrudActividades(new Date().format('d/m/Y'),
                    new Date().format('d/m/Y'), '8:00 AM', '5:00 PM', 'Ver datos de la', function () {
                    }, [idelemento], null, 0, permisomodificar = 1, permisoeliminar = 1, []);
            }
                break;
            case '0': {
                _this.objCrudPlan.CrearWinCrudPlan('Ver datos del', function () {
                }, [idelemento])
            }
                break;
            case '1': {
                _this.objCrudObjetivo.CrearWinCrudObjetivos(new Date().format('d/m/Y'),
                    new Date().format('d/m/Y'), 'Ver datos del', function () {
                    }, [idelemento], null, _this.eshija, permisomodificar = 1, permisoeliminar = 1, []);
            }
                break;
            case '4': {
                _this.objCrudObjetivo.CrearWinCriterio('Ver datos del', new Date().format('d/m/Y'),
                    new Date().format('d/m/Y'), [idelemento]);
            }
                break;
            default:
                break;
        }
    };
    /**
     * Nombre de la función EliminarElemento
     * Descripcion  Permite eliminar la notificacion seleccionada.
     * @author Ariadna Rendón Artola
     */
    this.EliminarElemento = function () {
        var notifSeleteds = _this.smNotificaciones.getSelections();
        var arrayidnotif = [];
        Ext.each(notifSeleteds, function (r) {
            arrayidnotif.push(r.id);
        });
        var mensaje = '', mensajemascara = '', mensajeresp = '';
        if (notifSeleteds.length > 1) {
            mensaje = '¿Está seguro que quiere eliminar las notificaciones seleccionadas?';
            mensajemascara = 'Eliminando notificaciones';
            mensajeresp = 'Las notificaciones han sido eliminadas satisfactoriamente.';
        } else {
            mensaje = '¿Está seguro que quiere eliminar la notificación seleccionada?';
            mensajemascara = 'Eliminando notificación';
            mensajeresp = 'La notificación ha sido eliminada satisfactoriamente.';
        }
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);

                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpnotificaciones/eliminarNotificacion',
                    params: {
                        idnotificacion: Ext.encode(arrayidnotif)
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        _this.BarraProgreso.hide();
                        if (responseData.mensaje == 1) {
                            _this.stNotificaciones.reload();
                            mostrarMensaje(1, mensajeresp);
                        }
                    }
                });
            }
        });
    };

    this.EliminarTodasNotificaciones = function () {
        var arrayidnotif = [];
        var mensaje = '¿Está seguro que quiere eliminar todas las notificaciones?';
        var mensajemascara = 'Eliminando notificaciones';
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);

                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpnotificaciones/eliminarTodasNotificaciones',
                    params: {
                        idnotificacion: Ext.encode(arrayidnotif)
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        _this.BarraProgreso.hide();
                        if (responseData.mensaje == 1) {
                            _this.stNotificaciones.reload();
                            mostrarMensaje(1, 'Todas las notificaciones han sido eliminadas satisfactoriamente.');
                        }
                    }
                });
            }
        });
    };
    /**
     * Nombre de la función EliminarElemento
     * Descripcion  Permite eliminar la notificacion seleccionada.
     * @author Ariadna Rendón Artola
     */
    this.CambiarEstiloAsunto = function (record, asunto) {
        var idnotificacion = record.id;
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpnotificaciones/notificacionLeida',
            params: {
                idnotificacion: idnotificacion
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                record.set('notificacionleida', 1);
                var aux = asunto.replace('<b>', '');
                asunto = aux.replace('</b>', '');
                return asunto;
            }
        });
        return asunto;
    };

    this.LeerNotificacion = function (id) {
        var idnotificacion = id;
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpnotificaciones/notificacionLeida',
            params: {
                idnotificacion: idnotificacion
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                global.socketEvents.emit('subscribe');
            }
        });

    };

    this.verHistorial = function (panelHistorial, btnVer) {
        Winhistorial = new Ext.Window({
            layout: 'fit',
            title: 'Historial',
            closable: true,
            graggable: false,
            maximized: false,
            constrain: true,
            modal: true,
            closeAction: 'destroy',
            width: 640,
            height: 450,
            items: panelHistorial,
            buttons: [
                {
                    text: 'Cerrar',
                    tooltip: 'Cerrar ventana',
                    iconCls: 'cerrar',
                    handler: function () {
                        Winhistorial.destroy();
                    }
                }
            ]
        });
        Winhistorial.on('beforeshow', function () {
            btnVer.focus(true, 700);
        });
        Winhistorial.doLayout();
        Winhistorial.show();
        btnVer.focus(false, 1024);
    }
};
