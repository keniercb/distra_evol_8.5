/*
* TODO
* Ojo a la hora de hacer cambios aqui que esta ventana funciona
* para Ext 4 y 2 al mismo tiempo cuando se hagan cambios verificar que
* funciona para ambas versiones
* */

function fireEventNew(node, eventName) {
    // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
    var doc;
    if (node.ownerDocument) {
        doc = node.ownerDocument;
    } else if (node.nodeType == 9) {
        // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
        doc = node;
    } else {
        throw new Error("Invalid node passed to fireEvent: " + node.id);
    }

    if (node.dispatchEvent) {
        // Gecko-style approach (now the standard) takes more work
        var eventClass = "";

        // Different events have different event classes.
        // If this switch statement can't map an eventName to an eventClass,
        // the event firing is going to fail.
        switch (eventName) {
            case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
            case "mousedown":
            case "mouseup":
                eventClass = "MouseEvents";
                break;

            case "focus":
            case "change":
            case "blur":
            case "select":
                eventClass = "HTMLEvents";
                break;

            default:
                throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
                break;
        }
        var event = doc.createEvent(eventClass);
        event.initEvent(eventName, true, true); // All events created as bubbling and cancelable.

        event.synthetic = true; // allow detection of synthetic events
        // The second parameter says go ahead with the default action
        node.dispatchEvent(event, true);
    } else if (node.fireEvent) {
        // IE-old school style, you can drop this if you don't need to support IE8 and lower
        var event = doc.createEventObject();
        event.synthetic = true; // allow detection of synthetic events
        node.fireEvent("on" + eventName, event);
    }
};

