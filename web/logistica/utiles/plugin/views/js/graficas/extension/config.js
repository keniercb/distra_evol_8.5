var Ax = Ax ? Ax : {};
Ax.ns = Ax.ns ? Ax.ns : function (namespace) {
    var names = namespace.split('.');
    if (!window[names[0]]) {
        window[names[0]] = {};
    }
    var baseNs = window[names[0]];
    for (var i = 1; i < names.length; i++) {
        if (!baseNs[names[i]]) {
            baseNs[names[i]] = {};
        }
        baseNs = baseNs[names[i]];
    }
    return baseNs;
}
Ax.ns('Ax.Charts');
Ax.Charts = {
    chartDefaultOptions: {
        color: '',
        labelColor: '',
        labelStyle: {
            fontWeight: 'bold'
        },
        labelAlign: 'center',
        locale: 'es',
        labelRotation: -70,
        labelX: 0,
        labelY: 0,
        numericSymbols: [" - miles", "M", "G", "T", "P", "E"],
        defaultType: 'column',//area, bar, column, line, pie, scatter, spline
        dateFormat: 'DD/MM/YYYY',
        legend: {
            backgroundColor: '#FFFFFF',
            borderRadius: 5,
            symbolHeight: 12,
            symbolWidth: 12,
            symbolRadius: 6,
            layout: 'vertical',
            floating: true,
            align: 'left',
            verticalAlign: 'top',
            x: 60,
            y: 5,
            shadow: true,
            itemHoverStyle: {
                color: '#FF0000'
            }
        },
        getDefaultOption: function (attr) {
            return typeof Ax.Charts.chartDefaultOptions[attr] != 'function' ? Ax.Charts.chartDefaultOptions[attr] : undefined;
        },
        setDefaultOptions: function (options, defaultOptions) {
            defaultOptions = defaultOptions ? defaultOptions : Ax.Charts.chartDefaultOptions;
            if (typeof options == 'object') {
                for (var i in options) {
                    if (typeof options[i] == 'object' && baseLabel[i]) {
                        defaultOptions[i] = Ax.Charts.chartDefaultOptions.setDefaultOptions(options[i], defaultOptions[i]);
                    } else {
                        defaultOptions[i] = options[i];
                    }
                }
            }
            return defaultOptions;
        },
        defaultLanguage: 'es',
        getLabel: function (label, lang) {
            lang = lang ? lang : Ax.Charts.chartDefaultOptions.defaultLanguage;
            var labels = Ax.Charts.chartDefaultOptions.getDefaultOption('labels');
            return label ? (labels[lang][label] ? labels[lang][label] : label) : labels[lang];
        },
        addLabel: function (labels, baseLabel) {
            baseLabel = baseLabel ? baseLabel : Ax.Charts.chartDefaultOptions.labels[Ax.Charts.chartDefaultOptions.defaultLanguage];
            if (typeof labels == 'object') {
                for (var i in labels) {
                    if (typeof labels[i] == 'object' && baseLabel[i]) {
                        baseLabel[i] = Ax.Charts.chartDefaultOptions.addLabel(labels[i], baseLabel[i]);
                    } else {
                        baseLabel[i] = labels[i];
                    }
                }
            }
            return baseLabel;
        }
    }
};
Ax.Charts.chartDefaultOptions.labels = {
    en: {
        categoryDateFormat: 'MMM DD, YYYY',
        serialization: 'Serialization Criteria',
        refresh: 'Reload',
        iniView: 'Initial view',
        clearFilter: 'Clear Filters',
        removeFilter: 'Remove Filter',
        yes: 'True',
        no: 'False',
        error: 'Error',
        axis: 'Axis',
        xAxis: 'Xaxis',
        yAyis: 'Yayis',
        warning: 'Warning',
        notice: 'Notice',
        edit: 'Editar',
        export: 'Export',
        noSql: 'No Sql Query present.',
        NanError: 'You must be select one axis with numeric values.',
        name: 'Name',
        value: 'Value',
        chartType: 'Chart Type',
        chartTitle: 'Chart Title',
        chartXTitle: 'Xaxis Text',
        chartYTitle: 'Yayis Text',
        chartSource: 'Chart Source',
        autoRefresh: 'Auto Refresh',
        rotation: 'Rotation',
        rotationX: 'Xaxis Rotation',
        rotationY: 'Yayis Rotation',
        rotationDeep: '3D deep',
        theme: 'Theme',
        dashStyle: 'Dash Style',
        longdash: 'Long Dash',
        shortdash: 'Short Dash',
        none: 'None',
        areaFillColorGradient: 'Area Fillcolor Gradient',
        changeBackground: 'Change Background Color',
        backgroundColor: 'Background Color',
        choose: 'Choose',
        cancel: 'Cancel',
        clearText: "Clear Color Selection",
        noColorSelectedText: "No Color Selected",
        column: 'Columns',
        alias: 'Alias',
        bar: 'Bar',
        line: 'Line',
        area: 'Area',
        points: 'Points',
        pie: 'Pie',
        pyramid: 'Pyramid',
        waterfall: 'Waterfall',
        funnel: 'Funnel',
        polygon: 'Polygon',
        solidgauge: 'Solid Gauge',
        arearange: 'Area Range',
        spline: 'Spline',
        areaspline: 'Area Spline',
        areasplinerange: 'Area Spline Range',
        defaultLabel: 'Default',
        sand: 'Sand',
        formTitle: 'Chart Properties',
        panelTitle: 'Chart',
        selectSource: 'Select axis configuration',
        showChart: 'Show Chart',
        xConfig: 'Xaxis Config',
        yConfig: 'Yayis Config',
        fillOpacity: 'Area Opacity',
        highchartsLabels: {
            contextButtonTitle: "Chart context menu",
            decimalPoint: ".",
            downloadJPEG: "Download JPEG image",
            downloadPDF: "Download PDF document",
            downloadPNG: "Download PNG image",
            downloadSVG: "Download SVG vector image",
            loading: "Loading...",
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            numericSymbols: ["k", "M", "G", "T", "P", "E"],
            printChart: "Print chart",
            resetZoom: "Reset zoom",
            resetZoomTitle: "Reset zoom level 1:1",
            shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            thousandsSep: " ",
            weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        },
        highchartsCredits: {
            text: '<b style="color: black;">Powered by</b> <b style="color: green;font-weight: bolder;font-size: 11px;">XETID</b>',
            href: 'http://www.xetid.cu'
        }
    },
    es: {
        categoryDateFormat: 'DD [de] MMM [de] YYYY',
        serialization: 'Criterio de serialización',
        refresh: 'Recargar datos',
        iniView: 'Vista inicial',
        labelDateFormat: 'LLL',
        clearFilter: 'Limpiar filtro',
        removeFilter: 'Sin filtro',
        yes: 'Si',
        no: 'No',
        edit: 'Editar',
        axis: 'Ejes',
        xAxis: 'Eje "X"',
        yAyis: 'Ejes "Y"',
        export: 'Exportar',
        error: 'Error',
        warning: 'Aviso',
        notice: 'Notificación',
        NanError: 'Debe seleccionar al menos un eje que contenga datos numéricos.',
        noSql: 'No se ha asociado ninguna consulta SQL.',
        name: 'Nombre',
        value: 'Valor',
        chartType: 'Tipo de gráfica',
        chartTitle: 'Título de la gráfica',
        chartXTitle: 'Texto en el eje "X"',
        chartYTitle: 'Texto en el eje "Y"',
        chartSource: 'Fuente de datos',
        autoRefresh: 'Recargar automáticamente',
        rotation: 'Rotación',
        rotationX: 'Rotación en el eje "X"',
        rotationY: 'Rotación en el eje "Y"',
        rotationDeep: 'Profundidad',
        theme: 'Tema',
        dashStyle: 'Estilo de la linea',
        longdash: 'Linea discontinua larga',
        shortdash: 'Linea discontinua corta',
        none: 'Ninguna',
        areaFillColorGradient: 'Degradado del color de fondo del area',
        changeBackground: 'Cambiar color de fondo',
        backgroundColor: 'Color de fondo',
        clearText: "Limpiar selección",
        noColorSelectedText: "No hay color seleccionado",
        choose: 'Seleccionar',
        cancel: 'Cancelar',
        column: 'Columnas',
        alias: 'Alias',
        bar: 'Barra',
        line: 'Línea',
        area: 'Area',
        points: 'Puntos',
        pie: 'Pastel',
        pyramid: 'Pirámide',
        waterfall: 'Cascada',
        funnel: 'Embudo',
        polygon: 'Polígono',
        solidgauge: 'Solid Gauge',
        arearange: 'Rangos enmarcados',
        spline: 'Línea Oblícua',
        areaspline: 'Area oblícua',
        areasplinerange: 'Rango oblícuo enmarcado',
        defaultLabel: 'Por Defecto',
        sand: 'Arena',
        formTitle: 'Propiedades',
        panelTitle: 'Gráfica',
        showChart: 'Graficar',
        selectSource: 'Seleccionar campos a graficar',
        xConfig: 'Configuración de las X',
        yConfig: 'Configuración de las Y',
        fillOpacity: 'Transaprencia del area',
        highchartsLabels: {
            contextButtonTitle: "Opciones de la gráfica",
            decimalPoint: ",",
            downloadJPEG: "Descargar imágen JPEG",
            downloadPDF: "Descargar documento PDF",
            downloadPNG: "Descargar imágen PNG",
            downloadSVG: "Descargar imágen SVG",
            loading: "Cargando...",
            months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            numericSymbols: ["k", "M", "G", "T", "P", "E"],
            printChart: "Imprimir gráfica",
            resetZoom: "Restaurar zoom",
            resetZoomTitle: "Restaurar zoom al nivel 1:1",
            shortMonths: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            thousandsSep: " ",
            weekdays: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
        },
        highchartsCredits: {
            text: '<b style="color: black;">Elaborado por</b> <b style="color: green;font-weight: bolder;font-size: 11px;">XETID</b>',
            href: 'http://www.xetid.cu'
        }
    }
};

