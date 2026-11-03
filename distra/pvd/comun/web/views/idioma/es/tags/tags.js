/**
 * Created by Miguel Antonio on 10/05/2016.
 */
Ext.ns('PVD.Lang');

PVD.Lang.msg = {
    successInsert: {
        token: '{0} {1} {2} sido {3} satisfactoriamente.',
        values: ['El', '{params}', 'ha', 'adicionado']
    },
    successUpdate: {
        token: '{0} {1} {2} sido {3} satisfactoriamente.',
        values: ['El', '{params}', 'ha', 'modificado']
    },
    successDelete: {
        token: '{0} {1} {2} sido {3} satisfactoriamente.',
        values: ['El', '{params}', 'ha', 'eliminado']
    },
    successSave: {
        token: '{0} {1} {2} sido {3} satisfactoriamente.',
        values: ['El', '{params}', 'ha', 'guardado']
    },
    failureInsertExist: {
        token: '{0} {1} que quiere adicionar ya existe.',
        values: ['El', '{params}']
    },
    failureUpdateExist: {
        token: '{0} {1} ya existe.',
        values: ['El', '{params}']
    },
    failureDeleteUse: {
        token: '{0} {1} seleccionad{2} no se {3} eliminar debido a que {4} en uso.',
        values: ['El', '{params}', 'o', 'puede', 'está']
    },
    failureUpdateExistConcept: {
        token: 'Ya existe {0} {1} con {2}.',
        values: ['un', '{params}', '{params}']
    },
    questionDelete: {
        token: '¿Est&aacute; seguro que quiere eliminar {0} {1} seleccionad{2}?',
        values: ['el', '{params}', 'o']
    },
    emptyData: {
        token: 'No existen datos que mostrar.'
    },
    emptyDataSearch: {
        token: 'No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.'
    },
    emptyFieldSearch: {
        token: 'Criterio a buscar...'
    },
    emptyFieldText: {
        token: 'Seleccione...'
    },
    waitLoadData: {
        token: 'Cargando...'
    },
    waitTitleSendData: {
        token: 'Por favor espere...'
    },
    waitTextSaveData: {
        token: 'Guardando datos {0} {1}',
        values: ['de', '{params}']
    },
    waitTextDeleteData: {
        token: 'Eliminando datos {0} {1}',
        values: ['de', '{params}']
    },
    titleMsgInfo: {
        token: 'Informaci&oacute;n'
    },
    titleMsgQuestion: {
        token: 'Confirmaci&oacute;n'
    },
    titleMsgError: {
        token: 'Error'
    },
    titleWinInsert: {
        token: 'Adicionar {0}',
        values: ['{params}']
    },
    titleWinUpdate: {
        token: 'Modificar {0}',
        values: ['{params}']
    },
    titleWinSelect: {
        token: 'Seleccione {0} {1}',
        values: ['el', '{params}']
    }
};

PVD.Lang.field = {
    abrev: {
        token: 'Abreviatura'
    },
    denom: {
        token: 'Denominaci&oacute;n'
    },
    fcreacion: {
        token: 'Fecha creaci&oacute;n'
    },
    ffinuso: {
        token: 'Fecha fin uso'
    },
    finicio: {
        token: 'Fecha inicio'
    },
    ffin: {
        token: 'Fecha fin'
    },
};

