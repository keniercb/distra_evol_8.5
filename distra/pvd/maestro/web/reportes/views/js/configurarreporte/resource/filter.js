Ext.ns('Maestro.ConfigurarReporte.resource');

Maestro.ConfigurarReporte.resource.Filter = Ext.extend( Ext.util.Observable, {
    baseUrl : '/pvd/maestro/reportes/index.php/configurarreportes/',
    insertFilter: function(config){
        var me = this;

        this.executeAction(
            'insertReporteFilter',
            Maestro.ConfigurarReporte.idiom.waitTextSaveDataFilter,
            Maestro.ConfigurarReporte.idiom.successInsertFilter,
            [
                Maestro.ConfigurarReporte.idiom.failureInsertFilterExistDenom,
                null,
                Maestro.ConfigurarReporte.idiom.invalidArgument
            ],
            config
        );
    },
    updateFilter: function(config){
        var me = this;

        this.executeAction(
            'updateReporteFilter',
            Maestro.ConfigurarReporte.idiom.waitTextSaveDataFilter,
            Maestro.ConfigurarReporte.idiom.successUpdateFilter,
            [
                Maestro.ConfigurarReporte.idiom.failureUpdateFilterExistDenom,
                null,
                Maestro.ConfigurarReporte.idiom.invalidArgument
            ],
            config
        );
    },
    deleteSelection: function(config){
        var me = this,
            plural = !!config.msgPlural || false,
            questMsg = (plural)?
                Maestro.ConfigurarReporte.idiom.questionDeleteFilterPlural:
                Maestro.ConfigurarReporte.idiom.questionDeleteFilterSingular;

        mostrarMensaje(2, questMsg, function(buttonId){
            if(buttonId == 'ok')
                me.deleteFilter({
                    plural: plural,
                    params: me.getRecordsId(config.records || [], 'idfiltro'),
                    success: config.fn || null,
                    scope: config.scope || this
                });
        }, this);
    },
    deleteFilter: function(config){
        var me = this,
            msgSuccess = (config.plural)?
                        Maestro.ConfigurarReporte.idiom.successDeleteFilterPlural:
                        Maestro.ConfigurarReporte.idiom.successDeleteFilterSingular;
                   
        this.executeAction(
            'deleteReporteFilter',
            Maestro.ConfigurarReporte.idiom.waitTextDeleteDataFilter,
            msgSuccess,
            [
                '',
                '',
                Maestro.ConfigurarReporte.idiom.invalidArgument
            ],
            config
        );
    },
    executeAction: function(url, waitMsg, msgSuccess, msgFailure, config){
        var me = this,
            maskId = Ext.id();

        PVD.mostrarMascara(
            maskId,
            Maestro.ConfigurarReporte.idiom.waitTitleSendData,
            waitMsg
        );

        Ext.Ajax.request({
            url : me.baseUrl+url,
            params : {values : Ext.encode(config.params)},
            method : 'POST',
            callback : function(opts, success, response){
                PVD.ocultarMascara(maskId);
                var responseData = Ext.decode(response.responseText),
                    msgType = (responseData.success)?1:3,
                    msg = (responseData.success)?msgSuccess:msgFailure[responseData.codigoMsg-1],
                    callbackFnName = (responseData.success)?'success':'failure';

                mostrarMensaje(msgType, msg);

                if(config[callbackFnName])
                    config[callbackFnName].apply( config.scope || me, [responseData]);
            },
        });
    },
    getRecordsId : function(records, nameId){
        var result = new Array();
        for(var i=0; i<records.length; i++)
            result.push(records[i].get(nameId));
        return result;
    }
});