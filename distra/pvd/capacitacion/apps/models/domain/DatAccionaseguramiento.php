<?php
class DatAccionaseguramiento extends BaseDatAccionaseguramiento
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatAccionn',
            array('local' => 'idaccion', 'foreign' => 'idaccion')
        );
        $this->hasOne(
            'NomAseguramiento',
            array('local' => 'idaseguramiento', 'foreign' => 'idaseguramiento')
        );
    }

    public function getById($idaccionaseguramiento)
    {
        return Doctrine::getTable('DatAccionaseguramiento')->find($idaccionaseguramiento);
    }

    public function getAseguramientosByAccionTodos($idaccion)
    {
        try {
            $select
                = "na.*, da.idaccionaseguramiento as idaccionaseguramiento";
            $query = Doctrine_Query::create()->select($select)
                ->from('NomAseguramiento na')
                ->leftJoin(
                    "na.DatAccionaseguramiento da ON na.idaseguramiento = da.idaseguramiento 
                    AND da.idaccion = '$idaccion'"
                );
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getAseguramientosByAccion($idaccion, $start, $limit)
    {
        try {
            $select
                = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatAccionaseguramiento dd');
            if (!empty($idaccion)) {
                $query->addWhere("dd.idaccion = $idaccion");
            }
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function cantAseg($idaccion)
    {
        try {
            $select
                = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatAccionaseguramiento dd');
            if (!empty($idaccion)) {
                $query->addWhere("dd.idaccion = $idaccion");
            }
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function eliminarByAccion($idaccion)
    {
        $query = new Doctrine_Query();
        return $query -> delete('DatAccionaseguramiento')
            -> addWhere('idaccion = ?', $idaccion)
            -> execute();
    }
}