<?php

/**
 * @name AccionValidator - Clase encargada de la validación de las acciones.
 * @package seguridad
 * @copyright UCID
 * @author Darien García Tejo.
 * @version 2.0-0
 */
class AccionValidator
{

    /**
     * @method adicionarAccion - Función usada para validar que el 
     * nombre de una acción no se repita.
     * @return bool | ZendExt_Exception
     */
    function adicionarAccion()
    {
        $denominacion = $_POST['denominacion'];
        $idfuncionalidad = $_POST['idfuncionalidad'];
        if (DatAccion::verificarAccion(
            'denominacion', $denominacion, $idfuncionalidad, null
        ) > 0)
            throw new ZendExt_Exception('SEGACC001');
        return true;
    }

    /**
     * @method modificarAccion - Función usada para validar que el nombre de 
     * una acción no se repita.
     * @return bool | ZendExt_Exception
     */
    function modificarAccion()
    {
        $denominacion = $_POST['denominacion'];
        $idfuncionalidad = $_POST['idfuncionalidad'];
        $idaccion = $_POST['idaccion'];
        $datAccion = Doctrine::getTable('DatAccion')->find($idaccion);
        if ($datAccion->denominacion != $denominacion) {
            if (DatAccion::verificarAccion(
                'denominacion', $denominacion, $idfuncionalidad, $idaccion
            ) > 0)
                throw new ZendExt_Exception('SEGACC002');
        }
        return true;
    }

}