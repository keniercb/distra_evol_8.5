
/*
 * Componente Comision.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Maestro
 * @uses Pvd.Maestro.Configuraciones.Comision
 * @copyright XETID
 * @version 1.0
 */ 
 
Ext.ns("Pvd.Maestro.Configuraciones.Comision");
Pvd.Maestro.Configuraciones.Comision = Ext.extend(Ext.Panel,{
    layout: 'border',
    border: false,
    id: 'pComision',
    title: 'Comisi&oacute;n',
    region: 'center',
    height: '100%',
    closable: true,
    iconCls: '',
    initComponent: function () {
        //Variables
         var self = this;
        var Comisionselec, miemselect, accion, accionm;
        var determinado = 0;
        var busc = 0;
        var busc1 = 0;
        //Botón ayuda
        this.btnAyuda = new Ext.Button({
            text: self.idioma.btnAyudaEstCncpt_text,
            iconCls:'ayuda',
            disabled: false,
            tooltip:this.idioma.btnAyudaEstCncpt_tooltip
        });

        //Botón para adicionar.
        this.btnAdicionarCom = new Ext.Button({
            text: this.idioma.btnAdicionar,
            tooltip: this.idioma.comision.btn_ttAdd,
            iconCls: 'adicionar',
            handler: function ()
            {
                self.ventanaGestionE.setTitle(self.idioma.comision.win_TituloAdd);
                self.ventanaGestionE.show();
                self.btnAplicarE.show();
                self.formularioGestionE.getForm().reset();
                accion = 'add';
            }.createDelegate(this)
        });

        //Boton para modificar.
        this.btnModificarCom = new Ext.Button({
            text: this.idioma.btnModificar,
            disabled: true,
            tooltip: this.idioma.comision.btn_ttMod,
            iconCls: 'modificar',
            handler: function ()
            {
                self.ventanaGestionE.setTitle(self.idioma.comision.win_TituloMod);
                self.ventanaGestionE.show();
                self.btnAplicarE.hide();
                self.tfdenom.setValue(Comisionselec.denominacion);
                self.cbDominios.setValue(Comisionselec.iddominios);
                self.dfFFin.setValue(Comisionselec.fhasta);
                self.dfFInicio.setValue(Comisionselec.fdesde);
                if (Comisionselec.descripcion == 'Sin descripci&oacute;n') {
                    self.tadescripcion.setValue('');
                } else {
                    self.tadescripcion.setValue(Comisionselec.descripcion);
                }

                accion = 'mod';
            }.createDelegate(this)
        });

        //Boton para eliminar.
        this.btnEliminarCom = new Ext.Button({
            text: this.idioma.btnEliminar,
            disabled: true,
            tooltip: this.idioma.comision.btn_ttDel,
            iconCls: 'eliminar',
            handler: function ()
            {
                eliminarComision();
            }.createDelegate(this)
        });

        //Botón para Buscar.
        this.btnBuscarCom = new Ext.Button({
            text: '<u>B</u>uscar',
            tooltip: this.idioma.comision.btn_ttipBuscar,
            iconCls: 'buscar',
            handler: function ()
            {
                self.stDatos.load({params:{denominacion: self.tfbuscarCom.getValue(), start: 0, limit: 15}});
                busc1 = 1;
            }.createDelegate(this)
        });

        //Botón para limpiar.
        this.btnLimpiarCom = new Ext.Button({
            text: this.idioma.btnLimpiarEst_text,
            tooltip: this.idioma.btn_ttipLimpiar,
            iconCls: 'limpiar',
            handler: function ()
            {
                self.tfbuscarCom.reset();
                self.stDatos.load({params:{start:0,limit:15}});
            }.createDelegate(this)
        });

        //textfield para el buscar
        this.tfbuscarCom = new Ext.form.TextField({
            allowBlank : true,
            minLength: 3,
            maxLength: 100,
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
            url: '/pvd/maestro/configuraciones/index.php/comision/getComisiones',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idcomision", totalProperty: "cantidad"},
                [{name:'idcomision'},{name:'denominacion'}, {name:'descripcion'}, {name:'dominio'},
                 {name:'iddominio'}, {name:'fdesde'}, {name:'fhasta'}, {name:'iddominios'}, {name:'dominio'}]
            ),
            listeners: {
                load: function () {
                    Comisionselec = null;
                    self.btnAdicionar.disable();
                    self.btnModificarCom.disable();
                    self.btnEliminarCom.disable();
                    self.btnBuscar.disable();
                    self.btnLimpiar.disable();
                    if (busc1 == 1 && self.stDatos.getCount()==0) {
                        mostrarMensaje(1, self.idioma.generico.buscar.msg_NoDataBusc);
                        busc1 = 0;
                    } else if (self.stDatos.getCount()==0) {
                        mostrarMensaje(1, self.idioma.generico.mensajes.msg_NoData);
                    }
                }
            }
        });

        //Listado de Comisiones.
        this.gpDatos = new Ext.grid.GridPanel({
            //title: 'Listado de Comisiones',
            store: this.stDatos,
            height: 400,
            loadMask : {msg: 'Cargando...'},
            plugins:this.expander,
            tbar: [
                ' ','',
                this.idioma.lbDenominacion+':',
                this.tfbuscarCom,
                this.btnBuscarCom,
                this.btnLimpiarCom,'','-'
            ],
            columns: [this.expander,
                {
                    header: 'Denominaci&oacute;n',
                    width:250,
                    dataIndex: 'denominacion'
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
                },
                {
                    header: 'Dominios de soluci&oacute;n',
                    width:400,
                    dataIndex: 'dominio'
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stDatos,
                displayInfo: true
            }),
            listeners: {
                render : function(){
                    self.stDatos.load({params: {start:0, limit: 15}});
                }
            }
        });



        this.gpDatos.getSelectionModel().on('rowselect', function (n) {
            Comisionselec = n.getSelected().data;
            self.btnAdicionar.enable();
            self.btnModificarCom.enable();
            self.btnEliminarCom.enable();
            self.btnBuscar.enable();
            self.btnLimpiar.enable();
            this.stMiembros.baseParams.idcomision = Comisionselec.idcomision;
            this.stMiembros.load({params: {start:0, limit: 15}});
        }, this);

        //Panel con listado.
        this.panel = new Ext.Panel({
            layout: 'fit',
            border: false,
            height: 400,
            region: 'center',
            items: [this.gpDatos],
            tbar:[
                this.btnAdicionarCom,
                this.btnModificarCom,
                this.btnEliminarCom,
                '->', '','-',this.btnAyuda]
        });
		
		// Nomenclador de valores asociados a la comision
		 //Botón para adicionar.
        this.btnAdicionar = new Ext.Button({
            text: this.idioma.btnAdicionar,
            tooltip: this.idioma.comision.btn_ttAddV,
            disabled: true,
            iconCls: 'adicionar',
            handler: function ()
            {
                self.windAddMiembro.show();

            }.createDelegate(this)
        });

        //Boton para eliminar.
        this.btnEliminar = new Ext.Button({
            text: this.idioma.btnEliminar,
            disabled: true,
            tooltip: this.idioma.comision.btn_ttDelV,
            iconCls: 'eliminar',
            handler: function ()
            {
                eliminarMiembro();
            }.createDelegate(this)
        });

        //Botón para Buscar.
        this.btnBuscar = new Ext.Button({
            text: '<u>B</u>uscar',
            tooltip: this.idioma.comision.btn_ttipBuscarV,
            iconCls: 'buscar',
            handler: function ()
            {
                self.stMiembros.load({params:{query: self.tfbuscar.getValue(), start: 0, limit: 15}});
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
                self.stMiembros.load({params:{start:0,limit:15}});
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

		//Expander
        this.expander1 = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'
            )
        });

        //Fuente de datos del listado.
        this.stMiembros = new Ext.data.Store({
            url: '/pvd/maestro/configuraciones/index.php/comision/getMiembrosByComision',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idcomisionpersona", totalProperty: "cantidad"},
                [{name:'idcomisionpersona'}, {name:'nombreyapellidos'}, {name:'idpersona'}, {name:'idcomision'},
                 {name:'cargocomision'}, {name:'idcargocomision'}, {name:'fdesde'}, {name:'fhasta'}, {name:'numid'}]
            ),
            listeners: {
                load: function () {
                    miemselect = null;
                    self.btnEliminar.disable();
                    if (busc == 1 && self.stMiembros.getCount()==0) {
                        mostrarMensaje(1, self.idioma.lbNoDatosBusc);
                        busc = 0;
                    } else if (self.stMiembros.getCount()==0) {
                        console.log(self.idioma);
                        mostrarMensaje(1, self.idioma.generico.mensajes.msg_NoData);
                    }
                }
            }
        });

        this.dfFInicioMiem = new Ext.form.DateField({
            id: 'dfFInicioMiem',
            name: 'fdesde',
            hiddenname: 'fdesde',
            anchor:'97%',
            format:'d/m/Y',
            editable: true,
            allowBlank: false,
            maxValue: '31/12/2100',
            minValue:'01/01/1900',
            vtype: 'daterange'
        });

        this.dfFInicioMiem.on('change',function(n){
            var idcomisionpersona = self.gpMiembro.getSelectionModel().getSelected().data.idcomisionpersona;
            Ext.getBody().mask('Guardando datos...');
            Ext.Ajax.request({
                url: '/pvd/maestro/configuraciones/index.php/comision/modMiembro',
                params: {
                    idcomisionpersona: idcomisionpersona,
                    fdesde: n.getRawValue()
                },
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    self.stMiembros.reload();
                }
            });
        });

        this.dfFFinMiem = new Ext.form.DateField({
            name: 'fhasta',
            hiddenname:'fhasta',
            anchor:'97%',
            format:'d/m/Y',
            editable:true,
            maxValue:'31/12/2100',
            minValue:'01/01/1900',
            startDateField: 'dfFInicioMiem',
            vtype:'daterange'
        });

        this.dfFFinMiem.on('change',function(n){
            var idcomisionpersona = self.gpMiembro.getSelectionModel().getSelected().data.idcomisionpersona;
            Ext.getBody().mask('Guardando datos...');
            Ext.Ajax.request({
                url: '/pvd/maestro/configuraciones/index.php/comision/modMiembro',
                params: {
                    idcomisionpersona: idcomisionpersona,
                    fhasta: n.getRawValue()
                },
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function (r) {
                    self.stMiembros.reload();
                }
            });
        });

        this.stCargos = new Ext.data.Store({
            url: '/pvd/maestro/configuraciones/index.php/comision/getCargosComisiones',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idcargocomision"},
                [{name:'idcargocomision'}, {name:'cargocomision'}]
            )
        });
        self.stCargos.load();

        this.cbCargoMiem = new Ext.form.ComboBox({
            store: this.stCargos,
            anchor: '98%',
            height: 100,
            name:'idcargocomision',
            hiddenName:'idcargocomision',
            displayField: 'cargocomision',
            valueField: 'idcargocomision',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            listeners: {
                select: function(cb) {
                    var idcomisionpersona = self.gpMiembro.getSelectionModel().getSelected().data.idcomisionpersona;
                    Ext.getBody().mask('Guardando datos...');
                    Ext.Ajax.request({
                        url: '/pvd/maestro/configuraciones/index.php/comision/modMiembro',
                        params: {
                            idcomisionpersona: idcomisionpersona,
                            idcargocomision: cb.getValue()
                        },
                        callback: function () {
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            self.stMiembros.reload();
                        }
                    });
                }
            }
        });

        function formatDateDm(value) {
            if (value) {
                var f;
                if (value instanceof Date) {
                    f = value.format('d/m/Y');
                    self.gpMiembro.getSelectionModel().getSelected().set('fdesde', self.dfFInicioMiem.getRawValue());
                } else {
                    f = value;
                }
                return f
            }
        }

        function formatDateHm(value) {
            if (value) {
                var f;
                if (value instanceof Date) {
                    f = value.format('d/m/Y');
                    self.gpMiembro.getSelectionModel().getSelected().set('fhasta', self.dfFFinMiem.getRawValue());
                } else {
                    f = value;
                }
                return f
            }
        }

        this.smselect = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });

        //Listado de valores.
        this.gpMiembro = new Ext.grid.EditorGridPanel({
            title: 'Listado de miembros',
            clicksToEdit: 1,
            region: 'south',
            sm: this.smselect,
            height: 250,
            loadMask: {msg: 'Cargando...'},
            store: this.stMiembros,
            plugins:this.expander1,
            tbar: [this.btnAdicionar, this.btnEliminar,
                '-',
                this.idioma.lbDenominacion+':',
                this.tfbuscar,
                this.btnBuscar,
                this.btnLimpiar
            ],
            columns: [this.expander1,
                {
                    header: 'No. de identidad',
                    width: 120,
                    dataIndex: 'numid'
                },{
                    header: 'Apellidos y nombres',
                    width:250,
                    dataIndex: 'nombreyapellidos'
                },{
                    header: 'Cargo en la comisi&oacute;n',
                    width:200,
                    dataIndex: 'cargocomision',
                    editor: this.cbCargoMiem
                },{
                    header: 'Desde',
                    width:100,
                    dataIndex: 'fdesde',
                    editor: this.dfFInicioMiem,
                    renderer: formatDateDm
                },{
                    header: 'Hasta',
                    width:100,
                    dataIndex: 'fhasta',
                    editor: this.dfFFinMiem,
                    renderer: formatDateHm
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stMiembros,
                displayInfo: true
            })
        });

        this.gpMiembro.getSelectionModel().on('rowselect', function (n) {
            miemselect = n.getSelected().data;
            self.btnEliminar.enable();
        }, this);

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

        this.stDominios = new Ext.data.Store({
            url: '/pvd/maestro/configuraciones/index.php/comision/getDominios',
            reader: new Ext.data.JsonReader(
                {root: "", id: "iddominio", totalProperty: "cantidad"},
                [{name:'iddominio'},{name:'denominacion'}]
            )
        });

        this.stDominios.on('load', function(){
            if (accion == 'mod') {
                var recDominios = self.stDominios.getRange();
                var dom = Comisionselec.iddominios;
                Ext.each(recDominios, function (rec)
                {
                    if (dom.indexOf(rec.id) > -1) {
                        var index = self.stDominios.indexOf(rec);
                        self.cbDominios.onSelect(rec, index);
                    }
                }, this);
            }
        });

        this.cbDominios = new Ext.ux.form.LovCombo({
            store: this.stDominios,
            displayField: 'denominacion',
            fieldLabel: 'Dominios',
            mode: 'local',
            allowBlank : false,
            anchor: '99%',
            hiddenName: 'iddominio',
            typeAhead: true,
            enableQtip: true,
            triggerAction: 'all',
            editable: false,
            emptyText:'Seleccione...',
            listeners: {
                render: function(combo) {
                    this.triggers[1].remove();
                },
                beforeselect: function(combo, record, index) {
                    this.valueField = 'iddominio';
                },
                blur: function() {
                    this.valueField = 'iddominio';
                    this.isValid();
                    if (this.getRawValue() != '') {
                        this.clearInvalid();
                    }
                }
            }
        });

        var fecha = new Date();

        this.dfFInicio = new Ext.form.DateField({
            id: 'dfFInicio'+self.panel.id,
            allowBlank : false,
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
            vtype:'daterange'
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
                        items: [this.cbDominios]
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
                GuardarComision('ACP');
            }.createDelegate(this)
        });

        this.btnAplicarE = new Ext.Button({
            id: 'btnAplicarE',
            iconCls: 'aplicar',
            tooltip: this.idioma.textToolTipAplicar,
            text: this.idioma.lbBtnAplicar,
            handler: function ()
            {
                GuardarComision('APL');
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
                    self.stDominios.load();
                    self.tfdenom.focus(true, 500);
                },
                'hide': function()
                {
                    self.btnAdicionarCom.focus();
                    resetearFormComision();
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

        //Fuente de datos del listado de personas.
        var connObjPer = new Ext.data.Connection({
            timeout : 3600000,
            url: '/pvd/maestro/configuraciones/index.php/comision/getPersonas',
            method : 'POST'
        });

        this.stPersonas = new Ext.data.GroupingStore({
            proxy: new Ext.data.HttpProxy(connObjPer),
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idpersona", totalProperty: "cantidad"},
                [{name:'idpersona'},{name:'numid'}, {name:'nombreyapellidos'}, {name:'cargo'}, {name:'area'}, {name:'orden'},
                    {name:'idcargocomision'}, {name:'cargocomision'}, {name:'fdesd'}, {name:'fhast'}, {name:'entidad'}, {name:'entidad_area'}]
            ),
            sortInfo   : {
                field: 'orden',
                direction: "DESC"
            },
            groupField : 'entidad_area',
            remoteGroup: true
        });

        this.sfBuscarPer = new Ext.app.SearchField({
            store: this.stPersonas,
            pageSize: 15,
            toolTipTrigger1: this.idioma.lbBtnLimpiar,
            toolTipTrigger2: this.idioma.lbBtnBuscar,
            emptyText: 'Criterio de búsqueda'
        });

        this.smselectPer = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.dfFInicio = new Ext.form.DateField({
            id: 'dfFInicio',
            name: 'fdesde',
            hiddenname: 'fdesde',
            anchor:'97%',
            format:'d/m/Y',
            value: fecha.format('d/m/Y'),
            editable: false,
            allowBlank: false,
            maxValue: '31/12/2100',
            minValue:'01/01/1900',
            vtype: 'daterange'
        });

        this.dfFFin2 = new Ext.form.DateField({
            name: 'fhasta',
            hiddenname:'fhasta',
            anchor:'97%',
            format:'d/m/Y',
            editable:false,
            maxValue:'31/12/2100',
            minValue:'01/01/1900',
            startDateField: 'dfFInicio',
            vtype:'daterange'
        });

        this.cbCargo = new Ext.form.ComboBox({
            store: this.stCargos,
            anchor: '98%',
            height: 100,
            name:'idcargocomision',
            hiddenName:'idcargocomision',
            displayField: 'cargocomision',
            valueField: 'idcargocomision',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            readOnly: true,
            listeners: {
                select: function(combo, r) {
                    self.gpPersonas.getSelectionModel().getSelected().set('idcargocomision', combo.getValue());
                    combo.setValue(combo.getRawValue());
                }
            }
        });

        function formatDateD(value) {
            if (value) {
                var f;
                if (value instanceof Date) {
                    f = value.format('d/m/Y');
                    self.gpPersonas.getSelectionModel().getSelected().set('fdesd', self.dfFInicio.getRawValue());
                } else {
                    f = value;
                }
                return f
            }
        }

        function formatDateH(value) {
            if (value) {
                var f;
                if (value instanceof Date) {
                    f = value.format('d/m/Y');
                    self.gpPersonas.getSelectionModel().getSelected().set('fhast', self.dfFFin2.getRawValue());
                } else {
                    f = value;
                }
                return f
            }
        }

        this.gpPersonas = new Ext.grid.EditorGridPanel({
            //title   : 'Listado de personas',
            tbar: ['Buscar persona: ', this.sfBuscarPer, '-'],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
            }),
            store   : this.stPersonas,
            clicksToEdit: 1,
            sm: this.smselectPer,
            loadMask: {msg: 'Cargando ...'},
            columns : [this.smselectPer,
                {
                    header   : 'No. identidad',
                    width    : 100,
                    dataIndex: 'numid'
                }, {
                    header   : 'Apellidos y nombres',
                    width    : 200,
                    dataIndex: 'nombreyapellidos'
                }, {
                    header   : 'Cargo en la comisión',
                    width    : 100,
                    dataIndex: 'cargocomision',
                    editor: this.cbCargo
                }, {
                    header   : 'Desde',
                    width    : 100,
                    dataIndex: 'fdesd',
                    editor: this.dfFInicio,
                    renderer: formatDateD
                }, {
                    header   : 'Hasta',
                    width    : 100,
                    dataIndex: 'fhast',
                    editor: this.dfFFin2,
                    renderer: formatDateH
                }, {
                    width    : 200,
                    hidden   : true,
                    dataIndex: 'entidad_area'
                }
            ],
            bbar    : new Ext.PagingToolbar({
                pageSize   : 15,
                store      : this.stPersonas,
                displayInfo: true
            })
        });

        this.btnCancelarC = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: this.idioma.textToolTipCancelar,
            text: this.idioma.lbBtnCancelar,
            handler: function ()
            {
                self.windAddMiembro.hide();
            }.createDelegate(this)
        });

        this.btnAceptarC = new Ext.Button({
            nextTab: 'tfdenomp'+self.panel.id,
            iconCls: 'aceptar',
            tooltip: this.idioma.textToolTipAceptar,
            text: this.idioma.lbBtnAceptar,
            handler: function ()
            {
                guardarMiembros();
            }.createDelegate(this)
        });

        //Ventana de gestion.
        this.windAddMiembro = new Ext.Window({
            title: 'Adicionar miembros',
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 850,
            height: 500,
            items: [this.gpPersonas],
            buttons: [
                this.btnCancelarC,
                this.btnAceptarC
            ],
            listeners: {
                'beforeshow': function()
                {
                    self.stPersonas.load({params:{start:0,limit:15}});
                },
                'hide': function()
                {
                    self.btnAdicionar.focus();
                    self.gpPersonas.getSelectionModel().clearSelections();
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

        this.items = [this.gpMiembro, this.panel];

        this.panel.on('render', function ()
        {
            self.btnAdicionarCom.focus();
        });

        function GuardarComision(btnpress)
        {
            if(self.formularioGestionE.getForm().isValid()){
                Ext.Ajax.request({
                    url: (accion == 'add' ? '/pvd/maestro/configuraciones/index.php/comision/addComision' : '/pvd/maestro/configuraciones/index.php/comision/updateComision'),
                    params: {
                        idcomision: accion == 'add' ? -1 : Comisionselec.idcomision,
                        denominacion: self.tfdenom.getValue(),
                        dominios: self.cbDominios.getValue(),
                        fdesde: self.dfFInicio.getRawValue(),
                        fhasta: self.dfFFin.getRawValue(),
                        descripcion: self.tadescripcion.getValue()
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if(accion == 'mod')
                            {
                                mostrarMensaje(1, self.idioma.comision.msgModTSucces);
                            }else{
                                mostrarMensaje(1, self.idioma.comision.msgAddTSucces);
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
                            mostrarMensaje(6, self.idioma.comision.msgTExistem);
                        }
                    }
                });
            }
        }

        function guardarMiembros()
        {
            var miembros = new Array();
            var s = self.gpPersonas.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                miembros.push(s[i].data);
            }
            if(s.length > 0){
                Ext.Ajax.request({
                    url: '/pvd/maestro/configuraciones/index.php/comision/addMiembro',
                    params: {
                        idcomision: Comisionselec.idcomision,
                        miembros: Ext.encode(miembros)
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData == true) {
                            mostrarMensaje(1, 'Los miembros han sido adicionados satisfactoriamente.');
                            self.windAddMiembro.hide();
                            self.stMiembros.removeAll();
                            self.stMiembros.reload();
                        } else if (responseData == 2) {
                            mostrarMensaje(6, 'Alguna de las personas seleccionadas ya existe.');
                        }

                    }
                });
            } else {
                mostrarMensaje(6, 'Debe seleccionar al menos una persona.');
            }
        }

        function eliminarComision()
        {
            var ids = new Array();
            var s = self.gpDatos.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idcomision);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar la comision seleccionada?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar las Comisiones seleccionadas?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(self.idioma.msgEspereDelete);
                    Ext.Ajax.request({
                        url: '/pvd/maestro/configuraciones/index.php/comision/deleteComision',
                        params: {comisiones: Ext.encode(ids)},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'La comisi&oacute;n seleccionada no puede ser eliminado debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguna de las comisiones seleccionadas no puede ser eliminada debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'La comisi&oacute;n ha sido eliminada satisfactoriamente.';
                                } else {
                                    mensaje = 'Las comisiones han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            self.stDatos.removeAll();
                            self.stDatos.reload();
                            self.stMiembros.removeAll();
                        }
                    });
                }
            });
        }
		
		function eliminarMiembro()
        {
            var ids = new Array();
            var s = self.gpMiembro.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                ids.push(s[i].data.idcomisionpersona);

            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar el miembro seleccionado?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar los miembros seleccionados?';
            }
            mostrarMensaje(2, mensaje, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Eliminando datos. Por favor espere...');
                    Ext.Ajax.request({
                        url: '/pvd/maestro/configuraciones/index.php/comision/deleteMiembro',
                        params: {
                            valores: Ext.encode(ids)
                        },
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if(responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'El miembro seleccionado no puede ser eliminado debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguno de los miembros seleccionados no puede ser eliminado debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'El miembro ha sido eliminado satisfactoriamente.';
                                } else {
                                    mensaje = 'Los miembros han sido eliminados satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                            }
                            self.stMiembros.removeAll();
                            self.stMiembros.reload();
                        }
                    });
                }
            });
        }

        function resetearFormComision(){
            self.tfdenom.reset();
            self.cbDominios.reset();
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
                    } else if (!self.btnAdicionarCom.disabled) {
                        self.btnAdicionarCom.handler();
                    }

                }
            },
            {
                key: 'm',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!self.btnModificarCom.disabled) {
                        self.btnModificarCom.handler();
                    }
                }
            },
            {
                key: 'b',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (self.tfbuscarCom.getValue() != '') {
                        self.btnBuscarCom.handler();
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
                    } else if (self.tfbuscarCom.getValue() != '') {
                        self.btnLimpiarCom.handler();
                    }
                }
            },
            {
                key: 46,//Eliminar
                //stopEvent: true,
                fn: function () {
                    if (!self.btnEliminar.disabled) {
                        self.btnEliminar.handler();
                    } else if (!self.btnEliminarCom.disabled) {
                        self.btnEliminarCom.handler();
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

        Pvd.Maestro.Configuraciones.Comision.superclass.initComponent.call(this);
    }
});
