<?php

class ConfDoc extends BaseConfDoc
{
    public function setUp()
    {
        parent::setUp();
        $this->HasMany(
            'DatTransicion',
            array('local' => 'idtipodoc', 'foreign' => 'idtipodoc')
        );
        $this->HasMany(
            'DatSubsistemaConfDoc',
            array('local' => 'idtipodoc', 'foreign' => 'idtipodoc')
        );
        $this->HasMany(
            'ConfDocDatEstado',
            array('local' => 'idtipodoc', 'foreign' => 'idtipodoc')
        );
    }

    public function GetTodos($idsub)
    {
        $query = new Doctrine_Query();
        $result = $query->select('d.*')
            ->from('ConfDoc d')
            ->innerJoin('d.DatSubsistemaConfDoc c')
            ->innerJoin('c.DatSubsistema s')
            ->where("s.idsubsistema = ?", $idsub)
            ->execute();
        return $result->toArray();
    }

    public function GetPorLimite($inicio, $limite)
    {
        $query = new Doctrine_Query();
        $result = $query->from('ConfDoc')
            ->limit($limite)
            ->offset($inicio)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        $cant = $query->select('count(t.idtipodoc) as cant')
            ->from('ConfDoc t')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        $result = array('data' => $result, 'cant' => $cant[0]['cant']);
        return $result;
    }

    public function GetIDTDoc()
    {
        $query = new Doctrine_Query();
        $result = $query->select('max(d.idtipodoc)')
            ->from('ConfDoc d')->execute();
        return $result->toArray();
    }

}//fin clase 



