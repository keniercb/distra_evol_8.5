<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

class EstructuraUbicacionService extends ZendExt_Model
{

    public function __construct()
    {
        parent::ZendExt_Model();
        if (class_exists('AutoLoadPath')) {
            $autoLoad = AutoLoadPath::getInstance();
            $autoLoad->IncludePathModule(
                LogisticaDefine::_INVENTARIO_SUBSYSTEM_,
                LogisticaDefine::_CONFIGURACION_MODULE_
            );
        }
    }

    public static function gestestructubicacion()
    {
        $dirController
        = '/logistica/utiles/index.php/'
                .'gestestructubicacion/gestestructubicacion';
        header("Location: $dirController");
    }

    public function getTreeTipoCombustible(
        $subsistema, $iddeposito, $pos, $idarea,
        $idestructuraubic, $nivel, $apertura, $idoperacion, $idproducto, $variable
    )
    {
        return GestestructubicacionModel::getTreeTipoCombustible(
            $subsistema, $iddeposito, $pos, $idarea, $idestructuraubic, $nivel, $apertura,
            $idoperacion, $idproducto, $variable
        );
    }

    public function obtenerAreasDadoDeposito($iddeposito, $operaciones)
    {
        $areas = DatEstructuraubicacion::obtenerAreasDep(
            $iddeposito,
            $operaciones
        );
        return $areas;
    }

    public function obtenerAreasxTipoareas($arrTipoareas, $iddeposito)
    {
        $areas = DatArea::obtenerAreasxTipoareas($arrTipoareas, $iddeposito);
        return $areas;
    }

    public function devolverArea($idarea)
    {
        $area = DatArea::devolverArea($idarea);
        if (!$area) {
            return false;
        }
        return $area;
    }

    public function cargararbolArea($objArr)
    {
        return GestestructubicacionModel::cargararbolArea($objArr);
    }

    public function obtenerDatosVentanaDisponible(
        $iddeposito, $idmovimiento,$idoperacion, $idproducto, $idlotebulto, $limit, $start,
        $isdespacho, $onlyidarea, $iddocumento, $idcliente
    )
    {
        $datos[0] = GestestructubicacionModel::obtenerDatosVentanaDisponible(
            $iddeposito,
            $idmovimiento, $idoperacion, $idproducto, $idlotebulto,
            $limit, $start, $isdespacho, $onlyidarea, $iddocumento,
            $idcliente
        );
        $arrAreas = ZendExt_ClassStandard::ArrayObject($datos);
        return $arrAreas[0];
    }

    /*
      @javico
      Servicio que devuelve las areas por el idtipoarea
      Falta hacerlo con el idoperacion
     */

    public function getAreas($obj)
    {
        return GestareaModel::getAreas($obj);
    }

    //lo devuelve por el tipo de area puesto en el nomenclador tipo de area, 
    //es decir, por el campo nacionalexportacion(id fijos)
    public function getAreasXTipoA($nacionalexportacion)
    {
        return GestareaModel::getAreasXTipoA($nacionalexportacion);
    }

    public function getEstrucUbic($idestubic)
    {
        return GestestructubicacionModel::getEstrucUbic($idestubic);
    }

    public function getJsWinEstructUbic()
    {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirPhtml = $dirApps
            . '/logistica/utiles/configuracion/views/scripts/'
            . 'configlogistica/estructuraubicacionService.phtml';
        return file_get_contents($dirPhtml);
    }

}
