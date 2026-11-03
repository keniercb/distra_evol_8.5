<?php

/**
 * Componente para gestionar las unidades de medida de los subsistemas.
 *
 * @package    Configuración
 * @subpackage Unidadmedida/Models/Bussines
 * @copyright  XETID
 * @version    1.0
 */
class DatConversionModel extends ZendExt_Model
{

    /**
     * Constuctor de la clase
     */
    public function setUp() 
    {
        parent::ZendExt_Model();
    }

    /**
     * Insertar unidad de medida
     *
     * @param DatConversion $nom_unidadmedida_nom_unidadmedida Nomenclador unidad de medida
     * 
     */
    public function insertarnom_unidadmedida_nom_unidadmedida(
        DatConversion $datconversion
            ) 
    {
        $auxconversion = Doctrine::getTable('DatConversion')
         ->find(
                 array(
                     $datconversion->idunidadmedida,
                     $datconversion->idunidadmedidaconversion
                )
                 );
        if ($auxconversion) {
            $auxconversion->factorconversion = $datconversion->factorconversion;
            $auxconversion->save();
        } else {
            $datconversion->save();
        }
    }

    /**
     * Modificar unidad de medida
     *
     * @param object $nom_unidadmedida_nom_unidadmedida Objeto de tipo unidad de medida
     * 
     */
    public function modificarnom_unidadmedida_nom_unidadmedida($datconversion)
    {
        $datconversion->save();
    }

    /**
     * Eliminar unidad de medida
     *
     * @param object $nom_unidadmedida_nom_unidadmedida Objeto de tipo unidad de medida
     * 
     */
    public function eliminarnom_unidadmedida_nom_unidadmedida($datconversion)
    {
        $datconversion->delete();
    }

}

