<?php

class NomFormatoNumContrato extends BaseNomFormatoNumContrato
{

    public function setUp()
    {
        parent::setUp();
		$this->hasMany('NomFormatoNumContratoElemento', array('local' => 'idformatonumcontrato', 'foreign' => 'idformatonumcontrato'));
		$this->hasMany('ConfEntidadFormatoNumContrato', array('local' => 'idformatonumcontrato', 'foreign' => 'idformatonumcontrato'));
    }

    public function getFormatoNumContrato()
    {
        return Doctrine_Query::create()
            ->from('NomFormatoNumContrato')
            ->fetchArray();
    }

    public function getModelData()
    {
        $query = Doctrine_Query::create()
            ->select('f.*, fe.*, fef.*, fet.*, fen.*, fenom.*, fenomv.*, feparam.*')
            ->from('NomFormatoNumContrato f')
            ->leftJoin('f.NomFormatoNumContratoElemento fe')
            ->leftJoin('fe.NomFormatoNumContratoElementoFecha fef')
            ->leftJoin('fe.NomFormatoNumContratoElementoTexto fet')
            ->leftJoin('fe.NomFormatoNumContratoElementoNumerico fen')
            ->leftJoin('fe.NomFormatoNumContratoElementoNomenclador fenom')
            ->leftJoin('fenom.NomFormatoNumContratoElementoNomencladorValor fenomv')
            ->leftJoin('fe.NomFormatoNumContratoElementoParametro feparam')
            ->orderBy('f.denominacion, fe.orden');

        $datos = $query->fetchArray();

        foreach($datos as &$value){
            $value['preview'] = $this->buildPreviewFormatoNumContrato($value['NomFormatoNumContratoElemento']);
            $value['elementos'] = $this->buildListElementos($value['NomFormatoNumContratoElemento']);
            unset($value['NomFormatoNumContratoElemento']);
        }

        return array('cant' => $query->Count(), 'data' => $datos);
    }

    private function buildPreviewFormatoNumContrato($element)
    {
        $preview = '';

        foreach($element as $val){
            $preview .= $val['ejemplo'];
        }

        return $preview;
    }

    private function buildListElementos($element)
    {
        $result = array();

        foreach($element as $val){

            array_push($result, array(
                'idformatonumcontratoelemento' => $val['idformatonumcontratoelemento'],
                'denominacion' => $val['denominacion'],
                'ejemplo' => $val['ejemplo'],
                'orden' => $val['orden'],
                'tipo' => $val['tipo'],
                'idformatonumcontrato' => $val['idformatonumcontrato'],
                'tipoinfo' => $val[$this->getTableNameByType($val['tipo'])]
            ));
        }

        return $result;
    }

    private function getTableNameByType($type)
    {
        switch($type){
            case 1 : return 'NomFormatoNumContratoElementoTexto';
            case 2 : return 'NomFormatoNumContratoElementoFecha';
            case 3 : return 'NomFormatoNumContratoElementoNumerico';
            case 4 : return 'NomFormatoNumContratoElementoNomenclador';
            case 5 : return 'NomFormatoNumContratoElementoParametro';
            case 6 : return 'NomFormatoNumContratoElementoNumerico';
            case 7 : return 'NomFormatoNumContratoElementoNumerico';
            case 8 : return 'NomFormatoNumContratoElementoNumerico';
        }
    }

    public function postInsertValues($out)
    {
        try {
            $elements = json_decode($out['params']['elementos'], true);
            $this->insertElementos($out['model']->idformatonumcontrato, $elements);
        }catch(Exception $e){
            throw $e;
        }
    }

    public function postModifyValues($out)
    {
        try {
            $elements = json_decode($out['params']['elementos'], true);
    //        $this->deleteElementoByIdFormatoNumContrato($out['model']->idformatonumcontrato);
            $this->deleteElementoById($out['model']->idformatonumcontrato, $elements);
            $this->insertElementos($out['model']->idformatonumcontrato, $elements);
        }catch(Exception $e){
            throw $e;
        }
    }

    private function insertElementos($idformatonumcontrato, $values)
    {
        try{
            foreach($values as $elem){
                $model = new NomFormatoNumContratoElemento();
                if($elem['idformatonumcontratoelemento'] && $elem['idformatonumcontratoelemento']!=''){
                    $model = Doctrine::getTable('NomFormatoNumContratoElemento')->find(
                        $elem['idformatonumcontratoelemento']
                    );
                }
//                $model->denominacion = $elem['denominacion'];
//                $model->ejemplo = $elem['ejemplo'];
//                $model->orden = $elem['orden'];
//                $model->tipo = $elem['tipo'];
//                $model->idformatonumcontrato = $idformatonumcontrato;
                $elem['idformatonumcontrato']=$idformatonumcontrato;
                $model->synchronizeWithArray($elem);
                $model->save();

                $className = $this->getTableNameByType($elem['tipo']);
                $className::insertValue($model->idformatonumcontratoelemento, $elem['tipoinfo']);
            }
        }catch(Exception $e){
            throw $e;
        }

    }

    private function deleteElementoById($idformatonc, $elementos)
    {
        try{
            $ids=array();
            foreach($elementos as $e){
                if($e['idformatonumcontratoelemento'] && $e['idformatonumcontratoelemento']!='')
                    $ids[]=$e['idformatonumcontratoelemento'];
            }
            $query = new Doctrine_Query();
            $query ->delete()
                ->from('NomFormatoNumContratoElemento fnce')
                ->whereNotIn('fnce.idformatonumcontratoelemento', $ids)
                ->andWhere('fnce.idformatonumcontrato=? ', $idformatonc)
                ->execute();
//            print_r($r);die;
        }catch(Exception $e){
            throw $e;
        }
    }

    private function deleteElementoByIdFormatoNumContrato($idformatonc)
    {
        $query = new Doctrine_Query();
        $query ->delete()
                ->from('NomFormatoNumContratoElemento fnce')
                ->where('fnce.idformatonumcontrato=?', $idformatonc)
                ->execute();
    }
}