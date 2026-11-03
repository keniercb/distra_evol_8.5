<?php 
class FormatoService extends ZendExt_Model
{
    public function __construct()
	{
	}
    public static function Formato($idformato=0)
	{
	   $global = ZendExt_GlobalConcept::getInstance();
	   $identidad = $global->Estructura->idestructura;
	   $formatos = DatFormato::Formatos('',array('idformato'=>$idformato,'idestructuracomun'=>$identidad));
	   if($formatos)
	   {
	     $standard = new ZendExt_ClassStandard();
	     return $standard->ArrayObject($formatos);
	   }
	   return array();   
	}
    public static function NiveldeFormato($idformato)
	{	    
	    $standard = new ZendExt_ClassStandard();
	    $parteformato = DatParteformato::ParteFormato('',array('idformato'=>$idformato));		
		if($parteformato)
	      return $standard->ArrayObject($parteformato);
		return array();	     

	}
	public static function Formatos($idformato,$identidad)
	{
	    $global = ZendExt_GlobalConcept::getInstance();
	    $identidad = $global->Estructura->idestructura;
	    $formatos = DatFormato::Formatos('',array('idformato'=>$idformato,'idestructuracomun'=>$identidad));
		$array = NULL;			
		$field = array_keys($formatos[0]);
		$i= 0;
		foreach ($formatos as $vlp){
			$array[] = new stdClass();
			foreach ($field as $j=>$d)$array[$i]->$d=$vlp[$d];
			$i++;
		}
	    return $array;	
	}
    public static function FormatoPorID($idformato)
	{
	   $global = ZendExt_GlobalConcept::getInstance();
	   $identidad = $global->Estructura->idestructura;
	   $formatos = DatFormato::Formatos('',array('idformato'=>$idformato));//,'idestructuracomun'=>$identidad));
	   if($formatos)
	   {
	      $standard = new ZendExt_ClassStandard();
	      return $standard->Object($formatos);	  
	   }
	   return new stdClass();   
	}
	
	public static function FormatoParrafoPais()
	{	  
	   $formparpais = DatFormatopais::FormatoParrafoPais();
	   if($formparpais)
	   {
	      $standard = new ZendExt_ClassStandard();
	      return $standard->Object($formparpais);	  
	   }
	   return new stdClass();   
	}

        public static function HeredarFormato($idestructura, $idformato) {
            $integrator = ZendExt_IoC::getInstance();
            $FormatoModel = new FormatoModel();
            $formato = $integrator->parametros->BuscarFormatoPorID($idformato);
            $DatFormato = new DatFormato();
            $DatFormato->nombre = $formato->nombre;
            $DatFormato->descripcion = $formato->descripcion;
            $DatFormato->separador = $formato->separador;
            $DatFormato->version = 0;
            $DatFormato->idestructuracomun = $idestructura;
            $new_idformato = $FormatoModel->insertarDatFormato($DatFormato,$idestructura);
            if($new_idformato){
                $partes_formato = $integrator->parametros->BuscarParteFormato($idformato);
                $ParteformatoModel = new ParteformatoModel();
                foreach ($partes_formato as $variable) {
                    $DatParteformato = new DatParteformato();
                    $DatParteformato->nombre      = $variable->nombre;
                    $DatParteformato->abreviatura = $variable->abreviatura;
                    $DatParteformato->nivel       = $variable->nivel;
                    $DatParteformato->longitud    = $variable->longitud;
                    $DatParteformato->idformato   = $DatFormato->idformato;
                    $ParteformatoModel->insertarDatParteformato($DatParteformato);
                }
                return $DatFormato->idformato;
            }else
            return 0;
        }
}
?>