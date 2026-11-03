<?php

class DatFacturaArriboMoneda extends BaseDatFacturaArriboMoneda
{

    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        parent::setUp();
    }

    public function guardarFacturaArriboMoneda($params, $idfacturaarribo){
        try {
            $moneda=Doctrine_Query::create()->select()
                ->from('DatFacturaArriboMoneda fam')
                ->where('fam.idmoneda = ?', $params->idmoneda)
                ->andWhere('fam.idfacturaarribo=?', $idfacturaarribo)
                ->execute()->getFirst();
            if(!$moneda){
                $moneda=new DatFacturaArriboMoneda();
            }
            $moneda->idmoneda = $params->idmoneda;
            $moneda->idfacturaarribo = $idfacturaarribo;
            $moneda->valor = $params->valor;
            $moneda->save();
        } catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->errorMessage(), 'success' => false);
        }
    }
}
