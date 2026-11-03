/**
 * Created by Miguel Antonio on 10/05/2016.
 */
Ext.ns('PVD.Lang');

PVD.Lang.vocabulary = {
    'El': ['El', 'La', 'Los', 'Las'],
    'el': ['el', 'la', 'los', 'las'],
    'un': ['un', 'una', 'unos', 'unas'],
    'de': ['del', 'de la', 'de los', 'de las'],
    'este': ['este', 'esta', 'estos', 'estas'],
    'ha': ['ha', 'ha', 'han', 'han'],
    'o': ['o', 'a', 'os', 'as'],
    'caracter': ['caracter', 'caracter', 'caracteres', 'caracteres'],
    'especial': ['especial', 'especial', 'especiales', 'especiales'],
    'adicionado': ['adicionado', 'adicionada', 'adicionados', 'adicionadas'],
    'modificado': ['modificado', 'modificada', 'modificados', 'modificados'],
    'eliminado': ['eliminado', 'eliminada', 'eliminados', 'eliminadas'],
    'guardado': ['guardado', 'guardada', 'guardados', 'guardadas'],
    'puede': ['puede', 'puede', 'pueden', 'pueden'],
    'está': ['está', 'está', 'están', 'están'],
};

Ext.apply(PVD.Lang, {
    getVocabularyElemPosition: function (plural, femenino) {
        return (plural ? 2 : 0) + (femenino ? 1 : 0);
    },
    getTag: function (type, name, params, plural, femenino) {
        var pos = this.getVocabularyElemPosition(plural, femenino),
            params = params ? params : new Array(),
            tag = (this[type] && this[type][name]) ? this[type][name] : null,
            tagToken = (tag) ? tag.token : '',
            tagValues = (tag) ? tag.values : null;
        if (tagValues)
            return this.replaceTagToken(tagToken, tagValues, params, pos);
        return tagToken;
    },
    replaceTagToken: function (token, values, params, pos) {
        return token.replace(/\{(\d+)\}/g, function (m, i) {
            var value = values[i];
            if (value == '{params}')
                return params.shift();
            return PVD.Lang.vocabulary[value][pos];
        });
    },
});