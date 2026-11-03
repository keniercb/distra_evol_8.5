Ext.ns('Estructura');
Estructura.OrganoInterno = Ext.extend(Ext.Window, {
    /**
     * Identificador del elemento a gestionar (5)
     * */
    idconcepto: 5, /**
     * Nodo padre del elemento para la recarga en caso de inserción
     * o el nodo a modificar en caso de modificacion
     * */
    nodo: false, /**
     * TreeLoader de la estructura que se gestiona
     * */
    loaderTreeEstructura: false, /**
     * Nombre del tipo de elemento para la label del tipo del mismo
     * */
    tipoElemento: 'organo interno', /**
     * Identificador del proyecto al que pertenece
     * */
    proyecto: false, /**
     * Store del grid de proyecto para recargar el cambio en el proyecto
     * */
    storeProyecto: false, /**
     * Título de la ventana
     * */
    title: '', /**
     * Para conocer si se esta modificando o adicionando un nuevo elemento
     * */
    modificar: false, /**
     * Name del elemento para los identificadores de sus componentes
     * */
    name: 'organointerno', /**
     * Etiquetas del sistema
     * */
    etiquetas: etiquetas.estructura, initComponent: function () {
        var _this = this;
        _this.rutaUrl = 'estructura';
        if (_this.proyecto) {
            _this.isGestionProyecto = true;
        }
        if (_this.isGestionProyecto) {
            _this.rutaUrl = 'proyecto';
        }
        /**
         * @cfg {String} url
         * Cambia la ruta para las peticiones de estructura en el panel
         */
        _this.urlReal = '/metadatos/' + _this.rutaUrl + '/index.php/' + _this.rutaUrl + '/';
        _this.btnAplicar = new Ext.Button({
            text: _this.etiquetas.lbBtnAplicar,
            iconCls: 'aplicar',
            minWidth: 75,
            id: "btnAplicar",
            nextTab: "btnAceptar",
            prevTab: "btnCancelar",
            hidden: _this.modificar,
            tooltip: _this.etiquetas.lbtooltipaplicar,
            handler: function () {
                _this.enviar();
            }
        });
        _this.btnAceptar = new Ext.Button({
            text: _this.etiquetas.lbBtnAceptar,
            id: "btnAceptar",
            nextTab: "tfDenominacion",
            prevTab: "btnAplicar",
            iconCls: 'aceptar',
            minWidth: 75,
            tooltip: _this.etiquetas.lbtooltipaceptar,
            handler: function () {
                _this.enviar(true);
            }
        });

        /*no*/
        _this.storeSector = new Ext.data.Store({
            id: 'idsectorEntidad',
            url: 'mostrarsector',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: "datos",
                id: "idsector"
            }, [
                {
                    name: 'idsector'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'abreviatura'
                }
            ])
        });


        _this.storeTipoEntidad = new Ext.data.Store({
            id: 'identidad', url: _this.urlReal + 'mostrarTipoOrgano', baseParams: {
                idconcepto: _this.idconcepto
            }, autoLoad: true, reader: new Ext.data.JsonReader({
                root: "datos", id: "idorgano"
            }, [{
                name: 'idorgano'
            }, {
                name: 'denominacion'
            }])
        });
        _this.tipo = new Array();
        _this.tipo.push('logo');
        _this.stIcono = new Ext.data.Store({
            url: _this.urlReal + 'mostrarIconos', autoload: true, reader: new Ext.data.JsonReader({
                root: "datos"
            }, [{name: 'idicono'}, {name: 'icono'}, {name: 'denominacion'}])
        })
        _this.stIcono.baseParams.parametros = _this.tipo;
        _this.stIcono.load();
        /*no*/
        _this.storeTipoEscala = new Ext.data.Store({
            url: _this.urlReal + 'mostrarTipoEscala', baseParams: {
                idconcepto: _this.idconcepto
            }, autoLoad: true, reader: new Ext.data.JsonReader({
                root: "datos"
            }, [{
                name: 'idtipoescala'
            }, {
                name: 'denominacion'
            }])
        });
        _this.formulario = new Ext.form.FormPanel({
            id: 'formulario' + _this.name, trackResetOnLoad: true, monitorValid: true, listeners: {
                'clientvalidation': function (form, valid) {
                    Go.Util.orderTabIndices(form);
                    if (form.getForm().isDirty() && valid) {
                        _this.btnAplicar.enable();
                        _this.btnAceptar.enable();
                    } else {
                        _this.btnAplicar.disable();
                        _this.btnAceptar.disable();
                    }
                }
            }, reader: new Ext.data.JsonReader({
                root: "datos", successProperty: "success"
            }, [{
                name: 'codigo'
            }, {
                name: 'especialidad'
            },{
                name: 'codigonit'
            }, {
                name: 'idespecialidad'
            }, {
                name: 'idtipoescala_anterior', mapping: 'idtipoescala'
            }, {
                name: 'denominacion'
            }, {
                name: 'abreviatura'
            }, {
                name: 'correo'
            }, {
                name: 'fax'
            }, {
                name: 'telefonos'
            }, {
                name: 'objetosocial'
            }, {
                name: 'funcioneslegales'
            }, {
                name: 'direccion'
            }, {
                name: 'idorgano'
            }, {
                name: 'organo'
            }, {
                name: 'iddpt'
            }, {
                name: 'ubicaciondpt'
            }, {
                name: 'icono'
            }, {
                name: 'nombre_imagen'
            }, {
                name: 'codigonirc'
            }]),
            region: 'center',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            items: [
                {

                    layout: 'form',
                    //bodyStyle : 'padding:5px 5px 0',
                    labelAlign: 'top',
                    //labelWidth: 30,
                    items: [
                        {
                            xtype: 'textfield',
                            layout: 'form',
                            labelAlign: 'top',
                            //columnWidth: .40,
                            fieldLabel: _this.etiquetas.lbdenominacion,
                            name: 'denominacion',
                            id: "tfDenominacion",
                            /*nextTab    : "tfReup",*/
                            prevTab: "btnAceptar",
                            allowBlank: false,
                            maxLength: 100,
                            anchor: '100%',
                            vtype: 'vtdenomest'
                        }/*,
                        {
                            columnWidth: .40,
                            layout     : 'form',
                            labelWidth : 40,
                            labelAlign : 'top',
                            defaults   : {
                                anchor: '100%'
                            }

                        }*/]
                },
                {
                    layout: 'column', items: [{
                        columnWidth: .5, layout: 'form', labelWidth: 40, labelAlign: 'top', defaults: {
                            anchor: '100%'
                        }, defaultType: 'textfield', bodyStyle: 'padding:5px 5px 0', items: [

                            {
                                fieldLabel: _this.etiquetas.lbabreviatura,
                                name: 'abreviatura',
                                nextTab: "ubicaciondpt",
                                id: "tfAbreviatura",
                                prevTab: "combotipoentidad",
                                vtype: 'vtalfanumerico',
                                maxLength: 10
                            }]
                    },


                        {
                            columnWidth: .5, layout: 'form', labelWidth: 40, labelAlign: 'top', defaults: {
                                anchor: '100%'
                            }, defaultType: 'textfield', bodyStyle: 'padding:5px 5px 0', items: [{
                                fieldLabel: _this.etiquetas.lbespecialidad,
                                name: 'especialidad',
                                hiddenName: 'especialidad',
                                allowBlank: false,
                                nextTab: "combotipoentidad",
                                prevTab: "tfReup",
                                id: 'especialidad' + _this.name,
                                emptyText: _this.etiquetas.lbMsgSeleccione,
                                maxLength: 100,
                                listeners: {
                                    focus: function () {
                                        var winEspecialidad = new Go.Int.Especialidad.Ventana({
                                            etiquetas: _this.etiquetas,
                                            componentForValueID: Ext.getCmp('idespecialidad' + _this.name),
                                            componentForValue: Ext.getCmp('especialidad' + _this.name)
                                        });
                                        winEspecialidad.show();
                                    }
                                }
                            }, {
                                xtype: 'hidden', id: 'idespecialidad' + _this.name, name: 'idespecialidad'
                            }, {
                                xtype: 'hidden', id: 'iddpt', name: 'iddpt'
                            }]
                        },


                        {
                            columnWidth: .5,
                            layout: 'form',
                            labelWidth: 40,
                            labelAlign: 'top',
                            defaults: {
                                anchor: '100%'
                            }, defaultType: 'textfield',
                            bodyStyle: 'padding:5px 5px 0',
                            items: [{
                                fieldLabel: 'Código',
                                name: 'codigo',
                                nextTab: "combotipoentidad",
                                prevTab: "tfReup",
                                id: 'codigo' + _this.name,
                                emptyText: _this.etiquetas.lbMsgSeleccione,
                                maxLength: 100
                            }]
                        },
                        {
                            columnWidth: .5, defaults: {
                                anchor: '100%'
                            }
                            , layout: 'form',
                            //labelWidth: 40,
                            labelAlign: 'top',
                            bodyStyle: 'padding:5px 5px 0',
                            items: [{
                                xtype: 'combo2',
                                id: 'combotipoentidad',
                                nextTab: "tfAbreviatura",
                                prevTab: 'especialidad' + _this.name,
                                autoCreate: true,
                                store: _this.storeTipoEntidad,
                                forceSelection: true,
                                mode: 'local',
                                enableQtip: true,
                                allowBlank: false,
                                fieldLabel: _this.etiquetas.lbTipoDe + _this.tipoElemento,
                                name: 'organo',
                                hiddenName: 'organo',
                                displayField: 'denominacion',
                                valueField: 'denominacion',
                                emptyText: _this.etiquetas.lbMsgSeleccione,
                                triggerAction: 'all',
                                handler: function () {
                                    this.store.removeAll();
                                    this.store.load();
                                    Ext.getCmp('hiddenIdOrgano' + _this.name).setValue('');
                                },
                                listeners: {
                                    select: function (combo, record) {
                                        Ext.getCmp('hiddenIdOrgano' + _this.name).setValue(record.data.idorgano);
                                    }
                                }
                            },
                                {
                                    xtype: 'hidden', name: 'idorgano', id: 'hiddenIdOrgano' + _this.name
                                },
                                {
                                    xtype: 'hidden',
                                    name: 'idtipoescala_anterior',
                                    id: 'hiddenIdTipoEscalaAnterior' + _this.name
                                }]
                        }]
                }, {
                    xtype: 'fieldset',
                    title: 'Informaci&oacute;n adicional',
                    autoHeight: true,
                    autoWidth: true,
                    labelAlign: 'top',
                    bodyStyle: 'padding:5px 5px 0',
                    anchor: '99%',
                    items: [{
                        layout: 'column', items: [{
                            columnWidth: .45, layout: 'form', labelWidth: 40, labelAlign: 'top', items: [{
                                xtype: 'imagencombo',
                                fieldLabel: 'Logotipo',
                                id: 'nombre_imagen',
                                nextTab: "tfCorreo",
                                prevTab: 'combotipoescala',
                                name: 'nombre_imagen',
                                emptyText: "Seleccione...",
                                valueField: 'denominacion',
                                displayField: 'denominacion',
                                parent: 'logo',
                                anchor: '95%',
                                store: _this.stIcono,
                                listeners: {
                                    select: function (combo, record) {
                                        Ext.getCmp('icono').setValue(record.data.idicono);
                                    }
                                }
                            }, {
                                xtype: 'hidden', id: 'icono', name: 'icono'
                            }]
                        }, {
                            columnWidth: .25, layout: 'form', labelAlign: 'top', items: [{
                                xtype: 'textfield',
                                fieldLabel: _this.etiquetas.lbCorreo,
                                name: 'correo',
                                id: "tfCorreo",
                                nextTab: "tfFax",
                                prevTab: 'nombre_imagen',
                                anchor: '95%',
                                vtype: 'vtcorreo',
                                maxLength: 50
                            }]
                        }, {
                            columnWidth: .30, layout: 'form', labelAlign: 'top', items: [{
                                xtype: 'textfield',
                                fieldLabel: _this.etiquetas.lbfax,
                                name: 'fax',
                                id: 'tfFax',
                                nextTab: "tfTelf",
                                prevTab: 'tfCorreo',
                                anchor: '99%',
                                maxLength: 255
                            }]
                        }]
                    }, {
                        layout: 'column', items: [{
                            columnWidth: .45, layout: 'form', labelWidth: 40, labelAlign: 'top', items: [{
                                xtype: 'textfield',
                                fieldLabel: _this.etiquetas.lbtelefonos,
                                name: 'telefonos',
                                id: "tfTelf",
                                nextTab: "taObjeto",
                                prevTab: 'tfFax',
                                anchor: '95%',
                            }, {
                                xtype: 'textarea',
                                fieldLabel: _this.etiquetas.lbobjetosocial,
                                name: 'objetosocial',
                                id: 'taObjeto',
                                prevTab: 'tfTelf',
                                nextTab: "taFunciones",
                                anchor: '95%',
                                height: 50,
                                maxLength: 255
                            }, {
                                xtype: 'textarea',
                                fieldLabel: _this.etiquetas.lbfuncioneslegales,
                                name: 'funcioneslegales',
                                id: 'taFunciones',
                                prevTab: 'taObjeto',
                                nextTab: "taDir",
                                anchor: '95%',
                                height: 70,
                                maxLength: 255
                            }]
                        }, {
                            columnWidth: .55, layout: 'form', labelAlign: 'top', items: [
                                {
                                    columnWidth: .25, layout: 'form', labelAlign: 'top', items: [{
                                        xtype     : 'textfield',
                                        fieldLabel: 'Código NIT',
                                        id        : 'tfcodigonit',
                                        prevTab   : 'tfFax',
                                        nextTab   : "taDir",
                                        name      : 'codigonit',
                                        anchor    : '100%',
                                        // height    : 180,
                                        maxLength : 255,
                                        //vtype     : 'vtalfanumerico'
                                    }]
                                },{
                                    columnWidth: .30, layout: 'form', labelAlign: 'top', items: [{
                                        xtype     : 'textfield',
                                        fieldLabel: 'Código NIRC',
                                        id        : 'tfcodigonirc',
                                        prevTab   : 'tfFax',
                                        nextTab   : "taDir",
                                        name      : 'codigonirc',
                                        anchor    : '100%',
                                        // height    : 180,
                                        maxLength : 255,
                                        //vtype     : 'vtalfanumerico'
                                    }]
                                },{
                                    columnWidth: .55,
                                    fieldLabel: _this.etiquetas.lbDPA,
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    id: 'ubicaciondpt',
                                    nextTab: "combotipoescala",
                                    prevTab: "tfAbreviatura",
                                    name: 'ubicaciondpt',
                                    allowBlank: true,
                                    listeners: {
                                        focus: function () {
                                            _this.createWinDPA('iddpt', 'ubicaciondpt');
                                        }
                                    }
                                }, {
                                    xtype: 'textarea',
                                    fieldLabel: _this.etiquetas.lbdireccion,
                                    id: 'taDir',
                                    prevTab: 'taFunciones',
                                    nextTab: "btnCancelar",
                                    name: 'direccion',
                                    anchor: '100%',
                                    height: 50,
                                    maxLength: 255,
                                    //vtype     : 'vtalfanumerico'
                                }]
                        }]
                    }]
                }]
        });
        Ext.apply(this, {
            width: 650,
            height: 540,
            autoValidate: false,
            constrain: true,
            layout: 'fit',
            modal: true,
            resizable: false,
            items: [_this.formulario],
            keys: [{
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
            buttons: [{
                text: _this.etiquetas.lbBtnCancelar,
                iconCls: 'cancelar',
                id: 'btnCancelar',
                prevTab: 'taDir',
                nextTab: "btnAplicar",
                minWidth: 75,
                tooltip: _this.etiquetas.lbtooltipcancelar,
                handler: function () {
                    _this.destroy();
                }
            }, _this.btnAplicar, _this.btnAceptar]
        })
        if (_this.modificar) {
            _this.url = _this.urlReal + 'modificarValores';
            _this.message = _this.etiquetas.lbMsgGuardando;
            _this.title = 'Modificar ' + _this.tipoElemento;
            _this.btnAplicar.hidden = true;
        } else {
            _this.title = 'Adicionar ' + _this.tipoElemento;
            _this.url = _this.urlReal + 'insertaValores';
            _this.message = _this.etiquetas.lbMsgGuardando;
        }
        Estructura.EntidadOrganizacion.superclass.initComponent.apply(this);
        _this.addEvents('afterInsert');
    }, enviar: function (destroy) {
        var _this = this;
        if (_this.formulario.getForm().isValid()) {
            if (_this.formulario.getForm().isDirty()) {
                var execute = function () {
                    Secodena.mostrarMascara('maskGuardar', '', _this.message);
                    _this.formulario.getForm().submit({
                        url: _this.url, params: {
                            idnodo: _this.nodo.id, idconcepto: _this.idconcepto, proyecto: _this.proyecto
                        }, failure: function (form, action) {
                            var codMsg = action.result.codMsg;
                            Secodena.ocultarMascara('maskGuardar');
                            if (codMsg != 6) {
                                mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                _this.formulario.getForm().reset();
                                if (_this.storeProyecto) {
                                    _this.storeProyecto.load({params: {start: 0, limit: 18}});
                                }
                                if (destroy) {
                                    _this.destroy();
                                }
                            }
                            if (codMsg != 6 && codMsg != 3) {
                                mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                var node;
                                if (!_this.modificar) {
                                    node = _this.nodo;
                                    node.leaf = false;
                                    if (node.isExpanded() || node.attributes.leaf == true) {
                                        _this.loaderTreeEstructura.load(node);
                                    }
                                    node.expand();
                                    _this.fireEvent('afterInsert', _this);
                                } else {
                                    node = _this.nodo.parentNode;
                                    _this.loaderTreeEstructura.load(node);
                                    node.expand();
                                }
                            }
                        }
                    })
                };
                if (_this.modificar) {
                    /*var tipoescala = Ext.getCmp('hiddenIdTipoEscala' + _this.name).getValue();
                     var tipoescala_anterior = Ext.getCmp('hiddenIdTipoEscalaAnterior' + _this.name).getValue();
                     if (tipoescala != tipoescala_anterior) {
                     mostrarMensaje(1, 'Usted está a punto de modificar el tipo de escala. Esto traerá consigo que deberá actualizar manualmente las clasificaciones y salarios de todos los cargos asociados a la ' + _this.tipoElemento + '.', function () {
                     mostrarMensaje(2, 'Está seguro que desea actualizar la ' + _this.tipoElemento + '?', function (btn) {
                     if (btn == 'ok') {
                     execute();
                     }
                     });
                     });
                     } else {
                     execute();
                     }*/
                    execute();
                } else {
                    execute();
                }
            } else {
                mostrarMensaje(6, _this.etiquetas.lbMsgNoModifico);
            }
        }
    }, loadDatos: function () {
        var _this = this;
        _this.formulario.getForm().load({
            url: _this.urlReal + 'cargarDatos', waitMsg: _this.etiquetas.lbload, params: {
                identificador: _this.nodo.id,
                idconcepto: _this.idconcepto,
                proyecto: _this.nodo.attributes.idproyecto
            }, success: function () {
                var formulario = _this.formulario.getForm();
                formulario.setValues(formulario.getValues());
            }
        })
    }, createWinDPA: function (id, text) {
        var dpaWin = new Ext.secodena.comun.window.winSelectDPA({
            nodo: new DPA(), rootNodo: {
                id: 0, text: 'Cuba'
            }, sinTitulo: true, nivel: 2, selPais: false, id: 'dptWin'
        });
        dpaWin.show();
        dpaWin.on('dameseleccion', function (win, obj) {
            if (obj) {
                Ext.getCmp(id).setValue(obj.get('iddpt'));
                Ext.getCmp(text).setValue(obj.get('denominacion'));
                win.destroy();
            }
        }.createDelegate(this));
    }
})
