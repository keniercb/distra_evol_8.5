Ext.ns('LOG.farm.tarjetamedicamento');
LOG.farm.tarjetamedicamento.VentanaAdicionar = Ext.extend(LOG.lb.documento.ventanaGestionDocumentos, {
    constructor: function (config) {
        var _this = this;
        this.listaAcciones = new LOG.util.List(config.acciones);
        this.modelo = config.modelo;
        LOG.util.UIManager.apply(config.idioma, LOG.farm.tarjetamedicamento.Idioma);
        LOG.farm.tarjetamedicamento.VentanaAdicionar.superclass.constructor.call(this, config);
        this.idioma = Ext.apply(this.idioma, LOG.farm.tarjetamedicamento.Idioma);
    },
    builComponent: function () {
        this.idioma = this.idioma || LOG.lb.documento.Idioma;
        var _this = this;
        this.guardado = false;
        this.panelSuperior = LOG.util.UIManager.initPanel({
            region: 'center',
            title: this.idioma.tlPanelGeneral,
            frame: true
        });
        this.btnSalvar = LOG.util.Prototipos.botonGuardar({
            tooltip: this.idioma.ttBtnGuardar,
            handler: this.salvarHandler,
            scope: this,
            controlFn: function () {
                _this.controlFnGuardar(_this.btnSalvar);
            }
        });
        this.btnBuscarPaciente = LOG.util.Prototipos.botonBuscar({
            tooltip: 'Buscar datos del paciente',
            text: ' ',
            handler: function () {
                var parametros = {};
                if (_this.textCI.getValue())
                    parametros.cipaciente = _this.textCI.getValue();
                else {
                    mostrarMensaje(2, 'Debe introducir el C.I del paciente.');
                    return;
                }
                _this.modelo.getPaciente(parametros, function (resp) {
                    if (resp[0].yatiene == 0) {
                        _this.textNroCaso.setValue(resp[0].nrocasoindice);
                        _this.textCI.setValue(resp[0].numeroidentidad);
                        _this.textNombre.setValue(resp[0].nombre);
                        _this.textConsultorioMed.setValue(resp[0].consultoriomedico);
                        _this.taDireccion.setValue(resp[0].direccion);
                        _this.comboProvincia.setValue();
                        _this.comboMunicipio.setValue();
                        _this.comboProvincia.store.load({
                            paramas: {}, callback: function () {
                                _this.comboProvincia.setValue(resp[0].idprovincia);
                                _this.comboProvincia.store.load({
                                    params: { idprov: resp[0].idprovincia }, callback: function () {
                                        _this.comboMunicipio.setValue(resp[0].idmunicipio);
                                    }
                                });
                            }
                        });
                        _this.textAreaAtencion.setValue(resp[0].areaatencion);
                        _this.comboSexo.setValue(resp[0].sexo);

                        _this.textCI.fireEvent("keyup");
                        mostrarMensaje(1, resp[0].nombre);

                        _this.btnSalvar.enable();
                    }
                    else mostrarMensaje(1, resp[0].nombre + " ya tiene una tarjeta de medicamento");
                });

            }
        });
        this.formularioGeneral = LOG.util.UIManager.initPanel({
            region: 'center',
            frame: true,
            border: true,
            minHeight: 550,
            height: 550,
            autoHeight: false,
            autoScroll: true
        });

        //Diseño de la ventana
        var superiorIz = LOG.util.UIManager.initColumnForm({
            columnas: 1,
            defaultsAnchor: '100%'
        });

        this.chBRetrovirales = new Ext.form.Checkbox({
            boxLabel: 'Retrovirales',
            name: 'retrovirales',
            listeners: {
                check: function (ch, value) {
                    if (value) {
                        _this.textNroCaso.setValue("");
                        _this.textNroCaso.enable();
                        _this.textCI.allowBlank = true;
                        _this.taDireccion.allowBlank = true;
                        _this.textConsultorioMed.allowBlank = true;
                    }
                    else {
                        _this.textNroCaso.setValue("");
                        _this.textNroCaso.disable();
                        _this.textCI.allowBlank = false;
                        _this.taDireccion.allowBlank = false;
                        _this.textConsultorioMed.allowBlank = false;
                    }
                }
            }
        });
        this.textNroCaso = new Ext.form.TextField({
            fieldLabel: 'Nro. caso \xedndice',
            name: 'nrocasoindice',
            allowBlank: false,
            disabled: true
        });
        this.textCI = LOG.util.Prototipos.inputTexto({
            fieldLabel: (farmacia === 1)? 'cipaciente': 'CI Jefe Núcleo',
            name: 'numeroidentidad',
            regex: LOG.util.Regex.carnet,
            maskRe: /\d/,
            allowBlank: false,
            maxLength: 11,
            minLength: 11
        });
        this.textNombre = LOG.util.Prototipos.inputTexto({
            fieldLabel: 'Nombre y apellidos',
            name: 'nombre',
            regex: LOG.util.Regex.nombre,
            allowBlank: false
        });
        this.textTelefono = LOG.util.Prototipos.inputEntero({
            fieldLabel: 'Tel\xe9fono',
            regex: LOG.util.Regex.digito,
            name: 'telefono'
        });
        this.textCorreo = LOG.util.Prototipos.inputTexto({
            fieldLabel: 'Correo electr\xf3nico',
            regex: LOG.util.Regex.email,
            name: 'correo',
            allowBlank: true
        });
        this.textFechaInscripcion = new Ext.form.DateField({
            fieldLabel: 'Fecha de inscripci\xf3n',
            name: 'fechainscripcion',
            allowBlank: (farmacia != 1),
            format: 'd/m/Y',
            mode: 'local',
            editable: false
        });
        this.comboSexo = new LOG.util.ComboBox({
            name: 'sexo',
            fieldLabel: 'Sexo',
            displayField: 'sexo',
            valueField: 'idsexo',
            allowBlank: (farmacia != 1),
            editable: false,
            store: new Ext.data.SimpleStore({
                fields: ['idsexo', 'sexo'],
                data: [
                    [0, 'Femenino'],
                    [1, 'Masculino']
                ]
            })
        });
        this.textConsultorioMed = LOG.util.Prototipos.inputTexto({
            fieldLabel: 'Consultorio m\xe9dico',
            regex: (farmacia == 1) ? LOG.util.Regex.cadena : undefined,
            name: 'consultoriomedico',
            maxLength: 6,
           // minLength: 6,
            regex: (farmacia == 1) ? /^\d+$/ : undefined,
            maskRe: /[0-9]/,
            allowBlank: (farmacia != 1),
            listeners: {
                blur: function(field) {
                    var value = field.getValue();
                    if (value && value.length < 6) {
                        field.setValue(value.padStart(6, '0')); 
                    }
                } 
            }
        });
        this.textAreaAtencion = LOG.util.Prototipos.inputTexto({
            fieldLabel: '\xc1rea de atenci\xf3n',
            regex: (farmacia == 1) ? LOG.util.Regex.cadena : undefined,
            name: 'area',
            allowBlank: (farmacia != 1)
        });
        this.comboProvincia = new LOG.util.ComboBox({
            fieldLabel: 'Provincia',
            displayField: 'denominacion',
            autoLoad: false,
            valueField: 'id',
            url: '/logistica/farmacia/farmacia/index.php/tarjetamedicamento/cargarProvincias',
            name: 'idprovincia',
            queryParam: 'criterio',
            minChars: 1,
            allowBlank: (farmacia != 1),
            editable: false,
            mode: 'remote',
            pageSize: 20,
            resizable: true,
            listeners: {
                select: function (cb, record) {
                    _this.comboMunicipio.store.load({ params: { idprov: record.data.idprovincia } });
                }
            }
        });
        this.comboProvincia.store.on({
            beforeload: function (st, obj) {
                obj.params.idpais = 1;
            }
        });
        this.comboMunicipio = new LOG.util.ComboBox({
            fieldLabel: 'Municipio',
            displayField: 'denominacion',
            autoLoad: false,
            valueField: 'id',
            url: '/logistica/farmacia/farmacia/index.php/tarjetamedicamento/cargarMunicipios',
            name: 'idmunicipio',
            queryParam: 'criterio',
            minChars: 1,
            allowBlank: (farmacia != 1),
            editable: false,
            mode: 'remote',
            pageSize: 20,
            resizable: true
        });
        this.comboMunicipio.store.on({
            beforeload: function (st, obj) {
                if (_this.comboProvincia.getValue()) {
                    obj.params.idprov = _this.comboProvincia.getValue()
                }
                else return false;
            }
        });
        this.taDireccion = LOG.util.Prototipos.inputTexto({
            fieldLabel: 'Direcci\xf3n del paciente',
            name: 'direccion',
            regex: (farmacia == 1) ? /^([a-zA-ZáéíóúñüÑ0-9-_#/.\s]+ ?[a-zA-ZáéíóúñüÑ0-9-_#/.\s]*)+$/ : undefined,
            allowBlank: (farmacia != 1)
        });
        var contBuscarCI = LOG.util.UIManager.initColumnForm({
            columnas: 2,
            defaultsAnchor: '100%'
        });
        contBuscarCI.getColumn(0).columnWidth = 0.9;
        contBuscarCI.getColumn(1).columnWidth = 0.1;
        contBuscarCI.fireEvent = contBuscarCI.fireEvent.createSequence(function (e) {
            if (e == "resize") {
                var probabilidad = 27 / parseFloat(contBuscarCI.getWidth());
                contBuscarCI.getColumn(0).columnWidth = 1 - probabilidad;
                contBuscarCI.getColumn(1).columnWidth = probabilidad;
                contBuscarCI.doLayout();
            }
        });
        contBuscarCI.addComponent(this.textCI);
        contBuscarCI.addComponent(new Ext.Panel({ items: [new Ext.Panel({ height: 18 }), this.btnBuscarPaciente] }));
        superiorIz.addComponent(this.chBRetrovirales);
        superiorIz.addComponent(this.textNroCaso);
        superiorIz.addComponent(contBuscarCI);
        superiorIz.addComponent(this.textNombre);
        superiorIz.addComponent(this.textTelefono);
        superiorIz.addComponent(this.textCorreo);
        superiorIz.addComponent(this.textFechaInscripcion);
        superiorIz.addComponent(this.comboSexo);
        superiorIz.addComponent(this.textConsultorioMed);
        superiorIz.addComponent(this.textAreaAtencion);
        superiorIz.addComponent(this.comboProvincia);
        superiorIz.addComponent(this.comboMunicipio);
        superiorIz.addComponent(this.taDireccion);

        this.formularioGeneral.add(superiorIz);

        this.gridProductosG = new LOG.farm.tarjetamedicamento.GridViewProducto({
            idioma: this.idioma,
            padre: _this,
            acciones: this.acciones,
            gridEditable: true,
            editar: true,
            autoLoad: false,
            busquedaBasica: false,
            initDefaultButtons: function () {
                //Botones de la ventana
                var _scope = this;

                this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
                    tooltip: "Adicionar producto",
                    disabled: true,
                    handler: function () {
                        var excluir = new Array();
                        _this.gridProductosG.getStorePrincipal().each(function (rec) {
                            if (!rec.data.idproductotarjetamedicamento) {
                                excluir.push(rec.data.idcuadrobasico);
                            }
                        });
                        var parametros = {};
                        parametros.iddocumento = (_this.record && _this.record.data.iddocumento) ? _this.record.data.iddocumento : null;
                        //parametros.idseleccionados = Ext.encode(idseleccionados);
                        //parametros.almacenado = 0;

                        LOG.inv.maestroproductos.Loader.init(function() {
                            var v = new LOG.lb.maestroproductos.UIProductos({
                                tipo: 1,
                                constrain: true,
                                usarAplicar: true,
                                parametros: parametros,
                                doAction: function(r) {
                                    /*var selections = ventanaSelec.getSmPrincipal().getSelections();
                                    var datas = new Array();
                                    _this.gridProductosG.getStorePrincipal().add(selections);
                                    Ext.each(selections, function (rec) {
                                        ventanaSelec.excluir.push(rec.data.idcuadrobasico);
                                        datas.push(rec.data);
                                    });
                                    ventanaSelec.getStorePrincipal().remove(selections);*/
                                    var datas = new Array();
                                    Ext.each(r, function(rec) {
                                        rec.data.idindicador = rec.json.idindicador;
                                        datas.push(rec.data);
                                    });
                                    _this.modelo.adicionarProductos({
                                        productos: Ext.encode(datas),
                                        iddocumento: _this.record.data.iddocumento
                                    }, function () {
                                        _this.gridProductosG.getStorePrincipal().load();
                                        //ventanaSelec.getStorePrincipal().load();
                                    });
                                }
                            });
                            v.show();
                        })

                        /*var ventanaSelec = new LOG.farm.tarjetamedicamento.WinSelectProducto({
                            autoLoad: false,
                            excluir: excluir,
                            idtarjetamedicamento: (_this.record) ? _this.record.data.iddocumento : undefined
                        });
                        ventanaSelec.init();
                        ventanaSelec.getVistaPrincipal().title = 'Seleccionar producto';
                        ventanaSelec.getVistaPrincipal().width = 500;
                        ventanaSelec.getVistaPrincipal().height = 400;
                        ventanaSelec.getVistaPrincipal().constrain = true;
                        ventanaSelec.getVistaPrincipal().resizable = false;
                        ventanaSelec.view();
                        ventanaSelec.getVistaPrincipal().aceptarFn = function () {
                            var selections = ventanaSelec.getSmPrincipal().getSelections();
                            var datas = new Array();
                            _this.gridProductosG.getStorePrincipal().add(selections);
                            Ext.each(selections, function (rec) {
                                ventanaSelec.excluir.push(rec.data.idcuadrobasico);
                                datas.push(rec.data);
                            });
                            ventanaSelec.getStorePrincipal().remove(selections);
                            _this.modelo.adicionarProductos({
                                productos: Ext.encode(datas),
                                iddocumento: _this.record.data.iddocumento
                            }, function () {
                                _this.gridProductosG.getStorePrincipal().load();
                                ventanaSelec.getStorePrincipal().load();
                            });
                        };
                        ventanaSelec.getStorePrincipal().load();*/
                    },
                    controlFn: function (b, _caller) {
                        if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAdicionar')) {
                            b.setVisible(true);
                        }
                        else b.setVisible(false);
                        if (_scope.guardado) {
                            b.enable();
                        }
                    }
                }));
                this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
                    disabled: true,
                    tooltip: "Eliminar producto",
                    handler: function () {
                        mostrarMensaje(2, _this.idioma.msgEliminarProducto, function (btn) {
                            if (btn == 'ok') {
                                var selections = _this.gridProductosG.getSmPrincipal().getSelections();
                                var arrElimLogica = new Array();
                                Ext.each(selections, function (rec) {
                                    if (rec.data.idproductotarjetamedicamento) {
                                        arrElimLogica.push(rec.data.idproductotarjetamedicamento);
                                    }
                                });
                                _this.gridProductosG.getStorePrincipal().remove(selections);

                                if (arrElimLogica.length > 0) {
                                    _this.modelo.eliminarProducto({ id: Ext.encode(arrElimLogica) }, function (resp) {
                                        mostrarMensaje(1, "Los productos han sido eliminados satisfactoriamente.");
                                        _this.gridProductosG.getStorePrincipal().load();
                                    });
                                }
                                else {
                                    mostrarMensaje(1, "Los productos han sido eliminados satisfactoriamente.");
                                }
                            }
                        });

                    },
                    controlFn: function (b, _caller) {
                        if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('REliminar')) {
                            b.setVisible(true);
                        }
                        else b.setVisible(false);
                        b.disable();
                        _caller.getSmPrincipal().fireEvent = _caller.getSmPrincipal().fireEvent.createSequence(function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() >= 1) {
                                    var seleccionado = _caller.getSmPrincipal().getSelected();
                                    if (seleccionado.data.aprobado == 0)
                                        b.enable();
                                    else
                                        b.disable();
                                }
                                else {
                                    b.disable();
                                }
                            }
                        });
                    }
                }));
                this.addToolbarButton(LOG.util.Prototipos.botonAprobar({
                    disabled: true,
                    tooltip: "Aprobar tratamiento",
                    handler: function () {
                        _this.modelo.aprobarProducto({ idproducto: _this.gridProductosG.getSmPrincipal().getSelected().data.idproductotarjetamedicamento }, function (resp) {
                            _this.gridProductosG.getStorePrincipal().load();
                        })
                    },
                    controlFn: function (b, _caller) {
                        if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAprobarProducto')) {
                            b.setVisible(true);
                        }
                        else b.setVisible(false);
                        b.disable();
                        _caller.getSmPrincipal().fireEvent = _caller.getSmPrincipal().fireEvent.createSequence(function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() >= 1) {
                                    var seleccionado = _caller.getSmPrincipal().getSelected();
                                    if (seleccionado && seleccionado.data.aprobado == 0 && seleccionado.data.dosis > 0
                                        && seleccionado.data.fechaemision != null && seleccionado.data.fechaexpiracion != null
                                        && _this.record && _this.record.data.estado == 3 && !seleccionado.dirty && seleccionado.data.fechaemision < seleccionado.data.fechaexpiracion)
                                        b.enable();
                                    else
                                        b.disable();
                                }
                                else {
                                    b.disable();
                                }
                            }
                        });
                        //REVISANDOOO PARA QUE CUIANDO SE CAMBIE UN VALOR SE DESACTIVE EL BTN APROBAR.
                        /*_this.getGridPrincipal().fireEvent = _this.getGridPrincipal().fireEvent.createSequence(function(e,obj) {
                            if (e == 'afteredit') {
                                if (this.getCount() >= 1) {
                                    var seleccionado = _caller.getSmPrincipal().getSelected();
                                    if (seleccionado && seleccionado.data.aprobado == 0 && seleccionado.data.dosis >0
                                        && seleccionado.data.fechaemision != null && seleccionado.data.fechaexpiracion!=null
                                        && _this.record && _this.record.data.estado == 3 && !seleccionado.dirty)
                                        b.enable();
                                    else
                                        b.disable();
                                }
                                else {
                                    b.disable();
                                }

                            }
                        });*/
                    }
                }));
                this.addToolbarButton(LOG.util.UIManager.createBtn(({
                    disabled: true,
                    iconCls: 'reevaluacion',
                    tooltip: "Renovar tratamiento",
                    text: "Renovar",
                    handler: function () {
                        var productos = new Array();
                        var ids = new Array();
                        var selections = _this.gridProductosG.getSmPrincipal().getSelections();
                        Ext.each(selections, function (rec) {
                            productos.push(rec.data);
                            ids.push(rec.data.idproductotarjetamedicamento);
                        });
                        _this.modelo.renovarProducto({
                            productos: Ext.encode(productos),
                            ids: Ext.encode(ids)
                        }, function (resp) {
                            _this.gridProductosG.getStorePrincipal().load();
                        })
                    },
                    controlFn: function (b, _caller) {
                        if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RRenovarProducto')) {
                            b.setVisible(true);
                        }
                        else b.setVisible(false);
                        b.disable();
                        _caller.getSmPrincipal().fireEvent = _caller.getSmPrincipal().fireEvent.createSequence(function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() >= 1) {
                                    var correcto = true;
                                    var selections = _caller.getSmPrincipal().getSelections();
                                    Ext.each(selections, function (seleccionado) {
                                        if (seleccionado.data.aprobado == 0) {
                                            correcto = false;
                                        }
                                    });
                                    if (correcto)
                                        b.enable();
                                    else
                                        b.disable();
                                }
                                else {
                                    b.disable();
                                }
                            }
                        });
                    }
                })));
                this.addToolbarButton(LOG.util.UIManager.createBtn(({
                    disabled: true,
                    iconCls: 'cambiar',
                    text: 'Cambio',
                    tooltip: "Cambio de tratamiento",
                    handler: function () {

                        var productos = new Array();
                        var ids = new Array();
                        var selections = _this.gridProductosG.getSmPrincipal().getSelections();
                        Ext.each(selections, function (rec) {
                            productos.push(rec.data);

                            ids.push(rec.data.idproductotarjetamedicamento);
                        });
                        _this.modelo.cambioTratamientos({
                            productos: Ext.encode(productos),
                            ids: Ext.encode(ids)
                        }, function (resp) {
                            _this.gridProductosG.getStorePrincipal().load();
                        })
                    },
                    controlFn: function (b, _caller) {
                        if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RCambioTratamiento')) {
                            b.setVisible(true);
                        }
                        else b.setVisible(false);
                        b.disable();
                        _caller.getSmPrincipal().fireEvent = _caller.getSmPrincipal().fireEvent.createSequence(function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() >= 1) {
                                    var correcto = true;
                                    var selections = _caller.getSmPrincipal().getSelections();
                                    Ext.each(selections, function (seleccionado) {
                                        if (seleccionado.data.aprobado != 1) {
                                            correcto = false;
                                        }
                                    });
                                    if (correcto)
                                        b.enable();
                                    else
                                        b.disable();
                                }
                                else {
                                    b.disable();
                                }
                            }
                        });
                    }
                })));
                this.addToolbarButton(LOG.util.UIManager.createBtn(({
                    disabled: true,
                    iconCls: 'salir',
                    text: 'Expirar',
                    tooltip: "Expirar el tratamiento",
                    handler: function () {
                        var productos = new Array();
                        var ids = new Array();
                        var selections = _this.gridProductosG.getSmPrincipal().getSelections();
                        Ext.each(selections, function (rec) {
                            ids.push(rec.data.idproductotarjetamedicamento);
                        });

                        _this.modelo.expirar({ ids: ids }, function (resp) {
                            _this.gridProductosG.getStorePrincipal().load();
                        });
                    },
                    controlFn: function (b, _caller) {
                        if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RCambioTratamiento')) {
                            b.setVisible(true);
                        }
                        else b.setVisible(false);
                        b.disable();
                        _caller.getSmPrincipal().fireEvent = _caller.getSmPrincipal().fireEvent.createSequence(function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() >= 1) {
                                    var correcto = true;
                                    var selections = _caller.getSmPrincipal().getSelections();
                                    Ext.each(selections, function (seleccionado) {
                                        if (seleccionado.data.aprobado != 1) {
                                            correcto = false;
                                        }
                                    });
                                    if (correcto)
                                        b.enable();
                                    else
                                        b.disable();
                                }
                                else {
                                    b.disable();
                                }
                            }
                        });
                    }
                })));
            }
        });
        this.gridProductosG.init();
        this.panelGridProductosG = this.gridProductosG.view();
        this.panelGridProductosG.setHeight(200);
        this.gridProductosG.getStorePrincipal().on({
            update: function (sm) {
                _this.modelo.gridEditado = true;

                if (_this.modelo.isValid()) {
                    _this.modelo.habilitarBotones();
                } else {
                    _this.modelo.habilitarBotones(true);
                }
            }
        });
        /*this.panelGridProductosG.getSmPrincipal().on({
            selectionchange: function (sm) {
                /!*console.log(sm.data)
                if (sm.getCount() == 1) {
                    _this.gridEntregaG.idventacliente
                        = sm.getSelected().data.idpaciente;
                    _this.gridEntregaG.idproducto
                        = sm.getSelected().data.idproducto;
                    _this.gridEntregaG.idproductotarjetamedicamento
                        = sm.getSelected().data.idproductotarjetamedicamento;
                    _this.gridEntregaG.getStorePrincipal().load();
                }
                else if (sm.getCount() == 0) {
                    _this.gridEntregaG.idventacliente = -1;
                    _this.gridEntregaG.idproducto = -1;
                    _this.gridEntregaG.idproductotarjetamedicamento = -1;
                }*!/
            }
        });*/
        this.gridEntregaG = new LOG.farm.tarjetamedicamento.GridEntrega({
            idioma: this.idioma, acciones: this.acciones,
            gridEditable: true, autoLoad: false
        });
        this.gridEntregaG.init();
        this.panelGridEntregaG = this.gridEntregaG.view();
        this.panelGridEntregaG.setHeight(200);
        this.panelContenedorGrids = LOG.util.UIManager.initPanel({
            autoHeight: true,
            frame: true
        });
        this.panelContenedorGrids.add(this.panelGridProductosG);
        this.panelContenedorGrids.add(new Ext.menu.Separator({ height: 5 }));
        this.panelContenedorGrids.add(this.panelGridEntregaG);
        this.btnNuevo = LOG.util.Prototipos.botonNuevo({
            tooltip: this.idioma.ttBtnNuevo,
            handler: this.onResetHandler,
            scope: this,
            controlFn: function () {
                _this.controlFnGuardar(_this.btnNuevo, true);
                if (_this.record && _this.record.data.estado > 0)
                    _this.btnNuevo.hide();
            }
        });
        this.btnCerrar = LOG.util.Prototipos.botonCancelar({
            handler: this.onCancelarHandler,
            text: this.idioma.lbBtnCerrar,
            scope: this
        }, true);

        this.modelo.addActionButton(this.btnSalvar);
        this.contenedorGeneral = LOG.util.UIManager.initColumnForm({
            columnas: 2,
            region: 'center',
            frame: true
        });
        this.contenedorGeneral.getColumn(0).columnWidth = 0.25;
        this.contenedorGeneral.getColumn(1).columnWidth = 0.75;
        this.contenedorGeneral.addComponent(this.panelSuperior);
        this.contenedorGeneral.addComponent(this.panelContenedorGrids);
        LOG.util.UIManager.apply(this, {
            tbar: this.listaBotonesVentana.getArray(),
            resizable: false,
            items: [this.contenedorGeneral],
            buttons: [this.btnCerrar, this.btnNuevo, this.btnSalvar]
        });
        LOG.lb.documento.ventanaGestionDocumentos.superclass.initComponent.call(this);

        this.fireEvent = this.fireEvent.createSequence(function (e) {
            if (e == 'resize') {
                _this.definirAltura();
            }
        });
    },
    initDefaultColumns: function () {
    },
    initDefaultButtons: function () {
        //Botones de la ventana
        var _this = this;

        this.addToolbarButtonVentana(LOG.util.Prototipos.botonEliminar({
            tooltip: 'Eliminar tarjeta de control',
            handler: function () {
                _this.modelo.eliminar({ id: _this.record.data.iddocumento }, function () {
                    _this.getTitleDocumento(_this.record.data.iddocumento);
                    _this.record = null;
                    _this.close();
                });
            },
            controlFn: function (b, _caller) {

                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('REliminar')) {
                    b.setVisible(true);
                }
                else b.setVisible(false);
                b.disable();
                if (_this.record && _this.record.data.estado == 1) {
                    b.enable();
                }
                else {
                    b.disable();
                }
            }
        }));
        this.addToolbarButtonVentana(LOG.util.Prototipos.botonConfirmar({
            text: 'Confirmar',
            tooltip: 'Confirmar tarjeta de control',
            handler: function () {
                _this.modelo.confirmar({ iddocumento: _this.record.data.iddocumento }, function () {
                    _this.gridProductosG.listaBotones.getItem(0).disable();
                    _this.getTitleDocumento(_this.record.data.iddocumento);
                    _this.record.data.estado = 2;
                    _this.btnBuscarPaciente.disable();
                    _this.controlBtns();
                    _this.deshabilitarForm();
                });
            },

            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RConfirmar')) {
                    b.setVisible(true);
                }
                else b.setVisible(false);
                b.disable();
                if (_this.record && _this.record.data.estado == 1 && _this.record.data.cantidadproductos > 0/* && _this.record.data.datosnull == 0 */) {
                    b.enable();
                }
                else {
                    b.disable();
                }
            }
        }));
        this.addToolbarButtonVentana(LOG.util.Prototipos.botonAnularEstado({
            text: 'Anular estado',
            tooltip: 'Anular estado',
            handler: function () {
                _this.modelo.anularestado({ iddocumento: _this.record.data.iddocumento }, function () {
                    _this.gridProductosG.listaBotones.getItem(0).enable();
                    _this.getTitleDocumento(_this.record.data.iddocumento);
                    _this.record.data.estado = 1;
                    _this.btnBuscarPaciente.enable();
                    _this.controlBtns();
                    _this.habilitarForm();
                });
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAnularestado')) {
                    b.setVisible(true);
                }
                else b.setVisible(false);
                b.disable();
                if (_this.record && _this.record.data.estado == 2) {
                    b.enable();
                }
                else {
                    b.disable();
                }
            }
        }));
        this.addToolbarButtonVentana(LOG.util.Prototipos.botonAprobar({
            text: 'Aprobar',
            tooltip: 'Aprobar tarjeta de control',
            handler: function () {
                _this.modelo.aprobar({ iddocumento: _this.record.data.iddocumento }, function () {
                    _this.gridProductosG.listaBotones.getItem(0).enable();
                    _this.getTitleDocumento(_this.record.data.iddocumento);
                    _this.record.data.estado = 3;
                    _this.btnBuscarPaciente.disable();
                    _this.controlBtns();
                    _this.deshabilitarForm();
                    _this.gridProductosG.getStorePrincipal().load();
                });
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('RAprobar')) {
                    b.setVisible(true);
                }
                else b.setVisible(false);
                b.disable();
                if (_this.record && _this.record.data.estado == 2) {
                    b.enable();
                }
                else {
                    b.disable();
                }
            }

        }));
    },
    definirAltura: function () {
        var alto = this.getHeight() - 126;
        this.panelSuperior.setHeight(alto);
        this.panelContenedorGrids.setHeight(alto);
        this.panelGridProductosG.setHeight(alto / 2);
        this.panelGridEntregaG.setHeight(alto / 2);
        this.formularioGeneral.setHeight(alto);
    },
    prepareDocModify: function (d, noCargar) {
        if (this.fromularioGestion) {
            this.btnNuevo.hide();
            this.fromularioGestion.getForm().loadRecord(d);
            this.gridProductosG.idtarjetamedicamento = d.data.iddocumento;
            if (d.data.estado > 1) {
                this.deshabilitarForm();
            }
        
            if (this.grantedAction('RCRUD')) {
                this.habilitarForm();
            }
            this.gridProductosG.listaBotones.getItem(0).enable();
            this.btnBuscarPaciente.enable();
            if (d.data.estado == 2) {
                this.gridProductosG.listaBotones.getItem(0).disable();
                this.btnBuscarPaciente.disable();
            }
            if (d.data.estado == 3) {
                this.btnBuscarPaciente.disable();
            }
            this.gridProductosG.getStorePrincipal().load();
            if (!noCargar) {
                this.modelo.loadRecord();
            }
            this.record = d;
            this.getTitleDocumento(this.record.data.iddocumento);
        }
    },
    deshabilitarForm: function () {
        this.chBRetrovirales.disable();
        this.textNroCaso.disable();
        this.textCI.disable();
        this.textNombre.disable();
        this.comboSexo.disable();
        this.textConsultorioMed.disable();
        this.textAreaAtencion.disable();
        this.comboProvincia.disable();
        this.comboMunicipio.disable();
        this.taDireccion.disable();
        this.textFechaInscripcion.disable();
        this.textTelefono.disable();
        this.textCorreo.disable();
    },
    habilitarForm: function () {
        this.chBRetrovirales.enable();
        this.textNroCaso.enable();
        this.textCI.enable();
        this.textNombre.enable();
        this.comboSexo.enable();
        this.textConsultorioMed.enable();
        this.textAreaAtencion.enable();
        this.comboProvincia.enable();
        this.comboMunicipio.enable();
        this.taDireccion.enable();
        this.textFechaInscripcion.enable();
        this.textTelefono.enable();
        this.textCorreo.enable();
    },
    salvarHandler: function (params) {
        params = params || {};
        var _this = this.scope || this;
        _this.guardado = true;
        params['productos'] = Ext.encode(_this.gridProductosG.getRecordsToSave());
        params['entrega'] = Ext.encode(_this.gridEntregaG.datosParaGuardar());
        _this.modelo.salvar(params, function (r) {
            _this.gridProductosG.idtarjetamedicamento = r.idtarjetamedicamento;
            _this.gridProductosG.listaBotones.getItem(0).enable();
            _this.gridProductosG.getStorePrincipal().load();
            _this.tipoVentana = 2;
            if (_this.record == null) {
                _this.record = {};
            }
            var arreglo = [];
            if (r.datos) {
                Ext.apply(_this.record, {
                    data: r.datos
                });
            }

            else
                Ext.apply(_this.record, {
                    data: arreglo
                });
            Ext.apply(_this.record.data, {
                iddocumento: r.idtarjetamedicamento
            });

            _this.getTitleDocumento(r.idtarjetamedicamento);
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
        }, function (r) {
            if (r.pacientecontarjeta) {
                mostrarMensaje(3, 'El paciente con CI ' + _this.modelo.numeroidentidad + " ya tiene una tarjeta de medicamento.");
            }
        });
    },
    controlBtns: function () {
        var _this = this;
        _this.listaBotonesVentana.each(function (b) {
            LOG.util.UIManager.applyKey(b, _this);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(_this, [b, _this]).call();
            }
        }, _this);
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
    onResetHandler: function () {
        var _this = this.scope || this;
        if (_this.fromularioGestion) {
            _this.modelo.reset();
            _this.fromularioGestion.getForm()._record = null;
            _this.gridProductosG.getStorePrincipal().removeAll();
            _this.gridProductosG.listaBotones.getItem(0).disable();
            _this.gridEntregaG.getStorePrincipal().removeAll();
            _this.record = null;
            _this.habilitarForm();
            _this.setTitle(_this.idioma.tlAdicionar);
            _this.onShowHandler()
            _this.btnNuevo.show();
            _this.modelo.gridEditado = false;
            _this.btnBuscarPaciente.enable();
        }
    },
    onCloseHandler: function (p) {
        var _this = this;
        if (_this.fromularioGestion) {
            _this.record = null;
            _this.fromularioGestion.getForm()._record = null;
            _this.fromularioGestion.getForm().reset();
            _this.modelo.reset();
            _this.habilitarForm();
            _this.textNroCaso.disable();
            _this.gridProductosG.getStorePrincipal().removeAll();
            _this.gridProductosG.listaBotones.getItem(0).disable();
            _this.gridEntregaG.getStorePrincipal().removeAll();
            _this.btnNuevo.show();
            _this.modelo.gridEditado = false;
            _this.btnBuscarPaciente.enable();
        }
        if (_this.modelo[_this.modelo.primaryKeyField] || _this.idDocumento) {
            var id = _this.modelo[_this.modelo.primaryKeyField] || _this.idDocumento;
            _this.modelo.cargaInicial({
                cargando: true,
                url: '/logistica/utiles/documento/index.php/desbloqueo/desbloquearDocumento',
                id: Ext.encode([id])
            });
        }
        return LOG.lb.documento.ventanaGestionDocumentos.superclass.onCloseHandler.call(_this, p);
    }
});


