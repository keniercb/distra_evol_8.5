// --------------------------------------------------
// E2CS  Extjs-Event-Calendar-Solution  alpha(0.0.1) 
// @Version E2CS-0.0.1  june 1 2008 
// Spanish
// @Author: Carlos Mendez  
// @contact: cmendez@mm-mendez.com, for MSN chat:cmendez21@hotmail.com
// --------------------------------------------------
//
// @license E2CS is licensed under the terms of
// the Open Source LGPL 3.0 license.  Commercial use is permitted to the extent
// that the code/component(s) do NOT become part of another Open Source or Commercially
// licensed development library or toolkit without explicit permission.
//
// --------------------------------------------------

Ext.namespace('e2cs.cal_locale');
e2cs.cal_locale = {
    // Calendar locale
    dateSelectorText: 'Seleccionar',
    dateSelectorTooltip: 'Seleccionar fecha',
    // Why i have my own locale for days and months you will ask ?
    // i didn't want to mess with ext locale and prefer the widget will have his own locale
    monthtitles: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    daytitles: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    todayLabel: 'Hoy',
    todayTip : '{0}',
    todayToolTip: 'Ver en el calendario las actividades del d&iacute;a de hoy',
    // toolbar buttons tooltips
    tooltipMonthView: 'Cambiar a vista mensual',
    tooltipWeekView: 'Cambiar a vista semanal',
    tooltipDayView: 'Cambiar a vista diaria',
    tooltipSchedView: 'Cambiar a vista diagrama',
    // tpl for zoom tasks general labels
    win_tasks_format: 'd-m-Y',
    win_tasks_loading: 'Cargando...',
    win_tasks_empty: 'No hay actividades...',
    // Month view locale
    win_month_zoomlabel: 'Tareas del d&iacute;a',
    headerTooltipsMonth: {
        prev: 'Mes Anterior',
        next: 'Mes Siguiente'
    },
    contextMenuLabelsMonth: {
        task: "Agregar nueva actividad con fecha ",
        chgwview: "Cambiar a vista semanal",
        chgdview: "Cambiar a vista diaria",
        chgsview: "Cambiar a vista diagrama",
        gonextmonth: " Mes siguiente ",     // 0.0.4
        goprevmonth: "Mes anterior"     // 0.0.4
    },
    labelforTasksinMonth: 'Tareas:',
    // Dayview and daytask  locale
    task_MoreDaysFromTask: '<br>(+)',
    task_LessDaysFromTask: '(-)<br>',
    task_qtip_starts: 'Inicia: ',
    task_qtip_ends: 'Termina: ',
    headerTooltipsDay: {
        prev: 'D&iacute;a anterior',
        next: 'D&iacute;a siguiente'
    },
    contextMenuLabelsDay: {
        taskAdd: "Nueva actividad",
        taskDelete: "Eliminar actividad",
        taskEdit: "Modificar actividad:",
        NextDay: "Ir al d&iacute;a siguiente",
        PreviousDay: "Ir al d&iacute;a anterior"
    },
    //Week view  and weektask locale
    // 0.0.4
    contextMenuLabelsWeek: {
        prev: "Ir a la semana anterior",
        next: "Ir a la siguiente semana",
        chgdview: "Cambiar a vista diaria",
        chgmview: "Cambiar a vista mensual"
    },
    // 0.0.4
    headerTooltipsWeek: {
        prev: 'Semana anterior',
        next: 'Semana siguiente'
    },
    labelforTasksinWeek: 'Mas actividades en Semana:',
    win_week_zoomlabel: 'Mas actividades de la semana',
    weekheaderlabel: 'Semana #',
    weekheaderlabel_from: 'Desde:',
    weekheaderlabel_to: ' Hasta:',
    alldayTasksMaxLabel: 'Ver actividades de m&aacute;s de un d&iacute;a',
    //sdasda
    Scheduler_selector: 'Seleccionar per&oacute;odo',
    scheduler_noeventsonview: '<p>No hay actividades para este per&iacute;odo</p>',
    scheduler_period_from_to: {
        starts: 'Desde',
        ends: 'Hasta'
    },
    headerTooltipsScheduler: {
        prev: 'Per&iacute;odo anterior',
        next: 'Per&iacute;odo siguiente'
    },
    scheduler_headerListStrings: {
        Day: "D&iacute;a",
        week: "Semana",
        period: "Per&iacute;odo",
        start: "Desde",
        end: "Hasta"
    },
    contextMenuLabelsSchedule: {
        taskAdd: "Nueva actividad",
        taskDelete: "Eliminar actividad",
        taskEdit: "Modificar actividad : ",
        NextPeriod: "Ir al siguiente per&iacute;odo",
        PreviousPeriod: "Ir al per&iacute;odo anterior",
        chgdview: "Cambiar a vista diaria.",
        chgmview: "Cambiar a vista mensual.",
        chgwview: "Cambiar a vista semanal"
    }
};

function getFecha() {
    var mydate = new Date();
    var year = mydate.getYear();
    if (year < 1000)
        year += 1900;
    var day = mydate.getDay();
    var month = mydate.getMonth();
    var daym = mydate.getDate();
//e2cs.cal_locale.;
    if (daym < 10)
        daym = "0" + daym;
    var dayarray = e2cs.cal_locale.daytitles;
    var montharray = e2cs.cal_locale.monthtitles;
//var fecha:String = new String();
    var fecha = dayarray[day] + ' ' + montharray[month] + ' ' + String(daym) + ' ' + year;
    return fecha;
}
