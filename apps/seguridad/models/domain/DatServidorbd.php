<?php

/**
 * Clase dominio de Acciones.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 3.0.0
 */
class DatServidorbd extends BaseDatServidorbd
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatServidor',
            array('local' => 'idservidor', 'foreign' => 'idservidor')
        );
        $this->hasMany(
            'DatGestorDatServidorbd', 
            array('local' => 'idservidor', 'foreign' => 'idservidor')
        );
    }

    static public function obtenercantidad($idservidor)
    {
        try {
            $query = Doctrine_Query::create();
            $cantFndes = $query->from(
                'DatServidorbd b, b.DatGestorDatServidorbd g'
            )
                ->where("g.idservidor = ?", $idservidor)
                ->count();
            return $cantFndes;
        } catch (Doctrine_Exception $ee) {
            return false;
        }
    }

}