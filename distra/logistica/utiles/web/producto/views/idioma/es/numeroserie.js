Ext.ns('LOG.lb.numeroserie');

LOG.lb.numeroserie.Idioma = {
    // Titulo de ventana.
    tlNumeroserie: 'Nº. de serie',

    // Concepto de busqueda.
    lbBuscar: 'Nº. de serie',
    lbConcepto:'n\xfamero(s) de serie',
    
    // Columnas del grid.
    gcNroserie: 'Nº. de serie',
    gcFechaFabricacion: 'A\xf1o de fabricaci\xf3n',
    gcUbicacion: 'Ubicaci\xf3n',
    gcNumero: 'N\xfamero',
    gcAnno: 'A\xf1o',
    gcTipo: 'Situaci\xf3n',
    gcEstado: 'Estado',
    gcMarca: 'Marca',
    gcModelo: 'Modelo',
    gcNroPieza: 'N\xfamero de pieza',
    
    // Panel superior.
    lbSinRestringir: 'Sin restringir',
    lbCantidad: 'Cantidad',
    lbNroserie: 'Nº. de serie',
    lbTfFechaFabricacion: 'A\xf1o de fabricaci\xf3n',
    lbCbUbicacion: 'Ubicaci\xf3n',
    lbTfNumero: 'N\xfamero',
    lbTfAnno: 'A\xf1o',
    lbCbTipo: 'Situaci\xf3n',
    lbCbMarca: 'Marca',
    lbCbModelo: 'Modelo',
    lbTfNroPieza: 'N\xfamero de pieza',
    
    lbNroDoc: 'Nº. documento',
    lbTipoDoc: 'Tipo de documento',
    lbTipoAjuste: 'Motivo de ajuste',
    lbDenominacion:'Denominaci\xf3n',
    lbFechaContable:'Fecha contable',
    btnAplicarTodos: 'Aplicar a todos',
    
    // Busqueda avanzada.
    lbCbEstado: 'Estado',
    
    // Botones
    ttBtnAdicionarSerie:'Adicionar n\xfamero de serie',
    ttBtnEliminar:'Eliminar n\xfamero de serie',
    ttBtnImprimir:'Imprimir listado de n\xfameros de series',
    textBtnCerrar:'Cerrar',
    textBtnOcultar:'Ocultar',
    ttBtnNuevoSerie:'Adicionar nuevo n\xfamero de serie',
    ttBtnGuardarSerie:'Guardar datos del n\xfamero de serie',
    ttBtnAplicarTodos:'Aplicar cambias a todos los n\xfameros de serie',

    
    // Mensajes globales.
    msgSalvandoObjeto: 'Guardando n\xfamero(s) de serie.',
	lbMsgObjetoSalvado: 'El(Los) n\xfamero(s) de serie ha(n) sido guardado(s) satisfactoriamente.',
    msgSelectObjeto: 'Debe seleccionar uno o varios n\xfameros de serie.',
    msgDeleteObjeto: '\xbfEst\xe1 seguro que desea eliminar el(los) n\xfameros(s) de serie seleccionado(s)\x3f',
	msgEliminandoObjeto: 'Eliminando n\xfamero(s) de serie',
	msgObjetoEliminado: 'El(Los) n\xfamero(s) de serie ha(n) sido eliminado(s) satisfactoriamente.',
    msgErrorEliminandoUna: 'El n\xfamero de serie que desea eliminar est\xe1 en estado contabilizado.',
    msgErrorEliminando: 'Existe(n) n\xfamero(s) de serie que desea eliminar en estado contabilizado.',

    // Mensajes locales.
    msgAddMayorOrdenado: 'La cantidad que desea adicionar es mayor que la ordenada.',
    msgDiferenciaConteo: 'El n\xfamero de serie no puede ser adicionado porque exede la cantidad registrada en el conteo.'
};


LOG.lb.numeroserie.Estado = {
    1: 'Creado',
    2: 'Disponible',
    3: 'No disponible',
    4: 'Baja'
};