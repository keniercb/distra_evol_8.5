<?php

/**
 * Clase dominio de DatSistemaCompartimentacion.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class DatSistemaCompartimentacion extends BaseDatSistemaCompartimentacion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatSistema',
            array('local' => 'idsistema', 'foreign' => 'idsistema')
        );
    }

    static public function obtenerSistemasByIddominio($iddominio)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('idsistema id')
            ->from('DatSistemaCompartimentacion')
            ->where("iddominio = ?", $iddominio)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    static public function eliminarSistemas($arraySistEliminar, $iddominio)
    {
        $query = Doctrine_Query::create();
        $datos = $query->delete()
            ->from('DatSistemaCompartimentacion s')
            ->where("s.iddominio = ?", $iddominio)
            ->whereIn('s.idsistema', $arraySistEliminar)
            ->execute();
        return $datos;
    }

}