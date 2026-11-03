<?php

class ConfAsociacionCuentasContables extends BaseConfAsociacionCuentasContables
{
    public function fnObjConfAsociacionCuentasContables()
    {
        return Doctrine_Query::create()
            ->select('*')
            ->from('ConfAsociacionCuentasContables ca')
            ->orderBy('ca.idasociacioncuentascont ASC')
            ->fetchArray();
    }

    public function fnObtenerObjXIdConfAsociacion($idasociacioncuentascont)
    {
        return Doctrine::getTable('ConfAsociacionCuentasContables')->find($idasociacioncuentascont);
    }

    public function fnObtenerConfAsociacionXIdEntidadyTipoNomina($identidad, $idtiponomina)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $idtiponomina = implode(',',$idtiponomina);
        $sql = "select cacc.* 
                from mod_nomina.conf_asociacioncuentascontables cacc 
                where cacc.identidad = ? and cacc.idtiponomina in ({$idtiponomina})";
        return $conn->fetchAll($sql, array($identidad));
    }

    public function fnObtenerListadoAsociacionCuentas($identidad, $idtiponomina)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "select cacc.* 
                from mod_nomina.conf_asociacioncuentascontables cacc 
                where cacc.identidad = ? and cacc.idtiponomina = ?";
        $r = $conn->fetchAll($sql, array($identidad, $idtiponomina));
        return $r;
    }

    public function fnObtenerNomValorContable($idvalorcontable)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT nv.* FROM mod_datosmaestros.nom_valorcontable nv where nv.idvalorcontable = ?";
        $r = $conn->fetchAll($sql, array($idvalorcontable));
        $rfinal = array();
        foreach ($r as $valor){
            $rfinal[$valor['idvalorcontable']] = $valor['nombre'];
        }
        return $rfinal;
    }
}
