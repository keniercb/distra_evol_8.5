// custom Vtype for vtype:'denominacion'
Ext.apply(Ext.form.field.VTypes, {
    descripcion:  function(v) {
        return /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\,\-\.\(\)\+\{\}\[\]\#\/]+$/.test(v);
    },
    descripcionText: 'Solo admite caracteres alfanum&eacute;ricos y los caracteres especiales (,.-+(){}[]#/).',
    descripcionMask: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\,\-\.\(\)\+\{\}\[\]\#\/]+$/
});

Ext.apply(Ext.form.field.VTypes, {
    pregunta:  function(v) {
        return /^([a-zA-Z0-9 \xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\(\)\_\-\.\,\xBF\x3F]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\(\)\_\-\.\,\xBF\x3F]*)+$/.test(v);
    },
    preguntaText: 'Solo admite caracteres alfanum&eacute;ricos y los caracteres especiales (,.-_()\xBF\x3F).',
    preguntaMask: /^([a-zA-Z0-9 \xad\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\(\)\_\-\.\,\xBF\x3F]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xfc\(\)\_\-\.\,\xBF\x3F]*)+$/
});
