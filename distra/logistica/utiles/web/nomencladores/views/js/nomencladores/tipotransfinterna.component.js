Ext.ns('Ext.erp')

Ext.erp.tipotransfinterna = Ext.extend(Ext.erp.gridPanelNomenclador, {
	/**
	 *
	 **/
    constructor: function(config) {
    	var _this = this;

        Ext.apply(this, config);
        this.campoIdNomenclador =  'idtipotransfinterna';
        this.modificar = false;
        this.bussinesModel = 'NomTipotransfinternaModel';
        this.relacionador = new Ext.erp.relacionadorNom({
            height: 200,
            modeloIzq:'NomTipotransfinterna',
            idIzq:'idtipotransfinterna',
            valorCampo : 0,
            campoIdNomenclador : _this.campoIdNomenclador,
            modeloDer:'NomTipotransfinternaarea',
            idDer:'idtipotransfinterna',
            tituloIzq:'Dep\xf3sito',
            tituloDer:'Dep\xf3sito seleccionados',
            scope: this
        });

        this.storeFields = [{name:'pordefecto'}];
        this.columnsFields = [{
            dataIndex:'pordefecto',
            header: "Por defecto",
            width:95,
            renderer:function (value, metaData) {
                if(value == 1)
                {
                    metaData.css = 'activo';
                }else{
                    metaData.css = 'inactivo';
                }
            }
        }];
        
		this.formFields = [this.relacionador];

        Ext.erp.tipotransfinterna.superclass.constructor.call(this, config);

    },

    onBtnAdicionarClick : function (id) {
        var _this = this;
        this.stDer = 0;
        this.stIzq = 0;
        if (!_this.winGestionarNomenclador || !_this.winGestionarNomenclador.isVisible()) {
            var fecha = new Date();

            if (!this.idFechaInicio) {
                this.idFechaInicio = fecha.getTime() + 'desde';
                this.idFechaFin = fecha.getTime() + 'hasta';
            }

            if (!this.fpGestionarNomenclador) {
                var field1 = [];
                if (_this.codigo) {
                    this.codigofield = new Ext.form.TextField({
                        name: 'codigo',
                        id: fecha.getTime(),
                        anchor: '98%',
                        //maskRe: /^[0-9]/,
                        maskRe: _this.idioma.lbMasReCodigo || /^[0-9]/,
                        regex: _this.idioma.lbRegexCodigo,
                        regexText: _this.idioma.lbRegexCodigoText,
                        maxLength: _this.idioma.lbMaxLengthCodigo,
                        minLength: _this.idioma.lbMinLengthCodigo,
                        maxLengthText: _this.idioma.lbMsgMaxLongCodigo,
                        minLengthText: _this.idioma.lbMsgMinLongCodigo,
                        hidden: !_this.codigo,
                        disabled: !_this.codigo,
                        fieldLabel: _this.idioma.lbCodigo,
                        allowBlank: false,
                        listeners: {
                            'change': function (field, newValue, oldValue) {

                            }
                        }
                    })

                    field1 = [_this.codigofield];
                }
                this.tfDenom = new Ext.form.TextArea({
                    name: 'denominacion',
                    anchor: '98%',
                    fieldLabel: _this.idioma.lbDenominacion,
                    allowBlank: false,
                    enableKeyEvents: true,
//                   regex: /^[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9\+]+([-_/.\s\+]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9\+])+$/,
                    //maskRe: /^[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9\-_/.\/+s\+]$/,
                    maxLength: _this.idioma.lbMaxLengthDescripcion,
                    regexText: _this.idioma.lbRegexDescripText,
                    minLength: _this.idioma.lbMinLengthDescripcion,
                    maxLengthText: _this.idioma.lbMsgMaxLongDescripcion,
                    minLengthText: _this.idioma.lbMsgMinLongDescripcion
                });




                var fields2 = [this.tfDenom];
                if (_this.usarFecha) {
                    var fieldFecha = new Ext.form.FieldSet({
                        //autoWidth: true,
                        style: '-moz-border-radius:5px',
                        autoHeight: true,
                        layout: 'column',
                        anchor: '98%',
                        items: [
                            {
                                columnWidth: .5,
                                layout: 'form',
                                items: [
                                    {
                                        fieldLabel: 'Fecha inicio',
                                        xtype: 'datefield',
                                        vtype: 'daterange',
                                        name: 'fechainicio',
                                        id: _this.idFechaInicio,
                                        //minValue: this.value ? this.value :fecha.format('d/m/Y'),
                                        endDateField: _this.idFechaFin,
                                        value: fecha.format('d/m/Y'),
                                        anchor: '95%',
                                        minText: "La fecha de inicio tiene que ser anterior o igual a la fecha fin.",
                                        format: 'd/m/Y',
                                        enableKeyEvents: true,
                                        mode: 'local',
                                        readOnly: true
                                    }
                                ]
                            },
                            {
                                columnWidth: .5,
                                layout: 'form',
                                items: [
                                    {
                                        fieldLabel: 'Fecha fin',
                                        xtype: 'datefield',
                                        vtype: 'daterange',
                                        name: 'fechafin',
                                        id: _this.idFechaFin,
                                        startDateField: _this.idFechaInicio,
                                        anchor: '95%',
                                        format: 'd/m/Y',
                                        maxText: 'La fecha fin tiene que ser posterior o igual a la fecha de inicio.',
                                        invalidText: 'El formato establecido: dd/mm/aaaa.',
                                        enableKeyEvents: true,
                                        mode: 'local',
                                        allowBlank: true,
                                        readOnly: false
                                    }
                                ]
                            }
                        ]
                    });
                    var fields2 = fields2.concat(fieldFecha);

                }
                this.checkDefecto = new Ext.form.Checkbox({
                    fieldLabel: "Por defecto",
                    inputValue: 1,
                    name: 'pordefecto'
                });

                fields2 = fields2.concat(this.checkDefecto);
                fields2 = fields2.concat({
                    xtype: 'hidden',
                    name: _this.campoIdNomenclador,
                    id: 'hd' + _this.campoIdNomenclador
                });
                var fields = field1.concat(fields2);
                if (typeof this.initFormFields == 'function') {
                    this.initFormFields.createDelegate(this).call();
                }
                if (this.formFields) {
                    fields = fields.concat(_this.formFields);
                }
                this.fpGestionarNomenclador = new Ext.form.FormPanel({
                    labelAlign: 'top',
                    frame: true,
                    width: 300,
                    autoHeight: true,
                    items: fields,
                    trackResetOnLoad: true,
                });
            }
            if (_this.usarFecha) {
                Ext.getCmp(this.idFechaInicio).setValue(fecha);
            }

            this.btnAceptar = new Ext.Button({
                text: _this.idioma.lbBtnAceptar,
                tooltip: _this.idioma.lbTtBtnAceptar,
                iconCls: 'aceptar',
                disabled: true
            });
            this.btnAplicar = new Ext.Button({
                text: _this.idioma.lbBtnAplicar,
                tooltip: _this.idioma.lbTtBtnAplicar,
                iconCls: 'aplicar',
                disabled: true
            });
            this.btnCancelar = new Ext.Button({
                text: _this.idioma.lbBtnCancelar,
                tooltip: _this.idioma.lbTtBtnCancelar,
                iconCls: 'cancelar',
                handler: function () {
                    _this.winGestionarNomenclador.close();
                    _this.modificar = false;
                }
            });

            this.winGestionarNomenclador = new Ext.Window({
                items: [this.fpGestionarNomenclador],
                closeAction: 'hide',
                autoValidate: false,
                validateDefault: true,
                modal: true,
                resizable: false,
                autoHeight: true,
                constrain: true,
                autoWidth: true,
                buttons: [_this.btnCancelar, _this.btnAplicar, _this.btnAceptar]
            });
            this.winGestionarNomenclador.on({
                'beforehide': function () {
                    _this.hotKeyActive = false;
                    _this.fpGestionarNomenclador.getForm().items.each(function (f) {
                        f.originalValue = null;
                    });
                    _this.fpGestionarNomenclador.getForm().reset();
                    _this.focus();
                },
                'beforeclose': function (p) {
                    p.hide();
                    _this.hotKeyActive = false;
                    return false;
                },
                'beforeshow': function () {
                    _this.focusFormFirstElement(_this.fpGestionarNomenclador);
                }
            });
            if (!_this.winGestionarNomenclador.isVisible()) {
                _this.winGestionarNomenclador.show();
                _this.winGestionarNomenclador.doLayout(true);
                _this.hotKeyActive = true;
            }
            Ext.getCmp('hd' + this.campoIdNomenclador).setValue(id);
        }


		//Ext.erp.tipotransfinterna.superclass.onBtnAdicionarClick.call(this,id);
		this.fpGestionarNomenclador.setWidth(996);
		this.winGestionarNomenclador.center();

		this.fpGestionarNomenclador.doLayout();
        this.relacionador.loadDatos();
		if(Ext.getCmp('hd' + this.campoIdNomenclador).getValue() > 0){
			this.relacionador.setValorCampo(Ext.getCmp('hd' + this.campoIdNomenclador).getValue());
            this.relacionador.loadDatos();
		} else {
			this.relacionador.stGridDerecho.removeAll();
			this.relacionador.adicionados = new Array();
			this.relacionador.eliminados = new Array();
		}
        this.relacionador.onStIzqBeforeLoad();
       // console.info(this.relacionador);
        //console.info(this.relacionador.stGridDerecho.data.length);

        this.fpGestionarNomenclador.fireEvent = _this.fpGestionarNomenclador.fireEvent.createSequence(function(e, obj) {
           if (e == 'clientvalidation') {
                if (_this.fpGestionarNomenclador.getForm().isValid()) {

                    if (_this.fpGestionarNomenclador.getForm().isDirty()) {
                        _this.btnAceptar.enable();
                        _this.btnAplicar.enable();
                    }

                    if (_this.stDer != _this.relacionador.stGridDerecho.data.length /*|| _this.stIzq != _this.relacionador.stGridIzquierdo.data.length*/) {
                        _this.btnAceptar.enable();
                        _this.btnAplicar.enable();

                    }
                    if (!_this.fpGestionarNomenclador.getForm().isDirty() && _this.stDer == _this.relacionador.stGridDerecho.data.length) {
                        var bandera = false;
                        Ext.each(_this.relacionador.stGridDerecho.data.items, function(e){
                            if (e.data.idtipotransfinterna == "") {
                                bandera = true;
                            }
                        });
                        if (bandera) {
                            _this.btnAceptar.enable();
                            _this.btnAplicar.enable();
                        } else {
                            _this.btnAceptar.disable();
                            _this.btnAplicar.disable();
                        }

                    }

                } else {
                    _this.btnAceptar.disable();
                    _this.btnAplicar.disable();
                }
           }
        });
    },
    onBtnModificarClick: function () {
        this.modificar = true;
        Ext.erp.tipotransfinterna.superclass.onBtnModificarClick.call(this);

    },
    onBtnAceptarClick : function(modificar, _fn) {
        var _this = this;
        var add = [];

        Ext.each(_this.relacionador.stGridDerecho.data.items, function(e){
            if (e.data.idtipotransfinterna == "") {
                add.push(e.data.iddeposito)
            }
        });


		this.fpGestionarNomenclador.getForm().on({
			'beforeaction' : function() {
				if(_this.relacionador.getTotalCount() < 2){
					mostrarMensaje(3, _this.idioma.lbMsgSeleccionarAreas);
					return false;
				}

				_this.fpGestionarNomenclador.getForm().baseParams = {
						 adicionados : add.join(','),
						//adicionados : _this.relacionador.adicionados.join(','),
						eliminados : _this.relacionador.eliminados.join(',')
				}
				return true;
			},
			'actioncomplete' : function(fp, action){
				if(action.result.success == true){
					Ext.getCmp('hd' + _this.campoIdNomenclador).setValue(null);
					_this.relacionador.adicionados = new Array();
					_this.relacionador.eliminados = new Array();
                    _this.relacionador.loadDatos();
					
				}
			}
		});
		Ext.erp.tipotransfinterna.superclass.onBtnAceptarClick.call(this, modificar, _fn);
        _this.modificar = false;
	}
});

