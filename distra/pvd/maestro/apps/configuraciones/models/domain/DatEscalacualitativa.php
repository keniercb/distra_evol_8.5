<?php
class DatEscalacualitativa extends BaseDatEscalacualitativa
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'ConfEscala',
            array('local' => 'idescala', 'foreign' => 'idescala')
        );
        $this->hasOne(
            'NomValorcualitativo',
            array('local' => 'idvalorcualitativo', 'foreign' => 'idvalorcualitativo')
        );
    }

    public function getById($idescalacualitativa)
    {
        return Doctrine::getTable('DatEscalacualitativa')->find($idescalacualitativa);
    }

    public function getValoresByEscala($idescala, $filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('d.*, d.idvalorcualitativo as idvalor, nv.denominacion as valor, nv.descripcion as descripcion')
            ->from('DatEscalacualitativa d')
            ->innerJoin('d.NomValorcualitativo nv')
            ->where("d.idescala = '$idescala'")
            ->orderBy('d.peso DESC');
        if ($filtro) {
            $queryObj->addWhere("nv.denominacion ILIKE '%$filtro%' OR nv.descripcion ILIKE '%$filtro%'");
        }
        if (!empty($limit)) {
            $queryObj->limit($limit) ->offset($start);
        }
        return $queryObj->fetchArray();
    }

    public function getEscalaCulitativa($idescala, $idvalorcualitativo)
    {
        $queryObj = Doctrine_Query::create()
            ->select('d.*')
            ->from('DatEscalacualitativa d')
            ->where("d.idescala = '$idescala' and d.idvalorcualitativo = '$idvalorcualitativo'");       
        return $queryObj->fetchArray();
    }

    public function eliminarByEscala($idescala)
    {
        $query = new Doctrine_Query();
        return $query -> delete('DatEscalacualitativa')
            -> where('idescala = ?', $idescala)
            -> execute();
    }

    public function getValoresCualitativos($idescala, $filtro)
    {
        $queryObj = Doctrine_Query::create()
            ->select('n.*')
            ->from('NomValorcualitativo n')
            ->leftJoin("n.DatEscalacualitativa d ON (n.idvalorcualitativo = d.idvalorcualitativo AND d.idescala = '$idescala')")
            ->where("d.idescalacualitativa IS NULL");
        return $queryObj->fetchArray();
    }
}
