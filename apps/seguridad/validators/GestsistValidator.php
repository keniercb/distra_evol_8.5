<?php

/**
 * @name SistemaValidator - Clase de validación de Sistemas.
 * @package   seguridad
 * @copyright UCID
 * @author    Darien García Tejo.
 * @version   2.0-0
 */
class GestsistValidator
{

    /**
     * @method InsertarSistema - Válida que en la raiz del sistema no
     *  exista otro con el mismo nombre.
     *
     * @return TRUE | ZendExt_Exception
     */
    public function InsertarSistema()
    {
        $denominacion = $_POST['denominacion'];
        $idpadre = $_POST['idpadre'];

        $longitud = strlen($denominacion);
        if ($denominacion[$longitud-1] == " ") {
            $denominacion = substr($denominacion, 0, strlen($denominacion) - 1);
        }

        if (DatSistema::verificarNombreSistema($idpadre, $denominacion, null) > 0) {
            echo "{'success': 'false'}";
            throw new ZendExt_Exception('SEGSIST01');
        } else {
            return true;
        }
    }

    /**
     * @method ModificarSistema - Válida que en la raiz del sistema no exista
     * otro con el mismo nombre, una ves modificado.
     *
     * @return TRUE | ZendExt_Exception
     */
    public function ModificarSistema()
    {
        $denominacion = $_POST['denominacion'];
        $idpadre = $_POST['idpadre'];
        $idsistema = $_POST['idsistema'];

        $longitud = strlen($denominacion);
        if ($denominacion[$longitud-1] == " ") {
            $denominacion = substr($denominacion, 0, strlen($denominacion) - 1);
        }

        if (DatSistema::verificarNombreSistema($idpadre, $denominacion, $idsistema) > 0) {
            echo "{'success': 'false'}";
            throw new ZendExt_Exception('SEGSIST02');
        } else {
            return true;
        }
    }

    /**
     * @method eliminarSistema - Válida que el sistema que se desea eliminar
     *  no se encuentre en uso por un usuario.
     *
     * @return TRUE | ZendExt_Exception
     */
    public function eliminarSistema()
    {
        $idsistema = $_POST['idsistema'];
        if (DatSistema::verificarSistemaUsoUsuario($idsistema) > 0) {
            throw new ZendExt_Exception('SEGSIST03');
        } else {
            return true;
        }
    }

    /**
     * @method InsertarFuncionalidad - Función usada para validar que no se
     * repita la denominación de una funcionalidad dentro de un mismo sistema.
     *
     * @return TRUE | ZendExt_Exception
     */
    public function InsertarFuncionalidad()
    {
        $denominacion = $_POST['denominacion'];
        $longitud = strlen($denominacion);
        if ($denominacion[$longitud-1] == " ") {
            $denominacion = substr($denominacion, 0, strlen($denominacion) - 1);
        }
        if (DatFuncionalidad::verificarFuncionalidad('denominacion', $denominacion, $_POST['idsistema'], null) > 0) {
            echo "{'success': 'false'}";
            throw new ZendExt_Exception('SEGFUNCIONALIDAD01');
        }
        if (DatFuncionalidad::verificarFuncionalidad('referencia', $_POST['referencia'], $_POST['idsistema'], null) > 0
        ) {
            echo "{'success': 'false'}";
            throw new ZendExt_Exception('SEGFUNCIONALIDAD02');
        }
        return true;
    }

    /**
     * @method ModificarFuncionalidad - Función usada para validar que no
     * se repita la denominación de una funcionalidad dentro de un mismo
     * sistema una ves modificada.
     *
     * @return TRUE | ZendExt_Exception
     */
    public function ModificarFuncionalidad()
    {
        $idfuncionalidad = $_POST['idfuncionalidad'];
        $denominacion = $_POST['denominacion'];
        $longitud = strlen($denominacion);
        if ($denominacion[$longitud-1] == " ") {
            $denominacion = substr($denominacion, 0, strlen($denominacion) - 1);
        }
        $idsistema = $_POST['idsistema'];
        $referencia = $_POST['referencia'];
        $funcionalidad = Doctrine::getTable('DatFuncionalidad')
            ->find($idfuncionalidad);
        if ($funcionalidad->denominacion != $denominacion) {
            if (DatFuncionalidad::verificarFuncionalidad('denominacion', $denominacion, $idsistema, $idfuncionalidad)
                > 0
            ) {
                echo "{'success': 'false'}";
                throw new ZendExt_Exception('SEGFUNCIONALIDAD01');
            }
        }
        if ($funcionalidad->referencia != $referencia) {
            if (DatFuncionalidad::verificarFuncionalidad('referencia', $referencia, $idsistema, $idfuncionalidad) > 0) {
                echo "{'success': 'false'}";
                throw new ZendExt_Exception('SEGFUNCIONALIDAD02');
            }
        }
        return true;
    }

