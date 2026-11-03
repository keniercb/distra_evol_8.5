
Ext.ns('Control.Prueba');

Control.Prueba.Controller = {
    /**
     *Inicializar el controlador de la vista.
     * 
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param view Vista del componente Banco.Ctabancaria
     * @param model Modelo de la vista del componente Banco.Ctabancaria
     * 
     */
    init: function(idioma, view, model) {
        var idp=0;
        var scope = this;
        //--- GUARDAR DATOS

        view.btnGuardar.on({
            click: function(){
                scope.addmodProducto(idp);
                view.btnGuardar.focus();
            }
        });

        this.addmodProducto = function (idp) {
            Ext.Msg.wait('Guardando datos.', 'Por favor espere...');
            var productonew = [];
            //var selected = view.smAnticipos.getSelected();
            /*productonew.push({
                //idpersona: view.cbpersona.getValue(),
                compannia: view.compannia.getRawValue(),
                precio: view.precio.getValue(),
                caracteristicas: view.caracteristicas.getRawValue(),
                porciento: view.porciento.getRawValue(),
                nuevo: view.nuevo.getValue(),
            });*/
if(idp==0){Ext.Ajax.request({
    url: 'guardardatos',
    method: 'POST',
    params: {

        idproducto: 0,
        compannia: view.compannia.getRawValue(),
        precio: view.precio.getValue(),
        caracteristicas: view.caracteristicas.getRawValue(),
        porciento: view.porciento.getRawValue(),
        nuevo: view.nuevo.getValue(),

    },
    callback: function (options, success, response) {
        var responseData = Ext.decode(response.responseText);
        if (responseData.codM == 1) {

            //mostrarMensaje(1, msg);
            model.almacenDatos.reload();
            Ext.Msg.hide();
        }
    }
});}
else{
    Ext.Ajax.request({
        url: 'guardardatos',
        method: 'POST',
        params: {

            idproducto: idp,
            compannia: view.companniaMod.getRawValue(),
            precio: view.precioMod.getValue(),
            caracteristicas: view.caracteristicasMod.getRawValue(),
            porciento: view.porcientoMod.getRawValue(),
            nuevo: view.nuevoMod.getValue(),

        },
        callback: function (options, success, response) {
            var responseData = Ext.decode(response.responseText);
            if (responseData.codM == 1) {

                //mostrarMensaje(1, msg);
                model.almacenDatos.reload();
                Ext.Msg.hide();
            }
        }
    });
}

        };
view.comboejercicio.on({
    select: function (valor) {
        model.almacenDatos.load({
            params: {
                ejercicio: view.comboejercicio.getValue(),
                start: 0,
                limit:5
            }
        })
    }
});
        //--- MODIFICAR
        view.btnModificar.on({
            click: function(){
                var selecteds = view.combo.getSelected();
                if(!selecteds){
                    mostrarMensaje(1, "Tiene que seleccionar");

                }

                else{
                view.winM.show();
                //console.log(selecteds.json.idproducto);
                view.companniaMod.setValue(selecteds.json.compannia);
                view.precioMod.setValue(selecteds.json.precio);
                view.porcientoMod.setValue(selecteds.json.porciento);
                view.nuevoMod.setValue(selecteds.json.nuevo);
                view.caracteristicasMod.setValue(selecteds.json.caracteristicas);
            }
            }
        });

        view.btnModificarW.on({
           click: function(){
               var selecteds = view.combo.getSelected();
               scope.addmodProducto(selecteds.json.idproducto);
           }

        });





        //--- ELIMINAR
        view.combo.on({
            rowselect: function () {
                view.btnEliminar.enable();
                view.btnModificar.enable();
            },
            rowdeselect:function () {
                if(!view.combo.getSelected()){
                    view.btnEliminar.disable();
                    view.btnModificar.disable();
                }
                //if(view.combo.getSelected().length > 1)
                  //  view.btnModificar.disable();
            },
        });


       view.btnEliminar.on({
            click: function () {
                var selecteds = view.combo.getSelected();
                if(!selecteds){
                    mostrarMensaje(1, "Tiene que seleccionar");

                } else
                if (selecteds.length > 0) {
                    var mensaje = (selecteds.length > 1)
                        ? '¿Est&aacute; seguro que quiere eliminar los productos seleccionados?'
                        : '¿Est&aacute; seguro que quiere eliminar el producto seleccionado?';

                    mostrarMensaje(2, mensaje, function (btnPress) {
                        if (btnPress === 'ok') {
                            scope.eliminarProducto(selecteds);
                            view.btnEliminar.focus();
                        }
                        view.btnEliminar.focus();
                    });
                }
            }

        });

        this.eliminarProducto = function (selecteds) {
            var arrayProducto = Array();
            var msg = (selecteds.length > 1)
                ? 'Los productos han sido eliminados satisfactoriamente.'
                : 'El producto ha sido eliminado satisfactoriamente.';

            for (var i = 0; i < selecteds.length; i++) {
                arrayProducto.push(selecteds[i].json.idproducto);
            }

            Ext.Ajax.request({
                url: 'eliminardatos',
                method: 'POST',
                params: {
                    arrayIdProducto: Ext.encode(arrayProducto),
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData == 1) {
                        mostrarMensaje(1, msg);
                        model.almacenDatos.reload();
                    }
                }
            });
        };
























    }
};        