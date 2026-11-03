<?php
class ConfCargosCertificacionIncrementoModel extends ZendExt_Model {

    public function ConfCargosCertificacionIncrementoModel() {
        parent::ZendExt_Model();
    }

    public function addCargosCertificacionInc($arregloDatos) {
        foreach ($arregloDatos as $i => $valor)
        {   $cargo = $arregloDatos[$i]->idcargo;
            $estructura = $arregloDatos[$i]->idestructura;
            $contador = ConfCargosCertificacionIncremento::existeCargo($cargo,$estructura);
            if($contador[0]['count'] == 0)
            {
                $obj = new ConfCargosCertificacionIncremento();
                $obj->idcargo 				= $arregloDatos[$i]->idcargo;
                $obj->idestructura         		= $arregloDatos[$i]->idestructura;
                $obj->save();
            }
        }
    }

    public function getCargosCertificacionInc($identidad)
    {
        $arrayCargos = ConfCargosCertificacionIncremento::getCargoxEntidad($identidad);
        return $arrayCargos;
    }
    
    public function deletCargosCertificacionInc($arrayid) {
        foreach ($arrayid as $i => $valor)
        {
            $obj = Doctrine::getTable('ConfCargosCertificacionIncremento')->find($valor->idtablacertincremento);
            $obj->delete();
        }
    }
}
