Ext.ns('Maestro.ConfigurarReporte');

Maestro.ConfigurarReporte.idiom = {
    waitTitleSendData: 'Por favor espere...',
    invalidArgument: 'Existen errores en los datos enviados.',
    emptyData: 'No existen datos que mostrar.',
    waitLoadData: 'Cargando...',
    emptyFieldText: 'Seleccione...',

    /****************************Tags Modulos****************************/
    lbBtnInsert: 'Ad<u>i</u>cionar',
    lbBtnUpdate: '<u>M</u>odificar',
    lbBtnDelete: 'Eliminar',

    lbBtnCancel: 'Cancelar',
    lbTtpBtnCancel: 'Cerrar ventana sin guardar los datos <b>(Alt+X)</b>',
    lbBtnApply: 'Aplicar',
    lbTtpBtnApply: 'Guardar datos y limpiar los campos <b>(Ctrl+Alt+P)</b>',
    lbBtnAccept: 'Aceptar',
    lbTtpBtnAccept: 'Guardar datos y cerrar ventana <b>(Enter)</b>',

    validationOnlyAlpha: 'Solo admite caracteres alfanum&eacute;ricos.',
    validationOnlyAlphaSpacer: 'Solo admite caracteres alfanum&eacute;ricos y el caracter especial espacio.',
    validationEmptyField: 'Este campo es obligatorio.',
    validationMaxLength_50: 'El tama&ntilde;o m&iacute;nimo requerido es 50 caracteres.',
    validationMaxLength_150: 'El tama&ntilde;o m&iacute;nimo requerido es 150 caracteres.',

    lbTitleListModule: 'Listado de m&oacute;dulos',

    waitTextSaveDataModule: 'Guardando datos del m&oacute;dulo',
    successInsertModule: 'El m&oacute;dulo ha sido adicionado satisfactoriamente.',
    failureInsertModuleExistDenom: 'El m&oacute;dulo que quiere adicionar ya existe.',
    failureInsertModuleExistIdentif: 'Ya existe un m&oacute;dulo con este identificador.',

    successUpdateModule: 'El m&oacute;dulo ha sido modificado satisfactoriamente.',
    failureUpdateModuleExistDenom: 'El m&oacute;dulo ya existe.',

    waitTextDeleteData: 'Eliminando datos de los m&oacute;dulos',
    questionDeleteModuleSingular: '¿Est&aacute; seguro que quiere eliminar el m&oacute;dulo seleccionado?',
    questionDeleteModulePlural: '¿Est&aacute; seguro que quiere eliminar los m&oacute;dulos seleccionados?',
    successDeleteModuleSingular: 'El m&oacute;dulo ha sido eliminado satisfactoriamente.',
    successDeleteModulePlural: 'Los m&oacute;dulos han sido eliminados satisfactoriamente.',
    failureDeleteModuleInUse: 'El m&oacute;dulo seleccionado no se puede eliminar debido a que est&aacute; en uso.',

    lbBtnTtpInsertModule: 'Adicionar m&oacute;dulo <b>(Alt+I)</b>',
    lbBtnTtpUpdatetModule: 'Modificar m&oacute;dulo <b>(Alt+M)</b>',
    lbBtnTtpDeletetModule: 'Eliminar m&oacute;dulo <b>(DEL)</b>',

    lbColIdentificador: 'Identificador',
    lbColDenominacion: 'Denominaci&oacute;n',

    titleWinInsert: 'Adicionar m&oacute;dulo',
    titleWinUpdate: 'Modificar m&oacute;dulo',

    /****************************Tags Reportes****************************/
    lbTitleListReporte: 'Listado de reportes',
    lbNodeRootReporte: 'Reportes',

    lbBtnInsert: 'Adicionar',
    lbBtnUpdate: 'Modificar',
    lbBtnDelete: 'Eliminar',
    lbBtnActivar: 'Activar',
    lbBtnDesactivar: 'Desactivar',

    lbBtnTtpInsertReporte: 'Adicionar reporte',
    lbBtnTtpUpdatetReporte: 'Modificar reporte',
    lbBtnTtpDeletetReporte: 'Eliminar reporte',
    lbBtnTtpActivarReporte: 'Activar reporte',
    lbBtnTtpDesactivarReporte: 'Desactivar reporte',

    lbTitlePanelReporteDetails: 'Detalles del reporte',
    lbEmptyReporteDetails: '<i>Seleccione un reporte para m&aacute;s informaci&oacute;n...</i>',

    lbFieldAgrupador: 'Agrupador',
    lbFieldGeneral: 'General',
    lbFieldFormatoExcel: 'Formato excel',
    lbFieldContentType: 'Tipo contenido',
    lbColRecurso: 'Recurso',
    lbFieldUrl: 'Url',
    lbFieldComponentName: 'Nombre componente',
    validationRecurso: 'Solo admite caracteres alfanum&eacute;ricos y el caracter especial (.).',
    validationUrl: 'Solo admite caracteres alfanum&eacute;ricos y los caracteres epeciales (./).',
    validationComponentName: 'Solo admite caracteres alfanum&eacute;ricos y el caracter especial (.).',

    reportContentTypeServerFile: 'Archivo generado servidor',
    reportContentTypeJasperFile: 'Archivo generado servidor jasper',
    reportContentTypeComponent: 'Componente visual',

    titleWinInsertReporte: 'Adicionar reporte',
    titleWinUpdateReporte: 'Modificar reporte',

    waitTextSaveDataReporte: 'Guardando datos del reporte',
    successInsertReporte: 'El reporte ha sido adicionado satisfactoriamente.',
    failureInsertReporteExistDenom: 'El reporte que quiere adicionar ya existe.',
    failureInsertReporteExistIdentif: 'Ya existe un reporte con este identificador.',

    questionDeleteReporte: '¿Est&aacute; seguro que quiere eliminar el reporte seleccionado?',
    successDeleteReporte: 'El reporte ha sido eliminado satisfactoriamente.',
    waitTextDeleteDataReporte: 'Eliminando datos de los reportes',

    questionActivarReporte: '¿Est&aacute; seguro que desea activar el reporte seleccionado?',
    successActivarReporte: 'El reporte ha sido activado satisfactoriamente.',
    waitTextActivarReporte: 'Activando reporte',

    questionDesActivarReporte: '¿Est&aacute; seguro que desea desactivar el reporte seleccionado?',
    successDesActivarReporte: 'El reporte ha sido desactivado satisfactoriamente.',
    waitTextDesActivarReporte: 'Desactivando reporte',

    successUpdateReporte: 'El reporte ha sido modificado satisfactoriamente.',
    failureUpdateReporteExistDenom: 'El reporte ya existe.',

    /****************************Tags Filtros****************************/
    lbBtnCrudFilter: 'Filtros',
    lbBtnTtpDCrudFilter: 'Gestionar filtros',

    blTitleListFilter: 'Listado de filtros',
    lbBtnCerrar: 'Cerrar',
    lbTtpBtnCerrar: 'Cerrar ventana',

    lbColType: 'Tipo',
    lbColParamName: 'Nombre par&aacute;metro',
    lbColOrden: 'Orden',
    lbFieldJavaStype: 'Tipo dato java',

    lbBtnTtpInsertFilter: 'Adicionar filtro',
    lbBtnTtpUpdatetFilter: 'Modificar filtro',
    lbBtnTtpDeleteFilter: 'Eliminar filtro',

    validationMaxLength_100: 'El tama&ntilde;o m&iacute;nimo requerido es 100 caracteres.',
    validationOnlyAlphaUndescore: 'Solo admite caracteres alfanum&eacute;ricos y el caracter especial (_).',
    validationMaxMinValueOrden: 'Solo admite n&uacute;meros enteros entre 1 y 99.',

    lbFsFuenteDatos: 'Fuente de los datos',
    lbFieldSql: 'Sentencia sql',
    validationMaxLength_255: 'El tama&ntilde;o m&iacute;nimo requerido es 255 caracteres.',
    lbFieldService: 'Servicio',
    lbFieldDesplayField: 'Campo mostrar',
    lbFieldValueField: 'Campo valor',

    lbFieldMaxLength: 'Longitud m&aacute;xima',
    lbFieldMinLength: 'Longitud m&iacute;nima',
    validationMaxMinValue_999: 'Solo admite n&uacute;meros enteros entre 1 y 999.',

    lbFieldAnchoColumna: 'Ancho columna',

    lbFieldMinValue: 'Valor m&iacute;nimo',
    lbFieldMaxValue: 'Valor m&aacute;ximo',
    validationMaxMinValue_999999: 'Solo admite n&uacute;meros enteros entre 1 y 999999.',

    lbActionFilterText: 'Texto',
    lbActionFilterDate: 'Fecha',
    lbActionFilterNumeric: 'N&uacute;mero',
    lbActionFilterNomenclador: 'Nomenclador',
    lbActionFilterEstructura: 'Estructura',

    titleWinInsertFilter: 'Adicionar filtro',
    titleWinUpdateFilter: 'Modificar filtro',

    waitTextSaveDataFilter: 'Guardando datos del filtro',
    successInsertFilter: 'El filtro ha sido adicionado satisfactoriamente.',
    failureInsertFilterExistDenom: 'El filtro que quiere adicionar ya existe.',
    successUpdateFilter: 'El filtro ha sido modificado satisfactoriamente.',
    failureUpdateFilterExistDenom: 'El filtro ya existe.',

    questionDeleteFilterSingular: '¿Est&aacute; seguro que quiere eliminar el filtro seleccionado?',
    questionDeleteFilterPlural: '¿Est&aacute; seguro que quiere eliminar los filtros seleccionados?',
    successDeleteFilterSingular: 'El filtro ha sido eliminado satisfactoriamente.',
    successDeleteFilterPlural: 'Los filtros han sido eliminados satisfactoriamente.',
    waitTextDeleteDataFilter: 'Eliminando datos de los filtros',
};