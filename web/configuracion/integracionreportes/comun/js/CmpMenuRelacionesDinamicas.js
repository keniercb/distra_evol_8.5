Utilidades.Cmp.CmpMenuRelacionesDinamicas = function() {
    var _this = this;
    this.BarraProgreso = new BarraEstado();

    //menu inicial
    this.menuinicial = new Ext.menu.Menu({
        text: 'Por favor espere...',
        iconCls: 'btn'
    });

    this.CrearMenuConceptosIniciales = function(PostAccionesGestionar, arrayidelementos) {
        _this.menuinicial.removeAll();
        //poner mensaje de esperar mientras carga el menu
        _this.menuinicial.add({
            text: 'Cargando elementos',
            icon: perfil.dirImg + '../grid/loading.gif',
            iconCls: 'btn',
            //id:'cargandomenu'
        });

        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpmenurelacionesdinamicas/cargarmenuconceptosinic',
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.codigo == 3) {
                    mostrarMensaje(3, responseData.mensaje, function() {
                        gridmenu.hide();
                        //gridpanel.getStore().reload();
                    });
                } else {
                    _this.menuinicial.removeAll();
                    arraymenu = Ext.decode(response.responseText);
                    for (s = 0; s < arraymenu.data.length; s++) {
                        _this.menuinicial.add
                                ({
                                    text: arraymenu.data[s].text,
                                    iconCls: arraymenu.data[s].icon,
                                    //id: arraymenu.data[s].id,
                                    handler: function(b) {
                                        switch (b.text) {
                                            case 'Plan':

                                                //objeto CRUD-PLAN inicializado
                                                objCrudPlan = new Utilidades.Cmp.Cmpcrudplan();
                                                objCrudPlan.CrearWinCrudPlan('Adicionar', PostAccionesGestionar, arrayidelementos);
                                                /*objCmpPlan = new Utilidades.Cmp.Cmpgestionarplan(
                                                 {
                                                 noUsarModificar:true,
                                                 noUsarEliminar:true,
                                                 noUsarActivar:true,
                                                 noUsarDesactivar:true,
                                                 noUsarCerrarWinP:false,
                                                 noUsarSeleccionarWinP:false,
                                                 maxWinPrincipal:false,
                                                 noUsarCbAprob:true,
                                                 noUsarGestObser:true,
                                                 noMostrarColumObser:true,
                                                 noUsarMenuGrid:true
                                                 });
                                                 objCmpPlan.CargarCmpPlan(idelementopadre = null,tipoelementopadre = null);*/
                                                break;
                                        }
                                    }
                                });
                    }
                }
            }
        });
    };

    this.CrearMenuAprobacionConc = function(AccionesPostEjecutarFT, errormessage, gridpanel, gridmenu, arrayidelementos, idestadoinicial, idtipodocumento, menu) {

        if (menu == '') {//No hay opciones para cambiar el estado
            if (Ext.getCmp('itmaprov') != undefined) {
                Ext.getCmp('itmaprov').setDisabled(true);
            }
            if (Ext.getCmp('btnitmaprov') != undefined) {
                Ext.getCmp('btnitmaprov').setDisabled(true);
            }
        }
        console.log(menu);
        //si el menu no está definido cargarlo
        if (menu == undefined) {
            _this.menuinicial.removeAll();
            //poner mensaje de esperar mientras carga el menu
            _this.menuinicial.add({
                text: 'Cargando los estados de aprobaci&oacute;n',
                icon: perfil.dirImg + '../grid/loading.gif',
                iconCls: 'btn'
            });
            //llamar de nuevo la funcion actual pero en el parámetro menu el json de estados
            Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmpmenurelacionesdinamicas/cargarmenuestadosaprobacion',
                params: {
                    idelemento: arrayidelementos[0],
                    idtipodocumento: idtipodocumento,
                    idestadoinicial: idestadoinicial
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codigo == 3) {
                        mostrarMensaje(3, responseData.mensaje, function() {
                            gridmenu.hide();
                            gridpanel.getStore().reload();
                        });
                    } else {
                        _this.CrearMenuAprobacionConc(
                                AccionesPostEjecutarFT,
                                errormessage,
                                gridpanel,
                                gridmenu,
                                arrayidelementos,
                                idestadoinicial,
                                idtipodocumento,
                                ((responseData.estados.length > 0) ? responseData.estados : '')  //estados a los que cabiar, ''  si no hay
                                );
                    }
                }
            });
        } else {
            _this.menuinicial.removeAll();
            for (s = 0; s < menu.length; s++) {
                _this.menuinicial.add({
                    text: menu[s].denominacion,
                    itemCls: 'x-menu-item icondistra-estado',
                    iconCls: 'imagen-none',
                    //iconCls: 'icondistra-estado',
                            id: menu[s].idestado,
                    handler: function(b) {
                        _this.BarraProgreso.show('Cambiando estado de aprobaci&oacute;n');
                        Ext.Ajax.request({
                            url: '/planificacion/pdo/plan/index.php/cmpmenurelacionesdinamicas/cambiarestadoaprobacion',
                            params: {
                                arrayidelementos: Ext.encode(arrayidelementos),
                                idestadofinal: b.id,
                                idtipodocumento: idtipodocumento,
                                idestadoinicial: idestadoinicial
                            },
                            callback: function(options, success, response) {
		                            _this.BarraProgreso.hide();
                                responseData = Ext.decode(response.responseText);
                                var mensaje = 'El estado ha sido cambiado satisfactoriamente.';
                                if (responseData.mensaje != 1) {
                                    mensaje = 'Usted no tiene los privilegios suficientes para cambiar de estado.';
                                }else
		                                AccionesPostEjecutarFT(b.id);
                                mostrarMensaje(1, mensaje);

                            }
                        });
                    }
                });
            }
        }
    }
};