    /**
     * @method EliminarFuncionalidad - Válida que la funcionalidad que se
     * desea eliminar no este asignada a un usuario activo.
     *
     * @return TRUE | ZendExt_Exception
     */
    public function EliminarFuncionalidad()
    {
        $idfuncionalidad = $_POST['idfuncionalidad'];
        if (DatFuncionalidad::verificarFuncionalidadUsoUsuario($idfuncionalidad) > 0) {
            echo "{'success': 'false'}";
            throw new ZendExt_Exception('SEGFUNCIONALIDAD03');
        } else {
            return true;
        }
    }

    /**
     * @method adicionarAccion - Función usada para validar que el nombre
     *  de una acción no se repita.
     *
     * @return bool | ZendExt_Exception
     */
    function adicionarAccion()
    {
        $denominacion = $_POST['denominacionacc'];
        $longitud = strlen($denominacion);
        if ($denominacion[$longitud-1] == " ") {
            $denominacion = substr($denominacion, 0, strlen($denominacion) - 1);
        }
        $idfuncionalidad = $_POST['idfuncionalidad'];
        if (DatAccion::verificarAccion('denominacion', $denominacion, $idfuncionalidad, null) > 0) {
            echo "{'success': 'false'}";
            throw new ZendExt_Exception('SEGACC001');
        }
        return true;
    }

    /**
     * @method modificarAccion - Función usada para validar que el nombre
     * de una acción no se repita.
     *
     * @return bool | ZendExt_Exception
     */
    function modificarAccion()
    {
        return true;
    }

    /**
     * @method adicionarRecurso - Válida que la denominación de un recurso
     * no se repita dentro de una misma funcionalidad.
     *
     * @return TRUE | ZendExt_Exception
     */
    public function adicionarRecurso()
    {
        $denominacion = $_POST['denominacion'];
        $longitud = strlen($denominacion);
        if ($denominacion[$longitud-1] == " ") {
            $denominacion = substr($denominacion, 0, strlen($denominacion) - 1);
        }
        $abreviatura = $_POST['abreviatura'];
        $idfuncionalidad = $_POST['idfuncionalidad'];
        if (DatRecurso::verificarRecurso('denominacion', $denominacion, $idfuncionalidad, null) > 0) {
            echo "{'success': 'false'}";
            throw new ZendExt_Exception('SEGREC002');
        }
        if ($abreviatura) {
            if (DatRecurso::verificarRecurso('abreviatura', $abreviatura, $idfuncionalidad, null) > 0) {
                echo "{'success': 'false'}";
                throw new ZendExt_Exception('SEGREC003');
            }
        }
        return true;
    }

    /**
     * @method modificarRecurso - Válida que la denominación de un recurso
     * no se repita dentro de una misma funcionalidad una ves que este
     * es modificado.
     *
     * @return TRUE | ZendExt_Exception
     */
    public function modificarRecurso()
    {
        $denominacion = $_POST['denominacion'];
        $longitud = strlen($denominacion);
        if ($denominacion[$longitud-1] == " ") {
            $denominacion = substr($denominacion, 0, strlen($denominacion) - 1);
        }
        $abreviatura = $_POST['abreviatura'];
        $idfuncionalidad = $_POST['idfuncionalidad'];
        $idrecurso = $_POST['idrecurso'];
        $datRecurso = Doctrine::getTable('DatRecurso')->find($idrecurso);
        if ($datRecurso->denominacion != $denominacion) {
            if (DatRecurso::verificarRecurso('denominacion', $denominacion, $idfuncionalidad, $idrecurso) > 0) {
                echo "{'success': 'false'}";
                throw new ZendExt_Exception('SEGREC002');
            }
        }
        if ($datRecurso->abreviatura != $abreviatura) {
            if (DatRecurso::verificarRecurso('abreviatura', $abreviatura, $idfuncionalidad, $idrecurso) > 0) {
                echo "{'success': 'false'}";
                throw new ZendExt_Exception('SEGREC003');
            }
        }
        return true;
    }

    /**
     * @method validarRecurso - Válida que el recurso modificado no se quede
     * sin acciones.
     *
     * @return TRUE | ZendExt_Exception
     */
    public function validarRecurso()
    {
        //$global = ZendExt_GlobalConcept::getInstance();
        $idrecurso = $_POST['idrecurso'];
        $arrayNodesDel = json_decode(stripslashes($_POST['arrayNodesElim']));
        $arrayNodesAdd = json_decode(stripslashes($_POST['arrayNodesChecked']));
        $arrayRecursos = DatFuncionalidadDatAccion::getArrayAccionesByIdRecurso(
            $idrecurso
        );
        if (count($arrayNodesAdd) == 0
            && count($arrayNodesDel[0]->acciones) == count($arrayRecursos)
        ) {
            return false;
        }
        echo "{'codMsg':10,'mensaje': 'El recurso esta sin acciones. <br>Si "
            . "le retira todas las acciones al recurso dejará de existir."
            . " ¿Desea seguir con la operación?</br>'}";
    }

}