Ax.Charts.errors = {
    NanError: {
        severity: 'error',
        log: Ax.Charts.chartDefaultOptions.getLabel('NanError')
    }
};
Ax.Charts.getError = function (error) {
    return (Ax.Charts.errors[error]) ? Ax.Charts.errors[error] : {
        severity: 'warning',
        log: Ax.Charts.chartDefaultOptions.getLabel(error)
    };
};

Ax.Charts.throwError = function (error, aditionalParams) {
    var errorObject = Ax.Charts.getError(error);
    Ax.apply(errorObject, aditionalParams);
    return Ax.throwError(error, errorObject);
}

Ax.Charts.chartDefaultOptions.themes = {
    default: {
        text: Ax.Charts.chartDefaultOptions.getLabel('defaultLabel'),
        background: 'white'
    },
    sand: {
        text: Ax.Charts.chartDefaultOptions.getLabel('sand'),
        background: 'url(' + Ax.servicesLocation + '/lib/images/sand.png)'
    }
};

Ax.Charts.chartDefaultOptions.dashStyles = [
    {
        name: 'longdash',
        text: Ax.Charts.chartDefaultOptions.getLabel('longdash')
    }, {
        name: 'shortdash',
        text: Ax.Charts.chartDefaultOptions.getLabel('shortdash')
    }, {
        name: 'none',
        text: Ax.Charts.chartDefaultOptions.getLabel('none')
    }
];
Ax.Charts.chartDefaultOptions.getDashStyles = function () {
    var dashStyles = [];
    for (var i = 0; i < Ax.Charts.chartDefaultOptions.dashStyles.length; i++) {
        dashStyles.push(Object.keys(Ax.Charts.chartDefaultOptions.dashStyles[i]).map(function (key) {
            return Ax.Charts.chartDefaultOptions.dashStyles[i][key]
        }));
    }
    return dashStyles;
}

