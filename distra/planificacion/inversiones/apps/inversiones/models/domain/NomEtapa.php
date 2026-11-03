<?php

class NomEtapa extends BaseNomEtapa {

    public function setUp() {
        parent::setUp();
    }

    public function listarEtapas() {
        $query = new Doctrine_Query();
        $data->data = $query
                ->from('NomEtapa ne')
                ->execute()
                ->toArray();
        return $data;
    }

}

?>