LOG.farm.tarjetamedicamento.GridViewProducto = Ext.extend(LOG.util.UITemplate, {
    idtarjetamedicamento: undefined,
    editar: false,
    constructor: function (config) {
        this.busquedaBasica = true;
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 2;
        this.dirController = '/logistica/farmacia/farmacia/index.php/tarjetamedicamento';
        config.urlBusquedaGridPrincipal = 'cargarProductosTarjeta';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.farm.tarjetamedicamento.Idioma);
        this.concepto = this.idioma.tlBtnBuscar;
        LOG.farm.tarjetamedicamento.GridViewProducto.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idproductotarjetamedicamento',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idcuadrobasico',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idproducto',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idpaciente',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idtarjetamedicamento',
            hidden: true
        });
        this.addGridColumn({
            header: 'Aprobado',
            dataIndex: 'aprobado',
            width: 70,
            renderer: function (value, metaData, record) {

                if (value == 1) {
                    metaData.css = 'icondistra-aceptar verde';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttClmSi + '"';
                }
                if (value == 2) {
                    return "Expirado";
                }
                if (value == 0) {
                    metaData.css = 'icondistra-aceptar rojo';
                    metaData.attr = 'ext:qtip="' + _this.idioma.ttClmNo + '"';
                }
            }
        });
        this.addGridColumn({
            dataIndex: 'codigo',
            header: this.idioma.cgCodigo,
            width: 100
        });
        this.addGridColumn({
            dataIndex: 'denominacion',
            header: this.idioma.cgDenominacion,
            width: 200,
            id: 'denominacion'
        });
        this.addGridColumn({
            dataIndex: 'origenprescripcion',
            header: 'Origen prescripci\xf3n',
            width: 120,
            hidden: true,
            editor: new Ext.form.TextField({}),
            renderer: function (val) {
                return val;
            }
        });
        this.addGridColumn({
            dataIndex: 'nombremedico',
            header: 'Nombre y apellidos del médico',
            width: 120,
            align: 'center',
            editor: new Ext.form.TextField({}),
            renderer: function (val) {
                return val;
            }
        });

        this.addGridColumn({
            dataIndex: 'nroregistro',
            header: 'Registro profesional',
            width: 120,
            align: 'center',
            editor: new Ext.form.NumberField({}),
            renderer: function (val) {
                return val;
            }
        });
        this.addGridColumn({
            dataIndex: 'especialidad',
            header: 'Especialidad',
            width: 120,
            hidden: true,
            editor: new Ext.form.TextField({}),
            renderer: function (val) {
                return val;
            }
        });
        this.addGridColumn({
            dataIndex: 'dosis',
            align: 'center',
            header: (farmacia === 1) ? this.idioma.cgDosisMensual: 'Cuota Mensual',
            width: 120,
            editor: new LOG.util.Prototipos.inputEntero({
                listeners: {
                    focus: function (tf) {
                        var ventana = _this.ventanaDosis();
                        ventana.show();
                        ventana.aceptarFn = function () {
                            var rec = _this.getSmPrincipal().getSelected();
                            rec.set('dosis', ventana.campoDosisMensual.getValue());
                            rec.dirty = true;
                        }
                    }
                }
            }),
            renderer: function (val) {
                return val;
            }
        });
        this.addGridColumn({
            dataIndex: 'hospital',
            header: (farmacia === 1) ? this.idioma.cgHospital: 'OFICODA',
            width: 120,
            align: 'center',
            editor: new Ext.form.TextField({}),
            renderer: function (val) {
                return val;
            }
        });
        this.addGridColumn({
            dataIndex: 'otrasunidades',
            header: 'Otras unidades',
            width: 100
        });
        this.addGridColumn({
            dataIndex: 'fechaemision',
            align: 'center',
            header: this.idioma.cgFechaEmision,
            width: 130,
            editor: new Ext.form.DateField({}),
            renderer: function (value, c, record) {
                return _this.formatDate(value, c, record)
            }
        });
        this.addGridColumn({
            dataIndex: 'fechaexpiracion',
            align: 'center',
            header: this.idioma.cgFechaExpiracion,
            width: 130,
            editor: new Ext.form.DateField({}),
            renderer: function (value, c, record) {
                return _this.formatDate(value, c, record)
            },
        });
    },
    ventanaDosis: function () {
        var cls = LOG.util.UIManager.initColumnForm({
            columnas: 2,
            frame: true,
            region: 'center'
        });
        var dosisIntervalo = new LOG.util.Prototipos.inputEntero({
            fieldLabel: "Dosis por intervalo",
            listeners: {
                keyup: function (tf) {
                    if (totalIntervalosD.getValue() && dosisIntervalo.getValue()) {
                        dosisMensual.setValue(totalIntervalosD.getValue() * dosisIntervalo.getValue() * 30);
                    }
                    else {
                        dosisMensual.setValue();
                    }
                }
            },
            enableKeyEvents: true
        });
        var totalIntervalosD = new LOG.util.Prototipos.inputEntero({
            fieldLabel: "Total intervalos diarios",
            listeners: {
                keyup: function (tf) {
                    if (totalIntervalosD.getValue() && dosisIntervalo.getValue()) {
                        dosisMensual.setValue(totalIntervalosD.getValue() * dosisIntervalo.getValue() * 30);
                    }
                    else {
                        dosisMensual.setValue();
                    }
                }
            },
            enableKeyEvents: true
        });
        var dosisMensual = new LOG.util.Prototipos.inputEntero({ fieldLabel: "Dosis mensual" })
        cls.addComponent(dosisIntervalo);
        cls.addComponent(totalIntervalosD);
        cls.addComponent(dosisMensual);
        var wDosis = new LOG.util.Window({
            usarAplicar: false,
            title: 'Dosis mensual',
            width: 300,
            height: 200,
            campoDosisMensual: dosisMensual,
            items: [cls]
        });
        return wDosis;
    },
    render: function () {
        var _this = this;
        var vista = LOG.farm.tarjetamedicamento.GridViewProducto.superclass.render.call(this);
        this.getStorePrincipal().on({
            beforeload: function (st, obj) {
                obj.params.idtarjetamedicamento = _this.idtarjetamedicamento;
            }
        });
        Ext.apply(_this.gpPrincipal, {
            viewConfig: {
                getRowClass: function (rec, index, rowParams, store) {
                    if ((new Date(rec.data.fechaexpiracion)).getTime() < (new Date(fechaactual)).getTime()) {// new date construye una fechha.. sin param es la actual
                        return 'redrow-text';
                    }
                    if ((new Date(rec.data.fechaemision)).getTime() > (new Date(rec.data.fechaexpiracion)).getTime()) {// new date construye una fechha.. sin param es la actual
                        return 'redrow-text';
                    }
                }
            }
        });
        _this.getGridPrincipal().fireEvent = _this.getGridPrincipal().fireEvent.createSequence(function (e, obj) {
            if (e == 'beforeedit') {

                var rec = obj.record;
                if (_this.padre.record.data.estado == 3) {
                    if ((obj.field == 'dosis' || obj.field == 'fechaemision' || obj.field == 'fechaexpiracion'
                        || obj.field == 'especialidad' || obj.field == 'nroregistro' || obj.field == 'origenprescripcion')
                        && obj.record.data.aprobado == 1 || obj.record.data.aprobado == 2) {
                        obj.cancel = true;

                    }
                }
                if (obj.record.data.aprobado == 0) {
                    obj.cancel = false;
                }
            }
            if (e == 'afteredit') {
                // ********************************************..........para validar la fecha modificada**************************************
                if (obj && obj.record.data.fechaemision != null && obj.record.data.fechaexpiracion != null) {


                    var fi = obj.record.data.fechaemision;
                    var ff = obj.record.data.fechaexpiracion;
                    _this.banderaintermedia = 0;

                    if (typeof fi != 'object') {
                        var anno = fi.substring(6, 10);
                        var mes = parseInt(fi.substring(3, 5)) - 1;
                        var dia = fi.substring(0, 2);
                        fi = new Date(anno, mes, dia);
                    }
                    if (typeof ff != 'object') {
                        var anno = ff.substring(6, 10);
                        var mes = parseInt(ff.substring(3, 5)) - 1;
                        var dia = ff.substring(0, 2);
                        ff = new Date(anno, mes, dia);
                    }

                    if (fi > ff) {
                        mostrarMensaje(3, 'La fecha de expiración no puede ser menor que la fecha de emisión.')
                        _this.padre.btnSalvar.disable();
                    }
                    else {
                        _this.padre.btnSalvar.enable();
                    }
                    // ********************************************..........para validar las fecha modificada**************************************
                    obj.grid.store.data.items.forEach(function (p) {
                        if (obj.record.id != p.id) {
                            var fechai;
                            var fechafin;

                            if (typeof p.data['fechaemision'] === 'object') {
                                fechai = new Date(p.data['fechaemision']);
                            }
                            else {
                                var anno = p.data['fechaemision'].substring(6, 10);
                                var mes = parseInt(p.data['fechaemision'].substring(3, 5)) - 1;
                                var dia = p.data['fechaemision'].substring(0, 2);
                                fechai = new Date(anno, mes, dia);
                            }
                            if (typeof p.data['fechaexpiracion'] === 'object') {
                                fechafin = new Date(p.data['fechaexpiracion']);
                            }
                            else {
                                var anno = p.data['fechaexpiracion'].substring(6, 10);
                                var mes = parseInt(p.data['fechaexpiracion'].substring(3, 5)) - 1;
                                var dia = p.data['fechaexpiracion'].substring(0, 2);
                                fechafin = new Date(anno, mes, dia);
                            }

                            if (fechai > fechafin) {
                                _this.padre.btnSalvar.disable();
                            }
                        }
                    });
                }

            }
        });
        return vista;
    },
    getRecordsToSave: function () {
        var arr = new Array();
        this.getStorePrincipal().each(function (rec) {
            if (!rec.data.idproductotarjetamedicamento || rec.dirty) {
                arr.push(rec.data);
            }
        });
        return arr;
    },
    formatDate: function (value, c, record) {
        if (value) {
            if (typeof value == "object") {
                return value.dateFormat('d/m/Y');
            }
        }
        return value;
    }
});

