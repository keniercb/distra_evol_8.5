/**
 * @Created por XETID-RRHH.
 * @Author: Ing. Miguel Antonio Cabreja Aldana
 * @Date: 17/12/2014
 * @Time: 8:47
 * @Version:1.0
 */
Ext.ns('PVD.WebSocket');
PVD.WebSocket.Conections = {
    /**
     * Psudo constructor singlenton
     * @param url  Direccíon física del servidor webSocket
     * @param prt  Protocolo de comunicacíon con el servidor
     * @param cmp  Componente de donde se instancia "puede ser null"
     * @returns {PVD.WebSocket.Conections}
     */
    init: function (url, prt, cmp) {
        this.conexion = false;
        if (url && prt) {
            this.ws = new WebSocket(url, prt);

        }
        /**
         *
         * @type {Function}
         */
        this.ws.onopen = function (e) {
            this.conexion = true;
        }.createDelegate(this);

        /**
         *
         * @type {Function}
         */
        this.ws.onmessage = function (e) {
            var jsonDecode = Ext.decode(e.data);
            var action = jsonDecode.action;
            var type = jsonDecode.type;
            var parameters = jsonDecode.parameters;

            var imgfinger = parameters[0].image;
            var quality = parameters[0].quality;
            var numdedo = parameters[0].numdedo;
            var iddedo = parameters[0].iddedo;
            var minutia = parameters[0].minutia;
            if (action == "capture" && type == "response") {

                if (imgfinger) {
                    if (cmp != null && quality) {
                        cmp.setImgHuella("data:image/jgp;base64," + imgfinger);
                        cmp.setImgDedo(numdedo, "data:image/jgp;base64," + imgfinger);
                        cmp.data.push({
                            'iddedo': iddedo,
                            'minutia': minutia,
                            'imagen': imgfinger,
                            'calidad': quality
                        });

                        mostrarMensaje(1, 'La calidad de la captura es de: ' + quality + '%');
                    }
                }
            }
            else if (action == "syncronice" && type == "response") {
                PVD.ocultarMascara('masksyncronice')
            } else if (action == "verify" && type == "response") {
                if (cmp != null) {
                    cmp.setImgActive("data:image/jgp;base64," + imgfinger);
                    var data = {
                        'idpersona': parameters[0].idpersona,
                        'iddedo': parameters[0].iddedo
                    }
                    cmp.searchPerson(data);
                }

            }


        }.createDelegate(this);

        return this;
    },
    setIntanceOf: function (newCmp) {
        this.init(null, null, newCmp);
    },
    /**
     *  Enviar dat
     * @param data
     */
    sendData: function (data) {
        if (this.ws.readyState === WebSocket.OPEN) {
            // The socket is open, so it is ok to send the data.
            this.ws.send(data);

        } else {
            // Do something else in this case.
            //Possibly ignore the data or enqueue it.
        }
    },
    /**
     *
     * @param msg
     */
    registerFinger: function (msg) {

        this.sendData(msg);
    }

}



