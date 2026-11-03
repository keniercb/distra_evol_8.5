<?php
class HisCargosCertificacionIncrementoModel extends ZendExt_Model {

    public function HisCargosCertificacionIncrementoModel() {
        parent::ZendExt_Model();
    }

    public function addCargoshistorico($arregloDatos)
    {
        foreach ($arregloDatos as $k => $valor)
        {
            if( $valor->idcargoscertificacionincremento != null)
            {
                $objCargosCertif =  Doctrine::getTable('ConfCargosCertificacionIncremento')->find($valor->idcargoscertificacionincremento);
                $objCargohistorico = new HisCargosCertificacionIncremento();
                $objCargohistorico->idcargo = $objCargosCertif->idcargo;
                $objCargohistorico->idestructura = $objCargosCertif->idestructura;
                $objCargohistorico->save();
            }
        }

    }

    public function getHisCargosCertificacionInc($identidad,$fecha)
    {
        $arrayCargos = HisCargosCertificacionIncremento::getCargoxEntidadHis($identidad,$fecha);
        return $arrayCargos;
    }
  }
