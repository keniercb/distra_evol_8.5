Ext.ns('Ext.Zeolides.Nomtipodia');
Ext.Zeolides.Nomtipodia.Controlador = {

    init: function (idioma, vista, modelo) {

        //variable para controlar la accion de los botones enviada a la funcion ADDUPD
        this.accion = 'ADD';
        this.cambioDenominacion = false;
        _this = this;
        vista.denominacion.on('change',function(){
            _this.cambioDenominacion = true;
        });

        //carga inicial del grid
        modelo.storeTipodia.load({params:{criterio:-1,limit:25,start:0}});

        vista.ventanaADDMOD.on('beforeshow',function(){
           vista.formularioADDMOD.getForm().reset();
        });

        vista.ventanaADDMOD.on('hide',function(){
        },this);

       //Acciones de los botones ADD,UPD,DEL
        vista.btnAdicionar.on('click',function(){
            this.accion = 'ADD';
           vista.ventanaADDMOD.setTitle(idioma.winTitleADD);
            vista.btnAplicar.show();
            vista.ventanaADDMOD.show();
        },this);
         vista.btnModificar.on('click',function(){
             this.accion = 'UPD';
             vista.ventanaADDMOD.setTitle(idioma.winTitleUPD);
             vista.btnAplicar.hide();
             vista.ventanaADDMOD.show();
             vista.formularioADDMOD.getForm().loadRecord(vista.smgridTipodia.getSelected());
             var color = vista.smgridTipodia.getSelected().get('color').split('#');
             vista.color.setValue(color[1]);
        },this);
         vista.btnEliminar.on('click',function(){
             mostrarMensaje(2,idioma.questDEL,function(btn){
                 if(btn == 'ok')
                 {
                    Eliminar();
                 }
             })

        });
        //Acciones de los botones ADD,UPD,DEL
        vista.smgridTipodia.on('selectionchange',function(){
            if(vista.smgridTipodia.getCount()>0)
            {
                vista.btnModificar.enable();
                vista.btnEliminar.enable();
            }
            else
            {
                vista.btnModificar.disable();
                vista.btnEliminar.disable();
            }
        });

        //Acciones de los botones de la ventana de ADD,UPD

        vista.btnCancelar.on('click',function(){
            vista.ventanaADDMOD.hide();
            _this.cambioDenominacion = false;
        });

        vista.btnAplicar.on('click',function(){
            ADDUPD(this.accion,'APLIC');
        },this);

        vista.btnAceptar.on('click',function(){
            ADDUPD(this.accion,'ACEPT');
        },this);


        vista.denominacion.on('keydown',function(field, e){
            if(((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)){
                e.stopEvent();
            }
        });
        vista.fechainicio.on('keydown',function(field, e){
            if(((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)){
                e.stopEvent();
            }
        });
        vista.fechafin.on('keydown',function(field, e){
            if(((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)){
                e.stopEvent();
            }
        });
        vista.descripcion.on('keydown',function(field, e){
            if(((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)){
                e.stopEvent();
            }
        });
        //Acciones de los botones de la ventana de ADD,UPD

        //funcion para ADD y MOD

        function ADDUPD(accion, boton)
        {
            if(vista.formularioADDMOD.getForm().isValid())
            {
                var idtipodia = -1;
                var url = 'adicionarDias';
                var idautorizacion;
                if(accion == 'ADD')
                {
                    url = 'adicionarDias';
                    Ext.getBody().mask(idioma.lbTitMsgAdicionandoR);
                }
                else
                {
                    idtipodia = vista.smgridTipodia.getSelected().get('idtipodedia');
                    url = 'modificarDias';
                    Ext.getBody().mask(idioma.lbTitMsgModificandoR);
                }

                Ext.Ajax.request({
                    url: url,
                    method:'POST',
                    params: {idtipodia:idtipodia,denom:vista.denominacion.getValue(),descrip:vista.descripcion.getValue(),fechaini:vista.fechainicio.getRawValue(),fechafin:vista.fechafin.getRawValue(),trabajo:vista.trabajo.getValue(),color:vista.color.getValue(),cambiodenom:_this.cambioDenominacion},
                    callback: function (options,success,response){
                        Ext.getBody().unmask();
                        var responseData = Ext.decode(response.responseText);
                        _this.cambioDenominacion = false;
                        if(responseData.cod == 1)
                        {
                            if(boton == 'ACEPT')
                            {
                                vista.ventanaADDMOD.hide();
                            }
                            vista.formularioADDMOD.getForm().reset();
                            if(accion == 'ADD')
                                mostrarMensaje(1,idioma.msgADDok);
                            else
                                mostrarMensaje(1,idioma.msgUPDok);//, function(btn){
                            modelo.storeTipodia.load({params:{criterio:-1,limit:25, start:0}});
                        }
                        else
                        {
                            mostrarMensaje(3,idioma.msgYaExiste);
                        }
                    }
                });
            }
        }

        //funcion para ADD y MOD

        //funcion para ELIMINAR
        function Eliminar()
        {
            Ext.getBody().mask(idioma.lbTitMsgEliminandoR);
                Ext.Ajax.request({
                    url: 'eliminarDias',
                    method:'POST',
                    params: {idtipodia:vista.smgridTipodia.getSelected().get('idtipodedia')},
                    callback: function() {
                        Ext.getBody().unmask();
                    },
                    success: function (r) {
                        var responseData = Ext.decode(r.responseText);
                        if (responseData.codMsg == 3)
                            mostrarMensaje(3, idioma.lbTitMsgTipoDiaUso);
                        else {
                            mostrarMensaje(1, idioma.msgDELok);
                        }
                        modelo.storeTipodia.load({params:{criterio:-1,limit:25, start:0}});
                    }
                });
            }
        //funcion para ELIMINAR

        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imx',
            alt: true,
            stopEvent: true,
            handler: function(k, e) {
                switch(k) {
                    case 73:{ //i para adicionar
                        this.accion = 'ADD';
                        vista.ventanaADDMOD.setTitle(idioma.winTitleADD);
                        vista.btnAplicar.show();
                        vista.ventanaADDMOD.show();
                        break;
                    }
                    case 77:{ //m para modificar
                        if(!vista.btnModificar.disabled){
                            this.accion = 'UPD';
                            vista.ventanaADDMOD.setTitle(idioma.winTitleUPD);
                            vista.btnAplicar.hide();
                            vista.ventanaADDMOD.show();
                            vista.formularioADDMOD.getForm().loadRecord(vista.smgridTipodia.getSelected());
                            var color = vista.smgridTipodia.getSelected().get('color').split('#');
                            vista.color.setValue(color[1]);
                        }
                        break;
                    }
                    case 88:{ //x para cancelar
                        vista.ventanaADDMOD.hide();
                        _this.cambioDenominacion = false;
                        break;
                    }
                }
            }
        },{
            key: 46,//del para eliminar
            fn: function(){
                if(!vista.btnEliminar.disabled){
                    mostrarMensaje(2,idioma.questDEL,function(btn){
                        if(btn == 'ok')
                        {
                            Eliminar();
                        }
                    })
                }
            }
        },{
            key: 13,//enter para aceptar
            fn: function(){

                if(vista.btnAceptar.isVisible()){
                    vista.btnAceptar.focus();
                    ADDUPD(this.accion,'ACEPT');
                }
            }
        },{
            alt: true,
            ctrl: true,
            stopEvent: true,
            key: 'p',
            fn: function(){
                if(vista.btnAplicar.isVisible()){
                    ADDUPD(this.accion,'APLIC');
                }
            }
        }]);


        }

}	
 
