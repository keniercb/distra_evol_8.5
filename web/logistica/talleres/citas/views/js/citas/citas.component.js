Ext.ns('LOG.tall.citas');
LOG.tall.citas.VentanaAdicionar = Ext.extend(LOG.lb.documento.ventanaGestionDocumentos, {
    /**
     * formulario que contiene todos los campos de entrada estaticos
     */
    formularioGeneral: undefined,
    /**
     * recor de la solicitud seleccionada para dar origen al documento orden de trabajo
     */
    recordOrigen: null,
    /**
     * arreglo con los tipos de moneda de la entidad
     */
    monedasEntidad: undefined,
    /**
     * denominacion del producto
     */
    producto: undefined,
    /**
     *identificador del producto
     */
    idProducto: undefined,
    /**
     *identificador del indicador
     */
    idIndicador: undefined,
    /**
     * array con las áreas internas de la entidad
     */
    arrAreasInternas: undefined,
    /**
     * array con las personas entidad
     */
    arrPersonas: undefined,
    /**
     *identificador padre del indicador del producto
     */
    idPadreIndicador: undefined,
    idEntidad: undefined,
    idservicio: undefined,
    origen: undefined,
    arrIndicadores: undefined,
    /*variable  con la cantidad de componentes especificados que ya cargagor su store*/
    contador: 0,
    idcliente: undefined,
    /**
     *identificador de la cita
     */
    idcita: undefined,
    /*boolean inicializacion de la ventana gestion*/
    listaAcciones: undefined,
    campoIdentificador: undefined,
    comboTiposPrecioActividad: undefined,
    comboTiposPrecioPiezas: undefined,
    botonSalvar: undefined,
    depositos: undefined,
    constructor: function (config) {
        this.listaAcciones = new LOG.util.List(config.acciones);
        LOG.util.UIManager.apply(config.idioma, LOG.tall.citas.Idioma);
        LOG.tall.citas.VentanaAdicionar.superclass.constructor.call(this, config);
        this.values = config.values;
        this.addEvents('dinamicoscreados');
        this.addEvents('indicadorescargados');
        this.addEvents('componentescreados');
    },
    init: function () {
        this.findIndicador();
        this.builComponent();
        this.cargaInicialDeStores();
        this.started = true;
    },
    builComponent: function () {
        this.idioma = this.idioma || LOG.lb.documento.Idioma;
        var _this = this;
        this.on('indicadorescargados', function () {
            if (_this.origen == 1 && _this.recordOrigen) {
                var find = this.loadDatosMedioIncripcion();
                if (find) {
                    var dinam = Ext.decode(_this.recordOrigen.data.datosmedio);
                    _this.loadValueDatosMedios(dinam);
                } else {
                    //sugerir un mensaje mensaje
                }
            }
            if ((_this.origen == 0 || _this.origen == 2) && _this.recordOrigen) {
                var find = this.loadDatosMedioSolicitud();
                if (find) {
                    this.layoutDatosMedio(_this.idPadreIndicador);
                }
            }
        });
        this.panelSuperior = LOG.util.UIManager.initPanel({
            region: 'center',
            //region: 'north',
            //titleCollapse: true,
            //collapsible: true,
            //collapseMode: 'mini',
            animCollapse: false,
            animate: false,
            title: this.idioma.tlPanelGeneral,
            autoHeight: true,
            frame: true
        });
        this.panelDerecho = LOG.util.UIManager.initPanel({
            region: 'east',
            titleCollapse: true,
            collapsible: true,
            collapseMode: 'mini',
            animCollapse: false,
            animate: false,
            title: 'Panel derecho',
            autoHeight: true,
            frame: true
        });
        this.formularioGeneral = new Ext.Panel({
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            items: [this.DatosGenerales()]
        });
        // this.formularioGeneral.add(panelGrids);
        // this.formularioGeneral.add(this.tabGridServiciosTerceros());
        this.storeRegNum = new Ext.data.Store({
            //url: '/logistica/activos_fijos/utiles/index.php/gestregnumerico/getCargarEnviadosATaller',
            url: '/logistica/talleres/citas/index.php/citastalleres/getCargarEnviadosATaller',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idregnumerico',
            }, [
                { name: 'idproducto' },
                { name: 'idindicador' },
                { name: 'idpadre' },
                { name: 'descripcionmarcamodelo' },
                { name: 'codigo' },
                { name: 'idregnumerico' }
            ])
        });
        this.storeRegNum.on('load', function (st, records) {
            _this.maskMedio();
            if (records.length == 1) {
                _this.modelo.idproducto = _this.idProducto;
                _this.idPadreIndicador = records[0].data.idpadreindicador;
                _this.modelo.idpadreindicador = _this.idPadreIndicador;
                _this.gridActividades.setIdMedio(_this.idPadreIndicador);
                _this.idIndicador = records[0].data.idindicador;
                _this.modelo.idindicador = _this.idIndicador;
                _this.modelo.idpadreindicador = _this.idPadreIndicador;
                _this.modelo.producto = records[0].data.descripcionmarcamodelo;
                _this.producto = records[0].data.descripcionmarcamodelo;
                var rec = {};
                rec.data = records[0].json;
                _this.layoutDatosMedio(_this.idPadreIndicador, rec);
            } else {
                _this.tabPDatosMedio.body.unmask();
                mostrarMensaje(2, _this.idioma.msgRegNumericoNoEncontrado);
            }
        });
        _this.on('dinamicoscreados', function (rec) {
            if (_this.formDatosMedio) {
                if (rec) {
                    rec.data.matricula = (rec.data.matricula) ? rec.data.matricula : (rec.data.nromatricula) ? rec.data.nromatricula : null;
                    _this.formDatosMedio.getForm().loadRecord(rec);
                }
                var fieldIdentificador = _this.modelo.actualizarValoresDinamicos(_this.formDatosMedio);
                if (fieldIdentificador && _this.atributoidentificador) {
                    fieldIdentificador.setValue(_this.atributoidentificador);
                }
                /*   if (_this.idProducto)
                       _this.campoIdentificador.disable();*/

            }
        });
        this.btnSalvar = LOG.util.UIManager.apply(this.listaBotones.getItem(0), LOG.util.Prototipos.botonGuardar({
            tooltip: this.idioma.ttBtnGuardar,
            // disabled: ( _this.gridActividades.getStorePrincipal().getCount() > 0 && _this.gridListPiezasDisp.getStorePrincipal().getCount() > 0) ? true : false,
            //Esto es para Transporte Occidente
            handler: this.salvarAcciones,
            scope: this
        }));
        botonSalvar = this.btnSalvar;
        this.btnNuevo = LOG.util.UIManager.apply(this.listaBotones.getItem(1), LOG.util.Prototipos.botonNuevo({
            tooltip: this.idioma.ttBtnNuevo,
            handler: this.onResetHandler,
            hidden: true,
            scope: this
        }));
        this.btnCerrar = LOG.util.UIManager.apply(this.listaBotones.getItem(2), LOG.util.Prototipos.botonCancelar({
            handler: function () {
                this.scope.close();
                _this.modelo.reset();
                campoDias.setValue(1);

                _this.record = null;
                _this.recordOrigen = null;
                _this.setTitle(_this.idioma.tlCrearCita);
                _this.lbNroDocGenera.setText('');
                _this.gridListPiezasDisp.getStorePrincipal().removeAll();
                _this.gridListPiezasDisp.getGridPrincipal().getView().refresh();
                _this.gridActividades.getStorePrincipal().removeAll();
                _this.gridActividades.getGridPrincipal().getView().refresh();
                Ext.apply(_this.comboClientes, { valueNotFoundText: "" });
                Ext.apply(_this.comboServicio, { valueNotFoundText: "" });
                Ext.apply(_this.horario, { valueNotFoundText: "" });
                Ext.apply(_this.textoCorreo, { valueNotFoundText: "" });

                Ext.apply(_this.nombreResponsableCita, { valueNotFoundText: "" });
                Ext.apply(_this.carnetResponsableCita, { valueNotFoundText: "" });
                Ext.apply(_this.telefonoResponsableCita, { valueNotFoundText: "" });
                Ext.apply(_this.textoCorreoResponsableCita, { valueNotFoundText: "" });

                Ext.apply(_this.telefono, { valueNotFoundText: "" });
                Ext.apply(_this.textObservaciones, { valueNotFoundText: "" });
                Ext.apply(comboTiposPrecioActividad, { valueNotFoundText: "" });
                comboTiposPrecioPiezas.setValue('');
                comboTiposPrecioActividad.setValue('');
                //Ext.apply(comboTiposPrecioActividad, {valueNotFoundText: ""});
                //Ext.apply(comboTiposPrecioPiezas, {valueNotFoundText: ""});
                _this.close();
            },
            text: this.idioma.lbBtnCerrar,
            scope: this
        }, true));
        this.modelo.addActionButton(this.btnSalvar);
        LOG.util.UIManager.apply(this, {
            tbar: this.listaBotonesVentana.getArray(),
            resizable: false,
            items: [this.panelSuperior/*,this.panelDerecho*/],
            buttons: [this.btnCerrar, /*this.btnNuevo,*/ this.btnSalvar]
        });
        LOG.lb.documento.ventanaGestionDocumentos.superclass.initComponent.call(this);
        this.fireEvent = this.fireEvent.createSequence(function (e) {
            if (e == 'resize') {
                _this.definirAltura();
            }
        });
        this.onShow = this.onShow.createSequence(this.onShowHandler, this);
    },
    onShowHandler: function() {
        this.listaBotonesVentana.each(function(b) {
            LOG.util.UIManager.applyKey(b, this);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }, this);
        this.listaBotones.each(function(b) {
            LOG.util.UIManager.applyKey(b, this);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }, this);
    },
    initDefaultButtons: function () {
        var _this = this;
        LOG.tall.citas.VentanaAdicionar.superclass.initDefaultButtons.call(this);

        this.listaBotonesProductos.deleteAll();
    },
    DatosGenerales: function () {
        var _this = this;
        //Panel  de los datos generales de la cita
        var row1 = new LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        row1.getColumn(0).labelAlign = 'center';
        row1.getColumn(0).style = 'font: 12px tahoma,arial,helvetica,sans-serif;';
        this.lbNroDocGenera = new Ext.form.Label({
            labelAlign: 'left',
            //fieldLabel: this.idioma.lbNoDocOrigen,
            height: 2
        });
        row1.addComponent(this.lbNroDocGenera);
        this.comboClientes = new LOG.util.ComboBox({
            name: 'idcliente',
            autoLoad: false,
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarClientes',
            displayField: 'nombre',
            valueField: 'idclientesproveedores',
            forceSelection: false,
            queryParam: 'criterio',
            fieldLabel: this.idioma.lbCliente,
            allowBlank: false,
            disabled: true,
            validarEnFormBasico: true,
            mode: 'remote',
            minChars: 3,
            pageSize: 15,
            resizable: true,
            listeners: {
                change: function (cb, recordS, value, old) {
                    idcliente = recordS;
                    /*   if (_caller) {
                           var dataEstado = _caller.getGridPrincipal().getSelectionModel().getSelected().data;
                           if (dataEstado.estado != 9) {
                               this.comboClientes.enable();
                           } else {
                               this.comboClientes.disable();
                           }
                       }*/
                },
                select: function (cb, recordS) {
                    if (recordS.json.telefono) {
                        _this.telefono.setValue(recordS.json.telefono);
                        _this.modelo.telefono = recordS.json.telefono;
                        _this.telefono.setReadOnly(true);
                    } else {
                        _this.telefono.setValue("");
                        _this.telefono.setReadOnly(false);
                    }
                    if (recordS.json.correo) {
                        _this.textoCorreo.setValue(recordS.json.correo);
                        _this.modelo.correo = recordS.json.correo;
                        _this.textoCorreo.setReadOnly(true);
                    } else {
                        _this.textoCorreo.setValue("");
                        _this.textoCorreo.setReadOnly(false);
                    }
                    Ext.apply(cb, { valueNotFoundText: recordS.json.nombre });
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else {
                        _this.btnNuevo.enable();
                    }
                    comboTiposPrecioActividad.setDisabled(false);
                    comboTiposPrecioPiezas.setDisabled(false);

                },
                keyup: function (cb, e) {
                    if (cb.getRawValue() == "") {
                        cb.setValue("");
                    }
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                }
            }
        });
        this.comboClientes.store.on('load', function () {
            if (_this.record && _this.record.data.idcliente) {
                _this.comboClientes.setValue(_this.comboClientes.getValue());

            }
            if (_this.recordOrigen && _this.recordOrigen.data.idcliente) {
                _this.comboClientes.setValue(_this.comboClientes.getValue());
            }
            if (_this.comboClientes.getValue()) {
                idcliente = _this.comboClientes.getValue();

            } else {
                comboTiposPrecioActividad.setDisabled(true);
                comboTiposPrecioPiezas.setDisabled(true);
            }

        });
        this.comboServicio = new LOG.util.LovCombo({
            fieldLabel: this.idioma.lbServicio,
            url: '/logistica/talleres/citas/index.php/citastalleres/cargarActividadesExistentes',
            name: 'idservicio',
            displayField: 'denominacion',
            valueField: 'idactividad',
            queryParam: 'criterio',
            mode: 'remote',
            disabled: true,
            autoLoad: false,
            allowBlank: false,
            validarEnFormBasico: true,
            listeners: {
                change: function (combo, newValue, oldValue) {
                    if (_this.isInit()) {
                        if (_this.modelo.tipo != 1) {
                            _this.gridActividades.panelPrincipal.body.mask('cargando...');
                            // _this.gridActividades.eliminarActividadesDelServico();
                            _this.gridActividades.getGridPrincipal().initialConfig.bbar.setDisabled(true);
                            // _this.gridActividades.setIdServicio(newValue);
                            _this.gridActividades.panelPrincipal.body.unmask();
                        }
                    }
                },
                select: function (cb, recordS) {
                    Ext.apply(cb, { valueNotFoundText: recordS.json.denominacion });
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                },
                'keyup': function (cb, e) {
                    if (cb.getRawValue() == "") {
                        cb.setValue("");
                    }
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                },
            },
            minChars: 3,
            pageSize: 15,
            resizable: true
        });
        const s = [];
        this.comboServicio.on('select', function (cmb, rd) {
            function removeItemFromArr(arr, item) {
                var i = arr.indexOf(item);
                if (i !== -1) {
                    arr.splice(i, 1);
                }
            };
            var idservicios = Ext.decode(rd.data.idactividad);
            Ext.each(idservicios, function (obj) {
                if (s.includes(obj)) {
                    Ext.each(idservicios, function (obj) {
                        removeItemFromArr(s, obj); //Elimina un elemento del arreglo
                    });
                } else {
                    s.push(obj);
                }

            });
            const newArr2 = [...new Set(s)]; //Elimina los elementos duplicados del array
            if (newArr2.length > 1) {
                idservicio = newArr2.toString().split(',');
            } else
                idservicio = newArr2.toString();
        });
        this.comboServicio.store.on('load', function () {
            if (_this.record && _this.record.json.idservicio) {
                idservicio = _this.record.json.idservicio.substr(1, _this.record.json.idservicio.length - 2);
                _this.comboServicio.setValue(_this.record.json.idservicio.substr(1, _this.record.json.idservicio.length - 2));

                 _this.comboServicio.setValue(Ext.decode(_this.record.json.idservicio));
            }
        });
        /*  this.comboCentroCosto = new LOG.util.ComboBox({
              autoLoad: true,
              disabled: false,
              mode: 'local',
              fieldLabel: this.idioma.lbCentroCosto,
              name: 'idcentrocosto',
              url: '/logistica/talleres/citas/index.php/citastalleres/cargarComboCentroCosto',
              valueField: 'idcentrogrupo',
              displayField: 'text',
              queryParam: 'criterio',
              width: '98%',
              allowBlank: false,
              validarEnFormBasico: true,
              campo: true,
              listeners: {
                  select: function (cb, st) {
                      if (_this.datosLimpios())
                          _this.btnNuevo.disable();
                      else
                          _this.btnNuevo.enable();
                  },
                  'keyup': function (cb, e) {
                      if (cb.getRawValue() == "") {
                          cb.setValue("");
                      }
                      if (_this.datosLimpios())
                          _this.btnNuevo.disable();
                      else
                          _this.btnNuevo.enable();
                  }
              },
              resizable: true
          });*/
        /*   this.comboCentroCosto.store.on({
               'load': function (store) {
                   if (_this.record && _this.record.data.idcentrocosto) {
                       _this.comboCentroCosto.setValue(_this.record.data.idcentrocosto);
                   }
                   if (_this.recordOrigen && _this.recordOrigen.data.idcentrocosto) {
                       _this.comboCentroCosto.setValue(_this.recordOrigen.data.idcentrocosto);
                   }
               }
           });*/
        this.combofechaCita = new Ext.form.DateField({
            fieldLabel: this.idioma.cgFechaCita,
            name: 'fechacita',
            endDateField: this.combofechaExtimada,
            allowBlank: false,
            //xtype: 'datefield',
            vtype: 'daterange',
            editable: false,
            minValue: new Date(),
            minText: this.idioma.ttMinTexto,
            validarEnFormBasico: true,
            invalidText: this.idioma.ttTextoFechaIncorrecto,
            listeners: {
                'select': function (campo, value) {
                    _this.combofechaExtimada.setMinValue(campo.getValue());
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                }
            }
        });
        this.combofechaExtimada = new Ext.form.DateField({
            fieldLabel: this.idioma.cgFechaExtimada,
            name: 'fechaextimada',
            tDateField: this.combofechaCita,
            //allowBlank: false,
            //xtype: 'datefield',
            vtype: 'daterange',
            editable: false,
            //minValue: new Date(),
            minText: this.idioma.ttMinTexto,
            validarEnFormBasico: true,
            invalidText: this.idioma.ttTextoFechaIncorrecto,
            listeners: {
                'select': function (campo, value) {
                    _this.combofechaCita.setMaxValue(campo.getValue());
                }
            }
        });
        this.comboProveedores = new LOG.util.ComboBox({
            name: 'idcliente',
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarProveedores',
            displayField: 'nombre',
            valueField: 'idclientesproveedores',
            queryParam: 'criterio',
            fieldLabel: this.idioma.lblAgencia,
            allowBlank: false,
            hidden: true,
            disabled: true,
            autoLoad: false,
            minChars: 1,
            pageSize: 15,
            resizable: true,
            mode: 'remote',
            listeners: {
                select: function (cb, st) {
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                },
                'keyup': function (cb, e) {
                    if (cb.getRawValue() == "") {
                        cb.setValue("");
                    }
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                }
            }
        });
        this.comboProveedores.store.on('load', function (store) {
            if (_this.record && _this.record.data.idcliente) {
                _this.comboProveedores.setValue(_this.comboProveedores.getValue());
            }
            if (_this.recordOrigen && _this.recordOrigen.data.idcliente) {
                _this.comboProveedores.setValue(_this.comboProveedores.getValue());
            }
        });
        this.telefono = new Ext.form.NumberField({
            fieldLabel: 'Número de teléfono',
            name: 'telefono',
            maxLength: 15,
            width: 150,
            anchor: "98%",
            readOnly: false,
            validarEnFormBasico: true,
            regex: LOG.util.Regex.digito,
            allowBlank: false

        });
        this.textoCorreo = new Ext.form.TextField({
            fieldLabel: 'Correo',
            name: 'correo',
            regex: /^((\w+\.[a-zA-Z_]+@[a-zA-Z_]+\.[a-zA-Z]{2,6})|(\w+\.[a-zA-Z]+@[a-zA-Z_]+\.[a-zA-Z]+\.[a-zA-Z]{2,6})|(\w+@[a-zA-Z_]+\.[a-zA-Z]{2,6}))/,
            maxLength: 50,
            width: 150,
            anchor: "98%",
            readOnly: false,
            validarEnFormBasico: true,
            allowBlank: false

        });
        this.formatohora = 'g:i A';
        this.hvalorminimo = '08:00';
        this.hvalormaximo = '17:00';
        this.horario = new Ext.form.TimeField({
            format: this.formatohora,
            minValue: _this.hvalorminimo,
            maxValue: _this.hvalormaximo,
            fieldLabel: 'Hora',
            anchor: '98%',
            width: 5,
            increment: 15,
            allowBlank: false,
            xtype: 'timefield',
            name: 'horaentrada'
        });

        //Datos del Responsable de la entrega
        this.nombreResponsableCita = new Ext.form.TextField({
            fieldLabel: 'Nombre y apellidos',
            name: 'nombreresponsable',
            maxLength: 50,
            width: 150,
            anchor: "98%",
            readOnly: false,
            validarEnFormBasico: true,
            allowBlank: false

        });

        this.carnetResponsableCita = new Ext.form.NumberField({
            fieldLabel: 'Número de identidad',
            name: 'idcarnetresponsable',
            maxLength: 11,
            width: 150,
            anchor: "98%",
            readOnly: false,
            validarEnFormBasico: true,
            regex: LOG.util.Regex.carnet,
            allowBlank: false
        });
        this.telefonoResponsableCita = new Ext.form.NumberField({
            fieldLabel: 'Número de teléfono particular',
            name: 'telefonoresponsable',
            maxLength: 15,
            width: 150,
            anchor: "98%",
            readOnly: false,
            validarEnFormBasico: true,
            regex: LOG.util.Regex.digito


        });
        this.textoCorreoResponsableCita = new Ext.form.TextField({
            fieldLabel: 'Correo',
            name: 'textocorreoresponsable',
            regex: /^((\w+\.[a-zA-Z_]+@[a-zA-Z_]+\.[a-zA-Z]{2,6})|(\w+\.[a-zA-Z]+@[a-zA-Z_]+\.[a-zA-Z]+\.[a-zA-Z]{2,6})|(\w+@[a-zA-Z_]+\.[a-zA-Z]{2,6}))/,
            maxLength: 50,
            width: 150,
            anchor: "98%",
            readOnly: false,
            validarEnFormBasico: true//,
            // allowBlank: false

        });


        var columnaCombos = new LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        columnaCombos.addComponent(this.comboServicio);
        columnaCombos.addComponent(this.comboClientes);
        columnaCombos.addComponent(this.telefono);
        columnaCombos.addComponent(this.textoCorreo);
        columnaCombos.addComponent(this.comboProveedores);

        var columnaCombos1 = new LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        columnaCombos1.addComponent(this.combofechaCita);
        columnaCombos1.addComponent(this.horario);
        columnaCombos1.addComponent(this.combofechaExtimada);

        var cls = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        cls.getColumn(0).labelAlign = '';
        cls.addComponent(row1);
        cls.addComponent(columnaCombos);

        var cls1 = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        cls1.addComponent(columnaCombos1);
        var fsContenedor1 = new Ext.form.FieldSet({
            labelAlign: '',
            width: '50%',
            items: [cls]
        });
        var fsContenedor2 = new Ext.form.FieldSet({
            labelAlign: '',
            width: '50%',
            items: [cls1]
        });
        var columnaCombosResponsableCita = new LOG.util.UIManager.initColumnForm({
            columnas: 5
        });
        columnaCombosResponsableCita.addComponent(this.nombreResponsableCita);
        columnaCombosResponsableCita.addComponent(this.carnetResponsableCita);
        columnaCombosResponsableCita.addComponent(this.telefonoResponsableCita);
        columnaCombosResponsableCita.addComponent(this.textoCorreoResponsableCita);

        var clsResponsableCita = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        clsResponsableCita.getColumn(0).labelAlign = '';
        clsResponsableCita.addComponent(columnaCombosResponsableCita);
        var fsContenedorClienteCita = new Ext.form.FieldSet({
            labelAlign: '',
            width: '98%',
            title: 'Responsable de la entrega',
            items: [clsResponsableCita]
        });


        var fsTipoMedio = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        this.textoMedio = new LOG.util.Prototipos.inputTexto({
            name: 'producto',
            allowBlank: false,
            fieldLabel: 'Vehiculo',
            //width: 810,
            minLength: 1,
            validarEnFormBasico: true,
            readOnly: true,
            maxLength: 150,
            maskRe: LOG.util.Regex.cadena,
            listeners: {
                change: function (cb, st) {
                    if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();
                }
            }
        });
        this.btnMedios = LOG.util.UIManager.createBtn({
            iconCls: 'buscar',
            btn: true,
            tooltip: 'Seleccionar',
            campo: true,
            handler: function () {
                var ventanaSeletMedio = new LOG.tall.citas.VentanaSelecionMedio({
                    idioma: _this.idioma,
                    title: _this.idioma.tlVentanaSelectVehiculo,
                    isAFT: existeAFT,
                    idestructura: _this.idEntidad,
                    height: 420,
                    width: 855,
                    usarNomencladorProducto: _this.grantedAction('usarNomPrd'),
                    usarAFTTall: _this.grantedAction('usarAFTTall'),
                    usarTallAFT: _this.grantedAction('usarTallAFT')
                });
                ventanaSeletMedio.show();
                //ventanaSeletMedio.tabPanelGeneral.getListTemplate().each(function(temp){
                //    temp.getStorePrincipal().load();
                //});
                ventanaSeletMedio.validacionBtn();
                ventanaSeletMedio.aceptarFn = function () {
                    if (ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getGridPrincipal().getSelectionModel().getSelected()) {
                        _this.limpiarComponentesMedio();

                        var recordSeleccionado = ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getGridPrincipal().getSelectionModel().getSelected();
                        recordSeleccionado.data = recordSeleccionado.json;
                        _this.textoMedio.setValue(recordSeleccionado.data.descripcionmarcamodelo);
                        _this.modelo.producto = recordSeleccionado.data.descripcionmarcamodelo;
                        _this.idPadreIndicador = recordSeleccionado.data.idpadre;
                        _this.gridActividades.setIdMedio(_this.idPadreIndicador);
                        _this.modelo.idpadreindicador = _this.idPadreIndicador;
                        _this.producto = recordSeleccionado.data.descripcionmarcamodelo;
                        if (ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'indicadores') {
                            _this.idIndicador = recordSeleccionado.data.idindicador;
                            _this.idPadreIndicador = recordSeleccionado.data.idpadreindicador;
                            _this.modelo.idindicador = _this.idIndicador;
                            _this.modelo.idPadreIndicador = _this.idPadreIndicador;
                            _this.modelo.idproducto = null;
                            _this.idProducto = null;
                        } else if (ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'aft') {
                            if (recordSeleccionado.data.DatProductoLogistica.CfgPlanificacionMantenimiento.idplanificacionmantenimiento) {
                                // es aqui

                                _this.textoMedio.setValue(recordSeleccionado.data.denominacion);
                                _this.modelo.producto = recordSeleccionado.data.denominacion;
                                _this.producto = recordSeleccionado.data.denominacion;
                                _this.idIndicador = recordSeleccionado.data.DatProductoLogistica.CfgPlanificacionMantenimiento.DatMedio.idindicador;
                                _this.modelo.idindicador = _this.idIndicador;
                                _this.idProducto = recordSeleccionado.data.idregnumerico;
                                _this.modelo.idproducto = _this.idProducto;
                                _this.modelo.iddocumentoorigen = recordSeleccionado.id;
                                _this.idPadreIndicador = recordSeleccionado.data.idpadreindicador;
                                _this.modelo.idpadreindicador = recordSeleccionado.data.idpadreindicador;

                                _this.modelo.documentoorigen = 5;
                            } else {
                                _this.idIndicador = recordSeleccionado.json.idindicador;
                                _this.idPadreIndicador = recordSeleccionado.data.idpadreindicador;
                                _this.modelo.idindicador = _this.idIndicador;
                                _this.modelo.idpadreindicador = _this.idPadreIndicador;

                                _this.idProducto = recordSeleccionado.data.idregnumerico;
                                _this.modelo.idproducto = _this.idProducto;
                                _this.modelo.iddocumentoorigen = recordSeleccionado.data.iddocumento;
                                _this.modelo.iddocumentoorigen = recordSeleccionado.id;
                                _this.modelo.documentoorigen = 5;
                            }
                        } else if (ventanaSeletMedio.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'tallaft') {
                            _this.idIndicador = recordSeleccionado.json.idindicador;
                            _this.idPadreIndicador = recordSeleccionado.json.idpadreindicador;
                            _this.modelo.idindicador = _this.idIndicador;
                            _this.modelo.idPadreindicador = _this.idPadreIndicador;
                            _this.idProducto = recordSeleccionado.data.idregnumerico;
                            _this.modelo.idproducto = _this.idProducto;
                            _this.modelo.documentoorigen = 6;
                            //_this.modelo.iddocumentoorigen = recordSeleccionado.data.iddocumento;
                            // _this.modelo.documentoorigen = 5;
                        }
                        _this.layoutDatosMedio(_this.idPadreIndicador, recordSeleccionado);
                    }
                }
            }
        });
        this.plugin = new LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        this.plugin.addComponent(this.textoMedio);
        this.plugin.getColumn(0).columnWidth = '0.85';

        this.plugin.addComponent(LOG.util.UIManager.initPanel({
            frame: false,
            items: [LOG.util.UIManager.initPanel({height: 17}),
                this.btnMedios
            ]
        }));
        this.plugin.getColumn(1).columnWidth = '0.04';

        fsTipoMedio.addComponent(this.plugin);
        this.datDinamic = new LOG.util.UIManager.initColumnForm({
            columnas: 5
        });
        this.datNaturaleza = new LOG.util.UIManager.initColumnForm({
            columnas: 5
        });
        var tabDatosMedio = new LOG.util.Panel({
            frame: true,
            title: this.idioma.lbDatosMedio,
            autoScroll: true,
            items: [this.ponerEnColumna(fsTipoMedio)]
        });
        this.columFormMedioDinamico = this.ponerEnColumna(this.datDinamic);
        var tabDinamic = new LOG.util.Panel({
            frame: true,
            title: this.idioma.tlDinamicos,
            autoScroll: true,
            items: [this.columFormMedioDinamico]
        });
        this.columFormMedioNaturaleza = this.ponerEnColumna(this.datNaturaleza);
        var tabNaturaleza = new LOG.util.Panel({
            frame: true,
            title: this.idioma.tlPorNaturaleza,
            autoScroll: true,
            items: [this.columFormMedioNaturaleza]
        });
        this.textObservaciones = new Ext.form.TextArea({
            fieldLabel: "Observaciones",
            name: 'observacion',
            height: 122,
            width: '100%',
            // maxLength: 255,

            minLength: 2,
            enableKeyEvents: true,
            allowBlank: false,
            //regex: LOG.util.Regex.cadena,
            //regexText :  _this.idioma.msgexpreAlfaNumRegexText,
        });

        this.tabPDatosMedio = new Ext.TabPanel({
            frame: true,
            height: 160,
            autoScroll: true,
            activeTab: 0,
            items: [tabDatosMedio, tabNaturaleza, tabDinamic]
        });
        this.contenObservaciones = new LOG.util.Panel({
            autoHeight: true,
            width: '100%',
            items: [this.textObservaciones]
        });
        this.contentabPDatosMedio = new LOG.util.Panel({
            autoHeight: true,
            items: [this.tabPDatosMedio]
        });
        this.panelObservaciones = new LOG.util.Panel({
            frame: true,
            items: [this.contenObservaciones],
            title: "Observaciones",
            autoHeight: true
            // name: 'observaciones'
        });

        this.clsTabPDatosObservaciones = new LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.clsTabPDatosObservaciones.addComponent(this.contentabPDatosMedio);
        this.clsTabPDatosObservaciones.addComponent(this.panelObservaciones);
        var cls1 = new LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        cls1.getColumn(0).labelAlign = '';
        cls1.addComponent(fsContenedor1);
        cls1.addComponent(fsContenedor2);
        var cls3 = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        cls3.addComponent(fsContenedorClienteCita);
        cls3.addComponent(new LOG.util.Panel({
            frame: false,
            items: [new Ext.Panel({ height: 12 })]
        }));
        cls3.addComponent(this.clsTabPDatosObservaciones);
        // cls1.addComponent(this.tabPDatosMedio);
        // cls1.addComponent(this.panelObservaciones);
        
        cls3.addComponent(new LOG.util.Panel({
            frame: false,
            items: [new Ext.Panel({ height: 12 })]
        }));
        this.gridActividades = new LOG.tall.citas.GridActividades({
            idioma: this.idioma,
            validarEnFormBasico: true,
            monedaContable: (this.monedasEntidad.codigoiso) ? this.monedasEntidad.codigoiso : null,
            _parent: _this

        });
        this.gridActividades.init();
        this.servicios = this.gridActividades.view();
        this.servicios.setHeight(300);
        this.servicios.on('addedservicios', function () {
            _this.habilitarBotonesAlModificarGrid();
        });
        this.servicios.on('deletedservicios', function () {
            _this.habilitarBotonesAlModificarGrid();
        });
        this.gridActividades.getStorePrincipal().on({
            'beforeload': function (store) {
                var limit = _this.gridActividades.getGridPrincipal().initialConfig.bbar.pageSize;
                store.initBaseParams = {
                    idcita: (_this.record.data.length != 0) ? _this.record.data.iddocumento : null,
                    limit: limit
                }
            }
        });
        var contenServicios = new LOG.util.Panel({
            autoHeight: true,
            items: [this.servicios]
        });
        this.panel2p = new LOG.util.Panel({
            frame: true,
            items: [contenServicios],
            title: this.idioma.tlActividades,
            autoHeight: true,
            name: 'tab2'
        });
        this.PanelInferior = new Ext.Panel({
            region: 'center',
            layoutOnTabChange: true,
            anchor: '98%',
            listeners: {
                change: function (p, t) {
                    _this.gridActividades.getStorePrincipal().load({ params: { idcita: _this.record.data.iddocumento } });
                }
            }
        });
        this.PanelInferior.add(this.panel2p);
        var contenedorInferior = new LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        contenedorInferior.addComponent(this.PanelInferior);

        this.gridActividades.getStorePrincipal().on({
            'beforeload': function (store) {
                var limit = _this.gridActividades.getGridPrincipal().initialConfig.bbar.pageSize;
                store.initBaseParams = {
                    idcita: (_this.record) ? _this.record.data.iddocumento : null,
                    // idservicio: (_this.record) ?_this.record.json.idservicio.substr(1,_this.record.json.idservicio.length-2).split(',') : null,
                    limit: limit
                }
            }
        });
        this.gridListPiezasDisp = new LOG.tall.citas.GridListPiezasDisp({
            idioma: this.idioma,
            _parent: _this,
            listaAcciones: _this.listaAcciones,
            validarEnFormBasico: true,
            monedaContable: (this.monedasEntidad.codigoiso) ? this.monedasEntidad.codigoiso : null,
        });
        this.gridListPiezasDisp.init();
        this.listpiezasdisp = this.gridListPiezasDisp.view();
        this.listpiezasdisp.setHeight(300);
        this.listpiezasdisp.on('addedpiezas', function () {
            _this.habilitarBotonesAlModificarGrid();
        });
        this.listpiezasdisp.on('deletedpiezas', function () {
            _this.habilitarBotonesAlModificarGrid();
        });
        this.listpiezasdisp.on('sustituta', function () {
            _this.habilitarBotonesAlModificarGrid();
        });
        this.listpiezasdisp.on('addpedido', function (piezas) {
            var params = {};
            params.idcliente = _this.comboClientes.getValue();
            var productos = new Array();
            Ext.each(piezas[0], function (rec) {
                var obj = {};
                var existencia = (rec.data.existencia) ? parseFloat(rec.data.existencia) : 0;
                obj['idindicador'] = rec.data.idindicador;
                obj['cantidad'] = parseFloat(rec.data.cantidad) - existencia;
                if (rec.data.capacidadliquida) {
                    obj['capacidadliquida'] = rec.data.capacidadliquida;
                }
                productos.push(obj);
            });
                params.productos = Ext.encode(productos);
                params.idcita = _this.record.data.iddocumento;
                _this.modelo.generarPedido(params, function (resp) {
                    _this.gridListPiezasDisp.getStorePrincipal().reload();
                    _this.scope.getStorePrincipal().reload();
                });
        });
        /*this.gridListPiezasDisp.getStorePrincipal().on({
            'beforeload': function (store) {
                var limit = _this.gridListPiezasDisp.getGridPrincipal().initialConfig.bbar.pageSize;
                store.initBaseParams = {
                    idcita: (_this.record.data.length != 0) ? _this.record.data.iddocumento : null,
                    limit: limit
                }
            },
            'load': function(store) {
                store.commitChanges();
            }
        });*/
        var contenListpiezasdisp = new LOG.util.Panel({
            autoHeight: true,
            items: [this.listpiezasdisp]
        });
        this.panel3p = new LOG.util.Panel({
            frame: true,
            items: [contenListpiezasdisp],
            title: this.idioma.tlListPiezasDisp,
            autoHeight: true,
            name: 'tab3'
        });
        this.OtroPanelInferior = new Ext.Panel({
            region: 'center',
            // activeTab: 0,
            layoutOnTabChange: true,
            anchor: '98%',
            // items: [tab1P],
            listeners: {
                tabchange: function (p, t) {
                    _this.gridListPiezasDisp.getStorePrincipal().load({ params: { idcita: _this.record.data.iddocumento } });
                }
            }
        });
        this.OtroPanelInferior.add(this.panel3p);
        this.gridListPiezasDisp.getStorePrincipal().on({
            'beforeload': function (store) {
                var limit = _this.gridListPiezasDisp.getGridPrincipal().initialConfig.bbar.pageSize;
                store.initBaseParams = {
                    idcita: (_this.record) ? _this.record.data.iddocumento : null,
                    limit: limit
                }
            },
            'load': function(store) {
                store.commitChanges();
            }
        });
        contenedorInferior.addComponent(this.OtroPanelInferior);
        this.panelDatos = new LOG.util.Panel({
            name: 'datosPanel',
            frame: true,
            autoScroll: true,
            title: this.idioma.lbPnDatosGenerales,
            width: '100%',
            items: [cls1, cls3, new Ext.Panel({ height: 15 }), contenedorInferior]
        });
        this.tabPDatosMedio.on({
            render: function () {
                _this.maskMedio();
            },
            show: function () {
                _this.maskMedio();
            }
        });
        return this.panelDatos;
    },
    onResetHandler: function () {

        var _this = this.scope || this;
        _this.modelo.listaDinamicos.deleteAll();
        _this.modelo.idcliente = undefined;
        _this.modelo.idservicio = undefined;
        _this.modelo.idtipoprecioactividad = undefined;
        _this.modelo.idtipopreciopiezas = undefined;
        if (_this.fromularioGestion) {

            Ext.apply(_this.comboClientes, { valueNotFoundText: "" });
            Ext.apply(_this.comboServicio, { valueNotFoundText: "" });
            _this.modelo.reset();
            _this.modelo.dirtyGrids = false;
            _this.modelo.dirtyDinamic = false;
            _this.record = null;
            _this.recordOrigen = null;
            _this.atributoidentificador = null;
            _this.tfTotalImporte.setValue(0);
//            _this.tfTotalImporteCUC.setValue(0);
            _this.setTitle(_this.idioma.tlCrearCita);
            //_this.listaBotonesVentana.getItem(0).disable();
            _this.idIndicador = undefined;
            _this.idPadreIndicador = undefined;
            _this.idProducto = undefined;
            _this.producto = undefined;
            _this.origen = undefined;
            _this.combofechaCita.setMaxValue(null);
            _this.horario.setMaxValue(null);
            _this.combofechaExtimada.setMaxValue(null);
            _this.combofechaExtimada.setMinValue(null);
            _this.limpiarComponentesMedio();
            _this.habilitarComponentes();
            _this.lbNroDocGenera.setText('');
            campoDias.setValue(null);
            _this.listaBotonesVentana.each(function (b) {
                _this.controlBotones(b, b.estado);
            });
            _this.gridListPiezasDisp.getStorePrincipal().removeAll();
            _this.gridActividades.getStorePrincipal().removeAll();
            _this.gridListPiezasDisp.limpiarListas();
            _this.gridActividades.limpiarListas();
            _this.gridActividades.setRecordOrden(null);
            _this.gridListPiezasDisp.getGridPrincipal().getView().refresh();
            _this.gridActividades.getGridPrincipal().getView().refresh();
        }
        _this.btnNuevo.disable();
    },
    cargaInicialDeStores: function () {
        var _this = this;
        this.comboClientes.store.load({
            callBack: function (r) {
                _this.contador++;
                _this.fireEvent('componentescreados');
            }
        });

    },
    setMonedasEntidad: function (datos) {
        this.monedasEntidad = datos;
    },
    setArrAreasInternas: function (arr) {
        this.arrAreasInternas = arr;

    },
    setOrigen: function (value) {
        this.origen = value;
    },
    ponerEnColumna: function (elemento) {
        var columna = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        columna.addComponent(elemento);
        return columna;
    },
    definirAltura: function () {
        var alto = this.getHeight() - 126;
        this.panelDatos.setHeight(alto);
        this.panelDatos.doLayout();
        /*   this.panelGridServTerceros.setHeight(alto);
           this.panelGridServTerceros.doLayout();
           this.serviciosTerceros.setHeight(alto - 18);
           this.serviciosTerceros.doLayout();*/
        /*var altogrid = (alto - 82) / 2;
        this.materiales.setHeight(altogrid);
        this.materiales.doLayout();
        this.actividades.setHeight(altogrid);
        this.actividades.doLayout();*/
    },
    setEntidad: function (arr) {
        this.idEntidad = arr['identidad'];
    },
    setPersonas: function (arr) {
        this.arrPersonas = arr;
    },
    PrepararsalvarAcciones: function () {
        var _this = this;
        var parametros = _this.SalvandoAcciones();
        this.modelo.atributoidentificador = _this.modelo.obtenerValorAtrbIdentificador();
        this.modelo.salvar(parametros, function (r) {
            _this.record = _this.scope.record || {};
            Ext.apply(_this.record, {
                data: r.datos
            });
            _this.scope.winGestionarDocumento.record.data.estado = _this.record.data.estado;
            _this.scope.winGestionarDocumento.record.data.cantactvidades = _this.record.data.cantactvidades;
            _this.scope.winGestionarDocumento.record.data.CantActConPrecio = _this.record.data.CantActConPrecio;
            _this.modelo.iddocumento = _this.record.data.iddocumento;
            _this.modelo.idcita = _this.record.data.iddocumento;
            _this.gridListPiezasDisp.limpiarListas();
            _this.gridListPiezasDisp.getStorePrincipal().initBaseParams = { idcita: _this.record.data.iddocumento };
            _this.gridActividades.getStorePrincipal().initBaseParams = { idcita: _this.record.data.iddocumento };

            _this.modelo.dirtyGrids = false;
            _this.listaBotonesVentana.each(function (b) {
                LOG.util.UIManager.applyKey(b, _this);
                if (typeof b.controlFn == 'function') {
                    b.controlFn.createDelegate(_this, [b, _this]).call();
                }
            }, _this);
            _this.listaBotones.each(function (b) {
                LOG.util.UIManager.applyKey(b, _this);
                if (typeof b.controlFn == 'function') {
                    b.controlFn.createDelegate(_this, [b, _this]).call();
                }
            }, _this);
            _this.getTitleDocumento(_this.record.data.iddocumento);
            _this.modelo.habilitarBotones(true);
            _this.gridListPiezasDisp.getStorePrincipal().reload();
            _this.gridActividades.getStorePrincipal().reload();

        }, function () {
            _this.gridActividades.limpiarListas();
            _this.gridListPiezasDisp.limpiarListas();
        });
        _this.modelo.habilitarBotones(true);
    },
    salvarAcciones: function () {
        var _this = this.scope || this;
        _this.PrepararsalvarAcciones();
    },
    SalvandoAcciones: function () {
        var _this = this;
        var parametros = new Array();
        parametros[0] = _this.gridActividades.salvarActividades();
        parametros[1] = _this.gridListPiezasDisp.salvarPiezasDisp();

        return parametros;
    },
    prepareDocModify: function (d) {
        var _this = this;

        _this.gridActividades.getStorePrincipal().on({
            'beforeload': function (store) {
                var limit = _this.gridActividades.getGridPrincipal().initialConfig.bbar.pageSize;
                store.initBaseParams = {
                    idcita: (d) ? d.json.iddocumento : null,
                    idtipoprecioactividad: (d) ? d.json.idtipoprecioactividad : null,
                    limit: limit
                }
            }
        });
        _this.gridListPiezasDisp.getStorePrincipal().on({
            'beforeload': function (store) {
                var limit = _this.gridActividades.getGridPrincipal().initialConfig.bbar.pageSize;
                store.initBaseParams = {
                    idcita: (d) ? d.json.iddocumento : null,
                    idtipopreciopiezas: (d) ? d.json.idtipopreciopiezas : null,
                    limit: limit
                }
            }
        });
        Ext.apply(d.json.fechaextimada, d.json.fechaextimada);
        if (campoDias.getValue()) {
            chbReservP.setValue(true);
            campoDias.enable();
            campoDias.setValue(d.json.dias);

        }
        // Ext.apply(d.data.producto, d.json.descripcionmarcamodelo);
        Ext.apply(d.data.idcliente, (d.json.idagencia) ? null : d.data.idcliente);
        if (d.data.idcliente) {
            Ext.apply(_this.comboClientes, { valueNotFoundText: d.data.cliente });
            Ext.apply(comboTiposPrecioActividad, { valueNotFoundText: d.json.idtipoprecioactividad });
            Ext.apply(comboTiposPrecioPiezas, { valueNotFoundText: d.data.idtipopreciopiezas });
        }
        if (d.json.idservicio) {

            Ext.apply(_this.comboServicio, { valueNotFoundText: d.json.idservicio });
        }
        d.json.correo = (d.json.correo) ? d.json.correo : null;
        d.json.telefono = (d.json.telefono) ? d.json.telefono : null;
        d.json.observacion = (d.json.observacion) ? d.json.observacion : null;

        d.json.nombreresponsable = (d.json.nombreresponsable) ? d.json.nombreresponsable : null;
        d.json.idcarnetresponsable = (d.json.idcarnetresponsable) ? d.json.idcarnetresponsable : 0;
        d.json.telefonoresponsable = (d.json.telefonoresponsable) ? d.json.telefonoresponsable : null;
        d.json.textocorreoresponsable = (d.json.textocorreoresponsable) ? d.json.textocorreoresponsable : null;
        _this.textoCorreo.setValue(d.json.correo);
        _this.telefono.setValue(d.json.telefono);
        _this.textObservaciones.setValue(d.json.observacion);

        _this.nombreResponsableCita.setValue(d.json.nombreresponsable);
        _this.carnetResponsableCita.setValue(d.json.idcarnetresponsable);
        _this.telefonoResponsableCita.setValue(d.json.telefonoresponsable);
        _this.textoCorreoResponsableCita.setValue(d.json.textocorreoresponsable);
        comboTiposPrecioActividad.enable();
        comboTiposPrecioActividad.setValue(d.json.idtipoprecioactividad);
        comboTiposPrecioPiezas.enable();
        comboTiposPrecioPiezas.setValue(d.json.idtipopreciopiezas);
        Ext.apply(_this.combofechaExtimada, { valueNotFoundText: d.json.fechaextimada });
        Ext.apply(_this.textoMedio, { valueNotFoundText: d.json.producto });
        Ext.apply(_this.horario, { valueNotFoundText: d.json.horaentrada });
        Ext.apply(_this.textObservaciones, { valueNotFoundText: d.json.observacion });


        // if (d.data.idcentrocosto) Ext.apply(_this.comboCentroCosto, {valueNotFoundText: d.data.denomcentrocosto});
        if (this.fromularioGestion) {
            if (d.data.estado > 1) {
                this.deshabilitarComponentes();
            }
            this.habilitarComponentes();
            d.data.fechacita = (d.data.fechacita) ? d.data.fechacita : null;
            d.json.fechaextimada = (d.json.fechaextimada) ? d.data.fechaextimada : null;
            d.json.horaentrada = (d.json.horaentrada) ? d.json.horaentrada : null;
            this.fromularioGestion.getForm().loadRecord(d);
            if (d.json.producto)
                this.textoMedio.setValue(d.json.producto);
            var valor = (d.data.nrodocorigen) ? d.data.nrodocorigen : '';
            // this.lbNroDocGenera.setText(this.idioma.lbNoDocOrigen + ': ' + valor);
            this.limpiarComponentesMedio();
            if (this.origen == 0) {//Solicitud
                this.modelo.documentoorigen = this.origen + 1;
                this.prepareDocPorSolicitud(d);
            } else if (this.origen == 1) {//Inscripcion
                this.modelo.documentoorigen = this.origen + 1;
                this.recordOrigen = d;
                this.idIndicador = d.data.idmedio;
                this.fromularioGestion.getForm().loadRecord(d);
                this.modelo.idcliente = d.data.idcliente;
                //this.modelo.fechainicio = d.data.fechainicio;
                // this.comboFechaFin.minValue = this.comboFechaInicio.getValue();
                this.modelo.iddocumentoorigen = d.json.iddocumento;
                var valor = (d.data.nrodoc) ? d.data.nrodoc : '';
                // this.lbNroDocGenera.setText(this.idioma.lbNoDocOrigen + ': ' + valor);
                if (this.arrIndicadores) {
                    this.loadDatosMedioIncripcion();
                    //if(find){

                    // }
                }
                this.deshabilitarPorIncripcion();

            } else if (this.origen == 2) {// Solicitud a terceros
                this.recordOrigen = d;
                this.tfFacturaTerceros.setValue(0);
                this.tfFacturaTerceros.enable();
                var valor = (d.data.nrodoc) ? d.data.nrodoc : '';
                // this.lbNroDocGenera.setText(this.idioma.lbNoDocOrigen + ': ' + valor);
                this.modelo.iddocumentoorigen = d.data.iddocumento;
                this.gridServTerceros.setIdSolicitud(d.data.iddocumento);
                //this.comboFechaInicio.setMinValue(this.recordOrigen.json.
                // );
                if (d.data.idagencia) {
                    this.comboProveedores.store.load();
                    this.comboProveedores.setValue(d.json.idagencia);
                    this.modelo.idcliente = d.json.idagencia;
                    this.modelo.idagencia = null;
                } else {
                    //para poder agregar aal combo
                    this.topicRecord = Ext.data.Record.create([
                        { name: 'idclientesproveedores' },
                        { name: 'nombre' }
                    ]);
                    var entidad = new this.topicRecord({
                        idclientesproveedores: d.json.idestructura,
                        nombre: d.json.entidad
                    });
                    this.comboProveedores.store.removeAll()
                    this.comboProveedores.store.insert(0, entidad);
                    this.comboProveedores.setValue(this.comboProveedores.store.getAt(0).data.idclientesproveedores);
                    this.modelo.idagencia = d.json.idestructura;
                    this.modelo.idcliente = null;
                }
                this.modelo.idindicador = d.data.idindicador;
                this.modelo.idpadreindicador = d.data.idpadreindicador;
                this.modelo.idproducto = d.data.idproducto;
                this.modelo.producto = d.json.descripcionmarcamodelo;
                this.textoMedio.setValue(d.json.descripcionmarcamodelo);
                // this.textObservaciones.setValue(d.json.observaciones);
                this.producto = d.json.descripcionmarcamodelo;
                this.idProducto = d.data.idproducto;
                this.idIndicador = d.data.idindicador;
                this.modelo.documentoorigen = this.origen + 1;
                if (this.recordOrigen.data.idproducto) {
                    this.idProducto = this.recordOrigen.data.idproducto;
                    this.cargarRegNumericoPorId(this.recordOrigen.data.idproducto);
                } else {
                    if (this.arrIndicadores) {
                        var find = this.loadDatosMedioSolicitud();

                        if (find) {
                            this.layoutDatosMedio(_this.idPadreIndicador);
                        }
                    }
                }
                this.deshabilitarPorSolicitudTerceros();
                this.gridServTerceros.getStorePrincipal().load();
            } else if (this.origen == 4) {//Planificacion de mantenimiento
                this.record = d;
                this.modelo.tipo = 1;
                this.modelo.idplanificacionmantenimiento = d.data.idplanificacionmantenimiento;
                var storeActvPlanif = new Ext.data.Store({
                    url: '/logistica/activos_fijos/configuracion/index.php/confplanificacionmantenimiento/cargarActvidadesPlanificadasParaOrden',
                    reader: new Ext.data.JsonReader({
                        root: 'datos',
                        id: 'idactividad',
                    }, [
                        { name: 'idordenactividad' },
                        { name: 'idactividad' },
                        { name: 'denominacion' },
                        { name: 'idpadre' },
                        { name: 'arraynorma' },
                    ])
                });
                storeActvPlanif.on({
                    'load': function (st) {
                        // _this.gridActividades.adicionarRecords(st.getRange());
                    }
                });
                storeActvPlanif.load({ params: { idplanificacionmantenimiento: d.data.idplanificacionmantenimiento } });
                this.textoMedio.setValue(this.record.data.denominacion);
                // this.textObservaciones.setValue(this.record.json.observaciones);
                this.idIndicador = this.record.data.idindicador;
                this.idProducto = this.record.data.idregnumerico;
                this.idPadreIndicador = this.record.data.idpadre;
                this.gridActividades.setIdMedio(this.idPadreIndicador);
                this.producto = this.record.data.denominacion;
                this.modelo.idindicador = this.record.data.idindicador;
                this.modelo.idproducto = this.record.data.idregnumerico;
                this.modelo.idpadreindicador = this.record.data.idpadreindicador;
                this.modelo.producto = this.record.data.denominacion;
                this.layoutDatosMedio(this.idPadreIndicador, d);
                this.deshabilitarPorMantenimiento();
            } else if (this.origen == 5) {//Pedido
                this.record = d;
                // this.gridActividades.setOrigen(this.origen - 1);
                this.modelo.documentoorigen = this.origen - 1;
                this.modelo.iddocumentoorigen = d.data.iddocumentoorigen;
                var storeActvPlanif = new Ext.data.Store({
                    url: '/logistica/talleres/citas/index.php/citastalleres/cargarServiciosPedido',
                    reader: new Ext.data.JsonReader({
                        root: 'datos',
                        id: 'idindicador',
                    }, [
                        { name: 'idordenactividad' },
                        { name: 'idindicador' },
                        { name: 'denominacion' },

                    ])
                });
                storeActvPlanif.on({
                    'load': function (st) {
                        // _this.gridActividades.adicionarRecords(st.getRange());
                    }
                });
                storeActvPlanif.load({ params: { idpedido: d.data.iddocumentoorigen } });
                this.deshabilitarPorPedido();
            } else {
                this.modelo.loadRecord();
                this.record = d;
                if (d.data.idcliente && !d.data.cliente)
                    this.comboClientes.store.load({
                        params: { idclientesproveedores: d.data.idcliente }, callback: function (resp) {
                            if (resp[0]) {
                                Ext.apply(_this.comboClientes, { valueNotFoundText: resp[0].json.nombre });
                            } else Ext.apply(_this.comboClientes, { valueNotFoundText: 'cliente no encontrado' });
                        }
                    });
                if (d.json.idservicio && !d.json.servicio)
                    this.comboServicio.store.load({
                        params: { idservicio: this.servicio }, callback: function (resp) {
                            if (resp[0]) {
                                Ext.apply(_this.comboServicio, { valueNotFoundText: resp[0].json.denominacion });
                            } else Ext.apply(_this.comboServicio, { valueNotFoundText: 'servicio no encontrado' });
                        }
                    });
                /* Ext.apply(comboTiposPrecioPiezas, {valueNotFoundText: this.record.json.idtipopreciopiezas});
                 Ext.apply(comboTiposPrecioActividad, {valueNotFoundText: this.record.json.idtipoprecioactividad});*/
                //if (campoDias.getValue()) {
                chbReservP.setValue(true);
                campoDias.enable();
                campoDias.setValue(this.record.json.dias);
                //}
                this.textoMedio.setValue(this.record.json.producto);
                //this.textObservaciones.setValue(this.record.json.observaciones);
                this.idIndicador = this.record.data.idindicador;
                this.idProducto = this.record.data.idproducto;
                this.idPadreIndicador = this.record.data.idpadre;
                this.comboServicio.setValue(this.record.json.idservicio);
                // this.gridActividades.setIdMedio(this.idPadreIndicador);
                this.producto = this.record.data.descripcionmarcamodelo;
                this.getTitleDocumento(this.record.data.iddocumento);
                this.gridListPiezasDisp.getStorePrincipal().load();
                this.gridActividades.getStorePrincipal().load();
                this.modelo.cargarDatosMedio({ idcita: this.record.data.iddocumento }, function (resp) {

                    var dinamics = (resp['datos']) ? Ext.decode(resp['datos'].dinamicos) : null;
                    _this.idPadreIndicador = resp.datos.idpadreindicador;
                    _this.loadValueDatosMedios(dinamics);
                });
                idcita = this.record.data.iddocumento;
                if (d.data.documentoorigen != 3) {
                    /*  this.gridActividades.getStorePrincipal().load();
                      this.gridMateriales.getStorePrincipal().load();*/
                } else {
                    this.tfFacturaTerceros.enable();
                    this.tfFacturaTerceros.setValue(this.record.data.importetotal);
                }
                if (this.record.data.tipo == 1) {
                    this.deshabilitarPorMantenimiento();
                }
                if (this.record.data.estado != 1) {
                    if (d.data.documentoorigen == 3) {
                        if (d.json.idagencia) {
                            //para poder agregar al combo
                            this.topicRecord = Ext.data.Record.create([
                                { name: 'idclientesproveedores' },
                                { name: 'nombre' }
                            ]);
                            var entidad = new this.topicRecord({
                                idclientesproveedores: d.json.idagencia,
                                nombre: d.json.agencia
                            });
                            _this.comboProveedores.store.insert(0, entidad);
                            _this.comboProveedores.setValue(this.comboProveedores.store.getAt(0).data.idclientesproveedores);
                            _this.modelo.idagencia = d.json.idagencia;
                            _this.modelo.idcliente = null;
                        } else {
                            _this.comboProveedores.store.load();
                            _this.modelo.idcliente = d.data.idcliente;
                            _this.comboProveedores.setValue(d.data.idcliente);
                            _this.modelo.idagencia = null;
                        }
                        this.deshabilitarPorSolicitudTerceros();
                        this.gridServTerceros.setIdSolicitud(d.json.iddocumentoorigen);
                        this.gridServTerceros.getStorePrincipal().load();
                    }
                    this.btnSalvar.disable();

                } else {
                    if (d.data.documentoorigen == 1) {
                        this.deshabilitarPorSolicitud(d.data.estado);
                    } else if (d.data.documentoorigen == 2) {
                        this.deshabilitarPorIncripcion();
                    } else if (d.data.documentoorigen == 3) {
                        if (d.json.idagencia) {
                            //para poder agregar al combo
                            this.topicRecord = Ext.data.Record.create([
                                { name: 'idclientesproveedores' },
                                { name: 'nombre' }
                            ]);
                            var entidad = new this.topicRecord({
                                idclientesproveedores: d.json.idagencia,
                                nombre: d.json.agencia
                            });
                            this.comboProveedores.store.insert(0, entidad);
                            this.comboProveedores.setValue(this.comboProveedores.store.getAt(0).data.idclientesproveedores);
                            _this.modelo.idagencia = d.json.idagencia;
                            _this.modelo.idcliente = null;
                        } else {
                            _this.comboProveedores.store.load();
                            _this.modelo.idcliente = d.data.idcliente;
                            _this.comboProveedores.setValue(d.data.idcliente);
                            _this.modelo.idagencia = null;
                        }
                        _this.deshabilitarPorSolicitudTerceros();
                        _this.gridServTerceros.setIdSolicitud(d.json.iddocumentoorigen);
                        _this.gridServTerceros.getStorePrincipal().load();
                    }
                }
                this.btnNuevo.hide();
            }
            this.getTitleDocumento(this.record.data.iddocumento);
        }
        if (d.data.estado > 1) {
            this.deshabilitarComponentes();
        }


    },
    prepareDocPorSolicitud: function (d) {
        var _this = this;
        this.fromularioGestion.getForm().loadRecord(d);
        this.recordOrigen = d;
        var valor = (d.data.nrodoc) ? d.data.nrodoc : '';
        // this.lbNroDocGenera.setText(this.idioma.lbNoDocOrigen + ': ' + valor);
        //this.comboFechaInicio.setMinValue(this.recordOrigen.json.fecha);
        this.comboServicio.setValue(d.json.idservicio);
        chbReservP.setValue(true);
        campoDias.enable();
        campoDias.setValue(d.json.dias);
        comboTiposPrecioPiezas.setValue(d.json.idtipopreciopiezas);
        comboTiposPrecioActividad.setValue(d.json.idtipoprecioactividad);
        this.modelo.idcliente = d.data.idcliente;
        this.comboClientes.setValue(d.data.idcliente);
        if (d.data.idcliente)
            this.comboClientes.store.load({
                params: { idclientesproveedores: d.data.idcliente }, callback: function (resp) {
                    if (resp[0]) {
                        Ext.apply(_this.comboClientes, { valueNotFoundText: resp[0].json.nombre });
                    } else Ext.apply(_this.comboClientes, { valueNotFoundText: 'cliente no encontrado' });
                }
            });
        this.fallasClienteReport.setValue(d.data.falloscliente);
        this.modelo.fallascliente = d.data.falloscliente;
        this.modelo.iddocumentoorigen = d.data.iddocumento;
        this.textoMedio.setValue(this.recordOrigen.json.descripcionmarcamodelo);

        this.producto = this.recordOrigen.json.descripcionmarcamodelo;
        _this.atributoidentificador = (_this.recordOrigen.data.atributoidentificador) ? _this.recordOrigen.data.atributoidentificador : null;
        if (this.recordOrigen.data.idproducto) {
            this.idProducto = this.recordOrigen.data.idproducto;
            this.cargarRegNumericoPorId(this.recordOrigen.data.idproducto);
        } else {
            this.idIndicador = this.recordOrigen.data.idindicador;
            if (this.arrIndicadores) {
                var find = this.loadDatosMedioSolicitud();

                if (find) {
                    this.layoutDatosMedio(_this.idPadreIndicador);
                }
            }

        }
        this.deshabilitarPorSolicitud(1);
    },
    findIndicador: function () {
        var _this = this;
        var param = {};
        param['explotacion'] = 1;
        this.storeIndicadores = new Ext.data.Store({
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarGridClasificador',
            baseParams: param,
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idpadre'
            }, [
                { name: 'idindicador' },
                { name: 'idpadre' },
                { name: 'descripcionmarcamodelo' },
                { name: 'codigo' },
            ])
        });
        this.storeIndicadores.on('load', function (st, records) {
            if (records.length > 0) {
                _this.arrIndicadores = records;
            }
            _this.fireEvent('indicadorescargados');
        });
        this.storeIndicadores.load();
    },
    maskMedio: function () {
        this.tabPDatosMedio.body.mask('Cargando...');
    },
    habilitarComponentes: function () {
        this.comboClientes.enable();
        this.comboClientes.show();
        this.comboServicio.enable();
        this.textoCorreo.enable();

        this.nombreResponsableCita.enable();
        this.carnetResponsableCita.enable();
        this.telefonoResponsableCita.enable();
        this.textoCorreoResponsableCita.enable();

        this.telefono.enable();
        this.comboServicio.show();
        /*this.comboCentroCosto.enable();
        this.comboCentroCosto.show();*/
        this.comboProveedores.hide();
        this.combofechaCita.enable();
        this.horario.enable();
        this.combofechaExtimada.enable();
        comboTiposPrecioActividad.enable();
        comboTiposPrecioPiezas.enable();
        chbReservP.enable();
        this.textoMedio.enable();
        this.btnMedios.enable();
        this.textObservaciones.enable();

        this.gridListPiezasDisp.getGridPrincipal().on('beforeedit', function(e) {
            e.cancel = false;
        });

        this.btnSalvar.show();
    },
    deshabilitarComponentes: function () {

        this.comboServicio.disable();
        this.comboClientes.disable();
        this.combofechaCita.disable();
        this.combofechaExtimada.disable();
        comboTiposPrecioPiezas.disable();
        comboTiposPrecioActividad.disable();
        this.horario.disable();
        this.btnMedios.disable();
        this.telefono.disable();
        this.textoCorreo.disable();

        this.nombreResponsableCita.disable();
        this.carnetResponsableCita.disable();
        this.telefonoResponsableCita.disable();
        this.textoCorreoResponsableCita.disable();

        this.textoMedio.disable();
        this.textObservaciones.disable();

        this.gridActividades.deshabilitar();
        this.gridListPiezasDisp.deshabilitar();

        this.gridListPiezasDisp.getGridPrincipal().on('beforeedit', function(e) {
           e.cancel = true;
        });

        this.btnSalvar.hide();
    },
    deshabilitarCamposDinamicos: function () {
        this.formDatosMedio.getForm().items.each(function (field) {
            if (field.isFormField) {
                field.disable();
            }
        });
    },
    grantedAction: function (idAccion) {
        var existe = false;
        this.listaAcciones.each(function (a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    },
    datosLimpios: function () {
        var _this = this;
        if ((this.comboClientes && this.comboClientes.getRawValue())
            || (this.comboProveedores && this.comboProveedores.getRawValue()) || this.combofechaCita.getValue() || this.combofechaExtimada.getValue()
            || chbReservP.getValue() || this.comboServicio.getValue() || this.textObservaciones.getValue()
            || this.telefono.getValue() || this.nombreResponsableCita
            || this.textoCorreoResponsableCita  || this.telefonoResponsableCita || this.carnetResponsableCita 
            || this.textoCorreo.getValue() 
            || this.horario.getValue() || comboTiposPrecioActividad.getValue()
            || comboTiposPrecioPiezas.getValue() || this.textoMedio.getValue() 
            || this.gridActividades.getStorePrincipal().getCount() > 0 
            || this.gridListPiezasDisp.getStorePrincipal().getCount() > 0) {
            return false;
        } else return true;
    },
    loadDatosMedioIncripcion: function () {
        var _this = this;
        var find = false;
        var storeMedios = new Ext.data.Store({
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarGridClasificador',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idindicador',
            }, [
                { name: 'idindicador' },
                { name: 'idpadre' },
                { name: 'descripcionmarcamodelo' },
                { name: 'codigo' }
            ])
        });

        storeMedios.load({
            params: { idindicador: _this.recordOrigen.data.idmedio }
            , callback: function (res) {
                var record = res[0];
                find = true;
                _this.idPadreIndicador = record.data.idpadreindicador;
                _this.gridActividades.setIdMedio(_this.idPadreIndicador);
                _this.producto = record.data.descripcionmarcamodelo;
                _this.modelo.idpadreindicador = _this.idPadreIndicador;
                _this.modelo.idindicador = _this.idIndicador;
                _this.modelo.idProducto = null;
                _this.textoMedio.setValue(record.data.descripcionmarcamodelo);
                _this.modelo.producto = _this.producto;
                _this.loadValueDatosMedios(Ext.decode(_this.recordOrigen.data.datosmedio));
            }
        });
    },
    loadValueDatosMedios: function (dinamics) {

        var _this = this;

        var map = [];
        var valores = {};
        this.modelo.listaDinamicos.deleteAll();
        Ext.each(dinamics, function (obj, pos) {
            map[pos] = { name: obj.name };
            valores[obj.name] = obj[obj.name];
            _this.modelo.listaDinamicos.add(obj);
        });
        var MapRecord = Ext.data.Record.create(map);
        var recordMedio = new MapRecord(valores);
        _this.layoutDatosMedio(_this.idPadreIndicador, recordMedio);
    },
    loadDatosMedioSolicitud: function () {
        var _this = this;
        var find = false;
        Ext.each(this.arrIndicadores, function (record) {
            if (_this.recordOrigen.data.idindicador == record.data.idindicador) {
                find = true;
                _this.idPadreIndicador = record.id;
                _this.gridActividades.setIdMedio(_this.idPadreIndicador);
                _this.producto = record.data.descripcionmarcamodelo;
                _this.modelo.idpadreindicador = _this.idPadreIndicador;
                _this.modelo.idindicador = _this.idIndicador;
                _this.modelo.idProducto = null;
                _this.textoMedio.setValue(record.data.descripcionmarcamodelo);
                _this.modelo.producto = _this.producto;
                _this.atributoidentificador = (_this.recordOrigen.data.atributoidentificador) ? _this.recordOrigen.data.atributoidentificador : null;
                _this.modelo.atributoidentificador = (_this.recordOrigen.data.atributoidentificador) ? _this.recordOrigen.data.atributoidentificador : null;
            }
        });

        return find;
    },
    limpiarComponentesMedio: function () {

        this.modelo.formBasicMedio.deleteAll();
        this.datNaturaleza.items.each(function (e, p) {
            e.removeAll();
        });
        this.datNaturaleza.columnaActual = 1;
        this.datDinamic.items.each(function (e, p) {
            e.removeAll();
        });
        this.datDinamic.columnaActual = 1;
        if (this.tabPDatosMedio.getComponent(1)) {
            this.tabPDatosMedio.hideTabStripItem(1);
        }
        if (this.tabPDatosMedio.getComponent(2)) {
            this.tabPDatosMedio.hideTabStripItem(2);
        }
    },
    layoutDatosMedio: function (idindicador, record) {
        var _this = this;
        _this.maskMedio();
        if (idindicador === undefined) {
            idindicador = record.data.idpadre;
        }
        _this.modelo.cargarAtributosMedios(idindicador, function (val) {
            var cantidadNat = (val['datos'].naturaleza) ? val['datos'].naturaleza.length : 0;
            var cantidadDinam = val['datos'].dinamicos.length;
            if (cantidadNat > 0) {
                var listCheksNaturaleza = new LOG.util.List();
                _this.tabPDatosMedio.setActiveTab(1);
                Ext.each(val['datos'].naturaleza, function (t) {
                    t.name = (t.name) ? t.name : t.idatributonaturaleza;
                    t.label = t.denominacion;
                    if (t.tipocomp != 2) {
                        var text = _this.crearTextDinamico(t);
                        _this.datNaturaleza.addComponent(text);
                        //if (text.identificador == 1 && _this.origen == 2) {
                        if (text.identificador == 1 && _this.atributoidentificador) {
                            text.setValue(_this.atributoidentificador);
                            text.disable();
                        }
                        if (text.identificador == 1) {
                            _this.campoIdentificador = text;
                        }
                    } else listCheksNaturaleza.add(t);
                });
                listCheksNaturaleza.each(function (t) {
                    var text = _this.crearTextDinamico(t);
                    _this.datNaturaleza.addComponent(text);
                });
                _this.tabPDatosMedio.unhideTabStripItem(1);
            }
            if (cantidadDinam > 0) {
                var listCheksDinamicos = new LOG.util.List();
                _this.tabPDatosMedio.setActiveTab(2);
                Ext.each(val['datos'].dinamicos, function (t) {
                    if (t.tipocomp != 2) {
                        var text = _this.crearTextDinamico(t);
                        text.dinamico = true;
                        text.idtabla = t.idtabla;
                        _this.datDinamic.addComponent(text);
                        //if (text.identificador == 1 && _this.origen == 2) {
                        if (text.identificador == 1 && _this.atributoidentificador) {
                            text.setValue(_this.atributoidentificador);
                            text.disable();
                        }
                        if (text.identificador == 1) {
                            _this.campoIdentificador = text;
                        }
                    } else {
                        listCheksDinamicos.add(t);
                    }

                });

                listCheksDinamicos.each(function (t) {
                    var text = _this.crearTextDinamico(t);
                    text.dinamico = true;
                    _this.datDinamic.addComponent(text);
                });
                _this.tabPDatosMedio.unhideTabStripItem(2);
            }
            if (cantidadNat > 0 || cantidadDinam > 0) {
                _this.datDinamic.doLayout();
                _this.tabPDatosMedio.setActiveTab(2);
                _this.datNaturaleza.doLayout();
                _this.tabPDatosMedio.setActiveTab(1);
                _this.tabPDatosMedio.setActiveTab(0);
                _this.formDatosMedio = LOG.util.UIManager.initForm({
                    items: [_this.columFormMedioDinamico.getColumn(0), _this.columFormMedioNaturaleza.getColumn(0)]
                });

                if (_this.record && _this.record.data.estado != 1) {
                    _this.deshabilitarCamposDinamicos();
                }
                _this.modelo.bindFormMedio(_this.formDatosMedio);
                _this.fireEvent('dinamicoscreados', record);
                _this.formDatosMedio.getForm().isValid();
                _this.datDinamic.doLayout();
            } else
                mostrarMensaje(1, _this.idioma.msjNoAtributosConfigurados);
            if (_this.tabPDatosMedio.body.isMasked()) {
                _this.tabPDatosMedio.body.unmask();
            }
            if (_this.body.isMasked()) {
                _this.body.unmask();
            }
        });
    },
    crearTextDinamico: function (obj) {
        var _this = this;
        var campoTexto = undefined;
        obj.labelM = obj.label;
        if (obj.identificador == 1) {
            obj.labelM = '<span style="color:#008000">' + obj.label + '(identificador):</span>';
        }
        obj.name = (obj.name) ? obj.name : obj.nombretabla;
        if (obj.tipocomp == 5) {
            campoTexto = new Ext.form.TextField({
                name: (obj.name) ? obj.name : obj.nombretabla,
                labelSeparator: (obj.identificador == 1) ? '' : ':',
                tabular: false,
                fieldLabel: obj.labelM,
                etiqueta: obj.label,
                identificador: obj.identificador,
                dinamico: false,
                allowBlank: (_this.esMatricula(obj.label)) ? false : true,
                enableKeyEvents: true,
                autoLoad: true,
                maxLength: (obj.longitud) ? obj.longitud : 50,
                maxLength: 50,
                maxLengthText: 50,
                maxLengthText: _this.idioma.msgErrortext((obj.longitud) ? obj.longitud : 50),
                regex: (_this.esMatricula(obj.label)) ? LOG.util.Regex.matriculaAll : LOG.util.Regex.general,
                regexText: (_this.esMatricula(obj.label)) ? _this.idioma.msgErrorMatricula : _this.idioma.msgexpreAlfaNumRegexText,
                listeners: {
                    keyup: function () {
                        _this.modelo.dirtyDinamic = true;

                    },
                    keypress: function (e) {
                        var venta = new LOG.tall.ordentrabajo.GridDinamicos({
                            idioma: _this.idioma,
                        });
                        venta.init();
                        venta.view();
                        venta.getStorePrincipal().load();
                        venta.getVistaPrincipal().aceptarFn = function () {
                            var Selected = venta.getGridPrincipal().getSelectionModel().getSelected();
                            if (Selected) {
                                Selected.data = Selected.json;
                                e.setValue(Selected.data.mod_datosmaestrosmeta_nom_tnu_3_denominaciontnu_3);
                                var attrdinamico = Selected.data.mod_datosmaestrosmeta_nom_tnu_3_denominaciontnu_3
                                _this.modelo.listaDinamicos.arrayData[0].num_1 = attrdinamico;
                            } else mostrarMensaje(2, 'Debe seleccionar el atributo.')


                        }
                    }

                }
            });
        } else {
            switch (obj.tipocomp) {
                case '1':
                    campoTexto = new LOG.util.Prototipos.inputDecimal({
                        name: (obj.name) ? obj.name : obj.nombretabla,
                        labelSeparator: (obj.identificador == 1) ? '' : ':',
                        fieldLabel: obj.labelM,
                        etiqueta: obj.label,
                        identificador: obj.identificador,
                        dinamico: false,
                        allowBlank: (_this.esMatricula(obj.label)) ? false : true,
                        enableKeyEvents: true,
                        tipo: 1,
                        listeners: {
                            keyup: function () {
                                _this.modelo.dirtyDinamic = true;
                            }
                        }
                    });
                    if (obj.longitud) {
                        Ext.apply(campoTexto, {
                            maxLength: obj.longitud,
                            maxLengthText: 'El tama\xf1o m\xe1ximo requerido es ' + obj.longitud + ' caracteres.'
                        });
                    }
                    break;
                case '2':
                    campoTexto = new Ext.form.Checkbox({
                        name: (obj.name) ? obj.name : obj.nombretabla,
                        labelSeparator: (obj.identificador == 1) ? '' : ':',
                        boxLabel: obj.labelM,
                        etiqueta: obj.label,
                        identificador: obj.identificador,
                        dinamico: false,
                        enableKeyEvents: true,
                        tipo: 2,
                        listeners: {
                            change: function () {
                                _this.modelo.dirtyDinamic = true;
                            }
                        }
                    });
                    break;
                case '3':
                    campoTexto = new Ext.form.DateField({
                        name: (obj.name) ? obj.name : obj.nombretabla,
                        labelSeparator: (obj.identificador == 1) ? '' : ':',
                        fieldLabel: obj.labelM,
                        etiqueta: obj.label,
                        identificador: obj.identificador,
                        dinamico: false,
                        enableKeyEvents: true,
                        allowBlank: (_this.esMatricula(obj.label)) ? false : true,
                        editable: false,
                        format: 'd/m/Y',
                        tipo: 3,
                        setValue: function (date) {
                            if (date.substring)
                                date = date.substring(0, 10);
                            return Ext.form.DateField.superclass.setValue.call(this, this.formatDate(this.parseDate(date)));
                        },
                        listeners: {
                            select: function () {
                                _this.modelo.dirtyDinamic = true;
                            }
                        }
                    });
                    break;
                default:
                    obj.longitud = (_this.esMatricula(obj.label)) ? 7 : obj.longitud;
                    campoTexto = new LOG.util.Prototipos.inputTexto({
                        name: (obj.name) ? obj.name : obj.nombretabla,
                        labelSeparator: (obj.identificador == 1) ? '' : ':',
                        fieldLabel: obj.labelM,
                        etiqueta: obj.label,
                        identificador: obj.identificador,
                        dinamico: false,
                        allowBlank: (_this.esMatricula(obj.label)) ? false : true,
                        enableKeyEvents: true,
                        maxLength: (obj.longitud) ? obj.longitud : 50,
                        maxLengthText: _this.idioma.msgErrortext((obj.longitud) ? obj.longitud : 50),
                        regex: (_this.esMatricula(obj.label)) ? LOG.util.Regex.matriculaAll : LOG.util.Regex.general,
                        regexText: (_this.esMatricula(obj.label)) ? _this.idioma.msgErrorMatricula : _this.idioma.msgexpreAlfaNumRegexText,
                        listeners: {
                            keyup: function () {
                                _this.modelo.dirtyDinamic = true;
                            }
                        }
                    });

                    break;
            }
        }


        return campoTexto;
    },
    habilitarBotonesAlModificarGrid: function () {
        var _this = this;
        _this.modelo.dirtyGrids = true;
        if (_this.modelo.isValid()) {
            _this.modelo.habilitarBotones();
        } else
            _this.modelo.habilitarBotones(true);
    },
    controlBotones: function (b, status) {
        var _caller = this;
        b.disable();
    },
    esMatricula: function (cadena) {
        if (cadena.indexOf('matricula') != -1 || cadena.indexOf('matrícula') != -1 || cadena.indexOf('matr\u00edcula') != -1 || cadena.indexOf('MATRICULA') != -1) {
            return true;
        }
        return false;
    },
    onShow: function () {
        this.listaBotonesVentana.each(function (b) {
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }.createDelegate(this));
        this.listaBotones.each(function (b) {
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }.createDelegate(this));
    }

});

