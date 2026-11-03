Utilidades.Cmp.Cmpgestionarcentralizado = function (opcionesConfig) {

    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.idcmp = opcionesConfig.idcmp;
    this.opcionesConfig = opcionesConfig;

    this.objCrudGanttProy = new Utilidades.Cmp.Crudganttproyecto();

    this.fechaFin = new Ext.form.DateField({
        name: 'fechafin',
        id: 'fechafin',
        fieldLabel: 'Fecha de fin',
        format: 'd/m/Y',
        editable: true,
        allowBlank: false,
        value: new Date().format('d/m/Y'),
        listeners: {
            select: function (df, date) {
                _this.fechaFin.setValue(date);
                if (_this.fechaFin.isValid() && _this.fechaInicio.isValid() ) {
                    _this.objCrudGanttProy.Gantt();
                }
            }
        }
    });

    this.fechaInicio = new Ext.form.DateField({
        name: 'fechaInicio',
        id: 'fechaInicio',
        fieldLabel: 'Fecha de inicio',
        value: new Date().format('d/m/Y'),
        format: 'd/m/Y',
        editable: true,
        allowBlank: false,
        listeners: {
            select: function (df, date) {
                _this.fechaInicio.setValue(date);
                if (_this.fechaInicio.isValid() && _this.fechaFin.isValid()) {
                    _this.objCrudGanttProy.Gantt();
                }
            }
        }
    });

    //tbar general
    this.tbPanelPrincipal = new Ext.TabPanel({
        activeItem: 0,
        collapsible: true,
        region: 'north',
        items: [{
            title: 'General',
            tbar: [{
                xtype: 'buttongroup',
                title: 'Vista',
                columns: 1,
                defaults: {
                    scale: 'small'
                },
                items: [{
                    text: 'Diagrama de Gantt',
                    iconCls: 'icondistra-graficar-text-south',
                    iconAlign: 'top',
                    arrowAlign: 'bottom',
                    menu: [
                        {
                            text: 'Listado de tareas'
                        }, {
                            text: 'Calendario'
                        }, {
                            text: 'Diagrama de Gantt'
                        }, {
                            text: 'Grafico de recursos'
                        }
                    ]
                }]
            }, {
                xtype: 'buttongroup',
                title: 'Acciones principales',
                columns: 3,
                defaults: {
                    scale: 'small'
                },
                items: [
                    {
                        text: 'Adicionar',
                        iconCls: 'icondistra-adicionar-text-south',
                        iconAlign: 'top',
                        arrowAlign: 'bottom',
                        menu: [
                            {
                                text: 'Hito'
                            }, {
                                text: 'Tarea'
                            }
                        ]
                    }, {
                        text: 'Modificar',
                        iconCls: 'icondistra-modificar-text-south',
                        iconAlign: 'top'
                    }, {
                        text: 'Eliminar',
                        iconCls: 'icondistra-eliminar-text-south',
                        iconAlign: 'top'
                    }
                ]
            }, {
                xtype: 'buttongroup',
                title: 'Otras acciones',
                columns: 7,
                defaults: {
                    scale: 'small'
                },
                items: [
                    {
                        iconCls: 'habilitar',
                        iconAlign: 'top',
                        tooltip: 'Activar',
                    }, {
                        iconCls: 'deshabilitar',
                        tooltip: 'Desactivar',
                        iconAlign: 'top'
                    }, {
                        iconCls: 'duplicar',
                        iconAlign: 'top',
                        tooltip: 'Duplicar',
                    }, {
                        iconCls: 'ver',
                        iconAlign: 'top',
                        tooltip: 'Ver datos',
                    }, {
                        iconCls: 'gestionarrelaciones',
                        iconAlign: 'top',
                        tooltip: 'Relacionar',
                    }, {
                        iconCls: 'cambiar',
                        iconAlign: 'top',
                        tooltip: 'Reasignar',
                    }, {
                        iconCls: 'historial',
                        iconAlign: 'top',
                        tooltip: 'Historial',
                    }, {
                        iconCls: 'vistareporte',
                        iconAlign: 'top',
                        tooltip: 'Gestionar observaciones',
                    }, {
                        iconCls: 'tributar',
                        iconAlign: 'top',
                        tooltip: 'Tributar',
                    }, {
                        iconCls: 'exportar',
                        tooltip: 'Exportar',
                        iconAlign: 'top'
                    }, {
                        iconCls: 'importar',
                        iconAlign: 'top',
                        tooltip: 'Importar',
                    }, {
                        iconCls: 'diferenciaconbanco',
                        iconAlign: 'top',
                        tooltip: 'Reorganizar',
                    }, {
                        iconCls: 'top',
                        iconAlign: 'top',
                        tooltip: 'Hacer raiz',
                    }, {
                        iconCls: 'notificaciones',
                        iconAlign: 'top',
                        tooltip: 'Consultar notificaciones',
                    }, {
                        iconCls: 'gestionarasistencia',
                        iconAlign: 'top',
                        tooltip: 'Alarma',
                    }, {
                        iconCls: 'filtrar',
                        iconAlign: 'top',
                        tooltip: 'Configurar cargas por defecto',
                    }, {
                        iconCls: 'contratar',
                        iconAlign: 'top',
                        tooltip: 'Puntualizaciones',
                    }, {
                        iconCls: 'contratar',
                        iconAlign: 'top',
                        tooltip: 'Puntualizaciones',
                    }, {
                        iconCls: 'actual',
                        iconAlign: 'top',
                        tooltip: 'Posicionar en d&iacutea actual',
                    }]
            }, {
                xtype: 'buttongroup',
                title: 'Cumplimiento',
                columns: 2,
                defaults: {
                    scale: 'small'
                },
                items: [
                    {
                        text: '0%',
                        iconCls: 'icondistra-bandera sipac-roja'
                    }, {
                        text: '10%',
                        iconCls: 'icondistra-bandera sipac-amarilla'
                    }, {
                        text: '25%',
                        iconCls: 'icondistra-bandera sipac-amarilla'
                    }, {
                        text: '50%',
                        iconCls: 'icondistra-bandera sipac-amarilla'
                    }, {
                        text: '75%',
                        iconCls: 'icondistra-bandera sipac-amarilla'
                    }, {
                        text: '100%',
                        iconCls: 'icondistra-bandera sipac-verde'
                    }
                ]
            }, {
                xtype: 'buttongroup',
                title: 'Secuencia',
                columns: 2,
                defaults: {
                    scale: 'small'
                },
                items: [
                    {
                        text: 'Total',
                        iconCls: 'subsistemas',
                        scale: 'small'
                    }, {
                        text: 'Quitar secuencias',
                        iconCls: 'icondistra-gestionarsubsistema-text-south',
                        iconAlign: 'top',
                        rowspan: 3

                    }, {
                        text: 'Abierta',
                        iconCls: 'secuenciadetraspaso',
                        scale: 'small'
                    }, {
                        text: 'Porcentual',
                        iconCls: 'transicionescrm',
                        scale: 'small'
                    }
                ]
            }, '-', 'Fecha de inicio : ', _this.fechaInicio, '-', 'Fecha de fin : ', _this.fechaFin
            ]
        }, {
            title: 'Tareas'
        }, {
            title: 'Informes'
        }]
    });


    //panel principal de la vista
    this.PanPrincipal = new Ext.Panel({
        layout: 'border',
        items: [
            _this.tbPanelPrincipal, _this.objCrudGanttProy.pGantt
            /*new Ext.Panel({
             region: 'center',
             layout: 'fit'
             })*/
        ]
    });

    //ventana principal de la vista
    this.WinPrincipal = new Ext.Window({
        layout: 'fit',
        constrain: true,
        closable: !opcionesConfig.noUsarCerrarWinPrincipal,
        draggable: false,
        maximized: opcionesConfig.maxWinPrincipal,
        modal: true,
        width: 1000,
        height: 510,
        items: [_this.PanPrincipal],
        buttons: [
            {
                text: 'Cerrar',
                tooltip: 'Cerrar ventana',
                hidden: opcionesConfig.noUsarCerrarWinPrincipal,
                iconCls: 'cerrar',
                handler: function () {
                    _this.WinPrincipal.hide();
                }
            }
        ]
    });

    //funcion donde se procede a cargar la plantilla
    this.CargarCmpVistaGeneral = function () {
        if (_this.opcionesConfig.tipoComponente == 'panel') {
            return _this.PanPrincipal;
        } else if (_this.opcionesConfig.tipoComponente == 'ventana') {
            _this.WinPrincipal.show();
        }
        _this.objCrudGanttProy.Gantt(_this.fechaInicio.getValue(), _this.fechaFin.getValue());
    };


};
