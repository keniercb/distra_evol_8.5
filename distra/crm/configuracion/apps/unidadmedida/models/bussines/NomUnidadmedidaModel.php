<?php

/**
 * Componente para gestionar las unidades de medida de los subsistemas.
 *
 * @package    Configuración
 * @subpackage Unidadmedida/Models/Bussines
 * @copyright  XETID
 * @version    1.0
 */
class NomUnidadmedidaModel extends ZendExt_Model
{

    /**
     * Constuctor de la clase
     */
    public function setUp() 
    {
        parent::ZendExt_Model();
    }

    /**
     * Insertar y modificar unidad de medida
     *
     * @param NomUnidadmedida $nomunidadmedida Nomenclador unidad de medida
     * @return int Retorna el id de la unidad de medida insertada
     */
    public function insertar_modificar_nom_unidadmedida(NomUnidadmedida $nomunidadmedida) 
    {
        $auxunidadmedida = Doctrine::getTable('NomUnidadmedida')->find($nomunidadmedida->idunidadmedida);
        if ($auxunidadmedida) {
            $auxunidadmedida->idmagnitud = $nomunidadmedida->idmagnitud;
            $auxunidadmedida->abreviaturaunidadmedida = $nomunidadmedida->abreviaturaunidadmedida;
            $auxunidadmedida->denominacionunidadmedida = $nomunidadmedida->denominacionunidadmedida;
            $auxunidadmedida->descripcionunidadmedida = $nomunidadmedida->descripcionunidadmedida;
            $auxunidadmedida->fechafin = $nomunidadmedida->fechafin;
            $auxunidadmedida->fechainicio = $nomunidadmedida->fechainicio;
            $auxunidadmedida->decimales = $nomunidadmedida->decimales;
            $auxunidadmedida->save();
            return false;
        } else {
            $nomunidadmedida->save();
            return $nomunidadmedida->idunidadmedida;
        }
    }

    /**
     * Deshabilitar unidad de medida
     *
     * @param object $nomunidadmedida Objeto de tipo unidad de medida
     */
    public function deshabilitarUnidadMedida($nomunidadmedida) 
    {
        $nomunidadMedida = Doctrine::getTable('NomUnidadmedida')->find($nomunidadmedida->idunidadmedida);
        $nomunidadMedida->fechafin = date('d/m/Y', strtotime('-1 day'));
        if ($nomunidadMedida->fechainicio > $nomunidadMedida->fechafin)
            $nomunidadMedida->fechainicio = date('d/m/Y', strtotime('-1 day'));

        $nomunidadMedida->save();
    }

    /**
     * Eliminar nomenclador unidad de medida
     *
     * @param NomUnidadmedidaModel $nomunidadmedida Objeto de tipo unidad de medida
     * @return boolean Devuelve verdadero en caso de eliminar la unidad de medida falso en otro caso
     * @throws Doctrine_Exception $de
     */
    public function eliminar_nom_unidadmedida(NomUnidadmedida $nomunidadmedida) 
    {
        try {
            $nomunidadmedida = Doctrine::getTable('NomUnidadmedida')->find($nomunidadmedida->idunidadmedida);
            $nomunidadmedida->delete();
            return true;
        } catch (Doctrine_Exception $de) {
            if ($de->getCode() == 23503) {
                return false;
            }
        }
    }

}

