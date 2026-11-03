<?php

class SegFiltro extends BaseSegFiltro
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne ('DatCampo', array ('local' => 'idcampo', 'foreign' => 'idcampo'));
    }

    public function getFiltro($idfiltro)
    {
        return Doctrine::getTable('SegFiltro')->find($idfiltro);
    }

    public function getListFilters($idconfiguracion)
    {
        $query = Doctrine_Query::create();
        $query->select(
            'f.idfiltro, f.idcampo, f.idrol, f.condicion, f.valor, f.valormostrar, f.logico, f.orden,
            c.esquema as esquema, c.tabla as tabla, c.campo as campo,
            cd.idtabla as idtabla, cd.tipodato as tipodato, cd.sqlwhere as sqlwhere, cd.sqlfilter as sqlfilter, 1 as usarcondicion'
        )
            ->from('SegFiltro f')
            ->innerJoin('f.DatCampo c')
            ->innerJoin('c.DatConfigcondicion cd')
            ->orderBy('f.idrol, f.idcampo, f.orden ASC')
            ->where('c.idconfiguracion = ?', $idconfiguracion);

        return $query->fetchArray();
    }
}