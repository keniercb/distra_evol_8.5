<?php

/**
 * @name SistemaValidator - Clase de validación de Sistemas.
 * @package seguridad
 * @copyright UCID
 * @author Darien García Tejo.
 * @version 2.0-0
 */
class SistemaValidator
{

    /**
     * @method InsertarSistema - Válida que en la raiz del sistema no 
     * exista otro con el mismo nombre.
     * @return TRUE | ZendExt_Exception
     */
    public function InsertarSistema()
    {
        $denominacion = $_POST['denominacion'];
        $idpadre = $_POST['idpadre'];
        if (DatSistema::verificarNombreSistema(
            $idpadre, $denominacion, NULL
        ) > 0)
            throw new ZendExt_Exception('SEGSIST01');
        else
            return true;
    }

    /**
     * @method ModificarSistema - Válida que en la raiz del sistema no
     *  exista otro con el mismo nombre, una ves modificado.
     * @return TRUE | ZendExt_Exception
     */
    public function ModificarSistema()
    {
        $denominacion = $_POST['denominacion'];
        $idpadre = $_POST['idpadre'];
        $idsistema = $_POST['idsistema'];
        if (DatSistema::verificarNombreSistema(
            $idpadre, $denominacion, $idsistema
        ) > 0)
            throw new ZendExt_Exception('SEGSIST02');
        else
            return true;
    }

    /**
     * @method eliminarSistema - Válida que el sistema que se desea 
     * eliminar no se encuentre en uso por un usuario.
     * @return TRUE | ZendExt_Exception
     */
    public function eliminarSistema()
    {
        $idsistema = $_POST['idsistema'];
        if (DatSistema::verificarSistemaUsoUsuario($idsistema) > 0)
            throw new ZendExt_Exception('SEGSIST03');
        else
            return true;
    }

}