LOG.tall.citas.GridActividades = Ext.extend(LOG.util.UITemplate, {
    /**
     * Prototipo de los record a crear
     */
    topicRecord: undefined,
    /**
     * lista de actividades eliminados
     */
    listaEliminadosAct: undefined,
    /**
     * lista de actividades adicionados
     */
    listaAdicionadosAct: undefined,
    /**
     * id producto seleccionado
     */
    idcliente: undefined,
    idproducto: undefined,
    idcita: undefined,
    botonSalvar: undefined,
    idservicio: undefined,
    _parent: undefined,

    /**
     * true permite que se habiliten los componentes para modificar, false : no
     * */
    habilitado: true,
    pruneModifiedRecords: true,
    constructor: function (config) {
        this.gridEditable = true;
        this.formaVisualizacion = 'panel';
        this.listpiezas = config.listpiezas;
        this.autoLoad = false;
        this.autoSelect = false;
        this.panelBotonesVisible = true;
        this.busquedaBasica = true;
        this.modoSeleccion = 3;
        this.listaAdicionadosAct = new LOG.util.List();
        this.listaEliminadosAct = new LOG.util.List();
        this.dirController = '/logistica/talleres/citas/index.php/citastalleres';
        config.urlBusquedaGridPrincipal = 'cargarActividadesCita';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.citas.Idioma);
        this.concepto = this.idioma.lbActividades;
        this.textBusquedaSimple = this.idioma.cgActividades;
        this.topicRecord = Ext.data.Record.create([
            { name: 'idindicador' },
            { name: 'denominacion' },
            { name: 'codigo' },
            { name: 'umedida' },
            { name: 'precio' },
            { name: 'precioalternativo' },
        ]);
        LOG.tall.citas.GridActividades.superclass.constructor.call(this, config);

    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'idactividadcita',
            hidden: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'denominacion',
            id: 'denominacionF',
            width: 80,
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            dataIndex: 'codigo',
            width: 80,
            //default: true
        });
        this.addGridColumn({
            hidden: true,
            header: this.idioma.cgCodigoProveedor,
            dataIndex: 'codigoproveedor',
            width: 80,
            //default: true
        });
        this.addGridColumn({
            hidden: true,
            header: this.idioma.cgUM,
            dataIndex: 'umedida',
            width: 80,
            //default: true
        });
        this.addGridColumn({
            header: 'Tiempo (h)',
            width: 80,
            dataIndex: 'duracion',
            align: 'right',
            default: true/*,
            editor: LOG.util.Prototipos.inputDecimal({
                allowBlank: false,
            })*/
        });
        var cod = (this.monedaContable) ? this.monedaContable : "";
        this.addGridColumn({
            dataIndex: 'precioventa',
            align: 'right',
            header: this.idioma.cgTarifaPor + " " + cod,
            width: 100,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }


        });

        //var ocultar = (monedaAlternativa && monedaAlternativa) ? true : false;
        var codAlt = (this.monedaContable) ? this.monedaContable : "";
        this.addGridColumn({
            dataIndex: 'importe',
            align: 'right',
            header: this.idioma.cgImporte + " " + cod,
            width: 120,
            hidden: ocultar,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
            /*  editor: new LOG.util.Prototipos.inputDecimal({
                  decimalPrecision: 2,
                  validarEnFormBasico: false,
                  minValue: 0
              })*/
        });
        var ocultar = (monedaAlternativa && monedaAlternativa != '') ? false : true;
        var codAlt = (monedaAlternativa && monedaAlternativa != '') ? monedaAlternativa : "";
        /*  this.addGridColumn({
              dataIndex: 'precioalternativo',
              header: this.idioma.cgTarifaPor + " " + codAlt,
              width: 100,
              align: 'right',
              hidden: ocultar,
              renderer: function (v) {
                  return Ext.util.Format.number(v, '0,000.00');
              }
          });*/


        /*  this.addGridColumn({
              dataIndex: 'importealternativo',
              header: this.idioma.cgImporte + " " + codAlt,
              width: 120,
              hidden: ocultar,
              align: 'right',
              renderer: function (v) {
                  return Ext.util.Format.number(v, '0,000.00');
              }
              /!*  editor: new LOG.util.Prototipos.inputDecimal({
                    decimalPrecision: 2,
                    validarEnFormBasico: false,
                    minValue: 0
                })*!/
          });*/
        /*   var cod = (this.monedaContable) ? this.monedaContable : "";
           this.addGridColumn({
               dataIndex: 'precioventa',
               align: 'right',
               header: this.idioma.cgTarifaPor + " " + cod,
               width: 100,
               renderer: function (v) {
                   return Ext.util.Format.number(v, '0,000.00');
               }
           });
           var codAlt = (this.monedaContable) ? this.monedaContable : "";
           this.addGridColumn({
               dataIndex: 'costo',
               align: 'right',
               header: this.idioma.cgImporte + " " + cod,
               width: 120,
               hidden: ocultar,
               renderer: function (v) {
                   return Ext.util.Format.number(v, '0,000.00');
               }
           });
           var ocultar = (monedaAlternativa && monedaAlternativa != '') ? false : true;
           var codAlt = (monedaAlternativa && monedaAlternativa != '') ? monedaAlternativa : "";
           this.addGridColumn({
               dataIndex: 'precioalternativo',
               align: 'right',
               header: this.idioma.cgTarifaPor + " " + codAlt,
               width: 100,
               hidden: ocultar,
               renderer: function (v) {
                   return Ext.util.Format.number(v, '0,000.00');
               }
           });
           this.addGridColumn({
               dataIndex: 'importealternativo',
               align: 'right',
               header: this.idioma.cgImporte + " " + codAlt,
               width: 120,
               hidden: ocultar,
               renderer: function (v) {
                   return Ext.util.Format.number(v, '0,000.00');
               }
           });*/
    },
    initDefaultButtons: function () {
        var _this = this.scope || this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            tooltip: this.idioma.ttBtnAdicionarActividades,
            iconCls: 'adicionar',
            text: LOG.util.Idioma.lbBtnAdicionar,
            handler: function () {
                if (comboTiposPrecioActividad.getValue()) {
                    var idsExcluir = new Array();


                    _this.getSmPrincipal().selectAll();
                    let allRecord = _this.getSmPrincipal().getSelections();

                    Ext.each(allRecord, function (rm, index) {

                        if (!rm.json) {
                            idsExcluir.push(rm.data.idindicador);
                        } else {
                            idsExcluir.push(rm.id);
                        }

                    });
                    var selectServicios = new LOG.tall.citas.GridSelectActividades({
                        idioma: _this.idioma,
                        idproducto: _this.idproducto,
                        idexcluir: idsExcluir,
                        idservicio: _this._parent.comboServicio.getValue(),
                        idtipoprecio: comboTiposPrecioActividad.getValue(),
                        idcliente: _this._parent.comboClientes.getValue()
                    });
                    selectServicios.init();
                    selectServicios.view();
                    selectServicios.getStorePrincipal().load();
                    selectServicios.getVistaPrincipal().aceptarFn = function () {
                        let records = selectServicios.getSmPrincipal().getSelections();
                        Ext.each(records, function (r) {

                            var myNewRecord = new _this.topicRecord({
                                idindicador: r.data.idindicador,
                                denominacion: r.data.denominacion,
                                umedida: r.data.umedida,
                                duracion: 1,
                                codigo: r.data.codigo,
                                codigoproveedor: r.data.codigoproveedor,
                                importe: r.data.costo

                            });
                            _this.getStorePrincipal().add(myNewRecord);
                            _this.listaAdicionadosAct.add(r);
                        });
                        botonSalvar.enable();
                    }
                    _this.getSmPrincipal().clearSelections();
                } else mostrarMensaje(2, 'Debe seleccionar el tipo de precio a utilizar.');

            },
            controlFn: function (b, _caller) {
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RCRUD') || _this._parent.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    if (!_this._parent.record || (_this._parent.record && _this._parent.record.data.estado == "1")) {
                        b.enable();
                    }
                } else {
                    b.setVisible(false);
                }
                /*_caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect' && _this.habilitado) {
                        b.enable();
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                });*/
            }
        }));

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'eliminar',
            text: LOG.util.Idioma.lbBtnEliminar,
            tooltip: this.idioma.ttBtnEliminarActividades,
            isContextual: true,
            handler: function () {

                if (_this.getSmPrincipal().hasSelection()) {
                    mostrarMensaje(2, _this.idioma.msgEliminarActividades, function (btn) {
                        if (btn == 'ok') {
                            Ext.MessageBox.wait(_this.idioma.msgEliminandoObjeto, _this.idioma.msgEspere || '...');
                            let records = _this.getSmPrincipal().getSelections();
                            Ext.each(records, function (r) {
                                if (!r.json) {
                                    _this.listaEliminadosAct.add(r.data.idindicador);
                                } else {
                                    _this.listaEliminadosAct.add(r.id);
                                }
                                _this.getStorePrincipal().remove(r);
                            });
                            botonSalvar.enable();
                            Ext.MessageBox.hide();
                            mostrarMensaje(1, _this.idioma.msgServicioActividades);
                        }
                    });
                }

            },
            controlFn: function (b, _caller) {
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RCRUD') || _this._parent.grantedAction('REliminar')) {
                    b.setVisible(true);
                    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0 && (_this._parent.record && _this._parent.record.data.estado == "1")) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                } else {
                    b.setVisible(false);
                }

            }
        }));

        this.addToolbarButton('->');
        this.addToolbarButton(this.idioma.lbTipoPrecio + ':');
        this.addToolbarButton(comboTiposPrecioActividad = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbTipoPrecio,
            name: 'idtipoprecio',
            autoLoad: true,
            url: '/logistica/talleres/citas/index.php/citastalleres/cargarTiposDePrecioActividades',
            displayField: 'denominacion',
            allowblank: false,
            valueField: 'idtipoprecio',
            queryParam: 'criterio',
            validarEnFormBasico: false,
            mode: 'remote',
            minChars: 1,
            pageSize: 15,
            // resizable: true,
            listeners: {
                select: function (cb, recordS) {
                    /*   var btnAddAct = _this.gridActividades.listaBotones.getItem(0);
                       btnAddAct.controlFn(btnAddAct, _this.gridActividades);
                       if (_this.datosLimpios())
                           _this.btnSalvar.disable();
                       else
                           _this.btnSalvar.enable();*/

                }

            }
        }));
        comboTiposPrecioActividad.store.on({
            beforeload: function (st, obj) {
                // obj.params.idcliente = _this.idcliente;
                obj.params.tipo = 2;
                /* if (idcliente) {
                     obj.params.idcliente = idcliente;

                 }*/

            },
            load: function (st, records) {
                comboTiposPrecioActividad.setValue(comboTiposPrecioActividad.getValue());
            }
        });


    },
    salvarActividades: function () {
        var _this = this;
        var allRecord = this.getSmPrincipal().getSelections();
        var ActividadesAdd = new Array();
        let ActividadesElim = new Array();
        let param = {};
        this.listaAdicionadosAct.each(function (element, pos) {
            ActividadesAdd[pos] = element.data;
        });
        this.listaEliminadosAct.each(function (el, pos) {
            ActividadesElim[pos] = el;
        });
        param['ActividadesAdd'] = ActividadesAdd;
        param['ActividadesElim'] = ActividadesElim;
        //param['ActividadesElim'] = _this.listaEliminados.getArray();
        if (comboTiposPrecioActividad.getValue()) {
            var idtipoprecioactividad = comboTiposPrecioActividad.getValue();
            param['idtipoprecioactividad'] = Ext.decode(idtipoprecioactividad);
        }
        this.listaAdicionadosAct.deleteAll();
        this.listaEliminadosAct.deleteAll();
        return param;
    },

    eliminarFallasDelMedio: function () {
        this.getStorePrincipal().removeAll();
    },
    setIdMedio: function (idproducto) {
        this.idproducto = idproducto;
    },
    limpiarListas: function () {
        //this.listaAdicionados.deleteAll();
        //this.listaEliminados.deleteAll();
    },
    render: function () {
        var vista = LOG.tall.citas.GridActividades.superclass.render.call(this);
        vista.addEvents('addedservicios');
        vista.addEvents('deletedservicios');
        this.storePrincipal.on('add', function (st, records, index) {
            vista.fireEvent('addedservicios', st, records, index);
        });
        this.storePrincipal.on('remove', function (st, record, index) {
            vista.fireEvent('deletedservicios', st, record, index);
        });


        this.gpPrincipal.autoExpandColumn = 'denominacionF';
        return vista;
    },
    habilitar: function () {
        this.habilitado = true;
        this.listaBotones.getItem(0).enable();
        this.listaBotones.getItem(1).enable();
    },
    deshabilitar: function () {
        this.habilitado = false;
        this.listaBotones.getItem(0).disable();
        this.listaBotones.getItem(1).disable();
    },

});

