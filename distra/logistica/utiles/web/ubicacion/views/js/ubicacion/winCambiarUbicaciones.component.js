Ext.ns('LOG.lb.ubicacion');

LOG.lb.ubicacion.winCambiarUbicaciones = Ext.extend(LOG.util.Window, {
    cantidad: 0,
    constructor: function(config) {
        this.usarAplicar = false;
        config.width = 650;
        config.height = 340;
        config.resizable = false;
        config.idioma = LOG.util.UIManager.apply(LOG.lb.ubicacion.Idioma, LOG.util.Idioma);
        LOG.lb.ubicacion.winCambiarUbicaciones.superclass.constructor.call(this, config);
        this.initComponents();
        this.modelo = new LOG.lb.ubicacion.Model({
            idioma: config.idioma,
            urlController: '/logistica/utiles/ubicacion/index.php/ubicacion/'
        });
        this.panelDatos();
    },
    initComponents: function() {
        var _this = this;

        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
            text: _this.idioma.lbBtnCerrar,
            key : {
                key: 'X',
                ctrl: true,
                alt: true
            }

        });


        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            handler: function() {
                if (_this.confubicacion.estructura == 0) {
                    _this.modelo.idubicacion = _this.tcbUbicacion.getValue();
                }

                if (_this.datosUbicaciones.idubicacion == _this.modelo.idubicacion) {
                    mostrarMensaje(3, _this.idioma.msgError);
                } else if (_this.cantidad.getValue() == 0) {
                    mostrarMensaje(3, _this.idioma.msgValidarCantidad);
                } else if (_this.cantidad.getValue() > _this.datosUbicaciones.cantidad) {
                    mostrarMensaje(3, _this.idioma.msgCantidad);
                } else {
                    var data = {
                        idubicacionproducto: _this.datosUbicaciones.idubicacionproducto, //_this.desubicar.getSelected().data.idubicacionproducto,
                        idubicacion: _this.modelo.idubicacion,
                        idareaproducto: _this.datosUbicaciones.idareaproducto,
                        idarea: _this.datosUbicaciones.idareaproducto, // _this.desubicar.getSelected().data.idareaproducto,
                        cantidad: _this.cantidad.getValue(),
                        proceso: _this.proceso,
                        idmovubicacion: _this.idmovubicacion,
                        idmovimiento: _this.idmovimiento,
                        idproducto: _this.idproducto,
                        bandUbicar: true
                    };
                    _this.modelo.desubicarProductos(Array(data), function() {
                        _this.vista.storePrincipal.load();
                        _this.close();
                    });
                }
            }
        });
    },

    panelDatos: function() {
        var _this = this;
        var fsProducto = new Ext.form.FieldSet({
            title: _this.idioma.tlFSDatosProducto,
            items: [{
                    html: '<table>' +
                            '<tr>' +
                            '<td style="font-weight: bold;">' + _this.idioma.tfCodigoDenom + ':</td>' +
                            '<td><label class="cod"></label></td>' +
                            '</tr>' +
                            '</table>' +
                            '<table>' +
                            '<tr >' +
                            '<td width="25%" style="font-weight: bold;">' + _this.idioma.tfUM + ':</td>' +
                            '<td width="25%"><label class="um" style="margin-left:-70px !important;" ></label></td>' +
                            '<td width="25%" style="font-weight: bold;">' + _this.idioma.tfCantidadAUbicar + ':</td>' +
                            '<td width="25%"><label class="cantUbic" style="margin-left:5px !important;"></label></td>' +
                            '</tr>' +
                            '</table>'


                }]
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
                            '<td width="20%"><label class="area" style="margin-left:-15px !important;"></label></td>' +
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
                }]
        });

        var clsSuperior = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        clsSuperior.addComponent(fsProducto);
        clsSuperior.addComponent(fsUbicacion);

        var clsInferior = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        this.prueba = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.cmbOrigen,
            emptyText: _this.idioma.lbEmptyText,
            hiddenName: 'iddestino',
            valueField: 'iddestino',
            displayField: 'destino',
            disabled: true,
            allowBlank: false
        });

        clsInferior.addComponent(this.prueba);
        var stFormato = new Ext.data.Store({
            url: '/logistica/utiles/ubicacion/index.php/estructuraubicacion/cargarComboformato',
            reader: new Ext.data.JsonReader({
                id: 'idformato',
                root: 'datos',
                fields: [
                    {name: 'idformato'},
                    {name: 'nombre'},
                    {name: 'partes'},
                    {name: 'ultimo_nivel'}
                ]
            })
        });
          //Esto esta comentariado porque en el MINFAR pidieron que aunque se ubicara 
        //en el ultimo nivel que saliera todo en forma de arbol
       /* if (_this.confubicacion.estructura == 0) {
            this.tcbUbicacion = new LOG.util.ComboBox({
                fieldLabel: _this.idioma.cmbDestino,
                url: '/logistica/utiles/ubicacion/index.php/ubicacion/cargarComboUbicacion',
                hiddenName: 'descripcion',
                displayField: 'descripcion',
                name: 'idubicacion',
                allowBlank: false,
                autoLoad: false,
                valueField: 'idestructuraubicacion'
            });
            
            this.tcbUbicacion.store.baseParams.iddeposito = _this.iddeposito;
            this.tcbUbicacion.store.baseParams.simple = true;
            this.tcbUbicacion.store.load();
            clsInferior.addComponent(this.tcbUbicacion);
        } else {*/

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
                                if (n.parentNode.attributes.text != 'Elementos') {
                                    elementos[i].innerHTML = n.parentNode.attributes.text;
                                } else {
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

            this.tcbUbicacion.focus(true,100);
            clsInferior.addComponent(this.tcbUbicacion);
      //  }

        var tipo = this.datos.json.decimales == '1' ? 'inputDecimal' : 'inputEntero';
        this.cantidad = new LOG.util.Prototipos[tipo]({
            fieldLabel: _this.idioma.nfCantidad,
            name: 'cantidad',
            allowBlank: false
        });
        clsInferior.addComponent(this.cantidad);
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
    cargarDatosUbicar: function(data) {
        var _this = this;

        this.prueba.setValue(data.ubicacion);
        var elementos = document.getElementsByTagName('label');
        for (var i = 0; i < elementos.length; i++) {
            if (elementos[i].getAttribute('class') == 'cod') {
                elementos[i].innerHTML = this.datos.json.text + '&nbsp;';
            }
            if (elementos[i].getAttribute('class') == 'um') {
                elementos[i].innerHTML = this.datos.json.umedida + '&nbsp;';
                if (this.datos.json.umedida == null) {
                    elementos[i].innerHTML = "" + '&nbsp;';
                }
            }
            if (elementos[i].getAttribute('class') == 'cantUbic') {
                elementos[i].innerHTML = data.disponible + '&nbsp;';
            }
            if (elementos[i].getAttribute('class') == 'almacen') {
                elementos[i].innerHTML = this.nomDeposito + '&nbsp;';
            }
        }
        ;
    },
    show: function() {
        LOG.lb.ubicacion.winUbicar.superclass.show.call(this);
        this.cargarDatosUbicar(this.datosUbicaciones);
        this.modelo.addActionButton(this.listaBotones.getItem(2));
        this.focus();
    }
});
