Ext.ns('Pvd.RegimenTrabajo.PatronRotacionTurnos');

Ext.QuickTips.init();

///////////////////////////////////////////Vista de la Interfaz///////////////////////////////////////////////////////////

Pvd.RegimenTrabajo.PatronRotacionTurnos.Vista = {
    /*
     * Inicializar la vista.
     */
    init: function (idioma, modelo) {

        //Botón ayuda
        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaRotTurnos',
            text: idioma.btnAyudaRotacionTurnos,
            //icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',
            disabled: false,
            tooltip: idioma.lbBtnAyudaRotacionTurnos
        });

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            id: 'btnAdd',
            text: idioma.btnAdicionarRotacionTurnos,
            tooltip: idioma.lbbtnAdicionarRotacionTurnos,
            iconCls: 'adicionar'
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            id: 'btnUpd',
            text: idioma.btnModificarRotacionTurnos,
            tooltip: idioma.lbbtnModificarRotacionTurnos,
            iconCls: 'modificar'
        });

        /*this.search = new Ext.app.SearchField({
         id: 'search',
         store: modelo.stListadoPersonas,
         emptyText: 'Criterio a buscar'
         });*/

        this.tfbuscar = new Ext.form.TextField({
            id: 'tfbuscar',
            allowBlank: true,
            emptyText: 'Criterio a buscar...',
            minLength: 3,
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width: 200,
            name: 'tfbuscador'
        });

        //Boton para Buscar.
        this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
            text: idioma.btnBuscarDenom,
            tooltip: idioma.lbbtnBuscar,
            iconCls: 'buscar'
        });

        //Boton para limpiar.
        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar',
            text: idioma.btnLimpiar,
            tooltip: idioma.lbbtnLimpiar,
            iconCls: 'limpiar'
        });

        //Boton para eliminar.
        this.btnEliminar = new Ext.Button({
            id: 'btnDel',
            text: idioma.btnEliminarRotacionTurnos,
            tooltip: idioma.lbbtnEliminarRotacionTurnos,
            iconCls: 'eliminar'
        });


        //Expander
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        //Listado.
        this.listado = new Ext.grid.GridPanel({
            title: idioma.lbListadoRotacionTurnos,
            store: modelo.fuenteDatosListado,
            loadMask: {msg: 'Cargando...'},
            plugins: this.expander,
            height: 527,
            columns: [this.expander,
                {header: 'Denominaci&oacute;n', width: 200, dataIndex: 'denominacion'},
                {header: 'Fecha inicio', width: 150, dataIndex: 'fdesde'},
                {header: 'Fecha fin', width: 150, dataIndex: 'fhasta'},
            ],
            tbar: [this.tfbuscar,
                this.btnBuscar,
                this.btnLimpiar, '', '-'
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.fuenteDatosListado,
                displayInfo: true

            })
        });

        var panellistado = new Ext.Panel({
            //title: idioma.lbListadoRotacionTurnos,
            region: 'west',
            layout: 'fit',
            width: '50%',
            margins: '0 0 0 0',
            items: [this.listado]
        });

        //Listado.
        this.listadoTurnos = new Ext.grid.GridPanel({
            //title: idioma.lbListadoTurnos,
            store: modelo.fuenteDatos,
            loadMask: {msg: 'Cargando...'},
            height: 527,
            columns: [new Ext.grid.RowNumberer(),
                {header: 'Denominaci&oacute;n', width: 200, dataIndex: 'denominacion'},
                {header: 'Cantidad de d&iacute;as', width: 150, dataIndex: 'cantdias'},
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.fuenteDatos,
                displayInfo: true
            })
        });

        var panellistadoturnos = new Ext.Panel({
            title: idioma.lbListadoTurnos,
            region: 'center',
            width: '50%',
            layout: 'fit',
            margins: '0 0 0 0',
            items: [this.listadoTurnos]
        });

        //textfield denominacion
        var cambio = 0;
        var tfdenom = new Ext.form.TextField({
            id: 'tfdenominacion',
            fieldLabel: idioma.lbDenominacion,
            allowBlank: false,
            minLength: 3,
            maxLength: 20,
            regex: /^([a-zA-Z \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc \u00e9 0-9 ]+ ?[a-zA-Z \u00e9 \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc 0-9 ]*)+$/,
            regexText: idioma.lbRegexText,
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            //maskRe : /^([a-zA-Z0-9áéíóúñüÑ\_\/]+ ?[a-zA-Z0-9áéíóúñüÑ\_\/]*)+$/,
            width: '100%',
            blankText: idioma.lbCampoVacio,
            name: 'denominacion',
        });

        //Fechas para el adicionar y modificar
        var fecha = new Date();

        this.dfFInicio = new Ext.form.DateField({
            id: 'dfFInicio',
            fieldLabel: idioma.lbFechaInicio,
            name: 'fdesde',
            hiddenname: 'fdesde',
            value: fecha.format('d/m/Y'),
            anchor: '98%',
            format: 'd/m/Y',
            editable: false,
            readOnly: false,
            invalidText: idioma.invalidTextFecha,
            vtype: 'daterange',
            emptyText: idioma.lbEmptyTextFecha,
            endDateField: 'dfFFin',
            listeners: {change: function (tf, n, o) {
                cambio = 1;
            }}
        });

        this.dfFFin = new Ext.form.DateField({
            id: 'dfFFin',
            fieldLabel: idioma.lbFechaFin,
            name: 'fhasta',
            hiddenname: 'fhasta',
            anchor: '100%',
            format: 'd/m/Y',
            editable: false,
            readOnly: false,
            invalidText: idioma.invalidTextFecha,
            vtype: 'daterange',
            emptyText: idioma.lbEmptyTextFecha,
            startDateField: 'dfFInicio',
            listeners: {change: function (tf, n, o) {
                cambio = 1;
            }}
        });

        // Area de texto Descripción
        var tadescripcion = new Ext.form.TextArea({
            fieldLabel: idioma.lbDescripcion,
            name: 'descripcion',
            id: 'tadescripcion',
            anchor: '100%',
            height: 100,
            hiddenname: 'descripcion',
            maxLength: 245,
            regex: /^([a-zA-Z \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc \u00e9 0-9 .,;:()_]+ ?[a-zA-Z \u00e9 \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc 0-9 .,;:()_]*)+$/,
            regexText: idioma.lbRegexText,
            allowBlank: true
        });

        this.listadoturnoswin = new Ext.grid.GridPanel({
            title: idioma.lbListadoTurnos,
            store: modelo.fuenteDatosListadoTurnos,
            frame: true,
            loadMask: {msg: 'Cargando...'},
            height: 270,
            columns: [
                {header: 'Denominaci&oacute;n', width: 300, dataIndex: 'denominacion'},
            ],
            ddGroup: 'secondGridDDGroup',
            enableDragDrop: true,
            stripeRows: true,
            listeners: {
                "render": {
                    scope: this,
                    fn: function (grid) {
                        var ddrow = new Ext.dd.DropTarget(grid.container, {
                            ddGroup: 'secondGridDDGroup',
                            copy: false,
                            notifyDrop: function (dd, e, data) {
                                var ds = grid.store;
                                //console.info(dd);
                                Ext.each(dd.dragData.selections, function (rec) {
                                    //dd.dragData.grid.getStore().remove(rec);
                                });

                                // ************************************
                            }
                        })
                        //modelo.fuenteDatosListado.load();
                    }
                }
            }
        });

        this.tfcantdias = new Ext.form.TextField({
            id: 'tfcantdias',
            allowBlank: false,
            enableKeyEvents: true,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            blankText: idioma.lbCampoVacio,
            name: 'cantdias',
        });
        //this.smEditor=new Ext.grid.CellSelectionModel();
        this.listadorotacion = new Ext.grid.EditorGridPanel({
            title: idioma.lbListadoRotacionTurnos,
            store: modelo.fuenteDatos,
            frame: true,
            // sm:this.smEditor,
            //clicksToEdit:1,
            loadMask: {msg: 'Cargando...'},
            height: 270,
            draggable: true,
            columns: [
                {header: 'Turnos de trabajo', width: 150, dataIndex: 'denominacion'},
                {header: 'Cantidad de d&iacute;as', width: 110, dataIndex: 'cantdias', editor: this.tfcantdias},

            ],
            ddGroup: 'secondGridDDGroup',
            enableDragDrop: true,
            stripeRows: true,
            listeners: {
                "render": {
                    scope: this,

                    fn: function (grid) {
                       // grid.getStore().removeAll();
                        var ddrow = new Ext.dd.DropTarget(grid.container, {
                            ddGroup: 'secondGridDDGroup',
                            copy: false,
                            notifyDrop: function (dd, e, data) {

                                var ds = grid.store;
                                //console.info(ds);
                                Ext.each(dd.dragData.selections, function (rec) {

                                    var p = new modelo.recQrElement({
                                        idturnotrabajo: rec.data.idturnotrabajo,
                                        denominacion: rec.data.denominacion,
                                        cantdias: ''
                                    });
                                    //2- Busca que el nodo no exista en el store (idcampo)
                                    if (grid.getStore().find('idturnotrabajo', rec.data.idturnotrabajo) == -1) {
                                        //2-1 Si no existe creo record y lo adiciono al store
                                        //self.addQrElemnts(node);
                                        grid.getStore().add(p);
                                    }

                                });
                                // ***************************************
                                /* var sm = grid.getSelectionModel();
                                 //console.info(sm);
                                 var rows = sm.getSelections();
                                 //console.info(rows);
                                 if (dd.getDragData(e)) {
                                 var cindex = dd.getDragData(e).rowIndex;
                                 if (typeof(cindex) != "undefined") {
                                 for (i = 0; i < rows.length; i++) {
                                 ds.remove(ds.getById(rows[i].id));
                                 }
                                 ds.insert(cindex, data.selections);
                                 sm.clearSelections();
                                 }
                                 }*/

                                /* var sm = grid.getSelectionModel().getSelectedCell();
                                 console.info(sm);*/

                                // ************************************
                            }
                        })
                        // modelo.fuenteDatosListado.load();
                    }
                },
                cellclick: function (grid, rowIndex, columnIndex, e) {
                    grid.recDelete = grid.getStore().getAt(rowIndex);
                    //grid.getStore().remove(p)
                }

            }
        });

        //Formulario de gestion.
        this.formularioGestion = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [tfdenom]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.dfFInicio]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.dfFFin]
                        },
                        {
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [tadescripcion]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.listadoturnoswin]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.listadorotacion]
                        }
                    ]
                },
                {xtype: 'hidden',
                    name: 'idrotacion'
                }
            ]
        });

        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.lbBtnCanc,
        });

        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.lbBtnAcep,
        });

        this.btnAplicar = new Ext.Button({
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.lbBtnAplic,
        });

        //Ventana de gestion.
        this.ventanaGestion = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'fit',
            title: idioma.lbTitVentAddRotacionTurnos,
            width: 575,
            height: 590,
            items: [this.formularioGestion],
            buttons: [
                this.btnCancelar,
                this.btnAplicar,
                this.btnAceptar
            ]
        });

        //Vista general
        new Ext.Viewport({
            layout: 'fit',
            items: [
                {
                    layout: 'border',
                    tbar: [
                        this.btnAdicionar,
                        this.btnModificar,
                        this.btnEliminar, '', '-',
                        '->', '', '-', this.btnAyuda],
                    items: [panellistado, panellistadoturnos]
                }
            ]
        });

    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('patronrotacionturnos', function (perfil, idioma) {
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.RegimenTrabajo.PatronRotacionTurnos.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.RegimenTrabajo.PatronRotacionTurnos.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.RegimenTrabajo.PatronRotacionTurnos.Controlador.init(idioma, vista, modelo);
});