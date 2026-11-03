<?php
class DatAccioncategoria extends BaseDatAccioncategoria
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatAccionn',
            array('local' => 'idaccion', 'foreign' => 'idaccion')
        );
    }

    public function getById($idaccioncategoria)
    {
        return Doctrine::getTable('DatAccioncategoria')->find($idaccioncategoria);
    }

    public function getCategoriasByAccion($idaccion, $start, $limit)
    {
        try {
            $select
                = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatAccioncategoria dd');
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

    public function cantAcciones($idaccion)
    {
        try {
            $select
                = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatAccioncategoria dd');
            if (!empty($idaccion)) {
                $query->addWhere("dd.idaccion = $idaccion");
            }
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getIdCategoriasByAccion($idaccion)
    {
        try {
            $select
                = "dd.idcategoria";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatAccioncategoria dd');
            if (!empty($idaccion)) {
                $query->addWhere("dd.idaccion = $idaccion");
            }
            $datos = $query->fetchArray();
            $result = Array();
            foreach ($datos as $c) {
                array_push($result, $c['idcategoria']);
            }
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function eliminarByAccion($idaccion)
    {
        $query = new Doctrine_Query();
        return $query -> delete('DatAccioncategoria')
            -> addWhere('idaccion = ?', $idaccion)
            -> execute();
    }

    public function existe($idaccion, $idcategoria)
    {
        try {
            $select
                = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatAccioncategoria dd')
                ->where("dd.idaccion = '$idaccion' AND dd.idcategoria = '$idcategoria'");
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}