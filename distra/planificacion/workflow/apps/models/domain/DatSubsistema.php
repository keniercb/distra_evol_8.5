<?php

class DatSubsistema extends BaseDatSubsistema
{
    public function setUp()
    {
        parent::setUp();

        $this->HasMany(
            'DatSubsistemaConfDoc',
            array('local' => 'idsubsistema', 'foreign' => 'idsubsistema')
        );
    }

    public function GetTodos($start, $limit)
    {
        $query = new Doctrine_Query();
        if ($limit == 0) {
            $valor = $query->from('DatSubsistema')
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        } else {
            $valor = $query->select('*')
                ->from('DatSubsistema')
                ->limit($limit)
                ->offset($start)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();

            $cant = $query->select('count(s.idsubsistema) as cant')
                ->from('DatSubsistema s')
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();

            $valor = array('data' => $valor, 'cant' => $cant[0]['cant']);
        }
        return $valor;
    }

    public function GetTodosMod($start, $limit, $idtdoc)
    {
        $query = new Doctrine_Query();
        $r = $query->select('s.idsubsistema')
            ->from('DatSubsistemaConfDoc s')
            ->limit($limit)
            ->offset($start)
            ->where('s.idtipodoc = ?', $idtdoc)
            ->execute();
        return $r->toArray();
    }
}//fin clase 



