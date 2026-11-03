<?php

class SegCompartimentacionCargoPorTipoNominaModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function SegCompartimentacionCargoPorTipoNominaModel() {
        parent::ZendExt_Model();
    }

    public function Adicionar($idcompartimentacionnomina){
		$sql = "insert into mod_nomina.seg_compartimentacioncargoportiponomina (idcompartimentacionnomina, idtiponomina, permiso) 
					select {$idcompartimentacionnomina} as idcompartimentacionnomina, tn.idtiponomina, 1 as permiso from mod_nomina.nom_tiponomina tn where tn.fechafin is null;";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		return $conn->fetchAll($sql);
	}
	
    public function Modificar($compartimentacion){
		foreach($compartimentacion as $i => $c){
			$o = Doctrine::getTable('SegCompartimentacionCargoPorTipoNomina')->find($c->idcompartimentacioncargoportiponomina);
			if($o){
				$o->permiso = $c->permiso;
			}
			$o->save();
		}
		return true;
	}
	
	public function Eliminar($idcompartimentacionnomina){
		
	}
    
    
}
