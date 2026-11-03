<?php

class HisOperacionRetencionesPersona extends BaseHisOperacionRetencionesPersona {

    public static function obtenerHisRetencionesPersona($idretencionpersona) {

        //Devolviendo los datos de las vacaciones de una persona en forma de arreglo.
        return Doctrine_Query::create()
                ->from('HisRetencionesPersona vac')
				->where('vac.idretencionpersona = ?', array($idretencionpersona))
                ->fetchArray();
    }
    
    public function obtenerUltimaOperacionSubMayorRetenciones($idretencionpersona){
		$sql = "select h.* 
		from mod_nomina.his_retencionpersona h
		where h.idretencionpersona = ? order by h.fechaoperacion, h.idhisretencionpersona DESC limit 1";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		return $conn->fetchAll($sql, array($idretencionpersona));
	}
	
    public function obtenerHistoricoSubMayorRetenciones($idretencionpersona, $limit, $start){
		$sql = "select h.* , dn.numeronomina
		from mod_nomina.his_retencionpersona h
		left join mod_nomina.dat_nomina dn on (dn.idnomina = h.idnomina)
		where h.idretencionpersona = ? order by h.fechaoperacion, h.idhisretencionpersona DESC limit ? offset ?";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		return $conn->fetchAll($sql, array($idretencionpersona, $limit, $start));
	}
	
	public function obtenerCantidadHistoricoSubMayorRetenciones($idretencionpersona){
		$sql = "select h.* 
		from mod_nomina.his_retencionpersona h
		where h.idretencionpersona = ? order by h.fechaoperacion, h.idhisretencionpersona";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		return $conn->fetchAll($sql, array($idretencionpersona));
	}
	

}
