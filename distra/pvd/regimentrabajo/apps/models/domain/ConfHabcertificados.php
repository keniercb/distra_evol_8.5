<?php
class ConfHabcertificados extends BaseConfCertificados
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('ConfHabcertificados')->find($id);
    }

    public function getHabilitarcausacertificados()
    {
        $query = Doctrine_Query::create()
            ->select('conf.*')
            ->from('ConfHabcertificados conf');
        return $query->execute()->toArray();
    }

    public function existe($idcausa)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('ConfHabcertificados c');
        if (!empty($idcausa)) {
            $queryObj->addWhere("c.idcausa = $idcausa");
        }
        return $queryObj->fetchArray();
    }

    public function DelCertificados()
    {
        $query = new Doctrine_Query ();
        $result = $query->delete()
            ->from('ConfHabcertificados c')
            ->execute();
        return true;
    }


}
?>
