<?php

class NomFormatoNumContratoElementoNomenclador extends BaseNomFormatoNumContratoElementoNomenclador
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomFormatoNumContratoElemento', array('local' => 'idformatonumcontratoelemento', 'foreign' => 'idformatonumcontratoelemento'));
        $this->hasMany('NomFormatoNumContratoElementoNomencladorValor', array('local' => 'idformatonumcontratoelemento', 'foreign' => 'idformatonumcontratoelemento'));
    }

    public static function insertValue($idfncelement, $value)
    {
        try {
            $model = Doctrine::getTable('NomFormatoNumContratoElementoNomenclador')->find($idfncelement);
            if (!$model) {
                $model = new NomFormatoNumContratoElementoNomenclador();
            }
            $model->idformatonumcontratoelemento = $idfncelement;
            $model->idnomenclador = $value['idnomenclador'];
            $model->nombreparametro = $value['nombreparametro'];
            $model->save();

            NomFormatoNumContratoElementoNomencladorValor::insertValue($model->idformatonumcontratoelemento, $value['NomFormatoNumContratoElementoNomencladorValor']);
        }catch(Exception $e){
            throw $e;
        }
    }
}