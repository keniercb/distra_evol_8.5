<?php

require_once(Zend_Registry::get('config')->dir_aplication . "/configuracion/reportes/comun/ElementsReport.php");
require_once(
    Zend_Registry::get('config')->dir_aplication . "/configuracion/reportes/comun/IEStrategyAdicionalPages.php");
require_once(Zend_Registry::get('config')->dir_aplication . "/configuracion/reportes/comun/IEStrategyColumns.php");
require_once(Zend_Registry::get('config')->dir_aplication . "/configuracion/reportes/comun/IEStrategyColumnsGrow.php");
require_once(Zend_Registry::get('config')->dir_aplication . "/configuracion/reportes/comun/IEStrategySummary.php");
require_once(Zend_Registry::get('config')->dir_aplication . "/configuracion/reportes/comun/IEStrategySetSummary.php");

class FactoryReportConfGnral
{

    public static function Create($argCase)
    {
        print_r($argCase);die;
        print('/*que bola*/');die;
        switch ($argCase) {
            case '20001' :
                self::getRpt("/configuracion/reportes/models/Especialidad/RptEspecialidad.php");
                return new RptEspecialidad();
            case '20002' :
                self::getRpt("/configuracion/reportes/models/ParrafoFiscal/RptParrafoFiscal.php");
                return new RptParrafoFiscal();
            case '20003' :
                self::getRpt("/configuracion/reportes/models/NomPais/RptNomPais.php");
                return new RptNomPais();
            case '20004' :
                self::getRpt("/configuracion/reportes/models/NomMoneda/RptNomMoneda.php");
                return new RptNomMoneda();
            case '20005' :
                self::getRpt("/configuracion/reportes/models/NomClienteProveedor/RptNomClienteProveedor.php");
                return new RptNomClienteProveedor();
            case '20006' :
                self::getRpt("/configuracion/reportes/models/UnidadMedida/RptUnidadMedida.php");
                return new RptUnidadMedida();
            case '20007' :
                self::getRpt("/configuracion/reportes/models/BancoSucursal/RptBancoSucursal.php");
                return new RptBancoSucursal();
            default :
                die('CONFIGURE CORRECTAMENTE EL REPORTE');
        }
    }

    public static function getRpt($argPathRpt)
    {
        if (file_exists(Zend_Registry::get('config')->dir_aplication . $argPathRpt)) {
            require_once(Zend_Registry::get('config')->dir_aplication . $argPathRpt);
        } else {
            die("<b>ERROR</b>: EL MODELO DE ESTE REPORTE NO HA SIDO ENCONTRADO.</br> <b>RUTA</b>:  $argPathRpt </br>");
        }
    }

}