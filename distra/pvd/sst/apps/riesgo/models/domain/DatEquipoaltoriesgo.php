<?php
class DatEquipoaltoriesgo extends BaseDatEquipoaltoriesgo
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomClasifequipo', array('local' => 'idclasifequipo', 'foreign' => 'idclasifequipo'));
    }

    public function getById($idequipoaltoriesgo)
    {
        return Doctrine::getTable('DatEquipoaltoriesgo')->find($idequipoaltoriesgo);
    }

    public function getEquipoaltoriesgoByEstructura($estructuras, $filtro, $limit = null, $start = 0)
    {
        try {
            $select = "de.*, nc.denominacion as clasifequipo";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatEquipoaltoriesgo de')
                ->innerJoin('de.NomClasifequipo nc')
                ->whereIn("de.idestructura", $estructuras);
            if (!empty($filtro)) {
                $query->addWhere("de.denominacion ILIKE '%$filtro%' OR de.inventario ILIKE '%$filtro%' OR de.modelo ILIKE '%$filtro%'");
            }
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCantEquipoaltoriesgoByEstructura($estructuras, $filtro)
    {
        try {
            $query = Doctrine_Query::create()
                ->from('DatEquipoaltoriesgo de')
                ->innerJoin('de.NomClasifequipo nc')
                ->whereIn("de.idestructura", $estructuras);
            if (!empty($filtro)) {
                $query->addWhere("de.denominacion ILIKE '%$filtro%' OR de.inventario ILIKE '%$filtro%' OR de.modelo ILIKE '%$filtro%'");
            }
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}