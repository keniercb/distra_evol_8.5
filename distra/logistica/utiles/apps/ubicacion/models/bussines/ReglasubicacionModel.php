<?php

class ReglasubicacionModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function guardarReglas($datos)
    {
        if (!self::existe($datos['idconfigubicacion'])) {
            $conf = new Datconfigubicacion();
            $conf->synchronizeWithArray($datos);
            $conf->save();
            return true;
        } else {
            $conf = Doctrine:: getTable('Datconfigubicacion')->find($datos['idconfigubicacion']);
            $conf->synchronizeWithArray($datos);
            $conf->save();
            return true;
        }
    }

    public function existe($idconfigubicacion)
    {
        $area = Doctrine:: getTable('Datconfigubicacion')->find($idconfigubicacion);
        if ($area != null) {
            return true;
        } else {
            return false;
        }
    }

    public function cargaInicial($estructura)
    {
        $objeto = new Datconfigubicacion();
        $datos = $objeto->cargarDatos($estructura);
        return $datos;
    }

    public function Eliminar($DatArea)
    {
        $DatArea->delete();
    }

}