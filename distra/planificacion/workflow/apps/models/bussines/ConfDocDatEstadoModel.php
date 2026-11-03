<?php

class ConfDocDatEstadoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(ConfDocDatEstado $confDocDatEstado)
    {
        $confDocDatEstado->save();
    }

    public function Actualizar(ConfDocDatEstado $confDocDatEstado)
    {
        $confDocDatEstado->save();
    }

    public function Eliminar($idtdoc, $idestado)
    {
        $conn = Zend_Registry::get('conexion');
        $conn->execute(
            "delete from mod_flujotrabajo.conf_doc_dat_estado 
            where idtipodoc = '$idtdoc' and idestado = '$idestado';"
        );
    }

    public function ObtenerConfDocEstado()
    {
        $confdocestado = ConfDocDatEstado::ObtenerConfDocEstado();
        return $confdocestado;
    }
}

