/**
 * Created by lily on 9/03/15.
 */

Ext.define ('Conf.util.idioma.es', {

    alias: 'widget.idioma_es',
    idioma:{

        /**------------Comun-----------------------------**/
        cargando               : 'Cargando',
        buscar                 : 'Buscar',
        blankText              : 'Este campo es obligatorio.',
        fieldLabelDenominacion : 'Denominación',
        fieldLabelDescripcion  : 'Descripción',

        adicionarSub           : 'Adicionar subsistema <b style="float: right; margin-left: 125px; margin-top: -17px;">(Alt+I+S)</b>',
        adicionarFunc          : 'Adicionar funcionalidad <b style="float: right; margin-left: 125px; margin-top: -17px;">(Alt+I+F)</b>',
        adicionarRec           : 'Adicionar recurso <b style="float: right; margin-left: 110px; margin-top: -17px;">(Alt+I+R)</b>',

        titleArbolReferencia   : 'Árbol de Referencias',

        cancelar               : 'Cancelar',
        toolTipcancelar        : 'Cerrar ventana sin guardar los datos <b>(Alt+X)</b>',
        aceptar                : 'Aceptar',
        toolTipaceptar         : 'Guardar datos y cerrar ventana <b>(Enter)</b>',

        /**------------TreeDD.js-----------------------------**/
        titleTree              : 'Subsistemas registrados',

        /**------------PanelMenuIzquierdo.js-----------------------------**/
        adicionarMenuIz        : 'Adicionar componente', //<b>(Alt+I) + (S, F ó R)</b>
        adicionarCategoria     : 'Adicionar categoria <b>(Alt+I+C)</b>',
        adicionarCateg         : 'Adicionar categoria',
        adicionarSubsistema    : 'Adicionar subsistema <b>(Alt+I+S)</b>',

        adicionarFuncionalidad : 'Adicionar funcionalidad <b>(Alt+I+F)</b>',

        adicionarRecurso       : 'Adicionar recurso <b>(Alt+I+R)</b>',

        eliminarMenuIz         : 'Eliminar componente <b>(DEL)</b>',
        exportarSubsistema     : 'Exportar sistema <b>(Alt+E)</b>',
        importarSubsistema     : 'Importar sistema <b>(Ctrl+Alt+I)</b>',
        buscarMenuIz           : 'Buscar <b>(Alt+B)</b>',
        limpiarMenuIz          : 'Limpiar filtro <b>(Alt+L)</b>',

        /**------------PanelDerecho.js-----------------------------**/
        guardar                : 'Guardar cambios <b>(Alt+G)</b>',

        /**------------Formulario.js-----------------------------**/
        titleFieldset          : 'Información',

        fieldLabelAbreviatura  : 'Abreviatura',
        fieldLabelIcono        : 'Ícono',

        boxLabelVisibilidad    : 'Visibilidad',
        boxLabelExterno        : 'Externo',
        cajaReferencia         : 'Seleccione la referencia',
        fieldLabelReferencia   : 'Referencia',
        regexText1             : 'Solo admite caracteres alfanuméricos y los caracteres especiales (-_).',
        regexText2             : 'Solo admite caracteres alfanuméricos',
        buscarReferencia       : 'Buscar referencia <b>(Alt+W)</b>',
        maxLengthText          : 'La longitud máxima para este campo es {0}.',

        /**------------gridEditorAcciones.js-----------------------------**/
        buscarGrid             : 'Buscar acción <b>(Alt+B)</b>',
        limpiarGrid            : 'Limpiar filtro <b>(Ctrl+Alt+L)</b>',

        /**------------panelGrid.js-----------------------------**/
        adicionarAccion        : 'Adicionar acción <b>(Alt+I+A)</b>',
        eliminarAccion         : 'Eliminar acción <b>(Shift+D)</b>',

        /**------------contextMenu.js-----------------------------**/
        eliminarSub            : 'Eliminar subsistema<b style="float: right;  margin-top: -17px;">(DEL)</b>',
        eliminarFunc           : 'Eliminar funcionalidad<b style="float: right; margin-top: -17px;">(DEL)</b>',
        eliminarRec            : 'Eliminar recuso<b style="float: right;margin-left: 85px; margin-top: -17px; ">(DEL)</b>',

        textMaximoCaracteres   : 'El tama&ntilde;o m&aacute;ximo requerido es de {0} caracteres.',

        /**------------arbolRefSist.js-----------------------------**/
        textroot               : 'Subsistemas',

        /**------------arbolRefFunc.js-----------------------------**/
        textroot1              : 'Aplicaciones',

        /**------------storeTreeDD.js-----------------------------**/
        textstore              : 'Subsistemas',

        /**------------windowAccion.js-----------------------------**/
        titleWinAccion         : 'Adicionar acción',

        aplicar                : 'Aplicar',
        toolTipaplicar         : 'Guardar datos y limpiar los campos',

        /**------------windowImportarSistema.js-----------------------------**/
        titlewinImp            : 'Importar sistema',
        fieldLabelImp          : 'Seleccione el sistema para importar',

        /**------------configuracionSub.js-----------------------------**/
        titleFieldsetSubsistema    :'Información del subsistema',
        titleFieldsetFuncionalidad :'Información de la funcionalidad',
        titleFieldsetRecurso       :'Información del recurso',
        titleInsertarSubsistema    :'Insertar subsistema',
        titleInsertarFuncionalidad :'Insertar funcionalidad',
        titleInsertarRecurso       :'Insertar recurso',
        fieldLabelReferenciaExt    :'Referencia al servidor web',
        waitTitle                  :'Por favor espere...',
        waitMsgOnRender            :'Guardando posición',
        waitMsgImpSub              :'Importando sistema',
        informacion                :'Información',
        error                      :'Error',
        confirmacion               :'Confirmación',
        confirmPreg                :'¿Está seguro que quiere eliminar el subsistema seleccionado?',
        waitMsgElimSub             :'Eliminando datos del sistema',
        confirmPreg1               :'¿Está seguro que quiere eliminar la funcionalidad seleccionada?',
        waitMsgElimFunc            :'Eliminando datos de la funcionalidad',
        confirmPreg2               :'¿Está seguro que quiere eliminar el recurso seleccionado?',
        waitMsgElimRec             :'Eliminando datos del recurso',
        waitMsgAddSub              :'Guardando datos del sistema',
        waitMsgAddFunc             :'Guardando datos de la funcionalidad',
        msgErrorAddRec             :'Debe seleccionar al menos una acción para insertar el recurso.',
        msgErrorInsRec             :'Debe marcar al menos una acción para insertar un recurso.',
        waitMsgAddRec              :'Guardando datos del recurso',
        advertencia                :'Advertencia',
        msgAdvertencia             :'Si se le retiran todas las acciones al recurso dejará de existir. ¿Desea seguir con la operación?',
        msgAdvertencia1            :'Algunas acciones han sido desmarcadas. <br>Si desmarca una accion sera eliminada. ¿Desea seguir con la operación?</br>',
        confirmPreg3               :'¿Está seguro que quiere eliminar la acción seleccionada?',
        waitMsgElimAction          :"Eliminando la acción",
        waitMsgElimAction1         :"Eliminando acciones desmarcadas",
        waitMsgInsAcc              :"Insertando la acción",
        waitMsgModAcc              :"Guardando datos de las acciones modificadas",
        waitMsgModAccInt           :"Guardando cambios",
        noseencontrarondatos       :"No existen datos que se correspondan con los criterios de búsqueda especificados.",
        errorformulario            :"Revise los datos del formulario.",
        datossinguardar            :"Existen datos sin guardar, ¿desea continuar?"



    }

});
