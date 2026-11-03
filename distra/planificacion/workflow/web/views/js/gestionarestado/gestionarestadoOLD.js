var perfil = window.parent.UCID.portal.perfil;
Ext.QuickTips.init();
var win, windowasociarestado, winop, vpGestionarEstados;
//combo
var asociarEstado;
//paneles
var pasociar, pEstadosAsociados, ppostacciones, checkcolumnEject;

var tabestado;
var arrayrecords, arrayrecordsrestric = [];
var arraytemprecords = [];
var modInvolPostAccion = false;
// stores
var stEstado, stTDoc, stGEstadosAsociados, stGEstadosSinAsociar;
var start = 0;
var limit = 15;
var denominacion = false;
// grid
var gpEstado, GEstadosAsociados, GEstadosSinAsociar;
// sm
var smEstado, smGEstadosAsociados, smGEstadosSinAsociar;
// Botones sub,tdoc,est
var modestn, addestn, eliestn, addest, btnEstadoInicial, btnAyuda, btnEstadoNotificacion, btnQuitarEstadoNotificacion,
        btnQuitarEstadoInicial, btnAsociarEstado, btnDesAsociarEstado, btnRestriccion, winrestricciones,
        stGSubordinados, smGSubordinados, GSubordinados, checkColumnInicial, checkColumnFinal, nombreestadoselec = '';

var expanderPost, stGListadoPost, smGListadoPos, GListadoPost, expander, stGPost, checkColumnMod, checkColumnElim, smGPost, GPost, pconfiguracionpost, ventanaConfigPostAcciones;

// textfield
var denmest, denmestaso;
// form
var formest;
// index para el modificar
var idtdoc, apltdoc;
var prevrow = -1;
var arrayidestadosparaasoc = [];
var arrayidestadoparadesasoc = [];
var cambiorealizado = false;
var tfdenominacionbus, btnBuscarEstado, btnLimpiar;
var BarraProgresoEstado = new BarraEstado();

//componente para el manejo de los mensajes de errores de texto regido
var ObjValidacionesFT = new Utilidades.Cmp.Cmpvalidaciones();


/*Ext.grid.CheckColumn = function (config) {
 Ext.apply(this, config);
 if (!this.id) {
 this.id = Ext.id();
 }
 this.renderer = this.renderer.createDelegate(this);
 };
 
 Ext.grid.CheckColumn.prototype = {
 init: function (grid) {
 this.grid = grid;
 this.grid.on('render', function () {
 var view = this.grid.getView();
 view.mainBody.on('mousedown', this.onMouseDown, this);
 }, this);
 },
 onMouseDown: function (e, t) {
 if (t.id == this.id) {
 e.stopEvent();
 var index = this.grid.getView().findRowIndex(t);// Line numbers
 var cindex = this.grid.getView().findCellIndex(t);// Column good
 var record = this.grid.store.getAt(index);// Line records
 var field = this.grid.colModel.getDataIndex(cindex);// Column name
 var value = !record.data[this.dataIndex];// Click on the back, get the current  checkbox The value of the negated value
 record.set(this.dataIndex, value);// Set the checkbox is selected when the value of the
 // Event parameters
 var e = {
 grid: this.grid,
 record: record,
 field: field,
 originalValue: record.data[this.dataIndex],
 value: !record.data[this.dataIndex],
 row: index,
 column: cindex
 };
 
 //afterEdit Event
 this.grid.fireEvent("afteredit", e); // Application events, parameter
 
 }
 },
 renderer: function (v, p, record) {
 p.css += ' x-grid3-check-col-td';
 return '<div>&#160;</div>';
 }
 };*/

