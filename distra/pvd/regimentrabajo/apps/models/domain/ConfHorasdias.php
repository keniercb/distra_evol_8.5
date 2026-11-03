<?php
class ConfHorasdias extends BaseConfHorasdias
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfHorasdias')->find($id);
    }

    public function getHorasDias()
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfHorasdias conf')
            ->orderBy('conf.horasdias');
        return $query->execute()->toArray();
    }	
}
?>
