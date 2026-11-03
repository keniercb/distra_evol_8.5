Ext.ns('LOG.inv.submayor');
LOG.inv.submayor.MostrarTarjetaPlugin = function () {
    function __conmit(v) {
        LOG.inv.submayor.tarjeta = Ext.extend(LOG.util.Window, {
            constructor: function (config) {
                var _this = this;
                config.resizable = false;
                this.usarAplicar = false;
                this.autoScroll = true;
                config.idioma = LOG.util.UIManager.apply(LOG.inv.submayor.MostrarTarjetaPlugin, LOG.inv.submayor.Idioma);
                this.width = 900;
                this.height = 600;
                this.canttabarriba = 1;
                LOG.inv.submayor.tarjeta.superclass.constructor.call(this, config);
                this.setTitle(config.idioma.tlTarjetaProd);
                this.panelDatos();
                LOG.util.UIManager.apply(this.listaBotones.getItem(0), LOG.util.Prototipos.botonCancelar({}, true));
                this.listaBotones.getItem(2).hide();
            },
            panelDatos: function () {
                var _this = this;
                /*this.tplDatosPanel = new Ext.XTemplate(
                        '<table width="100%" cellpadding="0" cellspacing="0">' +
                        '<tr>' +
                        '<td class="row-title">' + _this.idioma.lbCodigo + '</td>' +
                        '<td class="row-title">' + _this.idioma.lbDenominacionT + '</td>' +
                        '<td class="row-title">' + _this.idioma.lbCodigoProveedor + '</td>' +
                        '<td class="row-title">' + _this.idioma.lbCategoriaT + '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td class="row-detail">{cod}</td>' +
                        '<td class="row-detail">{denom}</td>' +
                        '<td class="row-detail">{cod_prov}</td>' +
                        '<td class="row-detail">{categ}</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td class="row-title">' + _this.idioma.lbPrecioUnitarioC + '</td>' +
                        '<td class="row-title">' + _this.idioma.lbPrecioPromedioC + '</td>' +
                        '<td class="row-title">' + _this.idioma.lbUM + '</td>' +
                        '<td class="row-title">' + _this.idioma.lbImporteC + '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td class="row-detail">{prec_unit}</td>' +
                        '<td class="row-detail">{prec_prom}</td>' +
                        '<td class="row-detail">{um}</td>' +
                        '<td class="row-detail">{importe}</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td class="row-title">' + _this.idioma.lbExistencia + '</td>' +
                        '<td class="row-title">' + _this.idioma.lbCantDisp + '</td>' +
                        '<td class="row-title">' + _this.idioma.lbMinimo + '</td>' +
                        '<td class="row-title">' + _this.idioma.lbMaximo + '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td class="row-detail">{exist}</td>' +
                        '<td class="row-detail">{cant_disp}</td>' +
                        '<td class="row-detail">{min}</td>' +
                        '<td class="row-detail">{max}</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td class="row-title" colspan="3">' + _this.idioma.lbCuenta + '</td>' +
                        '<td class="row-title">' + _this.idioma.lbEspecialidad + '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td class="row-detail" colspan="3">{cuenta}</td>' +
                        '<td class="row-detail">{especialidad}</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td class="row-title" colspan="4">' + _this.idioma.lbCuentaAlt + '</td>' +

                        '</tr>' +
                        '<tr>' +
                        '<td class="row-detail" colspan="4">{cuentaalt}</td>' +

                        '</tr>' +
                        '<tr>' +
                        '<td class="row-title" colspan="4">'+ _this.idioma.lbMonedas + '</td>'+
                        '</tr>' +
                        '<tr>' +
                        '<td class="row-title">' + _this.idioma.lbPrecioUnitarioA + '</td>' +
                        '<td class="row-title">' + _this.idioma.lbPrecioPromedioA + '</td>' +
                        '<td class="row-title" colspan="2">' + _this.idioma.lbImporteA + '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td class="row-detail">{prec_unit_alt}</td>' +
                        '<td class="row-detail">{preciopa}</td>' +
                        '<td class="row-detail" colspan="2">{importe_alt}</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td class="row-title">' + _this.idioma.lbNombreEntidadT + '</td>' +
                        '<td class="row-title">' + _this.idioma.lbNomAlmacen + '</td>' +
                        '<td class="row-title" colspan="2">' + _this.idioma.lbFechaEmisionT + '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<td class="row-detail">{nombreentidad}</td>' +
                        '<td class="row-detail">{area}</td>' +
                        '<td class="row-detail" colspan="2">{fechaemision}</td>' +
                        '</tr>' +
                        '</table>'
                        );
                this.tplDatosPanel.compile();*/
                var ubics = [];
                
                if (v.getSmPrincipal().getSelected().data.equipo == 1) {
                    ubics = v.nroSerie.gpPrincipal.store.collect('idestructuraubicacion');
                }
                if (v.getSmPrincipal().getSelected().data.tienelote == 1) {
                    ubics = v.panelUbic.gpPrincipal.store.collect('ubicacion');
                }
                if (v.getSmPrincipal().getSelected().data.municion == 1) {
                    ubics = v.municiones.gpPrincipal.store.collect('idestructuraubicacion');
                }
                if (v.getSmPrincipal().getSelected().data.tienelote == 0 && v.getSmPrincipal().getSelected().data.municion == 0 && v.getSmPrincipal().getSelected().data.equipo == 0) {
                    ubics = v.ubicacionarea.gpPrincipal.store.collect('area');
                }
                this.panelInferior = new LOG.inv.submayor.panelCargarImagenes({
                    idioma: _this.idioma,
                    region: 'north',
                    id: 'idPanelImagen' + _this.canttabarriba,
                    incrementoID: _this.canttabarriba,
                    imagenesIndicador: (v.smGridPrincipal.getSelected()) ? v.smGridPrincipal.getSelected().json.imagenesIndicador : null,
                    height: 210
                });
                this.txtUbicacion = new Ext.form.TextArea({
                    fieldLabel: _this.idioma.tlUbicacion,
                    name: 'ubicacion',
                    width: '99%',
                    height: '70px',
                    readOnly: true,
                    value: ubics.join()
                });
                this.ubicacion = LOG.util.UIManager.initPanel({
                    border: false,
                    region: 'center',
                    layout: 'fit',
                    autoHeigth: true,
                    //anchor: '100%',
                    items: [_this.getGridUbicacion()]
                });
                this.fsUbicacion = new Ext.form.FieldSet({
                    title: _this.idioma.cgUbicacion,
                    labelAlign: 'top',
                    region: 'center',
                    layout: 'fit',
                    autoHeigth: true,
                    border: true
                });
                this.fsUbicacion.add(this.ubicacion);
                this.fsImagenesProd = new Ext.form.FieldSet({
                    title: _this.idioma.lbDsImgProd + v.smGridPrincipal.getSelected().json.denominacion,
                    labelAlign: 'top',
                    height: 260,
                    region: 'north',
                    border: true
                });
                this.fsImagenesProd.add(this.panelInferior);
                this.panelEste = LOG.util.UIManager.initPanel({
                    border: false,
                    region: 'west',
                    layout: 'border',
                    split: true,
                    width: 280,
                    //frame: true,
                    items: [this.fsImagenesProd, this.fsUbicacion]
                });
                this.fsDatosGenerales = new Ext.form.FieldSet({
                    title: _this.idioma.tlDatosGen,
                    labelAlign: 'top',
                    region: 'center',
                    autoScroll: true,
                    heigth: 500,
                    anchor: '95%',
                    layout: 'fit',
                    defaults: {bodyStyle: 'background-color:#fff; padding: 5px'}
                });
                this.panelSuperior = LOG.util.UIManager.initPanel({
                    border: false,
                    region: 'center',
                    layout: 'border',
                    items: [this.fsDatosGenerales]
                });
                /*this.fsDatosGenerales.add({html: '<p style="font-size:12px">' + 'Entidad' + ": <span>" + v.getGridPrincipal().store.reader.jsonData.estructura + "</span></p>"});
                this.fsDatosGenerales.add({html: '<p style="font-size:12px">' + 'Almacen' + ": <span>" + 'Nombre de la entidad' + "</span></p>"});*/

                this.frmDatosEntidad = new LOG.util.ColumnForm({columnas: 2});
                this.frmDatosAlmacen = new LOG.util.ColumnForm({columnas: 2});
                this.frmDatosEntidad.addComponent({html: '<p style="font-size:12px">' + _this.idioma.lbEntidadMT + ": <span>" + v.getGridPrincipal().store.reader.jsonData.estructura + "</span></p><br>"});
                this.frmDatosAlmacen.addComponent({html: '<p style="font-size:12px">' + _this.idioma.lbAlmacen + ": <span>" + v.smGridPrincipal.getSelected().json.deposito + "</span></p><br>"});
                this.frmDatosEntidad.getColumn(0).columnWidth = 1;
                this.frmDatosAlmacen.getColumn(0).columnWidth = 1;


                this.frmDatosCodigos = new LOG.util.ColumnForm({columnas: 2});
                this.frmDatosCodigos.addComponent({html: '<p style="font-size:12px">' + _this.idioma.tlCodigo + ": <span>" + v.smGridPrincipal.getSelected().data.codigo + "</span></p>"});
                this.frmDatosCodigos.addComponent({html: '<p style="font-size:12px">' + _this.idioma.lbCodProveedor + ": <span>" + (v.smGridPrincipal.getSelected().data.codigoproveedor || '-') + "</span></p><br>"});

                this.frmDatosDenominacion = new LOG.util.ColumnForm({columnas: 2});
                this.frmDatosDenominacion.addComponent({html: '<p style="font-size:12px">' + _this.idioma.lbDenominacionT + " <span>" + v.smGridPrincipal.getSelected().data.denominacion + "</span></p><br>"});
                this.frmDatosDenominacion.getColumn(0).columnWidth = 1;

                this.frmDatosCatUM = new LOG.util.ColumnForm({columnas: 2});
                this.frmDatosCatUM.addComponent({html: '<p style="font-size:12px">' + _this.idioma.lbCategoria + ": <span>" + (v.smGridPrincipal.getSelected().data.nomcategoria || '-') + "</span></p><br>"});
                this.frmDatosCatUM.addComponent({html: '<p style="font-size:12px">' + _this.idioma.lbUM + "<span>" + (v.smGridPrincipal.getSelected().data.umedida || '-') + "</span></p><br>"});

                this.frmDatosCatUM.addComponent({html: '<p style="font-size:12px">' + _this.idioma.lbPrecioPromedioC + ": <span>" + (Ext.util.Format.number(v.smGridPrincipal.getSelected().data.precio, '0,000.000000') || '-') + ' ' + codigoContable + "</span></p>"});
                this.frmDatosCatUM.addComponent({html: '<p style="font-size:12px">' + _this.idioma.lbPrecioPromedioC + ": <span>" + (Ext.util.Format.number(v.smGridPrincipal.getSelected().json.precioalternativo, '0,000.000000') || '-') + ' ' + codigoAlternativa + "</span></p>"});
                this.frmDatosCatUM.addComponent({html: '<p style="font-size:12px">' + _this.idioma.lbMonedaCont + "</p><br>"});
                this.frmDatosCatUM.addComponent({html: '<p style="font-size:12px">' + _this.idioma.lbMonedaAlt + "</p><br>"});

                this.frmDatosCatUM.addComponent({html: '<p style="font-size:12px">' + _this.idioma.lbImporteC + ": <span>" + (Ext.util.Format.number(parseFloat(v.smGridPrincipal.getSelected().data.importecalculado), '0,000.000') || '-') + ' ' + codigoContable + "</span></p>"});
                this.frmDatosCatUM.addComponent({html: '<p style="font-size:12px">' + _this.idioma.lbImporteC + ": <span>" + (Ext.util.Format.number(v.smGridPrincipal.getSelected().json.importealtcalculado, '0,000.000') || '-') + ' ' + codigoAlternativa + "</span></p>"});
                this.frmDatosCatUM.addComponent({html: '<p style="font-size:12px">' + _this.idioma.lbMonedaCont + "</p><br>"});
                this.frmDatosCatUM.addComponent({html: '<p style="font-size:12px">' + _this.idioma.lbMonedaAlt + "</p><br>"});

                this.frmDatosCatUM.addComponent({html: '<p style="font-size:12px">' + _this.idioma.cgExistencia + ": <span>" + (v.smGridPrincipal.getSelected().data.existencia || '-') + "</span></p><br>"});
                this.frmDatosCatUM.addComponent({html: '<p style="font-size:12px">' + _this.idioma.lbDisponible + ": <span>" + (v.smGridPrincipal.getSelected().data.disponible || '-') + "</span></p><br>"});

                this.frmDatosCatUM.addComponent({html: '<p style="font-size:12px">' + _this.idioma.cgMinimo + ": <span>" + (v.smGridPrincipal.getSelected().data.minimo || '-') + "</span></p><br>"});
                this.frmDatosCatUM.addComponent({html: '<p style="font-size:12px">' + _this.idioma.cgMaximo + ": <span>" + (v.smGridPrincipal.getSelected().data.maximo || '-') + "</span></p><br>"});

                this.frmDatosCuentaCont = new LOG.util.ColumnForm({columnas: 2});
                this.frmDatosCuentaCont.addComponent({html: '<p style="font-size:12px">' + _this.idioma.lbCuentaContable + ": <span>" + (v.smGridPrincipal.getSelected().json.cuentacontable || '-') + "</span></p><br>"});
                this.frmDatosCuentaCont.addComponent({html: '<p style="font-size:12px">' + _this.idioma.lbCuentaAlt + " <span>" + (v.smGridPrincipal.getSelected().json.cuentaalternativa || '-') + "</span></p><br>"});
                this.frmDatosCuentaCont.getColumn(0).columnWidth = 1;
                this.frmDatosCuentaCont.getColumn(1).columnWidth = 1;

                this.frmDatosFecha = new LOG.util.ColumnForm({columnas: 2});
                this.frmDatosFecha.addComponent({html: '<p style="font-size:12px">' + _this.idioma.lbFechaApertura + ": <span>" + (v.smGridPrincipal.getSelected().json.fechaminima || '-') + "</span></p><br>"});
                this.frmDatosFecha.addComponent({html: '<p style="font-size:12px">' + _this.idioma.lbFechaUltimomov + ": <span>" + (v.smGridPrincipal.getSelected().json.fechamaxima || '-') + "</span></p><br>"});

                this.frmDatosEspecialidad = new LOG.util.ColumnForm({columnas: 2});
                this.frmDatosEspecialidad.addComponent({html: '<p style="font-size:12px">' + _this.idioma.lbEspecialidad + ": <span>" + (v.smGridPrincipal.getSelected().json.especialidad || '-') + "</span></p><br>"});
                this.frmDatosEspecialidad.getColumn(0).columnWidth = 1;

                this.frmDatosGenerales = LOG.util.UIManager.initPanel({
                    items: [this.frmDatosEntidad, this.frmDatosAlmacen, this.frmDatosCodigos, this.frmDatosDenominacion, this.frmDatosCatUM, this.frmDatosCuentaCont, this.frmDatosFecha, this.frmDatosEspecialidad]
                });
                this.fsDatosGenerales.add(this.frmDatosGenerales);
                /*this.panelSuperior.on('render', function() {
                    this.tplDatosPanel.overwrite(this.panelSuperior.body, {
                        cod: v.smGridPrincipal.getSelected().data.codigo || '-',
                        denom: v.smGridPrincipal.getSelected().data.denominacion || '-',
                        cod_prov: v.smGridPrincipal.getSelected().data.codigoproveedor || '-',
                        categ: v.smGridPrincipal.getSelected().json.nomcategoria || '-',
                        prec_unit: Math.abs(parseFloat(v.smGridPrincipal.getSelected().data.precio + v.smGridPrincipal.getSelected().json.precioalternativo).toFixed(6)) || '-',
                        prec_unit_alt: Math.abs( v.smGridPrincipal.getSelected().data.preciounitalt) || '-',
                        prec_prom:  Math.abs(v.smGridPrincipal.getSelected().data.precio) || '-',
                        preciopa:  Math.abs(v.smGridPrincipal.getSelected().json.precioalternativo) || '-',
                        um: v.smGridPrincipal.getSelected().data.umedida || '-',
                        importe: Math.abs(v.smGridPrincipal.getSelected().data.importetotal)  || '-',
                        importe_alt: Math.abs(v.smGridPrincipal.getSelected().json.importealtcalculado) || '-',
                        exist: v.smGridPrincipal.getSelected().data.existencia || '-',
                        cant_disp: v.smGridPrincipal.getSelected().data.disponible || '-',
                        min: v.smGridPrincipal.getSelected().data.minimo || '-',
                        max: v.smGridPrincipal.getSelected().data.maximo || '-',
                        cuenta: v.smGridPrincipal.getSelected().json.nomcuenta || '-',
                        cuentaalt: v.smGridPrincipal.getSelected().json.nomcuentaalt || '-',
                        nombreentidad: v.getGridPrincipal().store.reader.jsonData.estructura || '-',
                        area: v.nomDeposito || '-',
                        especialidad: v.smGridPrincipal.getSelected().json.especialidad || '-',
                        fechaemision: v.smGridPrincipal.getSelected().json.fechaemision || '-'
                    });
                }, this);*/


                //this.fsDatosGenerales.add(this.panelSuperior);

                this.formulario = LOG.util.UIManager.initPanel({
                    region: 'center',
                    layout: 'border',
                    border: false,
                    frame: true,
                    labelAlign: 'top',
                    items: [this.panelEste, this.panelSuperior/*this.ubicacion, this.panelInferior*/]
                });
                this.add(this.formulario);
                this.doLayout();
            },
            getGridUbicacion: function () {
                var _this = this;
                this.columnasUb = new LOG.util.List();
                this.columnasUb.add({
                    dataIndex: 'idubicacion'
                });
                this.columnasUb.add({
                    header: _this.idioma.cgUbicacion,
                    dataIndex: 'ubicacion',
                    default: true,
                    width: 100,
                    autoExpand: true
                });
                this.columnasUb.add(LOG.util.Prototipos.columnaCantidad({
                    header: _this.idioma.lbCantidad,
                    dataIndex: 'cantidad',
                    default: true,
                    align: 'right',
                    autoExpand: true
                }));

                this.smGridUb = LOG.util.UIManager.initSelectionModel(3, false);

                var cls = LOG.util.UIManager.proccessColumns(this.columnasUb, this.smGridUb);
                this.cmGridUb = new Ext.grid.ColumnModel(cls.columns);
                this.recStGridUb = Ext.data.Record.create(cls.fields);

                this.storeUb = new Ext.data.Store({
                    url: 'datosGridUbicacionPorArea',
                    autoLoad: true,
                    reader: new Ext.data.JsonReader({
                        id: "idubicacionproducto",
                        root: "datos"
                    }, this.recStGridUb)
                });

                this.storeUb.on({
                    'beforeload': function (st) {
                        st.initBaseParams.iddeposito = v.smGridPrincipal.getSelected().data.idestructura;
                        st.initBaseParams.idproducto = v.smGridPrincipal.getSelected().data.idproducto;
                        st.baseParams.iddeposito = v.smGridPrincipal.getSelected().data.idestructura;
                        st.baseParams.idproducto = v.smGridPrincipal.getSelected().data.idproducto;
                    },
                    'load': function () {

                    }
                });

                this.gpUb = LOG.util.UIManager.initEditableGridPanel(this.cmGridUb, this.storeUb, this.smGridUb);
                return this.gpUb;
            },
            crearDataview: function () {
                var _this = this;
                var elementos = document.getElementsByTagName('img');
                var objImg;
                for (var i = 0; i < elementos.length; i++) {
                    if (elementos[i].getAttribute('id') == 'idImagenLogoCM') {
                        objImg = elementos[i];
                    }
                }
                var dataview = new Ext.DataView({
                    store: new Ext.data.JsonStore({
                        url: 'http://conmat5.xetid.cu/logistica/inventario/movimiento/index.php/transferenciarea/cargarDocumentos',
                        autoLoad: true,
                        root: 'datos',
                        fields: [{
                            name: 'idestructura'
                        }, {
                            name: 'idlogo'
                        }]
                    }),
                    tpl: new Ext.XTemplate(
                        '<tpl for=".">',
                        '<div class="thumb-wrap" id="{name}">',
                        '<div class="thumb" >',
                        '</div>',
                        '</tpl>',
                        '<div class="x-clear"></div>'
                    ),
                    autoHeight: true,
                    multiSelect: true,
                    overClass: 'x-view-over',
                    itemSelector: 'div.thumb-wrap',
                    emptyText: 'No hay imágenes que mostrar',
                    plugins: [new Ext.DataView.DragSelector()]
                });
                return dataview;
            }
        });
        this.tarjeta = new LOG.inv.submayor.tarjeta({
            idioma: this.idioma
        });
        this.tarjeta.show();
    }


    return {
        init: function (v) {
            v.insertToolbarButton(LOG.util.UIManager.createBtn({
                iconCls: 'mostrar',
                text: LOG.inv.submayor.Idioma.lbBtnMostrarTarjeta,
                tooltip: LOG.inv.submayor.Idioma.ttBtnMostrarTarjeta,
                disabled: true,
                key: {
                    ctrl: true,
                    alt: true,
                    key: 'M'
                },
                handler: function () {
                    __conmit(v);
                },
                controlFn: function (b, _caller) {
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (this.getCount() == 1) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }, 'tarjeta');
                    /*_caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                        if (e == 'rowselect') {
                            b.enable();
                        }
                        if (e == 'rowdeselect') {
                            b.disable();
                        }
                    });*/
                    _caller.getGridPrincipal().fireEvent = _caller.getGridPrincipal().fireEvent.createSequence(function (e) {
                        if (e == 'rowdblclick') {
                            __conmit(v);
                        }
                    });
                }
            }), 0);
        }
    };
};

