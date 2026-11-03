<?php

class NomFormatoNumContratoElementoParametro extends BaseNomFormatoNumContratoElementoParametro
{
    public function setUp()
    {
        parent::setUp();
		$this->hasOne('NomFormatoNumContratoElemento', array('local' => 'idformatonumcontratoelemento', 'foreign' => 'idformatonumcontratoelemento'));
    }

    public static function insertValue($idfncelement, $values)
    {
        try {
            $model = Doctrine::getTable('NomFormatoNumContratoElementoParametro')->find($idfncelement);
            if (!$model) {
                $model = new NomFormatoNumContratoElementoParametro();
            }
            $model->idformatonumcontratoelemento = $idfncelement;
            $model->nombreparametro = (empty($values['nombreparametro'])) ? null : $values['nombreparametro'];
            $model->save();
        }catch(Exception $e){
            throw $e;
        }
    }
}