<?php

class NomClasificacionReporte extends BaseNomClasificacionReporte
{

    public function setUp()
    {
        parent::setUp();
    }

    public function obtenerClasificacionDadoId($idclasificacion)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->from('NomClasificacionReporte cr')
                ->where('cr.idclasificacion = ?', $idclasificacion)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
            return $result[0];
        } catch (Exception $e) {
            echo($e->getMessage());
            return -1;
        }
    }

    public function obtenerDatosClasificacionReporte($idreporte)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->select('r.idreporte, cr .idclasificacion')
                ->from('DatReporte r')
                ->innerJoin('r.NomClasificacionReporte cr')
                ->where("r.idreporte = $idreporte")
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
            //$temp = $query->getSqlQuery();
            return $result[0];
        } catch (Exception $e) {
            echo($e->getMessage());
            return -1;
        }
    }

}

//fin clase 
