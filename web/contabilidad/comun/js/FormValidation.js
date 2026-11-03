// formPanel- el formulario
// arrButton- arreglo de botones los cuales se habilitan o no en dependecia de si el formulario es valido
// adicionalFuncion
function FormValidationjs (formPanel, arrButton, adicionalFuncion = undefined) {
    if (arrButton instanceof Array) {
        for (var i = 0; i < arrButton.length; i++) {
            if (!(arrButton[i] instanceof Ext.Button)) {
                //console.log('Los elementos del arreglo debe ser una instancia de Ext.Button');
                return;
            }
        }
    } else {
        //console.log('El segundo parametro debe ser un arreglo');
        return;
    }
    if (formPanel instanceof Ext.FormPanel) {
        //Para que no se apilen varias validaciones
        if (formPanel.hasListener('clientvalidation')) {
            formPanel.events['clientvalidation'].clearListeners();
        }
        var valorInicial = formPanel.getForm().getValues(true);
        formPanel.on({
            clientvalidation: function (fpanel, valid) {
                var valor = fpanel.getForm().getValues(true);
                var condicion = true;
                if (typeof adicionalFuncion === 'function') {
                    condicion = !(valorInicial !== valor && valid && adicionalFuncion(fpanel, valid));
                    arrButton.forEach(function (button, i) {
                        button.setDisabled(condicion);
                    });
                } else {
                    condicion = !(valorInicial !== valor && valid);
                    arrButton.forEach(function (button, i) {
                        button.setDisabled(condicion);
                    });
                }
            }
        });
    } else {
        //console.log('El primer parametro debe ser una instacia de Ext.FormPanel');
        return;
    }
}
