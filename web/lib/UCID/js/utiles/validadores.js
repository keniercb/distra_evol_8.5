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
UCID.VTypes.registrar('vtusername',{regExp:/^([a-zA-ZáéíóúñÑ ]+ ?[a-zA-ZáéíóúñÑ ]*)+[^;]*$/,mensaje:"Solo admite letras."});
UCID.VTypes.registrar('vtalfanumerico',{regExp:/^([a-zA-Z0-9áéíóúñüÑ]+)+[^;]*$/,mensaje:"Solo admite caracteres alfanuméricos."});
UCID.VTypes.registrar('vtdirip',{regExp:/^([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){2}(\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]))$/,mensaje:"Este campo debe ser una direcci&#243;n ip con el formato 255.255.255.255"});
UCID.VTypes.registrar('vtcorreo',{regExp:Ext.form.VTypes.emailMask,mensaje:"Este campo debe ser una direcci&#243;n de correo electr&#243;nico con el formato 'usuario@dominio.ext';"});
UCID.VTypes.registrar('vtarchivo',{regExp:/^[a-zA-Z0-9]+[^\\\/:"<>\?\|;.\*]*$/,mensaje:"Solo admite caracteres alfanuméricos excepto (/.:*?<>;)."});
UCID.VTypes.registrar('vtarchivootro',{regExp:/^[a-zA-Z0-9]+[^\\\/:"<>\?\|;\*]*$/,mensaje:"Solo admite caracteres alfanuméricos excepto (/:*?<>;)"});
UCID.VTypes.registrar('vtcorreo',{regExp:Ext.form.VTypes.emailMask,mensaje:"Este campo debe ser una dirección de correo electrónico con el formato 'usuario@dominio.ext';"});
UCID.VTypes.registrar('vtnumero',{regExp:/^(-?\d{1,2})([.]\d{1,2})?$/,mensaje:"Solo admite números enteros entre -99.99 y 99.99 .Con 2 cifras decimales."});
UCID.VTypes.registrar('vtnumeroReales',{regExp:/^[0-9]+$/,mensaje:"Solo admite números reales."});
UCID.VTypes.registrar('vtnumero4dig',{regExp:/^-?\d*$/,mensaje:"Solo admite números enteros de hasta 4 dígitos."});
UCID.VTypes.registrar('vtnombre',{regExp:/^([a-zA-ZáéíóúÁÉÍÓÚñÑ ]+ ?[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*)+$/,mensaje:"Solo admite letras."});
UCID.VTypes.registrar('vtabrev',{regExp:/^([a-zA-ZáéíóúÁÉÍÓÚñÑ]+ ?[a-zA-ZáéíóúÁÉÍÓÚñÑ]*)+$/,mensaje:"Solo admite letras."});
UCID.VTypes.registrar('vtalfanumericos',{regExp:/(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóÁÉÍÓÚúñÑ\d\_\s]*))$/,mensaje:"Solo admite caracteres alfanuméricos."});
UCID.VTypes.registrar('vtletrasycomas',{regExp:/^([a-zA-ZáéíóúñÑ]+ ?[a-zA-ZáéíóúñÑ\,\;]*)+$/,mensaje:"Solo admite letras y los caracteres especiales (,;)."});
UCID.VTypes.registrar('vtalfanumericosguiones',{regExp:/(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\s\-]*))$/,mensaje:"Solo admite caracteres alfanuméricos y los caracteres especiales (-_)."});
UCID.VTypes.registrar('vtusuario',{regExp:/(^([a-zA-ZáéíóúñÑ])+([a-zA-ZáéíóúñÑ\d\_\s\-\@\.]*))$/,mensaje:"Solo admite caracteres alfanuméricos y los caracteres especiales (-_.@)."});
UCID.VTypes.registrar('vtreferencia',{regExp:/(^([a-zA-ZáéíóúñÑ\/])+([a-zA-ZáéíóúñÑ\d\_\s\-\.\/]*))$/,mensaje:"Solo admite caracteres alfanuméricos y los caracteres especiales (-_/.)."});
UCID.VTypes.registrar('vtletrasguion',{regExp:/^([a-zA-ZáéíóúÁÉÍÓÚñÑ ]+ ?[a-zA-ZáéíóúÁÉÍÓÚñÑ\_]*)+$/,mensaje:"Solo admite letras y el caracter especial (_)."});
UCID.VTypes.registrar('vtletrasextendido',{regExp:/^([a-zA-ZáéíóúñÑ\d\/])+([a-zA-ZáéíóúñÑ\d\_\s\-\,\:\;\.\/]*)$/,mensaje:"Solo admite caracteres alfanuméricos y los caracteres especiales (-_.:;,)."});
UCID.VTypes.registrar('vtcampo',{regExp:/(^([a-zA-ZáéíóúñÑ])+([a-zA-ZáéíóúñÑ\d\_\s\-\@\.\/\(\)\&]*))$/,mensaje:"Solo admite caracteres alfanuméricos y los caracteres especiales (-_.@ ()&)."});
UCID.VTypes.registrar('vtdescripcion',{regExp:/^[^\\"<>]*$/,mensaje:'Solo admite caracteres alfanuméricos excepto (\\"<>'});

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
        /*field.on('change',function(df,nt,ot){
            if(nt == ''){
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
        });*/
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
