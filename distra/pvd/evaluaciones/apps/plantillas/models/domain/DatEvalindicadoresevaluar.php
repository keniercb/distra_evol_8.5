<?php 
class DatEvalindicadoresevaluar extends BaseDatEvalindicadoresevaluar
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasMany('DatEvalescala', array('local'=>'idescala','foreign'=>'idescala')); 
         $this->hasOne('DatEvalindicadoresplanilla', array('local'=>'idindicadorplanilla','foreign'=>'idindicadorplanilla'));

    } 
 
   public function Buscar($idindicadorplanilla) 
    { 
          $temp = $this->conn->getTable('DatEvalindicadoresevaluar')->find($idindicadorplanilla); 
           return $temp->toArray(); 

    } 
 
   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatEvalindicadoresevaluar')->execute (); 
          return $result->toArray(); 

    } 
 
   public function GetPorLimite($limite = 10,$inicio = 0) 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatEvalindicadoresevaluar')->limit($limite = 10)->offset($inicio = 0)->execute (); 
          return $result->toArray(); 

    } 
//Devuelve los datos del indicador a evaluar dado el idindicadorplanilla	
	public function GetIndicadorEvaluar($idindicadorplanilla)
	{
		$query = new Doctrine_Query ();				  
		$result = $query->select('ie.idescala, ie.complementotextual')
						->from ('DatEvalindicadoresevaluar ie')							
						->where("ie.idindicadorplanilla = $idindicadorplanilla")							
						->execute ();
		return $result->toArray();
	}
	
	public function GetObjetoIndicadorEvaluar($idindicadorplanilla)
	{
		$query = new Doctrine_Query ();				  
		$result = $query->from ('DatEvalindicadoresevaluar ie')							
						->where("ie.idindicadorplanilla = $idindicadorplanilla")							
						->execute ();
		return $result;
	}
//Devuelve el id de la tabla (idevalindicadoresevaluar)dado el id indicador planilla
	public function GetIdIndicadorEvaluar($idindicadorplanilla)
	{
		$query = new Doctrine_Query ();				  
		$result = $query->select('ie.idevalindicadoresevaluar')
						->from ('DatEvalindicadoresevaluar ie')							
						->where("ie.idindicadorplanilla = $idindicadorplanilla")							
						->execute ();
		return $result->toArray();
	}
 
}