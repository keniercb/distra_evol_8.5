-Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil;
Ext.ns('Proyecto');
Proyecto.Viewport = Ext.extend(Ext.Viewport, {
    title                     : '',
    layout                    : 'fit',
    initComponent             : function () {
        var _this = this;
        _this.soloEstructura = false;
        _this.formFiltroP = new Ext.FormPanel({
            layout     : 'column',
            region     : 'center',
            cls        : 'x-toolbar',
            height     : 70,
            frame      : true,
            defaults   : {
                layout     : 'form',
                border     : false,
                labelAlign : 'top',
                labelWidth : 50,
                buttonAlign: 'right'
            },
            bodyBorder : false,
            border     : false,
            autoScroll : true,
            hideBorders: true,
            keys       : [
                {
                    key: 'b',
                    alt: true,
                    fn : function () {
                        _this.searchFiltroP()
                    }
                },
                {
                    key: 'l',
                    alt: true,
                    fn : function () {
                        _this.formFiltroP.getForm().reset();
                        _this.store.load({params: {start: 0, limit: 18}});
                    }
                }
            ],
            items      : [
                {
                    layout     : 'form',
                    columnWidth: .3,
                    items      : [
                        {
                            xtype          : 'textfield',
                            name           : 'tfFiltroDenoP',
                            id             : 'tfFiltroDenoP',
                            vtype          : 'vtdenominaciones',
                            maxLength      : 100,
                            emptyText      : "Criterio a buscar...",
                            enableKeyEvents: true,
                            listeners      : {
                                keyup: function () {
                                    if (Ext.getCmp('tfFiltroDenoP').getValue() != '') {
                                        Ext.getCmp('btnLimpiarP').enable();
                                        Ext.getCmp('btnBuscarP').enable();
                                    } else {
                                        Ext.getCmp('btnLimpiarP').disable();
                                        Ext.getCmp('btnBuscarP').disable();
                                    }
                                }
                            },
                            fieldLabel     : "Denominación",
                            anchor         : '98%',
                            allowBlank     : true
                        }
                    ]
                },
                {
                    columnWidth: '35px',
                    bodyStyle  : 'padding:19px 0 0 0;',
                    layout     : 'form',
                    items      : [
                        {
                            xtype   : 'button',
//														icon    : perfil.dirImg + 'buscar.png',
                            text    : "<u>B</u>uscar",
                            iconCls : 'buscar',
                            id      : "btnBuscarP",
                            disabled: true,
                            tooltip : "Buscar proyecto <b>(Alt+B)</b>",
                            handler : function () {
                                _this.searchFiltroP();
                            }
                        }
                    ]
                },
                {
                    columnWidth: '35px',
                    bodyStyle  : 'padding:19px 0 0 0;',
                    layout     : 'form',
                    items      : [
                        {
                            xtype   : 'button',
                            tooltip : "Limpiar filtros <b>(Alt+L)</b>",
                            text    : "<u>L</u>impiar",
                            id      : 'btnLimpiarP',
//														icon   : perfil.dirImg + 'limpiar.png',
                            disabled: true,
                            iconCls : 'limpiar',
                            handler : function () {


                                _this.formFiltroP.getForm().reset();
                                _this.store.load({params: {start: 0, limit: 18}});
                                Ext.getCmp('btnLimpiarP').disable();
                                Ext.getCmp('btnBuscarP').disable();
                            }
                        }
                    ]
                }
            ]
        });
        _this.store = new Ext.data.Store({
            url      : 'mostrarValores',
            reader   : new Ext.data.JsonReader({
                root         : 'datos',
                id           : 'idproyecto',
                totalProperty: 'cant'
            }, [
                {name: 'denominacion'},
                {name: 'idproyecto'},
                {name: 'descripcion'},
                {name: 'modificado'},
                {name: 'aprobado'},
                {name: 'idpadre'},
                {name: 'fusionado'},
                {name: 'fecha'},
                {name: 'fechafin'},
                {name: 'asignado'},
                {name: 'nuevoasignado'},
                {name: 'enviado'},
                {name: 'denanterior', mapping: 'denominacion'}
            ]),
            listeners: {
                beforeload: function (store, param) {
                    param = beforeLoadProyecto(param, "tfFiltroDenoP", _this.formFiltroP, 'proyecto')
                },
                load      : function () {
                    Secodena.ocultarMascara('cargaini');
                    Ext.getCmp('tfFiltroDenoP').focus(false, 10);
                }
            }
        });
        _this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            listeners   : {
                'selectionchange': function (sm) {
                    if (sm.getSelections().length == 0) {
                        _this.btnPonerEnVigor.disable();
                        _this.btnAsignarProyecto.disable();
                    }
                },
                'rowselect'      : function (sm) {
                    _this.activarForSelection();
                    _this.btnModificarP.security(sm);
                    _this.btnEliminarP.security(sm);
                    _this.btnReporteProyecto.security(sm);
                    _this.btnPonerEnVigor.security(sm);
                    _this.btnFusionarProyecto.security(sm);
                    _this.btnRealizarAjuste.security(sm);
                    _this.verificarProyectoGeneral(sm);
                    if (sm.getSelections().length > 1) {
                        if (!_this.verificarSeleccionDeFusion(sm, true)) {
                            _this.btnFusionarProyecto.disable();
                        }
                    }
                }
            }
        });
        _this.cm = new Ext.grid.ColumnModel({
            renderer: Go.Column.Ttip.ToolTipColumn
        });
        _this.createNodoLeyenda = function (accion, text, big) {
            var contenedor = big ? " contenedorLeyendaProyectoMayor" : " contenedorLeyendaProyecto";
            var div = "<div class='animacionContenedor" + accion + contenedor + "'><div class='iconLeyenda " + accion + "Leyend rotateLeyend'></div><div class='textLeyenda " + accion + "LeyendColor'>" + text + "</div>";
            return div;
        }
        _this.plugDescripcion = new Ext.grid.RowExpander({
            tpl        : new Ext.Template('<p style="padding-top: 10px;padding-left: 15px;"><b>Descripción:</b></p><p style="padding-top: 5px;padding-left: 20px;">{descripcion}</p><br>'),
            getRowClass: function (record) {
                if (record.get('nuevoasignado')) {
                    return 'NuevaAsignacion';
                } else {
                    if (record.get('asignado')) {
                        return 'Asignado';
                    } else {
                        if (record.get('enviado')) {
                            return 'Enviado';
                        } else {
                            return '';
                        }
                    }
                }
            }
        });
        _this.gridPanel = new Ext.grid.GridPanel({
            frame           : true,
            region          : 'center',
            autoExpandColumn: 'denominacion',
            store           : _this.store,
            sm              : _this.sm,
            plugins         : _this.plugDescripcion,
            columns         : [
                _this.plugDescripcion, {
                    dataIndex: 'denominacion',
                    renderer : Go.Column.Ttip.ToolTipColumn,
                    sortable : true,
                    header   : "Denominación de proyecto",
                    id       : 'denominacion',
                    width    : Go.Column.Config.Width('denominacion'),
                    hidden   : false
                },
                {
                    dataIndex: 'fecha',
                    renderer : Go.Column.Ttip.ToolTipColumn,
                    sortable : true,
                    header   : "Fecha creación",
                    width    : Go.Column.Config.Width('fecha'),
                    id       : 'fechacreacion',
                    hidden   : false
                },
                {
                    dataIndex: 'fechafin',
                    renderer : Go.Column.Ttip.ToolTipColumn,
                    sortable : true,
                    header   : "Fecha aprobación",
                    width    : Go.Column.Config.Width('fecha'),
                    id       : 'fechaaprobado',
                    hidden   : false /*true*/
                },
                {
                    dataIndex: 'asignado',
                    sortable : true,
                    renderer : Go.Column.Render.changeValorIcono,
                    header   : "Asignado",
                    width    : Go.Column.Config.Width('actual'),
                    id       : 'asignado',
                    hidden   : false,
                    align    : 'center'
                }, {
                    dataIndex: 'enviado',
                    sortable : true,
                    renderer : Go.Column.Render.changeValorIcono,
                    header   : "Enviado",
                    width    : Go.Column.Config.Width('actual'),
                    id       : 'enviado',
                    hidden   : false,
                    align    : 'center'
                }, {
                    dataIndex: 'modificado',
                    sortable : true,
                    renderer : Go.Column.Render.changeValorIcono,
                    header   : "Modificado",
                    width    : Go.Column.Config.Width('actual'),
                    id       : 'modificado',
                    hidden   : false,
                    align    : 'center'
                }, {
                    dataIndex: 'aprobado',
                    sortable : true,
                    renderer : Go.Column.Render.changeValorIcono,
                    header   : "Aprobado",
                    width    : Go.Column.Config.Width('actual'),
                    id       : 'aprobado',
                    hidden   : false,
                    align    : 'center'
                }
            ],
            keys            : [
                {
                    key: Ext.EventObject.DELETE,
                    fn : function () {
                        _this.btnEliminarP.handler.call();
                    }
                },
                {
                    key      : Ext.EventObject.INSERT,
                    alt      : true,
                    stopEvent: true,
                    fn       : function () {
                        if (_this.btnAsignarProyecto.enable && !_this.btnAsignarProyecto.hidden) {
                            _this.asignarProyecto();
                        }
                    }
                },
                {
                    key      : "m",
                    alt      : true,
                    stopEvent: true,
                    fn       : function () {
                        if (_this.sm.getSelections().length > 0) {
                            _this.adicionar('Modificar').show();
                        }
                    }
                },
                {
                    key: 'b',
                    alt: true,
                    fn : function () {
                        Ext.getCmp('tfFiltroDenoP').focus(true, true);


                    }
                }
            ],
            tbar            : [
                {
                    xtype: 'label',
                    html : '&nbsp;&nbsp;&nbsp;&nbsp;'
                },
                {
                    xtype: 'label',
                    html : _this.createNodoLeyenda('Asignado', 'Asignado')
                },
                {
                    xtype: 'label',
                    html : _this.createNodoLeyenda('Enviado', 'Enviado')
                },
                {
                    xtype: 'label',
                    html : _this.createNodoLeyenda('NuevaAsignacion', 'Nueva asignación', true)
                }
            ],
            bbar            : new Ext.PagingToolbar({
                pageSize   : 18,
                store      : _this.store,
                displayInfo: true
            })
        })
        _this.store.load({params: {start: 0, limit: 18}});
        _this.store.on('load', function () {
            _this.sm.clearSelections();
            _this.btnModificarP.disable();
            _this.btnAsignarProyecto.disable();
            _this.btnReporteProyecto.disable();
            _this.btnEliminarP.disable();
            _this.btnRealizarAjuste.disable();
            _this.btnVerEstructura.disable();
            _this.btnFusionarProyecto.disable();
        });
        /**
         * Botones de Gestion
         * @type {Ext.form.Button}
         */
        _this.btnAdicionarP = new Ext.form.Button({
            text   : "Ad<u>i</u>cionar",
//						icon     : perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar',
            hidden : true,
            tooltip: "Adicionar proyecto<b> (Alt+I)</b>",
            id     : "btnAddProyecto",
            handler: function () {

                if (this.enable && !this.hidden) {
                    _this.adicionar('Adicionar').show();
                }
            }
        });
        _this.btnModificarP = new Ext.form.Button({
            text    : "<u>M</u>odificar",
//						icon    : perfil.dirImg + 'modificar.png',
            iconCls : 'modificar',
            disabled: true,
            hidden  : true,
            tooltip : "Modificar proyecto<b> (Alt+M)</b>",
            id      : "btnModProyecto",
            security: function (sm) {
                if (!this.hidden) {
                    if (sm.getSelections().length > 1 || _this.isAsignado(sm)) {
                        this.disable();
                    } else {
                        this.enable();
                    }
                }
            },
            handler : function () {
                if (this.enable && !this.hidden) {
                    _this.adicionar('Modificar').show();
                }
            }
        });
        _this.btnEliminarP = new Ext.form.Button({
            text    : "Eliminar",
            disabled: true,
            hidden  : true,
//						icon    : perfil.dirImg + 'eliminar.png',
            iconCls : 'eliminar',
            tooltip : "Eliminar proyecto<b> (Del)</b>",
            id      : "btnDelProyecto",
            security: function (sm) {
                if (!this.hidden) {
                    if (sm.getSelections().length > 1 || _this.isAsignado(sm) || _this.isGeneral(sm) || _this.isHijo(sm)) {
                        this.disable();
                    } else {
                        this.enable();
                    }
                }
            },
            handler : function () {
                var eliminarProyecto = function (id, fn) {
                    if (_this.havePermiso(this) && id != 0) {
                        mostrarMensaje(2, "¿Está seguro que quiere eliminar el proyecto seleccionado?", function (btnEliminar) {
                            if (btnEliminar == 'ok') {
                                var tab = Ext.getCmp('ajuste' + id);
                                if (tab != null && tab != undefined) {
                                    _this.panelTab.remove(tab);
                                }
                                var ejecutarEliminar = function () {
                                    eventoProyecto('eliminar', btnEliminar, 'del proyecto', 'proyecto', id, _this.store, 'tfFiltroDenoP');
                                }
                                if (fn !== null && (typeof (fn) == 'function')) {
                                    fn(ejecutarEliminar);
                                } else {
                                    ejecutarEliminar();
                                }
                            }
                        })
                    }
                }
                var id = _this.sm.getSelected().get('idproyecto');
                var modificado = _this.sm.getSelected().get('modificado');
                if (_this.havePermiso(_this.btnPonerEnVigor)) {
                    modificado = 0;
                    if (modificado == 1) {
                        Ext.MessageBox.buttonText.ok = "Si";
                        Ext.MessageBox.buttonText.cancel = "No";
                        mostrarMensaje(2, "¿Desea poner en vigor el proyecto antes de ser eliminado?", function (btnAprobar) {
                            Ext.MessageBox.buttonText.ok = "Aceptar";
                            Ext.MessageBox.buttonText.cancel = "Cancelar";
                            var accion = 'aprobar';
                            if (btnAprobar == 'cancel') {
                                btnAprobar = 'ok';
                                accion = 'cancelar';
                            }
                            var ejecutar = function (fn) {
                                eventoProyecto(accion, btnAprobar, 'del proyecto', 'proyecto', id, _this.store, 'tfFiltroDenoP', function () {
                                    fn();
                                });
                            }
                            eliminarProyecto(id, ejecutar);
                        })
                    } else {
                        eliminarProyecto(id, null);
                    }
                } else {
                    eliminarProyecto(id, null);
                }
            }
        });
        _this.btnAsignarProyecto = new Ext.form.Button({
            text    : "Asignar permisos",
//						icon    : perfil.dirImg + 'asignaroles.png',
            iconCls : 'asignarroles',
            hidden  : true,
            tooltip : "Asignar proyecto a usuarios<b> (Alt+Insert)</b>",
            id      : "btnAsignarProyecto",
            security: function (sm) {
                if (!this.hidden) {
                    if (sm.getSelections().length > 1 || _this.isGeneral(sm)) {
                        this.disable();
                    } else {
                        this.enable();
                    }
                }
            },
            handler : function () {
                if (this.enable && !this.hidden) {
                    _this.asignarProyecto();
                }
            }
        });
        _this.btnRealizarAjuste = new Ext.form.Button({
            text    : "Realizar ajuste",
            disabled: true,
//						icon    : perfil.dirImg + 'ajustar.png',
            iconCls : 'ajustar',
            hidden  : true,
            tooltip : "Realizar modificaciones de estructura en el proyecto seleccionado",
            id      : "btnRealizarAjuste",
            security: function (sm) {
                if (!this.hidden) {
                    var records = sm.getSelections();
                    var cantidadVer = records.length;
                    var cantidadAjuste = records.length;
                    for (var i = 0; i < records.length; i++) {
                        var data = records[i].data;
                        if (data.idproyecto == 0 || data.idpadre != 0 || data.aprobado == 1 || data.fusionado == 1) {
                            cantidadVer--;
                        } else {
                            cantidadAjuste--;
                        }
                    }
                    if (!cantidadVer || _this.isFusionado(sm) || _this.isAprobado(sm) || _this.isHijo(sm)) {
                        this.setText('Ver estructura');
                    } else {
                        if (!cantidadAjuste) {
                            this.setText('Realizar ajuste');
                        } else {
                            _this.btnRealizarAjuste.disable();
                        }
                    }
                }
            },
            handler : function () {
                var records = _this.sm.getSelections();
                if (records.length > 0) {
                    for (var i = 0; i < records.length; i++) {
                        var idproyecto = records[i].data.idproyecto;
                        var denominacion = records[i].data.denominacion;
                        var idpadre = records[i].data.idpadre;
                        var fusion = records[i].data.fusionado;
                        var aprobado = records[i].data.aprobado;
                        var tab = Ext.getCmp('ajuste' + idproyecto);
                        if (tab == null || tab == undefined) {
                            var tab = new Gestion.Panel.Estructura({
                                closable         : true,
                                parent           : _this.store,
                                perfil           : perfil,
                                proyecto         : idproyecto,
                                id               : 'ajuste' + idproyecto,
                                title            : "Proyecto: " + denominacion,
                                reportes         : true,
                                checher          : true,
                                isGestionProyecto: !_this.isestructura,
                                ver              : _this.btnRealizarAjuste.text == 'Ver estructura',
                                fusion           : (idpadre != 0 || fusion || (aprobado != 0))
                            });
                            _this.panelTab.add(tab).show();
                        } else {
                            _this.panelTab.setActiveTab(tab);
                        }
                        _this.panelTab.expand();
                    }
                }
                _this.sm.clearSelections();
                _this.btnModificarP.disable();
                _this.btnAsignarProyecto.disable();
                _this.btnEliminarP.disable();
                _this.btnPonerEnVigor.disable();
                _this.btnRealizarAjuste.disable();
                _this.btnVerEstructura.disable();
                _this.btnReporteProyecto.disable();
            }
        });
        _this.btnVerEstructura = new Ext.form.Button({
            text    : "Ver estructura",
            disabled: true,
//						icon    : perfil.dirImg + 'ajustar.png',
            iconCls : 'ajustar',
            hidden  : true,
            tooltip : "Consultar las estructuras aprobadas",
            id      : "btnVerEstructura",
            handler : function () {
                var records = _this.sm.getSelections();
                if (records.length == 1) {
                    var idproyecto = records[0].data.idproyecto;
                    var denominacion = records[0].data.denominacion;
                    var tab = Ext.getCmp('consultar' + idproyecto);
                    if (tab == null || tab == undefined) {
                        var tab = new Gestion.Panel.Estructura({
                            closable         : true,
                            parent           : _this.store,
                            perfil           : perfil,
                            proyecto         : idproyecto,
                            isGestionProyecto: !_this.isestructura,
                            id               : 'consultar' + idproyecto,
                            title            : "Proyecto: " + denominacion,
                            ver              : true
                        });
                        _this.panelTab.add(tab).show();
                    } else {
                        _this.panelTab.setActiveTab(tab);
                    }
                    _this.panelTab.expand();
                }
                _this.sm.clearSelections();
                _this.btnModificarP.disable();
                _this.btnAsignarProyecto.disable();
                _this.btnEliminarP.disable();
                _this.btnPonerEnVigor.disable();
                _this.btnRealizarAjuste.disable();
                _this.btnVerEstructura.disable();
                _this.btnReporteProyecto.disable();
            }
        });
        _this.btnPonerEnVigor = new Ext.form.Button({
            text    : "Poner en vigor",
            disabled: true,
//						icon    : perfil.dirImg + 'aprobar.png',
            iconCls : 'aprobar',
            hidden  : true,
            tooltip : "Aprobar todas las modificaciones del proyecto",
            id      : "btnPonerVigor",
            security: function (sm) {
                if (!this.hidden) {
                    if (sm.getSelections().length > 1 || _this.isGeneral(sm) || _this.isHijo(sm) || (!(_this.isModificado(sm) && !_this.isHijo(sm)))) {
                        this.disable();
                    } else {
                        this.enable();
                    }
                }
            },
            handler : function () {
                mostrarMensaje(2, "¿Está seguro que quiere poner en vigor el proyecto seleccionado?", function (btn) {
                    var id = _this.sm.getSelected().get('idproyecto');
                    var tab = Ext.getCmp('ajuste' + id);
                    if (tab != null && tab != undefined) {
                        _this.panelTab.remove(tab);
                    }
                    eventoProyecto('aprobar', btn, 'del proyecto', 'proyecto', id, _this.store, 'tfFiltroDenoP')
                })
            }
        });
        _this.btnSubordinacion = new Ext.form.Button({
            text    : etiquetas.proyecto.lbBtnSubordinacion,
//						icon    : perfil.dirImg + 'subordinaciones.png',
            iconCls : 'subordinaciones',
            disabled: true,
            hidden  : true,
            tooltip : etiquetas.proyecto.lbTooltipSubordinacion,
            id      : "btnSubordinacion",
            security: function (sm) {
                if (!this.hidden) {
                    if (sm.getSelections().length == 1 && _this.isGeneral(sm)) {
                        this.enable();
                    } else {
                        this.disable();
                    }
                }
            },
            handler : function () {
                var records = _this.sm.getSelections();
                if (records.length == 1) {
                    var tab = Ext.getCmp('tabSubordinacion');
                    if (tab == null || tab == undefined) {
                        var tab = new Gestion.Panel.Estructura({
                            closable     : true,
                            tbar         : ['->', _this.btAyudaSub],
                            parent       : _this.store,
                            perfil       : perfil,
                            subordinacion: true,
                            proyecto     : 0,
                            id           : 'tabSubordinacion',
                            title        : etiquetas.subordinacion.lbTitle
                        });
                        _this.panelTab.add(tab).show();
                        _this.panelTab.doLayout();
                    } else {
                        _this.panelTab.setActiveTab(tab);
                    }
                    _this.panelTab.expand();
                    if (_this.panelTab.hidden) {
                        _this.panelTab.show();
                    }
                    _this.sm.clearSelections();
                    _this.btnModificarP.disable();
                    _this.btnAsignarProyecto.disable();
                    _this.btnEliminarP.disable();
                    _this.btnPonerEnVigor.disable();
                    _this.btnRealizarAjuste.disable();
                    _this.btnVerEstructura.disable();
                    _this.btnReporteProyecto.disable();
                }
            }
        });
        _this.btnFusionarProyecto = new Ext.form.Button({
            text    : "Fusionar proyectos",
            disabled: true,
            hidden  : true,
//						icon    : perfil.dirImg + 'asociar.png',
            iconCls : 'asociar',
            tooltip : "Fusiona los proyectos seleccionados",
            id      : "btnFusionarProyecto",
            security: function (sm) {
                if (!this.hidden) {
                    if (sm.getSelections().length > 1) {
                        this.enable();
                    } else {
                        this.disable();
                    }
                }
            },
            handler : function () {
                var records = _this.sm.getSelections();
                if (records.length > 0) {
                    var idProyectos = new Array();
                    for (var i = 0; i < records.length; i++) {
                        idProyectos.push(records[i].data.idproyecto);
                        var tab = Ext.getCmp('ajuste' + records[i].data.idproyecto);
                        if (tab != null && tab != undefined) {
                            _this.panelTab.remove(tab);
                        }
                    }
                    idProyectos.sort();
                    mostrarMensaje(2, "¿Está seguro que desea fusionar los proyectos seleccionados?", function (btnFusionar) {
                        eventoFusionarProyecto(btnFusionar, _this.store, idProyectos, 'tfFiltroDenoP');
                    })
                }
                _this.sm.clearSelections();
            }
        });

        /********Historial reporte de plantilla***************/
        _this.btnVerReporte = new Ext.form.Button({
            text: "Ver reporte",
            disabled: true,
            iconCls: 'ver',
            tooltip: "Muestra el reporte seleccionado",
            id: "btnVerReporte",
            handler: function () {
                var csm = pReportePersona.dameSelectionModel(pReportePersona);

                var dir = "idreporteplantilla=" + csm.getSelections()[0].json['idreporteplantilla'];
                var url = "mostrarReporte";
                var idIFrame = Ext.id();
                var win = new Win.Pdf({
                    url: url,
                    params: dir,
                    idIframe: idIFrame,
                    vigor: true,
                    idproyecto: 0,
                    store: _this.store,
                    panelTab: _this.panelTab
                });
                win.show();
                Secodena.mostrarMascara('reporte', '', 'Generando reporte...');
                document.getElementById(idIFrame).onload = function () {
                    Secodena.ocultarMascara('reporte');
                    var iframeDocument = this.contentDocument;
                    if (iframeDocument) {
                        var response = iframeDocument.documentElement.textContent;
                        response = Ext.decode(response);
                        if (response.codMsg) {
                            mostrarMensaje(response.codMsg, response.mensaje);
                            win.destroy();
                        }
                    }
                };
                /*Ext.Ajax.request({
                    url: 'mostrarReporte',
                    method: 'POST',
                    params: {
                        idreporteplantilla: csm.getSelections()[0].json['idreporteplantilla'],
                    },
                    callback: function (options, success, response) {
                        var respuesta = Ext.decode(response.responseText);

                        if (respuesta.success) {


                            if (respuesta.datos.length == 0) {
                                mostrarMensaje(1, 'No existen datos que mostrar.');
                            }


                        } else {

                        }

                    }
                });*/
            }
        });
        _this.btnConfigurarReporte = new Ext.form.Button({
            text: "Configurar reportes",
            //disabled: true,
            //hidden: true,
            iconCls: 'historial',
            id: "btnConfigurarReporte",
            handler: function () {

                Misitio.Funciones.PanelMaestroDetalle({
                    id: 'configMD',
                    configMaestro: {
                        identificadorconfiguracion: 'Gestionar reportes',
                        identificadorentidad: 'reporte',
                    }, configDetalles: {
                        identificadorconfiguracion: 'Gestionar reportes',
                        identificadorentidad: 'camposreporte',
                    },
                    columnaMaestro: "idreporte",
                    columnaDetalle: "idreporte"
                }, function (panel) {

                    if (Ext.getCmp('ventanaConfigurarReporte') == null) {
                        var ventanaReportes = new Ext.Window({
                            title: 'Configuración de reportes',
                            closeAction: 'hide',
                            modal: true,
                            id: 'ventanaConfigurarReporte',
                            enableTabScroll: true,
                            height: screen.height * 0.50,
                            width: screen.width * 0.50,
                            closable: true,
                            resizable: false,
                            maximizable: true,
                            constrain: true,
                            minimizable: true,
                            layout: 'fit',
                            items: _this.PanelAdministrarReportesPdf({
                                tipoentidad: 3,
                                id: "ventanaAdministrarReportesPdf",
                                panel: panel
                            })
                        });
                        ventanaReportes.show();
                    } else {
                        Ext.getCmp('ventanaConfigurarReporte').show();
                    }
                    Ext.getCmp('ventanaConfigurarReporte').maximize();
                });


            }
        });

        var configHistorial = new Array(
            {
                nombre: 'id',
                index: 'idconftexto',
                tipo: 'numero',
                nulo: true
            }
            , {
                nombre: 'Denominación reporte',
                index: 'nombrereporte',
                tipo: 'texto',
                nulo: false,
                ancho: 250,
                unico: true,
                mostraFiltro: true,
                tamannoForm: 0.7

            }
            , {
                nombre: 'Fecha vigor',
                index: 'fechavigor',
                tipo: 'texto',
                nulo: false,
                ancho: 100,
                unico: true,
                mostraFiltro: true,
                tamannoForm: 0.7

            }
            , {
                nombre: 'Fecha derogación',
                index: 'fechaderogacion',
                tipo: 'texto',
                nulo: false,
                ancho: 100,
                unico: true,
                mostraFiltro: true,
                tamannoForm: 0.7

            }
            , {
                nombre: 'Nombre proyecto',
                index: 'nombreproyecto',
                tipo: 'texto',
                nulo: false,
                ancho: 100,
                unico: true,
                mostraFiltro: true,
                tamannoForm: 0.7

            }
        );

        var pReportePersona = new Misitio.Panel.PanelReportes({
            id: 'idhistorial'
            , region: 'center'
            , collapsible: true
            , animCollapse: true
            , ocultarBtnActualizar: false
            , autoScroll: true
            , autoCargar: false
            //, width: 500
            , metodo: 'listarHistorial'
            //, consulta: {idestructura: idestructura}
            , configuracion: configHistorial
            , botones: new Array(_this.btnVerReporte)

        });

        var panelEstructura = new Ext.estructura.panel.PanelEstructura({
            //border: false,
            //checker: false,
            //checked: false,
            //inicial:true,
            cargos: false,
            region: 'west',
            limit: 3,
            //width: 350,
            menu: false
        });

        _this.btnHistorial = new Ext.form.Button({
            text: "Historial",
            //disabled: true,
            //hidden: true,
            iconCls: 'historial',
            tooltip: "Muestra el historial de reportes de plantillas.",
            id: "btnHistorial",
            handler: function () {
                var panelGeneral = new Ext.Panel({
                    id: 'panelGeneral',
                    layout: 'border',
                    collapsible: true,
                    split: true,
                    items: [panelEstructura, pReportePersona]
                });


                if (Ext.getCmp('ventanaReportePlantilla') == null) {
                    var ventanaReportes = new Ext.Window({
                        title: 'Historial de reportes de plantillas',
                        closeAction: 'hide',
                        modal: true,
                        id: 'ventanaReportePlantilla',
                        enableTabScroll: true,
                        height: screen.height * 0.50,
                        width: screen.width * 0.50,
                        closable: true,
                        resizable: false,
                        maximizable: true,
                        constrain: true,
                        minimizable: true,
                        layout: 'fit',
                        items: [panelGeneral]
                    });
                    ventanaReportes.show();
                } else {
                    Ext.getCmp('ventanaReportePlantilla').show();
                }
                Ext.getCmp('ventanaReportePlantilla').maximize();
                _this.btnVerReporte.disable();

                panelEstructura.limpiar();

            }
        });

        pReportePersona.dameSelectionModel(pReportePersona).on('rowselect', function (SelectionModel, rowIndex, r) {
            _this.btnVerReporte.enable();
        });
        pReportePersona.dameSelectionModel(pReportePersona).on('rowdeselect', function (SelectionModel, rowIndex, r) {
            if (SelectionModel.getSelections().length == 0)
                _this.btnVerReporte.disable();

        });
        panelEstructura.dameTree().on('click', function (nodo) {
            var idestructura = nodo.id;

            pReportePersona.listarFilas(pReportePersona, {idestructura: idestructura});
        });
        var configHistorialCambios = new Array(
            {
                nombre: 'id',
                index: 'idreportecambios',
                tipo: 'numero',
                nulo: true
            }
            , {
                nombre: 'Denominación reporte',
                index: 'nombrereporte',
                tipo: 'texto',
                nulo: false,
                ancho: 250,
                unico: true,
                mostraFiltro: true,
                tamannoForm: 0.7

            }, {
                nombre: 'Nombre proyecto',
                index: 'nombreproyecto',
                tipo: 'texto',
                nulo: false,
                ancho: 100,
                unico: true,
                mostraFiltro: true,
                tamannoForm: 0.7

            }
            , {
                nombre: 'Fecha',
                index: 'fecha',
                tipo: 'texto',
                nulo: false,
                ancho: 100,
                unico: true,
                mostraFiltro: true,
                tamannoForm: 0.7

            }
        );
        /********Historial reporte de plantilla***************/

        /*******Historial de reporte de cambios***************/
        _this.btnVerReporteCambios = new Ext.form.Button({
            text: "Ver reporte",
            disabled: true,
            iconCls: 'ver',
            tooltip: "Muestra el reporte seleccionado",
            id: "btnVerReporteCambios",
            handler: function () {
                var csm = pReporteCambios.dameSelectionModel(pReporteCambios);

                var dir = "idreporteplantilla=" + csm.getSelections()[0].json['idreportecambios'];
                var url = "mostrarReporteCambios";
                var idIFrame = Ext.id();
                var win = new Win.Pdf({
                    url: url,
                    params: dir,
                    idIframe: idIFrame,
                    vigor: true,
                    idproyecto: 0,
                    store: _this.store,
                    panelTab: _this.panelTab
                });
                win.show();
                Secodena.mostrarMascara('reporte', '', 'Generando reporte...');
                document.getElementById(idIFrame).onload = function () {
                    Secodena.ocultarMascara('reporte');
                    var iframeDocument = this.contentDocument;
                    if (iframeDocument) {
                        var response = iframeDocument.documentElement.textContent;
                        response = Ext.decode(response);
                        if (response.codMsg) {
                            mostrarMensaje(response.codMsg, response.mensaje);
                            win.destroy();
                        }
                    }
                };
                /*Ext.Ajax.request({
                    url: 'mostrarReporte',
                    method: 'POST',
                    params: {
                        idreporteplantilla: csm.getSelections()[0].json['idreporteplantilla'],
                    },
                    callback: function (options, success, response) {
                        var respuesta = Ext.decode(response.responseText);

                        if (respuesta.success) {


                            if (respuesta.datos.length == 0) {
                                mostrarMensaje(1, 'No existen datos que mostrar.');
                            }


                        } else {

                        }

                    }
                });*/
            }
        });

        var pReporteCambios = new Misitio.Panel.PanelReportes({
            id: 'idhistorialcambios'
            , region: 'center'
            , collapsible: true
            , animCollapse: true
            , ocultarBtnActualizar: true
            , autoScroll: true
            , autoCargar: false
            //, width: 500
            , metodo: 'listarHistorialCambios'
            , configuracion: configHistorialCambios
            , botones: new Array(_this.btnVerReporteCambios)

        });

        /*_this.btnHistorialCambios = new Ext.form.Button({
            text: "Historial",
            iconCls: 'historial',
            tooltip: "Muestra el historial de reportes de cambios por proyectos.",
            id: "btnHistorialCambios",
            handler: function () {


                var panelGeneralCambios = new Ext.Panel({
                    id: 'panelGeneralCambios',
                    layout: 'fit',
                    collapsible: true,
                    split: true,
                    items: [ pReporteCambios]
                });


                if (Ext.getCmp('ventanaReportePlantillaCambios') == null) {
                    var ventanaReportes = new Ext.Window({
                        title: 'Historial de reportes de plantillas',
                        closeAction: 'hide',
                        modal: true,
                        id: 'ventanaReportePlantillaCambios',
                        enableTabScroll: true,
                        height: screen.height * 0.50,
                        width: screen.width * 0.50,
                        closable: true,
                        resizable: false,
                        maximizable: true,
                        constrain: true,
                        minimizable: true,
                        layout: 'fit',
                        items: [panelGeneralCambios]
                    });
                    ventanaReportes.show();
                } else {
                    Ext.getCmp('ventanaReportePlantillaCambios').show();
                }
                Ext.getCmp('ventanaReportePlantillaCambios').maximize();
                _this.btnVerReporteCambios.disable();

            }
        });*/

        pReporteCambios.dameSelectionModel(pReporteCambios).on('rowselect', function (SelectionModel, rowIndex, r) {
            _this.btnVerReporteCambios.enable();
        });
        pReporteCambios.dameSelectionModel(pReporteCambios).on('rowdeselect', function (SelectionModel, rowIndex, r) {
            if (SelectionModel.getSelections().length == 0)
                _this.btnVerReporteCambios.disable();

        });

        /*******Historial de reporte de cambios****************/


        _this.btnReporteProyecto = new Ext.form.Button({
            xtype   : 'button',
            text    : etiquetas.reporte.lbDocumentos,
            id      : 'btnDocProyecto',
            iconCls : 'historial',
            hidden  : true,
            disabled: true,
//						icon    : perfil.dirImg + 'historial.png',
            security: function (sm) {
                if (!this.hidden) {
                    if (sm.getSelections().length > 1 || _this.isGeneral(sm) || _this.isHijo(sm) || !_this.isModificado(sm)) {
                        this.disable();
                    } else {
                        this.enable();
                    }
                }
            },
            menu    : {
                items: [
                    {
                        xtype  : 'button',
                        text   : 'Reporte informativo de cambios organizacionales',
                        iconCls: 'informe',
//												icon   : perfil.dirImg + 'informe.png',
                        handler: function () {
                            var selections = _this.sm.getSelected();
                            var dir = "idproyecto=" + selections.data.idproyecto;
                            var url = "reporteInformeCambios";
                            var idIFrame = Ext.id();
                            var win = new Go.Pdf.Visor({
                                url     : url,
                                params  : dir,
                                idIframe: idIFrame
                            });
                            win.show();
                            Secodena.mostrarMascara('reporte', '', 'Generando reporte...');
                            document.getElementById(idIFrame).onload = function () {
                                Secodena.ocultarMascara('reporte');
                                var iframeDocument = this.contentDocument;
                                if (iframeDocument) {
                                    var response = iframeDocument.documentElement.textContent;
                                    response = Ext.decode(response);
                                    if (response.codMsg) {
                                        mostrarMensaje(response.codMsg, response.mensaje);
                                        win.destroy();
                                    }
                                }
                            };
                        }

                    }, {
                        xtype: 'button',
                        text: "Historial de cambios por proyectos",
                        iconCls: 'historial',
                        tooltip: "Muestra el historial de reportes de cambios por proyectos.",
                        id: "btnHistorialCambios",
                        handler: function () {


                            var panelGeneralCambios = new Ext.Panel({
                                id: 'panelGeneralCambios',
                                layout: 'fit',
                                collapsible: true,
                                split: true,
                                items: [pReporteCambios]
                            });


                            if (Ext.getCmp('ventanaReportePlantillaCambios') == null) {
                                var ventanaReportes = new Ext.Window({
                                    title: 'Historial de reportes de cambios por proyectos.',
                                    closeAction: 'hide',
                                    modal: true,
                                    id: 'ventanaReportePlantillaCambios',
                                    enableTabScroll: true,
                                    height: screen.height * 0.50,
                                    width: screen.width * 0.50,
                                    closable: true,
                                    resizable: false,
                                    maximizable: true,
                                    constrain: true,
                                    minimizable: true,
                                    layout: 'fit',
                                    items: [panelGeneralCambios]
                                });
                                ventanaReportes.show();
                            } else {
                                Ext.getCmp('ventanaReportePlantillaCambios').show();
                            }
                            Ext.getCmp('ventanaReportePlantillaCambios').maximize();
                            var idproyecto = _this.sm.getSelected().get('idproyecto');
                            pReporteCambios.listarFilas(pReporteCambios, {idproyecto: idproyecto});
                            _this.btnVerReporteCambios.disable();

                        }
                    }
                ]
            }
        });
        /**
         *
         * @type {Ext.TabPanel}
         */
        _this.panelTab = new Ext.TabPanel({
            title          : 'Realizar ajuste',
            enableTabScroll: true,
            collapsible    : true,
            collapsed      : true,
            width          : screen.width / 2,
            maxSize        : screen.width,
            region         : 'east',
            disabled       : false,
            items          : [
                {
                    xtyle: 'panel',
                    frame: true,
                    id   : 'panelInicial',
                    title: 'Inicio',
                    html : "<div class='topBanner'><div class='banner'></div>aa</div><div class='estructuraDetail'>aaaa<div class='contentDetail'>aaaa</div></div>"
                }
            ],
            tools          : [
                {
                    id     : 'maximize',
                    hidden : _this.soloEstructura,
                    handler: function () {
                        _this.aislarRestablacer();
                    }
                },
                {
                    id     : 'restore',
                    hidden : !_this.soloEstructura,
                    handler: function () {
                        _this.aislarRestablacer();
                    }
                }
            ],
            listeners      : {
                remove: function (tabPanel) {
                    if (tabPanel.items.length == 1) {
                        tabPanel.collapse();
                    }
                }
            }
        });
        _this.panelTab.setActiveTab('panelInicial');
        _this.btAyudaProyecto = new Ext.form.Button({
//						icon   : perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',
            id     : 'btnAyudaProyecto',
            text   : etiquetas.proyecto.lbBtnAyuda,
            hidden : false

        })
        _this.btAyudaSub = new Ext.form.Button({
//						icon   : perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',
            id     : 'btnAyudaSubordinacion',
            tooltip: etiquetas.proyecto.lbTooltipAyuda,
            text   : etiquetas.proyecto.lbBtnAyuda,
            hidden : false
        })
        UCID.portal.cargarAcciones(window.frameElement.id);
        _this.tbarProyecto = [
            _this.btnAdicionarP, _this.btnModificarP, _this.btnEliminarP, _this.btnAsignarProyecto, _this.btnRealizarAjuste, _this.btnVerEstructura, _this.btnPonerEnVigor, _this.btnSubordinacion, _this.btnFusionarProyecto, _this.btnHistorial,_this.btnReporteProyecto, '-', _this.btAyudaProyecto
        ];
        _this.panelFiltro = new Ext.Panel({
            region: 'north',
            layout: 'border',
            border: false,
            height: 70,
            items : [_this.formFiltroP]
        });
        _this.contenedor = new Ext.Panel({
            plugins            : [new Ext.ux.PanelToolbarSrollerPlugin()],
            collapsible        : false,
            region             : 'center',
            layout             : 'border',
            keys               : new Ext.KeyMap(document, []),
            topScrollingToolbar: new Ext.Toolbar({
                items: _this.tbarProyecto
            }),
            items              : [_this.panelFiltro, _this.gridPanel]
        });
        Ext.apply(this, {
            layout  : 'border',
            id      : 'viewport_proyecto',
            keys    : new Ext.KeyMap(document, [
                {
                    key: Ext.EventObject.ENTER,
                    fn : function () {

                        _this.searchFiltroP();


                    }
                }, {
                    key: 'i',
                    alt: true,
                    fn : function () {
                        if (_this.btnAdicionarP.enable && !_this.btnAdicionarP.hidden) {
                            _this.adicionar('Adicionar').show();
                        }
                    }
                },
                {
                    key: Ext.EventObject.SHIFT,
                    alt: true,
                    fn : function () {
                        if (_this.panelTab.items.length > 1) {
                            _this.aislarRestablacer();
                            _this.panelTab.expand();
                        }
                    }
                },
                {
                    key: Ext.EventObject.NUM_MINUS,
                    alt: true,
                    fn : function () {
                        if (!_this.soloEstructura) {
                            _this.panelTab.collapse();
                        }
                    }
                },
                {
                    key: Ext.EventObject.NUM_PLUS,
                    alt: true,
                    fn : function () {
                        if (_this.panelTab.items.length > 1) {
                            _this.panelTab.expand();
                        }
                    }
                }
            ]),
            defaults: {
                split: true
            },
            items   : [_this.panelTab, _this.contenedor]
        });
        Proyecto.Viewport.superclass.initComponent.apply(this)
    },
    isHijo                    : function (sm) {
        return parseInt(sm.getSelected().get('idpadre')) != 0;
    },
    isAsignado                : function (sm) {
        return sm.getSelected().get('asignado') != 0;
    },
    isAprobado                : function (sm) {
        return parseInt(sm.getSelected().get('aprobado')) == 1;
    },
    isModificado              : function (sm) {
        return parseInt(sm.getSelected().get('modificado')) == 1;
    },
    isFusionado               : function (sm) {
        return sm.getSelected().get('fusionado');
    },
    isGeneral                 : function (sm) {
        return sm.getSelected().get('idproyecto') == 0;
    },
    verificarProyectoGeneral  : function (sm) {
        var _this = this;
        if (sm.getSelections().length == 1 && _this.isGeneral(sm)) {
            _this.btnAsignarProyecto.disable();
            _this.btnRealizarAjuste.setText('Ver estructura');
        } else {
            _this.btnSubordinacion.disable();
        }
    },
    activarForSelection       : function () {
        var _this = this;
        _this.btnModificarP.enable();
        _this.btnEliminarP.enable();
        _this.btnRealizarAjuste.enable();
        _this.btnReporteProyecto.enable();
        _this.btnVerEstructura.enable();
        _this.btnSubordinacion.enable();
        _this.btnAsignarProyecto.enable();
        _this.btnPonerEnVigor.enable();
        _this.btnFusionarProyecto.enable();
    },
    havePermiso               : function (component) {
        return !component.disabled && !component.hidden;
    },
    aislarRestablacer         : function () {
        var _this = this;
        if (!_this.soloEstructura) {
            _this.panelTab.setWidth(screen.width);
            _this.contenedor.hide();
            _this.soloEstructura = true;
            _this.layoutViewport();
            _this.panelTab.doLayout();
            _this.panelTab.tools.maximize.hide();
            _this.panelTab.tools.toggle.hide();
            _this.panelTab.tools.restore.show();
        } else {
            _this.panelTab.setWidth(screen.width / 2);
            _this.contenedor.show();
            _this.soloEstructura = false;
            _this.layoutViewport();
            _this.panelTab.doLayout();
            _this.panelTab.tools.maximize.show();
            _this.panelTab.tools.toggle.show();
            _this.panelTab.tools.restore.hide();
        }
    },
    adicionar                 : function (title) {
        var _this = this;
        var wAdicionarP = new Proyecto.Comun({
            title     : 'proyecto',
            store     : _this.store,
            idProyecto: (title == 'Modificar') ? _this.sm.getSelected().get('idproyecto') : false,
            modificar : (title == 'Modificar'),
            record    : (title == 'Modificar') ? _this.sm.getSelected() : null,
            texto     : 'del proyecto'
        })
        return wAdicionarP;
    },
    asignarProyecto           : function () {
        var _this = this;
        var wAsignarProyecto = new Proyecto.win.AsignarUsuario({
            idproyecto   : _this.sm.getSelected().get('idproyecto'),
            storeProyecto: _this.store
        });
        wAsignarProyecto.show();
    },
    searchFiltroP             : function () {
        var _this = this;
        var denominacion = Ext.getCmp('tfFiltroDenoP').getValue();
        if (denominacion != '') {
            var form = _this.formFiltroP.getForm();
            if (form.isValid()) {
                var params = new Array();
                params.push(form.getValues());
                _this.store.reload({
                    params  : {
                        start     : 0,
                        limit     : 18,
                        clase     : 'proyecto',
                        parametros: Ext.encode(params)
                    },
                    callback: function (a) {
                        if (a.length == 0) {
                            Secodena.ocultarMascara('cargaini');
                            mostrarMensaje(1, "No existen datos que se correspondan con los criterios de" +
                                " b&uacute;squeda especificados.");
                        }
                    }
                })
            }
        } else {
            mostrarMensaje(1, etiquetas.proyecto.lbSinCritero);
            Ext.getCmp('tfFiltroDenoP').focus(false, 10);
        }
    },
    verificarSeleccionDeFusion: function (sm, fusion) {
        var records = sm.getSelections();
        if (records.length > 1) {
            for (var i = 0; i < records.length; i++) {
                if (fusion) {
                    if (records[i].data.fusionado) {
                        return false;
                    } else {
                        if (records[i].data.idpadre != 0 || records[i].data.modificado == 0 || records[i].data.aprobado == 1) {
                            return false;
                        }
                    }
                } else {
                    if (records[i].data.idpadre != 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    },
    layoutViewport            : function () {
        this.doLayout();
    }
});
var viewport = new Proyecto.Viewport();
