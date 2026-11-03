<?php

/**
 * EstModel
 *
 * @author zcool
 * @package ConfiguraciÃ³n
 * @subpackage BancoSucursal/Models/Bussines
 * @copyright XETID
 * @version 1.0
 */
class SucursalModel extends ZendExt_Model
{

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->instance = new NomSucursal();
    }

    /**
     * Inserta una sucursal
     *
     * @param NomSucursal $obj Objeto sucursal
     *
     * @return bool
     */
    public function insertarNomSucursal(NomSucursal $obj)
    {
        try {
            $numero = $obj->numero;
            $direccion = $obj->direccion;
            $idbanco=$obj->idbanco;
           
            //$sucursal = $obj->buscarSucursal(array('numero' => $numero));
            //$sucursalDos = $obj->buscarSucursal(array('idbanco' => $idbanco));
             $sucursal = $obj->buscarSucursal(array('numero' => $numero,'idbanco' => $idbanco));
            // print_r($sucursal);die;
            if ($sucursal['cant'] == 0 /* && $sucursalDos['cant'] == 0*/) {
                $dm = Doctrine_Manager::getInstance();
                $cc = $dm->getCurrentConnection();
                $cc->beginTransaction();
                $obj->save();
                $cc->commit();
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $ee) {
            //print_r($ee->getMessage());die;
            return false;
        }
    }

    /**
     * Elimina una sucursal
     *
     * @param NomSucursal $obj Objeto sucursal
     *
     * @return bool|string
     */
    public function eliminarNomSucursal($obj)
    {
        try {
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            $obj->delete();
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $ee) {
            if ($ee->getCode() == 23503) {
                return '-4';
            }
        }
    }

    /**
     * Modifica una Sucursal
     *
     * @param NomSucursal $obj Objeto sucursal
     *
     * @return bool
     * @throws Doctrine_Exception|Exception
     */
    public function modificarNomSucursal($obj)
    {
        try {
            $numero = $obj->numero;
            $idbanco = $obj->idbanco;
            $idsucursal = $obj->idsucursal;
            $direccion = $obj->direccion;
            $metodo = $obj->metodo;

            //valid dice si el usuario valido o no o sea cuendo este en verdader enonces procedo
            $sucursal = $obj->buscarSucursal(array('numero' => $numero, 'idbanco' => $idbanco));
            $sucursalDos = $obj->buscarSucursal(array('direccion' => $direccion, 'idbanco' => $idbanco));

            $valid = self::isValidSucursalPorNumero($sucursal, $idsucursal);

            $validDos = self::isValidSucursalPorDir($sucursalDos, $idsucursal);

            if ($valid && $validDos) {
                $obj->numero = $numero;
                $obj->idbanco = $idbanco;
                $obj->idsucursal = $idsucursal;
                $obj->direccion = $direccion;
                $obj->metodo = $metodo;
                $obj->save();

                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Verifica la sucursal por direcciÃ³n
     *
     * @param $sucursalDos
     * @param int $idsucursal Identificador de sucursal
     *
     * @return bool
     */
    private function isValidSucursalPorDir($sucursalDos, $idsucursal)
    {
        $validDos = false;
        if ($sucursalDos['cant'] == 1 && $sucursalDos['datos'][0]['idsucursal'] == $idsucursal) {
            $validDos = true;
            return $validDos;
        } elseif (!$sucursalDos['cant']) {
            $validDos = true;
            return $validDos;
        }
        return $validDos;
    }

    /**
     * Verifica la sucursal por nÃºmero
     *
     * @param $sucursal
     * @param int $idsucursal Identificador de sucursal
     *
     * @return bool
     */
    private function isValidSucursalPorNumero($sucursal, $idsucursal)
    {
        $valid = false;
        if ($sucursal['cant'] == 1 && $sucursal['datos'][0]['idsucursal'] == $idsucursal) {
            $valid = true;
            return $valid;
        } elseif (!$sucursal['cant']) {
            $valid = true;
            return $valid;
        }
        return $valid;
    }

    /**
     * devuelve el dql pasado por parametros unido con la tabla nom_sucursal
     * @param Doctrine_Query $dql consulta en dql
     * @param string $asExt alias de la tabla que se une con nom_sucursal
     * @param string $asLoc alias de la tabla nom_sucursal
     * @param numeric $join Si se unen las tablas con innerjoin o leftjoin
     * @return Doctrine_Query
     */
    public function addQueryJoin($dql, $asExt, $asLoc = 'no', $join = 1)
    {
        if ($join == 1) {
            $dql->innerJoin("{$asExt}.NomSucursal {$asLoc}");
        } else {
            $dql->leftJoin("{$asExt}.NomSucursal {$asLoc}");
        }
        return $dql;
    }

    /**
     * devuelve el dql pasado por parametros unido con la tabla nom_sucursal
     * @param Doctrine_Query $dql consulta en dql
     * @param string $asLoc alias de la tabla nom_sucursal
     * @return Doctrine_Query
     */
    public function addQuerySelect($dql, $asLoc = 'nsuc')
    {
        $dql->addSelect("$asLoc.idsucursal AS idsucursal, $asLoc.numero AS numero, $asLoc.idbanco AS idbanco, $asLoc.metodo AS metodo");
        return $dql;
    }

}
