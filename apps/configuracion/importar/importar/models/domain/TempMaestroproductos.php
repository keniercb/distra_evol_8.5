<?php

class TempMaestroproductos extends BaseTempMaestroproductos
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
        $sql = ' DELETE FROM mod_migracion_aft.importar_maestro_productos';
        $resp = $conn->execute($sql);

        return true;
    }

    public function getConceptos($iddatosnomaexcluir, $start = 0, $limit = 10000, $iscount = null
    )
    {
        $query = Doctrine_Query::create();
        $query->from('TempMaestroproductos c')->addWhere(
            'c.iddatosnomenclador is null OR c.iddatosnomenclador <> ?', $iddatosnomaexcluir
        );

        $arrayobjstempmaestro = array();
        if ($iscount) {
            return $query
                ->select('COUNT(c.idindicador ) as total')
                ->execute()->getFirst()->total;
        } else {
            array();
            $arrayobjstempmaestro = $query
                ->orderby('c.denominacion')
                ->offset($start)->limit($limit)
                ->execute();
        }
        return array($arrayobjstempmaestro);
    }

    public function obtenerDatosValidarMaestroProductos($ids, $start = 0, $limit = 5000)
    {
        $query = Doctrine_Query::create();
        $query->from('TempMaestroproductos c')
            ->addWhere('c.iddatosnomenclador is not null')
            ->whereNotIn('c.iddatosnomenclador', $ids
            );
        $arraymaestro = array();
        $arraymaestro = $query
            ->orderby('c.denominacion')
            ->offset($start)->limit($limit)
            //->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $arraymaestro;
    }

    public function obtenerDatosAdicionarMaestroProductos($ids, $iscount = null, $start = 0, $limit = 5000)
    {
        $query = Doctrine_Query::create();
        $query->from('TempMaestroproductos c')
            ->addWhere('c.iddatosnomenclador is not null')
            ->whereIn('c.iddatosnomenclador', $ids
            );

        $arraymaestro = array();
        if ($iscount) {
            return $query
                ->select('COUNT(c.idindicador ) as total')
                ->execute()->getFirst()->total;
        } else {
            $arraymaestro = $query
                ->orderby('c.denominacion')
                ->offset($start)->limit($limit)
                //->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        }
        return $arraymaestro;
    }

    public function obtenerTotalMaestroProductos($start = 0, $limit = 5000)
    {
        $query = Doctrine_Query::create();
        return $query
            ->select('COUNT(c.idindicador ) as total')
            ->from('TempMaestroproductos c')
            ->execute()->getFirst()->total;

    }

    public function actualizarEstadoDatos($ids, $validar)
    {
        $estado = ($validar) ? $ids[1] : $ids[0]; //ids[1]-validadook,  $ids[0]-adicionadook
        $query = new Doctrine_Query();
        $query->update('TempMaestroproductos c')
            ->set('iddatosnomenclador', '?', "$estado")
            ->addWhere('c.iddatosnomenclador is not null')
            ->whereNotIn('c.iddatosnomenclador', $ids)
            ->execute();
    }

}
