Ext.ns('RegimenTrabajo.Confestructuras');

RegimenTrabajo.Confestructuras.Controlador = {

    init: function (idioma, vista, modelo) {
        var scope = this;
        this.accion;
        var estselect;
        var busc = 0;

        modelo.store.load();

        vista.listadoEstructuras.getSelectionModel().on('rowselect', function (n) {
            estselect = n.getSelected().data;
            vista.btnModificar.enable();
            vista.btnEliminar.enable();
        }, this);

        modelo.store.on('load',function(obj,rec,opc){
            estselect = null;
            vista.btnModificar.disable();
            vista.btnEliminar.disable();
        },this);

        modelo.estructuras.on('beforeload', function (tl, n)
        {
            if (tl.isLoading()) {
                return false;
            } else if (vista.EstructuraPadre.getValue() != '') {
                tl.baseParams.idestructura = vista.EstructuraPadre.getValue();
                if (scope.accion == 'upd') {
                    tl.baseParams.check = 1;
                }  else {
                    tl.baseParams.check = 0;
                }
            }
        });

        modelo.estructuras.on('load', function (tl, n)
        {
            if (scope.accion == 'upd') {
                return false;
            } else if (vista.EstructuraPadre.getValue() != '') {
                tl.baseParams.idestructura = vista.EstructuraPadre.getValue();
            }
        });

        vista.EstructuraPadre.tree.on('click', function (n)
        {
            if (n.attributes.idconcepto == 1 || n.attributes.idconcepto == 2
                || n.attributes.idconcepto == 3 || n.attributes.idconcepto == 4) {
                vista.EstructurasHijas.enable();
                modelo.estructuras.load(vista.EstructurasHijas.getRootNode());
                vista.EstructurasHijas.getRootNode().expand();
            }  else {
                mostrarMensaje(6, 'Debe seleccionar un Órgano, Agrupación, Entidad u Organización.');
                vista.EstructuraPadre.setValue('');
                vista.EstructuraPadre.setRawValue('');
            }
            vista.EstructuraPadre.focus(true, 500);
        });

        //Acciones de los botones ADD,UPD,DEL
        vista.btnAdicionar.on('click',function(){
            scope.accion = 'add';
            vista.ventanaGestion.setTitle('Adicionar estructura');
            vista.btnAplicar.show();
            vista.ventanaGestion.show();
            vista.EstructuraPadre.setValue('');
            vista.EstructuraPadre.setRawValue('');
            vista.EstructurasHijas.getRootNode().collapse();
            vista.EstructurasHijas.disable();
            vista.formularioGestion.getForm().clearInvalid();
        },this);

        vista.btnModificar.on('click',function(){
            scope.accion = 'upd';
            vista.ventanaGestion.setTitle('Modificar estructura');
            vista.btnAplicar.hide();
            vista.ventanaGestion.show();
            vista.EstructuraPadre.setValue(estselect.identidad);
            vista.EstructuraPadre.setRawValue(estselect.entidad);
            vista.EstructurasHijas.enable();
            modelo.estructuras.load(vista.EstructurasHijas.getRootNode());
            vista.EstructurasHijas.getRootNode().expand();
        },this);

        vista.btnAceptar.on('click',function(){
            guardarDatos('acp');
        },this);

        vista.btnAplicar.on('click',function(){
            guardarDatos('apl');
        },this);

        vista.btnCancelar.on('click',function(){
            vista.ventanaGestion.hide();
        });

        function guardarDatos(btnpress)
        {
            var checkestructuras = vista.EstructurasHijas.getChecked();
            if (checkestructuras.length > 0) {
                var arrayidestructuras = new Array();
                for (i = 0; i<checkestructuras.length; i++) {
                    arrayidestructuras.push(checkestructuras[i].id);
                }
                if(vista.formularioGestion.getForm().isValid()){
                    Ext.getBody().mask('Por favor espere... Guardando datos.');
                    Ext.Ajax.request({
                        url: (scope.accion == 'add' ? 'addEstructuras' : 'updateEstructuras'),
                        params: {
                            identidad: vista.EstructuraPadre.getValue(),
                            arrayidestructuras: Ext.encode(arrayidestructuras)
                        },
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData != false) {
                                if(scope.accion == 'upd')
                                {
                                   mostrarMensaje(1, 'Las estructuras han sido modificadas satisfactoriamente.');
                                }else{
                                   mostrarMensaje(1, 'Las estructuras han sido adicionadas satisfactoriamente.');
                                }
                                if (btnpress == 'acp')
                                {
                                    vista.ventanaGestion.hide();
                                }
                                vista.formularioGestion.getForm().reset();
                                modelo.store.removeAll();
                                modelo.store.reload();
                            } else
                                mostrarMensaje(6,'Alguna de las estructuras no pueden ser adicionas debido a que ya existen.');
                        }
                    });
                }
            }  else {
                mostrarMensaje(6,'Debe seleccionar la estructura.');
            }
        }

        vista.btnEliminar.on('click',function(){
            eliminar();
        },this);

        function eliminar()
        {
            var ids = new Array();
            var s = vista.listadoEstructuras.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idestructura);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar la estructura seleccionada?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar las estructuras seleccionadas?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Por favor espere... Eliminando datos.');
                    Ext.Ajax.request({
                        url: 'deleteEstructuras',
                        params: {arrayids: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if(responseData == false)  {
                                if (s.length == 1) {
                                    mensaje = 'La estructura seleccionada no puede ser eliminada.';
                                } else {
                                    mensaje = 'Alguna de las estructuras seleccionadas no puede ser eliminada.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'La estructura seleccionada ha sido eliminada satisfactoriamente.';
                                } else {
                                    mensaje = 'Las estructuras seleccionadas han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            modelo.store.removeAll();
                            modelo.store.reload();
                        }
                    });
                }
            });
        }



    }
}