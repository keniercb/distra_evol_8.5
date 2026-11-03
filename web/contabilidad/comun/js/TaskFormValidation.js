/**
 * Created by Emmanuel on 06/03/2017.
 */

/**
 * Permite validar los campos de un formulario Form, un GridPanel o  un grupo de campos al adicionar y verifica cambios al modificar
 * @param fieldArray
 * @constructor
 * Ejemplo de uso:
 var arrbotones = new Array();
 arrbotones.push(me.btnGuardar);
 var gridPanelArray = new Array();
 gridPanelArray.push(me.gpFormatos);
 var fieldArray = new Array();
 fieldArray.push(me.cbModelogestion);
 fieldArray.push(me.cbEstructuracomun);
 fieldArray.push(me.cbCriterioe);
 fieldArray.push(me.taDenominacion);
 fieldArray.push(me.tfCodigo);
 fieldArray.push(me.cbNumComprobante);
 me.TaskFormValidation.stopTaskValidation();
 me.TaskFormValidation.startTaskValidation('mod', null, arrbotones,gridPanelArray,fieldArray);
 */

var TaskFormValidation = {

    /**
     * Inicia la validacion mediante una tarea
     * @param accion define que accion se validara. 'add' para adicionar , 'mod' o cualquier otro string para modificar
     * @param formArray Arreglo de los formularios a validar, puede recibir null
     * @param arrbotones Arreglo de los botones a activar o desactivar
     * @param gridPanelArray Arreglo de los grids a validar, puede recibir null
     * @param fieldArray Arreglo de textField o combo box a validar, puede recibir null
     */
    startTaskValidation : function(accion,formArray,arrbotones,gridPanelArray,fieldArray) {
        TaskFormValidation.initTaskFormValidation(formArray,arrbotones,gridPanelArray,fieldArray);
        TaskFormValidation.tarea = {
            run: function() {
                if (accion === 'add' ) {
                    if (TaskFormValidation.formValid()) {
                        for (var i = 0, long = TaskFormValidation.arrbotones.length; i < long; i++) {
                            TaskFormValidation.arrbotones[i].setDisabled(false);
                        }
                    }
                    else {
                        for (var i = 0, long = TaskFormValidation.arrbotones.length; i < long; i++) {
                            TaskFormValidation.arrbotones[i].setDisabled(true);
                        }
                    }
                }
                else {
                    if (TaskFormValidation.formValid() && TaskFormValidation.fieldsModified()) {
                        for (var i = 0, long = TaskFormValidation.arrbotones.length; i < long; i++) {
                            TaskFormValidation.arrbotones[i].setDisabled(false);
                        }
                    }
                    else {
                        for (var i = 0, long = TaskFormValidation.arrbotones.length; i < long; i++) {
                            TaskFormValidation.arrbotones[i].setDisabled(true);
                        }
                    }
                }
            },
            interval: 500,
            scope: this
        };

        TaskFormValidation.runner.start(this.tarea);
    },

    /**
     * Inicializa los valores para comenzar la validacion
     * @param formArray Arreglo de los formularios a validar
     * @param arrbotones Arreglo de los botones a activar o desactivar
     * @param gridPanelArray Arreglo de los grids a validar
     * @param fieldArray Arreglo de textField o combo box a validar
     */
    initTaskFormValidation : function (formArray,arrbotones,gridPanelArray,fieldArray) {

        var auxformArray=new Array();
        if(formArray) {
            for (var i = 0, long = formArray.length; i < long; i++) {
                var aux1formArray = new Array();
                aux1formArray.push(formArray[i]);
                aux1formArray.push(TaskFormValidation.getInitialData(formArray[i]));
                auxformArray.push(aux1formArray);
            }
        }
        TaskFormValidation.formArray=auxformArray;
        TaskFormValidation.arrbotones=arrbotones;
        TaskFormValidation.gridPanelArray=gridPanelArray;
        if(fieldArray){
            TaskFormValidation.fieldArray=fieldArray;
            TaskFormValidation.fieldArrayInitialData=TaskFormValidation.getInitialDataFromFieldArray(TaskFormValidation.fieldArray);
        }
        TaskFormValidation.runner = new Ext.util.TaskRunner();

    },

    /**
     *Obtener una cadena con los datos de todos los campos del formulario
     * @param form Formulario
     * @returns {string} cadena con los datos de todos los campos del formulario
     */
    getInitialData : function (form) {
            var data='';
            Ext.each(form.getForm().items.items, function (f) {
                data += f.getValue();
            });
            return data;

    },

    /**
     * Obtener una cadena con los datos de todos los campos incluidos en el fieldArray
     * @returns {string} cadena con los datos de todos los campos
     */
    getInitialDataFromFieldArray : function () {
    var data='';
    Ext.each(TaskFormValidation.fieldArray, function (f) {
        data += f.getValue();
    });
    return data;

},

/**
 * Detiene la tarea de validacion
 */
stopTaskValidation : function() {
    if (!Ext.isEmpty(TaskFormValidation.tarea)) {
        TaskFormValidation.runner.stop(this.tarea);
    }
},

/**
 * Conprueba si todos los formularios y campos introducidos son validos
 * @returns {boolean} true si todos son validos
 */
formValid : function() {
    if(TaskFormValidation.formArray) {
        for (var i = 0, long = TaskFormValidation.formArray.length; i < long; i++) {

            if (!TaskFormValidation.formArray[i][0].getForm().isValid()) {
                return false;
            }
        }
    }

    if(TaskFormValidation.fieldArray){
        for (var i = 0, long = TaskFormValidation.fieldArray.length; i < long; i++) {

            if(!TaskFormValidation.fieldArray[i].isValid()) {
                return false;
            }
        }
    }
    return true;
},

/**
 * Comprueba si todos los formularios, grids y campos introducidos han sido modificados
 * @returns {boolean} true si alguno fue modificado
 */
fieldsModified : function() {
    if(TaskFormValidation.formArray){
        for (var i = 0, long = TaskFormValidation.formArray.length; i < long; i++) {
            var data = TaskFormValidation.getInitialData(TaskFormValidation.formArray[i][0]);
            if (data != TaskFormValidation.formArray[i][1]) {
                return true;
            }
        }
    }
    if(TaskFormValidation.gridPanelArray){
        for (var i = 0, long = TaskFormValidation.gridPanelArray.length; i < long; i++) {
            if (TaskFormValidation.gridPanelArray[i].getStore().getModifiedRecords().length>0 ) {
                return true;
            }
        }
    }

    if(TaskFormValidation.fieldArray){
        if(TaskFormValidation.fieldArrayInitialData != TaskFormValidation.getInitialDataFromFieldArray(TaskFormValidation.fieldArray)){
            return true;
        }
    }

    return false;
}

}




