<?php

/**
 * @name DatFamiliarModel - Clase de logica de negocio para la gestion de familiares de la persona
 * @package   personaext
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class DatFamiliarSegundoModel extends ZendExt_Model implements IConceptoExport
{
    /**
     * Constructor de la clase
     */
    public function init()
    {
        parent::ZendExt_Model();
    }

    /**
     * @method obtenerFamiliarPorPersona - Devuelve los familiares de la persona.
     * @params $idpersona - Identificador de la persona.
     * @return stdClass - Familiares de la persona.
     * @author Orestes Rodríguez Lorenzo
     */
    public function obtenerFamiliarPorPersona($idpersona)
    {

        $result = new stdClass();
        try {
            $result->data = DatFamiliar::obtenerFamiliarPorPersona($idpersona);
            return $result;
        } catch (Exception $e) {
            $result->error = $e;
            return $result;
        }
    }

    /**
     * @method adicionarFamiliar - Funcion para adicionar familiares a una persona
     * @param $idpersona - Identificador de la persona
     * @param $arrFamiliar - Arreglo de familiares a adicionar
     * @return stdClass
     * @author Orestes Rodríguez Lorenzo
     */
    public function adicionarFamiliar($idpersona, $arrFamiliar)
    {
        $result = new stdClass();
        try {
            foreach ($arrFamiliar as $v) {
                $obj = new DatFamiliar();
                $obj->nombre = $v->nombre;
                $obj->idparentesco = $v->idparentesco;
                $obj->allegado = $v->allegado ? 1 : 0;
                $obj->conviven = $v->conviven ? 1 : 0;
                $obj->observaciones = $v->observaciones;
                $obj->idpersona = $idpersona;
                $obj->save();
            }
        } catch (Exception $e) {
            print_r($e->getMessage());die;
            $result->error = $e;
            return $result;
        }

    }

    /**
     * @method modificarFamiliar - Funcion para modificar familiares de una persona
     * @param $idpersona - Identificador de la persona
     * @param $arrFamiliar - Arreglo de familiares a modificar
     * @return stdClass
     * @author Orestes Rodríguez Lorenzo
     */
    public function modificarFamiliar($idpersona, $arrFamiliar)
    {
        $result = new stdClass();
        try {
            foreach ($arrFamiliar as $v) {
                $obj = DatFamiliar::obtenerPorId($v->idfamiliar);
                $obj->nombre = $v->nombre;
                $obj->idparentesco = $v->idparentesco;
                $obj->allegado = $v->allegado ? 1 : 0;
                $obj->conviven = $v->conviven ? 1 : 0;
                $obj->observaciones = $v->observaciones;
                $obj->idpersona = $idpersona;
                $obj->save();
            }
        } catch (Exception $e) {
            $result->error = $e;
            return $result;
        }
    }

    /**
     * @method eliminarFamiliar - Funcion para eliminar familiares de una persona
     * @param $arrFamiliar - Arreglo de familiares a eliminar
     * @return stdClass
     * @author Orestes Rodríguez Lorenzo
     */
    public function eliminarFamiliar($arrFamiliar)
    {
        $result = new stdClass();
        try {
            foreach ($arrFamiliar as $v) {
                $familiar = DatFamiliar::obtenerPorId($v);
                $familiar->delete();
            }
        } catch (Exception $e) {
            $result->error = $e;
            return $result;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('dfam.*')->leftJoin($baseAlias . '.DatFamiliar dfam');
    }
}