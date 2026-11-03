Ext.ns('Contabilidad.Estructurae');
Contabilidad.Estructurae.Toolbar = Ext.extend(Ext.Toolbar, {
    constructor: function (params) {
        this.idioma = params.idioma;
        this.perfil = params.perfil;
        this.keymapButtons = params.keymapButtons;
        this.createButtons();
        this.initFunctions();
        return Contabilidad.Estructurae.Toolbar.superclass.constructor.call(this, params);
    },
    createButtons: function () {
        this.btnCargarconf = new Ext.Button({
            id: 'btnCargarconf',
            hidden: true,
            text: this.idioma.lbBtnCargarconfiguracion,
            tooltip: this.idioma.lbTooltipBtnCargarconfiguracion,
            iconCls: 'importar'
        });
        this.btnAyuda = new Ext.Button({
            id: 'btnHelpEstructuraEcon',
            text: this.idioma.lbBtnAyuda,
            tooltip: this.idioma.lbTooltipBtnAyuda,
            iconCls: 'ayuda'
        });
        this.items = [this.btnCargarconf, '->', this.btnAyuda];
    },
    initFunctions: function () {
        var me = this;
        this.btnCargarconf.on('click', function () {
            Ext.MessageBox.wait(me.idioma.lbWaitMsgEstructurac, me.idioma.lbEspere);
            Ext.Ajax.request({
                url: 'loadConfigEstructuraComun',
                callback: function (options, success, response) {
                    Ext.MessageBox.hide();
                    responseData = Ext.decode(response.responseText);
                    var msg = (responseData.success === true) ? me.idioma.lbMsgConfigurado : me.idioma.lbMsgErrorGuardar;
                    var codM = (responseData.success === true) ? 1 : 3;
                    mostrarMensaje(codM, msg);
                    if (responseData.success === true) {
                        Ext.getCmp('btnActualizar').fireEvent('click');
                        me.btnCargarconf.setVisible(false);
                    }
                }
            });
        });
    }
});

