<?php

class NomFormatoNumContratoElementoFecha extends BaseNomFormatoNumContratoElementoFecha
{
    public function setUp()
    {
        parent::setUp();
		$this->hasOne('NomFormatoNumContratoElemento', array('local' => 'idformatonumcontratoelemento', 'foreign' => 'idformatonumcontratoelemento'));
    }

    public static function insertValue($idfncelement, $values)
    {
        try {
            $model = Doctrine::getTable('NomFormatoNumContratoElementoFecha')->find($idfncelement);
            if (!$model) {
                $model = new NomFormatoNumContratoElementoFecha();
            }
            $model->idformatonumcontratoelemento = $idfncelement;
            $model->formato = $values['formato'];
            $model->generada = (empty($values['generada'])) ? 0 : 1;
            $model->nombreparametro = (empty($values['nombreparametro'])) ? null : $values['nombreparametro'];
            $model->save();
        }catch(Exception $e){
            throw $e;
        }
    }
}