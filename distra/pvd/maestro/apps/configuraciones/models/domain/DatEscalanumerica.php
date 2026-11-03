<?php
class DatEscalanumerica extends BaseDatEscalanumerica
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'ConfEscala',
            array('local' => 'idescala', 'foreign' => 'idescala')
        );
    }

    public function getById($idescalanumerica)
    {
        return Doctrine::getTable('DatEscalanumerica')->find($idescalanumerica);
    }

    public function getValoresByEscala($idescala, $filtro, $start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('d.*, d.idescalanumerica as idvalor')
            ->from('DatEscalanumerica d')
            ->where("d.idescala = '$idescala'");
        if ($filtro) {
            $queryObj->addWhere("CAST(d.valor as varchar)  = '$filtro'");
        }
        if (!empty($limit)) {
            $queryObj->limit($limit) ->offset($start);
        }
        return $queryObj->fetchArray();
    }

    public function eliminarByEscala($idescala)
    {
        $query = new Doctrine_Query();
        return $query -> delete('DatEscalanumerica')
            -> where('idescala = ?', $idescala)
            -> execute();
    }
}
