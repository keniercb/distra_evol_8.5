/**
 * Created by Miguel Antonio on 09/05/2016.
 */
Ext.ns('PVD.VTypes');
var configVTypes = [{
    regExp: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+)+$/,
    mensaje: 'Solo admite letras.',
    denom: 'Letras',
    type: 'letter'
}, {
    regExp: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+)+$/,
    mensaje: 'Solo admite letras y el caracter especial (espacio).',
    denom: 'Letras y espacio',
    type: 'letterspacer'
}, {
    regExp: /(^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+([a-zA-Z0-9áéíóÁÉÍÓÚúñÑ\d\_\s]*))$/,
    mensaje: "Solo admite letras y números.",
    denom: 'Alfanuméricos',
    type: 'onlyalpha'

}, {
    regExp: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+)+$/,
    mensaje: 'Solo admite caracteres alfanum&eacute;ricos y el caracter especial (espacio).',
    denom: 'Alfanuméricos y espacio',
    type: 'onalphaspacer'

}, {
    regExp: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d]+(\d*)?)+$/,
    mensaje: "Solo admite caracteres alfanum&eacute;ricos.",
    denom: 'Abreviatura',
    type: 'basicabrev'

}, {
    regExp: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d. ]+(\d*)?)+$/,
    mensaje: 'Solo admite caracteres alfanum&eacute;ricos y el caracter especial (espacio).',
    denom: 'Denominación',
    type: 'basicdenom'
}, {
    regExp: /^([\w]+)(.[\w]+)*@([\w-]+\.){1,5}([A-Za-z]){2,4}$/,
    mensaje: "Este campo debe ser una direcci&oacute;n de correo electr&oacute;nico con el formato 'usuario@dominio.ext'.",
    denom: 'Correo',
    type: 'correo'
}, {
    regExp: /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\s\-]*))$/,
    mensaje: "Solo admite caracteres alfanuméricos y los caracteres especiales (-_).",
    denom: 'Alfanuméricos y guiones',
    type: 'onalphagions'
}, {
    regExp: /^[a-zA-Z0-9]+[^\\\/:"<>\?\|;.\*]*$/,
    mensaje: "Solo admite caracteres alfanuméricos excepto (/:*?<>;.).",
    denom: 'Alfanuméricos no(/:*?<>;.)',
    type: 'onalphanotespec'
}, {
    regExp: /^[0-9]+$/,
    mensaje: "Solo admite números.",
    denom: 'Número',
    type: 'onlynumber'
},{
    regExp: /^([ 0-9\d]+ ?[ 0-9\d]*)+$/,
    mensaje: "Solo admite caracteres numéricos.",
    denom: 'Telefóno',
    type: 'onlyphone'
},{
    regExp: /^[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ,()\\+./_-]+([-_/.\s]*[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ,()\\+./_-])+$/,
    //regExp: /^([0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+./_-]+ ?[0-9a-zA-ZÁÉÍÓÚáéíóúñüÑ()\\+./_-]*)+$/,
    mensaje: 'Solo admite caracteres alfanuméricos y los caracteres especiales (espacio (),+-_/\\.).',
    denom: 'Denominación',
    type: 'denominacion'
},{
    regExp: /^[a-zA-ZÁÉÍÓÚáéíóúñüÑ]+([-_/.\s]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ])+$/,
    mensaje: 'Solo admite letras y el caracter especial (espacio).',
    denom: 'Nombre',
    type: 'nombrep'
}];

PVD.VTypes = {
    register: function (name, config) {
        if (name) {
            if (config && (config.regExp || config.fnValidar) && config.mensaje) {
                var vtype = {};
                vtype[name] = function (val, field) {
                    if (config.regExp instanceof RegExp) {
                        if (config.regExp.test(val) && val.match(config.regExp)) {
                            return true;
                        } else
                            return false;
                    } else if (config.fnValidar) {
                        return config.fnValidar(val, field);
                    }
                }
                vtype[name + 'Text'] = config.mensaje;
                if (config.mask && config.mask instanceof RegExp)
                    vtype[name + 'Mask'] = config.mask;
                Ext.apply(Ext.form.VTypes, vtype);
            }
        }
    },
    setMensaje: function (name, mensaje) {
        Ext.form.VTypes[name + "Text"] = mensaje;
    }
};


/***
 * Registar los tipos de validadores definidos
 */
for (var i = 0; i < configVTypes.length; i++) {
    PVD.VTypes.register(configVTypes[i].type, {
        regExp: configVTypes[i].regExp,
        mensaje: configVTypes[i].mensaje
    });
}
