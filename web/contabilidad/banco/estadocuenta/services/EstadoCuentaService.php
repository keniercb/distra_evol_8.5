<?php

class EstadoCuentaService extends ZendExt_Model {
	
	public function ObtenerEstadosTodos(){
		$result = DatEstadodecuentum::GetTodos();
		return ZendExt_ClassStandard::ArrayObject($result);
	}

	public function ObtenerEstadosPorId($idcuenta,$conciliado){
		$result = DatEstadodecuentum::estadosbyid($idcuenta,$conciliado);
		return ZendExt_ClassStandard::ArrayObject($result);
	}	
	
	public function ObtenerinfoEstadosdadoArrId($idcuenta,$start,$limit){
		$result = DatEstadodecuentum::infoEstadosdadoArrId($idcuenta,$start,$limit);
		return ZendExt_ClassStandard::ArrayObject($result);
	}	
	
	public function ObtenerUltimoSaldo($idcuenta,$fecha){
		$result = DatEstadodecuentum::ultimosaldo($idcuenta,$fecha);
		return ZendExt_ClassStandard::Object($result);
	}	
	
	public function ObtenerUltimoSaldoPorId($idcuenta,$date){
		$result = DatEstadodecuentum::ultimosaldoporid($idcuenta,$date);
		return ZendExt_ClassStandard::Object($result);
	}

	public function ObtenerDiferencia($idestadodecuenta,$tipodiferencia){
		$result = DatDiferencia::Diferencia($idestadodecuenta,$tipodiferencia);
		return ZendExt_ClassStandard::ArrayObject($result);
	}	
	
	public function ObtenerCreditoEnLibro($idcuenta){
		$result = DatEstadodecuentum::ObtenerCreditoEnLibro($idcuenta);
		return ZendExt_ClassStandard::ArrayObject($result);
	}
	public function DevolverInstrumentosPresentes($arr){
		$result = DatEstadocuentabnkInstrumento::DevolverInstrumentosPresentes($arr);
		return ZendExt_ClassStandard::ArrayObject($result);
	}
	public function Obtenersaldofinal($idcuenta){
		$result = DatEstadodecuentum::Obtenersaldofinal($idcuenta);
		//return $result;
		return ZendExt_ClassStandard::Object($result);
	}	
}

?>
