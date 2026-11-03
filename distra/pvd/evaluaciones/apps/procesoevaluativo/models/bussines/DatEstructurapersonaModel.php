<?php
class DatEstructurapersonaModel extends ZendExt_Model {
	public function setUp() {
		parent::ZendExt_Model ();
	}
	
	public function Insertar(DatEstructurapersona $DatEstructurapersona) {
		$DatEstructurapersona->save ();
	}
	
	public function Actualizar(DatEstructurapersona $DatEstructurapersona) {
		$DatEstructurapersona->save ();
	}

    public function Modificar($idpersona, $activar){
		$query = Doctrine_Query::create()
				->update('DatEstructurapersona')
				->where('idpersona = ?', $idpersona);
		if($activar == 0){
			$query->set('fechadesactivacion', 'now()');
		}
		else{
			$query->set('fechadesactivacion','null');
		}
		$query->execute();
    }
	
	public function ReuvicarPersona($idestructurapersona,$idestructuraevaluativa){
		$query = Doctrine_Query::create()
				->update('DatEstructurapersona')
				->set('idestructuraevaluativa','?', $idestructuraevaluativa)
				->where('idestructurapersona = ?', $idestructurapersona);
		$query->execute();
	}
}