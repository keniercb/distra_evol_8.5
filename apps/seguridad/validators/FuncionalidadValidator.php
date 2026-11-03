<?php

/**
 * @name FuncionalidadValidator - Clase de validación de funcionalidades.
 * @package seguridad.
 * @copyright UCID
 * @author Darien García Tejo.
 * @version 2.0-0
 */
class FuncionalidadValidator
{

    /**
     * @method InsertarFuncionalidad - Función usada para validar que no se 
     * repita la denominación de una funcionalidad dentro de un mismo sistema.
     * @return TRUE | ZendExt_Exception
     */
    public function InsertarFuncionalidad()
    {
        if (DatFuncionalidad::verificarFuncionalidad(
            'denominacion', $_POST['text'], $_POST['idsistema'], null
        ) > 0)
            throw new ZendExt_Exception('SEGFUNCIONALIDAD01');
        if (DatFuncionalidad::verificarFuncionalidad(
            'referencia', $_POST['referencia'], $_POST['idsistema'], null
        ) > 0)
            throw new ZendExt_Exception('SEGFUNCIONALIDAD02');
        return true;
    }

    /**
     * @method ModificarFuncionalidad - Función usada para validar que no 
     * se repita la denominación de una funcionalidad dentro de un mismo 
     * sistema una ves modificada.
     * @return TRUE | ZendExt_Exception
     */
    public function ModificarFuncionalidad()
    {
        $idfuncionalidad = $_POST['idfuncionalidad'];
        $denominacion = $_POST['text'];
        $idsistema = $_POST['idsistema'];
        $referencia = $_POST['referencia'];
        $funcionalidad = Doctrine::getTable('DatFuncionalidad')
            ->find($idfuncionalidad);
        if ($funcionalidad->denominacion != $denominacion) {
            if (DatFuncionalidad::verificarFuncionalidad(
                'denominacion', $denominacion, $idsistema, $idfuncionalidad
            ) > 0)
                throw new ZendExt_Exception('SEGFUNCIONALIDAD01');
        }
        if ($funcionalidad->referencia != $referencia) {
            if (DatFuncionalidad::verificarFuncionalidad(
                'referencia', $referencia, $idsistema, $idfuncionalidad
            ) > 0)
                throw new ZendExt_Exception('SEGFUNCIONALIDAD02');
        }
        return true;
    }

    /**
     * @method EliminarFuncionalidad - Válida que la funcionalidad que 
     * se desea eliminar no este asignada a un usuario activo.
     * @return TRUE | ZendExt_Exception
     */
    public function EliminarFuncionalidad()
    {
        $idfuncionalidad = $_POST['idfuncionalidad'];
        if (DatFuncionalidad::verificarFuncionalidadUsoUsuario(
            $idfuncionalidad
        ) > 0)
            throw new ZendExt_Exception('SEGFUNCIONALIDAD03');
        else
            return true;
    }

}