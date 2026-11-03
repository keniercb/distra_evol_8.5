Ext.ns('Pvd.Nomina.Nomencladores.ConceptoPD');

Ext.QuickTips.init();

//Vista de gestionar conceptos del componente Nomenclador de conceptos de percepciones y descuentos.
Pvd.Nomina.Nomencladores.ConceptoPD.VistaConcepto = {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de conceptos de percepciones y descuentos(Tipo: Pvd.Nomina.Nomencladores.ConceptoPD.Modelo).
     */
    init: function (perfil, idioma, modelo) {
        var self = this;
        //Botones de Add, Mod, Elim conceptos de percepciones y descuentos.
        this.btnAdicionarConcepto = new Ext.Button({
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddConcepto,
            //icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'idbtnEliminarConcepto',
            nextTab: 'idbtnModificarConcepto',
        });

        this.btnModificarConcepto = new Ext.Button({
            id: 'idbtnModificarConcepto',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModConcepto,
            //  icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'idbtnAdicionarConcepto',
            nextTab: 'idbtnEliminarConcepto',
        });

        this.btnEliminarConcepto = new Ext.Button({
            id: 'idbtnEliminarConcepto',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimConcepto,
            //  icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'idbtnModificarConcepto',
            nextTab: 'idbtnAdicionarConcepto',
        });

        this.btnAyudaConcepto = new Ext.Button({
            id: 'btnAyudaConcepto',
            text: 'Ayuda',
            tooltip: 'Ayuda',
            //  icon: perfil.dirImg+'ayuda.png',
            iconCls: 'ayuda',
            prevTab: 'idbtnModificarConcepto',
            nextTab: 'idbtnAdicionarConcepto',

        });

        this.tfbuscar = new Ext.form.TextField({
            id: 'tfbuscar',
            allowBlank: true,
            minLength: 1,
            enableKeyEvents: true,
            regexp: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            width: 120,
            emptyText: 'Criterio a buscar',
            name: 'tfbuscador'
        });
        this.btnBuscar = new Ext.Button({
            disabled: false,
            id: 'btnBuscar',
            iconCls: 'buscar',
            text: '<u>B</u>uscar',
            tooltip: 'Buscar conceptos <b>(Alt+B)</b>',
            handler: function () {
                this.Buscar();
            }
        });

        //Listado de conceptos de percepciones y descuentos.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.expanderConcepto = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ), enableCaching: false
        });

        this.smConcepto = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.gpConcepto = new Ext.grid.GridPanel({
            id: 'idgpConcepto',
            title: idioma.lbTitleConcepto,
            region: 'center',
            columns: [
                {
                    header: 'idconceptopercepciondescuento',
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idconceptopercepciondescuento'
                }
                ,
                this.expanderConcepto
                ,
                {
                    header: '<center>' + idioma.lbColAbreviatura + '</center>',
                    fixed: true,
                    width: 75,
                    sortable: true,
                    dataIndex: 'abreviatura',
                    renderer: centrarValor
                }
                ,
                {header: idioma.lbColDenominacion, width: 500, sortable: true, dataIndex: 'denominacion'}
                ,
                {
                    header: '<center>' + idioma.lbColDesde + '</center>',
                    fixed: true,
                    width: 85,
                    sortable: true,
                    dataIndex: 'fechainicio',
                    renderer: centrarValor
                }
                ,
                {
                    header: '<center>' + idioma.lbColHasta + '</center>',
                    fixed: true,
                    width: 85,
                    sortable: true,
                    dataIndex: 'fechafin',
                    renderer: centrarValor
                }
                ,
                {
                    header: '<center>' + idioma.lbColFomula + '</center>',
                    width: 200,
                    sortable: true,
                    dataIndex: 'expresionamostrar',
                    renderer: centrarValor
                }
                ,
                {header: idioma.lbColTipoConcepto, hidden: true, hideable: false, dataIndex: 'tipoconcepto'},
                {header: '', hidden: true, hideable: false, dataIndex: 'esdescuentoaplicarunaves'},
                {header: '', hidden: true, hideable: false, dataIndex: 'idexpresionmatematica'},
            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            plugins: this.expanderConcepto,
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text}'
            }),
            store: modelo.storeConcepto,
            sm: this.smConcepto,
            loadMask: {msg: idioma.lbMaskGridCargando},
            bbar: new Ext.PagingToolbar({
                pageSize: 1000,
                store: modelo.storeConcepto,
                displayInfo: true
            }),
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnEliminarConcepto.disabled) {
                            self.btnEliminarConcepto.handler();
                        }
                    }
                }, {
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAdicionarConcepto.disabled) {
                            self.btnAdicionarConcepto.handler();
                        }
                    }
                }, {
                    key: 'm',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnModificarConcepto.disabled) {
                            self.btnModificarConcepto.handler();
                        }
                    }
                }, {
                    key: 'b',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnBuscar.disabled) {
                            self.btnBuscar.handler();
                        }
                    }
                }
            ]
        });

        //Campo del formulario de conceptos.
        this.tfAbrevConcepto = new Ext.form.TextField({
            id: 'idtfAbrevConcepto', fieldLabel: idioma.lbColAbreviatura,
            name: 'abreviatura', allowBlank: false,
            anchor: '90%', prevTab: 'idbtnAceptarConcepto',
            nextTab: 'idtfDenomConcepto',
            vtype: 'vtabrev',
            blankText: idioma.lbErrorCampoVacio,
            /*maxLength:idioma.lbErrorCampoVacio,
             maxLengthText:idioma.lbErrorCampoVacio,
             minLength:idioma.lbErrorCampoVacio,
             minLengthText:idioma.lbErrorCampoVacio,
             maskRe:idioma.lbErrorCampoVacio,
             regex:idioma.lbErrorCampoVacio,
             regexText:idioma.lbErrorCampoVacio*/
        });

        this.tfDenomConcepto = new Ext.form.TextField(
            {
                id: 'idtfDenomConcepto',
                fieldLabel: idioma.lbColDenominacion,
                name: 'denominacion',
                allowBlank: false,
                anchor: '99%',
                vtype: 'vtusername',
                maxLength: 100,
                blankText: idioma.lbErrorCampoVacio
                /*maxLength:idioma.lbErrorCampoVacio,
                 maxLengthText:idioma.lbErrorCampoVacio,
                 minLength:idioma.lbErrorCampoVacio,
                 minLengthText:idioma.lbErrorCampoVacio,
                 maskRe:idioma.lbErrorCampoVacio,
                 regex:idioma.lbErrorCampoVacio,
                 regexText:idioma.lbErrorCampoVacio*/
            });

        this.cbTipoConcepto = new Ext.form.ComboBox({
            id: 'idcbTipoConcepto', fieldLabel: idioma.lbColTipoConcepto,
            valueField: 'idtipoconceptopd',
            displayField: 'denominacion', hiddenName: 'idtipoconceptopd',
            allowBlank: false, mode: 'local',
            store: modelo.storeTipoConcepto, emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '90%'
        });

        this.dfFInicioConcepto = new Ext.form.DateField({
            id: 'dfFInicioConcepto', fieldLabel: idioma.lbColDesde,
            name: 'fechainicio', allowBlank: false,
            format: 'd/m/Y', editable: true, readOnly: false,
            value: new Date().format('d/m/Y'), maxText: idioma.lbFechaMaxima,
            minText: idioma.lbFechaMinima, blankText: idioma.lbErrorCampoVacio,
            invalidText: idioma.invalidTextFecha, vtype: 'daterange',
            anchor: '90%', endDateField: 'dfFFinConcepto'
        });

        this.dfFFinConcepto = new Ext.form.DateField({
            id: 'dfFFinConcepto', fieldLabel: idioma.lbColHasta,
            name: 'fechafin', xtype: 'datefield', allowBlank: true,
            format: 'd/m/Y', editable: true, readOnly: false,
            maxText: idioma.lbFechaMaxima, minText: idioma.lbFechaMinima,
            blankText: idioma.lbErrorCampoVacio, invalidText: idioma.invalidTextFecha,
            vtype: 'daterange', anchor: '99%', startDateField: 'dfFInicioConcepto'
        });

        this.tfDescripConcepto = new Ext.form.TextArea({
            id: 'idtfDescripConcepto',
            fieldLabel: idioma.lbColDescripcion,
            name: 'descripcion', allowBlank: true,
            hiddenname: 'descripcion', maxLength: 250,
            vtype: 'vtdescripcion',
            anchor: '99%', prevTab: 'dfFFinConcepto', nextTab: 'idbtnCancelarConcepto',
            blankText: idioma.lbErrorCampoVacio,

            /*maxLength:idioma.lbErrorCampoVacio,
             maxLengthText:idioma.lbMaxText_225,
             minLength:idioma.lbErrorCampoVacio,
             minLengthText:idioma.lbErrorCampoVacio,
             maskRe:idioma.lbErrorCampoVacio,
             regex:idioma.lbErrorCampoVacio,
             regexText:idioma.lbErrorCampoVacio*/
        });

        /************************************formula******************************/
        this.tfFormula = new Ext.form.TextField({
            id: 'idtfFormula',
            fieldLabel: 'Fórmula',
            disabled: true,
            name: 'expresionamostrar',
            id: 'tfFormula',
            allowBlank: false,
            anchor: '95%',
            prevTab: 'idcbFormaCalculoTarifa',
            nextTab: 'idnfCantidadLugaresDecimales',
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 255,
            maxLengthText: idioma.lbErrorCampoVacio
        });

        this.checkEsDescuento = new Ext.form.Checkbox({
            id: 'checkEsDescuento',
            fieldLabel: 'Es descuento a aplicar',
            name: 'esdescuentoaplicarunaves'


        });
        /************************************formula******************************/

        //Formulario de conceptos.
        this.formularioConcepto = new Ext.FormPanel({
            id: 'idformlarioConcepto',
            labelAlign: 'top',
            frame: true,
            width: 380,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
            },
            items: [
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .28, layout: 'form', items: [this.tfAbrevConcepto]},
                        {columnWidth: .72, layout: 'form', items: [this.tfDenomConcepto]},
                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {columnWidth: .4, layout: 'form', items: [this.cbTipoConcepto]},
                        {columnWidth: .3, layout: 'form', items: [this.dfFInicioConcepto]},
                        {columnWidth: .3, layout: 'form', items: [this.dfFFinConcepto]}
                    ]
                }, {
                    layout: 'column',
                    items: [
                        {columnWidth: .3, layout: 'form', items: [this.checkEsDescuento]},
                        {columnWidth: .7, layout: 'form', items: [this.tfFormula]}


                    ]
                },
                this.tfDescripConcepto
            ]
        });

        //Botones de la ventana de adicionar conceptos.
        this.btnCancelarConcepto = new Ext.Button({
            id: 'idbtnCancelarConcepto',
            iconCls: 'cancelar',
            // icon:perfil.dirImg+'cancelar.png',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfDescripConcepto',
            nextTab: 'idbtnAplicarConcepto',
        });

        this.btnAplicarConcepto = new Ext.Button({
            id: 'idbtnAplicarConcepto',
            iconCls: 'aplicar',
            // icon:perfil.dirImg+'aplicar.png',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarConcepto',
            nextTab: 'idbtnAceptarConcepto',
        });

        this.btnAceptarConcepto = new Ext.Button({
            id: 'idbtnAceptarConcepto',
            iconCls: 'aceptar',
            // icon:perfil.dirImg+'aceptar.png',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarConcepto',
            nextTab: 'idtfAbrevConcepto',
        });

        //Ventana de adicionar y modificar conceptos.
        this.ventanaConcepto = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            closable: true,
            autoValidate: true,
            validateDefault: true,
            resizable: false,
            layout: 'fit',
            constrain: true,
            items: [this.formularioConcepto],
            buttons: [this.btnCancelarConcepto, this.btnAplicarConcepto, this.btnAceptarConcepto],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarConcepto.handler();
                    }
                },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarConcepto.handler();
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicarConcepto.handler();
                    }
                }
            ]
        });

    }
};