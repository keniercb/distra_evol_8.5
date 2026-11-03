<?php

class DatEntidadmodeloModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatEntidadmodelo $DatEntidadmodelo)
    {
        $DatEntidadmodelo->save();
    }

    public function Actualizar(DatEntidadmodelo $DatEntidadmodelo)
    {
        $DatEntidadmodelo->save();
    }

    public function listarDestinoControlDivisa($parametros, $idcontroldivisa,
        $idEstructura
    )
    {
        return DatEntidadmodelo::ObtenerPlanesCD(
            $parametros, $idcontroldivisa, $idEstructura
        );
    }

    public function Eliminar($identidadmodelo, $idmodelo)
    {

        //obtiene todos los indicadores que estan en un modelo especifico
        $indicadores = DatModelo::obtenerTodosIndPlanificadosEnModelo(
            $identidadmodelo
        );
        foreach ($indicadores as $key => $ind) {
            $indExistente = DatModelo::dameIndPlanificadoEnModelo(
                $identidadmodelo, $ind['idindicador']
            );

            DatModeloModel::eliminarIndmodPlan($indExistente->idplanificacion);
        }
        $entidad = DatEntidadmodelo::listarEntMod($idmodelo);
        foreach ($entidad as $key => $ent) {

            $modelo = new DatEntidadmodelo();
            $modelo = Doctrine::getTable('DatEntidadmodelo')->find(
                $ent['identidadmodelo']
            );
            $modelo->delete();
        }

    }


    public function idEntidadModelo($idmodelo, $identOD)
    {
        $datos = DatEntidadmodelo::getIdentidadmodelo($idmodelo, $identOD);
        return $datos;
    }

    public function desasociarEntMod($entidades)
    {
        foreach ($entidades as $value) {

            $objentidadmodelo = Doctrine::getTable('DatEntidadmodelo')->find(
                $value[1]
            );
            if ($objentidadmodelo->identidadmodelo != null) {
                $prioridad = $objentidadmodelo->prioridad;
                $update = DatEntidadmodelo::prioridadMayorQue($value[0], $prioridad);
                if ($update[0] != null) {
                    foreach ($update as $v) {
                        $actualizar = Doctrine::getTable('DatEntidadmodelo')
                            ->find($v['identidadmodelo']);
                        $actualizar->prioridad = $actualizar->prioridad - 1;
                        $actualizar->save();
                    }
                }


                if ($actualizar || $update[0] == null) {
                    $objentidadmodelo->delete();
                    $data = 1;
                } else {
                    $data = 2;
                }
            } else {
                $data = 4;
            }
        }
        return $data;
    }

    public function getModeloEntidad($identidad){
    $result = DatEntidadmodelo::getModeloEntidad($identidad);
    return $result;

    }

}

//fin clase

