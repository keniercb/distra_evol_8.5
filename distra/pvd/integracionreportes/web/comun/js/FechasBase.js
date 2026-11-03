
var arr_dates = [];
Ext.apply(Ext.form.VTypes, {
	daterange : function(val, field) {
	   var date = field.parseDate(val);	
	  
	   if(!date)  return;
	  /* if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
		  var start = Ext.getCmp(field.startDateField);
		  start.setMaxValue(date);
		  start.validate();
		  this.dateRangeMax = date;
	   } 
	   else*/ 
            if (field.endDateField /*&& (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))*/) {
		  var end = Ext.getCmp(field.endDateField);
		  end.setMinValue(date);
		  end.validate();
		  this.dateRangeMin = date;
                  arr_dates.push(date); //arreglo temporal que almacena las fechas que se seleccionan en el datefield inicio
                  date = GetRangeDay(date,end.getValue())//permite respetar fecha final a partir de una fecha inicial dado un rango de dias.
                  end.setValue(date);
	   } 	   
	   return true;
	}
});

   //
   function GetRangeDay(date_ini, date_end)
    {
        date_iniold = arr_dates[arr_dates.length-2]; //obteniendo fecha anterior a la que se modofica en el datefield
        if(date_iniold && date_ini != date_iniold)
        {
            range_dates = date_iniold.getElapsed(date_end); //obteniendo rango de milisegundos entre fechas
            result_day = range_dates/1000/60/60/24; //conviertiendolo a días
            result_date = date_ini.add(Date.DAY, result_day) //obteniendo nueva fecha dado el rango de días
            return result_date;
        }
        else  return date_ini;
    }
    
function crearFechasLigadas(sufijo){
	var array = {fi:'',ff:''};
    // Fecha de inicio
	if (sufijo==undefined) sufijo = '';
	array.fi = new Ext.form.DateField({
		fieldLabel: 'Fecha de inicio',
		format:'d/m/Y',						                 
		anchor: '90%',
		endDateField: 'fechafin'+sufijo,
		allowBlank: true,
		readOnly:true,
		listeners:{
			render: function(d){
				this.vtype = 'daterange';					
			} 
		}
	}) 
	// Fecha de Fin
	array.ff = new Ext.form.DateField({
		fieldLabel: 'Fecha de fin',
		format:'d/m/Y',						               
		startDateField: 'fechainicio'+sufijo,																			
		anchor: '90%',
		readOnly:true,
		listeners:{
			render: function(d){
				this.vtype = 'daterange';			   
			} 
		}
	})
	
	return array;

} 

//puede usar  render: renderFecha   O  type:'date', dateformat:'d/m/Y',
function renderFecha(val){ 
	if (val!=null && val!=undefined && val!='' ) return '<center>'+val.substring(8, 10)+'/'+val.substring(5, 7)+'/'+val.substring(0, 4)+'</center>';
}
