/**
 /**
 * Componente con los grid's de conceptos de PD de los elementos salariales y las escalas de dichos conceptos.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase Interfaz.
 * @uses Pvd.Nomina.gpconceptosescalacomp
 * @copyright UCID
 * @version 1.0
 */
Ext.ns('Pvd.Nomina.gpconceptosescalacomp');
/*Componente panel*/
Pvd.Nomina.gpconceptosescalacomp = Ext.extend(Ext.Panel, {
    region           : 'center',
    layout           : 'border',
    border           : false,
    tipo             : (this.tipo ? this.tipo : 1), /*1 - Cargo, 2 - Persona, 3 - Situacion laboral*/
    posicion         : (this.posicion ? this.posicion : 1),
    filasSelecionadas: new Array(),
    initComponent    : function () {
        var self = this;
        this.modoviewform = (this.modoviewform ? this.modoviewform : 2);
        var tipo = this.tipo;
        var id = this.id;
        var array = this.array;
        this.cargosocupados = -1;

        var accion = 'Add';
        var accionescala = 'Add';
        var cambio = 0;
        var idconceptoPd = 0;
        var idconceptoTree = 0;
        var boton = 0;

        this.conceptoseleccionado = null;
        this.escalaxconceptoseleccionda = null;

//        var miArray = new Array();
        this.smConceptoCargo = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners   : {
                rowselect  : function (sm, index, rec) {
                    this.conceptoseleccionado = rec;
                    if (rec.data.idformacalculo == 3) {
                        CargarEscalasXConcepto(rec.data.idconfconceptospdelementossalariales, false);
                    } else {
                        LimpiarGridEscalasXConceptos();
                    }
                    var id = rec.id;
                    var indiceFila = self.filasSelecionadas.indexOf(id);
                    if (indiceFila == -1) {
                        self.filasSelecionadas.push(id);
                    }
//                    console.info(self.filasSelecionadas);
                }.createDelegate(this),
                rowdeselect: function (sm, index, rec) {

                    var id = rec.id;
                    var indiceFila = self.filasSelecionadas.indexOf(id);
                    self.filasSelecionadas.remove(id);
                    if (self.filasSelecionadas == 0) {
                        self.btnEliminarConcepto.disable();
                    }
//                    console.info(self.filasSelecionadas);
                }.createDelegate(this)
            }
        });
        this.smConcepto = (this.tipo == 1) ? this.smConceptoCargo : new Ext.grid.RowSelectionModel({
            singleSelect: (this.tipo == 1) ? false : true,
            listeners   : {
                rowselect: function (sm, index, rec) {
//                    console.info(rec);

                    this.conceptoseleccionado = rec;
                    if (rec.data.idformacalculo == 3) {
                        CargarEscalasXConcepto(rec.data.idconfconceptospdelementossalariales, false);
                    } else {
                        LimpiarGridEscalasXConceptos();
                    }
                }.createDelegate(this)

            }
        });

        this.smEscalaXConcepto = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.storeConceptoPDGrid = new Ext.data.GroupingStore({
            url       : '/pvd/nomina/index.php/gpconceptosescalacomp/obtenerListadoConceptosPagoDescuento',
            groupField: 'denomtipoconcepto',
            baseParams: {tipo: this.tipo, idelemento: -1},
            sortInfo  : {field: 'idtipoconcepto', direction: "DESC"},
            reader    : new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root         : "datos",
                id           : "idconfconceptospdelementossalariales"
            }, [
                {name: 'idconfconceptospdelementossalariales'}
                ,
                {name: 'idconceptopercepciondescuento'}
                ,
                {name: 'denomconceptopercepciondescuento'}
                ,
                {name: 'idtipoconcepto'}
                ,
                {name: 'denomtipoconcepto'}
                ,
                {name: 'idtarifa'}
                ,
                {name: 'idformacalculo'}
                ,
                {name: 'denomtarifa'}
                ,
                {name: 'importetarifa'}
                ,
                {name: 'fechainicio'}
                ,
                {name: 'fechafin'}
                ,
                {name: 'tipo'}
                ,
                {name: 'idelementosalarialcargo'}
                ,
                {name: 'idelementosalarialpersona'}
                ,
                {name: 'idcargosocupados'}
            ])
        });

        this.storeEscalaXConceptoGrid = new Ext.data.GroupingStore({
            url   : '/pvd/nomina/index.php/gpconceptosescalacomp/obtenerListadoEscalas',
            params: {idconfconceptospdelementossalariales: -1, idcargosocupados: -1},
            reader: new Ext.data.JsonReader({
                root         : "datos",
                totalProperty: "cantidad",
                id           : "idconfescalaelementosalarial"
            }, [
                {name: 'idconfescalaelementosalarial'}
                ,
                {name: 'idescalatarifa'}
                ,
                {name: 'escala'}
                ,
                {name: 'idconfconceptospdelementossalariales'}
                ,
                {name: 'importe'}
                ,
                {name: 'fechainicio'}
                ,
                {name: 'fechafin'}
            ])
        });

        this.storeTarifa = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/gpconceptosescalacomp/cargarTarifas',
            reader: new Ext.data.JsonReader({
                root         : "datos",
                totalProperty: "cantidad",
                id           : "idtarifa"
            }, [
                {name: 'idtarifa'},
                {name: 'denomtarifa'}
            ])
        });

        this.storeConcepto = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/gpconceptosescalacomp/cargarConceptospagodescuento',
            reader: new Ext.data.JsonReader({
                root         : "datos",
                totalProperty: "cantidad",
                id           : "idconceptopercepciondescuento"
            }, [
                {name: 'idconceptopercepciondescuento'},
                {name: 'denominacion'}
            ])
        });

        this.storeTarifaEscala = new Ext.data.Store({
            url   : '/pvd/nomina/index.php/gpconceptosescalacomp/c',
            reader: new Ext.data.JsonReader({
                root         : "datos",
                totalProperty: "cantidad",
                id           : "idtarifa"
            }, [
                {name: 'idtarifa'},
                {name: 'denomtarifa'}
            ])
        });

        /*this.storecategoria = new Ext.data.Store({
         url: '/pvd/nomina/index.php/configelementosalarialcargo/cargarcategoria',
         reader: new Ext.data.JsonReader({
         root: "datos",
         totalProperty: "cantidad",
         id: "idcategoria"
         }, [
         {name: 'idcategoria'},
         {name: 'denominacion'}
         ])
         });*/

        self.storeConcepto.load();

        //Botones de Add, Mod, Elim, Ayud de conceptos.
        this.btnAdicionarConcepto = new Ext.Button({
            text    : 'Ad<u>i</u>cionar',
            id      : 'idbtnAdicionarConcepto',
            tooltip : 'Adicionar concepto de percepci&oacute;n y descuento (<b>Alt+I</b>)',
            // icon: perfil.dirImg+'adicionar.png',
            disabled: true,
            hidden  : (this.tipo == 1 ? false : true),
            iconCls : 'adicionar',
            prevTab : 'idbtnEliminarConcepto',
            nextTab : 'idbtnModificarConcepto',
            handler : function () {
                mostrarVentanaAdicionarConcepto();
            }
        });

        this.btnModificarConcepto = new Ext.Button({
            id      : 'idbtnModificarConcepto',
            text    : '<u>M</u>odificar',
            tooltip : 'Modificar concepto de percepci&oacute;n y descuento (<b>Alt+M</b>)',
            //icon: perfil.dirImg+'modificar.png',
            disabled: true,
            hidden  : (this.tipo == 1 ? false : true),
            iconCls : 'modificar',
            prevTab : 'idbtnAdicionarConcepto',
            nextTab : 'idbtnEliminarConcepto',
            handler : function () {
                mostrarVentanaModificarConcepto();
            }
        });

        this.btnEliminarConcepto = new Ext.Button({
            id      : 'idbtnEliminarConcepto',
            text    : 'Eliminar',
            tooltip : 'Eliminar concepto de percepci&oacute;n y descuento (<b>DEL</b>)',
            // icon: perfil.dirImg+'eliminar.png',
            disabled: true,
            hidden  : (this.tipo == 1 ? false : true),
            iconCls : 'eliminar',
            prevTab : 'idbtnModificarConcepto',
            nextTab : 'idbtnAdicionarConcepto',
        });
        //Button y Texfiled de busqueda
        this.btnBuscar = new Ext.Button({
            id      : 'btnBuscar',
            text    : '<u>B</u>uscar',
            disabled: true,
            tooltip : 'Buscar concepto de percepci&oacute;n y descuento',
            // icon:perfil.dirImg+'buscar.png',
            iconCls : 'buscar',
        });


        this.tfBuscar = new Ext.form.TextField({
            id       : 'tfBuscarPlantillaN',
            anchor   : '99%',
            emptyText: 'Criterio a buscar...'
        });

        //Eventos del botón buscar plantilla nominal.
        this.btnBuscar.setHandler(function () {
            self.storeConceptoPDGrid.load({params: {textoabuscar: self.tfBuscar.getValue()}});
        });


        //Botones de Add, Mod, Elim, Ayud de escalas.
        this.btnAdicionarEscala = new Ext.Button({
            text    : 'Ad<u>i</u>cionar',
            id      : 'idbtnAdicionarEscala',
            tooltip : 'Adicionar escala (<b>Alt+I</b>)',
            // icon: perfil.dirImg+'adicionar.png',
            disabled: true,
            iconCls : 'adicionar',
            prevTab : 'idbtnEliminarEscala',
            nextTab : 'idbtnModificarEscala',
            handler : function () {
                mostrarVentanaAdicionarEscala();
            }
        });


        this.btnModificarEscala = new Ext.Button({
            id      : 'idbtnModificarEscala',
            text    : '<u>M</u>odificar',
            tooltip : 'Modificar escala (<b>Alt+M</b>)',
            // icon: perfil.dirImg+'modificar.png',
            disabled: true,
            iconCls : 'modificar',
            prevTab : 'idbtnAdicionarEscala',
            nextTab : 'idbtnEliminarEscala',
            handler : function () {
                mostrarVentanaModificarEscala();
            }
        });

        this.btnEliminarEscala = new Ext.Button({
            id      : 'idbtnEliminarEscala',
            text    : 'Eliminar',
            tooltip : 'Eliminar escala (<b>DEL</b>)',
            //icon: perfil.dirImg+'eliminar.png',
            disabled: true,
            iconCls : 'eliminar',
            prevTab : 'idbtnModificarEscala',
            nextTab : 'idbtnAdicionarEscala',
            /* handler : function(){
             //    eliminarEscala();
             }*/
        });


        this.gpEscalaXConcepto = new Ext.grid.GridPanel({
            id        : 'idgpEscalaXConcepto',
            title     : 'Listado de Escalas',
            region    : 'center',
            disabled  : (this.modoviewform == 2) ? true : false,
            columns   : [
                {header: 'idconfescalaelementosalarial', hidden: true, hideable: false, dataIndex: 'idconfescalaelementosalarial'}
                ,
                {header: 'idescalatarifa', hidden: true, hideable: false, dataIndex: 'idescalatarifa'}
                ,
                {header: 'idconfconceptospdelementossalariales', hidden: true, hideable: false, dataIndex: 'idconfconceptospdelementossalariales'}
                ,
                {header: 'Escala', fixed: true, width: 150, sortable: true, dataIndex: 'escala'}
                ,
                {header: 'Importe', fixed: true, width: 200, sortable: true, dataIndex: 'importe'}
                ,
                {header: 'Fecha inicio', fixed: true, width: 80, sortable: true, dataIndex: 'fechainicio'}
                ,
                {header: 'Fecha fin', fixed: true, width: 80, sortable: true, dataIndex: 'fechafin'}
            ],
            stripeRows: true,
            autoScroll: true,
            width     : '100%',
            heigth    : '100%',
            border    : false,
            viewConfig: {forceFit: true},
            store     : self.storeEscalaXConceptoGrid,
            sm        : self.smEscalaXConcepto,
            loadMask  : {msg: 'Cargando'},
            bbar      : new Ext.PagingToolbar({
                pageSize   : 1000,
                store      : self.storeEscalaXConceptoGrid,
                displayInfo: true,
                displayMsg : 'Mostrando  {0} - {1} de {2}',
                emptyMsg   : "0 Resultado a mostrar"
            })
        });

        this.smEscalaXConcepto.on('rowselect', function () {
            self.btnModificarEscala.enable();
            self.btnEliminarEscala.enable();
        });

        this.cmgpConceptoCargo = new Ext.grid.ColumnModel([this.smConcepto,
            {header: 'idconfconceptospdelementossalariales', hidden: true, hideable: false, dataIndex: 'idconfconceptospdelementossalariales'}
            ,
            {header: 'idconceptopercepciondescuento', hidden: true, hideable: false, dataIndex: 'idconceptopercepciondescuento'}
            ,
            {header: 'Conceptos', fixed: true, width: 300, sortable: true, dataIndex: 'denomconceptopercepciondescuento'}
            ,
            {header: 'idtipoconcepto', hidden: true, hideable: false, dataIndex: 'idtipoconcepto'}
            ,
            {header: 'Tipo de concepto', hidden: true, hideable: false, dataIndex: 'denomtipoconcepto'}
            ,
            {header: 'idtarifa', hidden: true, hideable: false, dataIndex: 'idtarifa'}
            ,
            {header: 'idformacalculo', hidden: true, hideable: false, dataIndex: 'idformacalculo'}
            ,
            {header: 'Tarifa', fixed: true, width: 200, sortable: true, dataIndex: 'denomtarifa'}
            ,
            {header: 'Importe', width: 50, sortable: true, dataIndex: 'importetarifa'}
            ,
            {header: 'fechainicio', hidden: true, hideable: false, dataIndex: 'fechainicio'}
            ,
            {header: 'fechafin', hidden: true, hideable: false, dataIndex: 'fechafin'}
            ,
            {header: 'tipo', hidden: true, hideable: false, dataIndex: 'tipo'}
            ,
            {header: 'idelementosalarialcargo', hidden: true, hideable: false, dataIndex: 'idelementosalarialcargo'}
            ,
            {header: 'idelementosalarialpersona', hidden: true, hideable: false, dataIndex: 'idelementosalarialpersona'}
            ,
            {header: 'idcargosocupados', hidden: true, hideable: false, dataIndex: 'idcargosocupados'}
        ]);
        this.cmgpConceptoPersona = new Ext.grid.ColumnModel([
            {header: 'idconfconceptospdelementossalariales', hidden: true, hideable: false, dataIndex: 'idconfconceptospdelementossalariales'}
            ,
            {header: 'idconceptopercepciondescuento', hidden: true, hideable: false, dataIndex: 'idconceptopercepciondescuento'}
            ,
            {header: 'Conceptos', fixed: true, width: 300, sortable: true, dataIndex: 'denomconceptopercepciondescuento'}
            ,
            {header: 'idtipoconcepto', hidden: true, hideable: false, dataIndex: 'idtipoconcepto'}
            ,
            {header: 'Tipo de concepto', hidden: true, hideable: false, dataIndex: 'denomtipoconcepto'}
            ,
            {header: 'idtarifa', hidden: true, hideable: false, dataIndex: 'idtarifa'}
            ,
            {header: 'idformacalculo', hidden: true, hideable: false, dataIndex: 'idformacalculo'}
            ,
            {header: 'Tarifa', fixed: true, width: 200, sortable: true, dataIndex: 'denomtarifa'}
            ,
            {header: 'Importe', width: 50, sortable: true, dataIndex: 'importetarifa'}
            ,
            {header: 'fechainicio', hidden: true, hideable: false, dataIndex: 'fechainicio'}
            ,
            {header: 'fechafin', hidden: true, hideable: false, dataIndex: 'fechafin'}
            ,
            {header: 'tipo', hidden: true, hideable: false, dataIndex: 'tipo'}
            ,
            {header: 'idelementosalarialcargo', hidden: true, hideable: false, dataIndex: 'idelementosalarialcargo'}
            ,
            {header: 'idelementosalarialpersona', hidden: true, hideable: false, dataIndex: 'idelementosalarialpersona'}
            ,
            {header: 'idcargosocupados', hidden: true, hideable: false, dataIndex: 'idcargosocupados'}
        ]);

        this.gpConcepto = new Ext.grid.GridPanel({
            id        : 'idgpConcepto',
            title     : 'Listado de conceptos de percepciones y descuentos',
            region    : 'center',
            border    : false,
            disabled  : (this.modoviewform == 2) ? true : false,
            cm        : (this.tipo == 1) ? this.cmgpConceptoCargo : this.cmgpConceptoPersona,
            stripeRows: true,
            autoScroll: true,
            width     : '100%',
            heigth    : '100%',
            viewConfig: {forceFit: true},
            view      : new Ext.grid.GroupingView({
                forceFit    : true,
                groupTextTpl: '{text}'
            }),
            store     : self.storeConceptoPDGrid,
            sm        : self.smConcepto,

            loadMask: {msg: 'Cargando'},
            bbar    : new Ext.PagingToolbar({
                pageSize   : 1000,
                store      : self.storeConceptoPDGrid,
                displayInfo: true
            })
        });


        this.panelCenter = new Ext.Panel({
            id    : 'idpanelCenter',
            layout: 'border',
            region: 'center',
            height: 100,
            width : '50%',
            split : true,
            border: true,
            tbar  : [self.btnAdicionarConcepto, self.btnModificarConcepto, self.btnEliminarConcepto, '-', this.tfBuscar, this.btnBuscar],
            keys  : [
                {
                    //Adicionar
                    key      : 'i',
                    alt      : true,
                    stopEvent: true,
                    fn       : function () {
                        self.btnAdicionarConcepto.handler();
                    }
                },
                {
                    //Modificar
                    key      : 'm',
                    alt      : true,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnModificarConcepto.disabled) {
                            self.btnModificarConcepto.handler();
                        }

                    }
                },
                {
                    //Eliminar
                    key      : Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnEliminarConcepto.disabled) {
                            self.btnEliminarConcepto.handler();
                        }
                    }
                },
                {
                    key      : 'b',
                    alt      : true,
                    stopEvent: true,
                    fn       : function () {
                        if (!self.btnBuscar.disabled) {
                            self.btnBuscar.handler();
                        }

                    }
                }

            ],
            items : [self.gpConcepto]
        });


        this.panelSouthEscala = new Ext.Panel({
            id    : 'panelSouthEscala',
            region: (this.posicion == 1 ? 'east' : 'south'),
            height: 200,
            width : (this.posicion == 1 ? '50%' : 200),
            layout: 'border',
            border: true,
            split : true,
            tbar  : [self.btnAdicionarEscala, self.btnModificarEscala, self.btnEliminarEscala],
            items : [self.gpEscalaXConcepto],
        });

        this.cbConcepto = new Ext.form.ComboBox({id: 'idcbConcepto',
            fieldLabel                             : 'Concepto percepción descuento',
            tabIndex                               : 1, valueField: 'idconceptopercepciondescuento',
            displayField                           : 'denominacion', hiddenName: 'idconceptopercepciondescuento',
            allowBlank                             : false, mode: 'local',
            store                                  : this.storeConcepto,
            emptyText                              : 'Seleccione...',
            blankText                              : 'Este campo es obligatorio', readOnly: true,
            emptyText                              : 'Seleccione...',
            prevTab                                : 'idbtnEliminarConcepto',
            nextTab                                : 'idcbTarifa',
            triggerAction                          : 'all', anchor: '90%'
        });

        //Evento del combo concepto PD
        this.cbConcepto.on('select', function (combo, n, o) {
            ActivarComboTarifa();
        });

        this.cbTarifa = new Ext.form.ComboBox({id: 'idcbTarifa',
            fieldLabel                           : 'Tarifa',
            tabIndex                             : 1, valueField: 'idtarifa',
            displayField                         : 'denomtarifa', hiddenName: 'idtarifa',
            allowBlank                           : false, mode: 'local',
            store                                : this.storeTarifa,
            blankText                            : 'Este campo es obligatorio', readOnly: true,
            emptyText                            : 'Seleccione...',
            // disabled: true,
            prevTab                              : 'idcbConcepto',
            nextTab                              : 'checkTodosCargos',
            triggerAction                        : 'all', anchor: '90%'
        });

        this.checkTodosCargos = new Ext.form.Checkbox({
            id        : 'checkTodosCargos',
            fieldLabel: 'Todos los cargos',
            disabled  : false,
            tabIndex  : 1,
            name      : 'todoscargos',
            prevTab   : 'idcbTarifa',
            nextTab   : 'iddfFInicioConcepto',
            anchor    : '90%'
        });

        this.dfFInicioConcepto = new Ext.form.DateField({id: 'iddfFInicioConcepto',
            fieldLabel                                     : 'Fecha inicio',
            tabIndex                                       : 3, name: 'fechainicio', allowBlank: false,
            format                                         : 'd/m/Y', editable: true, readOnly: false,
            value                                          : new Date().format('d/m/Y'), maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
            minText                                        : 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
            blankText                                      : 'Este campo es obligatorio.',
            invalidText                                    : 'Formato: dd/mm/aaaa.', vtype: 'daterange',
            prevTab                                        : 'checkTodosCargos',
            nextTab                                        : 'iddfFFinConcepto',
            anchor                                         : '90%', endDateField: 'iddfFFinConcepto'
        });

        this.dfFFinConcepto = new Ext.form.DateField({id: 'iddfFFinConcepto',
            fieldLabel                                  : 'Fecha fin',
            tabIndex                                    : 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format                                      : 'd/m/Y', editable: true, readOnly: false,
            maxText                                     : 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
            minText                                     : 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
            invalidText                                 : 'Formato: dd/mm/aaaa.',
            prevTab                                     : 'iddfFInicioConcepto',
            nextTab                                     : 'idbtnCancelarConcepto',
            vtype                                       : 'daterange', anchor: '90%', startDateField: 'iddfFInicioConcepto'
        });

        //Formulario de tipos de nómina.
        this.formularioConcepto = new Ext.FormPanel({
            id        : 'idformularioConcepto',
            labelAlign: 'top',
            frame     : true,
            width     : 600,
            autoHeight: true,
            bodyStyle : {
                padding: '10px 10px 10px 10px',
            },
            items     : [(this.modoviewform == 1 ? {layout: 'column',
                items                                     : [
                    {columnWidth: .54, layout: 'form', items: [this.cbConcepto]},
                    {columnWidth: .26, layout: 'form', items: [this.cbTarifa]},
                    {columnWidth: .20, layout: 'form', items: [this.checkTodosCargos]}
                ]
            } : {layout: 'column',
                items  : [
                    {columnWidth: .54, layout: 'form', items: [this.cbConcepto]},
                    {columnWidth: .46, layout: 'form', items: [this.cbTarifa]}

                ]
            }), {layout: 'column',
                items  : [
                    {columnWidth: .54, layout: 'form', items: [this.dfFInicioConcepto]},
                    {columnWidth: .46, layout: 'form', items: [this.dfFFinConcepto]}
                ]
            }],
        });


        this.btnCancelarConcepto = new Ext.Button({
            id     : 'idbtnCancelarConcepto',
            iconCls: 'cancelar',
            // icon: perfil.dirImg + 'cancelar.png',
            text   : 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            prevTab: 'iddfFFinConcepto',
            nextTab: 'idbtnAplicarConcepto',
        });

        this.btnAplicarConcepto = new Ext.Button({
            id     : 'idbtnAplicarConcepto',
            iconCls: 'aplicar',
            // icon: perfil.dirImg + 'aplicar.png',
            text   : 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos (<b>Ctrl+Alt+P</b>)',
            prevTab: 'btnCancelarConcepto',
            nextTab: 'idbtnAceptarTipoN',

        });

        this.btnAceptarConcepto = new Ext.Button({
            id     : 'idbtnAceptarConcepto',
            iconCls: 'aceptar',
            //icon: perfil.dirImg + 'aceptar.png',
            text   : 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>Enter</b>)',
            prevTab: 'idbtnAplicarConcepto',
            nextTab: 'idgpConcepto',

        });

        this.ventanaConcepto = new Ext.Window({
            modal          : true,
            draggable      : true,
            closeAction    : 'hide',
            autoHeight     : true,
            autoValidate   : true,
            validateDefault: true,
            constrain      : true,

            closable : true,
            resizable: false,
            layout   : 'fit',
            items    : [this.formularioConcepto],
            buttons  : [this.btnCancelarConcepto, this.btnAplicarConcepto, this.btnAceptarConcepto],
            keys     : [
                {
                    //Aceptar
                    key      : Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn       : function () {
                        self.btnAceptarConcepto.handler();
                    }
                },
                {
                    //Cancelar
                    key      : 'x',
                    stopEvent: true,
                    alt      : true,
                    fn       : function () {
                        self.btnCancelarConcepto.handler();
                    }
                },
                {
                    //Aplicar
                    key      : 'p',
                    stopEvent: true,
                    alt      : true,
                    ctrl     : true,
                    fn       : function () {
                        self.btnAplicarConcepto.handler();
                    }
                },
            ]
        });

        /*
         * Check para eliminar conceptos
         */
        this.checkTodosCargosEliminar = new Ext.form.Checkbox({
            id        : 'checkTodosCargosEliminar',
            fieldLabel: 'Todos los cargos',
            tabIndex  : 1,
            name      : 'todoseliminar',
            anchor    : '90%'
        });

        /*
         * Items del formulario de eliminar conceptos
         */
        this.formularioEliminarConcepto = new Ext.FormPanel({
            id        : 'formularioEliminarConcepto',
            labelAlign: 'left',
            frame     : true,
            width     : 100,
            autoHeight: true,
            bodyStyle : {
                padding: '10px 10px 10px 10px',
            },
            items     : [this.checkTodosCargosEliminar]
        });

        /*
         * Botones de la ventana de eliminar conceptos
         */
        this.btnCancelarEliminarConcepto = new Ext.Button({
            id     : 'btnCancelarEliminarConcepto',
            iconCls: 'cancelar',
            //icon: perfil.dirImg + 'cancelar.png',
            text   : 'Cancelar',
            tooltip: 'Cancelar',
            prevTab: 'dfFFinConceptoSituacion',
            nextTab: 'idbtnAplicarConceptoSituacion',
        });

        this.btnAceptarEliminarConcepto = new Ext.Button({
            id     : 'btnAceptarEliminarConcepto',
            iconCls: 'aceptar',
            //icon: perfil.dirImg + 'aceptar.png',
            text   : 'Aceptar',
            tooltip: 'Aceptar',
            prevTab: 'idbtnAplicarConceptoSituacion',
            nextTab: 'idgpConceptoSituacion',

        });

        /*
         * Ventana de eliminar conceptos
         */
        this.ventanaEliminarConcepto = new Ext.Window({
            modal      : true,
            title      : 'Eliminar concepto de percepci&oacute;n y descuento',
            closeAction: 'hide',
            autoHeight : true,
            constrain  : true,
            closable   : true,
//            autoValidate: true,
//            validateDefault: true,
            resizable  : false,
            layout     : 'fit',
            items      : [this.formularioEliminarConcepto],
            buttons    : [this.btnCancelarEliminarConcepto, this.btnAceptarEliminarConcepto],
            keys       : [
                {
                    //Aceptar
                    key      : Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn       : function () {
                        self.btnAceptarEliminarConcepto.handler();
                    }
                },
                {
                    //Cancelar
                    key      : 'x',
                    stopEvent: true,
                    alt      : true,
                    fn       : function () {
                        self.btnCancelarEliminarConcepto.handler();
                    }
                }
            ]
        });

        this.cbCategoriascala = new Ext.components.TreeComboBox({
            anchor    : "99%",
            allowBlank: false,
            // blankText: 'Este campo es obligatorio',
            fieldLabel: 'Categoría persona',
            id        : 'idcbCategoriascala',
            // prevTab: 'idbtnEliminarEscala',
            //nextTab: 'idnfImporte',
            treeConfig: {
                rootVisible: false,
                loader     : new Ext.tree.TreeLoader({
                    dataUrl        : '/pvd/persona/projects/basetecnologica/index.php/basetecnologica/getCategorias',
                    preloadChildren: false,
                    listeners      : {
                        beforeload: function (treeLoader, node, response) {
                            this.cbCategoriascala.reset();
                            // this.cbEscala.disable();
                            // treeLoader.baseParams.idtipoconceptopd = this.conceptoseleccionado.data.idtipoconceptopd;
                            //  treeLoader.baseParams.idconfconceptopercepciondescuento = this.conceptoseleccionado.data.idconfconceptospdelementossalariales;
                            // treeLoader.baseParams.idtarifa = this.conceptoseleccionado.data.idtarifa;
                            //  treeLoader.baseParams.tipo = this.tipo;
                        }.createDelegate(this),
                        load      : function (treeLoader, node, response) {
                            //  this.cbEscala.enable();

                        }.createDelegate(this)

                    }
                }),
                border     : false,
                autoScroll : true,
                listeners  : {
                    click: function (node, e) {
                        // console.info(node);
                        self.cambio = 1;
                    }
                }
            }
        });

        this.cbEscala = new Ext.components.TreeComboBox({
            anchor    : "90%",
            allowBlank: false,
            blankText : 'Este campo es obligatorio',
            fieldLabel: 'Escala',
            id        : 'idcbEscala',
            prevTab   : 'idbtnEliminarEscala',
            nextTab   : 'idnfImporte',
            treeConfig: {
                rootVisible: false,
                loader     : new Ext.tree.TreeLoader({
                    dataUrl        : '/pvd/nomina/index.php/gpconceptosescalacomp/obtenerListadoEscalaXConcepto',
                    preloadChildren: false,
                    listeners      : {
                        beforeload: function (treeLoader, node, response) {
                            this.cbEscala.reset();
                            this.cbEscala.disable();
                            treeLoader.baseParams.idconceptopercepciondescuento = this.conceptoseleccionado.data.idconceptopercepciondescuento;
                            treeLoader.baseParams.idconfconceptopercepciondescuento = this.conceptoseleccionado.data.idconfconceptospdelementossalariales;
                            treeLoader.baseParams.idtarifa = this.conceptoseleccionado.data.idtarifa;
                            treeLoader.baseParams.tipo = this.tipo;
                        }.createDelegate(this),
                        load      : function (treeLoader, node, response) {
                            this.cbEscala.enable();

                        }.createDelegate(this)

                    }
                }),
                border     : false,
                autoScroll : true,
                listeners  : {
                    click: function (node, e) {
                        self.cambio = 1;
                    }
                }
            }
        });


        this.nfImporte = new Ext.form.TextField({id: 'idnfImporte', fieldLabel: 'Importe',
            tabIndex                               : 2, name: 'importe', anchor: '90%', prevTab: 'idbtnAceptarTipoN', readOnly: true,
            allowBlank                             : false, blankText: 'Este campo es obligatorio',
            prevTab                                : 'idcbEscala',
            nextTab                                : 'dfFInicioEscala',
            listeners                              : {change: function (tf, n, o) {
                self.cambio = 1;
            }}
        });

        self.cbEscala.tree.on('click', function (t, n) {
            if (t.attributes.leaf == true) {
                CalcularImporte(t);
            }
        });

        this.dfFInicioEscala = new Ext.form.DateField({id: 'dfFInicioEscala', fieldLabel: 'Fecha inicio',
            tabIndex                                     : 3, name: 'fechainicio', allowBlank: false, blankText: 'Este campo es obligatorio',
            format                                       : 'd/m/Y', editable: true, readOnly: false,
            value                                        : new Date().format('d/m/Y'), maxText: 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
            minText                                      : 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
            invalidText                                  : 'Formato: dd/mm/aaaa.', vtype: 'daterange',
            prevTab                                      : 'idnfImporte',
            nextTab                                      : 'dfFFinEscala',
            listeners                                    : {change: function (tf, n, o) {
                self.cambio = 1;
            }},
            anchor                                       : '90%', endDateField: 'dfFFinEscala'
        });

        this.dfFFinEscala = new Ext.form.DateField({id: 'dfFFinEscala', fieldLabel: 'Fecha fin',
            tabIndex                                  : 4, name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format                                    : 'd/m/Y', editable: true, readOnly: false,
            maxText                                   : 'La fecha de inicio tiene que ser anterior o igual a la fecha fin.',
            minText                                   : 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
            invalidText                               : 'Formato: dd/mm/aaaa.',
            prevTab                                   : 'dfFInicioEscala',
            nextTab                                   : 'idbtnCancelarEscala',
            listeners                                 : {change: function (tf, n, o) {
                self.cambio = 1;
            }},
            vtype                                     : 'daterange', anchor: '90%', startDateField: 'dfFInicioEscala'
        });

        this.formularioEscala = new Ext.FormPanel({
            id          : 'idformularioEscala',
            labelAlign  : 'top',
            frame       : true,
            width       : 420,
            autoHeight  : true,
            autoValidate: false,
            bodyStyle   : {
                padding: '10px 10px 10px 10px',
            },
            items       : [
                {layout  : 'column',
                    items: [
                        {columnWidth: .5, layout: 'form', items: [this.cbEscala]},
                        {columnWidth: .5, layout: 'form', items: [this.nfImporte]},
                        // {columnWidth: .35, layout: 'form', items: [this.cbCategoriascala]}
                    ]
                },
                {layout  : 'column',
                    items: [
                        {columnWidth: .5, layout: 'form', items: [this.dfFInicioEscala]},
                        {columnWidth: .5, layout: 'form', items: [this.dfFFinEscala]}
                    ]
                }
            ],
        });


        this.btnCancelarEscala = new Ext.Button({
            id     : 'idbtnCancelarEscala',
            iconCls: 'cancelar',
            // icon: perfil.dirImg + 'cancelar.png',
            text   : 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt + X</b>)',
            prevTab: 'dfFFinEscala',
            nextTab: 'idbtnAplicarEscala',
            handler: function () {
                self.ventanaEscala.hide();
            }
        });

        this.btnAplicarEscala = new Ext.Button({
            id     : 'idbtnAplicarEscala',
            iconCls: 'aplicar',
            //icon: perfil.dirImg + 'aplicar.png',
            text   : 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos (<b>Ctrl+Alt+P</b>)',
            prevTab: 'idbtnCancelarEscala',
            nextTab: 'idbtnAceptarEscala',
            hidden: true,
            handler: function () {
                boton = 1;
                //  AdicionarModConfiguracionEscala(boton);
            }
        });

        this.btnAceptarEscala = new Ext.Button({
            id     : 'idbtnAceptarEscala',
            iconCls: 'aceptar',
            // icon: perfil.dirImg + 'aceptar.png',
            text   : 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>Enter</b>)',
            prevTab: 'idbtnAplicarEscala',
            nextTab: 'idgpEscalaXConcepto',
            handler: function () {
                //  AdicionarModConfiguracionEscala(boton);
            }
        });

        this.ventanaEscala = new Ext.Window({
            modal          : true,
            closeAction    : 'hide',
            autoValidate   : true,
            validateDefault: true,
            autoHeight     : true,
            constrain      : true,
            closable       : true,
            resizable      : false,
            layout         : 'fit',
            items          : [this.formularioEscala],
            buttons        : [this.btnCancelarEscala, this.btnAceptarEscala],
            listeners      : {
                show: function () {
                    if (accionescala == 'Add' || accionescala == 'Mod') {
                        if (this.cbEscala.tree.rendered) {
                            this.cbEscala.tree.getLoader().load(this.cbEscala.tree.getRootNode());
                        }
                    }
                }.createDelegate(this)
            }
        });


        this.items = [self.panelCenter, self.panelSouthEscala];

        function LimpiarGridEscalasXConceptos() {

            self.storeEscalaXConceptoGrid.removeAll();
            if (self.modoviewform == 2) {
                self.gpEscalaXConcepto.disable();
            }
            self.btnModificarEscala.disable();
            self.btnEliminarEscala.disable();
            self.btnAdicionarEscala.disable();
        }

        function ActivarComboTarifa() {
            var idconcepto = self.cbConcepto.getValue();
            self.cbTarifa.setValue('');
            //self.cbTarifa.disable();
            self.storeTarifa.load({params: {idconcepto: idconcepto}, callback: function (r) {
                if (r.length > 0) {
                    self.cbTarifa.enable();
                } else mostrarMensaje(1, 'No existen tarifas configuradas para el concepto <b>' + self.cbConcepto.getRawValue() + '</b>.');

            }});
        }

        function CalcularImporte(n) {
            var idescala = n.id;
            Ext.Ajax.request({
                url     : '/pvd/nomina/index.php/gpconceptosescalacomp/calcularImporte',
                method  : 'POST',
                params  : {idescala: idescala,
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    var importe = responseData;
                    if (importe == -1) {
                        self.nfImporte.setValue("0.00");
                    } else {
                        self.nfImporte.setValue(importe);
                    }
                }
            });
        }

        function mostrarVentanaAdicionarConcepto() {
            self.storeConcepto.load();
            self.formularioConcepto.getForm().reset();
            self.cbConcepto.focus(true, 500);
            self.ventanaConcepto.setTitle('Adicionar concepto de percepción o descuento');
            self.btnAplicarConcepto.show();
            self.ventanaConcepto.show();
            //Actualizar la tabulación deL formulario.
            self.btnCancelarConcepto.setNextElement('idbtnAplicarConcepto');
            self.btnAceptarConcepto.setPreviousElement('idbtnAplicarTipoN');
            self.accion = 'Add';
            self.checkTodosCargos.enable();
        }

        function mostrarVentanaModificarConcepto() {
            self.storeConcepto.load();
            self.ventanaConcepto.setTitle('Modificar concepto de percepción o descuento');
            self.btnAplicarConcepto.hide();
            self.cbConcepto.focus(true, 500);
            self.ventanaConcepto.show();
            //Actualizar la tabulación deL formulario.
            self.btnCancelarConcepto.setNextElement('idbtnbtnAceptarConcepto');
            self.btnAceptarConcepto.setPreviousElement('idbtnCancelarConcepto');

            self.cbTarifa.enable();
            self.formularioConcepto.getForm().loadRecord(self.gpConcepto.getSelectionModel().getSelected());
            self.cbTarifa.setValue(self.gpConcepto.getSelectionModel().getSelected().get('denomtarifa'));
            self.accion = 'Mod';
            //self.checkTodosCargos.disable();
        }

        function mostrarVentanaAdicionarEscala() {
            self.formularioEscala.getForm().reset();
            if (self.tipo == 1) {
                self.cbCategoriascala.disable();
                // self.formularioEscala.remove('idcbCategoriascala');
//                self.formularioEscala.add(self.cbCategoriascala);
//                self.formularioEscala.doLayout();
            }

            //  console.info(self.formularioEscala.getForm());

            self.cbEscala.focus(true, 500);
            self.ventanaEscala.setTitle('Adicionar escala ');

            self.btnAplicarEscala.show();
            self.ventanaEscala.show();
            //Actualizar la tabulación deL formulario.
            self.btnCancelarEscala.setNextElement('idbtnAplicarEscala');
            self.btnAceptarEscala.setPreviousElement('idbtnAplicarEscala');
            self.cbEscala.setRawValue("");
            self.accionescala = 'Add';


        }

        function mostrarVentanaModificarEscala() {
            self.formularioEscala.getForm().reset();
            self.cbEscala.focus(true, 500);
            self.ventanaEscala.setTitle('Modificar escala ');
            if (self.tipo == 1) {
                self.cbCategoriascala.disable();
                // self.formularioEscala.remove('idcbCategoriascala');
//                self.formularioEscala.add(self.cbCategoriascala);
//                self.formularioEscala.doLayout();
            }
            self.btnAplicarEscala.hide();
            self.ventanaEscala.show();
            //Actualizar la tabulación deL formulario.
            self.btnCancelarEscala.setNextElement('idbtnbtnAceptarEscala');
            self.btnAceptarEscala.setPreviousElement('idbtnCancelarEscala');
            self.formularioEscala.getForm().loadRecord(self.gpEscalaXConcepto.getSelectionModel().getSelected());

            var escal = self.gpEscalaXConcepto.getSelectionModel().getSelected().get('escala');
            self.cbEscala.setRawValue(escal);
            self.cbEscala.enable();
            self.accionescala = 'Mod';

        }

        function CargarEscalasXConcepto(idconcepto, recargar) {

            self.gpEscalaXConcepto.enable();
            self.storeEscalaXConceptoGrid.removeAll();
            if (!recargar) {
                self.storeEscalaXConceptoGrid.baseParams.idconfconceptospdelementossalariales = idconcepto;
                self.storeEscalaXConceptoGrid.baseParams.idcargosocupados = self.cargosocupados;
                self.storeEscalaXConceptoGrid.baseParams.tipo = self.tipo;
                self.storeEscalaXConceptoGrid.load();
            } else {
                self.storeEscalaXConceptoGrid.reload();
            }
            self.btnAdicionarEscala.enable();
            self.btnModificarEscala.disable();
            self.btnEliminarEscala.disable();
        }


        function AdicionarModConfiguracionEscala(boton) {
            var este = this;
            //  console.info(self.cargosocupados);
            /* var arreglo = self.gpTipoNomina.getSelections();
             console.info();
             var arrayDatos = new Array();
             for (var i = 0; i < arreglo.length; i++){
             arrayDatos.push(arreglo[i]['data']['idelementosalarialcargo']);
             }*/

            var urlAction = '/pvd/nomina/index.php/gpconceptosescalacomp/adicionarEscalaXConcepto';
            var lbMsgEspera = 'Adicionando datos de la escala...';
            var lbMsgExito = 'La escala ha sido adicionado satisfactoriamente.';

            if (self.accionescala == 'Mod') {
                lbMsgEspera = 'Modificando datos del elemento salarial...';
                lbMsgExito = 'La escala ha sido modificado satisfactoriamente.';
                // urlAction = '/pvd/nomina/index.php/gpconceptosescalacomp/modificarEscalaXConcepto';
            }
            if (self.cambio == 0) {
                if (self.accionescala == 'Mod') {
                    //Se oculta la ventana si no ha sido modificado ningún valor.
                    self.ventanaEscala.hide();
                } else {
                    //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                    self.cbEscala.markInvalid('Este campo es obligatorio.');
                    self.nfImporte.markInvalid('Este campo es obligatorio.');
                    self.dfFInicioEscala.markInvalid('Este campo es obligatorio.');
                    mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
                }
            } else {
                if (self.formularioEscala.getForm().isValid()) {
                    if (self.accionescala == 'Mod') {
                        var idestructur = "";
                        var denomescala = self.cbEscala.getValue();
                        var escala = self.cbEscala.getRawValue();

                        if (self.cbEscala.tree.getSelectionModel().getSelectedNode() == null) {
                            idestructur = self.gpEscalaXConcepto.getSelectionModel().getSelected().get('idescalatarifa');
                        } else if (self.cbEscala.tree.rendered && !isNaN(denomescala)) {
                            idestructur = self.cbEscala.tree.getSelectionModel().getSelectedNode().id;
                        } else {
                            idestructur = self.gpEscalaXConcepto.getSelectionModel().getSelected().get('idescalatarifa');
                        }
                        var idescala = self.cbEscala.getRawValue();

                        /*if (isNaN(idescala)) {
                         idestructur = self.gpEscalaXConcepto.getSelectionModel().getSelected().get('idescalatarifa');
                         } else {
                         idestructur = idescala;
                         }*/

                        //Se muestra la máscara de espera.
                        PVD.mostrarMascara('idmaskaddmodtipopago', 'Por favor espere…', 'Modificando datos de la escala');
                        //Enviando datos al servidor.
                        Ext.Ajax.request({
                            url     : '/pvd/nomina/index.php/gpconceptosescalacomp/modificarEscalaXConcepto',
                            method  : 'POST',
                            params  : {idconfescalaelementosalarial : self.gpEscalaXConcepto.getSelectionModel().getSelected().get('idconfescalaelementosalarial'),
                                idestructuraescalar                 : idestructur,
                                importe                             : self.nfImporte.getValue(),
                                fechainicio                         : self.dfFInicioEscala.getRawValue(),
                                fechafin                            : self.dfFFinEscala.getRawValue(),
                                idconfconceptospdelementossalariales: self.gpConcepto.getSelectionModel().getSelected().get('idconfconceptospdelementossalariales'),
                                tipo                                : self.tipo,
                                idcargosocupados                    : self.cargosocupados
                            },
                            callback: function (options, success, response) {
                                responseData = Ext.decode(response.responseText);

                                //Ocultando máscara de enviar datos.
                                PVD.ocultarMascara('idmaskaddmodtipopago');

                                if (responseData.codMsg == 1) {
                                    mostrarMensaje(1, 'La escala ha sido modificada satisfactoriamente.', function () {
                                        if (!boton) {
                                            self.ventanaEscala.hide();


                                        } else {
                                            self.cbEscala.focus(true, 500);
                                        }
                                        self.formularioEscala.getForm().reset();
                                        self.gpEscalaXConcepto.getStore().removeAll();
                                        var idconfconceptopercepciondescuento = self.gpConcepto.getSelectionModel().getSelected().get('idconfconceptospdelementossalariales');
                                        CargarEscalasXConcepto(-1, true);
                                        self.cambio = 0;
                                        self.btnEliminarEscala.disable();
                                        //este.btnAdicionarEscala.disable();
                                        self.btnModificarEscala.disable();
                                    });

                                } else {
                                    if (responseData.codMsg)
                                        mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                }
                            }.createDelegate(this)
                        });
                    } else {
                        //Se muestra la máscara de espera.
                        PVD.mostrarMascara('idmaskaddmodtipopago', 'Por favor espere…', 'Adicionando datos de la escala');
                        //Enviando datos al servidor.
                        Ext.Ajax.request({
                            url     : '/pvd/nomina/index.php/gpconceptosescalacomp/adicionarEscalaXConcepto',
                            method  : 'POST',
                            params  : {
                                idestructuraescalar                 : self.cbEscala.getValue(),
                                importe                             : self.nfImporte.getValue(),
                                fechainicio                         : self.dfFInicioEscala.getRawValue(),
                                fechafin                            : self.dfFFinEscala.getRawValue(),
                                idconfconceptospdelementossalariales: self.gpConcepto.getSelectionModel().getSelected().get('idconfconceptospdelementossalariales'),
                                tipo                                : self.tipo,
                                idcargosocupados                    : self.cargosocupados
                            },
                            callback: function (options, success, response) {
                                responseData = Ext.decode(response.responseText);

                                //Ocultando máscara de enviar datos.
                                PVD.ocultarMascara('idmaskaddmodtipopago');

                                if (responseData.codMsg == 1) {
                                    mostrarMensaje(1, 'La escala ha sido adicionada satisfactoriamente.', function () {
                                        if (!boton) {
                                            self.ventanaEscala.hide();
                                            self.cbEscala.reset();
                                        } else {
                                            self.cbEscala.focus(true, 500);
                                        }
                                        self.formularioEscala.getForm().reset();
                                        self.cambio = 0;
                                        CargarEscalasXConcepto(-1, true);
                                    });

                                } else if (responseData.codMsg == 2) {
                                    mostrarMensaje(2, 'Ya existe una escala asociada a este concepto', function () {
                                        if (!boton) {
                                            self.ventanaEscala.hide();

                                        } else {
                                            self.cbEscala.focus(true, 500);
                                        }
                                    });
                                } else {
                                    if (responseData.codMsg)
                                        mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                }
                            }.createDelegate(this)
                        });
                    }
                } else {
                    mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
                }
            }
        }

        function eliminarEscala() {

            //Mostrando el mensaje para aceptar el eliminar.
            mostrarMensaje(2, '¿Está seguro que quiere eliminar la escala seleccionada?', function (btn) {
                if (btn == "ok") {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskeleminartipopago', 'Por favor espere…', 'Eliminando datos de la escala...');
                    //Enviando los datos al servidor.
                    Ext.Ajax.request({
                        url     : '/pvd/nomina/index.php/gpconceptosescalacomp/eliminarEscalaXConcepto',
                        method  : 'POST',
                        params  : {idconfescala: self.gpEscalaXConcepto.getSelectionModel().getSelected().get('idconfescalaelementosalarial'),
                            tipo               : self.tipo, },
                        callback: function (options, success, response) {
                            //Se oculta la máscara de espera.
                            PVD.ocultarMascara('idmaskeleminartipopago');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsg) {
                                //Mostrando el mensaje de que se ha el tipo de nómina.
                                mostrarMensaje(1, 'La escala ha sido eliminada satisfactoriamente.', function (btn) {

                                });
                                //Recargando el grid de tipos de nómina.
                                self.formularioEscala.getForm().reset();
                                self.gpEscalaXConcepto.getStore().removeAll();
                                var idconfconceptopercepciondescuento = self.gpConcepto.getSelectionModel().getSelected().get('idconfconceptospdelementossalariales');
                                self.storeEscalaXConceptoGrid.load({params: {idconfconcepto: idconfconceptopercepciondescuento, tipo: self.tipo, idcargosocupados: this.cargosocupados}});
                                self.cambio = 0;
                                self.btnEliminarEscala.disable();
                                //este.btnAdicionarEscala.disable();
                                self.btnModificarEscala.disable();
                            }
                        }.createDelegate(this)
                    });
                }

            });
        }

        Pvd.Nomina.gpconceptosescalacomp.superclass.initComponent.call(this);
    },

    CargarElementosSalariales: function (idelemento, identidad, idcargosocupados) {
        //console.info(idcargosocupados);
        this.enable();
        this.gpConcepto.enable();
        this.btnAdicionarConcepto.enable();
        this.btnBuscar.enable();
        this.storeConceptoPDGrid.baseParams.tipo = this.tipo;
        this.storeConceptoPDGrid.baseParams.idelemento = idelemento;
        this.storeConceptoPDGrid.baseParams.identidad = identidad;
        this.storeConceptoPDGrid.baseParams.idcargosocupados = idcargosocupados;
        this.cargosocupados = idcargosocupados;
        //conso
        this.storeConceptoPDGrid.load({params: {limit: 1000, start: 0}});
    },

    EliminarConceptoPD: function (arrayIdElemSalCargo, idConcepPD) {

//        console.log('entre');
//        console.log(arrayIdConcepPD);
        var este = this;
        var arrayDatos = new Array();

        var check = este.checkTodosCargosEliminar.getValue();
        mostrarMensaje(2, '¿Está seguro que quiere eliminar el concepto de percepción y descuento seleccionado?', function (btn) {
            if (btn == "ok") {
                //Se muestra la máscara de espera.
                PVD.mostrarMascara('idmaskeleminartipopago', 'Por favor espere…', 'Eliminando datos del concepto de percepción y descuento ');
                //Enviando los datos al servidor.
                Ext.Ajax.request({
                    url     : '/pvd/nomina/index.php/gpconceptosescalacomp/eliminarConceptoPagoDescuento',
                    method  : 'POST',
                    timeout : 500000000,
                    params  : {
                        arrayIdElemSalCargo: Ext.encode(arrayIdElemSalCargo),
                        idConcepPD: idConcepPD,
                        checked        : check
                    },
                    callback: function (options, success, response) {
                        este.filasSelecionadas = new Array();
                        //Se oculta la máscara de espera.
                        PVD.ocultarMascara('idmaskeleminartipopago');
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {
                            //Mostrando el mensaje de que se ha el tipo de nómina.
                            mostrarMensaje(1, 'El concepto de percepción y descuento asociado al elemento salarial al cargo ha sido eliminado satisfactoriamente.', function (btn) {

                            });
                            //Recargando el grid de tipos de nómina.
                            este.gpConcepto.getStore().removeAll();
                            este.filasSelecionadas = new Array();
                            este.CargarElementosSalariales(idelemt);
                            este.btnAdicionarConcepto.enable();
                            este.btnModificarConcepto.disable();
                            este.btnEliminarConcepto.disable();
                            este.btnBuscar.enable();
                        } else {
                            if (responseData.codMsg)
                                mostrarMensaje(responseData.codMsg, "El concepto de percepción y descuento que quiere eliminar esta siendo usado");
                        }
                    }.createDelegate(this)
                });
            }

        });
    },

    AdicionarModificarConceptoPD: function (array, boton, tipo, idelemt) {
        var este = this;
        var checked = this.checkTodosCargos.getValue();
        var arrayDatos = new Array();
        for (var i = 0; i < array.length; i++) {
            arrayDatos.push(array[i]['data']['idelementosalarialcargo']);
        }


        var urlAction = '/pvd/nomina/index.php/gpconceptosescalacomp/adicionarConceptoPagoDescuento';
        var lbMsgEspera = 'Adicionando datos del elemento salarial...';
        var lbMsgExito = 'El elemento salarial ha sido adicionado satisfactoriamente.';

        if (este.accion == 'Mod') {
            lbMsgEspera = 'Modificando datos del elemento salarial...';
            lbMsgExito = 'El elemento salarial ha sido modificado satisfactoriamente.';
            urlAction = '/pvd/nomina/index.php/gpconceptosescalacomp/modificarConceptoPagoDescuento';
        }
        if (este.cambio == 0) {
            if (este.accion == 'Mod') {
                //Se oculta la ventana si no ha sido modificado ningún valor.
                este.ventanaConcepto.hide();
            } else {
                //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                este.cbConcepto.markInvalid('Este campo es obligatorio.');
                este.cbTarifa.markInvalid('Este campo es obligatorio.');
                mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
            }
        } else {
            if (este.formularioConcepto.getForm().isValid()) {
                var idtarifabool = este.cbTarifa.getValue();
                var idtarifa = 0;
                if (isNaN(idtarifabool)) {
                    idtarifa = este.gpConcepto.getSelectionModel().getSelected().get('idtarifa');
                } else {
                    idtarifa = idtarifabool;
                }
                if (este.accion == 'Mod') {
                    var idconceptopdelemento = este.gpConcepto.getSelectionModel().getSelected().get('idconfconceptospdelementossalariales');

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodtipopago', 'Por favor espere…', 'Modificando datos del concepto de percepción y descuento');
                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url     : urlAction,
                        method  : 'POST',
                        timeout : 500000000,
                        params  : {idconceptoPd  : idconceptopdelemento,
                            idconcepto           : this.cbConcepto.getValue(),
                            idtarifa             : idtarifa,
                            fechainicio          : this.dfFInicioConcepto.getRawValue(),
                            fechafin             : this.dfFFinConcepto.getRawValue(),
                            tipo                 : tipo,
                            idelemsalcargo       : Ext.encode(arrayDatos),
                            idelemsalpersona     : null,
                            idelemsalcargoocupado: null,
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodtipopago');

                            if (responseData.codMsg == 2) {
                                mostrarMensaje(1, 'El concepto de percepción y descuento asociado al elemento salarial al cargo ha sido modificado satisfactoriamente.', function () {
                                    if (!boton) {
                                        este.ventanaConcepto.hide();

                                    } else {
                                        este.cbConcepto.focus(true, 500);
                                    }
                                    este.formularioConcepto.getForm().reset();
                                    este.gpConcepto.getStore().removeAll();
                                    este.storeConceptoPDGrid.load({params: {idelemento: idelemt, start:0,limit:1000}});
                                    este.gpEscalaXConcepto.getStore().removeAll();
                                    if (this.modoviewform == 2) {
                                        este.gpEscalaXConcepto.disable();
                                    }
                                    este.cambio = 0;
                                    este.btnAdicionarConcepto.enable();
                                    este.btnModificarConcepto.disable();
                                    este.btnEliminarConcepto.disable();
                                    este.btnBuscar.enable();
                                    //este.cbTarifa.disable();
                                });

                            } else {
                                if (responseData.codMsg)
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            }
                        }
                    });
                } else {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodtipopago', 'Por favor espere…', 'Adicionando datos');
                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url     : urlAction,
                        method  : 'POST',
                        params  : {idconcepto    : this.cbConcepto.getValue(),
                            idtarifa             : idtarifa,
                            fechainicio          : this.dfFInicioConcepto.getRawValue(),
                            fechafin             : this.dfFFinConcepto.getRawValue(),
                            tipo                 : tipo,
                            idelemsalcargo       : Ext.encode(arrayDatos),
                            idelemsalpersona     : null,
                            idelemsalcargoocupado: null,
                            checked              : checked
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodtipopago');

                            if (responseData.codMsg == 1) {
                                mostrarMensaje(1, 'El concepto de percepción y descuento asociado al elemento salarial al cargo ha sido adicionado satisfactoriamente.', function () {
                                    if (!boton) {
                                        este.ventanaConcepto.hide();

                                    } else {
                                        este.cbConcepto.focus(true, 500);
                                    }
                                    este.formularioConcepto.getForm().reset();
                                    este.gpConcepto.getStore().removeAll();
                                    este.storeConceptoPDGrid.load({params: {idelemento: idelemt, start:0, limit: 1000}});
                                    este.cambio = 0;
                                    este.btnAdicionarConcepto.enable();
                                    este.btnModificarConcepto.disable();
                                    este.btnEliminarConcepto.disable();
                                    este.btnBuscar.enable();
                                    //este.cbTarifa.disable();
                                });

                            } else {
                                if (responseData.codMsg)
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            }
                        }
                    });
                }
            } else {
                mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
            }
        }
    },

    AdicionarModConfiguracionEscala: function (boton, array, idsituacionlaboral, identidad) {
        var self = this;
        var categoria = self.cbCategoriascala.getValue();
        var denomcategoria = self.cbCategoriascala.getRawValue();
        //console.info(categoria);
        var arrayDatos = new Array();
        var arrayidcargosocupados = new Array();
        if (self.tipo == 1) {
            for (var i = 0; i < array.length; i++) {
                arrayDatos.push(array[i]['data']['idelementosalarialcargo']);
            }
        } else if (self.tipo == 2) {
            Ext.each(array, function (obj) {
               // if (obj.data.idcategoriapersona == categoria) {//milena
                    arrayidcargosocupados.push(obj.data.idcargosocupados);
               // }
            });
        }

        var identidad = identidad;

        var urlAction = '/pvd/nomina/index.php/gpconceptosescalacomp/adicionarEscalaXConcepto';
        var lbMsgEspera = 'Adicionando datos de la escala...';
        var lbMsgExito = 'La escala ha sido adicionado satisfactoriamente.';

        if (self.accionescala == 'Mod') {
            lbMsgEspera = 'Modificando datos del elemento salarial...';
            lbMsgExito = 'La escala ha sido modificado satisfactoriamente.';
            urlAction = '/pvd/nomina/index.php/gpconceptosescalacomp/modificarEscalaXConcepto';
        }
        if (self.cambio == 0) {
            if (self.accionescala == 'Mod') {
                //Se oculta la ventana si no ha sido modificado ningún valor.
                self.ventanaEscala.hide();
            } else {
                //Se marcan como obligatorios en caso de presionar aceptar y se encuentren vacíos.
                self.cbEscala.markInvalid('Este campo es obligatorio.');
                self.nfImporte.markInvalid('Este campo es obligatorio.');
                self.dfFInicioEscala.markInvalid('Este campo es obligatorio.');
                mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
            }
        } else {
            if (self.formularioEscala.getForm().isValid()) {
                if (self.accionescala == 'Mod') {
                    var idestructur = "";
                    var denomescala = self.cbEscala.getValue();
                    var escala = self.cbEscala.getRawValue();

                    if (self.cbEscala.tree.getSelectionModel().getSelectedNode() == null) {
                        idestructur = self.gpEscalaXConcepto.getSelectionModel().getSelected().get('idescalatarifa');
                    } else if (self.cbEscala.tree.rendered && !isNaN(denomescala)) {
                        idestructur = self.cbEscala.tree.getSelectionModel().getSelectedNode().id;
                    } else {
                        idestructur = self.gpEscalaXConcepto.getSelectionModel().getSelected().get('idescalatarifa');
                    }
                    var idescala = self.cbEscala.getRawValue();

                    /*if (isNaN(idescala)) {
                     idestructur = self.gpEscalaXConcepto.getSelectionModel().getSelected().get('idescalatarifa');
                     } else {
                     idestructur = idescala;
                     }*/

                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodtipopago', 'Por favor espere…', 'Modificando datos de la escala');
                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url     : '/pvd/nomina/index.php/gpconceptosescalacomp/modificarEscalaXConcepto',
                        method  : 'POST',
                        params  : {idconfescalaelementosalarial : self.gpEscalaXConcepto.getSelectionModel().getSelected().get('idconfescalaelementosalarial'),
                            arrayidcargosocupados : Ext.encode(arrayidcargosocupados),
                            idestructuraescalar                 : idestructur,
                            importe                             : self.nfImporte.getValue(),
                            idconceptopercepciondescuento       : self.gpConcepto.getSelectionModel().getSelected().get('idconceptopercepciondescuento'),
                            fechainicio                         : self.dfFInicioEscala.getRawValue(),
                            fechafin                            : self.dfFFinEscala.getRawValue(),
                            idconfconceptospdelementossalariales: self.gpConcepto.getSelectionModel().getSelected().get('idconfconceptospdelementossalariales'),
                            tipo                                : self.tipo,
                            idsituacionlaboral                  : idsituacionlaboral,
                            idcargosocupados                    : self.cargosocupados,
                            identidad                           : identidad,
                            idelemsalcargo                      : Ext.encode(arrayDatos)
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodtipopago');

                            if (responseData.codMsg == 1) {
                                mostrarMensaje(1, 'La escala ha sido modificada satisfactoriamente.', function () {
                                    if (!boton) {
                                        self.ventanaEscala.hide();


                                    } else {
                                        self.cbEscala.focus(true, 500);
                                    }
                                    self.formularioEscala.getForm().reset();
                                    self.gpEscalaXConcepto.getStore().removeAll();
                                    var idconfconceptopercepciondescuento = self.gpConcepto.getSelectionModel().getSelected().get('idconfconceptospdelementossalariales');
                                    self.CargarEscalasXConcepto(-1, true);
                                    self.cambio = 0;
                                    self.btnEliminarEscala.disable();
                                    //este.btnAdicionarEscala.disable();
                                    self.btnModificarEscala.disable();
                                });

                            } else {
                                if (responseData.codMsg)
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            }
                        }.createDelegate(this)
                    });
                } else {
                    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskaddmodtipopago', 'Por favor espere…', 'Adicionando datos de la escala');
                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url     : '/pvd/nomina/index.php/gpconceptosescalacomp/adicionarEscalaXConcepto',
                        method  : 'POST',
                        params  : {
                            idestructuraescalar                 : self.cbEscala.getValue(),
                            importe                             : self.nfImporte.getValue(),
                            fechainicio                         : self.dfFInicioEscala.getRawValue(),
                            fechafin                            : self.dfFFinEscala.getRawValue(),
                            idconceptopercepciondescuento       : self.gpConcepto.getSelectionModel().getSelected().get('idconceptopercepciondescuento'),
                            idconfconceptospdelementossalariales: self.gpConcepto.getSelectionModel().getSelected().get('idconfconceptospdelementossalariales'),
                            tipo                                : self.tipo,
                            idsituacionlaboral                  : idsituacionlaboral,
                            idcargosocupados                    : self.cargosocupados,
                            identidad                           : identidad,
                            idelemsalcargo                      : Ext.encode(arrayDatos),
                            arrayidcargosocupados : Ext.encode(arrayidcargosocupados),
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);

                            //Ocultando máscara de enviar datos.
                            PVD.ocultarMascara('idmaskaddmodtipopago');

                            if (responseData.codMsg == 1) {
                                mostrarMensaje(1, 'La escala ha sido adicionada satisfactoriamente.', function () {
                                    if (!boton) {
                                        self.ventanaEscala.hide();
                                        self.cbEscala.reset();
                                    } else {
                                        self.cbEscala.focus(true, 500);
                                    }
                                    self.formularioEscala.getForm().reset();
                                    self.cambio = 0;
                                    self.CargarEscalasXConcepto(-1, true);
                                });

                            } else if (responseData.codMsg == 2) {
                                mostrarMensaje(2, 'Ya existe una escala asociada a este concepto', function () {
                                    if (!boton) {
                                        self.ventanaEscala.hide();

                                    } else {
                                        self.cbEscala.focus(true, 500);
                                    }
                                });
                            } else {
                                if (responseData.codMsg)
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            }
                        }.createDelegate(this)
                    });
                }
            } else {
                mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
            }
        }


    },

    eliminarEscala: function (array, idsituacionlaboral, identidad, idcategoriapersona) {

        var self = this;
        var categoria = self.cbCategoriascala.getValue();
        var arrayDatos = new Array();
        var arrayidcargosocupados = new Array();
        //var arrayDatoss = new Array();
        if (self.tipo == 1) {
            for (var i = 0; i < array.length; i++) {
                arrayDatos.push(array[i]['data']['idelementosalarialcargo']);
            }
        } else if (self.tipo == 2) {
            Ext.each(array, function (obj) {
                arrayidcargosocupados.push(obj.data.idcargosocupados);
            });
        }

        //Mostrando el mensaje para aceptar el eliminar.
        mostrarMensaje(2, '¿Está seguro que quiere eliminar la escala seleccionada?', function (btn) {
            if (btn == "ok") {
                //Se muestra la máscara de espera.
                PVD.mostrarMascara('idmaskeleminartipopago', 'Por favor espere…', 'Eliminando datos de la escala...');
                //Enviando los datos al servidor.
                Ext.Ajax.request({
                    url     : '/pvd/nomina/index.php/gpconceptosescalacomp/eliminarEscalaXConcepto',
                    method  : 'POST',
                    params  : {idconfescala          : self.gpEscalaXConcepto.getSelectionModel().getSelected().get('idconfescalaelementosalarial'),
                        tipo                         : self.tipo,
                        // idelemsalcargo: Ext.encode(arrayDatos),
                        idconceptopercepciondescuento: self.gpConcepto.getSelectionModel().getSelected().get('idconceptopercepciondescuento'),
                        idelemsalcargo               : Ext.encode(arrayDatos),
                        identidad                    : identidad,
                        idsituacionlaboral           : idsituacionlaboral,
                        arrayidcargosocupados           : Ext.encode(arrayidcargosocupados),
                    },
                    callback: function (options, success, response) {
                        //Se oculta la máscara de espera.
                        PVD.ocultarMascara('idmaskeleminartipopago');
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg) {
                            //Mostrando el mensaje de que se ha el tipo de nómina.
                            mostrarMensaje(1, 'La escala ha sido eliminada satisfactoriamente.', function (btn) {

                            });
                            //Recargando el grid de tipos de nómina.
                            self.formularioEscala.getForm().reset();
                            self.gpEscalaXConcepto.getStore().removeAll();
                            var idconfconceptopercepciondescuento = self.gpConcepto.getSelectionModel().getSelected().get('idconfconceptospdelementossalariales');
                            self.storeEscalaXConceptoGrid.load({params: {idconfconcepto: idconfconceptopercepciondescuento, tipo: self.tipo, idcargosocupados: this.cargosocupados}});
                            self.cambio = 0;
                            self.btnEliminarEscala.disable();
                            //este.btnAdicionarEscala.disable();
                            self.btnModificarEscala.disable();
                        }
                    }.createDelegate(this)
                });
            }

        });
    },

    CargarEscalasXConcepto: function (idconcepto, recargar) {
        var self = this;
        self.gpEscalaXConcepto.enable();
        self.storeEscalaXConceptoGrid.removeAll();
        if (!recargar) {
            self.storeEscalaXConceptoGrid.baseParams.idconfconceptospdelementossalariales = idconcepto;
            self.storeEscalaXConceptoGrid.baseParams.idcargosocupados = self.cargosocupados;
            self.storeEscalaXConceptoGrid.baseParams.tipo = self.tipo;
            self.storeEscalaXConceptoGrid.load();
        } else {
            self.storeEscalaXConceptoGrid.reload();
        }
        self.btnAdicionarEscala.enable();
        self.btnModificarEscala.disable();
        self.btnEliminarEscala.disable();
    },

    LimpiarTodo: function () {
        if (this.modoviewform == 2) {
            this.gpConcepto.disable();
            this.gpEscalaXConcepto.disable();
            this.btnBuscar.disable();
            this.disable();
        } else {
            this.btnAdicionarConcepto.disable();
            this.btnModificarConcepto.disable();
            this.btnEliminarConcepto.disable();
            this.btnBuscar.disable();
        }
        this.btnAdicionarEscala.disable();
        this.storeConceptoPDGrid.removeAll();
        this.storeEscalaXConceptoGrid.removeAll();

    },

    filasSeleccionadas: function () {

        return this.filasSelecionadas;
    }

});
