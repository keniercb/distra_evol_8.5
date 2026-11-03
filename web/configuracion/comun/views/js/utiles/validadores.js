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
                };
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

//Caracteres alfanumericos sin espacios al principio y al final de la cadena
/*UCID.VTypes.registrar('vtAlfanumericoSinEspaciosPrincioFinal',
    {regExp:/^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+(\s*[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc])*)+$/,
    mensaje:"Solo admite caracteres alfanum&eacute;ricos."});*/
//Solo letras sin espacios
UCID.VTypes.registrar('vtLetras',
    {regExp:/^[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+$/,
        mensaje:"Solo admite letras sin espacios."});
//Caracteres alfanumericos sin espacios
UCID.VTypes.registrar('vtAlfanumerico',
    {regExp:/^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+$/,
        mensaje:"Solo admite caracteres alfanum&eacute;ricos sin espacios."});


UCID.VTypes.registrar('vtusername',{regExp:/^([a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃ±Ã‘ ]+ ?[a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃ±Ã‘ ]*)+[^;]*$/,mensaje:"Solo admite letras."});
UCID.VTypes.registrar('vtalfanumerico',{regExp:/^([a-zA-Z0-9 \xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]*)+$/,mensaje:"Solo admite caracteres alfanum&eacute;ricos."});
UCID.VTypes.registrar('vtalfanumericopunto',{regExp:/^([a-zA-Z0-9 \xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\.]*)+$/,mensaje:"Solo admite caracteres alfanum&eacute;ricos y el caracter especial (.)."});
UCID.VTypes.registrar('vtdirip',{regExp:/^([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){2}(\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]))$/,mensaje:"Este campo debe ser una direcci&#243;n ip con el formato 255.255.255.255"});
UCID.VTypes.registrar('vtcorreo',{regExp:Ext.form.VTypes.emailMask,mensaje:"Este campo debe ser una direcci&oacute;n de correo electr&oacute;nico con el formato 'usuario@dominio.ext';"});
UCID.VTypes.registrar('vtarchivo',{regExp:/^[a-zA-Z0-9]+[^\\\/:"<>\?\|;.\*]*$/,mensaje:"Solo admite caracteres alfanum&eacute;ricos excepto (/.:*?<>;)."});
UCID.VTypes.registrar('vtarchivootro',{regExp:/^[a-zA-Z0-9]+[^\\\/:"<>\?\|;\*]*$/,mensaje:"Solo admite caracteres alfanum&eacute;ricos excepto (/:*?<>;)"});
UCID.VTypes.registrar('vtcorreo',{regExp:Ext.form.VTypes.emailMask,mensaje:"Este campo debe ser una direcci&oacute;n de correo electr&oacute;nico con el formato 'usuario@dominio.ext';"});
UCID.VTypes.registrar('vtnumero',{regExp:/^(-?\d{1,2})([.]\d{1,2})?$/,mensaje:"Solo admite n&uacute;meros enteros entre -99.99 y 99.99 .Con 2 cifras decimales."});
UCID.VTypes.registrar('vtnumeroReales',{regExp:/^[0-9]+$/,mensaje:"Solo admite n&uacute;meros reales."});
UCID.VTypes.registrar('vtnumero4dig',{regExp:/^-?\d*$/,mensaje:"Solo admite n&uacute;meros enteros de hasta 4 dígitos."});
UCID.VTypes.registrar('vtnombre',{regExp:/^([a-zA-Z\xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]+ ?[a-zA-Z\xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc]*)+$/,mensaje:"Solo admite letras."});
UCID.VTypes.registrar('vtdescripciones',{regExp:/^([a-zA-Z0-9 \xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\.\;\-\_\(\)\'\:\,]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\.\;\-\_\(\)\'\:\,]*)+$/,mensaje:"Solo admite caracteres alfanum&eacute;ricos y los caracteres especiales (;-_.(),:'')."});
UCID.VTypes.registrar('vtabrev',{regExp:/^([a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃÃ‰ÃÃ“ÃšÃ±Ã‘]+ ?[a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃÃ‰ÃÃ“ÃšÃ±Ã‘]*)+$/,mensaje:"Solo admite letras."});
//UCID.VTypes.registrar('vtalfanumericos',{regExp:/(^([a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃÃ‰ÃÃ“ÃšÃ±Ã‘])+([a-zA-ZÃ¡Ã©Ã­Ã³ÃÃ‰ÃÃ“ÃšÃºÃ±Ã‘\d\_\s]*))$/,mensaje:"Solo admite caracteres alfanum&eacute;ricos."});
UCID.VTypes.registrar('vtletrasycomas',{regExp:/^([a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃ±Ã‘]+ ?[a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃ±Ã‘\,\;]*)+$/,mensaje:"Solo admite letras y los caracteres especiales (,;)."});
UCID.VTypes.registrar('vtalfanumericosguiones',{regExp:/(^([a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃÃ‰ÃÃ“ÃšÃ±Ã‘])+([a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃÃ‰ÃÃ“ÃšÃ±Ã‘\d\_\s\-]*))$/,mensaje:"Solo admite caracteres alfanum&eacute;ricos y los caracteres especiales (-_)."});
UCID.VTypes.registrar('vtusuario',{regExp:/(^([a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃ±Ã‘])+([a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃ±Ã‘\d\_\s\-\@\.]*))$/,mensaje:"Solo admite caracteres alfanum&eacute;ricos y los caracteres especiales (-_.@)."});
UCID.VTypes.registrar('vtreferencia',{regExp:/(^([a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃ±Ã‘\/])+([a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃ±Ã‘\d\_\s\-\.\/]*))$/,mensaje:"Solo admite caracteres alfanum&eacute;ricos y los caracteres especiales (-_/.)."});
UCID.VTypes.registrar('vtletrasguion',{regExp:/^([a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃÃ‰ÃÃ“ÃšÃ±Ã‘ ]+ ?[a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃÃ‰ÃÃ“ÃšÃ±Ã‘\_]*)+$/,mensaje:"Solo admite letras y el caracter especial (_)."});
UCID.VTypes.registrar('vtletrasextendido',{regExp:/^([a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃ±Ã‘\d\/])+([a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃ±Ã‘\d\_\s\-\,\:\;\.\/]*)$/,mensaje:"Solo admite caracteres alfanum&eacute;ricos y los caracteres especiales (-_.:;,)."});
UCID.VTypes.registrar('vtcampo',{regExp:/(^([a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃ±Ã‘])+([a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃ±Ã‘\d\_\s\-\@\.\/\(\)\&]*))$/,mensaje:"Solo admite caracteres alfanum&eacute;ricos y los caracteres especiales (-_.@ ()&)."});
UCID.VTypes.registrar('vtdescripcion',{regExp:/^[^\\"<>]*$/,mensaje:'Solo admite caracteres alfanum&eacute;ricos excepto (\\"<>'});

Ext.apply(Ext.form.VTypes, {
    daterange : function(val, field) {        
        if(val){
            var date = field.parseDate(val);
            if(!date){
                return;
            }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                var start = Ext.getCmp(field.startDateField);
                start.setMaxValue(date);
                this.dateRangeMax = date;
                start.validate();
            }
            else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                var end = Ext.getCmp(field.endDateField);
                end.setMinValue(date);
                this.dateRangeMin = date;
                end.validate();
            }
            return true;
        }
    }
});

Ext.apply(Ext.form.VTypes, {
    datetimerange : function(val, field) {       
        if(val){
            var myDate = (field.dateField && Ext.getCmp(field.dateField)) ? field.dateField : null;
            var timeEval = Date.parseDate(val, field.format);
            if(myDate && Ext.getCmp(myDate) && timeEval){
                if(field.endTimeField  && (!this.dateRangeMin || (timeEval.getTime() != this.dateRangeMin.getTime()))){
                    var endDate = (field.endTimeField && Ext.getCmp(field.endTimeField)) ? Ext.getCmp(field.endTimeField).dateField : null;
                    if(endDate && Ext.getCmp(endDate) && Ext.getCmp(endDate).getValue()){
                        if(Ext.isEmpty(Ext.getCmp(myDate).getValue()))
                            Ext.getCmp(myDate).setValue(Ext.getCmp(endDate).getValue());
                        var date_fin= Ext.getCmp(endDate).getValue().format('d/m/Y');
                        var date_ini= Ext.getCmp(myDate).getValue().format('d/m/Y');
                        if(date_ini == date_fin){
                            var endTime = Ext.getCmp(field.endTimeField);
                            if(endTime){
                                endTime.setMinValue(timeEval);
                                this.dateRangeMin = timeEval;
                                endTime.validate();
                            }
                        }
                    }
                }else if(field.startTimeField  && (!this.dateRangeMax || (timeEval.getTime() != this.dateRangeMax.getTime()))){
                    var startDate = (field.startTimeField && Ext.getCmp(field.startTimeField)) ? Ext.getCmp(field.startTimeField).dateField : null;
                    if(startDate && Ext.getCmp(startDate) && Ext.getCmp(startDate).getValue()){
                        if(Ext.isEmpty(Ext.getCmp(myDate).getValue()))
                            Ext.getCmp(myDate).setValue(Ext.getCmp(startDate).getValue());
                        var date_ini= Ext.getCmp(startDate).getValue().format('d/m/Y');
                        var date_fin= Ext.getCmp(myDate).getValue().format('d/m/Y');
                        if(date_ini == date_fin){
                            var startTime = Ext.getCmp(field.startTimeField);
                            if(startTime){
                                startTime.setMaxValue(timeEval);
                                this.dateRangeMax = timeEval;
                                startTime.validate();
                            }
                        }
                    }
                }
            }
            return true;
        }else{
            if(field.startTimeField){
                var start1 = Ext.getCmp(field.startTimeField);
                start1.dateRangeMax = false;
                start1.setMaxValue(null);
                start1.validate();
            }else if(field.endTimeField){
                var end1 = Ext.getCmp(field.endTimeField);
                end1.dateRangeMin = false;
                end1.setMinValue(null);
                end1.validate();
            }
        }
    }
});
