<?php

class DatContratoConsecutivo extends BaseDatContratoConsecutivo{

    public function setUp()
    {
        parent::setUp();
		$this->hasOne('DatContrato', array('local' => 'idcontrato', 'foreign' => 'idcontrato'));
    }

    public function getConsecutivoById($idcontrato)
    {
        $query = Doctrine_Query::create()
            ->from('DatContratoConsecutivo')
            ->where('idcontrato =?', $idcontrato);

        return $query->fetchOne(array(), Doctrine_Core::HYDRATE_ARRAY);
    }

    public function initConsecutivoContrato($idcontrato, $idconsecutivo)
    {

        $model=Doctrine::getTable('DatContratoConsecutivo')->find(
            $idcontrato
        );
        if(!$model)$model = new DatContratoConsecutivo();
        $model->idcontrato = $idcontrato;
        $model->consecutivoespecifico = 1;
        $model->consecutivosuplemento = 1;
        $model->consecutivo = $idconsecutivo;
        $model->save();
    }

//    public function guardarConsecutivoContrato($idcontrato, $idconsecutivo)
//    {
//        $model = new DatContratoConsecutivo();
//        if($params['idcontrato'] && $params['idcontrato']!=''){
//            $model=Doctrine::getTable('DatContratoConsecutivo')
//                ->find($params['idcontrato']);
//        }
//        $model->idcontrato = $idcontrato;
//        $model->consecutivoespecifico = 1;
//        $model->consecutivosuplemento = 1;
//        $model->consecutivo = $idconsecutivo;
//        $model->save();
//    }

    public function incrementarConsecutivoEspecifico($idcontrato)
    {
        
        $this->incrementarConsecutivo($idcontrato, 'consecutivoespecifico');
    }

    public function incrementarConsecutivoSuplemento($idcontrato)
    {
        $this->incrementarConsecutivo($idcontrato, 'consecutivosuplemento');
    }

    public function incrementarConsecutivo($idcontrato, $consName)
    {
        Doctrine_Query::create()
            ->update('DatContratoConsecutivo')
            ->set($consName, $consName.' + 1')
            ->where('idcontrato =?', $idcontrato)
            ->execute();
    }

}