Ext.grid.CheckColumn = function(config) {
    Ext.apply(this, config);
    if (!this.id) {
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.CheckColumn.prototype = {
    init: function(grid) {
        this.grid = grid;
        this.grid.on('render', function() {
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },
    onMouseDown: function(e, t) {
        if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
            var value = !record.data[this.dataIndex];
            record.set(this.dataIndex, !record.data[this.dataIndex]);
            if (record.data.eliminarinicial != record.data.eliminar || record.data.modificar != record.data.modificarinicial) {
                var filaMod = true;
            }
            if (filaMod) {
                arraytemprecords.push(record.id);
            }
            var cant = arraytemprecords.length;
            (filaMod) ? cant-- : null;
            for (var i = 0; i < cant; i++) {
                if (arraytemprecords[i] == record.id) {
                    arraytemprecords.splice(i, 1);
                    break;
                }

            }//
            cant = arraytemprecords.length;
            (cant > 0) ? modInvolPostAccion = true : modInvolPostAccion = false;
            (modInvolPostAccion) ? Ext.getCmp('btnAceptarVentanaConfigPostAcciones').enable() : Ext.getCmp('btnAceptarVentanaConfigPostAcciones').disable();

        }
    }
    ,
    renderer: function(v, p, record) {
        p.css += ' x-grid3-check-col-td';
        return '<div class="x-grid3-check-col' + (v ? '-on' : '') + ' x-grid3-cc-' + this.id + '">&#160;</div>';
    }
};


function CargarInterfaz() {
    Ext.Ajax.timeout = 1000000000;
    // Gestionar Estados
    addestn = new Ext.Button({
        tooltip: 'Adicionar estado',
        id: 'addestn',
        iconCls: 'icondistra-adicionar',
        handler: function() {
            Winop('addest', 'Adicionar');
        },
        key: {
            alt: true,
            key: 'I'
        },
        scope: this
    });
    modestn = new Ext.Button({
        tooltip: 'Modificar estado',
        iconCls: 'icondistra-modificar',
        disabled: true,
        id: 'modestn',
        handler: function() {
            Winop('modest', 'Modificar');
        },
        key: {
            alt: true,
            key: 'M'
        },
        scope: this
    });
    eliestn = new Ext.Button({
        tooltip: 'Eliminar estado',
        disabled: true,
        iconCls: 'icondistra-eliminar',
        id: 'eliestn',
        handler: function() {//+ smEstado.getSelected().data.denominacion +
            //  mostrarMensaje(2, '¿Est&aacute; seguro que quiere eliminar el estado seleccionado?', eliminarestado);
            eliminarestado();
        },
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });
    stTDoc = new Ext.data.Store({
        url: 'cargartdoc',
        reader: new Ext.data.JsonReader({
            root: "data",
            totalProperty: "cant",
            id: "idtdoc"
        }, [{
                name: 'idtdoc',
                mapping: 'idtipodoc'
            }, {
                name: 'denomtdoc',
                mapping: 'denominacion'
            }, {
                name: 'nombretipodocumento'
            }
        ])
    });
    btnAyuda = new Ext.Button({
        id: 'btnAyudaGestionarEstado',
        text: 'Ayuda',
        iconCls: 'ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad'
    });
    btnPostAcciones = new Ext.Button({
        disabled: true,
        handler: function() {
            CrearVentanaConfigPostAcciones();
        },
        iconCls: 'configuracion',
        tooltip: 'Configurar las post-acciones del estado',
        key: {
            alt: true,
            key: 'F'
        },
        scope: this
    });

    btnGenerarEstados = new Ext.Button({
        disabled: false,
        handler: function() {
            GenerarEstadoPorDefecto();
        },
        iconCls: 'config',
        tooltip: 'Generar estado por defecto',
        /*key: {
         alt: true,
         key: 'F'
         },*/
        scope: this
    });

    asociarEstado = new Ext.form.ComboBox({
        emptyText: 'Seleccione...',
        fieldLabel: 'Asociar estado(s)',
        store: stTDoc,
        hiddenName: 'idtdoc',
        valueField: 'idtdoc',
        displayField: 'nombretipodocumento',
        forceSelection: true,
        triggerAction: 'all',
        readOnly: true,
        mode: 'remote',
        anchor: '90%',
        listeners: {
            select: function(combo, record, index) {
                var documentoseleccionado = combo.getValue();
                var nombredocumento = record.data.nombretipodocumento;
                CrearWindowAsociarEstado(documentoseleccionado, nombredocumento);
            }
        }
    });
    tfdenominacionbus = new Ext.form.TextField({
        width: 270,
        allowBlank: true,
        listeners: {
            specialkey: function(field, e) {
                if (e.getKey() == e.ENTER && tfdenominacionbus.getValue() != '') {
                    stEstado.reload({
                        params: {
                            limit: limit,
                            start: start
                        },
                        denominacion: tfdenominacionbus.getValue()
                    });
                }
            }
        }
    });

    stEstado = new Ext.data.Store({
        url: 'cargarestado',
        autoLoad: true,
        listeners: {
            beforeload: function(st) {
                modestn.disable();
                eliestn.disable();
                st.baseParams.denominacion = tfdenominacionbus.getValue();
                st.baseParams.limit = limit;
                st.baseParams.start = start;
            },
            load: function(st) {
                ActualizarBarraHerramientas();
            }
        },
        reader: new Ext.data.JsonReader({
            root: "campos",
            totalProperty: "total",
            id: "idestado"
        }, [{
                name: 'idestado',
                mapping: 'idestado'
            }, {
                name: 'denominacion'
            }, {
                name: 'nombreautor'
            }, {
                name: 'modifica'
            }, {
                name: 'elimina'
            }, {
                name: 'docplan'
            }, {
                name: 'docobjetivo'
            }, {
                name: 'docactividad'
            }, {
                name: 'superior'
            }])
    });

    btnBuscarEstado = new Ext.Button({
        tooltip: 'Buscar estado(s)',
        iconCls: 'icondistra-buscar',
        handler: function() {
            if (tfdenominacionbus.getValue() != '') {
                stEstado.reload({
                    params: {
                        limit: limit,
                        start: start
                    },
                    denominacion: tfdenominacionbus.getValue(),
                    callback: function() {
                        if (stEstado.getTotalCount() == 0) {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                            tfdenominacionbus.reset();
                            stEstado.reload({
                                params: {
                                    limit: limit,
                                    start: start
                                }
                            });
                        }
                    }
                });
            }
        },
        key: {
            alt: true,
            key: 'B'
        },
        scope: this
    });

    btnLimpiar = new Ext.Button({
        tooltip: 'Limpiar filtro(s)',
        iconCls: 'icondistra-limpiar',
        handler: function() {
            tfdenominacionbus.reset();
            stEstado.reload({
                params: {
                    limit: limit,
                    start: start
                }
            });
        },
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });
    Ext.apply(Ext.form.VTypes, {
        validarEspaciosEnBlanco: function(value, field) {
            return (!(/^\s+|\s+$/.test(value)));
        },
        validarEspaciosEnBlancoText: 'No se admite el uso del espacio antes ni después del valor del campo.'
    });

    smEstado = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function(sm, indice, record) {
                if (prevrow >= 0 && prevrow != indice) {
                    Ext.get(gpEstado.getView().getRow(prevrow)).removeClass('superior2');
                    Ext.get(gpEstado.getView().getRow(prevrow)).addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(gpEstado.getView().getRow(indice)).removeClass('superior');
                    Ext.get(gpEstado.getView().getRow(indice)).addClass('superior2');
                    prevrow = indice;
                } else
                    prevrow = -1;
                if (sm.getSelections().length > 1) {
                    modestn.disable();
                    btnPostAcciones.disable();
                } else {
                    modestn.enable();
                    btnPostAcciones.enable();
                }
                ActualizarBarraHerramientas();
            },
            selectionchange: function() {
                ActualizarBarraHerramientas();
            },
            rowdeselect: function(sm, indice, record) {
                if (sm.getSelections().length == 1) {
                    modestn.enable();
                    btnPostAcciones.enable();
                } else {
                    modestn.disable();
                    btnPostAcciones.disable();
                }
            }
        }
    });

    ptEstado = new Ext.PagingToolbar({
        pageSize: 1000,
        store: stEstado,
        displayInfo: true,
        listeners: {
            beforechange: function(paginado, evento) {
                start = evento.start;
                limit = evento.limit;
            }
        }
    });

    gpEstado = new Ext.grid.GridPanel({
        id: 'gpEstado',
        master_column_id: 'expandir',
        region: 'center',
        autoExpandColumn: 'expandir',
        stripeRows: true,
        store: stEstado,
        margins: '2 2 2 -4',
        sm: smEstado,
        columns: [smEstado, {
                hidden: true,
                hideable: false,
                dataIndex: 'idestado'
            },
            {
                header: "Denominaci&oacute;n",
                dataIndex: 'denominacion',
                id: 'expandir'
            }, {
                header: '<span class="icondistra-folder sipac-azul"></span>' + ' ' + "Plan",
                dataIndex: 'docplan',
                width: 100,
                renderer: MostrarImagenBoleana
            }, {
                header: '<span class="icondistra-archivo sipac-azul"></span>' + ' ' + "Objetivo",
                dataIndex: 'docobjetivo',
                width: 100,
                renderer: MostrarImagenBoleana
            }, {
                header: '<span class="icondistra-actividades sipac-azul"></span>' + ' ' + "Actividad",
                dataIndex: 'docactividad',
                width: 100,
                renderer: MostrarImagenBoleana
            }, {
                header: "Autor",
                dataIndex: 'nombreautor',
                width: 110,
                renderer: function(val) {
                    return "" + val + "";
                }
            }
        ],
        loadMask: {
            msg: "Cargando estados"
        },
        bbar: ptEstado
    });

    function MostrarImagenBoleana(valor) {
        if (valor == 0 || valor == null) {
            return ' ';
        }
        if (valor != 0) {
            return '<center><span class="icondistra-validaryaceptar sipac-verde"></span></center>';
        }
    }

    gpEstado.getView().getRowClass = function(ri, n) {
        if (ri.data.superior)
            return "superior";
        else
            return "";
    };

    pEstados = new Ext.Panel({
        layout: 'border',
        tbar: [addestn, ' ', modestn, ' ', eliestn, ' ', btnPostAcciones, ' ', btnGenerarEstados, '-',
            'Asociar estados: ', asociarEstado, '-', 'Denominaci&oacute;n: ', tfdenominacionbus, ' ', btnBuscarEstado,
            '-', btnLimpiar, '->', btnAyuda],
        usarKeymap: true,
        botonesKeymap: [addestn, modestn, eliestn, btnPostAcciones, btnBuscarEstado, btnLimpiar, btnAyuda],
        items: gpEstado
    });

    //viewport de la vista
    vpGestionarEstados = new Ext.Viewport({
        layout: 'fit',
        items: pEstados
    });
    function CrearWindowAsociarEstado(documentoseleccionado, nombredocumento) {
        if (windowasociarestado) {
            windowasociarestado.destroy();
        }
        cambiorealizado = false;
        btnEstadoInicial = new Ext.Button({
            tooltip: 'Seleccionar el estado como estado inicial',
            disabled: true,
            id: 'btnEstadoInicial',
            prevTab: 'btnDesAsociarEstado',
            nextTab: 'btnQuitarEstadoInicial',
            iconCls: 'icondistra-iniciodeanno',
            handler: function() {
                PonerEstadoComoInicial(1, documentoseleccionado);
            }
        });
        btnQuitarEstadoInicial = new Ext.Button({
            tooltip: 'Eliminar la selecci&oacute;n como estado inicial',
            disabled: true,
            id: 'btnQuitarEstadoInicial',
            prevTab: 'btnEstadoInicial',
            nextTab: 'btnEstadoNotificacion',
            iconCls: 'icondistra-iniciodeanno sipac-roja',
            icon: perfil.dirImg + 'finanno.png',
            handler: function() {
                PonerEstadoComoInicial(0, documentoseleccionado);
            }
        });
        btnEstadoNotificacion = new Ext.Button({
            tooltip: 'Establecer como estado generador de notificaciones',
            disabled: true,
            id: 'btnEstadoNotificacion',
            prevTab: 'btnQuitarEstadoInicial',
            nextTab: 'btnQuitarEstadoNotificacion',
            iconCls: 'icondistra-notificaciones',
            handler: function() {
                PonerEstadoComoGenerador(1, documentoseleccionado);
            }
        });
        btnQuitarEstadoNotificacion = new Ext.Button({
            tooltip: 'Eliminar la selecci&oacuten como estado generador de notificaciones',
            disabled: true,
            id: 'btnQuitarEstadoNotificacion',
            prevTab: 'btnEstadoNotificacion',
            nextTab: 'btnRestriccion',
            iconCls: 'icondistra-notificaciones sipac-roja',
            icon: perfil.dirImg + 'finanno.png',
            handler: function() {
                PonerEstadoComoGenerador(0, documentoseleccionado);
            }
        });
        btnControlCambios = new Ext.Button({
            tooltip: 'Establecer como estado generador de control de cambios',
            disabled: true,
            id: 'btnControlCambios',
            prevTab: 'btnRestriccion',
            netxTab: 'btnQuitarControlCambios',
            iconCls: 'icondistra-planificacionycontrol',
            handler: function() {
                PonerEstadoComoControl(1, documentoseleccionado);
            }
        });
        btnQuitarControlCambios = new Ext.Button({
            tooltip: 'Eliminar la selecci&oacuten como estado generador de control de cambios',
            disabled: true,
            id: 'btnQuitarControlCambios',
            prevTab: 'btnControlCambios',
            nextTab: 'btncerrarasociar',
            iconCls: 'icondistra-planificacionycontrol sipac-roja',
            icon: perfil.dirImg + 'finanno.png',
            handler: function() {
                PonerEstadoComoControl(0, documentoseleccionado);
            }
        });
        btnRestriccion = new Ext.Button({
            tooltip: 'Establecer restricciones a los subordinados sobre los estados heredados',
            disabled: true,
            id: 'btnRestriccion',
            prevTab: 'btnQuitarEstadoNotificacion',
            netxTab: 'btnControlCambios',
            iconCls: 'icondistra-restringir',
            handler: function() {
                CrearWinRestricciones();
            }
        });
        btnAsociarEstado = new Ext.Button({
            tooltip: 'Asociar estado(s)',
            disabled: true,
            id: 'btnAsociarEstado',
            nextTab: 'btnDesAsociarEstado',
            prevTab: 'btncerrarasociar',
            iconCls: 'siguiente',
            handler: function() {
                AsociarEstados(documentoseleccionado);
                GEstadosSinAsociar.getView().refresh(true);

            }
        });
        //fsera
        btnDesAsociarEstado = new Ext.Button({
            tooltip: 'Desasociar estado(s)',
            disabled: true,
            id: 'btnDesAsociarEstado',
            prevTab: 'btnAsociarEstado',
            nextTab: 'btnEstadoInicial',
            iconCls: 'anterior',
            handler: function() {
                DesAsociarEstados(documentoseleccionado);
                GEstadosAsociados.getView().refresh(true);
            }
        });
        pasociar = new Ext.Panel({
            region: 'center',
            bodyStyle: 'padding:170px 01px',
            frame: true,
            items: [btnAsociarEstado, btnDesAsociarEstado]
        });
        stGEstadosAsociados = new Ext.data.Store({
            url: 'cargarestadoasoc',
            listeners: {
                beforeload: function(st) {
                    st.baseParams.idtdoc = documentoseleccionado;
                },
                load: function(st) {
                }
            },
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "total",
                id: "idestado"
            }, [{
                    name: 'denominacion'
                }, {
                    name: 'idestado'
                }, {
                    name: 'idtdoc'
                }, {
                    name: 'generacontrol'
                }, {
                    name: 'inicial'
                }, {
                    name: 'notificacion'
                }])
        });
        smGEstadosAsociados = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                selectionchange: function() {
                    ActualizarBotonesDesAsociar();
                }
            }
        });
        GEstadosAsociados = new Ext.grid.GridPanel({
            title: 'Estados asociados',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: 480,
            store: stGEstadosAsociados,
            sm: smGEstadosAsociados,
            region: 'east',
            tbar: [btnEstadoInicial, ' ', btnQuitarEstadoInicial, '-', btnEstadoNotificacion, ' ',
                btnQuitarEstadoNotificacion, '-', btnRestriccion, '-',
                btnControlCambios, ' ', btnQuitarControlCambios],
            columns: [smGEstadosAsociados,
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idtdoc'
                }, {
                    header: "Denominaci&oacute;n",
                    dataIndex: 'denominacion',
                    id: 'expandir'
                }, {
                    header: "Estado inicial",
                    dataIndex: 'inicial',
                    width: 80,
                    renderer: MostrarImagenT
                }, {
                    header: "Notificaci&oacute;n",
                    dataIndex: 'notificacion',
                    width: 80,
                    renderer: MostrarImagenT
                }, {
                    header: "Control de cambios",
                    dataIndex: 'generacontrol',
                    width: 120,
                    renderer: MostrarImagenT
                }],
            loadMask: {
                msg: "Cargando estado(s) asociado(s)"
            },
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: stGEstadosAsociados,
                displayInfo: true,
                listeners: {
                    beforechange: function(paginado, evento) {
                        start = evento.start;
                        limit = evento.limit;
                    }
                }
            })
        });
        smGEstadosSinAsociar = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                selectionchange: function() {
                    ActualizarBotonesAsociar();
                }
            }
        });
        stGEstadosSinAsociar = new Ext.data.Store({
            url: 'cargarestadosasoc',
            listeners: {
                beforeload: function(st) {
                    st.baseParams.idtdoc = documentoseleccionado;
                }
            },
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "total",
                id: "idestado"
            }, [{
                    name: 'denominacion'
                }, {
                    name: 'idestado'
                }])
        });
        GEstadosSinAsociar = new Ext.grid.GridPanel({
            title: 'Estados sin asociar',
            master_column_id: 'expandir',
            id: 'gridEstadoSinAsociar',
            autoExpandColumn: 'expandir',
            region: 'west',
            width: 450,
            border: false,
            stripeRows: true,
            autoScroll: true,
            store: stGEstadosSinAsociar,
            sm: smGEstadosSinAsociar,
            columns: [
                smGEstadosSinAsociar,
                {
                    header: "Denominaci&oacute;n",
                    dataIndex: 'denominacion',
                    id: 'expandir'
                }],
            loadMask: {
                msg: "Cargando estado(s) sin asociar"
            },
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: stGEstadosSinAsociar,
                displayInfo: true,
                listeners: {
                    beforechange: function(paginado, evento) {
                        start = evento.start;
                        limit = evento.limit;
                    }
                }
            })
        });

        pEstadosAsociados = new Ext.Panel({
            layout: 'border',
            border: false,
            items: [GEstadosAsociados, pasociar, GEstadosSinAsociar]
        });

        winasocestados = new Ext.Window({
            title: 'Asociar estados al tipo de documento "' + nombredocumento + '"',
            height: 450,
            width: 1000,
            constrain: true,
            border: false,
            layout: 'fit',
            defaultButton: 'btncerrarasociar',
            resizable: false,
            draggable: true,
            modal: true,
            items: [pEstadosAsociados],
            buttons: [
                {
                    text: 'Cerrar',
                    iconCls: 'cerrar',
                    id: 'btncerrarasociar',
                    //nextTab:'gridEstadoSinAsociar',
                    nextTab: 'btnAsociarEstado',
                    prevTab: 'btnQuitarControlCambios',
                    tooltip: 'Cerrar ventana',
                    handler: function() {
                        asociarEstado.clearValue();
                        if (cambiorealizado) {
                            stEstado.reload({
                                params: {
                                    start: start,
                                    limit: limit
                                }
                            });
                        }
                        winasocestados.destroy();
                    }
                }
            ],
            listeners: {
                show: function(win) {
                    stGEstadosAsociados.reload({
                        params: {
                            idtdoc: documentoseleccionado,
                            start: start,
                            limit: limit
                        }
                    });
                    stGEstadosSinAsociar.reload({
                        params: {
                            idtdoc: documentoseleccionado,
                            start: start,
                            limit: limit
                        },
                        callback: function(r, option, success) {
                        }
                    });
                }
            }
        });
        winasocestados.show();

    }


    function ActualizarBarraHerramientas() {
        eliestn.disable();
        asociarEstado.enable();
        if (smEstado.hasSelection()) {
            var record = smEstado.getSelected();
            if (record.data.elimina == 1) {
                eliestn.enable();
            }
            asociarEstado.disable(true);
        }
    }

    function ActualizarBotonesDesAsociar() {
        btnDesAsociarEstado.disable();
        btnEstadoInicial.disable();
        btnEstadoNotificacion.disable();
        btnQuitarEstadoInicial.disable();
        btnQuitarEstadoNotificacion.disable();
        btnRestriccion.disable();
        btnControlCambios.disable();
        btnQuitarControlCambios.disable();

        arrayidestadoparadesasoc = [];
        var inicialseleccionado = 0;
        var notificacseleccionado = 0;
        if (smGEstadosAsociados.hasSelection()) {
            arrayrecords = smGEstadosAsociados.getSelections();
            totalrecords = arrayrecords.length;
            if (totalrecords > 0) {
                for (var i = 0; i < totalrecords; i++) {
                    if (arrayrecords[i].data.inicial == 1) {
                        inicialseleccionado = 1;
                    }
                    if (arrayrecords[i].data.notificacion == 1) {
                        notificacseleccionado = 1;
                    }
                    arrayidestadoparadesasoc[i] = arrayrecords[i].data.idestado;
                    nombreestadoselec = arrayrecords[i].data.denominacion;
                }
                if (totalrecords == 1) {
                    btnRestriccion.enable();
                }
                if (totalrecords == 1 && arrayrecords[0].data.inicial == 0) {
                    btnEstadoInicial.enable();
                }
                if (totalrecords == 1 && arrayrecords[0].data.notificacion == 0) {
                    btnEstadoNotificacion.enable();
                }
                if (totalrecords == 1 && arrayrecords[0].data.inicial == 1) {
                    btnQuitarEstadoInicial.enable();
                }
                if (totalrecords == 1 && arrayrecords[0].data.notificacion == 1) {
                    btnQuitarEstadoNotificacion.enable();
                }
                if (inicialseleccionado == 0 && notificacseleccionado == 0) {
                    btnDesAsociarEstado.enable();
                }
                //Control de Cambios
                if (totalrecords == 1 && arrayrecords[0].data.generacontrol == 0) {
                    btnControlCambios.enable();
                }
                if (totalrecords == 1 && arrayrecords[0].data.generacontrol == 1) {
                    btnQuitarControlCambios.enable();
                }
            }
        }
    }

    function ActualizarBotonesAsociar() {
        arrayidestadosparaasoc = [];
        btnAsociarEstado.disable();
        if (smGEstadosSinAsociar.hasSelection()) {
            arrayrecords = smGEstadosSinAsociar.getSelections();
            totalrecords = arrayrecords.length;
            if (totalrecords > 0) {
                for (var i = 0; i < totalrecords; i++) {
                    arrayidestadosparaasoc[i] = arrayrecords[i].data.idestado;
                }
                btnAsociarEstado.enable();
            }
        }
    }

    function PonerEstadoComoInicial(valor, documento) {
        var accionprogreso = 'Estableciendo';
        var accionfinal = 'establecido';
        if (valor == 0) {
            accionprogreso = 'Quitando';
            accionfinal = 'quitado';
            mostrarMensaje(2, '¿Est&aacute; seguro que quiere eliminar el comportamiento de este estado?', PonerEstadoInicial);
        } else {
            mostrarMensaje(2, '¿Est&aacute; seguro que quiere generar el comportamiento de este estado?', PonerEstadoInicial);
        }
        function PonerEstadoInicial(btn) {
            if (btn == 'ok') {
                BarraProgresoEstado.show(accionprogreso + ' estado inicial');
                Ext.Ajax.request({
                    url: 'modificarestadoinicial',
                    params: {
                        idestado: arrayidestadoparadesasoc[0],
                        idtdoc: documento,
                        valor: valor
                    },
                    callback: function(options, success, response) {
                        BarraProgresoEstado.hide();
                        if (valor == 0) {
                            var caden = ' ha sido eliminado satisfactoriamente.';
                        } else {
                            var caden = ' ha sido generado satisfactoriamente.';
                        }
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgE != 1) {
                            if (valor == 0) {
                                var caden = ' no ha sido eliminado.';
                            } else {
                                var caden = ' no ha sido generado.';
                            }
                        }
                        responseData = Ext.decode(response.responseText);
                        mostrarMensaje(1, 'El comportamiento del estado seleccionado' + caden);
                        smGEstadosAsociados.clearSelections();
                        stGEstadosAsociados.reload();
                        if (!cambiorealizado) {
                            cambiorealizado = true;
                        }
                    }
                });
            } else {
                if (smGEstadosAsociados.hasSelection())
                    smGEstadosAsociados.clearSelections();
            }
        }
    }

    //*******************************************************************************
    function PonerEstadoComoGenerador(valor, documento) {
        var accionprogreso = 'Estableciendo';
        var accionfinal = 'establecido';
        if (valor == 0) {
            accionprogreso = 'Quitando';
            accionfinal = 'quitado';
            mostrarMensaje(2, '¿Est&aacute; seguro que no quiere generar notificaciones a partir de este estado?', PonerEstadoGenerador);
        } else {
            mostrarMensaje(2, '¿Est&aacute; seguro que quiere generar notificaciones a partir de este estado?', PonerEstadoGenerador);
        }
        function PonerEstadoGenerador(btn) {
            if (btn == 'ok') {
                BarraProgresoEstado.show(accionprogreso + ' estado generador');
                Ext.Ajax.request({
                    url: 'modificarestadogenerador',
                    params: {
                        idestado: arrayidestadoparadesasoc[0],
                        idtdoc: documento,
                        valor: valor
                    },
                    callback: function(options, success, response) {
                        BarraProgresoEstado.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgE == 1) {
                            if (valor == 0) {
                                mostrarMensaje(1, 'La notificación del estado seleccionado ha sido eliminada satisfactoriamente.');
                            } else {
                                mostrarMensaje(1, 'La notificación del estado seleccionado ha sido generada satisfactoriamente.');
                            }
                        } else {
                            if (valor == 0) {
                                mostrarMensaje(1, 'La notificación del estado seleccionado no se ha podido eliminar.');
                            } else {
                                mostrarMensaje(1, 'La notificación del estado seleccionado no se ha podido generar.');
                            }
                        }
                        smGEstadosAsociados.clearSelections();
                        stGEstadosAsociados.reload();
                        if (!cambiorealizado) {
                            cambiorealizado = true;
                        }
                    }
                });
            } else {
                if (smGEstadosAsociados.hasSelection())
                    smGEstadosAsociados.clearSelections();
            }
        }
    }

    //*******************************************************************************
    function PonerEstadoComoControl(valor, documento) {
        var accionprogreso = 'Estableciendo';
        var accionfinal = 'establecido';
        if (valor == 0) {
            accionprogreso = 'Quitando';
            accionfinal = 'quitado';
            mostrarMensaje(2, '¿Est&aacute; seguro que no quiere generar control de cambios a partir de este estado?', PonerEstadoGenerador);
        } else {
            mostrarMensaje(2, '¿Est&aacute; seguro que quiere generar control de cambios a partir de este estado?', PonerEstadoGenerador);
        }
        function PonerEstadoGenerador(btn) {
            if (btn == 'ok') {
                BarraProgresoEstado.show(accionprogreso + ' estado generador');
                Ext.Ajax.request({
                    url: 'modificarEstadoControl',
                    params: {
                        idestado: arrayidestadoparadesasoc[0],
                        idtdoc: documento,
                        valor: valor
                    },
                    callback: function(options, success, response) {
                        BarraProgresoEstado.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsgE == 1) {
                            if (valor == 0) {
                                mostrarMensaje(1, 'El control de cambios del estado seleccionado ha sido eliminado satisfactoriamente.');
                            } else {
                                mostrarMensaje(1, 'El control de cambios del estado seleccionado ha sido generado satisfactoriamente.');
                            }
                        } else {
                            if (valor == 0) {
                                mostrarMensaje(1, 'El control de cambios del estado seleccionado no se ha podido eliminar.');
                            } else {
                                mostrarMensaje(1, 'El control de cambios del estado seleccionado no se ha podido generar.');
                            }
                        }
                        smGEstadosAsociados.clearSelections();
                        stGEstadosAsociados.reload();
                        if (!cambiorealizado) {
                            cambiorealizado = true;
                        }
                    }
                });
            } else {
                if (smGEstadosAsociados.hasSelection())
                    smGEstadosAsociados.clearSelections();
            }
        }
    }

    //*************************************************************************
    function AsociarEstados(documento) {
        BarraProgresoEstado.show('Asociando estados');
        Ext.Ajax.request({
            url: 'asociarestadotdoc',
            params: {
                idtdoc: documento,
                arrEst: Ext.encode(arrayidestadosparaasoc)
            },
            callback: function(options, success, response) {
                BarraProgresoEstado.hide();
                responseData = Ext.decode(response.responseText);
                if (arrayidestadosparaasoc.length > 1) {
                    if (responseData.codMsgE == 1)
                        msg = 'Los estados han sido asociados satisfactoriamente.';
                    else
                        msg = 'Los estados no se han podido asociar.';
                } else {
                    if (responseData.codMsgE == 1)
                        msg = 'El estado ha sido asociado satisfactoriamente.';
                    else
                        msg = 'El estado no se ha podido asociar.';
                }
                mostrarMensaje(1, msg);
                stGEstadosSinAsociar.removeAll();
                stGEstadosSinAsociar.reload();
                stGEstadosAsociados.removeAll();
                stGEstadosAsociados.reload();
                ActualizarBotonesAsociar();
                ActualizarBotonesDesAsociar();
                if (!cambiorealizado) {
                    cambiorealizado = true;
                }
            }
        });
    }

    function DesAsociarEstados(documento) {
        BarraProgresoEstado.show('Eliminando asociaci&oacute;n');
        Ext.Ajax.request({
            url: 'desasociarestadotdoc',
            params: {
                idtdoc: documento,
                arrEst: Ext.encode(arrayidestadoparadesasoc)
            },
            callback: function(options, success, response) {
                BarraProgresoEstado.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsgE == 2) {
                    responseData.codMsgE = 3;
                    if (arrayidestadoparadesasoc.length > 1) {
                        msg = 'Las asociaciones no pueden ser eliminadas debido a que se encuentran siendo utilizadas en transiciones existentes.'
                    }
                    msg = 'La asociaci&oacute;n no pudo ser eliminada debido a que se encuentra siendo utilizada en transiciones existentes.'
                } else {
                    if (arrayidestadoparadesasoc.length > 1) {
                        msg = 'Los estados han sido desasociados satisfactoriamente.'
                    } else {
                        msg = 'El estado ha sido desasociado satisfactoriamente.'
                    }
                }
                mostrarMensaje(1, msg);
                stGEstadosSinAsociar.removeAll();
                stGEstadosSinAsociar.reload();
                stGEstadosAsociados.removeAll();
                stGEstadosAsociados.reload();
                ActualizarBotonesAsociar();
                ActualizarBotonesDesAsociar();
                if (!cambiorealizado) {
                    cambiorealizado = true;
                }
            }
        });
    }

    // Ventanas
    function Winop(op, title) {
        denmest = new Ext.form.TextField({
            fieldLabel: 'Denominaci&oacute;n',
            id: 'denmest',
            width: 270,
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9'"()_\-/,.]+)([\s]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9'"()_\-/,.])*$/,
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: 'Solo admite caracteres alfanuméricos y el(los) carácter(es) especial(es) (- _ ' + "''" + ' "" () , . /).',
            vtype: 'validarEspaciosEnBlanco',
            name: 'denominacion',
            maxLength: 255,
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            allowBlank: false,
            prevTab: 'btacepact',
            listeners: {
                'render': function(c) {
                    if (op == 'modest') {
                        c.getEl().on('keyup', function() {
                            if (this.isValid()) {
                                if (smEstado.getSelected().data.denominacion !== c.getValue().toString()) {
                                    denominacion = true;
                                } else {
                                    denominacion = false;
                                }
                            }
                        }, c);
                    }
                }
            }
        });

        formest = new Ext.FormPanel({
            frame: true,
            labelWidth: 90,
            items: denmest,
            listeners: {
                'clientvalidation': function(fm, valid) {
                    if (op == 'modest') {
                        if (valid && denominacion) {
                            Ext.getCmp('btacepact').enable();
                        } else {//desabilito
                            Ext.getCmp('btacepact').disable();
                        }
                    } else {
                        if (valid) {
                            Ext.getCmp('btacepact').enable();
                        } else {
                            Ext.getCmp('btacepact').disable();
                        }
                    }
                }
            }
        });

        btnAplicar = new Ext.Button({
            text: 'Aplicar',
            id: 'btaplic',
            iconCls: 'icondistra-aplicar',
            tooltip: 'Guardar datos y limpiar los campos',
            nextTab: 'btacepact',
            prevTab: 'btncancelar',
            handler: function() {
                adicionaresta('apl');
            }
        });
        btnAceptar = new Ext.Button({
            text: 'Aceptar ',
            id: 'btacepact',
            nextTab: 'denmest',
            prevTab: 'btaplic',
            iconCls: 'aceptar ',
            tooltip: 'Guardar datos y cerrar ventana',
            cls: 'btn-wrap x-btn x-btn-text-icon  x-btn-focus',
            handler: function() {
                if (op == 'addest') {
                    adicionaresta('add');
                } else {
                    apltdoc = true;
                    modificarestado('mod');
                }
            }
        });

        winop = new Ext.Window({
            layout: 'fit',
            width: 400,
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            resizable: false,
            height: 105,
            title: title + ' estado',
            items: formest,
            listeners: {
                beforehide: function(win) {
                    formest.getForm().reset();
                }
            },
            keys: [{
                    key: Ext.EventObject.ENTER,
                    fn: function() {
                        if (op == 'addest') {
                            adicionaresta('add');
                        } else {
                            apltdoc = true;
                            modificarestado('mod');
                        }
                    },
                    scope: this
                }],
            buttons: [{
                    text: 'Cancelar',
                    id: 'btncancelar',
                    iconCls: 'icondistra-cancelar',
                    tooltip: 'Cerra ventana sin guardar los datos',
                    nextTab: 'btaplic',
                    handler: function() {
                        formest.getForm().reset();
                        winop.destroy();
                        if (smEstado.hasSelection()) {
                            smEstado.clearSelections();
                            ActualizarBarraHerramientas();
                        }
                    }
                }, btnAplicar, btnAceptar]
        });
        winop.show();
        if (op == 'modest') {

            formest.getForm().loadRecord(smEstado.getSelected());
            btnAplicar.setVisible(false);
            Ext.getCmp('btncancelar').nextTab = 'btacepact';
            Ext.getCmp('btacepact').prevTab = 'btncancelar';

        } else {
            btnAplicar.setVisible(true);
        }
        denmest.focus(false, 1024);
    }

    // Funciones Estado
    function cambiosModificar(idestado) {
        var record = stEstado.getById(idestado);
        if (Ext.getCmp('denmest').getValue() == record.get('denominacion')) {
            return false;
        }
        return true;
    }

    function eliminarasoc(record) {
        Ext.Ajax.request({
            url: 'eliminarestasoc',
            params: {
                idtdoc: record.data.idtdoc,
                idestado: record.data.idestado
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                stEstasoc.reload();
            }
        });
    }

    function adicionaresta(tipo) {
        formest.getForm().submit(
                {
                    url: 'adicionarestado',
                    waitMsg: 'Guardando datos del estado.',
                    failure: function(form, action) {
                        if (action.result.codMsgE == 2) {
                            mostrarMensaje(1, 'El estado que quiere adicionar ya existe.');
                        } else if (action.result.codMsgE == 1) {
                            mostrarMensaje(1, 'El estado ha sido adicionado satisfactoriamente.');
                            stEstado.reload();
                            formest.getForm().reset();
                            if (smEstado.hasSelection()) {
                                smEstado.clearSelections();
                                ActualizarBarraHerramientas();
                            }
                            if (tipo == 'add') {
                                winop.destroy();
                                ActualizarBarraHerramientas();
                            }
                        } else {
                            mostrarMensaje(3, 'El estado no ha sido adicionado satisfactoriamente.');
                        }
                    }
                });
    }

    function eliminarestado() {
        var arrayidestados = [];
        var mensaje = '';
        var mensajemascara = '';
        for (var i = 0; i < smEstado.getSelections().length; i++) {
            arrayidestados.push(smEstado.getSelections()[i].id);
        }
        if (arrayidestados.length > 1) {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar los estados seleccionados?';
            mensajemascara = 'Eliminando estados';
        } else {
            mensaje = ' ¿Est&aacute; seguro que quiere eliminar el estado seleccionado?';
            mensajemascara = 'Eliminando estado';
        }

        mostrarMensaje(2, mensaje, function(btnoprimido) {
            if (btnoprimido == 'ok') {
                BarraProgresoEstado.show(mensajemascara);
                Ext.Ajax.request({
                    url: 'eliminarestado',
                    params: {
                        idestado: Ext.encode(arrayidestados)
                    },
                    callback: function(options, success, response) {
                        BarraProgresoEstado.hide();
                        responseData = Ext.decode(response.responseText);

                        if (responseData.codMsgE == 1 || responseData.codMsgE == 2) {
                            stEstado.reload({
                                callback: function() {
                                    mostrarMensaje(1, responseData.mensaje);
                                }
                            });
                        } else {
                            mostrarMensaje(1, responseData.mensaje);
                        }
                    }
                });
            } else {
                if (smEstado.hasSelection()) {
                    smEstado.clearSelections();
                    ActualizarBarraHerramientas();
                }
            }
        });
    }

    function modificarestado(tipo) {
        if (cambiosModificar(smEstado.getSelected().data.idestado)) {
            formest.getForm().submit(
                    {
                        url: 'modificarestado',
                        waitMsg: 'Guardando datos del estado',
                        params: {
                            idestado: smEstado.getSelected().data.idestado
                        },
                        failure: function(form, action) {
                            if (action.result.codMsgA == 2) {
                                mostrarMensaje(1, 'El estado que deseamodificar ya existe.');
                            } else if (action.result.codMsgD == 1) {
                                mostrarMensaje(1, 'El estado ha sido modificado satisfactoriamente.');
                                stEstado.reload();
                                formest.getForm().reset();
                                winop.destroy();
                                if (smEstado.hasSelection()) {
                                    smEstado.clearSelections();
                                }
                                ActualizarBarraHerramientas();
                            } else {
                                mostrarMensaje(3, 'El estado no ha sido modificado satisfactoriamente.');
                            }
                        }
                    });
        }
    }

    function CrearWinRestricciones() {
        if (winrestricciones)
            winrestricciones.destroy();

        stGSubordinados = new Ext.data.Store({
            url: 'cargarusuariosubordinados',
            autoLoad: true,
            listeners: {
                beforeload: function(st) {
                    st.baseParams.idtipodoc = asociarEstado.getValue();
                    st.baseParams.idestado = arrayidestadoparadesasoc[0];
                },
                load: function(st) {
                    arrayrecordsrestric = st.getRange();
                }
            },
            reader: new Ext.data.JsonReader({
                root: "campos",
                id: "idusuario",
                totalProperty: 'total'
            }, [
                {
                    name: 'idusuario'
                }, {
                    name: 'idestructura'
                }, {
                    name: 'tipo'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'inicial', type: 'bool'
                }, {
                    name: 'fueinicial', type: 'bool'
                }, {
                    name: 'finall', type: 'bool'
                }, {
                    name: 'fuefinal', type: 'bool'
                }
            ])
        });
        smGSubordinados = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {}
        });

        checkColumnInicial = new Ext.grid.CheckColumn({
            header: "No usar como estado inicial",
            dataIndex: 'inicial',
            width: 150
        });

        checkColumnFinal = new Ext.grid.CheckColumn({
            header: "No usar como estado final",
            dataIndex: 'finall',
            width: 150
        });

        tfbuscarrestric = new Ext.form.TextField({
            enableKeyEvents: true,
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9'"()_\-/,.]*)([\s]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9]+)([\s]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9'"()_\-/,.])*$/,
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: 'Solo admite caracteres alfanuméricos y los caracteres especiales (- _ ' + "''" + ' "" () , . /).',
            maxLength: 255,
            width: 150,
            id: 'tfbuscarrestric',
            prevTab: 'btacep',
            nextTab: 'btnBuscarRestric',
            listeners: {
                keyup: function(tf, e) {
                    if (tf.isValid() && tf.getValue() != '') {
                        btnBuscarRestric.enable();
                    } else {
                        btnBuscarRestric.disable();
                    }
                }
            }
        });

        btnBuscarRestric = new Ext.Button({
            handler: function() {
                if (_this.tfbuscarrestric.isValid()) {
                    buscarCadena(tfbuscarrestric.getValue(), 2);
                }
            },
            text: '',
            id: 'btnBuscarRestric',
            nextTab: 'btnLimpiarRestric',
            prevTab: 'tfbuscarrestric',
            iconCls: 'buscar',
            disabled: true,
            tooltip: 'Buscar usuarios y estructuras',
            key: {
                alt: true,
                key: 'B'
            },
            scope: this
        });
        btnLimpiarRestric = new Ext.Button({
            disabled: false,
            id: 'btnLimpiarRestric',
            nextTab: 'btncancelarRestric',
            prevTab: 'btnBuscarRestric',
            handler: function() {
                tfbuscarrestric.reset();
                btnBuscarRestric.disable();
                stGSubordinados.reload();
            },
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtro(s)',
            key: {
                alt: true,
                key: 'L'
            },
            scope: this
        });

        GSubordinados = new Ext.grid.EditorGridPanel({
            frame: true,
            title: 'Subordinados restringidos',
            region: 'center',
            clicksToEdit: 1,
            width: 260,
            autoExpandColumn: 'expandir',
            store: stGSubordinados,
            tbar: ['Buscar:', '', tfbuscarrestric, '-', btnBuscarRestric, btnLimpiarRestric],
            margins: '2 2 2 -4',
            sm: smGSubordinados,
            plugins: [checkColumnInicial, checkColumnFinal],
            columns: [
                {
                    header: "Denominaci&oacute;n",
                    sortable: true,
                    dataIndex: 'denominacion',
                    id: 'expandir'
                }, {
                    header: "Tipo",
                    sortable: true,
                    dataIndex: 'tipo',
                    renderer: PonerTipo
                },
                checkColumnInicial,
                checkColumnFinal
            ],
            loadMask: {
                msg: "Cargando subordinados"
            },
            listeners: {
                afteredit: function(obj) {
                    var datos = [];
                    GSubordinados.getModifiedRecords().forEach(function(record) {
                        datos.push(record.data)
                    });
                    if (datos.length != 0)
                        Ext.getCmp('btacep').enable();
                    else
                        Ext.getCmp('btacep').disable();
                }
            }
        });

        winrestricciones = new Ext.Window({
            title: 'Restricciones para utilizar el estado: ' + nombreestadoselec,
            height: 450,
            width: 800,
            border: false,
            constrain: true,
            layout: 'border',
            resizable: false,
            draggable: true,
            modal: true,
            items: [GSubordinados],
            buttons: [
                {
                    text: 'Cancelar',
                    id: 'btncancelarRestric',
                    iconCls: 'icondistra-cancelar',
                    nextTab: 'btacep',
                    prevTab: 'btnLimpiarRestric',
                    tooltip: 'Cerrar ventana sin guardar los datos',
                    handler: function() {
                        _this.winrestricciones.destroy();
                    }
                }, {
                    text: 'Aceptar ',
                    id: 'btacep',
                    nextTab: 'tfbuscarrestric',
                    prevTab: 'btncancelarRestric',
                    iconCls: 'icondistra-aceptar ',
                    tooltip: 'Guardar datos y cerrar ventana',
                    handler: function() {
                        ConfigurarRestricciones();
                        winrestricciones.destroy();
                    }
                }
            ]
        });
        winrestricciones.show();
        tfbuscarrestric.focus(false, 1024);
    }

    function ConfigurarRestricciones() {
        var records = GSubordinados.getStore().getModifiedRecords();
        var recordsMod = [];
        for (var i = 0; i < records.length; i++) {
            if ((records[i].data.inicial != records[i].data.fueinicial)
                    || (records[i].data.finall != records[i].data.fuefinal)) {
                var iduserestruct = (records[i].data.tipo == 1) ? records[i].data.idusuario : records[i].data.idestructura;
                recordsMod.push({
                    idusuario: iduserestruct,
                    finall: records[i].data.finall,
                    inicial: records[i].data.inicial,
                    tipo: records[i].data.tipo
                });
            }
        }
        if (i > 0) {
            BarraProgresoEstado.show('Configurando restricciones');
            Ext.Ajax.request({
                url: 'configurarrestricciones',
                params: {
                    arraycambios: Ext.encode(recordsMod),
                    idestado: arrayidestadoparadesasoc[0],
                    idtipodoc: asociarEstado.getValue()
                },
                callback: function(options, success, response) {
                    BarraProgresoEstado.hide();
                    responseData = Ext.decode(response.responseText);
                    var msj = 'La restricción ha sido configurada satisfactoriamente.';
                    var icono = 1;
                    if (responseData.mensaje == 0) {
                        var msj = 'Usted no ha realizado modificaciones.';
                        var icono = 1;
                    }
                    mostrarMensaje(icono, msj);
                }
            });
        }
    }

    function MostrarImagenTipoElemento(valor) {
        var icon = 'plan';
        if (valor) {
            var arrayvalor = valor.split("*");
            if (arrayvalor[1] == 1) {
                icon = 'obj_ejec';
            }
            if (arrayvalor[1] == 3) {
                icon = 'act_ejec';
            }
        }
        return '<span><img src="../../../../../planificacion/pdo/comun/recursos/images/fam/' + icon + '.png" >' + ' ' + arrayvalor[0] + '</span>';
    }

    function MostrarImagenT(val) {
        if (val == 0) {
            return ' ';
        }
        if (val > 0) {
            return '<center><span class="icondistra-validaryaceptar sipac-verde"></span></center>';
        }
        return ' ';
    }

    function ExpandirPanelConfiguracionPost(accion) {
        arrayidpostcondiciones = [];
        postcondseleccionadas = smGListadoPost.getSelections();
        if (postcondseleccionadas.length > 0) {
            for (var i = 0; i < postcondseleccionadas.length; i++) {
                arrayidpostcondiciones[i] = postcondseleccionadas[i].data.idcondicion;
            }
        }
        if (accion == 'exp') {
            pconfiguracionpost.expand();
            stGPost.reload({});
        } else {
            pconfiguracionpost.collapse();
        }
    }

    function CrearVentanaConfigPostAcciones() {
        if (ventanaConfigPostAcciones)
            ventanaConfigPostAcciones.destroy();
        expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                    '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
                    )
        });
        //panel donde muestro la configuracion de la postaccion
        stGPost = new Ext.data.Store({
            url: 'cargarusuariospost',
            listeners: {
                beforeload: function(st) {
                    if (smEstado.hasSelection()) {
                        st.baseParams.idestado = smEstado.getSelections()[0].data.idestado;
                    }
                },
                load: function(st, records, options) {
                    arrayrecords = st.getRange();
                }
            },
            reader: new Ext.data.JsonReader({
                root: "campos",
                id: "idusuario",
                totalProperty: 'total'
            }, [
                {
                    name: 'idusuario'
                }, {
                    name: 'idestructura'
                }, {
                    name: 'tipo'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'modificar'
                }, {
                    name: 'modificarinicial'
                }, {
                    name: 'eliminar'
                }, {
                    name: 'eliminarinicial'
                }
            ])
        });
        checkColumnMod = new Ext.grid.CheckColumn({
            header: "Modificar",
            dataIndex: 'modificar',
            width: 80
        });
        checkColumnElim = new Ext.grid.CheckColumn({
            header: "Eliminar",
            dataIndex: 'eliminar',
            width: 80
        });
        smGPost = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {}
        });
        pgusuarios = new Ext.PagingToolbar({
            pageSize: 1000,
            store: stGPost,
            displayInfo: true,
            id: 'pgusuarios',
            listeners: {
                beforechange: function(paginado, evento) {
                    start = evento.start;
                    limit = evento.limit;
                }
            }
        });

        tfbuscar = new Ext.form.TextField({
            enableKeyEvents: true,
            regex: ObjValidacionesFT.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: ObjValidacionesFT.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            maxLength: 255,
            width: 110,
            listeners: {
                'render': function(c) {
                    c.getEl().on('keyup', function() {
                        if (tfbuscar.isValid() && tfbuscar.getValue() != '') {
                            btnBusquedaPost.enable();
                            btnLimpiarPost.enable();
                        } else {
                            btnBusquedaPost.disable();
                            btnLimpiarPost.disable();
                        }
                    }, c);
                },
                'keydown': function(tf, e) {
                    if (e.getKey() == 13) {
                        if (tfbuscar.isValid() && tfbuscar.getValue() != '') {
                            btnBusquedaPost.handler();
                        }
                    }
                },
            }
        });

        btnBusquedaPost = new Ext.Button({
            handler: function() {
                buscarCadena(tfbuscar.getValue(), 1);
            },
            iconCls: 'buscar',
            disabled: true,
            tooltip: 'Buscar Usuarios y Estructuras',
            key: {
                alt: true,
                key: 'B'
            },
            scope: this
        });

        btnLimpiarPost = new Ext.Button({
            disabled: true,
            handler: function() {
                tfbuscar.setValue('');
                stGPost.reload();
                btnBusquedaPost.disable();
                btnLimpiarPost.disable();
            },
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtro',
            key: {
                alt: true,
                key: 'L'
            },
            scope: this
        });

        GPost = new Ext.grid.EditorGridPanel({
            title: 'Listado de usuarios subordinados y estructuras',
            frame: true,
            region: 'center',
            clicksToEdit: 1,
            plugins: [checkColumnMod, checkColumnElim],
            autoExpandColumn: 'expandir',
            store: stGPost,
            tbar: ['Buscar:', '', tfbuscar, '-', btnBusquedaPost, btnLimpiarPost],
            sm: smGPost,
            columns: [
                {
                    header: "Denominaci&oacute;n",
                    dataIndex: 'denominacion',
                    id: 'expandir'
                }, {
                    header: "Tipo",
                    dataIndex: 'tipo',
                    renderer: PonerTipo
                },
                checkColumnMod,
                checkColumnElim
            ],
            loadMask: {
                msg: "Cargando usuarios subordinados"
            },
            listeners: {
                cellmousedown: function(grid, rowIndex, columnIndex, e) {
                }
            }
        });

        pconfiguracionpost = new Ext.Panel({
            title: 'Configuraci&oacute;n de la post-acci&oacute;n',
            region: 'south',
            layout: 'border',
            height: 300,
            collapsible: true,
            collapsed: true,
            items: GPost
        });

        //panel donde muestro el listado de post-acciones existentes
        expanderPost = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                    '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
                    )
        });
        stGListadoPost = new Ext.data.Store({
            url: '/planificacion/workflow/index.php/gestionarestado/cargarcondiciones',
            //autoLoad:true,
            listeners: {
                beforeload: function(st) {
                    st.baseParams.tipocondicion = 2;
                    if (smEstado.hasSelection()) {
                        st.baseParams.idestado = smEstado.getSelections()[0].data.idestado;
                    }
                },
                load: function(st, records, options) {
                }
            },
            reader: new Ext.data.JsonReader({
                root: "campos",
                id: "idcondicion",
                totalProperty: 'total'
            }, [
                {
                    name: 'idcondicion'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'descripcion'
                }, {
                    name: 'ejecutar'
                }
            ])
        });
        smGListadoPost = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function() {
                    ExpandirPanelConfiguracionPost('exp');
                },
                rowdeselect: function() {
                    ExpandirPanelConfiguracionPost();
                }
            }
        });
        checkcolumnEject = new Ext.grid.CheckColumn({
            header: "Ejecutar",
            dataIndex: 'ejecutar',
            sortable: true,
            width: 70
        });
        GListadoPost = new Ext.grid.EditorGridPanel({
            id: 'idGListadoPost',
            title: 'Listado de post-acciones existentes',
            height: 200,
            region: 'center',
            autoExpandColumn: 'expandir',
            store: stGListadoPost,
            sm: smGListadoPost,
            clicksToEdit: 1,
            plugins: [expanderPost, checkcolumnEject],
            columns: [
                expander, smGListadoPost,
                {
                    header: "Denominaci&oacute;n",
                    sortable: true,
                    dataIndex: 'denominacion',
                    id: 'expandir'
                },
                checkcolumnEject
            ],
            loadMask: {
                msg: "Cargando post-acciones existentes"
            }
        });

        pListadoPost = new Ext.Panel({
            region: 'center',
            layout: 'border',
            height: 200,
            items: GListadoPost
        });

        var btnoculto = 1;
        if (smEstado.hasSelection()) {
            superior = smEstado.getSelections()[0].data.superior;
            icon = 'cerrar.png';
            textboton = 'Cerrar';
            if (!superior) {
                btnoculto = 0;
                icon = 'cancelar.png';
                textboton = 'Cancelar';
            }
        }

        //panel donde muestro las post-acciones de cada estado gestionado
        ventanaConfigPostAcciones = new Ext.Window({
            layout: 'border',
            title: 'Post-acciones del estado',
            modal: true,
            defaultButton: 'btnCerrarVentanaConfigPostAcciones',
            height: 500,
            width: 500,
            items: [pListadoPost, pconfiguracionpost],
            buttons: [
                {
                    text: textboton,
                    id: 'btnCerrarVentanaConfigPostAcciones',
                    prevTab: 'btnAceptarVentanaConfigPostAcciones',
                    netxTab: 'btnAceptarVentanaConfigPostAcciones',
                    iconCls: 'icondistra-cancelar',
                    tooltip: 'Cerra ventana sin guardar datos',
                    handler: function() {
                        ventanaConfigPostAcciones.destroy();
                    }

                }, {
                    text: 'Aceptar',
                    id: 'btnAceptarVentanaConfigPostAcciones',
                    prevTab: 'btnCerrarVentanaConfigPostAcciones',
                    nextTab: 'btnCerrarVentanaConfigPostAcciones',
                    iconCls: 'icondistra-aceptar',
                    disabled: true,
                    hidden: btnoculto,
                    tooltip: 'Guardar datos y cerrar ventana',
                    handler: function() {
                        ConfigurarPostAccionesEstado();
                    }
                }
            ],
            listeners: {
                destroy: function(win) {
                    modInvolPostAccion = false;
                    arraytemprecords = [];
                }
            }
        });
        ventanaConfigPostAcciones.show();
        stGListadoPost.reload();
    }

    function PonerTipo(v) {
        if (v == 1)
            return 'Usuario';
        return 'Estructura';
    }

    function ConfigurarPostAccionesEstado() {
        var params = {};
        params.idestado = smEstado.getSelections()[0].data.idestado;
        var arraysubordinadospost = [];
        var arrayrecordssubordinadospermisos = stGPost.getModifiedRecords();
        if (arrayrecordssubordinadospermisos.length > 0) {
            for (var i = 0; i < arrayrecordssubordinadospermisos.length; i++) {
                var subordinadopost = {};
                var iduseroestruc = (arrayrecordssubordinadospermisos[i].data.tipo == 1) ? arrayrecordssubordinadospermisos[i].data.idusuario : arrayrecordssubordinadospermisos[i].data.idestructura;
                subordinadopost = {
                    tipo: arrayrecordssubordinadospermisos[i].data.tipo,
                    idusuario: iduseroestruc,
                    modificar: arrayrecordssubordinadospermisos[i].data.modificar,
                    eliminar: arrayrecordssubordinadospermisos[i].data.eliminar
                };
                arraysubordinadospost.push(subordinadopost);
            }
        }
        params.arraysubordinadospost = Ext.encode(arraysubordinadospost);
        var procede = 1;
        var arraypost = [];
        var arrayrecordspost = stGListadoPost.getModifiedRecords();
        if (arrayrecordspost.length > 0) {
            params.idpostcondicion = arrayrecordspost[0].data.idcondicion;
            params.ejecutarpostcond = arrayrecordspost[0].data.ejecutar;
        }
        if ((arrayrecordssubordinadospermisos.length > 0 && arrayrecordspost.length == 0) || (arrayrecordssubordinadospermisos.length == 0 && arrayrecordspost.length > 0)) {
            procede = 2;
        }
        if (arrayrecordssubordinadospermisos.length > 0 && arrayrecordspost.length == 0) {
            var rec = stGListadoPost.getRange();
            if (rec[0].data.ejecutar == 1) {
                procede = 1;
                params.ejecutarpostcond = true;
                params.idpostcondicion = rec[0].data.idcondicion;
            }
        }
        if (procede == 1) {
            BarraProgresoEstado.show(' Configurando post-acciones del estado');
            Ext.Ajax.request({
                url: '/planificacion/workflow/index.php/gestionarestado/configurarpostacciones',
                params: params,
                callback: function(options, success, response) {
                    BarraProgresoEstado.hide();
                    responseData = Ext.decode(response.responseText);
                    var mensaje = 'La post-acción ha sido configurada satisfactoriamente.';
                    if (responseData.mensaje != 1) {
                        mensaje = 'La post-acción no ha sido configurada.';
                    }
                    ventanaConfigPostAcciones.destroy();
                    mostrarMensaje(1, mensaje);
                    smEstado.clearSelections();
                    //stEstado.reload();
                }
            });
        }
        if (procede == 2) {
            mostrarMensaje(1, 'Debe de marcar "Ejecutar" en la postcondici&oacute;n si tiene usuarios configurados, o viceversa. De lo contrario desmarque todo. Por favor rectifique.');
        }
    }

    function GenerarEstadoPorDefecto() {

        if (SeHaGeneradoEstados()) {
           var mensaje = 'Ya existen estados generados. ¿Está seguro que desea volver a generarlos?'
                    mostrarMensaje(2, mensaje, function(btnoprimido) {
                if (btnoprimido == 'ok') {
                    GenerandoEstados();
                }
            });

        } else {
            GenerandoEstados();
        }

    }

    function SeHaGeneradoEstados() {
        var estadoGenerado = false;
        if (stEstado.getCount() != 0) {
            for (var i = 0; i < stEstado.getCount(); i++) {
                if (stEstado.getAt(i).data.superior == 0) {
                    estadoGenerado = true;
                    break;
                }
            }
        }
        return estadoGenerado;
    }

    function GenerandoEstados() {

        BarraProgresoEstado.show('Generando estados por defecto');
        Ext.Ajax.request({
            url: 'generarestadospordefecto',
            params: {
                generar: 1
            },
            callback: function(options, success, response) {
                BarraProgresoEstado.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 1) {
                    msg = 'Los estados han sido generados satisfactoriamente.';
                    stEstado.reload();
                }
                else
                    msg = 'Los estados no se han podido generar.';

                mostrarMensaje(1, msg);
            }
        });
    }

}


