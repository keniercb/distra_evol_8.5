<?php

class TempCuentaclienteproveedor extends BaseTempCuentaclienteproveedor
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
        $query->from('TempCuentaclienteproveedor cpc')->addWhere(
            'cpc.iddatosnomenclador is null OR cpc.iddatosnomenclador <> ?', $iddatosexcluir
        );

        $arrayobjstempInsactvs = array();
        if ($iscount) {
            return $query
                ->select('COUNT(cpc.idcuentaclienteproveedor ) as total')
                ->execute()->getFirst()->total;
        } else {
            $arrayparalelo = array();
            $arrayobjstempInsactvs = $query
                ->orderby('cpc.codigo')
                ->offset($start)->limit($limit)
                ->execute();


            $arraycodsactvs = array();
            foreach ($arrayobjstempInsactvs as $key => $valor) {
                $arraycodsactvs[] = $valor->codigo;
            }

        }
        return array($arrayobjstempInsactvs, $arrayparalelo);
    }

    public function obtenerDatosAdicionarCuentaClienteProveedor($ids, $iscount = null, $start = 0, $limit = 5000)
    {
        $query = Doctrine_Query::create();
        $query->from('TempCuentaclienteproveedor tcp')
            ->addWhere('tcp.iddatosnomenclador is not null')
            ->whereIn('tcp.iddatosnomenclador', $ids
            );

        $arrayobjcuentaclientes = array();
        if ($iscount) {
            return $query
                ->select('COUNT(tcp.idcuentaclienteproveedor ) as total')
                ->execute()->getFirst()->total;
        } else {
            $arrayobjcuentaclientes = $query
                ->orderby('tcp.codigo')
                ->offset($start)->limit($limit)
                //->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        }
        return $arrayobjcuentaclientes;
    }

    public function obtenerDatosValidarCuentaClienteProveedor($ids, $start = 0, $limit = 5000)
    {
        $query = Doctrine_Query::create();
        $query->from('TempCuentaclienteproveedor tcp')
            ->addWhere('tcp.iddatosnomenclador is not null')
            ->whereNotIn('tcp.iddatosnomenclador', $ids
            );
        $arrayobjcuentaclientes = array();
        $arrayobjcuentaclientes = $query
            ->orderby('tcp.codigo')
            ->offset($start)->limit($limit)
            //->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $arrayobjcuentaclientes;
    }


}