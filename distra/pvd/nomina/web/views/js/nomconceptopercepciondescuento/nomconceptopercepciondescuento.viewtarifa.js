Ext.ns('Pvd.Nomina.Nomencladores.ConceptoPD');

Ext.QuickTips.init();

//Vista de gestionar tarifas de conceptos del componente Nomenclador de conceptos de percepciones y descuentos.
Pvd.Nomina.Nomencladores.ConceptoPD.VistaTarifa = {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomenclador de conceptos de percepciones y descuentos(Tipo: Pvd.Nomina.Nomencladores.ConceptoPD.Modelo).
     */
    init: function (perfil, idioma, modelo) {
        var self = this;
        //Botones de Add, Mod, Elim tarifas.
        this.btnAdicionarTarifa = new Ext.Button({
            id: 'idbtnAdicionarTarifa',
            text: idioma.lbBtnAdicionar,
            tooltip: idioma.textToolTipAddTarifa,
            // icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar',
            prevTab: 'idbtnEliminarTarifa',
            nextTab: 'idbtnModificarTarifa',
        });

        this.btnModificarTarifa = new Ext.Button({
            id: 'idbtnModificarTarifa',
            text: idioma.lbBtnModificar,
            tooltip: idioma.textToolTipModTarifa,
            //icon: perfil.dirImg+'modificar.png',
            iconCls: 'modificar',
            prevTab: 'idbtnAdicionarTarifa',
            nextTab: 'idbtnEliminarTarifa',
        });

        this.btnEliminarTarifa = new Ext.Button({
            id: 'idbtnEliminarTarifa',
            text: idioma.lbBtnEliminar,
            tooltip: idioma.textToolTipElimTarifa,
            // icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar',
            prevTab: 'idbtnModificarTarifa',
            nextTab: 'idbtnAdicionarTarifa',
        });

        //Listado de tarifas asociadas a conceptos.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        this.smTarifa = new Ext.grid.RowSelectionModel({
            singleSelect: true,
        });

        this.gpTarifa = new Ext.grid.GridPanel({
            id: 'idgpTarifa',
            title: idioma.lbTitleTarifa,
            region: 'center',
            columns: [{header: 'idconceptopdtarifa', hidden: true, hideable: false, dataIndex: 'idconceptopdtarifa'}
                , {header: idioma.lbColTarifa, width: 200, fixed: true, sortable: true, dataIndex: 'denomtarifa'}
                , {
                    header: '<center>' + idioma.lbColFormaCalculo + '</center>',
                    fixed: true,
                    width: 100,
                    sortable: true,
                    dataIndex: 'denomformacalculo',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + idioma.lbColImporteFormula + '</center>',
                    width: 100,
                    sortable: true,
                    dataIndex: 'importeformula',
                    renderer: centrarValor
                }
                , {
                    header: '<center>' + idioma.lbColLugaresDecimalesGrid + '</center>',
                    width: 45,
                    sortable: true,
                    dataIndex: 'lugaresdecimales',
                    renderer: centrarValor
                }

            ],
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: modelo.storeTarifa,
            sm: this.smTarifa,
            loadMask: {msg: idioma.lbMaskGridCargando},
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnEliminarTarifa.disabled) {
                            self.btnEliminarTarifa.handler();
                        }
                    }
                }, {
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAdicionarTarifa.disabled) {
                            self.btnAdicionarTarifa.handler();
                        }
                    }
                }, {
                    key: 'm',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnModificarTarifa.disabled) {
                            self.btnModificarTarifa.handler();
                        }
                    }
                }
            ]
        });

        //Campos del formulario de tarifas.
        this.cbTarifas = new Ext.form.ComboBox({
            id: 'idcbTarifas', fieldLabel: idioma.lbColTarifa,
            valueField: 'idtarifa', prevTab: 'idbtnAceptarTarifa',
            nextTab: 'idcbFormaCalculoTarifa',
            displayField: 'denominacion', hiddenName: 'idtarifa',
            allowBlank: false, mode: 'local',
            store: modelo.storeNomTarifa, emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '90%'
        });

        this.cbFormaCalculoTarifa = new Ext.form.ComboBox({
            id: 'idcbFormaCalculoTarifa', fieldLabel: idioma.lbColFormaCalculo,
            valueField: 'idformacalculo',
            displayField: 'denominacion', hiddenName: 'idformacalculo',
            allowBlank: false, mode: 'local',
            store: modelo.storeFormaCalculo, emptyText: 'Seleccione...',
            blankText: idioma.lbErrorCampoVacio, readOnly: true,
            triggerAction: 'all', anchor: '90%'
        });

        this.tfImporteFormula = new Ext.form.TextField({
            id: 'idtfImporteFormula', fieldLabel: idioma.lbColImporteFormula,
            name: 'importeformula', allowBlank: false,
            anchor: '95%', prevTab: 'idcbFormaCalculoTarifa',
            nextTab: 'idnfCantidadLugaresDecimales',
            blankText: idioma.lbErrorCampoVacio,
            maxLength: 255,
            maxLengthText: idioma.lbErrorCampoVacio,
            /*minLength:idioma.lbErrorCampoVacio,
             minLengthText:idioma.lbErrorCampoVacio,
             maskRe:idioma.lbErrorCampoVacio,
             regex:idioma.lbErrorCampoVacio,
             regexText:idioma.lbErrorCampoVacio*/
        });

        this.nfCantidadLugaresDecimales = new Ext.form.NumberField({
            id: 'idnfCantidadLugaresDecimales', fieldLabel: idioma.lbColLugaresDecimales,
            name: 'lugaresdecimales', //allowBlank: false,
            anchor: '99%', prevTab: 'idtfImporteFormula', nextTab: 'idbtnCancelarTarifa',
            disabled: true, maxLength: 2 //blankText:idioma.lbErrorCampoVacio,
            /*maxLength:idioma.lbErrorCampoVacio,
             maxLengthText:idioma.lbErrorCampoVacio,
             minLength:idioma.lbErrorCampoVacio,
             minLengthText:idioma.lbErrorCampoVacio,
             maskRe:idioma.lbErrorCampoVacio,
             regex:idioma.lbErrorCampoVacio,
             regexText:idioma.lbErrorCampoVacio*/
        });

        //Formulario de tarifas.
        this.formularioTarifa = new Ext.FormPanel({
            id: 'idformularioTarifa',
            labelAlign: 'top',
            frame: true,
            width: 600,
            autoHeight: true,
            bodyStyle: {
                padding: '10px 10px 10px 10px',
                marging: '10px 10px 10px 10px',
            },
            items: [{
                layout: 'column',
                items: [
                    {columnWidth: .3, layout: 'form', items: [this.cbTarifas]},
                    {columnWidth: .2, layout: 'form', items: [this.cbFormaCalculoTarifa]},
                    {columnWidth: .3, layout: 'form', items: [this.tfImporteFormula]},
                    {columnWidth: .2, layout: 'form', items: [this.nfCantidadLugaresDecimales]}
                ]
            }],
        });

        //Botones de la ventana de adicionar/modificar tarifas.
        this.btnCancelarTarifa = new Ext.Button({
            id: 'idbtnCancelarTarifa',
            iconCls: 'cancelar',
            // icon:perfil.dirImg+'cancelar.png',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.textToolTipCancelar,
            prevTab: 'idtfImporteFormula',
            nextTab: 'idbtnAplicarTarifa',
        });

        this.btnAplicarTarifa = new Ext.Button({
            id: 'idbtnAplicarTarifa',
            iconCls: 'aplicar',
            //  icon:perfil.dirImg+'aplicar.png',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.textToolTipAplicar,
            prevTab: 'idbtnCancelarTarifa',
            nextTab: 'idbtnAceptarTarifa',
        });

        this.btnAceptarTarifa = new Ext.Button({
            id: 'idbtnAceptarTarifa',
            iconCls: 'aceptar',
            // icon:perfil.dirImg+'aceptar.png',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.textToolTipAceptar,
            prevTab: 'idbtnAplicarTarifa',
            nextTab: 'idcbTarifas',
        });

        //Ventana de adicionar y modificar tarifas.
        this.ventanaTarifa = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            autoHeight: true,
            autoValidate: true,
            validateDefault: true,
            closable: true,
            constrain: true,
            resizable: false,
            layout: 'fit',
            items: [this.formularioTarifa],
            buttons: [this.btnCancelarTarifa, this.btnAplicarTarifa, this.btnAceptarTarifa],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarTarifa.handler();
                    }
                }, {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarTarifa.handler();
                    }
                }, {
                    key: 'p',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAplicarTarifa.handler();
                    }
                }
            ]
        });
    }
};