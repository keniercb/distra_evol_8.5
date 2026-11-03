Ext.ns('UCID.VTypes');
UCID.VTypes = {
    registrar:function(name,config){
        if(name){
            if(config && (config.regExp || config.fnValidar) && config.mensaje){
                var vtype = {};
                vtype[name] = function(val, field){
                    if(config.regExp instanceof RegExp){
                        if(config.regExp.test(val) && val.match(config.regExp)){
                            return true;
                        }else
                            return false;
                    }else if(config.fnValidar){
                        return config.fnValidar(val,field);
                    }
                    /*if(field.maxLength){
                        if(val.length > field.maxLength){
                            Ext.VTypes[name+'Text'] = (config.maxMensaje) ? config.maxMensaje : 'La cantidad de caracteres debe ser inferior a '+field.maxLength;
                        }
                    }
                    if(field.minLength){
                        if(val.length > field.minLength){
                            Ext.VTypes[name+'Text'] = (config.minMensaje) ? config.maxMensaje : 'La cantidad de caracteres debe ser superior a '+field.minLength;
                        }
                    }*/
                }
                vtype[name+'Text'] = config.mensaje;
                if(config.mask && config.mask instanceof RegExp)
                    vtype[name+'Mask'] = config.mask;
                Ext.apply(Ext.form.VTypes,vtype);
            }
        }
    },
    setMensaje:function(name,mensaje){
        Ext.form.VTypes[name+"Text"] = mensaje;
    }
};

/////-----VTYPES-----//////
UCID.VTypes.registrar('vtusername',{regExp:/^([a-zA-ZáéíóúñÑ ]+ ?[a-zA-ZáéíóúñÑ ]*)+[^;]*$/,mensaje:""});
UCID.VTypes.registrar('vtdirip',{regExp:/^([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){2}(\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]))$/,mensaje:"Este campo debe ser una direcci&#243;n ip con el formato 195.12.54.36"});
UCID.VTypes.registrar('vtarchivo',{regExp:/^[a-zA-Z0-9]+[^\\\/:"<>\?\|;.\*]*$/,mensaje:"Solo admite caracteres alfanuméricos excepto /:*?<>;.."});
UCID.VTypes.registrar('vtnombre',{regExp:/^([a-zA-ZáéíóúñÑ ]+ ?[a-zA-ZáéíóúñÑ ]*)+$/,mensaje:"Solo admite letras."});
UCID.VTypes.registrar('vtnumero',{regExp:/^([ 0-9\d]+ ?[ 0-9\d]*)+$/,mensaje:"Solo admite números."});
UCID.VTypes.registrar('vnombrenumero',{regExp:/^([a-zA-ZáéíóúñÑ 0-9]*)+$/,mensaje:"Solo admite caracteres alfanuméricos."});
UCID.VTypes.registrar('vtcorreo',{regExp:Ext.form.VTypes.emailMask,mensaje:"Este campo debe ser una direcci&#243;n de correo electr&#243;nico con el formato 'usuario@dominio.ext';"});
UCID.VTypes.registrar('vtalfanumericos',{regExp:/(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóÁÉÍÓÚúñÑ\d\_\s]*))$/,mensaje:"Solo admite caracteres alfanuméricos."});
UCID.VTypes.registrar('vtalfanumericosguiones',{regExp:/(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\s\-]*))$/,mensaje:"Solo admite caracteres alfanuméricos y los caracteres especiales (-_)."});
UCID.VTypes.registrar('vtmonto',{regExp:/^(-?\d{1,10})([.]\d{1,2})?$/,maskRe:/^(-?\d{1,10})([.]\d{1,2})?$/,mensaje:"Solo admite números enteros.Con 2 cifras decimales."});

Ext.apply(Ext.form.VTypes, {
    daterange : function(val, field) {
        var date = field.parseDate(val);

        if(!date){
            return;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = Ext.getCmp(field.startDateField);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;
        }
        else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = Ext.getCmp(field.endDateField);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }
        /*
         * Always return true since we're only using this vtype to set the
         * min/max allowed values (these are tested for after the vtype test)
         */
        return true;
    }
});