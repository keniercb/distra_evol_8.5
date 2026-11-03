/**
 * @class documentoSolicitudentrega
 * (Descripcion de la clase, objetivo)
 * 
 * @package Inventario
 * @subpackage Salida
 * @author Osmel A. Larduet Hechavarría
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('LOG.inv.salida.solicitudentrega');

LOG.inv.salida.solicitudentrega.Idioma = {
    // Título de ventanas.
    tlVentanaAddsolicitudentrega1: 'Adicionar solicitud entrega',
    tlVentanaAddsolicitudentrega2: ' del ',
    tlVentanaAddsolicitudentrega3: ' en Elaboraci\xf3n',
    tlVentanaAprobar: 'Aprobar solicitud de entrega',

    //tootip
    ttBtnBuscar : 'solicitud de entrega',
    ttBtnAdicionar : 'Adicionar nueva solicitud de entrega',
    ttBtnAbrir : 'Abrir solicitud de entrega',
    ttBtnEliminar : 'Eliminar solicitud de entrega',
    ttBtnConfirmar: 'Confirmar solicitud de entrega',
    ttBtnAnularEstado: 'Anular estado de la solicitud de entrega',
    ttBtnAprobar: 'Aprobar solicitud de entrega',
    ttBtnProductos: 'Adicionar producto(s)',
    ttBtnDuplicar: 'Duplicar solicitud de entrega',
    ttImportar: 'Importar documento',
    ttBtnImprimir: 'Imprimir',
    ttBtnImprimirM: 'Imprimir modelo',
    ttBtnEliminarDoc: 'Eliminar solicitud de entrega',
    ttBtnEliminarProducto: 'Eliminar producto(s)',
    tlVerDetalles: 'Ver detalles de la solicitud de entrega',
    tlAdicionar: 'Adicionar solicitud de entrega',
    tlAprobar: 'Aprobar solicitud de entrega',
    ttBtnNuevo: 'Adicionar nueva solicitud de entrega',
    ttBtnGuardar: 'Guardar datos de la solicitud de entrega',
    
    //Busqueda avanzada.
    lbFsRangoFecha: 'Rango de fecha',
    lbNfNumero: 'N\xfamero',
    lbCbEstado: 'Estado',
    lbCbCreadoPor: 'Creado por',
    lbCbAprobadoPor: 'Aprobado por',
    lbDfDesde: 'Desde',
    lbDfHasta: 'Hasta',
    lbStElaboracion: 'Elaboraci\xf3n',
    lbStPreparado: 'Preparado',
    lbStAprobado: 'Aprobado',

    //Columnas
    cgCentrocosto: 'Centro de costo',
    cgCodigo: 'C\xf3digo',
    cgDenominacion: 'Denominaci\xf3n',
    cgUM: 'UM',
    cgExistencia: 'Existencia',
    cgDisponible: 'Disponible',
    cgCantidad: 'Cantidad',
    cgPrecio: 'Precio',
    cgImporte: 'Importe',
	gcTipoDocOrigen: 'Tipo doc. origen',
	gcDocOrigen: 'Doc. origen',

    // Panel superior de la ventana adicionar.      
    lbObservaciones: 'Observaciones',
    lbCodigo: 'C\xf3digo',
    lbCentrocosto: 'Centro de costo',
	lbTipoDocumento: 'Tipo de documento',
    lbNroDocumento: 'No. de documento',
    lbFechaCreacion: 'Fecha de creaci\xf3n',
	lbFsDatosOrigen: 'Datos del documento que lo origina',
    lbFsDatosEntrega: 'Datos de la entrega',

    //Panel productos
    lbBtnProductos: 'Productos',

    // Mensajes.
    msgSelectObjeto: 'Debe seleccionar una solicitud de entrega',
    msgDeleteObjeto: '\xbfEst\xe1 seguro que desea eliminar la solicitud de entrega seleccionada\x3f',
    msgEliminandoObjeto: 'Eliminando solicitud de entrega',
    msgObjetoEliminado: 'La solicitud de entrega ha sido eliminada satisfactoriamente.',
    msgDeleteMovObjeto: '\xbfEst\xe1 seguro que desea eliminar el(los) producto(s) seleccionado(s)\x3f',
    msgObjetoEliminadoMov: 'El(Los)producto(s) ha(n) sido eliminado(s) satisfactoriamente.',
    msgSalvandoObjeto: 'Guardando solicitud de entrega',
    lbMsgObjetoSalvado: 'La solicitud de entrega ha sido guardada satisfactoriamente.',
    msgConfirmarDocumento: '\xbfEst\xe1 seguro que desea confirmar la solicitud de entrega seleccionada\x3f',
    msgDocumentoConfirmado: 'La solicitud de entrega ha sido confirmada satisfactoriamente.',
    msgAnularEstadoDocumento: '\xbfEst\xe1 seguro que desea anular el estado de la solicitud de entrega seleccionada\x3f',
    msgEstadoDocumentoAnulado: 'El estado de la solicitud de entrega ha sido anulado satisfactoriamente.',
    msgAprobarDocumento: '\xbfEst\xe1 seguro que desea aprobar la solicitud de entrega seleccionada\x3f',
    msgDocumentoAprobado: 'La solicitud de entrega ha sido aprobada satisfactoriamente.',
    msgAnularDocumento: '\xbfEst\xe1 seguro que desea anular la solicitud de entrega seleccionada\x3f',
    msgDocumentoAnulado: 'La solicitud de entrega ha sido anulada satisfactoriamente.',
    msgDuplicarDocumento: '\xbfEst\xe1 seguro que desea duplicar la solicitud de entrega seleccionada\x3f',
    msgDuplicarAnulado: 'La solicitud de entrega ha sido duplicada satisfactoriamente.',
    
    // Botones del grid de productos de la ventana aprobar    
    lbBtnCerrar: 'Cerrar',
    lbBtnAnularEstado: 'Anular estado',
    lbBtnImprimirListado: 'Imprimir listado',
    lbBtnImprimirModelo: 'Imprimir modelo',
}