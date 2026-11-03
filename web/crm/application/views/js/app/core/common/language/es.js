/**
 * En esta Clase se definen todas las etiquetas que son comunes para todos los modulos
 * (las definidas en el estandar de mensajeria)
 *
 * @author  Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 *     require: 'CRM.core.utils.GlobalFuntions'
 */
Ext.define('CRM.core.common.language.es',{
    //singleton: true,
    config: {
        /* Generals */
        nameApp: 'Plataforma de Gesti&oacute;n de Relaciones con Clientes',
        shortNameApp: 'PCRM',
        lbLoadingModules: 'Por favor espere mientras el sistema carga los m&oacute;dulos que necesita.',
        lbCopyrigth: 'Copyright &copy; 2015 - '+ new Date().getFullYear() +' XETID. Todos los derechos reservados.',
        /* Labels */
        "lbOpen": 'Abrir <b>Ctrl+O</b>',
        "lbSave": 'Guardar <b>Ctrl+S</b>',
        "lbSaveAs": 'Guardar como... <b>Ctrl+Shit+S</b>',
        "lbClose": 'Cerrar <b>Ctrl+Q</b>',
        /* Buttons */
        lbBtnAdd: 'Ad<u>i</u>cionar',
        lbBtnMod: '<u>M</u>odificar',
        lbBtnPrint: 'Imprimir',
        lbBtnDel: 'Eliminar',
        lbBtnHeredar: 'Heredar',
        lbBtnCancel: 'Cancelar',
        lbBtnDetail: 'Ver detalles',
        lbBtnApply: 'Aplicar',
        lbBtnAccept: 'Aceptar',
        lbBtnhelp: 'Ayuda',
        lbBtnUp: 'Subir',
        lbBtnDown: 'Bajar',
        lbBtnAbout:'Acerca de',
        lbBtnSupport:'Soporte',
        lbbusqueda:'B&uacute;squeda',
        lbBtnPrevView: 'Vista previa',

        /* Tooltips */
        qtipPinNavbar: 'Anclar este panel',
        qtipUnpinNavbar: 'Desanclar este panel',
            /* BOTONES */
        qtipAdd: UtilsFn.getLabelsTpl('Adicionar <#concepto#> <b>(Alt+I)</b>',[]),
        qtipMod: UtilsFn.getLabelsTpl('Modificar <#concepto#> <b>(Alt+M)</b>',[]),
        qtipDel: UtilsFn.getLabelsTpl('Eliminar <#concepto#> <b>(DEL)</b>',[]),
        qtipDetail: 'Ver detalles',
        qtipPrint: UtilsFn.getLabelsTpl('Imprimir <#concepto#>',[]),
        qtipUp: UtilsFn.getLabelsTpl('Subir <#concepto#>',[]),
        qtipDown: UtilsFn.getLabelsTpl('Bajar <#concepto#>',[]),
        qtipSortAsc: 'Orden ascendente',
        qtipSortDesc: 'Orden descendente',
        qtipPrevView: UtilsFn.getLabelsTpl('Vista previa',[]),
            /* AYUDA */
        qtipSystemHelp: 'Ayuda del sistema',
        qtipHelp: 'Mostrar ayuda de la funcionalidad <b>(Ctrl+F1)</b>',
        qtipAbout:'Acerca de <b>(Ctrl+F2)</b>',
        qtipSupport:'Soporte del sistema <b>(Ctrl+F3)</b>',
        lbCompletado:'% completado',
        titleAyuda:'Ayuda del sistema',
            /* BUSCAR */
        qtipSearch: UtilsFn.getLabelsTpl('Buscar <#concepto#> <b>(Alt+B)</b>',[]),
        qtipAvanSearch: UtilsFn.getLabelsTpl('B&uacute;squeda avanzada de <#concepto#>',[]),
        qtipCleanFilter: 'Limpiar filtro <b>(Alt+L)</b>',
        qtipCleanFilters: 'Limpiar filtros <b>(Ctrl+Alt+L)</b>',
        qtipCancelSearch: UtilsFn.getLabelsTpl('Cerrar ventana sin buscar <art> <#concepto#>', [
            {pattern: '<art>', sustitutions:{SF:'la',SM: 'el',PF:'las',PM:'los'}}
        ]),
        qtipAcceptSearch: UtilsFn.getLabelsTpl('Buscar <art> <#concepto#> y cerrar ventana', [
            {pattern: '<art>', sustitutions:{SF:'la',SM: 'el',PF:'las',PM:'los'}}
        ]),
            /* DESHACER */
        qtipUndo: 'Deshacer los cambios',
            /* SALIR */
        qtipClose: 'Cerrar ventana',
            /* GUARDAR */
        qtipSave: UtilsFn.getLabelsTpl('Guardar datos <prep> <art> <#concepto#>', [
            {pattern: '<art>', sustitutions:{SF:'la',SM: 'el',PF:'las',PM:'los'}},
            {pattern: '<prep>',sustitutions:{SF:'de',SM: 'del', PF:'de',PM:'de'}}
        ]),
        /* VENTANAS */
        qtipCancel: 'Cerrar ventana sin guardar los datos',
        qtipApply: 'Guardar datos y limpiar los campos',
        qtipAccept: 'Guardar datos y cerrar ventana',
        titleAdd:'Adicionar ',
        titleMod:'Modificar ',
        titleSel:'Seleccionar ',

        /* Messages */
            /*TITLES*/
        titleConfirm: 'Confirmaci&oacute;n',
        titleInfo: 'Informaci&oacute;n',
        titleError: 'Error',
            /* CARGA DE DATOS */
        msgNoDataLoaded: 'No existen datos que mostrar.',
        msgLoading: 'Cargando...',
        msgLoadingData: 'Cargando datos',
        msgNoAnswer:'El servidor no responde. Espere m&aacutes tarde para realizar esta acci&oacuten.',
        msgSesionExpired:'La acci&oacute;n, no se ha podido ejecutar porque su sesi&oacute;n ha expirado. Realice nuevamente la acci&oacute;n despu&eacute;s de autenticarse',
            /* ADD */
        msgAddSuccess: UtilsFn.getLabelsTpl('<art> <#concepto#> <auxv> sido <action> satisfactoriamente.', [
            {pattern: '<art>', sustitutions:{SF:'La',SM: 'El',PF:'Las',PM:'Los'}},
            {pattern: '<action>', sustitutions:{SF:'adicionada',SM: 'adicionado',PF:'adicionadas',PM:'adicionados'}},
            {pattern: '<auxv>', invariante: true, sustitutions:{S:'ha',P: 'han'}}
        ]),
        msgAddFail: UtilsFn.getLabelsTpl('<art> <#concepto#> no se <auxv> podido adicionar debido a <#problema#>.', [
            {pattern: '<art>', sustitutions:{SF:'La',SM: 'El',PF:'Las',PM:'Los'}},
            {pattern: '<auxv>', invariante: true, sustitutions:{S:'ha',P: 'han'}}
        ]),
        msgAddExist: UtilsFn.getLabelsTpl('<art> <#concepto#> que desea adicionar ya <e>.', [
            {pattern: '<art>', sustitutions:{SF:'La',SM: 'El',PF:'Las',PM:'Los'}},
            {pattern: '<e>', invariante:true, sustitutions:{S:'existe',P: 'existen'}}
        ]),
        msgAddSelRequire: UtilsFn.getLabelsTpl('Debe seleccionar <art> <#concepto#> a <art> cual desea adicionar <#atributo#>.', [
            {pattern: '<art>', sustitutions:{SF:'la',SM: 'el',PF:'las',PM:'los'}},
        ]),
        msgAttrExist: UtilsFn.getLabelsTpl('Ya <e> <pron> <#concepto#> con <#prond#> <#atributo#>.', [
            {pattern: '<pron>', sustitutions:{SF:'una',SM: 'un',PF:'algunas',PM:'algunos'}},
            //{pattern: '<prond>', sustitutions:{SF:'esta',SM: 'este',PF:'estas',PM:'estos'}},
            {pattern: '<e>', invariante: true, sustitutions:{S:'existe',P: 'existen'}}
        ]),
        msgDataExist: UtilsFn.getLabelsTpl('Ya <e> <pron> <#concepto#> con estos datos.', [
            {pattern: '<pron>', sustitutions:{SF:'una',SM: 'un',PF:'algunas',PM:'algunos'}},
            {pattern: '<e>', invariante: true, sustitutions:{S:'existe',P: 'existen'}}
        ]),
        msgInfoExist: 'Ya existe esta informaci&oacute;n.',
            /* MOD */
        msgModSuccess: UtilsFn.getLabelsTpl('<art> <#concepto#> <auxv> sido <action> satisfactoriamente.', [
            {pattern: '<art>', sustitutions:{SF:'La',SM: 'El',PF:'Las',PM:'Los'}},
            {pattern: '<action>', sustitutions:{SF:'modificada',SM: 'modificado',PF:'modificadas',PM:'modificados'}},
            {pattern: '<auxv>', invariante: true, sustitutions:{S:'ha',P: 'han'}}
        ]),
        msgModSelRequire: UtilsFn.getLabelsTpl('Debe seleccionar <art> <#concepto#> que desea modificar.', [
            {pattern: '<art>', sustitutions:{SF:'la',SM: 'el',PF:'las',PM:'los'}},
        ]),
        msgModExist: UtilsFn.getLabelsTpl('<art> <#concepto#> que desea modificar ya <e>.', [
            {pattern: '<art>', sustitutions:{SF:'La',SM: 'El',PF:'Las',PM:'Los'}},
            {pattern: '<e>', invariante:true, sustitutions:{S:'existe',P: 'existen'}}
        ]),
        msgModFail: UtilsFn.getLabelsTpl('<art> <#concepto#> no se <auxv> podido modificar debido a <#problema#>.', [
            {pattern: '<art>', sustitutions:{SF:'La',SM: 'El',PF:'Las',PM:'Los'}},
            {pattern: '<auxv>', invariante: true, sustitutions:{S:'ha',P: 'han'}}
        ]),
            /* DEL */
        msgDelConfirm: UtilsFn.getLabelsTpl('¿Est&aacute; seguro que desea eliminar <art> <#concepto#> <sel>?', [
            {pattern: '<art>', sustitutions:{SF:'la',SM: 'el',PF:'las',PM:'los'}},
            {pattern: '<sel>', sustitutions:{SF:'seleccionada',SM: 'seleccionado',PF:'seleccionadas',PM:'seleccionados'}},
            {pattern: '<postfix>',invariante: true, sustitutions:{S:'',P:'s'}}
        ]),
        msgDelDataConfirm: UtilsFn.getLabelsTpl('“¿Est&aacute; seguro que desea eliminar <art> <data> <sel>?', [
            {pattern: '<art>', sustitutions:{SF:'la',SM: 'el',PF:'las',PM:'los'}},
            {pattern: '<data>',invariante: true, sustitutions:{S:'dato',P: 'datos'}},
            {pattern: '<sel>', sustitutions:{SF:'seleccionada',SM: 'seleccionado',PF:'seleccionadas',PM:'seleccionados'}}
        ]),
        msgDelSuccess: UtilsFn.getLabelsTpl('<art> <#concepto#> <auxv> sido <action> satisfactoriamente.', [
            {pattern: '<art>', sustitutions:{SF:'La',SM: 'El',PF:'Las',PM:'Los'}},
            {pattern: '<action>', sustitutions:{SF:'eliminada',SM: 'eliminado',PF:'eliminadas',PM:'eliminados'}},
            {pattern: '<auxv>', invariante: true, sustitutions:{S:'ha',P: 'han'}}
        ]),
        msgDelSelRequire: UtilsFn.getLabelsTpl('Debe seleccionar <art> <#concepto#> que desea eliminar.', [
            {pattern: '<art>', sustitutions:{SF:'la',SM: 'el',PF:'las',PM:'los'}},
        ]),
        msgDelInUse: UtilsFn.getLabelsTpl('<art> <#concepto#> seleccionad<posfix> no se puede eliminar debido a que est&aacute en uso.', [
            {pattern: '<art>', sustitutions:{SF:'La',SM: 'El'}},
            {pattern: '<posfix>', sustitutions:{SF:'a',SM: 'o'}}
        ]),
        msgDelFail: UtilsFn.getLabelsTpl('<art> <#concepto#> no se <auxv> podido eliminar debido a <#problema#>.', [
            {pattern: '<art>', sustitutions:{SF:'La',SM: 'El',PF:'Las',PM:'Los'}},
            {pattern: '<auxv>', invariante: true, sustitutions:{S:'ha',P: 'han'}}
        ]),
            /* GUARDAR */
        msgSaveSuccess: UtilsFn.getLabelsTpl('<art> <#concepto#> <auxv> sido <action> satisfactoriamente.', [
            {pattern: '<art>', sustitutions:{SF:'La',SM: 'El',PF:'Las',PM:'Los'}},
            {pattern: '<action>', sustitutions:{SF:'guardada',SM: 'guardado',PF:'guardadas',PM:'guardados'}},
            {pattern: '<auxv>', invariante: true, sustitutions:{S:'ha',P: 'han'}}
        ]),
        msgSaveFail: UtilsFn.getLabelsTpl('<art> <#concepto#> <auxv> sido <action> debido a la ocurrencia de un error.', [
            {pattern: '<art>', sustitutions:{SF:'La',SM: 'El',PF:'Las',PM:'Los'}},
            {pattern: '<action>', sustitutions:{SF:'guardada',SM: 'guardado',PF:'guardadas',PM:'guardados'}},
            {pattern: '<auxv>', invariante: true, sustitutions:{S:'ha',P: 'han'}}
        ]),
            /* CONFIG */
        msgConfSuccess: UtilsFn.getLabelsTpl('<art> <#concepto#> <auxv> sido <action> satisfactoriamente.', [
            {pattern: '<art>', sustitutions:{SF:'La',SM: 'El',PF:'Las',PM:'Los'}},
            {pattern: '<action>', sustitutions:{SF:'configurada',SM: 'configurado',PF:'configuradas',PM:'configurados'}},
            {pattern: '<auxv>', invariante: true, sustitutions:{S:'ha',P: 'han'}}
        ]),
            /* BUSQUEDAS */
        msgSearchNoMatches: UtilsFn.getLabelsTpl('No existen datos que se correspondan con <art> criterio<postfix> de b&uacute;squeda especificado<postfix>.', [
            {pattern: '<art>',invariante: true, sustitutions:{S:'el',P:'los'}},
            {pattern: '<postfix>',invariante: true, sustitutions:{S:'',P:'s'}}
        ]),

        /* VALIDATIONS */
        vBlankText: 'Este campo es obligatorio.',
        vInvalidFields: 'Por favor verifique nuevamente que existen campos con valores incorrectos.',
        vInvalidText: 'Este valor es incorrecto.',
        maxLengthText: 'El tamaño m&aacute;ximo requerido es <x> caracteres.',
        minLengthText: 'El tamaño m&iacute;nimo requerido es <x> caracteres.',
            /* FECHA */
        vIniDateLtFinDate: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
        vFinDateGtIniDate: 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
            /* NUMEROS */
        vNumDomain: 'Solo admite números <#dominio#>.',
        vNumDomainLength: 'Solo admite números <#dominio#> de <#> dígitos.',
        vNumDomainMaxLength: 'Solo admite números <#dominio#> de hasta <#> dígitos.',
        vNumDomainDecimal: 'Solo admite números <#dominio#> de <#> dígitos. Con <#> cifras decimales.',
        vNumDomainMaxDecimal: 'Solo admite números <#dominio#> de <#> dígitos. Con hasta <#> cifras decimales.',
        vNumDomainRange: 'Solo admite números <#dominio#> entre <#min#> y <#max#>.',
        vNumDomainRangeDec: 'Solo admite números <#dominio#> entre <#min#> y <#max#>. Con <#> cifras decimales.',
            /* LETRAS */
        vLettersOnly: 'Solo admite letras.',
        vLettersAndChars: UtilsFn.getLabelsTpl('Solo admite letras y <art> <chars> <e> <#chars#>.', [
            {pattern: '<art>', sustitutions:{SF:'',SM: 'el',PF:'',PM:'los'}},
            {pattern: '<chars>', invariante: true, sustitutions:{S:'caracter',P: 'caracteres'}},
            {pattern: '<e>', invariante: true, sustitutions:{S:'especial',P: 'especiales'}}
        ]),
            /* ALFANUMERICOS */
        vAlphanum: 'Solo admite caracteres alfanum&eacute;ricos.',
        vAlphanumAndChar: UtilsFn.getLabelsTpl('Solo admite caracteres alfanum&eacute;ricos y <art> <chars> <e> <#chars#>.', [
            {pattern: '<art>', sustitutions:{SF:'',SM: 'el',PF:'',PM:'los'}},
            {pattern: '<chars>', invariante: true, sustitutions:{S:'caracter',P: 'caracteres'}},
            {pattern: '<e>', invariante: true, sustitutions:{S:'especial',P: 'especiales'}}
        ]),
        vAlphanumNotChar: UtilsFn.getLabelsTpl('Solo admite caracteres alfanum&eacute;ricos exceptuando <art> <chars> <e> <#chars#>.', [
            {pattern: '<art>', sustitutions:{SF:'',SM: 'el',PF:'',PM:'los'}},
            {pattern: '<chars>', invariante: true, sustitutions:{S:'caracter',P: 'caracteres'}},
            {pattern: '<e>', invariante: true, sustitutions:{S:'especial',P: 'especiales'}}
        ]),

        /* OTROS */
        lbTitleWait: 'Por favor espere...',
        msgWait: UtilsFn.getLabelsTpl('Guardando datos <prep> <art> <#concepto#>', [
            {pattern: '<art>', sustitutions:{SF:'la',SM: '',PF:'las',PM:'los'}},
            {pattern: '<prep>',sustitutions:{SF:'de',SM: 'del', PF:'de',PM:'de'}}
        ]),
        msgDelWait: UtilsFn.getLabelsTpl('Eliminando datos <prep> <art> <#concepto#>', [
            {pattern: '<art>', sustitutions:{SF:'la',SM: '',PF:'las',PM:'los'}},
            {pattern: '<prep>',sustitutions:{SF:'de',SM: 'del', PF:'de',PM:'de'}}
        ]),
        msgLoadingForm:'Creando formulario',
        lbTabClose: 'Cerrar',
        lbTabCloseAll: 'Cerrar todos',
        lbTabCloseOthers: 'Cerrar otros',
        lbquitar: 'Quitar ',

        /* CONCEPTOS */
        textNomMedioPago:"Medio de pago",
        textPlNomMedioPago:"Medios de pago",
        textNomEstado:"Estado",
        textPlNomEstado:"Estados",
        textNomEntregable:"Entregable",
        textPlNomEntregable:"Entregables",
        textNomClausula:"Cl\xE1usula",
        textPlNomClausula:"Cl\xE1usulas",
        textNomIncoterm:"Incoterms",
        textNomTransicion:"Transici\xF3n",
        textPlNomTransicion:"Transiciones",
        textNomPeriodicidad:"Periodicidad",
        textPlNomPeriodicidad:"Periodicidades",
        textNomPrioridad:"Prioridad",
        textPlNomPrioridad:"Prioridades",
        textNomTipoReclamacion:"Tipo de reclamación",
        textP1NomTipoReclamacion:"Tipo de reclamación",
        textNomTipoPenalidad:"Tipo de penalidad",
        textP1NomTipoPenalidad:"Tipo de penalidad",
        textNomTalleres:"Taller",
        textP1NomTalleres:"Taller",
        textNomContable:"Contable",
        textP1NomContable:"Contable",
        textDatProforma:"Proforma",
        textPlDatProforma:"Proformas",
        textDatTipoContrato:"Tipo de contrato",
        textPlDatTipoContrato:"Tipos de contrato",
        textNomClienteproveedor: "Cliente y Proveedor",
        textPlNomClienteproveedor: "Clientes y Proveedores",
        textDatContrato:"Contrato marco",
        textPlDatContrato:"Contratos marco",
        textPlNomCuestionarioperfil:"Cuestionarios",
        textPlNomPreguntaperfil:"Preguntas de perfil",
        textPlNomRespuestaperfil:"Respuestas a preguntas",
        textPlNomTiporespuestaperfil:"Tipos de respuesta",
        textNomPreguntaperfil:"Pregunta de perfil",
        textNomCuestionarioperfil:"Cuestionario",
        textNomRespuestaperfil:"Respuesta a preguntas",
        textNomTiporespuestaperfil:"Tipo de respuesta",
        textNomSector:"Sector",
        textPlNomSector:"Sectores",
        textNomProceso:"Proceso",
        textPlNomProceso:"Procesos",
        textNomTipoContrato:"Tipo de contrato",
		textNomTipoLinea:'Tipo de linea',
        textPlNomTipoContrato:"Tipos de contratos",
        textNomFormatoNumContrato:"Formato",
        textPlNomFormatoNumContrato:"Formatos",
        textNomTipoCodigo:"Tipo de c\xF3digo",
        textPlNomTipoCodigo:"Tipos de c\xF3digos",
        textNomTipoFacultad:"Tipo de facultad",
        textPlNomTipoFacultad:"Tipos de facultades",
		textNomOrganismo:"Organismo",
        textPlNomOrganismo:"Organismos",
        textConfiguracionInicioAutomatico: "configuraci\xF3n de inicio autom\xE1tico",
        textConfiguracionInicioAutomaticoEx: "La configuraci\xF3n de inicio autom\xE1tico no se ha podido guardar, contacte con el administrador.",
        textDatArea:"\xC1rea",
        textPlDatArea:"\xC1reas",
        textNomPuertoOrigen:"Puerto de origen",
        textPlNomPuertoOrigen:"Puertos de origen",
        textNomPuertoDestino:"Puerto de destino",
        textPlNomPuertoDestino:"Puertos de destino",
        textNomTiempoEntrega: 'Tiempo de entrega',
        textPlNomTiempoEntrega: 'Tiempos de entrega',
        textNomTipoVehiculo: 'Tipo de vehículo',
        textPlNomTipoVehiculo: 'Tipos de vehículos',
        textNomEmbalaje:"Envase o embalaje",
        textPlNomEmbalaje:"Envases o embalajes",
        textNomTipoContenedor:"Tipo de contenedor",
        textPlNomTipoContenedor:"Tipos de contenedores",
        textNomTipoEntrega: 'Tipo de entrega',
        textPlNomTipoEntrega: 'Tipos de entrega',
        textNomCategoria:"Categor&iacute;a",
        textPlNomCategoria:"Categor&iacute;as",
        textNomTipoPrograma:"Tipo de programa",
        textPlNomTipoPrograma:"Tipos de programa",
        textDatPersonaParametro:"Persona",
        textPlDatPersonaParametro:"Personas",
        textNomMedioTransporte:"Medio de transporte",
        textPlNomMedioTransporte:"Medios de transporte",
        textNomDestinoComercial:"Destino comercial",
        textPlNomDestinoComercial:"Destinos comerciales",
        textNomClienteFinal:"Cliente final",
        textPlNomClienteFinal:"Clientes finales",

        /* Acerca de*/
        lbTitleAbout : 'Gesti&oacuten comercial',
        lbDescriptionAbout : 'Engloba e integra los procesos relacionados con la contratación, marketing, clientes y proveedores ,... ' +
        'Permite la personalización de los distintos contratos de una empresa, asi como la posibilidad de ofrecer a sus clientes información ' +
        'acerca de sus productos y servicios a través de campañas. Ofrece además mecanismos para identificar oportunidades en el mercado.',
        lbAuthorAbout:'Centro de Integraci&oacuten e interoperabilidad'
    }
});