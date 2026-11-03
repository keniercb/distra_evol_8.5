
/*
 * Componente Motivo de baja.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.MovimientosLaborales
 * @uses Pvd.MovimientosLaborales.Nomencladores.Motivobaja
 * @copyright XETID
 * @version 1.0
 */ 
 Ext.ns("Pvd.MovimientosLaborales.Nomencladores");
 Pvd.MovimientosLaborales.Nomencladores.CmpTreeGrid = Ext.extend(Ext.ux.maximgb.treegrid.GridPanel,{
    stripeRows: true,
     border: false,
    autoExpandColumn: 'expand',
    master_column_id: 'expand',
    expand: true,
    root_title: 'Motivos de baja',
    viewConfig: {forceFit: true},
    loadMask:{msg: 'Cargando...'},    
    initComponent: function(){
        var self = this;
        var busc = 0;
		this.store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
            autoLoad: true,
			remoteSort: true,
            url: '/pvd/movimientoslaborales/index.php/nomencladores/getMotivosBaja',
            listeners:{
                beforeexpandnode: function(st, record){					
					st.baseParams.id = record.get('idmotivobaja');
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
                id: 'idmotivobaja',
                successProperty: 'success'
            },
            [
				{name: 'idmotivobaja'},
                {name: '_parent'},
                {name: '_is_leaf'},
				{name: 'iconCls'},
				{name: 'denominacion'},
                {name: 'descripcion'},
				{name: 'fdesde'},
				{name: 'fhasta'},
                {name: 'gestion'},
                {name: 'fluctuacion'}
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
           ,{header: 'Fluctúa', width: 70, sortable: true, dataIndex: 'fluctuacion', renderer: function (v) {
                if (v == 1) {
                    return 'Si';
                } else {
                    return 'No';
                }
            }}
           ,{header: '',hidden:true, width: 70, sortable: true, dataIndex: 'idpadre'}
        ];

        this.search = new Ext.form.TextField({
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
            name: 'fdesdemb',		
			id: 'fdesdemb',
            width: 140,
            format: 'd/m/Y',
            vtype: 'daterange',
            endDateField: 'fhastamb',
            listeners: {
                specialkey: function (t, e) {
                    if (e.keyCode == 13) {
                        self.btnBuscar.handler();
                    }
                }
            }

        });

        this.dfUp = new Ext.form.DateField({
            name: 'fhastamb',
			id: 'fhastamb',
            width: 140,
            format: 'd/m/Y',
            value: '',
            vtype: 'daterange',
            startDateField: 'fdesdemb',
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
            text: this.idioma.BtnBuscar,
            tooltip: this.idioma.lbBtnBuscarMB,
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

Pvd.MovimientosLaborales.Nomencladores.Motivobaja = Ext.extend(Ext.Panel,{
    layout: 'fit',
    id: 'motbaja',
    title: 'Motivo de baja',
    region: 'center',
    height: '100%',
    closable: true,
    iconCls: '',
    initComponent: function () {
        //Variables
        var self = this;
		var objselect, accion;	
		this.tgMotivobaja = new Pvd.MovimientosLaborales.Nomencladores.CmpTreeGrid({idioma: this.idioma});
		this.items = [this.tgMotivobaja];
		
		this.tgMotivobaja.getSelectionModel().on('rowselect', function (n) {
            objselect = n.getSelected().data;
            if (objselect.gestion == 1) {
                self.btnModificar.enable();
                self.btnEliminar.enable();
            } else {
                self.btnModificar.disable();
                self.btnEliminar.disable();
            }
        }, this);
		
		this.tgMotivobaja.store.on('load', function () {
            objselect = null;
            self.btnModificar.disable();
            self.btnEliminar.disable();
        }, this);
		
		//Botón ayuda
		this.btnAyuda = new Ext.Button({
            id: 'idbtnAyudaMotivodebaja',
            text: this.idioma.BtnAyuda,
            tooltip: self.idioma.textToolTipAyuda,
            iconCls: 'ayuda'
		});
		
		//Botón para adicionar.
		this.btnAdicionar = new Ext.Button({
            text: this.idioma.BtnAdicionar,
            tooltip: this.idioma.lbBtnAdicionarMB,
            iconCls: 'adicionar',
			handler: function ()
            {
                self.ventanaGestion.setTitle(self.idioma.lbCrearMB);
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
            tooltip: this.idioma.lbBtnModificarMB,
            iconCls: 'modificar',
			handler: function ()
            {
                self.ventanaGestion.setTitle(self.idioma.lbModificarMB);
				self.ventanaGestion.show();
				self.btnAplicar.hide();
				self.tfdenom.setValue(objselect.denominacion);
				self.dfFInicio.setValue(objselect.fdesde);
				self.dfFFin.setValue(objselect.fhasta);
				self.tadescripcion.setValue(objselect.descripcion);
				if (objselect.fluctuacion == 1){
                    self.chbFluctuacion.setValue(true);
                } else {
                    self.chbFluctuacion.setValue(false);
                }
                accion = 'mod';
            }.createDelegate(this)
		});

		//Boton para eliminar.
		this.btnEliminar = new Ext.Button({
            text: this.idioma.BtnEliminar,
            disabled: true,
            tooltip: this.idioma.lbBtnEliminarMB,
            iconCls: 'eliminar',
			handler: function ()
            {
                eliminar();
            }.createDelegate(this)
		});
	
		//textfield denominacion
		this.tfdenom = new Ext.form.TextField({
            id: 'tfdenommb'+self.tgMotivobaja.id,
			fieldLabel: this.idioma.lbDenominacion,
			allowBlank : false,
            maxLength: 100,
			enableKeyEvents: true,
            maskRe: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+\-_/.\s]$/,
            regexText: self.idioma.msgCaracteres,
            anchor:	'99%',
			name : 'denominacion'		
		});

        var fecha = new Date();

        this.dfFInicio = new Ext.form.DateField({
			id: 'dfFIniciomb'+self.tgMotivobaja.id,
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
            startDateField: 'dfFIniciomb'+self.tgMotivobaja.id,
			vtype:'daterange',
			emptyText: this.idioma.lbEmptyTextFecha
		});

        this.chbFluctuacion = new Ext.form.Checkbox({
            boxLabel      : 'Influye en la fluctuación',
            hidden        : false,
            labelSeparator: '',
            hideLabel: true,
            name          : 'fluctuacion',
            anchor        : '98%'
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
                },
                {
                    columnWidth:1.0,
                    layout: 'form',
                    items: [this.chbFluctuacion]
                }]
            }]
		});
        
        this.btnCancelar = new Ext.Button({
            nextTab: 'tfdenommb'+self.tgMotivobaja.id,
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
            nextTab: 'tfdenommb'+self.tgMotivobaja.id,
            iconCls: 'aceptar',
			tooltip: this.idioma.textToolTipAceptar,
            text: this.idioma.lbtnAceptar,
            listeners: {
                'enable': function()
                {
                    self.btnCancelar.nextTab = 'btnAplicarmb';
                },
                'disable': function()
                {
                    self.btnCancelar.nextTab = 'tfdenommb'+self.tgMotivobaja.id;
                }
            },
			handler: function ()
            {
                guardarDatos('ACP');
            }.createDelegate(this)
        });
        
        this.btnAplicar = new Ext.Button({
            id: 'btnAplicarmb',
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
			title: this.idioma.lbCrearTPMB,
			width: 360,
			height: 330,
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
                    idpadre = objselect.idmotivobaja;
                }
                Ext.Ajax.request({
                    url: (accion == 'add' ? 'addMotivoBaja' : 'updateMotivoBaja'),
                    params: {
                        idmotivobaja: accion == 'add' ? -1 : objselect.idmotivobaja,
                        idpadre: accion == 'add' ? idpadre: objselect._parent,
                        denominacion: self.tfdenom.getValue(),
                        descripcion: self.tadescripcion.getValue(),
                        fdesde: self.dfFInicio.getRawValue(),
                        fhasta: self.dfFFin.getRawValue(),
                        fluctuacion:(self.chbFluctuacion.checked == true) ? 1 : 2
                    },
                    success: function (r){
                        var responseData = Ext.decode(r.responseText);
                        if (responseData != false) {
                            if(accion == 'mod')
                            {
                                mostrarMensaje(1, self.idioma.msgCorrectoModMB);
                            }else{
                                mostrarMensaje(1, self.idioma.msgCorrectoAddMB);
                            }
                            if (btnpress == 'ACP')
                            {
                                self.ventanaGestion.hide();
                            }
                            self.formularioGestion.getForm().reset();
                            self.tgMotivobaja.store.removeAll();
                            self.tgMotivobaja.store.baseParams.id = null;
                            self.tgMotivobaja.store.load();
                        } else
                            mostrarMensaje(6,self.idioma.lbMsgAddFailMB);

                    }
                });
            }
        }

        function eliminar()
        {
            mostrarMensaje(2, self.idioma.lbTitMsgSeguroEliminarMB, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(self.idioma.lbTitMsgEliminandoMB);
                    Ext.Ajax.request({
                        url: 'deleteMotivoBaja',
                        params: {idmotivobaja: objselect.idmotivobaja},
                        callback: function (){
                            Ext.getBody().unmask();
                        },
                        success: function (r){
                            var responseData = Ext.decode(r.responseText);
                            if(responseData == false)
                                mostrarMensaje(6, self.idioma.lbDeleteFailMB);
                            else {
                                self.btnAdicionar.focus();
                                mostrarMensaje(1, self.idioma.lbMsgDeExitoMB);
                            }
                            self.tgMotivobaja.store.removeAll();
                            self.tgMotivobaja.store.baseParams.id = null;
                            self.tgMotivobaja.store.load();
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
                    if (!self.tgMotivobaja.btnBuscar.disabled) {
                        self.tgMotivobaja.btnBuscar.handler();
                    }
                }
            },
            {
                key: 'l',
                alt: true,
                //stopEvent: true,
                fn: function () {
                    if (!self.tgMotivobaja.btnLimpiar.disabled) {
                        self.tgMotivobaja.btnLimpiar.handler();
                    }
                }
            }
        ];

        Pvd.MovimientosLaborales.Nomencladores.Motivobaja.superclass.initComponent.call(this);
    }
});


