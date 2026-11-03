<?php

class ConfResumenausentismocausas extends BaseConfResumenausentismocausas
{
    public function setUp()
    {
        parent::setUp();
    }

    public function getById($id)
    {
        return Doctrine::getTable('ConfResumenausentismocausas')->find($id);
    }

    public function existe($idcausa, $idconcepto)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('ConfResumenausentismocausas m');
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
            ->from('ConfResumenausentismocausas m');
        if (!empty($idsconcepto)) {
            $queryObj->addWhere("m.idconcepto in (" . implode(',', $idsconcepto) . ")");
        }
        return $queryObj->fetchArray();
    }

	
	    public function DelConceptoCausa($idconcepto)
    {
        $query = new Doctrine_Query ();
        $result = $query->delete()
            ->from('ConfResumenausentismocausas c')
            ->where('c.idconcepto = ?', $idconcepto)
            ->execute();
        return true;
    }

}

?>
