<?php 
class NomEvalindicadorimagenModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(NomEvalindicadorimagen $NomEvalindicadorimagen) 
    { 
            $NomEvalindicadorimagen->save();
    } 
 
   public function Actualizar(NomEvalindicadorimagen $NomEvalindicadorimagen) 
    { 
            $NomEvalindicadorimagen->save();
    } 
 
   public function Eliminar($idimg) 
    {             
		$obj = Doctrine :: getTable('NomEvalindicadorimagen')->find($idimg);
		if($obj){
		$obj->delete();		 
		return true;
		}
		return false;
    }

	function SincronizarImgBDconFicheroServer($idindicadorimagen)
	{
	    $host = Zend_Registry::get('config')->bd->plantillas->host;
		$user = Zend_Registry::get('config')->bd->plantillas->usuario;
		$pass = Zend_Registry::get('config')->bd->plantillas->password;
		$dbna = Zend_Registry::get('config')->bd->plantillas->bd;
		$link = pg_connect("host={$host} user={$user} password={$pass} dbname={$dbna}");
		$consulta = pg_query($link, "select denom, extension from mod_evaluaciones.nom_evalindicadorimagen where idindicadorimagen={$idindicadorimagen}");
		$arrayVal = array();
		while ($row = pg_fetch_assoc($consulta)){ 
			$arrayVal[] = $row;
		}
		$ext = $arrayVal[0]['extension'];	
		if($this->verificarImgArchivo($idindicadorimagen.$ext) == false){
			$ffp = fopen("nomvalindimgs/"."{$idindicadorimagen}"."{$ext}", "wb");
			fclose($ffp);
			$imagen = pg_unescape_bytea ($arrayVal[0]['denom']);
			file_put_contents("nomvalindimgs/"."{$idindicadorimagen}"."{$ext}", $imagen);			
		}		
		return $idindicadorimagen.$ext;
	}
	
	function verificarImgArchivo($nombreArchivo)
	{
		$dirimgs = "../../../../plantillas/nomvalindimgs/";
		$dir = "nomvalindimgs/";
		$images = array();
		$arrNombres = array();
		$archivo='';
		//Obtengo un listado de los nombres de los ficheros de imagenes en el servidor
		if ($gestor = opendir($dir)) {
		    while (false !== ($archivo = readdir($gestor))) {
                if ($archivo != "." && $archivo != "..")  
				 if(!preg_match('/\.(jpg|jpeg|gif|png|bmp|JPG|JPEG|GIF|PNG|BMP)$/', $archivo)) continue;
				 else $arrNombres[] = $archivo;
			}
		}else /*Debo lanzar una excepcion*/die("Direccion incorrecta o  no existe la carpeta nomvalindimgs.");
		
		foreach($arrNombres as $imagen){
			if($imagen == $nombreArchivo) return true;
		}
		return false;		
	}
	
	public function existeCodIndicadorI($cod) 
    { 
		$existe = NomEvalindicadorimagen :: ExisteCodIndicadorI($cod);
		if($existe)
			return true;
		else	
			return false;			
    }

   public function indicadorIEnUso($idindicadorimagen) 
    { 
		$existe = NomEvalindicadorimagen :: IndicadorIEnUso($idindicadorimagen);
		if($existe)
			return true;
		else	
			return false;			
    }
	
 }

