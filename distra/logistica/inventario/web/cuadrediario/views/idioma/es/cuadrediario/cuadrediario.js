Ext.ns('LOG.inv.cuadrediario');
LOG.inv.cuadrediario.Idioma = {
    lbDep: 'Dep\xf3sito',
    lbDfFecha: 'Fecha actual',
    lbEstado: 'Estado',
    lbUltCierre: 'Último cierre',
    lbProductos: 'Productos(s)',
    lbSaldoInv: 'Saldo inventario',
    lbSaldoIni: 'Saldo inicial',
    lbSaldoFin: 'Saldo final',
    lbSaldoMov: 'Saldo movimientos',
    lbSaldoCont: 'Saldo contable',
    lbDifSaldo: 'Diferencia',
    lbEsApertura: 'Apertura',
    lbCreadoPor: 'Creado por',
    lbAprobadoPor: 'Aprobado por',
    lbBtnFechaUltCierre: 'Fecha último cierre',
    cgCodigo:'C\xf3digo',
    cgDiferencia: 'Diferencia',
    cgPrecio: 'Precio',
    cgExistencia: 'Existencia',
    cgImporte: 'Importe',
    cgDiferencia: 'Diferencia',
    cgProductos: 'Producto(s)',
    cgClasificacion: 'Clasificaci\xf3n contable',
    tlAdicionar: 'Realizar cuadre diario de almacén',
    tlVerDetalles: 'Ver detalles cuadre diario de almacén',
    cgDenominacion:'Denominaci\xf3n',
    cgCuenta: 'Cuenta',
    
    chValorCierre: 'Valores de cierre:',
    chValorPrecioCosto: 'Valor a precio costo:',
    chValorTotalAgrupado: 'Valor total agrupado por:',
    chExistValorAgrupado: 'Existencia en valor agrupado por:',
    chResumenVentaXAlmacen: 'Resumen de venta por almacén',
    chValorPrecioCostoDoc: 'Resumen de operaciones por documentos',
    
    /* chExistValorXClasif: 'Existencia en valor por clasificación',
    chExistValorXCategoria: 'Existencia en valor por naturaleza',
    chUFisicasPrecioCosto: 'En unidades físicas a precio de costo',
    chUFisicasPrecioVenta: 'En unidades físicas a precio de venta', */


    fsClasificacionContable: 'Clasificación contable',
    
    fsNaturalezas: 'Naturalezas',

    btnMostrar: '<u>M</u>ostrar',
   	btnLimpiar:'<u>L</u>impiar',
    ttBtnMostrar:'Mostrar reporte(s) <b>(Ctrl+Alt+M)</b>',
    ttBtnLimpiar: 'Limpiar filtro(s) <b>(Alt+L)</b>',
    tlVentanaClasifContab: 'Selecionar clasifición contable',
    tlVentanaNaturalezas: 'Selecionar naturaleza',

    msgAbrirDia: 'Se ha realizado la apertura del día satisfactoriamente',
    msgCerrarDia: 'Se ha realizado el cierre del día satisfactoriamente',
    msgCrearCIerre: 'Se ha creado el cierre del día satisfactoriamente',
    msgAbrirProxDia: 'Se ha realizado la apertura del proximo día satisfactoriamente',
    msgBloquearDia: 'Se ha bloqueado el cierre del día satisfactoriamente',
    msgEliminarCierre: 'Se ha eliminado el cierre diario satisfactoriamente',
    msgGuardandoDatos: 'Guardando datos',
    msgEspere: 'Por favor espere.',
    tlRangoFecha: 'Rango de fecha',
    lbCriterio: 'Criterio',
    lbDesde: 'Desde',
    lbHasta: 'Hasta',
}; 
/* Ext.ns('LOG.inv.cuadrediario');

LOG.inv.cuadrediario.Idioma = {
    // Titulos de ventana.
    tlAdicionar: 'Adicionar transferencia interna',
    
    // Botones
    
    lbBtnProducto: 'Productos',

    lbBtnLote: 'Lote',

    lbBtnNroSerie: 'No. Serie',

    lbBtnImprimirListado: 'Imprimir listado',

    lbBtnImprimirModelo: 'Imprimir modelo',

    lbBtnRevertir: 'Revertir',

    lbBtnTraspasar: 'Traspasar',

    lbAreas: '\xe1reas',

    lbCantidadTraspasada: 'CT: Cantidad traspasada',

//    lbExistencia: 'E: Existencia',

    lbCantidadDisponible: 'CD: Cantidad disponible',

    lbCantidad: 'Cantidad',

    lbObservaciones: 'Observaciones',

    lbNumero: 'N\xfamero',

    lbEstado: 'Estado',

    lbAreaOrigen: 'Origen',

    lbAreaDestino: 'Destino',

    lbTipoTransferencia: 'Tipo de transferencia',

    lbCreadoPor: 'Creado por',

    lbAprobadoPor: 'Aprobado por',

    lbDesde: 'Desde',

    lbHasta: 'Hasta',

    lbSeleccione: 'Seleccione...',

    lbEstiba: 'Estiba',

    lbHilera: 'Hilera',

    lbCbTipoTransferenciaArea: 'Tipo de transferencia',

    concepto: 'transferencias interna',

    lbCbAreaOrigen: 'Dep\xf3sito origen',

    lbCbAreaDestino: 'Dep\xf3sito destino',

    lbCbOperacionOrigen: 'Operaci\xf3n documento de salida',

    lbCbOperacionDestino: 'Operaci\xf3n documento de entrada',

    lbCbUbicacionOrigen: 'Ubicaci\xf3n de origen',

    lbCbUbicacionDestino: '\Ubicaci\xf3n de destino',

    cgTipoTransferencia: 'Tipo de transferencia',

    cgExistenciaArea: 'Existencia en \xe1rea',

    cmUbicacionOrigen:'Ubicaci\xf3n de origen',

    cmUbicacionDestino:'Ubicaci\xf3n de destino',

    cmCantidadTransferida:'Cantidad transferida',

    cmEstiba: 'Estiba',

    cmHilera: 'Hilera',

    cgAreaOrigen: 'Origen',

    cgAreaDestino: 'Destino',

    tlPanelGeneral: 'Detalles generales',

    tlAreaOrigen: 'Origen',

    tlAreaDestino: 'Destino',

    tlRangoFecha: 'Rango de fecha',

    tlFSDatosProducto: 'Datos del producto',

    tlFSDatosUbicacion: 'Datos de la ubicaci\xf3n',

    tlVentanaAdicionar: 'Adicionar transferencia interna',

    // Etiquetas de los tooltips

    ttBtnRevertir: 'Revertir cantidad',

    ttBtnTraspasar: 'Traspasar cantidad',

    ttBtnProducto: 'Adicionar productos',

    ttBtnLote: 'Adicionar lotes',
    
    ttBtnEliminarProd: 'Eliminar producto del documento',

    ttBtnNroSerie: 'Adicionar n\xfamero de serie',

    ttBtnVerDetalles: 'Ver detalles de la transferencia interna',

    ttBtnEliminar: 'Eliminar transferencia interna',

    ttBtnConfirmar: 'Confirmar transferencia interna',

    ttBtnAnular: 'Anular estado de la transferencia interna',

    ttBtnAprobar: 'Aprobar transferencia interna',

    ttBtnDuplicar: 'Duplicar transferencia interna',

    ttBtnContabilizar: 'Contabilizar transferencia interna',

    ttBtnImprimir: 'Imprimir transferencia interna',

    ttBtnGuardar: 'Guardar datos del documento de transferencia',
    
    // Panel de transferencia.
    
    lbExistencia: 'Existencia',
    lbDisponible: 'Disponible',

    // Etiquetas de los mensajes

    msjMaxLengthText: 'El tama\xf1o m\xe1ximo requerido es 255 caracteres.',

    msjMinLengthText: 'El tama\xf1o m\xednimo requerido es 2 caracteres.',

    msgSelectObjeto: 'Debe seleccionar una transferencia interna.',

    msgDeleteObjeto: '\xbfEst\xe1 seguro que desea eliminar la transferencia interna seleccionada\x3f',

    msgConfirmarDocumento: '\xbfEst\xe1 seguro que desea confirmar la transferencia interna seleccionada\x3f',

    msgAnularEstadoDocumento: '\xbfEst\xe1 seguro que desea anular el estado de la transferencia interna seleccionada\x3f',

    msgAprobarDocumento: '\xbfEst\xe1 seguro que desea aprobar la transferencia interna seleccionada\x3f',

    msgDuplicarDocumento: '\xbfEst\xe1 seguro que desea duplicar la transferencia interna seleccionada\x3f',

    msgDeleteMovObjeto: '\xbfEst\xe1 seguro que desea eliminar el producto seleccionado\x3f',

    msgObjetoEliminado: 'La transferencia interna ha sido eliminada satisfactoriamente.',

    msgDocumentoConfirmado: 'La transferencia interna ha sido confirmada satisfactoriamente.',

    msgEstadoDocumentoAnulado: 'El estado de la transferencia interna ha sido anulado satisfactoriamente.',

    msgDocumentoAprobado: 'La transferencia interna ha sido aprobada satisfactoriamente.',

    msgDuplicarAnulado: 'La transferencia interna ha sido duplicada satisfactoriamente.',

    msgCantidadSalvada: 'Se ha traspasado la cantidad deseada.',

    msgEliminandoObjeto: 'Eliminando documento...',

    msgSalvandoObjeto: 'Salvando los datos...',

    lbMsgObjetoErrorSalvado: 'No se pudo guardar la transferencia.',

    lbMsgErrorTransferir: 'La cantidad a transferir no puede ser mayor que la existencia de la ubicaci\xf3n.',

    lbMsgErrorRevertir: 'La cantidad a revertir no puede ser mayor que la transferida.',

    lbMsgNoTranfAreas: 'No se pueden realizar transferencias interna iguales.',

    lbMsgNoCantidadTransferencia: 'El área de origen seleccionada no tiene cantidad disponible para poder transferir',


    lbLineaprod: "L\xednea de producto",
    lbCbConceptoRetenido: 'Concepto de retenido',
    lbCbMotivoDevolucion: 'Motivo de devoluci\xf3n',
    lbCbDevolucion: 'Devoluci\xf3n',
    btnLote: 'Lote',
    cgDenominacion:'Denominaci\xf3n',
    cgUEmd:'UEmb',
    cgPresentacion:'Presentaci\xf3n',
    cgPrecioVenta:'Precio venta',
    cgImporteVenta:'Importe venta',
    cgImporteCosto:'Importe',
    cgPreciocosto:'Precio',
    cgExistencia:'Existencia',
    cgDisponible:'Disponible',
    cgClasificacion:'Clasificaci\xf3n',
    
    cgNroLote:'Nro.lote',
    cgFechaFabricacion: 'Fecha de fabricaci\xf3n',
    cgFechaVencimiento: 'Fecha de vencimiento',
    cgUbicacion: 'Ubicaci\xf3n',
    msgErrorSelecCombo:"El dep\xf3sito destino no puede coincidir con el dep\xf3sito origen.",    
    msgEspere: 'Por favor espere.',
    lbMsgObjetoSalvado : 'Los datos han sido guardados satisfactoriamente.',
    msgDatosIncorrectos: 'Verifique los datos que existen valores incorectos.',
    msgProductoEliminado: 'Los datos han sido eliminados satisfactoriamente.',
    msgEliminandoProducto: 'Eliminando datos',
    msgAdicionandoProducto: 'Guardando datos',

} */