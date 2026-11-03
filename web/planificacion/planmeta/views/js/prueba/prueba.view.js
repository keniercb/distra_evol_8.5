//Namespace del componente actividad
Ext.ns('Validacion.Prueba.Actividad')

//Vista del componente Actividad
Validacion.Prueba.Actividad.Vista = {
    /*Componente que inicializa la vista
     *@param: idioma Objeto que contiene el idioma de la aplicacion (type:Object)
     *@param: modelo Objeto que contiene los modelos para cargar los datos(type:Validacion.Prueba.Actividad.Modelo)
     */
    init: function(idioma, modelo) {
        //boton adicionar actividad
        this.btnAdicionar = new Ext.Button({
            id: 'btnAdicionar',
            text: 'Adicionar',
            icon: perfil.dirImg + 'adicionar.png',
            tooltip: idioma.adicionarActividad,
            iconCls: 'btn'
        });

        //boton modificar actividad
        this.btnModificar = new Ext.Button({
            id: 'btnModificar',
            text: 'Modificar',
            icon: perfil.dirImg + 'modificar.png',
            tooltip: idioma.modificarActividad,
            iconCls: 'btn'
        });

        //boton eliminar actividad
        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            text: 'Eliminar',
            icon: perfil.dirImg + 'eliminar.png',
            tooltip: idioma.eliminarActividad,
            iconCls: 'btn'
        });

        //boton exportar actividad
        this.btnExportar = new Ext.Button({
            id: 'btnExportar',
            text: 'Exportar',
            icon: perfil.dirImg + 'exportar.png',
            tooltip: 'Exportar actividad',
            iconCls: 'btn'
        });

        //boton aprobar actividad
        this.btnAprobacion = new Ext.Toolbar.MenuButton({
            text: 'Aprobacion',
            icon: perfil.dirImg + 'area.png',
            iconCls: 'blist',
            menu: {
                items: [{
                        id: 'btnAprobar',
                        icon: perfil.dirImg + 'aprobar.png',
                        iconCls: 'btn',
                        text: 'Aprobar'
                    }, {
                        id: 'btnDesaprobar',
                        icon: perfil.dirImg + 'desaprobar.png',
                        iconCls: 'btn',
                        text: 'Desaprobar'
                    }]
            }
        })

        //Grid con las actividades
        this.gridActividades = new Ext.grid.GridPanel({
            title: idioma.titulogridActividades,
            autoExpandColumn: 'denominacion',
            store: modelo.listadoActividades,
            region: 'center',
            tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar, '-', this.btnAprobacion, '-', this.btnExportar],
            loadMask: {
                store: modelo.listadoActividades
            },
            columns: [{
                    header: idioma.codigo,
                    width: 150,
                    dataIndex: 'codigo'
                }, {
                    header: idioma.denominacion,
                    width: 150,
                    dataIndex: 'denominacion',
                    id: 'denominacion'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 10,
                store: modelo.listadoActividades,
                displayInfo: true
            })
        })

        //Grid con las normas
        this.gridNormas = new Ext.grid.GridPanel({
            title: idioma.titulogridNormas,
            autoExpandColumn: 'denominacion',
            store: modelo.listadoNormas,
            collapsible: true,
            height: 300,
            region: 'south',
            loadMask: {
                store: modelo.listadoNormas
            },
            columns: [{
                    header: idioma.codigo,
                    width: 150,
                    dataIndex: 'codigo'
                }, {
                    header: idioma.denominacion,
                    width: 150,
                    dataIndex: 'denominacion',
                    id: 'denominacion'
                }, {
                    header: idioma.norma,
                    width: 150,
                    dataIndex: 'cantbase'
                }],
            bbar: new Ext.PagingToolbar({
                pageSize: 10,
                store: modelo.listadoNormas,
                displayInfo: true
            })
        })

        //Ventana para agregar actividades
        this.ventana_adicionar = new Ext.Window({
            title: 'Adicionar actividad',
            closeAction: 'hide',
            width: 550,
            constrain: true,
            layout: 'fit',
            autoHeight: true,
            buttons: [{
                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'btn',
                    text: 'Cancelar'
                }, {
                    icon: perfil.dirImg + 'aplicar.png',
                    iconCls: 'btn',
                    id: 'btnaplicar',
                    text: 'Aplicar'
                }, {
                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'btn',
                    id: 'btnaplicar',
                    text: 'Aceptar'
                }],
            items: new Ext.FormPanel({
                frame: true,
                autoHeight: true,
                labelAlign: 'top',
                items: [{
                        layout: 'column',
                        items: [{
                                layout: 'form',
                                columnWidth: 0.3,
                                items: new Ext.form.TextField({
                                    id: 'formato',
                                    anchor: '95%',
                                    fieldLabel: 'Formato'
                                })
                            }, {
                                layout: 'form',
                                columnWidth: 0.1,
                                items: new Ext.form.TextField({
                                    id: 'nivel',
                                    anchor: '95%',
                                    fieldLabel: 'Nivel'
                                })
                            }, {
                                layout: 'form',
                                columnWidth: 0.1,
                                items: new Ext.form.TextField({
                                    id: 'digitos',
                                    anchor: '95%',
                                    fieldLabel: 'Digitos'
                                })
                            }, {
                                layout: 'form',
                                columnWidth: 0.5,
                                items: new Ext.form.TextField({
                                    id: 'especialidad',
                                    anchor: '100%',
                                    fieldLabel: 'Especialidad'
                                })
                            }]
                    }, {
                        layout: 'column',
                        items: [{
                                layout: 'form',
                                columnWidth: 0.5,
                                items: new Ext.form.TextField({
                                    id: 'denominacion',
                                    anchor: '95%',
                                    fieldLabel: 'Denominacion'
                                })
                            }, {
                                layout: 'form',
                                columnWidth: 0.3,
                                items: new Ext.form.TextField({
                                    id: 'codigopadre',
                                    anchor: '95%',
                                    fieldLabel: 'Codigo padre'
                                })
                            }, {
                                layout: 'form',
                                columnWidth: 0.2,
                                items: new Ext.form.TextField({
                                    id: 'codigo',
                                    anchor: '100%',
                                    fieldLabel: 'Codigo'
                                })
                            }]
                    }, {
                        layout: 'form',
                        columnWidth: 1,
                        items: new Ext.form.TextField({
                            id: 'rector',
                            anchor: '100%',
                            fieldLabel: 'Rector'
                        })
                    }, {
                        layout: 'form',
                        columnWidth: 1,
                        items: new Ext.form.TextField({
                            id: 'demandantes',
                            anchor: '100%',
                            fieldLabel: 'Demandantes'
                        })
                    }, {
                        layout: 'form',
                        columnWidth: 1,
                        items: new Ext.form.TextField({
                            id: 'compartir',
                            anchor: '100%',
                            fieldLabel: 'Compartir'
                        })
                    }, {
                        layout: 'form',
                        columnWidth: 1,
                        items: new Ext.form.TextField({
                            id: 'plan',
                            anchor: '100%',
                            fieldLabel: 'Plan'
                        })
                    }, {
                        layout: 'form',
                        columnWidth: 1,
                        items: new Ext.form.TextArea({
                            id: 'descripcion',
                            anchor: '100%',
                            maxLength: 255,
                            fieldLabel: 'Descripcion'
                        })
                    }]
            })
        })

        //ViewPort para mostrar los elementos
        this.view = new Ext.Viewport({
            layout: 'border',
            items: [this.gridActividades, this.gridNormas]
        })
    }
};


//Inicializando la vista.
//variable que guarda los datos del perfil
var perfil = window.parent.UCID.portal.perfil;
perfil.etiquetas = {};
Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('prueba', function(idioma) {
    //Escogiendo la configuraciÃ³n del idioma segÃºn la versiÃ³n del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Validacion.Prueba.Actividad.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Validacion.Prueba.Actividad.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Validacion.Prueba.Actividad.Controlador.init(idioma, vista, modelo);
});