
/*
 * Componente Motivo de movimiento.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.MovimientosLaborales
 * @uses Pvd.MovimientosLaborales.Nomencladores.Motivomovimiento
 * @copyright XETID
 * @version 1.0
 */ 
 Ext.ns("Pvd.MovimientosLaborales.Nomencladores");
 Pvd.MovimientosLaborales.Nomencladores.CmpTreeGridMM = Ext.extend(Ext.ux.maximgb.treegrid.GridPanel,{
    stripeRows: true,
    border: false,
    autoExpandColumn: 'expand',
    master_column_id: 'expand',
    expand: true,
    root_title: 'Motivos de movimiento',
    viewConfig: {forceFit: true},
    loadMask:{msg: 'Cargando...'},    
    initComponent: function(){
        var self = this;
        var busc = 0;
        this.store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
            autoLoad: true,
            remoteSort: true,
            url: '/pvd/movimientoslaborales/index.php/nomencladores/getMotivosMovimiento',
            listeners:{
                beforeexpandnode: function(st, record){
                    st.baseParams.id = record.get('idmotivomovimiento');
                },
                beforeload: function (st, options) {
                    //Validacion para que no expanda los nodos hijos
                    if (st.active_node && st.active_node.data._is_leaf) {
                        return false;
                    }
                },
                load: function (st, options) {
                    if (busc == 1 && st.getCount()==0) {
                        mostrarMensaje(1, self.idioma.lbNoDatosBusc);
                        busc = 0;
                    } else if (st.getCount()==0) {
                        mostrarMensaje(1, self.idioma.lbNoDatos);
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                    //totalProperty: 'total',
                    root: 'data',
                    id: 'idmotivomovimiento',
                    successProperty: 'success'
                },
                [
                    {name: 'idmotivomovimiento'},
                    {name: '_parent'},
                    {name: '_is_leaf'},
                    {name: 'iconCls'},
                    {name: 'denominacion'},
                    {name: 'descripcion'},
                    {name: 'fdesde'},
                    {name: 'fhasta'},
                    {name: 'gestion'}
                ]
            )
        });

        this.sm = new Ext.grid.CheckboxSelectionModel({
            singleSelect:true
        });
        this.columns = [
            {
                id: 'expand',
                header: 'Denominaci&oacute;n',
                width: 130,
                sortable: true,
                dataIndex: 'denominacion',
                renderer: function (value, meta, record) {
                    var iconCls = 'folder';
                    if (record.get('_is_leaf') == true) {
                        iconCls = 'motivo'
                    }
                    if (record.get('gestion') == 0) {
                        if (record.get('descripcion')) {
                            meta.attr = 'ext:qtip="No gestionable</br><b>Descripción:</b></br>' + record.get('descripcion') + '"';
                        } else {
                            meta.attr = 'ext:qtip="No gestionable"';
                        }
                    } else {
                        if (record.get('descripcion')) {
                            meta.attr = 'ext:qtip="<b>Descripción:</b></br>' + record.get('descripcion') + '"';
                        } else {
                            meta.attr = 'ext:qtip="<b>Sin descripción</b>"';
                        }
                    }
                    return "<div class='" + iconCls + "' style='width: 16px; height: 16px;'><p style='margin-left: 20px; margin-top: 2px;'>" + value + "</p></div>";
                }
            }
            ,{header: '', hidden: true,width: 100, sortable: true, dataIndex: 'id'}
            ,{header: 'Fecha inicio', width: 100, sortable: true, dataIndex: 'fdesde'}
            ,{header: 'Fecha fin', width: 70, sortable: true, dataIndex: 'fhasta'}
            ,{header: '',hidden:true, width: 70, sortable: true, dataIndex: 'idpadre'}
        ];

        this.search = new Ext.form.TextField({
            id: 'search' + self.id,
            width: 140,
            maxLength: 100,
            allowBlank: true,
            emptyText: 'Criterio a buscar...',
            regexp: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            minLength: 1,
            listeners: {
                specialkey: function (t, e) {
                    if (e.keyCode == 13 && self.search.isValid()) {
                        self.btnBuscar.handler();
                    }
                }.createDelegate(this)
            }
        });

        this.dfFrom = new Ext.form.DateField({
            name: 'fdesde',
            id: 'fdesde' + self.id,
            width: 140,
            format: 'd/m/Y',
            vtype: 'daterange',
            endDateField: 'fhasta' + self.id,
            listeners: {
                specialkey: function (t, e) {
                    if (e.keyCode == 13) {
                        self.btnBuscar.handler();
                    }
                }
            }

        });

        this.dfUp = new Ext.form.DateField({
            name: 'fhasta',
            id: 'fhasta' + self.id,
            width: 140,
            format: 'd/m/Y',
            value: '',
            vtype: 'daterange',
            startDateField: 'fdesde' + self.id,
            listeners: {
                specialkey: function (t, e) {
                    if (e.keyCode == 13) {
                        self.btnBuscar.handler();
                    }
                }
            }
        });

        this.btnBuscar = new Ext.Button({
            iconCls: 'buscar',
            id: 'btnBuscar' + self.id,
            text: this.idioma.BtnBuscar,
            tooltip: this.idioma.lbBtnBuscarMM,
            handler: function () {
                if (self.search.isValid()) {
                    self.store.baseParams.id = null;
                    self.store.removeAll();
                    self.store.load({params: {
                        denominacion: self.search.getValue(),
                        fdesde:self.dfFrom.getRawValue(),
                        fhasta:self.dfUp.getRawValue()
                    }});
                    busc = 1;
                }
            }.createDelegate(this)
        });

        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar' + self.id,
            text: this.idioma.BtnLimpiar,
            tooltip: this.idioma.lbBtnLimpiar,
            iconCls: 'limpiar',
            handler: function () {
                self.search.setValue('');
                self.dfFrom.reset();
                self.dfUp.reset();
                self.store.baseParams.id = null;
                self.store.removeAll();
                self.store.load()
            }
        });
        this.tbar = ['Denominación: ', this.search, ' ', 'Fecha inicio: ', this.dfFrom, ' ', 'Fecha fin: ', this.dfUp, '', this.btnBuscar, this.btnLimpiar];

        Pvd.MovimientosLaborales.Nomencladores.CmpTreeGrid.superclass.initComponent.call(this);
    }    
}); 

