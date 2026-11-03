<?php

class DatActividadentidadprodcartatec extends BaseDatActividadentidadprodcartatec
{

    public function setUp()
    {
        parent::setUp();
    }

    public function EliminarPorIdActEnt($idsActividadesEntidades)
    {
        $query = Doctrine_Query::create();
        $query->delete('DatActividadentidadprodcartatec')
            ->from('DatActividadentidadprodcartatec')
            ->whereIn('idactividadentidad', $idsActividadesEntidades);
        return $query->execute();
    }

    public function EliminarPorIdAplicacion($idAplicacion)
    {
        $query = Doctrine_Query::create();
        $query->delete('DatActividadentidadprodcartatec')
            ->from('DatActividadentidadprodcartatec')
            ->addWhere('idaplicacioncartatec=?', array($idAplicacion));
        return $query->execute();
    }

    public function EliminarPorIdAplicacionIdActividadEnti($idAplicacion,
        $idactividaentidad
    ) 
    {
        $query = Doctrine_Query::create();
        $query->delete('DatActividadentidadprodcartatec')
            ->from('DatActividadentidadprodcartatec')
            ->addWhere(
                'idaplicacioncartatec=? AND idactividadentidad=?',
                array($idAplicacion, $idactividaentidad)
            );
        return $query->execute();
    }

    public function BuscarPorIdEntidadyAplicacion($idactividadentidad, $idaplicacion)
    {
        $query = Doctrine_Query::create();
        $query->from('DatActividadentidadprodcartatec')
            ->addwhere('idactividadentidad=?', $idactividadentidad)
            ->addwhere('idaplicacioncartatec=?', $idaplicacion);
        return $query->execute()->getFirst();
    }





}
