<?php
class ConfHabcausa extends BaseConfHabcausa
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfHabcausa')->find($id);
    }

    public function getHabilitarcausa()
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfHabcausa conf');
        return $query->execute()->toArray();
    }	
}
?>