Contabilidad.Estructurae.EditForm = Ext.extend(Ext.Panel, {
    constructor: function (params) {
        this.frame = true;
        this.disabled = true;
        this.layout = 'form';
        this.labelAlign = 'top';
        this.buttonAlign = 'right';
        this.width = 700; //Ext.lib.Dom.getViewWidth() / 2;
        this.region = 'east';
        this.idioma = params.idioma;
        this.perfil = params.perfil;
        this.idEstComun = 0;
        this.idEstEcon = 0;
        this.idPadreEstEcon = 0;
        this.nodeSelect = 0;
        this.TaskFormValidation = TaskFormValidation;
        this.createForm(params);
        this.initButtons();
        this.initFunctions();
        this.addEvents('beforeSave', 'beforeDelete');
        return Contabilidad.Estructurae.EditForm.superclass.constructor.call(this, params);
    },
    createForm: function () {
        var me = this;
        meScope = this;
        this.listSeleccionAtendidos = [];
        this.dropListHide = false;

        this.cbEstructuracomun = new Ext.CONT.UIXCombo({
            fieldLabel: this.idioma.lbEstructura,
            emptyText: this.idioma.lbSeleccione,
            invalidText: this.idioma.lbInvalidText,
            regexText: this.idioma.lbInvalidText,
            allowBlank: false,
            anchor: '100%',
            hiddenTbar: true,
            filter: 'text',
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\*\.\#\+\,\:\;\:\;\&]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+\,\:\;\&]*)+$/,
            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\*\.\#\+\,\:\;\:\;\&]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+\,\:\;\&]*)+$/,
            tabIndex: 1
        }, {
            identificador: 'Entidad',
            displayText: 'Entidad',
            url: 'loadEstructuraComun',
            autoLoad: true,
            singleSelect: false,
            hiddenTbar: true,
            reader: new Ext.data.JsonReader({
                id: 'id',
                root: 'datos'
            }, [{
                name: '_parent'
            }, {
                name: '_is_leaf',
                mapping: 'leaf'
            }, {
                name: 'text'
            }, {
                name: 'id'
            }, {
                name: 'icon'
            }])
        });


        this.contextMenu = new Ext.menu.Menu({
            id: 'contextMenuNomCta',
            items: [
                {
                    id: 'menuAtender',
                    iconCls: 'bandera',
                    text: 'Atender',
                    handler: function () {
                        me.cbEstructuracomunAtendido.content.items.items[0].selModel.getSelections().forEach(function (T, number, array) {
                            if (T.json.disponible) {
                                me.listSeleccionAtendidos.push([T.id, T.data.text]);
                            } else {
                                mostrarMensaje(1, "Una de las entidades seleccionadas ya está asignada.");
                            }
                        })
                        me.cbEstructuracomunAtendido.content.items.items[0].getView().refresh();
                        Ext.getCmp('cbxEntidadAtendida').setValue('');

                        me.listSeleccionAtendidos.forEach(function (T, number, array) {
                            var textCB = Ext.getCmp('cbxEntidadAtendida').getValue();
                            if (textCB != '') Ext.getCmp('cbxEntidadAtendida').setValue(textCB + ', ' + T[1]);
                            else Ext.getCmp('cbxEntidadAtendida').setValue(T[1]);
                        })
                        me.dropListHide = false;
                    }
                }, {
                    id: 'menuNoAtender',
                    iconCls: 'bandera',
                    text: 'No Atender',
                    handler: function () {
                        me.cbEstructuracomunAtendido.content.items.items[0].selModel.getSelections().forEach(function (T, number, array) {
                            var listAux = [];
                            me.listSeleccionAtendidos.forEach(function (X, number, array) {
                                if (T.id != X[0]) listAux.push(X);
                            })
                            me.listSeleccionAtendidos = listAux;
                        })
                        me.cbEstructuracomunAtendido.content.items.items[0].getView().refresh();
                        Ext.getCmp('cbxEntidadAtendida').setValue('');

                        me.listSeleccionAtendidos.forEach(function (T, number, array) {
                            var textCB = Ext.getCmp('cbxEntidadAtendida').getValue();
                            if (textCB != '') Ext.getCmp('cbxEntidadAtendida').setValue(textCB + ', ' + T[1]);
                            else Ext.getCmp('cbxEntidadAtendida').setValue(T[1]);
                        })
                        me.dropListHide = false;
                    }
                }
            ]
        });
        this.contextMenu.on({
            'show': function (sd) {
                me.dropListHide = true;
            }
        })

        this.cbEstructuracomunAtendido = new Ext.CONT.UIXCombo({
            fieldLabel: 'Entidades que atiende',
            emptyText: this.idioma.lbSeleccione,
            invalidText: this.idioma.lbInvalidText,
            regexText: this.idioma.lbInvalidText,
            anchor: '100%',
            hiddenTbar: true,
            filter: 'text',
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\*\.\#\+\,\:\;\:\;\&]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+\,\:\;\&]*)+$/,
            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\*\.\#\+\,\:\;\:\;\&]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+\,\:\;\&]*)+$/,
            tabIndex: 1
        }, {
            identificador: 'EntidadAtendida',
            displayText: 'EntidadAtentida',
            url: 'loadEstructuraComun',
            autoLoad: true,
            singleSelect: false,
            hiddenTbar: true,
            reader: new Ext.data.JsonReader({
                id: 'id',
                root: 'datos'
            }, [{
                name: '_parent'
            }, {
                name: '_is_leaf',
                mapping: 'leaf'
            }, {
                name: 'text'
            }, {
                name: 'id'
            }, {
                name: 'icon'
            }])
        });
        this.cbEstructuracomunAtendido.content.items.items[0].on({
            'rowcontextmenu': function (gridPanel, rowIndex, e) {
                me.contextMenu.showAt(e.getXY());
                e.stopEvent();
            },
        });
        this.cbEstructuracomunAtendido.on({
            'expand': function (combo) {
                me.cbEstructuracomunAtendido.content.items.items[0].getView().refresh();
                Ext.getCmp('cbxEntidadAtendida').setValue('');

                me.listSeleccionAtendidos.forEach(function (T, number, array) {
                    var textCB = Ext.getCmp('cbxEntidadAtendida').getValue();
                    if (textCB != '') Ext.getCmp('cbxEntidadAtendida').setValue(textCB + ', ' + T[1]);
                    else Ext.getCmp('cbxEntidadAtendida').setValue(T[1]);
                })

            },
            'collapse': function (combo) {
                if (me.dropListHide == true) {
                    me.dropListHide = false;
                    return this.expand();
                }
            }
        });
        var treegrid = this.cbEstructuracomunAtendido.content.items.items[0];
        treegrid.getView().getRowClass = function (record, index, rowParams, store) {
            var existe = false;
            me.listSeleccionAtendidos.forEach(function (T, number, array) {
                if (T[0] == record.id) existe = true;
            })
            if (existe) {
                rowParams.tstyle += "background-color: #dffbda;";
            } else if (!record.json.disponible)
                rowParams.tstyle += "background-color: #E94208;";
            else {
                var style = rowParams.tstyle.split(';');
                if (style[0]) {
                    rowParams.tstyle = style[0] + ';';
                }
            }
        };

        Ext.getCmp('gpEntidad').getSelectionModel().on({
            rowselect: function (xSelModel, xIndex, xRecords) {
                if (xSelModel.hasSelection()) {
                    me.taDenominacion.enable();
                    me.tfCodigo.enable();
                    me.taDenominacion.setValue(xSelModel.getSelected().data.text);
                    me.tfCodigo.setValue(xSelModel.getSelected().json.codigo);
                    Ext.getCmp('cbxEntidad').setValue(xSelModel.getSelected().data.text);
                    Ext.getCmp('cbxEntidad').fSelect.values.push(xSelModel.getSelected().data.id);
                    Ext.getCmp('cbxEntidad').fSelect.display.push(xSelModel.getSelected().data.text);
                    me.idEstComun = xSelModel.getSelected().data.id;
                    me.stFormato.baseParams.idEstructura = me.idEstComun;
                    me.stFormato.load();
                }
            },
            rowdeselect: function (xSelModel, xIndex, xRecords) {
                me.taDenominacion.disable();
                Ext.getCmp('cbxEntidad').reset();
                me.tfCodigo.reset();
                me.taDenominacion.reset();
                Ext.getCmp('cbxEntidad').fSelect.values = new Array();
                Ext.getCmp('cbxEntidad').fSelect.display = new Array();
                me.idEstComun = 0;
            }
        });
        Ext.getCmp('gpEntidadAtendida').getSelectionModel().on({
            rowselect: function (xSelModel, xIndex, xRecords) {
                Ext.getCmp('cbxEntidadAtendida').setValue('');

                me.listSeleccionAtendidos.forEach(function (T, number, array) {
                    var textCB = Ext.getCmp('cbxEntidadAtendida').getValue();
                    if (textCB != '') Ext.getCmp('cbxEntidadAtendida').setValue(textCB + ', ' + T[1]);
                    else Ext.getCmp('cbxEntidadAtendida').setValue(T[1]);
                })

            },
            rowdeselect: function (xSelModel, xIndex, xRecords) {
                Ext.getCmp('cbxEntidadAtendida').reset();
                Ext.getCmp('cbxEntidadAtendida').setValue('');

                me.listSeleccionAtendidos.forEach(function (T, number, array) {
                    var textCB = Ext.getCmp('cbxEntidadAtendida').getValue();
                    if (textCB != '') Ext.getCmp('cbxEntidadAtendida').setValue(textCB + ', ' + T[1]);
                    else Ext.getCmp('cbxEntidadAtendida').setValue(T[1]);
                })
            }
        });
        this.taDenominacion = new Ext.form.TextField({
            fieldLabel: this.idioma.lbDenominacion,
            anchor: '100%',
            disabled: true,
            maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\*\.\#\+\,\:\;\:\;\&]+$/,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\*\.\#\+\,\:\;\:\;\&]+(\s{1})?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\*\.\#\+\,\:\;\:\;\&]*)+$/,
            maxLength: 255,
            maxLengthText: this.idioma.textMaxLength,
            regexText: this.idioma.lbInvalidText,
            allowBlank: false,
            tabIndex: 2,
            // height: 40
            enableKeyEvents: true
        });
        this.tfCodigo = new Ext.form.TextField({
//              fieldLabel: this.idioma.lbCodigo,
            fieldLabel: 'C&oacute;digo',
            id: 'tfCodigo',
            anchor: '100%',
            disabled: true,
            maskRe: /^[0-9]+$/,
            // maskRe: /^[0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\*\.\#\+\,\:\;\:\;\&]+$/,
            // regex: /^([0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\*\.\#\+\,\:\;\:\;\&]+(\s{1})?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\*\.\#\+\,\:\;\:\;\&]*)+$/,
            maxLength: 10,
            maxLengthText: 'El tamaño m&aacute;ximo requerido es 10 caracteres.',
            tabIndex: 2,
            enableKeyEvents: true,
            allowBlank: false,
            regexText: this.idioma.lbInvalidText
        });

        /*this.stModelogestion = new Ext.data.Store({
         url: '/contabilidad/comun/xml/modelosecon.xml',
         reader: new Ext.data.XmlReader({
             record: 'row',
             id: 'idmodeloe',
             totalRecords: '@cant'
         }, [{name: 'denominacion', mapping: 'modeloe'}, {name: 'idmodeloe'}])
     });*/

        this.stModelogestion = new Ext.data.SimpleStore({
            fields: ['idmodeloe', 'denominacion'],
            data: [[0, 'PRESUPUESTADA'], [1, 'EMPRESARIAL']]
        });

        this.cbModelogestion = new Ext.form.ComboBox({
            fieldLabel: this.idioma.lbModelogestion,
            emptyText: this.idioma.lbSeleccione,
            loadingText: this.idioma.lbCargando,
            store: this.stModelogestion,
            valueField: 'idmodeloe',
            displayField: 'denominacion',
            anchor: '100%',
            resizable: true,
            editable: true,
            value: 1,
            //typeAhead: true,
            selectOnFocus: true,
            forceSelection: true,
            tabIndex: 3,
            triggerAction: 'all',
            mode: 'local',
            allowBlank: false,
            enableKeyEvents: true
        });
        this.stCriterioe = new Ext.data.Store({
            url: 'loadCriterioEconomico',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{
                name: 'idcriterioe'
            }, {
                name: 'descripcion'
            }
            ])
        });
        this.cbCriterioe = new Ext.form.ComboBox({
            fieldLabel: this.idioma.lbCriterioeconomico,
            emptyText: this.idioma.lbSeleccione,
            loadingText: this.idioma.lbCargando,
            store: this.stCriterioe,
            valueField: 'idcriterioe',
            displayField: 'descripcion',
            anchor: '100%',
            resizable: true,
            listWidth: 250,
            triggerAction: 'all',
            mode: 'local',
            allowBlank: false,
            editable: true,
            typeAhead: true,
            selectOnFocus: true,
            forceSelection: true,
            tabIndex: 4,
            enableKeyEvents: true
        });
        this.dataNumComprobante = [/*[0, this.idioma.lbPeriodo], */[1, this.idioma.lbEjercicio]];
        this.stNumComprobante = new Ext.data.SimpleStore({
            fields: [{name: 'id', type: 'int'}, {name: 'denominacion'}],
            data: me.dataNumComprobante
        });
        this.cbNumComprobante = new Ext.form.ComboBox({
            fieldLabel: this.idioma.lbNumComprobante,
            emptyText: this.idioma.lbSeleccione,
            store: this.stNumComprobante,
            valueField: 'id',
            displayField: 'denominacion',
            value: 1,
            anchor: '100%',
            resizable: true,
            triggerAction: 'all',
            mode: 'local',
            allowBlank: false,
            editable: true,
            typeAhead: true,
            selectOnFocus: true,
            forceSelection: true,
            tabIndex: 5,
            enableKeyEvents: true
        });
        this.stClasificador = new Ext.data.Store({
            url: 'loadClasificadores',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{
                name: 'id'
            }, {
                name: 'denominacion'
            }
            ])
//              url: '/contabilidad/comun/xml/clasificadorcont.xml',
//              reader: new Ext.data.XmlReader({
//                  record: 'row',
//                  id: 'idclasificadorcont',
//                  totalRecords: '@cant'
//              }, [{name: 'denominacion', mapping: 'clasificadorcont'}, 'idclasificadorcont'])
        });
        this.cbClasificador = new Ext.form.ComboBox({
            fieldLabel: this.idioma.lbClasificador,
            emptyText: this.idioma.lbSeleccione,
            loadingText: this.idioma.lbCargando,
            store: this.stClasificador,
            valueField: 'id',
            displayField: 'denominacion',
            anchor: '100%',
            resizable: true,
            triggerAction: 'all',
            mode: 'remote',
            allowBlank: true,
            editable: true,
            typeAhead: true,
            selectOnFocus: true,
            forceSelection: true,
            tabIndex: 6,
            enableKeyEvents: true
        });

        this.stUsuarioSist = new Ext.data.Store({
            url: 'loadUsuarioSistema',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{
                name: 'idusuario'
            }, {
                name: 'nombreusuario'
            }
            ]),
            listeners: {
                load: function (store, records) {
                    if (records.length == 0) {
                        mostrarMensaje(1, me.idioma.lbNoDataUser);
                    }
                }
            }
        });
        this.cbUsuarioSist = new Ext.form.ComboBox({
            fieldLabel: "Usuarios", //this.idioma.lbClasificador,
            emptyText: this.idioma.lbSeleccione,
            loadingText: this.idioma.lbCargando,
            store: this.stUsuarioSist,
            valueField: 'idusuario',
            displayField: 'nombreusuario',
//              width: 400,
            anchor: '100%',
            resizable: true,
            triggerAction: 'all',
            mode: 'remote',
            allowBlank: true,
            editable: true,
            typeAhead: true,
            selectOnFocus: true,
            forceSelection: true,
            tabIndex: 7,
            pageSize: 10,
            minChars: 3,
            enableKeyEvents: true,
            scope: this,
            onTriggerClick: function () {
                this.store.load();
                this.focus();
            }
        });

        this.stPersona = new Ext.data.Store({
            url: 'cargarpersonas',
            sortInfo: {
                field: 'nombre',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total'
            }, [{
                name: 'idpersona'
            }, {
                name: 'nombre'
            }, {
                name: 'numid'
            }, {
                name: 'cargo'
            }
            ])
        });

        this.cbPersonaCofecionado = new Ext.form.ComboBox({
            fieldLabel: 'Confeccionado por',
            store: this.stPersona,
            valueField: 'idpersona',
            // hiddenName: 'idpersona',
            displayField: 'nombre',
            // emptyText: 'Seleccione...',
            disabledClass: 'disabled-component',
            // disabled: true,
            forceSelection: true,
            allowBlank: true,
            resizable: true,
            // readOnly: true,
            triggerAction: 'all',
            anchor: '100%',
            minChars: 0, //Para la nueva busqueda poner contraria esta linea
            pageSize: 10, //Para la nueva busqueda poner contraria esta linea
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{numid} {nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            selectOnFocus: true,
            enableKeyEvents: true,
            listeners: {
                scope: this,
                keydown: function (t, e) {
                    if ((e.getKey() == 8) || (e.getKey() == 46)) {
                        t.clearValue();
                    }
                }
            }
        });

        this.cbPersonaAprobado = new Ext.form.ComboBox({
            fieldLabel: 'Aprobado por',
            store: this.stPersona,
            valueField: 'idpersona',
            // hiddenName: 'idpersona',
            displayField: 'nombre',
            disabledClass: 'disabled-component',
            // disabled: true,
            forceSelection: true,
            allowBlank: true,
            resizable: true,
            //readOnly: true,
            triggerAction: 'all',
            anchor: '100%',
            minChars: 0, //Para la nueva busqueda poner contraria esta linea
            pageSize: 10, //Para la nueva busqueda poner contraria esta linea
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{numid} {nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            selectOnFocus: true,
            enableKeyEvents: true,
            listeners: {
                scope: this,
                keydown: function (t, e) {
                    if ((e.getKey() == 8) || (e.getKey() == 46)) {
                        t.clearValue();
                    }
                }
            }
        });

        this.stFormato = new Ext.data.Store({
            url: 'loadFormatos',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{
                name: 'idformato'
            }, {
                name: 'nombre'
            }, {
                name: 'vistap'
            }
            ])
        });
        this.cbFormato = new Ext.form.ComboBox({
            fieldLabel: this.idioma.lbFormato,
            emptyText: this.idioma.lbSeleccione,
            loadingText: this.idioma.lbCargando,
            store: this.stFormato,
            valueField: 'idformato',
            displayField: 'nombre',
            anchor: '100%',
            resizable: true,
            triggerAction: 'all',
            mode: 'remote',
            allowBlank: true,
            disabled: true,
            editable: true,
            typeAhead: true,
            selectOnFocus: true,
            forceSelection: true,
            tabIndex: 7,
            enableKeyEvents: true
        });
        this.btnAplicarconf = new Ext.Button({
            disabled: true,
            tooltip: this.idioma.lbTooltipBtnAddconf,
            iconCls: 'adicionar',
            tabIndex: 8
        });
        this.btnAsociarUsuario = new Ext.Button({
            disabled: true,
            tooltip: "Asociar usuario",
            iconCls: 'adicionar',
            tabIndex: 9
        });

        this.rowaction = new Ext.grid.RowActions({
            id: 'cmprowaction',
            actions: [{
                id: 'delete',
                tooltip: this.idioma.lbTooltipBtnEliminarconf,
                icon: perfil.dirImg + 'eliminar.png',
                iconCls: 'eliminar',
                marginLeft: 5,
                width: 16,
                height: 16
            }
            ]
        });
        this.rowaction.on('action', function (grid, record, action, rowIndex, col, e) {
            if (record.data.enuso == 1) {
                mostrarMensaje(1, "No se puede eliminar el formato debido a que esta en uso");
            } else {
                if (action == 'delete') {
                    grid.getStore().remove(record);
                    Ext.getCmp('btnGuardar').enable();
                }
            }
        });
        this.stGridFormatos = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cant'
            }, [{
                name: 'idclasificador'
            }, {
                name: 'clasificador'
            }, {
                name: 'idformato'
            }, {
                name: 'formato'
            }, {
                name: 'enuso'
            }, {
                name: 'vistap'
            }
            ])
        });
        this.gpFormatos = new Ext.grid.GridPanel({
            maskDisabled: true,
            border: false,
            // region: 'center',
            // layout: 'fit',
            store: this.stGridFormatos,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true,
                listeners: {
                    'rowdeselect': function (smodel, rowIndex) {
                        me.gpFormatos.getView().removeRowClass(rowIndex, "negrita");
                    },
                    'rowselect': function (smodel, rowIndex) {
                        me.gpFormatos.getView().addRowClass(rowIndex, "negrita");
                    }
                }
            }),
            viewConfig: {
                forceFit: true
            },
            // height: 150,
            // width: (Ext.lib.Dom.getViewWidth() / 2) - 35,
            autoExpandColumn: 'clasificador',
            autoScroll: false,
            plugins: [me.rowaction],
            columns: [
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idclasificador'
                },
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'enuso'
                },
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idformato'
                },
                {
                    header: this.idioma.lbClasificador,
                    tooltip: this.idioma.lbTtClasificador,
                    width: 130,
                    id: 'clasificador',
                    sortable: true,
                    dataIndex: 'clasificador'
                },
                {
                    header: this.idioma.lbFormato,
                    tooltip: this.idioma.lbTtFormato,
                    width: 150,
                    sortable: true,
                    dataIndex: 'formato'
                },
                {
                    header: this.idioma.lbVistaprevia,
                    tooltip: this.idioma.lbTtVistaprevia,
                    width: 150,
                    sortable: true,
                    dataIndex: 'vistap'
                }, me.rowaction
            ]
        });
