<?php
class DatProcesocomite extends BaseDatProcesocomite
{
	public function setUp()
    {
        parent :: setUp();
    }		
	
	public function getById($idprocesocomite)
    {
        return Doctrine::getTable('DatProcesocomite')->find($idprocesocomite);
    }
	
	public function getDatosByIdProceso($idproceso)
	{
		$query = new Doctrine_Query (); 
        $result = $query->from('DatProcesocomite p')
						->where("p.idproceso = '$idproceso'")
						->execute(); 
        return $result->toArray(); 
	}
	
	public function getComitesByIdProceso($idproceso)
	{
        $sql = "SELECT
                  cm.*
                , nc.denominacion as cargocomision
                , dc.denominacion as comision
				, dp.idpersona
				, ident.numero AS numid
				, CASE WHEN (dp.sapel IS NULL AND dp.snombre IS NULL) THEN dp.papel || ', ' || dp.nombre
						 WHEN (dp.sapel IS NULL AND dp.snombre IS NOT NULL)
						  THEN dp.papel || ', ' || dp.nombre || ' ' || dp.snombre
						 WHEN (dp.sapel IS NOT NULL AND dp.snombre IS NULL)
						  THEN dp.papel || ' ' || dp.sapel || ', ' || dp.nombre
						 ELSE dp.papel || ' ' || dp.sapel || ', ' || dp.nombre || ' ' || dp.snombre
					END AS nombreyapellidos
				FROM mod_rrhhmaestro.dat_comisionmiembro AS cm				
				INNER JOIN mod_rrhhmaestro.dat_comision AS dc ON (cm.idcomision = dc.idcomision)
				INNER JOIN mod_seleccion.dat_procesocomite pc ON (dc.idcomision = pc.idcomision)
				LEFT JOIN mod_rrhhmaestro.nom_cargocomision AS nc ON (cm.idcargocomision = nc.idcargocomision)
				INNER JOIN mod_persona.dat_persona AS dp ON (cm.idpersona = dp.idpersona)
				LEFT JOIN mod_persona.dat_docidentidad AS ident
				  ON (dp.idpersona = ident.idpersona AND ident.principal = 1
				    AND (ident.fhasta > now() OR ident.fhasta IS NULL))
				WHERE dp.feliminado IS NULL AND pc.idproceso = $idproceso";
		$dm = Doctrine_Manager::getInstance();
		$conn = $dm->getCurrentConnection();
		return $conn->fetchAll($sql);	
	}

    public function getComitesExpiradosByIdProceso($idproceso)
    {
        $sql = "Select c.idcomisionpersona, c.idcomision
				from mod_rrhhmaestro.dat_comisionmiembro c
				where c.idcomisionpersona  in (Select cc.idcomisionpersona
				from mod_rrhhmaestro.dat_comisionmiembro cc
				inner join mod_seleccion.dat_procesocomite pc on cc.idcomision = pc.idcomision
				inner join mod_rrhhmaestro.dat_comision nc on cc.idcomision = nc.idcomision
				where pc.idproceso = $idproceso and nc.fhasta < now())";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

	public function deleteByIdProceso($idproceso)
	{
		$query = new Doctrine_Query (); 
        $result = $query->delete()
						->from('DatProcesocomite p')
						->where("p.idproceso = '$idproceso'")
						->execute();
	}
    public function deleteByIdProcesoIdcomite($idproceso, $idcomite)
    {
        $query = new Doctrine_Query ();
        $result = $query->delete()
            ->from('DatProcesocomite p')
            ->where("p.idproceso = '$idproceso' and p.idcomision = '$idcomite'")
            ->execute();
    }
}