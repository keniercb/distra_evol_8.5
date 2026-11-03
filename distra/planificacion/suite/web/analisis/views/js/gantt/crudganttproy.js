Utilidades.Cmp.Crudganttproy = function (opcionesConfig) {
    var _this = this;
    var progreso = 0;
    var accionGestion = '';
    var tipoGestion;
    this.tasks = [];
    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();
    this.primerafecha;
    this.ultimafecha;
    this.urlCargarActividades = opcionesConfig.urlCargarActividades;
    this.objCrudActividad = new Utilidades.Cmp.Cmpcrudactividades();
    //objeto CRUD-objetivo inicializado
    this.objCrudObjetivo = new Utilidades.Cmp.Cmpcrudobjetivos();
    //objeto CRUD-PLAN inicializado
    this.objCrudPlan = new Utilidades.Cmp.Cmpcrudplan();
    this.objcmprelaciones = new Utilidades.Cmp.Cmprelaciones();
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    this.btndiahoy = new Ext.Button({
        iconCls: 'actual',
        id: 'btndiahoy' + opcionesConfig.subsistemaInicial,
        tooltip: 'Posicionar en día actual',
        disabled: false,
        handler: function () {
            _this.DiaDeHoy();
        }
    });

    this.menuAdicionar = new Ext.Toolbar.MenuButton({
        tooltip: 'Adicionar elementos',
        iconCls: 'adicionar',
        id: 'menuAdicionar' + opcionesConfig.subsistemaInicial,
        menu: {
            items: [
                {
                    text: 'Adicionar proyecto',
                    handler: function () {
                        _this.adicionarElemento(8);
                    },
                    disabled: false,
                    iconCls: 'adicionar',
                    tooltip: 'Adicionar proyecto',
                    key: {
                        alt: true,
                        key: 'IP'
                    },
                    scope: this
                }, {
                    text: 'Adicionar hito',
                    handler: function () {
                        _this.adicionarElemento(9);
                    },
                    disabled: false,
                    iconCls: 'adicionar',
                    tooltip: 'Adicionar hito',
                    key: {
                        alt: true,
                        key: 'IO'
                    },
                    scope: this
                }, {
                    text: 'Adicionar tarea',
                    handler: function () {
                        _this.adicionarElemento(10);
                    },
                    disabled: false,
                    iconCls: 'adicionar',
                    tooltip: 'Adicionar tarea',
                    key: {
                        alt: true,
                        key: 'IA'
                    },
                    scope: this
                }
            ]
        }
    });

    this.btnVerDetalles = new Ext.Button({
        iconCls: 'ver',
        id: 'btnVerDetalles' + opcionesConfig.subsistemaInicial,
        tooltip: 'Ver detalles del elemento',
        disabled: true,
        handler: function () {
            var idSelect = gantt.getSelectedId();
            var act = gantt.getTask(idSelect);
            _this.verDetalles(act);
        },
        key: {
            alt: true,
            key: 'D'
        },
        scope: this
    });

    this.btnModificar = new Ext.Button({
        handler: function () {
            var idSelect = gantt.getSelectedId();
            _this.modificarElemento(idSelect);
        },
        disabled: true,
        iconCls: 'modificar',
        tooltip: 'Modificar elemento',
        key: {
            alt: true,
            key: 'M'
        },
        scope: this
    });

    this.btnEliminar = new Ext.Button({
        handler: function () {
            var idSelect = gantt.getSelectedId();
            var act = gantt.getTask(idSelect);
            if (act.idtipoelemento == 3) {
                _this.EliminarActividades(act);
            } else if (act.idtipoelemento == 1) {
                _this.eliminarObjetivo(act);
            } else if (act.idtipoelemento == 0) {
                _this.eliminarPlan(act);
            }
        },
        disabled: true,
        iconCls: 'eliminar',
        tooltip: 'Eliminar elemento',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });

    this.fechaFin = new Ext.form.DateField({
        fieldLabel: 'Fecha de fin',
        disabled: false,
        format: 'd/m/Y',
        name: 'fechafin',
        id: 'fechafin' + opcionesConfig.subsistemaInicial,
        value: new Date().format('d/m/Y'),
        anchor: '90%',
        startDate: 'fechainicio',
        readOnly: true,
        minText: 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
        invalidText: 'Formato: dd/mm/aaaa.',
        vtype: 'rangoFechas',
        menuListeners: {
            select: function (df, date) {
                _this.fechaFin.setValue(date);
                if (_this.fechaFin.isValid() && _this.fechaInicio.isValid()) {
                    gantt.clearAll();
                    _this.Gantt();
                }
            }
        }
    });

    this.fechaInicio = new Ext.form.DateField({
        format: 'd/m/Y',
        name: 'fechainicio',
        id: 'fechainicio' + opcionesConfig.subsistemaInicial,
        value: new Date().format('d/m/Y'),
        anchor: '90%',
        endDateField: 'fechafin',
        allowBlank: true,
        readOnly: true,
        maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
        invalidText: 'Formato: dd/mm/aaaa.',
        vtype: 'rangoFechas',
        menuListeners: {
            select: function (df, date) {
                _this.fechaInicio.setValue(date);
                if (_this.fechaInicio.isValid() && _this.fechaFin.isValid()) {
                    gantt.clearAll();
                    _this.Gantt();
                }
            }
        }
    });

    this.btnActualizar = new Ext.Button({
        iconCls: 'actualizar',
        id: "btnActualizar" + opcionesConfig.subsistemaInicial,
        tooltip: 'Actualizar',
        disabled: false,
        handler: function () {
            _this.actualizar();
        },
        key: {
            ctrl: true,
            alt: true,
            key: 'Z'
        },
        scope: this
    });
    this.btnLimpiar = new Ext.Button({
        iconCls: 'limpiar',
        id: 'btnLimpiar ' + opcionesConfig.subsistemaInicial,
        tooltip: 'Limpiar filtro(s)',
        disabled: false,
        handler: function () {
            _this.limpiar();
        },
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });
    this.btnBuscar = new Ext.Button({
        iconCls: 'buscar',
        id: 'btnBuscar' + opcionesConfig.subsistemaInicial,
        tooltip: 'Buascar elementos',
        disabled: false,
        handler: function () {
            if (_this.tfbuscar.isValid()) {
                gantt.clearAll();
                _this.Gantt();
            }
        },
        key: {
            alt: true,
            key: 'B'
        },
        scope: this
    });
    //Textfiel para buscar actividades
    this.tfbuscar = new Ext.form.TextField({
        enableKeyEvents: true,
        emptyText: 'Buscar',
        regex: _this.ObjValidaciones.expresionRegular('denominacion'),
        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
        regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
        vtype: 'validarEspaciosEnBlanco',
        maxLength: 255,
        width: 200,
        listeners: {
            keydown: function (tf, e) {
                if (e.getKey() == 13) {
                    if (_this.tfbuscar.isValid()) {
                        gantt.clearAll();
                        _this.Gantt();
                    }
                }
            }
        }
    });
    this.btnAyudagant = new Ext.Button({
        id: 'btnAyudaGant' + opcionesConfig.subsistemaInicial,
        text: 'Ayuda',
        disabled: false,
        iconCls: 'ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad',
        key: {
            alt: true,
            key: 'H'
        },
        scope: this

    });

    this.menuVistaDiagrama = new Ext.Toolbar.MenuButton({
        tooltip: 'Seleccionar vista de diagrama',
        iconCls: 'estructura',
        menu: {
            items: [
                {
                    text: 'Años',
                    handler: function () {
                        _this.Annos();
                        _this.renderizar();
                    },
                    disabled: false,
                    iconCls: 'estructura',
                    tooltip: 'Años',
                    id: 'btnAnnos' + opcionesConfig.subsistemaInicial,
                }, {
                    text: 'Meses',
                    handler: function () {
                        _this.Meses();
                        _this.renderizar();
                    },
                    disabled: false,
                    iconCls: 'estructura',
                    tooltip: 'Meses',
                    id: 'btnMes' + opcionesConfig.subsistemaInicial,
                }, {
                    text: 'Semanas',
                    handler: function () {
                        _this.Semanas();
                        _this.renderizar();
                    },
                    disabled: false,
                    iconCls: 'estructura',
                    tooltip: 'Semanas',
                    id: 'btnSemana' + opcionesConfig.subsistemaInicial,
                }, {
                    text: 'Días',
                    handler: function () {
                        _this.Dias();
                        _this.renderizar();
                    },
                    disabled: false,
                    iconCls: 'estructura',
                    tooltip: 'Días',
                    id: 'btnDia' + opcionesConfig.subsistemaInicial,
                }
            ]
        }
    });

    this.menuTipoElemen = new Ext.Toolbar.MenuButton({
        id: 'menutipo' + opcionesConfig.subsistemaInicial,
        tooltip: 'Seleccionar tipos de elementos',
        iconCls: 'tipodocidentificacion',
        menu: [
            {
                text: '<span class="icondistra-planilla sipac-azul">Listar proyectos</span>',
                id: 'checkProyecto' + opcionesConfig.subsistemaInicial,
                checked: false,
                tooltip: 'Listar proyectos',
                checkHandler: onItemCheck
            }, {
                text: '<span class="icondistra-asentar sipac-azul">Listar hitos</span>',
                id: 'checkHito' + opcionesConfig.subsistemaInicial,
                checked: false,
                tooltip: 'Listar hitos',
                checkHandler: onItemCheck
            }, {
                text: '<span class="icondistra-tarea sipac-azul">Listar tareas</span>',
                id: 'checkTarea' + opcionesConfig.subsistemaInicial,
                tooltip: 'Listar tareas',
                checked: false,
                checkHandler: onItemCheck
            }
        ]
    });
    function onItemCheck(item, checked) {
        gantt.clearAll();
        _this.Gantt();
    }

    //store para el combo filtrar por planes
    this.stCmbPlanes = new Ext.data.Store({
        url: opcionesConfig.urlCargarPlanes,
        reader: new Ext.data.JsonReader({
            id: 'idplan',
            root: "data"
        }, [{
            name: 'idplan'
        }, {
            name: 'denominacion'
        }])
    });
    //combo donde muestro los planes
    this.cbPlan = new Ext.form.ComboBox({
        emptyText: 'Cargar planes',
        store: _this.stCmbPlanes,
        hiddenName: 'idplan',
        valueField: 'idplan',
        displayField: 'denominacion',
        triggerAction: 'all',
        editable: true,
        loadingText: 'Cargando datos...',
        forceSelection: true,
        typeAhead: true,
        selectOnFocus: true,
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        width: 150,
        anchor: '70%',
        listeners: {
            expand: function (combo) {
                _this.stCmbPlanes.reload();
            },
            select: function (cb, record, index) {
                gantt.clearAll();
                _this.Gantt();
            }
        }
    });

    this.pGanttA = new Ext.Panel({
        id: 'pGanttA' + opcionesConfig.subsistemaInicial,
        buttonAlign: 'center',
        margins: '3 3 3 3',
        frame: false,
        region: 'center',
        html: '<div id="gantt_here" style="width:100%; height:100%;"></div>'
    });

    this.pGantt = new Ext.Panel({
        id: 'pGantt' + opcionesConfig.subsistemaInicial,
        buttonAlign: 'center',
        margins: '3 3 3 3',
        frame: false,
        region: 'center',
        items: _this.pGanttA,
        tbar: [_this.menuAdicionar, ' ', _this.btnModificar, ' ',
            _this.btnEliminar, ' ', _this.btnVerDetalles, ' ',
            _this.btndiahoy, ' ', _this.menuVistaDiagrama,
            _this.menuTipoElemen, '-',
            'Fecha de inicio : ', _this.fechaInicio, '-', 'Fecha de fin : ', _this.fechaFin, '-',
            _this.cbPlan, '-', _this.tfbuscar, ' ', _this.btnBuscar,
            _this.btnActualizar, ' ', _this.btnLimpiar,
            '->', _this.btnAyudagant],
        usarKeymap: true,
        botonesKeymap: [_this.btnModificar, _this.btnEliminar,
            _this.btnVerDetalles, _this.btndiahoy, _this.btnBuscar,
            _this.btnActualizar, _this.btnLimpiar, _this.btnAyudagant]
    });

    //********Ganttt********
    this.Gantt = function () {
        arrayTiposElementos = [];
        if (Ext.getCmp('checkProyecto' + opcionesConfig.subsistemaInicial).checked == true) {
            arrayTiposElementos.push(8);
        }
        if (Ext.getCmp('checkHito' + opcionesConfig.subsistemaInicial).checked == true) {
            arrayTiposElementos.push(9);
        }
        if (Ext.getCmp('checkTarea' + opcionesConfig.subsistemaInicial).checked == true) {
            arrayTiposElementos.push(10);
        }

        _this.BarraProgreso.show('Cargando diagrama');
        Ext.Ajax.request({
            url: _this.urlCargarActividades,
            params: {
                denominacion: _this.tfbuscar.getValue(),
                idplan: _this.cbPlan.getValue(),
                fechainicio: _this.fechaInicio.getValue().format('d/m/Y'),
                fechafin: _this.fechaFin.getValue().format('d/m/Y'),
                arrayTiposElementos: Ext.encode(arrayTiposElementos),
                actividades: 0,
                proyectos: 1,
                material: 0
            },
            callback: function (options, success, response) {
                _this.tasks = Ext.decode(response.responseText);
                for (key in _this.tasks.data) {
                    if (_this.tasks.data[key].parent == null) {
                        _this.tasks.data[key].parent = '';
                    }
                }
                //***Columnas***
                gantt.config.columns = [
                    {
                        name: "text",
                        label: "Denominación",
                        tree: true,
                        align: "left",
                        width: 280,
                        template: function (obj) {
                            if (obj.idtipoelemento == 0) {
                                return '<span class="icondistra-folder sipac-azul">' + obj.text + '</span>';
                            } else if (obj.idtipoelemento == 1) {
                                return '<span class="icondistra-archivo sipac-azul">' + obj.text + '</span>';
                            } else if (obj.idtipoelemento == 3) {
                                return '<span class="icondistra-actividades sipac-azul">' + obj.text + '</span>';
                            } else if (obj.idtipoelemento == 8) {
                                return '<span class="icondistra-planilla sipac-azul">' + obj.text + '</span>';
                            } else if (obj.idtipoelemento == 9) {
                                return '<span class="icondistra-asentar sipac-azul">' + obj.text + '</span>';
                            } else if (obj.idtipoelemento == 10) {
                                return '<span class="icondistra-tarea sipac-azul">' + obj.text + '</span>';
                            } else if (obj.idtipoelemento == 11) {
                                return '<span class="icondistra-niveldeactividades sipac-azul">' + obj.text + '</span>';
                            }
                        }
                    }, {
                        name: "progress",
                        label: "% Cumpl.",
                        align: "center",
                        width: 60,
                        template: function (obj) {
                            return Math.round(obj.progress * 100);
                        }
                    }, {
                        name: "duration",
                        align: "center",
                        width: 60
                    }
                ];
                gantt.config.grid_width = 400;
                gantt.config.autofit = false;
                gantt.config.drag_progress = true;
                gantt.config.drag_links = true;
                gantt.config.drag_move = true;
                gantt.config.drag_resize = true;
                gantt.config.grid_resize = true;
                gantt.config.initial_scroll = false;

                /*if (_this.tasks.fechas[0].primerafecha != null) {
                 _this.primerafecha = _this.tasks.fechas[0].primerafecha.split("/");
                 _this.ultimafecha = _this.tasks.fechas[0].ultimafecha.split("/");
                 gantt.config.start_date = new Date(_this.primerafecha[2], (_this.primerafecha[1] - 1));
                 gantt.config.end_date = new Date(_this.ultimafecha[2], _this.ultimafecha[1]);
                 }*/

                _this.primerafecha = _this.fechaInicio.getValue().format('d/m/Y').split("/");
                _this.ultimafecha = _this.fechaFin.getValue().format('d/m/Y').split("/");

                gantt.templates.task_cell_class = _this.taskcell(new Date());

                //***Rango de fechas***
                gantt.config.lightbox.sections = [
                    {
                        name: "description",
                        height: 70,
                        map_to: "text",
                        type: "textarea",
                        focus: true
                    }, {
                        name: "time",
                        height: 72,
                        type: "duration",
                        map_to: "auto"
                    }
                ];

                gantt.attachEvent("onBeforeLinkAdd", function (id, link) {
                    if (opcionesConfig.usarDependencia == true) {
                        padre = gantt.getTask(link.source);
                        hijo = gantt.getTask(link.target);
                        if (padre.idtipoelemento != 3 || hijo.idtipoelemento != 3) {
                            mostrarMensaje(1, 'Las dependencias solo pueden ser generadas entre actividades.', function (btnoprimido) {
                                if (btnoprimido == 'ok' || btnoprimido == 'cancel') {
                                    gantt.deleteLink(link.id);
                                }
                            });
                        } else {
                            _this.crearVentanaTipodependencia(link);
                        }
                    }
                    return;
                });

                gantt.attachEvent("onContextMenu", function (taskId, linkId, e) {
                    var act = gantt.getTask(taskId);
                    var menunom = new Ext.menu.Menu({
                        id: 'menunom'
                    });
                    menunom.addMenuItem({
                        id: 'verdetalleMenuItem',
                        text: 'Ver detalles',
                        itemCls: 'x-menu-item icondistra-ver',
                        iconCls: 'imagen-none',
                        tooltip: 'Ver detalles de la actividad',
                        handler: function () {
                            _this.verDetalles(act);
                        }
                    });
                    if (act.idtipoelemento == 3) {
                        menunom.addMenuItem({
                            id: 'eliminaractMenuItem',
                            text: 'Eliminar actividad',
                            itemCls: 'x-menu-item icondistra-eliminar',
                            iconCls: 'imagen-none',
                            tooltip: 'Eliminar actividad',
                            handler: function () {
                                _this.EliminarActividades(act);
                            }
                        });
                        menunom.addMenuItem({
                            id: 'relacionarActMenuItem',
                            text: 'Relacionar actividad',
                            itemCls: 'x-menu-item icondistra-gestionarrelaciones',
                            iconCls: 'imagen-none',
                            tooltip: 'Relacionar actividad',
                            handler: function () {
                                _this.CrearRelaciones(taskId);
                            }
                        });
                        menunom.addMenuItem({
                            id: 'modificarActMenuItem',
                            text: 'Modificar actividad',
                            itemCls: 'x-menu-item icondistra-modificar',
                            iconCls: 'imagen-none',
                            tooltip: 'Modificar actividad',
                            handler: function () {
                                _this.modificarElemento(taskId);
                            }
                        });
                    } else if (act.idtipoelemento == 1) {
                        menunom.addMenuItem({
                            id: 'eliminaractMenuItem',
                            text: 'Eliminar objetivo',
                            itemCls: 'x-menu-item icondistra-eliminar',
                            iconCls: 'imagen-none',
                            tooltip: 'Eliminar actividad',
                            handler: function () {
                                _this.eliminarObjetivo(act);
                            }
                        });
                        menunom.addMenuItem({
                            id: 'relacionarObjMenuItem',
                            text: 'Relacionar objetivo',
                            itemCls: 'x-menu-item icondistra-gestionarrelaciones',
                            iconCls: 'imagen-none',
                            tooltip: 'Relacionar objetivo',
                            handler: function () {
                                _this.CrearRelaciones(taskId);
                            }
                        });
                        menunom.addMenuItem({
                            id: 'modificarObjMenuItem',
                            text: 'Modificar objetivo',
                            itemCls: 'x-menu-item icondistra-modificar',
                            iconCls: 'imagen-none',
                            tooltip: 'Modificar objetivo',
                            handler: function () {
                                _this.modificarElemento(taskId);
                            }
                        });
                    } else if (act.idtipoelemento == 0) {
                        menunom.addMenuItem({
                            id: 'eliminaractMenuItem',
                            text: 'Eliminar plan',
                            itemCls: 'x-menu-item icondistra-eliminar',
                            iconCls: 'imagen-none',
                            tooltip: 'Eliminar actividad',
                            handler: function () {
                                _this.eliminarPlan(act);
                            }
                        });
                        menunom.addMenuItem({
                            id: 'modificarPlanMenuItem',
                            text: 'Modificar plan',
                            itemCls: 'x-menu-item icondistra-modificar',
                            iconCls: 'imagen-none',
                            tooltip: 'Modificar plan',
                            handler: function () {
                                _this.modificarElemento(taskId);
                            }
                        });
                    }
                    var xy = [];
                    xy[0] = e.pageX;
                    xy[1] = e.pageY;
                    if (act.idelemento) {
                        menunom.showAt(xy);
                    }
                    if (act.eliminar == 0) {
                        Ext.getCmp('eliminaractMenuItem').disable();
                    }
                });

                /*** Si el espacio es muy corto */
                gantt.config.font_width_ratio = 7;
                gantt.templates.leftside_text = function leftSideTextTemplate(start, end, task) {
                    if (getTaskFitValue(task) === "left") {
                        return task.text;
                    }
                    return "";
                };
                gantt.templates.rightside_text = function rightSideTextTemplate(start, end, task) {
                    if (getTaskFitValue(task) === "right") {
                        return task.text;
                    }
                    return "";
                };
                gantt.templates.task_text = function taskTextTemplate(start, end, task) {
                    if (getTaskFitValue(task) === "center") {
                        return task.text;
                    }
                    return "";
                };
                function getTaskFitValue(task) {
                    var taskStartPos = gantt.posFromDate(task.start_date),
                        taskEndPos = gantt.posFromDate(task.end_date);
                    var width = taskEndPos - taskStartPos;
                    var textWidth = (task.text || "").length * gantt.config.font_width_ratio;
                    if (width < textWidth) {
                        var ganttLastDate = gantt.getState().max_date;
                        var ganttEndPos = gantt.posFromDate(ganttLastDate);
                        if (ganttEndPos - taskEndPos < textWidth) {
                            return "left";
                        } else {
                            return "right";
                        }
                    } else {
                        return "center";
                    }
                }

                /************** sobre deslizar una actividad ****************/
                gantt.attachEvent("onAfterTaskDrag", function (id, mode, e) {
                    var task = gantt.getTask(id);
                    if (task.idtipoelemento == 3) {
                        mensaje = '¿Est&aacute; seguro que quiere modificar la actividad seleccionada?';
                        permiso = 'Usted no tiene permiso para modificar la actividad seleccionada.';
                    } else if (task.idtipoelemento == 1) {
                        mensaje = '¿Est&aacute; seguro que quiere modificar el objetivo seleccionado?';
                        permiso = 'Usted no tiene permiso para modificar el objetivo seleccionado.';
                    } else {
                        mensaje = '¿Est&aacute; seguro que quiere modificar el plan seleccionado?';
                        permiso = 'Usted no tiene permiso para modificar el plan seleccionado.';
                    }
                    if (task.modificar == 1) {
                        mostrarMensaje(2, mensaje, function (btnoprimido) {
                            if (btnoprimido == 'ok') {
                                if (mode == 'progress') {
                                    _this.ActualizarPorciento(task);
                                } else if (mode == 'move') {
                                    _this.ModificarActividad(task);
                                    contadorDrag = 0;
                                } else if (mode == 'resize') {
                                    _this.ModificarActividad(task);
                                }
                            } else {
                                _this.Gantt(null);
                            }
                        });
                    } else {
                        mostrarMensaje(2, permiso);
                        _this.Gantt(null);
                    }
                });

                gantt.attachEvent("onBeforeTaskDrag", function (id, mode, e) {
                    var task = gantt.getTask(id);
                    if (mode == 'progress') {
                        if (task.modificar == 0) {
                            progreso = 0;
                            modificar = false;
                        } else {
                            modificar = true;
                        }
                    } else if (mode == 'move') {
                        if (task.modificar == 0) {
                            modificar = false;
                        }
                        else {
                            modificar = true;
                        }
                    } else if (mode == 'resize') {
                        if (task.modificar == 0) {
                            modificar = false;
                        } else {
                            modificar = true;
                        }
                    }
                    return modificar;
                });

                gantt.attachEvent("onTaskDrag", function (id, mode, task, original) {
                    if (mode == 'progress') {
                        progreso = task.progress;
                        if (task.modificar == 0) {
                            progreso = 0;
                        }
                    } else if (mode == 'move') {

                    }
                });
                /******** FIN sobre deslizar una actividad ******************/

                /******** CSS de los elementos ******************/
                gantt.templates.task_class = function (start, end, task) {
                    if (task.idtipoelemento == 3 || task.idtipoelemento == 10) {
                        if (task.progress != 1 && (end < new Date())) {
                            return "high";
                        } else if (task.progress == 1) {
                            return "cumplida";
                        } else {
                            return "normal";
                        }
                    } else if (task.idtipoelemento == 1 || task.idtipoelemento == 9) {
                        return "obj";
                    } else if (task.idtipoelemento == 0 || task.idtipoelemento == 8) {
                        return "planes";
                    } else {
                        return "nivel";
                    }
                };
                gantt.attachEvent("onTaskSelected", function (id, item) {
                    _this.btnModificar.enable();
                    _this.btnEliminar.enable();
                    _this.btnVerDetalles.enable();
                    var act = gantt.getTask(id);
                    if (act.idtipoelemento == 3 || act.idtipoelemento == 1) {
                        _this.btnRelaciones.enable();
                    }
                    if (act.idtipoelemento == 0) {
                        _this.btnRelaciones.disable();
                    }
                });
                gantt.attachEvent("onAfterTaskDelete", function (id, item) {
                    _this.btnModificar.disable();
                    _this.btnEliminar.disable();
                    _this.btnVerDetalles.disable();
                    _this.btnRelaciones.disable();
                });
                //***Cargar Gantt***
                _this.Semanas();
                _this.renderizar();
            }
        });
    };
    this.ActualizarPorciento = function (task) {
        if (task.idtipoelemento == 3) {
            mask = 'Modificando actividad';
            msj = 'La actividad ha sido modificada satisfactoriamente.';
        } else if (task.idtipoelemento == 1) {
            mask = 'Modificando objetivo';
            msj = 'El objetivo ha sido modificado satisfactoriamente.';
        } else {
            mask = 'Modificando plan';
            msj = 'El plan ha sido modificado satisfactoriamente.';
        }
        _this.BarraProgreso.show(mask);
        Ext.Ajax.request({
            url: opcionesConfig.urlActualizarPorciento,
            params: {
                porcientocumplimiento: task.progress,
                id: task.idelemento
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                _this.BarraProgreso.hide();
                if (responseData == 1) {
                    mostrarMensaje(2, msj);
                }
            }
        });
    };

    this.ModificarActividad = function (task) {
        if (task.$target.length > 0 || task.$source.length > 0) {
            mostrarMensaje(2, 'Esta actividad tiene dependencias. ¿Quiere aplicarle el efecto cadena?', function (btnoprimido) {
                if (btnoprimido == 'ok') {
                    _this.ModificarEfecto(task, 1);
                } else if (btnoprimido == 'cancel') {
                    _this.ModificarEfecto(task, 0);
                }
            });
        } else {
            _this.ModificarEfecto(task, 0);
        }
    };

    this.ModificarEfecto = function (task, efecto) {
        if (task.idtipoelemento == 3) {
            mask = 'Modificando actividad';
            msj = 'La actividad ha sido modificada satisfactoriamente.';
            msjExiste = 'La actividad que quiere modificar no se encuentra en los registros.';
        } else if (task.idtipoelemento == 1) {
            mask = 'Modificando objetivo';
            msj = 'El objetivo ha sido modificado satisfactoriamente.';
            msjExiste = 'El objetivo que quiere modificar no se encuentra en los registros.';
        } else {
            mask = 'Modificando plan';
            msj = 'El plan ha sido modificado satisfactoriamente.';
            msjExiste = 'El plan que quiere modificar no se encuentra en los registros.';
        }
        _this.BarraProgreso.show(mask);
        Ext.Ajax.request({
            url: opcionesConfig.urlModificarActividad,
            params: {
                finiact: task.start_date.format('d/m/Y'),
                ffinact: task.end_date.format('d/m/Y'),
                idactividad: task.idelemento,
                tipo: task.idtipoelemento,
                efecto: efecto
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                _this.BarraProgreso.hide();
                if (responseData.mensaje == 1) {
                    mostrarMensaje(2, msj);
                } else if (responseData.mensaje == 0) {
                    mostrarMensaje(2, msjExiste);
                } else {
                    mostrarMensaje(2, 'Las fechas de la actividad seleccionada no pueden ser modificadas.');
                }
                _this.Gantt(null);
            }
        });
    };

    this.crearVentanaTipodependencia = function (link) {
        var w = Ext.getCmp('ventanadependencia');
        if (w == undefined) {
            stcbimpacto = new Ext.data.SimpleStore({
                fields: ['iddependencia', 'denominacion'],
                data: [
                    [0, 'Total'],
                    [1, 'Porcentual'],
                    [2, 'Puerta Abierta']
                ]
            });

            cbimpacto = new Ext.form.ComboBox({
                hideLabel: true,
                store: stcbimpacto,
                displayField: 'denominacion',
                typeAhead: false,
                mode: 'local',
                triggerAction: 'all',
                selectOnFocus: true,
                hiddenName: 'iddependencia',
                valueField: 'iddependencia',
                width: 100,
                anchor: '95%',
                emptyText: 'Seleccione...',
                listeners: {
                    select: function (cb, record, index) {
                        if (cb.getValue() == 1)
                            tfporciento.enable();
                        else
                            tfporciento.disable();
                    }
                }
            });

            tfporciento = new Ext.form.NumberField({
                id: 'tfporciento',
                fieldLabel: '% inicio',
                hideLabel: true,
                allowBlank: true,
                disabled: true,
                width: 40,
                emptyText: '% inicio',
                blankText: 'Este campo es obligatorio.',
                maxValue: 100,
                anchor: '95%'
            });

            ventana = new Ext.Window({
                title: 'Tipo de dependencia',
                height: 100,
                width: 270,
                id: 'ventanadependencia',
                closable: false,
                items: [{
                    layout: 'column',
                    frame: true,
                    items: [{
                        columnWidth: .7,
                        layout: 'form',
                        border: false,
                        items: [cbimpacto]
                    }, {
                        columnWidth: .3,
                        layout: 'form',
                        border: false,
                        items: [tfporciento]
                    }]
                }],
                buttons: [new Ext.Button({
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    tooltip: 'Cerrar ventana sin guardar los datos',
                    handler: function () {
                        gantt.deleteLink(link.id);
                        ventana.destroy();
                    }
                }),
                    new Ext.Button({
                        iconCls: 'aceptar',
                        text: 'Aceptar',
                        tooltip: 'Guardar datos y cerrar ventana',
                        handler: function () {
                            ventana.destroy();
                            gantt.getLink(link.id).type = cbimpacto.getValue();
                            gantt.getLink(link.id).porciento = tfporciento.getValue();
                            _this.adicionarDependencia(link);
                        }
                    })]
            });
            ventana.show();
        }
    };

    this.adicionarDependencia = function (link) {
        var arreglodependencias = [];
        padre = gantt.getTask(link.source);
        hijo = gantt.getTask(link.target);
        arreglodependencias.push(hijo.idelemento);
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/generarDependencia',
            params: {
                arraysubactividades: Ext.encode(arreglodependencias),
                origen: (link.type + 6),
                actpadre: padre.idelemento,
                porcientoinicio: link.porciento
            },
            callback: function (options, success, response) {
                var respuesta = Ext.decode(response.responseText);
                if (respuesta.success == 1) {
                    mostrarMensaje(1, 'La dependencia ha sido generada satisfactoriamente.');
                } else {
                    gantt.deleteLink(link.id);
                    mostrarMensaje(1, 'La dependencia no pudo ser generada.');
                }
            }
        });
    };

    this.renderizar = function () {
        gantt.init("gantt_here");
        gantt.showDate(new Date());
        gantt.refreshData();
        gantt.refreshLink();
        gantt.parse(_this.tasks);
        if (_this.BarraProgreso)
            _this.BarraProgreso.hide();
        if (_this.tasks.data == '') {
            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
        }
    };

    //***Escalas de tiempo ***
    this.Meses = function () {
        gantt.config.start_date = new Date(_this.primerafecha[2], (_this.primerafecha[1] - 1));
        gantt.config.end_date = new Date(_this.ultimafecha[2], parseInt(_this.ultimafecha[1]) + 1);
        gantt.config.scale_unit = "month";
        gantt.config.date_scale = "%F, %Y";
        gantt.config.scale_height = 40;
        gantt.config.min_column_width = 35;
        gantt.config.subscales = [
            {unit: "day", step: 1, date: "%j, %D"}
        ];
    };

    this.Dias = function () {
        gantt.config.start_date = new Date(_this.primerafecha[2], (_this.primerafecha[1] - 1));
        gantt.config.end_date = new Date(_this.ultimafecha[2], parseInt(_this.ultimafecha[1]) + 1);
        gantt.config.scale_unit = "day";
        gantt.config.date_scale = "%d/%m/%Y";
        gantt.config.min_column_width = 75;
        gantt.config.scale_height = 40;
        gantt.config.subscales = [
            {unit: "day", step: 1, date: "%D"}
            //{unit: "hour", step: 8, date: "%H:%i"}
        ];
    };

    this.Semanas = function () {
        gantt.config.start_date = new Date(_this.primerafecha[2], (_this.primerafecha[1] - 1));
        gantt.config.end_date = new Date(_this.ultimafecha[2], parseInt(_this.ultimafecha[1]) + 1);
        var weekScaleTemplate = function (date) {
            var dateToStr = gantt.date.date_to_str("%d %M");
            var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
            return dateToStr(date) + " - " + dateToStr(endDate);
        };
        gantt.config.scale_unit = "week";
        gantt.config.step = 1;
        gantt.templates.date_scale = weekScaleTemplate;
        gantt.config.min_column_width = 30;
        gantt.config.subscales = [
            {unit: "day", step: 1, date: "%D, %j"}
        ];
        gantt.config.scale_height = 40;
    };

    this.Annos = function () {
        gantt.config.start_date = new Date(_this.primerafecha[2], 0);
        gantt.config.end_date = new Date(_this.ultimafecha[2], 12);
        gantt.config.scale_unit = "year";
        gantt.config.step = 1;
        gantt.config.date_scale = "%Y";
        gantt.config.min_column_width = 30;
        gantt.config.scale_height = 50;
        gantt.templates.date_scale = null;
        var monthScaleTemplate = function (date) {
            var dateToStr = gantt.date.date_to_str("%M");
            var endDate = gantt.date.add(date, 2, "month");
            return dateToStr(date) + " - " + dateToStr(endDate);
        };
        gantt.config.subscales = [
            {
                unit: "month",
                step: 3,
                template: monthScaleTemplate
            }, {
                unit: "month",
                step: 1,
                date: "%M"
            }
        ];
    };

    //***Ventana Detalles***
    if (opcionesConfig.usarCrudActividades) {
        gantt.attachEvent("onTaskDblClick", function (id, e) {
            _this.modificarElemento(id);
        });
    }

    this.DiaDeHoy = function () {
        gantt.showDate(new Date());
    };

    this.ExportarPDF = function () {
        var tasksarea = Ext.get("gantt_task");
        var container = Ext.get("gantt_container");
        var scroll = Ext.get("gantt_hor_scroll");
        scroll.hide();
        var widthBefore = tasksarea.getWidth();
        var widthBeforeContainer = container.getWidth();
        var heightBefore = tasksarea.getHeight();
        tasksarea.setWidth(gantt._calculate_content_width());
        container.setWidth(gantt._calculate_content_width());
        tasksarea.setHeight(container.getHeight());
        var html = Ext.get("gantt_here");
        html = html.dom.innerHTML;
        tasksarea.setWidth(widthBefore);
        tasksarea.setHeight(heightBefore);
        scroll.show();
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/ExportarGanttPDF',
            params: {
                html: html,
                ancho: gantt._calculate_content_width()
            },
            callback: function (options, success, response) {
                var cuerporeporte = Ext.decode(response.responseText);
                var winreporte = window.open('', '', 'scrollbars = yes,toolbar = yes,location = yes,resizable = yes, menubar = yes, status = yes');
                winreporte.document.write("<HTML><HEAD><TITLE>Vista previa del reporte</TITLE></HEAD><BODY>" + cuerporeporte + "</BODY></HTML>");
                winreporte.document.close();
            }
        });
    };

    this.ExportarPNG = function () {
        gantt.exportToPNG({skin: "skyblue"});
    };

    this.mostrarTareasDadoRango = function (fechaInicio, fechaFin) {
        _this.primerafecha = fechaInicio.split("/");
        _this.ultimafecha = fechaFin.split("/");
        gantt.config.start_date = new Date(_this.primerafecha[2], (_this.primerafecha[1] - 1));
        gantt.config.end_date = new Date(_this.ultimafecha[2], parseInt(_this.ultimafecha[1]) + 1);
        gantt.templates.task_cell_class = _this.taskcell(new Date());
        _this.renderizar();
    };

    this.taskcell = function (today) {
        return function (item, date) {
            return date.format('d/m/Y') == today.format('d/m/Y') ? "today" : "";
        };
    };

    this.EliminarActividades = function (act) {
        var mensaje = '', mensajemascara = '', mensajeconfirmacion = '';
        var arrayidactividades = [];
        arrayidactividades[0] = act.idelemento;
        mensaje = ' ¿Est&aacute; seguro que quiere eliminar la actividad seleccionada?';
        mensajemascara = 'Eliminando actividad';
        mensajeconfirmacion = 'La actividad ha sido eliminada satisfactoriamente.';
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: opcionesConfig.urlEliminarActividad,
                    params: {
                        arrayidactividades: Ext.encode(arrayidactividades)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, mensajeconfirmacion);
                            gantt.deleteTask(act.id);
                        }
                    }
                });
            }
        });
    };

    this.eliminarObjetivo = function (act) {
        var mensaje = '', mensajemascara = '', mensajeconfirmacion = '';
        var arrayidactividades = [];
        arrayidactividades[0] = act.idelemento;
        mensaje = ' ¿Est&aacute; seguro que quiere eliminar el objetivo seleccionado?';
        mensajemascara = 'Eliminando objetivo';
        mensajeconfirmacion = 'El objetivo ha sido eliminado satisfactoriamente.';
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionarobjetivos/eliminarobjetivos',
                    params: {
                        arrayidobjetivos: Ext.encode(arrayidactividades)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, mensajeconfirmacion);
                            gantt.deleteTask(act.id);
                        }
                    }
                });
            }
        });
    };
    this.eliminarPlan = function (act) {
        var mensaje = '', mensajemascara = '', mensajeconfirmacion = '';
        var arrayidactividades = [];
        arrayidactividades[0] = act.idelemento;
        mensaje = ' ¿Est&aacute; seguro que quiere eliminar el plan seleccionado?';
        mensajemascara = 'Eliminando plan';
        mensajeconfirmacion = 'El plan ha sido eliminado satisfactoriamente.';
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionarplan/eliminarplan',
                    params: {
                        arrayidplan: Ext.encode(arrayidactividades)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, mensajeconfirmacion);
                            gantt.deleteTask(act.id);
                        }
                    }
                });
            }
        });
    };

    this.PostAccionesGestionar = function (mensaje, accion, raiz) {
        if (accionGestion == 'Modificar') {
            _this.Gantt(null);
        }
        if (accionGestion == 'Adicionar') {
            if (tipoGestion == 3) {
                _this.Gantt(null);
            } else {
                _this.actualizar();
            }
        }
    };

    gantt.attachEvent("onLinkDblClick", function (id, e) {
        link = gantt.getLink(id);
        _this.eliminarDependencias(link);
    });

    this.eliminarDependencias = function (link) {
        padre = gantt.getTask(link.source);
        hijo = gantt.getTask(link.target);
        mostrarMensaje(2, '¿Est&aacute; seguro que quiere eliminar la dependencia seleccionada?', function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show('Eliminando dependencia');
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpdiagramagantt/eliminarDependencia',
                    params: {
                        idelementopadre: hijo.idelemento,
                        idelementohijo: padre.idelemento,
                        origen: link.origen
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, 'La dependencia ha sido eliminada satisfactoriamente.');
                            gantt.deleteLink(link.id);
                        } else {
                            mostrarMensaje(1, 'La dependencia no pudo ser eliminada.');
                        }
                    }
                });
            }
        });
    };

    this.modificarElemento = function (id) {
        var array = [];
        var act = gantt.getTask(id);
        var actpadre = null;
        accionGestion = 'Modificar';
        if (act.parent) {
            actpadre = act.parent;
        }
        if (act.modificar == 1) {
            if (act.idelemento) {
                array.push(act.idelemento);
                if (act.idtipoelemento == 3) {
                    tipoGestion = 3;
                    _this.objCrudActividad.CrearWinCrudActividades(
                        new Date().format('d/m/Y'),
                        new Date().format('d/m/Y'),
                        '08:00',
                        '17:00',
                        'Modificar',
                        _this.PostAccionesGestionar,
                        array,
                        null,
                        0,//act.$level,
                        permisomodificar = 1,
                        permisoeliminar = 1,
                        _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                        null,
                        null,
                        null,
                        1,
                        actpadre
                    );
                } else if (act.idtipoelemento == 1) {
                    tipoGestion = 1;
                    _this.objCrudObjetivo.CrearWinCrudObjetivos(
                        new Date().format('d/m/Y'),
                        new Date().format('d/m/Y'),
                        'Modificar',
                        _this.PostAccionesGestionar,
                        array,
                        null,
                        act.$level,
                        permisomodificar = 1,
                        permisoeliminar = 1,
                        _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                        null);
                } else if (act.idtipoelemento == 0) {
                    tipoGestion = 0;
                    _this.objCrudPlan.CrearWinCrudPlan('Modificar', _this.PostAccionesGestionar, array);
                }
            }
        } else {
            mostrarMensaje(2, 'Usted no tiene permisos para modificar el elemento.');
        }
    };

    this.verDetalles = function (act) {
        accionGestion = 'Ver datos';
        var array = [];
        if (act.idelemento) {
            array.push(act.idelemento);
            if (act.idtipoelemento == 3) {
                tipoGestion = 3;
                _this.objCrudActividad.CrearWinCrudActividades(
                    new Date().format('d/m/Y'),
                    new Date().format('d/m/Y'),
                    new Date().format('8:00'),
                    new Date().format('17:00'),
                    'Ver datos de la', function () {
                    },
                    array, null, 0, permisomodificar = 1,
                    permisoeliminar = 1, [],
                    null, null, true
                );
            } else if (act.idtipoelemento == 1) {
                tipoGestion = 1;
                _this.objCrudObjetivo.CrearWinCrudObjetivos(
                    new Date().format('d/m/Y'),
                    new Date().format('d/m/Y'),
                    'Ver datos del',
                    _this.PostAccionesGestionar,
                    array,
                    null,
                    act.$level,
                    permisomodificar = 1,
                    permisoeliminar = 1,
                    _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                    null);
            } else if (act.idtipoelemento == 0) {
                tipoGestion = 0;
                _this.objCrudPlan.CrearWinCrudPlan('Ver datos del', _this.PostAccionesGestionar, array);
            }
        }
    };

    this.adicionarElemento = function (tipo) {
        accionGestion = 'Adicionar';
        var array = [];
        if (tipo == 3) {
            tipoGestion = 3;
            _this.objCrudActividad.CrearWinCrudActividades(
                new Date().format('d/m/Y'),
                new Date().format('d/m/Y'),
                '08:00',
                '17:00',
                'Adicionar',
                _this.PostAccionesGestionar,
                array,
                null,
                0,
                permisomodificar = 1,
                permisoeliminar = 1,
                _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                null,
                null,
                null,
                1,
                null
            );
        } else if (tipo == 1) {
            tipoGestion = 1;
            _this.objCrudObjetivo.CrearWinCrudObjetivos(
                new Date().format('d/m/Y'),
                new Date().format('d/m/Y'),
                'Adicionar',
                _this.PostAccionesGestionar,
                array,
                null,
                0,
                permisomodificar = 1,
                permisoeliminar = 1,
                _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                null);
        } else if (tipo == 0) {
            tipoGestion = 2;
            _this.objCrudPlan.CrearWinCrudPlan('Adicionar', _this.PostAccionesGestionar, array);
        }
    };

    this.actualizar = function () {
        gantt.clearAll();
        _this.Gantt();
    };

    this.limpiar = function () {
        _this.tfbuscar.reset();
        _this.cbPlan.reset();
        _this.fechaInicio.setValue(new Date().format('d/m/Y'));
        _this.fechaFin.setValue(new Date().format('d/m/Y'));
        Ext.getCmp('checkHito' + opcionesConfig.subsistemaInicial).setChecked(false);
        Ext.getCmp('checkTarea' + opcionesConfig.subsistemaInicial).setChecked(false);
        Ext.getCmp('checkProyecto' + opcionesConfig.subsistemaInicial).setChecked(false);
        gantt.clearAll();
        _this.Gantt();
    };


};



