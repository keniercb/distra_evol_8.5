Utilidades.Cmp.Cmpcrudcalendario = function (opcionesConfig) {



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
    this.prevrowrep = -1;
    this.vistaxdefecto = 2;
    this.contadorid = 0;
    this.radioChekiado = 1;
    this.superior = 0;
    var existecalendariobusqueda = 0;
    this.idconfiguracion = null;
    this.busqueda = opcionesConfig.busqueda;

    this.arraycategoriasactividad = [];

    //console.log(_this.busqueda);

    var existecalpersonal = 0;
    this.arraycalendariosexistentes = [];
    var arr_dates = [];
    var arr_hour = [];
    //objeto CRUD-ACTIVIDADES inicializado
    this.objCrudActividad = new Utilidades.Cmp.Cmpcrudactividades();

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();
    //this.objclasificadorinvolrepeticiones = new Utilidades.Cmp.Cmpclasificadorinvol();

    //objeto del componente "relaciones"
    this.objcmprelaciones = new Utilidades.Cmp.Cmprelaciones();
    //this.objcmpcalendario = new Utilidades.Cmp.Cmpcalendario("local");

    //validacion de fechas
    Ext.apply(Ext.form.VTypes, {
        rangodefechas: function (val, field) {
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

    this.getConfiguracionPerfil = function (parametros) {
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpcalendarionuevo/cargarcalendariosiniciales',
            params: {
                idconfiguracion: parametros.idconfiguracion,
                actual: parametros.actual
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData[0] != undefined && responseData[0].idvistaxdefecto) {
                    _this.vistaxdefecto = parseInt(responseData[0].idvistaxdefecto);

                    switch (_this.vistaxdefecto) {
                        case 1:
                            _this.vistaxdefecto=2;
                            break;
                        case 2:
                            _this.vistaxdefecto=1;
                        break;
                        case 3:
                            _this.vistaxdefecto=0;
                        break;

                        default:{
                            _this.vistaxdefecto=2;
                        }
                    }

                    _this.pcalendario.setActiveView(_this.vistaxdefecto);
                } else
                    _this.pcalendario.setActiveView(2);

                if(responseData[0].idcategoriaactividad!=null && responseData[0].idcategoriaactividad!=undefined){
                    var elemento = new Object;
                    elemento.idcategoria = responseData[0].idcategoriaactividad;
                    _this.arraycategoriasactividad.push(elemento);

                    var start = _this.eventStore.baseParams.start;
                    var end = _this.eventStore.baseParams.end;
                    _this.eventStore.reload({
                        params: {
                            actual: responseData[0].actual,
                            start: start,
                            end: end,
                            arraycategoriasact:_this.arraycategoriasactividad
                        }
                    });
                }

                if (parametros.idconfiguracion) {
                    _this.idconfiguracion = parametros.idconfiguracion;
                    var start = _this.eventStore.baseParams.start;
                    var end = _this.eventStore.baseParams.end;
                    _this.eventStore.reload({
                        params: {
                            idconfiguracion: _this.idconfiguracion,
                            actual: parametros.actual,
                            start: start,
                            end: end
                        }
                    });
                }
            }
        });
    };

    this.ObtenerCategoriasActividad = function () {
        var arraycategoriasact = [];
        var arraycategact = opcionesConfig.smtgcategact.getSelections();
        var totalreccategact = arraycategact.length;
        for (var i = 0; i < totalreccategact; i++) {
            var elemento = new Object;
            elemento.idcategoria = arraycategact[i].data.idnom;
            arraycategoriasact.push(elemento);
            if (arraycategact[i].data._is_leaf == false) {
                opcionesConfig.tgcategact.getStore().each(function (record) {
                    if (record.data._parent == arraycategact[i].data.idnom) {
                        var elemento2 = new Object;
                        elemento2.idcategoria = arraycategact[i].data.idnom;
                        arraycategoriasact.push(elemento2);
                    }
                });
            }
        }
        return arraycategoriasact;//(arraycategoriasact.length!=0)?arraycategoriasact:null;
    };

    this.ObtenerTipoActividad = function () {
        var arraytipoact = [];
        var arraytipoactiv = opcionesConfig.smtgtipoact.getSelections();
        var totalrectipoact = arraytipoactiv.length;
        for (var i = 0; i < totalrectipoact; i++) {
            var elemento = new Object;
            elemento.idtipoactividad = arraytipoactiv[i].data.idnom;
            arraytipoact.push(elemento);

            if (arraytipoactiv[i].data._is_leaf == false) {
                opcionesConfig.tgtipoact.getStore().each(function (record) {
                    if (record.data._parent == arraytipoactiv[i].data.idnom) {
                        var elemento2 = new Object;
                        elemento2.idtipoactividad = arraytipoactiv[i].data.idnom;
                        arraytipoact.push(elemento2);
                    }
                });
            }
        }
        return arraytipoact;
    };


    this.ObtenerActividadesVistaCalendario = function (s) {
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

    this.PostAccionesGestionar = function (mensaje, accion) {
        //if(accion!='Eliminar')
        _this.pcalendario.eventStore.reload();
        // _this.ObtenerActividadesVistaCalendario();      
    };

    //
    this.GetRangeDay = function (date_ini, date_end) {
        date_iniold = arr_dates[arr_dates.length - 2]; //obteniendo fecha anterior a la que se modofica en el datefield
        if (date_iniold && date_ini != date_iniold) {
            range_dates = date_iniold.getElapsed(date_end); //obteniendo rango de milisegundos entre fechas
            result_day = range_dates / 1000 / 60 / 60 / 24; //conviertiendolo a dï¿½as
            result_date = date_ini.add(Date.DAY, result_day); //obteniendo nueva fecha dado el rango de dï¿½as
            return result_date;
        } else
            return date_ini;
    };
    //
    this.GetRangeHour = function (hour_ini, hour_end) {
        hour_iniold = arr_hour.pop(); //obteniendo hora anterior a la que se modofica en el TImefield inicio.
        if (hour_iniold && hour_ini != hour_iniold) {
            range_hour = hour_end.getElapsed(hour_iniold);//obteniendo rango de milisegundos entre la hora inicial y final dadas.
            new_hour_end = hour_ini.add(Date.MILLI, range_hour); //cse adiciona la diferencia entre la hora inicial y final a la inicial para obtener nueva hora
            return new_hour_end;
        } else
            return hour_end;
    };

    this.ActualizarFiltrosMes = function () {
        var currentmonth = _this.objCalendario.currentdate.getMonth();
        _this.cbMeses.setValue(currentmonth);
    };

    this.ActualizarFiltrosAnno = function () {
        var currentyear = _this.objCalendario.currentdate.getFullYear();
        _this.nfanno.setValue(currentyear);
    };

    this.ActualizarCalendarioViewMonth = function () {
        var dia = _this.objCalendario.currentdate.getDay();
        var mes = _this.cbMeses.getValue();
        var ano = _this.nfanno.getValue();
        var fechacambiar = new Date(ano, mes, dia);
        _this.objCalendario.viewmonth.headerData.datetouse = fechacambiar;
        _this.objCalendario.currentdate = fechacambiar;
        _this.ObtenerActividadesVistaCalendario();
    };

    //store del calendario de eventos donde se cargan las actividades
    this.eventStore = new Ext.data.JsonStore({
        id: 'eventStore',
        url: '/planificacion/pdo/plan/index.php/cmpcalendarionuevo/CargarElementosCal',
        root: 'data',
        listeners: {
            beforeload: function (st, conf) {
                _this.BarraProgreso.show('Cargando actividades en el calendario');
                st.baseParams.personal = 1;
                st.baseParams.busqueda = 0;
                st.baseParams.idcalendario = _this.idcalendario;
                //st.baseParams.idconfiguracion = _this.idconfiguracion;
                st.baseParams.start = conf.params.start;
                st.baseParams.end = conf.params.end;
                //st.baseParams.arrayautores = Ext.encode(_this.objclasificadorinvol.ObtenerAutoresBusqueda());
                //st.baseParams.arrayinvolucrados = Ext.encode(_this.objclasificadorinvol.ObtenerInvolucradosBusqueda());

                var ObtenerCategoriasActividad=_this.ObtenerCategoriasActividad();

                st.baseParams.arraycategoriasact = (ObtenerCategoriasActividad.length==0)?Ext.encode(_this.arraycategoriasactividad):Ext.encode(ObtenerCategoriasActividad);
                st.baseParams.arraytiposact = Ext.encode(_this.ObtenerTipoActividad());
                st.baseParams.arrayelementostributa = Ext.encode(_this.objcmprelaciones.ObtenerElementosRelacionadosIniciales());
                st.baseParams.guardarCal = conf.params.guardarCal;
            },
            load: function (st, conf) {
                _this.BarraProgreso.hide();
                if (st.getCount() == 0) {
                    if (st.lastOptions.params.busqueda == 0) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                    }
                }
            },
            loadexception: function () {
                _this.BarraProgreso.hide();
            }
        },
        autoLoad: false,
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
                name: 'idautor'
            }],
        sortInfo: {
            field: 'StartDate',
            direction: 'ASC'
        }
    });
    _this.getConfiguracionPerfil({actual: 1, idconfiguracion: null});


    this.pcalendario = new Ext.calendar.CalendarPanel({
        title: opcionesConfig.titulo,
        id: opcionesConfig.id,
        eventStore: _this.eventStore,
        border: true,
        region: 'center',
        dateFormat: "y-m-d",
        timeFormat: "H:i",
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
        initComponent: function () {
            this.constructor.prototype.initComponent.apply(this, arguments);
        },
        listeners: {
            'eventclick': {
                fn: function (vw, rec, el) {
                    var actividadseleccionada = rec;
                    var arrayidactividades = [];
                    var idautor = actividadseleccionada.data.idautor;
                    arrayidactividades[0] = actividadseleccionada.data.EventId;
                    _this.eshija = 0;
                    _this.objCrudActividad.CrearWinCrudActividades(rec.data.StartDate.format('m/d/y'), rec.data.EndDate.format('m/d/y'),
                        rec.data.StartDate.format('H:i'), rec.data.EndDate.format('H:i'), 'Modificar', _this.PostAccionesGestionar, arrayidactividades,
                        idautor, _this.eshija, permisomodificar = 1, permisoeliminar = 1, _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(), null, _this.calendarStore, true);

                }
            },
            'eventover': function (vw, rec, el) {
                new Ext.ToolTip({
                    target: el,
                    html: '<ins><b>Denominación:</b>&nbsp;</ins>' + rec.data.Title + '<br/>'
                    + 'Fecha inicio:&nbsp;' + rec.data.StartDate.format('d-m-y H:i') + '<br/>'
                    + 'Fecha fin:&nbsp;' + rec.data.EndDate.format('d-m-y H:i'),
                    trackMouse: true,
                    anchor: 'top'
                });
                _this.selectforrclick = rec;
                var actividadseleccionada = rec;
                _this.arrayidactividades[0] = actividadseleccionada.data.EventId;
                if (_this.selectforrclick.data.superior == 1) {
                    _this.permitirreasignar = 1;
                } else {
                    _this.permitirreasignar = 0;
                }
            },
            'eventadd': {
                fn: function (cp, rec) {
                    //this.showMsg('Event '+ rec.data.Title +' was added');
                },
                scope: this
            },
            'eventupdate': {
                fn: function (cp, rec) {
                    //this.showMsg('Event '+ rec.data.Title +' was updated');
                },
                scope: this
            },
            'eventdelete': {
                fn: function (cp, rec) {
                    //this.showMsg('Event '+ rec.data.Title +' was deleted');
                },
                scope: this
            },
            'eventcancel': {
                fn: function (cp, rec) {
                    // edit canceled
                },
                scope: this
            },
            'viewchange': {
                fn: function (p, vw, dateInfo) {
                    if (dateInfo !== null) {
                        Ext.getCmp('datepicker-calendar').setValue(dateInfo.activeDate);
                        _this.PostAccionesGestionar();
                    }
                },
                scope: this
            },
            'dayclick': {
                fn: function (vw, dt, ad, el) {
                    var horafin = dt.format('17:00');
                    var options = {hour12: false, hour: '2-digit', minute: '2-digit'};
                    //var horainicio = dt.toLocaleTimeString('es-ES', options);
                    var horainicio = dt.format('H:i');
                    horainicio = (horainicio == '00:00') ? dt.format('08:00') : horainicio;
                    _this.eshija = 0;
                    _this.objCrudActividad.CrearWinCrudActividades(
                        dt.format('d/m/Y'), dt.format('d/m/Y'), horainicio,
                        horafin, 'Adicionar', _this.PostAccionesGestionar,
                        arrayidactividades = [], null, _this.eshija,
                        permisomodificar = 1, permisoeliminar = 1,
                        _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                        null, null, true);
                },
                scope: this
            },
            'rangeselect': {
                fn: function (win, dates, onComplete) {
                    var fechainicio = dates.StartDate.format('d/m/Y');
                    var fechafin = dates.EndDate.format('d/m/Y');
                    var options = {hour12: false, hour: '2-digit', minute: '2-digit'};
                    //var horainicio = dates.StartDate.toLocaleTimeString('es-ES', options);
                    var horainicio = dates.StartDate.format('H:i');
                    horainicio = (horainicio == '00:00') ? dates.StartDate.format('08:00') : horainicio;
                    var horafin = dates.EndDate.format('H:i');
                    var vista = _this.pcalendario.getActiveView().title;
                    (vista == 'Mes') ? horafin = dates.EndDate.format('17:00') : null;
                    _this.eshija = 0;
                    _this.objCrudActividad.CrearWinCrudActividades(fechainicio, fechafin, horainicio,
                        horafin, 'Adicionar', _this.PostAccionesGestionar, arrayidactividades = [], null, _this.eshija,
                        permisomodificar = 1, permisoeliminar = 1, _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(), null, null, true);
                },
                scope: this
            },
            'eventmove': {
                fn: function (vw, rec) {
                    var newDate = _this.pcalendario.getActiveView().getStartDate();
                    var newView = _this.pcalendario.getActiveView().title;
                    switch (newView) {
                        case 'Semana':
                        {
                            _this.cambiarHorarioFechaActividad(rec);
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
                fn: function (vw, rec) {
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
                fn: function (win, rec) {
                    //this.eventStore.remove(rec);
                    //this.showMsg('Event '+ rec.data.Title +' was deleted');
                },
                scope: this
            },
            'initdrag': {
                fn: function (vw) {
                    //if(this.editWin && this.editWin.isVisible()){
                    //	this.editWin.hide();
                    //}
                },
                scope: this
            }
        }
    });


    this.cambiarHorarioActividad = function (rec) {
        var actividadseleccionada = rec;
        var horainicio = actividadseleccionada.data.StartDate.format('H:i');
        var horafin = actividadseleccionada.data.EndDate.format('H:i');
        if (actividadseleccionada.data.modificar == 1) {
            mostrarMensaje(2, ' ¿Est&aacute; seguro que quiere modificar el horario de esta actividad?', function (btnoprimido) {
                if (btnoprimido == 'ok') {
                    _this.BarraProgreso.show('Modificando actividad');
                    Ext.Ajax.request({
                        url: '/planificacion/pdo/plan/index.php/cmpcalendarionuevo/modificarHorarioAct',
                        params: {
                            idactividad: actividadseleccionada.data.EventId,
                            horainicio: horainicio,
                            horafin: horafin
                        },
                        callback: function (options, success, response) {
                            _this.BarraProgreso.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 0) {
                                mostrarMensaje(1, 'La actividad que usted quiere modificar ya no se encuentra en los registros.', function () {
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

    this.cambiarFechaActividad = function (rec) {
        var actividadseleccionada = rec;
        var fechafin = actividadseleccionada.data.EndDate.format('d/m/Y');
        var fechainicio = actividadseleccionada.data.StartDate.format('d/m/Y');
        if (actividadseleccionada.data.modificar == 1) {
            mostrarMensaje(2, ' ¿Est&aacute; seguro que quiere cambiar la actividad para el' + ' ' + fechainicio + ' ' + 'hasta el' + ' ' + fechafin + '?', function (btnoprimido) {
                if (btnoprimido == 'ok') {
                    _this.BarraProgreso.show('Modificando actividad');
                    Ext.Ajax.request({
                        url: '/planificacion/pdo/plan/index.php/cmpcalendarionuevo/modificarSoloDiasActividad',
                        params: {
                            idactividad: actividadseleccionada.data.EventId,
                            finiact: fechainicio,
                            ffinact: fechafin
                        },
                        callback: function (options, success, response) {
                            _this.BarraProgreso.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 0) {
                                mostrarMensaje(1, 'La actividad que usted quiere modificar ya no se encuentra en los registros.', function () {
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
            })
        } else
            mostrarMensaje(1, 'Usted no tiene permisos para modificar la actividad');
    };

    this.cambiarHorarioFechaActividad = function (rec) {
        var actividadseleccionada = rec;
        var fechafin = actividadseleccionada.data.EndDate.format('d/m/Y');
        var fechainicio = actividadseleccionada.data.StartDate.format('d/m/Y');
        var horainicio = actividadseleccionada.data.StartDate.format('H:i');
        var horafin = actividadseleccionada.data.EndDate.format('H:i');
        if (actividadseleccionada.data.modificar == 1) {
            mostrarMensaje(2, ' ¿Est&aacute; seguro que quiere modificar el horario y/o fecha de esta actividad?', function (btnoprimido) {
                if (btnoprimido == 'ok') {
                    _this.BarraProgreso.show('Modificando actividad');
                    Ext.Ajax.request({
                        url: '/planificacion/pdo/plan/index.php/cmpcalendarionuevo/modificarHorarioFechaActividad',
                        params: {
                            idactividad: actividadseleccionada.data.EventId,
                            horainicio: horainicio,
                            horafin: horafin,
                            fechafin: fechafin,
                            fechainicio: fechainicio
                        },
                        callback: function (options, success, response) {
                            _this.BarraProgreso.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 0) {
                                mostrarMensaje(1, 'La actividad que usted quiere modificar ya no se encuentra en los registros.', function () {
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

    this.CargarCmpCrudCalendario = function () {
        return _this.pcalendario;
    };

    this.MostrarMenu = function (xy, calx) {
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
                text: 'Ver datos de la actividad',
                itemCls: 'x-menu-item icondistra-ver',
                handler: function () {
                    _this.eshija = 0;
                    _this.objCrudActividad.CrearWinCrudActividades(
                        new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                        _this.horainicio, _this.horafin, 'Ver datos de la',
                        _this.PostAccionesGestionar, _this.arrayidactividades,
                        _this.selectforrclick.data.idautor, _this.eshija,
                        permisomodificar = 1, permisoeliminar = 1,
                        _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales(),
                        _this.smTGCmpActividades, null, true);
                    _this.selectforrclick = null;
                }
            }]
        });

        if (_this.selectforrclick.data.eliminar == 1) {
            _this.mieliminar = new Ext.menu.Item({
                text: 'Eliminar actividad',
                itemCls: 'x-menu-item icondistra-eliminar',
                iconCls: 'imagen-none',
                handler: function () {
                    _this.objCrudActividad.EliminarActividades(
                        _this.arrayidactividades,
                        _this.PostAccionesGestionar,
                        null, null, true);
                }
            });
            _this.menu.add(_this.mieliminar);
        }

        if (_this.permitirreasignar == 1) {
            _this.mireasignar = new Ext.menu.Item({
                text: 'Reasignar actividad',
                iconCls: 'cambiar',
                handler: function () {
                    _this.objclasificadorinvol.CrearClasificadorReasignacion(
                        _this.arrayidactividades[0], tipoelemento = 3,
                        _this.PostAccionesGestionar);
                    _this.selectforrclick = null;
                }
            });
            _this.menu.add(_this.mireasignar);
        }
        _this.miduplicar = new Ext.menu.Item({
            text: 'Duplicar actividad',
            itemCls: 'x-menu-item icondistra-duplicar',
            iconCls: 'imagen-none',
            handler: function () {
                _this.objCrudActividad.AnalizarProcesoDuplicado(
                    _this.selectforrclick.data,
                    _this.PostAccionesGestionar,
                    _this.arrayidactividades,
                    _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales());
            }
        });
        _this.menu.add(_this.miduplicar);
        if (_this.selectforrclick.data.subordinado == 1) {
            var mensaje = 'No existen otros estados al cual usted pueda cambiar la actividad desde el estado actual.';

            if (_this.mdiaprobacion) {
                _this.mdiaprobacion.destroy();
            }
            _this.mdiaprobacion = new Ext.menu.Item({
                text: 'Cambiar el estado de aprobaci&oacute;n a',
                itemCls: 'x-menu-item icondistra-cambiodestado',
                iconCls: 'imagen-none',
                hideOnClick: false,
                id: 'cam-estado',
                menu: _this.objcmpmenurelacionesdin.menuinicial,
                listeners: {
                    render: function (el) {
                        _this.objcmpmenurelacionesdin.CrearMenuAprobacionConc(
                            _this.AccionesPostEjecutarFT, mensaje,
                            null, _this.menu, _this.arrayidactividades,
                            _this.selectforrclick.data.idestadoaprob, 3
                        );
                    }
                }
            });
            _this.menu.add(_this.mdiaprobacion);
        }
        this.menu.showAt(xy);
    };

    onContextMenuFunction = function (event, elx, obx) {
        event.stopEvent();
        if (elx.id.indexOf("-evt") != -1) {
            _this.MostrarMenu(event.xy, elx);
        }
    };

    this.AccionesPostEjecutarFT = function () {
        _this.arrayidactividades = [];
        _this.pcalendario.eventStore.reload();
    };

    this.CrearRelaciones = function () {
        _this.eshija = 0;
        _this.objCrudActividad.CrearWinCrudActividades(
            new Date().format('d/m/Y'), new Date().format('d/m/Y'),
            _this.horainicio, _this.horafin, 'Relacionar elementos a la',
            _this.PostAccionesGestionar, _this.arrayidactividades,
            null, 0, permisomodificar = 1, permisoeliminar = 1,
            _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales());
    }
};


    