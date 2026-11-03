
/*
 * Componente Escala.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Maestro
 * @uses Pvd.Maestro.Configuraciones.Escala
 * @copyright XETID
 * @version 1.0
 */ 
 
Ext.ns("Pvd.Maestro.Configuraciones.Escala");
Pvd.Maestro.Configuraciones.Escala = Ext.extend(Ext.Panel,{
    layout: 'border',
    border: false,
    id: 'pEscala',
    title: 'Escala',
    region: 'center',
    height: '100%',
    closable: true,
    iconCls: '',
    initComponent: function () {
        //Variables
         var self = this;
        var escalaselec, valselect, accion;
        var determinado = 0;
        var busc = 0;
        var busc1 = 0;
        //Botón ayuda
        this.btnAyuda = new Ext.Button({
            text: self.idioma.btnAyudaEstCncpt_text,
            iconCls:'ayuda',
            disabled: false,
            tooltip:this.idioma.btnAyudaEstCncpt_tooltip,
            handler: function ()
            {
                var title = 'Ayuda de escala';
                var referencia = '';
                help.show(title, referencia);
            }.createDelegate(this)
        });

        //Botón para adicionar.
        this.btnAdicionarE = new Ext.Button({
            text: this.idioma.btnAdicionar,
            tooltip: this.idioma.escala.btn_ttAdd,
            iconCls: 'adicionar',
            handler: function ()
            {
                self.ventanaGestionE.setTitle(self.idioma.escala.win_TituloAdd);
                self.ventanaGestionE.show();
                self.btnAplicarE.show();
                self.formularioGestionE.getForm().reset();
                accion = 'add';
            }.createDelegate(this)
        });

        //Boton para modificar.
        this.btnModificarE = new Ext.Button({
            text: this.idioma.btnModificar,
            disabled: true,
            tooltip: this.idioma.escala.btn_ttMod,
            iconCls: 'modificar',
            handler: function ()
            {
                self.ventanaGestionE.setTitle(self.idioma.escala.win_TituloMod);
                self.ventanaGestionE.show();
                self.btnAplicarE.hide();
                self.tfdenom.setValue(escalaselec.denominacion);
                self.cbTipoEscala.setValue(escalaselec.tipo);
                self.dfFFin.setValue(escalaselec.fhasta);
                self.dfFInicio.setValue(escalaselec.fdesde);
                if (escalaselec.descripcion == 'Sin descripci&oacute;n') {
                    self.tadescripcion.setValue('');
                } else {
                    self.tadescripcion.setValue(escalaselec.descripcion);
                }

                accion = 'mod';
            }.createDelegate(this)
        });

        //Boton para eliminar.
        this.btnEliminarE = new Ext.Button({
            text: this.idioma.btnEliminar,
            disabled: true,
            tooltip: this.idioma.escala.btn_ttDel,
            iconCls: 'eliminar',
            handler: function ()
            {
                eliminarEscala();
            }.createDelegate(this)
        });

        //Botón para Buscar.
        this.btnBuscarE = new Ext.Button({
            text: '<u>B</u>uscar',
            tooltip: this.idioma.escala.btn_ttipBuscar,
            iconCls: 'buscar',
            handler: function ()
            {
                self.stDatos.load({params:{denominacion: self.tfbuscarE.getValue(), start: 0, limit: 15}});
                busc1 = 1;
            }.createDelegate(this)
        });

        //Botón para limpiar.
        this.btnLimpiarE = new Ext.Button({
            text: this.idioma.btnLimpiarEst_text,
            tooltip: this.idioma.btn_ttipLimpiar,
            iconCls: 'limpiar',
            handler: function ()
            {
                self.tfbuscarE.reset();
                self.stDatos.load({params:{start:0,limit:15}});
            }.createDelegate(this)
        });

        //textfield para el buscar
        this.tfbuscarE = new Ext.form.TextField({
            allowBlank : true,
            minLength: 3,
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            width:140,
            name : 'tfbuscador'
        });
		
        //Expander
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        //Fuente de datos del listado.
        this.stDatos = new Ext.data.Store({
            url: '/pvd/maestro/configuraciones/index.php/escala/getEscalas',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idescala", totalProperty: "cantidad"},
                [{name:'idescala'},{name:'denominacion'}, {name:'descripcion'}, {name:'tipo'},
                 {name:'fdesde'}, {name:'fhasta'}, {name:'gestion'}]
            ),
            listeners: {
                load: function () {
                    escalaselec = null;
                    self.btnAdicionar.disable();
                    self.btnModificarE.disable();
                    self.btnEliminarE.disable();
                    if (busc1 == 1 && self.stDatos.getCount()==0) {
                        mostrarMensaje(1, self.idioma.generico.buscar.msg_NoDataBusc);
                        busc1 = 0;
                    } else if (self.stDatos.getCount()==0) {
                        mostrarMensaje(1, self.idioma.generico.mensajes.lbNoDatos);
                    }
                }
            }
        });

        this.stDatos.load({params: {start:0, limit: 15}});


        function mostrartEsc(val) {
            if (val == 1) {
                return 'Escala cualitativa';
            } else {
                return 'Escala num&eacute;rica';
            }
        }

        //Listado de escalas.
        this.gpDatos = new Ext.grid.GridPanel({
            title: 'Listado de escalas',
            store: this.stDatos,
            loadMask: {msg: 'Cargando...'},
            plugins:this.expander,
            tbar: [
                ' ','',
                this.idioma.lbDenominacion+':',
                this.tfbuscarE,
                this.btnBuscarE,
                this.btnLimpiarE,'','-'
            ],
            columns: [this.expander,
                {
                    header: 'Denominaci&oacute;n',
                    width:200,
                    dataIndex: 'denominacion'
                },
                {
                    header: 'Tipo de escala',
                    width:200,
                    dataIndex: 'tipo',
                    renderer: mostrartEsc
                },
                {
                    header: 'Fecha inicio',
                    width:100,
                    dataIndex: 'fdesde'
                },
                {
                    header: 'Fecha fin',
                    width:100,
                    dataIndex: 'fhasta'
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stDatos,
                displayInfo: true
            })
        });

        this.gpDatos.getSelectionModel().on('rowselect', function (n) {
            escalaselec = n.getSelected().data;
            self.btnAdicionar.enable();
            self.btnModificarE.enable();
            self.btnEliminarE.enable();
            if (escalaselec.tipo == 1) {
                self.gpValor.getColumnModel().setHidden(2, false);
                this.stValoresC.load({params:{denominacion: self.tfbuscar.getValue(), idescala: escalaselec.idescala}});
            } else {
                self.gpValor.getColumnModel().setHidden(2, true);
            }
            this.stDatosValor.baseParams.idescala = escalaselec.idescala;
            this.stDatosValor.load({params: {start:0, limit: 15}});
        }, this);

        //Panel con listado.
        this.panel = new Ext.Panel({
            layout: 'fit',
            border: false,
			width: '60%',
            region: 'center',
            items: [this.gpDatos],
            tbar:[
                this.btnAdicionarE,
                this.btnModificarE,
                this.btnEliminarE]
        });
		
		// Nomenclador de valores asociados a la escala
		 //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            text: this.idioma.btnAdicionar,
            tooltip: this.idioma.escala.btn_ttAddV,
            disabled: true,
            iconCls: 'adicionar',
            handler: function ()
            {
                if (escalaselec.tipo == 1) {
                    self.stDatosValor.removeAll();
                    self.stDatosValor.reload();
                    self.windAddValorcualit.show();
                } else {
                    self.ventanaGestion.show();
                    self.formularioGestion.getForm().reset();
                }

            }.createDelegate(this)
        });

        //Boton para eliminar.
        this.btnEliminar = new Ext.Button({
            text: this.idioma.btnEliminar,
            disabled: true,
            tooltip: this.idioma.escala.btn_ttDelV,
            iconCls: 'eliminar',
            handler: function ()
            {
                eliminarValor();
            }.createDelegate(this)
        });

        //Botón para Buscar.
        this.btnBuscar = new Ext.Button({
            text: '<u>B</u>uscar',
            tooltip: this.idioma.escala.btn_ttipBuscarV,
            iconCls: 'buscar',
            handler: function ()
            {
                self.stDatosValor.load({params:{denominacion: self.tfbuscar.getValue(), start: 0, limit: 15}});
                busc = 1;
            }.createDelegate(this)
        });

        //Botón para limpiar.
        this.btnLimpiar = new Ext.Button({
            text: this.idioma.btnLimpiarEst_text,
            tooltip: this.idioma.btn_ttipLimpiar,
            iconCls: 'limpiar',
            handler: function ()
            {
                self.tfbuscar.reset();
                self.stDatosValor.load({params:{start:0,limit:15}});
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
            width:140,
            name : 'tfbuscador'
        });

        this.btnGuardarPeso = new Ext.Button({
            tooltip: 'Guardar peso <u>(Alt+G)</u>',
            iconCls: 'guardar',
            handler: function ()
            {
                var datos = new Array();
                if (self.stDatosValor.modified.length > 0) {
                    Ext.each(self.stDatosValor.modified, function (recs) {
                        datos.push(recs.data);
                    });

                    PVD.mostrarMascara('mascaraEnviarDatos', 'Información', 'Enviando datos...');
                    Ext.Ajax.request({
                        url: '/pvd/maestro/configuraciones/index.php/escala/updatePeso',
                        method: 'POST',
                        params: {
                            valores: Ext.encode(datos)
                        },
                        callback: function (options, success, response) {
                            PVD.ocultarMascara('mascaraEnviarDatos');
                            var responseData = Ext.decode(response.responseText);
                            if (responseData == true) {
                                mostrarMensaje(1, 'Los datos han sido guardados satisfactoriamente.');
                            }
                            self.stDatosValor.removeAll();
                            self.stDatosValor.reload();
                        }
                    });
                } else {
                    mostrarMensaje(1, 'No ha realizado cambios en los valores.');
                }
            }.createDelegate(this)
        });

		//Expander
        this.expander1 = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        //Fuente de datos del listado.
        this.stDatosValor = new Ext.data.Store({
            url: '/pvd/maestro/configuraciones/index.php/escala/getValoresEscala',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idvalor", totalProperty: "cantidad"},
                [{name:'idvalor'}, {name:'valor'}, {name:'idescala'}, {name:'idescalacualitativa'},
                 {name:'idescalanumerica'}, {name:'peso'}, {name:'descripcion'}]
            ),
            listeners: {
                load: function () {
                    valselect = null;
                    self.btnEliminar.disable();
                    if (busc == 1 && self.stDatosValor.getCount()==0) {
                        mostrarMensaje(1, self.idioma.generico.buscar.msg_NoDataBusc);
                        busc = 0;
                    } else if (self.stDatosValor.getCount()==0) {
                        mostrarMensaje(1, self.idioma.generico.mensajes.msg_NoData);
                    }
                },
                beforeload: function(){
                    if(self.gpDatos.getSelectionModel().getCount() == 0)
                        return;
                }
            }
        });

        this.tfPesog = new Ext.form.NumberField({
            allowBlank : false,
            minLength: 1,
            minValue: 1,
            enableKeyEvents: true,
            maskRe : /^([0-9]*)+$/,
            name : 'peso'
        });

        //Listado de valores.
            this.gpValor = new Ext.grid.EditorGridPanel({
            title: 'Listado de valores',
            loadMask: {msg: 'Cargando...'},
            store: this.stDatosValor,
            clicksToEdit: 1,
            plugins:this.expander1,
            tbar: [
                ' ',
                this.idioma.lbDenominacion+':',
                this.tfbuscar,
                this.btnBuscar,
                this.btnLimpiar,'','->',
                this.btnGuardarPeso
            ],
            columns: [this.expander1,
                {
                    header: 'Denominaci&oacute;n',
                    width:200,
                    dataIndex: 'valor'
                },
                {
                    header: 'Peso',
                    width:100,
                    dataIndex: 'peso',
                    hidden: true,
                    editor: this.tfPesog
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stDatosValor,
                displayInfo: true
            })
        });

        this.gpValor.getSelectionModel().on('rowselect', function (n) {
            valselect = n.getSelected().data;
            self.btnEliminar.enable();
        }, this);

        // panel para add, mod, del, ayuda
        this.panel2 = new Ext.Panel({
            layout: 'fit',
			width: '40%',
            region: 'east',
            border: false,
			items: [this.gpValor],
            tbar:[
                this.btnAdicionar, this.btnEliminar,
                '->', '','-',this.btnAyuda]
        });

        //textfield denominacion
        this.tfdenom = new Ext.form.TextField({
            id: 'tfdenom'+self.panel.id,
            fieldLabel: this.idioma.lbDenominacion,
            allowBlank : false,
            maxLength: 100,
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            regexText: self.idioma.msgCaracteres,
            anchor:	'99%',
            name : 'denominacion'
        });

        var arrayTipoEscala = [['0', 'Escala numérica'], ['1', 'Escala cualitativa']];

        this.storeCBTipoEscala = new Ext.data.SimpleStore({
            fields: ['valor', 'tipo'],
            data: arrayTipoEscala
        });

        this.cbTipoEscala = new Ext.form.ComboBox({
            name: 'tipoescala',
            valueField: 'valor',
            typeAhead: true,
            triggerAction: 'all',
            allowBlank: false,
            blankText: 'Seleccione...',
            forceSelection: true,
            fieldLabel: 'Tipo de escala',
            displayField: 'tipo',
            store: this.storeCBTipoEscala,
            mode: 'local',
            emptyText: 'Seleccione...',
            anchor: '99%'
        });

        var fecha = new Date();

        this.dfFInicio = new Ext.form.DateField({
            id: 'dfFInicio'+self.panel.id,
            fieldLabel: 'Fecha inicio',
            name: 'fdesde',
            hiddenname:'fdesde',
            anchor:'97%',
            format:'d/m/Y',
            value: fecha.format('d/m/Y'),
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            minValue:'01/01/1900',
            vtype:'daterange'
        });

        this.dfFFin = new Ext.form.DateField({
            fieldLabel: 'Fecha fin',
            name: 'fhasta',
            hiddenname:'fhasta',
            anchor:'97%',
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            minValue:'01/01/1900',
            startDateField: 'dfFInicio'+self.panel.id,
            vtype:'daterange',
        });

        // Area de texto Descripción de la Facultad de decisión
        this.tadescripcion = new Ext.form.TextArea({
            fieldLabel: 'Descripci&oacute;n',
            name: 'descripcion',
            anchor:	'99%',
            height: 100,
            hiddenname: 'descripcion',
            maxLength: 255,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            allowBlank:	true
        });

        //Formulario de gestion.
        this.formularioGestionE = new Ext.FormPanel({
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
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.cbTipoEscala]
                    },{
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.dfFInicio]
                    },{
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

        this.btnCancelarE = new Ext.Button({
            nextTab: 'tfdenom'+self.panel.id,
            iconCls: 'cancelar',
            tooltip: this.idioma.textToolTipCancelar,
            text: this.idioma.lbBtnCancelar,
            handler: function ()
            {
                self.formularioGestionE.getForm().reset();
                self.ventanaGestionE.hide();
            }.createDelegate(this)
        });

        this.btnAceptarE = new Ext.Button({
            nextTab: 'tfdenom'+self.panel.id,
            iconCls: 'aceptar',
            tooltip: this.idioma.textToolTipAceptar,
            text: this.idioma.lbBtnAceptar,
            listeners: {
                'enable': function()
                {
                    self.btnCancelarE.nextTab = 'btnAplicarE';
                },
                'disable': function()
                {
                    self.btnCancelarE.nextTab = 'tfdenom'+self.panel.id;
                }
            },
            handler: function ()
            {
                GuardarEscala('ACP');
            }.createDelegate(this)
        });

        this.btnAplicarE = new Ext.Button({
            id: 'btnAplicarE',
            iconCls: 'aplicar',
            tooltip: this.idioma.textToolTipAplicar,
            text: this.idioma.lbBtnAplicar,
            handler: function ()
            {
                GuardarEscala('APL');
            }.createDelegate(this)
        });

        //Ventana de gestion.
        this.ventanaGestionE = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            title: this.idioma.lbCrearTP,
            width: 400,
            height: 360,
            items: [this.formularioGestionE],
            buttons: [
                this.btnCancelarE,
                this.btnAplicarE,
                this.btnAceptarE
            ],
            listeners: {
                'beforeshow': function()
                {
                    self.tfdenom.focus(true, 500);
                },
                'hide': function()
                {
                    self.btnAdicionarE.focus();
                }
            },
            keys: [{
                key: 'x',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnCancelarE.disabled) {
                        self.btnCancelarE.handler();
                    }
                }
            },
                {
                    key: 'p',
                    alt: true,
                    ctrl: true,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAplicarE.disabled) {
                            self.btnAplicarE.handler();
                        }
                    }
                },
                {
                    key: 13,
                    stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarE.disabled) {
                            self.btnAceptarE.handler();
                        }
                    }
                }]
        });

        // Add Valor numerico

        this.tfValorinicial= new Ext.form.NumberField({
             fieldLabel: 'Valor inicial',
             name: 'valorinicial',
             allowBlank: false,
             allowNegative: false,
             minValue: 0,
             maxValue: 999,
             anchor: '100%'
         });

        this.tfValorfinal = new Ext.form.NumberField({
             fieldLabel: 'Valor final',
             allowBlank: false,
             allowNegative: false,
             minValue: 0.01,
             maxValue: 900000000,
             anchor: '100%',
             name : 'vfinal'
         });

        this.tfPaso = new Ext.form.NumberField({
             fieldLabel: 'Paso',
             name: 'paso',
             allowBlank: false,
             allowNegative: false,
             value: 1,
             minValue: 0,
             maxValue: 999,
             anchor: '100%'
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
                        items: [this.tfValorinicial]
                    },{
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.tfValorfinal]
                    },
                    {
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.tfPaso]
                    }]
            }]
        });

        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: this.idioma.textToolTipCancelar,
            text: this.idioma.lbBtnCancelar,
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
            text: this.idioma.lbBtnAceptar,
            handler: function ()
            {
                guardarValorNum();
            }.createDelegate(this)
        });

        //Ventana de gestion.
        this.ventanaGestion = new Ext.Window({
            title: 'Adicionar rango num&eacute;rico',
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 300,
            height: 240,
            items: [this.formularioGestion],
            buttons: [
                this.btnCancelar,
                this.btnAceptar
            ],
            listeners: {
                'beforeshow': function()
                {
                    self.tfValorinicial.focus(true, 500);
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
                    key: 13,
                    //stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptar.disabled) {
                            self.btnAceptar.handler();
                        }
                    }
                }]
        });

        //Add valor cualitativo
        this.stValoresC = new Ext.data.Store({
            url: '/pvd/maestro/configuraciones/index.php/escala/getValoresCualitativos',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idvalorcualitativo"},
                [{name:'idvalorcualitativo'}, {name:'denominacion'}, {name:'descripcion'}, {name:'peso'}]
            )
        });

        this.smselectV = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.tfPeso= new Ext.form.NumberField({
            allowBlank : false,
            minLength: 1,
            minValue: 1,
            enableKeyEvents: true,
            maskRe : /^([0-9]*)+$/,
            name : 'peso'
        });

        this.columnasgpC = new Ext.grid.ColumnModel([
            this.smselectV,
            {
                header: 'Denominaci&oacute;n',
                width:260,
                dataIndex: 'denominacion',
                sortable : false
            },{
                header: 'Peso',
                width: 100,
                dataIndex: 'peso',
                sortable : false,
                editor: this.tfPeso
            }
        ]);

        //Botón para Buscar.
        this.btnBuscarV = new Ext.Button({
            text: '<u>B</u>uscar',
            tooltip: this.idioma.escala.btn_ttipBuscarV,
            iconCls: 'buscar',
            handler: function ()
            {
                self.stValoresC.load({params:{denominacion: self.tfbuscarV.getValue()}});
            }.createDelegate(this)
        });

        //Botón para limpiar.
        this.btnLimpiarV = new Ext.Button({
            text: this.idioma.btnLimpiarEst_text,
            tooltip: this.idioma.btn_ttipLimpiar,
            iconCls: 'limpiar',
            handler: function ()
            {
                self.tfbuscarV.reset();
                self.stValoresC.load();
            }.createDelegate(this)
        });

        //textfield para el buscar
        this.tfbuscarV = new Ext.form.TextField({
            allowBlank : true,
            minLength: 1,
            maxLength: 100,
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            width:140,
            name : 'tfbuscador'
        });
        this.gpValoresC = new Ext.grid.EditorGridPanel({
            sm: this.smselectV,
            tbar: [
                ' ','',
                this.idioma.lbDenominacion+':',
                this.tfbuscarV,
                this.btnBuscarV,
                this.btnLimpiarV,'','-'
            ],
            clicksToEdit: 1,
            region: 'center',
            border: false,
            height: 300,
            loadMask: {msg: 'Cargando...'},
            store: this.stValoresC,
            autoScroll: true,
            cm: this.columnasgpC
        });

        this.btnCancelarC = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: this.idioma.textToolTipCancelar,
            text: this.idioma.lbBtnCancelar,
            handler: function ()
            {
                self.windAddValorcualit.hide();
            }.createDelegate(this)
        });

        this.btnAceptarC = new Ext.Button({
            nextTab: 'tfdenomp'+self.panel.id,
            iconCls: 'aceptar',
            tooltip: this.idioma.textToolTipAceptar,
            text: this.idioma.lbBtnAceptar,
            handler: function ()
            {
                guardarValorCual();
            }.createDelegate(this)
        });

        //Ventana de gestion.
        this.windAddValorcualit = new Ext.Window({
            title: 'Adicionar valores cualitativos',
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 420,
            height: 320,
            items: [this.gpValoresC],
            buttons: [
                this.btnCancelarC,
                this.btnAceptarC
            ],
            listeners: {
                'hide': function()
                {
                    self.btnAdicionar.focus();
                    self.gpValoresC.getSelectionModel().clearSelections();
                }
            },
            keys: [{
                key: 'x',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnCancelarC.disabled) {
                        self.btnCancelarC.handler();
                    }
                }
            },
                {
                    key: 13,
                    //stopEvent: true,
                    fn: function () {
                        if (!self.btnAceptarC.disabled) {
                            self.btnAceptarC.handler();
                        }
                    }
                }]
        });

        this.items = [this.panel2, this.panel];

        this.panel.on('render', function ()
        {
            self.btnAdicionarE.focus();
        });

        function GuardarEscala(btnpress)
        {
            if(self.formularioGestionE.getForm().isValid()){
                Ext.Ajax.request({
                    url: (accion == 'add' ? '/pvd/maestro/configuraciones/index.php/escala/addEscala' : '/pvd/maestro/configuraciones/index.php/escala/updateEscala'),
                    params: {
                        idescala: accion == 'add' ? -1 : escalaselec.idescala,
                        tipo: self.cbTipoEscala.getValue(),
                        denominacion: self.tfdenom.getValue(),
                        fdesde: self.dfFInicio.getRawValue(),
                        fhasta: self.dfFFin.getRawValue(),
                        descripcion: self.tadescripcion.getValue()
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if(accion == 'mod')
                            {
                                mostrarMensaje(1, self.idioma.escala.msgModTSucces);
                            }else{
                                mostrarMensaje(1, self.idioma.escala.msgAddTSucces);
                            }
                            if (btnpress == 'ACP')
                            {
                                self.ventanaGestionE.hide();
                            }
                            determinado = 0;
                            self.formularioGestionE.getForm().reset();
                            self.stDatos.removeAll();
                            self.stDatos.reload();
                        } else {
                            mostrarMensaje(6, self.idioma.escala.msgTExistem);
                        }
                    }
                });
            }
        }

		function guardarValorNum()
        {
            if(self.formularioGestion.getForm().isValid()){
                if (self.tfValorinicial.getValue() < self.tfValorfinal.getValue()) {
                    Ext.Ajax.request({
                        url: '/pvd/maestro/configuraciones/index.php/escala/addValorEscala',
                        params: {
                            idescala: escalaselec.idescala,
                            tipo: escalaselec.tipo,
                            vinicial: self.tfValorinicial.getValue(),
                            vfinal: self.tfValorfinal.getRawValue(),
                            paso: self.tfPaso.getRawValue()
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == true) {
                                mostrarMensaje(1, 'El rango num&eacute;rico ha sido adicionado satisfactoriamente.');
                                self.ventanaGestion.hide();
                                self.formularioGestion.getForm().reset();
                                self.stDatosValor.removeAll();
                                self.stDatosValor.reload();
                            }

                        }
                    });
                } else {
                    self.tfValorinicial.markInvalid('El valor inicial debe ser menor que el valor final.');
                    self.tfValorfinal.markInvalid('El valor final debe ser mayor que el valor inicial.');
                }
            }
        }

        function guardarValorCual()
        {
            var ids = new Array();
            var s = self.gpValoresC.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data);
            }
            if(s.length > 0){
                Ext.Ajax.request({
                    url: '/pvd/maestro/configuraciones/index.php/escala/addValorEscala',
                    params: {
                        idescala: escalaselec.idescala,
                        tipo: escalaselec.tipo,
                        valores: Ext.encode(ids)
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData == true) {
                            mostrarMensaje(1, 'Los valores cualitativos han sido adicionados satisfactoriamente.');
                            self.windAddValorcualit.hide();
                            self.stDatosValor.removeAll();
                            self.stDatosValor.reload();
                        }

                    }
                });
            } else {
                mostrarMensaje(6, 'Debe seleccionar al menos un valor cualitativo.');
            }
        }

        function eliminarEscala()
        {
            var ids = new Array();
            var s = self.gpDatos.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idescala);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar la escala seleccionada?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar las escalas seleccionadas?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(self.idioma.msgEspereDelete);
                    Ext.Ajax.request({
                        url: '/pvd/maestro/configuraciones/index.php/escala/deleteEscala',
                        params: {escalas: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'La escala seleccionada no puede ser eliminado debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguno de las escalas seleccionadas no puede ser eliminada debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'La escala ha sido eliminada satisfactoriamente.';
                                } else {
                                    mensaje = 'Las escalas han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            self.stDatos.removeAll();
                            self.stDatos.reload();
                            self.stDatosValor.removeAll();
                        }
                    });
                }
            });
        }
		
		function eliminarValor()
        {
            var ids = new Array();
            var s = self.gpValor.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                if (escalaselec.tipo == 1) {
                    ids.push(s[i].data.idescalacualitativa);
                } else {
                    ids.push(s[i].data.idescalanumerica);
                }

            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar el valor seleccionado?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar los valores seleccionados?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando datos. Por favor espere...');
                    Ext.Ajax.request({
                        url: '/pvd/maestro/configuraciones/index.php/escala/deleteValorEscala',
                        params: {
                            tipo: escalaselec.tipo,
                            valores: Ext.encode(ids)
                        },
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if(responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'El valor seleccionado no puede ser eliminado debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguno de los valores seleccionados no puede ser eliminado debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'El valor ha sido eliminado satisfactoriamente.';
                                } else {
                                    mensaje = 'Los valores han sido eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            self.stDatosValor.removeAll();
                            self.stDatosValor.reload();
                        }
                    });
                }
            });
        }

        function resetearFormEscala(){
            self.tfdenom.reset();
            self.cbTipoEscala.reset();
            self.dfFInicio.reset();
            self.dfFFin.reset();
            self.tadescripcion.reset();
        }

        this.keys = [
            {
                key: 'i',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnAdicionar.disabled) {
                        self.btnAdicionar.handler();
                    } else if (!self.btnAdicionarE.disabled) {
                        self.btnAdicionarE.handler();
                    }

                }
            },
            {
                key: 'm',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.btnModificarE.disabled) {
                        self.btnModificarE.handler();
                    }
                }
            },
            {
                key: 'b',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (self.tfbuscarE.getValue() != '') {
                        self.btnBuscarE.handler();
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
                    } else if (self.tfbuscarE.getValue() != '') {
                        self.btnLimpiarE.handler();
                    }
                }
            },
            {
                key: 46,//Eliminar
                //stopEvent: true,
                fn: function () {
                    if (!self.btnEliminar.disabled) {
                        self.btnEliminar.handler();
                    } else if (!self.btnEliminarE.disabled) {
                        self.btnEliminarE.handler();
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

        Pvd.Maestro.Configuraciones.Escala.superclass.initComponent.call(this);
    }
});
