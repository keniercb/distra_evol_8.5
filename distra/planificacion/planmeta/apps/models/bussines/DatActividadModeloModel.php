<?php

class DatActividadModeloModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatActividadmodelo $DatActividadModelo)
    {
        $DatActividadModelo->save();
    }

    public function Actualizar(DatActividadmodelo $DatActividadModelo)
    {
        $DatActividadModelo->save();
    }

    public function Eliminar($DatActividadModelo)
    {
        $DatActividadModelo->delete();
    }

    public function adicionar($idactividad, $idmodelo)
    {
        $nuevaAsocActmod = new DatActividadmodelo();
        $nuevaAsocActmod->idactividad = $idactividad;
        $nuevaAsocActmod->idmodelo = $idmodelo;
        $nuevaAsocActmod->save();
        return true;
    }

    public function eliminarAsoc($idactividad)
    {
        $query = Doctrine_Query::create();
        $query->delete('DatActividadmodelo')
            ->from('DatActividadmodelo am')
            ->where('am.idactividad = ?', $idactividad)->execute();
        return true;
    }

    public function adicionarVariasAsocActividadModelo($actividades, $idmodelo)
    {

        if ($actividades[0] != null) {
            $query = Doctrine_Query::create();
            $query->delete('DatActividadmodelo')
                ->from('DatActividadmodelo am')
                ->whereIn('am.idactividad', $actividades)->execute();
            if ($idmodelo != null) {
                $arrayCollActMod = new Doctrine_Collection(
                    Doctrine:: getTable("DatActividadmodelo")
                );
                $ptr = 0;
                foreach ($actividades as $idactividad) {
                    $arrayCollActMod[$ptr]->idactividad = $idactividad;
                    $arrayCollActMod[$ptr]->idmodelo = $idmodelo;
                    $ptr++;
                }
                $arrayCollActMod->save();
            }
        }
        return true;
    }

    public function adicionarVariasAsocActividadModeloSalida($actividades, $idmodelo)
    {

        if ($actividades[0] != null) {
            $query = Doctrine_Query::create();
            $query->delete('DatActividadmodelosalida')
                ->from('DatActividadmodelosalida am')
                ->whereIn('am.idactividad', $actividades)->execute();
            if ($idmodelo != null) {
                $arrayCollActMod = new Doctrine_Collection(
                    Doctrine:: getTable("DatActividadmodelosalida")
                );
                $ptr = 0;
                foreach ($actividades as $idactividad) {
                    $arrayCollActMod[$ptr]->idactividad = $idactividad;
                    $arrayCollActMod[$ptr]->idmodelo = $idmodelo;
                    $ptr++;
                }
                $arrayCollActMod->save();
            }
        }
        return true;
    }

}

//fin clase
