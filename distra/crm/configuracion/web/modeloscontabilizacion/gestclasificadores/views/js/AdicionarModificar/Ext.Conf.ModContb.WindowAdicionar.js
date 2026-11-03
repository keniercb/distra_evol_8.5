/*
 * Ext JS Library 2.2
 * Copyright(c), Ext JS, LLC.
 * creado por Alejandro Mengana Pérez - (Desarrollador de CONFIN)
 */

/**
 * @class Ext.Conf.ModContb.WindowAdicionar
 * @extends Ext.Window
 */

Ext.namespace('Ext.Conf.ModContb.WindowAdicionar');
Ext.Conf.ModContb.WindowAdicionar = Ext.extend(Ext.Window, {
//    Properties and Variables
//    idioma: {},
//    perfil: {},
    //Functions
    constructor: function (params) {

        this.addEvents('clasificadoradded');

        params.baseUrl = '/configuracion/modeloscontabilizacion/gestclasificadores/index.php/gestclasificadores/';

        //Peticion para cargar las etiquetas
        var myMask = new Ext.LoadMask(Ext.getBody());
        myMask.show();
        Ext.Ajax.request({
            method: "POST",
            url: params.baseUrl + 'cargaretiquetas',
            scope: this,
            callback: function (options, success, response) {

                params.idioma = Ext.decode(response.responseText);
                params.perfil = window.parent.perfil;

                params.keymapActive = true;

                params.title = (params.accion === 'adicionar') ? params.idioma.titlewindowaddclasificador
                    : params.idioma.titlewindowmodclasificador;

                params.lastElement = params.btnaccept = new Ext.Button({
                    id: 'btnaccept' + params.id,
                    text: params.idioma.textbtnAceptar,
                    iconCls: 'aceptar',
                    minWidth: 80,
                    tooltip: params.idioma.tooltipbtnAceptar,
                    disabled: true
                });

                params.btnaplicar = new Ext.Button({
                    id: 'btnaplicar' + params.id,
                    text: params.idioma.textbtnAplicar,
                    iconCls: 'aplicar',
                    minWidth: 80,
                    tooltip: params.idioma.tooltipbtnAplicar,
                    disabled: true
                });

                params.defaultButton = params.btncancelar = new Ext.Button({
                    id: 'btncancelar' + params.id,
                    text: params.idioma.textbtnCancelar,
                    iconCls: 'cancelar',
                    minWidth: 80,
                    tooltip: params.idioma.tooltipbtnCancelar
                });

                params.firstElement = params.tfnombreclfd = new Ext.form.TextField({
                    id: 'tfnomb' + params.id,
                    fieldLabel: params.idioma.lbtfnombreclfd,
                    anchor: '100%',
                    allowBlank: false,
                    maskRe: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+$/,
                    regex: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+$/,
                    maxLength: 90,
                    enableKeyEvents: true,
                    regexText: params.idioma.regexTextLetrasNumeros
                });

                params.tadescrpcionclfd = new Ext.form.TextArea({
                    id: 'tadescripcion' + params.id,
                    fieldLabel: params.idioma.lbtadescrpcionclfd,
                    anchor: '100%',
                    enableKeyEvents: true,
                    maxLength: 255
                });

                params.cbtreeClase = new Ext.form.ComboBox({
                    id: 'cbt' + params.id,
                    fieldLabel: params.idioma.lbcbtreeClase,
                    anchor: '100%',
                    allowBlank: false,
                    forceSelection: true,
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    enableKeyEvents: true,
                    editable: false,
                    store: new Ext.data.SimpleStore({
                        fields: [],
                        data: [[]]
                    }),
                    lazyRender: true,
                    tpl: '<div id = \"clasemapea\" style = \"height:250px; !important;\"></div>'
                });
                //Estas son las variables utilizadas para no cargar las columnas de las
                //clases seleccionadas, o sea no hacer una peticion demas al servidor
                params.oldClassSelected = params.cbtreeClase.getValue();
                params.newClassSelected = params.cbtreeClase.getValue();

                params.gridCamposcont = new Ext.Conf.ModContb.GridEditor({
                    idComponente: 2.1,
                    perfil: params.perfil,
                    idioma: params.idioma,
                    frame: true,
                    height: 237,
                    anchor: '100%',
                    textbtnadd: params.idioma.textbtnaddCampos,
                    tooltipbtnadd: params.idioma.tooltipbtnaddCampos,
                    textbtndel: params.idioma.textbtndelCampos,
                    tooltipbtndel: params.idioma.tooltipbtndelCampos,
                    saveText: params.idioma.textbtnAceptar,
                    saveTooltip: params.idioma.textbtnA,
                    cancelText: params.idioma.textbtnCancelar,
                    cancelTooltip: params.idioma.textbtnC,
                    iconSave: 'aceptar',
                    validateChange: false
                });

                params.tpDirectorios = new Ext.tree.TreePanel({
                    id: 'tpDirectorios' + params.id,
                    animate: true,
                    autoScroll: true,
                    height: 250,
                    border: false,
                    trackMouseOver: true,
                    rootVisible: true,
                    root: new Ext.tree.AsyncTreeNode({
                        text: params.idioma.textraizArbolApp,
                        id: '0',
                        expanded: true
                    }),
                    loader: new Ext.tree.TreeLoader({
                        url: params.baseUrl + 'cargardir'
                    })
                });

                Ext.apply(this, params);
                Ext.apply(this, {
                    id: 'window' + params.id,
                    border: false,
                    closeAction: 'close',
                    layout: 'fit',
                    constrain: true,
                    modal: true,
                    resizable: false,
                    height: 535,
                    width: 600,
                    keys: {
                        key: Ext.EventObject.ENTER,
                        scope: this,
                        fn: function () {
                            if (!this.btnaccept.disabled && this.keymapActive) {
                                this.keymapActive = false;
                                //true como parámetro porque se está aceptando
                                this.addmodClasificador(true, params.idioma);
                            }
                        }
                    },
                    buttons: [params.btncancelar, params.btnaplicar, params.btnaccept],
                    items: [
                        {
                            layout: 'form',
                            frame: true,
                            labelAlign: 'top',
                            items: [
                                params.tfnombreclfd,
                                params.tadescrpcionclfd,
                                {
                                    xtype: 'fieldset',
                                    title: params.idioma.titleConfCamposCont,
                                    layout: 'form',
                                    labelAlign: 'top',
                                    height: 320,
                                    width: 575,
                                    items: [params.cbtreeClase, params.gridCamposcont]
                                }
                            ]
                        }
                    ]
                });

                this.keyMap = new Ext.KeyMap(Ext.getBody(), [
                    {
                        key: "i",
                        alt: true,
                        scope: this,
                        fn: function () {
                            if (!this.gridCamposcont.btnadd.disabled && !this.gridCamposcont.disabled) {
                                this.gridCamposcont.insertar();
                            }
                        }
                    }
                ]);

                Ext.Conf.ModContb.WindowAdicionar.superclass.constructor.call(this);

                if (params.accion === 'modificar') {
                    //Petición para cargar los datos a modificar
                    Ext.Ajax.request({
                        method: "POST",
                        url: params.baseUrl + 'cargarcampos',
                        scope: this,
                        params: {
                            idclasificador: this.idclasificador,
                            ruta: this.ruta
                        },
                        callback: function (options, success, response) {

                            var responseobj = Ext.decode(response.responseText);

                            this.tfnombreclfd.setValue(this.nombre);
                            this.tadescrpcionclfd.setValue(this.descripcion);
                            this.cbtreeClase.setValue(this.referenciaclase);

                            this.gridCamposcont.getStore().loadData(responseobj.campos);
                            this.gridCamposcont.cbcampos.store.loadData(responseobj.columnas);
                            this.newClassSelected = this.referenciaclase;
                            this.oldClassSelected = this.referenciaclase;
                            this.gridCamposcont.enable();
                            //Se esconde el boton aplicar porque se está modificando
                            this.btnaplicar.hide();
                            this.inicializarEventos(params.perfil, params.idioma);
                            this.show();
                            //this.tfnombreclfd.focus(true, 1000);
                            myMask.hide();
                        }
                    });
                }
                else {//entonces esta adicionando
                    this.inicializarEventos(params.perfil, params.idioma);
                    this.show();

                    //this.tfnombreclfd.focus(true, 1000);
                    myMask.hide();
                }
            }
        });
    },
    inicializarEventos: function (perfil, idioma) {

        this.btnaccept.on('click', function (button, e) {
            //true como parámetro porque se está aceptando
            this.addmodClasificador(true, idioma);
        }, this);


        this.btnaplicar.on('click', function () {
            //false como parámetro porque se está aplicando
            this.addmodClasificador(false, idioma);
        }, this);


        this.btncancelar.on('click', function (button, e) {
            this.close();
        }, this);


        this.cbtreeClase.on('expand', function (combo) {
            if (!this.tpDirectorios.rendered) {
                this.tpDirectorios.render('clasemapea');
            }
        }, this);


        this.tpDirectorios.on('click', function (node, e) {
            if (node.attributes.leaf) {
                this.newClassSelected = node.attributes.text;
                this.cbtreeClase.setValue(node.attributes.text);
                this.cbtreeClase.collapse();

                if (this.newClassSelected !== this.oldClassSelected) {
                    //cargar el store del combo del grid editor para los campos asociados a la clase
                    this.gridCamposcont.cbcampos.store.baseParams = {path: node.attributes.id};

                    var mask = new Ext.LoadMask(this.getEl(), {msg: idioma.msgCargando});
                    mask.show();

                    this.gridCamposcont.getStore().commitChanges();
                    if (this.accion === 'adicionar') {
                        this.gridCamposcont.arreliminados = new Array();
                    }
                    else {//this.accion === 'modificar'
                        //Incluir los records que serán eliminados con el removeAll
                        //al arreglo de eliminados this.gridCamposcont.arreliminados
                        //Esto pasa si se esta modificando
                        var arr = this.gridCamposcont.getStore().getRange();
                        for (var i = 0; i < arr.length; i++) {
                            this.gridCamposcont.arreliminados.push(arr[i]);
                        }
                    }
                    this.gridCamposcont.getStore().removeAll();
                    this.gridCamposcont.cbcampos.store.load({
                        scope: this,
                        callback: function (record, options, success) {
                            this.gridCamposcont.enable();
                            this.oldClassSelected = node.attributes.text;
                            mask.hide();
                        }
                    });
                }
            } else {
                return false;
            }
        }, this);


        //Evento del combo de la columna campo del grid editor
        this.gridCamposcont.cbcampos.on('beforeselect', function (combo, record, index) {
            var cantcamposinsertados = this.gridCamposcont.getStore().getCount();
            if (cantcamposinsertados > 1) {
                var campinsertmenoslast = this.gridCamposcont.getStore().getRange();
                for (var i = 0; i < campinsertmenoslast.length; i++) {
                    if (campinsertmenoslast[i].data.campo === record.data.campo) {
                        mostrarMensaje(3, idioma.asociacionCampo, function () {
                        });
                        return false;
                    }
                }
            }
        }, this);


        this.gridCamposcont.on({
            scope: this,
            'gridvalid': function (state, grideditor) {
                if (state && this.tfnombreclfd.isValid()) {
                    this.btnaccept.setDisabled(!state);
                    this.btnaplicar.setDisabled(!state);
                }
            },
            'insertrow': function (grideditor, record) {
                this.btnaccept.setDisabled(true);
                this.btnaplicar.setDisabled(true);
            }
        });

        this.gridCamposcont.getStore().on({
            scope: this,
            remove: function (store, record, index) {
                if (!this.gridCamposcont.gridValid() || this.gridCamposcont.getStore().getCount() === 0) {
                    this.btnaccept.setDisabled(true);
                    this.btnaplicar.setDisabled(true);
                }
                else {
                    this.btnaccept.setDisabled(false);
                    this.btnaplicar.setDisabled(false);
                }
            },
            clear: function (store) {
                this.btnaccept.setDisabled(true);
                this.btnaplicar.setDisabled(true);
            }
        });

        this.gridCamposcont.roweditor.on({
            validation: function (roweditor, valid) {
                if (valid) {
                    this.saveBtn.setDisabled(!(this.items.items[0].getValue() != this.record.data['nombrealternativo'] || this.items.items[1].getRawValue() != this.record.data['campo']));
                }
            }
        })

        //Valores para comparar la primera carga del tfnombreclfd
        this.tfnombreV1 = this.tfnombreclfd.getValue();
        this.tfnombreV2 = this.tfnombreclfd.getValue();
        //Valores para comparar la primera carga del tadescrpcionclfd
        this.tadescripcionV1 = this.tadescrpcionclfd.getValue();
        this.tadescripcionV2 = this.tadescrpcionclfd.getValue();

        this.tfnombreclfd.on('keyup', function (textfield, e) {
            this.tfnombreV2 = textfield.getValue();
            this.tadescripcionV2 = this.tadescrpcionclfd.getValue();
            //Esta variable es para controlar cuando se carga los campos nombre y descripcion
            //cuando se va a modificar que el formulario sea válido cuando se
            //cambie sus valores
            var samevaluetfnombre = (this.tfnombreV1 === this.tfnombreV2) ? true : false;
            var samevaluetadescripcion = (this.tadescripcionV1 === this.tadescripcionV2) ? true : false;

            var valid = textfield.isValid() && this.gridCamposcont.gridValid() &&
                (!samevaluetfnombre || !samevaluetadescripcion) &&
                (this.gridCamposcont.getStore().getCount() !== 0);

            this.btnaccept.setDisabled(!valid);
            this.btnaplicar.setDisabled(!valid);
        }, this);

        this.tadescrpcionclfd.on('keyup', function (textarea, e) {
            this.tfnombreV2 = this.tfnombreclfd.getValue();
            this.tadescripcionV2 = textarea.getValue();
            //Esta variable es para controlar cuando se carga los campos nombre y descripcion
            //cuando se va a modificar que el formulario sea válido cuando se
            //cambie sus valores
            var samevaluetfnombre = (this.tfnombreV1 === this.tfnombreV2) ? true : false;
            var samevaluetadescripcion = (this.tadescripcionV1 === this.tadescripcionV2) ? true : false;

            var valid = textarea.isValid() && this.gridCamposcont.gridValid() &&
                (!samevaluetfnombre || !samevaluetadescripcion) &&
                (this.gridCamposcont.getStore().getCount() !== 0);
            this.btnaccept.setDisabled(!valid);
            this.btnaplicar.setDisabled(!valid);
        }, this);


    },
    //Función necesaria para adicionar o modificar un clasificador
    //Se le pasa por parámetro si va a aplicar-false o aceptar-true
    addmodClasificador: function (aceptar, idioma) {
        this.tfnombreclfd.setValue(this.tfnombreclfd.getValue().trim());
        if (this.tfnombreclfd.isValid() && this.cbtreeClase.isValid()) {
            //Verificar si hay algun campo del grid editor vacio
            var alldatoscmpcont = this.gridCamposcont.getStore().getRange();
            var anyEmpty = false;

            if (alldatoscmpcont.length === 0) {
                anyEmpty = true;
            }
            else {
                for (var k = 0; k < alldatoscmpcont.length; k++) {
                    if (alldatoscmpcont[k].data.campo === '' || alldatoscmpcont[k].data.nombrealternativo === '') {
                        anyEmpty = true;
                        break;
                    }
                }
            }

            if (!anyEmpty && this.idsubsistema) {
                //Este procedimiento es necesario para mandar exactamente los records modificados
                //y eliminados del grid gridCamposcont
                var arreliminados = this.gridCamposcont.arreliminados;
                var arrmodificados = this.gridCamposcont.getStore().getModifiedRecords();
                var arridscamposdel = new Array();
                for (var i = 0; i < arreliminados.length; i++) {
                    //Llenado de un arreglo con los ids de los campos a eliminar
                    //Esto es necesario cuando se modifica el clasificador
                    if (!Ext.isEmpty(arreliminados[i].data.idcampo)) {
                        arridscamposdel.push(arreliminados[i].data.idcampo);
                    }
                }

                //Procedimiento para conformar los campos contables a mandar
                var camposcontables = new Array();
                for (var k = 0; k < arrmodificados.length; k++) {
                    camposcontables.push({
                        id: arrmodificados[k].data.idcampo,
                        nombre: arrmodificados[k].data.nombrealternativo,
                        idclasificador: arrmodificados[k].data.idclasificador,
                        tipo: 1,
                        referencia: this.cbtreeClase.getValue() + '.' + arrmodificados[k].data.campo,
                        idsubsistema: this.idsubsistema,
                        idestructuracomun: arrmodificados[k].data.idestructuracomun
                    });
                }

                //Objeto conformado para el clasificador a trabajar
                var ruta = '';
                if (this.tpDirectorios.getSelectionModel().getSelectedNode()) {
                    ruta = this.tpDirectorios.getSelectionModel().getSelectedNode().id;
                }
                else {
                    ruta = this.ruta;
                }

                var clasificador = {
                    id: this.idclasificador ? this.idclasificador : '',
                    nombre: this.tfnombreclfd.getValue(),
                    descripcion: this.tadescrpcionclfd.getValue(),
                    ruta: ruta,
                    referenciaclase: this.cbtreeClase.getValue(),
                    idsubsistema: this.idsubsistema,
                    idestructuracomun: this.idestructuracomun ? this.idestructuracomun : '',
                    camposcontables: Ext.encode(camposcontables),
                    camposEliminados: Ext.encode({ids: Ext.encode(arridscamposdel)})
                };

                //Adicionando o modificando el clasificador
                var msgAccion = (this.accion === 'adicionar') ? idioma.msgAdicionando : idioma.msgModificando;
                var msgSuccess = (this.accion === 'adicionar') ? idioma.msgSuccessAddClf : idioma.msgSuccessModClf;

                this.onloadMessageBox(idioma.msgEspere, msgAccion);

                Ext.Ajax.request({
                    url: this.baseUrl + 'add',
                    params: clasificador,
                    method: 'post',
                    scope: this,
                    callback: function (options, success, response) {
                        var respuesta = Ext.decode(response.responseText);
                        Ext.MessageBox.hide();

                        if (respuesta.errors.length === 0) {
                            mostrarMensaje(1, msgSuccess);

                            if (aceptar) {
                                this.close();
                            }
                            else {//Esta es la opción de aplicar
                                if (this.accion === 'adicionar') {
                                    this.tfnombreclfd.reset();
                                    this.tadescrpcionclfd.reset();
                                    this.cbtreeClase.reset();
                                    this.tpDirectorios.getSelectionModel().clearSelections();
                                    this.tpDirectorios.collapseAll();
                                    this.gridCamposcont.getStore().commitChanges();
                                    this.gridCamposcont.arreliminados = new Array();
                                    this.gridCamposcont.getStore().removeAll();
                                    this.gridCamposcont.setDisabled(true);
                                    this.tfnombreclfd.focus(true, 1000);
                                    this.tfnombreV1 = '';
                                    this.tfnombreV2 = '';
                                    this.tadescripcionV1 = '';
                                    this.tadescripcionV2 = '';
                                    //this.btnaccept.setDisabled(true);
                                    //this.btnaplicar.setDisabled(true);
                                }
                                else {
                                    this.gridCamposcont.getStore().commitChanges();
                                    this.gridCamposcont.arreliminados = new Array();
                                    this.btnaccept.setDisabled(true);
                                    this.btnaplicar.setDisabled(true);
                                    this.tfnombreclfd.focus(true, 1000);
                                    this.tfnombreV1 = this.tfnombreclfd.getValue();
                                    this.tfnombreV2 = this.tfnombreclfd.getValue();
                                    this.tadescripcionV1 = this.tadescrpcionclfd.getValue();
                                    this.tadescripcionV2 = this.tadescrpcionclfd.getValue();
                                }
                            }

                            //Evento que se dispara cuando se adiciona ose modifica el clasificador
                            this.fireEvent('clasificadoradded', this, respuesta.success.clasificador);
                        }
                        else {
                            var errors = respuesta.errors;
                            this.mostrarErrores(errors, idioma);
                        }
                    }
                });
            }
            else {
                mostrarMensaje(3, idioma.msgErrorNoDataCampos1, function () {
                });
            }
        }
        else {
            mostrarMensaje(3, idioma.msgErrorNoDataCampos1, function () {
            });
        }
    },
    //Función necesaria para mostrar los errores que hayan existido
    //durante el proceso de adicion o modificacion del clasificador
    mostrarErrores: function (errors, idioma) {
        var textoMensaje = '';
        for (var i = 0; i < errors.length; i++) {
            if (errors[i].code === 5 && errors[i].errorcmp === 'clasificador') {
                textoMensaje = idioma.msgErrorAddModClf1;
            }
            else if (errors[i].code === 2 && errors[i].errorcmp === 'clasificador') {
                textoMensaje = idioma.msgErrorAddModClf2;
            }
            else if (errors[i].code === 3 && errors[i].errorcmp === 'clasificador') {
                textoMensaje = idioma.msgErrorAddModClf3.replace(/<#>/g, errors[i].nombre);
            } else if (errors[i].code === 8 && errors[i].errorcmp === 'clasificador') {
                textoMensaje = idioma.msgErrorAddModClf8;

            }
            else if (errors[i].code === 7 && errors[i].errorcmp === 'campos') {
                textoMensaje = idioma.msgErrorAddModClf9.replace(/<#>/g, errors[i].nombre);
            } else if (errors[i].code === 3 && errors[i].errorcmp === 'campos') {
                var id = errors[i].id;
                var index = this.gridCamposcont.getStore().find('idcampo', id);
                var nombre = this.gridCamposcont.getStore().getAt(index).data.nombrealternativo;
                textoMensaje = idioma.msgErrorAddModClf4.replace(/<#>/g, nombre);
            }
            else if (errors[i].code === 2 && errors[i].errorcmp === 'campos') {
                textoMensaje = idioma.msgErrorAddModClf5;
            }
            else if (errors[i].code === 4 && errors[i].errorcmp === 'campos') {
                textoMensaje = idioma.msgErrorAddModClf6.replace(/<#>/g, errors[i].nombre);
            }
            else if (errors[i].code === 5 && errors[i].errorcmp === 'campos') {
                textoMensaje = idioma.msgErrorAddModClf7;
            }
        }
        mostrarMensaje(3, textoMensaje);
    },
    onloadMessageBox: function (agTtl, agMsg) {
        Ext.MessageBox.show({
            title: agTtl,
            msg: agMsg,
            width: 300,
            progress: true,
            closable: false
        });
        var f = function (v) {
            return function () {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i);
            };
        };
        for (var i = 1; i < 12; i++) {
            setTimeout(f(i), i * 500);
        }
    }
});




