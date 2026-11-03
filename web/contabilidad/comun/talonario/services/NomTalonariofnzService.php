<?php
class NomTalonariofnzService extends ZendExt_Model
{
	public function obtenerNumeroTalonario($cajban, $elemasoc, $tipodoc)
    {
        $objTalonarioModel = new NomTalonariofnzModel();
		return $objTalonarioModel->darnumerotalonario($cajban, $elemasoc, $tipodoc);
    }
	
	public function talonariosAsociar($idestructura, $idnodop, $idsubsistema, $cajban, $elemasoc, $tiposdocp)
    {
		$objTalonarioModel = new NomTalonariofnzModel();
		return $objTalonarioModel->TalonarioNoAsociados($idestructura, $idnodop, $idsubsistema, $cajban, $elemasoc, $tiposdocp);
    }
	
	public static function gestTalonario()
	{
	   	$dir_rel_app = Zend_Registry::get('config')->uri_aplication;
		$dir_controller = $dir_rel_app . '/finanzas/comunfinanzas/talonario/index.php/gestalonario/gestalonario';
		header("Location: $dir_controller");
	}
	
	public function AsociarTalonarios($arrayDatos, $cajban)
    {
		$objTalonarioModel = new NomTalonariofnzModel();
		$v = ($objTalonarioModel->AsociarTalonario($arrayDatos, $cajban)) ? true : false;
		return $v;
    }
    
	//////////bancooooooooooooooooooooo/////////////////////////
     public function DameObjetoTalonarioBanco($idtalo)
    {
        $obj_tal = new NomTalonariobancofnz($idtalo); 
		
        return $obj_tal->ObtenerTalonarioBancarioPorId($idtalo);
    }    
      
    public function ObtenerObjetoTalonarioBanco($idtalonario)
    {
        $obj_doc = NomTalonariobancofnz::Obtener($idtalonario);
        return ZendExt_ClassStandard::ArrayObject ($obj_doc);
    }   
//Estos dos servicios los necesita banco	
    public function ObtenerTalonariosBanco()
    {
		$tal = array();
		$tal[0]['idtalonario'] = 88;
		$tal[0]['idcuentabancaria'] = 1;
		
		$tal[1]['idtalonario'] = 90;
		$tal[1]['idcuentabancaria'] = 1;
		return ZendExt_ClassStandard::ArrayObject($tal);	
    } 	
	
    public function ObtenerTalonarioDadoIdCuentaBancaria($idcuentabancaria,$destino=0,$start,$limit)
    {
		$talonariomodel = new NomTalonariofnzModel(); 
		//echo'<pre>';print_r(array('cuenta'=>$idcuentabancaria,'dest'=>$destino,'st'=>$start,'li'=>$limit));die('parametros');  
		$result			= $talonariomodel->Talonarioporcuenta($idcuentabancaria,$destino,$start,$limit);
		
		//return $result;
		return ZendExt_ClassStandard::ArrayObject($result);
    } 
	
	public function ObtTalonarioDispDadoIdCuentaBank($idcuentabancaria,$destino,$fecha,$idperiodo)
    {
		$talonariomodel = new NomTalonariofnzModel();
		$result	= $talonariomodel->TalonariosDisponiblesPorCuenta($idcuentabancaria, $destino, $fecha, $idperiodo);
		return ZendExt_ClassStandard::ArrayObject($result);
    } 
	
	/*
	public function ObtenerTalonarioByCuentaBancaria($idcuentabancaria, $tipodoc)
    {
		$talonariomodel = new NomTalonariofnzModel();
		return $talonariomodel->Talonariobycuenta($idcuentabancaria, $tipodoc); 		
    } 
	*/
	public function DisminuirDisponibilidad($idtalonario, $numero, $cajaobanco, $elemasoc)
    {
		$talonariomodel = new NomTalonariofnzModel();
		return $talonariomodel->DisminuirDisponibilidad($idtalonario, $numero, $cajaobanco, $elemasoc); 		
    } 
	
	public function ObtenerIdTalonario($idcuentabancaria)
    {
		$talonario = new NomTalonariobancofnz();
		return $talonario->Talonariobycuenta($idcuentabancaria); 		
    } 
   //////////bancooooooooooooooooooooo/////////////////////////    
   
}
?>