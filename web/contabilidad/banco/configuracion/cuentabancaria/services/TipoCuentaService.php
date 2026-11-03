<?php

class TipoCuentaService extends ZendExt_Model {
	
	public function ObtenerTiposCuenta($idestructura=0){
		$result = NomTipocuentabancaria::GetTodos($idestructura);
		return ZendExt_ClassStandard::ArrayObject ($result);
	}
}

?>
