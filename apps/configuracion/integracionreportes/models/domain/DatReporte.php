<?php

class DatReporte extends BaseDatReporte
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomConfiguracionReporte',
            array('local' => 'idconfiguracion', 'foreign' => 'idconfiguracion')
        );
        $this->hasOne(
            'NomClasificacionReporte',
            array('local' => 'idclasificacion', 'foreign' => 'idclasificacion')
        );
    }

    public function obtenerReporteDadoId($idreporte)
    {
        try {
            $query = new Doctrine_Query();
            $result = $query->from('DatReporte r')
                ->innerJoin('r.NomConfiguracionReporte cr')
                ->where('r.idreporte = ?', $idreporte)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
            return $result[0];
        } catch (Exception $e) {
            print_r($e->getMessage());
            return -1;
        }
    }
}

//fin clase 
