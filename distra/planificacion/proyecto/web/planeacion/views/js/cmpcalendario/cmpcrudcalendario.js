Utilidades.Cmp.Cmpcrudcalendario = function(opcionesConfig) {

    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    this.idautor = null;
    this.eshija = 0;
    this.selectforrclick = null;
    this.arrayidactividades = [];
    this.arrayrepeticionesseleccionadas = [];
    this.arrayidactrep = [];
    this.permitirreasignar = 0;
    this.permitireliminar = 0;
    this.permitiradicionar = 0;
    this.padre = 0;
    this.prevrowrep = -1;
    this.vistaxdefecto = 2;
    this.contadorid = 0;
    this.radioChekiado = 1;
    this.superior = 0;
    var existecalendariobusqueda = 0;
    this.idconfiguracion = null;
    this.idEstructura = 0;
    this.idproyecto = 0;
    this.idhito = 0;

    var existecalpersonal = 0;
    this.arraycalendariosexistentes = [];
    var arr_dates = [];
    var arr_hour = [];

    //objeto CRUD-TAREAS inicializado
    this.objCrudtarea = new Utilidades.Cmp.Cmpcrudtarea(opcionesConfig);

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();
    this.objclasificadorinvolrepeticiones = new Utilidades.Cmp.Cmpclasificadorinvol();

    //validacion de fechas
    Ext.apply(Ext.form.VTypes, {
        rangodefechas: function(val, field) {
            var date = field.parseDate(val);
            if (!date) {
                return false;
            }
            if (field.endDateField) {
                var end = Ext.getCmp(field.endDateField);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
                arr_dates.push(date); //arreglo temporal que almacena las fechas que se seleccionan en el datefield inicio
                date = _this.GetRangeDay(date, end.getValue())//permite respetar fecha final a partir de una fecha inicial dado un rango de dias.
                end.setValue(date);
            }
            return true;
        }
    });

    //store del calendario de eventos donde se cargan las actividades
    this.eventStore = new Ext.data.JsonStore({
        id: 'eventStore',
        url: '/planificacion/proyecto/planeacion/index.php/cmpcalendario/CargarElementosCal',
        root: 'data',
        //proxy: new Ext.data.MemoryProxy(),
        listeners: {
            beforeload: function(st, conf) {
                _this.BarraProgreso.show('Cargando tareas en el calendario');
                //st.baseParams.idEstructura = (opcionesConfig.idEstructura) ? opcionesConfig.idEstructura : 0;
                st.baseParams.idEstructura = _this.idEstructura;
                st.baseParams.idproyecto = _this.idproyecto;
                st.baseParams.idhito = _this.idhito;

                st.baseParams.start = conf.params.start;
                st.baseParams.end = conf.params.end;
            },
            load: function(st, conf) {
                //st.sort('startdate','ASC');
                _this.BarraProgreso.hide();
                opcionesConfig.cbProyecto.enable();
            },
            loadexception: function() {
                _this.BarraProgreso.hide();
            }
        },
        fields: [
            {
                name: 'EventId',
                mapping: 'idactividad'
            }, {
                name: 'CalendarId',
                mapping: 'cid'
            }, {
                name: 'Title',
                mapping: 'title'
            }, {
                name: 'StartDate',
                mapping: 'start'
            }, {
                name: 'EndDate',
                mapping: 'end'
            }, {
                name: 'IsAllDay',
                mapping: 'ad'
            }, {
                name: 'description',
                type: 'string'
            }, {
                name: 'color',
                type: 'string'
            }, {
                name: 'idelemento',
                type: 'int'
            }, {
                name: 'caducidad',
                type: 'int'
            }, {
                name: 'categoria',
                type: 'string'
            }, {
                name: 'tipoact',
                type: 'string'
            }, {
                name: 'lugar',
                type: 'string'
            }, {
                name: 'participan',
                type: 'string'
            }, {
                name: 'estadocump',
                type: 'string'
            }, {
                name: 'gradocump',
                type: 'string'
            }, {
                name: 'modificar',
                type: 'string'
            }, {
                name: 'eliminar',
                type: 'string'
            }, {
                name: 'activo',
                type: 'string'
            }, {
                name: 'superior',
                type: 'string'
            }, {
                name: 'idestadoaprob',
                type: 'string'
            }, {
                name: 'nombreestadoaprob',
                type: 'string'
            }, {
                name: 'subordinado',
                type: 'string'
            }, {
                name: 'idautor',
                mapping: 'idautor'
            }, {
                name: 'idhito',
                mapping: 'idhito'
            }, {
                name: 'nombreautor',
                mapping: 'nombreautor'
            }, {
                name: 'denomhito',
                mapping: 'denomhito'
            }, {
                name: 'idproyecto',
                mapping: 'idproyecto'
            }, {
                name: 'denomproyecto',
                mapping: 'denomproyecto'
            }],
        sortInfo: {
            field: 'StartDate',
            direction: 'ASC'
        }
    }); //console.log(_this.eventStore);

    this.pcalendario = new Ext.calendar.CalendarPanel({
        title: opcionesConfig.titulo,
        id: opcionesConfig.id,
        eventStore: _this.eventStore,
        //calendarStore: _this.calendarStore,
        border: true,
        region: 'center',
        tbar: [],
        activeItem: _this.vistaxdefecto,
        monthViewCfg: {
            showHeader: true,
            showWeekLinks: true,
            showWeekNumbers: true
        },
        weekViewCfg: {
            showHeader: true,
            showWeekLinks: true,
            showWeekNumbers: true
        },
        dayViewCfg: {
            showHeader: true,
            showWeekLinks: true,
            showWeekNumbers: true
        },
        initComponent: function() {
            this.constructor.prototype.initComponent.apply(this, arguments);
        },
        listeners: {
            'eventclick': {
                fn: function(vw, rec, el) {
                    var actividadseleccionada = rec;
                    var arrayidactividades = [];
                    _this.eshija = 0;
                    /*_this.objCrudActividad.CrearWinCrudActividades(rec.data.StartDate.format('m/d/y'), rec.data.EndDate.format('m/d/y'),
                     rec.data.StartDate.format('H:i'), rec.data.EndDate.format('H:i'), 'Modificar', _this.PostAccionesGestionar, arrayidactividades,
                     idautor, _this.eshija, permisomodificar = 1, permisoeliminar = 1, _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(), null, _this.calendarStore, true);*/
                    var arrayidelementos = [];
                    arrayidelementos.push({
                        id: actividadseleccionada.data.idelemento,
                        tipo: 10,
                        plantilla: 0,
                        idautor: actividadseleccionada.data.idautor,
                        evento: 0,
                        gradocumplimiento: actividadseleccionada.data.gradocump,
                        denominacion: actividadseleccionada.data.Title,
                        _is_leaf: true
                    });
                    //console.log(actividadseleccionada.data);
                    _this.objCrudtarea.CrearWinCrudtarea(
                            'Modificar', _this.padre, _this.PostAccionesGestionar, arrayidelementos,
                            null, _this.idEstructura);
                }
                //scope: this
            },
            'eventover': function(vw, rec, el) {
                new Ext.ToolTip({
                    target: el,
                    html: '<ins><b>Denominación:</b>&nbsp;</ins>' + ' ' + rec.data.Title + '<br/>' + '<ins><b>Fecha inicio:</b>&nbsp;</ins>' +
                            ' ' + rec.data.StartDate.format('d-m-y H:i') + '<br/>' + '<ins><b>Fecha fin:</b>&nbsp;</ins>' +
                            ' ' + rec.data.EndDate.format('d-m-y H:i') + '<br/>' + '<ins><b>Autor:</b>&nbsp;</ins>' +
                            ' ' + rec.data.nombreautor + '<br/>' + '<ins><b>Proyecto al que pertenece:</b>&nbsp;</ins>' +
                            ' ' + rec.data.denomproyecto + '<br/>' + '<ins><b>Hito al que pertenece:</b>&nbsp;</ins>' + ' ' + rec.data.denomhito,
                    trackMouse: true,
                    anchor: 'top'
                });
                _this.selectforrclick = rec;
                var actividadseleccionada = rec;
                //_this.arrayidactividades[0] = actividadseleccionada.data.EventId;

                var arrayidelementos = [];
                arrayidelementos.push({
                    id: actividadseleccionada.data.idelemento,
                    tipo: 10,
                    plantilla: 0,
                    idautor: actividadseleccionada.data.idautor,
                    evento: 0,
                    gradocumplimiento: actividadseleccionada.data.gradocump,
                    denominacion: actividadseleccionada.data.Title,
                    _is_leaf: true
                });
                _this.arrayidactividades = arrayidelementos;

                if (_this.selectforrclick.data.superior == 1) {
                    _this.permitirreasignar = 1;
                } else {
                    _this.permitirreasignar = 0;
                }
            },
            'eventout': function(vw, rec, el) {
                //console.log('Leaving evt rec='+rec.data.Title+', view='+ vw.id +', el='+el.id);
            },
            'eventadd': {
                fn: function(cp, rec) {
                    //this.showMsg('Event '+ rec.data.Title +' was added');
                },
                scope: this
            },
            'eventupdate': {
                fn: function(cp, rec) {
                    //this.showMsg('Event '+ rec.data.Title +' was updated');
                },
                scope: this
            },
            'eventdelete': {
                fn: function(cp, rec) {
                    //this.showMsg('Event '+ rec.data.Title +' was deleted');
                },
                scope: this
            },
            'eventcancel': {
                fn: function(cp, rec) {
                    // edit canceled
                },
                scope: this
            },
            'viewchange': {
                fn: function(p, vw, dateInfo) {
                    if (dateInfo !== null) {
                        //Ext.getCmp('datepicker-calendar').setValue(dateInfo.activeDate);
                        //_this.PostAccionesGestionar();
                    }
                },
                scope: this
            },
            'dayclick': {
                fn: function(vw, dt, ad, el) {
                    var horainicio = dt.format('08:00');
                    var horafin = dt.format('17:00');
                    _this.eshija = 0;
                    var arrayidelementos = [];
                    arrayidelementos.push({
                        id: 0,
                        tipo: 9,
                        plantilla: 0,
                        idautor: 0,
                        evento: 0,
                        gradocumplimiento: 0,
                        denominacion: '',
                        _is_leaf: true
                    });

                    if (_this.permitiradicionar == 1) {
                        _this.objCrudtarea.CrearWinCrudtarea(
                                'Adicionar', _this.padre, _this.PostAccionesGestionar, arrayidelementos, null,
                                _this.idEstructura, dt.format('d/m/Y'), dt.format('d/m/Y'), horainicio,
                                horafin);
                    } else {
                        mostrarMensaje(1, 'Si desea adicionar una nueva tarea debe seleccionar un proyecto o un hito.');
                    }
                },
                scope: this
            },
            'rangeselect': {
                fn: function(win, dates, onComplete) {
                    var fechainicio = dates.StartDate.format('d/m/Y');
                    var fechafin = dates.EndDate.format('d/m/Y');
                    var horainicio = dates.StartDate.format('08:00');
                    var horafin = dates.EndDate.format('17:00');
                    _this.eshija = 0;
                    var arrayidelementos = [];
                    arrayidelementos.push({
                        id: 0,
                        tipo: 9,
                        plantilla: 0,
                        idautor: 0,
                        evento: 0,
                        gradocumplimiento: 0,
                        denominacion: '',
                        _is_leaf: true
                    });

                    if (_this.permitiradicionar == 1) {
                        _this.objCrudtarea.CrearWinCrudtarea(
                                'Adicionar', _this.padre, _this.PostAccionesGestionar, arrayidelementos, null,
                                _this.idEstructura, fechainicio, fechafin, horainicio,
                                horafin);
                    } else {
                        mostrarMensaje(1, 'Si desea adicionar una nueva tarea debe seleccionar un hito.');
                    }
                },
                scope: this
            },
            'eventmove': {
                fn: function(vw, rec) {
                    var newDate = _this.pcalendario.getActiveView().getStartDate();
                    var newView = _this.pcalendario.getActiveView().title;
                    switch (newView) {
                        case 'Semana':
                            {
                                _this.cambiarFechaActividad(rec);
                            }
                            break;
                        case 'D&iacute;a':
                            {
                                _this.cambiarHorarioActividad(rec);
                            }
                            break;
                        case 'Mes':
                            {
                                _this.cambiarFechaActividad(rec);
                            }
                            break;
                    }
                },
                scope: this
            },
            'eventresize': {
                fn: function(vw, rec) {
                    var newDate = _this.pcalendario.getActiveView().getStartDate();
                    var newView = _this.pcalendario.getActiveView().title;
                    switch (newView) {
                        case 'Semana':
                            {
                                _this.cambiarHorarioActividad(rec);
                            }
                            break;
                        case 'D&iacute;a':
                            {
                                _this.cambiarHorarioActividad(rec);
                            }
                            break;
                        case 'Mes':
                            {
                            }
                            break;
                    }
                },
                scope: this
            },
            'eventdelete': {
                fn: function(win, rec) {
                    //this.eventStore.remove(rec);
                    //this.showMsg('Event '+ rec.data.Title +' was deleted');
                },
                scope: this
            },
            'initdrag': {
                fn: function(vw) {
                    //if(this.editWin && this.editWin.isVisible()){
                    //	this.editWin.hide();
                    //console.dir(vw);
                    //}
                },
                scope: this
            }
        }/*, //Aqui termina sin la funcion showEditWindow
         showMsg: function(msg){
         //Ext.fly('app-msg').update(msg).removeClass('x-hidden');
         Ext.Msg.alert('NotificaciÃ³n',msg);
         }*/
    });

    this.ObtenerActividadesVistaCalendario = function(s) {
        //_this.eventStore.removeAll();
        var newDate = _this.pcalendario.getActiveView().getStartDate();
        var newView = _this.pcalendario.getActiveView().title;
        switch (newView) {
            case 'Semana':
                {
                    _this.fechainicio = Ext.encode(aux[0].format('d/m/Y'));
                    _this.fehchafin = Ext.encode(aux[1].format('d/m/Y'));
                }
                break;
            case 'D&iacute;a':
                {
                    _this.fechainicio = Ext.encode(newDate.format('d/m/Y'));
                    _this.fehchafin = Ext.encode(newDate.format('d/m/Y'));
                }
                break;
            case 'Mes':
                {
                    //aux = _this.eventStore.viewmonth.getDateRangeOfMonth(newDate);
                    auxinicio = _this.pcalendario.getActiveView().lastRenderStart;
                    auxfin = _this.pcalendario.getActiveView().lastRenderEnd;
                    _this.fechainicio = Ext.encode(auxinicio.format('d/m/Y'));
                    _this.fehchafin = Ext.encode(auxfin.format('d/m/Y'));
                }
                break;
        }
        _this.eventStore.load({
            params: {
                idcalendario: _this.eventStore.id,
                fechainicio: _this.fechainicio,
                fehchafin: _this.fehchafin
            }
        });
    };

    this.PostAccionesGestionar = function(mensaje, accion) {
        _this.pcalendario.eventStore.reload();
    };

    this.GetRangeDay = function(date_ini, date_end) {
        date_iniold = arr_dates[arr_dates.length - 2]; //obteniendo fecha anterior a la que se modofica en el datefield
        if (date_iniold && date_ini != date_iniold) {
            range_dates = date_iniold.getElapsed(date_end); //obteniendo rango de milisegundos entre fechas
            result_day = range_dates / 1000 / 60 / 60 / 24; //conviertiendolo a dï¿½as
            result_date = date_ini.add(Date.DAY, result_day); //obteniendo nueva fecha dado el rango de dï¿½as
            return result_date;
        } else
            return date_ini;
    };

    this.GetRangeHour = function(hour_ini, hour_end) {
        hour_iniold = arr_hour.pop(); //obteniendo hora anterior a la que se modofica en el TImefield inicio.
        if (hour_iniold && hour_ini != hour_iniold) {
            range_hour = hour_end.getElapsed(hour_iniold);//obteniendo rango de milisegundos entre la hora inicial y final dadas.
            new_hour_end = hour_ini.add(Date.MILLI, range_hour); //cse adiciona la diferencia entre la hora inicial y final a la inicial para obtener nueva hora
            return new_hour_end;
        } else
            return hour_end;
    };

    this.ActualizarFiltrosMes = function() {
        var currentmonth = _this.objCalendario.currentdate.getMonth();
        _this.cbMeses.setValue(currentmonth);
    };

    this.ActualizarFiltrosAnno = function() {
        var currentyear = _this.objCalendario.currentdate.getFullYear();
        _this.nfanno.setValue(currentyear);
    };

    this.ActualizarCalendarioViewMonth = function() {
        var dia = _this.objCalendario.currentdate.getDay();
        var mes = _this.cbMeses.getValue();
        var ano = _this.nfanno.getValue();
        var fechacambiar = new Date(ano, mes, dia);
        _this.objCalendario.viewmonth.headerData.datetouse = fechacambiar;
        _this.objCalendario.currentdate = fechacambiar;
        _this.ObtenerActividadesVistaCalendario();
    };

    this.cambiarHorarioActividad = function(rec) {
        var actividadseleccionada = rec;
        var horainicio = actividadseleccionada.data.StartDate.format('H:i');
        var horafin = actividadseleccionada.data.EndDate.format('H:i');
        if (actividadseleccionada.data.modificar == 1) {
            mostrarMensaje(2, ' Est&aacute; seguro que quiere modificar el horario de esta actividad ? ', function(btnoprimido) {
                if (btnoprimido == 'ok') {
                    _this.BarraProgreso.show('Modificando actividad');
                    Ext.Ajax.request({
                        url: '/planificacion/proyecto/planeacion/index.php/cmpcalendario/modificarHorarioAct',
                        params: {
                            idactividad: actividadseleccionada.data.EventId,
                            horainicio: horainicio,
                            horafin: horafin
                        },
                        callback: function(options, success, response) {
                            _this.BarraProgreso.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 0) {
                                mostrarMensaje(1, 'La actividad que usted quiere modificar ya no se encuentra en los registros.', function() {
                                    _this.PostAccionesGestionar();
                                });
                            }
                            if (responseData.mensaje == 1) {
                                mostrarMensaje(1, 'La actividad ha sido modificada satisfactoriamente.');
                                _this.PostAccionesGestionar();
                            }
                        }
                    });
                } else {
                    _this.PostAccionesGestionar();
                }
            });
        } else
            mostrarMensaje(1, 'Usted no tiene permisos para modificar la actividad.');
    };

    this.cambiarFechaActividad = function(rec) {
        var actividadseleccionada = rec;
        var fechafin = actividadseleccionada.data.EndDate.format('d/m/Y');
        var fechainicio = actividadseleccionada.data.StartDate.format('d/m/Y');
        if (actividadseleccionada.data.modificar == 1) {
            mostrarMensaje(2, ' Est&aacute; seguro que quiere cambiar la actividad para el' + ' ' + fechainicio + ' ' + 'hasta' + ' ' + fechafin + ' ? ', function(btnoprimido) {
                if (btnoprimido == 'ok') {
                    _this.BarraProgreso.show('Modificando actividad');
                    Ext.Ajax.request({
                        url: '/planificacion/proyecto/planeacion/index.php/cmpcalendario/modificarSoloDiasActividad',
                        params: {
                            idtarea: actividadseleccionada.data.EventId,
                            finiact: fechainicio,
                            ffinact: fechafin
                        },
                        callback: function(options, success, response) {
                            _this.BarraProgreso.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 0) {
                                mostrarMensaje(1, 'La actividad que usted quiere modificar ya no se encuentra en los registros.', function() {
                                    _this.PostAccionesGestionar();
                                });
                            }
                            if (responseData.mensaje == 1) {
                                mostrarMensaje(1, 'La actividad ha sido modificada satisfactoriamente.');
                                _this.PostAccionesGestionar();
                            }
                        }
                    });
                } else {
                    //_this.PostAccionesGestionar();
                }
            })
        } else
            mostrarMensaje(1, 'Usted no tiene permisos para modificar la actividad');
    };

    this.CargarCmpCrudCalendario = function() {
        //calendarPanel.setStartDate(new Date().clearTime());
        return _this.pcalendario;
    };

    this.MostrarMenu = function(xy, calx) {
        if (this.menu) {
            this.menu.removeAll();
        }
        if (_this.objcmpmenurelacionesdin) {
            _this.objcmpmenurelacionesdin = null;
        }
        _this.objcmpmenurelacionesdin = new Utilidades.Cmp.CmpMenuRelacionesDinamicas();

        this.menu = new Ext.menu.Menu({
            id: calx.id + '-contextmenu-month', //0.0.6 modified ID
            shadow: true,
            items: [{// added on alpha 0.0.4
                    text: 'Ver datos de la tarea',
                    itemCls: 'x-menu-item icondistra-ver',
                    handler: function() {
                        _this.eshija = 0;
                        _this.objCrudtarea.CrearWinCrudtarea(
                                'Ver datos de la', _this.padre, _this.PostAccionesGestionar,
                                _this.arrayidactividades);
                        _this.selectforrclick = null;
                    }
                }]
        });

        if (_this.selectforrclick.data.eliminar == 1) {
            _this.mieliminar = new Ext.menu.Item({
                text: 'Eliminar actividad',
                itemCls: 'x-menu-item icondistra-eliminar',
                iconCls: 'imagen-none',
                handler: function() {
                    _this.objCrudtarea.EliminarElemento(_this.arrayidactividades, _this.PostAccionesGestionar);
                }
            });
            _this.menu.add(_this.mieliminar);
        }

        if (_this.permitirreasignar == 1) {
            _this.mireasignar = new Ext.menu.Item({
                text: 'Reasignar actividad',
                iconCls: 'cambiar',
                handler: function() {
                    _this.objclasificadorinvol.CrearClasificadorReasignacion(
                            _this.arrayidactividades[0], tipoelemento = 3,
                            _this.PostAccionesGestionar);
                    _this.selectforrclick = null;
                }
            });
            _this.menu.add(_this.mireasignar);
        }

        if (_this.selectforrclick.data.eliminar == 1) {
            _this.actualizar100 = new Ext.menu.Item({
                text: 'Actualizar tarea al 100% de cumplimiento',
                itemCls: 'x-menu-item icondistra-bandera sipac-verde',
                iconCls: 'imagen-none',
                handler: function() {
                    _this.actualizarCumplimiento(1);
                }
            });
            _this.menu.add(_this.actualizar100);
        }

        if (_this.selectforrclick.data.eliminar == 1) {
                _this.otrovalor = new Ext.menu.Item({
                text: 'Actualizar % cumplimiento de la tarea',
                itemCls: 'x-menu-item icondistra-bandera sipac-amarilla',
                iconCls: 'imagen-none',
                handler: function() {
                    _this.actualizarCumplimiento(2);
                }
            });
            _this.menu.add(_this.otrovalor);
        }

        /*_this.miduplicar = new Ext.menu.Item({
         text: 'Duplicar actividad',
         itemCls: 'x-menu-item icondistra-duplicar',
         iconCls: 'imagen-none',
         handler: function() {
         _this.objCrudActividad.AnalizarProcesoDuplicado(
         _this.selectforrclick.data,
         _this.PostAccionesGestionar,
         _this.arrayidactividades,
         _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales());
         }
         });
         _this.menu.add(_this.miduplicar);*/
        this.menu.showAt(xy);
    };

    onContextMenuFunction = function(event, elx, obx) {
        event.stopEvent();
        if (elx.id.indexOf("-evt") != -1)
        {
            _this.MostrarMenu(event.xy, elx);
        }


    };

    this.AccionesPostEjecutarFT = function() {
        _this.arrayidactividades = [];
        //_this.pcalendario.eventStore.reload();
        //_this.ActualizarEstadoBarraHerramientas();
    };

    this.CrearRelaciones = function() {
        _this.eshija = 0;
        /*_this.objCrudActividad.CrearWinCrudActividades(
         new Date().format('d/m/Y'), new Date().format('d/m/Y'),
         _this.horainicio, _this.horafin, 'Relacionar elementos a la',
         _this.PostAccionesGestionar, _this.arrayidactividades,
         null, 0, permisomodificar = 1, permisoeliminar = 1,
         _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales());*/
    }

    this.actualizarCumplimiento = function(metodo) {
        var msj = '', msjError = '', msjAnteceden = '', msjAntecedentes = '';

        msj = 'La tarea ha sido actualizada satisfactoriamente.';
        msjError = 'La tarea no ha sido actualizada.';
        msjAntecedentes = 'La tarea a la que quiere dar cumplimiento depende de otras que la anteceden y no están cumplidas. ¿Desea darle cumplimiento a todas?';

        if (metodo == 1) {
            this.BarraProgreso.show('Actualizando cumplimiento...');
            Ext.Ajax.request({
                url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/actualizarCumplimiento',
                params: {
                    arrayidtareas: Ext.encode(_this.arrayidactividades),
                    metodo: metodo
                },
                callback: function(options, success, response) {
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.respuesta == 1) {
                        mostrarMensaje(1, msj);
                        _this.PostAccionesGestionar();
                        /*_this.socketEvents.emit("actualizarPorcientoCumplimiento", responseData.arrayidTareas);
                         _this.socketEvents.on('validarIncumplimiento', function(fecha_hora_server) {
                         _this.objCmpPert.validarIncumplimiento(fecha_hora_server);
                         });*/
                        //_this.accionesPostActualizarCumplimiento(1);
                    }
                    if (responseData.respuesta == 3) {
                        mostrarMensaje(1, msjError);
                        //_this.accionesPostActualizarCumplimiento(0);
                    }
                    if (responseData.respuesta == 0) {
                        mostrarMensaje(1, msjAntecedentes);
                    }
                }
            });
        } else {
            if (_this.winActualizarCumplimiento) {
                _this.winActualizarCumplimiento.destroy();
            }
            _this.winActualizarCumplimiento = new Ext.Window({
                title: 'Actualizar Cumplimiento',
                width: 200,
                height: 130,
                modal: true,
                buttons: [
                    {
                        handler: function() {
                            _this.winActualizarCumplimiento.destroy();
                        },
                        iconCls: 'cancelar',
                        text: 'Cancelar',
                        tooltip: ''
                    }, {
                        handler: function() {
                            _this.BarraProgreso.show('Actualizando cumplimiento...');
                            Ext.Ajax.request({
                                url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/actualizarCumplimiento',
                                params: {
                                    arrayidtareas: Ext.encode(_this.arrayidactividades),
                                    cumplimiento: Ext.get('_nfActCumplimiento').getValue(),
                                    metodo: metodo
                                },
                                callback: function(options, success, response) {
                                    _this.BarraProgreso.hide();
                                    responseData = Ext.decode(response.responseText);
                                    if (responseData.respuesta == 1) {
                                        mostrarMensaje(1, msj);
                                        //_this.socketEvents.emit("actualizarPorcientoCumplimiento", responseData.arrayidTareas);
                                        _this.winActualizarCumplimiento.destroy();
                                        _this.PostAccionesGestionar();
                                        //_this.accionesPostActualizarCumplimiento(1);
                                    }
                                    if (responseData.respuesta == 3) {
                                        mostrarMensaje(1, msjError);
                                        //_this.accionesPostActualizarCumplimiento(0);
                                    }
                                    if (responseData.respuesta == 0) {
                                        _this.winActualizarCumplimiento.destroy();
                                        mostrarMensaje(1, msjAntecedentes);
                                    }
                                }
                            });
                        },
                        iconCls: 'aceptar',
                        text: 'Aceptar',
                        tooltip: ''
                    }
                ],
                items: [
                    new Ext.FormPanel({
                        labelAlign: 'top',
                        frame: true,
                        items: [
                            new Ext.form.NumberField({
                                fieldLabel: 'Porciento de cumplimiento',
                                id: '_nfActCumplimiento',
                                maxValue: 100,
                                maxText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
                                allowBlank: false,
                                anchor: '90%'
                            })
                        ]
                    })
                ]
            });
            _this.winActualizarCumplimiento.show();
        }
    };
};


    