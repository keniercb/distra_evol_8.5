/**
 * Created by lily on 15/01/16.
 */
Ext.define('Traces.util.idioma.es', {

    alias: 'widget.idioma_es',
    date: {

            todayText: 'Hoy',
            minText: 'Esta fecha es anterior a la fecha m&iacute;nima',
            maxText: 'Esta fecha es posterior a la fecha m&aacute;xima',
            nextText: 'Mes Pr&oacute;ximo (Control+Right)',
            prevText: 'Mes Anterior (Control+Left)',
            monthYearText: 'Escoja el mes para moverse por los años (Control+Up/Down)',
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            dayNames: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
            okText: 'Aplicar',
            cancelText: 'Cancelar'

    },

    tooltips: {
        exportar: 'Exportar trazas <b>(Alt+E)</b>',
        buscar: 'Buscar traza <b>(Alt+B)</b>',
        limpiar: 'Limpiar filtro(s) <b>(Alt+L)</b>'
    },

    texts: {
        loadingText: 'Cargando datos...',
        exportar : 'Exportar',
        lbDfDesde: 'Desde',
        lbDfHasta: 'Hasta',
        msgValorIncorrecto: 'Valor incorrecto para este campo',
        emptyText: '[-Seleccione-]',
        labelSubsistema: 'Subsistema',
        labelUsuario: 'Usuarios',
        labelIP: 'IP',
        labelTipoTraza: 'Tipos de trazas',
        labelReferencia: 'Referencia',
        labelAccion: 'Acci&oacute;n',
        labelCodigo: 'C&oacute;digo',
        labelIdioma: 'Idioma',
        labelTipo: 'Tipo',
        labelMensaje: 'Mensaje',
        labelDescripcion: 'Descripci&oacute;n',
        labelRegistro: 'Registro',
        labelEsquema: 'Esquema',
        labelTabla: 'Tabla',
        textMostrarDatos: 'Mostrar Datos',
        textColumnCampo: 'Campo',
        textColumnValor: 'Valor',
        labelOrigen: 'Origen',
        labelInterno: 'Interno',
        labelTipoBloqueo: 'Tipo de Bloqueo',
        textBtnBuscar: '<u>B</u>uscar',
        textBtnLimpiar: '<u>L</u>impiar',
        textCerrar: 'Cerrar',
        gridHeaderFecha: 'Fecha',
        gridHeaderHora: 'Hora',
        gridHeaderSubsistema: 'Subsistema',
        gridHeaderFuncionalidad: 'Funcionalidad',
        gridHeaderConsumoMemoria: 'Consumo memoria (Mb)',
        gridHeaderTiempoEjecucion: 'Tiempo ejecuci&oacute;n (s)',
        warningFecha: 'La fecha Hasta: tiene que ser mayor o igual que ',
        warningFiltroVacio: 'Debe introducir alg&uacute;n criterio de b&uacute;squeda.\n Verifique por favor.'

    },
    titles: {
        ventanaTrazaAccion: 'Detalles de la traza de acción',
        ventanaTrazaExcepcion: 'Detalles de la traza de excepción',
        ventanaTrazaDatos: 'Detalles de la traza de datos',
        ventanaTrazaIntegracion: 'Detalles de la traza de integración',
        ventanaTrazaBloqueo: 'Detalles de la traza de bloqueo'
    },

    ventanaTimeReal: {
        title: 'Tiempo Real',
        timerecarga: 'Tiempo de recarga <b>(en segundos)</b>',
        minText: 'El valor mínimo de recarga es de {0} segundos',
        maxValueText: 'El valor máximo de recarga es de {0} segundos'

    },

    panelgraf:{
        timereal: 'Tiempo real',
        pastel: 'Pastel',
        barra: 'Barra',
        curva: 'Curva',
        desde: 'Desde',
        hasta: 'Hasta',
        combo: 'Tipo de gráfica',
        minText: 'La fecha en el campo debe ser mayor o igual a {0}',
        maxText: 'La fecha en el campo debe ser menor o igual a {0}'
    },

    general:  {
        blankText: 'Este campo es obligatorio.',
        textCancelar: 'Cancelar',
        tooltipCancelar: 'Cerrar ventana sin guardar los datos <b>(Alt+X)</b>',
        textAceptar: 'Aceptar',
        tooltipAceptar: 'Guardar los datos y cerrar la ventana <b>(Enter)</b>',
        textBuscar: 'Buscar',
        tooltipBuscar: 'Buscar traza <b>(Alt+B)</b>',
        textLimpiar: 'Limpiar',
        tooltipLimpiar: 'Limpiar filtro(s) <b>(Alt+L)</b>',
        textAyuda: 'Ayuda'
    },

    controllerGrafica:{
        msgInfo: 'Información',
        msgText1: 'No existen datos que cumplan con los criterios de búsqueda',
        msgText2: 'La fecha Hasta: tiene que ser mayor o igual que '
    }
});
