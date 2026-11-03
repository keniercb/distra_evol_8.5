<?php

class ConfAgrupacion extends BaseConfAgrupacion
{
    public function setUp()
    {
        $this->hasMany('DatAtribAgrupacion', array('local' => 'idagrupacion', 'foreign' => 'idagrupacion'));
    }

    /**
     * Devuelve las agrupaciones.
     * @param array $filtro
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function cargarAgrupaciones($filtro, $dql = false)
    {
        $query = Doctrine_Query::create()
            ->select('a.idagrupacion, a.denominacion, a.idagrupacion AS id')
            ->from('ConfAgrupacion a')
            ->orderBy('a.idagrupacion');
        if ($filtro['alias']) {
            $query->addWhere("a.denominacion ILIKE '%{$filtro['alias']}%'");
        }
        if ($dql) {
            return $query;
        }
        return $query->fetchArray();
    }

}