PVD.Lang.action = {
    insert: {
        token: 'Adicionar'
    },
    insertHotKey: {
        token: 'Ad<u>i</u>cionar'
    },
    ttpInsert: {
        token: 'Adicionar {0} <b>(Alt+I)</b>',
        values: ['{params}']
    },
    update: {
        token: 'Modificar'
    },
    updateHotKey: {
        token: '<u>M</u>odificar'
    },
    ttpUpdate: {
        token: 'Modificar {0} <b>(Alt+M)</b>',
        values: ['{params}']
    },
    delete: {
        token: 'Eliminar'
    },
    ttpDelete: {
        token: 'Eliminar {0} <b>(DEL)</b>',
        values: ['{params}']
    },
    cancel: {
        token: 'Cancelar'
    },
    ttpCancel: {
        token: 'Cerrar ventana sin guardar los datos <b>(Alt+X)</b>'
    },
    apply: {
        token: 'Aplicar'
    },
    ttpApply: {
        token: 'Guardar datos y limpiar los campos <b>(Ctrl+Alt+P)</b>'
    },
    accept: {
        token: 'Aceptar'
    },
    ttpAccept: {
        token: 'Guardar datos y cerrar ventana <b>(Enter)</b>'
    },
    searchAdvanced: {
        token: 'B&uacute;squeda avanzada'
    },
    ttpSearchAdvanced: {
        token: 'B&uacute;squeda avanzada de {0}',
        values: ['{params}']
    },
    search: {
        token: 'Buscar'
    },
    searchHotKey: {
        token: '<u>B</u>uscar'
    },
    ttpSearch: {
        token: 'Buscar {0}',
        values: ['{params}']
    },
    clean: {
        token: 'Limpiar'
    },
    cleanhHotKey: {
        token: '<u>L</u>impiar'
    },
    ttpClean: {
        token: 'Limpiar filtros'
    },
    filter: {
        token: 'Filtrar'
    },
    ttpFilter: {
        token: 'Filtrar',
    },
    help: {
        token: 'Ayuda'
    },
    helpHotKey: {
        token: 'Ayuda'
    },
    ttpHelp: {
        token: 'Mostrar ayuda de la funcionalidad'
    },
    config: {
        token: 'Configurar'
    },
    ttpConfig: {
        token: 'Configurar datos {0} {1}',
        values: ['de', '{params}']
    },
    closeTab: {
        token: 'Cerrar {0}',
        values: ['{params}']
    },
    selectAll: {
        token: 'Seleccionar todos'
    },
    expandAll: {
        token: 'Expandir'
    },
    ttpExpandAll: {
        token: 'Expandir todos'
    },
    collapseAll: {
        token: 'Contraer'
    },
    ttpCollapseAll: {
        token: 'Contraer todos'
    },
    close: {
        token: 'Cerrar'
    },
    ttpClose: {
        token: 'Cerrar ventana'
    },
    activate: {
        token: 'Activar'
    },
    ttpActivate: {
        token: 'Activar {0}',
        values: ['{params}']
    },
    ficha: {
        token: 'Ficha'
    },
    ttpFicha: {
        token: 'Mostrar ficha de {0}',
        values: ['{params}']
    },
    save: {
        token: 'Guardar'
    },
    saveHotKey: {
        token: 'Guardar'
    },
    ttpSave: {
        token: 'Guardar datos {0} {1}',
        values: ['de', '{params}']
    },
    export: {
        token: 'Exportar'
    },
    ttpExport: {
        token: 'Exportar datos {0} {1} <b>(Alt+E)</b>',
        values: ['de', '{params}']
    }
};

PVD.Lang.validation = {
    emptyField: {
        token: 'Este campo es obligatorio.'
    },
    errorDateFormat: {
        token: 'El formato establecido: dd/mm/aaaa.'
    },
    errorEmailFormat: {
        token: 'El formato establecido: usuario@dominio.ext.'
    },
    onlyLetter: {
        token: 'Solo admite letras.'
    },
    onlyLetterSCh: {
        token: 'Solo admite letras y {0} {1} {2} ({3}).',
        values: ['el', 'caracter', 'especial', '{params}']
    },
    onlyAlpha: {
        token: 'Solo admite caracteres alfanum&eacute;ricos.'
    },
    onlyAlphaSCh: {
        token: 'Solo admite caracteres alfanum&eacute;ricos y {0} {1} {2} ({3}).',
        values: ['el', 'caracter', 'especial', '{params}']
    },
    onlyNum: {
        token: 'Solo admite n&uacute;meros enteros.'
    },
    onlyFileExtension: {
        token: 'Solo admite {0} con extensi&oacute;n {1}.',
        values: ['{params}', '{params}']
    },
    maxSizeFile: {
        token: 'Solo admite {0} con un tama&ntilde;o m&aacute;ximo de {1}.',
        values: ['{params}', '{params}']
    },
    maxLengthLetter: {
        token: 'El tama&ntilde;o m&aacute;ximo requerido es {0} {1}.',
        values: ['{params}', 'caracter']
    },
    minLengthLetter: {
        token: 'El tama&ntilde;o m&iacute;nimo requerido es {0} {1}.',
        values: ['{params}', 'caracter']
    },
    maxLengthDig: {
        token: 'El tama&ntilde;o m&aacute;ximo requerido es {0} d&iacute;git{1}.',
        values: ['{params}', 'o']
    },
    minLengthDig: {
        token: 'El tama&ntilde;o m&iacute;nimo requerido es {0} d&iacute;git{1}.',
        values: ['{params}', 'o']
    },
    maxTextDate: {
        token: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.'
    },
    minTextDate: {
        token: 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.'
    },
    rangeValueDig: {
        token: 'Solo admite n&uacute;meros enteros entre {0} y {1}.',
        values: ['{params}', '{params}']
    },
};