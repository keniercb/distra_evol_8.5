Ext.ns('Pvd.ControlAsistencia.GestPlantilla');
//Controlador de la vista del componente
Pvd.ControlAsistencia.GestPlantilla.Controlador = {
    init: function(idioma, vista, modelo) {
        var scope=this;
        var idpadre = null;
        this.idestructura = null;
        this.idconcepto = null;
        this.idestructurawin = null;
        this.idpersonawin = null;
        this.idconceptowin = null;
        this.EstSelNodes = 0;
        this.NodesToCopyMove = new Array();
        this.Action = 'cut';
        var nodo = null;

			vista.estructura.on('dameseleccion', function (obj, data) {
                this.EstSelNodes = data.length;
                if(data == false)
                    this.idestructura = vista.estructura.inicial;
                else{
                    this.idestructura = data[0].id;
                    this.idconcepto = data[0].attributes.idconcepto;
                }

                if(this.EstSelNodes == 1 && vista.treeCargos.getSelectionModel().getUniqueSelectedNodes().length == 1 && this.idconcepto == 7){
                    vista.btnCambiar.enable();
                }else{
                    vista.btnCambiar.disable();
                }
		},this);

        vista.estructura.tree.getSelectionModel().on('selectionchange',function(th,node){
            var estructuraAsistenciaSelected = vista.treeCargos.getSelectionModel().getUniqueSelectedNodes();
            if (node.attributes.idtipo == 3 && (estructuraAsistenciaSelected.length == 1 && !Ext.isEmpty(estructuraAsistenciaSelected[0].attributes.idpersona)))
                vista.btnPFP.enable();
            else
                vista.btnPFP.disable()
        },this);

        vista.btnPFP.on('click',function(){
            vista.WinPFP.show();
            modelo.fuenteDatosListadoPFP.load({params:{idestructura: vista.estructura.tree.getSelectionModel().id}});
        });

        vista.btnCancelarPFP.on('click',function(){
            vista.WinPFP.hide();
        });

       vista.btnAceptarPFP.on('click',function(){
           var idestructuraasistenciapadre = vista.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0].id;
           var idpersonas = new Array();
           Ext.each(vista.smPFP.getSelections(),function(rec){
               idpersonas.push(rec.data.idpersona);
           });
            SaveChange(idestructuraasistenciapadre,Ext.encode(idpersonas),null);
        });

        vista.smPFP.on('selectionchange',function(th){
           if(th.getSelections().length > 0)
               vista.btnAceptarPFP.enable();
            else
               vista.btnAceptarPFP.disable();
        });

        vista.smPersonaCargoWin.on('selectionchange',function(th){
            if(vista.smPersonaCargoWin.getCount() == 1){
                this.idpersonawin = th.getSelected().get('idpersona');
                vista.btnAceptarest.enable();
            }else{
                this.idpersonawin = null;
                vista.btnAceptarest.disable();
            }
        },this);

         vista.smPersonaCargo.on('selectionchange',function(th){
            if(vista.smPersonaCargo.getCount() == 1){
                vista.btnAceptarControlador.enable();
            }else{
                vista.btnAceptarControlador.disable();
            }
        },this);

        vista.estructurawin.on('dameseleccion', function (obj, data) {
            //this.EstSelNodes = data.length;
            if(data == false)
                this.idestructurawin = vista.estructurawin.inicial;
            else{
                this.idestructurawin = data.id;
                this.idconceptowin = data.attributes.idconcepto;
            }

            if(!Ext.isEmpty(vista.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0].attributes.idpersona))
            {
                if(this.idconceptowin == 7)
                    modelo.fuenteDatosListadoPersonacargoWin.load({params:{idcargo:data.id}});
                else
                    modelo.fuenteDatosListadoPersonacargoWin.removeAll();
            }
            else
            {
                if(this.idconceptowin == 7){
                    vista.btnAceptarest.enable();
                }else{
                    vista.btnAceptarest.disable();
                }
            }

        },this);
		
		vista.btnEliminar.on('click', function(){
            this.eliminar();
        }, this);

        vista.estructura.tree.on('startdrag',function(tp,n,e){
            vista.externo = true;
        },this);

        vista.treeCargos.on('startdrag',function(tp,n,e){
            vista.externo = false;
        });

        this.eliminar = function() {
            var cantselect=vista.treeCargos.getSelectionModel().selNodes.length;
            mostrarMensaje(2, cantselect>1?idioma.lbTitMsgSeguroEliminarVarios:idioma.lbTitMsgSeguroEliminarUno, function(btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask( cantselect>1?idioma.lbTitMsgEliminandoVarios:idioma.lbTitMsgEliminandoUno);
                    var nodesId = new Array();
                    Ext.each( vista.treeCargos.getSelectionModel().selNodes,function(selnode){
                        nodesId.push(selnode.attributes.id);
                    });
                    Ext.Ajax.request({
                        url: '/pvd/regimentrabajo/index.php/gestplantilla/delPersonasAsistencia',
                        params:{idestructuraasistencia: Ext.encode(nodesId)},
                        callback: function() {

                        },
                        success: function (r) {
                            Ext.getBody().unmask();
                            var responseData = Ext.decode(r.responseText);
                            if (responseData.codMsge == 1) {
                                mostrarMensaje(1, cantselect>1?idioma.lbMsgDelPersonaExitoVarios:idioma.lbMsgDelPersonaExitoUno);
                                //console.info(vista.treeCargos);
                                vista.treeCargos.root.reload();
//                                Ext.each(nodesId,function(nod){
//                                    vista.treeCargos.getNodeById(nod).remove();
//                                });
                            } else {
                                mostrarMensaje(3, idioma.lbMsgPersonaUso);
                            }
                        }
                    });
                }
            });
        };

        vista.btnCambiar.on('click', function(){
            vista.winCambiarCargo.setTitle(idioma.lbTitPanelEst);
            vista.winCambiarCargo.show();
        },this);


         vista.btnCancelarControlador.on('click', function(){

            vista.WinControlador.hide();
        },this);


         vista.btnAceptarControlador.on('click', function(){
          vista.AddControladorOrCargo(vista.event,vista.smPersonaCargo.getSelected().get('idpersona'));
        },this);


        vista.treeCargos.getSelectionModel().on('selectionchange', function(th,nds,e){
            //console.info(vista.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0].attributes.id);
            if(nds.length > 0)
            {
                vista.btnEliminar.enable();
                if(nds.length == 1 && this.EstSelNodes == 1 && this.idconcepto == 7){
                   // vista.btnCambiar.enable();
                }else{
                    //vista.btnCambiar.disable();
                }
            }
            else
            {
               // vista.btnCambiar.disable();
                vista.btnEliminar.disable();

            }
            if(nds.length == 1)
            {
                vista.listado.expand();
                modelo.fuenteDatosListado.baseParams.idnode= vista.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0].attributes.id;
                modelo.fuenteDatosListado.baseParams.idcargo= vista.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0].attributes.idcargo;
                var idpersona = vista.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0].attributes.idpersona;
                modelo.fuenteDatosListado.baseParams.idpersona= (Ext.isEmpty(idpersona))?-1:idpersona;
                modelo.fuenteDatosListado.load({params:{start:0, limit:15}});
                vista.btnCambiar.enable();
                if(!Ext.isEmpty(vista.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0].attributes.idpersona))
                    vista.listadoPersonasInCargoWin.setVisible(true);
                else
                    vista.listadoPersonasInCargoWin.setVisible(false);
            }
            else
            {
                vista.listado.collapse();
                modelo.fuenteDatosListado.removeAll();
                vista.btnCambiar.disable();
            }

            var estructuraSelected = vista.estructura.tree.getSelectionModel().getSelectedNode();
            if (estructuraSelected.attributes.idtipo == 3 && (nds.length == 1 && !Ext.isEmpty(nds[0].attributes.idpersona)))
                vista.btnPFP.enable();
            else
                vista.btnPFP.disable()

        },this);

        vista.listado.getSelectionModel().on('selectionchange', function () {
            var temp = 0;
            //vista.btnEliminarPersona.enable();
            if(vista.listado.getSelectionModel().getSelections().length>0){
                vista.btnCambiarPersona.enable();
                Ext.each(vista.listado.getSelectionModel().getSelections(), function(rec){
                    //console.info(rec);
                    if(rec.data.bandera == 0){
                        temp = 1;
                    }
                })
                if(temp == 1){
                    vista.btnEliminarPersona.disable();
                }else
                    vista.btnEliminarPersona.enable();
            }else{
                vista.btnEliminarPersona.disable();
                vista.btnCambiarPersona.disable();
            }



        }, this);

        vista.btnCambiarPersona.on('click', function(){
            vista.winCambiarPersona.setTitle(idioma.lbTitPanelEstAsistCargos);
            vista.winCambiarPersona.show();
            vista.treeEstAsist.getRootNode().expand();
        },this);

        vista.treeEstAsist.getSelectionModel().on('selectionchange', function(th,nds,e){
            nodo = nds;
            var temp = 0;
            var aux = 0;
            var mismoCargo = 0;
            //console.info(nds);
            //console.info(vista.listado.getSelectionModel().getSelected().data.idcargo);

            var cargoold = vista.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0].attributes.idcargo;
            var cargonew = nds.attributes.idcargo;
            Ext.each(vista.listado.getSelectionModel().getSelections(), function(rec){
               if(cargonew == rec.data.idcargo){
                   temp = 1;
               }
               //if(cargoold == rec.data.idcargo){
               //    mismoCargo = 1;
               //}
                //console.info(rec.data.padres.length);
                Ext.each(rec.data.padres, function(r){
                    //console.info(r);
                    if(cargonew == r){
                        aux = 1;
                    }
                })

            });
            if(cargoold == cargonew ||  nds.attributes.id == 'root'){
                vista.btnAceptar.disable();
            }else
                vista.btnAceptar.enable();

        },this);


        /*vista.btnCambiar.on('click', function(){
            Cambiar();
        },this);*/

        vista.btnAceptarest.on('click', function(){
            Cambiar();
        },this);

        vista.btnBuscar.on('click', function(){
            modelo.fuenteDatosListado.load({params:{filtro: vista.tfbuscar.getValue(),start:0, limit:15}});
            //buscarpersona();
        });

       /* buscarpersona = function() {
            var tVal = vista.tfbuscar.getRawValue().toLowerCase();
            var cant = modelo.fuenteDatosListado.getCount();
            var listpersonas = modelo.fuenteDatosListado.getRange(0,cant);
            var cont = 0;
            if(tVal != ' '){
                Ext.each(listpersonas, function(rec){
                    var tStr =  rec.data.nombreapellidos.toString().toLowerCase();
                    if(tStr.indexOf(tVal)!=-1){
                        // console.info(tStr)
                        var p = new modelo.recQrElement({
                            idpersona: rec.data.idpersona,
                            nombreapellidos: rec.data.nombreapellidos,
                            numid: rec.data.numid,
                            idcargo: rec.data.idcargo,
                            denomcargo: rec.data.denomcargo,
                            idestructuraasistencia: rec.data.idestructuraasistencia,
                            subordinacion: rec.data.subordinacion,
                            denomarea: rec.data.denomarea,
                            bandera: rec.data.bandera

                        });
                        //console.info(p);
                        modelo.fuenteDatosListado.removeAll();
                        vista.listado.getStore().add(p);
                        //console.info(array);
                    }

                })
            }

        }*/

        vista.btnLimpiar.on('click', function(){
            vista.tfbuscar.reset();
            modelo.fuenteDatosListado.load({params:{start:0, limit:15}});
        });

        vista.btnCancelar.on('click',function(){
            vista.winCambiarPersona.hide();

        },this);

        vista.btnCancelarest.on('click',function(){
            vista.winCambiarCargo.hide();
        },this);

        vista.btnAceptar.on('click',function(){
            CambiarPersona();
        },this);

        vista.btnEliminarPersona.on('click',function(){
            EliminarPersona();
        },this);


        function SaveChange(idestructuraasistencia,idpersonas,idpersonasother)
        {
            Ext.getBody().mask(idioma.lbMsgmaskGuardar);
            Ext.Ajax.request({
                url: 'cambiarpersona',
                params: {
                    idestructuraasistencia: idestructuraasistencia,
                    idspersonas: idpersonas,
                    idspersonasother: idpersonasother
                },
                method: "POST",
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    var resp = Ext.decode(r.responseText);
                    if(vista.winCambiarPersona.isVisible())
                        vista.winCambiarPersona.hide();
                    if(vista.WinPFP.isVisible())
                        vista.WinPFP.hide();
                    modelo.fuenteDatosListado.reload();
                    mostrarMensaje(1, idioma.lbMsgGuardarExito);

                }

            });
        }

        function CambiarPersona(){
            var arreglo = new Array();
            var array = new Array();
            Ext.each(vista.listado.getSelectionModel().getSelections(), function(rec){
                if(rec.data.bandera == 1){
                    array.push(
                        rec.data.idpersona
                    );
                }else{
                    arreglo.push(
                        rec.data.idpersona
                    );
                }
            });
            if(nodo != null){
                SaveChange(vista.treeEstAsist.getSelectionModel().selNode.attributes.id, Ext.encode(arreglo),
                    Ext.encode(array));
            }else
                mostrarMensaje(3, idioma.lbSeleccionarCargo);

        }

        function EliminarPersona(){
            mostrarMensaje(2, idioma.lbTitMsgSeguroEliminarR, function(btnPresionado) {
                if (btnPresionado == 'ok') {
                    var arreglo = new Array();
                    Ext.each(vista.listado.getSelectionModel().getSelections(), function(rec){
                        //console.info(rec);
                        arreglo.push(
                            rec.id
                        );
                    });
                    Ext.getBody().mask(idioma.lbTitMsgEliminandoR);
                        Ext.Ajax.request({
                            url: 'delPersonasSubordinacion',
                            params:{array: Ext.encode(arreglo)},
                            callback: function() {
                                Ext.getBody().unmask();
                            },
                            success: function (r) {
                                var responseData = Ext.decode(r.responseText);
                                if (responseData.codMsge == 1) {
                                    mostrarMensaje(1, idioma.lbMsgDelExito);
                                    modelo.fuenteDatosListado.reload();
                                }
                            }
                        });

                }
            });
        }


        function Cambiar(){
            if(vista.listadoPersonasInCargoWin.hidden && scope.idconceptowin != 7)
            {
                mostrarMensaje(3,idioma.lbMsgSelecPerson);
            }
            else
            {
                if(!vista.listadoPersonasInCargoWin.hidden && vista.smPersonaCargoWin.getCount() != 1)
                    mostrarMensaje(3,idioma.lbMsgSelecPerson);
                else
                {
                    Ext.getBody().mask(idioma.lbMsgmaskGuardar);
                    Ext.Ajax.request({
                        url: 'cambiarpadre',
                        params: {
                            idcargonew: scope.idestructurawin,
                            idpersona:scope.idpersonawin,
                            idestructuraasistencia: vista.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0].attributes.id
                        },
                        method: "POST",
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            var resp = Ext.decode(r.responseText);

                            if (resp.existe == 0) {

                                var nodo = vista.treeCargos.getSelectionModel().getUniqueSelectedNodes()[0];
                                if(nodo.isExpanded())
                                {
                                    vista.treeCargos.getLoader().load(nodo);
                                }
                                nodo.expand();

                                vista.estructurawin.tree.getRootNode().cascade(function(n) {
                                    var ui = n.getUI();
                                    ui.toggleCheck(false);
                                });
                                mostrarMensaje(1, idioma.lbMsgGuardarExito);
                                n.parentNode.reload();
                                //n.reload();
                                vista.estructurawin.tree.getRootNode().reload();

                                vista.winCambiarCargo.hide();
                                vista.smPersonaCargoWin.clearSelections();

                            } else {
                                mostrarMensaje(3,idioma.lbMsgPersonaExi);
                            }
                            return true;
                        }

                    });

                }
            }

        }


        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [
            {
            key: 46,//del para eliminar
            fn: function(){
                if(!vista.btnEliminar.disabled){
                    scope.eliminar();
                }
            }
        },{
            key: 40,
            fn: function(){
                vista.treeCargos.expandAll();
            }
        },{
            key: 38,
            fn: function(){
               vista.treeCargos.collapseAll();
            }
        },{
            alt: true,
            ctrl: true,
            stopEvent: true,
            key: 'b',
            fn: function(){
                Cambiar();
            }
        },{ key: 'bl',
            alt: true,
            stopEvent: true,
            handler: function(k, e) {
                switch(k) {
					case 66:{ //b para buscar
                        modelo.fuenteDatosListado.load({params:{filtro: vista.tfbuscar.getValue(),start:0, limit:15}});
                        break;
                    }
					case 76:{ //l para limpiar
                        vista.tfbuscar.reset();
						modelo.fuenteDatosListado.load({params:{start:0, limit:15}});
                        break;
                    }	
                }
            }
		},{
            key: 13,//Enter para buscar
            fn: function(){
                modelo.fuenteDatosListado.load({params:{filtro: vista.tfbuscar.getValue(),start:0, limit:15}});
            }
        
        }]);
    }
}
