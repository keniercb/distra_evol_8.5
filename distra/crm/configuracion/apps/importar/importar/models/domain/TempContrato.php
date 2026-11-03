<?php

class TempContrato extends BaseTempContrato
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
        $sql = " DELETE FROM mod_importar.temp_contrato";
        $resp = $conn->execute($sql);

        return true;
    }

    public function getConceptos($iddatosnomaexcluir, $start = 0, $limit = 10000, $iscount = null
    )
    {
        $query = Doctrine_Query::create();
        $query->from('TempContrato c')->addWhere(
            'c.iddatosnomenclador is null OR c.iddatosnomenclador <> ?', $iddatosnomaexcluir
        );

        $arrayobjstempInsactvs = array();
        if ($iscount) {
            return $query
                ->select('COUNT(c.idcontrato ) as total')
                ->execute()->getFirst()->total;
        } else {array();
            $arrayobjstempInsactvs = $query
                ->orderby('c.nombrecliente')
                ->offset($start)->limit($limit)
                ->execute();
        }
        return array($arrayobjstempInsactvs);
    }

    public function obtenerDatosValidarContratos($ids, $start = 0, $limit = 5000)
    {
        $query = Doctrine_Query::create();
        $query->from('TempContrato c')
            ->addWhere('c.iddatosnomenclador is not null')
            ->whereNotIn('c.iddatosnomenclador', $ids
            );
        $arraycontratos = array();
        $arraycontratos = $query
            ->orderby('c.nombrecliente')
            ->offset($start)->limit($limit)
            //->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $arraycontratos;
    }
    public function obtenerDatosAdicionarContratos($ids, $iscount = null, $start = 0, $limit = 5000)
    {
        $query = Doctrine_Query::create();
        $query->from('TempContrato c')
            ->addWhere('c.iddatosnomenclador is not null')
            ->whereIn('c.iddatosnomenclador', $ids
            );

        $arraycontratos = array();
        if ($iscount) {
            return $query
                ->select('COUNT(c.idcontrato ) as total')
                ->execute()->getFirst()->total;
        } else {
            $arraycontratos = $query
                ->orderby('c.nombrecliente')
                ->offset($start)->limit($limit)
                //->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        }
        return $arraycontratos;
    }

}
