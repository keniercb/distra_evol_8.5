<?php

class TempCuentaporcobrar extends BaseTempCuentaporcobrar
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
        $sql = " DELETE FROM mod_importar.temp_cuentaporcobrar";
        $resp = $conn->execute($sql);

        return true;
    }

    public function getConceptos($iddatosnomaexcluir, $start = 0, $limit = 10000, $iscount = null
    )
    {
        $query = Doctrine_Query::create();
        $query->from('TempCuentaporcobrar cpc')->addWhere(
            'cpc.iddatosnomenclador is null OR cpc.iddatosnomenclador <> ?', $iddatosnomaexcluir
        );

        $arrayobjstempInsactvs = array();
        if ($iscount) {
            return $query
                ->select('COUNT(cpc.idcuentaporcobrar ) as total')
                ->execute()->getFirst()->total;
        } else {array();
            $arrayobjstempInsactvs = $query
                ->orderby('cpc.numclienteproveedor')
                ->offset($start)->limit($limit)
                ->execute();
        }
        return array($arrayobjstempInsactvs);
    }

    public function obtenerDatosValidarCuentasPorCobrar($ids, $start = 0, $limit = 5000)
    {
        $query = Doctrine_Query::create();
        $query->from('TempCuentaporcobrar cpc')
            ->addWhere('cpc.iddatosnomenclador is not null')
            ->whereNotIn('cpc.iddatosnomenclador', $ids
            );
        $arraycuentas = array();
        $arraycuentas = $query
            ->orderby('cpc.clienteproveedor')
            ->offset($start)->limit($limit)
            //->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $arraycuentas;
    }

    public function obtenerDatosAdicionarCuentasPorCobrar($ids, $iscount = null, $start = 0, $limit = 5000)
    {
        $query = Doctrine_Query::create();
        $query->from('TempCuentaporcobrar cpc')
            ->addWhere('cpc.iddatosnomenclador is not null')
            ->whereIn('cpc.iddatosnomenclador', $ids
            );

        $arraycuentas = array();
        if ($iscount) {
            return $query
                ->select('COUNT(cpc.idcuentaporcobrar ) as total')
                ->execute()->getFirst()->total;
        } else {
            $arraycuentas = $query
                ->orderby('cpc.clienteproveedor')
                ->offset($start)->limit($limit)
                //->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        }
        return $arraycuentas;
    }



}
