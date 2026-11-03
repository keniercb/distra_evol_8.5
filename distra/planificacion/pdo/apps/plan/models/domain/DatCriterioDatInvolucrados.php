<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatCriterioDatInvolucrados extends BaseDatCriterioDatInvolucrados
{
    public function setUp()
    {
        parent::setUp();
    }

    public function Buscar($idCriterio, $idInvolucrado)
    {
        $query = new Doctrine_Query();
        $result = $query->from("DatCriterioDatInvolucrados")
            ->where(
                'idcriteriomedida = ?  AND idinvolucrado = ?',
                array($idCriterio, $idInvolucrado)
            )
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    // Buscar Relaciones Del Criterio Por Idinvolucrado
    public function BuscarRelacionesDelCriterioPorIdinvolucrado($idInvolucrado)
    {
        $query = new Doctrine_Query();
        $result = $query->from("DatCriterioDatInvolucrados")
            ->where('idinvolucrado = ?', array($idInvolucrado))
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function BuscarRelacionesDelCriterio($idCriterio)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->from("DatCriterioDatInvolucrados dcdi")
                ->where("dcdi.idcriteriomedida = $idCriterio")
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
            return $result;
        } catch (Doctrine_Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    public function EliminarRelacionesDelCriterio($idCriterio)
    {
        $query = new Doctrine_Query();
        /*$result =*/
        $query->delete("DatCriterioDatInvolucrados")
            ->from("DatCriterioDatInvolucrados dcdi")
            ->where("dcdi.idcriteriomedida = $idCriterio")
            ->execute();
    }

    public function EliminarRelacion($idCriterio, $idInvolucrado)
    {
        $query = new Doctrine_Query();
        /*$result =*/
        $query->delete("DatCriterioDatInvolucrados")
            ->from("DatCriterioDatInvolucrados dcdi")
            ->where(
                "dcdi.idcriteriomedida = $idCriterio and dcdi.idinvolucrado = $idInvolucrado"
            )
            ->execute();
    }

}//fin clase 



