<?php

class DatActividadentidadautomaticoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatActividadentidadautomatico $DatActividadentidadautomatico
    )
    {
        $DatActividadentidadautomatico->save();
    }

    public function Actualizar(DatActividadentidadautomatico $DatActividadentidadautomatico
    )
    {
        $DatActividadentidadautomatico->save();
    }

    public function Eliminar($DatActividadentidadautomatico)
    {
        $DatActividadentidadautomatico->delete();
    }

    public function eliminarAutomaticoPorRegla($idregla)
    {
        /*Buscar todas las entidades asociadas por automatico a travez de esta regla*/
        $asocActEntConAutomatico
            = DatActividadentidadautomatico::buscarTodasLasAsociacionesAutomaticas(
                $idregla
            );

        foreach ($asocActEntConAutomatico as $asocActentManualAuto) {
            if ($asocActentManualAuto->DatActividadentidadmanual->idactividadentidad
                != null
            ) {
                /*Si existe la asoc manual solo se elimina la asoc_actent_automatica*/
                if ($asocActentManualAuto->DatActividadentidadautomatico->idactividadentidad
                    != null
                ) {
                    $asocActentManualAuto->DatActividadentidadautomatico->delete(
                    );
                }
            } else {
                $asocActEnt = Doctrine::getTable('DatActividadentidad')->find(
                    $asocActentManualAuto->idactividadentidad
                );
                $asocActEnt->delete();
            }
        }
        return true;
    }

}

//fin clase
