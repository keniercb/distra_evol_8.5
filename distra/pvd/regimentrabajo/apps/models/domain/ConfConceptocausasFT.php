<?php

class ConfConceptocausasFT extends BaseConfConceptocausasFT
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($id)
    {
        return Doctrine::getTable('ConfConceptocausasFT')->find($id);
    }

    public function existe($idcausa, $idconcepto)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('ConfConceptocausasFT m');
        if (!empty($idconcepto)) {
            $queryObj->addWhere("m.idconcepto = $idconcepto");
        }
        if (!empty($idcausa)) {
            $queryObj->addWhere("m.idcausa = $idcausa");
        }
        return $queryObj->fetchArray();
    }

    public function getCausasByConcepto($idsconcepto)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('ConfConceptocausasFT m');
        if (!empty($idconcepto)) {
            $queryObj->addWhere("m.idconcepto in (" . implode(',', $idsconcepto) . ")");
        }
        return $queryObj->fetchArray();
    }
	
	    public function getCausas()
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('ConfConceptocausasFT m');
        return $queryObj->fetchArray();
    }
	
	    public function DelConceptoCausa($idconcepto)
    {
        $query = new Doctrine_Query ();
        $result = $query->delete()
            ->from('ConfConceptocausasFT c')
            ->where('c.idconcepto = ?', $idconcepto)
            ->execute();
        return true;
    }

}

?>
