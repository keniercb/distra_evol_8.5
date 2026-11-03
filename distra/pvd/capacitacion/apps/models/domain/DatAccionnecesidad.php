<?php
class DatAccionnecesidad extends BaseDatAccionnecesidad
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatAccionn',
            array('local' => 'idaccion', 'foreign' => 'idaccion')
        );
        $this->hasOne(
            'NomNecesidaddecapacitacion',
            array('local' => 'idnecesidad', 'foreign' => 'idnecesidad')
        );
    }

    public function getById($idaccionnecesidad)
    {
        return Doctrine::getTable('DatAccionnecesidad')->find($idaccionnecesidad);
    }

    public function getNecesidadesByAccionTodos($idaccion, $personas)
    {
        try {
            $select = (empty($idaccion))?'na.*':"na.*, da.idaccionnecesidad as idaccionnecesidad";
            $query = Doctrine_Query::create()->select($select)
                ->from('NomNecesidaddecapacitacion na');
            $union = 'na.DatAccionnecesidad da';
            if (!empty($idaccion)) {
                  $union = "na.DatAccionnecesidad da ON na.idnecesidad = da.idnecesidad AND da.idaccion = '$idaccion'";
            }
            $query->leftJoin($union);
            if (count($personas)>0) {
                $query->innerJoin('na.DatNecesidad dn');
                $query->whereIn('dn.idpersona', $personas);
            }
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getNecesidadesByAccion($idaccion, $start, $limit)
    {
        try {
            $select
                = "dd.*, na.denominacion as denominacion";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatAccionnecesidad dd')
                ->innerJoin('dd.NomNecesidaddecapacitacion na');
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

    public function cantAccionNecesidades($idaccion)
    {
        try {
            $select
                = "dd.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatAccionnecesidad dd');
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
        return $query -> delete('DatAccionnecesidad')
            -> addWhere('idaccion = ?', $idaccion)
            -> execute();
    }

    public function getIdPersonasByIdcargo($cargos)
    {
        $sql = "SELECT
				pe.idpersona
				FROM mod_persona.dat_situacionlaboral AS sl
				INNER JOIN mod_persona.dat_personaentidad AS pe ON (sl.idpersonaentidad = pe.idpersonaentidad)
				WHERE sl.estado = 0";

        if (count($cargos) > 0) {
            $sql .= " AND sl.idcargo in (" . implode(',', $cargos) . ")";
        }
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
}