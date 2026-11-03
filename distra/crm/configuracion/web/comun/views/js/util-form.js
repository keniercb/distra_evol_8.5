/* 
 * Saber si han ocurridos cambios en un formulario a partir del record inicial cargado.
 * @param idForm Identificador del formulario para obtener el objeto de valores. <code>Ej: Ext.getCmp(idForm).getForm().getValues(false);</code>
 * @param smodel SelectionModel para obtener los datos del record de tipo objeto. <code>Ej: smodel.getSelected().data;</code>
 * @param decimalPrecision Precision decimal despues del punto flotante, en caso de existir NumberField en el formulario especificado. <code>Ej: parseFloat(valuef).toFixed(decimalPrecision)</code>
 * @return Verdadero si existen cambios, falso de lo contrario.
 * @author Ing. Miguel Diaz Riveaux.
 * @package ERP Cuba.
 * @subpackage Contabilidad y Finanzas. 
 * @copyright XETID.
 */
function isDirtyForm(idForm, smodel, decimalPrecision){
            var objValuesForm = Ext.getCmp(idForm).getForm().getValues(false);
            var smodelData = smodel.getSelected().data;
            decimalPrecision = decimalPrecision || 2;
            var arrValuesForm = new Array();
            for(var name in objValuesForm){
                arrValuesForm[name] = objValuesForm[name];
            }
            
            var arrValuesRecord = new Array();
            for(var valueRecord in smodelData){
                arrValuesRecord[valueRecord] = smodelData[valueRecord];
            }
                                        
            for(var propValuesForm in arrValuesForm){
                for(var propValuesRecord in arrValuesRecord){
                    if(propValuesForm == propValuesRecord){
                        var valuef = arrValuesForm[propValuesForm];
                        var valuer = arrValuesRecord[propValuesRecord];
                        if((!isNaN(valuef)) && !isNaN(valuer)){
                            if(parseFloat(valuef).toFixed(decimalPrecision) != parseFloat(valuer).toFixed(decimalPrecision)){
                                return true;
                            }
                            if(parseInt(valuef, 10) != (parseInt(valuer, 10))){
                                return true;
                            }
                        }
                        else {
                            if(valuef != valuer){
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }

