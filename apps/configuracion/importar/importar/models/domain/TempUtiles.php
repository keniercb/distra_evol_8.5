<?php

class TempUtiles extends BaseTempUtiles
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
        $sql = ' DELETE FROM mod_migracion_aft.apertura_importar_utiles';
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
                ->select('COUNT(c.id ) as total')
                ->execute()->getFirst()->total;
        } else {
            array();
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
        $arrayutiles = array();
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
                ->select('COUNT(c.id ) as total')
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

    public function obtenerTotalUtiles($start = 0, $limit = 5000)
    {
        $query = Doctrine_Query::create();
        return $query
            ->select('COUNT(c.id ) as total')
            ->from('TempUtiles c')
            ->execute()->getFirst()->total;

    }

    public function actualizarEstadoDatos($ids, $idestado)
    {
        $query = new Doctrine_Query();
        $query->update('TempUtiles c')
            ->set('iddatosnomenclador', '?', "$idestado")
            ->addWhere('c.iddatosnomenclador is not null')
            ->whereNotIn('c.iddatosnomenclador', $ids)
            ->execute();
    }


    public function actualizarEstadoDatosOld($ids, $validar)
    {
        $estado = ($validar) ? $ids[1] : $ids[0]; //ids[1]-validadook,  $ids[0]-adicionadook
        $query = new Doctrine_Query();
        $query->update('TempUtiles c')
            ->set('iddatosnomenclador', '?', "$estado")
            ->addWhere('c.iddatosnomenclador is not null')
            ->whereNotIn('c.iddatosnomenclador', $ids)
            ->execute();
    }


}
