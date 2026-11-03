Ext.ns('LOG.lb.gestplanconteo');
LOG.lb.gestplanconteo.Idioma = {
    // Títulos .
    tlGestionPlanes: 'Gestionar planes de conteoo',
    tlAdicionarPlan: 'Adicionar plan de conteo en Elaboraci\xf3n',
    tlSubsistemas: 'Seleccionar subsistemas',
    //Etiquetas de las columnas
    cgEjercicio: 'Ejercicio',
    cgPeriodo: 'Per\xedodo',
    cgEstado: 'Estado',
    cgPorciento: 'Porciento',
    cgCreadoPor: 'Creado por',
    cgAprobadoPor: 'Aprobado por',
    cgDenominacion: 'Denominaci\xf3n',
    //Etiquetas de los botones
    lbBtnAdicionar: 'Adicionar',
    lbBtnModificar: 'Modificar',
    lbBtnAplicarPorciento: 'Aplicar porciento',
    lbBtnAprobar: 'Aprobar',
    lbBtnEliminar: 'Eliminar',
    lbBtnAnularEstado: 'Anular estado',
    lbBtnConfirmar: 'Confirmar',
    lbBtnNuevo: 'Nuevo',
    lbBtnImprimirList: 'Imprimir listado',
    lbBtnSubsistemas: 'Subsistemas',
    //Etiquetas de los tooltip
    ttBtnAdicionar: 'Adicionar plan de conteo',
    ttBtnModificar: 'Modificar plan de conteo.',
    ttBtnEliminar: 'Eliminar plan de conteo',
    ttBtnModificarPeriodos: 'Modificar per\xedodos del plan de conteo.',
    ttBtnAprobar: 'Aprobar per\xedodo del plan de conteo',
    ttBtnAnularEstado: 'Anular per\xedodo del plan de conteo',
    ttBtnConfirmar: 'Confirmar per\xedodo del plan de conteo',
    ttBtnImprimirList: 'Imprimir plan de conteo',
    ttBtnSubsistemas: 'Seleccionar subsistema',
    ttBtnAplicarPorciento: 'Aplicar porciento a los per\xedodos',
    //textos de error
    porcietoNoPermitido: 'El per\xedodo no est\xE1 en estado de Elaboraci\xf3n.',
    //Etiquetas de los mensajes
    msgSelectObjeto: 'Seleccione un periodo del plan de conteo',
    msgPlanConteoExiste: 'El plan de conteo que desea adicionar ya existe',
    msgPlanAdicionadoSatisfactorio: 'El plan de conteo ha sido adicionado satisfactoriamente.',
    msgModificarPlanConteo: 'El plan de conteo ha sido modificado satisfactoriamente.',
    msgAplicarPeriodo: 'Se aplic\xf3 el porciento seleccionado a todos los per\xedodos en estado de Elaboraci\xf3n satisfactoriamente.',
    msgPeriodoConfirmado: function(nbperiodo) {
        return 'El per\xedodo ' + nbperiodo + ' del plan de conteo ha sido confirmado satisfactoriamente.';
    },
    msgPeriodoAnulado: function(nbperiodo) {
        return 'El estado del per\xedodo ' + nbperiodo + ' del plan de conteo ha sido anulado satisfactoriamente.';
    },
    msgPeriodoAprobado: function(nbperiodo) {
        return 'El per\xedodo ' + nbperiodo + ' del plan de conteo ha sido aprobado satisfactoriamente.';
    },
    msgObjetoEliminado: 'El plan de conteo ha sido eliminado satisfactoriamente',
    msgAdicionandoPlan: 'Adicionando plan de conteo',
    msgModificandoPorciento: 'Modificando porciento del per\xedodo',
    msgAplicandoPlan: 'Aplicando porciento',
    msgConfirmandoPeriodo: 'Confirmando el per\xedodo',
    msgAnulandoPeriodo: 'Anulando estado del per\xedodo',
    msgAprobandoPeriodo: 'Aprobando el per\xedodo',
    msgDeleteObjeto: '¿Est\xe1 seguro que desea eliminar el plan de conteo?',
    msgConfirmarConfirmar: function(nbperiodo) {
        return '¿Est\xe1 seguro que desea confirmar el per\xedodo ' + nbperiodo + '?';
    },
    msgConfirmarAprobar: function(nbperiodo) {
        return '¿Est\xe1 seguro que desea aprobar el per\xedodo ' + nbperiodo + ' del plan de conteo?';
    },
    msgConfirmarAplicar: function(porciento) {
        return '¿Est\xe1 seguro que desea aplicar el ' + porciento + '% a todos los per\xedodos del plan de conteo que se encuentran ' +
                'en estado de Elaboraci\xf3n?';
    },
    msgConfirmarAnular: function(nbperiodo) {
        return '¿Est\xe1 seguro que desea anular el estado del per\xedodo ' + nbperiodo + '?';
    }

};

