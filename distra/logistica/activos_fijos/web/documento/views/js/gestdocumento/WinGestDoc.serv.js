Ext.ns('Ext.aft');
Ext.aft.WinGestDocServicio = Ext.extend(Ext.Window, {
    constructor: function(config) {
        var _this = this;
        this.closeAction = 'hide';
        _this.listeners = {
            'hide': function() {
                if (_this.formFields) {
                    _this.formFields.destroy();
                }
            }
        }
        Ext.apply(this, config);
        _this.idioma = LOG.aft.documento.Idioma;
        _this.cargarEncabezado();
        Ext.aft.WinGestDocServicio.superclass.constructor.call(this, arguments);
    },
    cargarEncabezado: function(config) {

        var _this = this;
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/documento/index.php/gestdocumento/getencabezadogastionardoc',
            method: 'POST',
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                if (_this.modificar == 'modificar') {
                    rd.fecha = _this.record.data.fechacontable
                    rd.estado = _this.record.data.estadod
                    rd.cant = _this.record.data.cant_medios
                }
                _this.dat_fs = rd;
                _this._initComponent();
            }
        });
    },
    _initComponent: function() {
        var _this = this;
        var tituloADD = _this.idioma.lbTitleWinAddDocumento;
        var tituloMOD = _this.idioma.lbTitleWinModDocumento;
        var titleWin = '';
        if (_this.modificar == 'modificar') {
            _this.btnAplicarDocumento.hide();
            titleWin = tituloMOD;
        }
        _this.title = (titleWin == '') ? tituloADD : titleWin;

        _this.layout = 'fit';
        _this.closeAction = 'destroy';
        _this.modal = true;
        _this.resizable = false;
        this.width = 700;
        this.height = 450;

        if (_this.tipo_area_seleccionada != 'entidad') {
            _this.dat_fs.arearesp = _this.denomArea;
        }
        Array.prototype.injectArray = function(idx, arr) {
            return this.slice(0, idx).concat(arr).concat(this.slice(idx));
        };

        var fields = [
            _this.getObservacionesAddDoc(_this.modificar, _this.record, _this.dat_fs, _this.desabilitado),
            {
                xtype: 'hidden',
                name: 'iddocumento',
                value: (_this.modificar == 'modificar') ? _this.record.get('iddocumento') : ''
            }
        ];
        this.btnAceptarDocumento = new Ext.Button({
            text: _this.idioma.lbBtnAceptar,
            tooltip: _this.idioma.lbTtBtnAceptar,
            iconCls: 'aceptar',
            handler: function() {
                _this.onAceprtarAdicionarDocumento('close');
            }
        });

        this.btnAplicarDocumento = new Ext.Button({
            text: _this.idioma.lbBtnAplicar,
            tooltip: _this.idioma.lbTtBtnAplicar,
            iconCls: 'aplicar',
            hidden: (_this.regoperativo) ? true : false,
            handler: function() {
                _this.onAceprtarAdicionarDocumento(_this.modificar);
            }
        });

        this.btnCancelarDocumento = new Ext.Button({
            text: _this.idioma.lbBtnCancelar,
            tooltip: _this.idioma.lbTtBtnCancelar,
            iconCls: 'cancelar',
            handler: function() {
                _this.close();
            }
        });
        this.formFields = new LOG.aft.documento.TabPanelWinGestionar({
            idioma: _this.idioma,
            idarea_seleccionada: _this.idestructurapadre,
            datos: _this.record,
            disable_comp: _this.desabilitar_cmp,
            modificar: _this.modificar,
            idoperacion: _this.idoperacion,
            operacionesEntrada: _this.operacionesEntrada,
            area_seleccinada: _this.tipo_area_seleccionada,
            iddoc: _this.iddoc,
            regOperativo: true,
            cmpGeneral: _this,
            iddocrecepcion: (_this.datos_traslado) ? _this.datos_traslado.datos[0].iddocumento : null,
        });

        if (this.formFields) {
            fields = fields.injectArray(0, _this.formFields);
        }

        var heigth_total = 0;
        for (var i = 0; i < fields.length - 1; i++) {
            heigth_total += fields[i].height;
        }
        _this.height = heigth_total;

        this.fieldset = new Ext.Panel({
            border: false,
            frame: true,
            autoHeight: true,
            items: [
                {
                    xtype: 'fieldset',
                    title: _this.idioma.lbTitleFieldSet,
                    layout: 'column',
                    autoHeight: true,
                    items: [
                        {
                            columnWidth: .34,
                            layout: 'form',
                            items: [
                                {
                                    html: _this.idioma.lbEntidad + ':'
                                }, /*
                                 {
                                 html: _this.idioma.lbCbDeposito + ':'
                                 },*/
                                {
                                    html: _this.idioma.lbFecha + ':'
                                },
                                {
                                    html: _this.idioma.lbEstadoa + ':'
                                }
                            ]
                        },
                        {
                            columnWidth: .64,
                            layout: 'form',
                            items: [
                                {
                                    id: 'idhtmlentidad',
                                    html: /*(_this.nodoPadre.text) ? _this.nodoPadre.text : */_this.dat_fs.entidad
                                }, /*
                                 {
                                 id: 'idhtmlarea',
                                 html: _this.dat_fs.arearesp
                                 },*/
                                {
                                    id: 'idhtmlfecha',
                                    html: _this.dat_fs.fecha
                                },
                                {
                                    id: 'idhtmlestado',
                                    html: _this.dat_fs.estado
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        this.fpGestionarDoc = new Ext.form.FormPanel({
            region: 'center',
            labelAlign: 'top',
            frame: true,
            autoHeight: true,
            items: fields,
            trackResetOnLoad: true
        });


        _this.items = [_this.fieldset, _this.fpGestionarDoc];
        _this.buttons = [_this.btnCancelarDocumento, _this.btnAplicarDocumento, _this.btnAceptarDocumento];

        Ext.aft.WinGestDocServicio.superclass.initComponent.call(this);
        this.show();
    },
    getObservacionesAddDoc: function(modificar, record, dat_fs, desabilitado) {
        return {};
    },
    onAceprtarAdicionarDocumento: function(cerrarWin) {
        var _this = this;
        if (!_this.fpGestionarDoc.getForm().isValid()) {
            mostrarMensaje(3, _this.idioma.msgFaltanDatos);
            return;
        }
        Ext.getBody().mask(_this.idioma.MaskGuardarDocumento, 'x-mask-loading');
        var parametros = {
            iddeposito: _this.formFields.comboAreaResp.getValue(),
            identidad: _this.formFields.comboAreaResp.getValue()
        }
        if (_this.modificar == 'modificar') {
            var parametros = {
                iddeposito: _this.deposito == true ? _this.formFields.comboAreaResp.getValue() : null,
                idoperacion: _this.idoperacion,
                modificar: 2
            }
        }
        if (_this.datos_traslado) {
            var arrayDatos = new Array();
            for (var i = 0; i < _this.datos_traslado.datos.length; i++) {
                arrayDatos[i] = {
                    idregnumerico: _this.datos_traslado.datos[i].idregnumerico,
                    iddocumentoOld: _this.datos_traslado.datos[i].iddocumento,
                    idproducto: _this.datos_traslado.datos[i].idproducto,
                    idmovimiento: _this.datos_traslado.datos[i].idmovimiento,
                    idmovregnumerico: _this.datos_traslado.datos[i].idmovregnumerico,
                    idestructuracomunOld: _this.datos_traslado.datos[i].idestructuracomun,
                    idprod: _this.datos_traslado.datos[i].idprod
                }
            }

            parametros = {
                iddeposito: _this.deposito == true ? _this.formFields.comboAreaResp.getValue() : null,
                datosTraslado: Ext.encode(arrayDatos),
                idoperacion: _this.datos_traslado.idoperacion,
                iddoc: _this.datos_traslado.iddoc
            }
        }
        _this.fpGestionarDoc.getForm().submit({
            url: '/logistica/activos_fijos/documento/index.php/gestdocumento/adicionardocumento',
            method: 'POST',
            params: parametros,
            success: function(form, action) {
                Ext.getBody().unmask();
                var response = Ext.util.JSON.decode(action.response.responseText);
                if (_this.modificar == 'modificar') {
                    mostrarMensaje(1, _this.idioma.msgModificarDocCorrecta);
                } else {
                    mostrarMensaje(1, _this.idioma.msgAdicionCorrecta);
                }
                if (cerrarWin == 'close') {
                    _this.close();
                }
                _this.doAction(response.iddocumento, response.nrodoc);

            },
            failure: function() {
                Ext.getBody().unmask();
                if (_this.modificar == 'modificar') {
                    mostrarMensaje(3, _this.idioma.msgFaltanDatos);
                }
            }
        });
    },
    refrescarTabPanel: function() {
        var _this = this;
        _this.formFields.idarea_seleccionada = _this.formFields.comboAreaResp.getValue();
        _this.formFields.area_selccionada = _this.tipo_area_seleccionada;

        _this.formFields.idestructuracomun = (_this.cmpAreaRespWin) ? _this.cmpAreaRespWin.dameNodoEntidadPertenece
                (_this.formFields.comboAreaResp.getValue()).id : _this.formFields.comboAreaResp.getValue()
                ;
        _this.formFields.disable_comp = false;
        _this.dat_fs.arearesp = _this.formFields.comboAreaResp.getRawValue();
        _this.formFields.storeTipoDoc.load();
        _this.fieldset.render();
    }
});