Ext.ns('Pvd.Maestro.EstructuraControl');
//Controlador de la vista del componente
Pvd.Maestro.EstructuraControl.Controlador = {
    init: function(idioma, vista, modelo) {
        var scope=this;
        var accion = 'add';
        var disenshow = 0;
        var cmpEstructuraControl = null;
        var estructuracontrolselect = null;

        modelo.stEstControl.load();
        vista.btnAdicionar.focus();
        vista.btnAdicionar.on('click', function(){
            vista.ventanaGestion.setTitle(idioma.lbWindAddEst);
            vista.ventanaGestion.show();
            vista.btnAplicar.show();
            accion = 'add';
            limpiarForm();
        }, this);

        vista.btnModificar.on('click', function(){
            vista.ventanaGestion.setTitle(idioma.lbWindModEst);
            vista.ventanaGestion.show();
            vista.btnAplicar.hide();
            limpiarForm();
            vista.tcbEntidad.setValue(estructuracontrolselect.idestructura);
            vista.tcbEntidad.setRawValue(estructuracontrolselect.estructura);
            vista.tfdenom.setValue(estructuracontrolselect.denominacion);
            modelo.stDominios.load({params: {idestructura: estructuracontrolselect.idestructura, idestructuracontrol: estructuracontrolselect.idestructuracontrol}});
            vista.cbDominios.enable();
            accion = 'mod';
        }, this);

        vista.btnEliminar.on('click', function(){
            eliminarEstructura();
        }, this);

        vista.ventanaGestion.on('show', function(){
            modelo.stEstControlPlantillas.load();
        }, this);

        vista.btnCancelar.on('click', function(){
            vista.ventanaGestion.hide();
        }, this);

        vista.tcbEntidad.tree.on('click', function(n){
            modelo.stDominios.load({params: {idestructura: n.id}});
            vista.cbDominios.enable();
        }, this);

        vista.fsEstructuras.on('expand', function(){
            vista.ventanaGestion.setHeight(320);
        }, this);

        vista.fsEstructuras.on('collapse', function(){
            vista.ventanaGestion.setHeight(260);
        }, this);

        vista.btnDisennar.on('click', function(){
            cargarEstructura();
        }, this);

        vista.btnAceptar.on('click', function(){
            guardarDatos('ACP');
        }, this);

        vista.btnAplicar.on('click', function(){
            guardarDatos('APL');
        }, this);

        vista.gpEstControl.getSelectionModel().on('rowselect', function(){
            estructuracontrolselect = vista.gpEstControl.getSelectionModel().getSelected().data;
            vista.btnDisennar.enable();
            vista.btnModificar.enable();
            vista.btnEliminar.enable();
        });

        modelo.stEstControl.on('load', function(){
            var cant = modelo.stEstControl.getCount();
            if (cant == 0) {
               mostrarMensaje(1, 'No existen datos que mostrar.');
            }
            vista.btnDisennar.disable();
            vista.btnModificar.disable();
            vista.btnEliminar.disable();
        });

        modelo.stEstControlPlantillas.on('load', function(){
            if (accion == 'mod') {
                var record = modelo.stEstControlPlantillas.getById(estructuracontrolselect.idestructuracontrol);
                modelo.stEstControlPlantillas.remove(record);
            }
        });

        modelo.stDominios.on('load', function(){
            var cant = modelo.stDominios.getCount();
            if (cant == 0) {
                mostrarMensaje(1, 'No existen dominios sin estructura de control creada para la estructura seleccionada.');
            }
            if (accion == 'mod') {
                var recDominios = modelo.stDominios.getRange();
                var dom = estructuracontrolselect.iddominios;
                Ext.each(recDominios, function (rec)
                {
                    if (dom.indexOf(rec.id) > -1) {
                        var index = modelo.stDominios.indexOf(rec);
                        vista.cbDominios.onSelect(rec, index);
                    }
                }, this);
            }
        });

        vista.gpEstControl.on('rowdblclick', function(){
            cargarEstructura();
        });

        function limpiarForm()
        {
            vista.formularioGestion.getForm().reset();
            vista.tcbEntidad.setValue('');
            vista.tcbEntidad.setRawValue('');
            vista.cbDominios.disable();
            vista.formularioGestion.getForm().clearInvalid();
            vista.fsEstructuras.collapse();
        }

        function cargarEstructura(){
            cmpEstructuraControl = new Pvd.Maestro.EstructuraControl.panelEstructuraControl({
                idioma: idioma,
                modelo: modelo,
                idestructurainicial: estructuracontrolselect.idestructura,
                idestructuracontrol: estructuracontrolselect.idestructuracontrol
            });
            var winDisennar = new Ext.Window({
                title:'Diseñar estructura de control',
                layout:'fit',
                closable:true,
                maximizable: true,
                resizable:false,
                closeAction: 'hide',
                items:[cmpEstructuraControl],
                modal: true,
                listeners: {
                    hide: function ()
                    {
                        cmpEstructuraControl.destroy();
                        disenshow = 0;
                    }.createDelegate(this)
                },
                buttons: [{
                    id: 'btnCerrar',
                    tooltip: idioma.btnCerrartt,
                    text: 'Cerrar',
                    iconCls: 'cerrar',
                    handler: function () {
                        click: {
                            winDisennar.hide();
                        }
                    }
                }],
                keys: [
                    {
                        key: 'x',
                        ctrl: true,
                        alt: true,
                        fn: function ()
                        {
                            winDisennar.hide();
                        }
                    }
                ]
            });
            winDisennar.show();
            winDisennar.maximize();
            disenshow = 1;
        }

        function guardarDatos(boton)
        {
            if (vista.formularioGestion.getForm().isValid()) {
                Ext.getBody().mask(idioma.lbMsgmaskGuardar);
                Ext.Ajax.request({
                    url: (accion == 'add')?'addEstructura':'updateEstructura',
                    params: {
                        idestructuracontrol: (accion == 'add')?null:estructuracontrolselect.idestructuracontrol,
                        denominacion: vista.tfdenom.getValue(),
                        dominios: vista.cbDominios.getValue(),
                        idestructura: vista.tcbEntidad.getValue(),
                        idestructuracontrolplantilla: vista.cbEstructuras.getValue()
                    },
                    method: "POST",
                    callback: function () {
                        Ext.getBody().unmask();
                    },
                    success: function (r) {
                        var resp = Ext.decode(r.responseText);
                        if (resp == true) {
                            var msg = (accion == 'add')?idioma.msgAddSatisfac:idioma.msgModSatisfac;
                            mostrarMensaje(1, msg);
                        }  else {
                            mostrarMensaje(3, idioma.MsgCopyCutFail);
                        }
                        limpiarForm();
                        if(boton == 'ACP') {
                            vista.ventanaGestion.hide();
                        }
                        modelo.stEstControl.reload();
                        vista.gpEstControl.getSelectionModel().clearSelections();
                    }

                });
            }
        }

        function eliminarEstructura() {
            mostrarMensaje(2, idioma.lbTitMsgSeguroEliminarEC, function(btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(idioma.lbTitMsgEliminando);
                    var estr = new Array();
                    Ext.each(vista.gpEstControl.getSelectionModel().getSelections(),function(sel){
                        estr.push(sel.data.idestructuracontrol);
                    });
                    Ext.Ajax.request({
                        url: 'deleteEstructuraControl',
                        params:{ids: Ext.encode(estr)},
                        callback: function() {
                        },
                        success: function (r) {
                            Ext.getBody().unmask();
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == true) {
                                mostrarMensaje(1, idioma.lbMsgDelECExito);
                                modelo.stEstControl.reload();
                            } else {
                                mostrarMensaje(3, idioma.lbMsgECUso);
                            }
                        }
                    });
                }
            });
        }

        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: 46,//del para eliminar
                fn: function(){
                    if(!vista.btnEliminar.disabled && disenshow == 0){
                        eliminarEstructura();
                    }
                }
            },{
                key: 'i',
                alt: true,
                fn: function () {
                    if (!vista.btnAdicionar.disabled && disenshow == 0) {
                        vista.ventanaGestion.setTitle(idioma.lbWindAddEst);
                        vista.ventanaGestion.show();
                        vista.formularioGestion.getForm().reset();
                        vista.fsEstructuras.collapse();
                        accion = 'add';
                    }
                }
            },{
                key: 'm',
                alt: true,
                fn: function () {
                    if (!vista.btnModificar.disabled) {
                        vista.ventanaGestion.setTitle(idioma.lbWindModEst);
                        vista.ventanaGestion.show();
                        limpiarForm();
                        vista.tcbEntidad.setValue(estructuracontrolselect.idestructura);
                        vista.tcbEntidad.setRawValue(estructuracontrolselect.estructura);
                        vista.tfdenom.setValue(estructuracontrolselect.denominacion);
                        modelo.stDominios.load({params: {idestructura: estructuracontrolselect.idestructura, idestructuracontrol: estructuracontrolselect.idestructuracontrol}});
                        vista.cbDominios.enable();
                        accion = 'mod';
                    }
                }
            },{
                key: 'd',
                alt: true,
                fn: function () {
                    if (!vista.btnDisennar.disabled) {
                        cargarEstructura();
                    }
                }
            },{
                key: 'x',
                alt: true,
                fn: function () {
                    if (!vista.btnCancelar.disabled && disenshow == 0) {
                        vista.ventanaGestion.hide();
                    }
                }
            },
            {
                key: 'p',
                alt: true,
                ctrl: true,
                fn: function () {
                    if (!vista.btnAplicar.disabled && disenshow == 0) {
                        guardarDatos('APL');
                    }
                }
            },
            {
                key: 13,
                //stopEvent: true,
                fn: function () {
                    if (!vista.btnAceptar.disabled && disenshow == 0) {
                        guardarDatos('ACP');
                    }
                }
            }
        ]);
    }
};
