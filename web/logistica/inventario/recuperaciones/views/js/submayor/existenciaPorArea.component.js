/**
 * Esta clase muestra la existencia de un producto por areas existentes
 * @copyright XETID
 * @author División Gestión de Entidades
 * @version 1.0
 */
Ext.ns('LOG.inv.submayor');
LOG.inv.submayor.ExistenciaPorAreaPlugin = function() {
    function __conmit(v) {
        LOG.inv.submayor.existarea = Ext.extend(LOG.util.UITemplate, {
            constructor: function(config) {
                this.formaVisualizacion = 'ventana';
                this.modoSeleccion = 1;
                this.busquedaAvanzada = true;
                this.autoLoad = false;
                this.idGridPrincipal = 'idarea';
                this.urlBusquedaGridPrincipal = 'verExistenciaPorArea';
                LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma);
                LOG.inv.submayor.existarea.superclass.constructor.call(this, config);
                this.getVistaPrincipal().title = config.idioma.tlExistArea;
                this.getVistaPrincipal().maximizable = false;
                this.getVistaPrincipal().height = 460;
                this.getVistaPrincipal().width = 480;
                this.getVistaPrincipal().resizable = false;
                //this.getVistaPrincipal().maximized = true;
            },
            init: function() {
                LOG.inv.submayor.existarea.superclass.init.call(this);
                this.initComponents();
            },
            initDefaultButtons: function() {
                var _this = this;
                this.getVistaPrincipal().buttons[0].text = this.idioma.lbBtnCerrar;
                this.getVistaPrincipal().buttons[1].setVisible(false);
                this.getVistaPrincipal().buttons[2].setVisible(false);
            },
            initComponents: function() {
                var _this = this;

                var clsPrincipal = LOG.util.UIManager.initColumnForm({
                    columnas: 1
                });

                var datosProd = new Ext.form.FieldSet({
                    style: '-moz-border-radius:5px',
                    layout: 'form',
                    //border: false,
                    title: _this.idioma.tlDatosProd,
                    items: [{
                            html: '<table width="310" border="0">' +
                                    '<tr>' +
                                    '<td><b>' + this.idioma.lbCodigo + '</b></td>' +
                                    '<td><b>' + this.idioma.lbDescripcion + '</b></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td><label class="codigo"></label><br><br></td>' +
                                    '<td><label class="denominacion"></label><br><br></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td><b>' + this.idioma.lbExistenciaTotal + '</b></td>' +
                                    '<td><b>' + this.idioma.lbDisponibTotal + '</b></td>' +
                                    '</tr>' +
                                    '<tr>' +
                                    '<td><label class="existencia"></label><br><br></td>' +
                                    '<td><label class="disponible"></label><br><br></td>' +
                                    '</tr>' +
                                    '</table>'
                        }]
                });

                clsPrincipal.addComponent(datosProd);
                this.panelSuperior = LOG.util.UIManager.initPanel({
                    region: 'north',
                    layout: 'fit',
                    height: 155,
                    frame: true,
                    items: new Ext.form.FieldSet({
                        border: false,
                        items: [clsPrincipal]
                    })
                });
                this.panelPrincipal.add(this.panelSuperior);
            },
            initDefaultColumns: function() {
                var _this = this;

                this.addGridColumn({
                    header: _this.idioma.cgArea,
                    width: 110,
                    dataIndex: 'area',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.cgExistencia,
                    width: 110,
                    dataIndex: 'existenciatotal',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.cgDisponibilidad,
                    width: 110,
                    dataIndex: 'disponible',
                    default: true
                });
            },
            //----cargar el id del producto selecionado en el grid
            render: function() {
                var vist = LOG.inv.submayor.existarea.superclass.render.call(this);
                this.getStorePrincipal().baseParams.idproducto = v.smGridPrincipal.getSelected().data.idproducto;
                this.getStorePrincipal().load();
                this.cargarDatosProducto();
                return vist;
            },
            //------termina de cargar el id del producto selecionado en el grid

            cargarDatosProducto: function() {
                var elementos = document.getElementsByTagName('label');
                for (var i = 0; i < elementos.length; i++) {
                    // console.info(i+' - '+elementos[i].getAttribute('class'));
                    if (elementos[i].getAttribute('class') == 'codigo') {
                        elementos[i].innerHTML = v.smGridPrincipal.getSelected().data.codigo;
                    }
                    if (elementos[i].getAttribute('class') == 'denominacion') {
                        elementos[i].innerHTML = v.smGridPrincipal.getSelected().data.denominacion;
                    }
                    if (elementos[i].getAttribute('class') == 'existencia') {
                        elementos[i].innerHTML = v.smGridPrincipal.getSelected().data.existencia;
                    }
                    if (elementos[i].getAttribute('class') == 'disponible') {
                        elementos[i].innerHTML = v.smGridPrincipal.getSelected().data.disponible;
                    }
                }
                ;
            }
        });

        var existarea = new LOG.inv.submayor.existarea({
            idioma: LOG.inv.submayor.Idioma
        });

        existarea.init();
        existarea.view();
    }

    return {
        init: function(v) {
            v.addToolbarButton(LOG.util.Prototipos.botonVer({
                //text: LOG.inv.submayor.Idioma.lbBtnExistenciaPorArea,
                handler: function() {
                    __conmit(v);
                },
                //-----------validacion show/hide del boton
                controlFn: function(b, _caller) {
                    b.disable();
                    _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                        if (e == 'rowselect') {
                            b.enable();
                        }
                        if (e == 'rowdeselect') {
                            b.disable();
                        }
                    });
                }
                //----------termina la validacion show/hide del boton
            }));
        }
    };
};