LOG.tall.citas.GridMedios = Ext.extend(LOG.util.UITemplate, {
    idexcluir: undefined,
    identidad: undefined,
    idindicador: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.autoLoad = false;
        this.panelBotonesVisible = false;
        this.busquedaBasica = true;
        this.modoSeleccion = 1;
        config.urlBusquedaGridPrincipal = '/logistica/activos_fijos/utiles/index.php/gestregnumerico/getCargarEnviadosATaller';
        // config.urlBusquedaGridPrincipal = '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarGridClasificador';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.citas.Idioma);
        LOG.tall.citas.GridMedios.superclass.constructor.call(this, config);

        this.getVistaPrincipal().title = 'Seleccionar el medio';
        this.getVistaPrincipal().width = 600;
        this.getVistaPrincipal().height = 400;
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().listaBotones.getItem(1).setVisible(false);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'denominacion',
            id: 'denominacionM',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgMarca,
            dataIndex: 'marca',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgModelo,
            dataIndex: 'modelo',
            //default: true
        });

    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.citas.GridMedios.superclass.render.call(this);
        this.storePrincipal.on('beforeload', function (st) {
            st.initBaseParams = { idestructura: _this.identidad, idindicador: _this.idindicador };
        });
        this.gpPrincipal.autoExpandColumn = 'denominacionM';
        return vista;
    }
});

