<?php

/**
 * Clase modelo <b>Historial de cuentas</b>.
 *
 * @author     Ing. Maikel Garcia Valdes
 * @package    Configuración
 * @subpackage Multimoneda/Models/Bussines
 * @copyright  XETID
 * @version    1.0-0
 */
class HistasaModel extends ZendExt_Model
{
    /**
     * Inicializa el padre
     */
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    /**
     * Adiciona un historial de tasa
     *
     * @param mixed $obj Historial a ser adicionado
     *
     * @return boolean
     * @throws ZendExt_Exception
     */
    public function insertarHisTasa($obj)
    {
        try {
            $obj->save();
            return true;
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF15', $ee);
        }
    }

    /**
     * Elimina un historial de tasa
     *
     * @param HisTasa $objHisTasa Historial a ser eliminado
     *
     * @return boolean
     * @throws Doctrine_Exception
     */
    static public function eliminarHisTasa(HisTasa $objHisTasa)
    {
        $dm = Doctrine_Manager::getInstance();
        $cc = $dm->getCurrentConnection();
        try {
            $cc->beginTransaction();
            $objHisTasa->delete();
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $ee) {
            $cc->rollback();
            throw $ee;
        }
    }

}