LOG.inv.submayor.RestablecerDisponible = function () {

    return {
        init: function (view) {
            view.insertToolbarButton(LOG.util.UIManager.createBtn({
                iconCls: 'registro',
                text: LOG.inv.submayor.Idioma.lbRestablecer,
                tooltip: LOG.inv.submayor.Idioma.ttlbRestablecer,
                disabled: true,
                handler: function() {
                    mostrarMensaje(2, LOG.inv.submayor.Idioma.msgRestabDisp, function (btn) {
                        if (btn == 'ok') {
                            Ext.MessageBox.wait(LOG.inv.submayor.Idioma.msgRestablecer, LOG.util.Idioma.msgEspere || '...');
                            Ext.Ajax.request({
                                url: 'restablecerDisponible',
                                method: 'POST',
                                params: {
                                    idproducto: view.getSmPrincipal().getSelected().data.idproducto
                                },
                                callback: function (o, s, r) {
                                    Ext.MessageBox.hide();
                                    view.getStorePrincipal().reload({});
                                }
                            });
                        }
                    });
                },
                controlFn(b, __caller){
                    if (__caller.grantedAction('RRestablecer')) {
                        b.setVisible(true);
                    } else {
                        b.setVisible(false);
                    }
                    b.disable();
                    LOG.util.UIManager.encadenaFn(__caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                }
            }), 1)
        }
    }
};

LOG.inv.submayor.RestablecerUbicacion = function () {

    return {
        init: function (view) {
            view.insertToolbarButton(LOG.util.UIManager.createBtn({
                iconCls: 'ubicarproducto',
                text: LOG.inv.submayor.Idioma.lbRestUbicacion,
                tooltip: LOG.inv.submayor.Idioma.ttlbRestUbicacion,
                handler: function() {
                    mostrarMensaje(2, LOG.inv.submayor.Idioma.msgRestUbicacion, function (btn) {
                        if (btn == 'ok') {
                            Ext.MessageBox.wait(LOG.inv.submayor.Idioma.msgRestExitoUbicacion, LOG.util.Idioma.msgEspere || '...');
                            Ext.Ajax.request({
                                url: 'restablecerUbicaciones',
                                method: 'POST',
                                callback: function (o, s, r) {
                                    Ext.MessageBox.hide();
                                    view.getStorePrincipal().reload({});
                                }
                            });
                        }
                    });
                },
                controlFn(b, __caller){
                    if (__caller.grantedAction('RRestablecer')) {
                        b.setVisible(true);
                    } else {
                        b.setVisible(false);
                    }
                }
            }), 2)
        }
    }
};

LOG.inv.submayor.RestablecerSubmayor = function () {

    return {
        init: function (view) {
            view.insertToolbarButton(LOG.util.UIManager.createBtn({
                iconCls: 'registro',
                text: LOG.inv.submayor.Idioma.lbRestablecerAlmacen,
                tooltip: LOG.inv.submayor.Idioma.ttlbRestablecerAlmacen,
                disabled: true,
                handler: function() {
                    mostrarMensaje(2, LOG.inv.submayor.Idioma.msgRestabAlm, function (btn) {
                        if (btn == 'ok') {
                            Ext.MessageBox.wait(LOG.inv.submayor.Idioma.msgRestablecerAlm, LOG.util.Idioma.msgEspere || '...');
                            Ext.Ajax.request({
                                url: 'restablecerSubmayor',
                                method: 'POST',
                                params: {
                                    idestructura: view.idDeposito
                                },
                                callback: function (o, s, r) {
                                    Ext.MessageBox.hide();
                                    view.getStorePrincipal().reload({});
                                }
                            });
                        }
                    });
                },
                controlFn(b, __caller){
                    if (__caller.grantedAction('RRestablecerAll')) {
                        b.setVisible(true);
                        b.enable();
                    } else {
                        b.setVisible(false);
                        b.disable();
                    }
                }
            }), 3)
        }
    }
};
LOG.inv.submayor.DesactivarTarjeta = function () {

    return {
        init: function (view) {
            view.insertToolbarButton(LOG.util.UIManager.createBtn({
                iconCls: 'deshabilitar',
                text: LOG.inv.submayor.Idioma.lbDesactivarTarjeta,
                tooltip: LOG.inv.submayor.Idioma.ttlbDesactivarTarjeta,
                disabled: true,
                handler: function() {
                    mostrarMensaje(2, LOG.inv.submayor.Idioma.msgDesactivarTarjeta, function (btn) {
                        if (btn == 'ok') {
                            Ext.MessageBox.wait(LOG.inv.submayor.Idioma.msgDesactivandoTarjeta, LOG.util.Idioma.msgEspere || '...');
                            Ext.Ajax.request({
                                url: 'desactivarTarjeta',
                                method: 'POST',
                                params: {
                                    idproducto: view.getSmPrincipal().getSelected().data.idproducto
                                },
                                callback: function (o, s, r) {
                                    Ext.MessageBox.hide();
                                    view.getStorePrincipal().reload({});
                                }
                            });
                        }
                    });
                },
                controlFn(b, __caller){
                    if (__caller.grantedAction('RDESCTARJ')) {
                        b.setVisible(true);
                    } else {
                        b.setVisible(false);
                    }
                    b.disable();
                    LOG.util.UIManager.encadenaFn(__caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
                                b.enable();
                            } else {
                                b.disable();
                            }
                        }
                    });
                }
            }), 4)
        }
    }
};