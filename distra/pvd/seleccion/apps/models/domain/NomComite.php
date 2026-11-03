<?php
class NomComite extends BaseNomComite
{
	public function setUp()
    {
        parent :: setUp();
    }
	
	public function getComite($all = null)
	{
		try {
            $sql = "SELECT
		          nc.*
				, date_part('day',nc.fhasta - now()) AS cantd
				FROM
				  mod_seleccion.nom_comite AS nc";

			if($all)
                $sql = $sql.' WHERE nc.fdesde <= now() and (now() <= nc.fhasta or nc.fhasta is null)';
            $dm = Doctrine_Manager::getInstance();
            $cnx = $dm->getCurrentConnection();
            return $cnx->fetchAll($sql);
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
	}
	
	public function getDenomByIdComite($idcomite)
    {
        try {
            $query = Doctrine_Query::create()
                ->select('c.denominacion, c.idcomite')
                ->from('NomComite c')
                ->where("c.idcomite = '$idcomite'");
            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getById($idcomite)
    {
        return Doctrine::getTable('NomComite')->find($idcomite);
    }	
}