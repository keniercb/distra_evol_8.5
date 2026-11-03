
/*
 * Componente Sistema.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.SST
 * @uses Pvd.Sst.Riesgo.Configuracion.Nomencladores.Sistema
 * @copyright XETID
 * @version 1.0
 */ 
 
Ext.ns("Pvd.Sst.Riesgo.Configuracion.Nomencladores.Sistema");
Pvd.Sst.Riesgo.Configuracion.Nomencladores.Sistema = Ext.extend(Ext.Panel,{
    layout: 'border',
    border: false,
    id: 'sistema',
    title: 'Sistema',
    region: 'center',
    height: '100%',
    closable: true,
    iconCls: '',
    initComponent: function () {
        //Variables
         var self = this;
        var parteselect, sistselect, accion, accionp;
        var determinado = 0;
        var busc = 0;
        var busc1 = 0;
        //Botón ayuda
        this.btnAyuda = new Ext.Button({
            id: 'idbtnAyudaSistema',
            text: this.idioma.BtnAyuda,
            tooltip: self.idioma.textToolTipAyuda,
            iconCls: 'ayuda'
        });

        //Botón para adicionar.
        this.btnAdicionarTP = new Ext.Button({
            text: this.idioma.BtnAdicionar,
            tooltip: this.idioma.lbBtnAdicionarTP,
            iconCls: 'adicionar',
            handler: function ()
            {
                self.ventanaGestionTP.setTitle(self.idioma.msgAddTP);
                self.ventanaGestionTP.show();
                self.btnAplicarTP.show();
                self.formularioGestionTP.getForm().reset();
                accion = 'add';
            }.createDelegate(this)
        });

        //Boton para modificar.
        this.btnModificarTP = new Ext.Button({
            text: this.idioma.BtnModificar,
            disabled: true,
            tooltip: this.idioma.lbBtnModificarTP,
            iconCls: 'modificar',
            handler: function ()
            {
                self.ventanaGestionTP.setTitle(self.idioma.msgModTP);
                self.ventanaGestionTP.show();
                self.btnAplicarTP.hide();
                self.tfdenomTP.setValue(parteselect.denominacion);
                self.dfFFinTP.setValue(parteselect.fhasta);
                self.dfFInicioTP.setValue(parteselect.fdesde);
                self.tadescripcionTP.setValue(parteselect.descripcion);
                accion = 'mod';
            }.createDelegate(this)
        });

        //Boton para eliminar.
        this.btnEliminarTP = new Ext.Button({
            text: this.idioma.BtnEliminar,
            disabled: true,
            tooltip: this.idioma.lbBtnEliminarTP,
            iconCls: 'eliminar',
            handler: function ()
            {
                eliminarPartePer();
            }.createDelegate(this)
        });

        //Botón para Buscar.
        this.btnBuscarTP = new Ext.Button({
            text: this.idioma.BtnBuscar,
            tooltip: this.idioma.lbBtnBuscarTP,
            iconCls: 'buscar',
            handler: function ()
            {
                self.stParteSistema.load({params:{denominacion: self.tfbuscarTP.getValue(), start: 0, limit: 15}});
                busc1 = 1;
            }.createDelegate(this)
        });

        //Botón para limpiar.
        this.btnLimpiarTP = new Ext.Button({
            text: this.idioma.BtnLimpiar,
            tooltip: this.idioma.lbBtnLimpiar,
            iconCls: 'limpiar',
            handler: function ()
            {
                self.tfbuscarTP.reset();
                self.stParteSistema.load({params:{start:0,limit:15}});
            }.createDelegate(this)
        });

        //textfield para el buscar
        this.tfbuscarTP = new Ext.form.TextField({
            allowBlank : true,
            minLength: 3,
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            regexText: self.idioma.msgCaracteres,
            width:140,
            maxLength: 100,
            name : 'tfbuscador'
        });
		
        //Expander
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        //Fuente de datos del listado.
        this.stParteSistema = new Ext.data.Store({
            url: '/pvd/sst/riesgo/index.php/nomsistema/getParteSistema',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idpartesistema", totalProperty: "cantidad"},
                [{name:'idpartesistema'},{name:'denominacion'}, {name:'descripcion'}, {name:'sistema'},
                 {name:'fdesde'}, {name:'fhasta'}, {name:'gestion'}]
            ),
            listeners: {
                load: function () {
                    parteselect = null;
                    self.btnModificarTP.disable();
                    self.btnEliminarTP.disable();
                    if (busc1 == 1 && self.stParteSistema.getCount()==0) {
                        mostrarMensaje(1, self.idioma.lbNoDatosBusc);
                        busc1 = 0;
                    } else if (self.stParteSistema.getCount()==0) {
                        mostrarMensaje(1, self.idioma.lbNoDatos);
                    }
                }
            }
        });

        //this.stParteSistema.load({params: {start:0, limit: 15}});

        function mostrartt(val, metaData, record) {
            if (record.get('gestion') == 0) {
                metaData.attr = 'ext:qtip="No gestionable"';
            }
            return val;
        }

        //Listado de partes de sistema.
        this.gpParteSistema = new Ext.grid.GridPanel({
            title: 'Listado de partes de sistema',
            store: this.stParteSistema,
            loadMask: {msg: 'Cargando...'},
            plugins:this.expander,
            tbar: ['',
                this.idioma.lbDenominacion+':',
                this.tfbuscarTP,
                this.btnBuscarTP,
                this.btnLimpiarTP
            ],
            columns: [this.expander,
                {
                    header: this.idioma.lbDenominacion,
                    width:200,
                    dataIndex: 'denominacion',
                    renderer: mostrartt
                },
                {
                    header: 'Sistema',
                    width: 200,
                    dataIndex: 'sistema',
                    renderer: mostrartt
                },
                {
                    header: 'Fecha inicio',
                    width:100,
                    dataIndex: 'fdesde',
                    renderer: mostrartt
                },
                {
                    header: 'Fecha fin',
                    width:100,
                    dataIndex: 'fhasta',
                    renderer: mostrartt
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stParteSistema,
                displayInfo: true
            })
        });

        this.gpParteSistema.getSelectionModel().on('rowselect', function (n) {
            parteselect = n.getSelected().data;
            if (parteselect.gestion == 1) {
                self.btnModificarTP.enable();
                self.btnEliminarTP.enable();
            } else {
                self.btnModificarTP.disable();
                self.btnEliminarTP.disable();
            }
        }, this);

        //Panel con listado.
        this.panel = new Ext.Panel({
            layout: 'fit',
            border: false,
			width: '50%',
            region: 'center',
            items: [this.gpParteSistema],
            tbar:[
                this.btnAdicionarTP,
                this.btnModificarTP,
                this.btnEliminarTP,
                '->', this.btnAyuda]
        });
		
		// Nomenclador de sistemas
		 //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            text: this.idioma.BtnAdicionar,
            tooltip: this.idioma.lbBtnAdicionarP,
            iconCls: 'adicionar',
            handler: function ()
            {
                self.ventanaGestion.setTitle(self.idioma.msgAddP);
                self.ventanaGestion.show();
                self.btnAplicar.show();
                self.formularioGestion.getForm().reset();
                accionp = 'add';
            }.createDelegate(this)
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            text: this.idioma.BtnModificar,
            disabled: true,
            tooltip: this.idioma.lbBtnModificarP,
            iconCls: 'modificar',
            handler: function ()
            {
                self.ventanaGestion.setTitle(self.idioma.msgModP);
                self.ventanaGestion.show();
                self.btnAplicar.hide();
                self.tadescripcion.setValue(sistselect.descripcion);
                self.tfdenom.setValue(sistselect.denominacion);
                self.dfFFin.setValue(sistselect.fhasta);
                self.dfFInicio.setValue(sistselect.fdesde);
                accionp = 'mod';
            }.createDelegate(this)
        });

        //Boton para eliminar.
        this.btnEliminar = new Ext.Button({
            text: this.idioma.BtnEliminar,
            disabled: true,
            tooltip: this.idioma.lbBtnEliminarP,
            iconCls: 'eliminar',
            handler: function ()
            {
                eliminarPer();
            }.createDelegate(this)
        });

        //Botón para Buscar.
        this.btnBuscar = new Ext.Button({
            text: this.idioma.BtnBuscar,
            tooltip: this.idioma.lbBtnBuscarP,
            iconCls: 'buscar',
            handler: function ()
            {
                self.stSistema.load({params:{denominacion: self.tfbuscar.getValue(), start: 0, limit: 15}});
                busc = 1;
            }.createDelegate(this)
        });

        //Botón para limpiar.
        this.btnLimpiar = new Ext.Button({
            text: this.idioma.BtnLimpiar,
            tooltip: this.idioma.lbBtnLimpiar,
            iconCls: 'limpiar',
            handler: function ()
            {
                self.tfbuscar.reset();
                self.stSistema.load({params:{start:0,limit:15}});
            }.createDelegate(this)
        });

        //textfield para el buscar
        this.tfbuscar = new Ext.form.TextField({
            allowBlank : true,
            minLength: 3,
            maxLength: 100,
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            regexText: self.idioma.msgCaracteres,
            width:140,
            name : 'tfbuscador'
        });
		
		//Expander
        this.expander1 = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        //Fuente de datos del listado.
        this.stSistema = new Ext.data.Store({
            url: '/pvd/sst/riesgo/index.php/nomsistema/getSistema',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idsistema", totalProperty: "cantidad"},
                [{name:'idsistema'}, {name:'idpartesistema'},{name:'denominacion'}, {name:'descripcion'}, {name:'partesistema'},
                 {name:'fdesde'}, {name:'fhasta'}, {name:'gestion'}]
            ),
            listeners: {
                load: function () {
                    sistselect = null;
                    self.btnAdicionarTP.disable();
                    self.btnModificar.disable();
                    self.btnEliminar.disable();
                    if (busc == 1 && self.stSistema.getCount()==0) {
                        mostrarMensaje(1, self.idioma.lbNoDatosBusc);
                        busc = 0;
                    } else if (self.stSistema.getCount()==0) {
                        mostrarMensaje(1, self.idioma.lbNoDatos);
                    }
                }
            }
        });

        this.stSistema.load({params: {start:0, limit: 15}});

        //Listado de sistemas.
            this.gpSistema = new Ext.grid.GridPanel({
            title: 'Listado de sistemas',
            loadMask: {msg: 'Cargando...'},
            store: this.stSistema,
            plugins:this.expander1,
            tbar: ['',
                this.idioma.lbDenominacion+':',
                this.tfbuscar,
                this.btnBuscar,
                this.btnLimpiar
            ],
            columns: [this.expander1,
                {
                    header: this.idioma.lbDenominacion,
                    width:200,
                    dataIndex: 'denominacion',
                    renderer: mostrartt
                },
                {
                    header: 'Fecha inicio',
                    width:100,
                    dataIndex: 'fdesde',
                    renderer: mostrartt
                } ,
                {
                    header: 'Fecha fin',
                    width:100,
                    dataIndex: 'fhasta',
                    renderer: mostrartt
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stSistema,
                displayInfo: true
            })
        });

        this.stSistema.on('load', function(){
            self.gpSistema.getSelectionModel().selectFirstRow();
        });

        this.gpSistema.getSelectionModel().on('selectionchange', function(th){
           if(th.getCount() == 0){
               self.stParteSistema.removeAll();
           }
        });

        this.gpSistema.getSelectionModel().on('rowselect', function (n) {
            sistselect = n.getSelected().data;
            self.btnAdicionarTP.enable();
            if (sistselect.gestion == 1) {
                self.btnModificar.enable();
                self.btnEliminar.enable();
            } else {
                self.btnModificar.disable();
                self.btnEliminar.disable();
            }
            this.stParteSistema.load({params: {start: 0, limit: 15, idsistema: sistselect.idsistema}});
        }, this);

        // panel para add, mod, del, ayuda
        this.panel2 = new Ext.Panel({
            layout: 'fit',
			width: '50%',
            region: 'west',
            border: false,
			items: [this.gpSistema],
            tbar:['-',
                this.btnAdicionar,
                this.btnModificar,
                this.btnEliminar]
        });

        //textfield denominacion
        this.tfdenomTP = new Ext.form.TextField({
            id: 'tfdenomTP'+self.panel.id,
            fieldLabel: this.idioma.lbDenominacion,
            allowBlank : false,
            maxLength: 100,
            enableKeyEvents: true,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
            regexText: self.idioma.msgCaracteres,
            anchor:	'99%',
            name : 'denominacion'
        });
        
        var fecha = new Date();

        this.dfFInicioTP = new Ext.form.DateField({
            id: 'dfFInicioTP'+self.panel.id,
            fieldLabel: this.idioma.lbFechaInicio,
            name: 'fdesde',
            hiddenname:'fdesde',
            anchor:'97%',
            format:'d/m/Y',
            value: fecha.format('d/m/Y'),
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            maxText : this.idioma.lbFechaMaxima,
            minValue:'01/01/1900',
            minText : this.idioma.lbFechaMinima,
            invalidText: this.idioma.invalidTextFecha,
            vtype:'daterange',
            emptyText: this.idioma.lbEmptyTextFecha
        });

        this.dfFFinTP = new Ext.form.DateField({
            fieldLabel: this.idioma.lbFechaFin,
            name: 'fhasta',
            hiddenname:'fhasta',
            anchor:'97%',
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            maxText : this.idioma.lbFechaMaxima,
            minValue:'01/01/1900',
            minText : this.idioma.lbFechaMinima,
            invalidText: this.idioma.invalidTextFecha,
            startDateField: 'dfFInicioTP'+self.panel.id,
            vtype:'daterange',
            emptyText: this.idioma.lbEmptyTextFecha
        });

        // Area de texto Descripción de la Facultad de decisión
        this.tadescripcionTP = new Ext.form.TextArea({
            fieldLabel: this.idioma.lbDescripcion,
            name: 'descripcion',
            anchor:	'99%',
            height: 100,
            hiddenname: 'descripcion',
            maxLength: 255,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            regexText: self.idioma.lbRegexTextDescripcion,
            allowBlank:	true
        });

        //Formulario de gestion.
        this.formularioGestionTP = new Ext.FormPanel({
            labelAlign: 'top',
            frame:true,
            bodyStyle:'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.tfdenomTP]
                    },
                    {
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.dfFInicioTP]
                    },
                    {
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.dfFFinTP]
                    },{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.tadescripcionTP]
                    }]
            }]
        });

        this.btnCancelarTP = new Ext.Button({
            nextTab: 'tfdenomTP'+self.panel.id,
            iconCls: 'cancelar',
            tooltip: this.idioma.textToolTipCancelar,
            text: this.idioma.lbtnCancelar,
            handler: function ()
            {
                self.formularioGestionTP.getForm().reset();
                self.ventanaGestionTP.hide();
            }.createDelegate(this)
        });

        this.btnAceptarTP = new Ext.Button({
            nextTab: 'tfdenomTP'+self.panel.id,
            iconCls: 'aceptar',
            tooltip: this.idioma.textToolTipAceptar,
            text: this.idioma.lbtnAceptar,
            listeners: {
                'enable': function()
                {
                    self.btnCancelarTP.nextTab = 'btnAplicartp';
                },
                'disable': function()
                {
                    self.btnCancelarTP.nextTab = 'tfdenomTP'+self.panel.id;
                }
            },
            handler: function ()
            {
                guardarDatosParteSis('ACP');
            }.createDelegate(this)
        });

        this.btnAplicarTP = new Ext.Button({
            id: 'btnAplicartp',
            iconCls: 'aplicar',
            tooltip: this.idioma.textToolTipAplicar,
            text: this.idioma.lbtnAplicar,
            handler: function ()
            {
                guardarDatosParteSis('APL');
            }.createDelegate(this)
        });

        //Ventana de gestion.
        this.ventanaGestionTP = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            title: this.idioma.lbCrearTP,
            width: 400,
            height: 315,
            items: [this.formularioGestionTP],
            buttons: [
                this.btnCancelarTP,
                this.btnAplicarTP,
                this.btnAceptarTP
            ],
            listeners: {
                'beforeshow': function()
                {
                    self.tfdenomTP.focus(true, 500);
                },
                'hide': function()
                {
                    self.btnAdicionarTP.focus();
                }
            },
            keys: [{
                key: 'x',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnCancelarTP.disabled) {
                        self.btnCancelarTP.handler();
                    }
                }
            },
                {
                    key: 'p',
                    alt: true,
                    ctrl: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarTP.disabled) {
                            self.btnAplicarTP.handler();
                        }
                    }
                },
                {
                    key: 13,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarTP.disabled) {
                            self.btnAceptarTP.handler();
                        }
                    }
                }]
        });

        //textfield denominacion
        this.tfdenom = new Ext.form.TextField({
            id: 'tfdenomp'+self.panel.id,
            fieldLabel: this.idioma.lbDenominacion,
            allowBlank : false,
            minLength: 3,
            enableKeyEvents: true,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
            regexText: self.idioma.msgCaracteres,
            anchor:	'99%',
            name : 'denominacion'
        });

        var fecha = new Date();

        this.dfFInicio = new Ext.form.DateField({
            id: 'dfFInicioo'+self.panel.id,
            fieldLabel: this.idioma.lbFechaInicio,
            allowBlank : false,
            name: 'fdesde',
            hiddenname:'fdesde',
            anchor:'97%',
            format:'d/m/Y',
            value: fecha.format('d/m/Y'),
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            maxText : this.idioma.lbFechaMaxima,
            minValue:'01/01/1900',
            minText : this.idioma.lbFechaMinima,
            invalidText: this.idioma.invalidTextFecha,
            vtype:'daterange',
            emptyText: this.idioma.lbEmptyTextFecha
        });

        this.dfFFin = new Ext.form.DateField({
            fieldLabel: this.idioma.lbFechaFin,
            name: 'fhasta',
            hiddenname:'fhasta',
            anchor:'97%',
            format:'d/m/Y',
            editable:false,
            allowBlank : true,
            readOnly : true,
            maxValue:'31/12/2100',
            maxText : this.idioma.lbFechaMaxima,
            minValue:'01/01/1900',
            minText : this.idioma.lbFechaMinima,
            invalidText: this.idioma.invalidTextFecha,
            startDateField: 'dfFInicioo'+self.panel.id,
            vtype:'daterange',
            emptyText: this.idioma.lbEmptyTextFecha
        });
        // Area de texto Descripción de la Facultad de decisión
        this.tadescripcion = new Ext.form.TextArea({
            fieldLabel: this.idioma.lbDescripcion,
            name: 'descripcion',
            anchor:	'99%',
            height: 100,
            hiddenname: 'descripcion',
            maxLength: 245,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
            regexText: self.idioma.lbRegexTextDescripcion,
            allowBlank:	true
        });

        //Formulario de gestion.
        this.formularioGestion = new Ext.FormPanel({
            labelAlign: 'top',
            frame:true,
            bodyStyle:'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.tfdenom]
                    },{
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.dfFInicio]
                    },
                    {
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.dfFFin]
                    },{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.tadescripcion]
                    }]
            }]
        });

        this.btnCancelar = new Ext.Button({
            nextTab: 'tfdenomp'+self.panel.id,
            iconCls: 'cancelar',
            tooltip: this.idioma.textToolTipCancelar,
            text: this.idioma.lbtnCancelar,
            handler: function ()
            {
                self.formularioGestion.getForm().reset();
                self.ventanaGestion.hide();
            }.createDelegate(this)
        });

        this.btnAceptar = new Ext.Button({
            nextTab: 'tfdenomp'+self.panel.id,
            iconCls: 'aceptar',
            tooltip: this.idioma.textToolTipAceptar,
            text: this.idioma.lbtnAceptar,
            listeners: {
                'enable': function()
                {
                    self.btnCancelar.nextTab = 'btnAplicarp';
                },
                'disable': function()
                {
                    self.btnCancelar.nextTab = 'tfdenomp'+self.panel.id;
                }
            },
            handler: function ()
            {
                guardarDatosSis('ACP');
            }.createDelegate(this)
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicarp',
            iconCls: 'aplicar',
            tooltip: this.idioma.textToolTipAplicar,
            text: this.idioma.lbtnAplicar,
            handler: function ()
            {
                guardarDatosSis('APL');
            }.createDelegate(this)
        });

        //Ventana de gestion.
        this.ventanaGestion = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            title: this.idioma.lbCrearTP,
            width: 400,
            height: 315,
            items: [this.formularioGestion],
            buttons: [
                this.btnCancelar,
                this.btnAplicar,
                this.btnAceptar
            ],
            listeners: {
                'beforeshow': function()
                {
                    self.tfdenom.focus(true, 500);
                },
                'hide': function()
                {
                    self.btnAdicionar.focus();
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
                    key: 'p',
                    alt: true,
                    ctrl: true,
                    //stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicar.disabled) {
                            self.btnAplicar.handler();
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

        this.items = [this.panel, this.panel2];

        this.panel.on('render', function ()
        {
            self.btnAdicionarTP.focus();
        });

        function guardarDatosParteSis(btnpress)
        {
            if(self.formularioGestionTP.getForm().isValid()){
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: (accion == 'add' ? '/pvd/sst/riesgo/index.php/nomsistema/addParteSistema' : '/pvd/sst/riesgo/index.php/nomsistema/updateParteSistema'),
                    params: {
                        idpartesistema: accion == 'add' ? -1 : parteselect.idpartesistema,
                        denominacion: self.tfdenomTP.getValue(),
                        idsistema: accion == 'mod' ? -1 : sistselect.idsistema,
                        fdesde: self.dfFInicioTP.getRawValue(),
                        fhasta: self.dfFFinTP.getRawValue(),
                        descripcion: self.tadescripcionTP.getValue()
                    },
                    callback: function (){
                        Ext.getBody().unmask();
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if(accion == 'mod')
                            {
                                mostrarMensaje(1, self.idioma.msgModTPSucces);
                            }else{
                                mostrarMensaje(1, self.idioma.msgAddTPSucces);
                            }
                            if (btnpress == 'ACP')
                            {
                                self.ventanaGestionTP.hide();
                            }
                            determinado = 0;
                            self.formularioGestionTP.getForm().reset();
                            self.stParteSistema.removeAll();
                            self.stParteSistema.reload();
                        } else {
                            if(accion == 'mod')
                            {
                                mostrarMensaje(6, self.idioma.msgTPExistem);
                            }else{
                                mostrarMensaje(6, self.idioma.msgPExiste);
                            }
                        }
                    }
                });
            }
        }

		function guardarDatosSis(btnpress)
        {
            if(self.formularioGestion.getForm().isValid()){
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: (accionp == 'add' ? '/pvd/sst/riesgo/index.php/nomsistema/addSistema' : '/pvd/sst/riesgo/index.php/nomsistema/updateSistema'),
                    params: {
                        idsistema: accionp == 'add' ? -1 : sistselect.idsistema,                       
                        denominacion: self.tfdenom.getValue(),
                        fdesde: self.dfFInicio.getRawValue(),
                        fhasta: self.dfFFin.getRawValue(),
                        descripcion: self.tadescripcion.getValue()
                    },
                    callback: function (){
                        Ext.getBody().unmask();
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if(accionp == 'mod')
                            {
                                mostrarMensaje(1, self.idioma.msgModPSucces);
                            }else{
                                mostrarMensaje(1, self.idioma.msgAddPSucces);
                            }
                            if (btnpress == 'ACP')
                            {
                                self.ventanaGestion.hide();
                            }
                            self.formularioGestion.getForm().reset();
                            self.stSistema.removeAll();
                            self.stSistema.reload();
                        } else if (responseData == false) {
                            if(accionp == 'mod')
                            {
                                mostrarMensaje(6, self.idioma.msgPExistem);
                            } else {
                                mostrarMensaje(6, self.idioma.msgPExiste);
                            }
                        }

                    }
                });
            }
        }

        function eliminarPartePer()
        {
            var ids = new Array();
            var s = self.gpParteSistema.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idpartesistema);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar la parte de sistema seleccionada?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar las partes de sistema seleccionadas?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(self.idioma.msgEspereDelete);
                    Ext.Ajax.request({
                        url: '/pvd/sst/riesgo/index.php/nomsistema/deleteParteSistema',
                        params: {partessistema: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'La parte de sistema seleccionada no puede ser eliminada debido a que' +
                                        ' se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguna de las partes del sistema seleccionadas no puede ser eliminada' +
                                        ' debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'La parte del sistema ha sido eliminado satisfactoriamente.';
                                } else {
                                    mensaje = 'Las partes del sistema han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            self.stParteSistema.removeAll();
                            self.stParteSistema.reload();
                        }
                    });
                }
            });
        }
		
		function eliminarPer()
        {
            var ids = new Array();
            var s = self.gpSistema.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idsistema);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar el sistema seleccionado?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar los sistemas seleccionados?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(self.idioma.msgEspereDelete);
                    Ext.Ajax.request({
                        url: '/pvd/sst/riesgo/index.php/nomsistema/deleteSistema',
                        params: {sistemas: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if(responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'El sistema seleccionado no puede ser eliminado debido a que se' +
                                        ' encuentra en uso.';
                                } else {
                                    mensaje = 'Alguno de los sistemas seleccionados no puede ser eliminado debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'El sistema ha sido eliminado satisfactoriamente.';
                                } else {
                                    mensaje = 'Los sistema han sido eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            self.stSistema.removeAll();
                            self.stSistema.reload();
                            self.stParteSistema.removeAll();
                        }
                    });
                }
            });
        }

        this.keys = [
            {
                key: 'i',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnAdicionar.disabled) {
                        self.btnAdicionar.handler();
                    } else if (!self.btnAdicionarTP.disabled) {
                        self.btnAdicionarTP.handler();
                    }

                }
            },
            {
                key: 'm',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnModificar.disabled) {
                        self.btnModificar.handler();
                    } else if (!self.btnModificarTP.disabled) {
                        self.btnModificarTP.handler();
                    }
                }
            },
            {
                key: 'b',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (self.tfbuscarTP.getValue() != '') {
                        self.btnBuscarTP.handler();
                    } else if (self.tfbuscar.getValue() != '') {
                        self.btnBuscar.handler();
                    }
                }
            },
            {
                key: 'l',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (self.tfbuscar.getValue() != '') {
                        self.btnLimpiar.handler();
                    } else if (self.tfbuscarTP.getValue() != '') {
                        self.btnLimpiarTP.handler();
                    }
                }
            },
            {
                key: 46,//Eliminar
                //stopEvent: true,
                fn: function () {
                    if (!self.btnEliminar.disabled) {
                        self.btnEliminar.handler();
                    } else if (!self.btnEliminarTP.disabled) {
                        self.btnEliminarTP.handler();
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

        Pvd.Sst.Riesgo.Configuracion.Nomencladores.Sistema.superclass.initComponent.call(this);
    }
});
