<?php

class NomFormatoNumContratoElementoNumerico extends BaseNomFormatoNumContratoElementoNumerico
{
    public function setUp()
    {
        parent::setUp();
		$this->hasOne('NomFormatoNumContratoElemento', array('local' => 'idformatonumcontratoelemento', 'foreign' => 'idformatonumcontratoelemento'));
		$this->hasMany('ConfEntidadFormatoNumContratoIncremento', array('local' => 'idformatonumcontratoelemento', 'foreign' => 'idformatonumcontratoelemento'));
    }

    public static function insertValue($idfncelement, $values)
    {
        try{
            $model = Doctrine::getTable('NomFormatoNumContratoElementoNumerico')->find($idfncelement);
            if(!$model){
                $model = new NomFormatoNumContratoElementoNumerico();
            }
            $model->idformatonumcontratoelemento = $idfncelement;
            $model->longitud = $values['longitud'];
            $model->incluircerosizquierda = (empty($values['incluircerosizquierda']))?0:1;
            $model->save();
        }catch(Exception $e){
            throw $e;
        }
    }
}