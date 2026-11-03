<?php

class DatFacturaMoneda extends BaseDatFacturaMoneda
{

    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        parent::setUp();
    }

    public function guardarFacturaMoneda($params, $idfactura){
        try {
            $moneda=Doctrine_Query::create()->select()
                ->from('DatFacturaMoneda fm')
                ->where('fm.idmoneda = ?', $params->idmoneda)
                ->andWhere('fm.idfactura=?', $idfactura)
                ->execute()->getFirst();
            if(!$moneda){
                $moneda=new DatFacturaMoneda();
            }
            $moneda->idmoneda = $params->idmoneda;
            $moneda->idfactura = $idfactura;
            $moneda->valor = $params->valor;
            $moneda->save();
        } catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->errorMessage(), 'success' => false);
        }
    }
}
