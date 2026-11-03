<?php 
class NomEvalvalorescualitativosModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(NomEvalvalorescualitativos $NomEvalvalorescualitativos) 
    { 
            $NomEvalvalorescualitativos->save();
    } 
 
   public function AdicionarValorCualitativo($denom, $desc, $desde, $hasta) 
    { 
	        $obj = new NomEvalvalorescualitativos();
			$obj->denom         = $denom;
			$obj->descripcion   = $desc;
			$obj->desde         = $desde;
			$obj->hasta         = $hasta;
			$obj->save();
			
			return true;
    } 
	
	public function existeValorC($denom)
	{
	   $existe = NomEvalvalorescualitativos :: existeValorC($denom);
	   if($existe) return true;
	      return false;
	}
	
	public function valorEnUso($idvalorcualitativo)
	{
	   $valores = DatEvalescalavalorescualitativos :: ValorCualitativoEnUso($idvalorcualitativo);
	   if($valores) return true;
	    return false;
	}
	
   public function BuscarValores($denom)
    {
		$buscar = NomEvalvalorescualitativos ::  BuscarValoresbyDenom($denom);
		return $buscar;
    }	
   public function ModificarValorCualitativo($idvalorescualitativos, $denom, $descripcion, $desde, $hasta)
    {
	   $obj = Doctrine :: getTable('NomEvalvalorescualitativos')->find($idvalorescualitativos);
	   if($obj)
	   {
	    $obj->denom       =  $denom;
	    $obj->descripcion =  $descripcion;
		if($desde != "") $obj->desde       =  $desde;
		if($desde != "") $obj->hasta       =  $hasta;
		$obj->save();
			
	   return true;}
	   return false;
    }	
 
   public function EliminarVC($idvc, $fecha) 
    { 

         $obj = Doctrine :: getTable('NomEvalvalorescualitativos')->find($idvc);
		 if($obj) {
		 $obj->delete();		 
		 return true;
		 }
		 return false;
    } 
	
	
   public function DevolverValoresCualitativos($limit, $start, $denom)
   {
			$valorescualitativos = NomEvalvalorescualitativos :: devolverValoresCualitativos($limit,$start, $denom);
			return $valorescualitativos;
   }
 }

