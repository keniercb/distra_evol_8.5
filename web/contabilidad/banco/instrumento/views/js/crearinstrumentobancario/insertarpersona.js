
var fecha;

var msg = function(title, msg) {
    Ext.Msg.show({
        title: title,
        msg: msg,
        minWidth: 200,
        modal: true,
        icon: Ext.Msg.INFO,
        buttons: Ext.Msg.OK
    });
};

var tfCarnetIdentidad = new Ext.form.TextField({
    xtype: 'textfield',
    //x : '15px',
    //y : '31px',
    fieldLabel: 'Carnet de identidad',
    allowBlank: false,
    msgTarget: 'qtip',
    blankText: 'Este campo es obligatorio.',
    maskRe: /^\d+(\.\d*)?$/,
    anchor: '90%',
    name: 'numid',
    listeners: {
        blur: function() {
            var cont = 0;
            texto = tfCarnetIdentidad.getRawValue();
            var expresion = /^[0-9]+$/;
            if (!expresion.test(texto) && texto != "") {
                tfCarnetIdentidad.markInvalid("Este campo solo permite n&uacute;meros.");
            } else {
                if (texto.length != 6 && texto.length != 11 && texto != "") {
                    tfCarnetIdentidad.markInvalid("El tamaño m&aacute;ximo requerido es de 6 o 11 d&iacute;gitos.");
                } else {
                    if (texto.length == 6) {
                        for (var i = 0; i < texto.length; i++)
                            cont += parseInt(texto.charAt(i));
                        if (cont == 0)
                            tfCarnetIdentidad.markInvalid("Formato de carnet err\xf3neo.");

                    } else if (texto.length == 11) {
                        if (Valida_NumID(texto)) {
                            tfCarnetIdentidad.markInvalid("Formato de carnet err\xf3neo.");
                        } else {
                            fnac = this.getValue();
                            AA = fnac.substr(0, 2);
                            MM = fnac.substr(2, 2);
                            DD = fnac.substr(4, 2);
                            /*
                             if (fecha.substr(6, 4) < 20 + AA)
                             YY = 19 + AA;
                             else
                             YY = 20 + AA;*/
                        }
                    } else {
                        tfCarnetIdentidad.markInvalid("Este campo es obligatorio.");
                    }
                }
            }
        },
        change: function() {
            cambio = 1;
        }
    }
});

