<?php 
class NomEvalvaloresimagenes extends BaseNomEvalvaloresimagenes
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasOne('DatEvalescalavaloresimagen', array('local'=>'idvaloresimagenes','foreign'=>'idvaloresimagenes')); 

    } 
 
   public function Buscar($idvaloresimagenes) 
    { 
          $temp = $this->conn->getTable('NomEvalvaloresimagenes')->find($idvaloresimagenes); 
           return $temp->toArray(); 

    } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('NomEvalvaloresimagenes')->execute (); 
          return $result->toArray(); 
    } 
	public function GetCantTotal() {//Devuelve la cantidad total que tiene la tabla
		try {
			$query = new Doctrine_Query ();
			$result = $query->select ('COUNT(idvaloresimagenes)')->from ('NomEvalvaloresimagenes')->execute ();
			$arr = $result->toArray ();
			return (is_array ($arr) ? $arr [0] ['COUNT'] : 0);
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}
 
   public function GetPorLimite($limite = 10,$inicio = 0) 
    { 
         $dirimgs = "/pvd/evaluaciones/plantillas/nomvalimgs/";
		 $query = new Doctrine_Query (); 
          $result = $query->from('NomEvalvaloresimagenes')->limit($limite)->offset($inicio)->execute (); 
          $arrTmp = $result->toArray();
		  $imgs = array();
		  foreach($arrTmp as $a)
		    $imgs[] = array('idvaloresimagenes'=>$a['idvaloresimagenes'], 'denom'=>$dirimgs.''.$a['idvaloresimagenes'].$a['extension'],
							'descripcion'=>$a['descripcion'], 'extension'=>$a['extension'], 'fechainicio'=>$a['fechainicio'], 'fechafin'=>$a['fechafin']);
		  return $imgs;	
    } 
 
}