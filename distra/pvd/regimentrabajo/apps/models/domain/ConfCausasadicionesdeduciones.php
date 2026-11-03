<?php
class ConfCausasadicionesdeduciones extends BaseConfCausasadicionesdeduciones
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfCausasadicionesdeduciones')->find($id);
    }

    public function getCausasadicionesdeduciones()
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('ConfCausasadicionesdeduciones c');
        return $queryObj->fetchArray();
    }

    public function existe($causa)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('ConfCausasadicionesdeduciones c');
        if (!empty($causa)) {
            $queryObj->addWhere("c.idcausa = $causa");
        }
        return $queryObj->fetchArray();
    }


}
?>
