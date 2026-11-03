Ext.ns('Ext.LOG.winRegNumInmueble');

Ext.LOG.winRegNumInmueble.winInscripcionModulo = Ext.extend(Ext.Window, {
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, config);
        config = (config) ? config : {};

        _this.idioma = _this.idioma;
        _this.title = _this.idioma.lbtitleRegNumInmueble;
        _this.closeAction = 'close';
        _this.closable = true;
        _this.animCollapse = true;
        _this.width = 980;
        _this.height = 600;
        _this.modal = true;
        _this.datos = _this.datos;
        _this.idregNum = _this.idregNum;
        _this.plain = true;
        _this.layout = 'border';
        _this.component = _this.component;
    
        Ext.LOG.winRegNumInmueble.idregnuminicial = null;
        if (Ext.LOG.winRegNumInmueble.idregnuminicial == null) {
            Ext.LOG.winRegNumInmueble.idregnuminicial = _this.idregnuminicial;
        }
       
        _this.btnAdicionarIns = new Ext.Button({
            text: _this.idioma.lbBtnAceptar,
            id: 'idaceptar',
            disabled: false,
            iconCls: 'aceptar',
            tooltip: _this.idioma.btnTAceptar,
            handler: function() {
                var idregnumTraslado = Array();
                var tipomedioDiferenteArray = Array();
                Ext.getBody().mask(_this.component.idioma.lbMaskG, 'x-mask-loading');
                for (var i = 0; i < _this.smtreegrid.selections.items.length; i++) {
                             idregnumTraslado.push(_this.smtreegrid.selections.items[i].data.idregnumerico);
                         if(_this.component.datos.idprod != _this.smtreegrid.selections.items[i].data.idprod){
                              tipomedioDiferenteArray.push(_this.smtreegrid.selections.items[i].data.idregnumerico);
                             }
                          }
                var cant = _this.component.gridSur.getStore().reader.jsonData.total + _this.treegrid.selModel.selections.items.length - tipomedioDiferenteArray.length;
                if (_this.component.datos.cantidad >= cant) {
                    if (_this.smtreegrid.selections.items.length >= 1) {
                       
                       Ext.Ajax.request({
                            url: _this.url + 'getTrasladarRegNumInmuebles',
                            method: 'POST',
                            params: {
                                idregnumTraslado: Ext.encode(idregnumTraslado),
                                tipomedioDiferenteArray: Ext.encode(tipomedioDiferenteArray),
                                idestructura: _this.Component.idarearesp,
                                idestructurapadre: _this.Component.idestructurapadre,
                                idmovimiento:_this.Component.idmovimiento,
                                iddocumento: _this.Component.iddocumento
                            },
                            callback: function(options, success, response) {
                                Ext.getBody().unmask();
                                var rd = Ext.decode(response.responseText);

                                    if (rd.nodepreciados) {
                                         mostrarMensaje(2, _this.idioma.lbMsgNoDepreciados, function(btn) {
                                           if (btn == 'ok') {
                                                 _this.treeTipoMedioDepreciar(_this.component,rd.arraytotal,rd.nodepreciosarray, _this.idioma,true, _this.Component.iddocumento,_this.Component.idmovimiento);
                                                 _this.close();
                                            } else {
                                                _this.treeTipoMedioDepreciar(_this.component,rd.arraytotal,false,_this.idioma,false,_this.Component.iddocumento,_this.Component.idmovimiento);
                                                _this.close();
                                            }
                                        });
                                      
                                }else{
                                   mostrarMensaje(1, _this.idioma.lbMsgGuardarOk);
                                   _this.component.gridSur.getStore().load();  
                                   _this.close();
                                }
                            }
                        });
                    }
                } else {
                    mostrarMensaje(1, _this.idioma.lbCantidadLimite);
                    Ext.getBody().unmask();
                }
            }

        });

        _this.btnCancelarIns = new Ext.Button({
            iconCls: 'cancelar',
            text: _this.idioma.lbBtnCancelar,
            id: 'idcancelar',
            tooltip: _this.idioma.btnTCancelar,
            handler: function() {
                _this.close();
            }
        });

        _this.btnAplicar = new Ext.Button({
            text: _this.idioma.lbBtnAplicar,
            disabled: false,
            iconCls: 'aplicar',
            tooltip: _this.idioma.btnTAplicar,
            handler: function() {

            }
        });

        _this.smtreegrid = new Ext.grid.CheckboxSelectionModel({
            listeners: {
                'rowselect': function(SelectionModel, rowIndex, record) {
                    var arrayHojas = Array();
                    var RaizNoExpandido = Array();
                    var RaizExpandido = Array();
                    var RaizExpandidoHijos = Array();

                    var HijoYPadreNoExpandido = Array();
                    var HijoYPadreExpandido = Array();
                    var HijoYPadreExpandidoHijos = Array();
                    var arrayidregnum = Array();
                }
            }
        });

        _this.treegrid = new Ext.LOG.RegNumInmueble.CmpTreeGrid({
            id: 'idtreegrid',
            with : 900,
            height: 350,
            idioma: _this.idioma,
            region: 'center',
            url: _this.url + 'getCargarTreeGridInmuebles',
            sm: _this.smtreegrid,
            idregNum: _this.idregNum,
            Component: _this.Component,
            expand: true
        });
        _this.buttons = [_this.btnCancelarIns, _this.btnAdicionarIns];

        _this.padre = new Ext.form.Checkbox({
            boxLabel: "Es padre principal",
            hideLabel: true,
            disabled: true,
            autoScroll: true,
            name: 'padre',
            id: 'idpadre',
        })
        _this.hijo = new Ext.form.Checkbox({
            xtype: 'checkbox',
            boxLabel: "Es hijo",
            hideLabel: true,
            disabled: true,
            name: 'hijo',
            autoScroll: true,
            id: 'idhijo',
        })
        _this.hijopadre = new Ext.form.Checkbox({
            xtype: 'checkbox',
            boxLabel: "Es padre e hijo",
            hideLabel: true,
            autoScroll: true,
            disabled: true,
            name: 'hijopadre',
            id: 'idhijopadre',
        })
        _this.nav = new Ext.Panel({//north
            title: 'Informaci&oacute;n',
            region: 'south',
            split: true,
            width: 480,
            height: 160,
            collapsible: false,
            modal: true,
            items: [{
                   html: "<p><div id='divuno'>" + "  1. El/los medios  pertenecientes al modulo que estén seleccionados dejarán de formar parte del modulo al realizar el movimiento y viceversa, independientemente de la estructura que contenga el mismo.  " + "</div></p>"+'<br>'
            },{
                  html: "<p><div id='divdos'>" + "  2. Si dentro de los medios seleccionados se encuentra el inmueble principal, y existen medios que se comportan como hojas que no fueron marcados, los mismos volverán a colocarse en el listado de medios disponibles. " + "</div></p>"+' <br>'
            },{
                  html: "<p><div id='divdtres'>" + " 3. Si dentro de los medios seleccionados se encuentra el medios principal del modulo, y existen medios que se comportan como modulos que no fueron marcados, los mismos se comportarán como modulos principales con sus medios correspondientes. " + "</div></p>"+' <br>'
            }]
        });
        _this.panel = new Ext.form.FormPanel({
            frame: true,
            with : 900,
            height: 500,
            region: 'center',
            bodyStyle: 'margin: 10px;',
            items: [_this.treegrid]
        });

        _this.items = [_this.panel, _this.nav];
        Ext.LOG.winRegNumInmueble.winInscripcionModulo.superclass.constructor.apply(this, arguments);
    },
    getAddRegNumInmuebles: function(arrayIdData) {

    },
    adicionarMovRegNumSurNoDepreciarInmuebles: function(Component, idregnum, idioma) {
        var _this = this;
        var cant = Component.gridSur.getStore().reader.jsonData.total + idregnum.length;
        if (Component.datos.cantidad >= cant)
        {

            // Ext.getBody().mask(Component.idioma.lbMaskG, 'x-mask-loading');

            //if (Component.gridNorte.getSelectionModel().getCount() > 0) {
            if (idregnum.length > 0) {
                var parametros = new Array();
                var records = new Array();
                for (var j = 0; j < idregnum.length; j++) {
                    for (var i = 0; i < Component.gridNorte.store.data.items.length; i++) {
                        if (idregnum[j].idregnumerico == Component.gridNorte.store.data.items[i].data.idregnumerico) {
                            records.push(Component.gridNorte.store.data.items[i]);
                        }
                    }
                }

                /*  var records = Component.gridNorte.getSelectionModel().getSelections();*/

                for (var i = 0; i < records.length; i++) {
                    var params = records[i].data;
                    params.idproducto = Component.datos.idproducto;
                    params.idmovimiento = Component.datos.idmovimiento;
                    params.idarearesp = Component.datos.idarearesp;
                    parametros.push(params);
                }

                Ext.Ajax.request({
                    url: _this.url + 'adicionarseriesnoentradaNoDepreciados',
                    method: 'POST',
                    params: {
                        parametros: Ext.encode(parametros),
                        idoperacion: Component.datos.idoperacion,
                        idestructura: Component.datos.idestructurapadre,
                    },
                    callback: function(options, success, response) {
                        Ext.getBody().unmask();
                        var rd = Ext.decode(response.responseText);

                        if (rd.failure) {
                            if (rd.codigo == 001) {
                                mostrarMensaje(3, idioma.lbMsgGuardarErrorEstadoNoConfigurado);
                            } else {
                                mostrarMensaje(3, idioma.lbMsgGuardarError)
                            }
                        } else {
                            for (var i = 0; i < rd.length; i++) {
                                var obj = rd[i];
                                Component.gridNorte.llavesForaneas = new Array();

                                Component.gridNorte.llavesForaneas[0] = {
                                    key: 'idregnumerico',
                                    value: obj.idregnumerico
                                };
                                Component.gridNorte.llavesForaneas[1] = {
                                    key: 'idmovregnumerico',
                                    value: obj.idmovregnumerico
                                };
                                Component.gridNorte.ar_where = 'idregnumerico = ' + obj.idregnumerico + ' and idmovregnumerico = ' + obj.idmovregnumerico;
                                Component.gridNorte.propertyGridAtribDinamicos.btnGuardar.handler();
                            }
                            mostrarMensaje(1, idioma.lbMsgGuardarOk);
                            Component.gridSur.getStore().load();
                        }
                        //}
                    }
                });
            } else {
                Ext.getBody().unmask();
                mostrarMensaje(3, idioma.lbDebeSelecionarFila);
            }
        } else {
            mostrarMensaje(1, idioma.lbCantidadLimite);
        }
    },
    depreciarMediosInmuebles: function(Component, idregnum, idioma) {
        var _this = this;

        var cant = Component.gridSur.getStore().reader.jsonData.total + idregnum.length;
        if (Component.datos.cantidad >= cant) {
                
            if (idregnum.length > 0) {
                var parametros = new Array();
                var records = new Array();
                for (var j = 0; j < idregnum.length; j++) {
                    for (var i = 0; i < Component.gridNorte.store.data.items.length; i++) {
                        if (idregnum[j].idregnumerico == Component.gridNorte.store.data.items[i].data.idregnumerico) {
                            records.push(Component.gridNorte.store.data.items[i]);
                        }
                    }
                }
                for (var i = 0; i < records.length; i++) {
                    var params = records[i].data;
                    params.idproducto = Component.datos.idproducto;
                    params.idmovimiento = Component.datos.idmovimiento;
                    params.idarearesp = Component.datos.idarearesp;
                    parametros.push(params);
                }

                Ext.getBody().mask(Component.idioma.lbMaskG, 'x-mask-loading');
                Ext.Ajax.request({
                    url: Component.datos.urlControladora + 'depreciarmedio',
                    method: 'POST',
                    params: {
                        params: Ext.encode(parametros),
                        idregnum: Ext.encode(idregnum),
                        idoperacion: Component.datos.idoperacion,
                        idestructura: Component.datos.idestructurapadre
                    },
                    callback: function(options, success, response) {
                        Ext.getBody().unmask();
                        var rd = Ext.decode(response.responseText);
                        if (rd.failure) {
                            if (rd.codigo == 001) {
                                mostrarMensaje(3, idioma.lbMsgGuardarErrorEstadoNoConfigurado);
                            } else {
                                mostrarMensaje(3, idioma.lbMsgGuardarError)
                            }
                        } else {
                            for (var i = 0; i < rd.length; i++) {
                                var obj = rd[i];
                                Component.gridNorte.llavesForaneas = new Array();

                                Component.gridNorte.llavesForaneas[0] = {
                                    key: 'idregnumerico',
                                    value: obj.idregnumerico
                                };
                                Component.gridNorte.llavesForaneas[1] = {
                                    key: 'idmovregnumerico',
                                    value: obj.idmovregnumerico
                                };
                                Component.gridNorte.ar_where = 'idregnumerico = ' + obj.idregnumerico + ' and idmovregnumerico = ' + obj.idmovregnumerico;
                                Component.gridNorte.propertyGridAtribDinamicos.btnGuardar.handler();
                            }
                            mostrarMensaje(1, idioma.lbMsgGuardarOk);
                            Component.gridSur.getStore().load();
                        }
                        /* if(rd.failure){
                         // _this.adicionarMovRegNumSur(Component);
                         }
                         else{
                         mostrarMensaje(3, Component.idioma.lbMsgNoRegNumDepreciados);
                         }*/

                    }
                })

            }
            else {
                Ext.getBody().unmask();
                mostrarMensaje(3, idioma.lbDebeSelecionarFila);
            }

        } else {
            mostrarMensaje(1, idioma.lbCantidadLimite);
        }


    },
    
    treeTipoMedioDepreciar:function (Component,idregnum,nodepreciados,idioma,action,iddocumento,idmovimiento){
       
         Ext.getBody().mask(Component.idioma.lbMaskG, 'x-mask-loading');
                Ext.Ajax.request({
                    url: Component.datos.urlControladora + 'getTreeTipoMedioDepreciar',
                    method: 'POST',
                    params: {
                        idregnum: Ext.encode(idregnum),
                        nodepreciados: Ext.encode(nodepreciados),
                        action: action,
                        iddocumento: iddocumento,
                        idmovimiento:idmovimiento,
                        cantidad: Component.datos.cantidad
                        
                    },
                    callback: function(options, success, response) {
                        Ext.getBody().unmask(); 
                        var rd = Ext.decode(response.responseText);
                        if(rd == 1){
                           mostrarMensaje(1, idioma.lbMsgGuardarOk);
                           Component.gridSur.getStore().load();  
                        }
                        
                       
                    }
                })
    }
    
})


