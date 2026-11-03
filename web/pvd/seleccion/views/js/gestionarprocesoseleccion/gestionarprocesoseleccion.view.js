/*
 * Gestionar proceso de selección.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Seleccion
 * @uses Pvd.Seleccion.Gestionarprocesoseleccion
 * @copyright XETID
 * @version 1.0
 */
Ext.ns('Pvd.Seleccion.Gestionarprocesoseleccion');

Pvd.Seleccion.Gestionarprocesoseleccion.Vista = {
    init: function (idioma, modelo) {
		//Botón ayuda
		this.btnAyuda = new Ext.Button({
			id:'btnAyuda',
			text: idioma.btnAyudaProceso_text,
			iconCls:'ayuda',
			disabled: false,
			tooltip: idioma.btnAyudaProceso_tooltips
		});

		//Botón para adicionar.
		this.btnAdicionar = new Ext.Button({
            id: 'btnAdd',
            text: idioma.btnAddProceso_text,
            tooltip: idioma.btnAddProceso_tooltips,
            iconCls: 'adicionar'
		});

		//Boton para modificar.
        this.btnModificar = new Ext.Button({
            id: 'btnUpd',
            text: idioma.btnModProceso_text,
			disabled: true,
            tooltip: idioma.btnModProceso_tooltips,
            iconCls: 'modificar'
		});

		//Boton para eliminar.
		this.btnEliminar = new Ext.Button({
            id: 'btnDel',
			disabled: true,
            text: idioma.btnDelProceso_text,
            tooltip: idioma.btnDelProceso_tooltips,
            iconCls: 'eliminar'
		});

		//Boton para asociar comité de ingreso.
		this.btnAsociar = new Ext.Button({
            id: 'btnAsociar',
			disabled: true,
            text: idioma.btnAsociar_text,
            tooltip: idioma.btnAsociar_tooltips,
            iconCls: 'asociar'
		});

		//Boton para gestionar las técnicas del proceso de selección.
		this.btnTecnica = new Ext.Button({
            id: 'btnTecnica',
			disabled: true,
            text: idioma.btnTecnica_text,
            tooltip: idioma.btnTecnica_tooltips,
            iconCls: 'tecnica'
		});

		//Boton para gestionar los modelos del proceso de selección.
		this.btnModelo = new Ext.Button({
            id: 'btnModelo',
			disabled: true,
            text: idioma.btnModelo_text,
            tooltip: idioma.btnModelo_tooltips,
			iconCls  : 'modelomatematico'
		});

		//Boton para gestionar el proceso de seleccion.
		this.btnGestProceso = new Ext.Button({
            id: 'btnGestProceso',
			disabled: true,
            text: idioma.btnGestProceso_text,
            tooltip: idioma.btnGestProceso_tooltips,
			iconCls: 'gestionaracciones'
		});

        //Boton para compartir el proceso de seleccion.
        this.btnCompartir = new Ext.Button({
            id: 'btnCompartir',
            disabled: true,
            text: idioma.btnCompartir_text,
            tooltip: idioma.btnCompartir_tooltip,
            iconCls: 'compartir'
        });

        //Boton para ver competencias.
        this.btnVerComp = new Ext.Button({
            id: 'btnVerComp',
            disabled: true,
            text: 'Perfil',
            tooltip: 'Perfil &uacute;nico de competencias.',
            iconCls: 'competencialaborales'
        });

        //Boton para Buscar.
        this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
            text: idioma.lbBuscar,
            tooltip: idioma.ttBuscarProcesos,
            iconCls: 'buscar'
        });

        //Boton para limpiar.
        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar',
            text: idioma.lbLimpiar,
            tooltip: idioma.ttLimpiar,
            iconCls: 'limpiar'
        });

        //textfield para el buscar
        this.tfbuscar = new Ext.form.TextField({
            id:'tfbuscar',
            allowBlank : true,
            minLength: 3,
            maxLength: 100,
            width: 180,
            enableKeyEvents: true,
            name : 'tfbuscador'
        });

        this.cbCargos = new Ext.form.ComboBox({
            fieldLabel: 'Cargo',
            store: modelo.stCargos,
            allowBlank : true,
            displayField: 'denominacion',
            valueField: 'idcargo',
            name: 'idcargo',
            mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            forceSelection: true,
            width: 300
        });

        this.chbMostrarMasProc = new Ext.form.Checkbox({
            id: 'chbMostrarMasProc',
            boxLabel: 'Mostrar m&aacute;s procesos',
            hidden: false,
            labelSeparator : '',
            name: 'mostrar',
            anchor: '98%'
        });

		//Expander
		this.expanderProcesos = new Ext.grid.RowExpander({
			tpl: new Ext.Template(
				'<p><b>Cargos:</b> {cargos}</p><br>'
			)
		});

        function mostrarFila(val, metaData, record, rowIndex, colIndex, store) {
			metaData.attr = 'ext:qtip="Doble click para gestionar selección de candidatos"';
            if ((record.get('cantd') >= 0 || record.get('cantd') == null) && (record.get('comitesexpirados').length > 0
                || record.get('tecnicasexpiradas') == 1 || record.get('planillasexpiradas') == 1) && val != null) {
                return '<span style="color:#ff9e0b;"><b>' + val + '</b></span>';
            } else if (record.get('otro') == 1 && val != null) {
                return '<span style="color:#420aff;"><b>' + val + '</b></span>';
            } else {
                return val;
            }
        }

		//Listado de procesos de selección.
        this.gpProcesosSeleccion = new Ext.grid.GridPanel({
            title: idioma.lb_tituloGrid,
            store: modelo.stProcesosSeleccion,
            border: false,
            tbar: ['Denominaci&oacute;n:', this.tfbuscar, '-', 'Cargo:', this.cbCargos, this.btnBuscar, this.btnLimpiar, '->', this.chbMostrarMasProc],
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group}'
            }),
			plugins:this.expanderProcesos,
			loadMask:{msg: idioma.lbCargando},
            columns: [this.expanderProcesos,
                {
                    width:300,
                    dataIndex: 'estado',
                    hidden: true
                },{
					header: idioma.tfDenominacion_label,
					width:250,
					dataIndex: 'denominacion',
                    renderer: mostrarFila
				},{
                    header: 'Entidad',
                    width:250,
                    dataIndex: 'estructura',
                    renderer: mostrarFila
                },{
					header: idioma.dfFDesde_label,
					width:100,
					dataIndex: 'fdesde',
                    renderer: mostrarFila
                },{
					header: idioma.dfFHasta_label,
					width:100,
					dataIndex: 'fhasta',
                    renderer: mostrarFila
                },{
					header: idioma.tfCantRec_label,
					width:100,
					dataIndex: 'recurso',
                    renderer: mostrarFila
                }
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stProcesosSeleccion,
                displayInfo: true
            })
        });

		this.pGeneral = new Ext.Panel({
            layout: 'fit',
			region: 'center',
            border: false,
			items: [this.gpProcesosSeleccion],
            tbar:[this.btnAdicionar,this.btnModificar,this.btnEliminar,'','-',
				this.btnAsociar, this.btnTecnica,this.btnModelo, '-', this.btnGestProceso,
                this.btnCompartir, this.btnVerComp, '->', '','-',this.btnAyuda]
        });

		//Componentes de Ventana Adicionar-Modificar proceso de selección.
		this.tfdenominacion = new Ext.form.TextField({
            id: 'tfdenominacion',
            nextTab: 'tfCantRec',
            fieldLabel: idioma.tfDenominacion_label,
            allowBlank: false,
            //minLength: 3,
			maxLength: 100,
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            regexText: idioma.msgCaracteres,
            width: '98%',
            name: 'denominacion'
        });

		this.tfCantRec = new Ext.form.NumberField({
            id: 'tfCantRec',
            prevTab: 'tfdenominacion',
            nextTab: 'dfInicio',
            fieldLabel: idioma.tfCantRec_label,
            allowBlank: true,
            minLength: 1,
            maxLength: 19,
            enableKeyEvents: true,
            allowDecimals: false,
            minValue: 1,
            width: '98%',
            name: 'recurso'
        });

		function mostrarValor(valor){
			if (valor == 0) {
				return 'NO';
			} else
				return 'SI';
		}

		this.smCargos = new Ext.grid.CheckboxSelectionModel({
			singleSelect: false
		});

		this.sfBuscarCargo = new Ext.app.SearchField({
            store: modelo.stCargos,
            emptyText: 'Criterio a buscar...',
			toolTipTrigger1: idioma.ttLimpiar,
            toolTipTrigger2: idioma.ttBuscar
        });

		this.gpCargos = new Ext.grid.GridPanel({
			height: 200,
			title: 'Listado de cargos',
			width: '100%',
			tbar: ['Buscar:', this.sfBuscarCargo],
			stripeRows: true,
			sm: this.smCargos,
			border: true,
			frame: true,
			autoScroll:true,
			store:modelo.stCargos,
			columns:[this.smCargos,
					{header: 'idcargo',hidden:true,width:50, dataIndex: 'idcargo'},
					{header: idioma.tfDenominacion_label,width:290, dataIndex: 'denominacion'},
					{header: 'Especializaci&oacute;n', width:85, dataIndex: 'especializacion', renderer: mostrarValor}
				],
            loadMask: {msg: 'Cargando...'}
		});

        this.chbParaContrato = new Ext.form.Checkbox({
            id: 'chbParaContrato',
            boxLabel: 'Selección para contratar',
            hidden: false,
            labelSeparator : '',
            name: 'contratar',
            anchor: '98%'
        });

        this.fsCargos = new Ext.form.FieldSet({
            title: 'Definir cargos',
            name: 'chcargos',
            id: 'chcargos',
            checkboxToggle: true,
            collapsed: false,
            layout: 'column',
            autoHeight: true,
            width: '94%',
            items: [
                {
                    columnWidth: 1.0,
                    layout: 'form',
                    items: this.gpCargos
                },
                {
                    columnWidth: 1.0,
                    layout: 'form',
                    items: [this.chbParaContrato]
                }
            ]
        });

		var fecha = new Date();
		this.dfInicio = new Ext.form.DateField({
			id: 'dfInicio',
            prevTab: 'tfCantRec',
            nextTab: 'dfFin',
			fieldLabel: idioma.dfFDesde_label,
			name: 'fdesde',
			hiddenname:'fdesde',
			anchor:'98%',
			format:'d/m/Y',
			maxValue:'31/12/2100',
			editable:false,
			readOnly : true,
			minValue:'01/01/1900',
			allowBlank:false,
			vtype:'daterange',
			endDateField: 'dfFin'
		});

		this.dfFin = new Ext.form.DateField({
            id: 'dfFin',
            prevTab: 'dfInicio',
            fieldLabel: idioma.dfFHasta_label,
            name: 'fhasta',
			hiddenname:'fhasta',
            anchor: '98%',
            format: 'd/m/Y',
            editable: false,
            readOnly: true,
            vtype: 'daterange',
            startDateField: 'dfInicio',
            maxValue: '31/12/2100',
            minValue: '01/01/1900'
        });

		this.fAddProceso = new Ext.form.FormPanel({
			frame: true,
            bodyStyle: 'padding: 7px 7px 0',
            border: false,
            autoDestroy: false,
            labelAlign: 'top',
            autoHeight: true,
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 0.7,
                            layout: 'form',
                            items: [this.tfdenominacion]
                        },{
                            columnWidth: 0.3,
                            layout: 'form',
                            items: [this.tfCantRec]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.dfInicio]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.dfFin]
                        },{
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [this.fsCargos]
                        }
                    ]
                },
                {
                    xtype: 'hidden',
                    name: 'idprocesoseleccion'
                }
            ]
        });

		this.btnCancelar = new Ext.Button({
            nextTab: 'tfdenominacion',
            iconCls: 'cancelar',
			tooltip: idioma.btnFrmCancelar_tooltips,
            text: idioma.btnFrmCancelar_text
        });

        this.btnAceptar = new Ext.Button({
            nextTab: 'tfdenominacion',
            iconCls: 'aceptar',
			tooltip: idioma.btnFrmAceptar_tooltips,
            text: idioma.btnFrmAceptar_text,
            listeners: {
                'enable': function()
                {
                    self.btnCancelar.nextTab = 'btnAplicar';
                },
                'disable': function()
                {
                    self.btnCancelar.nextTab = 'tfdenominacion';
                }
            }
        });

		this.btnAplicar = new Ext.Button({
            id: 'btnAplicar',
            iconCls: 'aplicar',
			tooltip: idioma.btnFrmAplicar_tooltips,
            text: idioma.btnFrmAplicar_text
        });
		var self = this;
		this.winAdicionarProceso = new Ext.Window({
			title:'Adicionar proceso',
            constrain:true,
			width: 500,
			height: 400,
			layout: 'fit',
			autoHeight: true,
			closable: true,
			resizable: false,
			closeAction: 'hide',
			items: [this.fAddProceso],
			modal: true,
			buttons: [this.btnCancelar, this.btnAplicar, this.btnAceptar],
            keys: [{
                    key: 'l',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.sfBuscarCargo.onTrigger1Click();
                    }
                },
                {
                    key: 'b',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.sfBuscarCargo.onTrigger2Click();
                    }
                }]
		});

		////////Componentes de la ventana de asociar comité de ingreso
		this.smComite = new Ext.grid.CheckboxSelectionModel({
			singleSelect: false
		});

		//Listado de comités de ingreso.
        this.gpComite = new Ext.grid.GridPanel({
            store: modelo.stComite,
			height: 350,
			loadMask:{msg: idioma.lbCargando},
			sm: this.smComite,
            columns: [this.smComite,
                {
					header: idioma.tfDenominacion_label,
					width:370,
					dataIndex: 'denominacion'
				}
            ]/*,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stComite,
                displayInfo: true
            })*/
        });

		this.btnCancelarComite = new Ext.Button({
            iconCls: 'cancelar',
			tooltip: idioma.btnFrmCancelar_tooltips,
            text: idioma.btnFrmCancelar_text
        });

        this.btnAceptarComite = new Ext.Button({
            iconCls: 'aceptar',
			tooltip: idioma.btnFrmAceptar_tooltips,
            text: idioma.btnFrmAceptar_text
        });

		this.winAsociarComite = new Ext.Window({
			title: idioma.lb_tituloWinAsiciar,
			width: 420,
            constrain:true,
			height: 350,
			layout: 'fit',
			autoHeight: true,
			closable: true,
			resizable: false,
			closeAction: 'hide',
			items: [this.gpComite],
			modal: true,
			buttons: [this.btnCancelarComite, this.btnAceptarComite]
		});

		/////componentes de la ventana Gestionar técnicas de selección

		//Botón para adicionar.
		this.btnAdicionarTecSel = new Ext.Button({
            id: 'btnAdicionarTecSel',
            text: idioma.btnAddProceso_text,
            tooltip: idioma.btnAddTecnica_tooltips,
            iconCls: 'adicionar'
		});

		//Boton para modificar.
        this.btnModificarTecSel = new Ext.Button({
            id: 'btnModificarTecSel',
            text: idioma.btnModProceso_text,
			disabled: true,
            tooltip: idioma.btnModTecnica_tooltips,
            iconCls: 'modificar'
		});

		//Boton para eliminar.
		this.btnEliminarTecSel = new Ext.Button({
            id: 'btnEliminarTecSel',
			disabled: true,
            text: idioma.btnDelProceso_text,
            tooltip: idioma.btnDelTecnica_tooltips,
            iconCls: 'eliminar'
		});

		this.btnArribaOrden = new Ext.Button({
            tooltip: 'Ordenar hacia arriba',
            iconCls: 'arriba',
            disabled: true
        });

		this.btnAbajoOrden = new Ext.Button({
            tooltip: 'Ordenar hacia abajo',
            iconCls: 'abajo',
            disabled: true
        });

		this.btnGuardarOrden = new Ext.Button({
            text: 'Guardar',
            tooltip: idioma.btnGuardarOrden_tooltips,
            iconCls: 'guardar',
            disabled: true
        });

		this.expanderTecnica = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                "<div style ='word-wrap:break-word;white-space:normal;'><p>&nbsp;&nbsp;<b>Modelo</b>:&nbsp;{modelomatematico}</p></div>"
            ),
            enableCaching: false
        });

		function showtick(val)
        {
            if (val == 1) {
                return "<img src=../../views/images/true.png width='16' height='16' />";
            } else {
                return '';
            }
        }

        function colorTexto(val, metaData, record, rowIndex, colIndex, store) {
            if(((record.get('cantd')!= null && record.get('cantd') < 0) || record.get('planillasexp') == 1) && val != null) {
                return '<span style="color:#ff0c07;"><b>' + val + '</b></span>';
            } else {
                return val;
            }
        }

		function colorTextoTiempo(val, metaData, record, rowIndex, colIndex, store) {
			var v = val;
			if (val != null) {
				if (record.get('unidad') == 2) {
					v = v/30;
					v = (v > 1)?v+' meses':v+' mes';
				} else if (record.get('unidad') == 3) {
					v = v/365;
					v = (v > 1)?v+' años':v+' año';
				} else if (record.get('unidad') == 1) {
					v = (v > 1)?v+' d&iacute;as':v+' d&iacute;a';
				}
			}
            if(((record.get('cantd')!= null && record.get('cantd') < 0) || record.get('planillasexp') == 1) && val != null) {
                return '<span style="color:#ff0c07;"><b>' + v + '</b></span>';
            } else {
                return v;
            }
        }

        this.cmTecnicasSeleccion = [this.expanderTecnica,
            {
                header: idioma.tfDenominacion_label,
                sortable: false,
                width: 250,
                dataIndex: 'planilla',
                renderer: colorTexto
            }, {
                header: idioma.dfFDesde_label,
                sortable: false,
                width: 100,
                dataIndex: 'fdesde',
                renderer: colorTexto
            }, {
                header: idioma.dfFHasta_label,
                sortable: false,
                width: 100,
                dataIndex: 'fhasta',
                renderer: colorTexto
            },{
                header: 'D&iacute;as de validez',
                sortable: false,
                width: 100,
                dataIndex: 'validez',
                renderer: colorTextoTiempo
            }, {
                header: idioma.hito_label,
                sortable: false,
                width: 50,
                align: 'center',
                dataIndex: 'hito',
                renderer: showtick
            }, {
                header: idioma.orden_label,
                sortable: false,
                width: 50,
                dataIndex: 'orden',
                renderer: colorTexto
            }
        ];

		this.gpTecnicasAsociadas = new Ext.grid.GridPanel({
			height: 300,
			width: '100%',
			tbar: [this.btnAdicionarTecSel, this.btnModificarTecSel, this.btnEliminarTecSel, '-', '->', this.btnArribaOrden, this.btnAbajoOrden, this.btnGuardarOrden],
			stripeRows: true,
			border: true,
			frame: true,
			plugins: this.expanderTecnica,
			autoScroll:true,
			loadMask:{msg: idioma.lbCargando},
			store:modelo.stTecnicasSeleccionAs,
			columns:this.cmTecnicasSeleccion
		});

		this.btnCerrarTecnica = new Ext.Button({
            iconCls: 'cerrar',
            text: 'Cerrar',
            tooltip: idioma.btnCerrar_tooltips
        });

		this.winGestionarTecnica = new Ext.Window({
			title: 'Gestionar técnicas de selección',
			width:700,
			height: 600,
            constrain:true,
			layout: 'fit',
			autoHeight: true,
			closable: true,
			resizable: false,
			closeAction: 'hide',
			items: [this.gpTecnicasAsociadas],
			modal: true,
			buttons: [this.btnCerrarTecnica]
		});

		/////////////Componentes de la ventana adicionar técnica de selección///////////////////

		this.cbPlanillaEval = new Ext.form.ComboBox({
			store: modelo.stPlanillas,
			fieldLabel: idioma.lbcbPlanillaEval,
			id:'cbPlanillaEval',
			displayField:'denominacion',
			valueField:'idplanilla',
			hiddenName:'idplanilla',
			typeAhead: true,
			mode: 'local',
			readOnly: true,
			emptyText: 'Seleccione...',
			forceSelection: true,
			triggerAction: 'all',
            allowBlank: false,
			selectOnFocus:true,
			anchor: '99%'
        });

		this.cbModeloMatematico = new Ext.form.ComboBox({
            extendField: 'descripcion',
            msgTarget: 'qtip',
            enableQtip: true,
            //disabled: true,
            fieldLabel: idioma.tfmodeloMatematico,
            store: modelo.stModelos,
			readOnly: true,
            displayField: 'denominacion',
            hiddenName: 'idmodelo',
            valueField: 'idmodelo',
            name: 'idmodelo',
			emptyText: 'Seleccione...',
            mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            forceSelection: true,
            anchor: '99%',
            allowBlank: false
        });

        this.tftiempo = new Ext.form.TextField({
            fieldLabel: 'Tiempo de validez',
            allowBlank: true,
            minLength: 1,
            maxLength: 3,
            enableKeyEvents: true,
            maskRe: /^([0-9]*)+$/,
            width: '97%',
            name: 'validez'
        });

		this.cbUnidadTime = new Ext.form.ComboBox({
            fieldLabel: 'Unidad',
            editable: false,
            store: modelo.stUnidad,
            displayField: 'tipo',
            valueField: 'id',
            name: 'id',
            mode: 'local',
            triggerAction: 'all',
            typeAhead: true,
            forceSelection: true,
            anchor: '97%',
			emptyText: 'Seleccione...',
            allowBlank: true
        });

		this.diAddTecnicaSelec = new Ext.form.DateField({
            id: 'diAddTecnicaSelec',
            hiddenname: 'fechainicio',
            fieldLabel: idioma.dfFDesde_label,
            name: 'fechainicio',
            value: fecha.format('d/m/Y'),
            anchor: '97%',
            format: 'd/m/Y',
            readOnly: false,
            allowBlank: false,
            vtype: 'daterange',
            endDateField: 'dfAddTecnicaSelec'
        });

		this.dfAddTecnicaSelec = new Ext.form.DateField({
            id: 'dfAddTecnicaSelec',
            fieldLabel: idioma.dfFHasta_label,
            name: 'fechafin',
            hiddenname: 'fechafin',
            anchor: '97%',
            format: 'd/m/Y',
            readOnly: false,
            vtype: 'daterange',
            startDateField: 'diAddTecnicaSelec'
        });

		this.cbCondiciones = new Ext.form.ComboBox({
            msgTarget: 'qtip',
            enableQtip: true,
			emptyText: 'Seleccione...',
            fieldLabel: idioma.lbCondicion,
            store: modelo.stCondicion,
            displayField: 'condicion',
            valueField: 'idcondicion',
            name: 'condicion',
            mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            forceSelection: true,
            anchor: '97%',
            allowBlank: false
        });

		this.cbValor = new Ext.form.ComboBox({
            extendField: 'descripcion',
            msgTarget: 'qtip',
            enableQtip: true,
            fieldLabel: 'Valor',
			emptyText: 'Seleccione...',
            store: modelo.stValor,
            displayField: 'denominacion',
            valueField: 'id',
            name: 'valor',
            mode: 'local',
            triggerAction: 'all',
            typeAhead: true,
            forceSelection: true,
            anchor: '97%',
            allowBlank: true
        });

		this.nfValor = new Ext.form.NumberField({
            fieldLabel: 'Valor',
            name: 'valor',
            allowNegative: false,
            allowBlank: true,
            anchor: '97%'
        });

		this.fsHito = new Ext.form.FieldSet({
			title: 'Es hito',
			name: 'hito',
			id: 'eshito',
			checkboxToggle: true,
			collapsed: true,
			layout: 'column',
			autoHeight: true,
			width: '95%',
			items: [
				{
					columnWidth: .50,
					layout: 'form',
					items: this.cbCondiciones
				},
				{
					columnWidth: .50,
					id: 'iditemcbValor',
					layout: 'form',
					items: [this.cbValor]
				},
				{
					columnWidth: .50,
					id: 'iditemnfValor',
					layout: 'form',
					hidden: true,
					items: [this.nfValor]
				}
			]
		});

		this.fsTiempoValidez = new Ext.form.FieldSet({
			title: 'Tiempo de validez',
			name: 'timefs',
			checkboxToggle: false,
			collapsed: false,
			layout: 'column',
			autoHeight: true,
			width: '95%',
			items: [
				{
					columnWidth: .5,
					layout: 'form',
					items: this.tftiempo
				},
				{
					columnWidth: .5,
					layout: 'form',
					items: [this.cbUnidadTime]
				}
			]
		});

		var self = this;
		this.fpTecnicaSelec = new Ext.form.FormPanel({
            labelAlign: 'top',
            region: 'center',
            margins: '5 5 5 5',
            width: '40%',
            height: 110,
            frame: true,
            autoShow: true,
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 1.0,
                            layout: 'form',
                            items: this.cbPlanillaEval
                        },
                        {
                            columnWidth: 1.0,
                            layout: 'form',
                            items: this.cbModeloMatematico
                        },
                        {
                            columnWidth: 1.0,
                            layout: 'form',
                            items: this.fsTiempoValidez
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: this.diAddTecnicaSelec
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: this.dfAddTecnicaSelec
                        },
                        {
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [this.fsHito]
                        }
                    ]
                }
            ]
        });

		this.btnAdicionarresponsabletec = new Ext.Button({
            id: 'btnAdicionarresponsabletec',
            nextTab: 'btnEliminarresponsabletec',
            prevTab: 'btnEliminartecnicarec',
            text: idioma.btnAdd_text,
            tooltip: idioma.tlpAddResponsable,
            iconCls: 'adicionar'
        });

		this.btnEliminarresponsabletec = new Ext.Button({
            id: 'btnEliminarresponsabletec',
            prevTab: 'btnAdicionarresponsabletec',
            text: idioma.btnDelResponsable,
            tooltip: idioma.tlpDelResponsable,
            iconCls: 'eliminar',
            disabled: true
        });

		this.smResponsableTecnica = new Ext.grid.CheckboxSelectionModel({
			singleSelect: false
		});

		this.cmResponsableTecnica = [this.smResponsableTecnica,
            {header: idioma.colNoExpediente,hidden: true, sortable: true, width: 90, dataIndex: 'idcomisionpersona'},
            {header: 'comision',hidden: true, sortable: true, width: 90, dataIndex: 'comision'},
			{header: idioma.colNoid,width: 100,sortable: true,dataIndex: 'numid'},
			{header: 'Cargo', width: 150, sortable: true, dataIndex: 'cargocomision'},
            {header: 'Apellidos y nombres',width: 90,sortable: true,dataIndex: 'nombreyapellidos'}
        ];

		this.gpResponsableTecnica = new Ext.grid.GridPanel({
            store: modelo.stResponsableTecnica,
            region: 'east',
            margins: '5 5 5 0',
			view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group}'
            }),
            width: '60%',
            columns: this.cmResponsableTecnica,
            title: 'Listado de responsables de la técnica de selección',
            tbar: [this.btnAdicionarresponsabletec, this.btnEliminarresponsabletec],
            viewConfig: {
                forceFit: true
            },
            loadMask: {msg: 'Cargando...'},
            sm: this.smResponsableTecnica
        });

		this.btnCancelarAddTecnicaSelec = new Ext.Button({
            iconCls: 'cancelar',
            text: idioma.btnFrmCancelar_text,
            tooltip: idioma.btnFrmCancelar_tooltips
        });

		this.btnAplicarAddTecnicaSelec = new Ext.Button({
            iconCls: 'aplicar',
            id: 'aplicPS',
            text: idioma.btnFrmAplicar_text,
            tooltip: idioma.btnFrmAplicar_tooltips
        });

		this.btnAceptarAddTecnicaSelec = new Ext.Button({
            nextTab: 'cbPlanillaEval',
            iconCls: 'aceptar',
            text: idioma.btnFrmAceptar_text,
            tooltip: idioma.btnFrmAceptar_tooltips
        });

		this.winAddTecnicaSelec = new Ext.Window({
            title: idioma.winAddTecnicaSelec,
            layout: 'border',
            constrain:true,
            width: '80%',
            height: 425,
            resizable: false,
            closeAction: 'hide',
            items: [this.fpTecnicaSelec, this.gpResponsableTecnica],
            modal: true,
            buttons: [this.btnCancelarAddTecnicaSelec, this.btnAplicarAddTecnicaSelec, this.btnAceptarAddTecnicaSelec]
        });

		//////////// Componentes de la ventana adicionar personas a técnica
		this.smPer = new Ext.grid.CheckboxSelectionModel({
			singleSelect: false
		});

		this.gpPersonas = new Ext.grid.GridPanel({
            //title: idioma.lbListado,
            width: '100%',
			height:430,
            region: 'center',
			sm: this.smPer,
            border: false,
			loadMask:{msg: idioma.lbCargando},
            stripeRows: true,
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: false,
                groupTextTpl: '{group}'
            }),
            store: modelo.stPersonas,
            columns: [this.smPer,
                {header: 'comision', width: 100,  hidden:true, dataIndex: 'comision'},
				{header: 'No. Identidad', width: 110, dataIndex: 'numid'},
				{header: 'Cargo', width: 200, dataIndex: 'cargocomision'},
                {header: 'Apellidos y nombres', width: 150, dataIndex: 'nombreyapellidos'}
            ]
        });

		function getRenderes() {
			return Ext.apply({
				showSexo: function (val) {
					if (val == 0) {
						return '<center><img src="/pvd/credenciales/views/images/female.png" /></center>';
					} else {
						return '<center><img src="/pvd/credenciales/views/images/male.png" /></center>';
					}
				}, showGradoMilitar: function (val, opt, rec) {
					// grado
					if (!Ext.isEmpty(val)) {
						return '<center><img ext:qtip="<b>' + rec.data.grado + '</b>" style="height: 16px;cursor: pointer" src="' + val + '" /></center>';
					} else {
						return '<center><img src="' + Ext.BLANK_IMAGE_URL + '" /></center>';
					}
				}
			});
		}

		this.btnCancelarAddPersona = new Ext.Button({
            iconCls: 'cancelar',
            text: idioma.btnFrmCancelar_text,
            tooltip: idioma.btnFrmCancelar_tooltips
        });

		 this.btnAceptarAddPersona = new Ext.Button({
             iconCls: 'aceptar',
            text: idioma.btnFrmAceptar_text,
            tooltip: idioma.btnFrmAceptar_tooltips
        });

		this.windaddPersona = new Ext.Window({
            layout: 'border',
            constrain: true,
            title:  idioma.lb_winAddPerson,
            modal: true,
            closeAction: 'hide',
            resizable: false,
            width: 750,
            height: 500,
            maximizable: true,
            buttons: [this.btnCancelarAddPersona, this.btnAceptarAddPersona],
            items: [this.gpPersonas]
        });

        //Componentes de la ventana para compartir procesos con otras entidades

        this.smEntidades = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.gpEntidades = new Ext.grid.GridPanel({
            height: 300,
            region: 'center',
            //title: 'Listado de entidades',
            width: '100%',
            stripeRows: true,
            sm: this.smEntidades,
            border: true,
            frame: true,
            autoScroll:true,
            store:modelo.stEntidades,
            columns:[this.smEntidades,
                {header: idioma.tfDenominacion_label+' de la entidad',width:470, dataIndex: 'denominacion'}
            ],
            loadMask: {msg: 'Cargando...'}
        });

        this.btnCancelarCompart = new Ext.Button({
            iconCls: 'cancelar',
            text: idioma.btnFrmCancelar_text,
            tooltip: idioma.btnFrmCancelar_tooltips
        });

        this.btnAceptarCompart = new Ext.Button({
            iconCls: 'aceptar',
            disabled: true,
            text: idioma.btnFrmAceptar_text,
            tooltip: idioma.btnFrmAceptar_tooltips
        });

        this.windCompartir = new Ext.Window({
            layout: 'border',
            constrain: true,
            title:  'Compartir proceso de selecci&oacute;n',
            modal: true,
            closeAction: 'hide',
            resizable: false,
            width: 520,
            height: 450,
            maximizable: true,
            buttons: [this.btnCancelarCompart, this.btnAceptarCompart],
            items: [this.gpEntidades]
        });

		//Componentes de la ventana Selección de candidatos

		this.tpMenuSeleccion = new Ext.tree.TreePanel({
            title: 'Funcionalidades',
            collapsible: true,
            split: true,
            minSize: 175,
            maxSize: 350,
            width: 250,
            region: 'west',
            animate: true,
            autoScroll: true,
            loader: modelo.tlMenuSeleccion,
            containerScroll: true,
            rootVisible: false,
            layout: 'fit',
            root: new Ext.tree.AsyncTreeNode({
                text: 'Raiz',
                id: 'idmenu'
            })
        });

		this.plantillaInicio = new Ext.XTemplate(
			'<br/><div id="titulo1"><center><h1>SELECCIÓN DE CANDIDATOS</h1></center></div>',
			'<hr id="separator"/>',
			'<br/>',
			'<table>',
				'<tr>',
					'<td width="25px" />',
					'<td>',
						'<div id="texto"><p>En esta sección se realiza la selección de candidatos a partir de las configuraciones previamente definidas para el proceso de selección. Se brinda también un conjunto de informaciones relacionadas con el proceso que se gestiona.</p><div>',
					'</td>',
				'</tr>',
			'</table>',
			'<br/>',
			'<br/>',
			'<table>',
				'<tr>',
					'<td width="25px" />',
					'<td>',
						'<div><image src="/pvd/seleccion/views/images/candidatos_small.png" /><div>',
					'</td>',
					'<td width="10px" />',
					'<td>',
						'<div id="titulo1">Gestión de candidatos</div>',
						'<hr id="separator2"/>',
						'<div id="texto"><p>Facilita la gestión del listado  de candidatos involucrados en el proceso de selección; permitiendo la adición y exclusión del proceso.</p><div>',
					'</td>',
					'<td width="25px" />',
				'</tr>',
				'<tr height="10px">',
				'<tr>',
					'<td width="25px">',
					'</td>',
					'<td>',
						'<div><image src="/pvd/seleccion/views/images/tecnica_small.png" /><div>',
					'</td>',
					'<td width="10px" />',
					'<td>',
						'<div id="titulo1">Técnica de selección</div>',
						'<hr id="separator2"/>',
						'<div id="texto"><p>Permite aplicar las técnicas de selección configuradas en el proceso a cada uno de los candidatos.</p><div>',
					'</td>',
					'<td width="25px" />',
				'</tr>',
				'<tr height="10px">',
				'<tr>',
					'<td width="25px">',
					'</td>',
					'<td>',
						'<div><image src="/pvd/seleccion/views/images/seleccion_small.png" /><div>',
					'</td>',
					'<td width="10px" />',
					'<td>',
						'<div id="titulo1">Gestionar selección</div>',
						'<hr id="separator2"/>',
						'<div id="texto"><p>Se obtiene una lista de preseleccionados luego de aplicar el modelo matemático para la selección sobre los resultados obtenidos en las técnicas. También se realiza la selección de los candidatos.</p><div>',
					'</td>',
					'<td width="25px" />',
				'</tr>',
				'<tr height="10px">',
				'<tr>',
					'<td width="25px">',
					'</td>',
					'<td>',
						'<div><image src="/pvd/seleccion/views/images/estadistica_small.png" /><div>',
					'</td>',
					'<td width="10px" />',
					'<td>',
						'<div id="titulo1">Análisis</div>',
						'<hr id="separator2"/>',
						'<div id="texto"><p>Muestra un análisis estadístico sobre los resultados arrojados en el proceso.</p><div>',
					'</td>',
					'<td width="25px" />',
				'</tr>',
			'</table>'
		);

		//<br/><div id="titulo1"><center><h1>SELECCIÓN DE CANDIDATOS</h1></center></div><hr id="separator"/><br/>

		this.pStart = new Ext.Panel({
            layout     : 'fit',
			region     : 'center',
			height     : 400,
			autoScroll : true
        });

		//Componentes del Panel Gestionar candidatos


		this.tabPanel = new Ext.TabPanel({
            region: 'center',
            border: false,
			height: '60%',
			defaults:{autoScroll:true},
            activeTab: 0,
            items: [{
                    title: 'Inicio',
                    id: 'inicio',
                    layout: 'fit',
					//iconCls: 'inicio',
					tabTip: 'Inicio',
   					html: this.plantillaInicio.compile()
                }],
            listeners: {
                activate: function (p) {
                    p.doLayout();
                }
            }
        });

		this.plantillaInformacion = new Ext.XTemplate(
			'<div class="estiloinfotitle">{denominacion}</div>',
			'<br/>',
			'<div class="estiloinfo"><b>Cantidad de personas:</b> {recurso}</div>',
			'<br/>',
			'<div class="estiloinfo"><b>Cargos:</b> {cargos}</div>',
			'<br/>',
			'<div class="estiloinfo"><b>Fecha inicio:</b> {fdesde}</div>',
			'<br/>',
			'<div class="estiloinfo"><b>Fecha fin:</b> {fhasta}</div>'
		);

		this.pDetallesProceso = new Ext.Panel({
			title: 'Detalles del proceso de selección',
            layout: 'fit',
			frame: true,
            border: false,
			region: 'south',
			autoScroll: true,
			collapsible: true,
			collapsed: false,
			id: 'pDetallesProceso',
			height: 200
        });

		this.pDerecha = new Ext.Panel({
            layout: 'border',
			region: 'center',
			height: '100%',
            frame: false,
			items: [this.tabPanel, this.pDetallesProceso]
        });

		this.windSeleccionCandidatos = new Ext.Window({
            layout: 'border',
            constrain: true,
            title:  'Gestionar selección de candidatos',
            modal: true,
            closeAction: 'hide',
            resizable: false,
            width: 900,
            height: 700,
            maximizable: false,
            items: [this.tpMenuSeleccion, this.pDerecha]
        });

        this.columnasgpcom = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            {header: 'Denominaci&oacute;n', width: 410, dataIndex: 'competencia', sortable : false}
        ]);

        //Listado de competencias.
        this.gpCompetencias = new Ext.grid.GridPanel({
            region: 'south',
            border: false,
            height: 400,
            loadMask: {msg: 'Cargando...'},
            store: modelo.stCompetencias,
            autoScroll: true,
            cm: this.columnasgpcom
        });
        
        this.winComp = new Ext.Window({
            title: 'Perfil &uacute;nico de competencias.',
            modal: true,
            closeAction: 'hide',
            constrain: true,
            resizable: false,
            layout: 'fit',
            width: 450,
            height: 400,
            items: [this.gpCompetencias]
        });

		//Vista general
        new Ext.Viewport({
            layout: 'fit',
            items: [this.pGeneral]
        });
    }
};

UCID.portal.cargarEtiquetas('gestionarprocesoseleccion', function(perfil, idioma){
	idioma = (idioma) ? idioma : perfil.etiquetas;
    var modelo = Pvd.Seleccion.Gestionarprocesoseleccion.Modelo;
    modelo.init();
    var vista = Pvd.Seleccion.Gestionarprocesoseleccion.Vista;
    vista.init(idioma, modelo);
    Pvd.Seleccion.Gestionarprocesoseleccion.Controlador.init(idioma, vista, modelo);
});
