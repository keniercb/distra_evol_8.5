<?php 
class NomEvalvaloresnumericos extends BaseNomEvalvaloresnumericos
 { 
   public function setUp() 
    {   parent::setUp(); 
        $this->hasOne('DatEvalescalarangonumerico', array('local'=>'idescalarangonumerico','foreign'=>'idescalarangonumerico'));
    }  

    public function BuscarPorId($idvaloresnumericos) 
    { 
		$query = new Doctrine_Query ( );
		$result = $query->from('NomEvalvaloresnumericos e')
					->where('e.idvaloresnumericos=?',array($idvaloresnumericos))
					->setHydrationMode (Doctrine :: HYDRATE_ARRAY)
					->execute();		
		return $result;
    } 
	
    public function VerificarExiste($denom) 
    { 
			$query = new Doctrine_Query ( ); 
			$temp = $query ->from ( 'NomEvalvaloresnumericos e' )
						   ->where ( "e.denom = ?", $denom )
						   ->execute()
						   ->toArray ();  				   
			if($temp)
				return true;
			return false;
    }

   public function GetTodos() 
    { 
		$query = new Doctrine_Query (); 
		$result = $query->from('NomEvalvaloresnumericos')->execute (); 
		return $result->toArray();
    } 
    
}