LOG.tall.citas.GridListPiezasDisp = Ext.extend(LOG.util.UITemplate, {
    /**
     * Prototipo de los record a crear
     */
    topicRecord: undefined,
    /**
     * lista de servicios para cargar las piezas disponibles
     */
    listaServicios: undefined,
    /**
     * lista de piezas eliminados
     */
    listaEliminados: undefined,
    /**
     * lista de piezas adicionadas
     */
    listaAdicionadosPiezas: undefined,
    /**
     * id producto seleccionado
     */
    idproducto: undefined,
    /*id servicio seleccionado*/
    idactividad: undefined,
    /**
     * true permite que se habiliten los componentes para modificar, false : no
     * */
    habilitado: true,
    _parent: undefined,
    botonSalvar: undefined,
    depositos: undefined,
    prodAlmacenados: undefined,
    idcita: undefined,
    pruneModifiedRecords: true,
    constructor: function (config) {
        this.gridEditable = true;
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.autoSelect = false;
        this.panelBotonesVisible = true;
        this.busquedaBasica = true;
        this.modoSeleccion = 3;
        this.listaServicios = new LOG.util.List();
        this.listaAdicionadosPiezas = new LOG.util.List();
        this.listaEliminados = new LOG.util.List();
        this.dirController = '/logistica/talleres/citas/index.php/citastalleres';
        // config.urlBusquedaGridPrincipal = 'cargarCitas';
        config.urlBusquedaGridPrincipal = 'cargarPiezasDisp';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.citas.Idioma);
        this.concepto = this.idioma.lbPiezas;
        this.textBusquedaSimple = this.idioma.cgPiezas;
        this.topicRecord = Ext.data.Record.create([
            { name: 'idpieza' },
            { name: 'codigo' },
            { name: 'denominacion' },
            { name: 'umedida' },
            { name: 'disponibilidad' },
            { name: 'idtipoprecio' }
        ]);
        LOG.tall.citas.GridListPiezasDisp.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'idpiezadispcita',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idproducto',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            dataIndex: 'codigo',
            width: 80,
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCodigoProveedor,
            dataIndex: 'codigoproveedor',
            width: 80,
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'denominacion',
            id: 'denominacionF',
            width: 100,
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgUM,
            dataIndex: 'umedida',
            width: 50,
            //default: true
        });
        this.addGridColumn({
            header: 'Cantidad',
            width: 60,
            dataIndex: 'cantidad',
            align: 'right',
            default: true,
            editor: LOG.util.Prototipos.inputEntero({
                allowBlank: false,
            })
        });
        var cod = (this.monedaContable) ? this.monedaContable : "";
        this.addGridColumn({
            dataIndex: 'precioventa',
            align: 'right',
            header: this.idioma.cgPrecio,
            width: 70,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        var codAlt = (this.monedaContable) ? this.monedaContable : "";
        this.addGridColumn({
            dataIndex: 'importe',
            align: 'right',
            header: this.idioma.cgImporte,
            width: 60,
            // hidden: ocultar,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        /*var ocultar = (monedaAlternativa && monedaAlternativa != '') ? false : true;
        var codAlt = (monedaAlternativa && monedaAlternativa != '') ? monedaAlternativa : "";
        this.addGridColumn({
            dataIndex: 'precioalternativo',
            align: 'right',
            header: this.idioma.cgPrecio + " " + codAlt,
            width: 100,
            hidden: ocultar,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        this.addGridColumn({
            dataIndex: 'importealternativo',
            align: 'right',
            header: this.idioma.cgImporte + " " + codAlt,
            width: 120,
            hidden: ocultar,
            renderer: function (v) {
                return Ext.util.Format.number(v, '0,000.00');
            }
        });*/

        this.addGridColumn({
            header: "Existencia",
            dataIndex: 'existencia',
            width: 70
        });
        this.addGridColumn({
            header: this.idioma.cgDisponibilidad,
            dataIndex: 'disponible',
            width: 70,
            renderer: function (value, metaData) {
                if (value > 0) {
                    metaData.css = 'icondistra-aceptar verde';
                } else {
                    metaData.css = 'icondistra-aceptar rojo';
                }

            }
            //default: true
        });

        this.addGridColumn({
            header: this.idioma.cgDocgenerado,
            dataIndex: 'pedgenerado',
            width: 80
            //default: true
        });
        this.checkCapacidadLiquida = new LOG.grid.CheckColumn({
            header: this.idioma.cgCapacidadLiquida,
            dataIndex: 'capacidadliquida',
            align: 'center',
            rowSelection: true,
            value: false
        });
        this.addGridColumn(this.checkCapacidadLiquida);
        this.addGridPlugin(this.checkCapacidadLiquida);
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: "Piezas",
            iconCls: 'nuevo',
            isContextual: true,
            tooltip: "Piezas disponibles",
            menu: [
                new Ext.menu.Item({
                    text: "Productos",
                    iconCls: 'adicionar',
                    handler: function () {
                        if (comboTiposPrecioPiezas.getValue()) {
                            this.prodAlmacenados = false;
                            let idseleccionados = new Array();
                            _this.getSmPrincipal().selectAll();
                            let allRecord = _this.getSmPrincipal().getSelections();
                            Ext.each(allRecord, function (a, index) {
                                if (!a.json) {
                                    idseleccionados.push(a.data.idindicador);
                                } else {
                                    idseleccionados.push(a.id);
                                }
                            });
                            var params = {
                                producto: 1,
                                idseleccionados: idseleccionados
                                /* explotacion: 1*/
                                /*servicio: 0,*/

                            };
                            LOG.inv.maestroproductos.Loader.init(function () {
                                _this.winProdServ = new LOG.lb.maestroproductos.UIProductos({
                                    tipo: 1,
                                    width: 750,
                                    height: 350,
                                    usarAplicar: true,
                                    usarMarcaModelo: true,
                                    usarCodigoAutogenerado: true,
                                    modoSeleccion: 3,
                                    showArbol: false,
                                    parametros: params,
                                    doAction: function (recordsSeleccionados, e) {
                                        var indObj = new Array();
                                        if (recordsSeleccionados != null && recordsSeleccionados.length > 0)
                                            Ext.each(recordsSeleccionados, function (r) {
                                                var myNewRecord = new _this.topicRecord({
                                                    idindicador: r.data.idindicador,
                                                    codigo: r.json.codigo,
                                                    codigoproveedor: r.json.codigoproveedor,
                                                    denominacion: r.data.denominacion,
                                                    umedida: r.json.umedida,
                                                    precioventa: r.data.precio,
                                                    disponible: 0,
                                                    capacidadliquida: 0/*,
                                            decimales: r.json.decimales*/
                                                });
                                                _this.getStorePrincipal().add(myNewRecord);
                                                _this.listaAdicionadosPiezas.add(r);
                                            });
                                        indObj.push(recordsSeleccionados.map(indObj => +indObj.id));
                                        //botonSalvar.enable();
                                    }
                                });
                                _this.winProdServ.show();
                                _this.getSmPrincipal().clearSelections();

                            });
                        } else mostrarMensaje(2, 'Debe seleccionar el tipo de precio a utilizar.');
                    }
                }),
                new Ext.menu.Item({
                    text: "Productos almacenados",
                    iconCls: 'adicionar',
                    handler: function () {
                        if (comboTiposPrecioPiezas.getValue()) {
                            this.prodAlmacenados = true;
                            _this.showWindowProductoAlm();
                        } else mostrarMensaje(2, 'Debe seleccionar el tipo de precio a utilizar.');
                    }
                })
            ],
            controlFn: function (b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this._parent.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    if (!_this._parent.record || (_this._parent.record && _this._parent.record.data.estado == "1")) {
                        b.enable();
                    }
                } else {
                    b.setVisible(false);
                }
            }
        }));

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            iconCls: 'eliminar',
            text: LOG.util.Idioma.lbBtnEliminar,
            tooltip: this.idioma.ttBtnEliminarPieza,
            isContextual: true,
            handler: function () {
                if (_this.getSmPrincipal().hasSelection()) {
                    if (_this.getSmPrincipal().hasSelection()) {
                        mostrarMensaje(2, _this.idioma.msgEliminarPieza, function (btn) {
                            if (btn == 'ok') {
                                Ext.each(_this.getSmPrincipal().getSelections(), function (r) {
                                    if (r.data.idindicador) {
                                        _this.listaEliminados.add(r.data.idindicador);
                                    }
                                    _this.getStorePrincipal().remove(r);
                                });
                                botonSalvar.enable();
                            }
                        });
                    }
                }
            },
            controlFn: function (b, _caller) {
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RCRUD') || _this._parent.grantedAction('REliminar')) {
                    b.setVisible(true);
                    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0 && (_this._parent.record && _this._parent.record.data.estado == "1")) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.addToolbarButton(LOG.util.UIManager.createBtn({
            tooltip: this.idioma.ttBtnAdicionarServicios,
            iconCls: 'modificar',
            text: 'Sustituta(s)',
            handler: function () {

                if (_this.getSmPrincipal().hasSelection()) {
                    mostrarMensaje(2, _this.idioma.msgSustituirPieza, function (btn) {
                        if (btn == 'ok') {

                            this.viejas = _this.getSmPrincipal().getSelections();
                            _this.getStorePrincipal().remove(this.viejas);
                            Ext.each(this.viejas, function (r) {
                                if (r.data.idindicador) {
                                    _this.listaEliminados.add(r.data.idindicador);
                                }
                                _this.getStorePrincipal().remove(r);
                            });
                            var params = {
                                producto: 1,
                                servicio: 0
                            };
                            LOG.inv.maestroproductos.Loader.init(function () {
                                _this.winProdServ = new LOG.lb.maestroproductos.UIProductos({
                                    tipo: 1,
                                    width: 750,
                                    height: 350,
                                    usarAplicar: false,
                                    usarMarcaModelo: true,
                                    modoSeleccion: 3,
                                    showArbol: false,
                                    parametros: params,
                                    doAction: function (recordsSeleccionados, e) {
                                        var indObj = new Array();
                                        if (recordsSeleccionados != null && recordsSeleccionados.length > 0)
                                            Ext.each(recordsSeleccionados, function (r) {
                                                var myNewRecord = new _this.topicRecord({
                                                    codigo: r.json.codigo,
                                                    denominacion: r.data.denominacion,
                                                    umedida: r.json.umedida
                                                });

                                                _this.getStorePrincipal().add(myNewRecord);
                                                _this.listaAdicionadosPiezas.add(r);
                                            });
                                        indObj.push(recordsSeleccionados.map(indObj => +indObj.id)
                                        )
                                            ;
                                        // _this.addIndicadores(indObj[0]);
                                        Ext.MessageBox.wait(_this.idioma.msgSustituyendopieza, _this.idioma.msgEspere || '...');
                                        Ext.MessageBox.hide();
                                        mostrarMensaje(1, _this.idioma.msgPiezaSustituida);
                                    }
                                });
                                _this.winProdServ.show();
                            });

                        }

                    });
                }

            },
            controlFn: function (b, _caller) {

                /*_caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect' && _this.habilitado) {
                        b.enable();
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                });*/
                if (_this._parent.grantedAction('CT') || _this._parent.grantedAction('RCRUD') || _this._parent.grantedAction('RAdicionar')) {
                    b.setVisible(true);
                    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0 && (_this._parent.record && _this._parent.record.data.estado == "1")) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }));

        this.addToolbarButton(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnGenerarPedidos,
            tooltip:  this.idioma.ttBtnGenerarPedidos,
            iconCls: 'generadorreportes',
            disabled: true,
            handler: function () {
                mostrarMensaje(2, _this.idioma.msgGenerarPedido, function (btn) {
                    if (btn == 'ok') {
                        _this.getVistaPrincipal().fireEvent('addpedido', [_this.getSmPrincipal().getSelections()]);
                    }
                });
            },
            controlFn: function (b, _caller) {
                if (_this._parent.grantedAction('RGPedidoCita') /*&& false*/) { //quitar el false para que se valide por recurso
                    b.setVisible(true);
                    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() > 0 && (_this._parent.record && _this._parent.record.data.estado == "3")) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                } else {
                    b.setVisible(false);
                }
            }
        }));

        // if ( _this.parent.grantedAction('RPIEZAS')) {
        this.addToolbarButton(chbReservP = new Ext.form.Checkbox({
            name: 'reservar',
            boxLabel: _this.idioma.cgReservarP,
            height: 27,
            tipo: 2,
            style: 'margin-left:10%;',
            labelSeparator: ':',
            listeners: {
                check: function (ch, valor) {
                    if (valor) {
                        campoDias.enable();
                    } else {
                        campoDias.disable();
                    }
                }
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('RPIEZAS')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }
            }
        }));
        this.addToolbarButton(campoDias = new LOG.util.Prototipos.inputEntero({
            name: 'dias',
            disabled: true,
            width: 80,
            minLength: 1,
            hidden: true,
            validarEnFormBasico: true,
            style: 'margin-left:18%;',
            maxLength: 150,
            maskRe: LOG.util.Regex.cadena,
            listeners: {
                change: function (cb, st) {

                    /*if (_this.datosLimpios())
                        _this.btnNuevo.disable();
                    else
                        _this.btnNuevo.enable();*/
                }
            },
            controlFn: function (b, _caller) {
                if (_this.grantedAction('RPIEZAS')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }
            }

        }));
        // }

        this.addToolbarButton('->');
        this.addToolbarButton(this.idioma.lbTipoPrecio + ':');
        this.addToolbarButton(comboTiposPrecioPiezas = new LOG.util.ComboBox({
            fieldLabel: 'Tipo de precio',
            name: 'idtipoprecio',
            autoLoad: false,
            url: '/logistica/talleres/citas/index.php/citastalleres/cargarTiposDePrecioPiezas',
            displayField: 'denominacion',
            allowblank: false,
            valueField: 'idtipoprecio',
            queryParam: 'criterio',
            validarEnFormBasico: true,
            mode: 'remote',
            /*minChars: 1,
            pageSize: 15,*/
            // resizable: true,
            listeners: {
                select: function (cb, recordS) {
                    /*   var btnAddAct = _this.gridActividades.listaBotones.getItem(0);
                       btnAddAct.controlFn(btnAddAct, _this.gridActividades);
                       if (_this.datosLimpios())
                           _this.btnSalvar.disable();
                       else
                           _this.btnSalvar.enable();*/

                }

            }
        }));
        comboTiposPrecioPiezas.store.on({
            beforeload: function (st, obj) {
                //obj.params.idcliente = _this.idcliente;
                obj.params.tipo = 1;
                /*if (idcliente) {
                    obj.params.idcliente = idcliente;

                }*/
            },
            load: function (st, records) {
                comboTiposPrecioPiezas.setValue(comboTiposPrecioPiezas.getValue());
            }
        });
    },
    salvarPiezasDisp: function () {
        var _this = this;
        var allRecord = this.getStorePrincipal().getModifiedRecords();

        Ext.each(allRecord, function(rec) {
            _this.listaAdicionadosPiezas.each(function (e, pos) {
                if (e.id === rec.data.idindicador || e.data.idproducto === rec.data.idproducto) {
                    e.data.cantidad = rec.data.cantidad;
                    e.data.capacidadliquida = rec.data.capacidadliquida;
                }
            });
            if (rec.data.idpiezadispcita != null) {
                _this.listaAdicionadosPiezas.add(rec);
            }
        });

        let PiezasAdd = new Array();
        this.listaAdicionadosPiezas.each(function (element, pos) {
            PiezasAdd[pos] = element.data;
        });

        var param = {};
        if (campoDias.getValue()) {
            var dias = campoDias.getValue();
            param['reservarpiezas'] = Ext.decode(dias);
        }
        if (comboTiposPrecioPiezas.getValue()) {
            var idtipopreciopiezas = comboTiposPrecioPiezas.getValue();
            param['idtipopreciopiezas'] = Ext.decode(idtipopreciopiezas);
        }
        param['PiezasAdd'] = PiezasAdd;
        param['PiezasElim'] = this.listaEliminados.getArray();
        _this.listaAdicionadosPiezas.deleteAll();
        _this.listaEliminados.deleteAll();
        PiezasAdd = new Array();
        _this.topicRecord = new Ext.data.Record.create({});
        return param;
    },
    eliminarFallasDelMedio: function () {
        this.getStorePrincipal().removeAll();
    },
    setIdMedio: function (idproducto) {
        this.idproducto = idproducto;
    },
    limpiarListas: function () {
        //this.listaAdicionados.deleteAll();
        //this.listaEliminados.deleteAll();
    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.citas.GridListPiezasDisp.superclass.render.call(this);
        vista.addEvents('addedpiezas');
        vista.addEvents('deletedpiezas');
        vista.addEvents('sustituta');
        vista.addEvents('addpedido');
        this.storePrincipal.on('add', function (st, records, index) {
            vista.fireEvent('addedpiezas', st, records, index);
        });
        this.storePrincipal.on('remove', function (st, record, index) {
            vista.fireEvent('deletedpiezas', st, record, index);
        });

       _this.getGridPrincipal().fireEvent = _this.getGridPrincipal().fireEvent.createSequence(function (e, obj) {
           if (e == 'afteredit') {
               _this.habilitarBotones();
            }
        });

        this.getGridPrincipal().on('checkcolumn', function (e) {
            _this.habilitarBotones();
        }, this);

        this.gpPrincipal.autoExpandColumn = 'denominacionF';
        return vista;
    },
    habilitar: function () {
        this.habilitado = true;
        this.listaBotones.getItem(0).enable();
        this.listaBotones.getItem(1).enable();
        this.listaBotones.getItem(2).enable();
        this.listaBotones.getItem(3).enable();
    },
    deshabilitar: function () {
        this.habilitado = false;
        this.listaBotones.getItem(0).disable();
        this.listaBotones.getItem(1).disable();
        this.listaBotones.getItem(2).disable();
        this.listaBotones.getItem(3).disable();
    },
    addIndicadores: function (arrIndicadores) {
        var objSubmit = {};
        var _this = this;
        Ext.MessageBox.wait('Guardando los datos', this.idioma.msgEspere || '...');
        var idActividad = _this.scope.panelGridServActividades.getGridPrincipal().getSelectionModel().getSelections()[0].data.idactividad;
        objSubmit.listaindicadores = Ext.encode(arrIndicadores);
        objSubmit.idactividad = idActividad;
        Ext.Ajax.request({
            url: '/logistica/talleres/configuracion/index.php/configuracionactividades/adicionarNormas',
            method: 'POST',
            /* params: {

                 idIndicadores: Ext.encode(arrIndicadores),
                 idActividad: idActividad
             },*/
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.success) {
                    _this.getStorePrincipal().load();
                    mostrarMensaje(1, "Las normas han sido guardadas satisfactoriamente.");
                } else {
                    mostrarMensaje(3, "Ha ocurrido un error mientras se guardaban las normas.");
                }
            }.createDelegate(this)
        });
    },
    onReload: function (idservicio) {
        var _this = this;
        _this.listaServicios.add(idservicio);
        var storePiezasDisp = new Ext.data.Store({
            url: '/logistica/talleres/citas/index.php/citastalleres/cargarPiezasDisp',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idservicio'
            }, [
                { name: 'codigo' },
                { name: 'denominacion' },
                { name: 'umedida' },
                { name: 'disponibilidad' }
            ])
        });
        storePiezasDisp.load({
            params: { idservicio: idservicio }
            , callback: function (res) {
                var record = res[0];
            }
        });
        // _this.vistaPrincipal.reload();


    },
    showWindowProductoAlm: function () {
        var _this = this;
        var idseleccionados = [];
        var parametros = {};
        parametros.iddocumento = null;
        this.getSmPrincipal().selectAll();
        let allRecord = this.getSmPrincipal().getSelections();
        Ext.each(allRecord, function (rm, index) {
            if (rm.data.idproducto != "")
                idseleccionados.push(rm.data.idproducto);
        });

        parametros.tipo = 1;
        parametros.idseleccionados = Ext.encode(idseleccionados);
        parametros.idestructura = Ext.encode(depositos);
        parametros.conexistencia = 0;
        parametros.condisponible = 0;
        var configProd = {
            idioma: _this.idioma,
            _parent: _this,
            usarFiltroArea: false,
            usarAplicar: true,
            parametros: parametros,
            usarFiltroDeposito: true,
            autoLoad: true,
            usarComboNomenclador: false,
            doAction: function (r) {

                var disponible = true;

                Ext.each(r, function (rec) {
                    if (rec.json.disponible < 0) {
                        disponible = false;
                    }
                    let MyNewRecord = new _this.topicRecord({
                        idindicador: rec.data.idindicador,
                        codigo: rec.data.codigo,
                        codigoproveedor: rec.data.codigoproveedor,
                        denominacion: rec.data.denominacion,
                        umedida: rec.data.umedida,
                        precioventa: rec.data.precio,
                        existencia: rec.data.existencia,
                        disponible: rec.data.disponible,
                        importe: rec.json.importetotal,
                        idproducto: rec.data.idproducto,
                        /*decimales: rec.data.decimales,*/
                        capacidadliquida: 0
                    });
                    _this.getStorePrincipal().add(MyNewRecord);
                    _this.listaAdicionadosPiezas.add(rec);
                });
                //botonSalvar.enable();
            }
        };

        _this.p = new LOG.lb.documento.VentanaProductos(configProd);
        _this.p.init();
        _this.vistaProductos = _this.p.view();
        _this.vistaProductos.show();
        _this.getSmPrincipal().clearSelections();


    },
    habilitarBotones: function () {
        var _this = this;
        if (_this.getGridPrincipal().getSelectionModel().hasSelection()) {
            _this._parent.listaBotones.arrayData[0].enable();
        }
    }
});