function buscarCadena(busqueda, lugar) {
    var arregloderecords = (lugar == 1) ? arrayrecords : arrayrecordsrestric;
    var arrayresult = [];
    for (var i = 0; i < arregloderecords.length; i++) {
        var result = (arregloderecords[i].data.denominacion).toLowerCase().search(busqueda.toLowerCase());
        if (result >= 0) {
            if (lugar == 1) {
                var record = {
                    denominacion: arregloderecords[i].data.denominacion,
                    eliminar: arregloderecords[i].data.eliminar,
                    eliminarinicial: arregloderecords[i].data.eliminarinicial,
                    idestructura: arregloderecords[i].data.idestructura,
                    idusuario: arregloderecords[i].data.idusuario,
                    modificar: arregloderecords[i].data.modificar,
                    modificarinicial: arregloderecords[i].data.modificarinicial,
                    tipo: arregloderecords[i].data.tipo
                };
            } else {
                var record = {
                    denominacion: arregloderecords[i].data.denominacion,
                    inicial: arregloderecords[i].data.inicial,
                    fueinicial: arregloderecords[i].data.fueinicial,
                    idestructura: arregloderecords[i].data.idestructura,
                    idusuario: arregloderecords[i].data.idusuario,
                    finall: arregloderecords[i].data.finall,
                    fuefinal: arregloderecords[i].data.fuefinal,
                    tipo: arregloderecords[i].data.tipo
                };
            }
            arrayresult.push(record);
        }
    }
    CargarGridUserEstruct(arrayresult, lugar);
}

