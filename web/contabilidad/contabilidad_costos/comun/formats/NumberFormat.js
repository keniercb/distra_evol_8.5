/**
 * Esta clase permite utilizar formatos para números, moneda
 *
 * @author Ing. Alejandro Mengana Pérez <amengana@xetid.cu>
 */
Ext.define('CostoComun.formats.NumberFormat', {
    alternateClassName: 'NumberFormat',

    constructor: function () {
    },

    formatoMoneda: function (v) {
        if (v == 'Carga inicial')
            return v;
        if (v == 0)
            return '0.00';
        v = (Math.round((v - 0) * 100)) / 100;
        v = (v == Math.floor(v)) ? v + ".00" : ((v * 10 == Math.floor(v * 10)) ? v + "0" : v);
        v = String(v);
        var ps = v.split(".");
        var whole = ps[0];
        var sub = ps[1] ? "." + ps[1] : ".00";
        var r = /(\d+)(\d{3})/;
        while (r.test(whole)) {
            whole = whole.replace(r, "$1" + "," + "$2");
        }
        v = whole + sub;
        if (v.charAt(0) == "-") {//caso saldo negativo
            return "(" + v.substr(1) + ")";
        }
        return v;
    },

    formatoMonedaPeso: function (v) {
        if (v == 0)
            return '$0.00';
        v = (Math.round((v - 0) * 100)) / 100;
        v = (v == Math.floor(v)) ? v + ".00" : ((v * 10 == Math.floor(v * 10)) ? v + "0" : v);
        v = String(v);
        var ps = v.split(".");
        var whole = ps[0];
        var sub = ps[1] ? "." + ps[1] : ".00";
        var r = /(\d+)(\d{3})/;
        while (r.test(whole)) {
            whole = whole.replace(r, "$1" + "," + "$2");
        }
        v = whole + sub;
        if (v.charAt(0) == "-") {
            return "($" + v.substr(1) + ")";
        }
        return "$" + v;
    },

    formatoMonedaABS: function (v) {
        if (v == 'Carga inicial')
            return v;
        if (v == 0)
            return '0.00';
        v = (Math.round((v - 0) * 100)) / 100;
        v = (v == Math.floor(v)) ? v + ".00" : ((v * 10 == Math.floor(v * 10)) ? v + "0" : v);
        v = String(v);
        var ps = v.split(".");
        var whole = ps[0];
        var sub = ps[1] ? "." + ps[1] : ".00";
        var r = /(\d+)(\d{3})/;
        while (r.test(whole)) {
            whole = whole.replace(r, "$1" + "," + "$2");
        }
        v = whole + sub;
        if (v.charAt(0) == "-") {//caso saldo negativo
            return v.substr(1);
        }
        return v;
    },

    cleanComa: function (v) {
        v = v.replace(/\,/g, ''); //sacar coma repetida
        return v;
    },

    cleanFormatoMoneda: function (v) {
        v = v.replace(/\.00/g, ''); //sacar coma repetida
        return v;
    }

}, function () {
    /*
    * Singlenton
    * */
    CostoComun.NumberFormat = new this();
});