<?php
class BancosService extends ZendExt_Model
{
	public function ObtenerBancos()
	{
		$bancos = NomBanco::buscarBanco();	  
		if(!$bancos['cant'])return array();
		$standard = new ZendExt_ClassStandard();
		return $standard->ArrayObject($bancos['datos']);	  	   
	}
	public function ObtenerSucursales($idbanco)
	{
		$sucursales = NomSucursal::buscarSucursal(array('idbanco'=>$idbanco));
		if(!$sucursales['cant'])return array();
		$standard = new ZendExt_ClassStandard();
		return $standard->ArrayObject($sucursales['datos']);	  
	}
	public function ObtenerBancoPorId($idbanco)
	{
		$banco = NomBanco::buscarBanco(array('idbanco'=>$idbanco));	  
		if(!$banco['cant'])return new stdClass();
		$standard = new ZendExt_ClassStandard();
		return $standard->Object($banco['datos']);	  	   
	}
	public function ObtenerSucursalPorId($idsucursal)
	{
		$Sucursal = NomSucursal::buscarSucursal(array('idsucursal'=>$idsucursal));	  
		if(!$Sucursal['cant'])return new stdClass();
		$standard = new ZendExt_ClassStandard();
		return $standard->Object($Sucursal ['datos']);	  	   
	}

}
?>		