LOG.tall.citas.GridSelectMateriales = Ext.extend(LOG.util.UITemplate, {
    /**
     * ids de materiales ya seleccionados
     */
    idsMateriales: undefined,
    idTipoPrecio: undefined,
    idCliente: undefined,
    integrarFac: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.autoLoad = false;
        this.autoSelect = false;
        this.panelBotonesVisible = false;
        this.busquedaBasica = true;
        this.dirController = '/logistica/talleres/citas/index.php/citastalleres';
        config.urlBusquedaGridPrincipal = 'cargarMaterialesExistentes';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.citas.Idioma);
        this.concepto = this.idioma.lbMaterial;
        this.textBusquedaSimple = this.idioma.cgCodigo + ' o ' + this.idioma.cgDenominacion;
        LOG.tall.citas.GridSelectMateriales.superclass.constructor.call(this, config);

        this.getVistaPrincipal().title = this.idioma.tlMateriales;
        this.getVistaPrincipal().width = 800;
        this.getVistaPrincipal().height = 450;
        this.getVistaPrincipal().constrain = true;
        this.getVistaPrincipal().resizable = false;
        //this.getVistaPrincipal().listaBotones.getItem(1).setVisible(false);

    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'cantplanif',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'codigo',
            header: this.idioma.cgCodigo,
            width: 80,
            filter:
            {
                type: 'string',
                dataIndex: 'codigo'
            }
        });
        this.addGridColumn({
            dataIndex: 'codigoproveedor',
            header: this.idioma.cgCodigoProveedor,
            width: 100,
            filter:
            {
                type: 'string',
                dataIndex: 'codigoproveedor'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'denominacion',
            //id:'denominacionSM',
            width: 200,
            default: true,
            filter:
            {
                type: 'string',
                dataIndex: 'denominacion'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgUM,
            dataIndex: 'denominacionunidadmedida',
            width: 60
        });
        this.addGridColumn({
            header: 'Dep\xf3sito',
            dataIndex: 'deposito',
            width: 220,
            filter:
            {
                type: 'string',
                dataIndex: 'deposito'
            }
        });
        this.addGridColumn({
            dataIndex: 'iddeposito'
        });
        this.addGridColumn({
            dataIndex: 'idpodructo'
        });
        this.addGridColumn({
            dataIndex: 'disponible',
            header: this.idioma.cgCantidadDisponible,
            width: 90,
            //default: true
        });
        this.addGridColumn({
            dataIndex: 'precioventa',
            header: this.idioma.cgPrecio,
            width: 90,
            renderer: function (val, x, record) {
                if (val <= 0) {
                    return '<span style="color:red;">' + '-' + '</span>';
                }
                return val;
            }
            //default: true
        });
        this.addGridColumn({
            dataIndex: 'precioalternativo',
            header: this.idioma.cgPrecio + ' alternativo',
            width: 90,
            renderer: function (val) {
                if (val <= 0)
                    return "-";
                return val;
            }
            //default: true
        });
        this.addGridColumn({
            dataIndex: 'idunidadmedida',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'datosmoneda',
            hidden: true
        });
    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.citas.GridSelectMateriales.superclass.render.call(this);

        Ext.apply(_this.gpPrincipal, {
            viewConfig: {
                getRowClass: function (rec, index, rowParams, store) {
                    if (rec.data.precioventa <= 0) {
                        return 'redrow-text';
                    }
                }
            }
        });
        //this.getStorePrincipal().initBaseParams.idnaturaleza = naturalezaPPA;
        vista.listaBotones.getItem(2).disable();
        vista.listaBotones.getItem(1).disable();
        this.storePrincipal.on(
            {
                'load': function (store, records) {
                    if (store.getCount() == 0) {
                        vista.listaBotones.getItem(2).disable();
                        vista.listaBotones.getItem(1).disable();
                        mostrarMensaje(1, _this.idioma.msjNoExistenMaterial);
                    }
                },
                beforeload: function (st, obj) {
                    obj.params.idtipoprecio = _this.idTipoPrecio;
                    obj.params.idcliente = _this.idCliente;
                    obj.params.integrarfacturacion = _this.integrarFac;
                    var excluir = "-1";
                    Ext.each(_this.idsMateriales, function (v) {
                        excluir += ", " + v;
                    });
                    obj.params.excluir = excluir;
                }
            });
        this.getSmPrincipal().on({
            'rowselect': function (sm) {
                vista.listaBotones.getItem(2).enable();
                vista.listaBotones.getItem(1).enable();
            },
            'rowdeselect': function (sm) {

                if (this.getSelections().length == 0) {
                    vista.listaBotones.getItem(2).disable();
                    vista.listaBotones.getItem(1).disable();
                }
            }

        });
        //this.gpPrincipal.autoExpandColumn = 'denominacionSM';

        return vista;
    }
});

