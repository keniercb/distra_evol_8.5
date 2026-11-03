Utilidades.Cmp.Crudganttproyecto = function (opcionesConfig) {
    var _this = this;
    this.BarraProgreso = new BarraEstado();

    this.pGantt = new Ext.Panel({
        id: 'pGantt',
        region: 'center',
        html: '<div id="gantt_here" style="width:100%; height:100%;"></div>'
    });



    //********Ganttt********
    this.Gantt = function (fechainicio, fechafin) {
        _this.BarraProgreso.show('Cargando diagrama');
        Ext.Ajax.request({
            url: 'tareasParaGantt',
            params: {
                fechainicio: fechainicio,
                fechafin: fechafin,
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

                            if (obj.idtipoelemento == 8) {
                                return '<span class="icondistra-planilla sipac-azul">' + obj.text + '</span>';
                            } else if (obj.idtipoelemento == 9) {
                                return '<span class="icondistra-asentar sipac-azul">' + obj.text + '</span>';
                            } else if (obj.idtipoelemento == 10) {
                                return '<span class="icondistra-tarea sipac-azul">' + obj.text + '</span>';
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
                //gantt.config.grid_width = 400;
                gantt.config.autofit = false;
                gantt.config.drag_progress = true;
                gantt.config.drag_links = true;
                gantt.config.drag_move = true;
                gantt.config.drag_resize = true;
                gantt.config.grid_resize = true;
                gantt.config.initial_scroll = false;

                _this.primerafecha = _this.tasks.data[1].start_date.split("-");
                _this.ultimafecha = _this.tasks.data[1].end_date.split("-");

                console.log(_this.primerafecha);
                console.log(_this.ultimafecha);

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
                    } else if (task.idtipoelemento == 9) {
                        return "obj";
                    } else if (task.idtipoelemento == 8) {
                        return "planes";
                    }
                };
                //***Cargar Gantt***
                _this.Semanas();
                _this.renderizar();
            }
        });
    };


    this.taskcell = function (today) {
        return function (item, date) {
            return date.format('d/m/Y') == today.format('d/m/Y') ? "today" : "";
        };
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


};



