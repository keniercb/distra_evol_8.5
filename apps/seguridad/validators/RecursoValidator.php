<?php

/**
 * @name RecursoValidator - Clase de validación de recursos.
 * @package seguridad
 * @copyright UCID
 * @author Darien García Tejo.
 * @version 2.0-0
 */
class RecursoValidator
{

    /**
     * @method adicionarRecurso - Válida que la denominación de un recurso 
     * no se repita dentro de una misma funcionalidad.
     * @return TRUE | ZendExt_Exception
     */
    public function adicionarRecurso()
    {
        $denominacion = $_POST['denominacion'];
        $abreviatura = $_POST['abreviatura'];
        $idfuncionalidad = $_POST['idfuncionalidad'];
        if (DatRecurso::verificarRecurso(
            'denominacion', $denominacion, $idfuncionalidad, null
        ) > 0)
            throw new ZendExt_Exception('SEGREC002');
        if (DatRecurso::verificarRecurso(
            'abreviatura', $abreviatura, $idfuncionalidad, null
        ) > 0)
            throw new ZendExt_Exception('SEGREC003');
        return true;
    }

    /**
     * @method modificarRecurso - Válida que la denominación de un recurso
     *  no se repita dentro de una misma funcionalidad una ves que 
     * este es modificado.
     * @return TRUE | ZendExt_Exception
     */
    public function modificarRecurso()
    {
        $denominacion = $_POST['denominacion'];
        $abreviatura = $_POST['abreviatura'];
        $idfuncionalidad = $_POST['idfuncionalidad'];
        $idrecurso = $_POST['idrecurso'];
        $datRecurso = Doctrine::getTable('DatRecurso')->find($idrecurso);
        if ($datRecurso->denominacion != $denominacion) {
            if (DatRecurso::verificarRecurso(
                'denominacion', $denominacion, $idfuncionalidad, $idrecurso
            ) > 0)
                throw new ZendExt_Exception('SEGREC002');
        }
        if ($datRecurso->abreviatura != $abreviatura) {
            if (DatRecurso::verificarRecurso(
                'abreviatura', $abreviatura, $idfuncionalidad, $idrecurso
            ) > 0)
                throw new ZendExt_Exception('SEGREC003');
        }
        return true;
    }

    /**
     * @method validarRecurso - Válida que el recurso modificado no 
     * se quede sin acciones.
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
            && count($arrayNodesDel[0]->acciones) == count($arrayRecursos))
            return false;
        return true;
    }

}