LOG.farm.tarjetamedicamento.GridEntrega = Ext.extend(LOG.util.UITemplate, {
    idventacliente: -1,
    idproducto: -1,
    idproductotarjetamedicamento: -1,
    constructor: function (config) {
        this.busquedaBasica = false;
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 2;
        this.autoLoad = false;
        this.dirController = '/logistica/farmacia/farmacia/index.php/tarjetamedicamento';
        config.urlBusquedaGridPrincipal = 'cargarEntregaProducto';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.farm.tarjetamedicamento.Idioma);
        this.concepto = this.idioma.tlBtnBuscar;
        LOG.farm.tarjetamedicamento.GridEntrega.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'identregaproducto',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idtarjetamedicamento',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idproductotarjetamedicamento',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'fechaentrega',
            header: this.idioma.cgFechaEntrega,
            width: 120,
            align: 'center',
            editor: new Ext.form.DateField({ allowBlank: false }),
            renderer: function (value, c, record) {
                return _this.formatDate(value, c, record)
            }
        });
        this.addGridColumn({
            dataIndex: 'cantidadentregada',
            header: this.idioma.cgCantEntregada,
            width: 90,
            align: 'right',
            editor: new LOG.util.Prototipos.inputDecimal({ allowBlank: false })
        });
        this.addGridColumn({
            dataIndex: 'entregadapor',
            header: this.idioma.cgEntregadoPor,
            width: 120,
            editor: new LOG.util.ComboBox({
                url: '/logistica/farmacia/farmacia/index.php/tarjetamedicamento/getallusers',
                name: 'entregadopor',
                queryParam: 'criterio',
                displayField: 'nombreusuario',
                valueField: 'idusuario',
                allowBlank: false,
                minChars: 1,
                mode: 'local',
                resizable: true
            }),
            renderer: function (val, x, rec) {
                if (val) {
                    if (rec.json && rec.json.denomusuario) {
                        return rec.json.denomusuario;
                    }
                    else {
                        var den = val;
                        this.editor.store.each(function (rc) {
                            if (rc.data.idusuario == val)
                                den = rc.data.nombreusuario
                        });
                        return den;
                    }
                }
                return val;
            }
        });
    },
    formatDate: function (value, c, record) {
        if (value) {
            if (typeof value == "object") {
                return value.dateFormat('d/m/Y');
            }
        }
        return value;
    },
    render: function () {
        var _this = this;
        var vista = LOG.farm.tarjetamedicamento.GridViewProducto.superclass.render.call(this);
        this.getStorePrincipal().on({
            beforeload: function (st, obj) {
                obj.params.idventacliente = _this.idventacliente;
                obj.params.idproducto = _this.idproducto;
                obj.params.idproductotarjetamedicamento = _this.idproductotarjetamedicamento;
            }
        });
        return vista;
    },
    datosParaGuardar: function () {
        var entrega = new Array();
        this.getStorePrincipal().each(function (rec) {
            if (!rec.data.identregaproducto || rec.dirty) {
                entrega.push(rec.data);
            }
        });
        return entrega;
    }
});

