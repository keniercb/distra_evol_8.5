<?php 
class DatInversionestfact extends BaseDatInversionestfact
 { 
   public function setUp() 
    { 
       parent::setUp();
    } 
 

   public function Buscar($idinversionestfact) 
    { 
          $temp = $this->conn->getTable('DatInversionestfact')->find($idinversionestfact); 
           return $temp->toArray(); 

    }

    public function BuscarDocumentoById($idcontenido)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('f.idcontenido')
            ->from('DatInversionestfact f')
            ->where('f.idcontenido = ?', $idcontenido)
            ->fetchArray();
        return $result;

    }
 

   public function GetTodos() 
    { 
          $query = new Doctrine_Query (); 
          $result = $query->from('DatInversionestfact')->execute (); 
          return $result->toArray(); 

    }


    public function guardarDocumentoFactibilidad($params)
    {
        $objDocFact = new DatInversionestfact();

        $objDocFact->denominacion = $params['denominacion'];
        $objDocFact->idinversion = $params['idinversion'];
        $objDocFact->fechacreacion = $params['fechacreacion'];
        $objDocFact->vigente = $params['vigente'];
        $objDocFact->idcontenido = $params['idcontenido'];
        $objDocFact->save();

        $result = $objDocFact->idinversionestfact;
        return $result;
    }
 
}//fin clase 
?>


