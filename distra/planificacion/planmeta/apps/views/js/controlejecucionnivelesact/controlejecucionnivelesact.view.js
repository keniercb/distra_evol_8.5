
Ext.ns('Planificacion.Ejecucion.Nivelesact');
Planificacion.Ejecucion.Nivelesact.Vista = {
    init: function(idioma, modelo) {

        /******* Teclas calientes ***************/
        map = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: 'iI',
                alt: true,
                fn: function() {
                    if (validarBtn(this.btnAdicionar)) {
                        comprobarSeleccion();
                    }
                }
            }
            ,
            {
                key: 'Ee',
                alt: true,
                fn: function() {
                }
            },
            {
                key: 'Ll',
                alt: true,
                fn: function() {
                }
            }
        ]);
        this.btnExportar = new Ext.Button({
            id: 'btnExportar',
            icon: perfil.dirImg + 'exportar.png',
            iconCls: 'btn',
            disabled: true,
            tooltip: perfil.etiquetas.lbTtBtnExportar,
            text: perfil.etiquetas.lbExportar
        });

        this.btnGuardar = new Ext.Button({
            id: 'btnGuardar',
            icon: perfil.dirImg + 'guardar.png',
            iconCls: 'btn',
            disabled: true,
            tooltip: perfil.etiquetas.lbTtBtnGuardar,
            text: perfil.etiquetas.lbGuardar
        });

        this.cbEjercicio = new Ext.form.ComboBox({
            id: 'cbEjercicioRedistribucion',
            store: modelo.stCbejercicio,
            disabled: true,
            valueField: 'idejercicio',
            hiddenName: 'idejercicio',
            displayField: 'ejercicio',
            mode: 'local',
            allowBlank: true,
            editable: true,
            triggerAction: 'all',
            emptyText: 'Seleccione',
            loadingText: 'Cargando...',
            width: 180
        });

        this.btnAjustar = new Ext.Button({
            id: 'btnAjustar',
            icon: perfil.dirImg + 'ajustar.png',
            disabled: true,
            iconCls: 'btn',
            tooltip: perfil.etiquetas.lbTtBtnAjustar,
            text: perfil.etiquetas.lbAjustar
        });

        this.btnAjustarControl = new Ext.Button({
            id: 'btnAjustarControl',
            icon: perfil.dirImg + 'ajustar.png',
            iconCls: 'btn',
            disabled: true,
            tooltip: perfil.etiquetas.lbTtBtnAjustar,
            text: perfil.etiquetas.lbAjustar
        });

        this.btnLimpiarNiveles = new Ext.Button({
            id: 'btnLimpiarNiveles',
            icon: perfil.dirImg + 'limpiar.png',
            iconCls: 'btn',
            tooltip: perfil.etiquetas.lbLimpiar,
            text: perfil.etiquetas.lbTtBtnLimpiar
        });

        this.btnLimpiarControl = new Ext.Button({
            id: 'btnLimpiarControl',
            icon: perfil.dirImg + 'limpiar.png',
            iconCls: 'btn',
            tooltip: perfil.etiquetas.lbLimpiar,
            text: perfil.etiquetas.lbTtBtnLimpiar
        });
        this.btnLimpiarAjuseNivel = new Ext.Button({
            id: 'btnLimpiarControl',
            icon: perfil.dirImg + 'limpiar.png',
            iconCls: 'btn',
            tooltip: perfil.etiquetas.lbLimpiar,
            text: perfil.etiquetas.lbTtBtnLimpiar
        });
        this.btnLimpiarNivelAct = new Ext.Button({
            id: 'btnLimpiarControl',
            icon: perfil.dirImg + 'limpiar.png',
            iconCls: 'btn',
            tooltip: perfil.etiquetas.lbLimpiar,
            text: perfil.etiquetas.lbTtBtnLimpiar
        });

        this.btnAdicionar = new Ext.Button({
            id: 'btnAdicionar',
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            disabled: true,
            tooltip: perfil.etiquetas.lbbAdicionar,
            text: perfil.etiquetas.lbAdicionar
        });
        this.btnAdicionarAjuste = new Ext.Button({
            id: 'btnAdicionarAjuste',
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            tooltip: perfil.etiquetas.lbTtBtnAdicionarAjuste,
            text: perfil.etiquetas.lbAdicionar
        });
        this.btnGuardarAjuste = new Ext.Button({
            id: 'btnGuardarAjuste',
            icon: perfil.dirImg + 'guardar.png',
            disabled: true,
            iconCls: 'btn',
            tooltip: perfil.etiquetas.lbTtBtnGuardarAjuste,
            text: perfil.etiquetas.lbGuardar,
        });
        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'btn',
            disabled: true,
            tooltip: perfil.etiquetas.lbbEliminar,
            text: perfil.etiquetas.lbEliminar
        });
        this.btnEliminarAjuste = new Ext.Button({
            id: 'btnEliminarAjuste',
            icon: perfil.dirImg + 'eliminar.png',
            disabled: true,
            iconCls: 'btn',
            tooltip: perfil.etiquetas.lbTtBtnEliminarAjuste,
            text: perfil.etiquetas.lbEliminar
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'btn',
            tooltip: perfil.etiquetas.lbTtbtnAyu,
            text: perfil.etiquetas.lbAyuda
        });

        //Arbol de entidades
        this.tpEntidades = new Ext.estructura.panel.PanelEstructura(
                {
                    cargos: false,
                    menu: false
                });
        this.tpEntidades.btnBuscar.setText("");
        this.tpEntidades.btnLimpiar.setText("");
        this.tpEntidades = this.tpEntidades.items.items[0];
        this.tpEntidades.getRootNode().expand();
        this.tpEntidades.region = 'west';
        this.tpEntidades.width = 200;

        this.smgpNiveles = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.gpNiveles = new Ext.grid.EditorGridPanel({
            title: perfil.etiquetas.lbNivel,
            id: 'gpNiveles',
            // autoExpandColumn: 'codigo',
            store: modelo.stNiveles,
            region: 'center',
            sm: this.smgpNiveles,
            loadMask: {
                store: modelo.stNiveles
            },
            columns: [
                {
                    header: 'Código',
                    //id: 'codigo',
                    tooltip: 'Código',
                    dataIndex: 'codigo',
                    renderer: crearToolTip,
                },
                {
                    header: 'Denominación',
                    dataIndex: 'denominacion',
                    tooltip: 'Denominación',
                    width: 200,
                    //id: 'denominacion',
                    renderer: crearToolTip,
                },
                {
                    header: 'Nivel planificado',
                    dataIndex: 'nivel',
                    align: 'right',
                    tooltip: 'nivel',
                    id: 'nivel',
                    renderer: crearToolTip,
                },
                {
                    header: 'Ajuste',
                    dataIndex: 'ajuste',
                    align: 'right',
                    tooltip: 'Ajuste en la Ejecución',
                    id: 'ajuste',
                    renderer: crearToolTip,
                },
                {
                    header: 'Total ajustado',
                    dataIndex: 'total',
                    align: 'right',
                    tooltip: 'total',
                    id: 'total',
                    renderer: crearToolTip,
                },
                {
                    header: 'A ejecutar',
                    dataIndex: 'ejecutar',
                    align: 'right',
                    tooltip: 'ejecutar',
                    id: 'ejecutar',
                    renderer: crearToolTip,
                },
                {
                    header: 'Diferencia',
                    dataIndex: 'diferencia',
                    align: 'right',
                    tooltip: 'Pendiente a Ejecutar',
                    id: 'diferencia',
                    renderer: crearToolTip,
                },
                {
                    header: 'Diferencia a ejecutar',
                    dataIndex: 'diferenciaejecutar',
                    width: 150,
                    align: 'right',
                    tooltip: 'diferenciaejecutar',
                    id: 'diferenciaejecutar',
                    renderer: crearToolTip,
                },
                {
                    header: 'Importe inicial',
                    dataIndex: 'importeinicial',
                    align: 'right',
                    id: 'importeinicial',
                    tooltip: 'importeinicial',
                    renderer: crearToolTip,
                },
                {
                    header: 'Importe ajust.',
                    dataIndex: 'importeajustar',
                    align: 'right',
                    tooltip: 'importeajustar',
                    id: 'importeajustar',
                    renderer: crearToolTip,
                },
                {
                    header: 'Importe final',
                    dataIndex: 'importefinal',
                    align: 'right',
                    tooltip: 'importefinal',
                    id: 'importefinal',
                    renderer: crearToolTip,
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 10,
                store: modelo.stNiveles,
                displayInfo: true,
                items: ['-', this.btnLimpiarNiveles]
            })
        })

        //grid niveles ajuste
        this.gpNivelesAjuste = new Ext.grid.EditorGridPanel({
            title: perfil.etiquetas.lbNivelesAjuste,
            autoExpandColumn: 'codigo',
            store: modelo.stNivelesAjuste,
            region: 'center',
            loadMask: {
                store: modelo.stNivelesAjuste
            },
            columns: [
                {
                    header: 'Código',
                    id: 'codigo',
                    tooltip: 'Código',
                    renderer: crearToolTip
                },
                {
                    header: 'Denominación',
                    tooltip: 'Denominación',
                    renderer: crearToolTip,
                    id: 'denominacion'
                },
                {
                    header: 'Nivel a ejecutar',
                    tooltip: 'Nivel a ejecutar',
                    renderer: crearToolTip,
                    id: 'nivelejecutar'
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 10,
                store: modelo.stNivelesAjuste,
                displayInfo: true,
                items: ['-', this.btnLimpiarAjuseNivel]
            })
        })

        this.smgpControl = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        this.tfajuste = new Ext.form.TextField({
            xtype: 'numberfield',
            id: 'ajuste',
            anchor: '95%',
            align: 'right',
            disabled: true,
            regex: /(^[0-9]+[.]?[0-9]+$)|^[0-9]*$/,
            enableKeyEvents: false,
            emptyText: '0.00'

        });

        this.gpControl = new Ext.grid.EditorGridPanel({
            title: perfil.etiquetas.lbControl,
            id: 'gpControl',
            autoExpandColumn: 'nivel',
            store: modelo.stControl,
            autoScroll: true,
            collapsible: true,
            collapsed: true,
            height: 220,
            region: 'south',
            sm: this.smgpControl,
            loadMask: {
                msg: perfil.etiquetas.lbCargando
            },
            columns: [
                {
                    header: 'Nivel Ejecutado',
                    id: 'nivel',
                    sortable: false,
                    tooltip: 'Nivel Ejecutado',
                    renderer: crearToolTip,
                    editor: new Ext.form.NumberField({
                        allowNegative: false
                    })
                },
                {
                    header: 'Fecha',
                    dataIndex: 'fecha',
                    tooltip: 'Fecha',
                    sortable: true,
                    align: 'center',
                    tooltip: 'Fecha',
                            editor: new Ext.form.DateField({
                                format: 'd/m/Y',
                                id: 'startdt',
                                readOnly: true
                            }),
                    renderer: formatDate
                }
            ],
            tbar: [this.btnAdicionar, '-', this.btnEliminar, '-', this.btnAjustar, '-', this.tfajuste],
            bbar: new Ext.PagingToolbar({
                pageSize: 10,
                store: modelo.stControl,
                displayInfo: true,
                items: ['-', this.btnLimpiarControl]
            })
        })
        //Grid para mostrar los Niveles de actividad economicos
        this.gridAjuste = new Ext.grid.EditorGridPanel({
            title: perfil.etiquetas.lbAjustePlanificado,
            autoExpandColumn: 'nivel',
            store: modelo.stAjuste,
            height: 220,
            region: 'south',
            loadMask: {
                store: modelo.stAjuste
            },
            columns: [
                {
                    header: 'Nivel',
                    id: 'nivel',
                    tooltip: 'Nivel',
                    renderer: crearToolTip
                }, {
                    header: 'Fecha de inicio',
                    id: 'fechainicio',
                    tooltip: 'Fecha de inicio',
                    renderer: crearToolTip
                }, {
                    header: 'Fecha de fin',
                    tooltip: 'Fecha de fin',
                    renderer: crearToolTip,
                    id: 'fechafin'
                }
            ],
            tbar: [this.btnAdicionarAjuste, '-', this.btnEliminarAjuste, '-', this.btnGuardarAjuste],
            bbar: new Ext.PagingToolbar({
                pageSize: 10,
                store: modelo.stAjuste,
                displayInfo: true,
                items: ['-', this.btnLimpiarNivelAct]
            })
        })

        this.wdAjustar = new Ext.Window({
            title: 'Ajuste',
            closeAction: 'hide',
            constrain: true,
            height: 400,
            width: 950,
            layout: 'border',
            items: [this.gridAjuste, this.gpNivelesAjuste]
        })

        this.pContenido = new Ext.Panel({
            layout: 'border',
            region: 'center',
            height: 200,
            border: false,
            items: [this.gpNiveles, this.gpControl]
        })
        this.pGeneral = new Ext.Panel({
            layout: 'border',
            border: false,
            tbar: [this.btnExportar, '-', this.btnGuardar, '-', this.btnAjustarControl, '-', 'Ejercicio:', '-', this.cbEjercicio, '->', this.btnAyuda],
            items: [this.tpEntidades, this.pContenido]
        })

        this.view = new Ext.Viewport({
            layout: 'fit',
            items: [this.pGeneral]
        })
    }

};

