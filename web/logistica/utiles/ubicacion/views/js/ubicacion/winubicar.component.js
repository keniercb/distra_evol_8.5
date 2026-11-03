Ext.ns('LOG.lb.ubicacion');

/**
 * Ventana para ubicar los productos.
 * @type LOG.util.Window
 */
LOG.lb.ubicacion.winUbicar = Ext.extend(LOG.util.Window, {
    listaBotones: undefined,
    posiciones: new Array(),
    indice: 0,
    ubicaciones: 0,
    proceso: false,
    primeraSeleccion: true,
    tbar: [
        '->',
        LOG.util.Prototipos.botonAyuda({
            referencia: '/logistica/utiles/ubicacion/index.php/ubicacion/ubicacion',
            id: 'idUbicarProducto'
        })
    ],
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        this.idioma = LOG.util.UIManager.apply(LOG.lb.ubicacion.Idioma, LOG.util.Idioma);
        this.modelo = new LOG.lb.ubicacion.Model({
            idioma: this.idioma,
            urlController: '/logistica/utiles/ubicacion/index.php/ubicacion/'
        });
        this.initDefaultButtons();
        LOG.lb.ubicacion.winUbicar.superclass.constructor.call(this, config);
        Ext.apply(this, {
            width: 550,
            height: 400,
            resizable: false,
            title: this.idioma.tlVentanaUbicarProducto
        });
		this.confubicacion = {};
        this.panelDatos();
    },
    /**
     * Inicializa los botones del componente.
     * @returns {undefined}
     */
    initDefaultButtons: function() {
        var _this = this;
        this.listaBotones = new LOG.util.List();
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonCancelar({
            handler: this.onCancelarHandler,
            scope: this
        })));
        this.listaBotones.add(LOG.util.UIManager.createBtn({
            iconCls: 'anterior',
            text: this.idioma.lbBtnAnterior,
            tooltip: this.idioma.ttBtnProductoAnterior,
            disabled: true,
            handler: function() {
                if (_this.datos.hasPrevious()) {
                    _this.indice--;
                    _this.datos.selectRow(_this.posiciones[_this.indice]);
                }
                _this.cargarDatosUbicar();
                if (!_this.proceso) {
                    _this.primeraSeleccion = false;
                    _this.nfCantidadUbicar.setValue(_this.vista.getGridPrincipal().getSelectionModel().getSelected().data.cantidad);
                }
            },
            controlFn: function(b, _caller) {
                b.setDisabled(_this.indice == 0);
                LOG.util.UIManager.encadenaFn(_caller, 'fireEvent', function(e) {
                    if (e == 'selectionchange') {
                        if (_this.indice > 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'anterior');
            }
        }));
        this.listaBotones.add(LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnSiguiente,
            tooltip: this.idioma.ttBtnProductoSiguiente,
            iconCls: 'siguiente',
            disabled: true,
            handler: function() {
                if(_this.datos.hasNext()){
                    _this.indice++;
                    _this.datos.selectRow(_this.posiciones[_this.indice]);
                }
                _this.cargarDatosUbicar();
                if (!_this.proceso) {
                    _this.primeraSeleccion = false;
                    _this.nfCantidadUbicar.setValue(_this.vista.getGridPrincipal().getSelectionModel().getSelected().data.cantidad);
                }
            },
            controlFn: function(b, _caller) {
                b.setDisabled(_this.indice == (_this.posiciones.length - 1));
                LOG.util.UIManager.encadenaFn(_caller, 'fireEvent', function(e) {
                    if (e == 'selectionchange') {
                        if (_this.indice < (_this.posiciones.length - 1)) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                }, 'siguiente');
            }
        }));
        this.btnUbicar = LOG.util.Prototipos.botonAdicionar({
            text: this.idioma.lbBtnUbicar,
            tooltip: this.idioma.ttBtnUbicar,
            iconCls: 'ubicarproducto',
            handler: function() {
                if (_this.nfCantidad.getValue() == 0) {
                    mostrarMensaje(3, _this.idioma.msgCamposVaciosU);
                } else if (_this.nfCantidadUbicar.getValue() < _this.nfCantidad.getValue()) {
                    mostrarMensaje(3, _this.idioma.msgCantidadMayor);
                } else {
                    //if (_this.confubicacion.estructura == 0) {
                        _this.modelo.idubicacion = _this.tcbUbicacion.getValue();
                    //}
                    _this.modelo.salvar({
                        idestructuraubicacion: _this.iddeposito,
                        idproducto: _this.datos.getSelected().json.idproducto,
                        tienelote: _this.tienelote,
                        idlote: _this.idlote,
                        idindicador: _this.datos.getSelected().json.idindicador || _this.idindicador,
                        idmovimiento: _this.datos.getSelected().json.idmovimiento || _this.idmovimiento,
                        proceso: _this.proceso || null
                    }, function() {
                        _this.limpiarCampos();
                        _this.primeraSeleccion = false;
                        _this.vista.storePrincipal.load({
                            callback: function() {
                                if (_this.proceso) {
                                    _this.cargaInicial();
                                } else {
                                    _this.nfCantidadUbicar.setValue( _this.vista.getGridPrincipal().getSelectionModel().getSelected().data.cantidad);
                                }
                            }
                        });
                    });
                    _this.tcbUbicacion.reset();
                    _this.nfCantidad.reset();
                }
            }
        });
        this.listaBotones.add(this.btnUbicar);
        this.btnUbicaciones = LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnVerUbicaciones,
            tooltip: this.idioma.ttBtnVerUbicaciones,
            iconCls: 'deposito',
            disabled: true,
            handler: function() {
                var winUbicaciones = new LOG.lb.ubicacion.winUbicaciones({
                    vista:  _this.vista,
                    campoXUbicar: _this.nfCantidadUbicar,
                    idioma: _this.idioma,
                    idproducto: _this.datos.getSelected().data.idproducto,
                    datos: _this.datos,
                    cargaInicial: _this.cargaInicial.createDelegate(_this),
                    iddeposito: _this.iddeposito,
                    nomDeposito: _this.nomDeposito,
                    proceso: _this.proceso,
                    confubicacion: _this.confubicacion,
                    idmovimiento: (_this.datos.getSelected().data.idmovimiento ) ? _this.datos.getSelected().data.idmovimiento : null
                });
                winUbicaciones.init();
                winUbicaciones.view();
            },
            fnEspecialCondition: function() {
                if (_this.ubicaciones == 0) {
                    return true;
                }
                return false;
            }
        });
        this.modelo.addActionButton(this.btnUbicaciones, true);
        this.listaBotones.add(this.btnUbicaciones);
        this.modelo.addActionButton(this.btnUbicar);
        this.buttons = this.listaBotones.getArray();
    },
    panelDatos: function() {
        var _this = this;
        var fsProducto = new Ext.form.FieldSet({
            title: _this.idioma.tlFSDatosProducto,
            items: [{
                    html: '<table cellspacing="2">' +
                        '<tr >' +
                        '<td width="25%" style="font-weight: bold;">' + _this.idioma.tfCodigoDenom + ':</td>' +
                        '<td width="25%"><label class="cod" style="margin-left:10px !important;" ></label></td>' +
                        '<td width="25%" style="font-weight: bold;">' + _this.idioma.tfUM + ':</td>' +
                        '<td width="25%"><label class="um" style="margin-left:-100px !important;"></label></td>' +
                        '</tr></table>'
                }
            ]
        });

        var capacidad = (_this.confubicacion.capacidad == "1") ? 'block' : 'none';
        var volumen = (_this.confubicacion.volumen == "1") ? 'block' : 'none';
        var peso = (_this.confubicacion.peso == "1") ? 'block' : 'none';
        var fsUbicacion = new Ext.form.FieldSet({
            title: _this.idioma.tlFSDatosUbicacion,
            items: [{
                html: '<table cellspacing="2">' +
                        '<tr >' +
                        '<td width="25%" style="font-weight: bold;">' + _this.idioma.tfAlmacen + ':</td>' +
                        '<td width="25%"><label class="almacen" style="margin-left:-5px !important;" ></label></td>' +
                        '<td width="20%" style="font-weight: bold;">' + _this.idioma.tfArea + ':</td>' +
                        '<td width="20%"><label class="_area" style="margin-left:-15px !important;"></label></td>' +
                        '</tr>' +
                        '<tr >' +
                        '<td width="25%" style="font-weight: bold;">' + _this.idioma.tfUbicacion + ':</td>' +
                        '<td width="25%"><label class="ubicacion" style="margin-left:-5px !important;" ></label></td>' +
                        '<td width="20%" style="font-weight: bold;display:' + capacidad + '">' + _this.idioma.tfEstado + ':</td>' +
                        '<td width="20%"><label class="pestado" style="margin-left:-10px !important;display:' + capacidad + '"></label></td>' +
                        '</tr>' +
                        '<tr >' +
                        '<td width="20%" style="font-weight: bold;display:' + volumen + '">' + _this.idioma.tfEstadoV + ':</td>' +
                        '<td width="20%"><label class="volumen" style="margin-left:-10px !important;display:' + volumen + '"></label></td>' +
                        '<td width="20%" style="font-weight: bold;display:' + peso + '">' + _this.idioma.tfEstadoP + ':</td>' +
                        '<td width="20%"><label class="peso" style="margin-left:-10px !important;display:' + peso + '"></label></td>' +
                        '</tr>' +
                        '</table>'
                }
            ]
        });

        var clsSuperior = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        clsSuperior.addComponent(fsProducto);
        clsSuperior.addComponent(fsUbicacion);

        var clsInferior = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        this.nfCantidadUbicar = new LOG.util.Prototipos.inputDecimal({
            fieldLabel: _this.idioma.cgCantidadPorUbicar,
            name: 'cantubicar',
            editable: false,
            allowBlank: false,
            disabled: true
        });

        clsInferior.addComponent(this.nfCantidadUbicar);
        //Esto esta comentariado porque en el MINFAR pidieron que aunque se ubicara 
        //en el ultimo nivel que saliera todo en forma de arbol, no enun combo
        /*if (_this.confubicacion.estructura == 0) {
            this.tcbUbicacion = new LOG.util.ComboBox({
                fieldLabel: _this.idioma.cmbUbicacion,
                url: '/logistica/utiles/ubicacion/index.php/ubicacion/cargarComboUbicacion',
                hiddenName: 'descripcion',
                displayField: 'descripcion',
                name: 'idubicacion',
                autoLoad: false,
                allowBlank: false,
                valueField: 'idestructuraubicacion',
                listeners: {
                    'select': function(combo, record) {
                        var elementos = document.getElementsByTagName('label');
                        for (var i = 0; i < elementos.length; i++) {
                           
                            if (elementos[i].getAttribute('class') == 'pestado') {
                                elementos[i].innerHTML = record.json.estado;
                            }
                            if (elementos[i].getAttribute('class') == 'ubicacion') {
                                elementos[i].innerHTML = record.json.descripcion;
                            }
                        }
                    }
                }

            });

            this.tcbUbicacion.store.baseParams.iddeposito = _this.iddeposito;
            this.tcbUbicacion.store.baseParams.simple = true;
            this.tcbUbicacion.store.load();
            clsInferior.addComponent(this.tcbUbicacion);
        }
        else {*/
           this.tcbUbicacion = new LOG.util.TreeCombo({
                fieldLabel: _this.idioma.cmbDestino,
                hiddenName: 'idubicacion',
                valueField: 'idubicacion',
                displayField: 'ubicacion',
                url: '/logistica/utiles/ubicacion/index.php/ubicacion/cargarComboUbicacion',
                emptyText: _this.idioma.lbEmptyText,
                selectOnlyLeaf: (_this.confubicacion.estructura == 0) ? true : false,
                node: _this.iddeposito,
                allowBlank: false,
                selectFn: function(n) {
                    if (n.parentNode.attributes.id != _this.iddeposito) {
                        var elementos = document.getElementsByTagName('label');
                        for (var i = 0; i < elementos.length; i++) {
                            if (elementos[i].getAttribute('class') == '_area') {
                                
                            if(n.parentNode.attributes.text!='Elementos'){
                                elementos[i].innerHTML = n.parentNode.attributes.text;
                            }else{
                                 elementos[i].innerHTML = n.attributes.text;
                            }
                                elementos[i].setAttribute('íd', n.parentNode.attributes.id);
                                _this.modelo.idarea = n.parentNode.attributes.id;
                            }
                            if (elementos[i].getAttribute('class') == 'pestado') {
                               
                                elementos[i].innerHTML = (n.attributes.capacidad==-1)? 'No definido':n.attributes.capacidad + '%';
                                _this.modelo.estado = n.parentNode.attributes.id;
                            }
                            if (elementos[i].getAttribute('class') == 'peso') {
                                elementos[i].innerHTML = (n.attributes.peso==-1)? 'No definido':n.attributes.peso + '%';
                                _this.modelo.estado = n.parentNode.attributes.id;
                            }
                            if (elementos[i].getAttribute('class') == 'volumen') {
                                
                                elementos[i].innerHTML = (n.attributes.volumen==-1)? 'No definido':n.attributes.volumen + '%';
                                _this.modelo.estado = n.parentNode.attributes.id;
                            }
                            if (elementos[i].getAttribute('class') == 'ubicacion') {
                                
                                elementos[i].innerHTML = n.attributes.text;
                                elementos[i].setAttribute('íd', n.attributes.id);
                                _this.modelo.idubicacion = n.attributes.id;
                                _this.modelo.esarea = false;
                            }
                        }
                    } else {
                        var elementos = document.getElementsByTagName('label');

                        for (var i = 0; i < elementos.length; i++) {
                            if (elementos[i].getAttribute('class') == '_area') {
                                elementos[i].innerHTML = n.attributes.text;
                                elementos[i].setAttribute('íd', n.attributes.idarea);
                                _this.modelo.idarea = n.attributes.idarea;
                                _this.modelo.esarea = true;
                            }
                            if (elementos[i].getAttribute('class') == 'pestado') {
                               
                                elementos[i].innerHTML = (n.attributes.capacidad==-1)? 'No definido':n.attributes.capacidad + '%';
                                _this.modelo.estado = n.attributes.capacidad;
                                _this.modelo.esarea = true;
                            }
                            if (elementos[i].getAttribute('class') == 'peso') {
                                elementos[i].innerHTML = (n.attributes.peso==-1)? 'No definido':n.attributes.peso + '%';
                                _this.modelo.estado = n.parentNode.attributes.id;
                            }
                            if (elementos[i].getAttribute('class') == 'volumen') {
                                elementos[i].innerHTML = (n.attributes.volumen==-1)? 'No definido':n.attributes.volumen + '%';
                                _this.modelo.estado = n.parentNode.attributes.id;
                            }
                            if (elementos[i].getAttribute('class') == 'ubicacion') {
                                elementos[i].innerHTML = n.attributes.text;
                                elementos[i].setAttribute('íd', n.attributes.id);
                                _this.modelo.idubicacion = n.attributes.idestructuraubicacion;
                            }
                        }
                    }
                }
            });
            clsInferior.addComponent(this.tcbUbicacion);
        //}
        var tipo = this.datos.getSelected().json.decimales == '1' ? 'inputDecimal' : 'inputEntero';
        this.nfCantidad = new LOG.util.Prototipos[tipo]({
            fieldLabel: _this.idioma.nfCantidad,
            name: 'cantidad',
            allowBlank: false,
            minValue: 1
        });
        clsInferior.addComponent(this.nfCantidad);
        var fpDatos = LOG.util.UIManager.initForm({
            items: [clsInferior]
        });

        var panel = LOG.util.UIManager.initPanel({
            frame: true,
            layout: 'form',
            labelAlign: 'top',
            region: 'center',
            items: [clsSuperior, fpDatos]
        });
        this.modelo.bindForm(fpDatos);
        this.add(panel);
    },
    cargarDatosUbicar: function() {
        var _this = this;
        if (this.ocultar) {
            this.nfCantidadUbicar.setValue(this.datoslote.cantporubicar);
        } else {
            if (_this.primeraSeleccion) {
                this.nfCantidadUbicar.setValue(this.datos.getSelected().data.cantidad);
            }
        }
        _this.cargaInicial();
        if (this.datos.getSelected().json.cantidad > 0) {
            var elementos = document.getElementsByTagName('label');
            for (var i = 0; i < elementos.length; i++) {
                if (elementos[i].getAttribute('class') == 'cod') {
                    elementos[i].innerHTML = this.datos.getSelected().json.text + '&nbsp;';
                }
                if (elementos[i].getAttribute('class') == 'um') {
                    elementos[i].innerHTML = this.datos.getSelected().json.umedida + '&nbsp;';
                    if (this.datos.getSelected().json.umedida == null) {
                        elementos[i].innerHTML = "" + '&nbsp;';
                    }
                }
                if (elementos[i].getAttribute('class') == 'cantUbic') {
                    elementos[i].innerHTML = this.datos.getSelected().json.cantidad + '&nbsp;';
                }
                if (elementos[i].getAttribute('class') == 'almacen') {
                    elementos[i].innerHTML = _this.nomDeposito + '&nbsp;';
                }
            }
            _this.tcbUbicacion.reset();
            _this.nfCantidad.reset();
            this.modelo.idubicacion = null;
            this.modelo.idarea = null;
        }
    },
    limpiarCampos: function() {
        var _this = this;
        var elementos = document.getElementsByTagName('label');
        for (var i = 0; i < elementos.length; i++) {
            if (elementos[i].getAttribute('class') == '_area') {
                elementos[i].innerHTML = "" + '&nbsp;';
            }
            if (elementos[i].getAttribute('class') == 'pestado') {
                elementos[i].innerHTML = "" + '&nbsp;';
            }
            if (elementos[i].getAttribute('class') == 'peso') {
                elementos[i].innerHTML = "" + '&nbsp;';
            }
            if (elementos[i].getAttribute('class') == 'volumen') {
                elementos[i].innerHTML = "" + '&nbsp;';
            }
            if (elementos[i].getAttribute('class') == 'ubicacion') {
                elementos[i].innerHTML = "" + '&nbsp;';
            }
            if (elementos[i].getAttribute('class') == 'cod') {
                elementos[i].innerHTML = this.datos.getSelected().json.text + '&nbsp;';
            }
            if (elementos[i].getAttribute('class') == 'um') {
                elementos[i].innerHTML = this.datos.getSelected().json.umedida + '&nbsp;';
                if (this.datos.getSelected().json.umedida == null) {
                    elementos[i].innerHTML = "" + '&nbsp;';
                }
            }
        }
        if (_this.nfCantidadUbicar.getValue() == 0 && _this.proceso) {
            _this.btnUbicarVent.disable();
        }
    },
    show: function() {
        LOG.lb.ubicacion.winUbicar.superclass.show.call(this);
        this.cargarDatosUbicar(false);
    },
    onShowHandler: function() {
        var pos = 0;
        this.st.each(function(item, index) {
            if (item.json.tienelote == '0' && item.json.equipo == '0' && item.json.municion == '0') {
                this.posiciones.push(index);
                if (item.data.idproducto == this.datos.getSelected().data.idproducto) {
                    this.indice = pos;
                }
                pos++;
            }
        }, this);
        Ext.each(this.buttons, function(btn) {
            if (typeof btn.controlFn == 'function') {
                btn.controlFn.createDelegate(this, [btn, this.datos]).call();
            }
        }, this);
    },
    cargaInicial: function() {
        if (this.proceso) {
            var _this = this;
            _this.ubicaciones = 0;
            this.modelo.habilitarBotones(true);
            _this.modelo.cargaInicial({
                url: '/logistica/utiles/ubicacion/index.php/ubicacion/cargarUbicacionesProducto',
                idproducto: this.datos.getSelected().data.idproducto,
                idmovimiento: this.datos.getSelected().data.idmovimiento,
                movUbicacion: true,
                ponerMsg: false
            }, function(r) {
                r[0].forEach(function(item) {
                   _this.ubicaciones += parseFloat(item.cantidad);
                });
                _this.nfCantidadUbicar.setValue(_this.datos.getSelected().data.cantidad - _this.ubicaciones);
                _this.modelo.habilitarBotones(true);
            });
        }
    }
});