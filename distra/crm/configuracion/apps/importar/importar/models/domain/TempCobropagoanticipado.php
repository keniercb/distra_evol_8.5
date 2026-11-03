<?php

class TempCobropagoanticipado extends BaseTempCobropagoanticipado {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'NomDatosnomenclador', array('local' => 'iddatosnomenclador',
            'foreign' => 'iddatosnomenclador')
        );
    }

    public function getConceptos($iddatosnomaexcluir, $start = 0, $limit = 10000, $iscount = null
    ) {
        $query = Doctrine_Query::create();
        $query->from('TempCobropagoanticipado cpc')->addWhere(
                'cpc.iddatosnomenclador is null OR cpc.iddatosnomenclador <> ?', $iddatosnomaexcluir
        );

        $arrayobjstempInsactvs = array();
        if ($iscount) {
            return $query
                            ->select('COUNT(cpc.idcobroanticipado ) as total')
                            ->execute()->getFirst()->total;
        } else {
            $arrayparalelo = array();
            $arrayobjstempInsactvs = $query
                    ->orderby('cpc.numclienteproveedor')
                    ->offset($start)->limit($limit)
                    ->execute();


            $arraycodsactvs = array();
            foreach ($arrayobjstempInsactvs as $key => $valor) {
                $arraycodsactvs[] = $valor->codigo;
            }

        }
        return array($arrayobjstempInsactvs, $arrayparalelo);
    }

    public function obtenerDatosValidarCobroPagoAnticipado($ids, $start = 0, $limit = 5000)
    {
        $query = Doctrine_Query::create();
        $query->from('TempCobropagoanticipado cpc')
            ->addWhere('cpc.iddatosnomenclador is not null')
            ->whereNotIn('cpc.iddatosnomenclador', $ids
            );
        $arraycobro = array();
        $arraycobro = $query
            ->orderby('cpc.clienteproveedor')
            ->offset($start)->limit($limit)
            //->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $arraycobro;
    }

    public function obtenerDatosAdicionarCobroPagoAnticipado($ids, $iscount = null, $start = 0, $limit = 5000)
    {
        $query = Doctrine_Query::create();
        $query->from('TempCobropagoanticipado cpc')
            ->addWhere('cpc.iddatosnomenclador is not null')
            ->whereIn('cpc.iddatosnomenclador', $ids
            );

        $arraycobro = array();
        if ($iscount) {
            return $query
                ->select('COUNT(cpc.idcobroanticipado ) as total')
                ->execute()->getFirst()->total;
        } else {
            $arraycobro = $query
                ->orderby('cpc.clienteproveedor')
                ->offset($start)->limit($limit)
                //->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        }
        return $arraycobro;
    }

}
