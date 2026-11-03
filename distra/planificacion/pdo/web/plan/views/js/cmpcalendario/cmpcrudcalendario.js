Utilidades.Cmp.Cmpcrudcalendario = function () {
    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.eshija = 0;
    this.arrayidactividades = [];
    this.arrayrepeticionesseleccionadas = [];
    this.arrayidactrep = [];
    this.prevrowrep = -1;
    this.contadorid = 0;
    this.radioChekiado = 1;
    this.superior = 0;
    var existecalendariobusqueda = 0;
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
    this.objclasificadorinvolrepeticiones = new Utilidades.Cmp.Cmpclasificadorinvol();

    //objeto del componente "relaciones"
    this.objcmprelaciones = new Utilidades.Cmp.Cmprelaciones();

    //validacion de fechas
    Ext.apply(Ext.form.VTypes, {
        rangodefechas: function (val, field) {
            var date = field.parseDate(val);

            if (!date) {
                return;
            }
            if (field.endDateField) {
                var end = Ext.getCmp(field.endDateField);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
                arr_dates.push(date); //arreglo temporal que almacena las fechas que se seleccionan en el datefield inicio
                date = _this.GetRangeDay(date, end.getValue())//permite respetar fecha final a partir de una fecha inicial dado un rango de dias.
                end.setValue(date);
                /*var end = Ext.getCmp(field.endDateField);
                 end.setMinValue(date);
                 end.validate();*/
            }
            return true;
        }
    });

    var tmptest = new Ext.ECalendar({});
    var weekrange = tmptest.getDateRangeOfWeekByDate(0, new Date());

    this.CrearObjCalendario = function (personal, busqueda, nodogenerador, objclasificadorinvolautor, smtgcategact,
                                        smtgtipoact, objcmprelaciones) {
        _this.personal = 0;
        _this.busqueda = 0;
        _this.busquedaefectuada = 0;
        //console.log(nodogenerador);
        if (!nodogenerador) {
            if (personal) {
                _this.personal = 1;
                _this.idcalendario = 'personal';
                _this.titulocalendario = 'Calendario Personal';
                _this.iconCls = 'x-cmscalendar-icon-main';
                _this.closable = false;
            } else {
                _this.busqueda = 1;
                _this.idcalendario = 'busqueda';
                _this.titulocalendario = 'Calendario de B&uacute;squedas';
                _this.iconCls = 'x-cmscalendar-icon-busqueda';
                //_this.iconCls = 'buscar';
                _this.closable = false;
            }
        } else {
            _this.idcalendario = nodogenerador.attributes.idusuario;
            _this.titulocalendario = 'Calendario de ' + nodogenerador.text;
            _this.closable = true;
        }
        _this.objclasificadorinvolautor = objclasificadorinvolautor;
        _this.smtgcategact = smtgcategact;
        _this.smtgtipoact = smtgtipoact;
        _this.objcmprelaciones = objcmprelaciones;
        _this.annos = _this.CrearAnnos();
        _this.storeNfanno = new Ext.data.SimpleStore({
            fields: ['idanno', 'anno'],
            data: _this.annos
        });
        _this.storeMeses = new Ext.data.SimpleStore({
            fields: ['idmes', 'mes'],
            data: [
                ["0", 'Enero'],
                ["1", "Febrero"],
                ["2", "Marzo"],
                ["3", "Abril"],
                ["4", "Mayo"],
                ["5", "Junio"],
                ["6", "Julio"],
                ["7", "Agosto"],
                ["8", "Septiembre"],
                ["9", "Octubre"],
                ["10", "Noviembre"],
                ["11", "Diciembre"]
            ]
        });
        _this.cbNfanno = new Ext.form.ComboBox({
            id: 'cbnfanno_' + _this.idcalendario,
            name: 'cbnfanno_' + _this.idcalendario,
            store: this.storeNfanno,
            displayField: 'anno',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            hiddenName: 'idanno',
            valueField: 'idanno',
            width: 150,
            emptyText: 'Año',
            disabled: false,
            enableKeyEvents: true,
            listeners: {
                render: function (cb) {
                    _this.ActualizarFiltrosAnno();
                },
                select: function () {
                    _this.ActualizarCalendarioViewMonth();
                }
            }
        });

        //combo de mese
        _this.cbMeses = new Ext.form.ComboBox({
            id: 'cbmeses_' + _this.idcalendario,
            name: 'cbmeses_' + _this.idcalendario,
            store: this.storeMeses,
            displayField: 'mes',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            hiddenName: 'idmes',
            valueField: 'idmes',
            width: 150,
            emptyText: 'Mes',
            disabled: false,
            enableKeyEvents: true,
            listeners: {
                render: function (cb) {
                    _this.ActualizarFiltrosMes();
                },
                select: function () {
                    // alert('entre');
                    _this.ActualizarCalendarioViewMonth();
                }
            }
        });

        _this.reader = new Ext.data.JsonReader({
            root: "data",
            id: "id"
        }, [
            {
                name: 'id',
                type: 'int'
            }, {
                name: 'subject',
                type: 'string'
            }, {
                name: 'description',
                type: 'string'
            }, {
                name: 'startdate',
                type: 'string'
            }, {
                name: 'enddate',
                type: 'string'
            }, {
                name: 'color',
                type: 'string'
            }, {
                name: 'categoria',
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
                name: 'idautor'
            }
        ]);

        _this.objCalendario = new Ext.ECalendar({
            id: _this.idcalendario,
            region: 'center',
            name: _this.idcalendario,
            title: _this.titulocalendario,
            border: false,
            closable: _this.closable,
            showCal_tbar: true,
            tbar_add_button: new Ext.Button({
                disabled: false,
                iconCls: 'buscaravanzada',
                tooltip: 'B&uacute;squeda avanzada',
                handler: function () {
                    Ext.getCmp('pbusq').toggleCollapse(true);
                }
            }),

            tbar_filtro_mes: _this.cbMeses,
            tbar_filtro_anno: _this.cbNfanno,

            showRefreshbtn: true,
            refreshAction: 'data',
            currentView: 'month',
            fieldsRefer: {
                id: 'id',
                subject: 'subject',
                description: 'description',
                color: 'color',
                startdate: 'startdate',
                enddate: 'enddate'
            },
            storeOrderby: 'priority',
            storeOrder: 'DESC',
            currentdate: new Date(),
            dateSelector: true,
            dateSelectorIcon: '../../views/css/cmpcalendario/images/date.png',
            dateSelectorIconCls: 'x-cmscalendar-icon-date-selector',
            dateformat: 'd-m-Y',
            iconCls: _this.iconCls,
            store: new Ext.data.Store({
                url: '/planificacion/pdo/plan/index.php/cmpcalendario/cargarelementoscalendario',
                reader: _this.reader,
                //autoLoad:true,
                listeners: {
                    beforeload: function (st, conf) {
                        _this.BarraProgreso.show('Cargando actividades en el calendario');
                        st.removeAll();
                        _this.objCalendario.refreshCalendarView();
                        st.baseParams.personal = _this.personal;
                        st.baseParams.busqueda = _this.busqueda;
                        st.baseParams.idcalendario = _this.idcalendario;
                        st.baseParams.arrayautores = Ext.encode(_this.objclasificadorinvolautor.ObtenerAutoresBusqueda());
                        st.baseParams.arrayinvolucrados = Ext.encode(_this.objclasificadorinvolautor.ObtenerInvolucradosBusqueda());
                        st.baseParams.arraycategoriasact = Ext.encode(_this.ObtenerCategoriasActividad());
                        st.baseParams.arraytiposact = Ext.encode(_this.ObtenerTipoActividad());
                        st.baseParams.arrayelementostributa = Ext.encode(_this.objcmprelaciones.ObtenerElementosRelacionadosIniciales());
                    },
                    load: function (st, conf) {
                        _this.objCalendario.refreshCalendarView();
                        _this.BarraProgreso.hide();
                    },
                    loadexception: function () {
                        _this.BarraProgreso.hide();
                    }
                }
            }),
            monitorBrowserResize: true,
            widgetsBind: {
                bindMonth: null,
                bindDay: null,
                binWeek: null
            },
            tipmaxLength: 1000,
            tplTaskTip: new Ext.XTemplate(
                '<tpl for=".">{location}<br />{starxl}{startval}<br/>{endxl}{endval}<hr color=\'#003366\'noshade><br/>{details}</tpl>'
            ),
            tplTaskZoom: new Ext.XTemplate
            (
                '<tpl for=".">',
                '<div class="ecal-show-basetasktpl-div">Task:{subject}<br>',
                'Location:{location}<br />',
                'Starts:{startdate}<br>Ends:{enddate}<br>Description:<br>{description}<div><hr>',
                '</tpl>'
            ),
            iconToday: '../../views/css/cmpcalendario/images/cms_calendar.png',
            iconMonthView: '../../views/css/cmpcalendario/images/calendar_view_month.png',
            iconWeekView: '../../views/css/cmpcalendario/images/calendar_view_week.png',
            iconDayView: '../../views/css/cmpcalendario/images/calendar_view_day.png',
            iconSchedView: '../../views/css/cmpcalendario/images/calendar_view_schedule.png',

            mview: {
                header: true,
                headerFormat: 'F-Y',
                headerButtons: true,
                headerUseTpl: true,
                headerTpl: new Ext.XTemplate('<tpl for=".">{title} - {datetouse:this.fmtfecha}</tpl>',
                    {
                        fmtfecha: function (value) {
                            return value.format('M Y');
                        }
                    }),
                headerData: {
                    title: 'Mes ',//Mes actual
                    datetouse: new Date()
                },
                showTaskcount: false,//false,
                dayAction: 'event',    //dayAction: //viewday , event, window
                startDay: 1,//ESTA ES LA PROPIEDAD QUE ME HACE REFERENCIA A QUE DIA COMIENZA EL MES(DOMINGO,LUNES..ETC)
                taskStyle: 'margin-top:2px;', //Css style for text in day(if it has tasks and showtaskcount:true)
                showTaskList: true,
                showNumTasks: 200,
                TaskList_launchEventOn: 'click', //0.0.11
                TaskList_tplqTip: new Ext.XTemplate('<tpl for=".">{location}{starxl}{startval}<br>{endxl}{endval}<hr color={color}  noshade>{details}</tpl>'), //0.0.11
                ShowMenuItems: [1, 1, 1, 1, 0, 1],  //0.0.11  - ADD, nextmonth, prevmonth, chg Week , CHG Day, chg Sched,
                TaskList_moreMenuItems: [/*btnActivar, btnDesActivar, btnDuplicar*/], 	  //0.0.11
                TaskList_ShowMenuItems: [1, 1, 1]//0.0.11 	- Add, DELETE, EDIT
            },
            wview: {
                headerlabel: 'Semana #',
                headerButtons: true,
                dayformatLabel: 'D j',
                daylabelES: true,
                headerUseTpl: true,					//0.0.15 new property to adapt the title header customizable
                headerTpl: new Ext.XTemplate('<tpl for=".">{title} del {initday:this.formatx} al {enday:this.formatx}</tpl>', {
                    formatx: function (value) {
                        return value.format('d/m/Y');
                    }
                }),
                headerData: {
                    title: 'Tareas de la semana ',
                    initday: weekrange[0].add(Date.DAY, 1),
                    enday: weekrange[1].add(Date.DAY, 1)
                },
                moreMenuItems: [/*btnActivar, btnDesActivar, btnDuplicar*/],
                style: 'google',
                hourFormat: 'H:i', //'G:i',
                alldayTaksMore: 'window',
                alldayTasksMaxView: 6,
                taskAdd_timer_dblclick: true, 	//0.0.15
                startTime: '00::00:00',//'00:00:00 am',
                endTime: '23::59:59',// '11:59:59 pm',
                store: null,
                task_width: 25,
                tasksOffset: 10,
                headerDayClick: 'viewday',
                ShowMenuItems: [1, 1, 1, 1, 1, 0],	//0.0.11  add, go next w , go prev w , chg month , chg day, chg sched
                task_ShowMenuItems: [1, 1, 1, 1, 1], //0.0.11  add, delete, edit, go next w , go prev w
                task_eventLaunch: 'dblclick',		//0.0.11
                startDay: 1, //monday   0.0.14
                task_clsOver: 'test_taskovercss',
                forceTaskFit: true, // 0.0.14
                //allday24HinsideBody:true,	
                task_showqtip: true,
                alldayTaskTPL: new Ext.XTemplate(
                    '<tpl for=".">',
                    '<div class="ecal�?show�?basetasktpl�?div">Tarea:{subject}<br>',
                    'Inicia:{startdate}<br>Termina:{enddate}<br>Descripcion:<br>{description}<div><hr>',
                    '</tpl>'
                )
            },
            dview: {
                header: true,
                headerFormat: 'l - d - F  - Y',
                headerUseTpl: true,		//0.0.15 new property to adapt the title header customizable
                headerTpl: new Ext.XTemplate('<tpl for=".">{title}-{datetouse:this.formatx}</tpl>', {
                    formatx: function (value) {
                        var dia = e2cs.cal_locale.daytitles[value.getDay()];
                        return dia + '- ' + value.format('d - F  - Y');
                    }
                }),			//0.0.15
                headerData: {
                    title: 'Tareas del d&iacute;a ',
                    datetouse: new Date()
                },				//0.0.15			
                headerButtons: true,
                moreMenuItems: [/*btnActivar, btnDesActivar, btnDuplicar*/],
                // day specific 
                hourFormat: 'H:i',
                startTime: '00:00:00',
                endTime: '11:59:59',
                // task settings 
                store: null,
                task_increment: 1,
                taskBaseColor: null,//'#ffffff',//null,
                task_useBorderStyle: true,	  		// 0.0.15 (on day and week bodies for the moment)
                task_useBordercolor: '#ffffff',		// 0.0.15 companion property for task_useBorderStyle
                task_width: 68,
                tasksOffset: '8',
                taskAdd_dblclick: true,				//added on 0.0.7
                taskAdd_timer_dblclick: true,		//0.0.11
                useMultiColorTasks: true,//false, 
                multiColorTasks: ['#225588'],
                task_clsOver: 'test_taskovercss',
                ShowMenuItems: [1, 1, 1, 0, 0, 0],		//0.0.11 ADD, next day, prev day , chg Month , CHG Week, chg Sched, (for daybody menu)
                task_DDeditable: true, 			    //0.0.11
                task_eventLaunch: 'dblclick',  		//0.0.11 'click, dblclick, if set to '' then no action is taken
                task_ShowMenuItems: [1, 1, 1, 1, 1],		//0.0.11 ADD, delete, edit, Next day , Prev Day  (for Taks/events)
                customHTMLinpos: 'before',			//0.0.13  Feature request
                forceTaskFit: false
            },
            sview: {
                header: true,
                headerFormat: 'M-Y',
                headerButtons: true,
                headerAction: 'gotoview',
                periodselector: true,
                blankzonebg: '#6C90B4',
                //sched_addevent_id
                //blankHTML:'<div id="{calx}-test-img" class="custom_image_addNewEvent_scheduler" style=" width:100%; cursor:pointer; background-color:#6C90B4"><div align="center" id="{sched_addevent_id}"><img src="../../views/css/cmpcalendario/images/logo.png"></div><div align="center" class="custom_text_addNewEvent_scheduler"><b>Por favor haga clic sobre la imagen si desea agregar una tarea.</b></div></div>',
                listItems: {
                    headerTitle: "Actividades",
                    periodFormats: {
                        Day: 'l - d - F  - Y',
                        DayScheduler_format: 'd',
                        hourFormat: 'H:i',
                        startTime: '00:00:00',
                        endTime: '11:59:59',
                        WeekTPL: '<tpl for=".">Semana #.{numweek} Comienza el {datestart} Termina el {dateend}</tpl>',
                        WeekFormat: 'W',
                        DatesFormat: 'd/m/Y',
                        Month: 'M-Y',
                        TwoMonthsTPL: '<tpl for=".">Per&iacute;odo #.{numperiod} Empieza el {datestart} Termina el {dateend}</tpl>',
                        QuarterTPL: '<tpl for=".">Per&iacute;odo #.{numperiod} Empieza el {datestart} Termina el {dateend}</tpl>'
                    },
                    useStoreColor: false, //false
                    descriptionWidth: 246,
                    parentLists: false, //to expand collapse Parent Items if false all tasks shown as parent
                    launchEventOn: 'click',
                    editableEvents: true, // If true a context menu will appear
                    ShowMenuItems: [1, 1, 1, 1, 1, 1, 1, 1], // ADD, EDIT, DELETE, GO NEXT PERIOD , GO PREV PERIOD, Chg Month, Chg Week, CHG Day
                    taskdd_ShowMenuItems: [1, 1, 1],    // ADD, EDIT, DELETE
                    moreMenuItems: [/*btnActivar, btnDesActivar, btnDuplicar*/],
                    taskdd_BaseColor: '#6C90B4',
                    taskdd_clsOver: 'test_taskovercss_sched',
                    taskdd_showqtip: true,
                    taskdd_shownames: false
                },
                listbody: {
                    periodType: e2cs.schedviews.subView.Month,
                    headerUnit: e2cs.schedviews.Units.Days,
                    headerUnitWidth: 25
                },
                listeners: {
                    'headerClick': {
                        fn: function (refunit, datex, mviewx, calx) {
                            var msgstring = "Header Value clicked -(" + refunit + ')<br>';
                            if (refunit == 'day' || refunit == 'hour') {
                                msgstring += 'on date -(' + datex.format('d/m/Y h:i:s') + ')<br>';
                            } else {
                                msgstring += 'on Week# ' + datex[0].format('W');
                                msgstring += '-(From ' + datex[0].format('d/m/Y h:i:s') + '  to ';
                                msgstring += datex[1].format('d/m/Y h:i:s') + ')';
                            }
                        },
                        scope: this
                    },
                    'listItemSendData': {
                        fn: function (recordId, dataObj) {
                        }
                    },
                    'beforePeriodChange': {
                        fn: function (refperiod, datexold, datexnew) {
                            return true;
                        },
                        scope: this
                    },
                    'afterPeriodChange': {
                        fn: function (refperiod, datexnew) {
                            if (refperiod == 1) {
                            }
                        }
                    }
                }
            }
        });

        //_this.objCalendario.getBottomToolbar().addButton(_this.btnRefrescarCalendario);
        //Eventos capturados en cada vista del calendario, permiten realizar acciones sobre el calendario visualmento activo 
        _this.objCalendario.viewmonth.on({
            'dayClick': {
                fn: function (dateparams, monthview, calendar) {
                    _this.objCalendario.viewday.headerData.datetouse = dateparams;
                    _this.objCalendario.currentdate = dateparams;
                    _this.objCalendario.refreshCalendarView();
                    return true;
                },
                scope: this
            },
            'beforeMonthChange': {
                fn: function (currentdate, newdate) {
                },
                scope: this
            },
            'afterMonthChange': {
                fn: function (nuevafecha) {
                    _this.objCalendario.viewmonth.headerData.datetouse = nuevafecha;
                    _this.ObtenerActividadesVistaCalendario();

                    _this.ActualizarFiltrosMes();
                    _this.ActualizarFiltrosAnno();
                },
                scope: this
            }
        });
        _this.objCalendario.viewweek.on({
            'dblClickTaskAllDay': {
                fn: function (task, dxview, calendar) {
                    //							var datatest='Task all day <br>record No:' + task[0] + '<br>';
                    //							datatest+='id-task:'  + task[1] + ' ' + task[2] + '<br>';
                    //							datatest+='starts:'    + task[3] + '<br>';
                    //							datatest+='ends:'   + task[4] + '<br>';
                    //							datatest+='contents'  + task[5] + '<br>';
                    //							datatest+='index'     + task[6] + '<br>';
                },
                scope: this
            },
            'beforeWeekChange': {
                fn: function (currentDate, newDate) {
                    var testdate = _this.objCalendario.viewweek.getDatesforWeek(newDate);
                    _this.objCalendario.viewweek.headerData.enday = testdate[1];
                    _this.objCalendario.viewweek.headerData.initday = testdate[0];
                    aux = _this.objCalendario.viewweek.getDatesforWeek(newDate);
                    // _this.ObtenerActividadesVistaCalendario();
                    //if(nodo)
                    //_this.objCalendario.store.load({params: {idusuario:nodo.id,fechainicio:Ext.encode(aux[0].format('d/m/Y')), fehchafin:Ext.encode(aux[1].format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)}});
                    //else
                    //_this.objCalendario.store.load({params:{fechainicio:Ext.encode(aux[0].format('d/m/Y')), fehchafin:Ext.encode(aux[1].format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)}});
                    return true;
                }
            },
            'afterWeekChange': {
                fn: function (newdate) {
                    _this.ObtenerActividadesVistaCalendario();
                    return false;
                }
            }
        });
        _this.objCalendario.viewday.on({
            'beforeDayChange': {
                fn: function (currentdate, newdate) {
                    //_this.ObtenerActividadesVistaCalendario();
                    //if(nodo)
                    //_this.objCalendario.store.load({params: {idusuario:nodo.id,fechainicio:Ext.encode(newdate.format('d/m/Y')), fehchafin:Ext.encode(newdate.format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)}});
                    //else
                    //_this.objCalendario.store.load({params:{fechainicio:Ext.encode(newdate.format('d/m/Y')), fehchafin:Ext.encode(newdate.format('d/m/Y')),involucrados:Ext.encode(tabCalendario.getActiveTab().Datos.Involucrados),categorias:Ext.encode(tabCalendario.getActiveTab().Datos.Categorias), tipoact:Ext.encode(tabCalendario.getActiveTab().Datos.Tipoact), arrayautores : Ext.encode(tabCalendario.getActiveTab().Datos.Autores),planes:Ext.encode(tabCalendario.getActiveTab().Datos.Planes)}});
                    return true;
                },
                scope: this
            },
            'afterDayChange': {
                fn: function (newdate) {
                    _this.objCalendario.viewday.headerData.datetouse = newdate;
                    _this.ObtenerActividadesVistaCalendario();
                },
                scope: this
            }
        });

        _this.objCalendario.on({
            'activate': {
                fn: function (objetocalendario) {

                }
            },
            'onRefresh': {
                fn: function (objetocalendario) {
                    //alert('refrecando');
                }
            },
            'beforeChangeDate': {
                fn: function (nuevafecha, objcalendario) {
                    _this.objCalendario.changeView('day');
                    return true;
                }
            },
            'afterChangeDate': {
                fn: function (nuevafecha, objcalendario) {

                    nuevafecha = new Date(nuevafecha);
                    _this.objCalendario.viewday.headerData.datetouse = nuevafecha;
                    _this.ObtenerActividadesVistaCalendario();
                }
            },
            'onChangeView': {
                fn: function (nuevavista, vistaanterior, objetocalendario) {
                    if (nuevavista == 'day') {
                        var obj = Ext.get(_this.idcalendario + '-daybody');
                        obj.adjustHeight(1440, false);
                        //console.log(obj);
                        _this.objCalendario.doLayout();
                        _this.objCalendario.refreshCalendarView();
                    }
                    _this.ObtenerActividadesVistaCalendario();
                }
            },
            'beforeChangeView': {
                fn: function (nuevavista, vistaanterior, objetocalendario) {
                    if (nuevavista == vistaanterior) {
                        return false;
                    }
                    else {
                        return true;
                    }

                }
            },
            'taskAdd': {
                fn: function (fechaactual) {
                    var horainicio = fechaactual.format('G:i');
                    var horafin = fechaactual.format('G:i');
                    _this.eshija = 0;
                    _this.objCrudActividad.CrearWinCrudActividades(fechaactual.format('d/m/Y'), fechaactual.format('d/m/Y'), horainicio, horafin, 'Adicionar', _this.PostAccionesGestionar, arrayidactividades = [], null, _this.eshija, permisomodificar = 1, permisoeliminar = 1, _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales());
                }
            },
            'taskDblClick': {
                fn: function (tarea, objetovista, objetocalendario, nombrevista) {
                    var arrayidactividades = [];
                    var actividadseleccionada = _this.objCalendario.store.getById(tarea[1]);
                    arrayidactividades[0] = actividadseleccionada.data.id;
                    _this.eshija = 0;
                    _this.objCrudActividad.CrearWinCrudActividades(new Date().format('d/m/Y'), new Date().format('d/m/Y'), '8:00 AM', '5:00 PM', 'Ver datos de la', function () {
                    }/*_this.PostAccionesGestionar*/, arrayidactividades, null, _this.eshija, permisomodificar = 1, permisoeliminar = 1, _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales());
                }
            },
            'beforeTaskDelete': {
                fn: function (tarea, viewobject) {
                    var actividadseleccionada = _this.objCalendario.store.getById(tarea[1]);

                    if (actividadseleccionada.data.eliminar == 1) {

                        return true;
                    } else {
                        mostrarMensaje(1, 'Usted no tiene permiso para eliminar esta actividad.', function () {
                                return false;
                            }
                        );
                    }
                }
            },
            'afterTaskDelete': {
                fn: function (tarea, deleteaction) {
                    var actividadseleccionada = _this.objCalendario.store.getById(tarea[1]);
                    var arrayidactividades = [];
                    if (actividadseleccionada.data.eliminar == 1) {
                        var idautor = actividadseleccionada.data.idautor;
                        arrayidactividades[0] = actividadseleccionada.data.id;
                        _this.eshija = 0;
                        _this.objCrudActividad.EliminarActividades(arrayidactividades, _this.PostAccionesGestionar);
                    } else {
                        mostrarMensaje(1, 'Usted no tiene permiso para eliminar esta actividad.', function () {
                                //console.log(actividadseleccionada);
                            }
                        );
                    }
                }
            },
            'onTaskEdit': {
                fn: function (tarea) {
                    var actividadseleccionada = _this.objCalendario.store.getById(tarea[1]);
                    if (actividadseleccionada.data.modificar == 1) {
                        return true;
                    } else {
                        mostrarMensaje(1, 'Usted no tiene permiso para modificar esta actividad.', function () {
                                return false;
                            }
                        );
                    }
                }
            },
            'beforeTaskEdit': {
                fn: function (tarea) {
                    var actividadseleccionada = _this.objCalendario.store.getById(tarea[1]);
                    var arrayidactividades = [];
                    if (actividadseleccionada.data.modificar == 1) {
                        var idautor = actividadseleccionada.data.idautor;
                        arrayidactividades[0] = actividadseleccionada.data.id;
                        _this.eshija = 0;
                        _this.objCrudActividad.CrearWinCrudActividades(new Date().format('d/m/Y'), new Date().format('d/m/Y'), '8:00 AM', '5:00 PM', 'Modificar', _this.PostAccionesGestionar, arrayidactividades, idautor, _this.eshija, permisomodificar = 1, permisoeliminar = 1, _this.objcmprelaciones.ObtenerElementosRelacionadosIniciales());
                    }
                }
            },
            'beforeTaskMove': {
                fn: function (tarea, clasetarea, objvistadiaria, objcalendario) {
                    var actividadseleccionada = _this.objCalendario.store.getById(tarea[1]);
                    if (actividadseleccionada.data.modificar == 1) {
                        return true;
                    } else {
                        mostrarMensaje(1, 'Usted no tiene permiso para modificar esta actividad.');
                        return false;
                    }
                }
            },
            'TaskMoved': {
                fn: function (tarea, clasetarea, objvistadiaria, objcalendario) {
                    var actividadseleccionada = _this.objCalendario.store.getById(tarea[1]);
                    var arrayidactividades = [];
                    if (actividadseleccionada.data.modificar == 1) {
                        arrayidactividades[0] = actividadseleccionada.data.id;
                        _this.eshija = 0;
                        _this.objCrudActividad.ModificarHorarioActividad(arrayidactividades, tarea[3], tarea[4], _this.PostAccionesGestionar);
                    }
                }
            },
            'customMenuAction': {
                fn: function (MenuId, Currentview, datatask, objEl, dxview) {
                    var rec = _this.objCalendario.store.getById(datatask[1]);
                    /*if(MenuId=='activar' || MenuId=='desactivar') {
                     if(rec.data.modificar ==0)
                     mostrarMensaje(1,'Usted no tiene permiso para modificar la actividad '+datatask[2]+'.');
                     else {
                     var activo = (MenuId!='activar')?0:1;
                     var accion = (activo==1)?'Activando':'Desactivando';
                     Ext.getBody().mask(accion+' actividad '+datatask[2]+'.Espere por favor.');
                     Ext.Ajax.request({
                     url: 'setActivaActividad',
                     params:{idact:datatask[1],activo:activo},
                     callback: function (options,success,response){
                     Ext.getBody().unmask();
                     responseData = Ext.decode(response.responseText);
                     var accion = (activo==1)?'activada':'dasactivada';
                     if(responseData.mensaje == 1)mostrarMensaje(responseData.mensaje,'La actividad a sido '+accion+' satisfactoriamente.');
                     var rec = calendario.store.getById(datatask[1]);
                     rec.set('activo',activo);
                     calendario.store.commitChanges();
                     calendario.refreshCalendarView();
                     }
                     });
                     }
                     }else{
                     if(MenuId=='duplicar'){
                     GestionarActividades('dup');
                     }
                     false} ;*/
                },
                scope: this
            },
            'beforeContextMenuTask': {
                fn: function (dxview, datatask, action) {
                    var rec = _this.objCalendario.store.getById(datatask[1]);
                    tareaMod = datatask[1];
                    idautor = _this.objCalendario.store.getById(datatask[1]).data.idautor;
                    /*if(rec.data.activo == 1 && rec.data.modificar == 1){
                     btnActivar.disable(); btnDesActivar.enable();
                     btnDuplicar.enable();
                     }else {
                     btnActivar.enable(); btnDesActivar.disable();
                     btnDuplicar.disable();
                     }
                     }*/
                }
            }
        });
        if (_this.objCalendario.id == 'personal') {
            //_this.objCalendario.store.load();
            _this.ObtenerActividadesVistaCalendario();
        }

        //_this.objCalendario.store.load({params:{idcalendario:_this.objCalendario.id,fechainicio:_this.fechainicio, fehchafin:_this.fehchafin}});

        /*var newDate = _this.objCalendario.currentdate;
         var newView = _this.objCalendario.currentView;
         switch(newView){
         case 'week':{
         aux = _this.objCalendario.viewweek.getDatesforWeek(newDate);
         _this.objCalendario.store.load({params:{idcalendario:_this.objCalendario.id,fechainicio:Ext.encode(aux[0].format('d/m/Y')), fehchafin:Ext.encode(aux[1].format('d/m/Y'))}});
         }break;
         case 'day':{
         _this.objCalendario.store.load({params:{idcalendario:_this.objCalendario.id,fechainicio:Ext.encode(newDate.format('d/m/Y')), fehchafin:Ext.encode(newDate.format('d/m/Y'))}});
         }break;
         case 'month':{
         aux = _this.objCalendario.viewmonth.getDateRangeOfMonth(newDate);
         _this.objCalendario.store.load({params:{idcalendario:_this.objCalendario.id,fechainicio:Ext.encode(aux[0].format('d/m/Y')), fehchafin:Ext.encode(aux[1].format('d/m/Y'))}});
         }break;
         }*/
        /*if(id!='personal')
         {}*/
        //_this.objCalendario.getStore().;
        return _this.objCalendario;
    };

    this.ObtenerCategoriasActividad = function () {
        var arraycategoriasact = [];
        var arraycategact = _this.smtgcategact.getSelections();
        var totalreccategact = arraycategact.length;
        for (var i = 0; i < totalreccategact; i++) {
            var elemento = new Object;
            elemento.idcategoria = arraycategact[i].data.idnom;
            arraycategoriasact.push(elemento);
            if (arraycategact[i].data._is_leaf == false) {
                tgcategact.getStore().each(function (record) {
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
        var arraytipoactiv = _this.smtgtipoact.getSelections();
        var totalrectipoact = arraytipoactiv.length;
        for (var i = 0; i < totalrectipoact; i++) {
            var elemento = new Object;
            elemento.idtipoactividad = arraytipoactiv[i].data.idnom;
            arraytipoact.push(elemento);

            if (arraytipoactiv[i].data._is_leaf == false) {
                tgtipoact.getStore().each(function (record) {
                    if (record.data._parent == arraytipoactiv[i].data.idnom) {
                        var elemento2 = new Object;
                        elemento2.idtipoactividad = arraytipoactiv[i].data.idnom;
                        arraytipoact.push(elemento2);
                    }
                });
            }
        }
        return arraytipoact;//(arraytipoact.length!=0)?arraytipoact:null;	
    };


    this.ObtenerActividadesVistaCalendario = function (s) {
        if ((_this.personal == 1) || (_this.busqueda == 1 && _this.busquedaefectuada == 1)) {
            _this.objCalendario.store.removeAll();
            var newDate = _this.objCalendario.currentdate;
            var newView = _this.objCalendario.currentView;
            switch (newView) {
                case 'week':
                {
                    aux = _this.objCalendario.viewweek.getDatesforWeek(newDate);
                    _this.fechainicio = Ext.encode(aux[0].format('d/m/Y'));
                    _this.fehchafin = Ext.encode(aux[1].format('d/m/Y'));
                }
                    break;
                case 'day':
                {
                    _this.fechainicio = Ext.encode(newDate.format('d/m/Y'));
                    _this.fehchafin = Ext.encode(newDate.format('d/m/Y'));
                }
                    break;
                case 'month':
                {
                    aux = _this.objCalendario.viewmonth.getDateRangeOfMonth(newDate);
                    _this.fechainicio = Ext.encode(aux[0].format('d/m/Y'));
                    _this.fehchafin = Ext.encode(aux[1].format('d/m/Y'));
                }
                    break;
            }
            _this.objCalendario.store.load({
                params: {
                    idcalendario: _this.objCalendario.id,
                    fechainicio: _this.fechainicio,
                    fehchafin: _this.fehchafin
                }
            });
        }
    };

    this.PostAccionesGestionar = function (mensaje, accion) {
        _this.ObtenerActividadesVistaCalendario();
    };

    //
    this.GetRangeDay = function (date_ini, date_end) {
        date_iniold = arr_dates[arr_dates.length - 2]; //obteniendo fecha anterior a la que se modofica en el datefield
        if (date_iniold && date_ini != date_iniold) {
            range_dates = date_iniold.getElapsed(date_end); //obteniendo rango de milisegundos entre fechas
            result_day = range_dates / 1000 / 60 / 60 / 24; //conviertiendolo a d�as
            result_date = date_ini.add(Date.DAY, result_day); //obteniendo nueva fecha dado el rango de d�as
            return result_date;
        } else  return date_ini;
    };

    //
    this.GetRangeHour = function (hour_ini, hour_end) {
        hour_iniold = arr_hour.pop(); //obteniendo hora anterior a la que se modofica en el TImefield inicio.
        if (hour_iniold && hour_ini != hour_iniold) {
            range_hour = hour_end.getElapsed(hour_iniold);//obteniendo rango de milisegundos entre la hora inicial y final dadas.
            new_hour_end = hour_ini.add(Date.MILLI, range_hour); //cse adiciona la diferencia entre la hora inicial y final a la inicial para obtener nueva hora
            return new_hour_end;
        } else  return hour_end;
    };

    this.ActualizarFiltrosMes = function () {
        var currentmonth = _this.objCalendario.currentdate.getMonth();
        _this.cbMeses.setValue(currentmonth);
    };

    this.ActualizarFiltrosAnno = function () {
        var currentyear = _this.objCalendario.currentdate.getFullYear();
        _this.cbNfanno.setValue(currentyear);
    };

    this.ActualizarCalendarioViewMonth = function () {
        var dia = _this.objCalendario.currentdate.getDay();
        var mes = _this.cbMeses.getValue();
        var ano = _this.cbNfanno.getValue();

        var fechacambiar = new Date(ano, mes, dia);
        _this.objCalendario.viewmonth.headerData.datetouse = fechacambiar;
        _this.objCalendario.currentdate = fechacambiar;
        _this.ObtenerActividadesVistaCalendario();
    };

    this.CrearAnnos = function () {
        var fechact = new Date();
        var annoini = fechact.getFullYear() - 10;
        var arraycomp = [];
        for (var i = 1; i < 21; i++) {
            arraycomp[(i - 1)] = [(annoini + i), (annoini + i)];
        }
        return arraycomp;
    };
    this.recargarStore = function (calendario) {
        calendario.load();
        _this.ObtenerActividadesVistaCalendario();
    }
};