function CargarGridUserEstruct(arrayresult, lugar) {
    var store;
    if (lugar == 1)
        store = stGPost;
    else
        store = stGSubordinados;
    store.removeAll();
    if (arrayresult.length > 0) {
        for (var i = 0; i < arrayresult.length; i++) {
            if (lugar == 1) {
                var TopicRecord = Ext.data.Record.create([
                    {
                        name: 'idusuario'
                    }, {
                        name: 'idestructura'
                    }, {
                        name: 'tipo'
                    }, {
                        name: 'denominacion'
                    }, {
                        name: 'modificar'
                    }, {
                        name: 'modificarinicial'
                    }, {
                        name: 'eliminar'
                    }, {
                        name: 'eliminarinicial'
                    }
                ]);
                var myNewRecord = new TopicRecord(
                        {
                            denominacion: arrayresult[i].denominacion,
                            eliminar: arrayresult[i].eliminar,
                            eliminarinicial: arrayresult[i].eliminarinicial,
                            idestructura: arrayresult[i].idestructura,
                            idusuario: arrayresult[i].idusuario,
                            modificar: arrayresult[i].modificar,
                            modificarinicial: arrayresult[i].modificarinicial,
                            tipo: arrayresult[i].tipo
                        });
            } else {
                var TopicRecord = Ext.data.Record.create([
                    {
                        name: 'idusuario'
                    }, {
                        name: 'idestructura'
                    }, {
                        name: 'tipo'
                    }, {
                        name: 'denominacion'
                    }, {
                        name: 'inicial', type: 'bool'
                    }, {
                        name: 'fueinicial', type: 'bool'
                    }, {
                        name: 'finall', type: 'bool'
                    }, {
                        name: 'fuefinal', type: 'bool'
                    }
                ]);
                var myNewRecord = new TopicRecord(
                        {
                            denominacion: arrayresult[i].denominacion,
                            inicial: arrayresult[i].inicial,
                            fueinicial: arrayresult[i].fueinicial,
                            idestructura: arrayresult[i].idestructura,
                            idusuario: arrayresult[i].idusuario,
                            finall: arrayresult[i].finall,
                            fuefinal: arrayresult[i].fuefinal,
                            tipo: arrayresult[i].tipo
                        });
            }
            store.add(myNewRecord);
        }
    } else {
        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
    }
}

CargarInterfaz();