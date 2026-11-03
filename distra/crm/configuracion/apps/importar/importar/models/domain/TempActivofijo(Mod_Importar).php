<?php

class TempActivofijo extends BaseTempActivofijoModImportar
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
        $sql = ' DELETE FROM mod_importar.temp_activofijo';
        $resp = $conn->execute($sql);

        return true;
    }

    public function getConceptos($iddatosnomaexcluir, $start = 0, $limit = 10000, $iscount = null
    )
    {
        $query = Doctrine_Query::create();
        $query->from('TempActivofijo c')->addWhere(
            'c.iddatosnomenclador is null OR c.iddatosnomenclador <> ?', $iddatosnomaexcluir
        );

        $arrayobjstempactivo = array();
        if ($iscount) {
            return $query
                ->select('COUNT(c.idactivofijo ) as total')
                ->execute()->getFirst()->total;
        } else {array();
            $arrayobjstempactivo = $query
                ->orderby('c.desc_activofijo')
                ->offset($start)->limit($limit)
                ->execute();
        }
        return array($arrayobjstempactivo);
    }

    public function obtenerDatosValidarActivoFijo($ids, $start = 0, $limit = 5000)
    {
        $query = Doctrine_Query::create();
        $query->from('TempActivofijo c')
            ->addWhere('c.iddatosnomenclador is not null')
            ->whereNotIn('c.iddatosnomenclador', $ids
            );
        $arrayactivos = array();
        $arrayactivos = $query
            ->orderby('c.desc_activofijo')
            ->offset($start)->limit($limit)
            //->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $arrayactivos;
    }
    public function obtenerDatosAdicionarActivoFijo($ids, $iscount = null, $start = 0, $limit = 5000)
    {
        $query = Doctrine_Query::create();
        $query->from('TempActivofijo c')
            ->addWhere('c.iddatosnomenclador is not null')
            ->whereIn('c.iddatosnomenclador', $ids
            );

        $arrayactivos = array();
        if ($iscount) {
            return $query
                ->select('COUNT(c.idactivofijo ) as total')
                ->execute()->getFirst()->total;
        } else {
            $arrayactivos = $query
                ->orderby('c.desc_activofijo')
                ->offset($start)->limit($limit)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        }
        return $arrayactivos;
    }

}
