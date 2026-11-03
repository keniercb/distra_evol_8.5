
/*
 * Componente Agente.
 *
 * @author Ing. Eddy Santana Navarro
 * @package Pvd.Sst.Accidente
 * @uses Pvd.Sst.Accidente.Configuracion.Nomencladores
 * @copyright XETID
 * @version 1.0
 */ 
 
Ext.ns("Pvd.Sst.Accidente.Configuracion.Nomencladores");
Pvd.Sst.Accidente.Configuracion.Nomencladores.Agente = Ext.extend(Ext.Panel,{
    layout: 'border',
    border: false,
    id: 'agente',
    title: 'Agente',
    region: 'center',
    height: '100%',
    closable: true,
    iconCls: '',
    initComponent: function () {
        //Variables
         var self = this;
        var tiposelect, perselect, accion, acciona;
        var determinado = 0;
        var busc = 0;
        var busc1 = 0;
        //Botón ayuda
        this.btnAyuda = new Ext.Button({
            text: this.idioma.BtnAyuda,
            iconCls:'ayuda',
            disabled: false
        });

        //Botón para adicionar.
        this.btnAdicionarTA = new Ext.Button({
            text: this.idioma.BtnAdicionar,
            tooltip: this.idioma.lbBtnAdicionarTA,
            iconCls: 'adicionar',
            handler: function ()
            {
                self.ventanaGestionTA.setTitle(self.idioma.msgAddTA);
                self.ventanaGestionTA.show();
                self.btnAplicarTA.show();
                self.formularioGestionTA.getForm().reset();
                accion = 'add';
            }.createDelegate(this)
        });

        //Boton para modificar.
        this.btnModificarTA = new Ext.Button({
            text: this.idioma.BtnModificar,
            disabled: true,
            tooltip: this.idioma.lbBtnModificarTA,
            iconCls: 'modificar',
            handler: function ()
            {
                self.ventanaGestionTA.setTitle(self.idioma.msgModTA);
                self.ventanaGestionTA.show();
                self.btnAplicarTA.hide();
                self.tfdenomTA.setValue(tiposelect.denominacion);
                self.dfFFinTA.setValue(tiposelect.fhasta);
                self.dfFInicioTA.setValue(tiposelect.fdesde);
                self.tadescripcionTA.setValue(tiposelect.descripcion);
                accion = 'mod';
            }.createDelegate(this)
        });

        //Boton para eliminar.
        this.btnEliminarTA = new Ext.Button({
            text: this.idioma.BtnEliminar,
            disabled: true,
            tooltip: this.idioma.lbBtnEliminarTA,
            iconCls: 'eliminar',
            handler: function ()
            {
                eliminarTipoAge();
            }.createDelegate(this)
        });

        //Botón para Buscar.
        this.btnBuscarTA = new Ext.Button({
            text: this.idioma.BtnBuscar,
            tooltip: this.idioma.lbBtnBuscarTA,
            iconCls: 'buscar',
            handler: function ()
            {
                self.stTipoAgente.load({params:{denominacion: self.tfbuscarTA.getValue(), start: 0, limit: 15}});
                busc1 = 1;
            }.createDelegate(this)
        });

        //Botón para limpiar.
        this.btnLimpiarTA = new Ext.Button({
            text: this.idioma.BtnLimpiar,
            tooltip: this.idioma.lbBtnLimpiar,
            iconCls: 'limpiar',
            handler: function ()
            {
                self.tfbuscarTA.reset();
                self.stTipoAgente.load({params:{start:0,limit:15}});
            }.createDelegate(this)
        });

        //textfield para el buscar
        this.tfbuscarTA = new Ext.form.TextField({
            allowBlank : true,
            minLength: 3,
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            regexText: self.idioma.msgCaracteres,
            width:140,
            name : 'tfbuscadorta'
        });
		
        //Expander
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        //Fuente de datos del listado.
        this.stTipoAgente = new Ext.data.Store({
            url: '/pvd/sst/accidente/index.php/nomtipoagente/getTiposAgente',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idtipoagente", totalProperty: "cantidad"},
                [{name:'idtipoagente'},{name:'denominacion'}, {name:'descripcion'},
                 {name:'fdesde'}, {name:'fhasta'}, {name:'gestion'}]
            ),
            listeners: {
                load: function () {
                    tiposelect = null;
                    self.btnAdicionar.disable();
                    self.btnModificarTA.disable();
                    self.btnEliminarTA.disable();
                    if (busc1 == 1 && self.stTipoAgente.getCount()==0) {
                        mostrarMensaje(1, self.idioma.lbNoDatosBusc);
                        busc1 = 0;
                    } else if (self.stTipoAgente.getCount()==0) {
                        mostrarMensaje(1, self.idioma.lbNoDatos);
                    }
                }
            }
        });

        this.stTipoAgente.load({params: {start:0, limit: 15}});

        function mostrartt(val, metaData, record) {
            if (record.get('gestion') == 0) {
                metaData.attr = 'ext:qtip="' + self.idioma.ttNoGestionable + '"';
                if (val) {
                    return '<span style="color:#707070;">' + val + '</span>';
                }
            }
            return val;
        }

        //Listado de tipos de agentes.
        this.gpTipoAgente = new Ext.grid.GridPanel({
            title: 'Listado de tipos de agente',
            store: this.stTipoAgente,
            loadMask: {msg: 'Cargando...'},
            plugins:this.expander,
            tbar: [
                '-','',
                this.idioma.lbDenominacion+':',
                this.tfbuscarTA,
                this.btnBuscarTA,
                this.btnLimpiarTA,'','-'
            ],
            columns: [this.expander,
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
                store: this.stTipoAgente,
                displayInfo: true
            })
        });

        this.gpTipoAgente.getSelectionModel().on('rowselect', function (n) {
            tiposelect = n.getSelected().data;
            self.btnAdicionar.enable();
            if (tiposelect.gestion == 1) {
                self.btnModificarTA.enable();
                self.btnEliminarTA.enable();
            } else {
                self.btnModificarTA.disable();
                self.btnEliminarTA.disable();
            }
            this.stAgente.load({params: {start:0, limit: 15, idtipoagente: tiposelect.idtipoagente}});
        }, this);

        //Panel con listado.
        this.panel = new Ext.Panel({
            layout: 'fit',
            border: false,
			width: '50%',
            region: 'center',
            items: [this.gpTipoAgente],
            tbar:[
                this.btnAdicionarTA,
                this.btnModificarTA,
                this.btnEliminarTA]
        });
		
		// Nomenclador de agentes
		 //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            text: this.idioma.BtnAdicionar,
            tooltip: this.idioma.lbBtnAdicionarA,
            disabled: true,
            iconCls: 'adicionar',
            handler: function ()
            {
                self.ventanaGestion.setTitle(self.idioma.msgAddA);
                self.ventanaGestion.show();
                self.btnAplicar.show();
                self.formularioGestion.getForm().reset();
                acciona = 'add';
            }.createDelegate(this)
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            text: this.idioma.BtnModificar,
            disabled: true,
            tooltip: this.idioma.lbBtnModificarA,
            iconCls: 'modificar',
            handler: function ()
            {
                self.ventanaGestion.setTitle(self.idioma.msgModA);
                self.ventanaGestion.show();
                self.btnAplicar.hide();
                self.tadescripcion.setValue(perselect.descripcion);
                self.tfdenom.setValue(perselect.denominacion);
                self.dfFFin.setValue(perselect.fhasta);
                self.dfFInicio.setValue(perselect.fdesde);
                acciona = 'mod';
            }.createDelegate(this)
        });

        //Boton para eliminar.
        this.btnEliminar = new Ext.Button({
            text: this.idioma.BtnEliminar,
            disabled: true,
            tooltip: this.idioma.lbBtnEliminarA,
            iconCls: 'eliminar',
            handler: function ()
            {
                eliminarAge();
            }.createDelegate(this)
        });

        //Botón para Buscar.
        this.btnBuscar = new Ext.Button({
            text: this.idioma.BtnBuscar,
            tooltip: this.idioma.lbBtnBuscarA,
            iconCls: 'buscar',
            handler: function ()
            {
                self.stAgente.load({params:{denominacion: self.tfbuscar.getValue(), start: 0, limit: 15}});
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
                self.stAgente.load({params:{start:0,limit:15}});
            }.createDelegate(this)
        });

        //textfield para el buscar
        this.tfbuscar = new Ext.form.TextField({
            allowBlank : true,
            minLength: 3,
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
        this.stAgente = new Ext.data.Store({
            url: '/pvd/sst/accidente/index.php/nomagente/getAgentes',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idagente", totalProperty: "cantidad"},
                [{name:'idagente'}, {name:'idtipoagente'},{name:'denominacion'}, {name:'descripcion'}, {name:'tipoagente'},
                 {name:'fdesde'}, {name:'fhasta'}, {name:'gestion'}]
            ),
            listeners: {
                load: function () {
                    perselect = null;
                    self.btnModificar.disable();
                    self.btnEliminar.disable();
                    if (busc == 1 && self.stAgente.getCount()==0) {
                        mostrarMensaje(1, self.idioma.lbNoDatosBusc);
                        busc = 0;
                    } else if (self.stAgente.getCount()==0) {
                        mostrarMensaje(1, self.idioma.lbNoDatos);
                    }
                }
            }
        });

        this.stAgente.load({params: {start:0, limit: 15}});

        //Listado de agentes.
            this.gpAgente = new Ext.grid.GridPanel({
            title: 'Listado de agentes',
            loadMask: {msg: 'Cargando...'},
            store: this.stAgente,
            plugins:this.expander1,
            tbar: [
                '-','',
                this.idioma.lbDenominacion+':',
                this.tfbuscar,
                this.btnBuscar,
                this.btnLimpiar,'','-'
            ],
            columns: [this.expander1,
                {
                    header: this.idioma.lbDenominacion,
                    width:200,
                    dataIndex: 'denominacion',
                    renderer: mostrartt
                },
                {
                    header: 'Tipo de agente',
                    width:200,
                    dataIndex: 'tipoagente',
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
                store: this.stAgente,
                displayInfo: true
            })
        });

        this.gpAgente.getSelectionModel().on('rowselect', function (n) {
            perselect = n.getSelected().data;
            if (perselect.gestion == 1) {
                self.btnModificar.enable();
                self.btnEliminar.enable();
            } else {
                self.btnModificar.disable();
                self.btnEliminar.disable();
            }
        }, this);

        // panel para add, mod, del, ayuda
        this.panel2 = new Ext.Panel({
            layout: 'fit',
            width: '50%',
            region: 'east',
            border: false,
            items: [this.gpAgente],
            tbar:[
                this.btnAdicionar,
                this.btnModificar,
                this.btnEliminar,
                '->', '','-',this.btnAyuda]
        });

        //textfield denominacion
        this.tfdenomTA = new Ext.form.TextField({
            id: 'tfdenomTA'+self.panel.id,
            fieldLabel: this.idioma.lbDenominacion,
            allowBlank : false,
            maxLength: 100,
            enableKeyEvents: true,
            //regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ(),\\+\-_/.\s]$/,
            regexText: self.idioma.msgCaracteres,
            anchor:	'99%',
            name : 'denominacion'
        });

        var fecha = new Date();

        this.dfFInicioTA = new Ext.form.DateField({
            id: 'dfFInicioTA'+self.panel.id,
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
            vtype:'daterange'
        });

        this.dfFFinTA = new Ext.form.DateField({
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
            startDateField: 'dfFInicioTA'+self.panel.id,
            vtype:'daterange'
        });

        // Area de texto Descripción del tipo de agente
        this.tadescripcionTA = new Ext.form.TextArea({
            fieldLabel: this.idioma.lbDescripcion,
            name: 'descripcion',
            anchor: '99%',
            height: 100,
            hiddenname: 'descripcion',
            maxLength: 255,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            regexText: self.idioma.lbRegexTextDescripcion,
            allowBlank:	true
        });

        //Formulario de gestion.
        this.formularioGestionTA = new Ext.FormPanel({
            labelAlign: 'top',
            frame:true,
            bodyStyle:'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.tfdenomTA]
                    },
                    {
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.dfFInicioTA]
                    },
                    {
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.dfFFinTA]
                    },{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.tadescripcionTA]
                    }]
            }]
        });

        this.btnCancelarTA = new Ext.Button({
            nextTab: 'tfdenomTA'+self.panel.id,
            iconCls: 'cancelar',
            tooltip: this.idioma.textToolTipCancelar,
            text: this.idioma.lbtnCancelar,
            handler: function ()
            {
                self.formularioGestionTA.getForm().reset();
                self.ventanaGestionTA.hide();
            }.createDelegate(this)
        });

        this.btnAceptarTP = new Ext.Button({
            nextTab: 'tfdenomTA'+self.panel.id,
            iconCls: 'aceptar',
            tooltip: this.idioma.textToolTipAceptar,
            text: this.idioma.lbtnAceptar,
            listeners: {
                'enable': function()
                {
                    self.btnCancelarTA.nextTab = 'btnAplicartag';
                },
                'disable': function()
                {
                    self.btnCancelarTA.nextTab = 'tfdenomTA'+self.panel.id;
                }
            },
            handler: function ()
            {
                guardarDatosTipoAge('ACP');
            }.createDelegate(this)
        });

        this.btnAplicarTA = new Ext.Button({
            id: 'btnAplicartag',
            iconCls: 'aplicar',
            tooltip: this.idioma.textToolTipAplicar,
            text: this.idioma.lbtnAplicar,
            handler: function ()
            {
                guardarDatosTipoAge('APL');
            }.createDelegate(this)
        });

        //Ventana de gestion.
        this.ventanaGestionTA = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            title: this.idioma.lbCrearTA,
            width: 400,
            height: 320,
            items: [this.formularioGestionTA],
            buttons: [
                this.btnCancelarTA,
                this.btnAplicarTA,
                this.btnAceptarTP
            ],
            listeners: {
                'beforeshow': function()
                {
                    self.tfdenomTA.focus(true, 500);
                },
                'hide': function()
                {
                    self.btnAdicionarTA.focus();
                }
            },
            keys: [{
                key: 'x',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnCancelarTA.disabled) {
                        self.btnCancelarTA.handler();
                    }
                }
            },
                {
                    key: 'p',
                    alt: true,
                    ctrl: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarTA.disabled) {
                            self.btnAplicarTA.handler();
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
            id: 'tfdenoma'+self.panel.id,
            fieldLabel: this.idioma.lbDenominacion,
            allowBlank : false,
            minLength: 3,
            enableKeyEvents: true,
            //regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ(),\\+\-_/.\s]$/,
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
            vtype:'daterange'
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
            vtype:'daterange'
        });
        // Area de texto Descripción del agente
        this.tadescripcion = new Ext.form.TextArea({
            fieldLabel: this.idioma.lbDescripcion,
            name: 'descripcion',
            anchor:	'99%',
            height: 100,
            hiddenname: 'descripcion',
            maxLength: 245,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
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
            nextTab: 'tfdenoma'+self.panel.id,
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
            nextTab: 'tfdenoma'+self.panel.id,
            iconCls: 'aceptar',
            tooltip: this.idioma.textToolTipAceptar,
            text: this.idioma.lbtnAceptar,
            listeners: {
                'enable': function()
                {
                    self.btnCancelar.nextTab = 'btnAplicaragen';
                },
                'disable': function()
                {
                    self.btnCancelar.nextTab = 'tfdenoma'+self.panel.id;
                }
            },
            handler: function ()
            {
                guardarDatosAgente('ACP');
            }.createDelegate(this)
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicaragen',
            iconCls: 'aplicar',
            tooltip: this.idioma.textToolTipAplicar,
            text: this.idioma.lbtnAplicar,
            handler: function ()
            {
                guardarDatosAgente('APL');
            }.createDelegate(this)
        });

        //Ventana de gestion.
        this.ventanaGestion = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            title: this.idioma.lbCrearA,
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

        this.items = [this.panel2, this.panel];

        this.panel.on('render', function ()
        {
            self.btnAdicionarTA.focus();
        });

        function guardarDatosTipoAge(btnpress)
        {
            if(self.formularioGestionTA.getForm().isValid()){
                Ext.Ajax.request({
                    url: (accion == 'add' ? '/pvd/sst/accidente/index.php/nomtipoagente/addTipoAgente' : '/pvd/sst/accidente/index.php/nomtipoagente/updateTipoAgente'),
                    params: {
                        idtipoagente: accion == 'add' ? -1 : tiposelect.idtipoagente,
                        denominacion: self.tfdenomTA.getValue(),
                        fdesde: self.dfFInicioTA.getRawValue(),
                        fhasta: self.dfFFinTA.getRawValue(),
                        descripcion: self.tadescripcionTA.getValue()
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if(accion == 'mod')
                            {
                                mostrarMensaje(1, self.idioma.msgModTAgSucces);
                            }else{
                                mostrarMensaje(1, self.idioma.msgAddTAgSucces);
                            }
                            if (btnpress == 'ACP')
                            {
                                self.ventanaGestionTA.hide();
                            }
                            determinado = 0;
                            self.formularioGestionTA.getForm().reset();
                            self.stTipoAgente.removeAll();
                            self.stTipoAgente.reload();
                        } else {
                            if(accion == 'mod')
                            {
                                mostrarMensaje(6, self.idioma.msgTAgExistem);
                            }else{
                                mostrarMensaje(6, self.idioma.msgTAgExiste);
                            }
                        }
                    }
                });
            }
        }

        function guardarDatosAgente(btnpress)
        {
            if(self.formularioGestion.getForm().isValid()){
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: (acciona == 'add' ? '/pvd/sst/accidente/index.php/nomagente/addAgente' : '/pvd/sst/accidente/index.php/nomagente/updateAgente'),
                    params: {
                        idagente: acciona == 'add' ? -1 : perselect.idagente,
                        idtipoagente: tiposelect.idtipoagente,
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
                        if (responseData == true) {
                            if(acciona == 'mod')
                            {
                                mostrarMensaje(1, self.idioma.msgModASucces);
                            }else{
                                mostrarMensaje(1, self.idioma.msgAddASucces);
                            }
                            if (btnpress == 'ACP')
                            {
                                self.ventanaGestion.hide();
                            }
                            self.formularioGestion.getForm().reset();
                            self.stAgente.removeAll();
                            self.stAgente.reload();
                        } else if (responseData == 2) {
                            if(acciona == 'mod')
                            {
                                mostrarMensaje(6, self.idioma.msgAgeExistem);
                            } else {
                                mostrarMensaje(6, self.idioma.msgAgeExiste);
                            }
                        }/* else if (responseData == 2) {
                            mostrarMensaje(6, 'No se pueden adicionar m&aacute;s periodos de este tipo debido a que exceder&iacute;a la candtidad l&iacute;mite.');
                            self.ventanaGestion.hide();
                        }*/

                    }
                });
            }
        }

        function eliminarTipoAge()
        {
            var ids = new Array();
            var s = self.gpTipoAgente.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idtipoagente);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar el tipo de agente seleccionado?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar los tipos de agente seleccionados?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(self.idioma.lbTitMsgEliminando);
                    Ext.Ajax.request({
                        url: '/pvd/sst/accidente/index.php/nomtipoagente/deleteTipoAgente',
                        params: {tiposagente: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'El tipo de agente seleccionado no puede ser eliminado debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguno de los tipos de agente seleccionados no puede ser eliminado debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'El tipo de agente ha sido eliminado satisfactoriamente.';
                                } else {
                                    mensaje = 'Los tipos de agente han sido eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            self.stTipoAgente.removeAll();
                            self.stTipoAgente.reload();
                        }
                    });
                }
            });
        }
		
        function eliminarAge()
        {
            var ids = new Array();
            var s = self.gpAgente.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idagente);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar el agente seleccionado?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar los agentes seleccionados?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(self.idioma.lbTitMsgEliminando);
                    Ext.Ajax.request({
                        url: '/pvd/sst/accidente/index.php/nomagente/deleteAgente',
                        params: {agentes: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if(responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'El agente seleccionado no puede ser eliminado debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguno de los agentes seleccionados no puede ser eliminado debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'El agente ha sido eliminado satisfactoriamente.';
                                } else {
                                    mensaje = 'Los agentes han sido eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            self.stAgente.removeAll();
                            self.stAgente.reload();
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
                    } else if (!self.btnAdicionarTA.disabled) {
                        self.btnAdicionarTA.handler();
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
                    } else if (!self.btnModificarTA.disabled) {
                        self.btnModificarTA.handler();
                    }
                }
            },
            {
                key: 'b',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (self.tfbuscarTA.getValue() != '') {
                        self.btnBuscarTA.handler();
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
                    } else if (self.tfbuscarTA.getValue() != '') {
                        self.btnLimpiarTA.handler();
                    }
                }
            },
            {
                key: 46,//Eliminar
                //stopEvent: true,
                fn: function () {
                    if (!self.btnEliminar.disabled) {
                        self.btnEliminar.handler();
                    } else if (!self.btnEliminarTA.disabled) {
                        self.btnEliminarTA.handler();
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

        Pvd.Sst.Accidente.Configuracion.Nomencladores.Agente.superclass.initComponent.call(this);
    }
});
