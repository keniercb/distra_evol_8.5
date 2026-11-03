
/*
 * Componente Vía de reclutamiento.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Seleccion
 * @uses Pvd.Seleccion.Nomencladores.ViaReclutamiento
 * @copyright XETID
 * @version 1.0
 */ 
 
Ext.ns("Pvd.Seleccion.Nomencladores.ViaReclutamiento");
Pvd.Seleccion.Nomencladores.ViaReclutamiento = Ext.extend(Ext.Panel,{
    layout: 'fit',
    id: 'viareclutamiento',
    title: 'Fuentes de reclutamiento',
    region: 'center',
    height: '100%',
    closable: true,
    iconCls: '',
    initComponent: function () {
        var self = this;
        var objselect;
        this.accion = 'add';
        var busc = 0;
        
        //Fuente de datos del listado.
        this.stViasReclutamiento = new Ext.data.Store({
            url: '/pvd/seleccion/index.php/nomviareclutamiento/getViasReclutamiento',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idviareclutamiento", totalProperty: "cantidad"},
                [{name:'idviareclutamiento'},{name:'denominacion'}, {name:'descripcion'}, {name:'fdesde'}, {name:'fhasta'}, {name:'gestion'}]
            )
        });
        
        this.stViasReclutamiento.load({params: {start: 0, limit: 15}});

        self.stViasReclutamiento.on('load', function(){
            if (busc == 1 && self.stViasReclutamiento.getCount()==0) {
                mostrarMensaje(1, self.idioma.lbNoDatosBusc);
                busc = 0;
            } else if (self.stViasReclutamiento.getCount()==0) {
                mostrarMensaje(1, self.idioma.lbNoDatos);
            }
            if (self.gpViasRec.getSelectionModel().getCount() == 0) {
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
            id:'tfbuscarV',
            allowBlank : true,
            emptyText: this.idioma.lbEmptyTextBuscar,
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
            id: 'dfFIniciobVia',
            fieldLabel: this.idioma.lbFechaInicio,
            name: 'fdesde',
            hiddenname:'fdesde',
            width:160,
            format:'d/m/Y',
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

        this.dfFFinb = new Ext.form.DateField({
            id: 'dfFFinbVia',
            name: 'fhasta',
            hiddenname:'fhasta',
            width:160,
            format:'d/m/Y',
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

        //Boton para Buscar.
        this.btnBuscar = new Ext.Button({
            id: 'btnBuscarV',
            text: this.idioma.btnBuscar,
            tooltip: this.idioma.lbbtnBuscar,
            iconCls: 'buscar',
            handler: function ()
            {
                busc = 1;
                self.stViasReclutamiento.load({ params:{
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
            id: 'btnLimpiarV',
            text: this.idioma.btnLimpiar,
            tooltip: this.idioma.lbbtnLimpiar,
            iconCls: 'limpiar',
            handler: function ()
            {
                self.tfbuscar.reset();
                self.dfFIniciob.reset();
                self.dfFFinb.reset();
                self.stViasReclutamiento.load({params: {start: 0, limit: 15}});
            }.createDelegate(this)
        });

        //Listado de vías de reclutamiento.
        this.gpViasRec = new Ext.grid.GridPanel({
            //title: this.idioma.lbListado,
            region: 'center',
            loadMask: {msg: 'Cargando...'},
            store: this.stViasReclutamiento,
            tbar: ['',
                this.idioma.lbLabelBuscar+':',
                this.tfbuscar,
                '','-',
                this.idioma.lbLabelFInicio+':',
                this.dfFIniciob,
                '','-',
                this.idioma.lbLabelFFin+':',
                this.dfFFinb, '','-',
                this.btnBuscar,
                this.btnLimpiar
            ],
            plugins:this.expander,
            columns: [this.expander,
                {
                    header: this.idioma.lbDenominacion,
                    width:300,
                    dataIndex: 'denominacion',
                    renderer: mostrartt
                },
                {
                    header: this.idioma.lbLabelFInicio,
                    width:200,
                    dataIndex: 'fdesde',
                    renderer: mostrartt
                },
                {
                    header: this.idioma.lbLabelFFin,
                    width:200,
                    dataIndex: 'fhasta',
                    renderer: mostrartt
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stViasReclutamiento,
                displayInfo: true
            })
        });

        self.gpViasRec.getSelectionModel().on('rowselect', function (n) {
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
            id:'btnAyudaV',
            text: this.idioma.btnAyuda,
            iconCls:'ayuda',
            disabled: false,
            tooltip:this.idioma.lbBtnAyuda
        });

        //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            id: 'btnAddV',
            text: this.idioma.btnAdicionar,
            tooltip: this.idioma.lbbtnAdicionar,
            iconCls: 'adicionar',
            handler: function ()
            {
                self.formularioGestion.getForm().reset();
                self.btnAplicar.show();
                self.ventanaGestion.setTitle(self.idioma.lbTitVentAdd);
                self.ventanaGestion.show();
                self.accion = 'add';
            }.createDelegate(this)
        });

        //Boton para modificar.
        this.btnModificar = new Ext.Button({
            id: 'btnUpdV',
            text: this.idioma.btnModificar,
            tooltip: this.idioma.lbbtnModificar,
            iconCls: 'modificar',
            handler: function ()
            {
                self.ventanaGestion.show();
                self.ventanaGestion.setTitle(self.idioma.lbTitVentMod);
                self.btnAplicar.hide();
                self.formularioGestion.getForm().loadRecord(self.gpViasRec.getSelectionModel().getSelected());
                self.accion = 'mod';
            }.createDelegate(this)
        });

        //Boton para eliminar.
        this.btnEliminar = new Ext.Button({
            id: 'btnDelV',
            text: this.idioma.btnEliminar,
            tooltip: this.idioma.lbbtnEliminar,
            iconCls: 'eliminar',
            handler: function ()
            {
                eliminarVia();
            }.createDelegate(this)
        });

        //textfield denominacion
        this.tfdenom = new Ext.form.TextField({
            id:'tfdenominacionV'+self.id,
            fieldLabel: this.idioma.lbDenominacion,
            nextTab: 'dfFInicioV'+self.id,
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
            id: 'dfFInicioV'+self.id,
            prevTab: 'tfdenominacionV'+self.id,
            nextTab: 'dfFFinV'+self.id,
            fieldLabel: this.idioma.lbFechaInicio,
            name: 'fdesde',
            hiddenname:'fdesde',
            value: fecha.format('d/m/Y'),
            anchor:'97%',
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            maxText : this.idioma.lbFechaMaxima,
            minValue:'01/01/1900',
            minText : this.idioma.lbFechaMinima,
            invalidText: this.idioma.invalidTextFecha,
            vtype:'daterange',
            emptyText: this.idioma.lbEmptyTextFecha,
            endDateField: 'dfFFinV'+self.id,
            listeners:{change: function(tf, n,o){cambio = 1;}}
        });

        this.dfFFin = new Ext.form.DateField({
            id: 'dfFFinV'+self.id,
            prevTab: 'dfFInicioV'+self.id,
            nextTab: 'tadescripcionV'+self.id,
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
            vtype:'daterange',
            startDateField: 'dfFInicioV'+self.id,
            emptyText: this.idioma.lbEmptyTextFecha,
            listeners:{change: function(tf, n,o){cambio = 1;}}
        });

        // Area de texto Descripción de la Facultad de decisión
        this.tadescripcion = new Ext.form.TextArea({
            fieldLabel: this.idioma.lbDescripcion,
            name: 'descripcion',
            id:	'tadescripcionV'+self.id,
            prevTab: 'dfFFinV',
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
                name: 'idviareclutamiento'
            }]
        });

        this.btnCancelar = new Ext.Button({
            id: 'btnCancelarV',
            nextTab: 'tfdenominacionV'+self.id,
            prevTab: 'tadescripcionV'+self.id,
            iconCls: 'cancelar',
            text: this.idioma.lbBtnCancelar,
            tooltip: this.idioma.btnFrmCancelar_tooltips,
            handler: function ()
            {
                self.formularioGestion.getForm().reset();
                self.ventanaGestion.hide();
            }.createDelegate(this)
        });

        this.btnAceptar = new Ext.Button({
            id: 'btnAceptarV',
            nextTab: 'tfdenominacionV'+self.id,
            prevTab: 'btnAplicarV',
            iconCls: 'aceptar',
            text: this.idioma.lbBtnAceptar,
            tooltip:this.idioma.btnFrmAceptar_tooltips,
            listeners: {
                'enable': function()
                {
                    self.btnCancelar.nextTab = 'btnAplicarV';
                },
                'disable': function()
                {
                    self.btnCancelar.nextTab = 'tfdenominacionV'+self.id;
                }
            },
            handler: function ()
            {
                guardarDatos('ACP');
            }.createDelegate(this)
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicarV',
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
            resizable: false,
            layout: 'fit',
            constrain:true,
            title: this.idioma.lbTitVentAdd,
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
                    Ext.getCmp('tfdenominacionV'+self.id).focus(true, 500);
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

        this.items = [this.gpViasRec];

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

        function eliminarVia()
        {
            var vias = new Array();
            var s = self.gpViasRec.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                vias.push(s[i].data.idviareclutamiento);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar la fuente de reclutamiento seleccionada?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar las fuentes de reclutamiento seleccionadas?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(self.idioma.lbTitMsgEliminando);
                    Ext.Ajax.request({
                        url: '/pvd/seleccion/index.php/nomviareclutamiento/deleteVia',
                        params: {vias: Ext.encode(vias)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if(responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'La fuente de reclutamiento seleccionada no puede ser eliminada debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguna de las fuentes de reclutamiento seleccionadas no puede ser eliminada debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'La fuente de reclutamiento seleccionada ha sido eliminada satisfactoriamente.';
                                } else {
                                    mensaje = 'Las fuentes de reclutamiento seleccionadas han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            self.stViasReclutamiento.reload();
                        }
                    });
                }
            });
        }

        function guardarDatos(btnpress){
            if(self.formularioGestion.getForm().isValid()){
                Ext.Ajax.request({
                    url: (self.accion == 'add' ? '/pvd/seleccion/index.php/nomviareclutamiento/addViaRec' : '/pvd/seleccion/index.php/nomviareclutamiento/updateViaRec'),
                    params: {
                        idviareclutamiento: self.accion == 'add' ? -1 : self.gpViasRec.getSelectionModel().getSelected().get('idviareclutamiento'),
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
                                mostrarMensaje(1, self.idioma.lbMsgModExito);
                            }else{
                                mostrarMensaje(1, self.idioma.lbMsgAddExito);
                            }
                            if (btnpress == 'ACP')
                            {
                                self.ventanaGestion.hide();
                            }
                            self.formularioGestion.getForm().reset();
                            self.stViasReclutamiento.reload();
                        } else
                            mostrarMensaje(6,self.idioma.lbMsgAddFail);
                    }
                });
            }
        }

        Pvd.Seleccion.Nomencladores.ViaReclutamiento.superclass.initComponent.call(this);
    }
});
