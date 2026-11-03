<?php

class NomTipodocumentoimportar extends BaseNomTipodocumentoimportar
{

    public function Setup()
    {
        parent::Setup();
    }

    public function listarTipoDocumento()
    {
        $query = Doctrine_Query::create();
        $result = $query->from('NomTipodocumentoimportar')->setHydrationMode(
            Doctrine::HYDRATE_ARRAY
        )->execute();
        return $result;
    }

}