var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
perfil.etiquetas = {};
Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('controlejecucionnivelesact', function(idioma) {
    idioma = (idioma) ? idioma : perfil.etiquetas;
    var modelo = Planificacion.Ejecucion.Nivelesact.Modelo;
    modelo.init();
    var vista = Planificacion.Ejecucion.Nivelesact.Vista;
    vista.init(idioma, modelo);
    Planificacion.Ejecucion.Nivelesact.Controlador.init(idioma, vista, modelo);
});

function formatDate(value) {
    if (value == null || value == "")
        return 'Sin fecha'
    else {
        if (value.length > 10) {
            var dt = new Date(value.substring(0, 4), parseInt(value.substring(5, 7)) - 1, value.substring(8, 10));
            return dt.format('d-m-Y');
        } else {
            var dt = new Date(value);
            return dt.format('d-m-Y');
        }
    }
}

function  adicionarDesglose() {
    var vista = Planificacion.Ejecucion.Nivelesact.Vista
    Fila = Ext.data.Record.create([{
            name: 'nivel',
            type: 'string'
        }, {
            name: 'fecha',
            type: 'string'
        }]);
    var p = new Fila({
        fecha: null,
        nivel: 0

    });
    vista.gpControl.getStore().add(p);
}

function calularsuma() {
    var vista = Planificacion.Ejecucion.Nivelesact.Vista
    suma = 0;
    for (i = 0; i < vista.gpControl.getStore().getCount(); i++) {
        suma += parseFloat(vista.gpControl.getStore().getAt(i).data.nivelactividad);
    }
}

function comprobarSeleccion() {
    var vista = Planificacion.Ejecucion.Nivelesact.Vista
    adicionarDesglose();
}
function validarBtn(btn) {
    return btn.hidden == false && !btn.disabled;
}
function crearToolTip(v, m) {
    m.attr = 'ext:qtip="' + v + '"';
    return v;
}
function eliminarControl(btn) {
    if (btn == 'ok') {

        mostrarMensaje(1, perfil.etiquetas.msgEliminado);
    }
}




