/**
 * Created by yoendy on 10/27/2015.
 */
Ext.ns('LOG.aft.documentoPat');
LOG.aft.documentoPat.View = Ext.extend(LOG.aft.documento.View, {
    tipo_area_seleccionada: 'entidad',
    movimientoWindow: false,
    tipo: 1,
    constructor: function(config) { 
        config.tipo = 1;     
        LOG.aft.documentoPat.View.superclass.constructor.call(this, config);        
        
       /* this.model = new LOG.aft.documento.Model({
            idioma: config.idioma,
            scope: _this
        });
        _this.model.cargarEntidadComboArea({
            fnEntidad: _this.cargarDatosNecesarios
        });*/
    },
    initDefaultButtons: function() {
        var _this = this;
        LOG.aft.documentoPat.View.superclass.initDefaultButtons.call(this);    
        
    },
     initDefaultColumns: function(){
        var _this = this;
        LOG.aft.documentoPat.View.superclass.initDefaultColumns.call(this);
        /*this.addGridColumn({
            header: 'Observaciones',
            width: 120,            
            dataIndex: 'observaciones',
            default: true
        });*/
    },
    
    mostrarWinMovimiento: function(data) {
        var _this = this;

        if (_this.movimientoWindow == false || !_this.movimientoWindow.getVistaPrincipal().isVisible()) {

            // Ext.getBody().mask(_this.idioma.lbMsgCargandoDatos, 'x-mask-loading');
            var record = _this.getSmPrincipal().getSelected();
            var nodoPadre = {
                attributes: {
                    text: _this.caminoNodoSeleccionado,
                    id: _this.idNodoSeleccionado
                }
            };

            var datos = {
                iddocumento: record.get('iddocumento'),
                idoperacion: record.get('idoperacion'),
                idestado: record.get('estado'),
                idcentrocosto: record.get('idcentrocosto'),
                tipodoc: record.get('tipodoc'),
                nrodoc: record.get('nrodoc'),
                fecha: record.get('fechacontable'),
                estado: LOG.lb.documento.Estado[record.get('estado')],
                idarearesp: record.get('idarearesp'),
                identidadpadre: nodoPadre.attributes.id,
                codigooperacion: record.get('codigooperacion'),
                arearesp: record.get('arearesp'),
                tipo_interfaz: record.get('tipo_interfaz'),
                idestructurapadre: _this.idPadreNodoSeleccionado, //record.get('idestructura'),
                iddocinventario: (record.get('iddocinventario')) ? record.get('iddocinventario') : false
            };
            if (record.get('codigooperacion') == "OPER_INV_TOTAL") {
                datos.inventarioTotal = true;

            } else if (record.get('codigooperacion') == "OPER_INV_PARCIAL" || record.get('codigooperacion') == "OPER_INV_PAR_MENSUAL") {
                datos.inventarioParcial = true;
                datos.idmediosInventario = record.get('idmediosInventario');
                datos.idnaturalezasInventario = record.get('idnaturalezasInventario');
                datos.idareasInventario = record.get('idareasInventario');
                datos.idespecialidadesInventario = record.get('idespecialidadesInventario');
                datos.mensualInventario = record.get('mensualInventario');
                if (record.get('codigooperacion') == "OPER_INV_PAR_MENSUAL") {
                    datos.inventarioParcialMensual = true;
                }
            }

            if ((record.get('codigooperacion') == "OPER_AJUSTE_FALTANTE") || (record.get('codigooperacion') == "OPER_AJUSTE_SOBRANTE")) {
                Ext.Ajax.request({
                    url: 'getExisteDocAjustesInventario',
                    method: 'POST',
                    params: {
                        iddocumento: record.get('iddocumento')
                    },
                    callback: function(options, success, response) {
                        var rd = Ext.decode(response.responseText);
                        if (rd.datos == 1) {
                            datos.operacionAjuste = false;
                        } else {
                            datos.operacionAjuste = true;
                        }
                        fireEvent.createSequence
                    }
                });
            }
            
            _this.movimientoWindow = new LOG.aft.movimientoPat/*Ext.aft.movActivosFijos*/({
                datos: datos, 
                tipo: 1,
                listeners: {
                    'hide': function() {
                        _this.movimientoWindow = false;
                        //_this.teclasCalientes();
                    },
                    'close': function() {
                        _this.movimientoWindow = false;
                        //  _this.teclasCalientes();
                    }
                },
                _parent: _this
            });

            _this.movimientoWindow.init();
            _this.movimientoWindow.getVistaPrincipal().maximized = true;
            _this.movimientoWindow.view();

        }
    },
    onBtnAdicionarClick: function(modificar, record, dat_fs, desabilitado, datos_traslado) {
        var _this = this;


        if (!this.ventanaActivos || !this.ventanaActivos.isVisible()) {

            var _this = this;
            /*
             * idoperacion y iddoc son para el caso de un traslado entre entidades
             * y son el tipo y la operacion del tipo de documento que se
             * configuro para relizar una recepcion de traslado entre entidades
             */
            var idoperacion = null;
            var iddoc = null;
            if (datos_traslado != undefined) {
                idoperacion = datos_traslado.idoperacion;
                iddoc = datos_traslado.iddoc;
            }
            var desabilitar_cmp = (modificar && record.get('estado') != 1) ? true : false;

            this.formFields = new LOG.aft.documento.TabPanelWinGestionarPatr({
                idioma: this.idioma,
                idarea_seleccionada: _this.idNodoSeleccionado,
                datos: record,
                disable_comp: desabilitar_cmp,
                modificar: modificar,
                idoperacion: idoperacion,
                area_seleccinada: _this.tipo_area_seleccionada,
                iddoc: iddoc,
                nodoPadre: {
                    attributes: {
                        text: _this.denomPadreNodoSeleccionado,
                        id: _this.idPadreNodoSeleccionado
                    }
                },
                cmpGeneral: _this,
                iddocrecepcion: (datos_traslado) ? datos_traslado.datos[0].iddocumento : null,
                smGrid: this.gpPrincipal.getSelectionModel().getSelected(),
                idestructuracomun: _this.idPadreNodoSeleccionado,
                datos_traslado: datos_traslado,
            });
        }
        if ((!_this.winGestionarDocumento || !_this.winGestionarDocumento.isVisible()) && (!_this.comboDeposito || _this.idNodoSeleccionado != '')) {

            //  Para insertar dentro de un array en una posicion x. Para construir el formulario Gestionar
            Array.prototype.injectArray = function(idx, arr) {
                return this.slice(0, idx).concat(arr).concat(this.slice(idx));
            };

            var fields = [
                _this.getObservacionesAddDoc(modificar, record, dat_fs, desabilitado),
                {
                    xtype: 'hidden',
                    name: 'iddocumento',
                    value: (modificar == 'modificar') ? record.get('iddocumento') : ''
                }
            ];

            if (this.formFields) {
                fields = fields.injectArray(0, this.formFields);
            }

            var tituloADD = _this.idioma.lbTitleWinAddDocumento;
            var tituloMOD = _this.idioma.lbTitleWinModDocumento;

            this.winGestionarDocumento = new LOG.aft.documento.winDocAdd({
                title: (modificar == 'modificar') ? tituloMOD : tituloADD,
                idioma: _this.idioma,
                datos_traslado: datos_traslado,
                modificar: modificar,
                dat_fs: dat_fs,
                fields: fields,
                scope: _this

            });
            _this.winGestionarDocumento.show();

            var heigthfpGestionarDoc = _this.winGestionarDocumento.fpGestionarDoc.getSize();
            var heigthfieldSet = _this.winGestionarDocumento.fieldSet.getSize();
            var totalheigth = (heigthfpGestionarDoc.height + heigthfieldSet.height) + 100;
            if (totalheigth > 500) {
                totalheigth = 500;
            }
            _this.winGestionarDocumento.setHeight(totalheigth);

        }
    },
});
