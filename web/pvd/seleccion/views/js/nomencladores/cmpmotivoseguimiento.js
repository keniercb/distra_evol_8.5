
/*
 * Componente Motivo de seguimiento.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Seleccion
 * @uses Pvd.Seleccion.Nomencladores.MotSeguimiento
 * @copyright XETID
 * @version 1.0
 */ 
 
Ext.ns("Pvd.Seleccion.Nomencladores.MotSeguimiento");
Pvd.Seleccion.Nomencladores.MotSeguimiento = Ext.extend(Ext.Panel,{
    layout: 'fit',
    id: 'motseguimiento',
    title: 'Motivos de seguimiento',
    region: 'center',
    height: '100%',
    closable: true,
    iconCls: '',
    initComponent: function () {
        var self = this;
        this.accion = 'add';
        var busc = 0;

        //Fuente de datos del listado.
        this.stMotivoSeguimiento = new Ext.data.Store({
            url: '/pvd/seleccion/index.php/nommotivoseguimiento/getMotivosSeguimiento',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idmotivoseguimiento", totalProperty: "cantidad"},
                [{name:'idmotivoseguimiento'},{name:'denominacion'}, {name:'descripcion'}, {name:'fdesde'}, {name:'fhasta'}, {name:'gestion'}]
            )
        });

        this.stMotivoSeguimiento.load({params: {start: 0, limit: 15}});

        this.stMotivoSeguimiento.on('load', function(){
            if (busc == 1 && self.stMotivoSeguimiento.getCount()==0) {
                mostrarMensaje(1, self.idioma.lbNoDatosBusc);
                busc = 0;
            } else if (self.stMotivoSeguimiento.getCount()==0) {
                mostrarMensaje(1, self.idioma.lbNoDatos);
            }
            if (self.gpMotivo.getSelectionModel().getCount() == 0) {
                self.btnModificar.disable();
                self.btnEliminar.disable();
            }
        });

        //Expander
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        function mostrartt(val, metaData, record) {
            if (record.get('gestion') == 0) {
                metaData.attr = 'ext:qtip="No gestionable"';
            }
            return val;
        }

        //textfield para el buscar
        this.tfbuscar = new Ext.form.TextField({
            id:'tfbuscar',
            allowBlank : true,
            emptyText: self.idioma.lbEmptyTextBuscar,
            minLength: 3,
            maxLength: 100,
            enableKeyEvents: true,
            maskRe : /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width:140,
            name : 'tfbuscador'
        });

        //Fechas para el buscar
        //var fechab = new Date();

        this.dfFIniciob = new Ext.form.DateField({
            id: 'dfFInicio',
            fieldLabel: self.idioma.lbFechaInicio,
            name: 'fdesde',
            hiddenname:'fdesde',
            width:160,
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            maxText : self.idioma.lbFechaMaxima,
            minValue:'01/01/1900',
            minText : self.idioma.lbFechaMinima,
            invalidText: self.idioma.invalidTextFecha,
            vtype:'daterange',
            emptyText: self.idioma.lbEmptyTextFecha,
            endDateField: 'dfFFin'
        });

        this.dfFFinb = new Ext.form.DateField({
            id: 'dfFFin',
            name: 'fhasta',
            hiddenname:'fhasta',
            width:160,
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            maxText : self.idioma.lbFechaMaxima,
            minValue:'01/01/1900',
            minText : self.idioma.lbFechaMinima,
            invalidText: self.idioma.invalidTextFecha,
            vtype:'daterange',
            startDateField: 'dfFInicio',
            emptyText: self.idioma.lbEmptyTextFecha
        });


        //Boton para Buscar.
        this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
            text: self.idioma.btnBuscar,
            tooltip: self.idioma.lbbtnBuscarMS,
            iconCls: 'buscar',
            handler: function ()
            {
                busc = 1;
                self.stMotivoSeguimiento.load({ params:{
                    denominacion: self.tfbuscar.getValue(),
                    fdesde: self.dfFIniciob.getRawValue(),
                    fhasta: self.dfFFinb.getRawValue(),
                    start: 0,
                    limit: 15
                }
                });
            }.createDelegate(this)
        });

        //Boton para limpiar.
        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar',
            text: self.idioma.btnLimpiar,
            tooltip: self.idioma.lbbtnLimpiar,
            iconCls: 'limpiar',
            handler: function ()
            {
                self.tfbuscar.reset();
                self.dfFIniciob.reset();
                self.dfFFinb.reset();
                self.stMotivoSeguimiento.load({params: {start: 0, limit: 15}});
            }.createDelegate(this)
        });

        //Listado de vías de reclutamiento.
        this.gpMotivo = new Ext.grid.GridPanel({
            //title: 'Listado de motivos de seguimiento',
            region: 'center',
            store: this.stMotivoSeguimiento,
            tbar: ['',
                self.idioma.lbLabelBuscar+':',
                this.tfbuscar,
                '','-',
                self.idioma.lbLabelFInicio+':',
                this.dfFIniciob,
                '','-',
                self.idioma.lbLabelFFin+':',
                this.dfFFinb, '','-',
                this.btnBuscar,
                this.btnLimpiar
            ],
            loadMask: {msg: 'Cargando...'},
            plugins:this.expander,
            columns: [this.expander,
                {
                    header: self.idioma.lbDenominacion,
                    width:300,
                    dataIndex: 'denominacion',
                    renderer: mostrartt
                },
                {
                    header: self.idioma.lbLabelFInicio,
                    width:200,
                    dataIndex: 'fdesde',
                    renderer: mostrartt
                },
                {
                    header: self.idioma.lbLabelFFin,
                    width:200,
                    dataIndex: 'fhasta',
                    renderer: mostrartt
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stMotivoSeguimiento,
                displayInfo: true
            })
        });

        this.gpMotivo.getSelectionModel().on('rowselect', function (n) {
            var modselect = n.getSelected().data;
            if (modselect.gestion == 1) {
                self.btnModificar.enable();
                self.btnEliminar.enable();
            } else {
                self.btnModificar.disable();
                self.btnEliminar.disable();
            }
        }, this);

        //Botón ayuda
        this.btnAyuda = new Ext.Button({
            id:'btnAyuda',
            text: self.idioma.btnAyuda,
            iconCls:'ayuda',
            tooltip:self.idioma.lbBtnAyuda
        });

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            id: 'btnAdd',
            text: self.idioma.btnAdicionar,
            tooltip: self.idioma.lbbtnAdicionarMS,
            iconCls: 'adicionar',
            handler: function ()
            {
                self.formularioGestion.getForm().reset();
                self.btnAplicar.show();
                self.ventanaGestion.setTitle(self.idioma.lbTitVentAddMS);
                self.ventanaGestion.show();
                self.accion = 'add';
            }.createDelegate(this)
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            id: 'btnUpd',
            text: self.idioma.btnModificar,
            tooltip: self.idioma.lbbtnModificarMS,
            iconCls: 'modificar',
            handler: function ()
            {
                self.ventanaGestion.show();
                self.ventanaGestion.setTitle(self.idioma.lbTitVentModMS);
                self.btnAplicar.hide();
                self.formularioGestion.getForm().loadRecord(self.gpMotivo.getSelectionModel().getSelected());

                self.accion = 'mod';
            }.createDelegate(this)
        });

        //Boton para eliminar.
        this.btnEliminar = new Ext.Button({
            id: 'btnDel',
            text: self.idioma.btnEliminar,
            tooltip: self.idioma.lbbtnEliminarMS,
            iconCls: 'eliminar',
            handler: function ()
            {
                eliminar();
            }.createDelegate(this)
        });

        //textfield denominacion
        this.tfdenom = new Ext.form.TextField({
            id: 'tfdenominacionms'+self.id,
            nextTab: 'dfFIniciobms'+self.id,
            fieldLabel: self.idioma.lbDenominacion,
            allowBlank : false,
            //minLength: 3,
            maxLength: 100,
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            regexText: self.idioma.msgCaracteres,
            anchor:	'99%',
            name : 'denominacion'
        });

        var fecha = new Date();
        this.dfFInicio = new Ext.form.DateField({
            id: 'dfFIniciobms'+self.id,
            prevTab: 'tfdenominacionms'+self.id,
            nextTab: 'dfFFinbms'+self.id,
            fieldLabel: self.idioma.lbFechaInicio,
            name: 'fdesde',
            hiddenname:'fdesde',
            anchor:'97%',
            value: fecha.format('d/m/Y'),
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            maxText : self.idioma.lbFechaMaxima,
            minValue:'01/01/1900',
            minText : self.idioma.lbFechaMinima,
            invalidText: self.idioma.invalidTextFecha,
            vtype:'daterange',
            endDateField: 'dfFFinbms'+self.id,
            emptyText: self.idioma.lbEmptyTextFecha,
            listeners:{change: function(tf, n,o){cambio = 1;}}
        });

        this.dfFFin = new Ext.form.DateField({
            id: 'dfFFinbms'+self.id,
            prevTab: 'dfFIniciobms'+self.id,
            nextTab: 'tadescripcionms'+self.id,
            fieldLabel: self.idioma.lbFechaFin,
            name: 'fhasta',
            hiddenname:'fhasta',
            anchor:'97%',
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            maxText : self.idioma.lbFechaMaxima,
            minValue:'01/01/1900',
            minText : self.idioma.lbFechaMinima,
            invalidText: self.idioma.invalidTextFecha,
            startDateField: 'dfFIniciobms'+self.id,
            vtype:'daterange',
            emptyText: self.idioma.lbEmptyTextFecha,
            listeners:{change: function(tf, n,o){cambio = 1;}}
        });

        // Area de texto Descripción de la Facultad de decisión
        this.tadescripcion = new Ext.form.TextArea({
            id: 'tadescripcionms'+self.id,
            prevTab: 'dfFFinbms'+self.id,
            fieldLabel: self.idioma.lbDescripcion,
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
            },{
                xtype: 'hidden',
                name: 'idmotivoseguimiento'
            }]
        });

        this.btnCancelar = new Ext.Button({
            id: 'btnCancelarms',
            nextTab: 'tfdenominacionms'+self.id,
            prevTab: 'tadescripcionms'+self.id,
            iconCls: 'cancelar',
            tooltip: self.idioma.btnFrmCancelar_tooltips,
            text: this.idioma.lbBtnCancelar,
            handler: function ()
            {
                self.formularioGestion.getForm().reset();
                self.ventanaGestion.hide();
            }.createDelegate(this)
        });

        this.btnAceptar = new Ext.Button({
            nextTab: 'tfdenominacionms'+self.id,
            iconCls: 'aceptar',
            text: this.idioma.lbBtnAceptar,
            tooltip:this.idioma.btnFrmAceptar_tooltips,
            listeners: {
                'enable': function()
                {
                    self.btnCancelar.nextTab = 'btnAplicarms';
                },
                'disable': function()
                {
                    self.btnCancelar.nextTab = 'tfdenominacionms'+self.id;
                }
            },
            handler: function ()
            {
                guardarDatos('ACP');
            }.createDelegate(this)
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicarms',
            iconCls: 'aplicar',
            text: this.idioma.lbBtnAplicar,
            tooltip: this.idioma.btnFrmAplicar_tooltips,
            handler: function ()
            {
                guardarDatos('APL');
            }.createDelegate(this)
        });

        //Ventana de gestion.
        this.ventanaGestion = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            closable: true,
            resizable: false,
            constrain: true,
            layout: 'fit',
            title: self.idioma.lbTitVentAddMS,
            width: 360,
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
                    Ext.getCmp('tfdenominacionms'+self.id).focus(true, 500);
                }
            },
            keys:[
                {
                    key: 'x',
                    alt: true,
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
                },{
                    key: 13,//enter para aceptar
                    fn: function(){
                        if(self.btnAceptar.isVisible()){
                            self.btnAceptar.handler();
                        }
                    }
                }
            ]
        });

        this.tbar = [this.btnAdicionar, this.btnModificar, this.btnEliminar, '->',this.btnAyuda];

        this.items = [this.gpMotivo];

        this.btnAdicionar.on('render', function ()
        {
            self.btnAdicionar.focus();
        });

        this.ventanaGestion.on('hide', function ()
        {
            self.btnAdicionar.focus();
        });
        
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

        function eliminar()
        {
            var motivos = new Array();
            var s = self.gpMotivo.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                motivos.push(s[i].data.idmotivoseguimiento);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar el motivo de seguimiento seleccionado?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar los motivos de seguimiento seleccionados?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(self.idioma.lbTitMsgEliminando);
                    Ext.Ajax.request({
                        url: '/pvd/seleccion/index.php/nommotivoseguimiento/deleteMotivo',
                        params: {motivos: Ext.encode(motivos)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'El motivo de seguimiento seleccionado no puede ser eliminado debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguno de los motivos de seguimiento seleccionados no puede ser eliminado debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'El motivo de seguimiento ha sido eliminado satisfactoriamente.';
                                } else {
                                    mensaje = 'Los motivos de seguimiento han sido eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            self.stMotivoSeguimiento.reload();
                        }
                    });
                }
            });
        }

        function guardarDatos(btnpress){
            if(self.formularioGestion.getForm().isValid()){
                Ext.Ajax.request({
                    url: (self.accion == 'add' ? '/pvd/seleccion/index.php/nommotivoseguimiento/addMotivo' : '/pvd/seleccion/index.php/nommotivoseguimiento/updateMotivo'),
                    params: {
                        idmotivoseguimiento: self.accion == 'add' ? -1 : self.gpMotivo.getSelectionModel().getSelected().get('idmotivoseguimiento'),
                        denominacion: self.tfdenom.getValue(),
                        descripcion: self.tadescripcion.getValue(),
                        fdesde: self.dfFInicio.getRawValue(),
                        fhasta: self.dfFFin.getRawValue()
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if(self.accion == 'mod')
                            {
                                mostrarMensaje(1, self.idioma.lbMsgModExitoMS);
                            }else{
                                mostrarMensaje(1, self.idioma.lbMsgAddExitoMS);
                            }
                            if (btnpress == 'ACP')
                            {
                                self.ventanaGestion.hide();
                            }
                            self.formularioGestion.getForm().reset();
                            self.stMotivoSeguimiento.reload();
                        } else
                            mostrarMensaje(6,self.idioma.lbMsgAddFail);

                    }
                });
            }
        }

        Pvd.Seleccion.Nomencladores.MotSeguimiento.superclass.initComponent.call(this);
    }
});
