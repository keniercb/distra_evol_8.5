Ext.QuickTips.init();
var perfil = window.parent.UCID.portal.perfil;
perfil.etiquetas = Object();

var Utilidades = {Cmp: {}};

Utilidades.Cmp.Cmpvalidaciones = function()
{
    var _this = this;
    var msjerrortextoregido = '';
    var cadena = /^$/;

    /* Ext.override(Ext.form.TextField, {
     initComponent:function(){
     this.maxLengthText = 'El tamaño máximo requerido es '+ this.maxLength +' caracteres.'
     }
     });*/

    this.ObtenerMsjErrorTextoRegido = function(nombrecampo) {
        switch (nombrecampo)
        {

            case 'denominacion':
                msjerrortextoregido = 'Solo admite caracteres alfanuméricos y el(los) carácter(es) especial(es) (- _ ' + "''" + ' "" () , . /).';
                break;
            case 'car':
                msjerrortextoregido = 'Este valor es incorrecto. Solo se permiten n&uacute;meros.';
                break;
            case 'fecha':
                msjerrortextoregido = 'El formato establecido: dd/mm/aaaa.';
                break;
            case 'decimal2':
                msjerrortextoregido = 'Este valor es incorrecto. El formato debe de ser xx.xx para valores num&eacute;ricos solamente.';
                break;
        }
        return msjerrortextoregido;
    };

    this.expresionRegular = function(nombrecampo) {
        switch (nombrecampo) {
            case 'denominacion':
                cadena = /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9'"()_\-]+)([\s]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9'"()_\-/,.])*$/;
                break;
            case 'hora':
                cadena = /^(([0[0-9]|1[0-9]|2[0-3]):[0-5][0-9])([/s]{0,1}([am]|[AM]|[pm]|[PM]))$/;
                break;
        }
        return cadena;
    };

    this.validacionesVtypes = function(validacion) {
        switch (validacion) {
            case 'validarEspaciosEnBlanco':
                Ext.apply(Ext.form.VTypes, {
                    validarEspaciosEnBlanco: function(value, field) {
                        return(!(/^\s+|\s+$/.test(value)));
                    },
                    validarEspaciosEnBlancoText: 'No se admite el uso del espacio antes ni después del valor del campo.'
                });
                return 'validarEspaciosEnBlanco';
                break;
            default:
                return null;
        }
    }
};


Ext.override(Ext.grid.GridView,{
    columnsToShow:[],
    scope:this,
    deferredUpdate: new Ext.util.DelayedTask(),

    recargar: function () {
        this.grid.getStore().reload({
            params:{
                columnsToShow:Ext.encode(this.columnsToShow)
            }
        });
    },
    handleHdMenuClick : Ext.grid.GridView.prototype.handleHdMenuClick.createInterceptor(function(item){
        var id = item.id.split('-');
        switch(id[0]){

            case "col":
                var cm = this.cm
                var index = cm.getIndexById(item.id.substr(4));
                var grid = this;


                if(grid.grid.columnsByDemand == true)
                {
                    var dataindex = cm. getDataIndex(index);
                    if(item.checked == false){
                        grid.deferredUpdate.cancel();
                        grid.columnsToShow.push(dataindex);
                        grid.deferredUpdate.delay(1000,grid.recargar,grid);

                    }
                    else{
                        if(grid.columnsToShow.length > 0){
                            var indexdata = grid.columnsToShow.indexOf(dataindex);
                            if(indexdata>=0){
                                grid.columnsToShow.splice(indexdata,1)
                            }
                        }
                    }
                }
                break;
        }
        return true;
    })
});