//Seleccionar Producto
LOG.farm.tarjetamedicamento.WinSelectProducto = Ext.extend(LOG.util.UITemplate, {
    excluir: undefined,
    idtarjetamedicamento: undefined,
    constructor: function (config) {
        this.busquedaBasica = true;
        this.autoSelect = false;
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 3;
        this.dirController = '/logistica/farmacia/farmacia/index.php/tarjetamedicamento';
        config.urlBusquedaGridPrincipal = 'cargarAllCuadroBasico';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.farm.tarjetamedicamento.Idioma);
        this.concepto = 'productos';
        LOG.farm.tarjetamedicamento.WinSelectProducto.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idcuadrobasico',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idindicador',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'dosis'
        });
        this.addGridColumn({
            dataIndex: 'fechaemision'
        });
        this.addGridColumn({
            dataIndex: 'fechaexpiracion'
        });
        this.addGridColumn({
            dataIndex: 'codigo',
            header: 'C\xf3digo',
            width: 120,
        });
        this.addGridColumn({
            dataIndex: 'denominacion',
            header: 'Denominaci\xf3n',
            width: 200
        });

    },
    render: function () {
        var _this = this;
        var vista = LOG.farm.tarjetamedicamento.WinSelectProducto.superclass.render.call(this);
        this.getStorePrincipal().on({
            beforeload: function (st, obj) {
                obj.params.activo = 1;
                obj.params.excluir = Ext.encode(_this.excluir);
                obj.params.idtarjetamedicamento = _this.idtarjetamedicamento;
            }
        });
        return vista;
    }
});