LOG.tall.citas.GridSelectActividades = Ext.extend(LOG.util.UITemplate, {
    /**
     * identificador del producto para obtener sus tipos de servicios
     */
    idproducto: undefined,
    /**
     * array de ids de actividades ya seleccionadas
     */
    idexcluir: undefined,
    idservicio: undefined,
    idactividad: undefined,
    idcliente: undefined,
    idindicador: undefined,
    todo: 0,
    idtipoprecio: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.autoLoad = false;
        this.autoSelect = false;
        this.panelBotonesVisible = true;
        this.busquedaBasica = true;
        this.modoSeleccion = 3;
        this.dirController = '/logistica/talleres/citas/index.php/citastalleres';
        config.urlBusquedaGridPrincipal = 'cargarActividadesExistentes';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.citas.Idioma);
        this.concepto = this.idioma.lbActividades;
        this.textBusquedaSimple = this.idioma.cgServicios;
        LOG.tall.citas.GridSelectActividades.superclass.constructor.call(this, config);

        this.getVistaPrincipal().title = this.idioma.tlAdicionarActividades;
        this.getVistaPrincipal().width = 600;
        this.getVistaPrincipal().height = 400;
        this.getVistaPrincipal().constrain = true;
        this.getVistaPrincipal().resizable = false;
        // this.getVistaPrincipal().listaBotones.getItem(1).setVisible(false);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            hidden: true,
            dataIndex: 'idindicador'
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 90,
            dataIndex: 'denominacion',
            default: true,
            autoExpand: true,

        });
        this.addGridColumn({
            header: 'C\xf3digo',
            width: 90,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            hidden: true,
            header: 'C\xf3digo del proveedor',
            width: 90,
            dataIndex: 'codigoproveedor',
            default: true
        });
        this.addGridColumn({
            header: 'UM',
            hidden: true,
            width: 50,
            dataIndex: 'umedida',
            default: true,
            allowBlank: false,
            /*editor: new LOG.util.ComboBox({
                hiddenName: 'umedida',
                valueField: 'idumedida',
                displayField: 'denominacion',
                editable: false,
                mode: 'local',
                minChars: 1,
                store: new Ext.data.SimpleStore({
                    fields: ['um', 'denominacion'],
                    data: [
                        ['s','segundo'],
                        ['min', 'minuto'],
                        ['hs', 'hora'],
                        ['d', 'dia'],
                        ['sem', 'semana'],
                        ['m', 'mes'],
                        ['a', 'año']
                    ]
                }),
                getXType:function(){
                    return 'combobox';
                }})*/
        });
        this.addGridColumn({
            header: 'Tiempo (h)',
            width: 80,
            dataIndex: 'duracion',
            align: 'right',
            default: true,
            /*  editor: LOG.util.Prototipos.inputEntero({
                  allowBlank: false,
              })*/
        });
        this.addGridColumn({
            header: 'Importe',
            dataIndex: 'costo',
            width: 50,
            default: true
        });
