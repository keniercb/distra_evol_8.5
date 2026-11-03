<?php
class HisCargosCertificacionIncrementoMensualModel extends ZendExt_Model {

    public function HisCargosCertificacionIncrementoMensualModel() {
        parent::ZendExt_Model();
    }

    public function addCargoshistorico($arregloDatos)
    {

        foreach ($arregloDatos as $k => $valor)
        {
            if( $valor->idcargoincrementomensual != null)
            {
                $objCargosCertif =  Doctrine::getTable('DatCargosIncrementoMensual')->find($valor->idcargoincrementomensual);
                $objCargohistorico = new HisCargosCertificacionIncrementoMensual();
                $objCargohistorico->idcargo = $objCargosCertif->idcargo;
                $objCargohistorico->idestructura = $objCargosCertif->idestructura;
                $objCargohistorico->save();
            }
        }

    }

    public function getHisCargosCertificacionInc($identidad,$fecha)
    {
        $arrayCargos = HisCargosCertificacionIncrementoMensual::getCargoxEntidadHis($identidad,$fecha);
        return $arrayCargos;
    }
  }
