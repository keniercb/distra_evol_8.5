<?php
class DatCargosIncrementoMensualModel extends ZendExt_Model {

    public function DatCargosIncrementoMensualModel() {
        parent::ZendExt_Model();
    }

    public function addCargosIncMensual($arregloDatos) {

        foreach ($arregloDatos as $i => $valor)
        {   $cargo = $arregloDatos[$i]->idcargo;
            $estructura = $arregloDatos[$i]->idestructura;
            $contador = DatCargosIncrementoMensual::existeCargo($cargo,$estructura);

            if($contador[0]['count'] == 0)
            {
                $obj = new DatCargosIncrementoMensual();
                $obj->idcargo 				= $arregloDatos[$i]->idcargo;
                $obj->idestructura         		= $arregloDatos[$i]->idestructura;
                $obj->save();
            }
        }
    }

    public function getCargosIncMensual($identidad)
    {
        $arrayCargos = DatCargosIncrementoMensual::getCargoxEntidad($identidad);
        return $arrayCargos;
    }
    
    public function deleteCargosIncMensual($arrayid) {
        foreach ($arrayid as $i => $valor)
        {
            $obj = Doctrine::getTable('DatCargosIncrementoMensual')->find($valor->idtabla);
            $obj->delete();
        }
    }

    public function existeCargoAnual($arregloDatos)
    {
        $araycargosanual = array();
        $cont = 0;
        foreach ($arregloDatos as $i => $valor)
        {
            $cargo = $valor->idcargo;
            $estructura = $valor->idestructura;
            $existe = DatCargosIncrementoMensual::existeCargoAnual($cargo,$estructura);

            if($existe[0]['count'] > 0)
            {
                $araycargosanual[$cont]['idcargo']=$cargo;
                $araycargosanual[$cont]['idestructura']=$estructura;

            }
            $cont++;
        }

         return $araycargosanual;

    }
}
