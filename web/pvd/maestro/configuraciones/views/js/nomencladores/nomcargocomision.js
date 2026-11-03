/**
 * Script para definir el componente visual del nomenclador "Cargo de comisión".
 * @file nomcargocomision.js
 * @package PVD.Maestro.Configuraciones
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 * @date 19/10/2017 Ing. Orestes Rodríguez Lorenzo
 * @modify 11/05/2018 by olorenzo
 * @version 1.0.1
 */

Ext.ns('Pvd.Maestro.Configuraciones');
Pvd.Maestro.Configuraciones.NomCargoComision = Ext.extend(Ext.Panel, {
    id: 'nomcargocomision',
    layout: 'border',
    region: 'center',
    height: '100%',
    closable: true,
    iconCls: '',
    initComponent: function () {
        //*** Inicialización del componente ***//
        this.setTitle(this.idioma.cte.tituloTab);
        var self = this;
        var modselect, accion;
        var busc = 0;

        //*** Barra de herramientas del componente
        // Botón Ayuda
        this.btnAyuda = new Ext.Button({
            text: this.idioma.cte.gestion.btn_TextAyuda,
            iconCls:'ayuda',
            disabled: false
        });
        // Botón Adicionar.
        this.btnAdicionar = new Ext.Button({
            text: this.idioma.cte.gestion.btn_TextAdd,
            tooltip: this.idioma.cte.gestion.btn_TtipAdd,
            iconCls: 'adicionar',
            handler: function () {
                self.ventanaGestion.setTitle(self.idioma.cte.ventana.win_TitleAdd);
                self.ventanaGestion.show();
                self.btnAplicar.show();
                self.formularioGestion.getForm().reset();
                accion = 'add';
            }.createDelegate(this)
        });
        // Botón Modificar
        this.btnModificar = new Ext.Button({
            text: this.idioma.cte.gestion.btn_TextMod,
            tooltip: this.idioma.cte.gestion.btn_TtipMod,
            disabled: true,
            iconCls: 'modificar',
            handler: function () {
                self.ventanaGestion.setTitle(self.idioma.cte.ventana.win_TitleMod);
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
        // Botón Eliminar
        this.btnEliminar = new Ext.Button({
            disabled: true,
            text: this.idioma.cte.gestion.btn_TextDel,
            tooltip: this.idioma.cte.gestion.btn_TtipDel,
            iconCls: 'eliminar',
            handler: function () {
                console.log(this.idioma);
                var ids = new Array();
                var s = self.gpCargocomision.getSelectionModel().getSelections();
                for(i = 0; i < s.length; i++) {
                    ids.push(s[i].data.idcargocomision);
                }
                var mensaje = '';
                if (s.length == 1) {
                    mensaje = this.idioma.cte.mensajes.confirm_dels;
                } else {
                    mensaje = this.idioma.cte.mensajes.confirm_delp;
                }
                mostrarMensaje(2, mensaje, function (btnPresionado) {
                    if (btnPresionado == 'ok') {
                        Ext.getBody().mask(self.idioma.cte.mensajes.mask_del);
                        Ext.Ajax.request({
                            url: '/pvd/maestro/configuraciones/index.php/cargocomision/deleteCargo',
                            params: {cargos: Ext.encode(ids)},
                            callback: function () {
                                Ext.getBody().unmask();
                            },
                            success: function (r) {
                                var responseData = Ext.decode(r.responseText);
                                if (responseData == false) {
                                    if (s.length == 1) {
                                        mensaje = self.idioma.cte.mensajes.error_del_usos;
                                    } else {
                                        mensaje = self.idioma.cte.mensajes.error_del_usop;
                                    }
                                    mostrarMensaje(6, mensaje);
                                } else {
                                    if (s.length == 1) {
                                        mensaje = self.idioma.cte.mensajes.success_dels;
                                    } else {
                                        mensaje = self.idioma.cte.mensajes.success_delp;
                                    }
                                    mostrarMensaje(1, mensaje);
                                }
                                self.stCargocomision.removeAll();
                                self.stCargocomision.reload();
                            }
                        });
                    }
                });
            }.createDelegate(this)
        });
        // Barra de herramientas
        this.panelToolBar = new Ext.Panel({
            layout: 'fit',
            region: 'north',
            border: false,
            tbar:[
                this.btnAdicionar,
                this.btnModificar,
                this.btnEliminar,'-',
                '->', '','-',this.btnAyuda]
        });
        // Botón Buscar.
        this.btnBuscar = new Ext.Button({
            text: this.idioma.gen.buscar.btn_TextBuscar,
            tooltip: this.idioma.gen.buscar.btn_TtipBuscar,
            iconCls: 'buscar',
            handler: function () {
                self.stCargocomision.load({params:{denominacion: self.tfbuscar.getValue(), start: 0, limit: 15}});
                busc = 1;
            }.createDelegate(this)
        });
        // Botón limpiar.
        this.btnLimpiar = new Ext.Button({
            text: this.idioma.gen.buscar.btn_TextLimpiar,
            tooltip: this.idioma.gen.buscar.btn_TtipLimpiar,
            iconCls: 'limpiar',
            handler: function () {
                self.tfbuscar.reset();
                self.stCargocomision.load({params:{start:0,limit:15}});
            }.createDelegate(this)
        });
        // Campo de texto para el buscador
        this.tfbuscar = new Ext.form.TextField({
            allowBlank : true,
            minLength: 3,
            maxLength: 100,
            enableKeyEvents: true,
            maskRe : /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width: 140,
            name : 'tfbuscador'
        });
        //*** Grid ***//
        // Configuración de la fuente de datos (Store)
        this.stCargocomision = new Ext.data.Store({
            url: '/pvd/maestro/configuraciones/index.php/cargocomision/getCargos',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idcargocomision", totalProperty: "cantidad"},
                [
                    {name:'idcargocomision'},
                    {name:'denominacion'},
                    {name:'descripcion'},
                    {name:'fdesde'},
                    {name:'fhasta'},
                    {name:'gestion'},
                    {name:'activo'}
                ]
            ),
            listeners: {
                load: function (st) {
                    modselect = null;
                    self.btnModificar.disable();
                    self.btnEliminar.disable();
                    if (busc == 1 && st.getCount()==0) {
                        mostrarMensaje(1, self.idioma.gen.buscar.msg_NoDataBusc);
                        busc = 0;
                    } else if (st.getCount()==0) {
                        mostrarMensaje(1, self.idioma.gen.mensajes.msg_NoData);
                    }
                }
            }
        });
        this.stCargocomision.load({params: {start:0, limit: 15}});
        // RowExpander para el grid
        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });
        // Grid
        this.gpCargocomision = new Ext.grid.GridPanel({
            store: this.stCargocomision,
            plugins: this.expander,
            tbar: [
                this.idioma.gen.buscar.lb_Denom + ':',
                this.tfbuscar,
                this.btnBuscar,
                this.btnLimpiar,
            ],
            columns: [this.expander,
                {
                    header: this.idioma.gen.grid.col_Denom,
                    width:300,
                    dataIndex: 'denominacion',
                    renderer: mostrartt
                },
                {
                    header: this.idioma.gen.grid.col_Desde,
                    width:100,
                    dataIndex: 'fdesde',
                    renderer: mostrartt
                } ,
                {
                    header: this.idioma.gen.grid.col_Hasta,
                    width:100,
                    dataIndex: 'fhasta',
                    renderer: mostrartt
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stCargocomision,
                displayInfo: true
            })
        });
        // Comportamiento de la selección de elementos del grid
        this.gpCargocomision.getSelectionModel().on('rowselect', function (n) {
            modselect = n.getSelected().data;
            if (modselect.gestion == 1) {
                self.btnModificar.enable();
                self.btnEliminar.enable();
            } else {
                self.btnModificar.disable();
                self.btnEliminar.disable();
            }
        }, this);
        // Contenedor del grid
        this.panel = new Ext.Panel({
            layout: 'fit',
            border: false,
            region: 'center',
            items: [this.gpCargocomision]
        });
        //*** Formulario ***//
        // Campo de texto Denominacion
        this.tfdenom = new Ext.form.TextField({
            id: 'tfdenomcc' + self.panel.id,
            fieldLabel: this.idioma.gen.formulario.tf_Denom,
            allowBlank : false,
            maxLength: 100,
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            regexText: self.idioma.gen.mensajes.caract_alfanum,
            anchor: '100%',
            name : 'denominacion'
        });
        // Inicialización de variable fecha con la fecha actual.
        var fecha = new Date();
        // Campo de fecha Desde
        this.dfFInicio = new Ext.form.DateField({
            id: 'dfFIniciocc' + self.panel.id,
            fieldLabel: this.idioma.gen.formulario.df_fechaI,
            name: 'fdesde',
            hiddenname: 'fdesde',
            anchor:'98%',
            format:'d/m/Y',
            value: fecha.format('d/m/Y'),
            editable: false,
            readOnly : true,
            maxValue: '31/12/2100',
            maxText : this.idioma.gen.mensajes.fechaMax,
            minValue:'01/01/1900',
            minText : this.idioma.gen.mensajes.fechaMin,
            invalidText: this.idioma.gen.mensajes.fechaInvFormat,
            vtype: 'daterange'
        });
        // Campo de fecha Hasta
        this.dfFFin = new Ext.form.DateField({
            fieldLabel: this.idioma.gen.formulario.df_fechaF,
            name: 'fhasta',
            hiddenname:'fhasta',
            anchor:'100%',
            format:'d/m/Y',
            editable:false,
            readOnly : true,
            maxValue:'31/12/2100',
            maxText : this.idioma.gen.mensajes.fechaMax,
            minValue:'01/01/1900',
            minText : this.idioma.gen.mensajes.fechaMin,
            invalidText: this.idioma.gen.mensajes.fechaInvFormat,
            startDateField: 'dfFIniciocc' + self.panel.id,
            vtype:'daterange'
        });
        // Área de texto Descripción
        this.tadescripcion = new Ext.form.TextArea({
            fieldLabel: this.idioma.gen.formulario.ta_Descrip,
            name: 'descripcion',
            anchor: '100%',
            height: 100,
            hiddenname: 'descripcion',
            maxLength: 255,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            regexText: self.idioma.gen.mensajes.caract_alfanumPlus,
            allowBlank:	true
        });
        // Formulario
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
                        columnWidth:0.51,
                        layout: 'form',
                        items: [this.dfFInicio]
                    },{
                        columnWidth:0.49,
                        layout: 'form',
                        items: [this.dfFFin]
                    }, {
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.tadescripcion]
                    }]
            }]
        });
        // Botón Aceptar
        this.btnAceptar = new Ext.Button({
            nextTab: 'tfdenomcc' + self.panel.id,
            iconCls: 'aceptar',
            text: this.idioma.gen.formulario.btn_TextAceptar,
            tooltip: this.idioma.gen.formulario.btn_TtipAceptar,
            listeners: {
                'enable': function() {
                    self.btnCancelar.nextTab = 'btnAplicarcc';
                    },
                'disable': function() {
                    self.btnCancelar.nextTab = 'tfdenomcc'+self.panel.id;
                }
                },
            handler: function () {
                guardarDatos('ACP');
            }.createDelegate(this)
        });
        // Botón Aplicar
        this.btnAplicar = new Ext.Button({
            id: 'btnAplicarcc',
            iconCls: 'aplicar',
            tooltip: this.idioma.gen.formulario.btn_TtipAplicar,
            text: this.idioma.gen.formulario.btn_TextAplicar,
            handler: function () {
                guardarDatos('APL');
            }.createDelegate(this)
        });
        // Botón Cancelar
        this.btnCancelar = new Ext.Button({
            nextTab: 'tfdenomcc' + self.panel.id,
            iconCls: 'cancelar',
            text: this.idioma.gen.formulario.btn_TextCancelar,
            tooltip: this.idioma.gen.formulario.btn_TtipCancelar,
            handler: function () {
                self.formularioGestion.getForm().reset();
                self.ventanaGestion.hide();
            }.createDelegate(this)
        });
        // Ventana de gestion.
        this.ventanaGestion = new Ext.Window({
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 400,
            height: 310,
            items: [this.formularioGestion],
            buttons: [this.btnCancelar, this.btnAplicar, this.btnAceptar],
            listeners: {
                'beforeshow': function() {
                    self.tfdenom.focus(true, 500);
                }
            },
            keys: [{
                key: 'x',
                alt: true,
                fn: function () {
                    if (!self.btnCancelar.disabled) {
                        self.btnCancelar.handler();
                    }
                }
            }, {
                key: 'p',
                alt: true,
                ctrl: true,
                fn: function () {
                    if (!self.btnAplicar.disabled) {
                        self.btnAplicar.handler();
                    }
                }
            }, {
                key: 13,
                fn: function () {
                    if (!self.btnAceptar.disabled) {
                        self.btnAceptar.handler();
                    }
                }
            }]
        });
        //*** Funciones auxiliares ***//
        // Función para mostrar el tooltip en las filas del grid y asignar estilos de colores
        function mostrartt(val, metaData, record) {
            if (record.get('gestion') == 0) {
                metaData.attr = 'ext:qtip="' + self.idioma.cte.grid.row_TtipNoGest + '"';
                if (val) {
                    return '<span style="color:#707070;">' + val + '</span>';
                }
            }
            else if (record.get('activo') == 0) {
                metaData.attr = 'ext:qtip="' + self.idioma.cte.grid.row_TtipInactivo + '"';
                if (val) {
                    return '<span style="color:#aa050a;">' + val + '</span>';
                }
            }
            return val;
        }
        // Función para guardar los datos del formulario
        function guardarDatos(btnpress)
        {
            if(self.formularioGestion.getForm().isValid()){
                Ext.Ajax.request({
                    url: (accion == 'add' ? '/pvd/maestro/configuraciones/index.php/cargocomision/addCargo' : '/pvd/maestro/configuraciones/index.php/cargocomision/updateCargo'),
                    params: {
                        idcargocomision: accion == 'add' ? -1 : modselect.idcargocomision,
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
                                mostrarMensaje(1, self.idioma.cte.mensajes.success_mod);
                            }else{
                                mostrarMensaje(1, self.idioma.cte.mensajes.success_add);
                            }
                            if (btnpress == 'ACP')
                            {
                                self.ventanaGestion.hide();
                            }
                            self.formularioGestion.getForm().reset();
                            self.stCargocomision.removeAll();
                            self.stCargocomision.reload();
                        } else {
                            mostrarMensaje(3,self.idioma.cte.mensajes.error_existe);
                        }
                    }
                });
            }
        }
        //*** ***//
        // Asignando el foco al botón adicionar
        this.panelToolBar.on('render', function ()
        {
            self.btnAdicionar.focus();
        });
        this.ventanaGestion.on('hide', function ()
        {
            self.btnAdicionar.focus();
        });
        //*** Gestión de teclas calientes del componente ***//
        this.keys = [
            {key: 'i', alt: true, fn: function () {if (!self.btnAdicionar.disabled) {self.btnAdicionar.handler();}}},
            {key: 'm', alt: true, fn: function () {if (!self.btnModificar.disabled) {self.btnModificar.handler();}}},
            {key: 46, fn: function () {if (!self.btnEliminar.disabled) {self.btnEliminar.handler();}}},
            {key: 'h', alt: true, fn: function () {if (!self.btnAyuda.disabled) {self.btnAyuda.handler();}}},
            {key: 'b', alt: true, fn: function () {if (!self.btnBuscar.disabled) {self.btnBuscar.handler();}}},
            {key: 'l', alt: true, fn: function () {if (!self.btnLimpiar.disabled) {self.btnLimpiar.handler();}}}
        ];
        this.items = [this.panelToolBar, this.panel];
        Pvd.Maestro.Configuraciones.NomCargoComision.superclass.initComponent.call(this);
    }
});