//        this.addGridColumn({
//            header: 'Importe CUC',
//            dataIndex: 'importealternativo',
//            width: 50,
//            default: true
//        });

    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(new Ext.Button({
            tooltip: 'Mostrar todas las actividades',
            iconCls: 'mostrar',
            text: 'Mostrar todas',
            handler: function () {
                _this.todo = 1;
                _this.getStorePrincipal().load({ params: { todo: 1 } });
            }
        }));
    },
    render: function () {
        var _this = this;

        var vista = LOG.tall.citas.GridSelectActividades.superclass.render.call(this);
        this.storePrincipal.on({
            'beforeload': function (st) {
                st.initBaseParams = {
                    idservicio: Ext.encode(_this.idservicio),
                    hijos: 1,
                    nivel: 4,
                    todo: this.todo,
                    excluir: Ext.encode(_this.idexcluir),
                    integrarFac: true,
                    idtipoprecio: Ext.encode(_this.idtipoprecio),
                    idcliente: Ext.encode(_this.idcliente)
                };
                vista.listaBotones.getItem(2).disable();
            }
        });
        this.gpPrincipal.autoExpandColumn = 'denominacion';
        vista.listaBotones.getItem(2).disable();
        this.getGridPrincipal().getSelectionModel().fireEvent = this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
            if (e == 'rowselect') {
                if (_this.getGridPrincipal().getSelectionModel().getSelected()) {
                    vista.listaBotones.getItem(2).enable();
                }
            }
            if (e == 'rowdeselect') {
                vista.listaBotones.getItem(2).disable();
            }
        });
        return vista;
    }
});

