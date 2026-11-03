/**
 * Created by ariam on 14/10/14.
 */
var crypto = require("crypto");
module.exports = (function () {
    var Crypt = function () {
    };

    Crypt.prototype.cipher = function (text, key) {
        var cipher = crypto.createCipher('blowfish', key);
        cipher.update(text, 'utf8', 'hex');
        return cipher.final('hex');
    };

    Crypt.prototype.decipher = function (text, key) {
        console.log(text);
        var decipher = crypto.createDecipher('blowfish', key);
        decipher.update(text, 'hex', 'utf8');
        return decipher.final('utf8');
    };

    Crypt.prototype.encrypt = function (text, key) {
        var _self = this,
            _t = [],
            _l = text.length;

        while (text) {
            if (_l <= 7) {
                _t.push(_self.cipher(text, key));
                text = "";
            }
            else {
                _t.push(_self.cipher(text.substring(0, 7), key));
                text = text.substring(7);
            }
            _l = text.length;
        }
        return _t.join(" ");
    };

    Crypt.prototype.decrypt = function (text, key) {
        var _self = this,
            _t = text.split(" "),
            _text = "";
        _t.forEach(function (t) {
            _text += _self.decipher(t, key);
            console.log({t: t, _text: _text});
        });
        return _text;
    };

    return Crypt;
})();
