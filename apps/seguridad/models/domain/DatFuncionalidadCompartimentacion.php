<?php

/**
 * Clase dominio de Acciones.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class DatFuncionalidadCompartimentacion 
extends BaseDatFuncionalidadCompartimentacion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatFuncionalidad', 
            array('local' => 'idfuncionalidad', 'foreign' => 'idfuncionalidad')
        );
    }

    static public function obtenerfuncionalidadesByIddominio($iddominio)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('idfuncionalidad id')
            ->from('DatFuncionalidadCompartimentacion')
            ->where("iddominio = ?", $iddominio)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    static public function eliminarFuncionalidades(
        $arrayFuncEliminar, $iddominio
    )
    {
        $query = Doctrine_Query::create();
        $datos = $query->delete()
            ->from('DatFuncionalidadCompartimentacion f')
            ->where("f.iddominio = ?", $iddominio)
            ->whereIn('f.idfuncionalidad', $arrayFuncEliminar)
            ->execute();
        return $datos;
    }

}