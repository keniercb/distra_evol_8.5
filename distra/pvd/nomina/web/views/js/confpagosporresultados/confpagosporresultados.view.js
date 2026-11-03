Ext.ns('Pvd.Nomina.Confpagoxresultados');
Ext.QuickTips.init();

Pvd.Nomina.Confpagoxresultados.Vista = {
    init: function (perfil, idioma, modelo, idestructurapadre) {
        var self = this;
        this.hoja = false;
        this.idestructura = perfil.idestructuracomun;

        this.btnAdicionarpagos = new Ext.Button({
            id: 'btnAddpagos',
            text: "Ad<u>i</u>cionar",
            tooltip: 'Adicionar tipo de pago <b>(Alt+I)</b> ',
            iconCls: 'adicionar'
        });

        this.btnModificarpagos = new Ext.Button({
            id: 'btnUpdpagos',
            text: "<u>M</u>odificar",
            tooltip: 'Modificar tipo de pago',
            iconCls: 'modificar'
        });

        this.btnEliminarpagos = new Ext.Button({
            id: 'btnDelpagos',
            text: 'Eliminar',
            tooltip: 'Eliminar tipo de pago <b>(DEL)</b>',
            iconCls: 'eliminar'
        });

        this.btnreplicar = new Ext.Button({
            id: 'btnreplicar',
            text: 'Replicar',
            tooltip: 'Replicar',
            disabled: true,
            iconCls: 'adicionar',
            handler: function () {
            }.createDelegate(this)
        });

        this.btnBajarfila = new Ext.Button({
            id: 'btnBajarfila',
            text: 'Bajar',
            tooltip: 'Bajar',
            iconCls: 'bajar',
            hidden:true
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: 'Ayuda',
            tooltip: 'Ayuda de la funcionalidad',
            iconCls: 'ayuda',

        });

        this.btnSubirfila = new Ext.Button({
            id: 'btnSubirfila',
            text: 'Subir',
            tooltip: 'Subir',
            iconCls: 'subir',
            hidden:true
        });

        this.btnAdicionarIndicadores = new Ext.Button({
            id: 'btnAddIndicadores',
            text: "Ad<u>i</u>cionar",
            tooltip: 'Adicionar Indicador<b>(Alt+I)</b>',
            iconCls: 'adicionar'
        });

        this.btnModificarIndicadores = new Ext.Button({
            id: 'btnUpd',
            text: "<u>M</u>odificar",
            tooltip: 'Modificar Indicador <b>(Alt+M)</b>',
            iconCls: 'modificar'
        });

        this.btnEliminarIndicadores = new Ext.Button({
            id: 'btnDel',
            text: 'Eliminar',
            tooltip: 'Eliminar Indicador<b>(DEL)</b>',
            iconCls: 'eliminar'
        });

        this.btnAdicionarCargos = new Ext.Button({
            id: 'btnAddCargos',
            text: "Ad<u>i</u>cionar",
            tooltip: 'Adicionar Cargos<b>(Alt+I)</b>',
            iconCls: 'adicionar'
        });

        this.btnEliminarCargos = new Ext.Button({
            id: 'btnDelCargos',
            text: 'Eliminar',
            tooltip: 'Eliminar Cargos<b>(DEL)</b>',
            iconCls: 'eliminar'
        });

        this.btnGuardar = new Ext.Button({
            id: 'btnGuardar',
            text: 'Aprobar',
            tooltip: 'Aprobar tipo de pago <b>(Alt+Q)</b>',
            iconCls: 'aprobar'
        });

        this.btnGuardarOrdenInd = new Ext.Button({
            id: 'btnGuardarOrdenInd',
            text: 'Guardar',
            disabled: true,
            tooltip: 'Guardar orden indicadores',
            iconCls: 'guardar'
        });

        this.btnDesaprobar = new Ext.Button({
            id: 'btnDesaprobar',
            text: 'Desaprobar',
            tooltip: 'Desaprobar tipo de pago <b>(Alt+W)</b>',
            iconCls: 'desaprobar'
        });

        this.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            iconCls: 'aceptar'
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicar',
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos (<b>Alt+P</b>)',
            iconCls: 'aplicar'
        });

        this.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt+X</b>)',
            iconCls: 'cancelar'
        });

        this.btnAceptarcargos = new Ext.Button({
            id: 'btnAceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            iconCls: 'aceptar',
            disabled: true
        });

        this.btnAplicarcargos = new Ext.Button({
            id: 'btnAplicar',
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos (<b>Alt+P</b>)',
            iconCls: 'aplicar'
        });

        this.btnCancelarcargos = new Ext.Button({
            id: 'btnCancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt+X</b>)',
            iconCls: 'cancelar'
        });

        this.btnAceptarindicadores = new Ext.Button({
            id: 'btnAceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            iconCls: 'aceptar'
        });

        this.btnAplicarindicadores = new Ext.Button({
            id: 'btnAplicar',
            text: 'Aplicar',
            tooltip: 'Guardar datos y limpiar los campos (<b>Alt+P</b>)',
            iconCls: 'aplicar'
        });

        this.btnCancelarindicadores = new Ext.Button({
            id: 'btnCancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt+X</b>)',
            iconCls: 'cancelar'
        });

        this.q = new Ext.form.TextField({
            fieldLabel: 'desde',
            name: 'q',
            allowBlank: false,
            //labelAlign :'top',
            vtype: 'vtdenominaciones',
            maxLength: 255,
            anchor: '95%'
        });

        this.f = new Ext.form.TextField({
            fieldLabel: 'para',
            name: 'f',
            allowBlank: false,
            vtype: 'vtdenominaciones',
            //labelAlign :'top',
            maxLength: 255,
            anchor: '95%'
        });

        this.tfDenominacion = new Ext.form.TextField({
            fieldLabel: 'Denominaci&oacute;n',
            name: 'denominacion',
            vtype: 'vtdenominaciones',
            allowBlank: false,
            labelAlign: 'top',
            maxLength: 255,
            anchor: '95%'
        });

        this.cbtipovalor = new Ext.form.ComboBox({
            store: modelo.stTipovalor,
            displayField: 'tipovalor',
            valueField: 'idtipovalor',
            hiddenName: 'idtipovalor',
            forceSelection: true,
            allowblank: false,
            id: 'cbtipovalor',
            name: 'cbtipovalor',
            readOnly: true,
            typeAhead: true,
            mode: 'local',
            fieldLabel: 'Tipo de valor',
            labelAlign: 'top',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            allowBlank: false,
            blankText: 'campo vacio',
            selectOnFocus: true,
            anchor: '95%'

        });

        this.cbObligatorio = new Ext.form.Checkbox({
            id: 'idcbObligatorio',
            fieldLabel: 'Obligatorio',
            bottonAlign: 'center',
            name: 'obligatorio', anchor: '95%'
        });
        this.cbRecalculable = new Ext.form.Checkbox({
            id: 'idcbRecalculable',
            fieldLabel: 'Recalculable',
            bottonAlign: 'center',
            name: 'recalculable', anchor: '95%'
        });

        this.cbResultadoFinal = new Ext.form.Checkbox({
            id: 'idcbResultadoFinal',
            fieldLabel: 'Resultado final',
            bottonAlign: 'center',
            name: 'resultadofinal', anchor: '95%'
        });
		
		this.cbSumaDestajo = new Ext.form.Checkbox({
            id: 'cbSumaDestajo',
            fieldLabel: 'Suma destajos',
            bottonAlign: 'center',
            name: 'sumadestajo', anchor: '95%'
        });

        this.chexReporte = new Ext.form.Checkbox(
            {
                id: 'chexReporte',
                boxLabel: 'Reporte salida',
                name: 'salida',
                hideLabel: true,
                //labelAlign: 'left',
                anchor: '99%'
            });

        this.nfieldLugaresDecimales = new Ext.form.NumberField({
            id: 'idnumberfLugaresDecimales',
            fieldLabel: 'Lugares decimales',
            name: 'lugaresdecimales',
            anchor: '95%',
            minValue: 0,
            maxValue: 100
        });

        this.treeComboCamposNomina = new Ext.components.TreeComboBox({
            id: 'idtreeComboCamposNomina', fieldLabel: 'Campos de la n&oacute;mina',
            tabIndex: 4, anchor: "98%",
            treeConfig: {
                rootVisible: false,
                loader: new Ext.tree.TreeLoader({
                    dataUrl: '/pvd/nomina/index.php/confpagosporresultados/obtenerCamposNominas?identidad=' + this.idestructura,
                    preloadChildren: false,
                    listeners: {
                        beforeload: function (treeLoader, node, response) {
                            //self.treeComboCamposNomina.reset();
                        }.createDelegate(this),
                        load: function (treeLoader, node, response) {
                            //self.treeComboCamposNomina.disable();
                            self.treeComboCamposNomina.reset();
                        }.createDelegate(this)
                    }
                }),
                border: false, autoScroll: true,
                listeners: {
                    click: function (node, e) {
                        self.cambio = 1;
                        //Para seleccionar solo los hijos (campos de las nominas) y limpiar los padres (tipos de nominas)
                        if (node.attributes.leaf == false) {
                            self.hoja = false;
                            setTimeout('this.Pvd.Nomina.Confpagoxresultados.Vista.treeComboCamposNomina.setRawValue("");', 5);
                        } else {
                            self.hoja = true;
                        }
                    }.createDelegate(this)
                }
            },
            disabled: true
        });

        this.taDescripcion = new Ext.form.TextArea({
            name: 'descripcion',
            fieldLabel: 'Descripci&oacute;n del indicador',
            anchor: '100%',
            //labelAlign :'top',
            maxLength: 255,
            height: 90
        });

        this.smEntrada = new Ext.grid.RowSelectionModel(
            {
                singleSelect: true
            });

        this.gpEntrada = new Ext.grid.GridPanel({
            region: 'center',
            width: '50%',
            height: 220,
            //title:'Listado de cargos por &aacute;reas',
            store: modelo.stEntrada,
            loadMask: {msg: 'Por favor espere. Cargando datos ...'},
            sm: this.smEntrada,
            columns: [
                {header: 'Denominaci&oacute;n', width: 350, dataIndex: 'denominacion'},
                {
                    header: 'idvariablesconfreportescertificaciones',
                    width: 350,
                    hidden: true,
                    dataIndex: 'idvariablesconfreportescertificaciones'
                },
                {header: 'plantilla', width: 350, hidden: true, dataIndex: 'plantilla'},
                {
                    header: 'idconfreportescertificaciones',
                    width: 350,
                    hidden: true,
                    dataIndex: 'idconfreportescertificaciones'
                },
            ],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group}'
            }),

            /* bbar: new Ext.PagingToolbar({
             pageSize: 10,
             store: modelo.stArea,
             displayInfo: true
             })*/
        });

        this.smSalida = new Ext.grid.RowSelectionModel(
            {
                singleSelect: true
            });

        this.gpSalida = new Ext.grid.GridPanel({
            region: 'center',
            width: '50%',
            height: 220,
            //title:'Listado de cargos por &aacute;reas',
            store: modelo.stSalida,
            loadMask: {msg: 'Por favor espere. Cargando datos ...'},
            sm: this.smSalida,
            columns: [
                {header: 'Denominaci&oacute;n', width: 350, dataIndex: 'denominacion'},
                {
                    header: 'idvariablesconfreportescertificaciones',
                    width: 350,
                    hidden: true,
                    dataIndex: 'idvariablesconfreportescertificaciones'
                },
                {header: 'plantilla', width: 350, hidden: true, dataIndex: 'plantilla'},
                {
                    header: 'idconfreportescertificaciones',
                    width: 350,
                    hidden: true,
                    dataIndex: 'idconfreportescertificaciones'
                },

            ],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group}'
            })
            /* bbar: new Ext.PagingToolbar({
             pageSize: 10,
             store: modelo.stArea,
             displayInfo: true
             })*/
        });

        this.tpEntradasalida = new Ext.TabPanel({
            width: '100%',
            region: 'center',
            height: 150,
            activeTab: 1,
            border: false,
            defaults: {autoHeight: true},
            items: [
                {
                    title: 'Entrada',
                    id: 'entrada',
                    layout: 'fit',
                    items: [this.gpEntrada]
                },
                {
                    title: 'Salida',
                    id: 'salida',
                    layout: 'fit',
                    items: [this.gpSalida]
                }
            ]
        });

        this.fpIndicadores = new Ext.form.FormPanel({
            width: '100%',
            height: 130,
            region: 'north',
            frame: true,
            labelWidth: 80,
            labelAlign: 'left',
            layout: 'column',
            items: [
                {
                    columnWidth: .30,
                    layout: 'form',
                    labelAlign: 'top',
                    items: [this.tfDenominacion]
                }, {
                    columnWidth: .35,
                    layout: 'form',
                    labelAlign: 'top',
                    items: [this.cbtipovalor]
                }, {
                    columnWidth: .35,
                    layout: 'form',
                    labelAlign: 'top',
                    items: [this.treeComboCamposNomina]
                }, {
                    columnWidth: .30,
                    layout: 'form',
                    labelAlign: 'top',
                    items: [this.nfieldLugaresDecimales]
                }, {
                    columnWidth: .15,
                    layout: 'form',
                    labelAlign: 'top',
                    items: [this.cbObligatorio]
                }, {
                    columnWidth: .15,
                    layout: 'form',
                    labelAlign: 'top',
                    items: [this.cbRecalculable]
                }, {
                    columnWidth: .15,
                    layout: 'form',
                    labelAlign: 'top',
                    items: [this.cbResultadoFinal]
                }, {
                    columnWidth: .15,
                    layout: 'form',
                    labelAlign: 'top',
                    items: [this.cbSumaDestajo]
                }
            ]
        })
        ;
        this.winIndicadores = new Ext.Window({
            closeAction: 'hide',
            layout: 'border',
            title: 'Adicionar Indicadores',
            width: 600,
            height: 400,
            modal: true,
            constrain: true,
            items: [this.fpIndicadores, this.tpEntradasalida],
            buttons: [this.btnCancelarindicadores, this.btnAplicarindicadores, this.btnAceptarindicadores],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarindicadores.handler();
                    }
                }, {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarindicadores.handler();
                    }
                }, {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicarindicadores.handler();
                    }
                }
            ]
        });

        this.smPagosxresultados = new Ext.grid.CheckboxSelectionModel(
            {
                singleSelect: false
            });

        this.gpPagosxresultados = new Ext.grid.GridPanel({
            region: 'west',
            split: true,
            collapsible: true,
            width: '100%',
            height: 300,
            title: 'Tipo de pagos',
            store: modelo.stPagosxresultados,
            loadMask: {msg: 'Por favor espere. Cargando datos ...'},
            sm: this.smPagosxresultados,
            columns: [this.smPagosxresultados,
                {header: 'Denominaci&oacute;n', width: 200, dataIndex: 'denominacion', renderer: colores},
                //{header: 'Referencia', width: 150, dataIndex: 'referencia', renderer: colores},
                {header: 'Estado', width: 190, dataIndex: 'estado', renderer: colores},
            ],
            /* stripeRows:true,
             viewConfig:{
             getRowClass : function (row, index) {
             var cls = '';
             //console.info(row.get('estado'));
             if(row.get('estado') == 1 ){
             cls = 'SinExp';
             }else{
             cls = 'Cancelado';
             }
             console.info(cls);
             return cls;
             }
             },*/

            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.stPagosxresultados,
                displayInfo: true
            }),
            tbar: [this.btnAdicionarpagos, this.btnEliminarpagos, this.btnreplicar,'->', this.btnGuardar, this.btnDesaprobar],
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        self.btnEliminarpagos.handler();
                    }
                }, {
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAdicionarpagos.handler();
                    }
                }, {
                    key: 'q',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnGuardar.handler();
                    }
                }, {
                    key: 'w',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnDesaprobar.handler();
                    }
                }

            ]
        });



        //Colorear el estado del tipo de pago
        function colores(val, metaData, record, rowIndex, colIndex, store) {
            var text = " ";

            if (val == 2) {
                val = "Aprobado";
            }
            else if (val == 1) {
                val = "Elaboraci&oacute;n";
            }
            if (record.get('estado') == 1) {
                return '<span style="color:#ff3158;">' + val + '</span>';
            }
            else if (record.get('estado') == 2) {
                return '<span style="color:#0e10ff;">' + val + '</span>';
            }

        };

        //Función auxiliar para centrar los valores del grid.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        //Función auxiliar para el campo obligatorio (Si/No)
        function fnObligatorio(val) {
            //return (val == 1) ? '<span style="color:#00AA33;">' + "Si" + '</span>' : '<span style="color:#ff3158;">' + "No" + '</span>';
            return (val == 1) ? '<center><img src="/lib/ExtJS/temas/default/images/iconos/cierresi.png" height=16 width=16 /></center>' :
                '<center><img src="/lib/ExtJS/temas/default/images/iconos/cierreno.png" height=16 width=16 /></center>';
            ;


        }
		
		function fnDestajo(val) {
            //return (val == 1) ? '<span style="color:#00AA33;">' + "Si" + '</span>' : '<span style="color:#ff3158;">' + "No" + '</span>';
            return (val == 1) ? 'Si' :'No';
        }

        //****Replicar
        this.btnAceptarEntidadreplicar = new Ext.Button({
            id: 'btnAceptarEntidadreplicar',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            disabled: true,
            iconCls: 'aceptar',
            handler: function () {
            }.createDelegate(this)
        });console.info(idestructurapadre);


        this.pobjestructurareplicar = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region: 'center',
            padre: 'ESTRUCTURACOMPLETA',
            nivel: 7,
            nivelachequear: [3,5]

        });

        this.winEstructurareplicar = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: 300,
            closable: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'fit',
            items: [this.pobjestructurareplicar],
            buttons: [this.btnAceptarEntidadreplicar]
        });

        this.smIndicadores = new Ext.grid.CheckboxSelectionModel(
            {
                singleSelect: true,

            });

        this.editorOrden = new Ext.form.NumberField({
            allowBlank: false,
            anchor: '100%',
            allowDecimals: false,
            allowNegative: false,
            maxLength: 2,
            maxValue: 99,
            minValue: 0,
            decimalPrecision: 0,
            nanText: 'Este valor es incorrecto.',
            blankText: 'Este campo es obligatorio.'
        });

        this.gpIndicadores = new Ext.grid.EditorGridPanel({
            region: 'center',
            width: '100%',
            height: 300,
            //split: true,
            //minSize: 300,
            //maxSize: 550,
            title: 'Listado de indicadores',
            store: modelo.stIndicadores,
            loadMask: {msg: 'Por favor espere. Cargando datos ...'},
            sm: this.smIndicadores,
            columns: [this.smIndicadores,
                {
                    header: 'idindicadorespagoresultado',
                    width: 250,
                    hidden: true,
                    dataIndex: 'idindicadorespagoresultado'
                },
                {header: 'idestructuramodelonomina', width: 150, hidden: true, dataIndex: 'idestructuramodelonomina'},
                {header: 'idvariablereporteentrada', width: 150, hidden: true, dataIndex: 'idreporteentrada'},
                {header: 'idvariablereportesalida', width: 150, hidden: true, dataIndex: 'idreportesalida'},
                {header: 'Denominaci&oacute;n', width: 110, dataIndex: 'denominacion'},
                {header: 'Reporte entrada', width: 250, dataIndex: 'entrada'},
                {header: 'Reporte salida', width: 250, dataIndex: 'salida'},
                {header: 'Orden', width: 50, dataIndex: 'orden', renderer: centrarValor, editor: this.editorOrden},
                {header: 'Tipo valor', width: 60, dataIndex: 'tipovalor', renderer: centrarValor},
                {header: 'denomcampoestmodnom', width: 10, hidden: true, dataIndex: 'denomcampoestmodnom'},
                {header: 'Campo de la n&oacute;mina', width: 160, dataIndex: 'denomtiponominacampo'},
                {header: 'Lugares decimales', width: 110, dataIndex: 'lugaresdecimales', renderer: centrarValor},
                {header: 'Obligatorio', width: 80, dataIndex: 'obligatorio', renderer: fnObligatorio},
                {header: 'Recalculable', width: 80, dataIndex: 'recalculable', renderer: fnObligatorio},
                {header: 'Resultado final', width: 80, dataIndex: 'resultadofinal', renderer: fnObligatorio},
                {header: 'Suma destajo', width: 80, dataIndex: 'sumadestajo', renderer: fnDestajo},
            ],
            tbar: [this.btnAdicionarIndicadores, this.btnModificarIndicadores, this.btnEliminarIndicadores, this.btnSubirfila, this.btnBajarfila, this.btnGuardarOrdenInd],
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {

                        self.Pvd.Nomina.Confpagoxresultados.Vista.btnEliminarIndicadores.events.click.listeners[0].fn();
                    }
                },
                {
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.Pvd.Nomina.Confpagoxresultados.Vista.btnAdicionarIndicadores.events.click.listeners[0].fn();
                    }
                },
                {
                    key: 'm',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.Pvd.Nomina.Confpagoxresultados.Vista.btnModificarIndicadores.events.click.listeners[0].fn();
                    }
                }

            ]
        });

        this.smArea = new Ext.grid.CheckboxSelectionModel(
            {
                singleSelect: false
            });

        this.gpArea = new Ext.grid.GridPanel({
            region: 'center',
            width: '50%',
            height: 50,
            title: 'Listado de cargos por &aacute;reas',
            store: modelo.stArea,
            loadMask: {msg: 'Por favor espere. Cargando datos ...'},
            sm: this.smArea,
            columns: [this.smArea,
                {header: 'area', hidden: true, width: 350, dataIndex: 'area'},
                {header: 'Denominaci&oacute;n', width: 350, dataIndex: 'denominacion'},
                {header: 'idarea', width: 350, hidden: true, dataIndex: 'idarea'},
                {header: 'idplantillanominalcargo', width: 350, hidden: true, dataIndex: 'idplantillanominalcargo'},
                {header: 'idcargo', width: 350, hidden: true, dataIndex: 'idcargo'},
                {header: 'idplantillanominal', width: 350, hidden: true, dataIndex: 'idplantillanominal'},

            ],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group}'
            })
            /* bbar: new Ext.PagingToolbar({
             pageSize: 10,
             store: modelo.stArea,
             displayInfo: true
             })*/
        });

        this.smAreaI = new Ext.grid.CheckboxSelectionModel(
            {
                singleSelect: false
            });

        this.gpAreaI = new Ext.grid.GridPanel({
            region: 'west',
            split: true,
            collapsible: true,
            width: '100%',
            autoHeight: true,
            autoScroll: true,
            title: 'Listado de cargos por &aacute;reas incluidos',
            store: modelo.stAreaI,
            loadMask: {msg: 'Por favor espere. Cargando datos ...'},
            sm: this.smAreaI,
            columns: [this.smAreaI,
                {header: 'area', hidden: true, width: 350, dataIndex: 'area'},
                {header: 'Denominaci&oacute;n', width: 350, dataIndex: 'denominacion'},
                {header: 'idarea', width: 350, hidden: true, dataIndex: 'idarea'},
                {header: 'idpagoporresultado', width: 350, hidden: true, dataIndex: 'idpagoporresultado'},
                {header: 'idcargo', width: 350, hidden: true, dataIndex: 'idcargo'},
                {header: 'idcargopagoresultado', width: 350, hidden: true, dataIndex: 'idcargopagoresultado'},

            ],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group}'
            }),
            tbar: [this.btnAdicionarCargos, this.btnEliminarCargos, '->', this.btnAyuda],
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {

                        self.Pvd.Nomina.Confpagoxresultados.Vista.btnEliminarCargos.events.click.listeners[0].fn();
                    }
                },
                {
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.Pvd.Nomina.Confpagoxresultados.Vista.btnAdicionarCargos.events.click.listeners[0].fn();
                    }
                }

            ]
            //bbar:['->',this.btnGuardar]
            /* bbar: new Ext.PagingToolbar({
             pageSize: 10,
             store: modelo.stArea,
             displayInfo: true
             })*/
        });

        this.tpAreas = new Ext.tree.TreePanel({
            region: 'west',
            title: 'Listado de áreas',
            width: '40%',
            split: false,
            rootVisible: false,
            border: false,
            loader: modelo.streeAreas,
            root: new Ext.tree.AsyncTreeNode({
                text: 'Areas',
                // checked :false,
                id: 'root'
            }),

            // tbar: [this.tfBuscarN, this.btnBuscarN, this.btnLimpiarN, this.btnExpandirN, this.btnCollapseN],
            height: 50
        });

        this.smNomTipopago = new Ext.grid.CheckboxSelectionModel(
            {
                singleSelect: false
            });

        this.winAddcargosporarea = new Ext.Window({
            closeAction: 'hide',
            layout: 'border',
            title: 'Adicionar cargos por &aacute;rea',
            width: 650,
            height: 400,
            modal: true,
            constrain: true,
            items: [this.tpAreas, this.gpArea],
            buttons: [this.btnCancelarcargos, this.btnAplicarcargos, this.btnAceptarcargos],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarcargos.handler();
                    }
                }, {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarcargos.handler();
                    }
                }, {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicarcargos.handler();
                    }
                }
            ]
        });

        this.tfReferencia = new Ext.form.TextField({
            name: 'tfreferencia',
            fieldLabel: 'SBC1',
            width: '90%',
            id: 'idreferencia',
            allowBlank: false,
            // maxLength: 6, //regex, regexText, maskRe
            // maxLengthText :'El tama&ntilde;o m&aacute;ximo requerido es 6 caracteres.'
        });

        this.gpNomTipopago = new Ext.grid.EditorGridPanel({
            region: 'center',
            width: '50%',
            height: 50,
            title: 'Listado de tipos de pagos',
            store: modelo.stNomTipopago,
            loadMask: {msg: 'Por favor espere. Cargando datos ...'},
            sm: this.smNomTipopago,
            columns: [this.smNomTipopago,
                {header: 'Denominaci&oacute;n', width: 350, dataIndex: 'denominacion'},
                {header: 'Referencia', width: 200, sortable: true, dataIndex: 'referencia', editor: this.tfReferencia}
            ]
            /* bbar: new Ext.PagingToolbar({
             pageSize: 10,
             store: modelo.stArea,
             displayInfo: true
             })*/
        });

        this.winAddtipopago = new Ext.Window({
            closeAction: 'hide',
            layout: 'fit',
            title: 'Adicionar tipo de pago',
            width: 450,
            height: 400,
            modal: true,
            constrain: true,
            items: [this.gpNomTipopago],
            buttons: [this.btnCancelar, this.btnAplicar, this.btnAceptar],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptar.handler();
                    }
                }, {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelar.handler();
                    }
                }, {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicar.handler();
                    }
                }
            ]
        });

        //Formulas de indicadores
        //Boton para limpiar las formulas de un periodo de pago
        this.btnLimpiarFormulas = new Ext.Button({
            id: 'idbtnEliminarRetencHist',
            text: 'Limpiar',
            tooltip: 'Limpiar f&oacute;rmulas',
            iconCls: 'limpiar',
            disabled: true
        });

        //Text Areas para definir las formulas
        this.taFormulaIndicador = new Ext.form.TextArea({
            id: 'idTaFormulaIndicador', fieldLabel: idioma.lbTitleTaFormulaIndicador,
            name: 'formulaindicador', allowBlank: true,
            anchor: '99%',
            height: 280,
            disabled: true,
            blankText: idioma.lbErrorCampoVacio
        });

        this.taFormulaSumatoria = new Ext.form.TextArea({
            id: 'idTaFormulaSumatoria', fieldLabel: idioma.lbTitleTaFormulaSumatoria,
            name: 'formulasumatoria', allowBlank: true,
            anchor: '99%',
            height: 280,
            disabled: true,
            blankText: idioma.lbErrorCampoVacio
        });

        //Formulario de formulas.
        this.formFormulas = new Ext.FormPanel({
            title: 'F&oacute;rmulas',
            id: 'idformFormulas',
            frame: true,
            region: 'center',
            width: '100%',
            //height: 370,
            autoHeight: true,
            labelAlign: 'top',
            border: true,
            tbar: [' ', ' ', this.btnLimpiarFormulas],
            items: [{
                layout: 'column',
                bodyStyle: {
                    padding: '10px 10px 10px 10px'
                },
                items: [
                    {columnWidth: .5, layout: 'form', items: [this.taFormulaIndicador]},
                    {columnWidth: .5, layout: 'form', items: [this.taFormulaSumatoria]}
                ]
            }]
        });

        //Paneles Izquierdo y Central
        this.PanelIzquierdo = new Ext.Panel({
            region: 'west',
            split: true,
            collapsible: true,
            height: '100%',
            width: '30%',
            autoScroll: true,
            items: [
                this.gpPagosxresultados,
                this.gpAreaI
            ]
        });

        this.PanelCentral = new Ext.Panel({
            region: 'center',
            split: true,
            height: 300,
            width: '70%',
            autoScroll: true,
            items: [
                this.gpIndicadores,
                this.formFormulas
            ]
        });

        /*
         * Ventana general
         */
        /*this.winMostrarConfPagoResultados = new Ext.Window({
            title      : '',
            modal      : true,
            height     : 600,
            width      : 800,
            closeAction: 'hide',
            constrain  : true,
            maximized  : true,
            closable   : true,
            resizable  : false,
            layout     : 'border',
            items      : [this.PanelIzquierdo, this.PanelCentral]
        });*/

        new Ext.Viewport({
            layout: 'border',
            items: [
                this.PanelIzquierdo,
                this.PanelCentral
            ]
        });
    }
}
