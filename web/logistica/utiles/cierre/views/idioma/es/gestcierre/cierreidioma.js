Ext.ns('Log.lb.cierre');

Log.lb.cierre.Idioma = {

    // Columnas del grid de las interfaces.
    cgDocumento: 'No. de documento',
    cgRefer: 'No. de referencia',
    cgAnno: 'A\xf1o',
    cgEstatus: 'Estado',
    cgProductos: 'Cant. productos',
   
    cgServicios: 'Cant. Servicios',
    cgTdoc: 'Tipo de documento',
    cgFecha: 'Fecha',
    cgCreado: 'Creado por',
    cgDenominacion: 'Denominación',

    //Texto de Botones
    tBotonDiario:'Cerrar d\xeda',
    tBotonPeriodo:'Cerrar período',
    tBotonEjercicio:'Cerrar ejercicio',
    tBotonSubsistemas:'Subsistemas',
    tBotonCierreApertura:'Cierre apertura',

    //Tooltip de botones de la interfaz.
    toBotonDiario: 'Realizar el cierre del d\xeda',
    toBotonPeriodo: 'Realizar el cierre del per\xedodo actual',
    toBotonEjercicio: 'Realizar el cierre del ejercicio actual',
    toBotonCierreApertura: 'Realizar el cierre de la apertura',
    tBotonAyuda: 'Ayuda',
    ttBuscar: 'documento',
    //Label de la fecha
    lblPerido:'Per\xedodo actual: ',
    lblDesde:' desde ',
    lblHasta:' hasta ',
    lblFechaContable:' Fecha del subsistema: ',

    //Mensajes
    msjConfirmar: '\xbfEst\xe1 seguro que desea realizar el cierre diario\x3f',
    msjExisten:'Existen',
    msjDocPendientes:'documentos pendientes',
    msjConfirmarDocPen:'\xbfDesea realizar el cierre diario\x3f',
    msjConfirmarDocPenP:'\xbfDesea realizar el cierre del período\x3f',
    msjLoadMask : 'Por favor espere...',
    msjOkCierreD : 'El cierre diario ha sido finalizado satisfactoriamente.',
    msjNoCiereD : 'No se pudo realizar el cierre diario.',
    msjConfirmarP: '\xbfEst\xe1 seguro que desea realizar el cierre del período\x3f',
    msjConfirmarCierrApert: '\xbfEst\xe1 seguro que desea realizar el cierre de apertura\x3f',
    msjOkCierreP: function(mes) {
        return 'El cierre del período ' + mes + ' ha sido finalizado satisfactoriamente.';
    },
    msjMedioSinGrupo: function(medio) {
        return 'El tipo de medio ' + medio + ' no se encuentra asociado a ning\xfan grupo.';
    },
    msjNoCiereP: 'No se pudo realizar el cierre del período.',
    msjCierreDiferencia: 'Usted va a cerrar el período con diferencia.Revise el balance de cuadre de proceso para más información.',
    msjConfirmarE: '\xbfEst\xe1 seguro que desea realizar el cierre del ejercicio\x3f',
    msjOkCierreE: 'El cierre del ejercicio ha sido finalizado satisfactoriamente.',
    msjCierreApertura: 'El cierre de apertura ha sido realizado satisfactoriamente.',
    msjNoCiereE: 'No se pudo realizar el cierre de ejercicio.',
    msjNoCiereEPendientes: 'No se puede hacer el cierre de ejercicio porque existen documentos pendientes.',
    msjSeleccione: 'Por favor seleccione al menos un subsistema',
    msjConfirmarEjerDocPend: ' presenta(n) documentos pendientes ¿Está seguro que desea realizar el cierre del ejercicio\x3f',
    msjErrorEstadoElaboracion: 'Existen documentos de apertura en estado de Elaboraci\xf3n.',
    msjErrorNoCoenciden: 'Los saldos de Inventario no coinciden con las cuentas del Mayor.',
    msjErrorNoCoencidenAft: 'Existen cuentas descuadradas.',
    msjErrorAprobarAperturas: 'Ha ocurrido un error al aprobar los docuemntos de apertura.',
    msjNoTieneCuenta: function(grupo, cuenta) {
        return 'El grupo ' + grupo + ' no tiene asociado una cuenta de '+ cuenta + '';
    }
 



 
};