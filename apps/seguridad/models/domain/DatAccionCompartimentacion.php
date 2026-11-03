<?php

/**
 * Clase dominio de DatAccionCompartimentacion.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class DatAccionCompartimentacion extends BaseDatAccionCompartimentacion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatAccion', 
            array('local' => 'idaccion', 'foreign' => 'idaccion')
        );
    }

    static public function obteneraccionesByIddominio($iddominio)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('idaccion id')
            ->from('DatAccionCompartimentacion')
            ->where("iddominio = ?", $iddominio)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    static public function eliminarAcciones($arrayAccEliminar, $iddominio)
    {
        $query = Doctrine_Query::create();
        $datos = $query->delete()
            ->from('DatAccionCompartimentacion a')
            ->where("a.iddominio = ?", $iddominio)
            ->whereIn('a.idaccion', $arrayAccEliminar)
            ->execute();
        return $datos;
    }

}