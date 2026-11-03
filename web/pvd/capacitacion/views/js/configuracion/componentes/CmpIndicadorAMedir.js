
/*
 * Componente Indicador a medir.
 *
 * @author Ing. Eddy Santana Navarro
 * @package Pvd.Capacitacion
 * @uses Pvd.Capacitacion.Configuracion.Nomencladores
 * @copyright XETID
 * @version 1.0
 */ 
 
Ext.ns("Pvd.Capacitacion.Configuracion.Nomencladores");
Pvd.Capacitacion.Configuracion.Nomencladores.Indicadoramedir = Ext.extend(Ext.Panel,{
    layout: 'border',
    id: 'indicadoramedir',
    title: 'Indicador',
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
            tooltip: this.idioma.lbBtnAdicionarIAM,
            iconCls: 'adicionar',
            handler: function ()
            {
                self.ventanaGestion.setTitle(self.idioma.msgAddIAM);
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
            tooltip: this.idioma.lbBtnModificarIAM,
            iconCls: 'modificar',
            handler: function ()
            {
                self.ventanaGestion.setTitle(self.idioma.msgModIAM);
                self.ventanaGestion.show();
                self.btnAplicar.hide();
                self.tfdenom.setValue(modselect.denominacion);
                self.cbEscala.setValue(modselect.idescala);
                self.cbEscala.setRawValue(modselect.escala);
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
            tooltip: this.idioma.lbBtnEliminarIAM,
            iconCls: 'eliminar',
            handler: function ()
            {
                eliminar();
            }.createDelegate(this)
        });

        //Botón para Buscar.
        this.btnBuscar = new Ext.Button({
            text: this.idioma.BtnBuscar,
            tooltip: this.idioma.lbBtnBuscarIAM,
            iconCls: 'buscar',
            handler: function ()
            {
                self.stIndicadorAMedir.load({params:{denominacion: self.tfbuscar.getValue(), start: 0, limit: 15}});
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
                self.stIndicadorAMedir.load({params:{start:0,limit:15}});
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

        //Expander
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });


        //Fuente de datos del listado.
        this.stIndicadorAMedir = new Ext.data.Store({
            url: '/pvd/capacitacion/index.php/nomindicadoramedir/getIndicadoresAMedir',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idindicador", totalProperty: "cantidad"},
                [{name:'idindicador'},{name:'denominacion'}, {name:'descripcion'}, {name:'fdesde'}, {name:'fhasta'}, {name:'gestion'}, {name:'idescala'}, {name:'escala'}]
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

        this.stIndicadorAMedir.load({params: {start:0, limit: 15}});

        function mostrartt(val, metaData, record) {
            if (record.get('gestion') == 0) {
                metaData.attr = 'ext:qtip="No gestionable"';
            }
            return val;
        }
        //Listado de indicadores a medir.
        this.gpIndicadorAMedir = new Ext.grid.GridPanel({
            store: this.stIndicadorAMedir,
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
                },{
                    header: 'Escala',
                    width:300,
                    dataIndex: 'escala',
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
                store: this.stIndicadorAMedir,
                displayInfo: true
            })
        });

        this.gpIndicadorAMedir.getSelectionModel().on('rowselect', function (n) {
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
            items: [this.gpIndicadorAMedir]
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
            id: 'tfdenomiam' + self.panel.id,
            fieldLabel: this.idioma.lbDenominacion,
            allowBlank : false,
            maxLength: 100,
            enableKeyEvents: true,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
            regexText: self.idioma.msgCaracteres,
            anchor: '99%',
            name : 'denominacion'
        });

        this.stEscalas = new Ext.data.Store({
            url: '/pvd/capacitacion/index.php/nomindicadoramedir/getEscalas',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idescala"},
                [{name:'idescala'},{name:'denominacion'}, {name:'descripcion'}]
            )
        });

        this.stEscalas.load();

        this.cbEscala = new Ext.form.ComboBox({
            store: this.stEscalas,
            fieldLabel: 'Escala',
            anchor: '99%',
            height: 100,
            id: 'cbEscala',
            hiddenName:'idescala',
            displayField: 'denominacion',
            valueField: 'idescala',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            tpl:'<tpl for="."><div ext:qtip="<b>{denominacion}</b></br>{descripcion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        var fecha = new Date();

        this.dfFInicio = new Ext.form.DateField({
            id: 'dfFInicioiam' + self.panel.id,
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
            startDateField: 'dfFInicioiam' + self.panel.id,
            vtype:'daterange'
        });

        // Area de texto Descripción del indicador a medir
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
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.cbEscala]
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
            nextTab: 'tfdenomiam' + self.panel.id,
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
            nextTab: 'tfdenomiam' + self.panel.id,
            iconCls: 'aceptar',
            tooltip: this.idioma.textToolTipAceptar,
            text: this.idioma.lbtnAceptar,
            listeners: {
                'enable': function()
                {
                    self.btnCancelar.nextTab = 'btnAplicariam';
                },
                'disable': function()
                {
                    self.btnCancelar.nextTab = 'tfdenomiam'+self.panel.id;
                }
            },
            handler: function ()
            {
                guardarDatos('ACP');
            }.createDelegate(this)
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicariam',
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
            height: 360,
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
                Ext.getBody().mask('Guardando datos...');
                Ext.Ajax.request({
                    url: (accion == 'add' ? '/pvd/capacitacion/index.php/nomindicadoramedir/addIndicadorAMedir' : '/pvd/capacitacion/index.php/nomindicadoramedir/updateIndicadorAMedir'),
                    params: {
                        idindicador: accion == 'add' ? -1 : modselect.idindicador,
                        descripcion: self.tadescripcion.getValue(),
                        denominacion: self.tfdenom.getValue(),
                        idescala: self.cbEscala.getValue(),
                        fdesde: self.dfFInicio.getRawValue(),
                        fhasta: self.dfFFin.getRawValue()
                    },
                    callback: function (){
                        Ext.getBody().unmask();
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if(accion == 'mod')
                            {
                                mostrarMensaje(1, self.idioma.msgModIAMSucces);
                            }else{
                                mostrarMensaje(1, self.idioma.msgAddIAMSucces);
                            }
                            if (btnpress == 'ACP')
                            {
                                self.ventanaGestion.hide();
                            }
                            self.formularioGestion.getForm().reset();
                            self.stIndicadorAMedir.removeAll();
                            self.stIndicadorAMedir.reload();
                        } else {
                            mostrarMensaje(3,self.idioma.msgIAMExistem);
                        }                            
                    }
                });
            }
        }

        function eliminar()
        {
            var ids = new Array();
            var s = self.gpIndicadorAMedir.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idindicador);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar el indicador seleccionado?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar los indicadores seleccionados?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(self.idioma.lbTitMsgEliminando);
                    Ext.Ajax.request({
                        url: '/pvd/capacitacion/index.php/nomindicadoramedir/deleteIndicadorAMedir',
                        params: {indicadores: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'El indicador seleccionado no puede ser eliminado debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguno de los indicadores seleccionados no puede ser eliminado debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'El indicador ha sido eliminado satisfactoriamente.';
                                } else {
                                    mensaje = 'Los indicadores han sido eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            self.stIndicadorAMedir.removeAll();
                            self.stIndicadorAMedir.reload();
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

        Pvd.Capacitacion.Configuracion.Nomencladores.Indicadoramedir.superclass.initComponent.call(this);
    }
});
