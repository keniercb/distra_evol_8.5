<?php
class DatProcesocargo extends BaseDatProcesocargo
{
	public function setUp()
    {
        parent :: setUp();
    }	
	
	/**
	 * Función para obtener un objeto procesocargo dado su id
	 * @param $idprocesocargo Identificador del objeto del proceso.
	 * @return 
	**/
	public function getById($idprocesocargo)
    {
        return Doctrine::getTable('DatProcesocargo')->find($idprocesocargo);
    }
	
	public function getCargosByIdProceso($idproceso)
	{
		$query = new Doctrine_Query (); 
        $result = $query->from('DatProcesocargo p')
						  ->where("p.idproceso = '$idproceso'")	
						  ->execute(); 
        return $result->toArray();
	}
	
	public function getDenomCargosById($idcargo, $homologado)
	{
		if ($homologado == 1) {
			$sql = "SELECT ch.idespcargo AS idcargo, ch.denominacion, 1 AS homologo
				 FROM mod_rrhhmaestro.conf_espcargo AS ch WHERE ch.idespcargo = '$idcargo'";
		} else {
			$sql = "SELECT nc.idnomcargo AS idcargo, nc.denominacion, 0 AS homologo
				 FROM mod_estructuracomp.nom_cargo AS nc WHERE nc.idnomcargo = '$idcargo'";
		}
		
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
		$result = $conn->fetchAll($sql);
        return $result; 		  
	}

    public function getCargoByIdEspecializacion($idespcargo)
    {
        $sql = "SELECT ch.idcargo
             FROM mod_rrhhmaestro.conf_espcargo AS ch WHERE ch.idespcargo = '$idespcargo'";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result[0];
    }
	
	public function delByIdProceso($idproceso)
	{
		$query = new Doctrine_Query (); 
        $result = $query->delete()
						->from('DatProcesocargo p')
						->where("p.idproceso = '$idproceso'")	
						->execute(); 
	}
	
	public function procByArrayIdCargo($cargos, $idproceso)
    {
        $sql = "SELECT pcargo.idproceso FROM mod_seleccion.dat_procesocargo pcargo
					INNER JOIN mod_estructuracomp.nom_cargo nomc ON (nomc.idnomcargo = pcargo.idcargo)
					INNER JOIN mod_estructuracomp.dat_cargo datc ON (nomc.idnomcargo = datc.idnomcargo)
					WHERE pcargo.idproceso = $idproceso AND pcargo.homologo = 0 AND datc.idcargo in (".implode(',', $cargos).")";		    
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
}
