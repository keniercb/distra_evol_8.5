/**
 * @Created with PhpStorm.
 * @Author: rlsocarras
 * @Date: 8/06/16
 * @Time: 8:10
 * @Version:1.0
 */
Ext.ns('Nomina');
Nomina.Window = Ext.extend(Ext.Window, {
    validar      : true,
    valoresform  : '',
    initComponent: function () {
        var _this = this;
        this.items[0].getForm().addListener('clientvalidation', function (_form, _valid) {
            console.info(_form.getForm().getValues());
        });


        Ext.apply(this, {

        });
        Nomina.Window.superclass.initComponent.apply(this);
    },
    validar      : function () {


    }
})

function comparar(objeto1, objeto2) {
    for (var propiedad in objeto1) {
//        console.log('Propiedad '+propiedad+' valor '+objeto2[propiedad]+'       ');
//        console.log('Propiedad '+propiedad+' valor '+objeto1[propiedad]);
//        console.log('Sigo');
        if (!objeto2[propiedad]) {
            objeto2[propiedad] = '';
        }
        if (objeto2[propiedad] == undefined || objeto1[propiedad] == undefined || objeto2[propiedad] == 'Seleccione...' || objeto1[propiedad] == 'Seleccione...') {
            objeto2[propiedad] = '';
            objeto1[propiedad] = '';
        }
//        console.log('Propiedad ' + propiedad + ' valor ' + objeto2[propiedad] + '       ');
//        console.log('Propiedad ' + propiedad + ' valor ' + objeto1[propiedad]);
        if (objeto1[propiedad] != objeto2[propiedad]) {
//            if (!isNaN(objeto1[propiedad])||!isNaN(objeto2[propiedad])) {
//                if (!(objeto1[propiedad] > objeto2[propiedad] || objeto1[propiedad] < objeto2[propiedad]))
//                {
//                    console.log('hola');
//                    return false;
//                }
//            } else {
//                return false;
//            }
            return false;
        }
    }
    return true;
}

function setDisabled(bandera) {
    console.info('disable');
    this.setDisabled(bandera);
    this.tabIndex=0;
    return;
}
