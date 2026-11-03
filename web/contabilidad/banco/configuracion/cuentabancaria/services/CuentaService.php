<?php

class CuentaService extends ZendExt_Model {
	
	public function ObtenerCuentasBancarias($idestructuracomun, $todas = 0)
	{
		$hijos = $this->integrator->metadatos->DameHijosEstructura($idestructuracomun);
		$hijos[] = $idestructuracomun;
		$result = NomCuentabancaria::ObtenerDatosCuentas($hijos, 0, 0, $todas);
		//return ZendExt_ClassStandard::ArrayObject ($result);
		return $result;
	}	

	public function BuscarDatosCuentas($inicio, $limite, $ident){
		$result = NomCuentabancariaModel::buscarDatosCuentas($inicio, $limite, $ident);
		return ZendExt_ClassStandard::ArrayObject ($result);
	}
	
	public function DatosCuenta($idcuenta, $idestructura){
		$result = NomCuentabancaria::DatosdeCuenta($idcuenta, $idestructura);
		return ZendExt_ClassStandard::ArrayObject ($result);
	}

	public function ObtenerCuentaPorId($idcuenta){
		$result = NomCuentabancaria::dameCuenta($idcuenta);
		//return ZendExt_ClassStandard::Object($result);
		return $result;
	}

	public function ObtenerSobreGiroPorId($idsobregirobanc){	   
		$result = DatSobregirobancario::Buscar ($idsobregirobanc);
		return ZendExt_ClassStandard::Object($result);
	}

	public function CantidadCuentasAsociadas($idcuenta){
		$result = DatSobregirobancario::CantidaddeCuentasAsociadas($idcuenta);
		return ZendExt_ClassStandard::Object ($result);
	}
	
	public function DatosSobregiro($idcuenta){
		$result = DatSobregirobancario::DatosdeSobregiro($idcuenta);
		return ZendExt_ClassStandard::ArrayObject ($result);
	}	
	
	public function CuentasAsociarTal($array,$idestructuracomun){
		$hijos= $this->integrator->metadatos->DameHijosEstructura($idestructuracomun);
		$idsestructura = array();
		foreach($hijos as $hijo)
			$idsestructura[] = $hijo->idestructura;
		$result = NomCuentabancaria::cuentasAsociar($array,$idsestructura);
		return ZendExt_ClassStandard::ArrayObject ($result);
	}
}

?>
