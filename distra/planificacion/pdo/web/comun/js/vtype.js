/**
 * Created by Ariel on 15/06/2015.
 */

Ext.apply(Ext.form.VTypes, {
    rangosipacdefechas : function(val, field) {

        if(val){
            var date = field.parseDate(val);
            if(!date){
                return false;
            }
           /* if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                var start = Ext.getCmp(field.startDateField);
                start.setMaxValue(date);
                if(start.getValue()){
                    var dateIni = field.parseDate(start.getValue());
                    field.setMinValue(dateIni);
                }
                this.dateRangeMax = date;
                start.validate();
            }*/
            if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                var end = Ext.getCmp(field.endDateField);
                end.setMinValue(date);
                if(end.getValue()){
                    var dateFin = field.parseDate(end.getValue());
                    field.setMaxValue(dateFin);
                }
                this.dateRangeMin = date;
               // end.validate();
            }
            return true;
        }
    },
    rangoFechas : function(val, field) {
        var date = field.parseDate(val);
        if(!date){
            return false;
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
        return true;
    },        
    validarEspaciosEnBlanco: function(value, field){
           return(!(/^\s+|\s+$/.test(value))); 
        },
    
     validarEspaciosEnBlancoText: 'No se admite el uso del espacio antes ni después del valor del campo.'
});