Ext.ns('Ext.erp');

Ext.erp.relacionadorNom = Ext.extend(Ext.Panel, {
    controllerRel: '/logistica/utiles/nomencladores/index.php/relacionardatos/',
    defaultController: '/logistica/utiles/nomencladores/index.php/tipotransfinterna/',
    valorCampo: 0,
    campoIdNomenclador: undefined,
    constructor: function(config) {
        var _this = this;
        this.scope = config.scope;
        Ext.apply(this, config);

        Ext.erp.relacionadorNom.superclass.constructor.call(this, config);
        this.on({
            'bodyresize': function(panel, width, height) {
                if (!width)
                    width = 385 * 2 + 20;
                var widthNew = 370 + (width / 2 - 370 - 20);
                _this.gridIzquierdo.setWidth(widthNew);
                _this.gridDerecho.setWidth(widthNew);
            }
        });
    },
    getTime: function() {
        var fecha = new Date();
        return fecha.getTime();
    },
    initComponent: function() {
        var _this = this;
        this.adicionados = [];
        this.eliminados = [];
        /*
         * Definimos los botones de las operaciones
         */
        this.btnAdicionarTodos = new Ext.Button({
            iconCls: 'ultimapagina',
            tooltip: 'Pasar todos ',
            hidden: false,
            disabled: true
        });

        this.btnAdicionar = new Ext.Button({
            iconCls: 'siguiente',
            tooltip: 'Pasar de la selecci\xf3n',
            hidden: false,
            disabled: true
        });

        this.btnEliminar = new Ext.Button({
            iconCls: 'anterior',
            tooltip: 'Quitar de la selecci\xf3n',
            hidden: false,
            disabled: true
        });

        this.btnEliminarTodos = new Ext.Button({
            iconCls: 'primerapagina',
            tooltip: 'Quitar todos',
            hidden: false,
            disabled: true
        });

        /*
         * Creamos el selectionModel para ambos grid
         */
        this.smIzquierdo = new Ext.grid.RowSelectionModel({});

        this.smDerecho = new Ext.grid.RowSelectionModel({});

        /*
         * Creamos el registro de datos
         */
        var fieldsIzq = [{
            name: 'nro'
        }, {
            name: 'denominacion'
        }, {
            name: this.idIzq
        }, {
            name: 'orden'
        }, {
            name: 'concepto'
        }, {
            name: 'iddeposito'
        }, {
            name: 'idconcepto'
        }, {
            name: 'idtipotransfinterna'
        }
        ];
        if (this.storeFieldsIzq) {
            fieldsIzq = fieldsIzq.concat(_this.storeFieldsIzq);
        }
        this.RecordGridIzquierdo = new Ext.data.Record.create(fieldsIzq);

        var fieldsDer = [{
            name: 'nro'
        }, {
            name: 'denominacion'
        }, {
            name: this.idDer
        }, {
            name: this.idIzq
        }, {
            name: 'orden'
        }, {
            name: 'concepto'
        }, {
            name: 'iddeposito'
        }, {
            name: 'idconcepto'
        }, {
            name: 'idtipotransfinterna'
        }];
        if (this.storeFieldsDer) {
            fieldsDer = fieldsDer.concat(_this.storeFieldsDer);
        }

        this.RecordGridDerecho = new Ext.data.Record.create(fieldsDer);

        /*
         * Creamos el datastore donde se van a almacenar los datos de la tabla
         */
        //var url = this.campoIdNomenclador=="idtipotransferencia" ? 'cargarnomencladorentidad' : 'cargarnomenclador'
        this.stGridIzquierdo = new Ext.data.Store({
            //autoLoad:true,
            url: this.defaultController + 'cargarnomenclador',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: 'datos',
                //id: this.idIzq
            }, this.RecordGridIzquierdo)
        });


        this.stGridDerecho = new Ext.data.Store({
            // autoLoad:true,
            url: this.defaultController + 'cargarnomenclador',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos',
               // id: this.idIzq
            }, _this.RecordGridDerecho)
        });
        this.stGridDerecho.on({
            'beforeload': function() {
                _this.stGridDerecho.baseParams = _this.onStDerBeforeLoad();
                _this.stGridDerecho.baseParams.modificar = _this.scope.modificar;
            }
        });

        this.stGridIzquierdo.on({
            'beforeload': function() {
                _this.stGridDerecho.baseParams.modificar = _this.scope.modificar;
                _this.stGridIzquierdo.baseParams = _this.onStIzqBeforeLoad();
                if (_this.stGridDerecho.data.length > 0) {
                    var excluir = [];
                    Ext.each(_this.stGridDerecho.data.items, function(e){
                        excluir.push(e.data.iddeposito);
                    });
                    _this.stGridIzquierdo.baseParams.excluir = Ext.encode(excluir);
                }

            }
        });

        this.stGridDerecho.on({
            'load': function(st) {
                //_this.stGridDerecho.baseParams.modificar = _this.scope.modificar;
               if (st.data.length == 0) {
                   mostrarMensaje(2, 'No existen datos que mostrar');
               }
                if (_this.scope.stDer == 0) {
                    _this.scope.stDer = st.data.length;
                }

            }
        });
        /*
         * Creamos las columnas que van a estar en el grid
         */
        var idexpandirder = this.getTime() + 'expandirder';
        var idexpandirizq = this.getTime() + 'expandirizq';
        var columnasIzq = [
            new Ext.LOG.PagingRowNumberer(),
            {
                header: 'Denominaci\xf3n',
                dataIndex: 'denominacion',
                width: 150,
                align: 'left',
                id: idexpandirizq
            }];

        if (this.columnsFieldsIzq) {
            columnasIzq = columnasIzq.concat(_this.columnsFieldsIzq);
        }
        this.cmIzquierdo = new Ext.grid.ColumnModel({
            defaults: {
                sortable: true
            },
            columns: columnasIzq
        });

        var columnasDer = [
            new Ext.LOG.PagingRowNumberer(),
            {
                header: 'Denominaci\xf3n',
                dataIndex: 'denominacion',
                width: 150,
                align: 'left',
                id: idexpandirder
            }];

        if (this.columnsFieldsDer) {
            columnasDer = columnasDer.concat(_this.columnsFieldsDer);
        }

        this.cmDerecho = new Ext.grid.ColumnModel({
            defaults: {
                sortable: true
            },
            columns: columnasDer
        });

        /*
         * Definimos los grid
         */
        this.gridIzquierdo = new Ext.grid.GridPanel({
            frame: true,
            region: 'west',
            title: this.tituloIzq,
            autoScroll: true,
            iconCls: 'icon-grid',
            autoExpandColumn: idexpandirizq,
            loadMask: {
                store: _this.stGridIzquierdo
            },
            width: 375,
            store: this.stGridIzquierdo,
            cm: this.cmIzquierdo,
            sm: _this.smIzquierdo,
            bbar: new Ext.PagingToolbar({
                pageSize: 5,
                store: this.stGridIzquierdo,
                displayInfo: false
            })
        });

        this.gridIzquierdo.on({
            'render': function() {
                _this.stGridIzquierdo.reload();

            }
        });
        this.gridDerecho = new Ext.grid.EditorGridPanel({
            frame: true,
            region: 'east',
            title: this.tituloDer,
            autoScroll: true,
            iconCls: 'icon-grid',
            autoExpandColumn: idexpandirder,
            width: 375,
            clicksToEdit: 1,
            loadMask: {
                store: _this.stGridDerecho
            },
            store: this.stGridDerecho,
            cm: this.cmDerecho,
            sm: _this.smDerecho,
            //~ columnWidth: .47,
            bbar: new Ext.PagingToolbar({
                pageSize: 5,
                store: _this.stGridDerecho,
                displayInfo: false
            })
        });
        this.gridDerecho.on({
            'render': function() {
                _this.stGridDerecho.reload();
            }
        });
        this.panelOperaciones = new Ext.Panel({
            layout: 'fit',
            region: 'center',
            frame: true,
            //width: 37,
            //height: 200,
            border: false,
            layout: 'form',
            bodyStyle: 'margin-top:10px',
            //columnWidth: .04,
            items: [
                {
                    columnWidth: 1,
                    layout: 'form',
                    items: [{
                        xtype: 'panel',
                        height: 40,
                        width: 20
                    },
                        this.btnAdicionarTodos
                    ]
                },
                {
                    columnWidth: 1,
                    layout: 'form',
                    items: [{
                        xtype: 'panel',
                        height: 10,
                        width: 20
                    },
                        this.btnAdicionar
                    ]
                },
                {
                    columnWidth: 1,
                    layout: 'form',
                    items: [{
                        xtype: 'panel',
                        height: 10,
                        width: 20
                    },
                        this.btnEliminar
                    ]
                },
                {
                    columnWidth: 1,
                    layout: 'form',
                    items: [
                        {xtype: 'panel',
                            height: 10,
                            width: 20
                        },
                        this.btnEliminarTodos
                    ]
                }]
        });

        this.stGridIzquierdo.on({
            'load': function(st) {
                _this.stGridDerecho.baseParams.modificar = _this.scope.modificar;
                _this.activarBtns();
                if (st.data.length == 0) {
                    mostrarMensaje(2, 'No existen datos que mostrar');
                }
                if (_this.scope.stIzq == 0) {
                    _this.scope.stIzq = st.data.length;
                }
            }
        });


        this.stGridDerecho.on({
            'load': function(st) {
                _this.activarBtns();
            }
        });


        this.smIzquierdo.on({
            'rowselect': function() {
                _this.activarBtns();
            },
            'rowdeselect': function() {
                _this.activarBtns();
            }
        });

        this.smDerecho.on({
            'rowselect': function() {
                _this.activarBtns();
            },
            'rowdeselect': function() {
                _this.activarBtns();
            }
        });
        this.btnAdicionar.on({
            'click': function() {
                _this.onBtnbtaddClick();
            }
        });

        this.btnAdicionarTodos.on({
            'click': function() {
                _this.onBtnbtaddallClick();
            }
        });

        this.btnEliminar.on({
            'click': function() {
                _this.onBtnbtdelClick();
            }
        });

        this.btnEliminarTodos.on({
            'click': function() {
                _this.onBtnbtdelallClick();
            }
        });



        Ext.apply(this, {
            height: 200,
            layout: 'border',
            items: [this.gridIzquierdo, this.panelOperaciones, this.gridDerecho]
        })

        Ext.erp.relacionadorNom.superclass.initComponent.call(this);
    },
    activarBtns: function() {
        var cantI = this.stGridIzquierdo.getCount();
        var cantD = this.stGridDerecho.getCount();
        if (cantI > 0) {
            this.btnAdicionarTodos.enable();
            if (this.smIzquierdo.hasSelection()) {
                this.btnAdicionar.enable();
            } else {
                this.btnAdicionar.disable();
            }
        } else {
            this.btnAdicionarTodos.disable();
        }
        if (cantD > 0) {
            this.btnEliminarTodos.enable();
            if (this.smDerecho.hasSelection()) {
                this.btnEliminar.enable();
            } else {
                this.btnEliminar.disable();
            }
        } else {
            this.btnEliminarTodos.disable();
        }
    },
    onBtnbtaddClick: function() {
        var _this = this;
        var arr = [];
        var arreglo = [];
        if (this.stGridIzquierdo.getCount() > 0) {
            arr = this.smIzquierdo.getSelections();
            for (var i = 0; i < arr.length; i++) {
                if ((this.stGridDerecho.find(this.idIzq, arr[i].data.iddeposito) == -1) || (this.stGridDerecho.find(this.idIzq, arr[i].data.iddeposito) == 0)) {
                    _this.adicionados.push(arr[i].data.iddeposito);
                    _this.eliminarRecordsArreglo(arr[i].data.iddeposito, this.eliminados);
                    _this.stGridIzquierdo.remove(arr[i]);
                    arreglo.push(arr[i]);
                }
            }
            this.adicionarRecords(arreglo);
        }
        else {
            mostrarMensaje(1, 'Seleccione los datos correctamente.');
        }
    },
    onBtnbtaddallClick: function() {
        var _this = this;
        var arr = [];
        var arreglo = [];
        var cant = _this.stGridIzquierdo.getCount();

        if (cant > 0) {
            arr = _this.stGridIzquierdo.getRange();
            for (var i = 0; i < arr.length; i++) {
                if ((this.stGridDerecho.find(this.idIzq, arr[i].data.iddeposito) == -1) || (this.stGridDerecho.find(this.idIzq, arr[i].data.iddeposito) == 0)) {
                    if(arr[i].json.idtipoareaoperaciones){
                        arr[i].id=arr[i].json.idtipoareaoperaciones;
                    }
                    _this.adicionados.push(arr[i].data.iddeposito);
                    _this.eliminarRecordsArreglo(arr[i].data.iddeposito, this.eliminados);
                    _this.stGridIzquierdo.remove(arr[i]);
                    arreglo.push(arr[i]);
                }
            }
            _this.adicionarRecords(arreglo);
        }
        else {
            mostrarMensaje(1, 'No hay elementos que relacionar.');
        }

    },
    onBtnbtdelClick: function() {
        var _this = this;
        var arr = [];
        var arreglo = [];
        if (this.stGridDerecho.getCount() > 0) {
            arr = this.smDerecho.getSelections();

            for (var i = 0; i < arr.length; i++) {
                if ((this.stGridIzquierdo.find(this.idIzq, arr[i].data.iddeposito) == -1) || (this.stGridIzquierdo.find(this.idIzq, arr[i].data.iddeposito) == 0)) {
                    if(arr[i].json.idtipoareaoperaciones){
                        arr[i].id = arr[i].json.idtipoareaoperaciones;
                    }
                    _this.eliminados.push(arr[i].data.iddeposito);
                    _this.eliminarRecordsArreglo(arr[i].data.iddeposito, this.adicionados);
                    _this.stGridDerecho.remove(arr[i]);
                    arreglo.push(arr[i]);
                }
            }
            this.eliminarRecords(arreglo);
        }
        else {
            mostrarMensaje(1, 'Seleccione los datos correctamente.');
        }
    },
    onBtnbtdelallClick: function() {
        var _this = this;
        var arr = [];
        var arreglo = [];
        var cant = _this.stGridDerecho.getCount();
        if (cant > 0) {
            arr = _this.stGridDerecho.getRange();
            for (var i = 0; i < arr.length; i++) {
                if ((this.stGridIzquierdo.find(this.idIzq, arr[i].data.iddeposito) == -1) || (this.stGridIzquierdo.find(this.idIzq, arr[i].data.iddeposito) == 0)) {
                    _this.eliminados.push(arr[i].data.iddeposito);
                    _this.eliminarRecordsArreglo(arr[i].data.iddeposito, this.adicionados);
                    _this.stGridDerecho.remove(arr[i]);
                    arreglo.push(arr[i]);
                }
            }
            _this.eliminarRecords(arreglo);
        }
        else {
            mostrarMensaje(1, 'No hay elementos que relacionar.');
        }
    },
    adicionarRecords: function(arreglo) {
        this.stGridDerecho.add(arreglo, false);
        this.activarBtns();
    },
    eliminarRecords: function(arreglo) {
        this.stGridIzquierdo.add(arreglo, false);
        this.activarBtns();
    },
    eliminarRecordsArreglo: function(idelemento, arreglo) {
        var index = arreglo.indexOf(idelemento);
        if (index != -1) {
            arreglo.remove(arreglo[index]);
        }
    },
    setValorCampo: function(newValor) {
        this.valorCampo = newValor;
    },
    setValor: function( ) {
        this.adicionados = [];
        this.eliminados = [];
    },
    onStIzqBeforeLoad: function() {
        var _this = this;
        var baseParams = {
            modelo: _this.modeloIzq,
            idnom: _this.idIzq,
            bussines: _this.bussinesModelIzq,
            adicionados: _this.adicionados.length > 0 ? _this.adicionados.join(',') : '',
            filtroOr: _this.eliminados.length > 0 ? _this.eliminados.join(',') : '',
            modificar: _this.scope.modificar,
            grid: 'izq'
        };

        var filtro = new Array();
        if (_this.scope.modificar){
            baseParams.filtro = Ext.encode(filtro);
        }

        if (_this.valorCampo > 0) {
            var obj = {
                signo: 'not in,select',
                modelo: _this.modeloDer
            };
            obj[_this.campoIdNomenclador] = _this.valorCampo;
            filtro.push(obj);
            baseParams.filtro = Ext.encode(filtro);
        }

        return baseParams;
    },
    onStDerBeforeLoad: function() {
        var _this = this;

        var baseParams = {
            modelo: _this.modeloIzq,
            idnom: _this.idIzq,
            bussines: _this.bussinesModelDer,
            join: 'm.' + _this.modeloDer + ' t',
            eliminados: _this.eliminados.length > 0 ? _this.eliminados.join(',') : '',
            filtroOr: _this.adicionados.length > 0 ? _this.adicionados.join(',') : '',
            modificar: (_this.scope.modificar) ? 'true' : 'false',
            grid: 'der'
        };
        var filtro = new Array();

        if (_this.valorCampo > 0) {
            var obj = {
                signo: '= ?'
            };
            obj[_this.idDer] = _this.valorCampo;
            filtro.push(obj);
            baseParams.filtro = Ext.encode(filtro);
        } else {
            var obj = {
                signo: '= ?'
            };
            obj[_this.idDer] = -1;
            filtro.push(obj);
            baseParams.filtro = Ext.encode(filtro);
        }
        return baseParams;
    },
    getTotalCount: function() {
        return this.stGridDerecho.getCount()/* + this.adicionados.length - this.eliminados.length*/;
    },
    loadDatos: function() {
        this.stGridDerecho.removeAll();
        this.stGridIzquierdo.load();
        if (this.valorCampo > 0) {
            this.stGridDerecho.reload();
        }
    }
});

