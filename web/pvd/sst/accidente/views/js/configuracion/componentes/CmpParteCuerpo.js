
/*
 * Componente Parte del cuerpo.
 *
 * @author Ing. Eddy Santana Navarro
 * @package Pvd.Sst.Accidente
 * @uses Pvd.Sst.Accidente.Configuracion.Nomencladores
 * @copyright XETID
 * @version 1.0
 */ 
 
Ext.ns("Pvd.Sst.Accidente.Configuracion.Nomencladores");
Pvd.Sst.Accidente.Configuracion.Nomencladores.Partecuerpo = Ext.extend(Ext.Panel,{
    layout: 'border',
    id: 'partecuerpo',
    title: 'Parte del cuerpo',
    region: 'center',
    height: '100%',
    closable: true,
    iconCls: '',
    initComponent: function () {
        //Variables
        var self = this;
        var modselect, accion;
        var busc = 0;
        //Expander
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        //Botón ayuda
        this.btnAyuda = new Ext.Button({
            text: this.idioma.BtnAyuda,
            iconCls:'ayuda',
            disabled: false
        });

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            text: this.idioma.BtnAdicionar,
            tooltip: this.idioma.lbBtnAdicionarPC,
            iconCls: 'adicionar',
            handler: function ()
            {
                self.ventanaGestion.setTitle(self.idioma.msgAddPC);
                self.ventanaGestion.show();
                self.btnAplicar.show();
                self.formularioGestion.getForm().reset();
                accion = 'add';
            }.createDelegate(this)
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            text: this.idioma.BtnModificar,
            disabled: true,
            tooltip: this.idioma.lbBtnModificarPC,
            iconCls: 'modificar',
            handler: function ()
            {
                self.ventanaGestion.setTitle(self.idioma.msgModPC);
                self.ventanaGestion.show();
                self.btnAplicar.hide();
                self.tfdenom.setValue(modselect.denominacion);
                if (modselect.descripcion == 'Sin descripci&oacute;n') {
                    self.tadescripcion.setValue(null);
                } else {
                    self.tadescripcion.setValue(modselect.descripcion);
                }
                self.dfFInicio.setValue(modselect.fdesde);
                self.dfFFin.setValue(modselect.fhasta);
                accion = 'mod';
            }.createDelegate(this)
        });

        //Botón para eliminar.
        this.btnEliminar = new Ext.Button({
            text: this.idioma.BtnEliminar,
            disabled: true,
            tooltip: this.idioma.lbBtnEliminarPC,
            iconCls: 'eliminar',
            handler: function ()
            {
                eliminar();
            }.createDelegate(this)
        });

        //Botón para Buscar.
        this.btnBuscar = new Ext.Button({
            text: this.idioma.BtnBuscar,
            tooltip: this.idioma.lbBtnBuscarPC,
            iconCls: 'buscar',
            handler: function ()
            {
                self.stParteCuerpo.load({params:{denominacion: self.tfbuscar.getValue(), start: 0, limit: 15}});
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
                self.stParteCuerpo.load({params:{start:0,limit:15}});
            }.createDelegate(this)
        });

        //textfield para el buscar
        this.tfbuscar = new Ext.form.TextField({
            allowBlank : true,
            minLength: 3,
            enableKeyEvents: true,
            maskRe : /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width: 140,
            name : 'tfbuscador'
        });

        //Fuente de datos del listado.
        this.stParteCuerpo = new Ext.data.Store({
            url: '/pvd/sst/accidente/index.php/nompartecuerpo/getParteCuerpo',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idpartecuerpo", totalProperty: "cantidad"},
                [{name:'idpartecuerpo'},{name:'denominacion'}, {name:'descripcion'}, {name:'fdesde'}, {name:'fhasta'}, {name:'gestion'}]
            ),
            listeners: {
                load: function (st) {
                    modselect = null;
                    self.btnModificar.disable();
                    self.btnEliminar.disable();
                    if (busc == 1 && st.getCount()==0) {
                        mostrarMensaje(1, self.idioma.lbNoDatosBusc);
                        busc = 0;
                    } else if (st.getCount()==0) {
                        mostrarMensaje(1, self.idioma.lbNoDatos);
                    }
                }
            }
        });

        this.stParteCuerpo.load({params: {start:0, limit: 15}});

        function mostrartt(val, metaData, record) {
            if (record.get('gestion') == 0) {
                metaData.attr = 'ext:qtip="' + self.idioma.ttNoGestionable + '"';
                if (val) {
                    return '<span style="color:#707070;">' + val + '</span>';
                }
            }
            return val;
        }
        //Listado de partes del cuerpo.
        this.gpParteCuerpo = new Ext.grid.GridPanel({
            store: this.stParteCuerpo,
            plugins: this.expander,
            tbar: [
                '-','',
                this.idioma.lbDenominacion + ':',
                this.tfbuscar,
                this.btnBuscar,
                this.btnLimpiar,'','-'
            ],
            columns: [this.expander,
                {
                    header: this.idioma.lbDenominacion,
                    width:300,
                    dataIndex: 'denominacion',
                    renderer: mostrartt
                },
                {
                    header: this.idioma.lbColDesde,
                    width:100,
                    dataIndex: 'fdesde',
                    renderer: mostrartt
                } ,
                {
                    header: this.idioma.lbColHasta,
                    width:100,
                    dataIndex: 'fhasta',
                    renderer: mostrartt
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stParteCuerpo,
                displayInfo: true
            })
        });

        this.gpParteCuerpo.getSelectionModel().on('rowselect', function (n) {
            modselect = n.getSelected().data;
            if (modselect.gestion == 1) {
                self.btnModificar.enable();
                self.btnEliminar.enable();
            } else {
                self.btnModificar.disable();
                self.btnEliminar.disable();
            }
        }, this);

        //Panel con listado.
        this.panel = new Ext.Panel({
            layout: 'fit',
            border: false,
            region: 'center',
            items: [this.gpParteCuerpo]
        });

        // panel para add, mod, del, ayuda
        this.panel2 = new Ext.Panel({
            layout: 'fit',
            region: 'north',
            border: false,
            tbar:[
                this.btnAdicionar,
                this.btnModificar,
                this.btnEliminar,'-',
                '->', '','-',this.btnAyuda]
        });

        //textfield denominacion
        this.tfdenom = new Ext.form.TextField({
            id: 'tfdenompc' + self.panel.id,
            fieldLabel: this.idioma.lbDenominacion,
            allowBlank : false,
            maxLength: 100,
            enableKeyEvents: true,
            //regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ(),\\+\-_/.\s]$/,
            regexText: self.idioma.msgCaracteres,
            anchor: '99%',
            name : 'denominacion'
        });

        var fecha = new Date();

        this.dfFInicio = new Ext.form.DateField({
            id: 'dfFIniciopc' + self.panel.id,
            fieldLabel: this.idioma.lbFechaInicio,
            name: 'fdesde',
            hiddenname: 'fdesde',
            anchor:'97%',
            format:'d/m/Y',
            value: fecha.format('d/m/Y'),
            editable: false,
            readOnly : true,
            maxValue: '31/12/2100',
            maxText : this.idioma.lbFechaMaxima,
            minValue:'01/01/1900',
            minText : this.idioma.lbFechaMinima,
            invalidText: this.idioma.invalidTextFecha,
            vtype: 'daterange'
        });

        this.dfFFin = new Ext.form.DateField({
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
            startDateField: 'dfFIniciopc' + self.panel.id,
            vtype:'daterange'
        });

        // Area de texto Descripción de la parte del cuerpo
        this.tadescripcion = new Ext.form.TextArea({
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
        this.formularioGestion = new Ext.FormPanel({
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
                    },{
                        columnWidth:0.5,
                        layout: 'form',
                        items: [this.dfFInicio]
                    },{
                        columnWidth:0.5,
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
            nextTab: 'tfdenompc' + self.panel.id,
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
            nextTab: 'tfdenompc' + self.panel.id,
            iconCls: 'aceptar',
            tooltip: this.idioma.textToolTipAceptar,
            text: this.idioma.lbtnAceptar,
            listeners: {
                'enable': function()
                {
                    self.btnCancelar.nextTab = 'btnAplicarpc';
                },
                'disable': function()
                {
                    self.btnCancelar.nextTab = 'tfdenompc'+self.panel.id;
                }
            },
            handler: function ()
            {
                guardarDatos('ACP');
            }.createDelegate(this)
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicarpc',
            iconCls: 'aplicar',
            tooltip: this.idioma.textToolTipAplicar,
            text: this.idioma.lbtnAplicar,
            handler: function ()
            {
                guardarDatos('APL');
            }.createDelegate(this)
        });

        //Ventana de gestion.
        this.ventanaGestion = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 400,
            height: 310,
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
                    fn: function () {
                        if (!self.btnAplicar.disabled) {
                            self.btnAplicar.handler();
                        }
                    }
                },
                {
                    key: 13,
                    fn: function () {
                        if (!self.btnAceptar.disabled) {
                            self.btnAceptar.handler();
                        }
                    }
                }]
        });



        this.items = [this.panel2, this.panel];

        this.panel2.on('render', function ()
        {
            self.btnAdicionar.focus();
        });

        this.ventanaGestion.on('hide', function ()
        {
            self.btnAdicionar.focus();
        });

        function guardarDatos(btnpress)
        {
            if(self.formularioGestion.getForm().isValid()){
                Ext.Ajax.request({
                    url: (accion == 'add' ? '/pvd/sst/accidente/index.php/nompartecuerpo/addParteCuerpo' : '/pvd/sst/accidente/index.php/nompartecuerpo/updateParteCuerpo'),
                    params: {
                        idpartecuerpo: accion == 'add' ? -1 : modselect.idpartecuerpo,
                        descripcion: self.tadescripcion.getValue(),
                        denominacion: self.tfdenom.getValue(),
                        fdesde: self.dfFInicio.getRawValue(),
                        fhasta: self.dfFFin.getRawValue()
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if(accion == 'mod')
                            {
                                mostrarMensaje(1, self.idioma.msgModPCSucces);
                            }else{
                                mostrarMensaje(1, self.idioma.msgAddPCSucces);
                            }
                            if (btnpress == 'ACP')
                            {
                                self.ventanaGestion.hide();
                            }
                            self.formularioGestion.getForm().reset();
                            self.stParteCuerpo.removeAll();
                            self.stParteCuerpo.reload();
                        } else {
                            mostrarMensaje(3,self.idioma.msgPCExistem);
                        }                            
                    }
                });
            }
        }

        function eliminar()
        {
            var ids = new Array();
            var s = self.gpParteCuerpo.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idpartecuerpo);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar la parte del cuerpo seleccionada?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar las partes del cuerpo seleccionadas?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(self.idioma.lbTitMsgEliminando);
                    Ext.Ajax.request({
                        url: '/pvd/sst/accidente/index.php/nompartecuerpo/deleteParteCuerpo',
                        params: {partes: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'La parte del cuerpo seleccionada no puede ser eliminada debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguna de las partes del cuerpo seleccionadas no puede ser eliminada debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'La parte del cuerpo ha sido eliminada satisfactoriamente.';
                                } else {
                                    mensaje = 'Las partes del cuerpo han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            self.stParteCuerpo.removeAll();
                            self.stParteCuerpo.reload();
                        }
                    });
                }
            });
        }

        this.keys = [
            {
                key: 'i',
                alt: true,
                fn: function () {
                    if (!self.btnAdicionar.disabled) {
                        self.btnAdicionar.handler();
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
                    }
                }
            },
            {
                key: 46,//Eliminar
                fn: function () {
                    if (!self.btnEliminar.disabled) {
                        self.btnEliminar.handler();
                    }
                }
            },
            {
                key: 'h',
                alt: true,
                fn: function () {
                    if (!self.btnAyuda.disabled) {
                        self.btnAyuda.handler();
                    }
                }
            },
            {
                key: 'b',
                alt: true,
                fn: function () {
                    if (!self.btnBuscar.disabled) {
                        self.btnBuscar.handler();
                    }
                }
            },
            {
                key: 'l',
                alt: true,
                fn: function () {
                    if (!self.btnLimpiar.disabled) {
                        self.btnLimpiar.handler();
                    }
                }
            }
        ];

        Pvd.Sst.Accidente.Configuracion.Nomencladores.Partecuerpo.superclass.initComponent.call(this);
    }
});