var tfNombre = new Ext.form.TextField({
    //x : '170px',
    //y : '31px',
    fieldLabel: 'Nombre(s)',
    name: 'nombre',
    id: 'nombre',
    style: 'text-transform: capitalize',
    anchor: '95%',
    msgTarget: 'qtip',
    maskRe: /^([a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/, // Solo letras y espacios
    regex: /^([a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
    regexText: 'Este campo solo permite letras.',
    allowBlank: false,
    blankText: 'Este campo es obligatorio.',
    maxLength: 30,
    maxLengthText: 'El tama&ntilde;o requerido es de 30 caracteres.',
    enableKeyEvents: true,
    listeners: {
        change: function() {
            cambio = 1;
        },
        blur: function() {
            option = 'nombre';
            capitalize(option, false);
        },
        keypress: function(tf, e) {
            if (e.getKey() != 8 && e.getKey() != 46) // Para que permita borrar
            {
                var value = new String(tf.getValue());
                if (value.length >= 30)
                    e.stopEvent();  // Para que no escriba m�s de 19 caracteres	
                option = 'nombre';
            }
        },
        keyup: function(tf, e) {
            var value = new String(tf.getValue());
            option = 'nombre';
            if (value.charAt(value.length - 1) == " ")
                capitalize(option, true);
            else
                capitalize(option, false);
        }
    }
});

var tfPApellido = new Ext.form.TextField({
    //x : '15px',
    //y : '81px',
    fieldLabel: 'Primer apellido',
    id: 'Papellido',
    name: 'papel',
    style: 'text-transform: capitalize',
    allowBlank: false,
    maskRe: /^([a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/, // Solo letras y espacios
    regex: /^([a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
    regexText: 'Este campo solo permite letras.',
    blankText: 'Este campo es obligatorio.',
    maxLength: 30,
    maxLengthText: 'El tama&ntilde;o requerido es de 30 caracteres.',
    enableKeyEvents: true,
    listeners: {
        change: function() {
            cambio = 1;
        },
        blur: function() {
            option = 'primerapellido';
            capitalize(option, false);
        },
        keypress: function(tf, e) {
            if (e.getKey() != 8 && e.getKey() != 46) // Para que permita borrar
            {
                var value = new String(tf.getValue());
                if (value.length >= 30)
                    e.stopEvent();  // Para que no escriba m�s de 19 caracteres
                option = 'primerapellido';
            }
        },
        keyup: function(tf, e) {
            var value = new String(tf.getValue());
            option = 'primerapellido';
            if (value.charAt(value.length - 1) == " ")
                capitalize(option, true);
            else
                capitalize(option, false);
        }

    },
    msgTarget: 'qtip',
    anchor: '90%',
    //width : 160
});

var tfSApellido = new Ext.form.TextField({
    //x : '170px',
    //y : '81px',
    fieldLabel: 'Segundo apellido',
    id: 'Sapellido',
    name: 'sapel',
    style: 'text-transform: capitalize',
    maskRe: /^([a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/, // Solo letras y espacios
    regex: /^([a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
    regexText: 'Este campo solo permite letras.',
    allowBlank: false,
    blankText: 'Este campo es obligatorio.',
    maxLength: 30,
    maxLengthText: 'El tama&ntilde;o requerido es de 30 caracteres.',
    enableKeyEvents: true,
    listeners: {
        change: function() {
            cambio = 1;
        },
        blur: function() {
            option = 'segundoapellido';
            capitalize(option, false);
        },
        keypress: function(tf, e) {
            if (e.getKey() != 8 && e.getKey() != 46) // Para que permita borrar
            {
                var value = new String(tf.getValue());
                if (value.length >= 30)
                    e.stopEvent();  // Para que no escriba m�s de 19 caracteres
                option = 'segundoapellido';
            }
        },
        keyup: function(tf, e) {
            var value = new String(tf.getValue());
            option = 'segundoapellido';
            if (value.charAt(value.length - 1) == " ")
                capitalize(option, true);
            else
                capitalize(option, false);
        }
    },
    msgTarget: 'qtip',
    anchor: '95%',
    //width : 160
});

var store_sexo = new Ext.data.SimpleStore({
    autoload: true,
    fields: ['idsexo', 'sexo'],
    // fields:[{name: 'idsexo', type: 'int'},
    // {name: 'sexo', type: 'string'}],
    data: [[1, 'Masculino'], [2, 'Femenino']]
});

var cbSexo = new Ext.form.ComboBox({
    id: 'cbSexo',
    name: 'cbSexo',
    fieldLabel: 'Sexo',
    anchor: '90%',
    autoLoad: true,
    store: store_sexo,
    mode: 'local',
    displayField: 'sexo',
    tpl: '<tpl for="."><div ext:qtip="{sexo}" class="x-combo-list-item">{sexo}</div></tpl>',
    valueField: 'idsexo',
    hiddenName: 'idsexo',
    editable: false,
    triggerAction: 'all',
    emptyText: 'Seleccione...',
    allowBlank: false,
    msgTarget: 'qtip',
    blankText: 'Este campo es obligatorio.'
});

var formularioDatos = new Ext.FormPanel({
    layout: 'form',
    frame: true,
    //baseCls : 'x-plain',
    labelAlign: 'top',
    trackResetOnLoad: true,
    height: 170,
    //bodyStyle : 'padding: 10px',
    width: 410,
    /*defaults : {
     width : 135
     },*/
    items: [{
            layout: 'column',
            border: false,
            anchor: '100%',
            items: [{
                    columnWidth: .50,
                    style: 'margin:8 0 0 30',
                    anchor: '100%',
                    layout: 'form',
                    border: false,
                    items: [tfCarnetIdentidad, tfPApellido, cbSexo]
                }, {
                    columnWidth: .45,
                    style: 'margin:8 0 0 20',
                    anchor: '100%',
                    layout: 'form',
                    border: false,
                    items: [tfNombre, tfSApellido]
                }]
        }],
    reader: new Ext.data.JsonReader({
        root: "datos",
        id: "idpersona"
    }, [{
            name: 'numid'
        }, {
            name: 'nombre'
        }, {
            name: 'papel'
        }, {
            name: 'sapel'
        }, {
            name: 'idsexo'
        }])
});

var panel = new Ext.Panel({
    baseCls: 'x-plain',
    layout: 'form',
    frame: true,
    items: [formularioDatos]
});


// -------------------------------------------------------------------------------------------------------------
// Ventanas donde se muestra el formulario ya sea para insertar o modificar
var win;
function WinFpGestionarTrabajador(store) {
    if (!win) {
        win = new Ext.Window({
            title: 'Adicionar datos de la persona',
            width: 410,
            autoHeight: true,
            layout: 'fit',
            resizable: false,
            //collapsible : true,
            closeAction: 'hide',
            items: [panel],
            buttons: [{
//                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    handler: function() {
                        win.hide();
                    }
                }, {
//                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'aceptar',
                    text: 'Aceptar',
                    handler: function() {
                        if (validarInvalidos() && comprobarCarnetDeIdentidad())
                        {
                            adicionarpersona(store);
                            formularioDatos.getForm().clearInvalid();
                        } else {
                            mostrarMensaje(1, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).',function(){});
                        }
                    }
                }]
        }); // Creada ventana
        win.doLayout();
        win.buttons[1].show();
        win.show();
    } else {
        LimpiarFormulario();
        win.setTitle('Adicionar datos de la persona');
        win.buttons[1].show();
        win.show();
    }
}


function validarInvalidos() {
    if (formularioDatos.getForm().isValid())
        return true;
    else
    {
        //var myArray = [{id:'tfSApellido', msg:'Campo obligatorio'},{id:'cbSexo', msg:'Campo obligatorio'}];
        var myArray = [{id: 'cbSexo', msg: 'Este campo es obligatorio.'}];
        formularioDatos.getForm().markInvalid(myArray);
        return false;
    }
}

function Valida_NumID(numid) {
    var error = false;
    var n = String(numid);
    AA = n.substr(0, 2);
    MM = n.substr(2, 2);
    DD = n.substr(4, 2);
    S = n.substr(6, 1);
    CC = n.substr(7, 4);
    if (S <= 8)
        if (S <= 5)
            SS = 19;
        else
            SS = 20;
    else
        SS = 18;
    AA = SS * 1000 + AA;
    if (((AA % 4 == 0) && (AA % 100 != 0)) || (AA % 400 == 0))
        bis = 29;
    else
        bis = 28;
    // Valido el dia y mes
    switch (MM) {
        case '04' :
        case '06' :
        case '09' :
        case '11' :
            if (DD > 30 || DD == '00')
                error = true;
            break;
        case '01' :
        case '03' :
        case '05' :
        case '07' :
        case '08' :
        case '10' :
        case '12' :
            if (DD > 31 || DD == '00')
                error = true;
            break;
        case '02' :
            if (DD > bis || DD == '00')
                error = true;
            break;
        default :
            error = true;
            break;
    }
    if (error) {
        return true;
    } else
        return false;
}// de la funcion

// Valida si tiene 11 digitos (civil) y 6 digitos (militar)
function comprobarCarnetDeIdentidad() {
    var cont = 0;
    texto = tfCarnetIdentidad.getRawValue();
    var expresion = /^[0-9]+$/;
    if (!expresion.test(texto) && texto != "") {
        return false;
    } else {
        if (texto.length != 6 && texto.length != 11 && texto != "") {
            return false;
        } else {
            if (texto.length == 6) {
                for (var i = 0; i < texto.length; i++)
                    cont += parseInt(texto.charAt(i));
                if (cont == 0)
                    return false;
                return true;

            } else if (texto.length == 11) {
                if (Valida_NumID(texto)) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        }
    }
}

function capitalize(option, espacio) {
    if (option == 0)
        return;
    else
        switch (option) {
            case 'nombre':
                {
                    tfNombre.setValue(capitalizar(tfNombre.getValue(), espacio));
                }
                break;
            case 'primerapellido':
                {
                    tfPApellido.setValue(capitalizar(tfPApellido.getValue(), espacio));
                }
                break;
            case 'segundoapellido':
                {
                    tfSApellido.setValue(capitalizar(tfSApellido.getValue(), espacio));
                }
                break;
        }
}

function capitalizar(str, espacio) {
    if (str.length != 0) {
        var words = str.split(" ");
        var pos = 0;
        var Twords = "";
        for (var i = 0; i < words.length; i++) {
            if (words[i])
            {
                if (pos == 0)
                    Twords += words[i].charAt(0).toUpperCase() + words[i].substring(1).toLowerCase();
                else
                    Twords += " " + words[i].charAt(0).toUpperCase() + words[i].substring(1).toLowerCase();
                pos++;
            }
        }
        if (espacio)
            Twords += " ";
        return Twords;
    }
}

var lMasktemp;
function Mostrarmsgespera(componente, mensaje)
{
    lMasktemp = new Ext.LoadMask(componente, {
        msg: mensaje
    });
    lMasktemp.show();
}

function adicionarpersona(store) {
    if (validarInvalidos()) {
        Mostrarmsgespera(Ext.getBody(), 'Registrando datos de persona...');
        Ext.Ajax.request({
            url: 'insertarpersona',
            params: {
                numid: tfCarnetIdentidad.getValue(),
                nombre: tfNombre.getValue(),
                papel: tfPApellido.getValue(),
                sapel: tfSApellido.getValue(),
                idsexo: cbSexo.getValue()
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                switch (responseData.cantidad)
                {
                    case 0:
                        mostrarMensaje(1, 'No se pudo insertar la persona.',function(){});
                        lMasktemp.hide();
                        return;
                        break;
                    case -1:
                        mostrarMensaje(1, 'No se puede insertar la persona. <br>El carnet de identidad ya est&aacute; registrado con otra persona de la entidad.</br>',function(){});
                        lMasktemp.hide();
                        return;
                        break;
                    default:
                        store.loadData(responseData);
                        win.hide();
                        LimpiarFormulario();
                        mostrarMensaje(1, 'Los datos de la persona fueron registrados correctamente.',function(){});
                        break;
                }
                lMasktemp.hide();
            }
        });
    }
}

function LimpiarFormulario() {
    tfCarnetIdentidad.setValue("");
    tfNombre.setValue("");
    cbSexo.clearValue();
    tfPApellido.setValue("");
    tfSApellido.setValue("");
    formularioDatos.getForm().clearInvalid();
}