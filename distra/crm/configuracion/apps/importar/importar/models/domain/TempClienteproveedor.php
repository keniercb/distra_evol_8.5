<?php

class TempClienteproveedor extends BaseTempClienteproveedor
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
        $query->from('TempClienteproveedor cpc')->addWhere(
            'cpc.iddatosnomenclador is null OR cpc.iddatosnomenclador <> ?', $iddatosexcluir
        );

        $arrayobjstempInsactvs = array();
        if ($iscount) {
            return $query
                ->select('COUNT(cpc.idclienteproveedor ) as total')
                ->execute()->getFirst()->total;
        } else {
            $arrayparalelo = array();
            $arrayobjstempInsactvs = $query
                ->orderby('cpc.nombre')
                ->offset($start)->limit($limit)
                ->execute();


            $arraycodsactvs = array();
            foreach ($arrayobjstempInsactvs as $key => $valor) {
                $arraycodsactvs[] = $valor->codigo;
            }

        }
        return array($arrayobjstempInsactvs, $arrayparalelo);
    }

    public function obtenerDatosAdicionarClienteProveedor($ids, $iscount = null, $start = 0, $limit = 5000)
    {
        $query = Doctrine_Query::create();
        $query->from('TempClienteproveedor tcp')
            ->addWhere('tcp.iddatosnomenclador is not null')
            ->whereIn('tcp.iddatosnomenclador', $ids
            );

        $arrayobjclientes = array();
        if ($iscount) {
            return $query
                ->select('COUNT(tcp.idclienteproveedor ) as total')
                ->execute()->getFirst()->total;
        } else {
            $arrayobjclientes = $query
                ->orderby('tcp.nombre')
                ->offset($start)->limit($limit)
                //->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        }
        return $arrayobjclientes;
    }

    public function obtenerDatosValidarClienteProveedor($ids, $start = 0, $limit = 5000)
    {
        $query = Doctrine_Query::create();
        $query->from('TempClienteproveedor tcp')
            ->addWhere('tcp.iddatosnomenclador is not null')
            ->whereNotIn('tcp.iddatosnomenclador', $ids
            );
        $arrayobjclientes = array();
        $arrayobjclientes = $query
            ->orderby('tcp.nombre')
            ->offset($start)->limit($limit)
            //->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $arrayobjclientes;
    }

    public function obtenerDatosValidarClienteProveedor2($ids, $start = 0, $limit = 5000)
    {
        $cadena = 'SELECT *
                    FROM mod_importar.temp_clienteproveedor cp
                    WHERE (cp.iddatosnomenclador is not null AND cp.iddatosnomenclador <>' . $ids[0] . ' AND cp.iddatosnomenclador <>' . $ids[1] . ')';
        $cadena .= ' LIMIT(' . $limit . ') OFFSET(' . $start . ') ';
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    private function actualizarEstadosClienteProveedor($conn, $array_update, $array_ests_dnom)
    {
        foreach ($array_update as $key => $valor) {
            if ($array_update[$key][0] != null) {
                $conn->execute(
                    "UPDATE mod_importar.temp_clienteproveedor SET iddatosnomenclador = ? WHERE idclienteproveedor IN ("
                    . implode(",", $array_update[$key]) . ")", array($array_ests_dnom[$key])
                );
            }
        }
    }
}