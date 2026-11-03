<?php 
class DatEvalplanillasevaluativas extends BaseDatEvalplanillasevaluativas
 { 
   public function setUp() 
    {   parent::setUp(); 
         $this->hasMany('NomEvalestado', array('local'=>'idestado','foreign'=>'idestado')); 
         $this->hasMany('DatEvaldominioevaluativo', array('local'=>'iddominioevaluativo','foreign'=>'iddominioevaluativo')); 
         $this->hasOne('DatEvalregla', array('local'=>'idplanilla','foreign'=>'idplanilla')); 
         $this->hasOne('DatEvalmodelo', array('local'=>'idplanilla','foreign'=>'idplanilla')); 
         $this->hasOne('DatEvalindicadoresplanilla', array('local'=>'idplanilla','foreign'=>'idplanilla')); 

    } 
//Devuelve todos los datos de una planilla dado el idplanilla
   public function Buscar($idplanilla) 
    {           	   
		 $query = new Doctrine_Query ( ); 
		 $temp = $query ->from ( 'DatEvalplanillasevaluativas p' )->where ( "p.idplanilla = ?", $idplanilla )->execute()->toArray (); 		
         return $temp;

    } 
 //Devuelve todas las planillas
   public function GetTodos() 
    {
		$query = new Doctrine_Query (); 
		$result = $query->from('DatEvalplanillasevaluativas')->execute (); 
		return $result->toArray();
    } 
	
	public function GetPlanillaPorId($idplanilla)
    {
		$query = new Doctrine_Query (); 
		$result = $query->from('DatEvalplanillasevaluativas')
			->where('idplanilla = ?', $idplanilla)
			->execute (); 
		return $result->toArray();
    } 
 
   public function GetPorLimite($limite = 15,$inicio = 0) 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatEvalplanillasevaluativas')->limit($limite)->offset($inicio)->execute (); 
          return $result->toArray();
    }
	//Devuelve la cantidad total que tiene la tabla
	public function GetCantTotal() {
		try {
			$query = new Doctrine_Query ();
			$result = $query->select ('COUNT(idplanilla)')->from ('DatEvalplanillasevaluativas')->execute ();
			$arr = $result->toArray ();
			return (is_array ($arr) ? $arr [0] ['COUNT'] : 0);
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}
	//Devuelve las planillas por dominio evaluativo	
	public function getPlanillaPorDominioEvaluativo($iddominioevaluativo,$limite = 15,$inicio = 0){
		try {
			$query = new Doctrine_Query ();
			$result = $query->from ('DatEvalplanillasevaluativas')							
							->where('iddominioevaluativo = ?',$iddominioevaluativo)
							->limit($limite)
							->offset($inicio)
							->execute (); 
			 return $result->toArray();
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}
	
	//Devuelve las planillas que su denominacion contiene el texto que se pasa por parámetro
	public function getPlanillaPorTexto($texto,$limite = 15,$inicio = 0){
		try {
			$query = new Doctrine_Query ();
			$result = $query->from ('DatEvalplanillasevaluativas')							
							->where("denom ILIKE '%$texto%' OR codigo ILIKE '%$texto%' OR descripcion ILIKE '%$texto%'")
							->limit($limite)
							->offset($inicio)
							->execute ();
			return $result->toArray();
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}
	//Verifica si el código de la planilla a insertar ya existe
	public function ExisteCodPlanilla($cod) 
    { 
		try{
			$query = new Doctrine_Query (); 
			$result = $query->from('DatEvalplanillasevaluativas')
							->where("codigo = '$cod'")
							->execute (); 
				return $result->toArray();
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
    }
	
	//Devuelve todas las planillas activas
	public function GetPlanillasActivas() 
    { 
		try{
			$query = new Doctrine_Query (); 
			$result = $query->from('DatEvalplanillasevaluativas')
						    ->where("idestado = 1")
						    ->execute (); 
				return $result->toArray();
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
    }
    //Devuelve todas las planillas activas con paginado
    public function GetPlanillasActivasPag($limite, $inicio)
    {

            $query = new Doctrine_Query ();
            $result = $query->from('DatEvalplanillasevaluativas')
                ->where("idestado = 1")
                ->limit($limite)
                ->offset($inicio)
                ->execute ();
            return $result->toArray();

    }

	public function GetPlanillasActivasFiltro($filtro) 
    { 
		try{
			$query = new Doctrine_Query (); 
			$result = $query->from('DatEvalplanillasevaluativas')
						    ->where("idestado = 1 and denom ilike '%$filtro%'")
						    ->execute (); 
				return $result->toArray();
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
    }
	
	//Devuelve todas las planillas que tengan como denominación la pasada por parámetro
	public function ObtenerPlanillaPorDenom($denominacion, $limit, $start)
	{
		try{
			$query = Doctrine_Query::create();
			$result = $query->select (' p.idplanilla, p.codigo, p.denom, p.descripcion, p.fechainicio, p.fechafin, p.iddominioevaluativo, p.idestado, e.denom as estado, d.denom as dominioevaluativo')
							->from('DatEvalplanillasevaluativas p')	
							->innerJoin ('p.NomEvalestado e')
							->innerJoin ('p.DatEvaldominioevaluativo d')
							->where("p.denom ILIKE '%$denominacion%'")
							->orderby('p.idplanilla')
							->limit($limit)
							->offset($start)
							->setHydrationMode ( Doctrine::HYDRATE_ARRAY )->execute ();
		return $result;
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}
	
	//Devuelve la cantidad de códigos iguales al pasado por parámetro
	public  function contarcodigo($cod)
    {
		try{
			$query = Doctrine_Query::create();
			$cantCod = $query->from('DatEvalplanillasevaluativas')->where("codigo = ?",$cod)->count();
				
				return $cantCod;
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
    }
    
	//Devuelve todas las planillas
    public function MostrarPlanillas($limit = 15, $start = 0 )
	{
		try{
			$query = Doctrine_Query::create();
			$result = $query->select (' p.idplanilla, p.codigo, p.denom, p.descripcion, p.fechainicio, p.fechafin, p.iddominioevaluativo, p.idestado, e.denom as estado, d.denom as dominioevaluativo')
							->from('DatEvalplanillasevaluativas p')	
							->innerJoin ('p.NomEvalestado e')
							->innerJoin ('p.DatEvaldominioevaluativo d')
                            ->orderBy ('p.idplanilla DESC')
							->limit($limit)
							->offset($start)
							->setHydrationMode ( Doctrine::HYDRATE_ARRAY )->execute();
			return $result;
		} catch ( Doctrine_Exception $e ) {
			return $e;
		}
	}
	
	public function planillaEnUso($idplanilla){
		$query = new Doctrine_Query ( );
		$result = $query->from ('DatEvalplanillasevaluativas p')->where ("p.idplanilla='$idplanilla' and p.idestado != '0'" )->execute();
		return $result->toArray ();
	}
 
}