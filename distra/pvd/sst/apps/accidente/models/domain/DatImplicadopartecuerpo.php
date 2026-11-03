<?php
class DatImplicadopartecuerpo extends BaseDatImplicadopartecuerpo
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomPartecuerpo', array('local' => 'idpartecuerpo', 'foreign' => 'idpartecuerpo'));
        $this->hasOne('NomNaturalezalesion', array('local' => 'idnaturalezalesion', 'foreign' => 'idnaturalezalesion'));
        $this->hasOne('DatAccidente', array('local' => 'iaaccidente', 'foreign' => 'iaaccidente'));
    }

    public function getById($idimplicadopartecuerpo)
    {
        return Doctrine::getTable('DatImplicadopartecuerpo')->find($idimplicadopartecuerpo);
    }

    public function getPartescuerpo($idaccidenteimplicado)
    {
        $queryObj = Doctrine_Query::create()
            ->select('ipc.*, pc.denominacion as partecuerpo, nl.denominacion as naturalezalesion')
            ->from('DatImplicadopartecuerpo ipc')
            ->innerJoin('ipc.NomPartecuerpo pc')
            ->innerJoin('ipc.NomNaturalezalesion nl')
            ->where("ipc.idaccidenteimplicado = '$idaccidenteimplicado'");
        return $queryObj->fetchArray();
    }

    public function deleteByIdImplicado($idaccidenteimplicado)
    {
        $query = new Doctrine_Query();
        $query->delete()
            ->from('DatImplicadopartecuerpo p')
            ->where("p.idaccidenteimplicado = '$idaccidenteimplicado'")
            ->execute();
    }

    public function getLesionadosAnno($anno, $equiparado, $identidad)
    {
        $queryObj = Doctrine_Query::create()
            ->select('i.*')
            ->from('DatAccidenteimplicado i')
            ->innerJoin('i.DatAccidente a')
            ->innerJoin('i.DatImplicadopartecuerpo l')
            ->where(
                "i.ffallecimiento IS NULL AND a.equiparado = '$equiparado' 
                AND  date_part('year', a.fecha) = $anno AND a.identidad = '$identidad'"
            )
            ->orderBy('a.fecha DESC');
        return $queryObj->fetchArray();
    }

    public function isFemenino($personas)
    {
        $sql = "SELECT
				dp.idpersona
				FROM mod_persona.dat_persona AS dp
				WHERE dp.sexo = 0 AND dp.idpersona in (" . implode(',', $personas) . ")";

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
}