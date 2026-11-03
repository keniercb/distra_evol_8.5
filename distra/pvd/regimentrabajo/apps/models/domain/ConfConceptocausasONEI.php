<?php

class ConfConceptocausasONEI extends BaseConfConceptocausasONEI
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($id)
    {
        return Doctrine::getTable('ConfConceptocausasONEI')->find($id);
    }

    public function existe($idcausa/*, $idconcepto*/)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('ConfConceptocausasONEI m');
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
            ->from('ConfConceptocausasONEI m');
        if (!empty($idconcepto)) {
            $queryObj->addWhere("m.idconcepto = $idconcepto");
        }
        return $queryObj->fetchArray();
    }
	
	    public function getCausas()
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('ConfConceptocausasONEI m');
        return $queryObj->fetchArray();
    }
	
	    public function DelCausa()
    {
        $query = new Doctrine_Query ();
        $result = $query->delete()
            ->from('ConfConceptocausasONEI c')
            ->execute();
        return true;
    }

    public function DelConceptoCausa($idconcepto)
    {
        $query = new Doctrine_Query ();
        $result = $query->delete()
            ->from('ConfConceptocausasONEI c')
            ->where('c.idconcepto = ?', $idconcepto)
            ->execute();
        return true;
    }

    public function existeConceptoCausa($idcausa, $idconcepto)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('ConfConceptocausasONEI m');
        if (!empty($idconcepto)) {
            $queryObj->addWhere("m.idconcepto = $idconcepto");
        }
        if (!empty($idcausa)) {
            $queryObj->addWhere("m.idcausa = $idcausa");
        }
        return $queryObj->fetchArray();
    }

}

?>
