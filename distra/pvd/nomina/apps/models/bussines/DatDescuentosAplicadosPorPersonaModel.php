<?php

class DatDescuentosAplicadosPorPersonaModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function DatDescuentosAplicadosPorPersonaModel()
    {
        parent::ZendExt_Model();
    }

    public function adicionarDescuentosAplicadosPersona($idelaborarpagos, $descuentoscalculados)
    {
        foreach($descuentoscalculados as $idpersona => $dc){
            foreach ($dc as $idconceptopd){
                $o = new DatDescuentosAplicadosPorPersona();
                $o->idelaborarpagos = $idelaborarpagos;
                $o->idpersona = $idpersona;
                $o->idconceptopercepciondescuento = $idconceptopd;
                $o->save();
            } 
        }
    }

}
