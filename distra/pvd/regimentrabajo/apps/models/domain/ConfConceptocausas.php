<?php

class ConfConceptocausas extends BaseConfConceptocausas
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($id)
    {
        return Doctrine::getTable('ConfConceptocausas')->find($id);
    }

    public function existe($idcausa/*, $idconcepto*/)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('ConfConceptocausas m');
        /*if (!empty($idconcepto)) {
            $queryObj->addWhere("m.idconcepto = $idconcepto");
        }*/
        if (!empty($idcausa)) {
            $queryObj->addWhere("m.idcausa = $idcausa");
        }
        return $queryObj->fetchArray();
    }

    public function getCausasByConcepto($idconcepto)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('ConfConceptocausas m');
        if (!empty($idconcepto)) {
            $queryObj->addWhere("m.idconcepto = $idconcepto");
        }
        return $queryObj->fetchArray();
    }
	
	    public function getCausas()
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('ConfConceptocausas m');
        return $queryObj->fetchArray();
    }
	
	    public function DelCausa()
    {
        $query = new Doctrine_Query ();
        $result = $query->delete()
            ->from('ConfConceptocausas c')
            ->execute();
        return true;
    }

}

?>
