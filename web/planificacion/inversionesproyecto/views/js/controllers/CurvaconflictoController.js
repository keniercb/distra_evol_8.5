/**
 * Clase controladora para el metodo curva de conflicto
 *
 * @copyright XETID Cuba
 * @author Ing. Frank David Corona Prendes
 * @version 1.0
 */

Planificacion.Integracion.CurvaconflictoController = Ext.extend(Std.Base.Controller, {
    constructor: function() {
        var config = {
            labels: Planificacion.Integracion.Etiquetas,
            globals: {
                dirImg: Planificacion.Integracion.Imagenes
            }
        };
        this.init(config);
    },
    /**
     * Muestra la ayuda del componente
     *
     * @name mostrarAyuda
     * @param referencia
     * @author Ing. Frank David Corona Prendes
     * @copyright XETID Cuba
     */
    mostrarAyuda: function(referencia) {
        var title = 'Ayuda';
        help.show(title, referencia);
    },
    /**
     * Guarda la intensidad del conflicto asociado a un estudio
     * @name guardarIntensidadconflicto
     * @author Ing. Frank David Corona Prendes
     * @copyright XETID Cuba
     */
    guardarIntensidadconflicto: function(ob) {
        var me = this._getItem('intensidad');
        var datosIntensidadconflicto = me.gpIntensidades.getChanges();
        Secodena.mostrarMascara('mascaraInt', 'Guardando datos de la(s) intensidad(es) del conflicto');
        Ext.Ajax.request({
            url: '/planificacion/herramientasintegracion/index.php/curvaconflicto/guardarIntensidadconflicto',
            method: 'POST',
            params: {
                objeto: Ext.encode(datosIntensidadconflicto),
                idestudiocurvaconflicto: Ext.encode(me.idestudiocurvaconflicto)
            },
            callback: function(options, success, response) {
                var result = Ext.decode(response.responseText);
                Secodena.ocultarMascara('mascaraInt');
                if (result.mostrarMens) {
                    mostrarMensaje(1, result.mensaje, function() {
                        me.stIntensidades.reload({params: {concepto: Ext.encode(me.concepto)}});
                        me.fireEvent('habilitar');
                    });
                }else{
                (ob.datosVariables['mod'] != '') ?
                        mostrarMensaje(1, 'La intensidad del conflicto ha sido modificada satisfactoriamente.', function() {
                            me.stIntensidades.reload({params: {concepto: Ext.encode(me.concepto)}});
                        }) : ((ob.datosVariables['add'] != "") ? mostrarMensaje(1, 'La intensidad del conflicto ha sido adicionada satisfactoriamente.', function() {

                    me.stIntensidades.reload({params: {concepto: Ext.encode(me.concepto)}});
                    me.fireEvent('habilitar');


                }) : mostrarMensaje(1, 'La intensidad del conflicto ha sido eliminada satisfactoriamente.', function() {
                    me.stIntensidades.reload({params: {concepto: Ext.encode(me.concepto)}});
                    me.fireEvent('habilitar');

                }));                    
                }
            }
        });
    },
    /**
     * Guarda las mediciones asociadas a un estudio
     * @name guardarMediciones
     * @author Ing. Frank David Corona Prendes
     * @copyright XETID Cuba
     */
    guardarMediciones: function(ob) {
        var me = this._getItem('mediciones');
        var datosMediciones = me.gpMediciones.getChanges();
        Secodena.mostrarMascara('mascaraMed', 'Guardando datos de la(s) medici&oacute;n(es)');
        Ext.Ajax.request({
            url: '/planificacion/herramientasintegracion/index.php/curvaconflicto/guardarMediciones',
            method: 'POST',
            params: {
                objeto: Ext.encode(datosMediciones),
                idestudiocurvaconflicto: Ext.encode(me.idestudiocurvaconflicto)
            },
            callback: function(options, success, response) {
                var resposeData = Ext.decode(response.responseText);

                var msgmod = ((ob.datosVariables['mod'] != '') && (resposeData.counterrors != 0))
                        ? 'Algunas mediciones no han podido ser modificadas debido a que el valor superaba la m&aacute;xima intensidad.'
                        : 'La medici&oacute;n ha sido modificada satisfactoriamente.';
                var msgadd = ((ob.datosVariables['add'] != '') && (resposeData.counterrors != 0))
                        ? 'Algunas mediciones no han podido ser adicionada debido a que el valor superaba la m&aacute;xima intensidad.'
                        : 'La medici&oacute;n ha sido adicionada satisfactoriamente.';
                Secodena.ocultarMascara('mascaraMed');

                (ob.datosVariables['mod'] != '') ?
                        mostrarMensaje(1, msgmod, function() {
                            me.stMediciones.reload({params: {concepto: Ext.encode(me.concepto)}});

                        }) : ((ob.datosVariables['add'] != "") ? mostrarMensaje(1, msgadd, function() {
                    me.stMediciones.reload({params: {concepto: Ext.encode(me.concepto)}});

                }) : mostrarMensaje(1, 'La medici&oacute;n ha sido eliminada satisfactoriamente.', function() {
                    me.stMediciones.reload({params: {concepto: Ext.encode(me.concepto)}});

                }));
            }
        });
    },
    /**
     * Guarda la escala de tiempo para la configuracion de la grafica
     * @name guardarEscalatiempo
     * @author Ing. Frank David Corona Prendes
     * @copyright XETID Cuba
     * @param data
     */
    guardarEscalatiempo: function() {
        var me = this._getItem('intensidad');

        var data = {
            fechainicio: me.dfFechaInicio.value,
            fechaintermedia: me.dfFechaInicioIntermedio.value,
            fechaavanzada: me.dfFechaInicioAvanzado.value,
            descripcion: me.taDescripcion.getValue()
        };

        Secodena.mostrarMascara('mascaraescala', 'Guardando datos de la escala de tiempo');
        Ext.Ajax.request({
            url: '/planificacion/herramientasintegracion/index.php/curvaconflicto/guardarEscalatiempo',
            method: 'POST',
            params: {
                objeto: Ext.encode(data),
                idestudiocurvaconflicto: Ext.encode(me.idestudiocurvaconflicto)
            },
            callback: function(options, success, response) {
                Secodena.ocultarMascara('mascaraescala');
                //me.initValidatorEscalaTiempo();
                mostrarMensaje(1, 'La escala de tiempo ha sido guardada satisfactoriamente.', function() {
                    me.fireEvent('habilitar');
                });
            }
        });
    },
    guardarPlantilla: function(opcion){
        var me = this._getItem('plantilla');
        var plantilla =  (opcion) ? {plantilla: me.gpPlantilla.getChanges(), opcion: opcion} : {plantilla: me.gpPlantillaDatos.getChanges(), opcion: opcion, idintensidadconflictoplantilla: me.smPlantilla.getSelected().data.idintensidadconflictoplantilla};

        Secodena.mostrarMascara('mascplantilla', 'Guardando plantilla');
        Ext.Ajax.request({
            url: '/planificacion/herramientasintegracion/index.php/curvaconflicto/guardarintensidadconflictoplantilla',
            method: 'POST',
            params: {
                objeto: Ext.encode(plantilla)
            },
            callback: function(options, success, response) {
                Secodena.ocultarMascara('mascplantilla');
                var mensaje = (opcion) ? 'Las plantillas han sido guardadas satisfactoriamente.' : 'Los datos de la plantilla han sido guardadados satisfactoriamente.'
                mostrarMensaje(1, mensaje, function() {
                    if(opcion){
                        me.stPlantilla.reload();
                    }else{
                        me.stPlantillaDatos.reload();
                    }
                });
            }
        });
    }
});
