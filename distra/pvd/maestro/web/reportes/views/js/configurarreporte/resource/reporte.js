Ext.ns('Maestro.ConfigurarReporte.resource');

Maestro.ConfigurarReporte.resource.Reporte = Ext.extend(Ext.util.Observable, {
    baseUrl: '/pvd/maestro/reportes/index.php/configurarreportes/',
    insertReporte: function (config) {
        var me = this;

        this.executeAction(
                'insertReporte',
                Maestro.ConfigurarReporte.idiom.waitTextSaveDataReporte,
                Maestro.ConfigurarReporte.idiom.successInsertReporte,
                [
                    Maestro.ConfigurarReporte.idiom.failureInsertReporteExistIdentif,
                    Maestro.ConfigurarReporte.idiom.failureInsertReporteExistDenom,
                    Maestro.ConfigurarReporte.idiom.invalidArgument
                ],
                config
                );
    },
    updateReporte: function (config) {
        var me = this;

        this.executeAction(
                'updateReporte',
                Maestro.ConfigurarReporte.idiom.waitTextSaveDataReporte,
                Maestro.ConfigurarReporte.idiom.successUpdateReporte,
                [
                    Maestro.ConfigurarReporte.idiom.failureInsertReporteExistIdentif,
                    Maestro.ConfigurarReporte.idiom.failureUpdateReporteExistDenom,
                    Maestro.ConfigurarReporte.idiom.invalidArgument
                ],
                config
                );
    },
    deleteSelection: function (config) {
        var me = this,
                questMsg = Maestro.ConfigurarReporte.idiom.questionDeleteReporte;

        mostrarMensaje(2, questMsg, function (buttonId) {
            if (buttonId == 'ok')
                me.deleteReporte({
                    params: (config.records) ? config.records.attributes.idreporte : 0,
                    success: config.fn || null,
                    scope: config.scope || this
                });
        }, this);
    },
    deleteReporte: function (config) {
        var me = this,
                msgSuccess = Maestro.ConfigurarReporte.idiom.successDeleteReporte;

        this.executeAction(
                'deleteReporte',
                Maestro.ConfigurarReporte.idiom.waitTextDeleteDataReporte,
                msgSuccess,
                [
                    '',
                    '',
                    Maestro.ConfigurarReporte.idiom.invalidArgument
                ],
                config
                );
    },
    activeSelection: function (config) {
        var me = this,
                questMsg = Maestro.ConfigurarReporte.idiom.questionActivarReporte;

        mostrarMensaje(2, questMsg, function (buttonId) {
            if (buttonId == 'ok')
                me.activeReporte({
                    params: (config.records) ? config.records.attributes.idreporte : 0,
                    success: config.fn || null,
                    scope: config.scope || this
                });
        }, this);
    },
    activeReporte: function (config) {
        var me = this,
                msgSuccess = Maestro.ConfigurarReporte.idiom.successActivarReporte;

        this.executeAction(
                'activeReporte',
                Maestro.ConfigurarReporte.idiom.waitTextActivarReporte,
                msgSuccess,
                [
                    '',
                    '',
                    Maestro.ConfigurarReporte.idiom.invalidArgument
                ],
                config
                );
    },
    deactiveSelection: function (config) {
        var me = this,
                questMsg = Maestro.ConfigurarReporte.idiom.questionDesActivarReporte;

        mostrarMensaje(2, questMsg, function (buttonId) {
            if (buttonId == 'ok')
                me.deactiveReporte({
                    params: (config.records) ? config.records.attributes.idreporte : 0,
                    success: config.fn || null,
                    scope: config.scope || this
                });
        }, this);
    },
    deactiveReporte: function (config) {
        var me = this,
                msgSuccess = Maestro.ConfigurarReporte.idiom.successDesActivarReporte;

        this.executeAction(
                'deactiveReporte',
                Maestro.ConfigurarReporte.idiom.waitTextDesActivarReporte,
                msgSuccess,
                [
                    '',
                    '',
                    Maestro.ConfigurarReporte.idiom.invalidArgument
                ],
                config
                );
    },

    executeAction: function (url, waitMsg, msgSuccess, msgFailure, config) {
        var me = this,
                maskId = Ext.id();

        PVD.mostrarMascara(
                maskId,
                Maestro.ConfigurarReporte.idiom.waitTitleSendData,
                waitMsg
                );

        Ext.Ajax.request({
            url: me.baseUrl + url,
            params: {values: Ext.encode(config.params)},
            method: 'POST',
            callback: function (opts, success, response) {
                PVD.ocultarMascara(maskId);
                var responseData = Ext.decode(response.responseText),
                        msgType = (responseData.success) ? 1 : 3,
                        msg = (responseData.success) ? msgSuccess : msgFailure[responseData.codigoMsg - 1],
                        callbackFnName = (responseData.success) ? 'success' : 'failure';

                mostrarMensaje(msgType, msg);

                if (config[callbackFnName])
                    config[callbackFnName].apply(config.scope || me, [responseData]);
            },
        });
    },
});