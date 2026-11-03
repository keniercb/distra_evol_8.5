<?php

/**
 * EstModel
 *
 * @author zcool
 * @package Configuración
 * @subpackage BancoSucursal/Models/Bussines
 * @copyright XETID
 * @version 1.0
 */
class BancoModel extends ZendExt_Model
{

    public function __construct()
    {
        parent::ZendExt_Model();
    }

    /**
     * Inserta un Banco
     *
     * @param NomBanco $obj
     *
     * @return bool
     */
    public function insertarNomBanco($obj)
    {

        try {
            $found = $obj->buscarBanco(array('codigo' => $obj->codigo, 'nombre' => $obj->nombre));
            if ($found['cant'] == 0) {
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    /**
     * Elimina un banco
     *
     * @param NomBanco $obj
     *
     * @return bool
     */
    public function eliminarNomBanco($obj)
    {
        try {
            $objNomBanco = new NomBanco();
            if (!$objNomBanco->verificarBancoConSucursal($obj->idbanco)) {
                $obj->delete();
                return true;
            } else {
                //$objSucMod = new SucursalModel();
                $objNomsucursal = new NomSucursal();
                $sucursales = $objNomsucursal->buscarSucursalesByIdBanco($obj->idbanco);
                $idsSucursales = $sucursales->toArray();
                foreach ($idsSucursales as $idsucursal) {
                    $objSucursal = Doctrine::getTable('NomSucursal')->find($idsucursal['idsucursal']);
                    $objSucursal->delete();
                }
                $obj->delete();
                return true;
            }
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    /**
     * Modifica un banco
     *
     * @param NomBanco $obj
     *
     * @return bool
     */
    public function modificarNomBanco($obj)
    {
        try {
            $idbanco = $obj->idbanco;
            $codigo = $obj->codigo;
            $nombre = $obj->nombre;
            //$metodo = $obj->metodo;
            $abreviatura = $obj->abreviatura;
            $codexist = $obj->buscarBanco(array('codigo' => $codigo));
            $nombexist = $obj->buscarBanco(array('nombre' => $nombre));
            $validcodigo = self::isValidCode($codexist, $idbanco);
            $validnombre = self::isValidName($nombexist, $idbanco);
            if ($validcodigo && $validnombre) {
                $obj->idbanco = $idbanco;
                $obj->codigo = $codigo;
                $obj->nombre = $nombre;
                //$obj->metodo = $metodo;
                $obj->abreviatura = $abreviatura;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

    /**
     * Verifica el nombre
     *
     * @param string $nombexist nombre
     * @param int    $idbanco   Identificador de banco
     *
     * @return bool
     */
    private function isValidName($nombexist, $idbanco)
    {
        $validnombre = false;
        //si manuve el nombre
        if ($nombexist['cant'] == 1 && $nombexist['datos'][0]['idbanco'] == $idbanco) {
            $validnombre = true;
            return $validnombre;
        } elseif ($nombexist['cant'] == 0) { //si no hay nadie con ese nombre
            $validnombre = true;
            return $validnombre;
        }
        return $validnombre;
    }

    /**
     * Verifica el código
     *
     * @param string $nombexist nombre
     * @param int    $idbanco   Identificador de banco
     *
     * @return bool
     */
    private function isValidCode($codexist, $idbanco)
    {
        $validcodigo = false;
        //-presenta problema cuando modifico para otro que ya existe
        //si mantuve el codigo
        if ($codexist['cant'] == 1 && $codexist['datos'][0]['idbanco'] == $idbanco) {
            $validcodigo = true;
            return $validcodigo;
        } elseif ($codexist['cant'] == 0) { //si no hay nadie con ese codigo
            $validcodigo = true;
            return $validcodigo;
        }
        return $validcodigo;
    }

    /**
     * Verifica la existencia de un banco
     *
     * @param NomBanco $obj
     *
     * @return bool
     */
    public function verificarExisteBanco($obj)
    {
        $nombre = $obj->nombre;
        $codigo = $obj->codigo;
        $existe = $obj->verificarExisteBanco($codigo, $nombre);

        if ($existe > 0) {
            return true;
        }
        return false;
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
        if ($join == 1) {
            $dql->innerJoin("{$asExt}.NomBanco {$asLoc}");
        } else {
            $dql->leftJoin("{$asExt}.NomBanco {$asLoc}");
        }
        return $dql;
    }

    /**
     * devuelve el dql pasado por parametros unido con la tabla nom_banco
     * @param Doctrine_Query $dql consulta en dql
     * @param string $asLoc alias de la tabla nom_banco
     * @return Doctrine_Query
     */
    public function addQuerySelect($dql, $asLoc = 'ba')
    {
        $dql->addSelect("$asLoc.idbanco AS idbanco, $asLoc.codigo AS codigo, $asLoc.nombre AS nombre, $asLoc.abreviatura AS abreviatura");
        return $dql;
    }

}