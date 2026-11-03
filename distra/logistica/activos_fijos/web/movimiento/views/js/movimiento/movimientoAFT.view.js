/**
 * Created by yoendy on 11/9/2015.
 */
Ext.ns('LOG.aft.movimiento');
LOG.aft.movimiento = Ext.extend(LOG.util.UITemplate, {
    formaVisualizacion: 'ventana',
    modoSeleccion: 2,
    concepto: "producto",
    idmovseleccionado: 0,
    bloqueada: false,
    busquedaBasica: true,
    gridEditable : true,
    datos: new Array(),
    constructor: function (config) {
        var _this = this;

        _this.idioma = LOG.util.UIManager.apply(LOG.aft.gestmovimiento.Idioma, LOG.util.Idioma);
        _this.urlBusquedaGridPrincipal = 'cargarproductos';
        _this.dirController = '/logistica/activos_fijos/movimiento/index.php/movimiento';
        _this.autoLoad = false;
        _this.idGridPrincipal = 'idmovimiento';
        _this.tipo = config.tipo;
        _this.masivo = config.masivo;
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/movimiento/index.php/movimiento/cargardatosmovimientos',
            method: 'POST',
            params:{
                tipo: _this.tipo
            },
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);

                // Creando variables globales
                alternativa = rd.datos.alternativa;
                autogenerado = rd.datos.autogenerado
                monedaalternativa = rd.datos.monedaalternativa
                monedacontable = rd.datos.monedacontable
                nommonedaalternativa = rd.datos.nommonedaalternativa
                nommonedacontable = rd.datos.nommonedacontable
            }
        });



        Ext.apply(this, config);

        LOG.aft.movimiento.superclass.constructor.call(this, config);

        this.model = new LOG.aft.movimiento.Model({
            scope: _this
        });
        
        _this.vistaPrincipal.getButton(0).setText(_this.idioma.lbBtnCerrar);
        _this.vistaPrincipal.getButton(0).handler = function () {
            _this.vistaPrincipal.close();
            _this._parent.gpPrincipal.getStore().reload();
        };
        _this.vistaPrincipal.getButton(1).setVisible(true);
        _this.vistaPrincipal.getButton(1).handler = function () { // boton aplicar,guardar
        /*var modified = [];
        var modifiedrecord = _this.getStorePrincipal().getModifiedRecords();
        Ext.each( modifiedrecord,function (rec) {
            modified.push(rec.data);
             });
        console.info(_this.model.adicionarProductos)            
        _this.model.adicionarProductos({
            record: Ext.encode(modified),
            iddocumento: _this.record.data.iddocumento
            }),
            console.info(_this.model.adicionarProductos)*/  
        _this._parent.gpPrincipal.getStore().reload();
        };
        _this.vistaPrincipal.getButton(2).setVisible(true);
        _this.vistaPrincipal.getButton(2).handler = function () { //boton aceptar ,guardar y cerrar
       /* var modified = [];
        var modifiedrecord = _this.getStorePrincipal().getModifiedRecords();
        Ext.each( modifiedrecord,function (rec) {
        modified.push(rec.data);
         });
        console.info(modified)
        //  _this.modelo.adicionarProductos({
        // record: Ext.encode(modified)
        //     }),*/
         _this.vistaPrincipal.close();
            
         _this._parent.gpPrincipal.getStore().reload();
        };
        UCID.portal.cargarAcciones(window.frameElement.id, function () {
        
        });

        _this.plugins = new Array();
        for (var i = 0; i < arrCampos.length; i++) {
            _this.attatchPlugin(arrCampos[i]);
        }

    },
    render: function (config) {
        var _this = this;
        var exp = false;
        var pEast = LOG.util.UIManager.initPanel({
            hideCollapseTool: true,
            collapsible: true,
            collapseMode: 'mini',
            autoScroll: true,
            animCollapse: false,
            animate: false,
            split: true,
            collapsed: true,
            titleCollapse: true,
            region: 'east',
            useSplitTips: true,
            layout: 'fit',
            listeners: {
                'beforecollapse': function () {
                    exp = false;
                    if (_this.btnExpand) {
                        _this.btnExpand.setText(_this.idioma.btnExpandir);
                    }
                },
                'beforeexpand': function () {
                    if (_this.btnExpand) {
                        _this.btnExpand.setText(_this.idioma.btnContraer);
                    }
                    exp = true;
                }
            },
            width: 300
        });
        this.propertyGridAtribDinamicos = new Ext.erp.PropertyGrid({
            schema: 'mod_datosmaestrosmeta',
            globalDefault: true,
            editable: false,
            listeners: {
                'show': function (propertyGrid) {

                    pEast.add(propertyGrid);
                    pEast.doLayout(true);
                }
            },
            preOperacion: function () {

                var record = _this.gpPrincipal.getSelectionModel().getSelected();

                if (record) {
                    this.llavesForaneas = Array();

                    this.llavesForaneas.push({
                        key: 'idindicador',
                        value: record.get('idprod')
                    });

                    this.idtabla = record.get('idtabla');
                    this.idtablageneral = record.get('idtablageneral');
                    this.ar_where = 'idindicador = ' + record.get('idprod');

                } else
                    throw 'Record no seleccionado'

            }
        });      
        var pNorth = LOG.util.UIManager.initPanel({
            region: 'north',
            border: false,
            split: true,
            collapseMode: 'mini',
            frame: true,
            height: 110,
            items: [
                {
                    xtype: 'fieldset',
                    anchor: '100%',
                    title: _this.idioma.lbTitleFieldSet,
                    layout: 'column',
                    autoHeight: true,
                    items: [
                        {
                            columnWidth: .20,
                            layout: 'form',
                            items: [
                                {
                                    html: _this.idioma.lbAreaResp + ':'
                                },
                                {
                                    html: _this.idioma.lbNumero + ':'
                                },
                                {
                                    html: _this.idioma.lbFecha + ':'
                                },
                                {
                                    html: _this.idioma.lbEstado + ':'
                                }
                            ]
                        },
                        {
                            columnWidth: .7,
                            layout: 'form',
                            items: [
                                {
                                    html: _this.datos.arearesp
                                },
                                {
                                    id: 'idnrodocFSMovimiento',
                                    html: (_this.datos.nrodoc != "") ? _this.datos.nrodoc : "-"
                                },
                                {
                                    html: _this.datos.fecha
                                },
                                {
                                    id: 'idestadoFSMovimiento',
                                    html: _this.datos.estado
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        this.panelGrid.add(pNorth);
        this.panelGrid.add(pEast);

        var vista = LOG.aft.movimiento.superclass.render.call(this, config);

        this.gpPrincipal.getSelectionModel().fireEvent = this.gpPrincipal.fireEvent.createSequence(function (e) {
            if (e == 'rowselect') {

                if (_this.idmovseleccionado != _this.getSmPrincipal().getSelected().get('idmovimiento')) {

                    var record = _this.getSmPrincipal().getSelected();

                    if (record.get('arridtablasgenerales').replace(/[\,\-1]/ig, '').length > 0) {


                        _this.propertyGridAtribDinamicos.setContenido(record.get('arridtablasgenerales'));
                        pEast.expand();

                    } else {
                        pEast.collapse();
                    }
                    _this.idmovseleccionado = _this.getSmPrincipal().getSelected().get('idmovimiento');
                }
                _this.gestionarBotones();
            }
            if (e == 'rowdeselect') {
                _this.propertyGridAtribDinamicos.setContenido();
                pEast.collapse();
                _this.idmovseleccionado = null;
                _this.gestionarBotones();
            }
        });


        var title = _this.idioma.lbMsgTitleWinMovs;
        title = title.replace('_tipoDoc', _this.datos.tipodoc);
        title = title.replace('_nroDoc', _this.datos.nrodoc);
        _this.getVistaPrincipal().setTitle(title);

        var params = {};
        var socpeFilter = _this.gridFilter;

        var cbGrupo = new LOG.util.ComboBox({
            width: 200,
            displayField: 'denominacionlarga',
            valueField: 'idgruposubgrupo',
            hiddenName: 'idgruposubgrupo',
            triggerAction: 'all',
            selectOnFocus: true,
         //   grupocombo:_this.grupocombo,
            forceSelection: true,
            minChars: 0,
            tpl: '<tpl for="."><div ext:qtip="{denominacionlarga}" class="x-combo-list-item">{denominacionlarga}</div></tpl>',
            pageSize: 20,
            resizable: true,
            listWidth: 300,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        params.criterio = socpeFilter.tfBusqueda.getValue();
                        params.idgruposubgrupo = cmp.getValue();
                        _this.gpPrincipal.getStore().load({
                            params: params
                        });
                    }
                }
            },
            store: new Ext.data.Store({
                url: _this.dirController + '/cargargrupos',
                autoLoad: true,
                reader: new Ext.data.JsonReader({
                    root: 'datos',
                    id: 'idgruposubgrupo'
                }, [
                    {
                        name: 'idgruposubgrupo'
                    },
                    {
                        name: 'denominacion'
                    },
                    {
                        name: 'denominacionlarga'
                    }
                ])
            })
        });
        this.storePrincipal.fireEvent = this.storePrincipal.fireEvent.createSequence(function (e) {
            if (e == 'beforeload') {
                if(this)
                if (_this.datos.inventarioParcialMensual || _this.datos.inventarioTotal) {
                    if (_this.datos.idestado == '1') {
                        _this.storePrincipal.baseParams.elaboracion = 2;
                        (_this.datos.inventarioParcialMensual) ?
                            _this.storePrincipal.baseParams.idestructura = Ext.encode(_this.datos.idareasInventario.split(",")) : "";
                        (_this.datos.inventarioTotal) ?
                            _this.storePrincipal.baseParams.idestructura = Ext.encode(_this.datos.idarearesp.split(",")) : "";
                    }
                    if (_this.datos.inventarioParcialMensual) {
                        _this.storePrincipal.baseParams.inventarioParcialMensual = 2;
                    } else if (_this.datos.inventarioTotal) {
                        _this.storePrincipal.baseParams.inventarioTotal = 2;
                    }
                }
                else {
                    _this.storePrincipal.baseParams.iddocIntegracionInventario = (_this.datos.iddocinventario) ? true : false;
                }

                _this.storePrincipal.baseParams.iddocumento = _this.datos.iddocumento;
                if (socpeFilter.tfBusqueda.getValue()) {
                    _this.storePrincipal.baseParams.criterio = socpeFilter.tfBusqueda.getValue();
                }
                if (cbGrupo.getValue()) {
                    _this.storePrincipal.baseParams.idgruposubgrupo = cbGrupo.getValue();
                }
                _this.storePrincipal.baseParams.tipo = (_this.tipo == 1) ? _this.tipo : 0;
                _this.storePrincipal.baseParams.natobjobraP = _this.datos.natobjobraP;
                _this.storePrincipal.baseParams.natinmuebleP = _this.datos.natinmuebleP;
                //_this.storePrincipal.baseParams.natactivosP = _this.datos.natactivosP;
            }
            if (e == 'load') {
                if(_this.datos.idestado != 1 && _this.storePrincipal.reader.jsonData.guardados == 1  ){
           
                    _this.btnImprimirResumen.enable()
                }


                _this.idmovseleccionado = null;
                if (_this.storePrincipal.getTotalCount() > 0) {
                    if (_this.storePrincipal.reader.jsonData.indicadoresNoMostrar) {
                        _this.indicadoresNoMostrar = _this.storePrincipal.reader.jsonData.indicadoresNoMostrar;
                    }
                } else {
                    mostrarMensaje(1, 'No existen datos que mostrar');
                    _this.indicadoresNoMostrar = new Array();
                }
                if (((_this.datos.idestado == '1' && _this.datos.tipo_interfaz == "entrada") || (_this.datos.idestado == 1 && _this.datos.tipo_interfaz == "entrada")) && _this.storePrincipal.getCount() == 0) {
                    _this.btnImportarListado.enable();
                } else {
                    _this.btnImportarListado.disable();
                }
                _this.gestionarBotones();
            }
        });
        this.storePrincipal.load();

        socpeFilter.btnLimpiar.handler = function () {
            cbGrupo.reset();
            if (socpeFilter.btnLimpiar.disabled) {
                return;
            }
            socpeFilter.tfBusqueda.setValue('');
            socpeFilter.tfBusqueda.blur();
            var params = {};
            Ext.apply(params, socpeFilter.store.limitParams);
            params.criterio = '';
            if (_this.gpPrincipal.store.limitParams.limit) {
                params.limit = _this.gpPrincipal.store.limitParams.limit;
            }
            if (_this.gpPrincipal.store.limitParams.start) {
                params.start = _this.gpPrincipal.store.limitParams.start;
            }
            socpeFilter.store.filtrado = false;
            socpeFilter.store.reload({
                params: params
            });
        };

        socpeFilter.btnFiltar.handler = function () {

            if (socpeFilter.btnFiltar.disabled) {
                return;
            }
            /*if (Ext.isEmpty(socpeFilter.tfBusqueda.getValue())) {
             socpeFilter.onTriggerClear();
             return;
             }*/
            if (cbGrupo.isValid() && socpeFilter.tfBusqueda.isValid()) {
                var params = {};
                Ext.apply(params, socpeFilter.store.limitParams);
                socpeFilter.store.filtrado = true;
                socpeFilter.store.baseParams.criterio = socpeFilter.tfBusqueda.getValue();
                socpeFilter.store.baseParams.idgruposubgrupo = cbGrupo.getValue();
                socpeFilter.store.reload({
                    params: params
                });
            }
        };

        this.btnExpand = new Ext.Button({
            text: (exp) ? _this.idioma.btnContraer : _this.idioma.btnExpandir,
            tooltip: _this.idioma.btnTtExpCont,
            iconCls: 'expandir',
            handler: function () {
                if (exp) {
                    pEast.collapse();

                } else {
                    pEast.expand();

                }
            }

        });
        _this.getGridPrincipal().getTopToolbar().insert(2, '-', {
            xtype: 'tbtext',
            text: _this.idioma.hdGrupo + ':'
        }, cbGrupo);
        _this.getGridPrincipal().getTopToolbar().insert(9, '->', _this.btnExpand);

        this.getGridPrincipal().on({
            'beforeedit': function (e) {
                // console.info(_this)
                // if (_this.datos.idestado != 1 && _this.datos.codigooperacion != "OPER_MOD_PROPIEDAD" ) {
                //     e.cancel = true;
                // } 
                // else {
                //     e.cancel = false;
                // }

                if (_this.datos.codigooperacion != "OPER_MOD_PROPIEDAD" || _this.datos.idestado != 1){
                    e.cancel = true;
                } else {
                    e.cancel =false ;
                }
            },
            'afteredit': function (e) {
                var params = {};
                if (e.field == "naturaleza") {
                    params = {
                        idproducto: e.record.data.idproducto,
                        idnaturaleza: e.record.data.idnaturaleza,
                        movimiento : e.record.data.idmovimiento
                    };
                }
                if (e.field == "descripciongrupo") {
                    params = {
                        idproducto: e.record.data.idproducto,
                        idgruposubgrupo: e.record.data.idgruposubgrupo,
                        movimiento : e.record.data.idmovimiento
                    };
                }

                if (e.field == "denominacion") {
                    params = {
                        idproducto: e.record.data.idproducto,
                        denominacion: e.record.data.denominacion,
                        movimiento : e.record.data.idmovimiento
                    };
                }
                console.info(params)
                   
                Ext.MessageBox.wait(_this.idioma.msgEnviandoDatos, _this.idioma.msgEspere || '...');
                _this.model.modificarMedios(params, function () {
                    Ext.MessageBox.hide();
                    mostrarMensaje(1, _this.idioma.msgDatosCorrectos);
                    _this.getStorePrincipal().reload();
                });
            }
        });
        console.info(_this)


        _this.getVistaPrincipal().doLayout();

        return vista;
    },
    initDefaultColumns: function () {      
        var _this = this;
        this.addGridColumn({
            header: _this.idioma.hdCodProd,
            width: 100,
            default: true,
            dataIndex: 'codigo'
        });
        this.addGridColumn({
            header: _this.idioma.hdDenominacion,
            width: 150,
            default: true,
            dataIndex: 'denominacion',
            autoExpand: true,
            editable: false,
            editor: LOG.util.Prototipos.inputTexto(),
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
               /* var marcamodelo = record.get('descripcionmarcamodelo');
                return value + ((marcamodelo != null) ? ' - ' + marcamodelo : ' ');*/
            
           if(value){
            if(this.editor.isDirty()){
                if(value == this.editor.getValue()) {
                    record.set('denominacion',this.editor.getValue());
                    value = this.editor.getRawValue();
                }
            }
            return value;
        }return '';
        }
        });

        // this.cbNaturaleza = new LOG.util.TreeCombo({
        //     // url: '/logistica/utiles/plugin/index.php/sistemasexternos/getNaturalezas',
        //     // //name: 'idnaturaleza',
        //     // selectOnlyLeaf: true,
        //     // fieldLabel: 'Naturaleza',
        //     // allowBlank: false,
        //     // hiddenName: 'idnaturaleza',
        //     // valueField: 'id',
        //     // displayField: 'text'/*,
        //     // resizable: true,
        //     // listWidth: 300*/
        //     type: 'combo',
        //     url: '/logistica/utiles/plugin/index.php/sistemasexternos/getNaturalezas',
        //     valueField: 'idnaturaleza',
        //     displayField: 'denominacion',
        //     dataIndex: 'naturaleza',
            

        // }),
        // this.addGridColumn({            
        //     header: 'Naturaleza',
        //     width: 200,
        //     default: true,
        //     dataIndex: 'naturaleza',
        //     editor: _this.cbNaturaleza,
        //     renderer: function(value, metaData, record, rowIndex, colIndex, store) {
        //         if(value){
        //             if(this.editor.isDirty()){
        //                 if(value == this.editor.getValue()) {
        //                     record.set('idnaturaleza',this.editor.getValue());
        //                     value = this.editor.getRawValue();
        //                 }
        //             }
        //             return value;
        //         }
        //         return '';
        //     }

        // });
        // this.addGridColumn({
        //     header: _this.idioma.hdGrupo,
        //     width: 120,
        //     default: true,
        //     dataIndex: 'descripciongrupo',
        //     editor: new LOG.util.ComboBox({
        //         width: 200,
        //         displayField: 'denominacionlarga',
        //         valueField: 'idgruposubgrupo',
        //         hiddenName: 'idgruposubgrupo',
        //         triggerAction: 'all',
        //         selectOnFocus: true,
        //         forceSelection: true,
        //         minChars: 0,
        //       //  tpl: '<tpl for="."><div ext:qtip="{denominacionlarga}" class="x-combo-list-item">{denominacionlarga}</div></tpl>',
        //         pageSize: 20,
        //         resizable: true,
        //         listWidth: 400,
        //         listeners: {
        //             'specialkey': function (cmp, e) {
        //                 if (e.getKey() == Ext.EventObject.ENTER) {
        //                     params.criterio = socpeFilter.tfBusqueda.getValue();
        //                     params.idgruposubgrupo = cmp.getValue();
        //                     _this.gpPrincipal.getStore().load({
        //                         params: params
        //                     });
        //                 }
        //             }
        //         },
        //         store: new Ext.data.Store({
        //             url: _this.dirController + '/cargargrupos',
        //             autoLoad: true,
        //             reader: new Ext.data.JsonReader({
        //                 root: 'datos',
        //                 id: 'idgruposubgrupo'
        //             }, [
        //                 {
        //                     name: 'idgruposubgrupo'
        //                 },
        //                 {
        //                     name: 'denominacion'
        //                 },
        //                 {
        //                     name: 'denominacionlarga'
        //                 }
        //             ])
        //         })
        //     }),
        //     renderer: function(value, metaData, record, rowIndex, colIndex, store) {
        //         if(value){
        //             if(this.editor.isDirty()){
        //                 if(value == this.editor.getValue()) {
        //                     record.set('idgruposubgrupo',this.editor.getValue());
        //                     value = this.editor.getRawValue();
        //                 }
        //             }
        //             return value;
        //         }
        //         return '';
        //     }
        // });
        if (_this.datos.inventarioTotal && _this.datos.idestado == 1) {
            this.addGridColumn({
                dataIndex: 'idoperacion',
                default: false
            });
            this.addGridColumn({
                header: 'Operaci\xf3n',
                width: 45,
                hideable: false,
                dataIndex: 'idoperacion',
                align: 'center',
                renderer: function (value, metaData) {
                    var i = 0;
                    while (i < _this.datos.arregloOperaciones.length) {
                        if (_this.datos.arregloOperaciones[i].idoperacion == value) {
                            return _this.datos.arregloOperaciones[i].denominacion;
                        }
                        i += 1;
                    }
                },
                default: true
            });
        }

        if((_this.datos.inventarioTotal || _this.datos.inventarioParcialMensual) && _this.datos.idestado == 1)
        {
            this.addGridColumn({
                header: 'N\xb0 de documento',
                width: 150,
                default: true,
                dataIndex: 'nrodoc'
            });
        }
        this.addGridColumn({
            header: _this.idioma.hdCantidad,
            width: 80,
            align: 'right',
            default: true,
            editable: false, // (!_this.inventarioParcial && !_this.inventarioTotal),
            dataIndex: 'cantidad',
            renderer: function (value, meta, record) {
                var valor = record.data.cantidad;
                return parseInt(valor);
            },
            editor: new Ext.form.NumberField({
                regexp: /^[0-9]{1,25}$/,
                selectOnFocus: (!_this.inventarioParcial && !_this.inventarioTotal)
//                        listeners:{
//                            focus: function(t){
//                                t.selectText(0,t.getValue().length);
//                            }
//                        }
            })
        });

        this.addGridColumn({
            dataIndex: 'idproducto',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idgruposubgrupo',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idnaturaleza',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idmovimiento',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'observaciones',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'arridtablas',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'arridtablasgenerales',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idtabla',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idtablageneral',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idprod',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'vidautil',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'coeficiente',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'porcientorecuperacion',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'tasafiscal',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'tasafiscalmax',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'descripcionmarcamodelo',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'responsable',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'denomresponsable',
            default: false
        });


        if (/*_this.datos.inventarioParcialMensual ||*/ _this.datos.inventarioTotal) {
            this.addGridColumn({
                // id: 'area',
                hidden: false,
                hideable: false,
                header: '\xc1rea',
                agrupador: true,
                width: 250,
                dataIndex: 'area',
                default: true
            });
            this.addGridColumn({
                dataIndex: 'idestructuraop',
                default: false
            });


        }

        

    },
    initDefaultButtons: function () {
        var _this = this;


        var arrayNotInidnaturaleza = new Array();
        arrayNotInidnaturaleza.push(natobjobraP,natinmuebleP);
        
		var params = {};
		params.idnaturalezaexcluir = Ext.encode(arrayNotInidnaturaleza);
        params.idoperacion = _this.datos.idoperacion;

		
		var handler_add = function () {
			_this.onBtnAdicionarProdClick(params);
		};
		
		if(_this.datos.tipo_interfaz == "no_entrada" 
      
            )
            {
			handler_add = function(){
				var winAddRn = new LOG.movimiento.aft.winSeleccionarRegistros({
					idioma: _this.idioma,
					idarearesp: _this.datos.idarearesp,
					iddocumento: _this.datos.iddocumento,
					idoperacion: _this.datos.idoperacion,
					grid: _this.getGridPrincipal(),
					interfaz: _this.getVistaPrincipal(),
                    filterParams: params,
                    masivo: _this.masivo
				});
				winAddRn.init();
				winAddRn.view();
			};
		}	
		
        this.btnAdicionarProd = new LOG.util.Prototipos.botonAdicionar({
            tooltip: _this.idioma.lbTtBtnProductos,
            disabled: true,
            parametros:params,
            handler: handler_add,
            doAction: function(recordSeleccionado, e) {
                if (recordSeleccionado != null) {
                    _this.model.adicionarRegNum(recordSeleccionado);

                }
            },
            controlFn: function (b, _caller) {
                if (_caller._parent.grantedAction('btnAdicionarProducto')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }

            }
        });
        _this.addToolbarButton(_this.btnAdicionarProd);
        
        
        this.btnEliminarProd = new LOG.util.Prototipos.botonEliminar({
            tooltip: _this.idioma.lbTtBtnEliminar,
            disabled: true,
            handler: function () {
                _this.model.onBtnEliminarProdClick();
            },
            controlFn: function (b, _caller) {
                if (_caller._parent.grantedAction('btnEliminarProducto')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }

            }
        });
        _this.addToolbarButton(_this.btnEliminarProd);

        this.btnImportarListado = LOG.util.UIManager.createBtn({
            iconCls: 'importar',
            text: this.idioma.lbImportarListado,
            tooltip: this.idioma.lbTtBtnImportarListado,
            key: {
                alt: true,
                ctrl: true,
                shift: false,
                key: 'I'
            },
            disabled: true,
            handler: function () {
                AFT.util.importarFileUploadField(_this);
            },
            controlFn: function (b, _caller) {
                if (_caller._parent.grantedAction('btnImportarMedios')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }

            }
        });
        _this.addToolbarButton(_this.btnImportarListado);
        
        //LOG.movimiento.aft.winSeleccionarRegistros
        
        /*if(_this.datos.tipo_interfaz == "no_entrada"){
            this.btnAdicionarRegistros = new LOG.util.Prototipos.botonAdicionar({
                tooltip: 'Adicionar medios',
                text: 'Adicionar medios',
                disabled: true,
                handler: function(){
                    var winAddRn = new LOG.movimiento.aft.winSeleccionarRegistros({
                        idioma: _this.idioma,
                        idarearesp: _this.datos.idarearesp,
                        iddocumento: _this.datos.iddocumento,
                        idoperacion: _this.datos.idoperacion,
                        grid: _this.getGridPrincipal(),
                        interfaz: _this.getVistaPrincipal()
                    });
                    winAddRn.init();
                    winAddRn.view();
                },
                controlFn: function(b, _caller){                
                    if (_caller._parent.grantedAction('btnAdicionarRegistros')) {
                        b.setVisible(true);
                    } else {
                        b.setVisible(false);
                    }
                }
            });
            _this.addToolbarButton(_this.btnAdicionarRegistros);
        }*/
        
        this.btnRegistro = LOG.util.UIManager.createBtn({
            iconCls: 'numeroserie',
            text: _this.idioma.lbBtnRegistro,
            tooltip: _this.idioma.lbTtBtnRegistro,
            disabled: true,
            handler: function () {
                _this.onGridDobleClick();
            },
            controlFn: function (b, _caller) {
                if (_caller._parent.grantedAction('btnRegistroNumerico')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }

            }
        });
        _this.addToolbarButton(_this.btnRegistro);

        if(_this.datos.inventarioTotal || _this.datos.inventarioParcial || _this.datos.inventarioParcialMensual){
      
          this.btnContarTodos = LOG.util.UIManager.createBtn({
            iconCls: 'planificacionmaterial',
            text: 'Sin diferencias',
            tooltip: 'Marcar documento sin diferencias en el conteo',
            disabled: _this.datos.idestado != 2,
            handler: function () {

              if (_this.datos.idestado != 2) {
                mostrarMensaje(1, 'El documento debe encontrarse en estado confirmado.')
              } else {
                _this.model.contarTotos();
              }
              
            },
            controlFn: function (b, _caller) {
                
              /*if (_caller._parent.grantedAction('btnImportarMedios')) {
                    b.setVisible(true);
              } else {
                  b.setVisible(false);
              }*/

                
            }
          });
          _this.addToolbarButton(_this.btnContarTodos);
        }


        this.btnConfirmarDoc = new LOG.util.Prototipos.botonConfirmar({
            tooltip: _this.idioma.lbTtBtnConfirmar,
            disabled: true,
            handler: function () {                
                _this.model.confirmarDocumento(true);
                

            },
            controlFn: function (b, _caller) {
                if (_caller._parent.grantedAction('idConfirmarBtn')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }

            }
        });
        _this.addToolbarButton(_this.btnConfirmarDoc);
        this.btnAnularDoc = new LOG.util.Prototipos.botonAnularEstado({
            tooltip: _this.idioma.lbTtBtnAnularEstatus,
            disabled: true,
            handler: function () {
                var params = {
                    iddocumento: _this.datos.iddocumento
                };
                (_this.datos.inventarioParcialMensual || _this.datos.inventarioTotal) ? params.inventario = 2 : '';
                _this._parent.model.cancelarEstadoDoc(params, _this.modificarEstado, _this);
                _this.gestionarBotones();
            },
            controlFn: function (b, _caller) {
                if (_caller._parent.grantedAction('idCancelEstatusBtn')) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }

            }
        });
        _this.addToolbarButton(_this.btnAnularDoc);
        this.btnAprobarDoc = new LOG.util.Prototipos.botonAprobar({
            tooltip: _this.idioma.lbTtBtnAprobar,
            disabled: true,
            handler: function () {
                var params = {
                    iddocumento: _this.datos.iddocumento,
                    idoperacion: _this.datos.idoperacion,
                    observacion: _this.datos.operacion + ' ' + _this.datos.nrodoc,
                    idarea: _this.datos.idarearesp,
                    identidadpadre: _this.datos.idestructurapadre
                };

                if ((_this.datos.inventarioTotal || _this.datos.inventarioParcial) && (_this.datos.idestado == '2')) {
                    params.inventario = 2;
                }

                if (_this.datos.inventarioParcial) {
                    params.parcial = 2;
                }
                params.signo = (_this.datos.tipo_interfaz == "entrada") ? "+" : "-",
                _this._parent.model.aprobarDoc(params, _this.modificarEstado, _this, true);
                _this.gestionarBotones();
            },
            controlFn: function (b, _caller) {
                if (_caller._parent.grantedAction('idAprobarBtn') && !cargaInicial) {
                    b.setVisible(true);

                } else {
                    b.setVisible(false);
                }

            }
        });
        _this.addToolbarButton(_this.btnAprobarDoc);


        var dirReportConteo = this.datos.codigooperacion.includes('_UH')
                                || this.datos.codigooperacion.includes('_UTIL')
            ? "/distra/logistica/activofijo/documento/ConteoFisicoUtilesAft"
            : "/distra/logistica/activofijo/documento/ConteoFisicoMediosAft";

        this.btnImprimirInventario = new LOG.util.Prototipos.botonImprimir({
            tooltip: "Imprimir conteo",
            disabled: true,
            handler: function () {
                var report = new LOG.util.Report({
                    reports: [
                        {
                            name: 'Vista principal',
                            params: {
                                iddocumento: _this.datos.iddocumento
                                /*iddoc: record.get("iddoc"),
                                idnodo: record.get("idnodo"),
                                iddir: (idespaciotrabajo && idespaciotrabajo != undefined) ? idespaciotrabajo : null,
                                aprobadopor: (_this.aprobadopor) ? LOG.aft.documento.utf8_encode(_this.aprobadopor) : '',
                                operacion: (_this.operacion) ? LOG.aft.documento.utf8_encode(_this.operacion) : '',
                                idestructura: _this.identidad,
                                nommonedaalternativa: (nommonedaalternativa) ? LOG.aft.documento.utf8_encode(nommonedaalternativa) : null,
                                entidad_direccion: (_this.entidadSeleccionada.entidadDireccion) ? LOG.aft.documento.utf8_encode(_this.entidadSeleccionada.entidadDireccion) : '',
                                codigo_entidad: _this.entidadSeleccionada.entidadCodigo,
                                mes: LOG.aft.documento.mesActual(fecha.getMonth() + 1),
                                year: fecha.getFullYear(),
                                titulo: LOG.aft.documento.utf8_encode(_this.tituloReporte),
                                yearRev: fecha.getFullYear() - 1958, //logistica\activos_fijos\documento\views\images,
                                //dirImg: "/logistica/activos_fijos/documento/views/images/tecnoimport.png",
                                dirImg: dirImg,
                                dia: fecha.getDate()*/
                            },
                            dirReport: dirReportConteo
                        }
                    ]
                }).view();
            },
            controlFn: function (b, _caller) {
                if (_this.datos.tipo_interfaz == "no_entrada" && (
                    _this.datos.inventarioTotal ||
                    _this.datos.inventarioParcial ||
                    _this.datos.inventarioParcialMensual)) {
                    b.setVisible(true);
                    if(this.datos.idestado == '2' || this.datos.idestado == 2)
                        b.enable();
                    else
                        b.disable();
                } else {
                    b.setVisible(false);
                }

            }
        });



        this.btnImprimirResumen = new LOG.util.Prototipos.botonImprimir({
            text:'Modelo Resumen',
            tooltip: "Imprimir modelo resumen",
            disabled:true,
            handler: function () {
                var report = new LOG.util.Report({
                    reports: [
                        {
                            name: 'Vista principal',
                            params: {
                                iddocumento: _this.datos.iddocumento
        
                            },
                            dirReport: "/distra/logistica/activofijo/documento/modelo_resumen"
                        }
                    ]
                }).view();
            },
            controlFn: function (b, _caller) {
                
                if (_this.datos.tipo_interfaz == "no_entrada" && (
                    _this.datos.inventarioTotal ||
                    _this.datos.inventarioParcial ||
                    _this.datos.inventarioParcialMensual)) {
                    b.setVisible(true);
                    if(this.datos.idestado == '2' || this.datos.idestado == 2)
                        b.enable();
                    else
                        b.disable();
                } else {
                    b.setVisible(false);
                }

            }
     
        });


        _this.listaBotones.add(_this.btnImprimirResumen);
        _this.addToolbarButton(_this.btnImprimirInventario,_this.btnImprimirResumen);

        _this.addToolbarButton('->');
        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({
            id: 'idmovimientoaft'
        }));


    },
    onBtnAdicionarProdClick: function (params) {
        var _this = this;
        /**/

        if (_this.datos.inventarioTotal || _this.datos.inventarioParcial) {
			
            var arregloAreas = _this.datos.idareasInventario;
            if (arregloAreas)
                arregloAreas += "," + _this.datos.idarearesp;
            else
                arregloAreas = _this.datos.idarearesp;
			
			params.idestructura = Ext.encode(arregloAreas.split(",")),
			params.prodareas = true;
			params.idseleccionados = new Array();
			
            var winProductos = new LOG.lb.producto.View({
                idioma: _this.idioma,
                usarMarcaModelo: true,
                usarFiltroArea: false,
                autoLoad:false,
                modoSeleccion: 3, //(seleccionSimple) ? 1 : 3,
                _parent: _this,
                parametros: params,
                doAction: function (records) {
                    _this.model.adicionarProductosInventario(records);
                }
            });
            winProductos.init();
            winProductos.addGridColumn({
                dataIndex: 'idestructura'
            });
            winProductos.addGridColumn({
                header: 'AFT/UH',
                width: 90,
                dataIndex: 'isuh',
                renderer: function (value, metaData, r) {
                    if(value == '1'){
                        return 'UH';
                    } else {
                        return 'AFT';
                    }
                },
                filter: {
                    type: 'list',
                    options: [
                        [0, 'AFT'],
                        [1, 'UH']
                    ],
                    dataIndex: 'isuh'
                }
            });

            _this.vistaProductos = winProductos.view();
            _this.vistaProductos.show();
            winProductos.storePrincipal.load();
        } else {
            LOG.inv.maestroproductos.Loader.init(function () {
                if (!_this.bloqueada) {
                    //Ext.getBody().mask(_this.idioma.lbMaskCargandoDatos, 'x-mask-loading');

                    if (_this.datos.tipo_interfaz == 'entrada') {
						params.explotacion = 1;
                        params.idseleccionados = Ext.encode(_this.indicadoresNoMostrar);
						
                        _this.ventanaActivos = new LOG.lb.maestroproductos.UIProductos({
                            tipo: 1,
                            width: 750,
                            height: 350,
                            usarAplicar: true,
                            usarMarcaModelo: true,
                            showArbol: false,
                            parametros: params,
                            doAction: function (recordSeleccionado, e) {
                                if (recordSeleccionado != null) {
                                    _this.model.adicionarProductos(recordSeleccionado);
                                }
                            }
                        });

                        /*_this.ventanaActivos.panelProductos.getStorePrincipal().fireEvent = _this.ventanaActivos.panelProductos.getStorePrincipal().fireEvent.createSequence(function (e) {
                            if (e == 'load') {   
                                 if(_this.ventanaActivos.panelProductos.getStorePrincipal().data.items.length == 0){
                                    mostrarMensaje(1, 'No existen datos que mostrar.');
                                }
                            }
                        });*/
                        _this.ventanaActivos.panelProductos.getGridPrincipal().on({
                            'rowdblclick': function(grid, row, e) {
                                var recordSelected = _this.ventanaActivos.panelProductos.getSmPrincipal().getSelections();
                                _this.ventanaActivos.doAction(recordSelected);
                                _this.ventanaActivos.close();
                            }
                        });
                        _this.ventanaActivos.show();

                    }
                    else if (_this.datos.tipo_interfaz != 'entrada') {
						
						params.idestructura = _this.datos.idarearesp;
						params.explotacion = 1;
						params.idseleccionados = _this.indicadoresNoMostrar;
						params.prodareas = true;
						
                        _this.ventanaActivos = new LOG.lb.producto.View({
                            usarFiltroArea: false,
                            _parent: _this,
                            usarMarcaModelo: true,
                            dirController:'/logistica/activos_fijos/movimiento/index.php/movimiento',
                            urlBusquedaGridPrincipal:'cargarGridClasificador',
                            idGridPrincipal: 'idindicador',
                            autoLoad: false,
                            parametros: params,
                            doAction: function (recordSeleccionado) {
                                if (recordSeleccionado != null) {
                                    _this.model.adicionarProductos(recordSeleccionado);
                                }
                            }
                        });                         

                        _this.ventanaActivos.init();
                        _this.vistaProductos = _this.ventanaActivos.view();
                   
                        _this.vistaProductos.show();
                        _this.ventanaActivos.getStorePrincipal().fireEvent = _this.ventanaActivos.getStorePrincipal().fireEvent.createSequence(function (e) {
                            if (e == 'load') {                                
                                if(_this.ventanaActivos.getStorePrincipal().data.items.length == 0){
                                    mostrarMensaje(1, 'No existen datos que mostrar.');
                                }
                                //loadMask.hide();
                            }
                        });
                        _this.ventanaActivos.getStorePrincipal().load();
                          _this.ventanaActivos.gpPrincipal.on({
                            'rowdblclick': function(grid, row, e) {
                                var recordSelected = _this.ventanaActivos.gpPrincipal.getSelectionModel().getSelections();
                                _this.ventanaActivos.doAction(recordSelected);
                                _this.vistaProductos.close();
                            }
                        });

                    }
                    else {
                        _this.ventanaActivos.parametros = {idseleccionados: _this.indicadoresNoMostrar};
                        var loadMask = new Ext.LoadMask(_this.ventanaActivos.getEl(), {msg: _this.idioma.lbMaskCargandoDatos}, {msgCls: 'mask-css'});
                        loadMask.show();
                    }

                }
            });
        }
    },
    isOperacionRecepcion: function(){
        var _this = this;
        var respuesta = false;
        switch(_this.datos.codigooperacion){            
            case 'OPER_REC_TRAS_EXTER':
                respuesta = true;
                break;
            case 'OPER_REC_ENV_REPARAR':
                respuesta = true;
                break;
            case 'OPER_PRESTA_ENTRADA':
                respuesta = true;
                break;
            case 'OPER_ALQUI_ENTRADA':
                respuesta = true;
                break;
            case 'OPER_REC_TRAS_INTER':
                respuesta = true;
                break;
            case 'OPER_REC_TRAS_EXTER':
                respuesta = true;
                break;
        }
        return respuesta;

    },
    gestionarBotones: function () {
        var _this = this;
        var rowselected = false;

        if (_this.getSmPrincipal().getCount() > 0) {
            rowselected = _this.getSmPrincipal().getSelected();
        }
        switch (true) {
            case this.datos.idestado == '1' || this.datos.idestado == 1:
            {
                this.btnAnularDoc.disable();
                this.btnAprobarDoc.disable();
                this.btnAdicionarProd.enable();
                if(this.btnContarTodos) this.btnContarTodos.disable();
                /*if (_this.datos.iddocinventario && _this.datos.iddocinventario != null) {
                    this.btnAdicionarProd.disable();
                    (this.btnAdicionarRegistros) ? this.btnAdicionarRegistros.disable(): null;
                } else {*/
                    //(this.btnAdicionarRegistros)?this.btnAdicionarRegistros.enable():null;
                //}

                if (_this.datos.inventarioTotal || _this.datos.inventarioParcialMensual) {

                    this.btnConfirmarDoc.enable();
                    // this.btnRegistro.disable();
                } else {

                    if (rowselected) {
                        this.btnEliminarProd.enable();
                    } else {
                        this.btnEliminarProd.disable();
                    }
                    if (this.gpPrincipal.getStore().getCount() > 0) {
                        this.btnConfirmarDoc.enable();
                    }
                }
                if (_this.isOperacionRecepcion()) {
                    this.btnAdicionarProd.disable();
                    //(this.btnAdicionarRegistros) ? this.btnAdicionarRegistros.disable(): null;
                }
            }
                break;
            case this.datos.idestado == '2' || this.datos.idestado == 2:
            {
                //this.btnImpromirMod.enable();
                this.btnAnularDoc.enable();
                this.btnAprobarDoc.enable();
                this.btnConfirmarDoc.disable();
                this.btnAdicionarProd.disable();
                this.btnEliminarProd.disable();
                if(this.btnContarTodos) this.btnContarTodos.enable();
                
                //(this.btnAdicionarRegistros) ? this.btnAdicionarRegistros.disable(): null;

            }
                break;
            case this.datos.idestado == '3' || this.datos.idestado == 3:
            {
                //this.btnImpromirMod.disable();
                this.btnAnularDoc.disable();
                this.btnAprobarDoc.disable();
                this.btnConfirmarDoc.disable();
                this.btnAdicionarProd.disable();
                //(this.btnAdicionarRegistros) ? this.btnAdicionarRegistros.disable(): null;
                this.btnEliminarProd.disable();
                if(this.btnContarTodos) this.btnContarTodos.disable();

            }
                break;
            default :
            {
                this.btnAnularDoc.disable();
                this.btnAprobarDoc.disable();
                this.btnAdicionarProd.disable();
                if(this.btnContarTodos) this.btnContarTodos.disable();
                //(this.btnAdicionarRegistros) ? this.btnAdicionarRegistros.disable(): null;
            }
        }

        if (rowselected) {
            /*if ((_this.datos.inventarioTotal || _this.datos.inventarioParcial) && (this.datos.idestado == '1' || this.datos.idestado == 1))
             this.btnRegistro.disable();
             else*/
            if (_this.getSmPrincipal().getCount() > 1) {
                this.btnRegistro.disable();
            } else {
                this.btnRegistro.enable();
            }

            if (_this.datos.iddocinventario && _this.datos.iddocinventario != null) {
                this.btnAdicionarProd.disable();
                this.btnEliminarProd.disable();
            }

        } else {
            this.btnRegistro.disable();
        }

        if (_this.datos.operacionAjuste || _this.datos.inventarioParcialMensual || _this.datos.inventarioTotal) {
            this.btnEliminarProd.disable();
            this.btnAdicionarProd.disable();
        }


    },
    
    onGridDobleClick: function () {
        var _this = this;  
        var rec = _this.gpPrincipal.getSelectionModel().getSelected();
       
        var denominacion = rec.get('denominacion');
        denominacion += (rec.get('descripcionmarcamodelo')) ? ' ' + rec.get('descripcionmarcamodelo') : '';
        if (!_this.datos.inventarioTotal && !_this.datos.inventarioParcial) {
            var rec = _this.gpPrincipal.getSelectionModel().getSelected();
            Ext.MessageBox.wait(_this.idioma.lbEspere, _this.idioma.lbConfIncial || '...');
            Ext.aft.regNumerico.controller.init({
                _parent: _this,
                tipo:_this.tipo,
                datos: {
                    //idactiv grupo explo,gruposubgrupo,
                    //grupoexplotacion:rec.json.grupoexplotacion,
                    //idactividad:rec.json.idactividad,
                    //denomestado tecnico completarlooo pa q no ponga false
                    
                    descripciongrupo:rec.json.descripciongrupo,
                    naturaleza:rec.json.DatProductoLogistica.NomIndicador.NomNaturaleza.denominacion,
                    codprod: rec.get('codigo'),
                    codprov: rec.json.codigoproveedor,
                    denominacion: denominacion,
                    idmovimiento: rec.get('idmovimiento'),
                    idprod: rec.get('idprod'),
                    idproducto: rec.get('idproducto'),
                    idgruposubgrupo: rec.get('idgruposubgrupo'),
                    idarearesp: _this.datos.idarearesp,
                    idestado: _this.datos.idestado,
                    idoperacion: _this.datos.idoperacion,
                    operacionAjuste: _this.operacionAjuste,
                    isOperacionRecep:_this.isOperacionRecepcion(),
                    cantidad: 0,
                    idnaturaleza: rec.get('idnaturaleza'),
                    tipo_interfaz: _this.datos.tipo_interfaz,
                    codigooperacion: _this.datos.codigooperacion,
                    idcentrocosto: _this.datos.idcentrocosto,
                    arearesp: _this.datos.arearesp,
                    idestructurapadre: _this.datos.idestructurapadre,
                    arridtablas: rec.get('arridtablas'),
                    iddocumento: _this.datos.iddocumento,
                    vidautil: rec.get('vidautil'),
                    coeficiente: rec.get('coeficiente'),
                    porcientorecuperacion: rec.get('porcientorecuperacion'),
                    tasafiscal: rec.get('tasafiscalmax'),
                    iddocinventario: _this.datos.iddocinventario,
                    // responsable: rec.get('responsable'),
                    idresponsable: rec.get('responsable'),
                    denomresponsable: rec.get('denomresponsable')                  

                },
                actionPostClose: function () {
                    _this.storePrincipal.load();
                }
            });
        } else {
            if (_this.datos.idestado == 1) {
                mostrarMensaje(1, 'Debe confirmar el documento antes de continuar con la operaci&oacute;n.')
            } else {
                Ext.MessageBox.wait(_this.idioma.lbConfIncial, _this.idioma.lbEspere || '...');
                Ext.aft.regNumerico.controller.init({
                    _parent: _this,
                    tipo:_this.tipo,
                    datos: {
                        codprod: rec.get('codigo'),
                        denominacion: denominacion,
                        idmovimiento: rec.get('idmovimiento'),
                        idprod: rec.get('idprod'),
                        idproducto: rec.get('idproducto'),
                        idgruposubgrupo: rec.get('idgruposubgrupo'),
                        idarearesp: (_this.datos.inventarioTotal) ? rec.get('idestructura') : _this.datos.idarearesp,
                        idestado: _this.datos.idestado,
                        idoperacion: _this.datos.idoperacion,
                        cantidad: 0,
                        inventario: 2,
                        idnaturaleza: rec.get('idnaturaleza'),
                        tipo_interfaz: 'entrada', //,
                        idcentrocosto: _this.datos.idcentrocosto,
                        arearesp: _this.datos.arearesp,
                        idestructurapadre: _this.datos.idestructurapadre,
                        arridtablas: rec.get('arridtablas'),
                        vidautil: rec.get('vidautil'),
                        coeficiente: rec.get('coeficiente'),
                        porcientorecuperacion: rec.get('porcientorecuperacion'),
                        tasafiscal: rec.get('tasafiscalmax'),
                        responsable: rec.get('responsable'),
                        denomresponsable: rec.get('denomresponsable')                        
                    },
                    actionPostClose: function () {
                        _this.storePrincipal.load();
                    }
                });
            }
        }
    },
    modificarEstado: function (estado, idestado) {
        var _this = this;
        _this.datos.idestado = idestado;
        _this.gestionarBotones();
        document.getElementById('idestadoFSMovimiento').innerHTML = estado;
    }/*,
    importarFileUploadField: function () {
        var _this = this;
        var panel = LOG.util.UIManager.initForm({
            fileUpload: true,
            anchor: '95%',
            frame: true,
            region: 'center',
            border: false,
            autoHeight: true,
            hideLabels: true,
            defaults: {
                anchor: '90%',
                allowBlank: false,
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'logfileuploadfield',
                    name: 'fichero',
                    buttonCfg: {
                        icon: perfil.dirImg + 'seleccion.png'
                    },
                    buttonText: " ", //_this.idioma.lbSeleccionar,
                    emptyText: _this.idioma.lbMsgSeleccioneArchivo,
                    listeners: {
                        'fileselected': function (cmp, v) {
                            if (!/\.xls$/.test(v)) {//&& !/\.xlsx$/.test(v)
                                mostrarMensaje(1, 'Solo se pueden seleccionar ficheros de tipo excel 97-2003.');
                                cmp.markInvalid('Extensi\xf3n invalida');
                                _this.btnIncluirDatos.disable();

                            } else {
                                _this.btnIncluirDatos.enable();
                            }

                        }
                    }
                }
            ]
        });

        _this.btnIncluirDatos = new LOG.util.Prototipos.botonAceptar({
            tooltip: _this.idioma.lbTtBtnCargar,
            inconCls: 'incluir',
            listeners: {
                'click': function () {
                    if (panel.getForm().isValid()) {
                        Ext.Msg.wait(_this.idioma.lbWaitMsgConf, _this.idioma.lbWaitTitle);
                        panel.getForm().submit({
                            url: _this.dirController + '/importarDatos',
                            success: function (fp, response) {

                                var responseText = Ext.decode(response.response.responseText);
                                _this.configurarAsociacion(responseText);

                            },
                            failure: function (fp, response) {

                            }
                        });
                    } else {

                        mostrarMensaje(1, _this.idioma.lbMsgCampoEmpty);
                    }
                }
            }
        });

        _this.btnCancelarImportar = new LOG.util.Prototipos.botonCancelar({
            tooltip: _this.idioma.lbTtBtnCerrar,
            listeners: {
                'click': function () {
                    _this.winImportar.close();
                }
            }
        });
        _this.winImportar = new LOG.util.Window({
            title: _this.idioma.lbTitleImportar,
            width: 320,
            height: 120,
            layout: 'form',
            resizable: false,
            modal: true,
            usarAplicar: false,
            usarAceptar: false,
            buttons: [_this.btnCancelarImportar, _this.btnIncluirDatos],
            items: [panel]
        });
        _this.winImportar.doLayout();
        _this.winImportar.show();
    }*//*,
    configurarAsociacion: function (parametros) {
        var ventana = AFT.util.winConfigurarAsociacion(this, parametros);
        ventana.show();
    }*//*,
    mostrarGridExcel: function (parametros) {
        var _this = this;
        AFT.util.winMostrarDatosExcel(_this, parametros);
        _this.winMostrarDatos.show();
        _this.winMostrarDatos.maximize();

    }*//*,
    verificarVentanasActivas: function () {
        var _this = this;
        if (_this.winMostrarDatos && _this.winMostrarDatos.isVisible())
            return true;
        if (_this.winConfigurarDatos && _this.winConfigurarDatos.isVisible())
            return true;
        if (_this.winImportar && _this.winImportar.isVisible())
            return true;
        return false;
    },
    corregirValores: function (valores, objProducto) {
        var _this = this;
        var arraynewdata = Array();

        for (var i = 0; i < _this.gridExcel.getStore().getCount(); i++) {
            if ((valores.idmarca && _this.gridExcel.getStore().getAt(i).data.marca == valores.marca)) {
                _this.gridExcel.getStore().getAt(i).data.idmarca = valores.idmarca;
                _this.gridExcel.getStore().getAt(i).data.marca = valores.newmarca;
            }

            if ((valores.idmodelo && _this.gridExcel.getStore().getAt(i).data.modelo == valores.modelo)) {
                if (_this.gridExcel.getStore().getAt(i).data.idmarca == valores.idmarca) {
                    _this.gridExcel.getStore().getAt(i).data.idmodelo = valores.idmodelo;
                    _this.gridExcel.getStore().getAt(i).data.modelo = valores.newmodelo;
                }
            }

            if (_this.gridExcel.getStore().getAt(i).data.idmodelo == valores.idmodelo &&
                _this.gridExcel.getStore().getAt(i).data.idmarca == valores.idmarca) {
                if (objProducto) {
                    _this.gridExcel.getStore().getAt(i).data.tipomedio = objProducto.tipomedio;
                    _this.gridExcel.getStore().getAt(i).data.idindicador = objProducto.idindicador;
                }
            }

            if (valores.idcolorprim && _this.gridExcel.getStore().getAt(i).data.colorP == valores.colorP) {
                _this.gridExcel.getStore().getAt(i).data.idcolorprim = valores.idcolorprim;
                _this.gridExcel.getStore().getAt(i).data.colorP = valores.newcolorP;
            }
            if (valores.idcolorsec && _this.gridExcel.getStore().getAt(i).data.colorS == valores.colorS) {
                _this.gridExcel.getStore().getAt(i).data.idcolorsec = valores.idcolorsec;
                _this.gridExcel.getStore().getAt(i).data.colorS = valores.newcolorS;
            }

            if (valores.idactividad && _this.gridExcel.getStore().getAt(i).data.actividad == valores.actividad) {
                _this.gridExcel.getStore().getAt(i).data.idactividad = valores.idactividad;
                _this.gridExcel.getStore().getAt(i).data.actividad = valores.newactividad;
            }

            if (valores.idestatustecnico && _this.gridExcel.getStore().getAt(i).data.estado == valores.estado) {
                _this.gridExcel.getStore().getAt(i).data.idestatustecnico = valores.idestatustecnico;
                _this.gridExcel.getStore().getAt(i).data.estado = valores.newestado;

            }

            if (valores.idcategoria && _this.gridExcel.getStore().getAt(i).data.categoria == valores.categoria) {
                _this.gridExcel.getStore().getAt(i).data.idcategoria = valores.idcategoria;
                _this.gridExcel.getStore().getAt(i).data.categoria = valores.newcategoria;

            }

            if (valores.idtipocombustible && _this.gridExcel.getStore().getAt(i).data.combustible == valores.combustible) {
                _this.gridExcel.getStore().getAt(i).data.idtipocombustible = valores.idtipocombustible;
                _this.gridExcel.getStore().getAt(i).data.combustible = valores.newcombustible;
            }
            var obj = [];
            for (var k = 0; k < valores.ordenColumnas.length; k++) {
                obj.push(_this.gridExcel.getStore().getAt(i).data[valores.ordenColumnas[k]]);
            }
            arraynewdata.push(obj);

        }
        _this.gridExcel.getStore().loadData(arraynewdata);
        _this.gridExcel.getSelectionModel().selectRow(valores.index);
        Ext.Msg.hide();
    }*/,
    // onGridDobleClick: function () {
    //     var _this = this;
    //     if (_this.btnRegistro.isVisible())
    //         _this.onBtnRegistroNumericoClick();
    // },
    attatchPlugin: function (plugin) {
        this.plugins.push(plugin);
    },
    insertarDatosExcel: function (enviar) {
        this.model.insertarDatos(enviar);
    }
});