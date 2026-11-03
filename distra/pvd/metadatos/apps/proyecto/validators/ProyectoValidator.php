<?php

/**
 * Class ProyectoValidator
 */
class ProyectoValidator
{
    /**
     * @return bool
     */
    public function ValidarInsertarProyecto()
    {
        $clase = $_POST['clase'];
        $accion = $_POST['accion'];
        $data = json_decode(stripslashes($_POST['parametros']));
        if ($clase == 'proyecto' && $accion == 'insertar') {
            $valores = $data[1];
            $denominacion = $valores->denominacion;
            $clase = new DatProyectoModel();
            if ($clase->existeDenominacion($denominacion)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return bool
     */
    public function ValidarModificarProyecto()
    {
        $clase = $_POST['clase'];
        $accion = $_POST['accion'];
        $data = json_decode(stripslashes($_POST['parametros']));
        if ($clase == 'proyecto' && $accion == 'modificar') {
            $idProyecto = $data[0];
            $data = $data[1];
            $denominacion = $data->denominacion;
            $clase = new DatProyectoModel();
            if ($clase->existeDenominacion($denominacion, true, $idProyecto)) {
                return false;
            }
        }

        return true;
    }
}
