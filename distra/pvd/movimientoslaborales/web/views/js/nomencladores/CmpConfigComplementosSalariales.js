
/*
 * Componente ComplementosSalariales.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.MovimientosLaborales
 * @uses Pvd.MovimientosLaborales.ComplementosSalariales
 * @copyright XETID
 * @version 1.0
 */ 
 
Ext.ns("Pvd.MovimientosLaborales.ComplementosSalariales");
Pvd.MovimientosLaborales.ComplementosSalariales = Ext.extend(Ext.Panel,{
    layout: 'border',
    id: 'configcomplementos',
    title: 'Complementos salariales',
    region: 'center',
    height: '100%',
    closable: true,
    iconCls: '',
    initComponent: function () {
        //Variables
        var self = this;
        var idconceptosalarial;
        //Botón ayuda
        this.btnAyuda = new Ext.Button({
            id: 'idbtnAyudaComplementossalariales',
            text: this.idioma.BtnAyuda,
            tooltip: self.idioma.textToolTipAyuda,
            iconCls: 'ayuda'
        });

        //Botón para Guardar.
        this.btnGuardar = new Ext.Button({
            text: 'Guardar',
            disabled: true,
            tooltip: 'Guardar configuración <b>(Alt+G)</b>',
            iconCls: 'guardar',
            handler: function ()
            {
                guardarConfig();
            }.createDelegate(this)
        });

        this.btnModificar = new Ext.Button({
            id: 'btnUpd',
            text: 'Modificar',
            disabled: true,
            tooltip: 'Modificar denominaci&oacute;n del complemento salarial',
            iconCls: 'modificar',
            handler: function () {
                self.ventanaGestion.show();
            }.createDelegate(this)
        });

        //textfield denominacion
        this.tfdenom = new Ext.form.TextField({
            fieldLabel: 'Denominaci&oacute;n',
            allowBlank: false,
            maxLength: 255,
            enableKeyEvents: true,
            anchor: '99%',
            name: 'denominacion'
        });

        this.formMod = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.tfdenom]
                    }]
            }]
        });

        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: this.idioma.textToolTipCancelar,
            text: this.idioma.lbtnCancelar,
            handler: function () {
                self.formMod.getForm().reset();
                self.ventanaGestion.hide();
            }.createDelegate(this)
        });

        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: this.idioma.textToolTipAceptar,
            text: this.idioma.lbtnAceptar,
            handler: function () {
                if (self.formMod.getForm().isValid()) {
                    Ext.Ajax.request({
                        url: 'updateComplementosFijos',
                        params: {
                            idconceptosalarial: self.gpComplementos.getSelectionModel().getSelected().id,
                            denominacion: self.tfdenom.getValue()
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData != false) {
                                mostrarMensaje(1, 'La denominación fue modificada satisfactoriamente.');
                                self.ventanaGestion.hide();
                                self.formMod.getForm().reset();
                                self.stComplementos.removeAll();
                                self.stComplementos.reload();
                            } else
                                mostrarMensaje(6, 'Los datos no se guardaron correctamente.');
                        }
                    });
                }
            }.createDelegate(this)
        });

        this.ventanaGestion = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 300,
            height: 130,
            items: [this.formMod],
            buttons: [
                this.btnCancelar,
                this.btnAceptar
            ],
            listeners: {
                'beforeshow': function () {
                    self.tfdenom.setValue(self.gpComplementos.getSelectionModel().getSelected().data.denominacion);
                }
            },
            keys: [{
                key: 'x',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnCancelar.disabled) {
                        self.btnCancelar.handler();
                    }
                }
            },
                {
                    key: 13,
                    //stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptar.disabled) {
                            self.btnAceptar.handler();
                        }
                    }
                }]
        });

        //Fuente de datos del listado de complementos fijos.
        this.stComplementos = new Ext.data.Store({
            url: 'getComplementosFijos',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idconceptosalarial", totalProperty: "cantidad"},
                [{name:'idconceptosalarial'},{name:'denominacion'}, {name: 'rt'}]
            ),
            listeners: {
                load: function () {
                    if (self.stComplementos.getCount() > 0) {
                        self.gpComplementos.getSelectionModel().selectFirstRow();
                    }
                }
            }
        });

        this.stComplementos.load();

        this.smComplementos = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true,
            listeners: {
                selectionchange: function (sm) {
                    if (sm.hasSelection()) {
                        self.btnGuardar.enable();
                        if (self.gpComplementos.getSelectionModel().getSelected().data.rt == 1) {
                            self.btnModificar.enable();
                        } else {
                            self.btnModificar.disable();
                        }
                    } else {
                        self.btnGuardar.disable();
                        self.btnModificar.disable();
                    }
                }.createDelegate(this)
            }
        });

        //Listado de complementos salariales fijos.
        this.gpComplementos = new Ext.grid.GridPanel({
            title: 'Listado de complementos salariales',
            store: this.stComplementos,
            loadMask: {msg: 'Cargando...'},
            width: '50%',
            region: 'center',
            sm: this.smComplementos,
            columns: [ this.smComplementos,
                {
                    header: this.idioma.lbDenominacion,
                    width:500,
                    dataIndex: 'denominacion',
                    renderer: function (v, m, r) {
                        if (r.get('rt') == 1) {
                            m.attr = 'ext:qtip="Registro de datos principales"';
                            return '<span><i>' + v + '</i></span>';
                        } else {
                            return v;
                        }
                    }
                }
            ]
        });

        this.gpComplementos.getSelectionModel().on('rowselect', function (n) {
            idconceptosalarial = n.getSelected().data.idconceptosalarial;
            this.stCompNomina.reload();
        }, this);

        this.gpComplementos.getSelectionModel().on('rowdeselect', function (n) {
            self.gpCompNomina.getSelectionModel().clearSelections();
        }, this);

        //Fuente de datos del listado.
        this.stCompNomina = new Ext.data.Store({
            url: 'getComplementosNomina',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idconceptopercepciondescuento", totalProperty: "cantidad"},
                [{name:'idconceptopercepciondescuento'},{name:'denominacion'}]
            ),
            listeners: {
                load: function () {
                    self.btnGuardar.disable();
                    self.gpCompNomina.getSelectionModel().clearSelections();
                    if (self.gpComplementos.getSelectionModel().getSelected()) {
                        Ext.Ajax.request({
                            url: 'getConceptosByIdConfiguracion',
                            params: {idconceptosalarial:idconceptosalarial},
                            callback: function (){
                            },
                            success: function (r){
                                var responseData = Ext.decode(r.responseText);
                                var objrec = [];
                                for (i=0; i<responseData.length; i++) {
                                    var obj = self.stCompNomina.getById(responseData[i].idconceptosalarialnomina);
                                    objrec.push(obj);
                                }
                                self.smCompNomina.selectRecords(objrec);
                            }
                        });
                    }
                }
            }
        });

        this.smCompNomina = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                selectionchange: function (sm) {
                    self.btnGuardar.enable();
                }.createDelegate(this)
            }
        });

        //Listado de periodos.
        this.gpCompNomina = new Ext.grid.GridPanel({
            title: 'Listado de conceptos salariales de la nómina',
            loadMask: {msg: 'Cargando...'},
            width: '50%',
            region: 'east',
            store: this.stCompNomina,
            sm: this.smCompNomina,
            columns: [this.smCompNomina,
                {
                    header: this.idioma.lbDenominacion,
                    width:500,
                    dataIndex: 'denominacion'
                }
            ]/*,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stCompNomina,
                displayInfo: true
            }) */
        });

        this.tbar = [this.btnModificar, '->', this.btnGuardar, this.btnAyuda];
        this.items = [this.gpComplementos, this.gpCompNomina];

        this.on('render', function ()
        {
            self.btnGuardar.focus();
        });

		function guardarConfig()
        {
            var arrayconceptos = new Array();
            var select = self.gpCompNomina.getSelectionModel().getSelections();
            for (i = 0; i<select.length;i++) {
                arrayconceptos.push(select[i].data.idconceptopercepciondescuento);//antes estaba idconceptosalarialnomina
            }
            Ext.Ajax.request({
                url: 'guardarConfiguracionComplementos',
                params: {
                    idconceptosalarial: idconceptosalarial,
                    conceptos: Ext.encode(arrayconceptos)
                },
                success: function (r){
                    var responseData = Ext.decode(r.responseText);
                    if (responseData != false) {
                        mostrarMensaje(1, 'La configuración ha sido guardada satisfactoriamente');
                        self.stCompNomina.removeAll();
                    } else {
                        mostrarMensaje(6, 'Alguno(s) de los conceptos salariales de la nómina ya se encuentra(n) asociado(s). ');
                    }
                    self.stCompNomina.reload();
                }
            });
        }


        this.keys = [
            {
                key: 'g',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnGuardar.disabled) {
                        self.btnGuardar.handler();
                    }
                }
            },
            {
                key: 'h',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnAyuda.disabled) {
                        self.btnAyuda.handler();
                    }
                }
            }
        ];

        Pvd.MovimientosLaborales.ComplementosSalariales.superclass.initComponent.call(this);
    }
});