//          me.gpFormatos.getView().getRowClass = function(record, index, rowParams, store) {
//            if (record.get('enuso') == 1)
//                return 'FilaVerde';
//         };
        //Usuarios asociados a la estructura económica
        this.rowactionEcon = new Ext.grid.RowActions({
            id: 'cmprowactionEcon',
            actions: [{
                id: 'delete',
                tooltip: this.idioma.lbTooltipBtnEliminarUser,
                icon: perfil.dirImg + 'eliminar.png',
                iconCls: 'eliminar',
                marginLeft: 5,
                width: 16,
                height: 16
            }
            ]
        });
        this.rowactionEcon.on('action', function (grid, record, action, rowIndex, col, e) {
            if (action == 'delete') {
                grid.getStore().remove(record);
                Ext.getCmp('btnGuardar').enable();
            }
        });
        this.stUsuariosEconomica = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cant'
            }, [{
                name: 'idusuario'
            }, {
                name: 'nombreusuario'
            }
            ])
        });
        this.gpUsuariosEconomica = new Ext.grid.GridPanel({
            maskDisabled: true,
            border: false,
            region: 'center',
            store: this.stUsuariosEconomica,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true,
                listeners: {
                    'rowdeselect': function (smodel, rowIndex) {
//                          me.gpFormatos.getView().removeRowClass(rowIndex, "negrita");
                    },
                    'rowselect': function (smodel, rowIndex) {
//                          me.gpFormatos.getView().addRowClass(rowIndex, "negrita");
                    }
                }
            }),
            viewConfig: {
                forceFit: true
            },
            height: (Ext.lib.Dom.getViewHeight() / 2) - 90,
            //width: (Ext.lib.Dom.getViewWidth() / 2) - 35,
            autoExpandColumn: 'nombreusuario',
            autoScroll: false,
            plugins: [me.rowactionEcon],
            columns: [
                {
                    hidden: true,
                    hideable: false,
                    dataIndex: 'idusuario'
                },
                {
//                    header: this.idioma.lbClasificador,
//                    tooltip: this.idioma.lbTtClasificador,
                    header: 'Usuarios',
                    tooltip: 'Usuarios',
                    width: 130,
                    id: 'nombreusuario',
                    sortable: true,
                    dataIndex: 'nombreusuario'
                }, me.rowactionEcon
            ]
        });

        this.formPwindow = new Ext.FormPanel({
            fileUpload: true,
            frame: true,
            border: false,
            buttonAlign: 'right',
            labelWidth: 30,
            items: [{
                xtype: 'fileuploadfield',
                width: '98%',
                id: 'photo',
                emptyText: 'Solo im\xE1genes .jpg, .png, .jpeg',
                fieldLabel: 'Foto',
                regex: /^.+\.(jpg|png|jpeg)$/i,
                regexText: 'Solo admite im&aacute;genes con formato .jpg, .png, .jpeg.',
                name: 'photoname',
                buttonCfg: {
                    iconCls: 'buscar',
                    text: '',
                    tooltip: 'Explorar y buscar logo para la entidad'
                }
            }],
            buttons: [{
                text: this.idioma.lbBtnCancelar,
                tooltip: this.idioma.lbTooltipBtnCancelar,
                iconCls: 'cancelar',
                handler: function () {
                    meScope.photoWindow.hide();
                    me.formPwindow.getForm().reset();
                }
            }, {
                id: 'btnAceptarFoto',
                disabled: true,
                text: this.idioma.lbBtnAceptar,
                tooltip: this.idioma.lbTooltipBtnAceptar,
                iconCls: 'aceptar',
                handler: function () {
                    if (Ext.getCmp('photo').getRawValue() == '') {
                        mostrarMensaje(1, me.idioma.lbMsgImagen);
                    } else {
                        if (window.File && window.FileReader && window.FileList && window.Blob) {
                            if (Ext.getCmp('photo').fileInput.dom.files.length) {
                                var file = Ext.getCmp('photo').fileInput.dom.files[0];
                                var reader = new FileReader();
                                reader.onload = function (evt) {
                                    var fileData = evt.target.result;
                                    var bytes = new Uint8Array(fileData);
                                    var base64Img = Base64.encodeByteArray(bytes);
                                    me.setImagen(base64Img);
                                    me.photoWindow.hide();
                                };
                                reader.readAsArrayBuffer(file);
                            } else {
                                mostrarMensaje(1, me.idioma.lbMsgImagen);
                            }
                        } else {
                            if (formPwindow.getForm().isValid()) {
                                formPwindow.getForm().submit({
                                    url: 'getPicture',
                                    waitMsg: me.idioma.lbCargando,
                                    success: function (form, action) {
                                        me.setImagen(action.result.base64img);
                                        me.photoWindow.hide();
                                    }
                                });
                            } else {
                                mostrarMensaje(1, me.idioma.lbMsgImagen);
                            }
                        }
                        Ext.getCmp('photo').reset();
                    }
                }
            }]
        });
        this.photoWindow = new Ext.Window({
            plain: true,
            title: 'Seleccionar foto',
            autoHeight: true,
            border: false,
            closeAction: 'hide',
            modal: true,
            constrain: true,
            layout: 'form',
            width: 500,
            bodyStyle: 'padding: 5px',
            resizable: false,
            closable: false,
            items: me.formPwindow
        });
        this.items = [{
            layout: 'column',
            anchor: '100%',
            items: [{
                columnWidth: .3,
                layout: 'form',
                items: [new Ext.form.FieldSet({
                    id: 'fsFotoDetalle',
                    title: this.idioma.lbLogo,
                    height: 145,
                    items: [new Ext.Panel({
                        id: 'pFotoDetalle',
                        autoHeight: true,
                        autoWidth: true,
                        border: true,
                        autoShow: true,
                        html: '<div><center><img ext:qtip = "Logo de la entidad" id="photo-container" src="/contabilidad/contabilidad_financiera/configuracion/views/images/no-foto.png" ALT="" style="cursor:pointer;border:1px solid 000; margin: 0 !important;" height="100%" width="100%";" onclick="meScope.photoWindow.show()"/></center></div>'
                    })]
                })]
            }, {
                style: 'margin:0 0 0 10',
                columnWidth: .7,
                layout: 'form',
                labelAlign: 'top',
                items: [{
                    layout: 'column',
                    labelAlign: 'top',
                    items: [{
                        columnWidth: .7,
                        layout: 'form',
                        labelAlign: 'top',
                        items: [this.cbEstructuracomun]
                    }, {
                        style: 'margin:0 0 0 10',
                        columnWidth: .3,
                        layout: 'form',
                        labelAlign: 'top',
                        items: [this.cbCriterioe]
                    }]
                }, {
                    layout: 'column',
                    labelAlign: 'top',
                    items: [{
                        columnWidth: .7,
                        layout: 'form',
                        labelAlign: 'top',
                        items: [this.taDenominacion]
                    }, {
                        style: 'margin:0 0 0 10',
                        columnWidth: .3,
                        layout: 'form',
                        labelAlign: 'top',
                        items: [this.tfCodigo]
                    }]
                }, {
                    layout: 'column',
                    labelAlign: 'top',
                    items: [{
                        columnWidth: .5,
                        layout: 'form',
                        labelAlign: 'top',
                        items: [this.cbModelogestion]
                    }, {
                        style: 'margin:0 0 0 10',
                        columnWidth: .5,
                        layout: 'form',
                        labelAlign: 'top',
                        items: [this.cbNumComprobante]
                    }]
                },
                    //     {
                    //     layout: 'column',
                    //     labelAlign: 'top',
                    //     items: [{
                    //         columnWidth: 1,
                    //         layout: 'form',
                    //         labelAlign: 'top',
                    //         items: [this.cbEstructuracomunAtendido]
                    //     }]
                    // }
                ]
            }]
        }, new Ext.form.FieldSet({
            title: this.idioma.lbGestionformatos,
            // autoHeight: true,
            height: Ext.lib.Dom.getViewHeight() * 0.4,
            // height: (Ext.lib.Dom.getViewHeight() - 270) / 2,
            items: [{
                layout: 'column',
                anchor: '100%',
                items: [{
                    columnWidth: .45,
                    layout: 'form',
                    labelAlign: 'top',
                    items: this.cbClasificador
                }, {
                    columnWidth: .45,
                    style: 'margin:0 0 0 10',
                    layout: 'form',
                    labelAlign: 'top',
                    items: this.cbFormato
                }, {
                    columnWidth: .1,
                    style: 'margin: 20 0 0 10',
                    layout: 'form',
                    items: this.btnAplicarconf
                }]
            }, {
                layout: 'fit',
                anchor: '100%',
                items: this.gpFormatos
            }]
        }), /*new Ext.form.FieldSet({
                title: "Usuarios asociados a la estructura econ&oacute;mica",
    //            autoHeight: true,
    //             height: 200,
                hidden:true,
                height: (Ext.lib.Dom.getViewHeight() - 270) / 2,
                width: 685,
                items: [{
                    layout: 'column',
                    anchor: '100%',
                    items: [{
                        columnWidth: .5,
                        layout: 'form',
                        labelAlign: 'top',
                        items: this.cbUsuarioSist
                    }, {
    //                    columnWidth: .1,
                        style: 'margin: 20 0 0 10',
                        layout: 'form',
                        items: this.btnAsociarUsuario
                    }]
                }, this.gpUsuariosEconomica]
            })*/
            new Ext.form.FieldSet({
                title: "Pie de firma",
                autoHeight: true,
                //  height: Ext.lib.Dom.getViewHeight() * 0.2,
                hidden: false,
                // height: (Ext.lib.Dom.getViewHeight() - 270) / 2,
                // width: 685,
                items: [{
                    layout: 'column',
                    anchor: '100%',
                    items: [{
                        columnWidth: .5,
                        layout: 'form',
                        labelAlign: 'top',
                        items: this.cbPersonaCofecionado
                    }, {
                        columnWidth: .5,
                        style: 'margin: 0 0 0 10',
                        labelAlign: 'top',
                        layout: 'form',
                        items: this.cbPersonaAprobado
                    }]
                }]
            })
        ];
        this.keys = this.kmAperturas = new Ext.KeyMap(Ext.getBody(), [{
            alt: true,
            key: 'n',
            fn: function () {
                if (!Ext.getCmp('btnNuevo').disabled)
                    Ext.getCmp('btnNuevo').fireEvent('click');
            },
            scope: me
        }, {
            alt: true,
            key: 'g',
            fn: function () {
                if (!Ext.getCmp('btnGuardar').disabled)
                    Ext.getCmp('btnGuardar').fireEvent('click');
            },
            scope: me
        }, {
            key: Ext.EventObject.DELETE,
            fn: function () {
                if (!Ext.getCmp('btnEliminar').disabled)
                    Ext.getCmp('btnEliminar').fireEvent('click');
            },
            scope: me
        }, {
            key: "b",
            alt: true,
            scope: this,
            fn: function () {
                var filter = Ext.getCmp('sField');
                if (filter.getValue()) {
                    filter.onTrigger2Click();
                } else {
                    filter.focus();
                }
            }
        }, {
            key: "l",
            alt: true,
            scope: this,
            fn: function () {
                var filter = Ext.getCmp('sField');
                if (filter.getValue()) {
                    filter.onTrigger1Click();
                }
            }
        }]);
    },
    initButtons: function () {
        //Botones btnNuevo,btnGuardar,btnEliminar modificados para gestionar recursos de seguridad
        // hidden:true Se omitio para lograr mostrar bien lo botones, ---- abreviatura: ....
        this.btnNuevo = new Ext.Button({
            id: 'btnNuevo',
            tabIndex: 9,
            iconCls: 'nuevo',
            text: this.idioma.lbBtnNuevo,
            tooltip: this.idioma.lbTtBtnNuevo,
            //hidden:true,
            abreviatura: 'add_estructura'
        });
        this.btnGuardar = new Ext.Button({
            id: 'btnGuardar',
            tabIndex: 10,
            iconCls: 'guardar',
            //disabled: true,
            text: this.idioma.lbBtnGuardar,
            tooltip: this.idioma.lbTtBtnGuardar,
            //hidden:true,
            abreviatura: 'add_estructura'
        });
        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            tabIndex: 11,
            iconCls: 'eliminar',
            //disabled: true,
            text: this.idioma.lbBtnEliminar,
            tooltip: this.idioma.lbTtBtnEliminar,
            //hidden:true,
            abreviatura: 'del_estructura'
        });
        this.buttons = [this.btnNuevo, this.btnGuardar, this.btnEliminar];
        validate.addButton(this.btnNuevo);
        validate.addButton(this.btnGuardar);
        validate.addButton(this.btnEliminar);
    },
    initFunctions: function () {
        var me = this;
        me.stNumComprobante.loadData(me.dataNumComprobante);
        me.stCriterioe.load();
        //me.stModelogestion.load();

        Ext.getCmp('photo').on({
            'invalid': function () {
                Ext.getCmp('btnAceptarFoto').disable();
            },
            'valid': function () {
                Ext.getCmp('btnAceptarFoto').enable();
            }
        });
        this.btnAplicarconf.on('click', function (button, e) {
            if (me.cbClasificador.isValid() && me.cbFormato.isValid()) {
                var index = me.stFormato.find('idformato', me.cbFormato.getValue());
                var vp = (index > -1) ? me.stFormato.getAt(index).data.vistap : '';
                me.createRecordClasif(me.cbClasificador.getValue(), me.cbClasificador.getRawValue(), me.cbFormato.getValue(), me.cbFormato.getRawValue(), vp);
                me.cbClasificador.reset();
                me.cbFormato.reset();
                button.disable();
            }
        });
        this.createRecordClasif = function (idclasificador, clasificador, idformato, formato, vistap, enuso) {
            var record = Ext.data.Record.create([
                {name: 'idclasificador'},
                {name: 'clasificador'},
                {name: 'idformato'},
                {name: 'formato'},
                {name: 'enuso'},
                {name: 'vistap'}
            ]);
            var r = new record({
                idclasificador: idclasificador,
                clasificador: clasificador,
                idformato: idformato,
                formato: formato,
                enuso: enuso,
                vistap: vistap
            });
            (me.verifyData(me.cbClasificador.getValue()) === 'insert') ? me.stGridFormatos.add(r) : me.updateCfg(me.cbClasificador.getValue(), r);
        };
        this.verifyData = function (idclasificador) {
            var length = me.stGridFormatos.getCount();
            if (length > 0) {
                var elements = me.stGridFormatos.data.items;
                for (var i in elements) {
                    if (i < length) {
                        if (elements[i].data.idclasificador === idclasificador) {
                            return 'update';
                        }
                    }
                }
            }
            return 'insert';
        };
        this.updateCfg = function (idclasificador, record) {
            var index = me.stGridFormatos.find('idclasificador', idclasificador);
            if (index > -1) {
                me.stGridFormatos.remove(me.stGridFormatos.getAt(index)); //elimina el que estaba
                me.stGridFormatos.insert(index, record);
            }
        };
        this.setImagen = function (base64Img) {
            document.getElementById('photo-container').src = 'data:image/jpg;base64,' + base64Img;
            document.getElementById('photo-container').base64img = base64Img;
            me.ComprobarCampos();
        };

        this.btnAsociarUsuario.on('click', function (button, e) {
            if (me.cbUsuarioSist.isValid()) {
                var index = me.stUsuarioSist.find('idusuario', me.cbUsuarioSist.getValue());
                me.createRecordUsuarios(me.cbUsuarioSist.getValue(), me.cbUsuarioSist.getRawValue());
                me.cbUsuarioSist.reset();
                button.disable();
            }
        });
        this.createRecordUsuarios = function (idusuario, nombreusuario) {
            var record = Ext.data.Record.create([
                {name: 'idusuario'},
                {name: 'nombreusuario'}
            ]);
            var r = new record({
                idusuario: idusuario,
                nombreusuario: nombreusuario
            });
            (me.verifyDataUsuarios(me.cbUsuarioSist.getValue()) === 'insert') ? me.stUsuariosEconomica.add(r) : me.updateUsuarios(me.cbUsuarioSist.getValue(), r);
        };
        this.verifyDataUsuarios = function (idusuario) {
            var length = me.stUsuariosEconomica.getCount();
            if (length > 0) {
                var elements = me.stUsuariosEconomica.data.items;
                for (var i in elements) {
                    if (i < length) {
                        if (elements[i].data.idusuario === idusuario) {
                            return 'update';
                        }
                    }
                }
            }
            return 'insert';
        };
        this.updateUsuarios = function (idusuario, record) {
            var index = me.stUsuariosEconomica.find('idusuario', idusuario);
            if (index > -1) {
                me.stUsuariosEconomica.remove(me.stUsuariosEconomica.getAt(index)); //elimina el que estaba
                me.stUsuariosEconomica.insert(index, record);
            }
        };

        this.btnNuevo.on('click', function (button, e) {
            me.cbEstructuracomun.reset();
            me.cbEstructuracomun.focus(false, 100);
            me.taDenominacion.disable();
            me.taDenominacion.reset();
            me.tfCodigo.reset();
            me.cbModelogestion.reset();
            me.cbCriterioe.reset();
            me.cbClasificador.reset();
            me.cbNumComprobante.reset();
            me.cbPersonaAprobado.reset();
            me.cbPersonaCofecionado.reset();
            me.cbFormato.reset();
            me.gpFormatos.getStore().removeAll();
            me.stCriterioe.reload({params: {criterio: null}});
            document.getElementById('photo-container').src = "/contabilidad/contabilidad_financiera/configuracion/views/images/no-foto.png";
//              me.btnGuardar.setDisabled(true);
            me.cbFormato.setDisabled(true);
            me.btnAplicarconf.setDisabled(true);
            //this.loadDataEstEconomica(n.attributes.id, n.attributes.idcriterioe, 'nuevo');
            Ext.getCmp('cbxEntidadAtendida').setValue('');
            me.listSeleccionAtendidos = [];
        });
        this.btnGuardar.on('click', function () {
            var arrayAux = [];
            me.listSeleccionAtendidos.forEach(function (T, number, array) {
                arrayAux.push(T[0]);
            })
            if (me.cbEstructuracomun.isValid() && me.taDenominacion.isValid() && me.cbModelogestion.isValid() && me.cbCriterioe.isValid()) {
                var params = {
                    idestructurae: (me.idEstEcon) ? me.idEstEcon : null,
                    arrayidestructurae: Ext.encode(me.cbEstructuracomun.fSelect.values),
                    idestructuracomun: me.idEstComun,
                    denominacion: me.taDenominacion.getValue(),
                    codigo: me.tfCodigo.getValue(),
                    idpadre: (me.idPadreEstEcon) ? me.idPadreEstEcon : null,
                    idcriterioe: me.cbCriterioe.getValue(),
                    idmodeloe: me.cbModelogestion.getValue(),
                    logo: (document.getElementById('photo-container').base64img) ? document.getElementById('photo-container').base64img : null,
                    formatos: Ext.encode(me.getFormatos()),
                    usuarios: Ext.encode(me.getUsuarios()),
                    arrayidestructuraeatiendecomun: Ext.encode(arrayAux),
                    reiniciocmp: me.cbNumComprobante.getValue(),
                    confecPor: me.cbPersonaCofecionado.getValue(),
                    aprobPor: me.cbPersonaAprobado.getValue()
                };
                Ext.MessageBox.wait(me.idioma.lbWaitMsgEstructurae, me.idioma.lbEspere);
                Ext.Ajax.request({
                    url: 'updateEstructurae',
                    params: params,
                    callback: function (options, success, response) {
                        Ext.getCmp('btnCargarconf').hide();
                        Ext.MessageBox.hide();
                        responseData = Ext.decode(response.responseText);
                        var msg = (responseData.msg === 1) ? me.idioma.lbMsgGuardado : ((responseData.msg === 2) ? me.idioma.lbMsgExiste : me.idioma.lbMsgErrorGuardar);
                        mostrarMensaje(responseData.codM, msg);
//                          me.btnGuardar.setDisabled(true);
                        if (responseData.success === true) {
                            me.fireEvent('beforeAction', me.nodeSelect);
                        }
                    }
                });
            }
        });
        this.btnEliminar.on('click', function () {
            if (me.idEstEcon !== 0) {
                mostrarMensaje(2, me.idioma.lbMsgEliminar, function (btnPress) {
                    if (btnPress === 'ok') {
                        me.deleteEstructurae();
                    }
                });
            } else
                mostrarMensaje(1, me.idioma.lbMsgSelecEst);
        });
        this.deleteEstructurae = function () {
            Ext.MessageBox.wait(me.idioma.lbWaitMsgDeleteEstructurae, me.idioma.lbEspere);
            Ext.Ajax.request({
                url: 'deleteEstructurae',
                params: {idestructurae: me.idEstEcon},
                callback: function (options, success, response) {
                    Ext.MessageBox.hide();
                    responseData = Ext.decode(response.responseText);
                    var msg = (responseData.msg === 1) ? me.idioma.lbMsgEliminado : ((responseData.msg === 2) ? me.idioma.lbMsgEnUso : me.idioma.lbMsgErrorEliminar);
                    mostrarMensaje(responseData.codM, msg);
//                      me.btnGuardar.setDisabled(true);
                    if (responseData.success === true) {
                        me.fireEvent('beforeAction', me.nodeSelect);
                    }
                }
            });
        };
        this.getFormatos = function () {
            var formatos = new Array();
            var length = me.stGridFormatos.getCount();
            if (length > 0) {
                var elements = me.stGridFormatos.data.items;
                for (var i in elements) {
                    if (i < length) {
                        formatos.push({
                            idformato: elements[i].data.idformato,
                            idnomenclador: elements[i].data.idclasificador
                        });
                    }
                }
            }
            return formatos;
        };
        this.getUsuarios = function () {
            var arrUsuarios = new Array();
            var length = me.stUsuariosEconomica.getCount();
            if (length > 0) {
                var elements = me.stUsuariosEconomica.data.items;
                for (var i in elements) {
                    if (i < length) {
                        arrUsuarios.push(elements[i].data.idusuario);
                    }
                }
            }
            return arrUsuarios;
        };
        this.setEstEconomica = function (est, padre) {
            me.idEstEcon = est;
            me.idPadreEstEcon = padre;
        };
        this.loadDataEstEconomica = function (est, idcriterioe) {//, action) {
            Ext.MessageBox.wait(me.idioma.lbWaitMsgCargando, me.idioma.lbEspere);
            //Recargar el store del combo de los criterios economicos
            me.stCriterioe.removeAll();
            me.stCriterioe.reload({
                params: {
                    criterio: (idcriterioe == 1) ? idcriterioe : null
                },
                callback: function (options, success, response) {
                    Ext.Ajax.request({
                        url: 'loadDataEstructuraE',
                        params: {idestructurae: est},
                        callback: function (options, success, response) {
                            Ext.MessageBox.hide();
                            responseData = Ext.decode(response.responseText);
                            me.actionResponse(responseData);//, action);
                        }
                    });
                }
            });
        };
        this.actionResponse = function (respData) {//}, action) {
            me.listSeleccionAtendidos = [];
            me.listSeleccionAtendidos = respData.estructuraeatiendecomun;
            try {
                me.cbEstructuracomunAtendido.content.items.items[0].getView().refresh();
            } catch (err) {
            }
            Ext.getCmp('cbxEntidadAtendida').setValue('');

            me.listSeleccionAtendidos.forEach(function (T, number, array) {
                var textCB = Ext.getCmp('cbxEntidadAtendida').getValue();
                if (textCB != '')
                    Ext.getCmp('cbxEntidadAtendida').setValue(textCB + ', ' + T[1]);
                else
                    Ext.getCmp('cbxEntidadAtendida').setValue(T[1]);
            })
            //me.btnNuevo.fireEvent('click');
            me.cbEstructuracomun.reset();
            me.cbEstructuracomun.focus(false, 100);
            me.taDenominacion.disable();
            me.taDenominacion.reset();
            me.tfCodigo.reset();
            me.cbModelogestion.reset();
            me.cbCriterioe.reset();
            me.cbClasificador.reset();
            me.cbNumComprobante.reset();
            me.cbFormato.reset();
            me.gpFormatos.getStore().removeAll();
            document.getElementById('photo-container').src = "/contabilidad/contabilidad_financiera/configuracion/views/images/no-foto.png";
            me.cbFormato.setDisabled(true);
            me.btnAplicarconf.setDisabled(true);


            var idme = parseInt(respData.idmodeloe);
            me.cbModelogestion.setRawValue(respData.modeloe);
            me.cbModelogestion.setValue(idme);
            me.tfCodigo.setValue(respData.codigo);
            me.cbEstructuracomun.setValue(respData.denomcomun);
            me.cbEstructuracomun.fSelect.values.push(respData.idestructuracomun);
            me.cbEstructuracomun.fSelect.display.push(respData.denomcomun);
            me.idEstComun = respData.idestructuracomun;
            me.taDenominacion.enable();
            me.tfCodigo.enable();
            me.taDenominacion.setValue(respData.text);
            me.cbCriterioe.setValue(respData.idcriterioe);
            var idrcmp = parseInt(respData.reiniciocmp);
            me.cbNumComprobante.setValue(idrcmp);
            var cantUsuarios = respData.usuarios.length;
            var length = respData.formatos.length;
            me.stUsuariosEconomica.removeAll();

            me.cbPersonaCofecionado.setValue(respData.confeccionadopor);
            me.cbPersonaCofecionado.setRawValue(respData.nomconfeccionadopor);
            me.cbPersonaAprobado.setValue(respData.aprobadopor);
            me.cbPersonaAprobado.setRawValue(respData.nomaprobadopor);

            if (respData.logo) {
                document.getElementById('photo-container').src = "data:image/jpg;base64," + respData.logo;
                document.getElementById('photo-container').base64img = respData.logo;
            }
            if (length > 0) {
                for (var i in respData.formatos) {
                    if (i < length)
                        me.createRecordClasif(respData.formatos[i].idclasificador, respData.formatos[i].clasificador, respData.formatos[i].idformato, respData.formatos[i].formato, respData.formatos[i].vistap, respData.formatos[i].enuso);
                }
            }

            // if(action != 'nuevo'){
            if (cantUsuarios > 0) {
                for (var i in respData.usuarios) {
                    if (i < cantUsuarios)
                        me.createRecordUsuarios(respData.usuarios[i].idusuario, respData.usuarios[i].nombreusuario);
                }
                me.cbUsuarioSist.reset();
                me.btnAsociarUsuario.disable();
            }
            // }
            var arrbotones = new Array();
            arrbotones.push(me.btnGuardar);
            var gridPanelArray = new Array();
            gridPanelArray.push(me.gpFormatos);

            var fieldArray = new Array();
            // fieldArray.push(me.cbFormato);
            // fieldArray.push(me.cbClasificador);
            fieldArray.push(me.cbModelogestion);
            fieldArray.push(me.cbEstructuracomun);
            fieldArray.push(me.cbCriterioe);
            fieldArray.push(me.taDenominacion);
            fieldArray.push(me.tfCodigo);
            fieldArray.push(me.cbNumComprobante);
            fieldArray.push(me.cbPersonaAprobado);
            fieldArray.push(me.cbPersonaCofecionado);
            // fieldArray.push(me.cbEstructuracomunAtendido);
            me.TaskFormValidation.stopTaskValidation();
            me.TaskFormValidation.startTaskValidation('mod', null, arrbotones, gridPanelArray, fieldArray);
        };
        this.ComprobarCampos = function () {
//              if(me.cbEstructuracomun.isValid() && me.taDenominacion.isValid() && me.cbModelogestion.isValid() && me.cbCriterioe.isValid() && me.cbNumComprobante.isValid()) {
//                  me.btnGuardar.setDisabled(me.nodeSelect.id == 0);
//              } else {
//                  me.btnGuardar.setDisabled(true);
//              }
        };
        Ext.getCmp('cbxEntidad').on({
            'change': function () {
                me.taDenominacion.enable();
                me.tfCodigo.enable();
            }
        });
        me.cbEstructuracomun.on({
            'select': function () {
                me.ComprobarCampos();

            },
            change: function () {
                me.taDenominacion.enable();
                me.tfCodigo.enable();
            }
        });
        me.cbUsuarioSist.on({
            'select': function () {
                me.btnAsociarUsuario.enable();
            }
        });
        me.taDenominacion.on({
            'keyup': function () {
                me.ComprobarCampos();
            },
            'invalid': function (cmp, msg) {
                if (cmp.getValue().length > 0) {
                    var vtext = cmp.getValue().trim();
                    cmp.setValue(vtext);
                }
            },
            'blur': function (cmp) {
                if (cmp.getValue().length > 0) {
                    var vtext = cmp.getValue().trim();
                    cmp.setValue(vtext);
                }
            }
        });
        me.cbModelogestion.on('select', function () {
            me.ComprobarCampos();
        });
        me.cbCriterioe.on('select', function () {
            me.ComprobarCampos();
        });
        me.cbNumComprobante.on('select', function () {
            me.ComprobarCampos();
        });
        me.cbClasificador.on({
            'select': function () {
                me.ComprobarCampos();
                me.cbFormato.enable();
            },
            invalid: function () {
                me.cbFormato.disable();
            }
        });
        me.cbFormato.on({
            'select': function () {
                me.ComprobarCampos();
                me.btnAplicarconf.setDisabled(me.cbFormato.disabled);
            },
            invalid: function () {
                me.btnAplicarconf.disable();
            }
        });
    }
});

