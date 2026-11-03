Ext.define('CheckIntegrity.controller.CheckIntegrity', {
    extend: 'Ext.app.Controller',

    views: [
        'resultadosChequeo',
        'tabHistorial',
        'gridHistorial',
        'detallesHistorial'
    ],

    stores: [
        'StoreCheckIntegrity',
        'StoreHistorial'
    ],
    models: [
        'ModelCheckIntegrity',
        'ModelHistorial'
    ],

    init: function () {
        this.mascara;

        this.control({
            'resultadosChequeo button[action=comprobarIntegridad]': {
                click: this.comprobarIntegridad

            },
            'resultadosChequeo': {
                render: this.mostrarEstadoActualIntegridad
            },
            'gridHistorial': {
                itemclick: this.mostrarDetalles
            }

        });
    },

    //FUNCIONES PARA EVENTOS ------------------------------------------------------------------------------------------
    mostrarEstadoActualIntegridad: function (panel) {
        crearMascara(Zeolides.etiquetas.lbMsjMascaraCargarDatosIniciales);
        Ext.getStore('StoreCheckIntegrity').load(function (records) {
            if (!records[0].raw.estaInstaladoAIDE) {
                mostrarMensaje(3, Zeolides.etiquetas.lbMsjErrorAIDE);
            }
            else if (!records[0].raw.escaneoActivo) {
                mostrarMensaje(3, Zeolides.etiquetas.lbMsjErrorEscaneoInactivo);
            }
            else {

                if (records[0].raw.log)
                    cambiarEstado(panel, records[0].raw);
                else
                    mostrarMensaje(7, Zeolides.etiquetas.lbMsjInfoDatosIniciales);
                panel.setDisabled(false);
            }
            destruirMascara();
        });
    },
    comprobarIntegridad: function (button) {
        //máscara para evitar que vuelvan a enviar la petición
        crearMascara(Zeolides.etiquetas.lbMsjMascaraComprobar);

        var panel = button.up('panel');

        //TODO
        //Por la demora hay que hacerlo fuera de proceso con workers
        Ext.Ajax.request({
            url: 'comprobar',
            timeout: 600000,
            callback: function (options, success, response) {
                panel.up('viewport').down('gridHistorial').getStore('StoreCheckIntegrity').load();
                if (Ext.decode(response.responseText).datos)
                    cambiarEstado(panel, Ext.decode(response.responseText).datos);
                //Quitando la máscara
                destruirMascara();
            }
        });

    },
    mostrarDetalles: function (grid, record) {
        grid.up('tabHistorial').down('detallesHistorial').down('textarea').setValue(record.data.log)
    }
});

//FUNCIONES AUNXILIARES (REUTILIZABLES) ------------------------------------------------------------------------------------------
function cambiarEstado(panel, estadoIntegridad) {
    panel.down('textarea').setValue(estadoIntegridad.log);
    panel.down('label[action=fechaUltimoEscaneo]').setText(estadoIntegridad.fechaanalisis);

    if (estadoIntegridad.violacion) {
        panel.down('label[action=estadoIntegridad]').destroy();
        panel.down('toolbar').add({
            xtype: 'label',
            text: Zeolides.etiquetas.lbIntegridadComprometida,
            style: {
                color: "red",
                fontWeight: 'bold',
            },
            action: 'estadoIntegridad'
        });
    }
    else {
        panel.down('label[action=estadoIntegridad]').destroy();
        panel.down('toolbar').add({
            xtype: 'label',
            text: Zeolides.etiquetas.lbIntegridadCorrecta,
            style: {
                color: "green",
                fontWeight: 'bold',
            },
            action: 'estadoIntegridad'
        });
    }
}

function crearMascara(mensaje) {
    mascara = new Ext.LoadMask(Ext.getBody(), {msg: mensaje});
    mascara.show();
}

function destruirMascara() {
    mascara.destroy();
}



