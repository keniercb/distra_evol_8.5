<?php

class NomFormatoNumContratoElementoTexto extends BaseNomFormatoNumContratoElementoTexto
{
    public function setUp()
    {
        parent::setUp();
		$this->hasOne('NomFormatoNumContratoElemento', array('local' => 'idformatonumcontratoelemento', 'foreign' => 'idformatonumcontratoelemento'));
    }

    public static function insertValue($idfncelement, $values)
    {
        try {
            $model = Doctrine::getTable('NomFormatoNumContratoElementoTexto')->find($idfncelement);
            if (!$model) {
                $model = new NomFormatoNumContratoElementoTexto();
            }
            $model->idformatonumcontratoelemento = $idfncelement;
            $model->caracteres = $values['caracteres'];
            $model->save();
        }catch(Exception $e){
            throw $e;
        }
    }
}