Contabilidad.Estructurae.TreeEstructuraE = Ext.extend(Ext.tree.TreeGrid, {
    constructor: function (params) {
        this.idioma = params.idioma;
        this.perfil = params.perfil;
        this.rootVisible = true;
        this.region = 'center';
        this.border = false;
        this.isSearch = false;
        this.lMask;
        this.useArrows = false;
        this.lines = true;
        this.cls = 'hidden-icon';
        this.createItems();
        this.initFunctions();
        this.addEvents('beforeAction');
        this.initializeEvents();
        this.bbar = [this.btnActualizar = new Ext.Button({
            tabIndex: 13,
            id: 'btnActualizar',
            text: 'Actualizar',
            tooltip: this.idioma.lbTooltipBtnActualizar,
            iconCls: 'actualizar'
        }), '-',
            this.btnGeneracionComprobante = new Ext.Button({
                // tabIndex: 13,
                id: 'btnGeneracionComprobante',
                disabled: true,
                text: 'Generar Comp.',
                tooltip: 'Activa o desactiva la generación de comprobantes en la estructura',
                iconCls: 'apertura'
            }), '-',
            this.btnAsentarComprobante = new Ext.Button({
                id: 'btnAsentarComprobante',
                disabled: true,
                text: 'Asentar Comp.',
                tooltip: 'Activa o desactiva el asiento automático de los comprobante al postearlos',
                iconCls: 'comprobante'
            })];
        Contabilidad.Estructurae.TreeEstructuraE.superclass.constructor.call(this);
    },
    fLoadMask: function (agMsg) {
        var me = this;
        this.lMask = new Ext.LoadMask(Ext.getBody(), {
            msg: agMsg || me.idioma.lbCargando
        });
        me.lMask.show();
    },
    createItems: function () {
        this.dataUrl = 'loadEstructuraE';
        var me = this;
        this.sField = new Ext.Cont.SearchField({
            id: 'sField',
            tabIndex: 12,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\*\.\#\+\,\:\;\:\;\&]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+\,\:\;\&]*)+$/,
            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\*\.\#\+\,\:\;\:\;\&]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+\,\:\;\&]*)+$/,
            maxLength: 255,
            maxLengthText: this.idioma.textMaxLength,
            invalidText: this.idioma.lbInvalidText,
            regexText: this.idioma.lbInvalidText,
            lbTtlElement: this.idioma.lbSearchEntEcon,
            fnOnSearch: function () {
                me.searchEstructurae(me.sField.getRawValue());
            },
            fnOnClear: function () {
                this.reset();
                me.searchEstructurae('');
                this.focus(false, true);
            }
        });
        this.tbar = [this.sField];
        this.autoExpandColumn = 'expandir';
        this.columns = [
            {
                dataIndex: 'text',
                header: 'Estructura',
                // width: 20,
                sortable: true,
                id: 'expandir'
            },
            {
                dataIndex: 'habilitar',
                header: 'Generar Comp.',
                width: 20,
                align: 'center',
                sortable: true
                // renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                //     console.log(value, metaData, record, rowIndex, colIndex, store);
                //     // if (record.data.habilitar == 1 || !record.data.habilitar) {
                //     //     metaData.attr = 'ext:qtip="' + '<b>' + 'Habilitado' + '</b>"';
                //     //     // metaData.css = 'icondistra-seleccion rojo';
                //     //     metaData.css = 'icondistra-bandera verde';
                //     // } else {
                //     //     metaData.attr = 'ext:qtip="' + '<b>' + 'Deshabilitado' + '</b>"';
                //     //     metaData.css = 'icondistra-bandera rojo';
                //     // }
                // }
            }, {
                dataIndex: 'asentar',
                header: 'Asentar Comp.',
                width: 60,
                align: 'left',
                sortable: true
            }
        ];
        this.root = new Ext.tree.AsyncTreeNode({
            id: '0',
            text: me.idioma.lbRootEstructuraE,
            expanded: true,
            uiProvider: Ext.ux.tree.TreeGridNodeUI
        });
    },
    initFunctions: function () {
        var me = this;
        this.searchEstructurae = function (filter) {
            me.fLoadMask();

            //Desactivar y limpiar el formulario cuando se busca
            var parentNode = me.getNodeById(0);
            me.selModel.select(parentNode);
            me.fireEvent('click', parentNode);

            me.getLoader().baseParams = {
                filter: filter
            };
            me.getLoader().load(me.root, function () {
                if (me.root.childNodes.length == 0) {
                    if (filter.length > 0) {
                        mostrarMensaje(1, me.idioma.lbNoDataSearch);
                    } else {
                        mostrarMensaje(1, me.idioma.lbNoResults);
                    }
                }
                me.root.expand();
                me.lMask.hide();
            });
        };
    },
    initializeEvents: function () {
        var me = this;
        this.beforeAction = function (node) {
            Ext.getCmp('tfCodigo').reset();
            me.fLoadMask();
            var parentNode = (node && node.id != 0) ? node.parentNode : me.getNodeById(0);
            var xpath = parentNode.getPath();
            me.getLoader().load(parentNode, function () {
                if (xpath.length > 0) {
                    me.expandPath(xpath);
                } else {
                    parentNode.expand();
                }
                me.lMask.hide();
            });
            me.selModel.select(parentNode);
            me.fireEvent('click', parentNode);
        };
    }
});
