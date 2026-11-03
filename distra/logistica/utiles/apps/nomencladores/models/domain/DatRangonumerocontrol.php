<?php

class DatRangonumerocontrol extends BaseDatRangonumerocontrol
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatSeriedocentidadrango', array('local' => 'idrango', 'foreign' => 'idrango'));
        $this->hasOne('DatRangonumerodocumento', array('local' => 'idrango', 'foreign' => 'idrango'));
        $this->hasMany('DatNumerocontrol', array('local' => 'idrango', 'foreign' => 'idrango'));
        $this->hasMany('DatPuestotrabajorango', array('local'=>'idrango','foreign'=>'idrango'));
    }

    public function verificarExistEnRango($obj)
    {
        $filtro = '';
        if ($obj['idseriedocumento']) {
            $arrFiltro[] = $obj['idseriedocumento'];
            $filtroArray[] = ' sde.idseriedocumento = ?';
        }
        if ($obj['nrodocumento']) {
            $arrFiltro[] = $obj['nrodocumento'];
            $filtroArray[] = ' ? between rnd.nrodocumentoinicial and rnd.nrodocumentofinal ';
        }
        if ($obj['nrocontrol']) {
            $arrFiltro[] = $obj['nrocontrol'];
            $filtroArray[] = ' ? between rnc.nrocontrolinicial and rnc.nrocontrolfinal ';
        }
        if ($obj['idrango']) {
            $arrFiltro[] = $obj['idrango'];
            $filtroArray[] = ' idrango <> ?';
        }

        $query = new Doctrine_Query();
        $filtro = implode(' AND ', $filtroArray);
        $res = $query->select('count(rnc.idrango)')
                ->from('DatRangonumerocontrol rnc')
                ->leftJoin('rnc.DatRangonumerodocumento rnd')
                ->leftJoin('rnc.DatSeriedocentidadrango ser')
                ->leftJoin('ser.DatSerieDocumentoEntidad sde')
                ->where($filtro, $arrFiltro)->fetchArray();
        return $res[0]['count'];
    }

    public function devolverRangos($obj)
    {
        $start = ($obj['start']) ? $obj['start'] : 0;
        $limit = ($obj['limit']) ? $obj['limit'] : 10;

        $filtro = '';
        if ($obj['idseriedocumento']) {
            $arrFiltro[] = $obj['idseriedocumento'];
            $filtroArray[] = ' sde.idseriedocumento = ?';
        }
        if ($obj['idpuestotrabajo']) {
            $arrFiltro[] = $obj['idpuestotrabajo'];
            $filtroArray[] = ' rpt.idpuestotrabajo = ? ';
        }
        if ($obj['idrango']) {
            $arrFiltro[] = $obj['idrango'];
            $filtroArray[] = ' rpt.idrango = ? ';
        }

        $query = new Doctrine_Query();

        $filtro = implode(' AND ', $filtroArray);
        $query->select('rnc.idrango , rnc.nrocontrolinicial , rnc.nrocontrolfinal, rnc.activo ,rnd.nrodocumentoinicial as nrodocumentoinicial, rnd.nrodocumentofinal as nrodocumentofinal ,ser.idseriedocentidad as idseriedocentidad,rpt.idpuestotrabajorango as idpuestotrabajorango , rpt.idpuestotrabajo as  idpuestotrabajo')
            ->from('DatRangonumerocontrol rnc')
            ->leftJoin('rnc.DatRangonumerodocumento rnd')
            ->leftJoin('rnc.DatSeriedocentidadrango ser')
            ->leftJoin('rnc.DatPuestotrabajorango rpt')
            ->where($filtro, $arrFiltro)
            ->orderBy('rnc.nrocontrolinicial ASC');

        return array('cantidad' => $query->count(), 'datos' => $query->offset($start)->limit($limit)->fetchArray());
    }

}
