<?php

/**
 * Servicios asociados a  Bancos y Sucursales
 *
 * @package Servicios
 * @subpackage Configuración/BancoSucursal
 * @copyright XETID
 * @version 1.0
 */
class BancosService extends ZendExt_Model
{

    /**
     * Obtiene todos los bancos
     *
     * @return array
     */
    public function obtenerBancos()
    {
        $bancos = NomBanco::buscarBanco();
        if (!$bancos['cant']) {
            return array();
        }
        $standard = new ZendExt_ClassStandard();
        return $standard->ArrayObject($bancos['datos']);
    }

    /**
     * Obtiene las sucursales asociadas a un banco
     *
     * @param int $idbanco Identificador de banco
     *
     * @return array
     */
    public function obtenerSucursales($idbanco)
    {
        $sucursales = NomSucursal::buscarSucursal(array('idbanco' => $idbanco));
        if (!$sucursales['cant']) {
            return array();
        }
        $standard = new ZendExt_ClassStandard();
        return $standard->ArrayObject($sucursales['datos']);
    }

    /**
     * Obtiene un banco por su ID
     *
     * @param int $idbanco Identificador de banco
     *
     * @return stdClass|object
     */
    public function obtenerBancoPorId($idbanco)
    {
        $banco = NomBanco::buscarBanco(array('idbanco' => $idbanco));
        if (!$banco['cant']) {
            return new stdClass();
        }
        $standard = new ZendExt_ClassStandard();
        return $standard->Object($banco['datos']);
    }

    /**
     * Obtiene un sucursal por su ID
     *
     * @param int $idsucursal Identificador de Sucursal
     *
     * @return stdClass|object
     */
    public function obtenerSucursalPorId($idsucursal)
    {
        $sucursal = NomSucursal::buscarSucursal(array('idsucursal' => $idsucursal));
        if (!$sucursal['cant']) {
            return new stdClass();
        }
        $standard = new ZendExt_ClassStandard();
        return $standard->Object($sucursal ['datos']);
    }

    /**
     * Obtiene los bancos con sucursal(es)
     *
     * @return array
     */
    public function obtenerBancosConSucursales()
    {
        $bancos = NomBanco::buscarBancoConSucursal();
        if (!$bancos['cant']) {
            return array();
        }
        foreach ($bancos['datos'] as $banco) {
            unset($banco['NomSucursal']);
        }
        $standard = new ZendExt_ClassStandard();
        return $standard->ArrayObject($bancos['datos']);
    }

    /**
     * devuelve el dql pasado por parametros unido con la tabla nom_banco
     * @param Doctrine_Query $dql consulta en dql
     * @param string $asExt alias de la tabla que se une con nom_banco
     * @param string $asLoc alias de la tabla nom_banco
     * @param numeric $join Si se unen las tablas con innerjoin o leftjoin
     * @return Doctrine_Query
     */
    public function addQueryJoin($dql, $asExt, $asLoc = 'no', $join = 1)
    {
        if(!empty($dql) && !empty($asExt)){

            if (!class_exists('NomBanco')) {
                $this->includeBancoSucursalesModels();
            }

            $model = new BancoModel();
            return $model->addQueryJoin($dql, $asExt, $asLoc, $join);
        }
        return -1;
    }

    /**
     * devuelve el dql pasado por parametros unido con la tabla nom_banco
     * @param Doctrine_Query $dql consulta en dql
     * @param string $asLoc alias de la tabla nom_banco
     * @return Doctrine_Query
     */
    public function addQuerySelect($dql, $asLoc = 'no')
    {
        if(!empty($dql)){
            if (!class_exists('NomBanco')) {
                $this->includeBancoSucursalesModels();
            }
            $model = new BancoModel();
            return $model->addQuerySelect($dql,$asLoc);
        }
        return -1;
    }

    /**
     * devuelve el dql pasado por parametros unido con la tabla nom_sucursal
     * @param Doctrine_Query $dql consulta en dql
     * @param string $asExt alias de la tabla que se une con nom_sucursal
     * @param string $asLoc alias de la tabla nom_sucursal
     * @param numeric $join Si se unen las tablas con innerjoin o leftjoin
     * @return Doctrine_Query
     */
    public function addQueryJoinSucursal($dql, $asExt, $asLoc = 'no', $join = 1)
    {
        if(!empty($dql) && !empty($asExt)){
            if (!class_exists('NomSucursal')) {
                $this->includeBancoSucursalesModels(true);
            }
            $model = new SucursalModel();
            return $model->addQueryJoin($dql, $asExt, $asLoc, $join);
        }
        return -1;
    }

    /**
     * devuelve el dql pasado por parametros unido con la tabla nom_sucursal
     * @param Doctrine_Query $dql consulta en dql
     * @param string $asLoc alias de la tabla nom_sucursal
     * @return Doctrine_Query
     */
    public function addQuerySelectSucursal($dql, $asLoc = 'no')
    {
        if(!empty($dql)){
            if (!class_exists('NomSucursal')) {
                $this->includeBancoSucursalesModels(true);
            }
            $model = new SucursalModel();
            return $model->addQuerySelect($dql,$asLoc);
        }
        return -1;
    }

    private function includeBancoSucursalesModels($sucurFlag = false){
        $domainName = !$sucurFlag ? 'NomBanco' : 'NomSucursal';
        $base_path = Zend_Registry::getInstance()->get('config')->dir_aplication . '/configuracion/';
        require_once $base_path . 'bancos/models/domain/generated/Base'. $domainName .'.php';
        require_once $base_path . 'bancos/models/domain/'. $domainName .'.php';
    }

}