/**
 * Ventana para seleccionar el medio de las citas.
 */

LOG.tall.citas.VentanaSelecionMedio = Ext.extend(LOG.util.Window, {
    idioma: undefined,
    panelGeneral: undefined,
    tabPanelGeneral: undefined,
    isAFT: undefined,
    usarNomencladorProducto: true,
    usarAFTTall: true,
    usarTallAFT: true,
    idestructura: undefined,
    busquedaAvanzadaAFT: false,
    constructor: function (config) {
        this.usarAplicar = false;
        this.resizable = false;
        LOG.tall.citas.VentanaSelecionMedio.superclass.constructor.call(this, config);
        this.listaBotones.getItem(2).disable();

    },
    initComponent: function () {
        var _this = this;
        LOG.tall.citas.VentanaSelecionMedio.superclass.initComponent.call(this);
        this.panelGeneral = new LOG.util.Panel({
            frame: true,
            region: 'center'
        });
        this.tabPanelGeneral = new LOG.util.UITabTemplate({
            idioma: _this.idioma,
            formaVisualizacion: 'panel'
        });
        // if (this.usarNomencladorProducto) {
        this.tab1 = new LOG.tall.citas.GridIndicadores({
            idioma: _this.idioma,
            title: 'Vehiculos registrados',
            height: 200
        });
        this.tabPanelGeneral.addTabToTemplete(this.tab1);
        // }
        // if (this.isAFT) {
        if (this.usarAFTTall) {
            this.tab2 = new LOG.tall.citas.GridActivosFijos({
                idioma: _this.idioma,
                title: 'Enviados al taller',
                height: 200,
                textBusquedaSimple: 'denominaci\xf3n',
                identificador: "aft",
                idestructura: _this.idestructura,
                busquedaAvanzadaAFT: _this.busquedaAvanzadaAFT
            });
            this.tabPanelGeneral.addTabToTemplete(this.tab2);
            this.tab4 = new LOG.tall.citas.GridActivosFijosMantenimiento({
                idioma: _this.idioma,
                title: 'Mantenimiento',
                height: 200,
                textBusquedaSimple: 'denominaci\xf3n',
                identificador: "aft",
                idestructura: _this.idestructura,
                busquedaAvanzadaAFT: _this.busquedaAvanzadaAFT
            });
            this.tabPanelGeneral.addTabToTemplete(this.tab4);
        }
        if (this.usarTallAFT) {
            this.tab3 = new LOG.tall.citas.GridActivosFijos({
                idioma: _this.idioma,
                title: 'Activos fijos tangibles',
                height: 200,
                textBusquedaSimple: 'Identificador',
                identificador: "tallaft",
                idComponent: 'tallaft',
                idestructura: _this.idestructura,
                busquedaBasica: true,
                busquedaAvanzadaAFT: _this.busquedaAvanzadaAFT
            });
            this.tabPanelGeneral.addTabToTemplete(this.tab3);
        }
        // }

        this.tabPanelGeneral.init();
        var x = this.tabPanelGeneral.view();
        if (this.tab3) {
            this.tab3.on({
                'adicionarmedio': function () {
                    _this.aceptarFn();
                    _this.close();
                }
            });
        }
        x.height = 350;
        x.width = 830;
        x.frame = false;
        this.panelGeneral.add(x);
        this.add(this.panelGeneral);
        this.tabPanelGeneral.on({
            tabchange: function (p) {
                if (_this.tabPanelGeneral.getActiveTemplate().getStorePrincipal().getCount() == 0) {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() != 'tallaft')
                        _this.tabPanelGeneral.getActiveTemplate().getStorePrincipal().load();
                }
                if (_this.tabPanelGeneral.getActiveTemplate().getSmPrincipal().hasSelection()) {
                    _this.listaBotones.getItem(2).enable();
                } else _this.listaBotones.getItem(2).disable();
            }
        })
    },
    validacionBtn: function () {
        var _this = this;
        // if (this.isAFT) {
        if (this.tab2) {
            this.tab2.getSmPrincipal().on({
                rowselect: function () {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'aft') {
                        _this.listaBotones.getItem(2).enable()
                    }
                },
                rowdeselect: function () {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'aft') {
                        _this.listaBotones.getItem(2).disable();
                    }
                }
            });
            this.tab2.getStorePrincipal().on({
                load: function (st) {
                    if (st.getCount() == 0) {
                        _this.listaBotones.getItem(2).disable();
                    }
                }
            })
        }
        if (this.tab4) {
            this.tab4.getSmPrincipal().on({
                rowselect: function () {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'aft') {
                        _this.listaBotones.getItem(2).enable()
                    }
                },
                rowdeselect: function () {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'aft') {
                        _this.listaBotones.getItem(2).disable();
                    }
                },
            });
            this.tab4.getStorePrincipal().on({
                load: function (st) {
                    if (st.getCount() == 0) {
                        _this.listaBotones.getItem(2).disable();
                    }
                }
            })

        }
        if (this.tab3) {
            this.tab3.getSmPrincipal().on({
                rowselect: function () {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'tallaft') {
                        _this.listaBotones.getItem(2).enable()
                    }
                },
                rowdeselect: function () {
                    if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'tallaft') {
                        _this.listaBotones.getItem(2).disable();
                    }
                }
            });
            this.tab3.getStorePrincipal().on({
                load: function (st) {
                    if (st.getCount() == 0) {
                        _this.listaBotones.getItem(2).disable();
                    }
                }
            })
        }
        // }
        // if (this.usarNomencladorProducto) {
        this.tab1.getSmPrincipal().on({
            rowselect: function () {
                if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'indicadores') {
                    _this.listaBotones.getItem(2).enable();
                }
            },
            rowdeselect: function () {
                if (_this.tabPanelGeneral.getActiveTemplate().getIdentificador() == 'indicadores') {
                    _this.listaBotones.getItem(2).disable();
                }
            }
        });
        this.tab1.getStorePrincipal().on({
            load: function (st) {
                if (st.getCount() == 0) {
                    _this.listaBotones.getItem(2).disable();
                }
            }
        })
        // }
    }

});

LOG.tall.citas.GridActivosFijosMantenimiento = Ext.extend(LOG.util.UITemplate, {
    idComponent: 'aft',
    identificador: 'aft',
    idestructura: undefined,
    busquedaAvanzadaAFT: false,
    constructor: function (config) {
        this.formaVisualizacion = 'panel',
            this.busquedaBasica = true;
        config.busquedaAvanzada = false;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.panelBotonesVisible = false;
        this.dirController = '/logistica/talleres/citas/index.php/citastalleres';
        this.urlBusquedaGridPrincipal = 'getCargarEnviadosAMantenimiento';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.citas.Idioma);
        this.concepto = this.idioma.lbActivo;
        this.idGridPrincipal = 'idregnumerico';
        LOG.tall.citas.GridActivosFijos.superclass.constructor.call(this, config);
        this.identificador = config.identificador;
        this.addEvents('adicionarmedio');
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idregnumerico',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idpadre',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgMatricula,
            dataIndex: 'nromatricula',
            //default: true,
            hidden: true,
            filter: {
                type: 'string',
                dataIndex: 'nromatricula'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgIndicativo,
            dataIndex: 'indicativo',
            //default: true,
            hidden: true,
            filter:
            {
                type: 'string',
                dataIndex: 'indicativo'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 120,
            hidden: true,
            dataIndex: 'codigo',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 120,
            dataIndex: 'denominacion',
            //default: true,
            id: 'denomAFT'
        });
        this.addGridColumn({
            header: this.idioma.cgNroSerie,
            width: 120,
            dataIndex: 'nroserie',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgNroInventario,
            width: 120,
            dataIndex: 'nroinventario',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgMarca,
            dataIndex: 'marca',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgModelo,
            dataIndex: 'modelo',
            // default: true
        });
    },
    getIdentificador: function () {
        return this.identificador;
    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.citas.GridActivosFijosMantenimiento.superclass.render.call(this);
        //vista.addEvents('adicionarmedio');
        this.getStorePrincipal().on({
            'beforeload': function (store) {
                Ext.apply(store.initBaseParams, {
                    idestructura: _this.idestructura,
                    ventana: _this.getIdentificador()
                });
                if (_this.busquedaAvanzadaAFT) {
                    Ext.apply(store.initBaseParams, { busquedaavanzada: true });
                }
            },
            'load': function (store, records) {
                var matricula = false;
                var indicativo = false;
                Ext.each(records, function (r) {
                    if (r.json.nromatricula) {
                        matricula = true;
                    }
                    if (r.json.indicativo) {
                        indicativo = true;
                    }
                });
                if (matricula) {
                    _this.getGridPrincipal().getColumnModel().setHidden(1, false);
                }
                if (indicativo) {
                    _this.getGridPrincipal().getColumnModel().setHidden(2, false);
                }
                if (_this.getIdentificador() == "tallaft") {
                    if (store.getCount() == 1) {
                        _this.getSmPrincipal().selectFirstRow();
                        _this.fireEvent('adicionarmedio');
                    }
                }
            }
        });
        this.gpPrincipal.autoExpandColumn = 'denomAFT';

        return vista;
    }
});

LOG.tall.citas.GridActivosFijos = Ext.extend(LOG.util.UITemplate, {
    idComponent: 'aft',
    identificador: 'aft',
    idestructura: undefined,
    busquedaAvanzadaAFT: false,
    constructor: function (config) {
        this.formaVisualizacion = 'panel',
            this.busquedaBasica = true;
        config.busquedaAvanzada = false;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.panelBotonesVisible = false;
        this.dirController = '/logistica/talleres/citas/index.php/citastalleres';
        this.urlBusquedaGridPrincipal = 'getCargarEnviadosATaller';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.citas.Idioma);
        this.concepto = this.idioma.lbActivo;
        this.idGridPrincipal = 'idregnumerico';
        LOG.tall.citas.GridActivosFijos.superclass.constructor.call(this, config);
        this.identificador = config.identificador;
        this.addEvents('adicionarmedio');
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idregnumerico',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idpadre',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgMatricula,
            dataIndex: 'nromatricula',
            //default: true,
            hidden: true,
            filter: {
                type: 'string',
                dataIndex: 'nromatricula'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgIndicativo,
            dataIndex: 'indicativo',
            //default: true,
            hidden: true,
            filter:
            {
                type: 'string',
                dataIndex: 'indicativo'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 120,
            hidden: true,
            dataIndex: 'codigo',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 120,
            dataIndex: 'descripcionmarcamodelo',
            //default: true,
            id: 'denomAFT'
        });
        this.addGridColumn({
            header: this.idioma.cgNroSerie,
            width: 120,
            dataIndex: 'nroserie',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgMarca,
            dataIndex: 'marca',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgModelo,
            dataIndex: 'modelo',
            // default: true
        });
    },
    getIdentificador: function () {
        return this.identificador;
    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.citas.GridActivosFijos.superclass.render.call(this);
        //vista.addEvents('adicionarmedio');
        this.getStorePrincipal().on({
            'beforeload': function (store) {
                Ext.apply(store.initBaseParams, {
                    idestructura: _this.idestructura,
                    ventana: _this.getIdentificador()
                });
                if (_this.busquedaAvanzadaAFT) {
                    Ext.apply(store.initBaseParams, { busquedaavanzada: true });
                }
            },
            'load': function (store, records) {
                var matricula = false;
                var indicativo = false;
                Ext.each(records, function (r) {
                    if (r.json.nromatricula) {
                        matricula = true;
                    }
                    if (r.json.indicativo) {
                        indicativo = true;
                    }
                });
                if (matricula) {
                    _this.getGridPrincipal().getColumnModel().setHidden(1, false);
                }
                if (indicativo) {
                    _this.getGridPrincipal().getColumnModel().setHidden(2, false);
                }
                if (_this.getIdentificador() == "tallaft") {
                    if (store.getCount() == 1) {
                        _this.getSmPrincipal().selectFirstRow();
                        _this.fireEvent('adicionarmedio');
                    }
                }
            }
        });
        this.gpPrincipal.autoExpandColumn = 'denomAFT';
        /* if(this.identificador == 'tallaft' ){
             this.textMatricula = new LOG.util.Prototipos.inputTexto({name:'nromatricula'});
             this.textIndicativo = new LOG.util.Prototipos.inputTexto({name:'indicativo'});
             this.btnBuscar = new LOG.util.Prototipos.botonBuscar({
                 text: this.idioma.lbBtnBuscar,
                 tooltip: this.idioma.ttBuscarActivo,
                 scope:this,
                 handler: function() {
                     _this.buscarBtn();
                 }
             });
             this.btnLimpiar = new LOG.util.Prototipos.botonLimpiar({
                 text: this.idioma.lbBtnLimpiar,
                 tooltip: this.idioma.ttBtnLimpiar + ' <b>(Alt+L)</b>',
                 scope:this,
                 handler: function() {
                     _this.limpiarBtn();
                 }
             });
             vista.documentKeyMap = new Ext.KeyMap(document,
                 [
                     {
                         alt: true,
                         ctrl:false,
                         key: 'b',
                         fn: function() {
                             if (vista.isVisible() && (_this.textMatricula.getValue() || _this.textIndicativo.getValue())){
                                 _this.buscarBtn();
                             }

                         }
                     },
                     {
                         alt: true,
                         ctrl:false,
                         key: 'l',
                         fn: function() {
                             if (vista.isVisible()){
                                 _this.limpiarBtn();
                             }

                         }
                     }
                 ]);
             this.gpPrincipal.getTopToolbar().add('-', new Ext.form.Label({text: 'Matricula: '}), this.textMatricula,
                 '-', new Ext.form.Label({text: 'Indicativo: '}), this.textIndicativo, '-', _this.btnBuscar, '-', _this.btnLimpiar);
         }*/
        return vista;
    }
});

LOG.tall.citas.GridIndicadores = Ext.extend(LOG.util.UITemplate, {
    identificador: 'indicadores',
    idComponent: 'indicadores',
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = true;
        this.modoSeleccion = 1;
        this.autoLoad = false;
        this.panelBotonesVisible = false;
        this.dirController = '/logistica/utiles/maestroproductos/index.php/maestroproductos';
        this.urlBusquedaGridPrincipal = 'cargarGridClasificador';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.citas.Idioma);
        this.concepto = this.idioma.lbIndicador;
        LOG.tall.citas.GridIndicadores.superclass.constructor.call(this, config);
        this.textBusquedaSimple = this.idioma.cgCodigo;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idpadre',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 120,
            dataIndex: 'codigo',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 120,
            dataIndex: 'descripcionmarcamodelo',
            //default: true,
            id: 'denomIndicador'
        });
        this.addGridColumn({
            header: this.idioma.cgMarca,
            dataIndex: 'marca',
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgModelo,
            dataIndex: 'modelo',
            //default: true
        });
    },
    getIdentificador: function () {
        return this.identificador;
    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.citas.GridIndicadores.superclass.render.call(this);
        this.getStorePrincipal().initBaseParams.explotacion = 1;
        this.gpPrincipal.autoExpandColumn = 'denomIndicador';
        return vista;
    }
});

LOG.tall.citas.GridDinamicos = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.formaVisualizacion = 'ventana';
        this.autoLoad = false;
        this.autoSelect = false;
        this.panelBotonesVisible = true;
        this.dirController = '/configuracion/nomdinamicos/index.php/nomdinamicos';
        config.urlBusquedaGridPrincipal = 'getvalores';
        this.busquedaBasica = true;
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.tall.citas.Idioma);
        LOG.tall.citas.GridDinamicos.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = this.idioma.tlVentanaSelectAeropuerto;
        this.getVistaPrincipal().width = 600;
        this.getVistaPrincipal().height = 400;
        this.getVistaPrincipal().constrain = true;
        this.getVistaPrincipal().resizable = false;
        this.modoSeleccion = 1;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'id',
            hidden: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            dataIndex: 'mod_datosmaestrosmeta_nom_tnu_3_denominaciontnu_3',
            anchor: '100%',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFechaInicio,
            width: 120,
            dataIndex: 'mod_datosmaestrosmeta_nom_tnu_3_fechainicio',
            hidden: true
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFechaFin,
            width: 120,
            dataIndex: 'mod_datosmaestrosmeta_nom_tnu_3_fechafin',
            hidden: true
            //default: true,
            // id: 'denomIndicador'
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            dataIndex: 'mod_datosmaestrosmeta_nom_tnu_3_num_1',
            //default: true
        });
    },
    render: function () {
        var _this = this;
        var vista = LOG.tall.citas.GridDinamicos.superclass.render.call(this);
        /*  this.storePrincipal.on('load', function (store, records) {

              if (store.getCount() == 0) {
                  mostrarMensaje(1, _this.idioma.msjNoExistenActv);
              }
          });*/
        return vista;
    }
});

