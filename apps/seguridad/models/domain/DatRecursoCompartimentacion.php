<?php

/**
 * Clase dominio de Recursos.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class DatRecursoCompartimentacion extends BaseDatRecursoCompartimentacion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatRecurso', 
            array('local' => 'idrecurso', 'foreign' => 'idrecurso')
        );
    }

    static public function obtenerRecursosByIddominio($iddominio)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('idrecurso id')
            ->from('DatRecursoCompartimentacion')
            ->where("iddominio = ?", $iddominio)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    static public function eliminarRecursos($arrayRecursosEl, $iddominio)
    {
        $query = Doctrine_Query::create();
        $datos = $query->delete()
            ->from('DatRecursoCompartimentacion r')
            ->where("r.iddominio = ?", $iddominio)
            ->whereIn('r.idrecurso', $arrayRecursosEl)
            ->execute();
        return $datos;
    }

}