Ext.ns("UCID.cein");
UCID.cein.GestorreportesView = Ext.extend(Ext.Window, {
    constructor: function (config) {
        var me = this;
        var xtype = majorVersion == 2 ? "panel" : "container";
        var fupload = majorVersion == 4 ? 'fileUploadArchivo4' : 'fileUploadArchivo2';
        config = config || {};
        var icon_dir = '../../../lib/ExtJS/temas/default/images/iconos/';
        this.urlcrearnc = "";
        Ext.Ajax.request({
            url: '/seguridad/index.php/configuracion/tieneModuloCein',
            callback: function (option, success, response) {
                var resp = JSON.parse(response.responseText);
                if (resp.success) {
                    me.urlcrearnc = '/herramientas/cein/index.php/cein/adicionar';
                } else {
                    me.urlcrearnc = '/herramientas/gestor_ncclient/index.php/ceinclient/adicionar';
                }
            }
        });
        this.crearNC = function (accion) {
            if (accion == 'aceptar') {
                var ventana = this;
                Ext.getCmp('formpanelGestor').getForm().submit({
                    url: me.urlcrearnc,
                    params: {
                        descripcion: this.textareaDescripcion.getValue(),
                        funcionalidad: '',
                        pathname: config.referencia.substring(9, config.referencia.length),
                        via: 1,
                        idcliente: '',
                        idproducto: ''
                    },
                    success: function (options, success) {
                        crearNCAceptarSuccessWin(ventana);
                    },
                    failure: function (options, resp) {
                        crearNCFailureWin(resp);
                    }
                });
            }
            else {
                Ext.getCmp('formpanelGestor').getForm().submit({
                    url: me.urlcrearnc,
                    params: {
                        descripcion: this.textareaDescripcion.getValue(),
                        funcionalidad: '',
                        /*-*/
                        //pathname: config.referencia,
                        /*+*/
                        pathname: config.referencia.substring(9, config.referencia.length),
                        via: 1,
                        idcliente: '',
                        idproducto: ''
                    },
                    success: function (options, success) {
                        crearNCAplicarSuccessWin();

                    },
                    failure: function (options, resp) {
                        crearNCFailureWin(resp);
                    }
                });

            }

        }

        this.documentKeyGestRep = [
            {
                key: 13,
                alt: false,
                stopEvent: true,
                ctrl: false,
                fn: function (key, manejador) {
                    if (this.btnAceptar.disabled == false) {
                        if (manejador.target.id != 'textareaDescripcion' && Ext.getCmp('formpanelGestor').getForm().isValid()) {
                            me.crearNC('aceptar');
                        }
                        else {
                            var t = Ext.getCmp(manejador.target.id);
                            t.setValue(t.getValue() + '\n');
                        }
                    }
                    else {
                        if (manejador.target.id == 'textareaDescripcion') {
                            var t = Ext.getCmp(manejador.target.id);
                            t.setValue(t.getValue() + '\n');
                        }
                    }

                },
                scope: this
            }, {
                key: 'p',
                alt: true,
                stopEvent: true,
                ctrl: true,
                fn: function () {
                    if (this.btnAplicar.disabled == false)
                        me.crearNC('aplicar');
                },
                scope: this
            }, {
                key: 'x',
                alt: true,
                stopEvent: true,
                ctrl: false,
                fn: function () {
                    this.destroy();
                },
                scope: this
            }];

        if (majorVersion == 4) {
            this.fileUploadArchivo4 = Ext.create('Ext.form.field.File', {
                id: 'fileUploadArchivo4',
                labelAlign: 'top',
                width: 215,
                fieldLabel: 'Imagen',
                buttonConfig: {
                    iconCls: 'buscar',
                    text: 'Buscar'
                    //width: 65
                },
                prevTab: 'fieldDenominacion',
                nextTab: 'textareaDescripcion',
                listeners: {
                    focus: function (t) {
                        t.button.focus(200);
                        var el = document.getElementsByClassName('x-form-file-input')[0];
                        fireEventNew(el, 'click');
                    }
                }
            });
        } else {
            this.fileUploadArchivo2 = new Ext.form.FileUploadField({
                fieldLabel: "Imagen",
                buttonText: "Buscar",
                labelAlign: 'left',
                id: 'fileUploadArchivo2',
                xtype: 'fileuploadfield',
                width: 'auto',
                height: 30,
                prevTab: 'textareaDescripcion',
                nextTab: 'textareaDescripcion',
                listeners: {
                    focus: function (t) {
                        t.button.focus(200);
                        var el = document.getElementsByClassName('x-form-file')[0];
                        fireEventNew(el, 'click');
                    }
                }
            });
        }
        //
        this.btnAceptar = new Ext.Button({
            text: "Aceptar",
            name: "btnAceptar",
            id: "btnAceptar",
            xtype: "button",
            propOwnerCt: "buttons",
            tooltip: "Guardar datos y cerrar ventana <b>(Enter)</b>",
            formBind: true,
            iconCls: "aceptar",
            nextTab: 'fieldDenominacion',
            prevTab: 'btnAplicar',
            listeners: {
                click: function () {
                    var archivo = Ext.getCmp(fupload).value;
                    if (archivo) {
                        var arre = new Array();
                        var arre = archivo.split('.');
                        var extension = archivo.split('.')[archivo.split('.').length - 1];
                        if (extension == 'jpeg' || extension == 'gif' || extension == 'jpg' || extension == 'png' || extension == 'JPEG' || extension == 'GIF' || extension == 'JPG' || extension == 'PNG') {
                            me.crearNC('aceptar');
                        }
                        else {
                            mostrarMensaje(6, 'El archivo seleccionado no es una imagen.');
                        }
                    }
                    else {
                        me.crearNC('aceptar');
                    }
                },
                scope: this
            }
        });

        this.btnAplicar = new Ext.Button({
            text: "Aplicar",
            name: "btnAplicar",
            id: "btnAplicar",
            xtype: "button",
            formBind: true,
            //disabled: true,
            propOwnerCt: "buttons",
            iconCls: "aplicar",
            tooltip: "Guardar datos y limpiar los campos <b>(Ctrl+Alt+P)</b>",
            nextTab: 'btnAceptar',
            prevTab: 'btnCancelar',
            listeners: {
                click: function () {

                    var archivo = Ext.getCmp(fupload).value;
                    if (archivo) {
                        var arre = new Array();
                        arre = archivo.split('.');
                        var extension = arre[arre.length - 1];
                        if (extension == 'jpeg' || extension == 'gif' || extension == 'jpg' || extension == 'png' || extension == 'JPEG' || extension == 'GIF' || extension == 'JPG' || extension == 'PNG') {
                            this.crearNC('aplicar');
                        }
                        else
                            mostrarMensaje(6, 'Error; El archivo tiene que ser una imagen');
                    }
                    else {
                        this.crearNC('aplicar');
                    }
                },
                scope: this
            }
        });

        this.btnCancelar = new Ext.Button({
            text: "Cancelar",
            name: "btnCancelar",
            id: "btnCancelar",
            xtype: "button",
            propOwnerCt: "buttons",
            handler: null,
            tooltip: "Cerrar ventana sin guardar los datos <b>(Alt+X)</b>",
            iconCls: "cancelar",
            nextTab: 'btnAplicar',
            prevTab: 'textareaDescripcion',
            listeners: {
                click: function () {
                    this.destroy();
                },
                scope: this
            }
        });
        //
        this.fieldDenominacion = new Ext.form.TextField({
            name: "fieldDenominacion",
            id: "fieldDenominacion",
            labelAlign: 'top',
            xtype: "field",
            propOwnerCt: null,
            width: 210,
            //height: 40,
            maxLength: 60,
            allowBlank: false,
            //maskRe: /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\s\-]*))[a-zA-ZáéíóúÁÉÍÓÚñÑ\d]$/,
            //maskRe: /^[0-9] a-zA-Z]/,
            regex: /^[\wÁÉÍÓÚáéíóú]+(\s{1}[\wÁÉÍÓÚáéíóú]+)*$/,
            maskRe: /[\wÁÉÍÓÚáéíóú\s]/i,
            regexText: 'Sólo admite caracteres alfanuméricos.',
            //regexText: 'sdsdds',

            fieldLabel: "Denominaci\u00f3n",
            blankText: 'Este campo es obligatorio.',
            invalidText: 'Solo admite caracteres alfanum&eacute;ricos y el caracter de espacio.',
            nextTab: majorVersion == 4 ? 'fileUploadArchivo4' : 'fileUploadArchivo2',
            prevTab: 'btnAceptar',
            /*listeners: {
             render: function () {
             this.destroy();
             },
             scope: this
             }*/
        });

        this.textareaDescripcion = new Ext.form.TextArea({
            name: "textareaDescripcion",
            id: "textareaDescripcion",
            xtype: "textareafield",
            propOwnerCt: null,
            anchor: "100%",
            height: 160,
            maxLength: 1000,
            nextTab: 'btnCancelar',
            prevTab: majorVersion == 4 ? 'fileUploadArchivo4' : 'fileUploadArchivo2',
            enableKeyEvents: true,
            hideLabel: true,
            emptyText: "Sugerencias: \n 1.¿Qué ocurrió? (Si es un error introduzca el mensaje exacto). \n 2. Secuencia de acciones que precedieron a la incidencia. \n 3.Si ocurrió un error en un formulario: ¿Cuál fue el juego de datos introducido? \n 4. Opinión personal acerca de las causas que generaron la incidencia.", //value: "Sugerencias: \n 1.¿Qué ocurrió? (Mensaje exacto del error). \n 2.Secuencia de acciones que precedieron al error. \n 3.Si ocurrió en un formulario: ¿Cuál fue el juego de datos introducido? \n 4.Opinión personal acerca de las causas que generaron la incidencia.",
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            listeners: {
                keydown: function (textField, eventObject) {
                    var ok = textField.getValue().length < 1000;
                    var key = eventObject.getKey();

                    if (key == 8 || key == 46 || key == 37 || key == 39) {
                        textField.enableKeyEvents = true;
                        return;
                    }
                    else if (!ok) {
                        eventObject.stopEvent();
                        return;
                    }
                },
                focus: function (item) {
                    if (item.value == item.originalValue) {
                        item.setValue("");
                    }
                },
                render: function (c) {
                    Ext.QuickTips.register({
                        target: c.getEl(),
                        title: "Sugerencias:",
                        text: "<div><p>1.¿Qué ocurrió? (Si es un error introduzca el mensaje exacto).</p>" +
                        "<p>2. Secuencia de acciones que precedieron a la incidencia.</p>" +
                        "<p>3. Si ocurrió un error en un formulario: ¿Cuál fue el juego de datos introducido? </p>" +
                        "<p>4. Opinión personal acerca de las causas que generaron la incidencia.</p></div>"
                    });
                }

            }
        });


        this.formpanel4 = new Ext.FormPanel({
            name: "formpanelGestor",
            id: 'formpanelGestor',
            propOwnerCt: "items",
            buttonAlign: 'right',
            monitorValid: true,
            frame: true,
            fileUpload: true,
            items: [
                this.textareaDescripcion,
                {
                    xtype: 'fieldset',
                    title: 'Información adicional (opcional)',
                    autoHeight: true,
                    items: [
                        majorVersion == 4 ? this.fileUploadArchivo4 : this.fileUploadArchivo2
                    ]
                }
            ],
            buttons: [
                this.btnCancelar,
                this.btnAplicar,
                this.btnAceptar
            ]
        });

        Ext.apply(config, {
            title: "Indícanos el problema",
            layout: 'fit',
            keys: this.documentKeyGestRep,
            height: 320,
            width: 480,
            modal: true,
            renderTo: 'x-desktop',
            constrainHeader: true,
            resizable: false,
            closable: true,
            closeAction: 'destroy',
            items: [this.formpanel4],
            listeners: {}
        });
        UCID.cein.GestorreportesView.superclass.constructor.call(this, config);
        this.on('render', function () {
            Ext.getCmp('fieldDenominacion').focus(false, 200);
        })
    }
});

function crearNCFailureWin(resp) {
    var msg = resp.result.msg;
    mostrarMensaje(3, msg);
}

function crearNCAplicarSuccessWin() {
    var msg1 = "La incidencia ha sido adicionada satisfactoriamente.";
    mostrarMensaje(1, msg1.toString());
    Ext.getCmp('fieldDenominacion').setValue('');
    Ext.getCmp('formpanelGestor').getForm().reset();
    if (majorVersion == 4)
        Ext.getCmp(fupload).setValue('');
    else
        Ext.getCmp(fupload).getEl().up('.x-form-field-wrap');
    Ext.getCmp(fupload).value = '';
    Ext.getCmp('btnAceptar').setDisabled(true);
    Ext.getCmp('btnAplicar').setDisabled(true);
}

function crearNCAceptarSuccessWin(ventana) {
    var msg1 = "La incidencia ha sido adicionada satisfactoriamente.";
    mostrarMensaje(1, msg1.toString());
    ventana.destroy();
}
