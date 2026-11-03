<?php

class DatDesgviaadquisorgsat extends BaseDatDesgviaadquisorgsat
{

    public function setUp()
    {
        parent::setUp();
    }

    public function existeElemento($parametros)
    {
        $query = new Doctrine_Query();
        $res = $query
            ->from('DatDesgviaadquisorgsat ddvo')
            ->where('ddvo.iddesgviaadquisorgsat=? ', $parametros)
            ->execute()->getFirst();
        return $res;
    }

    public function existeDesglose($idinviaorgs, $parametros, $organo)
    {
        $query = new Doctrine_Query();
        $res = $query
            ->from('DatDesgviaadquisorgsat ddvo')
            ->where(
                'ddvo.idindicadorviaadquisicionorganosatisface=? AND ddvo.idindicador=? AND ddvo.idorganosatisface=?
                                                  AND ddvo.identidad=? AND ddvo.idmodelo=? AND ddvo.idejercicio=?',
                array($idinviaorgs, $parametros['idindicador'], $organo,
                      $parametros['identidad'],
                      $parametros['idmodelo'], $parametros['idejercicio'])
            )->execute()->getFirst();
        return $res;
    }

    public function existeIdAjuste($idajuste)
    {

        $query = new Doctrine_Query();
        $res = $query
            ->from('DatDesgviaadquisorgsat ddvo')
            ->where('ddvo.idajusteexistenciacb=? ', $idajuste)->execute()->getFirst();

        return $res->iddesgviaadquisorgsat;
    }

}
