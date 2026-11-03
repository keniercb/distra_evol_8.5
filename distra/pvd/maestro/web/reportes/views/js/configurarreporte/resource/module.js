Ext.ns('Maestro.ConfigurarReporte.resource');

Maestro.ConfigurarReporte.resource.Module = Ext.extend(Ext.util.Observable, {
    baseUrl: '/pvd/maestro/reportes/index.php/configurarreportes/',
    insertModule: function (config) {
        var me = this;

        this.executeAction(
                'insertModule',
                Maestro.ConfigurarReporte.idiom.waitTextSaveDataModule,
                Maestro.ConfigurarReporte.idiom.successInsertModule,
                [
                    Maestro.ConfigurarReporte.idiom.failureInsertModuleExistIdentif,
                    Maestro.ConfigurarReporte.idiom.failureInsertModuleExistDenom,
                    Maestro.ConfigurarReporte.idiom.invalidArgument
                ],
                config
                );
    },
    updateModule: function (config) {
        var me = this;

        this.executeAction(
                'updateModule',
                Maestro.ConfigurarReporte.idiom.waitTextSaveDataModule,
                Maestro.ConfigurarReporte.idiom.successUpdateModule,
                [
                    Maestro.ConfigurarReporte.idiom.failureInsertModuleExistIdentif,
                    Maestro.ConfigurarReporte.idiom.failureUpdateModuleExistDenom,
                    Maestro.ConfigurarReporte.idiom.invalidArgument
                ],
                config
                );
    },
    deleteSelection: function (config) {
        var me = this,
                plural = !!config.msgPlural || false,
                questMsg = (plural) ?
                Maestro.ConfigurarReporte.idiom.questionDeleteModulePlural :
                Maestro.ConfigurarReporte.idiom.questionDeleteModuleSingular;

        mostrarMensaje(2, questMsg, function (buttonId) {
            if (buttonId == 'ok')
                me.deleteModule({
                    plural: plural,
                    params: me.getRecordsId(config.records || [], 'idmodulo'),
                    success: config.fn || null,
                    scope: config.scope || this
                });
        }, this);
    },
    deleteModule: function (config) {
        var me = this,
                msgSuccess = (config.plural) ?
                Maestro.ConfigurarReporte.idiom.successDeleteModulePlural :
                Maestro.ConfigurarReporte.idiom.successDeleteModuleSingular;

        this.executeAction(
                'deleteModule',
                Maestro.ConfigurarReporte.idiom.waitTextDeleteData,
                msgSuccess,
                [
                    Maestro.ConfigurarReporte.idiom.failureDeleteModuleInUse,
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
    getRecordsId: function (records, nameId) {
        var result = new Array();
        for (var i = 0; i < records.length; i++)
            result.push(records[i].get(nameId));
        return result;
    }
});