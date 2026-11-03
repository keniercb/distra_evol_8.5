<?php 
class DatEvalescalaModel extends ZendExt_Model 
 { 
   public function setUp() 
    { 
        parent::ZendExt_Model(); 
    } 
 
   public function Insertar(DatEvalescala $DatEvalescala) 
    { 
            $DatEvalescala->save();
    } 
 
   public function Actualizar(DatEvalescala $DatEvalescala) 
    { 
            $DatEvalescala->save();
    }
 
    public function Eliminar($idescala)
    {
        try {
            $objDomain = new DatEvalescala();
            return $objDomain->eliminarescala($idescala);
        } catch (Exception $e) {
            throw $e;
        }
    }
 
  /* public function Eliminar($DatEvalescala) 
    { 
		
            $DatEvalescala->delete();
    } 
	*/
	public function existeEscala($denom) 
	{
		$existe = DatEvalescala::existeEscala($denom);
		if ($existe)
			return true; 
		return false;
	}
	
	public function GetValoresEscala($idindicador){
		try {
			$result = array();
			$query = Doctrine_Manager::getInstance();
			$sql="SELECT dee.tipoescala
				FROM mod_evaluaciones.dat_evalindicadoresevaluar die
				INNER JOIN mod_evaluaciones.dat_evalescala dee ON (die.idescala = dee.idescala)				  
				WHERE die.idindicadorplanilla = '$idindicador'";			
			
			$tipoEscala=$query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC); 
			$tipoEscala = $tipoEscala[0]['tipoescala'];
			
			if($tipoEscala == 0){ //Escalas de rango númerico
				$sql="select vn.idvaloresnumericos as idescala, vn.denom, vn.idvaloresnumericos, dee.tipoescala
					from mod_evaluaciones.dat_evalindicadoresevaluar die
					inner join mod_evaluaciones.dat_evalescala dee ON (die.idescala = dee.idescala)
					inner join mod_evaluaciones.dat_evalescalarangonumerico rn ON(dee.idescala = rn.idescala)
					inner join mod_evaluaciones.nom_evalvaloresnumericos vn on(rn.idescalarangonumerico = vn.idescalarangonumerico)
					where idindicadorplanilla = {$idindicador}";
				$result=$query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
			}
			else if($tipoEscala == 1){ //Escalas cualitativas				
				$sql="SELECT nvc.idvalorescualitativos as idescala, nvc.denom, nvc.descripcion, dee.tipoescala
					FROM
					  mod_evaluaciones.dat_evalindicadoresevaluar die
					  INNER JOIN mod_evaluaciones.dat_evalescala dee ON (die.idescala = dee.idescala)
					  INNER JOIN mod_evaluaciones.dat_evalescalavalorescualitativos devc ON (dee.idescala = devc.idescala)
					  INNER JOIN mod_evaluaciones.nom_evalvalorescualitativos nvc ON (devc.idvalorescualitativos = nvc.idvalorescualitativos)
					WHERE
					  die.idindicadorplanilla = '$idindicador' and dee.tipoescala = '$tipoEscala'";
				
				$result=$query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
			}
			else if($tipoEscala == 2){ //Escalas de imagen
				$sql="SELECT nvi.idvaloresimagenes as idescala, nvi.denom, nvi.descripcion, nvi.extension, dee.tipoescala
					FROM
					  mod_evaluaciones.dat_evalindicadoresevaluar die
					  INNER JOIN mod_evaluaciones.dat_evalescala dee ON (die.idescala = dee.idescala)
					  INNER JOIN mod_evaluaciones.dat_evalescalavaloresimagen devi ON (dee.idescala = devi.idescala)
					  INNER JOIN mod_evaluaciones.nom_evalvaloresimagenes nvi ON (devi.idvaloresimagenes = nvi.idvaloresimagenes)
					WHERE
					  die.idindicadorplanilla = '$idindicador' and dee.tipoescala = '$tipoEscala'";
				
				$varAux=$query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
				foreach($varAux as $imagen){
					$result[] = array('idescala'=>$imagen['idescala'], 'denom'=>$imagen['idescala'].$imagen['extension'], 'descripcion'=>$imagen['descripcion'], 'tipoescala'=>$imagen['tipoescala']);
				}
			}			
			return $result;			
		} 
		catch ( Doctrine_Exception $e ) {
			return $e;
		}		
	}	
 }