Pvd.MovimientosLaborales.Nomencladores.Motivomovimiento = Ext.extend(Ext.Panel,{
    layout: 'fit',
    id: 'motmov',
    title: 'Motivo de movimiento',
    region: 'center',
    height: '100%',
    closable: true,
    iconCls: '',
    initComponent: function () {
        //Variables
        var self = this;
		var objselect, accion;	
		this.tgMotivoMov = new Pvd.MovimientosLaborales.Nomencladores.CmpTreeGridMM({idioma: this.idioma});
		this.items = [this.tgMotivoMov];
		
		this.tgMotivoMov.getSelectionModel().on('rowselect', function (n) {
            objselect = n.getSelected().data;
            if (objselect.gestion == 1) {
                self.btnModificar.enable();
                self.btnEliminar.enable();
            } else {
                self.btnModificar.disable();
                self.btnEliminar.disable();
            }
        }, this);
		
		this.tgMotivoMov.store.on('load', function () {
            objselect = null;
            self.btnModificar.disable();
            self.btnEliminar.disable();
        }, this);
		
		//Botón ayuda
		this.btnAyuda = new Ext.Button({
            id: 'idbtnAyudaMotivodemovimiento',
            text: this.idioma.BtnAyuda,
            tooltip: self.idioma.textToolTipAyuda,
            iconCls: 'ayuda'
		});
		
		//Botón para adicionar.
		this.btnAdicionar = new Ext.Button({
            text: this.idioma.BtnAdicionar,
            tooltip: this.idioma.lbBtnAdicionarMM,
            iconCls: 'adicionar',
			handler: function ()
            {
                self.ventanaGestion.setTitle(self.idioma.lbCrearMM);
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
            tooltip: this.idioma.lbBtnModificarMM,
            iconCls: 'modificar',
			handler: function ()
            {
                self.ventanaGestion.setTitle(self.idioma.lbModificarMM);
				self.ventanaGestion.show();
				self.btnAplicar.hide();
				self.tfdenom.setValue(objselect.denominacion);
				self.dfFInicio.setValue(objselect.fdesde);
				self.dfFFin.setValue(objselect.fhasta);
				self.tadescripcion.setValue(objselect.descripcion);
				accion = 'mod';
            }.createDelegate(this)
		});

		//Boton para eliminar.
		this.btnEliminar = new Ext.Button({
            text: this.idioma.BtnEliminar,
            disabled: true,
            tooltip: this.idioma.lbBtnEliminarMM,
            iconCls: 'eliminar',
			handler: function ()
            {
                eliminar();
            }.createDelegate(this)
		});
	
		//textfield denominacion
		this.tfdenom = new Ext.form.TextField({
            id: 'tfdenommm'+self.tgMotivoMov.id,
			fieldLabel: this.idioma.lbDenominacion,
			allowBlank : false,	
			maxLength: 255,
			enableKeyEvents: true,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
            regexText: self.idioma.msgCaracteres,
            anchor:	'99%',
			name : 'denominacion'		
		});

        var fecha = new Date();

        this.dfFInicio = new Ext.form.DateField({
			id: 'dfFIniciomm'+self.tgMotivoMov.id,
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
            startDateField: 'dfFIniciomm'+self.tgMotivoMov.id,
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
            maxLength: 255,
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

        this.btnAceptar = new Ext.Button({
            nextTab: 'tfdenommm'+self.tgMotivoMov.id,
            iconCls: 'aceptar',
            tooltip: this.idioma.textToolTipAceptar,
            text: this.idioma.lbtnAceptar,
            listeners: {
                'enable': function()
                {
                    self.btnCancelar.nextTab = 'btnAplicarmm';
                },
                'disable': function()
                {
                    self.btnCancelar.nextTab = 'tfdenommm'+self.tgMotivoMov.id;
                }
            },
            handler: function ()
            {
                guardarDatos('ACP');
            }.createDelegate(this)
        });

        this.btnAplicar = new Ext.Button({
            id: 'btnAplicarmm',
            iconCls: 'aplicar',
            tooltip: this.idioma.textToolTipAplicar,
            text: this.idioma.lbtnAplicar,
            handler: function ()
            {
                guardarDatos('APL');
            }.createDelegate(this)
        });

        this.btnCancelar = new Ext.Button({
            nextTab: 'tfdenommm'+self.tgMotivoMov.id,
            iconCls: 'cancelar',
			tooltip: this.idioma.textToolTipCancelar,
            text: this.idioma.lbtnCancelar,
			handler: function ()
            {
                self.formularioGestion.getForm().reset();
				self.ventanaGestion.hide();
            }.createDelegate(this)
        });

		//Ventana de gestion.
		this.ventanaGestion = new Ext.Window({
			modal: true,
			closeAction: 'hide',
            constrain: true,
			resizable: false,
			layout: 'fit',
			title: this.idioma.lbCrearMM,
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

		this.tbar = [this.btnAdicionar,this.btnModificar,this.btnEliminar,'->',this.btnAyuda];

        this.on('render', function ()
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
                var idpadre = null;
                if (accion == 'add' && objselect) {
                    idpadre = objselect.idmotivomovimiento;
                }
                Ext.Ajax.request({
                    url: (accion == 'add' ? 'addMotivoMov' : 'updateMotivoMov'),
                    params: {
                        idmotivomovimiento: accion == 'add' ? -1 : objselect.idmotivomovimiento,
                        idpadre: accion == 'add' ? idpadre: objselect._parent,
                        denominacion: self.tfdenom.getValue(),
                        descripcion: self.tadescripcion.getValue(),
                        fdesde: self.dfFInicio.getRawValue(),
                        fhasta: self.dfFFin.getRawValue()
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if(accion == 'mod')
                            {
                                mostrarMensaje(1, self.idioma.msgCorrectoModMM);
                            }else{
                                mostrarMensaje(1, self.idioma.msgCorrectoAddMM);
                            }
                            if (btnpress == 'ACP')
                            {
                                self.ventanaGestion.hide();
                            }
                            self.formularioGestion.getForm().reset();
                            self.tgMotivoMov.store.removeAll();
                            self.tgMotivoMov.store.baseParams.id = null;
                            self.tgMotivoMov.store.load();
                        } else
                            mostrarMensaje(6,self.idioma.lbMsgAddFailMM);

                    }
                });
            }
        }

        function eliminar()
        {
            mostrarMensaje(2, self.idioma.lbTitMsgSeguroEliminarMM, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(self.idioma.lbTitMsgEliminando);
                    Ext.Ajax.request({
                        url: 'deleteMotivoMov',
                        params: {idmotivomovimiento: objselect.idmotivomovimiento},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if(responseData == false)
                                mostrarMensaje(6, self.idioma.lbDeleteFailMM);
                            else {
                                self.btnAdicionar.focus();
                                mostrarMensaje(1, self.idioma.lbMsgDeExitoMM);
                            }
                            self.tgMotivoMov.store.removeAll();
                            self.tgMotivoMov.store.baseParams.id = null;
                            self.tgMotivoMov.store.load();
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
                //stopEvent: true,
                fn: function () {
                    if (!self.btnEliminar.disabled) {
                        self.btnEliminar.handler();
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
            },
            {
                key: 'b',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.tgMotivoMov.btnBuscar.disabled) {
                        self.tgMotivoMov.btnBuscar.handler();
                    }
                }
            },
            {
                key: 'l',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.tgMotivoMov.btnLimpiar.disabled) {
                        self.tgMotivoMov.btnLimpiar.handler();
                    }
                }
            }
        ];

        Pvd.MovimientosLaborales.Nomencladores.Motivomovimiento.superclass.initComponent.call(this);
    }
});


