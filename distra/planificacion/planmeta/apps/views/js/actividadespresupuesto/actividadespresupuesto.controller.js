Ext.ns('Planificacion.Presupuesto.Actividad');
Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('actividadespresupuesto', function(perfil, idioma) {
    idioma = (idioma) ? idioma : perfil.etiquetas;

    var modelo = Planificacion.Presupuesto.Actividad.Modelo;
    modelo.init();

    var vista = Planificacion.Presupuesto.Actividad.Vista;
    vista.init(idioma, modelo);

    var acciones;

    Planificacion.Presupuesto.Actividad.Controlador.init(idioma, vista, modelo);
});

Planificacion.Presupuesto.Actividad.Controlador = {
    init: function(idioma, vista, modelo) {
        var identidadselected = 0;

        map = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: 'Ll',
                alt: true,
                fn: function() {
                    alert(limpiar);
                }
            },
            {
                key: 'Hh',
                alt: true,
                fn: function() {
                    alert(ayuda);
                }
            },
            {
                key: 'Zz',
                alt: true,
                ctrl: true,
                fn: function() {
                    alert(actualizar);
                }
            },
            {
                key: 46,
                fn: function() {
                    alert(eliminar);
                }
            },
            {
                key: 'Ii',
                alt: true,
                fn: function() {
                    if (vista.btnAdicionarinversion.enable())
                    {
                        vista.win_add_inversiones.show();

                    }
                }
            }
        ]);
        vista.treePanelinversion.on('click', function(node, evento) {
            if (node.leaf) {
                hoja = true;
            }
            else {
                hoja = false;
            }
            if (node.id != 0) {
                if (node.id) {
                    vista.grid_gestionar_inversiones.getStore().reload({
                        params: {
                            start: 0,
                            limit: 20,
                            identidad: node.id,
                            hoja: hoja,
                            idejercicio: vista.cmbEjercicio.getValue()
                        }
                    });
                    identidadselected = node.id;
                }
            }
        })

        vista.cmbEjercicio.on({
            load: function(t, n, e) {
                vista.cmbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
            }
        })
        vista.btnAdicionarinversion.on({
            click: function() {
                vista.win_add_inversiones.show();
            }
        });

        //Mostrar ventana de DPT
        vista.tfProvincia.on({
            focus: function() {
                vista.ventanaDpt.show();
            }
        });

        vista.ventanaDpt.on('dameseleccion', function(obj, data) {
            _this.iddpt = data.get('iddpt');
            vista.tfProvincia.setValue(data.get('denominacion'));

            _this.ventanaDpt.hide();
        });

        //Fin de DPT   

        function fnadicionarInversion(vista, modelo) {
            alert('adicionando');
        }

        Ext.getCmp('btnaplicar').on({
            click: function() {
                accion_ind = 'add';
                fnadicionarInversion();
            }
        });

        Ext.getCmp('btnaceptar').on({
            click: function() {
                accion_ind = 'add';
                fnadicionarInversion();
            }
        });

        vista.btn_gest_docs.on('click', function() {
            vista.window_gestionar_docs.show();
        });


        vista.btnAdicionarPresupuesto.on('click', function() {


            Fila = Ext.data.Record.create({
                name: 'valor',
                type: 'string'
            }, {
                name: 'moneda',
                type: 'string'
            });

            var p = new Fila({
                valor: 0

            }, {
                moneda: "seleccione"
            });

            vista.grid_Presupuesto.getStore().add(p);
            adicionarrec = 0;
        });
        Ext.getCmp('idfiltroent').on({
            specialkey: function(t, e) {
                if (e.getKey() == '13') {
                    arbol = vista.treePanelinversion;
                    if (arbol.getSelectionModel().getSelectedNode() != undefined) {
                        if (!arbol.getSelectionModel().getSelectedNode().leaf) {
                            arbol.getSelectionModel().getSelectedNode().reload({
                                params: {
                                    valor: Ext.getCmp('idfiltroent').getValue()
                                }
                            });
                        }
                    } else
                        arbol.root.reload({
                            params: {
                                valor: Ext.getCmp('idfiltroent').getValue()
                            }
                        });
                }
            }
        });
        
        modelo.store_gestionar_inversiones.loadData(modelo.myData);
        modelo.store_gestionar_componentes.loadData(modelo.myData1);
        modelo.store_gestionar_elementos.loadData(modelo.myData2);
        modelo.store_gestionar_elementos_der.loadData(modelo.myData3);
        modelo.store_gestionar_documentos.loadData(modelo.myData4);
    }
};