Ax.Charts.findType = function (name) {
    for (var i = 0; i < Ax.Charts.chartDefaultOptions.chartTypes.length; i++) {
        if (Ax.Charts.chartDefaultOptions.chartTypes[i]['name'] == name) {
            return Ax.Charts.chartDefaultOptions.chartTypes[i];
        }
    }
    return null;
}

Ax.Charts.chartDefaultOptions.chartTypes = [
    {
        name: 'scatter',
        text: Ax.Charts.chartDefaultOptions.getLabel('points'),
        allowMultiSeries: true,
        icon: 'icondistra-chart_pie',
        support3D: 0
    },
    {
        name: 'line',
        text: Ax.Charts.chartDefaultOptions.getLabel('line'),
        allowMultiSeries: true,
        icon: 'icondistra-chart_line',
        support3D: 20
    },
    {
        name: 'spline',
        text: Ax.Charts.chartDefaultOptions.getLabel('spline'),
        allowMultiSeries: true,
        icon: 'icondistra-chart_curve',
        support3D: 20
    },
    {
        name: 'polygon',
        text: Ax.Charts.chartDefaultOptions.getLabel('polygon'),
        allowMultiSeries: true,
        icon: 'icondistra-chart_pie',
        support3D: 0
    },
    {
        name: 'area',
        text: Ax.Charts.chartDefaultOptions.getLabel('area'),
        allowMultiSeries: true,
        icon: 'icondistra-chart_line',
        support3D: 20
    },
    {
        name: 'arearange',
        text: Ax.Charts.chartDefaultOptions.getLabel('arearange'),
        allowMultiSeries: true,
        icon: 'icondistra-chart_line',
        support3D: 20
    },
    {
        name: 'areaspline',
        text: Ax.Charts.chartDefaultOptions.getLabel('areaspline'),
        allowMultiSeries: true,
        icon: 'icondistra-chart_curve',
        support3D: 20
    },
    {
        name: 'areasplinerange',
        text: Ax.Charts.chartDefaultOptions.getLabel('areasplinerange'),
        allowMultiSeries: true,
        icon: 'icondistra-chart_curve',
        support3D: 20
    },
    {
        name: 'funnel',
        text: Ax.Charts.chartDefaultOptions.getLabel('funnel'),
        allowMultiSeries: true,
        icon: 'icondistra-chart_pie',
        support3D: 0
    },
    {
        name: 'bar',
        text: Ax.Charts.chartDefaultOptions.getLabel('bar'),
        allowMultiSeries: true,
        icon: 'icondistra-chart_bar',
        support3D: 20
    },
    {
        name: 'column',
        text: Ax.Charts.chartDefaultOptions.getLabel('column'),
        allowMultiSeries: true,
        icon: 'icondistra-chart_bar',
        support3D: 20
    },
    {
        name: 'pie',
        text: Ax.Charts.chartDefaultOptions.getLabel('pie'),
        allowMultiSeries: false,
        icon: 'icondistra-chart_pie',
        support3D: 60
    },
    {
        name: 'pyramid',
        text: Ax.Charts.chartDefaultOptions.getLabel('pyramid'),
        allowMultiSeries: true,
        icon: 'icondistra-chart_pie',
        support3D: 0
    },
    {
        name: 'waterfall',
        text: Ax.Charts.chartDefaultOptions.getLabel('waterfall'),
        allowMultiSeries: true,
        icon: 'icondistra-chart_pie',
        support3D: 20
    },
    {
        name: 'solidgauge',
        text: Ax.Charts.chartDefaultOptions.getLabel('solidgauge'),
        allowMultiSeries: true,
        icon: 'icondistra-chart_pie',
        support3D: 0
    }
];