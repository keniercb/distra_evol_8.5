
Ext.ns('Log.aft.submayor');

Log.aft.submayor.Model = Ext.extend(LOG.util.Model, {
    /**
     *
     * @param {type} config
     * @returns {undefined}
     */
    idestructura: undefined,
    constructor: function(config)
    {
        var _this = this;
        if (!config.fields) {
            config.fields = [];
        }
        config.fields.push({
            name: 'idindicador',
            primary: true
        });
        this.listaPlugins = new LOG.util.List();
        this.listaDinamicos = new LOG.util.List();
        this.listaGeneral = new LOG.util.List();
        this.listaCamposNull = new LOG.util.List();
        this.enviar = {};
        this.params = {};


        _this.addParametrosAEnviar();
        Log.aft.submayor.Model.superclass.constructor.call(this, config);
    },
    /*
     * Funcion que ejecuta cualquier ajax request a la logica de negoscio
     * El parametro es un objeto que debe tener las siguientes propiedades
     * @string: url -- Es la url del metodo
     * @object: params -- Son los parametros necesarios para cargar los datos de la logica de negocio.
     * @function: doAction -- Es la funcion que se ejecutara despues de haber sido ejecutado el ajax, recibiendo como 
     *                        parametros los datos que son devueltos de la logica de negocio.
     *
     */
    cargarDatosFunction: function(obj){
        Ext.Ajax.request({
            url: obj.url,
            method: 'POST',
            callback: function(opt, scs, resp) {
                Ext.getBody().unmask();
                data = Ext.decode(resp.responseText);
                obj.doAction(data);
            },
            params: (obj.params) ? obj.params : {}
        });
    },

    buscar: function(tipo, _fn, _fnfail) {
        var _this = this;

        var obj = this.encode();
        var params = {};
        if (tipo == 1) {
            _this.prepararParamsGeneral(obj, params);
        } else {
           // _this.params['data'] = "";
            _this.prepararParamsRegNum(params);
        }

        params['idestructuracomun'] = _this.idestructura;
        _this.st.load({
            params : params
        });

    },

    getParams: function(){
        return this.params;
    },

    getNotEncodedParams: function(){
        var _this = this;
        return _this.enviar;
    },

    addParametrosAEnviar: function() {
        /**Datos generales**/
        this.enviar = {};
        this.enviar['codigo'] = null;
        this.enviar['denominacion'] = null;
        this.enviar['idmarca'] = null;
        this.enviar['idmodelo'] = null;
        this.enviar['idnaturaleza'] = null;
        this.enviar['nroserie'] = null;
        this.enviar['denominacion'] = null;
        this.enviar['nroinventario'] = null;
        this.enviar['min_valorcontable'] = null;
        this.enviar['max_valorcontable'] = null;
        this.enviar['annofabricacion'] = null;
        this.enviar['min_recursoconsumidomax'] = null;
        this.enviar['max_recursoconsumidomax'] = null;
        this.enviar['idcolorprim'] = null;
        this.enviar['idcolorsec'] = null;
        this.enviar['min_recursoconsumido'] = null;
        this.enviar['max_recursoconsumido'] = null;
        this.enviar['min_cantidadrecursoconsumido'] = null;
        this.enviar['max_cantidadrecursoconsumido'] = null;
        this.enviar['idactividad'] = null;
        this.enviar['idresponsable'] = null;
        this.enviar['idcategoria'] = null;
        this.enviar['fechaadq'] = null;
        this.enviar['fechaexpini'] = null;
        this.enviar['fechaexpfin'] = null;
        this.enviar['vidautil'] = null;
        this.enviar['min_valoradquisicion'] = null;
        this.enviar['max_valoradquisicion'] = null;
        this.enviar['tasafiscal'] = null;
        this.enviar['porcientorecuperacion'] = null;
        this.enviar['idestatustecnico'] = null;
        this.enviar['idarearesp'] = null;
        this.enviar['min_depreciacionacumulada'] = null;
        this.enviar['max_depreciacionacumulada'] = null;
        this.enviar['fechainicialgarantia'] = null;
        this.enviar['fechafingarantia'] = null;
        this.enviar['Datos generales'] = null;

        /**Datos transporte**/
        this.enviar['nromatricula'] = null;
        this.enviar['nrocirculacion'] = null;
        this.enviar['nromotor1'] = null;
        this.enviar['nromotor2'] = null;
        this.enviar['min_ficav'] = null;
        this.enviar['max_ficav'] = null;
        this.enviar['min_lot'] = null;
        this.enviar['max_lot'] = null;
        this.enviar['vin'] = null;
        this.enviar['capacidad'] = null;
        this.enviar['indiceconsumo'] = null;
        this.enviar['nollaveencendido'] = null;
        this.enviar['indicativo'] = null;
        this.enviar['idtipocombustible'] = null;
        this.enviar['combustibleasignado'] = null;
        this.enviar['kmasignado'] = null;
        this.enviar['min_expedicioncirculacion'] = null;
        this.enviar['max_expedicioncirculacion'] = null;
        this.enviar['min_vencimientocirculacion'] = null;
        this.enviar['max_vencimientocirculacion'] = null;
        this.enviar['min_vencimientolot'] = null;
        this.enviar['max_vencimientolot'] = null;
        this.enviar['min_vencimientoficav'] = null;
        this.enviar['max_vencimientoficav'] = null;
        this.enviar['Datos transporte'] = null;

        if(alternativa) {
            this.enviar['min_valorcontablealternativo'] = null;
            this.enviar['max_valorcontablealternativo'] = null;
            this.enviar['min_depreciacionacumuladaalternativo'] = null;
            this.enviar['max_depreciacionacumuladaalternativo'] = null;
        }
    },

    prepararParamsGeneral : function(obj, params) {
        if (obj.codigo)
            params['codigo'] = obj.codigo;
        if (obj.denominacion)
            params['denominacion'] = obj.denominacion;
        if (obj.marca)
            params['idmarca'] = obj.marca;
        if (obj.modelo)
            params['idmodelo'] = obj.modelo;
        if (obj.idpais)
            params['idpais'] = obj.idpais;
        if (obj.idespecialidadBuscar)
            params['idespecialidadBuscar'] = obj.idespecialidadBuscar;
        if (obj.idnaturaleza)
            params['idnaturaleza'] = obj.idnaturaleza;
        if (obj.minCant)
            params['minCant'] = obj.minCant;
        if (obj.maxCant)
            params['maxCant'] = obj.maxCant;
        if (obj.minDisp)
            params['minDisp'] = obj.minDisp;
        if (obj.maxDisp)
            params['maxDisp'] = obj.maxDisp;
    },

    prepararParamsRegNum : function(params) {
        var _scope = this;
        //Lista de campos con valores nulos


        if(_scope.listaCamposNull.count() > 0) {
            _scope.listaCamposNull.each( function(list) {
                _scope.enviar[list.name] = list.valor;
            });
        }
        //Lista de campos con valores de los campos generales de los regnumericos
        if(_scope.listaGeneral.count() > 0) {
            _scope.listaGeneral.each( function(list) {
                _scope.enviar[list.name] = list.valor;
            });
        }

        //Lista de campos con valores de los campos de plugins de los regnumericos
        if(_scope.listaPlugins.count() > 0) {
            _scope.listaPlugins.each( function(list) {
                _scope.enviar[list.name] = list.valor;
            });
        }

        //Lista de campos con valores de los campos dinamicos de los regnumericos
        if(_scope.listaDinamicos.count() > 0) {
            var mandar = Array();
            _scope.listaDinamicos.each( function(list) {
                var elementosXtabla = {};
                var datos = Array();
                var aux =  new Object();;
                aux[list.name] = list.valor;
                datos.push(aux);
                elementosXtabla['idtabla'] = list.idtabla;
                elementosXtabla['datos'] = datos;
                mandar.push(elementosXtabla);
            });
            params['elementosXtabla'] = Ext.encode(mandar);
        }

        params['data']  = Ext.encode(_scope.enviar);

    },

    initListaPlg: function (basicForm, plugin) {
        var _scope = this;
        basicForm.getForm().items.each(function (field) {
            if (field.isFormField) {
                if (_scope.xtypesEvtents[field.getXType()]
                    && _scope.xtypesEvtents[field.getXType()]['evt'] == 'keyup'
                    && !field.enableKeyEvents) {
                    field.enableKeyEvents = true;
                }

                field.fireEvent = field.fireEvent.createSequence(function (e) {
                    if ((_scope.xtypesEvtents[field.getXType()]
                        && e == _scope.xtypesEvtents[field.getXType()]['evt'])
                        || e == 'blur') {
                        var existe = _scope.existeYa(field.getName(), _scope.listaPlugins);
                        if(!field.getValue()) {
                            _scope.listaPlugins.delete(existe);
                        } else {
                            if(field.getName() == 'camposnullPlg') {
                                var existeCamposNull = _scope.existeYa(field.nameplugin, _scope.listaCamposNull);
                                var auxObj = {};
                                auxObj['valor'] = field.getValue();
                                auxObj['name'] = field.nameplugin;
                                _scope.listaCamposNull.setItem(auxObj, existeCamposNull);
                            } else {
                                var auxObj = {};
                                if (field.vtype == 'daterange')
                                    auxObj['valor'] = field.getValue().format('d-m-Y');
                                else
                                    auxObj['valor'] = field.getValue();
                                auxObj['name'] = field.getName();
                                _scope.listaPlugins.setItem(auxObj, existe);
                            }
                        }
                    }
                });
            }
        });
    },

    initListaDin: function (basicForm) {
        var _scope = this;
        basicForm.getForm().items.each(function (field) {
            if (field.isFormField) {
                if (_scope.xtypesEvtents[field.getXType()]
                    && _scope.xtypesEvtents[field.getXType()]['evt'] == 'keyup'
                    && !field.enableKeyEvents) {
                    field.enableKeyEvents = true;
                }

                field.fireEvent = field.fireEvent.createSequence(function (e) {
                    if ((_scope.xtypesEvtents[field.getXType()]
                        && e == _scope.xtypesEvtents[field.getXType()]['evt'])
                        || e == 'blur') {
                        var existe = _scope.existeYa(field.getName(), _scope.listaDinamicos);
                        if(!field.getValue()) {
                            _scope.listaDinamicos.delete(existe);
                        } else {
                            var auxObj = {};
                            auxObj['valor'] = field.getValue();
                            auxObj['name'] = field.getName();
                            auxObj['idtabla'] = field.idtabla;
                            _scope.listaDinamicos.setItem(auxObj, existe);
                        }
                    }
                });
            }
        });
    },

    initListaGeneral: function (basicForm) {
        var _scope = this;

        basicForm.getForm().items.each(function (field) {
            if (field.isFormField) {
                if (_scope.xtypesEvtents[field.getXType()]
                    && _scope.xtypesEvtents[field.getXType()]['evt'] == 'keyup'
                    && !field.enableKeyEvents) {
                    field.enableKeyEvents = true;
                }

                field.fireEvent = field.fireEvent.createSequence(function (e) {
                    if ((_scope.xtypesEvtents[field.getXType()]
                        && e == _scope.xtypesEvtents[field.getXType()]['evt'])
                        || e == 'blur') {
                        var existe = _scope.existeYa(field.getName(), _scope.listaGeneral);
                        if(field.tipo == 'win_responsable') {
                            if(!field.idresponsable) {
                                _scope.listaGeneral.delete(existe);
                            } else {
                                var auxObj = {};
                                auxObj['valor'] = field.idresponsable;
                                auxObj['name'] = field.getName();
                                _scope.listaGeneral.setItem(auxObj, existe);
                            }
                        } else {
                            if(field.tipo == 'win_ubicacion') {
                                if(!field.idubicacion) {
                                    _scope.listaGeneral.delete(existe);
                                } else {
                                    var auxObj = {};
                                    auxObj['valor'] = field.idubicacion;
                                    auxObj['name'] = field.getName();
                                    _scope.listaGeneral.setItem(auxObj, existe);
                                }
                            } else {
                                if(!field.getValue()) {
                                    _scope.listaGeneral.delete(existe);
                                } else {
                                    if(field.getName() == 'camposnullGen') {
                                        var existeCamposNull = _scope.existeYa(field.nameplugin, _scope.listaCamposNull);
                                        var auxObj = {};
                                        auxObj['valor'] = field.getValue();
                                        auxObj['name'] = field.nameplugin;
                                        _scope.listaCamposNull.setItem(auxObj, existeCamposNull);
                                    } else {
                                        var auxObj = {};
                                        auxObj['valor'] = field.getValue();
                                        auxObj['name'] = field.getName();
                                        _scope.listaGeneral.setItem(auxObj, existe);
                                    }

                                }
                            }
                        }

                    }
                });
            }
        });
    },

    existeYa: function (name, list) {
        var result = -1;
        list.each(function (it, pos) {
            if (it.name == name) {
                result = pos;
            }
        });
        return result;
    },

    limpiarLista : function() {
        this.listaGeneral.deleteAll();
        this.listaPlugins.deleteAll();
        this.listaDinamicos.deleteAll();
        this.listaCamposNull.deleteAll();
       //this.params['data'] = "";
    },

    setIdEstructura: function (idestructura) {
        this.idestructura = idestructura;
    },

    formattedDate : function (date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [month, day, year].join('/');
},

    actualizarParams : function(filtros) {
        var _this = this;
        var params = Ext.decode(filtros);
        if(params.length > 0) {
            Ext.each(params, function(o) {
                if (o.type == 'numeric' || o.type == 'date') {
                    if (o.comparison == 'gt')
                        _this.enviar['min_' + o.field] = o.value;
                    if (o.comparison == 'lt')
                        _this.enviar['max_' + o.field] = o.value;
                    if (o.comparison == 'eq')
                        _this.enviar[o.field] = o.value;
                } else
                    _this.enviar[o.field] = o.value;
            });
        }
    }

});


