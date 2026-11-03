<?php

class DatCodigodeCCModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function listarCodigo($parametros)
    {
        $result = DatCodigodeCC::listarCodigo($parametros);
        return $result;
    }

    public function adicionarModificarCreditoFinanciero($parametros)
    {
        //var_dump($parametros); die;
        if($parametros['accion']==1){
            $result= DatCodigodeCC::AdcionarCredito($parametros);
        }
        if($parametros['accion']==2){
          $result= DatCodigodeCC::ModificarCredito($parametros);
        }
        return $result;
    }

}