Ext.ns('Ext.Zeolides.NomCausa');
Ext.Zeolides.NomCausa.Controlador = {

    init: function (idioma, vista, modelo) {

        //variable para controlar la accion de los botones enviada a la funcion ADDUPD
        this.accion = 'ADD';
        this.cambioDenominacion = false;
        this.cambioAbreviatura = false;
        var scope = this;
        var recordselect = null;
        var recordselectconf = null;
        var idpadre = null;

        vista.denominacion.on('change',function(fld,nv,ov){
            if(this.accion == 'UPD')
            {
                if(recordselect.attributes.denominacion != nv)
                    this.cambioDenominacion = true;
                else
                    this.cambioDenominacion = false;
            }
            else
                this.cambioDenominacion = true;
        }.createDelegate(this));

        vista.abreviatura.on('change',function(fld,nv,ov){
            if(this.accion == 'UPD')
            {
                if(recordselect.attributes.abreviatura != nv)
                    this.cambioAbreviatura = true;
                else
                    this.cambioAbreviatura = false;
            }
            else
                this.cambioAbreviatura = true;

        }.createDelegate(this));

        vista.descuenta.on('focus', function(c){
            Ext.QuickTips.register({
                target: c.getEl(),
                text: 'Some text'
            });
        });

        vista.gridCausaasistencia.getSelectionModel().on('selectionchange', function (sm, node) {

            recordselect = node;

            if (node) {
                if (node ==  vista.gridCausaasistencia.getRootNode()) {
                    vista.btnAdicionar.enable();
                    vista.btnModificar.disable();
                    vista.btnEliminar.disable();
                }else if (node.getDepth() == 1) {
                    if(!Ext.isEmpty(node.attributes.abreviatura))
                    {
                        if(recordselect.attributes.eliminar == 0){
                            vista.btnAdicionar.disable();
                            vista.btnModificar.disable();
                            vista.btnEliminar.disable();
                        }else{
                            vista.btnAdicionar.disable();
                            vista.btnModificar.enable();
                            vista.btnEliminar.enable();
                        }
                    }
                    else
                    {
                        if(recordselect.attributes.idcategoria != null && recordselect.attributes.idcausa == recordselect.attributes.idpadre){
                            vista.btnAdicionar.enable();
                            vista.btnModificar.disable();
                            vista.btnEliminar.enable();
                        }else{
                            vista.btnAdicionar.enable();
                            vista.btnModificar.enable();
                            vista.btnEliminar.enable();
                        }
                    }

                }else {
                    if(!Ext.isEmpty(node.attributes.abreviatura))
                    {
                        vista.btnAdicionar.disable();
                        vista.btnModificar.enable();
                        vista.btnEliminar.enable();
                    }
                    else
                    {
                        vista.btnAdicionar.enable();
                        vista.btnModificar.enable();
                        vista.btnEliminar.enable();
                    }

                }
            }else {
                vista.btnAdicionar.disable();
                vista.btnEliminar.disable();
                vista.btnModificar.disable();
            }


        },this);

        vista.btnExpandAll.setHandler(function () {
            vista.gridCausaasistencia.expandAll();

        });

        vista.btnCollapseAll.setHandler(function () {
            vista.gridCausaasistencia.collapseAll();
        });


        vista.ventanaADDMOD.on('beforeshow',function(){
           vista.formularioADDMOD.getForm().reset();
        });

        vista.ventanaADDMOD.on('hide',function(){
           vista.color.setValue('ffffff');
        },this);


        vista.btnConfcausa.on('click',function(){
            modelo.stcamporeporteausencia.load();
            modelo.stCausaasistencia.load();
           vista.ventanaConfcausa.setTitle(idioma.gpTitleWinConfCausa);
            vista.ventanaConfcausa.show();
        },this);

        vista.gridconfreporteausencia.getSelectionModel().on('rowselect', function () {
            vista.btnGuardar.enable();
            vista.gridConfcausaausencia.getSelectionModel().clearSelections();
            modelo.stCausaasistencia.load({params:{idvariablesconfreportescertificaciones: vista.gridconfreporteausencia.getSelectionModel().getSelected().id}});

        }, this);

        modelo.stCausaasistencia.on('load',function(obj,rec,opc){
            seleccion = new Array();
            Ext.each(rec,function(Record){

                if (Record.data.marcado == 1) {
                    seleccion.push(Record)
                }
            });

            vista.smcausaausencia.selectRecords(seleccion);
        },this);


        vista.btnGuardar.on('click', function(){
            this.Guardar();
        },this);

        this.Guardar = function() {
            if(vista.gridConfcausaausencia.getSelectionModel().getSelected()){
                var arregloidcausaausencia = new Array();
                this.idvariablesconfreportescertificaciones = vista.gridconfreporteausencia.getSelectionModel().getSelected().id;
                this.arraycausasausencias= vista.gridConfcausaausencia.getSelectionModel().getSelections();
                Ext.each(this.arraycausasausencias,function(rec){
                    arregloidcausaausencia.push(rec.data.idcausa);
                });
                Ext.getBody().mask(idioma.MaskEnviarDatos);
                Ext.Ajax.request({
                    url: 'guardarcausasreporteausencia',
                    params: {
                        idvariablesconfreportescertificaciones: this.idvariablesconfreportescertificaciones,
                        array: Ext.encode(arregloidcausaausencia)
                    },
                    method: "POST",
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function () {
                        mostrarMensaje(1, idioma.msgGuardarok);
                    }

                });
            } else mostrarMensaje(3, idioma.msgErrorSelec);
        }


        //Acciones de los botones ADD,UPD,DEL

        vista.mainMenu.on('itemclick',function(bi,e){
            this.accion = 'ADD';
            if(bi.id == 'addcausa')
            {
                vista.ventanaADDMOD.setTitle(idioma.winTitleADD);
                vista.abreviatura.allowBlank = false;
                vista.ventanaADDMOD.setSize(770,430);
            }
            else
            {
                vista.ventanaADDMOD.setTitle(idioma.winTitleADDAgrupador);
                vista.abreviatura.allowBlank = true;
                vista.abreviatura.clearInvalid();
                vista.ventanaADDMOD.setSize(680,125);
            }

            vista.btnAplicar.show();
            vista.ventanaADDMOD.show();
            if(recordselect.id == 'raiz')
                vista.tcbCausas.reset();
            if((recordselect.id == 'raiz')  && (recordselect.firstChild == null)){
                vista.tcbCausas.enable();
                vista.tcbCausas.reset();
            }else{
                vista.tcbCausas.disable();
             }
        },this);


         vista.btnModificar.on('click',function(){
             this.accion = 'UPD';
             vista.btnAplicar.hide();
             vista.ventanaADDMOD.show();
             if(Ext.isEmpty(recordselect.attributes.abreviatura))
             {
                 vista.ventanaADDMOD.setTitle(idioma.winTitleUPDAcrupador);
                 vista.abreviatura.allowBlank = true;
                 vista.abreviatura.clearInvalid();
                 vista.ventanaADDMOD.setSize(680,125);
                 vista.formularioADDMOD.doLayout();
                 vista.denominacion.setValue(recordselect.attributes.denominacion);
                 if (recordselect.getDepth() == 1) {
                     vista.tcbCausas.setValue(recordselect.parentNode.attributes.text);
                 }else{
                     vista.tcbCausas.setValue(recordselect.parentNode.attributes.denominacion);
                 }
             }
             else
             {
                 vista.ventanaADDMOD.setTitle(idioma.winTitleUPD);
                 vista.abreviatura.allowBlank = false;
                 vista.ventanaADDMOD.setSize(770,430);
                 vista.formularioADDMOD.doLayout();
                 if(recordselect.attributes.descuenta == -1){
                     vista.denominacion.setValue(recordselect.attributes.denominacion);
                     vista.abreviatura.disable();
                     vista.fechainicio.disable();
                     vista.fechafin.disable();
                     vista.descripcion.disable();
                     vista.cantIncidencias.setValue(recordselect.attributes.cantincidencias);
                     vista.color.disable();
                     if (recordselect.getDepth() == 1) {
                         vista.tcbCausas.setValue(recordselect.parentNode.attributes.text);
                     }else{
                         vista.tcbCausas.setValue(recordselect.parentNode.attributes.denominacion);
                     }
                 }else{
                     vista.abreviatura.enable();
                     vista.fechainicio.enable();
                     vista.fechafin.enable();
                     vista.descripcion.enable();
                     vista.color.enable();
                     vista.denominacion.setValue(recordselect.attributes.denominacion);
                     vista.abreviatura.setValue(recordselect.attributes.abreviatura);
                     vista.fechainicio.setRawValue(recordselect.attributes.fdesde);
                     vista.fechafin.setRawValue(recordselect.attributes.fhasta);
                     vista.descripcion.setValue(recordselect.attributes.descripcion);
                     vista.tieneentradasalida.setValue(recordselect.attributes.tieneentradasalida);
                     vista.tieneperiodo.setValue(recordselect.attributes.tieneperiodo);
                     vista.descuenta.setValue(recordselect.attributes.descuenta);
                     vista.modifica.setValue(recordselect.attributes.modifica);
                     vista.afectasalario.setValue(recordselect.attributes.afectasalario);
                     vista.cantincidencias.setValue(recordselect.attributes.cantincidencias);
                     var color = recordselect.attributes.color.split('#');
                     vista.color.setValue(color[1]);
                     if (recordselect.getDepth() == 1) {
                         vista.tcbCausas.setValue(recordselect.parentNode.attributes.text);
                     }else{
                         vista.tcbCausas.setValue(recordselect.parentNode.attributes.denominacion);
                     }
                 }
             }

             vista.tcbCausas.disable();


        },this);

         vista.btnEliminar.on('click',function(){

             mostrarMensaje(2,idioma.questDEL,function(btn){
                 if(btn == 'ok')
                 {
                    Eliminar();
                 }
             })

        },this);
        //Acciones de los botones ADD,UPD,DEL



        vista.abreviatura.on('keydown',function(field, e){
            if(((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)){
                e.stopEvent();
            }
        });
        vista.denominacion.on('keydown',function(field, e){
            if(((e.getKey() == 86 || e.getKey() == 67) && e.ctrlKey)){
                e.stopEvent();
            }
        });
        vista.tcbCausas.on('keydown',function(field, e){
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

        vista.smgridCausaasistencia.on('selectionchange',function(){
            if(vista.smgridCausaasistencia.getCount()>0)
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
            this.cambioDenominacion = false;
            this.cambioAbreviatura = false;

        },this);

        vista.btnAplicar.on('click',function(){
            ADDUPD(this.accion,'APLIC');
        },this);

        vista.btnAceptar.on('click',function(){
                ADDUPD(this.accion,'ACEPT');
        },this);

        vista.btnCerrarconfcausa.on('click',function(){
            vista.ventanaConfcausa.hide();

        },this);

        //Acciones de los botones de la ventana de ADD,UPD

        //funcion para ADD y MOD
        _this = this;
        function ADDUPD(accion, boton)
        {
            if(vista.formularioADDMOD.getForm().isValid())
            {
                var idcausa = -1;
                var url = 'addcausas';
                var idautorizacion;
                var idpadre =  recordselect.attributes.idpadre;
                var categoria = null;
                var array = new Array();
                var camino = recordselect.getPath();

                if(accion == 'ADD')
                {
                    url = 'addcausas';
                   Ext.getBody().mask(idioma.lbTitMsgAdicionandoR);

                    if(vista.tcbCausas.getValue() != ""){
                        if((recordselect.id == 'raiz')  && (recordselect.firstChild == null) && (vista.tcbCausas.getValue() != ' ')){

                            var arreglo = vista.tcbCausas.tree.root.childNodes;

                            Ext.each(arreglo, function(rec){

                                array.push({
                                    idcategoria: rec.attributes.id,
                                    denominacion: rec.attributes.text
                                });
                            })
                        }
                        if((recordselect.id == 'raiz')  && (recordselect.firstChild == null)){
                            idpadre = 'raiz';
                            categoria = vista.tcbCausas.getValue();
                        }else
                        {
                            idpadre = recordselect.attributes.idcausa;
                            categoria = recordselect.attributes.idcategoria;
                        }
                    }
                    else
                    {
                        if(recordselect.id == 'raiz')
                            idpadre = 'raiz';
                        else
                            idpadre = recordselect.attributes.idcausa;
                        if(Ext.isEmpty(recordselect.attributes.idcategoria))
                            categoria = null;
                        else
                            categoria = recordselect.attributes.idcategoria;
                    }
                }
                else
                {
                    idcausa = recordselect.attributes.idcausa;
                    url = 'updcausas';
                   Ext.getBody().mask(idioma.lbTitMsgModificandoR);
                }

                   Ext.Ajax.request({
                       url: url,
                       method:'POST',
                       params: {idcausa:idcausa,denom:vista.denominacion.getValue(), descrip:vista.descripcion.getValue(),fechaini:vista.fechainicio.getRawValue(),
                           fechafin:vista.fechafin.getRawValue(),color:vista.color.getValue(),cambiodenom:_this.cambioDenominacion,cambioabrev:_this.cambioAbreviatura,
                           abrev:vista.abreviatura.getValue(),tieneentradasalida:vista.tieneentradasalida.getValue(),tieneperiodo:vista.tieneperiodo.getValue(),
                           descuenta:vista.descuenta.getValue(),modifica:vista.modifica.getValue(),idpadre:idpadre, afectasalario:vista.afectasalario.getValue(),categ:categoria,cantincidencias:vista.cantincidencias.getValue(),
                           array: Ext.encode(array)},
                       callback: function (options,success,response){
                           Ext.getBody().unmask();
                           var responseData = Ext.decode(response.responseText);

                           if(responseData.cod == 1)
                           {
                               _this.cambioDenominacion = false;
                               _this.cambioAbreviatura = false;
                               if(boton == 'ACEPT')
                               {
                                   vista.ventanaADDMOD.hide();
                               }
                               vista.formularioADDMOD.getForm().reset();
                               if(accion == 'UPD')
                                   mostrarMensaje(1,idioma.msgUPDok);
                               else
                                   mostrarMensaje(1,idioma.msgADDok);
                               vista.tcbCausas.reset();
                               var camino = recordselect.getPath();
                               vista.gridCausaasistencia.getRootNode().reload(function () {
                                   vista.gridCausaasistencia.expandPath(camino,'id',function(suc,lastNodeExp){
                                       vista.gridCausaasistencia.getSelectionModel().select(lastNodeExp);
                                   });
                               });
                           }
                           else
                           {
                               if(responseData.cod == 5)
                                   mostrarMensaje(3,idioma.msgYaExiste);
                               else
                               if(responseData.cod == 6)
                                   mostrarMensaje(3,idioma.msgYaExisteAbreviatura);
                               else
                                   mostrarMensaje(3,idioma.msgError);
                           }
                       }
                   });
            }
        }

        //funcion para ADD y MOD

        //funcion para ELIMINAR
        function Eliminar()
        {
            camino = recordselect.parentNode.getPath()
            Ext.getBody().mask(idioma.lbTitMsgEliminandoR);
            Ext.Ajax.request({
                    url: 'delcausas',
                    method:'POST',
                    params: {idcausa:recordselect.attributes.idcausa, eliminar:recordselect.attributes.eliminar},
                callback: function() {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText);
                    if (responseData.codMsg == 3)
                        mostrarMensaje(3, idioma.lbTitMsgTipoDiaUso);
                    else if (responseData.codMsg == 1){
                        mostrarMensaje(1, idioma.msgDELok);
                    }else
                        mostrarMensaje(3,idioma.msgDELerror);

                    vista.gridCausaasistencia.getRootNode().reload(function(){
                        vista.gridCausaasistencia.expandPath(camino,'id',function(suc,lastNodeExp){
                            vista.gridCausaasistencia.getSelectionModel().select(lastNodeExp);
                        });
                    });
                }
                });
            }
        //funcion para ELIMINAR

        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imfgx',
            alt: true,
            stopEvent: true,
            handler: function(k, e) {
                switch(k) {
                    case 77:{ //m para modificar
                        if(!vista.btnModificar.disabled){
                            this.accion = 'UPD';
                            vista.ventanaADDMOD.setTitle(idioma.winTitleUPD);
                            vista.btnAplicar.hide();
                            vista.ventanaADDMOD.show();
                            vista.denominacion.setValue(recordselect.attributes.denominacion);
                            vista.abreviatura.setValue(recordselect.attributes.abreviatura);
                            vista.fechainicio.setRawValue(recordselect.attributes.fdesde);
                            vista.fechafin.setRawValue(recordselect.attributes.fhasta);
                            vista.descripcion.setValue(recordselect.attributes.descripcion);
                            vista.tieneentradasalida.setValue(recordselect.attributes.tieneentradasalida);
                            vista.tieneperiodo.setValue(recordselect.attributes.tieneperiodo);
                            vista.descuenta.setValue(recordselect.attributes.descuenta);
                            vista.modifica.setValue(recordselect.attributes.modifica);
                            var color = recordselect.attributes.color.split('#');
                            vista.color.setValue(color[1]);
                        }
                        break;
                    }
                    case 70:{ //f para configurar
                        modelo.stcamporeporteausencia.load();
                        modelo.stCausaasistencia.load();
                        vista.ventanaConfcausa.setTitle(idioma.gpTitleWinConfCausa);
                        vista.ventanaConfcausa.show();
                        break;
                    }
                    case 71:{ //g para guardar
                        scope.Guardar();
                        break;
                    }
                    case 88:{ //x para cancelar
                        vista.ventanaADDMOD.hide();
                        this.cambioDenominacion = false;
                        this.cambioAbreviatura = false;
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
            key: 13,//Enter para aceptar
            fn: function(){
                if(vista.btnAceptar.isVisible()){
                    vista.btnAceptar.focus();
                    ADDUPD(this.accion,'ACEPT');
                }
            }
        },{
                alt: true,
                key: 38,//arriba para contraer
                fn: function(){
                    vista.gridCausaasistencia.collapseAll();
                }

        },{
            alt: true,
            key: 40,//abajo para expandir
            fn: function(){
                vista.gridCausaasistencia.expandAll();
            }

        },{
            alt: true,
            ctrl: true,
            stopEvent: true,
            key: 'xp',
            handler: function(k, e) {
                switch(k) {
                    case 88:{ //x para cerrar
                        vista.ventanaConfcausa.hide();
                        break;
                    }
                    case 80:{ //p para aplicar
                        if(vista.btnAplicar.isVisible()){
                           ADDUPD(this.accion,'APLIC');
                        }
                        break;
                    }
                }
            }
        }]);


    }

}	
 
