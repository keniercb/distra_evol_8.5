<?php
 class ConfCalendarioSNCModel extends ZendExt_Model {

    public function ConfCalendarioModel() {
        parent::ZendExt_Model();
    }
	
    public function asociarConfCalendario() {
        return 'ok';
    }

    public function obtenerConfCalendario($anno) {
        $cont = 0;
        $arrayfinal = array();
        $objMeses = new NomMes();
        $objCalendario = new ConfCalendarioSNC();
        $arraymeses = $objMeses->obteneTodosNomMes();
        foreach($arraymeses as $i=>$value){
            $arrayfinal[$cont]['idmes'] = $value['idmes'];
            $arrayfinal[$cont]['mes']= $value['denominacion'];
            $arrayfinal[$cont]['anno']= $anno;
            $tieneConfCalendario = $objCalendario->tieneConfCalendario($value['idmes'], $anno);
            if($tieneConfCalendario>0){
                $arraycalendario = $objCalendario->obtenerArrCantidadDias($value['idmes'], $anno);
                $arrayfinal[$cont]['idcalendario']= $arraycalendario[0]['idcalendario'];
                $arrayfinal[$cont]['cantdias']= $arraycalendario[0]['cantdias'];
            }
            $cont++;
        }
        return $arrayfinal;
    }

    public function adicionarCalendario($arraydias, $arraymeses, $annos){
        foreach($arraydias as $i=>$value){
            if($value>31){
                return 'error';
            }
            $objDomain = new ConfCalendarioSNC();
            $objDomain->idmes = $arraymeses[$i];
            $objDomain->cantdias = $value;
            $objDomain->anno = $annos;
            $objDomain->save();
        }
        return 'ok';
    }

    public function actualizarCalendario($arrayidcalendario, $arraymoddias){
        foreach($arrayidcalendario as $v=>$val){
            $objActualizar = ConfCalendarioSNC::obtenerConfCalendario($val);
            $objActualizar->cantdias = $arraymoddias[$v];
            $objActualizar->save();
        }
        return 'ok';
    }

}
