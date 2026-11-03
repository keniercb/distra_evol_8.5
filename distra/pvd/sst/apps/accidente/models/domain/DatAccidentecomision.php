<?php
class DatAccidentecomision extends BaseDatAccidentecomision
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatAccidente', array('local' => 'idaccidente', 'foreign' => 'idaccidente'));
    }

    public function getById($idaccidentecomision)
    {
        return Doctrine::getTable('DatAccidentecomision')->find($idaccidentecomision);
    }

    public function getComisiones($idaccidente)
    {
        $sql = "SELECT
				c.*, ac.idaccidentecomision
				FROM mod_rrhhmaestro.dat_comision AS c
                INNER JOIN mod_rrhhmaestro.dat_dominiocomision dc ON c.idcomision = dc.idcomision AND dc.iddominio = 6
				LEFT JOIN mod_sstaccidente.dat_accidentecomision AS ac ON (c.idcomision = ac.idcomision 
				AND ac.idaccidente = '$idaccidente')";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function deleteByIdAccidente($idaccidente)
    {
        $query = new Doctrine_Query();
        $query->delete()
            ->from('DatAccidentecomision p')
            ->where("p.idaccidente = '$idaccidente'")
            ->execute();
    }
}