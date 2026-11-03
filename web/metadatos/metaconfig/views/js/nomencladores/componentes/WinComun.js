Ext.ns('Nomenclador');
/**
 * Ventana comun para nomencladores que contiene la denominacion y abreviatura
 * @param bool abreviatura Si desea quitar la abreviatura
 * @param bool listaInterna Si desea poner el checkbox de Lista interna
 * @param bool pagina Si desea poner el checkbox de Página
 *
 * @param bool modificar En caso de que la ventana sea para modificar los valores
 *      @param record record Para la obtencion de los valores del nomenclador
 *
 * @param store store Para la recarga del grid al finalizar la accion
 * @param int tipo Identificador del nomenclador para los mensajes de la controladora
 * @param string name el name permite conocer cual es su clase y completa los identificadores
 *              de los elementos del formulario de la ventana
 */
Nomenclador.Comun = Ext.extend(Ext.Window, {
    title           : '',
    abreviatura     : true,
    modificar       : false,
    name            : 'elemento',
    salario         : false,
    grupocomplejidad: false,
    initComponent   : function () {
        var _this = this;
        this.initTools();
        /**
         * BOTONES DE GESTION DE LOS NOMENCLADORES
         */
        _this.btnAplicar = new Ext.Button({
            text    : " Aplicar",
            minWidth: 75, //icon    : perfil.dirImg + 'aplicar.png',
            iconCls : 'aplicar',
            prevTab : "btnCancelar" + _this.name,
            nextTab : "btnAceptar" + _this.name,
            disabled: true,
            tooltip : "Guardar datos y limpiar los campos",
            id      : "btnAplicar" + _this.name,
            handler : function () {
                _this.enviar(true)
            }
        });
        _this.btnAceptar = new Ext.Button({
            text    : "Aceptar",
            minWidth: 75,
            prevTab : (_this.modificar) ? "btnCancelar" + _this.name : "btnAplicar" + _this.name,
            nextTab : next(_this.name),
            disabled: true,
            iconCls : 'aceptar',
            tooltip : "Guardar datos y cerrar ventana",
            id      : "btnAceptar" + _this.name,
            handler : function () {
                _this.enviar(false);
            }
        });
        function next(_name) {
            var id = "";
            switch (_name) {
                case 'salario' :
                {
                    id = 'comboGrupoComplejidad' + _this.name
                    break;
                }
                case 'escala' :
                {
                    id = 'comboTipoEscala' + _this.name
                    break;
                }
                default :
                {
                    id = 'denominacion' + _this.name
                    break;
                }
            }
            return id;
        }

        _this.btnCancelar = new Ext.Button({
            text    : "Cancelar",
            minWidth: 75,
            prevTab : "fechafin",
            nextTab : (_this.modificar) ? "btnAceptar" + _this.name : "btnAplicar" + _this.name,
            iconCls : 'cancelar',
            tooltip : "Cerrar ventana sin guardar los datos",
            id      : "btnCancelar" + _this.name,
            handler : function () {
                _this.close();
            }
        });
        /**
         * STORE DEL TIPO DE ESCALA PARA ESCALA SALARIAL
         */
        _this.storeTipoEscala = new Ext.data.Store({
            url      : 'mostrarValores', autoLoad: _this.tipo == 20, baseParams: {
                clase: 'tipoescala_domain', accion: 'dameTodosVisibles', gestion: true
            }, reader: new Ext.data.JsonReader({
                root: "datos"
            }, [{name: 'idtipoescala'}, {name: 'denominacion'}])
        });
        /**
         * STORE DE LOS GRUPOS DE CATEGORIA
         */

        _this.storeCategoria = new Ext.data.Store({
            url      : 'mostrarValores', autoLoad: _this.tipo == 10, baseParams: {
                clase: 'categoria_domain', accion: 'dameTodosVisibles', gestion: true
            }, reader: new Ext.data.JsonReader({
                root: "datos"
            }, [{name: 'idcategoria'}, {name: 'denominacion'}])
        });
        /**
         * COMBO DE ESCALA SALARIAL PARA SALARIO Y GRUPO DE COMPLEJIDAD
         */
        _this.comboCategoria = new Ext.form.ccoe.ComboBox({
            anchor        : '99%',
            id            : 'comboCategoria' + _this.name,
            prevTab       : 'denominacion' + _this.name,
            nextTab       : 'abreviatura' + _this.name,
            value         : (_this.modificar) ? _this.record.data.categoria : '',
            autoCreate    : true,
            editable      : true,
            store         : _this.storeCategoria,
            mode          : 'local',
            forceSelection: true,
            enableQtip    : true,
            allowBlank    : false,
            fieldLabel    : "Categoría",
            displayField  : 'denominacion',
            valueField    : 'denominacion',
            hiddenName    : 'categoria',
            triggerAction : 'all',
            handler       : function () {
                this.store.removeAll();
                this.store.load();
            },
            listeners     : {
                select: function (combo, record) {
                    Ext.getCmp('hiddenIdCategoria' + _this.name).setValue(record.data.idcategoria);
                }
            }
        });
        /**
         * COMBO DE ESCALA SALARIAL PARA SALARIO Y GRUPO DE COMPLEJIDAD
         */
        _this.comboTipoEscala = new Ext.form.ccoe.ComboBox({
            anchor        : '99%',
            id            : 'comboTipoEscala' + _this.name,
            value         : (_this.modificar) ? _this.record.data.tipoescala : '',
            autoCreate    : true,
            editable      : true,
            store         : _this.storeTipoEscala,
            prevTab       : "btnAceptar" + _this.name,
            nextTab       : 'comboGrupoComplejidad' + _this.name,
            mode          : 'local',
            forceSelection: true,
            enableQtip    : true,
            allowBlank    : false,
            fieldLabel    : "Tipo de escala",
            displayField  : 'denominacion',
            valueField    : 'denominacion',
            hiddenName    : 'tipoescala',
            triggerAction : 'all',
            handler       : function () {
                this.store.removeAll();
                this.store.load();
            },
            listeners     : {
                select: function (combo, record) {
                    Ext.getCmp('hiddenIdTipoEscala' + _this.name).setValue(record.data.idtipoescala);
                }
            }
        });
        /**
         * STORE DE GRUPO DE COMPLEJIDAD PARA SALARIO
         */

        _this.storeTipos = new Ext.data.Store({
            url       : 'mostrarValores',
            autoLoad  : _this.tipo == 20 || _this.tipo == 15 || _this.tipo == 7,
            baseParams: {
                clase  : 'grupo_domain',
                accion : (_this.tipo == 15) ? 'dameTodosVisibles' : 'dameTodosVisiblesInSalario',
                gestion: true
            },
            reader    : new Ext.data.JsonReader({
                root: "datos"
            }, [{name: 'idgrupocomplejidad'}, {name: 'denominacion'}]),
            listeners : {
                beforeload: function () {
                    if (_this.tipo == 7 && _this.modificar) {
                        _this.comboTipos.setValue('');
                    }
                }, load   : function () {
                    if (_this.tipo == 7 && _this.modificar) {
                        _this.comboTipos.enable();
                        _this.comboTipos.setValue(_this.record.data.idcondicion);
                    }
                }
            }
        });
        /* para norma juridica*/

        /**
         * STORE DE NORMA JURIDICA
         */
        _this.storeNorma = new Ext.data.Store({
            url       : 'mostrarValores',
            autoLoad  : _this.tipo == 7,
            baseParams: {
                clase  : 'normajuridica_domain',
                accion : 'dameTodosVisibles',
                gestion: true
            },
            reader    : new Ext.data.JsonReader({
                root: "datos"
            }, [{name: 'idnormajuridica'}, {name: 'denominacion'}]),
            listeners : {
                //beforeload: function ()
                //{
                //	if (_this.tipo == 7 && _this.modificar) {
                //		_this.storeNorma.setValue(_this.record.data.idnormajuridica);
                //	}
                //},
                load: function () {
                    if (_this.tipo == 7 && _this.modificar) {
                        //_this.storeNorma.enable();
                        //_this.storeNorma.setValue(_this.record.data.idnormajuridica);
                    }
                }
            }
        });
        /**
         * COMBO DE GRUPO DE COMPLEJIDAD PARA SALARIO
         */
        _this.comboNormaJuridica = new Ext.form.ccoe.ComboBox({
            anchor        : '99%',
            id            : 'comboNormaJuridica' + _this.name,
            //prevTab       : (_this.name != 'salario') ? 'comboTipoEscala' + _this.name : "btnAceptar" + _this.name,
            //nextTab       : (_this.name != 'salario') ? 'comboSalario' + _this.name : 'salario' + _this.name,
            autoCreate    : true,
            editable      : true,
            store         : _this.storeNorma,
            value         : (_this.modificar) ? _this.record.data.normajuridica : '',
            mode          : 'local',
            forceSelection: true,
            enableQtip    : true,
            allowBlank    : true,
            fieldLabel    : "Norma juridica",
            displayField  : 'denominacion',
            valueField    : 'denominacion',
            hiddenName    : 'normajuridica',
            triggerAction : 'all',
            handler       : function () {
                //if (this.store.data.length > 0) {
                //	this.store.removeAll();
                //}
                //_this.storeSalario.removeAll();
                //_this.comboSalario.setValue('');
                //this.store.load();
            },
            listeners     : {
                select: function (combo, record) {
                    var valor = record.data.idnormajuridica;
                    Ext.getCmp('hiddenIdNormaJuridica' + _this.name).setValue(valor);
                    _this.storeSalario.load({
                        params: {
                            idnormajuridica: valor
                        }
                    });
                }
            }
        });


        /**
         * COMBO DE GRUPO DE COMPLEJIDAD PARA SALARIO
         */
        _this.comboGrupoComplejidad = new Ext.form.ccoe.ComboBox({
            anchor        : '99%',
            id            : 'comboGrupoComplejidad' + _this.name,
            prevTab       : (_this.name != 'salario') ? 'comboTipoEscala' + _this.name : "btnAceptar" + _this.name,
            nextTab       : (_this.name != 'salario') ? 'comboSalario' + _this.name : 'salario' + _this.name,
            autoCreate    : true,
            editable      : true,
            store         : _this.storeTipos,
            value         : (_this.modificar) ? _this.record.data.grupocomplejidad : '',
            mode          : 'local',
            forceSelection: true,
            enableQtip    : true,
            allowBlank    : false,
            fieldLabel    : "Grupo de escala",
            displayField  : 'denominacion',
            valueField    : 'denominacion',
            hiddenName    : 'grupocomplejidad',
            triggerAction : 'all',
            handler       : function () {
                if (this.store.data.length > 0) {
                    this.store.removeAll();
                }
                _this.storeSalario.removeAll();
                _this.comboSalario.setValue('');
                this.store.load();
            },
            listeners     : {
                select: function (combo, record) {
                    var valor = record.data.idgrupocomplejidad;
                    Ext.getCmp('hiddenIdGrupoComplejidad' + _this.name).setValue(valor);
                    _this.storeSalario.load({
                        params: {
                            idgrupocomplejidad: valor
                        }
                    });
                }
            }
        });
        /**
         * COMBO DE GRUPO DE COMPLEJIDAD PARA SALARIO
         */
        _this.comboTipos = new Ext.form.MultiComboSelect({
            id           : 'comboTipos' + _this.name,
            fieldLabel   : 'Condición',
            name         : 'condicion',
            hideOnSelect : false,
            disabled     : _this.modificar,
            anchor       : '99%',
            store        : _this.storeTipos,
            prevTab      : "comboGrupoComplejidad" + _this.name,
            nextTab      : 'fechaInicio',
            triggerAction: 'all',
            valueField   : 'idgrupocomplejidad',
            displayField : 'denominacion',
            mode         : 'local',
            editable     : false,
            allowBlank   : true
        });
        /**
         * STORE DEL SALARIO
         */
        _this.storeSalario = new Ext.data.Store({
            url      : 'mostrarValores', baseParams: {
                clase: 'salario_domain', accion: 'dameTodosVisibles', gestion: true
            }, reader: new Ext.data.JsonReader({
                root: "datos"
            }, [{name: 'idsalario'}, {name: 'salario'}])
        });
        /**
         * COMBO DEL SALARIO
         */
        _this.comboSalario = new Ext.form.ccoe.ComboBox({
            anchor        : '99%',
            id            : 'comboSalario' + _this.name,
            autoCreate    : true,
            editable      : true,
            store         : _this.storeSalario,
            value         : (_this.modificar) ? _this.record.data.salario : '',
            mode          : 'local',
            forceSelection: true,
            enableQtip    : true,
            prevTab       : "comboGrupoComplejidad" + _this.name,
            nextTab       : 'fechainicio',
            allowBlank    : false,
            fieldLabel    : "Salario",
            displayField  : 'salario',
            valueField    : 'salario',
            hiddenName    : 'salario',
            triggerAction : 'all',
            listeners     : {
                expand   : function () {
                    if (this.store.data.length > 0) {
                        this.store.removeAll();
                    }
                    var valor = Ext.getCmp('hiddenIdGrupoComplejidad' + _this.name).getValue();
                    this.store.load({
                        params: {
                            idgrupocomplejidad: valor
                        }
                    });
                }, select: function (combo, record) {
                    Ext.getCmp('hiddenIdSalario' + _this.name).setValue(record.data.idsalario);
                }
            }
        });
        /**
         * ABREVIATURA DEL FILTRO
         */
        _this.abreviatura = new Ext.form.TextField({
            fieldLabel: "Abreviatura",
            name      : 'abreviatura',
            prevTab   : "denominacion" + _this.name,
            nextTab   : 'fechainicio',
            value     : (_this.modificar) ? _this.record.data.abreviatura : '',
            id        : 'abreviatura' + _this.name,
            vtype     : (_this.tipo == 24) ? 'vtnormajuridica' : 'vtabrev',
            allowBlank: false,
            anchor    : '99%',
            maxLength : 10
        })
        /**
         * Fecha de creacion del nomenclador
         * @type {Ext.form.DateField}
         */
        _this.fechaInicio = new Ext.form.DateField({
            fieldLabel  : 'Fecha de inicio',
            allowBlank  : false,
            format      : 'd/m/Y',
            id          : 'fechainicio',
            name        : 'fechainicio',
            vtype       : 'daterange',
            endDateField: 'fechafin',
            minText     : "La fecha fin tiene que ser posterior o igual a la fecha de inicio.",
            maxText     : "La fecha de inicio tiene que ser anterior o igual a la fecha fin.",
            anchor      : '99%',
            value       : (_this.modificar) ? _this.record.data.fechainicio : new Date(),
            maskRe      : /[\d\/]/,
            invalidText : 'El formato establecido: dd/mm/aaaa.',
            parseDate   : function (v) {
                return (!v || v instanceof Date) ? v : ((v.length == 6 || v.length == 8 || v.length == 10) && (Date.parseDate(v, 'd/m/y') || Date.parseDate(v, 'd/m/Y')));
            }
        })
        _this.fechaFin = new Ext.form.DateField({
            fieldLabel    : 'Fecha de fin',
            format        : 'd/m/Y',
            id            : 'fechafin',
            name          : 'fechafin',
            vtype         : 'daterange',
            minText       : "La fecha fin tiene que ser posterior o igual a la fecha de inicio.",
            maxText       : "La fecha de inicio tiene que ser anterior o igual a la fecha fin.",
            startDateField: 'fechainicio',
            invalidText   : 'El formato establecido: dd/mm/aaaa.',
            anchor        : '99%',
            value         : (_this.modificar) ? _this.record.data.fechafin : "",
            maskRe        : /[\d\/]/,
            parseDate     : function (v) {
                return (!v || v instanceof Date) ? v : ((v.length == 6 || v.length == 8 || v.length == 10) && (Date.parseDate(v, 'd/m/y') || Date.parseDate(v, 'd/m/Y')));
            }
        })
        /**
         * EN CASO DE SER SALARIO SE ADICIONA UN NUMBERFIELD Y NO UN TEXTFIELD
         */
        if (_this.salario) {
            /**
             * @type {NumberField}
             */
            _this.denominacion = new Ext.form.NumberField({
                fieldLabel      : "Salario",
                name            : 'salario',
                id              : 'salario' + _this.name,
                value           : (_this.modificar) ? _this.record.data.salario : '',
                prevTab         : 'comboGrupoComplejidad' + _this.name,
                allowNegative   : false,
                nanText         : "Solo admite números reales de 10 dígitos. Con (hasta) 2 cifras decimales.",
                allowBlank      : false,
                anchor          : '99%',
                maxLength       : 10,
                decimalPrecision: 2
            })
        } else {
            /**
             * @type {TextField}
             */
            _this.denominacion = new Ext.form.TextField({
                fieldLabel: "Denominación",
                name      : 'denominacion',
                value     : (_this.modificar) ? _this.record.data.denominacion : '',
                id        : 'denominacion' + _this.name,
                prevTab   : "btnAceptar" + _this.name,
                vtype     : (_this.tipo == 24) ? 'vtnormajuridica' : (_this.tipo == 7) ? '' : 'vtdenominaciones',
                allowBlank: false,
                anchor    : '99%',
                maxLength : (_this.tipo == 7) ? 255 : 100,
                listeners : {
                    'render': function (_tf) {
                        _tf.focus(false, 10)
                    }
                }
            })
        }
        /**
         * ARREGLO DE ELEMENTOS DEL FORMULARIO
         * @type {Array}
         */
        _this.itemsFormulario = new Array();
        _this.height = 370;   // 355
        switch (_this.tipo) {
            case 20://Escala salarial
                _this.itemsFormulario.push(_this.comboTipoEscala);
                _this.itemsFormulario.push(_this.comboGrupoComplejidad);
                _this.itemsFormulario.push(_this.comboSalario);
                if (_this.modificar) {
                    _this.storeSalario.load({
                        params: {
                            idgrupocomplejidad: _this.record.data.idgrupocomplejidad
                        }
                    })
                }
                ;
                _this.itemsFormulario.push(_this.fechaInicio);
                _this.itemsFormulario.push(_this.fechaFin);
                _this.height = 330;
                break;
            case 10://Subcategoria ocupacional
                _this.itemsFormulario.push(_this.denominacion);
                _this.itemsFormulario.push(_this.comboCategoria);
                _this.itemsFormulario.push(_this.abreviatura);
                _this.itemsFormulario.push(_this.fechaInicio);
                _this.itemsFormulario.push(_this.fechaFin);
                break;
            case 15://Salario
                _this.itemsFormulario.push(_this.comboGrupoComplejidad);
                _this.itemsFormulario.push(_this.denominacion);
                _this.itemsFormulario.push(_this.fechaInicio);
                _this.itemsFormulario.push(_this.fechaFin);
                _this.height = 280;
                break;
            case 7://Cargo
                _this.itemsFormulario.push(_this.denominacion);
                _this.itemsFormulario.push(_this.abreviatura);
                _this.itemsFormulario.push({
                    layout  : 'column', defaults: {
                        columnWidth: .5, layout: 'form'
                    }, items: [{
                        defaults: {
                            anchor: '95%'
                        }, items: [_this.comboGrupoComplejidad]
                    }, {
                        items: [_this.comboTipos]
                    }
                        , {
                            items: [
                                {
                                    xtype: "checkbox",
                                    boxLabel: "Facultado",
                                    hideLabel: true,
                                    checked: (_this.modificar) ? parseInt(_this.record.data.facultado) : 0,
                                    name: "facultado",
                                    id: "facultado" + _this.name
                                }
                            ]
                        }]
                });
                _this.itemsFormulario.push(_this.comboNormaJuridica);
                _this.itemsFormulario.push(_this.fechaInicio);
                _this.itemsFormulario.push(_this.fechaFin);
                _this.width = 320;
                break;
            default ://Todos
                _this.itemsFormulario.push(_this.denominacion);
                _this.itemsFormulario.push(_this.abreviatura);
                _this.itemsFormulario.push(_this.fechaInicio);
                _this.itemsFormulario.push(_this.fechaFin);
                _this.height = 340;   // 280
                break;
        }
        /**
         * SE ADICIONAN LOS ELEMENTOS RESTANTES
         */
        _this.itemsFormulario.push({
            xtype: 'hidden',
            id   : 'denanterior' + _this.name,
            value: (_this.modificar) ? _this.record.data.denominacion : '',
            name : 'denanterior',
            style: 'display: none'
        });
        _this.itemsFormulario.push({
                xtype: 'hidden',
                name : 'idtipoescala',
                id   : 'hiddenIdTipoEscala' + _this.name,
                value: (_this.modificar) ? _this.record.data.idtipoescala : ''
            }, {
                xtype: 'hidden',
                name : 'idgrupocomplejidad',
                id   : 'hiddenIdGrupoComplejidad' + _this.name,
                value: (_this.modificar) ? _this.record.data.idgrupocomplejidad : ''
            },
            {
                xtype: 'hidden',
                name : 'idnormajuridica',
                id   : 'hiddenIdNormaJuridica' + _this.name,
                value: (_this.modificar) ? _this.record.data.idnormajuridica : ''

            },
            {
                xtype: 'hidden',
                name : 'idcategoria',
                id   : 'hiddenIdCategoria' + _this.name,
                value: (_this.modificar) ? _this.record.data.idcategoria : ''
            }, {
                xtype: 'hidden',
                name : 'idsalario',
                id   : 'hiddenIdSalario' + _this.name,
                value: (_this.modificar) ? _this.record.data.idsalario : ''
            }, {
                layout: "column", labelAlign: 'rigth', items: [{
                    columnWidth: .22, items: [{
                        xtype    : "checkbox",
                        boxLabel : "Actual",
                        hidden   : true,
                        hideLabel: true,
                        checked  : (_this.modificar) ? parseInt(_this.record.data.actual) : 1,
                        name     : "actual",
                        id       : "actual" + _this.name
                    }]
                }, {
                    columnWidth: .20, items: [{
                        xtype    : "checkbox",
                        boxLabel : "Visible",
                        hidden   : true,
                        checked  : (_this.modificar) ? parseInt(_this.record.data.visible) : 1,
                        hideLabel: true,
                        name     : "visible",
                        id       : "visible" + _this.name
                    }]
                }]

            });
        /**
         * FORMULARIO DE LA VENTANA
         * @type {FormPanel}
         */
        _this.on('show', function () {
            if (_this.tipo == 20) {
                _this.comboTipoEscala.focus(false, 10)
            }
            if (_this.denominacion.name != "salario") {
                _this.denominacion.focus(false, 10)
            } else {
                _this.comboGrupoComplejidad.focus(false, 10)
            }
        })
        _this.on('destroy', function () {
            if (_this.name != "salario") {
                Ext.getCmp("btnAdicionar_" + _this.name).focus(false, 10);
            }
        })
        _this.formulario = new Ext.FormPanel({
            layout    : 'form', // monitorValid: true,
            frame     : true,
            bodyStyle : 'padding: 5px 0 0 0;',
            labelAlign: 'top',
            items     : _this.itemsFormulario,
            listeners : {
                'clientvalidation': function (_form, _valid) {
                    var ready = false;
                    if (_this.modificar && _this.tipo == 7) {
                        var valueCondition = _this.comboTipos.getValue();
                        valueCondition = (valueCondition) ? valueCondition : null;
                        var isDirty = ((_this.denominacion.getValue() != _this.record.data.denominacion) || (_this.abreviatura.getValue() != _this.record.data.abreviatura) || (_this.comboGrupoComplejidad.getValue() != _this.record.data.grupocomplejidad) || (valueCondition != _this.record.data.idcondicion) || (_this.fechaInicio.getRawValue() != _this.record.data.fechainicio) || (_this.fechaFin.getRawValue() != _this.record.data.fechafin));
                        if (_valid && isDirty) {
                            ready = true;
                        } else {
                            ready = false;
                        }
                    } else {
                        if (_valid && _form.getForm().isDirty()) {
                            ready = true;
                        }
                    }
                    if (ready) {
                        _this.btnAplicar.enable();
                        _this.btnAceptar.enable();
                    } else {
                        _this.btnAplicar.disable();
                        _this.btnAceptar.disable();
                    }
                }
            }
        });
        Ext.apply(this, {
            layout      : 'fit',
            items       : [_this.formulario],
            width       : 300,
            resizable   : false,
            autoValidate: false,
            closeAction : 'destroy',
            constrain   : true,
            modal       : true,
            bufferResize: true,
            keys        : [{
                key: Ext.EventObject.ENTER, fn: function () {
                    _this.btnAceptar.handler.call();
                }
            }, {
                key: Ext.EventObject.INSERT, fn: function () {
                    if (!_this.btnAplicar.hidden) {
                        _this.btnAplicar.handler.call();
                    }
                }

            }],
            buttons     : [_this.btnCancelar, _this.btnAplicar, _this.btnAceptar]

        })
        if (this.modificar) {
            this.title = 'Modificar ' + this.title;
            Ext.getCmp("btnAplicar" + _this.name).hidden = true;
        } else {
            this.title = 'Adicionar ' + this.title;
        }
        Nomenclador.Comun.superclass.initComponent.apply(this)
    },
    enviar          : function (accion) {
        var _this = this;
        var form = _this.formulario.getForm();
        if (form.isValid()) {
            Secodena.mostrarMascara('cargaini', "Por favor espere...", "Guardando datos " + _this.texto + ".");
            var param = new Array();
            param.push(_this.idNomenclador);
            param.push(_this.tipo);
            var values = form.getValues();
            if (_this.tipo == 7) {
                values.condicion = _this.comboTipos.getValue();
            }
            param.push(values);

            Ext.Ajax.request({
                url        : 'gestionarAcciones', params: {
                    clase     : _this.name,
                    accion    : (_this.modificar) ? 'modificar' : 'insertar',
                    parametros: Ext.encode(param)
                }, callback: function (options, success, response) {
                    Secodena.ocultarMascara('cargaini');
                    var responseData = Ext.decode(response.responseText);
                    var codMsg = (responseData.codMsg == 4) ? 6 : responseData.codMsg;
                    var msg = responseData.mensaje;
                    mostrarMensaje(codMsg, msg);
                    if (codMsg == 1) {
                        if (!accion) {
                            _this.destroy();
                        } else {
                            form.reset();
                        }
                        var options = _this.store.lastOptions;
                        var start = 0;
                        if (_this.modificar) {
                            _this.store.load({params: {start: options.params.start, limit: 15}});
                        } else {
                            if (options != null) {
                                var div = Math.floor(_this.store.totalLength / 15);
                                start = 15 * div;
                            }
                            _this.store.load({params: {start: start, limit: 15}});
                        }
                    }
                }
            })
        } else {
            mostrarMensaje(6, "Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).")
        }
    }
})
