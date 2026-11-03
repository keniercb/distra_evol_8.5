
/*
 * Nomenclador Periodo Vacacional.
 *
 * @author Ing. Yalenis Arcos Valdés
 * @package Pvd.Maestro
 * @uses Pvd.Maestro.Configuraciones
 * @copyright XETID
 * @version 1.0
 */

Ext.ns("Pvd.Maestro.Configuraciones");
Pvd.Maestro.Configuraciones.NomPeriodoVacaciones = Ext.extend(Ext.Panel,{
    layout: 'border',
    id: 'pPeriodoVacacional',
    title: 'Périodo Vacacional',
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
            text: 'Ayuda',
            iconCls:'ayuda',
            disabled: false
        });

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            text: this.idioma.btnAdicionar,
            tooltip: this.idioma.periodovacaciones.btn_ttAdd,
            iconCls: 'adicionar',
            handler: function ()
            {
                self.ventanaGestion.setTitle(self.idioma.periodovacaciones.win_TituloAdd);
                self.ventanaGestion.show();
                self.btnAplicar.show();
                self.formularioGestion.getForm().reset();
                accion = 'add';
            }.createDelegate(this)
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            text: this.idioma.btnModificar,
            //disabled: false,
            tooltip: this.idioma.periodovacaciones.btn_ttMod,
            iconCls: 'modificar',
            handler: function ()
            {
                self.ventanaGestion.setTitle(self.idioma.periodovacaciones.win_TituloMod);
                self.ventanaGestion.show();
                self.btnAplicar.hide();
                self.tfTiempoOtorgar.setValue(modselect.tiempootorgar);
                self.tfTiempoDescontar.setValue(modselect.tiempodescontar);
                if (modselect.descripcion == 'Sin descripci&oacute;n') {
                    self.tadescripcion.setValue(null);
                } else {
                    self.tadescripcion.setValue(modselect.descripcion);
                }
                self.dfFInicio.setValue(modselect.fechainicio);
                self.dfFFin.setValue(modselect.fechafin);
                accion = 'mod';
            }.createDelegate(this)
        });

        //Botón para eliminar.
        this.btnEliminar = new Ext.Button({
            text: this.idioma.btnEliminar,
            //disabled: false,
            tooltip: this.idioma.periodovacaciones.btn_ttDel,
            iconCls: 'eliminar',
            handler: function ()
            {
                eliminar();
            }.createDelegate(this)
        });

        //Fuente de datos del listado.
        this.stDatos = new Ext.data.Store({
            url: '/pvd/maestro/configuraciones/index.php/nomperiodovacaciones/obtenerListadoPeriodosVacaciones',
            reader:new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idperiodovacaciones" },
                [ 	 {name: 'idperiodovacaciones'}
                    ,{name: 'tiempootorgar'}
                    ,{name: 'tiempodescontar'}
                    ,{name: 'fechainicio'}
                    ,{name: 'fechafin'}
                    ,{name: 'descripcion'}
                ]),
            listeners: {
                load: function (st) {
                    modselect = null;
                    //self.btnModificar.disable();
                    //self.btnEliminar.disable();
                    if (busc == 1 && st.getCount()==0) {
                        mostrarMensaje(1, self.idioma.lbNoDatosBusc);
                        busc = 0;
                    } else if (st.getCount()==0) {
                        mostrarMensaje(1, self.idioma.lbNoDatos);
                    }
                }
            }
        });

        this.stDatos.load({params: {start:0, limit: 15}});

        /*function mostrartt(val, metaData, record) {
            if (record.get('gestion') == 0) {
                metaData.attr = 'ext:qtip="No gestionable"';
            }
            return val;
        }*/

        //Listado de tipos de acción.
        this.gpDatos = new Ext.grid.GridPanel({
            store: this.stDatos,
            plugins: this.expander,
            columns: [{header: 'idperiodovacaciones',	hidden: true, hideable: false, dataIndex: 'idperiodovacaciones'}
                ,this.expander
                ,{header: 'Días naturales', width: 200, sortable: true,	dataIndex: 'tiempootorgar'/*, renderer:mostrartt*/}
                ,{header: 'Días hábiles', width: 200, sortable: true, dataIndex: 'tiempodescontar'/*, renderer:mostrartt*/}
                ,{header: 'Fecha inicio', width: 90, sortable: true, dataIndex: 'fechainicio'/*, renderer:mostrartt*/}
                ,{header: 'Fecha fin', width: 90, sortable: true, dataIndex: 'fechafin'/*, renderer:mostrartt*/}
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stDatos,
                displayInfo: true
            })
        });

        this.gpDatos.getSelectionModel().on('rowselect', function (n) {
            modselect = n.getSelected().data;
            // if (modselect.gestion == 1) {
            //     self.btnModificar.enable();
            //     self.btnEliminar.enable();
            // } else {
            //     self.btnModificar.disable();
            //     self.btnEliminar.disable();
            // }
        }, this);

        //Panel con listado.
        this.panel = new Ext.Panel({
            layout: 'fit',
            border: false,
            region: 'center',
            items: [this.gpDatos]
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

        //Campo del formulario de períodos de vacaciones.
        this.tfTiempoOtorgar = new Ext.form.NumberField({
            id:'idtfTiempoOtorgar',
            fieldLabel:self.idioma.periodovacaciones.columna1,
            tabIndex: 1, name: 'tiempootorgar',
            allowBlank: false,
            anchor: '90%',
            prevTab: 'idbtnAceptarPerVac',
            nextTab: 'idtfTiempoDescontar',
            blankText:self.idioma.periodovacaciones.lbErrorCampoVacio,
            maxLength: 5,
            maxLengthText : self.idioma.periodovacaciones.lbMaxText_5,
            maskRe :/[0-9.]/i,
            regex :/^\d+(\.\d{1,2})?$/i,
            regexText:self.idioma.periodovacaciones.lbErrorFormatoNum,
            maxValue: 30,
            maxText : self.idioma.periodovacaciones.lbDiasOtorgarMaxText,
        });

        this.tfTiempoDescontar = new Ext.form.NumberField({
            id:'idtfTiempoDescontar',
            fieldLabel:self.idioma.periodovacaciones.columna2,
            tabIndex: 2, name: 'tiempodescontar',
            allowBlank: false,
            anchor: '99%',
            blankText:self.idioma.periodovacaciones.lbErrorCampoVacio,
            maxLength: 5,
            maxLengthText : self.idioma.periodovacaciones.lbMaxText_5,
            maskRe :/[0-9.]/i,
            regex :/^\d+(\.\d{1,2})?$/i,
            regexText:self.idioma.periodovacaciones.lbErrorFormatoDescNum,
            maxValue: 24,
            maxText : self.idioma.periodovacaciones.lbDiasDescontarMaxText,
        });

        var fecha = new Date();

        this.dfFInicio = new Ext.form.DateField({
            id: 'dfFInicioc' + self.panel.id,
            fieldLabel: this.idioma.periodovacaciones.columna3,
            name: 'fechainicio',
            hiddenname: 'fechainicio',
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
            fieldLabel: this.idioma.periodovacaciones.columna4,
            name: 'fechafin',
            hiddenname:'fechafin',
            anchor:'97%',
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            maxText : this.idioma.lbFechaMaxima,
            minValue:'01/01/1900',
            minText : this.idioma.lbFechaMinima,
            invalidText: this.idioma.invalidTextFecha,
            startDateField: 'dfFInicioc' + self.panel.id,
            vtype:'daterange'
        });

        // Area de texto Descripción del curso
        this.tadescripcion = new Ext.form.TextArea({
            fieldLabel: 'Descripci&oacute;n',
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
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [this.tfTiempoOtorgar]
                    }, {
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [this.tfTiempoDescontar]
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
            nextTab: 'tfdenomc' + self.panel.id,
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
            nextTab: 'tfdenomc' + self.panel.id,
            iconCls: 'aceptar',
            tooltip: this.idioma.textToolTipAceptar,
            text: this.idioma.lbBtnAceptar,
            listeners: {
                'enable': function()
                {
                    self.btnCancelar.nextTab = 'btnAplicarc';
                },
                'disable': function()
                {
                    self.btnCancelar.nextTab = 'tfdenomc'+self.panel.id;
                }
            },
            handler: function ()
            {
                guardarDatos('ACP');
            }.createDelegate(this)
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicarc',
            iconCls: 'aplicar',
            tooltip: this.idioma.textToolTipAplicar,
            text: this.idioma.lbBtnAplicar,
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
                    //self.tfdenom.focus(true, 500);
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
                    url: (accion == 'add' ? '/pvd/maestro/configuraciones/index.php/nomperiodovacaciones/adicionarPeriodoVacaciones' : '/pvd/maestro/configuraciones/index.php/nomperiodovacaciones/modificarPeriodoVacaciones'),
                    params: {
                        idperiodovacaciones: accion == 'add' ? -1 : modselect.idperiodovacaciones,
                        tiempootorgar : self.tfTiempoOtorgar.getValue(),
                        tiempodescontar : self.tfTiempoDescontar.getValue(),
                        descripcion: self.tadescripcion.getValue(),
                        fechainicio: self.dfFInicio.getRawValue(),
                        fechafin: self.dfFFin.getRawValue()
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if(accion == 'mod')
                            {
                                mostrarMensaje(1, self.idioma.periodovacaciones.msgModTSucces);
                            }else{
                                mostrarMensaje(1, self.idioma.periodovacaciones.msgAddTSucces);
                            }
                            if (btnpress == 'ACP')
                            {
                                self.ventanaGestion.hide();
                            }
                            self.formularioGestion.getForm().reset();
                            self.stDatos.removeAll();
                            self.stDatos.reload();
                        } else {
                            mostrarMensaje(3,self.idioma.periodovacaciones.msgTExistem);
                        }
                    }
                });
            }
        }

        function eliminar()
        {
            // var ids = new Array();
            // var s = self.gpDatos.getSelectionModel().getSelections();
            // for(i = 0; i < s.length; i++) {
            //     ids.push(s[i].data.idperiodovacaciones);
            // }
            // var mensaje = '';
            // if (s.length == 1) {
                mensaje = self.idioma.periodovacaciones.msg1Eliminar;
            // } else {
            //     mensaje = self.idioma.periodovacaciones.msg2Eliminar;
            // }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(self.idioma.lbTitMsgEliminando);
                    Ext.Ajax.request({
                        url: '/pvd/maestro/configuraciones/index.php/nomperiodovacaciones/eliminarPeriodoVacaciones',
                        params: {idperiodovacaciones: modselect.idperiodovacaciones},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                // if (s.length == 1) {
                                    mensaje = self.idioma.periodovacaciones.msg1DeleteFailT;
                                // } else {
                                //     mensaje = self.idioma.periodovacaciones.msg2DeleteFailT;
                                // }
                                mostrarMensaje(6, mensaje);
                            } else {
                                // if (s.length == 1) {
                                    mensaje = self.idioma.periodovacaciones.msg1DeleteSuccesT;
                                // } else {
                                //     mensaje = self.idioma.periodovacaciones.msg2DeleteSuccesT;
                                // }
                                mostrarMensaje(1, mensaje);
                            }
                            self.stDatos.removeAll();
                            self.stDatos.reload();
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
            }
        ];

        Pvd.Maestro.Configuraciones.NomPeriodoVacaciones.superclass.initComponent.call(this);
    }
});
