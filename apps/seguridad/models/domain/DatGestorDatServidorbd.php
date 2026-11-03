<?php

/**
 * Clase dominio de Acciones.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class DatGestorDatServidorbd extends BaseDatGestorDatServidorbd
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatServidorbd', 
            array('local' => 'idservidor', 'foreign' => 'idservidor')
        );
        $this->hasOne(
            'DatGestor', 
            array('local' => 'idgestor', 'foreign' => 'idgestor')
        );
        $this->hasMany(
            'DatServidorDatGestorDatBd', 
            array('local' => 'idservidor', 'foreign' => 'idservidor')
        );
        $this->hasMany(
            'DatServidorDatGestorDatBd', 
            array('local' => 'idgestor', 'foreign' => 'idgestor')
        );
    }

    static function eliminargestorservidor($ideservidor, $idgestor)
    {
        try {
            $query = Doctrine_Query::create();
            $query->delete()->from('DatGestorDatServidorbd s')
                ->where(
                    "s.idgestor = ? and idservidor=?", 
                    array($idgestor, $ideservidor)
                )->execute();

            return true;
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    static public function comprobarservidor($idservidor)
    {
        try {
            $query = Doctrine_Query::create();
            $cant = $query->from('DatGestorDatServidorbd s')
                ->where("s.idservidor = ?", $idservidor)->execute()
                ->count();

            return $cant;
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    static public function obtenercantnomgest($idgestor)
    {
        try {
            $query = Doctrine_Query::create();
            $cantFndes = $query->from('DatGestor g,g.DatGestorDatServidorbd b')
                ->where("b.idgestor = ?", $idgestor)
                ->count();

            return $cantFndes;
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

}