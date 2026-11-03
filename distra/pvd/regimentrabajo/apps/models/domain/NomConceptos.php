<?php
class NomConceptos extends BaseNomConceptos
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('NomConceptos')->find($id);
    }

    public static function getconceptos()
    {
        $sql = "SELECT 
                      idconcepto,orden,
                      denominacion
                    FROM 
                      mod_regimentrabajo.nom_concepto;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public function eliminarConceptos()
    {
        $query = new Doctrine_Query ();
        $result = $query->delete()
            ->from('NomConceptos x')
            ->execute();
        return true;
    }

    public function delConcepto($idconcepto)
    {
        try {
            $sql = "DELETE FROM 
                      mod_regimentrabajo.nom_concepto
                    WHERE idconcepto = ". $idconcepto;
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $r = $conn->fetchAll($sql);
            return true;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function getCausasByConcepto($idconcepto)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('ConfConceptocausasONEI m');
        if (!empty($idconcepto)) {
            $queryObj->addWhere("m.idconcepto = " . $idconcepto);
        }
        return $queryObj->fetchArray();
    }
}
?>
