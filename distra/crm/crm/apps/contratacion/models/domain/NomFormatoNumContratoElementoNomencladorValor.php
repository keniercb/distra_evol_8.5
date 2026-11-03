<?php

class NomFormatoNumContratoElementoNomencladorValor extends BaseNomFormatoNumContratoElementoNomencladorValor
{
    public function setUp()
    {
        parent::setUp();
		$this->hasOne('NomFormatoNumContratoElementoNomenclador', array('local' => 'idformatonumcontratoelemento', 'foreign' => 'idformatonumcontratoelemento'));
    }

    public static function insertValue($idfncelement, $value)
    {
        try {
            foreach ($value as $val) {
                $model = Doctrine::getTable('NomFormatoNumContratoElementoNomencladorValor')->find($val['idformatonumcontratoelementonomencladorvalor']);
                if (!$model) {
                    $model = new NomFormatoNumContratoElementoNomencladorValor();
                }
                $model->idnomencladorelemento = $val['idnomencladorelemento'];
                $model->valor = $val['valor'];
                $model->idformatonumcontratoelemento = $idfncelement;
                $model->save();
            }
        }catch(Exception $e){
            throw $e;
        }
    }
}