<?php

class TempUtiles extends BaseTempUtilesModImportar
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomDatosnomenclador', array('local' => 'iddatosnomenclador',
                'foreign' => 'iddatosnomenclador')
        );
    }

    function eliminarPostDatosConError()
    {
        $conn = Doctrine_Manager::connection();
        $sql = ' DELETE FROM mod_importar.temp_utiles';
        $resp = $conn->execute($sql);

        return true;
    }

    public function getConceptos($iddatosnomaexcluir, $start = 0, $limit = 10000, $iscount = null
    )
    {
        $query = Doctrine_Query::create();
        $query->from('TempUtiles c')->addWhere(
            'c.iddatosnomenclador is null OR c.iddatosnomenclador <> ?', $iddatosnomaexcluir
        );

        $arrayobjstempactivo = array();
        if ($iscount) {
            return $query
                ->select('COUNT(c.idutiles ) as total')
                ->execute()->getFirst()->total;
        } else {array();
            $arrayobjstempactivo = $query
                ->orderby('c.denomindicador')
                ->offset($start)->limit($limit)
                ->execute();
        }
        return array($arrayobjstempactivo);
    }

    public function obtenerDatosValidarUtiles($ids, $start = 0, $limit = 5000)
    {
        $query = Doctrine_Query::create();
        $query->from('TempUtiles c')
            ->addWhere('c.iddatosnomenclador is not null')
            ->whereNotIn('c.iddatosnomenclador', $ids
            );
        $arrayutiles= array();
        $arrayutiles = $query
            ->orderby('c.denomindicador')
            ->offset($start)->limit($limit)
            //->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $arrayutiles;
    }
    public function obtenerDatosAdicionarUtiles($ids, $iscount = null, $start = 0, $limit = 5000)
    {
        $query = Doctrine_Query::create();
        $query->from('TempUtiles c')
            ->addWhere('c.iddatosnomenclador is not null')
            ->whereIn('c.iddatosnomenclador', $ids
            );

        $arrayutiles = array();
        if ($iscount) {
            return $query
                ->select('COUNT(c.idutiles ) as total')
                ->execute()->getFirst()->total;
        } else {
            $arrayutiles = $query
                ->orderby('c.denomindicador')
                ->offset($start)->limit($limit)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        }
        return $arrayutiles;
    }

}
