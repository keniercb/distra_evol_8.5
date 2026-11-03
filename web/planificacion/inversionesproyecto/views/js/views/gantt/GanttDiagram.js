Planificacion.Integracion.GanttDiagram = ExtExtend.Class({
    $extend: Ext.Window,
    width: 1000,
    height: 550,
    modal: true,
    maximizable: true,
    bodyStyle: 'background:#fff;',
    initComponent: function () {
        var _this = this;
        _this.controller = (_this.controller) ? _this.controller : new Planificacion.Integracion.GanttController();
        _this.etiquetas = (_this.etiquetas) ? _this.etiquetas : _this.controller._getLabel('Gantt');
        _this.directorioImagenes = (_this.directorioImagenes) ? _this.directorioImagenes : _this.controller._getGlobals('dirImg');
        _this.extendCmp = (_this.extendCmp) ? _this.extendCmp : ExtExtend.Components;
        _this.datos = (_this.datos) ? _this.datos : null;
        // _insert item
        _this.controller._insertItem('ganttDiagram', _this);
        // title
        _this.title = _this.etiquetas.textGenerarDiagrama;
        // buttons

        _this.btnCerrar = new _this.extendCmp.buttons.btnCerrar({
            handler: function () {
                _this.close();
            }
        });

        _this.btnGuardar = new _this.extendCmp.buttons.btnExportar({
            tooltip: 'Guardar diagrama',
            handler: function () {
                var ganttExport = new Planificacion.Integracion.GanttExport({
                    etiquetas: _this.etiquetas,
                    extendCmp: _this.extendCmp,
                    gantt: _this.gantt,
                    idGanttDiagram: _this.getId()
                });
                ganttExport.show();
            }
        });
        _this.Label = new Ext.form.Label({
            text: '->'
        });
        _this.Label1 = new Ext.form.Label({
            text: 'Porcentaje de cumplimiento:'
        });
        _this.buttons = [_this.btnCerrar/*, _this.btnGuardar*/];
        // bbar
        _this.tbar = ['->', _this.btnGuardar];

        _this.bbar = [{
                boxLabel: _this.etiquetas.boxLabelDia,
                name: 'radio',
                xtype: 'radio',
                hideLabel: 'false',
                checked: true,
                inputValue: 1,
                listeners: {
                    check: function (checkbox, checked) {
                        if (checked) {
                            _this.setScale(checkbox.getRawValue());
                        }
                    }
                }
            }, '-',
                {
                    boxLabel: _this.etiquetas.boxLabelMes,
                    name: 'radio',
                    xtype: 'radio',
                    inputValue: 2,
                    listeners: {
                        check: function (checkbox, checked) {
                            if (checked) {
                                _this.setScale(checkbox.getRawValue());
                            }
                        }
                    }
                }, '-',
                {
                    boxLabel: _this.etiquetas.boxLabelAnno,
                    name: 'radio',
                    xtype: 'radio',
                    inputValue: 3,
                    listeners: {
                        check: function (checkbox, checked) {
                            if (checked) {
                                _this.setScale(checkbox.getRawValue());
                            }
                        }
                    }
                }, '->',
                _this.Label1
        ];

        // resize event
        _this.on('resize', function (win, width, height) {
            if (win.tasks) {
                _this.showGantt(win.tasks);
            } else {
                if (_this.datos) {
                    _this.showGantt(_this.datos);
                } else {
                    var idestudiogantt = _this.objproyecto.get('idestudiogantt');
                    _this.controller.obtenerTareas(idestudiogantt);
                }
            }
        });


        _this.keys = new Ext.KeyMap(document, [
            {
                key: 'g',
                alt: true,
                scope: _this,
                stopEvent: true,
                fn: function () {
                    _this.btnGuardar.handler.call();
                }
            },
            {
                key: 'x',
                alt: true,
                scope: _this,
                stopEvent: true,
                fn: function () {
                    _this.btnCerrar.handler.call();
                }
            }
        ]);

        Planificacion.Integracion.GanttDiagram.superclass.initComponent.call(Ext.apply(this, arguments));
    },
    setScale: function (value) {
        var _this = this;
        switch (value) {
            case "1":
                _this.gantt.config.scale_unit = "day";
                _this.gantt.config.step = 1;
                _this.gantt.config.date_scale = "%d %M";
                _this.gantt.config.subscales = [];
                _this.gantt.config.scale_height = 30;
                _this.gantt.templates.date_scale = null;
                break;
            case "2":
                _this.gantt.config.scale_unit = "month";
                _this.gantt.config.date_scale = "%F, %Y";
                _this.gantt.config.scale_height = 30;
                _this.gantt.templates.date_scale = null;
                break;
            case "3":
                _this.gantt.config.scale_unit = "year";
                _this.gantt.config.step = 1;
                _this.gantt.config.date_scale = "%Y";
                _this.gantt.config.min_column_width = 50;
                _this.gantt.config.scale_height = 30;
                _this.gantt.templates.date_scale = null;
                break;
        }
        _this.gantt.render();
    },
    showGantt: function (response) {
        var _this = this;

        if (!_this.gantt) {

            var config = {
                id:  (response.idcontainer ? response.idcontainer : 'gantt-' +_this.getId()),
                style: 'width:100%; height:100%;'
            };

            if (!response.idcontainer) {
                var tpl = new Ext.XTemplate('<div id="{id}" style="{style}"></div>');
                tpl.overwrite(_this.body, config);
            }

            var collectionTarea = new Ext.util.MixedCollection(false, function (item) {
                return item.idtareagantt;
            });

            collectionTarea.addAll(response);

            var data = [];
            var links = [];
            collectionTarea.each(function (item, index, length) {
                var dtStart = new Date();
                dtStart = Date.parseDate(item.fechaini, 'd/m/Y');
                var dtEnd = new Date();
                dtEnd = Date.parseDate(item.fechafin, 'd/m/Y');
                var range = _this.calculateRange(dtStart, dtEnd);
                data.push({
                    id: item.idtareagantt,
                    text: item.denominacion,
                    start_date: dtStart.format('d-m-Y'),
                    duration: range,
                    progress: (new Number(item.porcientocumplimiento) / 100)
                });
                if ((item.idpadre !== null) && (item.idpadre !== item.idtareagantt)) {
                    links.push({
                        id: index,
                        source: item.idpadre,
                        target: item.idtareagantt,
                        type: "0"
                    });
                }
            });

            var tasks = {
                data: data,
                links: links
            };

            // set tasks
            _this.tasks = tasks;

            // set gantt object
            _this.gantt = gantt;

            // configuracion inicial
            _this.gantt.config.columns = [
                {
                    name: "text",
                    label: _this.etiquetas.labelTarea,
                    tree: false,
                    align: "center",
                    width: 200

                },
                {name: "duration", label: _this.etiquetas.labelDuracion, align: "center"}
            ];

            // deshabilitar eventos
            _this.gantt.config.details_on_dblclick = false;
            _this.gantt.attachEvent("onBeforeTaskChanged", function (id, mode, old_event) {
                return false;
            });
            _this.gantt.attachEvent("onBeforeTaskDrag", function (id, mode) {
                return false;
            });
            _this.gantt.attachEvent("onLinkDblClick", function (id, e) {
                return false;
            });
            _this.gantt.attachEvent("onBeforeLinkAdd", function (id, link) {
                return false;
            });
            _this.gantt.attachEvent("onBeforeLinkUpdate", function (id, new_item) {
                return false;
            });

            // scala por defecto
            _this.gantt.config.scale_unit = "day";
            _this.gantt.config.step = 1;
            _this.gantt.config.date_scale = "%d %M";
            _this.gantt.config.subscales = [];
            _this.gantt.config.scale_height = 30;
            _this.gantt.config.row_wrapper_width = 20;
            _this.gantt.config.drag_links = false;
            _this.gantt.config.fit_tasks = true;
            _this.gantt.templates.date_scale = null;

            // % de cumplimiento
            _this.gantt.templates.task_text = function (t, e, task) {
                return "<span>" + Math.round(task.progress * 100) + "% </span>";
            };

            // tooltip tarea
            _this.gantt.templates.tooltip_date_format = _this.gantt.date.date_to_str("%d-%m-%Y");
            _this.gantt.templates.tooltip_text = function (start, end, event) {
                var msecFin = end.getTime() - (1 * 24 * 60 * 60 * 1000);
                var dtEnd = new Date(msecFin);
                return "<b>" + _this.etiquetas.tooltipTarea + "</b> " + event.text +
                "<br/><b>" + _this.etiquetas.tooltipFechaInicio + "</b> " + _this.gantt.templates.tooltip_date_format(start) +
                "<br/><b>" + _this.etiquetas.tooltipFechaFin + "</b> " + _this.gantt.templates.tooltip_date_format(dtEnd);
            };

            // init gantt
            _this.gantt.init(config.id);

            // limpiar datos
            _this.gantt.clearAll();

            // cargar datos
            _this.gantt.parse(_this.tasks);

        } else {
            _this.gantt.parse(_this.tasks);
            _this.gantt.render();
        }

    },
    calculateRange: function (fechaini, fechafin) {
        var msecIni = fechaini.getTime();
        var msecFin = fechafin.getTime();
        // (24 horas x 60 minutos x 60 segundos x 1000 milisegundos)        
        var msecPorDia = ((1000 * 60) * 60) * 24;
        var intervalo = msecFin - msecIni;
        var duracion = Math.floor(intervalo / msecPorDia) + 1;
        return duracion;
    }
});
Ext.reg('Planificacion.Integracion.GanttDiagram', Planificacion.Integracion.GanttDiagram);

