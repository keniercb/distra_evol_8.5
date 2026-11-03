<?php

class DatTransferenciaAreas extends BaseDatTransferenciaAreas
{
    public function setUp()
    {
        $this->hasOne('DatDocumento', array('foreign' => 'iddocumento', 'local' => 'idtransferenciaarea'));
        $this->hasOne('DatArea', array('foreign' => 'idarea', 'local' => 'areaorigen'));
        $this->hasOne('DatArea', array('foreign' => 'idarea', 'local' => 'areadestino'));
        $this->hasOne(
            'NomTipotransferencia', array('local' => 'idtipotransferencia', 'foreign' => 'idtipotransferencia')
        );
        $this->hasMany('DatMovimientos', array('foreign' => 'iddocumento', 'local' => 'iddocumento'));
        parent::setUp();
    }

    public function getDatosTransferenciaareas(Doctrine_Query $query, $filtro)
    {
        if ($filtro['numero']) {
            $query->addWhere('d.nrodoc = ?', $filtro['numero']);
        }
        if ($filtro['idestado']) {
            $query->addWhere('d.estado = ?', $filtro['idestado']);
        }
        if ($filtro['areaorigen']) {
            $query->addWhere('ta.areaorigen = ?', $filtro['areaorigen']);
        }
        if ($filtro['areadestino']) {
            $query->addWhere('ta.areadestino = ?', $filtro['areadestino']);
        }
        if ($filtro['idtipotransferencia']) {
            $query->addWhere('tt.idtipotransferencia = ?', $filtro['idtipotransferencia']);
        }
        $query->addSelect(
                "ta.idtipotransferencia AS idtipotransferencia, ta.idtransferenciaarea AS idtransferenciaarea, "
                . "tt.denominacion AS tipotransferencia, a_o.idarea AS idareaorigen, a_d.idarea AS idareadestino, "
                . "eu_o.descripcion AS areaorigen, eu_o.idarea A idarea, eu_d.descripcion AS areadestino"
            )
            ->addWhere('eu_o.nivel = 1 AND eu_d.nivel = 1');
    }

    /**
     * 
     * @param Doctrine_Query $query
     * @param string $aliasExterno
     */
    public function getJoinDatTransferenciareas(Doctrine_Query $query, $aliasExterno)
    {
        $query->innerJoin("{$aliasExterno}.DatTransferenciaAreas ta")
            ->innerJoin("ta.NomTipotransferencia tt")
            ->innerJoin("ta.DatArea a_o ON ta.areaorigen = a_o.idarea")
            ->innerJoin("ta.DatArea a_d on ta.areadestino = a_d.idarea")
            ->innerJoin("a_o.DatEstructuraubicacion eu_o")
            ->innerJoin("a_d.DatEstructuraubicacion eu_d");
    }

}
