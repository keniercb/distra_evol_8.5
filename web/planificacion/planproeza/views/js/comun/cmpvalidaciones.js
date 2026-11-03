Utilidades.Cmp.Cmpvalidaciones = function () {
    var _this = this;
    var msjerrortextoregido = '';
    var cadena = /^$/;

    /* Ext.override(Ext.form.TextField, {
     initComponent:function(){
     this.maxLengthText = 'El tamaño máximo requerido es '+ this.maxLength +' caracteres.'
     }
     });*/

    this.ObtenerMsjErrorTextoRegido = function (nombrecampo) {
        switch (nombrecampo) {
            case'denominacion':
                msjerrortextoregido = 'Solo admite caracteres alfanuméricos y los caracteres especiales (- _ ' + "''" + ' "" () , . /).';
                break;
            case'car':
                msjerrortextoregido = 'Este valor es incorrecto. Solo se permiten n&uacute;meros.';
                break;
            case'fecha':
                msjerrortextoregido = 'El formato establecido: dd/mm/aaaa.';
                break;
            case'decimal2':
                msjerrortextoregido = 'Este valor es incorrecto. El formato debe de ser xx.xx para valores num&eacute;ricos solamente.';
                break;
            case'denominacion-correo':
                msjerrortextoregido = 'Solo admite caracteres alfanuméricos y los caracteres especiales (- _ ' + "''" + ' "" () , . / @).';
                break;
        }
        return msjerrortextoregido;
    };

    this.expresionRegular = function (nombrecampo) {
        switch (nombrecampo) {
            case 'denominacion':
                //cadena = /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9'"()_\-/,.]+)([\s]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9'"()_\-/,.])*$/;
                cadena = /^([a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.]*)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9]+)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.])*$/;
                break;
            case 'hora':
                cadena = /^(([0[0-9]|1[0-9]|2[0-3]):[0-5][0-9])([/s]{0,1}([am]|[AM]|[pm]|[PM]))$/;
                break;
            case 'denominacion-correo':
                cadena = /^([a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.@]*)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9@]+)([\s]*[a-zA-ZÁÉÍÓÚÜáéíóúñüÑ0-9'"()_\-/,.]@)*$/;
                break;
        }
        return cadena;
    };

    this.validacionesVtypes = function (validacion) {
        switch (validacion) {
            case 'validarEspaciosEnBlanco':
                Ext.apply(Ext.form.VTypes, {
                    validarEspaciosEnBlanco: function (value, field) {
                        return (!(/^\s+|\s+$/.test(value)));
                    },
                    validarEspaciosEnBlancoText: 'No se admite el uso del espacio antes ni después del valor del campo.'
                });
                return 'validarEspaciosEnBlanco';
                break;
            case 'validarHoraInicioFin':
                Ext.apply(Ext.form.VTypes, {
                    validarHoraInicioFin: function (value) {
                    },
                    validarHoraInicioFin: ''
                });
                return 'validarHoraInicioFin';
                break;
            default:
                return null;
        }
    }


}


