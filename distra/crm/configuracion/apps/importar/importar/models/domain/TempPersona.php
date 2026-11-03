<?php

class TempPersona extends BaseTempPersona
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomDatosnomenclador', array('local' => 'iddatosnomenclador',
                'foreign' => 'iddatosnomenclador')
        );
    }

    public function getConceptos($iddatosexcluir, $start = 0, $limit = 5000, $iscount = null
    )
    {
        $query = Doctrine_Query::create();
        $query->from('TempPersona cpc')->addWhere(
            'cpc.iddatosnomenclador is null OR cpc.iddatosnomenclador <> ?', $iddatosexcluir
        );

        $arrayobjtemppersona = array();
        if ($iscount) {
            return $query
                ->select('COUNT(cpc.idpersona ) as total')
                ->execute()->getFirst()->total;
        } else {
            $arrayparalelo = array();
            $arrayobjtemppersona = $query
                ->orderby('cpc.nombre')
                ->offset($start)->limit($limit)
                ->execute();


            $arraycodsactvs = array();
            foreach ($arrayobjtemppersona as $key => $valor) {
                $arraycodsactvs[] = $valor->codigo;
            }

        }
        return array($arrayobjtemppersona, $arrayparalelo);
    }

    public function obtenerDatosAdicionarPersona($ids, $iscount = null, $start = 0, $limit = 5000)
    {
        $query = Doctrine_Query::create();
        $query->from('TempPersona tcp')
            ->addWhere('tcp.iddatosnomenclador is not null')
            ->whereIn('tcp.iddatosnomenclador', $ids
            );

        $arrayobjpersona = array();
        if ($iscount) {
            return $query
                ->select('COUNT(tcp.idpersona ) as total')
                ->execute()->getFirst()->total;
        } else {
            $arrayobjpersona = $query
                ->orderby('tcp.nombre')
                ->offset($start)->limit($limit)
                //->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        }
        return $arrayobjpersona;
    }

    public function obtenerDatosValidarPersona($ids, $start = 0, $limit = 5000)
    {
        $query = Doctrine_Query::create();
        $query->from('TempPersona tcp')
            ->addWhere('tcp.iddatosnomenclador is not null')
            ->whereNotIn('tcp.iddatosnomenclador', $ids
            );
        $arrayobjpersona = array();
        $arrayobjpersona = $query
            ->orderby('tcp.nombre')
            ->offset($start)->limit($limit)
            //->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $arrayobjpersona;
    }

    public function verificarExisteExpedienteFar()
    {
        $query = Doctrine_Query::create();
        $result = $query->select('tcp.idpersona, tcp.expedientefar')
            ->from('TempPersona tcp')
            ->Where("nullif(trim(tcp.expedientefar),'') IS NOT NULL")
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    private function actualizarEstadosPersona($conn, $array_update, $array_ests_dnom)
    {
        foreach ($array_update as $key => $valor) {
            if ($array_update[$key][0] != null) {
                $conn->execute(
                    "UPDATE mod_importar.temp_persona SET iddatosnomenclador = ? WHERE idpersona IN ("
                    . implode(",", $array_update[$key]) . ")", array($array_ests_dnom[$key])
                );
            }
        }
    }
}